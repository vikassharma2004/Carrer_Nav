import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Award, Flame, Star, Clock, CheckSquare, Layers, Code2 } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeader from '../ui/SectionHeader'
import ProgressBar from '../ui/ProgressBar'

gsap.registerPlugin(ScrollTrigger)

const learnerStats = [
  { label: 'Roadmap Completed',    value: 75, color: '#7B61FF', icon: Layers      },
  { label: 'Tasks Completed',       value: 88, color: '#00F5A0', icon: CheckSquare },
  { label: 'AI Sessions This Week', value: 60, color: '#00E5FF', icon: Star        },
  { label: 'Community Engagement',  value: 45, color: '#FF4DCA', icon: TrendingUp  },
]

const weeklyActivity = [
  { day: 'Mon', hours: 1.5 },
  { day: 'Tue', hours: 2.5 },
  { day: 'Wed', hours: 1.0 },
  { day: 'Thu', hours: 3.5 },
  { day: 'Fri', hours: 2.0 },
  { day: 'Sat', hours: 4.0 },
  { day: 'Sun', hours: 1.5 },
]
const maxHours = Math.max(...weeklyActivity.map(d => d.hours))

const badges = [
  { emoji: '⚡', label: 'React Core',   unlocked: true,  color: '#7B61FF' },
  { emoji: '🛠️', label: 'Builder',      unlocked: true,  color: '#FF4DCA' },
  { emoji: '🔥', label: '7-Day Streak', unlocked: true,  color: '#F97316' },
  { emoji: '🤖', label: 'AI Whiz',      unlocked: false, color: '#00E5FF' },
  { emoji: '🏆', label: 'Top 10%',      unlocked: false, color: '#F9FF38' },
  { emoji: '🌟', label: 'Mentor Fav',   unlocked: false, color: '#00F5A0' },
]

const leaderboardEntries = [
  { rank: 1, name: 'Priya K.',  xp: 4820, avatar: 'P', color: '#FF4DCA', badge: '🔥' },
  { rank: 2, name: 'Marcus T.', xp: 4610, avatar: 'M', color: '#00F5A0', badge: '⚡' },
  { rank: 3, name: 'Alex R.',   xp: 4430, avatar: 'A', color: '#7B61FF', badge: '🛠️' },
  { rank: 8, name: 'You',       xp: 3920, avatar: 'Y', color: '#00E5FF', isYou: true  },
]

