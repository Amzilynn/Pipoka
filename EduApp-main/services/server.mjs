import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, relative, extname, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { authPlugin } from './auth.mjs';
import { calendarVisionPlugin } from './calendarVision.mjs';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const origin = process.env.AUTH_ORIGIN;
if (process.env.NODE_ENV === 'production' && !origin?.startsWith('https://')) throw new Error('Set AUTH_ORIGIN to the public HTTPS origin before starting in production.');
const middlewares = [];
const server = createServer((req, res) => {
  let index = 0;
  const next = () => {
    const middleware = middlewares[index++];
    if (middleware) return middleware(req, res, next);
    void serve(req, res);
  };
  next();
});
const adapter = { httpServer: server, middlewares: { use: middleware => middlewares.push(middleware) } };
authPlugin({ databasePath: process.env.AUTH_DATABASE_PATH, origin, secureCookies: process.env.AUTH_SECURE_COOKIES === 'true' || origin?.startsWith('https://') }).configureServer(adapter);
calendarVisionPlugin({ host: process.env.OLLAMA_HOST, model: process.env.CALENDAR_VISION_MODEL }).configureServer(adapter);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.wasm': 'application/wasm', '.woff2': 'font/woff2', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.webm': 'video/webm', '.pdf': 'application/pdf' };
async function serve(req, res) {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end(); }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.startsWith('/api/')) { res.writeHead(404); return res.end(); }
    let file = resolve(root, '.' + pathname);
    const rel = relative(root, file);
    if (rel.startsWith('..') || isAbsolute(rel)) { res.writeHead(403); return res.end(); }
    let exists = await stat(file).catch(() => null);
    if (!exists?.isFile()) {
      if (extname(pathname)) { res.writeHead(404); return res.end(); }
      file = resolve(root, 'index.html');
      exists = await stat(file).catch(() => null);
    }
    if (!exists?.isFile()) { res.writeHead(503); return res.end('Run npm run build before starting the server.'); }
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'DENY', 'Cache-Control': file.endsWith('index.html') ? 'no-cache' : 'public, max-age=3600' });
    if (req.method === 'HEAD') return res.end();
    createReadStream(file).on('error', () => res.destroy()).pipe(res);
  } catch { if (!res.headersSent) res.writeHead(400); res.end(); }
}
server.listen(Number(process.env.PORT || 5174), process.env.HOST || '127.0.0.1', () => console.log(`Boblii listening on port ${server.address().port}`));
