# Prompts internos — Engenharia Reversa com IA

Fonte: https://materiais-aulas.vercel.app/engenharia-reversa (material do aluno V3,
estudo de caso ZapIA). Coletado em 2026-09-27.

Os 8 prompts abaixo estão **literais**, como publicados. A skill usa esses textos
como roteiro de cada fase. Os campos entre colchetes são preenchidos com os dados
do usuário antes de executar.

Regra de integridade do material: fato, inferência, hipótese e lacuna não são a
mesma coisa. O que não foi observado é marcado como lacuna. O objetivo é
construir uma solução própria, nunca copiar código, marca ou produto protegido.

Validação ao fim de toda etapa (texto do material): "Confirme que cada afirmação
possui uma fonte, print, documento ou marcação explícita de lacuna. Não transforme
inferência em fato. Compare o resultado com a tela observada antes de avançar."
Próximo passo: "Só avance depois de salvar o arquivo da etapa, conferir as
evidências e registrar o que ainda não foi possível observar."


---

## Etapa 01 · PREPARO

Entregável: `PREPARO.md`

````text
Você vai me ajudar no PREPARO antes de começar a engenharia reversa de produto.

MINHA DOR (o que eu conheço de perto e quero resolver): [descreva]
MINHAS REFERÊNCIAS (2 ou 3 produtos): [liste com URL]

Me entregue 4 coisas e salve em PREPARO.md:

1. DOCUMENTAÇÃO: pra cada referência, diga se existe docs, central de ajuda,
   blog e changelog (com os links). E o que a ausência disso revela.
2. RECLAMAÇÕES REAIS: procure avaliações e reclamações públicas de usuários
   de cada referência. Liste as 10 reclamações mais repetidas, cada uma com
   a fonte onde você encontrou.
3. A DOR CENTRAL: qual dor aparece mais nas reclamações? É a mesma que eu
   quero resolver? Seja direto se não for.
4. FUNÇÕES OBRIGATÓRIAS: com base na minha dor e nas reclamações, liste as
   funções que a minha versão obrigatoriamente precisa ter.

COMO FAZER: colete tudo o que der (fontes, links, números, telas, textos reais) e gere a partir do que coletou. Item por item, sem agrupar. O que não achou, marca como "não encontrado".

✅ O ARQUIVO PRECISA TER (o entregável):
- [ ] As 3 referências foram analisadas (documentação de cada uma)
- [ ] Tem 10 reclamações reais com fonte
- [ ] A dor central está identificada e comparada com a minha
- [ ] A lista de funções obrigatórias está pronta
````

---

## Etapa 02 · FASE 1: ESCOLHER O PRODUTO

Entregável: `FASE-1-ESCOLHA.md`

````text
Você é meu analista de produto. Vamos fazer engenharia reversa de um produto:
entender tudo que ele faz por fora, pra eu construir a MINHA versão por dentro,
com identidade própria e sem copiar código de ninguém.

PRODUTO ESCOLHIDO: [nome ou URL do produto]
MEU CONTEXTO: [o que eu vendo hoje / que mercado eu atendo / quanto tempo eu tenho]

FAÇA O DIAGNÓSTICO COMPLETO E SALVE EM: FASE-1-ESCOLHA.md

1. O QUE É E PRA QUEM (sem clichê, direto ao ponto)
2. OS 4 CRITÉRIOS DE VIABILIDADE, um por um, com nota de 0 a 10 e justificativa:
   a) Resolve uma dor que gente JÁ PAGA pra resolver?
   b) Tem parte pública acessível sem pagar?
   c) Dá pra reconstruir sem depender de dado ou API exclusiva deles?
   d) O mercado está vivo (concorrentes recentes, gente crescendo)?
3. QUEM PAGA E POR QUÊ: perfil do cliente, cargo, tamanho de negócio,
   que problema concreto ele resolve hoje com isso, o que ele usava antes.
4. CONCORRENTES: de 5 a 8, com nome, URL, posicionamento, faixa de preço,
   o diferencial anunciado e a reclamação mais comum dos usuários.
5. O BURACO DO MERCADO: o que nenhum deles atende bem?
6. VEREDITO HONESTO: vale ou não vale fazer. Se não valer, diga na minha cara
   e explique o que eu deveria escolher no lugar.

