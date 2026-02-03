import { useState } from 'react';
import { X, Trash2, Send, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export default function CartDrawer() {
  const { isCartOpen, toggleCart, items, removeFromCart, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const validateForm = () => {
    if (formData.name.trim().length < 3) {
      toast.error("Please enter a valid name (at least 3 characters).");
      return false;
    }
    const cleanPhone = formData.phone.replace(/\D/g, ''); 
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid phone number (min 10 digits).");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        type: 'Quote Request',
        items: items.map(item => ({ name: item.name, id: item.id })) 
      };

const API_URL = import.meta.env.PROD 
  ? 'https://medimove-api-shajid-e2699ab9142e.herokuapp.com'
  : 'http://localhost:5001';      
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to submit quote');

      toast.success("Quote submitted! Check your email.");
      clearCart(); 
      setFormData({ name: '', phone: '' });
      toggleCart(); 

    } catch (error) {
      toast.error("Failed to submit quote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div 
      className={`fixed inset-0 z-[60] flex justify-end transition-colors duration-300 ${
        isCartOpen ? 'pointer-events-auto' : 'pointer-events-none delay-300'
      }`}
    >
      <div 
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={toggleCart} 
      />

      <div 
        className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Quote Request</h2>
            <p className="text-sm text-slate-500">
              {items.length} {items.length === 1 ? 'item' : 'items'} selected
            </p>
          </div>
          <button 
            onClick={toggleCart}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <p>Your quote list is empty.</p>
              <button 
                onClick={() => {
                  toggleCart();
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-primary font-semibold hover:underline"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-primary/20 transition-colors">
                <div className="w-16 h-16 bg-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center p-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">Ref: #MM-EQ-{item.id.slice(-4)}</p>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Form */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-900 uppercase mb-4">Contact Details</h3>
            
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Hospital / Clinic Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              
              <button 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Quote Request
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}