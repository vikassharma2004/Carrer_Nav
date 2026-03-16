import { motion } from 'framer-motion'

/**
 * NextLearn Card — elevated white card with optional hover scale
 */
export default function Card({
  children,
  hover = true,
  className = '',
  style,
  onClick,
  padding = 'p-6',
}) {
  return (
    <motion.div
      className={`
        bg-white rounded-3xl shadow-card
        ${hover ? 'cursor-pointer' : ''}
        ${padding} ${className}
      `}
      style={style}
      onClick={onClick}
      whileHover={hover ? { scale: 1.025, y: -4, boxShadow: '0 32px 64px rgba(123,97,255,0.18)' } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Bento Card — spans grid areas, with gradient accent border on hover
 */
export function BentoCard({ children, accentColor = '#7B61FF', className = '', span = 1 }) {
  return (
    <motion.div
      className={`
        relative bg-white rounded-3xl shadow-card overflow-hidden
        border border-transparent hover:border-brand-purple/30
        ${className}
      `}
      style={{ gridColumn: `span ${span}` }}
      whileHover={{ scale: 1.02, y: -3, boxShadow: `0 24px 48px ${accentColor}22` }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
        style={{ background: accentColor }}
      />
      <div className="p-6 pt-7">{children}</div>
    </motion.div>
  )
}

/**
 * GlassCard — frosted glass panel
 */
export function GlassCard({ children, className = '', dark = false }) {
  return (
    <div className={`${dark ? 'glass-dark' : 'glass'} rounded-3xl ${className}`}>
      {children}
    </div>
  )
}
