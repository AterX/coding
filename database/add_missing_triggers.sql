-- Script para agregar los triggers faltantes para contadores de comentarios
-- Ejecutar este script en el SQL Editor de Supabase

-- Función para actualizar contador de comentarios de proyectos
CREATE OR REPLACE FUNCTION update_project_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.projects
        SET comments_count = comments_count + 1
        WHERE id = NEW.project_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.projects
        SET comments_count = comments_count - 1
        WHERE id = OLD.project_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_project_comments_count_trigger
AFTER INSERT OR DELETE ON public.project_comments
    FOR EACH ROW EXECUTE FUNCTION update_project_comments_count();

-- Función para actualizar contador de comentarios de ideas
CREATE OR REPLACE FUNCTION update_idea_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.ideas
        SET comments_count = comments_count + 1
        WHERE id = NEW.idea_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.ideas
        SET comments_count = comments_count - 1
        WHERE id = OLD.idea_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_idea_comments_count_trigger
AFTER INSERT OR DELETE ON public.idea_comments
    FOR EACH ROW EXECUTE FUNCTION update_idea_comments_count();

-- Actualizar contadores existentes para proyectos
UPDATE public.projects SET comments_count = (
    SELECT COUNT(*) FROM public.project_comments 
    WHERE project_comments.project_id = projects.id
);

-- Actualizar contadores existentes para ideas
UPDATE public.ideas SET comments_count = (
    SELECT COUNT(*) FROM public.idea_comments 
    WHERE idea_comments.idea_id = ideas.id
);