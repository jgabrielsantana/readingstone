---
name: Tsuki
description: Newsletter sobre IA em papel branco, tinta sumi e selo vermelho, com a lua em três cores, cruz de Malta e um leão como mascote.
colors:
  washi: "#f5f5f3"
  washi-step-1: "#ebebe8"
  washi-step-2: "#dedcd6"
  sumi: "#0b0b0d"
  sumi-step-1: "#16161a"
  sumi-step-2: "#232329"
  shu: "#d7263d"
  shu-deep: "#b81d32"
  shu-soft: "#ff7a8a"
  ai: "#1f4e9c"
  matsu: "#2e7d5b"
  night-bg: "#0d0d10"
  night-fg: "#f1f1ee"
  night-accent: "#ee4258"
typography:
  display:
    fontFamily: "Shippori Mincho, Yu Mincho, Hiragino Mincho ProN, serif"
    fontSize: "9rem"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Shippori Mincho, Yu Mincho, serif"
    fontSize: "3.8194cqw"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Shippori Mincho, serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.2
  body:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1
rounded:
  none: "0"
  cut: "0.5rem"
spacing:
  shell: "88rem"
  gutter: "1.25rem"
  gutter-wide: "2rem"
components:
  cta-solid:
    backgroundColor: "{colors.sumi}"
    textColor: "{colors.shu-soft}"
    rounded: "{rounded.cut}"
    padding: "0.9375rem 1.5rem"
  cta-ghost:
    backgroundColor: "{colors.washi}"
    textColor: "{colors.shu-deep}"
    rounded: "{rounded.cut}"
    padding: "0.9375rem 1.5rem"
  cta-light:
    backgroundColor: "{colors.washi}"
    textColor: "{colors.sumi}"
    rounded: "{rounded.cut}"
    padding: "0.9375rem 1.5rem"
  panel-dark:
    backgroundColor: "{colors.sumi}"
    textColor: "{colors.washi}"
    rounded: "{rounded.cut}"
    padding: "2rem"
  row:
    backgroundColor: "{colors.washi-step-1}"
    textColor: "{colors.sumi}"
    padding: "2rem 1.5rem"
  tab:
    backgroundColor: "{colors.washi-step-1}"
    textColor: "{colors.sumi}"
    height: "3rem"
    padding: "0.5rem 1rem"
  tab-selected:
    backgroundColor: "{colors.sumi}"
    textColor: "{colors.washi}"
  tabbar-item:
    backgroundColor: "{colors.sumi}"
    textColor: "{colors.washi}"
    height: "2.75rem"
    padding: "0 1.25rem"
  input-field:
    backgroundColor: "{colors.washi-step-1}"
    textColor: "{colors.sumi}"
    padding: "0.9375rem 1rem"
  seal:
    backgroundColor: "{colors.shu}"
    textColor: "{colors.sumi}"
    padding: "0.3em 0.55em"
---

# Design System: Tsuki

## Overview

**Creative North Star: "A Lua em Três Tintas"**

Tsuki quer dizer lua em japonês. A página é uma estampa em papel branco com tinta sumi: a lua aparece preta sobre o papel, branca sobre o escuro e vermelha onde o cursor passa. O símbolo é a cruz de Malta de braços côncavos (cruz pattée) e a mascote é um leão heráldico rampante, em vermelho com garras e língua brancas. O vermelho é o selo (hanko): botões, marcas de data, o ponto final dos títulos. Azul (`ai`) e verde (`matsu`) entram como segunda e terceira cor de selo, girando com os temas.

A apresentação é uma pilha: hero, "quatro fases para ler a IA" (órbita com Leia, Cheque, Pergunte e Decida) e a linha do tempo da história da IA (da válvula ao ChatGPT) fixam no topo e a seguinte passa por cima, enquanto a coberta recua para 90% e escurece. Depois vêm blocos em fluxo normal e o rodapé, com borda vermelha e painel preto. Tudo é medido em rem; a raiz escala com a largura. Os blocos de pilha e o livro/rodapé usam `cqw` do próprio contêiner, então são o quadro de 1440 em qualquer largura.

**Key Characteristics:**
- Marca: cruz de Malta de braços côncavos e leão rampante (arquivo `assets/lion.svg`, CC0, cores por variáveis CSS).
- Papel `washi`, tinta `sumi`, vermelho `shu`. Painéis escuros são escuros nos dois temas; o modo escuro troca só papel, tinta e vermelho.
- Cantos retos e uma única forma recortada: o canto inferior direito cortado em diagonal (botões, painéis, placas). Colchetes de painel em quatro cantos.
- Estampas japonesas de domínio público (Yoshitoshi, Hiroshige, Koryusai) nas páginas internas e na demonstração; a linha do tempo da IA usa placas com recorte em degraus e desenhos feitos em código (válvula, transistor, perceptron, chip, tabuleiros, Transformer, chat).
- Contornos que rolam (curvas de nível) no fundo de hero, páginas internas, livro e rodapé; meia-tinta em forma de lua no bloco das fases.
- A lua de hoje é calculada de verdade (ciclo sinódico), com o lado aceso no hemisfério sul.
- Movimento: pilha com recuo, revelações por letra e por palavra, órbita de seis segundos, retículo xadrez no cursor, trilha vermelha da lua no hero, tudo parado com movimento reduzido.

## Colors

### Primary
- **Vermelho Selo** (`shu`, `#d7263d`): botões, selos de data, ponto final dos títulos, lua vermelha, juba do leão, cruz. Texto sobre papel usa `shu-deep` (`#b81d32`); sobre escuro usa `shu-soft` (`#ff7a8a`).

