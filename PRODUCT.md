# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pessoas que usam IA de forma casual para estudar, trabalhar ou conversar, e pessoas que estão começando a pesquisar o tema e querem se informar melhor. Universitários são o núcleo, por causa do livro, mas o site não exclui os demais. O público não é o da fronteira da IA, que já consome conteúdo especializado todo dia. Idioma: português do Brasil.

## Product Purpose

Tsuki é uma newsletter (formato revista/jornal) sobre inteligência artificial, atualizada com frequência: modelos, pesquisas em diferentes contextos, abordagens e recomendações. Também apresenta o produto principal da marca, o livro *A Máquina Resolve?*. Sucesso: o leitor volta, assina a newsletter e se interessa pelo livro.

## Positioning

Novidades de IA explicadas em linguagem simples e leitura crítica do que a IA faz com o aprender e o saber, com pesos iguais. O livro dá à marca uma base em epistemologia da IA que newsletters de notícias não têm.

## Operating Context

Conteúdo publicado por edição: o dono do site adiciona itens à lista `POSTS` em `posts.js` e o site se atualiza. Não há backend nem serviço de e-mail conectado por enquanto.

## Capabilities and Constraints

- Site estático em HTML, CSS e JavaScript, sem framework. Roteamento por hash (`#/post/slug`).
- Home em pilha de seções (hero com a lua, fases da leitura, linha do tempo das edições), seguida de edições filtráveis por categoria, glossário, bloco do livro e formulário de assinatura. Modo claro e escuro, que segue o sistema na primeira visita.
- O formulário de assinatura ainda não envia nada: o usuário não quer conectar serviço de e-mail por enquanto.
- Ainda não há link de compra do livro; o botão leva à assinatura da newsletter.
- Categorias atuais: Modelos, Pesquisas, Guias, Dicas, Pensamento crítico, Ética e segurança.
- Sem hospedagem definida.

## Brand Commitments

- Nome: Tsuki (lua, em japonês; antes ReadingStone). Símbolo: cruz de Malta (braços côncavos). Mascote: leão heráldico rampante. Livro: *A Máquina Resolve?*, subtítulo "Inteligência artificial, aprendizagem e pensamento crítico na universidade".
- Descrição do livro: como a IA afeta a construção do conhecimento e do pensamento crítico (epistemologia da IA). Temas: informação, crença justificada e compreensão; como um modelo de linguagem funciona, sem matemática; "papagaio estocástico"; alucinação; IA como testemunha e autoridade; descarregamento cognitivo; desempenho com IA contra aprendizagem sem IA; confiança excessiva e dependência epistêmica; matriz de delegação; o caso da engenharia.
- Vinculante pelo pedido do usuário (visual, 2026-10-21): branco, vermelho e preto como base, com detalhes em azul e verde; estética e arte japonesa; a lua e suas fases em branco, preto e vermelho. A pedra de leitura deixou de ser a identidade da marca.

## Evidence on Hand

- O livro existe; não há imagem de capa (a capa atual é desenhada em CSS).
- Os artigos em `posts.js` são exemplos escritos pelo assistente, sem fontes citadas. Não há autoria, nome de autor, depoimentos nem números de leitores. Não inventar nenhum deles.

## Product Principles

- Explicar sem jargão, sem tratar o leitor como leigo.
- Cobrir novidades e leitura crítica em igual medida.
- Dizer o que uma pesquisa mostra e o que não mostra, sempre com a fonte original.
- Atualizar com frequência e tornar fácil publicar uma nova edição.
- Apresentar o livro como continuação natural do conteúdo, não como anúncio solto.

## Accessibility & Inclusion

Nenhum padrão específico definido. Boas práticas básicas: contraste adequado, navegação por teclado, texto legível em celular.

## Open Decisions

- Autoria e assinatura dos textos.
- Hospedagem e domínio.
- Link de compra ou lista de espera do livro.
- Serviço de e-mail para a newsletter.
