'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion'; // Asegurarse que motion está importado
import { Button } from '@/components/ui/button';
import { IdeaCard } from '@/components/ideas/IdeaCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'; 

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
  tags?: string[];
}

const slideInFromRight = {
  hidden: { opacity: 0, x: 50 }, // Inicia desde la derecha
  visible: { opacity: 1, x: 0 }
};

export function LatestIdeas() {
  const [latestIdeas, setLatestIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestIdeas = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3001/api/ideas?limit=3&sortBy=created_at&order=desc');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLatestIdeas(data.ideas || data); 
      } catch (e: any) {
        console.error("Failed to fetch latest ideas:", e);
        setError('No se pudieron cargar las últimas ideas. Inténtalo de nuevo más tarde.');
      }
      setLoading(false);
    };

    fetchLatestIdeas();
  }, []);

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Últimas ideas</h2>
            <p className="text-muted-foreground">Inspiración e innovación de nuestra comunidad</p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link href="/ideas">
              Ver todas las ideas
            </Link>
          </Button>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-full" />
                  </CardHeader>
                  <CardContent className="pb-4 flex-grow">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-4" />
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 border-t">
                    <div className="flex items-center justify-between w-full text-sm">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-5 w-10" />
                        <Skeleton className="h-5 w-10" />
                      </div>
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-8">
            <p>{error}</p>
            {/* Removed retry button for simplicity, can be added back if needed */}
          </div>
        )}

        {!loading && !error && latestIdeas.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>Aún no hay ideas publicadas. ¡Sé el primero en compartir la tuya!</p>
            <Button asChild className="mt-4">
              <Link href="/ideas/nuevo">Publicar una idea</Link>
            </Button>
          </div>
        )}

        {!loading && !error && latestIdeas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestIdeas.map((idea, index) => (
              <motion.div
                key={idea.id}
                variants={slideInFromRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }} // Ajustar delay si es necesario
              >
                <IdeaCard idea={idea} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}