import React, { useState } from 'react';
import { SaaSPlan, AIModelSpec, CryptoCurrency, WalletState } from '../types';
import { Check, Zap, Cpu, Sparkles, ShieldCheck, ArrowRight, Server, Layers } from 'lucide-react';

interface PricingMatrixProps {
  plans: SaaSPlan[];
  models: AIModelSpec[];
  walletState: WalletState;
  onSelectPlan: (plan: SaaSPlan) => void;
}

export const PricingMatrix: React.FC<PricingMatrixProps> = ({
  plans,
  models,
  walletState,
  onSelectPlan
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency>('ETH');
  const [activeTab, setActiveTab] = useState<'plans' | 'models'>('plans');

  return (
    <div id="pricing-matrix-page" className="space-y-10 pb-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>Transparent AI Infrastructure & Web3 Crypto Subscriptions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Flexible AI Computing Plans & Model Benchmarks
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Scale your AI operations with platform API credits or Bring Your Own Key (BYOK). Settle on-chain with ETH, BNB, USDT, USDC, MATIC, or SOL.
        </p>

        {/* Currency Switcher */}
        <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 mr-1">Display Crypto Rate:</span>
          {(['ETH', 'BNB', 'USDT', 'USDC', 'MATIC', 'SOL'] as CryptoCurrency[]).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCurrency(c)}
              className={`rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                selectedCurrency === c
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center border-b border-slate-200 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 pb-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'plans'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Subscription Plans</span>
        </button>
        <button
          onClick={() => setActiveTab('models')}
          className={`flex items-center gap-2 pb-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'models'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>AI Model Comparison</span>
        </button>
      </div>

      {/* Plans Section */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const cryptoPrice = plan.cryptoPrices[selectedCurrency] || 0;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-200 bg-white ${
                  plan.isPopular
                    ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200/80 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {plan.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      plan.isPopular
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-emerald-700 font-bold mt-1">{plan.supportLevel} Support</p>
                  </div>

                  {/* Price Block */}
                  <div className="mb-6 rounded-xl bg-slate-50 p-4 border border-slate-200/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">${plan.monthlyPriceUSD}</span>
                      <span className="text-xs text-slate-500">/ month</span>
                    </div>
                    {plan.monthlyPriceUSD > 0 && (
                      <div className="mt-1 text-xs font-mono font-bold text-emerald-700">
                        ≈ {cryptoPrice} {selectedCurrency}
                      </div>
                    )}
                  </div>

                  {/* Highlights */}
                  <div className="space-y-3 mb-6">
                    <div className="rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2 border border-emerald-200/60">
                      <Zap className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{plan.tokenAllowance}</span>
                    </div>

                    <div className="text-xs font-bold text-slate-700 mb-2">Included Features:</div>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    plan.isPopular
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>{plan.monthlyPriceUSD === 0 ? 'Current Free Tier' : 'Subscribe with Crypto'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Models Matrix Table */}
      {activeTab === 'models' && (
        <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="h-5 w-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">Supported LLM Specs & Benchmarks</h3>
                <p className="text-xs text-slate-500">Context windows, request limits, reasoning scores, and BYOK compatibility</p>
              </div>
            </div>
            <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-mono text-slate-700 font-bold">
              {models.length} Models Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">AI Model</th>
                  <th className="p-4">Provider</th>
                  <th className="p-4">Context Window</th>
                  <th className="p-4">Rate Limit</th>
                  <th className="p-4">Speed</th>
                  <th className="p-4">Reasoning</th>
                  <th className="p-4">Plan Access</th>
                  <th className="p-4">BYOK Vault</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {models.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-emerald-600" />
                        <span>{m.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5 line-clamp-1 max-w-xs">{m.description}</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-600">{m.provider}</td>
                    <td className="p-4 font-mono font-bold text-emerald-700">{m.contextWindow}</td>
                    <td className="p-4 font-mono text-slate-600">{m.tokenRateLimit}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-0.5 font-bold text-[10px] ${
                        m.speedTier === 'Ultra Fast' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {m.speedTier}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-0.5 font-bold text-[10px] ${
                        m.reasoningTier === 'God Tier' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {m.reasoningTier}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="rounded bg-slate-100 px-2.5 py-0.5 font-bold text-slate-700">
                        {m.availability}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>0% Markup</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Feature Guarantee Banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">Bring Your Own Key (BYOK) Freedom</h4>
            <p className="text-xs text-slate-600">
              Have an existing OpenAI, Gemini, or Claude API key? Store it securely in your API Vault to execute requests with zero platform markups.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