COMO FAZER: colete tudo o que der (fontes, links, números, telas, textos reais) e gere a partir do que coletou. Item por item, sem agrupar. O que não achou, marca como "não encontrado".

✅ O ARQUIVO PRECISA TER (o entregável):
- [ ] Os 4 critérios têm nota E justificativa
- [ ] Tem pelo menos 5 concorrentes com preço pesquisado
- [ ] Tem um veredito claro de seguir ou parar
- [ ] O arquivo está salvo, não só respondido no chat
````

---

## Etapa 03 · FASE 2: COLETAR POR NAVEGAÇÃO

Entregável: `FASE-2-COLETA.md`

````text
Agora vamos coletar a matéria-prima. Você vai NAVEGAR de verdade no produto,
por Chrome, e mapear TUDO. Não é pra me descrever de memória: é pra me trazer
o material, com print e com a medida.

PRODUTO: [URL]
BASE (se eu estiver reconstruindo a partir de um projeto aberto): [URL da base]
VOCÊ TEM ACESSO A: navegação em Chrome (abrir, clicar, rolar, preencher, printar)

MISSÃO: navegar no site inteiro, capturar cada tela E mapear cada processo,
campo e seleção. Salve em: FASE-2-COLETA.md

━━━ PARTE A · DESCOBRIR AS ROTAS ━━━

PASSO 1. Abra /robots.txt e /sitemap.xml dos dois lados (produto e base).
Liste TODOS os sitemaps filhos que aparecerem. É o mapa que o próprio produto
publica, então é o caminho mais curto: você não precisa adivinhar rota.

PASSO 2. Monte a tabela de rotas:
| # | rota | o que é | pública ou exige conta |

PASSO 3. Marque no menu, no rodapé e nos links internos as rotas que NÃO
aparecem no sitemap. Rota fora do sitemap costuma ser a mais interessante.

━━━ PARTE B · A RECEITA DE CAPTURA (siga a ordem, não pule) ━━━

Use navegador controlado por código (Playwright). NÃO use print de janela nem
captura de topo: página com animação ou carregamento preguiçoso sai com FAIXA
BRANCA no meio e com a altura errada.

Para CADA rota:
1. abra a página
2. espere a rede parar, mais 2 segundos de folga
3. role até o fim devagar, para disparar o que carrega ao aparecer
4. volte ao topo e espere o layout assentar
5. FORCE A VISIBILIDADE: todo elemento com opacity baixa, display none ou
   visibility hidden recebe opacity 1 e visibility visible. Animação que não
   disparou deixa a seção INVISÍVEL no print e você vai jurar que não existe
6. MEÇA a altura real da página
7. capture a página INTEIRA
8. CONFIRA: a altura do arquivo bate com a altura medida? Se não, refaça

REGRA DA ALTURA: página de marketing longa passa de 2.000 pixels. Se o teu
print deu 1.200 ou 2.400 numa página de produto, você pegou só a primeira dobra.
A altura é número medido ao lado do arquivo, nunca a frase "página longa".

Salve como prints/NN-nome-da-rota.png, numeração contínua.

━━━ PARTE C · MAPEAR O PROCESSO (o que quase ninguém faz) ━━━

Print mostra a tela. Processo mostra o produto. Para CADA processo que você
consegue alcançar sem conta (e com a conta de teste, se a fase 3 autorizar):

1. Liste o processo em passos, na ordem em que o usuário faz:
   "abrir X → escolher Y → preencher Z → confirmar"
2. Para CADA passo, registre:
   - todos os campos, com o LABEL EXATO copiado da tela
   - o tipo de cada campo (texto, número, data, seleção, upload, múltipla escolha)
   - o que é obrigatório e o que é opcional (o asterisco, o "opcional" escrito)
   - as opções disponíveis em cada seleção, listadas uma por uma
   - o que aparece quando o campo está errado (mensagem literal)
   - o que está pré-preenchido e o que vem vazio
   - o que acontece ao confirmar (mensagem, redirecionamento, e-mail)
3. Desenhe o fluxo em texto: quem faz o quê, em que ordem, e onde pode dar erro.

