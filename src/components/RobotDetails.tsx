import React, { useState } from 'react';
import { ArrowLeft, Star, MessageSquare, ShieldCheck, ShoppingCart, Send, User, Sparkles, RefreshCw, CheckCircle, ShieldAlert, BadgeInfo } from 'lucide-react';
import { Robot, Review, AIAnalysis } from '../types';

interface RobotDetailsProps {
  robot: Robot;
  currentUserId: string | null;
  onBack: () => void;
  onInitiateChat: (sellerId: string, sellerName: string, robotId: string, robotName: string) => void;
  onPlaceOrder: (robotId: string) => void;
  onReviewSubmitted: (updatedRobot: Robot) => void;
  hasGeminiKey?: boolean | null;
}

export default function RobotDetails({
  robot,
  currentUserId,
  onBack,
  onInitiateChat,
  onPlaceOrder,
  onReviewSubmitted,
  hasGeminiKey
}: RobotDetailsProps) {
  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // AI Security Auditor State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisError, setAiAnalysisError] = useState<string | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIAnalysis | null>(null);

  // Ordering checkout state
  const [orderPlacing, setOrderPlacing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);

  // Handle Review submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !currentUserId) return;

    setSubmittingReview(true);
    setReviewError(null);

    try {
      const response = await fetch(`/api/robots/${robot.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          username: "Sandbox Client",
          rating,
          comment
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit review.');
      }

      const updated = await response.json();
      onReviewSubmitted(updated);
      setComment('');
      setRating(5);
    } catch (err: any) {
      setReviewError(err.message || 'Error uploading rating.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Run Gemini Listing Analyzer
  const handleRunAIAnalysis = async () => {
    setIsAiAnalyzing(true);
    setAiAnalysisError(null);
    setAiAnalysisResult(null);

    try {
      const response = await fetch('/api/ai/analyze-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ robotId: robot.id })
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
        throw new Error(errMsg || `Listing Analyzer failed with status ${response.status}.`);
      }

      const data = responseData;
      if (!data) {
        throw new Error('Failed to parse response from Listing Analyzer.');
      }
      if (data.error) {
        if (data.error.includes('GEMINI_API_KEY') || data.error.includes('API key')) {
          throw new Error('Gemini API Key is missing. Please configure GEMINI_API_KEY in the Settings > Secrets menu.');
        }
        throw new Error(data.error);
      }

      setAiAnalysisResult(data);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('GEMINI_API_KEY') || msg.includes('API key')) {
        setAiAnalysisError('Gemini API Key is missing. Please configure GEMINI_API_KEY in the Settings > Secrets menu.');
      } else {
        setAiAnalysisError(err.message || 'Error processing AI security metrics.');
      }
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleBuySubmit = async () => {
    if (!currentUserId) {
      alert("Please login/connect a sandbox account to purchase robotic systems.");
      return;
    }
    setOrderPlacing(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          robotId: robot.id,
          buyerId: currentUserId,
          buyerName: "Sandbox Client"
        })
      });
      if (response.ok) {
        const orderData = await response.json();
        setCreatedOrderNumber(orderData.id);
        setOrderComplete(true);
        onPlaceOrder(robot.id);
      } else {
        alert("Transaction failed on marketplace bank nodes.");
      }
    } catch (err) {
      alert("Network error processing invoice order.");
    } finally {
      setOrderPlacing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="robot-inspect-viewport">
      
      {/* Back navigation button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white mb-6 cursor-pointer min-h-[44px]"
        id="back-to-marketplace-btn"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Marketplace catalog</span>
      </button>

      {orderComplete ? (
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center space-y-4 shadow-sm animate-fade-in">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto animate-bounce" />
          <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white">System Purchase Initiated!</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Your purchase of <strong>{robot.name}</strong> was recorded. The seller has been notified to coordinate freight shipment.
          </p>
          <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl inline-block font-mono text-xs border border-zinc-200 dark:border-zinc-700">
            <span className="text-zinc-400 dark:text-zinc-500">Invoice reference: </span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{createdOrderNumber}</span>
          </div>
          <div>
            <button
              onClick={onBack}
              className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold px-6 py-3.5 rounded-lg cursor-pointer shadow-sm min-h-[44px]"
            >
              Marketplace Hub
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns: Robot Image, Desc, Specs, Reviews */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Core Card Specs panel */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={robot.imageUrl}
                  alt={robot.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-blue-700 dark:text-blue-400 font-bold tracking-widest uppercase bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 px-3 py-1 rounded-full">
                    {robot.category}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono flex items-center space-x-1">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
                    <span>{robot.rating} / 5 ({robot.reviews?.length || 0} reviews)</span>
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">{robot.name}</h1>

                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                  {robot.description}
                </p>

                {/* Spec Table */}
                <div className="pt-4">
                  <h3 className="text-xs font-bold font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                    Machine Engineering Specs
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-50 dark:bg-zinc-850 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <div className="text-xs">
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono block">Manufacturer</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{robot.specs?.manufacturer || 'N/A'}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono block">Payload Limit</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{robot.specs?.payload || 'N/A'}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono block">Autonomy / Power</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{robot.specs?.batteryLife || 'N/A'}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono block">Active Speed</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{robot.specs?.speed || 'N/A'}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono block">Total Weight</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{robot.specs?.weight || 'N/A'}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono block">Operating OS</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{robot.specs?.operatingSystem || 'N/A'}</span>
                    </div>
                    <div className="text-xs sm:col-span-2 border-t border-zinc-200 dark:border-zinc-700 pt-2 mt-1">
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono block">Warranty coverage</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{robot.specs?.warranty || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QA Reviews panel */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-850 dark:text-zinc-300">
                User Reviews & Field Test Logs
              </h2>

              {/* Review submit form */}
              {currentUserId ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4 bg-zinc-50 dark:bg-zinc-850 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                  <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">File a Performance Review</h3>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Reliability Grade:</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setRating(stars)}
                          className="text-amber-500 hover:scale-110 transition-transform cursor-pointer min-h-[32px]"
                        >
                          <Star className={`h-4.5 w-4.5 ${rating >= stars ? 'fill-current' : 'text-zinc-300 dark:text-zinc-700'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Comment on uptime, material limits, calibration precision..."
                      required
                      className="w-full h-20 bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-xs rounded-lg p-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    {reviewError && <span className="text-[10px] text-red-500">{reviewError}</span>}
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="ml-auto flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer disabled:opacity-40 shadow-sm min-h-[44px]"
                    >
                      {submittingReview ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3 w-3" />}
                      <span>Submit Review</span>
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-xs text-zinc-450 italic">Login to submit listing reviews.</p>
              )}

              {/* Review list */}
              <div className="space-y-4">
                {robot.reviews && robot.reviews.length > 0 ? (
                  robot.reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-zinc-150 dark:border-zinc-800 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-850 dark:text-zinc-200 flex items-center space-x-1">
                          <User className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
                          <span>{rev.username}</span>
                        </span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-550 font-mono">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex text-amber-500 my-1">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">No community field tests recorded yet.</p>
                )}
              </div>

            </div>

          </div>

          {/* Right Column: AI Analysis + Order Sidebar */}
          <div className="space-y-6">
            
            {/* Pricing Card & Checkout */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 block font-mono">Investment Required</span>
                <span className="text-2xl font-black text-zinc-900 dark:text-white">${robot.price.toLocaleString()}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-450 block mt-1"> Freight, calibration and baseline OS configuration included.</span>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleBuySubmit}
                  disabled={orderPlacing}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-650 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-40 min-h-[44px]"
                  id="checkout-trigger"
                >
                  {orderPlacing ? (
                    <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-4.5 w-4.5" />
                  )}
                  <span>Order Robotic System</span>
                </button>

                {currentUserId && robot.sellerId !== currentUserId && (
                  <button
                    onClick={() => onInitiateChat(robot.sellerId, robot.sellerName, robot.id, robot.name)}
                    className="w-full flex items-center justify-center space-x-1.5 bg-white border border-zinc-300 hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-200 font-semibold text-xs tracking-wider uppercase py-3 rounded-xl transition-all cursor-pointer min-h-[44px]"
                    id="initiate-chat-trigger"
                  >
                    <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Inquire with Seller</span>
                  </button>
                )}
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 text-[10px] text-zinc-500 dark:text-zinc-400 space-y-1">
                <p>📍 Location: {robot.location}</p>
                <p>👤 Registered Seller: {robot.sellerName}</p>
              </div>
            </div>

            {/* AI LISTING QUALITY & SECURITY ANALYZER */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center space-x-1.5">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Security Audit</span>
                </h3>
                <span className="text-[10px] bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/65 px-2 py-0.5 rounded text-blue-700 dark:text-blue-400 font-mono">
                  Gemini API
                </span>
              </div>

              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Run an autonomous scan of this listing's text consistency, pricing logic, specification accuracy, and risk rating flags.
              </p>

              {hasGeminiKey === false && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-amber-850 dark:text-amber-400 text-[11px] flex items-start space-x-2 shadow-sm" id="gemini-key-missing-details">
                  <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-900 dark:text-amber-350 block mb-0.5">Gemini API Key Missing</span>
                    <span>The <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900/30 rounded font-mono text-[10px]">GEMINI_API_KEY</code> is missing. Run audit acts in local simulation mode. Configure key in <strong>Settings &gt; Secrets</strong> to enable live Gemini scans.</span>
                  </div>
                </div>
              )}

              {!aiAnalysisResult && !isAiAnalyzing && (
                <button
                  onClick={handleRunAIAnalysis}
                  className="w-full py-2.5 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 min-h-[44px]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Execute Verification Scan</span>
                </button>
              )}

              {isAiAnalyzing && (
                <div className="bg-zinc-50 dark:bg-zinc-850 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 font-mono">Hardware inspection...</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 dark:bg-blue-500 h-full w-2/3 rounded-full animate-pulse" />
                  </div>
                  <p className="text-[9px] text-zinc-400 dark:text-zinc-500 leading-relaxed font-mono">Checking model classification pricing and descriptive authenticity indexes...</p>
                </div>
              )}

              {aiAnalysisError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-lg text-red-700 dark:text-red-450 text-[10px]">
                  {aiAnalysisError}
                </div>
              )}

              {/* Render AI audit results */}
              {aiAnalysisResult && (
                <div className="bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-3.5 animate-fade-in">
                  
                  {/* Gauge */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono block">Authenticity Index</span>
                      <div className="flex items-baseline space-x-1">
                        <span className={`text-xl font-black ${
                          aiAnalysisResult.qualityScore >= 80 ? 'text-green-600 dark:text-green-400' : aiAnalysisResult.qualityScore >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {aiAnalysisResult.qualityScore}
                        </span>
                        <span className="text-[10px] text-zinc-450 dark:text-zinc-500">/ 100</span>
                      </div>
                    </div>

                    {/* Verdict */}
                    <div>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono block text-right">Sec verdict</span>
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-bold uppercase border mt-0.5 ${
                        aiAnalysisResult.verdict === 'Excellent'
                          ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/40 text-green-700 dark:text-green-400'
                          : aiAnalysisResult.verdict === 'Fair'
                          ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/40 text-blue-700 dark:text-blue-400'
                          : aiAnalysisResult.verdict === 'Suspicious'
                          ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 text-amber-700 dark:text-amber-400'
                          : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/40 text-red-700 dark:text-red-400 animate-pulse'
                      }`}>
                        {aiAnalysisResult.verdict}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-[11px] text-zinc-650 dark:text-zinc-300 leading-relaxed italic border-l-2 border-blue-600 dark:border-blue-500 pl-2.5">
                    "{aiAnalysisResult.summary}"
                  </p>

                  {/* Suspicious Flags */}
                  {aiAnalysisResult.suspiciousFlags && aiAnalysisResult.suspiciousFlags.length > 0 ? (
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 p-2.5 rounded-lg space-y-1.5">
                      <span className="text-[10px] font-bold text-red-700 dark:text-red-400 flex items-center space-x-1 uppercase font-mono">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>Suspicious Flags Detected</span>
                      </span>
                      <ul className="space-y-1">
                        {aiAnalysisResult.suspiciousFlags.map((flag, idx) => (
                          <li key={idx} className="text-[10px] text-zinc-600 dark:text-zinc-400 list-disc ml-3.5 leading-relaxed">
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 px-2.5 py-1.5 rounded-lg text-[10px] text-green-700 dark:text-green-400 font-mono font-medium">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Spec compliance check: green</span>
                    </div>
                  )}

                  {/* Pros / Cons tabs */}
                  <div className="grid grid-cols-2 gap-3 pt-1 text-[10px]">
                    <div className="space-y-1">
                      <span className="font-semibold text-green-700 dark:text-green-400 font-mono block">Positive Indicators</span>
                      <ul className="space-y-1">
                        {aiAnalysisResult.pros.slice(0, 2).map((p, idx) => (
                          <li key={idx} className="text-zinc-650 dark:text-zinc-400 list-disc ml-3.5 leading-relaxed">{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <span className="font-semibold text-zinc-500 dark:text-zinc-400 font-mono block">Procurement Caution</span>
                      <ul className="space-y-1">
                        {aiAnalysisResult.cons.slice(0, 2).map((c, idx) => (
                          <li key={idx} className="text-zinc-650 dark:text-zinc-400 list-disc ml-3.5 leading-relaxed">{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={handleRunAIAnalysis}
                    className="w-full text-center text-[10px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 underline cursor-pointer mt-2 block min-h-[32px]"
                  >
                    Re-verify Listing data
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
