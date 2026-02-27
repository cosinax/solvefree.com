"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useEffect, useState } from "react";

/* ── types ───────────────────────────────────────────────────── */
interface FPRow {
  label: string;
  value: string;
  bits?: number; // estimated entropy contribution
  category: string;
}

/* ── helpers ─────────────────────────────────────────────────── */
function ent(uniqueness: number): number {
  return parseFloat(Math.log2(uniqueness).toFixed(2));
}

function canvasFingerprint(): string {
  try {
    const c = document.createElement("canvas");
    c.width = 200; c.height = 50;
    const ctx = c.getContext("2d")!;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(0, 0, 200, 50);
    ctx.fillStyle = "#069";
    ctx.font = "15px Arial";
    ctx.fillText("SolveFree 🔐 fingerprint", 4, 30);
    ctx.fillStyle = "rgba(102,204,0,0.7)";
    ctx.font = "12px Georgia";
    ctx.fillText("Canvas API test Ω ∑", 4, 45);
    return c.toDataURL().slice(-32);
  } catch { return "blocked"; }
}

function audioFingerprint(): Promise<string> {
  return new Promise(resolve => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const analyser = ctx.createAnalyser();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.type = "triangle";
      osc.connect(analyser);
      analyser.connect(gain);
      gain.connect(ctx.destination);
      osc.start(0);
      setTimeout(() => {
        const buf = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(buf);
        osc.stop();
        ctx.close();
        const hash = buf.slice(0, 10).reduce((s, v) => s + Math.abs(v).toFixed(4), "");
        resolve(hash.slice(0, 20) || "flat");
      }, 100);
    } catch { resolve("blocked"); }
  });
}

function webglInfo(): { vendor: string; renderer: string; version: string } {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl") || c.getContext("experimental-webgl") as WebGLRenderingContext | null;
    if (!gl) return { vendor: "none", renderer: "none", version: "none" };
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    return {
      vendor: dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
      renderer: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
      version: gl.getParameter(gl.VERSION),
    };
  } catch { return { vendor: "blocked", renderer: "blocked", version: "blocked" }; }
}

function getTimezone(): string {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return "unknown"; }
}

function getFonts(): string {
  // Probe a known set of fonts via canvas text measurement
  const testFonts = [
    "Arial", "Verdana", "Georgia", "Times New Roman", "Courier New",
    "Trebuchet MS", "Impact", "Comic Sans MS", "Palatino", "Garamond",
    "Bookman", "Avant Garde", "Helvetica", "Monaco", "Optima",
    "Futura", "Geneva", "Lucida", "Tahoma", "Century Gothic",
  ];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = "72px monospace";
  const base = ctx.measureText("mmmmmmmmmmlli").width;
  const present: string[] = [];
  for (const f of testFonts) {
    ctx.font = `72px '${f}', monospace`;
    if (ctx.measureText("mmmmmmmmmmlli").width !== base) present.push(f);
  }
  return present.join(", ") || "none detected";
}

function hashStr(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16).padStart(8, "0");
}

