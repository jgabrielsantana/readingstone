---
name: ReadingStone
description: Publicação sobre IA que ensina a ler a IA de perto, em prancha cianótipo.
colors:
  paper: "#f4f6fa"
  paper-step-1: "#e8ecf3"
  paper-step-2: "#dbe2ee"
  ink: "#22201d"
  ink-soft: "#4a505e"
  blue: "#1c3a6b"
  blue-deep: "#14264a"
  on-blue: "#f4f6fa"
  on-blue-soft: "#c4d0e5"
  night: "#22201d"
  night-step: "#33302c"
  on-night-soft: "#b9bcc6"
  brick: "#a8442a"
  brick-on-blue: "#e58a6e"
typography:
  display:
    fontFamily: "General Sans, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(3.2rem, 7vw, 8.5rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "General Sans, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.3rem + 3.2vw, 4rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  title:
    fontFamily: "General Sans, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.1rem + 1.3vw, 2.125rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "General Sans, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.35
  body:
    fontFamily: "General Sans, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "General Sans, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.97rem + 0.1vw, 1.0625rem)"
    fontWeight: 500
    lineHeight: 1.2
rounded:
  none: "0"
spacing:
  margin: "clamp(20px, 3vw, 40px)"
  section-gap: "clamp(88px, 11vw, 180px)"
  band-gap: "4px"
  xs: "8px"
  sm: "16px"
  md: "28px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.on-blue}"
    rounded: "{rounded.none}"
    padding: "0 28px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.blue-deep}"
  button-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 28px"
    height: "56px"
  button-paper-hover:
    backgroundColor: "{colors.paper-step-2}"
  tab:
    backgroundColor: "{colors.paper-step-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    height: "56px"
  tab-selected:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.on-blue}"
  band:
    backgroundColor: "{colors.paper-step-1}"
    textColor: "{colors.ink}"
    padding: "16px 20px"
    height: "92px"
  band-alt:
    backgroundColor: "{colors.paper-step-2}"
  band-hover:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.on-blue}"
  input-email:
    backgroundColor: "{colors.night-step}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "56px"
---

# Design System: ReadingStone

## Overview

**Creative North Star: "A Prancha Cianótipo"**

A página é uma prancha de herbário impressa em cianótipo: papel azulado, tinta quase preta, e campos inteiros de azul profundo onde as ilustrações de Anna Atkins (domínio público) se fundem num único tom. O sistema é plano e de ângulos retos. A hierarquia vem de degraus de tom e de escala tipográfica grande, nunca de filetes, sombras ou degradês. O tijolo existe apenas como detalhe minúsculo, como um carimbo.

A densidade é editorial e arejada: uma única margem lateral, grandes intervalos entre seções, texto em General Sans, único tipo da casa, em peso 700 apertado para títulos e 400/500 para leitura. A assinatura é a "pedra de leitura": uma lente circular que revela, sobre uma resposta de IA de exemplo, o trecho azul com o que precisa ser conferido.

**Key Characteristics:**
- Eixo de 42% (grade 5fr / 7fr): nota lateral à esquerda, conteúdo à direita.
- Campos de azul profundo em largura total (mastro, livro) com plates em `mix-blend-mode: luminosity`.
- Superfícies planas, cantos retos (0), sem bordas finas, sem sombras, sem gradientes.
- Tijolo só em marcas de 5 a 10 px e num sublinhado de destaque.
- Uma família tipográfica, sem serifa, sem mono.

## Colors

Paleta fixada pelo usuário: papel azulado, preto suave, azul profundo, tijolo mínimo.

### Primary
- **Azul Cianótipo** (`blue`): botões, aba selecionada, banda em hover, mastro, friso, página do livro, foco, seleção de texto, lente da pedra de leitura.
- **Azul Cianótipo Fundo** (`blue-deep`): somente hover do botão primário.

### Secondary
- **Tijolo** (`brick`): detalhes minúsculos: marcador quadrado de 10 px nas verificações, barra de 44 x 6 px na capa e 44 x 5 px sobre a frase em destaque, sublinhado de 4 px no trecho sinalizado. Sobre o azul, o trecho sinalizado usa `brick-on-blue` para manter leitura.

