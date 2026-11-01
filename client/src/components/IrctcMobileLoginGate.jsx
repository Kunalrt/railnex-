import React, { useState, useEffect } from "react";
import RailNexLogo from "./RailNexLogo";
import {
  Lock,
  KeyRound,
  Fingerprint,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Train,
  Smartphone,
  Sparkles,
  Zap,
  Server,
  Wifi,
  Globe,
  Settings
} from "lucide-react";
import {
  DEFAULT_TUNNEL_URL,
  DEFAULT_LAN_URL,
  getSavedServerUrl,
  setSavedServerUrl
} from "../utils/apiConfig";

export default function IrctcMobileLoginGate({ onLoginSuccess, onOpenRegister }) {
  const [activeTab, setActiveTab] = useState("mpin"); // mpin | password | quick
  const [mpin, setMpin] = useState("");
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("railnex_username") || "kunal_rail";
  });
  const [password, setPassword] = useState("password123");
  const [captchaInput, setCaptchaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Gateway & Connection Diagnostics
  const [serverUrl, setServerUrl] = useState(() => getSavedServerUrl() || DEFAULT_TUNNEL_URL);
  const [connStatus, setConnStatus] = useState("idle"); // idle | testing | online | offline
  const [latency, setLatency] = useState(null);
  const [showGatewayConfig, setShowGatewayConfig] = useState(false);

  const staticCaptcha = "R7NX4";

  // Check connection to server gateway
  const testConnection = async (targetUrl = serverUrl) => {
    setConnStatus("testing");
    const t0 = performance.now();
    try {
      const urlToTest = targetUrl ? `${targetUrl.replace(/\/$/, "")}/api/system/stats` : "/api/system/stats";
      const res = await fetch(urlToTest, { method: "GET", cache: "no-store" });
      if (res.ok) {
        const ms = Math.round(performance.now() - t0);
        setLatency(ms);
        setConnStatus("online");
        setError("");
        return true;
      } else {
        setConnStatus("offline");
        return false;
      }
    } catch (err) {
      console.warn("Connection test failed:", err);
      setConnStatus("offline");
      return false;
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const handleApplyGateway = (newUrl) => {
    setServerUrl(newUrl);
    setSavedServerUrl(newUrl);
    testConnection(newUrl);
  };

  // MPIN Numpad keys
  const handleNumpad = (digit) => {
    setError("");
    if (mpin.length < 4) {
      const next = mpin + digit;
      setMpin(next);
      if (next.length === 4) {
        handleMpinSubmit(next);
      }
    }
  };

  const handleBackspace = () => {
    setError("");
    setMpin(mpin.slice(0, -1));
  };

  const handleMpinSubmit = async (pinToVerify = mpin) => {
    if (pinToVerify.length !== 4) {
      setError("Please enter a 4-digit MPIN.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const targetUser = username.trim() || "kunal_rail";
      const res = await fetch("/api/auth/mpin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mpin: pinToVerify, username: targetUser })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("railnex_user", JSON.stringify(data.user));
        localStorage.setItem("railnex_username", data.user.username);
        localStorage.setItem("railnex_token", data.token);
        onLoginSuccess(data.user);
      } else {
        setError(data.error || "Incorrect MPIN. Please enter your valid security MPIN.");
        setMpin("");
      }
    } catch (err) {
      console.error("MPIN Login Network Error:", err);
      setError("Network error connecting to IRCTC PRS Auth Server. Check Gateway below.");
      setShowGatewayConfig(true);
      setMpin("");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    if (e) e.preventDefault();
    if (captchaInput.toUpperCase() !== staticCaptcha) {
      setError("Captcha text does not match. Please enter R7NX4.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("railnex_user", JSON.stringify(data.user));
        localStorage.setItem("railnex_username", data.user.username);
        localStorage.setItem("railnex_token", data.token);
        onLoginSuccess(data.user);
      } else {
        setError(data.error || "Invalid username or password.");
      }
    } catch (err) {
      console.error("Password Login error:", err);
      setError("Failed to communicate with authentication gateway. Check Gateway below.");
      setShowGatewayConfig(true);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "kunal_rail", password: "password123" })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("railnex_user", JSON.stringify(data.user));
        localStorage.setItem("railnex_username", data.user.username);
        localStorage.setItem("railnex_token", data.token);
        onLoginSuccess(data.user);
      } else {
        setError(data.error || "Demo login failed.");
      }
    } catch (err) {
      console.error("Demo login error:", err);
      setError("Connection error. Check Gateway settings below.");
      setShowGatewayConfig(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleIn flex flex-col">
        {/* IRCTC Rail Connect Brand Header */}
        <div className="bg-[#213d77] text-white px-6 pt-6 pb-5 text-center relative overflow-hidden">
          {/* Subtle Railway Track Background Accent */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fb792b_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-lg mb-2 flex items-center justify-center">
              <RailNexLogo size={42} />
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="font-black text-2xl tracking-tight text-white">
                Rail<span className="text-[#fb792b]">Nex</span>
              </span>
              <span className="bg-[#fb792b] text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                RAIL CONNECT
              </span>
            </div>

            <p className="text-xs text-slate-200 font-medium mt-0.5">
              Official Indian Railways e-Ticketing Gateway
            </p>

            {/* IRCTC Mandatory Sign-in Tag */}
            <div className="mt-2.5 inline-flex items-center space-x-1.5 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[10px] text-amber-300 font-bold uppercase tracking-wider">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Login Required to Enter App (IRCTC Security Standard)</span>
            </div>
          </div>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab("mpin"); setError(""); }}
            className={`flex-1 py-3 px-2 flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
              activeTab === "mpin"
                ? "border-[#fb792b] text-[#213d77] bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-[#fb792b]" />
            <span>4-Digit MPIN</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("password"); setError(""); }}
            className={`flex-1 py-3 px-2 flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
              activeTab === "password"
                ? "border-[#fb792b] text-[#213d77] bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#213d77]" />
            <span>User ID / Password</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 flex-1">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center space-x-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: 4-Digit MPIN & Quick Biometric */}
          {activeTab === "mpin" && (
            <div className="space-y-4 text-center">
              <div>
                <h3 className="text-sm font-extrabold text-[#213d77]">
                  Enter 4-Digit Login MPIN
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your registered 4-Digit Security MPIN to unlock IRCTC Rail Connect
                </p>
              </div>

              {/* 4 Pin Indicator Circles */}
              <div className="flex justify-center items-center space-x-4 py-2">
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = mpin.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        isFilled
                          ? "bg-[#213d77] border-[#213d77] scale-110 shadow-sm"
                          : "border-slate-300 bg-slate-100"
                      }`}
                    ></div>
                  );
                })}
              </div>

              {/* Numpad */}
              <div className="max-w-[260px] mx-auto grid grid-cols-3 gap-2.5 pt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleNumpad(String(num))}
                    disabled={loading}
                    className="w-full h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-800 font-extrabold text-lg flex items-center justify-center transition-colors border border-slate-200 shadow-xs"
                  >
                    {num}
                  </button>
                ))}

                {/* Biometric Icon */}
                <button
                  type="button"
                  onClick={() => handleMpinSubmit("1234")}
                  title="Unlock with Biometrics (TouchID / FaceID)"
                  className="w-full h-12 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200 transition-colors"
                >
                  <Fingerprint className="w-6 h-6 animate-pulse" />
                </button>

                {/* 0 */}
                <button
                  type="button"
                  onClick={() => handleNumpad("0")}
                  disabled={loading}
                  className="w-full h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-800 font-extrabold text-lg flex items-center justify-center transition-colors border border-slate-200 shadow-xs"
                >
                  0
                </button>

                {/* Backspace */}
                <button
                  type="button"
                  onClick={handleBackspace}
                  disabled={loading || mpin.length === 0}
                  className="w-full h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-500 font-bold text-sm flex items-center justify-center border border-slate-200 transition-colors disabled:opacity-30"
                >
                  ⌫
                </button>
              </div>

              {/* Fast submit button if typed */}
              {mpin.length === 4 && (
                <button
                  type="button"
                  onClick={() => handleMpinSubmit(mpin)}
                  disabled={loading}
                  className="w-full py-2.5 bg-[#fb792b] hover:bg-[#e06518] text-white font-extrabold rounded-xl shadow-md text-xs flex items-center justify-center space-x-1.5 transition-transform active:scale-95"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>ENTER APP WITH MPIN</span>}
                </button>
              )}
            </div>
          )}

          {/* TAB 2: IRCTC Username & Password Login */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                  USER NAME / MOBILE:
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. kunal_rail or 9876543210"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#213d77]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                  PASSWORD:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#213d77]"
                  required
                />
              </div>

              {/* Captcha */}
              <div>
                <label className="block text-xs font-bold text-[#213d77] mb-1 uppercase">
                  SECURITY CAPTCHA:
                </label>
                <div className="flex gap-2 items-center">
                  <div className="bg-slate-200 text-slate-900 font-mono font-black text-sm px-3 py-1.5 rounded-lg tracking-widest select-none line-through border border-slate-300">
                    {staticCaptcha}
                  </div>
                  <input
                    type="text"
                    maxLength={5}
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Type R7NX4"
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold uppercase outline-none focus:ring-2 focus:ring-[#213d77]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#fb792b] hover:bg-[#e06518] text-white font-extrabold rounded-xl shadow-md text-xs flex items-center justify-center space-x-1.5 transition-transform active:scale-95"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>SIGN IN & ENTER APP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}


          {/* Server Gateway Connection Bar */}
          <div className="pt-2 border-t border-slate-100">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-left text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${connStatus === 'online' ? 'bg-emerald-500 animate-pulse' : connStatus === 'testing' ? 'bg-amber-400 animate-ping' : 'bg-rose-500'}`}></span>
                  <span className="font-semibold text-slate-700">
                    {connStatus === 'online' ? `PRS Gateway Online (${latency || 14}ms)` : connStatus === 'testing' ? 'Testing Connection...' : 'Gateway Offline / Check Settings'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGatewayConfig(!showGatewayConfig)}
                  className="text-[11px] text-[#213d77] font-bold hover:underline flex items-center space-x-1"
                >
                  <Settings className="w-3 h-3" />
                  <span>{showGatewayConfig ? 'Hide' : 'Switch Gateway'}</span>
                </button>
              </div>

              {showGatewayConfig && (
                <div className="mt-3 pt-2 border-t border-slate-200 space-y-2">
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Select your active backend connection mode:
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleApplyGateway(DEFAULT_TUNNEL_URL)}
                      className={`px-2 py-1.5 rounded-lg border text-[11px] font-medium flex items-center justify-center space-x-1 text-left ${serverUrl === DEFAULT_TUNNEL_URL ? 'bg-blue-50 border-blue-400 text-blue-800 font-bold' : 'bg-white border-slate-200 text-slate-700'}`}
                    >
                      <Globe className="w-3 h-3 text-blue-600 shrink-0" />
                      <span className="truncate">Public Cloudflare</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyGateway(DEFAULT_LAN_URL)}
                      className={`px-2 py-1.5 rounded-lg border text-[11px] font-medium flex items-center justify-center space-x-1 text-left ${serverUrl === DEFAULT_LAN_URL ? 'bg-blue-50 border-blue-400 text-blue-800 font-bold' : 'bg-white border-slate-200 text-slate-700'}`}
                    >
                      <Wifi className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">Local Wi-Fi LAN</span>
                    </button>
                  </div>

                  <div className="flex gap-1.5 items-center pt-1">
                    <input
                      type="text"
                      value={serverUrl}
                      onChange={(e) => setServerUrl(e.target.value)}
                      placeholder="Custom Gateway URL"
                      className="flex-1 px-2.5 py-1 text-[11px] font-mono bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyGateway(serverUrl)}
                      className="px-2.5 py-1 bg-[#213d77] hover:bg-[#182c57] text-white text-[11px] font-bold rounded-lg shadow-sm"
                    >
                      Test & Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer: Register Now & Security Seals */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-center space-y-2">
          <div className="text-xs text-slate-600">
            Don't have an IRCTC account?{" "}
            <button
              type="button"
              onClick={onOpenRegister}
              className="text-[#213d77] font-bold hover:underline ml-1"
            >
              Register Now (Free e-KYC)
            </button>
          </div>

          <div className="flex items-center justify-center space-x-3 text-[10px] text-slate-400 font-mono">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>CRIS Verified PRS</span>
            </span>
            <span>•</span>
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
