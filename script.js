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

  /* Flores y hojas de cerezo flotantes */
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
    "assets/flores/Invicon_White_Tulip.webp",
    "mc/cherry_0.png",
    "mc/cherry_1.png",
    "mc/cherry_2.png",
    "mc/cherry_3.png"
  ];
  for (let i = 0; i < 28; i++) {
    const src = FLOWERS[i % FLOWERS.length];
    const isCherry = src.includes("cherry_");
    const p = document.createElement("img");
    p.className = "p flw";
    p.src = src;
    p.alt = "";
    const sz = isCherry ? (10 + Math.random() * 6) : (18 + Math.random() * 14);
    p.style.cssText = `left:${Math.random() * 100}%;height:${sz}px;animation-duration:${15 + Math.random() * 16}s;animation-delay:${-Math.random() * 30}s`;
    $("#petals").append(p);
  }

  function spawnSpriteParticles(rect, imgSrc, count = 6, szMin = 16, szVar = 8) {
    for (let i = 0; i < count; i++) {
      const f = document.createElement("img");
      f.className = "fx-img";
      f.src = imgSrc;
      f.alt = "";
      const sz = (szMin + Math.random() * szVar) | 0;
      f.style.cssText = `left:${rect.left + rect.width / 2 + (Math.random() - .5) * 44}px;top:${rect.top + rect.height / 2 + (Math.random() - .5) * 20}px;--dx:${(Math.random() - .5) * 140}px;width:${sz}px;height:${sz}px`;
      f.onanimationend = () => f.remove();
      document.body.append(f);
    }
  }

  /* Barra de experiencia (XP) de Minecraft */
  const done = new Set(), prog = $("#prog"), xpLvl = $("#xp-lvl"), xpTxt = $("#xp-txt"), xpFill = $("#xp-bar-fill");
  const XP_LVLS = [0, 1, 2, 4];
  function mark(k) {
    if (done.has(k)) return;
    done.add(k);
    const n = done.size, lvl = XP_LVLS[n] || 4, pct = Math.round((n / 3) * 100);
    if (xpLvl) xpLvl.textContent = lvl;
    if (xpFill) xpFill.style.width = pct + "%";
    if (prog) spawnSpriteParticles(prog.getBoundingClientRect(), "mc/xp_orb.png", 6, 14, 6);
    if (n < 3) {
      if (xpTxt) xpTxt.textContent = `Descubierto ${n} de 3 · Nivel ${lvl}/4`;
      return;
    }
    if (xpTxt) xpTxt.textContent = "¡Nivel 4 alcanzado!";
    setTimeout(() => {
      const b = document.createElement("button");
      b.className = "btn";
      b.textContent = "✦ Nivel 4: " + C.text.moreBtn + " ✦";
      b.onclick = () => {
        const f = $("#final"); f.hidden = false; f.classList.add("show");
        f.scrollIntoView({ behavior: calm ? "auto" : "smooth" }); prog.remove();
        setTimeout(() => dispatchEvent(new Event("mc-fireworks-burst")), 500);
      };
      prog.replaceChildren(b);
    }, 550);
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

  /* Bloqueo hasta el 10 de noviembre y desbloqueo con código secreto */
  const openBtn = $("#open"), openLbl = $("#open-lbl"), openLockIco = $("#open-lock-ico");
  const lockBox = $("#mc-lock-box"), lockCount = $("#lock-count");
  const secretForm = $("#secret-form"), secretInput = $("#secret-input"), secretMsg = $("#secret-msg");
  const SECRET_CODE = String(C.secretCode || "091020040525200310072026").trim();
  const nowInit = new Date();
  const unlockTarget = C.unlockDate ? new Date(C.unlockDate) : new Date(nowInit.getFullYear(), 10, 10, 0, 0, 0);
  const yearNov10 = new Date(nowInit.getFullYear(), 10, 10, 0, 0, 0);
  const targetMs = nowInit.getFullYear() < 2026 ? yearNov10.getTime() : unlockTarget.getTime();
  let isUnlocked = Date.now() >= targetMs;
  let lockTimer = 0;

  function unlockSite(byCode) {
    if (isUnlocked) return;
    isUnlocked = true;
    if (lockTimer) clearInterval(lockTimer);
    if (openBtn) openBtn.disabled = false;
    if (openLockIco) openLockIco.hidden = true;
    if (openLbl) openLbl.textContent = C.text.openBtn;
    if (byCode && lockBox) {
      if (secretMsg) {
        secretMsg.className = "secret-msg ok";
        secretMsg.textContent = "¡Código correcto! Mundo desbloqueado ♥";
      }
      const r = lockBox.getBoundingClientRect();
      spawnSpriteParticles(r, "mc/xp_orb.png", 8, 16, 8);
      spawnSpriteParticles(r, "mc/particle_heart.png", 6, 16, 8);
      setTimeout(() => { lockBox.hidden = true; }, 750);
    } else if (lockBox) {
      lockBox.hidden = true;
    }
  }

  if (!isUnlocked && lockBox && lockCount) {
    lockBox.hidden = false;
    if (openBtn) openBtn.disabled = true;
    if (openLockIco) openLockIco.hidden = false;
    if (openLbl) openLbl.textContent = "Disponible el 10 de noviembre";

    const lLabels = ["días", "horas", "min", "seg"], lNums = lLabels.map(l => {
      const d = document.createElement("div"), b = document.createElement("b"), s = document.createElement("small");
      s.textContent = l; d.append(b, s); lockCount.append(d); return b;
    });
    const tickLock = () => {
      const rem = Math.max(0, Math.floor((targetMs - Date.now()) / 1000));
      [Math.floor(rem / 86400), Math.floor(rem % 86400 / 3600), Math.floor(rem % 3600 / 60), rem % 60].forEach((v, i) => lNums[i].textContent = v);
      if (rem <= 0) unlockSite(false);
    };
    tickLock();
    lockTimer = setInterval(tickLock, 1000);

    if (secretInput) {
      secretInput.addEventListener("input", () => {
        if (secretInput.value.replace(/\s+/g, "") === SECRET_CODE) unlockSite(true);
      });
    }
    if (secretForm) {
      secretForm.onsubmit = e => {
        e.preventDefault();
        if (secretInput && secretInput.value.replace(/\s+/g, "") === SECRET_CODE) {
          unlockSite(true);
        } else if (secretMsg) {
          secretMsg.className = "secret-msg";
          secretMsg.textContent = "Código incorrecto · Espera al 10 de noviembre ♥";
        }
      };
    }
    let keyBuf = "";
    window.addEventListener("keydown", e => {
      if (isUnlocked || !/^[0-9]$/.test(e.key)) return;
      keyBuf = (keyBuf + e.key).slice(-SECRET_CODE.length);
      if (keyBuf === SECRET_CODE) unlockSite(true);
    });
  }

  $("#open").onclick = () => {
    if (!isUnlocked) return;
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

  /* Icono isométrico de cofre de Minecraft */
  const chestCv = $("#chest-ico");
  if (chestCv) {
    const cg = chestCv.getContext("2d"); cg.imageSmoothingEnabled = false;
    const poly = (pts, col) => {
      cg.fillStyle = col; cg.beginPath();
      pts.forEach((p, i) => i ? cg.lineTo(p[0], p[1]) : cg.moveTo(p[0], p[1]));
      cg.closePath(); cg.fill();
    };
    poly([[12, 2], [22, 7], [12, 12], [2, 7]], "#c48428");
    poly([[2, 7], [12, 12], [12, 22], [2, 17]], "#9c641c");
    poly([[12, 12], [22, 7], [22, 17], [12, 22]], "#784c14");
    poly([[2, 10], [12, 15], [22, 10], [22, 11.5], [12, 16.5], [2, 11.5]], "#1f1912");
    poly([[15.5, 11.5], [18, 10.2], [18, 13.8], [15.5, 15.1]], "#d8d8d8");
  }

  /* Dos camitas de Minecraft juntas en isométrico 3D */
  const bedsCv = $("#mc-beds");
  if (bedsCv) {
    const bg = bedsCv.getContext("2d"); bg.imageSmoothingEnabled = false;
    const K = 1.65, OX = 94, OY = 56;
    const iso = (x, y, z) => [OX + (x - y) * K, OY + (x + y) * 0.5 * K - z * K];
    const quad = (p0, p1, p2, p3, col) => {
      bg.fillStyle = col; bg.beginPath();
      bg.moveTo(p0[0], p0[1]); bg.lineTo(p1[0], p1[1]);
      bg.lineTo(p2[0], p2[1]); bg.lineTo(p3[0], p3[1]);
      bg.closePath(); bg.fill();
    };
    const box3d = (x0, y0, z0, dx, dy, dz, cTop, cLeft, cRight) => {
      const x1 = x0 + dx, y1 = y0 + dy, z1 = z0 + dz;
      quad(iso(x0, y1, z0), iso(x1, y1, z0), iso(x1, y1, z1), iso(x0, y1, z1), cLeft);
      quad(iso(x1, y0, z0), iso(x1, y1, z0), iso(x1, y1, z1), iso(x1, y0, z1), cRight);
      quad(iso(x0, y0, z1), iso(x1, y0, z1), iso(x1, y1, z1), iso(x0, y1, z1), cTop);
    };
    const drawBed = (yOff, cTop, cLeft, cRight) => {
      const legs = [[-16, yOff], [13, yOff], [-16, yOff + 13], [13, yOff + 13]];
      legs.forEach(([lx, ly]) => box3d(lx, ly, 0, 3, 3, 3, "#b8945f", "#8a6b3e", "#67502c"));
      box3d(-16, yOff, 3, 32, 16, 2, "#b8945f", "#967441", "#755830");
      box3d(-16, yOff, 5, 11, 16, 4, "#f5f5f5", "#dcdcdc", "#bdbdbd");
      box3d(-5, yOff, 5, 21, 16, 4, cTop, cLeft, cRight);
    };
    bg.fillStyle = "rgba(0,0,0,.38)";
    bg.beginPath(); bg.ellipse(OX, OY + 18, 66, 26, 0, 0, Math.PI * 2); bg.fill();
    drawBed(-17, "#c92b2b", "#a32121", "#7d1818");
    drawBed(1, "#f38baa", "#d96c8d", "#b55170");
    const hrtImg = new Image();
    hrtImg.onload = () => {
      const [hx, hy] = iso(-10, 0, 16);
      bg.drawImage(hrtImg, (hx - 9) | 0, (hy - 9) | 0, 18, 18);
    };
    hrtImg.src = "mc/particle_heart.png";
  }

  /* Corazón interactivo */
  let n = 0; const heart = $("#heart");
  heart.onclick = () => {
    heart.classList.remove("beat"); void heart.offsetWidth; heart.classList.add("beat");
    $("#hmsg").textContent = C.heartLines[Math.min(n++, C.heartLines.length - 1)]; mark("sorp");
    if (calm) return;
    spawnSpriteParticles(heart.getBoundingClientRect(), "mc/particle_heart.png", 7, 16, 10);
  };

  /* Perrita Luna y sus premios */
  const lunaBtn = $("#luna-pet"), lunaStatus = $("#luna-status");
  function petLuna(msg) {
    if (!lunaBtn) return;
    lunaBtn.classList.remove("hop"); void lunaBtn.offsetWidth; lunaBtn.classList.add("hop");
    if (msg && lunaStatus) lunaStatus.textContent = msg;
    const r = lunaBtn.getBoundingClientRect();
    spawnSpriteParticles({ left: r.left, top: r.top, width: r.width, height: 70 }, "mc/particle_heart.png", 7, 16, 10);
  }
  if (lunaBtn) {
    lunaBtn.onclick = () => petLuna("¡Guau! Luna está feliz de verte y te quiere mucho ♥");
  }
  document.querySelectorAll(".treat-btn").forEach(btn => {
    btn.onclick = () => {
      const isBone = btn.dataset.treat === "bone";
      petLuna(isBone
        ? "¡Luna recibió su huesito y no para de mover la colita por ti! ♥"
        : "¡Ñam! A Luna le encantó su filete y te manda muchos lengüetazos ♥");
    };
  });

  /* Sonidos sintetizados estilo Minecraft para interacciones */
  function playUiTone(freqs, dur = 0.12, type = "triangle", vol = 0.08) {
    try {
      const ac = window.__mcAC = window.__mcAC || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === "suspended") ac.resume();
      const now = ac.currentTime;
      freqs.forEach((f, idx) => {
        const osc = ac.createOscillator(), g = ac.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(f, now + idx * 0.07);
        g.gain.setValueAtTime(0.001, now + idx * 0.07);
        g.gain.exponentialRampToValueAtTime(vol, now + idx * 0.07 + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.07 + dur);
        osc.connect(g).connect(ac.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + dur + 0.02);
      });
    } catch (_) {}
  }

  /* 1. Ciclo de cielo al tocar la Luna / Sol */
  const moonBtn = $("#mc-moon"), skyToast = $("#sky-toast");
  const SKY_MODES = [
    { id: "night", label: "Hora cambiada a: Noche estrellada ☾" },
    { id: "sunset", label: "Hora cambiada a: Atardecer de Minecraft ☀" },
    { id: "cherry", label: "Hora cambiada a: Amanecer de Cerezos ✿" }
  ];
  let skyIdx = 0, skyTimer = 0;
  if (moonBtn) {
    moonBtn.onclick = () => {
      skyIdx = (skyIdx + 1) % SKY_MODES.length;
      const mode = SKY_MODES[skyIdx];
      document.body.dataset.sky = mode.id;
      playUiTone([523.25, 659.25, 783.99], 0.16, "sine", 0.07);
      const r = moonBtn.getBoundingClientRect();
      spawnSpriteParticles(r, mode.id === "cherry" ? "mc/cherry_0.png" : "mc/particle_heart.png", 6, 14, 8);
      if (skyToast) {
        skyToast.textContent = mode.label;
        skyToast.hidden = false;
        clearTimeout(skyTimer);
        skyTimer = setTimeout(() => { skyToast.hidden = true; }, 2600);
      }
    };
  }

  /* 2. Abejita interactiva flotante de Minecraft */
  const beeWrap = $("#mc-bee-wrap"), beeBtn = $("#mc-bee-btn"), beeCv = $("#mc-bee-cv"), beeBubble = $("#mc-bee-bubble");
  if (beeWrap && beeBtn && beeCv) {
    const bg = beeCv.getContext("2d");
    bg.imageSmoothingEnabled = false;
    let beeT = 0, beeNoteIdx = 0, bubbleTimer = 0;
    let bx = window.innerWidth * 0.18, by = window.innerHeight * 0.28;

    function drawBee(wingUp) {
      bg.clearRect(0, 0, 56, 48);
      const px = (x, y, w, h, c) => { bg.fillStyle = c; bg.fillRect(x * 2, y * 2, w * 2, h * 2); };
      // Alas pixel-art
      if (wingUp) {
        px(10, 2, 5, 5, "rgba(235,248,255,0.88)");
        px(15, 3, 4, 4, "rgba(210,235,255,0.78)");
      } else {
        px(10, 6, 5, 4, "rgba(235,248,255,0.88)");
        px(15, 7, 4, 3, "rgba(210,235,255,0.78)");
      }
      // Cuerpo de abejita de Minecraft
      px(6, 9, 15, 10, "#f6c93e");
      px(7, 8, 13, 1, "#ffe169");
      // Franjas oscuras
      px(11, 8, 2, 11, "#2d211b");
      px(15, 8, 2, 11, "#2d211b");
      px(19, 9, 2, 10, "#2d211b");
      // Sombra inferior
      px(7, 18, 13, 1, "#c89622");
      // Ojos y mejilla rosada
      px(7, 11, 2, 4, "#161219");
      px(7, 11, 1, 1, "#55ffff");
      px(8, 15, 2, 1, "#f38baa");
      // Antenas
      px(4, 9, 2, 1, "#2d211b");
      px(4, 8, 1, 1, "#2d211b");
      // Patitas
      px(11, 19, 1, 2, "#2d211b");
      px(14, 19, 1, 2, "#2d211b");
      px(17, 19, 1, 2, "#2d211b");
      // Florcita que lleva
      px(8, 19, 2, 2, "#ff66aa");
    }

    function stepBee(now) {
      const t = (now || 0) * 0.001;
      const dt = Math.min(0.05, t - beeT || 0.016);
      beeT = t;
      const vw = Math.max(300, window.innerWidth - 76);
      const vh = Math.max(300, window.innerHeight - 180);
      const tx = 20 + (Math.sin(t * 0.42) * 0.5 + 0.5) * (vw - 40);
      const ty = 72 + (Math.cos(t * 0.65) * 0.5 + 0.5) * Math.min(260, vh * 0.5);
      const flip = tx >= bx ? -1 : 1;
      bx += (tx - bx) * Math.min(1, dt * 3);
      by += (ty - by) * Math.min(1, dt * 3);
      drawBee(Math.sin(t * 28) > 0);
      beeWrap.style.transform = `translate3d(${bx.toFixed(1)}px,${by.toFixed(1)}px,0)`;
      beeCv.style.transform = `scaleX(${flip})`;
      requestAnimationFrame(stepBee);
    }

    addEventListener("mc-ready", () => {
      beeWrap.hidden = false;
      requestAnimationFrame(stepBee);
    }, { once: true });

    beeBtn.onclick = () => {
      beeBtn.classList.remove("spin"); void beeBtn.offsetWidth; beeBtn.classList.add("spin");
      playUiTone([587.33, 783.99, 987.77], 0.14, "triangle", 0.08);
      const r = beeBtn.getBoundingClientRect();
      spawnSpriteParticles(r, "mc/particle_heart.png", 5, 14, 8);
      spawnSpriteParticles(r, Math.random() < 0.5 ? "mc/pink_tulip.png" : "mc/poppy.png", 3, 18, 6);
      const notes = C.beeNotes || ["Bzz ♥ Te quiero muchísimo"];
      if (beeBubble) {
        beeBubble.textContent = notes[beeNoteIdx % notes.length];
        beeNoteIdx++;
        beeBubble.hidden = false;
        clearTimeout(bubbleTimer);
        bubbleTimer = setTimeout(() => { beeBubble.hidden = true; }, 4200);
      }
    };
  }

  /* Texturas 16x16 embebidas para bloques isométricos (Mesa de Trabajo y Tocadiscos) */
  const ISO_PIX = {
    crafting_table_top: { p: {"0":"#19140c","1":"#0e0b06","2":"#41230e","3":"#733920","4":"#1a150d","5":"#bc9862","6":"#9e5932","7":"#ae693c","8":"#553824","9":"#4b2b18"}, r: ["0110233333324140","1552677777762551","1527777777777251","0278988899998720","2678678779778762","3778779678678773","3778898898898773","3778778778778773","3778778778778773","3779998998898773","3779679769778773","2678679779678762","4278898888888724","1527777777777251","4552677777762554","0414233333320110"] },
    crafting_table_front: { p: {"0":"#19140c","1":"#af8f55","2":"#b8945f","3":"#c29d62","4":"#382116","5":"#733920","6":"#4b2b18","7":"#967441","8":"#9f844d","9":"#7e6237","a":"#67502c","b":"#1b160d","c":"#41230e","d":"#281e0b","e":"#b5b5b5","f":"#ffffff","g":"#d8d8d8","h":"#110e08"}, r: ["0123345665433320","0211784664112280","0222121448811220","099779abb9accc90","03833336633d1d80","022c8184411ddd20","081d1114422eee80","0a9d79abba9fgg90","033d1136633fgg20","01ggg2144818gg80","02egf8844111fg20","0a9779ahh9799ga0","0823322663383f30","0122881442212110","0881218442188880","b99aa970b9a9aaab"] },
    crafting_table_side: { p: {"0":"#19140c","1":"#af8f55","2":"#b8945f","3":"#c29d62","4":"#382116","5":"#733920","6":"#4b2b18","7":"#967441","8":"#9f844d","9":"#262012","a":"#7e6237","b":"#67502c","c":"#1b160d","d":"#41230e","e":"#281e0b","f":"#d8d8d8","g":"#b5b5b5","h":"#110e08"}, r: ["0123345665433320","0211784664112280","0222121998811220","0aa77abccababba0","0383333663321180","022d8d8441122220","081e1e1442211880","0baafabccbaaa7a0","033f1f3663333320","012g2g1448181880","0211888441118820","0ba77abhha7aabb0","0823322663383230","0122881442212110","0881218442188880","caabba70cababbbc"] },
    jukebox_top: { p: {"0":"#292820","1":"#352f2b","2":"#5a3420","3":"#5a3c29","4":"#7b5039","5":"#945d41","6":"#181514"}, r: ["0011001111101000","0234433333443320","0345554334555431","1354443003444531","1354443063444541","0354443663444541","0354443663444541","1454443663444531","1454443663444531","1454443663444531","1354443663444540","1354443603444540","1354443003444541","1345554334555431","0234433344433320","0001111111101000"] },
    jukebox_side: { p: {"0":"#292820","1":"#5a3c29","2":"#7b5039","3":"#945d41","4":"#412818","5":"#5a3420"}, r: ["0000000000000000","0123322333323210","0234343434342420","0343545354535430","0334353435342530","0254535453545230","0335343524352420","0243545354535410","0124352435242530","0254535453545220","0325243524352420","0242545254525410","0214252425242420","0144424442444210","0111111111111110","0000000000000000"] }
  };
  function makeIsoTex(name) {
    const c = document.createElement("canvas"); c.width = c.height = 16;
    const g = c.getContext("2d"), T = ISO_PIX[name];
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      g.fillStyle = T.p[T.r[y][x]]; g.fillRect(x, y, 1, 1);
    }
    return c;
  }
  const ISO_TEX = Object.fromEntries(Object.keys(ISO_PIX).map(k => [k, makeIsoTex(k)]));
  function drawIsoBlock(ctx, cx, fy, K, topTex, leftTex, rightTex, shL = 0.14, shR = 0.32) {
    const h = 16, oy = fy - 16 * K - h * K;
    ctx.fillStyle = "rgba(10,2,6,.42)";
    ctx.beginPath(); ctx.ellipse(cx, fy - 12, 18 * K, 8.5 * K, 0, 0, Math.PI * 2); ctx.fill();

    ctx.setTransform(K, K / 2, 0, K, cx - 16 * K, oy + 8 * K);
    ctx.drawImage(leftTex, 0, 0, 16, 16, 0, 0, 16, 16);
    if (shL > 0) { ctx.fillStyle = `rgba(0,0,0,${shL})`; ctx.fillRect(0, 0, 16, 16); }

    ctx.setTransform(K, -K / 2, 0, K, cx, oy + 16 * K);
    ctx.drawImage(rightTex, 0, 0, 16, 16, 0, 0, 16, 16);
    if (shR > 0) { ctx.fillStyle = `rgba(0,0,0,${shR})`; ctx.fillRect(0, 0, 16, 16); }

    ctx.setTransform(K, K / 2, -K, K / 2, cx, oy);
    ctx.drawImage(topTex, 0, 0, 16, 16, 0, 0, 16, 16);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /* 3. Mesa de Trabajo (Crafting Table 3x3 + vista isométrica 3D) */
  const craftTabs = $("#craft-tabs"), craftGrid = $("#craft-grid"), craftOut = $("#craft-out");
  const craftOutImg = $("#craft-out-img"), craftCard = $("#craft-card");
  const craftIsoCv = $("#craft-iso-cv"), craftIsoBtn = $("#craft-iso-btn");
  const ALL_ITEMS = [
    "mc/sugar.png", "mc/pink_petals.png", "mc/diamond.png",
    "mc/paper.png", "mc/golden_apple.png", "mc/honey_bottle.png",
    "mc/amethyst_shard.png", "mc/writable_book.png"
  ];
  if (craftTabs && craftGrid && craftOut && C.recipes && C.recipes.length) {
    let curRecipe = C.recipes[0];
    const slotImgs = [];
    const floatImg = new Image();
    floatImg.src = curRecipe.resultIcon;

    for (let i = 0; i < 9; i++) {
      const slot = document.createElement("button");
      slot.type = "button";
      slot.className = "craft-slot";
      slot.setAttribute("aria-label", `Casilla de fabricación ${i + 1}`);
      const img = document.createElement("img");
      img.alt = "";
      slot.append(img);
      slot.onclick = () => {
        const curIdx = ALL_ITEMS.indexOf(img.getAttribute("src"));
        const nextSrc = ALL_ITEMS[(curIdx + 1) % ALL_ITEMS.length];
        img.src = nextSrc;
        playUiTone([440, 554.37], 0.08, "square", 0.05);
      };
      slotImgs.push(img);
      craftGrid.append(slot);
    }

    function renderCraftCard(rec, crafted) {
      if (!craftCard) return;
      craftCard.innerHTML =
        `<p class="tt-title">${crafted ? "¡Crafteado! · " : ""}${rec.name}</p>` +
        `<p class="tt-lore">${rec.lore}</p>` +
        `<p class="tt-desc">${rec.desc}</p>`;
    }

    function selectRecipe(rec, tabBtn) {
      curRecipe = rec;
      floatImg.src = rec.resultIcon;
      craftTabs.querySelectorAll(".craft-tab").forEach(b => b.classList.toggle("active", b === tabBtn));
      rec.grid.forEach((src, i) => { if (slotImgs[i]) slotImgs[i].src = src; });
      if (craftOutImg) craftOutImg.src = rec.resultIcon;
      renderCraftCard(rec, false);
    }

    C.recipes.forEach((rec, idx) => {
      const tb = document.createElement("button");
      tb.type = "button";
      tb.className = "craft-tab" + (idx === 0 ? " active" : "");
      tb.innerHTML = `<img src="${rec.resultIcon}" alt=""><span>${rec.name.replace(/^Cupón:\s*|^Libro Encantado:\s*/i, "")}</span>`;
      tb.onclick = () => {
        playUiTone([523.25], 0.08, "triangle", 0.06);
        selectRecipe(rec, tb);
      };
      craftTabs.append(tb);
    });

    selectRecipe(C.recipes[0], craftTabs.firstElementChild);

    function triggerCraft(targetEl) {
      playUiTone([523.25, 659.25, 783.99, 1046.5], 0.15, "triangle", 0.09);
      const r = (targetEl || craftOut).getBoundingClientRect();
      spawnSpriteParticles(r, "mc/xp_orb.png", 7, 14, 8);
      spawnSpriteParticles(r, "mc/particle_heart.png", 6, 16, 8);
      renderCraftCard(curRecipe, true);
    }
    craftOut.onclick = () => triggerCraft(craftOut);
    if (craftIsoBtn) craftIsoBtn.onclick = () => triggerCraft(craftIsoBtn);

    if (craftIsoCv) {
      const cg = craftIsoCv.getContext("2d");
      cg.imageSmoothingEnabled = false;
      function animCraftIso(now) {
        const t = (now || 0) * 0.001;
        cg.clearRect(0, 0, 210, 176);
        drawIsoBlock(cg, 105, 160, 3.4, ISO_TEX.crafting_table_top, ISO_TEX.crafting_table_front, ISO_TEX.crafting_table_side);
        const bob = Math.sin(t * 2.6) * 4;
        const fy = 40 + bob;
        // Sombra sobre la mesa
        cg.fillStyle = "rgba(0,0,0,.32)";
        cg.beginPath(); cg.ellipse(105, 76, 14 - bob * 0.4, 7 - bob * 0.2, 0, 0, Math.PI * 2); cg.fill();
        // Objeto flotando sobre la mesa isométrica
        if (floatImg.complete && floatImg.naturalWidth > 0) {
          const sx = Math.cos(t * 1.8);
          cg.save();
          cg.translate(105, fy);
          cg.scale(Math.abs(sx) < 0.18 ? 0.18 : sx, 1);
          cg.drawImage(floatImg, -18, -18, 36, 36);
          cg.restore();
        }
        requestAnimationFrame(animCraftIso);
      }
      requestAnimationFrame(animCraftIso);
    }
  }

  /* 4. Tocadiscos (Jukebox en vista isométrica 3D) con Discos Oficiales de Minecraft */
  const jbDiscs = $("#jukebox-discs"), jbNow = $("#jb-now"), jbSub = $("#jb-sub");
  const jbIsoCv = $("#jukebox-iso-cv"), jbIsoBtn = $("#jukebox-iso-btn"), jbNotes = $("#jukebox-notes");
  let noteTimer = 0, curDiscIdx = 0;
  const discImg = new Image();
  if (C.discs && C.discs.length) discImg.src = C.discs[0].icon;

  function spawnJukeboxNote(col) {
    if (!jbNotes) return;
    const n = document.createElement("span");
    n.className = "jb-note";
    n.textContent = Math.random() < 0.5 ? "♪" : "♫";
    n.style.color = col || "#55ffff";
    n.style.setProperty("--nx", ((Math.random() - 0.5) * 60).toFixed(0) + "px");
    n.onanimationend = () => n.remove();
    jbNotes.append(n);
  }

  function playDisc(d, idx, btn) {
    curDiscIdx = idx;
    discImg.src = d.icon;
    if (jbDiscs) jbDiscs.querySelectorAll(".disc-btn").forEach(b => b.classList.toggle("active", b === btn));
    if (jbNow) jbNow.textContent = "Reproduciendo: " + d.title;
    if (jbSub) jbSub.textContent = d.subtitle;

    if (d.src) {
      if (bgSong) {
        bgSong.pause();
        bgSong.src = d.src;
      } else {
        bgSong = new Audio(d.src);
      }
      bgSong.loop = true;
      bgSong.volume = 0.45;
      bgSong.muted = false;
      bgSong.play().catch(() => {});
    }

    spawnJukeboxNote(d.color);
    if (noteTimer) clearInterval(noteTimer);
    noteTimer = setInterval(() => spawnJukeboxNote(d.color), 850);

    const mt = $("#mc-music-toast");
    if (mt) {
      const songEl = mt.querySelector(".toast-song");
      const discEl = mt.querySelector(".toast-disc");
      if (songEl) songEl.textContent = d.title;
      if (discEl) discEl.src = d.icon;
      mt.hidden = false;
      void mt.offsetWidth;
      mt.classList.add("show");
      setTimeout(() => mt.classList.remove("show"), 4200);
    }
  }

  if (jbDiscs && C.discs && C.discs.length) {
    C.discs.forEach((d, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "disc-btn" + (idx === 0 ? " active" : "");
      btn.innerHTML = `<img src="${d.icon}" alt=""><span>${d.title.replace(/^Lena Raine\s*-\s*|^Aaron Cherof\s*-\s*|^C418\s*-\s*/i, "")}</span>`;
      btn.onclick = () => playDisc(d, idx, btn);
      jbDiscs.append(btn);
    });
    if (jbIsoBtn) {
      jbIsoBtn.onclick = () => {
        const nextIdx = (curDiscIdx + 1) % C.discs.length;
        const nextBtn = jbDiscs.children[nextIdx];
        playDisc(C.discs[nextIdx], nextIdx, nextBtn);
      };
    }
  }

  if (jbIsoCv) {
    const jg = jbIsoCv.getContext("2d");
    jg.imageSmoothingEnabled = false;
    function animJukeboxIso(now) {
      const t = (now || 0) * 0.001;
      jg.clearRect(0, 0, 210, 176);
      drawIsoBlock(jg, 105, 160, 3.4, ISO_TEX.jukebox_top, ISO_TEX.jukebox_side, ISO_TEX.jukebox_side);
      // Disco girando en perspectiva isométrica sobre la ranura del tocadiscos
      if (discImg.complete && discImg.naturalWidth > 0) {
        const bob = Math.sin(t * 3) * 2.5;
        jg.save();
        jg.translate(105, 62 + bob);
        jg.scale(1, 0.55);
        jg.rotate(t * 2.2);
        jg.drawImage(discImg, -20, -20, 40, 40);
        jg.restore();
      }
      requestAnimationFrame(animJukeboxIso);
    }
    requestAnimationFrame(animJukeboxIso);
  }

  /* 7. Cohete de Fuegos Artificiales de Minecraft */
  const fwCv = $("#mc-fireworks"), fwBtn = $("#firework-btn");
  if (fwCv) {
    const fg = fwCv.getContext("2d");
    let rockets = [], sparks = [], fwRaf = 0;
    const resizeFw = () => {
      fwCv.width = window.innerWidth;
      fwCv.height = window.innerHeight;
    };
    resizeFw();
    addEventListener("resize", resizeFw);

    function explodeHeart(x, y, cols) {
      playUiTone([220, 440, 880, 1318.5], 0.18, "sawtooth", 0.06);
      for (let i = 0; i < 42; i++) {
        const t = (i / 42) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const spd = 2.1 + Math.random() * 0.45;
        sparks.push({
          x, y,
          vx: hx * spd * 0.15 + (Math.random() - 0.5) * 0.6,
          vy: hy * spd * 0.15 + (Math.random() - 0.5) * 0.6,
          life: 0, max: 52 + Math.random() * 22,
          c: cols[i % cols.length], sz: 4
        });
      }
    }

    function launchFireworkSalvo(count = 3) {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          playUiTone([330, 493.88, 659.25], 0.12, "triangle", 0.05);
          rockets.push({
            x: window.innerWidth * (0.2 + Math.random() * 0.6),
            y: window.innerHeight + 10,
            vy: -(9.5 + Math.random() * 3.5),
            targetY: window.innerHeight * (0.18 + Math.random() * 0.28),
            cols: i % 2 === 0
              ? ["#ff5577", "#ff99bb", "#ffff55", "#ffffff"]
              : ["#55ffff", "#ff77ff", "#f3bccb", "#80ff20"]
          });
          if (!fwRaf) fwRaf = requestAnimationFrame(stepFw);
        }, i * 320);
      }
    }

    function stepFw() {
      fg.clearRect(0, 0, fwCv.width, fwCv.height);
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        fg.fillStyle = "#ffff55";
        fg.fillRect(r.x - 2, r.y - 4, 4, 8);
        sparks.push({
          x: r.x + (Math.random() - 0.5) * 4, y: r.y + 6,
          vx: (Math.random() - 0.5) * 0.8, vy: 1.5,
          life: 0, max: 14, c: "#ffd25a", sz: 3
        });
        if (r.y <= r.targetY) {
          explodeHeart(r.x, r.y, r.cols);
          rockets.splice(i, 1);
        }
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.045;
        p.life++;
        fg.globalAlpha = Math.max(0, 1 - p.life / p.max);
        fg.fillStyle = p.c;
        fg.fillRect(Math.round(p.x), Math.round(p.y), p.sz, p.sz);
        if (p.life >= p.max) sparks.splice(i, 1);
      }
      fg.globalAlpha = 1;
      if (rockets.length || sparks.length) {
        fwRaf = requestAnimationFrame(stepFw);
      } else {
        fwRaf = 0;
        fg.clearRect(0, 0, fwCv.width, fwCv.height);
      }
    }

    if (fwBtn) fwBtn.onclick = () => launchFireworkSalvo(4);
    addEventListener("mc-fireworks-burst", () => launchFireworkSalvo(4));
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
