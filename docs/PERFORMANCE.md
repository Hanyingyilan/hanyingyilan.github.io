# Performance measurement

## Retained optimization decision — 2026-11-01

Commit `23679d6` removed startup prefetch of 12 alternate portraits and the hidden
second portrait's initial `src`; selection now loads only the chosen photo. The
experiment compared baseline `1866a5e` with that change. Median completed startup
transfer fell from 1,242,983 to 236,940 bytes, and alternate-photo requests from 12
to zero. This supports the network-cost decision, not a causal timing/CWV claim.

Original [before](https://github.com/Hanyingyilan/hanyingyilan.github.io/blob/23679d6983d12397ccc972429f2fc4878f35f6c9/docs/performance/before.json)
and [after](https://github.com/Hanyingyilan/hanyingyilan.github.io/blob/23679d6983d12397ccc972429f2fc4878f35f6c9/docs/performance/after.json)
reports remain in Git history with exact revision/diff and six runs. Conditions:
Chromium 156.0.8078.4, Playwright 1.64.1, Node 25.4.0 on macOS, 390×844 DPR3,
4× CPU slowdown, 1.6 Mbps down / 750 kbps up / 150ms latency, fresh contexts,
load + 8 seconds, three runs per motion mode. External fonts/players were blocked;
some runs overlapped other work. Layout shifts remained variable and live player
cost was not measured. No facade decision follows from that experiment.

## Reproduce

Install dependencies and Chromium through [Contributing](CONTRIBUTING.md#local-work).
Serve the intended checkout with `python3 -m http.server 8123 --bind 127.0.0.1`,
then run measurements serially, on an idle machine without changing served files:

```sh
node scripts/measure-performance.mjs --base-url http://127.0.0.1:8123/ --external=blocked --runs 3 --output /tmp/blocked.json
node scripts/measure-performance.mjs --base-url http://127.0.0.1:8123/ --external=live --runs 3 --output /tmp/live.json
```

The positional output argument is also supported. Defaults use the mobile/network
conditions above, both motion modes, three runs each and a startup window of
load + 8 seconds. Scrolling visits each iframe for 150ms, then observes 8 seconds.
Use `--scroll-wait-ms 30000` for a longer bounded observation if requests remain
in flight. Do not reuse a port serving an unrelated checkout.

For the historical comparison, use the script/dependencies from `23679d6` in both
the baseline and after checkouts; that script predates the media-path reorganization.
Use the current script for new measurements. For remote URLs, independently identify
the deployed revision: report `commit`/`productDiff` describe the local CLI checkout.

## Reading results

- Reports separate startup/scroll requests, completed bytes by origin, failures,
  pending requests, font samples, layout shifts, long tasks and task/script time.
  Bytes are grouped by initiation phase; `startupRequestsAfterScroll` retains
  late startup completions. Inspect failures/pending requests before interpreting totals.
- Since the 2026-11-02 correction in [PR #31](https://github.com/Hanyingyilan/hanyingyilan.github.io/pull/31),
  capture includes cross-origin iframe targets and follows navigation across CDP
  sessions. Inspect `targetSetupErrors`; earlier reports measured page-target traffic only.
- Throttling applies per attached target, not as one shared mobile connection.
  Aggregate iframe throughput can exceed the nominal bandwidth.
- `taskMs`, `scriptMs` and long tasks describe the page main thread.
  `browserProcessCPU` separately measures isolated-browser process deltas, including
  background work and throttling overhead; exited processes may lack final CPU.
  Neither is per-iframe attribution, Lighthouse TBT or field INP.
- CLS is the cumulative session-window maximum; scroll LCP is not a new navigation
  metric. Live mode permits requests but does not prove fonts rendered or videos
  played. Check glyph samples and playback separately.

Keep raw reports temporary; share useful aggregates, environment and limitations
in the matching PR, then remove the files. Reports omit external query strings,
in-memory data URLs, headers, cookies and payloads. Field p75 targets remain
LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 when sufficient field data exists; local runs
establish neither field results nor search outcomes. [Search Console](SEARCH-CONSOLE.md)
owns availability of this site's field data.
