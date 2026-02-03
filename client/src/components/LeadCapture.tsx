import { useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LeadCapture() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const validateForm = () => {
    // 1. Validate Name
    if (formData.name.trim().length < 3) {
      toast.error("Please enter a valid name (at least 3 characters).");
      return false;
    }
    // Check if name has no letters (e.g. "12345")
    if (!/[a-zA-Z]/.test(formData.name)) {
      toast.error("Name must contain letters.");
      return false;
    }

    // 2. Validate Phone (Matches BD format broadly: 01xxxxxxxxx or +880...)
    // Removes spaces/dashes and checks if there are at least 10 digits
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
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          type: 'General Consultation'
        })
      });

      if (!response.ok) throw new Error('Failed to send request');

      toast.success("Request sent! We will call you shortly.");
      setFormData({ name: '', phone: '' });

    } catch (error) {
      toast.error("Connection failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="consultation" className="bg-primary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-dark rounded-2xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Equipping a new clinic?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Get a full consultation from our biomedical engineers. We help you choose the right mix of refurbished and new equipment to fit your budget.
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm font-medium text-blue-200">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                Free Site Inspection
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                Budget Planning
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                Installation Support
              </span>
            </div>
          </div>

          <div className="w-full lg:w-auto bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-blue-200 uppercase mb-1">Hospital / Clinic Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. City General Hospital" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full lg:w-80 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-blue-200 uppercase mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+880 1..." 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full lg:w-80 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>

              <button 
                disabled={isLoading} 
                className="w-full bg-accent hover:bg-sky-500 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-sky-900/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5" />
                    Get Free Consultation
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}