━━━ PARTE D · DOCUMENTAÇÃO E LIMITES ━━━

PASSO 1. Abra e leia: /docs, /api, /help, /pricing, /changelog, blog. Salve o
conteúdo de cada um em docs/ e diga no índice o que cada um revela.

PASSO 2. Da página de preços, extraia: cada plano, o preço, e o que cada plano
libera ou limita. Preço é feature map publicado pela própria empresa.

PASSO 3. Página que exigir conta, que der erro ou que não abrir NÃO é falha:
é ACHADO. Registre assim: "rota X, resultado Y, o que isso revela".
Não crie conta, não faça login, não contorne nada.

━━━ PARTE E · O ÍNDICE COM MEDIDA ━━━

Monte o índice com UMA LINHA POR PRINT:
| arquivo | largura | altura | rota | o que a tela mostra |

Print sem linha neste índice não conta. Arquivo sem a dimensão ao lado é o
defeito mais comum desta fase.

COMO FAZER: colete tudo o que der (fontes, links, números, telas, textos reais) e gere a partir do que coletou. Item por item, sem agrupar. O que não achou, marca como "não encontrado".

✅ O ARQUIVO PRECISA TER (o entregável):
- [ ] robots.txt e sitemap.xml lidos, com os sitemaps filhos listados
- [ ] Toda rota do sitemap visitada ou justificada
- [ ] Um print de tela inteira por rota, com largura e altura declaradas
- [ ] Nenhum arquivo com espaço ou caractere especial no nome
- [ ] Todo processo alcançável mapeado em passos, com campos e opções literais
- [ ] Cada seleção teve as opções listadas uma por uma
- [ ] Documentação pública baixada e catalogada
- [ ] Toda página que deu erro virou achado escrito
- [ ] A data da coleta está no arquivo
````

---

## Etapa 04 · FASE 3: LEVANTAR AS FUNÇÕES

Entregável: `FASE-3-FUNCOES.md`

````text
Agora vem a parte mais importante: você vai USAR o produto por dentro e mapear
cada função, testando de verdade. Não é pra olhar print: é pra clicar, testar,
quebrar, anotar.

PRODUTO: [URL]
ACESSO (use só se o produto exigir login pra ver as funções):
  usuário: [email de teste]
  senha: [senha do email de teste]
  Obs: é uma conta MINHA, criada pra isso. Não tente acessar conta de terceiros.

MISSÃO: navegar logado, testar cada função e documentar. Salve em: FASE-3-FUNCOES.md

PASSO 1. MAPA DE ROTAS INTERNAS
Liste TODAS as rotas internas que você acessou. Não importa se parece pouca coisa:
se existe no menu, no rodapé, na barra lateral ou em link escondido, entra na lista.

PASSO 2. FICHA POR FUNÇÃO (uma por função, sem agrupar)
Pra cada função que o produto tem, preencha:
- Nome da função (VERBO + OBJETO: "criar evento", nunca "tela de eventos")
- Onde fica (rota exata)
- O que ela faz, passo a passo do que você clicou
- Quais campos ela pede (todos, com o label exato da tela)
- O que acontece quando dá certo (mensagem, redirecionamento)
- O que acontece quando dá erro (teste um erro de propósito e registre a mensagem real)
- Estado vazio: como a tela aparece sem nenhum dado
- É NÚCLEO (sem ela o produto não existe) ou BÔNUS?
- Quanto trabalho dá pra construir: baixo, médio ou alto

PASSO 3. O TESTE DE ESTRESSE
Escolha 5 funções principais e teste o limite delas:
o que acontece com dado inválido, com campo vazio, com valor muito grande?
Registre o comportamento real de cada uma.

PASSO 4. FECHAMENTO
- Liste as 5 funções que fazem alguém PAGAR por esse produto
- Liste o que ficou sem testar e por quê (não pule essa parte)
- Conte: quantas funções você levantou no total

COMO FAZER: colete tudo o que der (fontes, links, números, telas, textos reais) e gere a partir do que coletou. Item por item, sem agrupar. O que não achou, marca como "não encontrado".

