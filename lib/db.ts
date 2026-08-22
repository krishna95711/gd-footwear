import { createClient } from '@supabase/supabase-js';

// Supabase environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase only if variables are provided and have a valid URL format
export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image_url_2?: string;
  image_url_3?: string;
  category: string;
  sizes: number[];
  colors: string[];
  is_featured: boolean;
  created_at: string;
}

// Default mock products to show if database is empty
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Royal Punjabi Embroidered Jutti',
    description: 'Exquisitely handcrafted traditional Punjabi Jutti adorned with intricate gold zari embroidery. Made from soft premium genuine leather that molds to your feet for unmatched comfort. Perfect for weddings, festivals, and traditional attire.',
    price: 1899.00,
    image_url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80',
    image_url_2: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    image_url_3: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
    category: 'Jutti',
    sizes: [36, 37, 38, 39, 40, 41],
    colors: ['Golden', 'Red', 'Silver'],
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() // 5 days ago
  },
  {
    id: '2',
    name: 'Premium Velvet Ladies Belli',
    description: 'Chic and comfortable velvet finish ladies flat belli shoes with soft cushioned footbed. Features elegant slip-on styling and robust grip rubber soles for comfortable day-long wear. Complements both casual and office wardrobes.',
    price: 999.00,
    image_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
    image_url_2: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80',
    image_url_3: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    category: 'Ladies_belli',
    sizes: [35, 36, 37, 38, 39, 40],
    colors: ['Black', 'Pink', 'Peach'],
    is_featured: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 days ago
  },
  {
    id: '3',
    name: 'Classic Comfort Male Loafer',
    description: 'Handcrafted male loafers in high-grade supple leather featuring seamless stitching and Ortholite breathable insoles. Effortlessly stylish option perfect for business meetings, semi-formal get-togethers, or daily elegant walkouts.',
    price: 2499.00,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    image_url_2: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
    image_url_3: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80',
    category: 'Male_shoes',
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ['Tan Brown', 'Dark Charcoal', 'Classic Black'],
    is_featured: true,
    created_at: new Date().toISOString()
  }
];

// Helper to check if running on browser client
const isBrowser = typeof window !== 'undefined';

// Local storage helpers
const getLocalProducts = (): Product[] => {
  if (!isBrowser) return DEFAULT_PRODUCTS;
  const stored = localStorage.getItem('gd_footwear_products');
  if (!stored) {
    localStorage.setItem('gd_footwear_products', JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_PRODUCTS;
  }
};

const saveLocalProducts = (products: Product[]) => {
  if (!isBrowser) return;
  localStorage.setItem('gd_footwear_products', JSON.stringify(products));
};

// Database interface methods
export async function getProducts(): Promise<Product[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase getProducts error, falling back to local:', error);
        return getLocalProducts();
      }

      return (data || []) as Product[];
    } catch (e) {
      console.error('Supabase query exception, falling back to local:', e);
      return getLocalProducts();
    }
  }

  return getLocalProducts();
}

export async function getProductById(id: string): Promise<Product | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return data as Product;
      }
    } catch (e) {
      console.error('Supabase query error for single product:', e);
    }
  }

  const local = getLocalProducts();
  return local.find(p => p.id === id) || null;
}

// Converts a file to base64 for local client storage when Supabase is not configured
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

export async function uploadImage(file: File): Promise<string> {
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload file to Supabase Storage bucket 'product-images'
      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (e) {
      console.error('Supabase storage upload failed, falling back to local Base64:', e);
      return fileToBase64(file);
    }
  }

  return fileToBase64(file);
}

export async function createProduct(
  productData: Omit<Product, 'id' | 'created_at' | 'image_url' | 'image_url_2' | 'image_url_3'>,
  imageFile: File | null,
  imageUrlStr?: string,
  imageFile2?: File | null,
  imageUrlStr2?: string,
  imageFile3?: File | null,
  imageUrlStr3?: string
): Promise<Product> {
  let image_url = imageUrlStr || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80';
  let image_url_2 = imageUrlStr2 || '';
  let image_url_3 = imageUrlStr3 || '';

  if (imageFile) {
    image_url = await uploadImage(imageFile);
  }
  if (imageFile2) {
    image_url_2 = await uploadImage(imageFile2);
  }
  if (imageFile3) {
    image_url_3 = await uploadImage(imageFile3);
  }

  const newProduct = {
    ...productData,
    image_url,
    ...(image_url_2 ? { image_url_2 } : {}),
    ...(image_url_3 ? { image_url_3 } : {}),
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()
        .single();

      if (!error && data) {
        return data as Product;
      }
      console.error('Supabase createProduct insert error, saving to local storage:', error);
    } catch (e) {
      console.error('Supabase createProduct exception, saving to local storage:', e);
    }
  }

  // Local Storage Fallback
  const local = getLocalProducts();
  const created: Product = {
    ...newProduct,
    id: Math.random().toString(36).substring(2, 15)
  };
  local.unshift(created);
  saveLocalProducts(local);
  return created;
}

export async function updateProduct(
  id: string,
  productData: Partial<Omit<Product, 'id' | 'created_at' | 'image_url' | 'image_url_2' | 'image_url_3'>>,
  imageFile: File | null,
  imageUrlStr?: string,
  imageFile2?: File | null,
  imageUrlStr2?: string,
  imageFile3?: File | null,
  imageUrlStr3?: string
): Promise<Product | null> {
  let image_url = imageUrlStr;
  let image_url_2 = imageUrlStr2;
  let image_url_3 = imageUrlStr3;

  if (imageFile) {
    image_url = await uploadImage(imageFile);
  }
  if (imageFile2) {
    image_url_2 = await uploadImage(imageFile2);
  }
  if (imageFile3) {
    image_url_3 = await uploadImage(imageFile3);
  }

  const updateFields: Partial<Product> = { ...productData };
  if (image_url) {
    updateFields.image_url = image_url;
  }
  if (image_url_2 !== undefined) {
    updateFields.image_url_2 = image_url_2;
  }
  if (image_url_3 !== undefined) {
    updateFields.image_url_3 = image_url_3;
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updateFields)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as Product;
      }
      console.error('Supabase updateProduct error, saving to local:', error);
    } catch (e) {
      console.error('Supabase updateProduct exception, saving to local:', e);
    }
  }

  // Local Storage Fallback
  const local = getLocalProducts();
  const idx = local.findIndex(p => p.id === id);
  if (idx === -1) return null;

  const updated: Product = {
    ...local[idx],
    ...updateFields
  } as Product;

  local[idx] = updated;
  saveLocalProducts(local);
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (supabase) {
    try {
      // First get the product details to delete its image if possible
      const product = await getProductById(id);
      if (product && product.image_url.includes('product-images')) {
        try {
          // Extract file path from public URL
          const urlParts = product.image_url.split('/product-images/');
          if (urlParts.length > 1) {
            const filePath = urlParts[1];
            await supabase.storage.from('product-images').remove([filePath]);
          }
        } catch (storageErr) {
          console.error('Failed to delete image file from Supabase Storage:', storageErr);
        }
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (!error) {
        return true;
      }
      console.error('Supabase delete error, using local:', error);
    } catch (e) {
      console.error('Supabase delete exception, using local:', e);
    }
  }

  const local = getLocalProducts();
  const filtered = local.filter(p => p.id !== id);
  if (filtered.length === local.length) return false;
  saveLocalProducts(filtered);
  return true;
}
