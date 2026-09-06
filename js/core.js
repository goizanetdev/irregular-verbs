/**
 * core.js
 * Utilidades generales, estado de filtros/búsqueda del listado de verbos,
 * y el sistema de logros (achievements).
 */
(function (App) {
  "use strict";

  /* --------------------------------- Utils ----------------------------------- */
  const Utils = {
    normalize(str) {
      return (str || "")
        .toString()
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // quita acentos para comparar con tolerancia
        .replace(/\s+/g, ""); // ignora diferencias de espacios (p.ej. "was/were" vs "was / were")
    },

    /**
     * Compara la respuesta del usuario con la respuesta "oficial", aceptando
     * como válida cualquiera de las alternativas cuando el campo correcto
     * contiene varias separadas por "/" (p.ej. "was/were" o "conocer /
     * encontrarse con"): basta con acertar UNA de ellas.
     */
    answersMatch(userInput, correctAnswer) {
      const userNorm = this.normalize(userInput);
      if (!userNorm) return false;
      if (userNorm === this.normalize(correctAnswer)) return true;
      const alternatives = String(correctAnswer || "").split("/").map((s) => this.normalize(s)).filter(Boolean);
      return alternatives.includes(userNorm);
    },
    debounce(fn, wait) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
      };
    },
    formatSeconds(total) {
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      if (h > 0) return `${h}h ${m}m`;
      return `${m}m`;
    },

    /**
     * Genera una "mala escritura" plausible de una palabra (transposición,
     * letra duplicada, letra eliminada o vocal cambiada). Se usa para crear
     * distractores confusos en las preguntas de opción múltiple.
     */
    misspell(word) {
      const original = word;
      const letters = word.split("");
      const candidates = [];
      if (letters.length > 3) {
        const i = 1 + Math.floor(Math.random() * (letters.length - 2));
        const swapped = letters.slice();
        [swapped[i], swapped[i + 1]] = [swapped[i + 1], swapped[i]];
        candidates.push(swapped.join(""));
      }
      {
        const i = Math.floor(Math.random() * letters.length);
        const doubled = letters.slice();
        doubled.splice(i, 0, letters[i]);
        candidates.push(doubled.join(""));
      }
      if (letters.length > 3) {
        const i = Math.floor(Math.random() * letters.length);
        const dropped = letters.slice();
        dropped.splice(i, 1);
        candidates.push(dropped.join(""));
      }
      {
        const vowels = "aeiou";
        const idxs = letters.map((c, i) => ({ c, i })).filter((x) => vowels.includes(x.c.toLowerCase()));
        if (idxs.length) {
          const target = idxs[Math.floor(Math.random() * idxs.length)];
          const repl = vowels[Math.floor(Math.random() * vowels.length)];
          const arr = letters.slice();
          arr[target.i] = target.c === target.c.toUpperCase() ? repl.toUpperCase() : repl;
          candidates.push(arr.join(""));
        }
      }
      const valid = candidates.filter((c) => c && c.toLowerCase() !== original.toLowerCase());
      if (!valid.length) return original + (Math.random() < 0.5 ? "e" : "t");
      return valid[Math.floor(Math.random() * valid.length)];
    },

    /**
     * Genera 4 opciones "difíciles" para una pregunta de opción múltiple
     * sobre un verbo: la respuesta correcta, la otra forma del MISMO verbo
     * (para confundir pasado/participio) y dos versiones mal escritas de
     * ambas — en vez de formas de verbos totalmente distintos, mucho más
     * fáciles de descartar a simple vista.
     * @param {object} verb
     * @param {'pastSimple'|'pastParticiple'} field campo que se pregunta
     */
    smartVerbOptions(verb, field) {
      const otherField = field === "pastSimple" ? "pastParticiple" : "pastSimple";
      const correct = verb[field];
      const otherVal = verb[otherField];
      const opts = new Set([correct]);
      if (otherVal && Utils.normalize(otherVal) !== Utils.normalize(correct)) opts.add(otherVal);

      const addMisspelling = (base) => {
        let m = base, tries = 0;
        const collides = (val) => opts.has(val) || (Utils.normalize(val) === Utils.normalize(verb.infinitive) && Utils.normalize(verb.infinitive) !== Utils.normalize(correct) && Utils.normalize(verb.infinitive) !== Utils.normalize(otherVal));
        while (collides(m) && tries < 12) {
          m = Utils.misspell(tries > 4 ? m : base);
          tries++;
        }
        opts.add(m);
      };
      addMisspelling(correct);
      addMisspelling(otherVal || correct);
      let guard = 0;
      while (opts.size < 4 && guard < 15) {
        addMisspelling([...opts][opts.size % opts.size ? 0 : 0] || correct);
        guard++;
      }
      const arr = Array.from(opts).slice(0, 4);
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
  };

  /* ------------------------------ Filters/Search ------------------------------- */
  const Filters = {
    state: {
      query: "",
      level: "all", // all | A1 | A2 | B1 | B2 | usage:most
      status: "all", // all | favorites | learned | pending
    },
    gameLevels: ["A1", "A2", "B1", "B2"],
    gameSelectionMode: "cefr", // 'cefr' | 'custom'
    setGameLevels(levels) { this.gameLevels = levels && levels.length ? levels : ["A1", "A2", "B1", "B2"]; },
    setGameSelectionMode(mode) { this.gameSelectionMode = mode === "custom" ? "custom" : "cefr"; },
    setQuery(q) { this.state.query = q; },
    setLevel(l) { this.state.level = l; },
    setStatus(s) { this.state.status = s; },

    getFilteredVerbs() {
      const q = Utils.normalize(this.state.query);
      return App.Verbs.filter((v) => {
        if (q) {
          const hay = [v.infinitive, v.pastSimple, v.pastParticiple, v.translation]
            .some((f) => Utils.normalize(f).includes(q));
          if (!hay) return false;
        }
        if (this.state.level === "most") {
          if (v.frequency !== "essential") return false;
        } else if (this.state.level !== "all" && v.level !== this.state.level) {
          return false;
        }
        if (this.state.status === "favorites" && !App.Storage.isFavorite(v.id)) return false;
        if (this.state.status === "learned" && !App.Storage.isLearned(v.id)) return false;
        if (this.state.status === "pending" && App.Storage.isLearned(v.id)) return false;
        return true;
      });
    },
  };

  /* -------------------------------- Achievements -------------------------------- */
  const ACHIEVEMENTS = [
    // ---------------------------- 🌱 Primeros pasos ----------------------------
    { id: "first-verb", icon: "🌱", name: "Primer paso", desc: "Responde tu primer verbo", category: "Primeros pasos",
      check: (s) => s.stats.totalAttempts >= 1 },
    { id: "correct-10", icon: "✏️", name: "Aprendiz", desc: "Consigue 10 respuestas correctas", category: "Primeros pasos",
      check: (s) => s.stats.totalCorrect >= 10 },
    { id: "first-10-learned", icon: "📗", name: "Primeros 10", desc: "Aprende tus primeros 10 verbos", category: "Primeros pasos",
      check: () => App.Storage.getLearnedCount() >= 10 },
    { id: "no-abandon", icon: "🎯", name: "Sin miedo", desc: "Completa tu primer ejercicio sin abandonar", category: "Primeros pasos",
      check: (s) => Object.values(s.stats.sessionCounts || {}).some((n) => n >= 1) },
    { id: "exam-pass", icon: "🎓", name: "Examinado", desc: "Completa tu primer examen", category: "Primeros pasos",
      check: (s) => s.examResults.length >= 1 },
    { id: "favorites-5", icon: "❤️", name: "Tus favoritos", desc: "Guarda 5 verbos como favoritos", category: "Primeros pasos",
      check: (s) => s.favorites.length >= 5 },

    // ---------------------------- 📚 Progreso ----------------------------
    { id: "correct-100", icon: "📖", name: "Estudioso", desc: "100 respuestas correctas", category: "Progreso",
      check: (s) => s.stats.totalCorrect >= 100 },
    { id: "correct-500", icon: "🏆", name: "Maestro de verbos", desc: "500 respuestas correctas", category: "Progreso",
      check: (s) => s.stats.totalCorrect >= 500 },
    { id: "correct-1000", icon: "💪", name: "Incansable", desc: "1.000 respuestas correctas", category: "Progreso",
      check: (s) => s.stats.totalCorrect >= 1000 },
    { id: "correct-2500", icon: "🔥", name: "Imparable", desc: "2.500 respuestas correctas", category: "Progreso",
      check: (s) => s.stats.totalCorrect >= 2500 },
    { id: "correct-5000", icon: "👑", name: "Leyenda", desc: "5.000 respuestas correctas", category: "Progreso",
      check: (s) => s.stats.totalCorrect >= 5000 },

    // ---------------------------- 🌟 Verbos aprendidos ----------------------------
    { id: "learned-10", icon: "🌟", name: "10 dominados", desc: "Aprende 10 verbos", category: "Verbos aprendidos",
      check: () => App.Storage.getLearnedCount() >= 10 },
    { id: "learned-30", icon: "💎", name: "30 dominados", desc: "Aprende 30 verbos", category: "Verbos aprendidos",
      check: () => App.Storage.getLearnedCount() >= 30 },
    { id: "learned-60", icon: "🏆", name: "60 dominados", desc: "Aprende 60 verbos", category: "Verbos aprendidos",
      check: () => App.Storage.getLearnedCount() >= 60 },
    { id: "learned-100", icon: "🏅", name: "100 dominados", desc: "Aprende 100 verbos", category: "Verbos aprendidos",
      check: () => App.Storage.getLearnedCount() >= 100 },
    { id: "learned-all", icon: "👑", name: "Colección completa", desc: "Aprende todos los verbos", category: "Verbos aprendidos",
      check: () => App.Storage.getLearnedCount() >= App.Verbs.length },

    // ---------------------------- 🔥 Constancia ----------------------------
    { id: "streak-3", icon: "🔥", name: "En racha", desc: "Practica 3 días seguidos", category: "Constancia",
      check: (s) => s.stats.streak >= 3 },
    { id: "streak-7", icon: "🔥", name: "Semana perfecta", desc: "Practica 7 días seguidos", category: "Constancia",
      check: (s) => s.stats.streak >= 7 },
    { id: "streak-14", icon: "🌋", name: "Dos semanas", desc: "Practica 14 días seguidos", category: "Constancia",
      check: (s) => s.stats.streak >= 14 },
    { id: "streak-30", icon: "💥", name: "Un mes", desc: "Practica 30 días seguidos", category: "Constancia",
      check: (s) => s.stats.streak >= 30 },
    { id: "practice-days-30", icon: "🗓️", name: "Constante", desc: "Practica al menos una vez durante 30 días", category: "Constancia",
      check: (s) => (s.stats.history || []).length >= 30 },
    { id: "streak-100", icon: "🧱", name: "No hay quien te pare", desc: "Practica durante 100 días seguidos", category: "Constancia",
      check: (s) => s.stats.streak >= 100 },

    // ---------------------------- 🎯 Precisión ----------------------------
    { id: "correct-streak-10", icon: "🎯", name: "Todo correcto", desc: "Consigue 10 respuestas correctas seguidas", category: "Precisión",
      check: (s) => (s.stats.bestCorrectStreak || 0) >= 10 },
    { id: "correct-streak-25", icon: "🎯", name: "Buena puntería", desc: "Consigue 25 respuestas correctas seguidas", category: "Precisión",
      check: (s) => (s.stats.bestCorrectStreak || 0) >= 25 },
    { id: "perfect-session", icon: "💯", name: "Perfecto", desc: "Completa un ejercicio con el 100% de aciertos", category: "Precisión",
      check: (s) => (s.stats.perfectSessionsCount || 0) >= 1 },
    { id: "correct-streak-50", icon: "💯", name: "Impecable", desc: "Consigue 50 respuestas correctas seguidas", category: "Precisión",
      check: (s) => (s.stats.bestCorrectStreak || 0) >= 50 },
    { id: "correct-streak-100", icon: "🧠", name: "Memoria de elefante", desc: "Acumula 100 aciertos sin perder la racha", category: "Precisión",
      check: (s) => (s.stats.bestCorrectStreak || 0) >= 100 },
    { id: "exam-90", icon: "🥇", name: "Sobresaliente", desc: "Consigue un 90% o más en un examen", category: "Precisión",
      check: (s) => s.examResults.some((r) => r.score / r.total >= 0.9) },
    { id: "exam-100", icon: "💯", name: "Examen perfecto", desc: "Consigue un 100% en un examen", category: "Precisión",
      check: (s) => s.examResults.some((r) => r.score === r.total) },

    // ---------------------------- 🎮 Por modos ----------------------------
    { id: "sessions-study-10", icon: "📖", name: "A estudiar", desc: "Completa 10 sesiones de Estudio", category: "Por modos",
      check: (s) => (s.stats.sessionCounts.study || 0) >= 10 },
    { id: "sessions-test-10", icon: "📝", name: "Test, test, test", desc: "Completa 10 tests", category: "Por modos",
      check: (s) => (s.stats.sessionCounts.test || 0) >= 10 },
    { id: "sessions-exam-5", icon: "🎓", name: "A examen", desc: "Completa 5 exámenes", category: "Por modos",
      check: (s) => (s.stats.sessionCounts.exam || 0) >= 5 },
    { id: "sessions-writing-25", icon: "✍️", name: "A escribir", desc: "Completa 25 ejercicios de Escritura", category: "Por modos",
      check: (s) => (s.stats.sessionCounts.writing || 0) >= 25 },
    { id: "sessions-listening-25", icon: "👂", name: "Buen oído", desc: "Completa 25 ejercicios de Escucha", category: "Por modos",
      check: (s) => (s.stats.sessionCounts.listening || 0) >= 25 },
    { id: "sessions-games-10", icon: "🎮", name: "Jugador", desc: "Juega 10 partidas de minijuegos", category: "Por modos",
      check: (s) => (s.stats.sessionCounts.games || 0) >= 10 },
    { id: "all-modes", icon: "🏅", name: "Todo terreno", desc: "Utiliza todos los modos de práctica", category: "Por modos",
      check: (s) => Object.values(s.stats.sessionCounts || {}).every((n) => n >= 1) },

    // ---------------------------- 🧠 Dificultad ----------------------------
    { id: "hard-first", icon: "🐣", name: "De cero", desc: "Aprende tu primer verbo difícil", category: "Dificultad",
      check: () => App.Storage.getHardLearnedCount(1) >= 1 },
    { id: "hard-verb-5fails", icon: "🧗", name: "Contra las cuerdas", desc: "Aprende un verbo que habías fallado 5 veces", category: "Dificultad",
      check: () => App.Storage.getHardLearnedCount(5) >= 1 },
    { id: "hard-verb-10fails", icon: "💪", name: "Superado", desc: "Aprende un verbo después de haberlo fallado 10 veces", category: "Dificultad",
      check: () => App.Storage.getHardLearnedCount(10) >= 1 },
    { id: "relearn-after-fail", icon: "🧠", name: "Ya me lo sé", desc: "Responde correctamente un verbo que habías fallado anteriormente", category: "Dificultad",
      check: (s) => !!s.stats.hasRelearnedAfterFail },
    { id: "hard-25", icon: "🔓", name: "Desbloqueado", desc: "Aprende 25 verbos difíciles", category: "Dificultad",
      check: () => App.Storage.getHardLearnedCount(5) >= 25 },

    // ---------------------------- ⚡ Logros especiales (secretos) ----------------------------
    { id: "speed-10", icon: "⚡", name: "Velocista", desc: "Responde 10 verbos correctamente en menos de 1 minuto", category: "Logros especiales", secret: true,
      check: (s) => {
        const t = s.stats.correctTimestamps || [];
        if (t.length < 10) return false;
        const last10 = t.slice(-10);
        return last10[9] - last10[0] <= 60000;
      } },
    { id: "night-owl", icon: "🌙", name: "Noctámbulo", desc: "Practica después de las 00:00", category: "Logros especiales", secret: true,
      check: (s) => !!s.stats.practicedAfterMidnight },
    { id: "early-bird", icon: "☀️", name: "Madrugador", desc: "Practica antes de las 07:00", category: "Logros especiales", secret: true,
      check: (s) => !!s.stats.practicedBeforeSeven },
    { id: "first-try-10", icon: "🎯", name: "A la primera", desc: "Consigue 10 aciertos sin fallar", category: "Logros especiales", secret: true,
      check: (s) => (s.stats.bestCorrectStreak || 0) >= 10 },
    { id: "flawless-20", icon: "🔥", name: "Hoy no fallo", desc: "Consigue 20 aciertos en una sesión sin ningún error", category: "Logros especiales", secret: true,
      check: (s) => (s.stats.bigPerfectSessionCount || 0) >= 1 },
    { id: "no-hints-10", icon: "🧠", name: "De memoria", desc: "Aprende 10 verbos sin utilizar pistas", category: "Logros especiales", secret: true,
      check: () => App.Storage.getLearnedCount() >= 10 },
    { id: "hard-mode-90", icon: "🦾", name: "Modo difícil", desc: "Consigue 90% o más en un ejercicio difícil", category: "Logros especiales", secret: true,
      check: (s) => !!s.stats.hardModeAced },

    // ---------------------------- 👑 Los grandes ----------------------------
    { id: "master-30", icon: "🏆", name: "Maestro", desc: "Aprende 30 verbos", category: "Los grandes",
      check: () => App.Storage.getLearnedCount() >= 30 },
    { id: "expert-60", icon: "💎", name: "Experto", desc: "Aprende 60 verbos", category: "Los grandes",
      check: () => App.Storage.getLearnedCount() >= 60 },
    { id: "legend-100", icon: "👑", name: "Leyenda", desc: "Aprende 100 verbos", category: "Los grandes",
      check: () => App.Storage.getLearnedCount() >= 100 },
    { id: "polyglot", icon: "🌍", name: "Políglota", desc: "Domina todos los verbos disponibles", category: "Los grandes",
      check: () => App.Storage.getLearnedCount() >= App.Verbs.length },
    { id: "perfectionist-10exams", icon: "🏅", name: "Perfeccionista", desc: "Consigue 100% en 10 exámenes", category: "Los grandes",
      check: (s) => s.examResults.filter((r) => r.score === r.total).length >= 10 },
    { id: "no-rest-100", icon: "🔥", name: "Sin descanso", desc: "Mantén una racha de 100 días", category: "Los grandes",
      check: (s) => (s.stats.bestStreak || 0) >= 100 },
    { id: "almost-impossible", icon: "💯", name: "Casi imposible", desc: "Consigue 1.000 respuestas correctas sin bajar del 90% de aciertos", category: "Los grandes",
      check: (s) => s.stats.totalCorrect >= 1000 && s.stats.totalAttempts > 0 && (s.stats.totalCorrect / s.stats.totalAttempts) >= 0.9 },
  ];

  const ACHIEVEMENT_CATEGORIES = [
    "Primeros pasos", "Progreso", "Verbos aprendidos", "Constancia",
    "Precisión", "Por modos", "Dificultad", "Logros especiales", "Los grandes",
  ];

  const Achievements = {
    all: ACHIEVEMENTS,
    categories: ACHIEVEMENT_CATEGORIES,
    check() {
      const state = App.Storage.getState();
      const newlyUnlocked = [];
      ACHIEVEMENTS.forEach((a) => {
        if (App.Storage.isUnlocked(a.id)) return;
        if (a.check(state)) {
          App.Storage.unlock(a.id);
          newlyUnlocked.push(a);
        }
      });
      newlyUnlocked.forEach((a) => this.celebrate(a));
      if (newlyUnlocked.length && App.UI2 && App.UI2.refreshAchievements) App.UI2.refreshAchievements();
      return newlyUnlocked;
    },
    celebrate(achievement) {
      App.UI.toast(`🏅 Logro desbloqueado: ${achievement.name}`, { duration: 3400 });
      if (!App.Storage.getSettings().animations) return;
      const colors = ["#6C5CE7", "#FF6857", "#17C3B2", "#FFB800"];
      for (let i = 0; i < 24; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.background = colors[i % colors.length];
        piece.style.animationDelay = Math.random() * 300 + "ms";
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 2200);
      }
    },
  };

  App.Utils = Utils;
  App.Filters = Filters;
  App.Achievements = Achievements;
})(window.App = window.App || {});
