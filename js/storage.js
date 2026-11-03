RQuest.Storage = (function () {
  const KEY = 'rquest.save.v1';

  const blank = () => ({
    completed: {},          // lessonId -> { xp, hints, attempts, date }
    tutorialSeen: {},       // lessonId -> true
    drafts: {},             // lessonId -> code the player last had in the editor
    sandbox: '',            // sandbox code
    storySeen: false,       // intro story has been shown
    settings: { fontSize: 15, playerName: 'Jovi' },
  });

  let data = blank();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        data = Object.assign(blank(), saved);
        data.settings = Object.assign(blank().settings, saved.settings || {});
      }
    } catch (e) { data = blank(); }
    return data;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* private mode etc. */ }
  }
  function reset() { data = blank(); save(); }

  load();

  return {
    get data() { return data; },
    save, reset,

    isComplete: id => !!data.completed[id],
    complete(id, info) {
      const prev = data.completed[id];
      // keep the best XP if replaying
      if (!prev || info.xp > prev.xp) data.completed[id] = Object.assign({ date: Date.now() }, info);
      save();
    },
    markTutorialSeen(id) { data.tutorialSeen[id] = true; save(); },
    getDraft: id => data.drafts[id],
    setDraft(id, code) { data.drafts[id] = code; save(); },
    clearDraft(id) { delete data.drafts[id]; save(); },

    totalXP() { return Object.values(data.completed).reduce((s, c) => s + (c.xp || 0), 0); },
    levelXP(level) {
      return (level.lessons || []).reduce((s, l) => s + (data.completed[l.id] ? data.completed[l.id].xp : 0), 0);
    },
  };
})();

/* ---------------------------------------------------------
   Player name. Anywhere in level text, write {name} and it
   is replaced with the player's name (default: Jovi).
   --------------------------------------------------------- */
RQuest.playerName = function () {
  const n = (RQuest.Storage.data.settings.playerName || '').trim();
  return n || 'Jovi';
};
RQuest.personalize = function (text) {
  if (text == null) return text;
  const safe = RQuest.playerName().replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  return String(text).replace(/\{name\}/g, safe);
};
/** Same as personalize, but for code (no HTML escaping). */
RQuest.personalizeCode = function (code) {
  return code == null ? code : String(code).replace(/\{name\}/g, RQuest.playerName().replace(/"/g, ''));
};
