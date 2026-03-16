import { useState, useEffect } from 'react'
import { useNavigate, Link }   from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ArrowRight, ArrowLeft, Rocket }   from 'lucide-react'

import WizardProgress from '../../components/onboarding/WizardProgress'
import Step1Expertise from '../../components/onboarding/steps/Step1Expertise'
import Step2Persona   from '../../components/onboarding/steps/Step2Persona'
import Step3AICopilot from '../../components/onboarding/steps/Step3AICopilot'
import Step4Community from '../../components/onboarding/steps/Step4Community'
import Step5Review    from '../../components/onboarding/steps/Step5Review'
import api            from '../../services/api'
import useAuthStore   from '../../store/useAuthStore'

const TOTAL_STEPS = 5

const STEP_VALID = {
  1: (d) => (d.expertise || []).length > 0 && !!d.experienceYears,
  2: (d) => !!d.availability,
  3: ()  => true,   // all toggles optional
  4: ()  => true,   // all links optional
  5: ()  => true,
}

const STEP_HINT = {
  1: 'Select at least 1 skill and your experience level to continue.',
  2: 'Choose the persona that best describes your mentoring style.',
  3: '',
  4: '',
  5: '',
}

export default function MentorOnboardingPage() {
  const navigate           = useNavigate()
  const { fetchMe }        = useAuthStore()

  const [step,      setStep]      = useState(1)
  const [formData,  setFormData]  = useState({
    expertise: [], experienceYears: null, bio: '',
    availability: '',
    aiPreferences: { autoDebug: true, projectFeedback: true, motivationCoach: true, learningTips: true, interviewGuidance: false },
    linkedInUrl: '', portfolioUrl: '',
    discordHandle: '', slackWorkspace: '',
  })
  const [error,       setError]       = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hydrate: if already has a pending application, resume from step 5
  useEffect(() => {
    api.get('/mentor-onboarding/me')
      .then(({ data }) => {
        if (data.onboarding?.status === 'approved') {
          navigate('/mentor/dashboard', { replace: true })
        }
        // If pending, jump to review
        if (data.onboarding?.status === 'pending') {
          const app = data.onboarding.application || {}
          setFormData(f => ({
            ...f,
            expertise:         app.expertise         || [],
            experienceYears:   app.experienceYears   || null,
            bio:               app.bio               || '',
            availability:      app.availability      || '',
            portfolioUrl:      app.portfolioUrl      || '',
            linkedInUrl:       app.linkedInUrl        || '',
          }))
          setStep(5)
        }
      })
      .catch(() => {}) // 404 = no existing application, which is fine
  }, [navigate])

  const merge = (patch) => setFormData(f => ({ ...f, ...patch }))

  const isValid = STEP_VALID[step]?.(formData) ?? true

  const handleNext = () => {
    if (!isValid) { setError(STEP_HINT[step]); return }
    setError('')
    if (step < TOTAL_STEPS) setStep(s => s + 1)
  }

  const handleBack = () => {
    setError('')
    setStep(s => Math.max(1, s - 1))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')
    try {
      // Build motivation string from AI preferences + community handles
      const motivation = JSON.stringify({
        aiPreferences:  formData.aiPreferences,
        discordHandle:  formData.discordHandle,
        slackWorkspace: formData.slackWorkspace,
      })

      await api.post('/mentor-onboarding/apply', {
        expertise:        formData.expertise,
        experienceYears:  formData.experienceYears,
        bio:              formData.bio,
        portfolioUrl:     formData.portfolioUrl,
        linkedInUrl:      formData.linkedInUrl,
        availability:     formData.availability,
        motivation,
      })

      await fetchMe()                       // refresh user in store
      navigate('/mentor/apply/success')
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepProps = { data: formData, onChange: merge }

  return (
    <div className="min-h-screen bg-brand-lavender font-sans flex flex-col">
      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="orb orb-purple absolute top-0 left-1/4 w-96 h-96 opacity-[0.08]" />
        <div className="orb orb-cyan   absolute bottom-0 right-0 w-80 h-80 opacity-[0.06]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5
                         bg-white/80 backdrop-blur-sm border-b border-brand-purple/10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center">
            <Zap size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-extrabold text-brand-navy">
            Career<span className="gradient-text">Nav</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-brand-gray">
          <span className="font-mono text-brand-purple font-medium">{step}/{TOTAL_STEPS}</span>
          <span>Mentor Setup</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 py-10">
        {/* Progress */}
        <div className="w-full max-w-lg mb-8">
          <WizardProgress current={step} />
        </div>

        {/* Step card */}
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-[32px] shadow-card-lg border border-brand-purple/8 p-8 md:p-10">
            <AnimatePresence mode="wait">
              <div key={step}>
                {step === 1 && <Step1Expertise  {...stepProps} />}
                {step === 2 && <Step2Persona    {...stepProps} />}
                {step === 3 && <Step3AICopilot  {...stepProps} />}
                {step === 4 && <Step4Community  {...stepProps} />}
                {step === 5 && (
                  <Step5Review
                    {...stepProps}
                    onGoToStep={setStep}
                    isSubmitting={isSubmitting}
                  />
                )}
              </div>
            </AnimatePresence>

            {/* Error */}
            {error && (
              <motion.div
                className="mt-4 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <motion.button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-gray-200
                           text-brand-gray font-semibold text-sm
                           hover:border-brand-purple/40 hover:text-brand-purple
                           disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                whileHover={step > 1 ? { scale: 1.03 } : {}}
                whileTap={step > 1 ? { scale: 0.97 } : {}}
              >
                <ArrowLeft size={16} /> Back
              </motion.button>

              {step < TOTAL_STEPS ? (
                <motion.button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-7 py-3 rounded-2xl
                             bg-brand-purple text-white font-bold text-sm
                             shadow-card hover:bg-brand-purple2 hover:shadow-glow
                             transition-all duration-200"
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Continue <ArrowRight size={16} />
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-7 py-3 rounded-2xl
                             bg-gradient-brand text-white font-bold text-sm
                             shadow-card hover:shadow-glow
                             disabled:opacity-60 disabled:cursor-not-allowed
                             transition-all duration-200"
                  whileHover={!isSubmitting ? { scale: 1.04, y: -1 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                >
                  <Rocket size={16} />
                  Submit Application
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
