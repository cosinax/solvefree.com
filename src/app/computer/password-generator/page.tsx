"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

// 256-word list for memorable passwords (~8 bits entropy per word)
const WORDS = "able about above acid aged ago alarm album alert alien alley allow alone along also amber angel angry ankle apple april arch army arson asked atom aunt auto away axis baby back ball band bank barn base bath bear beat beef bell belt bind bird bite blaze blend bless block blood bloom blow blue blur bold bolt bomb bond bone book boom boot bore born boss both bowl brag bran brave brew brim bring brisk broth brown brush buck buff bulk bull bump bunk burn bush busy buzz cage calm camp cane cape card care cart case cash cast cave cell cent chef chip chop city clam clap clay clip club clue coal coat coil cold colt cone cool copy cord corn cost cozy crab crew crop crow cube curl damp dare dark dart dash data date dawn dear deck deep deer deft deny desk dial dice diet dime dine dirt dish disk dive dock does dome door down draw drop drum duck dump dune dusk dust duty each earn edge else envy epic even ever evil exam face fact fade fake fall fame fang farm fast fate fawn fear feed feel feet fell fern fest file fill film find fire fish fist flag flap flat flaw flea fled flew flip flock flow flue foam foil folk fond font food fool foot ford fork form fort foul four free frog from fuel full fund fuse fuzz gain gale gaze gear germ gild gilt glad glow glue goat gold golf good grab gray grit grow gulf gust half hall halt hand hang hard harm harp hash have hawk haze head heal heap heat heel held helm help hemp herb hero high hill hint hive hold hole holm home hood hook hope horn host hour huge hull hump hunt hymn idea idle inch into iron isle item jack jade jail jams java jaws jazz jolt jump jury just keen keep kind king knee knob know lace lack lake lame lamp land lane lard lark last late lava lawn lead leaf lean leap left lens life lift like lily lime link lion list load loaf loan loft long look loom loop lore mace mail main male mall malt mane many mark mars mast mate math maze meal meet melt menu mesh mild mill mime mind mine mint mist moan moat mode mole moor more moss most mule mute myth nail name navy neat neck need nest next nice nine node none noon norm note noun nova numb oath okay omen once only open oval oven over pace pack page pail pair palm pant park part past path pave pawn peak peel peer pick pier pink pipe plan play plot plow ploy plum plus poet polo pond pony pool poor port pose post pour pray prep prey prim prod prop pull pump pure push race rack rage rain rake ramp rank rare rash rate rave real reel rely rend rent rest rich ride rift ring riot rise risk road roam roar rock role roof room root rope rose ruby ruin rule rush rust safe saga sage sail salt same sand sane sang sash sate save seal seam seed sell semi send sent ship shot show shut sick sift silk sill sink site size skim skip slab slam slap slay sled slim slip slot slow slug slum snap snip snow soap soar sock soft sole some song sort soup sour span spar spin spot spur stab stag star stay stem stew stir stop stub such sulk surf swan swap swat sway tale tall tame tang tart task team tear tell tent than that them thin tide time tint tire toad told toll tomb tone tore torn toss tour town trap tray trim trio trip true tuck tuft tulip tune turf tusk twin type ugly undo unit upon user vain vale vary vast veil vein very vest view vile vine void volt wade wage wail wake walk wall want ward warm warp wary wash wave wavy weed well went west whim wide wild wilt wine wing wink wire wise wish wisp with wolf worm worn wrap wren yard yell zero zone zoom";
const WORD_LIST = WORDS.split(" ");

function strengthLabel(bits: number): { label: string; color: string; width: string } {
  if (bits < 40) return { label: "Very Weak", color: "bg-danger", width: "w-1/5" };
  if (bits < 60) return { label: "Weak", color: "bg-orange-400", width: "w-2/5" };
  if (bits < 80) return { label: "Fair", color: "bg-accent", width: "w-3/5" };
  if (bits < 100) return { label: "Strong", color: "bg-success", width: "w-4/5" };
  return { label: "Very Strong", color: "bg-success", width: "w-full" };
}

function cryptoRandInt(max: number): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] % max;
}

