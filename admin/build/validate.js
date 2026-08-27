#!/usr/bin/env node
// risks.sgit.ai pre-release gate. Run from anywhere: node admin/build/validate.js
// Checks, in order:
//   1. version agreement — admin/build/version.txt vs every page's version badge,
//      the versions table, llms.txt and index.md
//   2. internal links — every relative href/src in every .html file resolves to a
//      file in the tree, AND every fragment resolves to an id in the target page.
//      The fragment half is site-specific: this site's promise to an agent is that
//      every one of the 43 concepts has a stable anchor. A promise that is checked
//      is a fact; a promise that is remembered is a hope.
//   3. canonical host — every <link rel="canonical"> and og:url points at the host
//      in CNAME, and every page declares one
//   4. the agent surface — every section hub is named in llms.txt, and the sitemap
//      and the tree agree in both directions. The commissioned audience for this
//      site is agents, so a page missing from llms.txt is, for the reader this site
//      was built for, a page that does not exist.
//   5. the definitions endpoint — data/concepts.json parses, carries all 43 concepts,
//      every one has a matching anchor on /concepts/, and every one declares an
//      `origin` of either `corpus` or `authored-here`. That second field matters: a
//      research site that consolidates a corpus and quietly adds to it is no longer
//      reporting the corpus, so provenance is enforced rather than remembered.
//   6. the over-claim tripwire — NOTHING in the risk corpus is implemented in code.
//      No page may say the engine is built, shipping or installable. A page may
//      state the claim in order to correct it by marking the element data-not-built.
//   7. the do-not-publish tripwire — four manifest rows are Tier-3 (a competitive
//      vendor assessment, a competitor map, investor figures, a contract draft).
//      Their distinctive strings must never appear in the tree — briefs/ included,
//      which is why the published pack carries redactions and a PUBLIC.md recording them.
//   8. credential tripwire — this site publishes a vault READ key on purpose, so the
//      rule is precise rather than strict: a 64-hex read key passes, and a write
//      credential (by prefix, or a passphrase joined to a vault id) fails the build.
//   9. div balance — every page opens and closes the same number of <div>s. A
//      <div class="note"> closed with </p> is accepted silently by browsers and
//      runs the note's left border down the rest of the page.
//  10. every page ends with an agent block — the house rule is that each page serves
//      three readers and the third is an agent carrying the definition into another
//      session. On this site that reader is the commission, so it is checked rather
//      than remembered. Reader pages under documents/ and admin/ are exempt.
// Any failure exits 1: no tag, no publish.
'use strict';
const fs   = require('fs');
const path = require('path');

const ROOT   = path.resolve(__dirname, '..', '..');
const errors = [];

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '.git' || name === '.github' || name === 'node_modules' || name === '.sg_vault') continue;
    const p  = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files     = walk(ROOT);
const htmlFiles = files.filter(f => f.endsWith('.html'));
const rel       = f => path.relative(ROOT, f).split(path.sep).join('/');

// --- 1. version agreement -------------------------------------------------
const VERSION = fs.readFileSync(path.join(ROOT, 'admin/build/version.txt'), 'utf8').trim();
if (!/^v\d+\.\d+\.\d+$/.test(VERSION)) {
  errors.push(`version.txt does not carry a vX.Y.Z version: "${VERSION}"`);
}
for (const f of htmlFiles) {
  const t = fs.readFileSync(f, 'utf8');
  const badges = [...t.matchAll(/class="ver"[^>]*>(v\d+\.\d+\.\d+)</g)].map(m => m[1]);
  for (const b of badges) if (b !== VERSION) {
    errors.push(`${rel(f)}: version badge ${b} != ${VERSION}`);
  }
}
for (const extra of ['llms.txt', 'index.md']) {
  const t = fs.readFileSync(path.join(ROOT, extra), 'utf8');
  if (!t.includes(VERSION)) errors.push(`${extra} does not mention ${VERSION}`);
}
const versTable = fs.readFileSync(path.join(ROOT, 'admin/versions.html'), 'utf8');
if (!versTable.includes(`class="vnum">${VERSION}<`)) {
  errors.push(`admin/versions.html has no row for ${VERSION}`);
}
// each release appears exactly once — a blanket version-bump sed that touches the
// history table produces duplicates, which shipped once on the NHI site
const rows = [...versTable.matchAll(/class="vnum">(v\d+\.\d+\.\d+)</g)].map(m => m[1]);
for (const v of rows) if (rows.filter(x => x === v).length > 1) {
  errors.push(`admin/versions.html lists ${v} more than once`);
  break;
}

