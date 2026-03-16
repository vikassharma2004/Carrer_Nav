import { motion } from 'framer-motion'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

/**
 * Reusable section header with staggered fade-up animation
 */
export default function SectionHeader({
  eyebrow,
  title,
  highlight,
  description,
  center = true,
  className = '',
}) {
  const { ref, inView } = useScrollAnimation()

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  }
  const item = {
    hidden: { opacity: 0, y: 28 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <motion.div
      ref={ref}
      className={`${center ? 'text-center' : ''} ${className}`}
      variants={container}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
    >
      {eyebrow && (
        <motion.div variants={item} className="mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                           bg-brand-purple/10 border border-brand-purple/20
                           text-brand-purple text-sm font-semibold">
            {eyebrow}
          </span>
        </motion.div>
      )}

      <motion.h2
        variants={item}
        className="text-4xl md:text-5xl font-extrabold text-brand-navy leading-tight tracking-tight"
      >
        {title}{' '}
        {highlight && (
          <span className="gradient-text">{highlight}</span>
        )}
      </motion.h2>

      {description && (
        <motion.p
          variants={item}
          className={`mt-5 text-brand-gray text-lg leading-relaxed max-w-2xl
                      ${center ? 'mx-auto' : ''}`}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}
