import React, { useState, useEffect } from "react";
import { X, UserPlus, Trash2, ShieldCheck, Zap, Lock, AlertCircle, Sparkles, Check, Clock, User, HeartHandshake, UserCheck } from "lucide-react";

export default function BookingModal({
  isOpen,
  onClose,
  train,
  travelClass,
  classData,
  quota,
  searchDate,
  onProceedToPayment,
  currentUser
}) {
  if (!isOpen || !train) return null;

  const [passengers, setPassengers] = useState(() => [
    {
      name: currentUser?.fullName || "",
      age: currentUser?.dob ? String(new Date().getFullYear() - new Date(currentUser.dob).getFullYear()) : "28",
      gender: currentUser?.gender || "Male",
      preference: "LB",
      food: "VEG",
      aadhaar: currentUser?.aadhaarNumber || ""
    }
  ]);
  const [mobile, setMobile] = useState(() => currentUser?.mobile || "9876543210");
  const [email, setEmail] = useState(() => currentUser?.email || "passenger@indianrail.gov.in");

  // IRCTC Authentic Master Passenger List
  const [showMasterListPicker, setShowMasterListPicker] = useState(false);
  const [masterList, setMasterList] = useState([]);

  useEffect(() => {
    fetch(`/api/user/master-list?username=${encodeURIComponent(currentUser?.username || "kunal_rail")}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.masterPassengers)) {
          setMasterList(data.masterPassengers);
        }
      })
      .catch(() => {});
  }, [currentUser]);

  const handleSelectFromMasterList = (mp) => {
    if (passengers.length === 1 && !passengers[0].name.trim()) {
      setPassengers([
        {
          name: mp.name,
          age: String(mp.age),
          gender: mp.gender,
          preference: mp.berthPreference,
          food: mp.food,
          aadhaar: mp.aadhaar || ""
        }
      ]);
    } else if (passengers.length < 6) {
      setPassengers([
        ...passengers,
        {
          name: mp.name,
          age: String(mp.age),
          gender: mp.gender,
          preference: mp.berthPreference,
          food: mp.food,
          aadhaar: mp.aadhaar || ""
        }
      ]);
    }
    setShowMasterListPicker(false);
  };

  // IRCTC Authentic Booking Preferences
  const [autoUpgradation, setAutoUpgradation] = useState(true);
  const [confirmBerthsOnly, setConfirmBerthsOnly] = useState(false);
  const [travelInsurance, setTravelInsurance] = useState(true);

  // Anti-Agent Proof of Human Verification state
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  const [formLoadTimestamp] = useState(Date.now());
  const [queueState, setQueueState] = useState(null); // null | 'in-queue' | 'granted'
  const [queueProgress, setQueueProgress] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddPassenger = () => {
    if (passengers.length >= 6) return;
    setPassengers([
      ...passengers,
      { name: "", age: "", gender: "Male", preference: "NO", food: "VEG", aadhaar: "" }
    ]);
  };

  const handleRemovePassenger = (idx) => {
    if (passengers.length === 1) return;
    setPassengers(passengers.filter((_, i) => i !== idx));
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    if (field === "aadhaar") {
      updated[index][field] = value.replace(/\D/g, "").slice(0, 12);
    } else {
      updated[index][field] = value;
    }
    setPassengers(updated);
  };

  const handleProceed = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate passengers
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name.trim()) {
        setErrorMessage(`Please enter name for Passenger #${i + 1}`);
        return;
      }
      if (!passengers[i].age || isNaN(passengers[i].age) || parseInt(passengers[i].age) < 1) {
        setErrorMessage(`Please enter a valid age for Passenger #${i + 1}`);
        return;
      }
      const cleanAadhaar = (passengers[i].aadhaar || "").replace(/\D/g, "");
      if (quota === "TATKAL") {
        if (!cleanAadhaar || cleanAadhaar.length !== 12) {
          setErrorMessage(`Aadhaar Number is required for Passenger #${i + 1} under Tatkal quota and must be numeric and exactly 12 digits.`);
          return;
        }
      } else if (cleanAadhaar && cleanAadhaar.length !== 12) {
        setErrorMessage(`Aadhaar Number for Passenger #${i + 1} must be numeric and exactly 12 digits.`);
        return;
      }
    }

    if (!isHumanVerified) {
      setErrorMessage("Please slide the Anti-Agent Verification bar to confirm genuine human passenger.");
      return;
    }

    const timeSpentMs = Date.now() - formLoadTimestamp;

    if (quota === "TATKAL") {
      setQueueState("in-queue");
      try {
        const res = await fetch("/api/tatkal/join-queue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            aadhaarNumber: passengers[0].aadhaar,
            clientSpeedMs: timeSpentMs
          })
        });

        const data = await res.json();
        if (!res.ok) {
          setErrorMessage(data.error || data.message || "Failed to enter Tatkal queue");
          setQueueState(null);
          return;
        }

        // Fast fair queue token release
        setTimeout(() => {
          setQueueProgress(100);
          setQueueState("granted");
          setTimeout(() => {
            onProceedToPayment({
              train,
              travelClass,
              classData,
              quota,
              searchDate,
              passengers,
              contact: { mobile, email },
              preferences: { autoUpgradation, confirmBerthsOnly, travelInsurance },
              tatkalTokenId: data.token?.tokenId
            });
          }, 600);
        }, 1000);

      } catch (err) {
        setErrorMessage("Network error while communicating with reservation server.");
        setQueueState(null);
      }
    } else {
      // General booking
      onProceedToPayment({
        train,
        travelClass,
        classData,
        quota,
        searchDate,
        passengers,
        contact: { mobile, email },
        preferences: { autoUpgradation, confirmBerthsOnly, travelInsurance }
      });
    }
  };

  const insuranceFee = travelInsurance ? passengers.length * 0.45 : 0;
  const baseTicketFare = passengers.length * (classData.effectiveFare || classData.baseFare);
  const convenienceFee = 35.40; // standard IRCTC convenience fee incl GST
  const totalFare = Math.round(baseTicketFare + convenienceFee + insuranceFee);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-scaleIn border border-slate-300">
        {/* IRCTC Modal Header */}
        <div className="bg-[#213d77] text-white px-6 py-4 flex justify-between items-center border-b border-[#1b3260]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#fb792b] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                RAILNEX PRS RESERVATION • ANTI-AGENT SECURE
              </span>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {train.trainName} (#{train.trainNumber})
              </h3>
            </div>
            <p className="text-xs text-slate-200 mt-0.5">
              {train.origin} ➔ {train.destination} • Date: <strong>{searchDate}</strong> • Class: <strong>{travelClass}</strong> • Quota: <strong className="text-amber-300">{quota}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tatkal Virtual Queue Screen if active */}
        {queueState ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-[#fb792b] flex items-center justify-center mx-auto animate-pulse">
              <Clock className="w-8 h-8 text-[#fb792b]" />
            </div>
            <h4 className="text-xl font-black text-[#213d77]">
              {queueState === "in-queue" ? "Securing Seat in Anti-Agent Fair Queue..." : "Tatkal Token Verified!"}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              {queueState === "in-queue"
                ? "Connecting directly to Indian Railways Reservation Matrix. Automated agent bot scripts bypassed."
                : "Confirmed berth held for 5 minutes. Loading payment gateway..."}
            </p>
            <div className="w-full bg-slate-200 rounded-full h-3 max-w-md mx-auto overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#fb792b] to-emerald-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${queueProgress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProceed} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {currentUser && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-900">
                    Logged in as <strong>{currentUser.fullName}</strong> • Aadhaar e-KYC Linked
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  24 Bookings / Mo Quota
                </span>
              </div>
            )}

            {/* Passenger Details Section */}
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <h4 className="text-xs font-black text-[#213d77] uppercase tracking-wider">
                  PASSENGER DETAILS ({passengers.length}/6):
                </h4>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowMasterListPicker(!showMasterListPicker)}
                    className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center space-x-1.5 shadow-xs transition-colors"
                    title="Autofill passenger details from your pre-saved IRCTC Master List"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>⚡ Add from Master List</span>
                  </button>

                  {passengers.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddPassenger}
                      className="text-xs font-bold text-[#fb792b] hover:text-[#e56517] flex items-center space-x-1 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Add Passenger</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Master Passenger List Picker Card */}
              {showMasterListPicker && (
                <div className="mb-4 bg-emerald-50/90 border border-emerald-300 rounded-xl p-3.5 text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-900 flex items-center space-x-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-700" />
                      <span>IRCTC Saved Master List (1-Click Instant Autofill):</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowMasterListPicker(false)}
                      className="text-emerald-700 hover:text-emerald-900 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  {masterList.length === 0 ? (
                    <p className="text-[11px] text-slate-500 italic">No saved passengers found in your Master List.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      {masterList.map((mp) => (
                        <button
                          key={mp.id}
                          type="button"
                          onClick={() => handleSelectFromMasterList(mp)}
                          className="bg-white p-2.5 rounded-lg border border-emerald-200 hover:border-emerald-500 hover:shadow-sm text-left transition-all group"
                        >
                          <div className="font-extrabold text-slate-900 group-hover:text-emerald-700">
                            {mp.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {mp.age} Yrs • {mp.gender} • {mp.berthPreference} Berth
                          </div>
                          {mp.seniorCitizen && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-bold">
                              Senior Citizen
                            </span>
                          )}
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Aadhaar: {mp.aadhaar ? `XXXX-${mp.aadhaar.slice(-4)}` : "Verified"}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                {passengers.map((p, index) => {
                  const isSenior = parseInt(p.age, 10) >= 60;
                  return (
                    <div
                      key={index}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative space-y-3 text-xs"
                    >
                      <div className="flex justify-between items-center text-slate-500 font-bold text-[11px]">
                        <span>PASSENGER #{index + 1}</span>
                        {passengers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePassenger(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        {/* Name */}
                        <div className="sm:col-span-5">
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Name (as on official ID)
                          </label>
                          <input
                            type="text"
                            required
                            value={p.name}
                            onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium outline-none focus:ring-1 focus:ring-[#213d77]"
                          />
                        </div>

                        {/* Age */}
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Age
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            max="110"
                            value={p.age}
                            onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
                            placeholder="Age"
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium outline-none focus:ring-1 focus:ring-[#213d77]"
                          />
                        </div>

                        {/* Gender */}
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Gender
                          </label>
                          <select
                            value={p.gender}
                            onChange={(e) => handlePassengerChange(index, "gender", e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-900 font-medium outline-none focus:ring-1 focus:ring-[#213d77]"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Transgender">Transgender</option>
                          </select>
                        </div>

                        {/* Berth Preference */}
                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Berth Preference
                          </label>
                          <select
                            value={p.preference}
                            onChange={(e) => handlePassengerChange(index, "preference", e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-900 font-medium outline-none focus:ring-1 focus:ring-[#213d77]"
                          >
                            <option value="LB">Lower Berth (LB)</option>
                            <option value="MB">Middle Berth (MB)</option>
                            <option value="UB">Upper Berth (UB)</option>
                            <option value="SL">Side Lower (SL)</option>
                            <option value="SU">Side Upper (SU)</option>
                            <option value="NO">No Preference</option>
                          </select>
                        </div>
                      </div>

                      {/* Row 2: Food & Aadhaar */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                        <div className="sm:col-span-4">
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Food Choice
                          </label>
                          <select
                            value={p.food}
                            onChange={(e) => handlePassengerChange(index, "food", e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium outline-none focus:ring-1 focus:ring-[#213d77]"
                          >
                            <option value="VEG">Veg Food</option>
                            <option value="NON_VEG">Non-Veg Food</option>
                            <option value="NO_FOOD">No Food</option>
                          </select>
                        </div>

                        <div className="sm:col-span-8">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-slate-700">
                              Aadhaar Number (12 Digits) {quota === "TATKAL" ? <span className="text-red-600 font-bold">* (Mandatory for Tatkal)</span> : <span className="text-slate-500 font-normal">(Optional)</span>}
                            </label>
                            {p.aadhaar && (
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                p.aadhaar.length === 12
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : "bg-amber-100 text-amber-800 border border-amber-300"
                              }`}>
                                {p.aadhaar.length}/12 digits {p.aadhaar.length === 12 ? "✓ Valid" : "(Needs 12)"}
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={12}
                            value={p.aadhaar}
                            onChange={(e) => handlePassengerChange(index, "aadhaar", e.target.value)}
                            placeholder="Enter 12-digit numeric Aadhaar (e.g. 568912347890)"
                            className={`w-full bg-white border rounded-lg px-3 py-1.5 text-slate-900 font-mono text-xs outline-none focus:ring-2 ${
                              p.aadhaar && p.aadhaar.length === 12
                                ? "border-emerald-400 focus:ring-emerald-500"
                                : p.aadhaar && p.aadhaar.length > 0
                                ? "border-amber-400 focus:ring-amber-500"
                                : "border-slate-300 focus:ring-[#213d77]"
                            }`}
                          />
                        </div>
                      </div>

                      {isSenior && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-2 text-[11px] flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Senior Citizen recognized: Lower Berth (LB) will be automatically allocated by PRS.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* IRCTC Preferences & Travel Insurance */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
              <h4 className="font-bold text-[#213d77] uppercase tracking-wider text-[11px]">
                OTHER PREFERENCES & INSURANCE:
              </h4>

              <div className="space-y-2 text-slate-700">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoUpgradation}
                    onChange={(e) => setAutoUpgradation(e.target.checked)}
                    className="rounded text-[#213d77] focus:ring-0"
                  />
                  <span>Consider for Auto Upgradation (Free upgrade to higher AC class if vacant)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmBerthsOnly}
                    onChange={(e) => setConfirmBerthsOnly(e.target.checked)}
                    className="rounded text-[#213d77] focus:ring-0"
                  />
                  <span>Book only if confirm berths are allotted</span>
                </label>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={travelInsurance}
                      onChange={(e) => setTravelInsurance(e.target.checked)}
                      className="rounded text-[#213d77] focus:ring-0"
                    />
                    <span>Travel Insurance (₹0.45 per passenger) • Covered by Indian Railways</span>
                  </label>
                  <span className="font-bold text-slate-500">₹{insuranceFee.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Anti-Agent Proof-of-Human Challenge */}
            <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-[#213d77] flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>ANTI-AGENT PROOF-OF-HUMAN VERIFICATION</span>
                </span>
                <span className="text-[11px] font-bold text-slate-600">
                  {isHumanVerified ? "✓ VERIFIED HUMAN" : "Slide to confirm you are not an agent bot"}
                </span>
              </div>

              {/* Slider */}
              <div className="relative bg-white h-11 rounded-lg border border-slate-300 overflow-hidden flex items-center">
                <div
                  className="bg-emerald-500/20 h-full transition-all"
                  style={{ width: `${sliderPosition}%` }}
                />
                {!isHumanVerified ? (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setSliderPosition(val);
                      if (val >= 90) {
                        setIsHumanVerified(true);
                        setSliderPosition(100);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-bold text-slate-600">
                  {isHumanVerified ? (
                    <span className="text-emerald-700 flex items-center space-x-1 font-mono">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>HUMAN VERIFIED • ZERO AGENT BOT PENALTY</span>
                    </span>
                  ) : (
                    <span>➔ Slide bar to unlock booking ➔</span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer: Fare Breakdown & Submit */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 block">
                  Total Amount ({passengers.length} Passenger{passengers.length > 1 ? "s" : ""}):
                </span>
                <span className="text-2xl font-black text-[#213d77]">
                  ₹{totalFare.toLocaleString()}
                  <span className="text-xs font-normal text-slate-500 ml-2">
                    (Ticket: ₹{baseTicketFare} + Fee: ₹35.40)
                  </span>
                </span>
              </div>

              <div className="flex space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial px-8 py-3 bg-[#fb792b] hover:bg-[#e56517] text-white font-black rounded-lg shadow-md text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center space-x-2 transition-transform active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>
                    {quota === "TATKAL" ? "Enter Fair Tatkal Queue" : "Proceed to Payment"}
                  </span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