// --- 2. internal links, target AND fragment -------------------------------
const idsOf = (() => {
  const cache = new Map();
  return file => {
    if (!cache.has(file)) {
      const t = fs.readFileSync(file, 'utf8');
      cache.set(file, new Set([
        ...[...t.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]),
        ...[...t.matchAll(/\bname="([^"]+)"/g)].map(m => m[1]),
      ]));
    }
    return cache.get(file);
  };
})();
for (const f of htmlFiles) {
  const t   = fs.readFileSync(f, 'utf8');
  const dir = path.dirname(f);
  for (const m of t.matchAll(/(?:href|src|data-src)="([^"]+)"/g)) {
    const raw = m[1];
    if (/^(https?:|mailto:|data:|\/\/)/.test(raw) || raw === '') continue;
    const hash   = raw.indexOf('#');
    const target = hash === -1 ? raw : raw.slice(0, hash);
    const frag   = hash === -1 ? ''  : raw.slice(hash + 1);
    const abs    = target === '' ? f : path.resolve(dir, target);
    if (target !== '' && !fs.existsSync(abs)) {
      errors.push(`${rel(f)}: broken link -> ${raw}`);
      continue;
    }
    if (frag && abs.endsWith('.html') && !idsOf(abs).has(frag)) {
      errors.push(`${rel(f)}: link -> ${raw} has no anchor #${frag} in ${rel(abs)}`);
    }
  }
}

// --- 3. canonical host ----------------------------------------------------
const HOST = fs.readFileSync(path.join(ROOT, 'CNAME'), 'utf8').trim();
if (!/^[a-z0-9.-]+$/.test(HOST)) errors.push(`CNAME does not carry a hostname: "${HOST}"`);
for (const f of htmlFiles) {
  const t = fs.readFileSync(f, 'utf8');
  const claimed = [
    ...[...t.matchAll(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/g)].map(m => m[1]),
    ...[...t.matchAll(/<meta[^>]+property="og:url"[^>]+content="([^"]+)"/g)].map(m => m[1]),
  ];
  for (const url of claimed) if (!url.startsWith(`https://${HOST}/`)) {
    errors.push(`${rel(f)}: canonical/og:url is not on ${HOST} -> ${url}`);
  }
  if (!/rel="canonical"/.test(t)) errors.push(`${rel(f)}: no canonical link`);
}

// --- 4. the agent surface -------------------------------------------------
const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
const hubs = htmlFiles.map(rel).filter(p => p.endsWith('/index.html') && p.split('/').length === 2);
for (const h of hubs) if (!llms.includes(h)) {
  errors.push(`llms.txt does not name the section hub /${h} — for an agent that page does not exist`);
}
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const listed  = [...sitemap.matchAll(new RegExp(`<loc>https://${HOST}/([^<]+)</loc>`, 'g'))].map(m => m[1]);
for (const p of listed) if (!fs.existsSync(path.join(ROOT, p))) {
  errors.push(`sitemap.xml lists a page that does not exist: /${p}`);
}
for (const f of htmlFiles) if (!listed.includes(rel(f))) {
  errors.push(`sitemap.xml is missing ${rel(f)}`);
}

