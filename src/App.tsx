import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Home, Hammer, Calculator as CalcIcon, Image, Star, Send, Edit, Trash2, LogOut, Menu, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Inquiry {
  id?: number | string;
  _id?: string;
  name: string;
  phone: string;
  service: string;
  message: string;
  date?: string;
  createdAt?: string;
}

interface Feedback {
  id: number;
  name: string;
  rating: number;
  comment: string;
  approved: boolean;
  date: string;
}

interface GalleryItem {
  id: number;
  url: string;
  caption: string;
  category: string;
}

const API_BASE = '/api'; // Works on Vercel (same deployment) or change to your backend URL

const App: React.FC = () => {
  const [currentRate, setCurrentRate] = useState(1850);
  const [loading, setLoading] = useState(false);
  const [area, setArea] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [newRate, setNewRate] = useState(currentRate);
  const [newGalleryCaption, setNewGalleryCaption] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState('completed');
  const [showAddGallery, setShowAddGallery] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', service: 'With Material', message: '' });
  const [feedbackForm, setFeedbackForm] = useState({ name: '', rating: 5, comment: '' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('With Material');

  // Fetch data from MongoDB Backend
  useEffect(() => {
    fetchRate();
    fetchGallery();
    fetchApprovedFeedbacks();
  }, []);

  const fetchRate = async () => {
    try {
      const res = await fetch(`${API_BASE}/rate`);
      const data = await res.json();
      if (data.value) {
        setCurrentRate(data.value);
        setNewRate(data.value);
      }
    } catch (err) {
      console.log('Using default rate (backend not connected)');
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_BASE}/gallery`);
      const data = await res.json();
      setGalleryItems(data.map((item: any) => ({
        id: item._id || item.id,
        url: item.url,
        caption: item.caption,
        category: item.category
      })));
    } catch (err) {
      console.log('Using demo gallery');
      setGalleryItems([
        { id: 1, url: '/images/house1.jpg', caption: '2-Story Modern Villa - Patna', category: 'completed' },
        { id: 2, url: '/images/project1.jpg', caption: 'Ongoing Construction Project', category: 'ongoing' },
        { id: 3, url: '/images/house2.jpg', caption: 'Luxury Bungalow with Garden', category: 'completed' }
      ]);
    }
  };

  const fetchApprovedFeedbacks = async () => {
    try {
      const res = await fetch(`${API_BASE}/feedback`);
      const data = await res.json();
      setFeedbacks(data.map((f: any) => ({
        id: f._id,
        name: f.name,
        rating: f.rating,
        comment: f.comment,
        approved: f.approved,
        date: f.createdAt ? f.createdAt.split('T')[0] : '2025-01-01'
      })));
    } catch (err) {
      console.log('Using demo feedbacks');
    }
  };

  const calculateEstimate = () => {
    if (!area || isNaN(parseFloat(area))) {
      toast.error('Please enter a valid area in sq.ft');
      return;
    }
    const cost = Math.round(parseFloat(area) * currentRate);
    setEstimatedCost(cost);
    toast.success(`Estimate of ₹${cost.toLocaleString('en-IN')} calculated using live MongoDB rate!`);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone || !contactForm.message) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactForm.name,
          phone: contactForm.phone,
          email: contactForm.email,
          service: contactForm.service,
          message: contactForm.message
        })
      });

      if (res.ok) {
        toast.success('Inquiry saved to MongoDB! Our team will contact you soon.');
        setContactForm({ name: '', phone: '', email: '', service: 'With Material', message: '' });
      } else {
        toast.error('Failed to submit. Backend may not be running.');
      }
    } catch (err) {
      toast.success('Inquiry received (Demo Mode - MongoDB not connected)');
      setContactForm({ name: '', phone: '', email: '', service: 'With Material', message: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.name || !feedbackForm.comment) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: feedbackForm.name,
          rating: feedbackForm.rating,
          comment: feedbackForm.comment,
          approved: false
        })
      });

      if (res.ok) {
        toast.success('Thank you! Feedback saved to MongoDB and awaiting admin approval.');
        setFeedbackForm({ name: '', rating: 5, comment: '' });
        fetchApprovedFeedbacks();
      } else {
        toast.error('Failed to submit feedback.');
      }
    } catch (err) {
      toast.success('Feedback received (Demo Mode)');
      setFeedbackForm({ name: '', rating: 5, comment: '' });
    } finally {
      setLoading(false);
    }
  };

  const approveFeedback = async (id: number | string) => {
    try {
      await fetch(`${API_BASE}/feedback/${id}/approve`, { method: 'PUT' });
      setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, approved: true } : f));
      toast.success('Feedback approved in MongoDB and now visible!');
      fetchApprovedFeedbacks();
    } catch (err) {
      setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, approved: true } : f));
      toast.success('Feedback approved (Demo Mode)');
    }
  };

  const deleteFeedback = async (id: number | string) => {
    try {
      await fetch(`${API_BASE}/feedback/${id}`, { method: 'DELETE' });
      setFeedbacks(feedbacks.filter(f => f.id !== id));
      toast.success('Feedback deleted from MongoDB');
    } catch (err) {
      setFeedbacks(feedbacks.filter(f => f.id !== id));
      toast.success('Feedback deleted (Demo Mode)');
    }
  };

  const updateRate = async () => {
    if (newRate < 1000 || newRate > 5000) {
      toast.error('Rate must be between ₹1000 - ₹5000');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/rate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newRate })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentRate(data.value || newRate);
        toast.success('Rate updated in MongoDB successfully!');
      }
    } catch (err) {
      setCurrentRate(newRate);
      toast.success('Rate updated (Demo Mode - MongoDB not connected)');
    }
  };

  const addToGallery = async () => {
    if (!newGalleryCaption) {
      toast.error('Please enter a caption');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: '/images/house1.jpg',
          caption: newGalleryCaption,
          category: newGalleryCategory
        })
      });
      if (res.ok) {
        const newItem = await res.json();
        setGalleryItems([{
          id: newItem._id || Date.now(),
          url: newItem.url,
          caption: newItem.caption,
          category: newItem.category
        }, ...galleryItems]);
        toast.success('New project saved to MongoDB Gallery!');
      }
    } catch (err) {
      const newItem: GalleryItem = {
        id: Date.now(),
        url: '/images/house1.jpg',
        caption: newGalleryCaption,
        category: newGalleryCategory
      };
      setGalleryItems([newItem, ...galleryItems]);
      toast.success('Project added (Demo Mode)');
    }
    setNewGalleryCaption('');
    setShowAddGallery(false);
  };

  const deleteGalleryItem = async (id: number | string) => {
    try {
      await fetch(`${API_BASE}/gallery/${id}`, { method: 'DELETE' });
      setGalleryItems(galleryItems.filter(item => item.id !== id));
      toast.success('Project deleted from MongoDB');
    } catch (err) {
      setGalleryItems(galleryItems.filter(item => item.id !== id));
      toast.success('Project removed (Demo Mode)');
    }
  };

  const handleAdminLogin = () => {
    if (adminEmail.toLowerCase() === 'admin@chhotanram.com' && adminPassword === 'admin123') {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      setAdminEmail('');
      setAdminPassword('');
      setAdminLoginError('');
      toast.success('Successfully logged in to Admin Panel');
    } else {
      setAdminLoginError('Invalid email or password. Use admin@chhotanram.com and password: admin123');
    }
  };



  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    toast.success('Logged out successfully');
  };

  const approvedFeedbacks = feedbacks.filter(f => f.approved);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
      <Toaster position="top-right" />

      {/* NAVBAR */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 text-white w-11 h-11 flex items-center justify-center rounded-2xl text-3xl font-bold">CR</div>
              <div>
                <div className="text-3xl font-bold tracking-tighter">Chhotan Ram</div>
                <p className="text-[10px] text-blue-600 -mt-1 font-semibold">CONSTRUCTION • PATNA</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <button onClick={() => scrollToSection('services')} className="hover:text-blue-600 transition">Services</button>
              <button onClick={() => scrollToSection('packages')} className="hover:text-blue-600 transition">Packages</button>
              <button onClick={() => scrollToSection('calculator')} className="hover:text-blue-600 transition">Calculator</button>
              <button onClick={() => scrollToSection('gallery')} className="hover:text-blue-600 transition">Projects</button>
              <button onClick={() => scrollToSection('testimonials')} className="hover:text-blue-600 transition">Reviews</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-blue-600 transition">Contact</button>
            </div>

            <div className="flex items-center gap-4">
              <a href="tel:919525185568" className="hidden sm:flex items-center gap-2 px-6 py-3 bg-blue-50 rounded-3xl text-blue-700 hover:bg-blue-100 text-sm font-medium">
                <Phone size={18} /> +91 95251 85568
              </a>
              <a href="https://wa.me/919525185568" target="_blank" className="hidden sm:flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-3xl text-sm font-medium">
                <MessageCircle size={18} /> WhatsApp
              </a>
              <button 
                onClick={() => {
                  setShowAdminLogin(true);
                  setAdminLoginError('');
                }} 
                className="px-5 py-2 text-xs border border-gray-300 rounded-2xl hover:bg-gray-100 font-medium"
              >
                ADMIN LOGIN
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white px-6 py-8 border-t text-lg flex flex-col gap-6">
            {['services', 'packages', 'calculator', 'gallery', 'testimonials', 'contact'].map(section => (
              <button key={section} onClick={() => scrollToSection(section)} className="text-left capitalize">
                {section === 'calculator' ? 'Free Estimate' : section}
              </button>
            ))}
            <div className="pt-6 border-t flex flex-col gap-4">
              <a href="tel:919525185568" className="flex justify-center py-4 bg-blue-600 text-white rounded-3xl">Call +91 95251 85568</a>
            </div>
          </div>
        )}
      </nav>

      {/* FLOATING BUTTONS */}
      <a href="https://wa.me/919525185568" target="_blank" className="floating-btn whatsapp-btn text-white">
        <MessageCircle size={28} />
      </a>
      <a href="tel:919525185568" className="floating-btn phone-btn text-white">
        <Phone size={28} />
      </a>

      {/* HERO */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7">
            <div className="uppercase tracking-[3px] text-blue-600 text-sm font-medium mb-3">EST. 1998 • PATNA, BIHAR</div>
            <h1 className="text-6xl md:text-[68px] leading-none font-semibold text-gray-900 mb-6">Quality Homes.<br />Built with Trust.</h1>
            <p className="max-w-lg text-lg text-gray-600">Chhotan Ram Construction delivers reliable residential construction services across Patna. From planning to finishing — we handle everything with transparency.</p>
            
            <div className="flex gap-4 mt-10">
              <button onClick={() => scrollToSection('calculator')} className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl flex items-center gap-3 font-semibold text-lg shadow-xl shadow-blue-300">
                <CalcIcon /> FREE ESTIMATE
              </button>
              <button onClick={() => scrollToSection('contact')} className="px-8 py-4 border-2 border-gray-900 rounded-3xl font-semibold flex items-center gap-2 hover:bg-gray-900 hover:text-white transition-all">Get In Touch</button>
            </div>
          </div>
          
          <div className="md:col-span-5 relative">
            <img src="/images/house1.jpg" alt="Beautiful Home in Patna" className="rounded-3xl shadow-2xl" />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl max-w-[210px]">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-semibold text-emerald-500">400+</div>
                <div className="text-sm leading-tight">Happy families<br />living in our homes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-3xl">OUR EXPERTISE</div>
            <h2 className="section-heading text-5xl font-semibold mt-4">Construction Services</h2>
            <p className="mt-4 text-gray-600 max-w-md mx-auto">We offer three flexible options tailored for residential projects in Bihar</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "With Material", icon: Home, desc: "Complete turnkey solution. We procure all materials and construct your home end-to-end.", color: "blue" },
              { title: "Without Material", icon: Hammer, desc: "You supply the materials. We provide expert labour and project management.", color: "amber" },
              { title: "Remodeling", icon: Edit, desc: "Renovate, upgrade or expand your existing home with modern design and finishes.", color: "emerald" }
            ].map((service, index) => (
              <div 
                key={index}
                onClick={() => setSelectedService(service.title)}
                className={`group p-10 border-2 rounded-3xl transition-all cursor-pointer hover:-translate-y-2 ${selectedService === service.title ? 'border-blue-600 shadow-2xl' : 'border-transparent hover:border-gray-200'}`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-${service.color}-100 flex items-center justify-center mb-8 group-hover:scale-110 transition`}>
                  <service.icon className={`w-9 h-9 text-${service.color}-600`} />
                </div>
                <h3 className="text-3xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
                <div className="mt-8 text-xs uppercase tracking-widest font-medium text-gray-400">STARTING @ ₹1650/sqft</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-heading text-5xl font-semibold">With Material Packages</h2>
            <p className="mt-3 text-lg text-gray-600">Choose the tier that suits your budget and requirements</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Basic", price: "₹1,650", features: ["Standard bricks & cement", "Basic electrical & plumbing", "Vitrified tile flooring", "1 year warranty"], popular: false },
              { name: "Standard", price: "₹2,150", features: ["Premium materials", "Modular kitchen sink", "Branded bathroom fittings", "2 years warranty", "POP ceiling"], popular: true },
              { name: "Premium", price: "₹2,950", features: ["Luxury Italian marble", "Smart home ready wiring", "Designer elevation", "3 years comprehensive warranty", "Landscaping"], popular: false }
            ].map((pkg, i) => (
              <div key={i} className={`bg-white rounded-3xl p-8 border ${pkg.popular ? 'border-blue-500 shadow-2xl relative' : 'border-gray-100'} h-full flex flex-col`}>
                {pkg.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs tracking-widest px-8 py-1 rounded-3xl">MOST POPULAR</div>}
                
                <div className="text-center mb-8">
                  <div className="text-4xl font-semibold">{pkg.name}</div>
                  <div className="text-5xl font-bold text-blue-600 mt-3">{pkg.price}<span className="text-base align-super font-normal text-gray-400">/sqft</span></div>
                </div>
                
                <ul className="space-y-4 mb-12 flex-1">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600">
                      <div className="mt-1.5 w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button onClick={() => scrollToSection('contact')} className="mt-auto w-full py-4 border border-gray-300 hover:bg-gray-50 transition rounded-2xl text-sm font-semibold">CHOOSE THIS PACKAGE</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COST CALCULATOR */}
      <section id="calculator" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="px-6 py-2 bg-amber-100 text-amber-700 rounded-3xl text-sm font-medium flex items-center gap-2">
                <CalcIcon className="w-4 h-4" /> INSTANT ESTIMATE
              </div>
            </div>
            <h2 className="text-5xl font-semibold tracking-tight">Free Calculate Estimate Your House</h2>
            <p className="mt-4 text-gray-600">Enter built-up area to get an approximate cost. Rate is updated live from our database.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12">
            <div className="max-w-xs mx-auto">
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-500 mb-2">CURRENT RATE (₹ per sq.ft)</label>
                <div className="text-6xl font-bold tabular-nums text-blue-600">₹{currentRate}</div>
                <div className="text-xs text-emerald-600">Updated today • Admin controlled</div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-3 text-gray-500">BUILT-UP AREA (SQ.FT)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={area} 
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="1200" 
                      className="form-input w-full h-16 border-2 border-gray-200 focus:border-blue-400 rounded-3xl px-8 text-4xl font-light placeholder:text-gray-300" 
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 text-2xl">sqft</div>
                  </div>
                </div>

                <button 
                  onClick={calculateEstimate}
                  className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-3xl text-xl active:scale-[0.985] transition-all shadow-inner"
                >
                  CALCULATE ESTIMATE
                </button>

                {estimatedCost > 0 && (
                  <div className="bg-white border border-emerald-200 rounded-3xl p-8 text-center">
                    <div className="text-emerald-600 text-sm font-medium tracking-widest">YOUR ESTIMATED COST</div>
                    <div className="text-6xl font-semibold text-emerald-700 mt-3">₹{estimatedCost.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-gray-400 mt-2">This is an approximate figure. Final quote will be provided after site visit.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="uppercase text-blue-600 text-xs tracking-widest font-medium">PORTFOLIO</div>
              <h2 className="text-5xl font-semibold">Our Residential Projects</h2>
            </div>
            {isAdminLoggedIn && (
              <button onClick={() => setShowAddGallery(true)} className="flex items-center gap-2 bg-white border px-6 py-3.5 rounded-3xl text-sm font-medium">
                <Image size={18} /> ADD NEW PROJECT
              </button>
            )}
          </div>

          <div className="gallery-grid">
            {galleryItems.map(item => (
              <div key={item.id} className="gallery-item group">
                <img src={item.url} alt={item.caption} className="w-full" />
                <div className="gallery-overlay">
                  <div className="text-sm opacity-75">{item.category.toUpperCase()}</div>
                  <div className="font-medium text-lg leading-tight mt-1">{item.caption}</div>
                  {isAdminLoggedIn && (
                    <button onClick={() => deleteGalleryItem(item.id)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS / FEEDBACK */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-heading text-5xl font-semibold">What Our Clients Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {approvedFeedbacks.length > 0 ? approvedFeedbacks.slice(0, 3).map(feedback => (
              <div key={feedback.id} className="bg-slate-50 p-8 rounded-3xl">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < feedback.rating ? 'text-amber-400 fill-current' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="italic text-lg leading-relaxed text-gray-700">"{feedback.comment}"</p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center font-semibold text-sm"> {feedback.name[0]} </div>
                  <div>
                    <div className="font-medium">{feedback.name}</div>
                    <div className="text-xs text-gray-400">Patna Resident</div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12 text-gray-400">No approved reviews yet.</div>
            )}
          </div>

          {/* Feedback Form */}
          <div className="mt-20 max-w-xl mx-auto bg-white shadow rounded-3xl p-10">
            <h3 className="font-semibold text-2xl mb-8 text-center">Share Your Experience</h3>
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              <div>
                <input 
                  type="text" 
                  placeholder="Your full name" 
                  value={feedbackForm.name}
                  onChange={(e) => setFeedbackForm({...feedbackForm, name: e.target.value})}
                  className="form-input w-full border border-gray-200 focus:border-blue-400 rounded-2xl px-6 py-5" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs mb-3 text-gray-500">HOW WOULD YOU RATE US?</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(rating => (
                    <button 
                      key={rating} 
                      type="button"
                      onClick={() => setFeedbackForm({...feedbackForm, rating})}
                      className="star text-4xl transition-all hover:scale-110"
                    >
                      {rating <= feedbackForm.rating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
              <textarea 
                placeholder="Tell us about your experience with Chhotan Ram Construction..." 
                value={feedbackForm.comment}
                onChange={(e) => setFeedbackForm({...feedbackForm, comment: e.target.value})}
                className="form-input w-full border border-gray-200 focus:border-blue-400 rounded-3xl px-6 py-5 h-32 resize-y" 
                required
              ></textarea>
              <button type="submit" className="w-full py-5 bg-gray-900 hover:bg-black text-white font-medium rounded-3xl flex items-center justify-center gap-3">
                SUBMIT REVIEW <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CONTACT / INQUIRY FORM */}
      <section id="contact" className="py-20 bg-[#0a1428] text-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-5 gap-16">
          <div className="md:col-span-2">
            <div className="sticky top-28">
              <div className="uppercase text-blue-400 text-sm">HEAD OFFICE</div>
              <div className="text-4xl font-medium leading-none mt-5">Chhotan Ram Construction</div>
              <div className="mt-8 space-y-6 text-slate-300">
                <div className="flex gap-4">
                  <div className="w-6">📍</div>
                  <div>Tej Pratap Nagar, Beur,<br />Patna-2</div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6">☎</div>
                  <div>+91 95251 85568<br />+91 95251 85568</div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6">✉</div>
                  <div>ramchhotan63@gmail.com</div>
                </div>
              </div>
              <div className="mt-16 text-xs leading-loose text-slate-500">
                We respect your time.<br />
                All inquiries are responded within 4 hours during business days.
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <form onSubmit={handleContactSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl">
              <h3 className="text-3xl font-semibold mb-8">Send us an Inquiry</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <input type="text" placeholder="Full Name *" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} className="bg-white/10 border border-white/30 rounded-2xl px-7 py-6 placeholder:text-slate-400" required />
                <input type="tel" placeholder="Phone Number *" value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} className="bg-white/10 border border-white/30 rounded-2xl px-7 py-6 placeholder:text-slate-400" required />
              </div>
              
              <input type="email" placeholder="Email Address (optional)" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} className="mt-6 w-full bg-white/10 border border-white/30 rounded-2xl px-7 py-6 placeholder:text-slate-400" />
              
              <select value={contactForm.service} onChange={e => setContactForm({...contactForm, service: e.target.value})} className="mt-6 w-full bg-white/10 border border-white/30 rounded-2xl px-7 py-6 text-white">
                <option value="With Material">With Material</option>
                <option value="Without Material">Without Material</option>
                <option value="Remodeling">Remodeling / Renovation</option>
              </select>
              
              <textarea value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} placeholder="Tell us about your project..." rows={5} className="mt-6 w-full bg-white/10 border border-white/30 rounded-3xl px-7 py-6 placeholder:text-slate-400" required></textarea>
              
              <button type="submit" className="mt-8 w-full py-6 bg-white text-gray-900 font-semibold rounded-3xl flex items-center justify-center gap-3 hover:bg-amber-200">SEND INQUIRY <Send size={19} /></button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white/70 py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-y-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white text-gray-900 w-9 h-9 flex items-center justify-center text-4xl font-black rounded-2xl">CR</div>
              <div className="text-4xl font-semibold tracking-tighter">Chhotan Ram Construction</div>
            </div>
            <p className="mt-8 max-w-xs text-sm">Trusted name in residential construction since 1998. Delivering quality homes with honesty and dedication.</p>
            <div className="text-[10px] mt-16 opacity-40">© 2025 ALL RIGHTS RESERVED</div>
          </div>
          
          <div className="md:col-span-3 text-sm">
            <div className="uppercase text-white/40 text-xs mb-6">QUICK LINKS</div>
            <div className="space-y-4">
              <div onClick={() => scrollToSection('services')} className="cursor-pointer hover:text-white">Services</div>
              <div onClick={() => scrollToSection('packages')} className="cursor-pointer hover:text-white">Packages</div>
              <div onClick={() => scrollToSection('gallery')} className="cursor-pointer hover:text-white">Gallery</div>
            </div>
          </div>
          
          <div className="md:col-span-4">
            <div className="uppercase text-xs text-white/40 mb-5">OFFICE</div>
            <div className="text-sm leading-loose">
              Muzaffarpur Colony,<br />
              Rajendra Nagar,<br />
              Patna, Bihar - 800016<br /><br />
              +91 95251 85568
            </div>
            
            <div className="mt-16 text-xs text-white/30">Crafted with pride for the people of Bihar</div>
          </div>
        </div>
      </footer>

      {/* ADMIN LOGIN MODAL */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-md p-10 shadow-2xl modal">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-4xl mb-6">🔑</div>
              <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
              <p className="text-gray-500 mt-2">Only authorized personnel can access</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="admin@chhotanram.com"
                  value={adminEmail}
                  onChange={(e) => {
                    setAdminEmail(e.target.value);
                    setAdminLoginError('');
                  }}
                  className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setAdminLoginError('');
                  }}
                  className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>

              {adminLoginError && (
                <div className="text-red-600 text-sm text-center bg-red-50 py-3 rounded-2xl">
                  {adminLoginError}
                </div>
              )}

              <button
                onClick={handleAdminLogin}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl text-lg transition-all active:scale-95"
              >
                LOGIN TO ADMIN PANEL
              </button>

              <div className="text-center text-xs text-gray-400 mt-6">
                Demo Credentials:<br />
                <span className="font-mono text-blue-600">admin@chhotanram.com</span><br />
                Password: <span className="font-mono">admin123</span>
              </div>

              <button
                onClick={() => setShowAdminLogin(false)}
                className="w-full text-gray-500 hover:text-gray-700 text-sm py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN DASHBOARD */}
      {isAdminLoggedIn && (
        <div className="fixed inset-0 bg-black/90 z-[999] flex overflow-hidden">
          {/* Sidebar */}
          <div className="admin-sidebar w-72 text-white p-8 flex-shrink-0 overflow-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="text-2xl font-bold">Admin Portal</div>
                <div className="text-blue-200 text-sm">Chhotan Ram Construction</div>
              </div>
              <button onClick={adminLogout} className="p-2 hover:bg-white/10 rounded-xl transition">
                <LogOut size={24} />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'inquiries', label: 'Inquiries' },
                { id: 'rate', label: 'Rate Management' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'feedback', label: 'Feedback Management' }
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => setActiveAdminTab(item.id)}
                  className={`px-6 py-4 rounded-2xl cursor-pointer font-medium transition-all ${
                    activeAdminTab === item.id 
                      ? 'bg-white text-gray-900 shadow' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>

            <div className="absolute bottom-8 left-8 text-xs opacity-50">
              Logged in as<br />
              admin@chhotanram.com
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-gray-50 p-10 overflow-auto">
            <div className="max-w-6xl mx-auto">
              {activeAdminTab === 'dashboard' && (
                <div>
                  <h1 className="text-5xl font-bold text-gray-800 mb-2">Dashboard</h1>
                  <p className="text-gray-600">Overview of your construction business</p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
                    <div className="bg-white rounded-3xl p-8 shadow">
                      <div className="text-sm text-gray-500">TOTAL INQUIRIES</div>
                      <div className="text-6xl font-semibold text-blue-600 mt-4">{inquiries.length}</div>
                    </div>
                    <div className="bg-white rounded-3xl p-8 shadow">
                      <div className="text-sm text-gray-500">APPROVED REVIEWS</div>
                      <div className="text-6xl font-semibold text-emerald-600 mt-4">{approvedFeedbacks.length}</div>
                    </div>
                    <div className="bg-white rounded-3xl p-8 shadow">
                      <div className="text-sm text-gray-500">CURRENT RATE</div>
                      <div className="text-6xl font-semibold text-amber-600 mt-4">₹{currentRate}</div>
                    </div>
                    <div className="bg-white rounded-3xl p-8 shadow">
                      <div className="text-sm text-gray-500">GALLERY ITEMS</div>
                      <div className="text-6xl font-semibold text-purple-600 mt-4">{galleryItems.length}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other admin tabs remain the same */}
              {activeAdminTab === 'inquiries' && (
                <div>
                  <h2 className="text-4xl font-bold mb-8">Customer Inquiries</h2>
                  <div className="space-y-6">
                    {inquiries.length === 0 ? (
                      <p className="text-gray-500 text-center py-20">No inquiries yet.</p>
                    ) : (
                      inquiries.map(inq => (
                        <div key={inq.id || inq._id} className="bg-white border rounded-3xl p-8 flex gap-8">
                          <div className="flex-1">
                            <div className="font-semibold text-xl">{inq.name}</div>
                            <div className="text-sm text-gray-500">{inq.phone} • {inq.date || inq.createdAt}</div>
                            <div className="mt-6 text-gray-700">{inq.message}</div>
                          </div>
                          <div className="text-right">
                            <div className="inline-block px-5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mb-6">{inq.service}</div>
                            <button onClick={() => toast.success('Customer contacted')} className="text-sm border px-6 py-3 rounded-2xl hover:bg-gray-50">Mark Contacted</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeAdminTab === 'rate' && (
                <div className="max-w-lg mx-auto">
                  <h2 className="text-4xl font-bold mb-2">Update Construction Rate</h2>
                  <p className="text-gray-600 mb-10">This rate is used in the Cost Calculator on the website.</p>
                  
                  <div className="bg-white rounded-3xl p-12 border">
                    <div className="text-center mb-10">
                      <div className="text-sm text-gray-500">CURRENT RATE</div>
                      <div className="text-[110px] leading-none font-light text-blue-600">₹{currentRate}</div>
                    </div>
                    
                    <input
                      type="number"
                      value={newRate}
                      onChange={(e) => setNewRate(Number(e.target.value))}
                      className="w-full text-center text-7xl font-light border-b-4 border-gray-200 focus:border-blue-500 outline-none py-6"
                    />
                    
                    <button
                      onClick={updateRate}
                      className="mt-12 w-full py-5 bg-black text-white font-medium rounded-2xl text-lg hover:bg-gray-800 transition"
                    >
                      UPDATE RATE IN MONGODB
                    </button>
                  </div>
                </div>
              )}

              {activeAdminTab === 'gallery' && (
                <div>
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-4xl font-bold">Manage Gallery</h2>
                    <button 
                      onClick={() => setShowAddGallery(true)}
                      className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-3xl text-sm font-medium"
                    >
                      + Add New Project
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {galleryItems.map(item => (
                      <div key={item.id} className="bg-white rounded-3xl overflow-hidden border">
                        <img src={item.url} alt={item.caption} className="w-full h-64 object-cover" />
                        <div className="p-6">
                          <div className="uppercase text-xs text-gray-400">{item.category}</div>
                          <div className="font-medium mt-2 line-clamp-3">{item.caption}</div>
                          <button 
                            onClick={() => deleteGalleryItem(item.id)}
                            className="mt-6 text-red-600 text-sm flex items-center gap-2 hover:text-red-700"
                          >
                            <Trash2 size={16} /> Delete Project
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeAdminTab === 'feedback' && (
                <div>
                  <h2 className="text-4xl font-bold mb-8">Customer Feedback Management</h2>
                  <div className="space-y-6">
                    {feedbacks.length === 0 ? (
                      <p className="text-gray-500 py-20 text-center">No feedback submitted yet.</p>
                    ) : (
                      feedbacks.map(fb => (
                        <div key={fb.id} className={`bg-white border rounded-3xl p-8 ${fb.approved ? 'border-emerald-200 bg-emerald-50' : ''}`}>
                          <div className="flex justify-between">
                            <div>
                              <div className="font-semibold">{fb.name}</div>
                              <div className="flex gap-1 mt-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span key={i} className={i < fb.rating ? 'text-amber-400' : 'text-gray-200'}>★</span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right text-sm text-gray-400">
                              {fb.date}
                            </div>
                          </div>
                          <p className="mt-6 text-gray-700 italic">"{fb.comment}"</p>
                          
                          <div className="flex gap-4 mt-8">
                            {!fb.approved && (
                              <button 
                                onClick={() => approveFeedback(fb.id)}
                                className="px-8 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-medium"
                              >
                                Approve Feedback
                              </button>
                            )}
                            <button 
                              onClick={() => deleteFeedback(fb.id)}
                              className="px-8 py-3 border border-red-300 text-red-600 rounded-2xl text-sm font-medium hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD TO GALLERY MODAL */}
      {showAddGallery && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-lg w-full p-10 modal">
            <h3 className="text-3xl font-medium mb-8">Add New Project Photo</h3>
            
            <div className="mb-8">
              <div className="text-xs font-medium mb-2 text-gray-500">PROJECT TITLE / CAPTION</div>
              <input 
                value={newGalleryCaption}
                onChange={(e) => setNewGalleryCaption(e.target.value)}
                className="w-full border-2 rounded-2xl px-6 py-5" 
                placeholder="E.g. 2400 sqft villa in Danapur" 
              />
            </div>
            
            <div>
              <div className="text-xs font-medium mb-3 text-gray-500">CATEGORY</div>
              <div className="flex gap-3">
                {['completed', 'ongoing', 'interior'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setNewGalleryCategory(cat)}
                    className={`flex-1 py-4 text-sm rounded-2xl border ${newGalleryCategory === cat ? 'border-black bg-black text-white' : 'hover:bg-gray-100'}`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-10 flex gap-4">
              <button onClick={() => setShowAddGallery(false)} className="flex-1 py-6 border text-sm font-medium rounded-3xl">CANCEL</button>
              <button onClick={addToGallery} className="flex-1 py-6 bg-black text-white text-sm font-medium rounded-3xl">ADD TO GALLERY</button>
            </div>
            <div className="text-center text-[10px] text-gray-400 mt-8">Note: In production this would upload images to backend storage. Here we reuse existing images for demo.</div>
          </div>
        </div>
      )}

      {/* ADMIN NOTE */}
      {isAdminLoggedIn && (
        <div className="fixed bottom-4 left-4 bg-amber-100 border border-amber-300 text-amber-800 text-xs px-4 py-2.5 rounded-2xl z-[9999] max-w-[260px]">
          Demo Mode • Click logout in sidebar to exit admin
        </div>
      )}
    </div>
  );
};

export default App;

