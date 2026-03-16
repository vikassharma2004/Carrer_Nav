import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Star, Users, BookOpen, ChevronDown, ChevronUp,
  CheckSquare, Square, ExternalLink, Folder, Link as LinkIcon,
  Loader2, AlertCircle, UserCircle, BadgeCheck,
} from 'lucide-react'
import roadmapService from '../../services/roadmapService'
import enrollmentService from '../../services/enrollmentService'
import progressService from '../../services/progressService'
import useAuthStore from '../../store/useAuthStore'

/* ─── Design helpers ───────────────────────────────────────── */
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

/* ─── Task item ────────────────────────────────────────────── */
function TaskItem({ task, completed, onToggle, canToggle }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0 group">
      <button
        onClick={() => canToggle && onToggle(task._id, completed)}
        className={`mt-0.5 shrink-0 transition-colors ${canToggle ? 'cursor-pointer' : 'cursor-default'}`}
        disabled={!canToggle}
      >
        {completed
          ? <CheckSquare size={17} className="text-dash-primary" />
          : <Square size={17} className="text-gray-300 group-hover:text-gray-400" />
        }
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-medium leading-snug ${completed ? 'line-through text-dash-muted' : 'text-dash-text'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-[12px] text-dash-muted mt-0.5 leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}
        {task.resources?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {task.resources.map((r) => (
              <a
                key={r._id}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline"
              >
                <LinkIcon size={10} /> {r.title ?? 'Resource'}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Project card ─────────────────────────────────────────── */
function ProjectCard({ project }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <Folder size={15} className="text-dash-primary" />
        <p className="font-semibold text-[14px] text-dash-text">{project.title}</p>
      </div>
      {project.description && (
        <p className="text-[12px] text-dash-muted leading-relaxed mb-3">{project.description}</p>
      )}
      {project.resources?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.resources.map((r, i) => (
            <a
              key={i}
              href={r.url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-dash-text hover:border-dash-primary hover:text-dash-primary transition-colors"
            >
              <ExternalLink size={10} /> {r.title ?? 'Resource'}
            </a>
          ))}
        </div>
      )}
      <button className="dash-btn-primary text-[12px] px-3 py-1.5 flex items-center gap-1.5">
        <ExternalLink size={12} /> Submit Project
      </button>
    </div>
  )
}

/* ─── Module accordion ─────────────────────────────────────── */
function ModuleAccordion({ module, index, completedTasks, onToggleTask, canToggle, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const tasks    = module.tasks ?? []
  const doneCount = tasks.filter((t) => completedTasks.has(t._id)).length
  const pct       = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
      className="dash-card overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-dash-primary/10 text-dash-primary flex items-center justify-center font-bold text-[13px] shrink-0">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[14px] text-dash-text">{module.title}</p>
          {module.description && (
            <p className="text-[12px] text-dash-muted mt-0.5 line-clamp-1">{module.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-[12px] font-semibold text-dash-primary">{pct}%</p>
            <p className="text-[11px] text-dash-muted">{doneCount}/{tasks.length} tasks</p>
          </div>
          {open ? <ChevronUp size={16} className="text-dash-muted" /> : <ChevronDown size={16} className="text-dash-muted" />}
        </div>
      </button>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-dash-primary"
        />
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-2 space-y-4">
              {/* Tasks */}
              {tasks.length > 0 ? (
                <div>
                  <p className="text-[11px] font-semibold text-dash-muted uppercase tracking-wider mb-2">
                    Tasks ({tasks.length})
                  </p>
                  {tasks.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      completed={completedTasks.has(task._id)}
                      onToggle={onToggleTask}
                      canToggle={canToggle}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-dash-muted py-2">No tasks in this module.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Main page ────────────────────────────────────────────── */
export default function RoadmapDetailPage() {
  const { roadmapId } = useParams()
  const navigate      = useNavigate()
  const { user }      = useAuthStore()

  const [roadmap, setRoadmap]           = useState(null)
  const [modules, setModules]           = useState([])
  const [projects, setProjects]         = useState([])
  const [completedTasks, setCompleted]  = useState(new Set())
  const [enrolled, setEnrolled]         = useState(false)
  const [enrolling, setEnrolling]       = useState(false)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  const isLearner = user?.role === 'learner'

  useEffect(() => {
    setLoading(true)
    setError(null)

    Promise.allSettled([
      roadmapService.getById(roadmapId),
      roadmapService.getModules(roadmapId),
      roadmapService.getProjects(roadmapId),
    ]).then(async ([rmRes, modRes, projRes]) => {
      if (rmRes.status === 'rejected') {
        setError('Roadmap not found or unavailable.')
        setLoading(false)
        return
      }

      const rm   = rmRes.value.data ?? rmRes.value
      const mods = modRes.status === 'fulfilled' ? (modRes.value.data ?? modRes.value ?? []) : []
      const proj = projRes.status === 'fulfilled' ? (projRes.value.data ?? projRes.value ?? []) : []

      setRoadmap(rm)
      setProjects(proj)

      // Fetch tasks for each module in parallel
      const modsWithTasks = await Promise.all(
        mods.map(async (mod) => {
          try {
            const tasksRes = await roadmapService.getTasks(mod._id)
            return { ...mod, tasks: tasksRes.data ?? tasksRes ?? [] }
          } catch (_) {
            return { ...mod, tasks: [] }
          }
        })
      )
      setModules(modsWithTasks)

      // Load progress if learner
      if (isLearner) {
        try {
          const progressRes = await progressService.getRoadmapProgress(roadmapId)
          const done = progressRes.data?.completedTasks ?? progressRes.completedTasks ?? []
          setCompleted(new Set(done))
        } catch (_) {}

        try {
          const statusRes = await enrollmentService.getStatus(roadmapId)
          setEnrolled(statusRes.data?.enrolled ?? statusRes.enrolled ?? false)
        } catch (_) {}
      }

      setLoading(false)
    })
  }, [roadmapId, isLearner])

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      if (enrolled) {
        await enrollmentService.drop(roadmapId)
        setEnrolled(false)
      } else {
        await enrollmentService.enroll(roadmapId)
        setEnrolled(true)
      }
    } catch (_) {}
    setEnrolling(false)
  }

  const handleToggleTask = async (taskId, isCompleted) => {
    try {
      if (isCompleted) {
        // No "uncomplete" endpoint — just optimistic UI
        setCompleted((prev) => { const s = new Set(prev); s.delete(taskId); return s })
      } else {
        await progressService.completeTask(taskId)
        setCompleted((prev) => new Set([...prev, taskId]))
      }
    } catch (_) {}
  }

  const totalTasks = modules.reduce((acc, m) => acc + (m.tasks?.length ?? 0), 0)
  const doneTasks  = completedTasks.size
  const overallPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  /* ── Loading ─── */
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="shimmer h-64 rounded-2xl" />
        <div className="space-y-3">
          <div className="shimmer h-8 w-2/3 rounded" />
          <div className="shimmer h-4 w-1/2 rounded" />
        </div>
        {[...Array(3)].map((_, i) => <div key={i} className="shimmer h-16 rounded-2xl" />)}
      </div>
    )
  }

  /* ── Error ─── */
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="dash-card p-16 flex flex-col items-center gap-4 text-center">
          <AlertCircle className="text-dash-primary" size={40} />
          <p className="text-dash-text font-semibold text-lg">{error}</p>
          <button onClick={() => navigate('/roadmaps')} className="dash-btn-primary px-5 py-2.5 text-[14px]">
            Back to Roadmaps
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Back ─────────────────────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[13px] text-dash-muted hover:text-dash-text transition-colors"
      >
        <ArrowLeft size={15} /> Back to Roadmaps
      </motion.button>

      {/* ── Header ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="dash-card overflow-hidden"
      >
        {/* Cover */}
        <div className="h-52 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          {roadmap.coverImage
            ? <img src={roadmap.coverImage} alt={roadmap.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center"><BookOpen className="text-gray-300" size={48} /></div>
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            {roadmap.level && (
              <span className={`dash-badge ${LEVEL_BADGE[roadmap.level] ?? 'dash-badge-gray'} capitalize`}>
                {roadmap.level}
              </span>
            )}
            {roadmap.domain && (
              <span className={`dash-badge ${DOMAIN_COLORS[roadmap.domain] ?? 'bg-gray-100 text-gray-600'}`}>
                {roadmap.domain}
              </span>
            )}
            {roadmap.isPaid
              ? <span className="dash-badge dash-badge-amber">Paid</span>
              : <span className="dash-badge dash-badge-green">Free</span>
            }
          </div>
        </div>

        {/* Info */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-dash-text leading-tight">{roadmap.title}</h1>
              {roadmap.shortDescription && (
                <p className="text-[14px] text-dash-muted mt-2 leading-relaxed">{roadmap.shortDescription}</p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <span className="flex items-center gap-1.5 text-[13px] text-dash-text">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="font-semibold">{roadmap.rating?.toFixed(1) ?? '4.8'}</span>
                  <span className="text-dash-muted">({roadmap.ratingCount ?? 0} reviews)</span>
                </span>
                <span className="flex items-center gap-1.5 text-[13px] text-dash-muted">
                  <Users size={14} /> {roadmap.enrollmentCount ?? 0} learners
                </span>
                <span className="flex items-center gap-1.5 text-[13px] text-dash-muted">
                  <BookOpen size={14} /> {modules.length} modules · {totalTasks} tasks
                </span>
              </div>

              {/* Mentor */}
              {roadmap.createdBy && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-7 h-7 rounded-full bg-dash-primary/10 flex items-center justify-center">
                    <UserCircle size={16} className="text-dash-primary" />
                  </div>
                  <span className="text-[13px] text-dash-muted">
                    By <span className="text-dash-text font-medium">
                      {roadmap.createdBy?.name ?? 'Mentor'}
                    </span>
                    {roadmap.createdBy?.isVerified && (
                      <BadgeCheck size={13} className="inline ml-1 text-blue-500" />
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Enroll button + overall progress */}
            <div className="flex flex-col gap-3 min-w-[200px]">
              {isLearner && (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-[14px] transition-all ${
                    enrolled
                      ? 'bg-gray-100 text-dash-text hover:bg-gray-200'
                      : 'dash-btn-primary'
                  }`}
                >
                  {enrolling ? <Loader2 size={16} className="animate-spin" /> : null}
                  {enrolled ? 'Unfollow Roadmap' : 'Follow Roadmap'}
                </button>
              )}

              {isLearner && totalTasks > 0 && (
                <div className="dash-card p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] text-dash-muted">Overall progress</span>
                    <span className="text-[13px] font-bold text-dash-primary">{overallPct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${overallPct}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className="h-full rounded-full bg-dash-primary"
                    />
                  </div>
                  <p className="text-[11px] text-dash-muted mt-1">{doneTasks} of {totalTasks} tasks done</p>
                </div>
              )}
            </div>
          </div>

          {/* Full description */}
          {roadmap.description && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[13px] text-dash-muted leading-relaxed">{roadmap.description}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Modules ──────────────────────────────────────────── */}
      {modules.length > 0 && (
        <div>
          <h2 className="text-[16px] font-bold text-dash-text mb-3 flex items-center gap-2">
            <BookOpen size={16} className="text-dash-primary" />
            Curriculum ({modules.length} modules)
          </h2>
          {/* Scrollable modules panel — max-h ensures it never exceeds viewport height */}
          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {modules.map((mod, i) => (
              <ModuleAccordion
                key={mod._id}
                module={mod}
                index={i}
                completedTasks={completedTasks}
                onToggleTask={handleToggleTask}
                canToggle={isLearner && enrolled}
                defaultOpen={i === 0}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Projects ─────────────────────────────────────────── */}
      {projects.length > 0 && (
        <div>
          <h2 className="text-[16px] font-bold text-dash-text mb-3 flex items-center gap-2">
            <Folder size={16} className="text-dash-primary" />
            Projects ({projects.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => <ProjectCard key={proj._id} project={proj} />)}
          </div>
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────── */}
      {modules.length === 0 && projects.length === 0 && (
        <div className="dash-card p-12 text-center">
          <BookOpen className="mx-auto text-gray-300 mb-3" size={36} />
          <p className="text-dash-text font-medium">No content yet</p>
          <p className="text-[13px] text-dash-muted mt-1">This roadmap is being built. Check back soon.</p>
        </div>
      )}
    </div>
  )
}
