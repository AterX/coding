'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { Code2, Terminal, Zap, Cpu, GitBranch, Braces } from 'lucide-react';

export function HeroSection() {
  const { user } = useAuth();
  
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/5 particles">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-grid-pattern animate-matrix-sweep"></div>
      </div>
      
      {/* Floating code symbols */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 text-primary/20 text-4xl"
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Code2 size={32} />
        </motion.div>
        <motion.div 
          className="absolute top-32 right-20 text-secondary/20 text-3xl"
          animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        >
          <Terminal size={28} />
        </motion.div>
        <motion.div 
          className="absolute bottom-32 left-20 text-accent/20 text-3xl"
          animate={{ y: [-5, 15, -5], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        >
          <Braces size={30} />
        </motion.div>
        <motion.div 
          className="absolute bottom-20 right-10 text-warning/20 text-2xl"
          animate={{ y: [15, -5, 15], rotate: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, delay: 0.5 }}
        >
          <GitBranch size={26} />
        </motion.div>
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div 
            className="flex flex-col justify-center space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm"
              >
                <Zap size={16} className="animate-pulse" />
                <span>Comunidad de Desarrolladores Autodidactas</span>
              </motion.div>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none">
                <span className="gradient-text">
                  Código.
                </span>
                <br />
                <span className="text-foreground">
                  Creatividad.
                </span>
                <br />
                <span className="text-secondary font-extrabold">
                  Comunidad.
                </span>
              </h1>
              
              <motion.p 
                className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Conecta con otros entusiastas de la tecnología, comparte tus proyectos más innovadores y aprende mientras construyes tu futuro en la era de la IA.
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col gap-4 min-[400px]:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {user ? (
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 hover-lift glow-primary group">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Terminal size={20} className="group-hover:animate-pulse" />
                    Mi Dashboard
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 hover-lift glow-primary group">
                  <Link href="/registro" className="flex items-center gap-2">
                    <Code2 size={20} className="group-hover:animate-pulse" />
                    Únete a la comunidad
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5 hover-lift group">
                <Link href="/proyectos" className="flex items-center gap-2">
                  <GitBranch size={20} className="group-hover:animate-pulse" />
                  Explorar proyectos
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-2xl bg-gradient-to-br from-card via-primary/5 to-secondary/10 border border-primary/20 hover-lift">
              {/* Code editor mockup */}
              <div className="absolute inset-0 p-6">
                {/* Editor header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/20">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-sm text-muted-foreground font-mono">devibecoding.tsx</span>
                  </div>
                </div>
                
                {/* Code content */}
                <div className="space-y-3 font-mono text-sm">
                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <span className="text-muted-foreground">1</span>
                    <span className="code-keyword">const</span>
                    <span className="code-function">developer</span>
                    <span className="text-foreground">=</span>
                    <span className="text-foreground">{'{'}</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-2 ml-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                  >
                    <span className="text-muted-foreground">2</span>
                    <span className="text-foreground">passion:</span>
                    <span className="code-string">"coding"</span><span className="text-foreground">,</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-2 ml-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  >
                    <span className="text-muted-foreground">3</span>
                    <span className="text-foreground">community:</span>
                    <span className="code-string">"devibecoding"</span><span className="text-foreground">,</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-2 ml-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                  >
                    <span className="text-muted-foreground">4</span>
                    <span className="text-foreground">skills:</span>
                    <span className="text-foreground">[</span><span className="code-string">"React"</span><span className="text-foreground">,</span>
                    <span className="code-string">"AI"</span><span className="text-foreground">,</span>
                    <span className="code-string">"Innovation"</span><span className="text-foreground">],</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-2 ml-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.6 }}
                  >
                    <span className="text-muted-foreground">5</span>
                    <span className="code-function">build</span><span className="text-foreground">:</span>
                    <span className="text-foreground">() =&gt;</span>
                    <span className="code-string">"amazing projects"</span>
                    <span className="text-foreground">;</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.8 }}
                  >
                    <span className="text-muted-foreground">6</span>
                    <span className="text-foreground">{'}'};</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-2 mt-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 2.0 }}
                  >
                    <span className="text-muted-foreground">8</span>
                    <span className="code-comment">// ¡Únete a nuestra comunidad!</span>
                  </motion.div>
                </div>
                
                {/* Floating icons */}
                <div className="absolute bottom-6 right-6 flex gap-3">
                  <motion.div 
                    className="p-3 rounded-lg bg-primary/10 border border-primary/20 glow-primary"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  >
                    <Cpu size={20} className="text-primary" />
                  </motion.div>
                  <motion.div 
                    className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 glow-secondary"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <Terminal size={20} className="text-secondary" />
                  </motion.div>
                  <motion.div 
                    className="p-3 rounded-lg bg-accent/10 border border-accent/20 glow-accent"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    <Code2 size={20} className="text-accent" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}