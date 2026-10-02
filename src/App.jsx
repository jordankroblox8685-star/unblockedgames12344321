/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Shuffle } from 'lucide-react';
import { INITIAL_GAMES } from './data/games.js';
import { Navbar } from './components/Navbar.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { FeaturedHero } from './components/FeaturedHero.jsx';
import { CloakModal } from './components/CloakModal.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { applyCloak, triggerPanic } from './utils/cloak.js';

export default function App() {
  const [games, setGames] = useState(INITIAL_GAMES);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCategory, setCurrentCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  
  // LocalStorage state
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('playvault_favorites');
      return saved ? JSON.parse(saved) : ['tetris', 'snake'];
    } catch {
      return ['tetris', 'snake'];
    }
  });

  const [cloakPresetId, setCloakPresetId] = useState(() => {
    return localStorage.getItem('playvault_cloak') || 'default';
  });

  const [panicKey, setPanicKey] = useState(() => {
    return localStorage.getItem('playvault_panic_key') || ']';
  });

  const [panicUrl, setPanicUrl] = useState(() => {
    return localStorage.getItem('playvault_panic_url') || 'https://classroom.google.com';
  });

  // Modals
  const [isCloakOpen, setIsCloakOpen] = useState(false);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);

  // Load from /games.json on mount to ensure freshness, and load custom games
  useEffect(() => {
    fetch('/games.json')
      .then((res) => res.json())
      .then((data) => {
        let customGames = [];
        try {
          const stored = localStorage.getItem('playvault_custom_games');
          if (stored) customGames = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
        setGames([...data, ...customGames]);
      })
      .catch(() => {
        let customGames = [];
        try {
          const stored = localStorage.getItem('playvault_custom_games');
          if (stored) customGames = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
        setGames([...INITIAL_GAMES, ...customGames]);
      });

    // Check cloak on mount
    applyCloak(cloakPresetId);
  }, []);

  // Listen to URL hash change for deep linking to games (#tetris, #2048, etc.)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const found = games.find((g) => g.id === hash);
        if (found) setSelectedGame(found);
      } else {
        setSelectedGame(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [games]);

  // Global panic key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        ['INPUT', 'TEXTAREA'].includes(e.target?.tagName)
      ) {
        return;
      }
      if (e.key === panicKey) {
        e.preventDefault();
        triggerPanic(panicUrl);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panicKey, panicUrl]);

  // Save favorites to localStorage
  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('playvault_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Add custom game
  const handleAddGame = (newGame) => {
    setGames((prev) => {
      const updated = [newGame, ...prev];
      const customOnly = updated.filter((g) => g.isCustom);
      localStorage.setItem('playvault_custom_games', JSON.stringify(customOnly));
      return updated;
    });
    // Select and play it right away
    handleSelectGame(newGame);
  };

  // Set Panic key and save
  const handleSetPanicKey = (key) => {
    setPanicKey(key);
    localStorage.setItem('playvault_panic_key', key);
  };

  // Set Panic URL and save
  const handleSetPanicUrl = (url) => {
    setPanicUrl(url);
    localStorage.setItem('playvault_panic_url', url);
  };

  // Open game
  const handleSelectGame = (game) => {
    window.location.hash = game.id;
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to catalog
  const handleBackToCatalog = () => {
    window.location.hash = '';
    setSelectedGame(null);
  };

  // Pick random game
  const handleRandomGame = () => {
    if (games.length === 0) return;
    const random = games[Math.floor(Math.random() * games.length)];
    handleSelectGame(random);
  };

  // Categories list
  const categories = ['All', 'Arcade', 'Puzzle', 'Classic', 'Action', 'Retro', 'Strategy', 'Favorites'];

  // Filtered and sorted games
  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        // Category filter
        if (currentCategory === 'Favorites') {
          if (!favorites.includes(game.id)) return false;
        } else if (currentCategory === 'Custom') {
          if (!game.isCustom) return false;
        } else if (currentCategory !== 'All') {
          if (game.category.toLowerCase() !== currentCategory.toLowerCase()) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = game.title.toLowerCase().includes(q);
          const matchDesc = game.description.toLowerCase().includes(q);
          const matchCat = game.category.toLowerCase().includes(q);
          return matchTitle || matchDesc || matchCat;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.plays - a.plays;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'az') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [games, currentCategory, searchQuery, sortBy, favorites]);

  // Featured game for the hero banner
  const featuredGame = useMemo(() => {
    return games.find((g) => g.id === 'tetris') || games[0];
  }, [games]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentCategory={currentCategory}
        onSelectCategory={setCurrentCategory}
        favoritesCount={favorites.length}
        onOpenCloakModal={() => setIsCloakOpen(true)}
        onOpenAddGameModal={() => setIsAddGameOpen(true)}
        onPanicTrigger={() => triggerPanic(panicUrl)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {selectedGame ? (
          /* Game Playing View with Iframe */
          <GamePlayer
            game={selectedGame}
            allGames={games}
            isFavorite={favorites.includes(selectedGame.id)}
            onToggleFavorite={toggleFavorite}
            onBackToCatalog={handleBackToCatalog}
            onSelectGame={handleSelectGame}
          />
        ) : (
          /* Game Catalog View */
          <div>
            {/* Featured Hero Banner when no search active and on All */}
            {currentCategory === 'All' && !searchQuery.trim() && featuredGame && (
              <FeaturedHero
                game={featuredGame}
                isFavorite={favorites.includes(featuredGame.id)}
                onToggleFavorite={toggleFavorite}
                onPlayGame={handleSelectGame}
              />
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800/80">
              {/* Category Segmented Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {categories.map((cat) => {
                  const isActive = currentCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCurrentCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {cat === 'Favorites' ? `Favorites (${favorites.length})` : cat}
                    </button>
                  );
                })}
              </div>

              {/* Search & Actions */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search unblocked games..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-xs text-slate-500 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Sort Selector */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Top Rated</option>
                  <option value="az">Alphabetical</option>
                </select>

                {/* Randomizer Button */}
                <button
                  onClick={handleRandomGame}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  title="Play Random Game"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Catalog Header Info */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-slate-400 font-medium">
                Showing <span className="font-mono text-slate-200 font-semibold">{filteredGames.length}</span> games
                {currentCategory !== 'All' && <span> in {currentCategory}</span>}
              </div>

              {currentCategory === 'Favorites' && filteredGames.length === 0 && (
                <div className="text-xs text-slate-500">
                  Click the heart icon on any game card to add it to your favorites.
                </div>
              )}
            </div>

            {/* Game Cards Grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelectGame={handleSelectGame}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
                <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No games found</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Try adjusting your search query or select another category.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentCategory('All');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Quiet Domain-Appropriate Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-400">PlayVault</span>
            <span>·</span>
            <span>Fast, lightweight unblocked arcade hub</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsAddGameOpen(true)}
              className="hover:text-white transition-colors"
            >
              Add Custom Game
            </button>
            <span>·</span>
            <button
              onClick={() => setIsCloakOpen(true)}
              className="hover:text-white transition-colors"
            >
              Cloak Settings
            </button>
            <span>·</span>
            <span className="font-mono text-slate-600">v1.2.0</span>
          </div>
        </div>
      </footer>

      {/* Cloak / Stealth Modal */}
      <CloakModal
        isOpen={isCloakOpen}
        onClose={() => setIsCloakOpen(false)}
        currentPresetId={cloakPresetId}
        onSelectPreset={setCloakPresetId}
        panicKey={panicKey}
        onChangePanicKey={handleSetPanicKey}
        panicUrl={panicUrl}
        onChangePanicUrl={handleSetPanicUrl}
      />

      {/* Add Custom Game Modal */}
      <AddGameModal
        isOpen={isAddGameOpen}
        onClose={() => setIsAddGameOpen(false)}
        onAddGame={handleAddGame}
      />
    </div>
  );
}
