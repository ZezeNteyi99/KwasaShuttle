import React, { useState, useRef, useEffect } from 'react';
import { Vehicle, VehicleStatus } from '../types';
import { 
  ArrowRight, Star, Shield, Clock, CheckCircle, Car, Phone, Mail, MapPin, 
  Lock, AlertCircle, MessageCircle, Send, X, Bot, Scale, FileText, Sun, Moon, Info, RotateCcw
} from 'lucide-react';
import Modal from './Modal';
import { askAiAssistant } from '../services/geminiService';

interface CustomerPortalProps {
  vehicles: Vehicle[];
  onBookingRequest: (data: any) => void;
  onBackToAdmin: () => void;
  adminPassword?: string;
  onResetPassword?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const CustomerPortal: React.FC<CustomerPortalProps> = ({ 
  vehicles, onBookingRequest, onBackToAdmin, adminPassword = '0000', onResetPassword,
  darkMode, onToggleDarkMode
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modals State
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  // Admin Login State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [loginCreds, setLoginCreds] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', pickupDate: '', returnDate: '', 
    cardNumber: '', expiry: '', cvv: ''
  });

  const availableVehicles = vehicles.filter(v => v.status !== VehicleStatus.Maintenance);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginCreds.email.toLowerCase() === 'admin@kwasa.co.za' && loginCreds.password === adminPassword) {
        setLoginError('');
        setIsAdminLoginOpen(false);
        onBackToAdmin();
    } else {
        setLoginError('Invalid email or password.');
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    const vehicleList = availableVehicles.map(v => 
        `- ${v.make} ${v.model}: R${v.dailyRate}/day`
    ).join('\n');

    const context = `
      Company: KwasaShuttle Rentals. 
      Location: 36 Bucharest str, Johannesburg, 2188.
      Email: zezenteyi99@gmail.com.
      Primary Phone: 073 585 8622.
      Secondary Phone: 061 287 3693.
      Fleet: ${vehicleList}
      Requirements: 21+ age, 2+ years license, ID, Proof of residence.
    `;

    const answer = await askAiAssistant(userMsg, context, "Customer Support Agent");
    setChatHistory(prev => [...prev, { role: 'ai', text: answer }]);
    setIsChatLoading(false);
  };

  const handleBookClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({ 
      name: '', email: '', phone: '', pickupDate: '', returnDate: '', 
      cardNumber: '', expiry: '', cvv: '' 
    });
    setIsModalOpen(true);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, phone: value });
  };

  const calculateTotal = (rate: number, start: string, end: string) => {
    if (!start || !end) return rate;
    const s = new Date(start);
    const e = new Date(end);
    const d = Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    return rate * d;
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Navigation */}
      <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
             <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-900/20">K</div>
                <span className="font-bold text-xl tracking-tight">KwasaShuttle</span>
             </div>
             <div className="flex items-center gap-2 sm:gap-4">
               <button onClick={onToggleDarkMode} className="p-2.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                 {darkMode ? <Sun size={20} /> : <Moon size={20} />}
               </button>
               <button 
                onClick={() => {
                    setLoginCreds({ email: '', password: '' });
                    setLoginError('');
                    setIsAdminLoginOpen(true);
                }} 
                className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
               >
                 <Lock size={16} className="text-blue-500" /> <span className="hidden sm:inline">Admin Login</span>
               </button>
               {/* Contact Us Link in Header */}
               <button 
                 onClick={() => scrollToSection('contact')} 
                 className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
               >
                 Contact Us
               </button>
               <button 
                 onClick={() => scrollToSection('fleet')} 
                 className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-900/30"
               >
                 Book Now
               </button>
             </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-slate-900 dark:bg-black text-white py-24 sm:py-36 px-4 relative overflow-hidden transition-colors">
         <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent dark:from-blue-900/10 z-0"></div>
         <div className="max-w-7xl mx-auto relative z-10 text-center animate-in fade-in zoom-in duration-700">
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
              Ride In Style. <br /> <span className="text-blue-500">Rent In Seconds.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 dark:text-slate-400 mb-12 max-w-3xl mx-auto font-medium leading-relaxed opacity-90">
              Your gateway to premium car rentals in South Africa. We offer competitive rates, flexible pick-ups, and a fleet that never fails.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <button 
                onClick={() => scrollToSection('fleet')} 
                className="bg-blue-600 text-white px-10 py-4 rounded-full font-black text-xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/40"
              >
                Explore Fleet
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="bg-white/10 backdrop-blur-md text-white border-2 border-white/20 px-10 py-4 rounded-full font-black text-xl hover:bg-white/20 transition-all cursor-pointer"
              >
                How It Works
              </button>
            </div>
         </div>
         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
               <div className="w-1 h-2 bg-white rounded-full"></div>
            </div>
         </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-16 text-center">
           <div className="group space-y-5">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto transition-all group-hover:scale-110 group-hover:rotate-6 shadow-sm">
                <Shield size={40} />
              </div>
              <h3 className="font-black text-2xl tracking-tight">Full Coverage</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">Safety is our DNA. Comprehensive insurance and roadside support are standard on every agreement.</p>
           </div>
           <div className="group space-y-5">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto transition-all group-hover:scale-110 group-hover:-rotate-6 shadow-sm">
                <Clock size={40} />
              </div>
              <h3 className="font-black text-2xl tracking-tight">Rapid Booking</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">Skip the paperwork. Our streamlined digital platform gets you behind the wheel faster than ever.</p>
           </div>
           <div className="group space-y-5">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto transition-all group-hover:scale-110 group-hover:rotate-6 shadow-sm">
                <Star size={40} />
              </div>
              <h3 className="font-black text-2xl tracking-tight">Elite Reliability</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">Meticulously maintained vehicles that undergo a 50-point safety check before every departure.</p>
           </div>
        </div>
      </div>

      {/* Fleet Section */}
      <div id="fleet" className="py-24 px-4 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black mb-6 tracking-tight">Our Premium Fleet</h2>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium">From agile city explorers to spacious family cruisers, find the perfect match for your next journey.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
           {availableVehicles.map(vehicle => (
             <div key={vehicle.id} className="bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:shadow-blue-500/10 transition-all duration-500 group">
                <div className="h-72 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                  <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-6 right-6">
                    <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest shadow-xl">
                      Available
                    </span>
                  </div>
                </div>
                <div className="p-10">
                   <div className="flex justify-between items-start mb-8">
                     <div>
                       <h3 className="text-3xl font-black mb-2 leading-none">{vehicle.make} <br/> <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">{vehicle.model}</span></h3>
                       <p className="text-slate-400 dark:text-slate-500 text-xs font-black tracking-[0.2em] uppercase">{vehicle.plate}</p>
                     </div>
                     <div className="text-right">
                       <p className="text-4xl font-black text-slate-900 dark:text-white">R{vehicle.dailyRate}</p>
                       <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Day Rate</p>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-y-4 mb-10 text-sm font-bold text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Automatic</div>
                      <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Full Fuel</div>
                      <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Climate Ctrl</div>
                      <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500"></div> 7 Seater</div>
                   </div>

                   <button 
                     disabled={vehicle.status !== 'Available'}
                     onClick={() => handleBookClick(vehicle)}
                     className={`w-full py-5 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-3
                       ${vehicle.status === 'Available' 
                         ? 'bg-slate-900 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 active:scale-95 shadow-2xl' 
                         : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}
                     `}
                   >
                     {vehicle.status === 'Available' ? <>Instant Booking <ArrowRight size={22} /></> : 'Sold Out'}
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div id="about" className="py-24 bg-blue-600 dark:bg-blue-700 text-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Simple. Transparent. <br/>KwasaShuttle.</h2>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0 mt-1">1</div>
                      <p className="text-blue-50 leading-relaxed">Choose your car online from our real-time fleet. No "or similar" tricks - what you book is what you drive.</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0 mt-1">2</div>
                      <p className="text-blue-50 leading-relaxed">Complete your details and secure your rental with a simple deposit. We accept credit cards and EFT.</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0 mt-1">3</div>
                      <p className="text-blue-50 leading-relaxed">Collect your vehicle from our Johannesburg hub or request delivery to your door.</p>
                   </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                 <h3 className="text-2xl font-bold mb-6">Rental Requirements</h3>
                 <ul className="space-y-4 text-blue-50">
                    <li className="flex items-center gap-3"><CheckCircle size={18}/> Valid South African Driver's License</li>
                    <li className="flex items-center gap-3"><CheckCircle size={18}/> Valid Identity Document (ID)</li>
                    <li className="flex items-center gap-3"><CheckCircle size={18}/> Proof of Residence (Last 3 months)</li>
                    <li className="flex items-center gap-3"><CheckCircle size={18}/> Drivers must be 21 years or older</li>
                 </ul>
              </div>
          </div>
      </div>

      {/* Footer / Contact Section */}
      <footer id="contact" className="bg-slate-950 text-slate-400 pt-24 pb-12 px-4 transition-colors duration-500 scroll-mt-20">
         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-blue-900/40">K</div>
                <span className="font-black text-2xl text-white tracking-tight">KwasaShuttle</span>
              </div>
              <p className="text-base leading-relaxed font-medium opacity-80">Premium vehicle rental solutions tailored for the South African journey. Quality, transparency, and safety without compromise.</p>
            </div>

            <div>
              <h4 className="text-white font-black mb-8 uppercase tracking-[0.2em] text-xs">Navigation</h4>
              <ul className="text-sm font-bold space-y-4">
                <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-all hover:translate-x-1 inline-block">Home Portal</button></li>
                <li><button onClick={() => scrollToSection('fleet')} className="hover:text-white transition-all hover:translate-x-1 inline-block">Rental Fleet</button></li>
                <li><button onClick={() => setIsTermsOpen(true)} className="hover:text-white transition-all hover:translate-x-1 inline-block">Rental Terms</button></li>
                <li><button onClick={() => setIsPrivacyOpen(true)} className="hover:text-white transition-all hover:translate-x-1 inline-block">Privacy Policy</button></li>
              </ul>
            </div>

            <div className="sm:col-span-2">
              <h4 className="text-white font-black mb-8 uppercase tracking-[0.2em] text-xs">Reach Our Support Team</h4>
              <div className="grid sm:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex items-start gap-5">
                    <div className="bg-blue-600/10 p-3 rounded-2xl border border-blue-500/20">
                      <MapPin size={24} className="text-blue-500" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-white text-sm font-black uppercase tracking-widest mb-1">Our Hub</span>
                       <span className="text-base font-medium">36 Bucharest str, <br/> Johannesburg, 2188</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="bg-blue-600/10 p-3 rounded-2xl border border-blue-500/20">
                      <Mail size={24} className="text-blue-500" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-white text-sm font-black uppercase tracking-widest mb-1">Email us</span>
                       <a href="mailto:zezenteyi99@gmail.com" className="text-base font-medium hover:text-white transition-colors underline decoration-blue-500 underline-offset-4">zezenteyi99@gmail.com</a>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-5">
                    <div className="bg-blue-600/10 p-3 rounded-2xl border border-blue-500/20">
                      <Phone size={24} className="text-blue-500" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-white text-sm font-black uppercase tracking-widest mb-1">WhatsApp Us</span>
                       {/* WhatsApp Linked Numbers */}
                       <a 
                         href="https://wa.me/27735858622" 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="text-base font-medium hover:text-white transition-colors block mb-1"
                       >
                         073 585 8622
                       </a>
                       <a 
                         href="https://wa.me/27612873693" 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="text-base font-medium hover:text-white transition-colors block"
                       >
                         061 287 3693
                       </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto pt-10 border-t border-slate-900 text-center text-[10px] font-black tracking-[0.3em] uppercase opacity-40">
           &copy; {new Date().getFullYear()} KWASASHUTTLE RENTALS (PTY) LTD. GAUTENG, SOUTH AFRICA.
         </div>
      </footer>

      {/* Admin Login Modal */}
      <Modal 
        isOpen={isAdminLoginOpen} 
        onClose={() => setIsAdminLoginOpen(false)} 
        title="Admin Portal Access"
      >
        <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl flex items-start gap-4 border border-red-100 dark:border-red-800/20">
                <Lock className="text-red-500 shrink-0" size={24} />
                <p className="text-xs text-red-800 dark:text-red-300 font-bold leading-relaxed">Authorized access only. Please provide your administrator credentials to manage fleet and bookings.</p>
            </div>

            <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
                <input 
                    type="email" required
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-medium"
                    value={loginCreds.email}
                    onChange={e => setLoginCreds({...loginCreds, email: e.target.value})}
                    placeholder="admin@kwasa.co.za"
                />
            </div>
            
            <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Secure Password</label>
                <input 
                    type="password" required
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-medium"
                    value={loginCreds.password}
                    onChange={e => setLoginCreds({...loginCreds, password: e.target.value})}
                    placeholder="••••••••"
                />
            </div>

            {loginError && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="text-red-500 text-sm font-black flex items-center gap-2">
                    <AlertCircle size={18} /> {loginError}
                </div>
                <div className="flex flex-col gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowPasswordHint(!showPasswordHint)}
                    className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-2 w-fit"
                  >
                    <Info size={16} /> Need help accessing the demo?
                  </button>
                  {showPasswordHint && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/20 text-xs text-blue-800 dark:text-blue-400 font-medium space-y-3">
                      <p>Default credentials: <b>admin@kwasa.co.za</b> / <b>{adminPassword}</b></p>
                      {onResetPassword && (
                        <button 
                          type="button"
                          onClick={() => {
                            onResetPassword();
                            setShowPasswordHint(false);
                            setLoginCreds({...loginCreds, password: '0000'});
                          }}
                          className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-black hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3 py-2 rounded-xl transition-all"
                        >
                          <RotateCcw size={14}/> Reset Password to "0000"
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <button type="submit" className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 dark:hover:bg-blue-500 transition-all active:scale-[0.98] shadow-2xl shadow-blue-900/20">
                Authenticate Securely
            </button>
        </form>
      </Modal>

      {/* AI Chat Widget */}
      <div className="fixed bottom-10 right-10 z-50">
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)} 
            className="bg-blue-600 text-white p-5 rounded-[24px] shadow-2xl hover:scale-110 active:scale-95 transition-all relative group"
          >
            <MessageCircle size={36} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-4 border-white dark:border-slate-950 animate-pulse"></span>
          </button>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl w-80 sm:w-96 flex flex-col h-[550px] border dark:border-slate-800 animate-in fade-in slide-in-from-bottom-12 duration-300">
            <div className="bg-blue-600 p-6 rounded-t-[32px] flex items-center justify-between text-white shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Bot size={28}/>
                </div>
                <div>
                    <h4 className="font-black text-base leading-none mb-1">Kwasa Assistant</h4>
                    <p className="text-[10px] text-blue-100 font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full"></span> Active Now
                    </p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950/40">
              {chatHistory.length === 0 && (
                  <div className="text-center py-10 opacity-60">
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed">Hi! I can help you with rental quotes, fleet availability, or general questions about KwasaShuttle. How can I assist you today?</p>
                  </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-3xl max-w-[90%] text-sm font-medium leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none shadow-xl' : 'bg-white dark:bg-slate-800 dark:text-white border dark:border-slate-700 rounded-bl-none shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                  <div className="flex justify-start">
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl rounded-bl-none shadow-sm flex gap-1.5 items-center">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150"></span>
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-300"></span>
                      </div>
                  </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleChatSubmit} className="p-5 border-t dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-3 rounded-b-[32px]">
              <input 
                type="text" 
                className="flex-1 px-5 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none dark:text-white" 
                placeholder="Ask me anything..." 
                value={chatMessage} 
                onChange={e => setChatMessage(e.target.value)} 
              />
              <button 
                type="submit" 
                disabled={!chatMessage.trim() || isChatLoading}
                className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-900/20"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Terms/Privacy Modals */}
      <Modal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} title="Rental Terms">
        <div className="text-sm font-medium space-y-5 dark:text-slate-300 max-h-[50vh] overflow-y-auto pr-2">
          <p>By using KwasaShuttle, you agree to our comprehensive rental framework.</p>
          <ul className="list-disc pl-6 space-y-3">
            <li><b>Age Limit:</b> All drivers must be 21+ with a clean driving record.</li>
            <li><b>Verification:</b> Valid ID, driver's license, and proof of residence required for all keys.</li>
            <li><b>Mileage:</b> Standard rates include 200km daily free. Excess charged at R3.50/km.</li>
            <li><b>Fuel:</b> Vehicles provided full and must return full.</li>
          </ul>
        </div>
      </Modal>
      <Modal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} title="Privacy Data Policy">
        <div className="text-sm font-medium space-y-5 dark:text-slate-300 max-h-[50vh] overflow-y-auto pr-2">
          <p>Your data security is paramount. We adhere to POPIA standards.</p>
          <ul className="list-disc pl-6 space-y-3">
            <li><b>Data Use:</b> We only collect identity and licensing data for contract fulfillment.</li>
            <li><b>Payments:</b> Card details are processed via 256-bit SSL and are never stored locally.</li>
            <li><b>Retention:</b> We maintain records for 5 years as required by transport regulations.</li>
          </ul>
        </div>
      </Modal>

      {/* Booking Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Vehicle Reservation">
         <form onSubmit={e => { e.preventDefault(); alert('Booking successful! Our team will contact you to finalize the documentation.'); setIsModalOpen(false); }} className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-[28px] flex items-center gap-5 border border-blue-100 dark:border-blue-800/20">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-2xl shadow-blue-900/30">
                <Car size={32} />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">{selectedVehicle?.make} {selectedVehicle?.model}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest">R{selectedVehicle?.dailyRate} / Per Day</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <input required type="text" placeholder="Your Full Name" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required type="tel" placeholder="Mobile Number" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white font-medium" value={formData.phone} onChange={handlePhoneChange} />
                <input required type="email" placeholder="Email Address" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white font-medium" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-2">Pickup Date</label>
                    <input required type="date" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl text-sm dark:text-white font-bold" value={formData.pickupDate} onChange={e => setFormData({...formData, pickupDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-2">Return Date</label>
                    <input required type="date" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl text-sm dark:text-white font-bold" value={formData.returnDate} onChange={e => setFormData({...formData, returnDate: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm text-slate-500 font-black uppercase tracking-widest">Total Estimated:</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white">R{calculateTotal(selectedVehicle?.dailyRate||0, formData.pickupDate, formData.returnDate).toLocaleString()}</span>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black text-xl hover:bg-blue-700 transition-all active:scale-[0.98] shadow-2xl shadow-blue-900/30">
                Finalize Reservation
            </button>
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest opacity-60">By continuing, you agree to our standard rental contract and POPIA data guidelines.</p>
         </form>
      </Modal>
    </div>
  );
};

export default CustomerPortal;