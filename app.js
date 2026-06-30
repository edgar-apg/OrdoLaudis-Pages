/* Limpieza preventiva de Service Workers antiguos de pruebas previas */
(function cleanupOldOrdoCaches() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then(registrations => registrations.forEach(registration => registration.unregister()))
      .catch(() => {});
  }

  if ("caches" in window) {
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key.toLowerCase().includes("ordo"))
        .map(key => caches.delete(key))
      ))
      .catch(() => {});
  }
})();

const BASES = {
  liturgia: "https://sistemas.cem.org.mx/Controller/Liturgia",
  misal: "https://sistemas.cem.org.mx/Controller/Misal"
};

const SOURCES = {
  liturgia: {
    invitatorio: "invitatorio.php",
    oficio: "oficio.php",
    laudes: "laudes.php",
    tercia: "tercia.php",
    sexta: "sexta.php",
    nona: "nona.php",
    visperas: "visperas.php",
    completas: "completas.php"
  },
  misal: {
    ritos: "ritos_iniciales.php",
    palabra: "liturgia_palabra.php",
    eucaristica: "liturgia_eucaristica.php"
  }
};

const DEFAULT_KEY = {
  liturgia: "invitatorio",
  misal: "ritos"
};

const liturgyGuideSequences = {
  "laudes-first": [
    { mode: "liturgia", key: "invitatorio", label: "Invitatorio" },
    { mode: "liturgia", key: "laudes", label: "Laudes" }
  ],
  "oficio-first": [
    { mode: "liturgia", key: "invitatorio", label: "Invitatorio" },
    { mode: "liturgia", key: "oficio", label: "Oficio de lectura" }
  ],
  "oficio-laudes": [
    { mode: "liturgia", key: "invitatorio", label: "Invitatorio" },
    { mode: "liturgia", key: "oficio", label: "Oficio de lectura" },
    { mode: "liturgia", key: "laudes", label: "Laudes" }
  ],
  "quick": []
};

const liturgyGuideNames = {
  "laudes-first": "Laudes primero",
  "oficio-first": "Oficio primero",
  "oficio-laudes": "Oficio + Laudes",
  "quick": "Consulta rápida"
};

const misalGuideSequences = {
  "misa-habitual": [
    { mode: "misal", key: "ritos", label: "Ritos iniciales" },
    { mode: "misal", key: "palabra", label: "Liturgia de la Palabra" },
    { mode: "misal", key: "eucaristica", label: "Liturgia Eucarística" }
  ],
  "misa-visperas": [
    { mode: "liturgia", key: "visperas", label: "Vísperas" },
    { mode: "misal", key: "ritos", label: "Ritos iniciales" },
    { mode: "misal", key: "palabra", label: "Liturgia de la Palabra" },
    { mode: "misal", key: "eucaristica", label: "Liturgia Eucarística" }
  ],
  "quick": []
};

const misalGuideNames = {
  "misa-habitual": "Misa habitual",
  "misa-visperas": "Misa con Vísperas",
  "quick": "Consulta rápida"
};

let activeMode = "liturgia";
let activeKey = {
  liturgia: DEFAULT_KEY.liturgia,
  misal: DEFAULT_KEY.misal
};

let activeDailyTool = null;
let activeMisalTool = null;
let activeLiturgyGuide = "quick";
let liturgyGuideStep = 0;
let activeMisalGuide = "quick";
let misalGuideStep = 0;

const dateInput = document.getElementById("date");
const todayButton = document.getElementById("today");
const viewer = document.getElementById("viewer");
const modeButtons = document.querySelectorAll(".mode-tabs button");
const liturgiaTabs = document.getElementById("liturgia-tabs");
const misalTabs = document.getElementById("misal-tabs");

const dailyTools = document.getElementById("daily-tools");
const santoralToggle = document.getElementById("santoral-toggle");
const guideToggle = document.getElementById("guide-toggle");
const santoralSection = document.getElementById("dominican-santoral");
const prayerGuide = document.getElementById("prayer-guide");

const santoralSummary = document.getElementById("santoral-summary");
const santoralStatus = document.getElementById("santoral-status");
const santoralResult = document.getElementById("santoral-result");
const santoralPrimaryLink = document.getElementById("santoral-primary-link");

const guideSummary = document.getElementById("guide-summary");
const guideCards = document.querySelectorAll("[data-sequence]");
const guideStatus = document.getElementById("guide-status");
const guideNote = document.getElementById("guide-note");
const guideStepLabel = document.getElementById("guide-step-label");
const guideCurrentTitle = document.getElementById("guide-current-title");
const guidePrev = document.getElementById("guide-prev");
const guideNext = document.getElementById("guide-next");
const guideExit = document.getElementById("guide-exit");

