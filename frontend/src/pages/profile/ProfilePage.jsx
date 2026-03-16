import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Shield,
  BarChart2,
  Award,
  Camera,
  Eye,
  EyeOff,
  CheckCircle,
  Monitor,
  Smartphone,
  Flame,
  Map,
  CheckSquare,
  Bot,
  Edit3,
  Save,
  X,
  Loader2,
  ShieldCheck,
  ShieldOff,
  QrCode,
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import api from '../../services/api'

/* ─── Tabs ───────────────────────────────────────────────────── */
const TABS = [
  { id: 'overview',     label: 'Overview',       icon: User   },
  { id: 'security',     label: 'Security',       icon: Shield },
  { id: 'stats',        label: 'Learning Stats', icon: BarChart2 },
  { id: 'achievements', label: 'Achievements',   icon: Award  },
]

/* ─── Mock data ─────────────────────────────────────────────── */
const MOCK_STATS = [
  { icon: Map,         label: 'Roadmaps Completed', value: 2,   color: 'bg-blue-50 text-blue-600'     },
  { icon: CheckSquare, label: 'Tasks Completed',    value: 47,  color: 'bg-green-50 text-green-600'   },
  { icon: Bot,         label: 'AI Questions Asked', value: 19,  color: 'bg-[#FFF3F0] text-dash-primary'},
  { icon: Flame,       label: 'Learning Streak',    value: '7d',color: 'bg-amber-50 text-amber-600'   },
]

const MOCK_SESSIONS = [
  { device: 'Chrome · Windows 11', icon: Monitor,    location: 'Mumbai, IN',  current: true,  time: 'Active now'    },
  { device: 'Safari · iPhone 14',  icon: Smartphone, location: 'Pune, IN',    current: false, time: '2 days ago'    },
  { device: 'Firefox · macOS',     icon: Monitor,    location: 'Bangalore, IN', current: false, time: '1 week ago' },
]

const ACHIEVEMENTS = [
  { id: 1, emoji: '🚀', title: 'First Steps',       desc: 'Completed your first task',          earned: true  },
  { id: 2, emoji: '🔥', title: 'Week Warrior',      desc: '7-day learning streak',              earned: true  },
  { id: 3, emoji: '⭐', title: 'Roadmap Explorer',  desc: 'Followed 3+ roadmaps',              earned: true  },
  { id: 4, emoji: '🤖', title: 'AI Curious',        desc: 'Asked 10+ AI questions',            earned: true  },
  { id: 5, emoji: '🎓', title: 'Graduate',          desc: 'Completed a full roadmap',          earned: false },
  { id: 6, emoji: '💡', title: 'Community Leader',  desc: 'Got 50+ reactions on a post',       earned: false },
  { id: 7, emoji: '⚡', title: 'Speed Learner',     desc: 'Finish a module in under 3 days',   earned: false },
  { id: 8, emoji: '🏆', title: 'Top Performer',     desc: 'Rank top 10 in your community',     earned: false },
]

