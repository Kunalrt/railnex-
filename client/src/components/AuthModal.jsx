import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Lock,
  Mail,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  LogOut,
  MapPin,
  Calendar,
  KeyRound,
  FileCheck,
  AlertCircle
} from "lucide-react";
import RailNexLogo from "./RailNexLogo";

export default function AuthModal({ isOpen, onClose, currentUser, onLoginSuccess, onLogout, initialMode = "login" }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState(initialMode); // "login" | "register" | "profile"
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginCaptchaInput, setLoginCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("7B8K2");
  const [useOtpLogin, setUseOtpLogin] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Register form state
  const [regData, setRegData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    mobile: "",
    gender: "Male",
    dob: "1998-05-15",
    occupation: "Professional",
    maritalStatus: "Unmarried",
    aadhaarNumber: "",
    address: "",
    city: "Ranchi",
    state: "Jharkhand",
    pincode: "834001",
    securityQuestion: "What is your pet's name?",
    securityAnswer: "Tiger",
    agreeTerms: true
  });

  const [regStep, setRegStep] = useState(1); // Step 1: Basic & Login, Step 2: Personal & KYC, Step 3: Address & Finish
  const [regOtp, setRegOtp] = useState("");
  const [regOtpSent, setRegOtpSent] = useState(false);

  // Generate random captcha
  const generateCaptcha = () => {
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setLoginCaptchaInput("");
  };

  useEffect(() => {
    if (currentUser) {
      setMode("profile");
    } else {
      setMode(initialMode);
      generateCaptcha();
    }
  }, [currentUser, initialMode, isOpen]);

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!loginIdentifier.trim()) {
      setError("Please enter your Username or Mobile Number.");
      return;
    }

    if (useOtpLogin) {
      if (!loginOtp.trim()) {
        setError("Please enter the 6-digit OTP sent to your mobile (Use 139139).");
        return;
      }
    } else {
      if (!loginPassword.trim()) {
        setError("Please enter your Password.");
        return;
      }
      if (loginCaptchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
        setError("Captcha does not match. Please enter the characters shown in the image.");
        generateCaptcha();
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginIdentifier.trim(),
          password: loginPassword,
          useOtp: useOtpLogin,
          otp: loginOtp.trim()
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        localStorage.setItem("railnex_user", JSON.stringify(data.user));
        localStorage.setItem("railnex_username", data.user.username);
        if (data.token) localStorage.setItem("railnex_token", data.token);
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 500);
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Failed to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Demo Login
  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "kunal_rail",
          password: "password123"
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("railnex_user", JSON.stringify(data.user));
        onLoginSuccess(data.user);
        onClose();
      }
    } catch {
      setError("Failed demo login");
    } finally {
      setLoading(false);
    }
  };

  // Send Login OTP
  const handleSendLoginOtp = async () => {
    if (!loginIdentifier.trim()) {
      setError("Please enter your mobile number first.");
      return;
    }
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: loginIdentifier })
      });
      const data = await res.json();
      setOtpSent(true);
      setLoginOtp("139139"); // autofill for user convenience
      setSuccessMsg(data.message + " (Autofilled test code: 139139)");
    } catch (e) {
      setError("Could not send OTP.");
    }
  };

  // Handle Registration Step validation & submission
  const handleRegisterSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (regStep === 1) {
      if (!regData.username.trim() || regData.username.length < 3) {
        setError("Username must be at least 3 characters long.");
        return;
      }
      if (!regData.password || regData.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      if (regData.password !== regData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      setRegStep(2);
      return;
    }

    if (regStep === 2) {
      if (!regData.fullName.trim()) {
        setError("Full Name is required.");
        return;
      }
      if (!regData.email.trim() || !regData.email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!regData.mobile.trim() || regData.mobile.replace(/\D/g, "").length < 10) {
        setError("Please enter a valid 10-digit mobile number.");
        return;
      }
      if (regData.aadhaarNumber) {
        const cleanAadhaar = regData.aadhaarNumber.replace(/\D/g, "");
        if (cleanAadhaar.length !== 12) {
          setError("Aadhaar Number must be numeric and exactly 12 digits.");
          return;
        }
      }
      setRegStep(3);
      return;
    }

    // Step 3 submission
    if (!regData.agreeTerms) {
      setError("Please accept the IRCTC e-Ticketing Terms & Conditions.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        localStorage.setItem("railnex_user", JSON.stringify(data.user));
        localStorage.setItem("railnex_username", data.user.username);
        if (data.token) localStorage.setItem("railnex_token", data.token);
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 800);
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (err) {
      setError("Network error connecting to CRIS registration gateway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
      <div className="bg-white text-slate-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-300 animate-scaleIn flex flex-col max-h-[94vh]">
        {/* Header with Official IRCTC Colors */}
        <div className="bg-[#182c57] text-white p-4 sm:p-5 border-b border-[#213d77] flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <RailNexLogo size={38} className="shrink-0 shadow-md" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono bg-[#fb792b] text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  IRCTC Smart PRS
                </span>
                <span className="text-[10px] text-slate-300">CRIS Secure Portal</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                {mode === "login"
                  ? "IRCTC Individual Sign In"
                  : mode === "register"
                  ? "New User Registration"
                  : "IRCTC User Profile"}
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

        {/* Anti-Agent Notice Strip */}
        <div className="bg-[#213d77] text-slate-200 px-4 py-2 text-[11px] flex items-center justify-between border-b border-blue-900/50">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Anti-Agent Protected • Aadhaar Verified Users get 24 tickets/mo</span>
          </span>
          <span className="text-[10px] text-amber-300 font-mono hidden sm:inline">1-User-1-Account</span>
        </div>

        {/* Tab Switcher (Login vs Register) when not logged in */}
        {mode !== "profile" && (
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 border-b-2 transition-colors ${
                mode === "login"
                  ? "border-[#fb792b] text-[#213d77] bg-white font-extrabold"
                  : "border-transparent hover:text-slate-900"
              }`}
            >
              <User className="w-4 h-4 text-[#fb792b]" />
              <span>Sign In (Login)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 border-b-2 transition-colors ${
                mode === "register"
                  ? "border-[#fb792b] text-[#213d77] bg-white font-extrabold"
                  : "border-transparent hover:text-slate-900"
              }`}
            >
              <FileCheck className="w-4 h-4 text-[#213d77]" />
              <span>Register Individual User</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-[#f4f6fa]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center space-x-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs flex items-center space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 1: LOGIN FORM */}
          {/* ========================================================= */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">

              {/* Username / Mobile Field */}
              <div>
                <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase tracking-wide">
                  USER NAME / MOBILE NUMBER:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter IRCTC Username or 10-digit Mobile"
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                    required
                  />
                </div>
              </div>

              {/* Password or OTP Option */}
              {!useOtpLogin ? (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-[#213d77] uppercase tracking-wide">
                      PASSWORD:
                    </label>
                    <button
                      type="button"
                      onClick={() => setUseOtpLogin(true)}
                      className="text-xs text-[#fb792b] hover:underline font-bold"
                    >
                      Login with OTP instead
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter account password"
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-[#213d77] uppercase tracking-wide">
                      6-DIGIT OTP:
                    </label>
                    <button
                      type="button"
                      onClick={() => setUseOtpLogin(false)}
                      className="text-xs text-[#213d77] hover:underline font-bold"
                    >
                      Login with Password instead
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP (e.g. 139139)"
                      className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleSendLoginOtp}
                      className="px-3.5 py-2.5 bg-blue-50 text-[#213d77] border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      {otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  </div>
                </div>
              )}

              {/* IRCTC Numeric / Text Captcha Box */}
              {!useOtpLogin && (
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 block uppercase">
                    ENTER CAPTCHA:
                  </span>
                  <div className="flex items-center gap-3">
                    {/* Stylized Captcha Canvas Box */}
                    <div className="select-none px-4 py-2 bg-gradient-to-r from-slate-800 via-blue-950 to-slate-900 text-amber-300 font-mono text-lg font-black tracking-widest rounded-lg border border-slate-700 shadow-inner flex items-center justify-center min-w-[120px]">
                      {captchaCode}
                    </div>

                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Reload Captcha"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      maxLength={6}
                      value={loginCaptchaInput}
                      onChange={(e) => setLoginCaptchaInput(e.target.value)}
                      placeholder="Type characters"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Sign In CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#fb792b] hover:bg-[#e06518] text-white font-extrabold rounded-xl shadow-md flex items-center justify-center space-x-2 text-sm transition-transform active:scale-95"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>SIGN IN TO RAILNEX PRS</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-500">Don't have an IRCTC account? </span>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-xs font-bold text-[#213d77] hover:underline"
                >
                  Register Now (Free)
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* TAB 2: REGISTRATION MULTI-STEP WIZARD */}
          {/* ========================================================= */}
          {mode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Registration Stepper Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs">
                <div className={`flex items-center space-x-1.5 font-bold ${regStep >= 1 ? "text-[#213d77]" : "text-slate-400"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${regStep >= 1 ? "bg-[#213d77] text-white" : "bg-slate-200"}`}>
                    1
                  </span>
                  <span>Basic Account</span>
                </div>
                <div className="w-6 h-0.5 bg-slate-200"></div>
                <div className={`flex items-center space-x-1.5 font-bold ${regStep >= 2 ? "text-[#213d77]" : "text-slate-400"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${regStep >= 2 ? "bg-[#213d77] text-white" : "bg-slate-200"}`}>
                    2
                  </span>
                  <span>Personal & KYC</span>
                </div>
                <div className="w-6 h-0.5 bg-slate-200"></div>
                <div className={`flex items-center space-x-1.5 font-bold ${regStep >= 3 ? "text-[#213d77]" : "text-slate-400"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${regStep >= 3 ? "bg-[#213d77] text-white" : "bg-slate-200"}`}>
                    3
                  </span>
                  <span>Address & Verify</span>
                </div>
              </div>

              {/* STEP 1: Basic Account Details */}
              {regStep === 1 && (
                <div className="space-y-3.5 bg-white p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                      USER NAME (3 to 35 characters): *
                    </label>
                    <input
                      type="text"
                      value={regData.username}
                      onChange={(e) => setRegData({ ...regData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
                      placeholder="e.g. rahul_kumar24"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                      required
                    />
                    <span className="text-[10px] text-slate-500">Only letters, numbers, and underscores allowed</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                        PASSWORD: *
                      </label>
                      <input
                        type="password"
                        value={regData.password}
                        onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        placeholder="Min 6 characters"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                        CONFIRM PASSWORD: *
                      </label>
                      <input
                        type="password"
                        value={regData.confirmPassword}
                        onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                        placeholder="Re-type password"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                      SECURITY QUESTION:
                    </label>
                    <select
                      value={regData.securityQuestion}
                      onChange={(e) => setRegData({ ...regData, securityQuestion: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                    >
                      <option>What was the name of your first school?</option>
                      <option>What is your pet's name?</option>
                      <option>What is your favorite historic place?</option>
                      <option>What was your childhood nickname?</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                      SECURITY ANSWER:
                    </label>
                    <input
                      type="text"
                      value={regData.securityAnswer}
                      onChange={(e) => setRegData({ ...regData, securityAnswer: e.target.value })}
                      placeholder="Enter your security answer"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRegisterSubmit()}
                      className="px-5 py-2.5 bg-[#213d77] hover:bg-[#182c57] text-white font-bold rounded-xl text-xs flex items-center space-x-1.5"
                    >
                      <span>Continue to Personal Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Personal Details & KYC */}
              {regStep === 2 && (
                <div className="space-y-3.5 bg-white p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                      FULL NAME (as on Aadhaar / Govt ID): *
                    </label>
                    <input
                      type="text"
                      value={regData.fullName}
                      onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                      placeholder="e.g. Rahul Kumar Sharma"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                        GENDER:
                      </label>
                      <select
                        value={regData.gender}
                        onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Transgender</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                        DATE OF BIRTH:
                      </label>
                      <input
                        type="date"
                        value={regData.dob}
                        onChange={(e) => setRegData({ ...regData, dob: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                        OCCUPATION:
                      </label>
                      <select
                        value={regData.occupation}
                        onChange={(e) => setRegData({ ...regData, occupation: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                      >
                        <option>Professional</option>
                        <option>Private</option>
                        <option>Government</option>
                        <option>Public</option>
                        <option>Student</option>
                        <option>Self Employed</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Email & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                        EMAIL ADDRESS: *
                      </label>
                      <input
                        type="email"
                        value={regData.email}
                        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        placeholder="you@email.com"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                        MOBILE NUMBER (+91): *
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={regData.mobile}
                        onChange={(e) => setRegData({ ...regData, mobile: e.target.value.replace(/\D/g, "") })}
                        placeholder="10-digit mobile"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                        required
                      />
                    </div>
                  </div>

                  {/* Aadhaar e-KYC */}
                  <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                      <div className="flex items-center space-x-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>AADHAAR / VIRTUAL ID (e-KYC VERIFICATION):</span>
                      </div>
                      {regData.aadhaarNumber && (
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          regData.aadhaarNumber.length === 12
                            ? "bg-emerald-200 text-emerald-900 border border-emerald-400"
                            : "bg-amber-100 text-amber-900 border border-amber-300"
                        }`}>
                          {regData.aadhaarNumber.length}/12 digits {regData.aadhaarNumber.length === 12 ? "✓ Valid" : "(Must be 12)"}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={12}
                      value={regData.aadhaarNumber}
                      onChange={(e) => setRegData({ ...regData, aadhaarNumber: e.target.value.replace(/\D/g, "").slice(0, 12) })}
                      placeholder="Enter 12-digit numeric Aadhaar (e.g. 568912347890)"
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-[10px] text-emerald-700 block">
                      Numeric 12-digit UIDAI number. Enables Tatkal Priority quota allocation and 24 bookings/month allowance.
                    </span>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRegisterSubmit()}
                      className="px-5 py-2.5 bg-[#213d77] hover:bg-[#182c57] text-white font-bold rounded-xl text-xs flex items-center space-x-1.5"
                    >
                      <span>Continue to Address</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Residential Address & Final Submit */}
              {regStep === 3 && (
                <div className="space-y-3.5 bg-white p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                      RESIDENTIAL ADDRESS:
                    </label>
                    <input
                      type="text"
                      value={regData.address}
                      onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                      placeholder="Flat, Door, Road, Area (e.g. Station Road, Morabadi)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                        PINCODE:
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={regData.pincode}
                        onChange={(e) => setRegData({ ...regData, pincode: e.target.value.replace(/\D/g, "") })}
                        placeholder="834001"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                        CITY / DISTRICT:
                      </label>
                      <input
                        type="text"
                        value={regData.city}
                        onChange={(e) => setRegData({ ...regData, city: e.target.value })}
                        placeholder="Ranchi"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                        STATE:
                      </label>
                      <input
                        type="text"
                        value={regData.state}
                        onChange={(e) => setRegData({ ...regData, state: e.target.value })}
                        placeholder="Jharkhand"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="flex items-start space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={regData.agreeTerms}
                        onChange={(e) => setRegData({ ...regData, agreeTerms: e.target.checked })}
                        className="mt-1 w-4 h-4 rounded text-[#213d77] focus:ring-[#213d77]"
                      />
                      <span className="text-xs text-slate-700 leading-snug">
                        I hereby declare that the details provided are correct and I am registering as an individual passenger. I agree to abide by Indian Railways Rules & Anti-Agent Policies.
                      </span>
                    </label>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setRegStep(2)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-[#fb792b] hover:bg-[#e06518] text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md flex items-center space-x-1.5 transition-transform active:scale-95"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Complete Registration</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* ========================================================= */}
          {/* TAB 3: USER PROFILE (WHEN LOGGED IN) */}
          {/* ========================================================= */}
          {mode === "profile" && currentUser && (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-3.5 border-b border-slate-100 pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#213d77] text-white flex items-center justify-center font-black text-xl shadow-md">
                    {currentUser.fullName ? currentUser.fullName.charAt(0) : "U"}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-black text-[#213d77]">{currentUser.fullName}</h3>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Aadhaar e-KYC Verified</span>
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      Username: <strong className="text-slate-700">{currentUser.username}</strong> • ID: {currentUser.id}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold">MOBILE NUMBER</span>
                    <span className="font-semibold text-slate-800">+91 {currentUser.mobile}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold">EMAIL ADDRESS</span>
                    <span className="font-semibold text-slate-800 truncate block">{currentUser.email}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold">AADHAAR TOKEN</span>
                    <span className="font-mono font-bold text-emerald-700">{currentUser.aadhaarMasked || "XXXX-XXXX-4910"}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold">MONTHLY LIMIT</span>
                    <span className="font-bold text-[#fb792b]">24 Tickets / Month</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold">STATE & CITY</span>
                    <span className="font-semibold text-slate-800">{currentUser.city || "Ranchi"}, {currentUser.state || "Jharkhand"}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold">USER TYPE</span>
                    <span className="font-semibold text-emerald-700">Individual Passenger</span>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="pt-2 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("railnex_user");
                      localStorage.removeItem("railnex_token");
                      onLogout();
                      setMode("login");
                    }}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Account</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 bg-[#213d77] hover:bg-[#182c57] text-white font-bold rounded-xl text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
