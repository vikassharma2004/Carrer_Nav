import { useNavigate } from 'react-router-dom'
import { motion }      from 'framer-motion'
import { ArrowRight, Star, DollarSign, Users, Zap } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import useAuthStore from '../../store/useAuthStore'

const MENTOR_STATS = [
  { icon: Users,       val: '1,200+',  label: 'Active Mentors'   },
  { icon: Star,        val: '4.9/5',   label: 'Avg Rating'       },
  { icon: DollarSign,  val: '$4.8k',   label: 'Avg Monthly Earn' },
  { icon: Zap,         val: '94%',     label: 'Satisfaction'     },
]

const FLOATERS = [
  { text: '🏆 Mentor of the Month',  x: '5%',  y: '12%', delay: 0    },
  { text: '💰 $12k earned this month', x: '72%', y: '8%',  delay: 0.3  },
  { text: '🌟 5-star review',         x: '78%', y: '78%', delay: 0.6  },
  { text: '🚀 14 learners enrolled',  x: '3%',  y: '80%', delay: 0.9  },
]

export default function MentorCTASection() {
  const { ref, inView }        = useScrollAnimation()
  const navigate               = useNavigate()
  const { isAuthenticated }    = useAuthStore()

  const handleClick = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('mentorIntent', 'apply')
      navigate('/auth/signup')
    } else {
      navigate('/mentor/apply')
    }
  }

  return (
    <section className="relative py-28 overflow-hidden bg-gradient-dark" ref={ref}>
      {/* Mesh blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(123,97,255,0.30),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(0,229,255,0.18),transparent_55%)]" />
      <div className="orb orb-pink   absolute bottom-0 left-1/4  w-80 h-80 opacity-15" />
      <div className="dot-grid absolute inset-0 opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-purple to-transparent" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Copy ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                             bg-brand-purple/20 border border-brand-purple/30
                             text-brand-purple text-sm font-semibold mb-6">
              🗺️ Become a Mentor
            </span>

            <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
              Shape the next<br />
              <span className="gradient-text-ai">generation</span> of{' '}
              <span className="gradient-text">developers.</span>
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">
              Teach, guide, and build roadmaps that change careers. Join 1,200+ mentors
              earning while doing what they love — sharing knowledge.
            </p>

            <motion.button
              onClick={handleClick}
              className="inline-flex items-center gap-3 px-9 py-5 rounded-2xl
                         bg-gradient-brand text-white font-extrabold text-base
                         shadow-glow hover:shadow-card-lg
                         transition-all duration-300"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-xl">🏗️</span>
              Become a Mentor
              <ArrowRight size={18} />
            </motion.button>

            <p className="mt-4 text-sm text-gray-500">
              Free application · 24–48h review · No exclusivity
            </p>
          </motion.div>

          {/* ── Right: Visual card ── */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2 }}
          >
            {/* Floating labels */}
            {FLOATERS.map(({ text, x, y, delay }) => (
              <motion.div
                key={text}
                className="absolute z-10 bg-white/10 backdrop-blur-sm border border-white/15
                           rounded-2xl px-3 py-2 text-white text-xs font-semibold whitespace-nowrap"
                style={{ left: x, top: y }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: delay + 0.8, type: 'spring', stiffness: 220 }}
              >
                {text}
              </motion.div>
            ))}

            {/* Card */}
            <div className="relative bg-white/8 backdrop-blur-sm border border-white/12
                            rounded-3xl p-8 animate-float">
              {/* Mentor avatar cluster */}
              <div className="flex items-center gap-2 mb-6">
                {['AK', 'SR', 'MJ', 'PL', 'YT'].map((initials, i) => (
                  <div
                    key={initials}
                    className="w-10 h-10 rounded-xl flex items-center justify-center
                               text-white font-bold text-xs -ml-2 first:ml-0
                               border-2 border-[rgba(29,29,46,0.8)]"
                    style={{
                      background: ['#7B61FF','#FF4DCA','#00F5A0','#00E5FF','#F9FF38'][i],
                      zIndex: 5 - i,
                    }}
                  >
                    {initials}
                  </div>
                ))}
                <span className="text-white text-sm font-bold ml-3">+1,195 mentors</span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {MENTOR_STATS.map(({ icon: Icon, val, label }) => (
                  <div key={label} className="bg-white/8 rounded-2xl p-4">
                    <Icon size={16} className="text-brand-purple mb-2" />
                    <p className="text-2xl font-extrabold gradient-text">{val}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="border-t border-white/10 pt-5">
                <p className="text-gray-400 text-sm leading-relaxed italic mb-3">
                  "I went from side-project contributor to full-time mentor earning $7k/month.
                  CareerNav made it possible."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-pink flex items-center justify-center text-white text-xs font-bold">
                    SR
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">Sofia Ramirez</p>
                    <p className="text-gray-500 text-[10px]">UI/UX Mentor · 243 learners</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} size={11} fill="#F9FF38" className="text-brand-yellow" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
