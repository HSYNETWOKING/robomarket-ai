import React, { useState, useEffect } from 'react';
import { Bot, ChevronRight } from 'lucide-react';
import { User, Robot, SaaSPlan, AIModelSpec, WalletState, UserApiKey, ApiKeyPreference, CryptoPayment } from './types';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Marketplace from './components/Marketplace';
import RobotDetails from './components/RobotDetails';
import CompareRobots from './components/CompareRobots';
import SellRobot from './components/SellRobot';
import AIAssistant from './components/AIAssistant';
import Dashboards from './components/Dashboards';
import ChatComponent from './components/ChatComponent';
import { AboutView, ContactView, ApiHealthView, PriceAlertsView, InvoicesView, SettingsView, SupportView } from './components/StaticPages';
import { Web3WalletModal } from './components/Web3WalletModal';
import { CryptoPaymentModal } from './components/CryptoPaymentModal';
import { PricingMatrix } from './components/PricingMatrix';
import { ApiKeyVault } from './components/ApiKeyVault';
import { WalletPaymentsHistory } from './components/WalletPaymentsHistory';

// Default initial datasets for SaaS & Web3 strictly matching interface contracts
const INITIAL_PLANS: SaaSPlan[] = [
  {
    id: "plan_free",
    name: "Free Developer Tier",
    monthlyPriceUSD: 0,
    cryptoPrices: { ETH: 0, BNB: 0, USDT: 0, USDC: 0, MATIC: 0, SOL: 0 },
    tokenAllowance: "20,000 tokens / mo",
    tokenCount: 20000,
    maxRequestsPerMin: 60,
    byokSupported: true,
    modelsAccess: ["Gemini 3.6 Flash", "Llama 3.3 70B"],
    features: [
      "20k Monthly AI Tokens",
      "Standard Speed Tier",
      "60 RPM Rate Limit",
      "Community Discord Support"
    ],
    supportLevel: "Community",
    badge: "Free Starter"
  },
  {
    id: "plan_pro",
    name: "Pro Builder Plan",
    monthlyPriceUSD: 29,
    cryptoPrices: { ETH: 0.01, BNB: 0.05, USDT: 29, USDC: 29, MATIC: 35, SOL: 0.2 },
    tokenAllowance: "500,000 tokens / mo",
    tokenCount: 500000,
    maxRequestsPerMin: 180,
    byokSupported: true,
    modelsAccess: ["Gemini 3.6 Flash", "Gemini 3.1 Pro", "GPT-4o", "Claude 3.5 Sonnet", "DeepSeek V3"],
    features: [
      "500k Monthly AI Tokens",
      "Access to Pro LLMs (GPT-4o, Gemini 3.1 Pro)",
      "180 RPM Rate Limit",
      "BYOK Key Vault Integration",
      "Chat-based Web3 Direct Ordering",
      "Priority Email Support"
    ],
    isPopular: true,
    supportLevel: "Priority 24/7",
    badge: "Most Popular"
  },
  {
    id: "plan_enterprise",
    name: "Enterprise Fleet Tier",
    monthlyPriceUSD: 199,
    cryptoPrices: { ETH: 0.065, BNB: 0.35, USDT: 199, USDC: 199, MATIC: 240, SOL: 1.4 },
    tokenAllowance: "5,000,000 tokens / mo",
    tokenCount: 5000000,
    maxRequestsPerMin: 300,
    byokSupported: true,
    modelsAccess: ["All Models", "Gemini 3.1 Pro", "GPT-4o", "Claude 3.5 Sonnet", "DeepSeek R1 Reasoning", "Grok 2"],
    features: [
      "5M Monthly AI Tokens",
      "Access to ALL Reasoning Models (DeepSeek R1, Grok 2)",
      "300 RPM High Throughput",
      "BYOK Unlimited Key Vault",
      "Smart Contract Web3 Escrow Invoicing",
      "Dedicated Technical Account Mgr"
    ],
    supportLevel: "Dedicated SLA",
    badge: "Enterprise"
  },
  {
    id: "plan_pack_100k",
    name: "+100k Token Credit Pack",
    monthlyPriceUSD: 10,
    cryptoPrices: { ETH: 0.0035, BNB: 0.018, USDT: 10, USDC: 10, MATIC: 12, SOL: 0.07 },
    tokenAllowance: "+100,000 top-up tokens",
    tokenCount: 100000,
    maxRequestsPerMin: 180,
    byokSupported: true,
    modelsAccess: ["Inherits active subscription tier models"],
    features: [
      "One-Time Instant Top-Up",
      "Never Expires",
      "Usable across all models",
      "Web3 On-Chain Instant Deposit"
    ],
    supportLevel: "Instant",
    badge: "Top-Up Pack"
  }
];

