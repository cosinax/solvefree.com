"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function VoltageDividerPage() {
  const [v, setV] = useHashState({ vin: "12", r1: "10000", r2: "10000" });
  const Vin = parseFloat(v.vin), R1 = parseFloat(v.r1), R2 = parseFloat(v.r2);
  const valid = Vin > 0 && R1 > 0 && R2 > 0;
  const Vout = valid ? Vin * R2 / (R1 + R2) : 0;
  const I = valid ? Vin / (R1 + R2) : 0;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Voltage Divider" description="Calculate output voltage of a resistor voltage divider.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">Vin (V)</label><input type="number" value={v.vin} onChange={e => setV({ vin: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">R1 (Ω)</label><input type="number" value={v.r1} onChange={e => setV({ r1: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">R2 (Ω)</label><input type="number" value={v.r2} onChange={e => setV({ r2: e.target.value })} className={ic} /></div>
        </div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Vout</span><span className="font-mono font-bold text-2xl text-primary">{Vout.toFixed(3)} V</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Current</span><span className="font-mono font-bold text-xl">{(I * 1000).toFixed(3)} mA</span></div>
        </div>}
        <p className="text-xs text-muted">Vout = Vin × R2 / (R1 + R2)</p>
      </div>
    </CalculatorShell>
  );
}
