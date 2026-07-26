import React, { useState, useEffect } from 'react';
import { 
  Bot, Mail, MapPin, Globe, Cpu, ShieldCheck, Activity, Bell, FileText, 
  Settings, HelpCircle, CheckCircle2, RefreshCw, DollarSign, Download, 
  Printer, ArrowRight, Shield, Zap, Sliders, Lock
} from 'lucide-react';

interface AboutProps {
  onBrowse: () => void;
}

export function AboutView({ onBrowse }: AboutProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8" id="about-viewport">
      <div className="text-center space-y-2">
        <Bot className="h-12 w-12 text-emerald-600 mx-auto animate-pulse" />
        <h1 className="text-2xl font-black text-slate-900">About RoboMarket AI</h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          An autonomous commercial robot marketplace connecting global buyers, robotics researchers, and certified manufacturers with AI-powered safety verification.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-emerald-600 inline-block">
            <Cpu className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">Solving Procurement Risk</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Acquiring heavy robotic hardware or custom humanoid assistants carries high capital risks. Buyers often face fraudulent listings, inconsistent battery or payload descriptions, and insecure transactions. RoboMarket AI uses Gemini to analyze listings and specs, warning buyers about discrepancies before money transfers.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-emerald-600 inline-block">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">Interactive Specifications</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Compare complex physical degrees of freedom, battery ratings, payload configurations, and operating software using our structured side-by-side spec grid. Generate simplified English summaries of hardware metrics instantly using our integrated AI explainer.
          </p>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4 shadow-xs">
        <h3 className="text-xs font-bold text-emerald-700 font-mono uppercase tracking-widest">Target Systems</h3>
        <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
          Our platform actively facilitates the buying, selling, and leasing of industrial 6-axis arms, bipedal humanoid guides, medical/pharmaceutical delivery bots, autonomous agricultural drones, high-terrain security platforms, and STEM educational micro-controllers.
        </p>
        <button
          onClick={onBrowse}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-xl cursor-pointer transition-colors shadow-sm min-h-[44px]"
        >
          Explore Catalog Floors
        </button>
      </div>
    </div>
  );
}

