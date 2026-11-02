# Engineering and content principles

Decision rules established 2026-11-01. Current behavior, procedures and evidence
have separate homes in the [documentation map](../README.md#documentation-map).
These rules do not assert universal compliance.

## 1. Make information readable before enhancing it

Put complete policy text, headings and citations in initial HTML. JavaScript may
add filtering, calculations, sharing and playfulness, but people and crawlers
must receive the same substantive content without depending on it.

## 2. Preserve factual provenance and policy status

Tie claims and amounts to sources. Distinguish proposals, reported statements
and current government programs; preserve dates, eligibility caveats and the
boundary between source text and editorial summaries. Never turn expectations
into guarantees. Keep the publisher visible and relationships verified; do not
invent endorsements, offices, statistics, source URLs or permissions. Code review
is not independent factual verification.

## 3. Use one maintained source for each fact

Policy data, calculator values, HTML and metadata should share sources. Verify
generated output and preserve stable IDs/links. Documentation follows the same
rule: one owner per topic, linked from other guides. Keep current behavior,
principles, procedures, priorities and dated evidence distinct. Preserve evidence
that supports durable decisions; disposable work follows the
[temporary-file policy](CONTRIBUTING.md#temporary-files-and-repository-hygiene).

## 4. Keep deployment simple and reviewable

Prefer static files and browser standards. Add tooling only for an observed need
with clear maintenance benefit; SEO alone does not justify a framework, server or
hosting migration. Use scoped, revertable changes and established publishing.

## 5. Make accessibility part of each feature

Provide keyboard operation, meaningful names, visible focus, readable contrast
and mobile layouts. Dialogs manage/restore focus; games keep input scoped.
Respect reduced motion and require user interaction for sound. Preserve native
media controls, fallback links and text equivalents for informative canvas/video.

## 6. Measure performance and search outcomes honestly

Separate observations from hypotheses. Record environment, tool versions and date
for comparisons; lab results are not field Core Web Vitals or ranking guarantees.
Use canonical URLs, crawlable links and truthful metadata. Valid sitemap/schema
is not proof of indexing; social previews are a separate check.

## 7. Minimize data collection and third-party cost

Keep calculator/filter state local. Do not collect or infer visitors' political
preferences. Prefer aggregate operational measurements and assess external font/
embed cost, privacy and failure behavior. Never commit credentials, private
analytics or personal data; public documentation must be safe to expose.

## 8. Maintain content through its lifecycle

Use actual review dates, not automatic freshness. Track media sources/permission
and plan election-copy retirement without erasing useful history or presenting
old proposals as current policy.

## Applying or changing a principle

Explain relevant tradeoffs in the change description. Revise a rule with its
implementation rationale and evidence. Improve legacy gaps incrementally without
requiring unrelated rewrites.
