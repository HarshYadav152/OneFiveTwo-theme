// tune.js — nudges failing palette colors (lightness only, hue/saturation kept) until they pass contrast.
// Dark: lighten. Light: darken. Writes palette.json in place. Usage: node tune.js

const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "palette.json");
const palette = JSON.parse(fs.readFileSync(file, "utf8"));

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const lum = (hex) => {
  const [r, g, b] = toRgb(hex)
    .map((v) => v / 255)
    .map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
    );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
const rgbToHsl = ([r, g, b]) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [h, s, l];
};
const hslToHex = ([h, s, l]) => {
  const f = (n) => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// bring `hex` to at least `min` (+margin) against `bg` by moving lightness in `dir` (+1 lighten, -1 darken)
function fix(hex, bg, min, dir) {
  const target = min + 0.12;
  if (ratio(hex, bg) >= target) return hex;
  const [h, s, l] = rgbToHsl(toRgb(hex));
  let nl = l;
  for (let i = 0; i < 100 && ratio(hslToHex([h, s, nl]), bg) < target; i++)
    nl = Math.min(1, Math.max(0, nl + dir * 0.01));
  return hslToHex([h, s, nl]);
}

const report = [];
function apply(mode, group, key, bg, min) {
  const p = palette[mode];
  const dir = p.type === "dark" ? 1 : -1;
  const before = p[group][key];
  const after = fix(before, bg, min, dir);
  if (after !== before) {
    p[group][key] = after;
    report.push(`${mode}.${group}.${key}: ${before} -> ${after}`);
  }
}

for (const mode of Object.keys(palette)) {
  const p = palette[mode];
  const base = p.bg.base;
  for (const k of ["secondary", "muted", "comment"])
    apply(mode, "text", k, base, 4.5);
  for (const k of Object.keys(p.syntax)) apply(mode, "syntax", k, base, 4.5);
  for (const k of Object.keys(p.semantic))
    apply(mode, "semantic", k, base, 4.5);
  for (const k of Object.keys(p.git))
    if (k !== "ignored") apply(mode, "git", k, p.bg.raised, 4.5);
  apply(mode, "text", "faint", base, 3);
  apply(mode, "accent", "primary", base, 3);
  for (const k of Object.keys(p.ansi)) {
    if (["black", "white", "brightWhite"].includes(k)) continue;
    apply(
      mode,
      "ansi",
      k,
      base,
      k === "brightBlack" && p.type === "dark" ? 3 : 4.5,
    );
  }
}

fs.writeFileSync(file, JSON.stringify(palette, null, 2) + "\n");
console.log(report.join("\n"));
