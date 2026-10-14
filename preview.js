// preview.js — renders a mock VS Code window per theme from the built theme JSON + palette, then screenshots it.
// Usage: node preview.js  (needs playwright + chromium)
const fs = require("fs");
const path = require("path");
const palette = JSON.parse(fs.readFileSync(path.join(__dirname, "palette.json"), "utf8"));

const targets = [
  ["dark", "onefivetwo-void-dark-color-theme.json", "OneFiveTwo Void Dark"],
  ["light", "onefivetwo-shrine-light-color-theme.json", "OneFiveTwo Shrine Light"],
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// [text, role] pairs per line
// (simple explicit lines; template literal line built manually below)
const lines = [
  [["// fetch a user and render their git activity", "c"]],
  [["import", "k"], [" { ", "v"], ["useEffect", "f"], [", ", "o"], ["useState", "f"], [" } ", "v"], ["from", "k"], [" ", "v"], ["'react'", "s"], [";", "o"]],
  [],
  [["interface", "k"], [" ", "v"], ["Props", "t"], [" {", "o"]],
  [["  ", "v"], ["username", "p"], [": ", "o"], ["string", "t"], [";", "o"]],
  [["  ", "v"], ["limit", "p"], ["?: ", "o"], ["number", "t"], [";", "o"]],
  [["}", "o"]],
  [],
  [["export function", "k"], [" ", "v"], ["Activity", "f"], ["({ ", "o"], ["username", "v"], [", ", "o"], ["limit", "v"], [" = ", "o"], ["30", "n"], [" }: ", "o"], ["Props", "t"], [") {", "o"]],
  [["  ", "v"], ["const", "k"], [" [", "o"], ["items", "v"], [", ", "o"], ["setItems", "v"], ["] = ", "o"], ["useState", "f"], ["<", "o"], ["Commit", "t"], ["[]>([]);", "o"]],
  [],
  [["  ", "v"], ["useEffect", "f"], ["(() => {", "o"]],
  [["    ", "v"], ["fetch", "f"], ["(", "o"], ["`/api/", "s"], ["${", "k"], ["username", "v"], ["}", "k"], ["/commits?n=", "s"], ["${", "k"], ["limit", "v"], ["}", "k"], ["`", "s"], [")", "o"], ["SEL:.then(r => r.json())", "sel"]],
  [["      ", "v"], [".then", "f"], ["(", "o"], ["setItems", "err"], [");", "o"]],
  [["  }, [", "o"], ["username", "v"], [", ", "o"], ["limit", "v"], ["]);", "o"]],
  [],
  [["  ", "v"], ["return", "k"], [" (", "o"]],
  [["    <", "o"], ["ul", "g"], [" ", "v"], ["className", "a"], ["=", "o"], ['"feed"', "s"], [">", "o"]],
  [["      {", "o"], ["items", "v"], [".", "o"], ["map", "f"], ["(", "o"], ["c", "v"], [" => <", "o"], ["li", "g"], [" ", "v"], ["key", "a"], ["={", "o"], ["c", "v"], [".", "o"], ["sha", "p"], ["}>{", "o"], ["c", "v"], [".", "o"], ["msg", "p"], ["}</", "o"], ["li", "g"], [">)}", "o"]],
  [["    </", "o"], ["ul", "g"], [">", "o"]],
  [["  );", "o"]],
  [["}", "o"]],
  [["const", "k"], [" ", "v"], ["re", "v"], [" = ", "o"], ["/^[a-f0-9]{7}$/i", "r"], [";  ", "o"], ["// short sha", "c"]],
];

function page(key, file, title) {
  const t = JSON.parse(fs.readFileSync(path.join(__dirname, "themes", file), "utf8"));
  const c = t.colors, s = palette[key].syntax, sem = palette[key].semantic, a = palette[key].ansi;
  const col = { k: s.keyword, s: s.string, f: s.function, n: s.number, t: s.type, p: s.property, g: s.tag, a: s.attribute, o: s.operator, r: s.regex, v: s.variable, c: palette[key].text.comment, err: s.variable };

  const code_html = lines.map((ln, i) => {
    const num = i + 1;
    const active = num === 13;
    const inner = ln.map(([txt, role]) => {
      if (txt.startsWith("SEL:")) return `<span style="background:${c["editor.selectionBackground"]}">${esc(txt.slice(4))}</span>`;
      if (role === "err") return `<span style="color:${col.v};text-decoration:underline wavy ${sem.error};text-underline-offset:3px">${esc(txt)}</span>`;
      return `<span style="color:${col[role]}">${esc(txt)}</span>`;
    }).join("");
    const gutter = { 9: c["editorGutter.modifiedBackground"], 10: c["editorGutter.addedBackground"], 14: c["editorGutter.modifiedBackground"] }[num];
    return `<div class="ln${active ? " act" : ""}"><span class="g" style="background:${gutter || "transparent"}"></span><span class="n" style="color:${active ? c["editorLineNumber.activeForeground"] : c["editorLineNumber.foreground"]}">${num}</span><span class="t">${inner}${active ? `<span class="cur"></span>` : ""}</span></div>`;
  }).join("");

  const g = palette[key].git;
  const tree = [
    ["▾ src", null, 0], ["▾ components", null, 1], ["Activity.tsx", g.modified, 2, "M"], ["Feed.tsx", g.untracked, 2, "U"],
    ["Header.tsx", g.added, 2, "A"], ["Legacy.tsx", g.deleted, 2, "D"], ["Theme.tsx", g.renamed, 2, "R"], ["Merge.tsx", g.conflict, 2, "!"],
    ["index.ts", null, 1], ["▸ node_modules", g.ignored, 0], [".env", g.ignored, 0], ["package.json", null, 0],
  ].map(([n, colr, d, b]) => `<div class="row${n === "Activity.tsx" ? " sel" : ""}" style="padding-left:${12 + d * 14}px;color:${colr || c["sideBar.foreground"]}"><span>${n}</span><span class="b">${b || ""}</span></div>`).join("");

  const ansiRow = (names) => names.map((n) => `<span style="color:${a[n]}">██ ${n.replace("bright", "b.")}</span>`).join("  ");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;width:1280px;height:820px;font:13px 'JetBrains Mono','DejaVu Sans Mono',monospace;background:${c["editor.background"]};color:${c["editor.foreground"]};display:flex;flex-direction:column;overflow:hidden}
.title{height:30px;background:${c["titleBar.activeBackground"]};color:${c["titleBar.activeForeground"]};display:flex;align-items:center;justify-content:center;border-bottom:1px solid ${c["titleBar.border"]};font-size:12px}
.main{flex:1;display:flex;min-height:0}
.act{background:${c["editor.lineHighlightBackground"]}}
.ab{width:48px;background:${c["activityBar.background"]};border-right:1px solid ${c["activityBar.border"]};display:flex;flex-direction:column;align-items:center;gap:20px;padding-top:14px}
.ab i{width:22px;height:22px;border-radius:5px;background:${c["activityBar.inactiveForeground"]};opacity:.7}.ab i.on{background:${c["activityBar.foreground"]};opacity:1;box-shadow:-13px 0 0 -10px ${c["activityBar.activeBorder"]}}
.sb{width:230px;background:${c["sideBar.background"]};border-right:1px solid ${c["sideBar.border"]};padding-top:8px}
.sb h6{margin:4px 12px 8px;font-size:11px;letter-spacing:.08em;color:${c["sideBarTitle.foreground"]}}
.row{display:flex;justify-content:space-between;padding:3px 12px;font-size:12.5px}.row .b{font-size:11px}.row.sel{background:${c["list.activeSelectionBackground"]}}
.ed{flex:1;display:flex;flex-direction:column;min-width:0}
.tabs{display:flex;background:${c["editorGroupHeader.tabsBackground"]};border-bottom:1px solid ${c["editorGroupHeader.tabsBorder"]}}
.tab{padding:9px 16px;font-size:12.5px;color:${c["tab.inactiveForeground"]};background:${c["tab.inactiveBackground"]};border-right:1px solid ${c["tab.border"]}}
.tab.on{background:${c["tab.activeBackground"]};color:${c["tab.activeForeground"]};box-shadow:inset 0 2px 0 ${c["tab.activeBorderTop"]},inset 0 -1px 0 ${c["tab.activeBorder"]}}
.tab.hv{background:${c["tab.hoverBackground"]};color:${c["tab.hoverForeground"]};box-shadow:inset 0 -1px 0 ${c["tab.hoverBorder"]}}
.phv{background:${c["toolbar.hoverBackground"]};color:${c["panelTitle.activeForeground"]};padding:2px 6px;margin:-2px -6px;border-radius:4px}
.bc{padding:6px 16px;font-size:11.5px;color:${c["breadcrumb.foreground"]}}
.code{flex:1;padding-top:2px;overflow:hidden}.ln{display:flex;height:22px;line-height:22px;white-space:pre}.g{width:3px;margin-right:9px}.n{width:30px;text-align:right;margin-right:18px;font-size:12px}.t{position:relative}
.cur{display:inline-block;width:2px;height:16px;background:${c["editorCursor.foreground"]};vertical-align:middle;margin-left:1px}
.panel{height:150px;background:${c["panel.background"]};border-top:1px solid ${c["panel.border"]};padding:0 16px}
.pt{display:flex;gap:18px;font-size:11.5px;padding:7px 0;color:${c["panelTitle.inactiveForeground"]}}.pt b{color:${c["panelTitle.activeForeground"]};font-weight:600;border-bottom:1px solid ${c["panelTitle.activeBorder"]};padding-bottom:5px}
.term{color:${c["terminal.foreground"]};line-height:20px;font-size:12.5px}
.status{height:24px;background:${c["statusBar.background"]};color:${c["statusBar.foreground"]};border-top:1px solid ${c["statusBar.border"]};display:flex;align-items:center;padding:0 12px;gap:18px;font-size:11.5px}
.status .rem{background:${c["statusBarItem.remoteBackground"]};color:${c["statusBarItem.remoteForeground"]};padding:4px 10px;margin-left:-12px}
.label{position:absolute;right:14px;top:8px;font-size:11px;opacity:.55}
</style></head><body>
<div class="title">${title} — Activity.tsx — Visual Studio Code</div>
<div class="main">
<div class="ab"><i class="on"></i><i></i><i></i><i></i></div>
<div class="sb"><h6>EXPLORER</h6>${tree}</div>
<div class="ed">
<div class="tabs"><div class="tab on">Activity.tsx</div><div class="tab hv">Feed.tsx</div><div class="tab">package.json</div></div>
<div class="bc">src › components › Activity.tsx › Activity</div>
<div class="code">${code_html}</div>
<div class="panel"><div class="pt"><span>PROBLEMS</span><span class="phv">OUTPUT</span><b>TERMINAL</b></div>
<div class="term"><span style="color:${a.green}">harshu@pc</span> <span style="color:${a.magenta}">~/app</span> <span style="color:${a.cyan}">(main)</span> $ git status<br>
<span style="color:${a.green}">  modified:</span>  Activity.tsx   <span style="color:${a.red}">deleted:</span> Legacy.tsx   <span style="color:${a.yellow}">untracked:</span> Feed.tsx<br>
${ansiRow(["red", "green", "yellow", "blue", "magenta", "cyan", "white"])}<br>${ansiRow(["brightRed", "brightGreen", "brightYellow", "brightBlue", "brightMagenta", "brightCyan", "brightWhite"])}</div></div>
</div></div>
<div class="status"><span class="rem">⌁ main</span><span>⊗ 1  ⚠ 0</span><span style="margin-left:auto">Ln 13, Col 42</span><span>TypeScript React</span><span>UTF-8</span></div>
</body></html>`;
}

fs.mkdirSync(path.join(__dirname, "preview"), { recursive: true });
for (const [key, file, title] of targets) fs.writeFileSync(path.join(__dirname, "preview", `${key}.html`), page(key, file, title));
console.log("wrote preview/dark.html, preview/light.html");
