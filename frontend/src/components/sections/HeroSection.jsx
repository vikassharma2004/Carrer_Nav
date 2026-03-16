import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Play, Sparkles, ChevronRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from '../ui/Button'
import RoadmapNode, { NodeConnector } from '../ui/RoadmapNode'
import { useTypewriter } from '../../hooks/useTypewriter'
import { stats } from '../../data/roadmaps'

gsap.registerPlugin(ScrollTrigger)

const skillWords = [
  'React Developer',
  'AI Engineer',
  'UI/UX Designer',
  'Backend Architect',
  'Data Scientist',
  'DevOps Engineer',
]

const floatingTags = [
  { label: '🚀 12 Modules',       x: '8%',  y: '18%' },
  { label: '✅ Task Complete',     x: '82%', y: '12%' },
  { label: '🤖 AI Mentor Online', x: '78%', y: '72%' },
  { label: '🏆 Badge Earned',      x: '5%',  y: '70%' },
]

const miniNodes = [
  { step: '01', status: 'done',   label: 'Foundations',   time: '2h' },
  { step: '02', status: 'done',   label: 'Core Concepts', time: '4h' },
  { step: '03', status: 'active', label: 'Build Projects', time: '6h' },
  { step: '04', status: 'locked', label: 'Advanced',       time: '5h' },
  { step: '05', status: 'locked', label: 'Deploy & Ship',  time: '3h' },
]

