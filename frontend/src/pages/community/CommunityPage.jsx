import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Send, MoreVertical, Pin, Trash2, Edit3, Smile,
  Users, Settings, Image, X, ChevronRight, Volume2, VolumeX,
  LogOut, Shield, Hash, Check, Loader2, MessageSquare,
  UserMinus, Paperclip, FileText, Film, ChevronUp,
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import communityService from '../../services/communityService'
import {
  connectSocket, getSocket, joinCommunity, leaveCommunity,
  emitTyping, markReadSocket,
} from '../../services/socket'

/* ─── constants ──────────────────────────────────────────────── */
const DOMAIN_COLORS = {
  frontend:        'from-blue-500 to-cyan-500',
  backend:         'from-green-500 to-teal-500',
  fullstack:       'from-purple-500 to-indigo-600',
  mobile:          'from-pink-500 to-rose-500',
  devops:          'from-amber-500 to-orange-500',
  'system-design': 'from-indigo-500 to-violet-600',
  data:            'from-teal-500 to-cyan-500',
  'ai-ml':         'from-pink-500 to-fuchsia-500',
  security:        'from-red-500 to-rose-600',
}

const DOMAIN_BADGE = {
  frontend:        'bg-blue-100 text-blue-700',
  backend:         'bg-green-100 text-green-700',
  fullstack:       'bg-purple-100 text-purple-700',
  mobile:          'bg-pink-100 text-pink-700',
  devops:          'bg-amber-100 text-amber-700',
  'system-design': 'bg-indigo-100 text-indigo-700',
  data:            'bg-teal-100 text-teal-700',
  'ai-ml':         'bg-rose-100 text-rose-700',
  security:        'bg-red-100 text-red-700',
}

/* Emoji picker data — grouped, no external dependency */
const EMOJI_GROUPS = [
  {
    label: 'Smileys',
    emojis: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😊','😇','🥰','😍','😘','😋','😛','😜','😝','🤪','😏','😒','😞','😔','😟','😕'],
  },
  {
    label: 'Gestures',
    emojis: ['👍','👎','👌','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','👇','☝️','👋','🤚','🖐️','✋','💪','🙌','👏','🙏','🤲','🤜','🤛','💅'],
  },
  {
    label: 'Objects & Symbols',
    emojis: ['🔥','💡','⭐','🌟','💫','✨','🎉','🎊','🎯','💯','❤️','🧡','💛','💚','💙','💜','🖤','💔','❣️','💕','🚀','💎','🏆','🎁','📌'],
  },
]

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥']

/* ─── helpers ─────────────────────────────────────────────────── */
function fmtTime(dateStr) {
  if (!dateStr) return ''
  const d      = new Date(dateStr)
  const now    = new Date()
  const diffMs = now - d
  if (diffMs < 60000)   return 'just now'
  if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)}m ago`
  if (diffMs < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function Avatar({ name, size = 8 }) {
  const initials = (name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const colors   = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500']
  const color    = colors[(name?.charCodeAt(0) ?? 0) % colors.length]
  return (
    <div className={`w-${size} h-${size} rounded-full ${color} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
      {initials}
    </div>
  )
}

