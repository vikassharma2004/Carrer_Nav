import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ChevronDown, ChevronUp, Star, Users, BookOpen,
  SlidersHorizontal, X, Filter, Plus, Edit2, ToggleLeft,
  ToggleRight, Loader2,
} from 'lucide-react'
import roadmapService from '../../services/roadmapService'
import useAuthStore    from '../../store/useAuthStore'

/* ─── Filter options ─────────────────────────────────────────── */
const DOMAINS = [
  { value: '',             label: 'All Domains'   },
  { value: 'frontend',    label: 'Frontend'       },
  { value: 'backend',     label: 'Backend'        },
  { value: 'fullstack',   label: 'Fullstack'      },
  { value: 'mobile',      label: 'Mobile'         },
  { value: 'devops',      label: 'DevOps'         },
  { value: 'system-design', label: 'System Design' },
  { value: 'data',        label: 'Data'           },
  { value: 'ai-ml',       label: 'AI / ML'        },
  { value: 'security',    label: 'Security'       },
]

const LEVELS = [
  { value: '',             label: 'All Levels'   },
  { value: 'beginner',     label: 'Beginner'     },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced',     label: 'Advanced'     },
]

const PRICING = [
  { value: '',      label: 'All'  },
  { value: 'false', label: 'Free' },
  { value: 'true',  label: 'Paid' },
]

const DOMAIN_COLORS = {
  frontend:       'bg-blue-100 text-blue-700',
  backend:        'bg-green-100 text-green-700',
  fullstack:      'bg-purple-100 text-purple-700',
  mobile:         'bg-pink-100 text-pink-700',
  devops:         'bg-amber-100 text-amber-700',
  'system-design': 'bg-indigo-100 text-indigo-700',
  data:           'bg-teal-100 text-teal-700',
  'ai-ml':        'bg-rose-100 text-rose-700',
  security:       'bg-red-100 text-red-700',
}

const LEVEL_BADGE = {
  beginner:     'dash-badge-green',
  intermediate: 'dash-badge-amber',
  advanced:     'dash-badge-red',
}

/* ─── Accordion filter group ──────────────────────────────────── */
function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-dash-border pb-4 mb-4 last:border-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-[13px] font-semibold text-dash-text mb-2"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Learner roadmap card ────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

