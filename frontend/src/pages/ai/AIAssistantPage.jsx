import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Bot,
  User,
  Plus,
  Trash2,
  Map,
  Code,
  BookOpen,
  Lightbulb,
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import api from '../../services/api'

/* ─── Quick prompts ─────────────────────────────────────────── */
const QUICK_ACTIONS = [
  { icon: Map,       label: 'Roadmap Help',   prompt: 'Help me choose a roadmap based on my goals.' },
  { icon: Code,      label: 'Debug Code',     prompt: 'Help me debug this code: ' },
  { icon: BookOpen,  label: 'Study Plan',     prompt: 'Create a 30-day study plan for learning React.' },
  { icon: Lightbulb, label: 'Explain Concept',prompt: 'Explain this concept in simple terms: ' },
]

/* ─── Single message bubble ──────────────────────────────────── */
function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="relative bg-gray-900 rounded-lg mt-2 overflow-hidden">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
        title="Copy code"
      >
        {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-gray-400" />}
      </button>
      <pre className="overflow-x-auto p-4 text-[12px] text-gray-100 font-mono leading-relaxed">
        {code}
      </pre>
    </div>
  )
}

function renderContent(text) {
  const parts = text.split(/(```[\s\S]*?```)/g)
  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const code = part.replace(/^```[a-z]*\n?/, '').replace(/```$/, '')
      return <CodeBlock key={i} code={code} />
    }
    // Bold **text**
    const formatted = part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    return (
      <span
        key={i}
        className="whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    )
  })
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold ${
          isUser ? 'bg-dash-primary' : 'bg-brand-navy'
        }`}
      >
        {isUser ? <User size={13} /> : <Bot size={13} />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
          isUser
            ? 'bg-dash-primary text-white rounded-tr-sm'
            : 'bg-white border border-dash-border text-dash-text rounded-tl-sm shadow-sm'
        }`}
      >
        {renderContent(msg.content)}
        <p className={`text-[10px] mt-1.5 ${isUser ? 'text-white/60' : 'text-dash-muted'}`}>
          {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full shrink-0 bg-brand-navy flex items-center justify-center">
        <Bot size={13} className="text-white" />
      </div>
      <div className="bg-white border border-dash-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-dash-muted"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Conversation list item ────────────────────────────────── */
function ConvItem({ conv, active, onSelect, onDelete }) {
  return (
    <div
      onClick={() => onSelect(conv.id)}
      className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
        active ? 'bg-dash-tag-bg text-dash-primary' : 'hover:bg-dash-sidebar-h text-dash-muted hover:text-dash-text'
      }`}
    >
      <Bot size={14} className="shrink-0" />
      <span className="flex-1 text-[12px] font-medium truncate">{conv.title}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(conv.id) }}
        className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:text-red-500 transition-all"
      >
        <Trash2 size={12} />
      </button>
    </div>
  )
}

/* ─── Page ─────────────────────────────────────────────────── */
let convIdCounter = 1
function makeConvId() { return `conv-${++convIdCounter}` }

export default function AIAssistantPage() {
  const { user } = useAuthStore()
  const bottomRef = useRef(null)

  const [conversations, setConversations] = useState([
    { id: 'conv-1', title: 'React Hooks help',    messages: [] },
  ])
  const [activeConvId, setActiveConvId] = useState('conv-1')
  const [input, setInput]               = useState('')
  const [typing, setTyping]             = useState(false)

  const activeConv = conversations.find((c) => c.id === activeConvId)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv?.messages, typing])

  const addMessage = (convId, role, content) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, messages: [...c.messages, { role, content, timestamp: Date.now() }] }
          : c
      )
    )
  }

  const updateConvTitle = (convId, userMsg) => {
    const title = userMsg.length > 36 ? userMsg.slice(0, 36) + '…' : userMsg
    setConversations((prev) =>
      prev.map((c) => (c.id === convId && c.messages.length === 0 ? { ...c, title } : c))
    )
  }

  const sendMessage = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || typing) return

    setInput('')
    updateConvTitle(activeConvId, trimmed)
    addMessage(activeConvId, 'user', trimmed)
    setTyping(true)

    try {
      /* Build history to send */
      const history = (activeConv?.messages ?? []).map((m) => ({
        role: m.role,
        content: m.content,
      }))
      history.push({ role: 'user', content: trimmed })

      const res = await api.post('/ai/chat', { messages: history })
      const reply = res.data?.message ?? res.data?.reply ?? res.data?.content ?? 'I couldn\'t process that.'
      addMessage(activeConvId, 'assistant', reply)
    } catch (err) {
      const errMsg = err.response?.data?.message ?? 'Something went wrong. Please try again.'
      addMessage(activeConvId, 'assistant', errMsg)
    } finally {
      setTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const newConversation = () => {
    const id = makeConvId()
    setConversations((prev) => [
      { id, title: 'New conversation', messages: [] },
      ...prev,
    ])
    setActiveConvId(id)
  }

  const deleteConversation = (id) => {
    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== id)
      if (remaining.length === 0) {
        const newId = makeConvId()
        setActiveConvId(newId)
        return [{ id: newId, title: 'New conversation', messages: [] }]
      }
      if (activeConvId === id) setActiveConvId(remaining[0].id)
      return remaining
    })
  }

  const clearChat = () => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId ? { ...c, messages: [], title: 'New conversation' } : c
      )
    )
  }

  const messages = activeConv?.messages ?? []
  const isEmpty  = messages.length === 0

  return (
    <div className="h-[calc(100vh-60px-40px)] flex gap-4 max-w-6xl mx-auto">

      {/* ── Sidebar ───────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-52 shrink-0">
        <button
          onClick={newConversation}
          className="dash-btn-primary flex items-center justify-center gap-2 text-[13px] py-2 mb-3"
        >
          <Plus size={14} /> New Chat
        </button>

        <div className="dash-card flex-1 p-2 overflow-y-auto">
          <p className="text-[10px] font-semibold text-dash-muted uppercase tracking-widest px-2 mb-1">
            Recent
          </p>
          {conversations.map((c) => (
            <ConvItem
              key={c.id}
              conv={c}
              active={c.id === activeConvId}
              onSelect={setActiveConvId}
              onDelete={deleteConversation}
            />
          ))}
        </div>
      </aside>

      {/* ── Chat area ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 dash-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-dash-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-brand-navy flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-dash-text">CareerNav AI</p>
              <p className="text-[10px] text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Online
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            title="Clear chat"
            className="p-1.5 rounded-lg text-dash-muted hover:text-dash-primary hover:bg-dash-tag-bg transition-colors"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-brand-navy flex items-center justify-center">
                <Bot size={28} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[15px] text-dash-text">How can I help you?</h3>
                <p className="text-[13px] text-dash-muted mt-1 max-w-xs">
                  Ask me anything about roadmaps, code, or your career goals.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                {QUICK_ACTIONS.map(({ icon: Icon, label, prompt }) => (
                  <button
                    key={label}
                    onClick={() => sendMessage(prompt)}
                    className="dash-card dash-card-hover p-3 text-left"
                  >
                    <Icon size={15} className="text-dash-primary mb-1" />
                    <p className="text-[12px] font-medium text-dash-text">{label}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <Message key={i} msg={m} />
              ))}
              {typing && <TypingIndicator />}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-dash-border shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about roadmaps, debug code, or get a study plan…"
              rows={1}
              className="dash-input flex-1 px-3 py-2.5 text-[13px] resize-none leading-snug max-h-32 overflow-y-auto"
              style={{ minHeight: '40px' }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              className="w-10 h-10 shrink-0 rounded-xl bg-dash-primary text-white flex items-center justify-center hover:bg-dash-primary-h transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={15} />
            </button>
          </div>
          <p className="text-[10px] text-dash-muted mt-1.5 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