// --- 5. the definitions endpoint ------------------------------------------
// 43 concepts, one anchor each, addressable. The brief calls this "the single
// highest-value thing this site can ship", so the gate owns it: the JSON and the
// human page cannot drift apart without failing the release.
const CONCEPT_COUNT = 43;
let concepts = null;
try {
  concepts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/concepts.json'), 'utf8'));
} catch (e) {
  errors.push(`data/concepts.json does not parse: ${e.message}`);
}
if (concepts) {
  const list = concepts.concepts || [];
  if (list.length !== CONCEPT_COUNT) {
    errors.push(`data/concepts.json carries ${list.length} concepts, expected ${CONCEPT_COUNT}`);
  }
  if (concepts.site_version && concepts.site_version !== VERSION) {
    errors.push(`data/concepts.json says ${concepts.site_version}, version.txt says ${VERSION}`);
  }
  const anchors = idsOf(path.join(ROOT, 'concepts/index.html'));
  const REQUIRED = ['id', 'name', 'definition', 'maturity', 'source', 'page', 'origin'];
  const ORIGINS = ['corpus', 'authored-here'];
  for (const c of list) {
    for (const k of REQUIRED) if (!c[k]) {
      errors.push(`data/concepts.json: ${c.id || '(no id)'} is missing "${k}"`);
    }
    if (c.origin && !ORIGINS.includes(c.origin)) {
      errors.push(`data/concepts.json: ${c.id} has origin "${c.origin}" — must be one of ${ORIGINS.join(', ')}`);
    }
    if (c.id && !anchors.has(c.id.toLowerCase())) {
      errors.push(`data/concepts.json: ${c.id} has no anchor #${String(c.id).toLowerCase()} on /concepts/index.html`);
    }
  }
}

// --- 6. the over-claim tripwire -------------------------------------------
// Greps for risk_, RiskAcceptance, risk_register and riskmandate across the
// implementing repository return zero. The Librarian's own reality file says
// "Do not describe any of these as existing features." A research site that
// implies otherwise poisons the network's credibility, so the gate holds the line.
// An element marked data-not-built is stating the claim in order to deny it.
const OVERCLAIMS = [
  { re: /\b(risk (engine|register|acceptance|mandate)|the engine)\b[^<.]{0,50}\b(is (built|implemented|shipping|live|running|in production)|ships|has shipped|is available)\b/i,
    why: 'nothing in the risk corpus is implemented — the engine is not built' },
  { re: /\b(pip|npm|uv) install\b[^<]{0,40}\brisk/i,
    why: 'there is no installable risk package' },
  { re: /\b(RiskAcceptance|risk_register|risk_acceptance)\b[^<]{0,30}\b(class|API|endpoint|module|service)\b/i,
    why: 'those symbols do not exist in any repository — the grep returns zero' },
];
for (const f of htmlFiles) {
  const t = fs.readFileSync(f, 'utf8');
  const stripped = t.replace(/<([a-z]+)[^>]*\bdata-not-built\b[^>]*>[\s\S]*?<\/\1>/g, '');
  for (const c of OVERCLAIMS) if (c.re.test(stripped)) {
    errors.push(`${rel(f)}: over-claims implementation — ${c.why} ` +
                `(mark the element data-not-built if you are stating the claim in order to correct it)`);
  }
}

// --- 7. the do-not-publish tripwire ---------------------------------------
// Four manifest rows are Tier-3. They are in the manifest so the builder knows to
// skip them, and they are here so a later edit cannot quietly reintroduce one.
const TIER3 = [
  { re: /\bPalantir\b/i,          why: 'OSMM Assessment 001 is Tier-3: legal read and right of reply required' },
  { re: /\bScrydon\b/i,           why: 'OSMM Assessment 001 is Tier-3: names a real startup critically' },
  { re: /\bServiceNow\b/i,        why: 'the competitor map is Tier-3, internal only' },
  { re: /glorified registers/i,   why: 'competitor-map quote, Tier-3, internal only' },
  { re: /\b(profit split|implied valuation)\b/i,
    why: 'commercial terms from the contract draft / investment brief are Tier-3, internal only' },
];
for (const f of files) {
  if (/\.(png|jpg|jpeg|gif|webp|ico|woff2?|zip|svg|pdf)$/.test(f)) continue;
  const r = rel(f);
  // Only this file is exempt, because it carries the patterns. briefs/ is NOT exempt:
  // the pack was written as a working document and names the four Tier-3 sources so the
  // builder knows to skip them, which is correct for a working document and wrong for a
  // published one. The pack is published with those names redacted in place and every
  // redaction recorded in briefs/PUBLIC.md — so the rule holds across the whole tree.
  if (r === 'admin/build/validate.js') continue;
  const t = fs.readFileSync(f, 'utf8');
  for (const c of TIER3) if (c.re.test(t)) {
    errors.push(`${r}: names Tier-3 do-not-publish material — ${c.why}`);
  }
}

