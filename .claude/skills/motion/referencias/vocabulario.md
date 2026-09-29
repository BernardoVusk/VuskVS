# Vocabulário e tokens

> Usar estes termos ao descrever ou interpretar "feel". Cada um carrega informação
> numérica que "suave" e "bonito" não carregam.

## Tokens de duração — escala de vídeo, 30fps

Os tokens do `claude-motion-prompts_1.md` (100–400ms) são de **UI**, onde acima de 300ms
parece lento. Vídeo é outra escala: o espectador não está esperando resposta a um clique,
está assistindo.

| token | frames | ms | uso |
|---|---|---|---|
| corte | 2–3 | 67–100 | snap, flash, troca seca |
| rápido | 6–8 | 200–267 | elemento pequeno entra |
| padrão | 12–15 | 400–500 | bloco de texto, card |
| amplo | 20–26 | 667–867 | título, revelação de cena |
| cena | 36–50 | 1200–1700 | varredura, transição, contador |

**Stagger:** 3–6 frames entre irmãos. Acima de 8 vira desfile. (O arquivo original dizia
40–60ms — a 30fps isso é 1–2 frames, some na tela.)

**Sobreposição:** a batida seguinte entra a 50–70% do percurso da anterior.

## Easings no Remotion — sistema de papéis

**Consistência não é usar a mesma curva em tudo. É usar a mesma lógica de escolha.**
A curva se escolhe pelo **papel do movimento**, nunca por ser o padrão do arquivo. Uma
curva só em tudo lê como regra decorada, e quebra em três lugares previsíveis: saída,
deriva contínua e movimento que atravessa a tela.

| papel | quando | curva |
|---|---|---|
| **chega** | elemento entra e assenta na posição final | `Easing.bezier(0.16, 1, 0.3, 1)` — expo-out |
| **atravessa** | varredura, wipe, troca de foto, régua que corre | `Easing.bezier(0.65, 0, 0.35, 1)` — cubic-in-out |
| **sai de quadro** | elemento acelera para fora e some | `Easing.bezier(0.7, 0, 0.84, 0)` — expo-in |
| **deriva** | ambiente, parallax, loop, qualquer coisa sem fim | `Easing.linear` |
| **overshoot** | quique, assentamento com oscilação | `spring()` — nunca bezier |

Duas variantes da casa:

- `Easing.bezier(0.3, 0.7, 0.3, 1)` — "chega" que **arranca** rápido. Usada nos primeiros
  frames de uma peça, para não abrir com quadro vazio (`aprendizado.md` E3).
- `Easing.bezier(0.5, 0, 1, 1)` — "sai" suave, para elemento que apaga no lugar em vez de
  sair de quadro. O expo-in é decisivo demais quando o elemento não vai a lugar nenhum.

### Os dois erros que este sistema evita

**Expo-out em coisa que atravessa vira corte seco.** Em t=0,5 o expo-out já está em ~0,93:
a aresta cruza o quadro nos primeiros 30% da janela e passa os outros 70% encostando no
fim. Medido e corrigido em `aprendizado.md` E15.

**Expo-out em saída faz o elemento arrastar.** Ele desacelera justamente quando deveria
estar sumindo, e a saída fica com cauda longa sem propósito.

### Nomes das curvas — conferir antes de citar

Os valores são de `easings.net` e é fácil trocar os nomes (a fonte que originou esta seção
errou dois dos quatro que propunha):

| curva | valor correto |
|---|---|
| expo-out | `0.16, 1, 0.3, 1` |
| expo-in | `0.7, 0, 0.84, 0` |
| quint-out | `0.22, 1, 0.36, 1` |
| quint-in | `0.64, 0, 0.78, 0` |
| cubic-in-out | `0.65, 0, 0.35, 1` |
| quint-in-out | `0.83, 0, 0.17, 1` |

Expo-out e quint-out se parecem, mas expo é mais agressivo no arranque e mais lento no
fim. Vale acertar o nome porque é assim que se conversa sobre isso.

