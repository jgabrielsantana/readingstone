/* Motores visuais da Tsuki: um único laço de animação, gatilhos de rolagem, pilha de seções,
   contornos, lua do hero, órbita com meia-tinta, emenda xadrez e linha do tempo.
   Tudo em canvas 2D e DOM, sem biblioteca além do Lenis (carregado em script.js). */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(hover: none) and (pointer: coarse)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const dprMax = () => Math.min(window.devicePixelRatio || 1, coarse ? 1 : 2);
  const html = document.documentElement;

  /* ---------- laço único ---------- */
  const subs = new Set();
  let raf = 0;
  function loop(t) {
    raf = requestAnimationFrame(loop);
    subs.forEach((s) => { if (t - s.last >= s.gap) { s.last = t; s.fn(t); } });
  }
  function tick(fn, gap) {
    const s = { fn, gap: gap || 0, last: 0 };
    subs.add(s);
    if (!raf) raf = requestAnimationFrame(loop);
    return () => {
      subs.delete(s);
      if (!subs.size && raf) { cancelAnimationFrame(raf); raf = 0; }
    };
  }

  /* ---------- limpeza por página ---------- */
  let cleanups = [];
  const reg = (fn) => { cleanups.push(fn); return fn; };
  function cleanup() { const c = cleanups; cleanups = []; c.forEach((fn) => { try { fn(); } catch (e) {} }); }

  /* ---------- barramento de rolagem ---------- */
  const scrollFns = new Set();
  let scrollQueued = false;
  function runScroll() { scrollQueued = false; scrollFns.forEach((fn) => fn()); }
  function queueScroll() { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(runScroll); } }
  addEventListener("scroll", queueScroll, { passive: true });
  addEventListener("resize", queueScroll);
  function onScroll(fn) { scrollFns.add(fn); queueScroll(); return () => scrollFns.delete(fn); }

  /* ---------- visibilidade ---------- */
  function watch(el, cb, margin) {
    const io = new IntersectionObserver((es) => es.forEach((e) => cb(e.isIntersecting)), { rootMargin: margin || "80px" });
    io.observe(el);
    return () => io.disconnect();
  }

  /* ---------- tema ---------- */
  const themeFns = new Set();
  new MutationObserver(() => themeFns.forEach((fn) => fn())).observe(html, { attributes: true, attributeFilter: ["data-theme"] });
  const onTheme = (fn) => { themeFns.add(fn); return () => themeFns.delete(fn); };

  /* ---------- lua de verdade ---------- */
  const SYN = 29.530588853;
  function moonPhase(d) {
    d = d || new Date();
    const jd = d.getTime() / 86400000 + 2440587.5;
    let age = (jd - 2451550.1) % SYN;
    if (age < 0) age += SYN;
    const p = age / SYN;
    const illum = (1 - Math.cos(2 * Math.PI * p)) / 2;
    const nomes = [[0.03, "Lua nova"], [0.22, "Crescente"], [0.28, "Quarto crescente"], [0.47, "Gibosa crescente"], [0.53, "Lua cheia"], [0.72, "Gibosa minguante"], [0.78, "Quarto minguante"], [0.97, "Minguante"], [1.01, "Lua nova"]];
    const nome = nomes.find((n) => p < n[0])[1];
    return { age, p, illum, nome };
  }
  // O lado iluminado segue o céu do hemisfério sul (Brasil): a lua crescente fica acesa à esquerda.
  function moonSvg(p, size, cls) {
    const r = 10, c = 12, k = Math.cos(2 * Math.PI * p), rx = Math.abs(k) * r;
    const waxing = p < 0.5;
    const mirror = waxing; // sul
    const lit = `M${c} ${c - r}A${r} ${r} 0 0 1 ${c} ${c + r}A${rx.toFixed(2)} ${r} 0 0 ${k > 0 ? 0 : 1} ${c} ${c - r}Z`;
    return `<svg class="moon-glyph ${cls || ""}" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><g${mirror ? ' transform="translate(24 0) scale(-1 1)"' : ""}><path d="${lit}" fill="currentColor"/></g></svg>`;
  }

  /* ---------- contornos (curvas de nível que rolam) ---------- */
  const LINE_SCALE = 3.8, LINE_COUNT = 2.5, WAVE_AMOUNT = 0.37, WAVE_SPEED = 1.66, LINE_OPACITY = 0.85, CELLS = 96;
  const field = (x, y, t) => {
    let f = Math.sin(x * 1.0 + t * 0.6) * 0.5;
    f += Math.sin(y * 0.85 - t * 0.45) * 0.45;
    f += Math.sin((x + y) * 0.65 + t * 0.35) * 0.35;
    f += Math.sin((x - y) * 0.95 - t * 0.55) * 0.25;
    return f * 0.5 + 0.5;
  };
  function contours(canvas) {
    const ctx = canvas.getContext("2d");
    let W = 1, H = 1, dpr = 1, vis = false, off = null, last = 0;
    const t0 = performance.now();
    const size = () => {
      dpr = dprMax();
      W = Math.max(1, canvas.clientWidth); H = Math.max(1, canvas.clientHeight);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      draw(performance.now());
    };
    function draw(now) {
      if (!W || !H) return;
      const t = ((reduce ? 0 : now - t0) / 1000) * WAVE_SPEED;
      const cols = W >= H ? CELLS : Math.max(8, Math.round((CELLS * W) / H));
      const rows = Math.max(8, Math.round((cols * H) / W));
      const sx = W / cols, sy = H / rows, aspect = W / H;
      const v = new Float32Array((cols + 1) * (rows + 1));
      for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) {
        const nx = ((i / cols) * 2 - 1) * aspect * LINE_SCALE, ny = ((j / rows) * 2 - 1) * LINE_SCALE;
        const qx = nx + Math.sin(ny * 0.8 + t * 0.7) * WAVE_AMOUNT, qy = ny + Math.cos(nx * 0.7 - t * 0.6) * WAVE_AMOUNT;
        v[j * (cols + 1) + i] = field(qx, qy, t) * LINE_COUNT;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = getComputedStyle(canvas).color;
      ctx.lineWidth = 1; ctx.globalAlpha = LINE_OPACITY; ctx.beginPath();
      const seg = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
      for (let level = 0.5; level < LINE_COUNT; level += 1)
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
          const a = v[j * (cols + 1) + i], b = v[j * (cols + 1) + i + 1], c = v[(j + 1) * (cols + 1) + i + 1], d = v[(j + 1) * (cols + 1) + i];
          const k = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
          if (k === 0 || k === 15) continue;
          const x0 = i * sx, y0 = j * sy;
          const top = [x0 + sx * ((level - a) / (b - a)), y0], right = [x0 + sx, y0 + sy * ((level - b) / (c - b))];
          const bottom = [x0 + sx * ((level - d) / (c - d)), y0 + sy], left = [x0, y0 + sy * ((level - a) / (d - a))];
          switch (k) {
            case 1: case 14: seg(left, bottom); break;
            case 2: case 13: seg(bottom, right); break;
            case 3: case 12: seg(left, right); break;
            case 4: case 11: seg(top, right); break;
            case 6: case 9: seg(top, bottom); break;
            case 7: case 8: seg(left, top); break;
            case 5: seg(left, top); seg(bottom, right); break;
            case 10: seg(left, bottom); seg(top, right); break;
          }
        }
      ctx.stroke(); ctx.globalAlpha = 1;
    }
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    size();
    const stopWatch = watch(canvas, (v) => { vis = v; });
    const stopTick = reduce ? () => {} : tick((now) => { if (vis) draw(now); }, 24);
    const stopTheme = onTheme(() => draw(performance.now()));
    return () => { ro.disconnect(); stopWatch(); stopTick(); stopTheme(); };
  }

  const SHADE = 0.4;
  /* ---------- pilha: cada camada fixa no topo e a próxima passa por cima ---------- */
  function stack(container) {
    const layers = [...container.querySelectorAll(":scope > .layer")];
    const pinned = layers.slice(0, -1).map((el, i) => ({ inner: el.querySelector(".layer-in"), shade: el.querySelector(".layer-shade"), next: layers[i + 1] }));
    const phone = matchMedia("(max-width: 639px)");
    const RECEDE_SCALE = 0.9, RECEDE_SHADE = SHADE;
    const apply = () => {
      const view = window.innerHeight || 1;
      const shrink = phone.matches ? 0 : 1 - RECEDE_SCALE;
      for (const { inner, shade, next } of pinned) {
        const p = Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / view));
        inner.style.transform = p > 0 && shrink > 0 ? `scale(${1 - shrink * p})` : "";
        inner.style.willChange = p > 0 && shrink > 0 ? "transform" : "";
        shade.style.opacity = `${RECEDE_SHADE * p}`;
        inner.style.visibility = p >= 1 ? "hidden" : "visible";
      }
    };
    const off = onScroll(apply);
    return () => { off(); pinned.forEach(({ inner, shade }) => { inner.style.transform = ""; inner.style.visibility = ""; shade.style.opacity = "0"; }); };
  }

  /* ---------- emenda xadrez (ichimatsu) que se desfaz ao rolar ---------- */
  function seam(canvas, section, carry) {
    const ctx = canvas.getContext("2d");
    let W = 1, H = 1, dpr = 1, prog = 0, cur = 0, shown = -1;
    const CELL_BASE = 24, SOLID_UNTIL = 0.16, LIFT = 2, ACCENT_SHARE = 0.06;
    const noise = (x, y) => { let h = Math.imul(x, 374761393) + Math.imul(y, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
    const draw = () => {
      const cell = W < 640 ? 16 : CELL_BASE;
      const cs = getComputedStyle(canvas);
      let surface = carry === "light" ? getComputedStyle(document.body).backgroundColor : cs.getPropertyValue("--panel-now").trim() || "#0b0b0d";
      if (carry === "light") { const m = surface.match(/d+(.d+)?/g) || [245, 245, 243], f = 1 - SHADE * cur; surface = `rgb(${Math.round(m[0] * f)} ${Math.round(m[1] * f)} ${Math.round(m[2] * f)})`; }
      const accent = cs.getPropertyValue("--accent-now").trim() || "#d7263d";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const columns = Math.ceil(W / cell), rows = Math.ceil(H / cell), lift = prog * LIFT;
      for (let y = 0; y < rows; y++) {
        const depth = y / Math.max(1, rows - 1) + lift;
        if (depth > 1) break;
        const solid = depth <= SOLID_UNTIL;
        const fade = clamp(1 - (depth - SOLID_UNTIL) / (1 - SOLID_UNTIL), 0, 1);
        if (!solid && fade <= 0) break;
        for (let x = 0; x < columns; x++) {
          if (!solid) { if ((x + y) % 2 !== 0) continue; if (noise(x, y) > fade) continue; }
          ctx.fillStyle = !solid && noise(x + 101, y + 57) < ACCENT_SHARE ? accent : surface;
          ctx.fillRect(x * cell, y * cell, cell, cell);
        }
      }
    };
    const size = () => {
      dpr = dprMax(); W = Math.max(1, canvas.clientWidth); H = Math.max(1, canvas.clientHeight);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      shown = -1;
    };
    const ro = new ResizeObserver(size); ro.observe(canvas); size();
    const read = () => { const top = section.getBoundingClientRect().top; prog = clamp(1 - top / (window.innerHeight || 1), 0, 1); if (reduce) cur = prog; };
    const off = onScroll(read);
    const stopTick = tick(() => { cur += (prog - cur) * 0.2; if (Math.abs(prog - cur) < 0.001) cur = prog; if (cur !== shown) { shown = cur; const p0 = prog; prog = cur; draw(); prog = p0; } });
    const stopTheme = onTheme(() => { shown = -1; });
    return () => { ro.disconnect(); off(); stopTick(); stopTheme(); };
  }

  /* ---------- lua do hero: preta no papel, vermelha onde o cursor passa ---------- */
  const pointer = { x: 0, y: 0, on: false };
  addEventListener("pointermove", (e) => { if (e.pointerType === "touch") return; pointer.x = (e.clientX / innerWidth) * 2 - 1; pointer.y = (e.clientY / innerHeight) * 2 - 1; pointer.on = true; }, { passive: true });

  const CRATERS = [[-0.34, -0.22, 0.2], [0.28, -0.4, 0.13], [0.12, 0.3, 0.24], [-0.4, 0.38, 0.11], [0.46, 0.08, 0.16], [-0.02, -0.08, 0.09], [0.02, -0.62, 0.08], [-0.62, 0.04, 0.09], [0.62, 0.42, 0.08]];
  function paintMoon(ctx, cx, cy, r, color, crater, craterAlpha, rim) {
    ctx.save();
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.clip();
    ctx.globalAlpha = craterAlpha; ctx.fillStyle = crater;
    for (const [dx, dy, dr] of CRATERS) { ctx.beginPath(); ctx.arc(cx + dx * r, cy + dy * r, dr * r, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    if (rim) { ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = rim; ctx.lineWidth = Math.max(1, r * 0.012); ctx.beginPath(); ctx.arc(cx, cy, r * 1.07, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
  }

  function moonHero(hero) {
    const base = hero.querySelector(".moon-base"), red = hero.querySelector(".moon-red"), lion = hero.querySelector(".hero-lion");
    const bctx = base.getContext("2d"), rctx = red.getContext("2d");
    const cover = document.createElement("canvas"), cctx = cover.getContext("2d");
    const brush = document.createElement("canvas"), bgctx = brush.getContext("2d");
    let W = 1, H = 1, dpr = 1, geom = { cx: 0, cy: 0, r: 1 }, points = [], last = null, idle = 999, vis = true, tx = 0, ty = 0, cx0 = 0;
    const FADE_FRAMES = 120, DECAY = 0.016;
    const geomFor = (w, h) => (window.innerWidth >= 1280 ? { cx: w * 0.615, cy: h * 0.5, r: Math.min(h * 0.34, w * 0.185) } : window.innerWidth >= 1024 ? { cx: w * 0.68, cy: h * 0.5, r: Math.min(h * 0.34, w * 0.22) } : { cx: w * 0.5, cy: h * 0.69, r: Math.min(w * 0.34, h * 0.21) });
    function paint() {
      const fg = getComputedStyle(base).color, bg = getComputedStyle(document.body).backgroundColor, ac = getComputedStyle(red).color;
      const { cx, cy, r } = geom;
      bctx.setTransform(1, 0, 0, 1, 0, 0); bctx.clearRect(0, 0, base.width, base.height);
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintMoon(bctx, cx, cy, r, fg, bg, 0.1, fg);
      cctx.setTransform(1, 0, 0, 1, 0, 0); cctx.clearRect(0, 0, cover.width, cover.height);
      cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintMoon(cctx, cx, cy, r, ac, "#000", 0.16, ac);
    }
    function size() {
      dpr = dprMax(); W = hero.clientWidth; H = hero.clientHeight;
      for (const c of [base, red, cover]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
      geom = geomFor(W, H);
      if (window.innerWidth >= 1024) {
        // a lua fica centrada no vão entre o título e os painéis da direita
        const hr = hero.getBoundingClientRect(), k = hr.width / Math.max(1, hero.clientWidth);
        const nome = hero.querySelector(".h1 [aria-hidden]") || hero.querySelector(".h1");
        const hp = hero.querySelector(".hpanels");
        const esq = (nome.getBoundingClientRect().right - hr.left) / k + 32;
        const dir = (hp && hp.offsetParent ? (hp.getBoundingClientRect().left - hr.left) / k : W - 32) - 32;
        if (dir - esq > 160) geom = { cx: (esq + dir) / 2, cy: geom.cy, r: Math.min(geom.r, (dir - esq) / 2 - 8) };
      }
      const rad = geom.r * dpr * 0.62;
      brush.width = brush.height = Math.ceil(rad * 2);
      hero.style.setProperty("--mx", geom.cx + "px"); hero.style.setProperty("--my", geom.cy + "px"); hero.style.setProperty("--mr", geom.r + "px");
      cx0 = geom.cx;
      paint();
    }
    const stamp = (x, y) => {
      const c = brush.width / 2;
      bgctx.globalCompositeOperation = "source-over"; bgctx.clearRect(0, 0, brush.width, brush.height);
      const g = bgctx.createRadialGradient(c, c, 0, c, c, c);
      g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.55, "rgba(255,255,255,0.85)"); g.addColorStop(1, "rgba(255,255,255,0)");
      bgctx.fillStyle = g; bgctx.fillRect(0, 0, brush.width, brush.height);
      bgctx.globalCompositeOperation = "source-in";
      bgctx.drawImage(cover, x - c, y - c, brush.width, brush.height, 0, 0, brush.width, brush.height);
      rctx.globalCompositeOperation = "source-over"; rctx.drawImage(brush, x - c, y - c);
    };
    const move = (e) => {
      if (e.pointerType === "touch") return;
      const rc = hero.getBoundingClientRect();
      const x = (e.clientX - rc.left) * dpr, y = (e.clientY - rc.top) * dpr, rad = brush.width / 2;
      if (x < -rad || y < -rad || x > red.width + rad || y > red.height + rad) { last = null; return; }
      if (last) {
        const dx = x - last.x, dy = y - last.y, dist = Math.hypot(dx, dy), step = Math.max(rad * 0.3, 1), n = Math.min(Math.ceil(dist / step), 60);
        for (let i = 1; i <= n; i++) points.push({ x: last.x + (dx * i) / n, y: last.y + (dy * i) / n });
      } else points.push({ x, y });
      last = { x, y }; idle = 0;
    };
    const ro = new ResizeObserver(size); ro.observe(hero); size();
    addEventListener("resize", size);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(size);
    const stopWatch = watch(hero, (v) => { vis = v; }, "0px");
    const stopTheme = onTheme(paint);
    if (!reduce && finePointer) addEventListener("pointermove", move, { passive: true });
    const stopTick = reduce ? () => {} : tick(() => {
      if (!vis) return;
      // o leão acompanha o cursor com um atraso, só um pouco
      if (lion && pointer.on) { tx = lerp(tx, pointer.x, 0.06); ty = lerp(ty, pointer.y, 0.06); lion.style.transform = `translate(${(tx * 7).toFixed(2)}px, ${(ty * 5).toFixed(2)}px) rotate(${(tx * 2.2).toFixed(2)}deg)`; }
      const drawing = points.length > 0;
      if (drawing) idle = 0; else idle++;
      if (idle > FADE_FRAMES) { if (idle === FADE_FRAMES + 1) rctx.clearRect(0, 0, red.width, red.height); return; }
      const fade = drawing ? DECAY : Math.min(DECAY + idle * 0.004, 0.5);
      rctx.globalCompositeOperation = "destination-out"; rctx.fillStyle = "rgba(0,0,0," + fade + ")"; rctx.fillRect(0, 0, red.width, red.height);
      if (drawing) { points.forEach((p) => stamp(p.x, p.y)); points = []; }
    });
    return () => { ro.disconnect(); removeEventListener("resize", size); stopWatch(); stopTheme(); stopTick(); removeEventListener("pointermove", move); };
  }

  /* ---------- as fases da leitura: meia-tinta, órbita e retículo ---------- */
  const AW = 1440, AH = 800, HUB = { x: 720, y: 400 }, MOON_R = 300, PITCH = 8;
  const hash2 = (x, y) => { let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
  const smooth = (t) => t * t * (3 - 2 * t);
  function vnoise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = smooth(x - xi), yf = smooth(y - yi);
    const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
    return lerp(lerp(a, b, xf), lerp(c, d, xf), yf);
  }
  function buildDots() {
    const cols = Math.floor(AW / PITCH), rows = Math.floor(AH / PITCH);
    const xs = [], ys = [], ci = [], cj = [];
    const cell = new Int32Array(cols * rows).fill(-1);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = 4 + i * PITCH, y = 4 + j * PITCH, d = Math.hypot(x - HUB.x, y - HUB.y);
      if (d > MOON_R) continue;
      const n = vnoise(x / 70, y / 70) * 0.6 + vnoise(x / 24, y / 24) * 0.4;
      if (n < 0.4 && d < MOON_R - 14) continue; // os mares da lua ficam vazios
      cell[j * cols + i] = xs.length;
      xs.push(x); ys.push(y); ci.push(i); cj.push(j);
    }
    return { xs: Float32Array.from(xs), ys: Float32Array.from(ys), ci: Int16Array.from(ci), cj: Int16Array.from(cj), n: xs.length, cell, cols, rows };
  }
  function buildOrbit() {
    const rx = 560, ry = 330, rot = (-14 * Math.PI) / 180, N = 900, t0 = (100 * Math.PI) / 180;
    const pts = [];
    for (let k = 0; k <= N; k++) {
      const t = t0 + (k / N) * Math.PI * 2;
      const ex = Math.cos(t) * rx, ey = Math.sin(t) * ry;
      pts.push([HUB.x + ex * Math.cos(rot) - ey * Math.sin(rot), HUB.y + ex * Math.sin(rot) + ey * Math.cos(rot)]);
    }
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const total = cum[cum.length - 1];
    // o ritmo mora na curvatura: a volta freia nas pontas da elipse e corre nas laterais
    const turn = new Array(pts.length).fill(0);
    for (let i = 1; i < pts.length - 1; i++) {
      const ux = pts[i][0] - pts[i - 1][0], uy = pts[i][1] - pts[i - 1][1], vx = pts[i + 1][0] - pts[i][0], vy = pts[i + 1][1] - pts[i][1];
      turn[i] = Math.acos(clamp((ux * vx + uy * vy) / ((Math.hypot(ux, uy) || 1) * (Math.hypot(vx, vy) || 1)), -1, 1));
    }
    const win = 6, acc = [0];
    for (let i = 1; i < pts.length; i++) {
      let s = 0, n = 0;
      for (let j = Math.max(0, i - win); j <= Math.min(pts.length - 1, i + win); j++) { s += turn[j]; n++; }
      acc.push(acc[i - 1] + (cum[i] - cum[i - 1]) * (1 + 9 * (s / n)));
    }
    const timeAt = acc.map((v) => v / acc[acc.length - 1]);
    const distAt = (time) => {
      if (time <= 0) return 0; if (time >= 1) return total;
      let lo = 0, hi = timeAt.length - 1;
      while (lo < hi - 1) { const mid = (lo + hi) >> 1; if (timeAt[mid] <= time) lo = mid; else hi = mid; }
      return cum[lo] + (cum[hi] - cum[lo]) * ((time - timeAt[lo]) / (timeAt[hi] - timeAt[lo] || 1));
    };
    const trailUpTo = (dist) => {
      const out = [];
      for (let i = 0; i < pts.length; i++) {
        if (cum[i] <= dist) { out.push(pts[i]); continue; }
        const a = pts[i - 1], b = pts[i], r = (dist - cum[i - 1]) / (cum[i] - cum[i - 1]);
        out.push([a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r]); break;
      }
      return out;
    };
    const at = (frac) => { const d = total * frac; let i = 1; while (i < pts.length - 1 && cum[i] < d) i++; return { x: pts[i][0], y: pts[i][1], d: cum[i], i }; };
    return { pts, cum, total, distAt, trailUpTo, at };
  }
  const rgb = (css) => {
    css = String(css).trim();
    const h = css.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (h) { let x = h[1]; if (x.length === 3) x = [...x].map((c) => c + c).join(""); return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)]; }
    const m = css.match(/\d+(\.\d+)?/g);
    return m && m.length >= 3 ? [Number(m[0]), Number(m[1]), Number(m[2])] : [215, 38, 61];
  };
  const mixc = (a, b, t) => [Math.round(lerp(a[0], b[0], t)), Math.round(lerp(a[1], b[1], t)), Math.round(lerp(a[2], b[2], t))];
  const rgba = (c, a) => `rgb(${c[0]} ${c[1]} ${c[2]} / ${a})`;

  function season(sec, marks) {
    const frame = sec.querySelector(".orbit-frame"), stage = frame.querySelector(".stage");
    const dotsC = stage.querySelector(".s-dots"), traceC = stage.querySelector(".s-trace");
    const labels = [...frame.querySelectorAll(".orbit-label")];
    const dctx = dotsC.getContext("2d"), tctx = traceC.getContext("2d");
    const D = buildDots(), O = buildOrbit();
    const markers = marks.map((f) => ({ ...O.at(f), frac: f }));
    let s = 1, tx = 0, ty = 0, k = 1, vis = false, started = false, lap = 0, heat = 1, rested = false, stopped = false;
    let palette = { accent: [215, 38, 61], white: [246, 243, 236], bright: [250, 170, 178], dot: "#7a7a7a" };
    const baked = document.createElement("canvas");
    const level = new Float32Array(D.n), inList = new Uint8Array(D.n), active = new Int32Array(D.n);
    let activeCount = 0, spread = 0, dirty = true;
    const target = { x: 0, y: 0, on: false }, ret = { x: 0, y: 0, heat: 0 };

    function readPalette() {
      const cs = getComputedStyle(sec);
      const accent = rgb(cs.getPropertyValue("--accent-now"));
      palette = { accent, white: [246, 243, 236], bright: mixc(accent, [255, 255, 255], 0.55), dot: cs.getPropertyValue("--map-dot").trim() || "#7a7a7a" };
    }
    function fit() {
      const w = frame.clientWidth, h = frame.clientHeight;
      if (w >= 1024) { s = Math.max(w / AW, h / AH); tx = (w - AW * s) / 2; ty = (h - AH * s) / 2; }
      else { const box = 1290; s = w / box; tx = w / 2 - HUB.x * s; ty = h * 0.7 - HUB.y * s; }
      stage.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
      k = Math.min(2.5, dprMax() * Math.max(1, s));
      for (const c of [dotsC, traceC, baked]) { c.width = Math.round(AW * k); c.height = Math.round(AH * k); }
      // rótulos em pixels da tela, para o texto manter o tamanho de leitura
      labels.forEach((el, i) => {
        const m = markers[i], x = tx + m.x * s, y = ty + m.y * s;
        el.style.left = x + "px"; el.style.top = y + "px";
        // os rótulos ficam dentro da elipse: em cima vai abaixo da linha, embaixo vai acima
        const pos = Math.abs(m.x - HUB.x) > 360 ? "side" : m.y < HUB.y ? "top" : "bot";
        el.dataset.pos = pos;
        el.classList.toggle("flip", pos === "side" && x > w * 0.62);
      });
      bake(); renderTrace(); dirty = true; drawDots();
    }
    function bake() {
      const c = baked.getContext("2d");
      c.setTransform(k, 0, 0, k, 0, 0); c.clearRect(0, 0, AW, AH);
      c.fillStyle = palette.dot; c.beginPath();
      for (let i = 0; i < D.n; i++) { c.moveTo(D.xs[i] + 1.6, D.ys[i]); c.arc(D.xs[i], D.ys[i], 1.6, 0, Math.PI * 2); }
      c.fill();
    }
    function drawDots() {
      dctx.setTransform(1, 0, 0, 1, 0, 0); dctx.clearRect(0, 0, dotsC.width, dotsC.height);
      dctx.drawImage(baked, 0, 0);
      if (!activeCount) return;
      dctx.setTransform(k, 0, 0, k, 0, 0);
      const THR = 0.34, span = 1 - THR, { accent, bright, white } = palette;
      for (let n = 0; n < activeCount; n++) { const i = active[n]; if (level[i] < THR) continue; dctx.clearRect(D.xs[i] - 2.8, D.ys[i] - 2.8, 5.6, 5.6); }
      for (let n = 0; n < activeCount; n++) {
        const i = active[n], v = level[i];
        if (v < THR || ((D.ci[i] + D.cj[i]) & 1)) continue;
        const t = clamp((v - THR) / span, 0, 1), side = PITCH * (0.7 + 0.3 * t);
        dctx.fillStyle = `rgb(${(v > 0.8 ? white : v > 0.5 ? bright : mixc(accent, bright, v)).join(" ")})`;
        dctx.fillRect(D.xs[i] - side / 2, D.ys[i] - side / 2, side, side);
      }
    }
    function addLevel(i, v) {
      if (v <= 0.02) return;
      if (v > level[i]) level[i] = v;
      if (!inList[i]) { inList[i] = 1; active[activeCount++] = i; }
    }
    function lightPoint(px, py, reach, heatv) {
      const i0 = Math.floor((px - reach - 4) / PITCH), i1 = Math.ceil((px + reach - 4) / PITCH), j0 = Math.floor((py - reach - 4) / PITCH), j1 = Math.ceil((py + reach - 4) / PITCH);
      for (let j = Math.max(0, j0); j <= Math.min(D.rows - 1, j1); j++) for (let i = Math.max(0, i0); i <= Math.min(D.cols - 1, i1); i++) {
        const idx = D.cell[j * D.cols + i]; if (idx < 0) continue;
        const d = Math.hypot(D.xs[idx] - px, D.ys[idx] - py);
        if (d < reach) { const u = 1 - d / reach; addLevel(idx, u * u * heatv); }
      }
    }
    function lightReticle(px, py, heatv) {
      const ci = Math.round((px - 4) / PITCH), cj = Math.round((py - 4) / PITCH), arm = 0.82 * heatv, reach = 420 * spread;
      if (reach > 1) {
        const span = Math.ceil(reach / PITCH);
        if (cj >= 0 && cj < D.rows) for (let i = Math.max(0, ci - span); i <= Math.min(D.cols - 1, ci + span); i++) { const idx = D.cell[cj * D.cols + i]; if (idx >= 0) addLevel(idx, (1 - Math.abs(D.xs[idx] - px) / reach) * arm); }
        if (ci >= 0 && ci < D.cols) for (let j = Math.max(0, cj - span); j <= Math.min(D.rows - 1, cj + span); j++) { const idx = D.cell[j * D.cols + ci]; if (idx >= 0) addLevel(idx, (1 - Math.abs(D.ys[idx] - py) / reach) * arm); }
      }
      lightPoint(px, py, 54, heatv);
    }
    const approach = (from, to, dt, tau) => from + (to - from) * (1 - Math.exp(-dt / tau));
    let lastT = 0;
    function lightFrame(now) {
      const dt = lastT ? Math.min(0.1, (now - lastT) / 1000) : 0; lastT = now;
      const wanted = target.on ? 0.95 : 0;
      if (ret.heat <= 0.001 && wanted > 0) { ret.x = target.x; ret.y = target.y; }
      else if (dt > 0) {
        const px = ret.x, py = ret.y;
        ret.x = approach(px, target.x, dt, 0.07); ret.y = approach(py, target.y, dt, 0.07);
        const speed = Math.hypot(ret.x - px, ret.y - py) / dt, ws = Math.max(0, 1 - speed / 900);
        spread = approach(spread, ws, dt, ws > spread ? 0.38 : 0.09);
      }
      ret.heat = approach(ret.heat, wanted, dt, wanted > ret.heat ? 0.14 : 0.3);
      if (ret.heat < 0.005) { ret.heat = 0; spread = 0; }
      const decay = Math.exp(-dt / 0.3);
      let w = 0;
      for (let n = 0; n < activeCount; n++) { const i = active[n], v = level[i] * decay; if (v > 0.02) { level[i] = v; active[w++] = i; } else { level[i] = 0; inList[i] = 0; } }
      const before = activeCount; activeCount = w;
      if (ret.heat > 0.01) lightReticle(ret.x, ret.y, ret.heat);
      if (activeCount === 0 && before === 0 && !dirty) return;
      dirty = false; drawDots();
    }
    function toArt(e) { const rc = frame.getBoundingClientRect(); return { x: (e.clientX - rc.left - tx) / s, y: (e.clientY - rc.top - ty) / s }; }
    const onMove = (e) => { if (!rested || e.pointerType === "touch") return; const p = toArt(e); target.x = p.x; target.y = p.y; const rc = sec.getBoundingClientRect(); target.on = e.clientY >= rc.top && e.clientY <= rc.bottom && e.clientX >= rc.left && e.clientX <= rc.right; };
    const onLeave = () => { target.on = false; };

    function drawTrail(points, minW, glow) {
      if (points.length < 2) return;
      const { accent, bright, white } = palette, c = tctx;
      const stroke = (from) => { c.beginPath(); c.moveTo(points[from][0], points[from][1]); for (let i = from + 1; i < points.length; i++) c.lineTo(points[i][0], points[i][1]); c.stroke(); };
      c.lineCap = "round"; c.lineJoin = "round";
      if (glow) {
        c.save(); c.globalCompositeOperation = "lighter";
        c.strokeStyle = rgba(accent, 0.05); c.lineWidth = 15; stroke(0);
        c.strokeStyle = rgba(accent, 0.1); c.lineWidth = 6.75; stroke(0);
        c.restore();
      }
      c.strokeStyle = rgba(accent, 1); c.lineWidth = Math.max(minW, 5.9); stroke(0);
      const head = Math.max(2, Math.round(210 / (O.total / O.pts.length))), from = Math.max(0, points.length - head), tip = points[points.length - 1];
      const hot = c.createLinearGradient(points[from][0], points[from][1], tip[0], tip[1]);
      hot.addColorStop(0, rgba(accent, 0)); hot.addColorStop(0.45, rgba(accent, 0.9)); hot.addColorStop(1, rgba(mixc(accent, bright, heat), 1));
      c.strokeStyle = hot; c.lineWidth = Math.max(minW, 5.9); stroke(from);
      const coreFrom = Math.max(0, points.length - Math.round(head * 0.42));
      if (points.length - coreFrom > 1) {
        const core = c.createLinearGradient(points[coreFrom][0], points[coreFrom][1], tip[0], tip[1]);
        core.addColorStop(0, rgba(bright, 0)); core.addColorStop(1, rgba(white, 0.95 * heat));
        c.strokeStyle = core; c.lineWidth = Math.max(minW * 0.6, 5.9 * 0.38); stroke(coreFrom);
      }
    }
    function renderTrace() {
      const dist = O.distAt(lap), points = O.trailUpTo(dist), c = tctx, { accent, bright, white } = palette;
      c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, traceC.width, traceC.height);
      c.setTransform(k, 0, 0, k, 0, 0);
      // a trilha em si fica sempre desenhada fraca; a volta acende sobre ela
      c.save(); c.strokeStyle = "rgba(255,255,255,0.1)"; c.lineWidth = 1.5; c.setLineDash([6, 7]); c.beginPath(); c.moveTo(O.pts[0][0], O.pts[0][1]); for (const p of O.pts) c.lineTo(p[0], p[1]); c.stroke(); c.restore();
      if (points.length > 1) {
        drawTrail(points, 0.6, true);
        const [x, y] = points[points.length - 1];
        c.save(); c.globalCompositeOperation = "lighter";
        const sp = c.createRadialGradient(x, y, 0, x, y, 15.4);
        sp.addColorStop(0, rgba(white, 0.85 * heat)); sp.addColorStop(0.35, rgba(bright, 0.4 * heat)); sp.addColorStop(1, rgba(accent, 0));
        c.fillStyle = sp; c.beginPath(); c.arc(x, y, 15.4, 0, Math.PI * 2); c.fill(); c.restore();
      }
      markers.forEach((m, n) => {
        if (dist < m.d) return;
        const age = Math.min(1, (dist - m.d) / 90), r = 12 + (1 - age) * 14;
        const g = c.createRadialGradient(m.x, m.y, 0, m.x, m.y, r);
        g.addColorStop(0, rgba(bright, 0.5 + 0.45 * (1 - age))); g.addColorStop(0.45, rgba(accent, 0.32)); g.addColorStop(1, rgba(accent, 0));
        c.save(); c.globalCompositeOperation = "lighter"; c.fillStyle = g; c.beginPath(); c.arc(m.x, m.y, r, 0, Math.PI * 2); c.fill(); c.restore();
        c.fillStyle = rgba(white, 1); c.beginPath(); c.arc(m.x, m.y, 4.5, 0, Math.PI * 2); c.fill();
        if (age < 1) { c.strokeStyle = rgba(bright, (1 - age) * 0.6); c.lineWidth = 1; c.beginPath(); c.arc(m.x, m.y, 9 + age * 20, 0, Math.PI * 2); c.stroke(); }
        if (labels[n]) labels[n].classList.add("lit");
      });
      // largada: um xadrez pequeno na primeira posição da trilha
      const [fx, fy] = O.pts[0];
      c.save(); c.translate(fx, fy);
      for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) { c.fillStyle = (a + b) % 2 ? "rgba(246,243,236,0.9)" : "rgba(246,243,236,0.25)"; c.fillRect(-12 + a * 8, -12 + b * 8, 8, 8); }
      c.restore();
    }
    function runLap() {
      if (started) return; started = true;
      if (reduce) { lap = 1; heat = 0; rested = false; renderTrace(); labels.forEach((l) => l.classList.add("lit")); return; }
      const t0 = performance.now(), LAP_MS = 6000;
      const ease = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
      const stepLap = (now) => {
        if (stopped) return;
        const t = clamp((now - t0) / LAP_MS, 0, 1);
        lap = ease(t); renderTrace();
        if (t < 1) { requestAnimationFrame(stepLap); return; }
        const c0 = performance.now();
        const cool = (n2) => {
          if (stopped) return;
          const u = clamp((n2 - c0) / 800, 0, 1);
          heat = 1 - (1 - Math.pow(1 - u, 3)); renderTrace();
          if (u < 1) requestAnimationFrame(cool); else { heat = 0; renderTrace(); rested = finePointer; }
        };
        requestAnimationFrame(cool);
      };
      requestAnimationFrame(stepLap);
    }
    readPalette(); fit();
    const ro = new ResizeObserver(fit); ro.observe(frame);
    const stopWatch = watch(sec, (v) => { vis = v; sec.classList.toggle("paused", !v); }, "0px");
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) runLap(); }), { threshold: 0.35 });
    io.observe(frame);
    const stopTick = (reduce || !finePointer) ? () => {} : tick((now) => { if (vis && rested) lightFrame(now); });
    const stopTheme = onTheme(() => { readPalette(); bake(); renderTrace(); dirty = true; drawDots(); });
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    addEventListener("blur", onLeave);
    return () => { stopped = true; ro.disconnect(); io.disconnect(); stopWatch(); stopTick(); stopTheme(); removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave); removeEventListener("blur", onLeave); };
  }

  /* ---------- linha do tempo: trilho, parallax e dim ao passar o mouse ---------- */
  function timeline(sec) {
    const rows = [...sec.querySelectorAll(".tl-row")];
    const rail = sec.querySelector(".tl-rail"), prog = rail && rail.querySelector(".tl-prog"), mark = rail && rail.querySelector(".tl-mark");
    const layers = [...sec.querySelectorAll("[data-par]")];
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const row = e.target; row.classList.add("in"); io.unobserve(row);
      if (row.classList.contains("centre")) setTimeout(() => row.classList.add("settle"), 2200);
    }), { rootMargin: "0% 0% -25% 0%" });
    rows.forEach((r) => io.observe(r));
    if (reduce) { rows.forEach((r) => r.classList.add("in", "settle")); }
    const apply = () => {
      const vh = window.innerHeight || 1, secRect = sec.getBoundingClientRect(), unit = secRect.width / 1440;
      if (!reduce) layers.forEach((el) => {
        const row = el.closest(".tl-row"), r = row.getBoundingClientRect();
        const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
        const travel = Number(el.dataset.par) * unit;
        el.style.translate = `0 ${lerp(travel, -travel, p).toFixed(1)}px`;
      });
      if (rail && rows.length && getComputedStyle(rail).display !== "none") {
        const wrapRect = rail.parentElement.getBoundingClientRect();
        const topAbs = rows[0].offsetTop, restAbs = rows[rows.length - 1].offsetTop + rows[rows.length - 1].offsetHeight / 2 - 50 * unit;
        const start = window.innerWidth < 1024 ? topAbs : 0, rest = restAbs - start;
        rail.style.top = start + "px"; rail.style.height = rest + "px";
        // a linha avança quando o centro da janela passa pelo trilho
        const y = vh / 2 - (wrapRect.top + start);
        const run = clamp(y, 0, rest), share = rest ? run / rest : 0;
        prog.style.transform = `scaleY(${share})`;
        mark.style.transform = `translate(-50%, ${run}px) rotate(${(share * 1800).toFixed(1)}deg)`;
      }
    };
    const off = onScroll(apply);
    return () => { io.disconnect(); off(); };
  }

  /* ---------- rodapé, que vive fora da página ---------- */
  function footer() {
    const foot = document.getElementById("rodape");
    if (!foot) return;
    contours(foot.querySelector(".foot-contours"));
    const lion = foot.querySelector(".foot-lion-in"), words = foot.querySelectorAll(".fw");
    // o leão volta ao lugar quando a página chega ao fim
    onScroll(() => {
      if (reduce || !lion) return;
      const r = foot.getBoundingClientRect(), vh = window.innerHeight;
      const p = clamp((vh - r.top) / Math.max(1, r.height), 0, 1);
      lion.style.transform = `translateY(${((1 - p) * 60).toFixed(1)}px)`;
    });
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { foot.classList.add("in"); io.disconnect(); } }), { threshold: 0.25 });
    io.observe(foot);
    foot.querySelectorAll(".foot-nav a").forEach((a, n) => {
      const txt = a.textContent; a.setAttribute("aria-label", txt);
      a.innerHTML = [...txt].map((ch, i) => `<span class="fl" aria-hidden="true" style="--i:${i};--n:${n}">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
    });
    if (reduce) foot.classList.add("in");
  }

  window.FX = { reduce, coarse, finePointer, clamp, lerp, tick, reg, cleanup, onScroll, watch, onTheme, moonPhase, moonSvg, contours, stack, seam, moonHero, season, timeline, footer, dprMax };
})();