const misalTools = document.getElementById("misal-tools");
const misalGuide = document.getElementById("misal-guide");
const misalGuideToggle = document.getElementById("misal-guide-toggle");
const misalGuideSummary = document.getElementById("misal-guide-summary");
const misalGuideCards = document.querySelectorAll("[data-misal-sequence]");
const misalGuideStatus = document.getElementById("misal-guide-status");
const misalGuideNote = document.getElementById("misal-guide-note");
const misalGuideStepLabel = document.getElementById("misal-guide-step-label");
const misalGuideCurrentTitle = document.getElementById("misal-guide-current-title");
const misalGuidePrev = document.getElementById("misal-guide-prev");
const misalGuideNext = document.getElementById("misal-guide-next");
const misalGuideExit = document.getElementById("misal-guide-exit");

const gospelToggle = document.getElementById("gospel-toggle");
const gospelPanel = document.getElementById("gospel-reflection");
const gospelSummary = document.getElementById("gospel-summary");
const gospelLink = document.getElementById("gospel-link");

const suggestedHourTitle = document.getElementById("suggested-hour-title");
const suggestedHourDetail = document.getElementById("suggested-hour-detail");
const viewerStatus = document.getElementById("viewer-status");
const viewerStatusTitle = document.getElementById("viewer-status-title");
const viewerStatusMessage = document.getElementById("viewer-status-message");
const viewerRetry = document.getElementById("viewer-retry");
const viewerOpenSource = document.getElementById("viewer-open-source");
const ordoFab = document.getElementById("ordo-fab");
const ordoFabMain = document.getElementById("ordo-fab-main");
const ordoFabMenu = document.getElementById("ordo-fab-menu");
const ordoFabGuideNext = document.getElementById("ordo-fab-guide-next");
const ordoFabMusicPause = document.getElementById("ordo-fab-music-pause");
let viewerLoadTimer = null;


function updateOrdoFabFooterOffset() {
  if (!ordoFab) return;

  const footer = document.querySelector("footer");
  const root = document.documentElement;
  const baseBottom = window.matchMedia("(max-width: 760px)").matches ? 14 : 18;

  if (!footer) {
    root.style.setProperty("--ordo-fab-bottom", `${baseBottom}px`);
    return;
  }

  const footerRect = footer.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const footerVisibleHeight = Math.max(0, viewportHeight - footerRect.top);
  const liftedBottom = footerVisibleHeight > 0
    ? footerVisibleHeight + 14
    : baseBottom;

  root.style.setProperty("--ordo-fab-bottom", `${Math.max(baseBottom, liftedBottom)}px`);
}

let ordoFabFooterRaf = null;

function scheduleOrdoFabFooterOffset() {
  if (ordoFabFooterRaf) return;

  ordoFabFooterRaf = window.requestAnimationFrame(() => {
    ordoFabFooterRaf = null;
    updateOrdoFabFooterOffset();
  });
}

window.addEventListener("scroll", scheduleOrdoFabFooterOffset, { passive: true });
window.addEventListener("resize", scheduleOrdoFabFooterOffset);
window.addEventListener("orientationchange", scheduleOrdoFabFooterOffset);
document.addEventListener("DOMContentLoaded", scheduleOrdoFabFooterOffset);
scheduleOrdoFabFooterOffset();



function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function selectedMonthDay() {
  return dateInput && dateInput.value ? dateInput.value.slice(5) : "";
}

function selectedDateLabel() {
  if (!dateInput || !dateInput.value) return "";
  const [year, month, day] = dateInput.value.split("-");
  const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${Number(day)} de ${months[Number(month) - 1]} de ${year}`;
}

function buildDominicosGospelUrl() {
  if (!dateInput || !dateInput.value) {
    return "https://www.dominicos.org/predicacion/evangelio-del-dia/";
  }

  const [year, month, day] = dateInput.value.split("-");
  return `https://www.dominicos.org/predicacion/evangelio-del-dia/${Number(day)}-${Number(month)}-${year}/`;
}

function updateGospelLink() {
  if (!gospelLink) return;

  const url = buildDominicosGospelUrl();
  gospelLink.href = url;
  gospelLink.textContent = "Abrir comentario";
  if (gospelSummary) {
    gospelSummary.textContent = selectedDateLabel() || "Abrir reflexión del día";
  }
}


const liturgicalHourLabels = {
  invitatorio: "Invitatorio",
  oficio: "Oficio de lectura",
  laudes: "Laudes",
  tercia: "Tercia",
  sexta: "Sexta",
  nona: "Nona",
  visperas: "Vísperas",
  completas: "Completas"
};

function isSelectedDateToday() {
  return dateInput && dateInput.value === localDateString();
}

function getSuggestedLiturgicalHour() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 10) {
    return {
      key: "laudes",
      title: "Laudes",
      detail: "Sugerida para la mañana."
    };
  }

  if (hour >= 10 && hour < 12) {
    return {
      key: "tercia",
      title: "Tercia",
      detail: "Sugerida para media mañana."
    };
  }

  if (hour >= 12 && hour < 15) {
    return {
      key: "sexta",
      title: "Sexta",
      detail: "Sugerida alrededor del mediodía."
    };
  }

  if (hour >= 15 && hour < 18) {
    return {
      key: "nona",
      title: "Nona",
      detail: "Sugerida para media tarde."
    };
  }

  if (hour >= 18 && hour < 21) {
    return {
      key: "visperas",
      title: "Vísperas",
      detail: "Sugerida para la tarde."
    };
  }

  return {
    key: "completas",
    title: "Completas",
    detail: "Sugerida para la noche."
  };
}

