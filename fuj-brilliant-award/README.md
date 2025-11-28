# FUJ Brilliant AWARD 2026 - WEBサイト

## 概要
「FUJ Brilliant AWARD 2026」の企業賞を紹介するWEBサイトです。
Adobe XDのデザインを基に、レスポンシブ対応のHTMLサイトとして制作しました。

## サイトコンセプト
**未来を照らす、輝きの証。**

革新性と社会貢献を両立させた企業を表彰し、その活躍を広く発信するプラットフォームです。

## ファイル構成

```
fuj-brilliant-award/
├── index.html           # トップページ（企業賞一覧）
├── company.html         # 企業詳細ページ
├── css/
│   └── style.css        # メインスタイルシート
├── js/
│   └── script.js        # JavaScript（アニメーション・インタラクション）
├── images/              # 画像フォルダ（必要に応じて追加）
└── README.md            # このファイル
```

## ページ構成

### 1. トップページ (index.html)
- **ヘッダー**
  - ロゴ
  - ナビゲーション（企業賞とは / 企業一覧）
  
- **ヒーローセクション**
  - 赤いスターグラフィック
  - タイトル「FUJ Brilliant AWARD 2026」
  - キャッチコピー「未来を照らす、輝きの証。」

- **企業賞セクション**
  - 2026年度 FUJブリリアント企業賞
  - 受賞企業カード（3列グリッドレイアウト）
  - 各カードに日付、企業ロゴ、企業名を表示

- **企業賞とはセクション**
  - FUJブリリアント企業賞の説明
  - 企業理念とミッション

- **フッター**
  - コピーライト表記

### 2. 企業詳細ページ (company.html)
- **ページヒーロー**
  - 企業キャッチコピー
  
- **企業バッジ**
  - 受賞日時
  - 企業ロゴ
  - 企業名・回数

- **企業ストーリー**
  - 企業の取り組み紹介
  - 代表者の写真
  - 企業理念と特徴

- **企業情報ボックス**
  - 会社概要
  - 設立年、代表者、URL、所在地など

- **戻るボタン**
  - 企業一覧へ戻るリンク

## デザイン仕様

### カラーパレット
```css
--primary-navy: #1a2757      /* メインネイビー */
--secondary-navy: #0d1a3d    /* ダークネイビー */
--accent-red: #c41e3a        /* アクセントレッド */
--light-gray: #f5f5f5        /* 背景グレー */
--white: #ffffff             /* ホワイト */
--black: #333333             /* テキストブラック */
```

### タイポグラフィ
- **日本語フォント**: Noto Sans JP (Google Fonts)
- **明朝体**: Noto Serif JP (キャッチコピー用)
- **ウェイト**: 300, 400, 500, 700, 900

### レイアウト
- **コンテナ幅**: 1200px
- **グリッドシステム**: 3列（タブレット: 2列、モバイル: 1列）
- **レスポンシブブレークポイント**:
  - デスクトップ: 1024px以上
  - タブレット: 768px〜1024px
  - モバイル: 768px以下

## 主要機能

### 1. スムーススクロール
- アンカーリンクをクリックするとスムーズにスクロール
- ヘッダーの高さを考慮した正確な位置へ移動

### 2. スクロールアニメーション
- 画面に要素が入るとフェードイン＆スライドアップ
- Intersection Observer APIを使用

### 3. インタラクティブカード
- 企業カードにホバーで浮き上がる効果
- クリックで企業詳細ページへ遷移

### 4. レスポンシブナビゲーション
- モバイル表示時にハンバーガーメニュー表示
- メニューの開閉アニメーション

### 5. ヘッダー固定
- スクロールに応じてヘッダーが固定表示
- スクロール量に応じてシャドウが変化

## セットアップ方法

### 1. ファイルの配置
```bash
# ダウンロード・解凍後、フォルダ構造を確認
fuj-brilliant-award/
├── index.html
├── company.html
├── css/style.css
├── js/script.js
└── images/ (画像を配置)
```

### 2. ローカルで確認
```bash
# 方法1: ブラウザで直接開く
index.htmlをダブルクリック

# 方法2: ローカルサーバーで実行（推奨）
# Python 3の場合
python -m http.server 8000

# Node.jsの場合
npx http-server

# ブラウザで http://localhost:8000 にアクセス
```

### 3. 画像の追加
- `images/`フォルダに実際の画像を配置
- `company.html`内の以下を置き換え:
  - `images/company-person.jpg` - 企業担当者の写真
  - `images/company-building.jpg` - 企業ビルの写真

## カスタマイズ方法

### 企業ロゴの変更
```html
<!-- index.html内 -->
<div class="company-logo sample-logo-1">
    <span class="logo-letter">S</span>
</div>
```
- 実際の企業ロゴ画像に置き換える場合:
```html
<div class="company-logo">
    <img src="images/company-logo-1.png" alt="企業名">
</div>
```

### 企業情報の更新
```html
<!-- company.html内の企業情報ボックス -->
<div class="company-info-box">
    <h3 class="info-title">【企業情報】</h3>
    <div class="info-content">
        <p><strong>企業名を入力</strong></p>
        <p>設立: 20XX年XX月XX日設立</p>
        <!-- その他の情報を更新 -->
    </div>
</div>
```

### カラーの変更
```css
/* css/style.css の :root セクション */
:root {
    --primary-navy: #1a2757;   /* お好みの色に変更 */
    --accent-red: #c41e3a;     /* お好みの色に変更 */
}
```

### 企業カードの追加
```html
<!-- index.htmlのaward-grid内に追加 -->
<div class="award-card">
    <div class="award-badge">
        <div class="award-icon">▶</div>
        <div class="award-date">
            <span class="award-month">1 November 2025</span>
            <span class="award-category">Company's award</span>
        </div>
    </div>
    <div class="award-logo">
        <div class="company-logo sample-logo-10">
            <span class="logo-letter">新</span>
        </div>
    </div>
    <div class="award-info">
        <p class="company-name">新規企業株式会社</p>
        <p class="award-title">第1回</p>
        <p class="award-round">〇〇〇〇〇</p>
    </div>
</div>
```

## ブラウザ対応
- Chrome（最新版）
- Firefox（最新版）
- Safari（最新版）
- Edge（最新版）
- モバイルブラウザ対応

## 技術スタック
- HTML5
- CSS3（Flexbox, Grid, カスタムプロパティ）
- JavaScript（ES6+）
- Google Fonts（Noto Sans JP, Noto Serif JP）
- Intersection Observer API

## パフォーマンス最適化
- Google Fontsのpreconnect設定
- CSS GridとFlexboxによる効率的なレイアウト
- Intersection Observer APIによる効率的なアニメーション
- 最小限のJavaScript使用

## 今後の拡張案
1. **CMSとの連携**
   - WordPress等のCMSと連携し、企業情報を動的に管理

2. **検索・フィルタリング機能**
   - 企業名や業種での検索機能追加

3. **多言語対応**
   - 英語版ページの追加

4. **アニメーション強化**
   - より洗練されたトランジション効果

5. **ソーシャルシェア機能**
   - Twitter、Facebookでのシェアボタン追加

## ライセンス
© 2025 FUJ Brilliant AWARD. All Rights Reserved.

## お問い合わせ
ご不明な点やカスタマイズのご相談がございましたら、お気軽にお問い合わせください。

---

**制作日**: 2025年11月27日  
**デザインソース**: Adobe XD  
**コーディング**: HTML5 / CSS3 / JavaScript