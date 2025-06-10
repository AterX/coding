'use client';

import { useState, useEffect } from 'react'; // Añadido useEffect
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Video, Code, FileText } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type Resource = {
  id: string;
  title: string;
  description: string;
  type: 'tutorial' | 'video' | 'code' | 'article';
  tags: string[];
  url: string;
  author_id: string; // Cambiado de author a author_id para coincidir con el backend
  // Considerar añadir campos como created_at, likes_count si se van a mostrar
};

// mockResources ya no se usará directamente, se obtendrán del backend
// const mockResources: Resource[] = [
//   {
//     id: '1',
//     title: 'Introducción a la Inteligencia Artificial',
//     description: 'Una guía completa para principiantes sobre los fundamentos de la IA y el aprendizaje automático.',
//     type: 'article',
//     tags: ['IA', 'Machine Learning', 'Principiantes'],
//     url: 'https://example.com/intro-ia',
//     author_id: 'María González' // Ajustado a author_id
//   },
//   // ...otros mock resources
// ];

const getResourceIcon = (type: Resource['type']) => {
  switch (type) {
    case 'tutorial':
      return <BookOpen className="h-5 w-5" />;
    case 'video':
      return <Video className="h-5 w-5" />;
    case 'code':
      return <Code className="h-5 w-5" />;
    case 'article':
      return <FileText className="h-5 w-5" />;
    default:
      return <BookOpen className="h-5 w-5" />;
  }
};

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<Resource['type'] | 'all'>('all');
  const [resources, setResources] = useState<Resource[]>([]); // Estado para los recursos del backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/resources`); // Usar la URL completa del backend
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResources(data.data || data); // Ajustar según la estructura de la respuesta del backend
      } catch (e: any) { // Especificar el tipo de 'e'
        setError(e.message);
        console.error("Error fetching resources:", e);
      }
      setLoading(false);
    };

    fetchResources();
  }, []);
  
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))); // Comprobar si tags existe
    
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div className="container py-12 px-4 md:px-6 text-center">Cargando recursos...</div>;
  }

  if (error) {
    return <div className="container py-12 px-4 md:px-6 text-center text-red-500">Error al cargar recursos: {error}</div>;
  }
  
  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Recursos</h1>
          <p className="text-muted-foreground">
            Encuentra tutoriales, guías y recursos para aprender tecnología
          </p>
        </div>
        <Link href="/recursos/nuevo">
                  <Button className="mt-4 md:mt-0">Compartir recurso</Button>
                </Link>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-grow">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar recursos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={selectedType === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedType('all')}
          >
            Todos
          </Button>
          <Button 
            variant={selectedType === 'tutorial' ? 'default' : 'outline'}
            onClick={() => setSelectedType('tutorial')}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Tutoriales
          </Button>
          <Button 
            variant={selectedType === 'video' ? 'default' : 'outline'}
            onClick={() => setSelectedType('video')}
          >
            <Video className="mr-2 h-4 w-4" />
            Videos
          </Button>
          <Button 
            variant={selectedType === 'code' ? 'default' : 'outline'}
            onClick={() => setSelectedType('code')}
          >
            <Code className="mr-2 h-4 w-4" />
            Código
          </Button>
          <Button 
            variant={selectedType === 'article' ? 'default' : 'outline'}
            onClick={() => setSelectedType('article')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Artículos
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                {getResourceIcon(resource.type)}
                <Badge variant="secondary">{resource.type}</Badge>
              </div>
              <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {resource.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {resource.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {/* Temporalmente se muestra el ID del autor, se necesitará obtener el nombre del perfil */}
                  Por {resource.author_id} 
                </span>
                <Button variant="outline" size="sm" asChild>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    Ver recurso
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No se encontraron recursos</h3>
          <p className="text-muted-foreground">
            Intenta cambiar los filtros o términos de búsqueda
          </p>
        </div>
      )}
    </div>
  );
}