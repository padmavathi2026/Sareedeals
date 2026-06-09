import DealCard from './DealCard';
import LoadingGrid from './LoadingGrid';

export default function DealGrid({ deals, loading }) {
  if (loading) return <LoadingGrid />;

  if (!deals.length) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-3xl text-maroon-600">No deals today</p>
        <p className="text-gray-500 mt-2 text-sm">
          Check back tomorrow for fresh crazy deals!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
}
