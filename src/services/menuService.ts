import { MenuItem, Category } from '../types';
import { INITIAL_MENU_ITEMS, DEFAULT_CATEGORIES } from '../lib/constants';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_MENU_KEY = 'jays_kitchen_menu_items_v1';
const LOCAL_STORAGE_CATEGORIES_KEY = 'jays_kitchen_categories_v1';

function getLocalMenuItems(): MenuItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MENU_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed reading menu from localStorage:', e);
  }
  // Store defaults
  localStorage.setItem(LOCAL_STORAGE_MENU_KEY, JSON.stringify(INITIAL_MENU_ITEMS));
  return INITIAL_MENU_ITEMS;
}

function saveLocalMenuItems(items: MenuItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_MENU_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed saving menu to localStorage:', e);
  }
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const supabase = getSupabaseClient();
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as MenuItem[];
      }
      if (error) {
        console.warn('Supabase query error, falling back to local data:', error.message);
      }
    } catch (err) {
      console.warn('Supabase connection exception, using local store:', err);
    }
  }
  return getLocalMenuItems();
}

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient();
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch (err) {
      console.warn('Supabase categories error:', err);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return DEFAULT_CATEGORIES;
}

export async function saveMenuItem(item: Omit<MenuItem, 'id'> & { id?: string }): Promise<{ success: boolean; item?: MenuItem; error?: string }> {
  const id = item.id || `dish-${Date.now()}`;
  const completeItem: MenuItem = {
    id,
    name: item.name,
    description: item.description,
    price: Number(item.price),
    category: item.category,
    image_url: item.image_url,
    available: item.available ?? true,
    featured: item.featured ?? false,
    display_order: item.display_order ?? 10,
    updated_at: new Date().toISOString(),
  };

  // If Supabase is active, push to database
  const supabase = getSupabaseClient();
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('menu_items')
        .upsert(completeItem);

      if (error) {
        console.warn('Supabase upsert error, syncing locally:', error.message);
      }
    } catch (err) {
      console.warn('Supabase operation failed:', err);
    }
  }

  // Always keep local copy updated for fast UI & offline reliability
  const current = getLocalMenuItems();
  const existingIdx = current.findIndex((i) => i.id === id);
  let updated: MenuItem[];

  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = completeItem;
  } else {
    updated = [completeItem, ...current];
  }

  saveLocalMenuItems(updated);
  return { success: true, item: completeItem };
}

export async function deleteMenuItem(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) {
        console.warn('Supabase delete error:', error.message);
      }
    } catch (err) {
      console.warn('Supabase delete exception:', err);
    }
  }

  const current = getLocalMenuItems();
  const updated = current.filter((i) => i.id !== id);
  saveLocalMenuItems(updated);
  return { success: true };
}

export async function resetMenuToDefaults(): Promise<MenuItem[]> {
  localStorage.setItem(LOCAL_STORAGE_MENU_KEY, JSON.stringify(INITIAL_MENU_ITEMS));
  return INITIAL_MENU_ITEMS;
}
