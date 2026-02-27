"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sel = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

// Lift in grams per balloon
const BALLOON_SIZES: { value: string; label: string; lift: number }[] = [
  { value: "9", label: '9" balloon', lift: 4 },
  { value: "11", label: '11" balloon', lift: 8 },
  { value: "12", label: '12" balloon', lift: 10 },
  { value: "16", label: '16" balloon', lift: 25 },
  { value: "36", label: '36" balloon (jumbo)', lift: 500 },
];

const FUN_OBJECTS = [
  { label: "Average person (70 kg)", weight: 70000 },
  { label: "Golden Retriever (30 kg)", weight: 30000 },
  { label: "Mini Cooper (1,150 kg)", weight: 1150000 },
  { label: "African Elephant (5,000 kg)", weight: 5000000 },
];

export default function HeliumBalloonsPage() {
  const [v, setV] = useHashState({ weight: "100", unit: "g", size: "11" });

  const weight = parseFloat(v.weight);
  const balloonData = BALLOON_SIZES.find(b => b.value === v.size) ?? BALLOON_SIZES[1];
  const weightG = v.unit === "oz" ? weight * 28.3495 : weight;
  const valid = weight > 0;

  const balloonsNeeded = valid ? Math.ceil(weightG / balloonData.lift) : 0;

  return (
    <CalculatorShell title="Helium Balloon Calculator" description="Calculate how many helium balloons you need to lift an object. Lift per balloon varies by size.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Object Weight</label>
            <input type="number" value={v.weight} onChange={e => setV({ weight: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Unit</label>
            <select value={v.unit} onChange={e => setV({ unit: e.target.value })} className={sel}>
              <option value="g">Grams (g)</option>
              <option value="oz">Ounces (oz)</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Balloon Size</label>
          <select value={v.size} onChange={e => setV({ size: e.target.value })} className={sel}>
            {BALLOON_SIZES.map(b => <option key={b.value} value={b.value}>{b.label} (~{b.lift}g lift)</option>)}
          </select>
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Balloons Needed</span>
              <span className="block font-mono font-bold text-4xl text-primary">{balloonsNeeded.toLocaleString()}</span>
              <span className="text-xs text-muted">{balloonData.label}s to lift {weight}{v.unit}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">Lift per Balloon</span>
                <span className="font-bold">{balloonData.lift} g</span>
              </div>
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">Total Lift Capacity</span>
                <span className="font-bold">{(balloonsNeeded * balloonData.lift).toLocaleString()} g</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-muted font-semibold mb-2">Fun: How many {balloonData.label}s to lift...</p>
          <div className="space-y-1">
            {FUN_OBJECTS.map(obj => (
              <div key={obj.label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">{obj.label}</span>
                <span>{Math.ceil(obj.weight / balloonData.lift).toLocaleString()} balloons</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted font-semibold mb-2">Lift Reference by Balloon Size</p>
          <div className="space-y-1">
            {BALLOON_SIZES.map(b => (
              <div key={b.value} className={`flex justify-between px-3 py-1.5 rounded text-xs font-mono border ${v.size === b.value ? "border-primary bg-primary-light" : "border-card-border bg-background"}`}>
                <span>{b.label}</span>
                <span className="text-muted">~{b.lift}g lift</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
