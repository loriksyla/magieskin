import React from 'react';

interface FooterProps {
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-2xl font-serif mb-6 uppercase">Magie Skin</h4>
            <p className="text-gray-400 font-light max-w-sm mb-6">
              Redefining skincare through bio-active cellular technology. 
              Minimalist formulations, maximal results.
            </p>
          </div>
          
          <div>
            <h5 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-500">Shop</h5>
            <ul className="space-y-4 text-sm font-light text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">The Serum</a></li>
              <li><a href="#" className="hover:text-white transition-colors">The Cream</a></li>
              <li><a href="#" className="hover:text-white transition-colors">The Essence</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gift Sets</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-500">Connect</h5>
            <ul className="space-y-4 text-sm font-light text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">TikTok</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2024 Magie Skin. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 items-center">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            {onAdminClick && (
              <button onClick={onAdminClick} className="hover:text-white opacity-50 hover:opacity-100 transition-opacity">
                Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};