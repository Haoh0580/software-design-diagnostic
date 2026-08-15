const DIAG_KEY = 'diagnostic-test-v1-state';
const DASH_KEY = 'training-center-v1';
const diag = JSON.parse(localStorage.getItem(DIAG_KEY) || '{}');
const dash = JSON.parse(localStorage.getItem(DASH_KEY) || '{}');
let activePartId = null, activeQuestion = 0, ticker = null;
const $ = s => document.querySelector(s);
const saveDiag = () => localStorage.setItem(DIAG_KEY, JSON.stringify(diag));
const saveDash = () => localStorage.setItem(DASH_KEY, JSON.stringify(dash));
const escapeHtml = (v = '') => String(v).replace(/[&<>'"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[c]));
const formatTime = s => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
const dateOnly = s => new Date(`${s}T00:00:00`);

const GOALS = [
  { title:'第一次四技二專模擬考', start:'2026-10-19', end:'2026-10-20' },
  { title:'工科技藝競賽－電腦軟體設計', start:'2026-11-24', end:'2026-11-27', primary:true },
  { title:'第二次四技二專模擬考', start:'2026-12-15', end:'2026-12-16' }
];
const PHASES = [
  ['A','2026-08-15','2026-08-23','啟動 / 基礎盤點期',50,50], ['B','2026-08-24','2026-09-20','競賽基礎強化期',60,40],
  ['C','2026-09-21','2026-10-11','第一次模考加重期',40,60], ['D','2026-10-12','2026-10-18','第一次模考衝刺',20,80],
  ['E','2026-10-19','2026-10-20','第一次模考',0,100], ['F','2026-10-21','2026-11-09','競賽衝刺 I',75,25],
  ['G','2026-11-10','2026-11-23','競賽衝刺 II',90,10], ['H','2026-11-24','2026-11-27','Competition Mode',100,0],
  ['I','2026-11-28','2026-12-07','第二次模考回歸',20,80], ['J','2026-12-08','2026-12-14','第二次模考衝刺',10,90],
  ['K','2026-12-15','2026-12-16','第二次模考',0,100]
].map(([id,start,end,name,competition,mock]) => ({id,start,end,name,competition,mock}));
const MISSIONS = [
  {id:'array',category:'Competition',title:'Array',amount:2,estimatedMinutes:8}, {id:'string',category:'Competition',title:'String',amount:2,estimatedMinutes:8},
  {id:'debug',category:'Competition',title:'Debug',amount:2,estimatedMinutes:10}, {id:'coding',category:'Competition',title:'Coding',amount:1,estimatedMinutes:20},
  {id:'electric',category:'Mock Exam',title:'基本電學 Unit 1',amount:5,estimatedMinutes:10}, {id:'electronics',category:'Mock Exam',title:'電子學 Unit 1',amount:5,estimatedMinutes:10}
];
const DURATIONS = [{min:5,text:'Output Prediction × 2、Debug × 1'}, {min:10,text:'Output × 2、Debug × 2、錯題 × 1'}, {min:20,text:'Algorithm × 2、錯題 × 3、模考題 × 5'}, {min:45,text:'Coding Challenge × 1，或模考章節訓練 × 15'}, {min:90,text:'Mini Contest：限時讀題、Coding、Debug'}];
const currentPhase = (now = new Date()) => PHASES.find(p => now >= dateOnly(p.start) && now <= dateOnly(p.end)) || (now < dateOnly(PHASES[0].start) ? PHASES[0] : {name:'第二次模考後整理期',start:'2026-12-17',end:'2026-12-21',competition:15,mock:85});
function dayStatus(goal) { const now = new Date(); now.setHours(0,0,0,0); const start = dateOnly(goal.start), end = dateOnly(goal.end); if (now > end) return '已完成'; if (now >= start) return '進行中'; return `剩餘 ${Math.ceil((start-now)/86400000)} 天`; }

function setView(name) { stopTimer(); document.querySelectorAll('.view').forEach(v => v.hidden = v.id !== `${name}-view`); document.querySelectorAll('[data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === name)); dash.nav = name; saveDash(); if(name === 'today') renderToday(); if(name === 'library') renderLibrary(); if(name === 'diagnostic') renderDiagnostic(); }
function renderToday() {
  const phase = currentPhase();
  $('#goal-list').innerHTML = GOALS.map(g => `<article class="goal ${g.primary?'primary':''} ${dayStatus(g)==='已完成'?'past':''}"><h2>${g.title}</h2><p>${g.start.replaceAll('-','/')}–${g.end.replaceAll('-','/')}</p><strong>${dayStatus(g)}</strong></article>`).join('');
  $('#phase-name').textContent = `目前階段：${phase.name}`; $('#phase-dates').textContent = `Phase ${phase.id || 'After'} · ${phase.start.replaceAll('-','/')}–${phase.end.replaceAll('-','/')}`;
  $('#competition-bar').style.width = `${phase.competition}%`; $('#mock-bar').style.width = `${phase.mock}%`; $('#competition-text').textContent = `Competition ${phase.competition}%`; $('#mock-text').textContent = `Mock Exam ${phase.mock}%`;
  const done = dash.missions || {}; const count = MISSIONS.filter(m => done[m.id]).length; $('#mission-summary').textContent = `今日完成 ${count} / ${MISSIONS.length}`;
  $('#remaining-time').textContent = `預計剩餘時間：${MISSIONS.filter(m=>!done[m.id]).reduce((n,m)=>n+m.estimatedMinutes,0)} 分鐘`;
  $('#mission-list').innerHTML = MISSIONS.map(m => `<label class="mission ${done[m.id]?'done':''}"><input type="checkbox" data-mission="${m.id}" ${done[m.id]?'checked':''}><span><span class="mission-category">${m.category}</span><span class="mission-title">${m.title} × ${m.amount}</span><small>約 ${m.estimatedMinutes} 分鐘</small></span></label>`).join('');
  const selected = dash.duration || 10; $('#duration-list').innerHTML = DURATIONS.map(d => `<button class="${d.min===selected?'active':''}" data-duration="${d.min}">${d.min} 分</button>`).join('');
  $('#duration-recommendation').textContent = `推薦：${DURATIONS.find(d=>d.min===selected).text}`;
  $('#daily-hint').textContent = phase.mock > phase.competition ? '模考比重較高，先完成一組錯題或章節複習，再保留短時間 Coding 手感。' : '先完成一個可勾選的小任務；短練習持續累積，比一次做很多更重要。';
}
function renderLibrary() { $('#training-list').innerHTML = TRAINING_PACKS.map(p => `<article class="part-card"><h3>${p.title}</h3><p>${p.source} · ${p.questions.length} 題</p><button class="button" data-pack="${p.id}">開始練習</button></article>`).join(''); }
function shuffledOrder(length) { return Array.from({length}, (_, i) => i).sort(() => Math.random() - .5); }
function renderPack(id) { const p = TRAINING_PACKS.find(x=>x.id===id); if(!p)return; dash.packOrder ||= {}; dash.packAnswers ||= {}; if(!dash.packOrder[id]) dash.packOrder[id] = shuffledOrder(p.questions.length); saveDash(); const answers=dash.packAnswers[id]||{}; const ordered=dash.packOrder[id].map(i=>({q:p.questions[i],index:i})); setView('pack'); $('#pack-container').innerHTML = `<div class="panel"><p class="section-label">${p.label}</p><h2>${p.title}</h2><p class="muted">${p.source} · 本組 ${p.questions.length} 題示範題，題序已隨機排列。</p>${ordered.map(({q,index},i)=>{const selected=answers[index];return `<article class="question-card"><p>第 ${i+1} 題</p><h3>${q.q}</h3>${q.c.map((c,n)=>`<button class="choice" data-answer="${n}" data-pack="${p.id}" data-question="${index}" ${selected===undefined?'':'disabled'} style="${selected===undefined?'':n===q.a?'border-color:#2c7c61':n===selected?'border-color:#b84343':''}">${String.fromCharCode(65+n)}．${c}</button>`).join('')}<p class="feedback">${selected===undefined?'':selected===q.a?`正確。${q.e}`:`正解：${String.fromCharCode(65+q.a)}。${q.e}`}</p></article>`}).join('')}<p id="pack-status" class="muted"></p><button class="button full" data-finish-pack="${p.id}">完成本組並查看摘要</button><button class="text-button" data-retry-pack="${p.id}">重新開始本組（重新排序）</button></div>`; }
function answerPack(button) { const p=TRAINING_PACKS.find(x=>x.id===button.dataset.pack), q=p.questions[+button.dataset.question], card=button.closest('.question-card'), selected=+button.dataset.answer; dash.packAnswers ||= {}; dash.packAnswers[p.id] ||= {}; dash.packAnswers[p.id][button.dataset.question]=selected; saveDash(); card.querySelectorAll('.choice').forEach(b=>{b.disabled=true;if(+b.dataset.answer===q.a)b.style.borderColor='#2c7c61'}); button.style.borderColor=selected===q.a?'#2c7c61':'#b84343'; card.querySelector('.feedback').textContent=selected===q.a?`正確。${q.e}`:`正解：${String.fromCharCode(65+q.a)}。${q.e}`; }
function finishPack(id) { const p=TRAINING_PACKS.find(x=>x.id===id), answers=(dash.packAnswers||{})[id]||{}, answered=Object.keys(answers).length; if(answered<p.questions.length){$('#pack-status').textContent=`尚有 ${p.questions.length-answered} 題未作答，完成後才能查看摘要。`;return;} const correct=p.questions.filter((q,i)=>answers[i]===q.a).length; $('#pack-status').innerHTML=`<strong>本組完成：${correct}/${p.questions.length} 題正確（${Math.round(correct/p.questions.length*100)}%）。</strong> 錯題已保留在本機，下一步可納入錯題分析。`; }
function retryPack(id) { dash.packAnswers ||= {}; dash.packOrder ||= {}; delete dash.packAnswers[id]; dash.packOrder[id]=shuffledOrder(TRAINING_PACKS.find(x=>x.id===id).questions.length); saveDash(); renderPack(id); }

const partState = id => diag[id] ||= {answers:{},seconds:0,startedAt:null,completed:false};
const elapsed = ps => ps.seconds + (ps.startedAt ? Math.floor((Date.now()-ps.startedAt)/1000) : 0);
function stopTimer(){const ps=activePartId&&partState(activePartId);if(ps?.startedAt){ps.seconds=elapsed(ps);ps.startedAt=null;saveDiag()}clearInterval(ticker)}
function renderDiagnostic(){ $('#part-list').innerHTML=TEST_PARTS.map(p=>{const ps=partState(p.id),n=Object.values(ps.answers).filter(x=>String(x).trim()).length;return `<article class="part-card"><h3>Part ${p.id} · ${p.title}</h3><p>${p.description} · ${n}/${p.questions.length} 已作答 · ${formatTime(elapsed(ps))}</p><button class="button" data-part="${p.id}">${ps.completed?'再次檢視':n?'繼續作答':'開始'}</button></article>`}).join(''); }
function startPart(id){activePartId=id;activeQuestion=0;const ps=partState(id);if(!ps.startedAt){ps.startedAt=Date.now();saveDiag()}setView('test');ticker=setInterval(renderQuestion,1000);renderQuestion()}
function renderQuestion(){const p=TEST_PARTS.find(x=>x.id===activePartId),q=p.questions[activeQuestion],ps=partState(p.id),a=ps.answers[q.id]||'';$('#question-container').innerHTML=`<div class="question-card"><p class="section-label">Part ${p.id} · 第 ${activeQuestion+1}/${p.questions.length} 題 · ${formatTime(elapsed(ps))}</p><h2>${p.title}</h2><p>${escapeHtml(q.prompt).replace(/\n/g,'<br>')}</p>${q.type==='choice'?q.choices.map((c,i)=>`<button class="choice ${a===String(i)?'selected':''}" data-choice="${i}">${String.fromCharCode(65+i)}．${c}</button>`).join(''):`<textarea id="short-answer" placeholder="在此作答…">${escapeHtml(a)}</textarea>`}<p class="muted">答案會自動儲存至本機。</p><button id="previous-question" class="text-button" ${activeQuestion===0?'disabled':''}>← 上一題</button><button id="next-question" class="button">${activeQuestion===p.questions.length-1?'儲存並完成':'下一題'}</button></div>`; }
function persistAnswer(value){const p=TEST_PARTS.find(x=>x.id===activePartId);partState(p.id).answers[p.questions[activeQuestion].id]=value;saveDiag()}
function isCorrect(q,a){if(q.type==='choice')return a===q.answer;if(q.answer)return q.answer.includes(String(a).trim().toLowerCase());const t=String(a).toLowerCase();return (q.keywords||[]).filter(k=>t.includes(String(k).toLowerCase())).length >= (q.type==='long'?2:1)}
function score(p){const ps=partState(p.id);const correct=p.questions.filter(q=>isCorrect(q,ps.answers[q.id]||'')).length;return {correct,total:p.questions.length,percent:Math.round(correct/p.questions.length*100),seconds:elapsed(ps)}}
function renderResults(){stopTimer();setView('result');const scores=TEST_PARTS.map(score),total=scores.reduce((n,x)=>n+x.total,0),correct=scores.reduce((n,x)=>n+x.correct,0);$('#result-container').innerHTML=`<div class="panel"><p class="section-label">Skill Check Result</p><h2>Diagnostic Test v1</h2><p class="result-score">${Math.round(correct/total*100)}%</p>${TEST_PARTS.map((p,i)=>`<p><strong>Part ${p.id} ${p.title}</strong><br>${scores[i].correct}/${scores[i].total} 題正確 · ${formatTime(scores[i].seconds)}</p>`).join('')}<button class="button full" data-nav="progress">回到進度</button></div>`}

document.addEventListener('click', e => { const b=e.target.closest('button'); if(!b)return; if(b.dataset.nav)setView(b.dataset.nav); if(b.dataset.pack && b.dataset.answer===undefined)renderPack(b.dataset.pack); if(b.dataset.answer!==undefined)answerPack(b); if(b.dataset.finishPack)finishPack(b.dataset.finishPack); if(b.dataset.retryPack)retryPack(b.dataset.retryPack); if(b.dataset.part)startPart(b.dataset.part); if(b.dataset.choice!==undefined){persistAnswer(b.dataset.choice);renderQuestion()} if(b.id==='back-diagnostic')setView('diagnostic'); if(b.id==='next-question'){const p=TEST_PARTS.find(x=>x.id===activePartId);const text=$('#short-answer');if(text)persistAnswer(text.value); if(activeQuestion===p.questions.length-1){partState(p.id).completed=true;saveDiag();renderResults()}else{activeQuestion++;renderQuestion()}} if(b.id==='previous-question'){const text=$('#short-answer');if(text)persistAnswer(text.value);if(activeQuestion){activeQuestion--;renderQuestion()}} if(b.id==='show-result')renderResults(); if(b.id==='open-diagnostic')setView('diagnostic'); });
document.addEventListener('change', e=>{if(e.target.dataset.mission){dash.missions ||= {};dash.missions[e.target.dataset.mission]=e.target.checked;saveDash();renderToday()}});
document.addEventListener('click', e=>{const b=e.target.closest('[data-duration]');if(b){dash.duration=+b.dataset.duration;saveDash();renderToday()}});
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js?v=9');
setView('today');
