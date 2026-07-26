import React, { useState } from 'react';
import { Search, Sparkles, SlidersHorizontal, ArrowUpDown, Filter, RefreshCw, HelpCircle, AlertCircle } from 'lucide-react';
import { Robot } from '../types';
import RobotCard from './RobotCard';

interface MarketplaceProps {
  robots: Robot[];
  wishlist: string[];
  compareList: string[];
  onToggleWishlist: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onSelectRobot: (id: string) => void;
  hasGeminiKey?: boolean | null;
}

const CATEGORIES = [
  'All', 'Industrial', 'Humanoid', 'Medical', 'Agricultural', 'Security', 'Delivery', 'Cleaning', 'Educational', 'Entertainment', 'Research', 'Companion'
];

export default function Marketplace({
  robots,
  wishlist,
  compareList,
  onToggleWishlist,
  onToggleCompare,
  onSelectRobot,
  hasGeminiKey
}: MarketplaceProps) {
  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [useAISearch, setUseAISearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sortBy, setSortBy] = useState('newest');

  // AI Search feedback state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSearchError, setAiSearchError] = useState<string | null>(null);
  const [aiSearchResult, setAiSearchResult] = useState<{
    reasoning: string;
    matchedRobotIds: string[];
    suggestedBudgetRange?: string;
  } | null>(null);

  const handleAISearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isAiLoading) return;

    setIsAiLoading(true);
    setAiSearchError(null);
    setAiSearchResult(null);

    try {
      const token = localStorage.getItem('robo_token');
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ query: searchQuery })
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
        throw new Error(errMsg || `AI Search failed with status ${response.status}.`);
      }

      const data = responseData;
      if (!data) {
        throw new Error('Failed to parse response from AI Search.');
      }
      if (data.error) {
        if (data.error.includes('GEMINI_API_KEY') || data.error.includes('API key')) {
          throw new Error('Gemini API Key is missing. Please configure GEMINI_API_KEY in the Settings > Secrets menu.');
        }
        throw new Error(data.error);
      }

      setAiSearchResult(data);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('GEMINI_API_KEY') || msg.includes('API key')) {
        setAiSearchError('Gemini API Key is missing. Please configure GEMINI_API_KEY in the Settings > Secrets menu.');
      } else {
        setAiSearchError(err.message || 'Error executing AI search logic.');
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setUseAISearch(false);
    setSelectedCategory('All');
    setSelectedCondition('All');
    setMaxPrice(100000);
    setSortBy('newest');
    setAiSearchResult(null);
    setAiSearchError(null);
  };

  // Perform filtering
  const getFilteredRobots = () => {
    let list = [...robots];

    // If using AI Search and we have results, filter by those matching IDs
    if (useAISearch && aiSearchResult) {
      list = list.filter(r => aiSearchResult.matchedRobotIds.includes(r.id));
    } else if (!useAISearch && searchQuery.trim() !== '') {
      // Standard search keyword match
      const query = searchQuery.toLowerCase();
      list = list.filter(r => 
        r.name.toLowerCase().includes(query) || 
        r.description.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query)
      );
    }

    // Apply standard filters
    if (selectedCategory !== 'All') {
      list = list.filter(r => r.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedCondition !== 'All') {
      list = list.filter(r => r.condition === selectedCondition);
    }

    list = list.filter(r => r.price <= maxPrice);

    // Apply Sorting
    list.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  };

  const filteredRobots = getFilteredRobots();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" id="marketplace-viewport">
      {/* Search Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 mb-8 shadow-2xs">
        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">
          Robotic Equipment & AI Hardware Marketplace 🤖
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Compare specifications and explore authenticated listings with AI intelligence and Web3 escrow.
        </p>

        {/* Dynamic Search Box */}
        <div className="mt-6">
          <form onSubmit={useAISearch ? handleAISearchSubmit : (e) => e.preventDefault()} className="relative flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute top-3.5 left-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  useAISearch 
                    ? "Explain what you need (e.g. 'I need a humanoid or 6-axis arm under $40,000')..." 
                    : "Search robots, specs, manufacturers..."
                }
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl pl-11 pr-4 py-3.5 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all min-h-[44px]"
                id="marketplace-search-input"
              />
            </div>

            {/* AI Search toggle */}
            <button
              type="button"
              onClick={() => {
                setUseAISearch(!useAISearch);
                setAiSearchResult(null);
                setAiSearchError(null);
              }}
              className={`flex items-center justify-center space-x-1.5 px-5 py-3 rounded-xl border font-bold text-xs tracking-wider uppercase transition-all cursor-pointer min-h-[44px] ${
                useAISearch 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs' 
                  : 'bg-white border-slate-200 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
              id="toggle-ai-search"
            >
              <Sparkles className={`h-4 w-4 ${useAISearch ? 'animate-pulse' : ''}`} />
              <span>Smart AI Search</span>
            </button>

            {useAISearch && (
              <button
                type="submit"
                disabled={!searchQuery.trim() || isAiLoading}
                className="flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-wider uppercase px-6 py-3 rounded-xl shadow-2xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
                id="run-ai-search-btn"
              >
                Match Listings
              </button>
            )}
          </form>

          {/* Prompt hint */}
          {useAISearch && !aiSearchResult && (
            <p className="text-[11px] text-slate-500 flex items-center space-x-1 mt-2.5">
              <HelpCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>Gemini parses payload specs, budgets, and hardware catalogs to recommend exact matches.</span>
            </p>
          )}

          {/* Gemini API Key Missing Warn block */}
          {useAISearch && hasGeminiKey === false && (
            <div className="mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start space-x-2.5 shadow-2xs" id="gemini-key-missing-marketplace">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 block mb-0.5">Gemini API Key Warning</span>
                <span>The <code className="px-1 py-0.5 bg-amber-100 rounded font-mono text-[10px]">GEMINI_API_KEY</code> is missing. AI Search operates in fallback mode. Add a key in BYOK Vault or environment settings.</span>
              </div>
            </div>
          )}
        </div>

        {/* AI SEARCH RESULTS REASONING DIALOG */}
        {useAISearch && (isAiLoading || aiSearchResult || aiSearchError) && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            {isAiLoading && (
              <div className="flex items-center space-x-3 bg-slate-50 p-4 border border-slate-200 rounded-xl animate-pulse">
                <RefreshCw className="h-5 w-5 animate-spin text-emerald-600" />
                <div>
                  <h3 className="text-xs font-bold font-mono tracking-wider text-emerald-700 uppercase">AI Processing Query</h3>
                  <p className="text-xs text-slate-500">Gemini 3.6 Flash is evaluating payload and specs parameters...</p>
                </div>
              </div>
            )}

            {aiSearchError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs animate-fade-in">
                {aiSearchError}
              </div>
            )}

            {aiSearchResult && (
              <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl space-y-2 animate-fade-in">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4.5 w-4.5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">AI Search Reasoning</h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{aiSearchResult.reasoning}</p>
                {aiSearchResult.suggestedBudgetRange && (
                  <div className="text-xs">
                    <span className="text-slate-500">Suggested Budget Range: </span>
                    <span className="font-mono text-emerald-700 font-bold">{aiSearchResult.suggestedBudgetRange}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-500 font-mono">Matched Listings: {aiSearchResult.matchedRobotIds.length}</span>
                  <button 
                    onClick={() => {
                      setAiSearchResult(null);
                      setSearchQuery('');
                    }}
                    className="text-emerald-700 hover:text-emerald-800 underline font-bold cursor-pointer"
                  >
                    Clear Match Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid Layout of Filters and Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="space-y-6" id="filters-sidebar">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="font-bold text-slate-900 flex items-center space-x-2 text-sm">
                <Filter className="h-4 w-4 text-emerald-600" />
                <span>Search Filters</span>
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-400 hover:text-slate-700 flex items-center space-x-1 cursor-pointer"
                title="Reset Search and Selection Filters"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 block font-mono">Category</label>
              <div className="grid grid-cols-1 gap-1">
                {CATEGORIES.slice(0, 8).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center ${
                      selectedCategory === cat 
                        ? 'bg-emerald-600 text-white font-bold shadow-2xs' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-100 my-4" />

            {/* Condition Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 block font-mono">Unit Condition</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none transition-colors"
              >
                <option value="All">All Conditions</option>
                <option value="new">Brand New</option>
                <option value="refurbished">Refurbished</option>
                <option value="used">Pre-owned / Used</option>
              </select>
            </div>

            <div className="h-px bg-slate-100 my-4" />

            {/* Investment Cap (Price) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 block font-mono">Max Price</label>
                <span className="text-xs font-bold text-emerald-600">${maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="2500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>$1K</span>
                <span>$50K</span>
                <span>$100K</span>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-4" />

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 block font-mono flex items-center space-x-1">
                <ArrowUpDown className="h-3.5 w-3.5 text-emerald-600" />
                <span>Sort Sequence</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none transition-colors"
              >
                <option value="newest">Newest Listings</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

          </div>
        </div>

        {/* Listings Display */}
        <div className="lg:col-span-3">
          {filteredRobots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="robots-listings-grid">
              {filteredRobots.map((robot) => (
                <RobotCard
                  key={robot.id}
                  robot={robot}
                  isWishlisted={wishlist.includes(robot.id)}
                  isCompared={compareList.includes(robot.id)}
                  onToggleWishlist={() => onToggleWishlist(robot.id)}
                  onToggleCompare={() => onToggleCompare(robot.id)}
                  onSelect={() => onSelectRobot(robot.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200/80 rounded-2xl text-center shadow-2xs">
              <SlidersHorizontal className="h-12 w-12 text-slate-300 mb-3 animate-bounce" />
              <h2 className="text-base font-bold text-slate-800">No Matching Hardware Systems Found</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Try expanding your budget parameters, selecting different categories, or resetting active search queries.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-2xs transition-colors"
              >
                Clear Search Filter Settings
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
