/* ------------------------------------------------------------------ */
/*  Banco de santos + quiz devocional (Crisma)                         */
/* ------------------------------------------------------------------ */

export type PerfilLetra = "A" | "B" | "C" | "D" | "E";

export type Perfil = {
  letra: PerfilLetra;
  nome: string;
  tagline: string;
  descricao: string;
  cor: "habit" | "leaf" | "gold" | "sky" | "habit-deep";
  emoji: string;
};

export const PERFIS: Record<PerfilLetra, Perfil> = {
  A: {
    letra: "A",
    nome: "Conectado e do Cotidiano",
    tagline: "Santidade no mundo digital",
    descricao:
      "Você vive imerso no mundo das telas, das amizades modernas e da rotina comum — e Deus te chama a santificar exatamente esse chão.",
    cor: "sky",
    emoji: "💻",
  },
  B: {
    letra: "B",
    nome: "Radical e Aventureiro",
    tagline: "Coragem para grandes ideais",
    descricao:
      "Você não se contenta com a mornidão. Tem fome de ação, de aventura, de liderar e defender o que acredita.",
    cor: "habit-deep",
    emoji: "⛰️",
  },
  C: {
    letra: "C",
    nome: "Intelectual e Buscador da Verdade",
    tagline: "Fé que pensa, mente que reza",
    descricao:
      "Sua mente é inquieta. Você quer entender, debater, conhecer a fundo — e Deus te quer santo também nos livros.",
    cor: "habit",
    emoji: "📚",
  },
  D: {
    letra: "D",
    nome: "Amor Simples e Cura Emocional",
    tagline: "Misericórdia que acolhe",
    descricao:
      "Você sente o coração dos outros. Sua santidade brota da empatia, da escuta e do desejo de aliviar a dor alheia.",
    cor: "leaf",
    emoji: "🕊️",
  },
  E: {
    letra: "E",
    nome: "Artista e Criativo",
    tagline: "A beleza que evangeliza",
    descricao:
      "Você foi feito para criar. A arte, a música e a beleza são, em você, caminhos privilegiados para falar de Deus.",
    cor: "gold",
    emoji: "🎨",
  },
};

export type Santo = {
  id: string;
  nome: string;
  perfil: PerfilLetra;
  intercessao: string;
  descricao: string;
  emoji: string;
};

