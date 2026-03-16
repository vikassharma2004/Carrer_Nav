import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, Map, CheckSquare, GraduationCap, Activity,
  ArrowRight, TrendingUp, ShieldCheck, Clock, UserCheck,
  BookOpen, DollarSign, CreditCard, Layers, MessageSquare,
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import roadmapService from '../../services/roadmapService'
import adminService from '../../services/adminService'

/* ── Animation variants ───────────────────────────────────────── */
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item      = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }

/* ── Mock monthly data for charts ─────────────────────────────── */
const MONTHLY_USERS = [
  { label: 'Sep', value: 42 },
  { label: 'Oct', value: 68 },
  { label: 'Nov', value: 91 },
  { label: 'Dec', value: 74 },
  { label: 'Jan', value: 115 },
  { label: 'Feb', value: 138 },
  { label: 'Mar', value: 162 },
]

const MONTHLY_REVENUE = [
  { label: 'Sep', value: 1200 },
  { label: 'Oct', value: 1850 },
  { label: 'Nov', value: 2400 },
  { label: 'Dec', value: 1960 },
  { label: 'Jan', value: 3100 },
  { label: 'Feb', value: 3800 },
  { label: 'Mar', value: 4200 },
]

const DOMAIN_COLORS = {
  frontend:        'bg-blue-100 text-blue-700',
  backend:         'bg-green-100 text-green-700',
  fullstack:       'bg-purple-100 text-purple-700',
  mobile:          'bg-pink-100 text-pink-700',
  devops:          'bg-amber-100 text-amber-700',
  'system-design': 'bg-indigo-100 text-indigo-700',
  data:            'bg-teal-100 text-teal-700',
  'ai-ml':         'bg-rose-100 text-rose-700',
  security:        'bg-red-100 text-red-700',
}

