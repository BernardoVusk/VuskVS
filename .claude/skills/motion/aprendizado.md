# Aprendizado de motion

> Memória da skill `/motion`. **Ler na etapa 0, gravar na etapa 7.**
>
> Só entra aqui o que foi observado de verdade — medição, render olhado, correção que
> funcionou. Nada de princípio genérico copiado de artigo. Se não deu para verificar,
> não entra.
>
> Formato: **o que aconteceu** · por que · como aplicar da próxima vez.

---

## Erros — não repetir

### E1. Rampa global lenta não é animação

`AberturaMarca`, 2026-08-23. Para cobrir 1,8s de hold no final, apliquei um push-in de
escala 1 → 1.025 ao longo de 150 frames. Medido depois: **YAVG 0,02–0,05**, exatamente o
mesmo do ruído de compressão do h264. Invisível.

**Por quê:** 2,5% de escala em 150 frames é 0,017% por frame. Num quadro de 1080 de
altura, o pixel da borda anda 0,09px por frame. Para andar 1px por frame seria preciso
0,185% por frame — ou seja, 1.0 → 1.28 ao longo de 5s, o que é agressivo demais para um
fundo.

**Como aplicar:** rampa global (escala, opacidade, rotação lenta) **nunca** resolve
fluidez em peça de 5s ou mais. Cobrir hold com sobreposição de batidas e com um elemento
que se desloca vários px por frame. Se for usar push-in mesmo assim, ele precisa ser
rápido e curto — um acento, não um colchão.

### E2. Laranja rebaixado sobre fundo escuro vira marrom

`AberturaMarca`. Usei `#f26f21` a 55% e 30% de opacidade sobre basalto `#1c1e20` para dar
profundidade às três lâminas. O render mostrou marrom-fosco, fora da identidade. Trocar
por âmbar `#c75b1e` dá o mesmo problema — é laranja escurecido por natureza.

**Por quê:** laranja a 55% sobre `#1c1e20` resolve em ~`#924b21`. Opacidade sobre fundo
escuro dessatura e escurece; não existe "laranja mais fraco" na paleta.

**Como aplicar:** em fundo escuro, hierarquia entre formas da mesma cor vem de
**espessura, tamanho e timing** — nunca de opacidade. Todas as lâminas entram em laranja
cheio.

### E3. Peça abrindo com tela preta

`AberturaMarca`. As lâminas partiam de `-width * 0.95` com easing de arranque lento, o que
deixou os frames 0–8 com o quadro vazio. Num Reels isso é o momento em que a pessoa rola.

**Como aplicar:** conferir sempre o **frame 2** com `remotion still`. Tem que haver algo
em quadro. Se não houver, encurtar a distância de partida ou trocar o easing por um de
arranque rápido, tipo `Easing.bezier(0.3, 0.7, 0.3, 1)`.

### E4. Animação dependente que sobrevive ao gatilho

`AberturaMarca`. O wipe da wordmark ia até o frame 50, mas as lâminas que supostamente o
"revelavam" saíam de quadro no frame 34. Os 16 frames finais do wipe aconteciam sozinhos —
o olho percebe que a causa sumiu e o efeito continuou.

**Como aplicar:** quando o movimento de A justifica o de B, os dois terminam juntos (ou B
termina antes). Ao definir o `TIMING`, conferir os pares causais explicitamente.

### E5. Montagem condicional faz o bloco pular

`AberturaMarca`. Elementos de um flex column entrando em cena mudam a altura da caixa, e o
`justifyContent: center` reposiciona tudo que já estava lá. Lê como salto, não como
entrada.

**Como aplicar:** manter **todos** os elementos montados desde o frame 0 e animar só
opacidade e transform. A caixa fica reservada e nada se desloca por reflow. Cuidado
especial com `letterSpacing` animado, que muda largura — compensar com `padding` no lado
oposto.

### E6. Stagger de UI some em vídeo

O `claude-motion-prompts_1.md` recomendava 40–60ms de stagger entre irmãos. A 30fps isso é
1,2 a 1,8 frame — na prática, simultâneo.

**Como aplicar:** em vídeo o stagger útil é **3–6 frames** (100–200ms). Acima de 8 vira
desfile.

---

### E7. Coreografia que termina antes da peça

`AberturaMarca` v1. As batidas iam até o frame 86 de 150. Os 64 frames restantes (2,1s)
ficaram só com o push-in inútil. O `fluidez.mjs` acusou 72% dos frames mortos.

**Por quê:** as batidas foram encadeadas em sequência quase pura, cada uma começando perto
de onde a anterior terminava. Somadas, cobriam 86 frames — e a peça tinha 150.

**Como aplicar:** ao montar o `TIMING`, conferir que a **última batida alcança o último
frame**. Se a soma das batidas não chega lá, faltou sobreposição ou falta uma batida de
fechamento (selo, contato, varredura de saída). Não resolver esticando as transições —
isso deixa lenta, não fluida.

### E8. Elemento que entra e congela

`AberturaMarca` v2, descoberto ao ler o `Content-Agent-Routing-Promptbase`. Todos os 7
elementos tinham uma fase só: entravam e ficavam parados até o fim. Densidade de **1,4
evento por segundo**, contra o alvo de 3–4.

