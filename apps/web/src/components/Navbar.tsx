'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/courses', label: 'Courses' },
  { href: '/challenges', label: '💻 Challenges' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

function navLinkClass(active: boolean) {
  return `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    active ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
  }`;
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-lg font-bold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.png" alt="Kodstigen" className="h-9 w-9 rounded-lg object-cover" />
          <span className="hidden sm:inline">Kodstigen</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={navLinkClass(pathname.startsWith(l.href))}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