export const SANTOS: Santo[] = [
  // A — Conectados e do Cotidiano
  { id: "carlo-acutis", nome: "Beato Carlo Acutis", perfil: "A", emoji: "💻",
    intercessao: "Uso saudável da internet, combate ao vício em telas e jogos.",
    descricao: "Gamer, programador e apaixonado pela Eucaristia — santidade entre cliques." },
  { id: "chiara-luce", nome: "Beata Chiara Luce Badano", perfil: "A", emoji: "🌅",
    intercessao: "Depressão, aceitação da dor e otimismo.",
    descricao: "Jovem comum (música, esportes, amigos) que enfrentou o câncer com alegria." },
  { id: "guido-schaffer", nome: "Venerável Guido Schäffer", perfil: "A", emoji: "🏄",
    intercessao: "Equilibrar hobbies e esportes com a vida de oração e profissão.",
    descricao: "Médico, seminarista e surfista brasileiro — Deus na prancha e no consultório." },
  { id: "sandra-sabattini", nome: "Beata Sandra Sabattini", perfil: "A", emoji: "💕",
    intercessao: "Relacionamentos e namoro santo, discernimento profissional.",
    descricao: "Universitária noiva que amava festas mas dedicava a vida aos mais pobres." },
  { id: "marcel-callo", nome: "Beato Marcel Callo", perfil: "A", emoji: "🛠️",
    intercessao: "Jovem trabalhador e liderança juvenil.",
    descricao: "Escoteiro operário, preso por evangelizar colegas de fábrica." },
  { id: "maria-goretti", nome: "Santa Maria Goretti", perfil: "A", emoji: "🌷",
    intercessao: "Pureza de coração, cura de abusos e virtude do perdão.",
    descricao: "Jovem que perdoou seu agressor no leito de morte." },
  { id: "domingos-savio", nome: "São Domingos Sávio", perfil: "A", emoji: "📿",
    intercessao: "Pureza, saúde mental na adolescência e amizades santas.",
    descricao: "Aluno de Dom Bosco que decidiu ser santo ainda menino." },
  { id: "albertina-berkenbrock", nome: "Beata Albertina Berkenbrock", perfil: "A", emoji: "🌼",
    intercessao: "Força contra as pressões morais do mundo.",
    descricao: "Jovem mártir brasileira da pureza, em Santa Catarina." },
  { id: "chiara-corbella", nome: "Serva de Deus Chiara Corbella Petrillo", perfil: "A", emoji: "🤱",
    intercessao: "Aceitação da vontade de Deus e paz interior.",
    descricao: "Jovem mãe moderna que enfrentou a doença com imensa paz." },
  { id: "benjamim-forcano", nome: "Beato Benjamim Forcano", perfil: "A", emoji: "😄",
    intercessao: "Superação da timidez na Igreja.",
    descricao: "Religioso jovem que usava a alegria para atrair outros jovens." },

  // B — Radicais, Aventureiros e Corajosos
  { id: "pier-giorgio", nome: "Beato Pier Giorgio Frassati", perfil: "B", emoji: "⛰️",
    intercessao: "Estudantes universitários e o desejo de viver grandes ideais.",
    descricao: "Alpinista, brincalhão, envolvido com política e caridade." },
  { id: "joana-darc", nome: "Santa Joana d’Arc", perfil: "B", emoji: "⚔️",
    intercessao: "Coragem diante de perseguições e bullying por causa da fé.",
    descricao: "Camponesa que liderou exércitos por obediência a Deus." },
  { id: "anchieta", nome: "São José de Anchieta", perfil: "B", emoji: "🌎",
    intercessao: "Disposição física, espírito missionário e criatividade.",
    descricao: "Caminhava quilômetros para evangelizar e defendia os indígenas no Brasil." },
  { id: "francisco-assis", nome: "São Francisco de Assis", perfil: "B", emoji: "🐺",
    intercessao: "Desapego ao consumismo e cuidado com a natureza.",
    descricao: "Deixou riqueza e status para viver a radicalidade do Evangelho." },
  { id: "sebastiao", nome: "São Sebastião", perfil: "B", emoji: "🏹",
    intercessao: "Coragem para se posicionar contra a correnteza do mundo.",
    descricao: "Soldado romano que não escondeu sua fé diante do imperador." },
  { id: "sao-jorge", nome: "São Jorge", perfil: "B", emoji: "🛡️",
    intercessao: "Força espiritual nas batalhas contra o pecado.",
    descricao: "Guerreiro da fé que enfrentou grandes provações." },
  { id: "kolbe", nome: "São Maximiliano Kolbe", perfil: "B", emoji: "⛓️",
    intercessao: "Altruísmo e combate ao egoísmo.",
    descricao: "Deu a vida no lugar de um pai de família num campo de concentração." },
  { id: "paulo-apostolo", nome: "São Paulo Apóstolo", perfil: "B", emoji: "✉️",
    intercessao: "Fervor apostólico e coragem para pregar.",
    descricao: "O maior missionário da Igreja, destemido e incansável." },
  { id: "tarcisio", nome: "São Tarcísio", perfil: "B", emoji: "🍞",
    intercessao: "Coroinhas, acólitos e respeito pelas coisas sagradas.",
    descricao: "Jovem acólito morto ao proteger a Eucaristia de profanadores." },
  { id: "luis-gonzaga", nome: "São Luís Gonzaga", perfil: "B", emoji: "👑",
    intercessao: "Escolha vocacional e pureza de intenções.",
    descricao: "Nobre que abriu mão da herança para cuidar de doentes na epidemia." },

  // C — Pensadores e Estudantes
  { id: "tomas-aquino", nome: "Santo Tomás de Aquino", perfil: "C", emoji: "📖",
    intercessao: "Dificuldades nos estudos, foco e exames escolares.",
    descricao: "Um dos maiores teólogos da história, de humildade profunda." },
  { id: "edith-stein", nome: "Santa Teresa Benedita da Cruz (Edith Stein)", perfil: "C", emoji: "🧠",
    intercessao: "Intelectuais, pessoas com dúvidas de fé e crises existenciais.",
    descricao: "Filósofa alemã que foi ateia antes de se converter." },
  { id: "agostinho", nome: "Santo Agostinho", perfil: "C", emoji: "🕯️",
    intercessao: "Conversão de hábitos ruins e clareza mental.",
    descricao: "Buscou a verdade em muitas filosofias antes de encontrar Deus." },
  { id: "john-newman", nome: "São John Henry Newman", perfil: "C", emoji: "🎓",
    intercessao: "Estudantes de história, teologia e apologética.",
    descricao: "Intelectual que buscou incansavelmente a verdade histórica da Igreja." },
  { id: "catarina-sena", nome: "Santa Catarina de Sena", perfil: "C", emoji: "🕊️",
    intercessao: "Sabedoria nas palavras e liderança feminina.",
    descricao: "Jovem sem estudos formais que aconselhava Papas com extrema sabedoria." },
  { id: "jeronimo", nome: "São Jerônimo", perfil: "C", emoji: "📜",
    intercessao: "Estudo das Escrituras e autocontrole do temperamento.",
    descricao: "Tradutor da Bíblia, focado e de temperamento forte." },
  { id: "dom-bosco", nome: "São João Bosco (Dom Bosco)", perfil: "C", emoji: "🎒",
    intercessao: "Educadores, estudantes e equilíbrio entre disciplina e diversão.",
    descricao: "Criador do sistema educativo dos jovens." },
  { id: "contardo-ferrini", nome: "Beato Contardo Ferrini", perfil: "C", emoji: "🔬",
    intercessao: "Conciliação entre ciência, faculdade e vida cristã.",
    descricao: "Professor universitário que mostrava ciência e fé caminhando juntas." },
  { id: "jose-cupertino", nome: "São José de Cupertino", perfil: "C", emoji: "📝",
    intercessao: "Ansiedade antes de exames e TDAH.",
    descricao: "Tinha dificuldades de aprendizado, mas passava nas provas por milagre." },
  { id: "hildegarda", nome: "Santa Hildegarda de Bingen", perfil: "C", emoji: "🎶",
    intercessao: "Criatividade, artes e ciências.",
    descricao: "Cientista, musicista, mística e escritora medieval." },

  // D — Amor Simples e Cura Emocional
  { id: "teresinha", nome: "Santa Teresinha do Menino Jesus", perfil: "D", emoji: "🌹",
    intercessao: "Ansiedade, baixa autoestima e sensação de incapacidade.",
    descricao: "Ensinou a Pequena Via de fazer coisas pequenas com muito amor." },
  { id: "dulce-pobres", nome: "Santa Dulce dos Pobres", perfil: "D", emoji: "🇧🇷",
    intercessao: "Voluntariado, empatia e compaixão.",
    descricao: "O Anjo Bom da Bahia, caridade pura em meio às dificuldades." },
  { id: "padre-pio", nome: "São Padre Pio de Pietrelcina", perfil: "D", emoji: "✋",
    intercessao: "Boa confissão, discernimento dos próprios erros e paz na alma.",
    descricao: "Conhecia os corações e passava horas confessando." },
  { id: "vicente-paulo", nome: "São Vicente de Paulo", perfil: "D", emoji: "🥖",
    intercessao: "Projetos sociais e combate à indiferença.",
    descricao: "Organizou a caridade de forma inteligente para salvar os pobres." },
  { id: "jp2", nome: "São João Paulo II", perfil: "D", emoji: "✝️",
    intercessao: "Encontrar o próprio propósito de vida e amor à Igreja.",
    descricao: "Criador da Jornada Mundial da Juventude, entendia o coração dos jovens." },
  { id: "teresa-calcuta", nome: "Santa Teresa de Calcutá", perfil: "D", emoji: "🤲",
    intercessao: "Superação da depressão espiritual (noite escura da alma).",
    descricao: "Serviu a Deus nos mais pobres entre os pobres com paciência." },
  { id: "martinho-porres", nome: "São Martinho de Porres", perfil: "D", emoji: "🧹",
    intercessao: "Combate ao preconceito e cura de feridas emocionais.",
    descricao: "Sofreu preconceito por sua cor; respondia com humildade e cura." },
  { id: "faustina", nome: "Santa Faustina Kowalska", perfil: "D", emoji: "🌈",
    intercessao: "Confiança em Deus e fé na misericórdia divina.",
    descricao: "Apóstola da Divina Misericórdia." },
  { id: "francisco-sales", nome: "São Francisco de Sales", perfil: "D", emoji: "🕊️",
    intercessao: "Paciência com os outros e controle da raiva.",
    descricao: "Conquistava as pessoas pela mansidão e doçura no trato." },
  { id: "rita-cassia", nome: "Santa Rita de Cássia", perfil: "D", emoji: "🌹",
    intercessao: "Ansiedade por problemas familiares e brigas em casa.",
    descricao: "Santa das causas impossíveis, reconciliava famílias brigadas." },

  // E — Artistas e Criativos
  { id: "fra-angelico", nome: "Beato Fra Angelico", perfil: "E", emoji: "🖼️",
    intercessao: "Designers, pintores e artistas visuais.",
    descricao: "Pintor renascentista que rezava antes de pintar suas obras." },
  { id: "genesio", nome: "São Genésio", perfil: "E", emoji: "🎭",
    intercessao: "Atores, teatro e o meio artístico/cultural.",
    descricao: "Ator que se converteu no palco enquanto encenava uma peça." },
  { id: "filipe-neri", nome: "São Filipe Néri", perfil: "E", emoji: "😂",
    intercessao: "Bom humor, saúde mental e músicos católicos.",
    descricao: "O santo da alegria, usava humor, teatro e música para evangelizar." },
  { id: "cecilia", nome: "Santa Cecília", perfil: "E", emoji: "🎵",
    intercessao: "Cantores, instrumentistas e bandas paroquiais.",
    descricao: "Padroeira dos músicos, louvava a Deus no fundo do coração." },
  { id: "lucas", nome: "São Lucas", perfil: "E", emoji: "📷",
    intercessao: "Estudantes da área da saúde e cineastas/fotógrafos.",
    descricao: "Médico e pintor, autor do Evangelho detalhista." },
  { id: "gabriel-dolorosa", nome: "São Gabriel da Virgem Dolorosa", perfil: "E", emoji: "💃",
    intercessao: "Alegria juvenil e desapego às aparências.",
    descricao: "Jovem elegante que gostava de dançar e se vestir bem antes do convento." },
  { id: "gianna", nome: "Santa Joana Beretta Molla", perfil: "E", emoji: "⛷️",
    intercessao: "Estudantes de medicina e valorização da vida.",
    descricao: "Médica e mãe, apaixonada por esqui e teatro." },
  { id: "joao-batista", nome: "São João Batista", perfil: "E", emoji: "🌊",
    intercessao: "Autenticidade e coragem de falar a verdade entre amigos.",
    descricao: "O precursor, voz que clama no deserto — autêntico e sem rodeios." },
  { id: "matias", nome: "São Matias", perfil: "E", emoji: "🔄",
    intercessao: "Jovens que precisam recomeçar após um grande fracasso.",
    descricao: "Escolhido para ocupar uma vaga aberta; santo da segunda chance." },
  { id: "sao-jose", nome: "São José", perfil: "E", emoji: "🪚",
    intercessao: "Primeiro emprego e proteção contra os perigos do mundo.",
    descricao: "Protetor silencioso e trabalhador honesto." },
];

