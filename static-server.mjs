import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, 'dist')
const port = Number(process.env.PORT || 18791)

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
}

function safePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/^\/+/, '')
  const candidate = path.normalize(path.join(root, clean))
  if (!candidate.startsWith(root)) return null
  return candidate
}

const server = http.createServer((req, res) => {
  const requestPath = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).pathname
  let file = safePath(requestPath)
  if (!file) {
    res.writeHead(400)
    res.end('bad request')
    return
  }
  if (requestPath === '/' || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(root, 'index.html')
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('not found')
      return
    }
    const ext = path.extname(file)
    res.writeHead(200, {
      'content-type': types[ext] || 'application/octet-stream',
      'cache-control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    })
    res.end(data)
  })
})

server.listen(port, '127.0.0.1', () => {
  console.log(`QuirkNGo storefront serving ${root} on http://127.0.0.1:${port}`)
})