export default function HeroSection() {
  const [searchInput, setSearchInput] = useState('')
  const { displayText } = useTypewriter(skillWords, 60, 1800, true)
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Entrance timeline ────────────────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo('.hero-eyebrow',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          0.1
        )
        .fromTo('.hero-headline',
          { autoAlpha: 0, y: 35 },
          { autoAlpha: 1, y: 0, duration: 0.75 },
          0.25
        )
        .fromTo('.hero-subtitle',
          { autoAlpha: 0, y: 25 },
          { autoAlpha: 1, y: 0, duration: 0.65 },
          0.45
        )
        .fromTo('.hero-cta',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          0.6
        )
        .fromTo('.hero-secondary',
          { autoAlpha: 0, y: 15 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
          0.75
        )
        // Right panel slides in from the right
        .fromTo('.hero-right',
          { autoAlpha: 0, x: 70 },
          { autoAlpha: 1, x: 0, duration: 1, ease: 'power2.out' },
          0.3
        )
        // Floating tags pop in with back-ease stagger
        .fromTo('.hero-tag',
          { autoAlpha: 0, scale: 0.7 },
          { autoAlpha: 1, scale: 1, duration: 0.45, stagger: 0.15, ease: 'back.out(1.7)' },
          0.85
        )

      // Stats row: scroll-triggered (below the fold on mobile)
      gsap.fromTo('.hero-stats-row',
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.hero-stats-row', start: 'top 90%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-gradient-hero"
    >
      {/* Dot grid */}
      <div className="dot-grid absolute inset-0 opacity-60" />

      {/* Ambient orbs */}
      <div className="orb orb-purple absolute top-10  left-1/4  w-[500px] h-[500px] opacity-30" />
      <div className="orb orb-cyan   absolute top-32  right-10  w-[350px] h-[350px] opacity-20" />
      <div className="orb orb-mint   absolute bottom-0 left-10  w-[400px] h-[400px] opacity-20" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Copy ── */}
          <div>
            {/* Eyebrow pill */}
            <div className="hero-eyebrow mb-6" style={{ opacity: 0 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                               bg-brand-purple/10 border border-brand-purple/25
                               text-brand-purple text-sm font-semibold">
                <Sparkles size={14} />
                Your 1:1 AI-Powered Learning Co-Pilot
                <ChevronRight size={14} />
              </span>
            </div>

            {/* Headline */}
            <h1
              className="hero-headline text-5xl lg:text-6xl xl:text-7xl font-extrabold text-brand-navy
                         leading-[1.08] tracking-tight mb-6"
              style={{ opacity: 0 }}
            >
              Stop Guessing.
              <br />
              <span className="gradient-text">Start Scaling.</span>
              <br />
              <span className="relative">
                Become a{' '}
                <span
                  className="text-brand-purple border-r-2 border-brand-purple pr-0.5"
                  aria-live="polite"
                >
                  {displayText}
                </span>
              </span>
            </h1>

            {/* Sub-headline */}
            <p
              className="hero-subtitle text-brand-gray text-lg leading-relaxed max-w-xl mb-10"
              style={{ opacity: 0 }}
            >
              Don't just watch videos.{' '}
              <strong className="text-brand-navy">Complete tasks, build real-world projects</strong>, and get
              24/7 AI mentorship on your journey from beginner to pro — all via a{' '}
              <strong className="text-brand-navy">step-by-step roadmap</strong>.
            </p>

            {/* Search / CTA row */}
            <div className="hero-cta flex flex-col sm:flex-row gap-3 mb-8" style={{ opacity: 0 }}>
              <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-5 py-3
                              shadow-card border border-brand-purple/15 focus-within:border-brand-purple
                              focus-within:shadow-glow transition-all duration-200">
                <Sparkles size={18} className="text-brand-purple shrink-0" />
                <input
                  type="text"
                  placeholder="Enter a skill (e.g. React, AI, UX...)"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1 bg-transparent text-brand-navy placeholder-brand-gray/60
                             font-medium text-sm outline-none"
                />
              </div>
              <Button
                variant="primary"
                size="lg"
                iconRight={<ArrowRight size={18} />}
                className="shrink-0"
              >
                Find My Roadmap
              </Button>
            </div>

            {/* Secondary CTA */}
            <div className="hero-secondary flex items-center gap-4" style={{ opacity: 0 }}>
              <button className="flex items-center gap-2 text-brand-gray hover:text-brand-purple transition-colors group">
                <span className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center
                                 group-hover:bg-brand-purple group-hover:shadow-glow transition-all duration-200">
                  <Play size={14} className="text-brand-purple group-hover:text-white ml-0.5" fill="currentColor" />
                </span>
                <span className="text-sm font-semibold">Watch How it Works</span>
              </button>
              <span className="text-gray-300">|</span>
              <p className="text-sm text-brand-gray">
                <span className="font-bold text-brand-navy">84,000+</span> learners building their future
              </p>
            </div>
          </div>

          {/* ── Right: Mini Roadmap Graphic ── */}
          <div className="hero-right relative hidden lg:flex justify-center" style={{ opacity: 0 }}>
            {/* Main card */}
            <div className="relative bg-white rounded-3xl shadow-card-lg p-8 w-[380px]
                           border border-brand-purple/10 animate-float">
              {/* Card header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-mono text-brand-purple font-medium mb-1">
                    path_01 / frontend_architect
                  </p>
                  <h3 className="font-extrabold text-brand-navy text-lg">Frontend Architect</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center
                                shadow-card text-2xl">
                  ⚡
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-medium mb-2">
                  <span className="text-brand-gray">Progress</span>
                  <span className="text-brand-purple font-bold">40%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[40%] bg-gradient-brand rounded-full
                                  shadow-[0_0_8px_rgba(123,97,255,0.5)]" />
                </div>
              </div>

              {/* Roadmap nodes */}
              <div className="flex flex-col items-center gap-0">
                {miniNodes.map((node, i) => (
                  <div key={node.step} className="flex flex-col items-center">
                    <div className="flex items-center gap-4 w-full">
                      <RoadmapNode step={node.step} status={node.status} label={node.label} size={44} />
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${node.status === 'locked' ? 'text-brand-gray' : 'text-brand-navy'}`}>
                          {node.label}
                        </p>
                        <p className="text-xs font-mono text-brand-gray">{`est_time: ${node.time}`}</p>
                      </div>
                      {node.status === 'done' && (
                        <span className="text-xs font-semibold text-brand-mint bg-brand-mint/10
                                         px-2 py-0.5 rounded-full border border-brand-mint/20">
                          Done
                        </span>
                      )}
                      {node.status === 'active' && (
                        <span className="text-xs font-semibold text-brand-purple bg-brand-purple/10
                                         px-2 py-0.5 rounded-full border border-brand-purple/20 animate-pulse">
                          Active
                        </span>
                      )}
                    </div>
                    {i < miniNodes.length - 1 && (
                      <div className="ml-5 my-1">
                        <NodeConnector direction="vertical" done={node.status === 'done'} length={28} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom stats */}
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-lg font-extrabold text-brand-navy">12</p>
                  <p className="text-xs text-brand-gray">Modules</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-extrabold text-brand-navy">4</p>
                  <p className="text-xs text-brand-gray">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-extrabold text-brand-navy">6mo</p>
                  <p className="text-xs text-brand-gray">Duration</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-extrabold gradient-text">4.9★</p>
                  <p className="text-xs text-brand-gray">Rating</p>
                </div>
              </div>
            </div>

            {/* Floating tags */}
            {floatingTags.map(({ label, x, y }) => (
              <div
                key={label}
                className="hero-tag absolute glass rounded-2xl px-3 py-2 text-xs font-semibold
                           text-brand-navy shadow-card border border-brand-purple/10 whitespace-nowrap"
                style={{ left: x, top: y, opacity: 0 }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Stats row ── */}
        <div
          className="hero-stats-row mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          style={{ opacity: 0 }}
        >
          {stats.map(({ label, value, icon }) => (
            <div key={label} className="glass rounded-2xl px-6 py-5 text-center">
              <p className="text-2xl mb-1">{icon}</p>
              <p className="text-2xl font-extrabold gradient-text">{value}</p>
              <p className="text-sm text-brand-gray mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
