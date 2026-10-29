(() => {
  const C = window.CONFIG, $ = s => document.querySelector(s);
  document.querySelectorAll("[data-t]").forEach(e => e.textContent = C.text[e.dataset.t]);
  document.title = C.text.welcomeTitle;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Pétalos suaves de fondo */
  if (!calm) for (let i = 0; i < 14; i++) {
    const p = document.createElement("span");
    p.className = "p"; p.textContent = i % 3 ? "♥" : "✦";
    p.style.cssText = `left:${Math.random() * 100}%;font-size:${10 + Math.random() * 14}px;animation-duration:${16 + Math.random() * 16}s;animation-delay:${-Math.random() * 30}s`;
    $("#petals").append(p);
  }

  /* Progreso: foto + carta + sorpresa desbloquean el cierre */
  const done = new Set(), prog = $("#prog");
  prog.textContent = "Descubierto 0 de 3";
  function mark(k) {
    if (done.has(k)) return;
    done.add(k);
    if (done.size < 3) { prog.textContent = `Descubierto ${done.size} de 3`; return; }
    const b = document.createElement("button");
    b.className = "btn"; b.textContent = C.text.moreBtn;
    b.onclick = () => {
      const f = $("#final"); f.hidden = false; f.classList.add("show");
      f.scrollIntoView({ behavior: calm ? "auto" : "smooth" }); prog.remove();
    };
    prog.replaceChildren(b);
  }

  /* Bienvenida -> Pantalla de carga de mundo de Minecraft -> Regalo */
  const DIRT_P = {0:"#b88860",1:"#987048",2:"#785838",3:"#584028",4:"#888888",5:"#707070",6:"#705840"};
  const DIRT_R = ["0112201122322020","2132214320120133","0223022202223302","1502132011212012","1210312213252132","2311213332232220","0222422002002121","2200112213112211","1221212321122232","2132233222220021","2120020130031142","1221102151123123","2312110222222200","2122621123032011","1230232300212211","1201124211221123"];
  function setDirtBg(el) {
    const c = document.createElement("canvas"); c.width = c.height = 16;
    const g = c.getContext("2d");
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      g.fillStyle = DIRT_P[DIRT_R[y][x]]; g.fillRect(x, y, 1, 1);
    }
    g.fillStyle = "rgba(0,0,0,.62)"; g.fillRect(0, 0, 16, 16); // oscurecido clásico de fondo de menú
    el.style.backgroundImage = `url(${c.toDataURL()})`;
  }

  $("#open").onclick = () => {
    const w = $("#welcome"), L = $("#mc-load");
    if (!L) {
      w.classList.add("gone"); $("#app").hidden = false; window.scrollTo(0, 0);
      dispatchEvent(new Event("mc-ready")); setTimeout(() => w.remove(), 1200); return;
    }
    setDirtBg(L);
    L.hidden = false; w.remove();

    const cv = $("#mc-chunks"), g = cv.getContext("2d");
    const N = 11, C = Math.floor(N / 2), cells = [];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      cells.push({ x, y, d: Math.max(Math.abs(x - C), Math.abs(y - C)) + Math.random() * .6 });
    }
    cells.sort((a, b) => a.d - b.d);

    const tEl = $("#mc-title"), pEl = $("#mc-pct"), fEl = $("#mc-fill");
    const steps = [
      [0, "Preparando nuestro mundo..."],
      [22, "Generando terreno..."],
      [55, "Construyendo recuerdos..."],
      [82, "Plantando flores y corazones..."],
      [96, "¡Listo!"]
    ];
    const dur = 3100, t0 = performance.now();
    function step(now) {
      const k = Math.min(1, (now - t0) / dur), pct = Math.floor(k * 100);
      pEl.textContent = pct + "%";
      fEl.style.width = pct + "%";
      for (const [p, txt] of steps) if (pct >= p) tEl.textContent = txt;

      // Cuadrícula central de chunks como cuando creas un mundo en Minecraft
      g.fillStyle = "#141414"; g.fillRect(0, 0, 110, 110);
      const count = Math.floor(k * cells.length);
      for (let i = 0; i < count; i++) {
        const cell = cells[i], age = count - i;
        g.fillStyle = cell.x === C && cell.y === C ? "#ffffff"
          : age < 6 ? "#477030"
          : age < 18 ? "#67a644"
          : "#88d65c";
        g.fillRect(cell.x * 10 + 1, cell.y * 10 + 1, 8, 8);
      }
      if (k < 1) requestAnimationFrame(step);
      else setTimeout(() => {
        $("#app").hidden = false; window.scrollTo(0, 0); $("#app").focus({ preventScroll: true });
        L.classList.add("gone");
        dispatchEvent(new Event("mc-ready"));
        setTimeout(() => L.remove(), 1100);
      }, 300);
    }
    requestAnimationFrame(step);
  };

  /* Contador de tiempo juntos */
  const count = $("#count"), t0 = C.startDate ? new Date(C.startDate + "T00:00:00") : null;
  if (!t0 || isNaN(t0)) {
    count.className = "warn"; count.textContent = "Falta poner la fecha de noviazgo en config.js (startDate).";
  } else {
    const labels = ["días", "horas", "min", "seg"], nums = labels.map(l => {
      const d = document.createElement("div"), b = document.createElement("b"), s = document.createElement("small");
      s.textContent = l; d.append(b, s); count.append(d); return b;
    });
    const tick = () => {
      const s = Math.max(0, Math.floor((Date.now() - t0) / 1000));
      [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60].forEach((v, i) => nums[i].textContent = v);
    };
    tick(); setInterval(tick, 1000);
  }

  /* Galería de recuerdos */
  const ph = p => {
    const d = document.createElement("div"); d.className = "ph"; d.innerHTML = "<span>Tu foto aquí</span>";
    const i = new Image(); i.alt = ""; i.src = p.src; i.onerror = () => i.remove(); d.append(i); return d;
  };
  const dlg = $("#dlg");
  C.photos.forEach((p, i) => {
    const b = document.createElement("button");
    b.className = "polaroid"; b.style.setProperty("--r", (i % 2 ? 1 : -1) * (1 + i % 3) + "deg");
    b.setAttribute("aria-label", `Abrir recuerdo ${i + 1}`);
    const s = document.createElement("small"); s.textContent = `Recuerdo ${i + 1}`;
    b.append(ph(p), s);
    b.onclick = () => { $("#dph").replaceChildren(ph(p)); $("#dcap").textContent = p.text; dlg.showModal(); mark("mem"); };
    $("#grid").append(b);
  });
  $("#dx").onclick = () => dlg.close();
  dlg.onclick = e => { if (e.target === dlg) dlg.close(); };

  /* Carta */
  C.letter.forEach(t => { const p = document.createElement("p"); p.innerHTML = t; $("#paper").append(p); });
  $("#env").onclick = e => {
    const b = e.currentTarget; b.classList.add("open"); b.disabled = true;
    setTimeout(() => { b.classList.add("gone"); $("#paper").classList.add("show"); mark("letter"); }, calm ? 0 : 900);
  };

  /* Razones (al azar, sin repetir) */
  const rest = [...C.reasons], rbtn = $("#rbtn");
  rbtn.onclick = () => {
    const r = rest.splice(Math.floor(Math.random() * rest.length), 1)[0];
    $("#reason").textContent = r; mark("sorp");
    if (!rest.length) { rbtn.disabled = true; rbtn.textContent = C.text.reasonsDone; }
  };

  /* Mensajitos */
  C.messages.forEach(m => {
    const b = document.createElement("button"); b.className = "msg"; b.textContent = "♥";
    b.setAttribute("aria-label", "Mensaje escondido");
    b.onclick = () => { b.classList.add("on"); b.textContent = m; b.removeAttribute("aria-label"); mark("sorp"); };
    $("#msgs").append(b);
  });

  /* Corazón interactivo */
  let n = 0; const heart = $("#heart");
  heart.onclick = () => {
    heart.classList.remove("beat"); void heart.offsetWidth; heart.classList.add("beat");
    $("#hmsg").textContent = C.heartLines[Math.min(n++, C.heartLines.length - 1)]; mark("sorp");
    if (calm) return;
    const r = heart.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      const f = document.createElement("span"); f.className = "fx"; f.textContent = "♥";
      f.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;--dx:${(Math.random() - .5) * 140}px;font-size:${12 + Math.random() * 14}px`;
      f.onanimationend = () => f.remove(); document.body.append(f);
    }
  };

  /* Música opcional: solo suena si ella la activa */
  if (C.music) {
    const a = new Audio(C.music), m = document.createElement("button");
    a.loop = true; m.id = "music"; m.className = "btn"; m.textContent = "♪";
    m.setAttribute("aria-label", "Música"); m.setAttribute("aria-pressed", "false");
    m.onclick = () => {
      const on = m.getAttribute("aria-pressed") !== "true";
      on ? a.play().catch(() => { }) : a.pause(); m.setAttribute("aria-pressed", on);
    };
    $("#app").append(m);
  }
})();
