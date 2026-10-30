(() => {
const reduce = false;

const cv = document.createElement("canvas");
cv.id = "ender"; cv.setAttribute("aria-hidden", "true");
const hit = document.createElement("button");
hit.id = "ender-hit"; hit.hidden = true;
hit.setAttribute("aria-label", "Enderman: tócalo y se teletransporta");
const treeHit = document.createElement("button");
treeHit.id = "tree-hit"; treeHit.hidden = true;
treeHit.setAttribute("aria-label", "Madera de cerezo: toca 5 veces para talar el árbol");
treeHit.style.cssText = "position:fixed;z-index:4;border:0;padding:0;background:none;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent";
const probe = document.createElement("div");
probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;pointer-events:none;" +
  "padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)";
document.body.append(cv, treeHit, hit, probe);
const ctx = cv.getContext("2d");

/* Texturas de bloques (16x16) */
const rng = seed => () => (seed = seed * 16807 % 2147483647) / 2147483647;
const HEART = [
  "................", "................", "................",
  "...XXX....XXX...", "..XXXXX..XXXXX..", "..XXXXXXXXXXXX..",
  "..XXXXXXXXXXXX..", "...XXXXXXXXXX...", "....XXXXXXXX....",
  ".....XXXXXX.....", "......XXXX......", ".......XX.......",
  "................", "................", "................", "................"
];
const PAL = {
  rose: ["#f3bccb", "#eaa8ba", "#f8cfda", "#e597ad"]
};
const PIX = {
  grass: {
    p: {0:"#70b848",1:"#78b848",2:"#70b048",3:"#68a838",4:"#70b040",5:"#60a030",6:"#68b040",7:"#80c050",8:"#68a840",9:"#60a038",a:"#509028",b:"#88b858",c:"#80b050",d:"#584028",e:"#90c060",f:"#88c060",g:"#98d068",h:"#60a838",i:"#98c868",j:"#589830",k:"#707070",l:"#785838",m:"#987048",n:"#b88860",o:"#888888"},
    r: ["01233456718889a4","06bccd895ee29686","fdgh8d2d07eidj9d","dkdd2ddd5d4dlddl","mlmndmlldddklmdl","ldmmlmdddlldllln","ndllollnnlnnlmlm","nlnnmmllmdmmllmm","mllmlmldlmmllldl","mmdllddlllllnnlm","mmlnnlnmdnnlmmol","mllmmnlmkmmldmld","ldmlmmnlllllllnn","lmlldlmmldndlnmm","mldnldldllldllmm","mlnmmlommmllmmld"]
  },
  dirt: {
    p: {0:"#b88860",1:"#987048",2:"#785838",3:"#584028",4:"#888888",5:"#707070",6:"#705840"},
    r: ["0112201122322020","2132214320120133","0223022202223302","1502132011212012","1210312213252132","2311213332232220","0222422002002121","2200112213112211","1221212321122232","2132233222220021","2120020130031142","1221102151123123","2312110222222200","2122621123032011","1230232300212211","1201124211221123"]
  },
  stone: {
    p: {0:"#808080",1:"#707070",2:"#909090",3:"#686868"},
    r: ["0111102232011110","0022222212223001","0311311121000200","0200030200111110","0221111111222223","1100011103001130","2200012200002223","0001111113111100","0223210002222222","0111111030011120","0021122131222000","3000100022000223","0111111122111110","0212300111310022","0001111100220110","1111322000011100"]
  },
  cherry_sapling: {
    p: {0:"#e986bb",1:"#f5daef",2:"#ec95bf",3:"#efa7cd",4:"#fccbe7",5:"#543543",6:"#f7b9dc",7:"#301d29",8:"#271620",9:"#3b232d",a:"#462c39",b:"#27111e"},
    r: ["................","................",".0...1.22.33.3..","..331412..335...","..332166...2533.",".3322766..55133.","6667776.766141..","668722..666.15..",".089a2.962.7566.","..8877aaa988663.",".6668777b82.....","..618883.22.....","..141879........","...1.8778.......","......888.......","......888......."]
  },
  cherry_log: {
    p: {0:"#301d29",1:"#3b232d",2:"#462c39",3:"#271620",4:"#543543"},
    r: ["0122110001100110","1000022211033300","3301112444220330","1110333011122210","1000011033333300","2221100003301122","2100033312221002","0001103011033300","3322442200011033","3300122033303330","0033330030010301","2130111012224442","1001244222100011","0330000122211000","0011133000111122","2222110332442111"]
  },
  cherry_leaves: {
    p: {0:"#eb92c1",1:"#84992d",2:"#efa7cd",3:"#f7b9dc",4:"#e67db5",5:"#f5daef",6:"#fccbe7",7:"#f396cd",8:"#738726",9:"#e96aa9",a:"#e2aabf",b:"#607620",c:"#f6a1d4",d:"#e25692"},
    r: ["..01.0..233..040",".455502..333.60.","20656402113.626.","5676765181240622","5569655.1202a112","5676765..225558b",".4656400..16564.",".0555.0405676765","0042...025569655",".641.666.6676765","626813630046564.",".6.639c934.555..","34466cdc66.cc..3","334639c936ccc132","230b8363400c1833","3418166620..1103"]
  }
};
function makeTex(type, seed) {
  const c = document.createElement("canvas"); c.width = c.height = 16;
  const g = c.getContext("2d"), r = rng(seed);
  const px = (x, y, col) => { g.fillStyle = col; g.fillRect(x, y, 1, 1); };
  const pick = arr => arr[Math.floor(r() * arr.length)];
  const T = PIX[type];
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    if (T) {
      const ch = T.r[y][x];
      if (ch !== ".") px(x, y, T.p[ch]);
      else if (type === "cherry_leaves" && x > 0 && x < 15 && y > 0 && y < 15) px(x, y, "#993d6f");
    } else px(x, y, HEART[y][x] === "X" ? (r() < .15 ? "#a81f44" : "#c42a52") : pick(PAL.rose));
  }
  if (type !== "cherry_sapling" && type !== "cherry_leaves") {
    g.fillStyle = "rgba(0,0,0,.18)";
    g.fillRect(0, 15, 16, 1); g.fillRect(15, 0, 1, 16);
  }
  return c;
}
const TYPES = ["grass", "dirt", "stone", "rose"];
const ALL_TEX = [...TYPES, "cherry_sapling", "cherry_log", "cherry_leaves"];
const TEX = Object.fromEntries(ALL_TEX.map((t, i) => [t, makeTex(t, 1234 + i * 777)]));

/* Dimensiones y suelo */
let W = 0, H = 0, ground = 0, inB = 0, inL = 0, inR = 0, s = 1.5, dpr = 1, off = 0;
let slots = [];
const slotX = i => off + i * 16 * s + 8 * s;

function layout() {
  const cs = getComputedStyle(probe);
  inB = parseFloat(cs.paddingBottom) || 0;
  inL = parseFloat(cs.paddingLeft) || 0;
  inR = parseFloat(cs.paddingRight) || 0;
  dpr = Math.min(window.devicePixelRatio || 1, 3);
  W = document.documentElement.clientWidth;
  s = Math.min(2.4, Math.max(1.4, W / 260));
  const B = 16 * s;
  H = Math.ceil(172 * s);
  ground = H - B;
  cv.style.height = (H + inB) + "px";
  cv.width = Math.round(W * dpr); cv.height = Math.round((H + inB) * dpr);

  const usable = W - inL - inR - 8;
  const n = Math.max(4, Math.floor(usable / B));
  off = inL + 4 + (usable - n * B) / 2;
  if (n !== slots.length) {
    const old = slots; slots = [];
    for (let i = 0; i < n; i++) slots.push(old[i] || []);
    if (!old.length) seed();
    plan = []; step = null;
  }
  E.x = Math.min(Math.max(E.x || W * .7, 12 * s + inL), W - 12 * s - inR);
  hitW = Math.max(44, 20 * s); hitH = Math.max(44, 52 * s);
  hit.style.width = hitW + "px"; hit.style.height = hitH + "px";
  hit.style.bottom = (inB + B) + "px";
}
function seed() {
  const r = Math.random;
  slots.forEach(st => {
    const v = r();
    if (v < .3) st.push(r() < .25 ? "rose" : TYPES[Math.floor(r() * 3)]);
    else if (v < .36) st.push(TYPES[Math.floor(r() * 3)], "rose");
  });
  if (!slots.some(st => st.length)) slots[1].push("rose");
}

/* Estado y ajustes */
const E = { x: 0, dir: -1, alpha: 0, sx: 1, sy: 1, shake: 0, ph: 0 };
const P = { L: 0, aF: 0, aB: 0, lF: 0, lB: 0, head: 0, bob: 0 };
const T = { ...P };
const REACH = [{ L: .45, a: -.5 }, { L: .15, a: -.95 }];
const CARRY = -1.0;
let holding = null, holdT = 1, holdFrom = null, placing = null, lastSrc = -1;
let plan = [], step = null, st = 0, angry = 0, time = 0, hitW = 44, hitH = 44;
let parts = [], ambient = 0, ac = null;
let stayLeft = 0, lastTap = -99, idleTimer = 3.5;

const AJUSTES = {
  visibleMin: 25, visibleMax: 50,
  ausenteMin: 10, ausenteMax: 40,
  castigoToque: 300,
  dobleToque: 4,
  idleMin: 5, idleMax: 11,
  volumen: 0.85
};
const between = (a, b) => a + Math.random() * (b - a);

function handPos(L, a, bob = 0) {
  const hipY = -28 + bob, shx = 11 * Math.sin(L), shy = hipY - 11 * Math.cos(L);
  return { x: shx - 28 * Math.sin(a), y: shy + 28 * Math.cos(a) };
}
function heldWorld() {
  const h = handPos(P.L, P.aF, P.bob);
  return { x: E.x + (h.x + 1) * s * E.dir * E.sx, y: ground + (h.y - 5) * s * E.sy };
}

/* Partículas y sonidos */
const PCOL = ["#b14be0", "#e07cff", "#7a2fb0", "#d9a6ff"];
function spawn(x, y, n, spread, speed) {
  for (let i = 0; i < n; i++) parts.push({
    x: x + (Math.random() - .5) * spread, y: y - Math.random() * 48 * s,
    vx: (Math.random() - .5) * speed, vy: -Math.random() * speed * .8 - 6 * s,
    life: 0, max: .6 + Math.random() * .8, sz: (1 + Math.random() * 1.4) * s,
    c: PCOL[Math.floor(Math.random() * PCOL.length)]
  });
}

function vwoop() {
  if (!ac || ac.state !== "running") return;
  try {
    const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
    o.type = "triangle"; f.type = "lowpass"; f.frequency.value = 1400;
    o.frequency.setValueAtTime(520, t); o.frequency.exponentialRampToValueAtTime(140, t + .18);
    o.frequency.exponentialRampToValueAtTime(380, t + .32);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.09, t + .03);
    g.gain.exponentialRampToValueAtTime(.0001, t + .34);
    o.connect(f).connect(g).connect(ac.destination); o.start(t); o.stop(t + .36);
  } catch (_) {}
}
const SND_FILES = {
  idle: [
    "sonidos/sonido_neutral.mp3",
    "sonidos/sonido_neutral_2.mp3",
    "sonidos/sonido_neutral_3.mp3"
  ],
  tp: [
    "sonidos/teleport.mp3",
    "sonidos/teleport_2.mp3"
  ]
};
const SND_BUF = { idle: [], tp: [] };
const SND_EL = {
  idle: SND_FILES.idle.map(u => { const a = new Audio(u); a.preload = "auto"; return a; }),
  tp: SND_FILES.tp.map(u => { const a = new Audio(u); a.preload = "auto"; return a; })
};
let sndLoading = false;
function loadSounds() {
  if (sndLoading || !ac) return;
  sndLoading = true;
  for (const k of ["idle", "tp"]) {
    SND_FILES[k].forEach(url => {
      fetch(url)
        .then(r => r.ok ? r.arrayBuffer() : Promise.reject())
        .then(b => new Promise((res, rej) => ac.decodeAudioData(b, res, rej)))
        .then(buf => SND_BUF[k].push(buf))
        .catch(() => {});
    });
  }
}
function unlockAudio() {
  try {
    ac = window.__mcAC = window.__mcAC || ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === "suspended") ac.resume();
    loadSounds();
  } catch (_) {}
}
addEventListener("touchstart", unlockAudio, { passive: true });
addEventListener("pointerdown", unlockAudio, { passive: true });
addEventListener("click", unlockAudio);
function playSnd(kind, vol = AJUSTES.volumen) {
  unlockAudio();
  const list = SND_BUF[kind];
  if (ac && list && list.length) {
    try {
      if (ac.state === "suspended") ac.resume();
      const src = ac.createBufferSource(), g = ac.createGain();
      src.buffer = list[Math.floor(Math.random() * list.length)];
      src.playbackRate.value = .94 + Math.random() * .12;
      g.gain.value = vol;
      src.connect(g).connect(ac.destination);
      src.start(0);
      return;
    } catch (_) {}
  }
  const els = SND_EL[kind];
  if (els && els.length) {
    try {
      const base = els[Math.floor(Math.random() * els.length)];
      const clone = base.cloneNode();
      clone.volume = Math.min(1, vol);
      clone.play().catch(() => { if (kind === "tp") vwoop(); });
      return;
    } catch (_) {}
  }
  if (kind === "tp") vwoop();
}
const tpSound = () => playSnd("tp");
const idleSound = () => playSnd("idle", AJUSTES.volumen * .85);