**Por quê:** a peça passava na fluidez, então parecia resolvida. Mas passava porque a
camada de ambiente (lâminas grafite ao fundo) carregava sozinha — o **conteúdo** estava
parado. Cobertura alta com densidade baixa é exatamente esse sintoma.

**Como aplicar:** todo elemento significativo tem ciclo de vida de quatro fases —
entra → vive → reage → sai. Ao montar o `TIMING`, se cada nome aparece uma vez só, a peça
é um slide com transição. Nomear no padrão `ELEMENTO_FASE` e rodar `densidade.mjs`.

Medido: dando fases aos elementos que **já existiam**, sem inventar nenhum novo, a peça
foi de 7 para 16 eventos (1,4 → 3,2/s) e a cobertura subiu de 83% para 99–100% real.

### E9. Brilho glossy viajando por cima da wordmark

Testado e descartado na `AberturaMarca` v3. Um gradiente creme atravessando o logo dentro
de um container com `overflow: hidden` foi renderizado como **caixa cinza com aresta dura**
sobre a wordmark — o recorte do container revela o retângulo, e creme com opacidade baixa
sobre basalto lê cinza, não brilho.

**Como aplicar:** para "acender" um elemento, usar `filter: brightness()` em pulso (sobe e
volta) no próprio elemento. Sem recorte, sem aresta, sem artefato. E gloss é fora do tom
da marca de qualquer jeito — construção pesada não é vitrine.

### E10. Camada de ambiente com easing de saída morre no fim

`AberturaEscavadeira`, 2026-08-23. As lâminas de ambiente usavam a mesma `rampa()` das
batidas — `Easing.bezier(0.16, 1, 0.3, 1)`, expo-out. Resultado: **12 frames mortos no
fim da peça**, justamente onde o ambiente deveria carregar sozinho.

**Por quê:** expo-out desacelera até quase parar. Uma camada que existe para dar movimento
contínuo não pode ter curva que a freia — no último terço ela anda alguns pixels por
segundo em vez de por frame.

**Como aplicar:** camada de ambiente é **sempre linear**. Easing serve para batida, que
tem começo e fim; ambiente não tem fim. A aceleração final, se houver, também é linear.

### E11. Cor de ambiente precisa de delta de luma, não de "ser da paleta"

Mesma peça. Em fundo claro escolhi `borda #e4ddd0` sobre `fundo #e7e2d8` para as lâminas —
cor certa da paleta, papel certo. Medido: **33% dos frames mortos**. Delta de luma entre as
duas é ~3: a lâmina é invisível.

**Por quê:** o par que funcionava (grafite `#3f4448` sobre basalto `#1c1e20`) tem delta
~38. Eu transpus o *papel* da cor sem transpor o *contraste*.

**Como aplicar:** ao levar a camada de ambiente para outro fundo, calcular o delta de luma,
não confiar no papel do token. Em fundo claro o par é `concreto #c3c3c3` sobre
`fundo #e7e2d8` (delta ~32). Trocar isso levou de 33% para 8% de frames mortos — o resto
era o E10.

### E12. Zona segura disponível e não ligada

Mesma peça. `useLayout()` já devolvia `zonaSegura`, e mesmo assim posicionei o bloco da
marca com `paddingBottom: height * 0.06`. No reels, logo, régua e domínio caíram **abaixo
de y=1536** — dentro dos 20% que o Instagram cobre.

**Como aplicar:** em formato vertical, o bloco encosta na borda da **faixa útil**, nunca na
borda do quadro: `paddingBottom: zonaSegura.base + margem * 0.4`. Conferir renderizando o
still com as faixas desenhadas por cima:
`ffmpeg -i still.png -vf "drawbox=y=0:h=288:c=red@0.35:t=fill,drawbox=y=1536:h=384:c=red@0.35:t=fill" saida.png`

### E13. Ilustração representativa desenhada de memória

`AberturaEscavadeira` → `AberturaMinas`, 2026-08-23. Gastei quatro iterações numa
escavadeira em SVG. O usuário reprovou: "ficou muito feia". Troquei por contorno de Minas
Gerais e desenhei **de memória** — saiu uma ameba genérica. Segunda tentativa, mais
angular: ainda um polígono qualquer.

**Por quê:** máquina em perspectiva e contorno geográfico são formas que o olho conhece
bem demais. Qualquer desvio de proporção denuncia. Não existe "chegar perto" — ou está
certo, ou parece errado.

**Como aplicar, em ordem:**
1. **Forma geográfica se busca na fonte.** IBGE:
   `https://servicodados.ibge.gov.br/api/v3/malhas/estados/{codigo}?formato=application/vnd.geo+json&qualidade=intermediaria`
   (Minas = 31). Projetar em Mercator, simplificar com Douglas-Peucker, embutir o path.
2. **Objeto representativo:** procurar SVG licenciado, ou trocar por forma geométrica /
   abstrata que carregue o mesmo significado.
3. **Desenhar à mão só o que é geométrico** — diagonal, degrau, seta, moldura.

Uma tentativa de desenhar à mão já é aceitável. Duas é sinal de que a forma não é para ser
desenhada à mão.

### E14. Varredura calibrada no quadro, não na forma que ela revela

`AberturaMinas`, 2026-08-23. A troca de foto dentro do mapa varre em diagonal. Mapeei o
progresso de 0→1 sobre a largura do viewBox inteiro (−109 a 509, incluindo a inclinação).
Só que a silhueta de Minas ocupa x 36–364, e a aresta é **inclinada** — projetada,
o intervalo em que ela realmente cruza a forma é `x + tan(20°)·y` ∈ [103, 400].

