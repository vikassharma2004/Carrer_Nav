import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Map, CheckSquare, Users, Bot, Flame,
  TrendingUp, Clock, ArrowRight, Star, BookOpen,
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import roadmapService from '../../services/roadmapService'
import enrollmentService from '../../services/enrollmentService'
import progressService from '../../services/progressService'

/* ─── Animation helpers ────────────────────────────────────── */
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

const LEVEL_BADGE = {
  beginner:     'dash-badge-green',
  intermediate: 'dash-badge-amber',
  advanced:     'dash-badge-red',
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div variants={item} className="dash-card dash-card-hover p-5 flex items-center gap-4">
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

function RoadmapCard({ _id, title, shortDescription, coverImage, level, domain, isPaid }) {
  const navigate = useNavigate()
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
      className="dash-card overflow-hidden cursor-pointer"
      onClick={() => navigate(`/roadmaps/${_id}`)}
    >
      <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {coverImage
          ? <img src={coverImage} alt={title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><BookOpen className="text-gray-300" size={36} /></div>
        }
        {level && (
          <span className={`absolute top-2 left-2 dash-badge ${LEVEL_BADGE[level] ?? 'dash-badge-gray'} capitalize`}>
            {level}
          </span>
        )}
        {isPaid && <span className="absolute top-2 right-2 dash-badge dash-badge-amber">Paid</span>}
      </div>
      <div className="p-4">
        {domain && (
          <span className={`dash-badge text-[10px] mb-2 inline-flex ${DOMAIN_COLORS[domain] ?? 'bg-gray-100 text-gray-600'}`}>
            {domain}
          </span>
        )}
        <h3 className="font-semibold text-[14px] text-dash-text leading-snug line-clamp-2">{title}</h3>
        {shortDescription && (
          <p className="text-[12px] text-dash-muted mt-1 line-clamp-2 leading-snug">{shortDescription}</p>
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

export default function LearnerDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [stats, setStats]       = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [roadmaps, setRoadmaps] = useState([])
  const [loadingRM, setLoadingRM] = useState(true)
  const [loadingEnroll, setLoadingEnroll] = useState(true)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    // Fetch recommended roadmaps
    roadmapService
      .getPublished({ limit: 4 })
      .then((res) => setRoadmaps(res.data ?? []))
      .catch(() => setRoadmaps([]))
      .finally(() => setLoadingRM(false))
  }, [])

  useEffect(() => {
    // Fetch learner stats from user profile
    import('../../services/api').then(({ default: api }) => {
      Promise.allSettled([
        api.get('/user/me'),
      ]).then(([profileRes]) => {
        const profile = profileRes.status === 'fulfilled' ? profileRes.value.data : null
        if (profile) {
          setStats({
            roadmapsFollowing: profile.enrolledRoadmaps?.length ?? 0,
            tasksCompleted:    profile.tasksCompleted ?? 0,
            communitiesJoined: profile.communities?.length ?? 0,
            aiSessions:        profile.aiSessions ?? 0,
            streak:            profile.streak ?? 0,
          })
        }
        setLoadingEnroll(false)
      })
    })
  }, [])

  const STAT_CARDS = [
    { icon: Map,         label: 'Roadmaps Following', value: stats?.roadmapsFollowing ?? '–', color: 'bg-blue-50 text-blue-600'     },
    { icon: CheckSquare, label: 'Tasks Completed',    value: stats?.tasksCompleted ?? '–',    color: 'bg-green-50 text-green-600'   },
    { icon: Users,       label: 'Communities Joined', value: stats?.communitiesJoined ?? '–', color: 'bg-purple-50 text-purple-600' },
    { icon: Bot,         label: 'AI Help Sessions',   value: stats?.aiSessions ?? '–',        color: 'bg-[#FFF3F0] text-dash-primary'},
    { icon: Flame,       label: 'Learning Streak',    value: stats?.streak ? `${stats.streak}d` : '–', color: 'bg-amber-50 text-amber-600' },
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

      {/* ── Stats Cards ──────────────────────────────────────── */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {STAT_CARDS.map((s) => <StatCard key={s.label} {...s} />)}
      </motion.div>

      {/* ── Progress + Activity ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Roadmap Progress */}
        <motion.div
          variants={container} initial="hidden" animate="show"
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

          {loadingEnroll ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="shimmer h-3 w-3/4 rounded" />
                  <div className="shimmer h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          ) : enrollments.length > 0 ? (
            <div className="space-y-5">
              {enrollments.map((rp) => (
                <motion.div key={rp.roadmapId} variants={item}>
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
                  <p className="text-[11px] text-dash-muted mt-1">{rp.done} of {rp.modules} modules completed</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 gap-3">
              <BookOpen className="text-gray-300" size={32} />
              <p className="text-[13px] text-dash-muted">You haven't enrolled in any roadmaps yet.</p>
              <button onClick={() => navigate('/roadmaps')} className="dash-btn-primary text-[13px] px-4 py-2">
                Browse Roadmaps
              </button>
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={container} initial="hidden" animate="show"
          className="lg:col-span-2 dash-card p-5"
        >
          <h3 className="font-semibold text-[15px] text-dash-text mb-4">Recent Activity</h3>
          <div className="flex flex-col items-center py-8 gap-2 text-center">
            <Clock className="text-gray-300" size={28} />
            <p className="text-[13px] text-dash-muted">No activity yet.</p>
            <p className="text-[12px] text-dash-muted">Complete tasks to see your timeline here.</p>
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
            variants={container} initial="hidden" animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {roadmaps.map((rm) => <RoadmapCard key={rm._id} {...rm} />)}
          </motion.div>
        ) : (
          <div className="dash-card p-10 text-center">
            <BookOpen className="mx-auto text-gray-300 mb-2" size={32} />
            <p className="text-dash-muted text-[13px]">No roadmaps available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
