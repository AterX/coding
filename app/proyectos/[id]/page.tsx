'use client';

import { useState, useEffect, useRef } from 'react'; // Importar useRef
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Eye, MessageCircle, ExternalLink, Github, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  description: string;
  content?: string;
  image_url?: string;
  technologies: string[];
  tags?: string[];
  author: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
  likes_count: number;
  views_count: number;
  comments_count: number;
  demo_url?: string;
  github_url?: string;
  category: string;
  difficulty_level: string;
  created_at: string;
  is_liked?: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
  created_at: string;
}

const difficultyLabels: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado"
};

export default function ProyectoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const initialFetchDone = useRef(false); // Ref para controlar la carga inicial

  useEffect(() => {
    if (params.id && !initialFetchDone.current) {
      fetchProject();
      fetchComments();
      initialFetchDone.current = true; // Marcar que la carga inicial se ha realizado
    }
    // Si params.id cambia después de la carga inicial, volver a cargar
    // Esto es en caso de que el usuario navegue a otro proyecto desde la misma página (poco probable aquí)
    if (params.id && project && params.id !== project.id) {
        initialFetchDone.current = false; // Resetear para la nueva carga
        fetchProject();
        fetchComments();
        initialFetchDone.current = true;
    }

  }, [params.id, project]); // Añadir project a las dependencias para el caso de cambio de ID

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
      } else if (response.status === 404) {
        toast.error('Proyecto no encontrado');
        router.push('/proyectos');
      } else {
        toast.error('Error al cargar el proyecto');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/${params.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para dar like');
      return;
    }

    if (!project) return;

    try {
      const isLiked = project.is_liked;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/${project.id}/like`,
        {
          method: isLiked ? 'DELETE' : 'POST',
          headers: {
            'Authorization': `Bearer ${user.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        setProject(prev => prev ? {
          ...prev,
          is_liked: !isLiked,
          likes_count: isLiked ? prev.likes_count - 1 : prev.likes_count + 1
        } : null);
      } else {
        toast.error('Error al procesar el like');
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast.error('Error al conectar con el servidor');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Debes iniciar sesión para comentar');
      return;
    }

    if (!newComment.trim()) {
      toast.error('El comentario no puede estar vacío');
      return;
    }

    try {
      setSubmittingComment(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/${params.id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.access_token}`
          },
          body: JSON.stringify({ content: newComment.trim() })
        }
      );

      if (response.ok) {
        setNewComment('');
        fetchComments();
        if (project) {
          setProject(prev => prev ? {
            ...prev,
            comments_count: prev.comments_count + 1
          } : null);
        }
        toast.success('Comentario agregado');
      } else {
        toast.error('Error al agregar comentario');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
          <Button asChild>
            <Link href="/proyectos">Volver a Proyectos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/proyectos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Proyectos
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen del proyecto */}
            {project.image_url && (
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Información del proyecto */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{project.category}</Badge>
                  <Badge variant={project.difficulty_level === 'beginner' ? 'default' : 
                                project.difficulty_level === 'intermediate' ? 'secondary' : 'destructive'}>
                    {difficultyLabels[project.difficulty_level]}
                  </Badge>
                </div>
                <CardTitle className="text-3xl">{project.title}</CardTitle>
                <CardDescription className="text-lg">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project.content && (
                  <div className="prose max-w-none mb-6">
                    <h3 className="text-xl font-semibold mb-3">Descripción Detallada</h3>
                    <p className="whitespace-pre-wrap text-muted-foreground">
                      {project.content}
                    </p>
                  </div>
                )}

                {/* Tecnologías */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Tecnologías Utilizadas</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enlaces */}
                <div className="flex gap-4">
                  {project.demo_url && (
                    <Button asChild>
                      <Link href={project.demo_url} target="_blank">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver Demo
                      </Link>
                    </Button>
                  )}
                  {project.github_url && (
                    <Button variant="outline" asChild>
                      <Link href={project.github_url} target="_blank">
                        <Github className="h-4 w-4 mr-2" />
                        Ver Código
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Comentarios */}
            <Card>
              <CardHeader>
                <CardTitle>Comentarios ({project.comments_count})</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Formulario para nuevo comentario */}
                {user ? (
                  <form onSubmit={handleSubmitComment} className="mb-6">
                    <div className="flex gap-2">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe un comentario..."
                        rows={3}
                        className="flex-1"
                      />
                      <Button 
                        type="submit" 
                        disabled={submittingComment || !newComment.trim()}
                        size="sm"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <p className="text-center text-muted-foreground">
                      <Link href="/login" className="text-primary hover:underline">
                        Inicia sesión
                      </Link>
                      {' '}para comentar
                    </p>
                  </div>
                )}

                {/* Lista de comentarios */}
                <div className="space-y-4">
                  {commentsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-16 w-full" />
                        </div>
                      </div>
                    ))
                  ) : comments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No hay comentarios aún. ¡Sé el primero en comentar!
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-4 bg-muted/50 rounded-lg">
                        <Avatar className="h-8 w-8">
                          {comment.author?.avatar_url && <AvatarImage
                            src={`http://localhost:3001${comment.author.avatar_url}`}
                            alt={comment.author?.full_name || comment.author?.username || 'Usuario'}
                          />}
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold text-xs">
                            {(comment.author?.full_name || comment.author?.username || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {comment.author?.full_name || comment.author?.username || 'Usuario'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Autor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Autor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    {project.author?.avatar_url && <AvatarImage
                      src={`http://localhost:3001${project.author.avatar_url}`}
                      alt={project.author?.full_name || project.author?.username || 'Usuario'}
                    />}
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">
                      {(project.author?.full_name || project.author?.username || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {project.author?.full_name || project.author?.username || 'Usuario'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center justify-between w-full p-3 rounded-lg border transition-colors ${
                      project.is_liked 
                        ? 'bg-red-50 border-red-200 text-red-700' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Heart className={`h-5 w-5 ${project.is_liked ? 'fill-current' : ''}`} />
                      <span>Me gusta</span>
                    </div>
                    <span className="font-medium">{project.likes_count}</span>
                  </button>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      <span>Vistas</span>
                    </div>
                    <span className="font-medium">{project.views_count}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      <span>Comentarios</span>
                    </div>
                    <span className="font-medium">{project.comments_count}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}