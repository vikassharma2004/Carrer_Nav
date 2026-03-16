import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Users, Clock, Layers, ArrowRight, Sparkles, Flame } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeader from '../ui/SectionHeader'
import Badge from '../ui/Badge'
import { featuredRoadmaps, roadmapCategories } from '../../data/roadmaps'

gsap.registerPlugin(ScrollTrigger)

function RoadmapCard({ roadmap, index }) {
  return (
    <motion.div
      layout
      className="roadmap-card bg-white rounded-3xl shadow-card border border-gray-100
                 overflow-hidden cursor-pointer group"
      // Entrance is handled by GSAP — Framer Motion only handles hover
      style={{ opacity: 0 }}
      whileHover={{ y: -6, boxShadow: `0 32px 64px ${roadmap.color}22` }}
    >
      {/* Top gradient banner */}
      <div
        className="h-2 w-full"
        style={{ background: `linear-gradient(90deg,${roadmap.color},${roadmap.accent})` }}
      />

      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: `${roadmap.color}18` }}
          >
            {roadmap.icon}
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            {roadmap.isNew && <Badge variant="new">✨ New</Badge>}
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={13} fill="currentColor" />
              <span className="text-sm font-bold text-brand-navy">{roadmap.rating}</span>
            </div>
          </div>
        </div>

        <h3 className="font-extrabold text-brand-navy text-lg leading-snug mb-1
                       group-hover:text-brand-purple transition-colors">
          {roadmap.title}
        </h3>
        <p className="text-brand-gray text-sm mb-4 leading-relaxed">{roadmap.subtitle}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {roadmap.tags.map(tag => (
            <span
              key={tag}
              className="text-xs font-semibold px-2.5 py-1 rounded-xl border"
              style={{
                background: `${roadmap.color}12`,
                color: roadmap.color,
                borderColor: `${roadmap.color}30`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-brand-gray mb-5 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <Layers size={12} />
            <span><strong className="text-brand-navy">{roadmap.modules}</strong> modules</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} />
            <span><strong className="text-brand-navy">{roadmap.projects}</strong> projects</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Clock size={12} />
            <span>{roadmap.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-brand-gray">
            <Users size={12} />
            <span><strong className="text-brand-navy">{roadmap.students}</strong> enrolled</span>
          </div>
          <motion.button
            className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl
                       text-white transition-all"
            style={{ background: roadmap.color }}
            whileHover={{ scale: 1.05, boxShadow: `0 8px 20px ${roadmap.color}50` }}
            whileTap={{ scale: 0.97 }}
          >
            Start Path
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function RoadmapLibrary() {
  const [activeCategory, setActiveCategory] = useState('all')
  const sectionRef = useRef(null)
  const gridRef = useRef(null)

  const displayed = featuredRoadmaps

  // ── GSAP scroll reveals ──────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo('.roadmap-header',
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.roadmap-header', start: 'top 88%', once: true },
        }
      )

      // Category filter tabs
      gsap.fromTo('.roadmap-filters',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: '.roadmap-filters', start: 'top 90%', once: true },
        }
      )

      // Cards stagger in — clearProps so Framer Motion whileHover(y) isn't blocked
      gsap.fromTo('.roadmap-card',
        { autoAlpha: 0, y: 50, scale: 0.97 },
        {
          autoAlpha: 1, y: 0, scale: 1,
          duration: 0.6, stagger: 0.1, ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: '.roadmap-grid', start: 'top 82%', once: true },
        }
      )

      // CTA at bottom
      gsap.fromTo('.roadmap-cta',
        { autoAlpha: 0, y: 25 },
        {
          autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: '.roadmap-cta', start: 'top 92%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="roadmaps" className="relative py-28 bg-white overflow-hidden">
      <div className="orb orb-purple absolute bottom-20 right-0 w-96 h-96 opacity-[0.06]" />

      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="roadmap-header" style={{ opacity: 0 }}>
          <SectionHeader
            eyebrow="🗺️ Roadmap Library"
            title="Pick your"
            highlight="path."
            description="24 expert-crafted roadmaps across every major tech domain. Each one is a complete, structured journey — not just a list of links."
            className="mb-10"
          />
        </div>

        {/* Category filter tabs */}
        <div className="roadmap-filters flex flex-wrap gap-2 justify-center mb-12" style={{ opacity: 0 }}>
          {roadmapCategories.map(({ id, label, count }) => (
            <motion.button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200
                ${activeCategory === id
                  ? 'bg-brand-purple text-white shadow-glow'
                  : 'bg-brand-lavender text-brand-gray hover:bg-brand-purple/10 hover:text-brand-purple'
                }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {label}
              <span className={`ml-1.5 text-xs font-mono ${activeCategory === id ? 'opacity-80' : 'text-brand-gray'}`}>
                {count}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Cards grid */}
        <div ref={gridRef} className="roadmap-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {displayed.map((roadmap, i) => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <div className="roadmap-cta mt-14 text-center" style={{ opacity: 0 }}>
          <p className="text-brand-gray mb-4">
            Showing 6 of <strong className="text-brand-navy">24 roadmaps</strong>
          </p>
          <motion.button
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-brand-purple
                       text-brand-purple font-bold hover:bg-brand-purple hover:text-white transition-all duration-200"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Flame size={16} />
            Browse All 24 Roadmaps
          </motion.button>
        </div>
      </div>
    </section>
  )
}
