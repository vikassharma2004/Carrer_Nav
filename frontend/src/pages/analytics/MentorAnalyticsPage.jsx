import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Map, Users, TrendingUp, DollarSign, CheckCircle, BarChart3 } from 'lucide-react'
import analyticsService from '../../services/analyticsService'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <motion.div variants={item} className="dash-card dash-card-hover p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-dash-text">{value ?? '–'}</p>
        <p className="text-[12px] text-dash-muted mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-dash-primary font-medium mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  )
}

function SkeletonCard() {
  return (
    <div className="dash-card p-5 flex items-center gap-4">
      <div className="shimmer w-11 h-11 rounded-xl shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="shimmer h-6 w-16 rounded" />
        <div className="shimmer h-3 w-28 rounded" />
      </div>
    </div>
  )
}

function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  )
}

export default function MentorAnalyticsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics', 'mentor'],
    queryFn: analyticsService.getMentor,
    staleTime: 90_000,
  })

  const analytics = data?.data ?? data ?? {}
  const total       = analytics.totalRoadmaps ?? 0
  const published   = analytics.publishedRoadmaps ?? 0
  const unpublished = analytics.unpublishedRoadmaps ?? (total - published)

  const STATS = [
    { icon: Users,       label: 'Total Learners',     value: analytics.totalLearners,  color: 'bg-purple-50 text-purple-600' },
    { icon: Map,         label: 'Total Roadmaps',     value: total,                    color: 'bg-blue-50 text-blue-600'     },
    { icon: CheckCircle, label: 'Published',          value: published,                color: 'bg-green-50 text-green-600', sub: `${unpublished} drafts` },
    {
      icon: DollarSign,
      label: 'Unpaid Commission',
      value: analytics.unpaidCommission != null ? `$${analytics.unpaidCommission}` : '–',
      color: 'bg-amber-50 text-amber-600',
      sub: 'Awaiting payout',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-bold text-dash-text flex items-center gap-2">
          <TrendingUp size={20} className="text-dash-primary" />
          Mentor Analytics
        </h2>
        <p className="text-[13px] text-dash-muted mt-0.5">
          Overview of your roadmaps, learners, and earnings.
        </p>
      </motion.div>

      {isError && (
        <div className="dash-card p-6 text-center text-dash-muted text-[14px]">
          Failed to load analytics data.
        </div>
      )}

      {/* Stat Cards */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {isLoading
          ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          : STATS.map((s) => <StatCard key={s.label} {...s} />)
        }
      </motion.div>

      {/* Roadmap Status Breakdown */}
      {!isLoading && total > 0 && (
        <div className="dash-card p-5">
          <h3 className="font-semibold text-[15px] text-dash-text flex items-center gap-2 mb-5">
            <BarChart3 size={16} className="text-dash-primary" />
            Roadmap Status Breakdown
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-[13px] mb-2">
                <span className="text-dash-muted flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                  Published
                </span>
                <span className="font-semibold text-dash-text">{published} / {total}</span>
              </div>
              <ProgressBar value={published} max={total} color="bg-green-500" />
            </div>

            <div>
              <div className="flex items-center justify-between text-[13px] mb-2">
                <span className="text-dash-muted flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  Unpublished (Drafts)
                </span>
                <span className="font-semibold text-dash-text">{unpublished} / {total}</span>
              </div>
              <ProgressBar value={unpublished} max={total} color="bg-amber-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-green-600">{total > 0 ? Math.round((published / total) * 100) : 0}%</p>
              <p className="text-[12px] text-green-700 mt-0.5">Publish Rate</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-blue-600">
                {analytics.totalLearners > 0 && total > 0
                  ? (analytics.totalLearners / total).toFixed(1)
                  : '–'}
              </p>
              <p className="text-[12px] text-blue-700 mt-0.5">Avg. Learners / Roadmap</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
