import { Router } from 'express';
import {
  createResource,
  getAllResources, // Descomentado e importado
  // getResourceById,
  // updateResource,
  // deleteResource
} from '../controllers/resourceController';
import { authenticateToken, optionalAuth } from '../middlewares/auth';

const router = Router();

// Rutas protegidas (requieren autenticación)
router.post('/', authenticateToken, createResource);

// Ruta para obtener todos los recursos (puede ser pública o requerir autenticación opcional)
router.get('/', optionalAuth, getAllResources); // Descomentado y habilitado

// TODO: Implementar rutas para GET (por ID), PUT, DELETE
// router.get('/:id', optionalAuth, getResourceById);
// router.put('/:id', authenticateToken, updateResource);
// router.delete('/:id', authenticateToken, deleteResource);

export default router;