/* ── main component ──────────────────────────────────────────── */
export default function FingerprintPage() {
  const [rows, setRows] = useState<FPRow[]>([]);
  const [fingerprint, setFingerprint] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function collect() {
      const nav = navigator;
      const scr = screen;
      const collected: FPRow[] = [];

      // ── Browser / OS ──
      collected.push({ category: "Browser", label: "User Agent", value: nav.userAgent, bits: ent(10000) });
      collected.push({ category: "Browser", label: "Browser Language", value: nav.language, bits: ent(30) });
      collected.push({ category: "Browser", label: "Languages", value: (nav.languages || []).join(", "), bits: ent(50) });
      collected.push({ category: "Browser", label: "Platform", value: nav.platform, bits: ent(8) });
      collected.push({ category: "Browser", label: "Do Not Track", value: nav.doNotTrack ?? "unset", bits: ent(3) });
      collected.push({ category: "Browser", label: "Cookies Enabled", value: String(nav.cookieEnabled), bits: ent(2) });
      collected.push({ category: "Browser", label: "Java Enabled", value: String(nav.javaEnabled?.()), bits: ent(2) });
      collected.push({ category: "Browser", label: "PDF Viewer Plugin", value: String(!!nav.pdfViewerEnabled), bits: ent(2) });

      // ── Hardware ──
      collected.push({ category: "Hardware", label: "CPU Cores", value: String(nav.hardwareConcurrency ?? "unknown"), bits: ent(6) });
      collected.push({ category: "Hardware", label: "Device Memory (GB)", value: String((nav as unknown as { deviceMemory?: number }).deviceMemory ?? "unknown"), bits: ent(5) });
      collected.push({ category: "Hardware", label: "Max Touch Points", value: String(nav.maxTouchPoints), bits: ent(4) });

      // ── Screen ──
      collected.push({ category: "Screen", label: "Screen Resolution", value: `${scr.width}×${scr.height}`, bits: ent(200) });
      collected.push({ category: "Screen", label: "Available Resolution", value: `${scr.availWidth}×${scr.availHeight}`, bits: ent(200) });
      collected.push({ category: "Screen", label: "Color Depth", value: `${scr.colorDepth}-bit`, bits: ent(4) });
      collected.push({ category: "Screen", label: "Pixel Ratio", value: String(window.devicePixelRatio), bits: ent(8) });
      collected.push({ category: "Screen", label: "Orientation", value: screen.orientation?.type ?? "unknown", bits: ent(4) });

      // ── Time ──
      collected.push({ category: "System", label: "Timezone", value: getTimezone(), bits: ent(400) });
      collected.push({ category: "System", label: "UTC Offset (min)", value: String(new Date().getTimezoneOffset()), bits: ent(30) });
      collected.push({ category: "System", label: "Local Time", value: new Date().toLocaleString(), bits: ent(1) });

      // ── Network ──
      const conn = (nav as unknown as { connection?: { effectiveType?: string; type?: string; downlink?: number } }).connection;
      collected.push({ category: "Network", label: "Connection Type", value: conn?.effectiveType ?? "unknown", bits: ent(5) });
      collected.push({ category: "Network", label: "Downlink (Mbps)", value: conn ? String(conn.downlink ?? "unknown") : "unknown", bits: ent(20) });

      // ── Plugins ──
      const plugins = Array.from(nav.plugins || []).map(p => p.name).join(", ");
      collected.push({ category: "Browser", label: "Plugins", value: plugins || "none", bits: ent(50) });

      // ── Canvas ──
      const cv = canvasFingerprint();
      collected.push({ category: "Canvas", label: "Canvas Hash (tail)", value: cv, bits: ent(10000) });

      // ── WebGL ──
      const wgl = webglInfo();
      collected.push({ category: "WebGL", label: "WebGL Vendor", value: wgl.vendor, bits: ent(500) });
      collected.push({ category: "WebGL", label: "WebGL Renderer", value: wgl.renderer, bits: ent(5000) });
      collected.push({ category: "WebGL", label: "WebGL Version", value: wgl.version, bits: ent(10) });

      // ── Fonts ──
      const fonts = getFonts();
      collected.push({ category: "Fonts", label: "Detected Fonts", value: fonts, bits: ent(1000) });

      // ── Audio ──
      const audio = await audioFingerprint();
      collected.push({ category: "Audio", label: "Audio Hash", value: audio, bits: ent(1000) });

      // ── Storage ──
      collected.push({ category: "Storage", label: "localStorage", value: String(typeof localStorage !== "undefined"), bits: ent(2) });
      collected.push({ category: "Storage", label: "sessionStorage", value: String(typeof sessionStorage !== "undefined"), bits: ent(2) });
      collected.push({ category: "Storage", label: "IndexedDB", value: String(typeof indexedDB !== "undefined"), bits: ent(2) });

      // ── Misc ──
      collected.push({ category: "Misc", label: "WebRTC Support", value: String(!!(window.RTCPeerConnection)), bits: ent(2) });
      collected.push({ category: "Misc", label: "ServiceWorker Support", value: String("serviceWorker" in nav), bits: ent(2) });
      collected.push({ category: "Misc", label: "WebAssembly Support", value: String(typeof WebAssembly !== "undefined"), bits: ent(2) });
      collected.push({ category: "Misc", label: "Reduce Motion Pref", value: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduce" : "no-preference", bits: ent(3) });
      collected.push({ category: "Misc", label: "Dark Mode Pref", value: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light", bits: ent(3) });

      setRows(collected);

      // build composite fingerprint
      const sig = collected.map(r => r.value).join("|");
      setFingerprint(hashStr(sig));
      setLoading(false);
    }
    collect();
  }, []);

  const categories = [...new Set(rows.map(r => r.category))];
  const totalBits = rows.reduce((s, r) => s + (r.bits ?? 0), 0);

  const categoryColor: Record<string, string> = {
    Browser: "bg-blue-100 text-blue-800",
    Hardware: "bg-purple-100 text-purple-800",
    Screen: "bg-green-100 text-green-800",
    System: "bg-yellow-100 text-yellow-800",
    Network: "bg-orange-100 text-orange-800",
    Canvas: "bg-pink-100 text-pink-800",
    WebGL: "bg-red-100 text-red-800",
    Fonts: "bg-indigo-100 text-indigo-800",
    Audio: "bg-teal-100 text-teal-800",
    Storage: "bg-gray-100 text-gray-700",
    Misc: "bg-slate-100 text-slate-700",
  };

  return (
    <CalculatorShell
      title="Browser Fingerprint Checker"
      description="See what your browser reveals about you — the same signals used to track you across the web."
    >
      {loading ? (
        <div className="text-center py-8 text-muted text-sm">Collecting browser signals…</div>
      ) : (
        <>
          {/* Fingerprint summary */}
          <div className="mb-6 p-4 bg-card border border-card-border rounded-xl">
            <div className="text-xs text-muted mb-1">Composite Fingerprint (FNV-like hash)</div>
            <div className="text-2xl font-bold font-mono tracking-widest">{fingerprint}</div>
            <div className="text-xs text-muted mt-2">
              ~{totalBits.toFixed(0)} combined entropy bits across {rows.length} signals.{" "}
              <span className="text-amber-600 font-medium">
                {totalBits > 20 ? "Your browser is likely uniquely identifiable." : "Low fingerprint surface."}
              </span>
            </div>
          </div>

          {/* Per-category tables */}
          {categories.map(cat => (
            <div key={cat} className="mb-5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor[cat] ?? "bg-gray-100 text-gray-700"}`}>{cat}</span>
              </h2>
              <div className="rounded-lg border border-card-border overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {rows.filter(r => r.category === cat).map((row, i) => (
                      <tr key={row.label} className={i % 2 === 0 ? "bg-background" : "bg-card"}>
                        <td className="px-3 py-2 text-muted font-medium w-40 shrink-0 align-top">{row.label}</td>
                        <td className="px-3 py-2 font-mono text-xs break-all">{row.value}</td>
                        {row.bits !== undefined && (
                          <td className="px-3 py-2 text-right text-xs text-muted whitespace-nowrap align-top">
                            ~{row.bits} bits
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Privacy note */}
          <div className="mt-6 pt-4 border-t border-card-border text-xs text-muted space-y-1">
            <p><strong>Privacy:</strong> All fingerprinting runs entirely in your browser. No data is sent to any server.</p>
            <p><strong>What this shows:</strong> These are the same signals real trackers use. The hash changes if you switch browsers, devices, or settings.</p>
            <p>For protection, consider <a href="https://www.torproject.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Tor Browser</a> or the <a href="https://www.eff.org/privacybadger" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Privacy Badger</a> extension.</p>
          </div>
        </>
      )}
    </CalculatorShell>
  );
}
