import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Maximize,
  Minimize,
  Heart,
  Share2,
  Gamepad2,
  Check,
  Expand,
  Info
} from 'lucide-react';

export const GamePlayer = ({
  game,
  allGames,
  isFavorite,
  onToggleFavorite,
  onBackToCatalog,
  onSelectGame
}) => {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isTheater, setIsTheater] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Parse or extract iframe source URL
  let srcUrl = game.iframeSrc || '';
  if (!srcUrl) {
    const match = game.iframe.match(/src=["'](.*?)["']/);
    if (match) srcUrl = match[1];
  }

  // Handle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error("Fullscreen error:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => {
        console.error("Exit fullscreen error:", err);
      });
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Reload the game iframe
  const reloadGame = () => {
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = 'about:blank';
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = currentSrc;
      }, 50);
    }
  };

  // Copy share URL
  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}#${game.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Related games in the same category
  const relatedGames = allGames
    .filter(g => g.id !== game.id && (g.category === game.category || Math.random() > 0.5))
    .slice(0, 4);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCatalog}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Catalog</span>
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>{game.title}</span>
              {game.badge && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded">
                  {game.badge}
                </span>
              )}
            </h1>
            <div className="text-xs text-slate-400">
              <span>{game.category}</span>
              <span className="mx-2">·</span>
              <span className="text-amber-400">{game.rating.toFixed(1)} ★</span>
              <span className="mx-2">·</span>
              <span>{game.plays.toLocaleString()} plays</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={reloadGame}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="Reload Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsTheater(!isTheater)}
            className={`p-2 rounded-lg border transition-colors ${
              isTheater
                ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
            }`}
            title={isTheater ? 'Exit Theater Mode' : 'Theater Mode'}
          >
            <Expand className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button
            onClick={(e) => onToggleFavorite(game.id, e)}
            className={`p-2 rounded-lg border transition-colors ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
            }`}
            title="Toggle Favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-800 rounded-lg transition-colors"
            title="Share Game Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* The Game Iframe Container */}
      <div
        ref={containerRef}
        className={`relative mx-auto w-full transition-all duration-300 rounded-xl overflow-hidden border border-slate-800 bg-black shadow-2xl ${
          isTheater ? 'max-w-none h-[82vh]' : 'max-w-5xl h-[620px]'
        } ${isFullscreen ? 'h-screen w-screen border-none rounded-none' : ''}`}
      >
        {srcUrl ? (
          <iframe
            ref={iframeRef}
            src={srcUrl}
            title={game.title}
            className="w-full h-full border-0 block"
            allow="autoplay; fullscreen; gamepad; focus-without-user-activation *"
            allowFullScreen
          />
        ) : (
          /* Fallback when full iframe markup is present */
          <div
            className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
            dangerouslySetInnerHTML={{ __html: game.iframe }}
          />
        )}
      </div>

      {/* Game Details & Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="md:col-span-2 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              <span>How to Play & Controls</span>
            </h3>
            <p className="text-sm font-mono text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              {game.controls}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>About {game.title}</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {game.description}
            </p>
          </div>
        </div>

        {/* Up Next / Recommendations */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            More to Play
          </h4>
          <div className="space-y-2">
            {relatedGames.map((rg) => (
              <div
                key={rg.id}
                onClick={() => onSelectGame(rg)}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition-colors group"
              >
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 border border-white/10"
                  style={{ backgroundColor: `${rg.accentColor}25` }}
                >
                  <Gamepad2 className="w-5 h-5" style={{ color: rg.accentColor }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                    {rg.title}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>{rg.category}</span>
                    <span>·</span>
                    <span className="text-amber-400">{rg.rating.toFixed(1)} ★</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
