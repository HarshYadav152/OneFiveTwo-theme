# OneFiveTwo

Two hand-tuned VS Code themes built from a single token palette (`palette.json`) and checked against WCAG contrast (4.5:1 for code, 3:1 for UI accents).

| Theme | Inspired by | Feel |
|---|---|---|
| **OneFiveTwo Void Dark** | Gojo's Domain Expansion | Near-black cosmic void, Six Eyes blue accent, Hollow Purple keywords, reversal-red errors |
| **OneFiveTwo Shrine Light** | Sukuna's Domain Expansion | Bone-ivory background, blood-crimson accent, ink-black text, aged-gold and shrine-jade syntax |

## Void Dark

| Role | Color |
|---|---|
| Editor background | `#04050d` |
| Accent (cursor, active tab, focus) | `#5cc8ff` |
| Secondary accent | `#a66bff` |
| Keyword | `#b388ff` |
| Function | `#7cd4ff` |
| String | `#6ee7d0` |
| Error / deleted | `#ff5c7a` |

## Shrine Light

| Role | Color |
|---|---|
| Editor background | `#faf3ea` |
| Accent (cursor, active tab, focus) | `#c2271f` |
| Secondary accent | `#d9480f` |
| Keyword | `#b3201a` |
| Function | `#8a4b00` |
| String | `#2f6f4a` |
| Error / deleted | `#9f1239` |

## Auto switch with the OS theme

```jsonc
{
  "window.autoDetectColorScheme": true,
  "workbench.preferredDarkColorTheme": "OneFiveTwo Void Dark",
  "workbench.preferredLightColorTheme": "OneFiveTwo Shrine Light"
}
```

## Customizing

Every color comes from `palette.json`. Edit a token, then:

```bash
npm run package
```

This re-tunes any color that fails contrast, rebuilds both theme files and produces a `.vsix`.

## Install locally

```bash
code --install-extension onefivetwo-themes-0.1.0.vsix
```

Colors only: no file icon theme is bundled.

_Fan-made color inspiration. Not affiliated with or endorsed by the creators of Jujutsu Kaisen._
