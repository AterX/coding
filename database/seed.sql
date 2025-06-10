-- Datos de ejemplo para DevibeCoding
-- Ejecutar después de schema.sql

-- Insertar categorías y datos de ejemplo
-- Nota: Los IDs de usuario deben ser reemplazados por IDs reales de auth.users

-- Proyectos de ejemplo
INSERT INTO public.projects (
  id,
  title,
  description,
  content,
  image_url,
  demo_url,
  github_url,
  technologies,
  difficulty_level,
  category,
  tags,
  author_id,
  likes_count,
  views_count,
  is_featured,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Sistema de Gestión de Tareas con React y Node.js',
  'Una aplicación completa de gestión de tareas con autenticación, CRUD operations y dashboard interactivo.',
  'Este proyecto implementa un sistema completo de gestión de tareas utilizando React en el frontend y Node.js con Express en el backend. Incluye autenticación JWT, operaciones CRUD completas, filtros avanzados, y un dashboard con estadísticas en tiempo real.',
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
  'https://task-manager-demo.vercel.app',
  'https://github.com/ejemplo/task-manager',
  ARRAY['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Tailwind CSS'],
  'intermediate',
  'Web Development',
  ARRAY['fullstack', 'crud', 'authentication', 'dashboard'],
  '550e8400-e29b-41d4-a716-446655440000', -- Reemplazar con ID real
  45,
  320,
  true,
  NOW() - INTERVAL '5 days'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'API REST para E-commerce con Python y FastAPI',
  'API robusta para e-commerce con autenticación, gestión de productos, carrito de compras y procesamiento de pagos.',
  'Una API REST completa desarrollada con FastAPI que incluye todas las funcionalidades necesarias para un e-commerce: gestión de usuarios, productos, categorías, carrito de compras, órdenes y integración con pasarelas de pago.',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
  'https://ecommerce-api-docs.herokuapp.com',
  'https://github.com/ejemplo/ecommerce-api',
  ARRAY['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Stripe', 'Redis'],
  'advanced',
  'Backend Development',
  ARRAY['api', 'ecommerce', 'payments', 'database'],
  '550e8400-e29b-41d4-a716-446655440000',
  67,
  450,
  true,
  NOW() - INTERVAL '3 days'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'App Móvil de Clima con React Native',
  'Aplicación móvil que muestra el clima actual y pronóstico con geolocalización y notificaciones.',
  'Una aplicación móvil desarrollada con React Native que utiliza APIs de clima para mostrar información meteorológica en tiempo real, incluye geolocalización automática, búsqueda por ciudad, y notificaciones push para alertas climáticas.',
  'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=400&fit=crop',
  null,
  'https://github.com/ejemplo/weather-app',
  ARRAY['React Native', 'Expo', 'TypeScript', 'Weather API', 'AsyncStorage'],
  'beginner',
  'Mobile Development',
  ARRAY['mobile', 'weather', 'geolocation', 'api'],
  '550e8400-e29b-41d4-a716-446655440000',
  23,
  180,
  false,
  NOW() - INTERVAL '1 day'
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Dashboard de Analytics con Vue.js y D3.js',
  'Dashboard interactivo para visualización de datos con gráficos dinámicos y filtros avanzados.',
  'Un dashboard completo de analytics desarrollado con Vue.js que utiliza D3.js para crear visualizaciones de datos interactivas. Incluye múltiples tipos de gráficos, filtros en tiempo real, y exportación de reportes.',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
  'https://analytics-dashboard-demo.netlify.app',
  'https://github.com/ejemplo/analytics-dashboard',
  ARRAY['Vue.js', 'D3.js', 'Vuex', 'Chart.js', 'Sass', 'Webpack'],
  'intermediate',
  'Data Visualization',
  ARRAY['dashboard', 'analytics', 'charts', 'visualization'],
  '550e8400-e29b-41d4-a716-446655440000',
  34,
  275,
  false,
  NOW() - INTERVAL '2 days'
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Chatbot con IA usando Python y OpenAI',
  'Chatbot inteligente que utiliza la API de OpenAI para conversaciones naturales y asistencia automatizada.',
  'Un chatbot avanzado desarrollado en Python que integra la API de OpenAI GPT para proporcionar respuestas inteligentes y naturales. Incluye memoria de conversación, comandos personalizados, y integración con múltiples plataformas.',
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop',
  null,
  'https://github.com/ejemplo/ai-chatbot',
  ARRAY['Python', 'OpenAI API', 'Flask', 'SQLite', 'WebSocket', 'NLP'],
  'advanced',
  'Artificial Intelligence',
  ARRAY['ai', 'chatbot', 'nlp', 'openai'],
  '550e8400-e29b-41d4-a716-446655440000',
  89,
  520,
  true,
  NOW() - INTERVAL '6 days'
);

