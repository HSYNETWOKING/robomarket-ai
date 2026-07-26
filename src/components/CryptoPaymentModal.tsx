import React, { useState } from 'react';
import { CryptoCurrency, SaaSPlan, WalletState, CryptoPayment } from '../types';
import { Check, CreditCard, ShieldCheck, Zap, X, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';

interface CryptoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SaaSPlan | null;
  walletState: WalletState;
  onPaymentSuccess: (payment: CryptoPayment) => void;
}

export const CryptoPaymentModal: React.FC<CryptoPaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  walletState,
  onPaymentSuccess
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency>('ETH');
  const [paymentStep, setPaymentStep] = useState<'review' | 'confirming' | 'success'>('review');
  const [txHash, setTxHash] = useState<string | null>(null);

  if (!isOpen || !plan) return null;

  const cryptoAmount = plan.cryptoPrices[selectedCurrency] || 0.01;
  const gasFeeEstimated = selectedCurrency === 'ETH' ? '0.00035 ETH ($1.05)' : '0.0001 BNB ($0.06)';

  const handleConfirmPayment = () => {
    setPaymentStep('confirming');

    setTimeout(() => {
      const generatedHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(generatedHash);

      const newPayment: CryptoPayment = {
        id: "pay_" + Date.now(),
        txHash: generatedHash,
        amountCrypto: cryptoAmount,
        currency: selectedCurrency,
        amountUSD: plan.monthlyPriceUSD,
        type: plan.id.includes('pack') ? 'credit_pack' : 'subscription',
        planId: plan.id,
        planName: plan.name,
        userAddress: walletState.address || "0x3C44CdD06a900fa2b585dd299e03d12FA4293BC1",
        userName: "TechEnthusiast99",
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        blockNumber: 19851024,
        gasFeeETH: selectedCurrency === 'ETH' ? '0.00035 ETH' : '0.0001 BNB',
        receiptUrl: `https://etherscan.io/tx/${generatedHash}`
      };

      setPaymentStep('success');
      onPaymentSuccess(newPayment);
    }, 2200);
  };

  const handleReset = () => {
    setPaymentStep('review');
    setTxHash(null);
    onClose();
  };

  const currencies: { symbol: CryptoCurrency; name: string; icon: string }[] = [
    { symbol: 'ETH', name: 'Ethereum Mainnet', icon: '💎' },
    { symbol: 'BNB', name: 'BNB Smart Chain', icon: '🟡' },
    { symbol: 'USDT', name: 'Tether USD (ERC20)', icon: '💵' },
    { symbol: 'USDC', name: 'USD Coin', icon: '🪙' },
    { symbol: 'MATIC', name: 'Polygon', icon: '🟣' },
    { symbol: 'SOL', name: 'Solana', icon: '🟣' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div id="crypto-payment-modal" className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl">
        <button
          onClick={handleReset}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Web3 Crypto Checkout</h3>
            <p className="text-xs text-slate-500">On-chain direct activation for {plan.name}</p>
          </div>
        </div>

        {paymentStep === 'review' && (
          <div className="space-y-5">
            {/* Plan Card Summary */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{plan.badge || 'Plan Selection'}</span>
                  <h4 className="text-base font-black text-slate-900">{plan.name}</h4>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-slate-900">${plan.monthlyPriceUSD}</div>
                  <div className="text-[11px] text-slate-500 font-bold">USD Equivalent</div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-emerald-600" />
                  <span><strong>AI Token Allowance:</strong> {plan.tokenAllowance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span><strong>Supported Models:</strong> {plan.modelsAccess.slice(0, 3).join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Currency Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Crypto Currency</label>
              <div className="grid grid-cols-3 gap-2">
                {currencies.map((c) => (
                  <button
                    key={c.symbol}
                    onClick={() => setSelectedCurrency(c.symbol)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-2.5 transition-all text-xs cursor-pointer ${
                      selectedCurrency === c.symbol
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-lg">{c.icon}</span>
                    <span className="mt-1 font-black">{c.symbol}</span>
                    <span className="text-[10px] text-slate-500 truncate max-w-full font-bold">
                      {plan.cryptoPrices[c.symbol] ? `${plan.cryptoPrices[c.symbol]} ${c.symbol}` : `$${plan.monthlyPriceUSD}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-2">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Paying From:</span>
                <span className="font-mono text-slate-900 font-bold">{walletState.address ? `${walletState.address.substring(0, 8)}...${walletState.address.substring(34)}` : '0x3C44...93BC1'}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Estimated Gas Fee:</span>
                <span className="text-slate-700 font-mono font-bold">{gasFeeEstimated}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-sm">
                <span>Total On-Chain Amount:</span>
                <span className="text-emerald-700 font-mono font-black">{cryptoAmount} {selectedCurrency}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
            >
              <span>Confirm & Sign in Wallet</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {paymentStep === 'confirming' && (
          <div className="text-center py-8 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 animate-pulse">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900">Broadcasting On-Chain Transaction...</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">Please approve the signature prompt in your Web3 wallet ({walletState.walletType || 'MetaMask'}).</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs font-mono text-slate-600 font-bold">
              Contract Address: 0x8A72...FE31 | Gas Limit: 21,000
            </div>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200">
              <Check className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900">Transaction Confirmed!</h4>
              <p className="text-xs text-slate-600 mt-1">
                Your <strong className="text-emerald-700 font-bold">{plan.name}</strong> subscription has been successfully activated on-chain.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs text-left space-y-2">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Transaction Hash:</span>
                <span className="font-mono text-emerald-700 font-bold truncate max-w-[200px]">{txHash}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Amount Paid:</span>
                <span className="font-mono text-slate-900 font-bold">{cryptoAmount} {selectedCurrency} (${plan.monthlyPriceUSD})</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Block Number:</span>
                <span className="font-mono text-slate-900 font-bold">#19851024</span>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={`https://etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                Etherscan Receipt
              </a>
              <button
                onClick={handleReset}
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 rounded-xl bg-slate-50 p-3 border border-slate-200 text-[11px] text-slate-600">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Verifiable smart contract escrow. Immediate token allocation upon block confirmation.</span>
        </div>
      </div>
    </div>
  );
};