const INITIAL_MODELS: AIModelSpec[] = [
  {
    id: "m_gemini_flash",
    name: "Gemini 3.6 Flash",
    provider: "Google",
    contextWindow: "1,000,000 tokens",
    tokenRateLimit: "1,000 RPM",
    speedTier: "Ultra Fast",
    reasoningTier: "High",
    costPer1kTokensUSD: 0.0001,
    availability: "Free",
    byokSupported: true,
    description: "Multimodal speed demon optimized for real-time chat, search grounding, and hardware specs analysis."
  },
  {
    id: "m_gemini_pro",
    name: "Gemini 3.1 Pro",
    provider: "Google",
    contextWindow: "2,000,000 tokens",
    tokenRateLimit: "300 RPM",
    speedTier: "Fast",
    reasoningTier: "God Tier",
    costPer1kTokensUSD: 0.00125,
    availability: "Pro",
    byokSupported: true,
    description: "Industry-leading 2M context window with complex reasoning and multimodal coding intelligence."
  },
  {
    id: "m_gpt4o",
    name: "GPT-4o",
    provider: "OpenAI",
    contextWindow: "128,000 tokens",
    tokenRateLimit: "500 RPM",
    speedTier: "Fast",
    reasoningTier: "High",
    costPer1kTokensUSD: 0.0025,
    availability: "Pro",
    byokSupported: true,
    description: "Flagship high-speed intelligence model across text and vision tasks."
  },
  {
    id: "m_claude_sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    contextWindow: "200,000 tokens",
    tokenRateLimit: "200 RPM",
    speedTier: "Standard",
    reasoningTier: "God Tier",
    costPer1kTokensUSD: 0.003,
    availability: "Pro",
    byokSupported: true,
    description: "Unmatched technical writing, system design, and precision code generation."
  },
  {
    id: "m_deepseek_r1",
    name: "DeepSeek R1 Reasoning",
    provider: "DeepSeek",
    contextWindow: "64,000 tokens",
    tokenRateLimit: "100 RPM",
    speedTier: "Standard",
    reasoningTier: "God Tier",
    costPer1kTokensUSD: 0.0005,
    availability: "Enterprise",
    byokSupported: true,
    description: "Open-weights chain-of-thought reasoning engine rivaling OpenAI o1."
  },
  {
    id: "m_grok_2",
    name: "Grok 2",
    provider: "xAI",
    contextWindow: "128,000 tokens",
    tokenRateLimit: "250 RPM",
    speedTier: "Fast",
    reasoningTier: "High",
    costPer1kTokensUSD: 0.002,
    availability: "Enterprise",
    byokSupported: true,
    description: "Real-time web knowledge model with high-speed reasoning abilities."
  }
];

