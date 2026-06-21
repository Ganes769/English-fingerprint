import { useState, useEffect, useCallback, useRef } from "react";
import "./index.css";

// ─── QUESTIONS ─────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 1,
    category: "WORD WEIGHT",
    prompt: "Which word feels heavier?",
    sub: "First instinct. Don't think.",
    style: "pair",
    microreaction: "Interesting.",
    options: [
      {
        text: "SILENCE",
        hint: "feels like weight, emptiness",
        scores: { P: 2 },
      },
      {
        text: "SCREAM",
        hint: "feels like force, explosion",
        scores: { S: 1, PR: 1 },
      },
    ],
  },
  {
    id: 2,
    category: "REAL LIFE",
    prompt: "Your friend texts: 'their going to be late.'",
    sub: "You:",
    style: "list",
    microreaction: "Noted.",
    options: [
      {
        text: "Correct them immediately.",
        hint: "You can't let a typo slide, even in a casual text.",
        scores: { G: 2 },
      },
      {
        text: "Notice. Say nothing. Quietly suffer.",
        hint: "You saw it, it bothered you, but you kept it to yourself.",
        scores: { S: 2 },
      },
      {
        text: "Don't notice until re-reading later.",
        hint: "You read for the meaning, not the spelling.",
        scores: { O: 2 },
      },
      {
        text: "Reply: 'their what?'",
        hint: "You turn it into a joke — pointing it out without being serious.",
        scores: { PR: 3 },
      },
    ],
  },
  {
    id: 3,
    category: "WORKPLACE",
    prompt: "You need a reply. You follow up with:",
    sub: null,
    style: "list",
    microreaction: "That tracks.",
    options: [
      {
        text: "Please advise at your earliest convenience.",
        hint: "Formal and polished — you follow professional norms.",
        scores: { G: 2 },
      },
      {
        text: "Let me know.",
        hint: "Short and direct — you say exactly what you mean, nothing extra.",
        scores: { O: 2 },
      },
      {
        text: "Any thoughts on this?",
        hint: "Soft and open — you nudge without pushing.",
        scores: { P: 1, S: 1 },
      },
      {
        text: "?",
        hint: "One character says it all — you'd rather be bold than wordy.",
        scores: { PR: 3 },
      },
    ],
  },
  {
    id: 4,
    category: "SOUND",
    prompt: "The most satisfying word:",
    sub: "The one that most sounds like what it means.",
    style: "grid",
    microreaction: "We see you.",
    options: [
      {
        text: "MURMUR",
        hint: "soft, flowing, like the thing itself",
        scores: { P: 2 },
      },
      { text: "CRISP", hint: "clean break, no excess", scores: { S: 2 } },
      { text: "HOLLOW", hint: "absence, echo, depth", scores: { P: 1, S: 1 } },
      {
        text: "SLASH",
        hint: "sharp, aggressive, cuts through",
        scores: { PR: 2 },
      },
    ],
  },
  {
    id: 5,
    category: "USAGE",
    prompt: '"I could care less."',
    sub: "Your honest reaction:",
    style: "list",
    microreaction: "Strong.",
    options: [
      {
        text: "Wrong. It's 'couldn't care less.'",
        hint: "It's a mistake — the original phrase means the opposite.",
        scores: { G: 3 },
      },
      {
        text: "Technically wrong, but it conveys the feeling.",
        hint: "You know it's wrong, but you accept it because everyone understands it.",
        scores: { PR: 1, O: 1 },
      },
      {
        text: "I've never thought about this.",
        hint: "This distinction has genuinely never crossed your mind.",
        scores: { O: 2 },
      },
      {
        text: "I use it on purpose. It hits differently.",
        hint: "You know the 'correct' version — you just prefer the broken one.",
        scores: { PR: 3 },
      },
    ],
  },
  {
    id: 6,
    category: "CRAFT",
    prompt: "Your character is furious. You write:",
    sub: null,
    style: "list",
    microreaction: "Revealing.",
    options: [
      {
        text: '"She was furious."',
        hint: "State the emotion directly — clear and to the point.",
        scores: { O: 2 },
      },
      {
        text: '"Her jaw tightened."',
        hint: "Show it through the body — no emotion word needed.",
        scores: { S: 3 },
      },
      {
        text: '"She didn\'t speak."',
        hint: "Show it through absence — silence says everything.",
        scores: { P: 3 },
      },
      {
        text: '"She was so, so angry."',
        hint: "Lean into the repetition — the extra 'so' does something the single word can't.",
        scores: { PR: 1, P: 1 },
      },
    ],
  },
  {
    id: 7,
    category: "INSTINCT",
    prompt: "A sentence is broken. The best fix:",
    sub: null,
    style: "list",
    microreaction: "Pattern acquired.",
    options: [
      {
        text: "Delete it entirely.",
        hint: "If it doesn't work, cut it — don't waste time saving it.",
        scores: { S: 2 },
      },
      {
        text: "Rebuild from scratch.",
        hint: "Start over with a clearer idea in your head.",
        scores: { P: 2 },
      },
      {
        text: "Correct the grammar.",
        hint: "Fix the rules — a grammatically correct sentence is a good sentence.",
        scores: { G: 2 },
      },
      {
        text: "Add context to it.",
        hint: "Maybe it's broken because it's missing information.",
        scores: { O: 2 },
      },
    ],
  },
  {
    id: 8,
    category: "FINAL",
    prompt: '"The road was long and dark\nand quiet and cold."',
    sub: "Your reaction:",
    style: "list",
    microreaction: null,
    options: [
      {
        text: "Those commas are wrong.",
        hint: "You spotted the grammar issue before anything else.",
        scores: { G: 3 },
      },
      {
        text: "That rhythm is perfect.",
        hint: "The repeated 'and' creates a beat — you felt that.",
        scores: { P: 3 },
      },
      {
        text: "Cut it in half.",
        hint: "Too many words for what it's saying.",
        scores: { S: 3 },
      },
      {
        text: "Hm.",
        hint: "Something happened, but you can't quite name it.",
        scores: { A: 5 },
      },
    ],
  },
  {
    id: 9,
    category: "PUNCTUATION",
    prompt: "Which feels most honest?",
    sub: "Same words. Different punctuation.",
    style: "list",
    microreaction: "Punctuation reveals everything.",
    options: [
      {
        text: '"I\'m fine."',
        hint: "Period: closed, final, done talking about it.",
        scores: { G: 2 },
      },
      {
        text: '"I\'m fine…"',
        hint: "Ellipsis: something is being left unsaid.",
        scores: { P: 2 },
      },
      {
        text: '"I\'m fine!"',
        hint: "Exclamation: performing fine, perhaps too hard.",
        scores: { PR: 2 },
      },
      {
        text: '"Fine"',
        hint: "No punctuation: the word alone. Nothing added.",
        scores: { S: 2 },
      },
    ],
  },
  {
    id: 10,
    category: "READING",
    prompt: "You hit a word you don't know. You:",
    sub: null,
    style: "list",
    microreaction: "Interesting approach.",
    options: [
      {
        text: "Look it up immediately.",
        hint: "You need the exact meaning before moving on.",
        scores: { G: 2 },
      },
      {
        text: "Guess from context and keep going.",
        hint: "Close enough — the meaning matters more than the word.",
        scores: { O: 2 },
      },
      {
        text: "Sit with it. The gap is part of the experience.",
        hint: "Not knowing adds texture, not frustration.",
        scores: { P: 2 },
      },
      {
        text: "Skip it. Good writing shouldn't stop you.",
        hint: "If it mattered, the writer would have made it clear.",
        scores: { S: 2 },
      },
    ],
  },
  {
    id: 11,
    category: "WORD CHOICE",
    prompt: "Which phrase do you reach for most?",
    sub: null,
    style: "list",
    microreaction: "That's telling.",
    options: [
      {
        text: '"To be honest…"',
        hint: "You signal truth before stating it — implies you're usually careful.",
        scores: { PR: 2 },
      },
      {
        text: '"Technically…"',
        hint: "You flag precision before applying it.",
        scores: { G: 2 },
      },
      {
        text: '"In other words…"',
        hint: "You rephrase automatically to make sure you're understood.",
        scores: { O: 2 },
      },
      {
        text: '"That said…"',
        hint: "You hold two opposing things at once and pivot between them.",
        scores: { S: 1, P: 1 },
      },
    ],
  },
  {
    id: 12,
    category: "EDITING",
    prompt: 'Someone asks you to "clean up" their writing. You:',
    sub: null,
    style: "list",
    microreaction: "Classic.",
    options: [
      {
        text: "Fix spelling and grammar. Nothing else.",
        hint: "You do exactly what was asked — no more, no less.",
        scores: { G: 2 },
      },
      {
        text: "Cut everything that isn't earning its place.",
        hint: "Half the words probably shouldn't be there.",
        scores: { S: 3 },
      },
      {
        text: "Rewrite sentences for rhythm and flow.",
        hint: "Correct isn't enough — it needs to feel right too.",
        scores: { P: 2 },
      },
      {
        text: "Ask what they were trying to say first.",
        hint: "You can't fix writing without understanding the goal.",
        scores: { O: 2 },
      },
    ],
  },
  {
    id: 13,
    category: "REAL LIFE",
    prompt: 'Someone says: "I literally died laughing."',
    sub: "Your reaction:",
    style: "list",
    microreaction: "There it is.",
    options: [
      {
        text: 'They used "literally" wrong.',
        hint: "Literally means literally. This is a real mistake.",
        scores: { G: 3 },
      },
      {
        text: "You knew exactly what they meant. Move on.",
        hint: "Language is for communication — this communicated fine.",
        scores: { O: 2 },
      },
      {
        text: 'Using "literally" wrong is now its own idiom.',
        hint: 'The "wrong" version has evolved into something with its own meaning.',
        scores: { PR: 2 },
      },
      {
        text: "You noticed it, said nothing, moved on.",
        hint: "Not your battle. You noticed but chose not to engage.",
        scores: { S: 1, P: 1 },
      },
    ],
  },
  {
    id: 14,
    category: "SOUND",
    prompt: "The most unpleasant word:",
    sub: "The one that sounds like what's wrong with it.",
    style: "grid",
    microreaction: "Fair.",
    options: [
      {
        text: "MOIST",
        hint: "the texture lives in the sound",
        scores: { S: 2 },
      },
      {
        text: "SLURP",
        hint: "the sound and the act are one",
        scores: { P: 2 },
      },
      {
        text: "SYNERGY",
        hint: "jargon disguised as meaning",
        scores: { PR: 2 },
      },
      { text: "UTILIZE", hint: 'why not just say "use"?', scores: { G: 2 } },
    ],
  },
  {
    id: 15,
    category: "CRAFT",
    prompt: "The best opening line:",
    sub: null,
    style: "list",
    microreaction: "Your instinct is showing.",
    options: [
      {
        text: '"Call me Ishmael."',
        hint: "Three words. A command. An entire character established.",
        scores: { P: 3 },
      },
      {
        text: '"It was the best of times, it was the worst of times."',
        hint: "The contradiction is the point — and it earns every word.",
        scores: { PR: 2 },
      },
      {
        text: '"Happy families are all alike…"',
        hint: "One sentence that contains the novel's entire argument.",
        scores: { S: 2 },
      },
      {
        text: '"The sky above the port was the color of television, tuned to a dead channel."',
        hint: "A metaphor that rewires how you see the world.",
        scores: { P: 1, PR: 2 },
      },
    ],
  },
  {
    id: 16,
    category: "INSTINCT",
    prompt: '"She very quickly ran away fast."\nWhat do you cut first?',
    sub: "You need to get this down to 5 words.",
    style: "list",
    microreaction: "Instinct confirmed.",
    options: [
      {
        text: 'The adverbs — "very", "quickly", "fast".',
        hint: "Adverbs almost always weaken the verb they're propping up.",
        scores: { S: 3 },
      },
      {
        text: "Start over. This sentence is beyond saving.",
        hint: "Cutting a broken sentence is faster than patching it.",
        scores: { PR: 2 },
      },
      {
        text: "Read it aloud and cut what sounds wrong.",
        hint: "Your ear knows before your brain does.",
        scores: { P: 2 },
      },
      {
        text: 'Remove the obvious duplicates: "She ran away fast."',
        hint: "Just eliminate the clear redundancy and move on.",
        scores: { G: 1, O: 2 },
      },
    ],
  },
  {
    id: 17,
    category: "WORKPLACE",
    prompt: "Email subject line for an important update:",
    sub: null,
    style: "list",
    microreaction: "Says a lot.",
    options: [
      {
        text: '"Update: Project X — Action Required by Friday"',
        hint: "Everything the reader needs is already in the subject line.",
        scores: { G: 2 },
      },
      {
        text: '"Quick update"',
        hint: "Short and low-pressure — you don't want to alarm anyone.",
        scores: { O: 2 },
      },
      {
        text: '"Read this"',
        hint: "Deliberately blunt. You trust the weight to do the work.",
        scores: { PR: 3 },
      },
      {
        text: '"A few things worth knowing"',
        hint: "Soft and considered — you ease people in rather than startle them.",
        scores: { P: 2 },
      },
    ],
  },
  {
    id: 18,
    category: "FEEDBACK",
    prompt: "A friend shows you their first draft. It's bad. You:",
    sub: null,
    style: "list",
    microreaction: "Noted.",
    options: [
      {
        text: "Point out the grammar and structural issues.",
        hint: "Start with what's fixable and work forward from there.",
        scores: { G: 2 },
      },
      {
        text: "Find what's working and build from that.",
        hint: "There's something in there — your job is to find it.",
        scores: { P: 2 },
      },
      {
        text: "Tell them exactly what to cut.",
        hint: "Less is more. The sooner they hear it, the better.",
        scores: { S: 3 },
      },
      {
        text: "Ask what they were trying to say.",
        hint: "You can't improve writing before you understand its intent.",
        scores: { O: 2 },
      },
    ],
  },
];

