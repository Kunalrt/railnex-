import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSearch from "./components/HeroSearch";
import TatkalBanner from "./components/TatkalBanner";
import TrainCard from "./components/TrainCard";
import BookingModal from "./components/BookingModal";
import PaymentModal from "./components/PaymentModal";
import TicketSuccessModal from "./components/TicketSuccessModal";
import PnrEnquiry from "./components/PnrEnquiry";
import AntiAgentHub from "./components/AntiAgentHub";
import MyBookings from "./components/MyBookings";
import RailwayServerModal from "./components/RailwayServerModal";
import MobileBottomNav from "./components/MobileBottomNav";
import MobileAppInstallBanner from "./components/MobileAppInstallBanner";
import SplashScreen from "./components/SplashScreen";
import TteTerminalModal from "./components/TteTerminalModal";
import AuthModal from "./components/AuthModal";
import LiveTrainTracker from "./components/LiveTrainTracker";
import IrctcMobileLoginGate from "./components/IrctcMobileLoginGate";
import BerthSwapHub from "./components/BerthSwapHub";
import GeminiRailCopilot from "./components/GeminiRailCopilot";
import { Train, ShieldCheck, Sparkles, Filter, AlertCircle, ArrowRight } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("search");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQuota, setCurrentQuota] = useState("GENERAL");
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });

  // User Authentication & Profile state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("railnex_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState("login");

  const handleOpenAuth = (initialMode = "login") => {
    setAuthInitialMode(initialMode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("railnex_user");
    localStorage.removeItem("railnex_token");
  };

  // Modal states
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedClass, setSelectedClass] = useState("3A");
  const [selectedClassData, setSelectedClassData] = useState(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const [railwayModalOpen, setRailwayModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // TTE Handheld Terminal (IR-HHT) state
  const [tteModalOpen, setTteModalOpen] = useState(false);
  const [ttePnr, setTtePnr] = useState(null);

  // Detect URL parameter if someone scans the QR code directly using their phone camera
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryPnr = params.get("pnr");
    const mode = params.get("mode");
    if (queryPnr || mode === "tte") {
      setTtePnr(queryPnr || "2458910243");
      setTteModalOpen(true);
      setShowSplash(false);
    }
  }, []);

  const handleOpenTteTerminal = (pnr = null) => {
    setTtePnr(pnr);
    setTteModalOpen(true);
  };

  // Perform search
  const handleSearchTrains = async ({ from, to, date, quota, travelClass }) => {
    setLoading(true);
    setCurrentQuota(quota);
    setCurrentDate(date);
    try {
      const res = await fetch(
        `/api/trains/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&quota=${quota}&travelClass=${travelClass}`
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
        setActiveTab("search");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Run initial search so the user immediately sees live trains
  useEffect(() => {
    handleSearchTrains({
      from: "RNC",
      to: "HWH",
      date: currentDate,
      quota: "GENERAL",
      travelClass: "ALL"
    });
  }, []);

  // Step 1: User clicks "Book Ticket" on a TrainCard
  const handleSelectClassForBooking = (train, clsCode, clsData) => {
    setSelectedTrain(train);
    setSelectedClass(clsCode);
    setSelectedClassData(clsData);
    setBookingModalOpen(true);
  };

  // Step 2: User completes passenger details and human verification in BookingModal
  const handleProceedToPayment = (bookingPayload) => {
    setBookingModalOpen(false);
    setPendingBooking(bookingPayload);
    setPaymentModalOpen(true);
  };

  // Step 3: Payment succeeds in PaymentModal
  const handlePaymentSuccess = (confirmedBookingObj) => {
    setPaymentModalOpen(false);
    setConfirmedBooking(confirmedBookingObj);
    setSuccessModalOpen(true);
  };

  // Quick switch to Tatkal Quota
  const handleSwitchToTatkal = () => {
    if (searchResults) {
      handleSearchTrains({
        from: searchResults.from.code,
        to: searchResults.to.code,
        date: currentDate,
        quota: "TATKAL",
        travelClass: "ALL"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] flex flex-col font-sans overflow-x-hidden">
      {/* Native App Opening Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* 1-Click Mobile App Installation Banner */}
      <MobileAppInstallBanner />

      {/* Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRailwayServerModal={() => setRailwayModalOpen(true)}
        onOpenTteTerminal={handleOpenTteTerminal}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-24 md:pb-8">
        {activeTab === "search" && (
          <div>
            {/* Search Hero Box */}
            <HeroSearch
              onSearch={handleSearchTrains}
              loading={loading}
              initialFrom={searchResults?.from?.code || "RNC"}
              initialTo={searchResults?.to?.code || "HWH"}
            />

            {/* Tatkal & Anti-Agent Banner */}
            <TatkalBanner
              quota={currentQuota}
              onSelectTatkal={handleSwitchToTatkal}
            />

            {/* Results Section */}
            <div className="max-w-6xl mx-auto px-4 py-8">
              {loading ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-[#fb792b] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="text-[#213d77] font-bold">Querying Indian Railways Reservation Matrix...</div>
                  <div className="text-xs text-slate-500">Verifying live seat inventory with 0 agent throttling</div>
                </div>
              ) : searchResults && searchResults.trains ? (
                <div className="space-y-6">
                  {/* Results Count & Corridor Details */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#213d77] tracking-tight">
                        {searchResults.from.city} ({searchResults.from.code}) ➔ {searchResults.to.city} ({searchResults.to.code})
                      </h2>
                      <p className="text-xs text-slate-600">
                        Showing <strong>{searchResults.trains.length}</strong> available trains for <strong>{searchResults.date}</strong> • Quota: <strong className="text-[#fb792b]">{searchResults.quota}</strong>
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Zero Agent Hoarding Guarantee</span>
                      </span>
                    </div>
                  </div>

                  {/* List of Train Cards */}
                  <div className="space-y-5">
                    {searchResults.trains.map((train) => (
                      <TrainCard
                        key={train.trainNumber}
                        train={train}
                        quota={searchResults.quota}
                        onSelectClassForBooking={handleSelectClassForBooking}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* PNR Status Checker Tab */}
        {activeTab === "pnr" && (
          <PnrEnquiry
            onCancelTicketSuccess={() => {
              // Refresh or notify
            }}
          />
        )}

        {/* Live Train Tracker & NTES Station History Tab */}
        {activeTab === "live" && (
          <LiveTrainTracker
            initialTrainNumber="20898"
            onBookTrain={() => setActiveTab("search")}
          />
        )}

        {/* Anti-Agent Defense Hub Tab */}
        {activeTab === "shield" && <AntiAgentHub />}

        {/* In-Train Mutual Berth Swapping Hub (Innovative Feature IRCTC Does NOT Have) */}
        {activeTab === "swaps" && (
          <BerthSwapHub
            currentUser={currentUser}
            onGoToSearch={() => setActiveTab("search")}
          />
        )}

        {/* Google Gemini AI Railway Copilot & Travel Intelligence Hub */}
        {activeTab === "ai" && (
          <GeminiRailCopilot
            onGoToSearch={() => setActiveTab("search")}
            onSearchRoute={handleSearchTrains}
          />
        )}

        {/* My Bookings Tab */}
        {activeTab === "bookings" && (
          <MyBookings
            onSelectTicketForPrint={(t) => {
              setConfirmedBooking(t);
              setSuccessModalOpen(true);
            }}
            onGoToSearch={() => setActiveTab("search")}
            onOpenTteTerminal={handleOpenTteTerminal}
          />
        )}
      </main>

      {/* Modals */}
      {/* 1. Passenger Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        train={selectedTrain}
        travelClass={selectedClass}
        classData={selectedClassData}
        quota={currentQuota}
        searchDate={currentDate}
        onProceedToPayment={handleProceedToPayment}
        currentUser={currentUser}
      />

      {/* 2. Zero-Timeout Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        bookingDetails={pendingBooking}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* 3. Official Printable e-Ticket Success Modal with Real TTE QR */}
      <TicketSuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        booking={confirmedBooking}
        onOpenTteTerminal={handleOpenTteTerminal}
      />

      {/* 4. Live Indian Railways Gateway & API Modal */}
      <RailwayServerModal
        isOpen={railwayModalOpen}
        onClose={() => setRailwayModalOpen(false)}
      />

      {/* 5. Official Indian Railways TTE Handheld Terminal (IR-HHT) & QR Scanner */}
      <TteTerminalModal
        isOpen={tteModalOpen}
        onClose={() => setTteModalOpen(false)}
        initialPnr={ttePnr}
        onTicketUpdated={(updatedTicket) => {
          if (confirmedBooking?.pnr === updatedTicket.pnr) {
            setConfirmedBooking(updatedTicket);
          }
        }}
      />

      {/* 6. Authentic IRCTC User Registration & Login Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        initialMode={authInitialMode}
      />

      {/* 7. IRCTC Rail Connect Mandatory Login Gate (Locks app until MPIN / Credentials entered) */}
      {!currentUser && !showSplash && (
        <IrctcMobileLoginGate
          onLoginSuccess={handleLoginSuccess}
          onOpenRegister={() => handleOpenAuth("register")}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#182c57] border-t border-[#213d77] text-slate-300 py-8 px-4 text-center text-xs print:hidden">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-left">
            <span className="font-extrabold text-white text-base tracking-tight">
              Rail<span className="text-[#fb792b]">Nex</span> • India's Smartest Train Booking Platform
            </span>
            <p className="text-slate-300 text-xs mt-1">
              The High-Speed Independent Rail Ticketing Engine • Built to Eliminate Agent Scalping & Tatkal Server Freezes
            </p>
          </div>
          <div className="text-right text-xs text-slate-300">
            <div>Protected by Proof-of-Human Entropy & Aadhaar Quota Lock</div>
            <div className="text-emerald-400 font-mono mt-0.5">● 100% Operational • 14ms Server Latency</div>
          </div>
        </div>
      </footer>

      {/* Floating Gemini AI Quick-Access Button */}
      {activeTab !== "ai" && (
        <button
          type="button"
          onClick={() => setActiveTab("ai")}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 bg-gradient-to-r from-[#213d77] to-purple-700 hover:from-[#1b3260] hover:to-purple-800 text-white p-3.5 rounded-full shadow-2xl flex items-center space-x-2 border-2 border-white/40 transition-transform active:scale-95 group animate-bounce"
          title="Ask RailNex Gemini AI Copilot"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
          <span className="hidden sm:inline text-xs font-black tracking-tight pr-1">
            Ask Gemini AI
          </span>
          <span className="bg-[#fb792b] text-[9px] font-black text-white px-1.5 py-0.2 rounded-full uppercase">
            Live
          </span>
        </button>
      )}

      {/* Native Mobile App Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRailwayServerModal={() => setRailwayModalOpen(true)}
        onOpenTteTerminal={handleOpenTteTerminal}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
      />
    </div>
  );
}
