-- Esquemas de base de datos para DevibeCoding
-- Ejecutar estos comandos en el SQL Editor de Supabase

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de perfiles de usuario (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  github_username TEXT,
  twitter_username TEXT,
  linkedin_username TEXT,
  location TEXT,
  skills TEXT[], -- Array de habilidades
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  is_verified BOOLEAN DEFAULT FALSE,
  reputation_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de proyectos 
 CREATE TABLE IF NOT EXISTS public.projects ( 
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, 
   title TEXT NOT NULL, 
   description TEXT NOT NULL, 
   content TEXT, -- Contenido detallado del proyecto 
   image_url TEXT, 
   demo_url TEXT, 
   github_url TEXT, 
   technologies TEXT[] NOT NULL, -- Array de tecnologías 
   difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner', 
   category TEXT NOT NULL, 
   tags TEXT[], -- Array de tags 
   author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, 
   likes_count INTEGER DEFAULT 0, 
   views_count INTEGER DEFAULT 0, 
   comments_count INTEGER DEFAULT 0, 
   is_featured BOOLEAN DEFAULT FALSE, 
   is_published BOOLEAN DEFAULT TRUE, 
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
 );

-- Tabla de ideas 
 CREATE TABLE IF NOT EXISTS public.ideas ( 
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, 
   title TEXT NOT NULL, 
   description TEXT NOT NULL, 
   content TEXT, -- Contenido detallado de la idea 
   category TEXT NOT NULL, 
   tags TEXT[], -- Array de tags 
   difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner', 
   estimated_time TEXT, -- Tiempo estimado de desarrollo 
   required_skills TEXT[], -- Habilidades requeridas 
   author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, 
   likes_count INTEGER DEFAULT 0, 
   views_count INTEGER DEFAULT 0, 
   comments_count INTEGER DEFAULT 0, 
   implementation_count INTEGER DEFAULT 0, -- Cuántas veces se ha implementado 
   is_featured BOOLEAN DEFAULT FALSE, 
   is_published BOOLEAN DEFAULT TRUE, 
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
 );

-- Tabla de likes para proyectos 
 CREATE TABLE IF NOT EXISTS public.project_likes ( 
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, 
   project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE, 
   user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, 
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
   UNIQUE(project_id, user_id) 
 );

-- Tabla de likes para ideas 
 CREATE TABLE IF NOT EXISTS public.idea_likes ( 
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, 
   idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE, 
   user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, 
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
   UNIQUE(idea_id, user_id) 
 );

-- Tabla de comentarios para proyectos
CREATE TABLE IF NOT EXISTS public.project_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.project_comments(id) ON DELETE CASCADE, -- Para respuestas
  likes_count INTEGER DEFAULT 0,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de comentarios para ideas
CREATE TABLE IF NOT EXISTS public.idea_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.idea_comments(id) ON DELETE CASCADE, -- Para respuestas
  likes_count INTEGER DEFAULT 0,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de seguidores
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);


-- Tabla de recursos
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('tutorial', 'video', 'code', 'article')), -- Tipo de recurso
  tags TEXT[], -- Array de tags
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de likes para recursos
CREATE TABLE IF NOT EXISTS public.resource_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(resource_id, user_id)
);

-- Tabla de comentarios para recursos
CREATE TABLE IF NOT EXISTS public.resource_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.resource_comments(id) ON DELETE CASCADE, -- Para respuestas
  likes_count INTEGER DEFAULT 0,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de implementaciones de ideas
