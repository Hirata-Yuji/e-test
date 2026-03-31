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
import fitz  # PyMuPDF
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


def extract_text_from_pdf(pdf_path):
    """PDFからテキストを抽出"""
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text


def extract_images_from_pdf(pdf_path):
    """PDFから画像を抽出してbase64エンコードで返す"""
    doc = fitz.open(pdf_path)
    images = []
    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images(full=True)
        for img_idx, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            if base_image:
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                mime_type = f"image/{image_ext}" if image_ext != "jpg" else "image/jpeg"
                b64 = base64.b64encode(image_bytes).decode("utf-8")
                images.append({
                    "base64": b64,
                    "mime_type": mime_type,
                    "page": page_num + 1,
                })
    doc.close()
    return images


def render_pdf_page_as_image(pdf_path, page_num=0, dpi=200):
    """PDFページを画像としてレンダリング"""
    doc = fitz.open(pdf_path)
    if page_num >= len(doc):
        doc.close()
        return None
    page = doc[page_num]
    mat = fitz.Matrix(dpi / 72, dpi / 72)
    pix = page.get_pixmap(matrix=mat)
    image_bytes = pix.tobytes("png")
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    doc.close()
    return {"base64": b64, "mime_type": "image/png"}


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


def analyze_face_with_claude(images, pdf_page_image=None):
    """Claude API Visionで人相学鑑定を行う"""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return {"error": "ANTHROPIC_API_KEY が設定されていません。.envファイルにAPIキーを設定してください。"}

    client = anthropic.Anthropic(api_key=api_key)

    content = []

    # まず埋め込み画像があれば送る
    if images:
        for img in images[:3]:  # 最大3枚
            content.append({
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": img["mime_type"],
                    "data": img["base64"],
                },
            })

    # PDFページ画像も送る（顔写真が埋め込み画像として抽出できない場合のフォールバック）
    if pdf_page_image:
        content.append({
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": pdf_page_image["mime_type"],
                "data": pdf_page_image["base64"],
            },
        })

    if not content:
        return {"error": "画像が見つかりませんでした。"}

    content.append({
        "type": "text",
        "text": """あなたは東洋の人相学（観相学）の専門家です。
提供された履歴書の写真から、人相学に基づいた人物鑑定を行ってください。

以下の観点から詳細に分析してください：

1. **顔の輪郭・骨格**（面相）
   - 顔の形（丸顔・面長・角顔・逆三角形など）から読み取れる性格傾向
   - 額の広さ・形から読み取れる知性・運勢

2. **目・眉**
   - 目の大きさ・形・目力から読み取れる意志力・性格
   - 眉の形・濃さから読み取れる性格・運勢

3. **鼻・口**
   - 鼻の形・大きさから読み取れる金運・仕事運
   - 口の形・大きさから読み取れる対人関係・表現力

4. **全体的な印象**
   - 表情から読み取れる内面の傾向
   - 全体のバランスから読み取れる運勢

5. **総合鑑定**
   - 仕事適性
   - 対人関係の傾向
   - 今後の運勢のアドバイス

※人相学は東洋の伝統的な観相術に基づいた文化的な鑑定です。エンターテイメントとしてお楽しみください。
※写真が不鮮明な場合や、顔が確認できない場合は、その旨を伝えてください。

JSON形式で以下の構造で回答してください：
{
    "顔の輪郭分析": "...",
    "目と眉の分析": "...",
    "鼻と口の分析": "...",
    "全体的な印象": "...",
    "仕事適性": "...",
    "対人関係": "...",
    "運勢アドバイス": "...",
    "総合鑑定": "..."
}""",
    })

    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2000,
            messages=[{"role": "user", "content": content}],
        )
        result_text = response.content[0].text

        # JSONを抽出
        json_match = re.search(r'\{[\s\S]*\}', result_text)
        if json_match:
            return json.loads(json_match.group())
        return {"総合鑑定": result_text}

    except Exception as e:
        return {"error": f"Claude API エラー: {str(e)}"}


def generate_combined_analysis(shichusuimei_result, kyusei_result, face_result):
    """Claude APIで総合鑑定を生成"""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return "ANTHROPIC_API_KEY が設定されていません。"

    client = anthropic.Anthropic(api_key=api_key)

    prompt = f"""あなたは東洋占術の総合鑑定師です。以下の3つの鑑定結果を総合して、この人物の詳細な総合鑑定を行ってください。

## 四柱推命の鑑定結果
- 日主（日干）: {shichusuimei_result.get('日主', '')}（{shichusuimei_result.get('日主の五行', '')}・{shichusuimei_result.get('日主の陰陽', '')}）
- 性格特性: {json.dumps(shichusuimei_result.get('日主の性格', {}), ensure_ascii=False)}
- 五行バランス: {json.dumps(shichusuimei_result.get('五行バランス', {}), ensure_ascii=False)}
- 五行分析: {shichusuimei_result.get('五行分析', '')}
- 通変星: {json.dumps(shichusuimei_result.get('通変星', {}), ensure_ascii=False)}
- 十二運: {json.dumps(shichusuimei_result.get('十二運', {}), ensure_ascii=False)}

## 九星気学の鑑定結果
- 本命星: {kyusei_result.get('本命星', '')}
- 月命星: {kyusei_result.get('月命星', '')}
- 日命星: {kyusei_result.get('日命星', '')}
- 本命星の詳細: {json.dumps(kyusei_result.get('本命星の詳細', {}), ensure_ascii=False)}

## 人相学の鑑定結果
{json.dumps(face_result, ensure_ascii=False)}

以上の3つの鑑定結果を総合し、以下の項目について詳細な総合鑑定文を作成してください：

1. **この人物の本質**（四柱推命の日主と九星気学の本命星を中心に）
2. **性格の多面性**（表の顔・裏の顔・本質的な性格）
3. **仕事・適職**（四柱推命の通変星と人相学から）
4. **対人関係・コミュニケーション**
5. **強みと課題**
6. **開運アドバイス**
7. **採用担当者へのコメント**（この人物がチームにもたらす価値）

※東洋占術に基づいたエンターテイメント鑑定であることを最後に付記してください。
鑑定文は丁寧で読みやすい日本語で書いてください。"""

    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=3000,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text
    except Exception as e:
        return f"総合鑑定の生成中にエラーが発生しました: {str(e)}"


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

    # ファイル保存
    filename = f"resume_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    try:
        # 1. テキスト抽出・生年月日解析
        text = extract_text_from_pdf(filepath)
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
                "text_extracted": text[:500],
            }), 400

        year, month, day = birthdate

        # 2. 四柱推命鑑定
        shichusuimei_result = shichusuimei.analyze(year, month, day, gender)

        # 3. 九星気学鑑定
        kyusei_result = kyusei.analyze(year, month, day)

        # 4. 画像抽出・人相学鑑定
        images = extract_images_from_pdf(filepath)
        pdf_page_image = render_pdf_page_as_image(filepath, page_num=0)
        face_result = analyze_face_with_claude(images, pdf_page_image)

        # 5. 総合鑑定
        combined = generate_combined_analysis(shichusuimei_result, kyusei_result, face_result)

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
        return jsonify({"error": f"鑑定中にエラーが発生しました: {str(e)}"}), 500

    finally:
        # アップロードファイル削除
        if os.path.exists(filepath):
            os.remove(filepath)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
