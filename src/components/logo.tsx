import Link from 'next/link';
import { cn } from '@/lib/utils';

const EcoSwapLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7.5 19.5h9a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-9a3 3 0 0 0-3 3v7.5a3 3 0 0 0 3 3Z" fill="#166534" />
      <path d="M14.5 9a2.5 2.5 0 0 0-5 0" stroke="#166534" fill="none" />
      <path
        d="M12.2 11.5c-2 .5-3.5 2.5-3.5 4.5 0 1.5.5 2.5 1.5 3.5"
        stroke="#4ade80"
        strokeWidth="1.5"
      />
      <path d="M14.5 18.5a5 5 0 0 0-4-7.5" stroke="#4ade80" strokeWidth="1.5" />
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
