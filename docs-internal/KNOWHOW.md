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

## デザインシステム（配色・レイアウト）

### 配色パレット
`index.html` の `<html data-theme="...">` で以下の4つから切り替えられます（`_template/base/css/theme.css`に定義）。

| data-theme | アクセントカラー | 補色（差し色） |
|---|---|---|
| `blue`（デフォルト） | 青 | 橙 |
| `green` | 緑 | マゼンタ |
| `purple` | 紫 | 橘 |
| `red` | 赤 | 青緑 |

新しい配色を追加したい場合は、`theme.css`に `[data-theme="名前"] { --hsl-accent: ...; --hsl-complement: ...; }` を追加するだけで良い。

### タイトルの色付け
各スライドの見出し（`h2`）は背景にアクセントカラーを敲いたラベルになっています。表紙（`h1`）は下線でアクセントカラーを使います。

### フォント
`theme.css` が Google Fonts から **Noto Sans JP**（400/700）を読み込み、
`--hsl-font-heading` / `--hsl-font-body` の先頭に置いている。
ローカルフォント頼みにするとCIのheadless Chromeで日本語が豆腐になるため、
この指定は環境差をなくすための必須要件。オフライン環境で使う場合は
`assets/` にフォントを置いて `@font-face` に差し替える。

### 補色ユーティリティ
たまに差し色として使う用途で、`draft.md`内で以下のように使えます（data-markdownはHTMLをそのまま通すため）。

```html
<span class="hsl-complement-text">重要なテキスト</span>
<span class="hsl-complement-bg">バッジ風</span>
```

### 固定コーナー（右上・右下・フッター）
`index.html` の `.slides` の外側に `hsl-topright` / `hsl-bottomright` / `hsl-footer` の3つのdivがあり、全スライド共通で画面の同じ位置に固定表示されます（reveal.jsは`.slides`だけをスケーリングするため）。

- `hsl-topright`：ロゴなど
- `hsl-bottomright`：スポンサーロゴやQRコードなど
- `hsl-footer`：発表者名・イベント名・日付など

使わない場合は `index.html` 側でその `<div>` ごと削除すればよい。

## プロンプト例

そのままコピーして使える依頼文のテンプレート。**まずリポジトリのどのファイルを読ませるか**を
明示するのがコツで、これを省くとAIがフォーマットを自己流に作り直してしまう。

### 新しいスライドを1本作る

```
html-slides-lab リポジトリでスライドを1本作ります。

1. docs-internal/DRAFT_FORMAT.md を読んでフォーマットを把握してください
2. 2026/feature-showcase/ を 2026/<スライド名>/ にコピーしてください
3. index.html の <title>、表紙の <h1>/<p>、.hsl-footer を差し替えてください
4. draft.md は中身を全部消して、以下の内容で書き直してください

テーマ: <発表テーマ>
聴衆: <誰向けか>
時間: <N>分（スライド<N>枚程度）
構成: 導入 → <本編の柱を3つ> → まとめ
```

### 原稿だけ直す（いちばん使う）

```
2026/<スライド名>/draft.md の「<見出し名>」のスライドを、
docs-internal/DRAFT_FORMAT.md のフォーマットのまま以下に差し替えてください。
index.html は触らないでください。

<新しい内容>
```

`index.html は触らないでください` の一文がデザイン崩れの事故をほぼ無くす。

### 図を描かせる

```
draft.md の「<見出し名>」のスライドに、以下の流れを表すSVG図を追加してください。
- viewBox="0 0 760 160"、幅は style="width:100%;max-width:700px;"
- 配色は theme.css のアクセントカラー（#2563eb / #1e3a8a）と #111827 のみ使う
- 図: <A> → <B> → <C>
```

SVGはテキストなのでAIが直接書けて、`draft.md` にそのまま貼れる。ラスタ画像より修正依頼が通りやすい。

### 分量を調整する

```
draft.md が<N>枚あり、<M>分の発表には多すぎます。
「<残したい柱>」を残し、それ以外を統合して<M>枚に削ってください。
削った内容のうち重要なものは Note: のスピーカーノートに移してください。
```

「削って」だけだと情報が消えるが、「ノートに移して」を付けると口頭補足用に残る。

### 配色を変える

```
2026/<スライド名>/index.html の <html data-theme="blue"> を green に変えてください。
```

新しい配色そのものを足したい場合のみ `_template/base/css/theme.css` に
`[data-theme="名前"] { --hsl-accent: ...; --hsl-complement: ...; }` を追加させる。

### AIへの依頼で避けること

| やりがちなこと | 何が起きるか | 代わりに |
|---|---|---|
| 「かっこいいスライドを作って」 | 独自CSSを大量生成しテーマと衝突する | テーマ機構を読ませ「既存のクラスだけ使って」と指定する |
| 1プロンプトで全20枚を作らせる | 後半になるほど構成が崩れる | 導入／本編3〜5枚ずつ／まとめに分割する |
| HTMLとMarkdownを同時に直させる | 変更箇所が追えず崩れの原因が特定できない | 原稿モードとデザインモードを1依頼1モードに分ける |
| 画像パスを推測させる | 存在しないファイルを参照して壊れる | `assets/ファイル名` と実ファイル名を明示する |

