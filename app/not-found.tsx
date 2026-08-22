import React from 'react';
import Link from 'next/link';
import { Footprints, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gray-50/50 px-6 text-center">
      <div className="flex flex-col items-center max-w-md space-y-6">
        {/* Footprint Outlines with clean badges */}
        <div className="relative p-6 rounded-full bg-primary-50 text-primary-600 shadow-inner flex items-center justify-center w-24 h-24 animate-pulse-slow">
          <Footprints className="h-12 w-12" />
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white shadow ring-2 ring-white">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Footwear Page Not Found
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Oops! The page you are looking for doesn't exist, has been removed, or is locked under another secret path.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
