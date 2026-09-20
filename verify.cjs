process.chdir(__dirname);
// Model/interaction validation and SVG geometry inspection; not browser QA.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8'),elements=new Map();
function el(id){if(!elements.has(id))elements.set(id,{id,innerHTML:'',textContent:'',value:'',checked:true,hidden:false,open:false,clientWidth:1200,clientHeight:700,dataset:{},classList:{toggle(){},add(){},remove(){}},listeners:{},attrs:{},addEventListener(t,f){this.listeners[t]=f;},setAttribute(k,v){this.attrs[k]=v;},focus(){},showModal(){this.open=true;},close(){this.open=false;},getBoundingClientRect(){return {left:0,top:0,width:1200,height:700};}});return elements.get(id);}
for(const m of html.matchAll(/id="([^"]+)"/g))el(m[1]);el('scopeSelect').value='all';
const document={activeElement:null,body:{classList:{toggle(){},add(){},remove(){}}},addEventListener(){},querySelector(s){if(s==='#detailContent .people')return el('people');if(!s.startsWith('#'))return null;return el(s.slice(1));},querySelectorAll(s){if(s==='.view')return ['river','atlas','lineage','compare','compass'].map(v=>el(v+'View'));return [];}};
const ctx=vm.createContext({document,window:{addEventListener(){}},console,requestAnimationFrame:f=>f(),setTimeout,clearTimeout,Date});
for(const f of ['data.js','enrichment.js','world-traditions.js','graph-data.js','portraits.js','app.js','river.js','political-data.js','assessments.js'])vm.runInContext(fs.readFileSync(''+f,'utf8'),ctx,{filename:f});
const run=s=>vm.runInContext(s,ctx);
assert.equal(run('mapModel.ids.length'),40);assert(run('mapModel.ids.every(visibleSchool)'));
run("selectSchool('scholastic')");assert(!run("mapModel.ids.includes('islamic')"));
run('setWorldVisibility(true)');assert.equal(run('makeMapModel().ids.length'),70);
run('setWorldVisibility(false)');assert.equal(run('makeMapModel().ids.length'),40);
run('setWorldVisibility(true)');
const data=JSON.parse(run('JSON.stringify({philosophers,currents,edges,schoolPeople})'));
assert(data.philosophers.length>90);assert.equal(data.philosophers.length,new Set(data.philosophers.map(p=>p.name)).size);
for(const p of data.philosophers){assert(p.notes&&p.notes.length===2,'Missing personal notes: '+p.name);assert(p.works.length);assert(p.worldview.length>=2);assert(p.historicalContext.length>=2);assert(p.weight>=1&&p.weight<=5);run(`openPerson(personById('${p.id}'))`);assert(el('detailContent').innerHTML.includes(p.name));assert(el('detailContent').innerHTML.includes(p.notes[0]));}
assert.equal(data.philosophers.filter(p=>p.name==='Иммануил Кант').length,1);
assert.equal(data.philosophers.filter(p=>p.name==='Симона де Бовуар').length,1);
assert(!data.philosophers.some(p=>p.name==='Маркс и Энгельс'));
for(const c of data.currents){
 run(`selectSchool('${c.id}')`);const model=JSON.parse(run('JSON.stringify(mapModel)'));
 assert(model.ids.includes(c.id));assert(el('schoolInspector').innerHTML.includes(c.thesis));
 const expected=new Set([c.id,...data.edges.filter(e=>e.to===c.id).map(e=>e.from),...data.edges.filter(e=>e.from===c.id).map(e=>e.to)]);
 assert.deepEqual(new Set(model.ids),expected);assert(!el('riverSvg').innerHTML.includes('NaN'));
 for(const p of data.schoolPeople[c.id])assert(el('riverSvg').innerHTML.includes('data-person="'+p.id+'"'));
 el('showNeighbors').checked=false;run('paintMap()');assert.equal(run('mapModel.ids.length'),1);el('showNeighbors').checked=true;
}
run("selectSchool('heidegger')");assert(run("mapModel.ids.includes('phenomenology')"));assert(!run("mapModel.ids.includes('empiricism')"));
const oldWidth=run('camera.w');run('zoomMap(1.35)');assert(run('camera.w')<oldWidth);run('fitMap()');assert.equal(run('camera.w'),oldWidth);
el('mapSearch').listeners.input({target:{value:'Кьеркегор'}});assert(el('searchResults').innerHTML.includes('Кьеркегор'));
el('mapSearch').listeners.input({target:{value:'nonexistent-123'}});assert(el('searchResults').innerHTML.includes('Ничего не найдено'));
run("selectedSchool='';selectedFamily='parallel';paintMap()");assert(run('mapModel.ids.every(id=>mapPlaces[id][2]==="parallel")'));
run("selectSchool('')");assert.equal(run('mapModel.ids.length'),70);
assert.equal(run("currents.filter(c=>c.type==='parallel').length"),30);
for(const id of run('worldBands.map(b=>b.id)')){run(`goRegion('${id}')`);assert.equal(run('mapModel.ids.length'),70,'Region navigation must preserve the shared map');assert(Number.isFinite(run('camera.x')));}
for(const c of data.currents){assert(c.sources.length&&c.reading&&c.context&&c.critique);}
const overview=JSON.parse(run('JSON.stringify(makeMapModel())'));
for(const [id,p]of Object.entries(overview.positions)){assert(p.y>85&&p.y+115<overview.height,'Clipped node '+id);for(const [other,q]of Object.entries(overview.positions)){if(id!==other&&run(`Boolean(worldPlaces['${id}']&&worldPlaces['${other}'])`)&&Math.abs(p.x-q.x)<220)assert(Math.abs(p.y-q.y)>=205,'Cluster overlap '+id+' / '+other);}}
const seenPairs=new Set();for(const edge of data.edges){assert(data.currents.some(c=>c.id===edge.from)&&data.currents.some(c=>c.id===edge.to));assert(edge.source.startsWith('https://'));const pair=edge.from+'>'+edge.to;assert(!seenPairs.has(pair));seenPairs.add(pair);}
run("goRegion('all')");
const svgStyle='.epoch-label{font:600 17px sans-serif;fill:#5b665f}.epoch-context{font:13px sans-serif;fill:#8a9189}.school-label text{font:600 16px sans-serif}.person-label{font-family:sans-serif;fill:#23362e;paint-order:stroke;stroke:#f8f7f2;stroke-width:3px}.secondary-label{display:none}.ribbon{opacity:.19}.ribbon-spine{opacity:.36}';
fs.writeFileSync('/tmp/atlas-overview.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="${run('mapModel.width')}" height="${run('mapModel.height')}"><style>${svgStyle}</style>${el('riverSvg').innerHTML}</svg>`);
for(const id of ['india','china','islam','africa','americas']){run(`goRegion('${id}')`);const b=JSON.parse(run(`JSON.stringify(worldBands.find(b=>b.id==='${id}'))`));fs.writeFileSync('/tmp/atlas-'+id+'.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="2550" height="${b.height}" viewBox="0 ${b.top} 2550 ${b.height}"><style>${svgStyle}.tradition-heading{font:700 19px sans-serif}.tradition-caption{font:15px sans-serif}</style>${el('riverSvg').innerHTML}</svg>`);}
run("selectSchool('heidegger')");const m=JSON.parse(run('JSON.stringify(mapModel)'));
fs.writeFileSync('/tmp/atlas-focus.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="${m.width}" height="${m.height}"><style>${svgStyle.replace('.secondary-label{display:none}','')}</style>${el('riverSvg').innerHTML}</svg>`);
console.log(JSON.stringify({schools:data.currents.length,people:data.philosophers.length,relations:data.edges.length,personalCards:'PASS',schoolFiltering:'PASS',searchAndZoom:'PASS',svgGeometry:'PASS',browserQA:'not run'}));

assert.equal(run('politicalQuestions.length'),70);
assert.equal(run('scorePolitical([])'),null);
assert.equal(run('scorePolitical(new Array(70))'),null);
const neutral=JSON.parse(run('JSON.stringify(scorePolitical(Array(70).fill(2)))'));
assert.deepEqual(neutral,{econ:50,dipl:50,govt:50,scty:50});
for(const key of ['econ','dipl','govt','scty']){
 assert.equal(run(`scorePolitical(politicalQuestions.map(q=>q.effect.${key}>=0?0:4)).${key}`),100);
 assert.equal(run(`scorePolitical(politicalQuestions.map(q=>q.effect.${key}>=0?4:0)).${key}`),0);
}
assert.equal(run('philosophyRoutes(philosophyQuestions.map(q=>q.options.length)).length'),0);
run("startAssessment('political');recordAnswer(0)");assert.equal(run('testStates.political.answers[0]'),0);
run("recordAnswer(4)");assert.equal(run('testStates.political.answers[0]'),4);
run("testStates.political.answers=Array(70).fill(2);testStates.political.index=70;renderAssessment()");assert(el('assessmentRunner').innerHTML.includes('Ваш профиль 8values'));
run("startAssessment('philosophy');testStates.philosophy.answers=philosophyQuestions.map(q=>q.options.length);testStates.philosophy.index=10;renderAssessment()");assert(el('assessmentRunner').innerHTML.includes('Пока нет оснований'));
run("testStates.philosophy.answers=Array(10).fill(0);renderAssessment()");assert(el('assessmentRunner').innerHTML.includes('Мои ответы'));
console.log('Optional traditions, expanded content, quiz scoring and answer revision: PASS');
