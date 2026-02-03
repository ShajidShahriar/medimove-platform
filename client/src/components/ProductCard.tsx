import { Plus, CheckCircle2, Clock, AlertCircle, Check } from 'lucide-react';
import { useCart } from '../context/CartContext'; 
import { toast } from 'sonner';

interface ProductProps {
  product: {
    _id: string; 
    name: string;
    category: string;
    condition: string;
    stockStatus: string;
    // Update: Allow both formats (String for old data, Array for new data)
    images?: string[]; 
    image?: string;
    specs: string[];
  }
}

export default function ProductCard({ product }: ProductProps) {
  const { addToCart, items } = useCart();
  
  // Check using _id
  const isInCart = items.some(item => item.id === product._id);

  // Logic: Use first image from array, or fallback to string, or placeholder
  const mainImage = (product.images && product.images.length > 0) 
    ? product.images[0] 
    : (product.image || '/placeholder.jpg'); 

  const handleAddToCart = () => {
    addToCart({ 
      id: product._id, 
      name: product.name, 
      image: mainImage // <--- FIXED: Use the calculated mainImage, not product.image
    });
    toast.success(`${product.name} added to quote`);
  };

  const getStatusColor = (status: string) => {
    if (status === 'In Stock') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status === 'Low Stock') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      
      <div className="h-64 bg-slate-50 overflow-hidden rounded-t-xl border-b border-slate-100 p-4 flex flex-col items-start">
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(product.stockStatus)} flex items-center gap-1.5 mb-2`}>
          {product.stockStatus === 'In Stock' && <CheckCircle2 className="w-3 h-3" />}
          {product.stockStatus === 'Pre-Order' && <Clock className="w-3 h-3" />}
          {product.stockStatus === 'Low Stock' && <AlertCircle className="w-3 h-3" />}
          {product.stockStatus}
        </div>
        
        <div className="w-full flex-grow flex items-center justify-center">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
            />
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="text-xs font-semibold text-primary/70 mb-2 uppercase tracking-wide">
          {product.condition} • {product.category}
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-4 leading-tight">
          {product.name}
        </h3>

        <ul className="space-y-2 mb-6 flex-grow">
          {product.specs.map((spec, index) => (
            <li key={index} className="flex items-center text-sm text-slate-500">
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-2" />
              {spec}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto gap-4">
          <button className="text-slate-500 text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
            Ask for Price
          </button>
          
          <button 
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              isInCart 
                ? 'bg-emerald-600 text-white border border-emerald-600 cursor-default' 
                : 'bg-white border border-primary text-primary hover:bg-primary hover:text-white'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4" /> Added
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add to Quote
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}