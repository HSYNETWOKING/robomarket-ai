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
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="marketplace-viewport">
      {/* Search Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 mb-8 shadow-sm">
        <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white sm:text-2xl">
          Robotic Equipment Marketplace 🏢
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Compare specifications and explore authenticated listings with machine intelligence.
        </p>

        {/* Dynamic Search Box */}
        <div className="mt-6">
          <form onSubmit={useAISearch ? handleAISearchSubmit : (e) => e.preventDefault()} className="relative flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute top-3.5 left-3.5 h-5 w-5 text-zinc-400 dark:text-zinc-550" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  useAISearch 
                    ? "Explain what you need (e.g. 'I need an agile companion dog and a programmable teaching arm under $4,000')..." 
                    : "Search robots, specs, manufacturers..."
                }
                className="w-full bg-zinc-50 dark:bg-zinc-850 border border-zinc-250 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-sm rounded-xl pl-11 pr-4 py-3.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all min-h-[44px]"
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
                  ? 'bg-blue-600 text-white border-blue-650 shadow-sm dark:bg-blue-500 dark:border-blue-600' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-blue-600 dark:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/25 dark:hover:bg-blue-950/20'
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
                className="flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold tracking-wider uppercase px-6 py-3 rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
                id="run-ai-search-btn"
              >
                Match Listings
              </button>
            )}
          </form>

          {/* Prompt hint */}
          {useAISearch && !aiSearchResult && (
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center space-x-1 mt-2.5">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Our AI parses pricing, intent, payload limits and matches database listings directly with explaining reasoning.</span>
            </p>
          )}

          {/* Gemini API Key Missing Warn block for Smart AI Search */}
          {useAISearch && hasGeminiKey === false && (
            <div className="mt-3 p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-amber-850 dark:text-amber-400 text-xs flex items-start space-x-2.5 shadow-sm" id="gemini-key-missing-marketplace">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-900 dark:text-amber-350 block mb-0.5">Gemini API Key Missing</span>
                <span>The <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900/30 rounded font-mono text-[10px]">GEMINI_API_KEY</code> key is missing. Smart AI Search operates in offline local simulation mode. Configure key in <strong>Settings &gt; Secrets</strong> to enable active live Gemini catalog semantic queries.</span>
              </div>
            </div>
          )}
        </div>

        {/* AI SEARCH RESULTS REASONING DIALOG */}
        {useAISearch && (isAiLoading || aiSearchResult || aiSearchError) && (
          <div className="mt-5 border-t border-zinc-200 dark:border-zinc-800/80 pt-5">
            {isAiLoading && (
              <div className="flex items-center space-x-3 bg-zinc-50 dark:bg-zinc-850 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl animate-pulse">
                <RefreshCw className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-xs font-bold font-mono tracking-wider text-blue-600 dark:text-blue-400 uppercase">AI Processing Query</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Gemini is matching specifications and filtering listings...</p>
                </div>
              </div>
            )}

            {aiSearchError && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-red-700 dark:text-red-400 text-xs animate-fade-in">
                {aiSearchError}
              </div>
            )}

            {aiSearchResult && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/60 p-4 rounded-xl space-y-2 animate-fade-in">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">AI Search Reasoning</h3>
                </div>
                <p className="text-xs text-zinc-650 dark:text-zinc-300 leading-relaxed">{aiSearchResult.reasoning}</p>
                {aiSearchResult.suggestedBudgetRange && (
                  <div className="text-xs">
                    <span className="text-zinc-550 dark:text-zinc-450">Suggested Investment: </span>
                    <span className="font-mono text-blue-700 dark:text-blue-400 font-bold">{aiSearchResult.suggestedBudgetRange}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-zinc-400 dark:text-zinc-500 font-mono">Matched Listings: {aiSearchResult.matchedRobotIds.length}</span>
                  <button 
                    onClick={() => {
                      setAiSearchResult(null);
                      setSearchQuery('');
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-semibold cursor-pointer min-h-[32px]"
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
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
              <span className="font-bold text-zinc-800 dark:text-white flex items-center space-x-2">
                <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Search Filters</span>
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 flex items-center space-x-1 cursor-pointer min-h-[32px]"
                title="Reset Search and Selection Filters"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block font-mono">Robot Category</label>
              <div className="grid grid-cols-1 gap-1">
                {CATEGORIES.slice(0, 8).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors cursor-pointer min-h-[36px] flex items-center ${
                      selectedCategory === cat 
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold' 
                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                {/* Simplified dropdown for the rest if needed */}
                {selectedCategory !== 'All' && !CATEGORIES.slice(0, 8).includes(selectedCategory) && (
                  <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold px-3 py-2 rounded-lg text-xs flex items-center min-h-[36px]">
                    {selectedCategory}
                  </div>
                )}
              </div>
            </div>

            <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-4" />

            {/* Condition Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block font-mono">Unit Condition</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-850 border border-zinc-250 dark:border-zinc-700 text-zinc-700 dark:text-zinc-350 text-xs rounded-lg px-2.5 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors min-h-[44px]"
              >
                <option value="All">All Conditions</option>
                <option value="new">Brand New</option>
                <option value="refurbished">Refurbished</option>
                <option value="used">Pre-owned / Used</option>
              </select>
            </div>

            <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-4" />

            {/* Investment Cap (Price) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block font-mono">Budget Cap</label>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">${maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="2500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 bg-zinc-100 dark:bg-zinc-800 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                <span>$1K</span>
                <span>$50K</span>
                <span>$100K</span>
              </div>
            </div>

            <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-4" />

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block font-mono flex items-center space-x-1">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>Sort Sequence</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-850 border border-zinc-250 dark:border-zinc-700 text-zinc-700 dark:text-zinc-350 text-xs rounded-lg px-2.5 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors min-h-[44px]"
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
            <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center shadow-sm">
              <SlidersHorizontal className="h-12 w-12 text-zinc-300 dark:text-zinc-750 mb-3 animate-bounce" />
              <h2 className="text-base font-bold text-zinc-800 dark:text-white">No Matching Systems Found</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-1 max-w-sm">
                Try expanding your budget parameters, matching different categories, or resetting active query strings.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer shadow-sm min-h-[44px]"
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
