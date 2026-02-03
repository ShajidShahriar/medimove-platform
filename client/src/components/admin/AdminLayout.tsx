import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Package, Users, LogOut, Truck } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. SECURITY CHECK (The Bouncer)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Session expired. Please login.');
      navigate('/admin/login');
    }
  }, [navigate]);

  // 2. LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  // Helper for active link styling
  const isActive = (path: string) => location.pathname === path;
  const linkClass = (path: string) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium
    ${isActive(path) 
      ? 'bg-primary text-white shadow-md' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }
  `;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* SIDEBAR (Fixed Left) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10">
        
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <Truck className="h-6 w-6 text-primary mr-2" />
          <span className="text-xl font-bold tracking-tight">Admin<span className="text-primary">Panel</span></span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          
          <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </Link>

          <Link to="/admin/products" className={linkClass('/admin/products')}>
            <Package className="w-5 h-5" />
            Inventory
          </Link>

          <Link to="/admin/leads" className={linkClass('/admin/leads')}>
            <Users className="w-5 h-5" />
            Leads & Quotes
          </Link>

        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT (Scrollable Right) */}
      <main className="flex-1 ml-64 p-8">
        {/* <Outlet> is where the child pages (Dashboard, Products) will render */}
        <Outlet />
      </main>

    </div>
  );
}