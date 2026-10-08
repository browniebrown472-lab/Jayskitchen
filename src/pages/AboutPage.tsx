import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { RESTAURANT_INFO } from '../lib/constants';
import { Sparkles, Heart, UtensilsCrossed, PackageCheck, Smile, Clock } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useNavigation();

  const reasons = [
    {
      title: 'Authentic Nigerian Flavors',
      description: 'We use genuine Nigerian spices, crayfish, authentic palm oil, and slow-braised methods to ensure every spoonful tastes just like home.',
      icon: UtensilsCrossed,
    },
    {
      title: 'Fresh Ingredients',
      description: 'Fresh vegetables, quality cuts of meat, and locally sourced market produce delivered and prepared daily in our clean kitchen.',
      icon: Sparkles,
    },
    {
      title: 'Generous Portions',
      description: 'Nigerian hospitality means hearty servings. We pack our takeout containers with real satisfaction so you are never left hungry.',
      icon: Heart,
    },
    {
      title: 'Made With Care',
      description: 'Each pot of soup and jollof rice is seasoned with patience and pride. We treat every order as though it were cooked for our own family.',
      icon: Smile,
    },
    {
      title: 'Convenient Ordering',
      description: 'Browse the menu online, choose your preferred delivery or pickup zone in Accra, and complete your order straight through WhatsApp.',
      icon: PackageCheck,
    },
    {
      title: 'Friendly Service',
      description: 'From the moment you ping us on WhatsApp to when your warm food arrives at your door, we offer warm, attentive communication.',
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. Header Hero */}
      <section className="bg-stone-100/70 border-b border-stone-200 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-800">
            <span>Our Roots</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Ghana & Nigeria Connected</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-950 tracking-tight text-balance">
            The Story Behind Jay's Kitchen
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {RESTAURANT_INFO.tagline}
          </p>
        </div>
      </section>

      {/* 2. Our Story & Kitchen Visual */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-600">
              <span>Our Story</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950 tracking-tight">
              Bringing the Warmth of Home Cooking to Ghana
            </h2>
            <div className="space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed">
              <p>
                Jay’s Kitchen was created out of a simple, heartfelt passion: to bring the authentic taste and comforting aroma of Nigerian home cooking to Nigerians and African food lovers living in Ghana.
              </p>
              <p>
                Living away from Nigeria—whether as a university student at Legon, a busy corporate professional in Cantonments, or a family settling in Accra—often means longing for that genuine party Jollof flavor or a steaming bowl of Egusi soup prepared the exact way you grew up eating it.
              </p>
              <p>
                At Jay’s Kitchen, we cook each dish with traditional methods. There are no shortcuts: our soups are simmered with ground melon seeds, dry fish, scent leaves, and tender meats; our rice carries that unforgettable smoky depth; and our peppered proteins deliver that signature kick.
              </p>
            </div>

            {/* Mission Statement Callout */}
            <div className="p-6 bg-red-50/70 border-l-4 border-red-600 rounded-r-xl">
              <span className="text-xs uppercase font-bold tracking-wider text-red-800 block mb-1">
                Our Mission
              </span>
              <p className="font-serif text-lg font-semibold text-stone-900 italic">
                “To serve delicious, authentic Nigerian meals that remind our customers of home.”
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-stone-100 aspect-4/3">
              <img
                src="/src/assets/images/about_kitchen_cooking_1791373753389.jpg"
                alt="Chef seasoning fresh authentic Nigerian stew in cast iron pot at Jay's Kitchen"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Cooked Fresh Daily
                </span>
                <p className="font-serif text-lg font-bold">Traditional Pots, Modern Care</p>
                <p className="text-xs text-stone-300">
                  Prepared in Accra with authentic Nigerian ingredients
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Why Choose Jay's Kitchen */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">
            Quality & Experience
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950 tracking-tight">
            Why Choose Jay's Kitchen?
          </h2>
          <p className="text-sm text-stone-600">
            We are dedicated to giving you an exceptional Nigerian dining experience delivered directly to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-6 bg-white rounded-xl border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="w-12 h-12 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 stroke-1 text-red-600" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed flex-1">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Bottom Action */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 bg-stone-900 text-white rounded-2xl space-y-5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Ready to taste the difference?
          </h2>
          <p className="text-stone-300 text-sm max-w-md mx-auto">
            Explore our curated menu of classic Nigerian dishes, swallows, and drinks.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => navigate('/menu')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              Browse Menu
            </button>
            <button
              onClick={() => navigate('/order')}
              className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              Order Directly
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
