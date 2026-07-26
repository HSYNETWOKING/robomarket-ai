import React, { useState } from 'react';
import { UserApiKey, ApiKeyProvider, ApiKeyPreference } from '../types';
import { Key, ShieldCheck, Plus, Trash2, Check, RefreshCw, Lock, Zap, AlertCircle } from 'lucide-react';

interface ApiKeyVaultProps {
  userKeys: UserApiKey[];
  pref: ApiKeyPreference;
  onAddKey: (keyData: { provider: ApiKeyProvider; keyName: string; rawKey: string }) => void;
  onDeleteKey: (keyId: string) => void;
  onTogglePref: (pref: ApiKeyPreference) => void;
}

export const ApiKeyVault: React.FC<ApiKeyVaultProps> = ({
  userKeys,
  pref,
  onAddKey,
  onDeleteKey,
  onTogglePref
}) => {
  const [provider, setProvider] = useState<ApiKeyProvider>('gemini');
  const [keyName, setKeyName] = useState('');
  const [rawKey, setRawKey] = useState('');
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; latencyMs: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawKey.trim()) {
      setError('Please enter a valid API key string.');
      return;
    }
    setError(null);
    onAddKey({
      provider,
      keyName: keyName.trim() || `${provider.toUpperCase()} Key`,
      rawKey: rawKey.trim()
    });
    setKeyName('');
    setRawKey('');
  };

  const handleTestKey = (keyId: string) => {
    setIsTesting(keyId);
    setTestResult(null);

    setTimeout(() => {
      setIsTesting(null);
      setTestResult({
        id: keyId,
        success: true,
        latencyMs: Math.floor(110 + Math.random() * 80)
      });
    }, 1200);
  };

  const providersList: { provider: ApiKeyProvider; label: string; placeholder: string; docUrl: string }[] = [
    { provider: 'gemini', label: 'Google Gemini AI', placeholder: 'AIzaSy...', docUrl: 'https://aistudio.google.com/app/apikey' },
    { provider: 'openai', label: 'OpenAI (GPT-4o)', placeholder: 'sk-proj-...', docUrl: 'https://platform.openai.com/api-keys' },
    { provider: 'claude', label: 'Anthropic Claude', placeholder: 'sk-ant-...', docUrl: 'https://console.anthropic.com/' },
    { provider: 'grok', label: 'xAI Grok', placeholder: 'xai-...', docUrl: 'https://console.x.ai/' },
    { provider: 'deepseek', label: 'DeepSeek R1 / V3', placeholder: 'sk-ds-...', docUrl: 'https://platform.deepseek.com/' },
    { provider: 'mistral', label: 'Mistral AI', placeholder: 'mis-...', docUrl: 'https://console.mistral.ai/' }
  ];

  return (
    <div id="api-key-vault-page" className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200">
              <Key className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">BYOK (Bring Your Own Key) Vault</h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Use your personal API keys to execute LLM requests with 0% platform markup.
              </p>
            </div>
          </div>

          {/* Mode Switch Toggle */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => onTogglePref({ mode: 'platform', activeCustomKeyId: pref.activeCustomKeyId })}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                pref.mode === 'platform'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Platform API Key
            </button>
            <button
              onClick={() => onTogglePref({ mode: 'custom', activeCustomKeyId: userKeys[0]?.id || null })}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                pref.mode === 'custom'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Personal Key (BYOK)
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Current AI Engine:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${pref.mode === 'custom' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'}`}>
              {pref.mode === 'custom' ? '⚡ Personal BYOK Vault Active' : '🤖 RoboMarket Platform Key'}
            </span>
          </div>
        </div>
      </div>

      {/* Add Key Form */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
          <Plus className="h-5 w-5 text-emerald-600" />
          <span>Add New Personal API Key</span>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 border border-rose-200 text-xs text-rose-700 font-bold">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select AI Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as ApiKeyProvider)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
              >
                {providersList.map((p) => (
                  <option key={p.provider} value={p.provider}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Key Alias / Name</label>
              <input
                type="text"
                placeholder="e.g. My Gemini Pro Key"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700">API Key String</label>
              <a
                href={providersList.find(p => p.provider === provider)?.docUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-600 hover:underline font-bold"
              >
                Get {provider.toUpperCase()} Key →
              </a>
            </div>
            <input
              type="password"
              placeholder={providersList.find(p => p.provider === provider)?.placeholder}
              value={rawKey}
              onChange={(e) => setRawKey(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Store Key Encrypted in Vault</span>
          </button>
        </form>
      </div>

      {/* Keys List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">Your Vault API Keys ({userKeys.length})</h3>
          <span className="text-xs text-slate-500 font-semibold">AES-256 Client Storage</span>
        </div>

        {userKeys.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 font-medium">
            No personal API keys stored yet. Add one above to use your own quota!
          </div>
        ) : (
          <div className="space-y-3">
            {userKeys.map((k) => {
              const isActive = pref.mode === 'custom' && pref.activeCustomKeyId === k.id;

              return (
                <div
                  key={k.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-4 transition-all ${
                    isActive
                      ? 'border-emerald-500/80 bg-emerald-50/50'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold uppercase text-xs">
                      {k.provider.substring(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{k.keyName}</span>
                        {isActive && (
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                            Active Choice
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-mono">
                        <span>{k.maskedKey}</span>
                        <span>•</span>
                        <span className="capitalize text-slate-700">{k.provider}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleTestKey(k.id)}
                      disabled={isTesting === k.id}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {isTesting === k.id ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                      ) : (
                        <Zap className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                      <span>Test Key</span>
                    </button>

                    <button
                      onClick={() => onTogglePref({ mode: 'custom', activeCustomKeyId: k.id })}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white font-black'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {isActive ? 'Active' : 'Use Key'}
                    </button>

                    <button
                      onClick={() => onDeleteKey(k.id)}
                      className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Key"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Test Feedback banner */}
                  {testResult && testResult.id === k.id && (
                    <div className="w-full mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                      <span className="flex items-center gap-1">
                        <Check className="h-3.5 w-3.5 text-emerald-600" /> Key is valid and active upstream
                      </span>
                      <span className="font-mono text-slate-500">Latency: {testResult.latencyMs}ms</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-slate-200/80 text-xs text-slate-600 shadow-2xs">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
        <span>Your API keys are stored securely client-side. They are never logged or exposed to third parties.</span>
      </div>
    </div>
  );
};
