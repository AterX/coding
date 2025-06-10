'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

const ideaCategories = [
  "Web Development", 
  "Mobile Development", 
  "Data Science", 
  "AI/ML", 
  "DevOps", 
  "Social", 
  "Productividad", 
  "Educación", 
  "Salud", 
  "Entretenimiento", 
  "Finanzas",
  "Otro"
];

const ideaDifficulties = [
  { value: "beginner", label: "Principiante" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzado" },
];

export default function NuevaIdeaPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Debes iniciar sesión para proponer una idea.');
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddSkill = () => {
    if (currentSkill && !requiredSkills.includes(currentSkill)) {
      setRequiredSkills([...requiredSkills, currentSkill]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setRequiredSkills(requiredSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Debes estar autenticado para crear una idea.');
      return;
    }
    setIsSubmitting(true);

    if (!title || !description || !category || !difficulty) {
      toast.error('Por favor, completa todos los campos obligatorios: título, descripción, categoría y dificultad.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({
          title,
          description,
          content,
          category,
          difficulty_level: difficulty,
          tags,
          required_skills: requiredSkills,
          estimated_time: estimatedTime || null,
        }),
      });

      if (response.ok) {
        toast.success('Idea creada con éxito!');
        router.push('/ideas');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error al crear la idea.');
      }
    } catch (error) {
      console.error('Error creating idea:', error);
      toast.error('Error de conexión al crear la idea.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Cargando...</div>;
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-8 text-center">Redirigiendo a login...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Comparte tu Nueva Idea</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Título de la Idea <span className="text-red-500">*</span></Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Un título breve y descriptivo" required />
            </div>
            <div>
              <Label htmlFor="description">Descripción Corta <span className="text-red-500">*</span></Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Un resumen de tu idea (máx. 200 caracteres)" maxLength={200} required />
            </div>
            <div>
              <Label htmlFor="content">Detalles de la Idea (Opcional)</Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Describe tu idea con más detalle. ¿Qué problema resuelve? ¿Cómo funcionaría?" rows={6} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category">Categoría <span className="text-red-500">*</span></Label>
                <Select onValueChange={setCategory} value={category} required>
                  <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                  <SelectContent>
                    {ideaCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty">Dificultad Estimada <span className="text-red-500">*</span></Label>
                <Select onValueChange={setDifficulty} value={difficulty} required>
                  <SelectTrigger><SelectValue placeholder="Selecciona una dificultad" /></SelectTrigger>
                  <SelectContent>
                    {ideaDifficulties.map(diff => (
                      <SelectItem key={diff.value} value={diff.value}>{diff.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="estimatedTime">Tiempo Estimado de Desarrollo (Opcional)</Label>
              <Input id="estimatedTime" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} placeholder="Ej: 1 semana, 2-3 meses" />
            </div>
            <div>
              <Label htmlFor="requiredSkills">Habilidades Requeridas (Opcional)</Label>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  id="currentSkill"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  placeholder="Ej: React, Python, Diseño UI"
                />
                <Button type="button" onClick={handleAddSkill} size="icon" className="bg-blue-500 hover:bg-blue-600 text-white shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map(skill => (
                  <span key={skill} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center">
                    {skill}
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveSkill(skill)} className="ml-1 h-auto p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="tags">Etiquetas (Opcional)</Label>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  id="currentTag"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Ej: #innovador, #educativo"
                />
                <Button type="button" onClick={handleAddTag} size="icon" className="bg-blue-500 hover:bg-blue-600 text-white shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm flex items-center">
                    {tag}
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveTag(tag)} className="ml-1 h-auto p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push('/ideas')}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting || authLoading}>
                {isSubmitting ? 'Enviando Idea...' : 'Compartir Idea'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}