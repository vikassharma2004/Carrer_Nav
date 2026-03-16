import api from './api'

const progressService = {
  /** POST /progress/start — start a task */
  startTask: (taskId) =>
    api.post('/progress/start', { taskId }).then((r) => r.data),

  /** POST /progress/complete — mark task as complete */
  completeTask: (taskId) =>
    api.post('/progress/complete', { taskId }).then((r) => r.data),

  /** GET /progress/roadmaps/:roadmapId — get learner's progress on a roadmap */
  getRoadmapProgress: (roadmapId) =>
    api.get(`/progress/roadmaps/${roadmapId}`).then((r) => r.data),
}

export default progressService
