import { motion } from 'framer-motion'
import { Bot, Zap } from 'lucide-react'

const CAPABILITIES = [
  { id: 'autoDebug',         emoji: '🔍', label: 'Auto-debug Code',         desc: 'AI reviews and helps debug student code in real-time.' },
  { id: 'projectFeedback',   emoji: '📋', label: 'Project Feedback',        desc: 'Automated rubric-based feedback on submitted projects.' },
  { id: 'motivationCoach',   emoji: '🔥', label: 'Motivation & Accountability', desc: 'Nudges, streaks, and encouragement for learners who go quiet.' },
  { id: 'learningTips',      emoji: '💡', label: 'Personalized Tips',       desc: 'AI adapts explanations to each learner\'s style and pace.' },
  { id: 'interviewGuidance', emoji: '💼', label: 'Interview Guidance',      desc: 'Mock interview prep, salary tips, and career coaching.' },
]

function Toggle({ on, onToggle, color = '#7B61FF' }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className="relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0"
      style={{ background: on ? color : '#E5E7EB' }}
      whileTap={{ scale: 0.92 }}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
        animate={{ left: on ? '26px' : '2px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  )
}

export default function Step3AICopilot({ data, onChange }) {
  const prefs = data.aiPreferences || {
    autoDebug: true,
    projectFeedback: true,
    motivationCoach: true,
    learningTips: true,
    interviewGuidance: false,
  }

  const toggle = (id) => {
    onChange({ aiPreferences: { ...prefs, [id]: !prefs[id] } })
  }

  const enabledCount = Object.values(prefs).filter(Boolean).length

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
                        bg-brand-cyan/10 border border-brand-cyan/20
                        text-cyan-600 text-xs font-semibold mb-3">
          🤖 Step 3 of 5
        </div>
        <h2 className="text-3xl font-extrabold text-brand-navy leading-tight">
          Configure your <span className="gradient-text-ai">AI Co-Pilot.</span>
        </h2>
        <p className="text-brand-gray text-sm mt-2">
          Your AI assistant can do the heavy lifting. Toggle what powers you want active.
        </p>
      </div>

      {/* AI Card */}
      <div className="relative rounded-3xl overflow-hidden">
        {/* Dark navy + mesh gradient background */}
        <div className="bg-brand-navy rounded-3xl p-6">
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_top_left,rgba(0,229,255,0.2),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(123,97,255,0.3),transparent_55%)]" />

          {/* Central orb */}
          <div className="relative z-10 flex items-center gap-4 mb-6 pb-5 border-b border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-ai flex items-center justify-center animate-glow-pulse shrink-0">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white font-extrabold text-lg leading-tight">CareerNav AI</p>
              <p className="text-brand-cyan text-xs font-mono">model: mentor-assist-v2 · Active</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-brand-mint animate-pulse" />
              <span className="text-xs text-brand-mint font-semibold">{enabledCount} active</span>
            </div>
          </div>

          {/* Capability toggles */}
          <div className="relative z-10 flex flex-col gap-4">
            {CAPABILITIES.map(({ id, emoji, label, desc }) => {
              const on = !!prefs[id]
              return (
                <div key={id} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                       style={{ background: on ? 'rgba(123,97,255,0.25)' : 'rgba(255,255,255,0.06)' }}>
                    {emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${on ? 'text-white' : 'text-gray-400'}`}>{label}</p>
                    <p className="text-xs text-gray-500 leading-snug mt-0.5">{desc}</p>
                  </div>
                  <Toggle on={on} onToggle={() => toggle(id)} />
                </div>
              )
            })}
          </div>

          {/* Status strip */}
          <div className="relative z-10 mt-5 pt-4 border-t border-white/10
                          flex items-center gap-2 text-xs text-gray-500">
            <Zap size={12} className="text-brand-yellow" />
            Powered by Claude · Contextual to every learner's roadmap step
          </div>
        </div>
      </div>
    </motion.div>
  )
}