function updateSuggestedHourUI() {
  const suggestion = getSuggestedLiturgicalHour();

  if (suggestedHourTitle) {
    suggestedHourTitle.textContent = `${suggestion.title} · ${isSelectedDateToday() ? "para este momento" : "referencia del día"}`;
  }

  if (suggestedHourDetail) {
    suggestedHourDetail.textContent = isSelectedDateToday()
      ? suggestion.detail
      : "La fecha seleccionada no es hoy; la sugerencia se calcula según la hora actual.";
  }

  document.querySelectorAll("#liturgia-tabs button").forEach(button => {
    const suggested = activeMode === "liturgia" && isSelectedDateToday() && button.dataset.key === suggestion.key;
    button.classList.toggle("suggested-now", suggested);
    if (suggested) {
      button.setAttribute("title", "Hora sugerida según el momento del día");
    } else {
      button.removeAttribute("title");
    }
  });
}

function selectSuggestedHourOnEntry() {
  if (!dateInput || dateInput.value !== localDateString()) return;

  const suggestion = getSuggestedLiturgicalHour();
  activeMode = "liturgia";
  activeKey.liturgia = suggestion.key;

  resetLiturgyGuide();
  resetMisalGuide();
  activeDailyTool = null;
  activeMisalTool = null;
}



function buildUrl() {
  const file = SOURCES[activeMode][activeKey[activeMode]];
  const date = dateInput.value;
  const fecha = date ? `${date}T00:00:00` : "";
  return `${BASES[activeMode]}/${file}${fecha ? `?fecha=${encodeURIComponent(fecha)}` : ""}`;
}

function showViewerStatus(state, title, message) {
  // Desactivado: no se coloca ninguna capa sobre el iframe del CEM.
}

function hideViewerStatus() {
  // Desactivado: el iframe debe quedar siempre libre para los controles internos del CEM.
}


function focusCemViewer() {
  if (!viewer) return;

  try {
    viewer.focus({ preventScroll: true });
  } catch (error) {
    try {
      viewer.focus();
    } catch (innerError) {}
  }

  try {
    if (viewer.contentWindow) {
      viewer.contentWindow.focus();
    }
  } catch (error) {
    // El iframe es externo; si el navegador bloquea el foco interno,
    // simplemente dejamos enfocado el elemento iframe.
  }
}

function warmUpCemViewerFocus() {
  // Algunos navegadores requieren que el iframe externo quede enfocado
  // antes de que los controles internos del CEM respondan al primer clic.
  window.setTimeout(focusCemViewer, 80);
  window.setTimeout(focusCemViewer, 320);
  window.setTimeout(focusCemViewer, 900);
}

function updateViewer() {
  const url = buildUrl();

  clearTimeout(viewerLoadTimer);

  if (viewerOpenSource) {
    viewerOpenSource.href = url;
  }

  if (viewer) {
    viewer.dataset.loaded = "0";
    viewer.src = url;
    warmUpCemViewerFocus();
  }
}

function updateDailyToolsUI() {
  if (!dailyTools) return;

  const santoralOpen = activeDailyTool === "santoral";
  const guideOpen = activeDailyTool === "guide";

  dailyTools.classList.toggle("collapsed", !activeDailyTool);
  santoralToggle.classList.toggle("active", santoralOpen);
  guideToggle.classList.toggle("active", guideOpen);
  santoralToggle.setAttribute("aria-expanded", santoralOpen ? "true" : "false");
  guideToggle.setAttribute("aria-expanded", guideOpen ? "true" : "false");

  santoralSection.classList.toggle("hidden", !santoralOpen);
  prayerGuide.classList.toggle("hidden", !guideOpen);
}

function updateMisalToolsUI() {
  if (!misalTools) return;

  const guideOpen = activeMisalTool === "guide";
  const gospelOpen = activeMisalTool === "gospel";

  misalTools.classList.toggle("collapsed", !activeMisalTool);
  misalGuideToggle.classList.toggle("active", guideOpen);
  gospelToggle.classList.toggle("active", gospelOpen);
  misalGuideToggle.setAttribute("aria-expanded", guideOpen ? "true" : "false");
  gospelToggle.setAttribute("aria-expanded", gospelOpen ? "true" : "false");

  misalGuide.classList.toggle("hidden", !guideOpen);
  gospelPanel.classList.toggle("hidden", !gospelOpen);
}

function openDailyTool(tool) {
  activeDailyTool = activeDailyTool === tool ? null : tool;
  updateDailyToolsUI();
}

function openMisalTool(tool) {
  activeMisalTool = activeMisalTool === tool ? null : tool;
  updateMisalToolsUI();
}

