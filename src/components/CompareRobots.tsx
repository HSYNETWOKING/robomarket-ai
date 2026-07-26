import React, { useState } from 'react';
import { Trash2, Sparkles, Scale, AlertCircle, RefreshCw, BrainCircuit, X } from 'lucide-react';
import { Robot } from '../types';

interface CompareRobotsProps {
  robots: Robot[];
  compareIds: string[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onSelectRobot: (id: string) => void;
  hasGeminiKey?: boolean | null;
}

export default function CompareRobots({
  robots,
  compareIds,
  onRemoveFromCompare,
  onClearCompare,
  onSelectRobot,
  hasGeminiKey
}: CompareRobotsProps) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const comparedRobots = robots.filter((r) => compareIds.includes(r.id));

  // Call AI Advisor to explain specifications differences in simple terms
  const handleAIExplain = async () => {
    if (comparedRobots.length === 0) return;

    setAiLoading(true);
    setAiError(null);
    setAiAnalysis(null);

    const specsContext = comparedRobots.map(r => ({
      name: r.name,
      category: r.category,
      price: r.price,
      specs: r.specs,
      description: r.description
    }));

    try {
      const token = localStorage.getItem('robo_token');
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Please analyze and compare these robots in simple, plain english terms. Explain which robot is suited for what task, evaluate if the prices are reasonable for their payloads/specs, and give a clear final recommendation:\n\n${JSON.stringify(specsContext, null, 2)}`
            }
          ]
        })
      });

      let responseData: any = null;
      try {
        responseData = await response.json();
      } catch (e) {
        // Not JSON
      }

      if (!response.ok) {
        const errMsg = responseData?.error || responseData?.message || '';
        if (errMsg.includes('GEMINI_API_KEY') || errMsg.includes('API key')) {
          throw new Error('Gemini API Key is missing. Please configure GEMINI_API_KEY in the Settings > Secrets menu.');
        }
        throw new Error(errMsg || `Specs Explainer failed with status ${response.status}.`);
      }

      const data = responseData;
      if (!data) {
        throw new Error('Failed to parse response from Specs Explainer.');
      }
      if (data.error) {
        if (data.error.includes('GEMINI_API_KEY') || data.error.includes('API key')) {
          throw new Error('Gemini API Key is missing. Please configure GEMINI_API_KEY in the Settings > Secrets menu.');
        }
        throw new Error(data.error);
      }

      setAiAnalysis(data.content);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('GEMINI_API_KEY') || msg.includes('API key')) {
        setAiError('Gemini API Key is missing. Please configure GEMINI_API_KEY in the Settings > Secrets menu.');
      } else {
        setAiError(err.message || 'Error compiling AI comparative metrics.');
      }
    } finally {
      setAiLoading(false);
    }
  };

  const parseTextFormatting = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-xs font-bold text-slate-900 mt-3.5 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-sm font-black text-emerald-700 mt-4 mb-2">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={idx} className="text-slate-600 text-xs ml-4 list-disc leading-relaxed mb-1">{line.substring(2)}</li>;
      }
      return <p key={idx} className="text-slate-600 text-xs leading-relaxed mb-2">{line}</p>;
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" id="compare-viewport">
      
      {/* Compare Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl tracking-tight flex items-center space-x-2">
            <Scale className="h-6 w-6 text-emerald-600" />
            <span>Specifications Comparison Floor</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analyze physical metrics, operating systems, and warranties side-by-side.
          </p>
        </div>

        {comparedRobots.length > 0 && (
          <button
            onClick={onClearCompare}
            className="flex items-center space-x-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Grid</span>
          </button>
        )}
      </div>

      {comparedRobots.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200/80 rounded-3xl text-center max-w-2xl mx-auto shadow-2xs">
          <Scale className="h-12 w-12 text-slate-300 mb-3 animate-pulse" />
          <h2 className="text-base font-bold text-slate-800">Comparison Table is Empty</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            Go to the Marketplace catalog and toggle the <strong>"Compare"</strong> checkbox on multiple robot cards to map their physical parameters side-by-side.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Main Side-by-side Table */}
          <div className="overflow-x-auto bg-white border border-slate-200/80 rounded-3xl shadow-2xs">
            <table className="w-full text-left border-collapse" id="compare-table">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-4 text-xs font-bold font-mono tracking-wider text-slate-400 w-48">Parameter</th>
                  {comparedRobots.map((robot) => (
                    <th key={robot.id} className="p-4 min-w-[200px] border-l border-slate-200">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">{robot.category}</span>
                          <h2 
                            onClick={() => onSelectRobot(robot.id)}
                            className="text-sm font-bold text-slate-900 hover:text-emerald-600 cursor-pointer transition-colors line-clamp-1"
                          >
                            {robot.name}
                          </h2>
                          <span className="text-sm font-black text-emerald-600 block">${robot.price.toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => onRemoveFromCompare(robot.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Remove from comparison list"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {/* Images Row */}
                <tr>
                  <td className="p-4 font-mono font-bold text-slate-500">Appearance</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-slate-200">
                      <img
                        src={r.imageUrl}
                        alt={r.name}
                        className="h-24 w-full object-cover rounded-xl border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                    </td>
                  ))}
                </tr>

                {/* Condition Row */}
                <tr>
                  <td className="p-4 font-mono font-bold text-slate-500">Condition</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-slate-200 font-mono capitalize text-slate-800 font-bold">
                      {r.condition}
                    </td>
                  ))}
                </tr>

                {/* Manufacturer Row */}
                <tr>
                  <td className="p-4 font-mono font-bold text-slate-500">Manufacturer</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-slate-200 text-slate-800">
                      {r.specs?.manufacturer || <span className="text-slate-400">N/A</span>}
                    </td>
                  ))}
                </tr>

                {/* Payload Row */}
                <tr>
                  <td className="p-4 font-mono font-bold text-slate-500">Payload Limit</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-slate-200 text-slate-800 font-bold">
                      {r.specs?.payload || <span className="text-slate-400">N/A</span>}
                    </td>
                  ))}
                </tr>

                {/* Battery/Power Row */}
                <tr>
                  <td className="p-4 font-mono font-bold text-slate-500">Battery & Power</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-slate-200 text-slate-800">
                      {r.specs?.batteryLife || <span className="text-slate-400">N/A</span>}
                    </td>
                  ))}
                </tr>

                {/* Speed Row */}
                <tr>
                  <td className="p-4 font-mono font-bold text-slate-500">Velocity Speed</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-slate-200 text-slate-800">
                      {r.specs?.speed || <span className="text-slate-400">N/A</span>}
                    </td>
                  ))}
                </tr>

                {/* Weight Row */}
                <tr>
                  <td className="p-4 font-mono font-bold text-slate-500">Gross Weight</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-slate-200 text-slate-800">
                      {r.specs?.weight || <span className="text-slate-400">N/A</span>}
                    </td>
                  ))}
                </tr>

                {/* OS Row */}
                <tr>
                  <td className="p-4 font-mono font-bold text-slate-500">Operating System</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-slate-200 text-slate-800 font-mono">
                      {r.specs?.operatingSystem || <span className="text-slate-400">N/A</span>}
                    </td>
                  ))}
                </tr>

                {/* Warranty Row */}
                <tr>
                  <td className="p-4 font-mono font-bold text-slate-500">Warranty Term</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-slate-200 text-slate-800">
                      {r.specs?.warranty || <span className="text-slate-400">N/A</span>}
                    </td>
                  ))}
                </tr>

                {/* Rating Row */}
                <tr>
                  <td className="p-4 font-mono font-bold text-slate-500">Quality Rating</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-slate-200 text-slate-800">
                      <div className="flex items-center space-x-1">
                        <span className="font-bold text-slate-900">{r.rating}</span>
                        <span className="text-[10px] text-slate-400">({r.reviews?.length || 0} reviews)</span>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* AI EXPLAINER PANEL */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="h-5 w-5 text-emerald-600 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-900">AI Specification Explainer</h2>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                Gemini Analysis
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
              Synthesize these specifications into plain English. Our AI analyzes differences, explains trade-offs, evaluates price-to-payload ratios, and provides a clear recommendation.
            </p>

            {hasGeminiKey === false && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start space-x-2.5 max-w-4xl" id="gemini-key-missing-compare">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900 block mb-0.5">Gemini API Key Missing</span>
                  <span>The <code className="px-1 py-0.5 bg-amber-100 rounded font-mono text-[10px]">GEMINI_API_KEY</code> is missing. The Specs Explainer runs in fallback mode.</span>
                </div>
              </div>
            )}

            {!aiAnalysis && !aiLoading && (
              <button
                onClick={handleAIExplain}
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-xl shadow-2xs transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Explain Specifications with AI</span>
              </button>
            )}

            {aiLoading && (
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl flex items-center space-x-3 max-w-md">
                <RefreshCw className="h-4 w-4 animate-spin text-emerald-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 font-mono">Synthesizing Data...</h4>
                  <p className="text-[10px] text-slate-400">Evaluating payload efficiencies and price ratios...</p>
                </div>
              </div>
            )}

            {aiError && (
              <div className="flex items-center space-x-2 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            {aiAnalysis && (
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-[10px] text-slate-400 font-mono">Comparative analysis complete</span>
                  <button
                    onClick={() => setAiAnalysis(null)}
                    className="text-[10px] text-slate-400 hover:text-emerald-700 underline cursor-pointer font-bold"
                  >
                    Clear Text
                  </button>
                </div>
                <div className="pt-2 animate-fade-in">{parseTextFormatting(aiAnalysis)}</div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
