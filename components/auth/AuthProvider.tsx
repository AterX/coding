'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  
  const supabase = createClientComponentClient();
  
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata,
            access_token: session.access_token
          });
        } else {
          setUser(null);
        }
        // No setIsLoading(false) here, as getSession handles initial loading
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase.auth]);
  
  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        // Check if user needs email confirmation
        if (!data.session) {
          // User created but needs email confirmation
          toast({
            title: "Registro exitoso",
            description: "Revisa tu email para confirmar tu cuenta.",
          });
          router.push('/confirmar-email');
        } else {
          // User created and automatically signed in
          setUser({
            id: data.user.id,
            email: data.user.email,
            user_metadata: data.user.user_metadata,
            access_token: data.session.access_token
          });
          toast({
            title: "Registro exitoso",
            description: "Tu cuenta ha sido creada correctamente.",
          });
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      toast({
        title: "Error al registrarse",
        description: error.message || "Ocurrió un error al crear tu cuenta.",
        variant: "destructive",
      });
      console.error('Error signing up:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.user && data?.session) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata,
          access_token: data.session.access_token
        });
        toast({
          title: "Inicio de sesión exitoso",
          description: "Has iniciado sesión correctamente.",
        });
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "Credenciales incorrectas.",
        variant: "destructive",
      });
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Clear user state immediately
      setUser(null);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out from Supabase:', error);
      }
      
      // Clear all local storage related to auth
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('sb-localhost-auth-token');
        sessionStorage.clear();
      }
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
      router.push('/');
    } catch (error: any) {
      // Even if there's an error, clear the user state
      setUser(null);
      toast({
        title: "Sesión cerrada",
        description: "Sesión cerrada (con advertencias).",
        variant: "default",
      });
      console.error('Error signing out:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}