import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2, MailCheck, RefreshCcw } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import useAuthStore from '../../store/useAuthStore'

const RESEND_COOLDOWN = 60 // seconds

export default function VerifyEmailPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { verifyEmail, resendOtp, isLoading } = useAuthStore()

  const userId = location.state?.userId
  const email  = location.state?.email

  const [digits,   setDigits]   = useState(Array(6).fill(''))
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [cooldown, setCooldown] = useState(0)
  const inputRefs = useRef([])

  // Guard: if no userId in state, redirect back
  useEffect(() => {
    if (!userId) navigate('/auth/signup', { replace: true })
  }, [userId, navigate])

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  // ── Handle digit input ───────────────────────────────────────────────
  const handleDigitChange = (i, val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 1)
    const next = [...digits]
    next[i] = cleaned
    setDigits(next)
    if (cleaned && i < 5) inputRefs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setDigits(pasted.split(''))
      inputRefs.current[5]?.focus()
    }
  }

  // ── Submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const otp = digits.join('')
    if (otp.length < 6) { setError('Please enter the full 6-digit code.'); return }

    try {
      await verifyEmail({ userId, otp })
      setSuccess('Email verified! Redirecting to sign in…')
      setTimeout(() => navigate('/auth/signin'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code. Try again.')
      setDigits(Array(6).fill(''))
      inputRefs.current[0]?.focus()
    }
  }

  // ── Resend ───────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (cooldown > 0) return
    setError('')
    try {
      await resendOtp(userId)
      setCooldown(RESEND_COOLDOWN)
      setSuccess('A new code has been sent to your email.')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend. Try again.')
    }
  }

  return (
    <AuthLayout
      headlineTop="Almost there."
      headlineBottom="Verify your email."
      subtext="One quick step to secure your account and unlock your learning path."
    >
      {/* Icon + header */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 border border-brand-purple/20
                        flex items-center justify-center mx-auto mb-4">
          <MailCheck size={28} className="text-brand-purple" />
        </div>
        <h1 className="text-2xl font-extrabold text-brand-navy mb-2">Check your inbox</h1>
        <p className="text-brand-gray text-sm leading-relaxed">
          We sent a 6-digit code to{' '}
          <strong className="text-brand-navy">{email || 'your email'}</strong>.
          Enter it below.
        </p>
      </div>

      {/* Feedback */}
      {error && (
        <motion.div className="mb-5 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div className="mb-5 px-4 py-3 rounded-2xl bg-emerald-50 border border-brand-mint/30 text-emerald-700 text-sm"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          {success}
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        {/* OTP digit boxes */}
        <div className="flex gap-2.5 justify-center mb-6" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-xl font-extrabold rounded-2xl
                         border-2 border-gray-200 bg-brand-lavender text-brand-navy
                         focus:outline-none focus:border-brand-purple focus:bg-white
                         transition-all duration-200"
              style={{
                boxShadow: d ? '0 0 0 3px rgba(123,97,255,0.15)' : undefined,
                borderColor: d ? '#7B61FF' : undefined,
              }}
            />
          ))}
        </div>

        <motion.button
          type="submit" disabled={isLoading}
          className="w-full flex items-center justify-center gap-2
                     bg-brand-purple text-white font-bold rounded-2xl py-4 text-base
                     shadow-card hover:bg-brand-purple2 hover:shadow-glow
                     disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
          whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading
            ? <Loader2 size={18} className="animate-spin" />
            : <>Verify Email <ArrowRight size={18} /></>
          }
        </motion.button>
      </form>

      {/* Resend */}
      <div className="mt-6 text-center">
        <p className="text-brand-gray text-sm mb-2">Didn't receive the code?</p>
        <button
          onClick={handleResend}
          disabled={cooldown > 0}
          className="inline-flex items-center gap-1.5 text-sm font-semibold
                     text-brand-purple hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCcw size={14} />
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
        </button>
      </div>

      <div className="mt-4 text-center">
        <Link to="/auth/signup" className="text-xs text-brand-gray hover:text-brand-purple transition-colors">
          ← Back to sign up
        </Link>
      </div>
    </AuthLayout>
  )
}
