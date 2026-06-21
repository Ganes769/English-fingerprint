# English Fingerprint

> *Your English has a tell.*

A linguistic personality diagnostic. 8 questions. No right answers. Your instincts, mapped to one of 6 types.

**Live:** [english-fingerprint.vercel.app](https://english-fingerprint.vercel.app)

---

## What it is

English Fingerprint is a short quiz that reveals how you instinctively use language — not what you know, but how you think. Every answer is drawn from a real linguistic instinct: how you handle typos, how you write when you're angry, what you cut first when editing, which word sounds more honest.

The result is a "fingerprint" — a unique SVG generated from your exact answer pattern, and a type profile that describes your relationship with language.

---

## The 6 Types

| Type | Tagline | Rarity |
|---|---|---|
| **The Surgeon** | Precision over everything. | 18% |
| **The Poet** | You feel it before you understand it. | 14% |
| **The Operator** | Language is infrastructure. | 31% |
| **The Provocateur** | Rules are just defaults. | 22% |
| **The Guardian** | Someone has to hold the line. | 11% |
| **The Anomaly** | We've never seen this pattern before. | 4% |

In case of a tie, the rarer type wins. Rarity order: `Anomaly > Guardian > Poet > Surgeon > Provocateur > Operator`.

---

## V1 — Current Release

### Questions
- **18 questions** in the full bank, covering 10 categories:
  - Word Weight, Real Life, Workplace, Sound, Usage, Craft, Instinct, Punctuation, Reading, Word Choice, Editing, Feedback
- **8 questions randomly drawn** per run — so retaking the quiz gives a different set
- Each option has a **hint** (one-line clarifier explaining who would pick it)
- Each question has a **category badge** displayed above the prompt
- Questions have 3 layout styles: `pair` (2 large buttons), `list` (4 vertical options), `grid` (2×2)

### Scoring
- Each option scores points into one or more type buckets (`S`, `P`, `O`, `PR`, `G`, `A`)
- After 8 answers, the bucket with the highest total wins
- Ties resolved by rarity (rarest type wins)
- The "Hm." option on the final question scores 5 points to Anomaly — a deliberate easter egg

### UX
- **Keyboard shortcuts** — press `A/B/C/D` or `1/2/3/4` to answer without clicking
- **Letter labels** on every option for fast scanning
- **Hover states** with border glow and background tint
- **Micro-reactions** — a brief phrase appears after answering (e.g. "Noted.", "Interesting.", "That tracks.")
- **Progress bar** across the top of every question screen

### The Fingerprint SVG
A unique SVG is generated from your answers. Each of the 8 answers controls one ring:
- Ring radius grows from center outward (question 1 = inner, question 8 = outer)
- Gap positions within each ring are calculated from which option you picked
- Two gaps per ring, offset by a formula using answer index + ring index
- Result: every unique combination of answers produces a distinct fingerprint

### Homepage
- Full-screen two-panel layout (no scrolling)
- **Left panel:** headline, sub-text, CTA button, meta info
- **Right panel:** decorative fingerprint, "How it works" 3-column cards, 6-type grid
- Each type card shows: name, tagline, one-line brief, rarity % with context label

### Result & Share
- Animated reveal: type label → name → tagline → fingerprint → rarity badge → description
- **Share page** with screenshot-worthy card, pre-written copy text, tweet button
- Unique fingerprint ID generated from answer hash (e.g. `#047291`)
- "Challenge" section encouraging users to tag friends

### Stack
- React 19 + Vite 8
- Zero external UI dependencies — all styles are inline JS objects
- No backend, no database, no tracking
- Deployed on Vercel

---

## V2 — Planned

### Question Bank Expansion
- Grow from 18 → 40+ questions
- Add new categories: **Punctuation**, **Register** (formal vs casual), **Listening** (how you interpret ambiguous sentences), **Editing Speed** (instinct vs deliberation)
- Add weighted questions — some questions are worth more when the answer is extreme

### Secondary Types
- Surface a **secondary type** alongside the primary (e.g. "The Surgeon, with Poet tendencies")
- Show a mini breakdown of all 6 score totals on the result page
- Add "closeness" indicator — how dominant your type was vs the runner-up

### Mobile-First Redesign
- The current homepage is desktop-only (CSS grid two-panel)
- V2 will have a responsive layout that collapses cleanly on mobile
- Quiz questions already work well on mobile; only the homepage needs rework

### Visual Fingerprint Upgrade
- Animate the fingerprint drawing on the result page (ring by ring)
- Add colour variation — fingerprint takes a gradient from primary type colour
- Export fingerprint as PNG for sharing (canvas-based image generation)
- Show fingerprints of all 6 types side by side so users can see how theirs differs

### History & Comparison
- LocalStorage-based result history (last 5 runs)
- Show how your type has changed across retakes
- "Compare" mode — paste a friend's fingerprint ID to see both on screen

### Type Deep-Dives
- Dedicated page per type with full breakdown, example sentences, famous writers of that type
- "Type compatibility" — which types tend to clash vs collaborate

### Internationalisation
- British English vs American English variant toggle (affects scoring on usage questions)
- Additional language diagnostic versions (Spanish, French)

---

## Project Structure

```
english-fingerprint/
├── src/
│   ├── App.jsx          # All components, questions, types, styles
│   ├── index.css        # CSS variables, animations, global resets
│   └── main.jsx         # React root
├── public/
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

All logic lives in `App.jsx`. The key sections:

| Section | What it does |
|---|---|
| `QUESTIONS` | Array of 18 question objects with prompts, options, hints, scores |
| `TYPES` | The 6 type definitions: name, tagline, brief, description, colour, rarity |
| `computeResult()` | Tallies scores and picks the winning type |
| `pickRandom()` | Fisher-Yates shuffle to draw 8 from 18 |
| `Fingerprint` | SVG component that renders unique rings from answer data |
| `Landing` | Full-screen homepage component |
| `Question` | Question screen with keyboard support and option hints |
| `Analysis` | Animated loading screen between quiz and result |
| `Result` | Animated type reveal with fingerprint |
| `Share` | Shareable card, copy text, tweet link |
| `hashAnswers()` | Generates a deterministic fingerprint ID from answers |

---

## Running Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

---

## Design Principles

1. **No right answers** — the quiz maps instincts, not knowledge. It should feel like self-recognition, not a test.
2. **Speed over deliberation** — the fastest answer is usually the most honest. The UX pushes users to pick quickly (keyboard shortcuts, instant transitions).
3. **The fingerprint is personal** — two people with different answers get genuinely different SVG shapes. The visual is not decorative; it's a record of your specific choices.
4. **Brevity as honesty** — every description opens with "You are [one word]" and "You care about [one thing]." No padding.
