# Project icon sources

Reviewed 5 September 2026. [Preview every icon at UI sizes](icon-preview.html).

All 14 project icons now use a square `128 × 128` SVG viewBox. The existing UI applies rounded corners. Marks have optical padding, backgrounds that work on both light and dark surfaces, and no text that depends on installed fonts. Existing project identities take precedence over portfolio illustrations.

| Project | Source reviewed | Adaptation |
| --- | --- | --- |
| Quanta | [public/favicon.svg](https://github.com/abouguri/Quanta/blob/a8b8a74/public/favicon.svg) | Original cream Q and green tile, including its source texture filter. Replaces the invented score gauge. |
| TaskFlow | [assets/branding/taskflow-mark.svg](https://github.com/abouguri/TaskFlow-AI/blob/f47fdff/assets/branding/taskflow-mark.svg) | Original blue, pink and teal list mark, padded on a light tile. |
| GEObrief | [app/icon.svg](https://github.com/abouguri/GEObrief/blob/4558f65/app/icon.svg) | Original black and emerald geometric mark, padded on a light tile. Replaces the generic globe. |
| Enterprise Task Manager | [Android foreground](https://github.com/abouguri/enterprise-task-manager/blob/d0813d6/app/src/main/res/drawable/ic_launcher_foreground.xml) and [background color](https://github.com/abouguri/enterprise-task-manager/blob/d0813d6/app/src/main/res/values/colors.xml) | Native white check path and `#1565C0` background translated into SVG. |
| Transcendence | [TranscendenceLogo.png](https://github.com/NourMellal/transcendence/blob/21e55394cb922a5a48367d65c0ece41c05d1f797/apps/web/public/assets/images/TranscendenceLogo.png) | The original left paddle is isolated through an SVG viewport, with a gold ball added for the square tile. The wide wordmark would be unreadable at 17px. Source bitmap is embedded as lossless WebP; this is a portfolio adaptation, not an upstream square logo. |
| seen | [app/icon.svg](https://github.com/abouguri/seen/blob/a11cccb/app/icon.svg) | Original fanned cards, with padding and a pale background to keep the artwork away from the rounded crop. |
| Mori | [apps/web/app/icon.svg](https://github.com/abouguri/Mori/blob/11730ca/apps/web/app/icon.svg) | Original path and brand colors, placed on a full-bleed tile. |
| TaskManager API | Local repository reviewed; no dedicated logo found | Simplified endpoint braces and three rows. Removed the tiny “409” caption. |
| Inception | [Repository tree](https://github.com/abouguri/Inception/tree/b80d8835bf587137b00ad7828f82dcb368ae5fd0) | Three bold server units. Portfolio illustration. |
| cub3D | [Repository tree](https://github.com/abouguri/cub3d/tree/ade07203de51b6d5da4d9de1c3d9c30a984c539d) | Three-face cube in the existing warm palette. Portfolio illustration. |
| BigQuery ETL | [Repository tree](https://github.com/abouguri/mysql-bigquery-etl/tree/8a6f6a0dada4df7c7a191268f3c526787c00cca5) | Database-to-table transfer with a clear arrow. Portfolio illustration, not the Google BigQuery logo. |
| IRC Server | [Repository tree](https://github.com/yabdoul/IRC_server/tree/928357bd97bda00fb9f57395ddaa6a09a63497e4) | Retained the channel hash concept, with stronger strokes and less decoration. |
| minishell | [Repository tree](https://github.com/abouguri/minishell/tree/27ab2a3e4f6e77e7b43ef9a0a053af579aafd854) | Terminal prompt and cursor, with miniature pipeline decorations removed. |
| NEO Risk Visualizer | [Repository tree](https://github.com/abouguri/neo-risk-visualizer/tree/65c0ca84ffe293c2f17aabfca4c85c618445e47c) | Planet, orbit and incoming object; removed tiny stars and impact rings. Portfolio illustration. |

Local source revision identifiers describe the checkouts inspected. Remote repository searches checked filenames containing logo, brand, favicon or icon; “no logo found” is a search result, not proof that no mark exists anywhere in a project's history.

## Maintenance

Use the project's original mark when one exists. Keep adaptations documented here. For a new illustration, use a single readable concept, avoid miniature text and fine lines, and inspect it at 72px, 26px and 17px before adding it. A rounded square should be applied once by the host UI; transparent marks need a suitable background and padding inside the SVG.

Transcendence is the only tile with an embedded bitmap. Its original pixels are preserved through lossless encoding, making it larger than the pure-vector tiles. A future upstream vector mark would be preferable to tracing or inventing a replacement.
