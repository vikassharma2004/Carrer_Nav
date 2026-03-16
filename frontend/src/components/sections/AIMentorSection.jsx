import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Zap, Brain, MessageSquare } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeader from '../ui/SectionHeader'
import Badge from '../ui/Badge'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

gsap.registerPlugin(ScrollTrigger)

const featurePills = [
  { icon: Zap,           label: 'Instant Debugging',      color: '#7B61FF' },
  { icon: Brain,         label: 'Personalized Summaries', color: '#00E5FF' },
  { icon: MessageSquare, label: '24/7 Career Advice',     color: '#00F5A0' },
  { icon: Sparkles,      label: 'Code Explanations',      color: '#FF4DCA' },
]

const demoConversation = [
  {
    role: 'user',
    text: "I'm stuck on this useEffect cleanup function. Why does it run twice in dev mode?",
    delay: 0,
  },
  {
    role: 'ai',
    text: "Great question! In React 18 Strict Mode (dev only), useEffect runs twice intentionally — it mounts, unmounts, then mounts again to help you catch bugs in cleanup logic. This only happens in development.\n\nThe fix: make sure your cleanup function reverses every side effect:",
    delay: 1200,
    code: `useEffect(() => {
  const sub = subscribe(userId);   // side effect
  return () => sub.unsubscribe();  // cleanup ← must undo it
}, [userId]);`,
  },
  {
    role: 'user',
    text: 'Oh! So in production it only runs once?',
    delay: 4000,
  },
  {
    role: 'ai',
    text: "Exactly! In production it runs once per mount. The double-invocation is purely a dev-mode safety net. If your code breaks with double calls, you've found a cleanup bug — which is the whole point. You're on the right track! 🎉",
    delay: 5200,
  },
]