function updateSantoral() {
  if (!santoralSummary || !santoralStatus || !santoralResult) return;

  const entries = (typeof DOMINICAN_SANTORAL !== "undefined" ? DOMINICAN_SANTORAL[selectedMonthDay()] : []) || [];
  const dateLabel = selectedDateLabel();

  if (!entries.length) {
    santoralSummary.textContent = "Sin memoria verificada";
    santoralStatus.textContent = `${dateLabel}: no hay memoria dominicana verificada en la selección actual.`;
    santoralResult.classList.add("hidden");
    santoralResult.innerHTML = "";

    if (santoralPrimaryLink) {
      santoralPrimaryLink.classList.add("hidden");
      santoralPrimaryLink.removeAttribute("href");
    }
    return;
  }

  santoralSummary.textContent = entries.length === 1 ? `Hoy: ${entries[0][0]}` : `Hoy: ${entries.length} memorias dominicanas`;
  santoralStatus.textContent = `${dateLabel}: hay memoria dominicana registrada. Consulta el propio y aplícalo según corresponda.`;
  santoralResult.innerHTML = entries.map(entry => `
    <article class="santoral-card">
      <span class="santoral-date">${dateLabel}</span>
      <strong class="santoral-title">${entry[0]}</strong>
      <span class="santoral-rank">${entry[1]}</span>
      ${entry[3] ? `<span class="santoral-has-office">Liturgia de las Horas</span>` : ""}
      ${entry[4] ? `<span class="santoral-has-office santoral-extra-tag">${entry[4]}</span>` : ""}
    </article>
  `).join("");
  santoralResult.classList.remove("hidden");

  if (santoralPrimaryLink) {
    santoralPrimaryLink.href = entries[0][2] || (typeof DOMINICAN_SANTORAL_SOURCE !== "undefined" ? DOMINICAN_SANTORAL_SOURCE : "#");
    santoralPrimaryLink.textContent = entries[0][2] === DOMINICAN_SANTORAL_SOURCE ? "Abrir santoral" : "Ver propio dominicano";
    santoralPrimaryLink.classList.remove("hidden");
  }
}


function scrollActiveLiturgyTabIntoView(behavior = "smooth") {
  if (!liturgiaTabs || activeMode !== "liturgia") return;

  const button = liturgiaTabs.querySelector(`button[data-key="${activeKey.liturgia}"]`);
  if (!button) return;

  window.requestAnimationFrame(() => {
    const tabRect = liturgiaTabs.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const delta = (buttonRect.left + buttonRect.width / 2) - (tabRect.left + tabRect.width / 2);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    liturgiaTabs.scrollTo({
      left: liturgiaTabs.scrollLeft + delta,
      behavior: prefersReducedMotion ? "auto" : behavior
    });
  });
}

function updateTabs() {
  modeButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.mode === activeMode);
  });

  liturgiaTabs.classList.toggle("hidden", activeMode !== "liturgia");
  misalTabs.classList.toggle("hidden", activeMode !== "misal");

  const misalGuideActive = activeMisalGuide !== "quick";

  if (dailyTools) {
    dailyTools.classList.toggle("hidden", !(activeMode === "liturgia" && !misalGuideActive));
  }

  if (misalTools) {
    misalTools.classList.toggle("hidden", !(activeMode === "misal" || misalGuideActive));
  }

  document.querySelectorAll("#liturgia-tabs button").forEach(button => {
    button.classList.toggle("active", button.dataset.key === activeKey.liturgia);
  });

  document.querySelectorAll("#misal-tabs button").forEach(button => {
    button.classList.toggle("active", button.dataset.key === activeKey.misal);
  });

  updateSuggestedHourUI();
  scrollActiveLiturgyTabIntoView();
}

function resetLiturgyGuide() {
  activeLiturgyGuide = "quick";
  liturgyGuideStep = 0;
  updateLiturgyGuideUI();
}

function resetMisalGuide() {
  activeMisalGuide = "quick";
  misalGuideStep = 0;
  updateMisalGuideUI();
}

function setMode(mode, fromGuide = false) {
  activeMode = mode;

  if (!fromGuide) {
    if (mode === "liturgia") resetMisalGuide();
    if (mode === "misal") resetLiturgyGuide();
  }

  updateTabs();
  updateViewer();
}

function setKey(mode, key, fromGuide = false) {
  activeMode = mode;
  activeKey[mode] = key;

  if (!fromGuide) {
    resetLiturgyGuide();
    resetMisalGuide();
  }

  updateTabs();
  updateViewer();
}

function updateLiturgyGuideUI() {
  const sequence = liturgyGuideSequences[activeLiturgyGuide] || [];

  guideCards.forEach(card => {
    card.classList.toggle("active", card.dataset.sequence === activeLiturgyGuide);
  });

  if (guideSummary) {
    guideSummary.textContent = !sequence.length
      ? "Consulta rápida"
      : `${liturgyGuideNames[activeLiturgyGuide]} · Paso ${liturgyGuideStep + 1}/${sequence.length}`;
  }

  if (prayerGuide) {
    prayerGuide.classList.toggle("running", !!sequence.length);
  }

  if (!sequence.length) {
    guideStatus.classList.add("hidden");
    guideNote.classList.add("hidden");
    return;
  }

  const current = sequence[liturgyGuideStep];
  guideStatus.classList.remove("hidden");
  guideStepLabel.textContent = `Paso ${liturgyGuideStep + 1} de ${sequence.length}`;
  guideCurrentTitle.textContent = current.label;
  guidePrev.disabled = liturgyGuideStep === 0;
  guideNext.textContent = liturgyGuideStep === sequence.length - 1 ? "Terminar" : "Siguiente";
  guideNote.classList.toggle("hidden", activeLiturgyGuide !== "oficio-laudes");
}

