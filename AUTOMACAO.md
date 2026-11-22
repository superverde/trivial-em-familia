# Perguntas diárias — procedimento da tarefa automática

Objetivo, em duas fases (decisão do Pedro a 22/11/2026):

1. **Fase rápida, até 1000 por tema** nos 6 temas permanentes (his, geo, cie, ent, des, cul): em **cada execução**, juntar **100 perguntas** a cada tema que ainda tenha menos de 1000. A tarefa corre 4 vezes por dia.
2. **Fase normal, de 1000 até 2000**: juntar **15 perguntas por tema por dia**, só na **primeira execução de cada dia**. Se já existir um ficheiro `dados-auto/` com a data de hoje que não seja da fase rápida, as outras execuções desse dia terminam sem fazer nada.
3. **Atualidades (atu)**: sempre **15 por dia**, só na primeira execução do dia, porque cada notícia tem de ser verificada em 2 fontes. Para encher mais depressa, pode juntar também notícias marcantes dos últimos 12 meses, sempre com data, fonte e url.
4. Um tema com 2000 ou mais não recebe mais perguntas. Quando os 7 temas chegarem às 2000, a tarefa termina o trabalho (ver o passo 7).

Nome do ficheiro de cada execução: `dados-auto/AAAA-MM-DD-HHMM.json` (data e hora da execução), para várias execuções no mesmo dia não se sobreporem. Os ficheiros antigos `AAAA-MM-DD.json` continuam válidos.

Repositório: `superverde/trivial-em-familia` (ramo `main`). Site: https://trivial-em-familia.onrender.com
Não mexer noutros repositórios (em especial `superverde/equilibrio`).

## 1. Contagem atual
Na raiz do repositório: `node tools/build.js` → mostra `contagem` por tema (`his`, `geo`, `cie`, `ent`, `des`, `cul`, `atu`). Para cada tema: se a contagem for menor que 1000, criar `min(100, 1000 - contagem)` (fase rápida); se estiver entre 1000 e 1999, criar `min(15, 2000 - contagem)` apenas na primeira execução do dia.

## 2. Temas permanentes (his, geo, cie, ent, des, cul)
Criar o ficheiro `dados-auto/AAAA-MM-DD-HHMM.json` (data e hora desta execução) com este formato:

```json
{ "his": [[2, "Pergunta?", "Resposta certa", "Errada 1", "Errada 2", "Errada 3", "Explicação curta."]], "geo": [], "cie": [], "ent": [], "des": [], "cul": [] }
```

- Posição 0: dificuldade 1 (fácil), 2 (média) ou 3 (difícil). Mistura: cerca de um terço fáceis, 40% médias e um quarto difíceis. Em lotes grandes (100), variar bem os subtemas e as épocas para não haver perguntas parecidas.
- A **resposta certa vem sempre em 3.º lugar** (índice 2); o jogo baralha as opções.
- Português europeu (acordo ortográfico de 1990), linguagem adequada a toda a família (crianças incluídas).
- Só **factos estáveis e confirmados**. Nada de «quem é atualmente…» nos temas permanentes (isso fica desatualizado). Na dúvida, não incluir.
- As três erradas têm de ser plausíveis e do mesmo tipo da certa (três cidades, três anos…), e claramente erradas.
- Uma explicação de uma frase, com um pormenor curioso.
- Bom equilíbrio entre temas portugueses e internacionais (cerca de metade sobre Portugal).
- **Sem repetidas nem quase repetidas**: antes de escrever, procurar o assunto com `grep -i` em `index.html`, `dados/`, `dados2/`, `dados-auto/` e `atualidades.json`.
- Temas: História (Portugal, mundo, civilizações); Geografia (países, capitais, cidades, natureza, monumentos); Ciência e Natureza (corpo humano, animais, espaço, descobertas); Entretenimento (cinema, televisão, música, cultura popular, animação); Desporto (modalidades, atletas, competições, recordes); Cultura Geral (literatura, arte, gastronomia, tradições, curiosidades).
- Nunca alterar ficheiros antigos, exceto para corrigir um erro que o Pedro tenha apontado.

## 3. Atualidades (atu)
Juntar as perguntas ao fim da lista `perguntas` em `atualidades.json` e atualizar `"atualizado"` para a data de hoje. Formato de cada pergunta:

```json
{"id":"AAAAMMDD-NN","d":2,"t":"pol","q":"Pergunta?","a":["Certa","Errada 1","Errada 2","Errada 3"],"e":"Explicação.","fonte":"RTP / Lusa","url":"https://…","data":"AAAA-MM-DD"}
```

- **Subtema obrigatório** no campo `t`: `pol` (política), `mun` (mundo e sociedade, clima, economia), `cie` (ciência e tecnologia), `cul` (cultura e espetáculos) ou `des` (desporto). O jogo roda pelos subtemas, por isso é preciso haver perguntas de todos.
- **Distribuição das 15 por dia:** no máximo **2 de desporto**; as restantes repartidas por `pol`, `mun`, `cie` e `cul` (pelo menos 3 de cada, sempre que haja notícias verificáveis). O banco atual tem desporto a mais: até equilibrar, dar prioridade a `cie` e `cul`.
- Notícias **dos últimos dias** (sobretudo das últimas 24–72 h; se faltarem, até 30 dias), cerca de metade de Portugal e metade do mundo: política, economia, ciência, tecnologia, desporto, cultura, sociedade.
- **Validação automática obrigatória**: cada facto confirmado em **pelo menos 2 fontes credíveis** e independentes (RTP, Lusa, Público, Expresso, Observador, Renascença, SIC Notícias, Diário de Notícias, Reuters, AP, BBC, AFP, sites oficiais do Governo, da UE, da ONU, das federações…). Se não houver 2 fontes, não entra.
- `data` = data do acontecimento; `url` = uma das fontes; `fonte` = nomes das fontes.
- Evitar: tragédias com mortos, crimes, pormenores violentos, rumores, opiniões, previsões, temas que dividam politicamente de forma partidária. Formulação neutra.
- Verificar também se alguma pergunta antiga ficou desatualizada por uma notícia nova (por exemplo, mudou o titular de um cargo). Nesse caso, reformular essa pergunta no tempo passado, com datas.

## 4. Validar e gerar
`node tools/build.js` → `problemas` tem de estar vazio (corrigir e repetir). Confirmar que `atualidades.json` é JSON válido.
Subir a versão da cache em `sw.js` (`trivial-vN` → `trivial-vN+1`) para os telemóveis receberem as perguntas novas.

## 5. Publicar
Antes do push, fazer `git pull --rebase` (pode ter havido outra execução). Commit com a mensagem `Perguntas AAAA-MM-DD HHMM`, push para `main`. Depois, publicar no Render (o deploy automático não está ligado): serviço `srv-dc0pagp7lnhs739bv1u0`, workspace `tea-db3mmc49v7es73dmaeug` (trigger_deploy). Confirmar que o deploy fica `live`.

## 6. Resumo para o Pedro
Uma mensagem curta em português europeu: quantas perguntas entraram por tema, a nova contagem total e por tema, as 3 notícias mais interessantes do dia e qualquer problema. Se o Pedro pedir para retirar ou corrigir uma pergunta, fazê-lo e voltar a publicar.

## 7. Fim
Quando os 7 temas tiverem 2000 ou mais, não criar mais perguntas: avisar o Pedro de que o objetivo foi cumprido e desativar/apagar esta tarefa agendada (ou pedir-lhe que o faça).
