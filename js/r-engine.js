RQuest.R = (function () {
  // Tried in order. The pinned version is preferred; "latest" is a fallback.
  const SOURCES = [
    'https://webr.r-wasm.org/v0.5.4/',
    'https://webr.r-wasm.org/latest/',
  ];

  // R helpers installed once when R starts.
  const R_SETUP = String.raw`
.rq <- new.env()
.rq$user_env <- new.env(parent = globalenv())
.rq$last_error <- ""

.rq$run <- function(code, echo = TRUE) {
  .rq$user_env <- new.env(parent = globalenv())
  env <- .rq$user_env
  .rq$last_error <- ""
  exprs <- tryCatch(parse(text = code, keep.source = TRUE), error = function(e) e)
  if (inherits(exprs, "error")) {
    msg <- gsub("<text>:", "line ", conditionMessage(exprs), fixed = TRUE)
    .rq$last_error <- msg
    cat("Error: ", msg, "\n", sep = "", file = stderr())
    return(invisible(FALSE))
  }
  srcs <- attr(exprs, "srcref")
  for (i in seq_along(exprs)) {
    if (echo && !is.null(srcs)) {
      lines <- as.character(srcs[[i]])
      cat(paste0("\001", c("> ", rep("+ ", length(lines) - 1)), lines), sep = "\n")
    }
    ok <- tryCatch(
      withCallingHandlers({
        res <- withVisible(eval(exprs[[i]], env))
        if (res$visible) print(res$value)
        TRUE
      },
      warning = function(w) {
        cat("Warning message: ", conditionMessage(w), "\n", sep = "", file = stderr())
        invokeRestart("muffleWarning")
      },
      message = function(m) {
        cat(conditionMessage(m), file = stderr())
        invokeRestart("muffleMessage")
      }),
      error = function(e) {
        .rq$last_error <- conditionMessage(e)
        cat("Error: ", conditionMessage(e), "\n", sep = "", file = stderr())
        FALSE
      })
    if (!isTRUE(ok)) break
  }
  invisible(.rq$last_error == "")
}

.rq$check <- function(tests) {
  env <- .rq$user_env
  res <- vapply(tests, function(t) {
    r <- FALSE
    invisible(utils::capture.output(
      r <- tryCatch(suppressWarnings(eval(parse(text = t), envir = env)),
                    error = function(e) FALSE)
    ))
    isTRUE(r)
  }, logical(1), USE.NAMES = FALSE)
  paste(as.integer(res), collapse = ",")
}

# ---- helpers available to level authors inside checks ----
.has   <- function(name) exists(name, envir = .rq$user_env, inherits = FALSE)
.get   <- function(name) get(name, envir = .rq$user_env, inherits = FALSE)
.near  <- function(a, b, tol = 1e-6) isTRUE(all.equal(a, b, tolerance = tol, check.attributes = FALSE))
`;

  let webR = null;
  let ready = false;
  let initPromise = null;
  let queue = Promise.resolve();
  const statusListeners = [];

  function setStatus(state, label) {
    statusListeners.forEach(fn => fn(state, label));
  }

  async function start() {
    setStatus('loading', 'Starting R…');
    let lastErr = null;
    for (const base of SOURCES) {
      try {
        const mod = await import(base + 'webr.mjs');
        webR = new mod.WebR({ baseUrl: base });
        await webR.init();
        await webR.evalRVoid(R_SETUP);
        ready = true;
        setStatus('ready', 'R ready');
        return true;
      } catch (e) {
        lastErr = e;
        console.warn('Could not start webR from ' + base, e);
        try { if (webR) webR.close(); } catch (_) {}
        webR = null;
      }
    }
    setStatus('error', 'R failed to load');
    throw lastErr || new Error('R failed to load');
  }

  function init() {
    if (!initPromise) initPromise = start().catch(e => { initPromise = null; throw e; });
    return initPromise;
  }

  /** Serialise all R calls so runs never overlap. */
  function enqueue(job) {
    const p = queue.then(job, job);
    queue = p.catch(() => {});
    return p;
  }

  /**
   * Run a script in a fresh environment.
   * Returns { lines: [{type, text}], stdout, error, images }
   *   type: 'echo' | 'out' | 'err' | 'warn' | 'msg'
   */
  function run(code) {
    return enqueue(async () => {
      await init();
      setStatus('busy', 'Running…');
      const shelter = await new webR.Shelter();
      const lines = [];
      const stdout = [];
      let images = [];
      try {
        const cap = await shelter.captureR('.rq$run(' + JSON.stringify(code) + ')', {
          captureStreams: true,
          captureConditions: false,
          withAutoprint: false,
          captureGraphics: true,
        });
        for (const item of cap.output) {
          const text = String(item.data);
          if (item.type === 'stdout') {
            if (text.charCodeAt(0) === 1) lines.push({ type: 'echo', text: text.slice(1) });
            else { lines.push({ type: 'out', text }); stdout.push(text); }
          } else if (item.type === 'stderr') {
            if (text.startsWith('Error')) lines.push({ type: 'err', text });
            else if (text.startsWith('Warning')) lines.push({ type: 'warn', text });
            else lines.push({ type: 'msg', text });
          }
        }
        images = cap.images || [];
      } finally {
        await shelter.purge();
      }
      const error = await webR.evalRString('.rq$last_error');
      setStatus('ready', 'R ready');
      return { lines, stdout: stdout.join('\n'), error, images };
    });
  }

  /** Evaluate R test expressions against the variables from the last run. */
  function check(tests) {
    if (!tests.length) return Promise.resolve([]);
    return enqueue(async () => {
      await init();
      const call = '.rq$check(c(' + tests.map(t => JSON.stringify(t)).join(', ') + '))';
      const res = await webR.evalRString(call);
      return res.split(',').map(x => x === '1');
    });
  }

  async function restart() {
    try { if (webR) webR.close(); } catch (_) {}
    webR = null; ready = false; initPromise = null;
    queue = Promise.resolve();
    return init();
  }

  return {
    init, run, check, restart,
    get ready() { return ready; },
    onStatus(fn) { statusListeners.push(fn); },
  };
})();
