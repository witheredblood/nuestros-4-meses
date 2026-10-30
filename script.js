(() => {
  const C = window.CONFIG, $ = s => document.querySelector(s);
  document.querySelectorAll("[data-t]").forEach(e => e.textContent = C.text[e.dataset.t]);
  document.title = C.text.welcomeTitle;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Cielo nocturno de Minecraft: estrellas cuadradas y nubes de bloques */
  const starsBox = $("#mc-stars"), cloudsBox = $("#mc-clouds");
  if (starsBox) {
    for (let i = 0; i < 48; i++) {
      const st = document.createElement("span");
      st.className = "mc-star";
      const sz = i % 5 === 0 ? 4 : i % 2 === 0 ? 3 : 2;
      const col = i % 7 === 0 ? "#f3bccb" : i % 11 === 0 ? "#e0b3ff" : "#ffffff";
      st.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 78}%;width:${sz}px;height:${sz}px;background:${col};animation-duration:${2 + Math.random() * 3.5}s;animation-delay:${-Math.random() * 5}s`;
      starsBox.append(st);
    }
  }
  if (cloudsBox) {
    for (let i = 0; i < 5; i++) {
      const cl = document.createElement("div");
      cl.className = "mc-cloud";
      const w = 64 + Math.floor(Math.random() * 4) * 20, h = 14 + (i % 2) * 4;
      cl.style.cssText = `top:${8 + i * 13 + Math.random() * 5}%;width:${w}px;height:${h}px;animation-duration:${55 + i * 14}s;animation-delay:${-Math.random() * 60}s`;
      cloudsBox.append(cl);
    }
  }

  /* Corazones y flores de Minecraft flotando suaves en el fondo */
  const FLOWERS = [
    "assets/flores/BlockSprite_pink-petals.png",
    "assets/flores/Invicon_Allium.png",
    "assets/flores/Invicon_Blue_Orchid.png",
    "assets/flores/Invicon_Closed_Eyeblossom.webp",
    "assets/flores/Invicon_Cornflower.png",
    "assets/flores/Invicon_Dandelion.png",
    "assets/flores/Invicon_Golden_Dandelion.png",
    "assets/flores/Invicon_Lily_of_the_Valley.png",
    "assets/flores/Invicon_Open_Eyeblossom.png",
    "assets/flores/Invicon_Orange_Tulip.png",
    "assets/flores/Invicon_Oxeye_Daisy.webp",
    "assets/flores/Invicon_Pink_Tulip.png",
    "assets/flores/Invicon_Poppy.png",
    "assets/flores/Invicon_Red_Tulip.png",
    "assets/flores/Invicon_Sunflower.png",
    "assets/flores/Invicon_White_Tulip.webp"
  ];
  for (let i = 0; i < 24; i++) {
    const isFlower = i % 3 !== 0; // 16 flores de Minecraft + 8 corazones/destellos
    const p = document.createElement(isFlower ? "img" : "span");
    p.className = isFlower ? "p flw" : "p";
    if (isFlower) {
      p.src = FLOWERS[i % FLOWERS.length];
      p.alt = "";
      const sz = 18 + Math.random() * 14;
      p.style.cssText = `left:${Math.random() * 100}%;height:${sz}px;animation-duration:${16 + Math.random() * 16}s;animation-delay:${-Math.random() * 30}s`;
    } else {
      p.textContent = i % 2 ? "♥" : "✦";
      p.style.cssText = `left:${Math.random() * 100}%;font-size:${11 + Math.random() * 14}px;animation-duration:${16 + Math.random() * 16}s;animation-delay:${-Math.random() * 30}s`;
    }
    $("#petals").append(p);
  }

  /* Progreso: mesa de encantamientos + carta + sorpresa desbloquean el cierre */
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
  document.addEventListener("mesa-encantamientos:abierta", () => mark("mesa"));

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

  /* Audio y cartel de "¡Logro conseguido!" + canción "C418 - Blind Spots" */
  let achCtx = null, achBuf = null, achAudio = null, bgSong = null;
  function prepAchievementAudio() {
    try {
      achCtx = window.__mcAC = window.__mcAC || achCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (achCtx.state === "suspended") achCtx.resume();
      if (!achBuf) {
        fetch("sonidos/minecraft-rare-achievement.mp3")
          .then(r => r.ok ? r.arrayBuffer() : Promise.reject())
          .then(b => new Promise((res, rej) => achCtx.decodeAudioData(b, res, rej)))
          .then(decoded => { achBuf = decoded; })
          .catch(() => {});
      }
      if (!achAudio) {
        achAudio = new Audio("sonidos/minecraft-rare-achievement.mp3");
        achAudio.preload = "auto";
        achAudio.load();
      }
      if (!bgSong) {
        bgSong = new Audio("sonidos/blind_spots.mp3");
        bgSong.loop = true;
        bgSong.volume = 0.45;
        bgSong.preload = "auto";
        // Desbloqueo silencioso en iOS dentro del toque de usuario
        bgSong.muted = true;
        const p = bgSong.play();
        if (p && p.then) p.then(() => { bgSong.pause(); bgSong.currentTime = 0; bgSong.muted = false; }).catch(() => { bgSong.muted = false; });
        else bgSong.muted = false;
      }
    } catch (_) {}
  }
  function startMusicAfterAchievement() {
    if (bgSong) {
      bgSong.muted = false;
      bgSong.volume = 0.45;
      bgSong.play().catch(() => {});
    }
    const mt = $("#mc-music-toast");
    if (mt) {
      mt.hidden = false;
      void mt.offsetWidth;
      mt.classList.add("show");
      setTimeout(() => {
        mt.classList.remove("show");
        setTimeout(() => { mt.hidden = true; }, 650);
      }, 5500);
    }
  }
  function showAchievement() {
    const toast = $("#mc-toast");
    if (toast) {
      toast.hidden = false;
      void toast.offsetWidth;
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => { toast.hidden = true; }, 600);
      }, 5500);
    }
    // Cuando termina de sonar el logro (~5.2s), arranca C418 - Blind Spots y sale el cartel por la derecha
    setTimeout(startMusicAfterAchievement, 5200);
    try {
      if (achCtx && achBuf) {
        if (achCtx.state === "suspended") achCtx.resume();
        const src = achCtx.createBufferSource(), g = acGain(achCtx, 0.75);
        src.buffer = achBuf;
        src.connect(g).connect(achCtx.destination);
        src.start(0);
        return;
      }
    } catch (_) {}
    if (achAudio) { achAudio.volume = 0.75; achAudio.play().catch(() => {}); }
  }
  function acGain(ctx, v) { const g = ctx.createGain(); g.gain.value = v; return g; }

  $("#open").onclick = () => {
    prepAchievementAudio();
    const w = $("#welcome"), L = $("#mc-load");
    if (!L) {
      w.classList.add("gone"); $("#app").hidden = false; window.scrollTo(0, 0);
      showAchievement();
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
        setTimeout(showAchievement, 350);
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

  /* Ocho estrofas (cada una separada, se revela al tocarla) */
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  C.messages.forEach((m, idx) => {
    const num = typeof m === "object" ? m.num : (ROMAN[idx] || "♥");
    const txt = typeof m === "object" ? m.verse : m;
    const b = document.createElement("button");
    b.className = "msg";
    b.innerHTML = `<span class="msg-num">${num}</span><span class="msg-hrt" aria-hidden="true">♥</span>`;
    b.setAttribute("aria-label", `Estrofa ${num}`);
    b.onclick = () => {
      if (b.classList.contains("on")) return;
      b.classList.add("on");
      b.innerHTML = `<strong class="stanza-num">${num}</strong><span class="stanza-txt"></span>`;
      b.querySelector(".stanza-txt").textContent = txt;
      b.removeAttribute("aria-label");
      mark("sorp");
    };
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

  /* Perrita Luna al final: al tocarla salta feliz y suelta corazoncitos */
  const lunaBtn = $("#luna-pet");
  if (lunaBtn) {
    lunaBtn.onclick = () => {
      lunaBtn.classList.remove("hop"); void lunaBtn.offsetWidth; lunaBtn.classList.add("hop");
      const r = lunaBtn.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        const f = document.createElement("span"); f.className = "fx"; f.textContent = "♥";
        f.style.cssText = `left:${r.left + r.width / 2 + (Math.random() - .5) * 40}px;top:${r.top + 36}px;--dx:${(Math.random() - .5) * 130}px;font-size:${14 + Math.random() * 14}px;color:#ff5555`;
        f.onanimationend = () => f.remove(); document.body.append(f);
      }
    };
  }

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
