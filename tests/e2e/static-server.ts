import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

export interface StaticServerHandle {
  url: string;
  port: number;
  close: () => Promise<void>;
}

/**
 * Serves files from `rootDir` on 127.0.0.1 with an ephemeral port.
 */
export function startStaticServer(rootDir: string): Promise<StaticServerHandle> {
  const root = path.resolve(rootDir);

  const server = http.createServer((req, res) => {
    const rawPath = req.url?.split('?')[0] ?? '/';
    const rel = rawPath === '/' ? 'index.html' : rawPath.replace(/^\//, '');
    const filePath = path.normalize(path.join(root, rel));

    if (!filePath.startsWith(root + path.sep) && filePath !== root) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(err.code === 'ENOENT' ? 404 : 500);
        res.end(err.code === 'ENOENT' ? 'Not found' : 'Server error');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
      res.end(data);
    });
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (!addr || typeof addr === 'string') {
        reject(new Error('Failed to bind static server'));
        return;
      }
      const port = addr.port;
      resolve({
        port,
        url: `http://127.0.0.1:${port}`,
        close: () =>
          new Promise<void>((closeResolve, closeReject) => {
            server.close((closeErr) => (closeErr ? closeReject(closeErr) : closeResolve()));
          }),
      });
    });
  });
}
