// scripts/generate-sitemap.ts
import { writeFileSync } from "fs";
import { join } from "path";
import { allCalculators } from "../src/data/calculators";

const BASE_URL = "https://solvefree.com";
const TODAY = new Date().toISOString().split("T")[0];

// Collect unique category slugs from href like "/finance/mortgage" -> "finance"
const categories = [...new Set(allCalculators.map((c) => c.href.split("/")[1]))];

const urls: string[] = [
  // Homepage
  `  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>`,
  // Category pages
  ...categories.map(
    (cat) => `  <url>
    <loc>${BASE_URL}/${cat}</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>`
  ),
  // Individual calculator pages
  ...allCalculators.map(
    (c) => `  <url>
    <loc>${BASE_URL}${c.href}</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>0.7</priority>
    <changefreq>monthly</changefreq>
  </url>`
  ),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

const outPath = join(process.cwd(), "public", "sitemap.xml");
writeFileSync(outPath, xml, "utf-8");
console.log(
  `Sitemap written to public/sitemap.xml (${allCalculators.length} calculators + ${categories.length} categories + homepage)`
);
