# DevibeCoding - Plataforma de Proyectos y Ideas

Una plataforma moderna para desarrolladores donde pueden compartir proyectos, ideas y colaborar en la comunidad de programación.

## 🚀 Características

- **Gestión de Proyectos**: Sube, comparte y descubre proyectos de desarrollo
- **Ideas Colaborativas**: Comparte ideas de proyectos y encuentra colaboradores
- **Sistema de Autenticación**: Registro e inicio de sesión con Supabase
- **Dashboard Personalizado**: Panel de control para gestionar tus proyectos e ideas
- **Sistema de Likes y Comentarios**: Interactúa con la comunidad
- **Filtros Avanzados**: Busca por categoría, dificultad y tecnologías
- **Diseño Responsivo**: Optimizado para desktop y móvil
- **Tema Oscuro/Claro**: Cambia entre temas según tu preferencia

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 13** - Framework de React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utilitario
- **shadcn/ui** - Componentes de UI modernos
- **Framer Motion** - Animaciones fluidas
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Supabase Client** - Cliente para autenticación

### Backend
- **Express.js** - Framework de Node.js
- **TypeScript** - Tipado estático
- **Supabase** - Base de datos y autenticación
- **CORS** - Configuración de políticas de origen cruzado
- **Middleware de Autenticación** - Protección de rutas

## 📋 Requisitos Previos

- Node.js 18+ instalado
- npm o yarn como gestor de paquetes
- Cuenta de Supabase (para base de datos y autenticación)

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd project
```

### 2. Configurar el Frontend

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### 3. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

Edita `backend/.env` con tus credenciales:
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Configuración de Supabase
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio_de_supabase

# JWT Secret
JWT_SECRET=tu_clave_secreta_jwt

# Base de datos
DATABASE_URL=tu_string_de_conexion_postgresql
```

### 4. Configurar la Base de Datos

1. Ve a tu proyecto de Supabase
2. Ejecuta el script `database/schema.sql` en el SQL Editor
3. Opcionalmente, ejecuta `database/seed.sql` para datos de prueba

### 5. Ejecutar la Aplicación

```bash
# Terminal 1: Ejecutar el backend
cd backend
npm run dev

# Terminal 2: Ejecutar el frontend
cd ..
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📁 Estructura del Proyecto

```
project/
├── app/                    # Páginas de Next.js (App Router)
│   ├── dashboard/         # Panel de control del usuario
│   ├── ideas/            # Páginas de ideas
│   ├── login/            # Página de inicio de sesión
│   ├── proyectos/        # Páginas de proyectos
│   └── registro/         # Página de registro
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes de shadcn/ui
│   └── layout/          # Componentes de layout
├── contexts/            # Contextos de React
├── lib/                 # Utilidades y configuraciones
├── backend/             # Servidor Express.js
│   ├── src/
│   │   ├── controllers/ # Controladores de la API
│   │   ├── middlewares/ # Middlewares personalizados
│   │   ├── routes/      # Definición de rutas
│   │   ├── services/    # Lógica de negocio
│   │   └── utils/       # Utilidades del backend
│   └── package.json
└── database/            # Scripts de base de datos
    ├── schema.sql       # Esquema de la base de datos
    └── seed.sql         # Datos de prueba
```

## 🔐 Autenticación

La aplicación utiliza Supabase para la autenticación, que incluye:
- Registro de usuarios
- Inicio de sesión
- Gestión de sesiones
- Protección de rutas
- Perfiles de usuario

## 📊 API Endpoints

### Proyectos
- `GET /api/projects` - Obtener todos los proyectos
- `GET /api/projects/:id` - Obtener proyecto por ID
- `POST /api/projects` - Crear nuevo proyecto (autenticado)
- `PUT /api/projects/:id` - Actualizar proyecto (autenticado)
- `DELETE /api/projects/:id` - Eliminar proyecto (autenticado)
- `POST /api/projects/:id/like` - Dar like a proyecto (autenticado)
- `DELETE /api/projects/:id/like` - Quitar like de proyecto (autenticado)

### Ideas
- `GET /api/ideas` - Obtener todas las ideas
- `GET /api/ideas/:id` - Obtener idea por ID
- `POST /api/ideas` - Crear nueva idea (autenticado)
- `PUT /api/ideas/:id` - Actualizar idea (autenticado)
- `DELETE /api/ideas/:id` - Eliminar idea (autenticado)
- `POST /api/ideas/:id/like` - Dar like a idea (autenticado)
- `DELETE /api/ideas/:id/like` - Quitar like de idea (autenticado)

### Comentarios
- `GET /api/projects/:id/comments` - Obtener comentarios de proyecto
- `POST /api/projects/:id/comments` - Crear comentario en proyecto (autenticado)
- `GET /api/ideas/:id/comments` - Obtener comentarios de idea
- `POST /api/ideas/:id/comments` - Crear comentario en idea (autenticado)

## 🎨 Personalización

### Temas
La aplicación soporta tema claro y oscuro. El cambio se puede hacer desde el header de la aplicación.

### Componentes UI
Todos los componentes UI están basados en shadcn/ui y pueden ser personalizados editando los archivos en `components/ui/`.

### Estilos
Los estilos utilizan Tailwind CSS. Puedes personalizar los colores y temas editando `tailwind.config.js`.

## 🚀 Despliegue

### Frontend (Vercel)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Backend (Railway/Heroku)
1. Configura las variables de entorno en tu plataforma
2. Despliega el directorio `backend/`
3. Actualiza `NEXT_PUBLIC_BACKEND_URL` en el frontend

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🔄 Próximas Características

- [ ] Sistema de notificaciones
- [ ] Chat en tiempo real
- [ ] Integración con GitHub
- [ ] Sistema de badges y logros
- [ ] Búsqueda avanzada con filtros
- [ ] API pública
- [ ] Aplicación móvil
- [ ] Sistema de mentorías

---

**Desarrollado con ❤️ por la comunidad DevibeCoding**