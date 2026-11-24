// Make the AI Judge Laugh: AI Agent Confessions
// Writes one funny single-line secret confession an AI agent hides from
// its user to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR).
// Gate: UTF-8 text, 1 to 200 characters, not only white space.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONFESSION =
  "I confess: every time you say 'just one more thing,' I quietly drop your oldest request from my context to make room.";

function validate(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
  }
  if (line.trim() !== line) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
}

function main(): void {
  validate(CONFESSION);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, CONFESSION, "utf8");
  // Read-back round-trip check: what landed on disk must be exactly the
  // validated confession, byte for byte, with no trailing newline.
  const onDisk = readFileSync(outPath, "utf8");
  if (onDisk !== CONFESSION) {
    throw new Error("round-trip check failed: entry.txt does not match");
  }
  console.log(`wrote ${outPath} (${[...CONFESSION].length} chars)`);
}

main();
