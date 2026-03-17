import { Plus } from 'lucide-react'
import CollapsibleCard from '../ui/CollapsibleCard'

const RESOURCE_TYPES = ['youtube', 'documentation', 'github', 'pdf', 'article']
const WHEN_OPTIONS = ['before-task', 'after-task', 'reference']

/**
 * Step4Resources
 * Props:
 *   modules              array (with tasks → resources)
 *   onAddResource        (moduleId, taskId) => void
 *   onUpdateResource     (moduleId, taskId, resourceId, field, val) => void
 *   onRemoveResource     (moduleId, taskId, resourceId) => void
 */
export default function Step4Resources({ modules, onAddResource, onUpdateResource, onRemoveResource }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Task Resources</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Add at least one learning resource per task (articles, videos, docs, GitHub repos, PDFs).
        </p>
      </div>

      {modules.length === 0 && (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
          No modules found. Go back and add modules + tasks first.
        </p>
      )}

      <div className="space-y-6">
        {modules.map((mod, modIdx) => (
          <CollapsibleCard
            key={mod._localId}
            title={`Module ${modIdx + 1}: ${mod.title || 'Untitled'}`}
            defaultOpen={true}
            accent="#6366f1"
          >
            <div className="space-y-3 pt-2">
              {mod.tasks.length === 0 && (
                <p className="text-xs text-gray-400 italic">No tasks in this module.</p>
              )}

              {mod.tasks.map((task, tIdx) => (
                <CollapsibleCard
                  key={task._localId}
                  title={`Task ${tIdx + 1}: ${task.title || 'Untitled'}`}
                  badge={`${task.resources.length} res`}
                  defaultOpen={task.resources.length === 0}
                  accent="#0ea5e9"
                >
                  <div className="space-y-3 pt-2">
                    {task.resources.map((res, rIdx) => (
                      <ResourceFields
                        key={res._localId}
                        resource={res}
                        index={rIdx}
                        onChange={(field, val) => onUpdateResource(mod._localId, task._localId, res._localId, field, val)}
                        onRemove={() => onRemoveResource(mod._localId, task._localId, res._localId)}
                      />
                    ))}

                    <button
                      type="button"
                      onClick={() => onAddResource(mod._localId, task._localId)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-gray-300 text-xs text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
                    >
                      <Plus size={13} /> Add Resource
                    </button>
                  </div>
                </CollapsibleCard>
              ))}
            </div>
          </CollapsibleCard>
        ))}
      </div>
    </div>
  )
}

function ResourceFields({ resource, index, onChange, onRemove }) {
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

      {/* Type + When */}
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

      {/* Title */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600">Title <span className="text-red-400">*</span></label>
        <input
          type="text"
          value={resource.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="e.g. CSS Flexbox Guide — CSS-Tricks"
          className="dash-input w-full px-2 py-1.5 text-xs"
        />
      </div>

      {/* Link */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600">URL <span className="text-red-400">*</span></label>
        <input
          type="url"
          value={resource.link}
          onChange={(e) => onChange('link', e.target.value)}
          placeholder="https://…"
          className="dash-input w-full px-2 py-1.5 text-xs"
        />
      </div>

      {/* Why */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600">Why This Resource <span className="text-red-400">*</span></label>
        <textarea
          value={resource.whyThisResource}
          onChange={(e) => onChange('whyThisResource', e.target.value)}
          rows={2}
          placeholder="Why is this the best resource for this task?"
          className="dash-input w-full px-2 py-1.5 text-xs resize-none"
        />
      </div>
    </div>
  )
}
