# Áudio

> **Primeira prática: `Institucional` (2026-08-23), locução ElevenLabs** — fluxo, números
> medidos e comando de masterização em `aprendizado.md` A15. Alvo de −14 LUFS / J-cut /
> camada dominante confirmados na prática. **Bed musical, ducking e SFX seguem sem
> prática** — esses números continuam vindo da fonte externa.
>
> Ler quando o usuário pedir peça com trilha, locução ou SFX.

---

## As cinco camadas

Uma trilha bem montada tem cinco camadas, e a maior parte do amadorismo está em ter só
duas (música + whoosh).

| camada | nível | papel |
|---|---|---|
| **música** | −22 a −18 LUFS | bed contínuo |
| **locução** | −16 a −14 LUFS | sempre a camada dominante |
| **SFX de transição** | — | whoosh, impacto. **Só em mudança de capítulo.** |
| **SFX de interface** | −30 LUFS ou menos | click, tick. Sutis. |
| **ambiência / room tone** | quase inaudível | preenche o silêncio digital |

Alvo final: **−14 LUFS integrado**, pico verdadeiro abaixo de **−1 dBTP**. Acima disso a
plataforma normaliza e você perde o controle do resultado.

---

## Ducking

Quando a locução entra, a música abaixa 6–9 dB automaticamente. Attack ~80ms, release
~400ms. Sem isso, música e voz brigam e a locução perde inteligibilidade — que é o único
motivo de ela existir.

---

## Anatomia de um impacto

Um impacto bom tem três componentes somados. Falta de qualquer um tem nome:

| componente | faixa | o que dá | sem ele |
|---|---|---|---|
| sub | 40–80 Hz | o peso, o que se sente | soa fino |
| transiente | 2–5 kHz | o ataque, a clareza | soa abafado |
| cauda (reverb) | 200–600ms | o espaço | soa seco e sintético |

**Doppler no whoosh:** whoosh que atravessa a tela sobe de pitch na aproximação e cai no
afastamento — 5–8% de variação. Quase ninguém faz, e soa imediatamente mais caro.

---

## Sincronia com a imagem

**A palavra aparece 1 a 2 frames ANTES da sílaba**, não em cima dela. Sincronia
perfeitamente alinhada lê como atrasada, porque o processamento visual é mais lento que o
auditivo.

**J-cut:** o áudio da próxima cena entra 3–6 frames antes do corte visual. Amarra as cenas.
É como edição profissional soa sem que ninguém perceba.

**Silêncio é pontuação.** 200–400ms de silêncio total antes do CTA vale mais que qualquer
SFX — o ouvido interpreta silêncio como ênfase.

---

## Anti-padrões

- SFX em cada micro-evento
- Whoosh em corte que não muda de contexto
- Música sem ducking sob locução
- Silêncio absoluto (sem room tone) entre falas — soa como arquivo cortado, não como pausa

---

## O que isso muda no resto da skill

Se a peça tiver áudio, **a grade de batidas passa a ser negociada com a música**, não só
com a duração. O corte seco no tempo forte deixa de ser risco e vira ferramenta (ver a
hierarquia de transições em `reconstruir-remotion.md`).

E a densidade ganha uma âncora externa: 3–4 eventos por segundo continua sendo o piso, mas
**quais** frames recebem os eventos passa a ser decidido pelo beat, não pela distribuição
uniforme.

---

## Licenciamento

Nenhum ativo de terceiro sem licença — vale para trilha e SFX como vale para foto. Se a
trilha vier de banco, registrar a licença junto da peça, como se faz com foto em
`CREDITOS.md`.
