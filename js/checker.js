RQuest.Checker = (function () {

  /** Remove R comments, leaving strings intact. */
  function stripComments(code) {
    let out = '', inStr = null;
    for (let i = 0; i < code.length; i++) {
      const ch = code[i];
      if (inStr) {
        out += ch;
        if (ch === '\\') { out += code[++i] || ''; continue; }
        if (ch === inStr) inStr = null;
      } else if (ch === '"' || ch === "'" || ch === '`') {
        inStr = ch; out += ch;
      } else if (ch === '#') {
        while (i < code.length && code[i] !== '\n') i++;
        out += '\n';
      } else out += ch;
    }
    return out;
  }

  const toRe = m => (m instanceof RegExp ? m : new RegExp(m));

  /**
   * @returns {Promise<{passed, results:[{check, ok}], error}>}
   */
  async function mark(challenge, code, runResult) {
    const checks = challenge.checks || [];
    const results = checks.map(c => ({ check: c, ok: false }));
    const noComments = stripComments(code);

    // R checks are batched into one call
    const rIdx = [], rTests = [];
    checks.forEach((c, i) => { if (c.type === 'r') { rIdx.push(i); rTests.push(c.test); } });
    let rRes = [];
    if (!runResult.error && rTests.length) rRes = await RQuest.R.check(rTests);
    rIdx.forEach((i, k) => { results[i].ok = !!rRes[k]; });

    checks.forEach((c, i) => {
      if (c.type === 'output') results[i].ok = toRe(c.match).test(runResult.stdout);
      else if (c.type === 'code') results[i].ok = toRe(c.match).test(c.raw ? code : noComments);
      else if (c.type === 'notcode') results[i].ok = !toRe(c.match).test(c.raw ? code : noComments);
    });

    const passed = !runResult.error && results.every(r => r.ok);
    return { passed, results, error: runResult.error };
  }

  /** Friendly explanations for common beginner errors. */
  function explainError(msg) {
    if (!msg) return null;
    let m;
    if ((m = msg.match(/object '(.+?)' not found/)))
      return `R doesn't know anything called <code>${esc(m[1])}</code>. Check the spelling and capital letters (R is case-sensitive), make sure you created it on an earlier line, and if you meant it as text, put it in quotes: <code>"${esc(m[1])}"</code>.`;
    if ((m = msg.match(/could not find function "(.+?)"/)))
      return `There's no function called <code>${esc(m[1])}</code>. Check the spelling – function names are case-sensitive (<code>print</code>, not <code>Print</code>).`;
    if (/unexpected string constant/.test(msg))
      return 'R found a piece of text where it didn\'t expect one. Are you missing a comma between items, or an operator like <code>+</code>?';
    if (/unexpected numeric constant/.test(msg))
      return 'R found a number where it didn\'t expect one. Are you missing a comma or an operator between two numbers?';
    if (/unexpected symbol/.test(msg))
      return 'R found a word where it didn\'t expect one. This often means a missing comma, a missing operator, or a space inside a variable name (use <code>my_name</code>, not <code>my name</code>).';
    if (/unexpected end of input/.test(msg))
      return 'Your code stopped before R expected it to. Check that every <code>(</code> has a matching <code>)</code> and every quote <code>"</code> is closed.';
    if (/unexpected '\)'/.test(msg))
      return 'There\'s a closing bracket <code>)</code> without a matching opening one. Count your brackets!';
    if (/unexpected (input|INCOMPLETE_STRING)/.test(msg))
      return 'R couldn\'t read part of your code. Check for unclosed quotes or stray characters (curly “smart quotes” copied from documents won\'t work – use straight <code>"</code> quotes).';
    if (/non-numeric argument to binary operator/.test(msg))
      return 'You tried to do maths with something that isn\'t a number – probably text in quotes. <code>"5" + 1</code> fails, but <code>5 + 1</code> works.';
    if (/unexpected assignment/.test(msg) || /invalid \(do_set\) left-hand side/.test(msg))
      return 'Something is wrong with an assignment. The variable name goes on the left: <code>x &lt;- 5</code>. Names can\'t start with a number.';
    if (/argument ".*" is missing, with no default/.test(msg))
      return 'A function needed an input that you didn\'t give it. Check what goes inside the brackets.';
    return null;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  return { mark, explainError, stripComments, esc };
})();
