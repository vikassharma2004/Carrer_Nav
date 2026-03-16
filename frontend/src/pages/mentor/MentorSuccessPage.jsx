import { motion } from 'framer-motion'
import { Link }   from 'react-router-dom'
import { Zap, Users, ArrowRight, Sparkles } from 'lucide-react'
import RoadmapNode, { NodeConnector } from '../../components/ui/RoadmapNode'
import useAuthStore from '../../store/useAuthStore'

// Celebratory floating badge items
const FLOATERS = [
  { emoji: '🏆', label: 'Mentor Badge',    x: '-8%',  y: '15%', delay: 0.6, color: '#F9FF38' },
  { emoji: '🚀', label: 'First Roadmap',   x: '105%', y: '20%', delay: 0.9, color: '#7B61FF' },
  { emoji: '🌟', label: 'Community Star',  x: '-10%', y: '68%', delay: 1.2, color: '#FF4DCA' },
  { emoji: '⚡', label: 'AI Powered',      x: '108%', y: '65%', delay: 1.5, color: '#00E5FF' },
]

export default function MentorSuccessPage() {
  const { user } = useAuthStore()
  const firstName = user?.name?.split(' ')[0] || 'Mentor'

  const nodeData = [
    { step: '01', status: 'done',   label: 'Application Submitted' },
    { step: '02', status: 'active', label: 'Under Review (24–48h)'  },
    { step: '03', status: 'locked', label: 'Build Roadmaps'         },
    { step: '04', status: 'locked', label: 'Earn & Grow'            },
  ]

  return (
    <div className="min-h-screen bg-gradient-dark font-sans relative overflow-hidden flex flex-col items-center justify-center px-6 py-16">
      {/* Orbs */}
      <div className="orb orb-purple absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-25" />
      <div className="orb orb-cyan   absolute top-0 right-0 w-96 h-96 opacity-15" />
      <div className="orb orb-pink   absolute bottom-0 left-0 w-80 h-80 opacity-12" />
      <div className="dot-grid absolute inset-0 opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-purple to-transparent" />

      {/* Top logo */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center">
          <Zap size={15} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-extrabold text-white">
          Career<span className="gradient-text">Nav</span>
        </span>
      </Link>

      {/* Main card */}
      <motion.div
        className="relative z-10 w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Floating badges */}
        {FLOATERS.map(({ emoji, label, x, y, delay, color }) => (
          <motion.div
            key={label}
            className="absolute flex items-center gap-1.5 bg-white/10 backdrop-blur-sm
                       border border-white/15 rounded-2xl px-3 py-2 text-white text-xs font-semibold
                       whitespace-nowrap shadow-lg"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay, type: 'spring', stiffness: 250 }}
          >
            <span>{emoji}</span>
            <span style={{ color }}>{label}</span>
          </motion.div>
        ))}

        {/* Success card */}
        <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-[32px] p-10 text-center">
          {/* Big celebration emoji */}
          <motion.div
            className="text-7xl mb-5 mx-auto w-fit"
            animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            🎉
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-brand-cyan text-sm font-semibold font-mono mb-3 tracking-wide">
              APPLICATION SUBMITTED
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              You're now a<br />
              <span className="gradient-text-ai">Roadmap Architect</span>
              ,<br />
              {firstName}!
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm mx-auto mb-8">
              Your application is under review. We'll email you in <strong className="text-white">24–48 hours</strong>.
              In the meantime, start exploring.
            </p>
          </motion.div>

          {/* Mini roadmap showing where they are */}
          <motion.div
            className="bg-white/6 rounded-2xl p-5 mb-8 text-left"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-xs font-mono text-brand-purple mb-4">path: mentor_journey</p>
            <div className="flex flex-col items-start gap-0">
              {nodeData.map((node, i) => (
                <div key={node.step} className="flex flex-col items-start">
                  <div className="flex items-center gap-3">
                    <RoadmapNode step={node.step} status={node.status} size={36} />
                    <p className={`text-sm font-semibold ${
                      node.status === 'locked' ? 'text-gray-500' : 'text-white'
                    }`}>{node.label}</p>
                  </div>
                  {i < nodeData.length - 1 && (
                    <div className="ml-[17px] my-0.5">
                      <NodeConnector direction="vertical" done={node.status === 'done'} length={18} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Link
              to="/dashboard"
              className="flex-1 flex items-center justify-center gap-2
                         bg-brand-purple text-white font-bold rounded-2xl py-4 text-sm
                         shadow-glow hover:bg-brand-purple2 hover:shadow-card-lg transition-all duration-200"
            >
              <Sparkles size={16} />
              Build My First Roadmap
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2
                         border-2 border-brand-mint/40 text-brand-mint font-bold rounded-2xl py-4 text-sm
                         hover:bg-brand-mint/10 transition-all duration-200"
            >
              <Users size={16} />
              Meet the Community
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