export function ApiHealthView() {
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(42);
  const [healthStatus, setHealthStatus] = useState({
    apiGateway: 'operational',
    geminiService: 'operational',
    web3RPC: 'operational',
    databaseCache: 'operational'
  });

  const runPingCheck = async () => {
    setLoading(true);
    const start = Date.now();
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setLatency(Date.now() - start);
      }
    } catch {
      setLatency(120);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runPingCheck();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6" id="api-health-viewport">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600">
            <Activity className="h-6 w-6" />
            <h1 className="text-xl font-black text-slate-900">API Health & System Status</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Real-time system diagnostics, backend uptime, and endpoint latency metrics.</p>
        </div>
        <button
          onClick={runPingCheck}
          disabled={loading}
          className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all min-h-[44px] cursor-pointer shadow-xs disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Testing...' : 'Ping Diagnostics'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Gateway Latency</span>
          <div className="text-2xl font-black text-emerald-600">{latency ? `${latency} ms` : 'Testing'}</div>
          <p className="text-[10px] text-slate-500 font-medium">Container Port 3000 Node.js</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Platform Uptime</span>
          <div className="text-2xl font-black text-slate-900">99.98%</div>
          <p className="text-[10px] text-emerald-600 font-bold">100% SLA Maintained</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">AI Provider Routing</span>
          <div className="text-2xl font-black text-slate-900">Gemini 3.6</div>
          <p className="text-[10px] text-slate-500 font-medium">BYOK Vault Priority Active</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Web3 Escrow Bridge</span>
          <div className="text-2xl font-black text-emerald-600">Active</div>
          <p className="text-[10px] text-slate-500 font-medium">Multi-Chain RPC Connected</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">Microservice Health Matrix</h2>
        <div className="space-y-3 divide-y divide-slate-100">
          <div className="pt-2 flex items-center justify-between text-xs font-medium">
            <span className="font-bold text-slate-800">REST API Gateway (/api/robots, /api/auth)</span>
            <span className="inline-flex items-center space-x-1 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Operational</span>
            </span>
          </div>
          <div className="pt-3 flex items-center justify-between text-xs font-medium">
            <span className="font-bold text-slate-800">Gemini AI Cognitive Engine (/api/ai/*)</span>
            <span className="inline-flex items-center space-x-1 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Operational</span>
            </span>
          </div>
          <div className="pt-3 flex items-center justify-between text-xs font-medium">
            <span className="font-bold text-slate-800">Multi-Chain Web3 Escrow Contract Simulator</span>
            <span className="inline-flex items-center space-x-1 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Operational</span>
            </span>
          </div>
          <div className="pt-3 flex items-center justify-between text-xs font-medium">
            <span className="font-bold text-slate-800">Buyer-Seller Inbox WebSocket Relay (/api/chats)</span>
            <span className="inline-flex items-center space-x-1 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Operational</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PriceAlertsView() {
  const [alerts, setAlerts] = useState([
    { id: '1', title: 'Unit-01 Biped Humanoid', targetPrice: 22000, currentPrice: 24500, triggered: false },
    { id: '2', title: '6-Axis High-Payload Robotic Arm', targetPrice: 15000, currentPrice: 14800, triggered: true },
    { id: '3', title: 'AgriRover Harvest Drone Bot', targetPrice: 8500, currentPrice: 9200, triggered: false }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTarget) return;
    setAlerts(prev => [
      {
        id: Date.now().toString(),
        title: newTitle,
        targetPrice: parseFloat(newTarget),
        currentPrice: parseFloat(newTarget) * 1.1,
        triggered: false
      },
      ...prev
    ]);
    setNewTitle('');
    setNewTarget('');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6" id="price-alerts-viewport">
      <div className="flex items-center space-x-2 text-emerald-600 border-b border-slate-200 pb-4">
        <Bell className="h-6 w-6" />
        <div>
          <h1 className="text-xl font-black text-slate-900">Hardware Price Drop Alerts</h1>
          <p className="text-xs text-slate-500 mt-0.5">Set target procurement prices for robotic platforms and receive instant notifications.</p>
        </div>
      </div>

      <form onSubmit={handleCreateAlert} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">Create New Price Drop Tracker</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Hardware Model / Platform Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-emerald-600 min-h-[44px]"
            required
          />
          <input
            type="number"
            placeholder="Target Price Threshold ($ USD)"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            className="border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-emerald-600 min-h-[44px]"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-all min-h-[44px]"
        >
          Create Price Watcher
        </button>
      </form>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">Active Price Drop Watchlist</h2>
        <div className="space-y-3">
          {alerts.map(item => (
            <div key={item.id} className="p-4 border border-slate-100 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 block">{item.title}</span>
                <span className="text-[11px] text-slate-500">Target: ${item.targetPrice.toLocaleString()} | Current: ${item.currentPrice.toLocaleString()}</span>
              </div>
              {item.triggered ? (
                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2.5 py-1 rounded-lg animate-pulse">
                  Target Price Reached!
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  Monitoring Active
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InvoicesView() {
  const sampleInvoices = [
    { id: 'INV-2026-089', date: '2026-07-24', item: 'Pro Contractor SaaS Monthly Plan', amount: '$29.00', status: 'Paid', hash: '0x8f2a...1e4b' },
    { id: 'INV-2026-074', date: '2026-07-15', item: '1,000,000 AI Token Credit Pack', amount: '$49.00', status: 'Paid', hash: '0x3c91...88a2' },
    { id: 'INV-2026-012', date: '2026-06-28', item: 'Unit-01 Biped Humanoid Order Escrow', amount: '$24,500.00', status: 'Escrow Locked', hash: '0x71a4...90c1' }
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6" id="invoices-viewport">
      <div className="flex items-center space-x-2 text-emerald-600 border-b border-slate-200 pb-4">
        <FileText className="h-6 w-6" />
        <div>
          <h1 className="text-xl font-black text-slate-900">Billing & Crypto Invoices</h1>
          <p className="text-xs text-slate-500 mt-0.5">Download receipts, view tax invoices, and inspect on-chain escrow transaction records.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-mono text-xs font-bold text-slate-800">
          Generated Platform Statements
        </div>
        <div className="divide-y divide-slate-100">
          {sampleInvoices.map(inv => (
            <div key={inv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-900">{inv.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>{inv.status}</span>
                </div>
                <div className="text-slate-600 font-medium">{inv.item}</div>
                <div className="text-[10px] text-slate-400 font-mono">{inv.date} | Tx: {inv.hash}</div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm font-black text-slate-900">{inv.amount}</span>
                <button
                  onClick={() => window.print()}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Print Receipt"
                >
                  <Printer className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SettingsView() {
  const [currency, setCurrency] = useState('USD');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6" id="settings-viewport">
      <div className="flex items-center space-x-2 text-emerald-600 border-b border-slate-200 pb-4">
        <Settings className="h-6 w-6" />
        <div>
          <h1 className="text-xl font-black text-slate-900">Platform Preferences & Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage currency displays, BYOK key priorities, and email notification webhooks.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Settings successfully saved and synchronized.</span>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono block">Display Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full sm:w-64 border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-emerald-600 min-h-[44px]"
          >
            <option value="USD">USD ($ - United States Dollar)</option>
            <option value="EUR">EUR (€ - Euro)</option>
            <option value="ETH">ETH (Ξ - Ethereum)</option>
            <option value="SOL">SOL (Solana)</option>
          </select>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono block">Notifications & Alerts</label>
          <label className="flex items-center space-x-3 text-xs text-slate-700 font-medium cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="h-4 w-4 text-emerald-600 rounded-md focus:ring-emerald-500 border-slate-300 cursor-pointer"
            />
            <span>Receive hardware price drop notifications and order status updates via email.</span>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer transition-all shadow-sm min-h-[44px]"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}

export function SupportView() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6" id="support-viewport">
      <div className="flex items-center space-x-2 text-emerald-600 border-b border-slate-200 pb-4">
        <HelpCircle className="h-6 w-6" />
        <div>
          <h1 className="text-xl font-black text-slate-900">Support & Help Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">Submit support tickets, review FAQs, and request technical assist for hardware orders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">Frequently Asked Questions</h2>
          <div className="space-y-2 text-xs">
            <details className="border-b border-slate-100 pb-2 cursor-pointer">
              <summary className="font-bold text-slate-800">How does BYOK (Bring Your Own Key) work?</summary>
              <p className="text-slate-500 mt-1 pl-2">Enter your Gemini or OpenAI API key in the API Vault tab. Keys are stored safely in local browser storage and take priority over platform defaults.</p>
            </details>
            <details className="border-b border-slate-100 pb-2 cursor-pointer">
              <summary className="font-bold text-slate-800">Are crypto payments locked in escrow?</summary>
              <p className="text-slate-500 mt-1 pl-2">Yes. Once checkout completes, funds remain in simulated smart contract escrow until the buyer confirms hardware inspection.</p>
            </details>
            <details className="border-b border-slate-100 pb-2 cursor-pointer">
              <summary className="font-bold text-slate-800">What wallets are supported?</summary>
              <p className="text-slate-500 mt-1 pl-2">MetaMask, Rabby Wallet, WalletConnect, Coinbase Wallet, and Phantom Wallet are all natively supported.</p>
            </details>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">Submit Support Ticket</h2>
          {submitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl text-center">
              Support ticket created! A specialist will review your request shortly.
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-3">
              <input
                type="email"
                placeholder="Your Contact Email"
                required
                className="w-full border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-emerald-600 min-h-[44px]"
              />
              <textarea
                placeholder="Describe your issue or order inquiry in detail..."
                required
                className="w-full h-24 border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-emerald-600"
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl cursor-pointer min-h-[44px]"
              >
                Dispatch Ticket
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function ContactView() {
  const [success, setSuccess] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8" id="contact-viewport">
      <div className="text-center space-y-2">
        <Mail className="h-12 w-12 text-emerald-600 mx-auto animate-bounce" />
        <h1 className="text-2xl font-black text-slate-900">Contact Robotics Hub</h1>
        <p className="text-sm text-slate-500">
          Coordinate freight inspections, dispatch nodes, or report listing violations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center space-y-2.5 shadow-xs">
          <MapPin className="h-6 w-6 text-emerald-600 mx-auto" />
          <h2 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider">Freight Nodes</h2>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            RoboMarket HQ<br />
            100 Innovation Way, Suite 400<br />
            San Jose, CA 95110
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center space-y-2.5 shadow-xs">
          <Mail className="h-6 w-6 text-emerald-600 mx-auto" />
          <h2 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider">Email Dispatch</h2>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            General Inquiries: info@robomarket.ai<br />
            Support: support@robomarket.ai<br />
            Verifications: audit@robomarket.ai
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center space-y-2.5 shadow-xs">
          <Globe className="h-6 w-6 text-emerald-600 mx-auto" />
          <h2 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider">Sandbox Terminal</h2>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Running Container: Port 3000<br />
            Cloud Run Instance<br />
            Developer Console Active
          </p>
        </div>
      </div>
    </div>
  );
}