// ─── TYPES ─────────────────────────────────────────────────────────────────

const TYPES = {
  S: {
    key: "S",
    name: "THE SURGEON",
    tagline: "Precision over everything.",
    brief: "Cuts every unnecessary word. Your emails are 3 lines.",
    description:
      "You are precise. You care about every word earning its place — and cutting the ones that don't. You edit texts before sending. You delete adjectives on sight. Waste bothers you more than silence ever could. People call your writing cold. You call it clean.",
    color: "#4a9eff",
    rarity: 18,
    shareHook:
      "My English type is The Surgeon — apparently I use language like a scalpel.",
  },
  P: {
    key: "P",
    name: "THE POET",
    tagline: "You feel it before you understand it.",
    brief: "Picks words for how they sound and land, not just what they mean.",
    description:
      "You are rhythmic. You care about how words land, not just what they mean. You read sentences aloud in your head. You choose words for texture and weight. People say you over-communicate. You're just being precise in a different language.",
    color: "#b56cff",
    rarity: 14,
    shareHook:
      "Apparently my English type is The Poet — I feel words before I understand them.",
  },
  O: {
    key: "O",
    name: "THE OPERATOR",
    tagline: "Language is infrastructure.",
    brief: "Gets to the point. Every time. Style is someone else's problem.",
    description:
      "You are direct. You care about getting information from A to B — nothing more. You've sent one-word emails. Subject lines matter more to you than bodies. Style is someone else's problem. Clarity is yours.",
    color: "#00e5a0",
    rarity: 31,
    shareHook:
      'I\'m "The Operator" on the English Fingerprint Test. Language is infrastructure to me.',
  },
  PR: {
    key: "PR",
    name: "THE PROVOCATEUR",
    tagline: "Rules are just defaults.",
    brief: "Knows every grammar rule. Breaks them on purpose, for effect.",
    description:
      "You are deliberate. You care about effect, not correctness. You know every rule — you just prefer breaking them with intention. You split infinitives for emphasis. You weaponize the comma splice. Grammar is a tool, not a law.",
    color: "#ff6b35",
    rarity: 22,
    shareHook:
      "My English type is The Provocateur — I know every grammar rule and break them on purpose.",
  },
  G: {
    key: "G",
    name: "THE GUARDIAN",
    tagline: "Someone has to hold the line.",
    brief: "Spots the apostrophe error on the menu. Every time.",
    description:
      "You are exact. You care about standards — because without them, meaning erodes. You spot apostrophe errors on restaurant menus. You believe correct and clear are the same thing. You're not pedantic. You're protecting something worth protecting.",
    color: "#ffd700",
    rarity: 11,
    shareHook:
      "I'm \"The Guardian\" on the English Fingerprint Test. I'm basically a human style guide.",
  },
  A: {
    key: "A",
    name: "THE ANOMALY",
    tagline: "We've never seen this pattern before.",
    brief: "Doesn't fit any known profile. Rarest type in the test.",
    description:
      "You are unclassifiable. You care about things language hasn't named yet. Your pattern doesn't map to any known profile. Fewer than 4% of people read this — which means you're either genuinely rare, or you picked 'Hm.' on the last question. Probably both.",
    color: "#ff2d6a",
    rarity: 4,
    shareHook:
      'I got "The Anomaly" on the English Fingerprint Test. Apparently fewer than 4% of people get this.',
  },
};