// URL & Navigation Route Helpers
function getTabFromPath(path: string): string {
  const clean = path.toLowerCase().replace(/\/$/, '');
  if (clean === '/admin/dashboard' || clean === '/admin') return 'admin-dashboard';
  if (clean === '/dashboard' || clean === '/user/dashboard' || clean === '/user') return 'user-dashboard';
  if (clean === '/manager/dashboard' || clean === '/manager') return 'manager-dashboard';
  if (clean === '/marketplace') return 'marketplace';
  if (clean === '/ai-assistant' || clean === '/ai-advisor') return 'ai-assistant';
  if (clean === '/pricing') return 'pricing';
  if (clean === '/keys' || clean === '/api-vault') return 'keys';
  if (clean === '/api-health' || clean === '/health') return 'api-health';
  if (clean === '/alerts' || clean === '/price-alerts') return 'alerts';
  if (clean === '/invoices') return 'invoices';
  if (clean === '/wallet' || clean === '/ledger') return 'wallet';
  if (clean === '/settings') return 'settings';
  if (clean === '/support') return 'support';
  if (clean === '/sell') return 'sell';
  if (clean === '/compare') return 'compare';
  if (clean === '/chats' || clean === '/inbox') return 'inbox';
  return 'home';
}

function getPathFromTab(tab: string, userRole?: string): string {
  const role = (userRole || '').toLowerCase();
  switch (tab) {
    case 'admin-dashboard': return '/admin/dashboard';
    case 'user-dashboard': return '/dashboard';
    case 'manager-dashboard': return '/manager/dashboard';
    case 'dashboard':
      if (role === 'admin') return '/admin/dashboard';
      if (role === 'manager') return '/manager/dashboard';
      return '/dashboard';
    case 'marketplace': return '/marketplace';
    case 'ai-assistant': return '/ai-assistant';
    case 'pricing': return '/pricing';
    case 'keys': return '/keys';
    case 'api-health': return '/api-health';
    case 'alerts': return '/alerts';
    case 'invoices': return '/invoices';
    case 'wallet': return '/wallet';
    case 'settings': return '/settings';
    case 'support': return '/support';
    case 'sell': return '/sell';
    case 'compare': return '/compare';
    case 'inbox': return '/inbox';
    default: return '/';
  }
}

