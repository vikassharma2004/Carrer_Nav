import { Plus } from 'lucide-react'
import CollapsibleCard from '../ui/CollapsibleCard'

const RESOURCE_TYPES = ['github', 'youtube', 'documentation', 'article']
const WHEN_OPTIONS = ['before-project', 'during-project', 'reference']

/**
 * Step6ProjectResources
 * Props:
 *   projects                 array (with nested resources)
 *   onAddProjectResource     (projectId) => void
 *   onUpdateProjectResource  (projectId, resourceId, field, val) => void
 *   onRemoveProjectResource  (projectId, resourceId) => void
 */
export default function Step6ProjectResources({
  projects,
  onAddProjectResource,
  onUpdateProjectResource,
  onRemoveProjectResource,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Project Resources</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Attach reference materials, starter repos, or tutorials to each project. Optional but recommended.
        </p>
      </div>

      {projects.length === 0 && (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
          No projects yet. Go back to Step 5 and add projects first.
        </p>
      )}

      <div className="space-y-4">
        {projects.map((proj, idx) => (
          <CollapsibleCard
            key={proj._localId}
            title={`Project ${idx + 1}: ${proj.title || 'Untitled'}`}
            badge={`${proj.resources.length} res`}
            defaultOpen={true}
            accent="#10b981"
          >
            <div className="space-y-3 pt-2">
              {proj.resources.map((res, rIdx) => (
                <ProjectResourceFields
                  key={res._localId}
                  resource={res}
                  index={rIdx}
                  onChange={(field, val) => onUpdateProjectResource(proj._localId, res._localId, field, val)}
                  onRemove={() => onRemoveProjectResource(proj._localId, res._localId)}
                />
              ))}

              <button
                type="button"
                onClick={() => onAddProjectResource(proj._localId)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
              >
                <Plus size={14} /> Add Resource to Project
              </button>
            </div>
          </CollapsibleCard>
        ))}
      </div>
    </div>
  )
}

function ProjectResourceFields({ resource, index, onChange, onRemove }) {
  return (
    <div className="border border-gray-100 rounded-xl p-3 bg-gray-50 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Resource {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">Type <span className="text-red-400">*</span></label>
          <select
            value={resource.type}
            onChange={(e) => onChange('type', e.target.value)}
            className="dash-input w-full px-2 py-1.5 text-xs"
          >
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">When to Use</label>
          <select
            value={resource.whenToUse}
            onChange={(e) => onChange('whenToUse', e.target.value)}
            className="dash-input w-full px-2 py-1.5 text-xs"
          >
            {WHEN_OPTIONS.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600">Title <span className="text-red-400">*</span></label>
        <input
          type="text"
          value={resource.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="e.g. Project Starter Repo"
          className="dash-input w-full px-2 py-1.5 text-xs"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600">URL <span className="text-red-400">*</span></label>
        <input
          type="url"
          value={resource.link}
          onChange={(e) => onChange('link', e.target.value)}
          placeholder="https://github.com/…"
          className="dash-input w-full px-2 py-1.5 text-xs"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600">Why This Resource <span className="text-red-400">*</span></label>
        <textarea
          value={resource.whyThisResource}
          onChange={(e) => onChange('whyThisResource', e.target.value)}
          rows={2}
          placeholder="Why will this help the learner complete the project?"
          className="dash-input w-full px-2 py-1.5 text-xs resize-none"
        />
      </div>
    </div>
  )
}
