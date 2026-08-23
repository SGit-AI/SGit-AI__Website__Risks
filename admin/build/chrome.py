#!/usr/bin/env python3
"""The single definition of this site's nav and footer, and the tool that applies it.

Run from anywhere: python3 admin/build/chrome.py

Every page is hand-written static HTML — that stays true, because a human should be
able to open any file and edit it. What is NOT hand-maintained is the chrome: the nav
row (including the version badge that validate.js requires to agree everywhere) and
the footer columns. Those are defined once here and rewritten in place across the
tree, which is what stops a thirty-page site from drifting.

Adding a page: add it to NAV or FOOTER if it belongs there, write the file with any
nav/footer block at all, then run this. The block contents are replaced; the `here`
state is set from the page's own path.
"""
import re
import sys
from pathlib import Path

ROOT    = Path(__file__).resolve().parents[2]
VERSION = (ROOT / "admin/build/version.txt").read_text().strip()
GH      = "https://github.com/SGit-AI/SGit-AI__Website__Risks"
PARENT  = "https://sgit.ai"
PARENT_TITLE = ("sgit.ai — the parent project: vaults, publishing and the catalogue. "
                "This site is the estate's conceptual home for risk")

# The nav, two levels. Each entry is (label, own page, [(sub-label, href), ...], (path prefixes)).
#
# Two rules the structure has to keep:
#   · A group label is always a link to a real page, never a menu-only stub. Nothing on
#     this site should be reachable only by opening a dropdown.
#   · `prefixes` decides the "here" state, so a page that is not itself in the nav still
#     lights up the group it belongs to.
#
# The order is the teaching order from the brief: the founding inversion first, then the
# machinery that makes it computable, then the exposure it is applied to, then the proof,
# then the surface built for the reader this site was commissioned for.
NAV = [
    ("Acceptance", "acceptance/index.html", [
        ("The founding inversion", "acceptance/index.html"),
        ("Underwriting, not prediction", "acceptance/underwriting.html"),
        ("There is no deny button", "acceptance/no-deny.html"),
        ("The interval ladder", "acceptance/the-ladder.html"),
        ("Unaccepted is critical", "acceptance/unaccepted-is-critical.html"),
        ("Who underwrites, and how it flows up", "acceptance/workflow.html"),
        ("Accepted is not acceptable", "acceptable/index.html"),
        ("Appetite as a revealed band", "acceptable/appetite.html"),
    ], ("acceptance/", "acceptable/")),
    ("The model", "ladder/index.html", [
        ("The grounding ladder", "ladder/index.html"),
        ("Node type formulas", "ladder/formulas.html"),
        ("Bridges, not merges", "ladder/bridges.html"),
        ("Not knowing is a fact", "ladder/absence.html"),
        ("The register as a graph of graphs", "register/index.html"),
    ], ("ladder/", "register/")),
    ("The exposure", "plug/index.html", [
        ("Who can pull the plug", "plug/index.html"),
        ("Recoverability: the hard limit", "plug/recoverability.html"),
        ("Blast radius &amp; authorization closure", "blast-radius/index.html"),
        ("Practice: owners, altitude, meta-risks", "practice/index.html"),
        ("RAMM and the maturity models", "ramm/index.html"),
    ], ("plug/", "blast-radius/", "practice/", "ramm/")),
    ("The proof", "examples/index.html", [
        ("Three worked graphs", "examples/index.html"),
        ("The 2FA instance graph", "examples/2fa.html"),
        ("The browser-isolation case", "examples/browser-isolation.html"),
        ("Article 26(5): fact to board", "examples/article-26-5.html"),
        ("The four live vaults", "examples/vaults.html"),
        ("The ten scenarios", "examples/scenarios.html"),
        ("The plug register", "examples/plug-register.html"),
    ], ("examples/",)),
    ("For agents", "agents/index.html", [
        ("The machine surface", "agents/index.html"),
        ("All 42 concepts, addressable", "concepts/index.html"),
        ("What is argued, what runs", "shipped/index.html"),
        ("llms.txt", "llms.txt"),
    ], ("agents/", "concepts/", "shipped/")),
    ("Site", "network/index.html", [
        ("The network: where the boundaries are", "network/index.html"),
        ("Origins: February to August 2026", "origins/index.html"),
        ("The documents", "documents/index.html"),
        ("Comms: asks &amp; tasks", "admin/comms.html"),
        ("Release history", "admin/versions.html"),
        ("Admin &amp; engineering", "admin/index.html"),
        ("Where we lose", "about/participant.html"),
    ], ("network/", "origins/", "documents/", "admin/", "about/")),
]