// ─── SCORING ───────────────────────────────────────────────────────────────

function computeResult(answers) {
  const scores = { S: 0, P: 0, O: 0, PR: 0, G: 0, A: 0 };
  answers.forEach((a) => {
    Object.entries(a.scores).forEach(([type, val]) => {
      scores[type] = (scores[type] || 0) + val;
    });
  });
  const max = Math.max(...Object.values(scores));
  const winners = Object.keys(scores).filter((k) => scores[k] === max);
  const rarityOrder = ["A", "G", "P", "S", "PR", "O"];
  return winners.reduce((best, cur) =>
    rarityOrder.indexOf(cur) < rarityOrder.indexOf(best) ? cur : best,
  );
}

// ─── FINGERPRINT SVG ───────────────────────────────────────────────────────

function Fingerprint({ answers, color, size = 220, animate = false }) {
  const cx = size / 2;
  const cy = size / 2;

  const rings = answers.map((ans, i) => {
    const t = i / (answers.length - 1);
    const radius = size * 0.07 + t * size * 0.38;
    const segments = 14 + i * 3;
    const ansIdx = ans.selectedIndex ?? 0;
    // Two gaps per ring, positioned by answer value + ring index offset
    const gap1 = (ansIdx * 83 + i * 23) % 360;
    const gap2 = (gap1 + 162 + i * 11) % 360;
    const gapWidth = 22 + (ansIdx % 2) * 8;

    const arcs = [];
    for (let j = 0; j < segments; j++) {
      const startDeg = (j / segments) * 360;
      const endDeg = ((j + 0.82) / segments) * 360;
      const midDeg = (startDeg + endDeg) / 2;

      const inGap1 =
        Math.abs(((midDeg - gap1 + 540) % 360) - 180) < gapWidth / 2;
      const inGap2 =
        Math.abs(((midDeg - gap2 + 540) % 360) - 180) < gapWidth / 2;
      if (inGap1 || inGap2) continue;

      const sa = ((startDeg - 90) * Math.PI) / 180;
      const ea = ((endDeg - 90) * Math.PI) / 180;
      const x1 = cx + radius * Math.cos(sa);
      const y1 = cy + radius * Math.sin(sa);
      const x2 = cx + radius * Math.cos(ea);
      const y2 = cy + radius * Math.sin(ea);
      arcs.push(
        `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius.toFixed(2)} ${radius.toFixed(2)} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
      );
    }

    return { d: arcs.join(" "), opacity: 0.3 + t * 0.7 };
  });

  const strokeW = size * 0.013;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
      aria-label="Your unique English fingerprint"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {rings.map((ring, i) => (
        <path
          key={i}
          d={ring.d}
          stroke={color}
          strokeWidth={strokeW}
          fill="none"
          opacity={ring.opacity}
          filter="url(#glow)"
          style={
            animate
              ? {
                  animation: `fadeIn 0.4s ${i * 0.07}s ease both`,
                }
              : {}
          }
        />
      ))}
      <circle cx={cx} cy={cy} r={size * 0.025} fill={color} opacity={0.9} />
      <circle
        cx={cx}
        cy={cy}
        r={size * 0.055}
        fill="none"
        stroke={color}
        strokeWidth={strokeW * 0.6}
        opacity={0.5}
      />
    </svg>
  );
}

// ─── LANDING ───────────────────────────────────────────────────────────────

function Landing({ onStart }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={styles.landingPage}>
      <div className="noise-overlay" />
      <div style={{ ...styles.landingGrid, opacity: visible ? 1 : 0, transition: "opacity 0.7s ease" }}>

        {/* ── LEFT PANEL ── */}
        <div style={styles.leftPanel}>
          <div style={styles.label} className="mono">
            ENGLISH FINGERPRINT · DIAGNOSTIC v1
          </div>
          <div style={styles.heroText}>
            <div style={styles.headlineBlock}>
              <h1 style={styles.h1}>
                Your<br />English<br />has a tell.
              </h1>
              <div style={styles.cursor} />
            </div>
            <p style={styles.sub}>
              No right answers. No tricks.<br />
              8 questions that reveal how<br />
              you actually use language.
            </p>
          </div>
          <div style={styles.leftBottom}>
            <button
              style={styles.ctaBtn}
              onClick={onStart}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#070709"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; }}
            >
              ANALYZE ME →
            </button>
            <div style={styles.metaRow} className="mono">
              <span>~3 min</span><span style={styles.dot} />
              <span>Free</span><span style={styles.dot} />
              <span>No signup</span><span style={styles.dot} />
              <span>Random each run</span>
            </div>
            <p style={styles.disclaimer}>Maps instincts, not knowledge.</p>
          </div>
        </div>

        {/* ── VERTICAL DIVIDER ── */}
        <div style={styles.vDivider} />

        {/* ── RIGHT PANEL ── */}
        <div style={styles.rightPanel}>

          {/* Top: fingerprint */}
          <div style={styles.fpSection}>
            <div style={styles.fpGlow} />
            <svg width="150" height="150" viewBox="0 0 150 150" style={{ position: "relative", zIndex: 1 }}>
              {[8, 17, 26, 35, 44, 54, 64, 72].map((r, i) => (
                <circle key={i} cx="75" cy="75" r={r}
                  fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.3"
                  strokeDasharray={`${r * 0.42} ${r * 0.14}`} strokeDashoffset={i * 9}
                />
              ))}
              <circle cx="75" cy="75" r="4" fill="rgba(255,255,255,0.35)" />
            </svg>
            <div style={styles.fpLabel} className="mono">YOUR FINGERPRINT AWAITS</div>
          </div>

          {/* Middle: how it works */}
          <div style={styles.rightBlock}>
            <div style={styles.sectionLabel} className="mono">HOW IT WORKS</div>
            <div style={styles.howRow}>
              {[
                { n: "01", label: "Get 8 questions", desc: "Randomly drawn each run" },
                { n: "02", label: "Pick by instinct", desc: "Fastest = most honest" },
                { n: "03", label: "Get your type", desc: "One of 6 profiles" },
              ].map((step) => (
                <div key={step.n} style={styles.howItem}>
                  <div style={styles.howItemNum} className="mono">{step.n}</div>
                  <div style={styles.howItemLabel}>{step.label}</div>
                  <div style={styles.howItemDesc}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: 6 types grid */}
          <div style={styles.rightBlock}>
            <div style={styles.sectionLabel} className="mono">THE 6 TYPES — WHICH ARE YOU?</div>
            <div style={styles.typesGrid}>
              {Object.values(TYPES).map((t) => (
                <div key={t.key} style={{ ...styles.typeCard, borderLeftColor: t.color }}>
                  <div style={{ ...styles.typeCardName, color: t.color }}>{t.name}</div>
                  <div style={styles.typeCardTagline}>{t.tagline}</div>
                  <div style={styles.typeCardBrief}>{t.brief}</div>
                  <div style={styles.typeCardRarity} className="mono">
                    <span style={{ color: t.color, fontWeight: 700 }}>{t.rarity}%</span>
                    <span style={styles.typeCardRarityLabel}> of English speakers</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


// ─── QUESTION ──────────────────────────────────────────────────────────────

function Question({ q, index, total, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [showReaction, setShowReaction] = useState(false);
  const [hovered, setHovered] = useState(null);

  const handleSelect = useCallback(
    (opt, i) => {
      if (selected !== null) return;
      setSelected(i);
      if (q.microreaction) {
        setShowReaction(true);
        setTimeout(() => setShowReaction(false), 700);
      }
      setTimeout(() => onAnswer({ ...opt, selectedIndex: i }), 500);
    },
    [selected, q, onAnswer],
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (selected !== null) return;
      const keyMap = { 1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3 };
      const idx = keyMap[e.key.toLowerCase()];
      if (idx !== undefined && idx < q.options.length) {
        handleSelect(q.options[idx], idx);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, q.options, handleSelect]);

  const progress = (index / total) * 100;
  const LABELS = ["A", "B", "C", "D"];

  return (
    <div style={styles.screen} key={q.id}>
      <div className="noise-overlay" />

      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressBar,
            width: `${progress}%`,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      {/* Header */}
      <div style={styles.qHeader}>
        <span style={styles.qNum} className="mono">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Question */}
      <div style={styles.qBody} className="fade-in">
        {/* Category badge — front and center above the prompt */}
        <div style={styles.categoryBadge} className="mono">
          {q.category}
        </div>

        <h2 style={styles.qPrompt}>
          {q.prompt.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < q.prompt.split("\n").length - 1 ? <br /> : null}
            </span>
          ))}
        </h2>
        {q.sub && <p style={styles.qSub}>{q.sub}</p>}

        {/* Keyboard hint */}
        {selected === null && (
          <div style={styles.keyHint} className="mono">
            press A · B · C · D or 1 · 2 · 3 · 4
          </div>
        )}

        {/* Options */}
        <div
          style={{
            ...styles.optionsWrap,
            ...(q.style === "pair" ? styles.optionsPair : {}),
            ...(q.style === "grid" ? styles.optionsGrid : {}),
          }}
        >
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            const isHovered = hovered === i && selected === null;
            const isOther = selected !== null && !isSelected;
            return (
              <button
                key={i}
                style={{
                  ...styles.optionBtn,
                  ...(q.style === "pair" ? styles.optionPairBtn : {}),
                  ...(q.style === "grid" ? styles.optionGridBtn : {}),
                  opacity: isOther ? 0.2 : 1,
                  borderColor: isSelected
                    ? "#fff"
                    : isHovered
                      ? "rgba(255,255,255,0.5)"
                      : "var(--border)",
                  background: isSelected
                    ? "rgba(255,255,255,0.08)"
                    : isHovered
                      ? "rgba(255,255,255,0.04)"
                      : "var(--surface)",
                  transform: isSelected
                    ? "scale(1.02)"
                    : isHovered
                      ? "scale(1.01)"
                      : "scale(1)",
                  transition: "all 0.15s ease",
                  animationDelay: `${i * 0.06}s`,
                  cursor: selected !== null ? "default" : "pointer",
                }}
                className="fade-in"
                onClick={() => handleSelect(opt, i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {q.style === "pair" ? (
                  <span style={styles.optionPairInner}>
                    <span style={styles.optionPairText}>{opt.text}</span>
                    {opt.hint && (
                      <span style={styles.optionHint}>{opt.hint}</span>
                    )}
                  </span>
                ) : (
                  <span style={styles.optionLabelRow}>
                    <span
                      style={{
                        ...styles.optionLabel,
                        color: isSelected
                          ? "#fff"
                          : isHovered
                            ? "rgba(255,255,255,0.7)"
                            : "var(--text-muted)",
                        borderColor: isSelected
                          ? "#fff"
                          : isHovered
                            ? "rgba(255,255,255,0.4)"
                            : "var(--border)",
                      }}
                      className="mono"
                    >
                      {LABELS[i]}
                    </span>
                    <span style={styles.optionTextBlock}>
                      <span style={styles.optionText}>{opt.text}</span>
                      {opt.hint && (
                        <span style={styles.optionHint}>{opt.hint}</span>
                      )}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Micro-reaction */}
      {showReaction && q.microreaction && (
        <div style={styles.microReaction} className="mono fade-in-fast">
          {q.microreaction}
        </div>
      )}
    </div>
  );
}

// ─── ANALYSIS ──────────────────────────────────────────────────────────────

const ANALYSIS_LINES = [
  "Mapping linguistic weight distribution...",
  "Calculating rule-adherence index...",
  "Cross-referencing 2.4M verbal profiles...",
  "Analyzing instinct vs. intention gap...",
  "Isolating pattern anomalies...",
  "Fingerprint acquired.",
  "",
  "Type: identified.",
];

function Analysis({ onDone }) {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    let i = 0;
    const tick = () => {
      if (i < ANALYSIS_LINES.length) {
        setLines((prev) => [...prev, ANALYSIS_LINES[i]]);
        i++;
        setTimeout(tick, i < 6 ? 320 : 600);
      } else {
        setTimeout(onDone, 800);
      }
    };
    const t = setTimeout(tick, 200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={styles.screen}>
      <div className="noise-overlay" />
      <div style={styles.analysisInner}>
        <div style={styles.scanLine} />
        <div style={styles.analysisLines}>
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                ...styles.analysisLine,
                color: i >= 6 ? "#fff" : "var(--text-dim)",
                fontWeight: i >= 6 ? 700 : 400,
                marginTop: i === 6 ? "2rem" : 0,
              }}
              className="mono fade-in"
            >
              {line || "\u00A0"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── RESULT ────────────────────────────────────────────────────────────────

function Result({ typeKey, answers, onShare }) {
  const type = TYPES[typeKey];
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 100),
      setTimeout(() => setStage(2), 900),
      setTimeout(() => setStage(3), 1600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={styles.screen}>
      <div className="noise-overlay" />
      <div style={styles.resultInner}>
        {/* Type label */}
        <div
          style={{
            ...styles.typeLabel,
            opacity: stage >= 1 ? 1 : 0,
            transform: stage >= 1 ? "none" : "translateY(10px)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="mono"
        >
          YOUR TYPE
        </div>

        {/* The big reveal */}
        <h1
          style={{
            ...styles.typeName,
            color: type.color,
            opacity: stage >= 1 ? 1 : 0,
            letterSpacing: stage >= 1 ? "0.06em" : "0.4em",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
          }}
        >
          {type.name}
        </h1>

        {/* Tagline */}
        <p
          style={{
            ...styles.typeTagline,
            opacity: stage >= 2 ? 1 : 0,
            transform: stage >= 2 ? "none" : "translateY(8px)",
            transition: "all 0.5s ease 0.1s",
          }}
          className="mono"
        >
          {type.tagline}
        </p>

        {/* Fingerprint */}
        <div
          style={{
            ...styles.fpWrap,
            opacity: stage >= 2 ? 1 : 0,
            transform: stage >= 2 ? "scale(1)" : "scale(0.8)",
            transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}
        >
          <Fingerprint
            answers={answers}
            color={type.color}
            size={200}
            animate={stage >= 2}
          />
        </div>

        {/* Rarity */}
        <div
          style={{
            ...styles.rarityBadge,
            borderColor: type.color + "55",
            opacity: stage >= 3 ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
          className="mono"
        >
          <span style={{ color: type.color, fontWeight: 700 }}>
            {type.rarity}%
          </span>{" "}
          of English speakers share this type
        </div>

        {/* Description */}
        <p
          style={{
            ...styles.typeDesc,
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? "none" : "translateY(8px)",
            transition: "all 0.5s ease 0.1s",
          }}
        >
          {type.description}
        </p>

        {/* CTA */}
        <button
          style={{
            ...styles.shareBtn,
            background: type.color,
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? "none" : "translateY(8px)",
            transition: "all 0.5s ease 0.2s",
          }}
          onClick={onShare}
        >
          SHARE YOUR FINGERPRINT →
        </button>
      </div>
    </div>
  );
}

// ─── SHARE ─────────────────────────────────────────────────────────────────

function Share({ typeKey, answers, onRetake }) {
  const type = TYPES[typeKey];
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const shareText = `${type.shareHook}\n\n"${type.description.slice(0, 120)}..."\n\nOnly ${type.rarity}% of people get this type. What's your English fingerprint?\n\n→ english-fingerprint.vercel.app`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const tweetText = encodeURIComponent(
    `${type.shareHook}\n\nOnly ${type.rarity}% of people share this type.\n\nWhat's yours? → english-fingerprint.vercel.app`,
  );

  return (
    <div style={styles.screen}>
      <div className="noise-overlay" />
      <div style={styles.shareInner}>
        {/* Header */}
        <div style={styles.shareHeader} className="mono fade-in">
          SHARE YOUR FINGERPRINT
        </div>

        {/* The card — designed to be screenshot-worthy */}
        <div
          ref={cardRef}
          style={{ ...styles.shareCard, borderColor: type.color + "40" }}
          className="slide-up"
        >
          {/* Card header */}
          <div style={styles.cardTopRow} className="mono">
            <span style={{ color: "var(--text-muted)" }}>
              ENGLISH FINGERPRINT
            </span>
            <span style={{ color: type.color }}>
              #{String(hashAnswers(answers)).padStart(6, "0")}
            </span>
          </div>

          {/* Fingerprint visual */}
          <div style={styles.cardFpRow}>
            <Fingerprint answers={answers} color={type.color} size={150} />
          </div>

          {/* Type name on card */}
          <div style={{ ...styles.cardTypeName, color: type.color }}>
            {type.name}
          </div>

          {/* Tagline on card */}
          <div style={styles.cardTagline} className="mono">
            {type.tagline}
          </div>

          {/* Rarity */}
          <div style={styles.cardRarity} className="mono">
            {type.rarity}% of English speakers
          </div>

          {/* Call to action on card */}
          <div style={styles.cardCTA} className="mono">
            What's your type? → english-fingerprint.vercel.app
          </div>
        </div>

        {/* The copy text preview */}
        <div style={styles.textPreview} className="mono fade-in">
          <div style={styles.textPreviewLabel}>READY TO SHARE:</div>
          <div style={styles.textPreviewBody}>{shareText}</div>
        </div>

        {/* Action buttons */}
        <div style={styles.actionRow} className="fade-in">
          <button
            style={{
              ...styles.actionBtn,
              background: copied ? "#00e5a0" : type.color,
              color: "#070709",
              flex: 2,
            }}
            onClick={handleCopy}
          >
            {copied ? "✓ COPIED!" : "COPY & SHARE"}
          </button>

          <a
            href={`https://twitter.com/intent/tweet?text=${tweetText}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...styles.actionBtn,
              ...styles.actionBtnOutline,
              borderColor: type.color,
              color: type.color,
              flex: 1,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            𝕏 TWEET
          </a>
        </div>

        {/* The insight */}
        <div style={styles.challengeBox}>
          <span style={{ color: type.color, fontWeight: 700 }} className="mono">
            THE CHALLENGE
          </span>
          <p style={styles.challengeText}>{type.shareHook}</p>
          <p
            style={{
              ...styles.challengeText,
              marginTop: "0.5rem",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
            }}
          >
            Tag 3 friends and see if they match your type. We've never seen two
            Anomalies who know each other.
          </p>
        </div>

        {/* Retake */}
        <button style={styles.retakeBtn} onClick={onRetake} className="mono">
          ↩ TAKE IT AGAIN
        </button>
      </div>
    </div>
  );
}

// simple hash for fingerprint ID
function hashAnswers(answers) {
  return (
    answers.reduce(
      (acc, a, i) => acc + (a.selectedIndex ?? 0) * (i + 1) * 7,
      0,
    ) % 999983
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────

// Pick n random items from array (Fisher-Yates)
function pickRandom(arr, n) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

const QUIZ_SIZE = 8;

export default function App() {
  const [phase, setPhase] = useState("landing"); // landing | question | analysis | result | share
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [typeKey, setTypeKey] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState([]);

  const handleStart = useCallback(() => {
    setAnswers([]);
    setCurrentQ(0);
    setActiveQuestions(pickRandom(QUESTIONS, QUIZ_SIZE));
    setPhase("question");
  }, []);

  const handleAnswer = useCallback(
    (answer) => {
      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);

      if (currentQ + 1 < activeQuestions.length) {
        setCurrentQ(currentQ + 1);
      } else {
        const result = computeResult(newAnswers);
        setTypeKey(result);
        setPhase("analysis");
      }
    },
    [answers, currentQ, activeQuestions],
  );

  const handleAnalysisDone = useCallback(() => {
    setPhase("result");
  }, []);

  const handleShare = useCallback(() => {
    setPhase("share");
  }, []);

  const handleRetake = useCallback(() => {
    setPhase("landing");
    setAnswers([]);
    setCurrentQ(0);
    setTypeKey(null);
  }, []);

  return (
    <div>
      {phase === "landing" && <Landing onStart={handleStart} />}
      {phase === "question" && (
        <Question
          key={currentQ}
          q={activeQuestions[currentQ]}
          index={currentQ}
          total={activeQuestions.length}
          onAnswer={handleAnswer}
        />
      )}
      {phase === "analysis" && <Analysis onDone={handleAnalysisDone} />}
      {phase === "result" && typeKey && (
        <Result typeKey={typeKey} answers={answers} onShare={handleShare} />
      )}
      {phase === "share" && typeKey && (
        <Share typeKey={typeKey} answers={answers} onRetake={handleRetake} />
      )}
    </div>
  );
}

// ─── STYLES ────────────────────────────────────────────────────────────────

const styles = {
  screen: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1.5rem",
    position: "relative",
    background: "var(--bg)",
  },

  // ── Landing
  landingPage: {
    height: "100vh",
    overflow: "hidden",
    background: "var(--bg)",
    position: "relative",
    display: "flex",
    alignItems: "stretch",
  },
  landingGrid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1px 1.2fr",
    position: "relative",
    zIndex: 1,
  },

  // Left panel
  leftPanel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "3rem 3rem 3rem 4rem",
    borderRight: "none",
  },
  heroText: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  leftBottom: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    fontSize: "0.62rem",
    letterSpacing: "0.2em",
    color: "var(--text-muted)",
  },
  headlineBlock: {
    display: "flex",
    alignItems: "flex-end",
    gap: "0.2rem",
  },
  h1: {
    fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
    fontWeight: 700,
    lineHeight: 1.0,
    letterSpacing: "-0.03em",
    fontFamily: "var(--font-sans)",
  },
  cursor: {
    width: "3px",
    height: "clamp(2.8rem, 5.5vw, 5rem)",
    background: "#fff",
    marginBottom: "0.05em",
    animation: "blink 1.1s step-end infinite",
    flexShrink: 0,
  },
  sub: {
    fontSize: "1rem",
    color: "var(--text-dim)",
    lineHeight: 1.7,
  },
  ctaBtn: {
    background: "transparent",
    color: "#fff",
    border: "1.5px solid #fff",
    padding: "0.85rem 2rem",
    fontSize: "0.82rem",
    letterSpacing: "0.16em",
    fontFamily: "var(--font-mono)",
    fontWeight: 700,
    borderRadius: 0,
    transition: "all 0.2s ease",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.5rem",
    fontSize: "0.65rem",
    color: "var(--text-muted)",
    letterSpacing: "0.1em",
  },
  dot: {
    width: "3px",
    height: "3px",
    borderRadius: "50%",
    background: "var(--text-muted)",
    flexShrink: 0,
  },
  disclaimer: {
    fontSize: "0.65rem",
    color: "var(--text-muted)",
    fontStyle: "italic",
  },

  // Vertical divider
  vDivider: {
    width: "1px",
    background: "var(--border)",
    margin: "2rem 0",
  },

  // Right panel
  rightPanel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "3rem 4rem 3rem 3rem",
    gap: "0",
    overflowY: "auto",
  },
  fpSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    flex: 1,
    position: "relative",
  },
  fpGlow: {
    position: "absolute",
    width: "240px",
    height: "240px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(74,158,255,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  fpLabel: {
    fontSize: "0.58rem",
    letterSpacing: "0.22em",
    color: "var(--text-muted)",
    opacity: 0.5,
  },
  rightBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    paddingTop: "1.25rem",
    borderTop: "1px solid var(--border)",
  },
  sectionLabel: {
    fontSize: "0.6rem",
    letterSpacing: "0.2em",
    color: "var(--text-muted)",
  },

  // How it works row
  howRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.75rem",
  },
  howItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
    padding: "0.75rem",
    border: "1px solid var(--border)",
    borderRadius: "3px",
    background: "rgba(255,255,255,0.02)",
  },
  howItemNum: {
    fontSize: "0.58rem",
    letterSpacing: "0.12em",
    color: "var(--text-muted)",
  },
  howItemLabel: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--text)",
  },
  howItemDesc: {
    fontSize: "0.7rem",
    color: "var(--text-dim)",
    lineHeight: 1.4,
  },

  // Types grid
  typesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.5rem",
  },
  typeCard: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    padding: "0.7rem 0.75rem",
    borderLeft: "2px solid",
    background: "rgba(255,255,255,0.02)",
    borderRadius: "0 3px 3px 0",
  },
  typeCardName: {
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    lineHeight: 1.2,
  },
  typeCardTagline: {
    fontSize: "0.65rem",
    color: "var(--text-muted)",
    lineHeight: 1.3,
    fontStyle: "italic",
  },
  typeCardBrief: {
    fontSize: "0.68rem",
    color: "var(--text-dim)",
    lineHeight: 1.4,
    marginTop: "0.15rem",
  },
  typeCardRarity: {
    fontSize: "0.6rem",
    letterSpacing: "0.08em",
    fontFamily: "var(--font-mono)",
    marginTop: "0.3rem",
    display: "flex",
    alignItems: "baseline",
    gap: "0",
  },
  typeCardRarityLabel: {
    color: "var(--text-muted)",
    fontWeight: 400,
  },

    progressTrack: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "var(--border)",
    zIndex: 10,
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #4a9eff, #b56cff)",
  },
  qHeader: {
    position: "fixed",
    top: "16px",
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    padding: "0 1.5rem",
    zIndex: 10,
  },
  qNum: {
    fontSize: "0.72rem",
    letterSpacing: "0.12em",
    color: "var(--text-muted)",
  },
  qCategory: {
    fontSize: "0.68rem",
    letterSpacing: "0.16em",
    color: "var(--text-muted)",
  },
  categoryBadge: {
    display: "inline-flex",
    alignSelf: "flex-start",
    padding: "0.3rem 0.75rem",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "2px",
    fontSize: "0.65rem",
    letterSpacing: "0.2em",
    color: "rgba(255,255,255,0.55)",
    background: "rgba(255,255,255,0.05)",
    marginBottom: "-0.25rem",
  },
  qBody: {
    maxWidth: "520px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    position: "relative",
    zIndex: 1,
    paddingTop: "2rem",
  },
  qPrompt: {
    fontSize: "clamp(1.5rem, 4vw, 2rem)",
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: "-0.01em",
  },
  qSub: {
    fontSize: "0.95rem",
    color: "var(--text-dim)",
    marginTop: "-0.75rem",
  },
  optionsWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },
  optionsPair: {
    flexDirection: "row",
    gap: "1rem",
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.6rem",
  },
  optionBtn: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    padding: "0.85rem 1.1rem",
    textAlign: "left",
    cursor: "pointer",
    color: "var(--text)",
  },
  optionPairBtn: {
    flex: 1,
    textAlign: "center",
    padding: "1.5rem 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  optionGridBtn: {
    textAlign: "center",
    padding: "1.2rem 0.8rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabelRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    width: "100%",
  },
  optionTextBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
  },
  optionText: {
    fontSize: "0.95rem",
    lineHeight: 1.4,
    fontFamily: "var(--font-sans)",
  },
  optionHint: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    lineHeight: 1.3,
    fontStyle: "italic",
  },
  optionPairInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.4rem",
  },
  optionLabel: {
    flexShrink: 0,
    width: "1.5rem",
    height: "1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid",
    borderRadius: "3px",
    fontSize: "0.65rem",
    letterSpacing: "0.08em",
    fontWeight: 700,
    transition: "all 0.15s ease",
  },
  keyHint: {
    fontSize: "0.62rem",
    letterSpacing: "0.12em",
    color: "var(--text-muted)",
    marginTop: "-0.75rem",
    opacity: 0.6,
  },
  optionPairText: {
    fontFamily: "var(--font-mono)",
    fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
    fontWeight: 700,
    letterSpacing: "0.08em",
  },
  microReaction: {
    position: "fixed",
    bottom: "2.5rem",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "0.8rem",
    letterSpacing: "0.12em",
    color: "var(--text-dim)",
    zIndex: 20,
  },

  // ── Analysis
  analysisInner: {
    maxWidth: "460px",
    width: "100%",
    position: "relative",
    zIndex: 1,
  },
  scanLine: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
    background:
      "linear-gradient(90deg, transparent, #4a9eff44, #b56cff44, transparent)",
    animation: "scan 2s ease-in-out infinite",
    pointerEvents: "none",
  },
  analysisLines: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },
  analysisLine: {
    fontSize: "0.85rem",
    letterSpacing: "0.06em",
    color: "var(--text-dim)",
  },

  // ── Result
  resultInner: {
    maxWidth: "480px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
    padding: "3rem 0 2rem",
  },
  typeLabel: {
    fontSize: "0.68rem",
    letterSpacing: "0.2em",
    color: "var(--text-muted)",
    fontFamily: "var(--font-mono)",
  },
  typeName: {
    fontSize: "clamp(2rem, 7vw, 3.2rem)",
    fontWeight: 700,
    letterSpacing: "0.06em",
    lineHeight: 1,
    fontFamily: "var(--font-sans)",
  },
  typeTagline: {
    fontSize: "0.85rem",
    letterSpacing: "0.12em",
    color: "var(--text-dim)",
    marginTop: "-0.25rem",
  },
  fpWrap: {
    margin: "0.5rem 0",
  },
  rarityBadge: {
    border: "1px solid",
    padding: "0.45rem 1.1rem",
    fontSize: "0.72rem",
    letterSpacing: "0.1em",
    color: "var(--text-dim)",
    fontFamily: "var(--font-mono)",
  },
  typeDesc: {
    fontSize: "0.92rem",
    lineHeight: 1.7,
    color: "var(--text-dim)",
    maxWidth: "380px",
  },
  shareBtn: {
    color: "#070709",
    border: "none",
    padding: "0.9rem 2rem",
    fontSize: "0.8rem",
    letterSpacing: "0.14em",
    fontFamily: "var(--font-mono)",
    fontWeight: 700,
    borderRadius: "3px",
    cursor: "pointer",
    marginTop: "0.5rem",
    transition: "opacity 0.2s",
  },

  // ── Share
  shareInner: {
    maxWidth: "480px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    position: "relative",
    zIndex: 1,
    padding: "2rem 0 3rem",
  },
  shareHeader: {
    fontSize: "0.68rem",
    letterSpacing: "0.2em",
    color: "var(--text-muted)",
  },
  shareCard: {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid",
    borderRadius: "6px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
  },
  cardTopRow: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.65rem",
    letterSpacing: "0.12em",
  },
  cardFpRow: {
    margin: "0.25rem 0",
  },
  cardTypeName: {
    fontSize: "1.5rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textAlign: "center",
  },
  cardTagline: {
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    color: "var(--text-dim)",
    textAlign: "center",
  },
  cardRarity: {
    fontSize: "0.68rem",
    letterSpacing: "0.08em",
    color: "var(--text-muted)",
  },
  cardCTA: {
    fontSize: "0.65rem",
    letterSpacing: "0.1em",
    color: "var(--text-muted)",
    marginTop: "0.5rem",
    paddingTop: "0.75rem",
    borderTop: "1px solid var(--border)",
    width: "100%",
    textAlign: "center",
  },
  textPreview: {
    width: "100%",
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    padding: "1rem",
  },
  textPreviewLabel: {
    fontSize: "0.65rem",
    letterSpacing: "0.14em",
    color: "var(--text-muted)",
    marginBottom: "0.6rem",
  },
  textPreviewBody: {
    fontSize: "0.8rem",
    lineHeight: 1.6,
    color: "var(--text-dim)",
    whiteSpace: "pre-line",
  },
  actionRow: {
    width: "100%",
    display: "flex",
    gap: "0.6rem",
  },
  actionBtn: {
    padding: "0.85rem 1rem",
    border: "none",
    borderRadius: "3px",
    fontSize: "0.78rem",
    letterSpacing: "0.12em",
    fontFamily: "var(--font-mono)",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "center",
  },
  actionBtnOutline: {
    background: "transparent !important",
    border: "1.5px solid",
  },
  challengeBox: {
    width: "100%",
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    padding: "1.1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  challengeText: {
    fontSize: "0.88rem",
    lineHeight: 1.5,
    color: "var(--text-dim)",
  },
  retakeBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    fontSize: "0.72rem",
    letterSpacing: "0.12em",
    cursor: "pointer",
    padding: "0.5rem",
    transition: "color 0.2s",
  },
};
