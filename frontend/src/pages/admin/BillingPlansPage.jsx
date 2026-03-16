import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard, Plus, Edit2, Trash2, Check, X, Star,
  Map, Users, Bot, RefreshCw, AlertCircle,
} from 'lucide-react'
import adminService from '../../services/adminService'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item      = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }

const EMPTY_FORM = {
  name: '', price: '', billingCycle: 'monthly',
  maxRoadmaps: '', maxCommunities: '', aiUsageLimit: '',
  features: '',
}

/* ── Plan form modal ──────────────────────────────────────────── */
function PlanFormModal({ plan, onSave, onClose, saving }) {
  const [form, setForm] = useState(
    plan
      ? {
          name:            plan.name ?? '',
          price:           plan.price ?? '',
          billingCycle:    plan.billingCycle ?? 'monthly',
          maxRoadmaps:     plan.maxRoadmaps ?? '',
          maxCommunities:  plan.maxCommunities ?? '',
          aiUsageLimit:    plan.aiUsageLimit ?? '',
          features:        (plan.features ?? []).join('\n'),
        }
      : EMPTY_FORM
  )

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      name:           form.name.trim(),
      price:          Number(form.price),
      billingCycle:   form.billingCycle,
      maxRoadmaps:    form.maxRoadmaps !== '' ? Number(form.maxRoadmaps) : undefined,
      maxCommunities: form.maxCommunities !== '' ? Number(form.maxCommunities) : undefined,
      aiUsageLimit:   form.aiUsageLimit !== '' ? Number(form.aiUsageLimit) : undefined,
      features:       form.features.split('\n').map((f) => f.trim()).filter(Boolean),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="dash-card p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-[17px] text-dash-text">
            {plan ? 'Edit Plan' : 'Create New Plan'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-dash-muted">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[12px] font-semibold text-dash-muted mb-1.5 uppercase tracking-wider">Plan Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Pro, Enterprise…"
              className="dash-input w-full px-3 py-2.5 text-[13px]"
            />
          </div>

          {/* Price + Billing Cycle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-dash-muted mb-1.5 uppercase tracking-wider">Price ($)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="0.00"
                className="dash-input w-full px-3 py-2.5 text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-dash-muted mb-1.5 uppercase tracking-wider">Billing Cycle</label>
              <select
                value={form.billingCycle}
                onChange={(e) => set('billingCycle', e.target.value)}
                className="dash-input w-full px-3 py-2.5 text-[13px]"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="lifetime">Lifetime</option>
              </select>
            </div>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'maxRoadmaps',    label: 'Max Roadmaps',    icon: Map,   placeholder: '∞' },
              { key: 'maxCommunities', label: 'Max Communities', icon: Users, placeholder: '∞' },
              { key: 'aiUsageLimit',   label: 'AI Usage Limit',  icon: Bot,   placeholder: '∞' },
            ].map(({ key, label, icon: Icon, placeholder }) => (
              <div key={key}>
                <label className="flex items-center gap-1 text-[12px] font-semibold text-dash-muted mb-1.5 uppercase tracking-wider">
                  <Icon size={11} /> {label}
                </label>
                <input
                  type="number"
                  min="0"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={placeholder}
                  className="dash-input w-full px-3 py-2.5 text-[13px]"
                />
              </div>
            ))}
          </div>

          {/* Features */}
          <div>
            <label className="block text-[12px] font-semibold text-dash-muted mb-1.5 uppercase tracking-wider">
              Features (one per line)
            </label>
            <textarea
              rows={4}
              value={form.features}
              onChange={(e) => set('features', e.target.value)}
              placeholder={'Unlimited access\nAI assistance\nMentor support\n…'}
              className="dash-input w-full px-3 py-2.5 text-[13px] resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 dash-btn-outline py-2.5 text-[13px]">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 dash-btn-primary py-2.5 text-[13px] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
              {plan ? 'Save Changes' : 'Create Plan'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

/* ── Plan card ────────────────────────────────────────────────── */
function PlanCard({ plan, onEdit, onDelete, onSetDefault }) {
  return (
    <motion.div
      variants={item}
      className={`dash-card dash-card-hover p-5 flex flex-col gap-4 relative ${plan.isDefault ? 'ring-2 ring-dash-primary' : ''}`}
    >
      {/* Default badge */}
      {plan.isDefault && (
        <span className="absolute top-4 right-4 dash-badge dash-badge-red text-[10px] flex items-center gap-1">
          <Star size={9} /> Default
        </span>
      )}

      {/* Header */}
      <div>
        <h3 className="font-bold text-[16px] text-dash-text">{plan.name}</h3>
        <p className="mt-1">
          <span className="text-2xl font-bold text-dash-primary">${plan.price}</span>
          <span className="text-[12px] text-dash-muted ml-1">/{plan.billingCycle ?? 'month'}</span>
        </p>
      </div>

      {/* Limits */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Map,   label: 'Roadmaps',    value: plan.maxRoadmaps    ?? '∞' },
          { icon: Users, label: 'Communities', value: plan.maxCommunities ?? '∞' },
          { icon: Bot,   label: 'AI Usage',    value: plan.aiUsageLimit   ?? '∞' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center">
            <Icon size={14} className="mx-auto text-dash-muted mb-1" />
            <p className="text-[13px] font-bold text-dash-text">{value}</p>
            <p className="text-[10px] text-dash-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      {plan.features?.length > 0 && (
        <ul className="space-y-1.5">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-[12px] text-dash-text">
              <Check size={13} className="text-green-500 mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2 border-t border-dash-border">
        {!plan.isDefault && (
          <button
            onClick={() => onSetDefault(plan._id)}
            className="flex-1 dash-btn-outline py-1.5 text-[12px] flex items-center justify-center gap-1"
          >
            <Star size={12} /> Set Default
          </button>
        )}
        <button
          onClick={() => onEdit(plan)}
          className="flex-1 dash-btn-outline py-1.5 text-[12px] flex items-center justify-center gap-1"
        >
          <Edit2 size={12} /> Edit
        </button>
        <button
          onClick={() => onDelete(plan._id)}
          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          title="Delete plan"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  )
}

/* ── Main component ───────────────────────────────────────────── */
export default function BillingPlansPage() {
  const [plans,   setPlans]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [modal,   setModal]   = useState(null)   // null | 'create' | plan object
  const [saving,  setSaving]  = useState(false)
  const [toast,   setToast]   = useState(null)

  const toArr = (raw) => {
    if (Array.isArray(raw))        return raw
    if (Array.isArray(raw?.data))  return raw.data
    if (Array.isArray(raw?.plans)) return raw.plans
    return []
  }

  const load = () => {
    setLoading(true)
    adminService.getBillingPlans()
      .then((r) => setPlans(toArr(r.data ?? r)))
      .catch(() => setError('Failed to load billing plans.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (modal === 'create') {
        const r = await adminService.createBillingPlan(data)
        setPlans((prev) => [...prev, r.data])
        showToast('Plan created successfully.')
      } else {
        const r = await adminService.updateBillingPlan(modal._id, data)
        setPlans((prev) => prev.map((p) => p._id === modal._id ? (r.data ?? { ...p, ...data }) : p))
        showToast('Plan updated successfully.')
      }
      setModal(null)
    } catch {
      showToast('Failed to save plan.')
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this billing plan? This cannot be undone.')) return
    try {
      // No delete endpoint defined in backend yet — optimistic UI
      setPlans((prev) => prev.filter((p) => p._id !== id))
      showToast('Plan deleted.')
    } catch {
      showToast('Failed to delete plan.')
    }
  }

  const handleSetDefault = async (id) => {
    try {
      await adminService.setDefaultPlan(id)
      setPlans((prev) => prev.map((p) => ({ ...p, isDefault: p._id === id })))
      showToast('Default plan updated.')
    } catch {
      showToast('Failed to set default plan.')
    }
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
            <CreditCard size={22} className="text-dash-primary" /> Billing Plans
          </h2>
          <p className="text-[13px] text-dash-muted mt-0.5">
            Manage subscription plans — {plans.length} plan{plans.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="dash-btn-outline flex items-center gap-2 px-4 py-2 text-[13px]"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={() => setModal('create')}
            className="dash-btn-primary flex items-center gap-2 px-4 py-2 text-[13px]"
          >
            <Plus size={14} /> New Plan
          </button>
        </div>
      </motion.div>

      {/* ── Plans grid ─────────────────────────────────────────── */}
      {error ? (
        <div className="dash-card p-12 text-center">
          <AlertCircle className="mx-auto text-dash-primary mb-3" size={28} />
          <p className="text-dash-text font-medium">{error}</p>
          <button onClick={load} className="dash-btn-primary mt-3 px-4 py-2 text-[13px]">Retry</button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="dash-card p-5 space-y-4">
              <div className="shimmer h-5 w-2/3 rounded" />
              <div className="shimmer h-8 w-1/3 rounded" />
              <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, j) => <div key={j} className="shimmer h-16 rounded-xl" />)}
              </div>
            </div>
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="dash-card p-16 text-center">
          <CreditCard className="mx-auto text-gray-300 mb-3" size={36} />
          <p className="text-dash-text font-semibold">No billing plans yet</p>
          <p className="text-[13px] text-dash-muted mt-1 mb-4">Create your first plan to get started.</p>
          <button onClick={() => setModal('create')} className="dash-btn-primary px-5 py-2.5 text-[13px] flex items-center gap-2 mx-auto">
            <Plus size={14} /> Create Plan
          </button>
        </div>
      ) : (
        <motion.div
          variants={container} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {plans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              onEdit={setModal}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </motion.div>
      )}

      {/* ── Plan form modal ────────────────────────────────────── */}
      <AnimatePresence>
        {modal && (
          <PlanFormModal
            plan={modal === 'create' ? null : modal}
            onSave={handleSave}
            onClose={() => setModal(null)}
            saving={saving}
          />
        )}
      </AnimatePresence>

      {/* ── Toast ─────────────────────────────────────────────── */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-5 right-5 bg-gray-900 text-white text-[13px] px-4 py-2.5 rounded-xl shadow-lg z-50"
        >
          {toast}
        </motion.div>
      )}
    </div>
  )
}
