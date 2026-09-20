'use strict';
const $=s=>document.querySelector(s),byId=id=>currents.find(c=>c.id===id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=s=>s.toLocaleLowerCase('ru').replaceAll('ё','е');
const eraOrder=['Античность','Средневековье','Раннее Новое время','Просвещение','XIX век','XX век','Современность'];
let activeEra='Все',currentNode='existentialism',graphHistory=[],previousFocus=null;
const incoming=id=>edges.filter(e=>e.to===id),outgoing=id=>edges.filter(e=>e.from===id);
function sourceLinks(c){return c.sources.map(([name,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a>`).join('');}
function goView(view){document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);b.setAttribute('aria-pressed',String(b.dataset.view===view));});document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!==view+'View');if(view==='lineage')renderLineage();if(view==='compare')renderCompare();}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>goView(b.dataset.view)));
function setEra(era){activeEra=era;document.querySelectorAll('[data-era]').forEach(b=>{b.classList.toggle('active',b.dataset.era===era);b.setAttribute('aria-pressed',String(b.dataset.era===era));});render();}
$('#eraChips').innerHTML=['Все',...eraOrder].map(e=>`<button class="chip ${e==='Все'?'active':''}" aria-pressed="${e==='Все'}" data-era="${esc(e)}">${e}</button>`).join('');
$('#eraChips').addEventListener('click',e=>{const b=e.target.closest('[data-era]');if(b)setEra(b.dataset.era);});
function render(){
 const q=normalize($('#searchInput').value.trim()),kind=$('#scopeSelect').value;
 const items=currents.filter(c=>(activeEra==='Все'||c.era===activeEra)&&(!q||normalize(JSON.stringify(c)).includes(q))&&(kind==='all'||(kind==='parallel'?c.type==='parallel':c.type!=='parallel')));
 $('#resultCount').textContent=`${items.length} из ${currents.length} направлений`;
 $('#timeline').innerHTML=items.length?eraOrder.map(era=>{const group=items.filter(c=>c.era===era);if(!group.length)return '';return `<section class="era-group"><h2>${era}<span>${group.length}</span></h2><div class="cards">${group.map(c=>`<article class="thought-card ${c.type}"><span class="period">${esc(c.period)} · ${c.type==='parallel'?'Параллельная традиция':c.weight===3?'Ключевой поворот':'Течение'}</span><h3><button class="card-title" data-detail="${c.id}">${esc(c.name)}</button></h3><p>${esc(c.thesis)}</p><p class="people-preview">${esc(c.people.map(p=>p[0].replace(/\s*\(.+?\)/g,'')).join(' · '))}</p><div class="context-strip" ${$('#contextToggle').checked?'':'hidden'}><strong>Фон эпохи</strong>${esc(c.context)}</div><div class="card-actions"><button data-detail="${c.id}">Разобраться →</button><button data-lineage="${c.id}">Связи</button></div></article>`).join('')}</div></section>`}).join(''):'<div class="empty"><h2>Ничего не найдено</h2><p>Попробуйте другое имя или сбросьте фильтры.</p><button id="resetFilters">Сбросить фильтры</button></div>';
 $('#resetFilters')?.addEventListener('click',()=>{$('#searchInput').value='';$('#scopeSelect').value='all';setEra('Все');});
}
$('#searchInput').addEventListener('input',render);$('#scopeSelect').addEventListener('change',render);$('#contextToggle').addEventListener('change',render);
const section=(title,body)=>`<section class="detail-section"><h3>${title}</h3>${body}</section>`;
function openDetail(c){
 if(!c)return;previousFocus=document.activeElement;
 const inEdges=incoming(c.id),outEdges=outgoing(c.id);
 const voices=[...schoolPeople[c.id]].sort((a,b)=>b.weight-a.weight).slice(0,c.weight>=3?3:2);
 const expandedIdeas=voices.map(p=>`<h4>${esc(p.name)}</h4>${p.worldview.slice(1).map(t=>`<p>${esc(t)}</p>`).join('')}`).join('');
 const expandedContext=[...new Set([c.context,...voices.flatMap(p=>p.historicalContext.slice(-1))])].map(t=>`<p>${esc(t)}</p>`).join('');
 $('#detailContent').innerHTML=`<p class="eyebrow">${esc(c.era)} · ${esc(c.period)}</p><h2 id="detailTitle">${esc(c.name)}</h2><p class="detail-thesis">${esc(c.thesis)}</p>${c.question!==c.thesis?`<p class="question-lead">Вопрос: ${esc(c.question)}</p>`:''}${c.ideas?section('Как устроена мысль',`<ol>${c.ideas.map(i=>`<li>${esc(i)}</li>`).join('')}</ol>`):''}${section('Мировоззрение: разные ответы',expandedIdeas)}${section('Что изменилось',`<p>${esc(c.result)}</p>`)}${c.example?section('На понятном примере',`<p>${esc(c.example)}</p>`):''}${section('Культурно-исторический контекст',expandedContext)}${section('Представители и работы',`<div class="people">${c.people.map(([name,work])=>`<div class="person"><strong>${esc(name)}</strong><p>${esc(work)}</p></div>`).join('')}</div>${c.works?`<dl class="works">${c.works.map(([name,date,meaning])=>`<dt>${esc(name)} <span>${esc(date)}</span></dt><dd>${esc(meaning)}</dd>`).join('')}</dl>`:''}`)}${section('Возражения и ограничения',`<p>${esc(c.critique)}</p>`)}${c.misconception?section('Не перепутайте',`<p>${esc(c.misconception)}</p>`):''}${section('Откуда пришло и что изменило',`<p>${inEdges.length} входящих и ${outEdges.length} исходящих связей в этой карте.</p><button class="primary" data-lineage="${c.id}">Открыть карту связей</button>`)}${section('С чего начать чтение',`<p>${esc(c.reading)}</p>`)}${section('Источники и дальнейшее чтение',`<div class="source-links">${sourceLinks(c)}</div>`)}<div class="tags">${c.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`;
 const panel=$('#detailPanel');if(!panel.open)panel.showModal();panel.scrollTop=0;document.body.classList.add('modal-open');$('#closeDetail').focus();
}
function closeDetail(){if($('#detailPanel').open)$('#detailPanel').close();}
$('#closeDetail').onclick=closeDetail;
$('#detailPanel').addEventListener('close',()=>{document.body.classList.remove('modal-open');if(previousFocus?.isConnected)previousFocus.focus();});
$('#detailPanel').addEventListener('click',e=>{if(e.target===$('#detailPanel')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDetail();}});
function navigateNode(id,remember=true){if(!byId(id))return;if(remember&&id!==currentNode)graphHistory.push(currentNode);currentNode=id;$('#lineageSelect').value=id;renderLineage();}
function edgeCard(edge,side){const id=side==='before'?edge.from:edge.to,c=byId(id);return `<article class="relation ${edge.type==='спор'?'dispute':''}"><span class="edge-kind">${esc(edge.type)} →</span><button class="relation-title" data-node="${id}">${esc(c.name)}</button><p>${esc(edge.note)}</p><div class="relation-actions"><button data-detail="${id}">Карточка</button><a target="_blank" rel="noopener noreferrer" href="${esc(edge.source)}">Источник ↗</a></div></article>`;}
function branch(id,path=[],depth=0){if(path.includes(id))return '<li>Повторная связь</li>';const list=incoming(id);return `<li><button data-node="${id}">${esc(byId(id).name)}</button>${list.length?`<details ${depth<1?'open':''}><summary>${list.length} источника идей</summary><ul>${list.map(e=>`<li class="branch-note">${esc(e.type)}: ${esc(e.note)}</li>${branch(e.from,[...path,id],depth+1)}`).join('')}</ul></details>`:''}</li>`;}
function renderLineage(){const c=byId(currentNode),before=incoming(c.id),after=outgoing(c.id);$('#graphBack').disabled=!graphHistory.length;$('#lineageSelect').value=c.id;
 $('#lineageGraph').innerHTML=`<section><h3 class="column-label">Откуда пришли идеи →</h3>${before.length?before.map(e=>edgeCard(e,'before')).join(''):'<p class="empty-note">Предшественники не включены в эту карту. Это не означает, что их не было.</p>'}</section><section class="node-center"><p class="eyebrow">Выбранная точка</p><span class="period">${esc(c.period)}</span><h2>${esc(c.name)}</h2><p>${esc(c.thesis)}</p><button class="primary" data-detail="${c.id}">Читать разбор</button></section><section><h3 class="column-label">Что произошло дальше →</h3>${after.length?after.map(e=>edgeCard(e,'after')).join(''):'<p class="empty-note">Продолжения пока не включены. Это не «конец философии».</p>'}</section>`;
 const matches=parallels.filter(p=>p.a===c.id||p.b===c.id);
 $('#lineageReading').innerHTML=`<details class="ancestor-tree"><summary>Раскрыть все предшествующие ветви</summary><p>Это дерево конкретных связей, а не одна обязательная последовательность. Один автор может встречаться в нескольких ветвях.</p><ul>${branch(c.id)}</ul></details>${matches.length?`<section class="parallel-box"><h3>Сопоставление без стрелки влияния</h3>${matches.map(p=>`<p><button data-detail="${p.a===c.id?p.b:p.a}">${esc(byId(p.a===c.id?p.b:p.a).name)}</button> — ${esc(p.note)}</p>`).join('')}</section>`:''}`;
}
$('#graphBack').onclick=()=>{const id=graphHistory.pop();if(id)navigateNode(id,false);};
const options=currents.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');
$('#lineageSelect').innerHTML=options;$('#lineageSelect').value=currentNode;$('#lineageSelect').onchange=e=>navigateNode(e.target.value);
for(const s of ['#compareA','#compareB'])$(s).innerHTML=options;$('#compareA').value='heidegger';$('#compareB').value='existentialism';
function renderCompare(){const a=byId($('#compareA').value),b=byId($('#compareB').value);const rows=[['Главный вопрос','question'],['Основной ход','thesis'],['Что дал подход','result'],['Возражение','critique'],['Начать читать','reading']];$('#comparison').innerHTML=a.id===b.id?'<p class="empty">Выберите два разных направления.</p>':`<div class="comparison-grid"><div class="compare-head"><h3>${esc(a.name)}</h3><button data-detail="${a.id}">Полная карточка</button></div><div class="compare-head"><h3>${esc(b.name)}</h3><button data-detail="${b.id}">Полная карточка</button></div>${rows.map(([label,key])=>`<h4>${label}</h4><p>${esc(a[key])}</p><p>${esc(b[key])}</p>`).join('')}</div>`;}
$('#compareA').onchange=renderCompare;$('#compareB').onchange=renderCompare;
document.addEventListener('click',e=>{const d=e.target.closest('[data-detail]'),l=e.target.closest('[data-lineage]'),n=e.target.closest('[data-node]');if(d)openDetail(byId(d.dataset.detail));else if(l){closeDetail();goView('lineage');navigateNode(l.dataset.lineage);$('#lineageSelect').focus();}else if(n)navigateNode(n.dataset.node);});
$('#aboutBtn').onclick=()=>$('#aboutDialog').showModal();$('#closeAbout').onclick=()=>$('#aboutDialog').close();
$('#glossary').innerHTML=glossary.map(([term,meaning])=>`<dt>${esc(term)}</dt><dd>${esc(meaning)}</dd>`).join('');
$('#atlasCount').textContent=currents.length;$('#edgeCount').textContent=edges.length;
goView('atlas');render();renderLineage();renderCompare();
