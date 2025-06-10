'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, signUp as supabaseSignUp, signIn as supabaseSignIn, signOut as supabaseSignOut } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type User = {
  id: string;
  email?: string;
  user_metadata?: any;
  access_token?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProviderBolt({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
    const getSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
        } else if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata,
            access_token: session.access_token
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata,
            access_token: session.access_token
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseSignUp(email, password);
      
      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: "Error en el registro",
          description: error.message || "Ocurrió un error durante el registro",
          variant: "destructive",
        });
        throw error;
      }

      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "¡Registro exitoso!",
          description: "Por favor, revisa tu email para confirmar tu cuenta.",
        });
        router.push('/confirmar-email');
      } else if (data.user) {
        toast({
          title: "¡Bienvenido!",
          description: "Tu cuenta ha sido creada exitosamente.",
        });
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Error in handleSignUp:', error);
      toast({
        title: "Error en el registro",
        description: error.message || "Ocurrió un error durante el registro",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseSignIn(email, password);
      
      if (error) {
        console.error('Sign in error:', error);
        let errorMessage = "Credenciales inválidas";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Email o contraseña incorrectos";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Por favor, confirma tu email antes de iniciar sesión";
        } else if (error.message.includes('Too many requests')) {
          errorMessage = "Demasiados intentos. Intenta de nuevo más tarde";
        }
        
        toast({
          title: "Error en el inicio de sesión",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      }

      if (data.user) {
        toast({
          title: "¡Bienvenido de vuelta!",
          description: "Has iniciado sesión exitosamente.",
        });
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Error in handleSignIn:', error);
      // Error already handled above
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      
      // Sign out from Supabase
      const { error } = await supabaseSignOut();
      
      if (error) {
        console.error('Error signing out from Supabase:', error);
        throw error;
      }
      
      // Clear local storage
      localStorage.removeItem('supabase.auth.token');
      
      setUser(null);
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
      
      router.push('/');
    } catch (error: any) {
      console.error('Error in handleSignOut:', error);
      toast({
        title: "Error al cerrar sesión",
        description: "Ocurrió un error al cerrar la sesión",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}