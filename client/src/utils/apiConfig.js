// Smart Railway PRS API Gateway Resolver for Mobile, Web & PWA
export const DEFAULT_TUNNEL_URL = "https://costs-aka-flood-match.trycloudflare.com";
export const DEFAULT_LAN_URL = "http://192.168.31.52:5000";

export function getSavedServerUrl() {
  if (typeof window === "undefined") return "";
  const saved = localStorage.getItem("railnex_server_url");
  if (saved) return saved.trim().replace(/\/$/, "");

  // Auto-detect environment:
  const isCapacitor = Boolean(
    window.Capacitor || 
    window.location.protocol === "capacitor:" ||
    (window.location.hostname === "localhost" && !["5173", "5000"].includes(window.location.port))
  );

  if (isCapacitor) {
    return DEFAULT_TUNNEL_URL;
  }

  // If running in browser on trycloudflare domain, empty string uses relative URLs directly
  if (window.location.hostname.includes("trycloudflare.com")) {
    return "";
  }

  return "";
}

export function setSavedServerUrl(url) {
  if (typeof window === "undefined") return;
  if (!url) {
    localStorage.removeItem("railnex_server_url");
  } else {
    localStorage.setItem("railnex_server_url", url.trim().replace(/\/$/, ""));
  }
}

export function resolveApiUrl(path) {
  if (!path.startsWith("/api")) return path;
  const baseUrl = getSavedServerUrl();
  if (!baseUrl) return path;
  return `${baseUrl}${path}`;
}

// Global fetch patch to ensure all mobile/PWA/Capacitor requests route to active gateway
export function setupGlobalFetchInterceptor() {
  if (typeof window === "undefined" || window._railFetchPatched) return;
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    let url = typeof input === "string" ? input : input instanceof URL ? input.toString() : (input?.url || "");

    if (typeof url === "string" && url.startsWith("/api")) {
      const resolved = resolveApiUrl(url);
      try {
        const response = await originalFetch(resolved, init);
        return response;
      } catch (err) {
        // If primary attempt failed and wasn't using the fallback tunnel, attempt fallback
        const baseUrl = getSavedServerUrl();
        if (baseUrl !== DEFAULT_TUNNEL_URL) {
          console.warn(`[RailGateway] Request failed to ${resolved}, retrying with public tunnel ${DEFAULT_TUNNEL_URL}...`);
          try {
            const fallbackUrl = `${DEFAULT_TUNNEL_URL}${url}`;
            const fallbackRes = await originalFetch(fallbackUrl, init);
            return fallbackRes;
          } catch (fallbackErr) {
            console.error(`[RailGateway] Fallback request to ${DEFAULT_TUNNEL_URL} also failed:`, fallbackErr);
            throw err;
          }
        }
        throw err;
      }
    }

    return originalFetch(input, init);
  };

  window._railFetchPatched = true;
}
