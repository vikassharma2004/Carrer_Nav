/**
 * NextLearn Badge
 * variant: 'purple' | 'mint' | 'pink' | 'yellow' | 'cyan' | 'gray'
 */
export default function Badge({ children, variant = 'purple', className = '' }) {
  const variants = {
    purple: 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20',
    mint:   'bg-brand-mint/15 text-emerald-700 border border-brand-mint/30',
    pink:   'bg-brand-pink/10 text-pink-600 border border-brand-pink/20',
    yellow: 'bg-brand-yellow/20 text-yellow-700 border border-brand-yellow/40',
    cyan:   'bg-brand-cyan/10 text-cyan-700 border border-brand-cyan/20',
    gray:   'bg-gray-100 text-brand-gray border border-gray-200',
    new:    'bg-gradient-ai text-white border-0 shadow-sm',
    live:   'bg-brand-pink text-white border-0 shadow-sm animate-pulse',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
        ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
