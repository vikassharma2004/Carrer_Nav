import { Plus } from 'lucide-react'
import CollapsibleCard from '../ui/CollapsibleCard'
import ArrayInput from '../ui/ArrayInput'

const TASK_TYPES = ['concept', 'implementation', 'debugging', 'decision']

/**
 * Step3Tasks
 * Props:
 *   modules         array  (with nested tasks)
 *   onAddTask       (moduleId) => void
 *   onUpdateTask    (moduleId, taskId, field, value) => void
 *   onRemoveTask    (moduleId, taskId) => void
 */
export default function Step3Tasks({ modules, onAddTask, onUpdateTask, onRemoveTask }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Tasks</h2>
        <p className="text-sm text-gray-500 mt-0.5">Add at least one task per module. Tasks define what the learner must do.</p>
      </div>

      {modules.length === 0 && (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
          No modules yet. Go back to Step 2 and add modules first.
        </p>
      )}

      <div className="space-y-6">
        {modules.map((mod, modIdx) => (
          <CollapsibleCard
            key={mod._localId}
            title={`Module ${modIdx + 1}: ${mod.title || 'Untitled'}`}
            badge={`${mod.tasks.length} task${mod.tasks.length !== 1 ? 's' : ''}`}
            defaultOpen={true}
            accent="#6366f1"
          >
            <div className="space-y-3 pt-2">
              {mod.tasks.map((task, tIdx) => (
                <CollapsibleCard
                  key={task._localId}
                  title={task.title || `Task ${tIdx + 1}`}
                  badge={`#${tIdx + 1}`}
                  onRemove={() => onRemoveTask(mod._localId, task._localId)}
                  defaultOpen={tIdx === mod.tasks.length - 1}
                  accent="#0ea5e9"
                >
                  <TaskFields
                    task={task}
                    onChange={(field, val) => onUpdateTask(mod._localId, task._localId, field, val)}
                    order={tIdx + 1}
                  />
                </CollapsibleCard>
              ))}

              <button
                type="button"
                onClick={() => onAddTask(mod._localId)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
              >
                <Plus size={14} /> Add Task to {mod.title || `Module ${modIdx + 1}`}
              </button>
            </div>
          </CollapsibleCard>
        ))}
      </div>
    </div>
  )
}

function TaskFields({ task, onChange, order }) {
  return (
    <div className="space-y-4 pt-2">
      {/* Title */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Task Title <span className="text-red-400">*</span></label>
        <input
          type="text"
          value={task.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="e.g. Build a responsive navbar"
          className="dash-input w-full px-3 py-2 text-sm"
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Description</label>
        <textarea
          value={task.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={2}
          placeholder="What specifically should the learner build or explore?"
          className="dash-input w-full px-3 py-2 text-sm resize-none"
        />
      </div>

      {/* Task type */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Task Type <span className="text-red-400">*</span></label>
        <div className="flex flex-wrap gap-2">
          {TASK_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange('taskType', t)}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                task.taskType === t
                  ? 'bg-[#E9340D] text-white border-[#E9340D]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400',
              ].join(' ')}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Expected thinking */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Expected Thinking</label>
        <textarea
          value={task.expectedThinking}
          onChange={(e) => onChange('expectedThinking', e.target.value)}
          rows={2}
          placeholder="What mental model or reasoning should the learner develop?"
          className="dash-input w-full px-3 py-2 text-sm resize-none"
        />
      </div>

      {/* Success criteria */}
      <ArrayInput
        label="Success Criteria"
        items={task.successCriteria}
        onChange={(arr) => onChange('successCriteria', arr)}
        placeholder="e.g. Navbar is responsive on mobile"
      />

      <p className="text-xs text-gray-400">Order: {order} (auto-managed)</p>
    </div>
  )
}
