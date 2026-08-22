import React from 'react';
import { Truck, ShieldCheck, HeartHandshake, Footprints } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Features Bar */}
      <div className="border-b border-gray-800 bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="p-3 rounded-full bg-gray-800 text-primary-400">
                <Truck className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">Express Delivery</h3>
                <p className="mt-1 text-xs text-gray-400">Free delivery within 24-48 hours inside the metropolitan area.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="p-3 rounded-full bg-gray-800 text-primary-400">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">Genuine Guarantee</h3>
                <p className="mt-1 text-xs text-gray-400">100% authentic sneakers & shoes sourced directly from top brands.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="p-3 rounded-full bg-gray-800 text-primary-400">
                <HeartHandshake className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">Premium Support</h3>
                <p className="mt-1 text-xs text-gray-400">Need help? Text us anytime on WhatsApp for personalized size advice.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded bg-primary-600 text-white">
                <Footprints className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">
                GD <span className="text-primary-500 font-medium">FOOTWEAR</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm">
              Premium quality footwear delivered straight to your door. No registration, no checkout hurdles. Simple selection, instant WhatsApp order.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Categories</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li><a href="/?category=Jutti" className="hover:text-white transition-colors">Traditional Jutti</a></li>
              <li><a href="/?category=Ladies_belli" className="hover:text-white transition-colors">Ladies Flat Belli</a></li>
              <li><a href="/?category=Male_shoes" className="hover:text-white transition-colors">Elegant Male Shoes</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Order Processing</h3>
            <p className="mt-4 text-sm text-gray-400">
              Just add your shoes, pick your color and size, and send your cart summary straight to our team over WhatsApp. We'll handle payment and delivery directly!
            </p>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} GD Footwear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
