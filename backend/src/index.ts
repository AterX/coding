import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import projectRoutes from './routes/projects';
import ideaRoutes from './routes/ideas';
import resourceRoutes from './routes/resources';
import profileRoutes from './routes/profiles';
import userRoutes from './routes/users'; // Nueva importación

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globales
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));

// Rutas de la API
app.get('/api', (_req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Devibecoding backend funcionando',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
      ideas: '/api/ideas',
      resources: '/api/resources',
      profiles: '/api/profiles',
      users: '/api/users' // Nuevo endpoint de usuario
    }
  });
});

// Rutas de recursos
app.use('/api/projects', projectRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/users', userRoutes); // Nuevas rutas de usuario

// Servir archivos estáticos (avatares)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta para verificar el estado de la base de datos
app.get('/api/health', async (_req, res) => {
  try {
    // Aquí podrías agregar una verificación de conexión a Supabase
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: 'Database connection failed'
    });
  }
});

// Middleware para rutas no encontradas
app.use('*', (_req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    message: 'La ruta solicitada no existe en este servidor'
  });
});

// Middleware de manejo de errores
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Error stack:', err.stack);
  
  // Error de validación de JSON
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'JSON inválido en el cuerpo de la petición' });
  }
  
  // Error genérico
  res.status(err.status || 500).json({ 
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en puerto ${PORT}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS habilitado para: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
