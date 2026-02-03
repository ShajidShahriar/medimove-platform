import { Truck, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer  id='contact' className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1.5 rounded-md">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                MediMove <span className="text-slate-500 font-normal">Int.</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Bangladesh's premier medical equipment logistics partner. We bridge the gap between global manufacturers and local healthcare providers.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li><a href="#" className="hover:text-primary transition-colors">Catalog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Service & Repair</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Rental Agreements</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Supply</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Warranty Info</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div 
            id="contact-section" 
            className="transition-all duration-1000 ease-in-out p-4 rounded-xl -m-4 border border-transparent"
          >
            <h4 className="font-bold text-slate-900 mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <span>37 Bir-uttam,hatirpool,<br/>Dhaka-1213, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <span>+880 1712222046</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <span>sales@medimove.com.bd</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; 2025 MediMove International. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-slate-800">Staff Login</span>
            <span className="cursor-pointer hover:text-slate-800">Sitemap</span>
          </div>
        </div>

      </div>
    </footer>
  );
}