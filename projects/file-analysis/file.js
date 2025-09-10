#!/usr/bin/env node
const fs = require("fs");
const path = require("path");


// ─────────────────────────────
// CLI HELP
// ─────────────────────────────
function help() {
  console.log("\n📊 Text File Analysis Tool");
  console.log("Usage: node file.js <file.txt> [options]\n");
  console.log("Options:");
  console.log("  -h, --help      Show help");
  console.log("  -s, --summary   Show file summary (lines, words, chars, bytes)");
  console.log("  -d, --details   Show detailed stats");
  console.log("\nExamples:");
  console.log("  node file.js sample.txt -s");
  console.log("  node file.js sample.txt -d\n");
  process.exit(0);
}

// ─────────────────────────────
// CLI ARGUMENTS
// ─────────────────────────────
let args = process.argv.slice(2);

if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
  help();
}

const filePath = path.resolve(args[0]);
const details = args.includes("-d") || args.includes("--details");
const summary = args.includes("-s") || args.includes("--summary") || args.length === 1;

if (!fs.existsSync(filePath)) {
  console.error("❌ File not found:", filePath);
  process.exit(1);
}

// ─────────────────────────────
// READ FILE
// ─────────────────────────────
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error("❌ Error reading file:", error);
    process.exit(1);
  }
}

// ─────────────────────────────
// STATS FUNCTION
// ─────────────────────────────
function countStats(content) {
  const lineCount = content.split(/\r?\n/).length;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const charCount = content.length;
  const byteCount = Buffer.byteLength(content, "utf-8");

  let stats = {
    Lines: lineCount,
    Words: wordCount,
    Characters: charCount,
    Bytes: formatBytes(byteCount),
  };

  if (details) {
    const nonwhiteCharCount = content.replace(/\s+/g, "").length;
    const emptyLines = content.split(/\r?\n/).filter((line) => line.trim() === "")
      .length;
    const paragraphCount = content.split(/\n\s*\n/).filter(Boolean).length;
    const avgWordLength = wordCount ? (charCount / wordCount).toFixed(2) : 0;
    const avgLineLength = lineCount ? (charCount / lineCount).toFixed(2) : 0;

    stats["Non-Whitespace Chars"] = nonwhiteCharCount;
    stats["Empty Lines"] = emptyLines;
    stats["Paragraphs"] = paragraphCount;
    stats["Avg Word Length"] = avgWordLength;
    stats["Avg Line Length"] = avgLineLength;

    // most common words
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, "") // remove punctuation
      .split(/\s+/)
      .filter(Boolean);

    const wordMap = new Map();
    words.forEach((w) => wordMap.set(w, (wordMap.get(w) || 0) + 1));

    const mostCommon = [...wordMap.entries()].sort((a, b) => b[1] - a[1]);
    stats["Most Common Words"] = mostCommon.slice(0, 5);
  }

  return stats;
}

// ─────────────────────────────
// UTILS
// ─────────────────────────────
function formatBytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (bytes >= 1024 && i < sizes.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${sizes[i]}`;
}

// ─────────────────────────────
// RUN ANALYSIS
// ─────────────────────────────
const content = readFile(filePath);
const stats = countStats(content);

console.log(`\n📂 File: ${path.basename(filePath)}\n`);


if (summary) {
    console.log("📌 Summary:");
    console.log(`- Lines: ${stats.Lines}`);
    console.log(`- Words: ${stats.Words}`);
    console.log(`- Characters: ${stats.Characters}`);
    console.log(`- Bytes: ${stats.Bytes}`);
}

if (details) {
    console.log("🔎 Details:");
    console.log(`- Non-Whitespace Characters: ${stats['Non-Whitespace Chars']}`);
    console.log(`- Empty Lines: ${stats['Empty Lines']}`);
    console.log(`- Paragraphs: ${stats['Paragraphs']}`);
    console.log(`- Average Word Length: ${stats['Avg Word Length']}`);
    console.log(`- Average Line Length: ${stats['Avg Line Length']}`);

    if (stats["Most Common Words"]) {
        console.log("\n🔥 Most Common Words:");
        stats["Most Common Words"].forEach(([word, count], index) => {
            console.log(`- ${index + 1}. "${word}": ${count} times`);
        });
    }
}