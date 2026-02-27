"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function EmbeddingDimensionsPage() {
  const [v, setV] = useHashState({ vocabSize: "50000", datasetSize: "1000000" });
  const vocab = parseInt(v.vocabSize), data = parseInt(v.datasetSize);
  const valid = vocab > 0 && data > 0;
  // Rule of thumb: dim ≈ vocab^(1/4) or based on dataset
  const dimByVocab = Math.round(Math.pow(vocab, 0.25) * 10);
  const dimByData = Math.round(Math.pow(data, 0.25));
  const recommended = Math.max(32, Math.min(2048, Math.round((dimByVocab + dimByData) / 2 / 32) * 32));
  const memory = (vocab * recommended * 4) / 1e6;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Embedding Dimensions" description="Estimate optimal embedding dimensions based on vocabulary and dataset size.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Vocabulary Size</label><input type="number" value={v.vocabSize} onChange={e=>setV({vocabSize:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Dataset Size</label><input type="number" value={v.datasetSize} onChange={e=>setV({datasetSize:e.target.value})} className={ic}/></div>
        </div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center col-span-2"><span className="block text-xs text-muted">Recommended Dimensions</span><span className="font-mono font-bold text-3xl text-primary">{recommended}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Embedding Memory (FP32)</span><span className="font-mono font-bold text-lg">{memory.toFixed(1)} MB</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Total Parameters</span><span className="font-mono font-bold text-lg">{(vocab*recommended/1e6).toFixed(1)}M</span></div>
        </div>}
        <p className="text-xs text-muted">Common sizes: 64, 128, 256, 384, 512, 768, 1024, 2048. Round to nearest power of 2 or multiple of 64 for GPU efficiency.</p>
      </div>
    </CalculatorShell>
  );
}
