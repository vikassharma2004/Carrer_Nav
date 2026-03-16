import { motion } from 'framer-motion'

/**
 * NextLearn Button variants
 * variant: 'primary' | 'secondary' | 'ghost' | 'outline' | 'mint' | 'dark'
 * size:    'sm' | 'md' | 'lg' | 'xl'
 */
export default function Button({
  children,
  variant = 'primary',
  size    = 'md',
  icon,
  iconRight,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  href,
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer select-none'

  const sizes = {
    sm:  'px-4 py-2 text-sm rounded-xl',
    md:  'px-6 py-3 text-sm rounded-2xl',
    lg:  'px-8 py-4 text-base rounded-2xl',
    xl:  'px-10 py-5 text-lg rounded-3xl',
  }

  const variants = {
    primary:   'bg-brand-purple text-white shadow-card hover:bg-brand-purple2 hover:shadow-glow',
    secondary: 'bg-brand-lavender text-brand-navy border border-brand-purple/20 hover:border-brand-purple/60 hover:bg-brand-purple/8',
    ghost:     'text-brand-purple hover:bg-brand-purple/10',
    outline:   'border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white',
    mint:      'bg-brand-mint text-brand-navy font-bold hover:shadow-mint',
    dark:      'bg-brand-navy text-white hover:bg-[#2d2d44]',
    gradient:  'bg-gradient-brand text-white shadow-card hover:shadow-glow',
  }

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`

  const Tag = href ? 'a' : motion.button

  return (
    <Tag
      type={href ? undefined : type}
      href={href}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03, y: -1 }}
      whileTap={disabled  ? {} : { scale: 0.97 }}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </Tag>
  )
}
