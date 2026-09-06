/**
 * app.js
 * Punto de entrada: conecta todos los módulos con el DOM.
 */
(function (App) {
  "use strict";
  const { $, $$, el, showView, toast, confirmDialog, closeModal, speak } = App.UI;

  /* -------------------------------- Theme ------------------------------------ */
  function applyTheme() {
    const setting = App.Storage.getSettings().theme;
    let dark;
    if (setting === "dark") dark = true;
    else if (setting === "light") dark = false;
    else dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    $("#darkModeSwitch").classList.toggle("on", dark);
    $("#darkModeSwitch").setAttribute("aria-checked", String(dark));
  }
  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    App.Storage.setSetting("theme", current === "dark" ? "light" : "dark");
    applyTheme();
    refreshCharts();
  }

  /* ------------------------------ Settings switches --------------------------- */
  function applySettingsUI() {
    const s = App.Storage.getSettings();
    $("#soundsSwitch").classList.toggle("on", !!s.sounds);
    $("#soundsSwitch").setAttribute("aria-checked", String(!!s.sounds));
    $("#animationsSwitch").classList.toggle("on", !!s.animations);
    $("#animationsSwitch").setAttribute("aria-checked", String(!!s.animations));
    document.body.classList.toggle("no-animations", !s.animations);
  }

  /* -------------------------------- Dashboard --------------------------------- */
  function refreshDashboard() {
    const learned = App.Storage.getLearnedCount();
    const total = App.Verbs.length;
    const stats = App.Storage.getStats();
    const today = App.Storage.getTodayStats();
    $("#dashLearned").textContent = learned;
    $("#dashStreak").textContent = stats.streak;
    $("#dashPct").textContent = Math.round((learned / total) * 100) + "%";
    $("#dashAccuracyToday").textContent = today.accuracy === null ? "—" : today.accuracy + "%";
  }

  function refreshProgressView() {
    const learned = App.Storage.getLearnedCount();
    const stats = App.Storage.getStats();
    $("#statLearned").textContent = learned;
    $("#statAttempts").textContent = stats.totalAttempts;
    $("#statAccuracy").textContent = stats.totalAttempts
      ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) + "%" : "0%";
    $("#statStreak").textContent = stats.streak;
    refreshCharts();
    refreshErrorList();
    refreshAchievements();
  }

  function refreshCharts() {
    const learned = App.Storage.getLearnedCount();
    const total = App.Verbs.length;
    App.Charts.donutChart($("#chartDonut"), Math.round((learned / total) * 100));

    const stats = App.Storage.getStats();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      const entry = stats.history.find((h) => h.date === key);
      days.push({ label: d.toLocaleDateString("es-ES", { weekday: "short" }).slice(0, 2), value: entry ? entry.attempts : 0 });
    }
    App.Charts.barChart($("#chartWeekly"), days, { color: getComputedColor("--violet"), color2: getComputedColor("--coral") });

    const levels = ["A1", "A2", "B1", "B2"];
    const state = App.Storage.getState();
    const levelData = levels.map((lvl) => ({
      label: lvl,
      value: App.Verbs.filter((v) => v.level === lvl && state.progress[v.id] && state.progress[v.id].learned).length,
    }));
    App.Charts.barChart($("#chartLevel"), levelData, { color: getComputedColor("--teal"), color2: getComputedColor("--violet") });
  }
  function getComputedColor(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }

  function refreshErrorList() {
    const top = App.Storage.getTopErrors(6);
    const list = $("#errorList");
    list.innerHTML = "";
    if (!top.length) {
      list.appendChild(el("li", {}, ["Todavía no hay errores registrados. ¡Sigue así!"]));
      return;
    }
    top.forEach(([verbId, count]) => {
      const verb = App.Verbs.find((v) => v.id === verbId);
      if (!verb) return;
      list.appendChild(el("li", {}, [
        el("span", {}, [`${verb.infinitive} (${verb.pastSimple} · ${verb.pastParticiple})`]),
        el("span", { class: "text-muted" }, [`${count} error${count === 1 ? "" : "es"}`]),
      ]));
    });
  }

  /* ---------------------------- Solo mis errores ------------------------------ */
  function updateErrorsSetup() {
    const ids = App.Storage.getErrorVerbIds();
    const n = ids.length;
    $("#errorsSetupCount").textContent = n
      ? `Tienes ${n} verbo${n === 1 ? "" : "s"} distinto${n === 1 ? "" : "s"} con errores registrados.`
      : "";
    $("#errorsModeGrid").style.display = n ? "grid" : "none";
    $("#errorsEmptyState").style.display = n ? "none" : "block";
  }

  function startErrorsMode(mode) {
    const ids = App.Storage.getErrorVerbIds();
    if (!ids.length) { toast("Todavía no tienes errores registrados."); return; }
    switch (mode) {
      case "study":
        goto("view-study");
        App.Quiz.Study.start(null, ids);
        break;
      case "flash":
        goto("view-flashcards");
        App.Quiz.Flash.start(null, ids);
        break;
      case "test":
        testConfig.type = "mixed";
        testConfig.levels = null;
        testConfig.count = Math.min(20, Math.max(ids.length * 3, 5));
        testConfig.verbIds = ids;
        App.Quiz.Test.start(testConfig.type, testConfig.levels, testConfig.count, testConfig.verbIds);
        break;
      case "writing":
        goto("view-writing");
        App.Quiz.Writing.start(null, ids);
        break;
      case "listening":
        goto("view-listening");
        App.Quiz.Listening.start(null, ids);
        break;
      case "exam":
        examConfig.levels = null;
        examConfig.verbIds = ids;
        App.Quiz.Exam.start(examConfig.levels, examConfig.verbIds);
        break;
      default:
        break;
    }
  }

  function refreshAchievements() {
    const grid = $("#achGrid");
    grid.innerHTML = "";
    const unlockedCount = App.Achievements.all.filter((a) => App.Storage.isUnlocked(a.id)).length;
    $("#achProgressLabel").textContent = `${unlockedCount} / ${App.Achievements.all.length} desbloqueados`;
    App.Achievements.categories.forEach((cat) => {
      const items = App.Achievements.all.filter((a) => a.category === cat);
      if (!items.length) return;
      grid.appendChild(el("h3", { class: "ach-category-title" }, [cat]));
      const catGrid = el("div", { class: "ach-grid" });
      items.forEach((a) => {
        const unlocked = App.Storage.isUnlocked(a.id);
        const isHiddenSecret = a.secret && !unlocked;
        catGrid.appendChild(el("div", { class: `card ach-card ${unlocked ? "unlocked" : ""} ${isHiddenSecret ? "secret" : ""}` }, [
          el("div", { class: "ach-icon" }, [isHiddenSecret ? "❔" : a.icon]),
          el("div", { class: "ach-name" }, [isHiddenSecret ? "Logro secreto" : a.name]),
          el("div", { class: "ach-desc" }, [isHiddenSecret ? "Sigue practicando para descubrirlo…" : a.desc]),
        ]));
      });
      grid.appendChild(catGrid);
    });
  }
  App.UI2 = { refreshAchievements };

  /* -------------------------------- Library view ------------------------------- */
  function refreshLibrary() {
    const verbs = App.Filters.getFilteredVerbs();
    $("#libraryCount").textContent = `${verbs.length} de ${App.Verbs.length} verbos`;
    App.UI.renderVerbGrid($("#verbGrid"), verbs);
  }
  const debouncedLibraryRefresh = App.Utils.debounce(refreshLibrary, 180);

  /* -------------------------------- Nav / actions ------------------------------- */
  function goto(viewId) {
    showView(viewId);
    if (viewId === "view-library") refreshLibrary();
    if (viewId === "view-home") refreshDashboard();
    if (viewId === "view-progress") refreshProgressView();
    if (viewId === "view-exam-history") renderExamHistory();
  }

  /* ---------------------------- Historial de exámenes ------------------------- */
  function renderExamHistory() {
    const list = $("#examHistoryList");
    list.innerHTML = "";
    const results = App.Storage.getExamResults().slice().reverse();
    if (!results.length) {
      list.appendChild(el("p", { class: "text-muted" }, ["Todavía no has completado ningún examen."]));
      return;
    }
    results.forEach((r) => {
      const pct = r.total ? Math.round((r.score / r.total) * 100) : 0;
      const dateStr = new Date(r.date).toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
      const mins = Math.floor(r.seconds / 60).toString().padStart(2, "0");
      const secs = (r.seconds % 60).toString().padStart(2, "0");
      const card = el("div", { class: "card exam-history-card" }, [
        el("div", { class: "exam-history-top" }, [
          el("span", { class: "exam-history-score" }, [`${r.score} / ${r.total} (${pct}%)`]),
          el("span", { class: "exam-history-date" }, [dateStr]),
        ]),
        el("div", { class: "exam-history-meta" }, [`⏱ ${mins}:${secs} · Toca para revisar las preguntas`]),
      ]);
      card.addEventListener("click", () => {
        const wrap = el("div", {}, [
          el("h3", {}, [`Examen del ${dateStr}`]),
          el("p", { class: "text-muted mb-16" }, [`${r.score} / ${r.total} (${pct}%) · ${mins}:${secs}`]),
          (() => { const box = el("div", {}); App.UI.renderReview(box, r.review || []); return box; })(),
        ]);
        App.UI.openModal(wrap);
      });
      list.appendChild(card);
    });
  }

  function wireActions() {
    document.body.addEventListener("click", (e) => {
      const target = e.target.closest("[data-action]");
      if (!target) return;
      const action = target.dataset.action;
      switch (action) {
        case "nav": goto(target.dataset.view); break;
        case "start-study": goto("view-study"); App.Quiz.Study.start(); break;
        case "start-flash": goto("view-flashcards"); App.Quiz.Flash.start(); break;
        case "open-flash-setup": goto("view-flashcards-setup"); updateFlashSetupCount(); break;
        case "open-test-setup": goto("view-test-setup"); break;
        case "test-start": {
          const sel = getSelectionFor("test");
          testConfig.type = target.dataset.type;
          if (sel.verbIds) {
            if (!sel.verbIds.length) { toast("Tu selección personalizada está vacía. Añade verbos primero."); break; }
            testConfig.levels = null;
            testConfig.verbIds = sel.verbIds;
          } else {
            if (!sel.levels.length) { toast("Selecciona al menos un nivel."); break; }
            testConfig.levels = sel.levels;
            testConfig.verbIds = null;
          }
          App.Quiz.Test.start(testConfig.type, testConfig.levels, testConfig.count, testConfig.verbIds);
          break;
        }
        case "open-exam-intro": goto("view-exam-intro"); updateExamSetupCount(); break;
        case "open-study-setup": goto("view-study-setup"); updateStudySetupCount(); break;
        case "open-table-test-setup": goto("view-table-test-setup"); updateTableTestCount(); break;
        case "manage-custom-selection":
          customSelectionReturnView = target.dataset.return || "view-home";
          goto("view-custom-selection");
          renderCustomSelectionScreen();
          break;
        case "open-errors-setup": goto("view-errors-setup"); updateErrorsSetup(); break;
        case "errors-start": startErrorsMode(target.dataset.mode); break;
        case "start-writing": goto("view-writing"); App.Quiz.Writing.start(); break;
        case "open-writing-setup": goto("view-writing-setup"); updateWriteSetupCount(); break;
        case "start-listening": goto("view-listening"); App.Quiz.Listening.start(); break;
        case "open-listening-setup": goto("view-listening-setup"); updateListenSetupCount(); break;
        case "game-memory": goto("view-game-memory"); App.Games.Memory.start(); break;
        case "game-hangman": goto("view-game-hangman"); App.Games.Hangman.start(); break;
        case "game-order": goto("view-game-order"); App.Games.OrderLetters.start(); break;
        case "game-gaps": goto("view-game-gaps"); App.Games.FillGaps.start(); break;
        case "game-roulette": goto("view-game-roulette"); App.Games.Roulette.start(); break;
        default: break;
      }
    });
  }

  function wireLibrary() {
    $("#librarySearch").addEventListener("input", (e) => {
      App.Filters.setQuery(e.target.value);
      debouncedLibraryRefresh();
    });
    $$("#levelChips .filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$("#levelChips .filter-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        App.Filters.setLevel(chip.dataset.level);
        refreshLibrary();
      });
    });
    $$("#statusChips .filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$("#statusChips .filter-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        App.Filters.setStatus(chip.dataset.status);
        refreshLibrary();
      });
    });
  }

  /* ---------------------------- Selección: CEFR vs Personalizado (compartido) --- */
  const selectionModeState = {}; // prefix -> 'cefr' | 'custom'
  let customSelectionReturnView = "view-home";

  function wireSelectionTabs(prefix) {
    const tabsBox = $(`#${prefix}SelectionTabs`);
    if (!tabsBox) return;
    selectionModeState[prefix] = selectionModeState[prefix] || "cefr";
    $$(`#${prefix}SelectionTabs .filter-chip`).forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(`#${prefix}SelectionTabs .filter-chip`).forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        selectionModeState[prefix] = btn.dataset.tab;
        const cefrPanel = $(`#${prefix}CefrPanel`);
        const customPanel = $(`#${prefix}CustomPanel`);
        if (cefrPanel) cefrPanel.style.display = btn.dataset.tab === "cefr" ? "" : "none";
        if (customPanel) customPanel.style.display = btn.dataset.tab === "custom" ? "" : "none";
        if (btn.dataset.tab === "custom") updateCustomSummary(prefix);
        if (prefix === "games") applyGamesSelectionMode();
        if (SETUP_COUNT_UPDATERS[prefix]) SETUP_COUNT_UPDATERS[prefix]();
      });
    });
  }

  function getSelectionFor(prefix) {
    const mode = selectionModeState[prefix] || "cefr";
    if (mode === "custom") {
      return { levels: null, verbIds: App.Storage.getCustomSelection() };
    }
    return { levels: getCheckedLevels(`${prefix}LevelChecks`), verbIds: null };
  }

  /** Texto genérico de "X verbos disponibles", consciente de si la pestaña activa es CEFR o Personalizado. */
  function updateSetupCount(prefix, targetId) {
    const box = $(`#${targetId}`);
    if (!box) return;
    const mode = selectionModeState[prefix] || "cefr";
    if (mode === "custom") {
      const n = App.Storage.getCustomSelection().length;
      box.textContent = n
        ? `${n} verbo${n === 1 ? "" : "s"} en tu selección personalizada.`
        : "Tu selección personalizada está vacía. Elige verbos con el buscador de arriba.";
      return;
    }
    const levels = getCheckedLevels(`${prefix}LevelChecks`);
    const n = levels.length ? App.Verbs.filter((v) => levels.includes(v.level)).length : 0;
    box.textContent = `${n} verbos disponibles con esta selección.`;
  }

  const SETUP_COUNT_UPDATERS = {
    study: () => updateStudySetupCount(),
    flash: () => updateFlashSetupCount(),
    listen: () => updateListenSetupCount(),
    exam: () => updateExamSetupCount(),
    write: () => updateWriteSetupCount(),
    tableTest: () => updateTableTestCount(),
  };

  function updateCustomSummary(prefix) {
    const box = $(`#${prefix}CustomSummary`);
    if (!box) return;
    const ids = App.Storage.getCustomSelection();
    const n = ids.length;
    box.textContent = n ? `${n} verbo${n === 1 ? "" : "s"} seleccionado${n === 1 ? "" : "s"}.` : "Aún no has elegido ningún verbo.";
    const chipsBox = $(`#${prefix}CustomSummaryChips`);
    if (!chipsBox) return;
    chipsBox.innerHTML = "";
    if (!n) return;
    const verbs = App.Verbs.filter((v) => ids.includes(v.id));
    const MAX_SHOWN = 10;
    verbs.slice(0, MAX_SHOWN).forEach((v) => chipsBox.appendChild(el("span", {}, [v.infinitive])));
    if (verbs.length > MAX_SHOWN) {
      chipsBox.appendChild(el("span", { class: "more" }, [`+${verbs.length - MAX_SHOWN} más`]));
    }
  }

  function refreshAllCustomSummaries() {
    ["study", "flash", "test", "write", "listen", "exam", "tableTest", "games"].forEach(updateCustomSummary);
    Object.keys(SETUP_COUNT_UPDATERS).forEach((prefix) => SETUP_COUNT_UPDATERS[prefix]());
    applyGamesSelectionMode();
  }

  function applyGamesSelectionMode() {
    const mode = selectionModeState.games || "cefr";
    App.Filters.setGameSelectionMode(mode);
    if (mode === "cefr") App.Filters.setGameLevels(getCheckedLevels("gamesLevelChecks"));
  }

  /* ---------------------------- Pantalla de selección personalizada ------------ */
  let customSelectionFilter = "all"; // 'all' | 'selected'
  let customSelectionLevel = "all"; // 'all' | 'A1' | 'A2' | 'B1' | 'B2'

  function renderCustomSelectionScreen() {
    updateCustomSelectionCountBar();
    renderCustomSelectionGrid();
  }

  function updateCustomSelectionCountBar() {
    const n = App.Storage.getCustomSelection().length;
    $("#customSelectionCountBar").textContent = `${n} verbo${n === 1 ? "" : "s"} seleccionado${n === 1 ? "" : "s"}`;
  }

  function renderCustomSelectionGrid() {
    const query = App.Utils.normalize($("#customSelectionSearch").value);
    const selected = new Set(App.Storage.getCustomSelection());
    let verbs = App.Verbs;
    if (query) {
      verbs = verbs.filter((v) => [v.infinitive, v.pastSimple, v.pastParticiple, v.translation]
        .some((f) => App.Utils.normalize(f).includes(query)));
    }
    if (customSelectionFilter === "selected") verbs = verbs.filter((v) => selected.has(v.id));
    if (customSelectionLevel !== "all") verbs = verbs.filter((v) => v.level === customSelectionLevel);

    const grid = $("#customSelectionGrid");
    grid.innerHTML = "";
    if (!verbs.length) {
      grid.appendChild(el("div", { class: "empty-state" }, [
        document.createRange().createContextualFragment(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`),
        el("p", {}, ["No se encontraron verbos con esta búsqueda."]),
      ]));
      return;
    }
    const frag = document.createDocumentFragment();
    verbs.forEach((v) => {
      const picked = selected.has(v.id);
      const card = el("article", {
        class: `card verb-pick-card ${picked ? "picked" : ""}`,
        tabindex: "0", role: "button", "aria-label": `${picked ? "Quitar" : "Añadir"} ${v.infinitive} de tu selección`,
        onclick: () => {
          App.Storage.toggleCustomSelectionVerb(v.id);
          updateCustomSelectionCountBar();
          renderCustomSelectionGrid();
        },
        onkeydown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click(); } },
      }, [
        el("div", { class: "pick-top" }, [
          el("span", { class: "verb-chip" }, [v.level]),
          el("div", { class: "pick-checkbox" }, [picked ? "✓" : ""]),
        ]),
        App.UI.triad(v, { speakable: false }),
        el("p", { class: "verb-translation" }, [v.translation]),
      ]);
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  function wireCustomSelectionScreen() {
    $("#customSelectionSearch").addEventListener("input", App.Utils.debounce(renderCustomSelectionGrid, 150));
    $$("#customSelectionFilterChips .filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$("#customSelectionFilterChips .filter-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        customSelectionFilter = chip.dataset.filter;
        renderCustomSelectionGrid();
      });
    });
    $$("#customSelectionLevelChips .filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$("#customSelectionLevelChips .filter-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        customSelectionLevel = chip.dataset.level;
        renderCustomSelectionGrid();
      });
    });
    $("#customSelectionClearBtn").addEventListener("click", () => {
      App.Storage.clearCustomSelection();
      updateCustomSelectionCountBar();
      renderCustomSelectionGrid();
      toast("Selección personalizada vaciada");
    });
    $("#customSelectionBackBtn").addEventListener("click", () => {
      goto(customSelectionReturnView || "view-home");
      refreshAllCustomSummaries();
    });
  }

  /* ---------------------------- Study setup (niveles) --------------------------- */
  function getCheckedLevels(containerId) {
    return $$(`#${containerId} input[type="checkbox"]:checked`).map((i) => i.value);
  }
  function updateStudySetupCount() {
    updateSetupCount("study", "studySetupCount");
  }
  function wireStudySetup() {
    wireSelectionTabs("study");
    $$("#studyLevelChecks input").forEach((cb) => cb.addEventListener("change", updateStudySetupCount));
    $("#studySelectAllBtn").addEventListener("click", () => {
      $$("#studyLevelChecks input").forEach((cb) => (cb.checked = true));
      updateStudySetupCount();
    });
    $("#studySelectNoneBtn").addEventListener("click", () => {
      $$("#studyLevelChecks input").forEach((cb) => (cb.checked = false));
      updateStudySetupCount();
    });
    $("#studySetupStartBtn").addEventListener("click", () => {
      const sel = getSelectionFor("study");
      if (sel.verbIds) {
        if (!sel.verbIds.length) { toast("Tu selección personalizada está vacía. Añade verbos primero."); return; }
        goto("view-study");
        App.Quiz.Study.start(null, sel.verbIds);
        return;
      }
      if (!sel.levels.length) { toast("Selecciona al menos un nivel."); return; }
      goto("view-study");
      App.Quiz.Study.start(sel.levels);
    });
  }

  /* ---------------------------- Flashcards setup (niveles) --------------------- */
  function updateFlashSetupCount() {
    updateSetupCount("flash", "flashSetupCount");
  }
  function wireFlashSetup() {
    wireSelectionTabs("flash");
    $$("#flashLevelChecks input").forEach((cb) => cb.addEventListener("change", updateFlashSetupCount));
    $("#flashSelectAllBtn").addEventListener("click", () => {
      $$("#flashLevelChecks input").forEach((cb) => (cb.checked = true));
      updateFlashSetupCount();
    });
    $("#flashSelectNoneBtn").addEventListener("click", () => {
      $$("#flashLevelChecks input").forEach((cb) => (cb.checked = false));
      updateFlashSetupCount();
    });
    $("#flashSetupStartBtn").addEventListener("click", () => {
      const sel = getSelectionFor("flash");
      if (sel.verbIds) {
        if (!sel.verbIds.length) { toast("Tu selección personalizada está vacía. Añade verbos primero."); return; }
        goto("view-flashcards");
        App.Quiz.Flash.start(null, sel.verbIds);
        return;
      }
      if (!sel.levels.length) { toast("Selecciona al menos un nivel."); return; }
      goto("view-flashcards");
      App.Quiz.Flash.start(sel.levels);
    });
  }

  /* ---------------------------- Listening setup (niveles) --------------------- */
  function updateListenSetupCount() {
    updateSetupCount("listen", "listenSetupCount");
  }
  function wireListenSetup() {
    wireSelectionTabs("listen");
    $$("#listenLevelChecks input").forEach((cb) => cb.addEventListener("change", updateListenSetupCount));
    $("#listenSelectAllBtn").addEventListener("click", () => {
      $$("#listenLevelChecks input").forEach((cb) => (cb.checked = true));
      updateListenSetupCount();
    });
    $("#listenSelectNoneBtn").addEventListener("click", () => {
      $$("#listenLevelChecks input").forEach((cb) => (cb.checked = false));
      updateListenSetupCount();
    });
    $("#listenSetupStartBtn").addEventListener("click", () => {
      const sel = getSelectionFor("listen");
      if (sel.verbIds) {
        if (!sel.verbIds.length) { toast("Tu selección personalizada está vacía. Añade verbos primero."); return; }
        goto("view-listening");
        App.Quiz.Listening.start(null, sel.verbIds);
        return;
      }
      if (!sel.levels.length) { toast("Selecciona al menos un nivel."); return; }
      goto("view-listening");
      App.Quiz.Listening.start(sel.levels);
    });
  }

  /* ---------------------------- Table test (examen en tabla) --------------------- */
  const tableTestConfig = { count: 5, difficulty: "easy", levels: ["A1", "A2", "B1", "B2"], verbIds: null };
  function updateTableTestCount() {
    updateSetupCount("tableTest", "tableTestCount");
  }
  function wireTableTest() {
    wireSelectionTabs("tableTest");
    $$("#tableTestLevelChecks input").forEach((cb) => cb.addEventListener("change", updateTableTestCount));
    $$("#tableTestCountChips .filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$("#tableTestCountChips .filter-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        tableTestConfig.count = parseInt(chip.dataset.count, 10);
      });
    });
    $$("#tableTestDiffChips .filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$("#tableTestDiffChips .filter-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        tableTestConfig.difficulty = chip.dataset.diff;
      });
    });
    $("#tableTestStartBtn").addEventListener("click", () => {
      const sel = getSelectionFor("tableTest");
      if (sel.verbIds) {
        if (!sel.verbIds.length) { toast("Tu selección personalizada está vacía. Añade verbos primero."); return; }
        tableTestConfig.levels = null;
        tableTestConfig.verbIds = sel.verbIds;
      } else {
        if (!sel.levels.length) { toast("Selecciona al menos un nivel."); return; }
        tableTestConfig.levels = sel.levels;
        tableTestConfig.verbIds = null;
      }
      goto("view-table-test-play");
      App.Quiz.TableTest.generate(tableTestConfig.levels, tableTestConfig.count, tableTestConfig.difficulty, tableTestConfig.verbIds);
    });
    $("#tableTestCorrectBtn").addEventListener("click", () => App.Quiz.TableTest.correct());
    $("#tableTestRetryBtn").addEventListener("click", () => {
      const levels = tableTestConfig.verbIds ? null : (tableTestConfig.levels && tableTestConfig.levels.length ? tableTestConfig.levels : ["A1", "A2", "B1", "B2"]);
      App.Quiz.TableTest.generate(levels, tableTestConfig.count, tableTestConfig.difficulty, tableTestConfig.verbIds);
    });
  }

  function wireStudy() {
    $("#studyPrev").addEventListener("click", () => App.Quiz.Study.prev());
    $("#studyNext").addEventListener("click", () => App.Quiz.Study.next());
    $("#studyToggleTranslation").addEventListener("click", () => App.Quiz.Study.toggleTranslation());
    $("#studySpeak").addEventListener("click", () => App.Quiz.Study.speakCurrent());
  }

  function wireFlash() {
    $("#flashcard").addEventListener("click", () => App.Quiz.Flash.flip());
    $("#flashcard").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); App.Quiz.Flash.flip(); } });
    $("#flashcard").setAttribute("tabindex", "0");
    $("#flashcard").setAttribute("role", "button");
    $("#flashcard").setAttribute("aria-label", "Girar tarjeta");
    $("#flashPrev").addEventListener("click", () => App.Quiz.Flash.prev());
    $("#flashNext").addEventListener("click", () => App.Quiz.Flash.next());
  }

  function wireTest() {
    $("#testCheckBtn").addEventListener("click", () => App.Quiz.Test.checkWritten());
    $("#testWriteInput").addEventListener("keydown", (e) => { if (e.key === "Enter") App.Quiz.Test.checkWritten(); });
    $("#testNextBtn").addEventListener("click", () => App.Quiz.Test.next());
    $("#testRetryBtn").addEventListener("click", () => {
      goto("view-test-play");
      App.Quiz.Test.start(testConfig.type, testConfig.levels, testConfig.count, testConfig.verbIds);
    });
  }

  /* ---------------------------- Test setup (niveles + cantidad) --------------- */
  const testConfig = { type: "mcq", levels: ["A1", "A2", "B1", "B2"], count: 10, verbIds: null };
  function wireTestSetup() {
    $$("#testLevelChecks input").forEach((cb) => cb.addEventListener("change", () => {
      testConfig.levels = getCheckedLevels("testLevelChecks");
    }));
    $$("#testCountChips .filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$("#testCountChips .filter-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        testConfig.count = parseInt(chip.dataset.count, 10);
      });
    });
  }

  function wireExam() {
    $("#examStartBtn").addEventListener("click", () => {
      const sel = getSelectionFor("exam");
      if (sel.verbIds) {
        if (sel.verbIds.length < 5) {
          toast(`El examen necesita al menos 5 verbos distintos (tienes ${sel.verbIds.length}). Añade más en tu selección personalizada.`);
          return;
        }
        examConfig.levels = null;
        examConfig.verbIds = sel.verbIds;
        App.Quiz.Exam.start(null, sel.verbIds);
        return;
      }
      if (!sel.levels.length) { toast("Selecciona al menos un nivel."); return; }
      examConfig.levels = sel.levels;
      examConfig.verbIds = null;
      App.Quiz.Exam.start(sel.levels, null);
    });
    $("#examCheckBtn").addEventListener("click", () => App.Quiz.Exam.checkWritten());
    $("#examWriteInput").addEventListener("keydown", (e) => { if (e.key === "Enter") App.Quiz.Exam.checkWritten(); });
    $("#examRetryBtn").addEventListener("click", () => App.Quiz.Exam.start(examConfig.levels, examConfig.verbIds));
    window.addEventListener("beforeunload", (e) => {
      if (App.Quiz.Exam.active) { e.preventDefault(); e.returnValue = ""; }
    });
  }

  /* ---------------------------- Exam setup (niveles) -------------------------- */
  const examConfig = { levels: ["A1", "A2", "B1", "B2"], verbIds: null };
  function updateExamSetupCount() {
    updateSetupCount("exam", "examSetupCount");
  }
  function wireExamSetup() {
    wireSelectionTabs("exam");
    $$("#examLevelChecks input").forEach((cb) => cb.addEventListener("change", updateExamSetupCount));
    $("#examSelectAllBtn").addEventListener("click", () => {
      $$("#examLevelChecks input").forEach((cb) => (cb.checked = true));
      updateExamSetupCount();
    });
    $("#examSelectNoneBtn").addEventListener("click", () => {
      $$("#examLevelChecks input").forEach((cb) => (cb.checked = false));
      updateExamSetupCount();
    });
  }

  /* ---------------------------- Writing setup (niveles) --------------------- */
  function updateWriteSetupCount() {
    updateSetupCount("write", "writeSetupCount");
  }
  function wireWritingSetup() {
    wireSelectionTabs("write");
    $$("#writeLevelChecks input").forEach((cb) => cb.addEventListener("change", updateWriteSetupCount));
    $("#writeSelectAllBtn").addEventListener("click", () => {
      $$("#writeLevelChecks input").forEach((cb) => (cb.checked = true));
      updateWriteSetupCount();
    });
    $("#writeSelectNoneBtn").addEventListener("click", () => {
      $$("#writeLevelChecks input").forEach((cb) => (cb.checked = false));
      updateWriteSetupCount();
    });
    $("#writeSetupStartBtn").addEventListener("click", () => {
      const sel = getSelectionFor("write");
      if (sel.verbIds) {
        if (!sel.verbIds.length) { toast("Tu selección personalizada está vacía. Añade verbos primero."); return; }
        goto("view-writing");
        App.Quiz.Writing.start(null, sel.verbIds);
        return;
      }
      if (!sel.levels.length) { toast("Selecciona al menos un nivel."); return; }
      goto("view-writing");
      App.Quiz.Writing.start(sel.levels);
    });
  }

  function wireWriting() {
    $("#writeCheckBtn").addEventListener("click", () => { App.Quiz.Writing.check(); $("#writeCheckBtn").style.display = "none"; });
    $("#writeNextBtn").addEventListener("click", () => { App.Quiz.Writing.next(); $("#writeCheckBtn").style.display = "inline-flex"; });
  }

  function wireListening() {
    $("#listenPlayBtn").addEventListener("click", () => App.Quiz.Listening.play());
    $("#listenCheckBtn").addEventListener("click", () => { App.Quiz.Listening.check(); $("#listenCheckBtn").style.display = "none"; });
    $("#listenInput").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#listenCheckBtn").click(); });
    $("#listenNextBtn").addEventListener("click", () => { App.Quiz.Listening.next(); $("#listenCheckBtn").style.display = "inline-flex"; });
  }

  function wireGames() {
    $("#memoryRestartBtn").addEventListener("click", () => App.Games.Memory.start());
    $("#hangmanRestartBtn").addEventListener("click", () => App.Games.Hangman.start());
    $("#orderRestartBtn").addEventListener("click", () => App.Games.OrderLetters.start());
    $("#orderClearBtn").addEventListener("click", () => App.Games.OrderLetters.clear());
    $("#gapRestartBtn").addEventListener("click", () => App.Games.FillGaps.start());
    $("#gapCheckBtn").addEventListener("click", () => App.Games.FillGaps.check());
    $("#gapNextBtn").addEventListener("click", () => App.Games.FillGaps.next());

    $("#rouletteSpinBtn").addEventListener("click", () => App.Games.Roulette.spin());

    $$("#gamesLevelChecks input").forEach((cb) => cb.addEventListener("change", () => {
      App.Filters.setGameLevels(getCheckedLevels("gamesLevelChecks"));
    }));
    wireSelectionTabs("games");
    applyGamesSelectionMode();
  }

  function wireLearnedInfo() {
    $$(".learned-info-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const wrap = el("div", {}, [
          el("h3", {}, ["¿Qué es un verbo «aprendido»?"]),
          el("p", { class: "text-muted", html: 'Un verbo se considera <strong>aprendido</strong> cuando consigues <strong>3 aciertos más que fallos</strong> con él.' }),
          el("p", { class: "text-muted mt-16", html: 'Puedes practicarlo en cualquier modo: <strong>Estudio, Test, Examen, Escritura, Escucha o minijuegos</strong>.' }),
          el("p", { class: "text-muted mt-16" }, [el("strong", {}, ["Por ejemplo:"])]),
          el("ul", { class: "text-muted", style: "margin:8px 0 0 18px;padding:0;" }, [
            el("li", { html: '✅ 4 aciertos y ❌ 1 fallo → tienes <strong>3 aciertos de ventaja</strong> → <strong>aprendido</strong>' }),
            el("li", { html: '✅ 5 aciertos y ❌ 2 fallos → tienes <strong>3 aciertos de ventaja</strong> → <strong>aprendido</strong>' }),
          ]),
          el("p", { class: "text-muted mt-16", html: 'Una vez aprendido, el verbo <strong>no se pierde por un solo fallo</strong>. Seguirá apareciendo como aprendido mientras tengas al menos <strong>1 acierto de ventaja</strong>.' }),
          el("p", { class: "text-muted mt-16" }, [el("strong", {}, ["⚠️ ¿Cuándo deja de estar aprendido?"])]),
          el("p", { class: "text-muted", html: 'Si acumulas suficientes fallos y llegas a tener <strong>0 aciertos de ventaja o menos</strong>, el verbo dejará de estar aprendido.' }),
          el("p", { class: "text-muted", html: 'No pasa nada: <strong>solo tendrás que practicarlo de nuevo</strong> hasta conseguir 3 aciertos de ventaja.' }),
          el("div", { class: "modal-actions" }, [
            el("button", { class: "btn btn-primary", onclick: () => App.UI.closeModal() }, ["Entendido"]),
          ]),
        ]);
        App.UI.openModal(wrap);
      });
    });
  }

  function wireSettings() {
    $("#themeToggleBtn").addEventListener("click", toggleTheme);
    $("#darkModeSwitch").addEventListener("click", toggleTheme);
    $("#soundsSwitch").addEventListener("click", () => {
      const now = !App.Storage.getSettings().sounds;
      App.Storage.setSetting("sounds", now);
      applySettingsUI();
    });
    $("#animationsSwitch").addEventListener("click", () => {
      const now = !App.Storage.getSettings().animations;
      App.Storage.setSetting("animations", now);
      applySettingsUI();
    });
    $("#exportBtn").addEventListener("click", () => {
      const blob = new Blob([App.Storage.exportJSON()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `irregularverbs-progreso-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast("Progreso exportado");
    });
    $("#importFileInput").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          App.Storage.importJSON(reader.result);
          toast("Progreso importado correctamente");
          refreshDashboard(); refreshLibrary(); refreshAchievements();
        } catch (err) {
          toast("El archivo no es válido");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });
    $("#resetBtn").addEventListener("click", async () => {
      const ok = await confirmDialog("Resetear progreso", "Se borrarán todos tus datos: favoritos, verbos aprendidos, estadísticas y logros. Esta acción no se puede deshacer.", "Resetear");
      if (ok) {
        App.Storage.resetAll();
        applyTheme(); applySettingsUI(); refreshDashboard(); refreshLibrary(); refreshAchievements();
        toast("Progreso reseteado");
      }
    });
  }

  function wireModal() {
    $("#modalOverlay").addEventListener("click", (e) => { if (e.target.id === "modalOverlay") closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  }

  /* ------------------------ Teclado físico para Ahorcado / Ordenar letras --------- */
  function wireGameKeyboard() {
    document.addEventListener("keydown", (e) => {
      if ($("#modalOverlay").classList.contains("open")) return;
      const tag = document.activeElement && document.activeElement.tagName;
      const activeView = document.querySelector(".view.active");
      if (!activeView) return;

      // Teclas 1-4 para elegir una opción de test/examen tipo opción múltiple
      if ((activeView.id === "view-test-play" || activeView.id === "view-exam-play") && ["1", "2", "3", "4"].includes(e.key)) {
        const optBox = activeView.id === "view-test-play" ? $("#testOptions") : $("#examOptions");
        if (optBox.style.display === "none") return;
        const btns = App.UI.$$(".quiz-option", optBox);
        const idx = parseInt(e.key, 10) - 1;
        if (btns[idx] && !btns[idx].disabled) { e.preventDefault(); btns[idx].click(); }
        return;
      }

      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (activeView.id === "view-game-hangman") App.Games.Hangman.handleKey(e);
      else if (activeView.id === "view-game-order") App.Games.OrderLetters.handleKey(e);
    });
  }

  /* -------------------- Redibuja las gráficas si cambia el tamaño de ventana ------ */
  function wireChartResize() {
    const onResize = App.Utils.debounce(() => {
      const progressView = document.getElementById("view-progress");
      if (progressView && progressView.classList.contains("active")) refreshCharts();
    }, 200);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
  }

  /* --------------------------------- PWA --------------------------------------- */
  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {
          /* GitHub Pages sirve sobre https, pero en file:// el SW no está disponible: se ignora */
        });
      });
    }
  }

  /* --------------------------------- Init --------------------------------------- */
  function init() {
    applyTheme();
    applySettingsUI();
    wireActions();
    wireLibrary();
    wireCustomSelectionScreen();
    wireStudySetup();
    wireFlashSetup();
    wireListenSetup();
    wireWritingSetup();
    wireTestSetup();
    wireTableTest();
    wireStudy();
    wireFlash();
    wireTest();
    wireExam();
    wireExamSetup();
    wireWriting();
    wireListening();
    wireGames();
    wireGameKeyboard();
    wireLearnedInfo();
    wireSettings();
    wireModal();
    refreshDashboard();
    refreshLibrary();
    registerServiceWorker();
    wireChartResize();
    App.Achievements.check();
  }

  document.addEventListener("DOMContentLoaded", init);
})(window.App = window.App || {});
