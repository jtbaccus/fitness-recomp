import SubNav from '@/components/SubNav';

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="max-w-lg mx-auto px-4 pt-4">
        <SubNav tabs={[
          { href: '/track/nutrition', label: 'Nutrition' },
          { href: '/track/checkin', label: 'Check-In' },
          { href: '/track/progress', label: 'Progress' },
        ]} />
      </div>
      {children}
    </>
  );
}
