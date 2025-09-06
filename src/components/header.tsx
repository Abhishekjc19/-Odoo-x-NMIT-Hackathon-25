"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { Menu, Search, ShoppingCart, LogOut } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { cn } from '@/lib/utils';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href}>
      <span className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-muted-foreground"
      )}>
        {children}
      </span>
    </Link>
  );
};


function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('search') || '');

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
            params.set('search', query);
        } else {
            params.delete('search');
        }
        router.push(`/?${params.toString()}`);
    };
    
    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-lg">
            <Input
                type="search"
                placeholder="Search for items..."
                className="h-12 text-md pl-6 pr-14 bg-white/5 border-white/10 focus:bg-white/10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" size="icon" variant="ghost" className="absolute top-0 right-0 h-full w-14">
                <Search className="h-6 w-6" />
            </Button>
        </form>
    );
}

export function Header() {
  const { isLoggedIn, logout } = useAuth();
  const { cart } = useCart();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const navLinks = (
    <>
      {isLoggedIn ? (
        <>
          <NavLink href="/my-listings">My Listings</NavLink>
          <NavLink href="/account">Account</NavLink>
          <NavLink href="/purchases">Purchases</NavLink>
        </>
      ) : (
        <>
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/50 backdrop-blur-lg">
      <div className="container flex h-20 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo />
        </div>
        
        <div className="hidden md:flex flex-1 justify-center px-8">
            <SearchBar />
        </div>

        <div className="hidden md:flex items-center gap-4">
          {navLinks}
           {isLoggedIn && (
            <>
                <Link href="/cart">
                    <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
                                {cart.length}
                            </span>
                        )}
                    </Button>
                </Link>
                <Button onClick={logout} variant="ghost" size="icon">
                    <LogOut className="h-5 w-5" />
                </Button>
            </>
           )}
        </div>

        <div className="md:hidden flex items-center">
          <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative mr-2">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
                          {cart.length}
                      </span>
                  )}
              </Button>
          </Link>
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background/80 backdrop-blur-xl">
              <div className="flex flex-col h-full">
                <div className="p-4">
                  <Logo />
                </div>
                <div className="p-4">
                    <SearchBar />
                </div>
                <nav className="flex flex-col gap-4 p-4">
                  {isLoggedIn ? (
                    <>
                      <Link href="/my-listings" onClick={() => setSheetOpen(false)}>My Listings</Link>
                      <Link href="/account" onClick={() => setSheetOpen(false)}>Account</Link>
                      <Link href="/purchases" onClick={() => setSheetOpen(false)}>Purchases</Link>
                      <Button onClick={() => { logout(); setSheetOpen(false); }} variant="outline">Logout</Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setSheetOpen(false)}>
                        <Button variant="outline" className="w-full">Login</Button>
                      </Link>
                      <Link href="/signup" onClick={() => setSheetOpen(false)}>
                        <Button className="w-full bg-accent text-accent-foreground">Sign Up</Button>
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
