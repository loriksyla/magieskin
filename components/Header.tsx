import React, { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-1">
          <a href="#" className="text-2xl font-serif font-semibold tracking-tighter uppercase">
            Magie <span className="text-xs font-sans font-light tracking-widest ml-1">Skin</span>
          </a>
        </div>

        {/* Actions - Only Cart */}
        <div className="flex-1 flex justify-end items-center">
          <button 
            onClick={onCartClick} 
            className="relative group p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-accent rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};