FOOTER = [
    ("Start here", [
        ("&#8594; The founding inversion", "acceptance/index.html"),
        ("There is no deny button", "acceptance/no-deny.html"),
        ("The interval ladder", "acceptance/the-ladder.html"),
        ("Accepted is not acceptable", "acceptable/index.html"),
        ("The grounding ladder", "ladder/index.html"),
    ]),
    ("For agents", [
        ("&#8594; The machine surface", "agents/index.html"),
        ("All 42 concepts", "concepts/index.html"),
        ("concepts.json — the definitions", "data/concepts.json"),
        ("llms.txt", "llms.txt"),
        ("llms-full.txt", "llms-full.txt"),
    ]),
    ("The proof", [
        ("Three worked graphs", "examples/index.html"),
        ("The four live vaults", "examples/vaults.html"),
        ("The 2FA instance graph", "examples/2fa.html"),
        ("Article 26(5): fact to board", "examples/article-26-5.html"),
        ("What is argued, what runs", "shipped/index.html"),
    ]),
    ("Site", [
        ("The network", "network/index.html"),
        ("Origins", "origins/index.html"),
        ("The documents", "documents/index.html"),
        ("Comms: asks &amp; tasks", "admin/comms.html"),
        ("Release history", "admin/versions.html"),
        ("Where we lose", "about/participant.html"),
    ]),
]

BLURB = ("The conceptual and research home for risk in the sgit.ai estate: what a risk is, "
         "what acceptance is, and why it is modelled this way. "
         "<a href=\"https://riskmandate.ai\" style=\"display:inline;padding:0\">riskmandate.ai</a> "
         "answers how you get your risks accepted and what it costs; this site answers why the "
         "model has the shape it has. <b>Nothing here is implemented in code</b> — "
         "<a href=\"{up}shipped/index.html\" style=\"display:inline;padding:0\">/shipped/</a> says so "
         "plainly. Part of the "
         "<a href=\"https://sgit.ai\" style=\"display:inline;padding:0\"><b>sgit.ai</b></a> "
         "network. All content CC BY 4.0 unless a page states otherwise.")
PARTNOTE = ('⚠ Participant disclosure: published by the sgit project, which also builds '
            'riskmandate.ai — the commercial product this research underpins. '
            '<a href="{up}about/participant.html" style="display:inline;padding:0">'
            'Read the disclosure</a>.')
PARTNOTE_SELF = ('⚠ Participant disclosure: published by the sgit project, which also builds '
                 'riskmandate.ai. You are on the disclosure page.')
NETLINE = ('<a href="https://sgit.ai"><b>↗ sgit.ai</b></a> — the parent project · '
           '<a href="https://riskmandate.ai">↗ riskmandate.ai</a> — the product · '
           '<a href="https://graphs.sgit.ai">↗ graphs.sgit.ai</a> — the graph machinery · '
           '<a href="https://nhi.sgit.ai">↗ nhi.sgit.ai</a> · '
           '<a href="https://pki.sgit.ai">↗ pki.sgit.ai</a> · '
           '<a href="https://sgit.ai/network/index.html">↗ the network</a>')


def nav_html(rel, up):
    groups = []
    for label, own, subs, prefixes in NAV:
        active = rel == own or any(rel.startswith(pre) for pre in prefixes)
        links = "\n".join(
            f'      <a class="sl{" here" if href == rel else ""}" href="{up}{href}">{text}</a>'
            for text, href in subs)
        groups.append(
            f'    <div class="ni ni-has">\n'
            f'      <a class="nl{" here" if active else ""}" href="{up}{own}">{label}'
            f'<span class="caret">&#9662;</span></a>\n'
            f'      <div class="sub">\n{links}\n      </div>\n'
            f'    </div>')
    rows = "\n".join(groups)
    return (f'<nav class="site"><div class="row">\n'
            f'  <a class="brand" href="{up}index.html">risks<span>.sgit.ai</span></a>\n'
            f'  <a class="parent" href="{PARENT}" title="{PARENT_TITLE}">↗ part of <b>sgit.ai</b></a>\n'
            f'  <span class="stage-pill">research site</span>\n'
            f'  <a class="ver" href="{up}admin/versions.html" title="Site release history">{VERSION}</a>\n'
            f'  <button class="nav-toggle" type="button" aria-expanded="false" aria-label="Menu">Menu</button>\n'
            f'  <div class="nav-items">\n{rows}\n  </div>\n'
            f'  <a class="gh" href="{GH}">★ GitHub</a>\n'
            f'  <script src="{up}assets/nav.js" defer></script>\n'
            f'</div></nav>')