function updateMisalGuideUI() {
  const sequence = misalGuideSequences[activeMisalGuide] || [];

  misalGuideCards.forEach(card => {
    card.classList.toggle("active", card.dataset.misalSequence === activeMisalGuide);
  });

  if (misalGuideSummary) {
    misalGuideSummary.textContent = !sequence.length
      ? "Consulta rápida"
      : `${misalGuideNames[activeMisalGuide]} · Paso ${misalGuideStep + 1}/${sequence.length}`;
  }

  if (misalGuide) {
    misalGuide.classList.toggle("running", !!sequence.length);
  }

  if (!sequence.length) {
    misalGuideStatus.classList.add("hidden");
    misalGuideNote.classList.add("hidden");
    return;
  }

  const current = sequence[misalGuideStep];
  misalGuideStatus.classList.remove("hidden");
  misalGuideStepLabel.textContent = `Paso ${misalGuideStep + 1} de ${sequence.length}`;
  misalGuideCurrentTitle.textContent = current.label;
  misalGuidePrev.disabled = misalGuideStep === 0;
  misalGuideNext.textContent = misalGuideStep === sequence.length - 1 ? "Terminar" : "Siguiente";
  misalGuideNote.classList.toggle("hidden", activeMisalGuide !== "misa-visperas");
}

function startLiturgyGuide(sequenceName) {
  resetMisalGuide();
  activeLiturgyGuide = sequenceName;
  liturgyGuideStep = 0;

  const sequence = liturgyGuideSequences[activeLiturgyGuide] || [];

  if (sequence.length) {
    const first = sequence[liturgyGuideStep];
    setKey(first.mode, first.key, true);
  } else {
    setMode("liturgia", true);
  }

  activeDailyTool = "guide";
  updateLiturgyGuideUI();
  updateDailyToolsUI();
  updateTabs();
}

function startMisalGuide(sequenceName) {
  resetLiturgyGuide();
  activeMisalGuide = sequenceName;
  misalGuideStep = 0;

  const sequence = misalGuideSequences[activeMisalGuide] || [];

  if (sequence.length) {
    const first = sequence[misalGuideStep];
    setKey(first.mode, first.key, true);
  } else {
    setMode("misal", true);
  }

  activeMisalTool = "guide";
  updateMisalGuideUI();
  updateMisalToolsUI();
  updateTabs();
}


function addButtonPressFeedback(target) {
  if (!target || target.disabled || target.classList.contains("disabled")) return;

  target.classList.remove("is-button-pressing");
  // Forzar reinicio de la animación.
  void target.offsetWidth;
  target.classList.add("is-button-pressing");

  window.setTimeout(() => {
    target.classList.remove("is-button-pressing");
  }, 220);
}

document.addEventListener("pointerdown", event => {
  const target = event.target.closest(
    "button, .footer-help, .santoral-link, .gospel-link, .viewer-status-actions a"
  );

  if (!target) return;
  addButtonPressFeedback(target);
}, { passive: true });

if (santoralToggle) {
  santoralToggle.addEventListener("click", () => openDailyTool("santoral"));
}

if (guideToggle) {
  guideToggle.addEventListener("click", () => openDailyTool("guide"));
}

if (misalGuideToggle) {
  misalGuideToggle.addEventListener("click", () => openMisalTool("guide"));
}

if (gospelToggle) {
  gospelToggle.addEventListener("click", () => {
    updateGospelLink();
    openMisalTool("gospel");
  });
}

modeButtons.forEach(button => {
  button.addEventListener("click", () => {
    setMode(button.dataset.mode);
  });
});

document.querySelectorAll("#liturgia-tabs button").forEach(button => {
  button.addEventListener("click", () => {
    setKey("liturgia", button.dataset.key);
  });
});

document.querySelectorAll("#misal-tabs button").forEach(button => {
  button.addEventListener("click", () => {
    setKey("misal", button.dataset.key);
  });
});

guideCards.forEach(card => {
  card.addEventListener("click", () => {
    startLiturgyGuide(card.dataset.sequence);
  });
});

guidePrev.addEventListener("click", () => {
  const sequence = liturgyGuideSequences[activeLiturgyGuide] || [];
  if (!sequence.length || liturgyGuideStep === 0) return;

  liturgyGuideStep--;
  const current = sequence[liturgyGuideStep];
  setKey(current.mode, current.key, true);
  updateLiturgyGuideUI();
});

guideNext.addEventListener("click", () => {
  const sequence = liturgyGuideSequences[activeLiturgyGuide] || [];
  if (!sequence.length) return;

  if (liturgyGuideStep >= sequence.length - 1) {
    resetLiturgyGuide();
    updateTabs();
    return;
  }

  liturgyGuideStep++;
  const current = sequence[liturgyGuideStep];
  setKey(current.mode, current.key, true);
  updateLiturgyGuideUI();
});