function LearnerCard({ _id, title, shortDescription, coverImage, level, domain, isPaid, price }) {
  const navigate = useNavigate()
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}
      className="dash-card overflow-hidden flex flex-col"
    >
      <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {coverImage
          ? <img src={coverImage} alt={title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><BookOpen className="text-gray-300" size={36} /></div>
        }
        {level && (
          <span className={`absolute top-2 left-2 dash-badge ${LEVEL_BADGE[level] ?? 'dash-badge-gray'} capitalize`}>
            {level}
          </span>
        )}
        <span className={`absolute top-2 right-2 dash-badge ${isPaid ? 'dash-badge-amber' : 'dash-badge-green'}`}>
          {isPaid ? `₹${price ?? 'Paid'}` : 'Free'}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        {domain && (
          <span className={`dash-badge text-[10px] mb-2 self-start ${DOMAIN_COLORS[domain] ?? 'bg-gray-100 text-gray-600'}`}>
            {domain}
          </span>
        )}
        <h3 className="font-semibold text-[14px] text-dash-text leading-snug line-clamp-2">{title}</h3>
        {shortDescription && (
          <p className="text-[12px] text-dash-muted mt-1 line-clamp-2 leading-relaxed flex-1">
            {shortDescription}
          </p>
        )}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-dash-border">
          <span className="flex items-center gap-1 text-[12px] text-dash-text">
            <Star size={12} className="text-amber-400 fill-amber-400" /> 4.8
          </span>
          <span className="flex items-center gap-1 text-[12px] text-dash-muted">
            <Users size={12} /> 1.2k
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          <button className="flex-1 dash-btn-outline text-[12px] py-1.5">Follow</button>
          <button
            className="flex-1 dash-btn-primary text-[12px] py-1.5"
            onClick={() => navigate(`/roadmaps/${_id}`)}
          >
            View Roadmap
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Mentor roadmap card ─────────────────────────────────────── */
function MentorCard({ roadmap, onTogglePublish, toggling }) {
  const navigate = useNavigate()
  const canEdit  = !roadmap.isPublished

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.09)' }}
      className="dash-card overflow-hidden flex flex-col"
    >
      <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {roadmap.coverImage
          ? <img src={roadmap.coverImage} alt={roadmap.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><BookOpen className="text-gray-300" size={36} /></div>
        }
        {roadmap.level && (
          <span className={`absolute top-2 left-2 dash-badge ${LEVEL_BADGE[roadmap.level] ?? 'dash-badge-gray'} capitalize`}>
            {roadmap.level}
          </span>
        )}
        <span className={`absolute top-2 right-2 dash-badge ${roadmap.isPublished ? 'dash-badge-green' : 'dash-badge-gray'}`}>
          {roadmap.isPublished ? 'Published' : 'Draft'}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        {roadmap.domain && (
          <span className={`dash-badge text-[10px] mb-2 self-start ${DOMAIN_COLORS[roadmap.domain] ?? 'bg-gray-100 text-gray-600'}`}>
            {roadmap.domain}
          </span>
        )}
        <h3 className="font-semibold text-[14px] text-dash-text leading-snug line-clamp-2">
          {roadmap.title}
        </h3>
        {roadmap.shortDescription && (
          <p className="text-[12px] text-dash-muted mt-1 line-clamp-2 leading-relaxed flex-1">
            {roadmap.shortDescription}
          </p>
        )}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-dash-border">
          <span className="flex items-center gap-1 text-[12px] text-dash-muted">
            <Users size={12} /> {roadmap.enrollmentCount ?? 0} learners
          </span>
          <span className="flex items-center gap-1 text-[12px] text-dash-muted ml-auto">
            {roadmap.modules?.length ?? 0} modules
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => navigate(`/roadmaps/${roadmap._id}`)}
            className="flex-1 dash-btn-outline text-[12px] py-1.5"
          >
            View
          </button>
          {canEdit ? (
            <button
              onClick={() => navigate(`/roadmaps/${roadmap._id}/edit`)}
              className="flex-1 dash-btn-primary text-[12px] py-1.5 flex items-center justify-center gap-1"
            >
              <Edit2 size={11} /> Edit
            </button>
          ) : (
            <button
              onClick={() => onTogglePublish(roadmap._id)}
              disabled={toggling === roadmap._id}
              className="flex-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-[12px] py-1.5 hover:bg-green-100 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
            >
              {toggling === roadmap._id
                ? <Loader2 size={11} className="animate-spin" />
                : <ToggleRight size={11} />
              }
              Unpublish
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Skeleton ─────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="dash-card overflow-hidden">
      <div className="shimmer h-40" />
      <div className="p-4 space-y-2">
        <div className="shimmer h-3 w-1/3 rounded" />
        <div className="shimmer h-4 w-3/4 rounded" />
        <div className="shimmer h-3 w-full rounded" />
        <div className="shimmer h-3 w-2/3 rounded" />
      </div>
    </div>
  )
}

/* ─── Main page ─────────────────────────────────────────────────── */
export default function RoadmapsPage() {
  const { user }   = useAuthStore()
  const navigate   = useNavigate()
  const isMentor   = user?.role === 'mentor'

  /* state */
  const [roadmaps, setRoadmaps]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [pagination, setPagination]     = useState({})
  const [page, setPage]                 = useState(1)
  const [mobileFilter, setMobileFilter] = useState(false)
  const [toggling, setToggling]         = useState(null)

  /* learner filters only (mentor sees all own) */
  const [search, setSearch] = useState('')
  const [domain, setDomain] = useState('')
  const [level,  setLevel]  = useState('')
  const [isPaid, setIsPaid] = useState('')

  /* ── fetch ──────────────────────────────────────────────────── */
  const fetchRoadmaps = useCallback(() => {
    setLoading(true)
    if (isMentor) {
      roadmapService
        .getMyroadmap()
        .then((res) => {
          setRoadmaps(res.data ?? [])
          setPagination({})
        })
        .catch(() => setRoadmaps([]))
        .finally(() => setLoading(false))
    } else {
      const params = { page, limit: 12 }
      if (search) params.title  = search
      if (domain) params.domain = domain
      if (level)  params.level  = level
      if (isPaid !== '') params.isPaid = isPaid

      roadmapService
        .getPublished(params)
        .then((res) => {
          setRoadmaps(res.data ?? [])
          setPagination(res.pagination ?? {})
        })
        .catch(() => setRoadmaps([]))
        .finally(() => setLoading(false))
    }
  }, [isMentor, page, search, domain, level, isPaid])

  useEffect(() => {
    const id = setTimeout(fetchRoadmaps, isMentor ? 0 : 300)
    return () => clearTimeout(id)
  }, [fetchRoadmaps, isMentor])

  /* ── mentor publish toggle ──────────────────────────────────── */
  const handleTogglePublish = async (id) => {
    setToggling(id)
    try {
      await roadmapService.togglePublish(id)
      setRoadmaps((prev) =>
        prev.map((r) => r._id === id ? { ...r, isPublished: !r.isPublished } : r)
      )
    } catch (_) {}
    setToggling(null)
  }

  /* ── filters (learner only) ─────────────────────────────────── */
  const clearFilters = () => { setSearch(''); setDomain(''); setLevel(''); setIsPaid(''); setPage(1) }
  const hasFilters   = search || domain || level || isPaid !== ''

  const FilterPanel = () => (
    <div className="space-y-0">
      <FilterGroup title="Search">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-muted" size={13} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search roadmaps…"
            className="dash-input w-full pl-8 pr-3 py-2 text-[13px]"
          />
        </div>
      </FilterGroup>
      <FilterGroup title="Domain">
        <div className="space-y-1 mt-1">
          {DOMAINS.map((d) => (
            <label key={d.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio" name="domain" value={d.value}
                checked={domain === d.value}
                onChange={() => { setDomain(d.value); setPage(1) }}
                className="accent-dash-primary"
              />
              <span className="text-[13px] text-dash-muted group-hover:text-dash-text transition-colors">
                {d.label}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Difficulty">
        <div className="space-y-1 mt-1">
          {LEVELS.map((l) => (
            <label key={l.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio" name="level" value={l.value}
                checked={level === l.value}
                onChange={() => { setLevel(l.value); setPage(1) }}
                className="accent-dash-primary"
              />
              <span className="text-[13px] text-dash-muted group-hover:text-dash-text transition-colors">
                {l.label}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Pricing">
        <div className="space-y-1 mt-1">
          {PRICING.map((p) => (
            <label key={p.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio" name="pricing" value={p.value}
                checked={isPaid === p.value}
                onChange={() => { setIsPaid(p.value); setPage(1) }}
                className="accent-dash-primary"
              />
              <span className="text-[13px] text-dash-muted group-hover:text-dash-text transition-colors">
                {p.label}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full text-[12px] text-dash-primary font-medium hover:underline flex items-center gap-1 justify-center pt-2"
        >
          <X size={12} /> Clear all filters
        </button>
      )}
    </div>
  )

  /* ── published / draft split for mentor header ──────────────── */
  const publishedCount   = isMentor ? roadmaps.filter((r) => r.isPublished).length  : null
  const unpublishedCount = isMentor ? roadmaps.filter((r) => !r.isPublished).length : null

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-dash-text">
            {isMentor ? 'My Roadmaps' : 'Explore Roadmaps'}
          </h2>
          <p className="text-[13px] text-dash-muted mt-0.5">
            {isMentor
              ? `${roadmaps.length} roadmap${roadmaps.length !== 1 ? 's' : ''} · ${publishedCount} published · ${unpublishedCount} drafts`
              : pagination.total
                ? `${pagination.total} roadmaps available`
                : 'Discover curated learning paths'
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Create button — mentor only */}
          {isMentor && (
            <button
              onClick={() => navigate('/roadmaps/create')}
              className="dash-btn-primary flex items-center gap-2 px-4 py-2 text-[13px]"
            >
              <Plus size={14} /> Create Roadmap
            </button>
          )}

          {/* Mobile filter toggle — learner only */}
          {!isMentor && (
            <button
              onClick={() => setMobileFilter(!mobileFilter)}
              className="lg:hidden dash-btn-outline flex items-center gap-2 px-3 py-1.5 text-[13px]"
            >
              <Filter size={14} /> Filters
              {hasFilters && <span className="w-2 h-2 rounded-full bg-dash-primary" />}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters — learner desktop only */}
        {!isMentor && (
          <aside className="hidden lg:block w-[240px] shrink-0">
            <div className="dash-card p-4 sticky top-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-[14px] text-dash-text flex items-center gap-2">
                  <SlidersHorizontal size={14} /> Filters
                </span>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-[11px] text-dash-primary font-medium hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>
        )}

        {/* Mobile filter drawer */}
        <AnimatePresence>
          {!isMentor && mobileFilter && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileFilter(false)}
            >
              <motion.aside
                initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 24, stiffness: 200 }}
                className="absolute left-0 top-0 bottom-0 w-72 bg-white p-5 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-[14px] text-dash-text">Filters</span>
                  <button onClick={() => setMobileFilter(false)}>
                    <X size={16} className="text-dash-muted" />
                  </button>
                </div>
                <FilterPanel />
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : roadmaps.length === 0 ? (
            <div className="dash-card p-16 text-center">
              <BookOpen className="mx-auto text-gray-300 mb-3" size={40} />
              <p className="text-dash-text font-medium">
                {isMentor ? 'No roadmaps yet' : 'No roadmaps found'}
              </p>
              <p className="text-[13px] text-dash-muted mt-1">
                {isMentor ? 'Create your first roadmap to start teaching.' : 'Try adjusting your filters'}
              </p>
              {isMentor && (
                <button
                  onClick={() => navigate('/roadmaps/create')}
                  className="mt-4 dash-btn-primary text-[13px] px-5 py-2.5 flex items-center gap-2 mx-auto"
                >
                  <Plus size={14} /> Create Roadmap
                </button>
              )}
              {!isMentor && hasFilters && (
                <button onClick={clearFilters} className="mt-4 dash-btn-primary text-[13px] px-4 py-2">
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <motion.div
                key={`${page}-${domain}-${level}-${isPaid}-${search}`}
                initial="hidden" animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                {isMentor
                  ? roadmaps.map((rm) => (
                      <MentorCard
                        key={rm._id}
                        roadmap={rm}
                        onTogglePublish={handleTogglePublish}
                        toggling={toggling}
                      />
                    ))
                  : roadmaps.map((rm) => <LearnerCard key={rm._id} {...rm} />)
                }
              </motion.div>

              {/* Pagination — learner only */}
              {!isMentor && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    disabled={!pagination.hasPrev}
                    onClick={() => setPage((p) => p - 1)}
                    className="dash-btn-outline px-3 py-1.5 text-[13px] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Prev
                  </button>
                  <span className="text-[13px] text-dash-muted px-2">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={!pagination.hasNext}
                    onClick={() => setPage((p) => p + 1)}
                    className="dash-btn-outline px-3 py-1.5 text-[13px] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
