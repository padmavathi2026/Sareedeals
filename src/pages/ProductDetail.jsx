import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Share2, CheckCircle, Tag } from 'lucide-react';
import { useDeals } from '../hooks/useDeals';
import { CONFIG } from '../config';

function formatINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function discount(original, offer) {
  return Math.round(((original - offer) / original) * 100);
}

export default function ProductDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { deals, loading } = useDeals({ filterToday: false });

  const deal = useMemo(
    () => deals.find((d) => String(d.id) === String(id)),
    [deals, id]
  );

  // Build image list from available URLs
  const images = useMemo(() => {
    if (!deal) return [];
    const list = [deal.image_url];
    if (deal.photo_url1) list.push(deal.photo_url1);
    return list.filter(Boolean);
  }, [deal]);

  const [activeImg, setActiveImg] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-maroon-600 border-t-transparent
                          rounded-full animate-spin mx-auto" />
          <p className="text-maroon-600 font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center gap-4">
        <p className="font-display text-2xl text-maroon-700">Deal not found</p>
        <button onClick={() => navigate('/')} className="btn-primary rounded-lg px-6 py-2.5 text-sm">
          ← Back to Deals
        </button>
      </div>
    );
  }

  const isSold = deal.status === 'sold';
  const pct    = discount(deal.original_price, deal.offer_price);

  const waText = encodeURIComponent(
    deal.whatsapp_message ||
    `Hi! I'm interested in Deal #${deal.id} – ${deal.fabric} ${deal.name} Saree at ${formatINR(deal.offer_price)}. Is it available?`
  );
  const waLink = `https://wa.me/${CONFIG.WHATSAPP}?text=${waText}`;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: `${deal.fabric} ${deal.name} Saree`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  return (
    <div className="min-h-screen bg-cream-100">

      {/* Top bar */}
      <header className="hero-pattern px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-white/80 hover:text-white
                     text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1 text-center">
          <span className="font-display text-white text-base">{CONFIG.SITE_NAME}</span>
        </div>
        <button onClick={handleShare} className="text-white/80 hover:text-white transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

          {/* ── Left: Image gallery ── */}
          <div className="flex flex-col gap-3">

            {/* Main image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-lg">
              <img
                src={images[activeImg] || `https://placehold.co/400x533/7b1a1a/d4af37?text=Saree+${deal.id}`}
                alt={`${deal.fabric} ${deal.name} #${deal.id}`}
                className={`w-full h-full object-cover transition-all duration-300
                            ${isSold ? 'grayscale' : ''}`}
                onError={(e) => {
                  e.target.src = `https://placehold.co/400x533/7b1a1a/d4af37?text=Saree+${deal.id}`;
                }}
              />

              {/* Discount ribbon */}
              {!isSold && (
                <div className="absolute top-4 left-0 bg-maroon-600 text-white
                                text-sm font-bold px-4 py-1 rounded-r-full shadow-md">
                  {pct}% OFF
                </div>
              )}

              {isSold && (
                <div className="sold-ribbon">
                  <span>SOLD OUT</span>
                </div>
              )}

              {/* Deal number */}
              <span className="absolute top-4 right-4 bg-maroon-900/70 text-gold-400
                               text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                Deal #{deal.id}
              </span>
            </div>

            {/* Thumbnails (shown only if photo_url1 exists) */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all
                                ${activeImg === i
                                  ? 'border-maroon-600 shadow-md'
                                  : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={url} alt={`view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product info ── */}
          <div className="flex flex-col gap-5">

            {/* Fabric tag */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-maroon-100 text-maroon-700
                               text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Tag className="w-3 h-3" />
                {deal.fabric}
              </span>
              {!isSold && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700
                                 text-xs font-bold px-3 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  In Stock
                </span>
              )}
            </div>

            {/* Name */}
            <div>
              <h1 className="font-display text-2xl md:text-3xl text-gray-900 leading-tight">
                {deal.fabric} {deal.name} Saree
              </h1>
              <p className="text-gray-400 text-sm mt-1">Deal #{deal.id} · Today's Crazy Deal</p>
            </div>

            {/* Price block */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-200">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className={`font-display text-3xl font-bold
                                  ${isSold ? 'text-gray-400 line-through' : 'text-maroon-600'}`}>
                  {formatINR(deal.offer_price)}
                </span>
                <span className="text-gray-400 text-lg line-through">
                  {formatINR(deal.original_price)}
                </span>
              </div>

              {!isSold && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-0.5 rounded-full">
                    Save {formatINR(deal.original_price - deal.offer_price)}
                  </span>
                  <span className="bg-maroon-100 text-maroon-700 text-sm font-bold px-3 py-0.5 rounded-full">
                    {pct}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {deal.description && (
              <div>
                <h2 className="font-display text-base text-gray-700 mb-1">About this saree</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{deal.description}</p>
              </div>
            )}

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Detail label="Fabric"    value={deal.fabric} />
              <Detail label="Type"      value={deal.name} />
              <Detail label="MRP"       value={formatINR(deal.original_price)} />
              <Detail label="Offer"     value={formatINR(deal.offer_price)} />
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 mt-2">
              {isSold ? (
                <button disabled
                  className="w-full py-4 rounded-xl bg-gray-200 text-gray-400
                             font-bold text-base cursor-not-allowed">
                  This deal is Sold Out
                </button>
              ) : (
                <>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2
                               bg-green-600 hover:bg-green-700 text-white
                               font-bold text-base py-4 rounded-xl
                               transition-colors shadow-lg active:scale-95"
                  >
                    {/* WhatsApp icon */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.524 5.836L.057 23.506a.5.5 0 00.534.601l5.565-1.452A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-4.988-1.363l-.356-.212-3.697.965.99-3.596-.232-.371A9.794 9.794 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                    </svg>
                    Chat on WhatsApp to Buy
                  </a>

                  <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center gap-2
                               border-2 border-maroon-600 text-maroon-600
                               hover:bg-maroon-600 hover:text-white
                               font-semibold text-sm py-3 rounded-xl transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    See All Deals
                  </button>
                </>
              )}
            </div>

            {/* Trust line */}
            <p className="text-xs text-gray-400 text-center">
              🔒 Secure purchase via WhatsApp · Same-day dispatch
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-cream-200">
      <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">{label}</p>
      <p className="font-semibold text-gray-800 text-sm">{value}</p>
    </div>
  );
}
