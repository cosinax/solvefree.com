"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const C = 299_792_458; // m/s
const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

function metersToFeet(m: number) {
  return m * 3.28084;
}

export default function DipoleAntennaPage() {
  const [v, setV] = useHashState({ freq: "146", vf: "0.95" });

  const fMHz = parseFloat(v.freq);
  const vf = parseFloat(v.vf);
  const valid = isFinite(fMHz) && fMHz > 0 && isFinite(vf) && vf > 0 && vf <= 1;

  let fullM = 0, halfM = 0, quarterM = 0;
  let fullFt = 0, halfFt = 0, quarterFt = 0;

  if (valid) {
    const fHz = fMHz * 1e6;
    fullM = (C * vf) / fHz;
    halfM = fullM / 2;
    quarterM = fullM / 4;
    fullFt = metersToFeet(fullM);
    halfFt = metersToFeet(halfM);
    quarterFt = metersToFeet(quarterM);
  }

  return (
    <CalculatorShell
      title="Dipole Antenna Length"
      description="Calculate full-wave, half-wave, and quarter-wave dipole lengths from frequency and velocity factor."
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Frequency (MHz)</label>
          <input
            type="number"
            value={v.freq}
            onChange={(e) => setV({ freq: e.target.value })}
            className={ic}
            placeholder="e.g. 146"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Velocity Factor (0–1, default 0.95)</label>
          <input
            type="number"
            value={v.vf}
            onChange={(e) => setV({ vf: e.target.value })}
            className={ic}
            placeholder="0.95"
            min="0.01"
            max="1"
            step="0.01"
          />
        </div>

        {valid && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-card-border text-muted">
                  <th className="text-left py-2 pr-4">Antenna</th>
                  <th className="text-right py-2 pr-4">Meters</th>
                  <th className="text-right py-2">Feet</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Full-wave (λ)", fullM, fullFt],
                  ["Half-wave (λ/2)", halfM, halfFt],
                  ["Quarter-wave (λ/4)", quarterM, quarterFt],
                ].map(([label, m, ft]) => (
                  <tr key={label as string} className="border-b border-card-border last:border-0">
                    <td className="py-2.5 pr-4 font-medium">{label as string}</td>
                    <td className="text-right py-2.5 pr-4">{fmt(m as number)} m</td>
                    <td className="text-right py-2.5">{fmt(ft as number)} ft</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-xs text-muted border-t border-card-border pt-3 space-y-1">
          <div>L = (c × VF) / f — where c = 299,792,458 m/s</div>
          <div>Classic feet formula: L_half ≈ (468 / f_MHz) × VF ft</div>
          {valid && (
            <div className="font-mono">
              Half-wave ≈ {fmt((468 / fMHz) * vf)} ft (classic approx)
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
