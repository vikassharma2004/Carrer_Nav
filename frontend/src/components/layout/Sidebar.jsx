import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Map,
  Users,
  CheckSquare,
  Bot,
  Bookmark,
  UserCircle,
  Settings,
  LogOut,
  GraduationCap,
  ChevronRight,
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'

const NAV_ITEMS = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/roadmaps',   icon: Map,             label: 'Roadmaps' },
  { to: '/community',  icon: Users,           label: 'Community' },
  { to: '/tasks',      icon: CheckSquare,     label: 'My Tasks' },
  { to: '/ai',         icon: Bot,             label: 'AI Assistant' },
  { to: '/bookmarks',  icon: Bookmark,        label: 'Bookmarks' },
]

const BOTTOM_ITEMS = [
  { to: '/profile',  icon: UserCircle, label: 'Profile' },
  { to: '/settings', icon: Settings,   label: 'Settings' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/auth/signin')
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="hidden lg:flex flex-col w-[260px] shrink-0 bg-dash-sidebar border-r border-dash-border h-screen"
    >
      {/* ── Logo ────────────────────────────────── */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-dash-border">
        <div className="w-8 h-8 rounded-lg bg-dash-primary flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-[17px] text-dash-text tracking-tight">
          Career<span className="text-dash-primary">Nav</span>
        </span>
      </div>

      {/* ── Main Nav ─────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-semibold text-dash-muted uppercase tracking-widest">
          Main Menu
        </p>

        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `dash-nav-item${isActive ? ' active' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-4.5 h-4.5 shrink-0" size={18} />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" size={14} />
                )}
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-4">
          <p className="px-3 mb-2 text-[10px] font-semibold text-dash-muted uppercase tracking-widest">
            Account
          </p>
          {BOTTOM_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `dash-nav-item${isActive ? ' active' : ''}`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className="flex-1">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ── User Footer ──────────────────────────── */}
      <div className="px-3 py-4 border-t border-dash-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-dash-sidebar-h">
          <div className="w-8 h-8 rounded-full bg-dash-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-dash-text truncate">
              {user?.name ?? 'User'}
            </p>
            <p className="text-[11px] text-dash-muted truncate capitalize">
              {user?.role ?? 'learner'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-lg text-dash-muted hover:text-dash-primary hover:bg-dash-tag-bg transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
