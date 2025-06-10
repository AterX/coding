import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/avatars');
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id;
    const extension = path.extname(file.originalname);
    cb(null, `avatar-${userId}-${Date.now()}${extension}`);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Permitir solo imágenes
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

// Obtener perfil del usuario
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error al obtener perfil:', error);
      return res.status(500).json({ error: 'Error al obtener perfil' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar perfil del usuario
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { full_name, bio, website, location } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (bio !== undefined) updateData.bio = bio;
    if (website !== undefined) updateData.website = website;
    if (location !== undefined) updateData.location = location;

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar perfil:', error);
      return res.status(500).json({ error: 'Error al actualizar perfil' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Subir avatar
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' });
    }

    // Construir URL del avatar
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Actualizar avatar_url en la base de datos
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar avatar:', error);
      // Eliminar archivo subido si hay error en la base de datos
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ error: 'Error al actualizar avatar' });
    }

    res.json({ 
      message: 'Avatar actualizado correctamente',
      avatar_url: avatarUrl,
      profile
    });
  } catch (error) {
    console.error('Error en uploadAvatar:', error);
    // Eliminar archivo subido si hay error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};