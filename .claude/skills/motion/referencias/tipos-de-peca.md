# Catálogo de peças

> Ler na etapa 1 (identificar) e na etapa 3 (blueprint sem referência).
>
> Cada tipo traz duração alvo e uma **estrutura de batidas já sobreposta** — a grade
> padrão da casa quando não há vídeo de referência para medir. Os frames são a 30fps.
> A camada de ambiente está indicada em cada um: sem ela a peça reprova.

## Como usar

Sem referência, pegar a grade do tipo e ajustar à duração pedida proporcionalmente. Com
referência, a grade medida manda — o catálogo serve só para conferir se nenhuma batida
óbvia do tipo ficou de fora.

Todos os tipos servem os três formatos por `useLayout()`. Onde a composição muda de
verdade entre landscape e vertical, está anotado.

**As grades abaixo listam só as entradas.** Elas são o esqueleto, não a peça pronta: para
chegar aos 3–4 eventos por segundo, cada elemento precisa das fases seguintes do ciclo de
vida. O padrão que se aplica a quase todos:

| elemento | fases a acrescentar depois da entrada |
|---|---|
| título / wordmark | assenta · reage quando a próxima batida chega · recua na saída |
| foto | parallax contínuo · escurece quando o texto entra |
| item de lista | destaca na vez dele · escurece quando o próximo entra |
| número / contador | conta (é a fase "vive") · assenta · rótulo reage |
| régua / linha | desenha · alcança (follow-through) |
| eyebrow | entra · recua quando a atenção desce |

Exemplo medido: a `AberturaMarca` saiu de 7 eventos (1,4/s, tudo congelando após entrar)
para 16 (3,2/s) **sem nenhum elemento novo** — só dando fases aos que já existiam.

---

## 1. Abertura / sting de marca

**3–5s.** Intro e encerramento reutilizáveis em qualquer outra peça.

| frames (de 150) | batida |
|---|---|
| 0–30 | lâminas diagonais varrem o quadro, stagger 5f |
| 14–40 | wordmark revelada por wipe na esteira das lâminas |
| 34–54 | eyebrow do grupo entra |
| 48–74 | régua diagonal desenha sob a wordmark |
| 58–86 | assinatura entra por tracking + fade |
| 86–150 | **precisa de batida aqui** — acento saindo, selo de contato, ou lâmina de saída |

**Ambiente:** acento diagonal derivando no fundo, 3–8px/frame, do frame 30 ao fim.

**Armadilha conhecida:** a versão original desta peça terminava no frame 86 e segurava
64 frames parados. Ver `aprendizado.md` E1.

---

## 2. Card de serviço

**10–15s.** Uma frente por peça: terraplenagem, supressão vegetal, segurança do trabalho,
mineração, locação de frota.

| batida | duração |
|---|---|
| foto entra com escala + máscara | 24f |
| eyebrow da frente (mono) | 8f, sobreposto a 60% |
| título em Barlow, palavra por palavra | 20f, stagger 4f |
| 3 pontos de capacidade, um a um | 12f cada, stagger 6f |
| CTA / assinatura de marca | 16f |
| saída ou corte para o sting | 12f |

**Ambiente:** parallax lento da foto (60–120px ao longo da peça) **mais** um acento
diagonal. Só o parallax costuma ficar no limite do "fraco".

**Fotos:** `public/fotos/servico-*.webp`.

---

## 3. Antes e depois

**8–12s.** Obra ou área recuperada.

| batida | duração |
|---|---|
| foto "antes" entra | 20f |
| etiqueta ANTES (mono, tinta3) | 8f |
| divisória diagonal varre e revela o "depois" | 24f — é a batida principal |
| etiqueta DEPOIS (mono, laranja) | 8f |
| número do resultado conta | 30f |
| valor "antes" aparece ao lado, apagado | 12f |

**Regra da marca, inegociável:** todo antes/depois mostra os **dois** lados. Número de
resultado sem o valor "antes" ao lado é proibido. O "antes" fica em tinta3 ou riscado.

**Ambiente:** a própria divisória continua derivando devagar depois da varredura.

---

