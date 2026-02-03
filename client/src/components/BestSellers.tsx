import { useEffect, useState } from 'react'; 
import { ArrowRight, Loader2 } from 'lucide-react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

// Define the Product Type 
interface Product {
  _id: string;
  name: string;
  category: string;
  condition: string;
  stockStatus: string;
  image: string;
  specs: string[];
}

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // The Fetch Logic
  useEffect(() => {
  const API_URL = import.meta.env.PROD 
    ? 'https://medimove-api-shajid-e2699ab9142e.herokuapp.com'
    : 'http://localhost:5001';

  fetch(`${API_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError('Failed to load catalog. Please try again later.');
        setIsLoading(false);
      });
  }, []);

  return (
    <section id="catalog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Best-Selling Equipment</h2>
            <p className="mt-2 text-slate-600">Premium refurbished and new units ready for deployment.</p>
          </div>
          
          <Link 
            to="/catalog" // 
            className="hidden md:flex items-center gap-2 text-primary font-semibold hover:text-sky-600 transition-colors group"
          >
            View Full Catalog
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p>Loading Inventory...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 bg-red-50 rounded-xl border border-red-100 text-red-600">
            <p>{error}</p>
          </div>
        )}

        {/* The Grid (Only shows when data is ready) */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0,4).map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-12 text-center md:hidden">
          <button className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold w-full">
             View Full Catalog
          </button>
        </div>

      </div>
    </section>
  );
}