✅ O ARQUIVO PRECISA TER (o entregável):
- [ ] Toda função do mapa de rotas tem ficha própria
- [ ] Pelo menos 5 funções passaram pelo teste de estresse
- [ ] Todas as mensagens de erro são as reais, copiadas da tela
- [ ] Tem a contagem final e a lista do que ficou de fora
````

---

## Etapa 05 · FASE 4: LEVANTAR A INTERFACE

Entregável: `FASE-4-COMPONENTES.md`

````text
Agora você vai catalogar a interface em nível de construção: componentes,
estados, tokens medidos e os textos reais. Isso é o que permite REDESENHAR a
tela com identidade própria em vez de imitar aparência.

PRODUTO: [URL]  |  PRINTS: pasta prints/  |  Salve em: FASE-4-COMPONENTES.md

━━━ PARTE A · INVENTÁRIO DE COMPONENTES ━━━

Liste TODO componente que aparece no produto, um por linha:
| componente | onde aparece (telas) | o que faz | trabalho (baixo/médio/alto) |

Cubra: navegação, barra lateral, abas, tabelas, listas, cards, formulários,
botões, modais, menus suspensos, notificações, estados vazios, estados de erro,
paginação, busca, filtros, upload, calendário, gráficos, tooltips, breadcrumbs.

━━━ PARTE B · A MATRIZ DE ESTADOS (o que separa protótipo de produto) ━━━

Para CADA componente interativo, monte os QUATRO estados e escreva o que
aparece em cada um:
| componente | parado | trabalhando | pronto | erro |

Regras:
- "trabalhando": existe indicador? é spinner, skeleton ou texto? bloqueia clique?
- "pronto": tem confirmação? some sozinha ou fica? onde aparece a mensagem?
- "erro": qual a mensagem literal? aparece no campo, no topo, em toast ou modal?
- Desabilite o botão mentalmente: o que muda quando ele não pode ser clicado?
Liste também o ESTADO VAZIO de cada lista e tabela: o texto que aparece quando
não tem nenhum dado, e se tem botão de ação dentro do vazio.

━━━ PARTE C · OCR DOS PRINTS (texto literal, não paráfrase) ━━━

Rode leitura de texto em cada print e extraia, organizado por tela:
- todos os títulos e subtítulos
- todos os labels de campo, EXATAMENTE como estão escritos
- todos os textos de botão (inclusive os secundários e os de link)
- todas as mensagens de erro e de sucesso
- os textos dos estados vazios
- os placeholder de cada campo
- os textos de ajuda, tooltip e legenda
É o vocabulário real do produto. Não traduza, não corrija, não resuma.

━━━ PARTE D · ANATOMIA DE CADA TELA ━━━

Para cada tela, descreva em blocos numerados:
1. cabeçalho: o que fica fixo, qual o título, quais ações no topo
2. navegação: como se chega, como se volta, o que fica destacado
3. conteúdo principal: blocos, colunas, ordem de leitura, o que é dado e o que é ação
4. as ações possíveis: TODOS os botões e links, e o que cada um faz
5. o estado vazio, o de carregando e o de erro
6. o que é responsivo: o que some, o que empilha, o que vira menu

Escreva de um jeito que eu consiga reconstruir a tela SEM olhar o print.

━━━ PARTE E · OS TOKENS MEDIDOS ━━━

Não estime cor: MEÇA. Amostre o pixel dentro do elemento (botão, cartão, selo)
e escreva o código com a origem da amostra.

| token | valor medido | onde foi medido |
|---|---|---|
| cor de fundo | #...... | corpo da página |
| cor de superfície | #...... | cartão de plano |
| cor do texto principal | #...... | parágrafo do hero |
| cor do texto secundário | #...... | legenda do cartão |
| cor de acento | #...... | botão principal |
| cor de sucesso | #...... | confirmação |
| cor de erro | #...... | mensagem de erro |
| borda | #...... | divisória |

Depois:
- tipografia: famílias usadas, e a escala de tamanhos (título, subtítulo, corpo,
  legenda) com o tamanho aproximado em cada nível
- espaçamento: o grid e o ritmo (8, 12, 16, 24, 32) e o raio dos cantos
- sombras: existe? qual a direção e a intensidade
- o clima do produto em uma frase (sério, amigável, técnico, divertido)