// --- 8. key-leak tripwire -------------------------------------------------
// This site PUBLISHES a vault read key on purpose (/examples/execution-boundary/), so the
// rule cannot be "nothing key-shaped". It has to be precise instead of stricter — the same
// correction sgit.ai had to make when its own tripwire banned the string it needed in order
// to teach people to recognise it. A read key is 64 hex characters and cannot become write
// access; anything else before a colon is a passphrase, which means write.
const WRITE_CRED = [
  { re: /sgit_(?:vk1|private_vault)_[A-Za-z0-9_-]{8,}/,
    why: 'a vault (write) credential prefix' },
  { re: /[A-Za-z0-9_-]{20,}:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
    why: 'a passphrase joined to a uuid-shaped vault id' },
];
for (const f of files) {
  if (/\.(png|jpg|jpeg|gif|webp|ico|woff2?|zip|svg|pdf)$/.test(f)) continue;
  const r = rel(f);
  if (r === 'admin/build/validate.js') continue;   // this file carries the patterns
  const t = fs.readFileSync(f, 'utf8');
  for (const c of WRITE_CRED) {
    const m = t.match(c.re);
    if (m) errors.push(`${r}: contains ${c.why} — write credentials are never published`);
  }
  // A bare passphrase:vault_id is the older credential shape and it carries write access.
  // A read key is 64 hex characters — with or without one of the published read-key
  // prefixes. Anything else before the colon is a passphrase, and a passphrase is a
  // write credential no matter what the surrounding prose calls it.
  //
  // This check has fired in anger. Building the execution-boundary example, the
  // vault-viewer link was pasted in as given — and as given it was the vault key, three
  // times on one page. The gate caught all three before the commit. That is the whole
  // reason the rule is a pattern in a build script rather than a paragraph in a README.
  const READ_KEY = /^(?:sgit_rk1_|sgit_private_read_|sgit_public_read_)?[0-9a-f]{64}$/;
  for (const m of t.matchAll(/\b([A-Za-z0-9_-]{20,}):([a-z0-9]{6,12})\b/g)) {
    if (READ_KEY.test(m[1])) continue;                      // a read key — publishable
    if (/[;{}]/.test(t.slice(Math.max(0, m.index - 60), m.index + 60))) continue; // css/js noise
    errors.push(`${r}: "${m[1].slice(0, 12)}…:${m[2]}" looks like a passphrase joined to a ` +
                `vault id — if it is a read key it must be 64 hex characters`);
  }
}

// --- 9. div balance -------------------------------------------------------
for (const f of htmlFiles) {
  const t     = fs.readFileSync(f, 'utf8');
  const open  = (t.match(/<div\b/g)   || []).length;
  const close = (t.match(/<\/div>/g)  || []).length;
  if (open !== close) {
    errors.push(`${rel(f)}: ${open} <div> vs ${close} </div> — a block is not closed`);
  }
}

// --- 10. every page ends with an agent block ------------------------------
for (const f of htmlFiles) {
  const r = rel(f);
  if (r.startsWith('documents/') || r.startsWith('admin/') || r === 'about/participant.html') continue;
  const t = fs.readFileSync(f, 'utf8');
  if (!/class="agent"/.test(t)) {
    errors.push(`${r}: no "for an agent" block — every page on this site owes one ` +
                `(agents are the commissioned audience here)`);
  }
}

// --- report ---------------------------------------------------------------
if (errors.length) {
  console.error(`validate: ${errors.length} error(s)`);
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
}
console.log(`validate: OK — ${VERSION} on ${HOST}, ${htmlFiles.length} pages, ` +
            `${hubs.length} hubs in llms.txt, sitemap agrees, links and anchors resolve, ` +
            `${CONCEPT_COUNT} concepts addressable, blocks balanced, every page carries an ` +
            `agent block, no implementation over-claims, no Tier-3 material, no key-shaped strings`);
