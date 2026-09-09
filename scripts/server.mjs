import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { api } from '../server/worker.js';
import { localDatabase } from './local-db.mjs';
import { mongoDatabase } from '../server/mongodb-node.mjs';
import { existsSync } from 'node:fs';
for (const envFile of ['.env.admin.local', 'C:/Users/PC/Downloads/atlas-credentials.env']) if(existsSync(envFile)) process.loadEnvFile(envFile);
const db=process.env.MONGODB_URI?await mongoDatabase({uri:process.env.MONGODB_URI,username:process.env.MONGODB_USERNAME,password:process.env.MONGODB_PASSWORD,database:process.env.MONGODB_DATABASE}):localDatabase();
const env={...process.env,DB:db};

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if(url.pathname.startsWith('/api/')){
      const chunks=[];let bytes=0;
      for await(const chunk of req){bytes+=chunk.length;if(bytes>16000){res.writeHead(413);res.end('{"error":"Request too large"}');return;}chunks.push(chunk);}
      const body=Buffer.concat(chunks);
      const headers=new Headers(req.headers);headers.set('cf-connecting-ip',req.socket.remoteAddress||'local');
      const request=new Request(url,{method:req.method,headers,...(body.length?{body}: {})});
      const response=await api(request,env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;
    }
    const requested = url.pathname === '/' ? '/index.html' : url.pathname;
    const allowed=/^\/(?:index\.html|product\.html|admin(?:\.html)?|styles\.css|theme\.css|cart\.css|app\.js|cart\.js|admin\.js|data\.js|robots\.txt|sitemap\.xml|assets\/[a-zA-Z0-9_.-]+)$/;
    if(!allowed.test(requested))throw new Error('Not public');
    const file = normalize(join(root, requested==='/admin'?'/admin.html':decodeURIComponent(requested)));
    if (!file.startsWith(root)) throw new Error('Invalid path');
    const info = await stat(file);
    const resolved = info.isDirectory() ? join(file, 'index.html') : file;
    const body = await readFile(resolved);
    res.writeHead(200, { 'Content-Type': types[extname(resolved)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, () => console.log(`CRETE-CHEM preview: http://localhost:${port}`));
