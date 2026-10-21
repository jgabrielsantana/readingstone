# ReadingStone

Site e newsletter sobre inteligência artificial, aprendizagem e pensamento crítico. Apresenta o livro *A Máquina Resolve?*.

Site estático em HTML, CSS e JavaScript, sem build. Para ver:

```bash
npx serve .
```

e abra o endereço mostrado.

## Abas

O site tem quatro abas, em rotas por hash: `#/` (Início), `#/livro` (O livro), `#/founders` (Founders) e `#/faq` (Perguntas frequentes). As perguntas e respostas da FAQ ficam em `CONFIG.faq`. Os cartões e a história da aba Founders ficam em `posts.js` (`CONFIG.founders` e `CONFIG.historia`); fotos e descrições atuais são provisórias. Para pular a abertura 000 a 100 ao testar, use `?intro=0`.

## Conteúdo

As edições, o glossário, a demonstração da "pedra de leitura" e os dados do livro ficam em `posts.js`. Para publicar uma edição, adicione um item no topo de `POSTS`. Os textos atuais são exemplos.

## Fonte

O site usa a Onest (licença SIL OFL), hospedada em `fonts/`.

## Imagens

Cianótipos de Anna Atkins, domínio público, via Wikimedia Commons. Créditos em `assets/credits.json` e no rodapé do site.

## Contexto de design

`PRODUCT.md` e `DESIGN.md` registram o produto e o sistema visual.
