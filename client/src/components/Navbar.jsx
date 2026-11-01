import React, { useState, useEffect } from "react";
import RailNexLogo from "./RailNexLogo";
import { Train, ShieldCheck, Ticket, Search, Zap, Server, Clock, Sparkles, Activity, UserCheck, User, Radio, ArrowLeftRight, Lock } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, onOpenRailwayServerModal, onOpenTteTerminal, currentUser, onOpenAuth, onLogout }) {
  const [metrics, setMetrics] = useState({
    activeUsers: 8420,
    agentBotsBlocked: 1429,
    serverLatencyMs: 14,
    fairnessRating: "99.9%"
  });

  const [railwayStatus, setRailwayStatus] = useState({
    status: "CONNECTED",
    latencyMs: 18,
    mode: "HYBRID"
  });

  const [istTime, setIstTime] = useState("");
  const [currentDateStr, setCurrentDateStr] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setIstTime(now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: true }));
      setCurrentDateStr(now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, railwayRes] = await Promise.all([
          fetch("/api/system/stats"),
          fetch("/api/railway/status")
        ]);
        if (statsRes.ok) setMetrics(await statsRes.json());
        if (railwayRes.ok) setRailwayStatus(await railwayRes.json());
      } catch (e) {
        // fallback
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#213d77] border-b border-[#1b3260] text-white sticky top-0 z-40 shadow-lg">
      {/* 1. Micro-bar: Live Railway Server Sync, IST Time & Bot Deflector */}
      <div className="bg-[#182c57] text-xs py-1.5 px-4 sm:px-6 border-b border-[#142447]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2 text-[11px]">
          {/* Left: Live Indian Standard Time (IST) Clock */}
          <div className="flex items-center space-x-2 font-mono">
            <span className="flex items-center space-x-1.5 bg-[#0f1d3a] border border-[#274580] px-2.5 py-0.5 rounded text-amber-300 font-bold">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{currentDateStr} • {istTime} IST</span>
            </span>
            <span className="hidden sm:inline text-slate-300">
              Indian Railways High-Concurrency PRS Engine
            </span>
          </div>

          {/* Right: Live Anti-Agent Telemetry & Railway Gateway Ping */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onOpenRailwayServerModal}
              className="flex items-center space-x-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 px-2.5 py-0.5 rounded transition-colors"
              title="Click to view Live CRIS Railway Gateway & Telemetry"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <Server className="w-3 h-3" />
              <span>Railway Gateway: ONLINE ({railwayStatus.latencyMs}ms)</span>
            </button>

            <span className="hidden md:inline text-slate-500">|</span>

            <span className="hidden md:flex items-center space-x-1 text-slate-200 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Agent Bots Quarantined: <strong className="text-amber-300">{metrics.agentBotsBlocked.toLocaleString()}</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Standalone Brand Identity */}
          <div
            onClick={() => setActiveTab("search")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <RailNexLogo size={42} className="group-hover:scale-105 transition-transform shrink-0 shadow-md" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-2xl tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  Rail<span className="text-[#fb792b]">Nex</span>
                </span>
                <span className="text-[10px] bg-white/15 text-white border border-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Smart PRS
                </span>
              </div>
              <p className="text-[11px] text-slate-200 hidden sm:block">
                Indian Railways NextGen Reservation • Zero Agent Bots • Confirmed Berths
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={() => setActiveTab("search")}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === "search"
                  ? "bg-[#fb792b] text-white shadow-md"
                  : "text-white/85 hover:text-white hover:bg-white/10"
              }`}
            >
              <Train className="w-4 h-4" />
              <span>Book Trains</span>
            </button>

            <button
              onClick={() => setActiveTab("pnr")}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === "pnr"
                  ? "bg-[#fb792b] text-white shadow-md"
                  : "text-white/85 hover:text-white hover:bg-white/10"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>PNR Status</span>
            </button>

            <button
              onClick={() => setActiveTab("live")}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === "live"
                  ? "bg-[#fb792b] text-white shadow-md"
                  : "text-white/85 hover:text-white hover:bg-white/10"
              }`}
            >
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Live Train</span>
            </button>

            <button
              onClick={() => setActiveTab("swaps")}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === "swaps"
                  ? "bg-[#fb792b] text-white shadow-md"
                  : "text-white/85 hover:text-white hover:bg-white/10"
              }`}
              title="Mutual Passenger Berth Swapping (Feature IRCTC Does Not Have)"
            >
              <ArrowLeftRight className="w-4 h-4 text-cyan-300" />
              <span>Berth Swap</span>
              <span className="text-[9px] bg-cyan-400 text-slate-900 font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                New
              </span>
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === "ai"
                  ? "bg-gradient-to-r from-[#fb792b] to-purple-600 text-white shadow-md"
                  : "text-white/85 hover:text-white hover:bg-white/10"
              }`}
              title="Google Gemini AI Travel Copilot & Internet Knowledge"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>AI Copilot</span>
              <span className="text-[9px] bg-purple-500 text-white font-black px-1.5 py-0.2 rounded-full uppercase">
                Gemini
              </span>
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === "bookings"
                  ? "bg-[#fb792b] text-white shadow-md"
                  : "text-white/85 hover:text-white hover:bg-white/10"
              }`}
            >
              <Ticket className="w-4 h-4 text-amber-300" />
              <span>My Tickets</span>
            </button>

            {onOpenTteTerminal && (
              <button
                type="button"
                onClick={() => onOpenTteTerminal()}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 shadow-md active:scale-95"
                title="Open Official CRIS TTE Ticket Scanner & Handheld Terminal"
              >
                <UserCheck className="w-4 h-4 text-emerald-200" />
                <span>TTE Check</span>
              </button>
            )}

            {/* IRCTC Login / Register Profile Button (Desktop) */}
            {onOpenAuth && (
              currentUser ? (
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenAuth("profile")}
                    className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">
                      {currentUser.firstName ? currentUser.firstName.charAt(0) : "U"}
                    </div>
                    <span className="truncate max-w-[110px]">{currentUser.firstName || currentUser.fullName}</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-mono font-bold">KYC ✓</span>
                  </button>

                  {onLogout && (
                    <button
                      type="button"
                      onClick={onLogout}
                      className="p-2 bg-white/10 hover:bg-red-500/20 hover:border-red-400 text-slate-200 hover:text-red-300 border border-white/20 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all"
                      title="Lock IRCTC Session & Exit"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden lg:inline text-[11px]">Lock</span>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAuth("login")}
                  className="px-3.5 py-2 bg-[#fb792b] hover:bg-[#e06518] text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center space-x-1.5 shadow-md transition-transform active:scale-95 whitespace-nowrap"
                >
                  <User className="w-4 h-4" />
                  <span>Login / Register</span>
                </button>
              )
            )}
          </nav>

          {/* Mobile Right Controls: Compact TTE & Login / Profile */}
          <div className="md:hidden flex items-center space-x-1.5">
            {onOpenTteTerminal && (
              <button
                type="button"
                onClick={() => onOpenTteTerminal()}
                className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shadow-sm active:scale-90"
                title="TTE QR Scan"
              >
                <UserCheck className="w-4 h-4" />
                <span className="text-[11px]">TTE</span>
              </button>
            )}

            {onOpenAuth && (
              currentUser ? (
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => onOpenAuth("profile")}
                    className="p-1.5 bg-white/15 border border-white/25 rounded-xl text-xs font-bold flex items-center space-x-1 text-white active:scale-90"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black">
                      {currentUser.firstName ? currentUser.firstName.charAt(0) : "U"}
                    </div>
                  </button>

                  {onLogout && (
                    <button
                      type="button"
                      onClick={onLogout}
                      className="p-1.5 bg-white/10 border border-white/25 rounded-xl text-xs text-amber-300 active:scale-90"
                      title="Lock App"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAuth("login")}
                  className="px-2.5 py-1.5 bg-[#fb792b] hover:bg-[#e06518] text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-sm active:scale-90"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
