window.RQuest = window.RQuest || {};

RQuest.levels = [
  { id: 'level01', number: 1, icon: '🏕️', accent: '#3d8bfd',
    title: 'Basecamp: First Steps',
    blurb: 'Printing, maths, variables, data types and your very first vectors.' },
  { id: 'level02', number: 2, icon: '🏞️', accent: '#3fd28f',
    title: 'Vector Valley',
    blurb: 'Indexing, sequences, vector maths, logical tests and filtering.' },
  { id: 'level03', number: 3, icon: '🔤', accent: '#f6b94a',
    title: 'String Springs',
    blurb: 'Working with text: paste(), formatting, searching and replacing.' },
  { id: 'level04', number: 4, icon: '🔀', accent: '#ff8a65',
    title: 'Control Flow Canyon',
    blurb: 'if / else, for loops, while loops and making decisions in code.' },
  { id: 'level05', number: 5, icon: '⚙️', accent: '#a78bfa',
    title: 'Function Foundry',
    blurb: 'Write your own functions, arguments, defaults and return values.' },
  { id: 'level06', number: 6, icon: '📦', accent: '#4dd0e1',
    title: 'List & Factor Lagoon',
    blurb: 'Lists, factors, matrices and choosing the right structure.' },
  { id: 'level07', number: 7, icon: '🌲', accent: '#81c784',
    title: 'Data Frame Forest',
    blurb: 'Build, explore, subset and summarise data frames.' },
  { id: 'level08', number: 8, icon: '🔁', accent: '#f06292',
    title: 'Apply Archipelago',
    blurb: 'The apply family: lapply, sapply, vapply and Map.' },
  { id: 'level09', number: 9, icon: '⛏️', accent: '#ffb74d',
    title: 'Data Wrangling Mines',
    blurb: 'dplyr verbs, the pipe, grouping and joining tables.' },
  { id: 'level10', number: 10, icon: '🏔️', accent: '#64b5f6',
    title: 'Plot Peaks',
    blurb: 'Base graphics and ggplot2 to tell stories with data.' },
  { id: 'level11', number: 11, icon: '🧪', accent: '#ba68c8',
    title: 'Statistics Station',
    blurb: 'Distributions, t-tests, correlation and linear models.' },
  { id: 'level12', number: 12, icon: '🏛️', accent: '#e57373',
    title: 'Advanced Archives',
    blurb: 'Environments, closures, error handling, S3 classes and performance.' },
];

/** Called by each level file to attach its lessons. */
RQuest.registerLevel = function (id, data) {
  const lvl = RQuest.levels.find(l => l.id === id);
  if (!lvl) {
    console.error('registerLevel: unknown level id "' + id + '". Add it to RQuest.levels first.');
    return;
  }
  Object.assign(lvl, data);
};