export const SANTOS_POR_PERFIL: Record<PerfilLetra, Santo[]> = {
  A: SANTOS.filter((s) => s.perfil === "A"),
  B: SANTOS.filter((s) => s.perfil === "B"),
  C: SANTOS.filter((s) => s.perfil === "C"),
  D: SANTOS.filter((s) => s.perfil === "D"),
  E: SANTOS.filter((s) => s.perfil === "E"),
};

export function santoPorId(id: string | undefined | null): Santo | null {
  if (!id) return null;
  return SANTOS.find((s) => s.id === id) ?? null;
}

/* ------------------------------------------------------------------ */
/*  Quiz — 20 perguntas, alternativas A–E                              */
/* ------------------------------------------------------------------ */
export type QuizOpcao = { letra: PerfilLetra; texto: string };
export type QuizPergunta = { id: number; titulo: string; opcoes: QuizOpcao[] };

export const QUIZ: QuizPergunta[] = [
  { id: 1, titulo: "Quando você abre o celular, qual app gasta mais tempo?", opcoes: [
    { letra: "A", texto: "Redes sociais (Instagram, TikTok) ou jogos digitais." },
    { letra: "B", texto: "Mapas, treinos físicos ou organização de eventos." },
    { letra: "C", texto: "Notícias, podcasts de debate ou leitura." },
    { letra: "D", texto: "Mensagens para desabafar e apoiar os amigos." },
    { letra: "E", texto: "Edição de fotos/vídeos, música ou Pinterest." },
  ]},
  { id: 2, titulo: "Diante dos estudos ou trabalho, qual seu maior desafio?", opcoes: [
    { letra: "A", texto: "Manter o foco e não me distrair com notificações." },
    { letra: "B", texto: "Ter disposição física e paciência para a rotina pesada." },
    { letra: "C", texto: "Entender matérias complexas ou vencer a preguiça mental." },
    { letra: "D", texto: "Lidar com ansiedade, cobranças internas e medo de falhar." },
    { letra: "E", texto: "Ter novas ideias e manter a motivação para criar." },
  ]},
  { id: 3, titulo: "Se a Crisma fosse organizar uma ação no sábado, você preferiria:", opcoes: [
    { letra: "A", texto: "Cuidar das projeções, fotos ou divulgação digital." },
    { letra: "B", texto: "Ir pra rua carregar caixas, montar acampamentos, missões de impacto." },
    { letra: "C", texto: "Preparar o roteiro teórico, o estudo bíblico ou a formação." },
    { letra: "D", texto: "Visitar asilo, hospital ou preparar a comida para quem tem fome." },
    { letra: "E", texto: "Cuidar da música, do teatro ou da decoração do ambiente." },
  ]},
  { id: 4, titulo: "Qual situação mais te tira a paz no dia a dia?", opcoes: [
    { letra: "A", texto: "Ficar sem bateria ou perder tempo com futilidades online." },
    { letra: "B", texto: "Ver injustiças acontecendo e me sentir de mãos atadas." },
    { letra: "C", texto: "Não conseguir explicar o que sinto ou ter dúvidas sobre o futuro." },
    { letra: "D", texto: "Clima de briga em casa ou ver alguém sofrendo sozinho." },
    { letra: "E", texto: "Sentir que a rotina está chata, mecânica e sem cor." },
  ]},
  { id: 5, titulo: "Qual superpoder espiritual você escolheria?", opcoes: [
    { letra: "A", texto: "Pureza nos pensamentos e equilíbrio com a tecnologia." },
    { letra: "B", texto: "Coragem absoluta para enfrentar qualquer perigo." },
    { letra: "C", texto: "Sabedoria profunda para responder a qualquer questionamento." },
    { letra: "D", texto: "Empatia perfeita para curar feridas emocionais." },
    { letra: "E", texto: "Criatividade sem limites para evangelizar pela arte." },
  ]},
  { id: 6, titulo: "Ao pensar em Deus, qual imagem mais te conforta?", opcoes: [
    { letra: "A", texto: "Um amigo que caminha ao meu lado na rotina comum." },
    { letra: "B", texto: "Um Rei destemido que me convoca para lutar pelo bem." },
    { letra: "C", texto: "A Verdade Suprema que responde aos mistérios do universo." },
    { letra: "D", texto: "Um Pai amoroso que me acolhe quando desabo." },
    { letra: "E", texto: "O Artista Perfeito que desenhou cada detalhe da minha vida." },
  ]},
  { id: 7, titulo: "Na sua roda de amigos, você é visto como:", opcoes: [
    { letra: "A", texto: "O antenado em memes, tendências e tecnologia." },
    { letra: "B", texto: "O corajoso que lidera iniciativas e defende os outros." },
    { letra: "C", texto: "O inteligente, a quem pedem ajuda para entender as matérias." },
    { letra: "D", texto: "O ouvinte que sempre tem um conselho calmo." },
    { letra: "E", texto: "O criativo, fora da caixa — canta, dança ou desenha." },
  ]},
  { id: 8, titulo: "Ao perceber que cometeu um erro grave, você:", opcoes: [
    { letra: "A", texto: "Bloqueia o pensamento, desliga as telas e tenta recomeçar amanhã." },
    { letra: "B", texto: "Fica irritado consigo e busca uma forma imediata de consertar." },
    { letra: "C", texto: "Analisa logicamente o que te levou a falhar." },
    { letra: "D", texto: "Sente tristeza profunda e busca o colo da Confissão." },
    { letra: "E", texto: "Transforma a frustração em oração, música ou escrita." },
  ]},
  { id: 9, titulo: "Qual ambiente te recarrega mais rápido?", opcoes: [
    { letra: "A", texto: "Meu quarto, jogando ou assistindo algo relaxante." },
    { letra: "B", texto: "Topo de montanha, praia, quadra de esportes ou trilha." },
    { letra: "C", texto: "Biblioteca silenciosa ou espaço de estudos organizado." },
    { letra: "D", texto: "Abraço de quem amo ou conversa profunda à mesa." },
    { letra: "E", texto: "Show, teatro, museu ou estúdio de música/arte." },
  ]},
  { id: 10, titulo: "Diante de uma escolha difícil de futuro, você foca em:", opcoes: [
    { letra: "A", texto: "Algo que pague as contas e deixe tempo livre para viver." },
    { letra: "B", texto: "Ser líder de impacto e transformar realidades." },
    { letra: "C", texto: "Uma profissão que desafie a mente e exija estudo." },
    { letra: "D", texto: "Cuidar, curar ou aliviar o sofrimento das pessoas." },
    { letra: "E", texto: "Expressar autenticidade e criar projetos únicos." },
  ]},
  { id: 11, titulo: "Qual virtude pedir com urgência ao Espírito Santo?", opcoes: [
    { letra: "A", texto: "Temperança (autocontrole com prazeres e distrações)." },
    { letra: "B", texto: "Fortaleza (coragem para assumir a fé sem ceder)." },
    { letra: "C", texto: "Prudência (sabedoria para decisões e clareza mental)." },
    { letra: "D", texto: "Caridade (paciência e amor genuíno aos necessitados)." },
    { letra: "E", texto: "Alegria (manter o brilho e contagiar os outros)." },
  ]},
  { id: 12, titulo: "Se um amigo está em crise de ansiedade, você:", opcoes: [
    { letra: "A", texto: "Manda mensagens de apoio e vídeos legais para distrair." },
    { letra: "B", texto: "Chama pra sair, caminhar ou fazer esporte." },
    { letra: "C", texto: "Dá conselhos lógicos e ajuda a organizar os pensamentos." },
    { letra: "D", texto: "Vai pra escutar em silêncio, chorar junto e abraçar." },
    { letra: "E", texto: "Faz playlist, desenho ou carta para animá-lo." },
  ]},
  { id: 13, titulo: "O que mais te assusta no mundo atual?", opcoes: [
    { letra: "A", texto: "Superficialidade e vazio das aparências online." },
    { letra: "B", texto: "Covardia em defender o que é certo, perda de valores." },
    { letra: "C", texto: "Mentiras como verdades e falta de busca pelo conhecimento." },
    { letra: "D", texto: "Egoísmo, preconceito e falta de cuidado com os vulneráveis." },
    { letra: "E", texto: "Falta de beleza, pessimismo e perda da alegria de viver." },
  ]},
  { id: 14, titulo: "Complete: \"Eu quero ser santo porque...\"", opcoes: [
    { letra: "A", texto: "Quero mostrar que é possível ir pro Céu vivendo no mundo de hoje." },
    { letra: "B", texto: "Não aceito vida morna; quero gastar minha juventude por algo grande." },
    { letra: "C", texto: "Quero conhecer a Deus com a mente e o coração." },
    { letra: "D", texto: "Quero ser canal do amor de Deus para aliviar a dor do próximo." },
    { letra: "E", texto: "Quero que minha vida seja uma obra de arte que glorifique a Deus." },
  ]},
  { id: 15, titulo: "Ao rezar ou ler a Bíblia, o que mais te atrai?", opcoes: [
    { letra: "A", texto: "Orações rápidas para fazer no meio da rotina." },
    { letra: "B", texto: "Histórias de batalhas, conquistas e coragem dos profetas." },
    { letra: "C", texto: "Parábolas profundas e ensinamentos teológicos." },
    { letra: "D", texto: "Textos sobre amor, misericórdia e perdão de Deus." },
    { letra: "E", texto: "Salmos, cânticos e passagens cheias de poesia e simbolismo." },
  ]},
  { id: 16, titulo: "Se ganhasse um prêmio em dinheiro, o que faria primeiro?", opcoes: [
    { letra: "A", texto: "Compraria eletrônico de ponta ou investiria em projeto digital." },
    { letra: "B", texto: "Planejaria viagem de aventura ou acampamento radical." },
    { letra: "C", texto: "Compraria livros ou investiria em cursos e formação." },
    { letra: "D", texto: "Doaria parte ou ajudaria alguém da família." },
    { letra: "E", texto: "Compraria ingressos pra shows, instrumentos ou material artístico." },
  ]},
  { id: 17, titulo: "Se um professor critica abertamente a Igreja, você:", opcoes: [
    { letra: "A", texto: "Evita polêmica e reza discretamente por ele." },
    { letra: "B", texto: "Enfrenta na hora, defendendo a fé diante da turma." },
    { letra: "C", texto: "Pede a palavra e usa argumentos históricos e lógicos." },
    { letra: "D", texto: "Sente dor pelo deboche, mas conversa depois com mansidão." },
    { letra: "E", texto: "Usa ironia inteligente ou um projeto que mostre a beleza da fé." },
  ]},
  { id: 18, titulo: "Qual área da vida afetiva você mais quer entregar a Deus?", opcoes: [
    { letra: "A", texto: "Carências emocionais e busca por aprovação nas redes." },
    { letra: "B", texto: "Impulsos e força para um namoro casto e corajoso." },
    { letra: "C", texto: "Mente, para não me deixar levar por ideologias confusas." },
    { letra: "D", texto: "Mágoas passadas, rejeição e problemas familiares." },
    { letra: "E", texto: "Autoimagem, aceitando meu corpo e meu jeito como Deus criou." },
  ]},
  { id: 19, titulo: "Quem é Maria para você?", opcoes: [
    { letra: "A", texto: "A jovem corajosa que disse sim e entende a juventude." },
    { letra: "B", texto: "A Rainha dos Apóstolos que lidera a Igreja nas batalhas." },
    { letra: "C", texto: "A Sede da Sabedoria que me ajuda a entender os mistérios." },
    { letra: "D", texto: "A Mãe da Misericórdia que me acolhe sob seu manto." },
    { letra: "E", texto: "A Mulher vestida de sol, a mais bela de todas as criaturas." },
  ]},
  { id: 20, titulo: "Qual destino escolheria para as férias?", opcoes: [
    { letra: "A", texto: "Metrópole tecnológica como Tóquio ou Seul." },
    { letra: "B", texto: "Expedição de montanhismo no Peru ou surf no Nordeste." },
    { letra: "C", texto: "Tour cultural por universidades e catedrais da Europa." },
    { letra: "D", texto: "Missão humanitária na África ou no interior da Amazônia." },
    { letra: "E", texto: "Imersão artística na Itália, museus e concertos." },
  ]},
];

export function apurarPerfil(respostas: PerfilLetra[]): PerfilLetra {
  const contagem: Record<PerfilLetra, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  for (const r of respostas) contagem[r]++;
  let melhor: PerfilLetra = "A";
  let max = -1;
  (["A", "B", "C", "D", "E"] as PerfilLetra[]).forEach((l) => {
    if (contagem[l] > max) {
      max = contagem[l];
      melhor = l;
    }
  });
  return melhor;
}