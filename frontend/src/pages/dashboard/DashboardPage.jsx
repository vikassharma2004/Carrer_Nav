import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Map,
  CheckSquare,
  Users,
  Bot,
  Flame,
  TrendingUp,
  Clock,
  ArrowRight,
  Star,
  BookOpen,
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import roadmapService from '../../services/roadmapService'

/* ─── Stagger animation helper ───────────────────────────────── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

/* ─── Mock data (replace with real API calls when endpoints exist) */
const MOCK_STATS = [
  { icon: Map,         label: 'Roadmaps Following', value: 4,    color: 'bg-blue-50 text-blue-600'     },
  { icon: CheckSquare, label: 'Tasks Completed',    value: 38,   color: 'bg-green-50 text-green-600'   },
  { icon: Users,       label: 'Communities Joined', value: 3,    color: 'bg-purple-50 text-purple-600' },
  { icon: Bot,         label: 'AI Help Sessions',   value: 12,   color: 'bg-[#FFF3F0] text-dash-primary'},
  { icon: Flame,       label: 'Learning Streak',    value: '7d', color: 'bg-amber-50 text-amber-600'   },
]

const MOCK_PROGRESS = [
  { title: 'Fullstack Developer Roadmap', progress: 62, modules: 12, done: 7,  domain: 'fullstack' },
  { title: 'React Frontend Mastery',      progress: 40, modules: 8,  done: 3,  domain: 'frontend'  },
  { title: 'DevOps & Cloud Engineering',  progress: 18, modules: 10, done: 2,  domain: 'devops'    },
]

const MOCK_ACTIVITY = [
  { type: 'complete', text: 'Completed "React Hooks Deep Dive"',        time: '2h ago'  },
  { type: 'follow',   text: 'Started following "Backend Roadmap"',       time: '5h ago'  },
  { type: 'ai',       text: 'Asked AI about Redis caching strategies',   time: '1d ago'  },
  { type: 'complete', text: 'Completed "CSS Grid Layout" task',          time: '2d ago'  },
  { type: 'follow',   text: 'Joined Frontend Developers community',      time: '3d ago'  },
]

const ACTIVITY_META = {
  complete: { icon: '✅', color: 'bg-green-50 text-green-600' },
  follow:   { icon: '⭐', color: 'bg-amber-50 text-amber-600' },
  ai:       { icon: '🤖', color: 'bg-[#FFF3F0] text-dash-primary' },
}

const DOMAIN_COLORS = {
  frontend:  'bg-blue-100 text-blue-700',
  backend:   'bg-green-100 text-green-700',
  fullstack: 'bg-purple-100 text-purple-700',
  devops:    'bg-amber-100 text-amber-700',
  'ai-ml':   'bg-pink-100 text-pink-700',
  security:  'bg-red-100 text-red-700',
  data:      'bg-teal-100 text-teal-700',
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div variants={itemVariants} className="dash-card dash-card-hover p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-dash-text">{value}</p>
        <p className="text-[12px] text-dash-muted mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}

function ProgressBar({ progress }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
        className="h-full rounded-full bg-dash-primary"
      />
    </div>
  )
}

