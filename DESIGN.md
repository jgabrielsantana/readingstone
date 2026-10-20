---
name: ReadingStone
description: Publicação sobre IA que ensina a ler a IA de perto, em prancha cianótipo com pílulas e cartões de raio grande.
colors:
  paper: "#f4f6fa"
  paper-step-1: "#e8ecf3"
  paper-step-2: "#dbe2ee"
  ink: "#22201d"
  ink-soft: "#3f4655"
  blue: "#1c3a6b"
  blue-deep: "#14264a"
  on-blue: "#f4f6fa"
  on-blue-soft: "#c4d0e5"
  night: "#22201d"
  night-step: "#33302c"
  on-night-soft: "#b9bcc6"
  brick: "#a8442a"
  brick-on-dark: "#e58a6e"
typography:
  display:
    fontFamily: "Onest, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "6.5rem"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  pill: "9999px"
  card: "2rem"
  card-sm: "1.25rem"
  control: "0.9375rem"
spacing:
  shell: "88rem"
  gutter: "1.25rem"
  gutter-wide: "2rem"
  section: "5rem"
  section-wide: "7rem"
  gap-xs: "0.25rem"
  gap-sm: "0.75rem"
  gap-md: "1.5rem"
  gap-lg: "3rem"
components:
  button-dark:
    backgroundColor: "{colors.night}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0.9375rem 1.75rem"
  button-blue:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.on-blue}"
    rounded: "{rounded.pill}"
    padding: "0.9375rem 1.75rem"
  button-blue-hover:
    backgroundColor: "{colors.blue-deep}"
  button-light:
    backgroundColor: "{colors.paper-step-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.9375rem 1.75rem"
  button-light-hover:
    backgroundColor: "{colors.paper-step-2}"
  button-ghost:
    backgroundColor: "{colors.paper-step-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.9375rem 1.75rem"
  card-blue:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.on-blue}"
    rounded: "{rounded.card}"
    padding: "2rem"
  card-blue-hover:
    backgroundColor: "{colors.blue-deep}"
  row:
    backgroundColor: "{colors.paper-step-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card-sm}"
    padding: "2rem 1.5rem"
  row-hover:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.on-blue}"
  tab:
    backgroundColor: "{colors.paper-step-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1rem"
    height: "3rem"
  tab-selected:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.on-blue}"
  input-field:
    backgroundColor: "{colors.paper-step-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.9375rem 1rem"
  modal-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "2rem"
  hero-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card-sm}"
    padding: "0.5rem"
---

# Design System: ReadingStone

## Overview

**Creative North Star: "A Prancha Cianótipo"**

A página é uma prancha de herbário impressa em cianótipo: papel azulado, tinta quase preta e campos inteiros de azul profundo onde as pranchas de Anna Atkins (domínio público) se fundem num único tom. O sistema é plano e arredondado: pílulas para ações, cartões de raio grande para blocos de conteúdo, tudo em rem. A hierarquia vem de degraus de tom e de escala tipográfica grande, nunca de filetes, sombras, vidro ou degradês. O tijolo existe apenas como detalhe minúsculo, como um carimbo.

A densidade é arejada e de movimento vivo: título grande em duas linhas, revelações por linha e por palavra, cartões que sobem em hover. A raiz de fonte escala com a largura da janela (grade adaptativa), então toda medida em rem acompanha a tela. Onest é a única família. A assinatura do mundo são duas lentes sobre a mesma ideia: no topo, o cursor pinta uma segunda prancha sobre a primeira; no meio, a "pedra de leitura" revela, sobre uma resposta de IA de exemplo, o trecho azul com o que precisa ser conferido.

**Key Characteristics:**
- Raiz adaptativa: 16px acima de 1920px; abaixo, `max(0.8333vw, 15px)` até 1440px, `max(1.1111vw, 15px)` até 1024px, `max(1.5625vw, 16px)` até 640px, `clamp(15px, 4.4444vw, 19px)` no celular.
- Campos de azul profundo em cartões e faixas, com plates em `mix-blend-mode: luminosity` sobre o azul.
- Quatro raios: pílula, 2rem, 1.25rem e 0.9375rem. Sem sombras, degradês, vidro, filetes finos, eyebrows ou numeração.
- Véus são chapados (azul translúcido uniforme), nunca em degradê.
- Tijolo só em marcas de 0.3125 a 0.625rem, na barra da capa e da frase em destaque e no sublinhado do trecho sinalizado.

