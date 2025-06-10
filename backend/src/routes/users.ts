import { Router } from 'express';
import { getUserStats } from '../controllers/userController';
import { authenticateToken } from '../middlewares/auth'; // Asumiendo que tienes un middleware de autenticación

const router = Router();

// Ruta para obtener estadísticas del usuario
router.get('/stats', authenticateToken, getUserStats);

export default router;