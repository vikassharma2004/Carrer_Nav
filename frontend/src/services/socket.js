import { io } from 'socket.io-client'

let socket = null

export function getSocket() {
  return socket
}

export function connectSocket() {
  if (socket?.connected) return socket

  socket = io('http://localhost:5000', {
    withCredentials: true,  // sends httpOnly accessToken cookie automatically
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  socket.on('connect', () => {
    console.log('[Socket] connected:', socket.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('[Socket] disconnected:', reason)
  })

  socket.on('connect_error', (err) => {
    console.warn('[Socket] connection error:', err.message)
  })

  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

/** Join a community room */
export function joinCommunity(communityId, cb) {
  const s = getSocket()
  if (!s) return
  s.emit('community:join', { communityId }, cb)
}

/** Leave a community room */
export function leaveCommunity(communityId) {
  const s = getSocket()
  if (!s) return
  s.emit('community:leave', { communityId })
}

/** Emit typing indicator */
export function emitTyping(communityId, isTyping) {
  const s = getSocket()
  if (!s) return
  s.emit('community:typing', { communityId, isTyping })
}

/** Send a message via socket */
export function sendSocketMessage(communityId, content, cb) {
  const s = getSocket()
  if (!s) return
  s.emit('community:message:send', { communityId, content }, cb)
}

/** Edit a message via socket */
export function editSocketMessage(communityId, messageId, content, cb) {
  const s = getSocket()
  if (!s) return
  s.emit('community:message:edit', { communityId, messageId, content }, cb)
}

/** Delete a message via socket */
export function deleteSocketMessage(communityId, messageId, cb) {
  const s = getSocket()
  if (!s) return
  s.emit('community:message:delete', { communityId, messageId }, cb)
}

/** React to a message via socket */
export function reactSocketMessage(communityId, messageId, emoji, cb) {
  const s = getSocket()
  if (!s) return
  s.emit('community:message:react', { communityId, messageId, emoji }, cb)
}

/** Unreact to a message via socket */
export function unreactSocketMessage(communityId, messageId, emoji, cb) {
  const s = getSocket()
  if (!s) return
  s.emit('community:message:unreact', { communityId, messageId, emoji }, cb)
}

/** Mark community as read via socket */
export function markReadSocket(communityId, messageId) {
  const s = getSocket()
  if (!s) return
  s.emit('community:read', { communityId, messageId })
}
