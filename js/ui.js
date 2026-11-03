RQuest.UI = (function () {
  const esc = s => RQuest.Checker.esc(s);

  /* ---------------- Console ---------------- */
  function Console(el, plotEl) {
    function add(cls, html) {
      const d = document.createElement('div');
      d.className = 'ln ' + cls;
      d.innerHTML = html;
      el.appendChild(d);
      el.scrollTop = el.scrollHeight;
      return d;
    }
    return {
      clear() { el.innerHTML = ''; if (plotEl) { plotEl.innerHTML = ''; plotEl.classList.add('hidden'); } },
      sys(text) { return add('sys', esc(text)); },
      sep() { if (el.children.length) add('sep', ''); },
      show(result) {
        this.sep();
        result.lines.forEach(l => add(l.type === 'msg' ? 'out' : l.type, esc(l.text)));
        if (result.error) {
          const tip = RQuest.Checker.explainError(result.error);
          if (tip) add('tip', '💡 ' + tip);
        }
        if (!result.lines.some(l => l.type !== 'echo') && !result.error && !(result.images || []).length) {
          add('sys', '(ran without printing anything)');
        }
        if (plotEl) {
          plotEl.innerHTML = '';
          (result.images || []).forEach(img => {
            const c = document.createElement('canvas');
            c.width = img.width; c.height = img.height;
            c.getContext('2d').drawImage(img, 0, 0);
            plotEl.appendChild(c);
          });
          plotEl.classList.toggle('hidden', !(result.images || []).length);
        }
      },
    };
  }

  /* ---------------- Modal ---------------- */
  const backdrop = () => document.getElementById('modal');
  const box = () => document.getElementById('modal-box');

  function modal(html, opts) {
    opts = opts || {};
    box().className = 'modal' + (opts.center ? ' center' : '');
    box().innerHTML = html;
    backdrop().classList.remove('hidden');
    if (opts.dismissable !== false) {
      backdrop().onclick = e => { if (e.target === backdrop()) closeModal(); };
    } else backdrop().onclick = null;
    return box();
  }
  function closeModal() { backdrop().classList.add('hidden'); box().innerHTML = ''; }

  /* ---------------- Tutorial page ---------------- */
  /**
   * Tutorial bodies are HTML. Any <pre class="r"> block becomes a runnable
   * example with "Run" and "Copy to editor" buttons.
   */
  function renderTutorial(container, page, handlers) {
    const P = RQuest.personalize;
    container.innerHTML = (page.title ? '<h3>' + P(page.title) + '</h3>' : '') + P(page.body);
    container.querySelectorAll('pre.r').forEach(pre => {
      const code = RQuest.personalizeCode(pre.textContent.replace(/^\n+|\s+$/g, ''));
      const wrap = document.createElement('div');
      wrap.className = 'example';
      wrap.innerHTML =
        '<pre>' + esc(code) + '</pre>' +
        '<div class="ex-bar">' +
          '<button class="btn btn-tiny btn-ghost" data-act="copy">Copy to editor</button>' +
          '<button class="btn btn-tiny" data-act="run">▶ Run example</button>' +
        '</div><div class="ex-out hidden"></div>';
      pre.replaceWith(wrap);
      const out = wrap.querySelector('.ex-out');
      wrap.querySelector('[data-act=run]').onclick = async e => {
        const btn = e.currentTarget;
        btn.disabled = true;
        out.classList.remove('hidden');
        out.textContent = RQuest.R.ready ? 'Running…' : 'Waiting for R to load…';
        try {
          const res = await RQuest.R.run(code);
          const shown = res.lines.filter(l => l.type !== 'echo').map(l => l.text);
          out.textContent = shown.length ? shown.join('\n') : '(no output – this code doesn\'t print anything)';
          if (handlers && handlers.onRunExample) handlers.onRunExample(res);
        } catch (err) {
          out.textContent = 'R is not available: ' + err.message;
        }
        btn.disabled = false;
      };
      wrap.querySelector('[data-act=copy]').onclick = () => handlers && handlers.onCopy && handlers.onCopy(code);
    });
  }

  return { Console, modal, closeModal, renderTutorial, esc };
})();
