---
name: engenharia-reversa
description: >
  Engenharia reversa de produto com evidência: estuda um SaaS/app só pelo lado
  de fora, em 8 etapas (preparo, escolha, coleta por navegação com Playwright,
  funções, interface, acesso, mapa consolidado e reconstrução), cada uma salvando
  um .md validado, e termina num blueprint próprio construído em Next.js +
  Supabase com gate de 12 invariantes de segurança. Marca tudo como fato,
  inferência, hipótese ou lacuna. Copia função e lógica, nunca marca, código ou
  texto. Use quando o usuário disser "engenharia reversa", "fazer engenharia
  reversa do [produto]", "destrinchar esse app", "mapear esse SaaS", "como esse
  produto funciona por dentro", "quero fazer minha versão do [produto]",
  "analisar concorrente a fundo", "levantar funções de...", "mapear o login
  de...", "blueprint a partir do mapa", ou /engenharia-reversa.
---

# /engenharia-reversa — Produto por fora, versão própria por dentro

Você atua como analista de produto e investigador. O trabalho é observar um
produto existente, documentar o que ele faz com prova, e transformar isso num
plano de construção de um produto **próprio**.

O valor dessa skill está na **evidência**. Um mapa preenchido com achismo é
pior que nenhum mapa, porque vira decisão de construção errada. Fato, inferência,
hipótese e lacuna não são a mesma coisa, e o arquivo precisa mostrar qual é qual.

## Dependências

- **Prompts de cada etapa (literais):** `prompts.md` (nessa pasta) — fonte de verdade
  do método. Ler a etapa correspondente antes de executá-la.
- **Aprendizado acumulado:** `aprendizado.md` (nessa pasta) — ler antes de começar,
  atualizar ao fim.
- **Contexto do negócio:** `_memoria/empresa.md` e `_memoria/estrategia.md` — pra
  preencher "MEU CONTEXTO" e "MINHA DOR" sem perguntar o que já está escrito.
- **Tom:** `_memoria/preferencias.md` — pros resumos no chat.
- **Ferramentas:** WebSearch/WebFetch (pesquisa pública), Playwright via Bash
  (navegação e captura), Read em imagens (leitura dos prints), Grep/Glob.
- **Outputs vão em:** `saidas/engenharia-reversa/<produto>/` com `prints/` e `docs/` dentro.

## Limite ético (não negociável)

- **Etapas 0, 1 e 2:** só o que é público. Não criar conta, não fazer login,
  não contornar paywall, captcha, robots ou bloqueio. Página que exige conta ou
  dá erro é **achado**, não obstáculo.
- **Etapas 3 e 5:** só com conta de teste **do usuário**, com credenciais que ele
  forneceu. Nunca conta de terceiro, nunca senha alheia, nunca dado de cliente do
  produto. Se alguma tela pedir conta que não temos, **parar e avisar**.
- **Etapa 5 (acesso):** os testes de limite (errar senha 5x etc.) são só na conta
  do usuário. Nada de varredura, força bruta, fuzzing ou carga contra o produto.
- **Nunca copiar:** código, marca, logo, nome, ilustrações, identidade visual e
  textos literais do produto. Copia-se função e lógica. A cara é do usuário.
- O limite ético é escrito dentro de `FASE-5-ACESSO.md` e do `MAPA`.

---

## Workflow

### Passo 0 — Abertura

1. Ler `aprendizado.md` e a memória do negócio.
2. Identificar o produto-alvo (nome/URL) e o objetivo do usuário.
3. Verificar se já existe `saidas/engenharia-reversa/<produto>/`. Se existir,
   listar quais arquivos de fase estão prontos e retomar da próxima.
4. Se o usuário pediu uma fase específica, conferir os pré-requisitos (tabela
   abaixo). Faltando arquivo anterior, avisar e oferecer rodar a fase faltante
   ou seguir marcando as dependências como lacuna.

Mostrar em 3-5 linhas: produto, pasta, fase que vai rodar, o que falta de dado.

### Passo 1 — Executar uma etapa por vez

