/**
 * ui.js
 * Utilidades de interfaz: enrutado de vistas, toasts, modales, tarjetas de
 * verbo y ficha de detalle. No contiene lógica de negocio de quiz/juegos.
 */
(function (App) {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach((k) => {
      if (attrs[k] === null || attrs[k] === undefined || attrs[k] === false) return; // no crear el atributo (p.ej. disabled:null no debe deshabilitar)
      if (k === "class") node.className = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else if (k.startsWith("on") && typeof attrs[k] === "function") {
        node.addEventListener(k.slice(2), attrs[k]);
      } else node.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    });
    (children || []).forEach((c) => {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  /* ------------------------------ View router ------------------------------ */
  function showView(viewId) {
    $$(".view").forEach((v) => v.classList.remove("active"));
    const target = document.getElementById(viewId);
    if (target) target.classList.add("active");
    $$(".nav-item").forEach((n) => n.classList.toggle("active", n.dataset.view === viewId));
    const view = document.getElementById(viewId);
    if (view) view.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    document.dispatchEvent(new CustomEvent("view:change", { detail: { viewId } }));
  }

  /* -------------------------------- Toasts ---------------------------------- */
  function toast(message, opts) {
    opts = opts || {};
    const region = $("#toastRegion");
    if (!region) return;
    const t = el("div", { class: "toast", role: "status" }, [message]);
    region.appendChild(t);
    setTimeout(() => t.remove(), opts.duration || 2600);
  }

  /* -------------------------------- Modal ------------------------------------ */
  const modalOverlay = () => $("#modalOverlay");

  function openModal(contentNode) {
    const overlay = modalOverlay();
    const modal = $("#modalBody");
    modal.innerHTML = "";
    modal.appendChild(contentNode);
    overlay.classList.add("open");
    const focusable = modal.querySelector("button, input, [tabindex]");
    if (focusable) focusable.focus();
  }
  function closeModal() {
    modalOverlay().classList.remove("open");
  }

  function confirmDialog(title, message, confirmLabel) {
    return new Promise((resolve) => {
      const wrap = el("div", {}, [
        el("h3", {}, [title]),
        el("p", { class: "text-muted" }, [message]),
        el("div", { class: "modal-actions" }, [
          el("button", { class: "btn btn-secondary", onclick: () => { closeModal(); resolve(false); } }, ["Cancelar"]),
          el("button", { class: "btn btn-danger", onclick: () => { closeModal(); resolve(true); } }, [confirmLabel || "Confirmar"]),
        ]),
      ]);
      openModal(wrap);
    });
  }

  /* --------------------------- Speech synthesis ------------------------------ */
  function speak(text) {
    if (!("speechSynthesis" in window)) {
      toast("Tu navegador no soporta pronunciación por voz.");
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.92;
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find((v) => v.lang && v.lang.startsWith("en"));
    if (enVoice) utter.voice = enVoice;
    window.speechSynthesis.speak(utter);
  }
  // Chrome carga voces async
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {};
  }

  /* ------------------------------- Sound fx ---------------------------------- */
  let audioCtx = null;
  function playTone(type) {
    if (!App.Storage.getSettings().sounds) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g);
      g.connect(audioCtx.destination);
      const freqs = { correct: [660, 880], incorrect: [220, 160], click: [440] };
      const seq = freqs[type] || freqs.click;
      o.type = "sine";
      g.gain.setValueAtTime(0.08, audioCtx.currentTime);
      seq.forEach((f, i) => o.frequency.setValueAtTime(f, audioCtx.currentTime + i * 0.09));
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);
      o.stop(audioCtx.currentTime + 0.3);
    } catch (e) { /* silencioso: audio no disponible */ }
  }

  /* ------------------------------ Verb rendering ------------------------------ */
  function triad(verb, opts) {
    opts = opts || {};
    const speakable = opts.speakable !== false; // por defecto, cada forma se puede escuchar
    const stage = (text, cls) => el("span", {
      class: `triad-stage ${cls} ${speakable ? "speakable" : ""}`,
      title: speakable ? `Escuchar "${text}"` : null,
      tabindex: speakable ? "0" : null,
      role: speakable ? "button" : null,
      "aria-label": speakable ? `Escuchar ${text}` : null,
      onclick: speakable ? (e) => { e.stopPropagation(); speak(text); } : null,
      onkeydown: speakable ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); speak(text); } } : null,
    }, [text]);
    return el("div", { class: "triad" }, [
      stage(verb.infinitive, "s1"),
      el("span", { class: "triad-arrow" }, ["→"]),
      stage(verb.pastSimple, "s2"),
      el("span", { class: "triad-arrow" }, ["→"]),
      stage(verb.pastParticiple, "s3"),
    ]);
  }

  function favIcon(filled) {
    return `<svg viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.9-10-9.3C.4 8.2 2 4 6 4c2 0 3.5 1.1 4.5 2.5C11.5 5.1 13 4 15 4c4 0 5.6 4.2 4 7.7C19.5 16.1 12 21 12 21z"/></svg>`;
  }

  function verbCard(verb) {
    const isFav = App.Storage.isFavorite(verb.id);
    const isLearned = App.Storage.isLearned(verb.id);
    const card = el("article", { class: "card verb-card", tabindex: "0", role: "button", "aria-label": `Ver detalle de ${verb.infinitive}` }, [
      el("div", { class: "verb-card-top" }, [
        el("div", {}, [
          el("span", { class: "verb-chip" }, [verb.level]),
        ]),
        el("button", {
          class: `icon-btn fav-btn ${isFav ? "is-fav" : ""}`,
          "aria-label": isFav ? "Quitar de favoritos" : "Añadir a favoritos",
          onclick: (e) => {
            e.stopPropagation();
            const nowFav = App.Storage.toggleFavorite(verb.id);
            e.currentTarget.classList.toggle("is-fav", nowFav);
            e.currentTarget.innerHTML = favIcon(nowFav);
            toast(nowFav ? "Añadido a favoritos" : "Quitado de favoritos");
          },
          html: favIcon(isFav),
        }),
      ]),
      triad(verb),
      el("p", { class: "verb-translation" }, [verb.translation]),
      el("p", { class: "verb-example-preview" }, [`“${verb.example.en}”`]),
      el("div", { class: "verb-card-footer" }, [
        el("span", { class: `status ${isLearned ? "learned" : "pending"}` }, [isLearned ? "✓ Aprendido" : "Pendiente"]),
        el("button", { class: "icon-btn", "aria-label": "Escuchar pronunciación", onclick: (e) => { e.stopPropagation(); speak(verb.infinitive); } },
          [document.createRange().createContextualFragment(speakerIcon())]),
      ]),
    ]);
    card.addEventListener("click", () => openVerbDetail(verb));
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openVerbDetail(verb); } });
    return card;
  }

  function speakerIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>`;
  }

  function renderVerbGrid(container, verbs) {
    container.innerHTML = "";
    if (!verbs.length) {
      container.appendChild(el("div", { class: "empty-state" }, [
        document.createRange().createContextualFragment(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`),
        el("p", {}, ["No se encontraron verbos con estos filtros."]),
      ]));
      return;
    }
    const frag = document.createDocumentFragment();
    verbs.forEach((v) => frag.appendChild(verbCard(v)));
    container.appendChild(frag);
  }

  function openVerbDetail(verb) {
    const isFav = App.Storage.isFavorite(verb.id);
    const wrap = el("div", { class: "verb-detail" }, [
      el("div", { class: "row-between" }, [
        el("h3", { style: "font-family:var(--font-display);font-size:1.6rem;" }, [verb.infinitive]),
        el("button", { class: "icon-btn", "aria-label": "Escuchar", onclick: () => speak(verb.infinitive) },
          [document.createRange().createContextualFragment(speakerIcon())]),
      ]),
      el("p", { class: "text-muted" }, [`${verb.translation} · ${verb.level} · ${verb.categoryLabel}`]),
      triad(verb),
      el("div", { class: "verb-detail-grid" }, [
        el("div", { class: "detail-block" }, [
          el("h4", {}, ["Pronunciación (IPA)"]),
          el("p", { style: "font-family:var(--font-mono)" }, [`/${verb.ipa.infinitive}/ · /${verb.ipa.pastSimple}/ · /${verb.ipa.pastParticiple}/`]),
        ]),
        el("div", { class: "detail-block" }, [
          el("h4", {}, ["Ejemplo"]),
          el("p", {}, [verb.example.en]),
          el("p", { class: "text-muted" }, [verb.example.es]),
        ]),
      ]),
      el("div", { class: "detail-block mb-16" }, [
        el("h4", {}, ["Error frecuente"]),
        el("p", {}, [verb.mistake]),
      ]),
      el("div", { class: "row" }, [
        el("button", {
          class: `btn ${isFav ? "btn-secondary" : "btn-primary"} btn-block`,
          onclick: (e) => {
            const nowFav = App.Storage.toggleFavorite(verb.id);
            e.currentTarget.textContent = nowFav ? "★ En favoritos" : "☆ Añadir a favoritos";
            e.currentTarget.className = `btn ${nowFav ? "btn-secondary" : "btn-primary"} btn-block`;
          },
        }, [isFav ? "★ En favoritos" : "☆ Añadir a favoritos"]),
      ]),
    ]);
    openModal(wrap);
  }

  function renderReview(container, results) {
    container.innerHTML = "";
    if (!results.length) {
      container.appendChild(el("p", { class: "text-muted" }, ["Sin datos para revisar."]));
      return;
    }
    results.forEach((r) => {
      const infinitive = r.infinitive || (r.verb && r.verb.infinitive) || "?";
      container.appendChild(el("div", { class: `review-row ${r.correct ? "ok" : "bad"}` }, [
        el("span", { class: "review-icon" }, [r.correct ? "✅" : "❌"]),
        el("div", { class: "review-body" }, [
          el("strong", {}, [infinitive]),
          el("span", { class: "review-detail" }, [
            r.correct
              ? `Respondiste "${r.given}" — correcto`
              : `Respondiste "${r.given}" — correcto: "${r.correctVal}"`,
          ]),
        ]),
      ]));
    });
  }

  App.UI = {
    $, $$, el, showView, toast, openModal, closeModal, confirmDialog,
    speak, playTone, triad, verbCard, renderVerbGrid, openVerbDetail, speakerIcon, renderReview,
  };
})(window.App = window.App || {});
