"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const CURRENT_YEAR = 2026;

const GENERATIONS = [
  { name: "The Greatest Generation", start: 1901, end: 1927, emoji: "🏅", desc: "Fought in WWII, endured the Great Depression; shaped modern democratic institutions." },
  { name: "The Silent Generation", start: 1928, end: 1945, emoji: "🤫", desc: "Grew up during WWII; known for conformity, hard work, and civic-mindedness." },
  { name: "Baby Boomers", start: 1946, end: 1964, emoji: "🌸", desc: "Post-war prosperity, Vietnam War protests, and the cultural revolution of the 1960s–70s." },
  { name: "Generation X", start: 1965, end: 1980, emoji: "📼", desc: "Latchkey kids; witnessed the rise of personal computers and the fall of the Berlin Wall." },
  { name: "Millennials (Gen Y)", start: 1981, end: 1996, emoji: "💻", desc: "Came of age with the internet and 9/11; shaped by the 2008 financial crisis." },
  { name: "Generation Z (Zoomers)", start: 1997, end: 2012, emoji: "📱", desc: "First true digital natives; grew up with smartphones and social media from birth." },
  { name: "Generation Alpha", start: 2013, end: 2025, emoji: "🤖", desc: "Children of Millennials; growing up with AI, tablets, and a hyper-connected world." },
];

const FORMATIVE_EVENTS: Record<string, { year: number; event: string }[]> = {
  "Baby Boomers": [{ year: 1963, event: "JFK assassination" }, { year: 1969, event: "Moon landing" }, { year: 1974, event: "Nixon resigns" }],
  "Generation X": [{ year: 1981, event: "MTV launches" }, { year: 1989, event: "Fall of the Berlin Wall" }, { year: 1991, event: "World Wide Web born" }],
  "Millennials (Gen Y)": [{ year: 2001, event: "9/11 attacks" }, { year: 2004, event: "Facebook launches" }, { year: 2008, event: "iPhone/financial crisis" }],
  "Generation Z (Zoomers)": [{ year: 2010, event: "Instagram launches" }, { year: 2016, event: "Brexit & US election" }, { year: 2020, event: "COVID-19 pandemic" }],
  "Generation Alpha": [{ year: 2022, event: "ChatGPT launches" }, { year: 2023, event: "AI becomes mainstream" }, { year: 2025, event: "World reaches 8B people" }],
};

export default function GenerationPage() {
  const [v, setV] = useHashState({ year: "1990" });

  const year = parseInt(v.year);
  const valid = year >= 1901 && year <= CURRENT_YEAR;
  const gen = valid ? GENERATIONS.find(g => year >= g.start && year <= g.end) : undefined;
  const age = valid ? CURRENT_YEAR - year : null;
  const formativeStart = valid ? year + 10 : null;
  const formativeEnd = valid ? year + 20 : null;
  const events = gen ? (FORMATIVE_EVENTS[gen.name] ?? []) : [];

  return (
    <CalculatorShell title="Generation Calculator" description="Find out which generation you belong to based on birth year, with age, fun facts, and formative events.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Birth Year</label>
          <input type="number" value={v.year} onChange={e => setV({ year: e.target.value })} min="1901" max={CURRENT_YEAR} className={ic} />
        </div>

        {gen && age !== null && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Your Generation</span>
              <span className="block text-3xl mb-1">{gen.emoji}</span>
              <span className="block font-bold text-xl text-primary">{gen.name}</span>
              <span className="text-xs text-muted">{gen.start}–{gen.end}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">Age in {CURRENT_YEAR}</span>
                <span className="font-bold text-lg">{age}</span>
              </div>
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">Formative Years</span>
                <span className="font-bold">{formativeStart}–{formativeEnd}</span>
              </div>
            </div>
            <p className="text-xs text-muted px-1">{gen.desc}</p>
            {events.length > 0 && (
              <div>
                <p className="text-xs text-muted font-semibold mb-2">Key Events During Formative Years (ages 10–20)</p>
                <div className="space-y-1">
                  {events.map(e => (
                    <div key={e.year} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                      <span className="text-muted">{e.year}</span>
                      <span>{e.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <p className="text-xs text-muted font-semibold mb-2">All Generations</p>
          <div className="space-y-1">
            {GENERATIONS.map(g => (
              <div key={g.name} className={`flex justify-between px-3 py-1.5 rounded text-xs font-mono border ${gen?.name === g.name ? "border-primary bg-primary-light" : "border-card-border bg-background"}`}>
                <span>{g.emoji} {g.name}</span>
                <span className="text-muted">{g.start}–{g.end}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
