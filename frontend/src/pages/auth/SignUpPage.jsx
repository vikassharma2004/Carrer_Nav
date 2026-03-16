import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle, XCircle } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import useAuthStore from '../../store/useAuthStore'

const pwRules = [
  { label: '8+ characters',        test: (p) => p.length >= 8 },
  { label: 'Uppercase letter',     test: (p) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter',     test: (p) => /[a-z]/.test(p) },
  { label: 'Number',               test: (p) => /\d/.test(p) },
  { label: 'Special char (@$!%*?&)', test: (p) => /[@$!%*?&]/.test(p) },
]

export default function SignUpPage() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPw, setShowPw]   = useState(false)
  const [showCp, setShowCp]   = useState(false)
  const [error,  setError]    = useState('')
  const [touched, setTouched] = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    try {
      const res = await register(form)
      // Navigate to email verification with userId
      navigate('/auth/verify-email', { state: { userId: res.data.userId, email: form.email } })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  const inputClass = "w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 bg-brand-lavender text-brand-navy placeholder-gray-400 text-sm font-medium focus:outline-none focus:border-brand-purple focus:bg-white transition-all duration-200"

  return (
    <AuthLayout
      headlineTop="Build your future."
      headlineBottom="Start in 30 seconds."
      subtext="Create your free CareerNav account and get a personalized roadmap generated just for you."
    >
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-brand-navy mb-2">Create account</h1>
        <p className="text-brand-gray text-sm">
          Already have an account?{' '}
          <Link to="/auth/signin" className="text-brand-purple font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {error && (
        <motion.div
          className="mb-5 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">Full Name</label>
          <input
            type="text" required placeholder="Jamie Solano"
            value={form.name} onChange={set('name')}
            className={inputClass}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">Email</label>
          <input
            type="email" required placeholder="you@example.com"
            value={form.email} onChange={set('email')}
            className={inputClass}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              required placeholder="Create a strong password"
              value={form.password}
              onChange={(e) => { set('password')(e); setTouched(true) }}
              className={inputClass + ' pr-12'}
            />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-purple transition-colors">
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {/* Password strength rules */}
          {touched && (
            <motion.div
              className="mt-3 grid grid-cols-2 gap-1.5"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            >
              {pwRules.map(({ label, test }) => {
                const ok = test(form.password)
                return (
                  <div key={label} className="flex items-center gap-1.5 text-xs">
                    {ok
                      ? <CheckCircle size={12} className="text-brand-mint shrink-0" />
                      : <XCircle    size={12} className="text-gray-300 shrink-0" />
                    }
                    <span className={ok ? 'text-emerald-700' : 'text-brand-gray'}>{label}</span>
                  </div>
                )
              })}
            </motion.div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">Confirm Password</label>
          <div className="relative">
            <input
              type={showCp ? 'text' : 'password'}
              required placeholder="Repeat your password"
              value={form.confirmPassword} onChange={set('confirmPassword')}
              className={inputClass + ' pr-12'}
            />
            <button type="button" onClick={() => setShowCp(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-purple transition-colors">
              {showCp ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* CTA */}
        <motion.button
          type="submit" disabled={isLoading}
          className="mt-2 w-full flex items-center justify-center gap-2
                     bg-brand-purple text-white font-bold rounded-2xl py-4 text-base
                     shadow-card hover:bg-brand-purple2 hover:shadow-glow
                     disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
          whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading
            ? <Loader2 size={18} className="animate-spin" />
            : <>Create Account <ArrowRight size={18} /></>
          }
        </motion.button>
      </form>

      <p className="mt-5 text-center text-xs text-brand-gray">
        By signing up you agree to our{' '}
        <span className="text-brand-purple font-medium cursor-pointer hover:underline">Terms</span>
        {' '}and{' '}
        <span className="text-brand-purple font-medium cursor-pointer hover:underline">Privacy Policy</span>.
      </p>
    </AuthLayout>
  )
}
