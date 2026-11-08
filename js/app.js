/* CCAO-F Drill — single-page app, no build step. */
(function () {
  'use strict';

  const DOM = window.DOMAINS, NOTES = window.NOTES, QB = window.QB, EXAM = window.EXAM;
  const DMAP = Object.fromEntries(DOM.map(d => [d.k, d]));
  const QMAP = Object.fromEntries(QB.map(q => [q.id, q]));
  const app = document.getElementById('app');
  const LETTERS = 'ABCDEFG';

  /* ───────── storage ───────── */
  const KEY = 'ccaof.v1';
  const blank = () => ({ history: [], wrong: {}, seen: {}, studied: {}, known: {} });
  let S = blank();
  try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  /* ───────── helpers ───────── */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmtTime = s => { s = Math.max(0, Math.round(s)); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, '0')}`; };
  const pct = (c, t) => t ? Math.round(c / t * 100) : 0;
  const scaled = p => Math.round(100 + 900 * p); // ước tính tuyến tính, không phải công thức chính thức
  const sameSet = (a, b) => a.length === b.length && a.every(x => b.includes(x));
  function toast(msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 1800);
  }

  /* ───────── theme ───────── */
  document.getElementById('themeBtn').addEventListener('click', () => {
    const root = document.documentElement;
    const cur = root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ccaof.theme', next); } catch (e) {}
  });

  /* ───────── session ───────── */
  let SES = null, timerId = null;

  function pickWeighted(n) {
    // phân bổ số câu theo trọng số domain (largest remainder)
    const raw = DOM.map(d => ({ k: d.k, x: d.w * n / 100 }));
    raw.forEach(r => r.c = Math.floor(r.x));
    let left = n - raw.reduce((s, r) => s + r.c, 0);
    raw.slice().sort((a, b) => (b.x - b.c) - (a.x - a.c)).forEach(r => { if (left > 0) { r.c++; left--; } });
    let out = [];
    raw.forEach(r => {
      const pool = QB.filter(q => q.d === r.k);
      // ưu tiên câu ít gặp
      const sorted = shuffle(pool).sort((a, b) => ((S.seen[a.id] || {}).t || 0) - ((S.seen[b.id] || {}).t || 0));
      out = out.concat(sorted.slice(0, r.c));
    });
    return shuffle(out);
  }

  function startSession(mode, opts = {}) {
    let qs, title, instant = true, limit = 0;
    if (mode === 'full') { qs = pickWeighted(EXAM.items); title = `Thi thử đầy đủ · ${EXAM.items} câu`; instant = false; limit = EXAM.minutes * 60; }
    else if (mode === 'quick') { qs = pickWeighted(20); title = 'Thi thử nhanh · 20 câu'; instant = false; limit = 40 * 60; }
    else if (mode === 'domain') { qs = shuffle(QB.filter(q => q.d === opts.d)); title = `Luyện domain ${DMAP[opts.d].n}: ${DMAP[opts.d].name}`; }
    else if (mode === 'hard') { qs = shuffle(QB.filter(q => q.h)); title = 'Câu khó tổng hợp'; }
    else if (mode === 'wrong') { qs = shuffle(Object.keys(S.wrong).filter(id => !S.wrong[id].fixed && QMAP[id]).map(id => QMAP[id])); title = 'Ôn câu sai'; }
    else if (mode === 'multi') { qs = shuffle(QB.filter(q => q.a.length > 1)); title = 'Câu chọn nhiều đáp án'; }
    else { qs = shuffle(QB).slice(0, 10); title = 'Luyện nhanh 10 câu'; mode = 'random'; }
    if (!qs.length) { toast('Không có câu nào cho chế độ này.'); return; }
    SES = {
      mode, title, instant, limit, start: Date.now(), cur: 0,
      qs: qs.map(q => ({ id: q.id, order: shuffle(q.o.map((_, i) => i)) })),
      ans: {}, conf: {}, flags: {}, checked: {}
    };
    location.hash = '#/quiz';
    render();
  }

  function sessionResult() {
    const items = SES.qs.map((it, i) => {
      const q = QMAP[it.id], sel = SES.ans[i] || [];
      const ok = sel.length > 0 && sameSet(sel, q.a);
      return { i, q, it, sel, ok, skip: !sel.length, conf: SES.conf[i] };
    });
    const by = {};
    DOM.forEach(d => by[d.k] = [0, 0]);
    items.forEach(r => { by[r.q.d][1]++; if (r.ok) by[r.q.d][0]++; });
    const correct = items.filter(r => r.ok).length;
    return { items, by, correct, total: items.length, p: correct / items.length };
  }

  function recordAnswer(q, ok) {
    const s = S.seen[q.id] || { c: 0, t: 0 }; s.t++; if (ok) s.c++; S.seen[q.id] = s;
    if (!ok) S.wrong[q.id] = { n: ((S.wrong[q.id] || {}).n || 0) + 1, last: Date.now(), fixed: false };
    else if (S.wrong[q.id] && !S.wrong[q.id].fixed && SES.mode === 'wrong') S.wrong[q.id].fixed = true;
  }

  function finish() {
    clearInterval(timerId);
    const R = sessionResult();
    // ở chế độ instant, các câu đã kiểm tra đã được ghi; ghi các câu còn lại
    R.items.forEach(r => { if (!SES.checked[r.i]) recordAnswer(r.q, r.ok); });
    S.history.unshift({ date: Date.now(), mode: SES.mode, title: SES.title, total: R.total, correct: R.correct, by: R.by, secs: Math.round((Date.now() - SES.start) / 1000) });
    S.history = S.history.slice(0, 50);
    save();
    SES.done = R;
    location.hash = '#/result';
    render();
  }

  /* ───────── views ───────── */
  function domainStats() {
    return DOM.map(d => {
      let c = 0, t = 0;
      QB.filter(q => q.d === d.k).forEach(q => { const s = S.seen[q.id]; if (s) { c += s.c; t += s.t; } });
      return { d, c, t, p: pct(c, t) };
    });
  }

  function vHome() {
    const wrongN = Object.values(S.wrong).filter(w => !w.fixed).length;
    const last = S.history[0];
    const stats = domainStats();
    return `
    <section class="hero">
      <div>
        <div class="eyebrow">Claude Certified Associate – Foundations</div>
        <h1>Luyện thi CCAO-F</h1>
        <p class="lede">Đề thi dành cho người dùng Claude trong công việc (không cần code). Trọng tâm là <b>phán đoán</b>: output có đúng, đủ và an toàn để gửi không; chọn tính năng & model nào; dữ liệu nào được đưa vào.</p>
        <div class="row" style="margin-top:14px">
          <button class="btn primary" data-start="full">Thi thử đầy đủ (60 câu · 120′)</button>
          <a class="btn" href="#/study">Đọc kiến thức</a>
        </div>
      </div>
      <div class="card">
        <h3>Thông tin đề</h3>
        <dl class="facts">${EXAM.facts.slice(0, 7).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
      </div>
    </section>

    <section class="section">
      <h2>Chế độ luyện</h2>
      <div class="grid g3">
        <button class="mode feature" data-start="full"><b>Thi thử đầy đủ</b><span>60 câu theo trọng số domain, 120 phút, chấm khi nộp bài — giống đề thật.</span></button>
        <button class="mode" data-start="quick"><b>Thi thử nhanh</b><span>20 câu theo trọng số, 40 phút, chấm khi nộp.</span></button>
        <button class="mode" data-start="random"><b>Luyện nhanh 10 câu</b><span>Ngẫu nhiên, xem giải thích ngay sau mỗi câu.</span></button>
        <button class="mode" data-start="hard"><b>Câu khó</b><span>${QB.filter(q => q.h).length} câu tình huống nhiều lớp.</span></button>
        <button class="mode" data-start="multi"><b>Chọn nhiều đáp án</b><span>${QB.filter(q => q.a.length > 1).length} câu "Choose TWO".</span></button>
        <button class="mode" data-start="wrong" ${wrongN ? '' : 'disabled style="opacity:.5;cursor:not-allowed"'}><b>Ôn câu sai</b><span>${wrongN ? wrongN + ' câu đang chờ làm đúng lại.' : 'Chưa có câu sai.'}</span></button>
      </div>
    </section>

    <section class="section">
      <div class="row"><h2 style="margin:0">Luyện theo domain</h2><span class="spacer"></span><span class="muted small">Tổng ${QB.length} câu</span></div>
      <div class="card" style="margin-top:12px">
        ${stats.map(s => `
          <div class="dbar">
            <div class="name"><span class="dot" style="background:${s.d.color}"></span>D${s.d.n} · ${s.d.name} <span class="muted small">(${s.d.w}%)</span></div>
            <div class="row"><span class="val">${s.t ? s.p + '% · ' + s.c + '/' + s.t : 'chưa làm'}</span><button class="btn sm" data-start="domain" data-d="${s.d.k}">Luyện ${QB.filter(q => q.d === s.d.k).length} câu</button></div>
            <div class="track"><i style="width:${s.p}%;background:${s.d.color}"></i></div>
          </div>`).join('')}
      </div>
    </section>

    ${S.history.length ? `
    <section class="section">
      <div class="row"><h2 style="margin:0">Lịch sử</h2><span class="spacer"></span><button class="btn sm ghost" id="clearHist">Xóa lịch sử</button></div>
      <div class="card" style="margin-top:12px">
        <table class="kv">${S.history.slice(0, 10).map(h => {
          const p = h.correct / h.total;
          return `<tr><td>${new Date(h.date).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</td><td>${esc(h.title)}</td><td class="mono ${p >= .8 ? 'pass' : p >= .69 ? 'near' : 'fail'}">${h.correct}/${h.total} · ${pct(h.correct, h.total)}%</td></tr>`;
        }).join('')}</table>
      </div>
    </section>` : ''}
    ${last ? '' : `<p class="muted small">Mẹo: phím tắt khi làm bài — <kbd>1</kbd>–<kbd>5</kbd> chọn, <kbd>Enter</kbd> kiểm tra/tiếp, <kbd>←</kbd><kbd>→</kbd> chuyển câu, <kbd>F</kbd> đánh dấu.</p>`}
    `;
  }

  function vQuiz() {
    if (!SES) return `<div class="empty">Không có lượt làm nào đang diễn ra. <a href="#/">Về trang chủ</a></div>`;
    const it = SES.qs[SES.cur], q = QMAP[it.id], sel = SES.ans[SES.cur] || [];
    const need = q.a.length, checked = !!SES.checked[SES.cur];
    const answered = Object.keys(SES.ans).filter(k => (SES.ans[k] || []).length).length;
    const d = DMAP[q.d];
    const optHtml = it.order.map((oi, pos) => {
      let cls = 'opt';
      if (sel.includes(oi)) cls += ' sel';
      if (checked) { cls += ' locked'; if (q.a.includes(oi)) cls += ' right'; else if (sel.includes(oi)) cls += ' wrong'; }
      return `<button class="${cls}" data-opt="${oi}" ${checked ? 'disabled' : ''}><span class="key">${LETTERS[pos]}</span><span>${esc(q.o[oi])}</span></button>`;
    }).join('');
    let explain = '';
    if (checked) {
      const ok = sameSet(sel, q.a);
      const rightLetters = it.order.map((oi, pos) => q.a.includes(oi) ? LETTERS[pos] : null).filter(Boolean).join(', ');
      explain = `<div class="explain ${ok ? 'ok' : 'bad'}"><div class="verdict">${ok ? '✓ Chính xác' : '✗ Chưa đúng'} — đáp án: ${rightLetters}${!ok && SES.conf[SES.cur] === 'sure' ? ' · <span style="color:var(--bad)">sai dù chắc chắn: đáng xem lại kỹ</span>' : ''}${ok && SES.conf[SES.cur] === 'guess' ? ' · <span style="color:var(--warn)">đúng nhưng đang đoán</span>' : ''}</div>${q.e}</div>`;
    }
    const isLast = SES.cur === SES.qs.length - 1;
    let primary;
    if (SES.instant && !checked) primary = `<button class="btn primary" id="checkBtn" ${sel.length === need ? '' : 'disabled'}>Kiểm tra</button>`;
    else if (isLast) primary = `<button class="btn primary" id="finishBtn">${SES.instant ? 'Xem tổng kết →' : 'Nộp bài'}</button>`;
    else primary = `<button class="btn primary" id="nextBtn">Câu tiếp →</button>`;

    return `
    <div class="qhead">
      <button class="btn sm ghost" id="quitBtn">← Thoát</button>
      <b>${esc(SES.title)}</b>
      <span class="spacer"></span>
      ${SES.limit ? `<span class="timer" id="timer">--:--</span>` : ''}
      ${!SES.instant ? `<button class="btn sm" id="submitBtn">Nộp bài</button>` : ''}
    </div>
    <div class="progress"><i style="width:${(SES.instant ? Object.keys(SES.checked).length : answered) / SES.qs.length * 100}%"></i></div>
    <div class="card">
      <div class="row">
        <span class="chip">Câu ${SES.cur + 1}/${SES.qs.length}</span>
        <span class="chip" style="border-color:${d.color};color:${d.color}">D${d.n} · ${d.name}</span>
        ${q.h ? '<span class="chip hard">Khó</span>' : ''}
        ${need > 1 ? `<span class="chip multi">Chọn ${need}</span>` : ''}
        <span class="spacer"></span>
        <button class="btn sm ghost" id="flagBtn">${SES.flags[SES.cur] ? '★ Đã đánh dấu' : '☆ Đánh dấu'}</button>
      </div>
      <div class="qtext">${esc(q.q)}</div>
      <div class="opts">${optHtml}</div>
      ${!checked ? `<div class="conf">Mức tự tin: <button data-conf="sure" class="${SES.conf[SES.cur] === 'sure' ? 'on' : ''}">Chắc chắn</button><button data-conf="guess" class="${SES.conf[SES.cur] === 'guess' ? 'on' : ''}">Đang đoán</button></div>` : ''}
      ${explain}
      <div class="qnav">
        <button class="btn" id="prevBtn" ${SES.cur ? '' : 'disabled'}>← Trước</button>
        <span class="spacer"></span>
        ${primary}
      </div>
    </div>
    ${!SES.instant ? `
    <details class="card" style="margin-top:14px" ${SES.qs.length <= 20 ? 'open' : ''}>
      <summary style="cursor:pointer;font-weight:600">Bảng câu hỏi · đã trả lời ${answered}/${SES.qs.length} · đánh dấu ${Object.values(SES.flags).filter(Boolean).length}</summary>
      <div class="palette">${SES.qs.map((_, i) => `<button data-go="${i}" class="${(SES.ans[i] || []).length ? 'ans' : ''} ${i === SES.cur ? 'cur' : ''} ${SES.flags[i] ? 'flag' : ''}">${i + 1}</button>`).join('')}</div>
    </details>` : ''}`;
  }

  function verdict(p) {
    if (p >= .8) return ['pass', 'Vững, trên mức an toàn'];
    if (p >= .69) return ['near', 'Sát ngưỡng, cần thêm biên an toàn'];
    return ['fail', 'Chưa đạt, ôn lại các phần yếu'];
  }

  let resFilter = 'all';
  function vResult() {
    if (!SES || !SES.done) return `<div class="empty">Chưa có kết quả. <a href="#/">Về trang chủ</a></div>`;
    const R = SES.done, [cls, label] = verdict(R.p), sc = scaled(R.p);
    const sureWrong = R.items.filter(r => !r.ok && r.conf === 'sure').length;
    const guessRight = R.items.filter(r => r.ok && r.conf === 'guess').length;
    const filt = { all: r => true, wrong: r => !r.ok, flag: r => SES.flags[r.i], sure: r => !r.ok && r.conf === 'sure' }[resFilter];
    return `
    <div class="eyebrow">Tổng kết</div>
    <h1>${esc(SES.title)}</h1>
    <div class="card">
      <div class="score">
        <div><div class="big ${cls}">${pct(R.correct, R.total)}%</div><div class="muted small">${R.correct}/${R.total} câu đúng · ${fmtTime((Date.now() - SES.start) / 1000)}</div></div>
        <div style="flex:1;min-width:220px">
          <b class="${cls}">${label}</b>
          <div class="meter"><i style="width:${(sc - 100) / 9}%;background:var(--${cls === 'pass' ? 'ok' : cls === 'near' ? 'warn' : 'bad'})"></i><b style="left:${(720 - 100) / 9}%"></b></div>
          <div class="small muted">Ước tính thang 1000: <b class="mono">${sc}</b> (vạch = 720). Quy đổi tuyến tính chỉ để tham khảo, không phải công thức chính thức.</div>
        </div>
      </div>
      ${sureWrong || guessRight ? `<p class="small" style="margin-top:12px">${sureWrong ? `<span class="fail">${sureWrong} câu sai dù chắc chắn</span> — đây là lỗ hổng hiểu sai, ưu tiên ôn. ` : ''}${guessRight ? `<span class="near">${guessRight} câu đúng nhờ đoán</span> — chưa thật vững.` : ''}</p>` : ''}
    </div>

    <h2 class="section" style="margin-bottom:8px">Theo domain</h2>
    <div class="card">
      ${DOM.filter(d => R.by[d.k][1]).map(d => { const [c, t] = R.by[d.k], p = pct(c, t); return `
        <div class="dbar"><div class="name"><span class="dot" style="background:${d.color}"></span>D${d.n} · ${d.name}</div>
        <div class="row"><span class="val">${c}/${t} · ${p}%</span><a class="btn sm ghost" href="#/study/${d.k}">Ôn</a></div>
        <div class="track"><i style="width:${p}%;background:${d.color}"></i></div></div>`; }).join('')}
    </div>

    <div class="row section" style="margin-bottom:0">
      <button class="btn primary" data-start="${SES.mode}" ${SES.mode === 'domain' ? `data-d="${QMAP[SES.qs[0].id].d}"` : ''}>Làm đề mới</button>
      ${R.items.some(r => !r.ok) ? `<button class="btn" data-start="wrong">Ôn câu sai</button>` : ''}
      <a class="btn ghost" href="#/">Trang chủ</a>
    </div>

    <h2 class="section" style="margin-bottom:0">Xem lại từng câu</h2>
    <div class="tabs">
      ${[['all', 'Tất cả'], ['wrong', 'Sai / bỏ trống'], ['flag', 'Đã đánh dấu'], ['sure', 'Sai dù chắc chắn']].map(([k, l]) => `<button data-rf="${k}" class="${resFilter === k ? 'on' : ''}">${l}</button>`).join('')}
    </div>
    <div class="rlist">${R.items.filter(filt).map(r => reviewItem(r)).join('') || '<div class="empty">Không có câu nào.</div>'}</div>`;
  }

  function reviewItem(r) {
    const q = r.q, order = r.it ? r.it.order : q.o.map((_, i) => i);
    return `<details class="ritem"><summary>
      <span class="badge ${r.skip ? 'skip' : r.ok ? 'ok' : 'bad'}">${r.skip ? 'Bỏ trống' : r.ok ? 'Đúng' : 'Sai'}</span>
      <span><span class="muted small">${q.id} · D${DMAP[q.d].n}${r.conf ? ' · ' + (r.conf === 'sure' ? 'chắc chắn' : 'đang đoán') : ''}</span><br>${esc(q.q.length > 180 ? q.q.slice(0, 180) + '…' : q.q)}</span>
    </summary><div class="body">
      <div class="qtext" style="font-size:15px">${esc(q.q)}</div>
      <ul class="olist">${order.map((oi, pos) => `<li class="${q.a.includes(oi) ? 'right' : r.sel.includes(oi) ? 'wrong' : ''}"><b>${LETTERS[pos]}.</b> ${esc(q.o[oi])}${q.a.includes(oi) ? '<small>đáp án</small>' : ''}${r.sel.includes(oi) ? '<small>bạn chọn</small>' : ''}</li>`).join('')}</ul>
      <div class="explain">${q.e}</div>
    </div></details>`;
  }

  function vStudy(k) {
    if (k && NOTES[k]) {
      const d = DMAP[k], n = NOTES[k];
      const idx = DOM.findIndex(x => x.k === k), prev = DOM[idx - 1], next = DOM[idx + 1];
      return `<article class="notes">
        <a href="#/study" class="small">← Tất cả domain</a>
        <div class="eyebrow" style="margin-top:12px;color:${d.color}">Domain ${d.n} · ${d.w}% · ≈ ${Math.round(d.w * 0.6)} câu</div>
        <h1>${d.name}</h1>
        <p class="muted">${d.vi}</p>
        <p class="lede">${n.intro}</p>
        <div class="objectives"><h3>Mục tiêu cần nắm</h3><ul>${n.objectives.map(o => `<li>${o}</li>`).join('')}</ul></div>
        <nav class="toc">${n.sections.map((s, i) => `<a href="#/study/${k}" data-scroll="s${i}">${s.h}</a>`).join('')}<a href="#/study/${k}" data-scroll="traps">Bẫy hay gặp</a></nav>
        ${n.sections.map((s, i) => `<h2 id="s${i}">${s.h}</h2><ul>${s.b.map(x => `<li>${x}</li>`).join('')}</ul>`).join('')}
        <div class="traps" id="traps"><h3>Bẫy hay gặp trong đề</h3><ul>${n.traps.map(x => `<li>${x}</li>`).join('')}</ul></div>
        <div class="row" style="margin-top:20px">
          <button class="btn primary" data-start="domain" data-d="${k}">Luyện ${QB.filter(q => q.d === k).length} câu domain này</button>
          <a class="btn" href="#/cards/${k}">Thẻ ghi nhớ (${n.cards.length})</a>
          <button class="btn ghost" id="markStudied" data-k="${k}">${S.studied[k] ? '✓ Đã học' : 'Đánh dấu đã học'}</button>
        </div>
        <div class="row" style="margin-top:24px">
          ${prev ? `<a class="btn ghost" href="#/study/${prev.k}">← D${prev.n}</a>` : ''}<span class="spacer"></span>
          ${next ? `<a class="btn ghost" href="#/study/${next.k}">D${next.n} →</a>` : ''}
        </div>
      </article>`;
    }
    return `
      <div class="eyebrow">Kiến thức theo domain</div>
      <h1>7 domain của CCAO-F</h1>
      <p class="lede">Mỗi domain có mục tiêu, ghi chú cốt lõi, bẫy hay gặp và thẻ ghi nhớ. Học theo thứ tự trọng số giảm dần nếu ít thời gian: D2 → D4 → D6 → D1 → D3/D5 → D7.</p>
      <div class="grid g2" style="margin-top:16px">
        ${DOM.map(d => `<a class="card dcard" style="--c:${d.color}" href="#/study/${d.k}">
          <span class="w">Domain ${d.n} · ${d.w}%${S.studied[d.k] ? ' · ✓ đã học' : ''}</span>
          <h3 style="margin:0">${d.name}</h3>
          <span class="muted small">${d.vi}</span>
        </a>`).join('')}
      </div>`;
  }

  let cardState = { k: 'ALL', i: 0, list: [] };
  function buildCards(k) {
    const keys = k === 'ALL' ? DOM.map(d => d.k) : [k];
    let list = [];
    keys.forEach(kk => NOTES[kk].cards.forEach((c, j) => list.push({ id: kk + ':' + j, k: kk, f: c[0], b: c[1] })));
    cardState = { k, i: 0, list: shuffle(list), onlyUnknown: cardState.onlyUnknown };
    if (cardState.onlyUnknown) cardState.list = cardState.list.filter(c => !S.known[c.id]);
  }
  function vCards(k) {
    k = k || 'ALL';
    if (cardState.k !== k || !cardState.list.length) buildCards(k);
    const L = cardState.list, c = L[cardState.i];
    const knownN = Object.keys(S.known).filter(id => S.known[id]).length;
    const total = DOM.reduce((s, d) => s + NOTES[d.k].cards.length, 0);
    return `
      <div class="eyebrow">Thẻ ghi nhớ</div>
      <h1>Nhớ lại rồi lật thẻ</h1>
      <p class="muted">Đã thuộc ${knownN}/${total} thẻ. Bấm thẻ (hoặc <kbd>Space</kbd>) để lật.</p>
      <div class="tabs">
        <button data-ck="ALL" class="${k === 'ALL' ? 'on' : ''}">Tất cả</button>
        ${DOM.map(d => `<button data-ck="${d.k}" class="${k === d.k ? 'on' : ''}">D${d.n}</button>`).join('')}
        <button id="onlyUnknown" class="${cardState.onlyUnknown ? 'on' : ''}">Chỉ thẻ chưa thuộc</button>
      </div>
      ${c ? `
      <div class="flash" id="flash"><div class="inner">
        <div class="face"><small>D${DMAP[c.k].n} · Câu hỏi · ${cardState.i + 1}/${L.length}</small>${esc(c.f)}</div>
        <div class="face back"><small>Đáp án</small>${esc(c.b)}</div>
      </div></div>
      <div class="row" style="margin-top:14px">
        <button class="btn" id="cPrev" ${cardState.i ? '' : 'disabled'}>← Trước</button>
        <span class="spacer"></span>
        <button class="btn" id="cAgain">Chưa thuộc</button>
        <button class="btn primary" id="cKnow">${S.known[c.id] ? '✓ Đã thuộc' : 'Đã thuộc'} →</button>
      </div>` : `<div class="empty">Hết thẻ trong nhóm này. <button class="btn sm" id="cReset">Xáo lại</button></div>`}`;
  }

  function vLog() {
    const ids = Object.keys(S.wrong).filter(id => QMAP[id]).sort((a, b) => S.wrong[b].last - S.wrong[a].last);
    const open = ids.filter(id => !S.wrong[id].fixed), fixed = ids.filter(id => S.wrong[id].fixed);
    const item = (id) => { const q = QMAP[id], w = S.wrong[id];
      return reviewItem({ q, sel: [], ok: w.fixed, skip: false, conf: null })
        .replace('<span class="badge ok">Đúng</span>', `<span class="badge ok">Đã làm đúng lại</span>`)
        .replace('<span class="badge bad">Sai</span>', `<span class="badge bad">Sai ${w.n}×</span>`); };
    return `
      <div class="eyebrow">Sổ câu sai</div>
      <h1>Những câu bạn từng làm sai</h1>
      <p class="muted">Câu sai được tự động ghi lại. Làm đúng lại trong chế độ "Ôn câu sai" để chuyển sang mục đã khắc phục.</p>
      <div class="row" style="margin:12px 0 18px">
        <button class="btn primary" data-start="wrong" ${open.length ? '' : 'disabled'}>Ôn ${open.length} câu sai</button>
        <span class="spacer"></span>
        ${ids.length ? '<button class="btn sm ghost" id="clearLog">Xóa sổ</button>' : ''}
      </div>
      ${ids.length ? '' : '<div class="empty">Chưa có câu sai nào. Làm một bài thi thử để bắt đầu.</div>'}
      ${open.length ? `<h2>Cần ôn (${open.length})</h2><div class="rlist">${open.map(item).join('')}</div>` : ''}
      ${fixed.length ? `<h2 class="section" style="margin-bottom:8px">Đã khắc phục (${fixed.length})</h2><div class="rlist">${fixed.map(item).join('')}</div>` : ''}`;
  }

  function vGuide() {
    const G = window.GUIDE;
    return `<article class="notes">
      <div class="eyebrow">Chiến thuật làm bài</div>
      <h1>Cách chọn đáp án và loại trừ phương án sai</h1>
      <p class="lede">CCAO-F là đề tình huống nghiệp vụ: một bối cảnh có ràng buộc, nhiều phương án nghe đều hợp lý. Phần này tổng hợp cách đọc đề, loại trừ và các mẫu đáp án hay gặp. Dựa trên mô tả đề công khai và tài liệu Anthropic, không dựa trên đề thật.</p>
      <nav class="toc">${G.map(g => `<a href="#/guide" data-scroll="${g.id}">${g.h}</a>`).join('')}</nav>
      ${G.map(g => `<h2 id="${g.id}">${g.h}</h2><ul>${g.b.map(x => `<li>${x}</li>`).join('')}</ul>`).join('')}
      <h2>Nguồn tham khảo</h2>
      <ul>
        <li><a href="https://support.claude.com" target="_blank" rel="noopener">Claude Help Center</a> — Projects, memory, skills, Cowork, Research</li>
        <li><a href="https://platform.claude.com/docs/en/about-claude/models/overview" target="_blank" rel="noopener">Models overview</a> — tầng model hiện hành</li>
        <li><a href="https://anthropic.skilljar.com" target="_blank" rel="noopener">Anthropic Academy</a> — khóa học miễn phí</li>
        <li>Exam guide CCAO-F chính thức (qua Anthropic Partner Academy) — nguồn chuẩn về phạm vi đề</li>
      </ul>
    </article>`;
  }

  function vReview() {
    return `
      <div class="row"><div><div class="eyebrow">Ôn nhanh trước giờ thi</div><h1 style="margin:0">Cheat sheet CCAO-F</h1></div><span class="spacer"></span><button class="btn sm" onclick="window.print()">In</button></div>
      <div class="grid g2" style="margin-top:16px">
        ${window.REVIEW.map(s => `<div class="card"><h3>${s.h}</h3><table class="kv">${s.rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</table></div>`).join('')}
        <div class="card"><h3>Trọng số domain</h3><table class="kv">${DOM.map(d => `<tr><td><span class="dot" style="background:${d.color}"></span>D${d.n} ${d.w}%</td><td>${d.name}</td></tr>`).join('')}</table></div>
      </div>`;
  }

  /* ───────── router ───────── */
  function route() {
    const h = (location.hash || '#/').slice(2).split('/');
    return { p: h[0] || 'home', a: h[1] };
  }
  function render() {
    const { p, a } = route();
    clearInterval(timerId);
    const views = { home: vHome, quiz: vQuiz, result: vResult, study: () => vStudy(a), cards: () => vCards(a), log: vLog, guide: vGuide, review: vReview };
    app.innerHTML = (views[p] || vHome)();
    const navKey = { quiz: 'home', result: 'home' }[p] || p;
    document.querySelectorAll('.nav a').forEach(el => el.classList.toggle('on', el.dataset.nav === navKey));
    if (p === 'quiz' && SES && SES.limit && !SES.done) tick(), timerId = setInterval(tick, 1000);
  }
  function tick() {
    const el = document.getElementById('timer'); if (!el) return;
    const left = SES.limit - (Date.now() - SES.start) / 1000;
    el.textContent = fmtTime(left);
    el.classList.toggle('low', left < 300);
    if (left <= 0) { toast('Hết giờ — bài đã được nộp.'); finish(); }
  }

  let lastHash = location.hash;
  window.addEventListener('hashchange', () => {
    const leavingQuiz = lastHash === '#/quiz' && location.hash !== '#/quiz' && location.hash !== '#/result' && SES && !SES.done;
    if (leavingQuiz && !confirm('Thoát lượt làm này? Kết quả sẽ không được lưu.')) { history.replaceState(null, '', '#/quiz'); return; }
    if (leavingQuiz) SES = null;
    lastHash = location.hash;
    window.scrollTo(0, 0);
    render();
  });

  /* ───────── interactions ───────── */
  function selectOpt(oi) {
    if (!SES || SES.checked[SES.cur]) return;
    const q = QMAP[SES.qs[SES.cur].id], need = q.a.length;
    let sel = (SES.ans[SES.cur] || []).slice();
    if (need === 1) sel = [oi];
    else if (sel.includes(oi)) sel = sel.filter(x => x !== oi);
    else { if (sel.length >= need) { toast(`Câu này chọn đúng ${need} đáp án.`); return; } sel.push(oi); }
    SES.ans[SES.cur] = sel;
    render();
  }
  function check() {
    const q = QMAP[SES.qs[SES.cur].id], sel = SES.ans[SES.cur] || [];
    if (sel.length !== q.a.length) { toast(`Hãy chọn đủ ${q.a.length} đáp án.`); return; }
    SES.checked[SES.cur] = true;
    recordAnswer(q, sameSet(sel, q.a)); save();
    render();
  }
  function go(i) { if (!SES) return; SES.cur = Math.max(0, Math.min(SES.qs.length - 1, i)); render(); window.scrollTo(0, 0); }
  function submit() {
    const un = SES.qs.length - Object.keys(SES.ans).filter(k => (SES.ans[k] || []).length).length;
    if (!SES.instant && !confirm(un ? `Còn ${un} câu bỏ trống (tính là sai). Nộp bài?` : 'Nộp bài và xem kết quả?')) return;
    finish();
  }

  app.addEventListener('click', e => {
    const t = e.target.closest('button, a'); if (!t) return;
    if (t.dataset.start) { if (t.disabled) return; startSession(t.dataset.start, { d: t.dataset.d }); return; }
    if (t.dataset.opt !== undefined) return selectOpt(+t.dataset.opt);
    if (t.dataset.conf) { SES.conf[SES.cur] = SES.conf[SES.cur] === t.dataset.conf ? null : t.dataset.conf; return render(); }
    if (t.dataset.go !== undefined) return go(+t.dataset.go);
    if (t.dataset.rf) { resFilter = t.dataset.rf; return render(); }
    if (t.dataset.scroll) { e.preventDefault(); const el = document.getElementById(t.dataset.scroll); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (t.dataset.ck) { location.hash = t.dataset.ck === 'ALL' ? '#/cards' : '#/cards/' + t.dataset.ck; return; }
    switch (t.id) {
      case 'checkBtn': return check();
      case 'nextBtn': return go(SES.cur + 1);
      case 'prevBtn': return go(SES.cur - 1);
      case 'finishBtn': return SES.instant ? finish() : submit();
      case 'submitBtn': return submit();
      case 'flagBtn': SES.flags[SES.cur] = !SES.flags[SES.cur]; return render();
      case 'quitBtn': location.hash = '#/'; return;
      case 'clearHist': if (confirm('Xóa toàn bộ lịch sử làm bài?')) { S.history = []; S.seen = {}; save(); render(); } return;
      case 'clearLog': if (confirm('Xóa toàn bộ sổ câu sai?')) { S.wrong = {}; save(); render(); } return;
      case 'markStudied': S.studied[t.dataset.k] = !S.studied[t.dataset.k]; save(); return render();
      case 'onlyUnknown': cardState.onlyUnknown = !cardState.onlyUnknown; buildCards(cardState.k); return render();
      case 'cPrev': cardState.i--; return render();
      case 'cAgain': S.known[cardState.list[cardState.i].id] = false; save(); return nextCard();
      case 'cKnow': S.known[cardState.list[cardState.i].id] = true; save(); return nextCard();
      case 'cReset': buildCards(cardState.k); return render();
    }
  });
  app.addEventListener('click', e => { const f = e.target.closest('#flash'); if (f) f.classList.toggle('flip'); });
  function nextCard() { if (cardState.i < cardState.list.length - 1) cardState.i++; else { toast('Hoàn thành bộ thẻ.'); buildCards(cardState.k); } render(); }

  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea/i.test(e.target.tagName)) return;
    const { p } = route();
    if (p === 'quiz' && SES && !SES.done) {
      const it = SES.qs[SES.cur];
      const n = '12345'.indexOf(e.key) >= 0 ? '12345'.indexOf(e.key) : 'abcde'.indexOf(e.key.toLowerCase());
      if (n >= 0 && n < it.order.length && e.key.length === 1) { e.preventDefault(); return selectOpt(it.order[n]); }
      if (e.key === 'ArrowRight') return go(SES.cur + 1);
      if (e.key === 'ArrowLeft') return go(SES.cur - 1);
      if (e.key.toLowerCase() === 'f') { SES.flags[SES.cur] = !SES.flags[SES.cur]; return render(); }
      if (e.key === 'Enter') {
        e.preventDefault();
        const b = document.getElementById('checkBtn') || document.getElementById('nextBtn') || document.getElementById('finishBtn');
        if (b && !b.disabled) b.click();
      }
    }
    if (p === 'cards' && e.key === ' ') { e.preventDefault(); const f = document.getElementById('flash'); if (f) f.classList.toggle('flip'); }
  });

  render();
})();
