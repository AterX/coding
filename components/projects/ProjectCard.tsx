'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, Share2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Project } from '@/types/project';
import { motion } from 'framer-motion';

export function ProjectCard({ project }: { project: Project }) {
  const [isLiked, setIsLiked] = useState(false);
  
  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    // Aquí idealmente llamarías a una API para actualizar el like en la BD
    // y luego actualizarías el estado local o revalidarías los datos.
    setIsLiked(!isLiked);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="h-full group"
    >
      <Link href={`/proyectos/${project.id}`} className="block h-full">
        <Card className="overflow-hidden h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 border-primary/10 hover:border-primary/30 bg-card/50 backdrop-blur-sm hover:bg-card/80">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
            
            {/* Floating tech badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[calc(100%-24px)]">
              {project.technologies.slice(0, 2).map((tech) => (
                <Badge key={tech} className="bg-primary/90 text-primary-foreground text-xs backdrop-blur-sm border-0 hover:bg-primary">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 2 && (
                <Badge className="bg-secondary/90 text-secondary-foreground text-xs backdrop-blur-sm border-0">
                  +{project.technologies.length - 2}
                </Badge>
              )}
            </div>
            
            {/* Author info */}
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-lg p-2 border border-white/10">
                <Avatar className="h-8 w-8 border-2 border-white/30 ring-2 ring-primary/20">
                  {project.author.avatar && <AvatarImage 
                    src={`http://localhost:3001${project.author.avatar}`} 
                    alt={project.author.name} 
                  />}
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold text-sm">
                    {project.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-white block truncate">
                    {project.author.name && project.author.name !== 'Usuario Desconocido' 
                      ? project.author.name 
                      : project.author.username && project.author.username !== 'Usuario Desconocido'
                      ? project.author.username
                      : 'Usuario Desconocido'}
                  </span>
                  <span className="text-xs text-white/70">
                    {formatDistanceToNow(new Date(project.createdAt), { 
                      addSuffix: true,
                      locale: es
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6 flex-grow">
            <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
              {project.description}
            </p>
            
            {/* Technology tags - only show remaining ones not shown in image */}
            {project.technologies.length > 2 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies.slice(2).map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-colors">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="p-6 pt-0 border-t border-primary/10 flex justify-between items-center bg-muted/20">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover-lift" 
                onClick={toggleLike}
              >
                <Heart 
                  className={cn(
                    "h-4 w-4 mr-1 transition-all duration-300", 
                    isLiked ? "fill-red-500 text-red-500 animate-pulse" : "text-muted-foreground group-hover:text-primary"
                  )} 
                />
                <span className="text-sm font-medium">{project.likes + (isLiked ? 1 : 0)}</span>
              </Button>
              
              <div className="flex items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">{project.comments_count}</span>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                <Eye className="h-4 w-4" />
                <span className="text-sm">{project.views_count}</span>
              </div>
              
              <div className="flex items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                <Share2 className="h-4 w-4" />
                <span className="text-sm">Compartir</span>
              </div>
            </div>
            
            <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-medium">
              Proyecto
            </Badge>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}