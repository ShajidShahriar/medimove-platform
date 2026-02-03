import { Scan, HeartPulse, Stethoscope, BedDouble } from 'lucide-react';
import { Link } from 'react-router-dom';

const departments = [
  { 
    name: 'Radiology', 
    icon: Scan, 
    desc: 'MRI, CT Scan, X-Ray, and Ultrasound systems.' 
  },
  { 
    name: 'ICU', 
    icon: HeartPulse, 
    desc: 'Ventilators, Patient Monitors, and Defibrillators.' 
  },
  { 
    name: 'OT', 
    icon: Stethoscope, 
    desc: 'Anesthesia Machines, OT Lights, and Surgical Tables.' 
  },
  { 
    name: 'Furniture', 
    icon: BedDouble, 
    desc: 'Electric Beds, Stretchers, and Medical Trolleys.' 
  },
];

export default function DepartmentGrid() {
  return (

    <section id="catalog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl tracking-tight">
            Explore Solutions by Department
          </h2>
          <div className="h-1 w-20 bg-accent mx-auto mt-4 rounded-full"></div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {departments.map((dept) => (
            // WRAP IN LINK
            <Link 
              to={`/category/${dept.name}`} 
              key={dept.name} 
              className="block group relative bg-white ..." // Added "block" to make link behave like div
            >
              {/* ... content stays same ... */}
               <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-primary transition-colors duration-300" />

              <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                <dept.icon className="h-7 w-7 text-slate-600 group-hover:text-white transition-colors duration-300" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {dept.name}
              </h3>
              
              <p className="text-slate-500 text-sm leading-relaxed">
                {dept.desc}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}