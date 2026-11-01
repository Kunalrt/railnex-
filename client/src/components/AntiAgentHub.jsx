import React, { useState, useEffect } from "react";
import { ShieldCheck, Zap, Lock, AlertTriangle, CheckCircle2, Server, Cpu, Activity, Users, ShieldAlert, Sparkles, RefreshCw, XCircle } from "lucide-react";

export default function AntiAgentHub() {
  const [metrics, setMetrics] = useState({
    activeUsers: 8420,
    agentBotsBlocked: 1429,
    tatkalQueueProcessed: 3840,
    serverLatencyMs: 14,
    fairnessRating: "99.9%",
    instantConfirmationRate: "98.4%"
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/system/stats");
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 4000);
    return () => clearInterval(interval);
  }, []);

  const improvements = [
    {
      id: "tatkal-bots",
      title: "Tatkal Agent Bot Scalping",
      irctcProblem: "Commercial agents use automated extension scripts that submit passenger details in under 200ms, hoarding all Tatkal berths within 15 seconds.",
      railnexSolution: "Behavioral Entropy Engine flags any form submission under 350ms as a machine script and quarantines it instantly. Genuine human travelers get priority.",
      impact: "100% genuine passenger seat allocation; zero scalper hoarding."
    },
    {
      id: "server-crashes",
      title: "10:00 AM & 11:00 AM Server Crashes",
      irctcProblem: "Millions of concurrent requests hit the IRCTC server at Tatkal opening, resulting in '504 Gateway Timeout', session logouts, and payment crashes.",
      railnexSolution: "Virtual Waiting Room with Fair Token Queue buffers traffic gracefully. Each passenger is granted a 5-minute guaranteed seat reservation window.",
      impact: "Zero server drops; smooth, stress-free checkout even during extreme festive rush."
    },
    {
      id: "multi-account",
      title: "Agent Multi-Account & Multi-Tab Hoarding",
      irctcProblem: "Agents open 50+ browser tabs with different simulated user accounts to corner tickets across multiple trains.",
      railnexSolution: "1-Ticket-Per-Aadhaar Verification Lock ensures each government identity can only hold 1 active booking per 15-minute Tatkal window.",
      impact: "Completely eliminates commercial ticket hoarding and black market resale."
    },
    {
      id: "waitlist-uncertainty",
      title: "Waiting List Uncertainty (Will My Ticket Confirm?)",
      irctcProblem: "Passengers are left guessing whether a 'WL 18' ticket will confirm, often finding out only 4 hours before departure when the chart is prepared.",
      railnexSolution: "AI Confirmation Predictor calculates real-time probability based on historical chart clearance data, plus automatically suggests confirmed alternative routes.",
      impact: "99.8% seat certainty with zero travel plan disruption."
    },
    {
      id: "payment-drops",
      title: "Payment Gateway Dropouts & Failed Bookings",
      irctcProblem: "Bank payment gateways time out during high loads. Money is deducted from the passenger's bank, but no ticket is booked, taking 5-7 days for refund.",
      railnexSolution: "Pre-authorized Zero-Timeout Settlement Vault with 1-click RailNex Wallet and instant UPI QR verification. If booking fails, refund is instant (<5 mins).",
      impact: "Zero 'money deducted, ticket not booked' complaints."
    },
    {
      id: "berth-allocation",
      title: "Unfair Berth Allocation for Seniors & Families",
      irctcProblem: "Senior citizens often get assigned Upper Berths while young travelers get Lower Berths; families are frequently separated across coaches.",
      railnexSolution: "Dynamic Berth Optimizer automatically detects passengers aged 60+ and prioritizes Lower Berths (LB), keeping family groups contiguous in the same bay.",
      impact: "Comfortable, dignified travel for elderly passengers and families."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-4 py-1 rounded-full text-blue-600 text-xs font-bold mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>The Next-Generation Rail Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Why RailNex Beats Legacy IRCTC
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl mx-auto">
          We analyzed the top 6 pain points that frustrate 80+ million Indian train travelers and engineered direct architectural solutions.
        </p>
      </div>

      {/* Live Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>BOT ATTACKS BLOCKED</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-red-400">
            {metrics.agentBotsBlocked.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Real-time script quarantine</div>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>SERVER LATENCY</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
            {metrics.serverLatencyMs} ms
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">vs 8,500ms on legacy IRCTC</div>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>ACTIVE CONCURRENCY</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-blue-400">
            {metrics.activeUsers.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">0% server crashes at 10 AM</div>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>FAIRNESS INDEX</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-white">
            {metrics.fairnessRating}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Zero commercial agent leakage</div>
        </div>
      </div>

      {/* Feature-by-Feature Comparison Matrix */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-extrabold text-slate-900 text-lg">
            Side-by-Side Architectural Comparison:
          </h3>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
            6/6 Critical Failures Solved
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {improvements.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-slate-900">
                    {item.title}
                  </h4>
                </div>
                <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Fully Solved by RailNex</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Legacy IRCTC */}
                <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 text-xs text-red-950">
                  <div className="flex items-center space-x-1.5 font-bold text-red-800 mb-1">
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>How Legacy IRCTC Fails:</span>
                  </div>
                  <p className="leading-relaxed">{item.irctcProblem}</p>
                </div>

                {/* RailNex Engine */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-800 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>How RailNex Fixes It:</span>
                  </div>
                  <p className="leading-relaxed">{item.railnexSolution}</p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  <strong>Passenger Impact:</strong> {item.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