## Colors

Paleta fixada pelo usuário: papel azulado, preto suave, azul profundo, tijolo mínimo.

### Primary
- **Azul Cianótipo** (`blue`): cartões de edições, cartão do livro, painel de números, botão azul, aba selecionada, linha em hover, camada da lente, foco, seleção de texto, fundo dos plates e da barra de rolagem.
- **Azul Cianótipo Fundo** (`blue-deep`): fundo do hero atrás do plate, hover do botão azul e do cartão azul, véu do hero e da faixa do artigo (em rgba chapado).

### Secondary
- **Tijolo** (`brick`): detalhes minúsculos: marcador quadrado de 0.625rem nas verificações, barra de 2.75rem na capa e na frase em destaque, sublinhado de 0.25rem no trecho sinalizado. Sobre fundo escuro usa `brick-on-dark` (ícone da marca, preenchimento do loader, trecho sinalizado dentro da lente, selo do modal).

### Neutral
- **Papel Azulado** (`paper`): fundo da página, painel do modal, capa do livro, texto sobre azul (`on-blue`).
- **Papel Degrau 1 e 2** (`paper-step-1`, `paper-step-2`): botões claros, abas, linhas e bandas (pares alternam para o degrau 2), campos de formulário; hover e foco de campo sobem para o degrau 2.
- **Preto Suave** (`ink`): texto. `ink-soft` para notas, datas, metadados e definições.
- **Noite** (`night`, `night-step`): loader, menu em tela cheia, rodapé, botão escuro e ladrilho escuro; `on-night-soft` para texto secundário sobre noite; `on-blue-soft` para texto secundário sobre azul.

### Named Rules
**The Brick Stamp Rule.** O tijolo nunca cobre área maior que uma marca de 2.75rem por 0.3125rem; nunca é fundo, botão ou texto corrido.

**The Tone Step Rule.** Separação entre faixas se faz trocando o tom (paper, step-1, step-2, blue, night) e espaço, nunca com linha.

**The One Blue Rule.** Todo plate é filtrado para o azul do campo por luminosity; nenhuma imagem aparece em cor própria.

## Typography

**Display Font:** Onest (variável 400 a 700, woff2 local latin e latin-ext, licença SIL OFL), com system-ui como fallback
**Body Font:** Onest
**Label/Mono Font:** nenhum; Onest 500

**Character:** Grotesca humanista e firme. Títulos grandes com tracking negativo e entrelinha quase colada; leitura em 400/500 com entrelinha confortável. Os tamanhos abaixo são os de maior largura; todos escalam com a raiz.

### Hierarchy
- **Display** (700, 6.5rem em 1024px ou mais, 5rem a partir de 640px, 3.75rem abaixo, 0.96, -0.035em): título "Leia a IA de perto." em duas linhas. A marca d'água ReadingStone usa 700, 9.5rem (4.5rem em telas menores), branco a 10%.
- **Headline** (600, 3rem a partir de 640px, 2.25rem abaixo, 1.02, -0.03em): títulos de seção (`h2`). Rodapé 3.75rem; menu em tela cheia 4.25rem (2.75rem no celular).
- **Title** (500, 1.75rem nos cartões, 2.25rem no cartão largo, 1.15, -0.01em): título de cartão de edição; linhas de cobertura 2.25rem; título do artigo 700, 3.25rem, 1.04.
- **Lead** (400, 1.25rem, 1.4, máx. 36ch): apoio do hero (1.375rem a partir de 768px), standfirst; texto da lente e declaração 500 entre 1.375 e 2.125rem; lede do artigo 1.375rem.
- **Body** (400, 1rem, 1.5; artigo 1.125rem com 1.65, máx. 38rem): texto corrido.
- **Label** (500, 1rem, sem caixa alta): navegação, botões, abas, metadados (números tabulares), legendas (0.9375rem).

### Named Rules
**The One Family Rule.** Onest em tudo. Hierarquia por peso (400/500/600/700) e escala, não por segunda família.

**The Sentence Case Rule.** Rótulos e títulos em caixa de frase, sem caixa alta e sem tracking positivo. Piso de leitura de 1rem (0.9375rem só em legendas).

