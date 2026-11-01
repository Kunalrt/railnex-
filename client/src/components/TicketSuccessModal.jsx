import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import confetti from "canvas-confetti";
import { X, CheckCircle2, Printer, Download, Share2, ShieldCheck, QrCode, Train, Calendar, MapPin, User, FileText, UserCheck, ExternalLink } from "lucide-react";
import CoachSeatVisualizer from "./CoachSeatVisualizer";

export default function TicketSuccessModal({ isOpen, onClose, booking, onOpenTteTerminal }) {
  if (!isOpen || !booking) return null;

  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  useEffect(() => {
    if (!booking?.pnr) return;
    const verifyUrl = `${window.location.origin}/?pnr=${booking.pnr}&mode=tte`;
    QRCode.toDataURL(verifyUrl, {
      width: 260,
      margin: 1,
      color: {
        dark: "#182c57",
        light: "#ffffff"
      },
      errorCorrectionLevel: "H"
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error("Error generating TTE QR:", err));
  }, [booking?.pnr]);

  const handlePrint = () => {
    window.print();
  };

  const primarySeat = booking.passengers[0]?.seatNumber || 24;
  const primaryCoach = booking.passengers[0]?.coach || "B2";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-300 print:border-none print:shadow-none animate-scaleIn">
        {/* Celebration Strip (Hidden on Print) */}
        <div className="bg-[#213d77] text-white p-4 flex justify-between items-center print:hidden border-b border-[#1b3260]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded font-mono font-bold">
                  RESERVATION CONFIRMED
                </span>
                <span className="text-xs text-slate-300">Zero Agent Scalping</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                Indian Railways Electronic Reservation Slip (ERS) Generated
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Authentic Indian Railways E-Ticket Printable Body */}
        <div className="p-6 sm:p-8 space-y-5 bg-white text-xs text-slate-800">
          {/* Official ERS Header */}
          <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-[#213d77] text-amber-400 flex items-center justify-center p-2">
                <Train className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-600 block uppercase tracking-wider">
                  RailNex Digital Ticketing Engine • Indian Railways PRS
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight uppercase">
                  ELECTRONIC RESERVATION SLIP (ERS) & DIGITAL PASS
                </h2>
                <span className="text-[10px] text-slate-500">
                  (Official PRS Boarding Document • Valid for Train Journey with Original Govt ID)
                </span>
              </div>
            </div>

            {/* PNR & Barcode on Right */}
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">PNR NUMBER</span>
              <span className="text-xl sm:text-2xl font-mono font-black text-[#fb792b] tracking-wider block">
                {booking.pnr}
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded inline-block">
                STATUS: {booking.status}
              </span>
            </div>
          </div>

          {/* Journey Information Grid */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <div className="bg-[#213d77] text-white px-4 py-2 font-bold text-[11px] flex justify-between items-center">
              <span>JOURNEY DETAILS</span>
              <span>QUOTA: {booking.quota} • CLASS: {booking.travelClass}</span>
            </div>

            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/50">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">TRAIN NO. & NAME</span>
                <span className="font-extrabold text-[#213d77] text-sm block">
                  {booking.trainNumber} / {booking.trainName}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold block">DATE OF JOURNEY</span>
                <span className="font-extrabold text-slate-900 text-sm block">
                  {booking.date}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold block">FROM (ORIGIN)</span>
                <span className="font-extrabold text-slate-900 text-sm block">
                  {booking.from.code} ({booking.from.name || booking.from.code})
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold block">TO (DESTINATION)</span>
                <span className="font-extrabold text-slate-900 text-sm block">
                  {booking.to.code} ({booking.to.name || booking.to.code})
                </span>
              </div>
            </div>

            <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
              <div>
                Booked On: <strong>{new Date(booking.bookedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</strong>
              </div>
              <div>
                Chart Status: <strong className="text-emerald-700">{booking.chartStatus}</strong>
              </div>
              <div>
                Anti-Agent Shield: <strong className="text-emerald-700">Aadhaar Token Verified</strong>
              </div>
            </div>
          </div>

          {/* Passenger & Berth Details Table */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-black text-[#213d77] uppercase tracking-wider">
                PASSENGER DETAILS & ALLOCATED BERTHS:
              </span>
              <span className="text-[11px] text-slate-500">Total Passengers: {booking.passengers.length}</span>
            </div>

            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#213d77] text-white font-bold border-b border-slate-300 text-[11px]">
                  <tr>
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Passenger Name</th>
                    <th className="py-2 px-3">Age / Gender</th>
                    <th className="py-2 px-3">Coach</th>
                    <th className="py-2 px-3">Seat / Berth</th>
                    <th className="py-2 px-3">Booking Status</th>
                    <th className="py-2 px-3">Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {booking.passengers.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-500">{p.id}</td>
                      <td className="py-2.5 px-3 font-extrabold text-slate-900">{p.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{p.age} yrs / {p.gender}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#fb792b] text-sm">{p.coach}</td>
                      <td className="py-2.5 px-3 font-mono font-extrabold text-emerald-700 text-sm">
                        Seat #{p.seatNumber} ({p.allocatedBerth})
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded">
                          CNF
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                        {p.currentStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coach 2D Layout Visualizer (Print: Hidden) */}
          <div className="print:hidden">
            <span className="text-xs font-black text-[#213d77] uppercase tracking-wider block mb-1.5">
              COACH SEAT LOCATION (COACH {primaryCoach}):
            </span>
            <CoachSeatVisualizer
              travelClass={booking.travelClass}
              allocatedSeat={primarySeat}
              coachNumber={primaryCoach}
            />
          </div>

          {/* Fare Details Table & QR Code */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border border-slate-300 rounded-lg p-4 bg-slate-50/50">
            <div className="md:col-span-8 space-y-1 text-slate-700">
              <span className="font-bold text-[#213d77] block text-xs uppercase mb-1">
                FARE DETAILS (INR):
              </span>
              <div className="flex justify-between text-slate-600">
                <span>Ticket Base & Reservation Fare:</span>
                <span className="font-mono font-bold">₹{booking.fare?.ticketFare?.toLocaleString() || (booking.fare?.totalFare - 35.4)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IRCTC Convenience Fee (incl. GST):</span>
                <span className="font-mono font-bold">₹35.40</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Travel Insurance Premium (incl. GST):</span>
                <span className="font-mono font-bold">₹{(booking.passengers.length * 0.45).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#213d77] font-black text-sm pt-1 border-t border-slate-300">
                <span>Total Fare Paid (in figures):</span>
                <span className="font-mono text-base">₹{booking.fare?.totalFare?.toLocaleString()}</span>
              </div>
            </div>

            {/* Real Official CRIS TTE Checking QR Code */}
            <div className="md:col-span-4 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-300 pt-3 md:pt-0">
              <div className="p-2.5 bg-white rounded-xl border-2 border-[#213d77] shadow-md flex flex-col items-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`CRIS TTE Check QR for PNR ${booking.pnr}`}
                    className="w-28 h-28 object-contain"
                  />
                ) : (
                  <div className="w-28 h-28 bg-slate-100 flex items-center justify-center animate-pulse">
                    <QrCode className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <div className="text-[8px] font-mono font-bold tracking-widest text-[#213d77] mt-1 uppercase">
                  CRIS PRS • TTE VERIFIED
                </div>
              </div>

              <div className="text-center mt-2 space-y-1">
                <span className="text-[11px] text-[#213d77] font-black block">
                  Original QR for TTE Verification
                </span>
                <span className="text-[9px] text-slate-500 font-mono block">
                  Scan with Camera or HHT Scanner
                </span>

                {onOpenTteTerminal && (
                  <button
                    type="button"
                    onClick={() => onOpenTteTerminal(booking.pnr)}
                    className="mt-1 px-3 py-1.5 bg-[#213d77] hover:bg-[#182c57] text-white font-bold rounded-lg text-[10px] flex items-center justify-center space-x-1 shadow-sm transition-transform active:scale-95 print:hidden mx-auto"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#fb792b]" />
                    <span>Open TTE Terminal (Test Scan)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Official IRCTC Instructions */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 text-[10px] text-slate-600 space-y-1">
            <span className="font-bold text-[#213d77] block uppercase text-[10px]">
              IMPORTANT PASSENGER INSTRUCTIONS:
            </span>
            <p>1. One of the passengers booked on an Electronic Reservation Slip (ERS) must carry any one of the specified identity cards in original during train journey (Aadhaar / Voter ID / Passport / Driving Licence / PAN Card).</p>
            <p>2. E-ticket cancellations are permitted online prior to chart preparation. Instant refund is credited to the original booking account.</p>
            <p>3. This ticket was processed by the RailNex Next-Gen PRS Engine with guaranteed Anti-Agent protection and zero scalper commissions.</p>
          </div>

          {/* Action Buttons (Print: Hidden) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 print:hidden">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  const text = `🚆 RailNex Confirmed e-Ticket\nPNR: ${booking.pnr}\nTrain: ${booking.trainName} (#${booking.trainNumber})\nRoute: ${booking.from.code} -> ${booking.to.code}\nDate: ${booking.date}\nStatus: ${booking.status}\nPassengers: ${booking.passengers.map(p => `${p.name} (${p.coach}-${p.seatNumber} ${p.allocatedBerth})`).join(", ")}`;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(text);
                    alert("Ticket details copied to clipboard!\n\nSimulated SMS & WhatsApp notification sent to " + (booking.contact?.mobile || "passenger mobile") + ".");
                  }
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center space-x-2 transition-colors shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via WhatsApp / SMS</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 bg-[#213d77] hover:bg-[#1b3260] text-white font-bold rounded-lg text-xs flex items-center space-x-2 transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official E-Ticket (ERS)</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#fb792b] hover:bg-[#e56517] text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
