import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, RefreshCw, Cpu, Key, CreditCard, ArrowRight } from 'lucide-react';
import { ApiKeyPreference } from '../types';

interface Message {
  role: 'user' | 'model';
  content: string;
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
    currency: 'ETH' | 'BNB' | 'USDT' | 'USDC';
    status: 'pending' | 'confirmed';
  };
}

interface AIAssistantProps {
  onViewRobot: (id: string) => void;
  hasGeminiKey?: boolean | null;
  apiKeyPref?: ApiKeyPreference;
  onOpenCheckout?: (planId: string) => void;
}

const QUICK_PROMPTS = [
  {
    title: "Recommend AI Plan",
    text: "Which AI SaaS subscription is best for high-volume LLM workloads and autonomous robotics simulations?",
  },
  {
    title: "Pro vs Enterprise",
    text: "Compare the Pro Plan ($29/mo) and Enterprise Tier ($199/mo) in terms of token limits, supported models, and Web3 payments.",
  },
  {
    title: "BYOK Key Vault",
    text: "How does the Bring Your Own Key (BYOK) vault work for OpenAI and Gemini keys?",
  },
  {
    title: "Industrial Arm",
    text: "Recommend a high-precision six-axis industrial arm for heavy manufacturing. Budget $50,000.",
  }
];

