# Architecture

A Node.js generator produces committed static HTML, CSS and JavaScript for GitHub
Pages. There is no production application server. The [decision record](ARCHITECTURE-PROPOSAL.md)
explains this choice; [Contributing](CONTRIBUTING.md) owns commands and release checks.

## Maintained sources and generated output

[`scripts/build.mjs`](../scripts/build.mjs) validates inputs and writes these outputs:

| Source | Responsibility / output |
| --- | --- |
| `content/policies.json` | `PIL` categories, `WHO` filters, `PL` policies → initial HTML and `assets/js/policies.js` |
| `content/sources.json`, `src/sources.mjs` | Source validation and citations → HTML registry and `POLICY_CITATIONS` |
| `content/site.json`, `src/pages.mjs` | Shared metadata, policy rendering and JSON-LD → homepage and six `policies/<key>.html` pages, robots and sitemap URLs |
| `content/video.json`, `src/video.mjs` | Local clip metadata and timed text → HTML transcript and `assets/videos/courage-for-hometown.zh-Hant.vtt` |
| `content/publishing.json` | Exhaustive public-file inventory and excluded paths → `_config.yml` |
| `src/index.template.html` | Homepage markup and build tokens → `index.html` |
| `src/site.css` | Shared styles → `assets/site.css` |
| `src/app.js` | Core interactions → `assets/js/app.js` |
| `src/optional.js` | Optional interactions → `assets/js/optional.js` |
| `src/calculator.mjs` | Rates, provenance, limits and pure calculation → `assets/js/calculator.js`, rate tokens and initial total |
| `src/html.mjs` | HTML escaping shared by build-time renderers |

Generation performs no network fetch and does not advance review dates. Generated
files are committed with their sources; public media is maintained directly.

### Public media layout

| Directory | Contents |
| --- | --- |
| `assets/images/portraits/` | Hero, alternate photos and image-export cutout |
| `assets/images/social/` | Social-preview artwork |
| `assets/videos/` | Local video, matching `-poster.jpg` and generated subtitles |

Use descriptive filenames; [Content](CONTENT.md#media-and-permissions) owns media
replacement and provenance. Root-level `assets/images/site-icon.svg` and its PNG
export supply the shared site icon.

### Repository root

The root holds public entry/discovery files and standard contributor/package
entry points. Sources, media, tooling, tests and docs live in their named
directories; browser configuration is `tests/playwright.config.mjs`. Working files
follow the [temporary-file policy](CONTRIBUTING.md#temporary-files-and-repository-hygiene).

## Readable content and enhancement

Initial HTML contains all 23 policies, details and citations under unique
`policy-<id>` anchors and six `six-<category>` targets. It remains readable without
JavaScript. Category pages use ordinary links, contain their own policies and
sources, and require no browser scripts. Homepage sharing retains `#six-*` links.

Interactive cards reuse the generated data without duplicating overview IDs.
Defaults are `intl` and `parent`. “全選身分” selects the four exposed filters,
matching 19 policies; the complete overview contains 23. `retainedWho` explains
the unexposed `shop`, `clean` and `safe` keys. Validation rejects unknown keys and
overlap with exposed filters. Citation rendering is shared across views;
[Content](CONTENT.md#policies-and-citations) owns source and review semantics.

## Runtime boundaries

Scripts load in order: generated data, calculator, core, optional. Core owns
categories, details, filters, comparison, calculator, link/text sharing, theme,
large text, countdown and deep links. Optional code owns photos, decorative
letters, stamps, sound, cat, canvas export and game.

Core calls optional hooks through exception guards. Optional features share a
private scope and guarded initializers; animation failures clean up decorations,
and unavailable Canvas produces a visible message. The initial category stamp
replays after optional initialization. These guards cover tested failure paths,
not every possible asynchronous exception.

The native image dialog contains focus and restores its opener; generation keeps
the newest asynchronous result and rejected native sharing retains download.
Game keyboard input stays on its button. Calculator updates cancel obsolete
animation frames and announce settled totals. `calculateBenefits(counts, months)`
rejects invalid inputs and returns birth, nutrition, annual, total and rise values.

## State and external resources

Selection updates `aria-pressed` on existing buttons to preserve keyboard focus.
Filter/category/calculator state stays in memory; large text uses guarded
localStorage. The countdown uses Taiwan calendar days and refreshes at midnight,
page restoration and visible-tab restoration. Election copy and archival behavior
are maintained in [Content](CONTENT.md#election-copy-sharing-and-dates).

Fonts and Facebook players are external. Local video provides controls, a poster,
optional WebVTT subtitles, a no-JavaScript transcript and a direct source link.
Photos load on selection; [Performance](PERFORMANCE.md) owns measurement rationale.
There is no visitor analytics loader; see the [analytics decision](ANALYTICS.md).

## Publishing and crawlers

The build classifies tracked files as public, excluded or generated `_config.yml`,
rejecting unknown paths. Legacy Jekyll applies the exclusions and `theme: null`
prevents a default Pages theme from adding assets. No `.nojekyll` or Pages setting
change is needed. Repository-root Python serving does not apply these exclusions;
CI builds with the official Pages Jekyll action and checks inventory plus HTTP
responses without deploying.

Robots allows crawling; the sitemap lists the clean homepage and six canonical
category URLs. Explicit `.html` paths work without rewrites. Unknown paths and
retired `preview-a.html`, `preview-b.html`, `preview-c.html` return 404 after
publication. Canonical metadata is not an HTTP redirect. Minimal WebSite/WebPage
JSON-LD uses stable absolute IDs without unverified relationships or review dates.
[Crawlability](CRAWLABILITY.md) owns HTTP checks and crawler policy.