Resultado: 52% do curso acontecia com a aresta fora da silhueta. Nos stills do meio da
janela não havia transição nenhuma — a troca lia como corte seco.

**Como aplicar:** o intervalo de uma varredura inclinada se calcula sobre os vértices da
forma revelada, não sobre o quadro: `min`/`max` de `x + tan(θ)·y`. Se a máscara é
retangular e cobre o quadro, os dois coincidem — por isso o erro passa despercebido até a
máscara ser recortada.

### E15. Expo-out em varredura vira corte seco

Mesma peça, mesmo dia, defeito somado ao E14. As trocas usavam a `rampa` padrão da casa,
`Easing.bezier(0.16, 1, 0.3, 1)` — expo-out. Em t=0,5 o valor easeado já é ~0,93: a aresta
atravessa nos primeiros 30% da janela e passa os outros 70% encostando no fim.

Expo-out é certo para **elemento que chega e assenta** (entrada de texto, wordmark, chip).
Está errado para **coisa que atravessa** — varredura, wipe, transição de foto, régua que
corre. Aí o easing tem que ser de entrada E saída: `Easing.bezier(0.62, 0.04, 0.34, 1)`.

**Regra:** o easing se escolhe pelo papel, não por ser o padrão do arquivo. Chega →
expo-out. Atravessa → in-out. Deriva contínua → linear (E10).

### E16. Elemento pequeno da marca sobre foto precisa de cama escura

Mesma peça. O marcador de Belo Horizonte (anel + ponto laranja, ~13px no viewBox) sumia
quando a foto de fundo era chão claro de pedreira. Laranja `#f26f21` sobre areia clara não
tem delta de luma.

**Como aplicar:** repetir o elemento em `basalto` por baixo, com `strokeWidth + 2,4` (ou
raio + folga), e o laranja cheio por cima. Nunca rebaixar a opacidade do laranja para
"encaixar" — isso é o E2 outra vez.

Detalhe que gerou defeito: a cama foi escrita como `raio·marcador + 1,4`. Com `marcador`
em 0, o raio ainda era 1,4 — um pontinho escuro em quadro desde o frame 0, antes de o
marcador existir. **Folga fixa somada a um valor animado vaza no estado zero.** O certo é
multiplicar tudo pelo progresso: `(raio + folga)·marcador`.

### E17. Ambiente normalizado pela duração fica lento em cena longa

`Institucional` (2100f, 9 cenas), 2026-08-23. A camada de ambiente recebia
`deriva` 0–1 normalizado pela duração da cena, com percurso fixo de ±0,35 da
largura. Numa cena de 384 frames isso dá **3,2px/frame** — metade do padrão A4 —
e o arquivo de entrega reprovou na regra 2: 47 frames seguidos abaixo de 0,3,
exatamente na primeira espera da cena, que não tinha nenhum outro evento.

**Por quê:** px/frame = percurso ÷ duração. Normalizar o progresso pela cena faz
a velocidade cair com o tamanho dela; o rascunho ainda passava (ruído do JPEG),
a entrega não.

**Como aplicar:** pensar a lâmina de ambiente em **px/frame (6–8)**, nunca em
fração da cena. Em peça multi-cena, escalar o percurso com a duração
(`Ambiente` ganhou prop `percurso`). E mapear as **janelas de espera** de cada
bloco repetido: cada uma precisa do próprio evento viajante (eco, pulso) — o
eco que cobre a espera do bloco 2 não cobre a do bloco 1.

### E18. Contador da casa formata pt-BR — ano vira "2.026"

Mesma peça. O `Contador` usa `toLocaleString("pt-BR")`, e o contador de anos da
abertura escreveu **"1991 — 2.026"** no still. Ano não tem separador de milhar.

**Como aplicar:** para ano (ou qualquer código/número de identidade), contar na
mão com `Math.round(interpolate(...))` sem formatação de locale. O `Contador`
fica para quantidades.

### E19. Saída por opacidade parcial repete o E2 na fase "sai"

Mesma peça. O recuo do contador laranja segurava opacidade 0,35 durante a
emenda — e o still da transição mostrou o número **marrom-fosco** sobre o
basalto por ~20 frames. É o E2 de novo, só que na saída.

**Como aplicar:** elemento laranja sobre fundo escuro sai para opacidade **0**
(rápido, dentro da janela da emenda), nunca fica estacionado em opacidade
parcial. Texto creme/cinza pode recuar parcial; laranja não.

### E20. Marca de terceiro se confere no tamanho de uso

Mesma peça. `frota-escavadeira-lavra.webp` tinha passado na `AberturaMinas` —
pequena, dentro da silhueta do mapa. Em painel de 44% do quadro, o logo SANY
da máquina dominou a composição. Trocada pela fila de caminhões do acervo.

**Como aplicar:** o veto do A13 a marca de terceiro depende do **tamanho
renderizado**, não da foto em si. Foto aprovada num contexto pequeno se
reavalia quando vai para painel grande — renderizar o still e olhar o logo.

---

## Acertos — repetir

### A1. Renderizar stills e olhar é o que pega o defeito

