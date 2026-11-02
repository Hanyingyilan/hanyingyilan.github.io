# Content maintenance guide

This guide owns editorial changes and source-review records. It does not validate
political claims. Public copy stays in Traditional Chinese (`zh-Hant`); follow the
[provenance principle](PRINCIPLES.md#2-preserve-factual-provenance-and-policy-status).
The [architecture map](ARCHITECTURE.md#maintained-sources-and-generated-output)
identifies source files; [CONTRIBUTING](CONTRIBUTING.md) owns build and validation steps.

## Policies and citations

1. Find the stable `PL.id` in `content/policies.json`. Inspect category `p`, title
   `t`, detail `body`, attribution `ref`, display class `src`, `who` mappings and
   optional `go` target. Keep IDs and existing external links stable.
2. Read the original source and maintain its entry in `content/sources.json`.
   Record publication and actual source-review dates separately. An inaccessible
   source is not proof of link rot; retain its attribution and access limitation.
3. Update the policy's `sourceRefs`, `status`, `verification` and nullable `reviewed`
   field together. Source and policy `verification` must be `reviewed`, `partial`
   or `unverified`. Dates must be real calendar dates (`YYYY-MM-DD`) or null;
   `reviewed` verification requires a non-null review date; partially/unverified
   policies must keep their complete-review date null. `reviewed` means complete
   policy review, not partial source access.
   Preserve proposal/current-program distinctions and eligibility qualifications.
4. Search related copy before editing: other policy records, `STOPS` in `src/app.js`,
   calculator rates/labels, metadata and video descriptions can repeat the same fact.
5. Validate JSON, category/filter mappings, source IDs, links and rendered details.
   `src/sources.mjs` rejects unknown references and unsafe URL schemes; `src` values
   such as `edm` and `news` are presentation classes, not verification evidence.
6. Regenerate and run the [appropriate checks](CONTRIBUTING.md#validation-by-change-type).
   Update factual-review dates only for material actually reviewed, not formatting,
   documentation edits or deployment.

For corrections, request a policy ID, original URL/date and the specific claim.
Review the original and update policy/source fields with a dated commit. The public
page links the upstream public issue tracker; personal benefit applications do not
belong there. Check sources again for substantive updates and retirement.

## Calculator and numerical assumptions

`src/calculator.mjs` owns `RATES`, `PROVENANCE`, `DEFAULT_COUNTS`, `MAX_COUNTS` and
`MAX_MONTHS`. Change reviewed rates there; keep `{{rate.*}}` tokens in policy/template
copy instead of introducing independent literal amounts. Search remaining labels,
policy summaries and comparison copy for related facts.

The scenario combines one-time birth support, nutrition support over selected
months and one annual elder payment. Its total is not a recurring entitlement or
eligibility guarantee. UI controls clamp to declared bounds; the pure function
rejects noninteger, negative and above-limit values. Numerical checks are maintained
in [CONTRIBUTING](CONTRIBUTING.md#browser-smoke-checks) and the calculator tests.

## Media and permissions

For each new image/video, record origin, permission, attribution requirements and
a human-readable description; check dimensions and size. No license or complete
asset-permission record was present at the audit baseline. Public availability is
not reuse permission; the ownership/provenance follow-up is
[#16](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/16).

Use the [public media layout](ARCHITECTURE.md#public-media-layout). Choose descriptive,
lowercase, hyphen-separated filenames based on the visible subject or intended use;
avoid unexplained abbreviations and numbered names such as `p4.jpg`.

The portrait `LIST` and canvas image reference are in `src/optional.js`. Hero,
social-preview, local-video and poster references are in `src/index.template.html`.
Facebook embeds and direct links remain separate template markup. Update every
affected reference, classify the new paths in `content/publishing.json`, and check
the photo-loading test and performance script when changing portrait paths.

Moving media changes its public URL. Update metadata and in-repository consumers
together, and document any compatibility aliases or retired URLs for deployment.
Preserve dated reports' original paths so their recorded measurements remain
interpretable.

Undated video view counts were removed. Any future snapshot needs a measurement
date and deliberate maintenance. Do not infer captions or transcripts from titles.

## Election copy, sharing and dates

Review `ELECTION` in `src/app.js`, `BALLOT_NO` in `src/optional.js`, template badges,
canvas footer and accessible labels together when election facts change. A code
constant does not verify a date or ballot number. The countdown updates on page
load; long-open-tab and post-election behavior remain lifecycle work under #16.

`content/site.json` owns the clean production root. Preserve existing `#six-*`,
`#clean` and `#money` links when editing navigation. Social-image cache versions
are independent of the canonical URL. Keep source publication, factual review and
release dates distinct.

## Historical source inspections — 2026-11-01

These are earlier inspection records, not a new policy verification in the docs
cleanup. Current per-source findings and dates live in `content/sources.json`;
calculator provenance lives in `src/calculator.mjs`.

During the calculator pass, the 2026-07-01 Newtalk report was opened and reported
proposal rates: birth 12,000 → 20,000, monthly nutrition 3,000 and elder groups
1,200 / 2,000 / 6,000 / 50,000. The 2026-08-14 official announcement (article
406290) listed current elder payments of 1,200 / 2,000 / 6,600 / 30,000. The
calculator retained proposal amounts and labeled the distinction. LTN pages could
not be opened; that was not a finding that their links were dead.

During the later source-registry pass, campaign birth/nutrition/egg-freezing and
broad pedestrian-safety text and the Newtalk report were available. CNEWS returned
403, LTN and Facebook access failed, and the government notice timed out. These
later access failures do not negate the earlier inspection or establish complete verification
of other policies. The campaign site's self-description does not independently
establish shared management with this repository.
