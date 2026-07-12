// Exporte le vault LabIA vers kb/content pour Quartz — structure seule
// (titre + liens), zero contenu de note. cf. docs/decisions.md : le vault
// est prive (ADR-005), on ne publie que le graphe, jamais le texte des
// notes elles-memes. A relancer manuellement quand le vault change ; le
// resultat est commite tel quel (kb/content n'est pas dans .gitignore).
//
// Usage : node scripts/export-kb-skeleton.mjs <vault-dir> [kb-content-dir]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = process.argv[2];
const DEST = process.argv[3] ?? path.join(__dirname, "..", "kb", "content");

if (!SRC) {
  console.error("Usage: node scripts/export-kb-skeleton.mjs <vault-dir> [kb-content-dir]");
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

function cleanTitle(raw) {
  return raw.replace(/\*\*/g, "").replace(/`/g, "").trim();
}

// Nettoie kb/content avant de repartir de zero (evite les notes supprimees
// du vault de rester publiees) -- sauf index.md, page d'accueil geree a la main.
for (const entry of fs.readdirSync(DEST)) {
  if (entry.endsWith(".md") && entry !== "index.md") fs.unlinkSync(path.join(DEST, entry));
}

const files = walk(SRC);
let total = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const slug = path.basename(file, ".md");

  const h1 = raw.match(/^#\s+(.+)$/m);
  const title = cleanTitle(h1 ? h1[1] : slug);

  const linkTargets = new Set();
  for (const m of raw.matchAll(/\[\[([^\]|#]+)/g)) {
    linkTargets.add(m[1].trim());
  }

  const links = [...linkTargets].map((t) => `- [[${t}]]`).join("\n");
  const skeleton = `---\ntitle: "${title.replace(/"/g, '\\"')}"\n---\n\n# ${title}\n\n${links}\n`;

  fs.writeFileSync(path.join(DEST, `${slug}.md`), skeleton, "utf8");
  total++;
}

console.log(`${total} notes exportees (structure seule) vers ${DEST}`);