`AberturaMarca`. `tsc --noEmit` passou limpo em todas as versões, inclusive nas que tinham
tela preta na abertura, lâmina marrom e reveal órfão. Os quatro defeitos apareceram ao
renderizar `remotion still` em 4–6 frames espalhados e **olhar as imagens**.

**Como aplicar:** portão (b) da etapa 6 não é opcional. Escolher frames no início, em cada
batida e no final. Typecheck verde não é verificação de motion.

### A2. Um componente para os três formatos

`useLayout()` (`src/marca/layout.ts`) deriva `orientacao`, `escala` e `margem` de
`useVideoConfig()`. Landscape, reels e feed saem do mesmo componente, sem duplicar árvore
de layout. Registro em `Root.tsx` como `<Peça>-<Formato>`.

**Como aplicar:** padrão da casa. Só duplicar componente se a composição mudar de verdade
entre formatos — o que até hoje não aconteceu.

### A3. Medir movimento antes de entregar

`ffmpeg -vf "scale=320:-1,tblend=all_mode=difference,signalstats"` dá o YAVG por frame, que
é uma medida direta de quanto a imagem mudou. Foi o que provou que a `AberturaMarca` tinha
72% dos frames mortos, coisa que nenhuma leitura de código revelaria.

**Como aplicar:** `scripts/fluidez.mjs` faz isso e devolve veredito. Rodar sempre, antes
de mostrar a peça.

### A4. Lâminas grafite em contramovimento como camada de ambiente

`AberturaMarca` v2, 2026-08-23. Duas lâminas em `grafite #3f4448` sobre basalto,
percorrendo o quadro em sentidos opostos ao longo dos 150 frames (~8px por frame). Levou a
peça de **72% de frames mortos para 0%**, com 83–95% de movimento real nos três formatos.

**Por quê:** grafite sobre basalto tem contraste suficiente para registrar como movimento
(delta de luma ~38) sem competir com a wordmark laranja. E resolve o problema do E2: como
é uma cor cheia da paleta, não precisa de opacidade e não vira marrom.

**Como aplicar:** é a camada de ambiente padrão da casa para peça em fundo escuro. Duas
lâminas, espessura 0.025–0.035 da menor dimensão, sentidos opostos, percurso de ~0,6× a
largura ao longo da peça inteira. Nos stills lê como profundidade, não como sujeira —
conferido nos frames 2, 45, 95 e 149.

### A5. Varredura de saída fecha a peça em movimento

Repetir as lâminas de abertura no sentido inverso, com metade da espessura, nos últimos
~44 frames. Garante a regra 3 (não terminar parada) e sela a peça em vez de deixá-la
congelar esperando o loop.

### A6. Densidade por ciclo de vida, não por elemento novo

`AberturaMarca` v3. Para sair de 1,4 para 3,2 eventos/s, **nenhum elemento novo entrou na
peça** — a wordmark ganhou brilho/reage/recua, o eyebrow ganhou recuo, a régua ganhou
follow-through, a assinatura e o domínio ganharam assentamento, o ambiente ganhou
aceleração no fim.

**Como aplicar:** quando faltar densidade, olhar a lista de elementos que já existem e
perguntar de cada um "o que ele faz enquanto está em cena, e como reage quando o próximo
entra". Elemento a mais é poluição visual; fase a mais é vida.

### A7. Verificar densidade antes de renderizar

`densidade.mjs` roda em milissegundos lendo o `TIMING` do código. `fluidez.mjs` precisa de
um render completo. Rodar o barato primeiro pega subespecificação enquanto ainda é só
editar uma tabela de números.

Os dois medem coisas diferentes e nenhum substitui o outro: densidade lê a **intenção no
código** (dá para inflar com entradas que não animam nada), fluidez mede o **resultado na
tela**.

### A8. Malha do IBGE como line-art

`AberturaMinas`. Pipeline que resolveu o contorno do estado, sem nenhuma dependência nova
no projeto (script avulso de node, path embutido como constante):

1. Baixar a malha oficial do estado pela API do IBGE (GeoJSON)
2. Projetar em Mercator — **converter longitude E latitude para radianos**. Deixar a
   longitude em graus achata a forma, porque as duas coordenadas ficam em unidades
   diferentes
3. Pegar o anel de **maior caixa delimitadora**, não o de mais vértices — o anel mais
   detalhado costuma ser uma ilha de poucos pixels
4. Simplificar com Douglas-Peucker, não por descarte de distância: 876 → 152 vértices com
   tolerância de 1,6px, preservando as feições que identificam o estado
5. Fatiar o anel em 4 trechos contíguos, começando pelo ponto mais a oeste, para o traço
   abrir ali e girar

O `pathLength="1"` funciona igual num path de 152 vértices e num de 6.

### A9. Ilustração line-art: menos traço, e nenhum cruzamento

`AberturaEscavadeira`. A escavadeira levou quatro iterações visuais. O que resolveu:

1. **A lança em banana é a assinatura da silhueta.** Com o braço como diagonal reta a
   máquina lia como guindaste. A curva que sobe, arqueia e desce a ponta é o que faz o
   olho reconhecer "escavadeira" em meio segundo.
2. **Forma que cruza forma vira ruído de linha.** Na fase de traço puro, a lança cortando a
   cabine em diagonal parecia erro de desenho. Afastar a lança para a direita da cabine e
   subir o braço para passar acima dela limpou tudo.
