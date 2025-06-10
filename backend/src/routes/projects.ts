import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  likeProject,
  unlikeProject,
  getProjectComments,
  createProjectComment
} from '../controllers/projectController';
import { authenticateToken, optionalAuth } from '../middlewares/auth';

const router = Router();

// Rutas públicas (no requieren autenticación)
router.get('/', optionalAuth, getAllProjects);
router.get('/:id', optionalAuth, getProjectById);
router.get('/:id/comments', getProjectComments);

// Rutas protegidas (requieren autenticación)
router.post('/', authenticateToken, createProject);
router.put('/:id', authenticateToken, updateProject);
router.delete('/:id', authenticateToken, deleteProject);
router.post('/:id/like', authenticateToken, likeProject);
router.delete('/:id/like', authenticateToken, unlikeProject);
router.post('/:id/comments', authenticateToken, createProjectComment);

export default router;