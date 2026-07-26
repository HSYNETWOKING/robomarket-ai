import React from 'react';
import { Heart, Star, MapPin, CheckSquare, Square, ArrowRight } from 'lucide-react';
import { Robot } from '../types';

interface RobotCardProps {
  key?: string;
  robot: Robot;
  isWishlisted: boolean;
  isCompared: boolean;
  onToggleWishlist: () => void;
  onToggleCompare: () => void;
  onSelect: () => void;
}

export default function RobotCard({
  robot,
  isWishlisted,
  isCompared,
  onToggleWishlist,
  onToggleCompare,
  onSelect
}: RobotCardProps) {
  return (
    <div className="group relative flex flex-col bg-white border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-md rounded-2xl overflow-hidden shadow-2xs transition-all duration-300" id={`robot-card-${robot.id}`}>
      {/* Image Header with hover zoom */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={robot.imageUrl}
          alt={robot.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        
        {/* Wishlist toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full border shadow-2xs backdrop-blur-md transition-all cursor-pointer ${
            isWishlisted 
              ? 'bg-rose-50 border-rose-200 text-rose-600' 
              : 'bg-white/90 border-slate-200/80 text-slate-400 hover:text-rose-600 hover:bg-white'
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Condition tag */}
        <span className={`absolute top-3 left-3 text-[10px] font-mono tracking-wider font-bold uppercase px-2.5 py-1 rounded-full border ${
          robot.condition === 'new' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
            : robot.condition === 'refurbished'
            ? 'bg-amber-50 border-amber-200 text-amber-700'
            : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}>
          {robot.condition}
        </span>
      </div>

      {/* Card Content body */}
      <div className="flex-1 flex flex-col p-5">
        {/* Category & Location */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md text-[11px] font-mono">{robot.category}</span>
          <span className="flex items-center space-x-1 text-slate-400">
            <MapPin className="h-3 w-3 text-slate-400" />
            <span className="text-[11px]">{robot.location}</span>
          </span>
        </div>

        {/* Title */}
        <h3 
          onClick={onSelect}
          className="text-base font-bold text-slate-900 hover:text-emerald-600 transition-colors cursor-pointer mt-2.5 line-clamp-1"
        >
          {robot.name}
        </h3>

        {/* Seller citation */}
        <p className="text-[11px] text-slate-500 font-sans mt-0.5">
          Seller: <span className="font-semibold text-slate-700">{robot.sellerName}</span>
        </p>

        {/* Ratings block */}
        <div className="flex items-center space-x-1.5 mt-2">
          <div className="flex text-amber-400">
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-slate-800">{robot.rating}</span>
          <span className="text-[10px] text-slate-400 font-mono">
            ({robot.reviews?.length || 0} reviews)
          </span>
        </div>

        {/* Specs summary snapshot */}
        <div className="grid grid-cols-2 gap-2 border-t border-b border-slate-100 my-3 py-2.5">
          <div className="text-[10px]">
            <span className="block text-slate-400 font-mono">Payload Limit</span>
            <span className="font-bold text-slate-800 truncate block">{robot.specs?.payload || 'N/A'}</span>
          </div>
          <div className="text-[10px]">
            <span className="block text-slate-400 font-mono">Battery / Run-time</span>
            <span className="font-bold text-slate-800 truncate block">{robot.specs?.batteryLife || 'N/A'}</span>
          </div>
        </div>

        {/* Bottom Panel: Pricing, Compare selector and Inspect button */}
        <div className="mt-auto pt-1 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Price</span>
            <span className="text-lg font-black text-emerald-600">
              ${robot.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Compare Selector */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare();
              }}
              className={`flex items-center space-x-1 px-2.5 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                isCompared 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold' 
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title="Add to Spec Comparison Table"
            >
              {isCompared ? <CheckSquare className="h-4 w-4 text-emerald-600" /> : <Square className="h-4 w-4" />}
              <span className="hidden sm:inline text-[11px]">Compare</span>
            </button>

            <button
              onClick={onSelect}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
            >
              <span>Inspect</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
