import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, CheckCircle, AlertCircle, Clock, Search } from 'lucide-react';
import { toast } from 'sonner';
import AddProductModal from '../../components/admin/AddProductModal';
import ProductThumbnail from '../../components/admin/ProductThumbnail'; 

// Improved Interface to match your backend data structure
interface Product {
  _id: string;
  name: string;
  category: string;
  stockStatus: string;
  images?: string[]; 
  image?: string; 
  price: number;
  condition: string; 
  specs: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  console.log("DEBUG: Vercel sees this API URL:", import.meta.env.VITE_API_URL);
  // 1. Fetch Products
  const fetchProducts = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
      // Removed setIsLoading(false) because the state variable wasn't defined
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Could not load products");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product); // Set the data
    setIsModalOpen(true);       
  };

  const handleAdd = () => {
    setEditingProduct(null); // Clear data
    setIsModalOpen(true);    // Open the window
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Delete Handler
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    try {
      await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
      toast.success('Product deleted');
      fetchProducts(); // Refresh list
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  // 3. Toggle Stock Status Handler
  const toggleStock = async (product: Product) => {
    const nextStatus = product.stockStatus === 'In Stock' ? 'Low Stock' : 
                       product.stockStatus === 'Low Stock' ? 'Pre-Order' : 'In Stock';
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    try {
      await fetch(`${API_URL}/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockStatus: nextStatus })
      });
      toast.success(`Status updated to ${nextStatus}`);
      fetchProducts();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  // Filter Logic
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-500 mt-1">Manage stock levels and product details.</p>
        </div>
         <button 
          onClick={handleAdd} // Open Modal
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 flex items-center gap-2">
        <Search className="w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search inventory..." 
          className="flex-1 outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status (Click to Change)</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((product) => {
              const mainImage = (product.images && product.images.length > 0) 
                ? product.images[0] 
                : (product.image || undefined);

              return (
                <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    
                    <ProductThumbnail src={mainImage} alt={product.name} />

                    <span className="font-medium text-slate-900">{product.name}</span>
                  </td>
                  
                  <td className="p-4 text-slate-500 text-sm">{product.category}</td>
                  
                  <td className="p-4">
                    <button 
                      onClick={() => toggleStock(product)}
                      className={`text-xs px-3 py-1 rounded-full font-semibold border flex items-center gap-1 w-fit cursor-pointer hover:scale-105 transition-transform ${
                        product.stockStatus === 'In Stock' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        product.stockStatus === 'Low Stock' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {product.stockStatus === 'In Stock' && <CheckCircle className="w-3 h-3" />}
                      {product.stockStatus === 'Low Stock' && <AlertCircle className="w-3 h-3" />}
                      {product.stockStatus === 'Pre-Order' && <Clock className="w-3 h-3" />}
                      {product.stockStatus}
                    </button>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => handleEdit(product)} 
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Modal Logic - FIXED: Added || undefined to solve the Null type error */}
        <AddProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchProducts}
          productToEdit={editingProduct as any}
        />

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-sm">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}