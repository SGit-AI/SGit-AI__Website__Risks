# risks.sgit.ai — the conceptual and research home for risk

Traditional risk management predicts the probability of a future event. This model asks a named
human to **underwrite an exposure that already exists** — insurance-style, with personal
accountability attached. From that single inversion everything else follows: if the risk is real
it cannot be denied, so **there is no deny button**; the only choice is *how long*, and **the
interval is the decision**, because each rung implies a specific operational response.

> **This is a research site. The concepts are argued, the worked examples are real graphs, and
> five vaults are live and browsable, and one worked example computes rather than argues.
> The engine is not built.** Greps for `risk_`,
> `RiskAcceptance`, `risk_register` and `riskmandate` across the implementing repository return
> zero matches. See [`/shipped/`](https://risks.sgit.ai/shipped/index.html).

Live site: https://risks.sgit.ai (GitHub Pages, deployed from `dev`).

## What this site does

1. **Consolidate the concepts.** ~496,000 words of risk thinking written 18 June – 22 August
   2026 across ~185 documents, plus a February pre-history — **42 distinct concepts**, most of
   them well developed, almost none of them previously reachable by a reader or an agent.
2. **Be the site riskmandate.ai references.** riskmandate.ai is commercial: pricing, demos,
   partners, the customer angle of getting risks accepted. The concepts live here, and the
   dependency runs one way — the commercial site cites the research site, never the reverse for
   a conceptual claim.
3. **Serve agents as a first-class audience.** The commission says it plainly: *"to handle the
   cases where I need agents to have a good understanding of some of those key concepts and
   ideas."* So `/data/concepts.json`, `/llms-full.txt` and 42 stable anchors are deliverables
   rather than courtesies, and CI enforces them.

## Structure

- `index.html` · `index.md` — the inversion in one screen, the honesty statement, the split
- `acceptance/` — the founding inversion: underwriting, no-deny, the interval ladder,
  unaccepted-is-critical, and the underwriting workflow
- `acceptable/` — accepted is not acceptable; appetite as a revealed band
- `ladder/` — the grounding ladder, node type formulas, bridges not merges, not-knowing-is-a-fact
- `register/` — the register as a graph of graphs, fractal registers, cascade and air gaps
- `blast-radius/` — authorization closure, CIA expansion, observability as a risk dimension
- `plug/` — who can pull the plug, the five-dimension profile, recoverability as the hard limit
- `practice/` — owners, altitude, the physical act, density, meta-risks, do-not-internalise
- `ramm/` — the maturity models, and an honest account of where they are underspecified
- `examples/` — four worked graphs, five live vaults, the ten scenarios, the plug register
- `concepts/` — all 42, one stable anchor each, maturity stated honestly
- `agents/` — the machine surface and the agent contract
- `shipped/` — what is argued, and what runs
- `origins/` — February 2026 orthodox GRC → the June inversion → the August formalisation
- `network/` — the eight-site boundary map, eight open questions, seven honest tensions
- `documents/` — the eleven sources, the tiering, and what is deliberately not published
- `briefs/` — those eleven source documents, verbatim, at stable constructed paths
- `data/concepts.json` — the definitions endpoint: 43 concepts as structured data
- `about/participant.html` — the disclosure, and five places this model loses
- `admin/` — engineering: comms (asks & tasks), versions, build tooling
- `admin/build/chrome.py` — the single definition of nav and footer, applied across every page
- `admin/build/validate.js` — the pre-release gate, ten checks
- `assets/site.css` — shared stylesheet (sgit.ai design language)

## The pipeline

Same as the sibling sites — `sgit.ai`, `pki.sgit.ai`, `graphs.sgit.ai`, `issues-fs.sgit.ai`:
**validate → tag → deploy**, in `.github/workflows/deploy-pages.yml`.

1. **validate** — `node admin/build/validate.js`. A failure stops the release: no tag, no
   publish. It also runs on pull requests, so branch work is gated before it reaches `dev`.
2. **tag-release** — every push to `dev` is a minor release, tagged `v{release}.{major}.{minor}`.
   The version is owned by `admin/build/version.txt` and must also appear in the release commit's
   subject as `site vX.Y.Z: …`. CI verifies the two agree and that the bump is the next minor,
   then tags the release commit — `HEAD` on a direct push, `HEAD`'s parent when a PR lands as a
   merge commit. The first run backfills tags for historical releases from commit subjects.
3. **deploy** — publishes the tagged commit to GitHub Pages.

### What the gate checks

1. Version agreement across every badge, the versions table, `llms.txt` and `index.md`
2. Internal links **and fragments** — every `#anchor` must resolve to an id in the target page
3. Canonical host agreement with `CNAME`
4. The agent surface — every section hub named in `llms.txt`; sitemap and tree agree both ways
5. **The definitions endpoint** — `data/concepts.json` parses, carries all 43 concepts with
   every required field, agrees with `version.txt`, and every concept has an anchor on `/concepts/`
6. **The over-claim tripwire** — no page may say the engine is built, shipping or installable
   (escape hatch: mark the element `data-not-built` to state a claim in order to correct it)
7. **The do-not-publish tripwire** — the four Tier-3 manifest rows may not appear in the tree
8. Key-leak tripwire — nothing may look like a vault key
9. `<div>` balance
10. Every page carries a "for an agent" block

## Release process

```
1. bump admin/build/version.txt (vX.Y.Z, exactly once per release)
   add a row to admin/versions.html; update admin/comms.html

2. python3 admin/build/chrome.py          # nav + footer + version, everywhere
   python3 admin/build/gen_sitemap.py     # sitemap.xml from the tree
   python3 admin/build/gen_llms_full.py   # the whole site in one file

3. node admin/build/validate.js           # the gate

4. git commit -am "site vX.Y.Z: ..." && git push origin dev
```

## Licence

Content is CC BY 4.0; build tooling is Apache 2.0. See `LICENSES.md`. The 2025 prior art on
`docs.diniscruz.ai` is CC0 at source and is **cited with its original URLs and dates rather than
republished** — the historical link matters more than the licence does.

⚠ **Participant disclosure:** published by the sgit project, which also builds riskmandate.ai —
the commercial product this research underpins.
