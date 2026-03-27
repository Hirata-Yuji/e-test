"""
履歴書PDF鑑定Webアプリ
- 四柱推命・九星気学による人物鑑定
- Claude API Visionによる人相学鑑定
- 総合鑑定
"""

import os
import re
import json
import base64
import traceback
from datetime import datetime

from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import anthropic

import shichusuimei
import kyusei

load_dotenv()

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = os.path.join("/tmp", "resume_uploads")
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "ファイルサイズが大きすぎます（最大16MB）"}), 413


@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": f"サーバー内部エラー: {str(e)}"}), 500


@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({"error": f"予期しないエラー: {str(e)}"}), 500


def extract_text_from_pdf_bytes(pdf_bytes):
    """PDFバイナリからテキストを抽出（軽量版 - PyMuPDFを使わない）"""
    # PDFバイナリからテキストを正規表現で抽出する簡易パーサー
    text = ""
    try:
        # PDFストリーム内のテキストを抽出
        content = pdf_bytes.decode("latin-1")
        # BT...ET ブロック内の Tj/TJ オペレータからテキスト抽出
        bt_blocks = re.findall(r'BT(.*?)ET', content, re.DOTALL)
        for block in bt_blocks:
            # (text) Tj パターン
            texts = re.findall(r'\((.*?)\)\s*Tj', block)
            text += "".join(texts)
            # [(text)] TJ パターン
            tj_arrays = re.findall(r'\[(.*?)\]\s*TJ', block)
            for arr in tj_arrays:
                parts = re.findall(r'\((.*?)\)', arr)
                text += "".join(parts)
    except Exception:
        pass

    # UTF-16でエンコードされたテキストも試行
    try:
        utf16_texts = re.findall(b'<FEFF([0-9A-Fa-f]+)>', pdf_bytes)
        for hex_text in utf16_texts:
            try:
                decoded = bytes.fromhex(hex_text.decode("ascii")).decode("utf-16-be")
                text += decoded
            except Exception:
                pass
    except Exception:
        pass

    return text


def parse_birthdate(text):
    """テキストから生年月日を抽出"""
    # 和暦パターン
    wareki_patterns = [
        r'(昭和|平成|令和)\s*(\d{1,2})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日',
        r'(昭和|平成|令和)(\d{1,2})年(\d{1,2})月(\d{1,2})日',
    ]
    for pattern in wareki_patterns:
        match = re.search(pattern, text)
        if match:
            era, y, m, d = match.groups()
            y, m, d = int(y), int(m), int(d)
            if era == "昭和":
                y += 1925
            elif era == "平成":
                y += 1988
            elif era == "令和":
                y += 2018
            return y, m, d

    # 西暦パターン
    seireki_patterns = [
        r'(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日',
        r'(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})',
    ]
    for pattern in seireki_patterns:
        match = re.search(pattern, text)
        if match:
            y, m, d = int(match.group(1)), int(match.group(2)), int(match.group(3))
            if 1900 <= y <= 2100:
                return y, m, d

    return None


def parse_gender(text):
    """テキストから性別を推定"""
    if "男" in text:
        return "男"
    elif "女" in text:
        return "女"
    return "不明"


