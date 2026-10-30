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
.mz-gui{background:#180b14;border:3px solid #000;box-shadow:inset -3px -3px 0 #3d182c,inset 3px 3px 0 #8e3b63,0 25px 60px rgba(0,0,0,.7);padding:1.4rem;text-align:left}
.mz-gui h3{font:400 1.35rem var(--serif,monospace);color:#ffff55;text-shadow:2px 2px 0 #3f3f15;margin-bottom:.4rem}
.mz-it{display:block;width:100%;margin-top:.6rem;padding:.8rem 1rem;text-align:left;background:#2a1320;border:3px solid #000;box-shadow:inset 2px 2px 0 #160911,inset -2px -2px 0 #5c2842;color:inherit;font:inherit;cursor:pointer;transition:.2s}
.mz-it:hover,.mz-it[aria-expanded=true]{border-color:#ffffa0;background:#3d1b2f}
.mz-tx{display:block;margin-top:.5rem;font:400 .95rem/1.55 var(--serif,monospace);color:var(--rose,#f3bccb)}
.mz-tx[hidden]{display:none}
.mz-x{margin-top:1.2rem;padding:.65rem 1.5rem;border:2px solid #000;border-radius:0;background:#5c2038;box-shadow:inset -3px -4px 0 #360f1f,inset 3px 3px 0 #9e4266;color:inherit;font:inherit;cursor:pointer}
.mz-x:hover{background:#782a49;color:#ffffa0;border-color:#fff}`;
document.head.append(css);

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

/* Texturas integradas pixel-art (carga instantánea en cualquier navegador/conexión) */
const mk = (w, h) => Object.assign(document.createElement("canvas"), { width: w, height: h });
const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const TEX_DATA = {"top":{"w":16,"h":16,"p":["ffffff","c3fbf1","a2f6e7","4aedd1","2ccdb1","a22929","741d32","7f0728","58162c","6b002f"],"d":"0114999999994110122375555557322112237555555732214337555665557334977556888865577995556888888655599555888888885559955688888888655995568888888865599555888888885559955568888886555997755688886557794337555665557334122375555557322112237555555732210114999999994110"},"side":{"w":16,"h":16,"p":["000000","ffffff","c3fbf1","a2f6e7","4aedd1","2ccdb1","a22929","3b2754","7f0728","6b002f","271e3d","100c1c","06030b","000001"],"d":"................................................................122599999999522123349866668943322334d966669d4332544bdd9669ddb445ddbabbd99cbbabbbabddbcaabcdbcbccbccdcccbccddbcdadbccbdcbc77abbbbc77bdbbba7bcb7bcaabcccdbbbcccdacdaccbcaccbbdcddcbcdbdcbabdcccccc"},"shelf":{"w":16,"h":16,"p":["632805","773007","911111","bc1616","695433","7c623e","cca66c","bc9862","b38c51","9b7742","9f844d","271e11","362a15","2c2213","41311a","3163a3","2a4e7a","315b8e","118e6b","0c6b50","898989","b5b5b5","a89b0a","897e08","758e11","5e720d","556809","494949","3f3f3f"],"d":"8aa995999aaaa9a88dddccdddccbhgd88cee22eeemnefgc8921132eeolk2fgi9631132fdomn2fgi6831031fopmo1fhi8820e21gpcno1ghja9877666788777889899aa5a99aaa99588ccbbcpqcdbccbd8832cfgop2eepqec89lkjfgop23dopij5632jfgrs132oplk6831jfhrsc23opij8a214ghpp412pqjg88776667887777888"},"plank":{"w":16,"h":16,"p":["b8945f","af8f55","9f844d","67502c","7e6237","967441","c29d62"],"d":"0106666606666605001152100011002210001012222110055445543344343343062666626660112010012125211000012210111500011222334454333344454306601166666666020100001222121225601122221111220233455433345443336206600266626066110022122001011112210125001222223443345554343333"},"book":{"w":32,"h":20,"p":["000000","8f8668","a76e2d","774e22","875622","c58439","ffd800","ffb100","ecddcc","f7ebde","04050a","c4b78b","dfd3a6","f4e9bf","c0b79a"],"d":"262222322268223322226286222300007444333225573333334447755223000024333332555922333333429555230000233333325558553333333285552300002333333255595533333332955523000023333332555955333333329555230000233333325558553333333285552300002433333255592233333342955523000074443332255733333344477552230000262222322268223322226286222300000eeeeeeeeee00eeeeeeeeee0dddddddd1dddddeddddd1dddddeddddcbcdccccc1bcdcceccccc1bcdccecccdccbccccdd1cbcccecddcb1cbcccecddcbdddddddd1dddddeddddd1dddddeddddcccdcbbdc1ccdcbebdccc1cbdcbebdccccddddddd1cddddeddddd1cddddeddddcbbcccbcd1bbcccebcdbc1bcccbebcdbcccddcddd1ccddcedddcc1cdddcecddcc0000000000000000000000000000000000000000"}};
const SGA_DATA = [[12,18,2,2,2,2,3,0],[4,4,4,4,8,16,31,0],[1,0,1,1,3,2,2,0],[31,0,3,4,24,0,0,0],[17,1,1,1,1,1,31,0],[31,0,21,0,0,0,0,0],[4,4,4,7,4,4,4,0],[31,0,31,4,4,4,4,0],[1,1,1,0,1,1,1,0],[1,1,0,1,0,1,1,0],[4,4,4,21,4,4,4,0],[1,5,1,1,1,5,1,0],[17,16,16,16,16,16,31,0],[9,9,8,4,4,2,1,0],[15,8,8,4,4,2,1,0],[5,4,5,5,5,1,5,0],[4,0,31,16,16,16,31,0],[9,0,0,0,0,0,9,0],[1,1,1,3,2,2,2,0],[31,16,16,16,16,0,16,0],[0,0,10,0,31,0,0,0],[4,4,4,4,31,0,31,0],[0,0,4,0,0,17,0,0],[17,8,8,4,2,2,1,0],[5,5,5,5,5,5,5,0],[4,10,17,17,17,17,17,0]];
const IMG = {};
for (const [k, t] of Object.entries(TEX_DATA)) {
  const c = mk(t.w, t.h), x = c.getContext("2d");
  for (let i = 0; i < t.d.length; i++) {
    const ch = t.d[i];
    if (ch === ".") continue;
    x.fillStyle = "#" + t.p[CHARS.indexOf(ch)];
    x.fillRect(i % t.w, (i / t.w) | 0, 1, 1);
  }
  IMG[k] = c;
}
const tex = k => IMG[k];

/* Escena isométrica: librerías (4x3) y mesa en (2,2,0) */
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

  const [tcx, tfy] = isoPos(2, 2, 0);
  b.fillStyle = "rgba(10,2,6,.42)";
  b.beginPath(); b.ellipse(tcx, tfy - 12, 36, 14, 0, 0, 7); b.fill();

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

  for (let i = 0; i < SGA_DATA.length; i++) {
    const k = mk(8, 8), q = k.getContext("2d"), rows = SGA_DATA[i];
    q.fillStyle = CFG.glyphColor;
    for (let y = 0; y < 8; y++) {
      const row = rows[y];
      for (let x = 0; x < 8; x++) {
        if ((row >> x) & 1) q.fillRect(x, y, 1, 1);
      }
    }
    G.push(k);
  }
}

/* Libro 3D y partículas */
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
  g.fillStyle = "rgba(0,0,0,.35)";
  g.beginPath(); g.ellipse(TX, TY - 42, 13 + 4 * o, 6.5 + 2 * o, 0, 0, TAU); g.fill();

  const pitch = 0.28 + 0.58 * o;
  const openAng = 0.04 + 1.15 * o;
  const cy = Math.cos(th), sy = Math.sin(th), cp = Math.cos(pitch), sp = Math.sin(pitch);

  function toWorld(lx, ly, lz) {
    const y1 = ly * cp + lz * sp;
    const z1 = -ly * sp + lz * cp;
    const wx = lx * cy - y1 * sy;
    const wy = lx * sy + y1 * cy;
    const wz = z1;
    return {
      sx: TX + (wx - wy) * S,
      sy: y0 + (wx + wy) * 0.5 * S - wz * S,
      depth: wx + wy + wz
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

  const halfGap = 1.05 * (1 - o * 0.75);
  const ca = Math.cos(openAng), sa = Math.sin(openAng);
  const L_ux = -6 * sa, L_uz = 6 * ca;
  const R_ux =  6 * sa, R_uz = 6 * ca;
  const L_nx = -ca, L_nz = -sa;
  const R_nx =  ca, R_nz = -sa;

  pushQuad([-halfGap, -5, 0], [halfGap * 2, 0, 0], [0, 10, 0], 12, 0, 2, 10, 0.22);

  pushQuad([-halfGap, -5, 0], [L_ux, 0, L_uz], [0, 10, 0], 0, 0, 6, 10, 0.08);
  pushQuad([-halfGap - L_nx * 0.15, -5, -L_nz * 0.15], [L_ux, 0, L_uz], [0, 10, 0], 6, 0, 6, 10, 0.14);

  pushQuad([halfGap, -5, 0], [R_ux, 0, R_uz], [0, 10, 0], 16, 0, 6, 10, 0.18);
  pushQuad([halfGap - R_nx * 0.15, -5, -R_nz * 0.15], [R_ux, 0, R_uz], [0, 10, 0], 22, 0, 6, 10, 0.14);

  const pThick = 0.95;
  const Lp0 = [-halfGap - L_nx * pThick + L_ux * 0.06, -4, -L_nz * pThick + L_uz * 0.06];
  const Rp0 = [ halfGap - R_nx * pThick + R_ux * 0.06, -4, -R_nz * pThick + R_uz * 0.06];
  const Lpu = [L_ux * 0.82, 0, L_uz * 0.82], Rpu = [R_ux * 0.82, 0, R_uz * 0.82];
  pushQuad(Lp0, Lpu, [0, 8, 0], 1, 11, 5, 8, 0.04);
  pushQuad(Rp0, Rpu, [0, 8, 0], 13, 11, 5, 8, 0.08);
  pushQuad([-halfGap, 4, 0], [Lpu[0], 0, Lpu[2]], [-L_nx * pThick, 0, -L_nz * pThick], 1, 11, 5, 2, 0.12);
  pushQuad([-halfGap, -4, 0], [Lpu[0], 0, Lpu[2]], [-L_nx * pThick, 0, -L_nz * pThick], 1, 11, 5, 2, 0.18);
  pushQuad([halfGap, 4, 0], [Rpu[0], 0, Rpu[2]], [-R_nx * pThick, 0, -R_nz * pThick], 13, 11, 5, 2, 0.12);
  pushQuad([halfGap, -4, 0], [Rpu[0], 0, Rpu[2]], [-R_nx * pThick, 0, -R_nz * pThick], 13, 11, 5, 2, 0.18);
  pushQuad([-halfGap + Lpu[0], -4, Lpu[2]], [-L_nx * pThick, 0, -L_nz * pThick], [0, 8, 0], 1, 11, 2, 8, 0.1);
  pushQuad([ halfGap + Rpu[0], -4, Rpu[2]], [-R_nx * pThick, 0, -R_nz * pThick], [0, 8, 0], 13, 11, 2, 8, 0.15);

  if (o > 0.25) {
    for (let ip = 0; ip < 2; ip++) {
      const ph = (t * 1.9 + ip * 1.55) % Math.PI;
      const fang = (Math.cos(ph) * 0.85) * openAng;
      const fux = Math.sin(fang) * 5, fuz = Math.cos(fang) * 5;
      pushQuad([0, -4, 0.3], [fux, 0, fuz], [0, 8, 0], 24, 10, 5, 8, 0.02);
    }
  }

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

new IntersectionObserver(([e]) => { vis = e.isIntersecting && e.intersectionRatio >= .2; kick(); }, { threshold: [0, .2] }).observe($(".mz-stage"));

$(".mz-hit").onclick = () => {
  if (want) return;
  want = true; shown = false;
  if (!calm) for (let i = 0; i < 36; i++) add(.5 + R() * .3);
  kick();
  setTimeout(() => { if (want && !shown) { shown = true; show(); } }, 2500);
};
dlg.addEventListener("close", () => { want = false; shown = false; });
init(); ready = true; kick();
})();
