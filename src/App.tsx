/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { MenuPage } from './pages/MenuPage';
import { ContactPage } from './pages/ContactPage';
import { OrderPage } from './pages/OrderPage';
import { AdminPage } from './pages/AdminPage';

function AppContent() {
  const { currentPath, navigate } = useNavigation();

  // Dynamic SEO Page Title sync
  useEffect(() => {
    switch (currentPath) {
      case '/':
        document.title = "Jay's Kitchen | Authentic Nigerian Food in Ghana";
        break;
      case '/about':
        document.title = "About Jay's Kitchen | Nigerian Food in Ghana";
        break;
      case '/menu':
        document.title = "Menu | Jay's Kitchen Nigerian Restaurant";
        break;
      case '/contact':
        document.title = "Contact Jay's Kitchen | Nigerian Food in Ghana";
        break;
      case '/order':
        document.title = "Order & Checkout | Jay's Kitchen";
        break;
      case '/admin':
        document.title = "Owner Portal | Jay's Kitchen Admin";
        break;
      default:
        document.title = "Jay's Kitchen | Authentic Nigerian Food in Ghana";
    }
  }, [currentPath]);

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/about':
        return <AboutPage />;
      case '/menu':
        return <MenuPage />;
      case '/contact':
        return <ContactPage />;
      case '/order':
        return <OrderPage />;
      case '/admin':
        return <AdminPage />;
      default:
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-4">
            <h1 className="font-serif text-3xl font-bold text-stone-900">
              Page Not Found
            </h1>
            <p className="text-sm text-stone-600 max-w-sm">
              The page you are looking for does not exist or has been moved.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900">
      <Navbar />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </NavigationProvider>
  );
}
