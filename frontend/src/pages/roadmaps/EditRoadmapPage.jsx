import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loader2, ArrowLeft, Lock } from 'lucide-react'

import RoadmapStepper        from '../../components/roadmap-builder/RoadmapStepper'
import Step1RoadmapInfo      from '../../components/roadmap-builder/steps/Step1RoadmapInfo'
import Step2Modules          from '../../components/roadmap-builder/steps/Step2Modules'
import Step3Tasks            from '../../components/roadmap-builder/steps/Step3Tasks'
import Step4Resources        from '../../components/roadmap-builder/steps/Step4Resources'
import Step5Projects         from '../../components/roadmap-builder/steps/Step5Projects'
import Step6ProjectResources from '../../components/roadmap-builder/steps/Step6ProjectResources'
import Step7ReviewPublish    from '../../components/roadmap-builder/steps/Step7ReviewPublish'

import roadmapService        from '../../services/roadmapService'
import roadmapBuilderService from '../../services/roadmapBuilderService'

/* ─── helpers ──────────────────────────────────────────────────── */
const uid = () => crypto.randomUUID()

const makeModule = () => ({
  _localId: uid(), title: '', description: '', tasks: [],
})
const makeTask = () => ({
  _localId: uid(), title: '', description: '',
  taskType: 'concept', expectedThinking: '',
  successCriteria: [], resources: [],
})
const makeResource = () => ({
  _localId: uid(), type: 'youtube', title: '',
  link: '', whyThisResource: '', whenToUse: 'before-task',
})
const makeProject = () => ({
  _localId: uid(), title: '', problemStatement: '',
  constraints: [], expectedOutcome: '',
  difficulty: 'medium', extensionIdeas: [], resources: [],
})
const makeProjectResource = () => ({
  _localId: uid(), type: 'github', title: '',
  link: '', whyThisResource: '', whenToUse: 'before-project',
})

/* ─── step validation (relaxed for edit) ───────────────────────── */
function stepValid(step, info, modules, projects) {
  switch (step) {
    case 1:
      return (
        info.title?.trim().length >= 5 &&
        info.shortDescription?.trim().length >= 20 &&
        info.level && info.domain &&
        (!info.isPaid || info.price > 0)
      )
    case 2:
      return modules.length >= 1 && modules.every((m) => m.title.trim())
    case 3:
      return modules.every((m) => m.tasks.length >= 1 && m.tasks.every((t) => t.title.trim()))
    case 4:
      return true
    case 5:
      return projects.every((p) => !p.title || (p.title.trim() && p.problemStatement.trim()))
    case 6:
      return true
    default:
      return true
  }
}