⚠️ O QUE NÃO COPIAR: marca, logo, nome, identidade visual, ilustrações próprias
e os textos literais deles. Você copia a FUNÇÃO e a LÓGICA. A cara é sua.

━━━ PARTE F · ACESSIBILIDADE E DETALHES ━━━

- contraste: o texto sobre o fundo passa de leitura confortável?
- foco: dá pra ver onde o teclado está? o contorno aparece?
- o botão tem texto ou só ícone? o ícone tem rótulo?
- o formulário associa o label ao campo?
- tem atalho de teclado declarado?

━━━ PARTE G · FECHAMENTO ━━━

- o número total: "pra ter esse produto eu preciso construir X componentes"
- os 3 componentes mais caros, e por quê
- os componentes que parecem simples mas escondem regra de negócio
- os 4 estados que eu quase esqueceria de construir

COMO FAZER: colete tudo o que der (fontes, links, números, telas, textos reais) e gere a partir do que coletou. Item por item, sem agrupar. O que não achou, marca como "não encontrado".

✅ O ARQUIVO PRECISA TER (o entregável):
- [ ] O inventário cobre todas as telas coletadas na fase 2
- [ ] Cada componente interativo tem os 4 estados escritos
- [ ] Todo estado vazio tem o texto literal
- [ ] O OCR trouxe labels, placeholders e botões literais, sem parafrasear
- [ ] Cada tela tem a anatomia nos 6 blocos
- [ ] A tabela de tokens está MEDIDA, com a origem de cada amostra
- [ ] A tipografia tem a escala de tamanhos
- [ ] Tem o número total de componentes e os 3 mais caros
- [ ] A lista do que NÃO copiar está escrita
````

---

## Etapa 06 · FASE 5: MAPEAR O ACESSO

Entregável: `FASE-5-ACESSO.md`

````text
Agora a parte que quase ninguém ensina: como a porta de entrada funciona por
dentro. Você vai inspecionar o MEU PRÓPRIO login e documentar cada método, cada
fluxo e cada limite.

PRODUTO: [URL]  |  Salve em: FASE-5-ACESSO.md

ATENÇÃO AO LIMITE ÉTICO (leia e siga):
Você vai inspecionar SOMENTE o login da conta de teste que é MINHA, no meu
navegador. Nunca tentar acessar conta de outra pessoa, nunca testar senha de
terceiro, nunca usar dado de cliente desse produto. É análise do meu acesso.
Se alguma tela pedir conta que você não tem, PARE e me avise.

━━━ PARTE A · OS MÉTODOS DE ENTRADA ━━━

Liste TODOS os jeitos de entrar que o produto oferece, um por um:
email e senha, Google, Apple, GitHub, magic link, 2FA por app, 2FA por SMS,
SSO corporativo, chave de acesso, recuperação de senha, troca de e-mail,
convite de equipe. Para cada um, anote onde ele aparece e se é principal ou
secundário na tela.

━━━ PARTE B · O DIAGRAMA DE CADA FLUXO ━━━

Para cada método, um diagrama em texto:
usuário faz X → o app manda Y para Z → o provedor responde W → o app salva V →
expira em T

Explique em cada um:
- onde fica o token ou o cookie, e o que ele contém
- quanto tempo dura a sessão, e o que renova ela
- o que acontece no logout (o que é apagado de verdade, não só a tela)
- o que acontece se a pessoa abrir em outro navegador

━━━ PARTE C · INSPEÇÃO REAL (aba Network) ━━━

Faça o login de verdade e registre, para cada método:
- a requisição que saiu: para onde, método, e quais campos foram
- a resposta que voltou: status e o que veio no corpo
- o cookie ou a sessão que apareceu: nome, validade, httpOnly, secure, sameSite
- o que o logout apaga
- se o token aparece na URL em algum momento (isso é vazamento de credencial)

━━━ PARTE D · OS LIMITES E AS DEFESAS ━━━

Teste e registre o comportamento real:
- limite de tentativa: erre a senha de propósito 5 vezes. O que acontece? tem
  bloqueio, espera, captcha ou nada?
