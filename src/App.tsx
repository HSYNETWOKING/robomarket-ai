import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Scale, Cpu, ShieldCheck, Heart, User as UserIcon, LogIn, ChevronRight, MessageSquare, ClipboardList, BookOpen, Mail, ShieldAlert } from 'lucide-react';
import { User, Robot } from './types';
import Header from './components/Header';
import Marketplace from './components/Marketplace';
import RobotDetails from './components/RobotDetails';
import CompareRobots from './components/CompareRobots';
import SellRobot from './components/SellRobot';
import AIAssistant from './components/AIAssistant';
import Dashboards from './components/Dashboards';
import ChatComponent from './components/ChatComponent';
import { AboutView, ContactView } from './components/StaticPages';

export default function App() {
  // Session / User States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmailInput, setLoginEmailInput] = useState('');

  // Auth Form states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [registerUsernameInput, setRegisterUsernameInput] = useState('');
  const [registerEmailInput, setRegisterEmailInput] = useState('');
  const [registerPasswordInput, setRegisterPasswordInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active View Navigation
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);

  // Global Datasets
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loadingRobots, setLoadingRobots] = useState(false);

  // Wishlist and Comparison states
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);

  // Direct Message states
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Fetch all robots from backend
  const fetchRobots = async () => {
    setLoadingRobots(true);
    try {
      // Fetch all (including pending, so admins can approve them!)
      const response = await fetch('/api/robots?status=all');
      if (response.ok) {
        const data = await response.json();
        setRobots(data);
      }
    } catch (err) {
      console.error("Error loading robots:", err);
    } finally {
      setLoadingRobots(false);
    }
  };

  useEffect(() => {
    fetchRobots();
    
    // Load session and local storage caches securely
    const token = localStorage.getItem('robo_token');
    if (token) {
      // Validate session with the backend to ensure persistent, valid auth state
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Stale secure token node');
      })
      .then(data => {
        setCurrentUser(data.user);
        localStorage.setItem('robo_user', JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem('robo_token');
        localStorage.removeItem('robo_user');
        setCurrentUser(null);
      });
    } else {
      const cachedUser = localStorage.getItem('robo_user');
      if (cachedUser) {
        setCurrentUser(JSON.parse(cachedUser));
      }
    }

    const cachedWish = localStorage.getItem('robo_wishlist');
    if (cachedWish) {
      setWishlist(JSON.parse(cachedWish));
    }

    const cachedCompare = localStorage.getItem('robo_compare');
    if (cachedCompare) {
      setCompareList(JSON.parse(cachedCompare));
    }
  }, []);

  // Sync state helpers to localStorage
  const saveUserSession = (user: User | null, token?: string) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('robo_user', JSON.stringify(user));
      if (token) {
        localStorage.setItem('robo_token', token);
      }
    } else {
      localStorage.removeItem('robo_user');
      localStorage.removeItem('robo_token');
    }
  };

  const toggleWishlist = (id: string) => {
    let updated;
    if (wishlist.includes(id)) {
      updated = wishlist.filter(item => item !== id);
    } else {
      updated = [...wishlist, id];
    }
    setWishlist(updated);
    localStorage.setItem('robo_wishlist', JSON.stringify(updated));
  };

  const toggleCompare = (id: string) => {
    let updated;
    if (compareList.includes(id)) {
      updated = compareList.filter(item => item !== id);
    } else {
      // Max comparison scope is 3
      if (compareList.length >= 3) {
        alert("Specification comparison table can contrast a maximum of 3 robotic systems side-by-side.");
        return;
      }
      updated = [...compareList, id];
    }
    setCompareList(updated);
    localStorage.setItem('robo_compare', JSON.stringify(updated));
  };

  const handleClearCompare = () => {
    setCompareList([]);
    localStorage.removeItem('robo_compare');
  };

  const handleRemoveFromCompare = (id: string) => {
    const updated = compareList.filter(item => item !== id);
    setCompareList(updated);
    localStorage.setItem('robo_compare', JSON.stringify(updated));
  };

  // Login handler
  const handleLoginSubmit = async (email: string, password?: string) => {
    if (!email) {
      setAuthError("Email parameter is required");
      return;
    }
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        saveUserSession(data.user, data.token);
        setShowLoginModal(false);
        setLoginEmailInput('');
        setLoginPasswordInput('');
        setAuthError(null);
      } else {
        setAuthError(data.error || "Failed to authenticate profile.");
      }
    } catch (err) {
      setAuthError("Network error. Failed to reach verification servers.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleRegisterSubmit = async (email: string, username: string, password?: string) => {
    if (!email || !username) {
      setAuthError("Email and Username parameters are required");
      return;
    }
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });
      const data = await response.json();
      if (response.ok) {
        saveUserSession(data.user, data.token);
        setShowLoginModal(false);
        setRegisterEmailInput('');
        setRegisterUsernameInput('');
        setRegisterPasswordInput('');
        setAuthError(null);
      } else {
        setAuthError(data.error || "Failed to register profile.");
      }
    } catch (err) {
      setAuthError("Network error. Failed to reach registration servers.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    saveUserSession(null);
    setActiveTab('home');
    setActiveThreadId(null);
  };

  // Chat negotiation initiations
  const handleInitiateChat = async (sellerId: string, sellerName: string, robotId: string, robotName: string) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: currentUser.id,
          buyerName: currentUser.username,
          sellerId,
          sellerName,
          robotId,
          robotName
        })
      });
      if (response.ok) {
        const data = await response.json();
        setActiveThreadId(data.id);
        setActiveTab('inbox');
        setSelectedRobotId(null);
      }
    } catch (err) {
      console.error("Chat creation error:", err);
    }
  };

  // Admin listing approvals
  const handleApproveListing = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      if (response.ok) {
        fetchRobots();
      }
    } catch (err) {
      console.error("Admin approval failed:", err);
    }
  };

  const handleRejectListing = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      if (response.ok) {
        fetchRobots();
      }
    } catch (err) {
      console.error("Admin rejection failed:", err);
    }
  };

  const handleNewListingCreated = () => {
    fetchRobots();
  };

  const handleReviewSubmitted = () => {
    fetchRobots();
  };

  // Filter approved listings for general showcase
  const approvedRobots = robots.filter(r => r.status === 'approved');
  const featuredRobots = approvedRobots.slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200" id="applet-shell">
      {/* Global Navigation Header */}
      <Header
        currentUser={currentUser}
        activeTab={selectedRobotId ? 'marketplace' : activeTab}
        setActiveTab={(tab) => {
          setSelectedRobotId(null);
          setActiveTab(tab);
        }}
        wishlistCount={wishlist.length}
        onLogout={handleLogout}
        onLoginClick={() => setShowLoginModal(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 bg-zinc-50 dark:bg-zinc-950">
        
        {/* Render detailed product view if selected */}
        {selectedRobotId ? (
          (() => {
            const matched = robots.find(r => r.id === selectedRobotId);
            return matched ? (
              <RobotDetails
                robot={matched}
                currentUserId={currentUser ? currentUser.id : null}
                onBack={() => setSelectedRobotId(null)}
                onInitiateChat={handleInitiateChat}
                onPlaceOrder={() => fetchRobots()}
                onReviewSubmitted={handleReviewSubmitted}
              />
            ) : (
              <div className="p-8 text-center text-zinc-400">Robot profile not found.</div>
            );
          })()
        ) : (
          /* Render normal view tabs */
          (() => {
            switch (activeTab) {
              
              case 'home':
                return (
                  <div className="space-y-16 py-12" id="home-view">
                    
                     {/* Hero Banner with tech-minimal styling */}
                    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
                      <div className="inline-flex items-center space-x-1.5 bg-blue-50 border border-blue-200 dark:bg-blue-950/35 dark:border-blue-900 rounded-full px-3 py-1 text-xs text-blue-600 dark:text-blue-400 font-mono tracking-widest uppercase font-semibold">
                        <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                        <span>AI-Powered Robot Marketplace</span>
                      </div>
                      
                      <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl max-w-4xl mx-auto font-sans leading-none">
                        Acquire Certified Commercial Robots With <span className="text-blue-600 dark:text-blue-400">Machine Intelligence</span>
                      </h1>
                      
                      <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
                        Verify specifications, audit documentation authenticity, and chat with merchants using our integrated Gemini AI Security compliance board.
                      </p>

                      <div className="flex flex-wrap justify-center gap-3 pt-2">
                        <button
                          onClick={() => setActiveTab('marketplace')}
                          className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 font-bold text-xs tracking-wider uppercase px-6 py-3.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center space-x-1.5 min-h-[44px]"
                          id="hero-marketplace-cta"
                        >
                          <span>Explore Catalog floors</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setActiveTab('ai-assistant')}
                          className="bg-white hover:bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800 font-semibold text-xs tracking-wider uppercase px-6 py-3.5 rounded-xl border border-zinc-200 transition-colors cursor-pointer shadow-sm min-h-[44px]"
                          id="hero-advisor-cta"
                        >
                          Consult Technical AI
                        </button>
                      </div>
                    </section>

                    {/* Features overview blocks */}
                    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 space-y-3 shadow-sm">
                        <Bot className="h-8 w-8 text-blue-650" />
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider">Cognitive AI Advisor</h3>
                        <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed">
                          Consult our system-prompt-driven Robotics expert on specific warehouse payloads, clinical sterilization features, or bipedal degree of freedom trade-offs in plain english.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 space-y-3 shadow-sm">
                        <Scale className="h-8 w-8 text-blue-650" />
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider">Precision Spec Comparison</h3>
                        <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed">
                          Contrast gross weights, operating systems, velocity parameters, and warranties side-by-side. Generate automated plain English summaries explaining specifications differences.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 space-y-3 shadow-sm">
                        <ShieldCheck className="h-8 w-8 text-blue-650" />
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider">Listing Authenticity Audits</h3>
                        <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed">
                          Flag suspicious seller listings, pricing anomalies, or inconsistent hardware statements before purchase with our automated listing quality verifier.
                        </p>
                      </div>
                    </section>

                    {/* Featured items floor */}
                    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center justify-between">
                        <h2 className="text-sm font-bold font-mono tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
                          Featured Robotic Systems
                        </h2>
                        <button
                          onClick={() => setActiveTab('marketplace')}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-semibold cursor-pointer min-h-[44px] flex items-center"
                        >
                          View Full Catalog
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredRobots.map((robot) => (
                          <div 
                            key={robot.id}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer group shadow-sm"
                            onClick={() => setSelectedRobotId(robot.id)}
                          >
                            <div className="relative aspect-video overflow-hidden">
                              <img src={robot.imageUrl} alt={robot.name} className="h-full w-full object-cover group-hover:scale-101 transition-transform duration-300" referrerPolicy="no-referrer" />
                              <span className="absolute top-3 left-3 bg-white/95 dark:bg-zinc-900/95 font-mono text-[9px] text-blue-600 dark:text-blue-400 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded font-bold shadow-sm animate-fade-in">
                                {robot.category}
                              </span>
                            </div>
                            <div className="p-4 space-y-1.5">
                              <h3 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{robot.name}</h3>
                              <p className="text-sm font-black text-blue-600 dark:text-blue-400">${robot.price.toLocaleString()}</p>
                              <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-mono">{robot.location} • {robot.condition}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Enterprise Trust, Testimonials, and ISO Badges Section */}
                    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 border-t border-zinc-200 dark:border-zinc-800 space-y-10">
                      
                      <div className="text-center space-y-3">
                        <div className="inline-flex items-center space-x-1 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 font-mono text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                          <span>Verified Procurement Pipeline</span>
                        </div>
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white sm:text-3xl tracking-tight">
                          Enterprise Procurement Trust
                        </h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                          Over 450 robotic assembly sites, clinical research laboratories, and smart fulfillment hubs negotiate compliance, audit specifications, and source autonomous fleets on RoboMarket.
                        </p>
                      </div>

                      {/* Testimonials Grid (Responsive bento-style) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* Card 1 */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-750 transition-colors">
                          <div className="space-y-3">
                            {/* Stars rating */}
                            <div className="flex text-amber-500 space-x-0.5">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed italic">
                              "Verifying high-vacuum sterile room armatures is crucial for clinical operations. RoboMarket's compliance advisor checked the bipedal pneumatic degrees of freedom instantly. Outstanding quality check."
                            </p>
                          </div>
                          <div className="flex items-center space-x-3 pt-2">
                            <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=aris" className="h-9 w-9 bg-zinc-100 dark:bg-zinc-850 rounded-full border border-zinc-200" />
                            <div>
                              <span className="text-xs font-bold text-zinc-900 dark:text-white block">Dr. Aris Thorne</span>
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-mono">Sinai Biotech Labs • Principal Lead</span>
                            </div>
                          </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-750 transition-colors">
                          <div className="space-y-3">
                            <div className="flex text-amber-500 space-x-0.5">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed italic">
                              "We sourced 14 heavy-duty autonomous pallet lifters on RoboMarket. The side-by-side spec comparison is brilliant. The audit suite caught a battery lifecycle discrepancy and saved us thousands."
                            </p>
                          </div>
                          <div className="flex items-center space-x-3 pt-2">
                            <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=elena" className="h-9 w-9 bg-zinc-100 dark:bg-zinc-850 rounded-full border border-zinc-200" />
                            <div>
                              <span className="text-xs font-bold text-zinc-900 dark:text-white block">Elena Rostova</span>
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-mono">Vanguard Logistics • Fleet Mgr</span>
                            </div>
                          </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-750 transition-colors">
                          <div className="space-y-3">
                            <div className="flex text-amber-500 space-x-0.5">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed italic">
                              "We rely on verified motor torque payloads to select chassis units for robotic kinetic training models. Finding vendors with certifiable compliance reports has never been faster."
                            </p>
                          </div>
                          <div className="flex items-center space-x-3 pt-2">
                            <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=marcus" className="h-9 w-9 bg-zinc-100 dark:bg-zinc-850 rounded-full border border-zinc-200" />
                            <div>
                              <span className="text-xs font-bold text-zinc-900 dark:text-white block">Prof. Marcus Vance</span>
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-mono">Biorobotics Lab • Director</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Compliance & ISO Trust badges row */}
                      <div className="border-t border-zinc-150 dark:border-zinc-800/80 pt-8">
                        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60 dark:opacity-45 hover:opacity-100 transition-opacity duration-200">
                          <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span className="text-[10px] font-bold font-mono tracking-widest uppercase">ISO 9001 Sourcing</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-[10px] font-bold font-mono tracking-widest uppercase">OSHA Machine Safety</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-[10px] font-bold font-mono tracking-widest uppercase">CE Autonomous Compliance</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5A2.5 2.5 0 0019.5 9.5V8a2 2 0 00-2-2h-3.172a2 2 0 01-1.414-.586l-.828-.828A2 2 0 0010.172 4H8.25" />
                            </svg>
                            <span className="text-[10px] font-bold font-mono tracking-widest uppercase">Global Freight Ready</span>
                          </div>
                        </div>
                      </div>

                    </section>

                  </div>
                );

              case 'marketplace':
                return (
                  <Marketplace
                    robots={robots}
                    wishlist={wishlist}
                    compareList={compareList}
                    onToggleWishlist={toggleWishlist}
                    onToggleCompare={toggleCompare}
                    onSelectRobot={setSelectedRobotId}
                  />
                );

              case 'compare':
                return (
                  <CompareRobots
                    robots={robots}
                    compareIds={compareList}
                    onRemoveFromCompare={handleRemoveFromCompare}
                    onClearCompare={handleClearCompare}
                    onSelectRobot={setSelectedRobotId}
                  />
                );

              case 'sell':
                return (
                  <SellRobot
                    currentUserId={currentUser ? currentUser.id : null}
                    onListingCreated={handleNewListingCreated}
                    onLoginClick={() => setShowLoginModal(true)}
                  />
                );

              case 'ai-assistant':
                return (
                  <AIAssistant
                    onViewRobot={setSelectedRobotId}
                  />
                );

              case 'dashboard':
                return (
                  <Dashboards
                    currentUser={currentUser}
                    robots={robots}
                    onSelectRobot={setSelectedRobotId}
                    onApproveListing={handleApproveListing}
                    onRejectListing={handleRejectListing}
                  />
                );

              case 'inbox':
                return (
                  <ChatComponent
                    currentUserId={currentUser ? currentUser.id : null}
                    currentUsername={currentUser ? currentUser.username : ''}
                    activeThreadId={activeThreadId}
                    setActiveThreadId={setActiveThreadId}
                  />
                );               case 'wishlist':
                // Renders Saved Wishlist items
                return (
                  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6" id="wishlist-viewport">
                    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
                      <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white sm:text-2xl flex items-center space-x-2">
                        <Heart className="h-6 w-6 text-red-500 fill-current" />
                        <span>Saved System Wishlist</span>
                      </h1>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Bookmarked robotic configurations saved to local browser cache.</p>
                    </div>

                    {wishlist.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {approvedRobots.filter(r => wishlist.includes(r.id)).map((robot) => (
                          <div 
                            key={robot.id}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                            onClick={() => setSelectedRobotId(robot.id)}
                          >
                            <img src={robot.imageUrl} alt={robot.name} className="aspect-video w-full object-cover" referrerPolicy="no-referrer" />
                            <div className="p-4 flex items-center justify-between">
                              <div>
                                <h3 className="text-xs font-bold text-zinc-900 dark:text-white">{robot.name}</h3>
                                <p className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold mt-0.5">${robot.price.toLocaleString()}</p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWishlist(robot.id);
                                }}
                                className="p-2.5 rounded-lg text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                                title="Remove Bookmark"
                              >
                                <Trash2Icon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 italic p-6 bg-white dark:bg-zinc-900 border border-zinc-250/80 dark:border-zinc-800/80 rounded-xl text-center max-w-md mx-auto shadow-sm">
                        Your bookmark chest is empty. Go to the marketplace and click the heart icons to bookmark.
                      </p>
                    )}
                  </div>
                );

              case 'about':
                return (
                  <AboutView onBrowse={() => setActiveTab('marketplace')} />
                );

              case 'contact':
                return (
                  <ContactView />
                );

              default:
                return <div className="p-8 text-center text-zinc-400">View Node Unresolved</div>;
            }
          })()
        )}      </main>

      {/* Auth Portal Dialog Overlay */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 dark:bg-black/80 backdrop-blur-sm" id="auth-overlay">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => {
                setShowLoginModal(false);
                setAuthError(null);
              }}
              className="absolute top-4 right-4 text-zinc-400 dark:text-zinc-500 hover:text-zinc-650 dark:hover:text-zinc-300 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg"
              title="Close Panel"
            >
              <XIcon className="h-5 w-5" />
            </button>

            <div className="text-center space-y-1.5">
              <Bot className="h-10 w-10 text-blue-600 dark:text-blue-500 mx-auto animate-bounce" />
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">RoboMarket Sandbox Auth</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Authenticate session keys to transact and manage systems.</p>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-750 dark:text-red-400 text-xs rounded-xl flex items-start space-x-2 animate-fade-in">
                <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Tabs for Login vs Register */}
            <div className="grid grid-cols-2 gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
              <button
                onClick={() => { setAuthMode('login'); setAuthError(null); }}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500 dark:text-zinc-450 hover:text-zinc-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthMode('register'); setAuthError(null); }}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'register'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500 dark:text-zinc-450 hover:text-zinc-700'
                }`}
              >
                Create Node
              </button>
            </div>

            {authMode === 'login' ? (
              <>
                {/* QUICK SANDBOX ACCOUNTS (One-click) */}
                <div className="space-y-2">
                  <span className="text-[9px] font-bold font-mono text-zinc-400 dark:text-zinc-500 uppercase block tracking-wider">Quick Bypass Profiles</span>
                  
                  {/* Profile 1: Admin */}
                  <button
                    onClick={() => handleLoginSubmit('admin@robomarket.ai', 'password123')}
                    disabled={isAuthenticating}
                    className="w-full text-left p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 border border-zinc-200 dark:border-zinc-700 hover:border-amber-300 dark:hover:border-amber-500 flex items-center justify-between cursor-pointer group transition-colors shadow-sm min-h-[44px]"
                  >
                    <div className="flex items-center space-x-3">
                      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=admin" className="h-8 w-8 bg-zinc-100 dark:bg-zinc-900 rounded-md border border-zinc-250" />
                      <div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white block group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">admin (Staff Administrator)</span>
                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono block">admin@robomarket.ai</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                  </button>

                  {/* Profile 2: Standard user */}
                  <button
                    onClick={() => handleLoginSubmit('user@robomarket.ai', 'password123')}
                    disabled={isAuthenticating}
                    className="w-full text-left p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-500 flex items-center justify-between cursor-pointer group transition-colors shadow-sm min-h-[44px]"
                  >
                    <div className="flex items-center space-x-3">
                      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=TechEnthusiast99" className="h-8 w-8 bg-zinc-100 dark:bg-zinc-900 rounded-md border border-zinc-250" />
                      <div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">TechEnthusiast99 (Buyer/Seller)</span>
                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono block">user@robomarket.ai</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                  </button>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-zinc-150 dark:border-zinc-800"></div>
                  <span className="flex-shrink mx-3 text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-mono tracking-wider">Or Manual Sign-In</span>
                  <div className="flex-grow border-t border-zinc-150 dark:border-zinc-800"></div>
                </div>

                {/* Text Input Credentials */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLoginSubmit(loginEmailInput, loginPasswordInput);
                  }}
                  className="space-y-3"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono uppercase text-zinc-400">Email Address</label>
                    <input
                      type="email"
                      required
                      value={loginEmailInput}
                      onChange={(e) => setLoginEmailInput(e.target.value)}
                      placeholder="e.g. buyer@robomarket.ai"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 min-h-[44px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono uppercase text-zinc-400">Access Password</label>
                    <input
                      type="password"
                      required
                      value={loginPasswordInput}
                      onChange={(e) => setLoginPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 min-h-[44px]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthenticating || !loginEmailInput.trim() || !loginPasswordInput.trim()}
                    className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer disabled:opacity-40 min-h-[44px] flex items-center justify-center space-x-2 shadow-sm"
                  >
                    {isAuthenticating ? (
                      <>
                        <Bot className="h-4 w-4 animate-spin" />
                        <span>Verifying Secure Keys...</span>
                      </>
                    ) : (
                      <span>Connect Profile</span>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Register Form */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegisterSubmit(registerEmailInput, registerUsernameInput, registerPasswordInput);
                }}
                className="space-y-3 animate-fade-in"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono uppercase text-zinc-400">Username</label>
                  <input
                    type="text"
                    required
                    value={registerUsernameInput}
                    onChange={(e) => setRegisterUsernameInput(e.target.value)}
                    placeholder="e.g. SiliconAssemblyLab"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 min-h-[44px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono uppercase text-zinc-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={registerEmailInput}
                    onChange={(e) => setRegisterEmailInput(e.target.value)}
                    placeholder="e.g. lab@robomarket.ai"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 min-h-[44px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono uppercase text-zinc-400">Choose Secure Password</label>
                  <input
                    type="password"
                    required
                    value={registerPasswordInput}
                    onChange={(e) => setRegisterPasswordInput(e.target.value)}
                    placeholder="Min 6 characters recommended"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 min-h-[44px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating || !registerEmailInput.trim() || !registerUsernameInput.trim() || !registerPasswordInput.trim()}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer disabled:opacity-40 min-h-[44px] flex items-center justify-center space-x-2 shadow-sm"
                >
                  {isAuthenticating ? (
                    <>
                      <Bot className="h-4 w-4 animate-spin" />
                      <span>Provisioning Node Profile...</span>
                    </>
                  ) : (
                    <span>Register Node</span>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Global Footer with brand mission, columns, social and legal links */}
      <footer className="border-t border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-550 dark:text-zinc-400 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              <span className="font-sans text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                RoboMarket<span className="text-blue-600 dark:text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-450 leading-relaxed">
              Empowering global logistics, biotech laboratories, and commercial facilities with certified autonomous machinery and automated AI safety compliance audits.
            </p>
            <div className="flex space-x-3 pt-1">
              <a href="#" className="p-2 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-650 dark:text-zinc-350 rounded-lg transition-all min-h-[36px]" title="Twitter Profile">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="p-2 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-650 dark:text-zinc-350 rounded-lg transition-all min-h-[36px]" title="GitHub Repository">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              </a>
              <a href="#" className="p-2 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-650 dark:text-zinc-350 rounded-lg transition-all min-h-[36px]" title="LinkedIn Corporate">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Marketplace Index */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-900 dark:text-white">Hardware Catalog</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { setSelectedRobotId(null); setActiveTab('marketplace'); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left min-h-[32px] w-full">
                  All Systems Index
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedRobotId(null); setActiveTab('compare'); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left min-h-[32px] w-full">
                  Compare Specifications
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedRobotId(null); setActiveTab('sell'); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left min-h-[32px] w-full">
                  Sell Robotic Hardware
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Intelligent Advisors */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-900 dark:text-white">AI Compliance</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { setSelectedRobotId(null); setActiveTab('ai-assistant'); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left min-h-[32px] w-full">
                  Technical AI Advisor
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedRobotId(null); setActiveTab('marketplace'); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left min-h-[32px] w-full">
                  Automated Listing Audits
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedRobotId(null); setActiveTab('home'); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left min-h-[32px] w-full">
                  Safety Protocols
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Logistics & Legal */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-900 dark:text-white">Logistics & Node</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { setSelectedRobotId(null); setActiveTab('contact'); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left min-h-[32px] w-full">
                  Freight & Customs Support
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedRobotId(null); setActiveTab('about'); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left min-h-[32px] w-full">
                  Sinai Engineering Team
                </button>
              </li>
              <li>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono block">Node: USA-WEST-2-ACTIVE</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-150 dark:border-zinc-800 py-6 text-center text-xs text-zinc-450 dark:text-zinc-500 space-y-2 max-w-7xl mx-auto px-4">
          <p className="leading-relaxed text-[11px] max-w-3xl mx-auto">
            RoboMarket AI is a sandbox university project built with React, Vite, Express, and Tailwind CSS. Cognitive reasoning models are powered server-side by Google Gemini API.
          </p>
          <p className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 pt-1">© 2026 RoboMarket AI Core. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Inline simple icons to replace full bundle if missing
function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  );
}

function Trash2Icon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
  );
}
