/**
 * games.js
 * Cuatro minijuegos construidos sobre la misma base de verbos:
 * Memory, Ahorcado, Ordenar letras y Completar huecos.
 */
(function (App) {
  "use strict";
  const { $, el, toast, playTone } = App.UI;
  const { shuffle, sample, pick } = App.Quiz;

  function pool(min) {
    if (App.Filters.gameSelectionMode === "custom") {
      const ids = new Set(App.Storage.getCustomSelection());
      const filtered = App.Verbs.filter((v) => ids.has(v.id));
      return filtered.length >= (min || 6) ? filtered : (filtered.length ? filtered : App.Verbs);
    }
    const levels = App.Filters.gameLevels && App.Filters.gameLevels.length ? App.Filters.gameLevels : ["A1", "A2", "B1", "B2"];
    const filtered = App.Verbs.filter((v) => levels.includes(v.level));
    return filtered.length >= (min || 6) ? filtered : App.Verbs; // fallback a toda la base si hay pocos filtrados
  }

  /* =========================================================================
     MEMORY — emparejar infinitivo con su traducción
     ========================================================================= */
  const Memory = {
    cards: [], flipped: [], matched: 0, moves: 0, locked: false,
    start() {
      App.Storage.recordSessionResult("games", null, 0);
      const verbs = sample(pool(8), 8);
      const items = [];
      verbs.forEach((v) => {
        items.push({ pairId: v.id, text: v.infinitive, type: "en" });
        items.push({ pairId: v.id, text: v.translation, type: "es" });
      });
      this.cards = shuffle(items).map((c, i) => ({ ...c, uid: i, revealed: false, matched: false }));
      this.flipped = []; this.matched = 0; this.moves = 0; this.locked = false;
      this.render();
    },
    render() {
      const board = $("#memoryBoard");
      board.innerHTML = "";
      board.className = "game-board memory-grid";
      this.cards.forEach((c) => {
        const cardEl = el("button", {
          class: `memory-card ${c.matched ? "matched" : c.revealed ? "revealed" : "hidden-face"}`,
          "aria-label": c.revealed || c.matched ? c.text : "Carta oculta",
          onclick: () => this.flip(c.uid),
        }, [c.revealed || c.matched ? c.text : "?"]);
        board.appendChild(cardEl);
      });
      $("#memoryMoves").textContent = `Movimientos: ${this.moves}`;
      $("#memoryPairs").textContent = `Parejas: ${this.matched} / ${this.cards.length / 2}`;
    },
    flip(uid) {
      if (this.locked) return;
      const card = this.cards.find((c) => c.uid === uid);
      if (!card || card.revealed || card.matched) return;
      card.revealed = true;
      this.flipped.push(card);
      this.render();
      if (this.flipped.length === 2) {
        this.moves++;
        this.locked = true;
        const [a, b] = this.flipped;
        if (a.pairId === b.pairId) {
          setTimeout(() => {
            a.matched = b.matched = true;
            this.matched++;
            this.flipped = [];
            this.locked = false;
            playTone("correct");
            this.render();
            if (this.matched === this.cards.length / 2) {
              toast("¡Memory completado! 🎉");
              App.Achievements.check();
            }
          }, 500);
        } else {
          playTone("incorrect");
          setTimeout(() => {
            a.revealed = b.revealed = false;
            this.flipped = [];
            this.locked = false;
            this.render();
          }, 800);
        }
      }
    },
  };

  /* =========================================================================
     AHORCADO
     ========================================================================= */
  const Hangman = {
    verb: null, guessed: [], wrong: 0, maxWrong: 6, over: false,
    STAGES: [
      "  +---+\n      |\n      |\n      |\n     ===",
      "  +---+\n  O   |\n      |\n      |\n     ===",
      "  +---+\n  O   |\n  |   |\n      |\n     ===",
      "  +---+\n  O   |\n /|   |\n      |\n     ===",
      "  +---+\n  O   |\n /|\\  |\n      |\n     ===",
      "  +---+\n  O   |\n /|\\  |\n /    |\n     ===",
      "  +---+\n  O   |\n /|\\  |\n / \\  |\n     ===",
    ],
    start() {
      App.Storage.recordSessionResult("games", null, 0);
      this.verb = pick(pool(4));
      this.guessed = []; this.wrong = 0; this.over = false;
      this.render();
    },
    render() {
      $("#hangmanFigure").textContent = this.STAGES[Math.min(this.wrong, 6)];
      const word = $("#hangmanWord");
      word.innerHTML = "";
      this.verb.infinitive.split("").forEach((ch) => {
        const shown = this.guessed.includes(ch.toLowerCase()) || this.over;
        word.appendChild(el("span", {}, [shown ? ch : "_"]));
      });
      const letters = $("#hangmanLetters");
      letters.innerHTML = "";
      "abcdefghijklmnopqrstuvwxyz".split("").forEach((ch) => {
        const used = this.guessed.includes(ch);
        const correct = used && this.verb.infinitive.toLowerCase().includes(ch);
        letters.appendChild(el("button", {
          class: `letter-btn ${used ? (correct ? "used-correct" : "used-wrong") : ""}`,
          disabled: used || this.over ? "true" : null,
          onclick: () => this.guess(ch),
        }, [ch]));
      });
      $("#hangmanHint").textContent = this.verb.translation;
      $("#hangmanStatus").textContent = "";
      if (this.wrong >= this.maxWrong) {
        this.over = true;
        $("#hangmanStatus").innerHTML = `💀 ¡Perdiste! Era <strong>${this.verb.infinitive}</strong>`;
        this.render2();
      } else if (this.verb.infinitive.split("").every((ch) => this.guessed.includes(ch.toLowerCase()))) {
        this.over = true;
        $("#hangmanStatus").innerHTML = "🎉 ¡Lo lograste!";
        App.Storage.recordAnswer(this.verb.id, true);
        App.Achievements.check();
      }
    },
    render2() { App.Storage.recordAnswer(this.verb.id, false); },
    guess(ch) {
      if (this.over || this.guessed.includes(ch)) return;
      this.guessed.push(ch);
      if (!this.verb.infinitive.toLowerCase().includes(ch)) { this.wrong++; playTone("incorrect"); }
      else playTone("correct");
      this.render();
    },
    /** Soporte de teclado físico: solo se aceptan letras a-z aún no probadas. */
    handleKey(e) {
      if (e.key === "Enter") {
        if (this.over) { e.preventDefault(); this.start(); }
        return;
      }
      const key = e.key.toLowerCase();
      if (/^[a-z]$/.test(key) && !this.over && !this.guessed.includes(key)) {
        e.preventDefault();
        this.guess(key);
      }
    },
  };

  /* =========================================================================
     ORDENAR LETRAS (anagrama del infinitivo)
     ========================================================================= */
  const OrderLetters = {
    verb: null, target: [], placed: [], tiles: [], answered: false,
    start() {
      App.Storage.recordSessionResult("games", null, 0);
      this.verb = pick(pool(4));
      this.target = this.verb.infinitive.split("");
      this.placed = new Array(this.target.length).fill(null);
      this.tiles = shuffle(this.target.map((ch, i) => ({ ch, id: i, used: false })));
      this.answered = false;
      this.render();
    },
    render() {
      const slots = $("#orderSlots");
      slots.innerHTML = "";
      this.placed.forEach((val, i) => {
        slots.appendChild(el("div", { class: "order-letter-slot" }, [val || ""]));
      });
      const tilesBox = $("#orderTiles");
      tilesBox.innerHTML = "";
      this.tiles.forEach((t) => {
        tilesBox.appendChild(el("button", {
          class: "order-letter-tile", disabled: t.used ? "true" : null,
          onclick: () => this.place(t.id),
        }, [t.ch]));
      });
      $("#orderHint").textContent = this.verb.translation;
      $("#orderStatus").textContent = "";
    },
    place(tileId) {
      const tile = this.tiles.find((t) => t.id === tileId);
      if (!tile || tile.used) return;
      const emptyIdx = this.placed.findIndex((p) => p === null);
      if (emptyIdx === -1) return;
      this.placed[emptyIdx] = tile.ch;
      tile.used = true;
      this.render();
      if (this.placed.every((p) => p !== null)) this.checkAnswer();
    },
    checkAnswer() {
      const answer = this.placed.join("");
      const ok = answer.toLowerCase() === this.verb.infinitive.toLowerCase();
      this.answered = true;
      App.Storage.recordAnswer(this.verb.id, ok);
      playTone(ok ? "correct" : "incorrect");
      $("#orderStatus").innerHTML = ok
        ? "🎉 ¡Correcto! Pulsa Enter para la siguiente palabra."
        : `❌ Era <strong>${this.verb.infinitive}</strong> · Pulsa Retroceso para borrar y reintentar, o Enter para otra palabra.`;
      if (ok) App.Achievements.check();
    },
    clear() {
      this.placed = this.placed.map(() => null);
      this.tiles.forEach((t) => (t.used = false));
      this.answered = false;
      this.render();
    },
    /** Soporte de teclado físico: solo se aceptan las letras que aún están disponibles como ficha. */
    handleKey(e) {
      if (e.key === "Backspace") { e.preventDefault(); this.clear(); return; }
      if (e.key === "Enter") {
        if (this.answered) { e.preventDefault(); this.start(); }
        return;
      }
      const key = e.key.toLowerCase();
      if (/^[a-z]$/.test(key)) {
        const tile = this.tiles.find((t) => !t.used && t.ch.toLowerCase() === key);
        if (tile) { e.preventDefault(); this.place(tile.id); }
      }
    },
  };

  /* =========================================================================
     COMPLETAR HUECOS — banco de 500 frases contextuales (gapSentences.js)
     ========================================================================= */
  const FillGaps = {
    queue: [], current: null, score: 0, total: 0,
    bankForPool() {
      const poolIds = new Set(pool(4).map((v) => v.id));
      const filtered = App.GapSentences.filter((s) => poolIds.has(s.verbId));
      return filtered.length >= 5 ? filtered : App.GapSentences;
    },
    start() {
      App.Storage.recordSessionResult("games", null, 0);
      this.queue = shuffle(this.bankForPool());
      this.score = 0; this.total = 0;
      this.next();
    },
    next() {
      if (!this.queue.length) this.queue = shuffle(this.bankForPool());
      this.current = this.queue.pop();
      this.render();
    },
    render() {
      const s = this.current;
      $("#gapSentence").innerHTML = s.sentenceEn.replace(
        "_____",
        '<input type="text" id="gapInlineInput" class="gap-inline-input" autocomplete="off" spellcheck="false" aria-label="Escribe la forma correcta">'
      );
      $("#gapTranslation").textContent = s.sentenceEs;
      $("#gapHint").textContent = `${s.form === "pastSimple" ? "Pasado simple" : "Participio pasado"} de "${s.infinitive}" · ${s.translation}`;
      $("#gapLevelChip").textContent = s.level;
      $("#gapFeedback").className = "quiz-feedback";
      $("#gapFeedback").textContent = "";
      $("#gapNextBtn").style.display = "none";
      $("#gapCheckBtn").style.display = "inline-flex";
      $("#gapScore").textContent = `${this.score} / ${this.total}`;
      const inlineInput = $("#gapInlineInput");
      inlineInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); $("#gapCheckBtn").click(); } });
      inlineInput.focus();
    },
    check() {
      const s = this.current;
      const inlineInput = $("#gapInlineInput");
      const ok = App.Utils.answersMatch(inlineInput.value, s.answer);
      this.total++;
      if (ok) this.score++;
      App.Storage.recordAnswer(s.verbId, ok);
      playTone(ok ? "correct" : "incorrect");
      const box = $("#gapFeedback");
      box.classList.add("show", ok ? "ok" : "bad");
      box.innerHTML = ok ? "✅ ¡Correcto!" : `❌ La respuesta correcta es <strong>${s.answer}</strong>`;
      inlineInput.disabled = true;
      inlineInput.classList.add(ok ? "cell-correct" : "cell-incorrect");
      $("#gapCheckBtn").style.display = "none";
      $("#gapNextBtn").style.display = "inline-flex";
      $("#gapScore").textContent = `${this.score} / ${this.total}`;
      if (ok) App.Achievements.check();
    },
  };

  /* =========================================================================
     RULETA — gira y responde sobre el verbo que salga
     ========================================================================= */
  const Roulette = {
    spinning: false, verb: null, score: 0, rounds: 0,
    start() {
      App.Storage.recordSessionResult("games", null, 0);
      this.score = 0; this.rounds = 0;
      $("#rouletteScore").textContent = "";
      this.reset();
    },
    reset() {
      $("#rouletteQuestion").style.display = "none";
      $("#rouletteSpinBtn").disabled = false;
      $("#rouletteSpinBtn").textContent = "🎡 Girar la ruleta";
      const reel = $("#rouletteReel");
      reel.innerHTML = "";
      reel.appendChild(el("div", { class: "reel-item" }, ["?"]));
    },
    spin() {
      if (this.spinning) return;
      this.spinning = true;
      $("#rouletteSpinBtn").disabled = true;
      $("#rouletteQuestion").style.display = "none";
      const candidates = sample(pool(6), 18);
      const finalVerb = pick(candidates.length ? candidates : pool(6));
      const reel = $("#rouletteReel");
      reel.innerHTML = "";
      const strip = el("div", { class: "reel-strip" });
      candidates.concat([finalVerb, finalVerb, finalVerb]).forEach((v) => {
        strip.appendChild(el("div", { class: "reel-item" }, [v.infinitive]));
      });
      reel.appendChild(strip);
      const itemHeight = 64;
      const totalItems = candidates.length + 3;
      const offset = (totalItems - 2) * itemHeight;
      strip.style.transition = "none";
      strip.style.transform = "translateY(0px)";
      // fuerza reflow antes de animar
      void strip.offsetHeight;
      requestAnimationFrame(() => {
        strip.style.transition = "transform 2.4s cubic-bezier(.15,.86,.3,1)";
        strip.style.transform = `translateY(-${offset}px)`;
      });
      setTimeout(() => {
        this.spinning = false;
        this.verb = finalVerb;
        this.rounds++;
        $("#rouletteSpinBtn").disabled = false;
        $("#rouletteSpinBtn").textContent = "🎡 Girar de nuevo";
        this.askQuestion(finalVerb);
        playTone("click");
      }, 2500);
    },
    askQuestion(verb) {
      $("#rouletteQuestion").style.display = "block";
      $("#rouletteQtext").textContent = `¿Cuál es el pasado simple de "${verb.infinitive}"?`;
      $("#rouletteHint").textContent = verb.translation;
      const optBox = $("#rouletteOptions");
      optBox.innerHTML = "";
      App.Utils.smartVerbOptions(verb, "pastSimple").forEach((opt) => {
        optBox.appendChild(el("button", {
          class: "quiz-option",
          onclick: (e) => this.answer(e.currentTarget, opt === verb.pastSimple, verb),
        }, [opt]));
      });
    },
    answer(btn, correct, verb) {
      App.UI.$$(".quiz-option", $("#rouletteOptions")).forEach((b) => {
        b.disabled = true;
        if (b.textContent === verb.pastSimple) b.classList.add("correct");
        else if (b === btn) b.classList.add("incorrect");
      });
      if (correct) this.score++;
      App.Storage.recordAnswer(verb.id, correct);
      playTone(correct ? "correct" : "incorrect");
      $("#rouletteScore").textContent = `Puntuación: ${this.score} / ${this.rounds}`;
      if (correct) App.Achievements.check();
    },
  };

  App.Games = { Memory, Hangman, OrderLetters, FillGaps, Roulette };
})(window.App = window.App || {});
