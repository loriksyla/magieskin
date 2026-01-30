import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group flex flex-col h-full bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        <button
          onClick={() => onAddToCart(product)}
          className={`absolute bottom-4 right-4 p-3 bg-white text-primary rounded-full shadow-lg transition-all duration-300 transform ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          } hover:bg-primary hover:text-white`}
          aria-label="Add to cart"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow px-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-serif font-medium">{product.name}</h3>
          <span className="text-sm font-medium">${product.price}</span>
        </div>
        <p className="text-xs text-secondary uppercase tracking-widest mb-3">{product.shortName}</p>
        <p className="text-sm text-gray-600 font-light leading-relaxed mb-4 flex-grow">
          {product.description}
        </p>
        
        {/* Benefits/Ingredients mini tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
          {product.benefits.slice(0, 2).map((benefit) => (
            <span key={benefit} className="text-[10px] uppercase tracking-wide bg-gray-50 text-secondary px-2 py-1 rounded-sm">
              {benefit}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};