function RoadmapCard({ title, shortDescription, coverImage, level, domain, isPaid, _id }) {
  const navigate = useNavigate()
  const levelColor = {
    beginner:     'dash-badge-green',
    intermediate: 'dash-badge-amber',
    advanced:     'dash-badge-red',
  }[level] ?? 'dash-badge-gray'

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
      className="dash-card overflow-hidden cursor-pointer"
      onClick={() => navigate(`/roadmaps/${_id}`)}
    >
      {/* Cover */}
      <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {coverImage
          ? <img src={coverImage} alt={title} className="w-full h-full object-cover" />
          : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="text-gray-300" size={36} />
            </div>
          )
        }
        <span className={`absolute top-2 left-2 dash-badge ${levelColor} capitalize`}>
          {level}
        </span>
        {isPaid && (
          <span className="absolute top-2 right-2 dash-badge dash-badge-amber">Paid</span>
        )}
      </div>

      <div className="p-4">
        {domain && (
          <span className={`dash-badge text-[10px] mb-2 inline-flex ${DOMAIN_COLORS[domain] ?? 'bg-gray-100 text-gray-600'}`}>
            {domain}
          </span>
        )}
        <h3 className="font-semibold text-[14px] text-dash-text leading-snug line-clamp-2">
          {title}
        </h3>
        {shortDescription && (
          <p className="text-[12px] text-dash-muted mt-1 line-clamp-2 leading-snug">
            {shortDescription}
          </p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <Star size={13} className="text-amber-400 fill-amber-400" />
          <span className="text-[12px] font-medium text-dash-text">4.8</span>
          <span className="text-[12px] text-dash-muted ml-auto flex items-center gap-1">
            <Users size={12} /> 2.4k learners
          </span>
        </div>
        <button
          className="mt-3 w-full dash-btn-primary text-[13px] py-2"
          onClick={(e) => { e.stopPropagation(); navigate(`/roadmaps/${_id}`) }}
        >
          View Roadmap
        </button>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [roadmaps, setRoadmaps] = useState([])
  const [loadingRM, setLoadingRM] = useState(true)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    roadmapService
      .getPublished({ limit: 4 })
      .then((res) => setRoadmaps(res.data ?? []))
      .catch(() => setRoadmaps([]))
      .finally(() => setLoadingRM(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ── Greeting Banner ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-dash-text">
            {greeting}, {user?.name?.split(' ')[0] ?? 'there'} 👋
          </h2>
          <p className="text-[13px] text-dash-muted mt-0.5">
            Here's what's happening in your learning journey today.
          </p>
        </div>
        <button
          onClick={() => navigate('/roadmaps')}
          className="dash-btn-primary flex items-center gap-2 px-4 py-2 text-[13px] self-start sm:self-auto"
        >
          Explore Roadmaps <ArrowRight size={14} />
        </button>
      </motion.div>

      {/* ── Stats Cards ─────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {MOCK_STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </motion.div>

      {/* ── Progress + Activity ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Progress (3/5) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="lg:col-span-3 dash-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[15px] text-dash-text">Roadmap Progress</h3>
            <button
              onClick={() => navigate('/roadmaps')}
              className="text-[12px] text-dash-primary font-medium hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-5">
            {MOCK_PROGRESS.map((rp) => (
              <motion.div key={rp.title} variants={itemVariants}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`dash-badge text-[10px] ${DOMAIN_COLORS[rp.domain] ?? 'bg-gray-100 text-gray-600'}`}>
                      {rp.domain}
                    </span>
                    <span className="text-[13px] font-medium text-dash-text">{rp.title}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-dash-primary">{rp.progress}%</span>
                </div>
                <ProgressBar progress={rp.progress} />
                <p className="text-[11px] text-dash-muted mt-1">
                  {rp.done} of {rp.modules} modules completed
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed (2/5) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="lg:col-span-2 dash-card p-5"
        >
          <h3 className="font-semibold text-[15px] text-dash-text mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {MOCK_ACTIVITY.map((act, i) => {
              const meta = ACTIVITY_META[act.type]
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <span className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-sm ${meta.color}`}>
                    {meta.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-dash-text leading-snug">{act.text}</p>
                    <p className="text-[11px] text-dash-muted flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {act.time}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Recommended Roadmaps ─────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[15px] text-dash-text flex items-center gap-2">
            <TrendingUp size={16} className="text-dash-primary" />
            Recommended Roadmaps
          </h3>
          <button
            onClick={() => navigate('/roadmaps')}
            className="text-[12px] text-dash-primary font-medium hover:underline flex items-center gap-1"
          >
            See all <ArrowRight size={12} />
          </button>
        </div>

        {loadingRM ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="dash-card overflow-hidden">
                <div className="shimmer h-36" />
                <div className="p-4 space-y-2">
                  <div className="shimmer h-3 w-3/4 rounded" />
                  <div className="shimmer h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : roadmaps.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {roadmaps.map((rm) => (
              <RoadmapCard key={rm._id} {...rm} />
            ))}
          </motion.div>
        ) : (
          <div className="dash-card p-10 text-center">
            <BookOpen className="mx-auto text-gray-300 mb-2" size={32} />
            <p className="text-dash-muted text-[13px]">No roadmaps available yet.</p>
            <button
              onClick={() => navigate('/roadmaps')}
              className="mt-3 dash-btn-primary text-[13px] px-4 py-2"
            >
              Browse Roadmaps
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
