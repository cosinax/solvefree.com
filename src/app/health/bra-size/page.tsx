"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";
const sel = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

// ── Band size: underbust in inches → even number ──
function getBandIn(underbustIn: number): number {
  // Measure underbust, round to nearest even number >= 28
  const rounded = Math.round(underbustIn);
  const band = rounded % 2 === 0 ? rounded : rounded + 1;
  return Math.max(28, band);
}

// ── Cup size index from difference ──
// Difference (bust - band) in inches → cup letter index (0=AA, 1=A, 2=B, ...)
const CUP_LETTERS_US = ["AA", "A", "B", "C", "D", "DD", "DDD/F", "G", "H", "I", "J", "K"];
function getCupIndex(diff: number): number {
  if (diff <= 0) return 0; // AA
  if (diff <= 1) return 1; // A (< 1")
  const idx = Math.round(diff); // 2→B, 3→C, 4→D, 5→DD, 6→DDD, 7→G…
  return Math.min(idx, CUP_LETTERS_US.length - 1);
}

// ── Conversion tables ──
// Columns: US/CA, UK, EU, AU/NZ, FR/BE/ES/IT
// Cup rows aligned to US index (0=AA through 11=K)
const CUP_TABLE: Record<string, string[]> = {
  US:    ["AA","A","B","C","D","DD","DDD/F","G","H","I","J","K"],
  UK:    ["AA","A","B","C","D","DD","E","F","FF","G","GG","H"],
  EU:    ["AA","A","B","C","D","E","F","G","H","I","J","K"],
  FR:    ["AA","A","B","C","D","E","F","G","H","I","J","K"],
  AU:    ["AA","A","B","C","D","DD","E","F","FF","G","GG","H"],
};

// Band size conversion: US band → other systems
function convertBand(usBand: number, system: string): string {
  switch (system) {
    case "US":
    case "UK":
    case "AU": return usBand.toString();
    case "EU": return (usBand + 16).toString();  // US 34 → EU 75 (approx +16 cm shorthand: actually US 34 = 34in underbust band)
    case "FR": return (usBand + 10).toString();   // US 34 → FR 90 (size adds 15 to cm ~)
    default: return usBand.toString();
  }
}

// More accurate EU/FR band: US band (in inches) → EU (cm, round to 5)
function usBandToEU(usBand: number): number {
  // US band is approx underbust + 1" rounded to even
  // EU = underbust measurement in cm rounded to nearest 5
  const cm = usBand * 2.54;
  return Math.round(cm / 5) * 5;
}

function usBandToFR(usBand: number): number {
  // FR/BE band = EU band + 15 (traditional), but many use EU now
  return usBandToEU(usBand) + 15;
}

function bandBySystem(usBand: number, system: string): string {
  if (system === "EU") return usBandToEU(usBand).toString();
  if (system === "FR") return usBandToFR(usBand).toString();
  return usBand.toString(); // US, UK, AU identical
}

const SYSTEMS = [
  { key: "US", label: "US / Canada" },
  { key: "UK", label: "UK" },
  { key: "EU", label: "EU (cm)" },
  { key: "FR", label: "FR / BE / ES / IT" },
  { key: "AU", label: "AU / NZ" },
];

// Parse input size like "34B" or "34DD"
function parseSize(s: string): { band: number; cup: string } | null {
  const m = s.trim().toUpperCase().match(/^(\d+)((?:DD|DDD|FF|GG|AA|[A-K])+)$/);
  if (!m) return null;
  return { band: parseInt(m[1]), cup: m[2] };
}

// Find cup index by letter in a system
function cupIndexInSystem(cup: string, system: string): number {
  const table = CUP_TABLE[system] ?? CUP_TABLE["US"];
  const idx = table.findIndex(c => c === cup.toUpperCase());
  return idx >= 0 ? idx : -1;
}