/* Árbol grande de cerezo (al darle doble toque al Enderman) y talado en 5 toques */
let cherryTree = null;
const TREE_BLOCKS = [
  // Tronco principal y raíces
  { dx: 0, k: 0, t: "cherry_log", d: 0.00 },
  { dx: 1, k: 0, t: "cherry_log", d: 0.03 },
  { dx: 0, k: 1, t: "cherry_log", d: 0.06 },
  { dx: 0, k: 2, t: "cherry_log", d: 0.10 },
  { dx: 0, k: 3, t: "cherry_log", d: 0.14 },
  { dx: 0, k: 4, t: "cherry_log", d: 0.18 },
  // Rama izquierda curvada
  { dx: -1, k: 3, t: "cherry_log", d: 0.21 },
  { dx: -2, k: 3, t: "cherry_log", d: 0.24 },
  { dx: -2, k: 4, t: "cherry_log", d: 0.27 },
  { dx: -3, k: 4, t: "cherry_log", d: 0.30 },
  // Rama derecha curvada
  { dx: 1, k: 2, t: "cherry_log", d: 0.20 },
  { dx: 1, k: 3, t: "cherry_log", d: 0.23 },
  { dx: 2, k: 4, t: "cherry_log", d: 0.26 },
  { dx: 3, k: 4, t: "cherry_log", d: 0.29 },
  { dx: 3, k: 5, t: "cherry_log", d: 0.32 },
  // Racimos colgantes de flores de cerezo (k = 3)
  { dx: -4, k: 3, t: "cherry_leaves", d: 0.35 },
  { dx: -3, k: 3, t: "cherry_leaves", d: 0.37 },
  { dx: 4,  k: 3, t: "cherry_leaves", d: 0.39 },
  // Capa baja de la copa (k = 4)
  { dx: -5, k: 4, t: "cherry_leaves", d: 0.41 },
  { dx: -4, k: 4, t: "cherry_leaves", d: 0.43 },
  { dx: -1, k: 4, t: "cherry_leaves", d: 0.45 },
  { dx: 1,  k: 4, t: "cherry_leaves", d: 0.47 },
  { dx: 4,  k: 4, t: "cherry_leaves", d: 0.49 },
  { dx: 5,  k: 4, t: "cherry_leaves", d: 0.51 },
  // Capa media frondosa (k = 5, 11 bloques de ancho)
  { dx: -5, k: 5, t: "cherry_leaves", d: 0.53 },
  { dx: -4, k: 5, t: "cherry_leaves", d: 0.55 },
  { dx: -3, k: 5, t: "cherry_leaves", d: 0.57 },
  { dx: -2, k: 5, t: "cherry_leaves", d: 0.59 },
  { dx: -1, k: 5, t: "cherry_leaves", d: 0.61 },
  { dx: 0,  k: 5, t: "cherry_leaves", d: 0.63 },
  { dx: 1,  k: 5, t: "cherry_leaves", d: 0.65 },
  { dx: 2,  k: 5, t: "cherry_leaves", d: 0.67 },
  { dx: 4,  k: 5, t: "cherry_leaves", d: 0.69 },
  { dx: 5,  k: 5, t: "cherry_leaves", d: 0.71 },
  // Capa alta frondosa (k = 6, 9 bloques de ancho)
  { dx: -4, k: 6, t: "cherry_leaves", d: 0.73 },
  { dx: -3, k: 6, t: "cherry_leaves", d: 0.75 },
  { dx: -2, k: 6, t: "cherry_leaves", d: 0.77 },
  { dx: -1, k: 6, t: "cherry_leaves", d: 0.79 },
  { dx: 0,  k: 6, t: "cherry_leaves", d: 0.81 },
  { dx: 1,  k: 6, t: "cherry_leaves", d: 0.83 },
  { dx: 2,  k: 6, t: "cherry_leaves", d: 0.85 },
  { dx: 3,  k: 6, t: "cherry_leaves", d: 0.87 },
  { dx: 4,  k: 6, t: "cherry_leaves", d: 0.89 },
  // Corona superior (k = 7 y k = 8)
  { dx: -3, k: 7, t: "cherry_leaves", d: 0.91 },
  { dx: -2, k: 7, t: "cherry_leaves", d: 0.92 },
  { dx: -1, k: 7, t: "cherry_leaves", d: 0.93 },
  { dx: 0,  k: 7, t: "cherry_leaves", d: 0.94 },
  { dx: 1,  k: 7, t: "cherry_leaves", d: 0.95 },
  { dx: 2,  k: 7, t: "cherry_leaves", d: 0.96 },
  { dx: 3,  k: 7, t: "cherry_leaves", d: 0.97 },
  { dx: -1, k: 8, t: "cherry_leaves", d: 0.98 },
  { dx: 0,  k: 8, t: "cherry_leaves", d: 0.99 },
  { dx: 1,  k: 8, t: "cherry_leaves", d: 1.00 }
];
const isProtectedSlot = i => cherryTree && Math.abs(i - cherryTree.slot) <= 4;

