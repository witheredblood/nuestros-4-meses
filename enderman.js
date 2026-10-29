/* ============================================================
   ENDERMAN (estilo launcher de Minecraft)
   - Camina por la parte de abajo de la pantalla
   - Agarra bloques y los pone en otro sitio (máx. 2 de alto)
   - Se teletransporta solo, o cuando lo tocas
   Pensado para iPhone: safe-area (notch / barra home), pantallas
   retina (devicePixelRatio), toques sin bloquear el scroll y
   pausa automática cuando la pestaña no está visible.
   ============================================================ */
(() => {
const reduce = false; // siempre activo para que el Enderman camine y mueva bloques

/* ---------- Elementos ---------- */
const cv = document.createElement("canvas");
cv.id = "ender"; cv.setAttribute("aria-hidden", "true");
const hit = document.createElement("button");
hit.id = "ender-hit"; hit.hidden = true;
hit.setAttribute("aria-label", "Enderman: tócalo y se teletransporta");
// Sonda para leer los márgenes seguros de iOS (notch, barra de inicio)
const probe = document.createElement("div");
probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;pointer-events:none;" +
  "padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)";
document.body.append(cv, hit, probe);
const ctx = cv.getContext("2d");

/* ---------- Texturas de bloques (16x16, pixel art) ---------- */
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
// Texturas 16x16 extraídas píxel por píxel de tus 3 imágenes (césped, tierra y piedra)
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
  }
};
function makeTex(type, seed) {
  const c = document.createElement("canvas"); c.width = c.height = 16;
  const g = c.getContext("2d"), r = rng(seed);
  const px = (x, y, col) => { g.fillStyle = col; g.fillRect(x, y, 1, 1); };
  const pick = arr => arr[Math.floor(r() * arr.length)];
  const T = PIX[type];
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    if (T) px(x, y, T.p[T.r[y][x]]);
    else px(x, y, HEART[y][x] === "X" ? (r() < .15 ? "#a81f44" : "#c42a52") : pick(PAL.rose));
  }
  g.fillStyle = "rgba(0,0,0,.18)"; // borde sutil para que se distingan apilados
  g.fillRect(0, 15, 16, 1); g.fillRect(15, 0, 1, 16);
  return c;
}
const TYPES = ["grass", "dirt", "stone", "rose"];
const TEX = Object.fromEntries(TYPES.map((t, i) => [t, makeTex(t, 1234 + i * 777)]));

/* ---------- Medidas (se recalculan al girar el teléfono) ---------- */
let W = 0, H = 0, ground = 0, inB = 0, inL = 0, inR = 0, s = 1.5, dpr = 1, off = 0;
let slots = [];               // cada slot es una pila de bloques sobre el piso de césped
const slotX = i => off + i * 16 * s + 8 * s;

