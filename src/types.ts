export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  rating: number;
  ratingCount: number;
  avatar: string;
  createdAt: string;
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
