# Configuración de DevibeCoding para Bolt.new

## Introducción

Este documento proporciona instrucciones específicas para ejecutar el proyecto DevibeCoding en Bolt.new, ya que esta plataforma no tiene compatibilidad nativa con los helpers de Next.js para Supabase.

## Cambios realizados para compatibilidad con Bolt.new

Se han creado los siguientes archivos para asegurar la compatibilidad:

1. `lib/supabase.ts` - Cliente de Supabase estándar que no depende de los helpers específicos de Next.js
2. `components/auth/AuthProviderBolt.tsx` - Proveedor de autenticación compatible con Bolt.new

## Pasos para usar el proyecto en Bolt.new

### 1. Configuración de variables de entorno

Asegúrate de configurar las siguientes variables de entorno en Bolt.new:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

Para el backend, configura:

```
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio_de_supabase
PORT=3001
```

### 2. Modificar el layout principal

Cuando importes el proyecto a Bolt.new, deberás modificar el archivo `app/layout.tsx` para usar el AuthProviderBolt en lugar del AuthProvider original:

```tsx
// Cambiar esta línea:
import { AuthProvider } from '@/components/auth/AuthProvider';

// Por esta:
import { AuthProviderBolt as AuthProvider } from '@/components/auth/AuthProviderBolt';
```

### 3. Actualizar importaciones en componentes que usen autenticación

Si tienes componentes que importan directamente `createClientComponentClient` o `createServerComponentClient` de `@supabase/auth-helpers-nextjs`, deberás modificarlos para usar las funciones de `lib/supabase.ts` en su lugar.

Por ejemplo, cambiar:

```tsx
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// ...

const supabase = createClientComponentClient();
const { data, error } = await supabase.auth.getUser();
```

Por:

```tsx
import { supabase, getCurrentUser } from '@/lib/supabase';

// ...

const { user, error } = await getCurrentUser();
```

### 4. Base de datos

Asegúrate de ejecutar los scripts SQL en la carpeta `database/` en tu proyecto de Supabase para crear las tablas y funciones necesarias.

## Solución de problemas

Si encuentras problemas con la autenticación en Bolt.new:

1. Verifica que estás usando el `AuthProviderBolt` en lugar del `AuthProvider` original
2. Confirma que las variables de entorno están correctamente configuradas
3. Revisa la consola del navegador para ver posibles errores
4. Asegúrate de que tu proyecto de Supabase tiene habilitada la autenticación por email/contraseña

## Desarrollo local vs. Bolt.new

Para desarrollo local, puedes seguir usando la configuración original con los helpers de Next.js. Los archivos adicionales creados para Bolt.new no interferirán con el funcionamiento normal del proyecto.

Si prefieres usar la misma configuración en ambos entornos, puedes modificar todo el proyecto para usar el enfoque compatible con Bolt.new.