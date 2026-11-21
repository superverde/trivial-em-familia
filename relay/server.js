// Ponte WebSocket das salas do Trivial em Família.
// O anfitrião abre a sala (role=host); os telemóveis entram (role=client).
// O servidor só reencaminha mensagens entre o anfitrião e cada telemóvel.
const http=require('http');const {WebSocketServer}=require('ws');
const rooms=new Map(); // código -> {host, hostId, clients: Map(id -> ws), t}
const srv=http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/plain','Access-Control-Allow-Origin':'*','Cache-Control':'no-store'});res.end('ok '+rooms.size)});
const wss=new WebSocketServer({server:srv,maxPayload:512*1024});
const send=(w,o)=>{try{if(w&&w.readyState===1)w.send(JSON.stringify(o))}catch(e){}};
wss.on('connection',(ws,req)=>{
  const u=new URL(req.url,'http://x');const room=(u.searchParams.get('room')||'').toUpperCase();const role=u.searchParams.get('role');const id=(u.searchParams.get('id')||'').slice(0,40);
  if(!/^[A-Z0-9]{4,12}$/.test(room)||!id){ws.close();return}
  ws.isAlive=true;ws.on('pong',()=>{ws.isAlive=true});
  if(role==='host'){
    let r=rooms.get(room);
    if(r&&r.host&&r.host.readyState===1&&r.hostId!==id){send(ws,{ev:'taken'});ws.close();return}
    if(!r){r={host:null,hostId:id,clients:new Map(),t:Date.now()};rooms.set(room,r)}
    if(r.host&&r.host!==ws){try{r.host.close()}catch(e){}}
    r.host=ws;r.hostId=id;r.t=Date.now();
    send(ws,{ev:'hosting'});
    for(const [cid,c] of r.clients){send(ws,{ev:'open',id:cid});send(c,{ev:'hostback'})}
    ws.on('message',m=>{let o;try{o=JSON.parse(m)}catch(e){return}
      if(o.to==='*'){for(const c of r.clients.values())send(c,{ev:'msg',data:o.data});return}
      const c=r.clients.get(o.to);if(c)send(c,{ev:'msg',data:o.data})});
    ws.on('close',()=>{if(r.host===ws){r.host=null;r.t=Date.now();for(const c of r.clients.values())send(c,{ev:'hostaway'})}});
  }else{
    const r=rooms.get(room);
    if(!r||(!r.host&&Date.now()-r.t>15*60e3)){send(ws,{ev:'noroom'});ws.close();return}
    const old=r.clients.get(id);if(old&&old!==ws){try{old.close()}catch(e){}}
    r.clients.set(id,ws);send(ws,{ev:'joined',host:!!r.host});send(r.host,{ev:'open',id});
    ws.on('message',m=>{let o;try{o=JSON.parse(m)}catch(e){return}send(r.host,{ev:'msg',from:id,data:o.data})});
    ws.on('close',()=>{if(r.clients.get(id)===ws){r.clients.delete(id);send(r.host,{ev:'close',id})}});
  }
});
setInterval(()=>{
  wss.clients.forEach(ws=>{if(!ws.isAlive)return ws.terminate();ws.isAlive=false;try{ws.ping()}catch(e){}});
  for(const [k,r] of rooms)if(!r.host&&r.clients.size===0&&Date.now()-r.t>30*60e3)rooms.delete(k);
},25000);
srv.listen(process.env.PORT||10000,()=>console.log('trivial-sala a escutar'));
