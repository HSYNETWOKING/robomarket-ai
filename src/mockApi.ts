// RoboMarket Client-Side Mock Database & API Interceptor Fallback
// This file runs inside the browser and intercept /api calls if the backend is unreachable (e.g., on Vercel static deployments)
import { User, Robot, SaaSPlan, AIModelSpec, UserApiKey, CryptoPayment, WalletState, ApiKeyPreference, CryptoCurrency } from './types';

// Declare a global flag on the window object
declare global {
  interface Window {
    __ROBO_USE_MOCK__?: boolean;
    __ROBO_MOCK_INITIALIZED__?: boolean;
    ethereum?: any;
  }
}

export const INITIAL_SAAS_PLANS: SaaSPlan[] = [
  {
    id: "plan_free",
    name: "Free Tier",
    badge: "Starter",
    monthlyPriceUSD: 0,
    cryptoPrices: { ETH: 0, BNB: 0, USDT: 0, USDC: 0, MATIC: 0, SOL: 0 },
    tokenAllowance: "20,000 tokens / mo",
    tokenCount: 20000,
    modelsAccess: ["Gemini 3.6 Flash", "Llama 3.3 70B"],
    features: [
      "20k Monthly AI Token Allowance",
      "Standard Response Speed",
      "Interactive AI Advisor Chatbot",
      "Custom API Key Vault (BYOK)",
      "Web3 Wallet Authentication",
      "Community Discord & Docs"
    ],
    maxRequestsPerMin: 10,
    supportLevel: "Community",
    byokSupported: true
  },
  {
    id: "plan_pro",
    name: "Pro Plan",
    badge: "Most Popular",
    monthlyPriceUSD: 29,
    cryptoPrices: { ETH: 0.01, BNB: 0.08, USDT: 29, USDC: 29, MATIC: 40, SOL: 0.2 },
    tokenAllowance: "500,000 tokens / mo",
    tokenCount: 500000,
    modelsAccess: ["Gemini 3.6 Flash", "Gemini 3.1 Pro", "GPT-4o", "Claude 3.5 Sonnet", "DeepSeek V3"],
    features: [
      "500,000 Monthly AI Token Allowance",
      "Priority Gemini & High-Speed Engines",
      "Chat-Based Instant Crypto Purchasing",
      "Unlimited Personal API Keys (BYOK)",
      "Side-by-Side Model Benchmarking",
      "Encrypted Local API Key Vault",
      "Priority Email & Ticket Support"
    ],
    isPopular: true,
    maxRequestsPerMin: 60,
    supportLevel: "Priority Email",
    byokSupported: true
  },
  {
    id: "plan_enterprise",
    name: "Enterprise Tier",
    badge: "Maximum Power",
    monthlyPriceUSD: 199,
    cryptoPrices: { ETH: 0.065, BNB: 0.5, USDT: 199, USDC: 199, MATIC: 280, SOL: 1.4 },
    tokenAllowance: "5,000,000 tokens / mo",
    tokenCount: 5000000,
    modelsAccess: ["All Models", "Gemini 3.1 Pro", "GPT-4o", "Claude 3.5 Sonnet", "DeepSeek R1", "Grok 2"],
    features: [
      "5,000,000 Monthly AI Token Allowance",
      "All Premium AI Models Included",
      "Dedicated Web3 Escrow & Auto-Invoicing",
      "Custom Fine-Tuning & Prompt Pipelines",
      "300 Requests/Min High-Throughput",
      "99.9% Uptime Guarantee SLA",
      "24/7 Dedicated AI Architect Concierge"
    ],
    maxRequestsPerMin: 300,
    supportLevel: "24/7 Dedicated Concierge",
    byokSupported: true
  },
  {
    id: "pack_credits_100k",
    name: "100k Token Pack",
    badge: "Pay-As-You-Go",
    monthlyPriceUSD: 10,
    cryptoPrices: { ETH: 0.0035, BNB: 0.028, USDT: 10, USDC: 10, MATIC: 14, SOL: 0.07 },
    tokenAllowance: "+100,000 tokens (No expiry)",
    tokenCount: 100000,
    modelsAccess: ["Inherits your plan's models"],
    features: [
      "One-time 100,000 AI Token Top-up",
      "Never Expire - Rollover Forever",
      "Instant On-Chain Crypto Activation",
      "Compatible with All AI Models"
    ],
    maxRequestsPerMin: 60,
    supportLevel: "Standard",
    byokSupported: true
  }
];

