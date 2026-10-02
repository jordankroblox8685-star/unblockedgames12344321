import React, { useState } from 'react';
import { X, Check, ShieldAlert, Globe, AlertTriangle } from 'lucide-react';
import { CLOAK_PRESETS, applyCloak } from '../utils/cloak.js';

export const CloakModal = ({
  isOpen,
  onClose,
  currentPresetId,
  onSelectPreset,
  panicKey,
  onChangePanicKey,
  panicUrl,
  onChangePanicUrl
}) => {
  const [listeningKey, setListeningKey] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Stealth & Cloak Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Tab Cloak Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Disguise Tab Icon & Title
            </label>
            <p className="text-xs text-slate-400 mb-3">
              Changes the browser tab title and favicon to blend into school or work environments.
            </p>
            <div className="space-y-2">
              {CLOAK_PRESETS.map((preset) => {
                const isSelected = preset.id === currentPresetId;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      applyCloak(preset.id);
                      onSelectPreset(preset.id);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/80 text-white'
                        : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={preset.iconSvg}
                        alt=""
                        className="w-5 h-5 object-contain rounded"
                      />
                      <div>
                        <div className="text-sm font-medium">{preset.name}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[240px]">
                          {preset.title}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panic Key Settings */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Emergency Panic Button
              </label>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Hitting this hotkey instantly closes this tab by navigating to your panic destination.
            </p>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Hotkey Trigger</span>
                <button
                  type="button"
                  onClick={() => setListeningKey(true)}
                  onKeyDown={(e) => {
                    if (listeningKey) {
                      e.preventDefault();
                      onChangePanicKey(e.key);
                      setListeningKey(false);
                    }
                  }}
                  className={`w-full px-3 py-2 text-sm text-center font-mono rounded-lg border transition-all ${
                    listeningKey
                      ? 'bg-amber-950/50 border-amber-500 text-amber-200 animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {listeningKey ? 'Press any key now...' : `Current Key: [ ${panicKey} ]`}
                </button>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">Redirect Destination URL</span>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    value={panicUrl}
                    onChange={(e) => onChangePanicUrl(e.target.value)}
                    placeholder="https://classroom.google.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
