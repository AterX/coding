'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Project } from '@/types/project';

// Mock data for featured projects
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'AI Image Generator',
    description: 'Una aplicación que genera imágenes usando inteligencia artificial y modelos de difusión.',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    technologies: ['React', 'Node.js', 'OpenAI API'],
    author: {
      id: 'user1',
      name: 'Ana García',
      avatar: 'https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    likes: 124,
    comments_count: 15,
    views_count: 342,
    createdAt: new Date('2023-09-15').toISOString(),
    is_liked_by_current_user: true, // Ejemplo
  },
  {
    id: '2',
    title: 'Task Manager Pro',
    description: 'Sistema de gestión de tareas con enfoque en productividad y colaboración en tiempo real.',
    image: 'https://images.pexels.com/photos/6956183/pexels-photo-6956183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
    author: {
      id: 'user2',
      name: 'Carlos Rodríguez',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    likes: 98,
    comments_count: 8,
    views_count: 256,
    createdAt: new Date('2023-10-02').toISOString(),
    is_liked_by_current_user: false, // Ejemplo
  },
  {
    id: '3',
    title: 'Smart Home Dashboard',
    description: 'Dashboard para controlar dispositivos IoT en el hogar con visualización de datos en tiempo real.',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    technologies: ['Next.js', 'TypeScript', 'MQTT'],
    author: {
      id: 'user3',
      name: 'Laura Martínez',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    likes: 156,
    comments_count: 23,
    views_count: 489,
    createdAt: new Date('2023-08-22').toISOString(),
    is_liked_by_current_user: true, // Ejemplo
  },
];

export function FeaturedProjects() {
  const [filter, setFilter] = useState<string>('all');
  
  // In a real app, filtering would happen on the server or with actual data
  const filteredProjects = mockProjects;
  
  return (
    <section className="py-16 bg-secondary/10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Proyectos destacados</h2>
            <p className="text-muted-foreground">Descubre lo que está construyendo nuestra comunidad</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Button 
              variant={filter === 'all' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter('all')}
            >
              Todos
            </Button>
            <Button 
              variant={filter === 'ai' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter('ai')}
            >
              IA
            </Button>
            <Button 
              variant={filter === 'web' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter('web')}
            >
              Web
            </Button>
            <Button 
              variant={filter === 'mobile' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter('mobile')}
            >
              Mobile
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} initialLikedByCurrentUser={project.is_liked_by_current_user} />
          ))}
        </div>
        
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/proyectos">
              Ver todos los proyectos
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}