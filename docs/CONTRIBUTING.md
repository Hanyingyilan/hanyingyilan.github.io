# Development, validation, and release

## Local work

Inspect `git status`, preserve unrelated work and use a review branch. To preview
committed static output, only Python 3 is needed:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000/>; stop with Ctrl-C. Use HTTP instead of `file://`.
This server exposes repository files and does not apply Pages exclusions.

For source development, use the Node.js range in [`package.json`](../package.json).
The [CI workflow](../.github/workflows/check.yml) selects its tested major version. Install the locked
development dependencies and generate output:

```sh
npm ci
npm run build
```

Edit the [maintained sources](ARCHITECTURE.md#maintained-sources-and-generated-output)
and commit generated files with their inputs. Production needs no Node runtime.
Pinned Playwright and HTML-validate are development-only dependencies.

## Documentation maintenance

Use the [documentation map](../README.md#documentation-map) to locate the owning
guide before writing. Keep each instruction, operational status and decision in
one maintained home; use links when another topic depends on it. A brief summary
may orient readers, but should not become a second checklist or configuration
reference. Source files own executable values; tests may deliberately repeat
expected results to detect regressions.

Separate current behavior (Architecture), decision rules (Principles), editorial
work (Content), contributor procedures (this guide), issue sequencing (Roadmap)
and service-specific operations (their respective guides). New topics need an
explicit owner in the map only when none of the existing guides covers them.
Review all affected links when moving or renaming a section.

Keep retained audits, architecture decisions and reproducible measurements scoped
to their revision. Append a dated correction with evidence instead of replacing an
old result with today's result. Completed execution plans and review-session logs
belong in PR/Git history, not the maintained documentation set.

## Temporary files and repository hygiene

Never commit or merge disposable preview pages, prototypes, agent execution plans,
review notes, scratch scripts, logs, screenshots, test reports or local build
directories. Use the operating system's temporary directory or ignored `.scratch/`
for working files. Agent tools and skills that default to `docs/` for task plans
must use that scratch storage instead. Do not force-add ignored artifacts.

Delete completed experiments and your own generated artifacts after inspecting
their results. Remove obsolete references from the build, tests, publication
manifest and maintained guides in the same change. Use Git history to recover
retired tracked experiments; do not create an archive folder or replacement
cleanup/review log. Preserve unrelated work and reusable development dependencies.

Track production sources/assets, required generated public output, permanent
regression tests, maintained guides, architecture decisions and reproducible
evidence that supports a documented decision. A dated filename alone does not make
an artifact worth retaining. Each retained document needs a clear responsibility
in the README map; ordinary check results and task progress go in the PR or final
work report.

Before handing off or committing, inspect `git status`, the full diff and staged
file list for accidental artifacts. Keep non-entry files in the directory that
owns them, use descriptive names, and apply the
[validation rules](#validation-by-change-type). Ignoring a file does not remove it
from Git if it was already tracked; remove obsolete tracked files explicitly.

## Validation by change type

For every change, inspect the diff and run `git diff --check`.

| Change | Required validation |
| --- | --- |
| Documentation only | Resolve relative links and heading anchors; verify referenced files, symbols, commands and claims against source; preserve historical scope/dates |
| Data, markup, styles, scripts or generation | Run freshness/native checks below and the browser checks relevant to the diff |
| Calculator | Also check zero/default/maximum, individual age groups, month boundaries, invalid inputs and rapid updates |
| URLs, crawler or publishing configuration | Also follow [HTTP checks](CRAWLABILITY.md#reproducible-checks) and the release-output checks below |
| Performance | Use the conditions and reproduction procedure in [PERFORMANCE](PERFORMANCE.md#reproduce) |

Do not install a test framework solely for prose. For implementation changes:

```sh
npm run check
npm test
npx playwright install chromium
npm run test:e2e
```

Freshness checks reject stale output. Native tests cover data/source validation,
HTML nesting, script syntax, unique IDs, resources/fragments, URLs, publishing,
numerical boundaries and HTTP-content assertions. Negative tests use temporary
fixtures, including stale generated files; repeated generation checks determinism.
The browser suite uses [its configuration](../tests/playwright.config.mjs) to start
a Python server at the repository root. Use `npm run test:e2e` so the config path
is applied. CI runs freshness, native tests
and Chromium checks, then builds with `actions/jekyll-build-pages@v1` and checks the
actual `_site` inventory and HTTP responses through [the workflow](../.github/workflows/check.yml).

## Browser smoke checks

Run checks relevant to the diff; record revision, browser/device, failures and
unperformed checks. External fonts/players need network access; test core behavior
with them blocked as well as live media where available.

| Area | Check |
| --- | --- |
| Startup/failure | Heading and complete overview remain readable with no JS, core/data blocked, optional script blocked or Canvas unavailable; normal startup has no uncaught application errors |
| Categories/details | All six open; details expand/collapse; direct `#six-welfare` and initial stamp work |
| Filters | Multi-select, clear and select-all match [documented semantics](ARCHITECTURE.md#readable-content-and-enhancement) |
| Calculator | Default 95,200; all zero 0; maximum 723,200; months 0/24; counts stay within limits; rapid updates settle on the last result and announcement |
| Comparison | Three stops and both states show matching text and graphic |
| Sharing | Clipboard success/failure, LINE URL, image dialog, latest asynchronous image, save and unsupported-share fallback |
| Accessibility | Keyboard names/focus, modal containment/close/return, skip navigation, large text, theme and reduced motion |
| Responsive | 320px, common mobile width, desktop and native 200% browser zoom |
| Media | Photos load on selection, local video/poster and embedded-player fallback links |
| Optional features | Game open/close/restart; game input does not intercept unrelated controls |

Calculator totals are regression expectations for the proposal model, not benefit
advice. Recalculate them when reviewed source assumptions change. Chromium tests
include CSS zoom; this does not replace native browser zoom, actual screen readers
or other-engine checks. Record the tested revision, coverage and unperformed checks
in the PR or final work report; earlier results do not establish that a new release passed.

## Release and rollback

1. Review the exact diff and relevant evidence. Keep factual changes, documentation
   and broad refactors easy to assess separately. Commit to the review branch and
   record the revision and checks actually run.
2. Integrate through the maintainers' review process. The observed production Pages
   source is `main:/`; merging upstream there may publish. Fork merge status is not
   deployment evidence. Do not change Pages settings incidentally.
3. For publishing changes, compare a Pages-compatible Jekyll build's `_site` file
   set with `content/publishing.json` using
   `node scripts/check-published.mjs _site`. Serve only `_site` and run
   `node scripts/check-http.mjs http://127.0.0.1:8124/ --published`. This rejects
   missing/extra artifacts and verifies public assets plus excluded/retired/unknown
   paths. CI runs the official Pages Jekyll action for these checks without
   deployment. The manifest must classify new tracked files; repository-root serving cannot
   verify Jekyll exclusions. Record the Jekyll/Ruby versions and any unavailable check.
4. Check the actual Pages build/deployment, then live status codes, assets, fragment
   links, metadata and crawler output. Fetch an excluded source/doc path and an
   unknown path as well as `/`, `/index.html` and query variants. Confirm retired
   preview URLs return 404. Record release time separately from factual review.
5. Have the authorized owner complete [Search Console](SEARCH-CONSOLE.md) and any
   relevant [crawler-service observations](CRAWLABILITY.md#owner-and-observation-work-still-pending).
   Source checks do not establish Google-selected canonical or indexing.
6. Roll back by reverting the offending commit through the same review/release
   process and verifying the resulting deployment. Do not rewrite shared history
   or assume a local reset changes the live site.

Maintainer roles, media permissions and post-election ownership remain tracked in
[#16](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/16).
