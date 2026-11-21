// Gera perguntas.js a partir de dados/, dados2/ e dados-auto/*.json e mostra a contagem por tema.
// Uso: node tools/build.js   (corre na raiz do repositório)
const fs=require('fs'),path=require('path');const K=['his','geo','cie','ent','des','cul','atu'];const out={};
const add=(k,arr)=>{out[k]=(out[k]||[]).concat(arr||[])};
for(const dir of ['dados','dados2'])for(const k of K){const f=`${dir}/${k}.js`;if(!fs.existsSync(f))continue;const o=eval('({'+fs.readFileSync(f,'utf8').trim().replace(/,\s*$/,'')+'})');add(k,o[k])}
if(fs.existsSync('dados-auto'))for(const f of fs.readdirSync('dados-auto').filter(x=>x.endsWith('.json')).sort()){const o=JSON.parse(fs.readFileSync(path.join('dados-auto',f),'utf8'));for(const k of K)if(o[k])add(k,o[k])}
const html=fs.readFileSync('index.html','utf8');let RAW;eval('RAW='+html.split('const RAW=')[1].split(';\nif(window.RAW_EXTRA)')[0]);
const seen=new Set(),bad=[];for(const k in RAW)RAW[k].forEach(r=>seen.add(r[1].toLowerCase().trim()));
for(const k of K){out[k]=(out[k]||[]).filter(r=>{const ok=Array.isArray(r)&&r.length===7&&[1,2,3].includes(r[0])&&r.slice(1).every(x=>typeof x==='string'&&x.trim())&&new Set(r.slice(2,6).map(x=>x.toLowerCase().trim())).size===4;
  if(!ok){bad.push(['formato',k,JSON.stringify(r).slice(0,90)]);return false}const q=r[1].toLowerCase().trim();if(seen.has(q)){bad.push(['repetida',k,r[1]]);return false}seen.add(q);return true})}
fs.writeFileSync('perguntas.js','// Banco de perguntas adicional (Trivial em Família) - gerado por tools/build.js\nwindow.RAW_EXTRA='+JSON.stringify(out).replace(/\],\[/g,'],\n[')+';\n');
let news=0;try{news=JSON.parse(fs.readFileSync('atualidades.json','utf8')).perguntas.length}catch(e){}
const cont={};for(const k of K)cont[k]=(RAW[k]||[]).length+out[k].length;cont.atu+=news;
console.log(JSON.stringify({contagem:cont,total:Object.values(cont).reduce((a,b)=>a+b,0),problemas:bad},null,1));
