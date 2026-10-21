# Tsuki

Site e newsletter sobre inteligência artificial, aprendizagem e pensamento crítico. Apresenta o livro *A Máquina Resolve?*. Tsuki quer dizer lua em japonês; o símbolo é a cruz de Malta e a mascote é um leão.

Site estático em HTML, CSS e JavaScript, sem build. Para ver:

```bash
npx serve .
```

e abra o endereço mostrado.

## Abas

O site tem quatro abas, em rotas por hash: `#/` (Início), `#/livro` (O livro), `#/founders` (Founders) e `#/faq` (Perguntas frequentes). As perguntas e respostas da FAQ ficam em `CONFIG.faq`. Os cartões e a história da aba Founders ficam em `posts.js` (`CONFIG.founders` e `CONFIG.historia`); a descrição do Mateus e a história do nome continuam provisórias. Para pular a abertura 000 a 100 ao testar, use `?intro=0`; para desligar a rolagem suave (Lenis) ao testar, `?lenis=0`.

## Arquivos

- `index.html`: casca da página, símbolos SVG (cruz de Malta e leão), cabeçalho, rodapé, menu e modal.
- `script.js`: páginas, rotas, tema claro e escuro, menu e formulário.
- `fx.js`: motores visuais (laço de animação único, pilha de seções, contornos, lua do hero, órbita com meia-tinta, linha do tempo, rodapé).
- `posts.js`: conteúdo (edições, glossário, livro, founders, FAQ).
- `styles.css`: todo o visual.

## Conteúdo

A linha do tempo da história da IA (`HISTORIA`), as edições, o glossário, a demonstração da "lua sobre a resposta" e os dados do livro ficam em `posts.js`. Para publicar uma edição, adicione um item no topo de `POSTS`. Os textos atuais são exemplos. A fase da lua mostrada no site é calculada no navegador, com o lado aceso do hemisfério sul.

## Fontes

Shippori Mincho (títulos) e Onest (texto), ambas com licença SIL OFL, hospedadas em `fonts/`.

## Imagens

Leão heráldico (CC0) de Rode raaf e Tom-L em `assets/lion.svg`, com as cores trocadas por variáveis CSS; a cruz de Malta (cruz pattée de lados côncavos) é desenhada no próprio `index.html`. Estampas japonesas em domínio público: Yoshitoshi (Cem aspectos da lua), Hiroshige e Koryusai, via Wikimedia Commons e Art Institute of Chicago. Créditos em `assets/credits.json` e no rodapé do site.

## Contexto de design

`PRODUCT.md` e `DESIGN.md` registram o produto e o sistema visual.
