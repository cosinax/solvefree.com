"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ic =
  "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

interface YearRow {
  age: number;
  contributions: number;
  employerMatch: number;
  growth: number;
  balance: number;
}

export default function FourOhOneKPage() {
  const [v, setV] = useHashState({
    currentAge: "30",
    retireAge: "65",
    currentBalance: "25000",
    annualContribution: "10000",
    salary: "80000",
    matchPct: "50",
    matchMaxPct: "6",
    returnRate: "7",
    salaryGrowth: "2",
  });

  const currentAge = parseInt(v.currentAge) || 0;
  const retireAge = parseInt(v.retireAge) || 65;
  const currentBalance = parseFloat(v.currentBalance) || 0;
  const annualContribution = parseFloat(v.annualContribution) || 0;
  const salary = parseFloat(v.salary) || 0;
  const matchPct = parseFloat(v.matchPct) / 100; // e.g. 0.5 for 50%
  const matchMaxPct = parseFloat(v.matchMaxPct) / 100; // e.g. 0.06 for 6%
  const returnRate = parseFloat(v.returnRate) / 100;
  const salaryGrowth = parseFloat(v.salaryGrowth) / 100;

  const yearsToRetire = retireAge - currentAge;
  const valid =
    yearsToRetire > 0 &&
    salary > 0 &&
    returnRate > 0 &&
    annualContribution >= 0;

  const rows: YearRow[] = [];
  let balance = currentBalance;
  let totalContributions = 0;
  let totalEmployerMatch = 0;
  let currentSalary = salary;
  let cumulativeContribs = 0;
  let cumulativeMatch = 0;

  if (valid) {
    for (let y = 0; y < yearsToRetire; y++) {
      const employeeContrib = Math.min(annualContribution, currentSalary);
      const maxMatchAmount = currentSalary * matchMaxPct;
      const employerMatch = Math.min(employeeContrib * matchPct, maxMatchAmount * matchPct);
      const totalContrib = employeeContrib + employerMatch;
      const growthBefore = balance * returnRate;
      balance = balance * (1 + returnRate) + totalContrib;
      totalContributions += employeeContrib;
      totalEmployerMatch += employerMatch;
      cumulativeContribs += employeeContrib;
      cumulativeMatch += employerMatch;

      rows.push({
        age: currentAge + y + 1,
        contributions: cumulativeContribs,
        employerMatch: cumulativeMatch,
        growth: balance - cumulativeContribs - cumulativeMatch - currentBalance,
        balance,
      });

      currentSalary = currentSalary * (1 + salaryGrowth);
    }
  }

  const finalBalance = valid && rows.length > 0 ? rows[rows.length - 1].balance : 0;
  const totalGrowth = finalBalance - totalContributions - totalEmployerMatch - currentBalance;

  // Chart: sample every year, or every 5 years if > 30 years
  const chartStep = yearsToRetire > 30 ? 5 : 1;
  const chartData = rows
    .filter((r, i) => (i + 1) % chartStep === 0 || i === rows.length - 1)
    .map((r) => ({
      age: String(r.age),
      contributions: r.contributions + currentBalance,
      match: r.employerMatch,
      growth: Math.max(0, r.growth),
    }));

  return (
    <CalculatorShell
      title="401(k) Savings Calculator"
      description="Project your 401(k) balance at retirement including employer matching."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Current Age</label>
            <input
              type="number"
              value={v.currentAge}
              onChange={(e) => setV({ currentAge: e.target.value })}
              className={ic}
              min="18"
              max="80"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Retirement Age
            </label>
            <input
              type="number"
              value={v.retireAge}
              onChange={(e) => setV({ retireAge: e.target.value })}
              className={ic}
              min="40"
              max="80"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Current 401(k) Balance ($)
            </label>
            <input
              type="number"
              value={v.currentBalance}
              onChange={(e) => setV({ currentBalance: e.target.value })}
              className={ic}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Annual Salary ($)
            </label>
            <input
              type="number"
              value={v.salary}
              onChange={(e) => setV({ salary: e.target.value })}
              className={ic}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Annual Contribution ($)
            </label>
            <input
              type="number"
              value={v.annualContribution}
              onChange={(e) => setV({ annualContribution: e.target.value })}
              className={ic}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Employer Match (%)
            </label>
            <input
              type="number"
              value={v.matchPct}
              onChange={(e) => setV({ matchPct: e.target.value })}
              step="5"
              className={ic}
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Match Up To (% of salary)
            </label>
            <input
              type="number"
              value={v.matchMaxPct}
              onChange={(e) => setV({ matchMaxPct: e.target.value })}
              step="1"
              className={ic}
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Annual Return (%)
            </label>
            <input
              type="number"
              value={v.returnRate}
              onChange={(e) => setV({ returnRate: e.target.value })}
              step="0.5"
              className={ic}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Salary Growth (%/yr)
            </label>
            <input
              type="number"
              value={v.salaryGrowth}
              onChange={(e) => setV({ salaryGrowth: e.target.value })}
              step="0.5"
              className={ic}
              min="0"
            />
          </div>
        </div>

        {valid && (
          <div className="space-y-4">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">
                Balance at Retirement (Age {retireAge})
              </span>
              <span className="block font-mono font-bold text-3xl text-primary">
                {usd(finalBalance)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">
                  Your Contributions
                </span>
                <span className="font-mono font-semibold text-sm">
                  {usd(totalContributions + currentBalance)}
                </span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">
                  Employer Match
                </span>
                <span className="font-mono font-semibold text-sm">
                  {usd(totalEmployerMatch)}
                </span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">
                  Investment Growth
                </span>
                <span className="font-mono font-semibold text-sm">
                  {usd(Math.max(0, totalGrowth))}
                </span>
              </div>
            </div>

            {chartData.length > 0 && (
              <div className="bg-background border border-card-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-muted mb-2 text-center">
                  Balance by Age
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="age" tick={{ fontSize: 10 }} label={{ value: "Age", position: "insideBottomRight", offset: -5, fontSize: 10 }} />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(val) =>
                        `$${(val / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip formatter={(val) => usd(Number(val))} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar
                      dataKey="contributions"
                      fill="#2563eb"
                      name="Your Contributions"
                      stackId="a"
                    />
                    <Bar
                      dataKey="match"
                      fill="#10b981"
                      name="Employer Match"
                      stackId="a"
                    />
                    <Bar
                      dataKey="growth"
                      fill="#f59e0b"
                      name="Growth"
                      stackId="a"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <p className="text-xs text-muted text-center">
              Assumes {v.returnRate}% annual return and {v.salaryGrowth}% salary growth. Does not account for contribution limits or taxes.
            </p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
