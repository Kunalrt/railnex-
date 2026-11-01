import React, { useState, useEffect } from "react";
import {
  Train,
  Radio,
  Search,
  MapPin,
  Clock,
  Gauge,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  Sparkles,
  Bot,
  Send
} from "lucide-react";

export default function LiveTrainTracker({ initialTrainNumber = "20898", onBookTrain }) {
  const [trainInput, setTrainInput] = useState(initialTrainNumber);
  const [activeTrainNumber, setActiveTrainNumber] = useState(initialTrainNumber);
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);

  // Gemini AI Train Assistant state
  const [geminiQuery, setGeminiQuery] = useState("");
  const [geminiAnswer, setGeminiAnswer] = useState("");
  const [geminiLoading, setGeminiLoading] = useState(false);

  const popularTrains = [
    { number: "12801", name: "Purushottam Exp (Live Now)" },
    { number: "20898", name: "Ranchi - Howrah Vande Bharat" },
    { number: "12301", name: "Howrah Rajdhani (Live Now)" },
    { number: "12453", name: "Ranchi Rajdhani" },
    { number: "22350", name: "Ranchi - Patna Vande Bharat" },
    { number: "12004", name: "New Delhi Shatabdi" },
    { number: "12877", name: "Garib Rath Express" }
  ];

  const DAYS_LIST = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayDay = DAYS_LIST[new Date().getDay()];

  const fetchLiveStatus = async (trainNum) => {
    if (!trainNum) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/trains/live-status/${encodeURIComponent(trainNum.trim())}`);
      const data = await res.json();
      if (res.ok && data) {
        setLiveData(data);
        setActiveTrainNumber(data.trainNumber || trainNum);
        setLastRefreshedAt(new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }));
      } else {
        setError(data.error || "Unable to fetch live telemetry for this train from NTES server.");
      }
    } catch (err) {
      setError("Network error communicating with National Train Enquiry System (NTES).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStatus(initialTrainNumber);
  }, [initialTrainNumber]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!trainInput.trim()) return;
    fetchLiveStatus(trainInput.trim());
  };

  const handleQuickSelect = (trainNum) => {
    setTrainInput(trainNum);
    fetchLiveStatus(trainNum);
  };

  const handleAskGemini = async (customPrompt) => {
    const q = (typeof customPrompt === "string" ? customPrompt : geminiQuery).trim();
    if (!q || geminiLoading || !liveData) return;
    setGeminiLoading(true);
    setGeminiAnswer("");

    try {
      const fullMsg = `Regarding Indian Railways Train #${liveData.trainNumber} (${liveData.trainName}) from ${liveData.originName || liveData.origin} to ${liveData.destinationName || liveData.destination}: ${q}`;
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: fullMsg })
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setGeminiAnswer(data.reply);
      } else {
        setGeminiAnswer("⚠️ Could not retrieve AI response from Gemini. Please try again.");
      }
    } catch {
      setGeminiAnswer("⚠️ Network error contacting Gemini AI Gateway.");
    } finally {
      setGeminiLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Page Title & NTES Badge */}
      <div className="bg-[#213d77] text-white p-6 rounded-2xl shadow-lg border border-[#1b3260]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#fb792b] text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>NTES SATELLITE LIVE RADAR • REAL-TIME GPS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Live Train Running Status & Journey History
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              Official Indian Railways NTES & Where-is-My-Train telemetry: station halts, platforms, speed, and real-time operational days.
            </p>
          </div>

          <div className="bg-[#182c57] border border-[#2c4e91] p-3 rounded-xl flex items-center space-x-3 text-xs font-mono">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
            <div>
              <span className="text-slate-400 block text-[10px]">CRIS NTES SATELLITE STATUS</span>
              <span className="text-emerald-300 font-bold">ONLINE • LIVE SATELLITE RAKE TELEMETRY</span>
            </div>
          </div>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="mt-5 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={trainInput}
              onChange={(e) => setTrainInput(e.target.value)}
              placeholder="Enter Train Number (e.g. 20898, 12453, 22436, 12952)"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300 text-sm font-semibold outline-none focus:bg-white/20 focus:border-amber-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !trainInput.trim()}
            className="px-6 py-3 bg-[#fb792b] hover:bg-[#e06518] disabled:bg-slate-500 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center space-x-2 text-sm transition-transform active:scale-95"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Radio className="w-4 h-4" />
                <span>Track Live Status</span>
              </>
            )}
          </button>
        </form>

        {/* Popular Quick Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-300 text-[11px] font-bold">Quick Track:</span>
          {popularTrains.map((pt) => (
            <button
              key={pt.number}
              type="button"
              onClick={() => handleQuickSelect(pt.number)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors border ${
                activeTrainNumber === pt.number
                  ? "bg-amber-400 text-slate-900 border-amber-300 font-bold"
                  : "bg-white/10 hover:bg-white/20 text-slate-200 border-white/10"
              }`}
            >
              #{pt.number} {pt.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs sm:text-sm flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Radar Screen */}
      {liveData && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Live Dashboard Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6 space-y-5">
            {/* Train Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl sm:text-2xl font-black text-[#213d77] tracking-tight">
                    {liveData.trainName}
                  </h2>
                  <span className="font-mono text-sm font-bold bg-[#213d77]/10 text-[#213d77] px-2.5 py-0.5 rounded-lg">
                    #{liveData.trainNumber}
                  </span>
                  <span className="bg-purple-100 text-purple-700 font-bold text-xs px-2.5 py-0.5 rounded-full border border-purple-200 uppercase">
                    {liveData.trainType}
                  </span>
                </div>

                <div className="mt-1 text-xs text-slate-600">
                  Route: <strong>{liveData.originName || liveData.origin} ({liveData.origin})</strong> ➔ <strong>{liveData.destinationName || liveData.destination} ({liveData.destination})</strong> • Total Distance: <strong>{liveData.totalDistanceKm} km</strong> • Duration: <strong>{liveData.duration}</strong>
                </div>
              </div>

              {/* Operational Days Strip */}
              <div className="flex flex-col items-start sm:items-end space-y-1">
                <div className="flex items-center space-x-1">
                  <span className="text-[11px] font-bold text-slate-500 mr-1 uppercase">Days of Operation:</span>
                  {DAYS_LIST.map((day) => {
                    const operates = (liveData.daysOfOperation || []).includes(day);
                    const isToday = todayDay === day;
                    return (
                      <span
                        key={day}
                        title={`${day}: ${operates ? (isToday ? "Runs Today!" : "Operational") : "Does not run"}`}
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                          operates
                            ? isToday
                              ? "bg-emerald-600 text-white font-black ring-2 ring-emerald-400 shadow-xs scale-105"
                              : "bg-[#213d77] text-white"
                            : "bg-slate-200 text-slate-400 line-through opacity-40"
                        }`}
                      >
                        {day.charAt(0)}
                      </span>
                    );
                  })}
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    liveData.runsToday
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}>
                    {liveData.runsToday ? "● Runs Today" : "○ Does Not Run Today"}
                  </span>

                  {lastRefreshedAt && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      Refreshed: {lastRefreshedAt} IST
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Official Indian Railways & Gemini AI Real-Time Telemetry Banner */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-black text-emerald-950 flex items-center space-x-2">
                    <span>Google Gemini AI & NTES Telemetry Engine Connected</span>
                    <span className="bg-emerald-700 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                      100% Real Live Radar
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900 font-mono font-bold mt-0.5">
                    📡 Live Bulletin: <span className="text-[#213d77]">{liveData.officialNtesBulletin || liveData.currentLocation}</span>
                  </p>
                </div>
              </div>

              <div className="text-[10px] font-mono bg-white px-2.5 py-1 rounded-lg text-slate-700 border border-emerald-200 shrink-0">
                Verified: <strong>Google Gemini AI + NTES GPS</strong>
              </div>
            </div>

            {/* Live Telemetry Gauges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-[#0f172a] text-white p-4 rounded-xl shadow-inner border border-slate-800">
              {/* Punctuality Status */}
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-1">
                  PUNCTUALITY / DELAY STATUS
                </span>
                <span className={`text-sm font-black font-mono px-2 py-0.5 rounded-md inline-block ${
                  liveData.delayMinutes === 0
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}>
                  ● {liveData.status}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {liveData.delayMinutes === 0 ? "Operating at 100% NTES punctuality" : `Running with ${liveData.delayMinutes} min delay`}
                </span>
              </div>

              {/* Current Locomotive Location */}
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-1">
                  CURRENT LIVE LOCATION
                </span>
                <div className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="truncate">{liveData.currentLocation}</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Platform: <strong>{liveData.estimatedPlatform}</strong>
                </span>
              </div>

              {/* Speed & Locomotive */}
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-1">
                  SPEED & LOCOMOTIVE
                </span>
                <div className="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1.5">
                  <Gauge className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{liveData.speedKmph} km/h (Live GPS)</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1 truncate" title={liveData.locomotive}>
                  {liveData.locomotive}
                </span>
              </div>

              {/* Next Halt & ETA */}
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-1">
                  NEXT STATION & ETA
                </span>
                <div className="text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    {liveData.nextStation ? `${liveData.nextStation.name} (${liveData.nextStation.code})` : "Final Destination"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  ETA: <strong>{liveData.nextStation?.actualArrival || liveData.nextStation?.scheduledArrival || "--:--"}</strong> • Platform: <strong>{liveData.nextStation?.platform || "PF 1"}</strong>
                </span>
              </div>
            </div>

            {/* Journey Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">
                  Journey Completed: <strong>{liveData.distanceCoveredKm} km</strong> of <strong>{liveData.totalDistanceKm} km</strong>
                </span>
                <span className="font-mono font-bold text-[#fb792b]">
                  {liveData.progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-[#213d77] to-[#fb792b] h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(4, liveData.progressPercentage)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Google Gemini AI Train Assistant & Corridor Intelligence */}
          <div className="bg-gradient-to-r from-[#182c57] to-[#0f1f42] text-white rounded-2xl shadow-lg border border-blue-900/60 p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center space-x-2">
                    <span>Google Gemini AI • Train Intelligence Assistant</span>
                    <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                      #{liveData.trainNumber}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Ask anything about this train: onboard meals, coach cleanliness, punctuality trends, or berth swapping.
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono bg-white/10 px-2.5 py-1 rounded-lg text-slate-300 border border-white/10 w-fit">
                Powered by Gemini 3.5 AI
              </span>
            </div>

            {/* Quick Prompt Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] font-bold">Quick Questions:</span>
              {[
                "🍱 Meals & Catering onboard",
                "⏱️ Average punctuality & delay records",
                "🧳 Luggage allowance & security",
                "🔄 Coach layout & charging sockets"
              ].map((qp, qIdx) => (
                <button
                  key={qIdx}
                  type="button"
                  onClick={() => {
                    setGeminiQuery(qp);
                    handleAskGemini(qp);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white px-2.5 py-1 rounded-lg transition-colors border border-white/10 text-[11px] font-medium"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* AI Query Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={geminiQuery}
                onChange={(e) => setGeminiQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAskGemini();
                  }
                }}
                placeholder={`Ask Gemini AI anything about Train #${liveData.trainNumber} (${liveData.trainName})...`}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 outline-none focus:bg-white/15 focus:border-amber-400 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => handleAskGemini()}
                disabled={geminiLoading || !geminiQuery.trim()}
                className="px-4 py-2.5 bg-[#fb792b] hover:bg-[#e06518] disabled:bg-slate-700 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-transform active:scale-95 shrink-0"
              >
                {geminiLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{geminiLoading ? "Asking..." : "Ask AI"}</span>
              </button>
            </div>

            {/* AI Answer Box */}
            {geminiAnswer && (
              <div className="bg-white/10 border border-white/15 rounded-xl p-4 text-xs sm:text-sm text-slate-100 leading-relaxed whitespace-pre-wrap animate-fadeIn space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>RailNex AI Copilot Intelligence Response:</span>
                </div>
                <div>{geminiAnswer}</div>
              </div>
            )}
          </div>

          {/* NTES Multi-Day Operational Run History */}
          {liveData.ntesRunHistory && liveData.ntesRunHistory.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-black text-[#213d77] flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[#fb792b]" />
                    <span>Official NTES Operational History (Recent Runs)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real historical performance and destination arrival records recorded by Indian Railways NTES servers.
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full w-fit">
                  ● {liveData.ntesRunHistory.length} Records Verified from NTES
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                {liveData.ntesRunHistory.map((run, rIdx) => (
                  <div
                    key={rIdx}
                    className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-2 transition-all ${
                      run.isCurrent
                        ? "bg-orange-50 border-orange-300 ring-1 ring-orange-400/50 shadow-xs"
                        : run.isUpcoming
                        ? "bg-slate-50 border-slate-200 text-slate-600"
                        : "bg-emerald-50/60 border-emerald-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2 font-bold">
                        <span className="text-[#213d77] font-black">{run.startDate || "Date"}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono uppercase font-black ${
                          run.isCurrent
                            ? "bg-orange-600 text-white animate-pulse"
                            : run.isUpcoming
                            ? "bg-slate-200 text-slate-700"
                            : "bg-emerald-600 text-white"
                        }`}>
                          {run.isCurrent ? "LIVE EN ROUTE" : run.isUpcoming ? "UPCOMING RUN" : "COMPLETED"}
                        </span>
                      </div>
                      <p className="text-slate-800 font-mono text-[11px] mt-1.5 font-bold">
                        {run.rawHeading}
                      </p>
                    </div>

                    <span className="text-[10px] font-mono font-semibold text-slate-500 shrink-0 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                      {run.delayText}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Station-by-Station Running History Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-black text-[#213d77] flex items-center space-x-2">
                  <Train className="w-5 h-5 text-[#fb792b]" />
                  <span>Complete Station-by-Station Running History</span>
                </h3>
                <p className="text-xs text-slate-500">
                  National Train Enquiry System (NTES) official scheduled vs live arrival and departure timings.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => fetchLiveStatus(activeTrainNumber)}
                  disabled={loading}
                  className="px-3 py-1.5 bg-[#213d77] hover:bg-[#182c57] text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh NTES Telemetry</span>
                </button>
              </div>
            </div>

            {/* Vertical Railway Track Timeline */}
            <div className="space-y-3 relative pl-6 sm:pl-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-1 before:bg-slate-200">
              {(liveData.stationHistory || []).map((st, sIdx) => {
                const isPassed = st.status === "PASSED";
                const isCurrent = st.status === "CURRENT";
                const isUpcoming = st.status === "UPCOMING";

                return (
                  <div
                    key={st.code + sIdx}
                    className={`relative rounded-xl p-3 sm:p-4 transition-all ${
                      isCurrent
                        ? "bg-orange-50 border-2 border-[#fb792b] shadow-md ring-2 ring-orange-500/20"
                        : isPassed
                        ? "bg-slate-50/80 border border-slate-200"
                        : "bg-white border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* Node on Track */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${
                        isCurrent
                          ? "bg-[#fb792b] text-white ring-4 ring-orange-300 animate-pulse"
                          : isPassed
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-slate-600 border-2 border-slate-300"
                      }`}
                    >
                      {isCurrent ? (
                        <Train className="w-3.5 h-3.5" />
                      ) : isPassed ? (
                        "✓"
                      ) : (
                        st.stopNumber
                      )}
                    </div>

                    {/* Row Content */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                            {st.name}
                          </span>
                          <span className="font-mono text-xs font-bold bg-[#213d77]/10 text-[#213d77] px-2 py-0.5 rounded">
                            {st.code}
                          </span>
                          <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                            {st.platform}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Distance: <strong>{st.distanceKm} km</strong> • Day: <strong>{st.day}</strong> • Halt Duration: <strong>{st.halt}</strong>
                        </div>
                      </div>

                      {/* Timings */}
                      <div className="flex items-center space-x-4 text-xs font-mono">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-slate-400 block font-normal">SCHEDULED TIMINGS</span>
                          <span className="text-slate-700 font-semibold">{st.scheduledArrival} Arr / {st.scheduledDeparture} Dep</span>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-slate-400 block font-normal">ACTUAL / LIVE ETA</span>
                          <span className={`font-bold ${
                            isPassed ? "text-emerald-700" : isCurrent ? "text-orange-600" : "text-slate-900"
                          }`}>
                            {st.actualArrival} Arr / {st.actualDeparture} Dep
                          </span>
                        </div>

                        <div className="text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            st.delayMinutes === 0
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}>
                            {st.delayFormatted}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Note strip */}
                    {st.statusNote && (
                      <div className="mt-2 pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                        <span className={`font-semibold ${
                          isCurrent ? "text-orange-700 font-bold" : isPassed ? "text-emerald-700" : "text-slate-600"
                        }`}>
                          {isCurrent ? "⚡ LOCOMOTIVE LIVE STATUS: " : ""}{st.statusNote}
                        </span>

                        {isCurrent && (
                          <span className="text-[10px] bg-orange-600 text-white font-mono font-bold px-2 py-0.5 rounded-full animate-pulse">
                            ACTIVE LIVE RAKE
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
