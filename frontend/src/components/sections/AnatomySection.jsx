import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Target, ShieldCheck, ChevronDown, Play, FileText, Code2, Layers } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeader from '../ui/SectionHeader'

gsap.registerPlugin(ScrollTrigger)

const pillars = [
  {
    id: 'resources',
    icon: BookOpen,
    emoji: '📚',
    color: '#7B61FF',
    colorBg: 'rgba(123,97,255,0.08)',
    title: 'Module & Resources',
    subtitle: 'Curated content from the best of the web',
    description:
      'Each roadmap module bundles the highest-quality articles, videos, and docs — hand-picked and ordered so you learn the right thing at the right time. No more tab-hoarding.',
    features: [
      { icon: Play,     label: 'Video Lessons',    count: '40+ per module' },
      { icon: FileText, label: 'Reading Guides',   count: 'Concise summaries' },
      { icon: Code2,    label: 'Code Playgrounds', count: 'Hands-on practice' },
    ],
    expandedContent: [
      { tag: 'Video',   title: 'React Hooks Deep Dive',   time: '14 min', type: 'video'   },
      { tag: 'Article', title: 'Understanding useEffect', time: '8 min',  type: 'article' },
      { tag: 'Task',    title: 'Build a Counter App',      time: '1 hr',   type: 'task'    },
    ],
  },
  {
    id: 'tasks',
    icon: Target,
    emoji: '🎯',
    color: '#FF4DCA',
    colorBg: 'rgba(255,77,202,0.08)',
    title: 'Tasks & Projects',
    subtitle: "Don't just learn. Build to prove your skills.",
    description:
      "Every module ends with real-world tasks and a capstone project. These aren't toy exercises — they're portfolio-worthy work you can ship and show hiring managers.",
    features: [
      { icon: Layers,  label: 'Guided Tasks',      count: '3–5 per module' },
      { icon: Code2,   label: 'Capstone Projects', count: 'Portfolio-ready'  },
      { icon: Target,  label: 'Skill Challenges',  count: 'Beat the leaderboard' },
    ],
    expandedContent: [
      { tag: 'Task',     title: 'Build a REST API',       time: '3 hr', type: 'task'    },
      { tag: 'Project',  title: 'Full-Stack Auth System', time: '6 hr', type: 'project' },
      { tag: 'Challenge',title: 'Optimize for 100ms',     time: '2 hr', type: 'task'    },
    ],
  },
  {
    id: 'validation',
    icon: ShieldCheck,
    emoji: '✅',
    color: '#00F5A0',
    colorBg: 'rgba(0,245,160,0.08)',
    title: 'Validation',
    subtitle: 'Automated checks or Mentor reviews to move forward',
    description:
      'Progress is gated — you earn the right to advance. Automated test suites verify your code, while optional mentor reviews give you expert human feedback.',
    features: [
      { icon: ShieldCheck, label: 'Auto Test Runner', count: 'Instant feedback'    },
      { icon: Target,      label: 'Mentor Review',    count: 'Expert eyes on code' },
      { icon: BookOpen,    label: 'Skill Badges',     count: 'Verified credentials' },
    ],
    expandedContent: [
      { tag: 'Auto',   title: 'Unit Tests Passed: 12/12',     time: 'Instant', type: 'check'  },
      { tag: 'Review', title: 'Mentor Feedback Received',     time: '24h',     type: 'review' },
      { tag: 'Badge',  title: 'React Core Badge Unlocked 🏆', time: 'Now',     type: 'badge'  },
    ],
  },
]

const typeColors = {
  video:   '#7B61FF',
  article: '#00E5FF',
  task:    '#FF4DCA',
  project: '#F9FF38',
  check:   '#00F5A0',
  review:  '#7B61FF',
  badge:   '#F9FF38',
}

