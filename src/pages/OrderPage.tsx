import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { RESTAURANT_INFO, INITIAL_MENU_ITEMS } from '../lib/constants';
import { createOrder } from '../services/orderService';
import { getMenuItems } from '../services/menuService';
import { OrderCustomerInfo, DeliveryMethod, MenuItem } from '../types';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  MessageCircle,
  Copy,
  ArrowLeft,
  Truck,
  Store,
  Clock,
  AlertCircle,
} from 'lucide-react';

export const OrderPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, totalAmount, totalItems, addToCart } = useCart();
  const { navigate } = useNavigation();

  // Available dishes to add if basket is empty or customer wants more
  const [availableDishes, setAvailableDishes] = useState<MenuItem[]>([]);

  // Form Fields
  const [formData, setFormData] = useState<OrderCustomerInfo>({
    customer_name: '',
    phone: '',
    whatsapp_number: '',
    delivery_location: RESTAURANT_INFO.serviceAreas[0],
    area: '',
    address_details: '',
    delivery_method: 'Door Delivery',
    special_instructions: '',
    preferred_time: 'As soon as possible',
  });

  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Success state
  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string;
    whatsappUrl: string;
    total: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getMenuItems().then((dishes) => {
      setAvailableDishes(dishes.filter((d) => d.available));
    });
  }, []);

  const handlePhoneChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: val,
      whatsapp_number: sameAsPhone ? val : prev.whatsapp_number,
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (cart.length === 0) {
      setFormError('Please select at least one meal to place an order.');
      return;
    }

    if (!formData.customer_name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!formData.phone.trim()) {
      setFormError('Please provide a valid phone number.');
      return;
    }

    if (!formData.area.trim()) {
      setFormError('Please specify your neighborhood or area (e.g. Near American House).');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalCustomer: OrderCustomerInfo = {
        ...formData,
        whatsapp_number: sameAsPhone ? formData.phone : formData.whatsapp_number,
      };

      const result = await createOrder(finalCustomer, cart);

      setOrderSuccess({
        orderId: result.order.id,
        whatsappUrl: result.whatsappUrl,
        total: result.order.total_amount,
      });

      // Clear cart
      clearCart();

      // Open WhatsApp automatically
      const newTab = window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!newTab) {
        // If popup blocker stopped window.open, orderSuccess UI provides direct click button
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setFormError('An error occurred while creating your order. Please try again or message us directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order is completed successfully, render post-order state
  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">
              Order Registered
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950">
              Your Order is Ready for WhatsApp
            </h1>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              We have pre-formatted your order details. Tap the button below to send your order straight to Jay's Kitchen on WhatsApp to confirm delivery!
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 inline-block text-left text-xs sm:text-sm space-y-1">
            <p className="text-stone-500">
              Order Reference: <span className="font-mono font-bold text-stone-900">{orderSuccess.orderId}</span>
            </p>
            <p className="text-stone-500">
              Estimated Total: <span className="font-bold text-red-600 tabular-nums">GH₵{orderSuccess.total}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={orderSuccess.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Order on WhatsApp ({RESTAURANT_INFO.phoneDisplay})</span>
            </a>

            <button
              onClick={() => {
                navigator.clipboard.writeText(orderSuccess.whatsappUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              }}
              className="w-full sm:w-auto px-5 py-4 border border-stone-300 hover:bg-stone-50 text-stone-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Link Copied!' : 'Copy WhatsApp Link'}</span>
            </button>
          </div>

          <div className="pt-6 border-t border-stone-100 flex justify-center">
            <button
              onClick={() => {
                setOrderSuccess(null);
                navigate('/menu');
              }}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Order More Food</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div className="space-y-2">
        <button
          onClick={() => navigate('/menu')}
          className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Menu</span>
        </button>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950 tracking-tight">
          Complete Your Order
        </h1>
        <p className="text-sm text-stone-600">
          Enter your delivery information below. Your order will be sent to our WhatsApp desk for fast confirmation.
        </p>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Grid: Form on Left, Order Summary on Right */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Customer & Delivery Info */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Customer Information */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="font-serif text-xl font-bold text-stone-900">
                1. Customer Details
              </h2>
              <p className="text-xs text-stone-500">
                Who should we contact when the meal is ready?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="e.g. Samuel Adekunle"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="0201234567"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    WhatsApp Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    disabled={sameAsPhone}
                    value={sameAsPhone ? formData.phone : formData.whatsapp_number}
                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    placeholder="0201234567"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white disabled:opacity-60 tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="same-phone"
                  checked={sameAsPhone}
                  onChange={(e) => {
                    setSameAsPhone(e.target.checked);
                    if (e.target.checked) {
                      setFormData((prev) => ({ ...prev, whatsapp_number: prev.phone }));
                    }
                  }}
                  className="rounded border-stone-300 text-red-600 focus:ring-red-500 h-4 w-4"
                />
                <label htmlFor="same-phone" className="text-xs text-stone-600 select-none">
                  My WhatsApp number is the same as my phone number
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Delivery & Location Details */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="font-serif text-xl font-bold text-stone-900">
                2. Delivery & Location
              </h2>
              <p className="text-xs text-stone-500">
                Where should we deliver your authentic Nigerian meal?
              </p>
            </div>

            {/* Delivery Method Choice */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, delivery_method: 'Door Delivery' })}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  formData.delivery_method === 'Door Delivery'
                    ? 'border-red-600 bg-red-50/50 text-red-950 ring-1 ring-red-600'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/40 text-stone-700'
                }`}
              >
                <Truck className={`w-5 h-5 ${formData.delivery_method === 'Door Delivery' ? 'text-red-600' : 'text-stone-400'}`} />
                <div>
                  <span className="block text-xs font-bold">Door Delivery</span>
                  <span className="text-[11px] text-stone-500">Delivered to your house / office</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, delivery_method: 'Pickup' })}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  formData.delivery_method === 'Pickup'
                    ? 'border-red-600 bg-red-50/50 text-red-950 ring-1 ring-red-600'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/40 text-stone-700'
                }`}
              >
                <Store className={`w-5 h-5 ${formData.delivery_method === 'Pickup' ? 'text-red-600' : 'text-stone-400'}`} />
                <div>
                  <span className="block text-xs font-bold">Pickup</span>
                  <span className="text-[11px] text-stone-500">Collect from Accra location</span>
                </div>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  General Location / Zone <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.delivery_location}
                  onChange={(e) => setFormData({ ...formData, delivery_location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                >
                  {RESTAURANT_INFO.serviceAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Specific Area / Neighborhood <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="e.g. Near American House, Behind Shell Station, Mensah Sarbah Hall"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Additional Address Details (Optional)
                </label>
                <input
                  type="text"
                  value={formData.address_details}
                  onChange={(e) => setFormData({ ...formData, address_details: e.target.value })}
                  placeholder="House number, apartment flat, landmark, or directions"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Preferred Delivery Time
                  </label>
                  <select
                    value={formData.preferred_time}
                    onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                  >
                    <option value="As soon as possible">As soon as possible (Standard)</option>
                    <option value="In 45 minutes">In 45 - 60 minutes</option>
                    <option value="Lunch (12:30 PM - 2:00 PM)">Lunch Time</option>
                    <option value="Dinner (6:30 PM - 8:30 PM)">Dinner Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Special Instructions
                  </label>
                  <input
                    type="text"
                    value={formData.special_instructions}
                    onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                    placeholder="e.g. Mild pepper, extra stew, no crayfish"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Placement */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
            
            <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-900">
                  Your Order
                </h2>
                <span className="text-xs text-stone-500">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in basket
                </span>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="py-6 text-center space-y-3">
                <p className="text-sm text-stone-500">
                  No items selected yet. Choose a popular Nigerian dish to begin:
                </p>
                <div className="space-y-2 max-h-56 overflow-y-auto text-left pr-1">
                  {availableDishes.slice(0, 4).map((d) => (
                    <div
                      key={d.id}
                      className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-semibold text-stone-900 block">{d.name}</span>
                        <span className="text-xs text-stone-500 tabular-nums">GH₵{d.price}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCart(d, 1)}
                        className="px-2.5 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.dish.id}
                    className="flex items-center justify-between gap-3 pb-3 border-b border-stone-100 last:border-none"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-stone-900 truncate">
                        {item.dish.name}
                      </h4>
                      <span className="text-xs text-stone-500 tabular-nums">
                        GH₵{item.dish.price} each
                      </span>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center border border-stone-200 rounded bg-white shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.dish.id, -1)}
                        className="p-1 text-stone-600 hover:text-stone-950"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-800 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.dish.id, 1)}
                        className="p-1 text-stone-600 hover:text-stone-950"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <span className="text-xs font-bold text-stone-950 tabular-nums w-14 text-right">
                      GH₵{item.dish.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Cost Breakdown */}
            <div className="pt-3 border-t border-stone-200 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Food Subtotal</span>
                <span className="font-semibold text-stone-900 tabular-nums">GH₵{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery/Handling</span>
                <span className="text-stone-500">Based on {formData.delivery_location}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-950 pt-2 border-t border-stone-100">
                <span>Estimated Total</span>
                <span className="text-red-600 font-serif text-lg tabular-nums">
                  GH₵{totalAmount}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 text-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span>
                  {isSubmitting ? 'Formatting Order...' : 'Place Order on WhatsApp'}
                </span>
              </button>

              <div className="text-[11px] text-stone-500 text-center leading-relaxed">
                Clicking will register your order and open WhatsApp to send your request directly to Jay's Kitchen desk ({RESTAURANT_INFO.phoneDisplay}).
              </div>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
};