function woodSound(finalBreak) {
  unlockAudio();
  if (!ac || ac.state !== "running") return;
  try {
    const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(finalBreak ? 145 : 210, t);
    o.frequency.exponentialRampToValueAtTime(finalBreak ? 55 : 95, t + (finalBreak ? .22 : .09));
    g.gain.setValueAtTime(.14, t);
    g.gain.exponentialRampToValueAtTime(.001, t + (finalBreak ? .24 : .1));
    o.connect(g).connect(ac.destination);
    o.start(t); o.stop(t + (finalBreak ? .25 : .11));
  } catch (_) {}
}

function spawnCustom(x, y, n, spread, speed, cols) {
  for (let i = 0; i < n; i++) parts.push({
    x: x + (Math.random() - .5) * spread, y: y - Math.random() * 28 * s,
    vx: (Math.random() - .5) * speed, vy: -Math.random() * speed * .7 - 4 * s,
    life: 0, max: .7 + Math.random() * .9, sz: (1.2 + Math.random() * 1.5) * s,
    c: cols[Math.floor(Math.random() * cols.length)]
  });
}

/* Comportamiento y decisiones */
const rand = a => a[Math.floor(Math.random() * a.length)];
const idx = fn => slots.map((_, i) => i).filter(fn);
function tpStep() {
  let x, tries = 0, lo = 12 * s + inL, hi = W - 12 * s - inR;
  do x = lo + Math.random() * (hi - lo); while (Math.abs(x - E.x) < W * .25 && ++tries < 12);
  return { t: "tp", x };
}
function go(i, k, act) {
  const sx = slotX(i), h = handPos(REACH[k].L, REACH[k].a);
  let dir = sx >= E.x ? 1 : -1, x = sx - dir * h.x * s;
  if (x < 8 + inL || x > W - 8 - inR) { dir = -dir; x = sx - dir * h.x * s; }
  const far = Math.abs(x - E.x) > W * .5 && Math.random() < .6;
  plan = [far ? { t: "tp", x } : { t: "walk", x }, { t: "face", dir }, { t: "reach", slot: i, k, act }];
}
function think() {
  if (reduce) { plan = [{ t: "wait", d: 1e9 }]; return; }
  if (!holding && stayLeft <= 0) {
    plan = [{ t: "wait", d: 1, front: true }, { t: "vanish" },
      { t: "away", d: between(AJUSTES.ausenteMin, AJUSTES.ausenteMax) }, { t: "appear" }];
    return;
  }
  const r = Math.random();
  if (holding) {
    const free = idx(i => !isProtectedSlot(i) && slots[i].length < 2 && i !== lastSrc);
    if (r < .18 || !free.length) plan = [tpStep()];
    else { const i = rand(free); go(i, slots[i].length, "place"); }
  } else {
    const full = idx(i => !isProtectedSlot(i) && slots[i].length > 0);
    if (r < .62 && full.length) { const i = rand(full); lastSrc = i; go(i, slots[i].length - 1, "pick"); }
    else if (r < .8) plan = [tpStep()];
    else plan = [{ t: "face", dir: -E.dir }, { t: "wait", d: .8 + Math.random() * 1.5, front: false }];
  }
  plan.push({ t: "wait", d: .6 + Math.random() * 1.8, front: true });
}
function act(sp) {
  const stack = slots[sp.slot];
  if (sp.act === "place_sapling") {
    for (let d = -3; d <= 3; d++) if (slots[sp.slot + d]) slots[sp.slot + d].length = 0;
    placing = { type: "cherry_sapling", slot: sp.slot, k: 0, t: 0, from: heldWorld(), isSapling: true };
    holding = null;
    return;
  }
  if (sp.act === "pick" && !holding && stack && stack.length - 1 === sp.k) {
    holding = stack.pop(); holdT = 0;
    holdFrom = { x: slotX(sp.slot), y: ground - (sp.k * 16 + 8) * s };
  } else if (sp.act === "place" && holding && stack && stack.length === sp.k) {
    placing = { type: holding, slot: sp.slot, k: sp.k, t: 0, from: heldWorld() };
    holding = null;
  }
}
const next = () => { step = plan.shift() || null; st = 0; };

