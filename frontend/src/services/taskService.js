import api from './api'

const taskService = {
  /**
   * GET /my-tasks?page=1&limit=10
   * Returns tasks from roadmaps the user is enrolled in.
   * Response shape: { data: Task[], pagination: { total, page, limit, totalPages, hasNext, hasPrev } }
   */
  getUserTasks: ({ page = 1, limit = 100 } = {}) =>
    api.get('/my-tasks', { params: { page, limit } }).then((r) => r.data),
}

export default taskService
