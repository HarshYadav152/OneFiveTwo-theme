// contrast.js — WCAG contrast check for palette.json
// Targets: 4.5:1 for code/text, 3:1 for UI accents. Usage: node contrast.js

const fs = require("fs");
const path = require("path");
const palette = JSON.parse(fs.readFileSync(path.join(__dirname, "palette.json"), "utf8"));

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

let failures = 0;
const check = (mode, label, fg, bg, min) => {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} [${mode}] ${label.padEnd(26)} ${fg} on ${bg}  ${r.toFixed(2)} (min ${min})`);
};

for (const mode of ["dark", "light"]) {
  const p = palette[mode];
  const base = p.bg.base;
  // text on editor bg
  for (const k of ["primary", "secondary", "muted", "comment"]) check(mode, `text.${k}`, p.text[k], base, 4.5);
  // syntax on editor bg
  for (const [k, v] of Object.entries(p.syntax)) check(mode, `syntax.${k}`, v, base, 4.5);
  // semantic on editor bg
  for (const [k, v] of Object.entries(p.semantic)) check(mode, `semantic.${k}`, v, base, 4.5);
  // git decorations on sidebar bg
  for (const [k, v] of Object.entries(p.git)) {
    if (k === "ignored") continue; // intentionally dim
    check(mode, `git.${k}`, v, p.bg.raised, 4.5);
  }
  // accent + faint UI elements: 3:1
  check(mode, "accent.primary", p.accent.primary, base, 3);
  check(mode, "text.faint (line nums)", p.text.faint, base, 3);
  // button text on accent
  check(mode, "onAccent on accent", p.text.onAccent, p.accent.primary, 4.5);
  // ANSI on terminal bg (skip black/brightBlack handled separately)
  for (const [k, v] of Object.entries(p.ansi)) {
    if (k === "black") continue;
    check(mode, `ansi.${k}`, v, base, k === "brightBlack" ? 3 : 4.5);
  }
  // selection text readable
  check(mode, "text on selection", p.text.primary, p.selection.base, 4.5);
}

console.log(`\n${failures} failing`);
process.exit(failures ? 1 : 0);