function layout() {
  const cs = getComputedStyle(probe);
  inB = parseFloat(cs.paddingBottom) || 0;
  inL = parseFloat(cs.paddingLeft) || 0;
  inR = parseFloat(cs.paddingRight) || 0;
  dpr = Math.min(window.devicePixelRatio || 1, 3);
  W = document.documentElement.clientWidth;
  s = Math.min(2.4, Math.max(1.4, W / 260));   // escala: ~1.5 en iPhone
  const B = 16 * s;
  H = Math.ceil(88 * s);                       // incluye la fila base de césped (16*s)
  ground = H - B;                              // el Enderman pisa encima de la fila de césped
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
  hitW = Math.max(44, 20 * s); hitH = Math.max(44, 52 * s); // área de toque mínima de Apple: 44pt
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

/* ---------- Estado del Enderman ---------- */
const E = { x: 0, dir: -1, alpha: 0, sx: 1, sy: 1, shake: 0, ph: 0 };
const P = { L: 0, aF: 0, aB: 0, lF: 0, lB: 0, head: 0, bob: 0 }; // pose actual
const T = { ...P };                                                // pose objetivo
// Poses para alcanzar un bloque en la fila k (0 = suelo, 1 = encima de otro)
const REACH = [{ L: .45, a: -.5 }, { L: .15, a: -.95 }];
const CARRY = -1.0;
let holding = null, holdT = 1, holdFrom = null, placing = null, lastSrc = -1;
let plan = [], step = null, st = 0, angry = 0, time = 0, hitW = 44, hitH = 44;
let parts = [], ambient = 0, ac = null;
let stayLeft = 0, lastTap = -99, idleTimer = 6;  // tiempo paseando / último toque / próximo sonido neutral

/* ---------- AJUSTES (cámbialos a tu gusto) ---------- */
const AJUSTES = {
  visibleMin: 25, visibleMax: 50,  // segundos que se queda paseando antes de irse
  ausenteMin: 10, ausenteMax: 40,  // segundos que se ausenta antes de volver
  castigoToque: 300,               // si lo tocas 2 veces seguidas, se va 5 min (300 s)
  dobleToque: 4,                   // segundos entre toques para que cuente como "seguidas"
  idleMin: 7, idleMax: 16,         // cada cuántos segundos hace un sonido neutral
  volumen: 0.45                    // volumen de los sonidos del Enderman (0 a 1)
};
const between = (a, b) => a + Math.random() * (b - a);

// Posición de la mano (en unidades del modelo, mirando a la derecha, pies en 0,0)
function handPos(L, a, bob = 0) {
  const hipY = -28 + bob, shx = 11 * Math.sin(L), shy = hipY - 11 * Math.cos(L);
  return { x: shx - 28 * Math.sin(a), y: shy + 28 * Math.cos(a) };
}
// Dónde va el bloque cargado, en coordenadas de pantalla
function heldWorld() {
  const h = handPos(P.L, P.aF, P.bob);
  return { x: E.x + (h.x + 1) * s * E.dir * E.sx, y: ground + (h.y - 5) * s * E.sy };
}

/* ---------- Partículas moradas ---------- */
const PCOL = ["#b14be0", "#e07cff", "#7a2fb0", "#d9a6ff"];
function spawn(x, y, n, spread, speed) {
  for (let i = 0; i < n; i++) parts.push({
    x: x + (Math.random() - .5) * spread, y: y - Math.random() * 48 * s,
    vx: (Math.random() - .5) * speed, vy: -Math.random() * speed * .8 - 6 * s,
    life: 0, max: .6 + Math.random() * .8, sz: (1 + Math.random() * 1.4) * s,
    c: PCOL[Math.floor(Math.random() * PCOL.length)]
  });
}

/* ---------- Sonido "vwoop" (solo al tocarlo; iOS exige un toque) ---------- */
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
    ["sonidos enderman/sonido_neutral.mp3", "sonidos_enderman/sonido_neutral.mp3", "sonidos/sonido_neutral.mp3", "sonido_neutral.mp3", "sonidos enderman/sonido neutral.mp3"],
    ["sonidos enderman/sonido_neutral_2.mp3", "sonidos_enderman/sonido_neutral_2.mp3", "sonidos/sonido_neutral_2.mp3", "sonido_neutral_2.mp3", "sonidos enderman/sonido neutral 2.mp3"],
    ["sonidos enderman/sonido_neutral_3.mp3", "sonidos_enderman/sonido_neutral_3.mp3", "sonidos/sonido_neutral_3.mp3", "sonido_neutral_3.mp3", "sonidos enderman/sonido neutral 3.mp3"]
  ],
  tp: [
    ["sonidos enderman/teleport.mp3", "sonidos_enderman/teleport.mp3", "sonidos/teleport.mp3", "teleport.mp3"],
    ["sonidos enderman/teleport_2.mp3", "sonidos_enderman/teleport_2.mp3", "sonidos/teleport_2.mp3", "teleport_2.mp3", "sonidos enderman/teleport 2.mp3"]
  ]
};
const SND_BUF = { idle: [], tp: [] };
let sndLoading = false;
async function fetchFirstAudio(candidates) {
  for (const url of candidates) {
    try {
      const r = await fetch(encodeURI(url));
      if (!r.ok) continue;
      const b = await r.arrayBuffer();
      return await new Promise((res, rej) => ac.decodeAudioData(b, res, rej));
    } catch (_) {}
  }
  return null;
}
function loadSounds() {
  if (sndLoading || !ac) return;
  sndLoading = true;
  for (const k of ["idle", "tp"]) {
    SND_FILES[k].forEach(candidates => {
      fetchFirstAudio(candidates).then(buf => { if (buf) SND_BUF[k].push(buf); });
    });
  }
}
function unlockAudio() {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === "suspended") ac.resume();
    loadSounds();
  } catch (_) {}
}
addEventListener("touchstart", unlockAudio, { passive: true });
addEventListener("click", unlockAudio);
function playSnd(kind, vol = AJUSTES.volumen) {
  unlockAudio();
  if (!ac || ac.state !== "running") return;
  const list = SND_BUF[kind];
  if (list && list.length) {
    try {
      const src = ac.createBufferSource(), g = ac.createGain();
      src.buffer = list[Math.floor(Math.random() * list.length)];
      src.playbackRate.value = .94 + Math.random() * .12;
      g.gain.value = vol;
      src.connect(g).connect(ac.destination);
      src.start(0);
      return;
    } catch (_) {}
  }
  if (kind === "tp") vwoop();
}
const tpSound = () => playSnd("tp");
const idleSound = () => playSnd("idle", AJUSTES.volumen * .85);

