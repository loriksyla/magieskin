import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductList } from './components/ProductList';
import { ScienceSection } from './components/ScienceSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AIConsultant } from './components/AIConsultant';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPanel } from './components/AdminPanel';
import { Product, CartItem } from './types';
import { PRODUCTS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Admin View Rendering
  if (currentView === 'admin') {
    return <AdminPanel onBack={() => setCurrentView('store')} />;
  }

  // Store View Logic
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setCart([]); // Clear cart
    setIsCheckoutOpen(false);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header cartCount={cartItemCount} onCartClick={toggleCart} />
      
      <main className="flex-grow">
        <Hero />
        <div id="products">
          <ProductList products={PRODUCTS} onAddToCart={addToCart} />
        </div>
        <ScienceSection />
      </main>

      <Footer onAdminClick={() => setCurrentView('admin')} />
      
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        total={cartTotal}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={cartTotal}
        onSuccess={handleCheckoutSuccess}
        cartItems={cart}
      />
      
      <AIConsultant />
    </div>
  );
};

export default App;