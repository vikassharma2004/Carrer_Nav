import { useEffect, useState, useRef } from 'react'

/**
 * Typewriter effect hook.
 * @param {string[]} lines       Array of strings to cycle through
 * @param {number}   speed       Typing speed in ms per character
 * @param {number}   pauseMs     Pause at end of each word before erasing
 * @param {boolean}  active      Whether the animation is running
 */
export function useTypewriter(lines = [], speed = 55, pauseMs = 1800, active = true) {
  const [displayText, setDisplayText] = useState('')
  const [lineIndex,   setLineIndex]   = useState(0)
  const [charIndex,   setCharIndex]   = useState(0)
  const [isDeleting,  setIsDeleting]  = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!active || lines.length === 0) return

    const currentLine = lines[lineIndex]

    const tick = () => {
      if (!isDeleting) {
        // Typing forward
        if (charIndex < currentLine.length) {
          setCharIndex(i => i + 1)
          setDisplayText(currentLine.slice(0, charIndex + 1))
          timeoutRef.current = setTimeout(tick, speed)
        } else {
          // Finished typing — pause then start deleting
          timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseMs)
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setCharIndex(i => i - 1)
          setDisplayText(currentLine.slice(0, charIndex - 1))
          timeoutRef.current = setTimeout(tick, speed * 0.55)
        } else {
          // Move to next line
          setIsDeleting(false)
          setLineIndex(i => (i + 1) % lines.length)
          timeoutRef.current = setTimeout(tick, 400)
        }
      }
    }

    timeoutRef.current = setTimeout(tick, speed)
    return () => clearTimeout(timeoutRef.current)
  }, [charIndex, isDeleting, lineIndex, lines, speed, pauseMs, active])

  return { displayText, isTyping: !isDeleting }
}

/**
 * Simple one-shot typewriter for static messages.
 */
export function useSimpleTypewriter(text = '', speed = 45, active = true) {
  const [displayed, setDisplayed] = useState('')
  const indexRef   = useRef(0)

  useEffect(() => {
    if (!active) return
    indexRef.current = 0
    setDisplayed('')

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1))
        indexRef.current++
      } else {
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, active])

  return displayed
}