/* Actualización */
function update(dt) {
  time += dt;
  angry = Math.max(0, angry - dt);
  const sway = Math.sin(time * 1.6) * .04;
  Object.assign(T, {
    L: 0, lF: 0, lB: 0, bob: 0, head: angry > 0 ? 1 : 0,
    aF: holding ? CARRY : sway, aB: holding ? CARRY + .06 : -sway
  });

  if (!step) { if (!plan.length) think(); next(); }
  E.front = false;
  if (E.alpha > .99) {
    stayLeft -= dt;
    if ((idleTimer -= dt) <= 0) {
      idleTimer = between(AJUSTES.idleMin, AJUSTES.idleMax);
      if (!step || (step.t !== "tp" && step.t !== "vanish" && step.t !== "appear" && step.t !== "appear_cherry")) idleSound();
    }
  }
  if (step) {
    st += dt;
    switch (step.t) {
      case "wait": E.front = !holding && step.front === true; if (st >= step.d) next(); break;
      case "face": E.dir = step.dir; next(); break;
      case "walk": {
        const d = step.x - E.x;
        if (Math.abs(d) < .5) { E.x = step.x; next(); break; }
        E.dir = Math.sign(d);
        const v = Math.min(Math.abs(d), (step.fast ? 44 : 30) * s * dt);
        E.x += E.dir * v; E.ph += v / (s * 6);
        const sw = Math.sin(E.ph);
        T.lF = sw * .32; T.lB = -sw * .32; T.bob = -Math.abs(Math.cos(E.ph)) * 1;
        if (!holding) { T.aF = -sw * .22; T.aB = sw * .22; }
        break;
      }
      case "reach": {
        const R = REACH[step.k];
        if (st < .85) { T.L = R.L; T.aF = R.a; T.aB = R.a + .08; }
        if (!step.done && st >= .55) { step.done = 1; act(step); }
        if (st >= 1.25) next();
        break;
      }
      case "angry":
        E.front = !holding;
        T.head = 1; E.shake = (Math.random() - .5) * 2.4 * s;
        if (st >= step.d) { E.shake = 0; next(); }
        break;
      case "vanish": {
        if (!step.a) { step.a = 1; if (E.alpha > .5) { spawn(E.x, ground, 26, 16 * s, 60 * s); tpSound(); } }
        const k = Math.min(1, st / .18);
        E.alpha = Math.min(E.alpha, 1 - k); E.sx = 1 - .85 * k; E.sy = 1 + .4 * k;
        if (k >= 1) { E.alpha = 0; next(); }
        break;
      }
      case "away": if (st >= step.d) next(); break;
      case "appear": {
        if (!step.a) {
          step.a = 1; E.x = step.x ?? tpStep().x; E.dir = Math.random() < .5 ? 1 : -1;
          spawn(E.x, ground, 30, 16 * s, 60 * s); tpSound();
          stayLeft = between(AJUSTES.visibleMin, AJUSTES.visibleMax);
          idleTimer = between(3, 8);
        }
        const k = Math.min(1, st / .18);
        E.alpha = k; E.sx = .15 + .85 * k; E.sy = 1.4 - .4 * k;
        if (k >= 1) { E.alpha = 1; E.sx = E.sy = 1; next(); }
        break;
      }
      case "appear_cherry": {
        if (!step.a) {
          step.a = 1;
          E.x = step.x; E.dir = step.dir;
          holding = "cherry_sapling"; holdT = 1;
          spawn(E.x, ground, 30, 16 * s, 60 * s); tpSound();
          stayLeft = between(AJUSTES.visibleMin, AJUSTES.visibleMax);
        }
        const k = Math.min(1, st / .18);
        E.alpha = k; E.sx = .15 + .85 * k; E.sy = 1.4 - .4 * k;
        if (k >= 1) { E.alpha = 1; E.sx = E.sy = 1; next(); }
        break;
      }
      case "grow_cherry": {
        inCherrySeq = false;
        if (cherryTree) {
          cherryTree.state = "sapling_sparkle";
          cherryTree.t = 0;
          spawnCustom(slotX(cherryTree.slot), ground - 4 * s, 22, 20 * s, 38 * s, ["#55ff55", "#99ff66", "#f7b9dc", "#ffffff"]);
        }
        next();
        break;
      }
      case "tp": {
        const D = .18;
        if (!step.a) { step.a = 1; if (E.alpha > .5) { spawn(E.x, ground, 26, 16 * s, 60 * s); tpSound(); } }
        if (st < D) { const k = st / D; E.alpha = Math.min(E.alpha, 1 - k); E.sx = 1 - .85 * k; E.sy = 1 + .4 * k; }
        else if (!step.b) { step.b = 1; E.x = step.x; spawn(E.x, ground, 26, 16 * s, 60 * s); }
        else if (st < 2 * D) { const k = (st - D) / D; E.alpha = k; E.sx = .15 + .85 * k; E.sy = 1.4 - .4 * k; }
        else { E.alpha = 1; E.sx = E.sy = 1; next(); }
        break;
      }
    }
  }
  const k = 1 - Math.exp(-dt * 12);
  for (const key in P) P[key] += (T[key] - P[key]) * k;

  holdT = Math.min(1, holdT + dt / .25);
  if (placing && (placing.t += dt / .25) >= 1) {
    if (placing.isSapling) {
      cherryTree = { slot: placing.slot, state: "sapling", t: 0, petalTimer: 0, chops: 0, shake: 0 };
    } else {
      slots[placing.slot].push(placing.type);
    }
    placing = null;
  }

  if (cherryTree) {
    cherryTree.t += dt;
    cherryTree.shake = Math.max(0, (cherryTree.shake || 0) - dt * 4);
    if (cherryTree.state === "sapling_sparkle" && cherryTree.t >= 0.75) {
      cherryTree.state = "growing";
      cherryTree.t = 0;
      spawnCustom(slotX(cherryTree.slot), ground - 40 * s, 50, 110 * s, 90 * s, ["#f7b9dc", "#efa7cd", "#eb92c1", "#67e644", "#ffffff"]);
    } else if (cherryTree.state === "growing" && cherryTree.t >= 1.2) {
      cherryTree.state = "grown";
    }
    if ((cherryTree.state === "growing" || cherryTree.state === "grown") && (cherryTree.petalTimer += dt) >= 0.14) {
      cherryTree.petalTimer = 0;
      const cx = slotX(cherryTree.slot) + (Math.random() - .5) * 144 * s;
      const cy = ground - (48 + Math.random() * 80) * s;
      parts.push({
        x: cx, y: cy,
        vx: (Math.random() - .35) * 16 * s, vy: (8 + Math.random() * 12) * s,
        life: 0, max: 2.2 + Math.random() * 1.4, sz: (1.5 + Math.random() * 1.4) * s,
        c: ["#f7b9dc", "#efa7cd", "#fccbe7", "#eb92c1"][Math.floor(Math.random() * 4)]
      });
    }
    if (cherryTree.state === "growing" || cherryTree.state === "grown") {
      const tw = 7 * 16 * s;
      const th = 6 * 16 * s;
      treeHit.hidden = false;
      treeHit.style.width = tw + "px";
      treeHit.style.height = th + "px";
      treeHit.style.bottom = (16 * s + inB) + "px";
      treeHit.style.transform = `translate3d(${(slotX(cherryTree.slot) - tw / 2).toFixed(1)}px,0,0)`;
      treeHit.style.visibility = "visible";
    } else {
      treeHit.hidden = true;
      treeHit.style.visibility = "hidden";
    }
  } else {
    treeHit.hidden = true;
    treeHit.style.visibility = "hidden";
  }

  if (E.alpha > .5 && !reduce && (ambient += dt) > .16) {
    ambient = 0; spawn(E.x, ground - 4 * s, 1, 14 * s, 14 * s);
  }
  parts = parts.filter(p => (p.life += dt) < p.max);
  parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .96; });

  hit.style.transform = `translate3d(${(E.x - hitW / 2).toFixed(1)}px,0,0)`;
  hit.style.visibility = E.alpha > .3 ? "visible" : "hidden";
}

