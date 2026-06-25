import React from 'react';
import { Phone, Mail, MapPin, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-inner">
              CR
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">Chhotan Ram</div>
              <div className="text-[10px] text-blue-600 -mt-1 font-medium">CONSTRUCTION</div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            <button onClick={() => scrollToSection('services')} className="hover:text-blue-600 transition-colors">Services</button>
            <button onClick={() => scrollToSection('packages')} className="hover:text-blue-600 transition-colors">Packages</button>
            <button onClick={() => scrollToSection('calculator')} className="hover:text-blue-600 transition-colors">Estimate Calculator</button>
            <button onClick={() => scrollToSection('gallery')} className="hover:text-blue-600 transition-colors">Our Projects</button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-blue-600 transition-colors">Reviews</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-blue-600 transition-colors">Contact</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+919876543210" className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl text-sm font-medium transition-all active:scale-95">
              <Phone size={18} />
              <span>Call Now</span>
            </a>
            <a 
              href="https://wa.me/919876543210" 
              target="_blank"
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-2xl text-sm font-medium hover:bg-green-700 transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.485-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.355l-.14-.083-3.434 1.135.001-.002 3.627-2.396-.002-.001a9.89 9.89 0 01-1.494-5.28c0-5.448 4.434-9.87 9.89-9.87 2.64 0 5.122 1.03 6.986 2.894a9.825 9.825 0 012.893 6.986c0 5.448-4.434 9.87-9.89 9.87z"/></svg>
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-6 px-6 shadow-xl">
          <div className="flex flex-col gap-6 text-lg">
            <button onClick={() => scrollToSection('services')} className="text-left py-1">Our Services</button>
            <button onClick={() => scrollToSection('packages')} className="text-left py-1">Packages</button>
            <button onClick={() => scrollToSection('calculator')} className="text-left py-1">Free Estimate</button>
            <button onClick={() => scrollToSection('gallery')} className="text-left py-1">Gallery</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-left py-1">Client Reviews</button>
            <button onClick={() => scrollToSection('contact')} className="text-left py-1">Get In Touch</button>
            
            <div className="pt-4 border-t flex flex-col gap-4">
              <a href="tel:+919876543210" className="flex items-center justify-center gap-3 py-4 bg-blue-50 text-blue-700 rounded-3xl font-medium">
                <Phone /> +91 98765 43210
              </a>
              <a href="https://wa.me/919876543210" target="_blank" className="flex items-center justify-center gap-3 py-4 bg-[#25D366] text-white rounded-3xl font-medium">
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;