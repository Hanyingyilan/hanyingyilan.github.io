# Crawlability and AI-search checks — 2026-11-01

The integrated fork source serves the same complete, source-attributed HTML to
people and non-JavaScript HTTP clients. It does not add hidden text, alternate crawler pages,
`llms.txt`, speculative schema or a promise of AI citations. Existing permissive
`robots.txt` is unchanged. Search access and model-training preferences are
separate owner choices; this task does not silently choose a new policy.

## Official guidance reviewed on 2026-11-01

This is a dated guidance record. Recheck the linked provider documentation before
changing crawler policy; no provider controls were revalidated by the docs cleanup.
The table records the policy at inspection. Preview experiments were subsequently
retired; [Architecture](ARCHITECTURE.md#publishing-and-crawlers) owns current publication behavior.

| System | What the control means | Application here |
| --- | --- | --- |
| Google Search / AI features | Normal search eligibility and snippets apply; no special AI markup required, and indexing is not guaranteed | Keep substantive HTML, source links, canonical and preview noindex; verify actual indexing with owner access |
| Bing / Copilot | Crawl access and indexing controls differ from controls for use in generated answers | Retain current policy; owner should review training and grounding choices separately |
| OpenAI | OAI-SearchBot is for search, GPTBot for possible model-training use; their controls are independent. ChatGPT-User is user-triggered and robots rules may not apply | Do not treat allowing search as a new training-policy decision; keep current robots pending an explicit owner choice |

Sources: [Google AI features](https://developers.google.com/search/docs/appearance/ai-features),
[Bing webmaster guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a),
[OpenAI crawler documentation](https://developers.openai.com/api/docs/bots).

Microsoft's [October 30, 2026 announcement](https://www.bing.com/webmasters/help/new-ai-preferences-2t1cc16d)
describes future separate AI Training/AI Grounding preferences, with honoring
beginning February 1, 2027 as content is recrawled. These are not a live change to
this site's policy on November 1. Existing [NoArchive/NoCache guidance](https://blogs.bing.com/webmaster/2023/9/Announcing-new-options-for-webmasters-to-control-usage-of-their-content-in-Bing-Chat/)
and its migration timetable need owner review if this site survives the campaign.
The full help page was read in a JavaScript-enabled browser. AITraining can be
expressed in robots.txt with page overrides; AIGrounding is page-level. Neither
overrides a crawl block. These future controls are recorded for owner review; no
new directive is installed.

## Reproducible checks

Start the [local server](CONTRIBUTING.md#local-work), then run from the repository root:

```sh
node scripts/check-http.mjs http://127.0.0.1:8000/
```

This client does not run JavaScript. It checks root, index and query variants for
all 23 unique policy articles, every title/detail/original attribution, citation
anchors, source links/dates/status, publisher, one text H1, unique production canonical, Open Graph and category anchors. It also checks the
robots and sitemap responses. Retired preview pages are no longer expected to return 200.
Negative Node tests remove a policy or citation and require failure. These checks
establish response-HTML coverage, not the truth of unverified sources or the
identity of an actual crawler.

For a Pages-compatible artifact or a deployed site, add `--published`. It also
fetches every public manifest asset and requires 404 for retired previews,
representative excluded files and an unknown path. The default local mode works
with a repository-root server; it does not assert exclusion. Expected canonical,
Open Graph origin and crawler URLs always come from `content/site.json`, even
when the test server uses a different origin.

Run the published mode against production only after this stack is approved and
actually deployed upstream. It will intentionally fail if production still serves
older content. Record URL, timestamp, response status, deployment commit and
which assertions passed; keep local and deployed results separate. Follow the
[release-output procedure](CONTRIBUTING.md#release-and-rollback) for Jekyll exclusions
and deployed status checks; HTTP content coverage alone does not establish them.

## Owner and observation work still pending

[SEARCH-CONSOLE.md](SEARCH-CONSOLE.md) records unavailable target-property access.
Bing Webmaster Tools target-site access has not been established. An authorized
owner should apply the [Search Console URL observation procedure](SEARCH-CONSOLE.md#baseline-and-follow-up-record)
and record equivalent Bing observations after deployment. Do not infer “not indexed”
from lack of access, an empty web search, or a local test. No live indexing or AI-answer
comparison was performed for this fork implementation.

Use a small neutral question set for manual before/after observations:

- 「韓瑩提出的生育津貼及營養費是多少？請列出原文日期，區分提案與現行制度。」
- 「這份政見頁的發布單位是誰？哪些資料來源仍待查證？」
- 「重陽禮金試算依據哪一份提案？和市公所公告的日期及性質有何不同？」

For each, record date/time, product/version, language/location settings, exact
question, cited URLs, whether publication/review dates and proposal status were
preserved, and errors/limitations. Use identical prompts/settings before and after
an actual release. Human reviewers must check cited originals, not just answer
fluency. Do not collect individual visitors' political preferences. A few answers
are qualitative observations, not ranking measurements or causal evidence.

Record HTTP results and environment with the matching native/browser checks in
the PR or final work report. Local evidence does not establish actual crawler
identity or indexing.
