import api from './api'

const enrollmentService = {
  /** POST /roadmaps/:roadmapId/enroll — enroll in a roadmap */
  enroll: (roadmapId) =>
    api.post(`/roadmaps/${roadmapId}/enroll`).then((r) => r.data),

  /** DELETE /roadmaps/:roadmapId/enroll — drop enrollment */
  drop: (roadmapId) =>
    api.delete(`/roadmaps/${roadmapId}/enroll`).then((r) => r.data),

  /** GET /me/enrollments — get all user enrollments */
  getMyEnrollments: () =>
    api.get('/me/enrollments').then((r) => r.data),

  /** GET /me/enrollments/tasks — get tasks for all user enrollments */
  getTasksForMyEnrollments: () =>
    api.get('/modules/enrollments/tasks/all').then((r) => r.data),
}

export default enrollmentService
