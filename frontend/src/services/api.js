import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,          // send httpOnly auth cookies with every request
  headers: { 'Content-Type': 'application/json' },
})

// ─── Response interceptor: silent token refresh on 401 ────────────────────
let isRefreshing = false
let failedQueue = []

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve()
  )
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config

    // Only retry once, and only for 401s (not login/register endpoints)
    if (
      err.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/login') &&
      !original.url?.includes('/auth/register')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => api(original))
          .catch((e) => Promise.reject(e))
      }

      original._retry = true
      isRefreshing = true

      try {
        await axios.post('/api/v1/auth/refresh', {}, { withCredentials: true })
        processQueue(null)
        return api(original)
      } catch (refreshErr) {
        processQueue(refreshErr)
        // Refresh failed — clear local state and send to login
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:logout'))
        }
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(err)
  }
)

export default api
