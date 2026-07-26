import React, { useState } from 'react';
import { WalletState, WalletType } from '../types';
import { ShieldCheck, Wallet, X, Check, Copy, ExternalLink, RefreshCw } from 'lucide-react';

interface Web3WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletState: WalletState;
  setWalletState: (state: WalletState) => void;
}

export const Web3WalletModal: React.FC<Web3WalletModalProps> = ({
  isOpen,
  onClose,
  walletState,
  setWalletState
}) => {
  const [activeTab, setActiveTab] = useState<'wallets' | 'wc_qr'>('wallets');
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleConnect = (type: WalletType) => {
    setIsConnecting(type);
    setTimeout(() => {
      let mockAddress = "0x3C44CdD06a900fa2b585dd299e03d12FA4293BC1";
      if (type === 'Rabby') mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
      if (type === 'Phantom') mockAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";

      const newState: WalletState = {
        isConnected: true,
        address: mockAddress,
        walletType: type,
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
      };
      setWalletState(newState);
      setIsConnecting(null);
    }, 1000);
  };

  const handleDisconnect = () => {
    setWalletState({
      isConnected: false,
      address: null,
      walletType: null,
      network: "Ethereum Mainnet",
      chainId: 1,
      balances: { ETH: 0, BNB: 0, USDT: 0, USDC: 0, MATIC: 0, SOL: 0 }
    });
  };

  const copyAddress = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const wallets = [
    {
      type: 'MetaMask' as WalletType,
      name: 'MetaMask',
      desc: 'Connect to your MetaMask browser extension wallet',
      icon: '🦊',
      popular: true
    },
    {
      type: 'Rabby' as WalletType,
      name: 'Rabby Wallet',
      desc: 'Multi-chain Web3 wallet with automated risk scanning',
      icon: '🐰',
      popular: true
    },
    {
      type: 'WalletConnect' as WalletType,
      name: 'WalletConnect',
      desc: 'Scan QR code with mobile app (Trust, Rainbow, Metamask Mobile)',
      icon: '🔗',
      popular: false
    },
    {
      type: 'Coinbase' as WalletType,
      name: 'Coinbase Wallet',
      desc: 'Connect via Coinbase self-custody wallet app',
      icon: '🟦',
      popular: false
    },
    {
      type: 'Phantom' as WalletType,
      name: 'Phantom',
      desc: 'Solana & Multi-chain EVM wallet',
      icon: '👻',
      popular: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div id="web3-wallet-modal" className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Web3 Wallet Connection</h3>
            <p className="text-xs text-slate-500">Connect your crypto wallet for automated on-chain settlement</p>
          </div>
        </div>

        {/* Connected View */}
        {walletState.isConnected ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Connected via {walletState.walletType}
                </span>
                <span className="rounded bg-slate-200/80 px-2.5 py-0.5 text-slate-800 font-mono font-bold text-[10px]">
                  {walletState.network}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-slate-200 mb-3">
                <span className="font-mono text-xs text-slate-900 font-bold truncate max-w-[220px]">
                  {walletState.address}
                </span>
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 transition-colors font-bold ml-2 cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Balances Summary */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-white p-2.5 border border-slate-200">
                  <div className="text-slate-500 font-bold text-[10px]">ETH Balance</div>
                  <div className="font-black text-slate-900 font-mono mt-0.5">{walletState.balances.ETH} ETH</div>
                </div>
                <div className="rounded-xl bg-white p-2.5 border border-slate-200">
                  <div className="text-slate-500 font-bold text-[10px]">USDT Balance</div>
                  <div className="font-black text-slate-900 font-mono mt-0.5">${walletState.balances.USDT}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={`https://etherscan.io/address/${walletState.address}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                View on Explorer
              </a>
              <button
                onClick={handleDisconnect}
                className="flex-1 rounded-xl bg-rose-50 border border-rose-200 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        ) : (
          /* Disconnected Select Wallet View */
          <div>
            <div className="flex border-b border-slate-200 mb-4">
              <button
                onClick={() => setActiveTab('wallets')}
                className={`pb-2 text-xs font-bold px-3 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'wallets' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Browser Extension Wallets
              </button>
              <button
                onClick={() => setActiveTab('wc_qr')}
                className={`pb-2 text-xs font-bold px-3 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'wc_qr' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                WalletConnect QR
              </button>
            </div>

            {activeTab === 'wallets' ? (
              <div className="space-y-2">
                {wallets.map((w) => (
                  <button
                    key={w.type}
                    onClick={() => {
                      if (w.type === 'WalletConnect') {
                        setActiveTab('wc_qr');
                      } else {
                        handleConnect(w.type);
                      }
                    }}
                    disabled={isConnecting !== null}
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 hover:bg-slate-100 hover:border-emerald-300 transition-all text-left group disabled:opacity-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{w.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {w.name}
                          </span>
                          {w.popular && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{w.desc}</p>
                      </div>
                    </div>
                    {isConnecting === w.type ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-emerald-600" />
                    ) : (
                      <span className="text-xs text-slate-500 group-hover:text-slate-800 font-bold">Connect</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              /* QR Code Simulated Screen */
              <div className="text-center py-4 space-y-3">
                <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-slate-50 p-4 shadow-inner">
                  <div className="grid grid-cols-6 gap-1.5 opacity-90">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-5 w-5 rounded ${
                          (i * 7) % 3 === 0 ? 'bg-emerald-600' : (i * 3) % 2 === 0 ? 'bg-slate-300' : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  Scan QR code with <span className="text-emerald-700 font-bold">Trust Wallet</span>, <span className="text-emerald-700 font-bold">Rainbow</span>, or <span className="text-emerald-700 font-bold">MetaMask Mobile</span>.
                </div>
                <button
                  onClick={() => handleConnect('WalletConnect')}
                  className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                >
                  Simulate QR Connection
                </button>
              </div>
            )}
          </div>
        )}

        {/* Security Footer */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-slate-50 p-3 border border-slate-200 text-[11px] text-slate-600">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Non-custodial connection. Private keys are never exposed.</span>
        </div>
      </div>
    </div>
  );
};
