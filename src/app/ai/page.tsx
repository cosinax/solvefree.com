import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI & Machine Learning",
  description: "Free AI calculators: token estimator, model cost, confusion matrix, softmax, and more.",
  openGraph: {
    title: "AI & ML Calculators — SolveFree",
    description: "Free AI calculators: token estimator, API cost, model size, confusion matrix, softmax.",
    url: "https://solvefree.com/ai",
  },
  alternates: { canonical: "https://solvefree.com/ai" },
};

const calculators = [
  { title: "Token Estimator", description: "Estimate token count for LLM input text", href: "/ai/token-estimator", icon: "🪙" },
  { title: "AI API Cost Calculator", description: "Estimate OpenAI, Anthropic, Google API costs", href: "/ai/api-cost", icon: "💰" },
  { title: "Model Size Calculator", description: "Estimate GPU memory for model parameters", href: "/ai/model-size", icon: "🧠" },
  { title: "Confusion Matrix", description: "Calculate precision, recall, F1 from a confusion matrix", href: "/ai/confusion-matrix", icon: "🎯" },
  { title: "FLOPS Calculator", description: "Estimate compute (FLOPS) for training/inference", href: "/ai/flops", icon: "⚡" },
  { title: "Training Time Estimator", description: "Estimate training time from dataset and hardware", href: "/ai/training-time", icon: "⏱️" },
  { title: "Perplexity Calculator", description: "Calculate perplexity from cross-entropy loss", href: "/ai/perplexity", icon: "🔀" },
  { title: "Embedding Dimensions", description: "Estimate optimal embedding dimensions", href: "/ai/embedding-dimensions", icon: "📐" },
  { title: "Batch Size Calculator", description: "Optimal batch size for GPU memory", href: "/ai/batch-size", icon: "🗄️" },
  { title: "Learning Rate Finder", description: "Suggested learning rates by model size", href: "/ai/learning-rate", icon: "📈" },
  { title: "Image Resolution", description: "Calculate pixel count, aspect ratio, and memory", href: "/ai/image-resolution", icon: "🖼️" },
  { title: "Softmax Calculator", description: "Apply softmax function to a set of values", href: "/ai/softmax", icon: "📊" },
];

export default function AIPage() {
  return (
    <PageShell title="AI & Machine Learning" description="Token estimation, API costs, model sizing, training metrics, and more">
      <SearchableGrid items={calculators} placeholder="Search AI calculators..." />
    </PageShell>
  );
}
