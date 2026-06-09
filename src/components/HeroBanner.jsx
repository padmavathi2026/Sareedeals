import CountdownTimer from './CountdownTimer';

export default function HeroBanner({ total = 0, active = 0 }) {
  return (
    <section className="hero-pattern py-10 px-4 text-center">

      {/* Decorative top line */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="h-px w-16 bg-gold-500 opacity-60" />
        <span className="text-gold-400 text-sm tracking-[0.3em] uppercase font-medium">
          Limited Time
        </span>
        <div className="h-px w-16 bg-gold-500 opacity-60" />
      </div>

      <h1 className="font-display text-4xl md:text-5xl text-white leading-tight">
        🔥 Crazy Deals
        <span className="block text-gold-400 text-3xl md:text-4xl mt-1">
          of the Day
        </span>
      </h1>

      <p className="mt-3 text-maroon-200 max-w-md mx-auto text-sm md:text-base">
        Handpicked sarees at prices that won't last. Grab before they're gone!
      </p>

      {/* Stats */}
      {total > 0 && (
        <div className="flex justify-center gap-6 mt-5">
          <Stat value={total}           label="Today's Deals" />
          <div className="w-px bg-gold-700 opacity-40" />
          <Stat value={active}          label="Still Available" color="text-green-400" />
          <div className="w-px bg-gold-700 opacity-40" />
          <Stat value={total - active}  label="Sold Out"  color="text-red-400" />
        </div>
      )}

      <CountdownTimer />
    </section>
  );
}

function Stat({ value, label, color = 'text-white' }) {
  return (
    <div className="text-center">
      <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-gold-400 text-xs mt-0.5 uppercase tracking-wider">{label}</p>
    </div>
  );
}
