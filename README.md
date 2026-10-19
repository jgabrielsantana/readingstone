# ReadingStone

Site e newsletter sobre inteligência artificial, aprendizagem e pensamento crítico. Apresenta o livro *A Máquina Resolve?*.

Site estático em HTML, CSS e JavaScript, sem build. Para ver:

```bash
npx serve .
```

e abra o endereço mostrado.

## Conteúdo

As edições, o glossário, a demonstração da "pedra de leitura" e os dados do livro ficam em `posts.js`. Para publicar uma edição, adicione um item no topo de `POSTS`. Os textos atuais são exemplos.

## Fonte

O site usa a General Sans (Fontshare). Os arquivos da fonte não estão neste repositório por causa da licença. Baixe a família em <https://www.fontshare.com/fonts/general-sans> e coloque `general-sans-400.woff2`, `general-sans-500.woff2` e `general-sans-700.woff2` em `fonts/`. Sem eles, o site usa a fonte padrão do sistema.

## Imagens

Cianótipos de Anna Atkins, domínio público, via Wikimedia Commons. Créditos em `assets/credits.json` e no rodapé do site.

## Contexto de design

`PRODUCT.md` e `DESIGN.md` registram o produto e o sistema visual.
