/**
 * app.js
 * Punto de entrada: conecta todos los módulos con el DOM.
 */
(function (App) {
  "use strict";
  const { $, $$, el, showView, toast, confirmDialog, closeModal, speak } = App.UI;
  const t = App.I18n.t;

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
    App.I18n.applyStaticDom();
    const lang = App.I18n.getLang();
    $("#langBtnEs").classList.toggle("active", lang === "es");
    $("#langBtnEu").classList.toggle("active", lang === "eu");
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
      list.appendChild(el("li", {}, [t("app.noErrorsYet")]));
      return;
    }
    top.forEach(([verbId, count]) => {
      const verb = App.Verbs.find((v) => v.id === verbId);
      if (!verb) return;
      list.appendChild(el("li", {}, [
        el("span", {}, [`${verb.infinitive} (${verb.pastSimple} · ${verb.pastParticiple})`]),
        el("span", { class: "text-muted" }, [t("app.errorCount").replace("{count}", count).replace("{plural}", count === 1 ? "" : "es")]),
      ]));
    });
  }

  /* ---------------------------- Solo mis errores ------------------------------ */
  function updateErrorsSetup() {
    const ids = App.Storage.getErrorVerbIds();
    const n = ids.length;
    $("#errorsSetupCount").textContent = n
      ? t("app.errorsSetupCount").replace("{n}", n).replace(/{pluralN}/g, n === 1 ? "" : "s")
      : "";
    $("#errorsModeGrid").style.display = n ? "grid" : "none";
    $("#errorsEmptyState").style.display = n ? "none" : "block";
  }

  function startErrorsMode(mode) {
    const ids = App.Storage.getErrorVerbIds();
    if (!ids.length) { toast(t("app.noErrorsToastYet")); return; }
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

  const ACH_CATEGORY_KEYS = {
    "Primeros pasos": "cat.firstSteps",
    "Progreso": "cat.progress",
    "Verbos aprendidos": "cat.learnedVerbs",
    "Constancia": "cat.consistency",
    "Precisión": "cat.accuracy",
    "Por modos": "cat.byMode",
    "Dificultad": "cat.difficulty",
    "Logros especiales": "cat.special",
    "Los grandes": "cat.theGreats",
  };

  function refreshAchievements() {
    const grid = $("#achGrid");
    grid.innerHTML = "";
    const unlockedCount = App.Achievements.all.filter((a) => App.Storage.isUnlocked(a.id)).length;
    $("#achProgressLabel").textContent = App.I18n.t("progress.achUnlocked")
      .replace("{n}", unlockedCount).replace("{total}", App.Achievements.all.length);
    App.Achievements.categories.forEach((cat) => {
      const items = App.Achievements.all.filter((a) => a.category === cat);
      if (!items.length) return;
      grid.appendChild(el("h3", { class: "ach-category-title" }, [App.I18n.t(ACH_CATEGORY_KEYS[cat] || cat)]));
      const catGrid = el("div", { class: "ach-grid" });
      items.forEach((a) => {
        const unlocked = App.Storage.isUnlocked(a.id);
        const isHiddenSecret = a.secret && !unlocked;
        catGrid.appendChild(el("div", { class: `card ach-card ${unlocked ? "unlocked" : ""} ${isHiddenSecret ? "secret" : ""}` }, [
          el("div", { class: "ach-icon" }, [isHiddenSecret ? "❔" : a.icon]),
          el("div", { class: "ach-name" }, [isHiddenSecret ? App.I18n.t("ach.secretName") : App.I18n.t(`ach.${a.id}.name`)]),
          el("div", { class: "ach-desc" }, [isHiddenSecret ? App.I18n.t("ach.secretDesc") : App.I18n.t(`ach.${a.id}.desc`)]),
        ]));
      });
      grid.appendChild(catGrid);
    });
  }
  App.UI2 = { refreshAchievements };

  /* -------------------------------- Library view ------------------------------- */
  function refreshLibrary() {
    const verbs = App.Filters.getFilteredVerbs();
    $("#libraryCount").textContent = t("app.libraryCount").replace("{n}", verbs.length).replace("{total}", App.Verbs.length);
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
      list.appendChild(el("p", { class: "text-muted" }, [t("app.noExamsYet")]));
      return;
    }
    results.forEach((r) => {
      const pct = r.total ? Math.round((r.score / r.total) * 100) : 0;
      const dateStr = new Date(r.date).toLocaleString(App.I18n.getLang() === "eu" ? "eu-ES" : "es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
      const mins = Math.floor(r.seconds / 60).toString().padStart(2, "0");
      const secs = (r.seconds % 60).toString().padStart(2, "0");
      const card = el("div", { class: "card exam-history-card" }, [
        el("div", { class: "exam-history-top" }, [
          el("span", { class: "exam-history-score" }, [`${r.score} / ${r.total} (${pct}%)`]),
          el("span", { class: "exam-history-date" }, [dateStr]),
        ]),
        el("div", { class: "exam-history-meta" }, [t("app.examHistoryMeta").replace("{mins}", mins).replace("{secs}", secs)]),
      ]);
      card.addEventListener("click", () => {
        const wrap = el("div", {}, [
          el("h3", {}, [t("app.examOfDate").replace("{date}", dateStr)]),
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
            if (!sel.verbIds.length) { toast(t("app.emptyCustomSelectionAdd")); break; }
            testConfig.levels = null;
            testConfig.verbIds = sel.verbIds;
          } else {
            if (!sel.levels.length) { toast(t("app.selectAtLeastOneLevel")); break; }
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
        ? t("app.nVerbsInCustomSelection").replace("{n}", n).replace("{plural}", n === 1 ? "" : "s")
        : t("app.emptyCustomSelectionSearch");
      return;
    }
    const levels = getCheckedLevels(`${prefix}LevelChecks`);
    const n = levels.length ? App.Verbs.filter((v) => levels.includes(v.level)).length : 0;
    box.textContent = t("app.availableWithSelection").replace("{n}", n);
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
    box.textContent = n ? t("app.nVerbsSelectedDot").replace("{n}", n).replace(/{plural}/g, n === 1 ? "" : "s") : t("app.noVerbChosenYet");
    const chipsBox = $(`#${prefix}CustomSummaryChips`);
    if (!chipsBox) return;
    chipsBox.innerHTML = "";
    if (!n) return;
    const verbs = App.Verbs.filter((v) => ids.includes(v.id));
    const MAX_SHOWN = 10;
    verbs.slice(0, MAX_SHOWN).forEach((v) => chipsBox.appendChild(el("span", {}, [v.infinitive])));
    if (verbs.length > MAX_SHOWN) {
      chipsBox.appendChild(el("span", { class: "more" }, [t("app.moreChip").replace("{n}", verbs.length - MAX_SHOWN)]));
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
    $("#customSelectionCountBar").textContent = t("app.nVerbsSelectedBar").replace("{n}", n).replace(/{plural}/g, n === 1 ? "" : "s");
  }

  function renderCustomSelectionGrid() {
    const query = App.Utils.normalize($("#customSelectionSearch").value);
    const selected = new Set(App.Storage.getCustomSelection());
    let verbs = App.Verbs;
    if (query) {
      verbs = verbs.filter((v) => [v.infinitive, v.pastSimple, v.pastParticiple, v.translation, v.translationEu]
        .some((f) => App.Utils.normalize(f).includes(query)));
    }
    if (customSelectionFilter === "selected") verbs = verbs.filter((v) => selected.has(v.id));
    if (customSelectionLevel !== "all") verbs = verbs.filter((v) => v.level === customSelectionLevel);

    const grid = $("#customSelectionGrid");
    grid.innerHTML = "";
    if (!verbs.length) {
      grid.appendChild(el("div", { class: "empty-state" }, [
        document.createRange().createContextualFragment(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`),
        el("p", {}, [t("ui.noResultsFilters")]),
      ]));
      return;
    }
    const frag = document.createDocumentFragment();
    verbs.forEach((v) => {
      const picked = selected.has(v.id);
      const card = el("article", {
        class: `card verb-pick-card ${picked ? "picked" : ""}`,
        tabindex: "0", role: "button", "aria-label": `${picked ? t("ui.removeFromSelection") : t("ui.addToSelection")} (${v.infinitive})`,
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
        el("p", { class: "verb-translation" }, [App.VerbLang.translation(v)]),
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
      toast(t("app.customSelectionCleared"));
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
        if (!sel.verbIds.length) { toast(t("app.emptyCustomSelectionAdd")); return; }
        goto("view-study");
        App.Quiz.Study.start(null, sel.verbIds);
        return;
      }
      if (!sel.levels.length) { toast(t("app.selectAtLeastOneLevel")); return; }
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
        if (!sel.verbIds.length) { toast(t("app.emptyCustomSelectionAdd")); return; }
        goto("view-flashcards");
        App.Quiz.Flash.start(null, sel.verbIds);
        return;
      }
      if (!sel.levels.length) { toast(t("app.selectAtLeastOneLevel")); return; }
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
        if (!sel.verbIds.length) { toast(t("app.emptyCustomSelectionAdd")); return; }
        goto("view-listening");
        App.Quiz.Listening.start(null, sel.verbIds);
        return;
      }
      if (!sel.levels.length) { toast(t("app.selectAtLeastOneLevel")); return; }
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
        if (!sel.verbIds.length) { toast(t("app.emptyCustomSelectionAdd")); return; }
        tableTestConfig.levels = null;
        tableTestConfig.verbIds = sel.verbIds;
      } else {
        if (!sel.levels.length) { toast(t("app.selectAtLeastOneLevel")); return; }
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
          toast(t("app.examNeedMoreCustom").replace("{n}", sel.verbIds.length));
          return;
        }
        examConfig.levels = null;
        examConfig.verbIds = sel.verbIds;
        App.Quiz.Exam.start(null, sel.verbIds);
        return;
      }
      if (!sel.levels.length) { toast(t("app.selectAtLeastOneLevel")); return; }
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
        if (!sel.verbIds.length) { toast(t("app.emptyCustomSelectionAdd")); return; }
        goto("view-writing");
        App.Quiz.Writing.start(null, sel.verbIds);
        return;
      }
      if (!sel.levels.length) { toast(t("app.selectAtLeastOneLevel")); return; }
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
    $("#hangmanNextBtn").addEventListener("click", () => App.Games.Hangman.start());
    $("#orderRestartBtn").addEventListener("click", () => App.Games.OrderLetters.start());
    $("#orderClearBtn").addEventListener("click", () => App.Games.OrderLetters.clear());
    $("#orderNextBtn").addEventListener("click", () => App.Games.OrderLetters.start());
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
          el("h3", {}, [t("modal.learnedInfo.title")]),
          el("p", { class: "text-muted", html: t("modal.learnedInfo.p1") }),
          el("p", { class: "text-muted mt-16", html: t("modal.learnedInfo.p2") }),
          el("p", { class: "text-muted mt-16" }, [el("strong", {}, [t("modal.learnedInfo.p3label")])]),
          el("ul", { class: "text-muted", style: "margin:8px 0 0 18px;padding:0;" }, [
            el("li", { html: t("modal.learnedInfo.li1") }),
            el("li", { html: t("modal.learnedInfo.li2") }),
          ]),
          el("p", { class: "text-muted mt-16", html: t("modal.learnedInfo.p4") }),
          el("p", { class: "text-muted mt-16" }, [el("strong", {}, [t("modal.learnedInfo.p5label")])]),
          el("p", { class: "text-muted", html: t("modal.learnedInfo.p6") }),
          el("p", { class: "text-muted", html: t("modal.learnedInfo.p7") }),
          el("div", { class: "modal-actions" }, [
            el("button", { class: "btn btn-primary", onclick: () => App.UI.closeModal() }, [t("modal.learnedInfo.btn")]),
          ]),
        ]);
        App.UI.openModal(wrap);
      });
    });
  }

  function wireSettings() {
    $("#themeToggleBtn").addEventListener("click", toggleTheme);
    $("#darkModeSwitch").addEventListener("click", toggleTheme);
    $("#langBtnEs").addEventListener("click", () => { App.I18n.setLang("es"); applySettingsUI(); });
    $("#langBtnEu").addEventListener("click", () => { App.I18n.setLang("eu"); applySettingsUI(); });
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
      toast(t("app.progressExported"));
    });
    $("#importFileInput").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          App.Storage.importJSON(reader.result);
          toast(t("app.progressImported"));
          refreshDashboard(); refreshLibrary(); refreshAchievements();
        } catch (err) {
          toast(t("app.invalidFile"));
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });
    $("#resetBtn").addEventListener("click", async () => {
      const ok = await confirmDialog(t("app.resetProgressTitle"), t("app.resetProgressMsg"), t("app.resetProgressConfirm"));
      if (ok) {
        App.Storage.resetAll();
        applyTheme(); applySettingsUI(); refreshDashboard(); refreshLibrary(); refreshAchievements();
        toast(t("app.progressReset"));
      }
    });
  }

  function wireModal() {
    $("#modalOverlay").addEventListener("click", (e) => { if (e.target.id === "modalOverlay") closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  }

  /* -------------------------- Onboarding de idioma ----------------------------- */
  // Se muestra solo la primera vez que se entra en la app (sin progreso previo
  // guardado). No se puede cerrar sin elegir: no tiene overlay-click ni Escape.
  function wireLangOnboarding() {
    if (!App.Storage.isFreshInstall()) return;
    const overlay = $("#langOnboarding");
    overlay.classList.add("open");
    const choose = (lang) => {
      App.I18n.setLang(lang);
      App.Storage.setSetting("langChosen", true);
      overlay.classList.remove("open");
      applySettingsUI();
    };
    $("#onboardingBtnEs").addEventListener("click", () => choose("es"));
    $("#onboardingBtnEu").addEventListener("click", () => choose("eu"));
  }

  // Los textos estáticos (data-i18n) se retraducen solos en setLang(), pero el
  // grid de verbos, la selección personalizada y un detalle de verbo abierto
  // se pintan con JS a partir de App.VerbLang, así que hay que refrescarlos
  // a mano cuando cambia el idioma desde Ajustes (no solo en la carga inicial).
  function wireLangChangeRefresh() {
    document.addEventListener("app:langchange", () => {
      App.UI.closeModal();
      const activeView = document.querySelector(".view.active");
      const activeId = activeView ? activeView.id : null;
      if (activeId === "view-library") refreshLibrary();
      if (activeId === "view-custom-selection") renderCustomSelectionGrid();
    });
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
    wireLangOnboarding();
    wireLangChangeRefresh();
    refreshDashboard();
    refreshLibrary();
    registerServiceWorker();
    wireChartResize();
    App.Achievements.check();
  }

  document.addEventListener("DOMContentLoaded", init);
})(window.App = window.App || {});
