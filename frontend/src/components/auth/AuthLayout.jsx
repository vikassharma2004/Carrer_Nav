import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import RoadmapNode, { NodeConnector } from '../ui/RoadmapNode'

// The animated left-panel visual panel nodes
const panelNodes = [
  { step: '01', status: 'done',   label: 'Sign Up',       time: '30s'  },
  { step: '02', status: 'done',   label: 'Verify Email',  time: '1 min'},
  { step: '03', status: 'active', label: 'Set Your Path', time: '2 min'},
  { step: '04', status: 'locked', label: 'Build & Earn',  time: '∞'   },
]

const floatingAvatars = [
  { initials: 'AK', color: '#7B61FF', x: '12%', y: '22%', delay: 0    },
  { initials: 'SR', color: '#FF4DCA', x: '80%', y: '18%', delay: 0.3  },
  { initials: 'MJ', color: '#00F5A0', x: '78%', y: '68%', delay: 0.6  },
  { initials: 'PL', color: '#00E5FF', x: '10%', y: '72%', delay: 0.9  },
]

/**
 * Split-screen auth wrapper.
 * Left: animated dark panel with roadmap visual
 * Right: glassmorphic form card
 */
export default function AuthLayout({ children, headlineTop, headlineBottom, subtext }) {
  return (
    <div className="min-h-screen flex font-sans">

      {/* ── Left panel ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden
                      bg-gradient-dark flex-col justify-between p-12">
        {/* Mesh gradient blobs */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(123,97,255,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(0,229,255,0.2),transparent_55%)]" />
        <div className="orb orb-purple absolute top-10 left-10 w-72 h-72 opacity-30" />
        <div className="orb orb-pink   absolute bottom-20 right-0 w-64 h-64 opacity-20" />
        <div className="dot-grid absolute inset-0 opacity-25" />

        {/* Floating avatars */}
        {floatingAvatars.map(({ initials, color, x, y, delay }) => (
          <motion.div
            key={initials}
            className="absolute w-12 h-12 rounded-2xl flex items-center justify-center
                       font-bold text-white text-sm shadow-lg z-10"
            style={{ left: x, top: y, background: color, boxShadow: `0 0 20px ${color}60` }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.8, type: 'spring', stiffness: 250 }}
          >
            {initials}
          </motion.div>
        ))}

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow">
              <Zap size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              Career<span className="gradient-text">Nav</span>
            </span>
          </Link>
        </div>

        {/* Center: headline + roadmap preview */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.h2
            className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {headlineTop}
            <br />
            <span className="gradient-text">{headlineBottom}</span>
          </motion.h2>

          {subtext && (
            <motion.p
              className="text-gray-400 text-base leading-relaxed mb-10 max-w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {subtext}
            </motion.p>
          )}

          {/* Mini roadmap */}
          <motion.div
            className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-3xl p-6 max-w-xs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="text-xs font-mono text-brand-purple mb-4">
              path: your_journey_roadmap
            </p>
            <div className="flex flex-col items-start">
              {panelNodes.map((node, i) => (
                <div key={node.step} className="flex flex-col">
                  <div className="flex items-center gap-4">
                    <RoadmapNode step={node.step} status={node.status} size={40} />
                    <div>
                      <p className={`text-sm font-semibold ${
                        node.status === 'locked' ? 'text-gray-500' : 'text-white'
                      }`}>
                        {node.label}
                      </p>
                      <p className="text-xs font-mono text-gray-500">{`est: ${node.time}`}</p>
                    </div>
                  </div>
                  {i < panelNodes.length - 1 && (
                    <div className="ml-5 my-0.5">
                      <NodeConnector direction="vertical" done={node.status === 'done'} length={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom trust line */}
        <div className="relative z-10 flex items-center gap-6 text-xs text-gray-500">
          <span>🔐 256-bit encrypted</span>
          <span>📧 No spam ever</span>
          <span>🚀 84k+ learners</span>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center
                      bg-brand-lavender px-6 py-12 relative overflow-hidden">
        {/* Soft bg blobs */}
        <div className="orb orb-purple absolute top-0 right-0 w-80 h-80 opacity-[0.08]" />
        <div className="orb orb-cyan   absolute bottom-0 left-0 w-64 h-64 opacity-[0.07]" />

        {/* Mobile logo */}
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center">
            <Zap size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-extrabold text-brand-navy">
            Career<span className="gradient-text">Nav</span>
          </span>
        </Link>

        {/* The auth card */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="bg-white rounded-[32px] shadow-card-lg border border-brand-purple/10 p-8 md:p-10">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
