#!/usr/bin/env python3
"""Generates sitemap.xml from the file tree.

Run from anywhere: python3 admin/build/gen_sitemap.py

validate.js already requires the sitemap and the tree to agree in both directions;
generating the sitemap removes the only way they could ever disagree. Dates come from
the last commit that touched each file, so a page's lastmod is a fact about the page
rather than the date of the build.
"""
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HOST = (ROOT / "CNAME").read_text().strip()
SKIP_DIRS = {".git", ".github", "node_modules", "assets"}


def last_commit(rel):
    r = subprocess.run(["git", "log", "-1", "--format=%ad", "--date=short", "--", rel],
                       cwd=ROOT, capture_output=True, text=True)
    return r.stdout.strip() or subprocess.run(
        ["git", "log", "-1", "--format=%ad", "--date=short"],
        cwd=ROOT, capture_output=True, text=True).stdout.strip() or "2026-08-23"


def main():
    pages = []
    for p in sorted(ROOT.rglob("*.html")):
        rel = p.relative_to(ROOT).as_posix()
        if rel.split("/")[0] in SKIP_DIRS:
            continue
        pages.append(rel)

    # the front page first, then the rest alphabetically
    rows = "\n".join(
        f"  <url><loc>https://{HOST}/{r}</loc><lastmod>{last_commit(r)}</lastmod></url>"
        for r in sorted(set(pages), key=lambda r: (0 if r == "index.html" else 1, r)))
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{rows}\n</urlset>\n")
    print(f"gen_sitemap: {len(set(pages))} page(s)")


if __name__ == "__main__":
    main()
