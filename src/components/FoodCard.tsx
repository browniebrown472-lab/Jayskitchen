import React, { useState } from 'react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { Plus, Utensils } from 'lucide-react';

interface FoodCardProps {
  dish: MenuItem;
  onSelect?: (dish: MenuItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ dish, onSelect }) => {
  const { addToCart, quickOrder } = useCart();
  const { navigate } = useNavigation();
  const [imgError, setImgError] = useState(false);

  const handleCardClick = () => {
    if (!dish.available) return;
    if (onSelect) {
      onSelect(dish);
    } else {
      quickOrder(dish);
      navigate('/order');
    }
  };

  const handleAddDirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dish.available) return;
    addToCart(dish, 1);
  };

  const handleOrderDirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dish.available) return;
    quickOrder(dish);
    navigate('/order');
  };

  return (
    <article
      onClick={handleCardClick}
      className={`group relative flex flex-col bg-white rounded-xl overflow-hidden border border-stone-200/90 hover:border-stone-300 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
        !dish.available ? 'opacity-70 grayscale-20' : ''
      }`}
    >
      {/* Food Image Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        {!imgError ? (
          <img
            src={dish.image_url}
            alt={dish.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 text-center">
            <Utensils className="w-8 h-8 mb-2 stroke-1 text-stone-400" />
            <span className="text-xs font-medium text-stone-500">{dish.name}</span>
          </div>
        )}

        {/* Status indicator (Unboxed text with subtle contrast scrim) */}
        {!dish.available && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] flex items-center justify-center p-3">
            <span className="text-white text-xs font-semibold tracking-wider uppercase px-2 py-1 bg-stone-900/90 rounded">
              Currently Unavailable
            </span>
          </div>
        )}

        {dish.featured && dish.available && (
          <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-sm text-stone-100 text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded">
            Featured Special
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        {/* Unboxed Metadata (Zero-pill discipline) */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 font-medium tracking-wide uppercase">
          <span>{dish.category}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>Authentic Recipe</span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug group-hover:text-red-700 transition-colors">
          {dish.name}
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed flex-1">
          {dish.description}
        </p>

        {/* Price & Actions Row */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 block font-normal">Price</span>
            <span className="text-lg font-bold text-stone-950 tabular-nums">
              GH₵{dish.price}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleAddDirect}
              disabled={!dish.available}
              aria-label={`Add ${dish.name} to cart`}
              className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Add to order"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleOrderDirect}
              disabled={!dish.available}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-semibold rounded-lg shadow-xs hover:shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
