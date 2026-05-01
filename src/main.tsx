import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Buffer } from 'buffer'
import './index.css'
import App from './App'

declare global {
  interface Window {
    Buffer?: typeof Buffer
  }
}

if (!window.Buffer) window.Buffer = Buffer

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('SW registration failed', err)
    })
  })
}
