'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Eye, MessageCircle, Users, Clock, ArrowLeft, Send, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Idea {
  id: string;
  title: string;
  description: string;
  content?: string;
  author: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
  likes_count: number;
  views_count: number;
  comments_count: number;
  implementation_count: number;
  category: string;
  difficulty_level: string;
  estimated_time?: string;
  required_skills: string[];
  created_at: string;
  updated_at: string;
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

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchIdea();
      fetchComments();
    }
  }, [params.id]);

  const fetchIdea = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setIdea(data.idea);
      } else if (response.status === 404) {
        toast.error('Idea no encontrada');
        router.push('/ideas');
      } else {
        toast.error('Error al cargar la idea');
      }
    } catch (error) {
      console.error('Error fetching idea:', error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas/${params.id}/comments`);
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
    if (!user || !idea) {
      toast.error('Debes iniciar sesión para dar like');
      return;
    }

    try {
      const isLiked = idea.is_liked;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas/${idea.id}/like`,
        {
          method: isLiked ? 'DELETE' : 'POST',
          headers: {
            'Authorization': `Bearer ${user.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        setIdea(prev => prev ? {
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

  const handleSubmitComment = async () => {
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas/${params.id}/comments`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: newComment })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
        setIdea(prev => prev ? {
          ...prev,
          comments_count: prev.comments_count + 1
        } : null);
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
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Idea no encontrada</h1>
          <Button asChild>
            <Link href="/ideas">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Ideas
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/ideas">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Ideas
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenido principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <Badge variant="secondary">{idea.category}</Badge>
                  <Badge variant={idea.difficulty_level === 'beginner' ? 'default' : 
                                idea.difficulty_level === 'intermediate' ? 'secondary' : 'destructive'}>
                    {difficultyLabels[idea.difficulty_level]}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                      idea.is_liked ? 'text-red-500' : ''
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${idea.is_liked ? 'fill-current' : ''}`} />
                    <span>{idea.likes_count}</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{idea.views_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{idea.comments_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{idea.implementation_count}</span>
                  </div>
                </div>
              </div>
              
              <CardTitle className="flex items-start gap-2 text-2xl">
                <Lightbulb className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
                {idea.title}
              </CardTitle>
              
              <CardDescription className="text-base">
                {idea.description}
              </CardDescription>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Image
                    src={idea.author.avatar_url || '/api/placeholder/24/24'}
                    alt={idea.author.full_name || idea.author.username || 'Usuario'}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span>{idea.author.full_name || idea.author.username || 'Usuario'}</span>
                </div>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(idea.created_at), { addSuffix: true, locale: es })}</span>
              </div>
            </CardHeader>
            
            {idea.content && (
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap">{idea.content}</div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Comentarios */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Comentarios ({idea.comments_count})</CardTitle>
            </CardHeader>
            <CardContent>
              {user && (
                <div className="mb-6">
                  <Textarea
                    placeholder="Escribe tu comentario..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-2"
                  />
                  <Button 
                    onClick={handleSubmitComment}
                    disabled={submittingComment || !newComment.trim()}
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {submittingComment ? 'Enviando...' : 'Comentar'}
                  </Button>
                </div>
              )}
              
              {commentsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No hay comentarios aún. {user ? '¡Sé el primero en comentar!' : 'Inicia sesión para comentar.'}
                </p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-4 bg-muted/50 rounded-lg">
                      <Image
                        src={comment.author.avatar_url || '/api/placeholder/32/32'}
                        alt={comment.author.full_name || comment.author.username || 'Usuario'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {comment.author.full_name || comment.author.username || 'Usuario'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: es })}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Información de la idea */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {idea.estimated_time && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Tiempo estimado:</span>
                  <span className="font-medium">{idea.estimated_time}</span>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium mb-2">Habilidades requeridas</h4>
                <div className="flex flex-wrap gap-1">
                  {(idea.required_skills && Array.isArray(idea.required_skills) ? idea.required_skills : []).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="default">
                <Users className="h-4 w-4 mr-2" />
                Implementar Idea
              </Button>
              <Button className="w-full" variant="outline">
                Compartir
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}