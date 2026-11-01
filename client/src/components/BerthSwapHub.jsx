import React, { useState, useEffect } from "react";
import {
  ArrowLeftRight,
  Train,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  PlusCircle,
  ShieldCheck,
  UserCheck,
  MapPin,
  Clock,
  HeartHandshake,
  Info
} from "lucide-react";

export default function BerthSwapHub({ currentUser, onGoToSearch }) {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [myTickets, setMyTickets] = useState([]);

  // Form for creating a new swap request
  const [newSwap, setNewSwap] = useState({
    pnr: "",
    trainNumber: "20898",
    passengerName: currentUser?.fullName || "Kunal Sharma",
    currentCoach: "C2",
    currentSeat: "42",
    currentBerthType: "Window (W)",
    desiredBerthType: "Lower Berth (LB)",
    reason: "Traveling with senior citizen, require Lower Berth for mobility."
  });

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/berth-swap/list");
      const data = await res.json();
      if (res.ok && data.swaps) {
        setSwaps(data.swaps);
      }
    } catch {
      setError("Failed to fetch live berth swaps.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTickets = async () => {
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setMyTickets(data);
        const t = data[0];
        setNewSwap(prev => ({
          ...prev,
          pnr: t.pnr,
          trainNumber: t.trainNumber,
          passengerName: t.passengers?.[0]?.name || currentUser?.fullName || "Kunal Sharma",
          currentCoach: t.passengers?.[0]?.coach || "C2",
          currentSeat: String(t.passengers?.[0]?.seatNumber || 42),
          currentBerthType: t.passengers?.[0]?.allocatedBerth || "Window (W)"
        }));
      }
    } catch {}
  };

  useEffect(() => {
    fetchSwaps();
    fetchUserTickets();
  }, []);

  const handleCreateSwap = async (e) => {
    e.preventDefault();
    if (!newSwap.pnr || !newSwap.currentCoach || !newSwap.currentSeat) {
      setError("Please fill all required fields.");
      return;
    }
    setActionLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/berth-swap/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSwap)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(data.message);
        setShowCreateModal(false);
        fetchSwaps();
      } else {
        setError(data.error || "Failed to broadcast swap.");
      }
    } catch {
      setError("Network error broadcasting swap request.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptSwap = async (swap) => {
    if (!window.confirm(`Confirm exchange: Trade your berth with ${swap.passengerName} (Coach ${swap.currentCoach} Seat #${swap.currentSeat})? Both tickets will be digitally updated in CRIS PRS.`)) {
      return;
    }
    setActionLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/berth-swap/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          swapId: swap.id,
          myPnr: "2458910243",
          myPassengerName: currentUser?.fullName || "Rahul Kumar",
          myCoach: "C2",
          mySeat: 24,
          myBerthType: "Aisle (A)"
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(data.message);
        fetchSwaps();
      } else {
        setError(data.error || "Failed to accept swap.");
      }
    } catch {
      setError("Network error accepting berth swap.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Feature Banner: The Innovation IRCTC DOES NOT HAVE */}
      <div className="bg-gradient-to-r from-[#213d77] via-[#1b3260] to-[#0f1d3a] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-700 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#fb792b]/15 to-transparent pointer-events-none hidden md:block"></div>

        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#fb792b] text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>EXCLUSIVE RAILNEX INNOVATION • FEATURE IRCTC DOES NOT HAVE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Mutual In-Train <span className="text-[#fb792b]">Berth Swapping Hub</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            IRCTC allocates seats randomly, often splitting families across coaches or giving elderly passengers top berths. RailNex allows verified passengers on the same train to mutually request and exchange berths legally with instant digital CRIS PRS seat transfer.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-[#fb792b] hover:bg-[#e06518] text-white font-extrabold rounded-xl shadow-md text-xs sm:text-sm flex items-center space-x-2 transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Broadcast My Berth Swap</span>
            </button>

            <button
              type="button"
              onClick={fetchSwaps}
              disabled={loading}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-slate-200 font-bold rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 transition-colors border border-white/10"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Active Swaps</span>
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs sm:text-sm flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span className="font-semibold">{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs sm:text-sm flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Active Berth Swaps Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ArrowLeftRight className="w-5 h-5 text-[#fb792b]" />
            <h2 className="text-lg sm:text-xl font-black text-[#213d77]">
              Active Passenger Berth Swap Requests
            </h2>
          </div>
          <span className="text-xs font-mono font-bold bg-[#213d77]/10 text-[#213d77] px-2.5 py-1 rounded-lg">
            {swaps.length} Available Swaps
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#fb792b] animate-spin mx-auto" />
            <div className="text-sm font-bold text-slate-700">Connecting to PRS Berth Exchange Network...</div>
          </div>
        ) : swaps.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
            <HeartHandshake className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-extrabold text-base text-slate-800">No Open Swap Requests on this Train</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Be the first to list a berth swap request if you want a Lower Berth, Window Seat, or to sit closer to family!
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-[#213d77] text-white font-bold rounded-xl text-xs"
            >
              Create First Swap Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {swaps.map((swap) => {
              const isOpen = swap.status === "OPEN";

              return (
                <div
                  key={swap.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 transition-all ${
                    isOpen ? "border-slate-200 hover:shadow-md" : "border-emerald-200 bg-emerald-50/20"
                  }`}
                >
                  {/* Top Bar: Train & Status */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-[#213d77]/10 text-[#213d77] flex items-center justify-center font-bold">
                        <Train className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-[#213d77]">
                          Train #{swap.trainNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          PNR: {swap.pnr.slice(0, 3)}***{swap.pnr.slice(-3)}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isOpen
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    }`}>
                      {isOpen ? "● OPEN FOR SWAP" : "✓ SWAP ACCEPTED"}
                    </span>
                  </div>

                  {/* Visual Exchange: CURRENT SEAT ➔ DESIRED SEAT */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    {/* Current seat */}
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">OFFERING SEAT</span>
                      <div className="font-black text-[#213d77] text-sm">
                        Coach {swap.currentCoach}, Seat #{swap.currentSeat}
                      </div>
                      <span className="text-[11px] text-slate-600 font-medium">
                        {swap.currentBerthType}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#fb792b] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <ArrowLeftRight className="w-4 h-4" />
                    </div>

                    {/* Desired seat */}
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">WANTS IN RETURN</span>
                      <div className="font-black text-emerald-700 text-sm">
                        {swap.desiredBerthType}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Any Coach
                      </span>
                    </div>
                  </div>

                  {/* Passenger & Reason */}
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">
                        Passenger: {swap.passengerName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ID: {swap.id}
                      </span>
                    </div>
                    {swap.reason && (
                      <p className="text-[11px] italic text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                        "{swap.reason}"
                      </p>
                    )}
                  </div>

                  {/* Action CTA */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>CRIS PRS Verified</span>
                    </div>

                    {isOpen ? (
                      <button
                        type="button"
                        onClick={() => handleAcceptSwap(swap)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-transform active:scale-95"
                      >
                        <HeartHandshake className="w-4 h-4" />
                        <span>Accept & Trade Berth</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Berths Exchanged via RailNex</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE SWAP MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleIn">
            <div className="bg-[#213d77] text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-black text-base sm:text-lg">
                  Broadcast Berth Swap Request
                </h3>
                <p className="text-xs text-slate-200">
                  Notify fellow passengers on your train to exchange berths
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSwap} className="p-6 space-y-4">
              {/* Select Ticket */}
              <div>
                <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                  SELECT YOUR CONFIRMED BOOKING / PNR: *
                </label>
                {myTickets.length > 0 ? (
                  <select
                    value={newSwap.pnr}
                    onChange={(e) => {
                      const t = myTickets.find(x => x.pnr === e.target.value);
                      if (t) {
                        setNewSwap({
                          ...newSwap,
                          pnr: t.pnr,
                          trainNumber: t.trainNumber,
                          passengerName: t.passengers?.[0]?.name || "Kunal Sharma",
                          currentCoach: t.passengers?.[0]?.coach || "C2",
                          currentSeat: String(t.passengers?.[0]?.seatNumber || 42),
                          currentBerthType: t.passengers?.[0]?.allocatedBerth || "Window (W)"
                        });
                      } else {
                        setNewSwap({ ...newSwap, pnr: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    {myTickets.map(t => (
                      <option key={t.pnr} value={t.pnr}>
                        PNR {t.pnr} • Train #{t.trainNumber} ({t.from.code} ➔ {t.to.code})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    maxLength={10}
                    value={newSwap.pnr}
                    onChange={(e) => setNewSwap({ ...newSwap, pnr: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    placeholder="Enter 10-digit PNR"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                    required
                  />
                )}
              </div>

              {/* Current Seat details */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                    COACH:
                  </label>
                  <input
                    type="text"
                    value={newSwap.currentCoach}
                    onChange={(e) => setNewSwap({ ...newSwap, currentCoach: e.target.value.toUpperCase() })}
                    placeholder="e.g. C2, B1, S4"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                    SEAT NO:
                  </label>
                  <input
                    type="number"
                    value={newSwap.currentSeat}
                    onChange={(e) => setNewSwap({ ...newSwap, currentSeat: e.target.value })}
                    placeholder="e.g. 42"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                    OFFERING BERTH:
                  </label>
                  <select
                    value={newSwap.currentBerthType}
                    onChange={(e) => setNewSwap({ ...newSwap, currentBerthType: e.target.value })}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="Window (W)">Window</option>
                    <option value="Aisle (A)">Aisle</option>
                    <option value="Lower Berth (LB)">Lower Berth</option>
                    <option value="Middle Berth (MB)">Middle Berth</option>
                    <option value="Upper Berth (UB)">Upper Berth</option>
                    <option value="Side Lower (SL)">Side Lower</option>
                    <option value="Side Upper (SU)">Side Upper</option>
                  </select>
                </div>
              </div>

              {/* Desired Berth */}
              <div>
                <label className="block text-xs font-bold text-emerald-800 mb-1 uppercase">
                  WHAT BERTH DO YOU WANT IN RETURN? *
                </label>
                <select
                  value={newSwap.desiredBerthType}
                  onChange={(e) => setNewSwap({ ...newSwap, desiredBerthType: e.target.value })}
                  className="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900"
                >
                  <option value="Lower Berth (LB)">Lower Berth (LB) - Preferred for Elderly/Medical</option>
                  <option value="Window (W)">Window (W) - Scenic/Comfort</option>
                  <option value="Aisle (A)">Aisle (A) - Easy Corridor Exit</option>
                  <option value="Side Lower (SL)">Side Lower (SL) - Independent Seat</option>
                  <option value="Any Adjacent Berth">Any Adjacent Berth in Same Coach</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
                  REASON FOR SWAP (HELPS PASSENGERS AGREE):
                </label>
                <textarea
                  rows={2}
                  value={newSwap.reason}
                  onChange={(e) => setNewSwap({ ...newSwap, reason: e.target.value })}
                  placeholder="e.g. Traveling with pregnant spouse / senior citizen seeking Lower Berth."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#213d77]"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#fb792b] hover:bg-[#e06518] text-white font-extrabold rounded-xl text-xs flex items-center space-x-1.5 shadow-md"
                >
                  {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Broadcast Request</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
