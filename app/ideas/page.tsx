'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { IdeaCard } from '@/components/ideas/IdeaCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Eye, MessageCircle, Lightbulb, Clock, Users, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

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
  is_liked?: boolean;
}

const categories = ["Todas", "Web Development", "Mobile Development", "Data Science", "AI/ML", "DevOps", "Social", "Productividad", "Educación", "Salud", "Entretenimiento", "Finanzas"];
const difficulties = ["Todas", "beginner", "intermediate", "advanced"];
const sortOptions = ["Más recientes", "Más populares", "Más comentadas", "Más implementadas"];

const difficultyLabels: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado"
};

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todas');
  const [sortBy, setSortBy] = useState('Más recientes');
  const { user } = useAuth();

  useEffect(() => {
    fetchIdeas();
  }, [selectedCategory, selectedDifficulty, sortBy]);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedCategory !== 'Todas') {
        params.append('category', selectedCategory);
      }
      if (selectedDifficulty !== 'Todas') {
        params.append('difficulty', selectedDifficulty);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      let sortParam = 'created_at';
      if (sortBy === 'Más populares') sortParam = 'likes_count';
      if (sortBy === 'Más comentadas') sortParam = 'comments_count';
      if (sortBy === 'Más implementadas') sortParam = 'implementation_count';
      params.append('sort', sortParam);
      params.append('order', 'desc');

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas?${params}`);
      if (response.ok) {
        const data = await response.json();
        setIdeas(data.ideas || []);
      } else {
        toast.error('Error al cargar las ideas');
      }
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (ideaId: string) => {
    if (!user) {
      toast.error('Debes iniciar sesión para dar like');
      return;
    }

    try {
      const idea = ideas.find(i => i.id === ideaId);
      const isLiked = idea?.is_liked;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas/${ideaId}/like`,
        {
          method: isLiked ? 'DELETE' : 'POST',
          headers: {
            'Authorization': `Bearer ${user.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        setIdeas(prev => prev.map(i => 
          i.id === ideaId 
            ? { 
                ...i, 
                is_liked: !isLiked,
                likes_count: isLiked ? i.likes_count - 1 : i.likes_count + 1
              }
            : i
        ));
      } else {
        toast.error('Error al procesar el like');
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast.error('Error al conectar con el servidor');
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.required_skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-96 mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-4">Ideas de Proyectos</h1>
          <p className="text-muted-foreground text-lg">
            Encuentra inspiración para tu próximo proyecto o comparte tus ideas con la comunidad.
          </p>
        </div>
        {user && (
          <Button asChild>
            <Link href="/ideas/nuevo">
              <Plus className="h-4 w-4 mr-2" />
              Compartir Idea
            </Link>
          </Button>
        )}
      </div>

      {/* Filtros y búsqueda */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Dificultad" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty === 'Todas' ? difficulty : difficultyLabels[difficulty]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid de ideas */}
      {filteredIdeas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            No se encontraron ideas que coincidan con los filtros seleccionados.
          </p>
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setSelectedCategory('Todas');
            setSelectedDifficulty('Todas');
          }}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}