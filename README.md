# OneFiveTwo

Ten hand-tuned VS Code themes built from a single token palette (`palette.json`) and checked against WCAG contrast (4.5:1 for code, 3:1 for UI accents). Anime, cartoon and TV-inspired color palettes.

## Themes

| Theme                                    | Mode  | Inspired by                                         | Feel                                                                                          |
| ---------------------------------------- | ----- | --------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **OneFiveTwo Void Dark**                 | Dark  | Gojo's Domain Expansion (Jujutsu Kaisen)            | Near-black cosmic void, Six Eyes blue accent, Hollow Purple keywords, reversal-red errors     |
| **OneFiveTwo Shrine Light**              | Light | Sukuna's Domain Expansion (Jujutsu Kaisen)          | Bone-ivory background, blood-crimson accent, ink-black text, aged-gold and shrine-jade syntax |
| **OneFiveTwo Dark Heavenly Restriction** | Dark  | Toji / Maki's Heavenly Restriction (Jujutsu Kaisen) | Neutral charcoal with no glow, bone-white text, jade accent, blood-red keywords               |
| **OneFiveTwo Light Stone Skin**          | Light | Literal "stone skin"                                | Warm granite-grey background, slate-blue accent, clay-brown keywords, earthy syntax           |
| **OneFiveTwo Dark Shadow Clone**         | Dark  | Shadow Clone Jutsu (Naruto)                         | Warm ash-black background, orange accent, chakra-blue secondary, smoke-white text             |
| **OneFiveTwo Dark The Omnitrix**         | Dark  | The Omnitrix (Ben 10)                               | Black-green base, hourglass-green accent, red recharge/timeout secondary                      |
| **OneFiveTwo Dark Scarlet Witch**        | Dark  | Scarlet Witch (Marvel)                              | Blood-black base, chaos-magic crimson accent, gold secondary                                  |
| **OneFiveTwo Dark Vecna 11**             | Dark  | Vecna and Eleven (Stranger Things)                  | Upside-Down blue-black base, vine-red accent, cold teal secondary, Eleven-pink strings        |
| **OneFiveTwo Dark Caribbean Pirates**    | Dark  | Pirates of the Caribbean                            | Deep-sea black-teal base, treasure-gold accent, ocean-teal secondary, parchment text          |
| **OneFiveTwo Dark Conqueror's Haki**     | Dark  | Conqueror's Haki (One Piece)                        | Near-black violet base, red lightning accent, electric-indigo secondary                       |

## Key colors

| Theme                     | Editor bg | Accent    | Secondary accent |
| ------------------------- | --------- | --------- | ---------------- |
| Void Dark                 | `#04050d` | `#5cc8ff` | `#a66bff`        |
| Shrine Light              | `#faf3ea` | `#c2271f` | `#d9480f`        |
| Dark Heavenly Restriction | `#0a0a0b` | `#6fbf8f` | `#d64545`        |
| Light Stone Skin          | `#efede8` | `#46607f` | `#8a5a3c`        |
| Dark Shadow Clone         | `#0e0d0c` | `#ff8a2b` | `#4ea8ff`        |
| Dark The Omnitrix         | `#070b08` | `#4dff2e` | `#ff5547`        |
| Dark Scarlet Witch        | `#12060a` | `#ff3350` | `#ffc46b`        |
| Dark Vecna 11             | `#070b12` | `#ff3b3b` | `#5fc3d6`        |
| Dark Caribbean Pirates    | `#0b1315` | `#d9a441` | `#3fb8a6`        |
| Dark Conqueror's Haki     | `#06060a` | `#ff3045` | `#9fa8ff`        |

## Auto switch with the OS theme

```jsonc
{
  "window.autoDetectColorScheme": true,
  "workbench.preferredDarkColorTheme": "OneFiveTwo Void Dark",
  "workbench.preferredLightColorTheme": "OneFiveTwo Shrine Light",
}
```

Swap in any dark or light theme name from the table above.

## Customizing

Every color comes from `palette.json`. Edit a token, then:

```bash
npm run package
```

This re-tunes any color that fails contrast, rebuilds all theme files and produces a `.vsix`.

## Install locally

```bash
code --install-extension onefivetwo-themes-0.5.0.vsix
```

Colors only: no file icon theme is bundled.

## Author

**Harsh Yadav**

- Marketplace publisher: [HarshYadav152](https://marketplace.visualstudio.com/publishers/HarshYadav152)
- GitHub: [@HarshYadav152](https://github.com/HarshYadav152)
- Issues and suggestions: [github.com/HarshYadav152/onefivetwo-themes/issues](https://github.com/HarshYadav152/onefivetwo-theme/issues)

> Build with Sonnet 5.5 medium (for code quality and reproducement)

Released under the MIT License.

_Fan-made color inspiration. Not affiliated with or endorsed by the creators of Jujutsu Kaisen, Naruto, Ben 10, Marvel, Stranger Things, One Piece or Pirates of the Caribbean._
