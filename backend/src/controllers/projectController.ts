import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient';

export interface Project {
  id?: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  author_id: string;
  github_url?: string;
  demo_url?: string;
  likes?: number;
  created_at?: string;
  updated_at?: string;
}

// Obtener todos los proyectos
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '30',
      category,
      difficulty,
      search,
      sort = 'popularity'
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    // Construir la consulta base
    let query = supabase
      .from('projects')
      .select(`
        *,
        author:profiles (
          id,
          full_name,
          username,
          avatar_url
        )
      `, { count: 'exact' });

    // Aplicar filtros
    if (category && category !== 'Todos') {
      query = query.eq('category', category);
    }

    if (difficulty && difficulty !== 'Todos') {
      query = query.eq('difficulty_level', difficulty);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Aplicar ordenamiento
    if (sort === 'popularity') {
      // Ordenar por popularidad (likes_count + comments_count) descendente, luego por fecha
      query = query.order('likes_count', { ascending: false })
                   .order('comments_count', { ascending: false })
                   .order('created_at', { ascending: false });
    } else if (sort === 'likes_count') {
      query = query.order('likes_count', { ascending: false });
    } else if (sort === 'comments_count') {
      query = query.order('comments_count', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Aplicar paginación
    query = query.range(offset, offset + limitNum - 1);

    const { data: projects, error, count } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ error: 'Error al obtener los proyectos' });
    }

    // Si hay un usuario autenticado, verificar qué proyectos ha dado like
    let projectsWithLikes = projects;
    if (req.user?.id) {
      const projectIds = projects?.map(p => p.id) || [];
      if (projectIds.length > 0) {
        const { data: likes } = await supabase
          .from('project_likes')
          .select('project_id')
          .eq('user_id', req.user.id)
          .in('project_id', projectIds);

        const likedProjectIds = new Set(likes?.map(like => like.project_id) || []);
        projectsWithLikes = projects?.map(project => ({
          ...project,
          is_liked: likedProjectIds.has(project.id)
        })) || [];
      }
    }

    // Calcular información de paginación
    const totalPages = Math.ceil((count || 0) / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      projects: projectsWithLikes,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProjects: count || 0,
        hasNextPage,
        hasPrevPage,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Error in getAllProjects:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener un proyecto por ID
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: project, error } = await supabase
      .from('projects')
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
      console.error('Error fetching project:', error);
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    // Incrementar contador de vistas
    const { error: updateError } = await supabase
      .from('projects')
      .update({ views_count: project.views_count + 1 })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating views count:', updateError);
      // No retornamos error aquí para no afectar la respuesta principal
    } else {
      // Actualizar el proyecto con el nuevo contador
      project.views_count = project.views_count + 1;
    }

    res.json({ project });
  } catch (error) {
    console.error('Error in getProjectById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear un nuevo proyecto
export const createProject = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      description, 
      content,
      image_url, 
      technologies, 
      github_url, 
      demo_url,
      category,
      difficulty_level,
      tags
    } = req.body;
    const userId = req.user?.id; // Asumiendo que tenemos middleware de autenticación

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Título, descripción y categoría son requeridos' });
    }

    if (!technologies || technologies.length === 0) {
      return res.status(400).json({ error: 'Al menos una tecnología es requerida' });
    }

    const projectData = {
      title,
      description,
      content: content || null,
      image_url: image_url || null,
      technologies: technologies || [],
      author_id: userId,
      github_url: github_url || null,
      demo_url: demo_url || null,
      category,
      difficulty_level: difficulty_level || 'beginner',
      tags: tags || [],
      likes_count: 0,
      views_count: 0,
      comments_count: 0
    };

    const { data: project, error } = await supabase
      .from('projects')
      .insert([projectData])
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
      console.error('Error creating project:', error);
      return res.status(500).json({ error: 'Error al crear el proyecto', details: error.message });
    }

    res.status(201).json({ project });
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar un proyecto
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      content,
      image_url, 
      technologies, 
      github_url, 
      demo_url,
      category,
      difficulty_level,
      tags
    } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Verificar que el usuario es el autor del proyecto
    const { data: existingProject, error: fetchError } = await supabase
      .from('projects')
      .select('author_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingProject) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    if (existingProject.author_id !== userId) {
      return res.status(403).json({ error: 'No tienes permisos para editar este proyecto' });
    }

    const updateData = {
      title,
      description,
      content,
      image_url,
      technologies,
      github_url,
      demo_url,
      category,
      difficulty_level,
      tags,
      updated_at: new Date().toISOString()
    };

    // Remover campos undefined/null para evitar sobrescribir con valores vacíos
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    const { data: project, error } = await supabase
      .from('projects')
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
      console.error('Error updating project:', error);
      return res.status(500).json({ error: 'Error al actualizar el proyecto' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Error in updateProject:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar un proyecto
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Verificar que el usuario es el autor del proyecto
    const { data: existingProject, error: fetchError } = await supabase
      .from('projects')
      .select('author_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingProject) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    if (existingProject.author_id !== userId) {
      return res.status(403).json({ error: 'No tienes permisos para eliminar este proyecto' });
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return res.status(500).json({ error: 'Error al eliminar el proyecto' });
    }

    res.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    console.error('Error in deleteProject:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Dar like a un proyecto
export const likeProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Verificar si ya le dio like
    const { data: existingLike, error: likeError } = await supabase
      .from('project_likes')
      .select('id')
      .eq('project_id', id)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      return res.status(400).json({ error: 'Ya le diste like a este proyecto' });
    }

    // Agregar like
    const { error: insertError } = await supabase
      .from('project_likes')
      .insert([{ project_id: id, user_id: userId }]);

    if (insertError) {
      console.error('Error adding like:', insertError);
      return res.status(500).json({ error: 'Error al dar like al proyecto' });
    }

    // Actualizar contador de likes
    const { error: updateError } = await supabase
      .rpc('increment_project_likes', { project_id: id });

    if (updateError) {
      console.error('Error updating like count:', updateError);
    }

    res.json({ message: 'Like agregado correctamente' });
  } catch (error) {
    console.error('Error in likeProject:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Quitar like de un proyecto
export const unlikeProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Eliminar like
    const { error: deleteError } = await supabase
      .from('project_likes')
      .delete()
      .eq('project_id', id)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error removing like:', deleteError);
      return res.status(500).json({ error: 'Error al quitar like del proyecto' });
    }

    // Actualizar contador de likes
    const { error: updateError } = await supabase
      .rpc('decrement_project_likes', { project_id: id });

    if (updateError) {
      console.error('Error updating like count:', updateError);
    }

    res.json({ message: 'Like removido correctamente' });
  } catch (error) {
    console.error('Error in unlikeProject:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener comentarios de un proyecto
export const getProjectComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: comments, error } = await supabase
      .from('project_comments')
      .select(`
        *,
        author:profiles (
          id,
          full_name,
          username,
          avatar_url
        )
      `)
      .eq('project_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ error: 'Error al obtener los comentarios' });
    }

    res.json({ comments: comments || [] });
  } catch (error) {
    console.error('Error in getProjectComments:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear un comentario en un proyecto
export const createProjectComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'El contenido del comentario es requerido' });
    }

    // Verificar que el proyecto existe
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    // Crear el comentario
    const { data: comment, error: commentError } = await supabase
      .from('project_comments')
      .insert({
        project_id: id,
        author_id: userId,
        content: content.trim()
      })
      .select(`
        *,
        author:profiles (
          id,
          full_name,
          username,
          avatar_url
        )
      `)
      .single();

    if (commentError) {
      console.error('Error creating comment:', commentError);
      return res.status(500).json({ error: 'Error al crear el comentario' });
    }

    res.status(201).json({ comment });
  } catch (error) {
    console.error('Error in createProjectComment:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};