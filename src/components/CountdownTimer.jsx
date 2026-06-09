import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

function getSecondsUntilMidnight() {
  const now  = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight - now) / 1000);
}

function fmt(n) {
  return String(n).padStart(2, '0');
}

export default function CountdownTimer() {
  const [secs, setSecs] = useState(getSecondsUntilMidnight);

  useEffect(() => {
    const id = setInterval(() => {
      setSecs(getSecondsUntilMidnight());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;

  return (
    <div className="flex items-center justify-center gap-3 mt-4">
      <Clock className="text-gold-400 w-5 h-5 shrink-0" />
      <span className="text-gold-200 text-sm font-medium">Deals end in</span>
      <div className="flex gap-1 items-center">
        {[['Hours', h], ['Mins', m], ['Secs', s]].map(([label, val], i) => (
          <div key={label} className="flex items-center gap-1">
            {i > 0 && <span className="text-gold-400 font-bold text-lg">:</span>}
            <div className="text-center">
              <div className="bg-maroon-800 border border-gold-700 rounded px-2 py-0.5
                              font-display text-white text-xl font-bold min-w-[2.5rem]
                              tabular-nums">
                {fmt(val)}
              </div>
              <div className="text-gold-500 text-[10px] mt-0.5 uppercase tracking-wider">
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
