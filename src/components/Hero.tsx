import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import house1 from '../assets/house1.jpg';
import house2 from '../assets/house2.jpg';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-amber-50 pt-16 overflow-hidden">
      {/* grid-cols-1 (मोबाइल के लिए 1 कॉलम) और md:grid-cols-2 (लैपटॉप के लिए 2 कॉलम) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[550px] md:min-h-[640px]">
        
        {/* टेक्स्ट सेक्शन - मोबाइल पर पैडिंग कम की गई */}
        <div className="pt-6 md:pt-0 text-center md:text-left flex flex-col items-center md:items-start">
          
          {/* लाइव टैग - मोबाइल पर टेक्स्ट रैप न हो इसलिए text-xs sm:text-sm सेट किया */}
          <div className="inline-flex items-center gap-2 bg-white rounded-3xl px-4 py-2 shadow text-xs sm:text-sm mb-4 md:mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-emerald-700">25+ Years of Excellence in Patna</span>
          </div>
          
          {/* हेडिंग - मोबाइल के लिए text-4xl और लैपटॉप के लिए text-6xl/7xl किया ताकि स्क्रीन से बाहर न भागे */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight md:leading-none tracking-tighter text-gray-900 mb-4 md:mb-6">
            Building Your<br />Dream Home<br />With Trust
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-md mb-6 md:mb-10">
            Chhotan Ram Construction — Your reliable partner for quality residential construction in Patna, Bihar. 
            Honest pricing. Timely delivery.
          </p>

          {/* बटन्स - मोबाइल पर एक के नीचे एक या बराबर में फ्लेक्सिबल रहेंगे */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <button 
              onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 transition-all text-white px-6 sm:px-10 py-3 sm:py-4 rounded-3xl text-base sm:text-lg font-semibold shadow-lg shadow-blue-200 active:scale-[0.97] w-full sm:w-auto"
            >
              Get Free Estimate
              <ArrowRight className="w-5 h-5 shrink-0" />
            </button>
            
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center gap-3 border-2 border-gray-800 hover:bg-gray-900 hover:text-white transition-all px-6 sm:px-8 py-3 sm:py-4 rounded-3xl text-base sm:text-lg font-semibold w-full sm:w-auto"
            >
              Speak to Us
            </button>
          </div>

          {/* स्टैट्स काउंट - मोबाइल पर साइड-बाय-साइड दिखने के लिए flex-row रखा */}
          <div className="mt-8 md:mt-16 flex flex-row items-center justify-center md:justify-start gap-6 sm:gap-8 text-sm w-full md:w-auto">
            <div className="flex items-center gap-2 text-left">
              <CheckCircle className="text-emerald-500 w-5 h-5 shrink-0" />
              <div>
                <div className="font-semibold text-base">400+</div>
                <div className="text-gray-500 text-xs">Homes Built</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-left">
              <CheckCircle className="text-emerald-500 w-5 h-5 shrink-0" />
              <div>
                <div className="font-semibold text-base">98%</div>
                <div className="text-gray-500 text-xs">Client Retention</div>
              </div>
            </div>
          </div>
        </div>

        {/* राइट साइड इमेज सेक्शन - यह मोबाइल पर पूरी तरह छिपेगा और लैपटॉप पर दिखेगा */}
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

      {/* बॉटम ट्रस्ट बार - मोबाइल पर स्क्रॉल या रैप होने के लिए flex-wrap और text-center सेट किया */}
      <div className="bg-white border-t py-4 md:py-5 mt-8 md:mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-12 gap-y-3 opacity-75 text-xs sm:text-sm text-center">
          <div className="flex items-center gap-1"><span className="text-amber-500">★</span> ISO Certified</div>
          <div>Bihar Govt Licensed</div>
          <div>100% Material Transparency</div>
          <div>5 Year Structural Warranty</div>
        </div>
      </div>
    </div>
  );
};

export default Hero;