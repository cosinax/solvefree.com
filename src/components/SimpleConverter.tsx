"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

interface SimpleConverterProps {
  title: string;
  description: string;
  units: Record<string, number>;
  defaultFrom?: string;
  defaultTo?: string;
  isTemperature?: boolean;
}

function convertTemp(val: number, from: string, to: string): number {
  let celsius = from === "Celsius" ? val : from === "Fahrenheit" ? (val - 32) * 5 / 9 : val - 273.15;
  if (to === "Celsius") return celsius;
  if (to === "Fahrenheit") return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

export function SimpleConverter({ title, description, units, defaultFrom, defaultTo, isTemperature }: SimpleConverterProps) {
  const unitNames = Object.keys(units);
  const [v, setV] = useHashState({
    value: "1",
    from: defaultFrom || unitNames[0],
    to: defaultTo || unitNames[1],
  });

  const val = parseFloat(v.value);
  const valid = !isNaN(val);

  let result = 0;
  if (valid) {
    if (isTemperature) {
      result = convertTemp(val, v.from, v.to);
    } else {
      result = (val * units[v.from]) / units[v.to];
    }
  }

  const allResults = valid
    ? unitNames.filter((u) => u !== v.from).map((u) => ({
        unit: u,
        value: isTemperature ? convertTemp(val, v.from, u) : (val * units[v.from]) / units[u],
      }))
    : [];

  return (
    <CalculatorShell title={title} description={description}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Value</label>
          <input type="number" value={v.value} onChange={(e) => setV({ value: e.target.value })}
            className="w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">From</label>
            <select value={v.from} onChange={(e) => setV({ from: e.target.value })}
              className="w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm">
              {unitNames.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">To</label>
            <select value={v.to} onChange={(e) => setV({ to: e.target.value })}
              className="w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm">
              {unitNames.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <button onClick={() => { setV({ from: v.to, to: v.from }); }}
          className="w-full text-sm text-primary font-medium py-1 hover:underline">⇄ Swap</button>
        {valid && (
          <>
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">{v.value} {v.from} =</span>
              <span className="block font-mono font-bold text-2xl text-primary">
                {result.toLocaleString("en-US", { maximumSignificantDigits: 10 })} {v.to}
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xs text-muted font-semibold uppercase tracking-wide">All conversions</h3>
              {allResults.map((r) => (
                <div key={r.unit} className="flex justify-between items-center px-3 py-2 bg-background border border-card-border rounded-lg text-sm">
                  <span className="text-muted">{r.unit}</span>
                  <span className="font-mono font-semibold">{r.value.toLocaleString("en-US", { maximumSignificantDigits: 10 })}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </CalculatorShell>
  );
}