3. **Traço fino.** 2.2 num viewBox de 400 (≈6,5px na tela) contra os 3.2 iniciais — a
   referência usa linha delgada, e line-art industrial pede poucos traços certos.

**Como aplicar:** desenhar, renderizar um still e olhar, corrigir. Não tentar acertar de
primeira no papel. O `pathLength="1"` + `strokeDasharray="1"` +
`strokeDashoffset={1 - p}` desenha qualquer path sem medir comprimento no DOM.

### A10. Recuo de traço por espessura, não por opacidade

Mesma peça. O contorno laranja precisava recuar quando o preenchimento basalto assumia. A
primeira tentativa baixou a opacidade para 0,35 — e caiu direto no E2: laranja rebaixado
sobre escuro lê marrom.

**Como aplicar:** afinar o traço (2.2 → 0.9) mantendo o laranja cheio. O contorno vira fio
delgado, o contraste se mantém, e ainda é um evento de ciclo de vida.

### A11. Foto dentro da silhueta como fase de textura

A aérea de terraplenagem recortada pela silhueta da escavadeira (`clipPath` com os mesmos
paths, `<image>` dentro) é a batida mais forte da peça — foi o pico de movimento na
referência também. Terra vermelha da obra dentro da máquina que a move: a imagem diz o que
a empresa faz sem uma palavra.

**Como aplicar:** o `clipPath` reaproveita os paths do desenho, então não há custo de
autoria. Usar foto própria do cliente; foto de fabricante traz marca de terceiro junto.

### A12. Textura não é uma foto — é uma sequência que troca

`AberturaMinas`, 2026-08-23. O usuário pediu: *"a imagem que preenche vamos trocar por de
frotas, e eu não quero uma foto, pode ser várias alterando. PARA DEIXAR MAIS ANIMADO."*
Ele estava certo, e a métrica confirmou: quatro fotos trocando levaram a cobertura real de
56–59% para **60% nos três formatos**, e a densidade de 3,25 para 3,63 eventos/s.

Foto única com parallax lento **cobre o tempo mas não acontece nada**: 0,4 unidade de
viewBox por frame é deriva, não batida. O miolo da peça ficava sem evento próprio enquanto
o wordmark resolvia por cima.

**Como aplicar:**
- As fotos ficam **todas montadas** o tempo todo, empilhadas. O que anima é a área
  revelada de cada uma, via `clipPath` de polígono. Nada de montagem condicional (E5).
- A transição usa o grafismo da marca — aqui, a diagonal de 20° do logo, com a aresta
  **acesa em laranja cheio** enquanto passa. Transição genérica (crossfade) desperdiça uma
  batida que podia assinar a marca.
- Fotos consecutivas derivam em **sentidos opostos**: a troca continua legível depois que
  a aresta já passou.
- Ordenar as fotos como arco narrativo, e deixar por último a de leitura mais simples —
  é ela que fica embaixo do wordmark com a forma já pequena.

### A13. Enquadrar na foto, não na caixa de destino

Mesma peça. Foto panorâmica (2,3:1) dentro de silhueta quase quadrada perde as pontas: o
`slice` tem que cobrir a altura, e sobra imagem para os lados que nunca aparece. Mexer no
`x`/`width` do `<image>` não resolve — a escala está presa pela altura.

**Como aplicar:** recortar o arquivo na origem para perto da proporção da forma, com
`ffmpeg -vf crop=w:h:x:y`. Foi o mesmo comando que tirou a marca d'água da FX do canto
superior esquerdo de duas fotos do acervo — logo do cliente dentro do mapa competiria com
a revelação do wordmark.

**Antes de usar foto de acervo, abrir e olhar.** Nas 20 candidatas havia marca d'água
queimada, carimbo de data/GPS/nome de técnico, placa de veículo, e foto de catálogo de
fabricante com marca de terceiro. Nome de arquivo mente: `vista-aerea-mina.webp` era um
pátio de escavadeiras no chão.

### A14. Peça longa: uma cena por arquivo, TIMING local, emenda por varredura

`Institucional` (70s, 2100 frames, 9 cenas), 2026-08-23. Primeira peça multi-cena
da casa, aprovada nos quatro portões com 95% de cobertura real e 0 frames mortos.
O que funcionou e vale repetir:

1. **Uma cena por arquivo, com `TIMING` em frames locais.** O `densidade.mjs`
   valida cena a cena (o alvo de 3–4/s vale para cada uma), e o `<Sequence>` do
   orquestrador reseta o `useCurrentFrame` — os números do TIMING ficam legíveis.
2. **Tabela de cenas no orquestrador** com os inícios encadeados por sobreposição
   fixa de 24f, e a duração total derivada da tabela. A última batida da última
   cena alcança o último frame global (E7 em escala de peça).
3. **Emenda = varredura diagonal com aresta acesa** (o grafismo da marca, A12),
   nunca crossfade: a cena nova aparece à esquerda da aresta, por cima da
   anterior, que continua viva embaixo — as duas cenas em movimento durante a
   emenda seguram a cobertura.
4. **`premountFor={30}`** em cada Sequence: as fotos da cena seguinte carregam
   antes de a varredura revelá-la.
5. **Curvas compartilhadas por factory** (`criaCurvas(frame)`) em vez de nove
   cópias de `rampa`/`pulso`/`linear` — e a escolha por papel continua valendo
   dentro de cada cena.

