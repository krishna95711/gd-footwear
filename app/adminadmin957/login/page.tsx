'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, KeyRound, Footprints, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/adminadmin957');
        router.refresh();
      } else {
        setError(data.error || 'Incorrect admin password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary-600 text-white shadow-md">
              <Footprints className="h-6 w-6" />
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-gray-950">
              GD <span className="text-primary-600 font-medium">FOOTWEAR</span>
            </span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-2xl font-extrabold tracking-tight text-gray-900">
          Admin Portal Sign In
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Access the catalog manager to upload, edit, and delete products.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-100 rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Admin Security Password
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <KeyRound className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 bg-white border outline-none text-gray-800"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-4 w-4" />
                    Authenticate Account
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
