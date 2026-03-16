import api from './api'

const roadmapervice = {
  /** GET /roadmap — published list with filters */
  getPublished: (params = {}) =>
    api.get('/roadmap', { params }).then((r) => r.data),


  getById: (id) => api.get(`/roadmap/${id}`).then((r) => r.data),

  /** GET /roadmap/me — mentor's own roadmap */
  getMyroadmap: () => api.get('/roadmap/me').then((r) => r.data),

  /** GET /roadmap/:roadmapId/modules */
  getModules: (roadmapId) =>
    api.get(`/roadmap/${roadmapId}/modules`).then((r) => r.data),

  /** POST /roadmap */
  create: (data) => api.post('/roadmap', data).then((r) => r.data),

  /** PATCH /roadmap/:id */
  update: (id, data) => api.patch(`/roadmap/${id}`, data).then((r) => r.data),

  /** PATCH /roadmap/:id/publish */
  togglePublish: (id) =>
    api.patch(`/roadmap/${id}/publish`).then((r) => r.data),

  /** DELETE /roadmap/:id */
  remove: (id) => api.delete(`/roadmap/${id}`).then((r) => r.data),
}

export default roadmapervice
