import { CartItem, OrderCustomerInfo, OrderRecord, OrderStatus } from '../types';
import { RESTAURANT_INFO } from '../lib/constants';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_ORDERS_KEY = 'jays_kitchen_orders_v1';

export function getLocalOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading orders from localStorage:', e);
  }
  return [];
}

export function saveLocalOrders(orders: OrderRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed saving orders to localStorage:', e);
  }
}

/**
 * Creates order record in Supabase / LocalStorage and returns the order and WhatsApp direct URL
 */
export async function createOrder(
  customer: OrderCustomerInfo,
  cartItems: CartItem[]
): Promise<{ order: OrderRecord; whatsappUrl: string }> {
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0
  );

  const orderId = `JK-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

  const orderRecord: OrderRecord = {
    ...customer,
    id: orderId,
    total_amount: totalAmount,
    status: 'Pending',
    created_at: new Date().toISOString(),
    items: cartItems.map((ci) => ({
      menu_item_id: ci.dish.id,
      dish_name: ci.dish.name,
      quantity: ci.quantity,
      price: ci.dish.price,
    })),
  };

  // Attempt Supabase insert
  const supabase = getSupabaseClient();
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert({
          customer_name: customer.customer_name,
          phone: customer.phone,
          whatsapp_number: customer.whatsapp_number,
          delivery_location: customer.delivery_location,
          area: customer.area,
          address_details: customer.address_details,
          delivery_method: customer.delivery_method,
          special_instructions: customer.special_instructions,
          preferred_time: customer.preferred_time || '',
          total_amount: totalAmount,
          status: 'Pending',
        })
        .select()
        .single();

      if (!orderErr && orderData?.id) {
        // Insert order items
        const itemsPayload = cartItems.map((ci) => ({
          order_id: orderData.id,
          menu_item_id: ci.dish.id,
          dish_name: ci.dish.name,
          quantity: ci.quantity,
          price: ci.dish.price,
        }));
        await supabase.from('order_items').insert(itemsPayload);
      }
    } catch (err) {
      console.warn('Supabase order creation exception:', err);
    }
  }

  // Update local storage
  const existingOrders = getLocalOrders();
  saveLocalOrders([orderRecord, ...existingOrders]);

  // Construct readable WhatsApp message conforming to user specifications
  const itemsText = cartItems
    .map((item) => `• ${item.dish.name} x ${item.quantity} (GH₵${item.dish.price * item.quantity})`)
    .join('\n');

  const message = `Hello Jay's Kitchen, I would like to place an order.

Order ID: ${orderId}

Name: ${customer.customer_name}
Phone: ${customer.phone}
WhatsApp: ${customer.whatsapp_number}
Delivery Location: ${customer.delivery_location}
Area/Neighborhood: ${customer.area}
${customer.address_details ? `Address Details: ${customer.address_details}` : ''}

Order:
${itemsText}

${customer.special_instructions ? `Special Instructions:\n${customer.special_instructions}\n` : ''}
Delivery/Pickup:
${customer.delivery_method}${customer.preferred_time ? ` (${customer.preferred_time})` : ''}

Estimated Total:
GH₵${totalAmount}`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodedMessage}`;

  return { order: orderRecord, whatsappUrl };
}

export async function fetchAllOrders(): Promise<OrderRecord[]> {
  const supabase = getSupabaseClient();
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((o: any) => ({
          id: o.id,
          customer_name: o.customer_name,
          phone: o.phone,
          whatsapp_number: o.whatsapp_number,
          delivery_location: o.delivery_location,
          area: o.area,
          address_details: o.address_details || '',
          delivery_method: o.delivery_method,
          special_instructions: o.special_instructions || '',
          preferred_time: o.preferred_time || '',
          total_amount: Number(o.total_amount),
          status: o.status,
          created_at: o.created_at,
          items: (o.order_items || []).map((oi: any) => ({
            menu_item_id: oi.menu_item_id,
            dish_name: oi.dish_name,
            quantity: oi.quantity,
            price: Number(oi.price),
          })),
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch orders error:', err);
    }
  }

  return getLocalOrders();
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('orders').update({ status }).eq('id', orderId);
    } catch (err) {
      console.warn('Supabase update order status error:', err);
    }
  }

  const orders = getLocalOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx >= 0) {
    orders[idx].status = status;
    saveLocalOrders(orders);
    return true;
  }
  return false;
}
