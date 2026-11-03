RQuest.story = {
  intro: [
    { art: '🌄', text: 'Beyond the edge of the map lie the <b>Data Wilds</b>: a land of endless numbers, tangled text and patterns hidden in plain sight.' },
    { art: '🧭', text: 'Twenty years ago, the great archaeologist <b>Professor Howard Carter</b> set out to chart them. He was never seen again.' },
    { art: '📜', text: 'All that came back were pages from his journal, covered in strange instructions written in a language called <b>R</b>.' },
    { art: '🏛️', text: 'The last page speaks of the <b>Advanced Archives</b>, a library at the very summit of the Wilds where every secret of data is kept… and where Carter was heading.' },
    { art: '⛺', text: 'Now a new expedition is forming. Its leader, <b>Captain Mordubh</b>, needs someone who can read Carter\'s notes and speak the language of the Wilds.' },
    { art: '✨', text: 'He has chosen you, <b>{name}</b>.' },
    { art: '🏕️', text: 'Your journey begins at <b>Basecamp</b>. Learn the basics, earn your rank, and climb all the way to the Archives. Good luck, {name}!' },
  ],

  // Keyed by level id. Speaker shown above the text.
  journal: {
    level01: { speaker: 'Captain Mordubh', text: '"Welcome to Basecamp, {name}! Before anyone sets foot in the Wilds, they learn to speak R. Start with the basics. Carter\'s first journal page is right here and it\'s full of them."' },
    level02: { speaker: 'Carter\'s journal', text: '"The valley is lined with long rows of stones, each one numbered. The locals pick out exactly the stones they need with square brackets…"' },
    level03: { speaker: 'Captain Mordubh', text: '"These springs bubble with words instead of water, {name}. Carter\'s notes say we must learn to stitch, split and search text before we can cross."' },
    level04: { speaker: 'Carter\'s journal', text: '"The canyon splits again and again. At every fork I must decide: if this, go left; else, go right. And some paths loop back on themselves…"' },
    level05: { speaker: 'Captain Mordubh', text: '"A foundry! Carter built his own tools here. If we\'re going to keep up, {name}, you\'ll need to forge some functions of your own."' },
    level06: { speaker: 'Carter\'s journal', text: '"The lagoon\'s treasures don\'t fit in neat rows. Some boxes hold other boxes. I\'m calling them lists."' },
    level07: { speaker: 'Captain Mordubh', text: '"The forest grows in perfect rows and columns, {name}. Every tree is a record. Carter mapped it as a data frame. Let\'s do the same."' },
    level08: { speaker: 'Carter\'s journal', text: '"Hundreds of islands, and the same task on each. I refuse to row to every one. There must be a way to apply myself to them all at once…"' },
    level09: { speaker: 'Captain Mordubh', text: '"The mines are full of raw data, {name}. Messy, mixed up, half-buried. Time to filter, sort and wrangle it into shape."' },
    level10: { speaker: 'Carter\'s journal', text: '"From the peaks you can see everything. I\'ve started drawing what I find. A good picture says more than a thousand numbers."' },
    level11: { speaker: 'Captain Mordubh', text: '"An old research station. Carter tested every theory he had here. We need to know what\'s real and what\'s chance, {name}."' },
    level12: { speaker: 'Carter\'s journal', text: '"I have reached the Archives. The deepest secrets of R are kept here. If you are reading this, whoever you are… come and find me."' },
  },

  ending: {
    level01: 'Captain Mordubh closes Carter\'s first journal page and nods. "You\'re ready, {name}. Pack your things, we leave for Vector Valley at dawn."',
  },
};
