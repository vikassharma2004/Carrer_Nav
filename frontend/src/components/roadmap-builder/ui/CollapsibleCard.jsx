import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

/**
 * CollapsibleCard — expandable container for modules / tasks.
 * Props:
 *   title       string
 *   badge       string | number  (optional right badge)
 *   defaultOpen boolean
 *   onRemove    () => void  (optional)
 *   removeLabel string
 *   children    ReactNode
 *   accent      string  css color (left border accent)
 */
export default function CollapsibleCard({
  title,
  badge,
  defaultOpen = true,
  onRemove,
  removeLabel = 'Remove',
  children,
  accent = '#E9340D',
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className="dash-card overflow-hidden"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 cursor-pointer select-none" onClick={() => setOpen((v) => !v)}>
        <span className="text-gray-400">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
        <span className="flex-1 font-medium text-sm text-gray-800 truncate">{title || <span className="text-gray-400 italic">Untitled</span>}</span>
        {badge !== undefined && (
          <span className="dash-badge dash-badge-gray">{badge}</span>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove() }}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-2"
          >
            {removeLabel}
          </button>
        )}
      </div>

      {/* Body */}
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  )
}
