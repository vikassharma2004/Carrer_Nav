import api from './api'

const adminService = {
  /* ── Users ─────────────────────────────────────── */
  getUsers: () => api.get('/role-profiles/'),
  updateUser: (userId, data) => api.patch(`/role-profiles/${userId}`, data),
  deleteUser: (userId) => api.delete(`/role-profiles/${userId}`),

  /* ── Mentor Onboarding ──────────────────────────── */
  getOnboardingRequests: () => api.get('/mentor-onboarding/'),
  reviewOnboarding: (id, action) =>
    api.patch(`/mentor-onboarding/${id}/review`, { action }),

  /* ── Billing Plans ──────────────────────────────── */
  getBillingPlans: () => api.get('/billing/plans'),
  createBillingPlan: (data) => api.post('/billing/plans', data),
  updateBillingPlan: (id, data) => api.patch(`/billing/plans/${id}`, data),
  setDefaultPlan: (id) => api.patch(`/billing/plans/${id}/default`),
  setUserPlan: (userId, planId) =>
    api.patch(`/billing/usage/${userId}/plan`, { planId }),
}

export default adminService
