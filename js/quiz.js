/**
 * quiz.js
 * Motor de los modos: Estudio, Flashcards, Test, Examen, Escritura y Escucha.
 */
(function (App) {
  "use strict";
  const { $, el, toast, speak, playTone } = App.UI;

  const t = App.I18n.t;
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function sample(arr, n) { return shuffle(arr).slice(0, n); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function currentPool() {
    // Respeta los filtros activos del listado (nivel / favoritos / aprendidos / pendientes)
    return App.Filters.getFilteredVerbs();
  }

  /**
   * Resuelve la lista base de verbos para un modo de práctica.
   * - Si se pasa `verbIds` (p.ej. desde "Solo mis errores"), se usa EXCLUSIVAMENTE
   *   esa lista, sin caer nunca de vuelta a toda la base (eso rompería el propósito
   *   del modo "solo errores").
   * - Si no, se comporta igual que siempre: por niveles, o por los filtros de la biblioteca.
   */
  function resolveBase(levels, verbIds) {
    if (verbIds && verbIds.length) {
      const set = new Set(verbIds);
      return App.Verbs.filter((v) => set.has(v.id));
    }
    return levels && levels.length ? App.Verbs.filter((v) => levels.includes(v.level)) : currentPool();
  }

  /* =========================================================================
     MODO ESTUDIO
     ========================================================================= */
  const Study = {
    list: [],
    index: 0,
    showTranslation: false,

    /** @param {string[]} [levels] Si se indica, ignora los filtros de la biblioteca y usa solo estos niveles CEFR. */
    start(levels, verbIds) {
      const base = resolveBase(levels, verbIds);
      this.list = shuffle(base);
      this.index = 0;
      this.showTranslation = false;
      if (!this.list.length) { toast(t("quiz.noVerbsSelection")); return; }
      this.render();
    },
    render() {
      const verb = this.list[this.index];
      if (!verb) return;
      $("#studyWord").textContent = verb.infinitive;
      $("#studyIpa").textContent = `/${verb.ipa.infinitive}/ → /${verb.ipa.pastSimple}/ → /${verb.ipa.pastParticiple}/`;
      $("#studyTranslation").textContent = this.showTranslation ? App.VerbLang.translation(verb) : t("study.showTranslation");
      $("#studyTranslation").style.opacity = this.showTranslation ? "1" : "0.5";
      $("#studyExample").innerHTML = `<strong>${verb.example.en}</strong><br>${App.VerbLang.exampleEs(verb)}`;
      $("#studyMistake").textContent = "⚠️ " + App.VerbLang.mistake(verb);
      const pct = Math.round(((this.index + 1) / this.list.length) * 100);
      $("#studyProgressFill").style.width = pct + "%";
      $("#studyProgressLabel").textContent = `${this.index + 1} / ${this.list.length}`;
      App.UI.triad(verb); // no-op render helper reused elsewhere
      $("#studyTriadHost").innerHTML = "";
      $("#studyTriadHost").appendChild(App.UI.triad(verb));
      $("#studyPrev").disabled = this.index === 0;
    },
    next() {
      if (this.index < this.list.length - 1) { this.index++; this.showTranslation = false; this.render(); }
      else { toast(t("quiz.studyDone")); App.Storage.recordSessionResult("study", null, 0); App.Achievements.check(); }
    },
    prev() {
      if (this.index > 0) { this.index--; this.showTranslation = false; this.render(); }
    },
    toggleTranslation() {
      this.showTranslation = !this.showTranslation;
      this.render();
    },
    speakCurrent() {
      const v = this.list[this.index];
      if (v) speak(v.infinitive);
    },
  };

  /* =========================================================================
     MODO FLASHCARDS
     ========================================================================= */
  const Flash = {
    list: [], index: 0,
    start(levels, verbIds) {
      const base = resolveBase(levels, verbIds);
      this.list = shuffle(base);
      this.index = 0;
      if (!this.list.length) { toast(t("quiz.noVerbsSelection")); return; }
      $("#flashcard").classList.remove("flipped");
      this.render();
    },
    render() {
      const v = this.list[this.index];
      if (!v) return;
      $("#flashFront").innerHTML = `<div>${v.infinitive}</div><div class="text-muted" style="font-size:1rem;font-family:var(--font-mono)">/${v.ipa.infinitive}/</div>`;
      $("#flashBack").innerHTML = "";
      $("#flashBack").appendChild(App.UI.triad(v));
      $("#flashBack").appendChild(el("p", { class: "mt-16" }, [App.VerbLang.translation(v)]));
      $("#flashBack").appendChild(el("p", { class: "text-muted", style: "font-size:0.85rem" }, [v.example.en]));
      $("#flashProgress").textContent = `${this.index + 1} / ${this.list.length}`;
    },
    flip() { $("#flashcard").classList.toggle("flipped"); },
    next() {
      $("#flashcard").classList.remove("flipped");
      if (this.index < this.list.length - 1) { this.index++; this.render(); }
      else { toast(t("quiz.flashDone")); App.Storage.recordSessionResult("flash", null, 0); App.Achievements.check(); }
    },
    prev() {
      $("#flashcard").classList.remove("flipped");
      if (this.index > 0) { this.index--; this.render(); }
    },
  };

  /* =========================================================================
     MODO TEST
     ========================================================================= */
  const Test = {
    questions: [], index: 0, current: null, score: 0, results: [], type: "mixed", answered: false,
    levels: ["A1", "A2", "B1", "B2"], count: 10, total: 10,

    start(type, levels, count, verbIds) {
      this.type = type || "mixed";
      this.levels = (levels && levels.length) ? levels : ["A1", "A2", "B1", "B2"];
      this.count = count || 10;
      let base = resolveBase(this.levels, verbIds);
      if (base.length < 4 && !(verbIds && verbIds.length)) base = App.Verbs.slice();
      if (!base.length) { toast(t("quiz.noVerbsAvailable")); return; }
      let pickList = shuffle(base);
      while (pickList.length < this.count) pickList = pickList.concat(shuffle(base));
      this.questions = pickList.slice(0, this.count).map((verb) => ({ verb, qtype: this.resolveType() }));
      this.total = this.count; // nº de preguntas distintas a responder (fijo, no cambia al saltar)
      this.index = 0; this.score = 0; this.results = []; this.answered = false;
      App.UI.showView("view-test-play");
      this.renderQuestion();
    },
    resolveType() {
      if (this.type !== "mixed") return this.type;
      return pick(["mcq", "writePast", "writeParticiple", "writeTranslation"]);
    },
    renderQuestion() {
      if (this.index >= this.questions.length) return this.finish();
      this.answered = false;
      this.current = this.questions[this.index];
      const { verb, qtype } = this.current;
      $("#testProgress").textContent = t("quiz.questionCounter").replace("{n}", this.results.length + 1).replace("{total}", this.total);
      $("#testScore").textContent = `${this.score} / ${this.results.length}`;
      $("#testFeedback").className = "quiz-feedback";
      $("#testFeedback").textContent = "";
      const qBox = $("#testQuestion");
      const optBox = $("#testOptions");
      optBox.innerHTML = "";
      $("#testWriteRow").style.display = "none";
      $("#testOptions").style.display = "grid";
      $("#testNextBtn").textContent = t("quiz.skipQuestion");

      if (qtype === "mcq") {
        qBox.querySelector(".qtext").textContent = t("quiz.mcqQuestion").replace("{verb}", verb.infinitive);
        qBox.querySelector(".qhint").textContent = App.VerbLang.translation(verb);
        const options = App.Utils.smartVerbOptions(verb, "pastSimple");
        options.forEach((opt) => {
          optBox.appendChild(el("button", {
            class: "quiz-option",
            onclick: (e) => this.answerMCQ(e.currentTarget, opt === verb.pastSimple, verb),
          }, [opt]));
        });
      } else {
        $("#testOptions").style.display = "none";
        $("#testWriteRow").style.display = "flex";
        const map = {
          writePast: { label: t("quiz.writePastLabel").replace("{verb}", verb.infinitive), answer: verb.pastSimple },
          writeParticiple: { label: t("quiz.writeParticipleLabel").replace("{verb}", verb.infinitive), answer: verb.pastParticiple },
          writeTranslation: { label: t("quiz.writeTranslationLabel").replace("{verb}", verb.infinitive), answer: App.VerbLang.translation(verb) },
        };
        const conf = map[qtype];
        qBox.querySelector(".qtext").textContent = conf.label;
        qBox.querySelector(".qhint").textContent = t("quiz.writeHint");
        $("#testWriteInput").value = "";
        $("#testWriteInput").focus();
        this._writeAnswer = conf.answer;
      }
    },
    answerMCQ(btn, correct, verb) {
      if (this.answered) return;
      this.answered = true;
      if (correct) this.score++;
      App.UI.$$(".quiz-option", $("#testOptions")).forEach((b) => {
        if (b.textContent === verb.pastSimple) b.classList.add("correct");
        else if (b === btn) b.classList.add("incorrect");
        b.disabled = true;
      });
      this.results.push({ infinitive: verb.infinitive, given: btn.textContent, correct, correctVal: verb.pastSimple });
      this.showFeedback(correct, verb);
      App.Storage.recordAnswer(verb.id, correct);
    },
    checkWritten() {
      if (this.answered) return;
      const { verb } = this.current;
      const rawVal = $("#testWriteInput").value;
      const correct = App.Utils.answersMatch(rawVal, this._writeAnswer);
      this.answered = true;
      if (correct) this.score++;
      this.results.push({ infinitive: verb.infinitive, given: rawVal || t("quiz.emptyAnswer"), correct, correctVal: this._writeAnswer });
      this.showFeedback(correct, verb, this._writeAnswer);
      App.Storage.recordAnswer(verb.id, correct);
    },
    showFeedback(correct, verb, correctText) {
      const box = $("#testFeedback");
      box.classList.add("show", correct ? "ok" : "bad");
      playTone(correct ? "correct" : "incorrect");
      if (correct) {
        box.textContent = t("quiz.correctFeedback");
      } else {
        box.innerHTML = t("quiz.incorrectFeedback").replace("{answer}", correctText || verb.pastSimple).replace("{mistake}", App.VerbLang.mistake(verb));
      }
      $("#testScore").textContent = `${this.score} / ${this.results.length}`;
      $("#testNextBtn").textContent = t("test.nextQuestion");
    },
    next() {
      if (!this.answered) {
        // Se saltó sin responder: se vuelve a colocar al final para preguntarla de nuevo más tarde
        this.questions.push(this.current);
      }
      this.index++;
      this.renderQuestion();
    },
    finish() {
      const total = this.total;
      const pct = total ? Math.round((this.score / total) * 100) : 0;
      $("#testResultScore").textContent = `${this.score} / ${total}`;
      $("#testResultPct").textContent = `${pct}%`;
      App.UI.renderReview($("#testReview"), this.results);
      App.Storage.recordSessionResult("test", this.score, total);
      App.UI.showView("view-test-result");
      App.Achievements.check();
    },
  };

  /* =========================================================================
     MODO EXAMEN (50 preguntas + cronómetro)
     ========================================================================= */
  const Exam = {
    questions: [], index: 0, score: 0, errors: [], results: [], seconds: 0, timerHandle: null, active: false,

    start(levels, verbIds) {
      const base = resolveBase(levels, verbIds);
      const pool = base.length >= 5 ? base : (verbIds && verbIds.length ? base : currentPool());
      if (pool.length < 5) {
        toast(verbIds && verbIds.length
          ? t("quiz.examNeedErrors").replace("{n}", pool.length)
          : t("quiz.examNeedMore"));
        return;
      }
      const count = Math.min(50, pool.length * 3);
      const baseQuestions = [];
      while (baseQuestions.length < count) baseQuestions.push(...shuffle(pool));
      this.questions = baseQuestions.slice(0, count).map((verb) => ({
        verb, qtype: pick(["mcq", "writePast", "writeParticiple"]),
      }));
      this.index = 0; this.score = 0; this.errors = []; this.results = []; this.seconds = 0; this.active = true;
      App.UI.showView("view-exam-play");
      clearInterval(this.timerHandle);
      this.timerHandle = setInterval(() => { this.seconds++; $("#examTimer").textContent = this.formatTime(this.seconds); }, 1000);
      this.renderQuestion();
    },
    formatTime(s) {
      const m = Math.floor(s / 60).toString().padStart(2, "0");
      const ss = (s % 60).toString().padStart(2, "0");
      return `${m}:${ss}`;
    },
    renderQuestion() {
      const q = this.questions[this.index];
      if (!q) return this.finish();
      $("#examProgress").textContent = t("quiz.questionCounter").replace("{n}", this.index + 1).replace("{total}", this.questions.length);
      $("#examProgressFill").style.width = `${((this.index) / this.questions.length) * 100}%`;
      const qBox = $("#examQuestion");
      const optBox = $("#examOptions");
      optBox.innerHTML = "";
      $("#examWriteRow").style.display = q.qtype === "mcq" ? "none" : "flex";
      optBox.style.display = q.qtype === "mcq" ? "grid" : "none";

      if (q.qtype === "mcq") {
        qBox.querySelector(".qtext").textContent = t("quiz.mcqQuestion").replace("{verb}", q.verb.infinitive);
        const options = App.Utils.smartVerbOptions(q.verb, "pastSimple");
        options.forEach((opt) => optBox.appendChild(el("button", {
          class: "quiz-option", onclick: (e) => this.answer(opt === q.verb.pastSimple, opt),
        }, [opt])));
      } else {
        const label = q.qtype === "writePast" ? t("quiz.writePastLabelShort") : t("quiz.writeParticipleLabelShort");
        qBox.querySelector(".qtext").textContent = t("quiz.writeFormLabel").replace("{form}", label).replace("{verb}", q.verb.infinitive);
        $("#examWriteInput").value = "";
        $("#examWriteInput").focus();
      }
      qBox.querySelector(".qhint").textContent = App.VerbLang.translation(q.verb);
    },
    answer(correct, given) {
      const q = this.questions[this.index];
      const correctVal = q.qtype === "writePast" ? q.verb.pastSimple : q.qtype === "writeParticiple" ? q.verb.pastParticiple : q.verb.pastSimple;
      if (correct) this.score++;
      else this.errors.push({ verb: q.verb, qtype: q.qtype, given });
      this.results.push({ infinitive: q.verb.infinitive, given, correct, correctVal });
      App.Storage.recordAnswer(q.verb.id, correct);
      this.index++;
      this.renderQuestion();
    },
    checkWritten() {
      const q = this.questions[this.index];
      const answer = q.qtype === "writePast" ? q.verb.pastSimple : q.verb.pastParticiple;
      const correct = App.Utils.answersMatch($("#examWriteInput").value, answer);
      this.answer(correct, $("#examWriteInput").value || t("quiz.emptyAnswer"));
    },
    finish() {
      clearInterval(this.timerHandle);
      this.active = false;
      const total = this.questions.length;
      const pct = Math.round((this.score / total) * 100);
      App.Storage.addExamResult({
        date: new Date().toISOString(), score: this.score, total, seconds: this.seconds,
        review: this.results,
      });
      App.Storage.recordSessionResult("exam", this.score, total);
      $("#examResultScore").textContent = `${this.score} / ${total} (${pct}%)`;
      $("#examResultTime").textContent = this.formatTime(this.seconds);
      App.UI.renderReview($("#examReview"), this.results);
      App.UI.showView("view-exam-result");
      App.Achievements.check();
    },
  };

  /* =========================================================================
     MODO ESCRITURA (escribir las 3 formas)
     ========================================================================= */
  const Writing = {
    list: [], index: 0, score: 0,
    start(levels, verbIds) {
      const base = resolveBase(levels, verbIds);
      this.list = shuffle(base);
      this.index = 0; this.score = 0;
      if (!this.list.length) { toast(t("quiz.noVerbsSelection")); return; }
      this.render();
    },
    render() {
      const v = this.list[this.index];
      $("#writeTranslationHint").textContent = App.VerbLang.translation(v);
      $("#writeInfinitiveLabel").textContent = v.infinitive;
      $("#writePastInput").value = "";
      $("#writeParticipleInput").value = "";
      $("#writeThirdInput").value = "";
      $("#writeThirdLabel").textContent = t("writing.translation");
      $("#writeFeedback").className = "quiz-feedback";
      $("#writeFeedback").textContent = "";
      $("#writeProgress").textContent = `${this.index + 1} / ${this.list.length} · Aciertos: ${this.score}`;
      $("#writePastInput").focus();
    },
    check() {
      const v = this.list[this.index];
      const norm = App.Utils.normalize;
      const pastOk = App.Utils.answersMatch($("#writePastInput").value, v.pastSimple);
      const partOk = App.Utils.answersMatch($("#writeParticipleInput").value, v.pastParticiple);
      const transOk = App.Utils.answersMatch($("#writeThirdInput").value, App.VerbLang.translation(v));
      const allOk = pastOk && partOk && transOk;
      App.Storage.recordAnswer(v.id, allOk);
      if (allOk) this.score++;
      playTone(allOk ? "correct" : "incorrect");
      const box = $("#writeFeedback");
      box.classList.add("show", allOk ? "ok" : "bad");
      const mark = (ok) => (ok ? "✅" : "❌");
      box.innerHTML = allOk
        ? t("quiz.writingAllCorrect")
        : t("quiz.writingResultTemplate")
            .replace("{markPast}", mark(pastOk)).replace("{past}", v.pastSimple)
            .replace("{markPart}", mark(partOk)).replace("{part}", v.pastParticiple)
            .replace("{markTrans}", mark(transOk)).replace("{trans}", App.VerbLang.translation(v));
      $("#writeInputs").querySelectorAll("input").forEach((i) => (i.disabled = true));
      $("#writeNextBtn").style.display = "inline-flex";
    },
    next() {
      $("#writeNextBtn").style.display = "none";
      $("#writeInputs").querySelectorAll("input").forEach((i) => (i.disabled = false));
      if (this.index < this.list.length - 1) { this.index++; this.render(); }
      else {
        toast(t("quiz.writingDone"));
        App.Storage.recordSessionResult("writing", this.score, this.list.length);
        App.Achievements.check();
      }
    },
  };

  /* =========================================================================
     MODO ESCUCHA
     ========================================================================= */
  const Listening = {
    list: [], index: 0, score: 0, field: "infinitive",
    FIELD_LABELS: {
      infinitive: "quiz.listenFieldInfinitive",
      pastSimple: "quiz.listenFieldPast",
      pastParticiple: "quiz.listenFieldParticiple",
    },
    start(levels, verbIds) {
      const base = resolveBase(levels, verbIds);
      this.list = shuffle(base);
      this.index = 0; this.score = 0;
      if (!this.list.length) { toast(t("quiz.noVerbsSelection")); return; }
      this.render();
    },
    render() {
      this.field = pick(["infinitive", "pastSimple", "pastParticiple"]);
      $("#listenInput").value = "";
      $("#listenInput").disabled = false;
      $("#listenFeedback").className = "quiz-feedback";
      $("#listenFeedback").textContent = "";
      $("#listenProgress").textContent = t("quiz.listeningProgress").replace("{n}", this.index + 1).replace("{total}", this.list.length).replace("{score}", this.score);
      $("#listenFormHint").textContent = t("quiz.listeningFormHint").replace("{field}", t(this.FIELD_LABELS[this.field]));
      $("#listenNextBtn").style.display = "none";
      this.play();
    },
    play() {
      const v = this.list[this.index];
      speak(v[this.field]);
    },
    check() {
      const v = this.list[this.index];
      const answer = v[this.field];
      const ok = App.Utils.answersMatch($("#listenInput").value, answer);
      App.Storage.recordAnswer(v.id, ok);
      if (ok) this.score++;
      playTone(ok ? "correct" : "incorrect");
      const box = $("#listenFeedback");
      box.classList.add("show", ok ? "ok" : "bad");
      box.innerHTML = ok ? t("quiz.listeningCorrect") : t("quiz.listeningWrong").replace("{answer}", answer).replace("{field}", t(this.FIELD_LABELS[this.field])).replace("{verb}", v.infinitive);
      $("#listenInput").disabled = true;
      $("#listenNextBtn").style.display = "inline-flex";
    },
    next() {
      if (this.index < this.list.length - 1) { this.index++; this.render(); }
      else {
        toast(t("quiz.listeningDone"));
        App.Storage.recordSessionResult("listening", this.score, this.list.length);
        App.Achievements.check();
      }
    },
  };

  /* =========================================================================
     EXAMEN EN TABLA — nivel(es) + nº de preguntas + dificultad (huecos/fila)
     ========================================================================= */
  const COLUMNS = [
    { key: "infinitive", labelKey: "common.infinitive", get: (v) => v.infinitive },
    { key: "pastSimple", labelKey: "common.pastSimple", get: (v) => v.pastSimple },
    { key: "pastParticiple", labelKey: "common.participle", get: (v) => v.pastParticiple },
    { key: "translation", labelKey: "common.translation", get: (v) => App.VerbLang.translation(v) },
  ];
  const DIFF_BLANKS = { easy: 1, medium: 2, hard: 3 };

  const TableTest = {
    rows: [], corrected: false,

    generate(levels, count, difficulty, verbIds) {
      this.difficulty = difficulty;
      let base = resolveBase(levels, verbIds);
      if (base.length < 4 && !(verbIds && verbIds.length)) base = App.Verbs.slice();
      if (!base.length) { toast(t("quiz.noVerbsAvailable")); return; }
      let pickList = shuffle(base);
      while (pickList.length < count) pickList = pickList.concat(shuffle(base));
      const chosen = pickList.slice(0, count);
      const blanksCount = DIFF_BLANKS[difficulty] || 1;

      this.rows = chosen.map((verb) => {
        const cols = shuffle(COLUMNS.map((c) => c.key)).slice(0, blanksCount);
        return { verb, blanked: new Set(cols) };
      });
      this.corrected = false;
      this.render();
    },

    render() {
      const tbody = $("#tableTestBody");
      tbody.innerHTML = "";
      this.rows.forEach((row, rowIdx) => {
        const tr = el("tr", {});
        COLUMNS.forEach((col) => {
          const isBlank = row.blanked.has(col.key);
          if (isBlank) {
            tr.appendChild(el("td", {}, [
              el("div", { class: "cell-answer-wrap" }, [
                el("input", { type: "text", autocomplete: "off", "data-row": String(rowIdx), "data-col": col.key, placeholder: t(col.labelKey) }),
                el("span", { class: "cell-hint", "data-hint-row": String(rowIdx), "data-hint-col": col.key }),
              ]),
            ]));
          } else {
            tr.appendChild(el("td", { class: "given-cell" }, [col.get(row.verb)]));
          }
        });
        tbody.appendChild(tr);
      });
      $("#tableTestMeta").textContent = t("tableTest.questionsCount").replace("{n}", this.rows.length);
      $("#tableTestResultBox").style.display = "none";
    },

    correct() {
      if (this.corrected) return;
      this.corrected = true;
      let correctCells = 0, totalCells = 0;
      this.rows.forEach((row, rowIdx) => {
        let rowOk = true;
        row.blanked.forEach((colKey) => {
          const col = COLUMNS.find((c) => c.key === colKey);
          const input = document.querySelector(`input[data-row="${rowIdx}"][data-col="${colKey}"]`);
          const hint = document.querySelector(`[data-hint-row="${rowIdx}"][data-hint-col="${colKey}"]`);
          if (!input) return;
          totalCells++;
          const correctVal = col.get(row.verb);
          const ok = App.Utils.answersMatch(input.value, correctVal);
          input.classList.add(ok ? "cell-correct" : "cell-incorrect");
          input.disabled = true;
          if (ok) correctCells++;
          else {
            rowOk = false;
            if (hint) hint.textContent = t("tableTest.correctHint").replace("{value}", correctVal);
          }
        });
        App.Storage.recordAnswer(row.verb.id, rowOk);
      });
      const pct = totalCells ? Math.round((correctCells / totalCells) * 100) : 0;
      App.Storage.recordSessionResult("test", correctCells, totalCells);
      if (this.difficulty === "hard") App.Storage.recordHardExerciseResult(pct);
      const box = $("#tableTestResultBox");
      box.style.display = "block";
      box.innerHTML = `<h3 style="font-family:var(--font-display);margin-bottom:6px;">${t("tableTest.resultTitle2").replace("{correct}", correctCells).replace("{total}", totalCells).replace("{pct}", pct)}</h3><p class="text-muted">${t("tableTest.resultNote")}</p>`;
      playTone(pct >= 70 ? "correct" : "incorrect");
      App.Achievements.check();
    },
  };

  App.Quiz = { Study, Flash, Test, Exam, Writing, Listening, TableTest, shuffle, sample, pick };
})(window.App = window.App || {});
