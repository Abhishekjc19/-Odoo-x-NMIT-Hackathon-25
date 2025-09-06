import { Logo } from '@/components/logo';
import { Github, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center sm:items-start">
            <Logo />
            <p className="text-sm text-muted-foreground mt-2">© {new Date().getFullYear()} EcoSwap. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
        </div>
      </div>
    </footer>
  );
}
