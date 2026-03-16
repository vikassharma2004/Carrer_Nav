import { motion } from 'framer-motion'

/**
 * Animated roadmap node — circular element with pulse ring
 * status: 'done' | 'active' | 'locked'
 */
export default function RoadmapNode({
  label,
  step,
  status  = 'locked',
  size    = 56,
  onClick,
  className = '',
}) {
  const colors = {
    done:   { bg: '#00F5A0', text: '#1D1D2E', ring: '#00F5A0', glow: '0 0 24px rgba(0,245,160,0.60)' },
    active: { bg: '#7B61FF', text: '#FFFFFF',  ring: '#7B61FF', glow: '0 0 30px rgba(123,97,255,0.70)' },
    locked: { bg: '#F8F9FF', text: '#676775',  ring: '#E5E7EB', glow: 'none' },
  }

  const c = colors[status]

  return (
    <motion.div
      className={`relative flex items-center justify-center rounded-full font-bold font-mono text-sm cursor-pointer select-none ${className}`}
      style={{
        width:     size,
        height:    size,
        background: c.bg,
        color:      c.text,
        boxShadow:  c.glow,
        border:     `2px solid ${c.ring}`,
      }}
      onClick={onClick}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {/* Pulse ring for active node */}
      {status === 'active' && (
        <>
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: '#7B61FF', opacity: 0.35 }}
          />
          <span
            className="absolute rounded-full animate-node-ring"
            style={{
              inset: -6,
              border: '2px solid #7B61FF',
              borderRadius: '50%',
            }}
          />
        </>
      )}

      {/* Completion check for done nodes */}
      {status === 'done' ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="#1D1D2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <span>{step ?? '?'}</span>
      )}

      {/* Tooltip label */}
      {label && (
        <motion.div
          className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap
                     bg-brand-navy text-white text-xs font-medium px-2 py-1 rounded-lg
                     pointer-events-none opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0, y: -4 }}
          whileHover={{ opacity: 1, y: 0 }}
        >
          {label}
        </motion.div>
      )}
    </motion.div>
  )
}

/**
 * Mini roadmap connector line (vertical or horizontal)
 */
export function NodeConnector({ direction = 'vertical', done = false, length = 48 }) {
  const style = direction === 'vertical'
    ? { width: 2, height: length }
    : { height: 2, width: length }

  return (
    <div
      className="rounded-full transition-all duration-700"
      style={{
        ...style,
        background: done
          ? 'linear-gradient(135deg,#00F5A0,#7B61FF)'
          : '#E5E7EB',
      }}
    />
  )
}