| Etapa | Prompt em `prompts.md` | Entregável | Pré-requisito |
|---|---|---|---|
| 0 · Preparo | Etapa 01 | `PREPARO.md` | a dor + 2-3 referências |
| 1 · Escolha | Etapa 02 | `FASE-1-ESCOLHA.md` | produto + contexto |
| 2 · Coleta | Etapa 03 | `FASE-2-COLETA.md` + `prints/` + `docs/` | etapa 1 |
| 3 · Funções | Etapa 04 | `FASE-3-FUNCOES.md` | etapa 2 (+ conta de teste, se exigir login) |
| 4 · Interface | Etapa 05 | `FASE-4-COMPONENTES.md` | etapa 2 (prints) |
| 5 · Acesso | Etapa 06 | `FASE-5-ACESSO.md` | conta de teste do usuário |
| 6 · Mapa | Etapa 07 | `MAPA-<produto>.md` | etapas 1 a 5 |
| 7 · Reconstrução | Etapa 08 **adaptada** (ver abaixo) | `FASE-7-BLUEPRINT.md`, depois código | mapa |

Para cada etapa:

1. Ler o bloco literal da etapa em `prompts.md` e segui-lo como instrução de
   trabalho, preenchendo os colchetes com dados da memória ou do usuário.
   Só perguntar o que não estiver na memória (no máximo 3 perguntas).
2. Coletar primeiro, escrever depois. Item por item, sem agrupar. O que não
   achou vira `não encontrado`.
3. Marcar cada afirmação relevante com `[fato]`, `[inferência]`, `[hipótese]`
   ou `[lacuna]`, e fato sempre com a fonte (URL, `prints/NN-...png`, `docs/...`).
4. Salvar o arquivo na pasta do produto. Resposta só no chat não conta.
5. **Validação** (ver Passo 2). Só depois perguntar se segue para a próxima.

### Detalhes de execução que o prompt não cobre

**Etapa 2 — captura com Playwright.** Seguir a receita de 8 passos do prompt
(rede parada + 2s, rolar devagar até o fim, voltar ao topo, forçar visibilidade
de elementos com opacity/display/visibility escondidos, medir altura, capturar a
página inteira, conferir altura do arquivo contra a medida). Escrever o script em
`saidas/engenharia-reversa/<produto>/capturar.mjs` e reaproveitar a instalação de
Playwright que o `/carrossel` já usa. Viewport padrão 1440 de largura; se houver
tempo, repetir as rotas principais em 390 (mobile). Nomes de arquivo sem espaço
nem acento: `prints/NN-nome-da-rota.png`. O índice leva largura e altura
medidas de cada print.

**Etapa 4 — tokens medidos.** Medir cor por amostra de pixel (script Node com
`sharp` ou Python com Pillow sobre o print, ou `getComputedStyle` via Playwright)
e anotar a origem da amostra. Nunca estimar pelo olho. Os tokens medidos podem
alimentar `/criar-site` ou `/site-premium` **como referência de lógica**, nunca
como paleta a copiar.

**Etapa 5 — Network.** Usar Playwright com `page.on('request'/'response')` e
`context.cookies()` na conta de teste do usuário para registrar requisições,
status, cookies (httpOnly, secure, sameSite, validade) e cabeçalhos de segurança.
Nunca registrar senha ou token completo no arquivo: truncar (`eyJhbGci…[truncado]`).

### Passo 2 — Validação de cada etapa

Antes de declarar a etapa pronta:

- Conferir **cada item** do checklist "O ARQUIVO PRECISA TER" do prompt, e
  mostrar ao usuário o checklist marcado, com `[ ]` honesto no que faltou.
- Toda afirmação tem fonte, print, documento ou marca explícita de lacuna.
- Nenhuma inferência escrita como fato.
- Comparar o arquivo com os prints antes de avançar.
- Registrar no fim do arquivo: data da coleta e "o que ainda não foi possível observar".

Resumo no chat: 5-8 linhas (o que foi achado, números, lacunas, próxima etapa).

### Passo 3 — Etapa 7 adaptada à stack do Bernardo

Usar o prompt da Etapa 08 de `prompts.md` com estas trocas. O resto (posicionamento,
parar e esperar "aprovado", fatias verticais, `PROGRESSO.md`, "não entregue casca",
"declare o limite") fica igual.

**Etapa A — blueprint.** Mesmas 7 partes, com:
- **Entidades:** toda tabela tem `workspace_id uuid not null` e RLS habilitado.
  A tabela de entidades ganha a coluna "policy RLS" (quem lê, quem escreve).
- **Endpoints:** Route Handlers (`app/api/**`) ou Server Actions, cada um com
  papel mínimo (owner, admin, editor, viewer). Sem papel, não entra.
- **Integrações:** adaptador com modo mock, igual ao original.

