import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToProducts = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('products');
    if (element) {
      // Offset for fixed header (approx 80px) and some breathing room
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/id/1059/1920/1080" 
          alt="Skin texture macro shot" 
          className="w-full h-full object-cover filter brightness-[0.9] saturate-[0.8]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="max-w-xl animate-slide-up">
          <span className="inline-block mb-4 px-3 py-1 bg-white/30 backdrop-blur-sm border border-white/40 rounded-full text-xs font-semibold tracking-widest uppercase text-white">
            The Magic of Science
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
            Unlock Your <br/>
            <span className="italic font-light">True Radiance</span>
          </h1>
          <p className="text-lg text-white/90 mb-8 font-light leading-relaxed max-w-md">
            Clinically proven skincare engineered to restore your skin's natural vitality. Experience the transformation with Magie Skin.
          </p>
          <a 
            href="#products" 
            onClick={scrollToProducts}
            className="inline-flex items-center px-8 py-4 bg-white text-primary hover:bg-accent hover:text-white transition-all duration-300 text-sm font-semibold tracking-widest uppercase cursor-pointer"
          >
            Shop The Collection <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};