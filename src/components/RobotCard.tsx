import React from 'react';
import { Heart, Star, MapPin, ClipboardList, CheckSquare, Square } from 'lucide-react';
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
    <div className="group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-xl overflow-hidden shadow-sm transition-all duration-300" id={`robot-card-${robot.id}`}>
      {/* Image Header with hover zoom */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={robot.imageUrl}
          alt={robot.name}
          className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        
        {/* Wishlist toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className={`absolute top-3.5 right-3.5 w-10 h-10 flex items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-colors cursor-pointer min-h-[44px] min-w-[44px] ${
            isWishlisted 
              ? 'bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-900/60 text-red-500 dark:text-red-400' 
              : 'bg-white/80 border-zinc-200/80 dark:bg-zinc-900/80 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400'
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Condition tag */}
        <span className={`absolute top-3.5 left-3.5 text-[10px] font-mono tracking-wider font-bold uppercase px-2.5 py-1 rounded-md border ${
          robot.condition === 'new' 
            ? 'bg-green-50 border-green-200 dark:bg-green-950/40 dark:border-green-900/60 text-green-700 dark:text-green-400' 
            : robot.condition === 'refurbished'
            ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/60 text-amber-700 dark:text-amber-400'
            : 'bg-zinc-50 border-zinc-200 dark:bg-zinc-850 dark:border-zinc-700 text-zinc-600 dark:text-zinc-350'
        }`}>
          {robot.condition}
        </span>
      </div>

      {/* Card Content body */}
      <div className="flex-1 flex flex-col p-4">
        {/* Category & Location */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <span>{robot.category}</span>
          <span className="flex items-center space-x-1">
            <MapPin className="h-3 w-3 text-zinc-400 dark:text-zinc-500" />
            <span>{robot.location}</span>
          </span>
        </div>

        {/* Title */}
        <h2 
          onClick={onSelect}
          className="text-base font-bold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer mt-2 line-clamp-1"
        >
          {robot.name}
        </h2>

        {/* Seller citation */}
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-sans mt-0.5">
          Seller: <span className="text-zinc-600 dark:text-zinc-300">{robot.sellerName}</span>
        </p>

        {/* Ratings block */}
        <div className="flex items-center space-x-1.5 mt-2">
          <div className="flex text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{robot.rating}</span>
          <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-mono">
            ({robot.reviews?.length || 0} reviews)
          </span>
        </div>

        {/* Specs summary snapshot */}
        <div className="grid grid-cols-2 gap-2 border-t border-b border-zinc-200/60 dark:border-zinc-800 my-3 py-2.5">
          <div className="text-[10px]">
            <span className="block text-zinc-400 dark:text-zinc-550 font-mono">Payload Limit</span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 truncate block">{robot.specs?.payload || 'N/A'}</span>
          </div>
          <div className="text-[10px]">
            <span className="block text-zinc-400 dark:text-zinc-550 font-mono">Autonomy/Battery</span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 truncate block">{robot.specs?.batteryLife || 'N/A'}</span>
          </div>
        </div>

        {/* Bottom Panel: Pricing, Compare selector and Inspect button */}
        <div className="mt-auto pt-1 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-450 dark:text-zinc-500 block font-mono">Investment Price</span>
            <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
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
              className={`flex items-center space-x-1 p-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors min-h-[44px] ${
                isCompared 
                  ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/80 text-blue-750 dark:text-blue-400 font-semibold' 
                  : 'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
              title="Add to Spec Comparison Table"
            >
              {isCompared ? <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" /> : <Square className="h-4 w-4" />}
              <span className="hidden lg:inline text-[10px]">Compare</span>
            </button>

            <button
              onClick={onSelect}
              className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold px-3 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm min-h-[44px] flex items-center"
            >
              Inspect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
