const http = require("http");
const fs = require("fs");
const path = require("path");
const process = require("process");
const { log } = require("console");

let args = process.argv.slice(2);

let help = () => {
  console.log("\nText file Analysis Tool");
  console.log("Usage: node file.js <file.txt> [options]\n");
  console.log("Options:");
  console.log("-h, --help  show help");
  console.log(
    "-s, --summary show file summary(Only count lines, words, characters)\n"
  );
  console.log("-d, --details show file details");
  console.log("Example");
  console.log("node file.js sample.txt -s");
  console.log("node file.js sample.txt -d");
  process.exit(0);
};
if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
  help();
}

const filePath = path.resolve(args[0]);
const details = args.includes("-d") || args.includes("--details");
const summary = args.includes("-s") || args.includes("--summary") || args.length === 1;
if (!fs.existsSync(filePath)) {
  console.error("File not found:", filePath);
  process.exit(1);
}

// Read file content
function readFile(filePath) {
  try{
    let b = fs.readFileSync(filePath, "utf-8");
    return b;
  } catch (error) {
    console.error("Error reading file:", error);
    process.exit(1);
  }

}
// Analyze file content
function countStats(buffer) {
  const content = buffer.toString("utf-8");
  const lineCount = content.split(/\r?\n/).length;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const charCount = content.length;
  const byteCount = Buffer.byteLength(content, "utf-8");
  let stats = {
    lines: lineCount,
    words: wordCount,
    characters: charCount,
    bytes: byteCount,
  };
  if(details){  
    const nonwhiteCharCount = content.replace(/\s+/g, "").length;
    const emptyLines = content.split(/\r?\n/).filter((line) => line.trim() === "")
      .length;
    stats.nonwhiteChars = nonwhiteCharCount;
    stats.emptyLines = emptyLines;
    const paragraphCount = content.split(/\n\s*\n/).filter(Boolean).length;
    stats.paragraphs = paragraphCount;
    const avgWordLength = wordCount ? (charCount / wordCount).toFixed(2) : 0;
    stats.avgWordLength = avgWordLength;
    const avgLineLength = lineCount ? (charCount / lineCount).toFixed(2) : 0;
    stats.avgLineLength = avgLineLength;
    stats.mostcommonWords = (() => {
        const words = content.split(/\s+/).filter(Boolean);
        const wordMap = new Map();
        words.forEach((word) => {
            word = word.toLowerCase();
            wordMap.set(word, (wordMap.get(word) || 0) + 1);
        });
        const mostCommon = [...wordMap.entries()].sort((a, b) => b[1] - a[1]);
        return mostCommon.slice(0, 5);
    })();
  }
  return stats;
}

const buffer = readFile(filePath);
const stats = countStats(buffer);

function formatBytes(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    let i = 0;
    while (bytes >= 1024 && i < sizes.length - 1) {
        bytes /= 1024;
        i++;
    }
    return `${bytes.toFixed(2)} ${sizes[i]}`;
}
stats.bytes = formatBytes(stats.bytes);

if (summary) {
  console.log(`File Summary for ${path.basename(filePath)}`);
  console.log(`Lines: ${stats.lines}`);
  console.log(`Words: ${stats.words}`);
  console.log(`Characters: ${stats.characters}`);
  console.log(`Bytes: ${stats.bytes}`);
}

if (details) {
  console.log(`File Details for ${path.basename(filePath)}`);
  console.log(`Non-Whitespace Characters: ${stats.nonwhiteChars}`);
  console.log(`Empty Lines: ${stats.emptyLines}`);
  console.log(`Average Word Length: ${stats.avgWordLength}`);
  console.log(`Average Line Length: ${stats.avgLineLength}`);
  console.log(`Paragraphs: ${stats.paragraphs}`);
  console.log("\nMost Common Words:");
  stats.mostcommonWords.forEach(([word, count]) => {
      console.log(` "${word}": ${count} times`);
  });
}
if (!summary && !details) {
  help();
}
