export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin' | 'manager';
  rating: number;
  ratingCount: number;
  avatar: string;
  createdAt: string;
  walletAddress?: string;
  planId?: string;
  planName?: string;
  tokenBalance?: number;
  tokenLimit?: number;
}

export type WalletType = 'MetaMask' | 'Rabby' | 'WalletConnect' | 'Phantom' | 'Coinbase';
export type CryptoCurrency = 'ETH' | 'BNB' | 'USDT' | 'USDC' | 'MATIC' | 'SOL';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  walletType: WalletType | null;
  network: string;
  chainId: number;
  balances: Record<CryptoCurrency, number>;
}

export interface CryptoPayment {
  id: string;
  txHash: string;
  amountCrypto: number;
  currency: CryptoCurrency;
  amountUSD: number;
  type: 'subscription' | 'credit_pack' | 'api_addon';
  planId: string;
  planName: string;
  userAddress: string;
  userName: string;
  status: 'pending' | 'confirming' | 'confirmed' | 'failed';
  timestamp: string;
  blockNumber: number;
  gasFeeETH?: string;
  receiptUrl?: string;
}

export interface SaaSPlan {
  id: string;
  name: string;
  badge?: string;
  monthlyPriceUSD: number;
  cryptoPrices: Record<CryptoCurrency, number>;
  tokenAllowance: string; // e.g. "50,000 / mo" or "Unlimited"
  tokenCount: number;
  modelsAccess: string[];
  features: string[];
  isPopular?: boolean;
  maxRequestsPerMin: number;
  supportLevel: string;
  byokSupported: boolean;
}

export interface AIModelSpec {
  id: string;
  name: string;
  provider: 'Google' | 'OpenAI' | 'Anthropic' | 'xAI' | 'DeepSeek' | 'Meta';
  contextWindow: string;
  tokenRateLimit: string;
  speedTier: 'Ultra Fast' | 'Fast' | 'Standard';
  reasoningTier: 'God Tier' | 'High' | 'Standard';
  costPer1kTokensUSD: number;
  availability: 'Free' | 'Pro' | 'Enterprise';
  description: string;
  byokSupported: boolean;
}

export type ApiKeyProvider = 'openai' | 'gemini' | 'claude' | 'grok' | 'deepseek' | 'mistral';

export interface UserApiKey {
  id: string;
  provider: ApiKeyProvider;
  keyName: string;
  maskedKey: string;
  rawKey: string;
  status: 'active' | 'invalid' | 'untested';
  lastTestedAt?: string;
  createdAt: string;
}

export interface ApiKeyPreference {
  mode: 'platform' | 'custom';
  activeCustomKeyId: string | null;
}

export interface AdvisorChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  isFallback?: boolean;
  planRecommendation?: {
    planId: string;
    planName: string;
    priceUSD: number;
    cryptoETH: number;
    tokenAllowance: string;
    features: string[];
  };
  paymentCard?: {
    orderId: string;
    planId: string;
    planName: string;
    amountUSD: number;
    amountCrypto: number;
    currency: CryptoCurrency;
    status: 'pending' | 'processing' | 'paid';
    txHash?: string;
  };
}

export interface Review {
  id: string;
  robotId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Robot {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  location: string;
  specs: {
    manufacturer?: string;
    payload?: string;
    batteryLife?: string;
    speed?: string;
    weight?: string;
    operatingSystem?: string;
    warranty?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  sellerId: string;
  sellerName: string;
  imageUrl: string;
  condition: 'new' | 'refurbished' | 'used';
  rating: number;
  reviews: Review[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  robotId: string;
  robotName: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface Order {
  id: string;
  robotId: string;
  robotName: string;
  robotImageUrl: string;
  price: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  trackingNumber: string;
  createdAt: string;
}

export interface AIAnalysis {
  qualityScore: number; // 0 to 100
  summary: string;
  pros: string[];
  cons: string[];
  suspiciousFlags: string[];
  verdict: 'Excellent' | 'Fair' | 'Suspicious' | 'Dangerous';
}

export interface AISearchResult {
  reasoning: string;
  matchedRobotIds: string[];
  suggestedBudgetRange?: string;
}

