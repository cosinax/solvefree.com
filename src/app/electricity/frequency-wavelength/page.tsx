"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function FrequencyWavelengthPage() {
  const [v, setV] = useHashState({ freq: "2400", unit: "MHz" });
  const f = parseFloat(v.freq);
  const c = 299792458;
  const freqHz = v.unit==="MHz"?f*1e6:v.unit==="GHz"?f*1e9:v.unit==="kHz"?f*1e3:f;
  const valid = freqHz > 0;
  const wavelength = valid ? c / freqHz : 0;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Frequency / Wavelength" description="Convert between frequency and wavelength (speed of light).">
      <div className="space-y-4">
        <div className="flex gap-2"><div className="flex-1"><label className="block text-sm text-muted mb-1">Frequency</label><input type="number" value={v.freq} onChange={e=>setV({freq:e.target.value})} className={ic}/></div>
          <div className="w-24"><label className="block text-sm text-muted mb-1">Unit</label><select value={v.unit} onChange={e=>setV({unit:e.target.value})} className={ic}><option>Hz</option><option>kHz</option><option>MHz</option><option>GHz</option></select></div></div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Wavelength</span><span className="font-mono font-bold text-xl">{wavelength>=1?wavelength.toFixed(2)+" m":wavelength>=0.01?(wavelength*100).toFixed(2)+" cm":(wavelength*1000).toFixed(2)+" mm"}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Frequency</span><span className="font-mono font-bold text-xl">{freqHz>=1e9?(freqHz/1e9).toFixed(3)+" GHz":freqHz>=1e6?(freqHz/1e6).toFixed(3)+" MHz":(freqHz/1e3).toFixed(3)+" kHz"}</span></div>
        </div>}
      </div>
    </CalculatorShell>
  );
}
