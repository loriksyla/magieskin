import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CartItem, Order } from '../types';
import { saveOrder } from '../services/orderService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onSuccess: () => void;
  cartItems: CartItem[];
}

const LOCATIONS: Record<string, string[]> = {
  'Kosova': [
    'Prishtinë', 'Prizren', 'Pejë', 'Gjakovë', 'Ferizaj', 'Gjilan', 'Mitrovicë', 'Podujevë', 'Vushtrri', 'Suharekë', 'Rahovec', 'Tjetër'
  ],
  'Shqipëria': [
    'Tiranë', 'Durrës', 'Vlorë', 'Shkodër', 'Elbasan', 'Fier', 'Korçë', 'Berat', 'Lushnjë', 'Kavajë', 'Tjetër'
  ],
  'Maqedonia e Veriut': [
    'Shkup', 'Tetovë', 'Kumanovë', 'Manastir', 'Ohër', 'Strugë', 'Gostivar', 'Tjetër'
  ]
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, total, onSuccess, cartItems }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    emri: '',
    mbiemri: '',
    email: '',
    adresa: '',
    shteti: '',
    qyteti: '',
    otherCity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('form');
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset dependent fields if parent changes
      ...(name === 'shteti' ? { qyteti: '', otherCity: '' } : {}),
      ...(name === 'qyteti' && value !== 'Tjetër' ? { otherCity: '' } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Create Order Object
    const newOrder: Order = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      customer: formData,
      items: cartItems,
      total: total,
      date: new Date().toISOString(),
      status: 'pending'
    };

    // Save to Service (Async)
    try {
      await saveOrder(newOrder);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Order failed';
      console.error('Order failed', error);
      setIsSubmitting(false);
      setSubmitError(message);
      return;
    }

    // UX Delay for "processing" feel
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-sm">
          <h2 className="text-2xl font-serif">
            {step === 'form' ? 'Checkout' : 'Order Confirmed'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary">Emri</label>
                  <input
                    required
                    name="emri"
                    value={formData.emri}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-primary focus:ring-0 outline-none transition-all"
                    placeholder="Emri juaj"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary">Mbiemri</label>
                  <input
                    required
                    name="mbiemri"
                    value={formData.mbiemri}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-primary focus:ring-0 outline-none transition-all"
                    placeholder="Mbiemri juaj"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">Email Adresa</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-primary focus:ring-0 outline-none transition-all"
                  placeholder="email@shembull.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">Adresa</label>
                <input
                  required
                  name="adresa"
                  value={formData.adresa}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-primary focus:ring-0 outline-none transition-all"
                  placeholder="Rruga, Numri i hyrjes, etj."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary">Shteti</label>
                  <select
                    required
                    name="shteti"
                    value={formData.shteti}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-primary focus:ring-0 outline-none transition-all appearance-none"
                  >
                    <option value="">Zgjidhni shtetin</option>
                    {Object.keys(LOCATIONS).map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary">Qyteti</label>
                  <select
                    required
                    name="qyteti"
                    value={formData.qyteti}
                    onChange={handleChange}
                    disabled={!formData.shteti}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-primary focus:ring-0 outline-none transition-all appearance-none disabled:opacity-50"
                  >
                    <option value="">
                      {!formData.shteti ? 'Zgjidhni shtetin fillimisht' : 'Zgjidhni qytetin'}
                    </option>
                    {formData.shteti && LOCATIONS[formData.shteti]?.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.qyteti === 'Tjetër' && (
                <div className="space-y-2 animate-slide-up">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary">Shkruani Qytetin</label>
                  <input
                    required
                    name="otherCity"
                    value={formData.otherCity}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:border-primary focus:ring-0 outline-none transition-all"
                    placeholder="Emri i qytetit"
                  />
                </div>
              )}

              <div className="pt-6 border-t border-gray-100 mt-6">
                {submitError && (
                  <div className="mb-4 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {submitError}
                  </div>
                )}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-secondary">Total për pagesë</span>
                  <span className="text-xl font-serif font-bold">${total}</span>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-4 uppercase text-sm font-bold tracking-widest hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                      Duke procesuar...
                    </>
                  ) : (
                    'Porosit Tani'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif mb-2">Faleminderit!</h3>
              <p className="text-secondary max-w-xs mx-auto">
                Porosia juaj u pranua me sukses. <br/> Do t'ju kontaktojmë së shpejti.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
