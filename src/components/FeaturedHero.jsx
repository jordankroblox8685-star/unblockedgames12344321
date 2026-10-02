import React from 'react';
import { Play, Flame, Star, Heart } from 'lucide-react';

export const FeaturedHero = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlayGame
}) => {
  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 lg:p-10 mb-8 overflow-hidden shadow-2xl">
      {/* Background ambient glow */}
      <div
        className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: game.accentColor }}
      />

      <div className="relative z-10 max-w-2xl">
        {/* Editorial Subtitle / Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Featured Title of the Week</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
          {game.title}
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-5 max-w-xl">
          {game.description}
        </p>

        {/* Clean Metadata without pills */}
        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400 mb-6">
          <span className="font-semibold text-slate-200">{game.category} Arcade</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 text-amber-400 font-mono font-medium">
            <Star className="w-4 h-4 fill-amber-400" />
            {game.rating.toFixed(1)} Community Rating
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-slate-300">
            {game.plays.toLocaleString()} players
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onPlayGame(game)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Play Now</span>
          </button>

          <button
            onClick={(e) => onToggleFavorite(game.id, e)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border font-semibold text-sm transition-colors ${
              isFavorite
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
