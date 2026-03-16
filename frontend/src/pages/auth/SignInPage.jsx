import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import useAuthStore from '../../store/useAuthStore'

export default function SignInPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading } = useAuthStore()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  // Where to redirect after login
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await login(form)
      if (res.requires2FA) {
        navigate('/auth/2fa', { state: { userId: res.userId } })
        return
      }
      // If mentor intent is set, redirect to onboarding
      const intent = sessionStorage.getItem('mentorIntent')
      if (intent === 'apply') {
        sessionStorage.removeItem('mentorIntent')
        navigate('/mentor/apply')
        return
      }
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed. Please try again.')
    }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <AuthLayout
      headlineTop="Your next milestone"
      headlineBottom="is 2 minutes away."
      subtext="Sign in to continue your learning journey and unlock your personalized roadmap."
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-brand-navy mb-2">Welcome back</h1>
        <p className="text-brand-gray text-sm">
          New here?{' '}
          <Link to="/auth/signup" className="text-brand-purple font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          className="mb-5 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">Email</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={set('email')}
            className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 bg-brand-lavender
                       text-brand-navy placeholder-gray-400 text-sm font-medium
                       focus:outline-none focus:border-brand-purple focus:bg-white
                       transition-all duration-200"
            style={{ '--tw-ring-color': 'rgba(0,245,160,0.4)' }}
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-brand-navy">Password</label>
            <span className="text-xs text-brand-purple cursor-pointer hover:underline font-medium">
              Forgot password?
            </span>
          </div>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              required
              placeholder="Your password"
              value={form.password}
              onChange={set('password')}
              className="w-full px-5 py-3.5 pr-12 rounded-2xl border-2 border-gray-200 bg-brand-lavender
                         text-brand-navy placeholder-gray-400 text-sm font-medium
                         focus:outline-none focus:border-brand-purple focus:bg-white
                         transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-purple transition-colors"
            >
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full flex items-center justify-center gap-2
                     bg-brand-purple text-white font-bold rounded-2xl
                     py-4 text-base shadow-card
                     hover:bg-brand-purple2 hover:shadow-glow
                     disabled:opacity-60 disabled:cursor-not-allowed
                     transition-all duration-300"
          whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>Sign In <ArrowRight size={18} /></>
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-brand-gray font-medium">or continue with</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Social (UI-only) */}
      <div className="flex gap-3">
        {[
          { name: 'Google', icon: '🌐' },
          { name: 'GitHub', icon: '⚫' },
        ].map(({ name, icon }) => (
          <motion.button
            key={name}
            type="button"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl
                       border-2 border-gray-200 text-brand-gray text-sm font-semibold
                       hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-all"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>{icon}</span> {name}
          </motion.button>
        ))}
      </div>
    </AuthLayout>
  )
}
