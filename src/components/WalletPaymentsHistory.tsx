import React from 'react';
import { CryptoPayment, WalletState } from '../types';
import { Wallet, CreditCard, ExternalLink, ShieldCheck, ArrowDownRight, CheckCircle } from 'lucide-react';

interface WalletPaymentsHistoryProps {
  walletState: WalletState;
  payments: CryptoPayment[];
  onOpenWalletModal: () => void;
}

export const WalletPaymentsHistory: React.FC<WalletPaymentsHistoryProps> = ({
  walletState,
  payments,
  onOpenWalletModal
}) => {
  return (
    <div id="wallet-payments-page" className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Wallet Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">Connected Web3 Wallet</h2>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                  {walletState.network}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">
                {walletState.address || '0x3C44CdD06a900fa2b585dd299e03d12FA4293BC1'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenWalletModal}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
          >
            {walletState.isConnected ? 'Manage Wallet' : 'Connect Wallet'}
          </button>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(walletState.balances).map(([symbol, balance]) => (
            <div key={symbol} className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-center">
              <div className="text-[11px] font-bold text-slate-500">{symbol}</div>
              <div className="text-sm font-black font-mono text-slate-900 mt-1">{balance}</div>
            </div>
          ))}
        </div>
      </div>

      {/* On-Chain Payment History Ledger */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">On-Chain Subscription & Token Purchase Ledger</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono font-bold">{payments.length} Transactions Recorded</span>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500 font-medium">
            No crypto payments recorded yet. Subscribe to a plan or purchase token packs to populate your ledger!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Type & Item</th>
                  <th className="p-3">Crypto Amount</th>
                  <th className="p-3">USD Value</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3 text-right">Etherscan Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <ArrowDownRight className="h-4 w-4 text-emerald-600" />
                        <div>
                          <div>{p.planName}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">{p.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-700">
                      {p.amountCrypto} {p.currency}
                    </td>
                    <td className="p-3 font-bold text-slate-900">${p.amountUSD}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                        <CheckCircle className="h-3 w-3 text-emerald-600" /> Confirmed
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{new Date(p.timestamp).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <a
                        href={p.receiptUrl || `https://etherscan.io/tx/${p.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-600 hover:underline font-mono text-[11px] font-bold"
                      >
                        <span>{p.txHash.substring(0, 8)}...</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-slate-200/80 text-xs text-slate-600 shadow-2xs">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
        <span>All subscriptions automatically refresh token allocations upon on-chain block validation.</span>
      </div>
    </div>
  );
};
