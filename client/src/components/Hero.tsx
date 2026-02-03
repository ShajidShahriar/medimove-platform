import { ArrowRight, Wrench } from 'lucide-react';

export default function Hero() {
   const scrollToCatalog = () => {
    const section = document.getElementById('catalog');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const section = document.getElementById('contact-section');
    if (section) {
      // 1. Scroll to it
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // 2. Add the "Flash" effect classes
      // We add a blue background and a ring outline
      section.classList.add('bg-blue-100', 'ring-2', 'ring-primary', 'shadow-lg');

      // 3. Remove them after 2 seconds (Fade out)
      setTimeout(() => {
        section.classList.remove('bg-blue-100', 'ring-2', 'ring-primary', 'shadow-lg');
      }, 2000);
    }
  };

  return (
    <div 
      className="relative bg-primary bg-fixed bg-cover  h-[650px]"
      style={{ 
        // This connects to your local image in the public folder
        backgroundImage: `url('/hero-bg.jpg')` ,
        backgroundPosition: 'center 60%' 
      }}
    >
      {/* 
        Dark Overlay 
        - We use 'absolute inset-0' to cover the whole image
        - 'bg-slate-900/80' gives it that deep blue professional tint
      */}
      <div className="absolute inset-0 bg-slate-900/80 mix-blend-multiply" />
      
      {/* Optional Gradient for extra readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent opacity-90" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <div className="max-w-2xl pt-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Medical Logistics. <br/>
            <span className="text-accent">Modernized.</span>
          </h1>
          
          <p className="mt-6 text-lg text-slate-200 leading-relaxed drop-shadow-md">
            Sourcing world-class Radiology, ICU, and Surgical equipment for Bangladesh's top hospitals. From warehouse to patient care in record time.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button onClick={scrollToCatalog}
            className="bg-accent hover:bg-sky-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center gap-2 shadow-lg shadow-sky-900/20 transform hover:-translate-y-1">
              Browse Equipment
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <button onClick={scrollToContact}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center gap-2 transform hover:-translate-y-1">
              <Wrench className="h-5 w-5" />
              Book a Repair
            </button>
          </div>
        </div>
      </div>

      {/* Brand Strip */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white border-b border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Authorized Distributor & Service Partner For:
          </span>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {['GE Healthcare', 'Siemens', 'Philips', 'Mindray', 'Samsung'].map((brand) => (
              <span key={brand} className="text-xl font-bold text-slate-700 font-serif cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}