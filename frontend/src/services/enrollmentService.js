import api from './api'

const enrollmentService = {
  /** POST /roadmaps/:roadmapId/enroll — enroll in a roadmap */
  enroll: (roadmapId) =>
    api.post(`/roadmaps/${roadmapId}/enroll`).then((r) => r.data),

  /** DELETE /roadmaps/:roadmapId/enroll — drop enrollment */
  drop: (roadmapId) =>
    api.delete(`/roadmaps/${roadmapId}/enroll`).then((r) => r.data),

  /** GET /roadmaps/:roadmapId/enroll — check enrollment status */
  getStatus: (roadmapId) =>
    api.get(`/roadmaps/${roadmapId}/enroll`).then((r) => r.data),
}

export default enrollmentService
