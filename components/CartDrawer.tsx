'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageSquare } from 'lucide-react';
import Image from 'next/image';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  const handleWhatsAppCheckout = () => {
    // Generate text for WhatsApp
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    
    let message = `*GD Footwear Order - ${new Date().toLocaleDateString()}*\n\n`;
    message += `Hello! I would like to purchase the following items:\n\n`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   Size: ${item.selectedSize} | Color: ${item.selectedColor}\n`;
      message += `   Qty: ${item.quantity} x ₹${item.product.price.toFixed(2)}\n`;
      message += `   Subtotal: ₹${(item.product.price * item.quantity).toFixed(2)}\n`;
      if (origin) {
        message += `   Link: ${origin}/product/${item.product.id}\n`;
      }
      message += `\n`;
    });

    message += `*Total Amount: ₹${cartTotal.toFixed(2)}*\n\n`;
    message += `Please confirm availability and let me know payment/delivery details! Thank you.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '9530150967';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-md">
          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-200 px-4 py-6 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary-600" />
                Shopping Cart ({cartCount})
              </h2>
              <div className="ml-3 flex h-7 items-center">
                <button
                  type="button"
                  className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                  onClick={() => setIsCartOpen(false)}
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Close panel</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 stroke-1" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Cart is empty</h3>
                  <p className="mt-1 text-sm text-gray-500">Add some stylish footwear to your cart!</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flow-root">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-gray-500">Review your products</span>
                    <button
                      onClick={clearCart}
                      className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Clear Cart
                    </button>
                  </div>
                  <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {cart.map((item) => (
                      <li key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>
                                <a href={`/product/${item.product.id}`} className="hover:text-primary-600">
                                  {item.product.name}
                                </a>
                              </h3>
                              <p className="ml-4">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              Size: <span className="font-semibold text-gray-700">{item.selectedSize}</span> | Color:{' '}
                              <span className="font-semibold text-gray-700">{item.selectedColor}</span>
                            </p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <div className="flex items-center border border-gray-200 rounded-md">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-2.5 py-0.5 text-xs font-semibold text-gray-800">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <div className="flex">
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                                className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>₹{cartTotal.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <button
                    onClick={handleWhatsAppCheckout}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 transition-colors"
                  >
                    <MessageSquare className="h-5 w-5 fill-white" />
                    Checkout via WhatsApp
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="font-medium text-primary-600 hover:text-primary-500"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
