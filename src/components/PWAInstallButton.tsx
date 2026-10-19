/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed as a standalone app, no need to show
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 active:scale-95 transition font-display"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 active:scale-95 transition shadow-xs font-display"
        >
          <Download className="w-3.5 h-3.5 text-amber-700" />
          <span>Install PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white font-bold text-sm font-display">
                    M
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 font-display">Install Meetly</h3>
                    <p className="text-xs text-stone-500">For the best meetup experience</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-stone-400 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-stone-600">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <p>
                    1. Tap the <strong className="text-stone-900">Share</strong> icon in the Safari navigation bar.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <p>
                    2. Scroll down and tap <strong className="text-stone-900">Add to Home Screen</strong>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-amber-600 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition font-display"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