guideExit.addEventListener("click", () => {
  resetLiturgyGuide();
  updateTabs();
});

misalGuideCards.forEach(card => {
  card.addEventListener("click", () => {
    startMisalGuide(card.dataset.misalSequence);
  });
});

misalGuidePrev.addEventListener("click", () => {
  const sequence = misalGuideSequences[activeMisalGuide] || [];
  if (!sequence.length || misalGuideStep === 0) return;

  misalGuideStep--;
  const current = sequence[misalGuideStep];
  setKey(current.mode, current.key, true);
  updateMisalGuideUI();
});

misalGuideNext.addEventListener("click", () => {
  const sequence = misalGuideSequences[activeMisalGuide] || [];
  if (!sequence.length) return;

  if (misalGuideStep >= sequence.length - 1) {
    resetMisalGuide();
    setMode("misal", true);
    updateTabs();
    return;
  }

  misalGuideStep++;
  const current = sequence[misalGuideStep];
  setKey(current.mode, current.key, true);
  updateMisalGuideUI();
});

misalGuideExit.addEventListener("click", () => {
  resetMisalGuide();
  setMode("misal", true);
  updateTabs();
});


dateInput.addEventListener("change", () => {
  if (isSelectedDateToday()) {
    selectSuggestedHourOnEntry();
    updateTabs();
  }

  updateViewer();
  updateSantoral();
  updateGospelLink();
  updateSuggestedHourUI();
});

todayButton.addEventListener("click", () => {
  dateInput.value = localDateString();
  selectSuggestedHourOnEntry();
  updateTabs();
  updateViewer();
  updateSantoral();
  updateGospelLink();
  updateSuggestedHourUI();
});

if (viewer) {
  viewer.addEventListener("load", () => {
    viewer.dataset.loaded = "1";
    clearTimeout(viewerLoadTimer);
    warmUpCemViewerFocus();
  });

  ["mouseenter", "pointerenter", "mouseover", "touchstart"].forEach(eventName => {
    viewer.addEventListener(eventName, () => {
      focusCemViewer();
    }, { passive: true });
  });
}

window.addEventListener("focus", () => {
  warmUpCemViewerFocus();
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    warmUpCemViewerFocus();
  }
});

if (viewerRetry) {
  viewerRetry.addEventListener("click", () => updateViewer());
}

dateInput.value = localDateString();
selectSuggestedHourOnEntry();
updateSantoral();
updateGospelLink();
updateDailyToolsUI();
updateMisalToolsUI();
updateLiturgyGuideUI();
updateMisalGuideUI();
updateTabs();
updateViewer();

/* Música ambiental aleatoria */
const musicTracks = [
  { src: "audio/universfield-relaxation-for-relaxing-145469.mp3", title: "Relaxation for Relaxing" },
  { src: "audio/universfield-serene-atmosphere-231725.mp3", title: "Serene Atmosphere" },
  { src: "audio/universfield-pleasant-atmosphere-153275.mp3", title: "Pleasant Atmosphere" },
  { src: "audio/universfield-calm-soulful-atmosphere-166464.mp3", title: "Calm Soulful Atmosphere" },
  { src: "audio/universfield-drifting-in-harmony-190651.mp3", title: "Drifting in Harmony" },
  { src: "audio/universfield-fading-memories-2-196564.mp3", title: "Fading Memories 2" },
  { src: "audio/universfield-serene-horizons-350986.mp3", title: "Serene Horizons" }
];

const musicToggle = document.getElementById("music-toggle");
const musicNext = document.getElementById("music-next");
const musicTrackLabel = document.getElementById("music-track");
const musicPanel = document.querySelector(".music-panel");
const ambientAudio = new Audio();

ambientAudio.preload = "none";
ambientAudio.volume = 0.45;

let currentTrackIndex = -1;
let musicStarted = false;

function pickRandomTrackIndex() {
  const lastStoredSrc = localStorage.getItem("ordoLastMusicTrack");
  const currentSrc = currentTrackIndex >= 0 ? musicTracks[currentTrackIndex].src : lastStoredSrc;

  let available = musicTracks
    .map((track, index) => ({ track, index }))
    .filter(item => item.track.src !== currentSrc);

  if (!available.length) {
    available = musicTracks.map((track, index) => ({ track, index }));
  }

  const selected = available[Math.floor(Math.random() * available.length)];
  return selected.index;
}

function loadTrack(index) {
  currentTrackIndex = index;
  const track = musicTracks[index];

  ambientAudio.src = track.src;
  musicTrackLabel.textContent = `${track.title} — Universfield / Pixabay`;
  localStorage.setItem("ordoLastMusicTrack", track.src);

  if (typeof renderOrdoFab === "function") {
    renderOrdoFab();
  }
}

function updateMusicUI(isPlaying) {
  musicToggle.textContent = isPlaying ? "❚❚ Pausar" : "♪ Música";
  musicToggle.setAttribute(
    "aria-label",
    isPlaying ? "Pausar música ambiental" : "Reproducir música ambiental"
  );

  if (musicPanel) {
    musicPanel.classList.toggle("is-playing", isPlaying);
  }

  if (typeof renderOrdoFab === "function") {
    renderOrdoFab();
  }
}

