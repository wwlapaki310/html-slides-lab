## この資料について

html-slides-lab の機能を一通り確認できるショーケースです。
新しいスライドを作るときは、この `draft.md` をコピーして使いたい部分だけ残すのが早い。

---

## 配色パレット（4種類）

<div style="display:flex; gap:20px; justify-content:center; margin-top:10px;">
  <div style="text-align:center;">
    <div style="width:110px;height:70px;border-radius:8px;background:#2563eb;"></div>
    <p style="font-size:0.5em;margin-top:6px;">blue（既定）</p>
  </div>
  <div style="text-align:center;">
    <div style="width:110px;height:70px;border-radius:8px;background:#16a34a;"></div>
    <p style="font-size:0.5em;margin-top:6px;">green</p>
  </div>
  <div style="text-align:center;">
    <div style="width:110px;height:70px;border-radius:8px;background:#7c3aed;"></div>
    <p style="font-size:0.5em;margin-top:6px;">purple</p>
  </div>
  <div style="text-align:center;">
    <div style="width:110px;height:70px;border-radius:8px;background:#dc2626;"></div>
    <p style="font-size:0.5em;margin-top:6px;">red</p>
  </div>
</div>

`index.html` の `<html data-theme="...">` を書き換えるだけで、全体のアクセントカラーが一括で切り替わる。

---

## タイトルの配色

この見出し（`h2`）自体がデモです。背景にアクセントカラーを敲いたラベルデザインになっています。
表紙（`h1`）は下線でアクセントカラーを使います。

---

## 補色（差し色）の使い方

<p><span class="hsl-complement-text">こんな風に文字色を補色にできます</span></p>
<p><span class="hsl-complement-bg">バッジ風の背景にも使えます</span></p>

`hsl-complement-text` と `hsl-complement-bg` の2クラスをHTMLに直接書くだけ。多用せず「ここぞ」で使うのがコツ。

---

## 図解（SVGダイアグラム）

<svg viewBox="0 0 760 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;">
  <rect x="10" y="50" width="200" height="60" rx="10" fill="#2563eb"/>
  <text x="110" y="85" text-anchor="middle" fill="#fff" font-size="18" font-family="sans-serif">draft.md（原稿）</text>
  <rect x="280" y="50" width="200" height="60" rx="10" fill="#1e3a8a"/>
  <text x="380" y="85" text-anchor="middle" fill="#fff" font-size="18" font-family="sans-serif">index.html</text>
  <rect x="550" y="50" width="200" height="60" rx="10" fill="#111827"/>
  <text x="650" y="85" text-anchor="middle" fill="#fff" font-size="16" font-family="sans-serif">GitHub Pages</text>
  <line x1="210" y1="80" x2="275" y2="80" stroke="#374151" stroke-width="3" marker-end="url(#arrow)"/>
  <line x1="480" y1="80" x2="545" y2="80" stroke="#374151" stroke-width="3" marker-end="url(#arrow)"/>
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#374151"/>
    </marker>
  </defs>
</svg>

SVGはテキストなので `draft.md` に直接書ける。生成AIにも「この構成のSVG図を書いて」と依頼しやすい。

---

## 画像の例

![サンプルイラスト](assets/sample-image.svg)

`assets/` フォルダに置いた画像を `![alt](assets/ファイル名)` で参照する。

---

## ローカル動画ファイルの埋め込み

同じフォルダの `assets/` に動画ファイルを置いて、以下のように書く。

```html
<video controls style="max-height: 400px;">
  <source src="assets/your-video.mp4" type="video/mp4" />
</video>
```

（このショーケースには実ファイルを置いていないため、コードのみ紹介）

---

## YouTube動画の埋め込み

<iframe width="640" height="360" src="https://www.youtube.com/embed/aqz-KE-bpKQ" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="max-width:100%;"></iframe>

サンプルとして Blender Foundation の「Big Buck Bunny」（CCライセンスのデモ映像）を埋め込んでいます。`aqz-KE-bpKQ`の部分を自分の動画IDに差し替えるだけ。

---

## フラグメント（1つずつ表示）

<ol>
  <li class="fragment">クリック（→キー）で</li>
  <li class="fragment">1つずつ</li>
  <li class="fragment">表示されていきます</li>
</ol>

`class="fragment"` を付けた要素は、ページ送りのたびに1つずつ表示される。

---

<!-- .slide: data-background-color="#1e3a8a" -->
## 背景色を変えたスライド

<p style="color:#fff;">直前の行に <code>&lt;!-- .slide: data-background-color="#1e3a8a" --&gt;</code> と書くと、このスライドだけ背景色を変えられる。</p>
<p style="color:#fff;font-size:0.7em;">見出しラベルは通常どおりアクセントカラーのまま。`data-background-image`も同じ書き方で使える。</p>

---

## PDF出力

公開URLの末尾に `?pdf` を付けてChromeで開き、印刷（Ctrl/Cmd+P）→「PDFに保存」を選ぶだけ。

例: `https://wwlapaki310.github.io/html-slides-lab/2026/feature-showcase/?pdf`

追加インストール不要。**実装済み。**

---

## Googleスライド出力

現状は手動フロー。

1. 上の方法でPDFを作る
2. Googleドライブにアップロード
3. 右クリック →「アプリで開く」→ Googleスライド

APIによる完全自動化はPhase3で検討中（未着手）。

---

## PPTX出力

Phase2で計画中（未着手）。Decktapeで生成したPDF/PNGを`python-pptx`で1枚1画像のPPTXに変換する想定。

※ 画像PPTXになるため、PowerPoint上でテキストを直接編集することはできない点に注意。

---

## 動画出力（Phase3）

Playwrightでヘッドレスブラウザ操作を録画 → ffmpegでmp4化、という構成を想定。未着手。

---

## ブラウザ上での編集（Phase3）

まずは GitHub Codespaces / github.dev（VSCode Web）でこのリポジトリを直接開いて編集する運用でカバー。専用エディタの自作は必要になったら検討する。

---

## スピーカーノートの例

発表中は `S` キーでスピーカービューを開くと、このメモが見える。

Note:
これはスピーカーノートです。聴衆側の画面には表示されません。

---

## まとめ・関連ドキュメント

- 要件定義: [REQUIREMENTS.md](../../docs-internal/REQUIREMENTS.md)
- 原稿フォーマット: [DRAFT_FORMAT.md](../../docs-internal/DRAFT_FORMAT.md)
- 生成AIノウハウ: [KNOWHOW.md](../../docs-internal/KNOWHOW.md)
- 索引: [README](../../README.md)

このショーケースの `draft.md` をコピーして、使いたい機能だけ残すのが一番早い。