## 4. KPI / contador

**6–10s.** Dias sem acidente, anos de atuação, obras entregues.

| batida | duração |
|---|---|
| eyebrow do indicador | 10f |
| número conta de 0 ao valor | 40–60f — a batida longa, sustenta a peça |
| unidade / rótulo entra ao lado | 12f, sobreposto ao fim da contagem |
| régua diagonal desenha | 18f |
| contexto (uma linha) entra | 16f |

**Componentes:** `Contador` e `GradeKpi` em `src/componentes/`. Para o par antes/depois,
`AntesDepois` já traz a regra da marca embutida (os dois lados, "antes" em tinta3).

**Ambiente:** o contador **é** a camada de ambiente enquanto roda — cada troca de glifo é
um delta grande. Depois que ele para, precisa de outra coisa.

**Restrição do cliente:** peça pública não informa número operacional (colaboradores,
frota, volume). Só ano de fundação/atuação e contato. Confirmar o dado antes de animar.

---

## 5. Institucional / manifesto

**20–30s.** Propósito, impacto social, desenvolvimento de pessoas e comunidades.

Estrutura em 4 a 6 blocos encadeados, cada um com foto + uma frase. Bloco novo entra
enquanto o anterior sai — **a sobreposição entre blocos é o que sustenta a peça inteira**.

| por bloco | duração |
|---|---|
| foto entra por máscara | 20f |
| frase entra, linha por linha | 18f, stagger 5f |
| bloco sai enquanto o próximo entra | 16f de sobreposição |

**Ambiente:** parallax contínuo da foto de cada bloco.

**Tom:** institucional mas caloroso. Sem emoji, sem jargão de guru.

---

## 6. Frota / equipamento

**8–12s.** Uma máquina em destaque.

| batida | duração |
|---|---|
| silhueta / foto da máquina entra deslizando | 24f |
| nome do equipamento (Barlow 800) | 14f |
| 3 especificações, uma a uma | 10f cada, stagger 5f |
| selo de disponibilidade / locação | 14f |

**Ambiente:** a máquina continua deslizando devagar (3–5px/frame) durante toda a peça —
resolve o ambiente e reforça a ideia de operação.

---

## 7. Vaga / recrutamento

**10–15s.**

| batida | duração |
|---|---|
| eyebrow "TRABALHE CONOSCO" | 10f |
| cargo (Barlow 800) | 18f |
| local e regime | 12f, stagger 5f |
| 3 requisitos | 10f cada, stagger 6f |
| como se candidatar | 16f |

**Ambiente:** acento diagonal derivando. Peça de texto tem pouca área em movimento — o
ambiente aqui é obrigatório, não opcional.

---

## 8. Obra / mapa

**10–15s.** Onde o grupo atua.

| batida | duração |
|---|---|
| mapa do Brasil desenha por stroke | 40f — batida longa |
| pontos dos estados acendem, um a um | 6f cada, stagger 5f |
| rótulo do estado em destaque | 12f |
| contagem de obras por região | 20f |

**Ambiente:** o desenho do stroke sustenta o começo; depois, os pontos acendendo em
sequência. Unidades reais: Belo Horizonte (MG), Parauapebas (PA), Sinop (MT), Manaus (AM).

---

## 9. Depoimento / citação

**8–12s.**

| batida | duração |
|---|---|
| foto entra com máscara | 20f |
| aspas / marcador diagonal | 8f |
| citação, linha por linha | 16f por linha, stagger 6f |
| autor e cargo | 12f |

**Ambiente:** parallax da foto + a diagonal. Citação longa tende a ficar parada entre as
linhas — apertar o stagger antes de aumentar a duração.

---

## Escolha do formato

| formato | quando |
|---|---|
| reels 1080×1920 | Instagram Reels e Stories — o principal do grupo |
| feed 1080×1350 | post de feed |
| landscape 1920×1080 | LinkedIn, YouTube, TV de recepção, deck para diretoria |

Peça de muito texto (vaga, depoimento) respira melhor em vertical. Mapa e antes/depois
funcionam melhor em landscape, mas os três formatos sempre saem do mesmo componente.
