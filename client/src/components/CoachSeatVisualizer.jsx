import React from "react";
import { User, CheckCircle, Shield } from "lucide-react";

export default function CoachSeatVisualizer({ travelClass = "3A", allocatedSeat = 24, coachNumber = "B2" }) {
  // Generate sample bay of 8 berths for 3A/SL or 4 berths for 2A/CC
  const baySeats = [
    { num: 21, code: "LB", label: "Lower" },
    { num: 22, code: "MB", label: "Middle" },
    { num: 23, code: "UB", label: "Upper" },
    { num: 24, code: "LB", label: "Lower" },
    { num: 25, code: "MB", label: "Middle" },
    { num: 26, code: "UB", label: "Upper" },
    { num: 27, code: "SL", label: "Side Lower" },
    { num: 28, code: "SU", label: "Side Upper" }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-sm text-amber-400">Coach {coachNumber}</span>
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
            Class {travelClass}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-emerald-400">
          <Shield className="w-3.5 h-3.5" />
          <span>Fair Priority Allocation</span>
        </div>
      </div>

      <div className="text-xs text-slate-400 mb-3">
        Bay Layout (Seats 21 - 28) • Your confirmed berth is highlighted in emerald:
      </div>

      {/* 2D Coupe / Bay Representation */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
        <div className="grid grid-cols-3 gap-2">
          {/* Main 6 Berths (Left & Right facing) */}
          <div className="col-span-2 grid grid-cols-2 gap-2 border-r border-dashed border-slate-800 pr-2">
            {baySeats.slice(0, 6).map((seat) => {
              const isUserSeat = seat.num === allocatedSeat;
              return (
                <div
                  key={seat.num}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    isUserSeat
                      ? "bg-emerald-600/30 border-emerald-500 ring-2 ring-emerald-500/50"
                      : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-white flex items-center justify-center space-x-1">
                    <span>Seat #{seat.num}</span>
                    {isUserSeat && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">{seat.code} • {seat.label}</div>
                  {isUserSeat && (
                    <span className="text-[9px] bg-emerald-500 text-slate-950 font-bold px-1.5 rounded mt-1 inline-block">
                      YOUR BERTH
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Side Berths */}
          <div className="col-span-1 flex flex-col justify-between space-y-2">
            {baySeats.slice(6, 8).map((seat) => {
              const isUserSeat = seat.num === allocatedSeat;
              return (
                <div
                  key={seat.num}
                  className={`p-2 rounded-lg border text-center transition-all flex-1 flex flex-col justify-center ${
                    isUserSeat
                      ? "bg-emerald-600/30 border-emerald-500 ring-2 ring-emerald-500/50"
                      : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-white flex items-center justify-center space-x-1">
                    <span>Seat #{seat.num}</span>
                    {isUserSeat && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">{seat.code} • {seat.label}</div>
                  {isUserSeat && (
                    <span className="text-[9px] bg-emerald-500 text-slate-950 font-bold px-1.5 rounded mt-1 inline-block">
                      YOUR BERTH
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
