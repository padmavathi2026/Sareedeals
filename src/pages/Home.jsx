import { useMemo } from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import DealGrid from '../components/DealGrid';
import Footer from '../components/Footer';
import { useDeals } from '../hooks/useDeals';

export default function Home() {
  const { deals, loading, usingFallback } = useDeals();

  const active = useMemo(
    () => deals.filter((d) => d.status === 'active').length,
    [deals]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {usingFallback && !loading && (
        <div className="bg-amber-50 border-b border-amber-300 px-4 py-2 text-center text-xs text-amber-800">
          ⚠️ Could not load <strong>deals_data.xlsx</strong> — showing sample data.
          Make sure the file is in the <code className="bg-amber-100 px-1 rounded">public/</code> folder.
        </div>
      )}

      <HeroBanner total={deals.length} active={active} />

      <div className="divider-ornate px-6 max-w-6xl w-full mx-auto">
        <span className="text-gold-600 text-sm font-display tracking-widest">
          ✦ Today's Collection ✦
        </span>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pb-12">
        <DealGrid deals={deals} loading={loading} />
      </main>

      <Footer />
    </div>
  );
}
