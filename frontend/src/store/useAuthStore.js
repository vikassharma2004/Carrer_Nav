import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // ── Setters ──────────────────────────────────────────────────────────
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (v) => set({ isLoading: v }),

      // ── Register ─────────────────────────────────────────────────────────
      register: async ({ name, email, password, confirmPassword }) => {
        set({ isLoading: true })
        try {
          const res = await api.post('/auth/register', { name, email, password, confirmPassword })
          return res.data          // { message, data: { userId } }
        } finally {
          set({ isLoading: false })
        }
      },

      // ── Verify Email OTP ─────────────────────────────────────────────────
      verifyEmail: async ({ userId, otp }) => {
        set({ isLoading: true })
        try {
          const res = await api.post('/auth/verify-email', { userId, otp })
          return res.data
        } finally {
          set({ isLoading: false })
        }
      },

      // ── Resend OTP ───────────────────────────────────────────────────────
      resendOtp: async (userId) => {
        const res = await api.post('/auth/resend-otp', { userId })
        return res.data
      },

      // ── Login ─────────────────────────────────────────────────────────────
      login: async ({ email, password }) => {
        set({ isLoading: true })
        try {
          const res = await api.post('/auth/login', { email, password })
          if (res.data.requires2FA) {
            return { requires2FA: true, userId: res.data.userId }
          }
          set({ user: res.data.user, isAuthenticated: true })
          return { success: true, user: res.data.user }
        } finally {
          set({ isLoading: false })
        }
      },

      // ── Logout ────────────────────────────────────────────────────────────
      logout: async () => {
        try { await api.post('/auth/logout') } catch (_) {}
        set({ user: null, isAuthenticated: false })
      },

      // ── Complete login with 2FA code ──────────────────────────────────────
      verify2FALogin: async ({ userId, token }) => {
        set({ isLoading: true })
        try {
          const res = await api.post('/auth/login/2fa', { userId, token })
          console.log('res', res)
          set({ user: res.data.user, isAuthenticated: true })
          return res.data
        } finally {
          set({ isLoading: false })
        }
      },

      // ── Generate 2FA secret + QR code (setup) ────────────────────────────
      setup2FA: async () => {
        const res = await api.post('/auth/2fa/generate')
        return res.data   // { qrCode, secret }
      },

      // ── Verify 2FA code during setup (enables 2FA) ────────────────────────
      verify2FASetup: async ({ token }) => {
        const res = await api.post('/auth/2fa/verify', { token })
        return res.data
      },

      // ── Fetch current user (hydrate on app mount) ─────────────────────────
      fetchMe: async () => {
        try {
          const res = await api.get('/user/me')
          set({ user: res.data, isAuthenticated: true })
          return res.data
        } catch (_) {
          set({ user: null, isAuthenticated: false })
          return null
        }
      },
    }),
    {
      name: 'careernav-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