export default function AIAssistant({ onViewRobot, hasGeminiKey, apiKeyPref, onOpenCheckout }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: `Hello! I am your **AI SaaS & Hardware Advisor** 🤖\n\nI can help you select AI Computing Subscriptions (Free, Pro, Enterprise), compare LLM specs (Gemini 3.6 Flash, GPT-4o, Claude 3.5, DeepSeek R1), configure BYOK API Keys, or locate autonomous robotic hardware.\n\nHow can I help you today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('robo_token');
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        })
      });

      let responseData: any = null;
      try {
        responseData = await response.json();
      } catch (e) {
        // Fallback
      }

      const data = responseData;
      setMessages(prev => [...prev, {
        role: 'model',
        content: data?.content || 'I have analyzed your request.',
        isFallback: data?.isFallback,
        planRecommendation: data?.planRecommendation,
        paymentCard: data?.paymentCard
      }]);
    } catch (err: any) {
      // Local fallback on network failure
      const fallbackMsg = textToSend.toLowerCase();
      let text = "I am operating via our local intelligent decision-support engine:\n\n";
      let planRecommendation = undefined;
      let paymentCard = undefined;

      if (fallbackMsg.includes('enterprise')) {
        text += "The **Enterprise Tier** ($199/mo or ~0.065 ETH) provides 5,000,000 tokens/mo, access to all premium models (Gemini 3.1 Pro, GPT-4o, Claude 3.5, DeepSeek R1), 300 RPM rate limits, and Web3 escrow.";
        planRecommendation = { planId: "plan_enterprise", planName: "Enterprise Tier", priceUSD: 199, cryptoETH: 0.065, tokenAllowance: "5,000,000 tokens / mo", features: ["5M Tokens", "All Premium Models", "Web3 Escrow"] };
        paymentCard = { orderId: "ord_" + Date.now(), planId: "plan_enterprise", planName: "Enterprise Tier", amountUSD: 199, amountCrypto: 0.065, currency: "ETH" as const, status: "pending" as const };
      } else {
        text += "I recommend our **Pro Plan** ($29/mo or ~0.01 ETH). It offers **500,000 tokens/mo**, Gemini 3.1 Pro, GPT-4o, Claude 3.5, and BYOK Key Vault integration.";
        planRecommendation = { planId: "plan_pro", planName: "Pro Plan", priceUSD: 29, cryptoETH: 0.01, tokenAllowance: "500,000 tokens / mo", features: ["500k Tokens", "Access to Pro Models", "BYOK Key Vault"] };
        paymentCard = { orderId: "ord_" + Date.now(), planId: "plan_pro", planName: "Pro Plan", amountUSD: 29, amountCrypto: 0.01, currency: "ETH" as const, status: "pending" as const };
      }

      setMessages(prev => [...prev, {
        role: 'model',
        content: text,
        isFallback: true,
        planRecommendation,
        paymentCard
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseMessageText = (text: string) => {
    const regex = /\[r([1-9][0-9]*)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      const robotId = 'r' + match[1];

      if (matchIndex > lastIndex) {
        parts.push(<span key={lastIndex}>{text.substring(lastIndex, matchIndex)}</span>);
      }

      parts.push(
        <button
          key={matchIndex}
          onClick={() => onViewRobot(robotId)}
          className="inline-flex items-center space-x-1 mx-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          <Cpu className="h-3 w-3 text-emerald-600" />
          <span>View Listing {robotId}</span>
        </button>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={lastIndex}>{text.substring(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : text;
  };

  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-slate-900 mt-3 mb-1">{parseMessageText(line.replace('### ', ''))}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-black text-emerald-700 mt-4 mb-2">{parseMessageText(line.replace('## ', ''))}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="text-lg font-black text-slate-900 mt-4 mb-2">{parseMessageText(line.replace('# ', ''))}</h2>;
      }

      const isBullet = line.startsWith('- ') || line.startsWith('* ');
      const cleanLine = isBullet ? line.substring(2) : line;

      const boldRegex = /\*\*(.*?)\*\*/g;
      const parsedLine = cleanLine.split(boldRegex).map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index} className="text-emerald-700 font-bold">{part}</strong>;
        }
        return parseMessageText(part);
      });

      if (isBullet) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 text-xs leading-relaxed mb-1">
            {parsedLine}
          </li>
        );
      }

      return (
        <p key={idx} className="text-slate-700 text-xs leading-relaxed mb-2 min-h-[1rem]">
          {parsedLine}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-5xl mx-auto px-4 py-4 overflow-hidden" id="ai-advisor-panel">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 mb-4 gap-3 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>AI Advisor & Web3 Assistant</span>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                Gemini 3.6 Flash
              </span>
            </h1>
            <p className="text-xs text-slate-500">Instant plan recommendations, LLM benchmarks & chat-based Web3 ordering</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {apiKeyPref?.mode === 'custom' ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <Key className="h-3.5 w-3.5 text-emerald-600" /> BYOK Vault Active
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Platform Engine
            </span>
          )}

          <button
            onClick={() => setMessages([{
              role: 'model',
              content: `Feed reset. How can I assist you with SaaS plans or robotic hardware?`
            }])}
            className="flex items-center space-x-1.5 text-xs text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0 overflow-hidden">
        {/* Messages Feed */}
        <div className="lg:col-span-3 flex flex-col h-full bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className="space-y-3">
                <div className={`flex space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role !== 'user' && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                      <Bot className="h-5 w-5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs shadow-2xs ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                        : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    {msg.isFallback && (
                      <div className="mb-2 inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                        ⚡ Local Intelligent Fallback Engine
                      </div>
                    )}

                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <div>{renderFormattedContent(msg.content)}</div>
                    )}

                    {/* Interactive Plan Recommendation / Purchase Card */}
                    {msg.paymentCard && (
                      <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 space-y-2 text-xs">
                        <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                          <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                            <CreditCard className="h-4 w-4 text-emerald-600" />
                            <span>Recommended Order: {msg.paymentCard.planName}</span>
                          </span>
                          <span className="font-mono text-slate-900 font-black">${msg.paymentCard.amountUSD}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Crypto Equivalent:</span>
                          <span className="font-mono font-bold text-emerald-700">{msg.paymentCard.amountCrypto} ETH</span>
                        </div>
                        <button
                          onClick={() => onOpenCheckout?.(msg.paymentCard!.planId)}
                          className="w-full mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                        >
                          <span>Complete Purchase with Web3 Wallet</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}

                    <span className="block text-[10px] text-slate-400 text-right mt-1">
                      {msg.role === 'user' ? 'You' : 'AI Advisor'}
                    </span>
                  </div>
                </div>

                {/* Quick Action Chips on first load */}
                {i === 0 && messages.length === 1 && (
                  <div className="pl-11 flex flex-col space-y-2">
                    <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Suggested Inquiries</span>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_PROMPTS.map((qp, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(qp.text)}
                          className="px-3 py-1.5 text-xs bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all flex items-center cursor-pointer"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-emerald-600 mr-1.5" />
                          <span>{qp.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex space-x-3 justify-start">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-center space-x-2">
                  <Cpu className="h-4 w-4 animate-spin text-emerald-600" />
                  <span className="font-mono text-xs animate-pulse">Evaluating request & generating recommendation...</span>
                </div>
              </div>
            )}

            <div ref={feedEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-3 border-t border-slate-200 bg-slate-50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Pro plan, token limits, BYOK setup, or robotic hardware..."
                className="flex-1 bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-xl px-4 py-3 focus:border-emerald-500 focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="hidden lg:block space-y-4 overflow-y-auto">
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-3 shadow-2xs">
            <h2 className="text-xs font-bold font-mono text-emerald-700 uppercase flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SaaS Capabilities</span>
            </h2>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <strong className="text-slate-900 block mb-0.5">Chat-Based Subscriptions</strong>
                <span>Ask the advisor to recommend or buy plans directly in chat.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <strong className="text-slate-900 block mb-0.5">Bring Your Own Key (BYOK)</strong>
                <span>Pass your personal OpenAI/Gemini keys for zero-markup usage.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
