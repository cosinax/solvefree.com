"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

interface TireData {
  width: number;      // mm
  aspect: number;     // %
  rim: number;        // inches
}

function parseTire(s: string): TireData | null {
  // Format: 205/55R16
  const m = s.trim().match(/^(\d{3})\s*\/\s*(\d{2,3})\s*[Rr]\s*(\d{2,3})$/);
  if (!m) return null;
  return { width: parseInt(m[1]), aspect: parseInt(m[2]), rim: parseInt(m[3]) };
}

function calcTireMetrics(t: TireData) {
  const sidewallMm = t.width * (t.aspect / 100);
  const sidewallIn = sidewallMm / 25.4;
  const diameterIn = t.rim + 2 * sidewallIn;
  const circumferenceIn = Math.PI * diameterIn;
  const revPerMile = (5280 * 12) / circumferenceIn;
  return { sidewallMm, sidewallIn, diameterIn, circumferenceIn, revPerMile };
}

export default function TireSizePage() {
  const [v, setV] = useHashState({ tire1: "205/55R16", tire2: "215/60R16" });

  const t1 = parseTire(v.tire1);
  const t2 = parseTire(v.tire2);
  const m1 = t1 ? calcTireMetrics(t1) : null;
  const m2 = t2 ? calcTireMetrics(t2) : null;

  const speedoDiff = m1 && m2 ? ((m2.circumferenceIn - m1.circumferenceIn) / m1.circumferenceIn) * 100 : null;
  const diamDiff = m1 && m2 ? m2.diameterIn - m1.diameterIn : null;

  const Row = ({ label, v1, v2 }: { label: string; v1: string; v2: string }) => (
    <div className="grid grid-cols-3 gap-1 text-xs font-mono">
      <span className="text-muted py-1">{label}</span>
      <span className="px-2 py-1 bg-background border border-card-border rounded text-center">{v1}</span>
      <span className="px-2 py-1 bg-background border border-card-border rounded text-center">{v2}</span>
    </div>
  );

  return (
    <CalculatorShell title="Tire Size Calculator" description="Compare two tire sizes — diameter, sidewall height, circumference, and speedometer difference.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-1 text-xs font-mono mb-1">
          <span className="text-muted"></span>
          <span className="text-center font-semibold text-muted">Tire 1</span>
          <span className="text-center font-semibold text-muted">Tire 2</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <span className="text-sm text-muted self-center">Size</span>
          <input type="text" value={v.tire1} onChange={e => setV({ tire1: e.target.value })} placeholder="205/55R16" className={ic} />
          <input type="text" value={v.tire2} onChange={e => setV({ tire2: e.target.value })} placeholder="215/60R16" className={ic} />
        </div>

        {(m1 || m2) && (
          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-1 text-xs font-mono border-b border-card-border pb-1 mb-1">
              <span className="text-muted font-semibold">Metric</span>
              <span className="text-center font-semibold text-muted">{t1 ? `${t1.width}/${t1.aspect}R${t1.rim}` : "—"}</span>
              <span className="text-center font-semibold text-muted">{t2 ? `${t2.width}/${t2.aspect}R${t2.rim}` : "—"}</span>
            </div>
            <Row label="Sidewall (in)" v1={m1 ? m1.sidewallIn.toFixed(2) + '"' : "—"} v2={m2 ? m2.sidewallIn.toFixed(2) + '"' : "—"} />
            <Row label="Sidewall (mm)" v1={m1 ? m1.sidewallMm.toFixed(1) + " mm" : "—"} v2={m2 ? m2.sidewallMm.toFixed(1) + " mm" : "—"} />
            <Row label="Diameter (in)" v1={m1 ? m1.diameterIn.toFixed(2) + '"' : "—"} v2={m2 ? m2.diameterIn.toFixed(2) + '"' : "—"} />
            <Row label="Circumference" v1={m1 ? m1.circumferenceIn.toFixed(2) + '"' : "—"} v2={m2 ? m2.circumferenceIn.toFixed(2) + '"' : "—"} />
            <Row label="Rev / mile" v1={m1 ? m1.revPerMile.toFixed(1) : "—"} v2={m2 ? m2.revPerMile.toFixed(1) : "—"} />
          </div>
        )}

        {m1 && m2 && speedoDiff !== null && diamDiff !== null && (
          <div className="space-y-2">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Speedometer Difference</span>
              <span className="block font-mono font-bold text-4xl text-primary">
                {speedoDiff > 0 ? "+" : ""}{speedoDiff.toFixed(2)}%
              </span>
              <span className="text-xs text-muted">
                {speedoDiff > 0 ? "Tire 2 reads faster" : speedoDiff < 0 ? "Tire 2 reads slower" : "No difference"}
              </span>
            </div>
            <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
              <span className="text-muted">Diameter difference</span>
              <span>{diamDiff > 0 ? "+" : ""}{diamDiff.toFixed(3)}"</span>
            </div>
          </div>
        )}
        <p className="text-xs text-muted">Format: 205/55R16 (width mm / aspect ratio % R rim diameter inches)</p>
      </div>
    </CalculatorShell>
  );
}
