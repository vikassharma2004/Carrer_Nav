import { motion } from 'framer-motion'

const STEPS = [
  { id: 1, label: 'Expertise'  },
  { id: 2, label: 'Persona'    },
  { id: 3, label: 'AI Co-Pilot'},
  { id: 4, label: 'Community'  },
  { id: 5, label: 'Review'     },
]

export default function WizardProgress({ current }) {
  return (
    <div className="flex items-center justify-center w-full select-none">
      {STEPS.map((step, i) => {
        const done   = step.id < current
        const active = step.id === current
        const locked = step.id > current

        return (
          <div key={step.id} className="flex items-center">
            {/* Node */}
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                className="relative flex items-center justify-center rounded-full font-bold text-xs"
                style={{
                  width:      36,
                  height:     36,
                  background: done   ? '#00F5A0'
                            : active ? '#7B61FF'
                            : '#E5E7EB',
                  color:      done   ? '#1D1D2E'
                            : active ? '#FFFFFF'
                            : '#9CA3AF',
                  boxShadow:  active ? '0 0 20px rgba(123,97,255,0.6)' : 'none',
                  border:     active ? '2px solid rgba(123,97,255,0.8)' : '2px solid transparent',
                }}
                animate={{
                  scale: active ? [1, 1.08, 1] : 1,
                }}
                transition={{ duration: 1.8, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
              >
                {/* Active pulse ring */}
                {active && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: '#7B61FF', opacity: 0.25 }}
                  />
                )}
                {done
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="#1D1D2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  : <span>{step.id}</span>
                }
              </motion.div>

              {/* Label */}
              <span className={`text-[10px] font-semibold whitespace-nowrap
                ${active ? 'text-brand-purple' : done ? 'text-brand-mint' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>

            {/* Connector line between nodes */}
            {i < STEPS.length - 1 && (
              <div className="mx-1 mb-4 flex-shrink-0" style={{ width: 32, height: 2 }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: done
                      ? 'linear-gradient(90deg,#00F5A0,#7B61FF)'
                      : '#E5E7EB',
                  }}
                  initial={false}
                  animate={{ scaleX: 1 }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
