import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, MessageCircle, Heart, Trophy, Flame } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeader from '../ui/SectionHeader'
import { liveNotifications } from '../../data/roadmaps'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

gsap.registerPlugin(ScrollTrigger)

const squadPreviews = [
  {
    name: 'Frontend Architect Squad',
    members: 1420, active: 38,
    module: 'Module 3 — React Hooks',
    color: '#7B61FF', emoji: '⚡', posts: 214,
  },
  {
    name: 'AI Engineering Squad',
    members: 2100, active: 67,
    module: 'Module 5 — RAG Pipelines',
    color: '#00F5A0', emoji: '🤖', posts: 390, isHot: true,
  },
  {
    name: 'UI/UX Mastery Squad',
    members: 940, active: 21,
    module: 'Module 2 — Design Systems',
    color: '#FF4DCA', emoji: '🎨', posts: 127,
  },
]

const avatarPositions = [
  { x: 50, y: 45, size: 52, color: '#7B61FF', initial: 'A', connected: true  },
  { x: 20, y: 20, size: 44, color: '#FF4DCA', initial: 'P', connected: true  },
  { x: 78, y: 18, size: 44, color: '#00F5A0', initial: 'M', connected: true  },
  { x: 15, y: 60, size: 38, color: '#00E5FF', initial: 'S', connected: false },
  { x: 82, y: 60, size: 38, color: '#F9FF38', initial: 'J', connected: false },
  { x: 38, y: 78, size: 38, color: '#7B61FF', initial: 'K', connected: false },
  { x: 65, y: 76, size: 34, color: '#FF4DCA', initial: 'R', connected: false },
]

function LiveToast({ notification, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-card-lg border border-brand-purple/10 px-4 py-3
                 flex items-center gap-3 max-w-xs"
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
        style={{ background: notification.color }}
      >
        {notification.avatar}
      </div>
      <div>
        <p className="text-xs font-bold text-brand-navy">{notification.name}</p>
        <p className="text-xs text-brand-gray leading-snug">
          {notification.action}{' '}
          <span className="text-brand-purple font-semibold">{notification.path}</span>
        </p>
      </div>
    </motion.div>
  )
}

