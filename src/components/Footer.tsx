import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { RESTAURANT_INFO } from '../lib/constants';
import { Phone, MessageCircle, MapPin, Clock, Settings, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
              Jay's Kitchen
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              {RESTAURANT_INFO.tagline}
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Bringing the authentic warmth, slow-cooked spices, and comforting aroma of Nigerian home kitchens to Accra, Ghana.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Kitchen open for delivery & pickup</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-100">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-white transition-colors focus:outline-none"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors focus:outline-none"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/menu')}
                  className="hover:text-white transition-colors focus:outline-none"
                >
                  Full Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/order')}
                  className="hover:text-white transition-colors focus:outline-none"
                >
                  Order / Checkout
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-white transition-colors focus:outline-none"
                >
                  Contact & Hours
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Location */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-100">
              Get in Touch
            </h4>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <a
                  href={`tel:${RESTAURANT_INFO.phoneRaw}`}
                  className="hover:text-white transition-colors tabular-nums"
                >
                  {RESTAURANT_INFO.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: {RESTAURANT_INFO.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0" />
                <span>{RESTAURANT_INFO.location}</span>
              </div>
            </div>
          </div>

          {/* Column 4: Hours & Service */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-100">
              Kitchen Hours
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              {RESTAURANT_INFO.openingHours.map((h, i) => (
                <div key={i} className="flex flex-col border-b border-stone-800/80 pb-2">
                  <span className="text-stone-300 font-medium">{h.days}</span>
                  <span className="text-stone-400">{h.time}</span>
                </div>
              ))}
            </div>
            <div className="pt-1">
              <a
                href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Jay's Kitchen, I have an inquiry about placing an order.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-md shadow-sm transition-colors gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Discreet Admin Entrance */}
        <div className="mt-12 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 Jay's Kitchen. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1 text-stone-400">
              Authentic Taste Made with Care
            </span>
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center space-x-1.5 text-stone-500 hover:text-stone-300 transition-colors focus:outline-none"
              title="Restaurant Owner Management Portal"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
