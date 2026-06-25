import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import house1 from '../assets/house1.jpg';
import house2 from '../assets/house2.jpg';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-amber-50 pt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center min-h-[640px]">
        <div className="pt-12 md:pt-0">
          <div className="inline-flex items-center gap-2 bg-white rounded-3xl px-5 py-2 shadow text-sm mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-emerald-700">25+ Years of Excellence in Patna</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold leading-none tracking-tighter text-gray-900 mb-6">
            Building Your<br />Dream Home<br />With Trust
          </h1>
          
          <p className="text-xl text-gray-600 max-w-md mb-10">
            Chhotan Ram Construction — Your reliable partner for quality residential construction in Patna, Bihar. 
            Honest pricing. Timely delivery.
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 transition-all text-white px-10 py-4 rounded-3xl text-lg font-semibold shadow-lg shadow-blue-200 active:scale-[0.97]"
            >
              Get Free Estimate
              <ArrowRight />
            </button>
            
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-3 border-2 border-gray-800 hover:bg-gray-900 hover:text-white transition-all px-8 py-4 rounded-3xl text-lg font-semibold"
            >
              Speak to Us
            </button>
          </div>

          <div className="mt-16 flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-emerald-500" />
              <div>
                <div className="font-semibold">400+</div>
                <div className="text-gray-500 text-xs">Homes Built</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-emerald-500" />
              <div>
                <div className="font-semibold">98%</div>
                <div className="text-gray-500 text-xs">Client Retention</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="absolute -left-6 -top-6 bg-white p-3 rounded-3xl shadow-xl z-10">
            <img src={house1} alt="Modern House" className="w-64 h-64 object-cover rounded-3xl" />
          </div>
          <div className="absolute -right-4 bottom-12 bg-white p-3 rounded-3xl shadow-2xl">
            <img src={house2} alt="Family Home" className="w-80 h-80 object-cover rounded-3xl" />
          </div>
          <div className="w-96 h-96 bg-gradient-to-br from-blue-100 to-amber-100 rounded-[4rem] -rotate-12 absolute right-8 top-8"></div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-white border-t py-5 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-x-12 gap-y-4 opacity-75 text-sm">
          <div className="flex items-center gap-2"><span className="font-mono text-xl">★</span> ISO Certified</div>
          <div>Bihar Govt Licensed</div>
          <div>100% Material Transparency</div>
          <div>5 Year Structural Warranty</div>
        </div>
      </div>
    </div>
  );
};

export default Hero;