# Product Reset · Question-to-evidence vertical slice

## Why this recovery milestone exists

The original M3 implementation exposed its internal eight-part learning schema all at once. It was technically verified and deployed, but Umut rejected the live product experience because a first-time visitor could not clearly understand what the product was, where to begin, or what they would produce.

This recovery milestone replaces that content wall with a product journey:

`Choose a path → Understand → See an example → Experiment → Check → Prove`

The final output of the first vertical slice is a persistent **Mini Model Card**.

## Product promise

> Bir ekonomik soruyu modele ve savunulabilir bir çıktıya dönüştür.

The home page offers three user jobs:

1. **Programımı takip et**
2. **Bir kavram öğren**
3. **Model dene ve araştır**

Program and Atlas remain available, but they are supporting routes rather than unexplained internal product labels at first contact.

## Implemented scope

- Product-focused home page with one promise, three paths, and one sample-journey CTA.
- `#/basla` question-to-evidence vertical slice for **Modelleme kavramları**.
- Progressive disclosure: one learning stage is visible at a time.
- Interactive laboratory showing how an omitted effect changes interpretation.
- Immediate quiz feedback.
- Persistent, programmatically focused Mini Model Card.
- Versioned `eko:journey:v1` local state.
- Unified reset compatibility layer clearing current, legacy, journey, and legacy note keys.
- Reset race prevention via `history.replaceState` before storage clearing and reload.
- Critical `320 px`, focus, reduced-motion, malformed-route, migration, Program, and Atlas regression coverage.

## Verification evidence

### Product Reset implementation

PR: [#28](https://github.com/umutseve4/eko-rasathane/pull/28)

Application head reviewed by independent QA:

- SHA: `d9d7a8025e2ce512eb150e4e9e5fcd972b1daedc`
- Browser E2E run/job: `32738351220` / `97466540316` — `completed/success`
- Test run/job: `32738351252` / `97466540188` — `completed/success`
- Test run/job: `32738343750` / `97466517435` — `completed/success`
- Exact-head checks: `3/3 success`
- Independent source-aware QA: `PASS-WITH-NOTES`; no code-merge blocker.
- Squash-merge SHA: `d272353171c2b0ece2345c151b56b7160d6b334c`.

The Product Reset code merge passed its exact-SHA Test and Browser checks. Its Pages check failed after deployment because the workflow still searched the downloaded static HTML for the obsolete course-first phrase `Ders rotan burada`. This was a stale verification contract, not a demonstrated application or artifact failure.

### Pages verification recovery

Recovery PR: [#29](https://github.com/umutseve4/eko-rasathane/pull/29)

- Recovery branch: `fix/product-reset-pages-verification`
- Recovery head: `3dc3c65035866ac27470df3c832681331702649b`
- Added deterministic static marker: `<meta name="eko-release" content="product-reset-v1">`
- Replaced the obsolete visible-text check with a fixed-string raw-HTML marker check.
- Exact recovery-head checks: `3/3 completed/success`.
- Independent focused QA: `PASS-WITH-NOTES`; no code-merge blocker.
- Squash-merge SHA: `cdbc692dca99669c4e522fe071803b9975e176e3`.

Exact recovery merge-SHA checks:

- Deploy check/job `97472882410` — `completed/success`
- Test check/job `97472881531` — `completed/success`
- Browser check/job `97472881392` — `completed/success`
- GitHub Pages deployment ID: `6065023233`

Live target: <https://umutseve4.github.io/eko-rasathane/>

A cache-busted live retrieval showed the Product Reset title, promise, all three entry paths, and the sample-journey CTA. The successful exact-SHA Deploy job also passed the live raw-HTML release-marker gate.

## Non-blocking follow-ups

- Manually inspect whether the quiz status region and global toast produce duplicate screen-reader announcements.
- At `320 px`, manually confirm that Program and Atlas retain visible, keyboard-accessible alternative entries while header action links are hidden.
- Replace the cloned-reset-button compatibility layer with one centralized application reset controller in a later cleanup; preserve the existing reset contract with tests.

## Acceptance gates and status

| Gate | Status |
|---|---|
| Product Reset implementation | Verified |
| Independent code QA | Verified (`PASS-WITH-NOTES`) |
| Exact recovery merge-SHA CI | Verified (`3/3 completed/success`) |
| Exact recovery merge-SHA Pages deployment | Deployed |
| Live Product Reset homepage | Verified |
| Umut live product acceptance | Pending |
| Revised anonymous usability test | Frozen until Umut accepts the live experience |
| Production-ready | No |

The old M3 five-person task must not be used: it measures the rejected interface. After Umut accepts the new live experience, the protocol must be rewritten around whether a first-time visitor understands the promise, knows where to start, completes the five-stage journey, and produces a Mini Model Card.

Production-ready requires all of the following:

1. exact merge-SHA Verify succeeds;
2. exact merge-SHA Browser E2E succeeds;
3. Pages deploys that same merge SHA;
4. Umut accepts the live product experience;
5. at least `4/5` real anonymous participants complete the revised task successfully.
