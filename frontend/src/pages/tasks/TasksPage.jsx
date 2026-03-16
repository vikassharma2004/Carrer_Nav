import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckSquare, Clock, Filter,
  ChevronRight, BookOpen, Map, Search, CheckCircle2,
  Circle, Loader2, ArrowRight,
} from 'lucide-react'
import taskService      from '../../services/taskService'
import roadmapService   from '../../services/roadmapService'
import progressService  from '../../services/progressService'

/* ─── helpers ─────────────────────────────────────────────────── */
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

const TASK_TYPE_COLORS = {
  concept:        'bg-blue-50 text-blue-600',
  implementation: 'bg-green-50 text-green-600',
  debugging:      'bg-amber-50 text-amber-700',
  decision:       'bg-purple-50 text-purple-600',
}

const STATUS_INFO = {
  completed:   { label: 'Completed',   color: 'dash-badge-green',  icon: CheckCircle2, iconClass: 'text-green-500' },
  in_progress: { label: 'In Progress', color: 'dash-badge-amber',  icon: Clock,        iconClass: 'text-amber-500' },
  available:   { label: 'Available',   color: 'dash-badge-blue',   icon: Circle,       iconClass: 'text-blue-400'  },
  locked:      { label: 'Locked',      color: 'dash-badge-gray',   icon: Circle,       iconClass: 'text-gray-300'  },
}

const FILTERS = [
  { id: 'all',         label: 'All' },
  { id: 'available',   label: 'Available' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'completed',   label: 'Completed' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item      = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } }

/* ─── Progress bar ────────────────────────────────────────────── */
function ProgressBar({ value }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full bg-dash-primary"
      />
    </div>
  )
}

