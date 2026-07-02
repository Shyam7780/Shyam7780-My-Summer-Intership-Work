import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Home, Hammer, Calculator as CalcIcon, Image, Star, Send, Trash2, LogOut, Menu, X, Upload, Edit } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Inquiry { id?: number | string; _id?: string; name: string; phone: string; service: string; message: string; date?: string; createdAt?: string; }
interface Feedback { id: number | string; name: string; rating: number; comment: string; approved: boolean; date: string; userEmail?: string; userProfilePic?: string; reviewImage?: string; }
interface GalleryItem { id: number | string; url: string; caption: string; category: string; }

const API_BASE = '/api';

const ADMIN_EMAIL = 'ramchhotan63@gmail.com';
const ADMIN_PASSWORD = 'Shyam@7780';

function App() {
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
  
  const [googleUser, setGoogleUser] = useState<{ name: string; email: string; picture: string } | null>(null);
  const [reviewImageBase64, setReviewImageBase64] = useState<string>('');
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '' });
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('With Material');

  useEffect(() => {
    fetchRate();
    fetchGallery();
    fetchFeedbacks(isAdminLoggedIn);
    setupGoogleSignIn();
  }, [isAdminLoggedIn]);

  const setupGoogleSignIn = () => {
    if ((window as any).google) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      (window as any).google.accounts.id.initialize({
        client_id: "755490443425-u148m1be9v9262onj2epcl1802p85b3j.apps.googleusercontent.com",
        callback: handleGoogleCredentialResponse,
      });
      (window as any).google.accounts.id.renderButton(
        document.getElementById("google-auth-btn"),
        { theme: "outline", size: "large", width: "100%" }
      );
    };
    document.head.appendChild(script);
  };

  const handleGoogleCredentialResponse = (response: any) => {
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      setGoogleUser({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      });
      toast.success(`Connected: ${decoded.email}`);
    } catch (err) {
      toast.error('Google verification failed');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size too big! Max 2MB allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setReviewImageBase64(reader.result as string);
      toast.success('Photo attached!');
    };
    reader.readAsDataURL(file);
  };

  const fetchRate = async () => {
    try {
      const res = await fetch(`${API_BASE}/rate`);
      if (!res.ok) return;
      const data = await res.json();
      if (data?.value) {
        setCurrentRate(data.value);
        setNewRate(data.value);
      }
    } catch (err) { }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch(`${API_BASE}/inquiries`);
      if (!res.ok) return;
      const data = await res.json();
      setInquiries(data.map((inq: any) => ({
        id: inq._id,
        name: inq.name,
        phone: inq.phone,
        service: inq.service,
        message: inq.message,
        date: inq.createdAt ? inq.createdAt.split('T')[0] : '',
        createdAt: inq.createdAt,
      })));
    } catch (err) { }
  };

  const fetchFeedbacks = async (adminMode = false) => {
    try {
      const url = adminMode ? `${API_BASE}/feedback?isAdmin=true` : `${API_BASE}/feedback`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      setFeedbacks(data.map((f: any) => ({
        id: f._id,
        name: f.name,
        rating: f.rating,
        comment: f.comment,
        approved: f.approved,
        date: f.createdAt ? f.createdAt.split('T')[0] : '2025-01-01',
        userEmail: f.userEmail,
        userProfilePic: f.userProfilePic,
        reviewImage: f.reviewImage
      })));
    } catch (err) { }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_BASE}/gallery`);
      const data = await res.json();
      setGalleryItems(data.map((item: any) => ({
        id: item._id || item.id,
        url: item.url,
        caption: item.caption,
        category: item.category,
      })));
    } catch (err) {
      setGalleryItems([
        { id: 1, url: '/images/house1.jpg', caption: 'Modern Villa - Patna', category: 'completed' },
        { id: 2, url: '/images/house1.jpg', caption: 'Luxury Bungalow', category: 'completed' },
      ]);
    }
  };

  const calculateEstimate = () => {
    if (!area || isNaN(parseFloat(area))) {
      toast.error('Please enter a valid area');
      return;
    }
    const cost = Math.round(parseFloat(area) * currentRate);
    setEstimatedCost(cost);
    toast.success(`Estimate calculated!`);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        toast.success('Inquiry submitted!');
        setContactForm({ name: '', phone: '', email: '', service: 'With Material', message: '' });
        if (isAdminLoggedIn) fetchInquiries();
      }
    } catch (err) { }
    finally { setLoading(false); }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUser) {
      toast.error('Please login with Google first');
      return;
    }
    if (!feedbackForm.comment) {
      toast.error('Please add a comment');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: googleUser.name,
          userEmail: googleUser.email,
          userProfilePic: googleUser.picture,
          rating: feedbackForm.rating,
          comment: feedbackForm.comment,
          reviewImage: reviewImageBase64,
        }),
      });
      if (res.ok) {
        toast.success('Review submitted for admin approval!');
        setFeedbackForm({ rating: 5, comment: '' });
        setReviewImageBase64('');
        setGoogleUser(null);
        fetchFeedbacks(isAdminLoggedIn);
      }
    } catch (err) { }
    finally { setLoading(false); }
  };

  const approveFeedback = async (id: number | string) => {
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved: true })
      });
      if (res.ok) {
        fetchFeedbacks(true);
        toast.success('Review approved!');
      }
    } catch (err) { }
  };

  const deleteFeedback = async (id: number | string) => {
    try {
      await fetch(`${API_BASE}/feedback/${id}`, { method: 'DELETE' });
      fetchFeedbacks(true);
      toast.success('Deleted');
    } catch (err) { }
  };

  const updateRate = async () => {
    try {
      const res = await fetch(`${API_BASE}/rate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newRate }),
      });
      if (res.ok) {
        setCurrentRate(newRate);
        toast.success('Rate updated!');
      }
    } catch (err) { }
  };

  const addToGallery = async () => {
    try {
      const res = await fetch(`${API_BASE}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: '/images/house1.jpg', caption: newGalleryCaption, category: newGalleryCategory }),
      });
      if (res.ok) {
        fetchGallery();
        toast.success('Added!');
      }
    } catch (err) { }
    setNewGalleryCaption('');
    setShowAddGallery(false);
  };

  const deleteGalleryItem = async (id: number | string) => {
    try {
      await fetch(`${API_BASE}/gallery/${id}`, { method: 'DELETE' });
      fetchGallery();
      toast.success('Deleted!');
    } catch (err) { }
  };

  const handleAdminLogin = () => {
    if (adminEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() && adminPassword === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      fetchInquiries();
      toast.success('Admin Portal Open');
    } else {
      setAdminLoginError('Invalid Credentials');
    }
  };

  const adminLogout = () => { setIsAdminLoggedIn(false); };
  const approvedFeedbacks = feedbacks.filter(f => f.approved);
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
      <Toaster position="top-right" />

      {/* NAVBAR */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-xl md:rounded-2xl text-xl md:text-3xl font-bold">CR</div>
              <div>
                <div className="text-xl md:text-3xl font-bold tracking-tighter leading-none">Chhotan Ram</div>
                <p className="text-[8px] md:text-[10px] text-blue-600 font-semibold">CONSTRUCTION • PATNA</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              {['services', 'packages', 'calculator', 'gallery', 'testimonials', 'contact'].map(s => (
                <button key={s} onClick={() => scrollToSection(s)} className="hover:text-blue-600 transition capitalize">
                  {s === 'calculator' ? 'Calculator' : s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setShowAdminLogin(true)} className="px-3 py-1.5 text-xs border border-gray-300 rounded-xl font-medium">LOGIN</button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-1"><Menu size={22} /></button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white px-4 py-6 border-t flex flex-col gap-4 shadow-lg text-base">
            {['services', 'packages', 'calculator', 'gallery', 'testimonials', 'contact'].map(section => (
              <button key={section} onClick={() => scrollToSection(section)} className="text-left py-2 border-b border-gray-50 capitalize">{section}</button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 pt-10 md:pt-20 pb-10 md:pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 text-center md:text-left">
            <div className="uppercase tracking-[2px] text-blue-600 text-xs font-semibold mb-3">EST. 1998 • PATNA, BIHAR</div>
            <h1 className="text-4xl sm:text-5xl md:text-[60px] leading-tight font-bold text-gray-900 mb-4">Quality Homes.<br />Built with Trust.</h1>
            <p className="max-w-lg text-sm sm:text-base text-gray-600">Chhotan Ram Construction delivers reliable residential construction services across Patna. From planning to finishing — we handle everything with transparency.</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full">
              <button onClick={() => scrollToSection('calculator')} className="px-8 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 font-semibold">
                <CalcIcon size={18} /> FREE ESTIMATE
              </button>
              <button onClick={() => scrollToSection('contact')} className="px-6 h-12 border-2 border-gray-900 rounded-xl font-semibold hover:bg-gray-900 hover:text-white transition-all">Get In Touch</button>
            </div>
          </div>
          <div className="md:col-span-5 relative">
            <img src="/images/house1.jpg" alt="Beautiful Home" className="rounded-2xl shadow-xl w-full object-cover" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-12 md:py-20 bg-white px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline px-4 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">OUR EXPERTISE</div>
            <h2 className="text-3xl md:text-4xl font-bold mt-3">Construction Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'With Material', icon: Home, desc: 'Complete turnkey solution. We procure all materials and construct your home end-to-end.' },
              { title: 'Without Material', icon: Hammer, desc: 'You supply the materials. We provide expert labour and project management.' },
              { title: 'Remodeling', icon: Edit, desc: 'Renovate, upgrade or expand your existing home with modern design and finishes.' },
            ].map((service, index) => (
              <div key={index} onClick={() => setSelectedService(service.title)} className={`p-6 border-2 rounded-2xl cursor-pointer ${selectedService === service.title ? 'border-blue-600 bg-blue-50/20' : 'border-gray-100'}`}>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="py-12 md:py-20 bg-slate-50 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">With Material Packages</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Basic', price: '1,650', features: ['Standard bricks & cement', 'Basic electrical & plumbing', 'Vitrified tile flooring', '1 year warranty'] },
              { name: 'Standard', price: '2,150', features: ['Premium materials', 'Modular kitchen sink', 'Branded bathroom fittings', '2 years warranty', 'POP ceiling'], popular: true },
              { name: 'Premium', price: '2,950', features: ['Luxury Italian marble', 'Smart home ready wiring', 'Designer elevation', '3 years comprehensive warranty', 'Landscaping'] },
            ].map((pkg, i) => (
              <div key={i} className={`bg-white rounded-2xl p-6 border ${pkg.popular ? 'border-blue-500 shadow-lg relative' : 'border-gray-100'} flex flex-col`}>
                <div className="text-center mb-4">
                  <div className="text-xl font-bold">{pkg.name}</div>
                  <div className="text-2xl font-black text-blue-600 mt-1">₹{pkg.price}/sqft</div>
                </div>
                <ul className="space-y-2 mb-6 flex-1 text-sm text-gray-600">
                  {pkg.features.map((f, idx) => <li key={idx} className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>{f}</li>)}
                </ul>
                <button onClick={() => scrollToSection('contact')} className="w-full py-2.5 border rounded-xl text-xs font-bold uppercase tracking-wider">CHOOSE PACKAGE</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="py-12 md:py-20 bg-white px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-50 border rounded-2xl p-6 md:p-12 max-w-md mx-auto text-center">
            <label className="block text-xs font-semibold text-gray-400 mb-1">LIVE RATE</label>
            <div className="text-4xl font-black text-blue-600 mb-4">₹{currentRate}/sqft</div>
            <div className="space-y-4">
              <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="Enter Built-up Area (sqft)" className="w-full h-12 border rounded-xl px-4 text-lg" />
              <button onClick={calculateEstimate} className="w-full h-12 bg-blue-600 text-white font-bold rounded-xl">CALCULATE COST</button>
              {estimatedCost > 0 && <div className="bg-white border border-emerald-200 rounded-xl p-4 text-xl font-bold text-emerald-700">Total: ₹{estimatedCost.toLocaleString('en-IN')}</div>}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-12 md:py-20 bg-slate-50 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Completed Work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden border shadow-sm">
                <img src={item.url} alt={item.caption} className="w-full h-48 object-cover" />
                <div className="p-4"><p className="font-semibold text-sm">{item.caption}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-12 md:py-20 bg-white px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 gap-4 mb-8">
            {approvedFeedbacks.map(fb => (
              <div key={fb.id} className="bg-slate-50 p-6 rounded-2xl border">
                <div className="flex items-center gap-3 mb-2">
                  <img src={fb.userProfilePic || "/images/avatar-default.png"} alt="user" className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="font-bold text-sm">{fb.name}</div>
                    <div className="text-[10px] text-emerald-600">✓ Verified User</div>
                  </div>
                </div>
                <p className="text-gray-600 italic text-sm">"{fb.comment}"</p>
                {fb.reviewImage && <img src={fb.reviewImage} alt="attached" className="mt-3 rounded-xl max-h-40 object-cover" />}
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-slate-50 rounded-2xl p-6 border max-w-lg mx-auto">
            <h3 className="font-bold text-lg text-center mb-4">Write a Review</h3>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              {!googleUser ? <div id="google-auth-btn"></div> : (
                <div className="bg-blue-50 p-2 rounded-xl flex justify-between text-xs">
                  <span>Logged in as: <b>{googleUser.email}</b></span>
                  <button type="button" onClick={() => setGoogleUser(null)} className="text-red-500 underline">Logout</button>
                </div>
              )}
              <textarea placeholder="Type your review here..." value={feedbackForm.comment} onChange={e => setFeedbackForm({ ...feedbackForm, comment: e.target.value })} className="w-full h-24 p-3 border rounded-xl bg-white text-sm" required />
              <div className="border border-dashed bg-white p-4 text-center relative rounded-xl">
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <span className="text-xs text-gray-500">📷 Attach Site Photo (Max 2MB)</span>
              </div>
              {reviewImageBase64 && <div className="text-xs text-green-600 text-center">✓ Photo attached!</div>}
              <button type="submit" disabled={!googleUser || loading} className="w-full h-11 bg-gray-900 text-white font-bold rounded-xl disabled:bg-gray-300">Submit Verified Review</button>
            </form>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-12 bg-[#0a1428] text-white px-4 md:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold">Chhotan Ram Construction</h2>
            <p className="text-slate-400 text-sm mt-2">📍 Tej Pratap Nagar, Beur, Patna</p>
            <p className="text-slate-400 text-sm">☎ +91 95251 85568</p>
          </div>
          <div className="md:col-span-3">
            <form onSubmit={handleContactSubmit} className="bg-white/5 p-6 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Name" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} className="bg-white/10 rounded-xl px-4 h-11 text-white text-sm" required />
                <input type="tel" placeholder="Phone" value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} className="bg-white/10 rounded-xl px-4 h-11 text-white text-sm" required />
              </div>
              <textarea value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} placeholder="Details..." rows={3} className="w-full bg-white/10 rounded-xl px-4 py-2 text-white text-sm" required />
              <button type="submit" className="w-full h-11 bg-white text-gray-900 font-bold rounded-xl text-sm">SEND INQUIRY</button>
            </form>
          </div>
        </div>
      </section>

      {/* ADMIN DASHBOARD PANELS */}
      {isAdminLoggedIn && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex flex-col md:flex-row">
          <div className="bg-slate-900 w-full md:w-64 p-6 text-white shrink-0">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold">Admin Portal</span>
              <button onClick={adminLogout} className="text-xs bg-red-600 px-3 py-1 rounded-lg">Logout</button>
            </div>
            <div className="flex md:flex-col gap-2 overflow-x-auto">
              {['dashboard', 'inquiries', 'rate', 'gallery', 'feedback'].map(tab => (
                <button key={tab} onClick={() => { setActiveAdminTab(tab); if(tab === 'inquiries') fetchInquiries(); }} className={`px-4 py-2 rounded-xl text-xs text-left capitalize ${activeAdminTab === tab ? 'bg-white text-slate-900' : 'text-slate-300'}`}>{tab}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
            {activeAdminTab === 'dashboard' && <div className="text-xl font-bold">Welcome to Dashboard. Total Inquiries: {inquiries.length}</div>}
            {activeAdminTab === 'inquiries' && inquiries.map(inq => (
              <div key={inq.id} className="bg-white p-4 rounded-xl border mb-3">
                <div className="font-bold text-sm">{inq.name} ({inq.phone})</div>
                <p className="text-xs text-gray-600 mt-2 bg-slate-50 p-2 rounded-lg">{inq.message}</p>
              </div>
            ))}
            {activeAdminTab === 'rate' && (
              <div className="max-w-xs bg-white p-6 rounded-xl border text-center mx-auto">
                <div className="text-2xl font-bold text-blue-600 mb-4">₹{currentRate}</div>
                <input type="number" value={newRate} onChange={e => setNewRate(Number(e.target.value))} className="border-b-2 text-center text-xl mb-4 w-full outline-none" />
                <button onClick={updateRate} className="bg-blue-600 text-white w-full h-10 rounded-lg text-xs font-bold">SAVE</button>
              </div>
            )}
            {activeAdminTab === 'feedback' && feedbacks.map(fb => (
              <div key={fb.id} className="bg-white p-4 rounded-xl border mb-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-sm">{fb.name} <span className="text-xs font-normal text-gray-400">({fb.userEmail})</span></div>
                  <p className="text-xs text-gray-600 italic">"{fb.comment}"</p>
                </div>
                <div className="flex gap-2">
                  {!fb.approved && <button onClick={() => approveFeedback(fb.id)} className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold">APPROVE</button>}
                  <button onClick={() => deleteFeedback(fb.id)} className="border border-red-500 text-red-500 px-3 py-1 rounded-lg text-xs font-bold">DELETE</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN LOGIN MODAL */}
    {/* ADMIN LOGIN MODAL */}
{showAdminLogin && (
  <div className="fixed inset-0 bg-black/70 z-[99999] flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-sm p-6">
      <h3 className="text-xl font-bold text-center mb-4">Admin Login</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address</label>
          <input 
            type="email" 
            placeholder="Enter Admin Email" 
            value={adminEmail} 
            onChange={e => { setAdminEmail(e.target.value); setAdminLoginError(''); }} 
            className="w-full h-11 border rounded-xl px-3 text-sm focus:border-blue-500 outline-none" 
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Password</label>
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={adminPassword} 
            onChange={e => { setAdminPassword(e.target.value); setAdminLoginError(''); }} 
            className="w-full h-11 border rounded-xl px-3 text-sm focus:border-blue-500 outline-none" 
            onKeyDown={e => e.key === 'Enter' && handleAdminLogin()} 
          />
        </div>
        {adminLoginError && <p className="text-red-500 text-xs text-center bg-red-50 py-2 rounded-lg">{adminLoginError}</p>}
        <button onClick={handleAdminLogin} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition shadow-md">
          LOGIN
        </button>
        <button onClick={() => setShowAdminLogin(false)} className="w-full text-gray-400 hover:text-gray-600 text-xs text-center mt-2">Cancel</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default App;