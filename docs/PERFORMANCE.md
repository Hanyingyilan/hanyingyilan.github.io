# Mobile performance experiment — 2026-11-01

The bounded change removes the load + 1.5s prefetch of 12 alternate portraits and
the hidden second portrait's initial `src`. Selecting a photo assigns its URL on
demand. The visible hero, image dimensions, local video's `preload="none"`, all
11 lazy embeds and direct links are preserved. No video facade was introduced.

Baseline product commit: `1866a5e3234ca3ca05e661f3aeb49d2bda5d9d45`.
[Before report](performance/before.json) and [after report](performance/after.json)
record exact commit and product diff, Node/browser versions and all six runs.
Chromium 156.0.8078.4, Playwright 1.64.1, Node 25.4.0 on macOS; viewport 390 × 844,
DPR 3, mobile/touch, 4× CPU slowdown, 1.6 Mbps download, 750 kbps upload, 150ms
latency, empty cache/context each run. Observe through load + 8 seconds. Three
runs each for reduced and normal motion; table values are medians.

| Motion | Metric | Before | After |
| --- | --- | ---: | ---: |
| reduce | LCP (ms) | 1,064.000 | 932.000 |
| reduce | CLS | 0.151 | 0.000 |
| reduce | Transferred bytes | 1,242,983.000 | 236,940.000 |
| reduce | Main-thread task time (ms) | 592.920 | 613.579 |
| reduce | Script time (ms) | 36.073 | 37.977 |
| reduce | Long-task duration (ms) | 0.000 | 50.000 |
| reduce | Alternate requests | 12.000 | 0.000 |
| no-preference | LCP (ms) | 1,064.000 | 936.000 |
| no-preference | CLS | 0.196 | 0.196 |
| no-preference | Transferred bytes | 1,242,983.000 | 236,940.000 |
| no-preference | Main-thread task time (ms) | 1,533.296 | 1,457.772 |
| no-preference | Script time (ms) | 70.133 | 71.521 |
| no-preference | Long-task duration (ms) | 0.000 | 0.000 |
| no-preference | Alternate requests | 12.000 | 0.000 |

Startup completed transfer fell from 1,242,983 to 236,940 bytes (1,006,043 fewer).
Alternate-image requests fell from 12 to zero; a browser regression test verifies
that the first and second selections fetch exactly the selected photos. This
network result is the supported optimization claim. Timing values are exploratory:
this is a shared workstation, and some runs overlapped other browser checks.
Small timing changes must not be attributed entirely to this patch.

CLS remained variable (up to approximately 0.196 in these runs), above the 0.1
field target. This patch does not fix all layout shifts. Normal-motion task time
is higher than reduced-motion time; decorative animation remains a profiling
candidate. Main-thread task time is CDP TaskDuration, and long-task duration is
PerformanceObserver longtask duration; neither is Lighthouse TBT or field INP.
There is no Lighthouse score, real-device result, field p75 or ranking claim.

External fonts and Facebook are aborted for repeatability. The font fallback is
therefore the measured typography, not live font performance. All runs attempted
zero Facebook iframes initially and 11 while scrolling through video cards.
This measures lazy activation, not full external-player bytes, CPU or successful
playback. It does not justify facade implementation yet. Measure a deployed page
with third parties available before deciding; retain direct links and keyboard
controls if a facade is later introduced. Local video markup/controls and photo
switching are covered by smoke checks; live Facebook playback remains external.

## Reproduce

Follow [development setup and validation](CONTRIBUTING.md) to install the locked
dependencies and Chromium. This benchmark specifically uses port 8123. In one
terminal run `python3 -m http.server 8123 --bind 127.0.0.1`; in another run
`node scripts/measure-performance.mjs /tmp/performance-report.json`. Use the
baseline product tree for before and commit `23679d6` for after. The before tree
predates the benchmark script: run the same script from `23679d6` in each checkout,
with its locked dependencies available, so the working directory and served files
match the intended revision. The raw after report records the baseline SHA plus
an uncommitted product diff; `23679d6` contains that measured product change. Run
serially on an idle machine for a stronger timing comparison. Do not run a
benchmark against an unrelated process on port 8123. Output paths are explicit;
reports contain only synthetic local observations, no user analytics.

The later media-layout cleanup moved portraits into `assets/images/portraits/` and
updated the current script's alternate-request filter. The reports above retain
their measured paths. Use each recorded revision's script for this historical
comparison; use the current script when measuring the reorganized site.

The browser test first failed when eager requests occurred, then passed after
removing prefetch and the hidden `src`. At this experiment stage, 21 Node and 20
Chromium tests passed. Later verification belongs to its corresponding PR and
revision. Inspect mobile/desktop
screenshots when repeating. Field targets remain p75 LCP ≤2.5s, INP ≤200ms, CLS ≤0.1, pending enough
actual field data; local observations cannot establish them.


## Current diagnostic CLI

The historical results above remain scoped to their recorded revisions. For a new
baseline, serve the intended checkout and run these commands **serially**, with
no simultaneous browser tests or changes to served files:

```sh
node scripts/measure-performance.mjs --base-url http://127.0.0.1:8123/ --external=blocked --runs 3 --output /tmp/blocked.json
node scripts/measure-performance.mjs --base-url http://127.0.0.1:8123/ --external=live --runs 3 --output /tmp/live.json
```

The original positional output argument remains supported. Each command runs both
motion modes, three times by default, with the viewport, CPU and network conditions
above. Startup remains load + 8 seconds; scroll observes each player plus 8 seconds.
Reports separate startup/scroll request lists, bytes by origin, failed/pending
requests, font faces and rendered-font samples, layout-shift nodes/rectangles,
long tasks and CDP task/script duration. Bytes count completed requests by their
initiation phase; late startup completions are separately retained after scroll.
CLS stays the cumulative session-window maximum with phase-specific shift entries.

Cross-origin out-of-process iframes can be missing from page-target CDP bytes/CPU;
request-failure observations do not fill that gap. Live mode means requests are
allowed, not that external fonts or players successfully load. Read failures and
font status before interpreting results. Preserve raw temporary reports until their
findings are recorded in the matching PR, then remove them under the temporary-file
policy. No performance score or field CWV is inferred from these runs.
