# Content maintenance guide

Public copy stays in Traditional Chinese (`zh-Hant`). This guide owns editorial
work, not independent verification of claims. [Architecture](ARCHITECTURE.md#maintained-sources-and-generated-output)
maps files; [Contributing](CONTRIBUTING.md) owns generation and validation.

## Policies and citations

1. Find the stable `PL.id` in `content/policies.json`; inspect category `p`, title
   `t`, detail `body`, attribution `ref`, display class `src`, `who` mappings and
   optional `go` target. Preserve IDs and external links.
2. Read original material and update `content/sources.json`. Publication and
   actual source-review dates are separate; inaccessible material is not proof
   of link rot. Retain attribution and the access limitation.
3. Maintain policy `sourceRefs`, `status`, `verification` and nullable `reviewed`
   together. Verification is `reviewed`, `partial` or `unverified`; dates are real
   `YYYY-MM-DD` values or null. Reviewed records require review dates. Partial/
   unverified policies keep their complete-review date null. Preserve proposal/
   current-program distinctions and qualifications; display classes are not evidence.
4. Search related policies, comparison `STOPS` in `src/app.js`, calculator labels,
   metadata and video copy for the same fact. Update all affected representations.
5. Regenerate and run the [required checks](CONTRIBUTING.md#validation-by-change-type).
   Review dates change only for material actually reviewed, not formatting or release.

Corrections need a policy ID, original URL/date and specific claim. The public
issue tracker accepts source corrections, not personal benefit applications.
Source findings live in `content/sources.json`; calculator provenance is separate.
A campaign site's self-description does not establish shared management with this
repository. Earlier inspections remain in [Git history](https://github.com/Hanyingyilan/hanyingyilan.github.io/blob/293531f16846551e7337b8f3485175e2176ced4a/docs/CONTENT.md).

## Calculator and numerical assumptions

`src/calculator.mjs` owns `RATES`, `PROVENANCE`, `DEFAULT_COUNTS`, `MAX_COUNTS` and
`MAX_MONTHS`. Keep `{{rate.*}}` tokens in policy/template copy instead of duplicating
amounts. Review related labels and comparison text when rates change.

The scenario combines one-time birth support, nutrition over selected months and
one annual elder payment. It is neither recurring entitlement nor an eligibility
guarantee. Controls clamp to bounds; the pure function rejects noninteger,
negative and above-limit inputs. [Browser checks](CONTRIBUTING.md#browser-smoke-checks)
and calculator tests own numerical expectations.

## Media and permissions

Record origin, permission, required credit and description for new media, then
check dimensions/size. Public availability is not reuse permission. Use descriptive
lowercase hyphenated names in the [media layout](ARCHITECTURE.md#public-media-layout).

Update all consumers when replacing or moving media: portrait `LIST` and canvas
references in `src/optional.js`, hero/player/poster/embeds in `src/index.template.html`,
social metadata in `content/site.json`, and clip metadata/cues in `content/video.json`.
Classify paths in `content/publishing.json`; check photo tests and measurement
filters when portrait paths change. A move changes a public URL: record aliases
or retirement in the release PR. Historical reports keep their measured paths.
Do not infer captions from titles or add view counts without a dated maintenance plan.

## Election copy, sharing and dates

Review `ELECTION` in `src/app.js`, `BALLOT_NO` in `src/optional.js`, template badges,
canvas footer and accessible labels together. Constants do not verify a date or
ballot number. The countdown follows Taiwan calendar days; after election day,
a visible notice identifies the page as historical 2026 material. Preserve homepage/
category URLs, policy IDs, original dates and proposal status. Do not infer a
result, rename proposals as implemented programs or revive retired previews.
Substantive updates require factual review and the established release process.

`content/site.json` owns the production root and homepage/social metadata;
`src/pages.mjs` derives category metadata. Preserve `#six-*`, `#clean` and `#money`.
Social-image cache versions are independent of canonical URLs. Keep publication,
factual review and deployment dates distinct.

For the repository-authored icon, update `assets/images/site-icon.svg`, regenerate
its 96×96 PNG (for example with `sips -s format png assets/images/site-icon.svg
--out assets/images/site-icon.png`) and inspect dimensions/appearance. All pages
reference the stable PNG URL. Check production delivery and an actual LINE preview
after metadata changes; see [Google favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search).

JSON-LD currently describes WebSite/WebPage only. Add no Person, publisher/about,
`sameAs` or dates without evidence. Parsing/consistency tests do not replace
external validation, and generic schema validity guarantees neither rich results
nor indexing. Use [Google's structured-data guidance](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
when changing the markup.

## Media provenance inventory

Unknown means creator/source, reuse permission or required credit has not been
established. This inventory does not grant rights or require removal solely for
missing records. Replace unknown entries only with supporting evidence.

| Repository asset | Origin evidence / permission / credit |
| --- | --- |
| [`han-ying-arms-crossed.jpg`](../assets/images/portraits/han-ying-arms-crossed.jpg) | Unknown / unknown / unknown |
| [`han-ying-badminton-lunge.jpg`](../assets/images/portraits/han-ying-badminton-lunge.jpg) | Unknown / unknown / unknown |
| [`han-ying-badminton-ready.jpg`](../assets/images/portraits/han-ying-badminton-ready.jpg) | Unknown / unknown / unknown |
| [`han-ying-badminton-shuttlecock.jpg`](../assets/images/portraits/han-ying-badminton-shuttlecock.jpg) | Unknown / unknown / unknown |
| [`han-ying-badminton-smiling.jpg`](../assets/images/portraits/han-ying-badminton-smiling.jpg) | Unknown / unknown / unknown |
| [`han-ying-crouching-campaign-vest.jpg`](../assets/images/portraits/han-ying-crouching-campaign-vest.jpg) | Unknown / unknown / unknown |
| [`han-ying-hand-on-cheek.jpg`](../assets/images/portraits/han-ying-hand-on-cheek.jpg) | Unknown / unknown / unknown |
| [`han-ying-orange-cap.jpg`](../assets/images/portraits/han-ying-orange-cap.jpg) | Unknown / unknown / unknown |
| [`han-ying-temple-peace-sign.jpg`](../assets/images/portraits/han-ying-temple-peace-sign.jpg) | Unknown / unknown / unknown |
| [`han-ying-waving.jpg`](../assets/images/portraits/han-ying-waving.jpg) | Unknown / unknown / unknown |
| [`han-ying-white-jacket.jpg`](../assets/images/portraits/han-ying-white-jacket.jpg) | Unknown / unknown / unknown |
| [`han-ying-windblown-closeup.jpg`](../assets/images/portraits/han-ying-windblown-closeup.jpg) | Unknown / unknown / unknown |
| [`han-ying-windblown-cutout.png`](../assets/images/portraits/han-ying-windblown-cutout.png) | Unknown / unknown / unknown |
| [`han-ying-windblown.jpg`](../assets/images/portraits/han-ying-windblown.jpg) | Unknown / unknown / unknown |
| [`han-ying-policy-preview.png`](../assets/images/social/han-ying-policy-preview.png) | Unknown / unknown / unknown |
| [`courage-for-hometown.mp4`](../assets/videos/courage-for-hometown.mp4) | [Original Facebook reel](https://www.facebook.com/reel/1144892157970700/) visibly attributes the matching speech to 韓瑩 (checked 2026-11-02); production ownership unverified / unknown / unknown |
| [`courage-for-hometown-poster.jpg`](../assets/videos/courage-for-hometown-poster.jpg) | Paired local poster; derivation unverified / unknown / unknown |
| [`site-icon.svg`](../assets/images/site-icon.svg) | Repository-authored geometric book illustration, no imported artwork; no third-party attribution identified |
| [`site-icon.png`](../assets/images/site-icon.png) | Raster export of the repository-authored SVG above; same provenance |


`content/video.json` owns the clip metadata and timed text. The November 2 source
review identified the visible reel author as 韓瑩 but no original publication date;
`published` remains null. Screen subtitles and speech recognition were cross-checked,
but full human audio review remains pending. Detailed observations are in
[PR #32](https://github.com/Hanyingyilan/hanyingyilan.github.io/pull/32), not fresh
verification by this guide.

For corrections, edit JSON cues, regenerate WebVTT/transcript and check text,
timings and browser track loading. To mark `audioReview: reviewed`, listen to the
whole clip including background sounds and fill the actual `audioReviewedAt` date.
Publication date needs separate source evidence. [#10](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/10)
owns remaining audio/date/embedded-text review. Preserve the public pending-review
notice until complete; embedded transcripts cannot be inferred from titles.

No watch pages or VideoObject are emitted: this is a policy overview with incomplete
publication/rights/transcript evidence. Reassess with [Google video guidance](https://developers.google.com/search/docs/appearance/video)
when source material is available. Validate anonymous playback and any indexing
claims separately from local subtitle checks.

## Machine-readable policy data decision

The generator/browser are the only identified data consumers. Complete HTML already
exposes policies, citations and review states without JavaScript, so #19 chose
**no separate public JSON API or `llms.txt`**. Internal `content/*.json` remains
excluded; the browser bundle is not a supported API.

Reopen for a named consumer with a concrete use case. A public interface would need
versioning, compatibility and ID/link/content parity checks; generate it from the
same source and preserve unknown dates. Neither JSON nor schema guarantees AI citation.
