#!/usr/bin/env node
/**
 * 全スライド（YYYY/スライド名/index.html）を Decktape で PDF 化して exports/ に出力する。
 *
 *   node tools/export/export-pdf.mjs            # 全スライド
 *   node tools/export/export-pdf.mjs 2026/sample-slide   # 個別指定
 *
 * 依存: Node.js 18+ と npx（decktape は npx 経由でその場で取得する）。
 * リポジトリルート用の静的サーバをこのスクリプト自身が立てるため、
 * 事前に別のサーバを起動しておく必要はない。
 */
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readdir, readFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT_DIR = path.join(REPO_ROOT, 'exports');
const PORT = Number(process.env.EXPORT_PORT || 8099);
const DECKTAPE_VERSION = process.env.DECKTAPE_VERSION || '3.14.0';
const SIZE = process.env.EXPORT_SIZE || '1920x1080';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

/** リポジトリルートを配信する最小限の静的サーバ */
function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let filePath = path.join(REPO_ROOT, urlPath);
      // ディレクトリトラバーサル防止
      if (!filePath.startsWith(REPO_ROOT)) {
        res.writeHead(403).end('forbidden');
        return;
      }
      if (existsSync(filePath) && (await stat(filePath)).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
      const body = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

/** YYYY/スライド名/index.html を持つフォルダを列挙する */
async function findSlides() {
  const slides = [];
  for (const year of (await readdir(REPO_ROOT, { withFileTypes: true }))) {
    if (!year.isDirectory() || !/^\d{4}$/.test(year.name)) continue;
    for (const deck of (await readdir(path.join(REPO_ROOT, year.name), { withFileTypes: true }))) {
      if (!deck.isDirectory()) continue;
      if (existsSync(path.join(REPO_ROOT, year.name, deck.name, 'index.html'))) {
        slides.push(`${year.name}/${deck.name}`);
      }
    }
  }
  return slides.sort();
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited with ${code}`))));
  });
}

const targets = process.argv.slice(2).length ? process.argv.slice(2).map((s) => s.replace(/\/+$/, '')) : await findSlides();
if (targets.length === 0) {
  console.error('スライドが見つかりませんでした（YYYY/スライド名/index.html の形で配置してください）');
  process.exit(1);
}

const server = await startServer();
console.log(`静的サーバ起動: http://127.0.0.1:${PORT}/ （ルート: ${REPO_ROOT}）`);

let failed = 0;
try {
  for (const slide of targets) {
    const outFile = path.join(OUT_DIR, `${slide}.pdf`);
    await mkdir(path.dirname(outFile), { recursive: true });
    console.log(`\n=== ${slide} -> exports/${slide}.pdf ===`);
    try {
      await run('npx', [
        '--yes', `decktape@${DECKTAPE_VERSION}`, 'reveal',
        `http://127.0.0.1:${PORT}/${slide}/`,
        outFile,
        '--size', SIZE,
        '--chrome-arg=--no-sandbox',
        '--chrome-arg=--disable-dev-shm-usage',
      ]);
    } catch (e) {
      console.error(`失敗: ${slide}: ${e.message}`);
      failed++;
    }
  }
} finally {
  server.close();
}

console.log(failed === 0 ? '\n全スライドのPDF生成が完了しました。' : `\n${failed}件のスライドで失敗しました。`);
process.exit(failed === 0 ? 0 : 1);
