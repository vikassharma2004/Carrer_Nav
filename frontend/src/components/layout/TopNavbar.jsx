import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  UserCircle,
  Settings,
  X,
  Menu,
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'

const PAGE_TITLES = {
  '/dashboard':  'Dashboard',
  '/roadmaps':   'Roadmaps',
  '/community':  'Community',
  '/tasks':      'My Tasks',
  '/ai':         'AI Assistant',
  '/bookmarks':  'Bookmarks',
  '/profile':    'Profile',
  '/settings':   'Settings',
}

const MOCK_NOTIFS = [
  { id: 1, text: 'New task added to React Roadmap',       time: '2m ago',  read: false },
  { id: 2, text: 'Your mentor replied to your question',  time: '1h ago',  read: false },
  { id: 3, text: 'Community post got 12 reactions',       time: '3h ago',  read: true  },
]

export default function TopNavbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const [showNotifs, setShowNotifs] = useState(false)
  const [showUser, setShowUser]     = useState(false)
  const [search, setSearch]         = useState('')

  const title = PAGE_TITLES[location.pathname] ?? 'Dashboard'
  const unread = MOCK_NOTIFS.filter((n) => !n.read).length

  const handleLogout = async () => {
    await logout()
    navigate('/auth/signin')
  }

  return (
    <header className="h-[60px] shrink-0 bg-dash-card border-b border-dash-border flex items-center px-5 gap-4 relative z-30">

      {/* ── Page title (left) ────────────────── */}
      <div className="flex-1 min-w-0">
        <h1 className="font-semibold text-[15px] text-dash-text">{title}</h1>
      </div>

      {/* ── Search ──────────────────────────── */}
      <div className="relative hidden sm:flex items-center w-52 xl:w-72">
        <Search className="absolute left-3 text-dash-muted" size={14} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search roadmaps…"
          className="dash-input w-full pl-8 pr-3 py-1.5 text-[13px]"
        />
      </div>

      {/* ── Notifications ───────────────────── */}
      <div className="relative">
        <button
          onClick={() => { setShowNotifs(!showNotifs); setShowUser(false) }}
          className="relative p-2 rounded-lg text-dash-muted hover:text-dash-text hover:bg-dash-sidebar-h transition-colors"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-dash-primary" />
          )}
        </button>

        <AnimatePresence>
          {showNotifs && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{    opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-10 w-80 dash-card shadow-lg overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-dash-border">
                <span className="font-semibold text-[13px] text-dash-text">Notifications</span>
                <button onClick={() => setShowNotifs(false)}>
                  <X size={14} className="text-dash-muted" />
                </button>
              </div>
              {MOCK_NOTIFS.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-dash-border last:border-0 flex gap-3 items-start hover:bg-dash-sidebar-h cursor-pointer ${!n.read ? 'bg-[#FFF8F7]' : ''}`}
                >
                  {!n.read && <span className="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-dash-primary" />}
                  {n.read  && <span className="mt-1.5 w-2 h-2 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-dash-text leading-snug">{n.text}</p>
                    <p className="text-[11px] text-dash-muted mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── User menu ───────────────────────── */}
      <div className="relative">
        <button
          onClick={() => { setShowUser(!showUser); setShowNotifs(false) }}
          className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-dash-sidebar-h transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-dash-primary text-white flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <span className="hidden md:block text-[13px] font-medium text-dash-text max-w-[100px] truncate">
            {user?.name ?? 'User'}
          </span>
          <ChevronDown size={13} className="text-dash-muted" />
        </button>

        <AnimatePresence>
          {showUser && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{    opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-10 w-48 dash-card shadow-lg overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-dash-border">
                <p className="font-semibold text-[13px] text-dash-text truncate">{user?.name}</p>
                <p className="text-[11px] text-dash-muted truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { navigate('/profile'); setShowUser(false) }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-dash-text hover:bg-dash-sidebar-h transition-colors"
              >
                <UserCircle size={15} /> Profile
              </button>
              <button
                onClick={() => { navigate('/settings'); setShowUser(false) }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-dash-text hover:bg-dash-sidebar-h transition-colors"
              >
                <Settings size={15} /> Settings
              </button>
              <div className="border-t border-dash-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} /> Log Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
