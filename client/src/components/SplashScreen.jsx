import React, { useState, useEffect } from "react";
import RailNexLogo from "./RailNexLogo";
import { ShieldCheck, Zap } from "lucide-react";

export default function SplashScreen({ onFinish }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(15);
  const [fadeout, setFadeout] = useState(false);

  const steps = [
    "Connecting to Indian Railways Central Gateway...",
    "Synchronizing Indian Standard Time (IST)...",
    "Anti-Agent Bot Shield: SECURED",
    "Ready for Confirmed Booking"
  ];

  useEffect(() => {
    // Step transitions
    const t1 = setTimeout(() => {
      setStep(1);
      setProgress(50);
    }, 450);

    const t2 = setTimeout(() => {
      setStep(2);
      setProgress(85);
    }, 900);

    const t3 = setTimeout(() => {
      setStep(3);
      setProgress(100);
      setFadeout(true);
    }, 1300);

    const t4 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#070d1a] flex flex-col items-center justify-center p-6 text-white transition-opacity duration-300 ${
        fadeout ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950/70 to-slate-950 pointer-events-none"></div>

      {/* Speed Lines Animation */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(56,189,248,0.15)_20px,rgba(56,189,248,0.15)_22px)] animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center space-y-6">
        {/* Animated App Opening Logo */}
        <div className="relative">
          {/* Glowing Aura Ring */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
          
          <div className="relative p-2 bg-slate-900/80 rounded-3xl border border-blue-500/40 shadow-2xl transform transition-transform hover:scale-105 duration-300">
            <RailNexLogo size={108} animated={true} />
          </div>
        </div>

        {/* Brand Name */}
        <div>
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
              Rail<span className="text-[#fb792b]">Nex</span>
            </h1>
            <span className="text-[10px] bg-[#fb792b]/20 text-[#fb792b] border border-[#fb792b]/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Smart PRS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
            India's Next-Generation Rail Reservation Platform
          </p>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="w-full max-w-xs space-y-2.5 pt-2">
          {/* Progress track */}
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-blue-500 via-cyan-400 to-amber-400 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Status Message */}
          <div className="h-6 flex items-center justify-center space-x-1.5 text-xs text-slate-300 font-mono">
            {step === 2 ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            )}
            <span className="truncate">{steps[step]}</span>
          </div>
        </div>

        {/* Footnote */}
        <div className="pt-6 text-[10px] text-slate-500 font-mono">
          <span>CRIS Network • All 34 Jharkhand Stations • 0 Agent Bots</span>
        </div>
      </div>
    </div>
  );
}
