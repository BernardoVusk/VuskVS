---
name: stories
description: >
  Cria uma sequência de stories do Instagram que segura quem assiste até o fim, com informação
  útil e CTA de engajamento no último, no estilo de ilustração line-art autoral da casa (ver
  identidade/designpremium.md): SVG animado que se desenha, renderizado em vídeo MP4 1080x1920
  por story + PNG do quadro final. Estrutura gancho → quiz → resposta → conteúdo → prova real →
  CTA. Use quando o usuário pedir "stories", "sequência de stories", "story animado", "stories
  com retenção", "stories com quiz", ou /stories.
---

# /stories: sequência de stories com retenção e line-art animada

Motor testado em produção real (aprovado por um cliente com "adorei"). Templates prontos em
`templates/`: `stories.html` traz o motor de desenho SVG + 7 cenas de exemplo (equipamento
industrial) pra você adaptar ao ramo do negócio — trocar a geometria, manter o motor.

Ler antes: `_memoria/empresa.md` (o que o negócio faz e NÃO faz), `_memoria/preferencias.md` (tom
de voz, o que evitar), `identidade/design-guide.md` (paleta) e `identidade/designpremium.md`
seção 3.4 "Estilo de ilustração (line-art autoral)" (a doutrina do traço). Se existir a skill
`/redacao`, seguir as regras dela pro texto de cada tela (sinais de IA, "vale pra tudo"); se
não existir, seguir só `_memoria/preferencias.md` e bom senso de tom.

## Passo 1 · Tema

Se o usuário não trouxe tema, propor 2 ou 3 que caibam numa pergunta com resposta surpreendente
(bons: segurança, produto/equipamento, curiosidade de operação, bastidor do negócio). Tema de
tendência passa por `/pesquisa-tendencias`, se existir. Recomendar um e seguir.

## Passo 2 · Roteiro (mostrar ao usuário e esperar aval antes de renderizar)

Estrutura padrão de 7 stories. Encurtar pra 5 se o tema for simples (fundir 4+5 e tirar o 6).

| # | Papel | Regra |
|---|---|---|
| 1 | Gancho | Afirmação que abre uma curiosidade e só fecha no 3. Termina com "A resposta vem nos próximos stories." |
| 2 | Quiz | Pergunta com 3 opções. Desenho marca as opções (A, B, C). Deixar a área de baixo livre pra figurinha de quiz |
| 3 | Resposta | Resposta em destaque (cor de marca) gigante + 1 frase de porquê + desenho que prova |
| 4 | Transição | Número ou palavra grande desenhada ("3 regras", "2 erros") |
| 5 | Conteúdo útil | Lista numerada de 2 a 3 itens, cada um com ícone line-art que se desenha no seu tempo |
| 6 | Prova real | Foto real do negócio (equipe, processo, obra/produto) — perguntar ao usuário onde estão as fotos — com frase de experiência "na nossa operação..." |
| 7 | CTA de engajamento | Pergunta aberta pra caixa de perguntas (rende história pra repostar) ou enquete (rende volume). Recomendar caixa. Desenho + seta apontando pra área da figurinha |

Regras de texto: no máximo cerca de 15 palavras na tela (lido em 5s); uma ideia por story; contador
"01/07" no canto; alternar fundo escuro e claro da paleta do negócio pra mudar o ritmo; nenhum
número operacional sensível (frota, efetivo, faturamento) sem aval — checar `_memoria/preferencias.md`
por restrição específica; afirmação técnica que depende de dado do negócio vai pra lista
"confirmar com o negócio" do `texto.md`.

## Passo 3 · Montar

1. Criar a pasta `marketing/conteudo/stories-<slug>-<AAAA-MM-DD>/`
2. Copiar `templates/stories.html` e `templates/render-video.js` pra lá (o render sobe pastas até achar `node_modules/playwright-core` na raiz)
3. Reescrever os `.slide` e as cenas com a geometria e a copy do negócio atual. O template traz o motor e 7 cenas de exemplo prontas pra usar como referência de como montar uma cena nova:
   - `cena1`: objeto de lado desenhado em camadas, com bancadas ao fundo e linha de visão bloqueada (X) — exemplo de "cena de risco/atenção"
   - `vistaCima()`: objeto visto de cima, reaproveitável em mais de um story
   - `cena2`: marcadores A/B/C pulsando (quiz)
   - `cena3`: zona hachurada pulsando (área de risco) e raios tracejados em marcha
   - `cena4`: número grande desenhado a mão com eco tracejado
   - `ic1..ic3`: ícones pequenos (exemplos de ícone que se desenha)
   - `cena6`: foto com borda curva, linha de destaque e brilho correndo pela curva
   - `cena7`: objeto e seta tracejada pra figurinha
4. Cada `.slide` leva `data-dur` (segundos): 5 pra tela curta, 6 a 7 pra desenho com explicação, 9 pra lista com 3 itens

### Motor (funções do template)