export default function PasswordGeneratorPage() {
  const [mode, setMode] = useState<"random" | "words">("random");

  const [length, setLength] = useState("16");
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);

  const [wordCount, setWordCount] = useState("4");
  const [separator, setSeparator] = useState("-");
  const [capitalize, setCapitalize] = useState(false);
  const [addNumber, setAddNumber] = useState(true);

  const [passwords, setPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  function generateRandom(): string | undefined {
    let chars = "";
    if (lower) chars += LOWER;
    if (upper) chars += UPPER;
    if (digits) chars += DIGITS;
    if (symbols) chars += SYMBOLS;
    if (!chars) return undefined;
    const len = Math.min(Math.max(parseInt(length) || 8, 4), 128);
    const arr = crypto.getRandomValues(new Uint32Array(len));
    return Array.from(arr, n => chars[n % chars.length]).join("");
  }

  function generateWords(): string {
    const count = Math.min(Math.max(parseInt(wordCount) || 4, 2), 10);
    const words = Array.from({ length: count }, () => {
      const w = WORD_LIST[cryptoRandInt(WORD_LIST.length)];
      return capitalize ? w.charAt(0).toUpperCase() + w.slice(1) : w;
    });
    const num = addNumber ? String(cryptoRandInt(100)).padStart(2, "0") : "";
    return words.join(separator) + (num ? separator + num : "");
  }

  function generate() {
    const pw = mode === "random" ? generateRandom() : generateWords();
    if (pw) setPasswords(prev => [pw, ...prev].slice(0, 10));
  }

  function copyPassword(pw: string, i: number) {
    navigator.clipboard.writeText(pw);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  }

  let entropy = 0;
  if (mode === "random") {
    let charsetSize = 0;
    if (lower) charsetSize += 26;
    if (upper) charsetSize += 26;
    if (digits) charsetSize += 10;
    if (symbols) charsetSize += SYMBOLS.length;
    if (charsetSize > 0) entropy = Math.round((parseInt(length) || 8) * Math.log2(charsetSize));
  } else {
    const count = parseInt(wordCount) || 4;
    entropy = Math.round(Math.log2(WORD_LIST.length) * count + (addNumber ? Math.log2(100) : 0));
  }

  const strength = strengthLabel(entropy);
  const charsetSize = (lower ? 26 : 0) + (upper ? 26 : 0) + (digits ? 10 : 0) + (symbols ? SYMBOLS.length : 0);
  const canGenerate = mode === "words" || charsetSize > 0;

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Password Generator" description="Generate secure random passwords — random characters or memorable word phrases.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setMode("random")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${mode === "random" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>
            Random
          </button>
          <button onClick={() => setMode("words")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${mode === "words" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>
            Memorable (words)
          </button>
        </div>

        {mode === "random" ? (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Length: {length}</label>
              <input type="range" min="4" max="128" value={length} onChange={e => setLength(e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Custom length</label>
              <input type="number" min="4" max="128" value={length} onChange={e => setLength(e.target.value)} className={ic} />
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { l: "Lowercase", v: lower, s: setLower },
                { l: "Uppercase", v: upper, s: setUpper },
                { l: "Digits", v: digits, s: setDigits },
                { l: "Symbols", v: symbols, s: setSymbols },
              ].map(o => (
                <label key={o.l} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input type="checkbox" checked={o.v} onChange={e => o.s(e.target.checked)} className="rounded" />
                  {o.l}
                </label>
              ))}
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Number of words: {wordCount}</label>
              <input type="range" min="2" max="10" value={wordCount} onChange={e => setWordCount(e.target.value)} className="w-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted mb-1">Separator</label>
                <select value={separator} onChange={e => setSeparator(e.target.value)}
                  className="w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="-">Hyphen (-)</option>
                  <option value=".">Dot (.)</option>
                  <option value="_">Underscore (_)</option>
                  <option value=" ">Space ( )</option>
                  <option value="">None</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input type="checkbox" checked={capitalize} onChange={e => setCapitalize(e.target.checked)} className="rounded" />
                  Capitalize words
                </label>
                <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input type="checkbox" checked={addNumber} onChange={e => setAddNumber(e.target.checked)} className="rounded" />
                  Append number
                </label>
              </div>
            </div>
            <div className="px-3 py-2 bg-card rounded-lg text-xs text-muted">
              Example: <span className="font-mono">{capitalize ? "Brave" : "brave"}{separator}{capitalize ? "Anchor" : "anchor"}{separator}{capitalize ? "Storm" : "storm"}{addNumber ? separator + "42" : ""}</span>
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted">
            <span>Strength: <span className="font-semibold text-foreground">{strength.label}</span></span>
            <span>~{entropy} bits entropy</span>
          </div>
          <div className="w-full h-1.5 bg-card rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
          </div>
        </div>

        <button
          onClick={generate}
          className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50"
          disabled={!canGenerate}
        >
          Generate Password
        </button>

        {passwords.length > 0 && (
          <div className="space-y-1">
            {passwords.map((p, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-background border border-card-border rounded-lg">
                <span className="font-mono text-sm break-all flex-1 select-all">{p}</span>
                <button
                  onClick={() => copyPassword(p, i)}
                  className="shrink-0 text-xs px-2 py-1 rounded bg-card border border-card-border hover:bg-primary-light transition-colors"
                >
                  {copied === i ? "✓" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
