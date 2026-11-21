# Trivial em Família — versão instalável (PWA)

Site estático: basta alojar esta pasta tal como está (index.html na raiz).

## Publicar no Render
1. Criar o repositório GitHub `trivial-em-familia` e carregar estes ficheiros.
2. No Render: New → Static Site → escolher o repositório.
3. Build command: (vazio) · Publish directory: `.`
4. O Render dá um link do tipo https://trivial-em-familia.onrender.com

## Instalar no telemóvel
- Android (Chrome): abrir o link → menu ⋮ → «Instalar aplicação» / «Adicionar ao ecrã principal».
- iPhone (Safari): abrir o link → botão Partilhar → «Adicionar ao ecrã principal».
- Computador (Chrome/Edge): ícone de instalar na barra de endereço.

## Jogar com QR code
- «Criar sala com QR code» no ecrã que mostra o tabuleiro (TV, computador, tablet ou telemóvel).
- Modos: «TV + telemóveis» (o ecrã mostra o tabuleiro, os telemóveis são comandos) ou «Só telemóveis» (todos veem o tabuleiro; quem cria também joga).
- Ligação direta entre aparelhos (WebRTC, biblioteca PeerJS com o servidor público gratuito 0.peerjs.com). É preciso internet; funciona melhor com todos na mesma rede Wi-Fi.
