import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

/* ── Landing / Auth ─────────────────────────────────────────── */
import LandingPage          from './pages/LandingPage'
import SignInPage           from './pages/auth/SignInPage'
import SignUpPage           from './pages/auth/SignUpPage'
import VerifyEmailPage      from './pages/auth/VerifyEmailPage'
import VerifyMFAPage        from './pages/auth/VerifyMFAPage'

/* ── Mentor onboarding ──────────────────────────────────────── */
import MentorOnboardingPage from './pages/mentor/MentorOnboardingPage'
import MentorSuccessPage    from './pages/mentor/MentorSuccessPage'

/* ── Role dashboards ────────────────────────────────────────── */
import DashboardLayout      from './components/layout/DashboardLayout'
import LearnerDashboard     from './pages/dashboard/LearnerDashboard'
import MentorDashboard      from './pages/dashboard/MentorDashboard'
import AdminDashboard       from './pages/dashboard/AdminDashboard'

/* ── Other app pages ────────────────────────────────────────── */
import RoadmapsPage         from './pages/roadmaps/RoadmapsPage'
import RoadmapDetailPage    from './pages/roadmaps/RoadmapDetailPage'
import CommunityPage        from './pages/community/CommunityPage'
import ProfilePage          from './pages/profile/ProfilePage'
import AIAssistantPage      from './pages/ai/AIAssistantPage'

/* ── Guards ─────────────────────────────────────────────────── */
import RequireAuth          from './components/shared/RequireAuth'
import RequireGuest         from './components/shared/RequireGuest'
import ScrollToTop          from './components/shared/ScrollToTop'
import useAuthStore         from './store/useAuthStore'

/** Smart redirect: sends each role to their own dashboard */
function RoleRedirect() {
  const { user } = useAuthStore()
  if (user?.role === 'mentor') return <Navigate to="/dashboard/mentor" replace />
  if (user?.role === 'admin')  return <Navigate to="/dashboard/admin"  replace />
  return <Navigate to="/dashboard/learner" replace />
}

export default function App() {
  const { logout, isAuthenticated } = useAuthStore()

  useEffect(() => {
    const handler = () => logout()
    window.addEventListener('auth:logout', handler)
    return () => window.removeEventListener('auth:logout', handler)
  }, [logout])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        {/* ── Public ──────────────────────────────────── */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
        />

        {/* ── Guest-only ──────────────────────────────── */}
        <Route element={<RequireGuest />}>
          <Route path="/auth/signin"       element={<SignInPage />} />
          <Route path="/auth/signup"       element={<SignUpPage />} />
          <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
          <Route path="/auth/2fa"          element={<VerifyMFAPage />} />
        </Route>

        {/* ── Authenticated ───────────────────────────── */}
        <Route element={<RequireAuth />}>

          {/* Mentor onboarding (no dashboard shell) */}
          <Route path="/mentor/apply"         element={<MentorOnboardingPage />} />
          <Route path="/mentor/apply/success" element={<MentorSuccessPage />} />

          {/* /dashboard → smart role redirect */}
          <Route path="/dashboard" element={<RoleRedirect />} />

          {/* Dashboard shell wraps all app pages */}
          <Route element={<DashboardLayout />}>
            {/* Role-specific dashboards */}
            <Route path="/dashboard/learner" element={<LearnerDashboard />} />
            <Route path="/dashboard/mentor"  element={<MentorDashboard />} />
            <Route path="/dashboard/admin"   element={<AdminDashboard />} />

            {/* Shared pages */}
            <Route path="/roadmaps"          element={<RoadmapsPage />} />
            <Route path="/roadmaps/:roadmapId" element={<RoadmapDetailPage />} />
            <Route path="/community"         element={<CommunityPage />} />
            <Route path="/ai"                element={<AIAssistantPage />} />
            <Route path="/profile"           element={<ProfilePage />} />

            {/* Placeholder routes */}
            <Route path="/tasks"      element={<ComingSoon title="My Tasks" />} />
            <Route path="/bookmarks"  element={<ComingSoon title="Bookmarks" />} />
            <Route path="/settings"   element={<ComingSoon title="Settings" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <div className="w-14 h-14 rounded-2xl bg-dash-tag-bg flex items-center justify-center text-2xl">
        🚧
      </div>
      <h2 className="text-xl font-bold text-dash-text">{title}</h2>
      <p className="text-dash-muted text-[14px]">This page is under construction.</p>
    </div>
  )
}
