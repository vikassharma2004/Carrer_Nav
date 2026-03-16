import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import useAuthStore from '../../store/useAuthStore'

const perks = [
  'Free forever plan — no credit card needed',
  'AI-generated personalized roadmap in 30 seconds',
  'Join 84,000+ learners already on their path',
]

const popularSkills = [
  'React Developer', 'AI Engineer', 'UI/UX Designer',
  'Backend Developer', 'Data Scientist', 'DevOps Engineer',
  'TypeScript', 'Python', 'Figma', 'Machine Learning',
]

export default function FinalCTA() {
  const [inputVal, setInputVal] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { ref, inView } = useScrollAnimation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const handleBecomeMentor = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('mentorIntent', 'apply')
      navigate('/auth/signup')
    } else {
      navigate('/mentor/apply')
    }
  }

  const handleGenerate = () => {
    if (inputVal.trim()) {
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
      setInputVal('')
    }
  }

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <section className="relative py-28 overflow-hidden bg-gradient-dark">
      {/* Orbs */}
      <div className="orb orb-purple absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-30" />
      <div className="orb orb-cyan   absolute top-0 right-0 w-96 h-96 opacity-20" />
      <div className="orb orb-pink   absolute bottom-0 left-0 w-80 h-80 opacity-15" />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-20" />

      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-purple to-transparent" />

      <div ref={ref} className="relative z-10 max-w-[1280px] mx-auto px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                             bg-white/10 border border-white/20 text-white text-sm font-semibold">
              <Zap size={14} className="text-brand-yellow" />
              Start Your Journey Today — It's Free
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6"
          >
            Ready to reach your{' '}
            <span className="gradient-text-ai">destination?</span>
          </motion.h2>

          {/* Sub-headline */}
          <motion.p
            variants={itemVariants}
            className="text-gray-400 text-lg leading-relaxed mb-12"
          >
            Enter the skill you want to master. We'll generate a personalized step-by-step
            roadmap — curated resources, real projects, and an AI mentor — all in one place.
          </motion.p>

          {/* Input + CTA */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="flex-1 flex items-center gap-3 bg-white/10 backdrop-blur-sm
                              rounded-2xl px-5 py-4 border border-white/15
                              focus-within:border-brand-purple/60 focus-within:bg-white/15
                              transition-all duration-200">
                <Sparkles size={18} className="text-brand-purple shrink-0" />
                <input
                  type="text"
                  placeholder='e.g. "I want to become a React Developer"'
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none
                             text-sm font-medium"
                />
              </div>
              <Button
                variant="gradient"
                size="lg"
                onClick={handleGenerate}
                iconRight={<ArrowRight size={18} />}
                className="shrink-0 whitespace-nowrap"
              >
                {submitted ? '✅ Generating...' : 'Generate Roadmap'}
              </Button>
            </div>
          </motion.div>

          {/* Popular skill chips */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 justify-center mb-12">
            <span className="text-xs text-gray-500 self-center">Popular:</span>
            {popularSkills.map(skill => (
              <motion.button
                key={skill}
                onClick={() => setInputVal(skill)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl
                           bg-white/8 border border-white/12 text-gray-300
                           hover:bg-brand-purple/25 hover:border-brand-purple/40 hover:text-white
                           transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {skill}
              </motion.button>
            ))}
          </motion.div>

          {/* Perks */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
            {perks.map(perk => (
              <div key={perk} className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle size={15} className="text-brand-mint shrink-0" />
                {perk}
              </div>
            ))}
          </motion.div>

          {/* Mentor divider */}
          <motion.div variants={itemVariants} className="pt-8 border-t border-white/10">
            <p className="text-sm text-gray-500 mb-4">Have expertise to share?</p>
            <motion.button
              onClick={handleBecomeMentor}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl
                         border-2 border-brand-purple/40 text-white font-bold text-sm
                         hover:bg-brand-purple/15 hover:border-brand-purple transition-all duration-200"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-xl">🏗️</span>
              Become a Mentor — Earn While You Teach
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Bottom social proof strip */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {[
            { val: '4.9/5',   label: 'Average Rating',    sub: 'from 12,000+ reviews' },
            { val: '94%',     label: 'Completion Rate',   sub: 'vs 13% industry avg'  },
            { val: '3.2x',    label: 'Faster to Hire',    sub: 'vs self-study'         },
            { val: '< 30s',   label: 'Roadmap Generated', sub: 'personalized for you'  },
          ].map(({ val, label, sub }) => (
            <div key={label} className="bg-white/6 backdrop-blur-sm rounded-3xl p-6 border border-white/10 text-center">
              <p className="text-3xl font-extrabold gradient-text mb-1">{val}</p>
              <p className="text-white font-bold text-sm mb-1">{label}</p>
              <p className="text-gray-500 text-xs">{sub}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
