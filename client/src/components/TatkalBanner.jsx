import React, { useState, useEffect } from "react";
import { ShieldCheck, Zap, Clock, Lock, Users, AlertCircle, CheckCircle } from "lucide-react";

export default function TatkalBanner({ quota, onSelectTatkal }) {
  const [timeLeftAC, setTimeLeftAC] = useState("00:14:28");
  const [timeLeftNonAC, setTimeLeftNonAC] = useState("01:14:28");

  useEffect(() => {
    // Dynamic countdown simulation
    const interval = setInterval(() => {
      const now = new Date();
      const targetAC = new Date();
      targetAC.setHours(10, 0, 0, 0);

      // Simple ticking effect
      const sec = Math.floor(Date.now() / 1000) % 60;
      const min = Math.floor(Date.now() / 60000) % 60;
      setTimeLeftAC(`00:${(59 - min).toString().padStart(2, '0')}:${(59 - sec).toString().padStart(2, '0')}`);
      setTimeLeftNonAC(`01:${(59 - min).toString().padStart(2, '0')}:${(59 - sec).toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border-y border-slate-200 py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
          {/* Left: Anti-Agent Tatkal Guarantee Highlights */}
          <div className="space-y-1.5 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>RailNex High-Speed Engine • Zero Agent Hoarding</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#213d77]">
              Zero Tatkal Server Crashes. Guaranteed Fair Allocation.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Unlike IRCTC's 10:00 AM server freezes, RailNex uses a high-concurrency Virtual Waiting Room with 1-Aadhaar-1-Ticket token locks.
            </p>
          </div>

          {/* Right: Live Tatkal Windows & Quick Action */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {/* AC Tatkal Box */}
            <div className="bg-[#f4f6fa] border border-slate-200 rounded-xl p-3 text-center min-w-[140px] shadow-sm">
              <div className="flex items-center justify-center space-x-1 text-[11px] text-[#fb792b] font-bold uppercase">
                <Clock className="w-3.5 h-3.5" />
                <span>AC Tatkal (10 AM)</span>
              </div>
              <div className="text-lg font-mono font-extrabold text-[#213d77] mt-0.5">
                {timeLeftAC}
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold inline-block mt-1">
                Queue Open
              </span>
            </div>

            {/* Non-AC Tatkal Box */}
            <div className="bg-[#f4f6fa] border border-slate-200 rounded-xl p-3 text-center min-w-[140px] shadow-sm">
              <div className="flex items-center justify-center space-x-1 text-[11px] text-[#213d77] font-bold uppercase">
                <Clock className="w-3.5 h-3.5" />
                <span>Non-AC Tatkal (11 AM)</span>
              </div>
              <div className="text-lg font-mono font-extrabold text-[#213d77] mt-0.5">
                {timeLeftNonAC}
              </div>
              <span className="text-[10px] text-slate-600 bg-slate-200 px-2 py-0.5 rounded font-semibold inline-block mt-1">
                Standing By
              </span>
            </div>

            {/* Activate Tatkal Filter Button */}
            {quota !== "TATKAL" && (
              <button
                onClick={onSelectTatkal}
                className="bg-[#fb792b] hover:bg-[#e06518] text-white font-bold px-4 py-3 rounded-xl shadow-md text-xs sm:text-sm flex items-center space-x-2 transition-transform active:scale-95 whitespace-nowrap"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Switch to Tatkal Quota</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
