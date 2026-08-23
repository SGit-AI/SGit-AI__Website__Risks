# Licences

This repository carries two licences, and which one applies depends on whether a file is code
or content. Stating the split explicitly is the standard resolution, and it is worth doing
because a reader who opens only `LICENSE` would reasonably conclude the whole repository —
documents included — is Apache 2.0.

> **Code** in this repository is licensed under the Apache License 2.0 (see `LICENSE`).
>
> **Documentation and written content** — the `.md` files under `briefs/`, the HTML pages, and
> the content of the `*.sgit.ai` websites — are licensed under the Creative Commons Attribution
> 4.0 International licence (CC BY 4.0), unless a specific document states otherwise.

## What that means here

| Path | Licence |
|---|---|
| `admin/build/*.py`, `admin/build/*.js`, `assets/*.js`, `assets/*.css`, `.github/workflows/*` | Apache License 2.0 |
| `briefs/*.md`, `briefs/*.csv`, `briefs/*.json`, `index.md`, `llms.txt`, `llms-full.txt`, `data/*.json`, every `*.html` page | CC BY 4.0 |

## The decision behind it

Per a decision of 21 August 2026, applied across the `*.sgit.ai` estate:

> Unless a document explicitly says otherwise, every `.md` file in the corpus was authored by
> Dinis Cruz and is released under CC BY 4.0. The same applies to the entire content of every
> `*.sgit.ai` website.

## Three limits specific to this site

**The prior art is CC0, not CC BY.** The eight risk articles on `docs.diniscruz.ai` (February –
July 2025, 59,131 words) were published under CC0. Republishing CC0 material under CC BY would
be legally fine, and this site does not do it: those articles are **cited, with their original
URLs and original publication dates**, because the historical link matters more than the licence
does. `/documents/index.html#prior-art` states the source licence per article.

**The upstream corpus is unpublished, so the version tag is the address.** The briefs this site
draws on live in `SGraph-AI__App__Send` under `team/humans/dinis_cruz/briefs/` and have no public
URL. Every citation on this site therefore gives a repository path **plus a version tag**
(`v0.33.62` for paths verified by the brief pack), which is the only thing that makes a claim
checkable by someone with access. Nearly every upstream brief carries a CC BY 4.0 release line at
its foot, which is what makes public republication straightforward at all.

**Third-party material quoted inside CC BY documents stays under its own terms.** Where a source
brief paraphrases published work by named researchers, the paraphrase is marked as such and the
researchers are named — see `/ladder/bridges.html`. Four manifest rows are marked do-not-publish
and appear nowhere in this repository; the pre-release gate fails the build if their distinctive
strings do. `/documents/index.html#not-here` states what was excluded and why.
