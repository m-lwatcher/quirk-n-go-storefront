import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, 'dist')
const port = Number(process.env.PORT || 18791)

const SOLANA_RPC_UPSTREAMS = [
  'https://solana-rpc.publicnode.com',
  'https://api.mainnet-beta.solana.com',
]

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

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  return Buffer.concat(chunks)
}

async function proxySolanaRpc(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'access-control-max-age': '86400',
    })
    res.end()
    return
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: 'POST required' }))
    return
  }

  const body = await readBody(req)
  const errors = []
  for (const upstream of SOLANA_RPC_UPSTREAMS) {
    try {
      const upstreamRes = await fetch(upstream, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
      })
      const text = await upstreamRes.text()
      if (upstreamRes.ok) {
        res.writeHead(upstreamRes.status, {
          'content-type': upstreamRes.headers.get('content-type') || 'application/json',
          'cache-control': 'no-store',
          'access-control-allow-origin': '*',
        })
        res.end(text)
        return
      }
      errors.push(`${upstream}: ${upstreamRes.status} ${text.slice(0, 180)}`)
    } catch (err) {
      errors.push(`${upstream}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  res.writeHead(502, { 'content-type': 'application/json', 'cache-control': 'no-store', 'access-control-allow-origin': '*' })
  res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: `Solana RPC proxy failed: ${errors.join(' | ')}` }, id: null }))
}

const server = http.createServer((req, res) => {
  const requestPath = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).pathname
  if (requestPath === '/api/solana-rpc') {
    void proxySolanaRpc(req, res).catch((err) => {
      res.writeHead(500, { 'content-type': 'application/json', 'cache-control': 'no-store', 'access-control-allow-origin': '*' })
      res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }))
    })
    return
  }

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