def footer_html(rel, up):
    partnote = PARTNOTE_SELF if rel == "about/participant.html" else PARTNOTE.format(up=up)
    md_twin  = f' · <a href="{up}index.md">this page as markdown</a>' if rel == "index.html" else ""
    cols = "\n".join(
        "  <div>\n"
        f"    <h4>{head}</h4>\n"
        + "\n".join(f'    <a href="{l if l.startswith("http") else up + l}">{t}</a>' for t, l in links)
        + "\n  </div>"
        for head, links in FOOTER)
    return (f'<footer class="site"><div class="cols">\n'
            f'  <div>\n'
            f'    <div class="brandline">risks<span>.sgit.ai</span></div>\n'
            f'    <p>{BLURB.format(up=up)}</p>\n'
            f'    <p class="netline">{NETLINE}</p>\n'
            f'    <p class="partnote">{partnote}</p>\n'
            f'    <p class="verline">site <a href="{up}admin/versions.html">{VERSION}</a> · '
            f'<a href="{up}admin/index.html">engineering</a>{md_twin}</p>\n'
            f'  </div>\n{cols}\n</div></footer>')


def stamp_text_twins():
    """The version also appears in llms.txt, index.md and the definitions endpoint, and
    validate.js enforces that they agree. Nothing used to SET it there, so it was
    hand-edited every release — and hand-editing it silently missed twice on a sibling
    site. Own it here instead."""
    out = []
    llms = ROOT / "llms.txt"
    if llms.exists():
        t = llms.read_text()
        t2, n = re.subn(r"Site version: v\d+\.\d+\.\d+", f"Site version: {VERSION}", t, count=1)
        if n and t2 != t:
            llms.write_text(t2)
            out.append("llms.txt")
    md = ROOT / "index.md"
    if md.exists():
        t = md.read_text()
        t2, n = re.subn(r"· site v\d+\.\d+\.\d+ ·", f"· site {VERSION} ·", t, count=1)
        if n and t2 != t:
            md.write_text(t2)
            out.append("index.md")
    cj = ROOT / "data/concepts.json"
    if cj.exists():
        t = cj.read_text()
        t2, n = re.subn(r'"site_version": "v\d+\.\d+\.\d+"',
                        f'"site_version": "{VERSION}"', t, count=1)
        if n and t2 != t:
            cj.write_text(t2)
            out.append("data/concepts.json")
    ac = ROOT / ".well-known/agent-content.json"
    if ac.exists():
        t = ac.read_text()
        t2, n = re.subn(r'"site_version": "v\d+\.\d+\.\d+"',
                        f'"site_version": "{VERSION}"', t, count=1)
        if n and t2 != t:
            ac.write_text(t2)
            out.append(".well-known/agent-content.json")
    return out


def main():
    changed = []
    for path in sorted(ROOT.rglob("*.html")):
        if ".git" in path.parts:
            continue
        rel  = path.relative_to(ROOT).as_posix()
        up   = "../" * (len(path.relative_to(ROOT).parts) - 1)
        text = path.read_text()
        before = text
        text, n_nav  = re.subn(r'<nav class="site">.*?</nav>', lambda _: nav_html(rel, up),
                               text, count=1, flags=re.S)
        text, n_foot = re.subn(r'<footer class="site">.*?</footer>', lambda _: footer_html(rel, up),
                               text, count=1, flags=re.S)
        if not n_nav or not n_foot:
            missing = " and ".join(x for x in (("nav" if not n_nav else ""),
                                               ("footer" if not n_foot else "")) if x)
            print(f"  ! {rel}: missing {missing} block", file=sys.stderr)
        if text != before:
            path.write_text(text)
            changed.append(rel)
    changed += stamp_text_twins()
    print(f"chrome: {VERSION} applied — {len(changed)} file(s) updated")
    for c in changed:
        print(f"  · {c}")


if __name__ == "__main__":
    try:
        main()
    except BrokenPipeError:
        sys.stdout = None
