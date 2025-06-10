'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Heart, Eye, MessageCircle, ExternalLink, Github, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  technologies: string[];
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

const categories = ["Todos", "Web Development", "Mobile Development", "Data Science", "AI/ML", "DevOps", "Backend Development", "Frontend Development"];
const difficulties = ["Todos", "beginner", "intermediate", "advanced"];
const sortOptions = ["Más populares", "Más recientes", "Más comentados"];

const difficultyLabels: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado"
};



interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProjects: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export default function ProyectosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todos');
  const [sortBy, setSortBy] = useState('Más populares');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, selectedDifficulty, sortBy, currentPage, searchTerm]);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedCategory, selectedDifficulty, sortBy, searchTerm]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Paginación
      params.append('page', currentPage.toString());
      params.append('limit', '30');
      
      if (selectedCategory !== 'Todos') {
        params.append('category', selectedCategory);
      }
      if (selectedDifficulty !== 'Todos') {
        params.append('difficulty', selectedDifficulty);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      let sortParam = 'popularity';
      if (sortBy === 'Más populares') sortParam = 'popularity';
      if (sortBy === 'Más recientes') sortParam = 'created_at';
      if (sortBy === 'Más comentados') sortParam = 'comments_count';
      params.append('sort', sortParam);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
        setPagination(data.pagination || null);
      } else {
        toast.error('Error al cargar los proyectos');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (projectId: string) => {
    if (!user) {
      toast.error('Debes iniciar sesión para dar like');
      return;
    }

    try {
      const project = projects.find(p => p.id === projectId);
      const isLiked = project?.is_liked;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects/${projectId}/like`,
        {
          method: isLiked ? 'DELETE' : 'POST',
          headers: {
            'Authorization': `Bearer ${user.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        setProjects(prev => prev.map(p => 
          p.id === projectId 
            ? { 
                ...p, 
                is_liked: !isLiked,
                likes_count: isLiked ? p.likes_count - 1 : p.likes_count + 1
              }
            : p
        ));
      } else {
        toast.error('Error al procesar el like');
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast.error('Error al conectar con el servidor');
    }
  };

  // Generar números de página para la paginación
  const generatePageNumbers = () => {
    if (!pagination) return [];
    
    const { currentPage, totalPages } = pagination;
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  

  
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
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
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
          <h1 className="text-4xl font-bold mb-4">Proyectos de la Comunidad</h1>
          <p className="text-muted-foreground text-lg">
            Descubre proyectos increíbles creados por nuestra comunidad de desarrolladores.
          </p>
        </div>
        {user && (
          <Button asChild>
            <Link href="/proyectos/nuevo">
              <Plus className="h-4 w-4 mr-2" />
              Subir Proyecto
            </Link>
          </Button>
        )}
      </div>

      {/* Filtros y búsqueda */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar proyectos..."
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
                  {difficulty === 'Todos' ? difficulty : difficultyLabels[difficulty]}
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

      {/* Grid de proyectos */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            No se encontraron proyectos que coincidan con los filtros seleccionados.
          </p>
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setSelectedCategory('Todos');
            setSelectedDifficulty('Todos');
            setCurrentPage(1);
          }}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              // Adaptar los datos del proyecto de la API a las props de ProjectCard
              const cardProjectData = {
                id: project.id,
                title: project.title,
                description: project.description,
                image: project.image_url || '',
                technologies: project.technologies,
                author: {
                  id: project.author.id,
                  name: project.author.full_name || project.author.username || 'Usuario Desconocido',
                  avatar: project.author.avatar_url || ''
                },
                likes: project.likes_count,
                comments_count: project.comments_count,
                views_count: project.views_count,
                createdAt: project.created_at
              };
              return <ProjectCard
                       key={project.id}
                       project={cardProjectData}
                       initialLikedByCurrentUser={project.is_liked}
                     />;
            })}
          </div>

          {/* Paginación */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {pagination.hasPrevPage && (
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage - 1);
                        }}
                      />
                    </PaginationItem>
                  )}
                  
                  {generatePageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page as number);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  {pagination.hasNextPage && (
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage + 1);
                        }}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}