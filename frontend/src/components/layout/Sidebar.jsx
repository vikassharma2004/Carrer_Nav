import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Map, Users, CheckSquare, Bot, Bookmark,
  UserCircle, Settings, LogOut, GraduationCap, ChevronRight,
  ChevronLeft, UserCheck, CreditCard, X,
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'

/* ── Role-aware nav definitions ──────────────────────────────── */
const LEARNER_NAV = [
  { to: '/dashboard/learner', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/roadmaps',          icon: Map,             label: 'Roadmaps' },
  { to: '/community',         icon: Users,           label: 'Community' },
  { to: '/tasks',             icon: CheckSquare,     label: 'My Tasks' },
  { to: '/ai',                icon: Bot,             label: 'AI Assistant' },
  { to: '/bookmarks',         icon: Bookmark,        label: 'Bookmarks' },
]

const MENTOR_NAV = [
  { to: '/dashboard/mentor', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/roadmaps',         icon: Map,             label: 'Roadmaps' },
  { to: '/community',        icon: Users,           label: 'Community' },
  { to: '/tasks',            icon: CheckSquare,     label: 'My Tasks' },
  { to: '/ai',               icon: Bot,             label: 'AI Assistant' },
]

const ADMIN_NAV = [
  { to: '/dashboard/admin',            icon: LayoutDashboard, label: 'Dashboard',    end: true },
  { to: '/dashboard/admin/users',      icon: Users,           label: 'Users' },
  { to: '/dashboard/admin/onboarding', icon: UserCheck,       label: 'Onboarding' },
  { to: '/dashboard/admin/billing',    icon: CreditCard,      label: 'Billing Plans' },
  { to: '/roadmaps',                   icon: Map,             label: 'Roadmaps' },
  { to: '/community',                  icon: Users,           label: 'Communities' },
  { to: '/ai',                         icon: Bot,             label: 'AI Assistant' },
]

const BOTTOM_ITEMS = [
  { to: '/profile',  icon: UserCircle, label: 'Profile' },
  { to: '/settings', icon: Settings,   label: 'Settings' },
]

/* ── Tooltip wrapper for collapsed icons ─────────────────────── */
function Tooltip({ label, children }) {
  return (
    <div className="relative group/tip">
      {children}
      <div className="
        pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2
        bg-gray-900 text-white text-[11px] font-medium px-2 py-1 rounded-md
        whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity z-50
      ">
        {label}
      </div>
    </div>
  )
}

/* ── Sidebar inner content ───────────────────────────────────── */
function SidebarContent({ collapsed, onToggle, onMobileClose }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const role = user?.role ?? 'learner'

  const navItems =
    role === 'admin'  ? ADMIN_NAV  :
    role === 'mentor' ? MENTOR_NAV :
    LEARNER_NAV

  const sectionLabel = role === 'admin' ? 'Admin Menu' : 'Main Menu'

  const handleLogout = async () => {
    await logout()
    navigate('/auth/signin')
  }

  const NavItem = ({ to, icon: Icon, label, end }) => {
    const inner = (isActive) => (
      <>
        <Icon size={18} className="shrink-0" />
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="label"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 whitespace-nowrap overflow-hidden"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
        {!collapsed && isActive && (
          <ChevronRight size={14} className="opacity-40 shrink-0" />
        )}
      </>
    )

    const link = (
      <NavLink
        to={to}
        end={end}
        onClick={onMobileClose}
        className={({ isActive }) =>
          `dash-nav-item${isActive ? ' active' : ''}${collapsed ? ' justify-center px-0' : ''}`
        }
      >
        {({ isActive }) => inner(isActive)}
      </NavLink>
    )

    return collapsed ? <Tooltip label={label}>{link}</Tooltip> : link
  }

  return (
    <div className="flex flex-col h-full relative">

      {/* ── Logo ───────────────────────────────────── */}
      <div className={`flex items-center border-b border-dash-border ${collapsed ? 'justify-center px-3 py-5' : 'gap-2 px-5 py-5'}`}>
        <div className="w-8 h-8 rounded-lg bg-dash-primary flex items-center justify-center shrink-0">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="brand"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="font-bold text-[17px] text-dash-text tracking-tight whitespace-nowrap overflow-hidden"
            >
              Career<span className="text-dash-primary">Nav</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main Nav ───────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-semibold text-dash-muted uppercase tracking-widest">
            {sectionLabel}
          </p>
        )}
        {collapsed && <div className="mb-2 h-[18px]" />}

        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <div className="pt-4">
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold text-dash-muted uppercase tracking-widest">
              Account
            </p>
          )}
          {collapsed && <div className="mb-2 h-[18px]" />}
          {BOTTOM_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>
      </nav>

      {/* ── User Footer ────────────────────────────── */}
      <div className="px-2 py-3 border-t border-dash-border">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <Tooltip label={user?.name ?? 'User'}>
              <div className="w-8 h-8 rounded-full bg-dash-primary text-white flex items-center justify-center text-sm font-bold cursor-default">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </div>
            </Tooltip>
            <Tooltip label="Log out">
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-dash-muted hover:text-dash-primary hover:bg-dash-tag-bg transition-colors"
              >
                <LogOut size={15} />
              </button>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl bg-dash-sidebar-h">
            <div className="w-8 h-8 rounded-full bg-dash-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-dash-text truncate">{user?.name ?? 'User'}</p>
              <p className="text-[11px] text-dash-muted truncate capitalize">{user?.role ?? 'learner'}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="p-1.5 rounded-lg text-dash-muted hover:text-dash-primary hover:bg-dash-tag-bg transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>

      {/* ── Desktop collapse toggle ─────────────────── */}
      <button
        onClick={onToggle}
        className="hidden lg:flex absolute -right-3 top-[76px] w-6 h-6 bg-white border border-dash-border rounded-full items-center justify-center shadow-sm text-dash-muted hover:text-dash-primary hover:border-dash-primary transition-all z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </div>
  )
}

/* ── Main export ─────────────────────────────────────────────── */
export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="hidden lg:block shrink-0 bg-dash-sidebar border-r border-dash-border h-screen relative overflow-visible"
      >
        <SidebarContent
          collapsed={collapsed}
          onToggle={onToggle}
          onMobileClose={() => {}}
        />
      </motion.aside>

      {/* Mobile overlay + drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
              onClick={onMobileClose}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden fixed left-0 top-0 h-full w-[260px] bg-dash-sidebar border-r border-dash-border z-50 flex flex-col"
            >
              {/* Close button */}
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-dash-muted hover:text-dash-text hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
              <SidebarContent
                collapsed={false}
                onToggle={() => {}}
                onMobileClose={onMobileClose}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
