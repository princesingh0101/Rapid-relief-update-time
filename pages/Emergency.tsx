import React from 'react';
import Button from '../components/Button';
import { PhoneCall, MapPin, Truck, AlertTriangle, HeartPulse } from 'lucide-react';

const Emergency: React.FC = () => {
  return (
    <div className="min-h-screen bg-red-50">
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        
        <div className="mb-8 inline-block p-4 bg-red-100 rounded-full animate-pulse">
           <AlertTriangle size={48} className="text-red-600" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
          Emergency Medical SOS
        </h1>
        <p className="text-lg text-slate-600 mb-12">
          Use this for urgent medical supplies. Deliveries are prioritized above all else. <br/>
          <strong>Arrives in 10-15 Minutes.</strong>
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Quick Action Card 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500 text-left">
            <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
              <HeartPulse className="text-red-500" /> First Aid Kits
            </h3>
            <p className="text-sm text-slate-500 mb-4">Complete trauma kits, bandages, antiseptics.</p>
            <Button variant="danger" size="sm" className="w-full">Order Now</Button>
          </div>

          {/* Quick Action Card 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500 text-left">
            <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
              <PhoneCall className="text-red-500" /> Ambulance Support
            </h3>
            <p className="text-sm text-slate-500 mb-4">Connect to nearest ambulance service immediately.</p>
            <Button variant="outline" size="sm" className="w-full border-red-500 text-red-500 hover:bg-red-50">Call 108 Now</Button>
          </div>
        </div>

        {/* Location Detection Mock */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm inline-flex items-center gap-4 border border-red-100">
           <div className="bg-blue-100 p-2 rounded-full text-blue-600">
             <MapPin size={24} />
           </div>
           <div className="text-left">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Delivering To</p>
             <p className="font-semibold text-slate-900">Current Location (Detected via GPS)</p>
           </div>
           <div className="h-8 w-px bg-slate-200 mx-2"></div>
           <div className="text-left">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">ETA</p>
             <p className="font-bold text-red-600 flex items-center gap-1"><Truck size={14}/> 8 Mins</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Emergency;