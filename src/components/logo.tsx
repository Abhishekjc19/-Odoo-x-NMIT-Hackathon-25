import Link from 'next/link';
import { cn } from '@/lib/utils';

const EcoSwapLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        {...props}
    >
        <path fill="#4F46E5" d="M224 56v144a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16V56a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16" />
        <path fill="#C7D2FE" d="M96 216V40h64v176z" />
        <path fill="#4F46E5" d="M160 40h-8v176h8a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16" />
        <path fill="#A5B4FC" d="M128 40h-4v176h4z" />
        <path fill="none" stroke="#A5B4FC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" d="M160 88a32 32 0 0 1-64 0" />
    </svg>
);


export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-xl font-semibold font-headline text-foreground", className)}>
      <EcoSwapLogoIcon className="h-7 w-7" />
      <span>EcoSwap</span>
    </Link>
  );
}
