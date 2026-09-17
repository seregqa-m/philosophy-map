'use strict';
let selectedSchool='',selectedFamily='',mapTrail=[],mapModel=null,camera=null,activeEdge=null;
const mapSVG=$('#riverSvg'),mapViewport=$('#riverViewport');
const personById=id=>philosophers.find(p=>p.id===id);
const isParallel=id=>mapPlaces[id][2]==='parallel';
const schoolColor=id=>mapFamilies[mapPlaces[id][2]].color;
const edgeColor=e=>isParallel(e.from)||isParallel(e.to)?mapFamilies.parallel.color:schoolColor(e.from);
const radius=p=>7+p.weight*3.8;
function makeMapModel(schoolId='',family='',neighbors=true){
 let ids=currents.map(c=>c.id),links=edges;
 if(schoolId){ids=[schoolId];if(neighbors)ids.push(...incoming(schoolId).map(e=>e.from),...outgoing(schoolId).map(e=>e.to));ids=[...new Set(ids)];}
 else if(family)ids=ids.filter(id=>mapPlaces[id][2]===family);
 links=edges.filter(e=>ids.includes(e.from)&&ids.includes(e.to)&&(!schoolId||e.from===schoolId||e.to===schoolId));
 const positions={};let width=2550,height=2090;
 if(schoolId){
  const before=ids.filter(id=>id!==schoolId&&incoming(schoolId).some(e=>e.from===id)),after=ids.filter(id=>id!==schoolId&&!before.includes(id));
  const rows=Math.max(before.length,after.length,1);height=Math.max(460,rows*235+110);width=1340;
  positions[schoolId]={x:670,y:height/2};
  before.forEach((id,i)=>positions[id]={x:210,y:110+(i+.5)*(height-150)/before.length});
  after.forEach((id,i)=>positions[id]={x:1130,y:110+(i+.5)*(height-150)/after.length});
  if(ids.length===1){width=650;height=420;positions[schoolId]={x:325,y:190};}
 }else for(const id of ids)positions[id]={x:130+mapPlaces[id][0]*250,y:isParallel(id)?(id==='india-china'?1940:1730):mapPlaces[id][1]+50};
 const mainIds=ids.filter(id=>!isParallel(id)),parallelIds=ids.filter(isParallel);
 let parallelStart=schoolId?null:1550;
 if(schoolId&&parallelIds.length){
  parallelStart=mainIds.length?Math.max(...mainIds.map(id=>positions[id].y))+160:80;
  if(mainIds.length){const counts=new Map();for(const id of parallelIds){const x=positions[id].x,row=counts.get(x)||0;positions[id].y=parallelStart+165+row*235;counts.set(x,row+1);}height=Math.max(height,...parallelIds.map(id=>positions[id].y+145));}
 }
 return {ids,links,positions,width,height,focused:schoolId,parallelStart,hasMain:mainIds.length>0,hasParallel:parallelIds.length>0};
}
function curveFor(e,m){
 const a=m.positions[e.from],b=m.positions[e.to],dx=b.x-a.x;
 if(Math.abs(dx)<80)return `M ${a.x+34} ${a.y} C ${a.x+170} ${a.y},${b.x+170} ${b.y},${b.x+34} ${b.y}`;
 const sign=dx>0?1:-1,sx=a.x+sign*30,tx=b.x-sign*30,bend=Math.max(95,Math.abs(dx)*.42);
 return `M ${sx} ${a.y} C ${sx+sign*bend} ${a.y},${tx-sign*bend} ${b.y},${tx} ${b.y}`;
}
function renderMapSVG(m){
 let html=`<title id="riverTitle">Карта течений философии</title><desc>Круги — философы. Нажмите на имя, чтобы открыть карточку. Подписи направлений фильтруют карту. Ленты показывают отношения между направлениями, а не обязательное личное знакомство философов.</desc><rect width="${m.width}" height="${m.height}" fill="#f8f7f2"/>`;
 if(m.hasMain)html+='<text x="26" y="91" class="tradition-heading" fill="#43564b">ЕВРОПЕЙСКАЯ ФИЛОСОФИЯ И ЕЁ ПРОДОЛЖЕНИЯ</text>';
 if(m.hasParallel){const y=m.parallelStart;html+=`<rect x="0" y="${y}" width="${m.width}" height="${m.height-y}" fill="#eeeff0"/><path d="M 0 ${y} H ${m.width}" stroke="#b9bdc2" stroke-width="2"/><text x="26" y="${y+36}" class="tradition-heading" fill="#60666e">ДРУГИЕ ТРАДИЦИИ · ПАРАЛЛЕЛИ И ОБМЕН ИДЕЯМИ</text><text x="26" y="${y+63}" class="tradition-caption" fill="#737980">Отдельная область общей карты; линии между областями показывают исторические связи.</text>`;}
 if(!m.focused){for(let i=0;i<10;i++){const x=130+i*250;html+=`<path d="M ${x} 85 V ${m.height-25}" stroke="#dedfd6" stroke-width="1" stroke-dasharray="3 8"/><text x="${x-104}" y="30" class="epoch-label">${esc(mapEpochs[i][0])}</text><text x="${x-104}" y="53" class="epoch-context">${esc(mapEpochs[i][1].split(',')[0])}</text>`;}}
 else if(m.ids.length>1)html+=`<text x="90" y="42" class="epoch-label">ИСТОЧНИКИ И СПОРЫ →</text><text x="550" y="42" class="epoch-label">ВЫБРАННОЕ ТЕЧЕНИЕ</text><text x="1010" y="42" class="epoch-label">ПРОДОЛЖЕНИЯ →</text>`;
 for(const e of m.links){const i=edges.indexOf(e),width=(byId(e.from).weight+byId(e.to).weight-2)*4.6*(isParallel(e.from)||isParallel(e.to)?.65:1),color=edgeColor(e),d=curveFor(e,m);html+=`<g class="river-edge ${e.type==='спор'?'is-dispute':''}" data-edge="${i}" tabindex="0" role="button" aria-label="${esc(byId(e.from).name+' → '+byId(e.to).name+': '+e.type)}"><title>${esc(byId(e.from).name+' → '+byId(e.to).name+' · '+e.type+'\n'+e.note)}</title><path class="edge-hit" d="${d}" fill="none" stroke="transparent" stroke-width="${Math.max(25,width+8)}"/><path class="ribbon" d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/><path class="ribbon-spine" d="${d}" fill="none" stroke="${color}" stroke-width="1.5" ${e.type==='спор'?'stroke-dasharray="5 5"':''}/></g>`;}
 for(const id of m.ids){
  const c=byId(id),a=m.positions[id],color=schoolColor(id),members=[...schoolPeople[id]].sort((a,b)=>b.weight-a.weight),lead=members.shift();
  html+=`<g class="school-cluster ${m.focused===id?'selected-cluster':''} ${c.type==='parallel'?'parallel-cluster':''}" data-cluster="${id}">`;
  if(m.focused===id)html+=`<rect x="${a.x-162}" y="${a.y-103}" width="324" height="222" rx="18" fill="${color}" fill-opacity=".07" stroke="${color}" stroke-opacity=".35"/>`;
  html+=`<g class="school-label" role="button" tabindex="0" data-school="${id}" aria-label="Фильтровать: ${esc(c.name)}"><title>${esc(c.name)} · ${esc(c.period)}</title><rect x="${a.x-115}" y="${a.y-89}" width="230" height="35" rx="6" fill="#f8f7f2" fill-opacity=".94"/><text x="${a.x}" y="${a.y-66}" text-anchor="middle" fill="${color}">${esc(shortSchools[id])}</text></g>`;
  const node=(p,x,y,secondary)=>`<g class="philosopher ${secondary?'secondary-person':''}" data-person="${p.id}" role="button" tabindex="0" aria-label="${esc(p.name)} — открыть карточку"><title>${esc(p.name+'\n'+(p.notes?.[0]||c.thesis))}</title><circle class="person-hit" cx="${x}" cy="${y}" r="${Math.max(24,radius(p)+5)}" fill="transparent"/><circle class="person-halo" cx="${x}" cy="${y}" r="${radius(p)+5}" fill="#f8f7f2"/><circle class="person-dot" cx="${x}" cy="${y}" r="${radius(p)}" fill="${color}" fill-opacity="${secondary?'.65':'.96'}" stroke="#f8f7f2" stroke-width="2"/><text class="person-label ${secondary?'secondary-label':''}" x="${x}" y="${y+radius(p)+22}" text-anchor="middle" font-size="${secondary?17:23}" font-weight="${p.weight>=4?650:500}">${esc(p.short)}</text></g>`;
  html+=node(lead,a.x,a.y,false);
  members.forEach((p,i)=>{const x=a.x+(i-(members.length-1)/2)*87;html+=node(p,x,a.y+79,true);});
  html+='</g>';
 }
 return html;
}
function paintMap(){
 mapModel=makeMapModel(selectedSchool,selectedFamily,$('#showNeighbors').checked);
 mapSVG.innerHTML=renderMapSVG(mapModel);
 $('#riverLayout').classList.toggle('has-selection',Boolean(selectedSchool));
 $('#schoolInspector').hidden=!selectedSchool;
 $('#schoolFilter').value=selectedSchool;
 $('#mapReset').hidden=!selectedSchool&&!selectedFamily;
 $('#mapBack').disabled=!mapTrail.length;
 $('#neighborControl').hidden=!selectedSchool;
 $('#mapStatus').textContent=selectedSchool?`${byId(selectedSchool).name} · ${schoolPeople[selectedSchool].length} представителей`:`${mapModel.ids.length} течений · ${new Set(mapModel.ids.flatMap(id=>schoolPeople[id].map(p=>p.id))).size} философов`;
 document.querySelectorAll('[data-family]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.family===selectedFamily)));
 if(selectedSchool)renderInspector();
 requestAnimationFrame(()=>{fitMap();if(mapViewport.clientWidth<760){const center=mapModel.positions[selectedSchool||'heidegger']||{x:mapModel.width/2,y:mapModel.height/2},scale=.58,w=mapViewport.clientWidth/scale,h=mapViewport.clientHeight/scale;camera={x:center.x-w/2,y:center.y-h/2,w,h};applyCamera();}});
}
function renderInspector(){
 const c=byId(selectedSchool),incomingEdges=incoming(c.id),outgoingEdges=outgoing(c.id);
 const related=(list,side)=>list.length?list.map(e=>{const id=e[side];return `<button class="inspector-relation" data-school="${id}"><span>${esc(e.type)} ${side==='from'?'←':'→'}</span>${esc(shortSchools[id])}</button>`;}).join(''):'<p class="small">Связи пока не включены в атлас.</p>';
 $('#schoolInspector').innerHTML=`<button id="closeInspector" class="inspector-close" aria-label="Сбросить выбранное течение">×</button><p class="eyebrow">${esc(c.period)}</p><h2>${esc(c.name)}</h2><p class="inspector-thesis">${esc(c.thesis)}</p>${activeEdge?`<div class="connection-note"><strong>${esc(shortSchools[activeEdge.from])} → ${esc(shortSchools[activeEdge.to])}</strong><p>${esc(activeEdge.type)}. ${esc(activeEdge.note)}</p><a href="${esc(activeEdge.source)}" target="_blank" rel="noopener noreferrer">Источник связи ↗</a></div>`:''}<h3>Главный сдвиг</h3><p>${esc(c.result)}</p><h3>Почему тогда</h3><p>${esc(c.context)}</p><h3>Возражение</h3><p>${esc(c.critique)}</p><button class="primary" data-detail="${c.id}">Идеи, работы и источники →</button><h3>Представители</h3><div class="inspector-people">${schoolPeople[c.id].map(p=>`<button data-person="${p.id}">${esc(p.name)} ↗</button>`).join('')}</div><h3>Откуда пришли идеи</h3>${related(incomingEdges,'from')}<h3>Что выросло дальше</h3>${related(outgoingEdges,'to')}`;
 $('#closeInspector').onclick=()=>selectSchool('');
}
function selectSchool(id,remember=true,edge=null){
 if(id&&!byId(id))return;
 if(remember&&(selectedSchool!==id||selectedFamily))mapTrail.push({school:selectedSchool,family:selectedFamily});
 selectedSchool=id;selectedFamily='';activeEdge=edge;$('#mapSearch').value='';$('#searchResults').hidden=true;
 goView('river');paintMap();
}
function fitMap(){
 if(!mapModel||$('#riverView').hidden)return;
 const w=Math.max(mapViewport.clientWidth,300),h=Math.max(mapViewport.clientHeight,300),aspect=w/h;
 let cw=mapModel.width,ch=mapModel.height;if(cw/ch>aspect)ch=cw/aspect;else cw=ch*aspect;
 camera={x:(mapModel.width-cw)/2,y:(mapModel.height-ch)/2,w:cw,h:ch};applyCamera();
}
function applyCamera(){
 if(!camera)return;mapSVG.setAttribute('viewBox',`${camera.x} ${camera.y} ${camera.w} ${camera.h}`);
 const scale=mapViewport.clientWidth/camera.w;mapSVG.classList.toggle('show-all-names',Boolean(selectedSchool)||scale>.85);
 $('#mapZoomLevel').textContent=Math.round(scale*100)+'%';
 $('#mapMini').innerHTML=`<svg viewBox="0 0 ${mapModel.width} ${mapModel.height}" aria-hidden="true">${mapModel.hasParallel?`<rect x="0" y="${mapModel.parallelStart}" width="${mapModel.width}" height="${mapModel.height-mapModel.parallelStart}" fill="#e3e5e7"/>`:''}${mapModel.links.map(e=>`<path d="${curveFor(e,mapModel)}" fill="none" stroke="${edgeColor(e)}" stroke-opacity=".35" stroke-width="12"/>`).join('')}${mapModel.ids.map(id=>{const p=mapModel.positions[id];return `<circle cx="${p.x}" cy="${p.y}" r="18" fill="${schoolColor(id)}"/>`;}).join('')}<rect x="${camera.x}" y="${camera.y}" width="${camera.w}" height="${camera.h}" fill="#315d4512" stroke="#315d45" stroke-width="12"/></svg>`;
}
function zoomMap(factor,px=.5,py=.5){
 if(!camera)return;const scale=mapViewport.clientWidth/(camera.w/factor);if(scale<.18||scale>2.8)return;
 camera.x+=camera.w*px*(1-1/factor);camera.y+=camera.h*py*(1-1/factor);camera.w/=factor;camera.h/=factor;applyCamera();
}
function openPerson(p){
 if(!p)return;previousFocus=document.activeElement;
 const schools=p.schools.map(byId),sources=[...new Map(schools.flatMap(c=>c.sources).map(s=>[s[1],s])).values()];
 $('#detailContent').innerHTML=`<p class="eyebrow">Философ · ${esc(p.dates||schools[0].period)}</p><h2 id="detailTitle">${esc(p.name)}</h2><p class="detail-thesis">${esc(p.notes?.[0]||schools[0].thesis)}</p>${section('Основные работы',`<ul>${p.works.map(w=>`<li>${esc(w)}</li>`).join('')}</ul>`)}${section('Возражения и ограничения',`<p>${esc(p.notes?.[1]||schools[0].critique)}</p>`)}${section('Историческая почва',schools.map(c=>`<h4>${esc(c.name)}</h4><p>${esc(c.context)}</p>`).join(''))}${section('Место на карте',`<p>Один мыслитель может участвовать в нескольких традициях. Ленты связывают направления, а не доказывают влияние каждого их представителя на каждого.</p><div class="person-schools">${schools.map(c=>`<button data-person-school="${c.id}">${esc(c.name)} →</button>`).join('')}</div>`)}${section('Изучить идеи подробнее',schools.map(c=>`<button class="school-reading" data-detail="${c.id}">${esc(c.name)}: аргументы, результаты и чтение</button>`).join(''))}${section('Обзоры и источники по традиции',`<div class="source-links">${sources.map(([name,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a>`).join('')}</div><small>Краткий тезис и возражение — учебная интерпретация. Обзоры могут охватывать всё течение, а не только этого автора.</small>`)}`;
 const panel=$('#detailPanel');if(!panel.open)panel.showModal();panel.scrollTop=0;document.body.classList.add('modal-open');$('#closeDetail').focus();
}
$('#schoolFilter').innerHTML='<option value="">Все течения</option>'+currents.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');
$('#schoolFilter').onchange=e=>selectSchool(e.target.value);
$('#mapFamilies').innerHTML=Object.entries(mapFamilies).map(([id,f])=>`<button data-family="${id}" aria-pressed="false" style="--family:${f.color}"><i></i>${esc(f.name)}</button>`).join('');
$('#mapFamilies').onclick=e=>{const b=e.target.closest('[data-family]');if(!b)return;mapTrail.push({school:selectedSchool,family:selectedFamily});selectedSchool='';selectedFamily=selectedFamily===b.dataset.family?'':b.dataset.family;activeEdge=null;paintMap();};
$('#showNeighbors').onchange=paintMap;
$('#mapReset').onclick=()=>selectSchool('');
$('#mapBack').onclick=()=>{const prev=mapTrail.pop();if(!prev)return;selectedSchool=prev.school;selectedFamily=prev.family;activeEdge=null;paintMap();};
$('#zoomIn').onclick=()=>zoomMap(1.35);$('#zoomOut').onclick=()=>zoomMap(1/1.35);$('#mapFit').onclick=fitMap;
$('#mapMini').onclick=fitMap;
$('#mapStart').onclick=()=>selectSchool('heidegger');
$('#mapSearch').addEventListener('input',e=>{const q=normalize(e.target.value.trim()),box=$('#searchResults');if(!q){box.hidden=true;return;}const persons=philosophers.filter(p=>normalize(p.name).includes(q)).slice(0,8),schools=currents.filter(c=>normalize(c.name+' '+c.tags.join(' ')).includes(q)).slice(0,6);box.hidden=false;box.innerHTML=schools.map(c=>`<button data-school="${c.id}"><small>Течение</small>${esc(c.name)}</button>`).join('')+persons.map(p=>`<button data-person="${p.id}"><small>Философ</small>${esc(p.name)}</button>`).join('')||'<p>Ничего не найдено. Попробуйте фамилию или тему.</p>';});
document.addEventListener('click',e=>{const s=e.target.closest('[data-school]'),p=e.target.closest('[data-person]'),edge=e.target.closest('[data-edge]'),ps=e.target.closest('[data-person-school]');if(s)selectSchool(s.dataset.school);else if(p){$('#searchResults').hidden=true;openPerson(personById(p.dataset.person));}else if(edge){const link=edges[+edge.dataset.edge];selectSchool(link.to,true,link);}else if(ps){closeDetail();selectSchool(ps.dataset.personSchool);}if(!e.target.closest('.river-search'))$('#searchResults').hidden=true;});
mapSVG.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const b=e.target.closest('[role="button"]');if(b){e.preventDefault();b.dispatchEvent(new MouseEvent('click',{bubbles:true}));}}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();camera.x+=e.key==='ArrowLeft'?-camera.w*.1:e.key==='ArrowRight'?camera.w*.1:0;camera.y+=e.key==='ArrowUp'?-camera.h*.1:e.key==='ArrowDown'?camera.h*.1:0;applyCamera();}else if(e.key==='+')zoomMap(1.3);else if(e.key==='-')zoomMap(1/1.3);});
const pointers=new Map();let gesture=null,dragged=false,suppressUntil=0;
mapSVG.addEventListener('pointerdown',e=>{if(e.button&&e.pointerType!=='touch')return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});dragged=false;gesture={camera:{...camera},points:[...pointers.values()]};});
mapSVG.addEventListener('pointermove',e=>{
 if(!pointers.has(e.pointerId)||!gesture)return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const pts=[...pointers.values()],start=gesture.points;
 if(pts.length===1&&start.length===1){const dx=pts[0].x-start[0].x,dy=pts[0].y-start[0].y;if(Math.hypot(dx,dy)>5){dragged=true;mapSVG.setPointerCapture(e.pointerId);camera={...gesture.camera,x:gesture.camera.x-dx*gesture.camera.w/mapViewport.clientWidth,y:gesture.camera.y-dy*gesture.camera.h/mapViewport.clientHeight};applyCamera();}}
 else if(pts.length===2&&start.length===2){dragged=true;const dist=p=>Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y),factor=dist(pts)/Math.max(dist(start),1),newW=gesture.camera.w/factor,newH=gesture.camera.h/factor,scale=mapViewport.clientWidth/newW;if(scale<.18||scale>2.8)return;const r=mapSVG.getBoundingClientRect(),sx=((start[0].x+start[1].x)/2-r.left)/r.width,sy=((start[0].y+start[1].y)/2-r.top)/r.height,px=((pts[0].x+pts[1].x)/2-r.left)/r.width,py=((pts[0].y+pts[1].y)/2-r.top)/r.height;camera={x:gesture.camera.x+sx*gesture.camera.w-px*newW,y:gesture.camera.y+sy*gesture.camera.h-py*newH,w:newW,h:newH};applyCamera();}
});
const endPointer=e=>{pointers.delete(e.pointerId);if(dragged)suppressUntil=Date.now()+350;gesture=pointers.size?{camera:{...camera},points:[...pointers.values()]}:null;};
mapSVG.addEventListener('pointerup',endPointer);mapSVG.addEventListener('pointercancel',endPointer);mapSVG.addEventListener('pointerleave',e=>{if(!mapSVG.hasPointerCapture(e.pointerId))endPointer(e);});
mapSVG.addEventListener('click',e=>{if(Date.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
mapSVG.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();const r=mapSVG.getBoundingClientRect();zoomMap(Math.exp(-e.deltaY*.003),(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);},{passive:false});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(fitMap,120);});
// Keep existing catalogue, comparisons and compass as secondary tools.
const legacyGoView=goView;
goView=function(view){if(view==='lineage')view='river';legacyGoView(view);document.body.classList.toggle('river-active',view==='river');if(view==='river'&&mapModel)requestAnimationFrame(fitMap);};
navigateNode=function(id){selectSchool(id);};
const legacyOpenDetail=openDetail;
openDetail=function(c){legacyOpenDetail(c);if(!c)return;const box=$('#detailContent .people');if(box)box.innerHTML=schoolPeople[c.id].map(p=>`<div class="person"><button data-person="${p.id}">${esc(p.name)} ↗</button><p>${esc(p.works.join('; '))}</p></div>`).join('');};
goView('river');paintMap();