### Neutral
- **Papel Azulado** (`paper`): fundo da página, barra de topo, botão papel, capa do livro.
- **Papel Degrau 1 e 2** (`paper-step-1`, `paper-step-2`): abas e bandas; bandas pares alternam para o degrau 2, hover do botão papel usa o degrau 2.
- **Preto Suave** (`ink`): texto; `ink-soft` para notas laterais, datas, metadados e definições.
- **Noite** (`night`, `night-step`): fechamento e rodapé; campo de e-mail um degrau acima; `on-night-soft` para texto secundário. `on-blue` e `on-blue-soft` são o texto sobre azul.

### Named Rules
**The Brick Stamp Rule.** O tijolo nunca cobre uma área maior que uma marca de 44 x 6 px; nunca é fundo, botão ou texto corrido.

**The Tone Step Rule.** Separação entre faixas se faz trocando o tom (paper, step-1, step-2, blue, night), nunca com linha ou borda.

**The One Blue Rule.** Todo plate fotográfico é filtrado para o azul do campo por luminosity; nenhuma imagem aparece em cor própria.

## Typography

**Display Font:** General Sans (400, 500, 700, local woff2), com system-ui como fallback
**Body Font:** General Sans
**Label/Mono Font:** nenhum; General Sans 500

**Character:** Grotesca geométrica e firme. Títulos em 700 com tracking negativo e entrelinha quase colada; leitura em 400 com entrelinha confortável.

### Hierarchy
- **Display** (700, clamp(3.2rem, 7vw, 8.5rem), 0.92, -0.035em): título "Leia a IA de perto." em duas linhas; no fechamento reduz para clamp(3rem, 7.2vw, 6rem).
- **Headline** (700, clamp(2rem, 1.3rem + 3.2vw, 4rem), 0.98, -0.03em): títulos de seção; artigo usa clamp(1.625rem, 0.9rem + 2.5vw, 3rem).
- **Title** (700, clamp(1.5rem, 1.1rem + 1.3vw, 2.125rem), 1.15): frase em destaque do artigo e título da capa.
- **Lead** (400, clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem), 1.35): standfirst, lead, texto da lente (peso 500), wordmark (700).
- **Body** (400, clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem), 1.5; artigo 1.65, máx. 38rem): texto corrido.
- **Label** (500, clamp(1rem, 0.97rem + 0.1vw, 1.0625rem), 1.2): links de navegação, abas, metadados (datas com números tabulares), notas laterais (400, `ink-soft`, máx. 26ch).

### Named Rules
**The One Family Rule.** General Sans em tudo. Hierarquia se faz por peso (400/500/700) e escala, não por segunda família.

**The Sentence Case Rule.** Rótulos e títulos em caixa de frase, sem caixa alta e sem tracking positivo.

## Layout

Margem lateral única `margin` (clamp 20 a 40 px) para tudo. Intervalo entre seções `section-gap` (clamp 88 a 180 px). O eixo de 42%: `grid-template-columns: minmax(0,5fr) minmax(0,7fr)` com `column-gap` igual à margem; o lado esquerdo carrega nota lateral ou fica vazio, o direito carrega o conteúdo. O fechamento repete o mesmo 5fr/7fr. Abaixo de 860 px o eixo colapsa para uma coluna e a nota sobe para o topo. Abaixo de 720 px o mastro vira 2 colunas (a quarta célula some) e a definição ocupa a largura toda. A lista de edições usa abas fixas de 190 px (sticky, top 84 px) mais bandas; em telas estreitas as abas viram uma linha corrida transparente. Barra de topo fixa (sticky) em papel. Tamanhos de alvo: botões 56 px (44 px na versão pequena), abas 56 px (44 px em tela estreita).

## Elevation & Depth

Sem sombras e sem degradês. A profundidade é só tonal: papel, dois degraus de papel, azul, noite. Estados interativos mudam o tom (banda vira azul em hover/foco, botão escurece para `blue-deep`) e o pressionar encolhe levemente (scale 0.97 em botões e abas, 0.995 em bandas).

