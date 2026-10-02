import React from 'react';
import { Play, Heart, Star, Gamepad2 } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame
}) => {
  return (
    <div
      onClick={() => onSelectGame(game)}
      className="group relative flex flex-col justify-between p-4 bg-slate-900/90 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl cursor-pointer game-card-hover overflow-hidden"
    >
      {/* Top Banner / Graphic Slot */}
      <div
        className="relative w-full h-36 rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-slate-800"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${game.accentColor}25 0%, #030712 90%)`
        }}
      >
        {/* Subtle geometric pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${game.accentColor} 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />

        {/* Center Game Icon */}
        <div
          className="relative z-10 w-14 h-14 rounded-xl flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-200"
          style={{ backgroundColor: `${game.accentColor}20` }}
        >
          <Gamepad2 className="w-7 h-7" style={{ color: game.accentColor }} />
        </div>

        {/* Play Overlay on Hover */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150 backdrop-blur-[2px]">
          <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-slate-950 font-bold text-xs shadow-xl scale-95 group-hover:scale-100 transition-transform">
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            Play Now
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(game.id, e)}
          className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-lg backdrop-blur-md transition-colors ${
            isFavorite
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
        </button>

        {/* Optional Custom/Badge quiet indicator */}
        {game.badge && (
          <div className="absolute top-2.5 left-2.5 z-10 text-[10px] font-bold tracking-wider uppercase text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
            {game.badge}
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div>
        <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1">
          {game.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {game.description}
        </p>
      </div>

      {/* Clean Unboxed Metadata with Typographic Separators (ZERO PILL RULE) */}
      <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-800/60">
        <span className="font-medium text-slate-400">{game.category}</span>
        <span aria-hidden="true">·</span>
        <span className="flex items-center gap-1 text-amber-400 font-mono">
          <Star className="w-3 h-3 fill-amber-400" />
          {game.rating.toFixed(1)}
        </span>
        <span aria-hidden="true">·</span>
        <span className="font-mono tabular-nums text-slate-400">
          {(game.plays / 1000).toFixed(1)}k plays
        </span>
      </div>
    </div>
  );
};
