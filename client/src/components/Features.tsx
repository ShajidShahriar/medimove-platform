import { Truck, Wrench, PackageCheck } from 'lucide-react';

const features = [
  {
    title: "Rapid Deployment",
    description: "Import and manage logistics with our own fleet and warehouse for record-time delivery.",
    icon: Truck
  },
  {
    title: "Biomedical Support",
    description: "Our in-house engineering team provides installation, calibration, and 24/7 repair support.",
    icon: Wrench
  },
  {
    title: "Ready Stock",
    description: "Largest inventory in Dhaka. We stock critical ICU and OT equipment for immediate dispatch.",
    icon: PackageCheck
  }
];

export default function Features() {
  return (
    <section id='about' className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            The MediMove Difference
          </h2>
          <div className="h-1 w-16 bg-accent mx-auto mt-4 rounded-full" />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              
              {/* Icon Circle */}
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-6 text-primary border border-slate-100">
                <feature.icon className="h-10 w-10" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
