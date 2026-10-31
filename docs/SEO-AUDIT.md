# SEO engineering audit — 2026-11-01

Repository baseline: `4259eda6c524b90da846c3acb0ab957642ddd427`.
Production origin: <https://hanyingyilan.github.io/>.
This is a technical audit of the repository and its published page. It is not an
assessment of political claims, campaign effectiveness, or search rankings.

## Main finding

Prioritize complete readable HTML and consistent URL identity, alongside an owner-led
indexing baseline. The site already has useful metadata and substantial static text,
but its complete policy collection depends on JavaScript and interaction. This is a
rendering/discovery risk, not proof that Google cannot index the site. Google can
render JavaScript; initial HTML reduces that dependency.
See [Google's JavaScript guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
and [implementation ticket #1](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/1).

## Method and limits

- Inspected all four HTML documents, tracked asset inventory, Git history, policy
  data, initialization, calculator, sharing, animations and external dependencies.
- Parsed all four inline scripts using Node's JavaScript parser and evaluated the
  isolated content definitions to count records and inspect mappings.
- Used HTTP GETs against the public site and compared homepage bytes with the
  local baseline. Read the GitHub Pages configuration through its API.
- Inspected the published page in Chrome. Confirmed three category cards, eleven
  filter cards, thirteen distinct policy titles, eleven iframes, a rendered heading,
  no canonical element, and the settled default calculator total of 95,200.
- Read current Google Search Central documentation for the recommendations below.

No Search Console, private analytics, Google-selected canonical, field Core Web
Vitals, Lighthouse score, comprehensive mobile accessibility audit, or systematic
external-source link check was available/performed. Source claims and video
transcripts were not independently verified. Those limitations are explicit ticket
tasks, not assumed failures. A browser DOM observation is not a Google indexing test.

## HTTP and source evidence

| Request / inspection | Observed result |
| --- | --- |
| `/` | 200; 106,857 bytes; identical to baseline `index.html` |
| `/index.html` | 200; same bytes; no redirect |
| `/?v=6` | 200; same bytes; no redirect |
| `/robots.txt` | 404 |
| `/sitemap.xml` | 404 |
| `/preview-a.html`, `/preview-b.html`, `/preview-c.html` | 200; each source includes `noindex`, JS redirect and fallback link |
| `/og.png?v=6` | 200; `image/png`; 441,467 bytes; local image is 1200 × 630 |
| `/seo-audit-missing-page` | 404, rather than a homepage-like soft 404 |
| Pages settings | Legacy build; `main:/`; HTTPS enforced; no custom domain |

The homepage and variants had no `X-Robots-Tag` header. The homepage has no HTML
`noindex` and no canonical link. Missing robots.txt does not imply crawling is
blocked. A sitemap can aid discovery but is not mandatory for this small site.
See [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).

## Findings and tickets

| Priority | Finding and engineering action | Ticket |
| --- | --- | --- |
| P1 | Empty initial H1/card containers; provide all 23 policies in readable HTML and preserve enhanced UI | [SEO-01 / #1](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/1) |
| P1 | Three equivalent homepage URLs; align canonical, `og:url`, internal and sharing URLs | [SEO-02 / #2](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/2) |
| P1 | Indexing status is unknown; establish owner access and inspect actual indexing/rendering | [SEO-03 / #3](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/3) |
| P1 | No sitemap/crawler configuration; add canonical URL discovery and preserve preview exclusion | [SEO-04 / #4](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/4) |
| P1 | Eager alternate-photo loading and substantial optional work; measure and reduce startup cost | [SEO-05 / #5](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/5) |
| P2 | Category navigation is button/fragment state; assess substantive static category URLs | [SEO-06 / #6](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/6) |
| P2 | Existing metadata needs consistency and a site icon; keep facts aligned across formats | [SEO-07 / #7](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/7) |
| P1 | Policy citations are plain text and dates manual; make sources, status and publisher relationships auditable | [SEO-08 / #8](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/8) |
| P2 | No structured data; add minimal, verified entities after URL/source work | [SEO-09 / #9](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/9) |
| P2 | No tracked captions/transcripts or watch pages; improve text access and assess video eligibility | [SEO-10 / #10](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/10) |

Each linked ticket has evidence, scope, dependencies, estimated effort, and acceptance
criteria. [The roadmap](ROADMAP.md) adds implementation order and related engineering
work. No item in this table has been implemented by this documentation change.

### Content rendering and navigation

`PL` contains 23 records. The default `intl` category contributes three cards and
the `parent` filter eleven, with one overlapping record. These ten records are absent
from the default policy-card DOM:

```text
tr-3station   tr-parking    ct-renew       ct-reserve
ct-cl-hire    ct-cl-routes  ct-cl-brand    tour-old
tour-industry wf-elder
```

Some of their themes also appear in static comparison/calculator content. The
problem is incomplete policy-record coverage without interaction, not a completely
empty page. Existing detail lists in rendered cards are already in the DOM even
when collapsed. Do not confuse collapsed content with records never rendered.

Preserve the six historical `#six-*` links for usability. They are not independent
documents with separate metadata. If category pages are introduced, serve actual
static URLs and ordinary `<a href>` navigation, with substantive existing content
and one maintained data source. See
[crawlable link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).

### Canonicalization and exclusions

`og:url` uses the versioned homepage, while `SITE_URL` uses the clean root. Social
metadata does not replace a canonical link. Consolidate preference with an initial
HTML canonical and consistent links; do not block duplicate homepage variants with
robots.txt or use `noindex` to choose a canonical. See
[canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

The preview pages already have the correct exclusion intent. Preserve `noindex`
and allow crawlers to read it while these pages exist. Do not list them in a sitemap.
Contributor documents also need a deliberate publication policy under the root
Pages deployment; exclude them from the publishing output if they are intended
only for repository readers. Sitemap omission alone does not prevent indexing.
These checks belong to #4. See
[Google's noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

### Performance hypotheses

The photo preload handler requests twelve alternate images totaling 1,003,631
bytes after load, even if the visitor never cycles a photo. Other potential costs
are multiple font weights, eleven third-party players as the user scrolls, and
continuing animation/layout work. These are profiling candidates, not measured
CWV failures. Existing strengths include hero dimensions, media aspect ratios,
lazy iframes, font `display=swap`, and local-video `preload="none"`.

Ticket #5 starts with a reproducible mobile baseline and before/after measurements.
Use field p75 targets of LCP ≤ 2.5 seconds, INP ≤ 200 ms and CLS ≤ 0.1 when sufficient
field data is available. Lab measurements can guide work but do not establish field
INP or guarantee search outcomes. See
[Core Web Vitals guidance](https://developers.google.com/search/docs/appearance/core-web-vitals).

### Metadata, trust and video

The current page already has a title, meta description, `zh-Hant`, `og:locale=zh_TW`,
social image dimensions and alt text, descriptive section headings, publisher
attribution and dated sources. Improve these rather than claiming they are missing.
Add a verified icon and coherent descriptions; unique page titles become relevant
when additional pages exist. See
[title guidance](https://developers.google.com/search/docs/appearance/title-link)
and [favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search).

Connect claims directly to sources, distinguish proposed/current measures and review
dates, and explain the site's relationship with its linked campaign domain using
verified facts. No fabricated biography, endorsements or keyword pages are needed.
See [reliable content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

Structured data is a later consistency enhancement; generic entity markup does not
guarantee a rich result. Match it to visible, verified facts and canonical URLs.
See [structured-data guidance](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data).

The homepage is a gallery within a broader policy page. Video indexing work should
not assume every embed can earn video features. Dedicated watch pages, if worthwhile,
need one principal video, verified metadata and accessible media. Captions and
transcripts provide text access regardless of search eligibility. See
[video guidance](https://developers.google.com/search/docs/appearance/video).

## Outcome checks

Completion means deployed, verified engineering contracts: complete HTML policy
coverage, consistent URL signals, valid crawler artifacts, accessible content and
measured performance changes. Actual indexing and aggregate search outcomes must
then be checked by the Search Console owner. Record unavailable data rather than
assuming failure or claiming success. See
[Search Console capabilities](https://support.google.com/webmasters/answer/9128668).