### Sobre `Easing.linear`

Linear **não** é sinal de animação automática quando o papel é deriva: ambiente, parallax e
loop são obrigatoriamente lineares, porque não têm fim para desacelerar em direção a ele
(`aprendizado.md` E10). O que denuncia automático é linear numa **batida** — coisa que tem
começo e fim e mesmo assim entra em velocidade constante.

**Presets de mola:**

| preset | config | uso |
|---|---|---|
| `suave` | `{ damping: 200, mass: 1, stiffness: 100 }` | revelação, assentamento — sem quique |
| `seco` | `{ damping: 20, mass: 0.8, stiffness: 200 }` | entrada rápida, quique mínimo |
| `pesado` | `{ damping: 30, mass: 2, stiffness: 80 }` | movimento dramático e lento |
| `elástico` | `{ damping: 12, mass: 0.5, stiffness: 200 }` | overshoot perceptível — só se o feel da marca pedir |

Escolher o conjunto pelo feel da marca em `identidade/design-guide.md`. Exemplo real (FX
Minas, marca industrial/editorial): usa só `suave`, `seco` e `pesado`; `elástico` fica
documentado apenas para reconhecer o efeito numa referência, nunca reproduzir — "construção
pesada não tem quique". Pra uma marca leve ou lúdica, `elástico` pode ser exatamente o que
o feel pede.

## Glossário

| termo | o que significa tecnicamente |
|---|---|
| snappy | 4–6 frames, ease-out forte, sem overshoot |
| elástico | spring com damping baixo, overshoot visível |
| pesado | 24 frames ou mais, ease-in-out, deslocamento grande |
| seco | ease-out, sem bounce, para na hora |
| flutuante | ease-in-out longo, deslocamento pequeno, às vezes em loop |
| antecipação | recua ligeiramente antes de ir para o destino |
| overshoot | passa do destino e volta |
| settle | oscilação final decrescente até parar |
| stagger | atraso incremental entre elementos irmãos |
| overlap | B começa antes de A terminar |
| follow-through | elemento secundário continua depois do principal parar |
| batida | uma entrada, saída ou transformação com começo e fim definidos |
| camada de ambiente | movimento contínuo que cobre os intervalos entre batidas |
| ciclo de vida | as quatro fases de um elemento: entra → vive → reage → sai |
| entra | como o elemento aparece — wipe, spring, tracking, desenho |
| vive | o que faz enquanto está em cena — pulsa, deriva, brilha, conta |
| reage | como responde a outra batida — escurece, destaca, escala, recua |
| sai | como deixa a cena — some, encolhe, é varrido, recua pro fundo |
| densidade | eventos nomeados por segundo. Alvo 3–4 |

## Repertório

O que existe além de "entra com fade e sobe 20px". Só o que serve em vídeo — os itens de
UI da fonte original (hover, toggle, carrossel, cursor magnético) não se aplicam aqui.

**Entrada e revelação**

| técnica | nota |
|---|---|
| mask reveal por linha | o padrão de ouro para título. `overflow: hidden` + `translateY(100%)` |
| mask reveal por palavra | quando há locução para sincronizar |
| clip-path direcional | quando há direção de leitura estabelecida — a diagonal da marca |
| blur-to-focus | `blur(12px)` + `scale(1.06)` → nítido. Não em texto pequeno |
| line draw (SVG) | `pathLength={1}` + `strokeDasharray={1}` + `strokeDashoffset={1-p}` |
| escala com origem deslocada | cresce a partir de um ponto que significa alguma coisa |
| peso variável (variable font) | 300 → 700 em 12 frames. Sofisticado, quase não se vê por aí |

**Transformação**

| técnica | nota |
|---|---|
| shared element | o mesmo objeto persiste entre cenas — a transição mais forte que existe |
| path morphing | interpolação entre dois caminhos SVG |
| squash & stretch por velocidade | deformação proporcional à velocidade instantânea |
| skew por velocidade | inclinação de 2–6° durante a aceleração |
| echo / trail | cópias defasadas com opacidade decrescente (`<Trail>` faz isso) |

