import React, { useState, useEffect } from "react";
import { Download, Smartphone, X, Check, Share2, Sparkles } from "lucide-react";

export default function MobileAppInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running as standalone installed app
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for Android / Chrome PWA install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!sessionStorage.getItem("railnex_install_dismissed")) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // If iOS and not dismissed, show banner
    if (isIosDevice && !sessionStorage.getItem("railnex_install_dismissed")) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      alert("To install RailNex on your device:\n1. Open browser menu (⋮)\n2. Tap 'Install app' or 'Add to Home screen'");
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("railnex_install_dismissed", "true");
  };

  if (isStandalone || !showBanner) return null;

  return (
    <>
      {/* Top Banner on Mobile */}
      <aside aria-label="Install mobile app" className="bg-[#182c57] text-white px-3 py-2 text-xs flex items-center justify-between border-b border-[#213d77] shadow-sm">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center p-1.5 shrink-0 border border-white/20">
            <Smartphone className="w-5 h-5 text-amber-300" />
          </div>
          <div className="truncate">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-white truncate">Install RailNex Mobile App</span>
              <span className="text-[9px] bg-[#fb792b] text-white font-black px-1.5 py-0.2 rounded-full uppercase">
                Official
              </span>
            </div>
            <p className="text-[10px] text-slate-300 truncate">
              1-Click Tatkal Booking • Offline PNR Passes • Zero Lag
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-3 py-1 bg-[#fb792b] hover:bg-[#e06518] text-white font-bold rounded-lg text-xs shadow-sm flex items-center space-x-1 transition-transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="w-6 h-6 rounded-full hover:bg-white/20 text-white/80 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 text-white border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-slideUp">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-white">Install on iPhone / iPad</h3>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start space-x-3 bg-slate-800/60 p-3 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">1</span>
                <div>
                  Tap the <strong className="text-white">Share</strong> button <Share2 className="w-3.5 h-3.5 inline text-blue-400" /> in Safari's bottom toolbar.
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-slate-800/60 p-3 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">2</span>
                <div>
                  Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong> (➕).
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-slate-800/60 p-3 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">3</span>
                <div>
                  Tap <strong className="text-white">Add</strong> in the top right corner. RailNex will appear on your Home Screen as a native app!
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
