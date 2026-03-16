import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Map, Users, CheckSquare, Star,
  ArrowRight, BookOpen, Plus, TrendingUp,
  Eye, ToggleLeft, ToggleRight, Loader2,
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import roadmapService from '../../services/roadmapService'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item      = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }

const DOMAIN_COLORS = {
  frontend:      'bg-blue-100 text-blue-700',
  backend:       'bg-green-100 text-green-700',
  fullstack:     'bg-purple-100 text-purple-700',
  mobile:        'bg-pink-100 text-pink-700',
  devops:        'bg-amber-100 text-amber-700',
  'system-design': 'bg-indigo-100 text-indigo-700',
  data:          'bg-teal-100 text-teal-700',
  'ai-ml':       'bg-rose-100 text-rose-700',
  security:      'bg-red-100 text-red-700',
}

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <motion.div variants={item} className="dash-card dash-card-hover p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-dash-text">{value}</p>
        <p className="text-[12px] text-dash-muted mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-dash-primary font-medium mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  )
}

function RoadmapRow({ roadmap, onTogglePublish, toggling }) {
  const navigate = useNavigate()
  return (
    <motion.div
      variants={item}
      className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
    >
      {/* Cover */}
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shrink-0">
        {roadmap.coverImage
          ? <img src={roadmap.coverImage} alt={roadmap.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><BookOpen className="text-gray-300" size={20} /></div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`dash-badge text-[10px] ${DOMAIN_COLORS[roadmap.domain] ?? 'bg-gray-100 text-gray-600'}`}>
            {roadmap.domain}
          </span>
          <span className={`dash-badge ${roadmap.isPublished ? 'dash-badge-green' : 'dash-badge-gray'}`}>
            {roadmap.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
        <p className="font-semibold text-[14px] text-dash-text mt-1 truncate">{roadmap.title}</p>
        <p className="text-[12px] text-dash-muted flex items-center gap-3 mt-0.5">
          <span className="flex items-center gap-1"><Users size={11} /> {roadmap.enrollmentCount ?? 0} learners</span>
          <span className="flex items-center gap-1"><Map size={11} /> {roadmap.modules?.length ?? 0} modules</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => navigate(`/roadmaps/${roadmap._id}`)}
          className="dash-btn-outline p-2 rounded-lg"
          title="View Roadmap"
        >
          <Eye size={14} />
        </button>
        <button
          onClick={() => onTogglePublish(roadmap._id)}
          disabled={toggling === roadmap._id}
          className={`p-2 rounded-lg transition-colors ${
            roadmap.isPublished
              ? 'bg-green-50 text-green-600 hover:bg-green-100'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          title={roadmap.isPublished ? 'Unpublish' : 'Publish'}
        >
          {toggling === roadmap._id
            ? <Loader2 size={14} className="animate-spin" />
            : roadmap.isPublished ? <ToggleRight size={14} /> : <ToggleLeft size={14} />
          }
        </button>
      </div>
    </motion.div>
  )
}

export default function MentorDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [roadmaps, setRoadmaps]     = useState([])
  const [profile, setProfile]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [toggling, setToggling]     = useState(null)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    Promise.allSettled([
      roadmapService.getMyroadmap(),
      import('../../services/api').then(({ default: api }) => api.get('/mentor-profiles/me')),
    ]).then(([roadmapsRes, profileRes]) => {
      if (roadmapsRes.status === 'fulfilled') {
        setRoadmaps(roadmapsRes.value.data ?? [])
      }
      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value.data)
      }
    }).finally(() => setLoading(false))
  }, [])

  const handleTogglePublish = async (id) => {
    setToggling(id)
    try {
      await roadmapService.togglePublish(id)
      setRoadmaps((prev) =>
        prev.map((r) => r._id === id ? { ...r, isPublished: !r.isPublished } : r)
      )
    } catch (_) {}
    setToggling(null)
  }

  const totalLearners   = roadmaps.reduce((acc, r) => acc + (r.enrollmentCount ?? 0), 0)
  const publishedCount  = roadmaps.filter((r) => r.isPublished).length

  const STATS = [
    { icon: Map,         label: 'Total Roadmaps',       value: loading ? '–' : roadmaps.length,  color: 'bg-blue-50 text-blue-600'    },
    { icon: Users,       label: 'Total Learners',        value: loading ? '–' : totalLearners,    color: 'bg-purple-50 text-purple-600' },
    { icon: CheckSquare, label: 'Published',             value: loading ? '–' : publishedCount,   color: 'bg-green-50 text-green-600'  },
    { icon: Star,        label: 'Average Rating',        value: profile?.rating ? profile.rating.toFixed(1) : '–', color: 'bg-amber-50 text-amber-600', sub: profile?.totalReviews ? `${profile.totalReviews} reviews` : null },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ── Greeting ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-dash-text">
            {greeting}, {user?.name?.split(' ')[0] ?? 'there'} 👋
          </h2>
          <p className="text-[13px] text-dash-muted mt-0.5">
            Manage your roadmaps and track learner progress.
          </p>
        </div>
        <button
          onClick={() => navigate('/roadmaps')}
          className="dash-btn-primary flex items-center gap-2 px-4 py-2 text-[13px] self-start sm:self-auto"
        >
          <Plus size={14} /> Create Roadmap
        </button>
      </motion.div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </motion.div>

      {/* ── My Roadmaps ──────────────────────────────────────── */}
      <div className="dash-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[15px] text-dash-text flex items-center gap-2">
            <Map size={16} className="text-dash-primary" /> Your Roadmaps
          </h3>
          <span className="text-[12px] text-dash-muted">{roadmaps.length} total</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
                <div className="shimmer w-14 h-14 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="shimmer h-3 w-1/3 rounded" />
                  <div className="shimmer h-4 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : roadmaps.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-3 text-center">
            <BookOpen className="text-gray-300" size={36} />
            <p className="text-dash-text font-medium">No roadmaps yet</p>
            <p className="text-[13px] text-dash-muted">Create your first roadmap to start teaching.</p>
            <button className="dash-btn-primary text-[13px] px-4 py-2 flex items-center gap-2">
              <Plus size={14} /> Create Roadmap
            </button>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
            {roadmaps.map((rm) => (
              <RoadmapRow
                key={rm._id}
                roadmap={rm}
                onTogglePublish={handleTogglePublish}
                toggling={toggling}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* ── Mentor Analytics Teaser ───────────────────────────── */}
      <div className="dash-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-dash-primary" />
          <h3 className="font-semibold text-[15px] text-dash-text">Mentor Analytics</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Profile Views',      value: profile?.profileViews ?? '–',   color: 'text-blue-600'  },
            { label: 'Total Completions',  value: profile?.totalCompletions ?? '–', color: 'text-green-600' },
            { label: 'Verified Mentor',    value: profile?.isVerified ? 'Yes ✓' : 'Pending', color: profile?.isVerified ? 'text-green-600' : 'text-amber-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4 text-center">
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-[12px] text-dash-muted mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
