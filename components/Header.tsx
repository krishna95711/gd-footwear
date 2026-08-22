'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X, Footprints } from 'lucide-react';

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-primary-600 text-white shadow-md">
                <Footprints className="h-6 w-6" />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                GD <span className="text-primary-600 font-medium">FOOTWEAR</span>
              </span>
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors">
                Shop All
              </Link>
              <Link href="/?category=Jutti" className="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors">
                Jutti
              </Link>
              <Link href="/?category=Ladies_belli" className="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors">
                Ladies Belli
              </Link>
              <Link href="/?category=Male_shoes" className="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors">
                Male Shoes
              </Link>
            </div>
          </div>
          <div className="ml-10 flex items-center space-x-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="group relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-all"
            >
              <ShoppingBag className="h-6 w-6 text-gray-700 group-hover:text-primary-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[11px] font-bold text-white ring-2 ring-white animate-bounce-short">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 lg:hidden hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="py-4 border-t border-gray-100 lg:hidden space-y-3 bg-white">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-gray-800 hover:text-primary-600 hover:bg-gray-50 p-2 rounded-md"
            >
              Shop All
            </Link>
            <Link
              href="/?category=Jutti"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 p-2 rounded-md pl-4"
            >
              Jutti
            </Link>
            <Link
              href="/?category=Ladies_belli"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 p-2 rounded-md pl-4"
            >
              Ladies Belli
            </Link>
            <Link
              href="/?category=Male_shoes"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 p-2 rounded-md pl-4"
            >
              Male Shoes
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
