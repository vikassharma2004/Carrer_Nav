import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import RoadmapStepper from '../../components/roadmap-builder/RoadmapStepper'
import Step1RoadmapInfo from '../../components/roadmap-builder/steps/Step1RoadmapInfo'
import Step2Modules from '../../components/roadmap-builder/steps/Step2Modules'
import Step3Tasks from '../../components/roadmap-builder/steps/Step3Tasks'
import Step4Resources from '../../components/roadmap-builder/steps/Step4Resources'
import Step5Projects from '../../components/roadmap-builder/steps/Step5Projects'
import Step6ProjectResources from '../../components/roadmap-builder/steps/Step6ProjectResources'
import Step7ReviewPublish from '../../components/roadmap-builder/steps/Step7ReviewPublish'

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

/* ─── step validation ──────────────────────────────────────────── */
function stepValid(step, info, modules, projects) {
  switch (step) {
    case 1:
      return (
        info.title?.trim().length >= 5 &&
        info.shortDescription?.trim().length >= 20 &&
        info.learningOutcomes?.length >= 3 &&
        info.coverImage?.trim().length > 0 &&
        info.level && info.domain &&
        (!info.isPaid || (info.price > 0))
      )
    case 2:
      return modules.length >= 1 && modules.every((m) => m.title.trim())
    case 3:
      return modules.every((m) => m.tasks.length >= 1 && m.tasks.every((t) => t.title.trim()))
    case 4:
      return modules.every((m) => m.tasks.every((t) => t.resources.length >= 1))
    case 5:
      return projects.length >= 1 && projects.every((p) => p.title.trim() && p.problemStatement.trim())
    case 6:
      return true // project resources are optional per step
    default:
      return true
  }
}

