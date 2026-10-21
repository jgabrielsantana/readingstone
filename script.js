(function () {
  const html = document.documentElement;
  const app = document.getElementById("app");
  const F = window.FX;
  document.getElementById("ano").textContent = new Date().getFullYear();

  const reduce = F.reduce;
  const finePointer = F.finePointer;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const fmtData = (iso) => {
    const [y, m, d] = iso.split("-");
    return Number(d) + " " + MESES[Number(m) - 1] + " " + y;
  };
  const fmtCurta = (iso) => { const [, m, d] = iso.split("-"); return Number(d) + " " + MESES[Number(m) - 1]; };
  const sorted = () => [...POSTS].sort((a, b) => b.data.localeCompare(a.data));
  const clamp = F.clamp;
  // cada tema leva uma das três cores de selo: vermelho, azul ou verde
  const corDe = (cat) => "c" + (Math.max(0, CATEGORIAS.indexOf(cat)) % 3);

  /* ---------- ícones ---------- */
  const cruz = (cls) => `<svg class="ico ${cls || ""}" viewBox="0 0 48 48" aria-hidden="true"><use href="#cross"/></svg>`;
  const leao = (cls) => `<svg class="lion ${cls || ""}" viewBox="0 0 306.45 372.84" aria-hidden="true"><use href="assets/lion.svg#lion"/></svg>`;
  const ARROW = '<svg class="ico cta-arrow" viewBox="0 0 14 11" aria-hidden="true"><path d="M0 5.5H13M8 .5L13 5.5L8 10.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
  const I = {
    up: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    right: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const BR = '<svg viewBox="0 0 10.5 10.5" aria-hidden="true"><path d="M0 .5H10V10.5" fill="none" stroke="currentColor"/></svg>';
  const brk = () => ["tl", "tr", "br", "bl"].map((c) => `<span class="bk ${c}">${BR}</span>`).join("");

  /* ---------- estampas japonesas em domínio público ---------- */
  const ARTS = {
    musashi: { src: "assets/the-moon-on-musashi-plain-musashino-no.jpg", w: 1300, h: 1929, pos: "50% 22%", nome: "A lua na planície de Musashi", autor: "Yoshitoshi", alt: "Gravura japonesa de uma raposa de pelo claro sob uma lua cheia, entre capim alto" },
    dawn: { src: "assets/dawn-moon-of-the-shinto-rites-shinji.jpg", w: 1300, h: 1906, pos: "62% 12%", nome: "A lua da alvorada dos ritos xintoístas", autor: "Yoshitoshi", alt: "Gravura japonesa de um sacerdote de vestes azuis e vermelhas erguendo papéis, sob céu azul e uma lua escura" },
    smoke: { src: "assets/moon-and-smoke-enchu-no-tsuki-from.jpg", w: 1300, h: 1874, pos: "40% 14%", nome: "Lua e fumaça", autor: "Yoshitoshi", alt: "Gravura japonesa de um bombeiro diante de chamas alaranjadas, com a lua branca ao fundo" },
    fox: { src: "assets/the-cry-of-the-fox-konkai.jpg", w: 1300, h: 1851, pos: "50% 10%", nome: "O uivo da raposa", autor: "Yoshitoshi", alt: "Gravura japonesa de uma raposa vestida como monge sob uma lua crescente, em noite escura" },
    cub: { src: "assets/a-lion-training-a-cub.jpg", w: 1300, h: 2794, pos: "50% 6%", nome: "Um leão ensina o filhote", autor: "Hiroshige", alt: "Gravura japonesa de um leão de juba marrom olhando de uma rocha para o filhote, que sobe pela pedra" },
    peonies: { src: "assets/chinese-lions-and-peonies.jpg", w: 1300, h: 1766, pos: "30% 78%", nome: "Leões chineses e peônias", autor: "Koryusai", alt: "Gravura japonesa de leões de pelagem encaracolada entre peônias cor de rosa" },
    enlight: { src: "assets/moon-of-enlightenment-godo-no-tsuki-from.jpg", w: 1300, h: 1884, pos: "50% 18%", nome: "A lua da iluminação", autor: "Yoshitoshi", alt: "Gravura japonesa de um homem careca sentado, apontando para uma lua cheia no céu" },
    cauldron: { src: "assets/a-cauldron-on-a-moonlit-night-tsukiyo.jpg", w: 1300, h: 1885, pos: "50% 12%", nome: "Um caldeirão em noite de lua", autor: "Yoshitoshi", alt: "Gravura japonesa de dois homens diante de um grande caldeirão, sob a lua cheia" },
    clothes: { src: "assets/yoshitoshi-100-aspects-of-the-moon-84.jpg", w: 1300, h: 1737, pos: "50% 14%", nome: "A lua que bate o tecido", autor: "Yoshitoshi", alt: "Gravura japonesa de uma mulher batendo tecido, com uma criança ao lado e a lua cheia na janela" }
  };
  const ART_LIST = ["musashi", "dawn", "smoke", "fox", "cub", "peonies", "enlight", "cauldron", "clothes"];
  const artFor = (slug) => {
    let h = 0;
    for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return ARTS[["musashi", "dawn", "smoke", "fox", "enlight", "cauldron", "clothes"][h % 7]];
  };
  const img = (a, extra) => `<img src="${a.src}" alt="${esc(a.alt)}" width="${a.w}" height="${a.h}" style="object-position:${a.pos}" ${extra || 'loading="lazy"'}>`;

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
  let lenis = null, lenisBusy = false, locked = false, stopLenisTick = null;
  async function initLenis() {
    if (reduce || lenis || lenisBusy || location.search.indexOf("lenis=0") >= 0) return;
    lenisBusy = true;
    try {
      const m = await import("lenis");
      if (!lenisBusy) return;
      lenis = new m.default({ smoothWheel: true });
      stopLenisTick = F.tick((t) => { if (lenis) lenis.raf(t); }, 0);
      if (locked) lenis.stop();
    } catch (e) { /* sem a biblioteca, a rolagem nativa continua funcionando */ }
  }
  function destroyLenis() {
    lenisBusy = false;
    if (stopLenisTick) { stopLenisTick(); stopLenisTick = null; }
    if (lenis) { lenis.destroy(); lenis = null; }
  }
  function stopScroll() {
    locked = true;
    if (lenis) lenis.stop();
    html.style.position = "relative"; html.style.overflow = "hidden"; html.style.height = "100%";
  }
  function startScroll() {
    locked = false;
    if (lenis) lenis.start();
    html.style.removeProperty("position"); html.style.removeProperty("overflow"); html.style.removeProperty("height");
  }
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -8 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 8, behavior: reduce ? "auto" : "smooth" });
  }
  const toTop = () => { if (lenis) lenis.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0); };

  /* ---------- abertura: o leão se enche de cima para baixo ---------- */
  function setReady() { html.classList.add("ready"); }
  function runLoader() {
    const loader = document.getElementById("loader");
    if (!html.classList.contains("intro") || !loader) { setReady(); return; }
    stopScroll();
    const fill = document.getElementById("loader-fill"), num = document.getElementById("loader-num");
    const FILL_MS = 1500;
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const t0 = performance.now();
    const tickLoad = (now) => {
      const t = clamp((now - t0) / FILL_MS, 0, 1), e = ease(t), p = Math.round(e * 100);
      loader.style.setProperty("--p", e.toFixed(3));
      fill.style.transform = `scaleX(${e.toFixed(3)})`;
      num.textContent = String(p).padStart(3, "0");
      if (t < 1) { requestAnimationFrame(tickLoad); return; }
      loader.classList.add("clear");
      setTimeout(() => {
        loader.classList.add("out");
        let done = false;
        const finish = () => {
          if (done) return; done = true;
          html.classList.remove("intro");
          try { sessionStorage.setItem("tsuki-intro", "1"); } catch (e) {}
          setReady(); startScroll();
        };
        loader.addEventListener("transitionend", (e) => { if (e.target === loader) finish(); });
        setTimeout(finish, 1100);
      }, 430);
    };
    requestAnimationFrame(tickLoad);
  }

  /* ---------- peças ---------- */
  const L = (...linhas) => linhas.map((l) => '<span class="ln"><span>' + esc(l) + "</span></span>").join("");
  const LS = (...linhas) => linhas.map((l, i) => '<span class="ln"><span>' + esc(l) + (i === linhas.length - 1 ? '<span class="stop">.</span>' : "") + "</span></span>").join("");
  let wi = 0;
  const palavras = (txt, soft) =>
    txt.split(" ").map((w) => '<span class="w' + (soft ? " soft" : "") + '" style="--i:' + wi++ + '">' + esc(w) + "</span>").join(" ");
  const letras = (txt, base) => [...txt].map((ch, i) => `<span class="lt" style="--i:${(base || 0) + i}">${ch === " " ? "&nbsp;" : esc(ch)}</span>`).join("");

  function cta(label, o) {
    const { variant = "solid", tag = "button", href = "", attrs = "", arrow = true } = o || {};
    const inner = '<span class="cta-in"><span class="cta-t">' + esc(label) + "</span>" + (arrow ? ARROW : "") + "</span>";
    const cls = "cta cta-" + variant;
    return tag === "a" ? '<a class="' + cls + '" href="' + esc(href) + '" ' + attrs + ">" + inner + "</a>" : '<button class="' + cls + '" type="button" ' + attrs + ">" + inner + "</button>";
  }

  function bandRow(p) {
    return `
      <a class="bandrow ${corDe(p.categoria)}" href="#/post/${esc(p.slug)}">
        <span class="bandrow-d">${fmtData(p.data)}</span>
        <span><span class="bandrow-t">${esc(p.titulo)}</span><span class="bandrow-n">${esc(p.resumo)}</span></span>
        <span class="bandrow-m">${esc(p.categoria)} · ${p.leitura} min</span>
      </a>`;
  }

  const friso = (...ks) => `<div class="frieze">${ks.map((k) => { const a = ARTS[ART_LIST[k % ART_LIST.length]]; return `<div>${img(a)}</div>`; }).join("")}</div>`;
  const sidePlate = (key, ratio) => { const a = ARTS[key]; return `<figure class="side-plate rv" style="--ratio:${ratio}"><div class="plate-box">${img(a)}</div><figcaption>${esc(a.nome)}, ${esc(a.autor)}</figcaption></figure>`; };

  // contorno do recorte em degraus, usado nas placas da linha do tempo
  const PLATE_OUTLINE = "M13.6168 0.497469H697.378C700.858 0.497469 704.195 1.38786 706.655 2.97277C709.115 4.55769 710.498 6.70729 710.498 8.94869V411.208C710.498 413.449 709.115 415.599 706.655 417.183C704.195 418.768 700.858 419.659 697.378 419.659H460.249C454.073 419.659 447.976 420.555 442.411 422.281C436.847 424.008 431.958 426.519 428.107 429.63L399.246 452.95C395.559 455.928 390.878 458.333 385.55 459.986C380.223 461.639 374.385 462.497 368.472 462.497H13.6168C10.1373 462.497 6.80038 461.607 4.34003 460.022C1.87968 458.437 0.497469 456.288 0.497469 454.046V8.94869C0.497469 6.70729 1.87968 4.55769 4.34003 2.97277C6.80038 1.38786 10.1373 0.497469 13.6168 0.497469Z";

  /* ---------- home ---------- */
  const SERVICOS = [
    { cat: "Modelos", d: "O que mudou nos assistentes de IA e o que importa para o seu uso." },
    { cat: "Pesquisas", d: "O que um estudo mostra, e o que ele não mostra." },
    { cat: "Guias", d: "Como usar a IA para estudar e trabalhar sem se perder." },
    { cat: "Pensamento crítico", d: "Como a IA muda o jeito de aprender e de saber." }
  ];
  const FASES = [0, 0.12, 0.25, 0.38, 0.5, 0.75];

  function renderHome() {
    F.cleanup();
    document.title = "Tsuki: leia a IA de perto";
    const dem = DEMO, l = CONFIG.livro;
    const todos = sorted(), ultimo = todos[0], recentes = todos.slice(0, 4);
    const lua = F.moonPhase();
    const contagem = (c) => POSTS.filter((p) => p.categoria === c).length;
    const ativa = ultimo ? ultimo.categoria : null;
    wi = 0;

    const demoHtml = (flagged) =>
      dem.partes.map((x) => (x.m === undefined ? esc(x.t) : flagged ? `<span class="flag">${esc(x.t)}</span>` : esc(x.t))).join("");

    const idxRows = [
      { t: "centre", post: recentes[0], art: ARTS.musashi, par: 20 },
      { t: "side", al: "right", art: ARTS.cub, rot: "Leão", par: 60 },
      { t: "centre", post: recentes[1], art: ARTS.dawn, par: 20 },
      { t: "side", al: "left", art: ARTS.peonies, rot: "Peônias", par: 60 },
      { t: "centre", post: recentes[2], art: ARTS.smoke, par: 20 },
      { t: "side", al: "right", art: ARTS.enlight, rot: "Iluminação", par: 60 },
      { t: "centre", post: recentes[3], art: ARTS.fox, par: 20 }
    ];
    const plateOutline = `<svg class="tl-outline" viewBox="0 0 710.995 462.995" preserveAspectRatio="none" aria-hidden="true"><path d="${PLATE_OUTLINE}" fill="none" stroke="currentColor" vector-effect="non-scaling-stroke"/></svg>`;
    const rowHtml = (r, i) => {
      const plate = `<div class="tl-plate" data-par="${r.par}"><div class="tl-fill"><div class="tl-slot" data-slot>${img(r.art)}</div></div>${plateOutline}</div>`;
      if (r.t === "side") {
        return `<div class="tl-row side ${r.al} c${i % 3}"><div class="tl-pl-wrap">${plate}</div><p class="tl-year" data-par="${r.par}" aria-hidden="true">${letras(r.rot, 0)}</p><span class="sr">${esc(r.art.nome)}, ${esc(r.art.autor)}</span></div>`;
      }
      const p = r.post;
      return `<div class="tl-row centre ${corDe(p.categoria)}">
        <a class="tl-pl-wrap" href="#/post/${esc(p.slug)}" tabindex="-1" aria-hidden="true">${plate}</a>
        <p class="tl-year" data-par="${r.par}" aria-hidden="true">${letras(fmtCurta(p.data), 0)}</p>
        <p class="tl-copy" data-par="110"><a href="#/post/${esc(p.slug)}"><b>${esc(p.titulo)}.</b> ${esc(p.resumo)}</a></p>
      </div>`;
    };

    app.innerHTML = `
      <div class="stack" id="stack">
        <div class="layer"><div class="layer-in">
          <section class="hero" data-hero id="inicio" aria-labelledby="h1">
            <canvas class="contours" aria-hidden="true"></canvas>
            <div class="moon-wrap" aria-hidden="true">
              <canvas class="moon-base"></canvas><canvas class="moon-red"></canvas>
              <div class="hero-lion">${leao()}</div>
            </div>
            <div class="hero-col">
              <div class="hero-mid">
                <div class="ident">
                  <p class="id hv" style="--d:180ms"><span class="kanji" lang="ja" aria-hidden="true">月</span> lua em japonês</p>
                  <h1 class="h1" id="h1"><span class="sr">Tsuki</span><span aria-hidden="true">${letras("Tsuki", 0)}</span></h1>
                  <ul class="meta">
                    <li class="hv" style="--d:440ms">${F.moonSvg(0.5, 18)}<span>Newsletter sobre IA</span></li>
                    <li class="hv" style="--d:570ms">${F.moonSvg(0.25, 18)}<span>Em português do Brasil</span></li>
                    <li class="hv" style="--d:700ms">${F.moonSvg(0.0, 18)}<span>Livro: ${esc(l.titulo)}</span></li>
                  </ul>
                </div>
                <div class="hpanels">
                  <a class="bpanel hv" style="--d:900ms" href="${ultimo ? "#/post/" + esc(ultimo.slug) : "#/"}">
                    ${brk()}
                    <p class="bp-eb">última edição</p>
                    <dl class="bp-dl"><dt>${esc(ultimo ? ultimo.titulo : "Em breve")}</dt><dd>${esc(ultimo ? ultimo.categoria : "")}</dd><dd>${ultimo ? fmtData(ultimo.data) : ""}</dd></dl>
                  </a>
                  <div class="bpanel hv" style="--d:1000ms">
                    ${brk()}
                    <p class="bp-eb">em números</p>
                    <dl class="bp-stats">
                      <div><dt>Edições</dt><dd>${letras(String(POSTS.length), 0)}</dd></div>
                      <div><dt>Temas</dt><dd>${letras(String(CATEGORIAS.length), 2)}</dd></div>
                      <div><dt>Termos</dt><dd>${letras(String(GLOSSARIO.length), 4)}</dd></div>
                    </dl>
                  </div>
                </div>
              </div>
              <div class="hactions hv" style="--d:1250ms">
                <div class="today">${F.moonSvg(lua.p, 32, "today-glyph")}<p><b>Lua de hoje</b><span>${esc(lua.nome)}, ${Math.round(lua.illum * 100)}%</span></p></div>
                ${cta("Assinar grátis", { variant: "solid", attrs: "data-open-modal" })}
                <div class="hlinks"><a href="#/#edicoes">Ver edições</a><a href="#/livro">O livro</a></div>
              </div>
            </div>
          </section>
        </div><div class="layer-shade"></div></div>

        <div class="layer"><div class="layer-in">
          <section class="season" data-season id="ciclo" aria-labelledby="h-ciclo">
            <div class="orbit-frame">
              <div class="stage" aria-hidden="true">
                <canvas class="s-dots"></canvas>
                <svg class="s-svg" viewBox="0 0 1440 800">
                  <g class="s-grid">
                    <line x1="360" y1="-4000" x2="360" y2="4800"/><line x1="720" y1="-4000" x2="720" y2="4800"/><line x1="1080" y1="-4000" x2="1080" y2="4800"/><line x1="-4000" y1="400" x2="5440" y2="400"/>
                  </g>
                  <circle class="s-ring" cx="720" cy="400" r="76"/><circle class="s-ring ghost" cx="720" cy="400" r="342"/><circle class="s-ring ghost" cx="720" cy="400" r="426"/>
                  <circle class="s-ping" cx="720" cy="400" r="12"/><circle class="s-hub" cx="720" cy="400" r="9"/>
                  <g class="s-marks"><rect x="64" y="76" width="16" height="16"/><rect x="1360" y="76" width="16" height="16"/><rect x="64" y="710" width="16" height="16"/><rect x="1360" y="710" width="16" height="16"/></g>
                </svg>
                <canvas class="s-trace"></canvas>
              </div>
              ${CATEGORIAS.map((c, i) => `<button class="orbit-label c${i % 3}${c === ativa ? " live" : ""}" type="button" data-filter="${esc(c)}">${F.moonSvg(FASES[i], 22)}<span><b>${esc(c)}</b><small>${contagem(c)} ${contagem(c) === 1 ? "edição" : "edições"}</small></span></button>`).join("")}
            </div>
            <canvas class="seam" aria-hidden="true" data-carry="light"></canvas>
            <div class="season-col">
              <div class="shead io">
                <h2 class="sh2" id="h-ciclo">
                  <span class="sh2-l">${palavras("as fases", false)}</span>
                  <span class="sh2-l">${palavras("da leitura", false)}<span class="stop">.</span></span>
                </h2>
                <span class="s-rule" aria-hidden="true"></span>
                <p class="sh-intro">${palavras("Seis temas, uma lua: modelos, pesquisas, guias, dicas, pensamento crítico e ética.", false)}</p>
                <ul class="theme-chips">${CATEGORIAS.map((c) => `<li><button type="button" data-filter="${esc(c)}">${esc(c)}</button></li>`).join("")}</ul>
              </div>
              <div class="splate" aria-label="Lua de hoje">
                <svg class="splate-frame" viewBox="0 0 277 110" preserveAspectRatio="none" aria-hidden="true"><path d="M0.5 0.5H276.5V101L268 109.5H0.5Z" vector-effect="non-scaling-stroke"/></svg>
                <div class="splate-badge">${F.moonSvg(lua.p, 38)}</div>
                <dl class="splate-dl"><div><dt>hoje</dt><dd>${esc(lua.nome)}</dd></div><div><dt>luz</dt><dd>${Math.round(lua.illum * 100)}%</dd></div><div><dt>dia</dt><dd>${Math.floor(lua.age) + 1} do ciclo</dd></div></dl>
              </div>
            </div>
          </section>
        </div><div class="layer-shade"></div></div>

        <div class="layer last">
          <section class="timeline" id="edicoes" aria-labelledby="h-ed">
            <div class="tl-wrap">
              <h2 class="tl-h io" id="h-ed">${LS("as edições", "recentes")}</h2>
              <div class="tl-rail" aria-hidden="true"><i class="tl-track"></i><i class="tl-prog"></i><i class="tl-mark"></i></div>
              ${idxRows.map(rowHtml).join("")}
            </div>
          </section>
        </div>
      </div>

      <section class="sec sobre" id="sobre" aria-labelledby="h-sobre">
        <div class="shell about-grid">
          <div class="about-art" aria-hidden="true">${cruz("about-cross")}<span class="about-kanji" lang="ja">月</span></div>
          <div class="about-state">
            <h2 class="sr" id="h-sobre">Sobre a Tsuki</h2>
            <p class="state io">${palavras("A Tsuki entrega conteúdos informativos sobre IA, de seu funcionamento aos seus limites", false)} ${palavras("e à ética de usá-la.", true)}</p>
            <div class="about-foot rv" style="--d:200ms">
              <p class="facts"><span><b>Formato</b> newsletter e site</span><span><b>Idioma</b> português do Brasil</span></p>
              ${cta("Conhecer o livro", { variant: "ghost", tag: "a", href: "#/livro" })}
            </div>
          </div>
        </div>
      </section>

      <section class="sec" id="demo" aria-labelledby="h-demo" style="padding-top:0">
        <div class="shell pedra-grid">
          <div>${sidePlate("enlight", "5 / 6")}</div>
          <div>
            <h2 class="h2 io" id="h-demo">${L("Passe a lua", "sobre a resposta.")}</h2>
            <p class="lead rv" style="--d:120ms">Uma resposta fluente não é uma resposta conferida. A lua mostra o que pedir de volta.</p>
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
          <div>${sidePlate("clothes", "5 / 6")}</div>
          <div>
            <h2 class="h2 io" id="h-gl">${L("Glossário rápido")}</h2>
            <p class="lead rv" style="--d:120ms">Os termos que mais aparecem nas notícias sobre IA.</p>
            <dl class="gloss rv" style="--d:200ms">
              ${GLOSSARIO.map((g) => `<div><dt>${esc(g.termo)}</dt><dd>${esc(g.def)}</dd></div>`).join("")}
            </dl>
          </div>
        </div>
      </section>

      <section class="padd" id="livro-home" aria-labelledby="h-padd">
        <canvas class="contours" aria-hidden="true"></canvas>
        <div class="padd-fig" data-up><div class="padd-lion" aria-hidden="true">${leao()}</div></div>
        <div class="padd-band"></div>
        <canvas class="seam" aria-hidden="true" data-carry="dark"></canvas>
        <h2 class="padd-h io" id="h-padd"><span class="sh2-l">${palavras("a máquina", false)}</span><span class="sh2-l">${palavras("resolve", false)}<span class="stop red">?</span></span></h2>
        <div class="padd-intro">
          <p class="padd-p io">${palavras(l.subtitulo, false)}</p>
          <div class="padd-cta rv" style="--d:420ms">${cta("Conhecer o livro", { variant: "solid", tag: "a", href: "#/livro" })}</div>
        </div>
        <div class="pp meet rv" style="--d:300ms">${brk()}
          <dl><dt>${esc(l.titulo)}</dt><dd>Epistemologia da IA</dd><dd>Para quem estuda e trabalha com IA</dd></dl>
        </div>
        <div class="pp stats rv" style="--d:420ms">${brk()}
          <dl>
            ${[[l.topicos.length, "temas do livro", 0.0], [POSTS.length, "edições no site", 0.25], [GLOSSARIO.length, "termos no glossário", 0.38], [CATEGORIAS.length, "temas da newsletter", 0.5]].map(([v, t, ph]) => `<div class="stat-row">${F.moonSvg(ph, 28)}<div><dt>${esc(t)}</dt><dd>${letras(String(v), 0)}</dd></div></div>`).join("")}
          </dl>
        </div>
        <div class="cal" aria-label="Temas e fases da lua">
          <ul>
            ${CATEGORIAS.map((c, i) => `<li class="cal-card c${i % 3}${c === ativa ? " live" : ""}" style="--c:${i - 2.5};--k:${i}">
              <span class="cal-link" aria-hidden="true"></span>
              <span class="cal-mk">${F.moonSvg(FASES[i], 18)}</span>
              <p class="cal-r">${i === 0 ? "lua nova" : i === 1 ? "crescente" : i === 2 ? "quarto" : i === 3 ? "gibosa" : i === 4 ? "lua cheia" : "minguante"}</p>
              <p class="cal-n"><a href="#/#lista" data-filter="${esc(c)}">${esc(c)}</a></p>
              <p class="cal-d">${contagem(c)} ${contagem(c) === 1 ? "edição" : "edições"}</p>
            </li>`).join("")}
          </ul>
        </div>
      </section>`;

    paintList();
    app.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => { filtro = b.dataset.cat; paintList(); }));
    app.querySelectorAll("[data-filter]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); goFilter(b.dataset.filter); }));

    bindStone();
    observeReveals();
    mountHome();
    initLenis();
  }

  function mountHome() {
    const hero = app.querySelector("[data-hero]"), stack = document.getElementById("stack"), season = app.querySelector("[data-season]");
    const tl = app.querySelector(".timeline");
    app.querySelectorAll(".contours").forEach((c) => F.reg(F.contours(c)));
    F.reg(F.moonHero(hero));
    F.reg(F.stack(stack));
    F.reg(F.season(season, [0.07, 0.23, 0.39, 0.55, 0.71, 0.87]));
    F.reg(F.timeline(tl));
    season.querySelectorAll(".seam").forEach((c) => F.reg(F.seam(c, season, c.dataset.carry)));
    const padd = app.querySelector(".padd");
    padd.querySelectorAll(".seam").forEach((c) => F.reg(F.seam(c, padd, c.dataset.carry)));
    const fig = padd.querySelector(".padd-fig");
    F.reg(F.onScroll(() => {
      if (reduce) return;
      const r = padd.getBoundingClientRect(), vh = innerHeight, p = clamp((vh - r.top) / (vh + r.height), 0, 1);
      fig.style.transform = `translateY(${(-48 * (r.width / 1440) * p).toFixed(1)}px)`;
    }));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { padd.classList.add("in"); io.disconnect(); } }), { rootMargin: "0px 0px -20% 0px" });
    io.observe(padd); F.reg(() => io.disconnect());
    if (reduce) padd.classList.add("in");
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
    if (document.getElementById("lista")) { paintList(); scrollToId("lista"); }
    else location.hash = "#/#lista";
  }

  /* ---------- a lua sobre a resposta ---------- */
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

  /* ---------- revelações ao entrar na tela ---------- */
  let io = null;
  function observeReveals() {
    if (io) io.disconnect();
    const els = [...app.querySelectorAll(".rv, .io")].filter((el) => !el.classList.contains("in"));
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

  /* ---------- páginas internas: cabeçalho com contornos ---------- */
  const tabHead = (id, linhas, lead, cls) => `
    <section class="tabhead ${cls || ""}" id="${id}">
      <canvas class="contours" aria-hidden="true"></canvas>
      <div class="shell th-in">
        <h1 class="th io">${LS(...linhas)}</h1>
        ${lead ? `<p class="lead rv" style="--d:120ms">${lead}</p>` : ""}
      </div>
    </section>`;

  function afterRender(tab) {
    app.querySelectorAll(".contours").forEach((c) => F.reg(F.contours(c)));
    if (tab) setActiveTab(tab);
    observeReveals();
    toTop();
    initLenis();
  }

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
    F.cleanup();
    const p = POSTS.find((x) => x.slug === slug);
    if (!p) {
      app.innerHTML = `${tabHead("post-head", ["Edição não", "encontrada"], `<a class="back" href="#/">Voltar ao início</a>`)}`;
      afterRender(null);
      return;
    }
    document.title = `${p.titulo} | Tsuki`;
    const a1 = artFor(p.slug);
    const l = CONFIG.livro;
    const outros = sorted().filter((x) => x.slug !== slug).slice(0, 3);

    app.innerHTML = `
      <section class="tabhead post-head" id="post-head">
        <canvas class="contours" aria-hidden="true"></canvas>
        <div class="shell th-in">
          <h1 class="post-title io">${esc(p.titulo)}</h1>
          <p class="post-meta">${esc(p.categoria)}, ${fmtData(p.data)}, ${p.leitura} minutos de leitura</p>
          <a class="back" href="#/#lista">Todas as edições</a>
        </div>
      </section>
      <article class="shell post-grid">
        <div class="post-side">
          <dl class="side-list">
            <div><dt>Categoria</dt><dd>${esc(p.categoria)}</dd></div>
            <div><dt>Publicado em</dt><dd>${fmtData(p.data)}</dd></div>
            <div><dt>Leitura</dt><dd>${p.leitura} minutos</dd></div>
          </dl>
          <figure class="side-plate"><div class="plate-box">${img(a1)}</div><figcaption>${esc(a1.nome)}, ${esc(a1.autor)}</figcaption></figure>
        </div>
        <div>
          <p class="post-lede rv" style="--d:80ms">${esc(p.resumo)}</p>
          <div class="prose">${p.corpo.map((b, n) => bloco(b, n)).join("")}</div>
        </div>
      </article>

      <section class="shell post-end" aria-labelledby="h-cta-livro">
        <h2 class="h2 io" id="h-cta-livro">${L("Quer ir além?", "Leia o livro.")}</h2>
        <p class="lead rv" style="--d:100ms"><b>${esc(l.titulo)}</b> aprofunda este e outros temas, passo a passo.</p>
        <div class="cta-row rv" style="--d:160ms;margin-top:1.75rem">${cta("Conhecer o livro", { variant: "solid", tag: "a", href: "#/livro" })}</div>
      </section>

      ${friso(4, 5, 6)}

      <section class="sec" aria-labelledby="h-mais">
        <div class="shell">
          <h2 class="h2 io" id="h-mais" style="font-size:2rem">${L("Continue lendo")}</h2>
          <div class="bands rv" style="margin-top:1.5rem;--d:100ms">${outros.map(bandRow).join("")}</div>
        </div>
      </section>`;
    afterRender(null);
    setActiveTab("inicio");
    window.scrollTo(0, 0);
  }

  /* ---------- tema claro e escuro ---------- */
  const themeBtn = document.getElementById("theme-btn");
  const sistemaEscuro = matchMedia("(prefers-color-scheme: dark)");
  const guardado = () => { try { const t = localStorage.getItem("tsuki-tema"); return t === "dark" || t === "light" ? t : null; } catch (e) { return null; } };
  function aplicaTema(t) {
    html.setAttribute("data-theme", t);
    themeBtn.setAttribute("aria-label", t === "dark" ? "Ativar o modo claro" : "Ativar o modo escuro");
  }
  aplicaTema(html.getAttribute("data-theme") === "dark" ? "dark" : "light");
  themeBtn.addEventListener("click", () => {
    const t = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.classList.add("theme-anim");
    aplicaTema(t);
    try { localStorage.setItem("tsuki-tema", t); } catch (e) {}
    clearTimeout(themeBtn._anim);
    themeBtn._anim = setTimeout(() => html.classList.remove("theme-anim"), 500);
  });
  sistemaEscuro.addEventListener("change", (e) => { if (!guardado()) aplicaTema(e.matches ? "dark" : "light"); });

  /* ---------- menu em tela cheia e modal ---------- */
  const navmenu = document.getElementById("navmenu");
  const modal = document.getElementById("modal");
  const menuBtn = document.getElementById("menu-open");
  let lastFocus = null;
  const luaHoje = F.moonPhase();
  document.getElementById("menu-moon").textContent = luaHoje.nome + ", " + Math.round(luaHoje.illum * 100) + "%";

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
  footSocial.innerHTML = redes.map((r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(r.nome)} da Tsuki (abre em outra aba)">${ICONES[r.icone] || ""}${esc(r.nome)}</a></li>`).join("");
  footSocial.hidden = !redes.length;

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
        : "Ainda não há serviço de e-mail conectado, então nada foi enviado nem guardado. Quando o envio estiver ligado, esta janela vai confirmar a sua assinatura.";
      document.getElementById("modal-form-wrap").hidden = true;
      ok.hidden = false;
      ok.querySelector("button").focus();
    } catch (err) {
      msg.textContent = "Não deu para enviar agora. Tente de novo em instantes.";
    } finally {
      send.textContent = "Assinar grátis";
    }
  });

  /* ---------- abas: livro, founders e FAQ ---------- */
  function setActiveTab(tab) {
    document.querySelectorAll("[data-tab]").forEach((el) => {
      if (el.dataset.tab === tab) el.setAttribute("aria-current", "page"); else el.removeAttribute("aria-current");
    });
  }

  function renderLivro() {
    F.cleanup();
    const l = CONFIG.livro;
    document.title = l.titulo + " | Tsuki";
    app.innerHTML = `
      ${tabHead("livro-tab", ["O livro"], "Um livro sobre como a IA muda o jeito de aprender e de saber.")}
      <section class="tab-body" aria-labelledby="h-livro">
        <div class="shell">
          <div class="book-card rv">
            <div>
              <div class="cover" aria-hidden="true">${cruz("cover-cross")}<b>${esc(l.titulo)}</b></div>
              <p class="cover-note">Capa provisória, só para esta página.</p>
            </div>
            <div>
              <h2 class="book-h io" id="h-livro">${L(l.titulo)}</h2>
              <p class="lead rv" style="--d:100ms">${esc(l.subtitulo)}</p>
              <p class="book-p rv" style="--d:160ms">${esc(l.descricao)}</p>
              <h3 class="btopics-h rv" style="--d:220ms">O que o livro trata</h3>
              <ul class="btopics">${l.topicos.map((t, i) => `<li class="rv" style="--d:${260 + i * 70}ms">${esc(t)}</li>`).join("")}</ul>
              <div class="cta-row rv" style="--d:640ms">${cta(l.textoBotao, { variant: "light", attrs: "data-open-modal" })}</div>
            </div>
          </div>
          <div class="book-plate rv">${img(ARTS.dawn)}</div>
        </div>
      </section>
      ${friso(0, 1, 2)}`;
    afterRender("livro");
  }

  function fcard(f, i) {
    const foto = f.foto
      ? `<img src="${esc(f.foto)}" alt="Foto de ${esc(f.nome)}" width="${(f.fotoTam || [800, 1000])[0]}" height="${(f.fotoTam || [800, 1000])[1]}" loading="lazy">`
      : `<div class="fphoto-ph" aria-hidden="true"><span class="fphoto-ini">${esc(f.iniciais || "")}</span>${cruz()}</div>`;
    const lk = f.linkedin
      ? `<a class="flink" href="${esc(f.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de ${esc(f.nome)} (abre em outra aba)">LinkedIn ${I.up}</a>`
      : "";
    return `
      <article class="fcard rv" style="--d:${i * 100}ms">
        <div class="fphoto">${foto}${f.foto ? "" : '<span class="fbadge">Foto provisória</span>'}</div>
        <div class="fbody">
          <h2 class="fname">${esc(f.nome)}</h2>
          <div class="chips"><span class="chip">${esc(f.papel)}</span>${f.confirmado ? "" : '<span class="chip">Descrição provisória</span>'}</div>
          <div class="fmore" id="fm-${i}"><div class="fmore-in"><p>${esc(f.descricao)}</p></div></div>
          <div class="factions">
            <button class="fbtn" type="button" aria-expanded="false" aria-controls="fm-${i}"><span class="fbtn-t">Conhecer</span><span class="fbtn-i" aria-hidden="true"><b class="xs"></b></span></button>
            ${lk}
          </div>
        </div>
      </article>`;
  }

  function renderFaq() {
    F.cleanup();
    document.title = "Perguntas frequentes | Tsuki";
    const itens = CONFIG.faq || [];
    app.innerHTML = `
      ${tabHead("faq-tab", ["Perguntas", "frequentes"], "Respostas curtas sobre a newsletter e sobre o livro.")}
      <section class="shell tab-body" aria-label="Perguntas e respostas">
        <div class="faq-grid">
          <div class="faq-head">${sidePlate("cauldron", "4 / 3")}</div>
          <ul class="faq-list">
            ${itens.map((q, i) => `
              <li class="faq-item rv" style="--d:${i * 70}ms">
                <h2 class="faq-q"><button class="faq-btn" type="button" aria-expanded="false" aria-controls="faq-r-${i}" id="faq-b-${i}"><span>${esc(q.p)}</span><span class="faq-i" aria-hidden="true"><b class="xs"></b></span></button></h2>
                <div class="faq-a" id="faq-r-${i}" role="region" aria-labelledby="faq-b-${i}" inert><div class="faq-a-in">${q.r.map((t) => `<p>${esc(t)}</p>`).join("")}</div></div>
              </li>`).join("")}
          </ul>
        </div>
      </section>
      ${friso(3, 7, 8)}`;
    app.querySelectorAll(".faq-btn").forEach((b) =>
      b.addEventListener("click", () => {
        const item = b.closest(".faq-item");
        const aberto = item.classList.toggle("open");
        b.setAttribute("aria-expanded", String(aberto));
        item.querySelector(".faq-a").inert = !aberto;
      })
    );
    afterRender("faq");
  }

  function renderFounders() {
    F.cleanup();
    document.title = "Founders | Tsuki";
    const fs = CONFIG.founders || [];
    const hs = CONFIG.historia || { titulo: "", paragrafos: [] };
    app.innerHTML = `
      ${tabHead("founders-tab", ["Quem faz", "a Tsuki"], "As pessoas por trás da newsletter e do livro.")}
      <section class="shell tab-body" aria-label="Founders">
        <div class="fgrid">${fs.map(fcard).join("")}
          <aside class="fstory rv" style="--d:200ms" aria-labelledby="h-hist">
            ${brk()}
            <h2 class="fstory-h" id="h-hist">${esc(hs.titulo)}</h2>
            <div class="story">${(hs.paragrafos || []).map((t) => `<p>${esc(t)}</p>`).join("")}</div>
            <p class="note"><b>${esc(hs.provisorio || "")}</b></p>
            <div class="cta-row" style="margin-top:1.5rem">${cta("Assinar grátis", { variant: "solid", attrs: "data-open-modal" })}</div>
          </aside>
        </div>
      </section>
      ${friso(1, 4, 5)}`;
    app.querySelectorAll(".fbtn").forEach((b) =>
      b.addEventListener("click", () => {
        const card = b.closest(".fcard");
        const aberto = card.classList.toggle("open");
        b.setAttribute("aria-expanded", String(aberto));
        b.querySelector(".fbtn-t").textContent = aberto ? "Fechar" : "Conhecer";
      })
    );
    afterRender("founders");
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
    if (h === "faq") { if (!document.getElementById("faq-tab")) renderFaq(); else toTop(); return; }

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

  F.footer();
  // depois da abertura 000 a 100, a primeira aba que aparece é sempre a central
  if (html.classList.contains("intro") && /^#\/(livro|founders|faq|#livro)/.test(location.hash)) history.replaceState(null, "", "#/");
  runLoader();
  route();
})();
