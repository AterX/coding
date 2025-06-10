-- Script para crear la tabla resources en Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase

-- Habilitar extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de recursos
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('tutorial', 'video', 'code', 'article')), -- Tipo de recurso
  tags TEXT[], -- Array de tags
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_resources_author_id ON public.resources(author_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_likes_count ON public.resources(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_resources_is_featured ON public.resources(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_resources_is_published ON public.resources(is_published) WHERE is_published = true;

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Política para permitir que todos puedan leer recursos publicados
CREATE POLICY "Los recursos publicados son visibles para todos" ON public.resources
  FOR SELECT USING (is_published = true);

-- Política para permitir que los usuarios autenticados creen recursos
CREATE POLICY "Los usuarios autenticados pueden crear recursos" ON public.resources
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir que los autores editen sus propios recursos
CREATE POLICY "Los autores pueden editar sus propios recursos" ON public.resources
  FOR UPDATE USING (auth.uid() = author_id);

-- Política para permitir que los autores eliminen sus propios recursos
CREATE POLICY "Los autores pueden eliminar sus propios recursos" ON public.resources
  FOR DELETE USING (auth.uid() = author_id);

-- Crear tabla de likes para recursos
CREATE TABLE IF NOT EXISTS public.resource_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(resource_id, user_id)
);

-- Crear índices para la tabla de likes
CREATE INDEX IF NOT EXISTS idx_resource_likes_resource_id ON public.resource_likes(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_likes_user_id ON public.resource_likes(user_id);

-- Habilitar RLS para resource_likes
ALTER TABLE public.resource_likes ENABLE ROW LEVEL SECURITY;

-- Políticas para resource_likes
CREATE POLICY "Todos pueden ver los likes" ON public.resource_likes
  FOR SELECT USING (true);

CREATE POLICY "Los usuarios autenticados pueden dar like" ON public.resource_likes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden quitar su propio like" ON public.resource_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Crear tabla de comentarios para recursos
CREATE TABLE IF NOT EXISTS public.resource_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.resource_comments(id) ON DELETE CASCADE, -- Para respuestas
  likes_count INTEGER DEFAULT 0,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para la tabla de comentarios
CREATE INDEX IF NOT EXISTS idx_resource_comments_resource_id ON public.resource_comments(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_comments_author_id ON public.resource_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_resource_comments_parent_id ON public.resource_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_resource_comments_created_at ON public.resource_comments(created_at DESC);

-- Habilitar RLS para resource_comments
ALTER TABLE public.resource_comments ENABLE ROW LEVEL SECURITY;

-- Políticas para resource_comments
CREATE POLICY "Todos pueden ver los comentarios" ON public.resource_comments
  FOR SELECT USING (true);

CREATE POLICY "Los usuarios autenticados pueden comentar" ON public.resource_comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

CREATE POLICY "Los autores pueden editar sus comentarios" ON public.resource_comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Los autores pueden eliminar sus comentarios" ON public.resource_comments
  FOR DELETE USING (auth.uid() = author_id);