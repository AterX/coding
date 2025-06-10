'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Code, Lightbulb, BookOpen, Users, TrendingUp, User, Camera } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [userStats, setUserStats] = useState({
    projects: 0,
    ideas: 0,
    followers: 0,
    likes: 0,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Cargar avatar del usuario
  useEffect(() => {
    const loadUserAvatar = async () => {
      try {
        if (!user?.access_token) return;
        
        const response = await fetch('http://localhost:3001/api/profiles/me', {
          headers: {
            'Authorization': `Bearer ${user.access_token}`
          }
        });
       
       if (response.ok) {
         const profileData = await response.json();
         if (profileData.avatar_url) {
           setUserAvatar(`http://localhost:3001${profileData.avatar_url}`);
         } else {
           setUserAvatar(''); // Limpiar avatar si es null
         }
       } else {
         setUserAvatar(''); // Limpiar avatar si hay error
       }
     } catch (error) {
       console.error('Error al cargar avatar:', error);
     }
   };

   loadUserAvatar();

   const loadUserStats = async () => {
    try {
      if (!user?.access_token) return;
      // Asumiendo que tienes un endpoint para las estadísticas del usuario
      const response = await fetch('http://localhost:3001/api/users/stats', { // Reemplaza con tu endpoint real
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      });
     
     if (response.ok) {
       const statsData = await response.json();
       setUserStats({
        projects: statsData.projectCount || 0, // Asegúrate que los nombres coincidan con tu API
        ideas: statsData.ideaCount || 0,
        followers: statsData.followerCount || 0,
        likes: statsData.likeCount || 0,
       });
     }
   } catch (error) {
     console.error('Error al cargar estadísticas del usuario:', error);
     // Opcionalmente, maneja el estado de error en la UI
   }
 };

 loadUserStats();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userInitials = user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
                  {userAvatar && <AvatarImage src={userAvatar} alt={user.email} />}
                  <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
                </Avatar>
          <div>
            <h1 className="text-3xl font-bold">¡Bienvenido de vuelta!</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/proyectos/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.projects}</div>
            <p className="text-xs text-muted-foreground">proyectos creados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ideas</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.ideas}</div>
            <p className="text-xs text-muted-foreground">ideas compartidas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seguidores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.followers}</div>
            <p className="text-xs text-muted-foreground">personas te siguen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Likes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.likes}</div>
            <p className="text-xs text-muted-foreground">likes recibidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="actividad" className="space-y-4">
        <TabsList>
          <TabsTrigger value="actividad">Actividad Reciente</TabsTrigger>
          <TabsTrigger value="perfil">Mi Perfil</TabsTrigger>
        </TabsList>
        
        <TabsContent value="actividad" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Tu actividad reciente en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay actividad reciente</h3>
                <p className="text-muted-foreground">
                  Comienza a interactuar con la comunidad para ver tu actividad aquí
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="perfil" className="space-y-4">
          <ProfileTab user={user} onAvatarUpdate={setUserAvatar} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente para la pestaña de perfil
function ProfileTab({ user, onAvatarUpdate }: { user: any; onAvatarUpdate: (avatarUrl: string) => void }) {
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    website: '',
    location: '',
    avatar_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar perfil del usuario
   useEffect(() => {
     const loadProfile = async () => {
       try {
         if (!user?.access_token) return;
         
         const response = await fetch('http://localhost:3001/api/profiles/me', {
           headers: {
             'Authorization': `Bearer ${user.access_token}`
           }
         });
        
        if (response.ok) {
          const profileData = await response.json();
          setProfile(profileData);
          if (profileData.avatar_url) {
            setAvatarPreview(`http://localhost:3001${profileData.avatar_url}`);
          }
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      }
    };

    loadProfile();
   }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
       if (!user?.access_token) {
         alert('No estás autenticado');
         return;
       }
       
       // Actualizar información del perfil
       const profileResponse = await fetch('http://localhost:3001/api/profiles/me', {
         method: 'PUT',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${user.access_token}`
         },
        body: JSON.stringify({
          full_name: profile.full_name,
          bio: profile.bio,
          website: profile.website,
          location: profile.location
        })
      });

      if (!profileResponse.ok) {
        throw new Error('Error al actualizar perfil');
      }

      // Subir avatar si se seleccionó uno nuevo
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const avatarResponse = await fetch('http://localhost:3001/api/profiles/me/avatar', {
           method: 'POST',
           headers: {
             'Authorization': `Bearer ${user.access_token}`
           },
           body: formData
         });

        if (!avatarResponse.ok) {
          throw new Error('Error al subir avatar');
        }

        const avatarData = await avatarResponse.json();
        setProfile(prev => ({ ...prev, avatar_url: avatarData.avatar_url }));
        setAvatarPreview(`http://localhost:3001${avatarData.avatar_url}`);
        // Actualizar el avatar en el header
        onAvatarUpdate(`http://localhost:3001${avatarData.avatar_url}`);
      }

      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar perfil');
    } finally {
      setIsLoading(false);
      setAvatarFile(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Mi Perfil
        </CardTitle>
        <CardDescription>
          Actualiza tu información personal y foto de perfil
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                {avatarPreview && <AvatarImage 
                  src={avatarPreview} 
                  alt="Avatar" 
                />}
                <AvatarFallback className="text-lg">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Label htmlFor="avatar" className="text-sm font-medium">
                Foto de perfil
              </Label>
              <p className="text-sm text-muted-foreground">
                Haz clic en el ícono de cámara para cambiar tu foto
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Nombre completo */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Nombre completo</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Tu nombre completo"
            />
          </div>

          {/* Biografía */}
          <div className="space-y-2">
            <Label htmlFor="bio">Biografía</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Cuéntanos sobre ti..."
              rows={3}
            />
          </div>

          {/* Sitio web */}
          <div className="space-y-2">
            <Label htmlFor="website">Sitio web</Label>
            <Input
              id="website"
              type="url"
              value={profile.website}
              onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://tu-sitio-web.com"
            />
          </div>

          {/* Ubicación */}
          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Tu ciudad, país"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Actualizando...' : 'Actualizar Perfil'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}