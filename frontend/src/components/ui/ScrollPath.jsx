import { useEffect, useRef } from 'react'

/**
 * The signature scroll-triggered neon path that "draws" down the page
 * as the user scrolls — connects all sections visually.
 */
export default function ScrollPath() {
  const pathRef = useRef(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    const length = path.getTotalLength()
    path.style.strokeDasharray  = length
    path.style.strokeDashoffset = length

    const onScroll = () => {
      const scrollTop    = window.scrollY
      const docHeight    = document.body.scrollHeight - window.innerHeight
      const scrollFrac   = Math.min(scrollTop / docHeight, 1)
      path.style.strokeDashoffset = length * (1 - scrollFrac)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="absolute left-1/2 top-0 -translate-x-1/2"
        width="120"
        height="100%"
        viewBox="0 0 120 5000"
        fill="none"
        preserveAspectRatio="none"
        style={{ minHeight: '100vh' }}
      >
        {/* Background ghost path */}
        <path
          d="M60 0 C60 400, 30 500, 60 900 C90 1300, 30 1500, 60 1900
             C90 2300, 30 2500, 60 2900 C90 3300, 30 3500, 60 3900 C90 4300, 60 4700, 60 5000"
          stroke="rgba(123,97,255,0.06)"
          strokeWidth="2"
          fill="none"
        />

        {/* Animated neon path */}
        <path
          ref={pathRef}
          d="M60 0 C60 400, 30 500, 60 900 C90 1300, 30 1500, 60 1900
             C90 2300, 30 2500, 60 2900 C90 3300, 30 3500, 60 3900 C90 4300, 60 4700, 60 5000"
          stroke="url(#scrollGrad)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px rgba(123,97,255,0.6))' }}
        />

        <defs>
          <linearGradient id="scrollGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#7B61FF" />
            <stop offset="40%"  stopColor="#00E5FF" />
            <stop offset="70%"  stopColor="#00F5A0" />
            <stop offset="100%" stopColor="#FF4DCA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
