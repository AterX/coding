'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { X, Plus } from 'lucide-react';

const resourceTypes = ['tutorial', 'video', 'code', 'article'];

export default function NewResourcePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Debes iniciar sesión para compartir un recurso.');
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[handleSubmit] Iniciando envío...');
    console.log('[handleSubmit] User:', user);

    if (!user) {
      console.error('[handleSubmit] Error: Usuario no autenticado.');
      toast.error('Autenticación requerida.');
      return;
    }

    console.log('[handleSubmit] Datos del formulario:', { title, description, url, type, tags });
    if (!title || !description || !url || !type || tags.length === 0) {
      console.error('[handleSubmit] Error: Faltan campos obligatorios. Tags count:', tags.length);
      toast.error('Por favor, completa todos los campos obligatorios, asegúrate de añadir al menos un tag presionando el botón + o Enter.');
      return;
    }

    console.log('[handleSubmit] Todos los campos validados. Estableciendo submitting = true');
    setSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({ title, description, url, type, tags, author_id: user.id }),
      });

      console.log('[handleSubmit] Respuesta del backend recibida, status:', response.status);
      if (response.ok) {
        toast.success('Recurso compartido con éxito!');
        router.push('/recursos');
      } else {
        const errorData = await response.json();
        console.error('[handleSubmit] Error del backend:', errorData);
        toast.error(errorData.error || 'Error al compartir el recurso.');
      }
    } catch (error) {
      console.error('[handleSubmit] Error en el bloque catch:', error);
      toast.error('Error al conectar con el servidor.');
    } finally {
      console.log('[handleSubmit] Bloque finally. Estableciendo submitting = false');
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Cargando...</div>;
  }

  if (!user) {
    return null; // O un mensaje indicando que se está redirigiendo
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Compartir Nuevo Recurso</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título del Recurso</label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Guía completa de React Hooks" required />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Una breve descripción del recurso..." required />
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">URL del Recurso</label>
              <Input id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://ejemplo.com/recurso" required />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Recurso</label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map(rType => (
                    <SelectItem key={rType} value={rType} className="capitalize">{rType}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (Palabras clave)</label>
              <div className="flex items-center gap-2 mb-2">
                <Input id="tags" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} placeholder="Añade un tag y presiona Enter o el botón" 
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }}}
                />
                <Button type="button" onClick={handleAddTag} size="icon" className="bg-blue-500 hover:bg-blue-600 text-white shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                    {tag}
                    <Button type="button" onClick={() => handleRemoveTag(tag)} variant="ghost" size="icon" className="h-5 w-5 ml-1">
                      <X className="h-3 w-3" />
                    </Button>
                  </span>
                ))}
              </div>
              {tags.length === 0 && <p className="text-xs text-muted-foreground mt-1">Añade al menos un tag.</p>}
            </div>
            <Button type="submit" className="w-full" disabled={submitting || authLoading}>
              {submitting ? 'Compartiendo...' : 'Compartir Recurso'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}