| Função | Faz |
|---|---|
| `t(svg, d, {dl, dur, op, w, cor, fill, dash, marcha})` | Traço que se desenha. `fill: 'var(--bg)'` apaga o que está atrás (camadas). `dash` + `marcha` = tracejado revelado e andando |
| `pulso(svg, d, dl)` | Anel que se abre e some em loop (2.4s) |
| `rotulo(svg, x, y, txt, dl)` | Etiqueta em fonte mono que aparece |
| `circ`, `elip`, `rr` | Geram `d` de círculo, elipse e retângulo arredondado |
| `data-k` no `<svg>` | Multiplicador de espessura. Traço final na tela deve ficar perto de 2,5px: svg estreito pede k maior (1.3 a 2.1) |
| Classes CSS | `.sobe` (texto entra), `.fade`, `.zona` (hachura respirando), `.balanca`, `.onda`, `.fluxo` |

Ritmo (spec do design-guide): cena monta de trás pra frente, traço principal 1.1s, detalhe 0.4 a 0.7s,
atrasos escalonados; depois de montada, sempre algo em loop (pulso, marcha, balanço). Nenhuma tela parada.
Cor de destaque só no que importa. Desenho é esquemático: contorno, sem sombra, profundidade por opacidade.

Zonas seguras: nada de texto nos 250px do topo nem nos 260px de baixo. Figurinhas (quiz, caixa, link)
ocupam cerca de 300px: reservar esse vazio no 2 e no 7.

## Passo 4 · Renderizar e conferir

1. `node render-video.js` na pasta (ou `node render-video.js 3` pra um só). Sai `stories/story-NN.mp4` e `story-NN.png`
2. Olhar TODOS os PNGs finais e pelo menos um quadro do meio de cada animação (`ffmpeg -ss 1.5 -i story-01.mp4 -frames:v 1 x.png`). Conferir: desenho legível, traço não fino demais, nada cortado, texto fora das zonas seguras, loop visível
3. Na primeira entrega de uma sequência nova pra um negócio, mostrar os stories 1 a 3 pra aprovar o estilo antes de fazer o resto

## Passo 5 · Entregar

`texto.md` na pasta com: roteiro, origem das fotos, figurinhas a colocar no app (qual story, onde, opções
do quiz e qual é a correta) e a lista "confirmar com o negócio". No resumo ao usuário: tabela dos stories,
figurinhas a colocar, pendências, e o lembrete de repostar as melhores respostas do CTA uns 2 dias depois.

## Passo 6 · Oferecer o Reels (sempre)

Depois de entregar os stories, perguntar: **"Quer que eu transforme essa sequência em um Reels animado
com narração?"** Se sim:

1. **Copy da narração primeiro**, em `narracao-reels.md` na pasta dos stories: uma fala por cena, cerca de
   2,5 palavras por segundo, sigla escrita como se fala, números por extenso, reticências
   onde a pausa é de propósito. No Reels não existe caixa de perguntas: o CTA pede comentário. Entregar
   a copy na conversa pro usuário gerar num serviço de voz (ElevenLabs ou similar)
2. **Editar o Reels sem esperar o áudio**, carregando a skill `/motion` e a `remotion-best-practices`
   (ela cria o projeto `motion/` na raiz do negócio se ainda não existir). Uma cena por arquivo,
   line-art compartilhada num componente comum, geometria copiada dos stories, barra de progresso
   segmentada, emenda por varredura diagonal. Passar pelos quatro portões da `/motion` antes de mostrar.
   **Zoom de destaque obrigatório**: toda informação que a locução nomeia ganha um mini zoom da
   câmera no momento em que surge (a área destacada, cada opção A/B/C do quiz em sequência, o número,
   o ícone de cada regra, a sigla nomeada). Spec em `.claude/skills/motion/aprendizado.md` A18
2b. **Nos stories animados também:** quando um story revela uma informação-chave no desenho
   (zona hachurada, marcador, ícone), dar um mini zoom CSS no desenho na direção dela
   (`scale` 1,1–1,2 com `transform-origin` no elemento, ~0,5s in-out, segura, volta)
3. **Sincronizar quando o áudio chegar.** Serviços de voz costumam devolver um arquivo único: NÃO cortar. Tocar
   o arquivo inteiro do frame 0 e encaixar as cenas nas palavras: tempos de palavra com
   whisper.cpp (script em `motion/scripts/transcrever.mjs`, se existir) conferidos contra
   `ffmpeg -af silencedetect=noise=-35dB:d=0.3`; cada emenda 10f antes da primeira palavra da cena;
   instantes internos (opções do quiz, "um/dois/três") 2f antes da sílaba. Masterizar em −14 LUFS
   (loudnorm em duas passadas). Método completo em `.claude/skills/motion/aprendizado.md` A15 e A17
4. Copiar o MP4 final pra `reels/` na pasta dos stories

## Origem

Trazida do agente do grupo FX Minas em 2026-09-28 e generalizada pro padrão VuskVS: o motor de
desenho SVG e a estrutura de retenção são os mesmos, testados em produção real (a sequência
original — 7 stories sobre um risco de operação — foi aprovada de primeira). O que era específico
de um cliente (nome do negócio, pasta de fotos, restrição de número operacional) foi generalizado
pra ler de `identidade/` e `_memoria/` do negócio instalado.
