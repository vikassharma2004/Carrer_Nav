import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Fade + slide-up a single element when it enters the viewport.
 * Uses autoAlpha (opacity + visibility) to avoid flash-of-invisible-content.
 *
 * @param {object} opts
 * @param {number} opts.y          – start translateY in px  (default 50)
 * @param {number} opts.x          – start translateX in px  (default 0)
 * @param {number} opts.duration   – animation duration in s (default 0.8)
 * @param {number} opts.delay      – delay in s              (default 0)
 * @param {string} opts.ease       – GSAP ease string        (default 'power3.out')
 * @param {string} opts.start      – ScrollTrigger start     (default 'top 88%')
 */
export function useGsapReveal({
  y = 50,
  x = 0,
  duration = 0.8,
  delay = 0,
  ease = 'power3.out',
  start = 'top 88%',
} = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y, x },
        {
          autoAlpha: 1,
          y: 0,
          x: 0,
          duration,
          delay,
          ease,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return ref
}

/**
 * Staggered fade + slide-up of immediate children (or custom selector) inside a container.
 *
 * @param {object} opts
 * @param {string} opts.selector   – child selector (default ':scope > *')
 * @param {number} opts.stagger    – stagger delay in s     (default 0.12)
 * @param {number} opts.y          – start translateY       (default 40)
 * @param {number} opts.duration   – per-item duration in s (default 0.65)
 * @param {string} opts.ease       – GSAP ease string       (default 'power3.out')
 * @param {string} opts.start      – ScrollTrigger start    (default 'top 82%')
 */
export function useGsapStagger({
  selector = ':scope > *',
  stagger = 0.12,
  y = 40,
  duration = 0.65,
  ease = 'power3.out',
  start = 'top 82%',
} = {}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      const items = container.querySelectorAll(selector)
      if (!items.length) return

      gsap.fromTo(
        items,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          stagger,
          ease,
          scrollTrigger: {
            trigger: container,
            start,
            once: true,
          },
        }
      )
    }, container)

    return () => ctx.revert()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return containerRef
}

/**
 * Draw SVG strokes from 0 to full length using strokeDashoffset.
 * Expects elements to have pathLength="1" + strokeDasharray="1" set in JSX.
 *
 * @param {object} opts
 * @param {string} opts.selector   – SVG element selector (default 'line, path, polyline')
 * @param {number} opts.duration   – per-stroke duration in s (default 1.2)
 * @param {number} opts.stagger    – stagger delay in s       (default 0.25)
 * @param {string} opts.ease       – GSAP ease                (default 'power2.out')
 * @param {string} opts.start      – ScrollTrigger start      (default 'top 80%')
 */
export function useGsapSvgDraw({
  selector = 'line, path, polyline',
  duration = 1.2,
  stagger = 0.25,
  ease = 'power2.out',
  start = 'top 80%',
} = {}) {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const ctx = gsap.context(() => {
      const strokes = svg.querySelectorAll(selector)
      if (!strokes.length) return

      gsap.fromTo(
        strokes,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration,
          stagger,
          ease,
          scrollTrigger: {
            trigger: svg,
            start,
            once: true,
          },
        }
      )
    }, svg)

    return () => ctx.revert()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return svgRef
}
