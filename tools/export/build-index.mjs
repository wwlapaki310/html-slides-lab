#!/usr/bin/env node
/**
 * リポジトリ直下の index.html（GitHub Pagesのトップページ＝スライド索引）を生成する。
 *
 *   node tools/export/build-index.mjs
 *
 * YYYY/スライド名/index.html を走査し、各HTMLの <title> を見出しにして一覧化する。
 * 手で索引を二重管理しないよう、CIから自動実行する前提。
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** index.html の <title> を取り出す（「| html-slides-lab」等の接尾辞は落とす） */
async function readTitle(htmlPath, fallback) {
  try {
    const html = await readFile(htmlPath, 'utf8');
    const m = html.match(/<title>([\s\S]*?)<\/title>/i);
    if (!m) return fallback;
    return m[1].trim().split('|')[0].trim() || fallback;
  } catch {
    return fallback;
  }
}

/** 年度 -> スライド一覧 を集める */
async function collect() {
  const years = [];
  for (const entry of await readdir(REPO_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory() || !/^\d{4}$/.test(entry.name)) continue;
    const decks = [];
    for (const deck of await readdir(path.join(REPO_ROOT, entry.name), { withFileTypes: true })) {
      if (!deck.isDirectory()) continue;
      const slug = `${entry.name}/${deck.name}`;
      const html = path.join(REPO_ROOT, slug, 'index.html');
      if (!existsSync(html)) continue;
      decks.push({
        slug,
        title: await readTitle(html, deck.name),
        pdf: existsSync(path.join(REPO_ROOT, 'exports', `${slug}.pdf`)) ? `exports/${slug}.pdf` : null,
      });
    }
    if (decks.length) years.push({ year: entry.name, decks: decks.sort((a, b) => a.slug.localeCompare(b.slug)) });
  }
  return years.sort((a, b) => b.year.localeCompare(a.year)); // 新しい年度を上に
}

const years = await collect();
const total = years.reduce((n, y) => n + y.decks.length, 0);

const sections = years
  .map(
    ({ year, decks }) => `    <section class="year">
      <h2>${year}</h2>
      <ul class="decks">
${decks
  .map(
    (d) => `        <li>
          <a class="deck" href="${d.slug}/">
            <span class="deck-title">${escapeHtml(d.title)}</span>
            <span class="deck-path">${d.slug}/</span>
          </a>
          <span class="links">
            <a href="${d.slug}/">開く</a>
            ${d.pdf ? `<a href="${d.pdf}">PDF</a>` : '<span class="muted">PDF未生成</span>'}
          </span>
        </li>`
  )
  .join('\n')}
      </ul>
    </section>`
  )
  .join('\n');

const html = `<!doctype html>
<!-- このファイルは tools/export/build-index.mjs が自動生成します。直接編集しないでください。 -->
<html lang="ja">
<head>
<meta charset="utf-8" />
<title>html-slides-lab</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" />
<style>
  :root { --accent:#2563eb; --accent-dark:#1e3a8a; --ink:#111827; --muted:#6b7280; --line:#e5e7eb; --bg:#ffffff; --card:#f9fafb; }
  @media (prefers-color-scheme: dark) {
    :root { --ink:#f3f4f6; --muted:#9ca3af; --line:#374151; --bg:#111827; --card:#1f2937; --accent:#60a5fa; --accent-dark:#93c5fd; }
  }
  * { box-sizing: border-box; }
  body { margin:0; padding:0; background:var(--bg); color:var(--ink);
         font-family:'Noto Sans JP','Hiragino Sans','Yu Gothic',sans-serif; line-height:1.7; }
  .wrap { max-width: 820px; margin: 0 auto; padding: 48px 20px 72px; }
  header { border-bottom: 6px solid var(--accent); padding-bottom: 16px; margin-bottom: 8px; }
  h1 { font-size: 2rem; margin: 0 0 6px; letter-spacing: .02em; }
  .lead { color: var(--muted); margin: 0; font-size: .95rem; }
  .year { margin-top: 40px; }
  .year h2 { font-size: 1.1rem; margin: 0 0 12px; color: #fff; background: var(--accent);
             display:inline-block; padding: 4px 16px; border-radius: 4px; }
  ul.decks { list-style: none; margin: 0; padding: 0; }
  ul.decks li { display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between;
                background: var(--card); border:1px solid var(--line); border-radius:10px;
                padding:14px 18px; margin-bottom:10px; }
  a.deck { text-decoration:none; color:inherit; display:flex; flex-direction:column; min-width:0; }
  a.deck:hover .deck-title { color: var(--accent); }
  .deck-title { font-weight:700; font-size:1.02rem; }
  .deck-path { color:var(--muted); font-size:.78rem; font-family:ui-monospace,Consolas,monospace; }
  .links { display:flex; gap:8px; flex-shrink:0; }
  .links a { font-size:.82rem; text-decoration:none; color:#fff; background:var(--accent);
             padding:5px 14px; border-radius:999px; }
  .links a:hover { background: var(--accent-dark); }
  .muted { font-size:.82rem; color:var(--muted); }
  footer { margin-top:56px; padding-top:20px; border-top:1px solid var(--line); font-size:.85rem; color:var(--muted); }
  footer a { color: var(--accent); }
  @media (max-width: 520px) { ul.decks li { flex-direction:column; align-items:flex-start; } }
</style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>html-slides-lab</h1>
      <p class="lead">生成AIで作ったHTMLスライド置き場（全${total}件）。タイトルをクリックするとブラウザでそのまま発表できます。</p>
    </header>

${sections || '    <p class="muted">まだスライドがありません。</p>'}

    <footer>
      <p>操作: <strong>← →</strong> ページ送り / <strong>F</strong> フルスクリーン / <strong>S</strong> スピーカーノート。
         URL末尾に <code>?pdf</code> を付けてChromeで印刷するとPDF化できます。</p>
      <p><a href="https://github.com/wwlapaki310/html-slides-lab">GitHubリポジトリ</a></p>
    </footer>
  </div>
</body>
</html>
`;

await writeFile(path.join(REPO_ROOT, 'index.html'), html, 'utf8');
console.log(`index.html を生成しました（${years.length}年度 / ${total}スライド）`);
