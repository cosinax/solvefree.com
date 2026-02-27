"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, d = 5): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e6 || (abs < 0.001 && abs > 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(d)).toString();
}

export default function ThinLensPage() {
  const [v, setV] = useHashState({
    mode: "image",
    f: "10",
    do: "30",
    di: "15",
    lensType: "converging",
  });

  const result = useMemo(() => {
    const f = parseFloat(v.f) * (v.lensType === "diverging" ? -1 : 1);
    const doVal = parseFloat(v.do);
    const diVal = parseFloat(v.di);

    let fCalc = NaN, doCalc = NaN, diCalc = NaN;

    if (v.mode === "image") {
      if (!isFinite(f) || !isFinite(doVal) || doVal === 0) return null;
      // 1/di = 1/f - 1/do
      diCalc = 1 / (1 / f - 1 / doVal);
      fCalc = f; doCalc = doVal;
    } else if (v.mode === "object") {
      if (!isFinite(f) || !isFinite(diVal) || diVal === 0) return null;
      doCalc = 1 / (1 / f - 1 / diVal);
      fCalc = f; diCalc = diVal;
    } else {
      if (!isFinite(doVal) || !isFinite(diVal) || doVal === 0 || diVal === 0) return null;
      fCalc = 1 / (1 / doVal + 1 / diVal);
      doCalc = doVal; diCalc = diVal;
    }

    const magnification = -diCalc / doCalc;
    const imageType = diCalc > 0 ? "Real" : "Virtual";
    const imageOrientation = magnification < 0 ? "Inverted" : "Upright";
    const power = 1 / (fCalc / 100); // if f in cm → diopters (1/m)

    return { f: fCalc, do: doCalc, di: diCalc, magnification, imageType, imageOrientation, power };
  }, [v]);

  return (
    <CalculatorShell title="Thin Lens / Mirror Calculator" description="1/f = 1/do + 1/di — image distance, focal length, or object distance.">
      <div className="space-y-4">
        <div className="flex gap-2">
          {[{ k: "converging", l: "Converging (+)" }, { k: "diverging", l: "Diverging (−)" }].map(m => (
            <button key={m.k} onClick={() => setV({ lensType: m.k })}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${v.lensType === m.k ? "bg-primary text-white border-primary" : "bg-card border-card-border hover:bg-primary-light"}`}>
              {m.l}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs text-muted mb-1">Solve for</label>
          <div className="flex gap-2">
            {[{ k: "image", l: "Image dist (di)" }, { k: "object", l: "Object dist (do)" }, { k: "focal", l: "Focal length (f)" }].map(m => (
              <button key={m.k} onClick={() => setV({ mode: m.k })}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${v.mode === m.k ? "bg-primary text-white border-primary" : "bg-card border-card-border hover:bg-primary-light"}`}>
                {m.l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {v.mode !== "focal" && (
            <div>
              <label className="block text-xs text-muted mb-1">Focal length f (cm)</label>
              <input type="number" value={v.f} onChange={e => setV({ f: e.target.value })} className={inp} step="any" />
            </div>
          )}
          {v.mode !== "object" && (
            <div>
              <label className="block text-xs text-muted mb-1">Object distance do (cm)</label>
              <input type="number" value={v.do} onChange={e => setV({ do: e.target.value })} className={inp} step="any" />
            </div>
          )}
          {v.mode !== "image" && (
            <div>
              <label className="block text-xs text-muted mb-1">Image distance di (cm)</label>
              <input type="number" value={v.di} onChange={e => setV({ di: e.target.value })} className={inp} step="any" />
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-3">
            <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
              <div className="text-xs text-muted mb-1">
                {v.mode === "image" ? "Image Distance (di)" : v.mode === "object" ? "Object Distance (do)" : "Focal Length (f)"}
              </div>
              <div className="font-mono font-bold text-3xl text-primary">
                {v.mode === "image" ? fmt(result.di) + " cm" : v.mode === "object" ? fmt(result.do) + " cm" : fmt(result.f) + " cm"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Focal length f", value: fmt(result.f) + " cm" },
                { label: "Object dist do", value: fmt(result.do) + " cm" },
                { label: "Image dist di", value: fmt(result.di) + " cm" },
                { label: "Magnification", value: fmt(result.magnification) + "×" },
                { label: "Image type", value: result.imageType },
                { label: "Orientation", value: result.imageOrientation },
              ].map(r => (
                <div key={r.label} className="p-2 bg-card border border-card-border rounded text-center">
                  <div className="text-muted text-[10px]">{r.label}</div>
                  <div className="font-mono font-semibold text-xs">{r.value}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted">Sign convention: real objects/images have positive do/di. Diverging lenses and virtual images have negative values.</p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