/* Dibujo */
const COL = { back: "#0b080c", body: "#151017", front: "#1f1922", head: "#18121a" };
function rect(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
function limb(x, y, a, c) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); rect(-1, 0, 2, 28, c); ctx.restore(); }
function block(type, cx, cy, size, alpha = 1) {
  const x0 = Math.round(cx - size / 2), y0 = Math.round(cy - size / 2);
  ctx.globalAlpha = alpha;
  ctx.drawImage(TEX[type], x0, y0, Math.round(cx + size / 2) - x0, Math.round(cy + size / 2) - y0);
  ctx.globalAlpha = 1;
}
const lerp = (a, b, t) => a + (b - a) * t, ease = t => t * t * (3 - 2 * t);

function drawCracks(cx, cy, size, stage) {
  const u = size / 16;
  const x0 = cx - size / 2, y0 = cy - size / 2;
  ctx.fillStyle = "rgba(18, 8, 14, 0.72)";
  const px = (x, y, w = 1, h = 1) => ctx.fillRect(Math.round(x0 + x * u), Math.round(y0 + y * u), Math.ceil(w * u), Math.ceil(h * u));
  if (stage >= 1) { px(7, 4, 1, 3); px(8, 7, 1, 3); px(6, 6, 2, 1); }
  if (stage >= 2) { px(4, 3, 2, 1); px(5, 4, 2, 1); px(9, 8, 2, 1); px(11, 9, 1, 3); px(5, 10, 3, 1); }
  if (stage >= 3) { px(2, 5, 3, 1); px(10, 4, 3, 1); px(9, 5, 2, 2); px(3, 11, 2, 2); px(8, 11, 1, 3); }
  if (stage >= 4) { px(1, 2, 2, 2); px(12, 2, 2, 2); px(2, 8, 3, 1); px(11, 6, 3, 1); px(6, 13, 3, 2); px(12, 12, 2, 2); }
}

