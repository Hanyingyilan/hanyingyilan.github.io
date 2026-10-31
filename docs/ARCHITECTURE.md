# Architecture

Historical baseline: `4259eda6c524b90da846c3acb0ab957642ddd427`, inspected 2026-11-01.
The dated [audit](SEO-AUDIT.md) describes that baseline. This document describes
current local source; deployment still requires maintainer review.

## Static generation

Node.js 22.22+ (22.x) or 24.8+ runs `scripts/build.mjs`. `content/policies.json` maintains `PIL`
(category metadata), `WHO` (four exposed filter controls), and all 23 `PL` records.
`src/index.template.html`, `src/site.css`, `src/app.js`, and `src/optional.js` are
maintained sources. `npm run build` writes committed `index.html` and `assets/`;
`npm run check` rejects stale output. Production needs only a static server.

The complete overview has all titles, details and source references in initial
HTML, with unique `policy-<id>` anchors and native `six-<category>` anchors. It
remains visible with JavaScript disabled or failed. A single text H1 names 韓瑩.
The existing category panel and persona cards enhance this overview using the
same generated policy data. They intentionally repeat selected policies without
reusing the overview's IDs. The default category is `intl`, default filter `parent`.
“All” selects the four exposed filters, matching 19 records, not all 23.
`shop`, `clean`, and `safe` remain unexposed legacy filter keys (#14).

## Runtime boundaries

Scripts load in order: generated policy data, core `app.js`, optional `optional.js`.
Core owns categories, details, filters, comparison, calculator, sharing, theme,
large text and deep links. Optional code owns portrait effects, decorative letters,
stamps, audio, roaming cat, canvas exporter and game. Core initializes before
optional code and calls optional hooks with guards. A missing optional script or
Canvas failure cannot prevent the core overview or category/filter controls.
Unavailable Canvas actions show a visible status message. Initial category
fragments replay the stamp after optional initialization.
Optional features are not comprehensively fault-isolated from one another; that
and existing modal/game accessibility work remain in #13.

Filter/category/calculator state stays in memory. Large text uses localStorage
with exceptions handled. Category shares retain `#six-*`; no political preference
or calculator-input telemetry is added. Fonts and Facebook players are external;
local video has native controls, poster, and direct player fallback links.

The countdown uses 2026-11-28 Taipei midnight and updates on load. Photo prefetch,
11 Facebook players and optional animation costs remain subjects for later work.
`preview-a.html`, `preview-b.html`, and `preview-c.html` preserve `noindex`, redirect
to the homepage and retain fallback links.

## Validation

Native Node tests validate content identities, categories, DOM IDs, local resource
references, fragment targets, generated freshness and script syntax. Pinned development-only HTML-validate checks nesting/closing
syntax for all four public HTML pages; source classes are limited to existing
`edm` and `news` values (not a factual source registry). Chromium
smoke checks verify enhanced behavior and readable content with JavaScript/core/
optional code unavailable. See [CONTRIBUTING](CONTRIBUTING.md) for commands and
remaining live/owner checks. These tests are not indexing or policy verification.

## Publishing and crawlers

`content/site.json` owns the production root. `content/publishing.json` explicitly
lists every public file, including JS-only portrait alternatives and canvas assets.
The build checks every tracked file against public paths or excluded contributor
paths and rejects unknown files. Generated `_config.yml` excludes contributor
sources, docs, tooling and test outputs from the legacy Jekyll Pages build. No
Pages setting is changed and no `.nojekyll` is added. Robots allows crawling;
`sitemap.xml` lists only the clean homepage. Preview `noindex` remains crawlable.
Local Python serving does not apply Jekyll exclusions. Maintainers must verify the
actual Pages build output after deployment; local config tests are not that proof.

## Calculator

`src/calculator.mjs` exports frozen proposal rates, provenance, defaults and limits,
and pure `calculateBenefits(counts, months)` returning birth, nutrition, annual,
total and rise. Generation emits a browser script from the same source, resolves
rate tokens in labels/policy copy, and checks the output. The arithmetic combines
one-time birth support, selected months of nutrition and one annual elder payment;
it is not a recurring entitlement. Zero/default/max totals remain 0/95,200/723,200.
Core rendering cancels its previous animation frame on each update and announces
only settled totals through a dedicated live status region. No requests carry the
family inputs. See [CONTENT](CONTENT.md) for the proposal/current-program distinction.
