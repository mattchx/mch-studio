#!/usr/bin/env tsx
/**
 * Newsletter scrape scaffold.
 *
 * Usage:
 *   tsx scripts/newsletter-scrape.ts --edition projects [--dry-run]
 *   tsx scripts/newsletter-scrape.ts --edition labs     [--dry-run]
 *
 * Reads the sources file for the given edition, writes a scored-shortlist
 * template to the vault. Scoring/scraping not implemented yet — this stub
 * produces the template shape so the pipeline can be filled in issue-by-issue.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

type Edition = "projects" | "labs";

const VAULT = "/Users/mattch/dev/vault";

const EDITION_PATHS: Record<Edition, { sources: string; drafts: string; name: string }> = {
  projects: {
    sources: join(VAULT, "MCH Projects/Client Acquisition/Inbound/Newsletter — Sources.md"),
    drafts: join(VAULT, "MCH Projects/Client Acquisition/Inbound/Newsletter Drafts"),
    name: "Service Owners Edition",
  },
  labs: {
    sources: join(VAULT, "MCH Labs/Newsletter — Sources.md"),
    drafts: join(VAULT, "MCH Labs/Newsletter Drafts"),
    name: "Operators Edition",
  },
};

function parseArgs(argv: string[]) {
  const idx = argv.indexOf("--edition");
  const edition = idx >= 0 ? (argv[idx + 1] as Edition) : undefined;
  const dryRun = argv.includes("--dry-run");
  if (edition !== "projects" && edition !== "labs") {
    console.error("Usage: newsletter-scrape.ts --edition projects|labs [--dry-run]");
    process.exit(1);
  }
  return { edition, dryRun };
}

type Source = {
  active: boolean;
  name: string;
  category: string;
  url: string;
  notes: string;
};

function parseSources(md: string): Source[] {
  const rows: Source[] = [];
  const tableRegex = /^\|\s*(true|false)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|$/gm;
  let m: RegExpExecArray | null;
  while ((m = tableRegex.exec(md)) !== null) {
    rows.push({
      active: m[1] === "true",
      name: m[2].trim(),
      category: m[3].trim(),
      url: m[4].trim(),
      notes: m[5].trim(),
    });
  }
  return rows;
}

function renderDraftTemplate(edition: Edition, sources: Source[], isoDate: string): string {
  const { name } = EDITION_PATHS[edition];
  const active = sources.filter((s) => s.active);
  const lines: string[] = [];
  lines.push(`# ${name} — ${isoDate} Draft`);
  lines.push("");
  lines.push("**Status:** Shortlist (unscored — scraper not yet implemented)");
  lines.push(`**Edition:** ${edition}`);
  lines.push(`**Sources polled:** ${active.length} active / ${sources.length} total`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Raw candidates");
  lines.push("");
  lines.push("Run the real scraper here to populate. For now, manual entry per source:");
  lines.push("");
  for (const s of active) {
    lines.push(`### ${s.name} (${s.category})`);
    lines.push(`- Source: ${s.url}`);
    lines.push(`- [ ] Headline: `);
    lines.push(`  - URL: `);
    lines.push(`  - Scores: Op=? Vert=? Impact=? Action=? (Total: ?/12)`);
    lines.push(`  - Decision: `);
    lines.push("");
  }
  lines.push("---");
  lines.push("");
  lines.push("## Final picks (8–12 from above)");
  lines.push("");
  lines.push("Paste from raw candidates once scored. Send with `studio newsletter send --edition " + edition + " --draft " + isoDate + ".md`.");
  lines.push("");
  return lines.join("\n");
}

function main() {
  const { edition, dryRun } = parseArgs(process.argv.slice(2));
  if (!edition) return;

  const { sources: sourcesPath, drafts: draftsDir } = EDITION_PATHS[edition];
  const md = readFileSync(sourcesPath, "utf8");
  const sources = parseSources(md);

  const isoDate = new Date().toISOString().slice(0, 10);
  const draftPath = join(draftsDir, `${isoDate}.md`);
  const template = renderDraftTemplate(edition, sources, isoDate);

  if (dryRun) {
    console.log(`[dry-run] ${edition}: parsed ${sources.length} sources (${sources.filter((s) => s.active).length} active)`);
    console.log(`[dry-run] would write: ${draftPath}`);
    console.log("---");
    console.log(template);
    return;
  }

  if (!existsSync(draftsDir)) mkdirSync(draftsDir, { recursive: true });
  writeFileSync(draftPath, template, "utf8");
  console.log(`wrote: ${draftPath}`);
  console.log(`sources: ${sources.length} total, ${sources.filter((s) => s.active).length} active`);
}

main();