export default function AnatomySection() {
  const [active, setActive] = useState(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section header fades in
      gsap.fromTo('.anatomy-header',
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.anatomy-header', start: 'top 88%', once: true },
        }
      )

      // Pillar cards stagger up — opacity only so Framer Motion hover (y) doesn't conflict
      gsap.fromTo('.pillar-card',
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
          // clearProps:'transform' releases the y so Framer Motion hover takes over cleanly
          clearProps: 'transform',
          scrollTrigger: { trigger: '.anatomy-cards', start: 'top 82%', once: true },
        }
      )

      // Bottom connector
      gsap.fromTo('.anatomy-connector',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: '.anatomy-connector', start: 'top 90%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative py-28 bg-white overflow-hidden"
    >
      {/* Subtle bg orb */}
      <div className="orb orb-purple absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[700px] h-[700px] opacity-[0.04]" />

      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header — GSAP reveals this */}
        <div className="anatomy-header" style={{ opacity: 0 }}>
          <SectionHeader
            eyebrow="🗺️ How it Works"
            title="A Roadmap is more than"
            highlight="a list. It's an ecosystem."
            description="Three pillars work together to take you from 'I want to learn X' to 'I built X and got hired for X' — no detours."
            className="mb-16"
          />
        </div>

        {/* Three pillar cards — GSAP staggers, Framer Motion handles hover */}
        <div className="anatomy-cards grid md:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const isActive = active === pillar.id
            return (
              <motion.div
                key={pillar.id}
                className="pillar-card bg-white rounded-3xl shadow-card border border-gray-100
                           overflow-hidden cursor-pointer"
                style={{
                  opacity: 0,
                  boxShadow: isActive ? `0 24px 48px ${pillar.color}22` : undefined,
                }}
                // Framer Motion handles ONLY the hover lift (no scroll animation here)
                whileHover={{ y: -4, boxShadow: `0 32px 64px ${pillar.color}20` }}
                onClick={() => setActive(isActive ? null : pillar.id)}
              >
                {/* Top accent */}
                <div className="h-1.5 w-full" style={{ background: pillar.color }} />

                <div className="p-7">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                    style={{ background: pillar.colorBg }}
                  >
                    {pillar.emoji}
                  </div>

                  <h3 className="text-xl font-extrabold text-brand-navy mb-2">{pillar.title}</h3>
                  <p className="text-sm font-semibold mb-3" style={{ color: pillar.color }}>
                    {pillar.subtitle}
                  </p>
                  <p className="text-brand-gray text-sm leading-relaxed mb-6">
                    {pillar.description}
                  </p>

                  {/* Feature pills */}
                  <div className="flex flex-col gap-2 mb-5">
                    {pillar.features.map(({ icon: FIcon, label, count }) => (
                      <div key={label} className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: pillar.colorBg }}
                        >
                          <FIcon size={13} style={{ color: pillar.color }} />
                        </div>
                        <span className="text-sm text-brand-navy font-medium">{label}</span>
                        <span className="ml-auto text-xs text-brand-gray font-mono">{count}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expand toggle */}
                  <button
                    className="flex items-center gap-2 text-sm font-semibold transition-colors"
                    style={{ color: pillar.color }}
                  >
                    See example
                    <motion.span animate={{ rotate: isActive ? 180 : 0 }}>
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>

                  {/* Expanded content — Framer Motion AnimatePresence */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 flex flex-col gap-2">
                          {pillar.expandedContent.map(({ tag, title, time, type }) => (
                            <div
                              key={title}
                              className="flex items-center gap-3 bg-brand-lavender rounded-2xl px-4 py-3"
                            >
                              <span
                                className="text-xs font-bold px-2 py-0.5 rounded-lg text-white"
                                style={{ background: typeColors[type] }}
                              >
                                {tag}
                              </span>
                              <span className="flex-1 text-sm font-medium text-brand-navy">{title}</span>
                              <span className="text-xs font-mono text-brand-gray">{time}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom connector flow */}
        <div className="anatomy-connector mt-16 flex justify-center" style={{ opacity: 0 }}>
          <div className="flex items-center gap-0">
            {['Learn', 'Build', 'Validate', 'Advance'].map((step, i) => (
              <div key={step} className="flex items-center">
                <div className={`px-5 py-2.5 rounded-2xl text-sm font-bold border
                  ${i === 0 ? 'bg-brand-purple text-white border-brand-purple shadow-glow'
                  : i === 1 ? 'bg-brand-pink/10 text-brand-pink border-brand-pink/30'
                  : i === 2 ? 'bg-brand-mint/10 text-emerald-700 border-brand-mint/40'
                  : 'bg-brand-yellow/20 text-yellow-700 border-brand-yellow/50'}`}>
                  {step}
                </div>
                {i < 3 && (
                  <div className="w-8 h-0.5 bg-gradient-to-r from-brand-purple/30 to-brand-purple/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
