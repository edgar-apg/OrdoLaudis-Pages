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

const DOMINICAN_SANTORAL_SOURCE = "https://www.op.org.ar/nosotros/santos-y-santas/";
const DOMINICAN_SANTORAL = {
  "01-28": [
    [
      "Santo Tomás de Aquino",
      "Presbítero y doctor de la Iglesia",
      "https://www.op.org.ar/santo-tomas-de-aquino/"
    ]
  ],
  "04-05": [
    [
      "San Vicente Ferrer",
      "Presbítero",
      "https://www.op.org.ar/nosotros/santos-y-santas/"
    ]
  ],
  "04-29": [
    [
      "Santa Catalina de Siena",
      "Virgen y doctora de la Iglesia",
      "https://www.op.org.ar/nosotros/santos-y-santas/"
    ]
  ],
  "04-30": [
    [
      "San Pío V",
      "Papa",
      "https://www.op.org.ar/nosotros/santos-y-santas/"
    ]
  ],
  "07-22": [
    [
      "Santa María Magdalena",
      "Apóstol de los apóstoles",
      "https://www.op.org.ar/nosotros/santos-y-santas/"
    ]
  ],
  "08-08": [
    [
      "Nuestro Padre Santo Domingo",
      "Presbítero, fundador de la Orden de Predicadores",
      "https://www.op.org.ar/santo-domingo/"
    ]
  ],
  "08-23": [
    [
      "Santa Rosa de Lima",
      "Virgen",
      "https://www.op.org.ar/nosotros/santos-y-santas/"
    ]
  ],
  "08-28": [
    [
      "San Agustín de Hipona",
      "Obispo y doctor",
      "https://www.op.org.ar/nosotros/santos-y-santas/"
    ]
  ],
  "09-18": [
    [
      "San Juan Macías",
      "Hermano cooperador",
      "https://www.op.org.ar/nosotros/santos-y-santas/"
    ]
  ],
  "10-09": [
    [
      "San Luis Bertrán",
      "Presbítero",
      "https://www.op.org.ar/nosotros/santos-y-santas/"
    ]
  ],
  "11-03": [
    [
      "San Martín de Porres",
      "Hermano cooperador",
      "https://www.op.org.ar/san-martin-de-porres-hermano-cooperador/"
    ]
  ],
  "11-07": [
    [
      "Todos los Santos de la Orden de Predicadores",
      "Fiesta de la Familia Dominicana",
      "https://www.op.org.ar/todos-los-santos-de-la-orden-de-predicadores/"
    ]
  ],
  "11-15": [
    [
      "San Alberto Magno",
      "Obispo y doctor",
      "https://www.op.org.ar/nosotros/santos-y-santas/"
    ]
  ],
  "12-22": [
    [
      "Patrocinio de la Virgen María sobre la Familia Dominicana",
      "Memoria dominicana",
      "https://www.op.org.ar/nosotros/santos-y-santas/"
    ]
  ]
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

function buildUrl() {
  const file = SOURCES[activeMode][activeKey[activeMode]];
  const date = dateInput.value;
  const fecha = date ? `${date}T00:00:00` : "";
  return `${BASES[activeMode]}/${file}${fecha ? `?fecha=${encodeURIComponent(fecha)}` : ""}`;
}

function updateViewer() {
  viewer.src = buildUrl();
}

function setGuideExpanded(section, toggle, expanded) {
  if (!section || !toggle) return;
  section.classList.toggle("collapsed", !expanded);
  toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
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

function openDailyTool(tool) {
  activeDailyTool = activeDailyTool === tool ? null : tool;
  updateDailyToolsUI();
}

function updateSantoral() {
  if (!santoralSummary || !santoralStatus || !santoralResult) return;

  const entries = DOMINICAN_SANTORAL[selectedMonthDay()] || [];
  const dateLabel = selectedDateLabel();

  if (!entries.length) {
    santoralSummary.textContent = "Sin memoria registrada";
    santoralStatus.textContent = `${dateLabel}: no hay memoria dominicana registrada en esta primera selección del santoral.`;
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
      <span class="santoral-has-office">Liturgia de las Horas</span>
    </article>
  `).join("");
  santoralResult.classList.remove("hidden");

  if (santoralPrimaryLink) {
    santoralPrimaryLink.href = entries[0][2] || DOMINICAN_SANTORAL_SOURCE;
    santoralPrimaryLink.textContent = entries[0][2] === DOMINICAN_SANTORAL_SOURCE ? "Abrir santoral" : "Ver propio dominicano";
    santoralPrimaryLink.classList.remove("hidden");
  }
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

  if (misalGuide) {
    misalGuide.classList.toggle("hidden", !(activeMode === "misal" || misalGuideActive));
  }

  document.querySelectorAll("#liturgia-tabs button").forEach(button => {
    button.classList.toggle("active", button.dataset.key === activeKey.liturgia);
  });

  document.querySelectorAll("#misal-tabs button").forEach(button => {
    button.classList.toggle("active", button.dataset.key === activeKey.misal);
  });
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
    setGuideExpanded(misalGuide, misalGuideToggle, false);
  } else {
    setMode("misal", true);
  }

  updateMisalGuideUI();
  updateTabs();
}

if (santoralToggle) {
  santoralToggle.addEventListener("click", () => openDailyTool("santoral"));
}

if (guideToggle) {
  guideToggle.addEventListener("click", () => openDailyTool("guide"));
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

if (misalGuideToggle) {
  misalGuideToggle.addEventListener("click", () => {
    const expanded = misalGuide.classList.contains("collapsed");
    setGuideExpanded(misalGuide, misalGuideToggle, expanded);
  });
}

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
  updateViewer();
  updateSantoral();
});

todayButton.addEventListener("click", () => {
  dateInput.value = localDateString();
  updateViewer();
  updateSantoral();
});

dateInput.value = localDateString();
updateSantoral();
updateDailyToolsUI();
setGuideExpanded(misalGuide, misalGuideToggle, false);
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