/* ---------- Cerebro: decide qué hacer ---------- */
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
  const far = Math.abs(x - E.x) > W * .5 && Math.random() < .6; // lejos: a veces se teletransporta
  plan = [far ? { t: "tp", x } : { t: "walk", x }, { t: "face", dir }, { t: "reach", slot: i, k, act }];
}
function think() {
  if (reduce) { plan = [{ t: "wait", d: 1e9 }]; return; } // movimiento reducido: solo se mueve si lo tocas
  // Ya paseó suficiente: se va un rato y vuelve en otro lugar (nunca se lleva bloques)
  if (!holding && stayLeft <= 0) {
    plan = [{ t: "wait", d: 1, front: true }, { t: "vanish" },
      { t: "away", d: between(AJUSTES.ausenteMin, AJUSTES.ausenteMax) }, { t: "appear" }];
    return;
  }
  const r = Math.random();
  if (holding) {
    const free = idx(i => slots[i].length < 2 && i !== lastSrc);
    if (r < .18 || !free.length) plan = [tpStep()];
    else { const i = rand(free); go(i, slots[i].length, "place"); }
  } else {
    const full = idx(i => slots[i].length > 0);
    if (r < .62 && full.length) { const i = rand(full); lastSrc = i; go(i, slots[i].length - 1, "pick"); }
    else if (r < .8) plan = [tpStep()];
    else plan = [{ t: "face", dir: -E.dir }, { t: "wait", d: .8 + Math.random() * 1.5, front: false }];
  }
  plan.push({ t: "wait", d: .6 + Math.random() * 1.8, front: true });
}
function act(sp) {
  const stack = slots[sp.slot];
  if (sp.act === "pick" && !holding && stack && stack.length - 1 === sp.k) {
    holding = stack.pop(); holdT = 0;
    holdFrom = { x: slotX(sp.slot), y: ground - (sp.k * 16 + 8) * s };
  } else if (sp.act === "place" && holding && stack && stack.length === sp.k) {
    placing = { type: holding, slot: sp.slot, k: sp.k, t: 0, from: heldWorld() };
    holding = null;
  }
}
const next = () => { step = plan.shift() || null; st = 0; };

