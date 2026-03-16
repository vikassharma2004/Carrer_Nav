import { motion } from 'framer-motion'

const PERSONAS = [
  {
    id:    'architect',
    emoji: '🏗️',
    title: 'The Architect',
    desc:  'Big-picture thinker. You love system design, scalable patterns, and helping learners see the full blueprint before writing a line of code.',
    color: '#7B61FF',
    bg:    'rgba(123,97,255,0.08)',
  },
  {
    id:    'coach',
    emoji: '🤝',
    title: 'The Coach',
    desc:  'Empathy-first mentor. You meet learners where they are, celebrate every small win, and guide them step by step with patience.',
    color: '#FF4DCA',
    bg:    'rgba(255,77,202,0.08)',
  },
  {
    id:    'speed-runner',
    emoji: '⚡',
    title: 'The Speed-Runner',
    desc:  'No fluff, all signal. You fast-track learners through the essentials and get them building and shipping as fast as humanly possible.',
    color: '#F9FF38',
    bg:    'rgba(249,255,56,0.10)',
  },
  {
    id:    'deep-thinker',
    emoji: '🧠',
    title: 'The Deep Thinker',
    desc:  'First-principles master. You go below the surface, explain the "why", and build rock-solid fundamentals that last a career.',
    color: '#00E5FF',
    bg:    'rgba(0,229,255,0.08)',
  },
  {
    id:    'builder',
    emoji: '🔨',
    title: 'The Builder',
    desc:  'Portfolio-obsessed. Real-world projects are your language. You push learners to ship, iterate, and build things they are proud to show off.',
    color: '#00F5A0',
    bg:    'rgba(0,245,160,0.08)',
  },
]

export default function Step2Persona({ data, onChange }) {
  const selected = data.availability || ''

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6"
    >
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                        bg-brand-pink/10 border border-brand-pink/20
                        text-brand-pink text-xs font-semibold mb-3">
          ✨ Step 2 of 5
        </div>
        <h2 className="text-3xl font-extrabold text-brand-navy leading-tight">
          Pick your <span className="gradient-text-ai">vibe.</span>
        </h2>
        <p className="text-brand-gray text-sm mt-2">
          Your mentor persona shapes how learners discover and connect with you.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {PERSONAS.map((p) => {
          const on = selected === p.id
          return (
            <motion.button
              key={p.id}
              type="button"
              onClick={() => onChange({ availability: p.id })}
              className="text-left flex items-start gap-4 p-5 rounded-3xl border-2 transition-all duration-250"
              style={{
                background:   on ? p.bg      : '#FAFAFA',
                borderColor:  on ? p.color   : '#E5E7EB',
                boxShadow:    on ? `0 8px 24px ${p.color}30` : 'none',
              }}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: on ? p.color : p.bg }}
              >
                {p.emoji}
              </div>
              <div>
                <p className="font-extrabold text-brand-navy text-base mb-1" style={{ color: on ? p.color : undefined }}>
                  {p.title}
                </p>
                <p className="text-sm text-brand-gray leading-relaxed">{p.desc}</p>
              </div>

              {/* Selected check */}
              {on && (
                <div className="ml-auto shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                     style={{ background: p.color }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