## Layout

Contêiner `shell` de 88rem com margem lateral de 1.25rem (2rem a partir de 640px). Seções com 5rem de respiro vertical (7rem a partir de 1024px). Pares de conteúdo usam 5fr/7fr (sobre, pedra de leitura, livro, artigo), com nota ou plate sticky à esquerda; o hero usa 12 colunas, 7 para o texto e 5 para o cartão e os temas. Abaixo de 1024px tudo vira coluna única, a navegação some em favor do botão Menu, plate e lista lateral do artigo são ocultados. A lista de edições usa abas de 13rem (sticky) e linhas com data de 6.5rem, texto e meta; abaixo de 860px as abas viram linha corrida. O primeiro cartão de edição ocupa a largura toda a partir de 768px. Estatísticas em 4 colunas (2 abaixo de 1024px). Intervalos recorrentes: 0.25rem entre linhas empilhadas, 0.75rem e 1.5rem entre blocos, 3rem entre grandes grupos. O friso de três plates sangra até as bordas com cantos arredondados só nas pontas internas.

## Elevation & Depth

Sem sombras, sem vidro e sem degradês. A profundidade é tonal: papel, dois degraus de papel, azul, noite. Estados mudam o tom (cartão vira `blue-deep`, linha vira azul, botão azul escurece) e o movimento: cartões sobem 0.5rem e crescem 1.2% em hover, pílulas crescem 3% e o selo desliza na diagonal, o pressionar encolhe (scale 0.97 a 0.995). Véus sobre imagem são camadas planas de azul translúcido. Hover só existe com ponteiro fino. Movimento reduzido desliga transições e animações.

### Named Rules
**The Flat Plate Rule.** Nenhuma sombra, vidro, filete ou degradê; separar com tom, véu chapado ou espaço.

## Shapes

Raio grande e consistente: pílula (`9999px`) para botões, selos, chips, ladrilhos da faixa e trilhas; `2rem` para cartões de edição, cartão do livro, painel de números, modal, plate do livro, cantos do hero, do loader e do rodapé; `1.25rem` para cartão do hero, plates, linhas, bandas e a lente; `0.9375rem` para controles (botão Menu, relógio, abas, campos, tile e painel do cartão do hero, plate pequeno nos cartões). A capa do livro tem lombada de `0.5rem` e canto externo de `1.25rem`. Marcadores quadrados de 0.625rem com `0.125rem` de raio. A lente é `clip-path: circle` (raio padrão 6rem) sobre o parágrafo. Plates são recortados com `object-fit: cover` (faixa 21/9, friso de 3, plate lateral sticky). Destaque de texto é sublinhado grosso (0.25rem tijolo no trecho sinalizado, 0.125rem em links), não caixa.

## Components

### Buttons
- **Shape:** pílula (`9999px`), padding 0.9375rem 1.75rem, Onest 500. A variante com seta tem padding 0.375rem 0.375rem 0.375rem 1.5rem e um selo circular de 2.25rem que desliza 0.125rem na diagonal em hover.
- **Dark:** fundo noite, texto branco, selo branco. **Blue:** fundo azul, texto `on-blue`, selo `on-blue`; hover para `blue-deep`. **Light:** fundo `paper-step-1`, selo noite; hover `paper-step-2`. **Ghost:** igual ao light sobre papel; sobre azul (`on-dark`) vira `on-blue` a 16%, hover 28%, selo `on-blue`.
- **Hover / Focus:** crescer 3% (240ms), ativo scale 0.97. Foco: contorno de 0.1875rem azul (`on-blue` sobre hero, menu, rodapé, números, livro, cartões e faixa do artigo).

### Cartões de edição
- Cartão azul, raio 2rem, padding 1.5rem (2rem), altura mínima 22rem (26rem). Meta no topo, selo circular de 2.75rem, plate de raio 0.9375rem em luminosity, título 500 e descrição de duas linhas em `on-blue-soft`, chips em pílula com `on-blue` a 14%. Em hover vira `blue-deep` e o selo gira 45 graus.

