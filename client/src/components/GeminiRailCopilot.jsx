import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  RefreshCw,
  Search,
  Train,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Maximize2,
  Minimize2,
  Trash2,
  Lightbulb,
  Radio
} from "lucide-react";
import RailNexLogo from "./RailNexLogo";

export default function GeminiRailCopilot({ onGoToSearch, onSearchRoute }) {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "👋 Namaste! I am **RailNex AI Copilot**, powered by **Google Gemini AI**.\n\nAsk me anything about Indian Railways: live routes, fastest trains, Tatkal tricks, station facilities, PNR confirmation odds, or train food!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState(null);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "📍 Live location of Purushottam Express 12801 right now",
    "⚡ Fastest train between Ranchi and Delhi",
    "📍 Live status of Ranchi - Howrah Vande Bharat 20898",
    "🚄 Morning trains from Patna to Kolkata tomorrow",
    "🎯 Best strategy to get a confirmed Tatkal berth",
    "🍱 What catering and food is served in Vande Bharat?",
    "🔍 Predict confirmation odds for WL 12 in 3AC",
    "🧳 Indian Railways luggage limits & rules",
    "🔄 How does RailNex mutual berth swap work?"
  ];

  // Fetch Gemini AI server status
  useEffect(() => {
    fetch("/api/ai/status")
      .then(res => res.json())
      .then(data => setGeminiStatus(data))
      .catch(() => {});
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (msgText = input) => {
    const textToSend = typeof msgText === "string" ? msgText.trim() : input.trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const historyForApi = messages.map(m => ({
        role: m.role,
        content: m.text
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyForApi
        })
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        const aiMsg = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          text: data.reply,
          modelUsed: data.modelUsed,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        const errorMsg = {
          id: `err-${Date.now()}`,
          role: "assistant",
          text: "⚠️ " + (data.error || "Could not retrieve response from Gemini AI. Please try again."),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch {
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: "assistant",
        text: "⚠️ Network error connecting to Gemini AI Gateway. Please verify your connection.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: "👋 Chat cleared! How can I assist your Indian Railways travel today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  // Render markdown text simply
  const renderMessageContent = (text) => {
    return text.split("\n").map((line, idx) => {
      // Headers
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="font-extrabold text-[#213d77] text-sm mt-2 mb-1">{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="font-black text-[#213d77] text-base mt-2 mb-1">{line.replace("## ", "")}</h3>;
      }
      // Bullet points
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        const clean = line.trim().replace(/^[\*\-]\s+/, "");
        return (
          <li key={idx} className="ml-4 list-disc text-xs sm:text-sm text-slate-700 leading-relaxed my-0.5">
            {formatBold(clean)}
          </li>
        );
      }
      // Divider
      if (line.trim() === "---") {
        return <hr key={idx} className="my-2 border-slate-200" />;
      }
      // Regular line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-800 leading-relaxed">
          {formatBold(line)}
        </p>
      );
    });
  };

  const formatBold = (str) => {
    const parts = str.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-[#182c57]">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#213d77] text-white p-6 rounded-3xl shadow-xl border border-[#1b3260] relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 pointer-events-none bg-[radial-gradient(#fb792b_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center shrink-0">
              <RailNexLogo size={36} />
            </div>

            <div>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#fb792b] to-purple-600 text-white px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider mb-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>POWERED BY GOOGLE GEMINI AI</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Rail<span className="text-[#fb792b]">Nex</span> AI Copilot
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
                India's smartest railway intelligence assistant. Ask questions about live trains, Tatkal tactics, station amenities, and PNR predictions.
              </p>
            </div>
          </div>

          <div className="bg-[#182c57] border border-[#2c4e91] p-3 rounded-2xl flex items-center space-x-3 text-xs font-mono shrink-0">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
            <div>
              <span className="text-slate-400 block text-[10px]">GEMINI ACTIVE MODEL</span>
              <span className="text-emerald-300 font-bold">
                {geminiStatus?.activeModel?.replace("models/", "") || "gemini-3.5-flash-lite"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[600px]">
        {/* Chat Control Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-600 font-medium">
            <Bot className="w-4 h-4 text-[#fb792b]" />
            <span>Interactive Travel Intelligence</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full text-[10px]">
              Active & Grounded
            </span>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            className="text-slate-400 hover:text-red-600 flex items-center space-x-1 transition-colors text-xs"
            title="Reset Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  m.role === "user"
                    ? "bg-[#213d77] text-white"
                    : "bg-gradient-to-br from-[#fb792b] to-purple-600 text-white"
                }`}
              >
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm space-y-1.5 ${
                  m.role === "user"
                    ? "bg-[#213d77] text-white rounded-tr-none"
                    : "bg-white text-slate-900 border border-slate-200 rounded-tl-none"
                }`}
              >
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1 mb-1 text-[10px]">
                  <span className={`font-bold ${m.role === "user" ? "text-slate-300" : "text-[#213d77]"}`}>
                    {m.role === "user" ? "You (Traveler)" : "RailNex AI Copilot (Gemini)"}
                  </span>
                  <span className={`font-mono ${m.role === "user" ? "text-slate-300" : "text-slate-400"}`}>
                    {m.timestamp}
                  </span>
                </div>

                <div className="leading-relaxed">
                  {m.role === "user" ? (
                    <p className="text-xs sm:text-sm whitespace-pre-wrap">{m.text}</p>
                  ) : (
                    renderMessageContent(m.text)
                  )}
                </div>

                {m.modelUsed && (
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Engine: {m.modelUsed.replace("models/", "")}</span>
                    <span className="text-emerald-600 font-semibold">Verified IRCTC Knowledge</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#fb792b] to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center space-x-2 text-xs text-slate-600 font-mono">
                <RefreshCw className="w-4 h-4 animate-spin text-[#fb792b]" />
                <span>Gemini AI is querying Indian Railways Knowledge Matrix...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-white border-t border-slate-200 px-4 py-2.5 overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center space-x-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Try:</span>
          </span>
          {quickPrompts.map((q, qIdx) => (
            <button
              key={qIdx}
              type="button"
              onClick={() => handleSendMessage(q)}
              disabled={loading}
              className="px-2.5 py-1 bg-slate-100 hover:bg-orange-50 hover:text-[#fb792b] hover:border-orange-200 text-slate-700 border border-slate-200 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* User Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="bg-white p-3 sm:p-4 border-t border-slate-200 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask RailNex Gemini AI about trains, Tatkal tricks, station lounges, PNR..."
              className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-[#213d77] focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 bg-[#fb792b] hover:bg-[#e06518] disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-md flex items-center justify-center transition-transform active:scale-95"
            title="Send Message to Gemini"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
