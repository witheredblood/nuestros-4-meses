/* mesa-encantamientos.js — mesa de encantamientos isométrica rodeada de librerías con TUS texturas de Minecraft.
   El libro 3D permanece cerrado y girando horizontalmente sobre la mesa como en Minecraft;
   al tocarlo gira hacia el frente, se inclina, se abre en 3D pasando páginas y abre el apartado. */
(() => {
const CFG = Object.assign({
  title: "Mesa de encantamientos",
  hint: "Toca el libro para abrirlo.",
  openLabel: "Abrir la mesa de encantamientos",
  closeLabel: "Cerrar",
  texPath: "mc/",
  glyphColor: "#f3bccb",
  items: [
    { title: "✦ Lealtad III", text: "Mi corazón siempre regresa a ti, sin importar la distancia ni el tiempo." },
    { title: "✦ Infinidad I", text: "Para que las risas, los abrazos y las ganas de estar juntos no se nos acaben nunca." },
    { title: "✦ Irrompible III", text: "Por lo nuestro, que cada día que pasa se vuelve más fuerte, más bonito y más real." }
  ]
}, window.ENCHANT_CFG || {});

const calm = false;
const W = 340, H = 260, CX = W / 2, OY = 144, K = 2, R = Math.random;
const css = document.createElement("style");
css.textContent = `
.mz{min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:10vh 1rem;position:relative;z-index:1}
.mz-t{font:400 clamp(1.5rem,5vw,2.3rem)/1.25 var(--serif,monospace);margin-bottom:.4rem}
.mz-h{opacity:.75;margin-bottom:1.2rem}
.mz-stage{position:relative;width:min(44rem,100%);aspect-ratio:${W}/${H}}
.mz canvas{width:100%;height:100%;display:block;image-rendering:pixelated;filter:drop-shadow(0 18px 32px rgba(0,0,0,.6))}
.mz-hit{position:absolute;left:34%;top:42%;width:32%;height:46%;background:none;border:0;border-radius:12px;cursor:pointer;-webkit-tap-highlight-color:transparent}
.mz-hit:focus-visible{outline:2px dashed var(--rose,#f3bccb)}
.mz-dlg{border:0;background:none;margin:auto;padding:0;width:min(92vw,440px);overflow:visible;color:var(--cream,#fbf0e3)}
.mz-dlg::backdrop{background:rgba(20,3,9,.82);backdrop-filter:blur(6px)}
.mz-dlg[open]{animation:mz-pop .45s cubic-bezier(.2,1.3,.4,1)}
@keyframes mz-pop{from{opacity:0;transform:scale(.85) translateY(12px)}}
.mz-gui{background:#1c0a14;border:3px solid var(--red,#8e1d3c);box-shadow:0 0 0 3px #0e0409,0 25px 60px rgba(0,0,0,.6);padding:1.4rem;text-align:left}
.mz-gui h3{font:400 1.35rem var(--serif,monospace);color:var(--rose,#f3bccb);margin-bottom:.4rem}
.mz-it{display:block;width:100%;margin-top:.6rem;padding:.8rem 1rem;text-align:left;background:#2a1320;border:2px solid #4a2236;color:inherit;font:inherit;cursor:pointer;transition:.25s}
.mz-it:hover,.mz-it[aria-expanded=true]{border-color:var(--rose,#f3bccb);background:#3a1a2c}
.mz-tx{display:block;margin-top:.5rem;font:400 .95rem/1.55 var(--serif,monospace);color:var(--rose,#f3bccb)}
.mz-tx[hidden]{display:none}
.mz-x{margin-top:1.2rem;padding:.6rem 1.6rem;border:1px solid var(--rose,#f3bccb);border-radius:99px;background:none;color:inherit;font:inherit;cursor:pointer}
.mz-x:hover{background:var(--rose,#f3bccb);color:#2b0813}`;
document.head.append(css);

/* DOM */
let sec = document.getElementById("mesa-encantamientos");
if (!sec) {
  sec = document.createElement("section"); sec.id = "mesa-encantamientos";
  const ref = document.getElementById("sorpresas");
  ref ? ref.before(sec) : (document.querySelector("main") || document.body).append(sec);
}
sec.classList.add("mz");
sec.innerHTML = `<h2 class="mz-t"></h2><p class="mz-h"></p>
<div class="mz-stage"><canvas width="${W}" height="${H}" aria-hidden="true"></canvas><button class="mz-hit"></button></div>
<dialog class="mz-dlg"><div class="mz-gui"><h3></h3><div class="mz-list"></div><button class="mz-x"></button></div></dialog>`;
const $ = s => sec.querySelector(s);
$(".mz-t").textContent = $(".mz-gui h3").textContent = CFG.title;
$(".mz-h").textContent = CFG.hint;
$(".mz-hit").setAttribute("aria-label", CFG.openLabel);
$(".mz-x").textContent = CFG.closeLabel;
CFG.items.forEach(it => {
  const b = document.createElement("button"), t = document.createElement("span"), s = document.createElement("b");
  b.className = "mz-it"; b.setAttribute("aria-expanded", "false");
  s.textContent = it.title; t.className = "mz-tx"; t.hidden = true; t.textContent = it.text;
  b.append(s, t);
  b.onclick = () => { const o = b.getAttribute("aria-expanded") !== "true"; b.setAttribute("aria-expanded", o); t.hidden = !o; };
  $(".mz-list").append(b);
});
const dlg = $(".mz-dlg");
$(".mz-x").onclick = () => dlg.close();
dlg.onclick = e => { if (e.target === dlg) dlg.close(); };

/* Texturas */
const mk = (w, h) => Object.assign(document.createElement("canvas"), { width: w, height: h });
const NAMES = { top: "enchanting_table_top", side: "enchanting_table_side", shelf: "bookshelf", plank: "oak_planks", book: "enchanting_table_book", sga: "ascii_sga" };
const FALL = { top: "#8e1d3c", side: "#1a1428", shelf: "#8a6238", plank: "#a07a45", book: "#8e1d3c" };
const IMG = {};
const load = ([k, n]) => new Promise(r => {
  const i = new Image(); i.onload = () => { IMG[k] = i; r(); };
  i.onerror = () => { console.warn("Falta " + CFG.texPath + n + ".png"); r(); }; i.src = CFG.texPath + n + ".png";
});
const tex = k => { if (IMG[k]) return IMG[k]; const c = mk(64, 32); c.getContext("2d").fillStyle = FALL[k]; c.getContext("2d").fillRect(0, 0, 64, 32); return c; };

/* Escena estática isométrica: esquina de librerías (4x3 de cada lado) + mesa en (2,2,0) */
const bg = mk(W, H), SHELF_POS = [], G = [];
function isoPos(gx, gy, gz) {
  return [
    CX + (gx - gy) * 16 * K,
    OY + (gx + gy) * 8 * K - gz * 16 * K
  ];
}
function init() {
  const b = bg.getContext("2d"); b.imageSmoothingEnabled = false;
  const block = (cx, fy, h, top, sideL, sideR, shL = .18, shR = .36) => {
    const oy = fy - 16 * K - h * K;
    b.setTransform(K, K / 2, 0, K, cx - 16 * K, oy + 8 * K);
    b.drawImage(sideL, 0, 16 - h, 16, h, 0, 0, 16, h);
    if (shL > 0) { b.fillStyle = `rgba(0,0,0,${shL})`; b.fillRect(0, 0, 16, h); }

    b.setTransform(K, -K / 2, 0, K, cx, oy + 16 * K);
    b.drawImage(sideR, 0, 16 - h, 16, h, 0, 0, 16, h);
    if (shR > 0) { b.fillStyle = `rgba(0,0,0,${shR})`; b.fillRect(0, 0, 16, h); }

    b.setTransform(K, K / 2, -K, K / 2, cx, oy);
    b.drawImage(top, 0, 0, 16, 16, 0, 0, 16, 16);
    b.setTransform(1, 0, 0, 1, 0, 0);
  };

  /* Sombra suave debajo de la mesa */
  const [tcx, tfy] = isoPos(2, 2, 0);
  b.fillStyle = "rgba(10,2,6,.42)";
  b.beginPath(); b.ellipse(tcx, tfy - 12, 36, 14, 0, 0, 7); b.fill();

  /* Esquina de librerías en L (gx=0, gy=0..3 y gy=0, gx=1..3) con 3 bloques de altura (gz=0..2) */
  const cells = [];
  for (let gz = 0; gz < 3; gz++) {
    for (let gx = 0; gx < 4; gx++) {
      for (let gy = 0; gy < 4; gy++) {
        if (gx === 0 || gy === 0) cells.push({ gx, gy, gz, type: "shelf" });
      }
    }
  }
  cells.push({ gx: 2, gy: 2, gz: 0, type: "table" });
  cells.sort((a, c) => (a.gx + a.gy + a.gz) - (c.gx + c.gy + c.gz) || a.gz - c.gz);

  for (const c of cells) {
    const [cx, fy] = isoPos(c.gx, c.gy, c.gz);
    if (c.type === "shelf") {
      block(cx, fy, 16, tex("plank"), tex("shelf"), tex("shelf"), .12, .26);
      if (c.gx > 0 || c.gy > 0) SHELF_POS.push([cx, fy - 24]);
    } else {
      block(cx, fy, 12, tex("top"), tex("side"), tex("side"), .12, .28);
    }
  }

  /* Glifos: letras a–z del alfabeto galáctico (ascii_sga.png), teñidas con glyphColor */
  for (let c = 97; c < 123; c++) {
    const k = mk(8, 8), q = k.getContext("2d");
    if (IMG.sga) q.drawImage(IMG.sga, (c % 16) * 8, (c >> 4) * 8, 8, 8, 0, 0, 8, 8);
    else { q.fillStyle = "#fff"; let x = R() * 6 | 0, y = R() * 6 | 0; for (let i = 0; i < 7; i++) { q.fillRect(x, y, 1, 1); R() < .5 ? x = Math.max(0, Math.min(7, x + (R() < .5 ? -1 : 1))) : y = Math.max(0, Math.min(7, y + (R() < .5 ? -1 : 1))); } }
    q.globalCompositeOperation = "source-in"; q.fillStyle = CFG.glyphColor; q.fillRect(0, 0, 8, 8); G.push(k);
  }
}

/* Renderizador 3D real del BookModel de Minecraft sobre la mesa */
const cv = $("canvas"), g = cv.getContext("2d"), TAU = Math.PI * 2;
g.imageSmoothingEnabled = false;
const P = [], [TX, TY] = isoPos(2, 2, 0), BASE_BY = TY - 56;
let o = 0, tgt = 0, th = 0, want = false, shown = false, vis = false, ready = false, last = 0, spawn = 0, raf = 0, by = BASE_BY;
const add = dur => {
  const sp = SHELF_POS[R() * SHELF_POS.length | 0] || [CX, 90];
  const x0 = sp[0] + (R() - .5) * 18, y0 = sp[1] + (R() - .5) * 18;
  P.push({ x0, y0, x1: TX, y1: by, cx: (x0 + TX) / 2, cy: Math.min(y0, by) - 24 - R() * 20, t: 0, sp: 1 / dur, g: G[R() * G.length | 0] });
};
const show = () => { dlg.showModal(); document.dispatchEvent(new CustomEvent("mesa-encantamientos:abierta")); };

function book(t) {
  const bk = tex("book"), S = 2.35, y0 = by;
  // Sombra flotante del libro sobre el mantel rojo/diamante de la mesa
  g.fillStyle = "rgba(0,0,0,.35)";
  g.beginPath(); g.ellipse(TX, TY - 42, 13 + 4 * o, 6.5 + 2 * o, 0, 0, TAU); g.fill();

  // En Minecraft:
  // - Cerrado (o=0): el libro está acostado/inclinado suavemente (~18°) y gira 360° en su eje vertical (th).
  //   Las dos tapas están paralelas separadas por el grosor de las hojas, con el lomo de un lado.
  // - Abierto (o=1): el libro mira hacia el frente, se inclina (~62°) y abre sus dos tapas en V mientras pasan hojas.
  const pitch = 0.32 + 0.76 * o; // inclinación del lomo respecto a la horizontal
  const openAng = 0.04 + 1.18 * o; // ángulo de apertura de cada tapa (0 = paralelas cerradas, 1.22 = abiertas en V)
  const cy = Math.cos(th), sy = Math.sin(th), cp = Math.cos(pitch), sp = Math.sin(pitch);

  // Transforma punto local del libro (lx: ancho de tapa, ly: largo del lomo -5..5, lz: grosor/altura) a 3D mundo y pantalla
  function toWorld(lx, ly, lz) {
    // Primero inclinamos el eje del lomo (ly, lz) por pitch
    const y1 = ly * cp - lz * sp;
    const z1 = ly * sp + lz * cp;
    // Luego rotamos en el eje vertical del mundo (yaw = th)
    const wx = lx * cy - y1 * sy;
    const wy = lx * sy + y1 * cy;
    const wz = z1;
    // Proyección isométrica a pantalla
    return {
      sx: TX + (wx - wy) * S,
      sy: y0 + (wx + wy) * 0.5 * S - wz * S,
      depth: wx + wy + wz * 1.15
    };
  }

  const quads = [];
  function pushQuad(p0, uVec, vVec, sx, sy, sw, sh, shade = 0) {
    const A = toWorld(p0[0], p0[1], p0[2]);
    const B = toWorld(p0[0] + uVec[0], p0[1] + uVec[1], p0[2] + uVec[2]);
    const C = toWorld(p0[0] + vVec[0], p0[1] + vVec[1], p0[2] + vVec[2]);
    const D = toWorld(p0[0] + uVec[0] + vVec[0], p0[1] + uVec[1] + vVec[1], p0[2] + uVec[2] + vVec[2]);
    const depth = (A.depth + B.depth + C.depth + D.depth) * 0.25;
    quads.push({ A, B, C, sx, sy, sw, sh, shade, depth });
  }

  // Vectores de las dos tapas según apertura (o=0: ambas apuntan hacia +lz como libro cerrado; o=1: abiertas en V hacia -lx y +lx)
  // Tapa izquierda/superior y tapa derecha/inferior articuladas en el lomo (lz = 0, lx = 0)
  const halfGap = 1.05 * (1 - o * 0.75); // separación entre tapas por el bloque de hojas
  const ca = Math.cos(openAng), sa = Math.sin(openAng);
  // Cuando openAng -> 0 (cerrado): la tapa se extiende a lo largo de +lz (con tapas en lx = -halfGap y +halfGap)
  // Usamos rotación continua para cada ala:
  // Ala izquierda gira desde estar plegada (lx = -halfGap, extendida en +lz) hasta abierta (extendida en -lx, +lz)
  const L_ux = -6 * sa, L_uz = 6 * ca;
  const R_ux =  6 * sa, R_uz = 6 * ca;
  // Normal unitaria hacia afuera de cada tapa (para posicionar el bloque de hojas adentro)
  const L_nx = -ca, L_nz = -sa;
  const R_nx =  ca, R_nz = -sa;

  // 1. Lomo (seam: 2x10, UV 12,0) en la base (lx: -halfGap..+halfGap, ly: -5..5, lz: 0)
  pushQuad([-halfGap, -5, 0], [halfGap * 2, 0, 0], [0, 10, 0], 12, 0, 2, 10, 0.22);

  // 2. Tapa izquierda (exterior e interior, 6x10, UV 0,0 y 6,0)
  pushQuad([-halfGap, -5, 0], [L_ux, 0, L_uz], [0, 10, 0], 0, 0, 6, 10, 0.08);
  pushQuad([-halfGap - L_nx * 0.15, -5, -L_nz * 0.15], [L_ux, 0, L_uz], [0, 10, 0], 6, 0, 6, 10, 0.14);

  // 3. Tapa derecha (exterior e interior, 6x10, UV 16,0 y 22,0)
  pushQuad([halfGap, -5, 0], [R_ux, 0, R_uz], [0, 10, 0], 16, 0, 6, 10, 0.18);
  pushQuad([halfGap - R_nx * 0.15, -5, -R_nz * 0.15], [R_ux, 0, R_uz], [0, 10, 0], 22, 0, 6, 10, 0.14);

  // 4. Bloques de hojas (5x8, UV 1,11 y 13,11) apoyados sobre el interior de cada tapa
  const pThick = 0.95;
  const Lp0 = [-halfGap - L_nx * pThick + L_ux * 0.06, -4, -L_nz * pThick + L_uz * 0.06];
  const Rp0 = [ halfGap - R_nx * pThick + R_ux * 0.06, -4, -R_nz * pThick + R_uz * 0.06];
  const Lpu = [L_ux * 0.82, 0, L_uz * 0.82], Rpu = [R_ux * 0.82, 0, R_uz * 0.82];
  // Cara superior de las páginas
  pushQuad(Lp0, Lpu, [0, 8, 0], 1, 11, 5, 8, 0.04);
  pushQuad(Rp0, Rpu, [0, 8, 0], 13, 11, 5, 8, 0.08);
  // Cantos blancos de las hojas (visibles especialmente cuando el libro está cerrado girando)
  pushQuad([-halfGap, 4, 0], [Lpu[0], 0, Lpu[2]], [-L_nx * pThick, 0, -L_nz * pThick], 1, 11, 5, 2, 0.12);
  pushQuad([-halfGap, -4, 0], [Lpu[0], 0, Lpu[2]], [-L_nx * pThick, 0, -L_nz * pThick], 1, 11, 5, 2, 0.18);
  pushQuad([halfGap, 4, 0], [Rpu[0], 0, Rpu[2]], [-R_nx * pThick, 0, -R_nz * pThick], 13, 11, 5, 2, 0.12);
  pushQuad([halfGap, -4, 0], [Rpu[0], 0, Rpu[2]], [-R_nx * pThick, 0, -R_nz * pThick], 13, 11, 5, 2, 0.18);
  pushQuad([-halfGap + Lpu[0], -4, Lpu[2]], [-L_nx * pThick, 0, -L_nz * pThick], [0, 8, 0], 1, 11, 2, 8, 0.1);
  pushQuad([ halfGap + Rpu[0], -4, Rpu[2]], [-R_nx * pThick, 0, -R_nz * pThick], [0, 8, 0], 13, 11, 2, 8, 0.15);

  // 5. Hojas pasando en 3D (flipPage1 y flipPage2, UV 24,10) cuando el libro se abre
  if (o > 0.25) {
    for (let ip = 0; ip < 2; ip++) {
      const ph = (t * 1.9 + ip * 1.55) % Math.PI;
      const fang = (Math.cos(ph) * 0.85) * openAng;
      const fux = Math.sin(fang) * 5, fuz = Math.cos(fang) * 5;
      pushQuad([0, -4, 0.3], [fux, 0, fuz], [0, 8, 0], 24, 10, 5, 8, 0.02);
    }
  }

  // Ordenar caras de atrás hacia adelante (painter's algorithm) y dibujar con transformación afín
  quads.sort((a, b) => a.depth - b.depth);
  for (const q of quads) {
    const ux = (q.B.sx - q.A.sx) / q.sw, uy = (q.B.sy - q.A.sy) / q.sw;
    const vx = (q.C.sx - q.A.sx) / q.sh, vy = (q.C.sy - q.A.sy) / q.sh;
    g.setTransform(ux, uy, vx, vy, q.A.sx, q.A.sy);
    g.drawImage(bk, q.sx, q.sy, q.sw, q.sh, 0, 0, q.sw, q.sh);
    if (q.shade > 0) {
      g.fillStyle = `rgba(0,0,0,${q.shade})`;
      g.fillRect(0, 0, q.sw, q.sh);
    }
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
}

function frame(ts) {
  const dt = Math.min(.05, (ts - last) / 1000 || .016); last = ts;
  const t = ts / 1000;
  // Ángulo frontal hacia la cámara en nuestra proyección isométrica: -PI/4
  const FRONT = -Math.PI / 4;
  if (want) {
    const n = Math.round((th - FRONT) / TAU) * TAU + FRONT;
    th += (n - th) * (1 - Math.pow(.002, dt));
    if (Math.abs(n - th) < .18) tgt = 1;
  } else {
    if (!calm) th += dt * 1.25;
    tgt = 0;
  }
  o += (tgt - o) * (calm ? .12 : 1 - Math.pow(.008, dt));
  by = BASE_BY + (calm ? 0 : Math.sin(t * 2.0) * 3.5);
  g.clearRect(0, 0, W, H); g.drawImage(bg, 0, 0);
  if (vis && !calm) for (spawn -= dt; spawn <= 0; spawn += o > .6 ? .055 : .14) add(1.5 + R() * .7);
  book(t);
  for (let i = P.length - 1; i >= 0; i--) {
    const p = P[i], u = (p.t += dt * p.sp);
    if (u >= 1) { P.splice(i, 1); continue; }
    const v = 1 - u;
    g.globalAlpha = Math.min(1, u * 6, v * 5);
    g.drawImage(p.g, (v * v * p.x0 + 2 * v * u * p.cx + u * u * p.x1 - 4) | 0, (v * v * p.y0 + 2 * v * u * p.cy + u * u * p.y1 - 4) | 0);
  }
  g.globalAlpha = 1;
  if (want && !shown && o > .94) { shown = true; show(); }
  raf = vis || want || o > .01 || P.length ? requestAnimationFrame(frame) : 0;
}
const kick = () => { if (!raf && ready) raf = requestAnimationFrame(frame); };

/* Las partículas fluyen solo cuando la mesa está en pantalla */
new IntersectionObserver(([e]) => { vis = e.isIntersecting && e.intersectionRatio >= .2; kick(); }, { threshold: [0, .2] }).observe($(".mz-stage"));

/* Clic: el libro gira hacia el frente, se inclina, se abre en 3D (con ráfaga de glifos) y abre el apartado */
$(".mz-hit").onclick = () => {
  if (want) return;
  want = true; shown = false;
  if (!calm) for (let i = 0; i < 36; i++) add(.5 + R() * .3);
  kick();
  setTimeout(() => { if (want && !shown) { shown = true; show(); } }, 2500);
};
dlg.addEventListener("close", () => { want = false; shown = false; });
Promise.all(Object.entries(NAMES).map(load)).then(() => { init(); ready = true; kick(); });
})();
