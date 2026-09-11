# 生成AIでHTMLスライドを作るノウハウ集

## ツール比較メモ（2026年時点）

| ツール | 入力 | 得意なこと | このリポジトリでの位置づけ |
|---|---|---|---|
| **reveal.js** | 生HTML＋Markdown | 生成AIが自由にHTMLを書く運用と相性◎、プレゼン機能・PDF出力が標準搭載 | **採用**（`_template/base`のベース） |
| Marp | Markdown | 素早くPDF/PPTXに変換したい定型資料 | 不採用（生成AIの自由なHTML生成と食い合わせが悪い） |
| Slidev | Markdown+Vue | ライブコードデモ等リッチな開発者向け発表 | 不採用（オーバースペック） |

reveal.jsを選んだ理由は、生成AIに「1枚のHTMLスライドを書いて」と頼むワークフローがそのまま`<section>`単位に対応し、Markdown変換の中間層を挟まなくて済むためです。
さらに、reveal.js自体が公式のMarkdownプラグイン（RevealMarkdown）を持っているため、本編のテキストスライドは`draft.md`という原稿ファイルに書き、`index.html`から`data-markdown`で読み込む方式を採用しています（詳細は[DRAFT_FORMAT.md](DRAFT_FORMAT.md)）。

## 生成AIへの依頼のコツ

依頼は2種類に分けると安定します。

### 1. 原稿執筆モード（draft.mdを編集させる）
- 「`draft.md`に、以下の内容を[DRAFT_FORMAT.md](DRAFT_FORMAT.md)のフォーマットで追記して」と依頼する
- 1回のプロンプトで全スライドを作らせず、「導入」「本編を3〜5枚ずつ」「まとめ」のように分割して依頼すると、構成崩れを防げる
- 画像・動画は生成AI側でパスを推測させず、「`assets/ファイル名`という相対パスで参照して」と明示する
- スピーカーノートが欲しい場合は「`Note:`から始まる行にスピーカー用のメモも入れて」と一言添える

### 2. デザインモード（index.htmlを編集させる）
- 表紙や特別なレイアウトのスライドだけ対象にする
- `_template/base/index.html`をそのままAIに読ませて「このテンプレートの`<section>`を増やす形で」と頼むと、デザインが崩れにくい
- 全体テーマの色やフォントを変えたい場合は`_template/base/css/theme.css`のCSS変数（`--hsl-accent`等）を調整させる

## PDF化の手順（MVP）

1. GitHub PagesでスライドURLを開く
2. URL末尾に `?pdf` を追加してアクセス（例: `.../index.html?pdf`）
3. Chromeの印刷（Ctrl/Cmd+P）→送信先を「PDFに保存」に変更→保存

（`?pdf`は内部的に reveal.js が判定に使う `print-pdf` というクエリ文字列へ自動的に書き換えられる仕組みをテンプレートに組み込み済み）

## 今後追記していくこと

- PPTX変換（Decktape + python-pptx）の具体的な手順
- 動画出力（Playwright + ffmpeg）の具体的な手順
- 実際に生成AIに投げたプロンプト例のログ
