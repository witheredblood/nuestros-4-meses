/* mesa-encantamientos.js — mesa de encantamientos isométrica con TUS texturas de Minecraft. Sin dependencias.
   Pon estos PNG en una carpeta mc/ junto al index.html:
   enchanting_table_top, enchanting_table_side, bookshelf, oak_planks, enchanting_table_book, ascii_sga
   Uso: <script src="mesa-encantamientos.js"></script> antes de </body>.
   Si existe <section id="mesa-encantamientos"></section> la usa; si no, la crea antes de #sorpresas. */
(() => {
/* ✏️ CONFIGURACIÓN (o define window.ENCHANT_CFG antes de cargar el script) */
const CFG = Object.assign({
  title: "Mesa de encantamientos",
  hint: "Acércate… algo se está encantando. Toca la mesa.",
  openLabel: "Abrir la mesa de encantamientos",
  closeLabel: "Cerrar",
  texPath: "mc/",
  glyphColor: "#f3bccb",
  items: [ // lo que se ve en el apartado: toca cada uno para revelar el texto
    { title: "✦ Lealtad III", text: "Mi corazón siempre regresa a ti, sin importar la distancia ni el tiempo." },
    { title: "✦ Infinidad I", text: "Para que las risas, los abrazos y las ganas de estar juntos no se nos acaben nunca." },
    { title: "✦ Irrompible III", text: "Por lo nuestro, que cada día que pasa se vuelve más fuerte, más bonito y más real." }
  ]
}, window.ENCHANT_CFG || {});

const calm = false;
const W = 320, H = 200, R = Math.random;
const css = document.createElement("style");
css.textContent = `
.mz{min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:10vh 1rem;position:relative;z-index:1}
.mz-t{font:400 clamp(1.5rem,5vw,2.3rem)/1.25 var(--serif,monospace);margin-bottom:.4rem}
.mz-h{opacity:.75;margin-bottom:1.2rem}
.mz-stage{position:relative;width:min(44rem,100%);aspect-ratio:${W}/${H}}
.mz canvas{width:100%;height:100%;display:block;image-rendering:pixelated}
.mz-hit{position:absolute;left:36%;top:30%;width:28%;height:58%;background:none;border:0;border-radius:12px;cursor:pointer;-webkit-tap-highlight-color:transparent}
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

/* Texturas: si falta alguna, se usa un color liso y se avisa en la consola */
const mk = (w, h) => Object.assign(document.createElement("canvas"), { width: w, height: h });
const NAMES = { top: "enchanting_table_top", side: "enchanting_table_side", shelf: "bookshelf", plank: "oak_planks", book: "enchanting_table_book", sga: "ascii_sga" };
const FALL = { top: "#8e1d3c", side: "#1a1428", shelf: "#8a6238", plank: "#a07a45", book: "#8e1d3c" };
const IMG = {};
const load = ([k, n]) => new Promise(r => {
  const i = new Image(); i.onload = () => { IMG[k] = i; r(); };
  i.onerror = () => { console.warn("Falta " + CFG.texPath + n + ".png"); r(); }; i.src = CFG.texPath + n + ".png";
});
const tex = k => { if (IMG[k]) return IMG[k]; const c = mk(64, 32); c.getContext("2d").fillStyle = FALL[k]; c.getContext("2d").fillRect(0, 0, 64, 32); return c; };

/* Escena estática isométrica (librerías, suelo y mesa), prerenderizada una sola vez */
const bg = mk(W, H), SH = [48, 272], G = [];
function init() {
  const K = 2, b = bg.getContext("2d"); b.imageSmoothingEnabled = false;
  const block = (cx, fy, h, top, side) => {
    const oy = fy - 16 * K - h * K, shade = (a) => { b.fillStyle = `rgba(0,0,0,${a})`; b.fillRect(0, 0, 16, h); };
    b.setTransform(K, K / 2, 0, K, cx - 16 * K, oy + 8 * K); b.drawImage(side, 0, 16 - h, 16, h, 0, 0, 16, h); shade(.2);
    b.setTransform(K, -K / 2, 0, K, cx, oy + 16 * K); b.drawImage(side, 0, 16 - h, 16, h, 0, 0, 16, h); shade(.4);
    b.setTransform(K, K / 2, -K, K / 2, cx, oy); b.drawImage(top, 0, 0, 16, 16, 0, 0, 16, 16);
    b.setTransform(1, 0, 0, 1, 0, 0);
  };
  b.fillStyle = "rgba(10,2,6,.45)";
  [48, 160, 272].forEach(x => { b.beginPath(); b.ellipse(x, 156, 46, 15, 0, 0, 7); b.fill(); });
  SH.forEach(x => { block(x, 172, 16, tex("plank"), tex("shelf")); block(x, 140, 16, tex("plank"), tex("shelf")); });
  block(160, 172, 12, tex("top"), tex("side"));
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
const P = [];
let o = calm ? 1 : 0, target = 0, vis = false, ready = false, last = 0, spawn = 0, raf = 0, by = 72;
const add = dur => {
  const x0 = SH[R() < .5 ? 0 : 1] - 20 + R() * 40, y0 = 80 + R() * 85;
  P.push({ x0, y0, x1: 160, y1: by + 14, cx: (x0 + 160) / 2, cy: Math.min(y0, by) - 40 - R() * 25, t: 0, sp: 1 / dur, g: G[R() * G.length | 0] });
};
function book(t) {
  const bk = tex("book"), kb = 3, h = 10 * kb, y = by | 0, w = (3 + 15 * o) | 0, pw = (w * 5 / 6) | 0;
  [-1, 1].forEach(s => {
    g.drawImage(bk, s < 0 ? 0 : 16, 0, 6, 10, s < 0 ? 160 - w : 160, y, w, h);
    if (o > .15) g.drawImage(bk, s < 0 ? 1 : 13, 11, 5, 8, s < 0 ? 159 - pw : 161, y + kb, pw, 8 * kb);
  });
  g.drawImage(bk, 12, 0, 2, 10, 159, y, 2, h);
  if (o > .5) { const fw = Math.max(1, pw * (.2 + .8 * Math.abs(Math.sin(t * 2.4))) | 0); g.drawImage(bk, 24, 10, 5, 8, 159 - fw, y + kb, fw, 8 * kb); }
}
function frame(ts) {
  const dt = Math.min(.05, (ts - last) / 1000 || .016); last = ts;
  o = calm ? target : o + (target - o) * (1 - Math.pow(.002, dt));
  const t = ts / 1000; by = 72 + (calm ? 0 : Math.sin(t * 1.6) * 3);
  g.clearRect(0, 0, W, H); g.drawImage(bg, 0, 0);
  if (o > .6 && !calm) for (spawn -= dt; spawn <= 0; spawn += .07) add(1.6 + R() * .8);
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
  vis = e.isIntersecting && e.intersectionRatio >= .3; target = vis ? 1 : 0; kick();
}, { threshold: [0, .3, .5] }).observe($(".mz-stage"));

/* Clic: ráfaga de partículas y luego abre el apartado */
const show = () => { dlg.showModal(); document.dispatchEvent(new CustomEvent("mesa-encantamientos:abierta")); };
$(".mz-hit").onclick = () => {
  if (calm) return show();
  for (let i = 0; i < 36; i++) add(.5 + R() * .3);
  kick(); setTimeout(show, 650);
};
Promise.all(Object.entries(NAMES).map(load)).then(() => { init(); ready = true; kick(); });
})();
