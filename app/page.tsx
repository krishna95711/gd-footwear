'use client';

import React, { useState, useEffect } from 'react';
import { getProducts, Product } from '@/lib/db';
import { useCart } from '@/context/CartContext';
import { Search, SlidersHorizontal, Footprints, Flame, Sparkles, Filter, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Storefront() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [showFilters, setShowFilters] = useState(false);

  // Load products
  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  // Sync category filter from URL params (in case user clicked a header category link)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const cat = urlParams.get('category');
      if (cat) {
        setSelectedCategory(cat);
      } else {
        setSelectedCategory('All');
      }
    }
  }, []);

  const categories = ['All', 'Jutti', 'Ladies_belli', 'Male_shoes'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesPrice = p.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const featuredProducts = products.filter((p) => p.is_featured);

  return (
    <div className="bg-gray-50/50 pb-16">
      {/* 1. Hero Promo Banner */}
      <section className="relative overflow-hidden bg-gray-900 py-16 px-6 text-white sm:px-12 md:py-20 lg:px-20">
        <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-gradient-to-r from-primary-950 to-indigo-950" />
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-600 opacity-20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-500 opacity-20 blur-3xl" />
        
        <div className="relative mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center md:text-left space-y-5">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-400 ring-1 ring-inset ring-primary-500/20">
              <Sparkles className="h-3 w-3" /> New Season Arrival
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Step Into Style & Comfort
            </h1>
            <p className="text-base text-gray-300">
              Explore premium footwear engineered for maximum durability, speed, and luxury. Order instantly via WhatsApp. Zero logins. Zero complications.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('catalog');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-md bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Browse Catalog
              </button>
              <Link
                href="/admin"
                className="rounded-md border border-gray-700 bg-gray-800/50 px-5 py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Admin Panel &rarr;
              </Link>
            </div>
          </div>
          <div className="relative w-full max-w-sm aspect-square md:max-w-md hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
              alt="Promo sneaker"
              className="w-full h-full object-contain drop-shadow-[0_25px_25px_rgba(14,165,233,0.3)] animate-pulse-slow"
            />
          </div>
        </div>
      </section>

      {/* 2. Featured Showcase Slider (optional style) */}
      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="h-5 w-5 text-red-500 fill-red-500 animate-bounce" />
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 3).map((product) => (
              <div
                key={`featured-${product.id}`}
                className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-full aspect-[4/3] rounded-lg bg-gray-50 overflow-hidden mb-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-600 flex items-center gap-1 shadow">
                      HOT
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                </div>
                <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-50">
                  <span className="text-xl font-extrabold text-gray-900">₹{product.price.toFixed(2)}</span>
                  <Link
                    href={`/product/${product.id}`}
                    className="inline-flex items-center gap-1 text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    View Details <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Catalog Section with Search and Filters */}
      <section id="catalog" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Explore Catalog</h2>
            <p className="mt-2 text-sm text-gray-500">Filters shoes by style, category, and price range.</p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative rounded-md shadow-sm max-w-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 bg-white border outline-none text-gray-700"
                placeholder="Search shoes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-semibold border shadow-sm transition-all bg-white ${
                showFilters ? 'border-primary-500 text-primary-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Dynamic Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-start justify-between transition-all animate-fade-in">
            <div className="space-y-3 w-full md:w-1/3">
              <label className="text-xs font-bold text-gray-500 tracking-wider uppercase flex items-center gap-1">
                <Filter className="h-3 w-3" /> Max Price: ₹{maxPrice}
              </label>
              <input
                type="range"
                min="200"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-400 font-medium">
                <span>₹200</span>
                <span>₹2500</span>
                <span>₹5000</span>
              </div>
            </div>

            <div className="w-full md:w-2/3">
              <span className="text-xs font-bold text-gray-500 tracking-wider uppercase block mb-3">Styles & Categories</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary-600 border-primary-600 text-white shadow'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat === 'All' ? '👟 All Footwear' : cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={`shimmer-${i}`} className="animate-pulse space-y-4">
                <div className="aspect-square w-full rounded-lg bg-gray-200" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm mt-8">
            <Footprints className="mx-auto h-12 w-12 text-gray-300 stroke-1" />
            <h3 className="mt-4 text-lg font-bold text-gray-900">No footwear matches found</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              We couldn't find any products matching your active filters. Try resetting the price range or changing your search terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setMaxPrice(5000);
              }}
              className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus:outline-none"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 mt-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square w-full overflow-hidden bg-gray-50 relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm shadow border border-gray-100 text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                      <Link href={`/product/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0 z-10" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 min-h-[2rem]">
                      {product.description}
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0 mt-2 flex items-center justify-between z-20">
                  <span className="text-lg font-extrabold text-gray-950">₹{product.price.toFixed(2)}</span>
                  <Link
                    href={`/product/${product.id}`}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 text-xs font-bold transition-all"
                  >
                    Select Option &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
