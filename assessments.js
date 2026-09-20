'use strict';
// Topic selection: PhilPapers 2009. Original educational explanations and reading links.
// No PhilPapers classification algorithm is claimed or reproduced.
const philosophyQuestions=[
 {title:'Откуда берётся знание?',hint:'Представьте спор, в котором логически стройная теория расходится с наблюдением. Чему вы доверитесь прежде всего?',options:[['Опыт и наблюдение','Эмпиризм: общие выводы должны опираться на опыт.',['empiricism']],['Разум и доказательство','Рационализм: часть знания обосновывается рассуждением.',['rationalism']],['Их сочетание','Исследовать, что даёт опыт и что вносит познающий субъект.',['kant']]]},
 {title:'Можно ли знать что-то до проверки опытом?',hint:'Например, требуется ли пересчитать все пары предметов, чтобы обосновать арифметическое равенство?',options:[['Да, некоторые истины','Априорное обоснование не сводится к накоплению наблюдений.',['kant','rationalism']],['Нет, в конечном счёте нужен опыт','Даже самые общие убеждения нуждаются в опытном основании.',['empiricism']]]},
 {title:'Что делает поступок правильным?',hint:'При трудном выборе можно спрашивать о результате, о допустимости самого действия или о качествах действующего человека.',options:[['Последствия для затронутых людей','Консеквенциализм оценивает действие через его последствия.',['utilitarian']],['Обязанности и уважение к человеку','Деонтология исследует принципы, ограничивающие средства.',['kant']],['Характер и практическая мудрость','Этика добродетели спрашивает, каким человеком стоит становиться.',['aristotle','hellenistic']]]},
 {title:'Есть ли моральная истина независимо от одобрения?',hint:'Если общество единодушно одобряет жестокость, достаточно ли этого, чтобы она стала правильной?',options:[['Есть основания осудить её независимо от мнения','Моральный реализм признаёт независимую правильность хотя бы некоторых моральных суждений.',['kant','aristotle']],['Моральные оценки зависят от человеческих практик','Антиреалистические подходы различаются: они могут объяснять нормы соглашением, чувствами или историей.',['empiricism','irrationalism']]]},
 {title:'Совместима ли свобода с причинной обусловленностью?',hint:'Если у выбора есть причины — воспитание, желания, обстоятельства, — исчезает ли ответственность?',options:[['Свободный выбор может иметь причины','Компатибилизм различает причинность и принуждение.',['rationalism','empiricism']],['Для свободы нужна подлинная открытость выбора','Либертарианство о свободе воли — отдельная тема, не название политической позиции.',['kierkegaard','existentialism']],['Полной свободы воли нет','Скепсис к свободе воли заставляет пересмотреть основания ответственности.',['rationalism']]]},
 {title:'Как связаны сознание и физический мир?',hint:'Сравните описание мозговой активности с тем, как переживается боль. Достаточно ли первого, чтобы полностью объяснить второе?',options:[['Сознание целиком относится к физической реальности','Физикалистический подход ищет объяснение в устройстве природы.',['analytic']],['У сознания есть несводимая сторона','Нефизикалистические позиции по-разному объясняют её статус.',['rationalism']],['Сначала нужно описать сам опыт','Это дополнительный маршрут атласа: феноменология исследует переживание, не решая вопрос одним ярлыком.',['phenomenology']]]},
 {title:'Существует ли мир независимо от восприятия?',hint:'Что вы предполагаете о комнате, пока никто в неё не смотрит?',options:[['Да, её существование не зависит от наблюдателя','Реалистическая позиция допускает ошибки восприятия без отрицания внешнего мира.',['aristotle','analytic']],['Сознание существенно для того, что мы называем миром','Идеалистические подходы исследуют зависимость предметности от мышления и опыта.',['idealism']],['Для окончательного ответа недостаточно оснований','Скептическая позиция ставит вопрос о границах обоснования.',['skepticism']]]},
 {title:'Что такое числа и общие понятия?',hint:'Два дерева различаются, но мы применяем к ним одно понятие. Существует ли общее независимо от отдельных вещей?',options:[['Есть самостоятельная реальность общего','Платонистский маршрут: исследовать статус форм и абстрактных объектов.',['classics']],['Общее — способ говорить и мыслить о единичном','Номиналистский маршрут: объяснить общность без отдельных универсальных сущностей.',['nominalism']]]},
 {title:'Что утверждает успешная научная теория?',hint:'Прибор показывает след частицы, которую нельзя увидеть непосредственно. Говорит ли теория о реальном устройстве мира?',options:[['Она приближённо описывает независимую реальность','Научный реализм связывает успех объяснения с устройством мира.',['analytic']],['Главное — надёжно объяснять и предсказывать наблюдения','Антиреалистические подходы ограничивают обязательства о ненаблюдаемом; полезен спор логического эмпиризма с реализмом.',['logical','pragmatism']]]},
 {title:'Красота — в предмете или в зрителе?',hint:'Если два человека по-разному переживают одну музыку, возможен ли обоснованный спор о её ценности?',options:[['Есть основания, не сводимые к личному вкусу','Объективистский маршрут: искать общие основания эстетической оценки.',['classics']],['Ценность зависит от переживания и контекста','Субъективистский маршрут: исследовать чувство и формирование вкуса.',['empiricism']],['Суждение лично, но претендует на разделяемость','Дополнительный маршрут атласа: кантовский вопрос об общезначимости без строгого доказательства.',['kant']]]}
];
const politicalLabels=['Полностью согласен','Скорее согласен','Нейтрально / не уверен','Скорее не согласен','Полностью не согласен'];
const answerFactors=[1,.5,0,-.5,-1];
const politicalAxes=[['econ','Экономика','Равенство','Рынок','Перераспределение и общественные услуги ↔ свободный рынок и частная инициатива.'],['dipl','Международные отношения','Мир','Нация','Международное сотрудничество ↔ приоритет национальных интересов.'],['govt','Гражданские свободы','Свобода','Авторитет','Личная автономия ↔ сильные полномочия власти.'],['scty','Общество','Прогресс','Традиция','Изменение общественных норм ↔ сохранение традиционных норм.']];
const testStates={philosophy:{answers:[],index:0},political:{answers:[],index:0}};
let activeTest=null;
const testQuestions=kind=>kind==='political'?politicalQuestions:philosophyQuestions;
function scorePolitical(answers){
 if(answers.length!==politicalQuestions.length||Array.from({length:politicalQuestions.length},(_,i)=>answers[i]).some(a=>!Number.isInteger(a)||a<0||a>4))return null;
 return Object.fromEntries(politicalAxes.map(([key])=>{const max=politicalQuestions.reduce((sum,q)=>sum+Math.abs(q.effect[key]),0),sum=politicalQuestions.reduce((sum,q,i)=>sum+answerFactors[answers[i]]*q.effect[key],0);return [key,Math.round(1000*(max+sum)/(2*max))/10];}));
}
function philosophyRoutes(answers){
 const matches=new Map();
 philosophyQuestions.forEach((q,i)=>{const a=q.options[answers[i]];if(a)a[2].forEach(id=>{if(!matches.has(id))matches.set(id,[]);matches.get(id).push(i);});});
 return [...matches].sort((a,b)=>b[1].length-a[1].length||a[0].localeCompare(b[0]));
}
function startAssessment(kind){if(!testStates[kind])return;activeTest=kind;$('#assessmentHome').hidden=true;$('#assessmentRunner').hidden=false;renderAssessment();}
function renderAssessment(){
 const box=$('#assessmentRunner'),state=testStates[activeTest],questions=testQuestions(activeTest),q=questions[state.index];
 if(!q){renderAssessmentResult();return;}
 const choices=activeTest==='political'?politicalLabels.map(label=>[label,'']):[...q.options,['Пока не определился','Вернёмся к этому вопросу после чтения.'],['Моя позиция сложнее этих вариантов','Ответ не будет привязан к одной школе.']];
 box.innerHTML=`<div class="test-toolbar"><button data-test-home>← Выбор теста</button><span>${activeTest==='political'?'8values':'Философский профиль'}</span><button data-test-clear>Начать заново</button></div><p class="eyebrow">Вопрос ${state.index+1} из ${questions.length}</p><progress max="${questions.length}" value="${state.index}" aria-label="Прогресс теста"></progress><h3 id="testQuestion" tabindex="-1">${esc(q.title||q.question)}</h3>${q.hint?`<p class="question-hint">${esc(q.hint)}</p>`:''}<div class="answer-options" role="group" aria-labelledby="testQuestion">${choices.map(([label,help],i)=>`<button data-answer="${i}" aria-pressed="${state.answers[state.index]===i}"><strong>${esc(label)}</strong>${help?`<span>${esc(help)}</span>`:''}</button>`).join('')}</div><div class="test-toolbar"><button data-test-back ${state.index===0?'disabled':''}>← Предыдущий вопрос</button><button data-test-next ${state.answers[state.index]===undefined?'disabled':''}>${state.index===questions.length-1?'Показать результат':'Следующий →'}</button></div>`;
 $('#testQuestion').focus();
}
function recordAnswer(index){const state=testStates[activeTest],q=testQuestions(activeTest)[state.index],max=activeTest==='political'?4:q.options.length+1;if(!Number.isInteger(index)||index<0||index>max)return;state.answers[state.index]=index;renderAssessment();}
function assessmentReview(){const state=testStates[activeTest];return '<details class="answer-review"><summary>Мои ответы и их вклад</summary>'+testQuestions(activeTest).map((q,i)=>{const a=state.answers[i],label=activeTest==='political'?politicalLabels[a]:q.options[a]?.[0]||(a===q.options.length?'Пока не определился':'Моя позиция сложнее этих вариантов');const detail=activeTest==='political'?politicalAxes.filter(([key])=>q.effect[key]!==0).map(([key,title])=>title+': '+(answerFactors[a]*q.effect[key]>0?'+':'')+answerFactors[a]*q.effect[key]).join(' · '):q.options[a]?.[1]||'Без привязки к школе.';return `<article><p><strong>${i+1}. ${esc(q.title||q.question)}</strong></p><p>${esc(label)}</p><p class="small">${esc(detail)}</p><button data-test-edit="${i}">Изменить ответ</button></article>`;}).join('')+'</details>';}
function politicalResultHTML(scores,neutral=false){return '<h3 id="testQuestion" tabindex="-1">Ваш профиль 8values</h3><p>Четыре независимые шкалы. Значения показывают баланс ответов в этом тесте; это не вероятность и не процент согласия с политической партией.</p>'+renderPoliticalProfile(scores,neutral)+'<h4>Все четыре шкалы</h4>'+politicalAxes.map(([key,title,left,right,meaning])=>`<section class="axis-result"><h4>${title}</h4><div class="axis-labels"><span>${left} <strong>${scores[key]}%</strong></span><span><strong>${Math.round((100-scores[key])*10)/10}%</strong> ${right}</span></div><div class="axis-bar" role="img" aria-label="${title}: ${left} ${scores[key]} процентов; ${right} ${Math.round((100-scores[key])*10)/10} процентов"><i style="width:${scores[key]}%"></i></div><p>${meaning}</p></section>`).join('')+'<details><summary>Формула подсчёта</summary><p>По каждой шкале: 100 × (сумма модулей весов + сумма произведений веса на ответ) / (2 × сумма модулей весов). Коэффициенты ответа: +1; +0,5; 0; −0,5; −1. В разборе ниже показан вклад каждого ответа. Веса и вопросы сохранены из русскоязычного 8values.</p></details><h4>Разобраться в основаниях</h4><div class="person-schools"><button data-detail="justice">Ролз и Нозик: справедливость</button><button data-detail="contract">Общественный договор</button><button data-detail="marxism">Марксизм</button><button data-detail="arendt">Свобода у Арендт</button></div>';}
function renderAssessmentResult(){
 const state=testStates[activeTest],box=$('#assessmentRunner');let result='';
 if(activeTest==='political'){
  const scores=scorePolitical(state.answers);if(!scores){state.index=Array.from({length:politicalQuestions.length},(_,i)=>i).find(i=>state.answers[i]===undefined)??0;renderAssessment();return;}
  result=politicalResultHTML(scores,state.answers.every(a=>a===2));
 }else{
  const routes=philosophyRoutes(state.answers),answered=state.answers.filter((a,i)=>a<philosophyQuestions[i].options.length).length;
  result=`<h3 id="testQuestion" tabindex="-1">Ваш философский профиль</h3><p>Определённая позиция выбрана в ${answered} из 10 вопросов. Ниже — маршруты чтения по отдельным совпадениям. Их число помогает расставить приоритеты, но не измеряет вашу принадлежность к школе.</p>`;
  result+=routes.length?'<div class="recommend-grid">'+routes.map(([id,indices])=>`<article class="recommend"><h4>${esc(byId(id).name)}</h4><p>Точки соприкосновения: ${indices.map(i=>esc(philosophyQuestions[i].title)).join(' · ')}</p><p>${esc(byId(id).reading)}</p><button data-detail="${id}">Идеи и критика</button><button data-school="${id}">Проследить на карте →</button></article>`).join('')+'</div>':'<p>Пока нет оснований выделить близкую школу. Начните с разбора любого вопроса и вернитесь к ответам после чтения.</p>';
  result+='<p>Опрос преимущественно охватывает споры аналитической философии. Для вопросов о конечности и смысле дополнительно откройте <button data-detail="heidegger">Хайдеггера</button> и <button data-detail="existentialism">экзистенциализм</button>: эти темы не выражаются результатом данного профиля.</p>';
 }
 box.innerHTML='<div class="test-toolbar"><button data-test-home>← Выбор теста</button><button data-test-clear>Пройти заново</button></div>'+result+assessmentReview();$('#testQuestion').focus();
}
$('#compassView').addEventListener('click',e=>{
 const start=e.target.closest('[data-test]'),answer=e.target.closest('[data-answer]'),edit=e.target.closest('[data-test-edit]');
 if(start){startAssessment(start.dataset.test);return;}if(!activeTest)return;const state=testStates[activeTest];
 if(answer)recordAnswer(Number(answer.dataset.answer));
 else if(e.target.closest('[data-test-next]')&&state.answers[state.index]!==undefined){state.index++;renderAssessment();}
 else if(e.target.closest('[data-test-back]')){state.index=Math.max(0,state.index-1);renderAssessment();}
 else if(edit){state.index=Number(edit.dataset.testEdit);renderAssessment();}
 else if(e.target.closest('[data-test-home]')){$('#assessmentRunner').hidden=true;$('#assessmentHome').hidden=false;}
 else if(e.target.closest('[data-test-clear]')){state.answers=[];state.index=0;renderAssessment();}
});

