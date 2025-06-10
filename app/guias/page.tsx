'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book, Code, Lightbulb, Terminal, Database, Cloud } from 'lucide-react';

const guides = [
  {
    title: 'Fundamentos de Programación',
    description: 'Guías básicas para empezar en el mundo del desarrollo.',
    icon: <Code className="h-8 w-8 text-primary" />,
    categories: ['Principiante', 'Programación'],
    guides: [
      { title: 'Introducción a la lógica de programación', level: 'Básico' },
      { title: 'Estructuras de control y bucles', level: 'Básico' },
      { title: 'Funciones y modularidad', level: 'Intermedio' },
    ]
  },
  {
    title: 'Desarrollo Web Frontend',
    description: 'Aprende a crear interfaces web modernas y responsivas.',
    icon: <Terminal className="h-8 w-8 text-primary" />,
    categories: ['Frontend', 'Web'],
    guides: [
      { title: 'HTML5 y CSS3 modernos', level: 'Básico' },
      { title: 'JavaScript ES6+', level: 'Intermedio' },
      { title: 'React y componentes', level: 'Avanzado' },
    ]
  },
  {
    title: 'Backend y APIs',
    description: 'Guías para construir servicios robustos y escalables.',
    icon: <Database className="h-8 w-8 text-primary" />,
    categories: ['Backend', 'APIs'],
    guides: [
      { title: 'Introducción a Node.js', level: 'Intermedio' },
      { title: 'RESTful APIs', level: 'Intermedio' },
      { title: 'Bases de datos SQL y NoSQL', level: 'Avanzado' },
    ]
  },
  {
    title: 'Cloud y DevOps',
    description: 'Despliega y escala tus aplicaciones en la nube.',
    icon: <Cloud className="h-8 w-8 text-primary" />,
    categories: ['DevOps', 'Cloud'],
    guides: [
      { title: 'Docker y contenedores', level: 'Intermedio' },
      { title: 'CI/CD con GitHub Actions', level: 'Avanzado' },
      { title: 'Kubernetes básico', level: 'Avanzado' },
    ]
  },
  {
    title: 'Inteligencia Artificial',
    description: 'Explora el mundo de la IA y el aprendizaje automático.',
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    categories: ['IA', 'Machine Learning'],
    guides: [
      { title: 'Fundamentos de Machine Learning', level: 'Intermedio' },
      { title: 'Python para Data Science', level: 'Intermedio' },
      { title: 'Deep Learning básico', level: 'Avanzado' },
    ]
  },
  {
    title: 'Mejores Prácticas',
    description: 'Guías sobre patrones y prácticas de desarrollo profesional.',
    icon: <Book className="h-8 w-8 text-primary" />,
    categories: ['Buenas Prácticas', 'Profesional'],
    guides: [
      { title: 'Control de versiones con Git', level: 'Básico' },
      { title: 'Clean Code', level: 'Intermedio' },
      { title: 'Testing y TDD', level: 'Avanzado' },
    ]
  }
];

export default function GuidesPage() {
  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Guías y Tutoriales
        </h1>
        <p className="text-lg text-muted-foreground">
          Recursos detallados para aprender tecnología paso a paso, desde conceptos básicos hasta temas avanzados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((section, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                {section.icon}
                <div className="flex gap-2">
                  {section.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              <CardTitle className="text-xl">{section.title}</CardTitle>
              <p className="text-muted-foreground text-sm">
                {section.description}
              </p>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {section.guides.map((guide, guideIndex) => (
                  <li key={guideIndex} className="flex items-center justify-between">
                    <span className="text-sm">{guide.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {guide.level}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/guias/${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  Ver guías
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
        <p className="text-muted-foreground mb-6">
          Estamos constantemente añadiendo nuevas guías y recursos.
        </p>
        <Button size="lg" asChild>
          <Link href="/contacto">
            Sugerir tema
          </Link>
        </Button>
      </div>
    </div>
  );
}