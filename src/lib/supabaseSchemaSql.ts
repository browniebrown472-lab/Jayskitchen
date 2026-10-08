export const FULL_SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- Jay's Kitchen - Production Supabase Database Schema & Storage Setup
-- Authentic Nigerian Restaurant Operating in Ghana
-- ==============================================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL, -- Stored in Ghanaian Cedi (GHS)
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    available BOOLEAN DEFAULT TRUE NOT NULL,
    featured BOOLEAN DEFAULT FALSE NOT NULL,
    display_order INTEGER DEFAULT 10 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    area TEXT NOT NULL,
    address_details TEXT,
    delivery_method TEXT NOT NULL, -- 'Door Delivery' | 'Pickup'
    special_instructions TEXT,
    preferred_time TEXT,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'Pending' NOT NULL, -- 'Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled'
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id TEXT,
    dish_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON public.menu_items(available);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON public.menu_items(featured);
CREATE INDEX IF NOT EXISTS idx_menu_items_display_order ON public.menu_items(display_order);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 7. Public Read & Customer Order Policies
CREATE POLICY "Public can view categories"
    ON public.categories FOR SELECT
    USING (true);

CREATE POLICY "Public can view available menu items"
    ON public.menu_items FOR SELECT
    USING (true);

CREATE POLICY "Public can insert orders"
    ON public.orders FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public can insert order items"
    ON public.order_items FOR INSERT
    WITH CHECK (true);

-- 8. Authenticated Admin Policies (Full Control)
CREATE POLICY "Admins have full access to categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins have full access to menu_items"
    ON public.menu_items FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 9. Storage Setup for Food Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view food images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'menu-images');

CREATE POLICY "Authenticated users can upload food images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'menu-images');

-- 10. Seed Initial Categories
INSERT INTO public.categories (id, name, description, display_order)
VALUES
    ('rice', 'Rice', 'Authentic smoky jollof, fried rice & ofada dishes', 1),
    ('soups', 'Soups', 'Rich traditional Nigerian soups with assorted meat', 2),
    ('swallows', 'Swallows', 'Pounded yam, eba & smooth swallows', 3),
    ('proteins', 'Proteins', 'Peppered chicken, beef suya, fish & goat meat', 4),
    ('snacks', 'Snacks', 'Steamed moi moi, meat pies & quick bites', 5),
    ('sides', 'Sides', 'Fried plantain (dodo), extra stew & sides', 6),
    ('drinks', 'Drinks', 'Natural spiced zobo, malt & chilled refreshments', 7)
ON CONFLICT (id) DO NOTHING;

-- 11. Seed Initial Menu Items
INSERT INTO public.menu_items (id, name, description, price, category, image_url, available, featured, display_order)
VALUES
    ('jollof-rice', 'Jollof Rice', 'Rich, smoky Nigerian-style jollof rice cooked with carefully selected aromatic peppers, bay leaves, and spices. Served with sweet fried plantains (dodo) and your choice of protein.', 45.00, 'Rice', '/src/assets/images/hero_nigerian_feast_1791373699915.jpg', true, true, 1),
    ('fried-rice', 'Nigerian Fried Rice', 'Flavorful Nigerian-style party fried rice packed with finely diced vegetables, sweet corn, green peas, seasoning, and delicious tender protein.', 50.00, 'Rice', '/src/assets/images/dish_fried_rice_1791373723960.jpg', true, true, 2),
    ('egusi-soup', 'Egusi Soup & Pounded Yam', 'Classic Nigerian egusi soup prepared with slow-toasted ground melon seeds, pumpkin leaves, crayfish, and assorted meats. Served with smooth pounded yam.', 55.00, 'Soups', '/src/assets/images/dish_egusi_soup_1791373712431.jpg', true, true, 3),
    ('pepper-soup', 'Aromatic Pepper Soup', 'Hot, aromatic Nigerian pepper soup prepared with traditional calabash spices, uda, scent leaves, and tender goat meat or fresh catfish.', 50.00, 'Soups', '/src/assets/images/dish_pepper_soup_1791373741040.jpg', true, true, 4),
    ('vegetable-soup', 'Nigerian Vegetable Soup (Edikang Ikong Style)', 'A rich Nigerian vegetable soup prepared with fresh leafy greens, waterleaves, traditional spices, stockfish, and authentic Nigerian assorted meat flavors.', 55.00, 'Soups', '/src/assets/images/dish_egusi_soup_1791373712431.jpg', true, true, 5),
    ('pounded-yam-soup', 'Pounded Yam & Choice of Soup', 'Smooth, stretchy traditional pounded yam served with your choice of rich Nigerian soup (Egusi, Ogbono, or Vegetable) and tender assorted protein.', 60.00, 'Swallows', '/src/assets/images/dish_egusi_soup_1791373712431.jpg', true, true, 6),
    ('ofada-rice', 'Ofada Rice & Ayamase Sauce', 'Traditional unpolished fragrant Ofada rice paired with spicy bleached palm oil green pepper designer stew (Ayamase) loaded with assorted boiled egg and meat.', 65.00, 'Rice', '/src/assets/images/hero_nigerian_feast_1791373699915.jpg', true, false, 7),
    ('suya-beef', 'Spicy Beef Suya Platter', 'Thinly sliced skewered beef grilled over open flame and generously rubbed with authentic northern Nigerian Yaji spice, served with fresh red onions and tomatoes.', 40.00, 'Proteins', '/src/assets/images/dish_fried_rice_1791373723960.jpg', true, false, 8),
    ('moi-moi', 'Special Steamed Moi Moi', 'Silky, savory steamed peeled honey bean pudding blended with red bell peppers, onions, flaked smoked fish, and boiled egg slices.', 25.00, 'Snacks', '/src/assets/images/hero_nigerian_feast_1791373699915.jpg', true, false, 9),
    ('fried-plantains', 'Golden Fried Plantain (Dodo)', 'Sweet, caramelized ripe plantains sliced and gently fried to golden brown perfection. The perfect Nigerian accompaniment to any rice or bean dish.', 20.00, 'Sides', '/src/assets/images/dish_fried_rice_1791373723960.jpg', true, false, 10),
    ('grilled-chicken-peppered', 'Nigerian Peppered Grilled Chicken', 'Tender grilled chicken pieces pan-tossed in a vibrant spicy habanero pepper and onion sauce.', 35.00, 'Proteins', '/src/assets/images/hero_nigerian_feast_1791373699915.jpg', true, false, 11),
    ('zobo-drink', 'Chilled Spiced Zobo Drink', 'Refreshing natural Nigerian hibiscus brew infused with fresh ginger, cloves, and pineapple essence. Served chilled.', 15.00, 'Drinks', '/src/assets/images/dish_pepper_soup_1791373741040.jpg', true, false, 12)
ON CONFLICT (id) DO NOTHING;
`;
