import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, LogOut, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import useAuthStore from '../../store/useAuthStore'

const navLinks = [
  { label: 'Roadmaps',     href: '#roadmaps'    },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'AI Mentor',    href: '#ai-mentor'   },
  { label: 'Community',    href: '#community'   },
]

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenu,   setUserMenu]   = useState(false)

  const navigate             = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleBecomeMentor = () => {
    setMobileOpen(false)
    if (!isAuthenticated) {
      sessionStorage.setItem('mentorIntent', 'apply')
      navigate('/auth/signup')
    } else {
      navigate('/mentor/apply')
    }
  }

  const handleLogout = async () => {
    setUserMenu(false)
    await logout()
    navigate('/')
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? 'py-3 bg-white/90 backdrop-blur-xl shadow-[0_2px_24px_rgba(123,97,255,0.10)]'
          : 'py-5 bg-transparent'
        }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center
                          shadow-card group-hover:shadow-glow transition-shadow duration-300">
            <Zap size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-extrabold text-brand-navy tracking-tight">
            Career<span className="gradient-text">Nav</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-brand-gray rounded-xl
                         hover:text-brand-purple hover:bg-brand-purple/8 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <motion.button
                onClick={() => setUserMenu(v => !v)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-2xl
                           bg-brand-lavender border border-brand-purple/15
                           hover:border-brand-purple/40 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-7 h-7 rounded-xl bg-gradient-brand flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-semibold text-brand-navy max-w-[100px] truncate">
                  {user?.name || 'Account'}
                </span>
              </motion.button>

              <AnimatePresence>
                {userMenu && (
                  <motion.div
                    className="absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl shadow-card-lg
                               border border-brand-purple/10 overflow-hidden z-50"
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Link to="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-brand-navy
                                 hover:bg-brand-lavender transition-colors"
                      onClick={() => setUserMenu(false)}>
                      <User size={15} /> Dashboard
                    </Link>
                    {user?.role !== 'mentor' && (
                      <button
                        onClick={() => { setUserMenu(false); navigate('/mentor/apply') }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-brand-purple
                                   hover:bg-brand-purple/8 transition-colors">
                        🏗️ Become a Mentor
                      </button>
                    )}
                    {user?.role === 'mentor' && (
                      <Link to="/mentor/dashboard"
                        className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-brand-purple
                                   hover:bg-brand-purple/8 transition-colors"
                        onClick={() => setUserMenu(false)}>
                        🗺️ Mentor Dashboard
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mx-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-red-500
                                 hover:bg-red-50 transition-colors">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/auth/signin">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <motion.button
                onClick={handleBecomeMentor}
                className="px-5 py-2.5 rounded-2xl bg-gradient-brand text-white font-bold text-sm
                           shadow-card hover:shadow-glow transition-all duration-200"
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                🏗️ Become a Mentor
              </motion.button>
              <Link to="/auth/signup">
                <Button variant="primary" size="sm">Get Started Free</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-brand-purple/8 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0
                       bg-white/95 backdrop-blur-xl shadow-card-lg
                       border-t border-brand-purple/10 px-6 py-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
          >
            <nav className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href}
                   className="px-4 py-3 text-sm font-medium text-brand-gray rounded-xl
                              hover:text-brand-purple hover:bg-brand-purple/8 transition-all"
                   onClick={() => setMobileOpen(false)}>
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl
                               bg-brand-lavender text-brand-navy font-semibold text-sm">
                    Dashboard
                  </Link>
                  <button onClick={handleBecomeMentor}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl
                               bg-gradient-brand text-white font-bold text-sm">
                    🏗️ Become a Mentor
                  </button>
                  <button onClick={handleLogout}
                    className="text-sm text-red-500 font-semibold py-2">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleBecomeMentor}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl
                               bg-gradient-brand text-white font-bold text-sm shadow-card">
                    🏗️ Become a Mentor
                  </button>
                  <Link to="/auth/signup" onClick={() => setMobileOpen(false)}>
                    <Button variant="primary" size="md" className="w-full">Get Started Free</Button>
                  </Link>
                  <Link to="/auth/signin" onClick={() => setMobileOpen(false)}>
                    <Button variant="secondary" size="md" className="w-full">Sign In</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