-- Ideas de ejemplo
INSERT INTO public.ideas (
  id,
  title,
  description,
  content,
  category,
  tags,
  difficulty_level,
  estimated_time,
  required_skills,
  author_id,
  likes_count,
  views_count,
  implementation_count,
  is_featured,
  created_at
) VALUES 
(
  '660e8400-e29b-41d4-a716-446655440001',
  'Plataforma de Intercambio de Habilidades',
  'Una plataforma donde las personas pueden intercambiar habilidades: enseñar lo que saben a cambio de aprender algo nuevo.',
  'La idea consiste en crear una plataforma web donde los usuarios puedan registrar las habilidades que dominan y las que quieren aprender. El sistema haría matching entre usuarios complementarios y facilitaría el intercambio de conocimientos a través de sesiones virtuales o presenciales.',
  'Web Development',
  ARRAY['social', 'education', 'matching', 'community'],
  'intermediate',
  '2-3 meses',
  ARRAY['React/Vue', 'Node.js', 'Database', 'Authentication', 'Real-time communication'],
  '550e8400-e29b-41d4-a716-446655440000',
  156,
  890,
  3,
  true,
  NOW() - INTERVAL '4 days'
),
(
  '660e8400-e29b-41d4-a716-446655440002',
  'App de Seguimiento de Hábitos con Gamificación',
  'Una aplicación móvil que convierte el seguimiento de hábitos en un juego con niveles, logros y recompensas.',
  'Desarrollar una app que permita a los usuarios crear y seguir hábitos diarios, pero con elementos de gamificación como puntos de experiencia, niveles, logros desbloqueables, y un sistema de recompensas. Incluiría estadísticas detalladas y competencias amigables entre usuarios.',
  'Mobile Development',
  ARRAY['habits', 'gamification', 'health', 'productivity'],
  'beginner',
  '1-2 meses',
  ARRAY['React Native/Flutter', 'Local Storage', 'Push Notifications', 'Charts'],
  '550e8400-e29b-41d4-a716-446655440000',
  98,
  567,
  5,
  false,
  NOW() - INTERVAL '2 days'
),
(
  '660e8400-e29b-41d4-a716-446655440003',
  'Sistema de Recomendaciones de Libros con IA',
  'Un sistema que utiliza machine learning para recomendar libros basándose en preferencias y historial de lectura.',
  'Crear un sistema inteligente que analice los libros que ha leído un usuario, sus calificaciones, géneros preferidos, y otros factores para recomendar nuevos libros. Podría incluir análisis de sentimientos de reseñas y comparación con usuarios similares.',
  'Artificial Intelligence',
  ARRAY['ml', 'recommendations', 'books', 'nlp'],
  'advanced',
  '3-4 meses',
  ARRAY['Python', 'Machine Learning', 'NLP', 'APIs', 'Database'],
  '550e8400-e29b-41d4-a716-446655440000',
  203,
  1240,
  1,
  true,
  NOW() - INTERVAL '7 days'
),
(
  '660e8400-e29b-41d4-a716-446655440004',
  'Marketplace de Servicios Locales',
  'Una plataforma que conecte a proveedores de servicios locales con clientes en su área geográfica.',
  'Desarrollar un marketplace donde profesionales locales (plomeros, electricistas, tutores, etc.) puedan ofrecer sus servicios y los clientes puedan encontrarlos fácilmente. Incluiría sistema de calificaciones, chat integrado, y gestión de citas.',
  'Web Development',
  ARRAY['marketplace', 'local', 'services', 'geolocation'],
  'intermediate',
  '2-3 meses',
  ARRAY['Full-stack development', 'Maps API', 'Payment processing', 'Real-time chat'],
  '550e8400-e29b-41d4-a716-446655440000',
  67,
  423,
  2,
  false,
  NOW() - INTERVAL '1 day'
),
(
  '660e8400-e29b-41d4-a716-446655440005',
  'Herramienta de Análisis de Código Automático',
  'Una herramienta que analice código fuente y proporcione sugerencias de mejora, detección de bugs y métricas de calidad.',
  'Crear una herramienta que pueda analizar repositorios de código en diferentes lenguajes, detectar patrones problemáticos, sugerir mejoras de rendimiento, identificar posibles bugs, y generar reportes de calidad del código con métricas detalladas.',
  'Developer Tools',
  ARRAY['code-analysis', 'static-analysis', 'quality', 'automation'],
  'advanced',
  '4-6 meses',
  ARRAY['Compiler theory', 'AST parsing', 'Multiple programming languages', 'Pattern recognition'],
  '550e8400-e29b-41d4-a716-446655440000',
  134,
  756,
  0,
  false,
  NOW() - INTERVAL '3 days'
);

-- Comentarios de ejemplo para proyectos
INSERT INTO public.project_comments (
  project_id,
  author_id,
  content,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  '¡Excelente proyecto! Me encanta cómo has implementado la autenticación JWT. ¿Podrías compartir más detalles sobre la estructura de la base de datos?',
  NOW() - INTERVAL '2 days'
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  'Muy útil para aprender sobre desarrollo fullstack. ¿Tienes planes de agregar notificaciones en tiempo real?',
  NOW() - INTERVAL '1 day'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440000',
  'La documentación de la API está muy bien estructurada. ¿Has considerado agregar rate limiting?',
  NOW() - INTERVAL '3 hours'
);

-- Comentarios de ejemplo para ideas
INSERT INTO public.idea_comments (
  idea_id,
  author_id,
  content,
  created_at
) VALUES 
(
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  'Me parece una idea brillante. Podríamos agregar un sistema de verificación de habilidades para aumentar la confianza entre usuarios.',
  NOW() - INTERVAL '1 day'
),
(
  '660e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440000',
  '¡Me encanta la gamificación! Sería genial incluir desafíos semanales y un sistema de insignias.',
  NOW() - INTERVAL '6 hours'
),
(
  '660e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440000',
  'Muy interesante el uso de IA para recomendaciones. ¿Has pensado en incluir análisis de emociones en las reseñas?',
  NOW() - INTERVAL '12 hours'
);

-- Actualizar contadores de comentarios
UPDATE public.projects SET comments_count = (
  SELECT COUNT(*) FROM public.project_comments WHERE project_id = projects.id
);

UPDATE public.ideas SET comments_count = (
  SELECT COUNT(*) FROM public.idea_comments WHERE idea_id = ideas.id
);