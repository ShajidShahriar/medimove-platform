import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';

interface Product {
  _id: string;
  name: string;
  category: string;
  condition: string;
  stockStatus: string;
  image: string;
  specs: string[];
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Show 8 items per page

  useEffect(() => {
const API_URL = import.meta.env.PROD 
  ? 'https://medimove-api-shajid-e2699ab9142e.herokuapp.com'
  : 'http://localhost:5001';    
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      });
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on change
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-primary mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">
            Full Equipment Catalog
          </h1>
          <p className="text-slate-600 mt-2">
            Browsing all {products.length} available units.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {currentProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Pagination Controls */}
        {!isLoading && products.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-4">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-slate-300 rounded-lg bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm font-medium text-slate-700">
              Page {currentPage} of {totalPages}
            </span>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-300 rounded-lg bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}