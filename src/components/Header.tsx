import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bot, Shield, LogOut, User as UserIcon, Menu, X, Wallet, Key, CreditCard, 
  Layers, Upload, Scale, MessageSquare, LayoutGrid, Activity, Bell, FileText, 
  Settings, HelpCircle, Home
} from 'lucide-react';
import { User, WalletState, ApiKeyPreference } from '../types';

interface HeaderProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  wishlistCount: number;
  onLogout: () => void;
  onLoginClick: () => void;
  walletState: WalletState;
  onOpenWalletModal: () => void;
  apiKeyPref?: ApiKeyPreference;
}

export default function Header({
  currentUser,
  activeTab,
  setActiveTab,
  wishlistCount,
  onLogout,
  onLoginClick,
  walletState,
  onOpenWalletModal,
  apiKeyPref
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Phase 4: Prevent body scrolling when mobile drawer is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const shortAddress = walletState.address
    ? `${walletState.address.substring(0, 6)}...${walletState.address.substring(walletState.address.length - 4)}`
    : null;

  const drawerPortal = mobileMenuOpen && typeof document !== 'undefined' ? createPortal(
    <div className="fixed inset-0 z-[9999] flex" id="mobile-menu-drawer">
      {/* Dark backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 z-10 text-slate-900 overflow-y-auto">
        
        <div className="p-5">
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-emerald-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
              <span className="font-sans text-base font-black text-slate-900">RoboMarket AI</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Account Card */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            {currentUser ? (
              <div className="flex items-center space-x-2.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="h-9 w-9 rounded-full border border-emerald-300 bg-white object-cover"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block truncate max-w-[120px]">{currentUser.username}</span>
                  <span className="text-[10px] text-slate-500 font-mono capitalize block">{currentUser.role}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-slate-400" />
                <span className="text-xs text-slate-600 font-semibold">Guest Visitor</span>
              </div>
            )}

            {currentUser ? (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-xs font-bold flex items-center space-x-1 min-h-[44px]"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  setMobileMenuOpen(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl cursor-pointer min-h-[44px]"
              >
                Login
              </button>
            )}
          </div>

          {/* Navigation Links - All 12 Items strictly included */}
          <nav className="space-y-1.5 py-4" id="mobile-nav-list">
            
            {/* 1. Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center space-x-3 ${
                activeTab === 'home'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </button>

            {/* 2. Marketplace */}
            <button
              onClick={() => handleNavClick('marketplace')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center space-x-3 ${
                activeTab === 'marketplace'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Marketplace</span>
            </button>

            {/* 3. AI Advisor */}
            <button
              onClick={() => handleNavClick('ai-assistant')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center space-x-3 ${
                activeTab === 'ai-assistant'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-emerald-50 text-emerald-700'
              }`}
            >
              <Bot className="h-4 w-4 text-emerald-600" />
              <span>AI Advisor</span>
            </button>

            {/* 4. Pricing & Models */}
            <button
              onClick={() => handleNavClick('pricing')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center space-x-3 ${
                activeTab === 'pricing'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Pricing & Models</span>
            </button>

            {/* 5. API Vault (BYOK) */}
            <button
              onClick={() => handleNavClick('keys')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center justify-between ${
                activeTab === 'keys'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Key className="h-4 w-4" />
                <span>API Vault (BYOK)</span>
              </div>
              {apiKeyPref?.mode === 'custom' && (
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>

            {/* 6. API Health Monitor */}
            <button
              onClick={() => handleNavClick('api-health')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center space-x-3 ${
                activeTab === 'api-health'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>API Health Monitor</span>
            </button>

            {/* 7. Price Alerts */}
            <button
              onClick={() => handleNavClick('alerts')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center space-x-3 ${
                activeTab === 'alerts'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700'
              }`}
            >
              <Bell className="h-4 w-4" />
              <span>Price Alerts</span>
            </button>

            {/* 8. Invoices */}
            <button
              onClick={() => handleNavClick('invoices')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center space-x-3 ${
                activeTab === 'invoices'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Invoices</span>
            </button>

            {/* 9. Ledger */}
            <button
              onClick={() => handleNavClick('wallet')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center space-x-3 ${
                activeTab === 'wallet'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              <span>Ledger</span>
            </button>

            {/* 10. Settings */}
            <button
              onClick={() => handleNavClick('settings')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center space-x-3 ${
                activeTab === 'settings'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>

            {/* 11. Support */}
            <button
              onClick={() => handleNavClick('support')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center space-x-3 ${
                activeTab === 'support'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700'
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Support</span>
            </button>

            {/* Extra Merchant & Dashboard Tools */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <button
                onClick={() => handleNavClick('sell')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center space-x-3 ${
                  activeTab === 'sell'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Upload className="h-4 w-4" />
                <span>List Hardware / Sell</span>
              </button>

              <button
                onClick={() => handleNavClick('compare')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center space-x-3 ${
                  activeTab === 'compare'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Scale className="h-4 w-4" />
                <span>Compare Specs</span>
              </button>

              <button
                onClick={() => handleNavClick('chats')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center space-x-3 ${
                  activeTab === 'chats'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Inbox Messages</span>
              </button>

              {currentUser && (
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center space-x-3 ${
                    activeTab === 'dashboard'
                      ? 'bg-emerald-600 text-white'
                      : 'text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  <Shield className="h-4 w-4 text-amber-600" />
                  <span>User & Admin Dashboard</span>
                </button>
              )}
            </div>

            {/* 12. Logout (when logged in) */}
            {currentUser && (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center space-x-3 text-rose-600 bg-rose-50 hover:bg-rose-100 mt-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            )}

          </nav>
        </div>

        {/* Bottom Actions in Drawer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-2">
          <button
            onClick={() => {
              onOpenWalletModal();
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-center space-x-2 rounded-xl py-3 px-4 text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
              walletState.isConnected
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
            }`}
          >
            <Wallet className="h-4 w-4" />
            <span>{walletState.isConnected ? shortAddress : 'Connect Web3 Wallet'}</span>
          </button>
        </div>

      </div>
    </div>,
    document.body
  ) : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-colors duration-200 shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex cursor-pointer items-center space-x-2.5 group"
          id="brand-logo"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Bot className="h-5 w-5" />
          </div>
          <span className="font-sans text-lg font-black tracking-tight text-slate-900">
            RoboMarket<span className="text-emerald-600">SaaS</span>
          </span>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1" id="desktop-nav">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'home' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick('marketplace')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'marketplace' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            Marketplace
          </button>

          <button
            onClick={() => handleNavClick('ai-assistant')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'ai-assistant' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <Bot className="h-3.5 w-3.5 text-emerald-600" />
            <span>AI Advisor</span>
          </button>

          <button
            onClick={() => handleNavClick('pricing')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'pricing' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-emerald-600" />
            <span>Pricing</span>
          </button>

          <button
            onClick={() => handleNavClick('keys')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'keys' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <Key className="h-3.5 w-3.5 text-emerald-600" />
            <span>BYOK Vault</span>
            {apiKeyPref?.mode === 'custom' && (
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('wallet')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'wallet' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
            <span>Ledger</span>
          </button>

          <button
            onClick={() => handleNavClick('api-health')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'api-health' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-emerald-600" />
            <span>Health</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                activeTab === 'dashboard' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Shield className="h-3.5 w-3.5 text-amber-600" />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Right Actions Menu */}
        <div className="flex items-center space-x-2.5" id="header-actions">
          
          {/* Web3 Wallet Trigger */}
          <button
            onClick={onOpenWalletModal}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
              walletState.isConnected
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100/80'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20'
            }`}
            id="wallet-modal-header-btn"
          >
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">{walletState.isConnected ? shortAddress : 'Connect Wallet'}</span>
            <span className="sm:hidden">{walletState.isConnected ? 'Wallet' : 'Wallet'}</span>
          </button>

          {/* User Account */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => handleNavClick('dashboard')}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-100 transition-colors font-semibold cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="h-6 w-6 rounded-full border border-emerald-300 bg-white object-cover"
                />
                <span className="font-bold">{currentUser.username}</span>
              </button>

              <button
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="hidden sm:flex items-center space-x-1.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <UserIcon className="h-3.5 w-3.5 text-emerald-600" />
              <span>Login</span>
            </button>
          )}

          {/* Mobile & Tablet Drawer Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
            id="mobile-burger-trigger"
          >
            {mobileMenuOpen ? <X className="h-6 w-6 text-slate-900" /> : <Menu className="h-6 w-6 text-slate-900" />}
          </button>
        </div>
      </div>

      {/* Render Mobile Drawer via Portal directly into document.body */}
      {drawerPortal}
    </header>
  );
}
