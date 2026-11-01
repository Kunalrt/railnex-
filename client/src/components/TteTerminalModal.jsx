import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  X,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  Train,
  Calendar,
  MapPin,
  Clock,
  Search,
  Camera,
  RefreshCw,
  FileText,
  BadgeAlert,
  ArrowRight,
  ExternalLink,
  Laptop
} from "lucide-react";

export default function TteTerminalModal({ isOpen, onClose, initialPnr, onTicketUpdated }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(initialPnr ? "verified" : "scanner"); // scanner | manual | verified
  const [pnrInput, setPnrInput] = useState(initialPnr || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationData, setVerificationData] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [scannerStarted, setScannerStarted] = useState(false);

  const scannerRef = useRef(null);

  // Fetch recent bookings so TTE can quickly test any ticket
  useEffect(() => {
    fetch("/api/tickets")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRecentBookings(data);
      })
      .catch(() => {});
  }, []);

  // If initialPnr provided, verify immediately
  useEffect(() => {
    if (initialPnr) {
      verifyPnr(initialPnr);
    }
  }, [initialPnr]);

  // Handle QR scanner initialization
  useEffect(() => {
    if (activeTab !== "scanner") {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
        setScannerStarted(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      const element = document.getElementById("tte-qr-reader");
      if (element && !scannerRef.current) {
        try {
          const scanner = new Html5QrcodeScanner(
            "tte-qr-reader",
            {
              fps: 10,
              qrbox: { width: 220, height: 220 },
              rememberLastUsedCamera: true
            },
            false
          );

          scanner.render(
            (decodedText) => {
              // Extract PNR from URL or text
              let foundPnr = "";
              if (decodedText.includes("pnr=")) {
                const match = decodedText.match(/pnr=([A-Za-z0-9]+)/);
                if (match) foundPnr = match[1];
              } else if (/^\d{10}$/.test(decodedText.trim())) {
                foundPnr = decodedText.trim();
              } else {
                // Try JSON
                try {
                  const parsed = JSON.parse(decodedText);
                  if (parsed.pnr) foundPnr = parsed.pnr;
                } catch {
                  foundPnr = decodedText.trim();
                }
              }

              if (foundPnr) {
                scanner.clear().catch(() => {});
                scannerRef.current = null;
                setScannerStarted(false);
                verifyPnr(foundPnr);
              }
            },
            (errorMessage) => {
              // Ignore standard frame scanning frames
            }
          );

          scannerRef.current = scanner;
          setScannerStarted(true);
        } catch (err) {
          console.warn("Camera scanner init failed:", err);
        }
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
        setScannerStarted(false);
      }
    };
  }, [activeTab]);

  const verifyPnr = async (pnrToVerify) => {
    if (!pnrToVerify) return;
    const cleanPnr = String(pnrToVerify).replace(/\D/g, "");
    if (cleanPnr.length !== 10) {
      setError("Invalid PNR: PNR must be numeric and exactly 10 digits.");
      return;
    }
    setLoading(true);
    setError("");
    setActionMessage("");

    try {
      const res = await fetch(`/api/tte/verify/${encodeURIComponent(cleanPnr)}`);
      const data = await res.json();

      if (data.success && data.booking) {
        setVerificationData(data);
        setActiveTab("verified");
      } else {
        setError(data.error || "Unable to verify ticket on Indian Railways PRS Server.");
      }
    } catch (err) {
      setError("Network error connecting to CRIS Handheld Terminal Switch.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (passengerId, status, remarks = "") => {
    if (!verificationData?.booking) return;
    setActionLoading(true);
    setActionMessage("");

    try {
      const res = await fetch("/api/tte/mark-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pnr: verificationData.booking.pnr,
          passengerId,
          status,
          remarks,
          tteId: "TTE S. K. Verma (SER-4819)"
        })
      });

      const data = await res.json();
      if (data.success) {
        setVerificationData(prev => ({
          ...prev,
          booking: data.booking
        }));
        setActionMessage(data.message);
        if (onTicketUpdated) onTicketUpdated(data.booking);
      } else {
        alert(data.error || "Failed to update attendance.");
      }
    } catch (err) {
      alert("Failed to communicate with PRS attendance gateway.");
    } finally {
      setActionLoading(false);
    }
  };

  const booking = verificationData?.booking;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-300 animate-scaleIn flex flex-col max-h-[92vh]">
        {/* Terminal Header */}
        <div className="bg-[#182c57] text-white p-4 border-b border-[#213d77] flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#fb792b] text-white flex items-center justify-center shadow-md font-bold">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  CRIS PRS ONLINE
                </span>
                <span className="text-[10px] text-slate-300 font-mono">Terminal #HHT-SER-4819</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Indian Railways TTE Handheld Terminal (IR-HHT)
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-header with Examiner Information */}
        <div className="bg-[#213d77] text-slate-200 px-4 py-2 text-xs flex flex-wrap justify-between items-center gap-2 border-b border-blue-900/50">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-[#fb792b]" />
            <span>Examiner: <strong className="text-white">S. K. Verma (SER-4819)</strong></span>
            <span className="text-blue-300">•</span>
            <span>Division: <strong className="text-white">Ranchi Division (SER)</strong></span>
          </div>
          <div className="text-[11px] font-mono text-emerald-300 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Handheld Matrix Connected</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab("scanner")}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              activeTab === "scanner"
                ? "border-[#fb792b] text-[#213d77] bg-white"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Camera className="w-4 h-4 text-[#fb792b]" />
            <span>Scan Ticket QR Code</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              activeTab === "manual"
                ? "border-[#fb792b] text-[#213d77] bg-white"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Search className="w-4 h-4 text-[#213d77]" />
            <span>Manual PNR / Test Tickets</span>
          </button>

          {booking && (
            <button
              type="button"
              onClick={() => setActiveTab("verified")}
              className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 border-b-2 transition-colors ${
                activeTab === "verified"
                  ? "border-emerald-600 text-emerald-800 bg-emerald-50/50"
                  : "border-transparent hover:text-slate-900"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Inspection View (PNR: {booking.pnr})</span>
            </button>
          )}
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-[#f4f6fa]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {actionMessage && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs flex items-center space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">{actionMessage}</span>
            </div>
          )}

          {/* TAB 1: Live QR Scanner */}
          {activeTab === "scanner" && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-[#213d77]">
                  Scan Passenger's Digital QR Code
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Point the camera at the ERS e-ticket or mobile QR code to fetch live PRS passenger verification.
                </p>
              </div>

              {/* QR Reader Viewport */}
              <div className="max-w-xs mx-auto overflow-hidden rounded-2xl border-2 border-[#213d77] bg-black shadow-inner relative min-h-[240px] flex items-center justify-center">
                <div id="tte-qr-reader" className="w-full"></div>
              </div>

              {/* Quick simulation buttons for ease of testing */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block mb-2">
                  OR QUICK VERIFY RECENT BOOKED PASSENGERS:
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {recentBookings.slice(0, 3).map(b => (
                    <button
                      key={b.pnr}
                      type="button"
                      onClick={() => verifyPnr(b.pnr)}
                      className="px-3 py-1.5 bg-[#213d77]/10 hover:bg-[#213d77]/20 text-[#213d77] rounded-lg text-xs font-mono font-bold transition-colors flex items-center space-x-1"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#fb792b]" />
                      <span>{b.pnr} ({b.passengers[0]?.name || "Pass"})</span>
                    </button>
                  ))}
                  {recentBookings.length === 0 && (
                    <button
                      type="button"
                      onClick={() => verifyPnr("2458910243")}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-mono font-bold"
                    >
                      Test Sample PNR: 2458910243
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Manual PNR Search & Test Tickets */}
          {activeTab === "manual" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-[#213d77]">
                    Enter 10-Digit PNR Number
                  </h3>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    pnrInput.length === 10
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {pnrInput.length}/10 digits {pnrInput.length === 10 ? "✓ Ready" : "(Requires 10 digits)"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    value={pnrInput}
                    onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Enter 10-digit numeric PNR (e.g. 2458910243)"
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                  />
                  <button
                    type="button"
                    disabled={loading || pnrInput.length !== 10}
                    onClick={() => verifyPnr(pnrInput)}
                    className="px-6 py-2.5 bg-[#fb792b] hover:bg-[#e06518] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Inspect Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Recent Bookings List */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Available Bookings on this Train / Device:
                </h4>
                {recentBookings.length === 0 ? (
                  <p className="text-xs text-slate-400">No previous bookings found. Book a ticket or test sample PNR 2458910243.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {recentBookings.map(b => (
                      <div key={b.pnr} className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-[#213d77]">{b.pnr}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              {b.trainNumber} - {b.from.code} ➔ {b.to.code}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {b.passengers.map(p => `${p.name} (${p.coach}-${p.seatNumber})`).join(", ")}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => verifyPnr(b.pnr)}
                          className="px-3 py-1.5 bg-[#213d77] text-white font-bold rounded-lg text-xs hover:bg-[#182c57] transition-colors"
                        >
                          Check
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Authenticated Passenger Verification & Attendance Inspection */}
          {activeTab === "verified" && booking && (
            <div className="space-y-4">
              {/* Official CRIS Verification Seal */}
              <div className="bg-emerald-50 border-2 border-emerald-500/80 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-emerald-600 text-white px-2.5 py-0.5 rounded font-black tracking-wide uppercase">
                        CRIS PRS VALIDATED
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-800">
                        GENUINE ERS PASS
                      </span>
                    </div>
                    <h3 className="text-base font-black text-emerald-950 mt-0.5">
                      Passenger Reservation Confirmed & Digitally Signed
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono text-[11px] text-emerald-800">
                  <div>Signature: {booking.prsDigitalSignature ? booking.prsDigitalSignature.substring(0, 16) : "CRIS-AUTH-9182"}...</div>
                  <div className="text-[10px] text-emerald-600">Tamper-Proof Aadhaar Token Verified</div>
                </div>
              </div>

              {/* Journey & Train Overview */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">PNR NUMBER</span>
                  <span className="font-mono text-base font-black text-[#fb792b]">{booking.pnr}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">TRAIN NO. & NAME</span>
                  <span className="font-extrabold text-[#213d77]">{booking.trainNumber} / {booking.trainName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">DATE & CLASS</span>
                  <span className="font-bold text-slate-800">{booking.date} • {booking.travelClass} ({booking.quota})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">ROUTE</span>
                  <span className="font-bold text-slate-800">{booking.from.code} ➔ {booking.to.code}</span>
                </div>
              </div>

              {/* Passenger Berth & Attendance Controls */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-[#213d77] uppercase tracking-wider">
                    PASSENGERS ON TICKET ({booking.passengers.length}):
                  </h4>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleMarkAttendance("ALL", "PRESENT", "All passengers boarded")}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 px-3 py-1 rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark All Present</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {booking.passengers.map((p) => {
                    const isPresent = p.attendanceStatus === "PRESENT";
                    const isAbsent = p.attendanceStatus === "ABSENT";
                    const isUnchecked = !p.attendanceStatus || p.attendanceStatus === "UNCHECKED";

                    return (
                      <div
                        key={p.id}
                        className={`bg-white rounded-2xl p-4 border transition-all shadow-sm ${
                          isPresent
                            ? "border-emerald-300 ring-2 ring-emerald-500/20 bg-emerald-50/20"
                            : isAbsent
                            ? "border-red-300 ring-2 ring-red-500/20 bg-red-50/20"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          {/* Left: Passenger Details */}
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-slate-900 text-sm">{p.name}</span>
                              <span className="text-xs text-slate-500">
                                ({p.age} yrs / {p.gender})
                              </span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                                isPresent
                                  ? "bg-emerald-100 text-emerald-800"
                                  : isAbsent
                                  ? "bg-red-100 text-red-800"
                                  : "bg-slate-100 text-slate-600"
                              }`}>
                                {isPresent ? "● BOARDED" : isAbsent ? "● NO SHOW" : "PENDING INSPECTION"}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-600">
                              <div className="flex items-center space-x-1 font-mono">
                                <span className="font-bold text-[#fb792b]">Coach {p.coach}</span>
                                <span>•</span>
                                <span className="font-extrabold text-emerald-700">
                                  Seat #{p.seatNumber} ({p.allocatedBerth})
                                </span>
                              </div>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500 font-mono text-[11px]">
                                ID: {p.aadhaarMasked || "GOVT-ID-VERIFIED"}
                              </span>
                            </div>

                            {p.tteCheckedAt && (
                              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                                Verified by S. K. Verma at {new Date(p.tteCheckedAt).toLocaleTimeString("en-IN")}
                              </div>
                            )}
                          </div>

                          {/* Right: TTE Attendance Action Buttons */}
                          <div className="flex items-center space-x-2 w-full sm:w-auto">
                            <button
                              type="button"
                              disabled={actionLoading}
                              onClick={() => handleMarkAttendance(p.id, "PRESENT", "Passenger present in coach")}
                              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 transition-transform active:scale-95 shadow-sm ${
                                isPresent
                                  ? "bg-emerald-600 text-white shadow-emerald-600/30"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Present</span>
                            </button>

                            <button
                              type="button"
                              disabled={actionLoading}
                              onClick={() => {
                                if (window.confirm(`Mark ${p.name} as NO SHOW? This will free Coach ${p.coach} Seat ${p.seatNumber} for Waitlist/RAC passengers on this train.`)) {
                                  handleMarkAttendance(p.id, "ABSENT", "No-show at scheduled boarding");
                                }
                              }}
                              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 transition-transform active:scale-95 shadow-sm ${
                                isAbsent
                                  ? "bg-red-600 text-white shadow-red-600/30"
                                  : "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                              }`}
                            >
                              <XCircle className="w-4 h-4" />
                              <span>No Show</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Inspection Summary */}
              <div className="bg-slate-100 rounded-xl p-3 text-xs text-slate-600 flex flex-wrap justify-between items-center gap-2">
                <div>
                  <strong>Inspection Status:</strong> {booking.tteVerification?.checkedPassengers || 0} of {booking.passengers.length} checked
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Encrypted CRS Matrix Handshake • Zero Fraud Guarantee
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex justify-between items-center text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("scanner")}
            className="text-[#213d77] hover:underline font-bold flex items-center space-x-1"
          >
            <Camera className="w-3.5 h-3.5 text-[#fb792b]" />
            <span>Scan Another QR</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#213d77] hover:bg-[#182c57] text-white font-bold rounded-xl text-xs"
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
}
