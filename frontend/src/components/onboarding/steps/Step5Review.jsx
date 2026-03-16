import { motion } from 'framer-motion'
import { Loader2, Rocket, Edit2 } from 'lucide-react'

const PERSONA_LABELS = {
  'architect':    '🏗️ The Architect',
  'coach':        '🤝 The Coach',
  'speed-runner': '⚡ The Speed-Runner',
  'deep-thinker': '🧠 The Deep Thinker',
  'builder':      '🔨 The Builder',
}

const EXP_LABELS = { 1: '1–2 years', 3: '3–5 years', 6: '6–9 years', 10: '10+ years' }

function ReviewBlock({ title, onEdit, children }) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-card border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <p className="font-bold text-brand-navy text-sm">{title}</p>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs text-brand-purple font-semibold hover:underline"
        >
          <Edit2 size={12} /> Edit
        </button>
      </div>
      {children}
    </div>
  )
}

export default function Step5Review({ data, onGoToStep, isSubmitting }) {
  const aiEnabled = Object.entries(data.aiPreferences || {})
    .filter(([, v]) => v)
    .map(([k]) => k)

  const aiLabels = {
    autoDebug:         'Auto-debug Code',
    projectFeedback:   'Project Feedback',
    motivationCoach:   'Motivation Coach',
    learningTips:      'Personalized Tips',
    interviewGuidance: 'Interview Guidance',
  }

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
                        bg-brand-yellow/15 border border-brand-yellow/40
                        text-yellow-700 text-xs font-semibold mb-3">
          🏁 Step 5 of 5
        </div>
        <h2 className="text-3xl font-extrabold text-brand-navy leading-tight">
          Review &{' '}
          <span className="gradient-text">launch.</span>
        </h2>
        <p className="text-brand-gray text-sm mt-2">
          Check everything over. You can edit any section before submitting.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Expertise */}
        <ReviewBlock title="Your Expertise" onEdit={() => onGoToStep(1)}>
          <div className="flex flex-wrap gap-2 mb-3">
            {(data.expertise || []).length > 0
              ? data.expertise.map(s => (
                  <span key={s} className="px-3 py-1 rounded-xl text-xs font-semibold bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                    {s}
                  </span>
                ))
              : <span className="text-xs text-brand-gray italic">No skills selected</span>
            }
          </div>
          {data.experienceYears && (
            <p className="text-xs text-brand-gray">
              Experience: <strong className="text-brand-navy">{EXP_LABELS[data.experienceYears]}</strong>
            </p>
          )}
          {data.bio && (
            <p className="text-xs text-brand-gray mt-2 leading-relaxed line-clamp-3">{data.bio}</p>
          )}
        </ReviewBlock>

        {/* Persona */}
        <ReviewBlock title="Mentor Persona" onEdit={() => onGoToStep(2)}>
          {data.availability
            ? <p className="text-sm font-bold text-brand-navy">{PERSONA_LABELS[data.availability] || data.availability}</p>
            : <p className="text-xs text-brand-gray italic">No persona selected</p>
          }
        </ReviewBlock>

        {/* AI */}
        <ReviewBlock title="AI Co-Pilot" onEdit={() => onGoToStep(3)}>
          <div className="flex flex-wrap gap-2">
            {aiEnabled.length > 0
              ? aiEnabled.map(k => (
                  <span key={k} className="px-3 py-1 rounded-xl text-xs font-semibold bg-brand-cyan/10 text-cyan-700 border border-brand-cyan/20">
                    {aiLabels[k] || k}
                  </span>
                ))
              : <span className="text-xs text-brand-gray italic">No AI features enabled</span>
            }
          </div>
        </ReviewBlock>

        {/* Community */}
        <ReviewBlock title="Community & Links" onEdit={() => onGoToStep(4)}>
          <div className="flex flex-col gap-1.5 text-xs text-brand-gray">
            {data.discordHandle  && <p>Discord: <strong className="text-brand-navy">{data.discordHandle}</strong></p>}
            {data.slackWorkspace && <p>Slack: <strong className="text-brand-navy">{data.slackWorkspace}</strong></p>}
            {data.linkedInUrl    && <p>LinkedIn: <strong className="text-brand-navy">{data.linkedInUrl}</strong></p>}
            {data.portfolioUrl   && <p>Portfolio: <strong className="text-brand-navy">{data.portfolioUrl}</strong></p>}
            {!data.discordHandle && !data.slackWorkspace && !data.linkedInUrl && !data.portfolioUrl &&
              <p className="italic">No community links added</p>
            }
          </div>
        </ReviewBlock>
      </div>

      {/* Note */}
      <div className="bg-brand-lavender rounded-2xl px-4 py-3 border border-brand-purple/10">
        <p className="text-xs text-brand-gray leading-relaxed">
          <strong className="text-brand-navy">📝 What happens next:</strong> Your application will be reviewed by our team.
          You'll receive an email notification within 24–48 hours. You can build and preview roadmaps while you wait.
        </p>
      </div>

      {/* Submit indicator (actual button is in the wizard shell) */}
      {isSubmitting && (
        <div className="flex items-center justify-center gap-2 text-brand-purple text-sm font-semibold">
          <Loader2 size={16} className="animate-spin" />
          Submitting your application…
        </div>
      )}
    </motion.div>
  )
}
