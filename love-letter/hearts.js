/* Heart made of "I love you" in many languages (inspired by the turtle video).
   Heart curve:  x = 16 sin^3 t
                 y = 13 cos t - 5 cos 2t - 2 cos 3t - cos 4t           */
const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");
const envelopeEl = document.getElementById("envelope");

const PHRASES = [
  "I love you", "Te amo", "Je t'aime", "Ich liebe dich", "Ti amo", "Eu te amo",
  "Seni seviyorum", "Jag älskar dig", "Ik hou van jou", "Kocham cię", "Aku cinta kamu",
  "Anh yêu em", "Σ' αγαπώ", "Я тебя люблю", "사랑해", "愛してる", "我爱你",
  "Mahal kita", "Rakastan sinua", "Jeg elsker deg", "Szeretlek", "Te iubesc",
  "Volim te", "Miluji tě", "Ég elska þig", "Ana behibek", "ฉันรักเธอ", "मैं तुमसे प्यार करता हूँ"
];
const COLORS = ["#ff1f3d", "#e0102f", "#ff4d5e", "#c4122c", "#ff7a85", "#9c0b20"];

let W, H, dpr, cx, cy, S;
let words = [];
let sweepT = 0;          // phase 1: outline is traced once around the heart
let boost = 0;           // heartbeat strength, raised when the letter opens
const MAX_WORDS = 650;

function resize() {
  dpr = window.devicePixelRatio || 1;
  W = innerWidth; H = innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const r = envelopeEl.getBoundingClientRect();     // heart is centred on the envelope
  cx = r.left + r.width / 2;
  cy = r.top + r.height / 2;
  S = Math.min(W * 0.92 / 34, H * 0.8 / 30);        // pixels per heart unit
}

function heartPoint(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const f = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return { x, y: -f - 2.5 };                         // -2.5 centres it vertically
}

function addWord(t, k) {
  const p = heartPoint(t);
  words.push({
    text: PHRASES[(Math.random() * PHRASES.length) | 0],
    x: p.x * k, y: p.y * k,
    size: (8 + Math.random() * 7) * Math.max(0.8, S / 18),
    color: COLORS[(Math.random() * COLORS.length) | 0],
    born: performance.now()
  });
}

function spawn() {
  if (sweepT < Math.PI * 2) {                        // trace the outline first
    for (let i = 0; i < 3; i++) { addWord(sweepT, 1); sweepT += 0.025; }
  } else if (words.length < MAX_WORDS) {             // then fill inwards
    for (let i = 0; i < 4; i++) {
      addWord(Math.random() * Math.PI * 2, 1 - 0.92 * Math.pow(Math.random(), 0.9));
    }
  }
}

function frame(now) {
  spawn();
  ctx.clearRect(0, 0, W, H);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const beat = 1 + (0.02 + 0.03 * boost) * Math.pow(Math.max(0, Math.sin(now / 260)), 3);
  boost *= 0.985;
  ctx.shadowColor = "#ff1f3d";
  ctx.shadowBlur = 2 + 8 * boost;

  for (const w of words) {
    ctx.globalAlpha = Math.min(1, (now - w.born) / 500);
    ctx.fillStyle = w.color;
    ctx.font = `700 ${w.size}px Lato, "Noto Sans", sans-serif`;
    ctx.fillText(w.text, cx + w.x * S * beat, cy + w.y * S * beat);
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(frame);
}

window.heartBurst = () => { boost = 1; };           // called when the envelope opens
addEventListener("resize", resize);
resize();
requestAnimationFrame(frame);
