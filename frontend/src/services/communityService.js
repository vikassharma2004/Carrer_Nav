import api from './api'

const communityService = {
  /** GET /communities/me */
  getMyCommunities: () =>
    api.get('/communities/me').then((r) => r.data),

  /** GET /communities/:id */
  getById: (id) =>
    api.get(`/communities/${id}`).then((r) => r.data),

  /** GET /communities/:id/messages?page=1&limit=50 */
  getMessages: (id, params = {}) =>
    api.get(`/communities/${id}/messages`, { params }).then((r) => r.data),

  /** POST /communities/:id/messages */
  sendMessage: (id, data) =>
    api.post(`/communities/${id}/messages`, data).then((r) => r.data),

  /** PATCH /communities/:id/messages/:messageId */
  editMessage: (id, messageId, content) =>
    api.patch(`/communities/${id}/messages/${messageId}`, { content }).then((r) => r.data),

  /** DELETE /communities/:id/messages/:messageId */
  deleteMessage: (id, messageId) =>
    api.delete(`/communities/${id}/messages/${messageId}`).then((r) => r.data),

  /** POST /communities/:id/messages/:messageId/reactions */
  addReaction: (id, messageId, emoji) =>
    api.post(`/communities/${id}/messages/${messageId}/reactions`, { emoji }).then((r) => r.data),

  /** DELETE /communities/:id/messages/:messageId/reactions */
  removeReaction: (id, messageId, emoji) =>
    api.delete(`/communities/${id}/messages/${messageId}/reactions`, { data: { emoji } }).then((r) => r.data),

  /** PATCH /communities/:id/messages/:messageId/pin */
  pinMessage: (id, messageId) =>
    api.patch(`/communities/${id}/messages/${messageId}/pin`).then((r) => r.data),

  /** PATCH /communities/:id/messages/:messageId/unpin */
  unpinMessage: (id, messageId) =>
    api.patch(`/communities/${id}/messages/${messageId}/unpin`).then((r) => r.data),

  /** PATCH /communities/:id/read */
  markRead: (id, messageId) =>
    api.patch(`/communities/${id}/read`, { messageId }).then((r) => r.data),

  /** GET /communities/:id/members */
  getMembers: (id) =>
    api.get(`/communities/${id}/members`).then((r) => r.data),

  /** DELETE /communities/:id/members/:userId */
  removeMember: (id, userId) =>
    api.delete(`/communities/${id}/members/${userId}`).then((r) => r.data),

  /** PATCH /communities/:id/members/:userId/mute */
  muteMember: (id, userId) =>
    api.patch(`/communities/${id}/members/${userId}/mute`).then((r) => r.data),

  /** PATCH /communities/:id/members/:userId/unmute */
  unmuteMember: (id, userId) =>
    api.patch(`/communities/${id}/members/${userId}/unmute`).then((r) => r.data),

  /** POST /communities/:id/leave */
  leave: (id) =>
    api.post(`/communities/${id}/leave`).then((r) => r.data),

  /** PATCH /communities/:id/mute (mute self) */
  muteSelf: (id) =>
    api.patch(`/communities/${id}/mute`).then((r) => r.data),

  /** PATCH /communities/:id/unmute (unmute self) */
  unmuteSelf: (id) =>
    api.patch(`/communities/${id}/unmute`).then((r) => r.data),
}

export default communityService