## PDF化の手順

### 手動（MVP・追加インストール不要）

1. GitHub PagesでスライドURLを開く
2. URL末尾に `?pdf` を追加してアクセス（例: `.../index.html?pdf`）
3. Chromeの印刷（Ctrl/Cmd+P）→送信先を「PDFに保存」に変更→保存

（`?pdf`は内部的に reveal.js が判定に使う `print-pdf` というクエリ文字列へ自動的に書き換えられる仕組みをテンプレートに組み込み済み）

### 自動（Phase2・CI）

main に push すると `.github/workflows/export.yml` が走り、Decktape（headless Chrome）で
全スライドをPDF化して `exports/YYYY/スライド名.pdf` にコミットする。
ローカルで試す場合は `node tools/export/export-pdf.mjs`。詳細は
[tools/export/README.md](../tools/export/README.md)。

## PPTX変換の手順（Phase2）

```bash
pip install pymupdf python-pptx
python tools/export/pdf_to_pptx.py exports
```

PDFの各ページをPyMuPDFで画像化し、`python-pptx` で1ページ=1スライドのPPTXに詰める。
GitHub Actionsからは `Export slides` を手動実行し `PPTXも生成する` にチェックを入れる。

**画像PPTXになる**ため、PowerPoint上でテキストは編集できない。配布・共有には十分だが、
PowerPointで作り込む必要がある資料は最初からPowerPointで作ったほうが早い。

Googleスライドに持っていく場合は、PDF/PPTXをGoogleドライブにアップロードし、
右クリック →「アプリで開く」→ Googleスライド。

## ハマりどころ

### `_template/` が GitHub Pages で 404 になる（重要）
GitHub Pages は既定で Jekyll を通すため、**`_` で始まるディレクトリが公開対象から除外される**。
全スライドが参照する `_template/base/css/theme.css` が404になり、
「ローカルでは正しく見えるのに公開サイトだけデザインが当たらない」という状態になる。
リポジトリ直下の空ファイル `.nojekyll` で Jekyll を無効化して回避している。**消さないこと。**

### theme.css を直したのにブラウザに反映されない
各 `index.html` は `theme.css?v=3` のようにバージョンクエリを付けて読み込んでいる。
CSSを大きく変えたらこの数字を上げ、全 `index.html` で揃える（`grep -rn "theme.css?v=" --include=index.html .`）。

### タイトルバナーが出ない
`theme.css` のバナーは CSS の `:has()` セレクタを使っているため、モダンな Chrome / Edge / Safari が前提。
また `<h2>` が `<section>` の**先頭要素**である必要がある（`draft.md` では `##` をスライドの1行目に書く）。
スライド属性コメント `<!-- .slide: ... -->` は `##` より前に書いても先頭要素判定には影響しない。

### PDFの日本語が全部豆腐（□）になる
headless Chrome（CI・Decktape）には日本語フォントが入っていないため、
`font-family` をローカルフォント（Hiragino等）だけで指定していると全滅する。
`theme.css` の先頭で Noto Sans JP を Webフォントとして `@import` し、
さらにCIでも `fonts-noto-cjk` を入れて二重に保険をかけている。
インラインコード（`code`/`pre`）のフォントスタックにも日本語フォントのフォールバックが必要。

### タイトルバナーがスライド中央に浮く
reveal.js の `center: true` は「(スライド高 − セクション高) / 2」だけセクションを下げるため、
`position:absolute; top:0` のバナーもセクションごと中央に移動してしまう。
`theme.css` では対象セクションに `height: 100%` を指定して下げ幅を0にし、上端に固定している。

### 画像スライドが縦にはみ出して文字が切れる
バナー付きスライドは上部84pxを使うため、画像が大きいと本文がスライド外に出る。
`theme.css` の `--hsl-media-max-height`（既定360px）で `img / video / iframe` の高さを抑えている。
360pxは本文キャプションが3〜4行入っても収まる実測値で、YouTube埋め込みの既定高とも一致する。

ここを `max-height: 60%` のようなパーセントで書くと**効かない**。
Markdownの `![]()` は `<p><img></p>` に展開され、親 `<p>` の高さが `auto` のため
パーセントが解決できずに無視されるため、絶対値で指定する必要がある。

個別のスライドで大きく見せたい場合は、そのタグに `style="max-height: 560px;"` を直接書けば上書きできる。
それでも入りきらない場合は、本文を減らすか縦スライド（`----`）に分ける。

### PDFでフラグメントがページ数を増やす
Decktape は既定で `class="fragment"` の1ステップを1ページとして出力する。
配布用に1スライド1ページへまとめたい場合は、そのスライドのフラグメントを外す。

## 今後追記していくこと

- 動画出力（Playwright + ffmpeg）の具体的な手順（Phase3）
- ブラウザ上編集（github.dev運用）で不便だった点のログ（Phase3）
