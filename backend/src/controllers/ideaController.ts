import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient';

export interface Idea {
  id?: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author_id: string;
  likes?: number;
  created_at?: string;
  updated_at?: string;
}

// Obtener todas las ideas
export const getAllIdeas = async (req: Request, res: Response) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;
    
    let query = supabase
      .from('ideas')
      .select(`
        *,
        author:profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: ideas, error } = await query;

    if (error) {
      console.error('Error fetching ideas:', error);
      return res.status(500).json({ error: 'Error al obtener las ideas' });
    }

    res.json({ ideas });
  } catch (error) {
    console.error('Error in getAllIdeas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener una idea por ID
export const getIdeaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: idea, error } = await supabase
      .from('ideas')
      .select(`
        *,
        author:profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching idea:', error);
      return res.status(404).json({ error: 'Idea no encontrada' });
    }

    res.json({ idea });
  } catch (error) {
    console.error('Error in getIdeaById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear una nueva idea
export const createIdea = async (req: Request, res: Response) => {
  try {
    const { title, description, category, tags } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Título, descripción y categoría son requeridos' });
    }

    const ideaData: Omit<Idea, 'id' | 'likes'> = {
      title,
      description,
      category,
      tags: tags || [],
      author_id: userId
    };

    const { data: idea, error } = await supabase
      .from('ideas')
      .insert([ideaData])
      .select(`
        *,
        author:profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error creating idea:', error);
      return res.status(500).json({ error: 'Error al crear la idea' });
    }

    res.status(201).json({ idea });
  } catch (error) {
    console.error('Error in createIdea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar una idea
export const updateIdea = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category, tags } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Verificar que el usuario es el autor de la idea
    const { data: existingIdea, error: fetchError } = await supabase
      .from('ideas')
      .select('author_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingIdea) {
      return res.status(404).json({ error: 'Idea no encontrada' });
    }

    if (existingIdea.author_id !== userId) {
      return res.status(403).json({ error: 'No tienes permisos para editar esta idea' });
    }

    const updateData: Partial<Idea> = {
      title,
      description,
      category,
      tags,
      updated_at: new Date().toISOString()
    };

    const { data: idea, error } = await supabase
      .from('ideas')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        author:profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error updating idea:', error);
      return res.status(500).json({ error: 'Error al actualizar la idea' });
    }

    res.json({ idea });
  } catch (error) {
    console.error('Error in updateIdea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar una idea
export const deleteIdea = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Verificar que el usuario es el autor de la idea
    const { data: existingIdea, error: fetchError } = await supabase
      .from('ideas')
      .select('author_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingIdea) {
      return res.status(404).json({ error: 'Idea no encontrada' });
    }

    if (existingIdea.author_id !== userId) {
      return res.status(403).json({ error: 'No tienes permisos para eliminar esta idea' });
    }

    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting idea:', error);
      return res.status(500).json({ error: 'Error al eliminar la idea' });
    }

    res.json({ message: 'Idea eliminada correctamente' });
  } catch (error) {
    console.error('Error in deleteIdea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Dar like a una idea
export const likeIdea = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Verificar si ya le dio like
    const { data: existingLike, error: likeError } = await supabase
      .from('idea_likes')
      .select('id')
      .eq('idea_id', id)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      return res.status(400).json({ error: 'Ya le diste like a esta idea' });
    }

    // Agregar like
    const { error: insertError } = await supabase
      .from('idea_likes')
      .insert([{ idea_id: id, user_id: userId }]);

    if (insertError) {
      console.error('Error adding like:', insertError);
      return res.status(500).json({ error: 'Error al dar like a la idea' });
    }

    // Actualizar contador de likes
    const { error: updateError } = await supabase
      .rpc('increment_idea_likes', { idea_id: id });

    if (updateError) {
      console.error('Error updating like count:', updateError);
    }

    res.json({ message: 'Like agregado correctamente' });
  } catch (error) {
    console.error('Error in likeIdea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Quitar like de una idea
export const unlikeIdea = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Eliminar like
    const { error: deleteError } = await supabase
      .from('idea_likes')
      .delete()
      .eq('idea_id', id)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error removing like:', deleteError);
      return res.status(500).json({ error: 'Error al quitar like de la idea' });
    }

    // Actualizar contador de likes
    const { error: updateError } = await supabase
      .rpc('decrement_idea_likes', { idea_id: id });

    if (updateError) {
      console.error('Error updating like count:', updateError);
    }

    res.json({ message: 'Like removido correctamente' });
  } catch (error) {
    console.error('Error in unlikeIdea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};