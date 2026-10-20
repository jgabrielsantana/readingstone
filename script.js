(function () {
  const html = document.documentElement;
  const app = document.getElementById("app");
  document.getElementById("ano").textContent = new Date().getFullYear();

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const fmtData = (iso) => {
    const [y, m, d] = iso.split("-");
    return Number(d) + " " + MESES[Number(m) - 1] + " " + y;
  };
  const sorted = () => [...POSTS].sort((a, b) => b.data.localeCompare(a.data));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- ícones ---------- */
  const I = {
    lens: '<svg class="ico" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="18.5" cy="18.5" r="3.4" fill="currentColor"/></svg>',
    up: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    right: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    down: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    dot: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/></svg>'
  };

  // Cianótipos de Anna Atkins (domínio público). Créditos no rodapé.
  const PLATES = [
    { src: "assets/ferns-specimen-of-cyanotype.jpg", nome: "Ferns", alt: "Cianótipo de samambaias em branco sobre fundo azul, por Anna Atkins" },
    { src: "assets/carex-america.jpg", nome: "Carex (America)", alt: "Cianótipo de uma planta com folhas em leque, por Anna Atkins" },
    { src: "assets/anna-atkins-cystoseira-granulata.jpg", nome: "Cystoseira granulata", alt: "Cianótipo de uma alga ramificada, por Anna Atkins" },
    { src: "assets/new-zealand.jpg", nome: "New Zealand", alt: "Cianótipo de uma folha de samambaia da Nova Zelândia, por Anna Atkins" }
  ];
  const plateFor = (slug) => {
    let h = 0;
    for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return PLATES[h % PLATES.length];
  };

  let filtro = "Todas";

  /* ---------- grade adaptativa acima de 1920px ---------- */
  function applyAdaptiveGrid() {
    const FONT_BASE = 16, baseWidth = 1920, coef = 0.6666;
    const w = window.innerWidth;
    const reduction = ((baseWidth - w) / baseWidth) * 100;
    const size = FONT_BASE - (FONT_BASE * (reduction * coef)) / 100;
    if (size > FONT_BASE) html.style.fontSize = size + "px";
    else html.style.removeProperty("font-size");
  }
  applyAdaptiveGrid();
  addEventListener("resize", applyAdaptiveGrid);

  /* ---------- rolagem: Lenis + trava ---------- */
  let lenis = null;
  let lenisBusy = false;
  let locked = false;
  async function initLenis() {
    if (reduce || lenis || lenisBusy) return;
    lenisBusy = true;
    try {
      const m = await import("lenis");
      if (!lenisBusy) return;
      lenis = new m.default({ smoothWheel: true });
      lenis.on("scroll", updateStats);
      const raf = (t) => {
        if (!lenis) return;
        lenis.raf(t);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
      if (locked) lenis.stop();
    } catch (e) {
      /* sem a biblioteca, a rolagem nativa continua funcionando */
    }
  }
  function destroyLenis() {
    lenisBusy = false;
    if (lenis) { lenis.destroy(); lenis = null; }
  }
  function stopScroll() {
    locked = true;
    if (lenis) lenis.stop();
    html.style.position = "relative";
    html.style.overflow = "hidden";
    html.style.height = "100%";
  }
  function startScroll() {
    locked = false;
    if (lenis) lenis.start();
    html.style.removeProperty("position");
    html.style.removeProperty("overflow");
    html.style.removeProperty("height");
  }
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -8 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 8, behavior: reduce ? "auto" : "smooth" });
  }

  /* ---------- abertura ---------- */
  function setReady() { html.classList.add("ready"); }
  function runLoader() {
    const loader = document.getElementById("loader");
    if (!html.classList.contains("intro") || !loader) { setReady(); return; }
    stopScroll();
    const fill = document.getElementById("loader-fill");
    const num = document.getElementById("loader-num");
    const FILL_MS = 1300;
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const t0 = performance.now();
    const tick = (now) => {
      const t = clamp((now - t0) / FILL_MS, 0, 1);
      const p = Math.round(ease(t) * 100);
      fill.style.width = p + "%";
      num.textContent = String(p).padStart(3, "0");
      if (t < 1) { requestAnimationFrame(tick); return; }
      loader.classList.add("out");
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        html.classList.remove("intro");
        try { sessionStorage.setItem("rs-intro", "1"); } catch (e) {}
        setReady();
        startScroll();
      };
      loader.addEventListener("transitionend", (e) => { if (e.target === loader) finish(); });
      setTimeout(finish, 1100);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- relógio ---------- */
  function tickClock() {
    const d = new Date();
    const t = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    const data = d.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
    const a = document.getElementById("clock-t");
    const b = document.getElementById("clock-d");
    const c = document.getElementById("menu-clock");
    if (a) a.textContent = t;
    if (b) b.textContent = data;
    if (c) c.textContent = t + ", " + data;
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* ---------- peças ---------- */
  const L = (...linhas) => linhas.map((l) => '<span class="ln"><span>' + esc(l) + "</span></span>").join("");
  let wi = 0;
  const palavras = (txt, soft) =>
    txt.split(" ").map((w) => '<span class="w' + (soft ? " soft" : "") + '" style="--i:' + wi++ + '">' + esc(w) + "</span>").join(" ");

  function pill(label, o) {
    const { variant = "dark", arrow = "up", attrs = "", tag = "button", href = "" } = o || {};
    const badge = arrow ? '<span class="pill-badge">' + (arrow === "right" ? I.right : I.up) + "</span>" : "";
    const cls = "pill pill-" + variant + (arrow ? " pill-arrow" : "");
    const inner = '<span class="pill-in">' + esc(label) + badge + "</span>";
    return tag === "a"
      ? '<a class="' + cls + '" href="' + esc(href) + '" ' + attrs + ">" + inner + "</a>"
      : '<button class="' + cls + '" type="button" ' + attrs + ">" + inner + "</button>";
  }

  function card(p, i) {
    return `
      <a class="card rv" href="#/post/${esc(p.slug)}" style="--d:${i * 90}ms">
        <div class="card-meta"><span>${fmtData(p.data)}</span></div>
        <div class="card-plate"><img src="${plateFor(p.slug).src}" alt="" width="800" height="400" loading="lazy"></div>
        <div class="card-bot">
          <h3 class="card-t">${esc(p.titulo)}</h3>
          <p class="card-d">${esc(p.resumo)}</p>
          <div class="chips"><span class="chip">${esc(p.categoria)}</span><span class="chip">${p.leitura} min de leitura</span><span class="card-badge">${I.up}</span></div>
        </div>
      </a>`;
  }

  function bandRow(p) {
    return `
      <a class="bandrow" href="#/post/${esc(p.slug)}">
        <span class="bandrow-d">${fmtData(p.data)}</span>
        <span><span class="bandrow-t">${esc(p.titulo)}</span><span class="bandrow-n">${esc(p.resumo)}</span></span>
        <span class="bandrow-m">${esc(p.categoria)} · ${p.leitura} min</span>
      </a>`;
  }

  const friso = (inicio) => `<div class="frieze">${[0, 1, 2].map((k) => { const q = PLATES[(inicio + k) % PLATES.length]; return `<div><img src="${q.src}" alt="${esc(q.alt)}" width="1600" height="2000" loading="lazy"></div>`; }).join("")}</div>`;

  const sidePlate = (i, ratio) => {
    const q = PLATES[i];
    return `<figure class="side-plate rv" style="--ratio:${ratio}"><div class="plate-box"><img src="${q.src}" alt="${esc(q.alt)}" width="1600" height="2000" loading="lazy"></div><figcaption>${esc(q.nome)}, Anna Atkins</figcaption></figure>`;
  };

  /* ---------- home ---------- */
  const SERVICOS = [
    { cat: "Modelos", d: "O que mudou nos assistentes de IA e o que importa para o seu uso." },
    { cat: "Pesquisas", d: "O que um estudo mostra, e o que ele não mostra." },
    { cat: "Guias", d: "Como usar a IA para estudar e trabalhar sem se perder." },
    { cat: "Pensamento crítico", d: "Como a IA muda o jeito de aprender e de saber." }
  ];
  let liquidStop = null;
  let heroCardIdx = 0;

  function renderHome() {
    document.title = "ReadingStone: leia a IA de perto";
    const l = CONFIG.livro;
    const dem = DEMO;
    const recentes = sorted().slice(0, 4);
    const destaques = sorted().slice(0, 3);
    wi = 0;

    const demoHtml = (flagged) =>
      dem.partes.map((x) => (x.m === undefined ? esc(x.t) : flagged ? `<span class="flag">${esc(x.t)}</span>` : esc(x.t))).join("");

    app.innerHTML = `
      <section class="hero on-dark" id="inicio" aria-labelledby="h1">
        <div class="hero-bg" id="hero-bg">
          <img src="${PLATES[0].src}" alt="${esc(PLATES[0].alt)}" width="1920" height="2477" fetchpriority="high">
          <canvas aria-hidden="true"></canvas>
        </div>
        <div class="hero-scrim"></div>
        <p class="hero-mark hv" aria-hidden="true" data-t="ReadingStone" style="--d:300ms"></p>
        <div class="hero-wrap">
          <div class="hero-grid">
            <div class="hero-left">
              <h1 class="h1" id="h1">${L("Leia a IA", "de perto.")}</h1>
              <p class="sup hv" style="--d:650ms">Modelos, pesquisas e guias em linguagem simples. Entenda onde a IA acerta, onde erra e como usar sem abrir mão do seu raciocínio.</p>
              <div class="cta-row hv" style="--d:750ms">
                ${pill("Assinar grátis", { variant: "light", arrow: "up", attrs: "data-open-modal" })}
                ${pill("Ver edições", { variant: "ghost", arrow: null, tag: "a", href: "#/#edicoes" })}
              </div>
            </div>
            <div class="hero-right">
              <div class="hcard hv" id="hcard" style="--d:400ms">
                <div class="hcard-in" id="hcard-in" tabindex="0" role="link" aria-label="Abrir a edição em destaque">
                  <div class="hcard-tile" aria-hidden="true">${I.lens}</div>
                  <div class="hcard-panel">
                    <div class="hcard-slot"><div class="hcard-txt" id="hcard-txt"></div></div>
                    <div class="hcard-foot">
                      <div class="dots" id="hcard-dots" aria-hidden="true">${destaques.map((_, i) => `<span class="dot${i === 0 ? " on" : ""}"></span>`).join("")}</div>
                      <div class="rbs">
                        <button class="rb prev" type="button" id="hcard-prev" aria-label="Edição anterior">${I.right}</button>
                        <button class="rb" type="button" id="hcard-next" aria-label="Próxima edição">${I.right}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="topics hv" style="--d:550ms">
                <p class="topics-l">Explorar por tema</p>
                <ul class="topics-grid">${CATEGORIAS.map((c) => `<li><button class="topic" type="button" data-filter="${esc(c)}">${I.dot}${esc(c)}</button></li>`).join("")}</ul>
              </div>
            </div>
          </div>
        </div>
        <div class="hero-bar hv" style="--d:900ms">
          <div class="shell hero-bar-in"><span>Newsletter sobre IA</span><span>Em português do Brasil</span><span>Role para explorar ${I.down}</span></div>
        </div>
      </section>

      <section class="sec" id="sobre" aria-labelledby="h-sobre">
        <div class="shell about-grid">
          <div class="about-art">
            <span class="about-lens" aria-hidden="true">${I.lens}</span>
            <p class="about-note rv">${I.lens}<span>A pedra de leitura era uma lente que ampliava as letras na página.</span></p>
          </div>
          <div class="about-state">
            <h2 class="sr" id="h-sobre">Sobre a ReadingStone</h2>
            <p class="state io">${palavras("Ajudamos quem estuda e trabalha com IA a entender o que ela faz, onde erra e como usá-la com critério.", false)} ${palavras("Sem jargão.", true)}</p>
            <div class="about-foot rv" style="--d:200ms">
              <p class="facts"><span><b>Formato</b> newsletter e site</span><span><b>Idioma</b> português do Brasil</span></p>
              ${pill("Conhecer o livro", { variant: "ghost", arrow: "right", tag: "a", href: "#/livro" })}
            </div>
          </div>
        </div>
      </section>

      <section class="sec" id="pedra" aria-labelledby="h-pedra" style="padding-top:0">
        <div class="shell pedra-grid">
          <div>${sidePlate(1, "5 / 6")}</div>
          <div>
            <h2 class="h2 io" id="h-pedra">${L("Passe a pedra", "sobre a resposta.")}</h2>
            <p class="lead rv" style="--d:120ms">Uma resposta fluente não é uma resposta conferida. A pedra mostra o que pedir de volta.</p>
            <div class="stone-wrap rv" style="--d:200ms">
              <div class="stone" id="stone" tabindex="0" role="group" aria-label="Resposta de exemplo da IA. Passe o mouse para ver os trechos a conferir; a lista abaixo traz o mesmo conteúdo." aria-describedby="checks">
                <p class="base">${demoHtml(false)}</p>
                <div class="lens-layer" aria-hidden="true"><p>${demoHtml(true)}</p></div>
              </div>
              <p class="note"><b>Exemplo fictício.</b> ${esc(dem.rotulo)} Passe o mouse sobre o texto para ver o que conferir.</p>
              <ul class="checks" id="checks">
                ${dem.marcas.map((m) => `<li><b>“${esc(m.trecho)}”</b><span>${esc(m.nota)}</span></li>`).join("")}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Leia, cheque, pense">
        <ul class="shell band4">
          <li class="rv" style="--d:0ms"><div class="tile tile-light">Leia</div></li>
          <li class="rv" style="--d:120ms"><div class="tile tile-blue">Cheque</div></li>
          <li class="rv" style="--d:240ms"><div class="tile tile-dark" aria-label="depois">${I.right}</div></li>
          <li class="rv" style="--d:360ms"><div class="tile tile-ghost">Pense</div></li>
        </ul>
      </section>

      <section class="sec" id="edicoes" aria-labelledby="h-ed">
        <div class="shell">
          <h2 class="h2 io center" id="h-ed">${L("Edições recentes")}</h2>
          <p class="lead rv center" style="--d:120ms;max-width:none;text-align:center">Textos de exemplo, até a primeira edição.</p>
          <div class="cards">${recentes.map(card).join("")}</div>
        </div>
      </section>

      <section class="sec" id="cobertura" aria-labelledby="h-cob" style="padding-top:0">
        <div class="shell">
          <h2 class="h2 io" id="h-cob" style="max-width:16ch">${L("O que cobrimos")}</h2>
          <ul class="rows">
            ${SERVICOS.map((s, i) => `
              <li class="rv" style="--d:${i * 80}ms">
                <a class="row" href="#/#lista" data-filter="${esc(s.cat)}">
                  <span class="row-in"><h3 class="row-t">${esc(s.cat)}</h3><p class="row-d">${esc(s.d)}</p><span class="row-badge">${I.up}</span></span>
                </a>
              </li>`).join("")}
          </ul>
        </div>
      </section>

      <section class="sec" id="lista" aria-labelledby="h-lista" style="padding-top:0">
        <div class="shell">
          <h2 class="h2 io" id="h-lista">${L("Todas as edições")}</h2>
          <div class="all-grid">
            <div class="tabs rv" role="group" aria-label="Filtrar por categoria">
              ${["Todas", ...CATEGORIAS].map((c) => `<button class="tab" type="button" data-cat="${esc(c)}" aria-pressed="${c === filtro}">${esc(c)}</button>`).join("")}
            </div>
            <div class="bands rv" id="bands" style="--d:100ms"></div>
          </div>
        </div>
      </section>

      <section class="sec" id="glossario" aria-labelledby="h-gl" style="padding-top:0">
        <div class="shell pedra-grid">
          <div>${sidePlate(2, "5 / 6")}</div>
          <div>
            <h2 class="h2 io" id="h-gl">${L("Glossário rápido")}</h2>
            <p class="lead rv" style="--d:120ms">Os termos que mais aparecem nas notícias sobre IA.</p>
            <dl class="gloss rv" style="--d:200ms">
              ${GLOSSARIO.map((g) => `<div><dt>${esc(g.termo)}</dt><dd>${esc(g.def)}</dd></div>`).join("")}
            </dl>
          </div>
        </div>
      </section>

      <section class="sec on-dark" aria-labelledby="h-num">
        <div class="shell">
          <div class="stats-panel rv">
            <h2 class="stats-h io" id="h-num">${L("O que já está no ar.")}</h2>
            <ul class="stats-grid">
              ${[
                [POSTS.length, "Edições no site"],
                [GLOSSARIO.length, "Termos no glossário"],
                [CATEGORIAS.length, "Categorias de tema"],
                [PLATES.length, "Cianótipos no site"]
              ].map(([v, t], i) => `<li class="rv" style="--d:${i * 90}ms"><p class="stat-n" data-v="${v}">${reduce ? v : 0}</p><p class="stat-l">${esc(t)}</p></li>`).join("")}
            </ul>
          </div>
        </div>
      </section>`;

    paintList();
    app.querySelectorAll(".tab").forEach((b) =>
      b.addEventListener("click", () => {
        filtro = b.dataset.cat;
        paintList();
      })
    );
    app.querySelectorAll("[data-filter]").forEach((b) =>
      b.addEventListener("click", (e) => { e.preventDefault(); goFilter(b.dataset.filter); })
    );

    heroCardIdx = 0;
    bindHeroCard(destaques);
    bindStone();
    startLiquid();
    observeReveals();
    updateStats();
    initLenis();
  }

  function paintList() {
    const bands = document.getElementById("bands");
    if (!bands) return;
    const itens = sorted().filter((p) => filtro === "Todas" || p.categoria === filtro);
    bands.innerHTML = itens.length ? itens.map(bandRow).join("") : `<p class="empty">Ainda não há edições nesta categoria.</p>`;
    app.querySelectorAll(".tab").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.cat === filtro)));
  }

  function goFilter(cat) {
    filtro = cat;
    if (document.getElementById("lista")) {
      paintList();
      scrollToId("lista");
    } else {
      location.hash = "#/#lista";
    }
  }

  /* ---------- cartão em carrossel do hero ---------- */
  function bindHeroCard(itens) {
    const txt = document.getElementById("hcard-txt");
    const dots = document.querySelectorAll("#hcard-dots .dot");
    const box = document.getElementById("hcard-in");
    if (!txt) return;
    const write = (p) => {
      txt.innerHTML = `<p class="hcard-cap">${esc(p.categoria)}</p><p class="hcard-title">${esc(p.titulo)}</p>`;
    };
    write(itens[0]);
    let busy = false;
    const go = (step) => {
      if (busy) return;
      busy = true;
      const n = itens.length;
      heroCardIdx = (heroCardIdx + step + n) % n;
      txt.classList.add("out-up");
      setTimeout(() => {
        write(itens[heroCardIdx]);
        txt.classList.remove("out-up");
        txt.classList.add("in-from");
        requestAnimationFrame(() => requestAnimationFrame(() => { txt.classList.remove("in-from"); busy = false; }));
        dots.forEach((d, i) => d.classList.toggle("on", i === heroCardIdx));
      }, reduce ? 0 : 160);
    };
    document.getElementById("hcard-next").addEventListener("click", (e) => { e.stopPropagation(); go(1); });
    document.getElementById("hcard-prev").addEventListener("click", (e) => { e.stopPropagation(); go(-1); });
    box.addEventListener("click", () => { location.hash = "#/post/" + itens[heroCardIdx].slug; });
    box.addEventListener("keydown", (e) => { if (e.key === "Enter") location.hash = "#/post/" + itens[heroCardIdx].slug; });
  }

  /* ---------- revelação líquida no hero ---------- */
  function startLiquid() {
    if (liquidStop) { liquidStop(); liquidStop = null; }
    if (reduce) return;
    const box = document.getElementById("hero-bg");
    if (!box) return;
    const canvas = box.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const brushRadius = 143, decay = 0.016, fadeFrames = 120;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const radius = brushRadius * dpr;
    const cover = document.createElement("canvas");
    const cctx = cover.getContext("2d");
    const brush = document.createElement("canvas");
    const bctx = brush.getContext("2d");
    brush.width = brush.height = Math.ceil(radius * 2);
    const img = new Image();
    let loaded = false, W = 1, H = 1, points = [], last = null, idle = fadeFrames + 1, raf = 0, dead = false;

    const drawCover = () => {
      if (!loaded) return;
      cctx.clearRect(0, 0, W, H);
      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      cctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
    };
    const size = () => {
      const r = box.getBoundingClientRect();
      W = canvas.width = Math.max(1, Math.round(r.width * dpr));
      H = canvas.height = Math.max(1, Math.round(r.height * dpr));
      cover.width = W; cover.height = H;
      drawCover();
    };
    img.onload = () => { loaded = true; drawCover(); };
    img.src = PLATES[1].src; // revelada sob o cursor; a base é a PLATES[0]

    const stamp = (x, y) => {
      const c = radius;
      bctx.globalCompositeOperation = "source-over";
      bctx.clearRect(0, 0, brush.width, brush.height);
      const g = bctx.createRadialGradient(c, c, 0, c, c, c);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.55, "rgba(255,255,255,0.82)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      bctx.fillStyle = g;
      bctx.fillRect(0, 0, brush.width, brush.height);
      bctx.globalCompositeOperation = "source-in";
      bctx.drawImage(cover, x - c, y - c, brush.width, brush.height, 0, 0, brush.width, brush.height);
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(brush, x - c, y - c);
    };
    const tick = () => {
      raf = 0;
      if (dead) return;
      const drawing = points.length > 0;
      if (drawing) idle = 0; else idle++;
      if (idle > fadeFrames) { if (idle === fadeFrames + 1) ctx.clearRect(0, 0, W, H); return; }
      const fade = drawing ? decay : Math.min(decay + idle * 0.004, 0.5);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0," + fade + ")";
      ctx.fillRect(0, 0, W, H);
      if (drawing) { points.forEach((p) => stamp(p.x, p.y)); points = []; }
      raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const move = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) * dpr, y = (e.clientY - r.top) * dpr;
      if (x < -radius || y < -radius || x > W + radius || y > H + radius) { last = null; return; }
      if (last) {
        const dx = x - last.x, dy = y - last.y, dist = Math.hypot(dx, dy);
        const step = Math.max(radius * 0.3, 1);
        const n = Math.min(Math.ceil(dist / step), 60);
        for (let i = 1; i <= n; i++) points.push({ x: last.x + (dx * i) / n, y: last.y + (dy * i) / n });
      } else points.push({ x, y });
      last = { x, y };
      idle = 0;
      kick();
    };
    const ro = new ResizeObserver(size);
    ro.observe(box);
    size();
    window.addEventListener("pointermove", move, { passive: true });
    liquidStop = () => { dead = true; ro.disconnect(); window.removeEventListener("pointermove", move); if (raf) cancelAnimationFrame(raf); };
  }

  /* ---------- a pedra ---------- */
  function bindStone() {
    const st = document.getElementById("stone");
    if (!st) return;
    if (!finePointer) { st.classList.add("static"); st.removeAttribute("tabindex"); return; }
    let timer;
    const move = (e) => {
      const r = st.getBoundingClientRect();
      st.style.setProperty("--x", e.clientX - r.left + "px");
      st.style.setProperty("--y", e.clientY - r.top + "px");
    };
    st.addEventListener("pointerenter", (e) => { move(e); st.classList.add("on"); timer = setTimeout(() => st.classList.add("following"), 220); });
    st.addEventListener("pointermove", move);
    st.addEventListener("pointerleave", () => { clearTimeout(timer); st.classList.remove("following", "on"); });
    st.addEventListener("focus", () => { st.style.setProperty("--r", "200vmax"); st.style.setProperty("--x", "50%"); st.style.setProperty("--y", "50%"); st.classList.add("on"); });
    st.addEventListener("blur", () => { st.style.removeProperty("--r"); st.classList.remove("on"); });
  }

  /* ---------- números que contam ao rolar ---------- */
  let statsTimer = 0;
  function updateStats() {
    if (statsTimer) return;
    statsTimer = setTimeout(() => {
      statsTimer = 0;
      const vh = window.innerHeight;
      document.querySelectorAll(".stat-n").forEach((el) => {
        const v = Number(el.dataset.v);
        if (reduce) { el.textContent = v; return; }
        const r = el.getBoundingClientRect();
        // 0 quando o topo toca a base da janela; 1 quando o centro chega ao centro da janela
        const p = clamp((vh - r.top) / (vh - (vh / 2 - r.height / 2)), 0, 1);
        el.textContent = Math.round(p * v);
      });
    }, 30);
  }
  window.addEventListener("scroll", updateStats, { passive: true });

  /* ---------- revelações ao entrar na tela ---------- */
  let io = null;
  function observeReveals() {
    if (io) io.disconnect();
    const els = [...app.querySelectorAll(".rv, .io"), ...document.querySelectorAll(".foot .io")].filter((el) => !el.closest(".hero") && !el.classList.contains("in"));
    if (!("IntersectionObserver" in window) || reduce) { els.forEach((el) => el.classList.add("in", "done")); return; }
    io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { const alvo = en.target; alvo.classList.add("in"); setTimeout(() => alvo.classList.add("done"), 1000); io.unobserve(alvo); } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- barra de abas: some ao descer, volta ao subir ---------- */
  const tabbar = document.getElementById("tabbar");
  let ultimoY = window.pageYOffset;
  window.addEventListener("scroll", () => {
    const y = window.pageYOffset;
    const base = y + window.innerHeight >= document.documentElement.scrollHeight - 80;
    const esconder = y > 160 && y > ultimoY + 6 && !base;
    const mostrar = (y >= 160 && y < ultimoY - 6) || base;
    if (esconder || y < 160) tabbar.classList.add("hide"); else if (mostrar) tabbar.classList.remove("hide");
    ultimoY = y;
  }, { passive: true });
  tabbar.addEventListener("focusin", () => tabbar.classList.remove("hide"));

  /* ---------- artigo ---------- */
  function bloco(b, n) {
    const a = ` class="rv" style="--d:${(n % 3) * 70}ms"`;
    if (typeof b === "string") return `<p${a}>${esc(b)}</p>`;
    if (b.h) return `<h2${a}>${esc(b.h)}</h2>`;
    if (b.lista) return `<ul${a}>${b.lista.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
    if (b.destaque) return `<blockquote class="pull rv">${esc(b.destaque)}</blockquote>`;
    return "";
  }

  function renderPost(slug) {
    const p = POSTS.find((x) => x.slug === slug);
    if (liquidStop) { liquidStop(); liquidStop = null; }
    if (!p) {
      app.innerHTML = `<div class="post-band"><div class="post-band-scrim"></div></div><div class="shell post-grid"><div></div><div><a class="back" href="#/" style="display:inline-block">Voltar ao início</a><h1 class="post-title">Edição não encontrada</h1></div></div>`;
      return;
    }
    document.title = `${p.titulo} | ReadingStone`;
    const pl = plateFor(p.slug);
    const pl2 = PLATES[(PLATES.indexOf(pl) + 1) % PLATES.length];
    const l = CONFIG.livro;
    const outros = sorted().filter((x) => x.slug !== slug).slice(0, 3);

    app.innerHTML = `
      <div class="post-band on-dark"><img src="${pl.src}" alt="${esc(pl.alt)}" width="1600" height="2000" fetchpriority="high"><div class="post-band-scrim"></div></div>
      <article class="shell post-grid">
        <div class="post-side">
          <a class="back" href="#/#lista">Todas as edições</a>
          <dl class="side-list">
            <div><dt>Categoria</dt><dd>${esc(p.categoria)}</dd></div>
            <div><dt>Publicado em</dt><dd>${fmtData(p.data)}</dd></div>
            <div><dt>Leitura</dt><dd>${p.leitura} minutos</dd></div>
          </dl>
          <figure class="side-plate" style="--ratio:4 / 3"><div class="plate-box"><img src="${pl2.src}" alt="${esc(pl2.alt)}" width="1600" height="2000" loading="lazy"></div><figcaption>${esc(pl2.nome)}, Anna Atkins</figcaption></figure>
        </div>
        <div>
          <h1 class="post-title rv">${esc(p.titulo)}</h1>
          <p class="post-meta">${esc(p.categoria)}, ${fmtData(p.data)}, ${p.leitura} minutos de leitura</p>
          <p class="post-lede rv" style="--d:80ms">${esc(p.resumo)}</p>
          <div class="prose">${p.corpo.map((b, n) => bloco(b, n)).join("")}</div>
        </div>
      </article>

      <section class="shell post-end" aria-labelledby="h-cta-livro">
        <h2 class="h2 io" id="h-cta-livro">${L("Quer ir além?", "Leia o livro.")}</h2>
        <p class="lead rv" style="--d:100ms"><b>${esc(l.titulo)}</b> aprofunda este e outros temas, passo a passo.</p>
        <div class="cta-row rv" style="--d:160ms;margin-top:1.75rem">${pill("Conhecer o livro", { variant: "blue", arrow: "up", tag: "a", href: "#/livro" })}</div>
      </section>

      <div class="frieze" aria-hidden="false">${[1, 2, 3].map((k) => { const q = PLATES[(PLATES.indexOf(pl) + k) % PLATES.length]; return `<div><img src="${q.src}" alt="${esc(q.alt)}" width="1600" height="2000" loading="lazy"></div>`; }).join("")}</div>

      <section class="sec" aria-labelledby="h-mais">
        <div class="shell">
          <h2 class="h2 io" id="h-mais" style="font-size:2rem">${L("Continue lendo")}</h2>
          <div class="bands rv" style="margin-top:1.5rem;--d:100ms">${outros.map(bandRow).join("")}</div>
        </div>
      </section>`;

    window.scrollTo(0, 0);
    observeReveals();
  }

  /* ---------- menu em tela cheia e modal ---------- */
  const navmenu = document.getElementById("navmenu");
  const modal = document.getElementById("modal");
  const menuBtn = document.getElementById("menu-open");
  let lastFocus = null;

  const setInert = (on) => ["conteudo", "topo", "rodape", "tabbar"].forEach((id) => { const el = document.getElementById(id); if (el) el.inert = on; });
  function trap(container, e) {
    if (e.key !== "Tab") return;
    const f = [...container.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])')].filter((x) => !x.hidden && x.offsetParent !== null);
    if (!f.length) return;
    const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }

  function openMenu() {
    lastFocus = document.activeElement;
    navmenu.hidden = false;
    navmenu.setAttribute("aria-hidden", "false");
    navmenu.querySelectorAll(".navmenu-nav button").forEach((b, i) => b.style.setProperty("--i", i));
    stopScroll(); setInert(true);
    requestAnimationFrame(() => { navmenu.classList.add("open"); document.getElementById("menu-close").focus(); });
  }
  function closeMenu(restore) {
    navmenu.classList.remove("open");
    navmenu.setAttribute("aria-hidden", "true");
    setTimeout(() => { navmenu.hidden = true; }, reduce ? 0 : 300);
    setInert(false);
    if (!modal.classList.contains("open")) startScroll();
    if (restore !== false && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function openModal() {
    if (!navmenu.hidden) closeMenu(false);
    if (!modal.classList.contains("open")) lastFocus = document.activeElement;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.getElementById("modal-form-wrap").hidden = false;
    document.getElementById("modal-ok").hidden = true;
    stopScroll(); setInert(true);
    requestAnimationFrame(() => { modal.classList.add("open"); modal.querySelector("input").focus(); });
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    setTimeout(() => { modal.hidden = true; document.getElementById("mform").reset(); document.getElementById("mform-msg").textContent = ""; }, reduce ? 0 : 320);
    setInert(false);
    startScroll();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  menuBtn.addEventListener("click", openMenu);
  document.getElementById("menu-close").addEventListener("click", () => closeMenu());
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-ok-close").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modal.classList.contains("open")) closeModal();
      else if (navmenu.classList.contains("open")) closeMenu();
    }
    if (modal.classList.contains("open")) trap(document.getElementById("modal-panel"), e);
    else if (navmenu.classList.contains("open")) trap(navmenu, e);
  });
  navmenu.querySelectorAll("[data-go]").forEach((b) =>
    b.addEventListener("click", () => {
      const alvo = b.dataset.go;
      if (alvo === "modal") { openModal(); return; }
      closeMenu(false);
      if (location.hash === alvo) route(); else location.hash = alvo;
    })
  );
  // qualquer botão "assinar" da página abre o modal
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open-modal]");
    if (t) { e.preventDefault(); openModal(); }
  });
  // redes sociais no rodapé: só as que já têm endereço
  const ICONES = {
    instagram: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/></svg>',
    linkedin: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 10.5v5.5M8 7.8v.1M12 16v-5.5M12 12.8c0-1.4 1-2.3 2.2-2.3 1.3 0 1.9.9 1.9 2.2V16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };
  const redes = (CONFIG.redes || []).filter((r) => r.url);
  const footSocial = document.getElementById("foot-social");
  footSocial.innerHTML = redes.map((r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(r.nome)} da ReadingStone (abre em outra aba)">${ICONES[r.icone] || ""}${esc(r.nome)}</a></li>`).join("");
  footSocial.hidden = !redes.length;

  // temas no rodapé
  const footTemas = document.getElementById("foot-temas");
  footTemas.innerHTML = CATEGORIAS.map((c) => `<li><button type="button" data-foot-filter="${esc(c)}">${esc(c)}</button></li>`).join("");
  footTemas.addEventListener("click", (e) => { const b = e.target.closest("[data-foot-filter]"); if (b) goFilter(b.dataset.footFilter); });

  /* ---------- formulário de assinatura ---------- */
  document.getElementById("mform").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    const msg = document.getElementById("mform-msg");
    const email = f.email.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg.textContent = "Digite um e-mail válido, como nome@exemplo.com."; f.email.focus(); return; }
    msg.textContent = "";
    const send = document.getElementById("mform-send-t");
    send.textContent = "Enviando…";
    try {
      if (CONFIG.newsletterEndpoint) {
        const r = await fetch(CONFIG.newsletterEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ email, nome: f.nome.value.trim() })
        });
        if (!r.ok) throw new Error("falha");
      }
      const ok = document.getElementById("modal-ok");
      const conectado = Boolean(CONFIG.newsletterEndpoint);
      ok.querySelector(".modal-h").textContent = conectado ? "Pronto, seu e-mail está na lista." : "Formulário em demonstração.";
      ok.querySelector(".modal-ok-p").textContent = conectado
        ? "Obrigado por assinar. A próxima edição chega no seu e-mail."
        : "O envio ainda não está conectado a um serviço de e-mail, então nada foi salvo.";
      document.getElementById("modal-form-wrap").hidden = true;
      ok.hidden = false;
    } catch (err) {
      msg.textContent = "Não foi possível enviar agora. Tente de novo em instantes.";
    } finally {
      send.textContent = "Assinar grátis";
    }
  });


  /* ---------- abas: livro e founders ---------- */
  function setActiveTab(tab) {
    document.querySelectorAll("[data-tab]").forEach((el) => {
      if (el.dataset.tab === tab) el.setAttribute("aria-current", "page"); else el.removeAttribute("aria-current");
    });
  }
  const toTop = () => { if (lenis) lenis.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0); };

  function renderLivro() {
    if (liquidStop) { liquidStop(); liquidStop = null; }
    const l = CONFIG.livro;
    document.title = l.titulo + " | ReadingStone";
    app.innerHTML = `
      <div class="post-band on-dark"><img src="${PLATES[0].src}" alt="${esc(PLATES[0].alt)}" width="1920" height="2477" fetchpriority="high"><div class="post-band-scrim"></div></div>
      <section id="livro-tab" class="on-dark tab-body" aria-labelledby="h-livro">
        <div class="shell">
          <div class="book-card rv">
            <div>
              <div class="cover" aria-hidden="true"><i></i><b>${esc(l.titulo)}</b></div>
              <p class="cover-note">Capa provisória, só para esta página.</p>
            </div>
            <div>
              <h1 class="h2 io" id="h-livro">${L(l.titulo)}</h1>
              <p class="lead rv" style="--d:100ms">${esc(l.subtitulo)}</p>
              <p class="book-p rv" style="--d:160ms">${esc(l.descricao)}</p>
              <h2 class="btopics-h rv" style="--d:220ms">O que o livro trata</h2>
              <ul class="btopics">${l.topicos.map((t, i) => `<li class="rv" style="--d:${260 + i * 70}ms">${esc(t)}</li>`).join("")}</ul>
              <div class="cta-row rv" style="--d:640ms">${pill(l.textoBotao, { variant: "light", arrow: "up", attrs: "data-open-modal" })}</div>
            </div>
          </div>
          <div class="book-plate rv"><img src="${PLATES[3].src}" alt="${esc(PLATES[3].alt)}" width="1920" height="2681" loading="lazy"></div>
        </div>
      </section>
      ${friso(1)}`;
    setActiveTab("livro");
    observeReveals();
    toTop();
    initLenis();
  }

  function fcard(f, i) {
    const foto = f.foto
      ? `<img src="${esc(f.foto)}" alt="Foto de ${esc(f.nome)}" width="800" height="1000" loading="lazy">`
      : `<div class="fphoto-ph" aria-hidden="true"><span class="fphoto-ini">${esc(f.iniciais || "")}</span>${I.lens}</div>`;
    const lk = f.linkedin
      ? `<a class="flink" href="${esc(f.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de ${esc(f.nome)} (abre em outra aba)">LinkedIn ${I.up}</a>`
      : "";
    return `
      <article class="fcard rv" style="--d:${i * 100}ms">
        <div class="fphoto">${foto}${f.foto ? "" : '<span class="fbadge">Foto provisória</span>'}</div>
        <div class="fbody">
          <h2 class="fname">${esc(f.nome)}</h2>
          <div class="chips"><span class="chip">${esc(f.papel)}</span><span class="chip">Descrição provisória</span></div>
          <div class="fmore" id="fm-${i}"><div class="fmore-in"><p>${esc(f.descricao)}</p></div></div>
          <div class="factions">
            <button class="fbtn" type="button" aria-expanded="false" aria-controls="fm-${i}"><span class="fbtn-t">Conhecer</span><span class="fbtn-i" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span></button>
            ${lk}
          </div>
        </div>
      </article>`;
  }

  function renderFounders() {
    if (liquidStop) { liquidStop(); liquidStop = null; }
    document.title = "Founders | ReadingStone";
    const fs = CONFIG.founders || [];
    const hs = CONFIG.historia || { titulo: "", paragrafos: [] };
    app.innerHTML = `
      <div class="post-band on-dark"><img src="${PLATES[2].src}" alt="${esc(PLATES[2].alt)}" width="1792" height="2385" fetchpriority="high"><div class="post-band-scrim"></div></div>
      <section id="founders-tab" class="shell tab-body" aria-labelledby="h-fnd">
        <h1 class="h2 io" id="h-fnd">${L("Quem faz", "a ReadingStone.")}</h1>
        <p class="lead rv" style="--d:120ms">As pessoas por trás da newsletter e do livro.</p>
        <div class="fgrid">${fs.map(fcard).join("")}
          <aside class="fstory rv" style="--d:200ms" aria-labelledby="h-hist">
            <h2 class="fstory-h" id="h-hist">${esc(hs.titulo)}</h2>
            <div class="story">${(hs.paragrafos || []).map((t) => `<p>${esc(t)}</p>`).join("")}</div>
            <p class="note"><b>${esc(hs.provisorio || "")}</b></p>
            <div class="cta-row" style="margin-top:1.5rem">${pill("Assinar grátis", { variant: "blue", arrow: "up", attrs: "data-open-modal" })}</div>
          </aside>
        </div>
      </section>
      ${friso(0)}`;
    app.querySelectorAll(".fbtn").forEach((b) =>
      b.addEventListener("click", () => {
        const card = b.closest(".fcard");
        const aberto = card.classList.toggle("open");
        b.setAttribute("aria-expanded", String(aberto));
        b.querySelector(".fbtn-t").textContent = aberto ? "Fechar" : "Conhecer";
      })
    );
    setActiveTab("founders");
    observeReveals();
    toTop();
    initLenis();
  }

  // tocar na aba em que você já está leva ao topo dela
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-tab]");
    if (!a) return;
    const alvo = a.getAttribute("href");
    const atual = location.hash || "#/";
    if (alvo === atual) { e.preventDefault(); toTop(); }
  });

  /* ---------- roteador por hash ---------- */
  function route() {
    if (navmenu.classList.contains("open")) closeMenu(false);
    const h = location.hash.replace(/^#\/?/, "");
    const m = h.match(/^post\/([\w-]+)/);
    if (m) { destroyLenis(); setActiveTab("inicio"); renderPost(m[1]); return; }
    if (h === "livro" || h === "#livro") { if (!document.getElementById("livro-tab")) renderLivro(); else toTop(); return; }
    if (h === "founders") { if (!document.getElementById("founders-tab")) renderFounders(); else toTop(); return; }

    const ancora = h.startsWith("#") ? h.slice(1) : "";
    setActiveTab("inicio");
    if (!document.getElementById("inicio")) renderHome();
    requestAnimationFrame(() => {
      if (ancora) scrollToId(ancora);
      else toTop();
    });
  }
  window.addEventListener("hashchange", route);
  document.querySelector(".brand").addEventListener("click", () => { if (location.hash === "" || location.hash === "#/") route(); });

  // depois da abertura 000 a 100, a primeira aba que aparece é sempre a central
  if (html.classList.contains("intro") && /^#\/(livro|founders|#livro)/.test(location.hash)) history.replaceState(null, "", "#/");
  runLoader();
  route();
})();
