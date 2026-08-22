'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, Send, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

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

  // Checkout states
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  if (!isCartOpen) return null;

  const handleDiscordCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerContact || !customerAddress) {
      alert('Please fill out all delivery details.');
      return;
    }

    setOrderLoading(true);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const formattedItems = cart.map((item) => ({
      productName: item.product.name,
      category: item.product.category,
      size: item.selectedSize,
      color: item.selectedColor,
      quantity: item.quantity,
      price: item.product.price,
      productLink: origin ? `${origin}/product/${item.product.id}` : ''
    }));

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerContact,
          customerAddress,
          items: formattedItems,
          total: cartTotal
        })
      });

      if (res.ok) {
        setOrderSuccess(true);
        clearCart();
        // Reset form
        setCustomerName('');
        setCustomerContact('');
        setCustomerAddress('');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Failed to send order.');
    } finally {
      setOrderLoading(false);
    }
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
                {orderSuccess ? 'Order Success' : isCheckingOut ? 'Delivery Address' : `Shopping Cart (${cartCount})`}
              </h2>
              <div className="ml-3 flex h-7 items-center">
                <button
                  type="button"
                  className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                  onClick={() => {
                    setIsCartOpen(false);
                    // Reset modal states after close
                    setTimeout(() => {
                      setIsCheckingOut(false);
                      setOrderSuccess(false);
                    }, 300);
                  }}
                >
                  <span className="sr-only">Close panel</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              {orderSuccess ? (
                <div className="flex h-full flex-col items-center justify-center text-center px-4">
                  <CheckCircle className="h-16 w-16 text-emerald-500 stroke-2 animate-bounce" />
                  <h3 className="mt-4 text-xl font-bold text-gray-900">Order Confirmed!</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    Thank you for shopping with us! Your order has been securely sent. We will contact you soon on your phone number to arrange delivery.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setTimeout(() => {
                        setIsCheckingOut(false);
                        setOrderSuccess(false);
                      }, 300);
                    }}
                    className="mt-8 w-full rounded-xl bg-primary-600 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-primary-700 transition-colors"
                  >
                    Got It, Thank You!
                  </button>
                </div>
              ) : isCheckingOut ? (
                <form onSubmit={handleDiscordCheckout} className="space-y-5">
                  <div className="flex items-center gap-2 pb-2">
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-primary-600"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back to Cart
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 bg-white text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Contact / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerContact}
                      onChange={(e) => setCustomerContact(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 bg-white text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Delivery Address *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Enter complete house number, landmark, city, pin-code..."
                      className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 bg-white text-gray-800"
                    />
                  </div>

                  <div className="border-t border-gray-100 pt-5 mt-5">
                    <div className="flex justify-between text-base font-bold text-gray-900">
                      <p>Total Payable</p>
                      <p>₹{cartTotal.toFixed(2)}</p>
                    </div>
                    <button
                      type="submit"
                      disabled={orderLoading}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      {orderLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 stroke-1" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Cart is empty</h3>
                  <p className="mt-1 text-sm text-gray-500">Add some stylish footwear to your cart!</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
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
                            <div className="flex items-center border border-gray-200 rounded-md bg-white">
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
                                className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1 text-xs"
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

            {cart.length > 0 && !isCheckingOut && !orderSuccess && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50">
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <p>Subtotal</p>
                  <p>₹{cartTotal.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-xs text-gray-400">Order details will be securely sent to our team.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-primary-600 px-6 py-3.5 text-base font-bold text-white shadow-md hover:bg-primary-700 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