**Dados**

| técnica | nota |
|---|---|
| contador com easing | expo-out + `tabular-nums`. Nunca linear — número também acelera |
| gráfico de linha com ponto seguidor | o traço desenha, o ponto acompanha a ponta |
| preenchimento de área | gradiente sobe sob a linha depois que ela termina |
| mapa com rota desenhando | traço + marcadores com pop escalonado |
| barras reordenando | transição de layout, não corte |

**Ambiente**

| técnica | nota |
|---|---|
| partículas contidas | 20–60. Acima disso vira protetor de tela dos anos 90 |
| gradiente em deriva | mesh gradient lento ao fundo — **conferir que não é sub-pixel** |
| loop perfeito | primeiro e último frame idênticos. Usar função trigonométrica do frame, nunca `interpolate` linear |

## Anti-padrões — sinais de motion automático

**Movimento**
- **Elemento que entra e congela** — o mais comum e o mais caro
- **Enjoo de movimento** — coisa demais se mexendo ao mesmo tempo, sem foco
- **Sopa de efeito** — efeito porque dá, não porque ajuda
- Tudo entrando com o mesmo fade + translateY
- Rampa global lenta fingindo ser respiro (é sub-pixel — ver `aprendizado.md` E1)
- Stagger em absolutamente toda lista
- Blur na entrada de tudo
- Bounce em elemento que deveria ser sério
- Tudo com `transform-origin: center`
- **Elementos que param todos no mesmo frame** — falta follow-through
- Peça que termina congelada esperando o loop
- Todo número de timing redondo (200/400/600) — arredondamento, não medição

**Transição**
- Crossfade em 100% dos cortes (acima de 40% já é sinal de problema de edição)
- Zoom de transição em tudo
- Whip pan a cada quatro segundos
- Corte que nada na cena anterior motivou

**Visual**
- **Árvore de Natal** — cores demais competindo
- Grão estático (pior que grão nenhum)
- Vinheta forte, dura e perfeitamente centrada
- Sombra sem direção de luz consistente entre os elementos da cena
- Texto em gradiente por padrão
- Emoji no lugar de ícone
- Glassmorphism em camadas empilhadas
- Efeito que rouba a atenção do ponto principal

**Texto**
- Letra por letra com fade de opacidade — o clichê mais datado
- Scramble / decode — datado, salvo contexto técnico explícito
- Texto que sai antes de dar tempo de ler (piso: 24 frames)
- Lorem ipsum na entrega final

## Foco

**Um ponto focal por vez.** Quando um elemento é o assunto, os outros recuam — escurecem,
encolhem, saem de foco. Isso não é só composição: é a fase "reage" do ciclo de vida dos
outros elementos, e é de onde sai boa parte da densidade.

Ideia complexa pede visual mais simples. Ideia simples aguenta visual mais rico.

## Feel da marca → vocabulário de movimento

Antes de codar, traduzir o "Estilo geral" de `identidade/design-guide.md` (o feel da marca
do negócio) num vocabulário de movimento — cada adjetivo de marca vira uma restrição de
curva/preset. Registrar a tradução aqui na primeira vez que essa skill roda pra um negócio
novo.

**Exemplo real (FX Minas):** "editorial, industrial, sério sem ser frio" virou **seco e
mecânico** nas lâminas e varreduras, **amplo** nas revelações de título, **sem bounce** em
lugar nenhum ("construção pesada, não app de consumo"). Pra uma marca leve ou lúdica, a
tradução seria outra — bounce e overshoot fariam sentido.

O elemento gráfico assinatura da marca (na FX Minas, a diagonal eco do X do logo) entra
como varredura, régua ou acento em movimento — nunca como enfeite parado. Toda marca com um
grafismo próprio (uma forma do logo, um padrão) merece esse mesmo tratamento.