def analyze_all_with_claude(pdf_base64, shichusuimei_result, kyusei_result):
    """Claude API 1回で人相学＋総合鑑定をまとめて実行（時間短縮）"""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        face = {"error": "ANTHROPIC_API_KEY が設定されていません。環境変数にAPIキーを設定してください。"}
        return face, "ANTHROPIC_API_KEY が設定されていません。"

    client = anthropic.Anthropic(api_key=api_key)

    fortune_context = f"""## 四柱推命の鑑定結果
- 日主（日干）: {shichusuimei_result.get('日主', '')}（{shichusuimei_result.get('日主の五行', '')}・{shichusuimei_result.get('日主の陰陽', '')}）
- 性格特性: {json.dumps(shichusuimei_result.get('日主の性格', {}), ensure_ascii=False)}
- 五行バランス: {json.dumps(shichusuimei_result.get('五行バランス', {}), ensure_ascii=False)}
- 通変星: {json.dumps(shichusuimei_result.get('通変星', {}), ensure_ascii=False)}

## 九星気学の鑑定結果
- 本命星: {kyusei_result.get('本命星', '')}
- 月命星: {kyusei_result.get('月命星', '')}
- 日命星: {kyusei_result.get('日命星', '')}
- 本命星の詳細: {json.dumps(kyusei_result.get('本命星の詳細', {}), ensure_ascii=False)}"""

    content = [
        {
            "type": "document",
            "source": {
                "type": "base64",
                "media_type": "application/pdf",
                "data": pdf_base64,
            },
        },
        {
            "type": "text",
            "text": f"""あなたは東洋占術（四柱推命・九星気学・人相学）の総合鑑定師です。
提供された履歴書PDFと以下の占術データを元に、2つのセクションに分けて鑑定してください。

{fortune_context}

---

【セクション1: 人相学鑑定】
履歴書の顔写真から人相学に基づいた鑑定を行い、以下のJSON形式で出力してください。
写真が確認できない場合は、確認できない旨を各項目に記載してください。

```json
{{
    "顔の輪郭分析": "...",
    "目と眉の分析": "...",
    "鼻と口の分析": "...",
    "全体的な印象": "...",
    "仕事適性": "...",
    "対人関係": "...",
    "運勢アドバイス": "...",
    "総合鑑定": "..."
}}
```

【セクション2: 総合人物鑑定】
四柱推命・九星気学・人相学の3つを統合した総合鑑定文を以下の項目で作成してください：
1. この人物の本質
2. 性格の多面性
3. 仕事・適職
4. 対人関係・コミュニケーション
5. 強みと課題
6. 開運アドバイス
7. 採用担当者へのコメント

※東洋占術に基づいたエンターテイメント鑑定であることを最後に付記してください。

必ず「===SECTION1===」と「===SECTION2===」で2つのセクションを区切ってください。""",
        },
    ]

    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4000,
            messages=[{"role": "user", "content": content}],
        )
        result_text = response.content[0].text

        # セクション分割
        face_result = {}
        combined_text = result_text

        if "===SECTION1===" in result_text and "===SECTION2===" in result_text:
            parts = result_text.split("===SECTION2===")
            section1 = parts[0].replace("===SECTION1===", "").strip()
            combined_text = parts[1].strip() if len(parts) > 1 else result_text

            json_match = re.search(r'\{[\s\S]*?\}', section1)
            if json_match:
                try:
                    face_result = json.loads(json_match.group())
                except json.JSONDecodeError:
                    face_result = {"総合鑑定": section1}
            else:
                face_result = {"総合鑑定": section1}
        else:
            json_match = re.search(r'\{[\s\S]*?\}', result_text)
            if json_match:
                try:
                    face_result = json.loads(json_match.group())
                except json.JSONDecodeError:
                    pass

        return face_result, combined_text

    except Exception as e:
        return {"error": f"Claude API エラー: {str(e)}"}, f"Claude APIエラー: {str(e)}"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    if "pdf" not in request.files:
        return jsonify({"error": "PDFファイルが選択されていません"}), 400

    file = request.files["pdf"]
    if file.filename == "":
        return jsonify({"error": "ファイルが選択されていません"}), 400

    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "PDFファイルのみアップロード可能です"}), 400

    try:
        step = "PDF読み込み"
        # PDFをメモリ上で読み込み（ファイル保存しない）
        pdf_bytes = file.read()
        pdf_base64 = base64.b64encode(pdf_bytes).decode("utf-8")

        # 1. テキスト抽出・生年月日解析
        step = "PDF解析"
        text = extract_text_from_pdf_bytes(pdf_bytes)
        birthdate = parse_birthdate(text)
        gender = parse_gender(text)

        # フォームから生年月日が指定されている場合はそちらを優先
        form_birthdate = request.form.get("birthdate")
        form_gender = request.form.get("gender")

        if form_birthdate:
            try:
                bd = datetime.strptime(form_birthdate, "%Y-%m-%d")
                birthdate = (bd.year, bd.month, bd.day)
            except ValueError:
                pass

        if form_gender and form_gender != "auto":
            gender = form_gender

        if not birthdate:
            return jsonify({
                "error": "生年月日を読み取れませんでした。手動で入力してください。",
                "text_extracted": text[:500] if text else "(テキスト抽出不可)",
            }), 400

        year, month, day = birthdate

        # 2. 四柱推命鑑定
        step = "四柱推命鑑定"
        shichusuimei_result = shichusuimei.analyze(year, month, day, gender)

        # 3. 九星気学鑑定
        step = "九星気学鑑定"
        kyusei_result = kyusei.analyze(year, month, day)

        # 4+5. 人相学＋総合鑑定を1回のAPI呼び出しで実行
        step = "AI鑑定（Claude API）"
        face_result, combined = analyze_all_with_claude(pdf_base64, shichusuimei_result, kyusei_result)

        # メモリ解放
        del pdf_bytes
        del pdf_base64

        # レスポンス
        result = {
            "birthdate": f"{year}年{month}月{day}日",
            "gender": gender,
            "shichusuimei": shichusuimei_result,
            "kyusei": kyusei_result,
            "face_analysis": face_result,
            "combined_analysis": combined,
        }

        return jsonify(result)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"「{step}」でエラーが発生しました: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
