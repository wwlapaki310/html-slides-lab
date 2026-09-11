# 原稿(draft.md)フォーマット仕様

生成AIにスライドを作らせる際、「原稿（内容）」と「デザイン（HTML/CSS）」を分離するために、
各スライドフォルダに `draft.md` という原稿ファイルを置く運用にする。
`index.html` 側の `<section data-markdown="draft.md">` がこのファイルを自動で読み込み、
reveal.jsのMarkdownプラグイン(RevealMarkdown)がスライド化する。

これにより、生成AIへの依頼は基本的に「draft.mdの内容を書いて／直して」だけで済み、
HTML構造を毎回生成させる必要がなくなる（トークン消費も減り、崩れにくい）。

## 基本ルール

| 要素 | 書き方 | 備考 |
|---|---|---|
| スライド区切り（横） | 行全体が `---` の行（前後に空行） | 1スライド1見出しが目安 |
| スライド区切り（縦・サブスライド） | 行全体が `----` の行 | 補足資料など、脇道の内容用 |
| 見出し | `##`（スライドタイトル） | `#`は表紙用にindex.html側で使うため、draft.md内では基本`##`以降を使う |
| 箇条書き | 標準Markdownの `- ` | |
| 画像 | `![alt](assets/ファイル名)` | 相対パスは `index.html` から見た位置 |
| 動画（ローカル） | `<video>` タグを直接記述 | data-markdownはHTMLを素通しするため生HTMLでOK |
| 動画（YouTube等） | `<iframe src="https://www.youtube.com/embed/動画ID">` を直接記述 | 同上、iframeもそのまま埋め込める |
| コードブロック | \`\`\`言語名 ... \`\`\` | シンタックスハイライトはRevealHighlightプラグインが担当 |
| スピーカーノート | `Note:` から始まる行以降 | 発表者だけに見える。空行までではなくスライド区切りまでがノート扱い |
| フラグメント（1つずつ表示） | 表示させたい要素に `class="fragment"` を付与 | `<li class="fragment">...</li>` のように使う |
| スライド単位の属性指定 | 区切り(`---`)直後の1行目に `<!-- .slide: 属性="値" -->` | 例: `<!-- .slide: data-background-color="#1e3a8a" -->` でそのスライドだけ背景色変更。`data-background-image`も同様に使える |

## 使い分けの方針

- **表紙や、デザインに凝りたい特定のスライド**：`draft.md` には書かず、`index.html` 内に生の `<section>` として直接HTMLを書く
- **本編のテキスト中心スライド（見出し＋箇条書き＋画像＋コード程度）**：`draft.md` に書き、生成AIには「draft.mdのこの部分を追記/修正して」と依頼する

この役割分担により、生成AIへの依頼が「原稿執筆モード（draft.md編集）」と
「デザインモード（index.html編集）」の2種類にはっきり分かれ、依頼が安定する。

## サンプル

- `_template/base/draft.md`：最小限の実例
- `2026/feature-showcase/draft.md`：配色パレット・SVG図解・画像・YouTube埋め込み・フラグメント・背景色変更・スピーカーノートなど、対応機能を一通り使ったフル実例（[公開ページ](https://wwlapaki310.github.io/html-slides-lab/2026/feature-showcase/)）

新しいスライドを作る際は、シンプルに始めたいなら`_template/base`を、機能を参考にしたいなら`2026/feature-showcase`をコピーして書き換える。
