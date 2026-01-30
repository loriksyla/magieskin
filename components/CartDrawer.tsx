import React from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  total: number;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemove,
  onUpdateQuantity,
  total,
  onCheckout,
}) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-serif">Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-secondary">
              <span className="text-lg font-light mb-4">Your cart is empty.</span>
              <button 
                onClick={onClose}
                className="text-sm border-b border-primary pb-1 hover:text-primary transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                <div className="w-20 h-24 bg-gray-100 flex-shrink-0 overflow-hidden">
                   <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-sm font-medium">{item.product.name}</h3>
                      <p className="text-sm">${item.product.price * item.quantity}</p>
                    </div>
                    <p className="text-xs text-secondary mt-1">{item.product.size}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200">
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="p-1 hover:bg-gray-50 text-secondary"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="p-1 hover:bg-gray-50 text-secondary"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => onRemove(item.product.id)}
                      className="text-xs text-secondary hover:text-red-500 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="text-lg font-serif font-medium">${total}</span>
            </div>
            <p className="text-xs text-secondary mb-6 text-center">Shipping & taxes calculated at checkout.</p>
            <button 
              onClick={onCheckout}
              className="w-full bg-primary text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-gray-800 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};