export default function BraSizePage() {
  const [v, setV] = useHashState({
    mode: "find",           // "find" | "convert"
    unit: "in",             // "in" | "cm"
    underbust: "30",
    bust: "35",
    convertFrom: "US",
    convertInput: "34B",
  });

  // ── Find Your Size ──
  const underbustRaw = parseFloat(v.underbust);
  const bustRaw = parseFloat(v.bust);
  const underbustIn = v.unit === "cm" ? underbustRaw / 2.54 : underbustRaw;
  const bustIn      = v.unit === "cm" ? bustRaw / 2.54 : bustRaw;

  let band = 0, cupIdx = 0;
  let findValid = false;
  if (isFinite(underbustIn) && isFinite(bustIn) && underbustIn > 0 && bustIn > underbustIn) {
    band = getBandIn(underbustIn);
    const diff = bustIn - band;
    cupIdx = getCupIndex(diff);
    findValid = true;
  }

  // ── Convert Size ──
  const parsed = parseSize(v.convertInput);
  const fromSystem = v.convertFrom;
  let convertIdx = -1;
  let convertBandUS = 0;
  if (parsed) {
    // Convert band to US
    if (fromSystem === "EU") convertBandUS = Math.round((parsed.band / 2.54 / 2) * 2); // rough
    else if (fromSystem === "FR") convertBandUS = Math.round(((parsed.band - 15) / 2.54 / 2) * 2);
    else convertBandUS = parsed.band;
    convertIdx = cupIndexInSystem(parsed.cup, fromSystem);
  }

  return (
    <CalculatorShell
      title="Bra Size Calculator & Converter"
      description="Find your bra size from measurements, or convert between US, UK, EU, FR, and AU sizing systems."
    >
      <div className="space-y-4">
        {/* Mode tabs */}
        <div className="flex gap-2">
          {[{ key: "find", label: "Find My Size" }, { key: "convert", label: "Convert Size" }].map(m => (
            <button
              key={m.key}
              onClick={() => setV({ mode: m.key })}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                v.mode === m.key
                  ? "bg-primary text-white border-primary"
                  : "bg-card border-card-border hover:bg-primary-light"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* ── Find My Size ── */}
        {v.mode === "find" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-muted mb-1">Measurement unit</label>
              <select value={v.unit} onChange={e => setV({ unit: e.target.value })} className={sel}>
                <option value="in">Inches (in)</option>
                <option value="cm">Centimeters (cm)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">
                  Underbust ({v.unit})
                  <span className="ml-1 text-muted/60">— snug under bust</span>
                </label>
                <input
                  type="number"
                  value={v.underbust}
                  onChange={e => setV({ underbust: e.target.value })}
                  className={inp}
                  min="0"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">
                  Bust ({v.unit})
                  <span className="ml-1 text-muted/60">— fullest part</span>
                </label>
                <input
                  type="number"
                  value={v.bust}
                  onChange={e => setV({ bust: e.target.value })}
                  className={inp}
                  min="0"
                  step="0.5"
                />
              </div>
            </div>

            {!findValid && bustRaw > 0 && (
              <p className="text-sm text-red-500">Bust must be larger than underbust.</p>
            )}

            {findValid && (
              <div className="space-y-4">
                {/* Primary result */}
                <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                  <div className="text-xs text-muted mb-1">Your Bra Size (US)</div>
                  <div className="font-mono font-bold text-4xl text-primary">
                    {band}{CUP_LETTERS_US[cupIdx]}
                  </div>
                </div>

                {/* Sister sizes */}
                <div>
                  <div className="text-xs text-muted mb-2">Sister sizes (same cup volume, different fit)</div>
                  <div className="flex flex-wrap gap-2">
                    {[-2, -1, 0, 1, 2].map(offset => {
                      const sb = band + offset * 2;
                      const sc = cupIdx - offset;
                      if (sb < 28 || sb > 50 || sc < 0 || sc >= CUP_LETTERS_US.length) return null;
                      return (
                        <div
                          key={offset}
                          className={`px-3 py-1.5 rounded border text-xs font-mono ${
                            offset === 0
                              ? "bg-primary text-white border-primary font-bold"
                              : "bg-card border-card-border text-muted"
                          }`}
                        >
                          {sb}{CUP_LETTERS_US[sc]}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Conversion table */}
                <div className="overflow-x-auto rounded-lg border border-card-border">
                  <table className="w-full text-sm font-mono">
                    <thead>
                      <tr className="bg-card border-b border-card-border">
                        <th className="text-left px-3 py-2 text-muted font-medium">System</th>
                        <th className="text-right px-3 py-2 text-muted font-medium">Band</th>
                        <th className="text-right px-3 py-2 text-muted font-medium">Cup</th>
                        <th className="text-right px-3 py-2 text-muted font-medium">Full Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SYSTEMS.map(sys => {
                        const b = bandBySystem(band, sys.key);
                        const c = (CUP_TABLE[sys.key] ?? CUP_TABLE["US"])[cupIdx] ?? "—";
                        return (
                          <tr key={sys.key} className="border-b border-card-border hover:bg-primary-light/40 transition-colors">
                            <td className="px-3 py-2 text-muted text-xs">{sys.label}</td>
                            <td className="px-3 py-2 text-right">{b}</td>
                            <td className="px-3 py-2 text-right">{c}</td>
                            <td className="px-3 py-2 text-right font-semibold text-primary">{b}{c}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-muted">
                  How to measure: Stand upright and breathe normally. Measure <strong>underbust</strong> snugly
                  just below the breasts. Measure <strong>bust</strong> at the fullest point, keeping tape
                  level. Try the calculated size and adjust — fit varies by brand and style.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Convert Size ── */}
        {v.mode === "convert" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">From system</label>
                <select value={v.convertFrom} onChange={e => setV({ convertFrom: e.target.value })} className={sel}>
                  {SYSTEMS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Size (e.g. 34B, 75C)</label>
                <input
                  type="text"
                  value={v.convertInput}
                  onChange={e => setV({ convertInput: e.target.value })}
                  className={inp}
                  placeholder="34B"
                />
              </div>
            </div>

            {v.convertInput && !parsed && (
              <p className="text-sm text-red-500">Enter a valid size like 34B, 34DD, or 75C.</p>
            )}

            {parsed && convertIdx >= 0 && (
              <div className="overflow-x-auto rounded-lg border border-card-border">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="bg-card border-b border-card-border">
                      <th className="text-left px-3 py-2 text-muted font-medium">System</th>
                      <th className="text-right px-3 py-2 text-muted font-medium">Band</th>
                      <th className="text-right px-3 py-2 text-muted font-medium">Cup</th>
                      <th className="text-right px-3 py-2 text-muted font-medium">Full Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SYSTEMS.map(sys => {
                      const isFrom = sys.key === fromSystem;
                      const b = bandBySystem(convertBandUS, sys.key);
                      const c = (CUP_TABLE[sys.key] ?? CUP_TABLE["US"])[convertIdx] ?? "—";
                      return (
                        <tr
                          key={sys.key}
                          className={`border-b border-card-border transition-colors ${
                            isFrom ? "bg-primary-light" : "hover:bg-primary-light/40"
                          }`}
                        >
                          <td className="px-3 py-2 text-xs">
                            <span className="text-muted">{sys.label}</span>
                            {isFrom && <span className="ml-2 text-primary text-[10px] font-semibold">INPUT</span>}
                          </td>
                          <td className="px-3 py-2 text-right">{b}</td>
                          <td className="px-3 py-2 text-right">{c}</td>
                          <td className={`px-3 py-2 text-right font-semibold ${isFrom ? "text-primary" : ""}`}>{b}{c}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <p className="text-xs text-muted">
              Note: Bra sizing is not perfectly standardized across brands. Use these as a guide and try on when possible.
              EU and FR bands are in centimeters; US/UK/AU bands are in inches.
            </p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