/* ─── File Preview ────────────────────────────────────────────── */
function FilePreview({ files, onRemove }) {
  if (!files.length) return null

  return (
    <div className="mx-4 mb-1 flex flex-wrap gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl">
      {files.map((f, i) => {
        const isImage = f.type.startsWith('image/')
        const isVideo = f.type.startsWith('video/')

        return (
          <div key={i} className="relative group flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-[12px]">
            {isImage ? (
              <img
                src={URL.createObjectURL(f)}
                alt={f.name}
                className="w-8 h-8 rounded object-cover shrink-0"
              />
            ) : isVideo ? (
              <Film size={16} className="text-blue-500 shrink-0" />
            ) : (
              <FileText size={16} className="text-gray-500 shrink-0" />
            )}
            <span className="max-w-[100px] truncate text-dash-text">{f.name}</span>
            <button
              onClick={() => onRemove(i)}
              className="w-4 h-4 rounded-full bg-gray-200 hover:bg-red-100 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
            >
              <X size={9} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Emoji Picker (input area) ───────────────────────────────── */
function InputEmojiPicker({ onSelect, onClose }) {
  const [activeGroup, setActiveGroup] = useState(0)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      className="absolute bottom-full mb-2 right-0 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
      style={{ zIndex: 60 }}
    >
      {/* Group tabs */}
      <div className="flex border-b border-gray-100">
        {EMOJI_GROUPS.map((g, i) => (
          <button
            key={i}
            onClick={() => setActiveGroup(i)}
            className={`flex-1 py-2 text-[11px] font-medium transition-colors ${
              activeGroup === i
                ? 'text-dash-primary border-b-2 border-dash-primary'
                : 'text-dash-muted hover:text-dash-text'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Emoji grid */}
      <div className="p-2 grid grid-cols-8 gap-0.5 max-h-48 overflow-y-auto">
        {EMOJI_GROUPS[activeGroup].emojis.map(e => (
          <button
            key={e}
            onClick={() => { onSelect(e); onClose() }}
            className="text-xl p-1 rounded-lg hover:bg-gray-100 transition-colors leading-none"
          >
            {e}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Community Sidebar Item ──────────────────────────────────── */
function CommunitySidebarItem({ community, isActive, onClick }) {
  const domain   = community.roadmapId?.domain
  const gradient = DOMAIN_COLORS[domain] ?? 'from-gray-400 to-gray-500'
  const name     = community.name ?? 'Community'
  const lastMsg  = community._lastMessage

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left ${
        isActive ? 'bg-[#FFF3F0]' : 'hover:bg-gray-50'
      }`}
    >
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} shrink-0 flex items-center justify-center`}>
        <Hash size={16} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className={`text-[13px] font-semibold truncate ${isActive ? 'text-dash-primary' : 'text-dash-text'}`}>
            {name}
          </p>
          {lastMsg && (
            <span className="text-[10px] text-dash-muted shrink-0 ml-1">{fmtTime(lastMsg.createdAt)}</span>
          )}
        </div>
        <p className="text-[12px] text-dash-muted truncate mt-0.5">
          {lastMsg
            ? `${lastMsg.senderId?.name?.split(' ')[0] ?? 'Someone'}: ${lastMsg.content ?? '...'}`
            : 'No messages yet'}
        </p>
      </div>
    </button>
  )
}

/* ─── Message Bubble ──────────────────────────────────────────── */
function MessageBubble({ msg, isOwn, currentUserId, onReact, onEdit, onDelete, onPin, canModerate }) {
  const [showMenu, setShowMenu]             = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const myReactions  = (msg.reactions ?? []).filter(r => r.userId === currentUserId || r.userId?._id === currentUserId)
  const reactionMap  = (msg.reactions ?? []).reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] ?? 0) + 1
    return acc
  }, {})

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2 group ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end mb-2`}
    >
      {!isOwn && <Avatar name={msg.senderId?.name} size={7} />}

      <div className={`relative max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isOwn && (
          <p className="text-[11px] text-dash-muted font-medium mb-0.5 px-1">
            {msg.senderId?.name ?? 'Unknown'}
          </p>
        )}

        {msg.isPinned && (
          <div className="flex items-center gap-1 text-[10px] text-amber-600 mb-0.5 px-1">
            <Pin size={9} /> Pinned
          </div>
        )}

        <div className={`relative rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
          isOwn
            ? 'bg-dash-primary text-white rounded-br-sm'
            : 'bg-white border border-gray-100 text-dash-text rounded-bl-sm shadow-sm'
        }`}>
          {msg.isDeleted ? (
            <span className="italic opacity-60">Message deleted</span>
          ) : (
            <>
              <p>{msg.content}</p>
              {/* File attachments */}
              {msg.attachments?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {msg.attachments.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-1.5 text-[12px] underline ${isOwn ? 'text-white/80' : 'text-blue-600'}`}
                    >
                      <Paperclip size={11} /> Attachment {i + 1}
                    </a>
                  ))}
                </div>
              )}
              {msg.isEdited && <span className="text-[10px] opacity-60 ml-1">(edited)</span>}
            </>
          )}
          <p className={`text-[10px] mt-0.5 ${isOwn ? 'text-white/60 text-right' : 'text-dash-muted'}`}>
            {fmtTime(msg.createdAt)}
          </p>
        </div>

        {/* Reactions */}
        {Object.keys(reactionMap).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 px-1">
            {Object.entries(reactionMap).map(([emoji, count]) => {
              const iMine = myReactions.some(r => r.emoji === emoji)
              return (
                <button
                  key={emoji}
                  onClick={() => onReact(msg._id, emoji, iMine)}
                  className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                    iMine ? 'border-dash-primary bg-[#FFF3F0]' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {emoji} <span className="font-medium">{count}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Hover action bar */}
        {!msg.isDeleted && (
          <div className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full pr-1' : 'right-0 translate-x-full pl-1'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
            {/* Quick react */}
            <div className="relative">
              <button
                onClick={() => { setShowEmojiPicker(v => !v); setShowMenu(false) }}
                className="w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 text-dash-muted"
              >
                <Smile size={13} />
              </button>
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`absolute bottom-full mb-1 flex gap-1 bg-white border border-gray-200 rounded-xl p-1.5 shadow-lg ${isOwn ? 'right-0' : 'left-0'}`}
                    style={{ zIndex: 50 }}
                  >
                    {REACTION_EMOJIS.map(e => {
                      const iMine = myReactions.some(r => r.emoji === e)
                      return (
                        <button
                          key={e}
                          onClick={() => { onReact(msg._id, e, iMine); setShowEmojiPicker(false) }}
                          className={`text-base p-1 rounded-lg hover:bg-gray-100 transition-colors ${iMine ? 'bg-[#FFF3F0]' : ''}`}
                        >
                          {e}
                        </button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* More actions */}
            <div className="relative">
              <button
                onClick={() => { setShowMenu(v => !v); setShowEmojiPicker(false) }}
                className="w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 text-dash-muted"
              >
                <MoreVertical size={13} />
              </button>
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`absolute bottom-full mb-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-[140px] ${isOwn ? 'right-0' : 'left-0'}`}
                    style={{ zIndex: 50 }}
                  >
                    {isOwn && (
                      <button
                        onClick={() => { onEdit(msg); setShowMenu(false) }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-dash-text hover:bg-gray-50"
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                    )}
                    {canModerate && (
                      <button
                        onClick={() => { onPin(msg._id, msg.isPinned); setShowMenu(false) }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-dash-text hover:bg-gray-50"
                      >
                        <Pin size={13} /> {msg.isPinned ? 'Unpin' : 'Pin'}
                      </button>
                    )}
                    {(isOwn || canModerate) && (
                      <button
                        onClick={() => { onDelete(msg._id); setShowMenu(false) }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {isOwn && <Avatar name={undefined} size={7} />}
    </motion.div>
  )
}

/* ─── Settings Panel ──────────────────────────────────────────── */
function SettingsPanel({ community, members, loadingMembers, myRole, onClose, onLeave, onMuteSelf, isMuted }) {
  const [tab, setTab]  = useState('overview')
  const { user }       = useAuthStore()
  const canModerate    = myRole === 'mentor' || myRole === 'moderator'
  const domain         = community.roadmapId?.domain

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'members',  label: `Members (${members.length})` },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-72 border-l border-gray-100 flex flex-col bg-white"
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-[14px] text-dash-text">Community Info</h3>
        <button onClick={onClose} className="text-dash-muted hover:text-dash-text transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex border-b border-gray-100">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 text-[12px] font-medium border-b-2 transition-colors ${
              tab === t.id ? 'border-dash-primary text-dash-primary' : 'border-transparent text-dash-muted hover:text-dash-text'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'overview' && (
          <div className="space-y-4">
            <div className={`h-24 rounded-xl bg-gradient-to-br ${DOMAIN_COLORS[domain] ?? 'from-gray-400 to-gray-500'} flex items-end p-3`}>
              <div>
                <p className="text-white font-bold text-[15px]">{community.name}</p>
                {domain && (
                  <span className={`dash-badge text-[10px] mt-1 ${DOMAIN_BADGE[domain] ?? 'bg-gray-100 text-gray-600'}`}>
                    {domain}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-[12px] text-dash-muted">Type</span>
                <span className="text-[12px] font-medium text-dash-text capitalize">{community.type ?? 'private'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-[12px] text-dash-muted">Members</span>
                <span className="text-[12px] font-medium text-dash-text">{members.length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[12px] text-dash-muted">Created</span>
                <span className="text-[12px] font-medium text-dash-text">
                  {community.createdAt ? new Date(community.createdAt).toLocaleDateString() : '—'}
                </span>
              </div>
            </div>
          </div>
        )}

        {tab === 'members' && (
          <div className="space-y-2">
            {loadingMembers ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="shimmer w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <div className="shimmer h-3 w-2/3 rounded" />
                    <div className="shimmer h-2 w-1/3 rounded" />
                  </div>
                </div>
              ))
            ) : members.length === 0 ? (
              <p className="text-center text-[13px] text-dash-muted py-6">No members found.</p>
            ) : (
              members.map((m) => (
                <div key={m._id ?? m.userId?._id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <Avatar name={m.userId?.name} size={8} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-dash-text truncate">{m.userId?.name ?? 'Unknown'}</p>
                    <p className="text-[11px] text-dash-muted capitalize">{m.role}</p>
                  </div>
                  {m.isMuted && <span className="dash-badge dash-badge-amber text-[9px]">Muted</span>}
                  {canModerate && m.userId?._id !== user?._id && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => m.isMuted
                          ? communityService.unmuteMember(community._id, m.userId?._id)
                          : communityService.muteMember(community._id, m.userId?._id)
                        }
                        className="p-1 rounded hover:bg-gray-100 text-dash-muted transition-colors"
                      >
                        {m.isMuted ? <Volume2 size={12} /> : <VolumeX size={12} />}
                      </button>
                      <button
                        onClick={() => communityService.removeMember(community._id, m.userId?._id)}
                        className="p-1 rounded hover:bg-red-50 text-red-500 transition-colors"
                      >
                        <UserMinus size={12} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'settings' && (
          <div className="space-y-3">
            <button
              onClick={onMuteSelf}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                {isMuted ? <Volume2 size={14} className="text-dash-muted" /> : <VolumeX size={14} className="text-dash-muted" />}
                <span className="text-[13px] text-dash-text">{isMuted ? 'Unmute Notifications' : 'Mute Notifications'}</span>
              </div>
              <ChevronRight size={14} className="text-dash-muted" />
            </button>
            <button
              onClick={onLeave}
              className="w-full flex items-center gap-2 p-3 rounded-xl border border-red-100 hover:bg-red-50 text-red-600 transition-colors"
            >
              <LogOut size={14} />
              <span className="text-[13px] font-medium">Leave Community</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ─── Empty state ─────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-[#FFF3F0] flex items-center justify-center">
        <MessageSquare size={28} className="text-dash-primary" />
      </div>
      <div>
        <p className="font-semibold text-dash-text text-[15px]">Select a community</p>
        <p className="text-[13px] text-dash-muted mt-1">Choose a community from the sidebar to start chatting</p>
      </div>
    </div>
  )
}

/* ─── Main Page ───────────────────────────────────────────────── */
export default function CommunityPage() {
  const { user }                    = useAuthStore()
  const navigate                    = useNavigate()
  const { communityId: urlCommunityId } = useParams()

  /* ── Sidebar state ─────────────────────────────────────────── */
  const [communities, setCommunities]           = useState([])
  const [loadingCommunities, setLoadingCommunities] = useState(true)
  const [sidebarSearch, setSidebarSearch]       = useState('')

  /* ── Chat state ─────────────────────────────────────────────── */
  const [selected, setSelected]         = useState(null)
  const [messages, setMessages]         = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [isSending, setIsSending]       = useState(false)
  const [newMsg, setNewMsg]             = useState('')
  const [editingMsg, setEditingMsg]     = useState(null)
  const [typingUsers, setTypingUsers]   = useState([])

  /* ── Pagination state ──────────────────────────────────────── */
  const [currentPage, setCurrentPage]   = useState(1)
  const [hasMore, setHasMore]           = useState(false)
  const [loadingMore, setLoadingMore]   = useState(false)
  const PAGE_LIMIT = 30

  /* ── File upload state ─────────────────────────────────────── */
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef                       = useRef(null)

  /* ── Emoji picker state ────────────────────────────────────── */
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  /* ── Settings panel state ──────────────────────────────────── */
  const [showSettings, setShowSettings] = useState(false)
  const [members, setMembers]           = useState([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [isMuted, setIsMuted]           = useState(false)

  const messagesEndRef        = useRef(null)
  const messagesContainerRef  = useRef(null)
  const inputRef              = useRef(null)
  const typingTimeout         = useRef(null)
  const currentCommunityRef   = useRef(null)

  // ── Fetch communities on mount ────────────────────────────────
  useEffect(() => {
    connectSocket()
    communityService.getMyCommunities()
      .then(res => setCommunities(res.communities ?? res.data ?? res ?? []))
      .catch(() => setCommunities([]))
      .finally(() => setLoadingCommunities(false))
  }, [])

  // ── Auto-select community from URL param ──────────────────────
  useEffect(() => {
    if (!urlCommunityId || loadingCommunities || communities.length === 0) return
    const found = communities.find(c => c._id === urlCommunityId)
    if (found && selected?._id !== urlCommunityId) {
      loadCommunity(found)
    }
  }, [urlCommunityId, loadingCommunities, communities])

  // ── Socket listeners ──────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const onNewMsg = (msg) => {
      if (msg.communityId === currentCommunityRef.current) {
        setMessages(prev => [...prev, msg])
        markReadSocket(msg.communityId, msg._id)
      }
      setCommunities(prev => prev.map(c =>
        c._id === msg.communityId ? { ...c, _lastMessage: msg } : c
      ))
    }

    const onUpdated = (msg) => {
      if (msg.communityId === currentCommunityRef.current) {
        setMessages(prev => prev.map(m => m._id === msg._id ? msg : m))
      }
    }

    const onDeleted = ({ messageId, communityId }) => {
      if (communityId === currentCommunityRef.current) {
        setMessages(prev => prev.map(m => m._id === messageId ? { ...m, isDeleted: true } : m))
      }
    }

    const onReaction = (msg) => {
      if (msg.communityId === currentCommunityRef.current) {
        setMessages(prev => prev.map(m => m._id === msg._id ? msg : m))
      }
    }

    const onPinned = (msg) => {
      if (msg.communityId === currentCommunityRef.current) {
        setMessages(prev => prev.map(m => m._id === msg._id ? msg : m))
      }
    }

    const onTyping = ({ communityId, userId, isTyping }) => {
      if (communityId !== currentCommunityRef.current || userId === user?._id) return
      setTypingUsers(prev =>
        isTyping ? [...new Set([...prev, userId])] : prev.filter(id => id !== userId)
      )
    }

    socket.on('community:message:new',      onNewMsg)
    socket.on('community:message:updated',  onUpdated)
    socket.on('community:message:deleted',  onDeleted)
    socket.on('community:message:reaction', onReaction)
    socket.on('community:message:pinned',   onPinned)
    socket.on('community:typing',           onTyping)

    return () => {
      socket.off('community:message:new',      onNewMsg)
      socket.off('community:message:updated',  onUpdated)
      socket.off('community:message:deleted',  onDeleted)
      socket.off('community:message:reaction', onReaction)
      socket.off('community:message:pinned',   onPinned)
      socket.off('community:typing',           onTyping)
    }
  }, [user?._id])

  // ── Scroll to bottom when new messages arrive ─────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Load members when settings panel opens ────────────────────
  useEffect(() => {
    if (!showSettings || !selected) return
    setLoadingMembers(true)
    communityService.getMembers(urlCommunityId)
      .then(res => setMembers(res.members ?? res.data ?? []))
      .catch(() => setMembers([]))
      .finally(() => setLoadingMembers(false))
  }, [showSettings, selected])

  // ── Core: load a community's messages (page 1) ────────────────
  const loadCommunity = useCallback(async (community) => {
    console.log("community at load community ",community)
    if (currentCommunityRef.current) {
      leaveCommunity(currentCommunityRef.current)
    }
    console.log("current ref",currentCommunityRef)

    setSelected(community)
    currentCommunityRef.current = community.communityId
    setMessages([])
    setCurrentPage(1)
    setHasMore(false)
    setLoadingMessages(true)
    setShowSettings(false)
    setTypingUsers([])
    setSelectedFiles([])
    setShowEmojiPicker(false)

    joinCommunity(community.communityId)

    try {
      const res  = await communityService.getMessages(community.communityId, { page: 1, limit: PAGE_LIMIT })
      const msgs = res.messages ?? res.data ?? []
      setMessages(msgs)
      // If the API returned a pagination object, check if there are more pages
      if (res.pagination) {
        setHasMore(res.pagination.hasNext ?? res.pagination.hasPrev ?? msgs.length === PAGE_LIMIT)
      } else {
        setHasMore(msgs.length === PAGE_LIMIT)
      }
      if (msgs.length > 0) {
        markReadSocket(community._id, msgs[msgs.length - 1]._id)
      }
    } catch (_) {}

    setLoadingMessages(false)
    inputRef.current?.focus()
  }, [])

  // ── Select community → update URL + load ──────────────────────
  const selectCommunity = useCallback((community) => {
    
   
    navigate(`/community/${community.communityId}`)
    // loadCommunity is triggered by the urlCommunityId effect,
    // but call directly if already on the same route (re-select)
    if (urlCommunityId === community.communityId) {
      loadCommunity(community)
    }
  }, [navigate, urlCommunityId, loadCommunity])

  // ── Load older messages (pagination) ─────────────────────────
  const loadOlderMessages = async () => {
    if (!selected || loadingMore || !hasMore) return
    setLoadingMore(true)
    const nextPage = currentPage + 1
    try {
      const res  = await communityService.getMessages(urlCommunityId, { page: nextPage, limit: PAGE_LIMIT })
      const msgs = res.messages ?? res.data ?? []
      if (msgs.length > 0) {
        setMessages(prev => [...msgs, ...prev])
        setCurrentPage(nextPage)
        if (res.pagination) {
          setHasMore(res.pagination.hasNext ?? msgs.length === PAGE_LIMIT)
        } else {
          setHasMore(msgs.length === PAGE_LIMIT)
        }
        // Maintain scroll position (don't jump to bottom)
        const container = messagesContainerRef.current
        if (container) {
          const scrollBottom = container.scrollHeight - container.scrollTop
          requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight - scrollBottom
          })
        }
      } else {
        setHasMore(false)
      }
    } catch (_) {}
    setLoadingMore(false)
  }

  // ── Send / Edit message ───────────────────────────────────────
  const handleSend = async () => {
    const content = newMsg.trim()
    if (!content && selectedFiles.length === 0) return
    if (!selected) return

    setIsSending(true)
    setNewMsg('')
    const filesToSend = [...selectedFiles]
    setSelectedFiles([])

    try {
      if (editingMsg) {
        console.log(selected)
        await communityService.editMessage(urlCommunityId, editingMsg._id, content)
        setMessages(prev => prev.map(m => m._id === editingMsg._id ? { ...m, content, isEdited: true } : m))
        setEditingMsg(null)
      } else {
        // Optimistic message
        
        const optimistic = {
          _id:         `opt-${Date.now()}`,
          communityId: urlCommunityId,
          senderId:    { _id: user?._id, name: user?.name },
          content,
          createdAt:   new Date().toISOString(),
          reactions:   [],
        }
        setMessages(prev => [...prev, optimistic])

        let sent
        if (filesToSend.length > 0) {
          const form = new FormData()
          form.append('content', content)
          filesToSend.forEach(f => form.append('files', f))
          console.log("sending message",selected)
          sent = await communityService.sendMessage(urlCommunityId, form)
        } else {
          sent = await communityService.sendMessage(urlCommunityId, { content })
        }

        setMessages(prev => prev.map(m => m._id === optimistic._id ? (sent.message ?? optimistic) : m))
        setCommunities(prev => prev.map(c => c._id === urlCommunityId ? { ...c, _lastMessage: sent.message ?? optimistic } : c))
      }
    } catch (_) {
      if (editingMsg) setNewMsg(content)
    }

    setIsSending(false)
  }

  // ── Typing indicator ──────────────────────────────────────────
  const handleInputChange = (e) => {
    setNewMsg(e.target.value)
    if (!selected) return
    emitTyping(urlCommunityId, true)
    clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => emitTyping(urlCommunityId, false), 2000)
  }

  // ── Insert emoji into input ───────────────────────────────────
  const insertEmoji = (emoji) => {
    setNewMsg(prev => prev + emoji)
    inputRef.current?.focus()
  }

  // ── File selection ────────────────────────────────────────────
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files ?? [])
    setSelectedFiles(prev => [...prev, ...files])
    e.target.value = ''
  }

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // ── React handler ─────────────────────────────────────────────
  const handleReact = async (messageId, emoji, isMine) => {
    if (!selected) return
    try {
      if (isMine) {
        await communityService.removeReaction(urlCommunityId, messageId, emoji)
        setMessages(prev => prev.map(m => m._id === messageId
          ? { ...m, reactions: (m.reactions ?? []).filter(r => !(r.emoji === emoji && (r.userId === user?._id || r.userId?._id === user?._id))) }
          : m
        ))
      } else {
        await communityService.addReaction(urlCommunityId, messageId, emoji)
        setMessages(prev => prev.map(m => m._id === messageId
          ? { ...m, reactions: [...(m.reactions ?? []), { emoji, userId: user?._id }] }
          : m
        ))
      }
    } catch (_) {}
  }

  // ── Pin handler ───────────────────────────────────────────────
  const handlePin = async (messageId, isPinned) => {
    if (!selected) return
    try {
      if (isPinned) {
        await communityService.unpinMessage(urlCommunityId, messageId)
      } else {
        await communityService.pinMessage(urlCommunityId, messageId)
      }
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, isPinned: !isPinned } : m))
    } catch (_) {}
  }

  // ── Delete handler ────────────────────────────────────────────
  const handleDelete = async (messageId) => {
    if (!selected) return
    try {
      await communityService.deleteMessage(urlCommunityId, messageId)
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, isDeleted: true } : m))
    } catch (_) {}
  }

  // ── Mute self ─────────────────────────────────────────────────
  const handleMuteSelf = async () => {
    if (!selected) return
    try {
      if (isMuted) {
        await communityService.unmuteSelf(urlCommunityId)
        setIsMuted(false)
      } else {
        await communityService.muteSelf(urlCommunityId)
        setIsMuted(true)
      }
    } catch (_) {}
  }

  // ── Leave community ───────────────────────────────────────────
  const handleLeave = async () => {
    if (!selected) return
    try {
      await communityService.leave(urlCommunityId)
      setCommunities(prev => prev.filter(c => c._id !== urlCommunityId))
      setSelected(null)
      currentCommunityRef.current = null
      setShowSettings(false)
      navigate('/community')
    } catch (_) {}
  }

  // ── Edit flow ─────────────────────────────────────────────────
  const startEdit = (msg) => {
    setEditingMsg(msg)
    setNewMsg(msg.content ?? '')
    inputRef.current?.focus()
  }

  const cancelEdit = () => {
    setEditingMsg(null)
    setNewMsg('')
  }

  const myMembership = members.find(m => m.userId?._id === user?._id || m.userId === user?._id)
  const myRole       = myMembership?.role ?? 'learner'
  const canModerate  = myRole === 'mentor'

  const filteredCommunities = useMemo(
    () => communities.filter(c => (c.name ?? '').toLowerCase().includes(sidebarSearch.toLowerCase())),
    [communities, sidebarSearch]
  )

  return (
    <div
      className="flex h-[calc(100vh-64px)] overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white"
      onClick={() => showEmojiPicker && setShowEmojiPicker(false)}
    >
      {/* ── Left Sidebar ──────────────────────────────────────── */}
      <div className="w-72 border-r border-gray-100 flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[15px] text-dash-text mb-3">Communities</h2>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-muted" />
            <input
              value={sidebarSearch}
              onChange={e => setSidebarSearch(e.target.value)}
              placeholder="Search…"
              className="dash-input w-full pl-8 pr-3 py-1.5 text-[13px]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loadingCommunities ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-3">
                <div className="shimmer w-11 h-11 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <div className="shimmer h-3 w-3/4 rounded" />
                  <div className="shimmer h-3 w-1/2 rounded" />
                </div>
              </div>
            ))
          ) : filteredCommunities.length === 0 ? (
            <div className="text-center py-8">
              <Hash size={24} className="mx-auto text-gray-300 mb-2" />
              <p className="text-[13px] text-dash-muted">
                {communities.length === 0
                  ? 'Join a roadmap to access its community.'
                  : 'No communities match your search.'}
              </p>
            </div>
          ) : (
            filteredCommunities.map(c => (
              <CommunitySidebarItem
                key={c._id}
                community={c}
                isActive={selected?._id === c._id}
                onClick={() => selectCommunity(c)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Chat Area ─────────────────────────────────────────── */}
      {!selected ? (
        <div className="flex-1 flex">
          <EmptyState />
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${DOMAIN_COLORS[selected.roadmapId?.domain] ?? 'from-gray-400 to-gray-500'} flex items-center justify-center`}>
                  <Hash size={14} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[14px] text-dash-text">{selected.name}</p>
                  <p className="text-[11px] text-dash-muted">{members.length || '...'} members</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(v => !v)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${showSettings ? 'bg-[#FFF3F0] text-dash-primary' : 'hover:bg-gray-100 text-dash-muted'}`}
              >
                <Settings size={15} />
              </button>
            </div>

            {/* Load older messages button */}
            <AnimatePresence>
              {hasMore && !loadingMessages && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex justify-center pt-2 shrink-0"
                >
                  <button
                    onClick={loadOlderMessages}
                    disabled={loadingMore}
                    className="flex items-center gap-1.5 text-[12px] text-dash-primary hover:text-[#C42B08] font-medium px-3 py-1 rounded-full border border-[#F0D0CA] hover:bg-[#FFF3F0] transition-colors"
                  >
                    {loadingMore
                      ? <><Loader2 size={12} className="animate-spin" /> Loading…</>
                      : <><ChevronUp size={12} /> Load older messages</>
                    }
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-5 py-4">
              {loadingMessages ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`flex gap-2 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                      <div className="shimmer w-7 h-7 rounded-full" />
                      <div className="space-y-1.5 max-w-[50%]">
                        <div className="shimmer h-3 w-20 rounded" />
                        <div className="shimmer h-10 w-full rounded-2xl" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <MessageSquare size={28} className="text-gray-300" />
                  <p className="text-[13px] text-dash-muted">No messages yet. Say hello!</p>
                </div>
              ) : (
                <div>
                  {messages.map(msg => (
                    <MessageBubble
                      key={msg._id}
                      msg={msg}
                      isOwn={msg.senderId?._id === user?._id || msg.senderId === user?._id}
                      currentUserId={user?._id}
                      onReact={handleReact}
                      onEdit={startEdit}
                      onDelete={handleDelete}
                      onPin={handlePin}
                      canModerate={canModerate}
                    />
                  ))}

                  {/* Typing indicator */}
                  {typingUsers.length > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                            className="w-1.5 h-1.5 rounded-full bg-gray-400"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-dash-muted">Someone is typing…</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Edit banner */}
            <AnimatePresence>
              {editingMsg && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mx-4 mb-1 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl overflow-hidden"
                >
                  <Edit3 size={12} className="text-blue-600 shrink-0" />
                  <p className="text-[12px] text-blue-700 flex-1 truncate">Editing: {editingMsg.content}</p>
                  <button onClick={cancelEdit} className="text-blue-600 hover:text-blue-800">
                    <X size={13} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* File preview */}
            <AnimatePresence>
              {selectedFiles.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <FilePreview files={selectedFiles} onRemove={removeFile} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input area */}
            <div className="px-4 pb-4 shrink-0 relative">
              {/* Emoji picker popover */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <InputEmojiPicker
                    onSelect={insertEmoji}
                    onClose={() => setShowEmojiPicker(false)}
                  />
                )}
              </AnimatePresence>

              <div
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2.5 focus-within:border-dash-primary focus-within:shadow-[0_0_0_3px_rgba(233,52,13,0.10)] transition-all"
                onClick={e => e.stopPropagation()}
              >
                {/* Attach file button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-dash-muted hover:bg-gray-200 transition-colors shrink-0"
                  title="Attach file"
                >
                  <Paperclip size={15} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Message text input */}
                <input
                  ref={inputRef}
                  value={newMsg}
                  onChange={handleInputChange}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
                    if (e.key === 'Escape' && editingMsg)  cancelEdit()
                  }}
                  placeholder={editingMsg ? 'Edit your message…' : 'Type a message…'}
                  className="flex-1 bg-transparent text-[14px] text-dash-text placeholder-gray-400 outline-none"
                />

                {/* Emoji picker button */}
                <button
                  onClick={e => { e.stopPropagation(); setShowEmojiPicker(v => !v) }}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                    showEmojiPicker ? 'bg-[#FFF3F0] text-dash-primary' : 'text-dash-muted hover:bg-gray-200'
                  }`}
                  title="Emoji"
                >
                  <Smile size={15} />
                </button>

                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={(!newMsg.trim() && selectedFiles.length === 0) || isSending}
                  className="w-8 h-8 rounded-xl bg-dash-primary flex items-center justify-center text-white disabled:opacity-50 hover:bg-[#C42B08] transition-colors shrink-0"
                >
                  {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* ── Settings Panel ──────────────────────────────── */}
          <AnimatePresence>
            {showSettings && (
              <SettingsPanel
                community={selected}
                members={members}
                loadingMembers={loadingMembers}
                myRole={myRole}
                onClose={() => setShowSettings(false)}
                onLeave={handleLeave}
                onMuteSelf={handleMuteSelf}
                isMuted={isMuted}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
