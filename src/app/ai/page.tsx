import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI & Machine Learning",
  description: "Free AI calculators: token estimator, model cost, confusion matrix, softmax, and more.",
  openGraph: {
    type: "website",
    siteName: "SolveFree",
    title: "AI & ML Calculators — SolveFree",
    description: "Free AI calculators: token estimator, API cost, model size, confusion matrix, softmax.",
    url: "https://solvefree.com/ai",
  },
  alternates: { canonical: "https://solvefree.com/ai" },
};

const calculators = [
  { title: "Token Estimator", description: "Estimate token count for LLM input text", href: "/ai/token-estimator", icon: "coins" },
  { title: "AI API Cost Calculator", description: "Estimate OpenAI, Anthropic, Google API costs", href: "/ai/api-cost", icon: "banknote" },
  { title: "Model Size Calculator", description: "Estimate GPU memory for model parameters", href: "/ai/model-size", icon: "brain" },
  { title: "Confusion Matrix", description: "Calculate precision, recall, F1 from a confusion matrix", href: "/ai/confusion-matrix", icon: "target" },
  { title: "FLOPS Calculator", description: "Estimate compute (FLOPS) for training/inference", href: "/ai/flops", icon: "zap" },
  { title: "Training Time Estimator", description: "Estimate training time from dataset and hardware", href: "/ai/training-time", icon: "timer" },
  { title: "Perplexity Calculator", description: "Calculate perplexity from cross-entropy loss", href: "/ai/perplexity", icon: "sliders" },
  { title: "Embedding Dimensions", description: "Estimate optimal embedding dimensions", href: "/ai/embedding-dimensions", icon: "ruler" },
  { title: "Batch Size Calculator", description: "Optimal batch size for GPU memory", href: "/ai/batch-size", icon: "database" },
  { title: "Learning Rate Finder", description: "Suggested learning rates by model size", href: "/ai/learning-rate", icon: "trending-up" },
  { title: "Image Resolution", description: "Calculate pixel count, aspect ratio, and memory", href: "/ai/image-resolution", icon: "camera" },
  { title: "Softmax Calculator", description: "Apply softmax function to a set of values", href: "/ai/softmax", icon: "bar-chart" },
];

export default function AIPage() {
  return (
    <PageShell title="AI & Machine Learning" description="Token estimation, API costs, model sizing, training metrics, and more">
      <SearchableGrid items={calculators} placeholder="Search AI calculators..." />
    </PageShell>
  );
}
