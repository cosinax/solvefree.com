"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic =
  "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc =
  "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

interface CityData {
  name: string;
  index: number; // overall COL index relative to US avg = 100
  housing: number; // housing sub-index
  groceries: number;
  transport: number;
}

const CITIES: CityData[] = [
  { name: "New York City", index: 187, housing: 320, groceries: 118, transport: 132 },
  { name: "San Francisco", index: 194, housing: 345, groceries: 115, transport: 128 },
  { name: "Los Angeles", index: 173, housing: 290, groceries: 112, transport: 120 },
  { name: "Seattle", index: 150, housing: 245, groceries: 108, transport: 118 },
  { name: "Boston", index: 162, housing: 275, groceries: 113, transport: 122 },
  { name: "Washington DC", index: 152, housing: 258, groceries: 110, transport: 119 },
  { name: "Portland", index: 130, housing: 200, groceries: 107, transport: 111 },
  { name: "Miami", index: 123, housing: 190, groceries: 108, transport: 106 },
  { name: "Denver", index: 118, housing: 182, groceries: 106, transport: 105 },
  { name: "Austin", index: 117, housing: 178, groceries: 104, transport: 106 },
  { name: "Minneapolis", index: 111, housing: 155, groceries: 104, transport: 102 },
  { name: "Nashville", index: 110, housing: 158, groceries: 103, transport: 103 },
  { name: "Chicago", index: 110, housing: 155, groceries: 104, transport: 109 },
  { name: "Charlotte", index: 103, housing: 135, groceries: 101, transport: 101 },
  { name: "Dallas", index: 103, housing: 135, groceries: 101, transport: 104 },
  { name: "Atlanta", index: 107, housing: 148, groceries: 102, transport: 102 },
  { name: "Phoenix", index: 105, housing: 140, groceries: 102, transport: 103 },
  { name: "Houston", index: 100, housing: 128, groceries: 100, transport: 100 },
  { name: "Detroit", index: 89, housing: 78, groceries: 96, transport: 95 },
  { name: "Cleveland", index: 85, housing: 68, groceries: 95, transport: 92 },
];

const CITY_NAMES = CITIES.map((c) => c.name);

function getCity(name: string): CityData {
  return CITIES.find((c) => c.name === name) ?? CITIES[0];
}

export default function CostOfLivingPage() {
  const [v, setV] = useHashState({
    currentCity: "Houston",
    targetCity: "New York City",
    salary: "80000",
  });

  const salary = parseFloat(v.salary) || 0;
  const current = getCity(v.currentCity);
  const target = getCity(v.targetCity);

  const valid = salary > 0 && current.name !== target.name;

  // Equivalent salary = salary * (target.index / current.index)
  const equivalentSalary = valid ? salary * (target.index / current.index) : 0;
  const diffPct = valid
    ? ((target.index - current.index) / current.index) * 100
    : 0;
  const salaryDiff = equivalentSalary - salary;

  // Sub-index breakdown: housing 35%, groceries 15%, transport 15%, other 35%
  // Estimated cost per category relative to current city
  function subCost(
    base: number,
    currentIdx: number,
    targetIdx: number,
    weight: number
  ): { current: number; target: number } {
    const curr = (base * currentIdx) / 100;
    const tgt = (base * targetIdx) / 100;
    return {
      current: (curr * weight) / 100,
      target: (tgt * weight) / 100,
    };
  }

  const annualBase = salary; // use salary as the spending base
  const housing = subCost(annualBase, current.housing, target.housing, 35);
  const groceries = subCost(annualBase, current.groceries, target.groceries, 15);
  const transport = subCost(annualBase, current.transport, target.transport, 15);
  const other = {
    current: annualBase * 0.35 * (current.index / 100),
    target: (equivalentSalary || annualBase) * 0.35 * (target.index / 100),
  };

  return (
    <CalculatorShell
      title="Cost of Living Comparison"
      description="Compare the cost of living between major US cities and find your equivalent salary."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Current City</label>
            <select
              value={v.currentCity}
              onChange={(e) => setV({ currentCity: e.target.value })}
              className={sc}
            >
              {CITY_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Target City</label>
            <select
              value={v.targetCity}
              onChange={(e) => setV({ targetCity: e.target.value })}
              className={sc}
            >
              {CITY_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-muted mb-1">
              Current Salary ($)
            </label>
            <input
              type="number"
              value={v.salary}
              onChange={(e) => setV({ salary: e.target.value })}
              className={ic}
              min="0"
            />
          </div>
        </div>

        {salary > 0 && (
          <div className="space-y-4">
            {/* COL index comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">
                  {current.name} COL Index
                </span>
                <span className="font-mono font-semibold text-lg">
                  {current.index}
                </span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">
                  {target.name} COL Index
                </span>
                <span className="font-mono font-semibold text-lg">
                  {target.index}
                </span>
              </div>
            </div>

            {valid && (
              <>
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="block text-sm text-muted">
                    Equivalent Salary in {target.name}
                  </span>
                  <span className="block font-mono font-bold text-3xl text-primary">
                    {usd(equivalentSalary)}
                  </span>
                  <span
                    className={`block text-sm mt-1 font-medium ${diffPct > 0 ? "text-red-500" : "text-green-600"}`}
                  >
                    {diffPct > 0 ? "+" : ""}
                    {diffPct.toFixed(1)}% cost of living
                    {" "}({diffPct > 0 ? usd(salaryDiff) + " more needed" : usd(-salaryDiff) + " less needed"})
                  </span>
                </div>

                {/* Sub-index table */}
                <div className="bg-background border border-card-border rounded-xl p-4">
                  <h3 className="text-sm font-semibold mb-3">
                    Estimated Annual Spending Breakdown
                  </h3>
                  <div className="space-y-0">
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted pb-1 border-b border-card-border">
                      <span>Category</span>
                      <span className="text-right">{current.name.split(" ")[0]}</span>
                      <span className="text-right">{target.name.split(" ")[0]}</span>
                    </div>
                    {[
                      { label: "Housing (35%)", curr: housing.current, tgt: housing.target },
                      { label: "Groceries (15%)", curr: groceries.current, tgt: groceries.target },
                      { label: "Transport (15%)", curr: transport.current, tgt: transport.target },
                      { label: "Other (35%)", curr: other.current, tgt: other.target },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="grid grid-cols-3 gap-2 text-sm py-1.5 border-b border-card-border"
                      >
                        <span className="text-muted">{row.label}</span>
                        <span className="font-mono text-right">{usd(row.curr)}</span>
                        <span
                          className={`font-mono text-right ${row.tgt > row.curr ? "text-red-500" : "text-green-600"}`}
                        >
                          {usd(row.tgt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted text-center">
                  COL indices are approximate estimates. Housing is typically the largest variable. US average = 100.
                </p>
              </>
            )}

            {!valid && salary > 0 && (
              <p className="text-sm text-muted text-center">
                Select two different cities to compare.
              </p>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
