'use client';

import React, { useState, useEffect } from 'react';
import { getProductById, Product } from '@/lib/db';
import { useCart } from '@/context/CartContext';
import { ShieldCheck, ArrowLeft, Plus, Minus, ShoppingCart, MessageSquare } from 'lucide-react';
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

  const handleDirectWhatsAppBuy = () => {
    if (selectedSize === null || selectedColor === null) {
      alert('Please choose a size and color.');
      return;
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    
    let message = `*GD Footwear - Fast Order Inquiry*\n\n`;
    message += `I am interested in buying:\n`;
    message += `Product: *${product.name}*\n`;
    message += `Size: *${selectedSize}*\n`;
    message += `Color: *${selectedColor}*\n`;
    message += `Quantity: *${quantity}*\n`;
    message += `Price: *₹${(product.price * quantity).toFixed(2)}*\n`;
    if (origin) {
      message += `Link: ${origin}/product/${product.id}\n`;
    }
    message += `\nPlease confirm availability! Thank you.`;

    const encoded = encodeURIComponent(message);
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '9530150967';
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
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
          {/* Left Column: Image */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm max-h-[500px]">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
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
                  <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">Select Size (EU)</h3>
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
                  onClick={handleDirectWhatsAppBuy}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-green-600 text-green-600 hover:bg-green-50 font-bold py-3.5 px-6 transition-all"
                >
                  <MessageSquare className="h-5 w-5" />
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
    </div>
  );
}
