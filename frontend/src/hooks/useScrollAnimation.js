import { useEffect, useRef, useState } from 'react'

/**
 * Returns { ref, inView } — triggers once when element enters viewport.
 * @param {number} threshold  0–1, portion of element visible before trigger
 * @param {string} rootMargin CSS margin string (e.g. "0px 0px -80px 0px")
 */
export function useScrollAnimation(threshold = 0.15, rootMargin = '0px 0px -60px 0px') {
  const ref     = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)   // fire only once
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, inView }
}

/**
 * Staggered variant — returns an array of { ref, inView } objects.
 * Use to animate a list of items with different delays.
 */
export function useStaggerAnimation(count, threshold = 0.1) {
  const containerRef = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  // Generate delay values for each child
  const delays = Array.from({ length: count }, (_, i) => i * 120)

  return { containerRef, inView, delays }
}