function parsePoliticalScoreInputs(values){
 const scores={};
 for(const key of profileKeys){const value=String(values[key]??'').trim().replace(',','.');if(!/^\d+(\.\d+)?$/.test(value))return null;scores[key]=Number(value);}
 return validPoliticalScores(scores)?scores:null;
}
$('#manualScores').addEventListener('submit',e=>{
 e.preventDefault();const scores=parsePoliticalScoreInputs(Object.fromEntries(profileKeys.map(key=>[key,$('#manual-'+key).value])));
 if(!scores){$('#manualError').textContent='Заполните все четыре поля числами от 0 до 100.';return;}
 $('#manualError').textContent='';activeTest=null;$('#assessmentHome').hidden=true;$('#assessmentRunner').hidden=false;
 $('#assessmentRunner').innerHTML='<div class="test-toolbar"><button data-manual-home>← Выбор теста</button></div>'+politicalResultHTML(scores)+'<p class="small">Профиль построен по введённым процентам. Разбор отдельных ответов доступен после прохождения теста в этой вкладке.</p>';
 $('#testQuestion').focus();
});
$('#compassView').addEventListener('click',e=>{if(e.target.closest('[data-manual-home]')){$('#assessmentRunner').hidden=true;$('#assessmentHome').hidden=false;}});