/* ─── component ────────────────────────────────────────────────── */
export default function CreateRoadmapPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  /* ── roadmap info ─────── */
  const [info, setInfo] = useState({
    title: '', shortDescription: '', detailedDescription: '',
    learningOutcomes: [], coverImage: '',
    level: '', domain: '', isPaid: false, price: 0,
  })
  const updateInfo = useCallback((field, value) => {
    setInfo((prev) => ({ ...prev, [field]: value }))
  }, [])

  /* ── modules (with nested tasks → resources) ──────────────────── */
  const [modules, setModules] = useState([])

  const addModule = useCallback(() => setModules((p) => [...p, makeModule()]), [])

  const updateModule = useCallback((moduleId, field, value) => {
    setModules((p) => p.map((m) => m._localId === moduleId ? { ...m, [field]: value } : m))
  }, [])

  const removeModule = useCallback((moduleId) => {
    setModules((p) => p.filter((m) => m._localId !== moduleId))
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
    setModules((p) => p.map((m) =>
      m._localId === moduleId ? { ...m, tasks: m.tasks.filter((t) => t._localId !== taskId) } : m
    ))
  }, [])

  /* resources (on tasks) */
  const addResource = useCallback((moduleId, taskId) => {
    setModules((p) => p.map((m) =>
      m._localId === moduleId
        ? {
          ...m, tasks: m.tasks.map((t) =>
            t._localId === taskId ? { ...t, resources: [...t.resources, makeResource()] } : t
          )
        }
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
          )
        }
        : m
    ))
  }, [])

  const removeResource = useCallback((moduleId, taskId, resourceId) => {
    setModules((p) => p.map((m) =>
      m._localId === moduleId
        ? {
          ...m, tasks: m.tasks.map((t) =>
            t._localId === taskId
              ? { ...t, resources: t.resources.filter((r) => r._localId !== resourceId) }
              : t
          )
        }
        : m
    ))
  }, [])

  /* ── projects (with nested resources) ────────────────────────── */
  const [projects, setProjects] = useState([])

  const addProject = useCallback(() => setProjects((p) => [...p, makeProject()]), [])

  const updateProject = useCallback((projectId, field, value) => {
    setProjects((p) => p.map((pr) => pr._localId === projectId ? { ...pr, [field]: value } : pr))
  }, [])

  const removeProject = useCallback((projectId) => {
    setProjects((p) => p.filter((pr) => pr._localId !== projectId))
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
    setProjects((p) => p.map((pr) =>
      pr._localId === projectId
        ? { ...pr, resources: pr.resources.filter((r) => r._localId !== resourceId) }
        : pr
    ))
  }, [])

  /* ── publish flow ─────────────────────────────────────────────── */
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [publishProgress, setPublishProgress] = useState(null)
  const [publishError, setPublishError] = useState(null)

  const handlePublish = async () => {
    setIsSubmitting(true)
    setPublishError(null)

    try {
      /* 1. Create roadmap */
      setPublishProgress('roadmap')
      const { data: createdRoadmap } = await roadmapBuilderService.createRoadmap({
        title: info.title,
        shortDescription: info.shortDescription,
        detailedDescription: info.detailedDescription,
        learningOutcomes: info.learningOutcomes,
        coverImage: info.coverImage,
        level: info.level,
        domain: info.domain,
        isPaid: info.isPaid,
        price: info.isPaid ? info.price : 0,
      })
      const roadmapId = createdRoadmap._id

      /* 2. Create modules */
      setPublishProgress('modules')
      const serverModules = []
      for (let i = 0; i < modules.length; i++) {
        const mod = modules[i]
        const { module: sm } = await roadmapBuilderService.createModule(roadmapId, {
          title: mod.title,
          description: mod.description,
          order: i + 1,
        })
        serverModules.push({ ...mod, _serverId: sm._id })
      }

      /* 3. Create tasks */
      setPublishProgress('tasks')
      const serverTasks = []
      for (const mod of serverModules) {
        for (let i = 0; i < mod.tasks.length; i++) {
          const task = mod.tasks[i]
          const { task: st } = await roadmapBuilderService.createTask(mod._serverId, {
            title: task.title,
            description: task.description,
            taskType: task.taskType,
            expectedThinking: task.expectedThinking,
            successCriteria: task.successCriteria,
            order: i + 1,
          })
          serverTasks.push({ ...task, _serverId: st._id })
        }
      }

      /* 4. Create task resources */
      setPublishProgress('resources')
      for (const task of serverTasks) {
        for (const res of task.resources) {
          await roadmapBuilderService.createResource(task._serverId, {
            type: res.type,
            title: res.title,
            link: res.link,
            whyThisResource: res.whyThisResource,
            whenToUse: res.whenToUse,
          })
        }
      }

      /* 5. Create projects */
      setPublishProgress('projects')
      const serverProjects = []
      for (const proj of projects) {
        const { project: sp } = await roadmapBuilderService.createProject(roadmapId, {
          title: proj.title,
          problemStatement: proj.problemStatement,
          constraints: proj.constraints,
          expectedOutcome: proj.expectedOutcome,
          difficulty: proj.difficulty,
          extensionIdeas: proj.extensionIdeas,
        })
        serverProjects.push({ ...proj, _serverId: sp._id })
      }

      /* 6. Create project resources */
      setPublishProgress('project-resources')
      for (const proj of serverProjects) {
        for (const res of proj.resources) {
          await roadmapBuilderService.createProjectResource(proj._serverId, {
            type: res.type,
            title: res.title,
            link: res.link,
            whyThisResource: res.whyThisResource,
            whenToUse: res.whenToUse,
          })
        }
      }

      /* 7. Publish */
      setPublishProgress('publishing')
      await roadmapBuilderService.publishRoadmap(roadmapId)

      setPublishProgress('done')
      toast.success('Roadmap published successfully!')
      navigate(`/roadmaps/${roadmapId}`)
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Something went wrong'
      setPublishError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ── navigation ──────────────────────────────────────────────── */
  const goNext = () => setStep((s) => Math.min(s + 1, 7))
  const goPrev = () => setStep((s) => Math.max(s - 1, 1))
  const canProceed = stepValid(step, info, modules, projects)

  /* ── render ──────────────────────────────────────────────────── */
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Roadmap</h1>
        <p className="text-sm text-gray-500 mt-1">
          Build a structured learning path step by step.
        </p>
      </div>

      {/* Stepper */}
      <RoadmapStepper currentStep={step} onGoTo={setStep} />

      {/* Step content */}
      <div className="dash-card p-6">
        {step === 1 && (
          <Step1RoadmapInfo info={info} onChange={updateInfo} />
        )}
        {step === 2 && (
          <Step2Modules
            modules={modules}
            onAdd={addModule}
            onUpdate={updateModule}
            onRemove={removeModule}
          />
        )}
        {step === 3 && (
          <Step3Tasks
            modules={modules}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onRemoveTask={removeTask}
          />
        )}
        {step === 4 && (
          <Step4Resources
            modules={modules}
            onAddResource={addResource}
            onUpdateResource={updateResource}
            onRemoveResource={removeResource}
          />
        )}
        {step === 5 && (
          <Step5Projects
            projects={projects}
            onAdd={addProject}
            onUpdate={updateProject}
            onRemove={removeProject}
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
            onPublish={handlePublish}
            isSubmitting={isSubmitting}
            publishProgress={publishProgress}
            publishError={publishError}
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
