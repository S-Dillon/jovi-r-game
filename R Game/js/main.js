(function () {
  const $ = id => document.getElementById(id);
  const S = RQuest.Storage;
  const UI = RQuest.UI;
  const esc = UI.esc;
  const P = RQuest.personalize;          // swaps {name} for the player's name
  const name = () => esc(RQuest.playerName());

  const RANKS = [
    [0, 'Fresh Coder'], [300, 'Script Scout'], [800, 'Vector Voyager'], [1500, 'Data Wrangler'],
    [3000, 'Function Forger'], [5000, 'R Ranger'], [8000, 'R Wizard'],
  ];
  const rankFor = xp => RANKS.filter(r => xp >= r[0]).pop()[1];
  const nextRank = xp => RANKS.find(r => r[0] > xp);

  const playable = lvl => Array.isArray(lvl.lessons) && lvl.lessons.length > 0;
  const levelDone = lvl => playable(lvl) && lvl.lessons.every(l => S.isComplete(l.id));
  function levelUnlocked(i) {
    const lvl = RQuest.levels[i];
    if (!playable(lvl)) return false;
    if (i === 0) return true;
    return levelDone(RQuest.levels[i - 1]);
  }
  const lessonUnlocked = (lvl, i) => i === 0 || S.isComplete(lvl.lessons[i - 1].id);
  const maxXP = lvl => (lvl.lessons || []).reduce((s, l) => s + (l.challenge.xp || 100), 0);

  /* ---------------- State ---------------- */
  const state = {
    level: null, lessonIndex: 0, tutPage: 0,
    hintsUsed: 0, attempts: 0, solutionShown: false,
  };

  /* ---------------- Screens ---------------- */
  function show(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    $('screen-' + name).classList.add('active');
    if (name === 'menu') renderMenu();
    if (name === 'map') renderMap();
    if (name === 'level') renderLevel();
    if (name === 'sandbox') { sbEditor.refresh(); }
    if (name === 'lesson') { editor.refresh(); }
  }
  document.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => show(b.dataset.goto)));

  /* ---------------- Player HUD (top right) ---------------- */
  const rankFloor = xp => RANKS.filter(r => xp >= r[0]).pop()[0];
  function renderHUD(gained) {
    const xp = S.totalXP();
    const nr = nextRank(xp);
    const pct = nr ? Math.round(100 * (xp - rankFloor(xp)) / (nr[0] - rankFloor(xp))) : 100;
    const hud = $('player-hud');
    hud.innerHTML =
      `<div class="avatar">${name().charAt(0).toUpperCase()}</div>` +
      `<div class="who"><b>${name()}</b><span class="rank">${rankFor(xp)}</span>` +
      `<div class="mini-bar"><div style="width:${pct}%"></div></div></div>` +
      `<div class="xp">${xp} XP</div>`;
    hud.title = nr ? `${nr[0] - xp} XP until ${nr[1]}` : 'Maximum rank reached!';
    if (gained) {
      hud.classList.remove('bump'); void hud.offsetWidth; hud.classList.add('bump');
      const r = hud.getBoundingClientRect();
      const f = document.createElement('div');
      f.className = 'xp-float';
      f.textContent = '+' + gained + ' XP';
      f.style.left = (r.right - 70) + 'px';
      f.style.top = (r.bottom + 4) + 'px';
      document.body.appendChild(f);
      setTimeout(() => f.remove(), 1500);
    }
  }

  /* ---------------- R status pill ---------------- */
  RQuest.R.onStatus((st, label) => {
    const el = $('r-status');
    el.className = 'r-status ' + st;
    el.querySelector('.label').textContent = label;
  });
  $('r-status').addEventListener('click', () => {
    if ($('r-status').classList.contains('error')) RQuest.R.init().catch(() => {});
  });

  /* ---------------- Menu ---------------- */
  function renderMenu() {
    const xp = S.totalXP();
    const nr = nextRank(xp);
    const lessonsTotal = RQuest.levels.reduce((s, l) => s + (l.lessons ? l.lessons.length : 0), 0);
    const lessonsDone = Object.keys(S.data.completed).length;
    const pct = nr ? Math.round(100 * (xp - RANKS.filter(r => xp >= r[0]).pop()[0]) / (nr[0] - RANKS.filter(r => xp >= r[0]).pop()[0])) : 100;
    $('menu-player').innerHTML =
      `<div class="row"><span><b>${name()}</b> · <span style="color:var(--gold)">${rankFor(xp)}</span></span><span class="muted">${xp} XP</span></div>` +
      `<div class="bar"><div style="width:${pct}%"></div></div>` +
      `<div class="row small muted" style="margin-top:6px"><span>${lessonsDone} / ${lessonsTotal} lessons complete</span>` +
      `<span>${nr ? (nr[0] - xp) + ' XP to ' + nr[1] : 'Max rank!'}</span></div>`;
    $('btn-continue').textContent = lessonsDone ? `Continue, ${RQuest.playerName()}` : `Start Adventure, ${RQuest.playerName()}`;
    renderHUD();
  }

  /* ---------------- Story ---------------- */
  const story = { scenes: [], i: 0, then: null, typing: false };

  /** Wrap every word in a span so the text fades in word by word. */
  function wordify(el) {
    let n = 0;
    const walk = node => {
      [...node.childNodes].forEach(ch => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const sp = document.createElement('span');
            sp.className = 'w';
            sp.style.animationDelay = (n++ * 55) + 'ms';
            sp.textContent = part;
            frag.appendChild(sp);
          });
          ch.replaceWith(frag);
        } else walk(ch);
      });
    };
    walk(el);
    return n * 55 + 350;
  }

  function renderScene() {
    const sc = story.scenes[story.i];
    const art = $('story-art');
    art.textContent = sc.art || '';
    art.classList.remove('enter'); void art.offsetWidth; art.classList.add('enter');
    const txt = $('story-text');
    txt.classList.remove('done');
    txt.innerHTML = P(sc.text);
    const ms = wordify(txt);
    story.typing = true;
    clearTimeout(story.timer);
    story.timer = setTimeout(() => { story.typing = false; txt.classList.add('done'); }, ms);
    $('story-dots').innerHTML = story.scenes.map((_, k) => `<span class="${k <= story.i ? 'on' : ''}"></span>`).join('');
    $('story-next').textContent = story.i === story.scenes.length - 1 ? 'Begin the expedition ›' : 'Next ›';
  }

  function playStory(then) {
    story.scenes = (RQuest.story && RQuest.story.intro) || [];
    if (!story.scenes.length) { then && then(); return; }
    story.i = 0; story.then = then;
    show('story');
    renderScene();
  }
  function endStory() {
    clearTimeout(story.timer);
    S.data.storySeen = true; S.save();
    const t = story.then; story.then = null;
    if (t) t(); else show('menu');
  }
  function storyAdvance() {
    if (story.typing) { story.typing = false; $('story-text').classList.add('done'); return; }
    if (story.i < story.scenes.length - 1) { story.i++; renderScene(); } else endStory();
  }
  $('story-next').addEventListener('click', e => { e.stopPropagation(); storyAdvance(); });
  document.querySelector('.story-stage').addEventListener('click', storyAdvance);
  $('story-skip').addEventListener('click', endStory);
  document.addEventListener('keydown', e => {
    if (!$('screen-story').classList.contains('active')) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); storyAdvance(); }
    if (e.key === 'Escape') endStory();
  });
  $('btn-story').addEventListener('click', () => playStory(() => show('menu')));

  $('btn-continue').addEventListener('click', () => {
    if (!S.data.storySeen) { playStory(continueAdventure); return; }
    continueAdventure();
  });

  function continueAdventure() {
    // first unlocked level with an unfinished lesson
    for (let i = 0; i < RQuest.levels.length; i++) {
      const lvl = RQuest.levels[i];
      if (!levelUnlocked(i)) continue;
      const idx = lvl.lessons.findIndex(l => !S.isComplete(l.id));
      if (idx >= 0) { state.level = lvl; openLesson(idx); return; }
    }
    // everything done
    show('map');
  }

  /* ---------------- Level map ---------------- */
  function renderMap() {
    $('map-grid').innerHTML = '';
    RQuest.levels.forEach((lvl, i) => {
      const unlocked = levelUnlocked(i);
      const done = levelDone(lvl);
      const card = document.createElement('div');
      card.className = 'level-card' + (unlocked ? '' : ' locked');
      card.style.setProperty('--accent', lvl.accent);
      const n = playable(lvl) ? lvl.lessons.filter(l => S.isComplete(l.id)).length : 0;
      const total = playable(lvl) ? lvl.lessons.length : 0;
      let badge = '';
      if (!playable(lvl)) badge = '<span class="badge">Coming soon</span>';
      else if (done) badge = '<span class="badge done">✔ Cleared</span>';
      else if (!unlocked) badge = '<span class="badge">🔒 Locked</span>';
      card.innerHTML =
        badge +
        `<div class="lv-num">Level ${lvl.number}</div>` +
        `<div class="lv-icon">${lvl.icon}</div>` +
        `<h3>${esc(lvl.title)}</h3><p>${esc(lvl.blurb)}</p>` +
        (playable(lvl)
          ? `<div class="lv-foot"><div class="lv-bar"><div style="width:${total ? 100 * n / total : 0}%"></div></div><span class="muted">${n}/${total}</span></div>`
          : '');
      if (unlocked) card.addEventListener('click', () => { state.level = lvl; show('level'); });
      $('map-grid').appendChild(card);
    });
  }

  /* ---------------- Level screen ---------------- */
  function renderLevel() {
    const lvl = state.level;
    $('level-title').textContent = `Level ${lvl.number} · ${lvl.title}`;
    const j = RQuest.story && RQuest.story.journal && RQuest.story.journal[lvl.id];
    $('level-intro').innerHTML =
      (j ? `<div class="journal"><span class="speaker">${esc(j.speaker)}</span><p>${P(j.text)}</p></div>` : '') +
      `<h3>${lvl.icon} ${esc(lvl.title)}</h3>${P(lvl.intro) || '<p>' + esc(lvl.blurb) + '</p>'}` +
      `<p class="small" style="color:var(--gold)">Level XP: ${S.levelXP(lvl)} / ${maxXP(lvl)}</p>`;
    const path = $('lesson-path');
    path.innerHTML = '';
    let currentMarked = false;
    lvl.lessons.forEach((les, i) => {
      const done = S.isComplete(les.id);
      const unlocked = lessonUnlocked(lvl, i);
      const current = unlocked && !done && !currentMarked;
      if (current) currentMarked = true;
      const li = document.createElement('li');
      li.className = 'lesson-item' + (done ? ' done' : '') + (current ? ' current' : '') +
        (unlocked ? '' : ' locked') + (les.boss ? ' boss' : '');
      const xpTxt = done ? `★ ${S.data.completed[les.id].xp} XP` : (unlocked ? `${les.challenge.xp || 100} XP` : '🔒');
      li.innerHTML =
        `<div class="lesson-node"><span>${done ? '✔' : (les.boss ? '★' : i + 1)}</span></div>` +
        `<div class="lesson-card"><div><h4>${les.boss ? '👑 ' : ''}${P(esc(les.title))}</h4><p>${P(esc(les.summary || ''))}</p></div>` +
        `<div class="meta">${xpTxt}</div></div>`;
      if (unlocked) li.querySelector('.lesson-card').addEventListener('click', () => openLesson(i));
      path.appendChild(li);
    });
  }

  /* ---------------- Lesson screen ---------------- */
  const consoleUI = UI.Console($('console'), $('plot-area'));
  let draftTimer = null;
  const editor = RQuest.Editor($('editor-host'), {
    onRun: () => runCode(),
    onSubmit: () => submitCode(),
    onChange: code => {
      const les = currentLesson();
      if (!les) return;
      clearTimeout(draftTimer);
      draftTimer = setTimeout(() => S.setDraft(les.id, code), 400);
    },
  });

  const currentLesson = () => state.level && state.level.lessons[state.lessonIndex];

  function openLesson(i) {
    state.lessonIndex = i;
    state.tutPage = 0;
    state.hintsUsed = 0;
    state.attempts = 0;
    state.solutionShown = false;
    const les = currentLesson();
    $('lesson-title').textContent = (les.boss ? '👑 ' : '') + RQuest.personalizeCode(les.title);
    editor.set(S.getDraft(les.id) != null ? S.getDraft(les.id) : (RQuest.personalizeCode(les.challenge.starter) || ''));
    consoleUI.clear();
    consoleUI.sys(RQuest.R.ready
      ? `Hi ${RQuest.playerName()}! R is ready. Write code in the editor above and press ▶ Run (Ctrl+Enter).`
      : `Hi ${RQuest.playerName()}! R is loading in the background – the first time can take 10–30 seconds.`);
    renderChallenge();
    const hasTutorial = les.tutorial && les.tutorial.length;
    if (hasTutorial && !S.data.tutorialSeen[les.id]) { switchTab('tutorial'); renderTutPage(); }
    else { if (hasTutorial) renderTutPage(); switchTab('challenge'); }
    document.querySelector('.tab[data-tab=tutorial]').disabled = !hasTutorial;
    show('lesson');
  }

  $('lesson-back').addEventListener('click', () => show('level'));

  function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    $('tab-tutorial').classList.toggle('hidden', tab !== 'tutorial');
    $('tab-challenge').classList.toggle('hidden', tab !== 'challenge');
  }
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    if (t.dataset.tab === 'challenge') S.markTutorialSeen(currentLesson().id);
    switchTab(t.dataset.tab);
  }));

  /* -- Tutorial -- */
  function renderTutPage() {
    const les = currentLesson();
    const pages = les.tutorial;
    const p = pages[state.tutPage];
    $('tut-progress').innerHTML = pages.map((_, i) => `<span class="${i <= state.tutPage ? 'on' : ''}"></span>`).join('');
    UI.renderTutorial($('tut-page'), p, {
      onCopy: code => { editor.set(code); editor.focus(); },
      onRunExample: res => { consoleUI.show(res); },
    });
    $('tut-page').parentElement.scrollTop = 0;
    $('tut-prev').style.visibility = state.tutPage === 0 ? 'hidden' : 'visible';
    $('tut-next').textContent = state.tutPage === pages.length - 1 ? 'Start the challenge 🎯' : 'Next →';
  }
  $('tut-prev').addEventListener('click', () => { if (state.tutPage > 0) { state.tutPage--; renderTutPage(); } });
  $('tut-next').addEventListener('click', () => {
    const les = currentLesson();
    if (state.tutPage < les.tutorial.length - 1) { state.tutPage++; renderTutPage(); }
    else { S.markTutorialSeen(les.id); switchTab('challenge'); }
  });

  /* -- Challenge -- */
  function renderChallenge(results) {
    const ch = currentLesson().challenge;
    const tasks = (ch.checks || []).filter(c => c.label).map((c, i) => {
      let cls = '';
      if (results) { const r = results.find(x => x.check === c); cls = r && r.ok ? 'ok' : 'bad'; }
      return `<li class="${cls}">${P(c.label)}</li>`;
    }).join('');
    $('challenge-body').innerHTML =
      `<h3>${P(ch.title || 'Challenge')}</h3>` +
      `<span class="worth">${S.isComplete(currentLesson().id) ? '✔ Completed · ' + S.data.completed[currentLesson().id].xp + ' XP earned' : 'Worth ' + (ch.xp || 100) + ' XP'}</span>` +
      `${P(ch.brief || '')}` +
      (tasks ? `<p class="muted small" style="margin-bottom:6px">GOALS</p><ul class="task-list">${tasks}</ul>` : '');
    if (!results) {
      $('hint-box').innerHTML = '';
      $('feedback').innerHTML = ''; $('feedback').className = 'feedback';
      updateHintButtons();
    }
  }

  function updateHintButtons() {
    const ch = currentLesson().challenge;
    const hints = ch.hints || [];
    $('btn-hint').disabled = state.hintsUsed >= hints.length;
    $('btn-hint').textContent = hints.length
      ? (state.hintsUsed >= hints.length ? '💡 No more hints' : `💡 Hint (${state.hintsUsed}/${hints.length})`)
      : '💡 No hints';
    const canShowSolution = ch.solution && !state.solutionShown &&
      (state.hintsUsed >= hints.length || state.attempts >= 3);
    $('btn-solution').classList.toggle('hidden', !canShowSolution);
  }

  $('btn-hint').addEventListener('click', () => {
    const hints = currentLesson().challenge.hints || [];
    if (state.hintsUsed >= hints.length) return;
    const h = hints[state.hintsUsed++];
    const d = document.createElement('div');
    d.className = 'hint';
    d.innerHTML = `<b>Hint ${state.hintsUsed}:</b> ${P(h)}`;
    $('hint-box').appendChild(d);
    updateHintButtons();
  });

  $('btn-solution').addEventListener('click', () => {
    const ch = currentLesson().challenge;
    const box = UI.modal(
      `<h3>Show the solution, ${name()}?</h3><p>Looking at the answer is a great way to learn when you're stuck – but you'll only earn a quarter of the XP for this challenge. Try to understand <i>why</i> it works before moving on.</p>
       <div class="actions"><button class="btn btn-ghost" data-a="no">Keep trying</button><button class="btn btn-primary" data-a="yes">Show me</button></div>`);
    box.querySelector('[data-a=no]').onclick = UI.closeModal;
    box.querySelector('[data-a=yes]').onclick = () => {
      UI.closeModal();
      state.solutionShown = true;
      const d = document.createElement('div');
      d.className = 'hint';
      const sol = RQuest.personalizeCode(ch.solution);
      d.innerHTML = `<b>Solution:</b><pre>${esc(sol)}</pre><button class="btn btn-tiny" style="margin-top:8px">Copy to editor</button>`;
      d.querySelector('button').onclick = () => { editor.set(sol); editor.focus(); };
      $('hint-box').appendChild(d);
      updateHintButtons();
    };
  });

  $('btn-reset').addEventListener('click', () => {
    const les = currentLesson();
    editor.set(RQuest.personalizeCode(les.challenge.starter) || '');
    S.clearDraft(les.id);
    editor.focus();
  });
  $('btn-clear').addEventListener('click', () => consoleUI.clear());

  function setBusy(b) { ['btn-run', 'btn-submit', 'sb-run'].forEach(id => { $(id).disabled = b; }); }

  async function execute(code, con) {
    if (!RQuest.R.ready) con.sys('Waiting for R to finish loading…');
    try {
      const res = await RQuest.R.run(code);
      con.show(res);
      return res;
    } catch (e) {
      con.sys('⚠ R could not be started: ' + (e && e.message ? e.message : e) +
        '. Check your internet connection (R is downloaded the first time) and click the red status pill to retry.');
      return null;
    }
  }

  async function runCode() {
    setBusy(true);
    await execute(editor.get(), consoleUI);
    setBusy(false);
  }

  async function submitCode() {
    const les = currentLesson();
    const ch = les.challenge;
    const code = editor.get();
    setBusy(true);
    const res = await execute(code, consoleUI);
    if (!res) { setBusy(false); return; }
    const verdict = await RQuest.Checker.mark(ch, code, res);
    setBusy(false);
    state.attempts++;
    renderChallenge(verdict.results);

    const fb = $('feedback');
    if (verdict.passed) {
      const base = ch.xp || 100;
      let xp = base - state.hintsUsed * Math.round(base * 0.15);
      if (state.solutionShown) xp = Math.round(base * 0.25);
      xp = Math.max(xp, Math.round(base * 0.25));
      const wasDone = S.isComplete(les.id);
      const before = S.totalXP();
      const rankBefore = rankFor(before);
      S.complete(les.id, { xp, hints: state.hintsUsed, attempts: state.attempts });
      const gained = S.totalXP() - before;           // replays only add XP if you beat your best
      const rankAfter = rankFor(S.totalXP());
      renderHUD(gained);
      renderChallenge(verdict.results);
      fb.className = 'feedback ok';
      fb.innerHTML = `<h4>✔ Challenge complete, ${name()}!</h4>${P(ch.success || '')}`;
      celebrate(xp, gained, wasDone, rankAfter !== rankBefore ? rankAfter : null);
    } else {
      fb.className = 'feedback bad';
      const msgs = [];
      if (verdict.error) msgs.push('Your code produced an error, so it couldn\'t be checked. Fix the red error in the console first.');
      else verdict.results.filter(r => !r.ok).forEach(r => { if (r.check.fail) msgs.push(r.check.fail); });
      if (!msgs.length) msgs.push('Not quite – compare your code with the goals above.');
      fb.innerHTML = `<h4>Not quite yet, ${name()}…</h4><ul>${msgs.map(m => `<li>${P(m)}</li>`).join('')}</ul>` +
        (state.attempts >= 2 && state.hintsUsed < (ch.hints || []).length ? '<p class="small muted" style="margin:8px 0 0">Stuck? Try a 💡 hint.</p>' : '');
      updateHintButtons();
    }
  }

  function celebrate(xp, gained, replay, newRank) {
    const lvl = state.level;
    const rankHtml = newRank ? `<div class="rank-up">⬆ Rank up! ${name()}, you're now a <b>${newRank}</b>!</div>` : '';
    const xpHtml = gained > 0 ? `<div class="xp-gain">+${gained} XP</div>`
      : `<p class="small">You scored ${xp} XP this time (your best of ${S.data.completed[currentLesson().id].xp} XP is kept).</p>`;
    const last = state.lessonIndex === lvl.lessons.length - 1;
    const cleared = levelDone(lvl);
    if (last && cleared) {
      const box = UI.modal(
        `<div class="big-emoji">🏆</div><h3>Level ${lvl.number} cleared, ${name()}!</h3>
         <p>You've finished <b>${esc(lvl.title)}</b>. ${P(lvl.outro || '')}</p>
         ${RQuest.story && RQuest.story.ending && RQuest.story.ending[lvl.id] ? `<p class="story-ending">${P(RQuest.story.ending[lvl.id])}</p>` : ''}
         ${xpHtml}${rankHtml}
         <p class="small">Level total: ${S.levelXP(lvl)} / ${maxXP(lvl)} XP · Rank: <b>${rankFor(S.totalXP())}</b></p>
         <div class="actions"><button class="btn" data-a="stay">Stay here</button><button class="btn btn-gold" data-a="map">Back to the map</button></div>`,
        { center: true });
      box.querySelector('[data-a=stay]').onclick = UI.closeModal;
      box.querySelector('[data-a=map]').onclick = () => { UI.closeModal(); show('map'); };
      return;
    }
    const box = UI.modal(
      `<div class="big-emoji">${replay ? '🔁' : '🎉'}</div><h3>${replay ? `Solved again, ${name()}!` : `Nice work, ${name()}!`}</h3>
       ${xpHtml}${rankHtml}
       <p class="small">${state.hintsUsed ? `Hints used: ${state.hintsUsed}. ` : 'No hints – excellent! '}Total: ${S.totalXP()} XP · ${rankFor(S.totalXP())}</p>
       <div class="actions"><button class="btn" data-a="stay">Stay here</button>${last ? '' : '<button class="btn btn-primary" data-a="next">Next lesson →</button>'}</div>`,
      { center: true });
    box.querySelector('[data-a=stay]').onclick = UI.closeModal;
    const nx = box.querySelector('[data-a=next]');
    if (nx) nx.onclick = () => { UI.closeModal(); openLesson(state.lessonIndex + 1); };
  }

  $('btn-run').addEventListener('click', runCode);
  $('btn-submit').addEventListener('click', submitCode);

  /* ---------------- Sandbox ---------------- */
  const sbConsole = UI.Console($('sb-console'), $('sb-plot-area'));
  let sbTimer = null;
  const sbEditor = RQuest.Editor($('sb-editor-host'), {
    value: S.data.sandbox || '# Welcome to the sandbox!\n# Try anything you like, then press Run.\n\nx <- c(3, 1, 4, 1, 5, 9)\nprint(mean(x))\nhist(x)\n',
    onRun: () => runSandbox(),
    onChange: code => { clearTimeout(sbTimer); sbTimer = setTimeout(() => { S.data.sandbox = code; S.save(); }, 400); },
  });
  async function runSandbox() { setBusy(true); await execute(sbEditor.get(), sbConsole); setBusy(false); }
  $('sb-run').addEventListener('click', runSandbox);
  $('sb-clear').addEventListener('click', () => sbConsole.clear());

  /* ---------------- Settings ---------------- */
  function applyFontSize() {
    document.documentElement.style.setProperty('--code-size', S.data.settings.fontSize + 'px');
    editor.refresh(); sbEditor.refresh();
  }
  $('btn-settings').addEventListener('click', () => {
    const box = UI.modal(
      `<h3>Settings</h3>
       <div class="setting-row"><span>Player name</span><input type="text" id="set-name" maxlength="20" value="${name()}"></div>
       <div class="setting-row"><span>Code font size</span><span><input type="range" min="12" max="22" value="${S.data.settings.fontSize}" id="set-font"> <span id="set-font-val">${S.data.settings.fontSize}px</span></span></div>
       <div class="setting-row"><span>Restart the R engine<br><span class="small muted">Use this if R gets stuck.</span></span><button class="btn btn-small" id="set-restart">Restart R</button></div>
       <div class="setting-row"><span>Reset all progress<br><span class="small muted">Deletes XP, completed lessons and saved code.</span></span><button class="btn btn-small" id="set-reset">Reset…</button></div>
       <div class="actions"><button class="btn btn-primary" id="set-close">Done</button></div>`);
    box.querySelector('#set-name').oninput = e => {
      S.data.settings.playerName = e.target.value; S.save();
      renderHUD(); renderMenu();
    };
    box.querySelector('#set-font').oninput = e => {
      S.data.settings.fontSize = +e.target.value; S.save();
      box.querySelector('#set-font-val').textContent = e.target.value + 'px';
      applyFontSize();
    };
    box.querySelector('#set-restart').onclick = e => { e.target.disabled = true; e.target.textContent = 'Restarting…'; RQuest.R.restart().catch(() => {}).finally(() => { e.target.textContent = 'Restarted ✓'; }); };
    box.querySelector('#set-reset').onclick = e => {
      if (e.target.dataset.confirm) {
        const keepName = S.data.settings.playerName;
        S.reset(); S.data.settings.playerName = keepName; S.save();
        UI.closeModal(); renderMenu(); return;
      }
      e.target.dataset.confirm = '1'; e.target.textContent = 'Click again to confirm'; e.target.classList.add('btn-gold');
    };
    box.querySelector('#set-close').onclick = UI.closeModal;
  });

  /* ---------------- Boot ---------------- */
  applyFontSize();
  renderMenu();
  RQuest.R.init().catch(err => console.error(err));
})();
