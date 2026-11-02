# Crawlability and AI-search checks

## Owner policy

On 2026-11-02 the owner explicitly permitted search crawling, AI citations and
model-training use. `User-agent: *` / `Allow: /` implements that choice. It permits
access without guaranteeing indexing or citation. The site serves the same complete
HTML to people and non-JavaScript clients; it has no alternate crawler pages.
[Content](CONTENT.md#machine-readable-policy-data-decision) owns the decision not
to add a separate public JSON API or `llms.txt`.

Before changing policy, recheck the relevant provider controls:
[Google AI features](https://developers.google.com/search/docs/appearance/ai-features),
[Bing webmaster guidance](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a),
and [OpenAI crawlers](https://developers.openai.com/api/docs/bots).
Search, user-triggered fetches, answer grounding and training have distinct controls.
The [November 1 provider review](https://github.com/Hanyingyilan/hanyingyilan.github.io/blob/36b4d817b84e41f9324c909ddc0005ce725df08e/docs/CRAWLABILITY.md)
is historical evidence, including Microsoft's announced 2027 transition; it is
not a current provider audit. No new directive is introduced by this cleanup.

## Reproducible checks

Start the [local server](CONTRIBUTING.md#local-work), then run:

```sh
node scripts/check-http.mjs http://127.0.0.1:8000/
```

The client runs no JavaScript. It checks root/index/query variants for all policy
records, original text, citations, source dates/status, publisher, H1, canonical,
Open Graph and category anchors. Category pages must contain their own policies,
sources and self-canonical; robots/sitemap must match the configured public URLs.
Expected values come from maintained data, including `content/site.json`.

For a Pages artifact or deployed site, add `--published`. This also requires each
manifest asset and 404s for retired previews, representative excluded files and
an unknown path. Repository-root serving cannot verify exclusions. Follow the
[release-output procedure](CONTRIBUTING.md#release-and-rollback) to build and serve
only the Jekyll output.

Record URL, time, deployment/source revision and actual assertions in the PR.
A production run must match the version deployed there. HTTP coverage establishes
neither the truth of policy claims nor the identity/behavior of an actual crawler.

## Observation procedure

[Search Console](SEARCH-CONSOLE.md) owns Google access and indexing observations.
Bing target-site access has not been established in the recorded review. An
owner can repeat equivalent checks there; lack of access or an empty search is
not proof that the site is unindexed.

For manual AI-answer comparisons, use neutral prompts such as:

- 「韓瑩提出的生育津貼及營養費是多少？請列出原文日期，區分提案與現行制度。」
- 「這份政見頁的發布單位是誰？哪些資料來源仍待查證？」
- 「重陽禮金試算依據哪一份提案？和市公所公告的日期及性質有何不同？」

Record time, product/version, language/location settings, exact prompt, cited URLs,
errors and whether dates/proposal status survive. Compare identical settings before
and after a release and inspect cited originals. Results are qualitative observations,
not ranking or causal evidence. Provider failures and login requirements must remain
visible in the record. Keep completed observations in the issue/PR, without visitor
preferences or personal data.
