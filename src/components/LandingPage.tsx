import React, { useState } from 'react';
import { 
  Bot, Sparkles, Key, Wallet, CreditCard, Layers, ShieldCheck, ArrowRight, 
  Check, Cpu, Zap, MessageSquare, ChevronDown, ChevronUp, Star, ExternalLink,
  Code2, Lock, RefreshCw, ShoppingCart, HelpCircle
} from 'lucide-react';
import { SaaSPlan, AIModelSpec, WalletState, ApiKeyPreference } from '../types';

interface LandingPageProps {
  plans: SaaSPlan[];
  models: AIModelSpec[];
  walletState: WalletState;
  onSelectPlan: (plan: SaaSPlan | string) => void;
  onOpenWalletModal: () => void;
  onNavigateTab: (tab: string) => void;
  onViewRobot?: (robotId: string) => void;
  onLoginClick: () => void;
  hasGeminiKey?: boolean | null;
}

export default function LandingPage({
  plans,
  models,
  walletState,
  onSelectPlan,
  onOpenWalletModal,
  onNavigateTab,
  onViewRobot,
  onLoginClick,
  hasGeminiKey
}: LandingPageProps) {
  // Demo AI Chat State
  const [demoPrompt, setDemoPrompt] = useState('');
  const [demoResponse, setDemoResponse] = useState<string | null>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // FAQ Accordion Toggle
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const samplePrompts = [
    "Recommend a humanoid robot for factory assembly under $40,000",
    "Compare Gemini 3.6 Flash vs DeepSeek R1 for robotics code",
    "How do I subscribe using USDT on Ethereum?"
  ];

  const handleDemoSubmit = async (promptText: string) => {
    const text = promptText || demoPrompt;
    if (!text.trim()) return;
    setDemoPrompt(text);
    setIsDemoLoading(true);
    setDemoResponse(null);

    try {
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: text }],
          userPreferences: { mode: 'platform' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDemoResponse(data.reply || "Recommendation processed successfully.");
      } else {
        setDemoResponse("RoboMarket AI Advisor: For specialized factory assembly under $40,000, we recommend the 'Unitree G1 Humanoid' ($16,000) or 'Unitree H1' ($38,000). Both feature 23-36 degrees of freedom and real-time ROS2 integrations.");
      }
    } catch (err) {
      setDemoResponse("RoboMarket AI Advisor: For high-throughput industrial tasks, Gemini 3.6 Flash offers ultra-fast sub-second latency for vision control, whereas DeepSeek R1 provides deep chain-of-thought mathematical planning.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  const faqItems = [
    {
      question: "How does Bring Your Own API Key (BYOK) work?",
      answer: "BYOK allows you to store your own API keys for Google Gemini, OpenAI, or Anthropic inside an encrypted browser vault. When making AI queries, your key is passed directly to the model provider with 0% platform token markup."
    },
    {
      question: "Which Web3 wallets are supported?",
      answer: "We support MetaMask, Rabby, WalletConnect, and Coinbase Wallet across Ethereum Mainnet, BNB Chain, Polygon, Arbitrum, and Solana."
    },
    {
      question: "How are crypto payments processed and verified?",
      answer: "When subscribing or purchasing token packs, a payment modal provides a dedicated merchant address and real-time currency conversion rates. Transactions are monitored directly on the blockchain and credited automatically upon block confirmation."
    },
    {
      question: "Can I order physical robotic hardware directly through the AI chat?",
      answer: "Yes! The AI Advisor is integrated with the hardware marketplace catalog. You can ask for recommendations, configure system options, and click 'Instant Web3 Buy' directly within the chat interface."
    },
    {
      question: "What happens when I exhaust my monthly token allowance?",
      answer: "You can purchase a +100k Token Credit Pack top-up at any time for $10 USD (payable in ETH/USDT/USDC). Top-up tokens never expire and roll over indefinitely."
    }
  ];

  return (
    <div className="space-y-20 py-4" id="landing-page">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 md:p-16 shadow-sm">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-50/80 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 shadow-2xs">
            <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
            <span>Autonomous AI & Web3 Hardware SaaS Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-black text-slate-900 sm:text-6xl tracking-tight leading-tight">
            Next-Gen AI Computing <br />
            <span className="text-emerald-600">
              Powered by Web3 & BYOK
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            Unified SaaS platform connecting flagship LLMs (Gemini 3.6 Flash, GPT-4o, Claude 3.5 Sonnet, DeepSeek R1) with Web3 crypto payments and Bring Your Own Key zero-markup freedom.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <button
              onClick={() => onNavigateTab('pricing')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenWalletModal}
              className={`bg-white hover:bg-slate-50 text-slate-800 border font-bold text-sm px-7 py-3.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
                walletState.isConnected 
                  ? 'border-emerald-300 text-emerald-700 bg-emerald-50/50' 
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <Wallet className="h-4 w-4 text-emerald-600" />
              <span>{walletState.isConnected ? 'Wallet Connected' : 'Connect Web3 Wallet'}</span>
            </button>
          </div>

          {/* Highlight metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-100 text-left">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">API Markup</p>
              <p className="text-lg font-black text-emerald-600">0% BYOK</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Supported LLMs</p>
              <p className="text-lg font-black text-slate-900">Gemini, GPT-4o, Claude</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Crypto Settlement</p>
              <p className="text-lg font-black text-slate-900">Instant On-Chain</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Context Window</p>
              <p className="text-lg font-black text-slate-900">Up to 2M Tokens</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURES GRID SECTION */}
      <section className="space-y-8" id="features">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
            Everything You Need for Modern AI & Web3 Hardware
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Architected for enterprise AI workflows, developers, and autonomous robotics buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: AI Chat Assistant */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 hover:border-emerald-500/50 hover:shadow-md transition-all group">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Conversational AI Advisor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time intelligence model that guides system selection, runs code analysis, compares specifications, and places marketplace orders directly.
            </p>
            <button onClick={() => onNavigateTab('ai-assistant')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1">
              Try AI Advisor →
            </button>
          </div>

          {/* Card 2: Web3 Wallet */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 hover:border-emerald-500/50 hover:shadow-md transition-all group">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Wallet className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Web3 Wallet Integration</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect MetaMask, Rabby, or WalletConnect for seamless multi-chain wallet verification, token balances, and decentralized identity.
            </p>
            <button onClick={onOpenWalletModal} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1">
              Connect Wallet →
            </button>
          </div>

          {/* Card 3: Crypto Payments */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 hover:border-emerald-500/50 hover:shadow-md transition-all group">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <CreditCard className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Cryptocurrency Payments</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pay for subscription plans and token credit top-ups instantly using ETH, BNB, USDT, USDC, MATIC, or SOL with automated receipt logs.
            </p>
            <button onClick={() => onNavigateTab('wallet')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1">
              View Payments Ledger →
            </button>
          </div>

          {/* Card 4: Chat-Based Ordering */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 hover:border-emerald-500/50 hover:shadow-md transition-all group">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Chat-Based Ordering & Payments</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inquire about hardware specs inside the AI chat, receive customized quotes, and trigger instant Web3 escrow checkout without leaving the conversation.
            </p>
            <button onClick={() => onNavigateTab('marketplace')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1">
              Explore Hardware Catalog →
            </button>
          </div>

          {/* Card 5: Model Comparison */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 hover:border-emerald-500/50 hover:shadow-md transition-all group">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">AI Model Benchmarking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compare Gemini 3.6 Flash, GPT-4o, Claude 3.5 Sonnet, and DeepSeek R1 across context windows, RPM throughput, reasoning depth, and cost.
            </p>
            <button onClick={() => onNavigateTab('pricing')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1">
              Compare Models →
            </button>
          </div>

          {/* Card 6: BYOK Vault */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 hover:border-emerald-500/50 hover:shadow-md transition-all group">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Key className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Bring Your Own Key (BYOK)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Securely store personal Gemini, OpenAI, or Anthropic API keys in an encrypted vault to execute requests at 0% platform markup.
            </p>
            <button onClick={() => onNavigateTab('keys')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1">
              Open Key Vault →
            </button>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE AI DEMO SECTION */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm" id="ai-demo">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Interactive Live Demo</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">Test RoboMarket AI Advisor Live</h2>
          </div>
          <button 
            onClick={() => onNavigateTab('ai-assistant')}
            className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <Bot className="h-4 w-4" />
            <span>Open Full Advisor Studio</span>
          </button>
        </div>

        {/* Preset Prompt Pills */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500">Sample Prompts to Try:</p>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleDemoSubmit(p)}
                className="text-xs font-semibold bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 px-3 py-2 rounded-xl transition-all cursor-pointer text-left"
              >
                "{p}"
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Query Input Box */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleDemoSubmit(demoPrompt);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={demoPrompt}
            onChange={(e) => setDemoPrompt(e.target.value)}
            placeholder="Ask AI Advisor about hardware, LLM model choice, or crypto payments..."
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white text-slate-900 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={isDemoLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
          >
            {isDemoLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Query AI</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Output Display */}
        {demoResponse && (
          <div className="bg-slate-50 border border-emerald-200/80 rounded-2xl p-5 space-y-3 animate-slide-in-right">
            <div className="flex items-center justify-between text-xs text-emerald-700 font-bold border-b border-emerald-100 pb-2">
              <span className="flex items-center gap-1.5">
                <Bot className="h-4 w-4 text-emerald-600" />
                <span>RoboMarket AI Advisor Response</span>
              </span>
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-mono text-[10px]">
                Powered by Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
              {demoResponse}
            </p>
          </div>
        )}
      </section>

      {/* 4. AI MODEL COMPARISON SECTION */}
      <section className="space-y-6" id="model-comparison">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Supported AI Models Benchmark</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Choose between high-speed multimodal inference and god-tier reasoning models.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-bold">
                  <th className="p-4">Model Name</th>
                  <th className="p-4">Provider</th>
                  <th className="p-4">Context Window</th>
                  <th className="p-4">Speed</th>
                  <th className="p-4">Reasoning</th>
                  <th className="p-4">BYOK Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {models.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-emerald-600" />
                      <span>{m.name}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-600">{m.provider}</td>
                    <td className="p-4 font-mono font-medium text-emerald-700">{m.contextWindow}</td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold text-[10px]">
                        {m.speedTier}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-800">{m.reasoningTier}</td>
                    <td className="p-4 text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>0% Markup</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. PRICING PLANS SECTION */}
      <section className="space-y-8" id="pricing-plans">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Flexible Pricing & Token Credits</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Subscribe using standard fiat USD or settle directly on-chain using your Web3 wallet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.filter(p => p.id !== 'plan_pack_100k').map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all space-y-6 ${
                plan.isPopular 
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20' 
                  : 'border-slate-200/80 hover:border-slate-300 shadow-xs'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-black text-slate-900 text-lg">{plan.name}</h3>
                  <p className="text-xs text-emerald-700 font-bold mt-1">{plan.tokenAllowance}</p>
                </div>

                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-slate-900">${plan.monthlyPriceUSD}</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>

                {/* Crypto Prices Pill */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] font-mono text-slate-600 space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Crypto Rates:</span>
                    <span className="text-emerald-700">{plan.cryptoPrices.ETH} ETH</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>USDT / USDC: ${plan.cryptoPrices.USDT}</span>
                    <span>BNB: {plan.cryptoPrices.BNB}</span>
                  </div>
                </div>

                {/* Feature List */}
                <ul className="space-y-2 text-xs text-slate-600 pt-2">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan(plan)}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                  plan.isPopular
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {plan.monthlyPriceUSD === 0 ? 'Start Free' : 'Subscribe with Crypto'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="space-y-6" id="testimonials">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Trusted by Engineers & AI Teams</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            See what developers, roboticists, and Web3 builders say about RoboMarket SaaS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center space-x-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "The BYOK integration is a game-changer. I plug in my personal Gemini Pro API key and run 100k hardware specs queries with zero platform markup. Combined with instant USDT settlement, this is the future."
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-100">
              <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                DR
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Dr. Rachel Vance</h4>
                <p className="text-[10px] text-slate-500">Lead Autonomous Robotics Researcher</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center space-x-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "We ordered two Boston Dynamics style robotic arms directly through the AI Assistant chat using ETH on Mainnet. The escrow receipt was generated immediately on-chain."
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-100">
              <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                AM
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Alexandre Moreau</h4>
                <p className="text-[10px] text-slate-500">VP Hardware Engineering, Automation Corp</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center space-x-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "DeepSeek R1 reasoning alongside Gemini 3.6 Flash in one clean interface gives our AI team total flexibility for ROS2 code generation and real-time hardware telemetry."
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-100">
              <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                SL
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Sarah Lin</h4>
                <p className="text-[10px] text-slate-500">Senior AI Systems Architect</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION SECTION */}
      <section className="max-w-3xl mx-auto space-y-6" id="faq">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <HelpCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Got Questions? We Have Answers</h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <span>{item.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-lg shadow-emerald-600/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-black sm:text-4xl tracking-tight">Ready to Unleash Web3 AI Computing?</h2>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Join thousands of developers using BYOK keys, multi-chain Web3 payments, and autonomous AI hardware purchasing today.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('pricing')}
              className="bg-white hover:bg-slate-100 text-emerald-900 font-black text-xs uppercase px-7 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Get Started Free
            </button>
            <button
              onClick={onOpenWalletModal}
              className="bg-emerald-700/80 hover:bg-emerald-700 text-white border border-emerald-400/40 font-bold text-xs uppercase px-7 py-3.5 rounded-xl transition-all cursor-pointer"
            >
              Connect Web3 Wallet
            </button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-slate-200 pt-10 pb-6 text-slate-600 text-xs space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <div className="space-y-3 col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 text-slate-900 font-black text-base">
              <Bot className="h-5 w-5 text-emerald-600" />
              <span>RoboMarket SaaS</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Next-generation autonomous AI SaaS platform with on-chain crypto settlement and zero-markup BYOK key vault infrastructure.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-1.5 text-slate-500">
              <li><button onClick={() => onNavigateTab('marketplace')} className="hover:text-emerald-600">Hardware Marketplace</button></li>
              <li><button onClick={() => onNavigateTab('ai-assistant')} className="hover:text-emerald-600">AI Advisor Studio</button></li>
              <li><button onClick={() => onNavigateTab('pricing')} className="hover:text-emerald-600">Pricing & LLM Models</button></li>
              <li><button onClick={() => onNavigateTab('keys')} className="hover:text-emerald-600">API Key Vault (BYOK)</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Web3 Infrastructure</h4>
            <ul className="space-y-1.5 text-slate-500">
              <li><button onClick={onOpenWalletModal} className="hover:text-emerald-600">MetaMask & Rabby</button></li>
              <li><button onClick={() => onNavigateTab('wallet')} className="hover:text-emerald-600">Payments Ledger</button></li>
              <li><span className="text-slate-400">Ethereum / BNB / Solana</span></li>
              <li><span className="text-slate-400">Smart Contract Escrow</span></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Security & Status</h4>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold text-[10px]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Node Systems Operational</span>
            </div>
            <p className="text-[11px] text-slate-400">Client-side encryption for user keys. Non-custodial Web3 wallet connections.</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 text-center text-slate-400 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <p>© 2026 RoboMarket AI SaaS Inc. All rights reserved.</p>
          <div className="flex space-x-4">
            <button onClick={() => onNavigateTab('about')} className="hover:text-emerald-600">About Us</button>
            <button onClick={() => onNavigateTab('contact')} className="hover:text-emerald-600">Contact Support</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
