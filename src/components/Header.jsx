import { ShoppingBag, MapPin } from 'lucide-react';
import { CONFIG } from '../config';

export default function Header() {
  const waLink = `https://wa.me/919014193407?text=${encodeURIComponent('Hi! I want to know more about today\'s deals.')}`;

  return (
    <header className="sticky top-0 z-50 hero-pattern shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">

        {/* Logo + name */}
        <div className="flex items-center gap-2 min-w-0">
          <ShoppingBag className="text-gold-400 w-7 h-7 shrink-0" />
          <div className="min-w-0">
            <p className="font-display text-white text-base md:text-lg leading-tight truncate">
              {CONFIG.SITE_NAME}
            </p>
            <div className="flex items-center gap-1">
              <a
                href={CONFIG.MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-0.5 text-gold-400 hover:text-gold-300
                           text-xs transition-colors"
                title="View on Google Maps"
              >
                <MapPin className="w-3 h-3 shrink-0" />
                <span>{CONFIG.SITE_LOCATION}</span>
              </a>
              <span className="text-gold-600 text-xs hidden sm:inline">· Crazy Deals</span>
            </div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700
                     text-white text-sm font-semibold px-4 py-2 rounded-full
                     transition-colors shadow shrink-0"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.524 5.836L.057 23.506a.5.5 0 00.534.601l5.565-1.452A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-4.988-1.363l-.356-.212-3.697.965.99-3.596-.232-.371A9.794 9.794 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
          </svg>
          WhatsApp
        </a>

      </div>
    </header>
  );
}
