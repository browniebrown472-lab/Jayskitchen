import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { RESTAURANT_INFO } from '../lib/constants';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalAmount,
    totalItems,
  } = useCart();
  const { navigate } = useNavigation();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/order');
  };

  const handleBrowseMenu = () => {
    setIsCartOpen(false);
    navigate('/menu');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="cart-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h2 id="cart-title" className="font-serif text-lg font-bold text-stone-900">
                Your Meal Basket
              </h2>
              {totalItems > 0 && (
                <span className="text-xs text-stone-500 font-medium tabular-nums">
                  ({totalItems} {totalItems === 1 ? 'dish' : 'dishes'})
                </span>
              )}
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                  Your basket is empty
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-xs mb-6">
                  Craving smoky Nigerian Jollof, hearty Egusi soup, or grilled suya? Explore our menu and pick your favorite.
                </p>
                <button
                  onClick={handleBrowseMenu}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 text-xs text-stone-500">
                  <span>Selected Dishes</span>
                  <button
                    onClick={clearCart}
                    className="hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear all
                  </button>
                </div>

                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.dish.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-stone-200/80 bg-stone-50/40 hover:bg-white transition-colors"
                    >
                      {/* Thumbnail */}
                      <img
                        src={item.dish.image_url}
                        alt={item.dish.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-md object-cover bg-stone-200 shrink-0"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-stone-900 truncate">
                          {item.dish.name}
                        </h4>
                        <div className="text-xs text-stone-500 tabular-nums">
                          GH₵{item.dish.price} each
                        </div>
                        <div className="text-xs font-bold text-stone-900 mt-1 tabular-nums">
                          GH₵{item.dish.price * item.quantity}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-300 rounded-md bg-white shrink-0">
                        <button
                          onClick={() => updateQuantity(item.dish.id, -1)}
                          className="p-1 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-l transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-stone-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.dish.id, 1)}
                          className="p-1 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-r transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.dish.id)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors shrink-0"
                        title="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50/80 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-stone-600 text-xs">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-stone-900">
                    GH₵{totalAmount}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 text-xs">
                  <span>Delivery fee</span>
                  <span className="text-stone-500">Calculated by delivery area</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="tabular-nums text-red-600 font-serif text-lg">
                    GH₵{totalAmount}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <span>Proceed to Delivery Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-center text-stone-500">
                  Orders are finalized and confirmed instantly on WhatsApp ({RESTAURANT_INFO.phoneDisplay})
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