function ChatMessage({ message, visible }) {
  const isAI = message.role === 'ai'
  if (!visible) return null

  return (
    <motion.div
      className={`flex gap-3 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1
        ${isAI ? 'bg-gradient-ai shadow-glow' : 'bg-brand-navy'}`}>
        {isAI ? <Bot size={15} className="text-white" /> : <User size={15} className="text-white" />}
      </div>

      <div className={`max-w-[78%] ${isAI ? 'items-start' : 'items-end'} flex flex-col gap-2`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isAI
            ? 'bg-white border border-brand-purple/12 text-brand-navy shadow-card rounded-tl-sm'
            : 'bg-brand-purple text-white rounded-tr-sm'
          }`}>
          <p className="whitespace-pre-line">{message.text}</p>
        </div>

        {message.code && (
          <div className="w-full bg-brand-navy rounded-2xl overflow-hidden border border-brand-purple/20">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-brand-pink" />
                <span className="w-3 h-3 rounded-full bg-brand-yellow" />
                <span className="w-3 h-3 rounded-full bg-brand-mint" />
              </div>
              <span className="text-xs text-gray-400 font-mono ml-1">JavaScript</span>
            </div>
            <pre className="px-4 py-3 text-xs font-mono text-brand-cyan overflow-x-auto leading-relaxed">
              <code>{message.code}</code>
            </pre>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function AIMentorSection() {
  const { ref: scrollRef, inView } = useScrollAnimation()
  const [visibleMessages, setVisibleMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatRef = useRef(null)
  const started = useRef(false)
  const sectionRef = useRef(null)

  // ── GSAP scroll reveals ────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo('.ai-header',
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.ai-header', start: 'top 88%', once: true },
        }
      )

      // Left feature column slides in from left
      gsap.fromTo('.ai-left',
        { autoAlpha: 0, x: -60 },
        {
          autoAlpha: 1, x: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: '.ai-left', start: 'top 82%', once: true },
        }
      )

      // Right chat panel slides in from right
      gsap.fromTo('.ai-right',
        { autoAlpha: 0, x: 60 },
        {
          autoAlpha: 1, x: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: '.ai-right', start: 'top 82%', once: true },
        }
      )

      // Feature pills stagger
      gsap.fromTo('.ai-pill',
        { autoAlpha: 0, y: 20, scale: 0.9 },
        {
          autoAlpha: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.1, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: '.ai-pills', start: 'top 85%', once: true },
        }
      )

      // Bento grid cards stagger
      gsap.fromTo('.ai-bento-card',
        { autoAlpha: 0, y: 25 },
        {
          autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: '.ai-bento-grid', start: 'top 85%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Auto-play demo conversation when section enters view
  useEffect(() => {
    if (!inView || started.current) return
    started.current = true

    demoConversation.forEach((msg, i) => {
      setTimeout(() => {
        if (msg.role === 'ai') setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setVisibleMessages(prev => [...prev, i])
          if (chatRef.current) {
            chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
          }
        }, msg.role === 'ai' ? 800 : 0)
      }, msg.delay)
    })
  }, [inView])

  const handleSend = () => {
    if (!userInput.trim()) return
    setUserInput('')
  }

  return (
    <section ref={sectionRef} id="ai-mentor" className="relative py-28 bg-brand-lavender overflow-hidden">
      {/* AI mesh gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,229,255,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(255,77,202,0.10),transparent_50%)]" />
      <div className="orb orb-purple absolute top-1/4 right-0 w-96 h-96 opacity-20" />

      {/* scrollRef for IntersectionObserver (chat autoplay trigger) */}
      <div ref={scrollRef} className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="ai-header" style={{ opacity: 0 }}>
          <SectionHeader
            eyebrow="🤖 AI Mentor"
            title="Stuck on a Task?"
            highlight="Ask your AI Mentor."
            description="Your personal 24/7 co-pilot. Get instant debugging help, personalized explanations, and career guidance — all in the context of your current roadmap step."
            className="mb-16"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ── Left: Feature list ── */}
          <div className="ai-left" style={{ opacity: 0 }}>
            {/* Feature pills */}
            <div className="ai-pills flex flex-wrap gap-3 mb-10">
              {featurePills.map(({ icon: Icon, label, color }) => (
                <motion.div
                  key={label}
                  className="ai-pill flex items-center gap-2 bg-white rounded-2xl px-4 py-2.5
                             shadow-card border border-gray-100 text-sm font-semibold text-brand-navy"
                  style={{ opacity: 0 }}
                  whileHover={{ scale: 1.04, y: -2, boxShadow: `0 12px 28px ${color}20` }}
                >
                  <Icon size={15} style={{ color }} />
                  {label}
                </motion.div>
              ))}
            </div>

            {/* Bento grid of AI capabilities */}
            <div className="ai-bento-grid grid grid-cols-2 gap-4">
              {[
                { emoji: '🔍', title: 'Context-Aware',   desc: 'The AI knows exactly which module and task you are on.',           color: '#7B61FF' },
                { emoji: '⚡', title: 'Instant Response', desc: 'No waiting. Get unblocked in seconds, not hours.',                 color: '#00E5FF' },
                { emoji: '📈', title: 'Tracks Your Growth',desc: 'Remembers your struggles and adapts explanations.',              color: '#00F5A0' },
                { emoji: '💼', title: 'Career Guidance',  desc: 'Interview prep, resume tips, and salary negotiation.',            color: '#FF4DCA' },
              ].map(({ emoji, title, desc, color }) => (
                <motion.div
                  key={title}
                  className="ai-bento-card bg-white rounded-3xl p-5 shadow-card border border-gray-100"
                  style={{ opacity: 0 }}
                  whileHover={{ y: -3, boxShadow: `0 20px 40px ${color}18` }}
                >
                  <div className="text-2xl mb-3">{emoji}</div>
                  <h4 className="font-bold text-brand-navy text-sm mb-1">{title}</h4>
                  <p className="text-xs text-brand-gray leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right: Live chat demo ── */}
          <div className="ai-right relative" style={{ opacity: 0 }}>
            <div className="bg-brand-navy rounded-3xl overflow-hidden shadow-card-lg">
              {/* Chat header */}
              <div className="px-5 py-4 bg-gradient-dark border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-ai flex items-center justify-center">
                      <Bot size={18} className="text-white" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full
                                     bg-brand-mint border-2 border-brand-navy" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">CareerNav AI Mentor</p>
                    <p className="text-brand-cyan text-xs">Online · Responds instantly</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <Badge variant="live">LIVE</Badge>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 bg-white/8 rounded-xl px-3 py-2">
                  <Sparkles size={12} className="text-brand-purple" />
                  <span className="text-xs text-gray-300 font-mono">
                    context: Frontend Architect › Module 3 › useEffect Hooks
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={chatRef}
                className="flex flex-col gap-4 p-5 h-72 overflow-y-auto"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#7B61FF transparent' }}
              >
                {demoConversation.map((msg, i) => (
                  <ChatMessage key={i} message={msg} visible={visibleMessages.includes(i)} />
                ))}

                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      className="flex items-center gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-ai flex items-center justify-center">
                        <Bot size={15} className="text-white" />
                      </div>
                      <div className="bg-white/10 rounded-2xl px-4 py-3 flex items-center gap-1">
                        {[0, 0.2, 0.4].map((d) => (
                          <motion.span
                            key={d}
                            className="w-2 h-2 rounded-full bg-brand-purple"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: d }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input */}
              <div className="px-5 pb-5">
                <div className="flex items-center gap-3 bg-white/8 rounded-2xl px-4 py-3
                                border border-white/10 focus-within:border-brand-purple/50">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything about your roadmap step..."
                    className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm outline-none font-medium"
                  />
                  <motion.button
                    onClick={handleSend}
                    className="w-8 h-8 rounded-xl bg-brand-purple flex items-center justify-center shrink-0"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Send size={14} className="text-white" />
                  </motion.button>
                </div>
                <p className="text-center text-xs text-gray-600 mt-2">
                  Powered by Claude · Contextual to your roadmap
                </p>
              </div>
            </div>

            {/* Floating glow ring */}
            <div className="absolute -inset-4 rounded-[40px] bg-gradient-ai opacity-[0.06] blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
