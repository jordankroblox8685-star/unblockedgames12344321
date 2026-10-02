import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle } from 'lucide-react';

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('Arrow keys / Mouse');
  const [iframeInput, setIframeInput] = useState('');
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a game title.');
      return;
    }
    if (!iframeInput.trim()) {
      setError('Please provide an iframe HTML tag or game URL.');
      return;
    }

    let finalIframe = iframeInput.trim();
    let finalSrc = '';

    // If user provided a raw URL instead of <iframe>, convert to iframe
    if (finalIframe.startsWith('http://') || finalIframe.startsWith('https://') || finalIframe.startsWith('/')) {
      finalSrc = finalIframe;
      finalIframe = `<iframe src="${finalSrc}" title="${title}" width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; fullscreen; gamepad"></iframe>`;
    } else {
      // Extract src if possible
      const match = finalIframe.match(/src=["'](.*?)["']/);
      if (match) {
        finalSrc = match[1];
      }
    }

    const newGame = {
      id: 'custom-' + Date.now(),
      title: title.trim(),
      category: category,
      badge: 'Custom',
      rating: 5.0,
      plays: 1,
      accentColor: accentColor,
      description: description.trim() || 'Custom added game.',
      controls: controls.trim() || 'Keyboard & Mouse controls',
      iframe: finalIframe,
      iframeSrc: finalSrc,
      isCustom: true
    };

    onAddGame(newGame);
    onClose();
    // reset form
    setTitle('');
    setDescription('');
    setIframeInput('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Add Custom Game</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-950/40 border border-rose-800/80 rounded-lg text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Game Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Slope 3D / Retro Bowl"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Classic">Classic</option>
                <option value="Action">Action</option>
                <option value="Retro">Retro</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Accent Color
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-400">{accentColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Iframe HTML or Game URL *
            </label>
            <p className="text-xs text-slate-500 mb-1.5">
              Paste the complete <code className="text-indigo-400 font-mono">&lt;iframe src="..."&gt;&lt;/iframe&gt;</code> code or any game URL.
            </p>
            <textarea
              required
              rows={3}
              value={iframeInput}
              onChange={(e) => setIframeInput(e.target.value)}
              placeholder='<iframe src="https://example.com/game" width="100%" height="100%" frameborder="0"></iframe>'
              className="w-full font-mono bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Instructions & Controls
            </label>
            <input
              type="text"
              value={controls}
              onChange={(e) => setControls(e.target.value)}
              placeholder="e.g. Arrow keys to steer, Space to brake"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the gameplay..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
            >
              Save & Play Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
