(() => {
  const C = window.CONFIG, $ = s => document.querySelector(s);
  document.querySelectorAll("[data-t]").forEach(e => e.textContent = C.text[e.dataset.t]);
  document.title = C.text.welcomeTitle;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Cielo nocturno: estrellas y nubes */
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

  /* Flores y corazones flotantes */
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
    const isFlower = i % 3 !== 0;
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

  /* Progreso de secciones */
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

  /* Pantalla de carga de mundo */
  const DIRT_P = {0:"#b88860",1:"#987048",2:"#785838",3:"#584028",4:"#888888",5:"#707070",6:"#705840"};
  const DIRT_R = ["0112201122322020","2132214320120133","0223022202223302","1502132011212012","1210312213252132","2311213332232220","0222422002002121","2200112213112211","1221212321122232","2132233222220021","2120020130031142","1221102151123123","2312110222222200","2122621123032011","1230232300212211","1201124211221123"];
  function setDirtBg(el) {
    const c = document.createElement("canvas"); c.width = c.height = 16;
    const g = c.getContext("2d");
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      g.fillStyle = DIRT_P[DIRT_R[y][x]]; g.fillRect(x, y, 1, 1);
    }
    g.fillStyle = "rgba(0,0,0,.62)"; g.fillRect(0, 0, 16, 16);
    el.style.backgroundImage = `url(${c.toDataURL()})`;
  }

  /* Logro y música de fondo */
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

  /* Razones */
  const rest = [...C.reasons], rbtn = $("#rbtn");
  rbtn.onclick = () => {
    const r = rest.splice(Math.floor(Math.random() * rest.length), 1)[0];
    $("#reason").textContent = r; mark("sorp");
    if (!rest.length) { rbtn.disabled = true; rbtn.textContent = C.text.reasonsDone; }
  };

  /* Ocho estrofas (libros encantados) */
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  const bookDlg = $("#book-dlg"), bkMeta = $("#bk-meta"), bkNum = $("#bk-num"), bkTxt = $("#bk-txt");
  const bkPrev = $("#bk-prev"), bkNext = $("#bk-next"), bkClose = $("#bk-close");
  const bookBtns = [];
  let curBook = 0;

  function openBookAt(idx) {
    curBook = Math.max(0, Math.min(C.messages.length - 1, idx));
    const m = C.messages[curBook];
    const num = typeof m === "object" ? m.num : (ROMAN[curBook] || "I");
    const txt = typeof m === "object" ? m.verse : m;
    if (bkMeta) bkMeta.textContent = `Página ${curBook + 1} de ${C.messages.length}`;
    if (bkNum) bkNum.textContent = `— ${num} —`;
    if (bkTxt) bkTxt.textContent = txt;
    if (bkPrev) bkPrev.disabled = curBook === 0;
    if (bkNext) bkNext.disabled = curBook === C.messages.length - 1;
    if (bookBtns[curBook]) bookBtns[curBook].classList.add("read");
    mark("sorp");
    if (bookDlg && !bookDlg.open) bookDlg.showModal();
  }

  C.messages.forEach((m, idx) => {
    const num = typeof m === "object" ? m.num : (ROMAN[idx] || "♥");
    const b = document.createElement("button");
    b.className = "msg";
    b.type = "button";
    b.innerHTML = `<span class="mc-book-ico"><canvas class="mc-book-cv" width="16" height="16"></canvas></span><span class="msg-num">${num}<span class="msg-hrt" aria-hidden="true">♥</span></span>`;
    b.setAttribute("aria-label", `Abrir libro de estrofa ${num}`);
    b.onclick = () => openBookAt(idx);
    bookBtns.push(b);
    $("#msgs").append(b);
  });

  const BOOK_PX = [[8,1,57,16,3],[9,1,57,16,3],[10,1,57,16,3],[6,2,57,16,3],[7,2,57,16,3],[8,2,93,34,16],[9,2,108,44,25],[10,2,117,50,30],[11,2,77,24,7],[4,3,57,16,3],[5,3,57,16,3],[6,3,93,34,16],[7,3,108,44,25],[8,3,117,50,30],[9,3,117,50,30],[10,3,108,44,25],[11,3,117,50,30],[12,3,77,24,7],[2,4,57,16,3],[3,4,57,16,3],[4,4,93,34,16],[5,4,117,50,30],[6,4,117,50,30],[7,4,117,50,30],[8,4,57,16,3],[9,4,57,16,3],[10,4,117,50,30],[11,4,108,44,25],[12,4,117,50,30],[13,4,77,24,7],[0,5,57,16,3],[1,5,57,16,3],[2,5,93,34,16],[3,5,117,50,30],[4,5,117,50,30],[5,5,57,16,3],[6,5,117,50,30],[7,5,117,50,30],[8,5,117,50,30],[9,5,57,16,3],[10,5,57,16,3],[11,5,117,50,30],[12,5,108,44,25],[13,5,117,50,30],[14,5,77,24,7],[0,6,77,24,7],[1,6,93,34,16],[2,6,117,50,30],[3,6,108,44,25],[4,6,117,50,30],[5,6,117,50,30],[6,6,57,16,3],[7,6,117,50,30],[8,6,117,50,30],[9,6,117,50,30],[10,6,57,16,3],[11,6,57,16,3],[12,6,117,50,30],[13,6,108,44,25],[14,6,57,16,3],[15,6,77,24,7],[0,7,77,24,7],[1,7,57,16,3],[2,7,93,34,16],[3,7,117,50,30],[4,7,108,44,25],[5,7,117,50,30],[6,7,117,50,30],[7,7,57,16,3],[8,7,117,50,30],[9,7,117,50,30],[10,7,117,50,30],[11,7,108,44,25],[12,7,57,16,3],[13,7,57,16,3],[14,7,91,91,91],[0,8,77,24,7],[1,8,57,16,3],[2,8,183,183,183],[3,8,93,34,16],[4,8,117,50,30],[5,8,108,44,25],[6,8,117,50,30],[7,8,117,50,30],[8,8,117,50,30],[9,8,93,34,16],[10,8,57,16,3],[11,8,57,16,3],[12,8,153,153,153],[13,8,183,183,183],[14,8,153,153,153],[0,9,22,16,5],[1,9,93,34,16],[2,9,214,214,214],[3,9,183,183,183],[4,9,93,34,16],[5,9,117,50,30],[6,9,108,44,25],[7,9,93,34,16],[8,9,57,16,3],[9,9,57,16,3],[10,9,153,153,153],[11,9,183,183,183],[12,9,183,183,183],[13,9,153,153,153],[14,9,57,16,3],[15,9,77,24,7],[1,10,22,16,5],[2,10,93,34,16],[3,10,214,214,214],[4,10,183,183,183],[5,10,93,34,16],[6,10,57,16,3],[7,10,57,16,3],[8,10,153,153,153],[9,10,183,183,183],[10,10,183,183,183],[11,10,153,153,153],[12,10,57,16,3],[13,10,57,16,3],[14,10,22,16,5],[15,10,22,16,5],[2,11,22,16,5],[3,11,93,34,16],[4,11,214,214,214],[5,11,183,183,183],[6,11,153,153,153],[7,11,183,183,183],[8,11,183,183,183],[9,11,153,153,153],[10,11,57,16,3],[11,11,77,24,7],[12,11,22,16,5],[13,11,22,16,5],[3,12,22,16,5],[4,12,93,34,16],[5,12,214,214,214],[6,12,183,183,183],[7,12,153,153,153],[8,12,57,16,3],[9,12,77,24,7],[10,12,22,16,5],[11,12,22,16,5],[4,13,22,16,3],[5,13,93,34,16],[6,13,57,16,3],[7,13,77,24,7],[8,13,22,16,5],[9,13,22,16,5],[5,14,22,16,5],[6,14,22,16,5],[7,14,22,16,5]];
  const bookCvs = [...document.querySelectorAll(".mc-book-cv")].map(c => {
    const x = c.getContext("2d"); x.imageSmoothingEnabled = false; return x;
  });
  const offBook = document.createElement("canvas"); offBook.width = offBook.height = 16;
  const offCtx = offBook.getContext("2d");

  function drawEnchantedBooks(now) {
    const t = (now || 0) * 0.001;
    offCtx.clearRect(0, 0, 16, 16);
    for (let i = 0; i < BOOK_PX.length; i++) {
      const p = BOOK_PX[i], x = p[0], y = p[1];
      const w1 = Math.sin((x * 0.36 + y * 0.24) - t * 3.2);
      const w2 = Math.sin((x * 0.22 - y * 0.34) + t * 2.1);
      const g1 = w1 > 0 ? w1 * w1 * w1 : 0;
      const g2 = w2 > 0 ? w2 * w2 * w2 * w2 * 0.75 : 0;
      const k = Math.min(1.25, g1 + g2);
      const r = Math.min(255, p[2] + ((180 * k) | 0));
      const g = Math.min(255, p[3] + ((60  * k) | 0));
      const b = Math.min(255, p[4] + ((255 * k) | 0));
      offCtx.fillStyle = `rgb(${r},${g},${b})`;
      offCtx.fillRect(x, y, 1, 1);
    }
    for (let c = 0; c < bookCvs.length; c++) {
      bookCvs[c].clearRect(0, 0, 16, 16);
      bookCvs[c].drawImage(offBook, 0, 0);
    }
    requestAnimationFrame(drawEnchantedBooks);
  }
  drawEnchantedBooks(0);

  if (bkPrev) bkPrev.onclick = () => openBookAt(curBook - 1);
  if (bkNext) bkNext.onclick = () => openBookAt(curBook + 1);
  if (bkClose) bkClose.onclick = () => bookDlg.close();
  if (bookDlg) bookDlg.onclick = e => { if (e.target === bookDlg) bookDlg.close(); };

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

  /* Perrita Luna */
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

  /* Botón de música opcional */
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
