import { useState, useEffect, useCallback, memo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, BookOpen, ChevronDown, ChevronRight, CheckCircle2,
  Circle, Loader2, ExternalLink, FileText, Video, Link as LinkIcon,
  Send, CheckSquare, AlertCircle, Lightbulb, Target, Brain,
  Lock, Award, Menu, X,
} from 'lucide-react'
import roadmapService   from '../../services/roadmapService'
import progressService  from '../../services/progressService'
import enrollmentService from '../../services/enrollmentService'
import useAuthStore      from '../../store/useAuthStore'
import { connectSocket, getSocket } from '../../services/socket'

/* ─── constants ──────────────────────────────────────────────── */
const DOMAIN_GRADIENT = {
  frontend:        'from-blue-500 to-cyan-500',
  backend:         'from-green-500 to-teal-500',
  fullstack:       'from-purple-500 to-indigo-600',
  mobile:          'from-pink-500 to-rose-500',
  devops:          'from-amber-500 to-orange-500',
  'system-design': 'from-indigo-500 to-violet-600',
  data:            'from-teal-500 to-cyan-500',
  'ai-ml':         'from-pink-500 to-fuchsia-500',
  security:        'from-red-500 to-rose-600',
}

const RESOURCE_ICON = {
  video:    Video,
  article:  FileText,
  link:     LinkIcon,
  pdf:      FileText,
}

/* ─── helpers ─────────────────────────────────────────────────── */
function pctOf(tasks, completedSet) {
  if (!tasks?.length) return 0
  return Math.round((tasks.filter(t => completedSet.has(t._id)).length / tasks.length) * 100)
}

