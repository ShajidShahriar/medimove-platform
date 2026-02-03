import { useEffect, useState } from 'react';
import { Phone, Calendar, MessageSquare, ShoppingBag, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Lead {
  _id: string;
  name: string;
  phone: string;
  type: string;
  status: string;
  createdAt: string;
  items?: { name: string }[];
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const res = await fetch(`${API_URL}/api/leads`);
    const data = await res.json();
    setLeads(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    try {
      await fetch(`${API_URL}/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      toast.success('Status updated');
      fetchLeads();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const deleteLead = async (id: string) => {
    if(!confirm('Delete this lead?')) return;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    await fetch(`${API_URL}/api/leads/${id}`, { method: 'DELETE' });
    fetchLeads();
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Leads & Quotes</h1>
        <p className="text-slate-500 mt-1">Track incoming consultations and quote requests.</p>
      </div>

      <div className="space-y-4">
        {leads.map((lead) => (
          <div key={lead._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
            
            {/* Lead Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-slate-900">{lead.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
                  lead.type === 'Quote Request' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {lead.type}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase border ${
                  lead.status === 'New' ? 'bg-red-50 text-red-600 border-red-100' :
                  lead.status === 'Contacted' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                  'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                  {lead.status}
                </span>
              </div>

              <div className="flex flex-col gap-1 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {lead.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(lead.createdAt)}
                </div>
              </div>

              {/* Items List (If Quote) */}
              {lead.items && lead.items.length > 0 && (
                <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                    <ShoppingBag className="w-3 h-3" /> Requested Items:
                  </p>
                  <ul className="list-disc list-inside text-sm text-slate-700">
                    {lead.items.map((item, idx) => (
                      <li key={idx}>{item.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex md:flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
              <p className="text-xs font-bold text-slate-400 uppercase text-center md:text-left mb-1">Set Status:</p>
              
              <button 
                onClick={() => updateStatus(lead._id, 'Contacted')}
                disabled={lead.status === 'Contacted'}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:opacity-50 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Contacted
              </button>

              <button 
                onClick={() => updateStatus(lead._id, 'Closed')}
                disabled={lead.status === 'Closed'}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 transition-colors"
              >
                <Check className="w-4 h-4" /> Closed
              </button>
              
              <button 
                onClick={() => deleteLead(lead._id)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors mt-auto"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>

          </div>
        ))}

        {!isLoading && leads.length === 0 && (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-xl text-slate-500">
            No active leads found.
          </div>
        )}
      </div>
    </div>
  );
}