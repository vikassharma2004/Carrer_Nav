import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, ArrowRight, Loader2 } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import useAuthStore from '../../store/useAuthStore'

function getRoleRoute(role) {
  if (role === 'mentor') return '/dashboard/mentor'
  if (role === 'admin') return '/dashboard/admin'
  return '/dashboard/learner'
}

export default function VerifyMFAPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { verify2FALogin, isLoading } = useAuthStore()

  const userId = location.state?.userId

  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const inputRefs = useRef([])

  const code = digits.join('')

  const handleDigit = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const next = [...digits]
    next[index] = value
    setDigits(next)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = [...digits]
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setDigits(next)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (code.length !== 6) return
    setError('')
    try {
      const res = await verify2FALogin({ userId, token: code })
      navigate(getRoleRoute(res.user?.role), { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.')
      setDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    }
  }

  if (!userId) {
    navigate('/auth/signin', { replace: true })
    return null
  }

  return (
    <AuthLayout
      headlineTop="One last step"
      headlineBottom="to keep you safe."
      subtext="Two-factor authentication is enabled on your account. Enter your authenticator code to continue."
    >
      {/* Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-4">
          <Shield size={26} className="text-brand-purple" />
        </div>
        <h1 className="text-2xl font-extrabold text-brand-navy mb-1">Two-Factor Auth</h1>
        <p className="text-brand-gray text-sm">
          Enter the 6-digit code from your authenticator app.
        </p>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-5 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm text-center"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
        {/* 6-digit input */}
        <div className="flex gap-3" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-xl font-bold rounded-2xl border-2
                         border-gray-200 bg-brand-lavender text-brand-navy
                         focus:outline-none focus:border-brand-purple focus:bg-white
                         transition-all duration-200"
            />
          ))}
        </div>

        <motion.button
          type="submit"
          disabled={isLoading || code.length !== 6}
          className="w-full flex items-center justify-center gap-2
                     bg-brand-purple text-white font-bold rounded-2xl
                     py-4 text-base shadow-card
                     hover:bg-brand-purple2 hover:shadow-glow
                     disabled:opacity-60 disabled:cursor-not-allowed
                     transition-all duration-300"
          whileHover={!isLoading && code.length === 6 ? { scale: 1.02, y: -1 } : {}}
          whileTap={!isLoading && code.length === 6 ? { scale: 0.98 } : {}}
        >
          {isLoading
            ? <Loader2 size={18} className="animate-spin" />
            : <> Verify & Continue <ArrowRight size={18} /></>
          }
        </motion.button>

        <p className="text-xs text-brand-gray">
          Lost access to your authenticator?{' '}
          <span className="text-brand-purple font-medium cursor-pointer hover:underline">
            Use a backup code
          </span>
        </p>
      </form>
    </AuthLayout>
  )
}
