# html-slides-lab

生成AIで作ったHTMLスライドを、年度別フォルダで蓄積していくリポジトリです。
GitHub Pagesで各スライドをそのままブラウザ閲覧・プレゼン発表できます。

**公開トップページ: https://wwlapaki310.github.io/html-slides-lab/**
（スライドを追加すると、CIが年度別の索引ページを自動生成します）

- 要件定義: [docs-internal/REQUIREMENTS.md](docs-internal/REQUIREMENTS.md)
- 原稿(draft.md)フォーマット仕様: [docs-internal/DRAFT_FORMAT.md](docs-internal/DRAFT_FORMAT.md)
- 生成AIノウハウ集: [docs-internal/KNOWHOW.md](docs-internal/KNOWHOW.md)
- 新規スライドの作り方: [`_template/base/`](_template/base/) をコピーして使う

## スライド索引

### 2026

| タイトル | 公開URL | PDF | 作成日 |
|---|---|---|---|
| 機能ショーケース（全機能デモ） | [開く](https://wwlapaki310.github.io/html-slides-lab/2026/feature-showcase/) | [PDF](https://wwlapaki310.github.io/html-slides-lab/exports/2026/feature-showcase.pdf) | 2026-09-11 |
| サンプルスライド | [開く](https://wwlapaki310.github.io/html-slides-lab/2026/sample-slide/) | [PDF](https://wwlapaki310.github.io/html-slides-lab/exports/2026/sample-slide.pdf) | 2026-09-11 |

> 新しいスライドを追加したら、この表に1行追記してください。
> PDFはpush時にCIが自動生成して`exports/`に置くため、リンクだけ書いておけばよい。

## フォルダ構成

```
html-slides-lab/
├── README.md              # この索引
├── index.html             # 公開トップページ（CIが自動生成・手で編集しない）
├── .nojekyll              # Jekyll無効化（_template/ を公開するために必須・消さないこと）
├── docs-internal/         # 要件・原稿フォーマット・ノウハウ等の内部ドキュメント
├── _template/base/        # 新規スライド作成用のベーステンプレート（index.html + draft.md）
├── 2026/                  # 年度別フォルダ（スライドごとに1フォルダ、index.html + draft.md）
├── exports/               # CIが自動生成するPDF/PPTX
├── tools/export/          # PDF/PPTX変換スクリプト
└── .github/workflows/     # push時に自動でPDFを生成するCI
```

## 使い方（新しいスライドを作る）

1. `_template/base/`（または`2026/feature-showcase/`）を `YYYY/スライド名/` にコピーする
2. 本編のテキストは `draft.md` を生成AIと一緒に編集する（フォーマットは[DRAFT_FORMAT.md](docs-internal/DRAFT_FORMAT.md)を参照）
3. 表紙やデザインを凝りたいスライドは `index.html` 内に直接 `<section>` を書く
4. 画像・動画は同フォルダの `assets/` に置いて相対パスで参照する
5. GitHub Pagesの公開URL（`https://wwlapaki310.github.io/html-slides-lab/YYYY/スライド名/`）をこのREADMEの表に追記する

pushすればCIが公開トップページ（`index.html`）とPDFを自動生成するので、
そちらは手で更新する必要はない。索引の見出しには各`index.html`の`<title>`が使われる。

## PDF / PPTX 出力

**自動（推奨）**: main に push すると CI（[export.yml](.github/workflows/export.yml)）が Decktape で
全スライドをPDF化し、`exports/YYYY/スライド名.pdf` にコミットする。上の索引表のPDFリンクから開ける。

**手動**: 公開URLの末尾に `?pdf` を付けてChromeで開き、印刷（Ctrl/Cmd+P）→「PDFに保存」を選ぶ。
（例: `https://wwlapaki310.github.io/html-slides-lab/2026/sample-slide/?pdf`）

**PPTX / Googleスライド**: Actionsタブから `Export slides` を手動実行し `PPTXも生成する` にチェックを入れるか、
ローカルで `python tools/export/pdf_to_pptx.py exports` を実行する。詳細は
[tools/export/README.md](tools/export/README.md)。

## GitHub Pages

公開設定済み（`main`ブランチ / `/ (root)`）。

リポジトリ直下の `.nojekyll` は、`_` で始まる `_template/` が Jekyll に除外されて
共通CSS（`_template/base/css/theme.css`）が404になるのを防ぐためのもの。**削除しないこと。**
