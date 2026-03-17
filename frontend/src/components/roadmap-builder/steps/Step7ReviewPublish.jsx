import { CheckCircle, XCircle, AlertTriangle, Rocket, Save, Loader2 } from 'lucide-react'

const PROGRESS_LABELS_CREATE = {
  roadmap:            'Creating roadmap…',
  modules:            'Creating modules…',
  tasks:              'Creating tasks…',
  resources:          'Attaching task resources…',
  projects:           'Creating projects…',
  'project-resources': 'Attaching project resources…',
  publishing:         'Publishing roadmap…',
  done:               'Published!',
}

const PROGRESS_LABELS_EDIT = {
  roadmap:            'Updating roadmap info…',
  modules:            'Updating modules…',
  tasks:              'Updating tasks…',
  resources:          'Updating resources…',
  projects:           'Updating projects…',
  'project-resources': 'Updating project resources…',
  done:               'Saved!',
}

/**
 * Step7ReviewPublish
 * Props:
 *   info             object   roadmapInfo
 *   modules          array
 *   projects         array
 *   onPublish        () => void
 *   isSubmitting     boolean
 *   publishProgress  string | null
 *   publishError     string | null
 *   editMode         boolean   — relaxed validation + "Save Changes" label
 */
export default function Step7ReviewPublish({
  info,
  modules,
  projects,
  onPublish,
  isSubmitting,
  publishProgress,
  publishError,
  editMode = false,
}) {
  const PROGRESS_LABELS = editMode ? PROGRESS_LABELS_EDIT : PROGRESS_LABELS_CREATE
  const validation = validate(modules, projects, editMode)
  const canPublish = validation.errors.length === 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          {editMode ? 'Review & Save' : 'Review & Publish'}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {editMode
            ? 'Review your changes and save the roadmap.'
            : 'Review your roadmap structure, fix any issues, then publish.'
          }
        </p>
      </div>

      {/* Validation panel */}
      <ValidationPanel errors={validation.errors} warnings={validation.warnings} />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Modules" value={modules.length} ok={modules.length >= 5} />
        <SummaryCard
          label="Total Tasks"
          value={modules.reduce((s, m) => s + m.tasks.length, 0)}
          ok={modules.every((m) => m.tasks.length >= 1)}
        />
        <SummaryCard
          label="Total Resources"
          value={modules.reduce((s, m) => s + m.tasks.reduce((s2, t) => s2 + t.resources.length, 0), 0)}
          ok={modules.every((m) => m.tasks.every((t) => t.resources.length >= 1))}
        />
        <SummaryCard label="Projects" value={projects.length} ok={projects.length >= 1} />
      </div>

      {/* Roadmap preview */}
      <div className="dash-card p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Roadmap Overview</h3>
        <p className="font-bold text-gray-900">{info.title || '(No title)'}</p>
        <p className="text-sm text-gray-500">{info.shortDescription}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="dash-badge dash-badge-blue">{info.level}</span>
          <span className="dash-badge dash-badge-gray">{info.domain}</span>
          {info.isPaid
            ? <span className="dash-badge dash-badge-amber">Paid · ${info.price}</span>
            : <span className="dash-badge dash-badge-green">Free</span>
          }
        </div>
      </div>

      {/* Module tree */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Structure Preview</h3>
        {modules.map((mod, mIdx) => (
          <div key={mod._localId} className="dash-card p-3 space-y-1">
            <p className="text-sm font-semibold text-gray-800">
              📦 Module {mIdx + 1}: {mod.title || 'Untitled'}
            </p>
            {mod.tasks.map((task, tIdx) => (
              <div key={task._localId} className="pl-4 space-y-0.5">
                <p className="text-xs text-gray-600">
                  ↳ Task {tIdx + 1}: {task.title || 'Untitled'} · <span className="text-gray-400">{task.taskType}</span>
                </p>
                <p className="pl-4 text-xs text-gray-400">
                  {task.resources.length} resource{task.resources.length !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Projects</h3>
        {projects.map((proj, idx) => (
          <div key={proj._localId} className="dash-card p-3 flex items-center gap-3">
            <span className="text-lg">🏗️</span>
            <div>
              <p className="text-sm font-medium text-gray-800">{proj.title || `Project ${idx + 1}`}</p>
              <p className="text-xs text-gray-400">
                {proj.difficulty} · {proj.resources.length} resource{proj.resources.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Publish error */}
      {publishError && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <XCircle size={16} className="shrink-0 mt-0.5" />
          <span>{publishError}</span>
        </div>
      )}

      {/* Publish progress */}
      {isSubmitting && publishProgress && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <Loader2 size={16} className="animate-spin shrink-0" />
          <span>{PROGRESS_LABELS[publishProgress] || publishProgress}</span>
        </div>
      )}

      {/* Submit button */}
      <button
        type="button"
        onClick={onPublish}
        disabled={!canPublish || isSubmitting}
        className={[
          'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all',
          canPublish && !isSubmitting
            ? 'dash-btn-primary hover:opacity-90'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed',
        ].join(' ')}
      >
        {isSubmitting ? (
          <><Loader2 size={16} className="animate-spin" /> {editMode ? 'Saving…' : 'Publishing…'}</>
        ) : editMode ? (
          <><Save size={16} /> Save Changes</>
        ) : (
          <><Rocket size={16} /> Publish Roadmap</>
        )}
      </button>

      {!canPublish && (
        <p className="text-xs text-center text-gray-400">
          Fix the errors above before {editMode ? 'saving' : 'publishing'}.
        </p>
      )}
    </div>
  )
}

/* ─── Helpers ────────────────────────────────────────────────────── */

function validate(modules, projects, editMode = false) {
  const errors = []
  const warnings = []

  if (!editMode && modules.length < 5) {
    errors.push(`At least 5 modules required (currently ${modules.length})`)
  } else if (editMode && modules.length < 1) {
    errors.push('At least 1 module required')
  }

  modules.forEach((mod, mIdx) => {
    if (!mod.title.trim()) errors.push(`Module ${mIdx + 1} has no title`)
    if (mod.tasks.length === 0) {
      errors.push(`Module ${mIdx + 1} (${mod.title || 'Untitled'}) has no tasks`)
    }
    mod.tasks.forEach((task, tIdx) => {
      if (!task.title.trim()) errors.push(`Task ${tIdx + 1} in Module ${mIdx + 1} has no title`)
      if (task.resources.length === 0) {
        errors.push(`Task "${task.title || `${tIdx + 1}`}" in Module ${mIdx + 1} has no resources`)
      }
    })
  })

  if (projects.length === 0) {
    errors.push('At least 1 project required')
  }

  projects.forEach((proj, idx) => {
    if (!proj.title.trim()) errors.push(`Project ${idx + 1} has no title`)
    if (!proj.problemStatement.trim()) errors.push(`Project ${idx + 1} has no problem statement`)
    if (proj.constraints.length === 0) warnings.push(`Project ${idx + 1} has no constraints`)
  })

  return { errors, warnings }
}

function ValidationPanel({ errors, warnings }) {
  if (errors.length === 0 && warnings.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
        <CheckCircle size={16} />
        <span>All checks passed. You're ready to publish!</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {errors.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-1">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-red-700">
            <XCircle size={15} /> {errors.length} error{errors.length > 1 ? 's' : ''} must be fixed
          </div>
          <ul className="pl-5 space-y-0.5">
            {errors.map((e, i) => (
              <li key={i} className="text-xs text-red-600 list-disc">{e}</li>
            ))}
          </ul>
        </div>
      )}
      {warnings.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-700">
            <AlertTriangle size={15} /> {warnings.length} warning{warnings.length > 1 ? 's' : ''}
          </div>
          <ul className="pl-5 space-y-0.5">
            {warnings.map((w, i) => (
              <li key={i} className="text-xs text-amber-600 list-disc">{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ label, value, ok }) {
  return (
    <div className={`dash-card p-3 text-center ${ok ? 'border-emerald-200' : 'border-red-200'}`}>
      <p className={`text-2xl font-bold ${ok ? 'text-emerald-600' : 'text-red-500'}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}
