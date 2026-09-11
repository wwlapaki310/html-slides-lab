# html-slides-lab

生成AIで作ったHTMLスライドを、年度別フォルダで蓄積していくリポジトリです。
GitHub Pagesで各スライドをそのままブラウザ閲覧・プレゼン発表できます。

- 要件定義: [docs-internal/REQUIREMENTS.md](docs-internal/REQUIREMENTS.md)
- 原稿(draft.md)フォーマット仕様: [docs-internal/DRAFT_FORMAT.md](docs-internal/DRAFT_FORMAT.md)
- 生成AIノウハウ集: [docs-internal/KNOWHOW.md](docs-internal/KNOWHOW.md)
- 新規スライドの作り方: [`_template/base/`](_template/base/) をコピーして使う

## スライド索引

### 2026

| タイトル | 公開URL | 作成日 |
|---|---|---|
| 機能ショーケース（全機能デモ） | [開く](https://wwlapaki310.github.io/html-slides-lab/2026/feature-showcase/) | 2026-09-11 |
| サンプルスライド | [開く](https://wwlapaki310.github.io/html-slides-lab/2026/sample-slide/) | 2026-09-11 |

> 新しいスライドを追加したら、この表に1行追記してください。

## フォルダ構成

```
html-slides-lab/
├── README.md              # この索引
├── docs-internal/         # 要件・原稿フォーマット・ノウハウ等の内部ドキュメント
├── _template/base/        # 新規スライド作成用のベーステンプレート（index.html + draft.md）
├── 2026/                  # 年度別フォルダ（スライドごとに1フォルダ、index.html + draft.md）
├── tools/export/          # PDF/PPTX変換スクリプト（Phase2）
└── .github/workflows/     # 自動化CI（Phase2）
```

## 使い方（新しいスライドを作る）

1. `_template/base/`（または`2026/feature-showcase/`）を `YYYY/スライド名/` にコピーする
2. 本編のテキストは `draft.md` を生成AIと一緒に編集する（フォーマットは[DRAFT_FORMAT.md](docs-internal/DRAFT_FORMAT.md)を参照）
3. 表紙やデザインを凝りたいスライドは `index.html` 内に直接 `<section>` を書く
4. 画像・動画は同フォルダの `assets/` に置いて相対パスで参照する
5. GitHub Pagesの公開URL（`https://wwlapaki310.github.io/html-slides-lab/YYYY/スライド名/`）をこのREADMEの表に追記する

## PDF出力

公開URLの末尾に `?pdf` を付けてChromeで開き、印刷（Ctrl/Cmd+P）→「PDFに保存」を選ぶ。
（例: `https://wwlapaki310.github.io/html-slides-lab/2026/sample-slide/?pdf`）

## GitHub Pages

公開設定済み（`main`ブランチ / `/ (root)`）。
