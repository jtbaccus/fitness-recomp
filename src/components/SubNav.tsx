'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SubNavProps {
  tabs: { href: string; label: string }[];
}

export default function SubNav({ tabs }: SubNavProps) {
  const pathname = usePathname();
  return (
    <div className="flex bg-card rounded-xl p-1 mb-4">
      {tabs.map(tab => {
        const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 text-center py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-elevated text-white' : 'text-text-muted'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
