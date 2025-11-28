# 株式会社カンパニー - コーポレートサイト

## 概要
株式会社カンパニーのコーポレートサイトです。
広告代理業、PR事業、WEBマーケティング事業を展開する企業のWEBサイトとして構築されています。

## 会社情報
- **会社名**: 株式会社カンパニー
- **代表者**: 代表取締役　佐藤　健
- **所在地**: 〒104-0061 東京都中央区銀座5-13-16
- **資本金**: 90,000,000円
- **事業内容**: 広告代理業、PR事業、WEBマーケティング事業
- **ドメイン**: company-kk.com

## サイト構成

### ファイル構造
```
company-website/
├── index.html          # トップページ
├── aboutus.html        # 会社概要ページ
├── service.html        # サービスページ
├── company.html        # 企業情報ページ
├── contact.html        # お問い合わせページ
├── css/
│   └── style.css       # メインスタイルシート
├── js/
│   └── script.js       # JavaScriptファイル
├── images/             # 画像フォルダ（必要に応じて追加）
└── README.md           # このファイル
```

### ページ一覧
1. **トップページ (index.html)**
   - ヒーローセクション
   - 会社紹介
   - サービス概要
   - ニュース
   - お問い合わせCTA

2. **会社概要 (aboutus.html)**
   - ミッション
   - ビジョン
   - 企業価値

3. **サービス (service.html)**
   - 広告代理業
   - PR事業
   - WEBマーケティング事業
   - サービス提供の流れ

4. **企業情報 (company.html)**
   - 会社情報
   - アクセス
   - 沿革
   - 企業理念

5. **お問い合わせ (contact.html)**
   - お問い合わせフォーム
   - 連絡先情報

## デザインコンセプト

### カラーパレット
- **ベースカラー**: ブルー系（鶯色をベースにしたブルーベース）
- **プライマリーカラー**: #2B5F8F（深いブルー）
- **セカンダリーカラー**: #4A90C5（明るいブルー）
- **アクセントカラー**: #6BAED6（ライトブルー）
- **テイスト**: AI企業らしい先進的で高級感のあるデザイン

### フォント
- **日本語フォント**: Noto Sans JP（Google Fonts）
- **英語フォント**: システムフォント（sans-serif）

### レスポンシブ対応
- デスクトップ（1200px以上）
- タブレット（768px〜1024px）
- スマートフォン（〜768px）

## 使用技術
- HTML5
- CSS3
- JavaScript（ES6+）
- Google Fonts

## セットアップ方法

### 1. ローカル環境での確認
```bash
# フォルダをダウンロード後、index.htmlをブラウザで開く
open index.html
# または
start index.html
```

### 2. ローカルサーバーでの実行（推奨）
```bash
# Python 3の場合
python -m http.server 8000

# Node.jsのhttp-serverを使用する場合
npx http-server

# ブラウザで http://localhost:8000 にアクセス
```

## カスタマイズ方法

### 1. カラーの変更
`css/style.css`の`:root`セクションで変数を変更してください。

```css
:root {
    --primary-blue: #2B5F8F;    /* メインカラー */
    --secondary-blue: #4A90C5;  /* サブカラー */
    --accent-blue: #6BAED6;     /* アクセントカラー */
}
```

### 2. 画像の追加
- `images/`フォルダに画像を配置
- HTMLファイル内の`.image-placeholder`を実際の画像に置き換え

```html
<!-- 変更前 -->
<div class="image-placeholder">
    <div class="placeholder-icon">AI</div>
</div>

<!-- 変更後 -->
<img src="images/your-image.jpg" alt="説明">
```

### 3. コンテンツの編集
各HTMLファイルを直接編集してテキストや構造を変更できます。

### 4. フォームの送信先設定
`contact.html`のフォーム送信機能を実装する場合は、
バックエンドAPIまたはメール送信サービスと連携してください。

## ブラウザ対応
- Chrome（最新版）
- Firefox（最新版）
- Safari（最新版）
- Edge（最新版）

## 注意事項
1. 実際の運用前に、連絡先情報（電話番号など）を正しい情報に更新してください
2. お問い合わせフォームは現在フロントエンドのバリデーションのみです
3. 画像プレースホルダーは実際の画像に置き換えてください
4. Google Mapsを埋め込む場合は、APIキーを取得してください

## ライセンス
© 2024 COMPANY Corporation. All Rights Reserved.

## お問い合わせ
ご不明な点がございましたら、下記までお問い合わせください。
- Email: info@company-kk.com
- TEL: 03-XXXX-XXXX