import { Check } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Roadmap Info' },
  { id: 2, label: 'Modules' },
  { id: 3, label: 'Tasks' },
  { id: 4, label: 'Resources' },
  { id: 5, label: 'Projects' },
  { id: 6, label: 'Project Resources' },
  { id: 7, label: 'Review & Publish' },
]

/**
 * RoadmapStepper
 * Props:
 *   currentStep  number (1-7)
 *   onGoTo       (step: number) => void  — only allow going back
 */
export default function RoadmapStepper({ currentStep, onGoTo }) {
  return (
    <nav aria-label="Progress" className="w-full">
      {/* Mobile: compact pill */}
      <div className="sm:hidden flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-[#E9340D]">
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="text-sm text-gray-500">— {STEPS[currentStep - 1].label}</span>
      </div>

      {/* Desktop: full stepper */}
      <ol className="hidden sm:flex items-center w-full">
        {STEPS.map((step, idx) => {
          const done = step.id < currentStep
          const active = step.id === currentStep
          const isLast = idx === STEPS.length - 1

          return (
            <li key={step.id} className={`flex items-center ${isLast ? 'flex-none' : 'flex-1'}`}>
              {/* Circle */}
              <button
                type="button"
                onClick={() => done && onGoTo(step.id)}
                disabled={!done}
                className={[
                  'flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 transition-all',
                  done
                    ? 'bg-[#E9340D] text-white cursor-pointer hover:opacity-80'
                    : active
                    ? 'bg-[#E9340D] text-white ring-4 ring-[#E9340D]/20 cursor-default'
                    : 'bg-gray-100 text-gray-400 cursor-default',
                ].join(' ')}
                title={step.label}
              >
                {done ? <Check size={14} /> : step.id}
              </button>

              {/* Label (only for active) */}
              {active && (
                <span className="ml-2 text-xs font-semibold text-[#E9340D] whitespace-nowrap">
                  {step.label}
                </span>
              )}

              {/* Connector line */}
              {!isLast && (
                <div
                  className={[
                    'flex-1 h-0.5 mx-2',
                    done ? 'bg-[#E9340D]' : 'bg-gray-200',
                  ].join(' ')}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
