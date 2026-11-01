import React, { useState } from "react";
import { Search, Train, CheckCircle2, AlertCircle, RefreshCw, XCircle, ShieldCheck, Sparkles, Clock, AlertTriangle, Lightbulb } from "lucide-react";

export default function PnrEnquiry({ onCancelTicketSuccess }) {
  const [pnrInput, setPnrInput] = useState("");
  const [pnrData, setPnrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancellationResult, setCancellationResult] = useState(null);

  // Gemini AI Prediction state
  const [aiPrediction, setAiPrediction] = useState(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  const fetchAiPrediction = async (booking) => {
    setLoadingPrediction(true);
    try {
      const res = await fetch("/api/ai/pnr-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingDetails: booking })
      });
      const data = await res.json();
      if (res.ok && data.prediction) {
        setAiPrediction(data.prediction);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPrediction(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const cleanPnr = pnrInput.replace(/\D/g, "");
    if (cleanPnr.length !== 10) {
      setError("Invalid PNR: Exactly 10 numeric digits are required for Indian Railways PNR enquiry.");
      return;
    }

    setLoading(true);
    setError("");
    setCancellationResult(null);
    setAiPrediction(null);

    try {
      const res = await fetch(`/api/pnr/${encodeURIComponent(cleanPnr)}`);
      const data = await res.json();
      if (res.ok && data.booking) {
        setPnrData(data.booking);
        fetchAiPrediction(data.booking);
      } else {
        setError("No booking found for this PNR in Indian Railways PRS database. Please verify the 10-digit number.");
      }
    } catch (err) {
      setError("Failed to fetch PNR status from railway servers.");
    } finally {
      setLoading(false);
    }
  };

  const handlePnrChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPnrInput(digitsOnly);
    if (error) setError("");
  };

  const handleCancelBooking = async () => {
    if (!window.confirm("Are you sure you want to cancel this ticket? Instant refund will be processed to original source.")) {
      return;
    }

    try {
      const res = await fetch("/api/booking/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pnr: pnrData.pnr })
      });
      const data = await res.json();
      if (res.ok) {
        setCancellationResult(data.refundDetails);
        setPnrData({
          ...pnrData,
          status: "CANCELLED",
          passengers: pnrData.passengers.map(p => ({ ...p, currentStatus: "CANCELLED" }))
        });
        if (onCancelTicketSuccess) onCancelTicketSuccess(pnrData.pnr);
      } else {
        alert(data.error || "Failed to cancel ticket");
      }
    } catch (e) {
      alert("Error processing cancellation");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-1.5 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold text-[#213d77] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#fb792b]" />
          <span>Google Gemini AI & Indian Railways PRS Enquiry</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#213d77] tracking-tight">
          Passenger Current Status (PNR Enquiry)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Enter your 10-digit Indian Railways PNR to check real-time confirmation status, coach, berth allocation, and Gemini AI confirmation predictions.
        </p>
      </div>

      {/* PNR Search Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-md mb-6">
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={pnrInput}
                onChange={handlePnrChange}
                placeholder="Enter 10-Digit PNR Number (e.g. 2458910243)"
                className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-base font-black tracking-widest focus:ring-2 focus:ring-[#213d77] focus:bg-white outline-none transition-all"
                required
              />
              <span className={`absolute right-3 top-3.5 text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                pnrInput.length === 10
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-200 text-slate-600"
              }`}>
                {pnrInput.length}/10
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || pnrInput.length !== 10}
              className="px-8 py-3.5 bg-[#fb792b] hover:bg-[#e06518] disabled:bg-slate-300 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{loading ? "Checking PRS..." : "GET PNR STATUS"}</span>
            </button>
          </div>

          {/* Validation Hint */}
          <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
            <span>
              {pnrInput.length === 10 ? (
                <span className="text-emerald-700 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ready to query CRIS Reservation Server</span>
                </span>
              ) : (
                <span>* Exactly 10 numeric digits required ({10 - pnrInput.length} more needed)</span>
              )}
            </span>
            <span className="hidden sm:inline">Printed on top-left of e-Ticket</span>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}
      </div>

      {/* Cancellation Notice Banner */}
      {cancellationResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 text-emerald-900 animate-scaleIn">
          <div className="flex items-center space-x-2 font-bold text-base text-emerald-800 mb-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Ticket Cancelled & Instant Refund Processed!</span>
          </div>
          <div className="text-xs space-y-1 text-emerald-800">
            <div>PNR: <strong>{cancellationResult.pnr}</strong></div>
            <div>Original Fare: ₹{cancellationResult.totalFare} | Clerkage Charge: ₹{cancellationResult.deduction}</div>
            <div className="text-sm font-black text-emerald-950">Refund Credited: ₹{cancellationResult.refundAmount}</div>
            <div className="text-emerald-700 italic">Timeline: {cancellationResult.refundEta}</div>
          </div>
        </div>
      )}

      {/* PNR Results Card */}
      {pnrData && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-6 animate-scaleIn">
          {/* Top Status */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs text-slate-400 font-mono">PNR NUMBER</span>
              <h3 className="text-2xl font-mono font-black text-slate-900 tracking-wider">
                {pnrData.pnr}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                pnrData.status === "CONFIRMED"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}>
                {pnrData.status}
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
                {pnrData.chartStatus}
              </span>
            </div>
          </div>

          {/* Gemini AI Prediction Banner */}
          {loadingPrediction ? (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center space-x-3 text-xs text-[#213d77]">
              <RefreshCw className="w-4 h-4 animate-spin text-[#fb792b]" />
              <span>Google Gemini AI is analyzing CRIS PRS chart preparation trends & confirmation probability...</span>
            </div>
          ) : aiPrediction ? (
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-blue-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-300">
                  <Sparkles className="w-4 h-4 text-[#fb792b]" />
                  <span>Google Gemini AI • Seat Confirmation Intelligence</span>
                </div>
                <span className="font-mono text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                  ● {aiPrediction.verdict || "HIGH_CHANCE"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-300">Predicted Confirmation Odds:</span>
                    <span className="font-mono text-lg font-black text-emerald-400">
                      {aiPrediction.confirmationProbability}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {aiPrediction.explanation}
                  </p>
                </div>

                <div className="shrink-0 flex items-center space-x-2 bg-black/30 px-3 py-2 rounded-lg text-xs font-mono">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Expected Delay: <strong>{aiPrediction.expectedDelayMinutes || 0} mins</strong></span>
                </div>
              </div>

              {aiPrediction.travelTips && aiPrediction.travelTips.length > 0 && (
                <div className="flex items-start space-x-2 text-xs text-slate-300 pt-1">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>AI Travel Tip:</strong> {aiPrediction.travelTips.join(" • ")}</span>
                </div>
              )}
            </div>
          ) : null}

          {/* Train & Journey */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-xs text-slate-700">
            <div>
              <span className="text-slate-400 block font-semibold">TRAIN INFO</span>
              <span className="text-sm font-bold text-slate-900">{pnrData.trainName} (#{pnrData.trainNumber})</span>
              <span className="block text-slate-500">Class: {pnrData.travelClass} • Quota: {pnrData.quota}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold">ROUTE</span>
              <span className="text-sm font-bold text-slate-900">{pnrData.from?.name || pnrData.from?.code} ➔ {pnrData.to?.name || pnrData.to?.code}</span>
              <span className="block text-slate-500">Journey Date: {pnrData.date}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold">BOOKING RECORD</span>
              <span className="text-sm font-bold text-slate-900">Total Fare: ₹{pnrData.fare?.totalFare || 1250}</span>
              <span className="block text-emerald-600 font-medium">Protected by Anti-Agent Engine</span>
            </div>
          </div>

          {/* Passenger Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              PASSENGER CURRENT STATUS:
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Passenger</th>
                    <th className="py-2.5 px-3">Booking Status</th>
                    <th className="py-2.5 px-3">Current Status</th>
                    <th className="py-2.5 px-3">Coach / Seat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pnrData.passengers.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{p.name} ({p.age}, {p.gender})</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{p.bookingStatus || "CNF"}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{p.currentStatus}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-orange-600">
                        {p.coach ? `${p.coach} / Seat #${p.seatNumber} (${p.allocatedBerth})` : "Assigned"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          {pnrData.status === "CONFIRMED" && (
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancelBooking}
                className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs transition-colors border border-red-200 flex items-center space-x-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Ticket & Get Instant Refund</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