export default function CommunitySection() {
  const { ref: scrollRef, inView } = useScrollAnimation()
  const [toasts, setToasts] = useState([])
  const toastIndex = useRef(0)
  const started = useRef(false)
  const sectionRef = useRef(null)
  const svgRef = useRef(null)

  // ── GSAP scroll reveals + SVG draw ─────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section header
      gsap.fromTo('.community-header',
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.community-header', start: 'top 88%', once: true },
        }
      )

      // ── SVG connection lines draw in ────────────────────────────────────
      // Lines use pathLength="1" strokeDasharray="1" so we only animate strokeDashoffset
      gsap.fromTo('.community-svg line',
        { strokeDashoffset: 1, opacity: 0 },
        {
          strokeDashoffset: 0, opacity: 1,
          duration: 1.4, stagger: 0.3, ease: 'power2.out',
          scrollTrigger: { trigger: '.community-constellation', start: 'top 80%', once: true },
        }
      )

      // ── Avatar nodes scale in with stagger ─────────────────────────────
      gsap.fromTo('.avatar-node',
        { scale: 0, autoAlpha: 0 },
        {
          scale: 1, autoAlpha: 1,
          duration: 0.55, stagger: 0.1, ease: 'back.out(1.8)',
          // clearProps so Framer Motion whileHover can take over scale
          clearProps: 'transform',
          scrollTrigger: { trigger: '.community-constellation', start: 'top 78%', once: true },
        }
      )

      // Center label
      gsap.fromTo('.community-center-label',
        { autoAlpha: 0, scale: 0.8 },
        {
          autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: '.community-constellation', start: 'top 75%', once: true },
        }
      )

      // ── Left constellation panel ────────────────────────────────────────
      gsap.fromTo('.community-left',
        { autoAlpha: 0, x: -50 },
        {
          autoAlpha: 1, x: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: '.community-left', start: 'top 82%', once: true },
        }
      )

      // ── Squad cards stagger from right ─────────────────────────────────
      gsap.fromTo('.squad-card',
        { autoAlpha: 0, x: 40 },
        {
          autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.14, ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: '.squad-cards', start: 'top 82%', once: true },
        }
      )

      // ── Bottom stat strip ───────────────────────────────────────────────
      gsap.fromTo('.community-stats-strip',
        { autoAlpha: 0, y: 25 },
        {
          autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: '.community-stats-strip', start: 'top 90%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Live toast notifications
  useEffect(() => {
    if (!inView || started.current) return
    started.current = true

    const show = () => {
      const notif = liveNotifications[toastIndex.current % liveNotifications.length]
      const id = Date.now()
      setToasts(prev => [...prev.slice(-2), { ...notif, id }])
      toastIndex.current++
    }

    show()
    const interval = setInterval(show, 3500)
    return () => clearInterval(interval)
  }, [inView])

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <section
      ref={sectionRef}
      id="community"
      className="relative py-28 bg-white overflow-hidden"
    >
      <div className="orb orb-pink absolute top-10 right-10 w-80 h-80 opacity-[0.08]" />
      <div className="orb orb-cyan absolute bottom-10 left-10 w-80 h-80 opacity-[0.07]" />

      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="community-header" style={{ opacity: 0 }}>
          <SectionHeader
            eyebrow="👥 Community"
            title="Don't Walk Your"
            highlight="Path Alone."
            description="Every roadmap has its own Squad. Chat with people at your exact same step, share resources, debug together, and build your professional network."
            className="mb-16"
          />
        </div>

        {/* scrollRef for toast autoplay */}
        <div ref={scrollRef} className="grid lg:grid-cols-2 gap-14 items-center">

          {/* ── Left: Avatar constellation ── */}
          <div className="community-left relative" style={{ opacity: 0 }}>
            <div className="community-constellation relative aspect-square max-w-[440px] mx-auto">
              {/* Dashed rotating rings */}
              <div className="absolute inset-8 rounded-full border-2 border-dashed border-brand-purple/15 animate-spin-slow" />
              <div className="absolute inset-16 rounded-full border border-brand-purple/10" />

              {/* ── SVG connection lines ── */}
              {/* Each line has pathLength="1" + strokeDasharray="1" so GSAP can draw them */}
              <svg
                ref={svgRef}
                className="community-svg absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {avatarPositions
                  .filter(a => a.connected)
                  .map((a, i) =>
                    avatarPositions.slice(i + 1).filter(b => b.connected).map(b => (
                      <line
                        key={`${a.initial}-${b.initial}`}
                        x1={`${a.x}%`} y1={`${a.y}%`}
                        x2={`${b.x}%`} y2={`${b.y}%`}
                        stroke="rgba(123,97,255,0.35)"
                        strokeWidth="0.6"
                        // pathLength="1" lets us animate strokeDashoffset 1→0 to "draw" the line
                        pathLength="1"
                        strokeDasharray="1"
                        strokeDashoffset="1"
                        style={{ opacity: 0 }}
                      />
                    ))
                  )}
              </svg>

              {/* Avatar nodes — GSAP handles entrance, Framer Motion handles hover */}
              {avatarPositions.map((av) => (
                <motion.div
                  key={av.initial}
                  className="avatar-node absolute rounded-full flex items-center justify-center
                             font-bold text-white text-sm cursor-pointer select-none"
                  style={{
                    left: `${av.x}%`,
                    top: `${av.y}%`,
                    width: av.size,
                    height: av.size,
                    background: av.color,
                    transform: 'translate(-50%,-50%) scale(0)', // start hidden for GSAP
                    boxShadow: av.connected ? `0 0 20px ${av.color}60` : 'none',
                    opacity: 0,
                  }}
                  whileHover={{ scale: 1.15 }}
                >
                  {av.initial}
                  <span
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                    style={{ background: av.connected ? '#00F5A0' : '#E5E7EB' }}
                  />
                </motion.div>
              ))}

              {/* Center label */}
              <div
                className="community-center-label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                            text-center pointer-events-none"
                style={{ opacity: 0 }}
              >
                <p className="text-2xl font-extrabold gradient-text">84K+</p>
                <p className="text-xs text-brand-gray">Learners Online</p>
              </div>
            </div>

            {/* Live toast notifications */}
            <div className="absolute bottom-4 right-0 flex flex-col gap-2 items-end z-20">
              <AnimatePresence>
                {toasts.map(toast => (
                  <LiveToast
                    key={toast.id}
                    notification={toast}
                    onClose={() => removeToast(toast.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right: Squad cards ── */}
          <div className="squad-cards flex flex-col gap-5">
            {squadPreviews.map((squad) => (
              <motion.div
                key={squad.name}
                className="squad-card bg-white rounded-3xl shadow-card border border-gray-100
                           p-5 cursor-pointer"
                style={{ opacity: 0 }}
                whileHover={{ y: -3, boxShadow: `0 24px 48px ${squad.color}20` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: `${squad.color}18` }}
                    >
                      {squad.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-bold text-brand-navy text-sm">{squad.name}</h4>
                        {squad.isHot && (
                          <span className="flex items-center gap-1 text-xs text-orange-600 font-bold">
                            <Flame size={11} fill="currentColor" /> Hot
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-brand-gray">{squad.module}</p>
                    </div>
                  </div>

                  <motion.button
                    className="shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold text-white"
                    style={{ background: squad.color }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Join
                  </motion.button>
                </div>

                <div className="flex items-center gap-5 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-brand-gray">
                    <Users size={12} />
                    <span className="font-semibold text-brand-navy">{squad.members.toLocaleString()}</span> members
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-gray">
                    <div className="w-2 h-2 rounded-full bg-brand-mint" />
                    <span className="font-semibold text-brand-navy">{squad.active}</span> online now
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-gray ml-auto">
                    <MessageCircle size={12} />
                    <span>{squad.posts} posts</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Bottom stat strip */}
            <div
              className="community-stats-strip bg-brand-lavender rounded-3xl p-5 flex items-center gap-8"
              style={{ opacity: 0 }}
            >
              {[
                { icon: Users,  val: '240+', label: 'Active Squads'   },
                { icon: Heart,  val: '1.8M', label: 'Peer Reviews'    },
                { icon: Trophy, val: '94%',  label: 'Completion Rate' },
              ].map(({ icon: Icon, val, label }) => (
                <div key={label} className="text-center flex-1">
                  <Icon size={18} className="text-brand-purple mx-auto mb-1.5" />
                  <p className="font-extrabold text-brand-navy">{val}</p>
                  <p className="text-xs text-brand-gray">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
