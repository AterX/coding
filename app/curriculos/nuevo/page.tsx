'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, Plus, X, User, MapPin, GraduationCap, Briefcase, DollarSign, Clock, FileText, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function NewCVPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSkill, setCurrentSkill] = useState('');
  const [skillTags, setSkillTags] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    location: '',
    experience: '',
    summary: '',
    education: '',
    availability: '',
    salary: '',
    phone: '',
    bankAccount: '',
    identityDocument: null as File | null
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skillTags.includes(currentSkill.trim())) {
      setSkillTags(prev => [...prev, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkillTags(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validación básica
    if (!formData.name.trim() || !formData.title.trim() || !formData.location.trim() || 
        !formData.experience.trim() || !formData.summary.trim() || !formData.education.trim() ||
        !formData.availability || !formData.salary.trim() || !formData.phone.trim() || 
        !formData.bankAccount.trim() || !formData.identityDocument || skillTags.length === 0) {
      toast.error('Por favor completa todos los campos requeridos, incluyendo el documento de identidad');
      setIsSubmitting(false);
      return;
    }
    
    // Simular envío del formulario
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular envío al backend y obtener el nuevo CV (o generarlo)
    const newCV = {
      id: String(Date.now()), // ID único simple para la simulación
      ...formData,
      avatar: formData.avatar ? URL.createObjectURL(formData.avatar) : '/api/placeholder/60/60', // Simular URL de avatar
      skills: skillTags,
      createdAt: new Date().toISOString(),
    };

    // Actualizar localStorage
    try {
      const existingCVs = JSON.parse(localStorage.getItem('cvProfiles') || '[]');
      const updatedCVs = [...existingCVs, newCV];
      localStorage.setItem('cvProfiles', JSON.stringify(updatedCVs));
      // Disparar un evento de storage para que otras pestañas/componentes puedan reaccionar si es necesario
      // Esto es importante porque la actualización directa de localStorage no dispara el evento 'storage' en la misma página.
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'cvProfiles',
        newValue: JSON.stringify(updatedCVs),
        oldValue: JSON.stringify(existingCVs),
        storageArea: localStorage,
      }));
    } catch (error) {
      console.error('Error al guardar CV en localStorage:', error);
      toast.error('Error al guardar el CV localmente.');
      setIsSubmitting(false);
      return;
    }
    
    console.log('Datos del CV guardados:', newCV);
    
    toast.success('CV creado exitosamente y guardado localmente.');
    setIsSubmitting(false);
    // Redirigir a la pestaña de currículos en la página de servicios
    router.push('/servicios?tab=curriculos');
  };

  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/servicios">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Crear Perfil Profesional</h1>
            <p className="text-muted-foreground">Completa tu información para que los empleadores puedan encontrarte</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Información básica que aparecerá en tu perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Título Profesional *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="ej. Desarrollador Full Stack"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Ciudad, País"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Número de Teléfono *</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+34 600 123 456"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="bankAccount">Cuenta Bancaria (IBAN) *</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <div className="space-y-2">
                          <p className="font-medium">Sistema de Depósito en Garantía</p>
                          <p className="text-sm">
                            Tu cuenta bancaria es necesaria para recibir pagos de forma segura. 
                            Los empleadores depositan el pago en una cuenta de garantía antes de que comiences el trabajo, 
                            y los fondos se transfieren automáticamente a tu cuenta una vez completado el proyecto.
                          </p>
                          <p className="text-sm font-medium text-primary">
                            Esto protege tanto al empleador como al empleado.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <Input
                    id="bankAccount"
                    type="text"
                    value={formData.bankAccount || ''}
                    onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                    placeholder="ES91 2100 0418 4502 0005 1332"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Necesario para el sistema de depósito en garantía y transferencias de pago
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="identityDocument">Documento de Identidad *</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md">
                        <div className="space-y-3">
                          <p className="font-medium text-primary">¿Por qué necesitamos verificar tu identidad?</p>
                          
                          <div className="space-y-2">
                            <div>
                              <p className="font-medium text-sm">🛡️ Seguridad contra fraudes:</p>
                              <p className="text-xs text-muted-foreground">
                                Al certificar tu identidad, evitamos que cuentas falsas o usuarios malintencionados se beneficien de tu trabajo o retengan tu pago.
                              </p>
                            </div>
                            
                            <div>
                              <p className="font-medium text-sm">💰 Transparencia en transacciones:</p>
                              <p className="text-xs text-muted-foreground">
                                Nuestro sistema de depósito en garantía (escrow) sólo libera fondos a un perfil verificado, de modo que tú sabes que el dinero ya está reservado antes de empezar a trabajar.
                              </p>
                            </div>
                            
                            <div>
                              <p className="font-medium text-sm">🤝 Confianza mutua:</p>
                              <p className="text-xs text-muted-foreground">
                                Tanto empleadores como empleados ganan confianza sabiendo que cada persona es quien dice ser, evitando disputas y retrasos en los pagos.
                              </p>
                            </div>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative flex items-center border border-input rounded-md h-12 pr-2">
                    <span className="flex-grow pl-3 text-sm text-muted-foreground">
                      {formData.identityDocument ? formData.identityDocument.name : "Ningún archivo seleccionado"}
                    </span>
                    <Input
                      id="identityDocumentInput"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFormData(prev => ({ ...prev, identityDocument: file }));
                      }}
                      required
                      className="sr-only" // Hide the default input
                    />
                    <Button 
                      type="button" 
                      variant="default" 
                      size="sm" 
                      className="ml-2 shrink-0"
                      onClick={() => document.getElementById('identityDocumentInput')?.click()}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Seleccionar Archivo
                    </Button>
                  </div>
                 <div className="bg-muted/50 p-3 rounded-lg border border-border">
                   <p className="text-xs text-foreground">
                     <strong>Sube tu documento oficial para validar tu identidad.</strong> Esto nos permite garantizar que los fondos depositados en garantía (escrow) se liberen sólo al titular legítimo de la cuenta y evitar posibles fraudes.
                   </p>
                   <p className="text-xs text-muted-foreground mt-1">
                     Acepta: Pasaporte, DNI, Cédula profesional, Licencia de conducir (anverso y reverso en un solo archivo)
                   </p>
                 </div>
                 <div className="bg-muted/30 p-3 rounded-lg border border-border">
                   <p className="text-xs text-foreground">
                     <strong>Tu pago quedará retenido en nuestra cuenta de garantía.</strong> Solamente se liberará cuando el trabajo esté entregado y tu identidad esté verificada, de modo que evitamos estafas y garantizamos la llegada del pago a la persona correcta.
                   </p>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Experiencia y Educación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Experiencia y Educación
              </CardTitle>
              <CardDescription>
                Información sobre tu trayectoria profesional y académica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="experience">Experiencia Profesional *</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Describe tu experiencia profesional más relevante..."
                    className="pl-10 min-h-[100px]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Educación *</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="education"
                    value={formData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    placeholder="Describe tu formación académica..."
                    className="pl-10 min-h-[80px]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Resumen Profesional *</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                    placeholder="Breve resumen de tu perfil profesional..."
                    className="pl-10 min-h-[100px]"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Habilidades */}
          <Card>
            <CardHeader>
              <CardTitle>Habilidades Técnicas</CardTitle>
              <CardDescription>
                Agrega las tecnologías y herramientas que dominas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="ej. React, Node.js, Python..."
                  className="flex-1"
                />
                <Button type="button" onClick={addSkill} size="icon" className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {skillTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skillTags.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {skillTags.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Agrega al menos una habilidad para continuar
                </p>
              )}
            </CardContent>
          </Card>

          {/* Disponibilidad y Salario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Disponibilidad y Expectativas
              </CardTitle>
              <CardDescription>
                Información sobre tu disponibilidad y expectativas salariales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="availability">Disponibilidad *</Label>
                  <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu disponibilidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inmediata">Inmediata</SelectItem>
                      <SelectItem value="2-semanas">En 2 semanas</SelectItem>
                      <SelectItem value="1-mes">En 1 mes</SelectItem>
                      <SelectItem value="2-meses">En 2 meses</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary">Expectativa Salarial *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="salary"
                      value={formData.salary}
                      onChange={(e) => handleInputChange('salary', e.target.value)}
                      placeholder="ej. $50,000 - $70,000 USD/año"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex gap-4 justify-end">
            <Link href="/servicios">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando perfil...' : 'Crear Perfil'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}