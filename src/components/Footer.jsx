import { Heart, Phone, MapPin } from 'lucide-react';
import { CONFIG } from '../config';

export default function Footer() {
  const waLink = `https://wa.me/919014193407?text=${encodeURIComponent('Hi! I need help with a saree.')}`;

  return (
    <footer className="hero-pattern mt-16 py-10 px-4 text-center text-maroon-200">

      <div className="flex items-center justify-center gap-2 mb-1">
        <div className="h-px w-12 bg-gold-500 opacity-40" />
        <span className="text-gold-400 text-sm font-display tracking-widest">
          {CONFIG.SITE_NAME}
        </span>
        <div className="h-px w-12 bg-gold-500 opacity-40" />
      </div>

      <a
        href={CONFIG.MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-gold-500 hover:text-gold-300
                   text-xs mb-4 transition-colors"
      >
        <MapPin className="w-3 h-3" />
        {CONFIG.SITE_LOCATION} — View on Google Maps
      </a>

      <p className="text-sm mb-4">
        Fresh deals every day. Don't miss out!
      </p>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700
                   text-white font-semibold px-6 py-2.5 rounded-full transition-colors"
      >
        <Phone className="w-4 h-4" />
        Chat with us on WhatsApp
      </a>

      <p className="mt-6 text-xs text-maroon-400 flex items-center justify-center gap-1">
        Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for saree lovers
      </p>
    </footer>
  );
}
