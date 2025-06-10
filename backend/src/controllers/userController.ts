import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient'; // Asumiendo que usas Supabase

export const getUserStats = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user?.id; // Asumiendo que el middleware de autenticación añade 'user' a 'req'

  if (!userId) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }

  try {
    // Placeholder para la lógica de la base de datos
    // TODO: Implementar consultas reales a la base de datos para obtener las estadísticas
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id', { count: 'exact' })
      // @ts-ignore
      .eq('author_id', userId);

    const { data: ideas, error: ideasError } = await supabase
      .from('ideas')
      .select('id', { count: 'exact' })
      // @ts-ignore
      .eq('author_id', userId);
      
    // Placeholder para seguidores y likes, ya que no sé cómo están implementados
    const followerCount = 0; // Reemplazar con la lógica real
    const likeCount = 0; // Reemplazar con la lógica real

    if (projectsError || ideasError) {
      console.error('Error fetching stats:', projectsError, ideasError);
      return res.status(500).json({ message: 'Error al obtener estadísticas del usuario' });
    }

    res.status(200).json({
      // @ts-ignore
      projectCount: projects?.length || 0,
      // @ts-ignore
      ideaCount: ideas?.length || 0,
      followerCount,
      likeCount,
    });
  } catch (error) {
    console.error('Error en getUserStats:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};