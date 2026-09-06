/**
 * stats.js
 * Gráficas dibujadas a mano sobre <canvas>, sin librerías externas.
 */
(function (App) {
  "use strict";

  function setupCanvas(canvas) {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const parentWidth = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
    // Se usa el ancho más fiable disponible, pero nunca se permite superar el
    // ancho real del contenedor padre (evita que el canvas quede más ancho
    // que su tarjeta si getBoundingClientRect se midió en un instante
    // intermedio del layout, p.ej. justo tras un cambio de vista en móvil).
    let cssWidth = rect.width || parentWidth || 320;
    if (parentWidth) cssWidth = Math.min(cssWidth, parentWidth);
    const cssHeight = parseInt(canvas.dataset.height || "180", 10);
    canvas.width = cssWidth * ratio;
    canvas.height = cssHeight * ratio;
    canvas.style.width = cssWidth + "px";
    canvas.style.height = cssHeight + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(ratio, ratio);
    return { ctx, w: cssWidth, h: cssHeight };
  }

  function getCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#6C5CE7";
  }

  /** Gráfica de barras simple: [{label, value}] */
  function barChart(canvas, data, opts) {
    opts = opts || {};
    const { ctx, w, h } = setupCanvas(canvas);
    ctx.clearRect(0, 0, w, h);
    const padding = { top: 16, right: 10, bottom: 28, left: 10 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    const max = Math.max(1, ...data.map((d) => d.value));
    const barW = chartW / data.length;
    const color = opts.color || getCSSVar("--violet");
    const textColor = getCSSVar("--text-muted");

    data.forEach((d, i) => {
      const barH = (d.value / max) * chartH;
      const x = padding.left + i * barW + barW * 0.18;
      const y = padding.top + (chartH - barH);
      const bw = barW * 0.64;
      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, color);
      grad.addColorStop(1, opts.color2 || getCSSVar("--teal"));
      ctx.fillStyle = grad;
      roundRect(ctx, x, y, bw, Math.max(barH, 2), 6);
      ctx.fill();
      ctx.fillStyle = textColor;
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(d.label, x + bw / 2, h - 10);
      if (d.value > 0) {
        ctx.fillStyle = getCSSVar("--text");
        ctx.font = "11px system-ui, sans-serif";
        ctx.fillText(String(d.value), x + bw / 2, y - 4);
      }
    });
  }

  /** Gráfica de anillo (donut) para porcentaje completado */
  function donutChart(canvas, pct, opts) {
    opts = opts || {};
    const { ctx, w, h } = setupCanvas(canvas);
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const r = Math.min(w, h) / 2 - 12;
    const lineWidth = 14;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = getCSSVar("--surface-2");
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, getCSSVar("--violet"));
    grad.addColorStop(0.5, getCSSVar("--coral"));
    grad.addColorStop(1, getCSSVar("--teal"));
    ctx.strokeStyle = grad;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (pct / 100));
    ctx.stroke();

    ctx.fillStyle = getCSSVar("--text");
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(pct + "%", cx, cy);
  }

  /** Línea de racha de los últimos N días */
  function lineChart(canvas, points, opts) {
    opts = opts || {};
    const { ctx, w, h } = setupCanvas(canvas);
    ctx.clearRect(0, 0, w, h);
    const padding = { top: 16, right: 12, bottom: 24, left: 12 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    const max = Math.max(1, ...points.map((p) => p.value));
    const stepX = chartW / Math.max(1, points.length - 1);

    ctx.strokeStyle = getCSSVar("--violet");
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + (chartH - (p.value / max) * chartH);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    points.forEach((p, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + (chartH - (p.value / max) * chartH);
      ctx.fillStyle = getCSSVar("--coral");
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = getCSSVar("--text-muted");
    ctx.font = "10px system-ui, sans-serif";
    ctx.textAlign = "center";
    if (points.length) {
      ctx.fillText(points[0].label, padding.left, h - 6);
      ctx.fillText(points[points.length - 1].label, w - padding.right, h - 6);
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  App.Charts = { barChart, donutChart, lineChart };
})(window.App = window.App || {});
