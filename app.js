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

const dateInput = document.getElementById("date");
const viewer = document.getElementById("viewer");
const todayBtn = document.getElementById("today");
const modeButtons = document.querySelectorAll(".mode-tabs button");
const liturgiaTabs = document.getElementById("liturgia-tabs");
const misalTabs = document.getElementById("misal-tabs");

let activeMode = "liturgia";
let activeKey = {
  liturgia: DEFAULT_KEY.liturgia,
  misal: DEFAULT_KEY.misal
};

function localDateString(d = new Date()){
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildUrl(){
  const file = SOURCES[activeMode][activeKey[activeMode]];
  const date = dateInput.value;
  const fecha = date ? `${date}T00:00:00` : "";
  return `${BASES[activeMode]}/${file}${fecha ? `?fecha=${encodeURIComponent(fecha)}` : ""}`;
}

function load(){
  viewer.src = buildUrl();
}

function setMode(mode){
  activeMode = mode;

  modeButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  liturgiaTabs.classList.toggle("hidden", mode !== "liturgia");
  misalTabs.classList.toggle("hidden", mode !== "misal");

  load();
}

function setupSectionTabs(container, mode){
  container.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      activeKey[mode] = btn.dataset.key;
      container.querySelectorAll("button").forEach(b => {
        b.classList.toggle("active", b === btn);
      });
      load();
    });
  });
}

dateInput.value = localDateString();

modeButtons.forEach(btn => {
  btn.addEventListener("click", () => setMode(btn.dataset.mode));
});

setupSectionTabs(liturgiaTabs, "liturgia");
setupSectionTabs(misalTabs, "misal");

dateInput.addEventListener("change", load);

todayBtn.addEventListener("click", () => {
  dateInput.value = localDateString();
  load();
});

load();