export default function ProgressSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section header
      gsap.fromTo('.progress-header',
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.progress-header', start: 'top 88%', once: true },
        }
      )

      // Bento grid cards: stagger in from bottom
      gsap.fromTo('.bento-card',
        { autoAlpha: 0, y: 45 },
        {
          autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.progress-bento', start: 'top 80%', once: true },
        }
      )

      // XP bar animates after cards are visible
      gsap.fromTo('.xp-bar-fill',
        { width: '0%' },
        {
          width: '72%', duration: 1.6, ease: 'power2.out',
          scrollTrigger: { trigger: '.xp-bar-fill', start: 'top 85%', once: true },
        }
      )

      // Bar chart columns scaleY from bottom
      gsap.fromTo('.activity-bar',
        { scaleY: 0, transformOrigin: 'bottom' },
        {
          scaleY: 1, duration: 0.55, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: '.activity-chart', start: 'top 82%', once: true },
        }
      )

      // Badge grid items pop in
      gsap.fromTo('.badge-item',
        { autoAlpha: 0, scale: 0.75 },
        {
          autoAlpha: 1, scale: 1, duration: 0.45, stagger: 0.08, ease: 'back.out(1.6)',
          clearProps: 'transform',
          scrollTrigger: { trigger: '.badges-grid', start: 'top 85%', once: true },
        }
      )

      // Leaderboard rows slide in
      gsap.fromTo('.leaderboard-row',
        { autoAlpha: 0, x: 30 },
        {
          autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.leaderboard-list', start: 'top 85%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-28 bg-brand-lavender overflow-hidden">
      <div className="orb orb-purple absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.07]" />
      <div className="orb orb-mint  absolute bottom-0 left-0 w-96 h-96 opacity-[0.06]" />

      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="progress-header" style={{ opacity: 0 }}>
          <SectionHeader
            eyebrow="📊 Progress Tracking"
            title="Your Journey,"
            highlight="Quantified."
            description="A dashboard that turns abstract 'learning' into concrete, measurable progress. See exactly how far you've come and what's next on your path."
            className="mb-16"
          />
        </div>

        {/* Bento grid */}
        <div className="progress-bento grid grid-cols-12 gap-5">

          {/* ── Profile card ── */}
          <div
            className="bento-card col-span-12 md:col-span-4 bg-brand-navy rounded-3xl p-6
                       relative overflow-hidden"
            style={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(123,97,255,0.4),transparent_60%)]" />
            <div className="relative z-10">
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-brand flex items-center
                              justify-center text-2xl font-extrabold text-white mb-4 shadow-glow">
                JS
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-mint
                                 border-2 border-brand-navy flex items-center justify-center">
                  <Flame size={10} className="text-brand-navy" />
                </span>
              </div>

              <h3 className="text-white font-extrabold text-lg mb-0.5">Jamie Solano</h3>
              <p className="text-brand-cyan text-sm font-mono mb-4">path: frontend_architect</p>

              {/* XP bar — GSAP animates the fill width */}
              <div className="mb-5">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400">Level 7 — Pro</span>
                  <span className="text-brand-purple font-bold">3,920 XP</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="xp-bar-fill h-full rounded-full bg-gradient-brand"
                    style={{ width: 0, boxShadow: '0 0 8px rgba(123,97,255,0.6)' }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">580 XP to Level 8</p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: CheckSquare, val: '12',    label: 'Tasks Done',  color: '#00F5A0' },
                  { icon: Code2,       val: '3',     label: 'Projects',    color: '#7B61FF' },
                  { icon: Flame,       val: '7',     label: 'Day Streak',  color: '#F97316' },
                  { icon: TrendingUp,  val: 'Top 10%',label: 'This Week',  color: '#F9FF38' },
                ].map(({ icon: Icon, val, label, color }) => (
                  <div key={label} className="bg-white/8 rounded-2xl p-3">
                    <Icon size={14} style={{ color }} className="mb-1.5" />
                    <p className="text-white font-extrabold text-sm">{val}</p>
                    <p className="text-gray-400 text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Skill progress bars ── */}
          <div
            className="bento-card col-span-12 md:col-span-4 bg-white rounded-3xl p-6 shadow-card"
            style={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-brand-navy">Skill Progress</h3>
              <span className="text-xs font-mono text-brand-purple bg-brand-purple/10 px-2 py-1 rounded-lg">
                This Month
              </span>
            </div>
            <div className="flex flex-col gap-5">
              {learnerStats.map(({ label, value, color, icon: Icon }) => (
                <div key={label}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={13} style={{ color }} />
                    <span className="text-sm font-medium text-brand-navy">{label}</span>
                  </div>
                  <ProgressBar value={value} color={color} height={7} showValue animate />
                </div>
              ))}
            </div>
          </div>

          {/* ── Activity chart ── */}
          <div
            className="bento-card col-span-12 md:col-span-4 bg-white rounded-3xl p-6 shadow-card"
            style={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-brand-navy">Weekly Activity</h3>
              <div className="flex items-center gap-1.5 text-sm text-brand-gray">
                <Clock size={13} />
                <span className="font-semibold text-brand-navy">16h</span> this week
              </div>
            </div>

            <div className="activity-chart flex items-end justify-between gap-2 h-28">
              {weeklyActivity.map(({ day, hours }) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="activity-bar w-full rounded-xl"
                    style={{
                      height: `${(hours / maxHours) * 100}%`,
                      minHeight: 4,
                      transformOrigin: 'bottom',
                      background: day === 'Sat'
                        ? 'linear-gradient(135deg,#7B61FF,#00E5FF)'
                        : '#F3F0FF',
                    }}
                  />
                  <span className="text-xs font-medium text-brand-gray">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Badges ── */}
          <div
            className="bento-card col-span-12 md:col-span-6 bg-white rounded-3xl p-6 shadow-card"
            style={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-brand-navy">Badges Earned</h3>
              <span className="text-xs text-brand-gray">3/6 unlocked</span>
            </div>
            <div className="badges-grid grid grid-cols-3 gap-3">
              {badges.map(({ emoji, label, unlocked, color }) => (
                <motion.div
                  key={label}
                  className={`badge-item flex flex-col items-center gap-2 p-4 rounded-2xl
                    ${unlocked
                      ? 'bg-white border-2 shadow-card'
                      : 'bg-gray-50 border-2 border-gray-100 opacity-40 grayscale'
                    }`}
                  style={{ borderColor: unlocked ? color : undefined, opacity: 0 }}
                  whileHover={unlocked ? { scale: 1.05, y: -2 } : {}}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-xs font-semibold text-brand-navy text-center">{label}</span>
                  {unlocked && (
                    <span className="text-[10px] font-bold rounded-full px-2 py-0.5 text-white"
                          style={{ background: color }}>
                      Earned
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Leaderboard ── */}
          <div
            className="bento-card col-span-12 md:col-span-6 bg-white rounded-3xl p-6 shadow-card"
            style={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-brand-navy">Squad Leaderboard</h3>
              <span className="text-xs font-mono text-brand-purple bg-brand-purple/10 px-2 py-1 rounded-lg">
                This Week
              </span>
            </div>
            <div className="leaderboard-list flex flex-col gap-3">
              {leaderboardEntries.map(({ rank, name, xp, avatar, color, badge, isYou }) => (
                <div
                  key={rank}
                  className={`leaderboard-row flex items-center gap-4 p-3 rounded-2xl
                    ${isYou ? 'bg-brand-purple/8 border border-brand-purple/20' : 'bg-gray-50'}`}
                  style={{ opacity: 0 }}
                >
                  <span className={`w-7 text-center font-extrabold text-sm
                    ${rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400'
                    : rank === 3 ? 'text-orange-400' : 'text-brand-gray'}`}>
                    #{rank}
                  </span>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white
                               font-bold text-sm shrink-0"
                    style={{ background: color }}
                  >
                    {avatar}
                  </div>
                  <span className={`flex-1 text-sm font-semibold ${isYou ? 'text-brand-purple' : 'text-brand-navy'}`}>
                    {name} {isYou && <span className="text-xs text-brand-gray font-normal">(you)</span>}
                  </span>
                  <span className="text-sm font-extrabold text-brand-navy">{xp.toLocaleString()} XP</span>
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