/* ─── Overview Tab ─────────────────────────────────────────── */
function OverviewTab() {
  const { user } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [name, setName]       = useState(user?.name ?? '')
  const [bio, setBio]         = useState(user?.bio ?? 'Learning to build great products.')

  return (
    <div className="space-y-5">
      {/* Avatar + basic info */}
      <div className="dash-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Avatar */}
          <div className="relative self-center sm:self-start">
            <div className="w-20 h-20 rounded-full bg-dash-primary text-white flex items-center justify-center text-3xl font-bold">
              {(user?.name ?? 'U').charAt(0).toUpperCase()}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-dash-border rounded-full flex items-center justify-center shadow hover:bg-dash-sidebar-h transition-colors">
              <Camera size={12} className="text-dash-muted" />
            </button>
          </div>

          {/* Fields */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[15px] text-dash-text">Basic Information</h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="dash-btn-outline flex items-center gap-1.5 text-[12px] px-3 py-1.5"
                >
                  <Edit3 size={12} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="dash-btn-primary flex items-center gap-1.5 text-[12px] px-3 py-1.5"
                  >
                    <Save size={12} /> Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="dash-btn-outline flex items-center gap-1.5 text-[12px] px-3 py-1.5"
                  >
                    <X size={12} /> Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-dash-muted uppercase tracking-wide mb-1 block">
                  Full Name
                </label>
                {editing ? (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="dash-input w-full px-3 py-2 text-[13px]"
                  />
                ) : (
                  <p className="text-[14px] text-dash-text font-medium">{name || '—'}</p>
                )}
              </div>
              <div>
                <label className="text-[11px] font-semibold text-dash-muted uppercase tracking-wide mb-1 block">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-[14px] text-dash-text font-medium">{user?.email ?? '—'}</p>
                  {user?.isEmailVerified && (
                    <CheckCircle size={14} className="text-green-500 shrink-0" />
                  )}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-dash-muted uppercase tracking-wide mb-1 block">
                  Role
                </label>
                <span className="dash-badge dash-badge-blue capitalize">{user?.role ?? 'learner'}</span>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-dash-muted uppercase tracking-wide mb-1 block">
                  Member Since
                </label>
                <p className="text-[14px] text-dash-text font-medium">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
                    : 'March 2025'}
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-dash-muted uppercase tracking-wide mb-1 block">
                  Bio
                </label>
                {editing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="dash-input w-full px-3 py-2 text-[13px] resize-none"
                  />
                ) : (
                  <p className="text-[14px] text-dash-text">{bio || '—'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Security Tab ─────────────────────────────────────────── */
function SecurityTab() {
  const { user, setup2FA, verify2FASetup, setUser } = useAuthStore()

  // 2FA state
  const [twoFAStep, setTwoFAStep]       = useState('idle')  // idle | qr | verify | enabled
  const [qrCode, setQrCode]             = useState('')
  const [twoFAToken, setTwoFAToken]     = useState('')
  const [twoFALoading, setTwoFALoading] = useState(false)
  const [twoFAError, setTwoFAError]     = useState('')

  // Password state
  const [showPwForm, setShowPwForm]     = useState(false)
  const [showOld, setShowOld]           = useState(false)
  const [showNew, setShowNew]           = useState(false)
  const [pwForm, setPwForm]             = useState({ current: '', newPw: '' })
  const [pwLoading, setPwLoading]       = useState(false)
  const [pwMsg, setPwMsg]               = useState({ type: '', text: '' })

  const isEnabled = user?.twoFactorEnabled ?? false

  // ── Step 1: Generate QR code ─────────────────────────────────
  const handleEnable2FA = async () => {
    setTwoFALoading(true)
    setTwoFAError('')
    try {
      const data = await setup2FA()
      setQrCode(data.qrCode ?? data.data?.qrCode ?? '')
      setTwoFAStep('qr')
    } catch (err) {
      setTwoFAError(err.response?.data?.message ?? 'Failed to generate QR code.')
    }
    setTwoFALoading(false)
  }

  // ── Step 2: Verify token and enable 2FA ──────────────────────
  const handleVerify2FA = async () => {
    if (twoFAToken.length !== 6) { setTwoFAError('Enter 6-digit code.'); return }
    setTwoFALoading(true)
    setTwoFAError('')
    try {
      await verify2FASetup({ token: twoFAToken })
      // Update local user state to reflect 2FA enabled
      setUser({ ...user, twoFactorEnabled: true })
      setTwoFAStep('idle')
      setTwoFAToken('')
      setQrCode('')
    } catch (err) {
      setTwoFAError(err.response?.data?.message ?? 'Invalid code. Try again.')
    }
    setTwoFALoading(false)
  }

  // ── Disable 2FA ──────────────────────────────────────────────
  const handleDisable2FA = async () => {
    setTwoFALoading(true)
    setTwoFAError('')
    try {
      await api.delete('/user/me/2fa')
      setUser({ ...user, twoFactorEnabled: false })
    } catch (err) {
      setTwoFAError(err.response?.data?.message ?? 'Failed to disable 2FA.')
    }
    setTwoFALoading(false)
  }

  // ── Change Password ──────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPwLoading(true)
    setPwMsg({ type: '', text: '' })
    try {
      await api.patch('/user/me/password', { currentPassword: pwForm.current, newPassword: pwForm.newPw })
      setPwMsg({ type: 'success', text: 'Password updated successfully.' })
      setPwForm({ current: '', newPw: '' })
      setShowPwForm(false)
    } catch (err) {
      setPwMsg({ type: 'error', text: err.response?.data?.message ?? 'Failed to update password.' })
    }
    setPwLoading(false)
  }

  return (
    <div className="space-y-4">
      {/* ── 2FA Card ───────────────────────────────────────────── */}
      <div className="dash-card p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Shield size={16} className={isEnabled ? 'text-green-600' : 'text-dash-muted'} />
            <h4 className="font-semibold text-[14px] text-dash-text">Two-Factor Authentication</h4>
          </div>
          {isEnabled ? (
            <span className="dash-badge dash-badge-green text-[10px] flex items-center gap-1">
              <CheckCircle size={10} /> Enabled
            </span>
          ) : (
            <span className="dash-badge dash-badge-gray text-[10px]">Disabled</span>
          )}
        </div>
        <p className="text-[12px] text-dash-muted mb-4">
          {isEnabled
            ? 'Your account is protected with TOTP-based 2FA.'
            : 'Add an extra layer of security using an authenticator app.'}
        </p>

        {twoFAError && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-red-700 text-[12px]">
            {twoFAError}
          </div>
        )}

        <AnimatePresence mode="wait">
          {twoFAStep === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {isEnabled ? (
                <button
                  onClick={handleDisable2FA}
                  disabled={twoFALoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-[13px] font-medium hover:bg-red-50 disabled:opacity-60 transition-colors"
                >
                  {twoFALoading ? <Loader2 size={13} className="animate-spin" /> : <ShieldOff size={13} />}
                  Disable 2FA
                </button>
              ) : (
                <button
                  onClick={handleEnable2FA}
                  disabled={twoFALoading}
                  className="dash-btn-primary flex items-center gap-2 px-4 py-2 text-[13px] disabled:opacity-60"
                >
                  {twoFALoading ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
                  Enable 2FA
                </button>
              )}
            </motion.div>
          )}

          {twoFAStep === 'qr' && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-4">
                {qrCode ? (
                  <img src={qrCode} alt="2FA QR Code" className="w-36 h-36 rounded-xl border border-gray-200" />
                ) : (
                  <div className="w-36 h-36 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center">
                    <QrCode size={40} className="text-gray-300" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-[13px] text-dash-text font-medium mb-1">Scan this QR code</p>
                  <p className="text-[12px] text-dash-muted leading-relaxed">
                    Open your authenticator app (Google Authenticator, Authy, etc.) and scan this QR code.
                    Then enter the 6-digit code below.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-dash-muted uppercase tracking-wide mb-1.5 block">
                  Verification Code
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={twoFAToken}
                    onChange={e => setTwoFAToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onKeyDown={e => e.key === 'Enter' && handleVerify2FA()}
                    className="dash-input px-3 py-2 text-[15px] font-mono tracking-widest w-36"
                  />
                  <button
                    onClick={handleVerify2FA}
                    disabled={twoFALoading || twoFAToken.length !== 6}
                    className="dash-btn-primary flex items-center gap-2 px-4 py-2 text-[13px] disabled:opacity-60"
                  >
                    {twoFALoading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                    Verify & Enable
                  </button>
                  <button
                    onClick={() => { setTwoFAStep('idle'); setQrCode(''); setTwoFAToken(''); setTwoFAError('') }}
                    className="dash-btn-outline px-3 py-2 text-[13px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Change Password ────────────────────────────────────── */}
      <div className="dash-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-[14px] text-dash-text">Change Password</h4>
            <p className="text-[12px] text-dash-muted mt-0.5">
              Update your password regularly to stay secure.
            </p>
          </div>
          <button
            onClick={() => { setShowPwForm(!showPwForm); setPwMsg({ type: '', text: '' }) }}
            className="dash-btn-outline text-[12px] px-3 py-1.5"
          >
            {showPwForm ? 'Cancel' : 'Change'}
          </button>
        </div>

        {pwMsg.text && (
          <div className={`mt-3 px-3 py-2 rounded-xl text-[12px] ${pwMsg.type === 'success' ? 'bg-green-50 border border-green-100 text-green-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
            {pwMsg.text}
          </div>
        )}

        <AnimatePresence>
          {showPwForm && (
            <motion.form
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              onSubmit={handleChangePassword}
              className="mt-4 space-y-3"
            >
              {[
                { label: 'Current Password', field: 'current', show: showOld, toggle: () => setShowOld(!showOld) },
                { label: 'New Password',     field: 'newPw',   show: showNew, toggle: () => setShowNew(!showNew) },
              ].map(({ label, field, show, toggle }) => (
                <div key={field}>
                  <label className="text-[11px] font-semibold text-dash-muted uppercase tracking-wide mb-1 block">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type={show ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={pwForm[field]}
                      onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))}
                      required
                      className="dash-input w-full px-3 py-2 text-[13px] pr-9"
                    />
                    <button
                      type="button"
                      onClick={toggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dash-muted hover:text-dash-text"
                    >
                      {show ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="submit"
                disabled={pwLoading}
                className="dash-btn-primary text-[13px] px-4 py-2 flex items-center gap-2 disabled:opacity-60"
              >
                {pwLoading && <Loader2 size={13} className="animate-spin" />}
                Update Password
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Active sessions (static) */}
      <div className="dash-card p-5">
        <h4 className="font-semibold text-[14px] text-dash-text mb-3">Active Sessions</h4>
        <div className="space-y-3">
          {MOCK_SESSIONS.map((s, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-dash-border last:border-0">
              <s.icon size={18} className="text-dash-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-dash-text">{s.device}</p>
                <p className="text-[11px] text-dash-muted">{s.location} · {s.time}</p>
              </div>
              {s.current ? (
                <span className="dash-badge dash-badge-green text-[10px]">Current</span>
              ) : (
                <button className="text-[12px] text-red-500 hover:underline font-medium">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Stats Tab ────────────────────────────────────────────── */
function StatsTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MOCK_STATS.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="dash-card p-4 flex flex-col items-center text-center gap-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-dash-text">{value}</p>
            <p className="text-[11px] text-dash-muted leading-snug">{label}</p>
          </div>
        ))}
      </div>

      {/* Weekly activity (simple bar chart mock) */}
      <div className="dash-card p-5">
        <h4 className="font-semibold text-[14px] text-dash-text mb-4">Weekly Activity</h4>
        <div className="flex items-end gap-2 h-24">
          {[3, 7, 2, 8, 5, 10, 4].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(v / 10) * 80}px` }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
                className="w-full rounded-t-md bg-dash-primary opacity-80"
              />
              <span className="text-[10px] text-dash-muted">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[12px] text-dash-muted mt-2">Tasks completed this week</p>
      </div>
    </div>
  )
}

/* ─── Achievements Tab ─────────────────────────────────────── */
function AchievementsTab() {
  return (
    <div>
      <p className="text-[13px] text-dash-muted mb-4">
        {ACHIEVEMENTS.filter((a) => a.earned).length} of {ACHIEVEMENTS.length} badges earned
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {ACHIEVEMENTS.map((ach) => (
          <motion.div
            key={ach.id}
            whileHover={ach.earned ? { scale: 1.04 } : {}}
            className={`dash-card p-4 flex flex-col items-center text-center gap-2 transition-opacity ${
              ach.earned ? '' : 'opacity-40 grayscale'
            }`}
          >
            <span className="text-3xl">{ach.emoji}</span>
            <p className="font-semibold text-[13px] text-dash-text">{ach.title}</p>
            <p className="text-[11px] text-dash-muted leading-snug">{ach.desc}</p>
            {ach.earned && (
              <span className="dash-badge dash-badge-green text-[10px]">Earned</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ─── Page ─────────────────────────────────────────────────── */
const TAB_COMPONENTS = {
  overview:     OverviewTab,
  security:     SecurityTab,
  stats:        StatsTab,
  achievements: AchievementsTab,
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const ActiveComponent = TAB_COMPONENTS[activeTab]

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-dash-text mb-5">Profile</h2>

      {/* Tab bar */}
      <div className="flex gap-1 bg-dash-sidebar-h rounded-xl p-1 mb-5 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all ${
              activeTab === id
                ? 'bg-white text-dash-text shadow-sm'
                : 'text-dash-muted hover:text-dash-text'
            }`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ActiveComponent />
      </motion.div>
    </div>
  )
}