### Neutral
- **Washi** (`washi`, `#f5f5f3`) e dois degraus (`washi-step-1`, `washi-step-2`): fundo, linhas e abas, campos.
- **Sumi** (`sumi`, `#0b0b0d`) e dois degraus: tinta do texto, painéis escuros, lua preta, rodapé.
- **Modo escuro**: fundo `#0d0d10`, texto `#f1f1ee`, vermelho `#ee4258`, painéis `#000`. A lua preta do hero vira lua branca.

### Secondary
- **Azul Ai** (`ai`, `#1f4e9c`, suave `#7ba6f0`) e **Verde Matsu** (`matsu`, `#2e7d5b`, suave `#62d0a0`): detalhes. Os seis temas (Modelos, Pesquisas, Guias, Dicas, Pensamento crítico, Ética e segurança) giram entre vermelho, azul e verde (`.c0`, `.c1`, `.c2`): selos de data da linha do tempo, listra à esquerda das linhas de edição, fase da lua nos rótulos da órbita e no calendário. No hero, os três marcadores da meta usam vermelho, azul e verde.

### Named Rules
**The Seal Rule.** O vermelho é um selo, não um fundo de página: aparece em marcas, botões, a lua revelada e a borda do rodapé.

**The Three Moons Rule.** A lua tem três cores com papel fixo: preta no papel claro (branca no escuro), vermelha sob o cursor, branca nos painéis escuros.

## Typography

**Display e títulos:** Shippori Mincho 700 e 800 (woff2 local latin e latin-ext, licença SIL OFL), com Yu Mincho e Hiragino Mincho como fallback.
**Texto, rótulos e UI:** Onest 400 a 700 (woff2 local, SIL OFL).

**Character:** Mincho de contraste alto para os títulos, em caixa de frase e tracking levemente negativo; Onest para tudo que se lê e se clica, com rótulos em caixa alta a 1rem e sem tracking positivo. O kanji 月 aparece só como marca decorativa.

### Hierarchy
- **Display** (800, 5.5rem no celular, 7.5rem a partir de 640px, 9rem a partir de 1280px, 0.95): "Tsuki" no hero.
- **Headline** (800, `max(3.8194cqw, 2.75rem)`, 0.95): títulos da pilha e do rodapé; títulos de página interna 3.25 a 6rem.
- **Title** (800, 1.25 a 1.75rem): perguntas da FAQ, nomes de founders, cartões do calendário.
- **Body** (400, 1rem, 1.5; artigo 1.125rem com 1.65): texto corrido. Piso de leitura 16px.
- **Label** (500, 1rem, caixa alta, sem tracking): navegação, botões, metadados.

## Layout

Contêiner `shell` de 88rem com margem lateral de 1.25rem (2rem a partir de 640px). Pilha de três camadas fixas (`position: sticky`), depois blocos de 5rem de respiro (7rem a partir de 1024px). Abas por rota de hash (`#/`, `#/livro`, `#/founders`, `#/faq`) na navegação central (1280px ou mais), na fileira de abas do cabeçalho e na barra inferior do celular. No hero, os painéis de colchetes só aparecem a partir de 1280px; abaixo, a lua desce para sob o título.

## Elevation & Depth

Sem sombras e sem vidro. Profundidade é tonal (papel, degraus, painel escuro) e de empilhamento: a camada coberta escurece 55% e encolhe para 90%.

## Shapes

Cantos retos. A forma da marca é o corte diagonal de 0.5 a 2rem no canto inferior direito, feito com `clip-path`. Botões têm o contorno vermelho de 1px por uma segunda camada recortada e um preenchimento vermelho que cresce da esquerda em hover.

## Components

### Botões (`cta`)
- Corte de 0.5rem, texto 1rem 500 em caixa alta. **Solid:** fundo sumi, texto vermelho suave, contorno vermelho. **Ghost:** fundo do contexto, texto `shu-deep`. **Light:** fundo washi, texto sumi. Hover: preenchimento vermelho da esquerda (250ms) e seta anda 0.25rem; ativo `scale(0.97)`.

### Painéis de colchetes
- Quatro cantos de 0.625rem desenhados com um traço; abrem 5px em hover. Usados no hero (última edição, em números), no livro e na história dos founders.

### Placas da linha do tempo
- Desenho em código sobre uma placa com recorte em degraus (clip path e contorno), selo com o ano no canto (vermelho, azul ou verde), hover que recua a placa 5% e escurece as demais. Os eventos ficam em `HISTORIA`, em `posts.js`.

### Calendário de temas
- Faixa escura no pé do bloco do livro, com um cartão por tema (fase da lua, nome, contagem de edições), conectores tracejados que correm e o tema da última edição em vermelho.

### Sanfona (FAQ), cartões de founders, modal e menu
- Mesma linguagem: superfícies retas, cruz de Malta como botão de abrir, painéis escuros com canto cortado.

## Do's and Don'ts

### Do
- Usar o vermelho em marcas pequenas e na lua revelada; manter o fundo em washi ou sumi.
- Medir em rem ou cqw e manter texto corrido em 16px ou mais.
- Dar crédito às estampas no rodapé e em `assets/credits.json`.

### Don't
- Não usar sombras, vidro ou degradês em elementos de interface (o único degradê é interno ao canvas, no brilho da órbita).
- Não pôr texto sobre uma estampa sem fundo sólido (as datas usam o selo vermelho).
- Não inventar fatos de marca: a história do nome e a descrição do Mateus continuam marcadas como provisórias.