Custo real: rascunho 2100f ≈ 2min, entrega ≈ 4min, 73MB. Um ciclo completo de
correção (editar + re-render + fluidez) cabe em ~6min — planejar as correções em
lote antes de re-renderizar.

### A15. Locução ElevenLabs: clipe por cena, J-cut, loudnorm em duas passadas

`Institucional`, 2026-08-23 — primeira peça com áudio da casa. O fluxo que
funcionou de primeira:

1. **Um clipe por cena** (`public/audio/cena01–09.mp3`), roteiro escrito para
   caber na janela de cada cena a ~2,5 palavras/s. Todos couberam com folga;
   conferir com `ffprobe -show_entries format=duration` antes de fiar.
2. **Fiação no orquestrador:** `<Sequence from={de - JCUT}>` com `<Audio>` por
   cena, separada das Sequences visuais — o J-cut (4f) não pode adiantar o
   premount nem o recorte da varredura. O Remotion mistura e exporta AAC no
   próprio render, sem config extra.
3. **Nível medido do ElevenLabs:** −17,8 LUFS integrado, pico −2,1 dBTP por
   clipe; o master renderizado saiu em −18,1 LUFS. Ganho direto de +4 dB
   **estouraria o pico** — normalizar por `loudnorm` em duas passadas
   (medir → aplicar com `linear=true` e `-c:v copy`, re-encodando só o áudio):

   ```
   ffmpeg -i in.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null -
   ffmpeg -i in.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=…:\
     measured_TP=…:measured_LRA=…:measured_thresh=…:offset=…:linear=true" \
     -c:a aac -b:a 192k master.mp4
   ```

   Resultado: **−14,1 LUFS / −1,3 dBTP** — no alvo da doutrina. O pós-passe
   precisa ser repetido a cada re-render; o arquivo de entrega passa a ser o
   `-master.mp4`.
4. Licença registrada em `CREDITOS.md` do projeto (doutrina de audio.md).

Pendente de prática: bed musical com ducking e SFX de transição — a peça está
locução + vídeo apenas.

### A16. Stories aprovados viram Reels reaproveitando a geometria

`ReelsPontoCego`, 2026-09-28. A sequência de stories em line-art (HTML + CSS,
VuskVS) já tinha os paths aprovados pelo usuário. Copiados literalmente pra
`comum.tsx` e desenhados com `pathLength=1` + `strokeDashoffset` (A9), saíram
certos no primeiro still: nenhuma iteração de desenho (contra quatro do E13).

Densidade na primeira passada: 5 de 7 cenas entre 2,0 e 2,5 eventos/s. Corrigido
só com fases de elementos existentes (A6): recuo do marcador anterior, tique do
relógio, respiração do desenho, brilho da linha ativa, rádio vibrando, cursor
que some. Todas foram a 3,0–3,45/s sem elemento novo. Entrega: **90% real,
1 frame morto** em 1525 frames, na primeira medição.

**Como aplicar:**
- Peça que já existe aprovada em outro meio (story, post, site): importar a
  geometria, não redesenhar
- Pulso laranja sobre basalto some **afinando o traço**, não perdendo opacidade
  (E2/A10 estendido pro anel em loop). Funcionou limpo nos stills
- Barra de progresso segmentada no topo, logo abaixo da zona segura, serve de
  camada de movimento contínua e de gancho de retenção ao mesmo tempo

### A17. Locução em arquivo único: cenas se encaixam na fala, não o contrário

`ReelsPontoCego`, 2026-09-28. O usuário mandou a narração num MP3 só (40,4s),
não um clipe por cena. Cortar em sete e esticar pausas quebraria o ritmo da voz.
O que funcionou:

1. **Tempo de palavra com whisper.cpp** (`RemotionFX/scripts/transcrever.mjs`,
   modelo `small`, `language: "pt"`). O `installWhisperCpp` do Remotion **quebra
   em caminho com espaço no Windows** (`Expand-Archive` sem aspas): extrair o
   `whisper-bin-x64.zip` na mão em `whisper.cpp/` e rodar de novo.
2. **Conferir contra `silencedetect`** (`noise=-35dB:d=0.3`, e `-38dB:d=0.08` pra
   zona ambígua). O whisper erra fronteira de frase em até ~0,8s; a pausa medida
   é a verdade. Os dois juntos resolveram a única dúvida (pausa do "E você?").
3. **Áudio contínuo do frame 0; emenda de cada cena 10f antes da primeira palavra
   dela.** Durações de cena derivadas: `dur_i = de_{i+1} − de_i + TRANSICAO`.
   Instantes internos (opções do quiz, "um/dois/três", check no "te ver")
   postos 2f antes da sílaba.
4. A peça encolheu de 51s pra 43s e a densidade subiu (3,2–5,1/s); fluidez de
   entrega **92% real, 2 frames mortos**. Master −17,4 → **−14,06 LUFS /
   −1,41 dBTP** com o loudnorm do A15.

**Como aplicar:** escrever as cenas com duração estimada, e na sincronia
reescrever só os `TIMING` a partir da tabela de palavras. Conferir com uma folha
de quadros extraídos nos instantes das palavras-chave.

### A18. Zoom de destaque: a técnica que o usuário mais quer ver