export const INITIAL_AI_MODELS: AIModelSpec[] = [
  {
    id: "gemini-3.6-flash",
    name: "Gemini 3.6 Flash",
    provider: "Google",
    contextWindow: "1,000,000 Tokens",
    tokenRateLimit: "1,000 RPM",
    speedTier: "Ultra Fast",
    reasoningTier: "High",
    costPer1kTokensUSD: 0.0001,
    availability: "Free",
    description: "Google's ultra-fast, multimodal model optimized for lightning conversational speeds, code synthesis, and structured JSON outputs.",
    byokSupported: true
  },
  {
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro",
    provider: "Google",
    contextWindow: "2,000,000 Tokens",
    tokenRateLimit: "360 RPM",
    speedTier: "Fast",
    reasoningTier: "God Tier",
    costPer1kTokensUSD: 0.00125,
    availability: "Pro",
    description: "Industry-leading reasoning engine with massive 2M context window. Excellent for complex software engineering and deep analysis.",
    byokSupported: true
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    contextWindow: "128,000 Tokens",
    tokenRateLimit: "500 RPM",
    speedTier: "Fast",
    reasoningTier: "High",
    costPer1kTokensUSD: 0.0025,
    availability: "Pro",
    description: "OpenAI's flagship multimodal model designed for versatile task handling, natural prose, and math solving.",
    byokSupported: true
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    contextWindow: "200,000 Tokens",
    tokenRateLimit: "200 RPM",
    speedTier: "Fast",
    reasoningTier: "God Tier",
    costPer1kTokensUSD: 0.003,
    availability: "Pro",
    description: "Exceptional coding assistant with nuanced comprehension, artifact building, and refined writing output.",
    byokSupported: true
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1 / V3",
    provider: "DeepSeek",
    contextWindow: "128,000 Tokens",
    tokenRateLimit: "150 RPM",
    speedTier: "Standard",
    reasoningTier: "God Tier",
    costPer1kTokensUSD: 0.0005,
    availability: "Pro",
    description: "Open-weights reasoning powerhouse with explicit Chain-of-Thought step analysis for mathematics and logic.",
    byokSupported: true
  },
  {
    id: "grok-2",
    name: "Grok 2",
    provider: "xAI",
    contextWindow: "128,000 Tokens",
    tokenRateLimit: "100 RPM",
    speedTier: "Ultra Fast",
    reasoningTier: "High",
    costPer1kTokensUSD: 0.002,
    availability: "Enterprise",
    description: "Real-time web-grounded conversational engine with direct high-velocity reasoning capabilities.",
    byokSupported: true
  },
  {
    id: "llama-3-3-70b",
    name: "Llama 3.3 70B",
    provider: "Meta",
    contextWindow: "128,000 Tokens",
    tokenRateLimit: "800 RPM",
    speedTier: "Ultra Fast",
    reasoningTier: "Standard",
    costPer1kTokensUSD: 0.0002,
    availability: "Free",
    description: "Meta's lightweight open-weights LLM tuned for rapid response times and general Q&A task handling.",
    byokSupported: true
  }
];

// Initial default datasets matching server.ts exactly
const initialUsers: User[] = [
  { 
    id: "admin", 
    email: "admin@robomarket.ai", 
    username: "admin", 
    role: "admin", 
    rating: 5, 
    ratingCount: 1, 
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=admin", 
    createdAt: new Date().toISOString(),
    walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    planId: "plan_enterprise",
    planName: "Enterprise Tier",
    tokenBalance: 4850000,
    tokenLimit: 5000000
  },
  { 
    id: "u2", 
    email: "user@robomarket.ai", 
    username: "TechEnthusiast99", 
    role: "user", 
    rating: 4.8, 
    ratingCount: 4, 
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=TechEnthusiast99", 
    createdAt: new Date().toISOString(),
    walletAddress: "0x3C44CdD06a900fa2b585dd299e03d12FA4293BC1",
    planId: "plan_pro",
    planName: "Pro Plan",
    tokenBalance: 320000,
    tokenLimit: 500000
  },
  { 
    id: "u3", 
    email: "silicon@robomarket.ai", 
    username: "Silicon Robotics Lab", 
    role: "user", 
    rating: 4.6, 
    ratingCount: 8, 
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Silicon", 
    createdAt: new Date().toISOString(),
    walletAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    planId: "plan_free",
    planName: "Free Tier",
    tokenBalance: 14500,
    tokenLimit: 20000
  }
];