function drawCherryTree(B) {
  if (!cherryTree) return;
  const mid = cherryTree.slot;
  if (cherryTree.state === "sapling" || cherryTree.state === "sapling_sparkle") {
    const wob = cherryTree.state === "sapling_sparkle" ? Math.sin(time * 36) * 1.5 * s : 0;
    block("cherry_sapling", slotX(mid) + wob, ground - 8 * s, B);
    return;
  }
  const treeShake = cherryTree.shake ? Math.sin(time * 55) * cherryTree.shake * 3.5 * s : 0;
  for (const b of TREE_BLOCKS) {
    const si = mid + b.dx;
    if (si < 0 || si >= slots.length) continue;
    let sc = 1;
    if (cherryTree.state === "growing") {
      const u = Math.max(0, Math.min(1, (cherryTree.t - b.d) / 0.25));
      if (u <= 0) continue;
      sc = u < 0.7 ? (u / 0.7) * 1.14 : 1.14 - ((u - 0.7) / 0.3) * 0.14;
    }
    const bx = slotX(si) + treeShake * (0.4 + b.k * 0.12);
    const by = ground - (b.k * 16 + 8) * s;
    block(b.t, bx, by, B * sc);
    if (b.t === "cherry_log" && cherryTree.chops > 0) {
      drawCracks(bx, by, B * sc, cherryTree.chops);
    }
  }
}