- recuperação de senha: o token é de uso único? expira? quanto tempo dura?
- o link que chega por e-mail: funciona mais de uma vez?
- a tela de 2FA: tem código de reserva? o QR carrega o quê?
- sessão: dá pra derrubar todas as sessões? existe lista de dispositivos?
- mudança de senha: pede a senha atual? derruba as outras sessões?

━━━ PARTE E · MATRIZ DE PAPÉIS E PERMISSÕES ━━━

Se o produto tem mais de um tipo de conta, monte a matriz observável:
| papel | o que consegue ver | o que consegue fazer | o que não consegue |

Marque o que você COMPROVOU e o que é dedução. E o mais importante: registre o
que acontece quando um papel tenta acessar o que não é dele. Dá erro ou mostra?

━━━ PARTE F · OS SINAIS DE SEGURANÇA VISÍVEIS ━━━

- cabeçalhos da resposta: tem CSP, HSTS, X-Frame-Options, X-Content-Type-Options?
- a página de login é HTTPS e não mistura conteúdo de outro domínio?
- existe aviso de novo dispositivo ou de login suspeito?
- existe registro de auditoria visível (histórico de acesso)?
- a página pública diz algo sobre LGPD, criptografia ou dado?

━━━ PARTE G · FECHAMENTO ━━━

Para eu CONSTRUIR cada método depois:
- qual é o mais simples de implementar e qual é o mais seguro
- qual deles eu deveria usar no MEU produto, e por quê (não é sempre o mais forte:
  é o que serve o meu usuário)
- o que eu copio de bom comportamento daqui (o cuidado, não a tela)
- a régua que eu vou escrever no meu produto

COMO FAZER: colete tudo o que der (fontes, links, números, telas, textos reais) e gere a partir do que coletou. Item por item, sem agrupar. O que não achou, marca como "não encontrado".

✅ O ARQUIVO PRECISA TER (o entregável):
- [ ] Todos os métodos de login listados, um por um
- [ ] Cada método tem o diagrama do fluxo em passos
- [ ] Cada fluxo testado tem os dados reais da aba Network
- [ ] O ciclo de vida da sessão está escrito (duração, renovação, logout)
- [ ] O limite de tentativa foi testado de verdade e registrado
- [ ] A matriz de papéis existe, com o que não é dele
- [ ] Os sinais de segurança visíveis foram registrados
- [ ] A recomendação de qual usar no meu produto está clara
- [ ] O limite ético está escrito no arquivo
````

---

## Etapa 07 · FASE 6: DOCUMENTAR O MAPA

Entregável: `MAPA-[produto].md`

````text
Agora você vai juntar TUDO num documento só: o mapa do produto.
Esse arquivo tem que ser bom o suficiente pra eu construir sem abrir o
produto de novo.

PRODUTO: [URL]
FONTES: FASE-1-ESCOLHA.md, FASE-2-COLETA.md, FASE-3-FUNCOES.md,
FASE-4-COMPONENTES.md, FASE-5-ACESSO.md e a pasta de prints
SALVE EM: MAPA-[nome-do-produto].md

O DOCUMENTO TEM 7 PARTES:
1. O QUE É E PRA QUEM (3 parágrafos, sem clichê)
2. MAPA DE FUNÇÕES: todas as funções, com núcleo/bônus e o esforço de cada uma
3. MAPA DE TELAS: rota -> função -> arquivo do print
4. FLUXOS DE ACESSO: os diagramas de login
5. STACK APARENTE: o que dá pra deduzir do que é público
6. O QUE NÃO DÁ PRA CLONAR: item por item, com o porquê e o que fazer no lugar
7. ONDE ESTÃO AS BRECHAS: o que eu posso fazer melhor que eles

COMO FAZER: colete tudo o que der (fontes, links, números, telas, textos reais) e gere a partir do que coletou. Item por item, sem agrupar. O que não achou, marca como "não encontrado".
- SE FALTAR FUNÇÃO: confira a lista. Se a fase 3 levantou 30 funções, as 30 têm que estar aqui.
- SE FALTAR INFORMAÇÃO: escreva "não levantado" naquele item. Nunca preencha com achismo.
- O TESTE FINAL: eu preciso ler esse arquivo daqui a 6 meses e entender tudo
  sem abrir o produto. Escreva com esse padrão.

