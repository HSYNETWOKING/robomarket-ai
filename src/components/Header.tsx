import React, { useState, useEffect } from 'react';
import { Bot, Heart, MessageSquare, Shield, LogOut, User as UserIcon, Menu, X, Sun, Moon, Sparkles, Scale, Cpu, ClipboardList } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  wishlistCount: number;
  onLogout: () => void;
  onLoginClick: () => void;
}

export default function Header({
  currentUser,
  activeTab,
  setActiveTab,
  wishlistCount,
  onLogout,
  onLoginClick
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('robo-theme');
      if (stored === 'light' || stored === 'dark') return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('robo-theme', theme);
  }, [theme]);

  // Lock body scroll when mobile drawer is open for better accessibility
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex cursor-pointer items-center space-x-2 text-blue-600 dark:text-blue-400 hover:scale-102 transition-transform duration-200 active:scale-98"
          id="brand-logo"
        >
          <Bot className="h-8 w-8 text-blue-600 dark:text-blue-500 animate-pulse" />
          <span className="font-sans text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            RoboMarket<span className="text-blue-600 dark:text-blue-400">AI</span>
          </span>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1" id="desktop-nav">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'home' 
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm' 
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
            }`}
            id="nav-home"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('marketplace')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'marketplace' 
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm' 
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
            }`}
            id="nav-marketplace"
          >
            Marketplace
          </button>
          <button
            onClick={() => handleNavClick('compare')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'compare' 
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm' 
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
            }`}
            id="nav-compare"
          >
            Compare Specs
          </button>
          <button
            onClick={() => handleNavClick('sell')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'sell' 
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm' 
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
            }`}
            id="nav-sell"
          >
            Sell Robot
          </button>
          <button
            onClick={() => handleNavClick('ai-assistant')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
              activeTab === 'ai-assistant' 
                ? 'bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-300' 
                : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
            }`}
            id="nav-ai-assistant"
          >
            <Bot className="h-4 w-4 text-blue-500" />
            <span>AI Advisor</span>
          </button>
        </nav>

        {/* Actions Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3" id="header-actions">
          
          {/* Light/Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            id="theme-toggle"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {currentUser ? (
            <>
              {/* Wishlist - Hidden on Mobile, grouped inside the Slide Drawer */}
              <button
                onClick={() => handleNavClick('wishlist')}
                className={`hidden md:flex relative p-2.5 rounded-lg transition-all duration-200 focus:outline-none min-w-[44px] min-h-[44px] items-center justify-center cursor-pointer ${
                  activeTab === 'wishlist' 
                    ? 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
                title="Wishlist"
                id="wishlist-btn"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Direct Messages - Hidden on Mobile, grouped inside the Slide Drawer */}
              <button
                onClick={() => handleNavClick('inbox')}
                className={`hidden md:flex p-2.5 rounded-lg transition-all duration-200 focus:outline-none min-w-[44px] min-h-[44px] items-center justify-center cursor-pointer ${
                  activeTab === 'inbox' 
                    ? 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
                title="Direct Messages"
                id="chat-inbox-btn"
              >
                <MessageSquare className="h-5 w-5" />
              </button>

              {/* User Dashboard - Hidden on Mobile, grouped inside the Slide Drawer */}
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`hidden md:flex p-1.5 sm:pr-3 rounded-lg items-center space-x-2 text-sm font-medium transition-all duration-200 focus:outline-none min-h-[44px] cursor-pointer ${
                  activeTab === 'dashboard' 
                    ? 'bg-zinc-100 text-zinc-900 border border-zinc-200 dark:bg-zinc-800 dark:text-white dark:border-zinc-700' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
                title="User Dashboard"
                id="user-dashboard-btn"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="h-7 w-7 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
                <span className="hidden lg:inline text-xs truncate max-w-[100px] font-semibold">{currentUser.username}</span>
                {currentUser.role === 'admin' && (
                  <Shield className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" title="Administrator" />
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="hidden md:flex p-2.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none min-w-[44px] min-h-[44px] items-center justify-center cursor-pointer"
                title="Sign Out"
                id="logout-btn"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="hidden md:flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all duration-200 min-h-[44px] cursor-pointer"
              id="login-trigger-btn"
            >
              <UserIcon className="h-4 w-4" />
              <span>Connect Profile</span>
            </button>
          )}

          {/* Mobile Drawer Hamburger Trigger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Accessible Full-Height Mobile Slide-In Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex" id="mobile-drawer-container" role="dialog" aria-modal="true">
          {/* Dimmed backdrop with clean fade-in */}
          <div 
            className="fixed inset-0 bg-zinc-900/60 dark:bg-black/70 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content panel sliding in from the right */}
          <div className="relative ml-auto w-full max-w-xs h-full bg-white dark:bg-zinc-900 p-6 shadow-2xl flex flex-col justify-between border-l border-zinc-200 dark:border-zinc-800 animate-slide-in-right overflow-y-auto z-10">
            
            {/* Top row with Logo and Explicit Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <Bot className="h-6 w-6 text-blue-600 dark:text-blue-500 animate-pulse" />
                <span className="font-sans text-base font-bold tracking-tight text-zinc-900 dark:text-white">
                  RoboMarket<span className="text-blue-600 dark:text-blue-400">AI</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav links collection */}
            <div className="space-y-6 py-6 flex-1 overflow-y-auto">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">RoboMarket Navigation</p>
                <div className="space-y-1">
                  <button
                    onClick={() => handleNavClick('home')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] cursor-pointer ${
                      activeTab === 'home'
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Bot className="h-5 w-5 text-blue-500" />
                    <span>Home & Feed</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('marketplace')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] cursor-pointer ${
                      activeTab === 'marketplace'
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Cpu className="h-5 w-5 text-purple-500" />
                    <span>Robotic Catalog</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('compare')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] cursor-pointer ${
                      activeTab === 'compare'
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Scale className="h-5 w-5 text-amber-500" />
                    <span>Compare Specs</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('sell')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] cursor-pointer ${
                      activeTab === 'sell'
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <ClipboardList className="h-5 w-5 text-teal-500" />
                    <span>Sell Systems</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('ai-assistant')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] cursor-pointer ${
                      activeTab === 'ai-assistant'
                        ? 'bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-300'
                        : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/20'
                    }`}
                  >
                    <Bot className="h-5 w-5 text-blue-600" />
                    <span className="flex items-center space-x-1.5">
                      <span>AI Advisor</span>
                      <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
                    </span>
                  </button>
                </div>
              </div>

              {currentUser && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Your Account</p>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] cursor-pointer ${
                        activeTab === 'dashboard'
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                          : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <img
                        src={currentUser.avatar}
                        alt="Profile"
                        className="h-5 w-5 rounded-full border border-zinc-200 bg-zinc-100"
                      />
                      <span>Sandbox Dashboard</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('wishlist')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] cursor-pointer ${
                        activeTab === 'wishlist'
                          ? 'bg-red-50 text-red-650 dark:bg-red-950/20 dark:text-red-400'
                          : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <Heart className="h-5 w-5 text-red-500" />
                      <span>Saved Wishlist ({wishlistCount})</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('inbox')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] cursor-pointer ${
                        activeTab === 'inbox'
                          ? 'bg-blue-50 text-blue-650 dark:bg-blue-950/20 dark:text-blue-400'
                          : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      <span>Chat negotiations</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom action controls */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              {currentUser ? (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 py-3 rounded-xl text-sm font-bold transition-all duration-200 min-h-[44px] cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Disconnect Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 py-3 rounded-xl text-sm font-bold transition-all duration-200 min-h-[44px] cursor-pointer"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Connect Sandbox Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
