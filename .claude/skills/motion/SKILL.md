---
name: motion
description: >
  Método guiado para criar animações motion/vídeo com Remotion no nível de qualidade e
  fluidez exigido pela casa VuskVS: identifica o tipo de peça, pede a referência de
  animação, faz engenharia reversa dela em spec numérica, monta o mapa de fluidez antes de
  codar, e reprova mecanicamente qualquer peça com trecho parado. Tem memória de acertos e
  erros em aprendizado.md. Use quando o usuário pedir animação, motion, motion graphics,
  vídeo novo, vídeo pro Instagram, Reels, story animado, abertura animada, logo animado,
  peça de vídeo, animar alguma coisa, melhorar a fluidez, auditar motion, refazer a
  animação, ou /motion.
---

# /motion — animação fluida com Remotion

Projeto: `motion/` na raiz do projeto do negócio (o projeto Remotion). Se a pasta não
existir ainda, criar na primeira vez com a skill `remotion-create` (da
`remotion-best-practices`), gerando `motion/src/marca/cores.ts`, `tipografia.ts` e
`empresa.ts` a partir de `identidade/design-guide.md` (paleta e tipografia) e
`_memoria/empresa.md` (dados reais) — nunca hex ou dado solto direto no componente. Depois
de criado, ler `motion/CLAUDE.md` para paleta, tipografia e componentes existentes — não
re-derivar a marca a cada peça.

## O princípio que rege tudo

**Nenhum segundo parado.** Uma peça é fluida quando, em qualquer frame, alguma coisa está
se movendo de forma perceptível. Isso não é opinião — é medido, e peça reprovada não chega
ao usuário.

Duas métricas, medidas por script:

- **Densidade** (`densidade.mjs`, lê o código) — 3 a 4 eventos nomeados por segundo. Todo
  elemento significativo tem ciclo de vida: **entra → vive → reage → sai**. Elemento que
  entra e congela é um evento; deveria ser quatro.
- **Cobertura** (`fluidez.mjs`, mede o vídeo) — nenhum trecho parado, e a peça não termina
  congelada.

Densidade **produz** a fluidez; cobertura **prova** que ela chegou na tela. Uma peça com
cobertura alta e densidade baixa está aprovada tecnicamente e vazia perceptualmente: o
fundo se mexe e o conteúdo está parado.

Ordem de ataque quando falta fluidez: **ciclo de vida → densidade → sobreposição →
camada de ambiente**. A última é a mais fraca, porque resolve por decoração. Nunca por
rampa global lenta — escala ou opacidade arrastadas pela peça inteira dão deslocamento
sub-pixel e somem no ruído de compressão. Ver `referencias/doutrina-fluidez.md`.

---

## As 7 etapas — nesta ordem, sem pular

### 0. Memória

Ler `aprendizado.md` **antes de qualquer coisa**. É o registro do que já deu certo e do
que já quebrou. Pular esta etapa é repetir erro conhecido.

### 1. Identificar a peça

Via `AskUserQuestion`, uma rodada só:
- **Tipo** — do catálogo em `referencias/tipos-de-peca.md`
- **Formato(s)** — landscape 1920×1080 · reels 1080×1920 · feed 1080×1350
- **Duração alvo** — em segundos

Se o pedido já disser o tipo com clareza ("faz uma abertura"), não perguntar de novo:
confirmar junto com as outras perguntas.

### 2. Referência

Pedir o vídeo de referência em `motion/referencias/`. Dizer por que importa: com referência
medida a peça sai com timing e easing de motion profissional; sem ela, sai com a estrutura
padrão da casa, que é boa mas genérica.

**Se o usuário não tiver referência, seguir mesmo assim** — usar a estrutura de batidas do
tipo escolhido. Não travar o trabalho por causa disso.

### 3. Blueprint

**Com referência:** seguir `referencias/extrair-spec.md`. Medir com ffmpeg, converter
frames em ms *e* em frames da composição alvo, marcar cada easing como [MEDIDO] ou
[ESTIMADO], e declarar os pontos cegos. Não inventar número para preencher lacuna.

**Sem referência:** montar a grade de batidas a partir do tipo, em
`referencias/tipos-de-peca.md`.

### 4. Mapa de fluidez — o portão

Antes de escrever qualquer código, montar duas coisas e mostrar ao usuário:

