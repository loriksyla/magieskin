import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">The Essentials</h2>
          <p className="text-secondary font-light">
            A curated regime of three high-performance products designed to work in synergy for complete skin transformation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <div key={product.id} className={`transition-all duration-700 delay-[${index * 200}ms]`}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};