async function playRandomTrack(forceNew = false) {
  if (forceNew || currentTrackIndex < 0) {
    loadTrack(pickRandomTrackIndex());
  }

  try {
    await ambientAudio.play();
    musicStarted = true;
    updateMusicUI(true);
  } catch (error) {
    updateMusicUI(false);
    console.warn("No se pudo iniciar la música:", error);
  }
}

if (musicToggle && musicNext && musicTrackLabel) {
  musicToggle.addEventListener("click", () => {
    if (ambientAudio.paused) {
      playRandomTrack(!musicStarted);
    } else {
      ambientAudio.pause();
      updateMusicUI(false);
    }
  });

  musicNext.addEventListener("click", () => {
    playRandomTrack(true);
  });

  ambientAudio.addEventListener("ended", () => {
    playRandomTrack(true);
  });

  ambientAudio.addEventListener("pause", () => {
    if (!ambientAudio.ended) {
      updateMusicUI(false);
    }
  });

  ambientAudio.addEventListener("play", () => {
    updateMusicUI(true);
  });
}


/* Controles rápidos dinámicos: música + guía */
function getActiveGuideContext() {
  const liturgySequence = liturgyGuideSequences[activeLiturgyGuide] || [];
  const misalSequence = misalGuideSequences[activeMisalGuide] || [];

  if (activeLiturgyGuide !== "quick" && liturgySequence.length) {
    return {
      type: "liturgia",
      name: liturgyGuideNames[activeLiturgyGuide],
      step: liturgyGuideStep,
      total: liturgySequence.length,
      current: liturgySequence[liturgyGuideStep]
    };
  }

  if (activeMisalGuide !== "quick" && misalSequence.length) {
    return {
      type: "misal",
      name: misalGuideNames[activeMisalGuide],
      step: misalGuideStep,
      total: misalSequence.length,
      current: misalSequence[misalGuideStep]
    };
  }

  return null;
}

function isAmbientMusicActive() {
  return musicStarted || !ambientAudio.paused || currentTrackIndex >= 0;
}

function getCurrentTrackTitle() {
  return currentTrackIndex >= 0 && musicTracks[currentTrackIndex]
    ? musicTracks[currentTrackIndex].title
    : "Universfield / Pixabay";
}

function fabButton(action, label, className = "") {
  return `<button type="button" data-fab-action="${action}" class="${className}" role="menuitem">${label}</button>`;
}

function renderOrdoFab() {
  if (!ordoFab || !ordoFabMain || !ordoFabMenu) return;

  const guideContext = getActiveGuideContext();
  const hasGuideNextStep = !!guideContext && guideContext.step < guideContext.total - 1;
  const musicActive = isAmbientMusicActive();
  const isPlaying = !ambientAudio.paused;
  const html = [];

  if (guideContext) {
    html.push(`
      <div class="ordo-fab-status">
        <strong>${guideContext.name}</strong>
        <span>Paso ${guideContext.step + 1} de ${guideContext.total}: ${guideContext.current.label}</span>
      </div>
    `);

    html.push('<span class="ordo-fab-group">Guía activa</span>');
    html.push(fabButton("guide-next", guideContext.step >= guideContext.total - 1 ? "Terminar guía" : "Siguiente", "primary"));
    html.push(fabButton("guide-prev", "Anterior", guideContext.step === 0 ? "disabled" : ""));
    html.push(fabButton("guide-exit", "Salir de la guía", "danger"));
    html.push('<div class="ordo-fab-separator"></div>');
  }

  html.push('<span class="ordo-fab-group">Escoger guía de rezo</span>');
  html.push(fabButton("start-liturgy-laudes-first", "Laudes como primer rezo"));
  html.push(fabButton("start-liturgy-oficio-first", "Oficio de lectura primero"));
  html.push(fabButton("start-liturgy-oficio-laudes", "Oficio + Laudes"));
  html.push(fabButton("start-misal-misa-habitual", "Misa habitual"));
  html.push(fabButton("start-misal-misa-visperas", "Misa con Vísperas"));
  html.push('<div class="ordo-fab-separator"></div>');

  html.push('<span class="ordo-fab-group">Música</span>');

  if (musicActive) {
    html.push(`
      <div class="ordo-fab-status">
        <strong>Música ambiental</strong>
        <span>${getCurrentTrackTitle()}</span>
      </div>
    `);

    html.push(fabButton("music-toggle", isPlaying ? "Pausar música" : "Reproducir música", "primary"));
    html.push(fabButton("music-next", "Siguiente pista"));
  } else {
    html.push(fabButton("music-toggle", "Reproducir música", "primary"));
  }

  ordoFabMenu.innerHTML = html.join("");

  ordoFabMain.classList.remove("fab-action-guide", "fab-action-music", "fab-action-menu");
  ordoFabMain.innerHTML = `<span class="fab-icon-cross">✥</span><span class="fab-icon-music">♪</span>`;
  ordoFabMain.setAttribute("aria-label", "Abrir guía de rezo y música");
  ordoFabMain.setAttribute("title", "Guía de rezo y música");
  ordoFabMain.classList.add("fab-action-menu");
  ordoFabMain.classList.toggle("is-playing", isPlaying);
  ordoFabMain.classList.toggle("has-guide", !!guideContext);

  if (ordoFabGuideNext) {
    ordoFabGuideNext.classList.toggle("hidden", !hasGuideNextStep);
    ordoFabGuideNext.disabled = !hasGuideNextStep;
    ordoFabGuideNext.setAttribute(
      "aria-label",
      hasGuideNextStep
        ? `Siguiente paso del rezo guiado: ${guideContext.current.label}`
        : "No hay siguiente paso en esta guía"
    );
    ordoFabGuideNext.setAttribute(
      "title",
      hasGuideNextStep ? "Siguiente rezo" : "Último paso de la guía"
    );
  }

  if (ordoFabMusicPause) {
    ordoFabMusicPause.classList.toggle("hidden", !isPlaying);
  }


  scheduleOrdoFabFooterOffset();}

