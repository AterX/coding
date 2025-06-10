import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient';

export interface Resource {
  id?: string;
  title: string;
  description: string;
  url: string;
  type: string; // 'tutorial', 'video', 'code', 'article'
  tags: string[];
  author_id: string;
  created_at?: string;
  updated_at?: string;
}

// Crear un nuevo recurso
export const createResource = async (req: Request, res: Response) => {
  try {
    console.log('=== INICIO createResource ==>');
    console.log('Body recibido:', req.body);
    console.log('Usuario autenticado:', req.user);
    
    const { title, description, url, type, tags } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      console.log('Error: Usuario no autenticado');
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!title || !description || !url || !type || !tags || tags.length === 0) {
      console.log('Error: Campos faltantes');
      return res.status(400).json({ 
        error: 'Título, descripción, URL, tipo y al menos un tag son requeridos',
        received: { title: !!title, description: !!description, url: !!url, type: !!type, tags: tags?.length || 0 }
      });
    }

    const resourceData: Omit<Resource, 'id' | 'created_at' | 'updated_at'> = {
      title,
      description,
      url,
      type,
      tags,
      author_id: userId,
    };

    console.log('Datos a insertar:', resourceData);

    // Primero verificar si la tabla existe
    const { data: tableCheck, error: tableError } = await supabase
      .from('resources')
      .select('count')
      .limit(1);

    if (tableError) {
      console.error('Error verificando tabla resources:', tableError);
      return res.status(500).json({ 
        error: 'La tabla resources no existe en la base de datos. Por favor, ejecuta el script SQL para crear las tablas.',
        details: tableError.message,
        hint: 'Ejecuta el archivo database/schema.sql en tu base de datos Supabase'
      });
    }

    const { data, error } = await supabase
      .from('resources')
      .insert([resourceData])
      .select()
      .single();

    if (error) {
      console.error('Error creating resource:', error);
      return res.status(500).json({ 
        error: 'Error al crear el recurso', 
        details: error.message,
        code: error.code,
        hint: error.hint
      });
    }

    console.log('Recurso creado exitosamente:', data);
    res.status(201).json(data);
  } catch (error) {
    console.error('Unexpected error in createResource:', error);
    res.status(500).json({ 
      error: 'Error inesperado en el servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener todos los recursos
export const getAllResources = async (req: Request, res: Response) => {
  try {
    console.log('=== INICIO getAllResources ===');
    // Opcional: Implementar paginación o filtros si es necesario en el futuro
    // const { page = 1, limit = 10, type, tag } = req.query;

    const { data, error } = await supabase
      .from('resources')
      .select('*') // Selecciona todas las columnas
      .order('created_at', { ascending: false }); // Ordena por fecha de creación descendente

    if (error) {
      console.error('Error fetching resources:', error);
      return res.status(500).json({ 
        error: 'Error al obtener los recursos', 
        details: error.message,
        code: error.code,
        hint: error.hint
      });
    }

    console.log('Recursos obtenidos exitosamente:', data?.length);
    res.status(200).json({ data }); // Devuelve los datos dentro de un objeto 'data'

  } catch (error) {
    console.error('Unexpected error in getAllResources:', error);
    res.status(500).json({ 
      error: 'Error inesperado en el servidor al obtener recursos',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// TODO: Implementar getResourceById, updateResource, deleteResource