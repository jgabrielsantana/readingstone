/*
  ==========================================================
  CONTEÚDO DA READINGSTONE: edite aqui para atualizar o site
  ==========================================================
  Para publicar uma nova edição, adicione um objeto NO TOPO de POSTS.
  O site ordena por data, então a ordem no arquivo não importa.

  Blocos aceitos em "corpo":
    "texto simples"                  -> parágrafo
    { h: "Subtítulo" }               -> subtítulo
    { lista: ["item 1", "item 2"] }  -> lista
    { destaque: "frase em destaque" } -> citação/destaque

  ATENÇÃO: os artigos abaixo são EXEMPLOS de formato e tom.
  Substitua por conteúdo real, com datas e fontes verificadas.
*/

const CONFIG = {
  // Troque pelos dados reais do livro quando existirem.
  livro: {
    titulo: "A Máquina Resolve?",
    subtitulo: "Inteligência artificial, aprendizagem e pensamento crítico na universidade",
    descricao:
      "Um livro sobre como a IA afeta o processo de construção do conhecimento e do pensamento crítico. Uma introdução à epistemologia da IA para quem estuda, ensina e trabalha com ela.",
    topicos: [
      "Diferença entre informação, crença justificada e compreensão",
      "Como um modelo de linguagem funciona, sem matemática; compreensão contra “papagaio estocástico”; alucinação; a IA como testemunha e autoridade",
      "Descarregamento cognitivo; desempenho com IA contra aprendizagem sem IA; o que a pesquisa mostra",
      "Pensamento crítico, confiança excessiva e dependência epistêmica",
      "Estudar com IA: esforço, matriz de delegação e o caso da engenharia"
    ],
    link: "#/#assine", // ainda sem link de compra: leva para a assinatura da newsletter
    textoBotao: "Receber novidades do livro"
  },
  // Aba FAQ: perguntas e respostas. Cada "r" é um parágrafo da resposta.
  faq: [
    {
      p: "Para que serve a newsletter?",
      r: [
        "Para explicar inteligência artificial em linguagem simples: modelos, pesquisas, guias e dicas, e também a leitura crítica de como a IA muda o jeito de aprender e de saber.",
        "Ela é feita para quem usa IA no estudo, no trabalho ou na conversa e quer entender onde a IA acerta, onde erra e como usar sem abrir mão do próprio raciocínio."
      ]
    },
    {
      p: "O que o livro aborda?",
      r: [
        "A Máquina Resolve? trata de como a IA afeta a construção do conhecimento e do pensamento crítico. É uma introdução à epistemologia da IA.",
        "Entram a diferença entre informação, crença justificada e compreensão; como um modelo de linguagem funciona, sem matemática; alucinação; a IA como testemunha e autoridade; descarregamento cognitivo; confiança excessiva e dependência epistêmica; e como estudar com IA. A aba O livro tem a lista completa."
      ]
    },
    {
      p: "O livro é só para universitários?",
      r: [
        "O foco é a universidade, como diz o subtítulo, e é ali que o livro mais se aplica. Mas a descrição fala de quem estuda, ensina e trabalha com IA, e as ideias servem para qualquer pessoa que queira usar a IA com mais critério."
      ]
    },
    {
      p: "Por que assinar a newsletter?",
      r: [
        "Para acompanhar, no seu e-mail, explicações claras sobre IA, em linguagem simples. É um jeito de se manter informado sem precisar acompanhar todo dia o noticiário especializado.",
        "Hoje o formulário de assinatura ainda não está conectado a um serviço de e-mail, então ele funciona como demonstração e avisa isso quando você envia."
      ]
    },
    {
      p: "A ReadingStone fala de como usar a IA?",
      r: [
        "Sim. Há guias e dicas práticas: como escolher um assistente de IA, como fazer perguntas melhores, como conferir uma resposta, como estudar sem terceirizar o aprendizado e quais dados nunca colar no chat.",
        "Na aba Início, em Todas as edições, filtre por Guias e Dicas."
      ]
    },
    {
      p: "Qual o melhor modelo de IA?",
      r: [
        "Não existe um melhor para tudo. Os modelos mudam rápido e cada um vai melhor em certas tarefas, então qualquer ranking envelhece depressa.",
        "O caminho mais seguro é testar a mesma tarefa real em dois ou três assistentes, começar pelo plano gratuito, considerar onde você já trabalha e pensar em que dados vai colocar ali. A edição \"Como escolher um assistente de IA sem se perder\" detalha esse roteiro."
      ]
    }
  ],
  // Aba Founders. Fotos e descrições PROVISÓRIAS: troque quando tiver os textos e as fotos reais.
  // "foto" vazio = mostra o espaço provisório com as iniciais. "linkedin" vazio = o botão não aparece.
  // "confirmado: true" tira o aviso "Descrição provisória" do card.
  founders: [
    {
      nome: "João Gabriel Nunes Santana",
      iniciais: "JG",
      papel: "Cofundador",
      foto: "assets/joao-gabriel.jpg",
      fotoTam: [567, 423],
      linkedin: "",
      confirmado: true,
      descricao: "Graduando no ITA e medalhista olímpico, com interesse por Dados, Machine Learning, IA e Finanças. Cofundador da ReadingStone e autor, junto com Mateus, de A Máquina Resolve?"
    },
    {
      nome: "Mateus Costa Medeiros",
      iniciais: "MM",
      papel: "Cofundador",
      foto: "",
      linkedin: "",
      descricao: "Cofundador da ReadingStone. Descrição provisória: aqui entram a formação, os interesses e o que Mateus faz na newsletter e no livro."
    }
  ],
  historia: {
    titulo: "A história do jornal",
    provisorio: "Texto provisório: a história de como o projeto começou, com datas e pessoas, entra aqui.",
    paragrafos: [
      "A ReadingStone é uma newsletter e um site sobre inteligência artificial, aprendizagem e pensamento crítico, escritos para quem usa IA no estudo e no trabalho e quer entender o que ela faz.",
      "O nome vem da pedra de leitura, a lente que ampliava as letras na página. A ideia é a mesma: chegar perto da IA, mostrar o que há de sólido nela e deixar a decisão com quem lê.",
      "O livro A Máquina Resolve? continua essa conversa, com foco em como a IA muda o jeito de aprender e de saber."
    ]
  },
  // Redes sociais do rodapé. Só aparecem as que têm "url"; preencha a do LinkedIn e a do X quando existirem.
  redes: [
    { nome: "Instagram", url: "https://www.instagram.com/reading.stone/", icone: "instagram" },
    { nome: "LinkedIn", url: "", icone: "linkedin" },
    { nome: "X", url: "", icone: "x" }
  ],
  // Quando tiver um serviço de e-mail (Buttondown, Mailchimp, Substack...),
  // coloque aqui a URL de inscrição. Vazio = apenas simula o envio.
  newsletterEndpoint: ""
};