/* ── Mini bar chart ───────────────────────────────────────────── */
function MiniBarChart({ data, color = 'bg-dash-primary' }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-1" style={{ height: 80 }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.04, duration: 0.45, ease: 'easeOut' }}
            style={{
              height: `${Math.max((d.value / max) * 72, 4)}px`,
              transformOrigin: 'bottom',
            }}
            title={`${d.label}: ${d.value}`}
            className={`w-full rounded-t-md ${color} opacity-80 hover:opacity-100 transition-opacity cursor-default`}
          />
          <span className="text-[9px] text-dash-muted">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Stat card ────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color, trend, sub }) {
  return (
    <motion.div variants={item} className="dash-card dash-card-hover p-4 flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xl font-bold text-dash-text leading-none">{value}</p>
        <p className="text-[12px] text-dash-muted mt-1">{label}</p>
        {trend && (
          <p className="text-[11px] text-green-600 font-medium mt-0.5 flex items-center gap-0.5">
            <TrendingUp size={10} /> {trend}
          </p>
        )}
        {sub && <p className="text-[11px] text-dash-primary font-medium mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  )
}

/* ── Roadmap row ──────────────────────────────────────────────── */
function RoadmapRow({ roadmap }) {
  const navigate = useNavigate()
  return (
    <motion.div
      variants={item}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => navigate(`/roadmaps/${roadmap._id}`)}
    >
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shrink-0">
        {roadmap.coverImage
          ? <img src={roadmap.coverImage} alt={roadmap.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><BookOpen className="text-gray-300" size={14} /></div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[13px] text-dash-text truncate">{roadmap.title}</p>
        <p className="text-[11px] text-dash-muted flex items-center gap-2">
          <span className={`dash-badge text-[9px] ${DOMAIN_COLORS[roadmap.domain] ?? 'bg-gray-100 text-gray-600'}`}>
            {roadmap.domain}
          </span>
          <span className="flex items-center gap-1"><Users size={10} /> {roadmap.enrollmentCount ?? 0}</span>
        </p>
      </div>
      <ArrowRight size={14} className="text-dash-muted shrink-0" />
    </motion.div>
  )
}

/* ── Quick action button ──────────────────────────────────────── */
function QuickAction({ icon: Icon, label, to, color }) {
  const navigate = useNavigate()
  return (
    <motion.button
      variants={item}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(to)}
      className={`flex items-center gap-3 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all text-left ${color}`}
    >
      <Icon size={20} className="shrink-0" />
      <span className="text-[13px] font-semibold">{label}</span>
      <ArrowRight size={13} className="ml-auto opacity-50 shrink-0" />
    </motion.button>
  )
}

/* ── Main component ───────────────────────────────────────────── */
export default function AdminDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [roadmaps,    setRoadmaps]    = useState([])
  const [users,       setUsers]       = useState([])
  const [mentorApps,  setMentorApps]  = useState([])
  const [billingPlans, setBillingPlans] = useState([])
  const [loading,     setLoading]     = useState(true)

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  // Normalise any API response into a plain array
  const toArr = (raw) => {
    if (Array.isArray(raw))            return raw
    if (Array.isArray(raw?.data))      return raw.data
    if (Array.isArray(raw?.roadmaps))  return raw.roadmaps
    if (Array.isArray(raw?.users))     return raw.users
    if (Array.isArray(raw?.profiles))  return raw.profiles
    if (Array.isArray(raw?.plans))     return raw.plans
    return []
  }

  useEffect(() => {
    Promise.allSettled([
      roadmapService.getPublished({ limit: 100 }),
      adminService.getUsers(),
      adminService.getOnboardingRequests(),
      adminService.getBillingPlans(),
    ]).then(([rmRes, usersRes, appsRes, plansRes]) => {
      if (rmRes.status    === 'fulfilled') setRoadmaps(toArr(rmRes.value.data ?? rmRes.value))
      if (usersRes.status === 'fulfilled') setUsers(toArr(usersRes.value.data ?? usersRes.value))
      if (appsRes.status  === 'fulfilled') setMentorApps(toArr(appsRes.value.data ?? appsRes.value))
      if (plansRes.status === 'fulfilled') setBillingPlans(toArr(plansRes.value.data ?? plansRes.value))
    }).finally(() => setLoading(false))
  }, [])

  const mentors        = users.filter((u) => u.role === 'mentor')
  const learners       = users.filter((u) => u.role === 'learner')
  const pendingApps    = mentorApps.filter((a) => a.status === 'pending')
  const totalTasks     = roadmaps.reduce((acc, r) => acc + (r.modules?.length ?? 0), 0)
  const topRoadmaps    = [...roadmaps].sort((a, b) => (b.enrollmentCount ?? 0) - (a.enrollmentCount ?? 0)).slice(0, 5)

  const STATS = [
    { icon: Users,        label: 'Total Users',          value: loading ? '–' : users.length,        color: 'bg-blue-50 text-blue-600',       trend: '+12% this month' },
    { icon: GraduationCap,label: 'Total Mentors',         value: loading ? '–' : mentors.length,      color: 'bg-purple-50 text-purple-600',   trend: null },
    { icon: Users,        label: 'Total Learners',        value: loading ? '–' : learners.length,     color: 'bg-indigo-50 text-indigo-600',   trend: null },
    { icon: Map,          label: 'Total Roadmaps',        value: loading ? '–' : roadmaps.length,     color: 'bg-green-50 text-green-600',     trend: null },
    { icon: Layers,       label: 'Total Modules',         value: loading ? '–' : totalTasks,          color: 'bg-teal-50 text-teal-600',       trend: null },
    { icon: MessageSquare,label: 'Communities',           value: '–',                                  color: 'bg-cyan-50 text-cyan-600',       trend: null },
    { icon: DollarSign,   label: 'Total Revenue',         value: '$4,200',                             color: 'bg-emerald-50 text-emerald-600', trend: '+8% vs last month', sub: null },
    { icon: CreditCard,   label: 'Commission Paid',       value: '$840',                               color: 'bg-amber-50 text-amber-600',     trend: null },
    { icon: Activity,     label: 'Pending Commission',    value: '$320',                               color: 'bg-[#FFF3F0] text-dash-primary', sub: `${pendingApps.length} pending apps` },
  ]

  const SYSTEM_HEALTH = [
    { label: 'API Server',    status: 'Operational', color: 'dash-badge-green' },
    { label: 'Database',      status: 'Operational', color: 'dash-badge-green' },
    { label: 'Socket.io',     status: 'Operational', color: 'dash-badge-green' },
    { label: 'Email Service', status: 'Operational', color: 'dash-badge-green' },
    { label: 'AI Assistant',  status: 'Operational', color: 'dash-badge-green' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ── Greeting ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-dash-text">
            {greeting}, {user?.name?.split(' ')[0] ?? 'Admin'} 👋
          </h2>
          <p className="text-[13px] text-dash-muted mt-0.5">
            Here's a complete overview of your platform.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/dashboard/admin/users')}
            className="dash-btn-outline flex items-center gap-2 px-4 py-2 text-[13px]"
          >
            <Users size={14} /> Manage Users
          </button>
          <button
            onClick={() => navigate('/dashboard/admin/onboarding')}
            className="dash-btn-primary flex items-center gap-2 px-4 py-2 text-[13px] relative"
          >
            <ShieldCheck size={14} /> Onboarding
            {pendingApps.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white text-dash-primary text-[9px] font-bold flex items-center justify-center border border-dash-primary">
                {pendingApps.length}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* ── Stat Cards ─────────────────────────────────────────────── */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3"
      >
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </motion.div>

      {/* ── Quick Actions ──────────────────────────────────────────── */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { icon: Users,       label: 'Users',            to: '/dashboard/admin/users',      color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
          { icon: UserCheck,   label: 'Onboarding',       to: '/dashboard/admin/onboarding', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
          { icon: CreditCard,  label: 'Billing Plans',    to: '/dashboard/admin/billing',    color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
          { icon: Map,         label: 'Roadmaps',         to: '/roadmaps',                   color: 'bg-green-50 text-green-700 hover:bg-green-100' },
        ].map((a) => <QuickAction key={a.label} {...a} />)}
      </motion.div>

      {/* ── Analytics Charts ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* User Growth */}
        <div className="dash-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-[15px] text-dash-text">User Growth</h3>
              <p className="text-[12px] text-dash-muted">Monthly registrations</p>
            </div>
            <span className="dash-badge dash-badge-green text-[11px]">
              <TrendingUp size={10} className="inline mr-1" />+19% vs last month
            </span>
          </div>
          <MiniBarChart data={MONTHLY_USERS} color="bg-blue-400" />
          <div className="mt-3 flex items-center justify-between text-[12px] text-dash-muted">
            <span>Total this period: <strong className="text-dash-text">{MONTHLY_USERS.reduce((s, d) => s + d.value, 0)}</strong></span>
            <span>Peak: <strong className="text-dash-text">Mar 162</strong></span>
          </div>
        </div>

        {/* Revenue Growth */}
        <div className="dash-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-[15px] text-dash-text">Revenue Growth</h3>
              <p className="text-[12px] text-dash-muted">Monthly platform revenue</p>
            </div>
            <span className="dash-badge dash-badge-green text-[11px]">
              <TrendingUp size={10} className="inline mr-1" />+10.5% vs last month
            </span>
          </div>
          <MiniBarChart data={MONTHLY_REVENUE} color="bg-emerald-400" />
          <div className="mt-3 flex items-center justify-between text-[12px] text-dash-muted">
            <span>Total this period: <strong className="text-dash-text">$18,510</strong></span>
            <span>Peak: <strong className="text-dash-text">Mar $4,200</strong></span>
          </div>
        </div>

      </div>

      {/* ── Main Content Grid ──────────────────────────────────────── */}
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
                  <div className="shimmer w-9 h-9 rounded-lg" />
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
            {SYSTEM_HEALTH.map((h) => (
              <div key={h.label} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                <span className="text-[13px] text-dash-text">{h.label}</span>
                <span className={`dash-badge text-[11px] ${h.color}`}>{h.status}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-xl text-center">
            <p className="text-[12px] text-green-700 font-semibold">All systems operational</p>
            <p className="text-[11px] text-green-600 mt-0.5">Last checked: just now</p>
          </div>
          {/* Billing plans count */}
          <div className="mt-3 p-3 bg-purple-50 rounded-xl flex items-center justify-between">
            <span className="text-[12px] text-purple-700 font-medium">Billing Plans</span>
            <span className="text-[13px] font-bold text-purple-700">{billingPlans.length}</span>
          </div>
        </div>
      </div>

      {/* ── Pending Mentor Applications ────────────────────────────── */}
      {!loading && pendingApps.length > 0 && (
        <div className="dash-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[15px] text-dash-text flex items-center gap-2">
              <UserCheck size={16} className="text-dash-primary" />
              Pending Onboarding Requests
              <span className="dash-badge dash-badge-red">{pendingApps.length}</span>
            </h3>
            <button
              onClick={() => navigate('/dashboard/admin/onboarding')}
              className="text-[12px] text-dash-primary font-medium hover:underline flex items-center gap-1"
            >
              Manage all <ArrowRight size={12} />
            </button>
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
                <div className="flex items-center gap-2">
                  <span className="dash-badge dash-badge-amber">Pending Review</span>
                  <button
                    onClick={() => navigate('/dashboard/admin/onboarding')}
                    className="dash-btn-primary px-3 py-1 text-[12px]"
                  >
                    Review
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  )
}
