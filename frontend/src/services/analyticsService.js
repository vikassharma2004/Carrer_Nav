import api from './api'

const analyticsService = {
  getLearner: () => api.get('/analytics/learner').then((r) => r.data),
  getMentor:  () => api.get('/analytics/mentor').then((r) => r.data),
}

export default analyticsService