1. **Tabela de cobertura** — para cada faixa de frames, qual camada está animando
   (ambiente / narrativa / detalhe). Nenhuma faixa vazia.
2. **Ciclo de vida por elemento** — o que cada elemento faz nas quatro fases. Somar os
   eventos: tem que dar **3 a 4 por segundo** de peça.

É aqui que o defeito é barato de corrigir. Depois do código, custa re-render dos três
formatos.

### 5. Código

**Antes de escrever código, carregar a skill `remotion-best-practices`** (oficial do
Remotion, `github.com/remotion-dev/skills`, padrão da casa pra vídeo em motion). Se não
estiver instalada (pasta `~/.claude/skills/remotion-best-practices/` ausente), instalar
primeiro com `npx skills use https://github.com/remotion-dev/skills --skill
remotion-best-practices`. Depois, ler as referências que ela roteia pro caso:
`remotion-create`, `remotion-markup` (+ `voiceover.md`, `transitions.md`,
`multi-scene-video.md` quando couber). As regras da casa abaixo continuam valendo por cima
dela.

Composição nova em `motion/src/composicoes/`, seguindo `referencias/reconstruir-remotion.md`:
objeto `TIMING` no topo em frames, `interpolate` sempre com clamp dos dois lados,
`spring()` onde houver overshoot, `useLayout()` para servir os três formatos com um
componente só, e tokens de `motion/src/marca/` — nunca hex solto.

**A curva se escolhe pelo papel do movimento**, não copiando a rampa do topo do arquivo:
`chega` → expo-out · `atravessa` → cubic-in-out · `sai de quadro` → expo-in · `deriva` →
linear · `overshoot` → `spring()`. Tabela e armadilhas em `referencias/vocabulario.md`.

### 6. Verificação — os quatro portões

Nenhum é opcional, e a ordem importa (comandos relativos à raiz do projeto Remotion,
`motion/`):

```
a)  npx tsc --noEmit
b)  node ../.claude/skills/motion/scripts/densidade.mjs src/composicoes/<Peça>.tsx --frames <N>
c)  npx remotion still <Composição> out/f<N>.png --frame=<N>   → e OLHAR as imagens
d)  npx remotion render <Composição> out/<peca>.mp4            → tier de entrega
    node ../.claude/skills/motion/scripts/fluidez.mjs out/<peca>.mp4
```

- **(a)** só prova que compila. Não diz nada sobre movimento.
- **(b)** é barato e roda antes de renderizar: pega subespecificação enquanto ainda é só
  editar o `TIMING`.
- **(c)** é o que pega erro de composição, cor e layout. Renderizar de 4 a 6 frames
  espalhados (início, cada batida, final) e olhar de verdade. Densidade nova não pode
  virar poluição visual — esse portão é o que percebe isso.
- **(d)** trava a entrega. Medir no arquivo de **entrega**, não no rascunho: o rascunho lê
  ~18% mais alto por causa do ruído do JPEG (`referencias/qualidade-render.md`).

Reprovou em qualquer um → corrigir e repetir, sem mostrar ao usuário ainda.

### 7. Entrega e gravação

Renderizar os formatos pedidos. Entregar com o resumo de fluidez (cobertura real/fraco/
morto). Depois, **anexar a `aprendizado.md`** o que se aprendeu no ciclo — erro novo,
acerto que vale repetir, número que se mostrou certo ou errado. Uma entrada por
aprendizado, com o "como aplicar da próxima".

---

## Gatilhos

`/motion` · "criar animação" · "fazer motion" · "animação motion" · "motion graphics" ·
"novo vídeo" · "vídeo pro Instagram" · "reels" · "story animado" · "abertura animada" ·
"logo animado" · "animar" · "peça de vídeo" · "melhorar a fluidez" · "auditar motion" ·
"refazer a animação"

Para **auditar** peça existente (em vez de criar), pular direto para
`referencias/auditar.md` e para o portão (c).

---

## Regras que não se negociam

- Peça reprovada no `fluidez.mjs` ou no `densidade.mjs` não é entregue. Corrige e
  re-renderiza.
- Todo elemento significativo tem mais de uma fase. Elemento que entra e congela é defeito.
- Conteúdo crítico dentro da zona segura em formato vertical: topo 15% e base 20% ficam
  sob a interface da rede.
- Texto nunca abaixo do piso de legibilidade (`tamanhoTipo()` aplica e avisa), e nunca
  menos de **24 frames** legível por bloco. Legível não quer dizer parado: o ambiente
  continua correndo, o próprio texto é que não se mexe.
