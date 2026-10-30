/* mesa-encantamientos.js — mesa de encantamientos isométrica rodeada de librerías con TUS texturas de Minecraft.
   Usa los PNG en mc/: enchanting_table_top, enchanting_table_side, bookshelf, oak_planks, enchanting_table_book, ascii_sga */
(() => {
const CFG = Object.assign({
  title: "Mesa de encantamientos",
  hint: "Acércate… algo se está encantando. Toca la mesa.",
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

/* Animación */
const cv = $("canvas"), g = cv.getContext("2d");
g.imageSmoothingEnabled = false;
const P = [], [TX, TY] = isoPos(2, 2, 0), BASE_BY = TY - 72;
let o = calm ? 1 : 0, target = 0, vis = false, ready = false, last = 0, spawn = 0, raf = 0, by = BASE_BY;
const add = dur => {
  const sp = SHELF_POS[R() * SHELF_POS.length | 0] || [CX, 90];
  const x0 = sp[0] + (R() - .5) * 18, y0 = sp[1] + (R() - .5) * 18;
  P.push({ x0, y0, x1: TX, y1: by + 14, cx: (x0 + TX) / 2, cy: Math.min(y0, by) - 24 - R() * 20, t: 0, sp: 1 / dur, g: G[R() * G.length | 0] });
};
function book(t) {
  const bk = tex("book"), kb = 3, h = 10 * kb, y = by | 0, w = (3 + 15 * o) | 0, pw = (w * 5 / 6) | 0;
  [-1, 1].forEach(s => {
    g.drawImage(bk, s < 0 ? 0 : 16, 0, 6, 10, s < 0 ? TX - w : TX, y, w, h);
    if (o > .15) g.drawImage(bk, s < 0 ? 1 : 13, 11, 5, 8, s < 0 ? TX - 1 - pw : TX + 1, y + kb, pw, 8 * kb);
  });
  g.drawImage(bk, 12, 0, 2, 10, TX - 1, y, 2, h);
  if (o > .5) { const fw = Math.max(1, pw * (.2 + .8 * Math.abs(Math.sin(t * 2.4))) | 0); g.drawImage(bk, 24, 10, 5, 8, TX - 1 - fw, y + kb, fw, 8 * kb); }
}
function frame(ts) {
  const dt = Math.min(.05, (ts - last) / 1000 || .016); last = ts;
  o = calm ? target : o + (target - o) * (1 - Math.pow(.002, dt));
  const t = ts / 1000; by = BASE_BY + (calm ? 0 : Math.sin(t * 1.6) * 3);
  g.clearRect(0, 0, W, H); g.drawImage(bg, 0, 0);
  if (o > .6 && !calm) for (spawn -= dt; spawn <= 0; spawn += .055) add(1.5 + R() * .7);
  book(t);
  for (let i = P.length - 1; i >= 0; i--) {
    const p = P[i], u = (p.t += dt * p.sp);
    if (u >= 1) { P.splice(i, 1); continue; }
    const v = 1 - u;
    g.globalAlpha = Math.min(1, u * 6, v * 5);
    g.drawImage(p.g, (v * v * p.x0 + 2 * v * u * p.cx + u * u * p.x1 - 4) | 0, (v * v * p.y0 + 2 * v * u * p.cy + u * u * p.y1 - 4) | 0);
  }
  g.globalAlpha = 1;
  raf = vis || o > .01 || P.length ? requestAnimationFrame(frame) : 0;
}
const kick = () => { if (!raf && ready) raf = requestAnimationFrame(frame); };

/* Se abre al estar en pantalla; se cierra al salir */
new IntersectionObserver(([e]) => {
  vis = e.isIntersecting && e.intersectionRatio >= .25; target = vis ? 1 : 0; kick();
}, { threshold: [0, .25, .5] }).observe($(".mz-stage"));

/* Clic: ráfaga de partículas y luego abre el apartado */
const show = () => { dlg.showModal(); document.dispatchEvent(new CustomEvent("mesa-encantamientos:abierta")); };
$(".mz-hit").onclick = () => {
  if (calm) return show();
  for (let i = 0; i < 36; i++) add(.5 + R() * .3);
  kick(); setTimeout(show, 650);
};
Promise.all(Object.entries(NAMES).map(load)).then(() => { init(); ready = true; kick(); });
})();
