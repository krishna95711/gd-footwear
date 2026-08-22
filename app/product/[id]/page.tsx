'use client';

import React, { useState, useEffect } from 'react';
import { getProductById, Product } from '@/lib/db';
import { useCart } from '@/context/CartContext';
import { ShieldCheck, ArrowLeft, Plus, Minus, ShoppingCart, MessageSquare, ChevronLeft, ChevronRight, Send, Ruler, X } from 'lucide-react';
import Link from 'next/link';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Selected configurations
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getProductById(params.id);
      setProduct(data);
      if (data) {
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-500">Loading premium footwear details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-950">Footwear Not Found</h2>
        <p className="mt-2 text-sm text-gray-500">The product you are looking for does not exist or has been removed.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (selectedSize === null || selectedColor === null) {
      alert('Please choose a size and color.');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };


  return (
    <div className="bg-white pb-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-primary-600">
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
          {/* Left Column: Image Gallery with Interactive Slider & Thumbnails */}
          <div className="flex flex-col gap-4">
            {/* Active Image Slider Container */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm max-h-[480px] group">
              <img
                src={[product.image_url, product.image_url_2, product.image_url_3].filter(Boolean)[activeImageIdx] as string}
                alt={`${product.name} - View ${activeImageIdx + 1}`}
                className="h-full w-full object-cover object-center transition-all duration-300"
              />
              
              {/* Previous & Next Arrow Overlays (only show if multiple images exist) */}
              {[product.image_url, product.image_url_2, product.image_url_3].filter(Boolean).length > 1 && (
                <>
                  <button
                    onClick={() => {
                      const len = [product.image_url, product.image_url_2, product.image_url_3].filter(Boolean).length;
                      setActiveImageIdx((prev) => (prev - 1 + len) % len);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Previous Image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      const len = [product.image_url, product.image_url_2, product.image_url_3].filter(Boolean).length;
                      setActiveImageIdx((prev) => (prev + 1) % len);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Next Image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation Row */}
            {[product.image_url, product.image_url_2, product.image_url_3].filter(Boolean).length > 1 && (
              <div className="flex gap-3 justify-center md:justify-start">
                {[product.image_url, product.image_url_2, product.image_url_3].filter(Boolean).map((img, idx) => (
                  <button
                    key={`thumbnail-${idx}`}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-16 w-16 rounded-xl border-2 overflow-hidden bg-gray-50 transition-all ${
                      activeImageIdx === idx
                        ? 'border-primary-600 ring-2 ring-primary-100 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img as string} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center rounded-md bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 ring-1 ring-inset ring-primary-700/10">
                  {product.category}
                </span>
                <h1 className="text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">
                  {product.name}
                </h1>
                <p className="text-2xl font-black text-primary-600 mt-2">
                  ₹{product.price.toFixed(2)}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Description</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {product.description}
                </p>
              </div>

              {/* Color Select */}
              {product.colors && product.colors.length > 0 && (
                <div className="border-t border-gray-100 pt-5">
                  <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">Available Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                          selectedColor === color
                            ? 'border-primary-600 bg-primary-50/50 text-primary-700 font-bold'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Select */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="border-t border-gray-100 pt-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Select Size (Indian / UK)</h3>
                    <button
                      type="button"
                      onClick={() => setShowSizeChart(true)}
                      className="text-xs text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1"
                    >
                      <Ruler className="h-3.5 w-3.5" />
                      Size Chart
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-11 w-11 flex items-center justify-center text-xs font-bold rounded-lg border transition-all ${
                          selectedSize === size
                            ? 'bg-primary-600 border-primary-600 text-white shadow'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Select */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">Quantity</h3>
                <div className="flex items-center border border-gray-200 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-1 text-sm font-bold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 pt-6 mt-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-6 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Shopping Cart
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-primary-600 text-primary-600 hover:bg-primary-50 font-bold py-3.5 px-6 transition-all"
                >
                  <Send className="h-5 w-5" />
                  Order Instantly
                </button>
              </div>

              {addedMessage && (
                <p className="text-xs text-center font-semibold text-green-600 animate-bounce-short">
                  ✓ Footwear added! Your shopping cart is open on the right.
                </p>
              )}

              <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Guaranteed safe shopping. No login or signup required.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sizing Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setShowSizeChart(false)} />

          {/* Modal Container */}
          <div className="relative transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary-600" />
                GD Footwear Sizing Chart
              </h3>
              <button
                onClick={() => setShowSizeChart(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              We use standard <strong>Indian / UK Sizing</strong>. Refer to the matrix comparison below to find your perfect fit!
            </p>

            {/* Sizing Comparison Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100 mb-6">
              <table className="min-w-full divide-y divide-gray-100 text-xs text-left text-gray-500">
                <thead className="bg-gray-50 font-bold text-gray-500 uppercase">
                  <tr>
                    <th scope="col" className="px-3 py-3">Indian / UK</th>
                    <th scope="col" className="px-3 py-3">US Size</th>
                    <th scope="col" className="px-3 py-3">Euro (EU)</th>
                    <th scope="col" className="px-3 py-3">Foot Length (cm)</th>
                    <th scope="col" className="px-3 py-3">Inches</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white font-semibold text-gray-700">
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-3 py-2.5 font-bold text-primary-600">Size 5</td>
                    <td className="px-3 py-2.5">6</td>
                    <td className="px-3 py-2.5">38</td>
                    <td className="px-3 py-2.5">24.1 cm</td>
                    <td className="px-3 py-2.5">9.5"</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-3 py-2.5 font-bold text-primary-600">Size 6</td>
                    <td className="px-3 py-2.5">7</td>
                    <td className="px-3 py-2.5">39 / 40</td>
                    <td className="px-3 py-2.5">25.0 cm</td>
                    <td className="px-3 py-2.5">9.8"</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-3 py-2.5 font-bold text-primary-600">Size 7</td>
                    <td className="px-3 py-2.5">8</td>
                    <td className="px-3 py-2.5">41</td>
                    <td className="px-3 py-2.5">25.7 cm</td>
                    <td className="px-3 py-2.5">10.1"</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-3 py-2.5 font-bold text-primary-600">Size 8</td>
                    <td className="px-3 py-2.5">9</td>
                    <td className="px-3 py-2.5">42</td>
                    <td className="px-3 py-2.5">26.5 cm</td>
                    <td className="px-3 py-2.5">10.4"</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-3 py-2.5 font-bold text-primary-600">Size 9</td>
                    <td className="px-3 py-2.5">10</td>
                    <td className="px-3 py-2.5">43</td>
                    <td className="px-3 py-2.5">27.3 cm</td>
                    <td className="px-3 py-2.5">10.7"</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-3 py-2.5 font-bold text-primary-600">Size 10</td>
                    <td className="px-3 py-2.5">11</td>
                    <td className="px-3 py-2.5">44</td>
                    <td className="px-3 py-2.5">28.1 cm</td>
                    <td className="px-3 py-2.5">11.0"</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-3 py-2.5 font-bold text-primary-600">Size 11</td>
                    <td className="px-3 py-2.5">12</td>
                    <td className="px-3 py-2.5">45</td>
                    <td className="px-3 py-2.5">29.0 cm</td>
                    <td className="px-3 py-2.5">11.4"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* How to measure guide */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
              <h4 className="text-xs font-bold text-gray-950 uppercase tracking-wider">How to Measure Your Foot Length:</h4>
              <ol className="list-decimal pl-4 text-xs text-gray-600 space-y-1.5 font-medium">
                <li>Place a sheet of paper on the floor flat against a wall.</li>
                <li>Stand on the paper with your heel lightly touching the wall.</li>
                <li>Mark the tip of your longest toe on the paper with a pencil.</li>
                <li>Measure the distance from the edge of the paper to your mark using a ruler (in cm or inches) and compare it with our chart above!</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
