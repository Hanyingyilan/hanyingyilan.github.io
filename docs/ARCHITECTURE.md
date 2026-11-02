# Architecture

This document describes the maintained source and generated static site. It does
not establish deployment. Historical design rationale is in the
[architecture decision](ARCHITECTURE-PROPOSAL.md); integration evidence lives in
pull requests and Git history.

## Maintained sources and generated output

[`scripts/build.mjs`](../scripts/build.mjs) validates inputs and writes the committed
outputs below. [CONTRIBUTING](CONTRIBUTING.md#local-work) owns tool versions and commands.

| Maintained source | Responsibility / generated output |
| --- | --- |
| `content/policies.json` | `PIL` category metadata, `WHO` filter controls, `PL` policy records → overview HTML and `assets/js/policies.js` |
| `content/sources.json`, `src/sources.mjs` | Source registry validation and shared citation rendering → HTML registry and `POLICY_CITATIONS` |
| `content/analytics.json`, `src/analytics.mjs` | Disabled-by-default, production-origin-only manual analytics loader → optional inline script |
| `content/site.json` | Production root → canonical, Open Graph, sharing configuration and crawler URLs |
| `content/publishing.json` | Explicit public-file inventory and excluded contributor paths → `_config.yml` |
| `src/index.template.html` | Page markup and build tokens → `index.html` |
| `src/site.css` | Styles → `assets/site.css` |
| `src/app.js` | Core browser behavior → `assets/js/app.js` |
| `src/optional.js` | Optional browser behavior → `assets/js/optional.js` |
| `src/calculator.mjs` | Proposal rates, provenance, limits and pure calculation → `assets/js/calculator.js`, rate tokens and initial total |

The generator also emits `robots.txt` and `sitemap.xml`. Images and local video
are maintained public files, not generated outputs.
The manifest, rather than this map, is the exhaustive public-file list.

### Public media layout

| Directory | Responsibility |
| --- | --- |
| `assets/images/portraits/` | Hero, alternate photographs and the transparent portrait used by image export |
| `assets/images/social/` | Social-preview artwork referenced by homepage metadata |
| `assets/videos/` | Local video and its matching `-poster.jpg` image |

Media filenames describe their subject or use, such as `han-ying-orange-cap.jpg`
and `courage-for-hometown.mp4`. Keep a video's poster with that video. Media is
maintained directly in these directories; it is not copied from root-level files.
See [Content](CONTENT.md#media-and-permissions) for replacement and provenance work.

### Repository root

Keep the root limited to public entry/discovery files (`index.html`, `robots.txt`,
`sitemap.xml`, `_config.yml`) and standard contributor/package entry points
(`README.md`, `AGENTS.md`, `.gitignore`, `package.json`, `package-lock.json`).
Browser-test configuration belongs in `tests/playwright.config.mjs`; sources,
media, tooling and maintained documentation belong in their named directories.
Disposable experiments and execution records follow the
[temporary-file policy](CONTRIBUTING.md#temporary-files-and-repository-hygiene).

## Readable content and enhancement

All 23 policies, details and citations appear in initial HTML under unique
`policy-<id>` anchors and six native `six-<category>` targets. A single text H1
names 韓瑩. The overview remains visible if JavaScript is disabled or fails.

Category panels and persona cards use the same generated data and intentionally
repeat selected content without duplicating overview IDs. The defaults are `intl`
and `parent`. “All” selects the four exposed filters, matching 19 records rather
than all 23. `shop`, `clean` and `safe` remain unexposed legacy keys (#14).

`src/sources.mjs` renders the same citations for static and enhanced views. Source
publication, source review and complete policy review are separate fields; missing
evidence stays visible. Generation needs no network fetch and does not refresh dates.
See [CONTENT](CONTENT.md) for editorial maintenance.

## Runtime boundaries

Scripts load in order: generated policy/configuration data, calculator, core,
then optional code. Core owns categories, details, filters, comparison, calculator
rendering, sharing controls, theme, large text and deep links. Optional code owns
portrait effects, decorative letters, stamps, audio, roaming cat, canvas export
and the game. Core calls optional hooks with guards; a missing optional script or
unavailable Canvas leaves core content and controls usable. Canvas actions show a
visible failure message. Initial category fragments replay the stamp after optional
initialization. Optional features are not comprehensively isolated from one another.

The image dialog uses native modal inertness, focus containment and opener
restoration; asynchronous image generation keeps the newest result. Game keyboard
input is scoped to its native button. The calculator cancels obsolete animation
frames and announces settled totals through a dedicated live region.

`calculateBenefits(counts, months)` returns birth, nutrition, annual, total and
rise values, rejecting invalid inputs. [CONTENT](CONTENT.md#calculator-and-numerical-assumptions)
owns scenario meaning and rate maintenance; [CONTRIBUTING](CONTRIBUTING.md#browser-smoke-checks)
owns numerical regression checks.

## State and external resources

Filter, category and cleaning-step buttons are initialized once; selection updates `aria-pressed`
in place so keyboard focus remains on the operating control while result cards
are rebuilt. Keyboard category activation also keeps the button in view. Narrow
card grids shrink to their container, including large-text mode. The scrollable cleaning illustration has a keyboard focus target.
Decorative hero letters are initial HTML; optional code attaches their animation
handlers without changing layout. Filter/category/calculator state stays in memory. Large text uses localStorage
with exceptions handled. Analytics is disabled in `content/analytics.json`; disabled or absent configuration
emits no loader. The independent optional loader only runs on the configured
production origin. [Analytics](ANALYTICS.md) owns activation gates and remaining
privacy/provider checks.

Fonts and Facebook players are external. Local video has native controls, a poster
and direct player fallback links. Alternate photos load on selection; the
[performance experiment](PERFORMANCE.md) records measured impact and remaining costs.
The countdown updates on load; election-specific maintenance is in
[CONTENT](CONTENT.md#election-copy-sharing-and-dates).

## Publishing and crawlers

The build classifies every tracked file as public, excluded or the generated
`_config.yml`, rejecting unknown paths. Legacy Jekyll excludes contributor sources,
docs, tooling and test outputs using that generated configuration. It explicitly
sets `theme: null` to prevent the Pages default theme from adding unlisted assets;
the site already supplies its own HTML and CSS. No `.nojekyll`
or Pages setting change is required. Repository-root Python serving does not apply exclusions. CI builds with the
official Pages Jekyll action and verifies the exact `_site` file set plus HTTP
responses; it does not deploy.

Robots permits crawling and the sitemap lists only the clean homepage. The old
`preview-a.html`, `preview-b.html` and `preview-c.html` LINE experiments are retired
and are not published; after deployment their URLs should return 404. Category shares retain
`#six-*`; canonical metadata is not an HTTP redirect. See
[CRAWLABILITY](CRAWLABILITY.md) for HTTP and owner checks and
[CONTRIBUTING](CONTRIBUTING.md#release-and-rollback) for publication verification.