export default function App() {
  // Session / User States
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('robo_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Auth Form states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmailInput, setLoginEmailInput] = useState('');
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [registerUsernameInput, setRegisterUsernameInput] = useState('');
  const [registerEmailInput, setRegisterEmailInput] = useState('');
  const [registerPasswordInput, setRegisterPasswordInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active View Navigation initialized from URL location
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return getTabFromPath(window.location.pathname);
    }
    return 'home';
  });
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);

  const navigateToTab = (tab: string) => {
    setSelectedRobotId(null);
    const userRole = (currentUser?.role || '').toLowerCase();
    
    let targetTab = tab;
    if (tab === 'dashboard') {
      if (userRole === 'admin') targetTab = 'admin-dashboard';
      else if (userRole === 'manager') targetTab = 'manager-dashboard';
      else targetTab = 'user-dashboard';
    }

    setActiveTab(targetTab);
    const targetPath = getPathFromTab(targetTab, currentUser?.role);
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  // Web3 Wallet State
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletState, setWalletState] = useState<WalletState>(() => {
    const cached = localStorage.getItem('mock_wallet_state');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return {
      isConnected: true,
      address: "0x3C44CdD06a900fa2b585dd299e03d12FA4293BC1",
      walletType: "MetaMask",
      network: "Ethereum Mainnet",
      chainId: 1,
      balances: { ETH: 2.45, BNB: 12.8, USDT: 1450.00, USDC: 820.50, MATIC: 350.00, SOL: 18.25 }
    };
  });

  // Crypto Checkout Modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<SaaSPlan | null>(null);

  // BYOK API Keys Vault
  const [userKeys, setUserKeys] = useState<UserApiKey[]>(() => {
    const cached = localStorage.getItem('mock_user_api_keys');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return [
      {
        id: "key_1",
        provider: "gemini",
        keyName: "Personal Gemini Pro Key",
        maskedKey: "AIzaSy...4a9f",
        rawKey: "AIzaSy_demo_raw_key_unmasked",
        createdAt: "2026-07-20T10:00:00Z",
        status: "active"
      }
    ];
  });

  const [apiKeyPref, setApiKeyPref] = useState<ApiKeyPreference>(() => {
    const cached = localStorage.getItem('mock_api_key_pref');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return { mode: 'platform', activeCustomKeyId: null };
  });

  // Payments History Ledger
  const [payments, setPayments] = useState<CryptoPayment[]>(() => {
    const cached = localStorage.getItem('mock_crypto_payments');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return [
      {
        id: "pay_101",
        txHash: "0x9f82a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
        amountCrypto: 0.01,
        currency: "ETH",
        amountUSD: 29,
        type: "subscription",
        planId: "plan_pro",
        planName: "Pro Builder Plan",
        userAddress: "0x3C44CdD06a900fa2b585dd299e03d12FA4293BC1",
        userName: "TechEnthusiast99",
        status: "confirmed",
        timestamp: "2026-07-22T14:30:00Z",
        blockNumber: 19850123,
        receiptUrl: "https://etherscan.io/tx/0x9f82a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9"
      }
    ];
  });

  // Global Datasets
  const [robots, setRobots] = useState<Robot[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean | null>(null);

  // Sync wallet state to localStorage
  useEffect(() => {
    localStorage.setItem('mock_wallet_state', JSON.stringify(walletState));
  }, [walletState]);

  // Sync keys & preferences
  useEffect(() => {
    localStorage.setItem('mock_user_api_keys', JSON.stringify(userKeys));
  }, [userKeys]);

  useEffect(() => {
    localStorage.setItem('mock_api_key_pref', JSON.stringify(apiKeyPref));
  }, [apiKeyPref]);

  useEffect(() => {
    localStorage.setItem('mock_crypto_payments', JSON.stringify(payments));
  }, [payments]);

  // Fetch all robots from backend
  const fetchRobots = async () => {
    try {
      const response = await fetch('/api/robots?status=all');
      if (response.ok) {
        const data = await response.json();
        setRobots(data);
      }
    } catch (err) {
      console.error("Error loading robots:", err);
    }
  };

  // Revalidate current session role from backend
  const refreshUserRole = async () => {
    const token = localStorage.getItem('robo_token');
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setCurrentUser(data.user);
          localStorage.setItem('robo_user', JSON.stringify(data.user));
        }
      }
    } catch (e) {
      console.error("Role revalidation failed:", e);
    }
  };

  useEffect(() => {
    fetchRobots();

    fetch('/api/ai/status')
      .then(res => res.json())
      .then(data => setHasGeminiKey(data.hasGeminiKey))
      .catch(() => setHasGeminiKey(false));
    
    refreshUserRole();

    const cachedWish = localStorage.getItem('robo_wishlist');
    if (cachedWish) setWishlist(JSON.parse(cachedWish));

    const cachedCompare = localStorage.getItem('robo_compare');
    if (cachedCompare) setCompareList(JSON.parse(cachedCompare));

    // Phase 2: Add popstate browser navigation support
    const handlePopState = () => {
      const newTab = getTabFromPath(window.location.pathname);
      setActiveTab(newTab);
    };

    // Phase 2: Cross-tab session & role sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'robo_user' || e.key === 'robo_token') {
        const cached = localStorage.getItem('robo_user');
        const token = localStorage.getItem('robo_token');
        if (cached && token) {
          try {
            setCurrentUser(JSON.parse(cached));
          } catch {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    };

    // Re-verify role on window focus
    const handleWindowFocus = () => {
      refreshUserRole();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  const saveUserSession = (user: User | null, token?: string) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('robo_user', JSON.stringify(user));
      if (token) localStorage.setItem('robo_token', token);
    } else {
      localStorage.removeItem('robo_user');
      localStorage.removeItem('robo_token');
    }
  };

  const toggleWishlist = (id: string) => {
    const updated = wishlist.includes(id) ? wishlist.filter(item => item !== id) : [...wishlist, id];
    setWishlist(updated);
    localStorage.setItem('robo_wishlist', JSON.stringify(updated));
  };

  const toggleCompare = (id: string) => {
    if (!compareList.includes(id) && compareList.length >= 3) {
      alert("Specification matrix can contrast up to 3 robotic systems side-by-side.");
      return;
    }
    const updated = compareList.includes(id) ? compareList.filter(item => item !== id) : [...compareList, id];
    setCompareList(updated);
    localStorage.setItem('robo_compare', JSON.stringify(updated));
  };

  // Login handler
  const handleLoginSubmit = async (email: string, password?: string) => {
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

        const userRole = (data.user?.role || '').toLowerCase();
        if (userRole === 'admin') {
          navigateToTab('admin-dashboard');
        } else if (userRole === 'manager') {
          navigateToTab('manager-dashboard');
        } else {
          navigateToTab('user-dashboard');
        }
      } else {
        setAuthError(data.error || "Authentication failed.");
      }
    } catch (err) {
      setAuthError("Network error reaching authentication server.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleRegisterSubmit = async (email: string, username: string, password?: string) => {
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

        const userRole = (data.user?.role || '').toLowerCase();
        if (userRole === 'admin') {
          navigateToTab('admin-dashboard');
        } else if (userRole === 'manager') {
          navigateToTab('manager-dashboard');
        } else {
          navigateToTab('user-dashboard');
        }
      } else {
        setAuthError(data.error || "Registration failed.");
      }
    } catch (err) {
      setAuthError("Network error reaching registration server.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    saveUserSession(null);
    navigateToTab('home');
  };

  // BYOK Actions
  const handleAddKey = (keyData: { provider: any; keyName: string; rawKey: string }) => {
    const newKey: UserApiKey = {
      id: "key_" + Date.now(),
      provider: keyData.provider,
      keyName: keyData.keyName,
      maskedKey: `${keyData.rawKey.substring(0, 6)}...${keyData.rawKey.substring(keyData.rawKey.length - 4)}`,
      rawKey: keyData.rawKey,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    setUserKeys(prev => [newKey, ...prev]);
    setApiKeyPref({ mode: 'custom', activeCustomKeyId: newKey.id });
  };

  const handleDeleteKey = (keyId: string) => {
    setUserKeys(prev => prev.filter(k => k.id !== keyId));
    if (apiKeyPref.activeCustomKeyId === keyId) {
      setApiKeyPref({ mode: 'platform', activeCustomKeyId: null });
    }
  };

  // Plan Selection & Crypto Checkout
  const handleOpenPlanCheckout = (plan: SaaSPlan | string) => {
    const target = typeof plan === 'string' ? INITIAL_PLANS.find(p => p.id === plan) || INITIAL_PLANS[1] : plan;
    setSelectedCheckoutPlan(target);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (payment: CryptoPayment) => {
    setPayments(prev => [payment, ...prev]);
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        planId: payment.planId,
        planName: payment.planName,
        tokenBalance: (currentUser.tokenBalance || 20000) + (payment.planId.includes('enterprise') ? 5000000 : 500000)
      };
      saveUserSession(updatedUser);
    }
  };

  const handleInitiateChat = async (sellerId: string, sellerName: string, robotId: string, robotName: string) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId: currentUser.id, buyerName: currentUser.username, sellerId, sellerName, robotId, robotName })
      });
      if (response.ok) {
        const data = await response.json();
        setActiveThreadId(data.id);
        setActiveTab('inbox');
        setSelectedRobotId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" id="applet-shell">
      {/* Header Bar */}
      <Header
        currentUser={currentUser}
        activeTab={selectedRobotId ? 'marketplace' : activeTab}
        setActiveTab={navigateToTab}
        wishlistCount={wishlist.length}
        onLogout={handleLogout}
        onLoginClick={() => setShowLoginModal(true)}
        walletState={walletState}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        apiKeyPref={apiKeyPref}
      />

      {/* Main Container */}
      <main className="flex-1 bg-slate-50 px-4 sm:px-6 lg:px-8 py-6">
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
                onReviewSubmitted={fetchRobots}
                hasGeminiKey={hasGeminiKey}
              />
            ) : (
              <div className="p-8 text-center text-slate-500 font-medium">Profile not found.</div>
            );
          })()
        ) : (
          (() => {
            switch (activeTab) {
              case 'home':
                return (
                  <LandingPage
                    plans={INITIAL_PLANS}
                    models={INITIAL_MODELS}
                    walletState={walletState}
                    onSelectPlan={handleOpenPlanCheckout}
                    onOpenWalletModal={() => setIsWalletModalOpen(true)}
                    onNavigateTab={(tab) => {
                      setSelectedRobotId(null);
                      setActiveTab(tab);
                    }}
                    onViewRobot={(id) => setSelectedRobotId(id)}
                    onLoginClick={() => setShowLoginModal(true)}
                    hasGeminiKey={hasGeminiKey}
                  />
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
                    hasGeminiKey={hasGeminiKey}
                  />
                );

              case 'ai-assistant':
                return (
                  <AIAssistant
                    onViewRobot={setSelectedRobotId}
                    hasGeminiKey={hasGeminiKey}
                    apiKeyPref={apiKeyPref}
                    onOpenCheckout={(planId) => handleOpenPlanCheckout(planId)}
                  />
                );

              case 'pricing':
                return (
                  <PricingMatrix
                    plans={INITIAL_PLANS}
                    models={INITIAL_MODELS}
                    walletState={walletState}
                    onSelectPlan={handleOpenPlanCheckout}
                  />
                );

              case 'keys':
                return (
                  <ApiKeyVault
                    userKeys={userKeys}
                    pref={apiKeyPref}
                    onAddKey={handleAddKey}
                    onDeleteKey={handleDeleteKey}
                    onTogglePref={setApiKeyPref}
                  />
                );

              case 'wallet':
                return (
                  <WalletPaymentsHistory
                    walletState={walletState}
                    payments={payments}
                    onOpenWalletModal={() => setIsWalletModalOpen(true)}
                  />
                );

              case 'compare':
                return (
                  <CompareRobots
                    robots={robots}
                    compareIds={compareList}
                    onRemoveFromCompare={(id) => setCompareList(prev => prev.filter(x => x !== id))}
                    onClearCompare={() => setCompareList([])}
                    onSelectRobot={setSelectedRobotId}
                    hasGeminiKey={hasGeminiKey}
                  />
                );

              case 'sell':
                return (
                  <SellRobot
                    currentUserId={currentUser?.id || null}
                    onListingCreated={() => {
                      fetchRobots();
                      navigateToTab('user-dashboard');
                    }}
                    onLoginClick={() => setShowLoginModal(true)}
                  />
                );

              case 'dashboard':
              case 'admin-dashboard':
              case 'user-dashboard':
              case 'manager-dashboard':
                return (
                  <Dashboards
                    currentUser={currentUser}
                    robots={robots}
                    onSelectRobot={setSelectedRobotId}
                    onApproveListing={(id) => { 
                      const token = localStorage.getItem('robo_token');
                      fetch('/api/admin/listings/' + id, { 
                        method: 'PUT', 
                        headers: {
                          'Content-Type':'application/json',
                          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                        }, 
                        body: JSON.stringify({status:'approved'}) 
                      }).then(fetchRobots); 
                    }}
                    onRejectListing={(id) => { 
                      const token = localStorage.getItem('robo_token');
                      fetch('/api/admin/listings/' + id, { 
                        method: 'PUT', 
                        headers: {
                          'Content-Type':'application/json',
                          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                        }, 
                        body: JSON.stringify({status:'rejected'}) 
                      }).then(fetchRobots); 
                    }}
                    requestedTab={activeTab}
                  />
                );

              case 'inbox':
                return (
                  <ChatComponent
                    currentUserId={currentUser?.id || null}
                    currentUsername={currentUser?.username || ''}
                    activeThreadId={activeThreadId}
                    setActiveThreadId={setActiveThreadId}
                  />
                );

              case 'about':
                return <AboutView onBrowse={() => setActiveTab('marketplace')} />;

              case 'contact':
                return <ContactView />;

              case 'api-health':
              case 'health':
                return <ApiHealthView />;

              case 'alerts':
                return <PriceAlertsView />;

              case 'invoices':
                return <InvoicesView />;

              case 'settings':
                return <SettingsView />;

              case 'support':
                return <SupportView />;

              default:
                return <div className="p-8 text-center text-slate-500 font-medium">View Node Unresolved</div>;
            }
          })()
        )}
      </main>

      {/* Web3 Wallet Connection Modal */}
      <Web3WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        walletState={walletState}
        setWalletState={setWalletState}
      />

      {/* On-Chain Crypto Checkout Modal */}
      <CryptoPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedCheckoutPlan}
        walletState={walletState}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Auth Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4 text-slate-900">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <div className="h-10 w-10 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto font-bold">
                <Bot className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-black text-slate-900">RoboMarket SaaS Auth</h2>
              <p className="text-xs text-slate-500 font-medium">Connect account to access token balances & API keys</p>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                {authError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setAuthMode('login')}
                className={`py-2 rounded-lg text-xs font-bold cursor-pointer ${authMode === 'login' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`py-2 rounded-lg text-xs font-bold cursor-pointer ${authMode === 'register' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Register
              </button>
            </div>

            {authMode === 'login' ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Quick Seed Demo Logins</div>
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => handleLoginSubmit('admin@robomarket.ai', 'password123')}
                      className="w-full p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-left text-xs text-amber-900 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                    >
                      <div>
                        <span className="font-bold block">Admin Dashboard Account</span>
                        <span className="text-[10px] text-amber-700 font-mono">admin@robomarket.ai (ADMIN Role)</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-amber-600 shrink-0" />
                    </button>

                    <button
                      onClick={() => handleLoginSubmit('user@robomarket.ai', 'password123')}
                      className="w-full p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-left text-xs text-emerald-900 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                    >
                      <div>
                        <span className="font-bold block">Standard User Account</span>
                        <span className="text-[10px] text-emerald-700 font-mono">user@robomarket.ai (USER Role)</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-emerald-600 shrink-0" />
                    </button>

                    <button
                      onClick={() => handleLoginSubmit('manager@robomarket.ai', 'password123')}
                      className="w-full p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-left text-xs text-blue-900 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                    >
                      <div>
                        <span className="font-bold block">Fleet Manager Account</span>
                        <span className="text-[10px] text-blue-700 font-mono">manager@robomarket.ai (MANAGER Role)</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-blue-600 shrink-0" />
                    </button>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLoginSubmit(loginEmailInput, loginPasswordInput);
                  }}
                  className="space-y-3"
                >
                  <input
                    type="email"
                    required
                    value={loginEmailInput}
                    onChange={(e) => setLoginEmailInput(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:border-emerald-500 focus:outline-none"
                  />
                  <input
                    type="password"
                    required
                    value={loginPasswordInput}
                    onChange={(e) => setLoginPasswordInput(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white uppercase cursor-pointer transition-colors shadow-xs"
                  >
                    Login
                  </button>
                </form>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegisterSubmit(registerEmailInput, registerUsernameInput, registerPasswordInput);
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  required
                  value={registerUsernameInput}
                  onChange={(e) => setRegisterUsernameInput(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:border-emerald-500 focus:outline-none"
                />
                <input
                  type="email"
                  required
                  value={registerEmailInput}
                  onChange={(e) => setRegisterEmailInput(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:border-emerald-500 focus:outline-none"
                />
                <input
                  type="password"
                  required
                  value={registerPasswordInput}
                  onChange={(e) => setRegisterPasswordInput(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white uppercase cursor-pointer transition-colors shadow-xs"
                >
                  Register
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
