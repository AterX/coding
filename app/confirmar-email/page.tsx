'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function ConfirmarEmailPage() {
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    setResendMessage('');
    
    try {
      // Aquí iría la lógica para reenviar el email de confirmación
      // Por ahora simularemos la acción
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResendMessage('Email de confirmación reenviado exitosamente.');
    } catch (error) {
      setResendMessage('Error al reenviar el email. Inténtalo de nuevo.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 shadow-xl">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 p-3 rounded-full bg-primary/10"
            >
              <Mail className="h-8 w-8 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl font-bold gradient-text">
              ¡Confirma tu email!
            </CardTitle>
            <CardDescription className="text-base">
              Te hemos enviado un enlace de confirmación
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-4"
            >
              <div className="p-4 bg-muted/50 rounded-lg border border-primary/10">
                <p className="text-sm text-muted-foreground mb-2">
                  Hemos enviado un email de confirmación a:
                </p>
                <p className="font-semibold text-primary break-all">
                  {email || 'tu dirección de email'}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Revisa tu bandeja de entrada y haz clic en el enlace de confirmación</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Si no encuentras el email, revisa tu carpeta de spam</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>El enlace expira en 24 horas</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {resendMessage && (
                <div className={`p-3 rounded-lg text-sm text-center ${
                  resendMessage.includes('Error') 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {resendMessage}
                </div>
              )}
              
              <Button
                onClick={handleResendEmail}
                disabled={isResending || !email}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Reenviando...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Reenviar email de confirmación
                  </>
                )}
              </Button>
              
              <Button asChild variant="ghost" className="w-full">
                <Link href="/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al inicio de sesión
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-muted-foreground">
            ¿Problemas con la confirmación?{' '}
            <Link href="/contacto" className="text-primary hover:underline">
              Contáctanos
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}