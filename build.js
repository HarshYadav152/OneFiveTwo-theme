// build.js — generates themes/*.json from palette.json (single source of truth)
// Flow: primitives (palette.json) -> semantic roles -> VS Code keys.
// Usage: node build.js

const fs = require("fs");
const path = require("path");

const palette = JSON.parse(
  fs.readFileSync(path.join(__dirname, "palette.json"), "utf8"),
);

// append alpha (0-1) to a #rrggbb color
const alpha = (hex, a) =>
  hex +
  Math.round(a * 255)
    .toString(16)
    .padStart(2, "0");

// blend hex `b` over `a` by t (0-1) -> opaque hex
const mix = (a, b, t) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return (
    "#" +
    pa
      .map((v, i) =>
        Math.round(v + (pb[i] - v) * t)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
};

function buildTheme(name, p) {
  const { bg, border, text, accent, selection, semantic, syntax, git, ansi } =
    p;
  const isDark = p.type === "dark";

  const colors = {
    // ---------- Base ----------
    focusBorder: alpha(accent.primary, 0.6),
    foreground: text.secondary,
    descriptionForeground: text.muted,
    errorForeground: semantic.error,
    "widget.shadow": alpha("#000000", isDark ? 0.6 : 0.12),
    "selection.background": alpha(accent.primary, 0.35),
    "icon.foreground": text.secondary,
    "sash.hoverBorder": accent.primary,

    // ---------- Text links ----------
    "textLink.foreground": semantic.info,
    "textLink.activeForeground": accent.primary,
    "textCodeBlock.background": bg.raised,
    "textBlockQuote.background": bg.raised,
    "textBlockQuote.border": border.strong,
    "textPreformat.foreground": syntax.string,
    "textSeparator.foreground": border.default,

    // ---------- Buttons ----------
    "button.background": accent.primary,
    "button.foreground": text.onAccent,
    "button.hoverBackground": accent.secondary,
    "button.secondaryBackground": bg.active,
    "button.secondaryForeground": text.primary,
    "button.secondaryHoverBackground": bg.hover,

    // ---------- Inputs / dropdowns ----------
    "input.background": bg.raised,
    "input.foreground": text.primary,
    "input.border": border.default,
    "input.placeholderForeground": text.faint,
    "inputOption.activeBackground": alpha(accent.primary, 0.25),
    "inputOption.activeBorder": accent.primary,
    "inputValidation.errorBorder": semantic.error,
    "inputValidation.warningBorder": semantic.warning,
    "inputValidation.infoBorder": semantic.info,
    "dropdown.background": bg.overlay,
    "dropdown.foreground": text.primary,
    "dropdown.border": border.default,

    // ---------- Badges / progress / scrollbar ----------
    "badge.background": accent.primary,
    "badge.foreground": text.onAccent,
    "progressBar.background": accent.primary,
    "scrollbar.shadow": "#00000000",
    "scrollbarSlider.background": alpha(text.faint, 0.3),
    "scrollbarSlider.hoverBackground": alpha(text.faint, 0.5),
    "scrollbarSlider.activeBackground": alpha(text.faint, 0.7),

    // ---------- Lists / trees ----------
    "list.hoverBackground": bg.hover,
    "list.hoverForeground": text.primary,
    "list.activeSelectionBackground": bg.active,
    "list.activeSelectionForeground": text.primary,
    "list.inactiveSelectionBackground": bg.hover,
    "list.inactiveSelectionForeground": text.primary,
    "list.focusBackground": bg.active,
    "list.highlightForeground": accent.primary,
    "list.errorForeground": semantic.error,
    "list.warningForeground": semantic.warning,
    "list.dropBackground": alpha(accent.primary, 0.15),
    "tree.indentGuidesStroke": border.default,

    // ---------- Activity bar ----------
    "activityBar.background": bg.sunken,
    "activityBar.foreground": accent.primary,
    "activityBar.inactiveForeground": text.faint,
    "activityBar.border": border.subtle,
    "activityBar.activeBorder": accent.primary,
    "activityBarBadge.background": accent.primary,
    "activityBarBadge.foreground": text.onAccent,

    // ---------- Side bar ----------
    "sideBar.background": bg.raised,
    "sideBar.foreground": text.secondary,
    "sideBar.border": border.subtle,
    "sideBarTitle.foreground": text.primary,
    "sideBarSectionHeader.background": bg.sunken,
    "sideBarSectionHeader.foreground": text.secondary,
    "sideBarSectionHeader.border": border.subtle,

    // ---------- Title bar / menu ----------
    "titleBar.activeBackground": bg.sunken,
    "titleBar.activeForeground": text.secondary,
    "titleBar.inactiveBackground": bg.sunken,
    "titleBar.inactiveForeground": text.faint,
    "titleBar.border": border.subtle,
    "menu.background": bg.overlay,
    "menu.foreground": text.primary,
    "menu.selectionBackground": bg.active,
    "menu.selectionForeground": text.primary,
    "menu.separatorBackground": border.default,
    "menubar.selectionBackground": bg.hover,

    // ---------- Status bar ----------
    "statusBar.background": bg.sunken,
    "statusBar.foreground": text.secondary,
    "statusBar.border": border.subtle,
    "statusBar.noFolderBackground": bg.sunken,
    "statusBar.debuggingBackground": accent.secondary,
    "statusBar.debuggingForeground": text.onAccent,
    "statusBarItem.hoverBackground": bg.hover,
    "statusBarItem.remoteBackground": accent.primary,
    "statusBarItem.remoteForeground": text.onAccent,
    "statusBarItem.prominentBackground": bg.active,

    // ---------- Tabs ----------
    "editorGroupHeader.tabsBackground": bg.sunken,
    "editorGroupHeader.tabsBorder": border.subtle,
    "editorGroup.border": border.subtle,
    "tab.activeBackground": mix(bg.base, accent.primary, 0.09),
    "tab.activeForeground": text.primary,
    "tab.activeBorderTop": accent.primary,
    "tab.activeBorder": accent.primary,
    "tab.unfocusedActiveBorder": alpha(accent.primary, 0.5),
    "tab.unfocusedActiveBorderTop": alpha(accent.primary, 0.5),
    "tab.inactiveBackground": bg.sunken,
    "tab.inactiveForeground": text.muted,
    "tab.hoverBackground": bg.hover,
    "tab.hoverForeground": text.primary,
    "tab.hoverBorder": alpha(accent.primary, 0.6),
    "tab.unfocusedHoverBackground": bg.hover,
    "toolbar.hoverBackground": bg.hover,
    "toolbar.activeBackground": bg.active,
    "toolbar.hoverOutline": "#00000000",
    "tab.border": border.subtle,
    "tab.unfocusedActiveForeground": text.secondary,
    "tab.unfocusedInactiveForeground": text.faint,
    "tab.lastPinnedBorder": border.strong,

    // ---------- Editor ----------
    "editor.background": bg.base,
    "editor.foreground": text.primary,
    "editorLineNumber.foreground": text.faint,
    "editorLineNumber.activeForeground": accent.primary,
    "editor.lineHighlightBackground": bg.hover,
    "editor.lineHighlightBorder": "#00000000",
    "editorCursor.foreground": accent.primary,
    "editor.selectionBackground": selection.base,
    "editor.inactiveSelectionBackground": selection.soft,
    "editor.selectionHighlightBackground": selection.soft,
    "editor.wordHighlightBackground": selection.soft,
    "editor.wordHighlightStrongBackground": alpha(accent.primary, 0.2),
    "editor.findMatchBackground": alpha(accent.primary, 0.4),
    "editor.findMatchHighlightBackground": alpha(accent.primary, 0.2),
    "editor.findRangeHighlightBackground": selection.soft,
    "editor.hoverHighlightBackground": selection.soft,
    "editor.rangeHighlightBackground": alpha(accent.primary, 0.08),
    "editor.foldBackground": alpha(selection.soft, 0.5),
    "editorWhitespace.foreground": border.default,
    "editorRuler.foreground": border.default,
    "editorLink.activeForeground": semantic.info,
    "editorIndentGuide.background1": border.subtle,
    "editorIndentGuide.activeBackground1": border.strong,
    "editorBracketMatch.background": alpha(accent.primary, 0.15),
    "editorBracketMatch.border": accent.primary,
    "editorBracketHighlight.foreground1": accent.primary,
    "editorBracketHighlight.foreground2": semantic.info,
    "editorBracketHighlight.foreground3": syntax.number,
    "editorBracketHighlight.foreground4": semantic.success,
    "editorBracketHighlight.foreground5": syntax.keyword,
    "editorBracketHighlight.foreground6": semantic.hint,
    "editorBracketHighlight.unexpectedBracket.foreground": semantic.error,
    "editorGutter.background": bg.base,
    "editorGutter.addedBackground": git.added,
    "editorGutter.modifiedBackground": git.modified,
    "editorGutter.deletedBackground": git.deleted,
    "editorOverviewRuler.border": "#00000000",
    "editorOverviewRuler.errorForeground": semantic.error,
    "editorOverviewRuler.warningForeground": semantic.warning,
    "editorOverviewRuler.infoForeground": semantic.info,

    // ---------- Diagnostics (squiggles, Error Lens friendly) ----------
    "editorError.foreground": semantic.error,
    "editorWarning.foreground": semantic.warning,
    "editorInfo.foreground": semantic.info,
    "editorHint.foreground": semantic.hint,
    "problemsErrorIcon.foreground": semantic.error,
    "problemsWarningIcon.foreground": semantic.warning,
    "problemsInfoIcon.foreground": semantic.info,

    // ---------- Widgets (suggest, hover, find) ----------
    "editorWidget.background": bg.overlay,
    "editorWidget.foreground": text.primary,
    "editorWidget.border": border.default,
    "editorSuggestWidget.background": bg.overlay,
    "editorSuggestWidget.border": border.default,
    "editorSuggestWidget.foreground": text.secondary,
    "editorSuggestWidget.selectedBackground": bg.active,
    "editorSuggestWidget.highlightForeground": accent.primary,
    "editorHoverWidget.background": bg.overlay,
    "editorHoverWidget.border": border.default,
    "peekView.border": accent.primary,
    "peekViewEditor.background": bg.raised,
    "peekViewResult.background": bg.overlay,
    "peekViewTitle.background": bg.overlay,
    "peekViewResult.selectionBackground": bg.active,
    "peekViewEditor.matchHighlightBackground": alpha(accent.primary, 0.3),
    "quickInput.background": bg.overlay,
    "quickInput.foreground": text.primary,
    "quickInputList.focusBackground": bg.active,
    "pickerGroup.foreground": accent.primary,
    "pickerGroup.border": border.default,
    "notifications.background": bg.overlay,
    "notifications.foreground": text.primary,
    "notifications.border": border.default,
    "notificationCenterHeader.background": bg.raised,
    "notificationLink.foreground": semantic.info,

    // ---------- Panel / terminal ----------
    "panel.background": bg.base,
    "panel.border": border.subtle,
    "panelTitle.activeForeground": text.primary,
    "panelTitle.activeBorder": accent.primary,
    "panelTitle.inactiveForeground": text.muted,
    "panelSectionHeader.background": bg.raised,
    "terminal.background": bg.base,
    "terminal.foreground": text.primary,
    "terminal.selectionBackground": selection.base,
    "terminalCursor.foreground": accent.primary,
    "terminal.ansiBlack": ansi.black,
    "terminal.ansiRed": ansi.red,
    "terminal.ansiGreen": ansi.green,
    "terminal.ansiYellow": ansi.yellow,
    "terminal.ansiBlue": ansi.blue,
    "terminal.ansiMagenta": ansi.magenta,
    "terminal.ansiCyan": ansi.cyan,
    "terminal.ansiWhite": ansi.white,
    "terminal.ansiBrightBlack": ansi.brightBlack,
    "terminal.ansiBrightRed": ansi.brightRed,
    "terminal.ansiBrightGreen": ansi.brightGreen,
    "terminal.ansiBrightYellow": ansi.brightYellow,
    "terminal.ansiBrightBlue": ansi.brightBlue,
    "terminal.ansiBrightMagenta": ansi.brightMagenta,
    "terminal.ansiBrightCyan": ansi.brightCyan,
    "terminal.ansiBrightWhite": ansi.brightWhite,

    // ---------- Git ----------
    "gitDecoration.addedResourceForeground": git.added,
    "gitDecoration.modifiedResourceForeground": git.modified,
    "gitDecoration.untrackedResourceForeground": git.untracked,
    "gitDecoration.deletedResourceForeground": git.deleted,
    "gitDecoration.conflictingResourceForeground": git.conflict,
    "gitDecoration.renamedResourceForeground": git.renamed,
    "gitDecoration.ignoredResourceForeground": git.ignored,
    "gitDecoration.stageModifiedResourceForeground": git.modified,
    "gitDecoration.stageDeletedResourceForeground": git.deleted,
    "gitDecoration.submoduleResourceForeground": semantic.info,

    // ---------- Diff editor ----------
    "diffEditor.insertedTextBackground": alpha(git.untracked, 0.15),
    "diffEditor.removedTextBackground": alpha(git.deleted, 0.15),
    "diffEditor.insertedLineBackground": alpha(git.untracked, 0.08),
    "diffEditor.removedLineBackground": alpha(git.deleted, 0.08),

    // ---------- Merge conflicts ----------
    "merge.currentHeaderBackground": alpha(semantic.info, 0.35),
    "merge.incomingHeaderBackground": alpha(semantic.success, 0.35),
    "merge.currentContentBackground": alpha(semantic.info, 0.12),
    "merge.incomingContentBackground": alpha(semantic.success, 0.12),

    // ---------- Breadcrumbs ----------
    "breadcrumb.foreground": text.muted,
    "breadcrumb.focusForeground": text.primary,
    "breadcrumb.activeSelectionForeground": accent.primary,
    "breadcrumbPicker.background": bg.overlay,

    // ---------- Debug ----------
    "debugToolBar.background": bg.overlay,
    "debugIcon.breakpointForeground": semantic.error,
    "editor.stackFrameHighlightBackground": alpha(accent.primary, 0.18),
    "editor.focusedStackFrameHighlightBackground": alpha(accent.primary, 0.3),

    // ---------- Settings UI ----------
    "settings.headerForeground": text.primary,
    "settings.modifiedItemIndicator": accent.primary,
    "settings.checkboxBackground": bg.raised,
    "settings.checkboxBorder": border.default,
    "checkbox.background": bg.raised,
    "checkbox.border": border.default,

    // ---------- Extensions ----------
    "extensionButton.prominentBackground": accent.primary,
    "extensionButton.prominentForeground": text.onAccent,
    "extensionButton.prominentHoverBackground": accent.secondary,
    "extensionBadge.remoteBackground": accent.primary,
    "extensionBadge.remoteForeground": text.onAccent,

    // ---------- Chart / minimap ----------
    "minimap.selectionHighlight": selection.base,
    "minimap.findMatchHighlight": accent.primary,
    "minimapGutter.addedBackground": git.added,
    "minimapGutter.modifiedBackground": git.modified,
    "minimapGutter.deletedBackground": git.deleted,
  };

  const tok = (scope, foreground, fontStyle) => {
    const settings = { foreground };
    if (fontStyle) settings.fontStyle = fontStyle;
    return { scope, settings };
  };

  const tokenColors = [
    tok(["comment", "punctuation.definition.comment"], text.comment),
    tok(
      [
        "variable",
        "variable.other.readwrite",
        "meta.definition.variable variable.other.readwrite",
      ],
      syntax.variable,
    ),
    tok(
      [
        "variable.language",
        "variable.parameter.function.language.special.self",
        "variable.language.this",
      ],
      syntax.keyword,
      "italic",
    ),
    tok(["variable.parameter", "meta.parameters"], syntax.variable),
    tok(
      [
        "variable.other.property",
        "variable.other.object.property",
        "support.variable.property",
        "meta.object-literal.key",
        "meta.property-name",
      ],
      syntax.property,
    ),
    tok(["constant", "constant.language", "support.constant"], syntax.number),
    tok(["constant.numeric", "constant.character.numeric"], syntax.number),
    tok(
      [
        "keyword",
        "keyword.control",
        "keyword.other",
        "storage",
        "storage.type",
        "storage.modifier",
      ],
      syntax.keyword,
    ),
    tok(
      [
        "keyword.operator",
        "keyword.operator.assignment",
        "keyword.operator.arithmetic",
        "keyword.operator.logical",
        "keyword.operator.comparison",
        "keyword.operator.ternary",
      ],
      syntax.operator,
    ),
    tok(
      [
        "punctuation",
        "meta.brace",
        "punctuation.separator",
        "punctuation.terminator",
      ],
      syntax.operator,
    ),
    tok(
      [
        "punctuation.definition.string",
        "string",
        "string.quoted",
        "string.template",
      ],
      syntax.string,
    ),
    tok(
      [
        "punctuation.definition.template-expression",
        "punctuation.section.embedded",
      ],
      syntax.keyword,
    ),
    tok(
      [
        "constant.character.escape",
        "string.regexp",
        "constant.other.character-class.regexp",
      ],
      syntax.regex,
    ),
    tok(
      [
        "entity.name.function",
        "meta.function-call entity.name.function",
        "support.function",
        "meta.function-call",
      ],
      syntax.function,
    ),
    tok(
      [
        "entity.name.type",
        "entity.name.class",
        "entity.other.inherited-class",
        "support.class",
        "support.type",
        "entity.name.namespace",
        "meta.type.annotation",
      ],
      syntax.type,
    ),
    tok(
      ["entity.name.tag", "meta.tag", "punctuation.definition.tag"],
      syntax.tag,
    ),
    tok(
      [
        "entity.other.attribute-name",
        "entity.other.attribute-name.html",
        "entity.other.attribute-name.jsx",
      ],
      syntax.attribute,
    ),
    tok(
      [
        "support.type.property-name.css",
        "support.type.vendored.property-name.css",
      ],
      syntax.property,
    ),
    tok(["support.type.property-name.json"], syntax.property),
    tok(
      [
        "entity.other.attribute-name.class.css",
        "entity.other.attribute-name.id.css",
        "entity.name.tag.css",
      ],
      syntax.type,
    ),
    tok(
      ["markup.heading", "entity.name.section.markdown"],
      syntax.keyword,
      "bold",
    ),
    tok(["markup.bold"], syntax.function, "bold"),
    tok(["markup.italic"], syntax.keyword, "italic"),
    tok(["markup.inline.raw", "markup.fenced_code.block"], syntax.string),
    tok(["markup.underline.link", "string.other.link"], semantic.info),
    tok(["markup.quote"], text.comment, "italic"),
    tok(["markup.inserted"], git.untracked),
    tok(["markup.deleted"], git.deleted),
    tok(["markup.changed"], git.modified),
    tok(["invalid", "invalid.illegal"], syntax.invalid),
    tok(["invalid.deprecated"], semantic.warning, "strikethrough"),
  ];

  return {
    $schema: "vscode://schemas/color-theme",
    name,
    type: p.type,
    semanticHighlighting: true,
    colors,
    tokenColors,
    semanticTokenColors: {
      variable: syntax.variable,
      "variable.readonly": syntax.number,
      parameter: syntax.variable,
      property: syntax.property,
      function: syntax.function,
      method: syntax.function,
      class: syntax.type,
      interface: syntax.type,
      type: syntax.type,
      enum: syntax.type,
      enumMember: syntax.number,
      namespace: syntax.type,
      keyword: syntax.keyword,
      string: syntax.string,
      number: syntax.number,
      regexp: syntax.regex,
      comment: text.comment,
    },
  };
}

const outDir = path.join(__dirname, "themes");
fs.mkdirSync(outDir, { recursive: true });

const targets = [
  ["dark", "OneFiveTwo Void Dark", "onefivetwo-void-dark-color-theme.json"],
  [
    "light",
    "OneFiveTwo Shrine Light",
    "onefivetwo-shrine-light-color-theme.json",
  ],
  [
    "restriction",
    "OneFiveTwo Dark Heavenly Restriction",
    "onefivetwo-dark-heavenly-restriction-color-theme.json",
  ],
  [
    "stone",
    "OneFiveTwo Light Stone Skin",
    "onefivetwo-light-stone-skin-color-theme.json",
  ],
  [
    "clone",
    "OneFiveTwo Dark Shadow Clone",
    "onefivetwo-dark-shadow-clone-color-theme.json",
  ],
  [
    "omnitrix",
    "OneFiveTwo Dark The Omnitrix",
    "onefivetwo-dark-the-omnitrix-color-theme.json",
  ],
  [
    "wanda",
    "OneFiveTwo Dark Scarlet Witch",
    "onefivetwo-dark-scarlet-witch-color-theme.json",
  ],
  [
    "vecna",
    "OneFiveTwo Dark Vecna 11",
    "onefivetwo-dark-vecna-11-color-theme.json",
  ],
  [
    "pirates",
    "OneFiveTwo Dark Caribbean Pirates",
    "onefivetwo-dark-caribbean-pirates-color-theme.json",
  ],
  [
    "haki",
    "OneFiveTwo Dark Conqueror's Haki",
    "onefivetwo-dark-conquerors-haki-color-theme.json",
  ],
];

for (const [key, name, file] of targets) {
  const theme = buildTheme(name, palette[key]);
  fs.writeFileSync(
    path.join(outDir, file),
    JSON.stringify(theme, null, 2) + "\n",
  );
  console.log(
    `built ${file} (${Object.keys(theme.colors).length} workbench keys)`,
  );
}
