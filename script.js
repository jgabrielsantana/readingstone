(function () {
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

  const sidePlate = (i, razao) => {
    const q = PLATES[i];
    return '<figure class="side-plate rv" style="--ratio:' + razao + '"><div class="plate-box"><img src="' + q.src + '" alt="' + esc(q.alt) + '" width="1600" height="2000" loading="lazy"></div><figcaption>' + esc(q.nome) + ', Anna Atkins</figcaption></figure>';
  };

  let filtro = "Todas";

  /* ---------- peças ---------- */
  function band(p) {
    return `
      <a class="band" href="#/post/${esc(p.slug)}">
        <span class="band-date">${fmtData(p.data)}</span>
        <span>
          <span class="band-title">${esc(p.titulo)}</span>
          <span class="band-note">${esc(p.resumo)}</span>
        </span>
        <span class="band-meta">${esc(p.categoria)} · ${p.leitura} min</span>
      </a>`;
  }

  function ctaBlock() {
    return `
      <section class="cta" id="assine" aria-labelledby="cta-h">
        <h2 class="display" id="cta-h">Leia de perto.<br>Pense melhor.</h2>
        <div>
          <div class="cta-row">
            <p>Receba a ReadingStone no seu e-mail. Sem spam, sem jargão.</p>
            <form class="form" id="form-news" novalidate>
              <label for="email" class="sr">Seu e-mail</label>
              <input id="email" type="email" name="email" placeholder="seu@email.com" autocomplete="email" required>
              <button class="btn btn-paper" type="submit">Assinar grátis</button>
            </form>
            <div class="form-msg" id="form-msg" role="status"></div>
          </div>
        </div>
      </section>`;
  }

  /* ---------- home ---------- */
  function renderHome() {
    document.title = "ReadingStone: leia a IA de perto";
    const l = CONFIG.livro;
    const dem = DEMO;

    const demoHtml = (flagged) =>
      dem.partes
        .map((x) => (x.m === undefined ? esc(x.t) : flagged ? `<span class="flag">${esc(x.t)}</span>` : esc(x.t)))
        .join("");

    app.innerHTML = `
      <section class="hero" aria-labelledby="h1">
        <div class="hero-art">
          <div class="hero-plate"><img src="${PLATES[0].src}" alt="${esc(PLATES[0].alt)}" width="1920" height="2477" fetchpriority="high"></div>
          <div class="hero-def">
            <p><strong>Pedra de leitura</strong>Lente de vidro ou cristal que, séculos atrás, ampliava as letras na página.</p>
          </div>
        </div>
        <div class="hero-copy">
          <h1 class="display" id="h1"><span class="ln"><span>Leia a IA</span></span><span class="ln"><span>de perto.</span></span></h1>
          <p class="standfirst rv" style="--i:3">Modelos, pesquisas e guias em linguagem simples. Entenda onde a IA acerta, onde erra e como usar sem abrir mão do seu raciocínio.</p>
          <div class="actions rv" style="--i:4">
            <a class="btn" href="#/#assine">Assinar grátis</a>
            <a class="textlink" href="#/#livro">Conhecer o livro</a>
          </div>
        </div>
      </section>

      <section class="sec axis" id="pedra" aria-labelledby="h-pedra">
        <div class="side has-plate">${sidePlate(1, "5 / 6")}</div>
        <div class="main">
          <h2 class="h2 rv" id="h-pedra">Passe a pedra sobre a resposta.</h2>
          <p class="lead rv" style="--i:1">Uma resposta fluente não é uma resposta conferida. A pedra mostra o que pedir de volta.</p>
          <div class="stone-wrap rv" style="--i:2">
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
      </section>

      <section class="sec" id="edicoes" aria-labelledby="h-ed">
        <div class="list-head"><h2 class="h2 rv" id="h-ed">Últimas edições</h2><p class="lead rv" style="--i:1">Textos de exemplo, até a primeira edição.</p></div>
        <div class="list">
          <div class="tabs rv" role="group" aria-label="Filtrar por categoria">
            ${["Todas", ...CATEGORIAS]
              .map((c) => `<button class="tab" type="button" data-cat="${esc(c)}" aria-pressed="${c === filtro}">${esc(c)}</button>`)
              .join("")}
          </div>
          <div class="bands rv" id="bands" style="--i:1"></div>
        </div>
      </section>

      <section class="sec axis" id="glossario" aria-labelledby="h-gl">
        <div class="side has-plate">${sidePlate(2, "5 / 6")}</div>
        <div class="main">
          <h2 class="h2 rv" id="h-gl">Glossário rápido</h2>
          <p class="lead rv" style="--i:1">Os termos que mais aparecem nas notícias sobre IA.</p>
          <dl class="gloss rv" style="--i:1;margin-top:clamp(24px,3vw,40px)">
            ${GLOSSARIO.map((g) => `<div><dt>${esc(g.termo)}</dt><dd>${esc(g.def)}</dd></div>`).join("")}
          </dl>
        </div>
      </section>

      <section class="sec axis" aria-labelledby="h-sobre">
        <dl class="side facts rv">
          <div><dt>Formato</dt><dd>Newsletter e site</dd></div>
          <div><dt>Idioma</dt><dd>Português do Brasil</dd></div>
          <div><dt>Foco</dt><dd>IA, estudo e pensamento crítico</dd></div>
        </dl>
        <div class="main">
          <h2 class="sr" id="h-sobre">Sobre a ReadingStone</h2>
          <p class="about-text rv">O nome vem da pedra de leitura, uma lente simples que ampliava as letras na página. A ReadingStone faz o mesmo com a inteligência artificial: aproxima o assunto, mostra o que há de sólido nele e deixa a decisão com quem lê.</p>
        </div>
      </section>

      <section class="book" id="livro" aria-labelledby="h-livro">
        <div class="axis">
          <div class="side rv">
            <div class="cover" aria-hidden="true"><i></i><b>${esc(l.titulo)}</b></div>
            <p class="cover-note">Capa provisória, só para esta página.</p>
          </div>
          <div class="main">
            <h2 class="h2 rv" id="h-livro">${esc(l.titulo)}</h2>
            <p class="lead rv" style="--i:1">${esc(l.subtitulo)}</p>
            <p class="rv" style="--i:2;margin-top:20px;max-width:40ch">${esc(l.descricao)}</p>
            <h3 class="topics-h rv" style="--i:3">O que o livro trata</h3>
            <ul class="topics rv" style="--i:3">${l.topicos.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
            <div class="actions rv" style="--i:4"><a class="btn btn-paper" href="${esc(l.link)}">${esc(l.textoBotao)}</a></div>
          </div>
        </div>
        <div style="padding-inline:var(--m)"><div class="book-plate rv"><img src="${PLATES[3].src}" alt="${esc(PLATES[3].alt)}" width="1920" height="2681" loading="lazy"></div></div>
      </section>

      ${ctaBlock()}`;

    const bands = document.getElementById("bands");
    const pintar = () => {
      const itens = sorted().filter((p) => filtro === "Todas" || p.categoria === filtro);
      bands.innerHTML = itens.length ? itens.map(band).join("") : `<p class="empty">Ainda não há edições nesta categoria.</p>`;
    };
    pintar();
    app.querySelectorAll(".tab").forEach((b) =>
      b.addEventListener("click", () => {
        filtro = b.dataset.cat;
        app.querySelectorAll(".tab").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        pintar();
      })
    );

    startHero();
    bindStone();
    bindForm();
    reveal();
  }

  /* ---------- a pedra ---------- */
  function bindStone() {
    const st = document.getElementById("stone");
    if (!st) return;
    if (!finePointer) {
      st.classList.add("static");
      st.removeAttribute("tabindex");
      return;
    }
    let timer;
    const move = (e) => {
      const r = st.getBoundingClientRect();
      st.style.setProperty("--x", e.clientX - r.left + "px");
      st.style.setProperty("--y", e.clientY - r.top + "px");
    };
    st.addEventListener("pointerenter", (e) => {
      move(e);
      st.classList.add("on");
      timer = setTimeout(() => st.classList.add("following"), 220);
    });
    st.addEventListener("pointermove", move);
    st.addEventListener("pointerleave", () => {
      clearTimeout(timer);
      st.classList.remove("following", "on");
    });
    // quem usa teclado vê o texto inteiro marcado
    st.addEventListener("focus", () => { st.style.setProperty("--r", "200vmax"); st.style.setProperty("--x", "50%"); st.style.setProperty("--y", "50%"); st.classList.add("on"); });
    st.addEventListener("blur", () => { st.style.removeProperty("--r"); st.classList.remove("on"); });
  }

  /* ---------- artigo ---------- */
  function bloco(b, n) {
    const a = ` class="rv" style="--i:${n % 3}"`;
    if (typeof b === "string") return `<p${a}>${esc(b)}</p>`;
    if (b.h) return `<h2${a}>${esc(b.h)}</h2>`;
    if (b.lista) return `<ul${a}>${b.lista.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
    if (b.destaque) return `<blockquote class="pull rv">${esc(b.destaque)}</blockquote>`;
    return "";
  }

  function renderPost(slug) {
    const p = POSTS.find((x) => x.slug === slug);
    if (!p) {
      app.innerHTML = `<div class="axis" style="padding-top:64px"><div class="side"></div><div class="main"><a class="back" href="#/">Voltar ao início</a><h1 class="post-title">Edição não encontrada</h1></div></div>`;
      return;
    }
    document.title = `${p.titulo} | ReadingStone`;
    const pl = plateFor(p.slug);
    const pl2 = PLATES[(PLATES.indexOf(pl) + 1) % PLATES.length];
    const l = CONFIG.livro;
    const outros = sorted().filter((x) => x.slug !== slug).slice(0, 3);

    app.innerHTML = `
      <div class="post-mast"><img src="${pl.src}" alt="${esc(pl.alt)}" width="1600" height="2000" fetchpriority="high"></div>
      <article class="axis post-head">
        <div class="side has-plate post-side">
          <a class="back" href="#/#edicoes">Todas as edições</a>
          <dl class="side-list">
            <div><dt>Categoria</dt><dd>${esc(p.categoria)}</dd></div>
            <div><dt>Publicado em</dt><dd>${fmtData(p.data)}</dd></div>
            <div><dt>Leitura</dt><dd>${p.leitura} minutos</dd></div>
          </dl>
          <figure class="side-plate" style="--ratio:4 / 3"><div class="plate-box"><img src="${pl2.src}" alt="${esc(pl2.alt)}" width="1600" height="2000" loading="lazy"></div><figcaption>${esc(pl2.nome)}, Anna Atkins</figcaption></figure>
        </div>
        <div class="main">
          <h1 class="post-title rv">${esc(p.titulo)}</h1>
          <p class="post-meta rv">${esc(p.categoria)}, ${fmtData(p.data)}, ${p.leitura} minutos de leitura</p>
          <p class="post-lede rv" style="--i:1">${esc(p.resumo)}</p>
          <div class="prose">${p.corpo.map((b, n) => bloco(b, n)).join("")}</div>
        </div>
      </article>

      <section class="sec axis" aria-labelledby="h-cta-livro">
        <div class="side"></div>
        <div class="main">
          <h2 class="h2 rv" id="h-cta-livro" style="font-size:var(--step-statement)">Quer ir além? Leia o livro.</h2>
          <p class="lead rv" style="--i:1"><em style="font-style:normal;font-weight:700">${esc(l.titulo)}</em> aprofunda este e outros temas, passo a passo.</p>
          <div class="actions rv" style="--i:2"><a class="btn" href="#/#livro">Conhecer o livro</a></div>
        </div>
      </section>

      <div class="frieze sec" aria-hidden="false">${[1, 2, 3].map((k) => { const q = PLATES[(PLATES.indexOf(pl) + k) % PLATES.length]; return `<div><img src="${q.src}" alt="${esc(q.alt)}" width="1600" height="2000" loading="lazy"></div>`; }).join("")}</div>

      <section class="sec" aria-labelledby="h-mais">
        <div class="more-head"><h2 class="h2 rv" id="h-mais" style="font-size:var(--step-statement)">Continue lendo</h2></div>
        <div class="list" style="grid-template-columns:1fr"><div class="bands rv" style="--i:1">${outros.map(band).join("")}</div></div>
      </section>

      <div class="sec">${ctaBlock()}</div>`;

    window.scrollTo(0, 0);
    bindForm();
    reveal();
  }

  /* ---------- formulário ---------- */
  function bindForm() {
    const form = document.getElementById("form-news");
    if (!form) return;
    const msg = document.getElementById("form-msg");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        msg.textContent = "Digite um e-mail válido, como nome@exemplo.com.";
        form.email.focus();
        return;
      }
      try {
        if (CONFIG.newsletterEndpoint) {
          const r = await fetch(CONFIG.newsletterEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ email })
          });
          if (!r.ok) throw new Error("falha");
        }
        msg.textContent = "Pronto. Seu e-mail está na lista.";
        form.reset();
      } catch {
        msg.textContent = "Não foi possível enviar agora. Tente de novo em instantes.";
      }
    });
  }

  /* ---------- movimento ---------- */
  function startHero() {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add("ready")));
  }

  function reveal() {
    const els = [...app.querySelectorAll(".rv")].filter((el) => !el.closest(".hero"));
    if (!("IntersectionObserver" in window) || reduce) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- roteador por hash ---------- */
  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    const m = h.match(/^post\/([\w-]+)/);
    if (m) return renderPost(m[1]);

    const ancora = h.startsWith("#") ? h.slice(1) : "";
    if (!document.getElementById("edicoes")) renderHome();
    if (ancora) {
      const el = document.getElementById(ancora);
      if (el) el.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }

  window.addEventListener("hashchange", route);
  route();
})();
