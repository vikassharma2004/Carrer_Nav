import api from './api'

/**
 * Sequential publish flow:
 * roadmap → modules → tasks → resources → projects → project-resources → publish
 *
 * Server route mounts (from app.js):
 *  /api/v1/roadmap   → RoadmapRouter + RoadmapModuleRouter + ProjectRouter
 *  /api/v1/modules   → RoadmapTaskRouter
 *  /api/v1/tasks     → ResourceRouter
 *  /api/v1/projects  → ProjectResourceRouter
 */

const roadmapBuilderService = {
  /* ── CREATE ─────────────────────────────────────────────────── */

  /** POST /roadmap */
  createRoadmap: (data) =>
    api.post('/roadmap', data).then((r) => r.data),

  /** POST /roadmap/:roadmapId/modules */
  createModule: (roadmapId, data) =>
    api.post(`/roadmap/${roadmapId}/modules`, data).then((r) => r.data),

  /** POST /modules/:moduleId/tasks */
  createTask: (moduleId, data) =>
    api.post(`/modules/${moduleId}/tasks`, data).then((r) => r.data),

  /** POST /tasks/:taskId/resources */
  createResource: (taskId, data) =>
    api.post(`/tasks/${taskId}/resources`, data).then((r) => r.data),

  /** POST /roadmap/:roadmapId/projects */
  createProject: (roadmapId, data) =>
    api.post(`/roadmap/${roadmapId}/projects`, data).then((r) => r.data),

  /** POST /projects/:projectId/resources */
  createProjectResource: (projectId, data) =>
    api.post(`/projects/${projectId}/resources`, data).then((r) => r.data),

  /** PATCH /roadmap/:id/publish */
  publishRoadmap: (id) =>
    api.patch(`/roadmap/${id}/publish`).then((r) => r.data),

  /* ── UPDATE ─────────────────────────────────────────────────── */

  /** PATCH /roadmap/:id */
  updateRoadmap: (id, data) =>
    api.patch(`/roadmap/${id}`, data).then((r) => r.data),

  /** PATCH /roadmap/modules/:id */
  updateModule: (id, data) =>
    api.patch(`/roadmap/modules/${id}`, data).then((r) => r.data),

  /** PATCH /modules/tasks/:id */
  updateTask: (id, data) =>
    api.patch(`/modules/tasks/${id}`, data).then((r) => r.data),

  /** PATCH /tasks/resources/:id */
  updateResource: (id, data) =>
    api.patch(`/tasks/resources/${id}`, data).then((r) => r.data),

  /** PATCH /roadmap/projects/:id */
  updateProject: (id, data) =>
    api.patch(`/roadmap/projects/${id}`, data).then((r) => r.data),

  /** PATCH /projects/resources/:id */
  updateProjectResource: (id, data) =>
    api.patch(`/projects/resources/${id}`, data).then((r) => r.data),

  /* ── DELETE ─────────────────────────────────────────────────── */

  /** DELETE /roadmap/modules/:id */
  deleteModule: (id) =>
    api.delete(`/roadmap/modules/${id}`).then((r) => r.data),

  /** DELETE /modules/tasks/:id */
  deleteTask: (id) =>
    api.delete(`/modules/tasks/${id}`).then((r) => r.data),

  /** DELETE /tasks/resources/:id */
  deleteResource: (id) =>
    api.delete(`/tasks/resources/${id}`).then((r) => r.data),

  /** DELETE /roadmap/projects/:id */
  deleteProject: (id) =>
    api.delete(`/roadmap/projects/${id}`).then((r) => r.data),

  /** DELETE /projects/resources/:id */
  deleteProjectResource: (id) =>
    api.delete(`/projects/resources/${id}`).then((r) => r.data),
}

export default roadmapBuilderService