const initialRobots: Robot[] = [
  {
    id: "r1",
    name: "Apex-V1 Industrial Arm",
    description: "A high-precision six-axis robotic arm designed for assembly, welding, and material handling. Built with high-torque brushless motors and robust carbon fiber casings, it offers high repeatability and payloads. Ideal for precision electronics assembly or manufacturing lines.",
    category: "Industrial",
    price: 45000,
    location: "Detroit, MI",
    specs: {
      manufacturer: "Apex Robotics Corp",
      payload: "15 kg",
      batteryLife: "Wired (AC 220V)",
      speed: "2.5 m/s",
      weight: "120 kg",
      operatingSystem: "ApexOS v3.1",
      warranty: "3 years"
    },
    status: "approved",
    sellerId: "admin",
    sellerName: "RoboMarket Prime",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    condition: "new",
    rating: 4.8,
    reviews: [
      { id: "rev1", robotId: "r1", userId: "u2", username: "FactoryManagerX", rating: 5, comment: "Incredible repeatability. We've been running it 24/7 for three months without a single issue.", createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "r2",
    name: "Hume-X2 Humanoid Assistant",
    description: "A state-of-the-art bipedal humanoid robot designed for research, customer service, and concierge operations. Equipped with 24 degrees of freedom, advanced facial recognition cameras, and a chest display. Possesses elegant fluid movement algorithms.",
    category: "Humanoid",
    price: 75000,
    location: "San Jose, CA",
    specs: {
      manufacturer: "Hume Dynamics",
      payload: "5 kg (hand carry)",
      batteryLife: "8 hours",
      speed: "1.2 m/s",
      weight: "65 kg",
      operatingSystem: "HumeCore Linux v4",
      warranty: "1 year"
    },
    status: "approved",
    sellerId: "u3",
    sellerName: "Silicon Robotics Lab",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    condition: "refurbished",
    rating: 4.5,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "r3",
    name: "MedBot Care-Plus",
    description: "Designed specifically for hospital and clinical environments. MedBot autonomously navigates crowded corridors to deliver pharmaceuticals, surgical tools, and patient charts. Includes sterile sealed compartments and integrated UV sanitization lights.",
    category: "Medical",
    price: 28000,
    location: "Boston, MA",
    specs: {
      manufacturer: "MedTech Automation",
      payload: "30 kg",
      batteryLife: "12 hours",
      speed: "0.8 m/s",
      weight: "45 kg",
      operatingSystem: "CareOS Medical",
      warranty: "2 years"
    },
    status: "approved",
    sellerId: "admin",
    sellerName: "RoboMarket Prime",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    condition: "new",
    rating: 4.9,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "r4",
    name: "AgriCulti-6 Surveying Drone",
    description: "Heavy-duty agricultural hexacopter drone for field mapping, yield estimation, and autonomous crop dusting. Equipped with multispectral cameras, LIDAR, and a 20L high-volume liquid tank with precision adjustable nozzles.",
    category: "Agricultural",
    price: 12500,
    location: "Des Moines, IA",
    specs: {
      manufacturer: "GreenField Aero",
      payload: "25 kg (max lift)",
      batteryLife: "45 minutes",
      speed: "15 m/s",
      weight: "12 kg",
      operatingSystem: "ArduPilot Enterprise",
      warranty: "2 years"
    },
    status: "approved",
    sellerId: "u3",
    sellerName: "Silicon Robotics Lab",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    condition: "new",
    rating: 4.2,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "r5",
    name: "Aegis Guardian-IV Security Platform",
    description: "An autonomous terrestrial security platform equipped with active LIDAR mapping, thermal night-vision, license plate recognition, and glass-break sound detection. Built with deep rugged tires for cross-terrain outdoor tracking.",
    category: "Security",
    price: 18900,
    location: "Austin, TX",
    specs: {
      manufacturer: "Aegis Tactical",
      payload: "N/A",
      batteryLife: "10 hours",
      speed: "4.0 m/s",
      weight: "38 kg",
      operatingSystem: "AegisOS Tactical",
      warranty: "2 years"
    },
    status: "approved",
    sellerId: "admin",
    sellerName: "RoboMarket Prime",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    condition: "new",
    rating: 4.6,
    reviews: [],
    createdAt: new Date().toISOString()
  }
];

const initialCryptoPayments: CryptoPayment[] = [
  {
    id: "pay_101",
    txHash: "0x8f2e9a3b1d7c5e4f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7",
    amountCrypto: 0.01,
    currency: "ETH",
    amountUSD: 29,
    type: "subscription",
    planId: "plan_pro",
    planName: "Pro Plan",
    userAddress: "0x3C44CdD06a900fa2b585dd299e03d12FA4293BC1",
    userName: "TechEnthusiast99",
    status: "confirmed",
    timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    blockNumber: 19842105,
    gasFeeETH: "0.00042 ETH",
    receiptUrl: "https://etherscan.io/tx/0x8f2e9a3b1d7c5e4f"
  },
  {
    id: "pay_102",
    txHash: "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4",
    amountCrypto: 0.065,
    currency: "ETH",
    amountUSD: 199,
    type: "subscription",
    planId: "plan_enterprise",
    planName: "Enterprise Tier",
    userAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    userName: "admin",
    status: "confirmed",
    timestamp: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    blockNumber: 19835012,
    gasFeeETH: "0.00051 ETH",
    receiptUrl: "https://etherscan.io/tx/0x3a4b5c6d7e8f9a0b"
  }
];

const initialApiKeys: UserApiKey[] = [
  {
    id: "key_demo_gemini",
    provider: "gemini",
    keyName: "Personal Gemini Key",
    maskedKey: "AIzaSy...4a9f",
    rawKey: "AIzaSyDemoPersonalKeyStoredEncryptedInVault12345",
    status: "active",
    lastTestedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
];

// Helper to load/save from localStorage
function getStore<T>(key: string, initial: T): T {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initial;
  }
}

function setStore<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Exportable helpers for state management
export function getSavedWalletState(): WalletState {
  return getStore<WalletState>('mock_wallet_state', {
    isConnected: true,
    address: "0x3C44CdD06a900fa2b585dd299e03d12FA4293BC1",
    walletType: "MetaMask",
    network: "Ethereum Mainnet",
    chainId: 1,
    balances: {
      ETH: 2.45,
      BNB: 12.8,
      USDT: 1450.00,
      USDC: 820.50,
      MATIC: 350.00,
      SOL: 18.25
    }
  });
}

export function saveWalletState(state: WalletState) {
  setStore('mock_wallet_state', state);
}

export function getSavedUserApiKeys(): UserApiKey[] {
  return getStore<UserApiKey[]>('mock_user_api_keys', initialApiKeys);
}

export function saveUserApiKeys(keys: UserApiKey[]) {
  setStore('mock_user_api_keys', keys);
}

export function getSavedApiKeyPref(): ApiKeyPreference {
  return getStore<ApiKeyPreference>('mock_api_key_pref', {
    mode: 'platform',
    activeCustomKeyId: 'key_demo_gemini'
  });
}

export function saveApiKeyPref(pref: ApiKeyPreference) {
  setStore('mock_api_key_pref', pref);
}

export function getSavedPayments(): CryptoPayment[] {
  return getStore<CryptoPayment[]>('mock_crypto_payments', initialCryptoPayments);
}

export function savePayments(payments: CryptoPayment[]) {
  setStore('mock_crypto_payments', payments);
}

// Intercept routing logic
export function initMockDatabase() {
  if (window.__ROBO_MOCK_INITIALIZED__) return;
  window.__ROBO_MOCK_INITIALIZED__ = true;

  // Initialize store databases if empty
  const getRobots = () => getStore<Robot[]>('mock_robots', initialRobots);
  const setRobots = (r: Robot[]) => setStore('mock_robots', r);

  const getUsers = () => getStore<User[]>('mock_users', initialUsers);
  const setUsers = (u: User[]) => setStore('mock_users', u);

  const getChats = () => getStore<any[]>('mock_chats', []);
  const setChats = (c: any[]) => setStore('mock_chats', c);

  const getOrders = () => getStore<any[]>('mock_orders', []);
  const setOrders = (o: any[]) => setStore('mock_orders', o);

  // Auto-detect server availability on startup
  fetch('/api/robots?status=all')
    .then(res => {
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('json')) {
        console.warn("⚠️ RoboMarket Server returned non-JSON/error. Switching to client-side mode.");
        window.__ROBO_USE_MOCK__ = true;
      } else {
        console.log("✅ RoboMarket express API backend is alive. Using live server routes.");
        window.__ROBO_USE_MOCK__ = false;
      }
    })
    .catch(() => {
      console.warn("⚠️ RoboMarket server unreachable. Switching to client-side mode.");
      window.__ROBO_USE_MOCK__ = true;
    });

  const nativeFetch = window.fetch;

  const customFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    if (!urlStr.includes('/api/') || window.__ROBO_USE_MOCK__ === false) {
      try {
        const res = await nativeFetch(input, init);
        const contentType = res.headers.get('content-type') || '';
        if ((res.status === 404 || contentType.includes('html')) && window.location.hostname.includes('vercel.app')) {
          console.warn("⚠️ Serverless routing fallback. Hot-swapping to LocalStorage.");
          window.__ROBO_USE_MOCK__ = true;
        } else {
          return res;
        }
      } catch (err) {
        window.__ROBO_USE_MOCK__ = true;
      }
    }

    const method = (init?.method || 'GET').toUpperCase();
    const bodyObj = init?.body ? JSON.parse(init.body as string) : null;

    const createJSONResponse = (data: any, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    // 1. Auth & Users
    if (urlStr.includes('/api/auth/me')) {
      const authHeader = init?.headers ? (init.headers as any)['Authorization'] : null;
      const token = authHeader ? authHeader.replace('Bearer jwt_mock_token_', '') : 'u2';
      const user = getUsers().find(u => u.id === token) || getUsers()[1];
      return createJSONResponse({ user });
    }

    if (urlStr.includes('/api/auth/login') || urlStr.includes('/api/auth/register')) {
      const email = bodyObj?.email || "user@robomarket.ai";
      const users = getUsers();
      let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        user = {
          id: "u_" + Date.now(),
          email,
          username: email.split('@')[0],
          role: email.includes('admin') ? "admin" : "user",
          rating: 5,
          ratingCount: 0,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
          createdAt: new Date().toISOString(),
          planId: "plan_pro",
          planName: "Pro Plan",
          tokenBalance: 450000,
          tokenLimit: 500000
        };
        setUsers([...users, user]);
      }
      return createJSONResponse({ user, token: "jwt_mock_token_" + user.id });
    }

    // 2. SaaS Plans & AI Models
    if (urlStr.includes('/api/saas/plans')) {
      return createJSONResponse(INITIAL_SAAS_PLANS);
    }

    if (urlStr.includes('/api/saas/models')) {
      return createJSONResponse(INITIAL_AI_MODELS);
    }

    // 3. User BYOK API Keys
    if (urlStr.includes('/api/user/keys')) {
      if (method === 'POST') {
        const { provider, keyName, rawKey } = bodyObj || {};
        const keys = getSavedUserApiKeys();
        const masked = rawKey.length > 8 ? rawKey.substring(0, 6) + "..." + rawKey.substring(rawKey.length - 4) : "••••••••";
        const newKey: UserApiKey = {
          id: "key_" + Date.now(),
          provider: provider || "openai",
          keyName: keyName || `${provider?.toUpperCase()} Key`,
          maskedKey: masked,
          rawKey: rawKey || "",
          status: "active",
          lastTestedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        const updated = [...keys, newKey];
        saveUserApiKeys(updated);
        return createJSONResponse({ success: true, key: newKey });
      }

      if (method === 'DELETE') {
        const match = urlStr.match(/\/api\/user\/keys\/([^\/]+)/);
        const keyId = match ? match[1] : '';
        const keys = getSavedUserApiKeys().filter(k => k.id !== keyId);
        saveUserApiKeys(keys);
        return createJSONResponse({ success: true });
      }

      return createJSONResponse({ keys: getSavedUserApiKeys(), pref: getSavedApiKeyPref() });
    }

    if (urlStr.includes('/api/user/keys/test')) {
      return createJSONResponse({ success: true, latencyMs: 142, message: "Key validated successfully against upstream provider API." });
    }

    // 4. Crypto Payments & Subscriptions
    if (urlStr.includes('/api/payments/crypto')) {
      if (method === 'POST') {
        const { planId, currency, amountUSD, amountCrypto, walletAddress, userName } = bodyObj || {};
        const plan = INITIAL_SAAS_PLANS.find(p => p.id === planId) || INITIAL_SAAS_PLANS[1];
        
        const payments = getSavedPayments();
        const newPayment: CryptoPayment = {
          id: "pay_" + Date.now(),
          txHash: "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
          amountCrypto: amountCrypto || (plan.cryptoPrices[currency as CryptoCurrency] || 0.01),
          currency: currency || "ETH",
          amountUSD: amountUSD || plan.monthlyPriceUSD,
          type: planId.includes('pack') ? 'credit_pack' : 'subscription',
          planId: plan.id,
          planName: plan.name,
          userAddress: walletAddress || "0x3C44CdD06a900fa2b585dd299e03d12FA4293BC1",
          userName: userName || "TechEnthusiast99",
          status: 'confirmed',
          timestamp: new Date().toISOString(),
          blockNumber: 19850000 + Math.floor(Math.random() * 1000),
          receiptUrl: `https://etherscan.io/tx/0x${Date.now()}`
        };

        savePayments([newPayment, ...payments]);

        // Update user token balance & subscription
        const users = getUsers();
        const userIdx = users.findIndex(u => u.id === "u2" || u.email.includes("user"));
        if (userIdx !== -1) {
          if (planId.includes('pack')) {
            users[userIdx].tokenBalance = (users[userIdx].tokenBalance || 0) + 100000;
          } else {
            users[userIdx].planId = plan.id;
            users[userIdx].planName = plan.name;
            users[userIdx].tokenBalance = plan.tokenCount;
            users[userIdx].tokenLimit = plan.tokenCount;
          }
          setUsers(users);
        }

        return createJSONResponse({ success: true, payment: newPayment });
      }

      return createJSONResponse(getSavedPayments());
    }

    // 5. AI Advisor Chat Fallback Response Generator
    if (urlStr.includes('/api/ai/chat')) {
      const { messages } = bodyObj || {};
      const lastMsg = messages?.[messages.length - 1]?.content || '';
      const promptLower = lastMsg.toLowerCase();

      // Check if user is asking about plans, buying, subscription, or pricing
      const isAskingPricing = promptLower.includes('plan') || promptLower.includes('price') || promptLower.includes('pro') || promptLower.includes('enterprise') || promptLower.includes('buy') || promptLower.includes('subscribe') || promptLower.includes('cost') || promptLower.includes('tier') || promptLower.includes('token') || promptLower.includes('credit');

      let responseText = "";
      let planRecommendation = undefined;
      let paymentCard = undefined;

      if (isAskingPricing) {
        if (promptLower.includes('enterprise')) {
          responseText = "The **Enterprise Tier** ($199/mo or ~0.065 ETH) provides **5,000,000 monthly AI tokens**, access to ALL models including Gemini 3.1 Pro, GPT-4o, Claude 3.5 Sonnet, Grok 2, and DeepSeek R1, with a 300 req/min rate limit and dedicated Web3 escrow.\n\nWould you like to subscribe now directly via crypto?";
          planRecommendation = {
            planId: "plan_enterprise",
            planName: "Enterprise Tier",
            priceUSD: 199,
            cryptoETH: 0.065,
            tokenAllowance: "5,000,000 tokens / mo",
            features: ["All Premium Models Included", "5M Token Allowance", "Web3 Escrow & Invoicing", "24/7 Dedicated Concierge"]
          };
          paymentCard = {
            orderId: "ord_" + Date.now(),
            planId: "plan_enterprise",
            planName: "Enterprise Tier",
            amountUSD: 199,
            amountCrypto: 0.065,
            currency: "ETH" as CryptoCurrency,
            status: "pending" as const
          };
        } else if (promptLower.includes('credit') || promptLower.includes('pack') || promptLower.includes('topup') || promptLower.includes('100k')) {
          responseText = "You can top-up your balance anytime with our **100k Token Pack** ($10 or 0.0035 ETH). These tokens never expire and roll over forever across all models!";
          planRecommendation = {
            planId: "pack_credits_100k",
            planName: "100k Token Pack",
            priceUSD: 10,
            cryptoETH: 0.0035,
            tokenAllowance: "+100,000 tokens",
            features: ["One-time 100,000 AI Tokens", "No Expiry Date", "Instant Crypto Activation"]
          };
          paymentCard = {
            orderId: "ord_" + Date.now(),
            planId: "pack_credits_100k",
            planName: "100k Token Pack",
            amountUSD: 10,
            amountCrypto: 0.0035,
            currency: "ETH" as CryptoCurrency,
            status: "pending" as const
          };
        } else {
          // Default Pro Plan recommendation
          responseText = "I recommend our most popular **Pro Plan** ($29/mo or ~0.01 ETH). It gives you **500,000 monthly tokens**, access to Gemini 3.6 Flash, Gemini 3.1 Pro, GPT-4o, Claude 3.5 Sonnet, and DeepSeek V3, plus full access to your BYOK API Key Vault!\n\nYou can click below to checkout directly inside this chat using MetaMask or your Web3 wallet.";
          planRecommendation = {
            planId: "plan_pro",
            planName: "Pro Plan",
            priceUSD: 29,
            cryptoETH: 0.01,
            tokenAllowance: "500,000 tokens / mo",
            features: ["500,000 Tokens/mo", "Access to Gemini 3.1 Pro, GPT-4o, Claude 3.5", "BYOK Key Vault", "Priority Speed"]
          };
          paymentCard = {
            orderId: "ord_" + Date.now(),
            planId: "plan_pro",
            planName: "Pro Plan",
            amountUSD: 29,
            amountCrypto: 0.01,
            currency: "ETH" as CryptoCurrency,
            status: "pending" as const
          };
        }
      } else if (promptLower.includes('key') || promptLower.includes('byok') || promptLower.includes('openai') || promptLower.includes('claude') || promptLower.includes('grok')) {
        responseText = "🔒 **BYOK (Bring Your Own Key) Support**: You can securely store your personal API keys (OpenAI, Gemini, Anthropic Claude, xAI Grok, DeepSeek) in your encrypted **API Key Vault**. When enabled, the AI Advisor will automatically route queries using your personal key so you never hit platform limits!";
      } else if (promptLower.includes('wallet') || promptLower.includes('metamask') || promptLower.includes('rabby') || promptLower.includes('connect')) {
        responseText = "🌐 **Web3 Wallet Support**: We support MetaMask, Rabby Wallet, WalletConnect, Coinbase Wallet, and Phantom! You can pay for subscriptions or token packs seamlessly in ETH, BNB, USDT, USDC, MATIC, or SOL with instant on-chain activation.";
      } else if (promptLower.includes('humanoid') || promptLower.includes('arm') || promptLower.includes('robot') || promptLower.includes('medical')) {
        responseText = "🤖 **RoboMarket Hardware Catalog**: We host verified industrial arms, bipedal humanoids, medical delivery rovers, and surveying drones. You can ask me to compare specs or search for specific payload requirements!";
      } else {
        responseText = "Welcome to **RoboMarket AI SaaS**! I am your intelligent AI Advisor. I can help you:\n\n1. 💳 **Recommend & Purchase Plans**: Upgrade to Pro or Enterprise directly in this chat via crypto payments.\n2. 🔑 **Manage BYOK Keys**: Use your own OpenAI, Gemini, Claude, or DeepSeek API keys.\n3. 📊 **Compare Models**: Evaluate Gemini 3.6 Flash vs GPT-4o vs Claude 3.5 Sonnet context limits and speeds.\n4. 🤖 **Robotics Procurement**: Find verified autonomous hardware for your lab or enterprise.\n\nWhat would you like to explore today?";
      }

      return createJSONResponse({
        content: responseText,
        isFallback: true,
        planRecommendation,
        paymentCard
      });
    }

    // 6. Robots Catalog & Orders
    if (urlStr.includes('/api/robots')) {
      const robots = getRobots();
      return createJSONResponse(robots);
    }

    if (urlStr.includes('/api/orders')) {
      const orders = getOrders();
      return createJSONResponse(orders);
    }

    return createJSONResponse({ message: "OK" });
  };

  try {
    Object.defineProperty(window, 'fetch', {
      value: customFetch,
      writable: true,
      configurable: true,
      enumerable: true
    });
    console.log("🌟 Successfully registered mockApi window.fetch interceptor.");
  } catch (err) {
    try {
      window.fetch = customFetch;
    } catch (e) {}
  }
}
