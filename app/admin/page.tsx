'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  Product, 
  isSupabaseConfigured 
} from '@/lib/db';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  LogOut, 
  Database, 
  FileImage, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  Package, 
  Sparkles,
  DollarSign
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Jutti');
  const [sizesInput, setSizesInput] = useState('39, 40, 41, 42, 43, 44');
  const [colorsInput, setColorsInput] = useState('White, Black, Gray');
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlStr, setImageUrlStr] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Auth verification
  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch('/api/admin/check');
        if (!res.ok) {
          router.push('/admin/login');
        } else {
          setCheckingAuth(false);
          loadProducts();
        }
      } catch (err) {
        router.push('/admin/login');
      }
    }
    verify();
  }, [router]);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Jutti');
    setSizesInput('39, 40, 41, 42, 43, 44');
    setColorsInput('White, Black, Gray');
    setIsFeatured(false);
    setImageFile(null);
    setImageUrlStr('');
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setCategory(product.category);
    setSizesInput(product.sizes.join(', '));
    setColorsInput(product.colors.join(', '));
    setIsFeatured(product.is_featured);
    setImageFile(null);
    setImageUrlStr(product.image_url);
    setImagePreview(product.image_url);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrlStr('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this footwear product?')) return;
    
    setActionLoading(true);
    const success = await deleteProduct(id);
    if (success) {
      alert('Product deleted successfully.');
      loadProducts();
    } else {
      alert('Failed to delete product.');
    }
    setActionLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!imageFile && !imageUrlStr) {
      alert('Please upload an image or provide a valid image URL.');
      return;
    }

    setActionLoading(true);

    const parsedPrice = parseFloat(price);
    const parsedSizes = sizesInput
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(s => !isNaN(s));
    
    const parsedColors = colorsInput
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const productPayload = {
      name,
      description,
      price: parsedPrice,
      category,
      sizes: parsedSizes,
      colors: parsedColors,
      is_featured: isFeatured,
    };

    try {
      if (editingId) {
        // Update product
        const updated = await updateProduct(editingId, productPayload, imageFile, imageUrlStr || undefined);
        if (updated) {
          alert('Footwear updated successfully!');
          setIsModalOpen(false);
          loadProducts();
        } else {
          alert('Failed to update product.');
        }
      } else {
        // Create product
        const created = await createProduct(productPayload, imageFile, imageUrlStr || undefined);
        if (created) {
          alert('Footwear added to catalog successfully!');
          setIsModalOpen(false);
          loadProducts();
        } else {
          alert('Failed to add product.');
        }
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during submission.');
    } finally {
      setActionLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Checking administrator privileges...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Admin Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Catalog Manager</h1>
          <p className="mt-1 text-sm text-gray-500">Add, edit, or delete items from the store catalogue.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-4 py-2.5 shadow-sm transition-all"
          >
            <Plus className="h-4.5 w-4.5" />
            Add New Footwear
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-bold px-4 py-2.5 shadow-sm hover:bg-gray-50 transition-all"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Database Connection Notice */}
      <div className={`p-4 rounded-xl border mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isSupabaseConfigured 
          ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
          : 'bg-amber-50 border-amber-100 text-amber-800'
      }`}>
        <div className="flex items-start md:items-center gap-3">
          {isSupabaseConfigured ? (
            <Database className="h-6 w-6 text-emerald-600 mt-0.5 md:mt-0 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 md:mt-0 flex-shrink-0" />
          )}
          <div>
            <h4 className="text-sm font-bold">
              {isSupabaseConfigured 
                ? 'Connected to Supabase (Production Mode)' 
                : 'Sandbox Mode (Client-Side Storage)'}
            </h4>
            <p className="text-xs mt-1 text-gray-600">
              {isSupabaseConfigured 
                ? 'Your catalog edits are securely saved in PostgreSQL database and image files are hosted on Supabase Storage.' 
                : 'Edits are running inside browser localStorage, and uploads convert to base64. Set up SUPABASE environment variables on Vercel to activate persistent cloud storage!'}
            </p>
          </div>
        </div>
        {!isSupabaseConfigured && (
          <a
            href="#deployment-docs"
            onClick={() => {
              const el = document.getElementById('deployment-docs');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 underline flex-shrink-0"
          >
            Setup Cloud Storage &rarr;
          </a>
        )}
      </div>

      {/* Product List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <Package className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-bold text-gray-900">Your store is empty</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
            Get started by adding your first premium footwear model. Click "Add New Footwear" above!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Footwear Details</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Sizes</th>
                  <th scope="col" className="px-6 py-4">Price</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100 relative">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-gray-950">{product.name}</div>
                          <div className="text-xs text-gray-400 max-w-xs truncate">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600 border border-gray-100">
                        {product.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-gray-600">
                      {product.sizes.join(', ')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-extrabold text-gray-950">
                      ₹{product.price.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {product.is_featured ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-600/10">
                          <Sparkles className="h-3 w-3 fill-amber-700" /> Featured
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Regular</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="inline-flex p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Edit Details"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={actionLoading}
                        className="inline-flex p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsModalOpen(false)} />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-100">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-6 py-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary-600" />
                    {editingId ? 'Edit Footwear Details' : 'Add New Footwear Model'}
                  </h3>
                </div>

                <div className="bg-white px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Air Speed Extreme"
                      className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-800"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Product Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Write premium marketing descriptors..."
                      className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-800"
                    />
                  </div>

                  {/* Row: Price & Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                        Price (₹ INR) *
                      </label>
                      <div className="mt-2 relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-400 font-bold text-sm">₹</span>
                        </div>
                        <input
                          type="number"
                          step="1"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="1499"
                          className="block w-full rounded-lg border border-gray-200 pl-8 pr-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-800 bg-white"
                      >
                        <option value="Jutti">Jutti</option>
                        <option value="Ladies_belli">Ladies Belli</option>
                        <option value="Male_shoes">Male Shoes</option>
                      </select>
                    </div>
                  </div>

                  {/* Sizes (comma-separated) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Sizes Available (Comma Separated EU sizes)
                    </label>
                    <input
                      type="text"
                      value={sizesInput}
                      onChange={(e) => setSizesInput(e.target.value)}
                      placeholder="e.g. 38, 39, 40, 41, 42, 43, 44"
                      className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-800"
                    />
                  </div>

                  {/* Colors (comma-separated) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Colors Available (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={colorsInput}
                      onChange={(e) => setColorsInput(e.target.value)}
                      placeholder="e.g. Red, Black, White, Navy"
                      className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-800"
                    />
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div>
                      <span className="text-xs font-bold text-gray-700">Featured Footwear</span>
                      <p className="text-[10px] text-gray-400">Display this model on the top "Trending Now" panel</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                  </div>

                  {/* Image Upload Selection */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Footwear Image Upload *
                    </label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden">
                          {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FileImage className="w-8 h-8 text-gray-400 mb-2" />
                              <p className="text-xs font-semibold text-gray-500">Click to upload image file</p>
                              <p className="text-[10px] text-gray-400 mt-1">PNG, JPG or WebP (max 4MB)</p>
                            </div>
                          )}
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                        <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-gray-400 font-semibold">OR Manual URL</span></div>
                      </div>

                      <input
                        type="text"
                        value={imageUrlStr}
                        onChange={(e) => {
                          setImageUrlStr(e.target.value);
                          if (e.target.value) {
                            setImageFile(null);
                            setImagePreview(e.target.value);
                          }
                        }}
                        placeholder="Paste image URL (e.g. Unsplash URL)"
                        className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500 text-gray-800"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-2xl border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-4 py-2 disabled:opacity-50"
                  >
                    {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {editingId ? 'Save Changes' : 'Publish Footwear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-semibold px-4 py-2 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Cloud Storage and Database Setup Documentation */}
      <section id="deployment-docs" className="mt-16 bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-extrabold text-gray-950 flex items-center gap-2">
          <Database className="h-5.5 w-5.5 text-primary-600" />
          Cloud Storage & Database Deployment Guide
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Ready to deploy to production on Vercel with cloud databases? Follow this simple, free setup to make your products persistent and available globally.
        </p>

        <div className="mt-6 space-y-6 text-sm text-gray-700">
          <div className="border-l-4 border-primary-600 pl-4 space-y-1">
            <h4 className="font-bold text-gray-950">Step 1: Sign up for Supabase (100% Free Tier)</h4>
            <p className="text-gray-600">Go to <a href="https://supabase.com" target="_blank" className="text-primary-600 font-bold hover:underline">supabase.com</a>, sign up, and create a new project. It takes less than 2 minutes.</p>
          </div>

          <div className="border-l-4 border-primary-600 pl-4 space-y-2">
            <h4 className="font-bold text-gray-950">Step 2: Run SQL Schema to create Products Table</h4>
            <p className="text-gray-600">In the Supabase Dashboard, click on <strong>SQL Editor</strong> &gt; <strong>New Query</strong>, paste the following SQL, and click <strong>Run</strong>:</p>
            <pre className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs font-mono text-gray-600 overflow-x-auto">
{`-- Create products table
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  price numeric(10,2) not null,
  image_url text not null,
  category text not null,
  sizes integer[] not null default '{}',
  colors text[] not null default '{}',
  is_featured boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable read access for everyone
alter table products enable row level security;
create policy "Allow public read access" on products for select using (true);
create policy "Allow admin write access" on products for all using (true);`}
            </pre>
          </div>

          <div className="border-l-4 border-primary-600 pl-4 space-y-2">
            <h4 className="font-bold text-gray-950">Step 3: Create Storage Bucket for Footwear Images</h4>
            <p className="text-gray-600">
              In your Supabase sidebar, click on <strong>Storage</strong> &gt; <strong>New Bucket</strong>. Name it exactly <code className="bg-gray-50 px-1 py-0.5 rounded border border-gray-200 text-primary-600 font-mono">product-images</code>, make it <strong>Public</strong>, and hit Save. That's it!
            </p>
          </div>

          <div className="border-l-4 border-primary-600 pl-4 space-y-2">
            <h4 className="font-bold text-gray-950">Step 4: Connect Vercel & Environment Variables</h4>
            <p className="text-gray-600">When hosting your repository on Vercel, go to Project Settings &gt; Environment Variables and add these secrets:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600 font-semibold">
              <li><code className="bg-gray-50 text-primary-600 font-mono">NEXT_PUBLIC_SUPABASE_URL</code>: Found in Project Settings &gt; API in Supabase.</li>
              <li><code className="bg-gray-50 text-primary-600 font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>: Found in Project Settings &gt; API in Supabase (anon public).</li>
              <li><code className="bg-gray-50 text-primary-600 font-mono">ADMIN_PASSWORD</code>: Your customized secret password to lock your Admin panel (e.g. <code className="bg-gray-50 font-mono">supersecretpwd</code>).</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-lg w-fit">
          <CheckCircle className="h-4 w-4" />
          The application will seamlessly sync with the cloud database once you input the keys.
        </div>
      </section>
    </div>
  );
}
