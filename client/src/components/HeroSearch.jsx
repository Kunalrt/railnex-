import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeftRight,
  Calendar,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Zap,
  ArrowRight,
  Bot,
  Send,
  RefreshCw,
  SlidersHorizontal
} from "lucide-react";

export default function HeroSearch({ onSearch, loading, initialFrom = "RNC", initialTo = "HWH" }) {
  const [fromQuery, setFromQuery] = useState(initialFrom);
  const [toQuery, setToQuery] = useState(initialTo);
  const [fromStations, setFromStations] = useState([]);
  const [toStations, setToStations] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // Gemini Smart Natural Language Search state
  const [aiSearchPrompt, setAiSearchPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const getTomorrowStr = (offsetDays = 1) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split("T")[0];
  };

  const [date, setDate] = useState(getTomorrowStr(1));
  const [quota, setQuota] = useState("GENERAL");
  const [travelClass, setTravelClass] = useState("ALL");

  const fromRef = useRef(null);
  const toRef = useRef(null);

  const searchStations = async (query, setFn) => {
    try {
      const res = await fetch(`/api/stations?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setFn(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (showFromDropdown) searchStations(fromQuery, setFromStations);
  }, [fromQuery, showFromDropdown]);

  useEffect(() => {
    if (showToDropdown) searchStations(toQuery, setToStations);
  }, [toQuery, showToDropdown]);

  const handleSwap = () => {
    const temp = fromQuery;
    setFromQuery(toQuery);
    setToQuery(temp);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!fromQuery || !toQuery) return;
    onSearch({
      from: fromQuery.trim(),
      to: toQuery.trim(),
      date,
      quota,
      travelClass
    });
  };

  // Execute Natural Language Search via Gemini AI
  const handleAiSmartSearch = async (promptText = aiSearchPrompt) => {
    const query = String(promptText).trim();
    if (!query || aiLoading) return;

    setAiLoading(true);
    setAiMessage("");

    try {
      const res = await fetch("/api/ai/smart-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const fromCode = data.fromStation?.code || data.parsed?.fromCode || "RNC";
        const toCode = data.toStation?.code || data.parsed?.toCode || "HWH";
        const newDate = data.parsed?.date || date;
        const newQuota = data.parsed?.quota || "GENERAL";
        const newClass = data.parsed?.travelClass || "ALL";

        setFromQuery(fromCode);
        setToQuery(toCode);
        setDate(newDate);
        setQuota(newQuota);
        setTravelClass(newClass);

        setAiMessage(
          `✨ Gemini AI understood: ${data.fromStation?.name || fromCode} ➔ ${data.toStation?.name || toCode} (${newQuota} quota on ${newDate})`
        );

        onSearch({
          from: fromCode,
          to: toCode,
          date: newDate,
          quota: newQuota,
          travelClass: newClass
        });
      } else {
        setAiMessage("⚠️ Could not parse query. Please try standard station search.");
      }
    } catch {
      setAiMessage("⚠️ Network error communicating with Gemini AI.");
    } finally {
      setAiLoading(false);
    }
  };

  const quickRoutes = [
    { from: "RNC", to: "HWH", label: "⚡ Ranchi ➔ Howrah (Vande Bharat)" },
    { from: "RNC", to: "NDLS", label: "⚡ Ranchi ➔ Delhi (Rajdhani)" },
    { from: "RNC", to: "PNBE", label: "Ranchi ➔ Patna" },
    { from: "TATA", to: "NDLS", label: "Tatanagar ➔ Delhi" },
    { from: "DHN", to: "MAS", label: "Dhanbad ➔ Chennai" },
    { from: "JSME", to: "NDLS", label: "Jasidih ➔ Delhi" },
    { from: "NDLS", to: "MMCT", label: "Delhi ➔ Mumbai" },
    { from: "NDLS", to: "BSB", label: "Delhi ➔ Varanasi" }
  ];

  const smartAiPrompts = [
    "⚡ Morning Vande Bharat to Patna",
    "🚄 Fastest train from Ranchi to Delhi",
    "🌙 Overnight sleeper to Howrah",
    "🎯 Delhi to Mumbai with 2A AC",
    "🎟️ Tatkal quota from Patna to Kolkata"
  ];

  return (
    <div className="bg-[#f4f6fa] border-b border-slate-200 text-slate-800 pt-7 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Simple IRCTC Header Headline */}
        <div className="text-center max-w-3xl mx-auto mb-3">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-3.5 py-1 text-xs text-[#213d77] font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#fb792b]" />
            <span>Google Gemini AI & Official CRIS PRS Reservation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#213d77] mb-2 leading-tight">
            Next-Gen Rail Booking with <span className="text-[#fb792b]">AI Precision</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminates 10:00 AM Tatkal freezes, delivers genuine Indian Railways schedules across all routes with Google Gemini AI intelligence, and guarantees confirmed seats.
          </p>

          {/* 4 Pillars Strip */}
          <div className="mt-3 flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-[11px] text-slate-700">
            <span className="flex items-center space-x-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real Schedules & Live Radars</span>
            </span>
            <span className="flex items-center space-x-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gemini AI Confirmation Meter</span>
            </span>
            <span className="flex items-center space-x-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Anti-Agent Script Shield</span>
            </span>
            <span className="flex items-center space-x-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Timeout Settlement</span>
            </span>
          </div>
        </div>

        {/* Gemini AI Smart Search Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-[#213d77] to-indigo-900 p-3 sm:p-4 rounded-2xl text-white shadow-md border border-blue-800">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 shrink-0">
              <Bot className="w-4 h-4 text-[#fb792b] animate-bounce" />
              <span>GEMINI AI PROMPT SEARCH:</span>
            </div>

            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={aiSearchPrompt}
                onChange={(e) => setAiSearchPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAiSmartSearch();
                  }
                }}
                placeholder="Ask in natural language e.g. 'Fastest train from Ranchi to Delhi tomorrow morning'..."
                className="w-full bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-300 focus:placeholder:text-slate-400 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold outline-none border border-white/20 focus:border-amber-400 transition-all"
              />
            </div>

            <button
              type="button"
              onClick={() => handleAiSmartSearch()}
              disabled={aiLoading || !aiSearchPrompt.trim()}
              className="w-full sm:w-auto px-4 py-2 bg-[#fb792b] hover:bg-[#e06518] disabled:bg-slate-700 text-white font-black text-xs rounded-xl shadow flex items-center justify-center space-x-1.5 transition-transform active:scale-95 shrink-0"
            >
              {aiLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{aiLoading ? "Gemini Parsing..." : "Ask Gemini AI"}</span>
            </button>
          </div>

          {/* Quick AI Prompts & Confirmation Feedback */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-300 font-medium">Try:</span>
              {smartAiPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAiSearchPrompt(p);
                    handleAiSmartSearch(p);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-slate-100 hover:text-white px-2 py-0.5 rounded-lg transition-colors border border-white/10"
                >
                  {p}
                </button>
              ))}
            </div>

            {aiMessage && (
              <span className="text-emerald-300 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                {aiMessage}
              </span>
            )}
          </div>
        </div>

        {/* Clean IRCTC White Search Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Origin, Swap, Destination, Date */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* From Station */}
              <div className="md:col-span-4 relative" ref={fromRef}>
                <label className="block text-[11px] font-bold text-[#213d77] mb-1 tracking-wider uppercase">
                  FROM STATION OR CITY
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#213d77]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={fromQuery}
                    onChange={(e) => {
                      setFromQuery(e.target.value);
                      setShowFromDropdown(true);
                    }}
                    onFocus={() => setShowFromDropdown(true)}
                    placeholder="Station name, city, or code (e.g. Ranchi, Delhi, RNC)"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-extrabold text-sm outline-none focus:bg-white focus:border-[#213d77] focus:ring-1 focus:ring-[#213d77] uppercase transition-all"
                    required
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showFromDropdown && fromStations.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 divide-y divide-slate-100">
                    {fromStations.map((st) => (
                      <div
                        key={st.code}
                        onMouseDown={() => {
                          setFromQuery(st.code);
                          setShowFromDropdown(false);
                        }}
                        className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex justify-between items-center transition-colors text-xs"
                      >
                        <div>
                          <span className="font-extrabold text-[#213d77]">{st.code}</span>
                          <span className="text-slate-800 ml-2 font-medium">{st.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {st.city}, {st.state}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex justify-center -my-2 md:my-0">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-9 h-9 rounded-full bg-[#213d77] hover:bg-[#1b3260] text-white flex items-center justify-center transition-all duration-300 shadow-md active:scale-90"
                  title="Swap Origin and Destination"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* To Station */}
              <div className="md:col-span-4 relative" ref={toRef}>
                <label className="block text-[11px] font-bold text-[#213d77] mb-1 tracking-wider uppercase">
                  TO STATION OR CITY
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#fb792b]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={toQuery}
                    onChange={(e) => {
                      setToQuery(e.target.value);
                      setShowToDropdown(true);
                    }}
                    onFocus={() => setShowToDropdown(true)}
                    placeholder="Station name, city, or code (e.g. Howrah, Patna, HWH)"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-extrabold text-sm outline-none focus:bg-white focus:border-[#213d77] focus:ring-1 focus:ring-[#213d77] uppercase transition-all"
                    required
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showToDropdown && toStations.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 divide-y divide-slate-100">
                    {toStations.map((st) => (
                      <div
                        key={st.code}
                        onMouseDown={() => {
                          setToQuery(st.code);
                          setShowToDropdown(false);
                        }}
                        className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex justify-between items-center transition-colors text-xs"
                      >
                        <div>
                          <span className="font-extrabold text-[#fb792b]">{st.code}</span>
                          <span className="text-slate-800 ml-2 font-medium">{st.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {st.city}, {st.state}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Journey Date */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-[#213d77] mb-1 tracking-wider uppercase">
                  JOURNEY DATE
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-extrabold text-sm outline-none focus:bg-white focus:border-[#213d77] focus:ring-1 focus:ring-[#213d77] transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Quota Selection & Class Filter */}
            <div className="pt-3 border-t border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Quota Chips */}
              <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
                <span className="text-xs text-slate-600 font-bold mr-1 uppercase">QUOTA:</span>
                {[
                  { id: "GENERAL", label: "General" },
                  { id: "TATKAL", label: "⚡ Tatkal (Anti-Bot)", highlight: true },
                  { id: "LADIES", label: "Ladies" },
                  { id: "SENIOR", label: "Senior Citizen" }
                ].map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setQuota(q.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      quota === q.id
                        ? q.highlight
                          ? "bg-[#fb792b] text-white shadow-sm"
                          : "bg-[#213d77] text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Date Shortcuts & Class Dropdown */}
              <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setDate(getTomorrowStr(0))}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium ${
                      date === getTomorrowStr(0)
                        ? "bg-[#213d77] text-white border-[#213d77]"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setDate(getTomorrowStr(1))}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium ${
                      date === getTomorrowStr(1)
                        ? "bg-[#213d77] text-white border-[#213d77]"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Tomorrow
                  </button>
                </div>

                {/* Class dropdown */}
                <select
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                  className="bg-white border border-slate-300 text-xs text-slate-800 rounded-xl px-3 py-2 font-bold focus:ring-1 focus:ring-[#213d77] outline-none"
                >
                  <option value="ALL">All Classes</option>
                  <option value="1A">AC First Class (1A)</option>
                  <option value="2A">AC 2 Tier (2A)</option>
                  <option value="3A">AC 3 Tier (3A)</option>
                  <option value="CC">AC Chair Car (CC)</option>
                  <option value="EC">Exec Chair Car (EC)</option>
                  <option value="SL">Sleeper (SL)</option>
                  <option value="2S">Second Sitting (2S)</option>
                </select>

                {/* Official IRCTC Orange Search CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#fb792b] hover:bg-[#e56517] disabled:bg-slate-300 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center space-x-2 transition-transform active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>{loading ? "SEARCHING..." : "SEARCH TRAINS"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Quick Corridor Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-bold mr-1">Popular Indian Corridors:</span>
          {quickRoutes.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setFromQuery(r.from);
                setToQuery(r.to);
                onSearch({
                  from: r.from,
                  to: r.to,
                  date,
                  quota,
                  travelClass
                });
              }}
              className="bg-white hover:bg-blue-50 border border-slate-200 hover:border-[#213d77] text-slate-700 hover:text-[#213d77] px-2.5 py-1 rounded-lg transition-colors font-medium shadow-2xs"
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
