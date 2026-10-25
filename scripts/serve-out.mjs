// Minimal static server for the exported site (./out), for local checks.
// Usage: node scripts/serve-out.mjs [port]   (set BASE=/rockstack-website to mimic GitHub Pages)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const root = path.resolve("out");
const port = Number(process.argv[2] ?? 4175);
const base = process.env.BASE ?? "";
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".json": "application/json",
};

http
  .createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (base && p.startsWith(base)) p = p.slice(base.length) || "/";
    let file = path.join(root, p);
    if (!file.startsWith(root)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(404, { "content-type": types[".html"] });
      fs.createReadStream(path.join(root, "404.html")).pipe(res);
      return;
    }
    const ext = path.extname(file);
    const headers = { "content-type": types[ext] ?? "application/octet-stream" };
    // Compress text like GitHub Pages does, so local Lighthouse numbers are comparable.
    if (/\.(html|css|js|svg|txt|xml|json)$/.test(ext) && /gzip/.test(req.headers["accept-encoding"] ?? "")) {
      res.writeHead(200, { ...headers, "content-encoding": "gzip", vary: "accept-encoding" });
      fs.createReadStream(file).pipe(zlib.createGzip()).pipe(res);
      return;
    }
    res.writeHead(200, headers);
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => console.log(`serving ${root} at http://localhost:${port}${base}/`));