`ReelsPontoCego`, 2026-09-28. Aprovado com "adorei a qualidade", e o que ele
destacou foi um só momento: na Cena 3, quando a área cega abre e a caminhonete
desce pra dentro dela, a `CAMERA_ATRAVESSA` dá um mini zoom (escala 1 → 1,1 com
deslocamento na direção da área, in-out, ~40f) **naquela informação**. Palavras
dele: "isso gera um dinamismo muito grande para o vídeo". E apontou onde faltou:
no quiz, A, B e C só estouraram no lugar, sem a câmera ir até cada um.

**Regra:** toda informação que a locução nomeia ganha um zoom de destaque no
momento em que surge. Exemplos que deviam ter tido: cada opção A/B/C do quiz
(câmera vai em A, desliza pra B, desliza pra C, recua pro quadro todo), o X
batendo na estrutura na Cena 1, o "3" na transição, o ícone de cada regra, a
palavra DDS.

**Spec:**
- Escala 1,12–1,25 no elemento (maior pra elemento pequeno), deslocamento pra
  trazer o elemento perto do centro do quadro
- Entrada 12–18f `atravessa` (in-out, `Easing.bezier(0.62, 0.04, 0.34, 1)`);
  segura enquanto a locução explica (a camada de ambiente e os loops seguem
  vivos, então o hold não morre); saída 12–16f ou desliza direto pro próximo
  destaque, sem voltar ao 1 no meio
- Sequência de destaques (A → B → C) é **pan entre alvos com a escala mantida**,
  e só no fim recua ao quadro inteiro
- Chega 2f antes da palavra, igual ao texto (`audio.md`)
- É acento, não colchão: nada a ver com a rampa global do E1

**Como implementar:** um wrapper de câmera por cena (div com `scale` +
`translate`), alvo em px do quadro. Tabela de alvos no `TIMING`
(`ZOOM_A: [129, 143]`, `ZOOM_B: [157, 171]`...), e o `translate` calculado como
`(centro − alvo) × (escala − 1) / escala` interpolado entre alvos. Texto de
título fora do wrapper quando precisar continuar legível; dentro quando o zoom
é justamente nele.

---

## Números calibrados

Medidos em 2026-08-23, `AberturaMarca` 1920×1080 30fps, vídeo reescalado para 320px antes
da comparação:

| o que estava se movendo | YAVG |
|---|---|
| lâmina diagonal cruzando o quadro inteiro | 8 – 15 |
| texto entrando por fade + régua fina desenhando | 0,12 – 0,29 |
| push-in global de 0,017% por frame | 0,02 – 0,05 (= ruído) |

Daí os limiares: **< 0,10 morto · 0,10–0,40 fraco · > 0,40 real**.

### Tier de render altera a medição

Medido na mesma peça, mesmo movimento:

| tier | mediana | pico | tempo | arquivo |
|---|---|---|---|---|
| rascunho (jpeg 80, CRF 23, fast) | 0,699 | 16,40 | 7,9s | 851 KB |
| entrega (png, CRF 8, slow) | 0,594 | 13,05 | 16,6s | 1160 KB |

O rascunho lê **~18% mais alto** porque o ruído de bloco do JPEG soma à diferença entre
frames. A entrega é a leitura honesta — **medir fluidez sempre no arquivo de entrega**.

O limiar de "real" estava em 0,60, em cima da faixa onde a camada de ambiente pousa
(0,5–0,7); a mesma peça classificava 83% real no rascunho contra 48% na entrega. Baixado
para 0,40, os dois tiers dão veredito idêntico.

Sobre o custo: o tier de entrega é 2,1× mais lento e 1,4× maior. Barato — usar rascunho
só durante a iteração.

---

## Correções ao `claude-motion-prompts_1.md`

Arquivo de origem do método, em `RemotionFX/`. O que dele **não** vale para vídeo:

- **"Animar apenas transform e opacity"** — regra de performance de compositor de browser.
  Renderizando MP4 no Remotion não há custo de layout em tempo real: `clip-path`, `filter`,
  `width` e `height` são livres.
- **`prefers-reduced-motion`, `AnimatePresence`, `motion/react`** — só para peça web/UI.
  Não existe em vídeo renderizado.
- **Tokens de duração 100–400ms** — são de UI. Vídeo tem escala própria (ver
  `referencias/vocabulario.md`).
- **Stagger 40–60ms** — ver E6.
- **PROMPT 2 não existe** no arquivo (pula de 1 para 3). Preenchido em
  `referencias/extrair-spec.md` como o método sem ffmpeg.

---

## Fontes externas incorporadas

### `github.com/RinDig/Content-Agent-Routing-Promptbase` — lido em 2026-08-23

296 arquivos. A maior parte é a operação de conteúdo do dono do repo (brand vault, topic
engine, script lab, produtos, ritmo de produção) — o usuário tem o VuskVS para isso e
nada dali se aproveitou. O valor está em `animation-studio/`.

**Incorporado:** ciclo de vida em 4 fases · densidade de 3–4 eventos/s · zonas seguras das
redes · mínimos de tipografia · tiers de qualidade de render · `premountFor` em
`<Sequence>` · CSS animation não renderiza · presets de mola nomeados · `TransitionSeries`
para multi-cena · CountUp/StatGrid (viraram `Contador` e `GradeKpi`) · formato de spec com
`BEATS` e micro-blocos de 10–20 frames · "3+ camadas — um texto sobre fundo escuro é um
slide, não uma animação".

