import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, Map, CheckSquare, GraduationCap, Activity,
  ArrowRight, TrendingUp, ShieldCheck, Clock,
  UserCheck, BookOpen,
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

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <motion.div variants={item} className="dash-card dash-card-hover p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-dash-text">{value}</p>
        <p className="text-[12px] text-dash-muted mt-0.5">{label}</p>
        {trend && (
          <p className="text-[11px] text-green-600 font-medium mt-0.5 flex items-center gap-0.5">
            <TrendingUp size={10} /> {trend}
          </p>
        )}
      </div>
    </motion.div>
  )
}

function RoadmapRow({ roadmap }) {
  const navigate = useNavigate()
  return (
    <motion.div
      variants={item}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => navigate(`/roadmaps/${roadmap._id}`)}
    >
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shrink-0">
        {roadmap.coverImage
          ? <img src={roadmap.coverImage} alt={roadmap.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><BookOpen className="text-gray-300" size={14} /></div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[13px] text-dash-text truncate">{roadmap.title}</p>
        <p className="text-[11px] text-dash-muted flex items-center gap-2">
          <span className={`dash-badge text-[9px] ${DOMAIN_COLORS[roadmap.domain] ?? 'bg-gray-100 text-gray-600'}`}>{roadmap.domain}</span>
          <span className="flex items-center gap-1"><Users size={10} /> {roadmap.enrollmentCount ?? 0}</span>
        </p>
      </div>
      <ArrowRight size={14} className="text-dash-muted shrink-0" />
    </motion.div>
  )
}

function SystemHealthRow({ label, status, color }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-[13px] text-dash-text">{label}</span>
      <span className={`dash-badge text-[11px] ${color}`}>{status}</span>
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [roadmaps, setRoadmaps]     = useState([])
  const [users, setUsers]           = useState([])
  const [mentorApps, setMentorApps] = useState([])
  const [loading, setLoading]       = useState(true)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    Promise.allSettled([
      roadmapService.getPublished({ limit: 100 }),
      import('../../services/api').then(({ default: api }) => api.get('/role-profiles/')),
      import('../../services/api').then(({ default: api }) => api.get('/mentor-onboarding/')),
    ]).then(([roadmapsRes, usersRes, appsRes]) => {
      if (roadmapsRes.status === 'fulfilled') setRoadmaps(roadmapsRes.value.data ?? [])
      if (usersRes.status === 'fulfilled')    setUsers(usersRes.value.data ?? [])
      if (appsRes.status === 'fulfilled')     setMentorApps(appsRes.value.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const mentors      = users.filter((u) => u.role === 'mentor')
  const activeLearners = users.filter((u) => u.role === 'learner')
  const topRoadmaps  = [...roadmaps].sort((a, b) => (b.enrollmentCount ?? 0) - (a.enrollmentCount ?? 0)).slice(0, 5)
  const pendingApps  = mentorApps.filter((a) => a.status === 'pending')

  const STATS = [
    { icon: Users,        label: 'Total Users',      value: loading ? '–' : users.length,          color: 'bg-blue-50 text-blue-600',    trend: null },
    { icon: GraduationCap,label: 'Total Mentors',    value: loading ? '–' : mentors.length,         color: 'bg-purple-50 text-purple-600', trend: null },
    { icon: Map,          label: 'Total Roadmaps',   value: loading ? '–' : roadmaps.length,        color: 'bg-green-50 text-green-600',  trend: null },
    { icon: Activity,     label: 'Active Learners',  value: loading ? '–' : activeLearners.length,  color: 'bg-amber-50 text-amber-600',  trend: null },
    { icon: CheckSquare,  label: 'Pending Mentor Apps', value: loading ? '–' : pendingApps.length,  color: 'bg-[#FFF3F0] text-dash-primary', trend: null },
  ]

  const SYSTEM_HEALTH = [
    { label: 'API Server',      status: 'Operational', color: 'dash-badge-green' },
    { label: 'Database',        status: 'Operational', color: 'dash-badge-green' },
    { label: 'Socket.io',       status: 'Operational', color: 'dash-badge-green' },
    { label: 'Email Service',   status: 'Operational', color: 'dash-badge-green' },
    { label: 'AI Assistant',    status: 'Operational', color: 'dash-badge-green' },
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
            {greeting}, {user?.name?.split(' ')[0] ?? 'Admin'} 👋
          </h2>
          <p className="text-[13px] text-dash-muted mt-0.5">
            Platform overview and administration.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/roadmaps')}
            className="dash-btn-outline flex items-center gap-2 px-4 py-2 text-[13px]"
          >
            <Map size={14} /> Roadmaps
          </button>
          <button
            className="dash-btn-primary flex items-center gap-2 px-4 py-2 text-[13px]"
          >
            <ShieldCheck size={14} /> Admin Panel
          </button>
        </div>
      </motion.div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </motion.div>

      {/* ── Main grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Most Popular Roadmaps */}
        <div className="lg:col-span-2 dash-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[15px] text-dash-text flex items-center gap-2">
              <TrendingUp size={16} className="text-dash-primary" /> Most Popular Roadmaps
            </h3>
            <button
              onClick={() => navigate('/roadmaps')}
              className="text-[12px] text-dash-primary font-medium hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                  <div className="shimmer w-10 h-10 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <div className="shimmer h-3 w-2/3 rounded" />
                    <div className="shimmer h-3 w-1/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : topRoadmaps.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2 text-center">
              <BookOpen className="text-gray-300" size={28} />
              <p className="text-[13px] text-dash-muted">No roadmaps yet.</p>
            </div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show">
              {topRoadmaps.map((rm) => <RoadmapRow key={rm._id} roadmap={rm} />)}
            </motion.div>
          )}
        </div>

        {/* System Health */}
        <div className="dash-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-dash-primary" />
            <h3 className="font-semibold text-[15px] text-dash-text">System Health</h3>
          </div>
          <div>
            {SYSTEM_HEALTH.map((h) => <SystemHealthRow key={h.label} {...h} />)}
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-xl text-center">
            <p className="text-[12px] text-green-700 font-semibold">All systems operational</p>
            <p className="text-[11px] text-green-600 mt-0.5">Last checked: just now</p>
          </div>
        </div>
      </div>

      {/* ── Pending Mentor Applications ───────────────────────── */}
      {pendingApps.length > 0 && (
        <div className="dash-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[15px] text-dash-text flex items-center gap-2">
              <UserCheck size={16} className="text-dash-primary" />
              Pending Mentor Applications
              <span className="dash-badge dash-badge-red">{pendingApps.length}</span>
            </h3>
          </div>
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
            {pendingApps.slice(0, 5).map((app) => (
              <motion.div
                key={app._id}
                variants={item}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-dash-primary text-white flex items-center justify-center text-sm font-bold">
                    {app.userId?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-dash-text">{app.userId?.name ?? 'Unknown'}</p>
                    <p className="text-[11px] text-dash-muted flex items-center gap-1">
                      <Clock size={10} /> Applied {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
                    </p>
                  </div>
                </div>
                <span className="dash-badge dash-badge-amber">Pending Review</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  )
}
