import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Search, RefreshCw, UserCheck, UserX, Trash2,
  ChevronDown, MoreVertical, AlertCircle,
} from 'lucide-react'
import adminService from '../../services/adminService'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const item      = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } }

const ROLE_BADGE = {
  admin:   'dash-badge-red',
  mentor:  'dash-badge-blue',
  learner: 'dash-badge-gray',
}

const STATUS_BADGE = {
  active:    'dash-badge-green',
  suspended: 'dash-badge-red',
  inactive:  'dash-badge-amber',
}

function Avatar({ name, size = 8 }) {
  const initials = name?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() ?? 'U'
  const colors   = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500']
  const color    = colors[initials.charCodeAt(0) % colors.length]
  return (
    <div className={`w-${size} h-${size} rounded-full ${color} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
      {initials}
    </div>
  )
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="dash-card p-6 max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-dash-primary shrink-0" size={22} />
          <p className="text-[14px] font-semibold text-dash-text">{message}</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="dash-btn-outline px-4 py-2 text-[13px]">Cancel</button>
          <button onClick={onConfirm} className="dash-btn-primary px-4 py-2 text-[13px]">Confirm</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function UsersManagementPage() {
  const [users,        setUsers]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [search,       setSearch]       = useState('')
  const [roleFilter,   setRoleFilter]   = useState('all')
  const [actionMenu,   setActionMenu]   = useState(null) // userId
  const [confirm,      setConfirm]      = useState(null) // { message, onConfirm }
  const [toast,        setToast]        = useState(null)

  const toArr = (raw) => {
    if (Array.isArray(raw))           return raw
    if (Array.isArray(raw?.data))     return raw.data
    if (Array.isArray(raw?.users))    return raw.users
    if (Array.isArray(raw?.profiles)) return raw.profiles
    return []
  }

  const load = () => {
    setLoading(true)
    adminService.getUsers()
      .then((r) => setUsers(toArr(r.data ?? r)))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // Close action menu on outside click
  useEffect(() => {
    const handler = () => setActionMenu(null)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const filtered = useMemo(() => {
    let list = users
    if (roleFilter !== 'all') list = list.filter((u) => u.role === roleFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      )
    }
    return list
  }, [users, roleFilter, search])

  const handleUpdateRole = async (userId, newRole) => {
    setConfirm({
      message: `Promote this user to "${newRole}"?`,
      onConfirm: async () => {
        setConfirm(null)
        try {
          await adminService.updateUser(userId, { role: newRole })
          setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role: newRole } : u))
          showToast('User role updated.')
        } catch {
          showToast('Failed to update role.')
        }
      },
    })
  }

  const handleDelete = (userId, name) => {
    setConfirm({
      message: `Delete "${name}"? This cannot be undone.`,
      onConfirm: async () => {
        setConfirm(null)
        try {
          await adminService.deleteUser(userId)
          setUsers((prev) => prev.filter((u) => u._id !== userId))
          showToast('User deleted.')
        } catch {
          showToast('Failed to delete user.')
        }
      },
    })
  }

  const ROLE_COUNTS = {
    all:     users.length,
    learner: users.filter((u) => u.role === 'learner').length,
    mentor:  users.filter((u) => u.role === 'mentor').length,
    admin:   users.filter((u) => u.role === 'admin').length,
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">

      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-dash-text flex items-center gap-2">
            <Users size={22} className="text-dash-primary" /> User Management
          </h2>
          <p className="text-[13px] text-dash-muted mt-0.5">
            Manage all platform users — {ROLE_COUNTS.all} total
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

      {/* ── Filters ────────────────────────────────────────────── */}
      <div className="dash-card p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-muted" size={14} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="dash-input w-full pl-8 pr-3 py-2 text-[13px]"
          />
        </div>

        {/* Role tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {['all', 'learner', 'mentor', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all capitalize ${
                roleFilter === r
                  ? 'bg-white text-dash-text shadow-sm'
                  : 'text-dash-muted hover:text-dash-text'
              }`}
            >
              {r} {ROLE_COUNTS[r] > 0 && <span className="text-[10px] opacity-70">({ROLE_COUNTS[r]})</span>}
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
          <div className="p-5 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="shimmer w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <div className="shimmer h-3 w-40 rounded" />
                  <div className="shimmer h-3 w-56 rounded" />
                </div>
                <div className="shimmer h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-dash-text font-medium">No users found</p>
            <p className="text-[13px] text-dash-muted mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_1.5fr_auto] gap-4 px-5 py-3 border-b border-dash-border bg-gray-50 text-[11px] font-semibold text-dash-muted uppercase tracking-wider">
              <span>User</span>
              <span>Email</span>
              <span>Role</span>
              <span>Status</span>
              <span>Joined</span>
              <span>Actions</span>
            </div>

            {/* Table rows */}
            <motion.div variants={container} initial="hidden" animate="show">
              {filtered.map((u) => (
                <motion.div
                  key={u._id}
                  variants={item}
                  className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr_1.5fr_auto] gap-3 md:gap-4 items-center px-5 py-4 border-b border-dash-border last:border-0 hover:bg-gray-50 transition-colors"
                >
                  {/* User */}
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name ?? u.userId?.name} />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-dash-text truncate">
                        {u.name ?? u.userId?.name ?? 'Unknown'}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <p className="text-[12px] text-dash-muted truncate">
                    {u.email ?? u.userId?.email ?? '—'}
                  </p>

                  {/* Role */}
                  <span className={`dash-badge capitalize text-[11px] w-fit ${ROLE_BADGE[u.role] ?? 'dash-badge-gray'}`}>
                    {u.role ?? '—'}
                  </span>

                  {/* Status */}
                  <span className={`dash-badge capitalize text-[11px] w-fit ${STATUS_BADGE[u.status ?? 'active']}`}>
                    {u.status ?? 'Active'}
                  </span>

                  {/* Joined */}
                  <p className="text-[12px] text-dash-muted">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </p>

                  {/* Actions */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setActionMenu(actionMenu === u._id ? null : u._id)}
                      className="p-1.5 rounded-lg text-dash-muted hover:text-dash-text hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {actionMenu === u._id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute right-0 top-8 w-48 dash-card shadow-lg z-20 overflow-hidden"
                      >
                        {u.role !== 'mentor' && (
                          <button
                            onClick={() => { setActionMenu(null); handleUpdateRole(u._id, 'mentor') }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-dash-text hover:bg-dash-sidebar-h transition-colors"
                          >
                            <UserCheck size={14} className="text-blue-500" /> Promote to Mentor
                          </button>
                        )}
                        {u.role !== 'learner' && (
                          <button
                            onClick={() => { setActionMenu(null); handleUpdateRole(u._id, 'learner') }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-dash-text hover:bg-dash-sidebar-h transition-colors"
                          >
                            <UserX size={14} className="text-amber-500" /> Set as Learner
                          </button>
                        )}
                        <div className="border-t border-dash-border">
                          <button
                            onClick={() => { setActionMenu(null); handleDelete(u._id, u.name ?? u.userId?.name ?? 'this user') }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} /> Delete Account
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-dash-border bg-gray-50 text-[12px] text-dash-muted">
              Showing {filtered.length} of {users.length} users
            </div>
          </>
        )}
      </div>

      {/* ── Confirm modal ──────────────────────────────────────── */}
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* ── Toast ─────────────────────────────────────────────── */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-5 right-5 bg-gray-900 text-white text-[13px] px-4 py-2.5 rounded-xl shadow-lg z-50"
        >
          {toast}
        </motion.div>
      )}
    </div>
  )
}