✅ O ARQUIVO PRECISA TER (o entregável):
- [ ] As 7 partes estão completas
- [ ] Toda função da fase 3 aparece aqui
- [ ] A parte 6 (o que não dá pra clonar) tem pelo menos 4 itens
- [ ] A parte 7 (brechas) tem opções concretas, não frases genéricas
````

---

## Etapa 08 · FASE 7: RECONSTRUIR

Entregável: `FASE-7-BLUEPRINT.md`

````text
Você vai me ajudar a construir [NOME DO PRODUTO], um SaaS [descrição em uma linha].

Tenho em mãos o mapa dele em MAPA-[produto].md, feito por engenharia reversa.
Leia o arquivo e siga as duas etapas abaixo, na ordem.

=====================================================
ETAPA A: O BLUEPRINT (faça apenas isso e PARE)
=====================================================

Escreva o arquivo FASE-7-BLUEPRINT.md com estas 7 partes:

1. POSICIONAMENTO
   - Meu cliente exato: [quem é, do jeito mais específico que eu souber]
   - A UMA coisa que eu faço melhor que a referência: [se eu não disser, me pergunte]
   - O que eu NÃO quero do produto de referência: [liste o que fica de fora]
   - Faixa de preço que eu pretendo cobrar: [valor]

2. ENTIDADES (tabela)
   Coluna: entidade, campo, tipo, obrigatório, e qual campo é o dono (workspace_id).
   Toda entidade precisa do workspace_id. Nenhuma exceção.

3. ENDPOINTS (tabela)
   Coluna: método, rota, corpo que recebe, o que responde, e o papel mínimo
   (owner, admin, editor, viewer). Sem papel definido, o endpoint não entra.

4. TELAS (tabela)
   Coluna: tela, o que ela faz, e quais botões chamam quais endpoints.
   Todo botão tem que apontar pra um endpoint da lista do item 3.

5. INTEGRAÇÕES EXTERNAS
   Quais são (e-mail, pagamento, WhatsApp) e o que cada uma faz.
   Todas entram em MODO MOCK: o fluxo funciona sem credencial nenhuma.

6. O QUE FICA FORA DA PRIMEIRA VERSÃO
   Lista do que eu decidi não construir agora.

7. CAMADA DE SEGURANÇA (as 12 invariantes)
   Escreva uma tabela com estas 12 linhas, e para CADA uma diga como o teu
   projeto cumpre ela e qual é a prova. A coluna de prova é obrigatória:
   invariante sem prova é intenção, não controle.

   | # | invariante | como o projeto cumpre | qual prova |
   |---|---|---|---|
   | 1 | nenhum segredo no código | credencial só em variável de ambiente | varredura de padrão de chave no build |
   | 2 | exposição de rede mínima | nada escutando em 0.0.0.0 | conferência do host de subida |
   | 3 | autorização em TODO endpoint | papel mínimo declarado por rota | endpoint sem papel reprova |
   | 4 | isolamento entre inquilinos | workspace_id em toda consulta | teste tentando ler dado de outro workspace |
   | 5 | dono do objeto verificado | além de existir, o registro tem que ser do requisitante | trocar o ID na URL e exigir recusa |
   | 6 | escrita transacional | operação que mexe em mais de um registro é atômica | teste de falha no meio |
   | 7 | log sem dado sensível | log guarda evento, nunca senha, token ou dado pessoal | revisão das linhas de log |
   | 8 | dependência com versão travada | arquivo de dependência com versão fixa | auditoria de dependência rodada |
   | 9 | entrada validada e saída escapada | validação na entrada, escape na renderização | teste com entrada hostil |
   | 10 | limite nas rotas de autenticação | tentativa de login limitada por cliente | testar o excesso e exigir o freio |
   | 11 | portão de administração separado | rota de admin com verificação própria, não a de consumo | chamada sem o papel certo exige recusa |
   | 12 | nenhuma chamada externa silenciosa | telemetria desligada por padrão, e nunca sem aviso | conferir as conexões durante o uso |

   Regra dura: as invariantes 3, 4, 5, 9, 10 e 11 são CRÍTICAS. Se qualquer uma
   delas falhar, o projeto não avança. As outras seis também importam, mas a
   média não compensa uma crítica em falta.

