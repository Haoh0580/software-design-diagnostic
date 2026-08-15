const STORAGE_KEY = 'diagnostic-test-v1-state';
const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
let activePartId = null, activeQuestion = 0, ticker = null;
const $ = (s) => document.querySelector(s);
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
const partState = (id) => state[id] ||= { answers: {}, seconds: 0, startedAt: null, completed: false };
const escapeHtml = (v = '') => v.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

function elapsed(ps) { return ps.seconds + (ps.startedAt ? Math.floor((Date.now() - ps.startedAt) / 1000) : 0); }
function stopTimer() { const ps = activePartId && partState(activePartId); if (ps?.startedAt) { ps.seconds = elapsed(ps); ps.startedAt = null; save(); } clearInterval(ticker); }
function show(view) { ['home-view','test-view','result-view'].forEach(id => $('#'+id).classList.toggle('hidden', id !== view)); }
function renderHome() {
  stopTimer(); show('home-view');
  $('#part-list').innerHTML = TEST_PARTS.map(p => { const ps = partState(p.id), answered = Object.keys(ps.answers).filter(k => ps.answers[k].trim()).length; return `<article class="part-card" style="--part:${p.color}"><div><p class="part-kicker">Part ${p.id} · ${p.duration} 分鐘</p><h2>${p.title}</h2><p>${p.description}</p><small>${answered}/${p.questions.length} 已作答 · ${formatTime(elapsed(ps))}</small></div><button class="button" data-part="${p.id}">${ps.completed ? '再次檢視' : answered ? '繼續作答' : '開始'}</button></article>`; }).join('');
}
function startPart(id) { activePartId = id; activeQuestion = 0; const ps = partState(id); if (!ps.startedAt) { ps.startedAt = Date.now(); save(); } show('test-view'); ticker = setInterval(renderTimer, 1000); renderQuestion(); }
function renderTimer() { $('#timer').textContent = formatTime(elapsed(partState(activePartId))); }
function renderQuestion() {
  const part = TEST_PARTS.find(p => p.id === activePartId), q = part.questions[activeQuestion], ps = partState(part.id), answer = ps.answers[q.id] || '';
  $('#test-part-label').textContent = `Part ${part.id} · ${part.duration} 分鐘建議`;
  $('#test-title').textContent = part.title; renderTimer();
  $('#question-count').textContent = `第 ${activeQuestion + 1} / ${part.questions.length} 題`;
  $('#progress-fill').style.width = `${((activeQuestion + 1) / part.questions.length) * 100}%`;
  const prompt = escapeHtml(q.prompt).replace(/\n/g, '<br>');
  let input = q.type === 'choice' ? `<div class="choices">${q.choices.map((c,i) => `<label class="choice ${answer === String(i) ? 'selected':''}"><input type="radio" name="answer" value="${i}" ${answer === String(i) ? 'checked':''}><span>${String.fromCharCode(65+i)}</span>${escapeHtml(c)}</label>`).join('')}</div>` : `<textarea name="answer" rows="${q.type === 'long' ? 9 : 4}" placeholder="在此作答…">${escapeHtml(answer)}</textarea>`;
  $('#question-form').innerHTML = `<article class="question-card"><p class="category">${q.category}</p><h3>${prompt}</h3>${input}<p class="autosave">會自動儲存到此裝置</p></article>`;
  $('#previous-question').disabled = activeQuestion === 0; $('#next-question').textContent = activeQuestion === part.questions.length - 1 ? '儲存並完成' : '下一題';
  $('#question-form').oninput = event => { if (event.target.matches('textarea')) persistAnswer(event); };
  $('#question-form').onchange = persistAnswer;
}
function persistAnswer(event) {
  const form = $('#question-form');
  const input = event?.target || form.querySelector('[name=answer]:checked') || form.querySelector('[name=answer]');
  if (!input) return;
  partState(activePartId).answers[TEST_PARTS.find(p => p.id === activePartId).questions[activeQuestion].id] = input.value;
  save();
}
function normal(s) { return (s || '').toLowerCase().replace(/\s/g, ''); }
function isCorrect(q, answer) { if (q.type === 'choice') return answer === q.answer; if (q.answer) return q.answer.includes(normal(answer)); return (q.keywords || []).filter(k => normal(answer).includes(normal(k))).length >= (q.type === 'long' ? 2 : 1); }
function scorePart(p) { const ps = partState(p.id), wrong = [], correct = p.questions.filter(q => { const answer = ps.answers[q.id] || ''; const ok = isCorrect(q, answer); if (answer.trim() && !ok) wrong.push(q.category); return ok; }).length; return { answered:Object.values(ps.answers).filter(a=>a.trim()).length, correct, total:p.questions.length, percent:Math.round(correct/p.questions.length*100), seconds:elapsed(ps), wrong }; }
function finishPart() { persistAnswer(); partState(activePartId).completed = true; save(); renderResults(); }
function renderResults() {
  stopTimer(); show('result-view'); $('#result-date').textContent = `資料儲存於本機 · ${new Date().toLocaleDateString('zh-TW')}`;
  const scores = TEST_PARTS.map(scorePart), completed = TEST_PARTS.filter(p=>partState(p.id).completed).length, totalCorrect = scores.reduce((s,x)=>s+x.correct,0), totalQs = scores.reduce((s,x)=>s+x.total,0);
  $('#overall-score').innerHTML = `<strong>${Math.round(totalCorrect / totalQs * 100)}%</strong><span>目前總分 · 已完成 ${completed}/4 Parts</span>`;
  $('#result-cards').innerHTML = TEST_PARTS.map((p,i) => { const x=scores[i]; return `<article class="score-card" style="--part:${p.color}"><p>Part ${p.id}</p><h3>${p.title}</h3><strong>${x.percent}%</strong><span>${x.correct}/${x.total} 題正確 · ${formatTime(x.seconds)}</span></article>`; }).join('');
  $('#profile-bars').innerHTML = TEST_PARTS.map((p,i)=>`<div class="profile-row"><span>Part ${p.id}</span><div><i style="width:${scores[i].percent}%;background:${p.color}"></i></div><b>${scores[i].percent}%</b></div>`).join('');
  const completedScores = scores.map((score, index) => ({score, part:TEST_PARTS[index]})).filter(x => partState(x.part.id).completed).sort((a,b) => a.score.percent - b.score.percent);
  const weakest = completedScores[0];
  $('#profile-summary').textContent = weakest ? `目前最值得優先加強：${weakest.part.title}（${weakest.score.percent}%）。先針對錯題類型做短練習，再回來重做這個 Part。` : '先完成任一 Part，這裡會整理你的優先練習方向。';
  const wrongs = scores.flatMap(x=>x.wrong); const counts = wrongs.reduce((o,x)=>(o[x]=(o[x]||0)+1,o),{}); $('#weakness-list').innerHTML = Object.keys(counts).length ? Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<span>${k} · ${v}</span>`).join('') : '<span>尚未有錯題資料</span>';
  $('#ai-report-preview').textContent = buildAiReport(scores, completed);
  $('#copy-status').textContent = '';
  setAiReportExpanded(false);
}
function setAiReportExpanded(expanded) {
  $('#ai-report-preview').classList.toggle('hidden', !expanded);
  $('#toggle-ai-report').setAttribute('aria-expanded', String(expanded));
  $('#toggle-ai-report').textContent = expanded ? '收起完整作答明細' : '顯示完整作答明細';
}
function answerLabel(q, answer) { if (!answer) return '未作答'; return q.type === 'choice' ? `${String.fromCharCode(65 + Number(answer))}. ${q.choices[Number(answer)]}` : answer; }
function referenceLabel(q) { return q.type === 'choice' ? `${String.fromCharCode(65 + Number(q.answer))}. ${q.choices[Number(q.answer)]}` : (q.referenceAnswer || '請由教練依題意與作答內容人工判讀。'); }
function buildAiReport(scores, completed) {
  const lines = ['# 電腦軟體設計競賽 Diagnostic Test v1｜AI 判讀報告', `日期：${new Date().toLocaleDateString('zh-TW')}`, `完成 Parts：${completed}/4`, ''];
  TEST_PARTS.forEach((part, index) => {
    const ps = partState(part.id), score = scores[index];
    lines.push(`## Part ${part.id}｜${part.title}`, `分數：${score.percent}%（${score.correct}/${score.total}）｜作答時間：${formatTime(score.seconds)}`, '');
    part.questions.forEach((q, number) => {
      const answer = ps.answers[q.id] || '';
      const systemNote = q.type === 'choice' ? (answer ? (isCorrect(q, answer) ? '正確' : '錯誤') : '未作答') : (answer ? (isCorrect(q, answer) ? '關鍵概念初判符合；仍建議人工判讀。' : '關鍵概念初判不足；請人工判讀。') : '未作答');
      lines.push(`### ${part.id}${number + 1}｜${q.category}`, `題目：${q.prompt.replace(/\n/g, ' ')}`, `使用者作答：${answerLabel(q, answer)}`, `正確答案／參考回覆：${referenceLabel(q)}`, `系統判定：${systemNote}`, '');
    });
  });
  lines.push('## 請 AI 協助分析', '請根據上述逐題作答，判斷我的 C# 語法、Trace／Debug、演算法策略、實作規劃、邊界條件與測試能力；區分「觀念不熟」、「表達不足」與「可能只是關鍵字未命中」，並提出下一週可執行的短練習安排。');
  return lines.join('\n');
}
async function copyAiReport() {
  try { await navigator.clipboard.writeText($('#ai-report-preview').textContent); $('#copy-status').textContent = '已複製。現在可直接貼到 ChatGPT，請 AI 進行完整能力分析。'; }
  catch { $('#copy-status').textContent = '無法自動複製，請展開下方明細後長按或全選複製。'; }
}
$('#part-list').addEventListener('click', e => { if(e.target.dataset.part) startPart(e.target.dataset.part); });
$('#back-home').onclick = renderHome; $('#result-home').onclick = renderHome; $('#show-result').onclick = renderResults;
$('#previous-question').onclick = () => { persistAnswer(); if(activeQuestion) { activeQuestion--; renderQuestion(); } };
$('#next-question').onclick = () => { persistAnswer(); const p=TEST_PARTS.find(p=>p.id===activePartId); if(activeQuestion === p.questions.length-1) finishPart(); else { activeQuestion++; renderQuestion(); } };
$('#finish-part').onclick = finishPart;
$('#copy-ai-report').onclick = copyAiReport;
$('#toggle-ai-report').onclick = () => setAiReportExpanded($('#toggle-ai-report').getAttribute('aria-expanded') !== 'true');
function reset() { if(confirm('確定清除這台裝置上的所有作答紀錄嗎？')) { localStorage.removeItem(STORAGE_KEY); location.reload(); } }
$('#reset-test').onclick = reset; $('#result-reset').onclick = reset;
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js?v=5');
renderHome();
