'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code, Users, Lightbulb, BookOpen, Rocket, MessageSquare, Plus, FileText, Star, MapPin, Clock, Euro, Briefcase, GraduationCap, Award, Download } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Mock data for service offers
const serviceOffers = [
  {
    id: '1',
    title: 'Desarrollo Web Full Stack',
    description: 'Desarrollo completo de aplicaciones web modernas con React, Node.js y bases de datos.',
    author: {
      id: '1',
      name: 'Carlos Mendoza',
      avatar: '/api/placeholder/40/40',
      rating: 4.9,
      completedProjects: 45
    },
    category: 'Desarrollo Web',
    priceType: 'Por Hora',
    price: '50€/hora',
    deliveryTime: '2-4 semanas',
    location: 'Madrid, España',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    experience: '5+ años desarrollando aplicaciones web escalables para startups y empresas.',
    portfolio: 'https://carlos-dev.com',
    contactEmail: 'carlos@example.com',
    contactPhone: '+34 600 123 456',
    createdAt: '2024-01-15T10:00:00Z',
    featured: true
  },
  {
    id: '2',
    title: 'Diseño UI/UX para Apps Móviles',
    description: 'Diseño de interfaces intuitivas y experiencias de usuario excepcionales para aplicaciones móviles.',
    author: {
      id: '2',
      name: 'Ana García',
      avatar: '/api/placeholder/40/40',
      rating: 4.8,
      completedProjects: 32
    },
    category: 'Diseño',
    priceType: 'Por Proyecto',
    price: '1500€ - 3000€',
    deliveryTime: '3-6 semanas',
    location: 'Barcelona, España',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    experience: '4 años especializándome en UX/UI para aplicaciones móviles iOS y Android.',
    portfolio: 'https://ana-design.com',
    contactEmail: 'ana@example.com',
    createdAt: '2024-01-14T15:30:00Z',
    featured: false
  },
  {
    id: '3',
    title: 'Consultoría en DevOps y Cloud',
    description: 'Implementación de pipelines CI/CD, infraestructura como código y migración a la nube.',
    author: {
      id: '3',
      name: 'Miguel Torres',
      avatar: '/api/placeholder/40/40',
      rating: 5.0,
      completedProjects: 28
    },
    category: 'DevOps',
    priceType: 'Por Hora',
    price: '75€/hora',
    deliveryTime: '1-8 semanas',
    location: 'Valencia, España',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    experience: '7 años implementando soluciones DevOps para empresas de diferentes sectores.',
    portfolio: 'https://miguel-devops.com',
    contactEmail: 'miguel@example.com',
    contactPhone: '+34 600 789 012',
    createdAt: '2024-01-13T09:15:00Z',
    featured: true
  }
];

// Mock data for CVs
const cvProfiles = [
  {
    id: '1',
    name: 'Laura Rodríguez',
    title: 'Frontend Developer',
    avatar: '/api/placeholder/60/60',
    location: 'Madrid, España',
    experience: '3 años',
    skills: ['React', 'Vue.js', 'TypeScript', 'CSS', 'JavaScript'],
    education: 'Ingeniería Informática - Universidad Politécnica de Madrid',
    summary: 'Desarrolladora frontend apasionada por crear interfaces de usuario modernas y accesibles.',
    availability: 'Disponible',
    salary: '35.000€ - 45.000€',
    createdAt: '2024-01-16T12:00:00Z'
  },
  {
    id: '2',
    name: 'David Martín',
    title: 'Backend Developer',
    avatar: '/api/placeholder/60/60',
    location: 'Barcelona, España',
    experience: '5 años',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'AWS'],
    education: 'Máster en Ingeniería de Software - UPC',
    summary: 'Especialista en desarrollo backend escalable y arquitecturas de microservicios.',
    availability: 'Disponible en 2 semanas',
    salary: '45.000€ - 55.000€',
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '3',
    name: 'Sofia Chen',
    title: 'Data Scientist',
    avatar: '/api/placeholder/60/60',
    location: 'Sevilla, España',
    experience: '4 años',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'R'],
    education: 'Doctorado en Ciencias de Datos - Universidad de Sevilla',
    summary: 'Científica de datos con experiencia en machine learning y análisis predictivo.',
    availability: 'Disponible',
    salary: '40.000€ - 50.000€',
    createdAt: '2024-01-14T16:45:00Z'
  }
];

// Interfaz para el perfil de CV
interface CVProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  location: string;
  experience: string;
  skills: string[];
  education: string;
  summary: string;
  availability: string;
  salary: string;
  createdAt: string;
}

import { useEffect, Suspense } from 'react'; // Añadir Suspense
import { useSearchParams } from 'next/navigation'; // Añadir useSearchParams

