import { useState } from 'react'
import { Plus, X } from 'lucide-react'

/**
 * ArrayInput — add/remove string items dynamically.
 * Props:
 *   label        string
 *   items        string[]
 *   onChange     (items: string[]) => void
 *   placeholder  string
 *   minItems     number  (default 0)
 */
export default function ArrayInput({ label, items = [], onChange, placeholder = 'Add item…', minItems = 0 }) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    onChange([...items, trimmed])
    setDraft('')
  }

  const remove = (idx) => onChange(items.filter((_, i) => i !== idx))

  const handleKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); add() }
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <ul className="space-y-1">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800">
            <span className="flex-1">{item}</span>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="dash-input flex-1 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 hover:border-[#E9340D] hover:text-[#E9340D] transition-colors"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {minItems > 0 && items.length < minItems && (
        <p className="text-xs text-amber-600">Minimum {minItems} item{minItems > 1 ? 's' : ''} required</p>
      )}
    </div>
  )
}
