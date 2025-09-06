"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { Menu, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} onClick={onClick}>
      <span className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-foreground/60",
        "p-2"
      )}>
        {children}
      </span>
    </Link>
  );
};

export function Header() {
  const { isLoggedIn, logout, user } = useAuth();
  const { cart } = useCart();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const closeSheet = () => setSheetOpen(false);
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return names[0].substring(0, 2);
  }

  const userMenu = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt={user?.displayName} />
              <AvatarFallback>{user?.displayName ? getInitials(user.displayName) : 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link href="/my-listings">My Listings</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link href="/purchases">Purchases</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link href="/account">Account</Link></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );

  const authLinks = (
    <div className='hidden md:flex items-center gap-2'>
      <Button asChild variant="ghost">
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/signup">Sign Up</Link>
      </Button>
    </div>
  )

  const mobileNavLinks = (
     <nav className="flex flex-col gap-4 p-4 text-lg">
        {isLoggedIn && user ? (
            <>
                <div className="p-2 border-b mb-2">
                    <p className="font-bold">{user.displayName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <NavLink href="/my-listings" onClick={closeSheet}>My Listings</NavLink>
                <NavLink href="/purchases" onClick={closeSheet}>Purchases</NavLink>
                <NavLink href="/account" onClick={closeSheet}>Account</NavLink>
                <div className="mt-4">
                    <Button onClick={() => { logout(); closeSheet(); }} variant="outline" className="w-full">Logout</Button>
                </div>
            </>
        ) : (
            <div className="flex flex-col gap-2 pt-4">
                <Link href="/login" onClick={closeSheet}>
                    <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/signup" onClick={closeSheet}>
                    <Button className="w-full">Sign Up</Button>
                </Link>
            </div>
        )}
    </nav>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Logo />
        </div>
        
        <nav className="hidden md:flex items-center gap-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/#about">About</NavLink>
            <NavLink href="/#contact">Contact</NavLink>
        </nav>

        <div className="flex items-center gap-4">
           {isLoggedIn ? userMenu : authLinks}
            <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                            {cart.length}
                        </span>
                    )}
                    <span className="sr-only">Cart</span>
                </Button>
            </Link>
             <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                      <Logo />
                    </div>
                    {mobileNavLinks}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
