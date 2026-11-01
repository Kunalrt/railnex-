import React, { useState, useEffect } from "react";
import { Ticket, Train, Calendar, User, Printer, XCircle, ArrowRight, ShieldCheck, QrCode, UserCheck } from "lucide-react";

export default function MyBookings({ onSelectTicketForPrint, onGoToSearch, onOpenTteTerminal }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets");
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCancel = async (pnr) => {
    if (!window.confirm(`Are you sure you want to cancel PNR ${pnr}? Instant refund will be processed.`)) return;

    try {
      const res = await fetch("/api/booking/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pnr })
      });
      if (res.ok) {
        alert("Ticket cancelled successfully! Instant refund initiated.");
        fetchTickets();
      }
    } catch (e) {
      alert("Failed to cancel ticket");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Booked Rail Tickets
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Confirmed e-tickets booked via the NexGen Anti-Agent Reservation Engine.
          </p>
        </div>
        <button
          onClick={onGoToSearch}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 transition-transform active:scale-95 shadow-md shadow-orange-500/20"
        >
          <span>Book New Ticket</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading your tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto shadow-lg space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Bookings Found Yet</h3>
          <p className="text-xs text-slate-500">
            Search any station-to-station route above to experience instant confirmed booking with zero agent lag.
          </p>
          <button
            onClick={onGoToSearch}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-orange-500/20"
          >
            Start Booking Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((t) => (
            <div
              key={t.pnr}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                    <Train className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">
                      {t.trainName} (#{t.trainNumber})
                    </h4>
                    <span className="text-xs text-slate-500">
                      {t.from.code} ➔ {t.to.code} • Date: {t.date} • Class: {t.travelClass}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right mr-2">
                    <span className="text-[10px] text-slate-400 block font-mono">PNR</span>
                    <span className="text-base font-mono font-black text-orange-600">{t.pnr}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${
                    t.status === "CONFIRMED"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>

              {/* Passengers snapshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                {t.passengers.map((p, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-800 block">{p.name}</span>
                      <span className="text-slate-500">{p.age}y • {p.gender}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">{p.coach}</span>
                      <span className="font-mono font-bold text-emerald-700">Seat #{p.seatNumber}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500">
                  Fare Paid: <strong className="text-slate-900">₹{t.fare?.totalFare || 1250}</strong>
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onSelectTicketForPrint(t)}
                    className="px-3.5 py-2 bg-[#213d77] hover:bg-[#182c57] text-white font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View ERS Ticket & QR</span>
                  </button>

                  {onOpenTteTerminal && (
                    <button
                      onClick={() => onOpenTteTerminal(t.pnr)}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>TTE Inspection Check</span>
                    </button>
                  )}

                  {t.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleCancel(t.pnr)}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl border border-red-200 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
