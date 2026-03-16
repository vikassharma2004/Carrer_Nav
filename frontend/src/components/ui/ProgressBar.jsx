import { useEffect, useRef, useState } from 'react'

/**
 * Animated progress bar — fills when in view
 */
export default function ProgressBar({
  value      = 75,        // 0–100
  color      = '#7B61FF',
  height     = 8,
  label,
  showValue  = true,
  animate    = true,
  className  = '',
}) {
  const ref      = useRef(null)
  const [filled, setFilled] = useState(false)
  const [width,  setWidth]  = useState(animate ? 0 : value)

  useEffect(() => {
    if (!animate) return

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !filled) {
          setFilled(true)
          observer.unobserve(el)
          // Trigger animation after a short delay
          requestAnimationFrame(() => {
            setTimeout(() => setWidth(value), 100)
          })
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [animate, filled, value])

  return (
    <div ref={ref} className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-brand-navy">{label}</span>}
          {showValue && (
            <span className="text-sm font-bold" style={{ color }}>
              {filled || !animate ? value : 0}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div
        className="w-full rounded-full overflow-hidden bg-gray-100"
        style={{ height }}
      >
        {/* Fill */}
        <div
          className="h-full rounded-full transition-all"
          style={{
            width:      `${width}%`,
            background: color,
            transitionDuration: '1.8s',
            transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
    </div>
  )
}
