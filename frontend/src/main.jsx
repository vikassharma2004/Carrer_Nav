import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Lenis smooth scroll ────────────────────────────────────────────────────
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})

// Keep GSAP ScrollTrigger in sync with Lenis scroll position
lenis.on('scroll', ScrollTrigger.update)

// Drive Lenis via GSAP's RAF loop for frame-perfect sync
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)
// ────────────────────────────────────────────────────────────────────────────

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
