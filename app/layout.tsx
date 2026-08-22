import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'GD Footwear - Premium Footwear Store',
  description: 'Shop the finest selection of running shoes, sneakers, boots, and formal footwear. Easy WhatsApp ordering, secure catalog browsing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50/50">
        <CartProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
