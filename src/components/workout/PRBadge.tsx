'use client';

export default function PRBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/20 text-success text-xs font-bold rounded-full animate-pulse">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      PR!
    </span>
  );
}
