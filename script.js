const images = [
  "https://i.imgur.com/EowrMtY.jpeg",
  "https://i.imgur.com/An5VnsM.jpeg",
  "https://i.imgur.com/dAULmVs.jpeg",
  "https://i.imgur.com/S5i8M9t.jpeg",
  "https://i.imgur.com/a14FbAi.jpeg",
  "https://i.imgur.com/ymeKsVv.jpeg",
  "https://i.imgur.com/dSOCFyL.jpeg",
  "https://i.imgur.com/z1Ge8W7.jpeg"
];

let firstCard = null;
let lock = false;
let flips = 0;
let time = 100;
let timer;

const container = document.getElementById("game-container");
const flipDisplay = document.getElementById("flips");
const timeDisplay = document.getElementById("time-remaining");
const startScreen = document.getElementById("start-screen");

const gameSection = document.getElementById("game-section");
const aboutSection = document.getElementById("about-section");
const instructionsSection = document.getElementById("instructions-section");

function createBoard() {
  container.innerHTML = "";
  const doubled = [...images, ...images];
  doubled.sort(() => 0.5 - Math.random());
  doubled.forEach(src => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-front">
        <img src="${src}">
      </div>
      <div class="card-back"></div>
    `;
    card.addEventListener("click", () => flipCard(card, src));
    container.appendChild(card);
  });
}

function flipCard(card, src) {
  if (lock || card.classList.contains("visible")) return;
  card.classList.add("visible");
  flips++;
  flipDisplay.textContent = flips;
  if (!firstCard) {
    firstCard = { card, src };
    return;
  }
  if (firstCard.src === src) {
    firstCard = null;
    checkWin();
  } else {
    lock = true;
    setTimeout(() => {
      card.classList.remove("visible");
      firstCard.card.classList.remove("visible");
      firstCard = null;
      lock = false;
    }, 800);
  }
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    time--;
    timeDisplay.textContent = time;
    if (time <= 0) {
      clearInterval(timer);
      document.getElementById("game-over-text").classList.add("visible");
    }
  }, 1000);
}

function checkWin() {
  const allVisible = [...document.querySelectorAll(".card")].every(card => card.classList.contains("visible"));
  if (allVisible) {
    clearInterval(timer);
    document.getElementById("victory-text").classList.add("visible");
  }
}

startScreen.addEventListener("click", () => {
  startScreen.style.display = "none";
  flips = 0;
  time = 100;
  flipDisplay.textContent = 0;
  timeDisplay.textContent = time;
  createBoard();
  startTimer();
});

document.querySelectorAll("#game-over-text, #victory-text").forEach(overlay => {
  overlay.addEventListener("click", () => {
    overlay.classList.remove("visible");
    flips = 0;
    time = 100;
    firstCard = null;
    lock = false;
    flipDisplay.textContent = 0;
    timeDisplay.textContent = time;
    document.querySelectorAll(".card").forEach(card => card.classList.remove("visible"));
    createBoard();
    startTimer();
  });
});

document.getElementById("homeBtn").onclick = () => {
  gameSection.classList.remove("hidden");
  aboutSection.classList.add("hidden");
  instructionsSection.classList.add("hidden");
};

document.getElementById("aboutBtn").onclick = () => {
  gameSection.classList.add("hidden");
  aboutSection.classList.remove("hidden");
  instructionsSection.classList.add("hidden");
};

document.getElementById("instructionsBtn").onclick = () => {
  gameSection.classList.add("hidden");
  aboutSection.classList.add("hidden");
  instructionsSection.classList.remove("hidden");
};

createBoard();
