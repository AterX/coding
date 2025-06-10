import express from 'express';
import { getProfile, updateProfile, uploadAvatar, upload } from '../controllers/profileController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener perfil del usuario autenticado
router.get('/me', getProfile);

// Actualizar perfil del usuario autenticado
router.put('/me', updateProfile);

// Subir avatar
router.post('/me/avatar', upload.single('avatar'), uploadAvatar);

export default router;