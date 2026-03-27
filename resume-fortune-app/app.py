"""
履歴書PDF鑑定Webアプリ
- 四柱推命・九星気学による人物鑑定（サーバー側で即座に計算）
- Claude API Visionによる人相学鑑定（フロントから直接呼び出し）
- 総合鑑定（フロントから直接呼び出し）
"""

import os
import re
import json
import traceback
from datetime import datetime

from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

import shichusuimei
import kyusei

load_dotenv()

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5MB


@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "ファイルサイズが大きすぎます（最大5MB）"}), 413


@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({"error": f"エラー: {str(e)}"}), 500


def parse_birthdate(text):
    """テキストから生年月日を抽出"""
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


@app.route("/")
def index():
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    return render_template("index.html", api_key=api_key)


@app.route("/analyze", methods=["POST"])
def analyze():
    """四柱推命・九星気学の鑑定（サーバー側で即座に計算・API呼び出しなし）"""
    try:
        form_birthdate = request.form.get("birthdate")
        form_gender = request.form.get("gender", "不明")

        if not form_birthdate:
            return jsonify({"error": "生年月日を入力してください。"}), 400

        bd = datetime.strptime(form_birthdate, "%Y-%m-%d")
        year, month, day = bd.year, bd.month, bd.day
        gender = form_gender if form_gender != "auto" else "不明"

        # 四柱推命鑑定
        shichusuimei_result = shichusuimei.analyze(year, month, day, gender)

        # 九星気学鑑定
        kyusei_result = kyusei.analyze(year, month, day)

        return jsonify({
            "birthdate": f"{year}年{month}月{day}日",
            "gender": gender,
            "shichusuimei": shichusuimei_result,
            "kyusei": kyusei_result,
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"鑑定エラー: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