/* ---------- Actualización por frame ---------- */
function update(dt) {
  time += dt;
  angry = Math.max(0, angry - dt);
  // Pose base
  const sway = Math.sin(time * 1.6) * .04;
  Object.assign(T, {
    L: 0, lF: 0, lB: 0, bob: 0, head: angry > 0 ? 1 : 0,
    aF: holding ? CARRY : sway, aB: holding ? CARRY + .06 : -sway
  });

  if (!step) { if (!plan.length) think(); next(); }
  E.front = false;                       // de frente solo cuando se queda quieto mirándote
  if (E.alpha > .99) {
    stayLeft -= dt;
    if ((idleTimer -= dt) <= 0) {
      idleTimer = between(AJUSTES.idleMin, AJUSTES.idleMax);
      if (!step || (step.t !== "tp" && step.t !== "vanish" && step.t !== "appear")) idleSound();
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
        const v = Math.min(Math.abs(d), 30 * s * dt);
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
        E.front = !holding;                // se queda mirándote, enojado
        T.head = 1; E.shake = (Math.random() - .5) * 2.4 * s;
        if (st >= step.d) { E.shake = 0; next(); }
        break;
      case "vanish": {                     // se va (sin volver todavía)
        if (!step.a) { step.a = 1; if (E.alpha > .5) { spawn(E.x, ground, 26, 16 * s, 60 * s); tpSound(); } }
        const k = Math.min(1, st / .18);
        E.alpha = Math.min(E.alpha, 1 - k); E.sx = 1 - .85 * k; E.sy = 1 + .4 * k;
        if (k >= 1) { E.alpha = 0; next(); }
        break;
      }
      case "away": if (st >= step.d) next(); break;
      case "appear": {                     // vuelve en un lugar al azar, con sonido de teleport
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
  // Suavizar pose hacia el objetivo
  const k = 1 - Math.exp(-dt * 12);
  for (const key in P) P[key] += (T[key] - P[key]) * k;

  holdT = Math.min(1, holdT + dt / .25);
  if (placing && (placing.t += dt / .25) >= 1) { slots[placing.slot].push(placing.type); placing = null; }

  // Partículas ambientales (como en el juego)
  if (E.alpha > .5 && !reduce && (ambient += dt) > .16) {
    ambient = 0; spawn(E.x, ground - 4 * s, 1, 14 * s, 14 * s);
  }
  parts = parts.filter(p => (p.life += dt) < p.max);
  parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .96; });

  // Mover el botón invisible de toque encima del Enderman
  hit.style.transform = `translate3d(${(E.x - hitW / 2).toFixed(1)}px,0,0)`;
  hit.style.visibility = E.alpha > .3 ? "visible" : "hidden";
}

/* ---------- Dibujo ---------- */
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

function drawEnder() {
  if (E.alpha <= 0.01) return;
  const hipY = -28 + P.bob, shx = 11 * Math.sin(P.L), shy = hipY - 11 * Math.cos(P.L);
  ctx.save();
  ctx.globalAlpha = E.alpha;
  ctx.translate(E.x + E.shake, ground);
  ctx.scale(s * E.dir * E.sx, s * E.sy);

  if (E.front) {                            // DE FRENTE (estilo de tu versión): dos ojos mirándote
    const lift = P.head * 3, out = .05 + P.head * .18, sw = Math.sin(time * 1.6) * .03;
    rect(-3, -28, 2, 28, COL.body); rect(1, -28, 2, 28, COL.body);   // piernas
    rect(-4, -40, 8, 12, COL.body);                                   // torso
    limb(-5, -39, out + sw, COL.front); limb(5, -39, -out - sw, COL.front); // brazos largos
    rect(-4, -43, 8, 3, COL.head);                                    // mandíbula
    rect(-4, -48 - lift, 8, 5, COL.head);                             // cabeza
    ctx.shadowColor = "#cc44ff"; ctx.shadowBlur = 8;
    rect(-3.6, -45.5 - lift, 2.8, 1.3, "#cc44ff"); rect(.8, -45.5 - lift, 2.8, 1.3, "#cc44ff");
    ctx.shadowBlur = 0;
    rect(-3.6, -45.5 - lift, .7, 1.3, "#ff99ff"); rect(.8, -45.5 - lift, .7, 1.3, "#ff99ff");
    ctx.restore();
    return;
  }

  limb(shx, shy, P.aB, COL.back);          // brazo de atrás
  limb(0, hipY, P.lB, COL.back);           // pierna de atrás

  ctx.save();                               // torso + cabeza
  ctx.translate(0, hipY); ctx.rotate(P.L);
  rect(-2, -12, 4, 12, COL.body);
  ctx.translate(0, -12);
  const lift = P.head * 3;                  // boca abierta cuando se enoja
  rect(-4, -3, 8, 3, COL.head);             // mandíbula
  rect(-4, -8 - lift, 8, 5, COL.head);      // parte de arriba
  ctx.shadowColor = "#d35cff"; ctx.shadowBlur = 8;
  rect(.5, -6 - lift, 3.5, 1.6, "#c43cf2"); // ojo morado brillante
  ctx.shadowBlur = 0;
  rect(1.6, -6 - lift, 1.4, .8, "#f6d2ff");
  ctx.restore();

  limb(0, hipY, P.lF, COL.front);           // pierna de adelante
  if (holding && holdT >= 1) {              // bloque entre las manos
    const h = handPos(P.L, P.aF, P.bob);
    block(holding, h.x + 1, h.y - 5, 12, E.alpha);
    ctx.globalAlpha = E.alpha;
  }
  limb(shx, shy, P.aF, COL.front);          // brazo de adelante
  ctx.restore();

  if (holding && holdT < 1) {               // animación al agarrar
    const to = heldWorld(), e = ease(holdT);
    block(holding, lerp(holdFrom.x, to.x, e), lerp(holdFrom.y, to.y, e), lerp(16, 12, e) * s, E.alpha);
  }
}

function draw() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H + inB);
  ctx.imageSmoothingEnabled = false;
  // Línea completa de bloques de tierra con césped de lado a lado (el suelo donde pisa)
  const B = 16 * s, startX = off - Math.ceil(off / B) * B;
  for (let x = startX; x < W + B; x += B) block("grass", x + 8 * s, ground + 8 * s, B);
  // Si hay safe-area abajo en iPhone, rellenar debajo con tierra para que no quede hueco
  if (inB > 0) for (let x = startX; x < W + B; x += B) block("dirt", x + 8 * s, ground + 24 * s, B);
  // Bloques que el Enderman agarra y mueve encima del suelo
  slots.forEach((stack, i) => stack.forEach((t, k) => block(t, slotX(i), ground - (k * 16 + 8) * s, B)));
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

/* ---------- Toque ----------
   1er toque: se enoja y se teletransporta a otro lado (abajo).
   2º toque seguido: se va del todo por AJUSTES.castigoToque segundos (como tu versión). */
hit.addEventListener("click", () => {
  if (step && ["tp", "angry", "vanish", "appear", "away"].includes(step.t)) return;
  if (placing) { slots[placing.slot].push(placing.type); placing = null; }
  holdT = 1; angry = 1.2;
  const seguido = time - lastTap < AJUSTES.dobleToque; lastTap = time;
  plan = seguido
    ? [{ t: "angry", d: .5 }, { t: "vanish" }, { t: "away", d: AJUSTES.castigoToque }, { t: "appear" }]
    : [{ t: "angry", d: .35 }, tpStep(), { t: "wait", d: .6 }];
  next();
  idleSound();
});

/* ---------- Bucle (se pausa si la pestaña no se ve: ahorra batería) ---------- */
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

// Aparece cuando termina la pantalla de carga del mundo (con respaldo por si hay caché)
const openBtn = document.getElementById("open");
if (openBtn) {
  addEventListener("mc-ready", () => setTimeout(start, 600), { once: true });
  openBtn.addEventListener("click", () => setTimeout(start, 3900), { once: true });
} else start();
})();
