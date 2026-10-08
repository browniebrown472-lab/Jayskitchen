import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_CONFIG_KEY = 'jays_kitchen_supabase_config_v1';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  source: 'env' | 'custom' | 'none';
}

export function getSupabaseConfig(): SupabaseConfig {
  // 1. Check custom configured credentials from Admin UI
  try {
    const raw = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey && parsed.url.startsWith('http')) {
        return {
          url: parsed.url.trim(),
          anonKey: parsed.anonKey.trim(),
          source: 'custom',
        };
      }
    }
  } catch (e) {
    console.error('Failed reading custom Supabase config:', e);
  }

  // 2. Check environment variables
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey && envUrl.startsWith('http') && !envUrl.includes('your-project')) {
    return {
      url: envUrl.trim(),
      anonKey: envKey.trim(),
      source: 'env',
    };
  }

  return {
    url: '',
    anonKey: '',
    source: 'none',
  };
}

export function saveCustomSupabaseConfig(url: string, anonKey: string): void {
  localStorage.setItem(
    STORAGE_CONFIG_KEY,
    JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() })
  );
  activeClient = null; // force re-instantiation
}

export function clearCustomSupabaseConfig(): void {
  localStorage.removeItem(STORAGE_CONFIG_KEY);
  activeClient = null;
}

export const isSupabaseConfigured = (): boolean => {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey && config.source !== 'none');
};

let activeClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (activeClient) return activeClient;
  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      activeClient = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return activeClient;
    } catch (err) {
      console.error('Error creating Supabase client:', err);
      return null;
    }
  }
  return null;
}

export const supabase = getSupabaseClient();

/**
 * Diagnostic test tool to verify if provided Supabase credentials and database tables work
 */
export async function testSupabaseConnection(
  testUrl?: string,
  testKey?: string
): Promise<{
  success: boolean;
  message: string;
  details?: {
    categoriesCount?: number;
    menuItemsCount?: number;
    hasStorageBucket?: boolean;
  };
}> {
  const url = testUrl || getSupabaseConfig().url;
  const key = testKey || getSupabaseConfig().anonKey;

  if (!url || !key) {
    return {
      success: false,
      message: 'Supabase URL or Anon Key is missing. Please provide both credentials.',
    };
  }

  try {
    const client = createClient(url, key);

    // 1. Test Categories table
    const { data: catData, error: catError } = await client
      .from('categories')
      .select('id', { count: 'exact' });

    if (catError) {
      return {
        success: false,
        message: `Connection failed on "categories" table: ${catError.message}. Make sure you ran supabase-schema.sql in the SQL Editor.`,
      };
    }

    // 2. Test Menu Items table
    const { data: menuData, error: menuError } = await client
      .from('menu_items')
      .select('id', { count: 'exact' });

    if (menuError) {
      return {
        success: false,
        message: `Connected to Supabase, but "menu_items" table error: ${menuError.message}.`,
      };
    }

    return {
      success: true,
      message: `Connection successful! Supabase database is active and responding.`,
      details: {
        categoriesCount: catData?.length || 0,
        menuItemsCount: menuData?.length || 0,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to connect to Supabase: ${err.message || 'Unknown network error'}.`,
    };
  }
}

/**
 * Uploads a food image either to Supabase Storage or falls back to an optimized base64 data URL
 */
export async function uploadFoodImage(file: File): Promise<{ url: string; error?: string }> {
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { url: '', error: 'Image size exceeds 5MB limit. Please choose a smaller image.' };
  }

  // Validate format
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    return { url: '', error: 'Only JPG, PNG, and WEBP image formats are allowed.' };
  }

  const client = getSupabaseClient();
  if (isSupabaseConfigured() && client) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `dishes/${fileName}`;

      const { error: uploadError } = await client.storage
        .from('menu-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.warn('Supabase upload error, falling back to local preview:', uploadError.message);
      } else {
        const { data } = client.storage.from('menu-images').getPublicUrl(filePath);
        if (data?.publicUrl) {
          return { url: data.publicUrl };
        }
      }
    } catch (err: unknown) {
      console.error('Error during Supabase storage upload:', err);
    }
  }

  // Graceful fallback to client-side data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ url: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ url: '', error: 'Failed to read image file.' });
    };
    reader.readAsDataURL(file);
  });
}
