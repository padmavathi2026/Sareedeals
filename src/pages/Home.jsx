import { useMemo } from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import DealGrid from '../components/DealGrid';
import Footer from '../components/Footer';
import { useDeals } from '../hooks/useDeals';

export default function Home() {
  const { deals, loading, error } = useDeals({ filterToday: true });

  const active = useMemo(
    () => deals.filter((d) => d.status === 'active').length,
    [deals]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <HeroBanner total={deals.length} active={active} />

      {/* Ornate section divider */}
      <div className="divider-ornate px-6 max-w-6xl w-full mx-auto">
        <span className="text-gold-600 text-sm font-display tracking-widest">
          ✦ Today's Collection ✦
        </span>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pb-12">
        {error && !deals.length && (
          <p className="text-center text-red-500 py-8 text-sm">{error}</p>
        )}
        <DealGrid deals={deals} loading={loading} />
      </main>

      <Footer />
    </div>
  );
}