- **Nada de grão, motion blur ou efeito de quadro cheio antes de medir a fluidez.** Eles
  inflam o YAVG por construção e mascaram peça parada. Compor por último.
- Movimento só por `interpolate()` e `spring()`. CSS `transition`/`animation` **não
  renderizam** no Remotion.
- Renderizar stills e olhar antes de dizer que está pronto. `tsc` verde não é verificação
  de motion.
- Tokens da marca de `motion/src/marca/cores.ts` e `tipografia.ts`. Cor fora da paleta é
  proibida.
- Conteúdo real, nunca lorem — dados de `motion/src/marca/empresa.ts` (gerado a partir de
  `_memoria/empresa.md`).
- Antes de publicar peça pública, checar `_memoria/preferencias.md` e `_memoria/empresa.md`
  por restrição de divulgação do negócio (número operacional, dado sensível) — nem todo
  negócio tem, mas quando tem é regra dura.
- Todo antes/depois mostra os dois lados. Número de resultado sem o "antes" ao lado é
  proibido pela marca.
- Nada da referência além de tempo, easing e ordem. Layout, ícone e composição visual são
  da marca do negócio, nunca copiados.
- Não renderizar os três formatos até o primeiro passar nos três portões.
- **Zoom de destaque em toda informação-chave**: quando surge o elemento que a locução
  está nomeando (a área cega, a opção A/B/C, o número, o ícone da regra), a câmera dá um
  mini zoom NELE. Não é push-in global lento (E1): é acento rápido, com origem na
  coordenada do elemento. Spec e padrão de código em `aprendizado.md` A18. No mapa de
  fluidez (etapa 4), marcar em qual frame de cada cena cai um zoom de destaque; cena com
  informação nomeada e sem zoom é defeito.

## Fora de escopo em vídeo

`prefers-reduced-motion`, `AnimatePresence` e `motion/react` são regras de peça web/UI.
Em Remotion renderizando MP4 não existe usuário com preferência nem desmontagem — ignorar.
Pela mesma razão, a regra "animar só transform e opacity" (que é performance de browser)
**não vale aqui**: `clip-path`, `filter` e `width` são livres.

Pelo mesmo motivo, material de motion escrito para UI chega aqui com duas distorções
sistemáticas — conferir antes de importar qualquer número de fonte externa:

1. **A escala de duração é outra.** Tokens de 100–400ms são de interface, onde o usuário
   espera resposta a um clique. Em vídeo ele está assistindo. Ver `vocabulario.md`.
2. **O piso de visibilidade é mais alto.** Texto de UI mede num canvas ao vivo; nós
   entregamos MP4 comprimido, onde deslocamento sub-pixel some no ruído do h264. Toda
   recomendação de "deriva imperceptível" precisa ser multiplicada antes de valer aqui
   (`camera-e-imagem.md` 2.2).

## Arquivos da skill

| arquivo | quando ler |
|---|---|
| `aprendizado.md` | sempre, etapa 0 — e gravar na etapa 7 |
| `referencias/doutrina-fluidez.md` | etapa 4, e sempre que um verificador reprovar |
| `referencias/tipos-de-peca.md` | etapas 1 e 3 |
| `referencias/extrair-spec.md` | etapa 3, quando houver referência |
| `referencias/reconstruir-remotion.md` | etapa 5 |
| `referencias/qualidade-render.md` | etapa 7, e em qualquer defeito de imagem |
| `referencias/auditar.md` | auditoria de peça existente |
| `referencias/vocabulario.md` | ao descrever ou interpretar "feel"; **e ao escolher curva** |
| `referencias/camera-e-imagem.md` | quando a peça passa nos portões e ainda parece renderizada |
| `referencias/audio.md` | só quando a peça tiver trilha, locução ou SFX |

## Origem

Trazida do agente do grupo FX Minas em 2026-09-28 e generalizada pro padrão VuskVS: o
método de fluidez, a doutrina de câmera/imagem e a técnica de ilustração line-art
(`aprendizado.md` A8–A13, A16) são os mesmos, testados em produção real. O que era
específico da FX Minas (caminho fixo do projeto, paleta hardcoded, restrição contratual do
cliente) foi generalizado para ler de `identidade/` e `_memoria/` do negócio instalado,
como qualquer outra skill do VuskVS.
