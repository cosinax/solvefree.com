"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
const awgData = [
  {awg:0,dia:8.251,area:53.49,ohm:0.3224,ampChassis:245,ampPower:150},
  {awg:2,dia:6.544,area:33.63,ohm:0.5127,ampChassis:181,ampPower:115},
  {awg:4,dia:5.189,area:21.15,ohm:0.8153,ampChassis:135,ampPower:85},
  {awg:6,dia:4.115,area:13.30,ohm:1.296,ampChassis:101,ampPower:65},
  {awg:8,dia:3.264,area:8.366,ohm:2.061,ampChassis:73,ampPower:50},
  {awg:10,dia:2.588,area:5.261,ohm:3.277,ampChassis:55,ampPower:35},
  {awg:12,dia:2.053,area:3.309,ohm:5.211,ampChassis:41,ampPower:25},
  {awg:14,dia:1.628,area:2.081,ohm:8.286,ampChassis:32,ampPower:20},
  {awg:16,dia:1.291,area:1.309,ohm:13.17,ampChassis:22,ampPower:13},
  {awg:18,dia:1.024,area:0.823,ohm:20.95,ampChassis:16,ampPower:10},
  {awg:20,dia:0.812,area:0.518,ohm:33.31,ampChassis:11,ampPower:7.5},
  {awg:22,dia:0.644,area:0.326,ohm:52.96,ampChassis:7,ampPower:5},
  {awg:24,dia:0.511,area:0.205,ohm:84.22,ampChassis:3.5,ampPower:3.5},
  {awg:26,dia:0.405,area:0.129,ohm:133.9,ampChassis:2.2,ampPower:2.2},
  {awg:28,dia:0.321,area:0.081,ohm:212.9,ampChassis:1.4,ampPower:1.4},
  {awg:30,dia:0.255,area:0.051,ohm:338.6,ampChassis:0.86,ampPower:0.86},
];
export default function WireGaugePage() {
  const [sel, setSel] = useState(10);
  const w = awgData.find(d=>d.awg===sel) || awgData[0];
  return (
    <CalculatorShell title="Wire Gauge (AWG) Reference" description="AWG wire size, resistance, and current capacity reference.">
      <div className="space-y-4">
        <div><label className="block text-sm text-muted mb-1">Select AWG</label>
          <div className="grid grid-cols-8 gap-1">{awgData.map(d=>
            <button key={d.awg} onClick={()=>setSel(d.awg)} className={`py-1.5 rounded text-xs font-mono font-medium ${sel===d.awg?"bg-primary text-white":"bg-background border border-card-border"}`}>{d.awg}</button>
          )}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Diameter</span><span className="font-mono font-bold text-lg">{w.dia} mm</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Area</span><span className="font-mono font-bold text-lg">{w.area} mm²</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Resistance</span><span className="font-mono font-bold text-lg">{w.ohm} Ω/km</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Max Current (chassis)</span><span className="font-mono font-bold text-lg">{w.ampChassis} A</span></div>
        </div>
      </div>
    </CalculatorShell>
  );
}
