import { useState, useEffect } from 'react';
import { X, Search, Loader2, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  category: string;
  image: string;
  stockStatus: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addToCart, items } = useCart();

  // 1. Fetch all products when component mounts
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  // 2. Filter logic (The "Autocomplete" Brain)
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) || 
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  }, [query, products]);

  // 3. Handle Add to Cart from Search
  const handleAdd = (product: Product) => {
    addToCart({ id: product._id, name: product.name, image: product.image });
    toast.success(`${product.name} added to quote`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
      
      {/* Dark Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        
        {/* Input Header */}
        <div className="flex items-center border-b border-slate-100 p-4 gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search equipment (e.g. Ultrasound, Ventilator)..." 
            className="flex-1 text-lg outline-none text-slate-900 placeholder:text-slate-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto bg-slate-50/50">
          
          {/* Loading State */}
          {isLoading && (
            <div className="p-8 flex justify-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}

          {/* Empty State (No Query) */}
          {!isLoading && query === '' && (
            <div className="p-12 text-center text-slate-400">
              <p className="text-sm">Type to start searching...</p>
            </div>
          )}

          {/* No Results Found */}
          {!isLoading && query !== '' && results.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <p>No results found for "<span className="font-semibold text-slate-900">{query}</span>"</p>
            </div>
          )}

          {/* Results List */}
          <div className="divide-y divide-slate-100">
            {results.map((product) => {
              const isInCart = items.some(item => item.id === product._id);
              
              return (
                <div key={product._id} className="flex items-center gap-4 p-4 hover:bg-white hover:shadow-sm transition-all group">
                  
                  {/* Image */}
                  <div className="w-12 h-12 bg-white rounded-lg border border-slate-100 p-1 flex items-center justify-center">
                    <img src={product.image} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{product.name}</h4>
                    <span className="text-xs text-slate-500 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => handleAdd(product)}
                    disabled={isInCart}
                    className={`p-2 rounded-lg transition-colors ${
                      isInCart 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-white border border-slate-200 text-slate-400 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {isInCart ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Footer Hint */}
        <div className="bg-slate-50 border-t border-slate-100 p-3 px-4 text-xs text-slate-400 flex justify-between">
          <span>{results.length} results found</span>
          <span>Press <kbd className="font-sans bg-white border border-slate-200 rounded px-1">ESC</kbd> to close</span>
        </div>

      </div>
    </div>
  );
}