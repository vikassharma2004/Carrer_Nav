import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserCheck, Search, RefreshCw, CheckCircle, XCircle,
  ChevronDown, ChevronUp, Clock, Mail, Briefcase, AlertCircle,
} from 'lucide-react'
import adminService from '../../services/adminService'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item      = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } }

const STATUS_BADGE = {
  pending:  { cls: 'dash-badge-amber', label: 'Pending'  },
  approved: { cls: 'dash-badge-green', label: 'Approved' },
  rejected: { cls: 'dash-badge-red',   label: 'Rejected' },
}

/* ── Details drawer ───────────────────────────────────────────── */
function DetailsDrawer({ app, onClose, onApprove, onReject, processing }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-md bg-white h-full overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-dash-border">
          <h3 className="font-bold text-[16px] text-dash-text">Application Details</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-dash-muted">
            <XCircle size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 space-y-5">
          {/* Applicant */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-dash-primary text-white flex items-center justify-center text-xl font-bold">
              {app.userId?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="font-bold text-[16px] text-dash-text">{app.userId?.name ?? 'Unknown'}</p>
              <p className="text-[13px] text-dash-muted flex items-center gap-1">
                <Mail size={12} /> {app.userId?.email ?? '—'}
              </p>
              <span className={`dash-badge mt-1 ${STATUS_BADGE[app.status ?? 'pending']?.cls}`}>
                {STATUS_BADGE[app.status ?? 'pending']?.label}
              </span>
            </div>
          </div>

          {/* Fields */}
          {[
            { label: 'Experience',       value: app.experience ?? app.yearsOfExperience ?? '—' },
            { label: 'Expertise / Bio',  value: app.bio ?? app.expertise ?? '—' },
            { label: 'Requested Role',   value: app.requestedRole ?? 'Mentor' },
            { label: 'Submitted',        value: app.createdAt ? new Date(app.createdAt).toLocaleString() : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4">
              <p className="text-[11px] font-semibold text-dash-muted uppercase tracking-wider mb-1">{label}</p>
              <p className="text-[13px] text-dash-text leading-relaxed">{value}</p>
            </div>
          ))}

          {/* Links / Social */}
          {(app.linkedin || app.github || app.website) && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[11px] font-semibold text-dash-muted uppercase tracking-wider mb-2">Links</p>
              <div className="space-y-1">
                {app.linkedin && (
                  <a href={app.linkedin} target="_blank" rel="noopener noreferrer"
                    className="text-[13px] text-blue-600 hover:underline block truncate">
                    LinkedIn: {app.linkedin}
                  </a>
                )}
                {app.github && (
                  <a href={app.github} target="_blank" rel="noopener noreferrer"
                    className="text-[13px] text-blue-600 hover:underline block truncate">
                    GitHub: {app.github}
                  </a>
                )}
                {app.website && (
                  <a href={app.website} target="_blank" rel="noopener noreferrer"
                    className="text-[13px] text-blue-600 hover:underline block truncate">
                    Website: {app.website}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {app.status === 'pending' && (
          <div className="p-5 border-t border-dash-border flex gap-3">
            <button
              onClick={() => onReject(app._id)}
              disabled={processing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-[13px] font-semibold disabled:opacity-50"
            >
              <XCircle size={15} /> Reject
            </button>
            <button
              onClick={() => onApprove(app._id)}
              disabled={processing}
              className="flex-1 dash-btn-primary flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] disabled:opacity-50"
            >
              <CheckCircle size={15} /> Approve
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ── Main component ───────────────────────────────────────────── */
export default function OnboardingRequestsPage() {
  const [apps,        setApps]        = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [search,      setSearch]      = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected,    setSelected]    = useState(null)  // app object for drawer
  const [processing,  setProcessing]  = useState(false)
  const [toast,       setToast]       = useState(null)

  const toArr = (raw) => {
    if (Array.isArray(raw))                    return raw
    if (Array.isArray(raw?.data))              return raw.data
    if (Array.isArray(raw?.applications))      return raw.applications
    if (Array.isArray(raw?.onboardingRequests)) return raw.onboardingRequests
    return []
  }

  const load = () => {
    setLoading(true)
    adminService.getOnboardingRequests()
      .then((r) => setApps(toArr(r.data ?? r)))
      .catch(() => setError('Failed to load onboarding requests.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleApprove = async (id) => {
    setProcessing(true)
    try {
      await adminService.reviewOnboarding(id, 'approved')
      setApps((prev) => prev.map((a) => a._id === id ? { ...a, status: 'approved' } : a))
      if (selected?._id === id) setSelected((s) => ({ ...s, status: 'approved' }))
      showToast('Application approved! User has been promoted to mentor.')
    } catch {
      showToast('Failed to approve application.')
    }
    setProcessing(false)
  }

  const handleReject = async (id) => {
    setProcessing(true)
    try {
      await adminService.reviewOnboarding(id, 'rejected')
      setApps((prev) => prev.map((a) => a._id === id ? { ...a, status: 'rejected' } : a))
      if (selected?._id === id) setSelected((s) => ({ ...s, status: 'rejected' }))
      showToast('Application rejected.')
    } catch {
      showToast('Failed to reject application.')
    }
    setProcessing(false)
  }

  const filtered = apps.filter((a) => {
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    const name  = (a.userId?.name ?? '').toLowerCase()
    const email = (a.userId?.email ?? '').toLowerCase()
    const q     = search.toLowerCase()
    const matchSearch = !search.trim() || name.includes(q) || email.includes(q)
    return matchStatus && matchSearch
  })

  const counts = {
    all:      apps.length,
    pending:  apps.filter((a) => a.status === 'pending').length,
    approved: apps.filter((a) => a.status === 'approved').length,
    rejected: apps.filter((a) => a.status === 'rejected').length,
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-dash-text flex items-center gap-2">
            <UserCheck size={22} className="text-dash-primary" /> Onboarding Requests
          </h2>
          <p className="text-[13px] text-dash-muted mt-0.5">
            Review and approve mentor applications — {counts.pending} pending
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="dash-btn-outline flex items-center gap-2 px-4 py-2 text-[13px] self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </motion.div>

      {/* ── Summary cards ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: 'Total',    value: counts.all,      color: 'bg-gray-50',    text: 'text-dash-text'  },
          { label: 'Pending',  value: counts.pending,  color: 'bg-amber-50',   text: 'text-amber-700' },
          { label: 'Approved', value: counts.approved, color: 'bg-green-50',   text: 'text-green-700' },
          { label: 'Rejected', value: counts.rejected, color: 'bg-red-50',     text: 'text-red-700'   },
        ].map(({ label, value, color, text }) => (
          <div key={label} className={`dash-card p-4 ${color}`}>
            <p className={`text-2xl font-bold ${text}`}>{value}</p>
            <p className="text-[12px] text-dash-muted mt-0.5">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Filters ────────────────────────────────────────────── */}
      <div className="dash-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-muted" size={14} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="dash-input w-full pl-8 pr-3 py-2 text-[13px]"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {['all', 'pending', 'approved', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all capitalize ${
                statusFilter === s
                  ? 'bg-white text-dash-text shadow-sm'
                  : 'text-dash-muted hover:text-dash-text'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <div className="dash-card overflow-hidden">
        {error ? (
          <div className="p-12 text-center">
            <AlertCircle className="mx-auto text-dash-primary mb-3" size={28} />
            <p className="text-dash-text font-medium">{error}</p>
            <button onClick={load} className="dash-btn-primary mt-3 px-4 py-2 text-[13px]">Retry</button>
          </div>
        ) : loading ? (
          <div className="p-5 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="shimmer w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="shimmer h-3 w-40 rounded" />
                  <div className="shimmer h-3 w-56 rounded" />
                </div>
                <div className="shimmer h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-dash-text font-medium">No requests found</p>
            <p className="text-[13px] text-dash-muted mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="hidden md:grid grid-cols-[2fr_2fr_1.5fr_1fr_1.5fr_auto] gap-4 px-5 py-3 border-b border-dash-border bg-gray-50 text-[11px] font-semibold text-dash-muted uppercase tracking-wider">
              <span>Applicant</span>
              <span>Email</span>
              <span>Experience</span>
              <span>Role</span>
              <span>Submitted</span>
              <span>Actions</span>
            </div>

            {/* Rows */}
            <motion.div variants={container} initial="hidden" animate="show">
              {filtered.map((app) => (
                <motion.div
                  key={app._id}
                  variants={item}
                  className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1.5fr_1fr_1.5fr_auto] gap-3 md:gap-4 items-center px-5 py-4 border-b border-dash-border last:border-0 hover:bg-gray-50 transition-colors"
                >
                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-dash-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {app.userId?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                    </div>
                    <p className="text-[13px] font-semibold text-dash-text truncate">
                      {app.userId?.name ?? 'Unknown'}
                    </p>
                  </div>

                  {/* Email */}
                  <p className="text-[12px] text-dash-muted truncate">
                    {app.userId?.email ?? '—'}
                  </p>

                  {/* Experience */}
                  <p className="text-[12px] text-dash-text truncate flex items-center gap-1">
                    <Briefcase size={11} className="text-dash-muted shrink-0" />
                    {app.experience ?? app.yearsOfExperience ?? '—'}
                  </p>

                  {/* Requested Role */}
                  <span className="dash-badge dash-badge-blue text-[11px] w-fit capitalize">
                    {app.requestedRole ?? 'Mentor'}
                  </span>

                  {/* Date */}
                  <p className="text-[12px] text-dash-muted flex items-center gap-1">
                    <Clock size={11} className="shrink-0" />
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <span className={`dash-badge text-[11px] ${STATUS_BADGE[app.status ?? 'pending']?.cls}`}>
                      {STATUS_BADGE[app.status ?? 'pending']?.label}
                    </span>
                    <button
                      onClick={() => setSelected(app)}
                      className="dash-btn-outline px-3 py-1 text-[12px]"
                    >
                      View
                    </button>
                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(app._id)}
                          disabled={processing}
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleReject(app._id)}
                          disabled={processing}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="px-5 py-3 border-t border-dash-border bg-gray-50 text-[12px] text-dash-muted">
              Showing {filtered.length} of {apps.length} requests
            </div>
          </>
        )}
      </div>

      {/* ── Details drawer ─────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <DetailsDrawer
            app={selected}
            onClose={() => setSelected(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            processing={processing}
          />
        )}
      </AnimatePresence>

      {/* ── Toast ─────────────────────────────────────────────── */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-5 right-5 bg-gray-900 text-white text-[13px] px-4 py-2.5 rounded-xl shadow-lg z-50 max-w-sm"
        >
          {toast}
        </motion.div>
      )}
    </div>
  )
}