function drawEnder() {
  if (E.alpha <= 0.01) return;
  const hipY = -28 + P.bob, shx = 11 * Math.sin(P.L), shy = hipY - 11 * Math.cos(P.L);
  ctx.save();
  ctx.globalAlpha = E.alpha;
  ctx.translate(E.x + E.shake, ground);
  ctx.scale(s * E.dir * E.sx, s * E.sy);

  if (E.front) {
    const lift = P.head * 3, out = .05 + P.head * .18, sw = Math.sin(time * 1.6) * .03;
    rect(-3, -28, 2, 28, COL.body); rect(1, -28, 2, 28, COL.body);
    rect(-4, -40, 8, 12, COL.body);
    limb(-5, -39, out + sw, COL.front); limb(5, -39, -out - sw, COL.front);
    rect(-4, -43, 8, 3, COL.head);
    rect(-4, -48 - lift, 8, 5, COL.head);
    ctx.shadowColor = "#cc44ff"; ctx.shadowBlur = 8;
    rect(-3.6, -45.5 - lift, 2.8, 1.3, "#cc44ff"); rect(.8, -45.5 - lift, 2.8, 1.3, "#cc44ff");
    ctx.shadowBlur = 0;
    rect(-3.6, -45.5 - lift, .7, 1.3, "#ff99ff"); rect(.8, -45.5 - lift, .7, 1.3, "#ff99ff");
    ctx.restore();
    return;
  }

  limb(shx, shy, P.aB, COL.back);
  limb(0, hipY, P.lB, COL.back);

  ctx.save();
  ctx.translate(0, hipY); ctx.rotate(P.L);
  rect(-2, -12, 4, 12, COL.body);
  ctx.translate(0, -12);
  const lift = P.head * 3;
  rect(-4, -3, 8, 3, COL.head);
  rect(-4, -8 - lift, 8, 5, COL.head);
  ctx.shadowColor = "#d35cff"; ctx.shadowBlur = 8;
  rect(.5, -6 - lift, 3.5, 1.6, "#c43cf2");
  ctx.shadowBlur = 0;
  rect(1.6, -6 - lift, 1.4, .8, "#f6d2ff");
  ctx.restore();

  limb(0, hipY, P.lF, COL.front);
  if (holding && holdT >= 1) {
    const h = handPos(P.L, P.aF, P.bob);
    block(holding, h.x + 1, h.y - 5, 12, E.alpha);
    ctx.globalAlpha = E.alpha;
  }
  limb(shx, shy, P.aF, COL.front);
  ctx.restore();

  if (holding && holdT < 1) {
    const to = heldWorld(), e = ease(holdT);
    block(holding, lerp(holdFrom.x, to.x, e), lerp(holdFrom.y, to.y, e), lerp(16, 12, e) * s, E.alpha);
  }
}

function draw() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H + inB);
  ctx.imageSmoothingEnabled = false;
  const B = 16 * s, startX = off - Math.ceil(off / B) * B;
  for (let x = startX; x < W + B; x += B) block("grass", x + 8 * s, ground + 8 * s, B);
  if (inB > 0) for (let x = startX; x < W + B; x += B) block("dirt", x + 8 * s, ground + 24 * s, B);
  slots.forEach((stack, i) => stack.forEach((t, k) => block(t, slotX(i), ground - (k * 16 + 8) * s, B)));
  drawCherryTree(B);
  if (placing) {
    const e = ease(Math.min(1, placing.t));
    const tx = slotX(placing.slot), ty = ground - (placing.k * 16 + 8) * s;
    block(placing.type, lerp(placing.from.x, tx, e), lerp(placing.from.y, ty, e), lerp(12, 16, e) * s);
  }
  drawEnder();
  parts.forEach(p => {
    ctx.globalAlpha = (1 - p.life / p.max) * .9;
    ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.sz, p.sz);
  });
  ctx.globalAlpha = 1;
}