// Interfaz para el perfil de CV
interface CVProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  location: string;
  experience: string;
  skills: string[];
  education: string;
  summary: string;
  availability: string;
  salary: string;
  createdAt: string;
}

function ServicesPageContent() { // Mover el contenido a un componente hijo para usar useSearchParams
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'ofertas');
  const [currentCvProfiles, setCurrentCvProfiles] = useState<CVProfile[]>(cvProfiles); // Estado para los CVs

  // Simular la carga de CVs desde una API
  useEffect(() => {
    // En un caso real, aquí se haría una llamada a la API
    // Por ahora, usamos los datos mock y verificamos si hay nuevos datos en localStorage
    const storedCvProfiles = localStorage.getItem('cvProfiles');
    if (storedCvProfiles) {
      setCurrentCvProfiles(JSON.parse(storedCvProfiles));
    } else {
      // Si no hay nada en localStorage, usamos los datos mock iniciales
      // y los guardamos en localStorage para persistencia entre cargas de página (simulación)
      localStorage.setItem('cvProfiles', JSON.stringify(cvProfiles));
    }
  }, []);

  // Escuchar cambios en localStorage para actualizar los perfiles de CV
  // Esto es útil si otra pestaña/componente modifica los CVs
  useEffect(() => {
    const handleStorageChange = () => {
      const storedCvProfiles = localStorage.getItem('cvProfiles');
      if (storedCvProfiles) {
        setCurrentCvProfiles(JSON.parse(storedCvProfiles));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Servicios y Talento
        </h1>
        <p className="text-lg text-muted-foreground">
          Conecta con profesionales para servicios especializados o encuentra el talento perfecto para tu equipo.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="ofertas" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Ofertas de Servicio
          </TabsTrigger>
          <TabsTrigger value="curriculos" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Currículos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ofertas" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Ofertas de Servicio</h2>
            <Link href="/servicios/nuevo">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Crear Servicio
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceOffers.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="h-full group"
              >
                <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/20 hover:shadow-primary/10 border dark:border-border hover:border-primary/30 dark:hover:border-primary/50 bg-card dark:bg-card backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/30">
                          {service.author.avatar && <AvatarImage src={service.author.avatar} alt={service.author.name} />}
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">
                            {service.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{service.author.name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{service.author.rating}</span>
                            <span>•</span>
                            <span>{service.author.completedProjects} proyectos</span>
                          </div>
                        </div>
                      </div>
                      {service.featured && (
                        <Badge variant="default" className="bg-gradient-to-r from-primary to-accent text-xs">
                          Destacado
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-grow space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{service.location}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {service.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
                          {skill}
                        </Badge>
                      ))}
                      {service.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs bg-muted/50 border-border text-muted-foreground">
                          +{service.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                    
                    {service.deliveryTime && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Entrega: {service.deliveryTime}</span>
                      </div>
                    )}
                    
                    {service.experience && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {service.experience}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDistanceToNow(new Date(service.createdAt), { addSuffix: true, locale: es })}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-3 border-t dark:border-border flex justify-between items-center">
                    <div className="flex flex-col">
                      <div className="text-lg font-bold text-primary">
                        {service.price}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {service.priceType}
                      </div>
                    </div>
                    <Button size="sm">Contactar</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="curriculos" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Currículos Disponibles</h2>
            <Link href="/curriculos/nuevo">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Subir CV
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentCvProfiles.map((profile) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="h-full group"
              >
                <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/20 hover:shadow-primary/10 border dark:border-border hover:border-primary/30 dark:hover:border-primary/50 bg-card dark:bg-card backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 border-2 border-primary/30">
                        {profile.avatar && <AvatarImage src={profile.avatar} alt={profile.name} />}
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg">
                          {profile.name.split(' ').map(n => n.charAt(0)).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">
                          {profile.name}
                        </CardTitle>
                        <p className="text-lg font-medium text-primary mb-2">{profile.title}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{profile.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            <span>{profile.experience}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-grow space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {profile.summary}
                    </p>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Code className="h-4 w-4" />
                        Habilidades
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.skills.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
                            {skill}
                          </Badge>
                        ))}
                        {profile.skills.length > 5 && (
                          <Badge variant="outline" className="text-xs bg-muted/50 border-border text-muted-foreground">
                            +{profile.skills.length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        Educación
                      </h4>
                      <p className="text-xs text-muted-foreground">{profile.education}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Disponibilidad:</span>
                        <p className="font-medium text-green-600 dark:text-green-400">{profile.availability}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Salario:</span>
                        <p className="font-medium">{profile.salary}</p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-3 border-t dark:border-border flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true, locale: es })}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        CV
                      </Button>
                      <Button size="sm">Contactar</Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Envolver el componente principal con Suspense para que useSearchParams funcione correctamente
export default function ServicesPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}> {/* Suspense para useSearchParams */}
      <ServicesPageContent />
    </Suspense>
  );
}