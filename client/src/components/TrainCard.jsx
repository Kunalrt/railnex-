import React, { useState } from "react";
import { Train, Clock, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, Info, ChevronDown, ChevronUp, Radio, MapPin, Gauge, RefreshCw, Zap, Calendar } from "lucide-react";

export default function TrainCard({ train, quota, onSelectClassForBooking }) {
  const [selectedClass, setSelectedClass] = useState(() => {
    // Select first available class by default
    const keys = Object.keys(train.classes);
    return keys[0] || "3A";
  });
  const [showSchedule, setShowSchedule] = useState(false);
  const [showLiveStatus, setShowLiveStatus] = useState(false);
  const [liveStatusData, setLiveStatusData] = useState(null);
  const [loadingLive, setLoadingLive] = useState(false);

  const activeClassData = train.classes[selectedClass];

  const DAYS_LIST = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayDay = DAYS_LIST[new Date().getDay()];
  const runsToday = (train.daysOfOperation || []).includes(todayDay);
  const runsDaily = (train.daysOfOperation || []).length === 7;

  const fetchLiveStatusData = async () => {
    setLoadingLive(true);
    try {
      const res = await fetch(`/api/trains/live-status/${train.trainNumber}`);
      if (res.ok) {
        const data = await res.json();
        setLiveStatusData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLive(false);
    }
  };

  const handleToggleLiveStatus = () => {
    if (showLiveStatus) {
      setShowLiveStatus(false);
    } else {
      setShowLiveStatus(true);
      fetchLiveStatusData();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-[#f4f6fa] px-4 sm:px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#213d77]/10 text-[#213d77] flex items-center justify-center font-bold shrink-0">
            <Train className="w-5 h-5 text-[#213d77]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-[#213d77] text-base sm:text-lg tracking-tight">
                {train.trainName}
              </span>
              <span className="font-mono text-xs font-bold text-[#213d77] bg-[#213d77]/10 px-2 py-0.5 rounded">
                #{train.trainNumber}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                train.trainType === "VANDE BHARAT" 
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : train.trainType === "RAJDHANI"
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-blue-100 text-blue-700 border border-blue-200"
              }`}>
                {train.trainType}
              </span>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#fb792b]" />
                <span>Gemini AI Schedule</span>
              </span>
            </div>

            {/* IRCTC Authentic 7-Day Frequency Strip & Runs Today Badge */}
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-0.5">Runs:</span>
                {DAYS_LIST.map((day) => {
                  const operates = (train.daysOfOperation || []).includes(day);
                  const isCurrentDay = todayDay === day;
                  return (
                    <span
                      key={day}
                      title={`${day}: ${operates ? (isCurrentDay ? "Runs Today" : "Runs on this day") : "Does not run"}`}
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center text-[9px] sm:text-[10px] font-bold transition-transform ${
                        operates
                          ? isCurrentDay
                            ? "bg-emerald-600 text-white shadow-xs font-black ring-1 ring-emerald-400 scale-105"
                            : "bg-[#213d77] text-white"
                          : "bg-slate-200 text-slate-400 line-through opacity-45"
                      }`}
                    >
                      {day.charAt(0)}
                    </span>
                  );
                })}
              </div>

              <span className="text-slate-300">|</span>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                runsToday
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-slate-100 text-slate-500 border border-slate-200"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${runsToday ? "bg-emerald-600 animate-pulse" : "bg-slate-400"}`}></span>
                <span>{runsToday ? "Runs Today" : "Does Not Run Today"}</span>
              </span>

              {runsDaily && (
                <span className="text-[10px] text-slate-500 font-semibold hidden md:inline">
                  • Daily Service
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Toggles: Live Running Status & View Route */}
        <div className="flex items-center space-x-2">
          {/* Live Running Status Button */}
          <button
            type="button"
            onClick={handleToggleLiveStatus}
            className={`text-xs font-bold flex items-center space-x-1.5 py-1.5 px-3 rounded-xl border transition-all shadow-xs ${
              showLiveStatus
                ? "bg-emerald-700 text-white border-emerald-800 ring-2 ring-emerald-500/30"
                : "text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border-emerald-300"
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${showLiveStatus ? "text-white" : "text-emerald-600 animate-pulse"}`} />
            <span>{showLiveStatus ? "Hide Live GPS" : "Live Train Status"}</span>
          </button>

          {/* View Schedule toggle */}
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1 py-1.5 px-2.5 rounded-xl hover:bg-orange-50 transition-colors border border-transparent hover:border-orange-200"
          >
            <span>{showSchedule ? "Hide Route" : "View Halts"}</span>
            {showSchedule ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Live Running Status & Full Station History Card if Open */}
      {showLiveStatus && (
        <div className="bg-[#0f172a] text-white p-4 sm:p-5 border-b border-slate-800 text-xs animate-fadeIn space-y-4">
          {/* Telemetry Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black uppercase flex items-center space-x-1.5 ${
                liveStatusData?.delayMinutes === 0
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}>
                <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
                <span>● {liveStatusData?.status || "LIVE RADAR CONNECTED"}</span>
              </span>

              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                CRIS NTES Live GPS Tracking • IST: {liveStatusData?.queryTime || "Synchronized"}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={fetchLiveStatusData}
                disabled={loadingLive}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 font-bold rounded-lg text-[11px] flex items-center space-x-1.5 transition-colors border border-white/10"
                title="Refresh real-time GPS position from Indian Railways satellite feed"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingLive ? "animate-spin text-emerald-400" : ""}`} />
                <span>{loadingLive ? "Updating..." : "Refresh GPS"}</span>
              </button>
            </div>
          </div>

          {loadingLive && !liveStatusData ? (
            <div className="flex items-center justify-center space-x-2 py-8 text-slate-300">
              <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold">Connecting to Indian Railways NTES Real-Time Locomotive Satellite...</span>
            </div>
          ) : liveStatusData ? (
            <div className="space-y-4">
              {/* Telemetry Strip: Current Location, Speed, Platform, Progress */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">CURRENT LOCATION</span>
                  <div className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="truncate">{liveStatusData.currentLocation}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">SPEED & LOCOMOTIVE</span>
                  <div className="text-xs font-mono font-bold text-slate-200 flex items-center space-x-1.5">
                    <Gauge className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{liveStatusData.speedKmph} km/h • {liveStatusData.locomotive.split("(")[0]}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">NEXT HALT & ETA</span>
                  <div className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>
                      {liveStatusData.nextStation ? `${liveStatusData.nextStation.name} (${liveStatusData.nextStation.code}) @ ${liveStatusData.nextStation.actualArrival || liveStatusData.nextStation.scheduledArrival}` : "Approaching Destination"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">
                    JOURNEY PROGRESS ({liveStatusData.progressPercentage}%)
                  </span>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-[#fb792b] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, liveStatusData.progressPercentage)}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                    {liveStatusData.distanceCoveredKm} km of {liveStatusData.totalDistanceKm} km completed
                  </span>
                </div>
              </div>

              {/* Station-by-Station Running Track Timeline */}
              <div className="bg-slate-900/60 p-3 sm:p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-3 text-[11px]">
                  <span className="font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                    <Train className="w-3.5 h-3.5 text-[#fb792b]" />
                    <span>Station-by-Station Live Running History (NTES):</span>
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    Green: Passed • Pulsing: Live Locomotive • Slate: Upcoming
                  </span>
                </div>

                {/* Timeline vertical track */}
                <div className="space-y-3 relative pl-4 sm:pl-6 before:absolute before:left-2 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                  {(liveStatusData.stationHistory || []).map((st, sIdx) => {
                    const isPassed = st.status === "PASSED";
                    const isCurrent = st.status === "CURRENT";

                    return (
                      <div
                        key={st.code + sIdx}
                        className={`relative rounded-xl p-2.5 sm:p-3 transition-colors ${
                          isCurrent
                            ? "bg-slate-800/90 border-2 border-[#fb792b] shadow-lg"
                            : isPassed
                            ? "bg-slate-950/40 border border-slate-800/60 opacity-90"
                            : "bg-slate-950/60 border border-slate-800/40"
                        }`}
                      >
                        {/* Node Marker on track */}
                        <div
                          className={`absolute -left-4 sm:-left-6 top-3.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] ${
                            isCurrent
                              ? "bg-[#fb792b] text-white ring-4 ring-orange-500/30 font-black animate-pulse"
                              : isPassed
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-800 text-slate-400 border border-slate-600"
                          }`}
                        >
                          {isCurrent ? (
                            <Train className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          ) : isPassed ? (
                            "✓"
                          ) : (
                            st.stopNumber
                          )}
                        </div>

                        {/* Station Row Details */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                              {st.name}
                            </span>
                            <span className="font-mono text-xs font-bold text-orange-400 bg-orange-950/80 border border-orange-800/50 px-1.5 py-0.2 rounded">
                              {st.code}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {st.distanceKm} km
                            </span>
                            <span className="text-[10px] font-mono font-bold bg-white/10 px-1.5 py-0.2 rounded text-slate-300">
                              {st.platform}
                            </span>
                          </div>

                          <div className="flex items-center space-x-3 text-xs font-mono">
                            <div>
                              <span className="text-[10px] text-slate-400 block font-normal">SCHED ARR / DEP</span>
                              <span className="text-slate-300 font-semibold">{st.scheduledArrival} / {st.scheduledDeparture}</span>
                            </div>

                            <div>
                              <span className="text-[10px] text-slate-400 block font-normal">ACTUAL / ETA</span>
                              <span className={`font-bold ${
                                isPassed ? "text-emerald-400" : isCurrent ? "text-amber-300" : "text-slate-200"
                              }`}>
                                {st.actualArrival || st.scheduledArrival} / {st.actualDeparture || st.scheduledDeparture}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                st.delayMinutes === 0
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-amber-500/20 text-amber-300"
                              }`}>
                                {st.delayFormatted}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Note strip */}
                        {st.statusNote && (
                          <div className="mt-1.5 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                            <span className={`font-medium ${
                              isCurrent ? "text-amber-300 font-bold" : isPassed ? "text-emerald-400" : "text-slate-400"
                            }`}>
                              {isCurrent ? "⚡ LOCOMOTIVE POSITION: " : ""}{st.statusNote}
                            </span>
                            {st.halt !== "--" && (
                              <span className="text-[10px] text-slate-400">
                                Halt: {st.halt}
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
          ) : null}
        </div>
      )}

      {/* Timing and Route Segment */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Departure */}
          <div className="md:col-span-3 text-left">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-[#213d77] tracking-tight">
                {train.departureTime}
              </span>
              {liveStatusData && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                  liveStatusData.delayMinutes === 0
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-amber-100 text-amber-800 border border-amber-300"
                }`}>
                  {liveStatusData.delayMinutes === 0 ? "Right Time" : `+${liveStatusData.delayMinutes}m`}
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-slate-800">
              {train.origin}
            </div>
            <div className="text-xs text-slate-500">
              {train.route[0]?.name || train.origin}
            </div>
          </div>

          {/* Duration Graphic */}
          <div className="md:col-span-6 flex flex-col items-center justify-center">
            <div className="text-xs font-medium text-slate-500 flex items-center space-x-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{train.duration}</span>
              <span>•</span>
              <span>{train.distanceKm} km</span>
            </div>
            <div className="w-full flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-[#fb792b] bg-white"></div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#fb792b] via-amber-400 to-emerald-500 relative">
                <div className="absolute inset-x-0 -top-2 flex justify-center">
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full border border-slate-200">
                    {train.route.length - 2 > 0 ? `${train.route.length - 2} Intermediate Halts` : "Non-stop"}
                  </span>
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            </div>
          </div>

          {/* Arrival */}
          <div className="md:col-span-3 text-right">
            <div className="flex items-baseline justify-end space-x-2">
              <span className="text-2xl font-black text-[#213d77] tracking-tight">
                {train.arrivalTime}
              </span>
              {liveStatusData && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                  liveStatusData.delayMinutes === 0
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-amber-100 text-amber-800 border border-amber-300"
                }`}>
                  {liveStatusData.delayMinutes === 0 ? "ETA On Time" : `ETA +${liveStatusData.delayMinutes}m`}
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-slate-800">
              {train.destination}
            </div>
            <div className="text-xs text-slate-500">
              {train.route[train.route.length - 1]?.name || train.destination}
            </div>
          </div>
        </div>

        {/* Expandable Schedule / Route */}
        {showSchedule && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 animate-fadeIn">
            <div className="font-bold text-slate-900 mb-2">Station Halts & Timings:</div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 font-mono font-medium text-[11px]">
              {train.route.map((st, i) => (
                <div key={i} className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="font-bold text-orange-600">{st.code}</div>
                  <div className="text-[10px] text-slate-600 truncate">{st.name}</div>
                  <div className="text-slate-500 mt-1">Arr: {st.arrival}</div>
                  <div className="text-slate-900 font-bold">Dep: {st.departure}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Class Selection Grid */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            SELECT CLASS & VIEW CONFIRMATION CHANCE ({quota} QUOTA):
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {Object.entries(train.classes).map(([code, info]) => {
              const isSelected = selectedClass === code;
              const isAvailable = info.isAvailable;
              const confIntel = info.confirmationIntelligence;

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedClass(code)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? "border-orange-500 bg-orange-50/50 shadow-md ring-2 ring-orange-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-sm text-slate-900">{code}</span>
                    <span className="font-bold text-slate-900 text-sm">
                      ₹{info.effectiveFare}
                    </span>
                  </div>

                  {/* Availability Badge */}
                  <div className="mt-1">
                    {isAvailable ? (
                      <span className="inline-flex items-center text-xs font-extrabold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded">
                        AVL {info.displaySeats}
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        WL {info.displayWL}
                      </span>
                    )}
                  </div>

                  {/* Confirmation Score Pill */}
                  <div className="mt-1.5 flex items-center space-x-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      confIntel.score >= 85
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : confIntel.score >= 60
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                      {confIntel.score}% Confirm
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Smart AI Confirmation Suggestion Box if WL */}
        {activeClassData && !activeClassData.isAvailable && train.smartSuggestion && (
          <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl flex items-start space-x-3 text-xs">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900">
                {train.smartSuggestion.title}:{" "}
              </span>
              <span className="text-amber-800">
                {train.smartSuggestion.message}
              </span>
            </div>
          </div>
        )}

        {/* Bottom Booking Action Bar */}
        {activeClassData && (
          <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                Protected by <strong className="text-slate-800">Anti-Agent Token Shield</strong> • Instant Berth Allocation
              </span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-slate-500">Per Passenger</div>
                <div className="text-lg font-black text-slate-900">₹{activeClassData.effectiveFare}</div>
              </div>

              <button
                type="button"
                onClick={() => onSelectClassForBooking(train, selectedClass, activeClassData)}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#fb792b] hover:bg-[#e06518] text-white font-extrabold rounded-xl shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95 text-sm"
              >
                <span>{quota === "TATKAL" ? "⚡ BOOK TATKAL" : "BOOK TICKET"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
