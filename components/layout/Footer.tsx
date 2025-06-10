import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-background via-muted/20 to-primary/5 border-t border-primary/20 py-12 overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern animate-matrix-sweep"></div>
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 font-bold text-xl mb-4 group">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary glow-primary group-hover:animate-pulse">
                <span className="text-white font-bold">{'</>'}</span>
              </div>
              <span className="gradient-text">devibecoding</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              La plataforma para autodidactas en tecnología. Comparte, aprende y conecta con la comunidad.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" asChild className="hover-lift hover:bg-primary/10 hover:text-primary transition-all duration-300">
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="hover-lift hover:bg-primary/10 hover:text-primary transition-all duration-300">
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="hover-lift hover:bg-primary/10 hover:text-primary transition-all duration-300">
                <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3 text-foreground">Navegar</h3>
            <ul className="space-y-3">
              <li><Link href="/proyectos" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">→ Proyectos</Link></li>
              <li><Link href="/ideas" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">→ Ideas</Link></li>
              <li><Link href="/servicios" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">→ Servicios</Link></li>
              <li><Link href="/recursos" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">→ Recursos</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3 text-foreground">Recursos</h3>
            <ul className="space-y-3">
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">→ Blog</Link></li>
              <li><Link href="/preguntas-frecuentes" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">→ FAQ</Link></li>
              <li><Link href="/guias" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">→ Guías</Link></li>
              <li><Link href="/contacto" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">→ Contacto</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3 text-foreground">Suscríbete</h3>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              Recibe novedades y contenido exclusivo para developers.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="tu@email.com" 
                className="bg-background/50 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all duration-300" 
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 hover-lift glow-primary">
                <Mail className="h-4 w-4 mr-2" />
                <span>Suscribirse</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-primary/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} <span className="text-primary font-medium">devibecoding</span>. Hecho con ❤️ para developers.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacidad" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-y-[-1px]">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-y-[-1px]">
              Términos
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-y-[-1px]">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}