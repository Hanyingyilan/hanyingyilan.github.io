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
constant does not verify a date or ballot number. The countdown follows Taiwan calendar dates, refreshes at midnight and on tab
restoration, hides the number on election day and displays the historical date
afterwards. After election day, a visible notice identifies the page as historical
2026 election material. Preserve the homepage, category URLs, policy IDs, original
source dates and proposal/current-program distinctions. Do not infer an election
result or automatically relabel proposals as implemented programs. Keep retired
preview URLs at 404; do not replace them with an archive of experiments. Future
substantive updates require a new source review through the existing fact/code/
release roles. This is the preservation decision for #16; it does not assign an
unconfirmed named maintainer or imply continuing office status.

`content/site.json` owns the clean production root, homepage title/description
and social-image metadata. `src/pages.mjs` derives distinct category metadata
from the same policy source. Review public titles/descriptions when those facts
change. The repository-authored book icon is `assets/images/site-icon.svg`
(96 × 96 SVG); its stable URL is used on all pages. Validate production delivery
and a real LINE preview after release.

JSON-LD describes only WebSite/WebPage, including language and canonical identity.
Do not add `sameAs`, Person, publisher/about entity relationships or dates without
verified evidence. Local parsing/consistency tests are not Schema.org Validator
or Google Rich Results Test results. Validate release markup with those services
where applicable; generic schema validity does not promise rich results, ranking
or indexing. See [Google structured-data guidance](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
and [favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search). Preserve existing `#six-*`,
`#clean` and `#money` links when editing navigation. Social-image cache versions
are independent of the canonical URL. Keep source publication, factual review and
release dates distinct.


## Media provenance inventory

This inventory distinguishes files in the repository from permission evidence.
For existing media, original creator/source, reuse permission and required credit
remain **unknown** unless stated below. File names and public availability do not
establish rights. Unknown provenance is explicitly flagged as required by #16;
this inventory is not rights clearance. Replace an unknown entry only when the
maintainer supplies supporting records. No current asset was removed solely
because that record is missing.

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

On 2026-11-02, local `ffprobe` inspection found the MP4 is 47.203991 seconds,
540 × 960, with H.264 video and AAC audio. This verifies file properties only.
Its visible site title is “為家鄉獻出勇氣”. The source reel's visible author is
韓瑩 and its description begins “為宜蘭獻出我們的勇氣”; the inspected view did
not expose an original publication date, so `published` remains null.

`content/video.json` owns the local clip's metadata and 44 timed text cues.
`src/video.mjs` validates cue order/bounds and generates both the public WebVTT
and a native HTML details transcript. The cues were visually checked against
burned-in subtitles sampled at four frames per second; local MLX Whisper
large-v3-turbo speech recognition was used as a cross-check. Those are distinct
from a human listening to the complete audio: `audioReview` remains
`pending-human`, and the public text states this limit. Do not mark #10's full
caption/audio acceptance complete until that review is performed. Subtitles are
optional because the original already contains burned-in text; sound-effect and
background-audio completeness has not been certified.

The player's title, controls, poster and direct source link are retained. The
HTML transcript is readable without JavaScript. For a correction, edit the cues
in the JSON, regenerate both outputs and verify text, timings and browser track
loading. To complete review, check the whole clip including background sounds,
fill `audioReviewedAt` with the actual review date and change `audioReview` to
`reviewed`; publication date still requires source evidence. Embedded videos
retain their existing titles/direct links; unavailable source transcripts must
not be inferred from those titles.

No dedicated video watch pages or VideoObject are emitted: this site is a policy
overview, and publication/rights/transcript evidence is incomplete. Reassess when
source material is available using [Google video guidance](https://developers.google.com/search/docs/appearance/video).
A maintainer still needs to verify playback without Facebook login, caption/audio
accuracy and any Search Console video status.

## Machine-readable policy data decision

The current consumer is the static site generator and browser interface. No
external consumer requiring a public JSON contract has been identified. The
maintained HTTP checker reads all 23 policy records, citations and review states
from ordinary HTML without JavaScript, including category documents. Therefore
#19's evaluation currently chooses **not to publish a separate JSON API or
llms.txt**. Internal `content/*.json` stays excluded from deployment; the browser
bundle is not a supported data API.

A public interface would add a versioned schema, compatibility obligations and
ID/link/content parity checks without a demonstrated additional use. Reopen this
decision for a named consumer with a concrete HTTP read/use case, then generate
from the same content/source model and preserve unknown dates explicitly. Neither
JSON nor schema guarantees AI citation. This decision concerns format utility;
it does not establish any AI service's retrieval or indexing behavior.

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
