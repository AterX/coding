'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageSquare, Eye, Lightbulb, Users, Clock } from 'lucide-react'; // Added Eye, Users, Clock based on ProjectCard like design
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';

// Re-defining Idea interface based on app/ideas/page.tsx
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
  implementation_count?: number; // Made optional as it's not in the target design
  category: string; 
  difficulty_level: string;
  estimated_time?: string;
  required_skills: string[];
  created_at: string;
  is_liked?: boolean;
  tags?: string[];
  // Adding fields that might be present in the target design or can be derived
  image_url?: string; // For a potential cover image like in ProjectCard
}

export function IdeaCard({ idea }: { idea: Idea }) {
  const [isLikedState, setIsLikedState] = useState(idea.is_liked || false);
  const [currentLikes, setCurrentLikes] = useState(idea.likes_count || 0);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card link navigation
    const newLikedState = !isLikedState;
    setIsLikedState(newLikedState);
    setCurrentLikes(newLikedState ? currentLikes + 1 : currentLikes - 1);
    // TODO: Implement actual API call for liking
    // try {
    //   await fetch(`/api/ideas/${idea.id}/like`, { method: newLikedState ? 'POST' : 'DELETE' });
    // } catch (error) {
    //   console.error('Failed to update like status:', error);
    //   // Revert state on error
    //   setIsLikedState(!newLikedState);
    //   setCurrentLikes(newLikedState ? currentLikes - 1 : currentLikes + 1);
    // }
  };

  const authorName = idea.author.full_name || idea.author.username || 'Usuario Anónimo';
  const authorAvatar = idea.author.avatar_url ? `http://localhost:3001${idea.author.avatar_url}` : '/api/placeholder/40/40';
  const displayTags = idea.tags || idea.required_skills || [];
  const coverImage = idea.image_url || `/api/placeholder/600/400?text=${encodeURIComponent(idea.title)}`; // Placeholder if no image

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, scale: 1.01 }}
      className="h-full group"
    >
      <Link href={`/ideas/${idea.id}`} className="block h-full">
        <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/20 hover:shadow-primary/10 border dark:border-border hover:border-primary/30 dark:hover:border-primary/50 bg-card dark:bg-card backdrop-blur-sm">
          {/* Top section with Category and Difficulty */}
          <div className="p-4 flex justify-between items-center border-b dark:border-border">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <Badge variant="secondary" className="text-xs">{idea.category}</Badge>
            </div>
            <Badge variant="outline" className="text-xs capitalize dark:border-border dark:text-muted-foreground">{idea.difficulty_level.replace(/_/g, ' ')}</Badge>
          </div>

          {/* Author and Time Ago */}
          <div className="p-4 flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/30 dark:border-primary/50">
              {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} />}
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">
                {authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground dark:text-foreground">{authorName}</p>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                {formatDistanceToNow(new Date(idea.created_at), { addSuffix: true, locale: es })}
              </p>
            </div>
          </div>

          <CardContent className="p-4 pt-0 flex-grow">
            <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200 dark:text-foreground">
              {idea.title}
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-3 line-clamp-3 leading-relaxed">
              {idea.description}
            </p>
            
            {/* Tags/Required Skills */}
            {displayTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-1">
                {displayTags.slice(0, 5).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30 text-primary dark:text-primary/80 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                    {tag}
                  </Badge>
                ))}
                {displayTags.length > 5 && (
                  <Badge variant="outline" className="text-xs bg-muted/50 dark:bg-muted/30 border-border dark:border-border text-muted-foreground dark:text-muted-foreground">
                    +{displayTags.length - 5}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="p-4 pt-3 border-t dark:border-border flex justify-between items-center bg-muted/20 dark:bg-muted/30">
            <div className="flex items-center gap-3 text-xs text-muted-foreground dark:text-muted-foreground">
              <button 
                onClick={handleLikeClick}
                className="flex items-center gap-1 hover:text-primary dark:hover:text-primary/80 transition-colors p-1 rounded-md hover:bg-primary/10 dark:hover:bg-primary/20"
                aria-label={isLikedState ? 'Quitar me gusta' : 'Me gusta'}
              >
                <ThumbsUp 
                  className={cn(
                    "h-4 w-4 transition-all duration-200", 
                    isLikedState ? "fill-primary text-primary dark:fill-primary/80 dark:text-primary/80" : "group-hover:text-primary dark:group-hover:text-primary/80"
                  )} 
                />
                <span>{currentLikes}</span>
              </button>
              
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{idea.comments_count || 0}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{idea.views_count || 0}</span>
              </div>
            </div>
            
            <Badge variant="default" className="text-xs bg-gradient-to-r from-primary to-accent text-primary-foreground dark:from-primary/80 dark:to-accent/80 dark:text-accent-foreground">
              Idea
            </Badge>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}