import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem, Category } from '../types';
import { getMenuItems, getCategories } from '../services/menuService';
import { FoodCard } from '../components/FoodCard';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { Search, SlidersHorizontal, Utensils, RefreshCw, X } from 'lucide-react';

export const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { quickOrder } = useCart();
  const { navigate } = useNavigation();

  useEffect(() => {
    let active = true;
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [items, cats] = await Promise.all([
          getMenuItems(),
          getCategories(),
        ]);
        if (active) {
          setMenuItems(items);
          setCategories(cats);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load menu data:', err);
        if (active) {
          setError('Unable to load the menu right now. Please try again.');
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, []);

  // Filtered Items
  const filteredDishes = useMemo(() => {
    return menuItems.filter((dish) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        dish.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const handleSelectDish = (dish: MenuItem) => {
    quickOrder(dish);
    navigate('/order');
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* 1. Header Banner */}
      <section className="bg-stone-100/80 border-b border-stone-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-600">
              <span>Jay's Kitchen Full Menu</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>Ghana Cedi (GH₵)</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-950 tracking-tight">
              Our Authentic Nigerian Menu
            </h1>
            <p className="text-sm sm:text-base text-stone-600">
              Freshly prepared with authentic ingredients. Filter by your favorite category or search for specific Nigerian delicacies.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Controls: Search Bar & Functional Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a meal (e.g. Jollof, Egusi, Suya)..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-stone-300 rounded-lg text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="text-xs text-stone-500 font-medium self-end md:self-center tabular-nums">
            Showing {filteredDishes.length} {filteredDishes.length === 1 ? 'dish' : 'dishes'}
          </div>
        </div>

        {/* Category Filter Tabs (Functional segmented controls with clean active state) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            All Dishes
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Dishes Grid / States */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-72 bg-stone-200/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-50 border border-red-200 rounded-xl max-w-lg mx-auto space-y-4">
            <p className="text-red-700 font-medium text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="p-12 text-center bg-white border border-stone-200 rounded-xl max-w-md mx-auto space-y-4">
            <Utensils className="w-10 h-10 text-stone-400 stroke-1 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-stone-900">
              No dishes found
            </h3>
            <p className="text-xs sm:text-sm text-stone-500">
              {searchQuery
                ? `No meals matched "${searchQuery}". Try searching for Jollof, Egusi, or Swallows.`
                : 'There are currently no items in this category.'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDishes.map((dish) => (
              <FoodCard key={dish.id} dish={dish} onSelect={handleSelectDish} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
