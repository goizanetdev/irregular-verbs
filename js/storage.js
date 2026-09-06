/**
 * storage.js
 * Capa de persistencia sobre localStorage. Ningún otro módulo debe tocar
 * localStorage directamente: todo pasa por App.Storage para poder cambiar
 * de motor de almacenamiento en el futuro sin tocar el resto de la app.
 */
(function (App) {
  "use strict";

  const KEY = "irregularverbs:v1";

  const DEFAULT_STATE = {
    settings: {
      theme: "auto", // 'light' | 'dark' | 'auto'
      sounds: true,
      animations: true,
    },
    favorites: [],
    progress: {
      // verbId -> { attempts, correct, learned, lastSeen }
    },
    stats: {
      totalCorrect: 0,
      totalAttempts: 0,
      studySeconds: 0,
      streak: 0,
      bestStreak: 0, // mejor racha de DÍAS seguidos (histórica, no solo la actual)
      lastActiveDate: null, // 'YYYY-MM-DD'
      history: [], // [{date:'YYYY-MM-DD', correct, attempts}]
      errorCounts: {}, // verbId -> count
      currentCorrectStreak: 0, // aciertos seguidos ahora mismo (cualquier modo, se rompe con 1 fallo)
      bestCorrectStreak: 0, // mejor racha de aciertos seguidos histórica
      correctTimestamps: [], // últimos ~12 timestamps de aciertos, para detectar rachas rápidas
      practicedAfterMidnight: false,
      practicedBeforeSeven: false,
      hasRelearnedAfterFail: false,
      hardModeAced: false, // 90%+ en Examen en tabla con dificultad difícil
      perfectSessionsCount: 0, // sesiones/ejercicios completados con 100% de aciertos
      bigPerfectSessionCount: 0, // sesiones de 20+ aciertos sin ningún fallo
      sessionCounts: { study: 0, flash: 0, test: 0, exam: 0, writing: 0, listening: 0, games: 0 },
    },
    achievements: [], // unlocked achievement ids
    examResults: [], // [{date, score, total, seconds, review:[{inf,qtype,given,correct,correctVal}]}]
    customSelection: [], // IDs de verbos elegidos a mano (p.ej. "los 5 que estoy estudiando esta semana")
  };

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  // Renombres de IDs de logros entre versiones: evita que quien ya los tuviera
  // desbloqueados con el id antiguo los "pierda" al recalibrar los umbrales.
  const ACHIEVEMENT_ID_MIGRATIONS = {
    "master-100": "master-30",
    "expert-250": "expert-60",
    "legend-500": "legend-100",
    "learned-50": "learned-30",
    "learned-250": "learned-60",
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredCloneSafe(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      // shallow-merge with defaults to survive future schema additions
      const merged = deepMerge(structuredCloneSafe(DEFAULT_STATE), parsed);
      if (Array.isArray(merged.achievements)) {
        merged.achievements = Array.from(new Set(
          merged.achievements.map((id) => ACHIEVEMENT_ID_MIGRATIONS[id] || id)
        ));
      }
      return merged;
    } catch (e) {
      console.warn("No se pudo leer el progreso guardado, se usa un estado nuevo.", e);
      return structuredCloneSafe(DEFAULT_STATE);
    }
  }

  function structuredCloneSafe(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function deepMerge(base, extra) {
    if (!extra || typeof extra !== "object" || Array.isArray(extra)) return base;
    // Se recorre la UNIÓN de claves de base y extra (no solo las de base):
    // los diccionarios dinámicos por defecto (progress, errorCounts) empiezan
    // vacíos, así que si solo iteráramos las claves de "base" nunca se
    // copiarían los datos guardados al recargar la página.
    const keys = new Set([...Object.keys(base), ...Object.keys(extra)]);
    keys.forEach((k) => {
      if (extra[k] === undefined) return;
      const baseIsObj = typeof base[k] === "object" && base[k] !== null && !Array.isArray(base[k]);
      const extraIsObj = typeof extra[k] === "object" && extra[k] !== null && !Array.isArray(extra[k]);
      if (baseIsObj && extraIsObj) {
        base[k] = deepMerge(base[k], extra[k]);
      } else {
        base[k] = extra[k];
      }
    });
    return base;
  }

  let state = load();
  let saveTimer = null;

  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch (e) {
        console.error("Error guardando el progreso:", e);
      }
    }, 120);
  }

  const Storage = {
    getState() {
      return state;
    },

    /* ---------------- Settings ---------------- */
    getSettings() {
      return state.settings;
    },
    setSetting(key, value) {
      state.settings[key] = value;
      persist();
    },

    /* ---------------- Favorites ---------------- */
    isFavorite(verbId) {
      return state.favorites.includes(verbId);
    },
    toggleFavorite(verbId) {
      const idx = state.favorites.indexOf(verbId);
      if (idx === -1) {
        state.favorites.push(verbId);
      } else {
        state.favorites.splice(idx, 1);
      }
      persist();
      return this.isFavorite(verbId);
    },
    getFavorites() {
      return state.favorites.slice();
    },

    /* ---------------- Progress ---------------- */
    getProgress(verbId) {
      return state.progress[verbId] || { attempts: 0, correct: 0, learned: false, lastSeen: null };
    },
    isLearned(verbId) {
      return !!(state.progress[verbId] && state.progress[verbId].learned);
    },
    recordAnswer(verbId, isCorrect) {
      const p = state.progress[verbId] || { attempts: 0, correct: 0, learned: false, lastSeen: null };
      const failsBefore = p.attempts - p.correct; // fallos que ya tenía ANTES de esta respuesta
      const wasLearned = p.learned;
      p.attempts += 1;
      if (isCorrect) p.correct += 1;
      p.lastSeen = Date.now();
      // "Aprendido" se basa en el resultado neto (aciertos - fallos):
      // llega a +3 → se marca como aprendido; si vuelve a bajar hasta 0 (o menos) → se desmarca.
      const net = p.correct - (p.attempts - p.correct);
      if (net >= 3) p.learned = true;
      else if (net <= 0) p.learned = false;
      if (!wasLearned && p.learned) {
        // el verbo se acaba de aprender justo ahora: se guarda cuántas veces había fallado antes de conseguirlo
        p.failsAtLearn = failsBefore;
      }
      state.progress[verbId] = p;

      if (isCorrect && failsBefore > 0) state.stats.hasRelearnedAfterFail = true;

      state.stats.totalAttempts += 1;
      if (isCorrect) state.stats.totalCorrect += 1;
      else {
        state.stats.errorCounts[verbId] = (state.stats.errorCounts[verbId] || 0) + 1;
      }

      // Racha de aciertos consecutivos (cualquier modo, global)
      if (isCorrect) {
        state.stats.currentCorrectStreak += 1;
        if (state.stats.currentCorrectStreak > state.stats.bestCorrectStreak) {
          state.stats.bestCorrectStreak = state.stats.currentCorrectStreak;
        }
        state.stats.correctTimestamps.push(Date.now());
        if (state.stats.correctTimestamps.length > 12) state.stats.correctTimestamps.shift();
      } else {
        state.stats.currentCorrectStreak = 0;
      }

      // Franja horaria de la práctica
      const hour = new Date().getHours();
      if (hour === 0) state.stats.practicedAfterMidnight = true;
      if (hour < 7) state.stats.practicedBeforeSeven = true;

      this._touchDailyHistory(isCorrect);
      this._touchStreak();
      persist();
      return p;
    },
    /** Se llama cuando termina una sesión/ejercicio de un modo, para los logros "por modos" y de precisión. */
    recordSessionResult(mode, correct, total) {
      state.stats.sessionCounts[mode] = (state.stats.sessionCounts[mode] || 0) + 1;
      if (total && total > 0 && correct === total) {
        state.stats.perfectSessionsCount += 1;
        if (total >= 20) state.stats.bigPerfectSessionCount += 1;
      }
      persist();
    },
    /** Marca que se ha completado un ejercicio de dificultad "difícil" con un % de acierto dado (Examen en tabla). */
    recordHardExerciseResult(pct) {
      if (pct >= 90) { state.stats.hardModeAced = true; persist(); }
    },
    /** Nº de verbos aprendidos que se llegaron a fallar al menos `minFails` veces antes de dominarlos. */
    getHardLearnedCount(minFails) {
      return Object.values(state.progress).filter((p) => p.learned && (p.failsAtLearn || 0) >= (minFails || 5)).length;
    },
    markLearned(verbId, learned) {
      const p = state.progress[verbId] || { attempts: 0, correct: 0, learned: false, lastSeen: null };
      p.learned = learned;
      state.progress[verbId] = p;
      persist();
    },
    getLearnedCount() {
      return Object.values(state.progress).filter((p) => p.learned).length;
    },
    getSeenCount() {
      return Object.keys(state.progress).length;
    },

    /* ---------------- Stats / streak ---------------- */
    _touchDailyHistory(isCorrect) {
      const today = todayStr();
      let entry = state.stats.history.find((h) => h.date === today);
      if (!entry) {
        entry = { date: today, correct: 0, attempts: 0 };
        state.stats.history.push(entry);
        if (state.stats.history.length > 90) state.stats.history.shift();
      }
      entry.attempts += 1;
      if (isCorrect) entry.correct += 1;
    },
    _touchStreak() {
      const today = todayStr();
      if (state.stats.lastActiveDate === today) return;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (state.stats.lastActiveDate === yesterday) {
        state.stats.streak += 1;
      } else {
        state.stats.streak = 1;
      }
      if (state.stats.streak > (state.stats.bestStreak || 0)) state.stats.bestStreak = state.stats.streak;
      state.stats.lastActiveDate = today;
    },
    addStudySeconds(sec) {
      state.stats.studySeconds += sec;
      persist();
    },
    getStats() {
      return state.stats;
    },
    /** Aciertos e intentos de HOY, y la precisión (%) derivada de ellos — sin depender de ningún timer. */
    getTodayStats() {
      const entry = state.stats.history.find((h) => h.date === todayStr());
      const correct = entry ? entry.correct : 0;
      const attempts = entry ? entry.attempts : 0;
      const accuracy = attempts ? Math.round((correct / attempts) * 100) : null;
      return { correct, attempts, accuracy };
    },
    getTopErrors(limit) {
      return Object.entries(state.stats.errorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit || 5);
    },
    /** IDs de TODOS los verbos con al menos un error registrado, del más al menos repetido. */
    getErrorVerbIds() {
      return Object.entries(state.stats.errorCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([verbId]) => verbId);
    },

    /* ---------------- Selección personalizada ("lo que estoy estudiando ahora") ---------------- */
    getCustomSelection() {
      return state.customSelection.slice();
    },
    setCustomSelection(ids) {
      state.customSelection = Array.from(new Set(ids || []));
      persist();
    },
    isInCustomSelection(verbId) {
      return state.customSelection.includes(verbId);
    },
    toggleCustomSelectionVerb(verbId) {
      const idx = state.customSelection.indexOf(verbId);
      if (idx === -1) state.customSelection.push(verbId);
      else state.customSelection.splice(idx, 1);
      persist();
      return this.isInCustomSelection(verbId);
    },
    clearCustomSelection() {
      state.customSelection = [];
      persist();
    },

    /* ---------------- Achievements ---------------- */
    isUnlocked(id) {
      return state.achievements.includes(id);
    },
    unlock(id) {
      if (state.achievements.includes(id)) return false;
      state.achievements.push(id);
      persist();
      return true;
    },
    getUnlocked() {
      return state.achievements.slice();
    },

    /* ---------------- Exam results ---------------- */
    addExamResult(result) {
      state.examResults.push(result);
      if (state.examResults.length > 20) state.examResults.shift();
      persist();
    },
    getExamResults() {
      return state.examResults.slice();
    },

    /* ---------------- Reset / Export / Import ---------------- */
    resetAll() {
      state = structuredCloneSafe(DEFAULT_STATE);
      persist();
    },
    exportJSON() {
      return JSON.stringify(state, null, 2);
    },
    importJSON(json) {
      const parsed = JSON.parse(json);
      state = deepMerge(structuredCloneSafe(DEFAULT_STATE), parsed);
      persist();
    },
  };

  App.Storage = Storage;
})(window.App = window.App || {});
