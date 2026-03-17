import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Map, CheckSquare, Users, Clock, TrendingUp, Activity } from 'lucide-react'
import analyticsService from '../../services/analyticsService'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div variants={item} className="dash-card dash-card-hover p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-dash-text">{value ?? '–'}</p>
        <p className="text-[12px] text-dash-muted mt-0.5">{label}</p>
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

export default function LearnerAnalyticsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics', 'learner'],
    queryFn: analyticsService.getLearner,
    staleTime: 90_000,
  })

  const analytics = data?.data ?? data ?? {}

  const STATS = [
    { icon: Map,         label: 'Roadmaps Followed',  value: analytics.totalRoadmapsFollowed, color: 'bg-blue-50 text-blue-600'     },
    { icon: CheckSquare, label: 'Tasks Completed',     value: analytics.totalTasksCompleted,   color: 'bg-green-50 text-green-600'   },
    { icon: Users,       label: 'Communities Joined',  value: analytics.communitiesJoined,     color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-bold text-dash-text flex items-center gap-2">
          <TrendingUp size={20} className="text-dash-primary" />
          My Analytics
        </h2>
        <p className="text-[13px] text-dash-muted mt-0.5">Your learning progress and activity overview.</p>
      </motion.div>

      {isError && (
        <div className="dash-card p-6 text-center text-dash-muted text-[14px]">
          Failed to load analytics data.
        </div>
      )}

      {/* Stat Cards */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {isLoading
          ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
          : STATS.map((s) => <StatCard key={s.label} {...s} />)
        }
      </motion.div>

      {/* Recent Activity */}
      {!isLoading && (
        <div className="dash-card p-5">
          <h3 className="font-semibold text-[15px] text-dash-text flex items-center gap-2 mb-4">
            <Activity size={16} className="text-dash-primary" />
            Recent Activity
          </h3>
          {analytics.recentActivity?.length > 0 ? (
            <div className="space-y-1">
              {analytics.recentActivity.map((act, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-dash-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock size={14} className="text-dash-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-dash-text">
                      {act.description ?? act.type ?? 'Activity'}
                    </p>
                    {act.createdAt && (
                      <p className="text-[11px] text-dash-muted mt-0.5">
                        {new Date(act.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 gap-3 text-center">
              <Clock className="text-gray-300" size={32} />
              <p className="text-[13px] text-dash-muted">No recent activity.</p>
              <p className="text-[12px] text-dash-muted">Complete tasks and join communities to see your activity here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