REGRAS DA ETAPA A:
- Só o blueprint. NÃO escreva código nesta etapa.
- Se faltar alguma informação essencial, me pergunte DIRETO e espere a resposta.
  No máximo 3 perguntas.
- Termine com um resumo de 10 linhas do que você entendeu e a pergunta:
  "Posso construir? Responda aprovado para eu começar."
- PARE AQUI e espere o meu aprovado.

=====================================================
ETAPA B: A CONSTRUÇÃO (só comece quando eu escrever "aprovado")
=====================================================

Método obrigatório: FATIAS VERTICAIS COMPLETAS.
Uma funcionalidade inteira, ponta a ponta, antes de começar a próxima.
Uma fatia só termina quando está testada de verdade E a segurança está checada.

ARQUITETURA (siga sem inventar):
- Backend: FastAPI (Python) + MongoDB, assíncrono.
- Frontend: React + Tailwind, chamadas com baseURL "/api".
- Multi-tenant: workspace_id em TODA entidade e TODA consulta.
- Auth: JWT + bcrypt, com papéis owner, admin, editor e viewer.
- Integrações externas: sempre por ADAPTADOR com MODO MOCK.
- Configuração 100% por variáveis de ambiente. Arquivo .env fora do código.
- Deploy em serviço único: o backend serve o build do frontend e a API.

A ORDEM (não pule nenhuma):
1. ESQUELETO QUE SOBE: uma rota /api/health e uma tela que renderiza.
   Tem que subir e responder antes de qualquer funcionalidade.
2. AUTENTICAÇÃO E MULTI-TENANT: registro, login e contexto de workspace.
   Tudo que vier depois já nasce escopado e protegido.
3. DEPOIS as fatias verticais, uma por vez. Cada fatia na ordem:
   banco, depois endpoints, depois tela, depois a ligação, depois o teste,
   e por último a checagem de segurança.

O GATE DE SEGURANÇA (roda ao fim de CADA fatia, antes de declará-la pronta):
Crie o arquivo seguranca.py na raiz, com um comando:

    python seguranca.py --projeto .

Ele verifica as 12 invariantes do item 7 e imprime, uma por linha, aprovado ou
falha, com ARQUIVO:LINHA quando falhar. Ele sai com código de erro quando
alguma invariante crítica falha.

Regras do gate:
- Falha em invariante crítica BLOQUEIA a fatia. Não siga para a próxima.
- Média alta NÃO compensa: 11 aprovadas e 1 crítica falhando é bloqueio.
- Ferramenta ausente é NÃO RODADO, nunca aprovado.
- O resultado do gate entra no PROGRESSO.md com a data.
- O gate NÃO prova que o app é seguro. Ele prova que as invariantes foram
  verificadas nesta versão. Escreva isso no README do projeto.

REGRAS DE EXECUÇÃO:
1. Ao terminar cada fatia: TESTE de verdade (chame o endpoint e mostre a tela),
   rode o gate, e só então marque como concluída.
2. Escreva em PROGRESSO.md, ao fim de cada fatia: o que foi feito, como você
   testou, o resultado do gate e o que ficou faltando.
3. Integrações começam em mock. Diga qual variável de ambiente vira real.
4. Nada de segredo, cor, endereço ou caminho absoluto chumbado no código.
5. Se o ID que voltou começa com "mock", não é real: avise.
6. Toda consulta ao banco filtra por workspace_id. Sem exceção, nem "só pra testar".
7. Todo endpoint que recebe ID de registro confere se o registro é do
   requisitante antes de responder. Existir não é permissão.

NÃO ENTREGUE CASCA:
- todo botão chama um endpoint de verdade
- todo endpoint salva no banco
- toda tela tem estado de carregando, de vazio e de erro
- todo endpoint de escrita tem validação de entrada
- nenhum endpoint de listagem devolve dado de outro workspace

DECLARE O LIMITE:
No fim, escreva no README uma seção "o que este projeto não garante", com três
linhas honestas. Risco residual declarado é parte do trabalho, não fraqueza.

COMECE. Ao final de cada fatia, me diga: o que foi feito, como testou, o
resultado do gate e o que falta.
````
