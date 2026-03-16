import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'

export default function RequireAuth() {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    // Preserve the page the user was trying to reach
    return <Navigate to="/auth/signin" state={{ from: location }} replace />
  }

  return <Outlet />
}
