# html-slides-lab 要件定義

## 1. 目的
生成AI（Claude / ChatGPT等）で作成したHTMLスライドを一元管理し、GitHub Pagesでいつでも誰でも閲覧できるようにする。年度単位で蓄積し、将来的にPDF/PPTX/Googleスライド/動画への変換や、ブラウザ上での軽微な編集も可能にする。

## 2. スコープ整理（やりたいことの棚卸し）

| # | 要望 | 分類 | 優先度 |
|---|------|------|--------|
| 1 | 複数スライドをフォルダごとに格納 | 構成 | MVP |
| 2 | GitHub Pagesで閲覧可能 | 公開 | MVP |
| 3 | 年度ごとにフォルダを分け、階層構造にする | 構成 | MVP |
| 4 | READMEに索引を置く | 公開 | MVP |
| 5 | 生成AIでHTMLスライドを作るノウハウ調査 | 調査 | MVP |
| 6 | HTMLスライドの基礎デザイン(テンプレート)を作る | 基盤 | MVP |
| 7 | 画像・動画を貼れるようにする | 基盤 | MVP |
| 8 | 基礎フォルダ構成を作る | 構成 | MVP |
| 9 | PDF出力 | エクスポート | Phase2 |
| 10 | Googleスライド出力 | エクスポート | Phase2 |
| 11 | PPTX出力 | エクスポート | Phase2 |
| 12 | プレゼンテーションモード | 基盤 | MVP |
| 13 | 動画出力 | エクスポート | Phase3（可能であれば） |
| 14 | ブラウザ上での細かい修正・追加 | 編集体験 | Phase3（可能であれば） |

MVP（今すぐ作る）→ Phase2（次にやる）→ Phase3（余力があれば）の3段階で進める。

## 3. 技術方針

### 3.1 スライドエンジン: reveal.js を採用
- 生成AIが「1枚1枚のHTML」を書き出すスタイルと相性が良い（Marp/SlidevはMarkdown入力が前提でAIの自由なHTML生成と食い合わせが悪い）
- プレゼンテーションモード（矢印キー送り、スピーカーノート、フルスクリーン）が標準搭載
- `?print-pdf` パラメータ付きURLをChromeで印刷するだけでPDF化できる（追加インストール不要）
- 画像・動画・iframe埋め込みのプラグインが豊富
- 静的HTML+JS+CSSなのでビルド不要 → GitHub Pagesとの相性が良い

### 3.2 PDF出力
- MVP: reveal.jsの`?print-pdf`をChromeで「PDFに保存」（手動、追加ツール不要）
- Phase2: Decktape（headless Chrome CLI）をGitHub Actionsに組み込み、pushをトリガーに自動でPDFを`exports/`に生成

### 3.3 PPTX出力
- reveal.js/HTMLは構造がPowerPointと一致しないため「完全な変換」は困難という点は事前に認識しておく
- Phase2: Decktapeで生成したPDF or PNG連番を`python-pptx`で1枚1画像のPPTXに変換（編集可能なテキストにはならない点に注意）
- 用途が「配布・共有」なら画像PPTXで十分、「PowerPointで編集」が必要なら別途手動移植が必要

### 3.4 Googleスライド出力
- Google Slides APIでの完全自動化は複雑なため、MVP〜Phase2では「PPTXをGoogleドライブにアップロード→Googleスライドで開く」手動フローを基本とする
- Phase3で余力があれば、Google Drive APIを使った自動アップロードスクリプトを検討

### 3.5 動画出力（Phase3・可能であれば）
- Playwright等でヘッドレスブラウザ操作を録画 → ffmpegでmp4化、というパイプラインを想定
- 各スライドの自動送り時間を設定できるようにする必要がある

### 3.6 ブラウザ上での編集（Phase3・可能であれば）
- 選択肢A: GitHub Codespaces / github.dev（VSCode Web）でリポジトリを直接編集する運用にする（追加開発ゼロで即実現可能）
- 選択肢B: 簡易Webエディタ（GitHub Pages上でcontenteditable + GitHub APIでコミット）を自作する（工数大）
- まずは選択肢Aの運用でカバーし、不便が出たら選択肢Bを検討する

## 4. フォルダ構成（基礎）

```
html-slides-lab/
├── README.md                 # 索引（年度・スライド一覧へのリンク）
├── docs-internal/
│   ├── REQUIREMENTS.md       # このドキュメント
│   └── KNOWHOW.md            # 生成AIでHTMLスライドを作るノウハウ集
├── _template/
│   └── base/                 # 新規スライド作成時にコピーするベーステンプレート
│       ├── index.html
│       ├── css/theme.css
│       └── assets/            # 画像・動画の置き場（サンプル空フォルダ）
├── 2026/
│   └── sample-slide/
│       ├── index.html
│       └── assets/
├── 2027/                      # 年度が増えたら追加
├── tools/
│   └── export/                # Phase2: PDF/PPTX変換スクリプト置き場
└── .github/
    └── workflows/             # Phase2: 自動PDF生成等のCI
```

- 1スライド = 1フォルダ（`YYYY/スライド名/index.html`）というルールで統一
- GitHub PagesはリポジトリルートまたはPagesブランチから配信し、`https://wwlapaki310.github.io/html-slides-lab/2026/sample-slide/` の形でアクセスできるようにする

## 5. README（索引）の運用ルール
- 新しいスライドを追加したら、README.mdの表に1行追記する（年度・タイトル・公開URL・作成日）
- 年度ごとに見出し（`## 2026`）を分けて一覧化する

## 6. 今後のTODO
- [ ] GitHub Pagesを有効化（Settings → Pages → main branch / root）
- [ ] `_template/base` の実装
- [ ] サンプルスライド `2026/sample-slide` の作成
- [ ] README.mdの索引フォーマット確定
- [ ] KNOWHOW.mdに生成AIプロンプト例・ノウハウを蓄積
- [ ] Phase2: Decktape導入とGitHub Actions化
- [ ] Phase3: 動画出力・ブラウザ編集の検証
