# R Quest

A browser game that teaches R from complete beginner to advanced. Real R runs inside the
browser through [webR](https://docs.r-wasm.org/webr/), so you don't need to install anything.

## Playing

- **Double-click `Play.bat`**. This starts a tiny local web server and opens the game in your browser.
  Keep the black window open while you play.
- You can also try opening `index.html` directly. If R won't start that way, use `Play.bat`.
- You need an internet connection: R (about 20 MB) is downloaded the first time and cached after that.
- Progress, XP and your code are saved in the browser automatically.

## Project layout

```
index.html            Screens: menu, level map, lesson, sandbox, how-to
css/style.css         All styling
js/r-engine.js        Starts webR, runs code, runs R-side checks
js/editor.js          Code editor (CodeMirror, with a plain textarea fallback)
js/checker.js         Marks submissions + friendly explanations of R errors
js/ui.js              Console, modal and tutorial rendering
js/storage.js         Save data (localStorage)
js/main.js            Game flow: navigation, unlocking, XP, hints
levels/registry.js    The full curriculum (all 12 levels), shown on the map
levels/level01.js     Level 1 content
tools/server.ps1      Local web server used by Play.bat
```


## plan

1. Basecamp: First Steps (built): print, arithmetic, comments, variables, types, vectors
2. Vector Valley: indexing, sequences, vector maths, logical filtering
3. String Springs: paste, sprintf, substr, grepl, gsub
4. Control Flow Canyon: if/else, for, while
5. Function Foundry: writing functions, arguments, defaults, return
6. List & Factor Lagoon: lists, factors, matrices
7. Data Frame Forest: building, subsetting and summarising data frames
8. Apply Archipelago: lapply, sapply, vapply, Map
9. Data Wrangling Mines: dplyr, pipes, grouping, joins (packages via `webr::install()`)
10. Plot Peaks: base graphics and ggplot2 (plots appear under the console)
11. Statistics Station: distributions, t-tests, correlation, lm()
12. Advanced Archives: environments, closures, error handling, S3, performance
