# Local P1 implementation review

Prepared 2026-11-01. These are local changes, not deployment or indexing results.
No pushes, external review issues, PRs, Pages settings changes or merges were made.
The requested review-issue payloads are recorded here pending external-write
access/authorization. Original issue acceptance remains open for owner checks.

| Source issue | Branch | Parent branch | Implementation commit | Local evidence |
| --- | --- | --- | --- | --- |
| #11 | `p1/11-validation-build` | `arch/p1-proposal` | `cf17633` | Deterministic build, CI, negative validation and browser smoke |
| #1 | `p1/01-static-content` | `p1/11-validation-build` | `6d09a47` | All 23 policies in initial HTML, same generated browser data, independent optional script |
| #2 | `p1/02-canonical` | `p1/01-static-content` | `3c32f92` | Canonical/Open Graph/shared root and category fragments; root/index/query browser cases |
| #4 | `p1/04-crawlers` | `p1/02-canonical` | `db463da` | Root-only sitemap, permissive robots, explicit public manifest and Jekyll exclusions |
| #12 | `p1/12-calculator` | `p1/04-crawlers` | `852fb79` | Shared proposal rates/provenance, pure calculation, latest animation wins, settled live result |

Architecture clarification commit `77556cd` sits on the #1 branch before its
implementation. Final review fixes and expanded regression coverage sit atop the
#12 branch and must be included with the stack. Branch commits are review points;
full acceptance evidence below applies to the integrated final tree.

## Validation evidence

Environment: macOS, Node 25.4.0, Playwright 1.64.1 Chromium. `npm run check`,
`npm test`, and `git diff --check` pass. Native tests cover data identity/category/
source classes, all policy text and browser data parity, HTML closing/nesting,
local assets and fragments, public-file classification, all generated scripts,
canonical/previews/crawlers, deterministic generation and stale artifacts. Stale
artifact tests mutate temporary copies of every generated output, never live files.
Deliberately malformed nesting, single-quoted missing assets/duplicate IDs, unknown
source classes and stale fixture data are rejected. These are engineering checks,
not independent verification of political claims.

The full integrated Chromium suite passed 14 tests in 24.6 seconds. It covers all
six categories, details, filter clear/all, initial category links and stamps,
no JavaScript, blocked core/data, blocked optional script, Canvas unavailable
including attempted actions, calculator zero/default/max/month boundaries and
rapid animation updates, calculator keyboard input, comparison states, clipboard
success/failure, LINE URLs, generated image/download/unsupported share, themes,
large text, portrait cycle, local media markup and Facebook fallback links, game
open/close/restart, blocked third parties and storage, 320/390/1280px widths and
200% CSS zoom. Screenshots are ignored local artifacts under `test-results/`.
CSS zoom is a layout simulation, not an OS assistive-technology test.

## Source/status findings

The accessible Newtalk report dated 2026-07-01 supports the proposed calculator
rates. The official August 14 announcement has different elder rates. The UI now
labels a proposal scenario, links both sources and shows the actual source-check
date separately. No eligibility or enactment guarantee is made. See CONTENT.md.

## Rulings and limits

- Keep complete overview permanently visible alongside enhanced selected cards:
  this guarantees readable content under core/optional failure, at the cost of a
  longer page. No substantive policy text is hidden exclusively behind JavaScript.
- Preserve proposal calculator amounts and baseline totals, rather than replacing
  them with current government amounts; label the distinction visibly. Otherwise
  the calculator would model a different proposal than the requested regression.
- Pin a development HTML validator to check actual nesting instead of treating
  regex references as HTML validation. Production remains dependency-free; the
  maintenance cost is a small additional locked development dependency tree.
- Record review issues locally because this session did not authorize external
  writes; no fabricated issue links or deployment claims.

Actual Jekyll build/output was not run: no Jekyll executable/gems were available.
The configured legacy Pages exclusions and manifest were checked locally; a
Python server intentionally does not apply them. Verify deployed `_site` contents,
source/docs exclusion, live status codes, assets and crawler files after merge.
Search Console submission, Google-selected canonical, indexing and performance
measurements remain owner work. No Lighthouse score or ranking claim is made.
External font/player service behavior is not guaranteed by blocked-network tests.

Existing #13 accessibility gaps remain: generated-image modal does not fully trap
or restore focus, and game Space handling is broader than its controls. Tests
verify current Escape close and initial focus but do not claim these gaps fixed.
Full real-screen-reader validation, native browser 200% zoom and other browser
engines remain unperformed. No new analytics or input/preference telemetry exists.

Merge in the approved stack order after review. If squash/rebase merging changes
parent commit IDs, rebase each remaining branch and verify its incremental diff.
Do not treat local implementation completion as deployed acceptance.
