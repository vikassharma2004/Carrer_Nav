import { Plus } from 'lucide-react'
import CollapsibleCard from '../ui/CollapsibleCard'

/**
 * Step2Modules
 * Props:
 *   modules        array
 *   onAdd          () => void
 *   onUpdate       (moduleId, field, value) => void
 *   onRemove       (moduleId) => void
 */
export default function Step2Modules({ modules, onAdd, onUpdate, onRemove }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Modules</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Modules are the top-level sections of your roadmap. Add at least 5 modules.
          </p>
        </div>
        <span className={`dash-badge shrink-0 ${modules.length >= 5 ? 'dash-badge-green' : 'dash-badge-amber'}`}>
          {modules.length}/5 min
        </span>
      </div>

      <div className="space-y-3">
        {modules.map((mod, idx) => (
          <CollapsibleCard
            key={mod._localId}
            title={mod.title || `Module ${idx + 1}`}
            badge={`#${idx + 1}`}
            onRemove={() => onRemove(mod._localId)}
            defaultOpen={idx === modules.length - 1}
          >
            <div className="space-y-4 pt-2">
              {/* Title */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Module Title <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={mod.title}
                  onChange={(e) => onUpdate(mod._localId, 'title', e.target.value)}
                  placeholder="e.g. HTML & CSS Fundamentals"
                  className="dash-input w-full px-3 py-2 text-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Description</label>
                <textarea
                  value={mod.description}
                  onChange={(e) => onUpdate(mod._localId, 'description', e.target.value)}
                  rows={2}
                  placeholder="What will learners achieve in this module?"
                  className="dash-input w-full px-3 py-2 text-sm resize-none"
                />
              </div>

              {/* Order indicator */}
              <p className="text-xs text-gray-400">Order: {idx + 1} (auto-managed)</p>
            </div>
          </CollapsibleCard>
        ))}
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-[#E9340D] hover:text-[#E9340D] transition-colors"
      >
        <Plus size={16} /> Add Module
      </button>
    </div>
  )
}