/* ─── Task Card ───────────────────────────────────────────────── */
function TaskCard({ task, onToggle, toggling }) {
  const si = STATUS_INFO[task.status] ?? STATUS_INFO.locked
  const StatusIcon = si.icon
  const isCompleted = task.status === 'completed'
  const isLocked    = task.status === 'locked'

  return (
    <motion.div variants={item} className="dash-card p-4 flex items-start gap-4">
      {/* Checkbox */}
      <button
        onClick={() => !isLocked && onToggle(task)}
        disabled={isLocked || toggling === task._id}
        className={`shrink-0 mt-0.5 ${isLocked ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
        title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
      >
        {toggling === task._id ? (
          <Loader2 size={18} className="animate-spin text-dash-primary" />
        ) : (
          <StatusIcon
            size={18}
            className={`${si.iconClass} ${isCompleted ? 'fill-green-500' : ''} transition-colors`}
          />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className={`dash-badge text-[10px] ${DOMAIN_COLORS[task._roadmapDomain] ?? 'bg-gray-100 text-gray-600'}`}>
            {task._roadmapDomain ?? '—'}
          </span>
          {task.taskType && (
            <span className={`dash-badge text-[10px] ${TASK_TYPE_COLORS[task.taskType] ?? 'bg-gray-100 text-gray-600'}`}>
              {task.taskType}
            </span>
          )}
          <span className={`dash-badge text-[10px] ${si.color}`}>{si.label}</span>
        </div>

        <p className={`text-[14px] font-semibold leading-snug ${isCompleted ? 'line-through text-dash-muted' : 'text-dash-text'}`}>
          {task.title}
        </p>

        {task.description && (
          <p className="text-[12px] text-dash-muted mt-1 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-2 text-[11px] text-dash-muted">
          <span className="flex items-center gap-1">
            <Map size={10} /> {task._roadmapTitle}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={10} /> {task._moduleTitle}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Roadmap Progress Row ────────────────────────────────────── */
function RoadmapProgressRow({ roadmap, onClick }) {
  const pct    = roadmap._progress?.percentage ?? 0
  const domain = roadmap.domain

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
    >
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
        {roadmap.coverImage
          ? <img src={roadmap.coverImage} alt={roadmap.title} className="w-full h-full object-cover" />
          : <BookOpen size={16} className="text-gray-300" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[13px] font-semibold text-dash-text truncate">{roadmap.title}</p>
          <span className="text-[13px] font-bold text-dash-primary ml-2 shrink-0">{pct}%</span>
        </div>
        <ProgressBar value={pct} />
        <div className="flex items-center gap-3 mt-1">
          {domain && (
            <span className={`dash-badge text-[10px] ${DOMAIN_COLORS[domain] ?? 'bg-gray-100 text-gray-600'}`}>
              {domain}
            </span>
          )}
          <span className="text-[11px] text-dash-muted">
            {roadmap._progress?.completedTasks ?? 0} / {roadmap._progress?.totalTasks ?? 0} tasks
          </span>
        </div>
      </div>
      <ChevronRight size={14} className="text-dash-muted shrink-0" />
    </button>
  )
}

/* ─── Main Page ───────────────────────────────────────────────── */
export default function TasksPage() {
  const navigate = useNavigate()

  const [loading, setLoading]   = useState(true)
  const [roadmaps, setRoadmaps] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const [toggling, setToggling] = useState(null)
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')

  // ── Fetch tasks from /my-tasks, then enrich with roadmap + progress ──
  useEffect(() => {
    async function load() {
      try {
        // 1. Fetch tasks from the dedicated /my-tasks endpoint
        const taskRes  = await taskService.getUserTasks({ limit: 100 })
        const tasks    = taskRes.data ?? []

        if (tasks.length === 0) { setLoading(false); return }

        // 2. Collect unique roadmap IDs
        const roadmapIds = [...new Set(tasks.map(t => t.roadmap?.id).filter(Boolean))]

        // 3. Fetch roadmap details + progress in parallel for each roadmap
        const [roadmapResults, progressResults] = await Promise.all([
          Promise.allSettled(roadmapIds.map(id => roadmapService.getById(id))),
          Promise.allSettled(roadmapIds.map(id => progressService.getRoadmapProgress(id))),
        ])

        // 4. Build lookup maps
        const roadmapMap  = {}  // roadmapId → roadmap object
        const progressMap = {}  // taskId    → status string

        roadmapIds.forEach((id, i) => {
          if (roadmapResults[i].status === 'fulfilled') {
            const v = roadmapResults[i].value
            roadmapMap[id] = v.roadmap ?? v.data ?? v
          }
          if (progressResults[i].status === 'fulfilled') {
            const v    = progressResults[i].value
            const prog = v.progress ?? v.data ?? v
            const list = Array.isArray(prog) ? prog : (prog?.tasks ?? [])
            list.forEach(p => {
              const tid = p.taskId?._id ?? p.taskId
              if (tid) progressMap[tid] = p.status
            })
          }
        })

        // 5. Enrich tasks with status + roadmap domain info
        const enriched = tasks.map(task => ({
          ...task,
          _id:           task.id,                                  // normalize id field
          status:        progressMap[task.id] ?? 'locked',
          _roadmapId:    task.roadmap?.id,
          _roadmapTitle: task.roadmap?.title,
          _roadmapDomain: roadmapMap[task.roadmap?.id]?.domain,
          _moduleTitle:  task.module?.title,
          _moduleId:     task.module?.id,
        }))

        // 6. Build roadmap progress rows for the sidebar panel
        const roadmapRows = roadmapIds.map(id => {
          const rm         = roadmapMap[id]
          if (!rm) return null
          const rmTasks    = enriched.filter(t => t._roadmapId === id)
          const total      = rmTasks.length
          const completed  = rmTasks.filter(t => t.status === 'completed').length
          const pct        = total > 0 ? Math.round((completed / total) * 100) : 0
          return {
            ...rm,
            _id:      rm._id ?? id,
            _progress: { totalTasks: total, completedTasks: completed, percentage: pct },
          }
        }).filter(Boolean)

        setRoadmaps(roadmapRows)
        setAllTasks(enriched)
      } catch (_) {}

      setLoading(false)
    }

    load()
  }, [])

  // ── Toggle task complete ────────────────────────────────────────
  const handleToggle = async (task) => {
    setToggling(task._id)
    try {
      if (task.status === 'completed') {
        // No uncomplete endpoint — optimistic UI only
        setAllTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: 'available' } : t))
      } else {
        await progressService.completeTask(task._id)
        setAllTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: 'completed' } : t))
        setRoadmaps(prev => prev.map(rm => {
          if (rm._id !== task._roadmapId) return rm
          const newCompleted = rm._progress.completedTasks + 1
          const pct = Math.round((newCompleted / rm._progress.totalTasks) * 100)
          return { ...rm, _progress: { ...rm._progress, completedTasks: newCompleted, percentage: pct } }
        }))
      }
    } catch (_) {}
    setToggling(null)
  }

  // ── Filtered + searched tasks ──────────────────────────────────
  const filteredTasks = useMemo(() => {
    return allTasks.filter(t => {
      const matchFilter = filter === 'all' || t.status === filter
      const matchSearch = !search ||
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t._roadmapTitle?.toLowerCase().includes(search.toLowerCase()) ||
        t._moduleTitle?.toLowerCase().includes(search.toLowerCase())
      return matchFilter && matchSearch
    })
  }, [allTasks, filter, search])

  // ── Summary counts ─────────────────────────────────────────────
  const counts = useMemo(() => ({
    total:       allTasks.length,
    completed:   allTasks.filter(t => t.status === 'completed').length,
    in_progress: allTasks.filter(t => t.status === 'in_progress').length,
    available:   allTasks.filter(t => t.status === 'available').length,
  }), [allTasks])

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-dash-text">My Tasks</h2>
          <p className="text-[13px] text-dash-muted mt-0.5">All tasks from your enrolled roadmaps.</p>
        </div>
        <button
          onClick={() => navigate('/roadmaps')}
          className="dash-btn-outline flex items-center gap-2 px-4 py-2 text-[13px] self-start sm:self-auto"
        >
          Browse Roadmaps <ArrowRight size={14} />
        </button>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="dash-card p-4 flex items-start gap-4">
              <div className="shimmer w-5 h-5 rounded-full mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="shimmer h-3 w-1/4 rounded" />
                <div className="shimmer h-4 w-2/3 rounded" />
                <div className="shimmer h-3 w-1/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="dash-card p-16 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF3F0] flex items-center justify-center">
            <CheckSquare size={28} className="text-dash-primary" />
          </div>
          <div>
            <p className="font-semibold text-dash-text text-[15px]">No tasks yet</p>
            <p className="text-[13px] text-dash-muted mt-1">Enroll in a roadmap to see your tasks here.</p>
          </div>
          <button onClick={() => navigate('/roadmaps')} className="dash-btn-primary text-[13px] px-5 py-2">
            Browse Roadmaps
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Task List (Left 2/3) ────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total',       value: counts.total,       color: 'bg-gray-50 text-gray-600',   icon: CheckSquare  },
                { label: 'Completed',   value: counts.completed,   color: 'bg-green-50 text-green-600', icon: CheckCircle2 },
                { label: 'In Progress', value: counts.in_progress, color: 'bg-amber-50 text-amber-600', icon: Clock        },
                { label: 'Available',   value: counts.available,   color: 'bg-blue-50 text-blue-600',   icon: Circle       },
              ].map(({ label, value, color, icon: Icon }) => (
                <div key={label} className={`dash-card p-3 flex items-center gap-3 ${color}`}>
                  <Icon size={16} className="shrink-0" />
                  <div>
                    <p className="text-xl font-bold">{value}</p>
                    <p className="text-[11px] opacity-80">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter + Search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1 self-start">
                {FILTERS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all ${
                      filter === f.id ? 'bg-white text-dash-text shadow-sm' : 'text-dash-muted hover:text-dash-text'
                    }`}
                  >
                    {f.label}
                    {f.id === 'all'         && ` (${counts.total})`}
                    {f.id === 'completed'   && ` (${counts.completed})`}
                    {f.id === 'in_progress' && ` (${counts.in_progress})`}
                    {f.id === 'available'   && ` (${counts.available})`}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-muted" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search tasks…"
                  className="dash-input pl-8 pr-4 py-2 text-[13px] w-56"
                />
              </div>
            </div>

            {/* Task list */}
            {filteredTasks.length === 0 ? (
              <div className="dash-card p-10 text-center">
                <Filter size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-dash-muted text-[13px]">No tasks match this filter.</p>
              </div>
            ) : (
              <motion.div
                key={filter + search}
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggle={handleToggle}
                    toggling={toggling}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* ── Roadmap Progress (Right 1/3) ─────────────────────── */}
          <div className="space-y-4">
            <div className="dash-card p-5">
              <h3 className="font-semibold text-[14px] text-dash-text mb-3 flex items-center gap-2">
                <Map size={15} className="text-dash-primary" /> Roadmap Progress
              </h3>
              <div className="space-y-1">
                {roadmaps.map(rm => (
                  <RoadmapProgressRow
                    key={rm._id}
                    roadmap={rm}
                    onClick={() => navigate(`/roadmaps/${rm._id}`)}
                  />
                ))}
              </div>
            </div>

            {counts.total > 0 && (
              <div className="dash-card p-5">
                <h3 className="font-semibold text-[14px] text-dash-text mb-3">Overall Progress</h3>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl font-bold text-dash-primary">
                    {Math.round((counts.completed / counts.total) * 100)}%
                  </div>
                  <div>
                    <p className="text-[12px] text-dash-text font-medium">{counts.completed} done</p>
                    <p className="text-[11px] text-dash-muted">of {counts.total} total</p>
                  </div>
                </div>
                <ProgressBar value={Math.round((counts.completed / counts.total) * 100)} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
