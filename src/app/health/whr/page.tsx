"use client";

import { useHashState } from "@/hooks/useHashState";
import { CalculatorShell } from "@/components/CalculatorShell";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

interface RiskLevel {
  label: string;
  color: string;
  description: string;
}

function getWhrRisk(whr: number, sex: string): RiskLevel {
  if (sex === "male") {
    if (whr < 0.90) return { label: "Low Risk", color: "text-success", description: "Below 0.90 for men" };
    if (whr < 0.95) return { label: "Moderate Risk", color: "text-accent", description: "0.90–0.95 for men" };
    if (whr < 1.00) return { label: "High Risk", color: "text-orange-500", description: "0.95–1.00 for men" };
    return { label: "Very High Risk", color: "text-danger", description: "Above 1.00 for men" };
  } else {
    if (whr < 0.80) return { label: "Low Risk", color: "text-success", description: "Below 0.80 for women" };
    if (whr < 0.85) return { label: "Moderate Risk", color: "text-accent", description: "0.80–0.85 for women" };
    if (whr < 0.90) return { label: "High Risk", color: "text-orange-500", description: "0.85–0.90 for women" };
    return { label: "Very High Risk", color: "text-danger", description: "Above 0.90 for women" };
  }
}

export default function WhrPage() {
  const [v, setV] = useHashState({
    sex: "female",
    unit: "cm",
    waist: "",
    hip: "",
    height: "",
  });

  const waist = parseFloat(v.waist);
  const hip = parseFloat(v.hip);
  const height = parseFloat(v.height);

  const valid = waist > 0 && hip > 0;
  const whr = valid ? waist / hip : null;

  // Waist-to-height ratio
  const wthr = valid && height > 0 ? waist / height : null;

  const risk = whr ? getWhrRisk(whr, v.sex) : null;

  const row = (label: string, value: string) => (
    <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );

  return (
    <CalculatorShell title="Waist-to-Hip Ratio" description="Calculate WHR and assess cardiovascular health risk per WHO guidelines.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ unit: "cm" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.unit === "cm" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Centimeters</button>
          <button onClick={() => setV({ unit: "in" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.unit === "in" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Inches</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ sex: "male" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.sex === "male" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Male</button>
          <button onClick={() => setV({ sex: "female" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.sex === "female" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Female</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Waist ({v.unit})</label>
            <input type="number" value={v.waist} onChange={(e) => setV({ waist: e.target.value })} placeholder={v.unit === "cm" ? "e.g. 80" : "e.g. 32"} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Hip ({v.unit})</label>
            <input type="number" value={v.hip} onChange={(e) => setV({ hip: e.target.value })} placeholder={v.unit === "cm" ? "e.g. 95" : "e.g. 38"} className={ic} />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Height ({v.unit}) <span className="text-xs">(optional — for waist-to-height ratio)</span></label>
          <input type="number" value={v.height} onChange={(e) => setV({ height: e.target.value })} placeholder={v.unit === "cm" ? "e.g. 170" : "e.g. 67"} className={ic} />
        </div>

        {whr && risk && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted mb-1">Waist-to-Hip Ratio</span>
              <span className="block font-mono font-bold text-4xl text-primary">{whr.toFixed(2)}</span>
              <span className={`block text-sm font-semibold mt-1 ${risk.color}`}>{risk.label}</span>
              <span className="block text-xs text-muted">{risk.description}</span>
            </div>

            <div className="space-y-1.5">
              {row("Waist", `${waist} ${v.unit}`)}
              {row("Hip", `${hip} ${v.unit}`)}
              {row("WHR", whr.toFixed(3))}
              {wthr && row("Waist-to-height ratio", `${wthr.toFixed(3)}${wthr < 0.5 ? " (healthy)" : " (elevated)"}`)}
            </div>

            <p className="text-xs text-muted font-semibold uppercase tracking-wide">WHO Risk Categories</p>
            <div className="space-y-1.5">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Men: Low / Moderate / High / Very High</span>
                <span>&lt;0.90 / 0.90–0.95 / 0.95–1.0 / &gt;1.0</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Women: Low / Moderate / High / Very High</span>
                <span>&lt;0.80 / 0.80–0.85 / 0.85–0.90 / &gt;0.90</span>
              </div>
            </div>

            <div className="text-xs text-muted space-y-1">
              <p className="font-semibold">Waist-to-height ratio</p>
              <p>A waist-to-height ratio under 0.5 is generally considered healthy for all adults. "Keep your waist less than half your height."</p>
              <p>WHR and waist-to-height ratio are indicators of abdominal fat and cardiovascular risk. Consult your doctor for clinical evaluation.</p>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