/* ─── component ────────────────────────────────────────────────── */
export default function EditRoadmapPage() {
  const { roadmapId } = useParams()
  const navigate      = useNavigate()

  /* loading / published guard */
  const [loadingData, setLoadingData] = useState(true)
  const [isPublished, setIsPublished] = useState(false)
  const [step, setStep]               = useState(1)

  /* roadmap info */
  const [info, setInfo] = useState({
    title: '', shortDescription: '', detailedDescription: '',
    learningOutcomes: [], coverImage: '',
    level: '', domain: '', isPaid: false, price: 0,
  })
  const updateInfo = useCallback((field, value) => {
    setInfo((prev) => ({ ...prev, [field]: value }))
  }, [])

  /* modules */
  const [modules, setModules] = useState([])
  /* projects */
  const [projects, setProjects] = useState([])

  /* track server IDs removed during editing */
  const deletedRef = useRef({
    modules: [], tasks: [], resources: [], projects: [], projectResources: [],
  })

  /* submit state */
  const [isSubmitting, setIsSubmitting]       = useState(false)
  const [publishProgress, setPublishProgress] = useState(null)
  const [publishError, setPublishError]       = useState(null)

  /* ── load existing data ───────────────────────────────────────── */
  useEffect(() => {
    if (!roadmapId) return
    setLoadingData(true)

    Promise.allSettled([
      roadmapService.getById(roadmapId),
      roadmapService.getModules(roadmapId),
      roadmapService.getProjects(roadmapId),
    ]).then(async ([rmRes, modRes, projRes]) => {
      if (rmRes.status === 'rejected') {
        toast.error('Roadmap not found')
        navigate('/roadmaps')
        return
      }

      const rm   = rmRes.value.data ?? rmRes.value
      const mods = modRes.status  === 'fulfilled' ? (modRes.value.data  ?? modRes.value  ?? []) : []
      const proj = projRes.status === 'fulfilled' ? (projRes.value.data ?? projRes.value ?? []) : []

      setIsPublished(rm.isPublished ?? false)

      setInfo({
        title:               rm.title                ?? '',
        shortDescription:    rm.shortDescription     ?? '',
        detailedDescription: rm.detailedDescription  ?? rm.description ?? '',
        learningOutcomes:    rm.learningOutcomes      ?? [],
        coverImage:          rm.coverImage            ?? '',
        level:               rm.level                ?? '',
        domain:              rm.domain               ?? '',
        isPaid:              rm.isPaid               ?? false,
        price:               rm.price                ?? 0,
      })

      /* load modules → tasks → resources */
      const modsWithTasks = await Promise.all(
        mods.map(async (mod) => {
          let tasks = []
          try {
            const tasksRes = await roadmapService.getTasks(mod._id)
            const rawTasks = tasksRes.data ?? tasksRes ?? []

            tasks = await Promise.all(
              rawTasks.map(async (task) => {
                let resources = []
                try {
                  const resRes  = await roadmapService.getTaskResources(task._id)
                  const rawRes  = resRes.data ?? resRes ?? []
                  resources = rawRes.map((r) => ({
                    _localId: uid(), _serverId: r._id,
                    type: r.type ?? 'youtube', title: r.title ?? '',
                    link: r.link ?? r.url ?? '',
                    whyThisResource: r.whyThisResource ?? '',
                    whenToUse: r.whenToUse ?? 'before-task',
                  }))
                } catch (_) {}
                return {
                  _localId: uid(), _serverId: task._id,
                  title: task.title ?? '', description: task.description ?? '',
                  taskType: task.taskType ?? 'concept',
                  expectedThinking: task.expectedThinking ?? '',
                  successCriteria: task.successCriteria ?? [],
                  resources,
                }
              })
            )
          } catch (_) {}

          return {
            _localId: uid(), _serverId: mod._id,
            title: mod.title ?? '', description: mod.description ?? '',
            tasks,
          }
        })
      )
      setModules(modsWithTasks)

      /* load projects → resources */
      const projsWithRes = await Promise.all(
        proj.map(async (p) => {
          let resources = []
          try {
            const resRes = await roadmapService.getProjectResources(p._id)
            const rawRes = resRes.data ?? resRes ?? []
            resources = rawRes.map((r) => ({
              _localId: uid(), _serverId: r._id,
              type: r.type ?? 'github', title: r.title ?? '',
              link: r.link ?? r.url ?? '',
              whyThisResource: r.whyThisResource ?? '',
              whenToUse: r.whenToUse ?? 'before-project',
            }))
          } catch (_) {}
          return {
            _localId: uid(), _serverId: p._id,
            title: p.title ?? '', problemStatement: p.problemStatement ?? '',
            constraints: p.constraints ?? [], expectedOutcome: p.expectedOutcome ?? '',
            difficulty: p.difficulty ?? 'medium', extensionIdeas: p.extensionIdeas ?? [],
            resources,
          }
        })
      )
      setProjects(projsWithRes)

      setLoadingData(false)
    })
  }, [roadmapId, navigate])

  /* ── module CRUD ──────────────────────────────────────────────── */
  const addModule = useCallback(() => setModules((p) => [...p, makeModule()]), [])

  const updateModule = useCallback((moduleId, field, value) => {
    setModules((p) => p.map((m) => m._localId === moduleId ? { ...m, [field]: value } : m))
  }, [])

  const removeModule = useCallback((moduleId) => {
    setModules((prev) => {
      const mod = prev.find((m) => m._localId === moduleId)
      if (mod?._serverId) {
        deletedRef.current.modules.push(mod._serverId)
        mod.tasks?.forEach((t) => {
          if (t._serverId) deletedRef.current.tasks.push(t._serverId)
          t.resources?.forEach((r) => {
            if (r._serverId) deletedRef.current.resources.push(r._serverId)
          })
        })
      }
      return prev.filter((m) => m._localId !== moduleId)
    })
  }, [])

  /* tasks */
  const addTask = useCallback((moduleId) => {
    setModules((p) => p.map((m) =>
      m._localId === moduleId ? { ...m, tasks: [...m.tasks, makeTask()] } : m
    ))
  }, [])

  const updateTask = useCallback((moduleId, taskId, field, value) => {
    setModules((p) => p.map((m) =>
      m._localId === moduleId
        ? { ...m, tasks: m.tasks.map((t) => t._localId === taskId ? { ...t, [field]: value } : t) }
        : m
    ))
  }, [])

  const removeTask = useCallback((moduleId, taskId) => {
    setModules((prev) => prev.map((m) => {
      if (m._localId !== moduleId) return m
      const task = m.tasks.find((t) => t._localId === taskId)
      if (task?._serverId) {
        deletedRef.current.tasks.push(task._serverId)
        task.resources?.forEach((r) => {
          if (r._serverId) deletedRef.current.resources.push(r._serverId)
        })
      }
      return { ...m, tasks: m.tasks.filter((t) => t._localId !== taskId) }
    }))
  }, [])

  /* resources */
  const addResource = useCallback((moduleId, taskId) => {
    setModules((p) => p.map((m) =>
      m._localId === moduleId
        ? { ...m, tasks: m.tasks.map((t) => t._localId === taskId ? { ...t, resources: [...t.resources, makeResource()] } : t) }
        : m
    ))
  }, [])

  const updateResource = useCallback((moduleId, taskId, resourceId, field, value) => {
    setModules((p) => p.map((m) =>
      m._localId === moduleId
        ? {
            ...m, tasks: m.tasks.map((t) =>
              t._localId === taskId
                ? { ...t, resources: t.resources.map((r) => r._localId === resourceId ? { ...r, [field]: value } : r) }
                : t
            ),
          }
        : m
    ))
  }, [])

  const removeResource = useCallback((moduleId, taskId, resourceId) => {
    setModules((prev) => prev.map((m) => {
      if (m._localId !== moduleId) return m
      return {
        ...m, tasks: m.tasks.map((t) => {
          if (t._localId !== taskId) return t
          const res = t.resources.find((r) => r._localId === resourceId)
          if (res?._serverId) deletedRef.current.resources.push(res._serverId)
          return { ...t, resources: t.resources.filter((r) => r._localId !== resourceId) }
        }),
      }
    }))
  }, [])

  /* ── project CRUD ─────────────────────────────────────────────── */
  const addProject = useCallback(() => setProjects((p) => [...p, makeProject()]), [])

  const updateProject = useCallback((projectId, field, value) => {
    setProjects((p) => p.map((pr) => pr._localId === projectId ? { ...pr, [field]: value } : pr))
  }, [])

  const removeProject = useCallback((projectId) => {
    setProjects((prev) => {
      const proj = prev.find((p) => p._localId === projectId)
      if (proj?._serverId) {
        deletedRef.current.projects.push(proj._serverId)
        proj.resources?.forEach((r) => {
          if (r._serverId) deletedRef.current.projectResources.push(r._serverId)
        })
      }
      return prev.filter((p) => p._localId !== projectId)
    })
  }, [])

  /* project resources */
  const addProjectResource = useCallback((projectId) => {
    setProjects((p) => p.map((pr) =>
      pr._localId === projectId ? { ...pr, resources: [...pr.resources, makeProjectResource()] } : pr
    ))
  }, [])

  const updateProjectResource = useCallback((projectId, resourceId, field, value) => {
    setProjects((p) => p.map((pr) =>
      pr._localId === projectId
        ? { ...pr, resources: pr.resources.map((r) => r._localId === resourceId ? { ...r, [field]: value } : r) }
        : pr
    ))
  }, [])

  const removeProjectResource = useCallback((projectId, resourceId) => {
    setProjects((prev) => prev.map((pr) => {
      if (pr._localId !== projectId) return pr
      const res = pr.resources.find((r) => r._localId === resourceId)
      if (res?._serverId) deletedRef.current.projectResources.push(res._serverId)
      return { ...pr, resources: pr.resources.filter((r) => r._localId !== resourceId) }
    }))
  }, [])

  /* ── submit (update) ──────────────────────────────────────────── */
  const handleUpdate = async () => {
    setIsSubmitting(true)
    setPublishError(null)

    try {
      /* 1. Update roadmap info */
      setPublishProgress('roadmap')
      await roadmapBuilderService.updateRoadmap(roadmapId, {
        title: info.title, shortDescription: info.shortDescription,
        detailedDescription: info.detailedDescription,
        learningOutcomes: info.learningOutcomes, coverImage: info.coverImage,
        level: info.level, domain: info.domain,
        isPaid: info.isPaid, price: info.isPaid ? info.price : 0,
      })

      /* 2. Delete removed modules */
      setPublishProgress('modules')
      for (const id of deletedRef.current.modules) {
        try { await roadmapBuilderService.deleteModule(id) } catch (_) {}
      }

      /* 3. Update/create modules */
      const serverModules = []
      for (let i = 0; i < modules.length; i++) {
        const mod = modules[i]
        let actualId = mod._serverId
        if (actualId) {
          await roadmapBuilderService.updateModule(actualId, {
            title: mod.title, description: mod.description, order: i + 1,
          })
        } else {
          const { module: sm } = await roadmapBuilderService.createModule(roadmapId, {
            title: mod.title, description: mod.description, order: i + 1,
          })
          actualId = sm._id
        }
        serverModules.push({ ...mod, _actualServerId: actualId })
      }

      /* 4. Delete removed tasks */
      setPublishProgress('tasks')
      for (const id of deletedRef.current.tasks) {
        try { await roadmapBuilderService.deleteTask(id) } catch (_) {}
      }

      /* 5. Update/create tasks */
      const serverTasks = []
      for (const mod of serverModules) {
        for (let i = 0; i < mod.tasks.length; i++) {
          const task = mod.tasks[i]
          let actualId = task._serverId
          if (actualId) {
            await roadmapBuilderService.updateTask(actualId, {
              title: task.title, description: task.description,
              taskType: task.taskType, expectedThinking: task.expectedThinking,
              successCriteria: task.successCriteria, order: i + 1,
            })
          } else {
            const { task: st } = await roadmapBuilderService.createTask(mod._actualServerId, {
              title: task.title, description: task.description,
              taskType: task.taskType, expectedThinking: task.expectedThinking,
              successCriteria: task.successCriteria, order: i + 1,
            })
            actualId = st._id
          }
          serverTasks.push({ ...task, _actualServerId: actualId })
        }
      }

      /* 6. Delete removed task resources */
      setPublishProgress('resources')
      for (const id of deletedRef.current.resources) {
        try { await roadmapBuilderService.deleteResource(id) } catch (_) {}
      }

      /* 7. Update/create task resources */
      for (const task of serverTasks) {
        for (const res of task.resources) {
          if (res._serverId) {
            await roadmapBuilderService.updateResource(res._serverId, {
              type: res.type, title: res.title, link: res.link,
              whyThisResource: res.whyThisResource, whenToUse: res.whenToUse,
            })
          } else {
            await roadmapBuilderService.createResource(task._actualServerId, {
              type: res.type, title: res.title, link: res.link,
              whyThisResource: res.whyThisResource, whenToUse: res.whenToUse,
            })
          }
        }
      }

      /* 8. Delete removed projects */
      setPublishProgress('projects')
      for (const id of deletedRef.current.projects) {
        try { await roadmapBuilderService.deleteProject(id) } catch (_) {}
      }

      /* 9. Update/create projects */
      const serverProjects = []
      for (const proj of projects) {
        let actualId = proj._serverId
        if (actualId) {
          await roadmapBuilderService.updateProject(actualId, {
            title: proj.title, problemStatement: proj.problemStatement,
            constraints: proj.constraints, expectedOutcome: proj.expectedOutcome,
            difficulty: proj.difficulty, extensionIdeas: proj.extensionIdeas,
          })
        } else {
          const { project: sp } = await roadmapBuilderService.createProject(roadmapId, {
            title: proj.title, problemStatement: proj.problemStatement,
            constraints: proj.constraints, expectedOutcome: proj.expectedOutcome,
            difficulty: proj.difficulty, extensionIdeas: proj.extensionIdeas,
          })
          actualId = sp._id
        }
        serverProjects.push({ ...proj, _actualServerId: actualId })
      }

      /* 10. Delete removed project resources */
      setPublishProgress('project-resources')
      for (const id of deletedRef.current.projectResources) {
        try { await roadmapBuilderService.deleteProjectResource(id) } catch (_) {}
      }

      /* 11. Update/create project resources */
      for (const proj of serverProjects) {
        for (const res of proj.resources) {
          if (res._serverId) {
            await roadmapBuilderService.updateProjectResource(res._serverId, {
              type: res.type, title: res.title, link: res.link,
              whyThisResource: res.whyThisResource, whenToUse: res.whenToUse,
            })
          } else {
            await roadmapBuilderService.createProjectResource(proj._actualServerId, {
              type: res.type, title: res.title, link: res.link,
              whyThisResource: res.whyThisResource, whenToUse: res.whenToUse,
            })
          }
        }
      }

      setPublishProgress('done')
      toast.success('Roadmap saved successfully!')
      navigate(`/roadmaps/${roadmapId}`)
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Something went wrong'
      setPublishError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ── nav ──────────────────────────────────────────────────────── */
  const goNext      = () => setStep((s) => Math.min(s + 1, 7))
  const goPrev      = () => setStep((s) => Math.max(s - 1, 1))
  const canProceed  = stepValid(step, info, modules, projects)

  /* ── loading state ────────────────────────────────────────────── */
  if (loadingData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        <div className="shimmer h-8 w-48 rounded" />
        <div className="shimmer h-12 w-full rounded-xl" />
        <div className="shimmer h-64 w-full rounded-2xl" />
      </div>
    )
  }

  /* ── published guard ──────────────────────────────────────────── */
  if (isPublished) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="dash-card p-10 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
            <Lock className="text-amber-500" size={26} />
          </div>
          <h2 className="text-lg font-bold text-dash-text">Roadmap is Published</h2>
          <p className="text-[13px] text-dash-muted max-w-sm">
            This roadmap is already published and cannot be edited. Unpublish it first to make changes.
          </p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => navigate(-1)}
              className="dash-btn-outline px-5 py-2 text-[13px] flex items-center gap-2"
            >
              <ArrowLeft size={14} /> Go Back
            </button>
            <button
              onClick={() => navigate(`/roadmaps/${roadmapId}`)}
              className="dash-btn-primary px-5 py-2 text-[13px]"
            >
              View Roadmap
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── render ───────────────────────────────────────────────────── */
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[13px] text-dash-muted hover:text-dash-text transition-colors mb-3"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Roadmap</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update your roadmap structure. Changes are saved as a draft.
        </p>
      </div>

      {/* Stepper */}
      <RoadmapStepper currentStep={step} onGoTo={setStep} />

      {/* Step content */}
      <div className="dash-card p-6">
        {step === 1 && <Step1RoadmapInfo info={info} onChange={updateInfo} />}
        {step === 2 && (
          <Step2Modules
            modules={modules} onAdd={addModule}
            onUpdate={updateModule} onRemove={removeModule}
          />
        )}
        {step === 3 && (
          <Step3Tasks
            modules={modules} onAddTask={addTask}
            onUpdateTask={updateTask} onRemoveTask={removeTask}
          />
        )}
        {step === 4 && (
          <Step4Resources
            modules={modules} onAddResource={addResource}
            onUpdateResource={updateResource} onRemoveResource={removeResource}
          />
        )}
        {step === 5 && (
          <Step5Projects
            projects={projects} onAdd={addProject}
            onUpdate={updateProject} onRemove={removeProject}
          />
        )}
        {step === 6 && (
          <Step6ProjectResources
            projects={projects}
            onAddProjectResource={addProjectResource}
            onUpdateProjectResource={updateProjectResource}
            onRemoveProjectResource={removeProjectResource}
          />
        )}
        {step === 7 && (
          <Step7ReviewPublish
            info={info}
            modules={modules}
            projects={projects}
            onPublish={handleUpdate}
            isSubmitting={isSubmitting}
            publishProgress={publishProgress}
            publishError={publishError}
            editMode
          />
        )}
      </div>

      {/* Footer nav */}
      {step < 7 && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={goPrev}
            disabled={step === 1}
            className="dash-btn-outline px-5 py-2.5 text-sm disabled:opacity-40"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canProceed}
            className={`px-6 py-2.5 text-sm rounded-lg font-semibold transition-all ${
              canProceed ? 'dash-btn-primary' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}