**Descartado:** paleta e tipografia deles · GlitchText, GradientText e partículas (fora do
tom industrial da marca; gradiente como preenchimento é proibido) · arco de 35–38s para
short educativo (nossas peças são de 5–15s) · componentes de domínio (AST, MCP, chat UI).

Vale reler se surgir necessidade de peça longa multi-cena — o `AgentDeconstruction` deles
tem estrutura de cenas encadeadas que ainda não exercitamos.

### `sistema-motion-design.md` — lido em 2026-08-23

Documento de sistema de motion, 10 partes. Escrito para um contexto híbrido UI/vídeo, e é
disso que vêm as duas distorções que ele carrega (escala de duração de interface, e piso de
visibilidade de canvas ao vivo em vez de MP4 comprimido).

**Incorporado:**

| o que | onde foi parar |
|---|---|
| sistema de curvas com **papéis** (chega / atravessa / sai / deriva) | `vocabulario.md` — reescreveu a tabela de easing |
| motion blur, ângulo de obturador de 180° | `camera-e-imagem.md` 1 |
| parallax por planos de profundidade (0,2 / 0,5 / 1,0 / 1,4×) | `camera-e-imagem.md` 2.1 |
| handheld com ruído coerente, shake com envelope exponencial, rack focus | `camera-e-imagem.md` 2.3–2.5 |
| pilha de tratamento de imagem e a ordem dela | `camera-e-imagem.md` 3 |
| antecipação (3–8px, 2–3 frames) e follow-through (2–4 frames) | `reconstruir-remotion.md` |
| duração escala com `(distância/100)^0.5` | `reconstruir-remotion.md` |
| stagger diagonal em grid, não por índice do array | `reconstruir-remotion.md` |
| compensação de tracking em texto que escala | `reconstruir-remotion.md` |
| hierarquia de transições (match cut → … → crossfade) e o teto de 40% de crossfade | `reconstruir-remotion.md` |
| piso de 0,8s (24 frames) legível por bloco de texto | `doutrina-fluidez.md` |
| curva de densidade em três atos | `doutrina-fluidez.md` |
| cinco camadas de áudio, ducking, J-cut, −14 LUFS | `audio.md` (novo, ainda não praticado) |
| ProRes para master e alfa | `qualidade-render.md` |
| repertório de técnicas e anti-padrões | `vocabulario.md` |

**Descartado:** tudo de UI (hover, toggle, carrossel, cursor magnético, notification pop,
photo stack) · tokens de duração de 80–500ms · "mola em CSS via `linear()`" (não existe
runtime CSS em Remotion) · margens de segurança de 90%/80% — as nossas são por plataforma
e mais rígidas.

#### Onde ele está errado, e nós sabemos por medição

**1. Amplitude de "moving hold" e de deriva de câmera.** Ele recomenda escala 1,0 → 1,04 em
6s e translação de 0,5–2px em 2–3s. Isso é 0,022–0,036 px/frame — **8× ou mais abaixo** do
piso em que o pixel da borda anda 1px por frame. É exatamente o E1, que já custou uma peça
aqui. A intenção (nenhum frame congelado) está certa; o número, não. Detalhe em
`camera-e-imagem.md` 2.2.

**2. Dois dos quatro nomes de curva que ele propõe.** A seção de abertura é sobre acertar
nomenclatura de easing, e então erra:
- `cubic-bezier(0.7, 0, 0.84, 0)` ele chama de quint-in — é **expo-in** (quint-in é `0.64, 0, 0.78, 0`)
- `cubic-bezier(0.65, 0, 0.35, 1)` ele chama de quint-in-out — é **cubic-in-out** (quint-in-out é `0.83, 0, 0.17, 1`)

Os *valores* estão bons e foram adotados; os rótulos foram corrigidos em `vocabulario.md`
contra `easings.net`.

**3. Stagger de 40–60ms.** A 30fps são 1–2 frames: some na tela. Mesmo erro do
`claude-motion-prompts_1.md`, já registrado no E6.

**4. Ele não menciona que grão animado destrói a métrica de fluidez.** Recomenda grão
regenerado por frame (corretamente, do ponto de vista de imagem) sem notar que isso faz
todo pixel mudar em todo frame. Numa casa que mede fluidez por diferença de luma, isso
aprova peça parada. Registrado em `doutrina-fluidez.md` e virou regra dura no `SKILL.md`.

#### Onde ele confirma o que já fazíamos

Sobreposição de 40–70% (a nossa é 50–70%) · máscara em vez de fade letra a letra ·
`tabular-nums` e contador com easing, não linear · nada de linear fora de loop e deriva ·
elevação do ponto preto (o `basalto #1c1e20` já está acima do piso que ele indica) ·
wipe orgânico acima de crossfade na hierarquia — que foi a escolha da troca de fotos da
`AberturaMinas` no mesmo dia, por razão de marca, antes de ler o documento.

#### Pendente de verificação

`camera-e-imagem.md` e `audio.md` são os únicos arquivos da skill cujos números **não**
foram medidos aqui. As APIs (`@remotion/motion-blur`, `@remotion/noise`, codecs e perfis de
ProRes) estão conferidas contra a versão 4.0.515; os valores de opacidade de grão, amplitude
de handheld e níveis de LUFS vêm da fonte. Ao usar pela primeira vez: medir e gravar.
