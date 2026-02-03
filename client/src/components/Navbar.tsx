import React, { useEffect } from 'react';
import SearchOverlay from './SearchOverlay';
import { Truck, Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false); 
  const { items, toggleCart } = useCart();

  // Define the links
  const navLinks = [
    { name: 'Catalog', target: 'catalog' },
    { name: 'Rentals', target: 'contact' },
    { name: 'Service & Repair', target: 'contact' },
    { name: 'About Us', target: 'coming-soon' },
  ];

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleNavClick = (target: string) => {
    setIsMenuOpen(false); // Always close mobile menu

    // Check for special "Coming Soon" case
    if (target === 'coming-soon') {
      toast.info("Company Profile & CEO Message coming soon!");
      return;
    }

    // Normal Scroll Logic
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Section */}
            <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="bg-primary p-1.5 rounded-md">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-primary tracking-tight">
                MediMove <span className="text-slate-500 font-normal text-lg">Int.</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((item) => (
                <button 
                  key={item.name} 
                  onClick={() => handleNavClick(item.target)}
                  className="text-sm font-medium text-slate-600 hover:text-primary transition-colors focus:outline-none"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Right Action Section */}
            <div className="hidden md:flex items-center gap-6">
              <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="text-slate-400 hover:text-primary transition-colors hover:bg-slate-50 p-2 rounded-full"
                >
                  <Search className="h-5 w-5" />
                </button>
                
              <div onClick={toggleCart} className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer hover:text-primary transition-colors bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-full">
                <div className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {items.length}
                    </span>
                  )}
                </div>
                <span className="text-sm">Quote Cart</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 hover:text-primary"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.target)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50"
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 pb-2 border-t border-slate-100">
                <div 
                  onClick={() => { toggleCart(); setIsMenuOpen(false); }}
                  className="flex items-center px-3 py-2 text-slate-700 font-bold cursor-pointer hover:bg-slate-50"
                >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Quote Cart ({items.length})
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}