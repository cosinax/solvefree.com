"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function OhmsLawPage() {
  const [v, setV] = useHashState({ voltage: "", current: "", resistance: "" });
  const V = parseFloat(v.voltage), I = parseFloat(v.current), R = parseFloat(v.resistance);
  const filled = [!isNaN(V), !isNaN(I), !isNaN(R)].filter(Boolean).length;
  let calcV = V, calcI = I, calcR = R, calcP = 0;
  if (filled >= 2) {
    if (isNaN(V) && !isNaN(I) && !isNaN(R)) calcV = I * R;
    if (isNaN(I) && !isNaN(V) && !isNaN(R)) calcI = V / R;
    if (isNaN(R) && !isNaN(V) && !isNaN(I)) calcR = V / I;
    calcP = calcV * calcI;
  }
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Ohm's Law Calculator" description="Calculate voltage (V), current (I), resistance (R), and power (P). Enter any two values.">
      <div className="space-y-4">
        <p className="text-sm text-muted">Enter any 2 values to calculate the rest:</p>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Voltage (V)</label><input type="number" value={v.voltage} onChange={e => setV({ voltage: e.target.value })} placeholder="volts" className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Current (A)</label><input type="number" value={v.current} onChange={e => setV({ current: e.target.value })} placeholder="amps" className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Resistance (Ω)</label><input type="number" value={v.resistance} onChange={e => setV({ resistance: e.target.value })} placeholder="ohms" className={ic} /></div>
        </div>
        {filled >= 2 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Voltage</span><span className="font-mono font-bold text-xl">{calcV.toFixed(3)} V</span></div>
            <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Current</span><span className="font-mono font-bold text-xl">{calcI.toFixed(3)} A</span></div>
            <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Resistance</span><span className="font-mono font-bold text-xl">{calcR.toFixed(3)} Ω</span></div>
            <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Power</span><span className="font-mono font-bold text-xl">{calcP.toFixed(3)} W</span></div>
          </div>
        )}
        <div className="text-xs text-muted space-y-1"><p>V = I × R &nbsp; | &nbsp; I = V / R &nbsp; | &nbsp; R = V / I &nbsp; | &nbsp; P = V × I</p></div>
      </div>
    </CalculatorShell>
  );
}
