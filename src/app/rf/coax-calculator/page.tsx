"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

const dielectrics: Record<string, { label: string; er: number }> = {
  ptfe:     { label: "PTFE / Teflon (εr = 2.07)",    er: 2.07 },
  ptfe226:  { label: "PTFE foam (εr = 2.26)",         er: 2.26 },
  pe:       { label: "Polyethylene (εr = 2.3)",       er: 2.3  },
  foam:     { label: "Foam PE (εr = 1.5)",            er: 1.5  },
  air:      { label: "Air (εr = 1.0)",                er: 1.0  },
  custom:   { label: "Custom",                        er: 0    },
};

export default function CoaxCalculatorPage() {
  const [v, setV] = useHashState({
    innerD: "1.02",
    outerD: "4.57",
    dielectric: "ptfe226",
    customEr: "2.26",
  });

  const d = parseFloat(v.innerD);     // inner conductor diameter mm
  const D = parseFloat(v.outerD);     // outer conductor inner diameter mm
  const dKey = v.dielectric;
  const er = dKey === "custom" ? parseFloat(v.customEr) : (dielectrics[dKey]?.er ?? 2.26);

  const valid =
    isFinite(d) && d > 0 &&
    isFinite(D) && D > 0 &&
    D > d &&
    isFinite(er) && er > 0;

  let Z0: number | null = null;
  let capPfm: number | null = null;
  let indNhm: number | null = null;
  let vf: number | null = null;

  if (valid) {
    const ratio = D / d;
    Z0 = (138 / Math.sqrt(er)) * Math.log10(ratio);
    capPfm = (55.6 * er) / Math.log10(ratio);
    indNhm = 200 * Math.log10(ratio);
    vf = 1 / Math.sqrt(er);
  }

  return (
    <CalculatorShell
      title="Coaxial Cable Parameters"
      description="Calculate characteristic impedance, capacitance, inductance, and velocity factor for coaxial cable."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Inner conductor diameter (mm)</label>
            <input
              type="number"
              value={v.innerD}
              onChange={(e) => setV({ innerD: e.target.value })}
              className={ic}
              placeholder="1.02"
              min="0.01"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Outer conductor inner dia. (mm)</label>
            <input
              type="number"
              value={v.outerD}
              onChange={(e) => setV({ outerD: e.target.value })}
              className={ic}
              placeholder="4.57"
              min="0.01"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Dielectric Material</label>
          <select value={v.dielectric} onChange={(e) => setV({ dielectric: e.target.value })} className={sc}>
            {Object.entries(dielectrics).map(([k, { label }]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>

        {dKey === "custom" && (
          <div>
            <label className="block text-sm text-muted mb-1">Relative Permittivity εr</label>
            <input
              type="number"
              value={v.customEr}
              onChange={(e) => setV({ customEr: e.target.value })}
              className={ic}
              placeholder="2.26"
              min="1"
              step="0.01"
            />
          </div>
        )}

        {valid && D <= d && (
          <div className="text-sm text-red-500">Outer diameter must be greater than inner diameter.</div>
        )}

        {valid && Z0 !== null && capPfm !== null && indNhm !== null && vf !== null && (
          <div className="mt-4 space-y-3">
            <div className="p-4 bg-card rounded-xl border border-card-border">
              <div className="text-sm text-muted mb-1">Characteristic Impedance (Z₀)</div>
              <div className="text-3xl font-bold font-mono">{fmt(Z0, 5)} Ω</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-card rounded-xl border border-card-border">
                <div className="text-xs text-muted mb-1">Capacitance per meter</div>
                <div className="text-lg font-bold font-mono">{fmt(capPfm, 5)} pF/m</div>
              </div>
              <div className="p-3 bg-card rounded-xl border border-card-border">
                <div className="text-xs text-muted mb-1">Inductance per meter</div>
                <div className="text-lg font-bold font-mono">{fmt(indNhm, 5)} nH/m</div>
              </div>
              <div className="p-3 bg-card rounded-xl border border-card-border">
                <div className="text-xs text-muted mb-1">Velocity Factor (VF)</div>
                <div className="text-lg font-bold font-mono">{fmt(vf, 4)}</div>
                <div className="text-xs text-muted">{fmt(vf * 100, 4)}% of c</div>
              </div>
              <div className="p-3 bg-card rounded-xl border border-card-border">
                <div className="text-xs text-muted mb-1">D/d ratio</div>
                <div className="text-lg font-bold font-mono">{fmt(parseFloat(v.outerD) / parseFloat(v.innerD), 4)}</div>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted border-t border-card-border pt-3 space-y-1">
          <div>Z₀ = (138 / √εr) × log₁₀(D/d) Ω</div>
          <div>C = (55.6 × εr) / log₁₀(D/d) pF/m</div>
          <div>L = 200 × log₁₀(D/d) nH/m</div>
          <div>VF = 1/√εr</div>
        </div>
      </div>
    </CalculatorShell>
  );
}
