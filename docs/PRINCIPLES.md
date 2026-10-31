# Engineering and content principles

Initial principles for review, 2026-11-01. These guide future changes; they do not
assert that all current behavior already complies. The [roadmap](ROADMAP.md)
connects present gaps to implementation issues.

## 1. Make information readable before enhancing it

Core policy text, headings, and citations should be available in initial HTML.
JavaScript can add filtering, comparisons, calculations, sharing, and playfulness,
but should not be necessary to discover the complete policy overview. Serve the
same substantive content to people and crawlers.

## 2. Preserve factual provenance and policy status

Tie claims and numerical assumptions to attributable sources. Distinguish a
candidate proposal, reported statement, and current government program. Preserve
dates, eligibility caveats, and the distinction between source text and editorial
summaries. Do not silently turn expectations into guaranteed outcomes.

Keep the publisher visible and explain relationships with other websites using
verified facts. Do not invent endorsements, offices held, statistics, source URLs,
or permissions. A code review is not independent verification of public claims.

## 3. Use one maintained source for each fact

Policy data, calculators, generated HTML, and metadata should not drift apart.
Centralize repeated values when changing the relevant feature. If a static
generator is introduced, document its inputs and command and verify generated
output against them. Preserve stable policy IDs and existing external links.

## 4. Keep deployment simple and reviewable

Prefer static files and browser standards. Add tooling when it solves an observed
problem with a clear maintenance benefit. SEO does not by itself justify a client
framework, application server, or hosting migration.

Keep changes small enough to review, validate the affected behavior, and deploy
through the established Pages source. Use a revertable release process and retain
historical URLs where useful. Do not combine unrelated redesigns with SEO fixes.

## 5. Make accessibility part of each feature

Support keyboard operation, meaningful names, clear focus, legible text, adequate
contrast, and mobile layouts. Dialogs should manage focus and restore it on close.
Decorative animation must respect reduced motion; sound should follow a deliberate
user interaction. Optional games must not capture unrelated controls' input.

Canvas and video experiences need accessible text equivalents where they convey
information. Preserve native controls and useful fallback links.

## 6. Measure performance and search outcomes honestly

Separate observed facts from hypotheses. Record device, network, tool version and
date for performance comparisons. Prefer real-user Core Web Vitals when available;
do not present a laboratory score as field data or a guarantee of rankings.

Use stable canonical URLs, crawlable links and truthful metadata. Sitemap and
structured-data validity are engineering checks, not promises of indexing or rich
results. Social preview debugging is a separate concern from search indexing.

## 7. Minimize data collection and third-party cost

Keep calculator and filter state local by default. Do not collect or infer visitors'
political preferences from their selections. Aggregate operational measurements
should be sufficient for routine engineering decisions.

Evaluate external embeds and fonts for loading cost, privacy and failure behavior.
Never commit credentials, private analytics exports, or personal user data. Public
documentation should be safe to expose under the current static deployment.

## 8. Maintain content through its lifecycle

Use meaningful review dates, not automatic “freshness” updates. Track sources and
reuse permission for media. Plan how election-specific copy, countdowns, and
experimental pages will be updated or archived. Do not silently erase useful
historical context or claim an old proposal is current policy.

## Applying or changing a principle

In a change description, identify the relevant principle and practical tradeoffs.
When a principle needs revision, update it with the implementation rationale and
review evidence. Existing code may be improved incrementally; unrelated legacy
gaps do not require rewriting the whole site in every change.
