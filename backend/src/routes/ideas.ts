import { Router } from 'express';
import {
  getAllIdeas,
  getIdeaById,
  createIdea,
  updateIdea,
  deleteIdea,
  likeIdea,
  unlikeIdea
} from '../controllers/ideaController';
import { authenticateToken, optionalAuth } from '../middlewares/auth';

const router = Router();

// Rutas públicas (no requieren autenticación)
router.get('/', optionalAuth, getAllIdeas);
router.get('/:id', optionalAuth, getIdeaById);

// Rutas protegidas (requieren autenticación)
router.post('/', authenticateToken, createIdea);
router.put('/:id', authenticateToken, updateIdea);
router.delete('/:id', authenticateToken, deleteIdea);
router.post('/:id/like', authenticateToken, likeIdea);
router.delete('/:id/like', authenticateToken, unlikeIdea);

export default router;