/* Interacción al tocarlo (doble toque = secuencia del árbol de cerezo) */
let inCherrySeq = false;
hit.addEventListener("click", () => {
  if (inCherrySeq) return;
  if (step && ["vanish", "appear", "appear_cherry", "away", "grow_cherry"].includes(step.t)) return;
  if (placing && !placing.isSapling) { slots[placing.slot].push(placing.type); placing = null; }
  holdT = 1; angry = 1.2;
  const seguido = time - lastTap < AJUSTES.dobleToque; lastTap = time;
  if (seguido) {
    inCherrySeq = true;
    E.alpha = 1; E.sx = E.sy = 1;
    holding = null;
    cherryTree = null;
    const mid = Math.floor(slots.length / 2);
    const fromLeft = Math.random() < 0.5;
    const sideX = fromLeft ? (inL + 14 * s) : (W - inR - 14 * s);
    const dir = fromLeft ? 1 : -1;
    const h = handPos(REACH[0].L, REACH[0].a);
    const targetX = slotX(mid) - dir * h.x * s;
    plan = [
      { t: "angry", d: .38 },
      { t: "vanish" },
      { t: "away", d: .55 },
      { t: "appear_cherry", x: sideX, dir },
      { t: "walk", x: targetX, fast: true },
      { t: "face", dir },
      { t: "reach", slot: mid, k: 0, act: "place_sapling" },
      { t: "wait", d: .4, front: true },
      { t: "vanish" },
      { t: "grow_cherry" },
      { t: "away", d: 14 },
      { t: "appear" }
    ];
  } else {
    if (step && (step.t === "angry" || step.t === "tp")) return;
    plan = [{ t: "angry", d: .35 }, tpStep(), { t: "wait", d: .6 }];
  }
  next();
  idleSound();
});

/* Talar el árbol de cerezo al darle 5 toques a cualquier madera */
treeHit.addEventListener("click", (ev) => {
  if (!cherryTree || (cherryTree.state !== "growing" && cherryTree.state !== "grown")) return;
  const mid = cherryTree.slot;
  const B = 16 * s;
  const rectC = c.getBoundingClientRect();
  const clickX = ev.clientX - rectC.left;
  const clickY = ev.clientY - rectC.top;

  let hitLog = null;
  let bestDist = Infinity;
  for (const b of TREE_BLOCKS) {
    if (b.t !== "cherry_log") continue;
    const bx = slotX(mid + b.dx);
    const by = ground - (b.k * 16 + 8) * s;
    const dx = Math.abs(clickX - bx);
    const dy = Math.abs(clickY - by);
    if (dx <= B * 0.95 && dy <= B * 0.95) {
      const dist = dx + dy;
      if (dist < bestDist) { bestDist = dist; hitLog = { bx, by }; }
    }
  }
  if (!hitLog) {
    hitLog = { bx: slotX(mid), by: ground - 24 * s };
  }

  cherryTree.chops = (cherryTree.chops || 0) + 1;
  cherryTree.shake = 1;

  if (cherryTree.chops < 5) {
    woodSound(false);
    spawnCustom(hitLog.bx, hitLog.by, 14, B * 0.9, B * 0.9, ["#301d29", "#422737", "#543543", "#e986bb", "#d574a9"]);
    spawnCustom(slotX(mid), ground - 72 * s, 8, 96 * s, 40 * s, ["#f7b9dc", "#efa7cd", "#fccbe7"]);
  } else {
    woodSound(true);
    for (const b of TREE_BLOCKS) {
      const si = mid + b.dx;
      if (si < 0 || si >= slots.length) continue;
      const bx = slotX(si);
      const by = ground - (b.k * 16 + 8) * s;
      const cols = b.t === "cherry_log"
        ? ["#301d29", "#422737", "#543543", "#e986bb", "#d574a9"]
        : ["#f7b9dc", "#efa7cd", "#eb92c1", "#d677ab", "#fccbe7"];
      spawnCustom(bx, by, b.t === "cherry_log" ? 8 : 5, B, B, cols);
    }
    cherryTree = null;
    treeHit.hidden = true;
    treeHit.style.visibility = "hidden";
  }
});

/* Bucle principal */
let raf = 0, last = 0, running = false;
function frame(t) {
  const dt = Math.min(.05, Math.max(0, (t - last) / 1000 || 0)); last = t;
  update(dt); draw();
  raf = requestAnimationFrame(frame);
}
function start() {
  if (running) return; running = true;
  layout(); hit.hidden = false;
  E.alpha = 0; plan = [{ t: "appear", x: W * .7 }]; next();
  last = performance.now(); raf = requestAnimationFrame(frame);
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
  else if (running && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
});
let rt; const relayout = () => { clearTimeout(rt); rt = setTimeout(() => running && layout(), 150); };
addEventListener("resize", relayout);
addEventListener("orientationchange", relayout);

const openBtn = document.getElementById("open");
if (openBtn) {
  addEventListener("mc-ready", () => setTimeout(start, 600), { once: true });
  openBtn.addEventListener("click", () => setTimeout(start, 3900), { once: true });
} else start();
})();
