import React from 'react';
import { Shield, AlertOctagon, Plus, Heart } from 'lucide-react';

export const Navbar = ({
  currentCategory,
  onSelectCategory,
  favoritesCount,
  onOpenCloakModal,
  onOpenAddGameModal,
  onPanicTrigger
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-6">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('All');
            }}
            className="text-xl font-bold tracking-tight text-white hover:text-indigo-400 transition-colors shrink-0"
          >
            PlayVault
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectCategory('All')}
            className={`transition-colors hover:text-white ${currentCategory === 'All' ? 'text-indigo-400 font-semibold' : ''}`}
          >
            All Games
          </button>
          <button
            onClick={() => onSelectCategory('Arcade')}
            className={`transition-colors hover:text-white ${currentCategory === 'Arcade' ? 'text-indigo-400 font-semibold' : ''}`}
          >
            Arcade
          </button>
          <button
            onClick={() => onSelectCategory('Puzzle')}
            className={`transition-colors hover:text-white ${currentCategory === 'Puzzle' ? 'text-indigo-400 font-semibold' : ''}`}
          >
            Puzzle
          </button>
          <button
            onClick={() => onSelectCategory('Retro')}
            className={`transition-colors hover:text-white ${currentCategory === 'Retro' ? 'text-indigo-400 font-semibold' : ''}`}
          >
            Retro
          </button>
          <button
            onClick={() => onSelectCategory('Favorites')}
            className={`flex items-center gap-1.5 transition-colors hover:text-white ${currentCategory === 'Favorites' ? 'text-rose-400 font-semibold' : ''}`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Favorites ({favoritesCount})</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddGameModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap"
            title="Add Custom Game Iframe"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Game</span>
          </button>

          <button
            onClick={onOpenCloakModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 rounded-lg transition-colors whitespace-nowrap"
            title="Tab Cloak & Stealth Settings"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Cloak Tab</span>
          </button>

          <button
            onClick={onPanicTrigger}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg transition-colors whitespace-nowrap"
            title="Instant Panic Escape (redirects page)"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Panic [ ]</span>
          </button>
        </div>
      </div>
    </header>
  );
};