### Hero e cartão carrossel
- Plate em tela cheia sobre azul, véu chapado azul a 55%, canvas de revelação líquida por cursor também em luminosity, marca d'água ReadingStone, barra inferior em azul a 70%. O cartão do hero (papel a 94%, raio 1.25rem, 21rem) tem ladrilho noite com ícone e painel `paper-step-1` com legenda, título de até três linhas, pontos (o ativo alarga para 1rem em azul) e dois botões circulares branco. Troca texto com saída para cima e entrada por baixo. Grade de temas em duas colunas à direita.

### Linhas, abas e bandas
- Linhas de cobertura: raio 1.25rem, `paper-step-1` alternando `paper-step-2`, título 1.5 a 2.25rem; hover vira azul, ganha recuo e desliza o selo. Abas: raio 0.9375rem, 3rem; selecionada azul. Bandas de edição: grade 6.5rem / texto / meta, hover e foco azul com texto secundário `on-blue-soft`.

### Faixa de quatro ladrilhos
- Pílulas grandes (6rem, 10rem a partir de 640px): claro, azul, escuro com seta e fantasma, em sequência Leia, Cheque, seta, Pense.

### Pedra de leitura (componente assinatura)
- Parágrafo de exemplo em 500; por cima, camada azul com o mesmo texto revelada por círculo que segue o ponteiro (220ms ao entrar, sem transição enquanto segue). Trecho sinalizado leva sublinhado tijolo (`brick-on-dark` dentro da lente). Em toque e movimento reduzido há versão estática, sem lente. Abaixo, lista de verificações com marcador quadrado de tijolo. A lente é demonstração rotulada como exemplo fictício.

### Números
- Painel azul de raio 2rem; quatro contagens (3 a 4.5rem, 600, numerais tabulares) que sobem ao rolar, calculadas a partir do conteúdo real do site, com rótulos em `on-blue-soft`.

### Livro
- Cartão azul de raio 2rem com capa 3:4 em papel (lombada 0.5rem), título 700 e barra de tijolo de 2.75rem; marcadores quadrados `on-blue`; faixa 21/9 de plate em luminosity.

### Campos e modal de assinatura
- Campo: fundo `paper-step-1`, raio 0.9375rem, sem borda; foco sobe para o degrau 2 com contorno de 0.125rem azul. Rótulos 500 em `ink-soft`. Painel do modal em papel, raio 2rem, entra de baixo (celular alinhado ao rodapé); fundo escurecido por noite a 60%. Sem endpoint, o formulário opera em modo demonstração e diz isso. Mensagem de erro em tijolo; sucesso com selo circular noite e ícone `brick-on-dark`.

### Abertura e menu
- Loader noite com contagem 000 a 100 e trilha de pílula, exibido uma vez por sessão, sai deslizando para cima. Menu em tela cheia sobre noite com itens de 2.75 a 4.25rem que entram escalonados, botão de fechar de raio 0.9375rem.

### Artigo
- Faixa de plate com véu chapado e cantos inferiores de 2rem; título 700; prosa de 38rem em 1.125rem; marcadores quadrados azuis; frase em destaque 700 com barra de tijolo de 2.75rem acima.

## Do's and Don'ts

### Do:
- **Do** usar apenas os tokens de cor listados; texto sobre azul em `on-blue`, secundário em `on-blue-soft`; sobre noite, `on-night-soft`.
- **Do** dimensionar tudo em rem para que a raiz adaptativa governe a escala; manter 1rem como piso de texto corrido.
- **Do** escolher o raio entre pílula, 2rem, 1.25rem e 0.9375rem conforme a escala do elemento (ação, cartão, bloco, controle).
- **Do** separar faixas por troca de tom e espaço; véus sobre imagem são azul chapado a 55 a 70%.
- **Do** passar todo plate por `mix-blend-mode: luminosity` sobre fundo azul e creditar a proveniência.
- **Do** oferecer a lente estática em toque, teclado e movimento reduzido, e manter hover só para ponteiro fino.
- **Do** rotular a demonstração da lente e o formulário sem endpoint como demonstração.

### Don't:
- **Don't** usar sombras, degradês, vidro, filetes finos, eyebrows, caixa alta miúda ou numeração.
- **Don't** usar tijolo como fundo, botão ou texto corrido.
- **Don't** montar caixa de e-mail central sobre cartões iguais (o template de newsletter recusado pela tese).
- **Don't** exibir plate em cor original, nem inventar depoimentos, clientes, avaliações ou autoria.
- **Don't** usar segunda família tipográfica.
