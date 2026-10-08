import React, { useEffect, useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { MenuItem } from '../types';
import { getMenuItems } from '../services/menuService';
import { FoodCard } from '../components/FoodCard';
import { RESTAURANT_INFO } from '../lib/constants';
import { ArrowRight, Sparkles, Clock, Flame, HeartHandshake, ShieldCheck, MessageCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useNavigation();
  const [featuredDishes, setFeaturedDishes] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadDishes() {
      try {
        const dishes = await getMenuItems();
        if (mounted) {
          const featured = dishes.filter((d) => d.featured && d.available).slice(0, 6);
          setFeaturedDishes(featured.length > 0 ? featured : dishes.slice(0, 6));
          setLoading(false);
        }
      } catch (e) {
        console.error('Failed to load menu dishes:', e);
        if (mounted) setLoading(false);
      }
    }
    loadDishes();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      
      {/* 1. Hero Section - Asymmetric High-End Restaurant Layout */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 bg-gradient-to-b from-stone-100/70 via-stone-50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              {/* Unboxed Brand Kicker (Anti-slop, zero pills) */}
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-800">
                <span>Accra, Ghana</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>Authentic Nigerian Cuisine</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>Home Cooked Taste</span>
              </div>

              {/* Primary Headline with Balance */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-950 tracking-tight leading-[1.12] text-balance">
                Authentic Nigerian Taste, <span className="italic font-normal text-red-700">Right Here in Ghana.</span>
              </h1>

              {/* Supporting Subhead */}
              <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
                Enjoy delicious Nigerian meals prepared with the rich flavors, spices, and traditions you love. From smoky party Jollof to hearty Egusi soup and spicy peppered meats.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/menu')}
                  className="px-7 py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                >
                  <span>Explore Our Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/order')}
                  className="px-7 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                >
                  <span>Order Now</span>
                </button>

                <a
                  href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Jay's Kitchen, I would like to place an order.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 border border-stone-300 hover:border-emerald-600 hover:text-emerald-700 text-stone-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp: {RESTAURANT_INFO.phoneDisplay}</span>
                </a>
              </div>

              {/* Value Markers */}
              <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-stone-700">
                <div>
                  <span className="block font-serif text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">100%</span>
                  <span className="text-xs text-stone-500">Authentic Recipes</span>
                </div>
                <div>
                  <span className="block font-serif text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">Fresh</span>
                  <span className="text-xs text-stone-500">Cooked to Order</span>
                </div>
                <div>
                  <span className="block font-serif text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">Accra</span>
                  <span className="text-xs text-stone-500">City-Wide Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100 aspect-4/3 sm:aspect-16/10 lg:aspect-4/3">
                <img
                  src="/src/assets/images/hero_nigerian_feast_1791373699915.jpg"
                  alt="Authentic Nigerian Jollof Rice Feast with fried plantains and peppered chicken"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-semibold tracking-wider uppercase text-emerald-300">Jay's Signature</span>
                  <p className="font-serif text-lg font-bold">Party Smoky Jollof & Grilled Suya</p>
                  <p className="text-xs text-stone-200">Served with caramelized dodo & pepper sauce</p>
                </div>
              </div>

              {/* Floating accent badge */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-white p-3.5 rounded-xl shadow-lg border border-stone-200 items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-900 block">Smoky Firewood Flavor</span>
                  <span className="text-[11px] text-stone-500">Traditional Lagos recipe</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Popular Nigerian Dishes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-600 mb-2">
              <span>Customer Favorites</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>Top Rated</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950 tracking-tight">
              Popular Nigerian Dishes
            </h2>
            <p className="mt-2 text-sm text-stone-600 max-w-xl">
              Cooked with pure Nigerian spice blends and slow-simmered sauces. Prepared fresh daily for your ultimate satisfaction.
            </p>
          </div>

          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center text-sm font-semibold text-stone-900 hover:text-red-600 transition-colors gap-1.5 focus:outline-none"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Food Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-stone-200/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredDishes.map((dish) => (
              <FoodCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/menu')}
            className="px-8 py-3.5 border-2 border-stone-900 hover:bg-stone-900 hover:text-white text-stone-900 font-semibold rounded-lg transition-all text-sm shadow-xs"
          >
            Explore Complete Menu ({RESTAURANT_INFO.serviceAreas.length} Delivery Zones)
          </button>
        </div>
      </section>

      {/* 3. Why Nigerians Love Jay's Kitchen */}
      <section className="bg-stone-900 text-stone-100 py-16 sm:py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
              The Jay's Kitchen Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Why Nigerians Love Jay's Kitchen
            </h2>
            <p className="text-sm text-stone-400">
              We understand what authentic Nigerian food tastes like. No compromises, no diluted spices, just pure home cooking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-950/70 text-red-400 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Authentic Taste</h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Traditional Nigerian flavors prepared with carefully sourced scotch bonnets, locust beans (iru), and slow-fried party bases.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/70 text-emerald-400 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Freshly Prepared</h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Every meal is prepared with fresh local market ingredients and quality cuts of beef, goat meat, fish, and chicken.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-950/70 text-amber-400 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Made for Nigerians in Ghana</h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Specially designed for students, professionals, and families craving the nostalgic taste of home right here in Accra.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-950/70 text-blue-400 flex items-center justify-center font-bold">
                04
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Easy Ordering</h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Fast, friction-free ordering directly through WhatsApp. Get your order confirmed and delivered without hassles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Strong Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-red-50 via-stone-50 to-emerald-50 border border-red-200/70 rounded-2xl p-8 sm:p-14 shadow-sm space-y-6">
          <span className="text-xs uppercase tracking-widest text-red-600 font-bold">
            Hungry Right Now?
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-950 tracking-tight max-w-xl mx-auto">
            Craving Nigerian Food?
          </h2>
          <p className="text-stone-600 max-w-lg mx-auto text-sm sm:text-base">
            Your favorite Nigerian flavors are just an order away. Select your meal, tell us where you are in Accra, and we will get it simmering.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/order')}
              className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all text-sm"
            >
              Order Now
            </button>
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Jay's Kitchen, I would like to place an order.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order via WhatsApp ({RESTAURANT_INFO.phoneDisplay})</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