/* ─── ProgressRing ────────────────────────────────────────────── */
function ProgressRing({ pct, size = 32, stroke = 3 }) {
  const r   = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const dash = circ * (pct / 100)
  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        stroke="#E9340D" strokeWidth={stroke} fill="none"
        strokeLinecap="round"
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${dash} ${circ}` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
    </svg>
  )
}

/* ─── ModuleSidebarItem ───────────────────────────────────────── */
const ModuleSidebarItem = memo(function ModuleSidebarItem({
  module, index, isActive, pct, doneTasks, totalTasks, onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
        isActive
          ? 'bg-[#FFF3F0] border-r-2 border-dash-primary'
          : 'hover:bg-gray-50 border-r-2 border-transparent'
      }`}
    >
      <ProgressRing pct={pct} size={34} stroke={3} />
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-semibold leading-snug line-clamp-2 ${
          isActive ? 'text-dash-primary' : 'text-dash-text'
        }`}>
          {String(index + 1).padStart(2, '0')}. {module.title}
        </p>
        <p className="text-[11px] text-dash-muted mt-0.5">
          {doneTasks}/{totalTasks} tasks · {pct}%
        </p>
      </div>
      <ChevronRight size={13} className={`shrink-0 transition-colors ${isActive ? 'text-dash-primary' : 'text-dash-muted'}`} />
    </button>
  )
})

/* ─── ResourceItem ────────────────────────────────────────────── */
const ResourceItem = memo(function ResourceItem({ resource }) {
  const Icon = RESOURCE_ICON[resource.type] ?? LinkIcon
  return (
    <a
      href={resource.url ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 hover:bg-[#FFF3F0] border border-transparent hover:border-dash-primary/20 transition-all group"
    >
      <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-dash-primary/30">
        <Icon size={13} className="text-dash-muted group-hover:text-dash-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-dash-text truncate">{resource.title ?? 'Resource'}</p>
        {resource.type && (
          <p className="text-[11px] text-dash-muted capitalize">{resource.type}</p>
        )}
      </div>
      <ExternalLink size={11} className="shrink-0 text-dash-muted opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  )
})

/* ─── TaskCard ────────────────────────────────────────────────── */
const TaskCard = memo(function TaskCard({ task, isActive, isCompleted, onSelect, onComplete, completing }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect(task)}
      className={`group cursor-pointer rounded-2xl border transition-all ${
        isActive
          ? 'border-dash-primary/40 bg-[#FFF3F0] shadow-sm'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Complete button */}
        <button
          onClick={(e) => { e.stopPropagation(); !isCompleted && onComplete(task._id) }}
          disabled={isCompleted || completing === task._id}
          className="mt-0.5 shrink-0"
        >
          {completing === task._id ? (
            <Loader2 size={18} className="animate-spin text-dash-primary" />
          ) : isCompleted ? (
            <CheckCircle2 size={18} className="text-green-500 fill-green-500" />
          ) : (
            <Circle size={18} className="text-gray-300 group-hover:text-dash-primary transition-colors" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {task.taskType && (
              <span className={`dash-badge text-[10px] ${
                task.taskType === 'concept'        ? 'bg-blue-50 text-blue-600' :
                task.taskType === 'implementation' ? 'bg-green-50 text-green-600' :
                task.taskType === 'debugging'      ? 'bg-amber-50 text-amber-700' :
                'bg-purple-50 text-purple-600'
              }`}>
                {task.taskType}
              </span>
            )}
            {isCompleted && (
              <span className="dash-badge dash-badge-green text-[10px]">Done</span>
            )}
          </div>

          <p className={`text-[14px] font-semibold leading-snug ${
            isCompleted ? 'line-through text-dash-muted' : 'text-dash-text'
          }`}>
            {task.title}
          </p>

          {task.description && (
            <p className="text-[12px] text-dash-muted mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        <ChevronRight
          size={14}
          className={`shrink-0 mt-1 transition-all ${
            isActive ? 'text-dash-primary rotate-90' : 'text-gray-300 group-hover:text-gray-400'
          }`}
        />
      </div>
    </motion.div>
  )
})

/* ─── SubmissionPanel ─────────────────────────────────────────── */
const SubmissionPanel = memo(function SubmissionPanel({
  task, resources, loadingResources, onSubmit, submitting, completed, submitFeedback,
}) {
  const [text, setText] = useState('')

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
          <Target size={20} className="text-gray-400" />
        </div>
        <p className="text-[13px] text-dash-muted">Select a task to view details and submit your work.</p>
      </div>
    )
  }

  const handleSubmit = () => {
    if (!text.trim()) return
    onSubmit(task._id, text)
    setText('')
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Task header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
        <p className="text-[11px] text-dash-muted uppercase tracking-wider font-semibold mb-1">
          Task Details
        </p>
        <h3 className="text-[14px] font-bold text-dash-text leading-snug">{task.title}</h3>
        {task.taskType && (
          <span className={`dash-badge text-[10px] mt-1 inline-block ${
            task.taskType === 'concept'        ? 'bg-blue-50 text-blue-600' :
            task.taskType === 'implementation' ? 'bg-green-50 text-green-600' :
            task.taskType === 'debugging'      ? 'bg-amber-50 text-amber-700' :
            'bg-purple-50 text-purple-600'
          }`}>
            {task.taskType}
          </span>
        )}
      </div>

      <div className="flex-1 p-5 space-y-5 overflow-y-auto">
        {/* Description */}
        {task.description && (
          <div>
            <p className="text-[11px] text-dash-muted font-semibold uppercase tracking-wider mb-1.5">Description</p>
            <p className="text-[13px] text-dash-text leading-relaxed">{task.description}</p>
          </div>
        )}

        {/* Success criteria */}
        {task.successCriteria && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Target size={13} className="text-green-600" />
              <p className="text-[11px] font-semibold text-green-700 uppercase tracking-wider">Success Criteria</p>
            </div>
            <p className="text-[12px] text-green-800 leading-relaxed">{task.successCriteria}</p>
          </div>
        )}

        {/* Expected thinking */}
        {task.expectedThinking && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Brain size={13} className="text-blue-600" />
              <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Expected Thinking</p>
            </div>
            <p className="text-[12px] text-blue-800 leading-relaxed">{task.expectedThinking}</p>
          </div>
        )}

        {/* Hints */}
        {task.hints?.length > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb size={13} className="text-amber-600" />
              <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Hints</p>
            </div>
            <ul className="space-y-1">
              {task.hints.map((h, i) => (
                <li key={i} className="text-[12px] text-amber-800 leading-relaxed flex gap-1.5">
                  <span className="shrink-0">•</span> {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Resources */}
        <div>
          <p className="text-[11px] text-dash-muted font-semibold uppercase tracking-wider mb-2">Resources</p>
          {loadingResources ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <div key={i} className="shimmer h-9 rounded-xl" />)}
            </div>
          ) : resources?.length > 0 ? (
            <div className="space-y-1.5">
              {resources.map(r => <ResourceItem key={r._id} resource={r} />)}
            </div>
          ) : (
            <p className="text-[12px] text-dash-muted">No resources for this task.</p>
          )}
        </div>

        {/* Submission */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-[11px] text-dash-muted font-semibold uppercase tracking-wider mb-2">
            Your Submission
          </p>

          {completed ? (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl">
              <Award size={15} className="text-green-600 shrink-0" />
              <p className="text-[13px] text-green-700 font-medium">Task completed!</p>
            </div>
          ) : (
            <>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Describe your approach, share your solution, or ask a question…"
                rows={4}
                className="dash-input w-full text-[13px] resize-none leading-relaxed p-3"
              />

              {/* Feedback from socket */}
              <AnimatePresence>
                {submitFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className={`mt-2 p-3 rounded-xl text-[12px] leading-relaxed ${
                      submitFeedback.success
                        ? 'bg-green-50 border border-green-100 text-green-800'
                        : 'bg-amber-50 border border-amber-100 text-amber-800'
                    }`}
                  >
                    {submitFeedback.message ?? 'Submitted!'}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleSubmit}
                disabled={!text.trim() || submitting}
                className="mt-2.5 w-full dash-btn-primary flex items-center justify-center gap-2 text-[13px] py-2.5 disabled:opacity-50"
              >
                {submitting
                  ? <><Loader2 size={14} className="animate-spin" /> Submitting…</>
                  : <><Send size={14} /> Submit Task</>
                }
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
})

/* ─── TaskListSkeleton ────────────────────────────────────────── */
function TaskListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
          <div className="shimmer w-5 h-5 rounded-full mt-0.5 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="shimmer h-3 w-1/4 rounded" />
            <div className="shimmer h-4 w-3/4 rounded" />
            <div className="shimmer h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Main Page ───────────────────────────────────────────────── */
export default function LearningPage() {
  const { roadmapId }   = useParams()
  const navigate        = useNavigate()
  const { user }        = useAuthStore()
  const queryClient     = useQueryClient()

  const [activeModuleId, setActiveModuleId] = useState(null)
  const [activeTask, setActiveTask]         = useState(null)
  const [completedTasks, setCompletedTasks] = useState(new Set())
  const [completing, setCompleting]         = useState(null)
  const [submitting, setSubmitting]         = useState(false)
  const [submitFeedback, setSubmitFeedback] = useState(null)
  const [sidebarOpen, setSidebarOpen]       = useState(false)

  // ── Connect socket on mount ───────────────────────────────────
  useEffect(() => {
    connectSocket()

    const socket = getSocket()
    if (!socket) return

    const onFeedback = (data) => {
      setSubmitFeedback(data)
      if (data.success && data.taskId) {
        setCompletedTasks(prev => new Set([...prev, data.taskId]))
        queryClient.invalidateQueries({ queryKey: ['progress', roadmapId] })
      }
      setTimeout(() => setSubmitFeedback(null), 4000)
    }

    socket.on('task:submission:result', onFeedback)
    return () => socket.off('task:submission:result', onFeedback)
  }, [roadmapId, queryClient])

  // ── Queries ───────────────────────────────────────────────────
  const { data: roadmapData, isLoading: loadingRoadmap } = useQuery({
    queryKey: ['roadmap', roadmapId],
    queryFn:  () => roadmapService.getById(roadmapId),
    staleTime: 60_000,
  })

  const { data: modulesData, isLoading: loadingModules } = useQuery({
    queryKey: ['modules', roadmapId],
    queryFn:  () => roadmapService.getModules(roadmapId),
    staleTime: 60_000,
    onSuccess: (data) => {
      // Auto-select first module
      const mods = data?.modules ?? data?.data ?? data ?? []
      if (mods.length > 0 && !activeModuleId) {
        setActiveModuleId(mods[0]._id)
      }
    },
  })

  // Lazy: only fetch when module is selected
  const { data: tasksData, isLoading: loadingTasks } = useQuery({
    queryKey: ['tasks', activeModuleId],
    queryFn:  () => roadmapService.getTasks(activeModuleId),
    enabled:  !!activeModuleId,
    staleTime: 60_000,
  })

  // Lazy: only fetch when task is selected
  const { data: resourcesData, isLoading: loadingResources } = useQuery({
    queryKey: ['resources', activeTask?._id],
    queryFn:  () => roadmapService.getTaskResources(activeTask._id),
    enabled:  !!activeTask?._id,
    staleTime: 120_000,
  })

  // Progress query
  const { data: progressData } = useQuery({
    queryKey: ['progress', roadmapId],
    queryFn:  () => progressService.getRoadmapProgress(roadmapId),
    enabled:  user?.role === 'learner',
    staleTime: 30_000,
    onSuccess: (data) => {
      const done = data?.data?.completedTasks ?? data?.completedTasks ?? []
      setCompletedTasks(new Set(done))
    },
  })

  // ── Derived data ──────────────────────────────────────────────
  const roadmap = roadmapData?.roadmap ?? roadmapData?.data ?? roadmapData
  const modules = modulesData?.modules ?? modulesData?.data ?? modulesData ?? []
  const tasks   = tasksData?.tasks ?? tasksData?.data ?? tasksData ?? []
  const resources = resourcesData?.resources ?? resourcesData?.data ?? resourcesData ?? []

  const totalTasks = modules.reduce((acc, m) => acc + (m.taskCount ?? 0), completedTasks.size > 0 ? completedTasks.size : 0)
  const overallPct = modules.length > 0 && completedTasks.size > 0
    ? Math.min(100, Math.round((completedTasks.size / Math.max(totalTasks, 1)) * 100))
    : 0

  // ── Auto-select first module on load ─────────────────────────
  useEffect(() => {
    if (modules.length > 0 && !activeModuleId) {
      setActiveModuleId(modules[0]._id)
    }
  }, [modules, activeModuleId])

  // ── Handlers ─────────────────────────────────────────────────
  const handleSelectModule = useCallback((moduleId) => {
    setActiveModuleId(moduleId)
    setActiveTask(null)
    setSidebarOpen(false)
  }, [])

  const handleSelectTask = useCallback((task) => {
    setActiveTask(prev => prev?._id === task._id ? null : task)
  }, [])

  const handleComplete = useCallback(async (taskId) => {
    setCompleting(taskId)
    try {
      await progressService.completeTask(taskId)
      setCompletedTasks(prev => new Set([...prev, taskId]))
      queryClient.invalidateQueries({ queryKey: ['progress', roadmapId] })

      // Notify via socket
      const socket = getSocket()
      socket?.emit('task:completed', { taskId, roadmapId, userId: user?._id })
    } catch (_) {}
    setCompleting(null)
  }, [roadmapId, user, queryClient])

  const handleSubmit = useCallback(async (taskId, text) => {
    setSubmitting(true)
    setSubmitFeedback(null)

    const socket = getSocket()

    if (socket?.connected) {
      // Emit via socket — listen for result in the socket listener above
      socket.emit('task:submit', {
        taskId,
        userId:     user?._id,
        roadmapId,
        submission: text,
      })
    } else {
      // Fallback: REST complete
      try {
        await progressService.completeTask(taskId)
        setCompletedTasks(prev => new Set([...prev, taskId]))
        setSubmitFeedback({ success: true, message: 'Task marked as complete!' })
        queryClient.invalidateQueries({ queryKey: ['progress', roadmapId] })
      } catch (e) {
        setSubmitFeedback({ success: false, message: 'Failed to submit. Please try again.' })
      }
    }

    setSubmitting(false)
  }, [user, roadmapId, queryClient])

  /* ── Loading / error states ──────────────────────────────────── */
  if (loadingRoadmap || loadingModules) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-dash-primary" />
          <p className="text-[13px] text-dash-muted">Loading roadmap…</p>
        </div>
      </div>
    )
  }

  if (!roadmap) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center p-8">
          <AlertCircle size={36} className="text-red-400" />
          <p className="font-semibold text-dash-text">Roadmap not found</p>
          <button onClick={() => navigate('/roadmaps')} className="dash-btn-primary px-5 py-2 text-[13px]">
            Back to Roadmaps
          </button>
        </div>
      </div>
    )
  }

  const domain   = roadmap.domain
  const gradient = DOMAIN_GRADIENT[domain] ?? 'from-gray-400 to-gray-600'

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50">

      {/* ── Mobile sidebar overlay ────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Left Sidebar: Module list ─────────────────────────── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Roadmap header */}
        <div className={`bg-gradient-to-br ${gradient} p-4 shrink-0`}>
          <button
            onClick={() => navigate('/roadmaps')}
            className="flex items-center gap-1.5 text-white/80 hover:text-white text-[12px] mb-3 transition-colors"
          >
            <ArrowLeft size={13} /> Back
          </button>
          <h2 className="font-bold text-white text-[15px] leading-snug line-clamp-2">{roadmap.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            {domain && <span className="text-[10px] bg-white/20 text-white rounded-full px-2 py-0.5">{domain}</span>}
            {roadmap.level && <span className="text-[10px] bg-white/20 text-white rounded-full px-2 py-0.5 capitalize">{roadmap.level}</span>}
          </div>
          {/* Overall progress bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] text-white/80">Progress</p>
              <p className="text-[11px] text-white font-bold">{overallPct}%</p>
            </div>
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallPct}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="h-full rounded-full bg-white"
              />
            </div>
          </div>
        </div>

        {/* Module list */}
        <div className="flex-1 overflow-y-auto">
          {modules.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-6 text-center">
              <BookOpen size={24} className="text-gray-300" />
              <p className="text-[13px] text-dash-muted">No modules yet.</p>
            </div>
          ) : (
            modules.map((mod, i) => {
              const modPct  = pctOf([], completedTasks) // We don't have per-module task list here
              const done    = 0
              const total   = mod.taskCount ?? 0
              return (
                <ModuleSidebarItem
                  key={mod._id}
                  module={mod}
                  index={i}
                  isActive={activeModuleId === mod._id}
                  pct={modPct}
                  doneTasks={done}
                  totalTasks={total}
                  onClick={() => handleSelectModule(mod._id)}
                />
              )
            })
          )}
        </div>
      </aside>

      {/* ── Center: Task content ──────────────────────────────── */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-dash-muted"
          >
            <Menu size={16} />
          </button>

          <div className="flex-1 min-w-0">
            {activeModuleId && modules.length > 0 && (
              <p className="text-[14px] font-bold text-dash-text truncate">
                {modules.find(m => m._id === activeModuleId)?.title ?? 'Module'}
              </p>
            )}
          </div>

          <div className="text-[12px] text-dash-muted shrink-0">
            {tasks.length > 0 && (
              <span>{tasks.filter(t => completedTasks.has(t._id)).length}/{tasks.length} done</span>
            )}
          </div>
        </div>

        <div className="p-5">
          {!activeModuleId ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                <BookOpen size={28} className="text-gray-300" />
              </div>
              <p className="text-dash-muted text-[14px]">Select a module from the sidebar to begin.</p>
            </div>
          ) : loadingTasks ? (
            <TaskListSkeleton />
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <Lock size={28} className="text-gray-300" />
              <p className="text-dash-muted text-[13px]">No tasks in this module yet.</p>
            </div>
          ) : (
            <motion.div
              key={activeModuleId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {tasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  isActive={activeTask?._id === task._id}
                  isCompleted={completedTasks.has(task._id)}
                  onSelect={handleSelectTask}
                  onComplete={handleComplete}
                  completing={completing}
                />
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* ── Right: Submission panel ───────────────────────────── */}
      <AnimatePresence>
        {(activeTask || true) && (
          <motion.aside
            initial={false}
            animate={{ width: activeTask ? 320 : 0, opacity: activeTask ? 1 : 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="hidden lg:flex flex-col bg-white border-l border-gray-200 overflow-hidden shrink-0"
            style={{ width: activeTask ? 320 : 0 }}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
              <p className="text-[13px] font-semibold text-dash-text">Submission Panel</p>
              <button
                onClick={() => setActiveTask(null)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-dash-muted"
              >
                <X size={14} />
              </button>
            </div>

            <SubmissionPanel
              task={activeTask}
              resources={resources}
              loadingResources={loadingResources}
              onSubmit={handleSubmit}
              submitting={submitting}
              completed={activeTask ? completedTasks.has(activeTask._id) : false}
              submitFeedback={submitFeedback}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
