import React, { useState } from 'react';
import { Trash2, Sparkles, Scale, AlertCircle, RefreshCw, Layers, BrainCircuit, X } from 'lucide-react';
import { Robot } from '../types';

interface CompareRobotsProps {
  robots: Robot[];
  compareIds: string[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onSelectRobot: (id: string) => void;
}

export default function CompareRobots({
  robots,
  compareIds,
  onRemoveFromCompare,
  onClearCompare,
  onSelectRobot
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
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Please analyze and compare these robots in simple, plain english terms. Explain which robot is suited for what task, evaluate if the prices are reasonable for their payloads/specs, and give a final recommendation recommendation:\n\n${JSON.stringify(specsContext, null, 2)}`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Specs Explainer socket error. Please try again.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAiAnalysis(data.content);
    } catch (err: any) {
      setAiError(err.message || 'Error compiling AI comparative metrics.');
    } finally {
      setAiLoading(false);
    }
  };

  const parseTextFormatting = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let cleanLine = line;
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-xs font-bold text-zinc-900 dark:text-white mt-3.5 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-sm font-black text-blue-600 dark:text-blue-400 mt-4 mb-2">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={idx} className="text-zinc-650 dark:text-zinc-350 text-xs ml-4 list-disc leading-relaxed mb-1">{line.substring(2)}</li>;
      }
      return <p key={idx} className="text-zinc-650 dark:text-zinc-350 text-xs leading-relaxed mb-2">{line}</p>;
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="compare-viewport">
      
      {/* Compare Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5 mb-8 gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white sm:text-2xl flex items-center space-x-2">
            <Scale className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>Specifications Comparison Floor</span>
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Analyze physical metrics, operating systems, and warranties side-by-side.
          </p>
        </div>

        {comparedRobots.length > 0 && (
          <button
            onClick={onClearCompare}
            className="flex items-center space-x-1.5 text-xs text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-305 px-3.5 py-2 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer self-start sm:self-auto shadow-sm min-h-[38px]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Grid</span>
          </button>
        )}
      </div>

      {comparedRobots.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center max-w-2xl mx-auto shadow-sm">
          <Scale className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-3 animate-pulse" />
          <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200">Comparison Table is Empty</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-1 max-w-md">
            Go to the Marketplace catalog and toggle the <strong>"Compare"</strong> checkbox on multiple robot cards to map their physical parameters side-by-side.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Main Side-by-side Table */}
          <div className="overflow-x-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse" id="compare-table">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/75 dark:bg-zinc-850/50">
                  <th className="p-4 text-xs font-bold font-mono tracking-wider text-zinc-400 dark:text-zinc-500 w-48">Parameter</th>
                  {comparedRobots.map((robot) => (
                    <th key={robot.id} className="p-4 min-w-[200px] border-l border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 font-bold uppercase">{robot.category}</span>
                          <h2 
                            onClick={() => onSelectRobot(robot.id)}
                            className="text-sm font-bold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors line-clamp-1"
                          >
                            {robot.name}
                          </h2>
                          <span className="text-sm font-black text-blue-600 dark:text-blue-450 block">${robot.price.toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => onRemoveFromCompare(robot.id)}
                          className="p-1 rounded text-zinc-400 dark:text-zinc-500 hover:text-red-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer min-h-[32px]"
                          title="Remove from comparison list"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800 text-xs">
                {/* Images Row */}
                <tr>
                  <td className="p-4 font-mono font-semibold text-zinc-550 dark:text-zinc-400">Appearance</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-zinc-200 dark:border-zinc-800">
                      <img
                        src={r.imageUrl}
                        alt={r.name}
                        className="h-24 w-full object-cover rounded-lg border border-zinc-200 dark:border-zinc-800"
                        referrerPolicy="no-referrer"
                      />
                    </td>
                  ))}
                </tr>

                {/* Condition Row */}
                <tr>
                  <td className="p-4 font-mono font-semibold text-zinc-550 dark:text-zinc-400">Condition</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-zinc-200 dark:border-zinc-800 font-mono capitalize text-zinc-700 dark:text-zinc-300">
                      {r.condition}
                    </td>
                  ))}
                </tr>

                {/* Manufacturer Row */}
                <tr>
                  <td className="p-4 font-mono font-semibold text-zinc-550 dark:text-zinc-400">Manufacturer</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {r.specs?.manufacturer || <span className="text-zinc-400 dark:text-zinc-600">N/A</span>}
                    </td>
                  ))}
                </tr>

                {/* Payload Row */}
                <tr>
                  <td className="p-4 font-mono font-semibold text-zinc-550 dark:text-zinc-400">Payload Limit</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                      {r.specs?.payload || <span className="text-zinc-400 dark:text-zinc-600">N/A</span>}
                    </td>
                  ))}
                </tr>

                {/* Battery/Power Row */}
                <tr>
                  <td className="p-4 font-mono font-semibold text-zinc-550 dark:text-zinc-400">Battery & Power</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {r.specs?.batteryLife || <span className="text-zinc-400 dark:text-zinc-600">N/A</span>}
                    </td>
                  ))}
                </tr>

                {/* Speed Row */}
                <tr>
                  <td className="p-4 font-mono font-semibold text-zinc-550 dark:text-zinc-400">Velocity speed</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {r.specs?.speed || <span className="text-zinc-400 dark:text-zinc-600">N/A</span>}
                    </td>
                  ))}
                </tr>

                {/* Weight Row */}
                <tr>
                  <td className="p-4 font-mono font-semibold text-zinc-550 dark:text-zinc-400">Gross Weight</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {r.specs?.weight || <span className="text-zinc-400 dark:text-zinc-600">N/A</span>}
                    </td>
                  ))}
                </tr>

                {/* OS Row */}
                <tr>
                  <td className="p-4 font-mono font-semibold text-zinc-550 dark:text-zinc-400">Operating OS</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
                      {r.specs?.operatingSystem || <span className="text-zinc-400 dark:text-zinc-600">N/A</span>}
                    </td>
                  ))}
                </tr>

                {/* Warranty Row */}
                <tr>
                  <td className="p-4 font-mono font-semibold text-zinc-550 dark:text-zinc-400">Warranty Term</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {r.specs?.warranty || <span className="text-zinc-400 dark:text-zinc-600">N/A</span>}
                    </td>
                  ))}
                </tr>

                {/* Rating Row */}
                <tr>
                  <td className="p-4 font-mono font-semibold text-zinc-550 dark:text-zinc-400">Quality Rating</td>
                  {comparedRobots.map((r) => (
                    <td key={r.id} className="p-4 border-l border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                      <div className="flex items-center space-x-1">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{r.rating}</span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">({r.reviews?.length || 0} reviews)</span>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* AI EXPLAINER PANEL */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-pulse" />
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">AI Specification Explainer</h2>
              </div>
              <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/25 border border-blue-200 dark:border-blue-900/50 px-2 py-0.5 rounded">
                Gemini Analysis
              </span>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-4xl">
              Synthesize these specifications into simplified English. Our AI analyzes the differences, explains the trade-offs, evaluates if pricing fits performance payloads, and recommends which unit works best for your specific application.
            </p>

            {!aiAnalysis && !aiLoading && (
              <button
                onClick={handleAIExplain}
                className="inline-flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-lg shadow-sm transition-all cursor-pointer min-h-[44px]"
              >
                <Sparkles className="h-4 w-4 animate-bounce" />
                <span>Explain Specifications with AI</span>
              </button>
            )}

            {aiLoading && (
              <div className="bg-zinc-50 dark:bg-zinc-850 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center space-x-3 max-w-md shadow-sm">
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 font-mono">Synthesizing Comparative Data...</h4>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Evaluating payload efficiencies and pricing metrics side-by-side...</p>
                </div>
              </div>
            )}

            {aiError && (
              <div className="flex items-center space-x-2 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-red-700 dark:text-red-400 text-xs">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            {aiAnalysis && (
              <div className="bg-zinc-50 dark:bg-zinc-850/40 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl space-y-2 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">Comparative analysis ready</span>
                  <button
                    onClick={() => setAiAnalysis(null)}
                    className="text-[10px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 underline cursor-pointer font-semibold"
                  >
                    Clear Explainer Text
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