### Named Rules
**The Flat Plate Rule.** Nenhuma sombra, borda fina ou degradê em nenhuma superfície; separar com tom ou com espaço.

## Shapes

Ângulos retos em tudo (`border-radius: 0`). Marcadores são quadrados de 10 px; a barra de tijolo é um retângulo de 44 x 5 ou 6 px. Plates são cortados em retângulos (mosaico de 4 células, friso de 3, faixa 21/9, capa 3/4) com `object-fit: cover`. O único círculo é a lente da pedra de leitura (`clip-path: circle`, raio padrão 96 px). Destaque de texto é sublinhado grosso (2 px em links com offset 5 px; 4 px em trecho sinalizado), não caixa.

## Components

### Buttons
- **Shape:** retângulo reto, altura mínima 56 px, padding horizontal 28 px; versão pequena 44 px / 20 px.
- **Primary:** fundo azul, texto `on-blue`, General Sans 500. Hover para `blue-deep` (160 ms); ativo scale 0.97.
- **Paper:** papel com texto preto suave, usado sobre campos azuis; hover para `paper-step-2`.
- **Text link:** peso 500, sublinhado 2 px com offset 5 px; hover para azul.

### Tabs and Bands (lista de edições)
- Abas: `paper-step-1`, 56 px, texto à esquerda; selecionada em azul com `on-blue`; hover em `paper-step-2` (apenas ponteiro fino).
- Bandas: linhas de 92 px mínimo, grade 6.5rem / texto / meta, intervalo de 4 px entre elas, alternando `paper-step-1` e `paper-step-2`; hover e foco viram azul com texto secundário em `on-blue-soft`.

### Inputs / Fields
- Campo de e-mail sobre noite: fundo `night-step`, texto papel, placeholder `on-night-soft`, 56 px, reto, sem borda. Foco: contorno de 3 px (azul global; `on-blue` sobre campos escuros), offset 3 px.

### Mastro, friso e plates
- Mosaico de 4 células com altura clamp(200px, 30vh, 360px) sobre azul; uma célula é a definição de "pedra de leitura" em `on-blue`. Imagens em `mix-blend-mode: luminosity` com deriva lenta (escala 1 a 1.07, 26 a 32 s, desligada com movimento reduzido).

### Pedra de leitura (componente assinatura)
- Parágrafo de exemplo em lead 500; por cima, camada azul com o mesmo texto revelada por círculo que segue o ponteiro (220 ms ao entrar). O trecho sinalizado leva sublinhado tijolo (claro sobre azul). Versão estática sem lente para teclado e movimento reduzido. Abaixo, lista de verificações com marcador quadrado de tijolo.

### Capa do livro
- Retângulo 3:4 em papel sobre a página azul, título 700 e uma barra de tijolo de 44 x 6 px.

### Artigo
- Mastro de plate único (clamp 220 a 420 px) ou friso de três; prosa de 38rem, marcadores quadrados azuis de 10 px; frase em destaque 700 com barra de tijolo de 44 x 5 px acima.

## Do's and Don'ts

### Do:
- **Do** usar apenas os tokens de cor listados; texto sobre azul em `on-blue`, secundário em `on-blue-soft`.
- **Do** separar faixas por troca de tom e por espaço (`section-gap`, 4 px entre bandas).
- **Do** alinhar blocos de conteúdo ao eixo 5fr/7fr com a margem única.
- **Do** passar todo plate por `mix-blend-mode: luminosity` sobre fundo azul e creditar a proveniência.
- **Do** manter alvos de toque de 56 px (mínimo 44 px) e foco visível de 3 px.
- **Do** oferecer a versão estática da lente e reduzir movimento quando solicitado.

### Don't:
- **Don't** usar sombras, degradês, bordas finas, cantos arredondados ou segunda família tipográfica.
- **Don't** usar tijolo como fundo, botão ou texto corrido.
- **Don't** montar caixa de e-mail central sobre cartões iguais (o template de newsletter recusado pela tese).
- **Don't** exibir plate em cor original.
