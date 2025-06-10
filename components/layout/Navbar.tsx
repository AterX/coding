'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ChevronDown, LogOut, User, Settings, Code, Lightbulb, BookOpen, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>('');
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cargar avatar del usuario
  useEffect(() => {
    const loadUserAvatar = async () => {
      try {
        if (!user?.access_token) {
          setUserAvatar(''); // Limpiar avatar si no hay usuario
          return;
        }
        
        const response = await fetch('http://localhost:3001/api/profiles/me', {
          headers: {
            'Authorization': `Bearer ${user.access_token}`
          }
        });
       
       if (response.ok) {
         const profileData = await response.json();
         if (profileData.avatar_url) {
           setUserAvatar(`http://localhost:3001${profileData.avatar_url}`);
         } else {
           setUserAvatar(''); // Limpiar avatar si es null
         }
       } else {
         setUserAvatar(''); // Limpiar avatar si hay error
       }
     } catch (error) {
       console.error('Error al cargar avatar:', error);
       setUserAvatar(''); // Limpiar avatar si hay error
     }
   };

   loadUserAvatar();
  }, [user]);

  // Enlaces públicos (siempre visibles)
  const publicLinks = [
    { name: 'Inicio', href: '/', icon: null },
    { name: 'Blog', href: '/blog', icon: null },
    { name: 'Guías', href: '/guias', icon: null },
    { name: 'Contacto', href: '/contacto', icon: null },
  ];
  
  // Enlaces privados (solo para usuarios autenticados)
  const privateLinks = [
    { name: 'Proyectos', href: '/proyectos', icon: <Code className="mr-2 h-4 w-4" /> },
    { name: 'Ideas', href: '/ideas', icon: <Lightbulb className="mr-2 h-4 w-4" /> },
    { name: 'Servicios', href: '/servicios', icon: <ShoppingBag className="mr-2 h-4 w-4" /> },
    { name: 'Recursos', href: '/recursos', icon: <BookOpen className="mr-2 h-4 w-4" /> },
  ];
  
  // Determinar qué enlaces mostrar según el estado de autenticación
  const navLinks = user ? privateLinks : publicLinks;
  
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled 
        ? "bg-background/90 backdrop-blur-xl border-b border-primary/20 shadow-lg shadow-primary/5" 
        : "bg-transparent"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="flex items-center space-x-2 font-bold text-xl hover-lift group"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary glow-primary group-hover:animate-pulse">
              <Code className="h-6 w-6 text-white" />
            </div>
            <span className="gradient-text">devibecoding</span>
          </Link>
          
          <nav className="hidden md:flex gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover-lift group",
                  pathname === link.href
                    ? "bg-primary/10 text-primary border border-primary/20 glow-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/10 border border-transparent"
                )}
              >
                {link.icon && <span className="group-hover:animate-pulse">{link.icon}</span>}
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <ModeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover-lift glow-primary">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    {userAvatar && <AvatarImage src={userAvatar} alt={user.email} />}
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 border-primary/20 bg-background/95 backdrop-blur-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{user.email?.split('@')[0]}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary/20" />
                <DropdownMenuItem asChild className="hover:bg-primary/10 hover:text-primary">
                  <Link href="/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-primary/10 hover:text-primary">
                  <Link href="/dashboard/proyectos">
                    <Code className="mr-2 h-4 w-4" />
                    Mis proyectos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-primary/10 hover:text-primary">
                  <Link href="/dashboard/perfil">
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-primary/20" />
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive hover:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary hover-lift">
                <Link href="/login">Acceder</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 hover-lift glow-primary">
                <Link href="/registro">Registrarse</Link>
              </Button>
            </div>
          )}
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 h-full">
                <Link 
                  href="/" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 font-bold text-xl"
                >
                  <span>devibecoding</span>
                </Link>
                
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center py-2 px-3 rounded-md hover:bg-accent transition-colors",
                        pathname === link.href && "bg-accent"
                      )}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  ))}
                </nav>
                
                {user && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center py-2 px-3 rounded-md hover:bg-accent transition-colors"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                        className="flex items-center py-2 px-3 rounded-md hover:bg-accent transition-colors text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
                
                {!user && (
                  <div className="mt-auto flex flex-col gap-2">
                    <Button asChild variant="outline" onClick={() => setIsOpen(false)}>
                      <Link href="/login">Acceder</Link>
                    </Button>
                    <Button asChild onClick={() => setIsOpen(false)}>
                      <Link href="/registro">Registrarse</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}