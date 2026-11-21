# Perguntas diárias — procedimento da tarefa automática

Objetivo: todos os dias, juntar **15 perguntas novas a cada um dos 7 temas**, até cada tema chegar às **2000 perguntas**. Um tema que já tenha 2000 não recebe mais. Quando os 7 temas chegarem às 2000, a tarefa termina o trabalho (ver o passo 7).

Repositório: `superverde/trivial-em-familia` (ramo `main`). Site: https://trivial-em-familia.onrender.com
Não mexer noutros repositórios (em especial `superverde/equilibrio`).

## 1. Contagem atual
Na raiz do repositório: `node tools/build.js` → mostra `contagem` por tema (`his`, `geo`, `cie`, `ent`, `des`, `cul`, `atu`). Para cada tema, faltam `2000 - contagem`; a quantidade a criar hoje é `min(15, falta)`.

## 2. Temas permanentes (his, geo, cie, ent, des, cul)
Criar o ficheiro `dados-auto/AAAA-MM-DD.json` (data de hoje) com este formato:

```json
{ "his": [[2, "Pergunta?", "Resposta certa", "Errada 1", "Errada 2", "Errada 3", "Explicação curta."]], "geo": [], "cie": [], "ent": [], "des": [], "cul": [] }
```

- Posição 0: dificuldade 1 (fácil), 2 (média) ou 3 (difícil). Mistura por tema: cerca de 5 fáceis, 6 médias e 4 difíceis.
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
{"id":"AAAAMMDD-NN","d":2,"q":"Pergunta?","a":["Certa","Errada 1","Errada 2","Errada 3"],"e":"Explicação.","fonte":"RTP / Lusa","url":"https://…","data":"AAAA-MM-DD"}
```

- Notícias **dos últimos dias** (sobretudo das últimas 24–72 h; se faltarem, até 30 dias), cerca de metade de Portugal e metade do mundo: política, economia, ciência, tecnologia, desporto, cultura, sociedade.
- **Validação automática obrigatória**: cada facto confirmado em **pelo menos 2 fontes credíveis** e independentes (RTP, Lusa, Público, Expresso, Observador, Renascença, SIC Notícias, Diário de Notícias, Reuters, AP, BBC, AFP, sites oficiais do Governo, da UE, da ONU, das federações…). Se não houver 2 fontes, não entra.
- `data` = data do acontecimento; `url` = uma das fontes; `fonte` = nomes das fontes.
- Evitar: tragédias com mortos, crimes, pormenores violentos, rumores, opiniões, previsões, temas que dividam politicamente de forma partidária. Formulação neutra.
- Verificar também se alguma pergunta antiga ficou desatualizada por uma notícia nova (por exemplo, mudou o titular de um cargo). Nesse caso, reformular essa pergunta no tempo passado, com datas.

## 4. Validar e gerar
`node tools/build.js` → `problemas` tem de estar vazio (corrigir e repetir). Confirmar que `atualidades.json` é JSON válido.
Subir a versão da cache em `sw.js` (`trivial-vN` → `trivial-vN+1`) para os telemóveis receberem as perguntas novas.

## 5. Publicar
Commit com a mensagem `Perguntas do dia AAAA-MM-DD`, push para `main`. Depois, publicar no Render (o deploy automático não está ligado): serviço `srv-dc0pagp7lnhs739bv1u0`, workspace `tea-db3mmc49v7es73dmaeug` (trigger_deploy). Confirmar que o deploy fica `live`.

## 6. Resumo para o Pedro
Uma mensagem curta em português europeu: quantas perguntas entraram por tema, a nova contagem total e por tema, as 3 notícias mais interessantes do dia e qualquer problema. Se o Pedro pedir para retirar ou corrigir uma pergunta, fazê-lo e voltar a publicar.

## 7. Fim
Quando os 7 temas tiverem 2000 ou mais, não criar mais perguntas: avisar o Pedro de que o objetivo foi cumprido e desativar/apagar esta tarefa agendada (ou pedir-lhe que o faça).
