import { Calculator } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-card-border mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-sm text-muted">
          <p className="font-semibold text-foreground mb-1 flex items-center justify-center gap-1.5">
            <Calculator className="h-4 w-4" strokeWidth={2} />
            SolveFree
          </p>
          <p>Free calculators for everyone. No ads. No tracking. Ever.</p>
          <p className="mt-2">
            All calculations are performed in your browser — your data never
            leaves your device.
          </p>
        </div>
      </div>
    </footer>
  );
}