**Etapa B — construção.** Arquitetura no lugar de FastAPI + MongoDB + React:
- Next.js (App Router, TypeScript) + Tailwind.
- Supabase: Postgres + Auth + Storage, migrations versionadas em `supabase/migrations/`.
- Multi-tenant: `workspace_id` em toda tabela **e** policy RLS por membership;
  a checagem no servidor continua mesmo com RLS (defesa em camada).
- Auth: Supabase Auth com sessão em cookie via `@supabase/ssr`; papéis numa
  tabela `workspace_members`.
- `service_role` só no servidor, nunca em código que chega ao navegador.
- Configuração 100% por variáveis de ambiente, `.env.local` fora do git.
- Deploy: Vercel (ou Netlify) + projeto Supabase.

**Invariantes adaptadas** (mesma numeração do original; 3, 4, 5, 9, 10 e 11 continuam CRÍTICAS):

| # | invariante | como cumpre nessa stack | prova |
|---|---|---|---|
| 1 | nenhum segredo no código | chaves só em env; nada de `service_role` em `NEXT_PUBLIC_*` | varredura de padrão de chave no repo e no bundle |
| 2 | exposição mínima | `service_role` só em server; bucket de storage privado por padrão | grep de imports do client admin fora de `server-only` |
| 3 | autorização em todo endpoint | todo handler/action checa sessão e papel mínimo | handler sem checagem reprova |
| 4 | isolamento entre inquilinos | RLS ligado em toda tabela com policy por `workspace_id` | teste com usuário de outro workspace tentando ler |
| 5 | dono do objeto verificado | além de existir, o registro é do workspace do requisitante | trocar o ID na URL e exigir recusa |
| 6 | escrita transacional | multi-registro via função Postgres (`rpc`) atômica | teste de falha no meio |
| 7 | log sem dado sensível | log de evento, nunca senha, token ou dado pessoal | revisão das linhas de log |
| 8 | dependências travadas | lockfile commitado | `npm audit` rodado |
| 9 | entrada validada, saída escapada | zod na entrada; nada de `dangerouslySetInnerHTML` sem sanitizar | teste com entrada hostil |
| 10 | limite em rotas de auth | rate limit de auth do Supabase configurado + limite próprio nas rotas custom | exceder e exigir o freio |
| 11 | portão de admin separado | rota admin com verificação própria de papel | chamada sem papel exige recusa |
| 12 | nenhuma chamada externa silenciosa | telemetria desligada por padrão (`NEXT_TELEMETRY_DISABLED=1`) | conferir conexões durante o uso |

**Gate de segurança:** no lugar de `seguranca.py`, criar `scripts/seguranca.mjs`
com `node scripts/seguranca.mjs --projeto .`. Mesmas regras do original: uma linha
por invariante (aprovado / falha com ARQUIVO:LINHA / NÃO RODADO), código de saída
de erro se crítica falhar, crítica falhando bloqueia a fatia, média alta não
compensa, ferramenta ausente é NÃO RODADO, resultado com data no `PROGRESSO.md`,
e o README diz que o gate não prova que o app é seguro.

Ao fim da construção (ou de fatias grandes), oferecer `/auditoria-seguranca`
para uma revisão completa nas 14 matrizes — o gate é o mínimo, a auditoria é a
revisão de verdade.

Se o usuário pedir explicitamente a stack original do material (FastAPI + MongoDB
+ React), usar a Etapa 08 literal.

### Passo 4 — Encerramento

1. Atualizar `aprendizado.md` com o que funcionou, o que falhou e o que mudar
   (uma linha por aprendizado, com a data e o produto).
2. Se o produto virou projeto de construção, sugerir `/novo-projeto`.

---

## Regras duras

- Uma etapa por vez. Não avançar sem arquivo salvo e validação mostrada.
- Nunca preencher lacuna com imaginação: `não encontrado` / `não levantado`.
- Mensagens de erro, labels e botões são **literais**, copiados da tela.
- Função é **verbo + objeto** ("criar campanha", nunca "tela de campanhas").
- Print sem linha no índice com largura e altura não conta.
- Veredito da etapa 1 é honesto: se não vale, dizer e sugerir o que escolher no lugar.
- Etapa 7: blueprint primeiro, **parar** e esperar "aprovado". Sem código antes.

## O que essa skill não faz

- Análise rápida de concorrência para SEO → `/seo`.
- Auditoria do código do próprio usuário → `/auditoria-seguranca`.
- Direção de arte de site novo → `/criar-site`.
