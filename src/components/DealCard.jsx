import { ShoppingCart } from 'lucide-react';
import { CONFIG } from '../config';

function discount(original, offer) {
  return Math.round(((original - offer) / original) * 100);
}

function formatINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

export default function DealCard({ deal, index }) {
  const { name, fabric, image_url, original_price, offer_price,
          status, whatsapp_message, id } = deal;

  const isSold = status === 'sold';
  const pct    = discount(original_price, offer_price);

  const waText = encodeURIComponent(
    whatsapp_message ||
    `Hi! I want to grab Deal #${id} – ${fabric} ${name} at ${formatINR(offer_price)}.`
  );
  const waLink = `https://wa.me/${CONFIG.WHATSAPP}?text=${waText}`;

  return (
    <div className={`card flex flex-col ${isSold ? 'opacity-70' : ''}`}>

      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-200">
        <img
          src={image_url}
          alt={`${fabric} ${name} #${id}`}
          className={`w-full h-full object-cover transition-transform duration-500
                      ${isSold ? 'grayscale' : 'hover:scale-105'}`}
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x533/7b1a1a/d4af37?text=Saree+${id}`;
          }}
        />

        {/* Deal number badge */}
        <span className="absolute top-2 right-2 bg-maroon-800/80 text-gold-400
                         text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
          #{id}
        </span>

        {/* Discount badge */}
        {!isSold && (
          <span className="absolute top-2 left-2 bg-maroon-600 text-white
                           text-xs font-bold px-2 py-1 rounded-full shadow">
            {pct}% OFF
          </span>
        )}

        {/* Sold-out overlay */}
        {isSold && (
          <div className="sold-ribbon">
            <span>SOLD OUT</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1">

        {/* Fabric tag */}
        <span className="text-xs text-maroon-600 font-semibold uppercase tracking-wider">
          {fabric}
        </span>

        <h3 className="font-display text-gray-900 text-base leading-snug">
          {name} Saree
        </h3>

        {/* Pricing */}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={`font-bold text-xl ${isSold ? 'text-gray-400 line-through' : 'text-maroon-600'}`}>
              {formatINR(offer_price)}
            </span>
            <span className="text-gray-400 text-sm line-through">
              {formatINR(original_price)}
            </span>
          </div>
          {!isSold && (
            <p className="text-green-700 text-xs font-semibold mt-0.5">
              Save {formatINR(original_price - offer_price)}
            </p>
          )}
        </div>

        {/* CTA */}
        {isSold ? (
          <button disabled
            className="w-full mt-2 py-2 rounded-lg bg-gray-200 text-gray-400
                       font-semibold text-sm cursor-not-allowed">
            Sold Out
          </button>
        ) : (
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="w-full mt-2 flex items-center justify-center gap-2
                       btn-gold text-sm rounded-lg py-2.5">
            <ShoppingCart className="w-4 h-4" />
            Grab It!
          </a>
        )}
      </div>
    </div>
  );
}
