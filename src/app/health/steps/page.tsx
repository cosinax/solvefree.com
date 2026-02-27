"use client";

import { useHashState } from "@/hooks/useHashState";
import { CalculatorShell } from "@/components/CalculatorShell";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

// Average stride length as fraction of height
const WALK_STRIDE_RATIO = 0.413; // walking: ~41.3% of height
const RUN_STRIDE_RATIO = 0.46;   // running: ~46% of height

// MET values: walking ~3.5, running ~8
const MET_WALK = 3.5;
const MET_RUN = 8.0;

export default function StepsPage() {
  const [v, setV] = useHashState({
    mode: "steps", // steps | distance
    steps: "",
    miles: "",
    km: "",
    heightFt: "",
    heightIn: "",
    heightCm: "",
    strideLengthIn: "",
    strideLengthCm: "",
    activity: "walk",
    weightLbs: "155",
    unit: "imperial",
  });

  // Stride length in meters
  let strideM: number | null = null;
  if (v.strideLengthIn || v.strideLengthCm) {
    strideM = v.unit === "imperial"
      ? (parseFloat(v.strideLengthIn) || 0) * 0.0254
      : (parseFloat(v.strideLengthCm) || 0) / 100;
  } else {
    // estimate from height
    const heightM = v.unit === "imperial"
      ? ((parseFloat(v.heightFt) || 0) * 12 + (parseFloat(v.heightIn) || 0)) * 0.0254
      : (parseFloat(v.heightCm) || 0) / 100;
    if (heightM > 0) {
      strideM = heightM * (v.activity === "walk" ? WALK_STRIDE_RATIO : RUN_STRIDE_RATIO);
    }
  }

  const weightKg = (parseFloat(v.weightLbs) || 155) * 0.453592;
  const metValue = v.activity === "walk" ? MET_WALK : MET_RUN;
  // steps/min: walking ~100, running ~160
  const stepsPerMin = v.activity === "walk" ? 100 : 160;
  // speed m/s
  const speedMs = strideM ? strideM * stepsPerMin / 60 : null;

  if (v.mode === "steps") {
    const steps = parseFloat(v.steps);
    if (steps > 0 && strideM) {
      const distM = steps * strideM;
      const distMi = distM / 1609.34;
      const distKm = distM / 1000;
      const minutes = steps / stepsPerMin;
      const hours = minutes / 60;
      const cals = metValue * weightKg * hours;

      const row = (label: string, value: string) => (
        <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
          <span className="text-muted">{label}</span>
          <span className="font-semibold">{value}</span>
        </div>
      );

      return (
        <CalculatorShell title="Steps Calculator" description="Convert steps to distance and calories, or distance to steps.">
          <div className="space-y-4">
            {renderInputs()}
            <div className="space-y-3">
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-sm text-muted mb-1">Distance</span>
                <span className="block font-mono font-bold text-4xl text-primary">{distMi.toFixed(2)} mi</span>
                <span className="block text-sm text-muted">{distKm.toFixed(2)} km · {Math.round(distM).toLocaleString()} m</span>
              </div>
              <div className="space-y-1.5">
                {row("Steps", steps.toLocaleString())}
                {row("Distance (miles)", `${distMi.toFixed(2)} mi`)}
                {row("Distance (km)", `${distKm.toFixed(2)} km`)}
                {row("Calories burned (approx)", `${Math.round(cals)} kcal`)}
                {row("Estimated time", `${Math.floor(minutes)}m ${Math.round((minutes % 1) * 60)}s`)}
                {strideM && row("Stride length used", `${(strideM * 100).toFixed(1)} cm (${(strideM / 0.0254).toFixed(1)} in)`)}
              </div>
              <p className="text-xs text-muted">Reference: ~2,000 steps ≈ 1 mile. 10,000 steps goal ≈ {strideM ? (10000 * strideM / 1609.34).toFixed(1) : "~5"} miles.</p>
            </div>
          </div>
        </CalculatorShell>
      );
    }
  } else {
    // distance to steps
    const inputMiles = parseFloat(v.miles);
    const inputKm = parseFloat(v.km);
    const distM = inputMiles > 0 ? inputMiles * 1609.34 : inputKm > 0 ? inputKm * 1000 : 0;
    if (distM > 0 && strideM) {
      const steps = distM / strideM;
      const minutes = steps / stepsPerMin;
      const cals = metValue * weightKg * (minutes / 60);

      const row = (label: string, value: string) => (
        <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
          <span className="text-muted">{label}</span>
          <span className="font-semibold">{value}</span>
        </div>
      );

      return (
        <CalculatorShell title="Steps Calculator" description="Convert steps to distance and calories, or distance to steps.">
          <div className="space-y-4">
            {renderInputs()}
            <div className="space-y-3">
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-sm text-muted mb-1">Steps needed</span>
                <span className="block font-mono font-bold text-4xl text-primary">{Math.round(steps).toLocaleString()}</span>
              </div>
              <div className="space-y-1.5">
                {row("Steps", Math.round(steps).toLocaleString())}
                {row("Calories burned (approx)", `${Math.round(cals)} kcal`)}
                {row("Estimated time", `${Math.floor(minutes)}m ${Math.round((minutes % 1) * 60)}s`)}
              </div>
            </div>
          </div>
        </CalculatorShell>
      );
    }
  }

  function renderInputs() {
    return (
      <>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ unit: "imperial" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.unit === "imperial" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Imperial</button>
          <button onClick={() => setV({ unit: "metric" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.unit === "metric" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Metric</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ mode: "steps" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.mode === "steps" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Steps → Distance</button>
          <button onClick={() => setV({ mode: "distance" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.mode === "distance" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Distance → Steps</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ activity: "walk" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.activity === "walk" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Walking</button>
          <button onClick={() => setV({ activity: "run" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.activity === "run" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Running</button>
        </div>

        {v.mode === "steps" ? (
          <div>
            <label className="block text-sm text-muted mb-1">Number of steps</label>
            <input type="number" value={v.steps} onChange={(e) => setV({ steps: e.target.value })} placeholder="e.g. 10000" className={ic} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Miles</label>
              <input type="number" value={v.miles} onChange={(e) => setV({ miles: e.target.value, km: "" })} placeholder="e.g. 3" className={ic} />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Kilometers</label>
              <input type="number" value={v.km} onChange={(e) => setV({ km: e.target.value, miles: "" })} placeholder="e.g. 5" className={ic} />
            </div>
          </div>
        )}

        {v.unit === "imperial" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted mb-1">Your height — Feet <span className="text-xs">(for stride est.)</span></label>
                <input type="number" value={v.heightFt} onChange={(e) => setV({ heightFt: e.target.value })} placeholder="5" className={ic} />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Inches</label>
                <input type="number" value={v.heightIn} onChange={(e) => setV({ heightIn: e.target.value })} placeholder="8" className={ic} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Or enter stride length (inches) <span className="text-xs">(overrides height)</span></label>
              <input type="number" value={v.strideLengthIn} onChange={(e) => setV({ strideLengthIn: e.target.value })} placeholder="e.g. 28" className={ic} />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Your height (cm) <span className="text-xs">(for stride est.)</span></label>
              <input type="number" value={v.heightCm} onChange={(e) => setV({ heightCm: e.target.value })} placeholder="e.g. 170" className={ic} />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Or enter stride length (cm) <span className="text-xs">(overrides height)</span></label>
              <input type="number" value={v.strideLengthCm} onChange={(e) => setV({ strideLengthCm: e.target.value })} placeholder="e.g. 70" className={ic} />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm text-muted mb-1">Your weight (lbs) <span className="text-xs">(for calorie estimate)</span></label>
          <input type="number" value={v.weightLbs} onChange={(e) => setV({ weightLbs: e.target.value })} placeholder="155" className={ic} />
        </div>
      </>
    );
  }

  return (
    <CalculatorShell title="Steps Calculator" description="Convert steps to distance and calories, or distance to steps.">
      <div className="space-y-4">
        {renderInputs()}
      </div>
    </CalculatorShell>
  );
}
