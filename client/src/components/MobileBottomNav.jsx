import React from "react";
import { Train, Search, Ticket, ShieldCheck, Server, UserCheck, User, Radio, ArrowLeftRight, Sparkles } from "lucide-react";

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  onOpenRailwayServerModal,
  onOpenTteTerminal,
  currentUser,
  onOpenAuth
}) {
  const navItems = [
    { id: "search", label: "Book", icon: Train },
    { id: "ai", label: "AI Copilot", icon: Sparkles, badge: "AI" },
    { id: "swaps", label: "Berth Swap", icon: ArrowLeftRight, badge: "New" },
    { id: "live", label: "Live Train", icon: Radio },
    { id: "pnr", label: "PNR (10D)", icon: Search },
    { id: "bookings", label: "Tickets", icon: Ticket }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.06)] safe-area-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-90 ${
              isActive
                ? "text-[#213d77] font-black"
                : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <div className={`p-1 rounded-lg relative ${isActive ? "bg-[#213d77]/10 text-[#213d77]" : ""}`}>
              <Icon className="w-5 h-5" />
              {item.badge && (
                <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-[#fb792b] text-[8px] font-black text-white rounded-full leading-tight">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}

      {/* TTE Quick Ticket Check Button */}
      {onOpenTteTerminal && (
        <button
          type="button"
          onClick={() => onOpenTteTerminal()}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-emerald-700 transition-all active:scale-90"
        >
          <div className="p-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <UserCheck className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-bold">TTE Scan</span>
        </button>
      )}

      {/* Account / Sign In Tab */}
      {onOpenAuth && (
        <button
          type="button"
          onClick={() => onOpenAuth(currentUser ? "profile" : "login")}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[#213d77] transition-all active:scale-90"
        >
          <div className="p-1 rounded-lg bg-[#213d77]/10 text-[#213d77] relative">
            <User className="w-5 h-5" />
            {currentUser && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-bold truncate max-w-[50px]">
            {currentUser ? (currentUser.firstName || "Account") : "Sign In"}
          </span>
        </button>
      )}

      {/* Railway Server Gateway Quick Button */}
      <button
        type="button"
        onClick={onOpenRailwayServerModal}
        className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[#fb792b] transition-all active:scale-90"
      >
        <div className="p-1 rounded-lg bg-orange-50 text-[#fb792b] relative border border-orange-200">
          <Server className="w-5 h-5" />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#fb792b] rounded-full animate-ping"></span>
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight font-medium">Gateway</span>
      </button>
    </nav>
  );
}
