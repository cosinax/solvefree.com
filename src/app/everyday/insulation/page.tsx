"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sel = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

// Coverage per bag/roll in sq ft at required R-value thickness
const INSULATION_TYPES = [
  { value: "batts_r13", label: "Batts R-13 (3.5\" wall)", rValue: 13, unit: "roll", coveragePerUnit: 40, bagLabel: "Roll (40 sq ft)", pricePerUnit: 20 },
  { value: "batts_r19", label: "Batts R-19 (6.25\" floor)", rValue: 19, unit: "roll", coveragePerUnit: 40, bagLabel: "Roll (40 sq ft)", pricePerUnit: 28 },
  { value: "batts_r30", label: "Batts R-30 (9.5\" ceiling)", rValue: 30, unit: "roll", coveragePerUnit: 40, bagLabel: "Roll (40 sq ft)", pricePerUnit: 45 },
  { value: "blown_r30", label: "Blown-in (attic R-30)", rValue: 30, unit: "bag", coveragePerUnit: 40, bagLabel: "Bag (covers ~40 sq ft)", pricePerUnit: 18 },
  { value: "blown_r38", label: "Blown-in (attic R-38)", rValue: 38, unit: "bag", coveragePerUnit: 32, bagLabel: "Bag (covers ~32 sq ft)", pricePerUnit: 18 },
  { value: "rigid_r10", label: "Rigid Foam R-10 (2\" board)", rValue: 10, unit: "sheet", coveragePerUnit: 32, bagLabel: "Sheet (4x8 = 32 sq ft)", pricePerUnit: 30 },
  { value: "rigid_r20", label: "Rigid Foam R-20 (4\" board)", rValue: 20, unit: "sheet", coveragePerUnit: 32, bagLabel: "Sheet (4x8 = 32 sq ft)", pricePerUnit: 55 },
];

const RVALUE_ZONES = [
  { location: "Attic (warm climate, zone 1-2)", min: 30, max: 49 },
  { location: "Attic (moderate, zone 3-4)", min: 38, max: 60 },
  { location: "Attic (cold, zone 5-8)", min: 49, max: 60 },
  { location: "Walls (all zones)", min: 13, max: 21 },
  { location: "Floor over unheated space", min: 13, max: 25 },
  { location: "Crawl space walls", min: 5, max: 10 },
];

export default function InsulationPage() {
  const [v, setV] = useHashState({ area: "500", type: "batts_r13", price: "" });

  const area = parseFloat(v.area);
  const ins = INSULATION_TYPES.find(t => t.value === v.type) ?? INSULATION_TYPES[0];
  const price = parseFloat(v.price);
  const valid = area > 0;

  const unitsNeeded = Math.ceil(area / ins.coveragePerUnit);
  const estimatedCost = !isNaN(price) && price > 0 ? unitsNeeded * price : unitsNeeded * ins.pricePerUnit;

  return (
    <CalculatorShell title="Insulation Calculator" description="Calculate how much insulation you need and estimate cost based on area and insulation type.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Area to Insulate (sq ft)</label>
          <input type="number" value={v.area} onChange={e => setV({ area: e.target.value })} className={ic} />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Insulation Type</label>
          <select value={v.type} onChange={e => setV({ type: e.target.value })} className={sel}>
            {INSULATION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Price per {ins.unit} (optional, uses typical price if blank)</label>
          <input type="number" value={v.price} onChange={e => setV({ price: e.target.value })} placeholder={`e.g. ${ins.pricePerUnit}`} className={ic} />
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">{ins.bagLabel}s Needed</span>
              <span className="block font-mono font-bold text-4xl text-primary">{unitsNeeded}</span>
              <span className="text-xs text-muted">{ins.unit}s for {area} sq ft at R-{ins.rValue}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">R-Value</span>
                <span className="font-bold">R-{ins.rValue}</span>
              </div>
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">Est. Material Cost</span>
                <span className="font-bold text-primary">${estimatedCost.toFixed(0)}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-muted font-semibold mb-2">Recommended R-Values by Location</p>
          <div className="space-y-1">
            {RVALUE_ZONES.map(z => (
              <div key={z.location} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">{z.location}</span>
                <span>R-{z.min} to R-{z.max}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
