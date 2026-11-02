# Development, validation and release

## Local work

Inspect `git status`, preserve unrelated work and use a review branch. For a preview
of committed static output, run Python 3:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000/>; stop with Ctrl-C. Use HTTP, not `file://`.
This serves repository files without Pages exclusions.

For source work, use the Node.js range in [`package.json`](../package.json);
[CI](../.github/workflows/check.yml) selects the tested major. Install locked dependencies:

```sh
npm ci
npm run build
```

Edit [maintained sources](ARCHITECTURE.md#maintained-sources-and-generated-output)
and commit generated output with its inputs. Node, Playwright and HTML-validate
are development-only tools.

## Documentation maintenance

Use the [documentation map](../README.md#documentation-map) to find the owning
guide. Keep each rule, procedure and status in one home; link instead of copying.
Source owns executable values; tests may repeat expectations to detect regressions.
Add a guide only for a distinct responsibility and update the map and affected links.

Keep dated evidence scoped to its recorded revision. Preserve decision-relevant
history with a dated correction or immutable Git/PR link; do not turn old results
into current claims. Completed plans, review logs and routine checks belong in PR
history or the final work report.

## Temporary files and repository hygiene

Use the operating system's temporary directory or ignored `.scratch/` for previews,
prototypes, agent plans, scratch scripts, logs, screenshots and reports. Never commit
or force-add them, including when a tool defaults to `docs/`. Delete your completed
working artifacts after inspection; preserve unrelated work and reusable dependencies.

Track production sources/assets, required generated output, regression tests,
maintained guides and decision-relevant evidence. A dated filename alone does not
justify retention. Retire obsolete experiments and references together across
build, tests, manifest and docs; use Git history instead of an archive folder.
Before handoff or every commit/merge, inspect status, full diff and staged paths
for accidental artifacts. Ignoring an already tracked file does not remove it.

## Validation by change type

Every change requires diff inspection and `git diff --check`.

| Change | Additional checks |
| --- | --- |
| Documentation | Resolve relative paths/heading anchors; verify commands, symbols and claims against source; preserve historical scope |
| Data, markup, styles, scripts, generation | Freshness, native suite and relevant browser checks below |
| Calculator | Zero/default/maximum, each age group, month boundaries, invalid inputs and rapid updates |
| URLs, crawling, publishing | [HTTP checks](CRAWLABILITY.md#reproducible-checks) and release-output checks |
| Performance | [Measurement procedure](PERFORMANCE.md#reproduce) |

```sh
npm run check
npm test
npx playwright install chromium
npm run test:e2e
```

Freshness rejects stale output. Native tests cover data/source contracts, HTML,
resources/fragments, metadata, URLs, publishing, calculations and HTTP assertions,
including negative fixtures and deterministic generation. The browser suite starts
a Python server using [its configuration](../tests/playwright.config.mjs); use the
npm command so the config path is applied. CI runs both suites and the official
Pages Jekyll build/inventory/HTTP checks without deploying.

## Browser smoke checks

Run those relevant to the diff; record revision, environment and omissions.
Test core behavior with external fonts/players blocked; live media needs separate checks.

| Area | Required coverage |
| --- | --- |
| Startup/failure | Complete readable overview with JS/data/core/optional blocked; normal startup has no uncaught application errors; Canvas/animation/share/hook failures leave core usable |
| Categories/filters | Six static pages load/refresh without JS; local citations/return links; all panels, details and `#six-*` links; select/clear/all match [filter semantics](ARCHITECTURE.md#readable-content-and-enhancement) |
| Calculator/comparison | Default 95,200; zero 0; max 723,200; months 0/24; bounded counts and latest settled announcement; three comparison stops in both states |
| Sharing | Clipboard success/failure, LINE URL, image dialog focus/close/return, newest asynchronous result, save and native-share fallback |
| Accessibility/layout | Keyboard names/focus, skip link, large text, themes, reduced motion; 320px/mobile/desktop and native 200% zoom |
| Media/optional | Selected photos only; local video in a fresh session, WebVTT and no-JS transcript; embed fallback links; game open/close/restart and scoped input |
| Dates | Before/on/after election in Asia/Taipei and America/Los_Angeles; midnight and suspended-tab restoration |

Totals test the proposal model, not eligibility. Update them when reviewed rates
change. Configured dates are not independently verified election facts. CSS zoom
in Chromium does not replace native zoom, real screen readers or other engines.
Report actual checks and missing tools/access; old green results do not validate a new revision.

## Release and rollback

1. Review the exact diff and validation evidence. Keep factual edits and broad
   refactors reviewable. Follow the user's authorization for commits, remotes,
   PRs and publishing.
2. Integrate through maintainer review. Production Pages uses legacy `main:/`;
   merging upstream may publish. A fork merge does not establish deployment.
   Do not change Pages settings incidentally.
3. For publishing changes, build with Pages-compatible Jekyll, then run
   `node scripts/check-published.mjs _site`. Serve only `_site` on port 8124 and run
   `node scripts/check-http.mjs http://127.0.0.1:8124/ --published`.
   The manifest must classify new tracked files. CI uses the official action;
   record Jekyll/Ruby versions or unavailable checks for local runs.
4. Verify the actual Pages deployment and live HTTP/assets/metadata/fragments,
   including excluded/unknown paths and retired previews. Match the deployment
   commit; release time is separate from factual review.
5. Have the owner complete relevant [Search Console](SEARCH-CONSOLE.md) and
   [crawler observations](CRAWLABILITY.md#observation-procedure).
6. Roll back by reverting the offending commit through the same review/release
   process, then verify deployment. Do not rewrite shared history or treat a
   local reset as a production rollback.

Editorial/media responsibilities are in [Content](CONTENT.md); open acceptance
work is in the [Roadmap](ROADMAP.md).