function openOrdoFab() {
  if (!ordoFab || !ordoFabMain) return;
  renderOrdoFab();
  ordoFab.classList.add("open");
  ordoFabMain.setAttribute("aria-expanded", "true");
  scheduleOrdoFabFooterOffset();
}

function closeOrdoFab() {
  if (!ordoFab || !ordoFabMain) return;

  if (ordoFab.classList.contains("open")) {
    ordoFab.classList.add("closing");
    window.setTimeout(() => {
      if (ordoFab) {
        ordoFab.classList.remove("closing");
      }
    }, 180);
  }

  ordoFab.classList.remove("open");
  ordoFabMain.setAttribute("aria-expanded", "false");
  scheduleOrdoFabFooterOffset();
}

function toggleOrdoFab(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (!ordoFab) return;

  if (ordoFab.classList.contains("open")) {
    closeOrdoFab();
  } else {
    openOrdoFab();
  }
}

function handleOrdoFabAction(action) {
  const guideContext = getActiveGuideContext();

  if (action === "start-liturgy-laudes-first") {
    startLiturgyGuide("laudes-first");
  }

  if (action === "start-liturgy-oficio-first") {
    startLiturgyGuide("oficio-first");
  }

  if (action === "start-liturgy-oficio-laudes") {
    startLiturgyGuide("oficio-laudes");
  }

  if (action === "start-misal-misa-habitual") {
    startMisalGuide("misa-habitual");
  }

  if (action === "start-misal-misa-visperas") {
    startMisalGuide("misa-visperas");
  }

  if (action === "music-toggle" && musicToggle) {
    musicToggle.click();
  }

  if (action === "music-next" && musicNext) {
    musicNext.click();
  }

  if (action === "guide-next" && guideContext) {
    if (guideContext.type === "liturgia") {
      guideNext.click();
    } else {
      misalGuideNext.click();
    }
  }

  if (action === "guide-prev" && guideContext && guideContext.step > 0) {
    if (guideContext.type === "liturgia") {
      guidePrev.click();
    } else {
      misalGuidePrev.click();
    }
  }

  if (action === "guide-exit" && guideContext) {
    if (guideContext.type === "liturgia") {
      guideExit.click();
    } else {
      misalGuideExit.click();
    }
  }

  renderOrdoFab();
}

if (ordoFabMain) {
  ordoFabMain.addEventListener("click", toggleOrdoFab);
}

if (ordoFabGuideNext) {
  ordoFabGuideNext.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    const guideContext = getActiveGuideContext();
    if (!guideContext || guideContext.step >= guideContext.total - 1) {
      renderOrdoFab();
      closeOrdoFab();
      return;
    }

    handleOrdoFabAction("guide-next");
    closeOrdoFab();
  });
}

if (ordoFabMusicPause) {
  ordoFabMusicPause.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    handleOrdoFabAction("music-toggle");
    closeOrdoFab();
  });
}

if (ordoFabMenu) {
  ordoFabMenu.addEventListener("click", event => {
    const button = event.target.closest("button[data-fab-action]");
    if (!button || button.classList.contains("disabled")) return;

    event.preventDefault();
    event.stopPropagation();
    handleOrdoFabAction(button.dataset.fabAction);
    closeOrdoFab();
  });
}

document.addEventListener("click", event => {
  if (!ordoFab || !ordoFab.classList.contains("open")) return;
  if (!ordoFab.contains(event.target)) closeOrdoFab();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeOrdoFab();
});

[guideNext, guidePrev, guideExit, misalGuideNext, misalGuidePrev, misalGuideExit, musicToggle, musicNext].forEach(control => {
  if (!control) return;
  control.addEventListener("click", () => {
    window.setTimeout(renderOrdoFab, 0);
  });
});

function addRippleEffect(event) {
  const target = event.target.closest("button, .santoral-link, .footer-help");
  if (!target || target.disabled || target.classList.contains("disabled")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement("span");

  ripple.className = "ripple";
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

  target.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
}

document.addEventListener("click", addRippleEffect);

renderOrdoFab();
updateSuggestedHourUI();
