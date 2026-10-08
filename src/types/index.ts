export type FoodCategory =
  | 'Rice'
  | 'Soups'
  | 'Swallows'
  | 'Proteins'
  | 'Snacks'
  | 'Sides'
  | 'Drinks';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in GHS
  category: FoodCategory | string;
  image_url: string;
  available: boolean;
  featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  created_at?: string;
}

export type DeliveryMethod = 'Door Delivery' | 'Pickup';

export interface CartItem {
  dish: MenuItem;
  quantity: number;
}

export interface OrderCustomerInfo {
  customer_name: string;
  phone: string;
  whatsapp_number: string;
  delivery_location: string;
  area: string;
  address_details: string;
  delivery_method: DeliveryMethod;
  special_instructions: string;
  preferred_time?: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Completed' | 'Cancelled';

export interface OrderRecord extends OrderCustomerInfo {
  id: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  items: {
    menu_item_id: string;
    dish_name: string;
    quantity: number;
    price: number;
  }[];
}
