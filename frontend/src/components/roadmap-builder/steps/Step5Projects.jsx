import { Plus } from 'lucide-react'
import CollapsibleCard from '../ui/CollapsibleCard'
import ArrayInput from '../ui/ArrayInput'

const DIFFICULTIES = ['easy', 'medium', 'hard']

/**
 * Step5Projects
 * Props:
 *   projects    array
 *   onAdd       () => void
 *   onUpdate    (projectId, field, value) => void
 *   onRemove    (projectId) => void
 */
export default function Step5Projects({ projects, onAdd, onUpdate, onRemove }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Capstone Projects</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-world projects that cement the learner's knowledge. Add at least 1 project.
          </p>
        </div>
        <span className={`dash-badge shrink-0 ${projects.length >= 1 ? 'dash-badge-green' : 'dash-badge-amber'}`}>
          {projects.length} project{projects.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {projects.map((proj, idx) => (
          <CollapsibleCard
            key={proj._localId}
            title={proj.title || `Project ${idx + 1}`}
            badge={proj.difficulty || '—'}
            onRemove={() => onRemove(proj._localId)}
            defaultOpen={idx === projects.length - 1}
            accent="#10b981"
          >
            <ProjectFields
              project={proj}
              onChange={(field, val) => onUpdate(proj._localId, field, val)}
            />
          </CollapsibleCard>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
      >
        <Plus size={16} /> Add Project
      </button>
    </div>
  )
}

function ProjectFields({ project, onChange }) {
  return (
    <div className="space-y-4 pt-2">
      {/* Title */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Project Title <span className="text-red-400">*</span></label>
        <input
          type="text"
          value={project.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="e.g. Build a Full-Stack E-Commerce App"
          className="dash-input w-full px-3 py-2 text-sm"
        />
      </div>

      {/* Problem statement */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Problem Statement <span className="text-red-400">*</span></label>
        <textarea
          value={project.problemStatement}
          onChange={(e) => onChange('problemStatement', e.target.value)}
          rows={3}
          placeholder="Describe the real-world problem this project solves"
          className="dash-input w-full px-3 py-2 text-sm resize-none"
        />
      </div>

      {/* Difficulty */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Difficulty <span className="text-red-400">*</span></label>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onChange('difficulty', d)}
              className={[
                'px-4 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                project.difficulty === d
                  ? d === 'easy'
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : d === 'medium'
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400',
              ].join(' ')}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Constraints */}
      <ArrayInput
        label={<span>Constraints <span className="text-red-400">*</span></span>}
        items={project.constraints}
        onChange={(arr) => onChange('constraints', arr)}
        placeholder="e.g. No UI libraries allowed"
        minItems={1}
      />

      {/* Expected outcome */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">Expected Outcome</label>
        <textarea
          value={project.expectedOutcome}
          onChange={(e) => onChange('expectedOutcome', e.target.value)}
          rows={2}
          placeholder="What does a successful completion look like?"
          className="dash-input w-full px-3 py-2 text-sm resize-none"
        />
      </div>

      {/* Extension ideas */}
      <ArrayInput
        label="Extension Ideas (Stretch Goals)"
        items={project.extensionIdeas}
        onChange={(arr) => onChange('extensionIdeas', arr)}
        placeholder="e.g. Add real-time order tracking"
      />
    </div>
  )
}
