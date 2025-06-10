-- Script para verificar el estado de los triggers y diagnosticar el problema

-- 1. Verificar si los triggers existen
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name LIKE '%comments_count%';

-- 2. Verificar si las funciones existen
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%comments_count%';

-- 3. Verificar contadores actuales vs conteos reales
SELECT 
    p.id,
    p.title,
    p.comments_count as stored_count,
    COUNT(pc.id) as actual_count,
    (p.comments_count - COUNT(pc.id)) as difference
FROM projects p
LEFT JOIN project_comments pc ON p.id = pc.project_id
GROUP BY p.id, p.title, p.comments_count
HAVING p.comments_count != COUNT(pc.id)
ORDER BY difference DESC;

-- 4. Verificar comentarios recientes
SELECT 
    pc.id,
    pc.project_id,
    pc.content,
    pc.created_at,
    p.title as project_title,
    p.comments_count
FROM project_comments pc
JOIN projects p ON pc.project_id = p.id
ORDER BY pc.created_at DESC
LIMIT 10;

-- 5. Verificar si hay comentarios del usuario Adrian
SELECT 
    pc.id,
    pc.project_id,
    pc.content,
    pc.created_at,
    pr.full_name,
    pr.username,
    p.title as project_title,
    p.comments_count
FROM project_comments pc
JOIN profiles pr ON pc.author_id = pr.id
JOIN projects p ON pc.project_id = p.id
WHERE pr.full_name ILIKE '%adrian%' OR pr.username ILIKE '%adrian%'
ORDER BY pc.created_at DESC;