"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const channels24 = [
  { ch: 1, freq: 2412 }, { ch: 2, freq: 2417 }, { ch: 3, freq: 2422 }, { ch: 4, freq: 2427 },
  { ch: 5, freq: 2432 }, { ch: 6, freq: 2437 }, { ch: 7, freq: 2442 }, { ch: 8, freq: 2447 },
  { ch: 9, freq: 2452 }, { ch: 10, freq: 2457 }, { ch: 11, freq: 2462 }, { ch: 12, freq: 2467 },
  { ch: 13, freq: 2472 },
];

const channels5 = [
  { ch: 36, freq: 5180 }, { ch: 40, freq: 5200 }, { ch: 44, freq: 5220 }, { ch: 48, freq: 5240 },
  { ch: 52, freq: 5260 }, { ch: 56, freq: 5280 }, { ch: 60, freq: 5300 }, { ch: 64, freq: 5320 },
  { ch: 100, freq: 5500 }, { ch: 104, freq: 5520 }, { ch: 108, freq: 5540 }, { ch: 112, freq: 5560 },
  { ch: 116, freq: 5580 }, { ch: 120, freq: 5600 }, { ch: 124, freq: 5620 }, { ch: 128, freq: 5640 },
  { ch: 132, freq: 5660 }, { ch: 136, freq: 5680 }, { ch: 140, freq: 5700 }, { ch: 149, freq: 5745 },
  { ch: 153, freq: 5765 }, { ch: 157, freq: 5785 }, { ch: 161, freq: 5805 }, { ch: 165, freq: 5825 },
];

export default function WifiChannelsPage() {
  const [band, setBand] = useState<"2.4" | "5">("2.4");
  const channels = band === "2.4" ? channels24 : channels5;
  const noOverlap = band === "2.4" ? [1, 6, 11] : channels5.map(c => c.ch);

  return (
    <CalculatorShell title="WiFi Channel Reference" description="2.4 GHz and 5 GHz WiFi channels, frequencies, and non-overlapping recommendations.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setBand("2.4")} className={`py-2 rounded-lg text-sm font-medium ${band === "2.4" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>2.4 GHz</button>
          <button onClick={() => setBand("5")} className={`py-2 rounded-lg text-sm font-medium ${band === "5" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>5 GHz</button>
        </div>
        {band === "2.4" && (
          <div className="bg-primary-light border border-primary/20 rounded-lg px-4 py-3 text-sm">
            <strong>Non-overlapping channels (US):</strong> 1, 6, 11 — use these to avoid interference.
          </div>
        )}
        {band === "5" && (
          <div className="bg-primary-light border border-primary/20 rounded-lg px-4 py-3 text-sm">
            All 5 GHz channels are non-overlapping with 20 MHz width. More channels, less congestion.
          </div>
        )}
        <div className="space-y-1 max-h-72 overflow-y-auto">
          {channels.map(c => (
            <div key={c.ch} className={`flex justify-between items-center px-4 py-2 rounded-lg text-sm ${noOverlap.includes(c.ch) && band === "2.4" ? "bg-primary-light border border-primary/20" : "bg-background border border-card-border"}`}>
              <span className="font-mono font-semibold">Channel {c.ch}</span>
              <span className="text-muted">{c.freq} MHz</span>
              {band === "2.4" && noOverlap.includes(c.ch) && <span className="text-xs text-success font-medium">✓ recommended</span>}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted">Each 2.4 GHz channel is 22 MHz wide with 5 MHz spacing, causing overlap. 5 GHz channels are 20 MHz wide and non-overlapping.</p>
      </div>
    </CalculatorShell>
  );
}