CREATE TABLE IF NOT EXISTS public.idea_implementations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
  implementer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL, -- Proyecto resultante
  status TEXT CHECK (status IN ('planning', 'in_progress', 'completed', 'abandoned')) DEFAULT 'planning',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_projects_author_id ON public.projects(author_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_likes_count ON public.projects(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON public.projects(is_featured) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_ideas_author_id ON public.ideas(author_id);
CREATE INDEX IF NOT EXISTS idx_ideas_category ON public.ideas(category);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON public.ideas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ideas_likes_count ON public.ideas(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_ideas_is_featured ON public.ideas(is_featured) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_project_likes_project_id ON public.project_likes(project_id);
CREATE INDEX IF NOT EXISTS idx_project_likes_user_id ON public.project_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_idea_likes_idea_id ON public.idea_likes(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_likes_user_id ON public.idea_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_project_comments_project_id ON public.project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_idea_comments_idea_id ON public.idea_comments(idea_id);

CREATE INDEX IF NOT EXISTS idx_resources_author_id ON public.resources(author_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_likes_count ON public.resources(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_resources_is_featured ON public.resources(is_featured) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_resource_likes_resource_id ON public.resource_likes(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_likes_user_id ON public.resource_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_resource_comments_resource_id ON public.resource_comments(resource_id);

-- Triggers para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_ideas_updated_at BEFORE UPDATE ON public.ideas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_project_comments_updated_at BEFORE UPDATE ON public.project_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_idea_comments_updated_at BEFORE UPDATE ON public.idea_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_resource_comments_updated_at BEFORE UPDATE ON public.resource_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers para actualizar contadores automáticamente
CREATE OR REPLACE FUNCTION update_project_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.projects 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.project_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.projects 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.project_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_resource_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.resources
        SET likes_count = likes_count + 1
        WHERE id = NEW.resource_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.resources
        SET likes_count = likes_count - 1
        WHERE id = OLD.resource_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_resource_likes_count_trigger
AFTER INSERT OR DELETE ON public.resource_likes
    FOR EACH ROW EXECUTE FUNCTION update_resource_likes_count();

CREATE OR REPLACE FUNCTION update_resource_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.resources
        SET comments_count = comments_count + 1
        WHERE id = NEW.resource_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.resources
        SET comments_count = comments_count - 1
        WHERE id = OLD.resource_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_resource_comments_count_trigger
AFTER INSERT OR DELETE ON public.resource_comments
    FOR EACH ROW EXECUTE FUNCTION update_resource_comments_count();

CREATE OR REPLACE TRIGGER project_likes_count_trigger
    AFTER INSERT OR DELETE ON public.project_likes
    FOR EACH ROW EXECUTE FUNCTION update_project_likes_count();

CREATE OR REPLACE FUNCTION update_idea_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.ideas 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.idea_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.ideas 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.idea_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';


CREATE OR REPLACE TRIGGER idea_likes_count_trigger
    AFTER INSERT OR DELETE ON public.idea_likes
    FOR EACH ROW EXECUTE FUNCTION update_idea_likes_count();

-- Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NULL  -- Inicializar avatar_url como null por defecto
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Políticas de seguridad RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_implementations ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY IF NOT EXISTS "Los perfiles son visibles públicamente" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Políticas para projects
CREATE POLICY IF NOT EXISTS "Los proyectos publicados son visibles públicamente" ON public.projects
    FOR SELECT USING (is_published = true);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden ver sus propios proyectos" ON public.projects
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden crear proyectos" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden actualizar sus propios proyectos" ON public.projects
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden eliminar sus propios proyectos" ON public.projects
    FOR DELETE USING (auth.uid() = author_id);

-- Políticas para ideas
CREATE POLICY IF NOT EXISTS "Las ideas publicadas son visibles públicamente" ON public.ideas
    FOR SELECT USING (is_published = true);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden ver sus propias ideas" ON public.ideas
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden crear ideas" ON public.ideas
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden actualizar sus propias ideas" ON public.ideas
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden eliminar sus propias ideas" ON public.ideas
    FOR DELETE USING (auth.uid() = author_id);

-- Políticas para likes
CREATE POLICY IF NOT EXISTS "Los likes son visibles públicamente" ON public.project_likes
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden dar like" ON public.project_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden quitar su like" ON public.project_likes
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Los likes de ideas son visibles públicamente" ON public.idea_likes
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden dar like a ideas" ON public.idea_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden quitar su like de ideas" ON public.idea_likes
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para comentarios
CREATE POLICY IF NOT EXISTS "Los comentarios son visibles públicamente" ON public.project_comments
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden crear comentarios" ON public.project_comments
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden actualizar sus comentarios" ON public.project_comments
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden eliminar sus comentarios" ON public.project_comments
    FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY IF NOT EXISTS "Los comentarios de ideas son visibles públicamente" ON public.idea_comments
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden crear comentarios en ideas" ON public.idea_comments
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden actualizar sus comentarios en ideas" ON public.idea_comments
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY IF NOT EXISTS "Los usuarios pueden eliminar sus comentarios en ideas" ON public.idea_comments
    FOR DELETE USING (auth.uid() = author_id);