// Demonstração da "pedra de leitura" na home. É um texto inventado para o exemplo:
// cada trecho em "marcas" é uma afirmação que merece ser conferida.
const DEMO = {
  rotulo: "A resposta e o número foram inventados para esta demonstração; nenhum estudo citado existe.",
  partes: [
    { t: "Um " },
    { t: "estudo recente", m: 0 },
    { t: " mostra que " },
    { t: "87% dos universitários", m: 1 },
    { t: " aprendem mais com resumos feitos por IA. O trabalho saiu em " },
    { t: "uma revista conceituada", m: 2 },
    { t: "." }
  ],
  marcas: [
    { trecho: "estudo recente", nota: "Qual estudo? Peça o título e o link, e abra você mesmo." },
    { trecho: "87% dos universitários", nota: "De onde vem este número? Procure o texto original antes de repetir." },
    { trecho: "uma revista conceituada", nota: "Conceituada segundo quem? Confira o nome da revista e quem a avalia." }
  ]
};

const CATEGORIAS = ["Modelos", "Pesquisas", "Guias", "Dicas", "Pensamento crítico", "Ética e segurança"];

const POSTS = [
  {
    slug: "informacao-nao-e-compreensao",
    titulo: "Informação, crença justificada e compreensão",
    categoria: "Pensamento crítico",
    data: "2026-10-16",
    leitura: 6,
    resumo:
      "Receber uma resposta correta não é o mesmo que saber o porquê dela. Uma distinção antiga da filosofia ajuda a usar a IA com mais critério.",
    corpo: [
      "Quando um assistente de IA responde, é fácil sentir que você aprendeu algo. Mas aprender tem etapas diferentes, e a ferramenta só entrega bem a primeira.",
      { h: "Informação" },
      "É o dado ou a afirmação em si: “a capital da Austrália é Camberra”. Chega rápido e em qualquer formato.",
      { h: "Crença justificada" },
      "É acreditar numa afirmação por boas razões: você sabe de onde ela vem, por que a fonte merece confiança e o que a confirmaria ou derrubaria. Sem isso, você apenas repete.",
      { h: "Compreensão" },
      "É enxergar como as ideias se conectam: conseguir explicar com as próprias palavras, aplicar em um caso novo e perceber quando algo não bate.",
      { destaque: "A IA entrega informação em segundos. Justificação e compreensão continuam dando trabalho." },
      { h: "Um teste prático" },
      { lista: [
        "Você consegue explicar a resposta sem olhar a tela?",
        "Sabe dizer de onde ela veio e por que confiar?",
        "Consegue aplicá-la a um exemplo diferente?"
      ]},
      "Se a resposta a alguma delas for não, você tem informação, não conhecimento. Tudo bem, desde que você saiba disso."
    ]
  },
  {
    slug: "descarregamento-cognitivo",
    titulo: "Descarregamento cognitivo: quando delegar compensa",
    categoria: "Pensamento crítico",
    data: "2026-10-14",
    leitura: 5,
    resumo:
      "Delegar tarefas mentais não é errado. O problema é delegar justamente a parte que você precisava exercitar.",
    corpo: [
      "Usamos calculadora, agenda e GPS para poupar esforço mental, e isso é razoável. A IA amplia muito essa possibilidade, porque agora dá para delegar também escrever, resumir e argumentar.",
      { h: "A pergunta útil" },
      "Não é “posso usar IA para isso?”, e sim “o que eu perco se não fizer isso sozinho?”. Para um relatório rotineiro, quase nada. Para um trabalho cujo objetivo é aprender a argumentar, perde-se o próprio objetivo.",
      { h: "Uma matriz simples de delegação" },
      { lista: [
        "Tarefa que você já domina e é repetitiva: delegar tende a ser seguro",
        "Tarefa que você domina e é importante: delegar a primeira versão, revisar com atenção",
        "Tarefa que você está aprendendo: fazer sozinho primeiro, usar a IA para criticar",
        "Tarefa que você não domina e tem consequências sérias: pedir ajuda a quem entende, não só à IA"
      ]},
      "Esse tema é um dos eixos do livro A Máquina Resolve?, onde a matriz é detalhada com exemplos.",
      { h: "O que a pesquisa mostra" },
      "Os estudos sobre IA e aprendizagem ainda são recentes e variam em método e conclusão. Por isso, desconfie de manchetes que prometem um veredito simples e leia o estudo original antes de repassar."
    ]
  },
  {
    slug: "ia-como-testemunha",
    titulo: "A IA é fonte confiável? Pense em testemunha",
    categoria: "Pensamento crítico",
    data: "2026-10-10",
    leitura: 5,
    resumo:
      "Quase tudo o que sabemos vem do que outras pessoas nos contam. A IA entra nessa lista, mas com características próprias que pedem cuidado.",
    corpo: [
      "Você não verificou pessoalmente que a Terra gira em torno do Sol: confiou em livros, professores e especialistas. Isso é normal e necessário. A questão é em quem e em quê confiar.",
      { h: "O que faz uma testemunha merecer confiança" },
      { lista: [
        "Ela tem conhecimento sobre o assunto",
        "Tem motivos para dizer a verdade, ou pelo menos para não enganar",
        "Costuma acertar, e você consegue conferir isso",
        "Sabe dizer quando não sabe"
      ]},
      { h: "Onde a IA complica" },
      "Um assistente de IA soa seguro mesmo quando erra, não mostra de forma confiável o caminho que o levou à resposta e pode acertar muito num tema e falhar em outro quase igual. Isso torna a confiança difícil de calibrar.",
      { destaque: "Confiar na IA é razoável. Confiar sem nunca conferir é dependência." },
      "Um hábito simples: quanto mais a resposta importar, mais você pede fontes, compara com outra referência e testa a explicação contra o que já sabe."
    ]
  },
  {
    slug: "como-escolher-assistente-de-ia",
    titulo: "Como escolher um assistente de IA sem se perder",
    categoria: "Modelos",
    data: "2026-10-12",
    leitura: 6,
    destaque: true,
    resumo:
      "ChatGPT, Claude, Gemini, Copilot… todos parecem iguais de longe. Quatro perguntas simples ajudam a decidir qual faz sentido para você.",
    corpo: [
      "Quem começa a usar IA logo percebe que existem muitas opções, e todas prometem ser a melhor. A boa notícia: para o uso do dia a dia, você não precisa comparar tabelas técnicas. Precisa saber o que quer fazer.",
      { h: "1. O que você mais vai fazer?" },
      "Escrever e revisar textos, resumir documentos, tirar dúvidas de estudo, programar, analisar planilhas. Cada assistente tem pontos fortes diferentes, e eles mudam com frequência. Teste a mesma tarefa real em dois ou três e compare as respostas.",
      { h: "2. Quanto você aceita pagar?" },
      "A maioria tem versão gratuita com limites de uso e plano pago com modelos mais capazes. Comece pelo gratuito. Só pague quando bater no limite com frequência.",
      { h: "3. Onde você já trabalha?" },
      "Se vive no e-mail e nas planilhas de uma suíte específica, o assistente integrado a ela pode economizar muitos cliques, mesmo que não seja o “mais inteligente” em testes.",
      { h: "4. Quais dados você vai colocar lá?" },
      "Leia a política de privacidade e as configurações de uso de dados. Evite colar informações sensíveis (seus documentos pessoais, dados de clientes, senhas) em qualquer ferramenta.",
      { destaque: "O melhor assistente é o que você consegue usar bem, com regularidade, para o que realmente precisa." },
      "Recomendação da casa: escolha uma ferramenta, use por duas semanas em tarefas reais e só então reavalie. Trocar toda semana é a forma mais rápida de nunca aprender a usar nenhuma."
    ]
  },
  {
    slug: "o-que-e-alucinacao",
    titulo: "Por que a IA inventa coisas e como não cair nessa",
    categoria: "Guias",
    data: "2026-10-05",
    leitura: 5,
    resumo:
      "As chamadas alucinações não são um defeito raro: fazem parte de como esses sistemas funcionam. Entender isso muda como você confere respostas.",
    corpo: [
      "Modelos de linguagem geram texto prevendo, passo a passo, quais palavras fazem sentido em sequência. Eles são ótimos em soar convincentes. Isso não garante que o que dizem seja verdadeiro.",
      { h: "Onde o risco é maior" },
      { lista: [
        "Citações, números e datas muito específicos",
        "Referências, links e nomes de artigos científicos",
        "Assuntos recentes ou muito de nicho",
        "Perguntas em que a resposta “certa” é ‘não sei’"
      ]},
      { h: "Hábitos simples de checagem" },
      { lista: [
        "Peça as fontes e abra os links você mesmo",
        "Confirme dados importantes em uma segunda fonte confiável",
        "Prefira ferramentas que mostram de onde tiraram a informação",
        "Pergunte “quão certo você está?” E continue desconfiando"
      ]},
      "A regra prática: quanto maior a consequência de um erro, maior deve ser a sua checagem. Para um e-mail informal, vale confiar mais. Para saúde, dinheiro ou prazos legais, trate a resposta como ponto de partida."
    ]
  },
  {
    slug: "prompts-que-funcionam",
    titulo: "5 formas de melhorar suas perguntas à IA",
    categoria: "Dicas",
    data: "2026-09-28",
    leitura: 4,
    resumo:
      "Não existe fórmula secreta. Existem hábitos de comunicação clara que fazem as respostas ficarem muito melhores.",
    corpo: [
      "Escrever bem para uma IA se parece bastante com delegar uma tarefa a uma pessoa nova na equipe: quanto mais contexto, melhor o resultado.",
      { h: "1. Diga quem é o público" },
      "“Explique para um estudante do ensino médio” gera um texto bem diferente de “explique para um profissional de finanças”.",
      { h: "2. Diga o formato que quer" },
      "Lista, tabela, e-mail de três parágrafos, roteiro de dez minutos. Se você não pede, a IA escolhe por você.",
      { h: "3. Dê um exemplo" },
      "Cole um texto seu e peça “escreva neste estilo”. Exemplos valem mais que adjetivos.",
      { h: "4. Peça em etapas" },
      "Primeiro um esboço, depois o desenvolvimento, depois a revisão. Tarefas grandes de uma vez costumam sair genéricas.",
      { h: "5. Responda à resposta" },
      "Conversar é parte do método: “mais curto”, “mais informal”, “tire o terceiro ponto”. Refinar é mais rápido do que acertar de primeira."
    ]
  },
  {
    slug: "como-ler-uma-pesquisa-sobre-ia",
    titulo: "Como ler uma notícia sobre “nova pesquisa de IA”",
    categoria: "Pesquisas",
    data: "2026-09-21",
    leitura: 6,
    resumo:
      "Manchetes dizem que a IA “superou humanos” ou “vai substituir” profissões. Um roteiro de perguntas ajuda a separar descoberta de marketing.",
    corpo: [
      "Toda semana aparece um estudo que promete mudar tudo. Algumas pesquisas são mesmo importantes; outras são resultados pequenos, em condições muito específicas, ampliados pela manchete.",
      { h: "Perguntas antes de compartilhar" },
      { lista: [
        "Quem fez? Universidade, empresa que vende o produto, ou terceiros independentes?",
        "Foi revisado por outros pesquisadores ou é um relatório da própria empresa?",
        "O teste se parece com o seu uso real, ou era um exame artificial?",
        "Comparou com pessoas de verdade? Quantas, e com que experiência?",
        "A conclusão da notícia é a mesma que o estudo afirma?"
      ]},
      { destaque: "“Superou humanos em um teste” quase nunca significa “faz o trabalho de um humano”." },
      "Na ReadingStone, sempre que resumirmos uma pesquisa, vamos indicar a fonte original e dizer o que ela de fato mostra e o que não mostra."
    ]
  },
  {
    slug: "ia-no-estudo-sem-colar",
    titulo: "IA para estudar: aprender, não só entregar",
    categoria: "Guias",
    data: "2026-09-14",
    leitura: 5,
    resumo:
      "A mesma ferramenta pode te ensinar ou te deixar dependente. A diferença está em quem faz o esforço mental.",
    corpo: [
      "Pedir a resposta pronta resolve a tarefa de hoje, mas não constrói o conhecimento que você vai precisar na prova ou no trabalho.",
      { h: "Usos que ajudam a aprender" },
      { lista: [
        "Pedir explicações alternativas até algo fazer sentido",
        "Pedir que a IA faça perguntas para você (e só depois corrija)",
        "Resumir sua matéria e comparar com o seu resumo",
        "Pedir exemplos práticos de um conceito abstrato",
        "Revisar um texto seu apontando dúvidas, não reescrevendo tudo"
      ]},
      { h: "Um combinado simples" },
      "Tente primeiro sozinho por alguns minutos. Depois use a IA para destravar. No final, explique o conteúdo com suas palavras. Se não conseguir, ainda não aprendeu.",
      "Vale também conferir as regras da sua escola ou empresa sobre uso de IA, pois elas variam bastante."
    ]
  },
  {
    slug: "privacidade-basica-com-ia",
    titulo: "Privacidade com IA: o que nunca colar no chat",
    categoria: "Ética e segurança",
    data: "2026-09-07",
    leitura: 4,
    resumo:
      "Conversar com um assistente parece privado, mas seu texto passa por servidores de uma empresa. Cuidados básicos que todo mundo deveria ter.",
    corpo: [
      "O que você escreve em uma ferramenta de IA pode ser armazenado e, dependendo das configurações, usado para melhorar o serviço. Isso varia de produto para produto, por isso vale olhar as configurações.",
      { h: "Evite colar" },
      { lista: [
        "Senhas, chaves de acesso e códigos de verificação",
        "Documentos pessoais, dados bancários e de saúde",
        "Informações confidenciais de clientes ou da empresa",
        "Conversas privadas de outras pessoas"
      ]},
      { h: "O que fazer" },
      { lista: [
        "Procure nas configurações a opção de desativar o uso dos seus dados para treinamento",
        "Anonimize: troque nomes e números por “Pessoa A”, “R$ X”",
        "Use as ferramentas aprovadas pela sua empresa para tarefas de trabalho"
      ]},
      "Uma boa regra: se você não colocaria aquilo em um e-mail para um desconhecido, pense duas vezes antes de colar em um chat."
    ]
  }
];

const GLOSSARIO = [
  { termo: "Modelo", def: "O “cérebro” treinado por trás de um assistente. É ele que gera as respostas." },
  { termo: "Prompt", def: "A instrução ou pergunta que você escreve para a IA." },
  { termo: "Alucinação", def: "Quando a IA afirma algo falso com total confiança." },
  { termo: "Token", def: "Pedaço de texto (parte de palavra) que o modelo processa. Define limites de tamanho." },
  { termo: "Treinamento", def: "O processo em que o modelo aprende padrões a partir de enormes volumes de dados." },
  { termo: "Contexto", def: "Tudo o que o modelo “enxerga” na conversa atual: suas mensagens, arquivos colados etc." },
  { termo: "Epistemologia", def: "Área da filosofia que estuda o conhecimento: o que é saber algo e como justificamos o que sabemos." },
  { termo: "Descarregamento cognitivo", def: "Passar uma tarefa mental para uma ferramenta externa, como a IA, em vez de fazê-la por conta própria." },
  { termo: "Dependência epistêmica", def: "Depender de outra fonte para saber algo, sem conseguir avaliar se ela está certa." }
];
