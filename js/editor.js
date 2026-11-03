RQuest.Editor = function (host, opts) {
  opts = opts || {};
  const api = {};

  if (window.CodeMirror) {
    const cm = CodeMirror(host, {
      value: opts.value || '',
      mode: 'r',
      theme: 'rquest',
      lineNumbers: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      indentUnit: 2,
      tabSize: 2,
      indentWithTabs: false,
      lineWrapping: false,
      extraKeys: {
        'Ctrl-Enter': () => opts.onRun && opts.onRun(),
        'Cmd-Enter': () => opts.onRun && opts.onRun(),
        'Shift-Ctrl-Enter': () => opts.onSubmit && opts.onSubmit(),
        'Shift-Cmd-Enter': () => opts.onSubmit && opts.onSubmit(),
        'Tab': c => c.somethingSelected() ? c.indentSelection('add') : c.replaceSelection('  ', 'end'),
        'Alt--': c => c.replaceSelection(' <- ', 'end'),   // same shortcut as RStudio
        'Ctrl-/': c => toggleComment(c),
        'Cmd-/': c => toggleComment(c),
      },
    });
    cm.on('change', () => opts.onChange && opts.onChange(cm.getValue()));
    api.get = () => cm.getValue();
    api.set = v => { cm.setValue(v || ''); cm.clearHistory(); };
    api.focus = () => cm.focus();
    api.refresh = () => setTimeout(() => cm.refresh(), 0);
    api.setFontSize = () => api.refresh();
    api.cm = cm;
  } else {
    const ta = document.createElement('textarea');
    ta.className = 'fallback';
    ta.spellcheck = false;
    ta.value = opts.value || '';
    host.appendChild(ta);
    ta.addEventListener('input', () => opts.onChange && opts.onChange(ta.value));
    ta.addEventListener('keydown', e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) opts.onSubmit && opts.onSubmit(); else opts.onRun && opts.onRun();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const s = ta.selectionStart;
        ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(ta.selectionEnd);
        ta.selectionStart = ta.selectionEnd = s + 2;
      }
    });
    api.get = () => ta.value;
    api.set = v => { ta.value = v || ''; };
    api.focus = () => ta.focus();
    api.refresh = () => {};
    api.setFontSize = () => {};
  }

  function toggleComment(c) {
    const from = c.getCursor('from').line, to = c.getCursor('to').line;
    const lines = [];
    for (let i = from; i <= to; i++) lines.push(c.getLine(i));
    const allCommented = lines.every(l => /^\s*#/.test(l) || l.trim() === '');
    c.operation(() => {
      for (let i = from; i <= to; i++) {
        const l = c.getLine(i);
        const nl = allCommented ? l.replace(/^(\s*)# ?/, '$1') : (l.trim() === '' ? l : '# ' + l);
        c.replaceRange(nl, { line: i, ch: 0 }, { line: i, ch: l.length });
      }
    });
  }

  return api;
};
