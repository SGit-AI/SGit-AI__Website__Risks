# 07 — Gaps, Open Questions and Honest Tensions

---

## 1. Must be written fresh

| # | Page | Why |
|---|---|---|
| **G1** | **The front page** | Nothing in the corpus opens this argument for a cold reader. The pieces exist — underwriting, no-deny, unaccepted-is-critical — but nobody has assembled them into 300 words |
| **G2** | **`/agents/` and the definitions endpoint** | The commissioned audience has no surface today. 42 concepts as JSON is the single highest-value artefact this site can ship |
| **G3** | **`/shipped/`** | Nothing is implemented. Without this page the site over-claims and breaks the convention the siblings are built on |
| **G4** | **`/concepts/` as an addressable index** | The concepts exist across ~185 documents with no index, no anchors and no stable URLs. `01__concepts-index.md` is the raw material |
| **G5** | **RAMM base levels** | Levels 1, 2, 4 and 5 are named but only Level 3 has a stated predicate. The Agentic `+` variants are better defined than the base model they extend |
| **G6** | **The plug reconciliation** | The corpus records a *"no plug"* correction that `riskmandate.ai/plug.html` does not reflect. One of the two is wrong |

---

## 2. Open questions worth publishing unresolved

Following the pki.sgit.ai convention of numbering open questions in public. A model this opinionated earns credibility by naming what it has not settled.

| # | Question | Where the corpus gets closest |
|---|---|---|
| **Q1** | What is the **formula language**? Node Type Formulas are the mechanism the whole ontology rests on, and the notation is undefined | C7's canonical brief names this as its own open question |
| **Q2** | Who sets **acceptable**, and what stops it being set to whatever is convenient? | C5 defines it as *"the moment the business is happy to stop funding remediation"* — it does not say who decides or what constrains them |
| **Q3** | What happens when the **named acceptor refuses to sign**? | The no-deny mechanic removes denial of the *risk*; it does not address refusal of the *act* |
| **Q4** | Does **unaccepted = critical** survive contact with a large estate? | On a register of thousands, everything unaccepted being critical may make critical meaningless. C28's register-density argument circles this without resolving it |
| **Q5** | How is the **interval enforced**? Expiry-as-cost is asserted; the mechanism is not specified | C3, C2 |
| **Q6** | Is **recoverability** measurable, or only classifiable? | C23 splits reversible from irreversible; nothing grades the middle |
| **Q7** | What is the **stopping rule** for the grounding ladder in practice? | C6 states the test — *"the last node where going deeper would neither improve observability nor change a decision"* — but no worked example applies it to a hard case |
| **Q8** | How do you stop a register being **gamed** once acceptance carries personal liability? | C31 argues accountability manufactures demand for evidence; the opposite incentive — avoid ever being the named acceptor — is acknowledged but not answered |

---

## 3. Honest tensions

Following pki.sgit.ai's `/roadmap/#tensions`.

1. **The model rates the ability to stop but does not provide it.** The corpus states this refusal itself: *"a customer who scores badly will ask us to supply the stop button, which is exactly the enforcement role the corpus refuses."* That boundary is principled — and commercially uncomfortable.
2. **No-deny is the strongest idea and the hardest sell.** Removing the deny button removes the thing most executives use a register for. The corpus is honest that this is a forcing function, not a convenience.
3. **Personal liability is the mechanism and the risk.** Making acceptance a personal act is what generates demand for evidence. It also gives every rational actor a reason to avoid being named.
4. **Nothing is built.** ~496,000 words of design against zero lines of implementing code. That is fine for a research site *if stated*; it is fatal if implied otherwise.
5. **The corpus names real vendors critically.** The OSMM assessment scores two named real vendors [REDACTED · Tier-3 · see PUBLIC.md] at Level 1 and concludes one presents more exposure on the axis it markets hardest. Rigorous, sourced, and a legal exposure.
6. **Two sites, one voice.** riskmandate.ai and risks.sgit.ai share an author and a thesis. If the research site reads like marketing, the split has failed; if the commercial site reads like research, it will not sell.
7. **The EU AI Act thread is neither risk nor graphs.** ~40,000 words across four brief clusters. Risk's genuine claims within it are narrow and sharp — Article 9(5)'s undefined "acceptable", Article 14 as the plug obligation, Article 26(5)/(6) as the worked example. **The rest may deserve its own property.**

---

## 4. Loose ends inside the acceptance thread itself

From the corpus's own record, worth carrying onto the site rather than quietly resolving:

- **The 4h-for-everyone problem.** In the 2FA example the governance air gap propagates GRC → CIO → CEO → Board with *each accepting at 4h because that is the only option open to them*. Either the ladder needs a per-altitude variant, or that uniformity is a finding about the model.
- **Compound pre-approval** is proposed and never worked through.
- **Override** is named in the workflow brief without a stated authority model.
- **The level ledger** (C27 — accept first, then adjust the level) sits awkwardly with the no-deny mechanic: if you can adjust the level after accepting, denial re-enters through the back door.

---

## 5. Fixes worth doing at source

1. **Reconcile the plug correction** across the corpus and `riskmandate.ai/plug.html`.
2. **Specify RAMM levels 1, 2, 4 and 5** to the standard already set by Level 3 and the Agentic variants.
3. **Legal read on the OSMM vendor assessment** before it goes anywhere public, with a right-of-reply process.
4. **Verify what "Odysseus" refers to** — 42 mentions across three documents, reads as a codename for a real product or engagement.
5. **Decide the EU AI Act thread's home** before it accretes further.
6. **Coordinate the mandate split with pki.sgit.ai**, whose own 19 August site review says *"mandate is the gap, registry is the missing half."*

---

This document is released under the Creative Commons Attribution 4.0 International licence (CC BY 4.0).
