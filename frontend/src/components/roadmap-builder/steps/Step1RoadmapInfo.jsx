import ArrayInput from '../ui/ArrayInput'

const LEVELS = ['beginner', 'intermediate', 'advanced']
const DOMAINS = [
  'frontend', 'backend', 'fullstack', 'mobile',
  'devops', 'system-design', 'data', 'ai-ml', 'security',
]

/**
 * Step1RoadmapInfo
 * Props:
 *   info      object  (roadmapInfo state)
 *   onChange  (field, value) => void
 */
export default function Step1RoadmapInfo({ info, onChange }) {
  const field = (name) => ({
    value: info[name] ?? '',
    onChange: (e) => onChange(name, e.target.value),
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Roadmap Info</h2>
        <p className="text-sm text-gray-500 mt-0.5">Basic details that learners will see before enrolling.</p>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
        <input
          type="text"
          {...field('title')}
          placeholder="e.g. Complete Frontend Development Roadmap"
          maxLength={150}
          className="dash-input w-full px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-400">{(info.title || '').length}/150 · min 5 chars</p>
      </div>

      {/* Short description */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Short Description <span className="text-red-500">*</span></label>
        <textarea
          {...field('shortDescription')}
          rows={2}
          placeholder="A crisp one-liner shown in cards (20–300 chars)"
          maxLength={300}
          className="dash-input w-full px-3 py-2 text-sm resize-none"
        />
        <p className="text-xs text-gray-400">{(info.shortDescription || '').length}/300 · min 20 chars</p>
      </div>

      {/* Detailed description */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
        <textarea
          {...field('detailedDescription')}
          rows={4}
          placeholder="Full curriculum overview (50–5000 chars)"
          maxLength={5000}
          className="dash-input w-full px-3 py-2 text-sm resize-none"
        />
      </div>

      {/* Learning outcomes */}
      <ArrayInput
        label={<span>Learning Outcomes <span className="text-red-500">*</span> <span className="font-normal text-gray-400">(min 3)</span></span>}
        items={info.learningOutcomes || []}
        onChange={(arr) => onChange('learningOutcomes', arr)}
        placeholder="e.g. Build production-ready React apps"
        minItems={3}
      />

      {/* Cover image URL */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Cover Image URL <span className="text-red-500">*</span></label>
        <input
          type="url"
          {...field('coverImage')}
          placeholder="https://res.cloudinary.com/…"
          className="dash-input w-full px-3 py-2 text-sm"
        />
        {info.coverImage && (
          <img
            src={info.coverImage}
            alt="cover preview"
            className="mt-2 h-28 w-full object-cover rounded-lg border border-gray-200"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        )}
      </div>

      {/* Level + Domain */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Level <span className="text-red-500">*</span></label>
          <select
            value={info.level || ''}
            onChange={(e) => onChange('level', e.target.value)}
            className="dash-input w-full px-3 py-2 text-sm"
          >
            <option value="">Select level</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Domain <span className="text-red-500">*</span></label>
          <select
            value={info.domain || ''}
            onChange={(e) => onChange('domain', e.target.value)}
            className="dash-input w-full px-3 py-2 text-sm"
          >
            <option value="">Select domain</option>
            {DOMAINS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing toggle */}
      <div className="dash-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">Paid Roadmap</p>
            <p className="text-xs text-gray-500">Toggle if learners must pay to enrol</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('isPaid', !info.isPaid)}
            className={[
              'relative w-10 h-6 rounded-full transition-colors',
              info.isPaid ? 'bg-[#E9340D]' : 'bg-gray-200',
            ].join(' ')}
          >
            <span
              className={[
                'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
                info.isPaid ? 'translate-x-5' : 'translate-x-1',
              ].join(' ')}
            />
          </button>
        </div>

        {info.isPaid && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Price (USD) <span className="text-red-500">*</span></label>
            <input
              type="number"
              min={1}
              value={info.price ?? ''}
              onChange={(e) => onChange('price', Number(e.target.value))}
              placeholder="e.g. 49"
              className="dash-input w-40 px-3 py-2 text-sm"
            />
          </div>
        )}
      </div>
    </div>
  )
}
