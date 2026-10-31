# Architecture

Baseline: `4259eda6c524b90da846c3acb0ab957642ddd427`, inspected 2026-11-01.
This document describes the current implementation, not the proposed SEO design.

## Delivery model

The 21 tracked baseline files contain four HTML documents, images, and one MP4.
`index.html` is 106,857 bytes and 1,356 lines. It contains a `<style>` block, page
markup, and one inline application `<script>`. Browsers execute it after the page
markup has been parsed. There are no imports, bundled libraries, API requests to
an application backend, authentication, or database code.

GitHub Pages serves the site over HTTPS. Google Fonts supplies Noto Sans TC and
Rubik; 11 Facebook iframe players are lazy-loaded. One local video uses a poster,
native controls, `playsinline`, and `preload="none"`. Each video card also has a
direct Facebook link. LINE sharing opens an external sharing URL. Clipboard,
canvas, Web Share, Web Audio, and animation APIs are browser capabilities, not
server services.

## Page and code map

Use the identifiers below as search anchors; line numbers will move as code evolves.

| Region / symbol | Responsibility |
| --- | --- |
| `<head>` | Title, description, social metadata, language/font setup |
| `:root`, `data-theme`, `.big` | Six-category palette, themes, and large text |
| `.hero`, `#h1`, `#portraitImg`, `#days` | Intro, animated heading, photo cycling, countdown |
| `#six`, `#tiles`, `#panel` | Six-category selector and current policy panel |
| `#me`, `#pick`, `#cards` | Filter controls and matching policy cards |
| `#clean`, `STOPS`, `drawSay()` | Three cleaning-service comparisons and truck graphic |
| `#money`, `S`, `MAXV`, `calc()` | Benefit scenario controls and animated total |
| `#videos`, `#sources`, footer | Static video cards, nine source links, publisher/date |
| `PIL`, `WHO`, `PL` | Category metadata, exposed filter metadata, 23 policy records |
| `card()`, `drawCards()`, `drawPanel()` | Runtime policy HTML construction |
| `wireShare()`, `SITE_URL`, `openFromHash()` | Sharing URLs and category fragments |
| `makeCard()`, `showCard()` | 1080 × 1350 canvas image and save/share dialog |
| `drawPassport()`, `stamp()`, `SIX` | Six-category visit stamps for the current page session |
| `meow()`, `plop()`, roaming-cat IIFE | Optional sound and character animation |
| `#game`, game IIFE | Five-round canvas garbage-throwing game |

## Content model

`PIL` defines `intl`, `traffic`, `city`, `tour`, `resil`, and `welfare`. An additional
`gov` entry exists but is excluded from the selector and category deep links.
`SIX` fixes the order of the six active categories for stamps and exported images.

Each `PL` object has these fields:

| Field | Meaning |
| --- | --- |
| `id` | Stable record identifier, such as `wf-birth`; not currently a DOM anchor |
| `p` | Category key into `PIL` |
| `t` | Policy card title |
| `src` | Broad source classification such as `edm` or `news`; not a URL |
| `ref` | Human-readable attribution shown on the card |
| `body` | Detail paragraphs rendered as list items |
| `who` | Existing filter-key-to-explanation mapping |
| `go` | Optional link to `#clean` or `#money` |

`WHO` currently exposes `parent`, `elder`, `youth`, and `rider`. Some records also
contain `shop`, `clean`, and `safe`, which have no matching controls. `ct-renew`,
`ct-cl-hire`, `ct-cl-brand`, and `tour-industry` have no exposed filter match.
They remain reachable through their category panels. “全選” selects all four
exposed filters, not every policy. Cleanup is tracked in
[#14](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/14).

`BY` is constructed from policy IDs but has no subsequent use at the baseline.
`card()` also has an unused `x.plain` branch. Do not infer active functionality
from these remnants or the obsolete CSS comment mentioning a city map.

## Initialization and state

The script defines data/helpers, attaches event handlers, and creates optional
features before calling the main render functions near its end:

```text
drawPick → drawCards → drawTiles → drawPanel → drawPassport
drawSteps → setAfter(false) → moveTruck → calc
openFromHash → hashchange listener
```

The default category is `intl`; the default selected filter is `parent`.
The initial browser DOM has three category cards and eleven filtered cards,
covering thirteen distinct policy records. Card details are inserted but hidden
until expanded. Ten other policy records are not inserted into those card regions
until interaction; some related content also exists in static sections.

The raw HTML has empty heading/card/selector containers. JavaScript fills `#h1`
with decorative letter buttons; the H1 already has an accessible label. This
rendering dependency is the main subject of
[#1](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/1).

| State | Lifetime |
| --- | --- |
| Filter `sel`, category `curP`, calculator `S`/`mon` | In memory; resets on reload |
| `#six-<category>` | URL fragment; opens that category on load/hash change |
| Large text `bigtext` | Stored in localStorage with exceptions handled |
| Theme `data-theme` | Current document; initial fallback uses OS preference |
| `stamps` | In memory; legacy `han-stamps` storage is explicitly removed |
| Audio context | Lazily created after an interaction invokes sound |

The countdown uses a fixed `2026-11-28T00:00:00+08:00` instant and computes days
once on load. The photo cycle includes the base portrait and twelve alternates;
the alternates are all prefetched 1.5 seconds after `load`.

## Calculator and optional features

The current arithmetic is:

```text
birth     = babies × 20,000
nutrition = babies × months × 3,000
annual    = age65–79 × 1,200 + age80–89 × 2,000
          + age90–99 × 6,000 + age100+ × 50,000
total     = birth + nutrition + annual
```

Babies are bounded 0–4, each elder group 0–6, and months 0–24. Defaults yield
95,200; maximum controls yield 723,200. These are code behavior checks, not a
verification of benefit eligibility. The UI explains that the total combines
one-time, multi-month, and annual amounts.

`makeCard()` selects up to four matching policies, prioritizing category diversity,
draws text and the portrait cutout, and opens a generated-image dialog. Nothing is
uploaded by image generation itself. Sharing uses the device's Web Share API where
available, with save/download guidance as fallback.

The cat uses a requestAnimationFrame loop, optional synthesized audio and transient
confetti. The game runs its animation loop while open. CSS and several JS paths
respect reduced motion, but complete coverage requires a browser audit.

## Deployment boundaries and failure modes

`preview-a.html`, `preview-b.html`, and `preview-c.html` vary social metadata, include
`noindex`, and redirect to the homepage with `location.replace`; each also has a
normal fallback link. They are not production content landing pages.

All application code shares one inline script. An uncaught initialization failure
can prevent later rendering. Optional features use some API guards, but there is
no comprehensive fault isolation. Third-party fonts/players can fail independently;
source links and native HTML remain useful fallback content.

No analytics script was found in the first-party code. That does not mean the page
makes no third-party requests: Google Fonts and Facebook embeds are external
services. See [principles](PRINCIPLES.md) before adding telemetry or dependencies.
