import React, { useState } from 'react';
import { ArrowLeft, Star, MessageSquare, ShieldCheck, ShoppingCart, Send, User, Sparkles, RefreshCw, CheckCircle, ShieldAlert } from 'lucide-react';
import { Robot, AIAnalysis } from '../types';

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
      const token = localStorage.getItem('robo_token');
      const response = await fetch(`/api/robots/${robot.id}/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
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
      const token = localStorage.getItem('robo_token');
      const response = await fetch('/api/ai/analyze-listing', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
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
      alert("Please login/connect an account to purchase robotic systems.");
      return;
    }
    setOrderPlacing(true);
    try {
      const token = localStorage.getItem('robo_token');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          robotId: robot.id
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
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" id="robot-inspect-viewport">
      
      {/* Back navigation button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-emerald-600 mb-6 cursor-pointer"
        id="back-to-marketplace-btn"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Marketplace catalog</span>
      </button>

      {orderComplete ? (
        <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-8 text-center space-y-4 shadow-sm animate-fade-in">
          <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto animate-bounce" />
          <h1 className="text-2xl font-black text-slate-900">System Order Submitted!</h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Your order for <strong>{robot.name}</strong> was recorded. The seller has been notified to coordinate shipment.
          </p>
          <div className="bg-slate-50 p-4 rounded-2xl inline-block font-mono text-xs border border-slate-200">
            <span className="text-slate-500">Invoice Reference: </span>
            <span className="text-emerald-700 font-bold">{createdOrderNumber}</span>
          </div>
          <div>
            <button
              onClick={onBack}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3.5 rounded-xl cursor-pointer shadow-md transition-colors"
            >
              Return to Marketplace
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns: Robot Image, Desc, Specs, Reviews */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Core Card Specs panel */}
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xs">
              <div className="relative aspect-video bg-slate-100">
                <img
                  src={robot.imageUrl}
                  alt={robot.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-700 font-bold tracking-widest uppercase bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    {robot.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono flex items-center space-x-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
                    <span className="font-bold text-slate-800">{robot.rating} / 5</span>
                    <span>({robot.reviews?.length || 0} reviews)</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{robot.name}</h1>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {robot.description}
                </p>

                {/* Spec Table */}
                <div className="pt-4">
                  <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider mb-3">
                    Machine Engineering Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 border border-slate-200/80 rounded-2xl">
                    <div className="text-xs">
                      <span className="text-slate-400 font-mono block">Manufacturer</span>
                      <span className="text-slate-900 font-bold">{robot.specs?.manufacturer || 'N/A'}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400 font-mono block">Payload Limit</span>
                      <span className="text-slate-900 font-bold">{robot.specs?.payload || 'N/A'}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400 font-mono block">Autonomy / Power</span>
                      <span className="text-slate-900 font-bold">{robot.specs?.batteryLife || 'N/A'}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400 font-mono block">Active Speed</span>
                      <span className="text-slate-900 font-bold">{robot.specs?.speed || 'N/A'}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400 font-mono block">Total Weight</span>
                      <span className="text-slate-900 font-bold">{robot.specs?.weight || 'N/A'}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400 font-mono block">Operating OS</span>
                      <span className="text-slate-900 font-bold">{robot.specs?.operatingSystem || 'N/A'}</span>
                    </div>
                    <div className="text-xs sm:col-span-2 border-t border-slate-200 pt-2 mt-1">
                      <span className="text-slate-400 font-mono block">Warranty Coverage</span>
                      <span className="text-slate-900 font-bold">{robot.specs?.warranty || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QA Reviews panel */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900">
                User Reviews & Field Test Logs
              </h2>

              {/* Review submit form */}
              {currentUserId ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                  <h3 className="text-xs font-bold text-slate-800">Submit Performance Review</h3>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500">Reliability Rating:</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setRating(stars)}
                          className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star className={`h-4.5 w-4.5 ${rating >= stars ? 'fill-current' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share feedback on performance, specs, payload, ROS2 integration..."
                      required
                      className="w-full h-20 bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    {reviewError && <span className="text-[10px] text-rose-600 font-bold">{reviewError}</span>}
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="ml-auto flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer disabled:opacity-40 transition-colors shadow-2xs"
                    >
                      {submittingReview ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3 w-3" />}
                      <span>Submit Review</span>
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-xs text-slate-400 italic">Login to submit listing reviews.</p>
              )}

              {/* Review list */}
              <div className="space-y-4">
                {robot.reviews && robot.reviews.length > 0 ? (
                  robot.reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span>{rev.username}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex text-amber-400 my-1">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No community reviews recorded yet.</p>
                )}
              </div>

            </div>

          </div>

          {/* Right Column: AI Analysis + Order Sidebar */}
          <div className="space-y-6">
            
            {/* Pricing Card & Checkout */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
              <div>
                <span className="text-xs text-slate-400 block font-mono">Investment Price</span>
                <span className="text-3xl font-black text-emerald-600">${robot.price.toLocaleString()}</span>
                <span className="text-xs text-slate-500 block mt-1">Includes hardware inspection certificate and Web3 escrow protection.</span>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleBuySubmit}
                  disabled={orderPlacing}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-40 min-h-[44px]"
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
                    className="w-full flex items-center justify-center space-x-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs tracking-wider uppercase py-3 rounded-xl transition-all cursor-pointer min-h-[44px]"
                    id="initiate-chat-trigger"
                  >
                    <MessageSquare className="h-4 w-4 text-emerald-600" />
                    <span>Inquire with Seller</span>
                  </button>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-500 space-y-1">
                <p>📍 Location: <span className="font-semibold text-slate-700">{robot.location}</span></p>
                <p>👤 Seller: <span className="font-semibold text-slate-700">{robot.sellerName}</span></p>
              </div>
            </div>

            {/* AI LISTING QUALITY & SECURITY ANALYZER */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold font-mono text-emerald-700 uppercase tracking-widest flex items-center space-x-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span>AI Security Audit</span>
                </h3>
                <span className="text-[10px] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-emerald-700 font-mono font-bold">
                  Gemini API
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Run an autonomous AI scan of this listing's specs consistency, price logic, and authenticity index.
              </p>

              {hasGeminiKey === false && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] flex items-start space-x-2 shadow-2xs" id="gemini-key-missing-details">
                  <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 block mb-0.5">Gemini Key Warning</span>
                    <span>The <code className="px-1 py-0.5 bg-amber-100 rounded font-mono text-[10px]">GEMINI_API_KEY</code> is missing. Audit runs in fallback mode.</span>
                  </div>
                </div>
              )}

              {!aiAnalysisResult && !isAiAnalyzing && (
                <button
                  onClick={handleRunAIAnalysis}
                  className="w-full py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/60 text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 min-h-[44px]"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Execute Verification Scan</span>
                </button>
              )}

              {isAiAnalyzing && (
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800 font-mono">Scanning listing...</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-2/3 rounded-full animate-pulse" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">Evaluating hardware specs & price metrics...</p>
                </div>
              )}

              {aiAnalysisError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                  {aiAnalysisError}
                </div>
              )}

              {/* Render AI audit results */}
              {aiAnalysisResult && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3.5 animate-fade-in">
                  
                  {/* Gauge */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-mono block">Authenticity Index</span>
                      <div className="flex items-baseline space-x-1">
                        <span className={`text-xl font-black ${
                          aiAnalysisResult.qualityScore >= 80 ? 'text-emerald-600' : aiAnalysisResult.qualityScore >= 50 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {aiAnalysisResult.qualityScore}
                        </span>
                        <span className="text-[10px] text-slate-400">/ 100</span>
                      </div>
                    </div>

                    {/* Verdict */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block text-right">Security Verdict</span>
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border mt-0.5 ${
                        aiAnalysisResult.verdict === 'Excellent'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : aiAnalysisResult.verdict === 'Fair'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : aiAnalysisResult.verdict === 'Suspicious'
                          ? 'bg-amber-50 border-amber-200 text-amber-700'
                          : 'bg-rose-50 border-rose-200 text-rose-700'
                      }`}>
                        {aiAnalysisResult.verdict}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-700 leading-relaxed italic border-l-2 border-emerald-600 pl-2.5">
                    "{aiAnalysisResult.summary}"
                  </p>

                  {/* Suspicious Flags */}
                  {aiAnalysisResult.suspiciousFlags && aiAnalysisResult.suspiciousFlags.length > 0 ? (
                    <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl space-y-1.5">
                      <span className="text-[10px] font-bold text-rose-700 flex items-center space-x-1 uppercase font-mono">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>Suspicious Flags Detected</span>
                      </span>
                      <ul className="space-y-1">
                        {aiAnalysisResult.suspiciousFlags.map((flag, idx) => (
                          <li key={idx} className="text-[10px] text-slate-600 list-disc ml-3.5 leading-relaxed">
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl text-[10px] text-emerald-700 font-mono font-bold">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span>Spec Compliance Verification Passed</span>
                    </div>
                  )}

                  {/* Pros / Cons tabs */}
                  <div className="grid grid-cols-2 gap-3 pt-1 text-[10px]">
                    <div className="space-y-1">
                      <span className="font-bold text-emerald-700 font-mono block">Positive Indicators</span>
                      <ul className="space-y-1">
                        {aiAnalysisResult.pros.slice(0, 2).map((p, idx) => (
                          <li key={idx} className="text-slate-600 list-disc ml-3.5 leading-relaxed">{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-slate-500 font-mono block">Procurement Caution</span>
                      <ul className="space-y-1">
                        {aiAnalysisResult.cons.slice(0, 2).map((c, idx) => (
                          <li key={idx} className="text-slate-600 list-disc ml-3.5 leading-relaxed">{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={handleRunAIAnalysis}
                    className="w-full text-center text-[10px] text-slate-400 hover:text-emerald-700 underline cursor-pointer mt-2 block"
                  >
                    Re-verify Listing Data
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
