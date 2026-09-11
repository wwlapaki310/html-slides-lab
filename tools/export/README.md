# エクスポートツール（Phase2）

スライドを PDF / PPTX に変換するスクリプト置き場。

| ファイル | 役割 | 依存 |
|---|---|---|
| `export-pdf.mjs` | 全スライドを Decktape で PDF 化して `exports/` に出力 | Node.js 18+（decktapeはnpxで自動取得） |
| `pdf_to_pptx.py` | PDFの各ページを画像化し、1ページ=1スライドのPPTXに変換 | `pip install pymupdf python-pptx` |
| `build-index.mjs` | `YYYY/*/index.html` を走査し、公開トップページ（ルートの`index.html`）を生成 | Node.js 18+ |

CI（[`.github/workflows/export.yml`](../../.github/workflows/export.yml)）が push をトリガーに
`export-pdf.mjs` を実行し、生成物を `exports/` にコミットする。

## ローカルで実行する

```bash
# 全スライドをPDF化（リポジトリルートに一時的な静的サーバが立つ）
node tools/export/export-pdf.mjs

# 個別のスライドだけ
node tools/export/export-pdf.mjs 2026/sample-slide

# PDF -> PPTX
pip install pymupdf python-pptx
python tools/export/pdf_to_pptx.py exports

# 公開トップページ（索引）を再生成
node tools/export/build-index.mjs
```

ルートの `index.html` は `build-index.mjs` の生成物なので、**手で編集しない**。
索引の見出しには各スライドの `<title>` が使われるため、タイトルを変えたい場合は
そのスライドの `index.html` の `<title>` を直す。

出力は `exports/2026/sample-slide.pdf` のように、スライドのフォルダ構成をそのまま反映する。

### 環境変数

| 変数 | 既定値 | 説明 |
|---|---|---|
| `EXPORT_PORT` | `8099` | 一時静的サーバのポート |
| `EXPORT_SIZE` | `1920x1080` | 出力解像度 |
| `DECKTAPE_VERSION` | `3.14.0` | 使用する decktape のバージョン |

## 注意点

- **フラグメント**（`class="fragment"`）は Decktape の既定動作で1ステップ=1ページに展開される。
  配布用に1スライド1ページへまとめたい場合は、そのスライドのフラグメントを外す。
- **PPTXは画像貼り付け**になるため、PowerPoint上でテキストを直接編集することはできない。
  配布・共有用途なら十分だが、編集が必要なら手動移植する。
- **手軽にPDFが欲しいだけ**なら、公開URLの末尾に `?pdf` を付けてChromeで印刷する方法で足りる
  （インストール不要・CI不要）。Decktapeは「pushしたら自動で最新PDFが置かれている」状態を作るためのもの。

## Googleスライドに持っていく

1. `exports/` のPDF（またはPPTX）をGoogleドライブにアップロード
2. 右クリック →「アプリで開く」→ Googleスライド

Google Slides API による完全自動化は Phase3 で検討（未着手）。
