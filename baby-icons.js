/* Cute baby SVG illustrations per stage */
const BABY_SVGS = {
  // Stage 1: Tiny seed with heart (weeks 4-6)
  seed: `<svg viewBox="0 0 100 100" width="80" height="80">
    <defs><radialGradient id="gs" cx="40%" cy="40%"><stop offset="0%" stop-color="#ffe0ec"/><stop offset="100%" stop-color="#ffb6c1"/></radialGradient></defs>
    <circle cx="50" cy="52" r="18" fill="url(#gs)" stroke="#ff8fa3" stroke-width="1.5"/>
    <path d="M46 49 Q50 43 54 49 Q58 55 50 60 Q42 55 46 49Z" fill="#ff6b8a" opacity="0.8"/>
    <circle cx="50" cy="52" r="28" fill="none" stroke="#ffd6e0" stroke-width="1" stroke-dasharray="4 3" opacity="0.5">
      <animateTransform attributeName="transform" type="rotate" from="0 50 52" to="360 50 52" dur="20s" repeatCount="indefinite"/>
    </circle>
    <text x="50" y="90" text-anchor="middle" font-size="10" fill="#ff8fa3" font-family="sans-serif">tiny bean</text>
  </svg>`,

  // Stage 2: Small embryo with big head (weeks 7-9)
  embryo: `<svg viewBox="0 0 100 100" width="80" height="80">
    <defs><radialGradient id="ge" cx="40%" cy="35%"><stop offset="0%" stop-color="#ffe8cc"/><stop offset="100%" stop-color="#ffd1a3"/></radialGradient></defs>
    <ellipse cx="50" cy="42" rx="16" ry="18" fill="url(#ge)" stroke="#ffb366" stroke-width="1.2"/>
    <ellipse cx="50" cy="65" rx="10" ry="12" fill="url(#ge)" stroke="#ffb366" stroke-width="1"/>
    <circle cx="44" cy="39" r="2" fill="#6b4c3b"/>
    <circle cx="56" cy="39" r="2" fill="#6b4c3b"/>
    <path d="M47 45 Q50 48 53 45" fill="none" stroke="#ff8fa3" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M36 50 Q30 58 35 64" fill="none" stroke="#ffd1a3" stroke-width="3" stroke-linecap="round"/>
    <path d="M64 50 Q70 58 65 64" fill="none" stroke="#ffd1a3" stroke-width="3" stroke-linecap="round"/>
    <circle cx="44" cy="37" r="3" fill="white" opacity="0.3"/>
    <circle cx="56" cy="37" r="3" fill="white" opacity="0.3"/>
    <path d="M46 49 Q50 43 54 49 Q58 55 50 60 Q42 55 46 49Z" fill="#ff6b8a" opacity="0.15" transform="translate(0,-5) scale(0.4)" transform-origin="50 52"/>
  </svg>`,

  // Stage 3: Cute fetus (weeks 10-15)
  fetus1: `<svg viewBox="0 0 100 100" width="80" height="80">
    <defs>
      <radialGradient id="gf1" cx="40%" cy="35%"><stop offset="0%" stop-color="#ffe8d6"/><stop offset="100%" stop-color="#ffcba4"/></radialGradient>
    </defs>
    <g transform="translate(50,50) rotate(-20) translate(-50,-50)">
      <ellipse cx="50" cy="35" rx="18" ry="20" fill="url(#gf1)" stroke="#e8a87c" stroke-width="1"/>
      <ellipse cx="50" cy="62" rx="14" ry="18" fill="url(#gf1)" stroke="#e8a87c" stroke-width="1"/>
      <circle cx="44" cy="32" r="2.5" fill="#5c4033"/>
      <circle cx="56" cy="32" r="2.5" fill="#5c4033"/>
      <circle cx="44" cy="31" r="1" fill="white"/>
      <circle cx="56" cy="31" r="1" fill="white"/>
      <path d="M47 38 Q50 41 53 38" fill="none" stroke="#ff8fa3" stroke-width="1.5" stroke-linecap="round"/>
      <ellipse cx="41" cy="36" rx="4" ry="2.5" fill="#ffb6c1" opacity="0.4"/>
      <ellipse cx="59" cy="36" rx="4" ry="2.5" fill="#ffb6c1" opacity="0.4"/>
      <path d="M34 45 Q26 55 32 68" fill="none" stroke="#ffcba4" stroke-width="4" stroke-linecap="round"/>
      <path d="M66 45 Q74 55 68 68" fill="none" stroke="#ffcba4" stroke-width="4" stroke-linecap="round"/>
      <path d="M42 72 Q38 82 42 88" fill="none" stroke="#ffcba4" stroke-width="4" stroke-linecap="round"/>
      <path d="M58 72 Q62 82 58 88" fill="none" stroke="#ffcba4" stroke-width="4" stroke-linecap="round"/>
    </g>
  </svg>`,

  // Stage 4: Bigger baby, curled up (weeks 16-24)
  fetus2: `<svg viewBox="0 0 100 100" width="80" height="80">
    <defs>
      <radialGradient id="gf2" cx="40%" cy="35%"><stop offset="0%" stop-color="#ffe8d6"/><stop offset="100%" stop-color="#f4c5a0"/></radialGradient>
    </defs>
    <g transform="translate(50,48) rotate(-30) translate(-50,-48)">
      <ellipse cx="48" cy="30" rx="20" ry="22" fill="url(#gf2)" stroke="#d4a574" stroke-width="1"/>
      <ellipse cx="50" cy="60" rx="18" ry="22" fill="url(#gf2)" stroke="#d4a574" stroke-width="1"/>
      <circle cx="42" cy="27" r="2.5" fill="#4a3728">
        <animate attributeName="r" values="2.5;1;2.5" dur="4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="54" cy="27" r="2.5" fill="#4a3728">
        <animate attributeName="r" values="2.5;1;2.5" dur="4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="42" cy="26" r="1" fill="white"/>
      <circle cx="54" cy="26" r="1" fill="white"/>
      <path d="M45 33 Q48 36 51 33" fill="none" stroke="#ff8fa3" stroke-width="1.5" stroke-linecap="round"/>
      <ellipse cx="38" cy="30" rx="5" ry="3" fill="#ffb6c1" opacity="0.35"/>
      <ellipse cx="58" cy="30" rx="5" ry="3" fill="#ffb6c1" opacity="0.35"/>
      <path d="M30 42 Q22 55 30 70 Q35 75 42 72" fill="none" stroke="#f4c5a0" stroke-width="5" stroke-linecap="round"/>
      <path d="M66 42 Q72 52 65 62" fill="none" stroke="#f4c5a0" stroke-width="5" stroke-linecap="round"/>
      <path d="M38 75 Q34 85 40 92" fill="none" stroke="#f4c5a0" stroke-width="5" stroke-linecap="round"/>
      <path d="M58 72 Q65 82 60 90" fill="none" stroke="#f4c5a0" stroke-width="5" stroke-linecap="round"/>
    </g>
  </svg>`,

  // Stage 5: Almost full baby, sucking thumb (weeks 25-34)
  fetus3: `<svg viewBox="0 0 100 100" width="80" height="80">
    <defs>
      <radialGradient id="gf3" cx="40%" cy="35%"><stop offset="0%" stop-color="#ffe0d0"/><stop offset="100%" stop-color="#f0b897"/></radialGradient>
    </defs>
    <g transform="translate(50,50) rotate(-15) translate(-50,-50)">
      <ellipse cx="48" cy="28" rx="22" ry="24" fill="url(#gf3)" stroke="#c99570" stroke-width="1"/>
      <ellipse cx="50" cy="62" rx="20" ry="24" fill="url(#gf3)" stroke="#c99570" stroke-width="1"/>
      <circle cx="40" cy="24" r="2.5" fill="#3d2b1f"/>
      <circle cx="54" cy="24" r="2.5" fill="#3d2b1f"/>
      <circle cx="40" cy="23" r="1.2" fill="white"/>
      <circle cx="54" cy="23" r="1.2" fill="white"/>
      <path d="M44 31 Q48 34 52 31" fill="none" stroke="#ff8fa3" stroke-width="1.5" stroke-linecap="round"/>
      <ellipse cx="36" cy="28" rx="5" ry="3" fill="#ffb6c1" opacity="0.3"/>
      <ellipse cx="60" cy="28" rx="5" ry="3" fill="#ffb6c1" opacity="0.3"/>
      <path d="M28 40 Q20 55 28 72 Q34 80 42 76" fill="none" stroke="#f0b897" stroke-width="5.5" stroke-linecap="round"/>
      <circle cx="42" cy="76" r="4" fill="#f0b897" stroke="#c99570" stroke-width="0.5"/>
      <path d="M68 40 Q74 50 68 62" fill="none" stroke="#f0b897" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M36 78 Q30 90 38 96" fill="none" stroke="#f0b897" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M60 76 Q68 88 62 96" fill="none" stroke="#f0b897" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M46 14 Q44 8 48 6 Q52 8 50 14" fill="#f0b897" stroke="none" opacity="0.6"/>
    </g>
  </svg>`,

  // Stage 6: Full term baby, ready! (weeks 35-40)
  baby: `<svg viewBox="0 0 100 100" width="80" height="80">
    <defs>
      <radialGradient id="gb" cx="40%" cy="35%"><stop offset="0%" stop-color="#ffe0d0"/><stop offset="100%" stop-color="#f0b897"/></radialGradient>
    </defs>
    <g transform="translate(50,48) rotate(-10) translate(-50,-48)">
      <ellipse cx="48" cy="26" rx="24" ry="26" fill="url(#gb)" stroke="#c99570" stroke-width="1"/>
      <ellipse cx="50" cy="62" rx="22" ry="26" fill="url(#gb)" stroke="#c99570" stroke-width="1"/>
      <circle cx="40" cy="22" r="3" fill="#3d2b1f"/>
      <circle cx="56" cy="22" r="3" fill="#3d2b1f"/>
      <circle cx="41" cy="21" r="1.5" fill="white"/>
      <circle cx="57" cy="21" r="1.5" fill="white"/>
      <path d="M44 30 Q48 34 52 30" fill="none" stroke="#ff8fa3" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="35" cy="26" rx="6" ry="3.5" fill="#ffb6c1" opacity="0.35"/>
      <ellipse cx="63" cy="26" rx="6" ry="3.5" fill="#ffb6c1" opacity="0.35"/>
      <path d="M26 38 Q16 55 26 75 Q34 84 44 78" fill="none" stroke="#f0b897" stroke-width="6" stroke-linecap="round"/>
      <path d="M70 38 Q78 52 70 65" fill="none" stroke="#f0b897" stroke-width="6" stroke-linecap="round"/>
      <path d="M34 82 Q28 94 36 98" fill="none" stroke="#f0b897" stroke-width="6" stroke-linecap="round"/>
      <path d="M62 80 Q70 92 64 98" fill="none" stroke="#f0b897" stroke-width="6" stroke-linecap="round"/>
      <path d="M38 10 Q36 2 42 0 Q48 2 46 10" fill="#f0b897" stroke="none" opacity="0.5"/>
      <path d="M52 10 Q54 4 58 2 Q62 6 56 12" fill="#f0b897" stroke="none" opacity="0.5"/>
      <text x="50" y="98" text-anchor="middle" font-size="8" fill="#ff8fa3">♡</text>
    </g>
  </svg>`,
};

function getBabySvg(weeks) {
  if (weeks <= 6) return BABY_SVGS.seed;
  if (weeks <= 9) return BABY_SVGS.embryo;
  if (weeks <= 15) return BABY_SVGS.fetus1;
  if (weeks <= 24) return BABY_SVGS.fetus2;
  if (weeks <= 34) return BABY_SVGS.fetus3;
  return BABY_SVGS.baby;
}

// Export for use in app.js
window.getBabySvg = getBabySvg;
