import { motion } from 'framer-motion'
import { Link2, Linkedin, Globe } from 'lucide-react'

const INTEGRATIONS = [
  {
    id:     'discord',
    name:   'Discord',
    desc:   'Connect your Discord handle to join the mentor community server.',
    emoji:  '🎮',
    color:  '#5865F2',
    placeholder: 'YourHandle#1234',
    field:  'discordHandle',
  },
  {
    id:     'slack',
    name:   'Slack',
    desc:   'Link your Slack workspace for async team collaboration.',
    emoji:  '💬',
    color:  '#4A154B',
    placeholder: 'workspace-name',
    field:  'slackWorkspace',
  },
]

const inputClass = "w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-brand-lavender text-brand-navy placeholder-gray-400 text-sm font-medium focus:outline-none focus:border-brand-purple focus:bg-white transition-all duration-200"

export default function Step4Community({ data, onChange }) {
  const set = (field) => (e) => onChange({ [field]: e.target.value })

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-8"
    >
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                        bg-brand-mint/10 border border-brand-mint/25
                        text-emerald-600 text-xs font-semibold mb-3">
          👥 Step 4 of 5
        </div>
        <h2 className="text-3xl font-extrabold text-brand-navy leading-tight">
          Join the <span className="gradient-text-mint">community.</span>
        </h2>
        <p className="text-brand-gray text-sm mt-2">
          Connect your tools to collaborate, support learners, and grow your mentor network.
        </p>
      </div>

      {/* Integration cards */}
      <div className="flex flex-col gap-4">
        {INTEGRATIONS.map(({ id, name, desc, emoji, color, placeholder, field }) => (
          <div
            key={id}
            className="bg-white rounded-3xl p-5 shadow-card border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                   style={{ background: `${color}18` }}>
                {emoji}
              </div>
              <div>
                <p className="font-bold text-brand-navy text-sm">{name}</p>
                <p className="text-xs text-brand-gray">{desc}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                {data[field]
                  ? <span className="text-xs font-semibold text-brand-mint bg-brand-mint/10 px-2.5 py-1 rounded-xl border border-brand-mint/25">Connected</span>
                  : <span className="text-xs text-brand-gray">Optional</span>
                }
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link2 size={14} className="text-brand-gray shrink-0" />
              <input
                type="text"
                placeholder={placeholder}
                value={data[field] || ''}
                onChange={set(field)}
                className={inputClass}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Professional profiles */}
      <div>
        <p className="text-sm font-semibold text-brand-navy mb-4">
          Professional profiles{' '}
          <span className="text-brand-gray font-normal">(optional but recommended)</span>
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Linkedin size={16} className="text-blue-600" />
            </div>
            <input
              type="url"
              placeholder="https://linkedin.com/in/yourname"
              value={data.linkedInUrl || ''}
              onChange={set('linkedInUrl')}
              className={inputClass}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
              <Globe size={16} className="text-brand-purple" />
            </div>
            <input
              type="url"
              placeholder="https://yourportfolio.com"
              value={data.portfolioUrl || ''}
              onChange={set('portfolioUrl')}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
