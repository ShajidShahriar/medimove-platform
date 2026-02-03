import { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import ImageUploader from './ImageUploader'; // <--- We use this now

interface Product {
  _id?: string;
  name: string;
  category: string;
  condition: string;
  stockStatus: string;
  price: number;
  images: string[];
  image?: string; // Keep this for legacy support (older items)
  specs: string[];
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: Product | null;
}

export default function AddProductModal({ isOpen, onClose, onSuccess, productToEdit }: ProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Initial State
  const initialFormState = {
    name: '',
    category: 'Radiology',
    condition: 'New',
    stockStatus: 'In Stock',
    price: 0,
    images: [] as string[],
    specs: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // EFFECT: When the modal opens, check if we are editing
  useEffect(() => {
    if (productToEdit) {
      // Logic: If product has new 'images' array, use it. 
      // If it only has old 'image' string, wrap it in an array so it works with the new uploader.
      const existingImages = productToEdit.images && productToEdit.images.length > 0 
        ? productToEdit.images 
        : (productToEdit.image ? [productToEdit.image] : []);

      setFormData({
        name: productToEdit.name,
        category: productToEdit.category,
        condition: productToEdit.condition,
        stockStatus: productToEdit.stockStatus,
        price: productToEdit.price || 0,
        images: existingImages,
        specs: productToEdit.specs.join(', ')
      });
    } else {
      // ADD MODE: Reset form
      setFormData(initialFormState);
    }
  }, [productToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const specsArray = formData.specs.split(',').map(s => s.trim()).filter(s => s !== '');
      
      // We explicitly send 'images' (Array) to the backend now
      const payload = { 
        ...formData, 
        specs: specsArray,
        image: formData.images[0] || '' // Fallback: set primary image string for old frontend compatibility
      };

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      
      let res;
      if (productToEdit) {
        // --- EDIT LOGIC (PUT) ---
        res = await fetch(`${API_URL}/api/products/${productToEdit._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // --- ADD LOGIC (POST) ---
        res = await fetch(`${API_URL}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) throw new Error('Operation failed');

      toast.success(productToEdit ? 'Product updated!' : 'Product added!');
      onSuccess(); 
      onClose();

    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {productToEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* --- NEW IMAGE UPLOADER SECTION --- */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Product Gallery</label>
            <ImageUploader 
              existingImages={formData.images}
              onChange={(newUrls) => setFormData({ ...formData, images: newUrls })}
            />
          </div>
          {/* ---------------------------------- */}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
            <input 
              required
              type="text" 
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select 
                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Radiology">Radiology</option>
                <option value="ICU">ICU</option>
                <option value="OT">OT</option>
                <option value="Furniture">Furniture</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
              <select 
                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
                value={formData.condition}
                onChange={e => setFormData({...formData, condition: e.target.value})}
              >
                <option value="New">New</option>
                <option value="Refurbished">Refurbished</option>
              </select>
            </div>
          </div>

          {/* Specs */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Technical Specs</label>
            <textarea 
              required
              rows={3}
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
              value={formData.specs}
              onChange={e => setFormData({...formData, specs: e.target.value})}
              placeholder="15 inch screen, Battery backup, Wifi enabled"
            />
          </div>

          <button 
            disabled={isLoading}
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-md flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {productToEdit ? 'Update Product' : 'Save Product'}
          </button>

        </form>
      </div>
    </div>
  );
}