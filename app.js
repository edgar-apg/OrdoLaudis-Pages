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

const guideSequences = {
  "laudes-first": ["invitatorio", "laudes"],
  "oficio-first": ["invitatorio", "oficio"],
  "oficio-laudes": ["invitatorio", "oficio", "laudes"],
  "quick": []
};

const guideLabels = {
  invitatorio: "Invitatorio",
  oficio: "Oficio de lectura",
  laudes: "Laudes"
};

let activeMode = "liturgia";
let activeKey = {
  liturgia: DEFAULT_KEY.liturgia,
  misal: DEFAULT_KEY.misal
};
let activeGuide = "quick";
let guideStep = 0;

const dateInput = document.getElementById("date");
const todayButton = document.getElementById("today");
const viewer = document.getElementById("viewer");
const modeButtons = document.querySelectorAll(".mode-tabs button");
const liturgiaTabs = document.getElementById("liturgia-tabs");
const misalTabs = document.getElementById("misal-tabs");
const prayerGuide = document.getElementById("prayer-guide");
const guideCards = document.querySelectorAll(".guide-card");
const guideStatus = document.getElementById("guide-status");
const guideNote = document.getElementById("guide-note");
const guideStepLabel = document.getElementById("guide-step-label");
const guideCurrentTitle = document.getElementById("guide-current-title");
const guidePrev = document.getElementById("guide-prev");
const guideNext = document.getElementById("guide-next");
const guideExit = document.getElementById("guide-exit");

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

function updateTabs() {
  modeButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.mode === activeMode);
  });

  liturgiaTabs.classList.toggle("hidden", activeMode !== "liturgia");
  misalTabs.classList.toggle("hidden", activeMode !== "misal");

  if (prayerGuide) {
    prayerGuide.style.display = activeMode === "liturgia" ? "" : "none";
  }

  document.querySelectorAll("#liturgia-tabs button").forEach(button => {
    button.classList.toggle("active", button.dataset.key === activeKey.liturgia);
  });

  document.querySelectorAll("#misal-tabs button").forEach(button => {
    button.classList.toggle("active", button.dataset.key === activeKey.misal);
  });
}

function setMode(mode) {
  activeMode = mode;

  if (activeMode === "misal") {
    activeGuide = "quick";
    guideStep = 0;
    updateGuideUI();
  }

  updateTabs();
  updateViewer();
}

function setKey(mode, key, fromGuide = false) {
  activeMode = mode;
  activeKey[mode] = key;

  if (mode === "liturgia" && !fromGuide) {
    activeGuide = "quick";
    guideStep = 0;
    updateGuideUI();
  }

  updateTabs();
  updateViewer();
}

function updateGuideUI() {
  const sequence = guideSequences[activeGuide] || [];

  guideCards.forEach(card => {
    card.classList.toggle("active", card.dataset.sequence === activeGuide);
  });

  if (!sequence.length) {
    guideStatus.classList.add("hidden");
    guideNote.classList.add("hidden");
    return;
  }

  const currentKey = sequence[guideStep];
  guideStatus.classList.remove("hidden");
  guideStepLabel.textContent = `Paso ${guideStep + 1} de ${sequence.length}`;
  guideCurrentTitle.textContent = guideLabels[currentKey] || currentKey;
  guidePrev.disabled = guideStep === 0;
  guideNext.textContent = guideStep === sequence.length - 1 ? "Terminar" : "Siguiente";
  guideNote.classList.toggle("hidden", activeGuide !== "oficio-laudes");
}

function startGuide(sequenceName) {
  activeGuide = sequenceName;
  guideStep = 0;

  const sequence = guideSequences[activeGuide] || [];

  if (sequence.length) {
    setKey("liturgia", sequence[guideStep], true);
  } else {
    setMode("liturgia");
  }

  updateGuideUI();
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
    startGuide(card.dataset.sequence);
  });
});

guidePrev.addEventListener("click", () => {
  const sequence = guideSequences[activeGuide] || [];
  if (!sequence.length || guideStep === 0) return;

  guideStep--;
  setKey("liturgia", sequence[guideStep], true);
  updateGuideUI();
});

guideNext.addEventListener("click", () => {
  const sequence = guideSequences[activeGuide] || [];
  if (!sequence.length) return;

  if (guideStep >= sequence.length - 1) {
    activeGuide = "quick";
    guideStep = 0;
    updateGuideUI();
    return;
  }

  guideStep++;
  setKey("liturgia", sequence[guideStep], true);
  updateGuideUI();
});

guideExit.addEventListener("click", () => {
  activeGuide = "quick";
  guideStep = 0;
  updateGuideUI();
});

dateInput.addEventListener("change", updateViewer);

todayButton.addEventListener("click", () => {
  dateInput.value = localDateString();
  updateViewer();
});

dateInput.value = localDateString();
updateGuideUI();
updateTabs();
updateViewer();

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
