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

PR: [#28](https://github.com/umutseve4/eko-rasathane/pull/28)

Application head reviewed by independent QA:

- SHA: `d9d7a8025e2ce512eb150e4e9e5fcd972b1daedc`
- Browser E2E run/job: `32738351220` / `97466540316` — `completed/success`
- Test run/job: `32738351252` / `97466540188` — `completed/success`
- Test run/job: `32738343750` / `97466517435` — `completed/success`
- Exact-head checks: `3/3 success`
- Independent source-aware QA: `PASS-WITH-NOTES`; no code-merge blocker.

The documentation commit that adds this record must receive its own PR-head checks. After merge, Verify, Browser E2E, and Pages must be tied to the exact merge SHA before the milestone can be called deployed.

## Non-blocking follow-ups

- Manually inspect whether the quiz status region and global toast produce duplicate screen-reader announcements.
- At `320 px`, manually confirm that Program and Atlas retain visible, keyboard-accessible alternative entries while header action links are hidden.
- Replace the cloned-reset-button compatibility layer with one centralized application reset controller in a later cleanup; preserve the existing reset contract with tests.

## Acceptance gates and status

| Gate | Status |
|---|---|
| Product Reset implementation | Implemented |
| Exact application-head automated checks | Verified |
| Independent code QA | Verified (`PASS-WITH-NOTES`) |
| Documentation-head CI | Pending |
| Exact merge-SHA CI | Pending |
| Exact merge-SHA Pages deployment | Pending |
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
