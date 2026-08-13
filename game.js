const game = document.getElementById("game");
const menu = document.getElementById("menu");
const gameScreen = document.getElementById("gameScreen");

const startButton = document.getElementById("start");
const scoreText = document.getElementById("score");
const bestText = document.getElementById("best");

const levelName = document.getElementById("levelName");
const levelDisplay = document.getElementById("levelDisplay");

const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const finalBest = document.getElementById("finalBest");
const resultMessage = document.getElementById("resultMessage");
const restartButton = document.getElementById("restart");

let playerX = 0;
let playerY = 0;
let score = 0;
let playing = false;

let time = 30;
let timer;
let gameTime = 30;

let level = "medium";

const CELL_SIZE = 32;
const MAX_POSITION = 288;

let records = JSON.parse(
  localStorage.getItem("neonBlocksRecords")
) || {
  easy: 0,
  medium: 0,
  hard: 0
};

let targetX = 0;
let targetY = 0;


// Клеточки
for (let i = 0; i < 100; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  game.appendChild(cell);
}


// Игрок
const player = document.createElement("div");
player.className = "player";
game.appendChild(player);


// Звезда
const target = document.createElement("div");
target.className = "target";
target.textContent = "⭐";
game.appendChild(target);


// Время
const timeText = document.createElement("span");
timeText.id = "time";
timeText.textContent = "30";

const timeBox = document.createElement("div");
timeBox.innerHTML = "⏱️ Время: ";
timeBox.appendChild(timeText);

document.querySelector(".info").appendChild(timeBox);


// Рекорд
function getBest() {
  return records[level];
}

function updateBest() {
  bestText.textContent = getBest();
}


// Отрисовка
function draw() {
  player.style.left = playerX + "px";
  player.style.top = playerY + "px";

  target.style.left = targetX + "px";
  target.style.top = targetY + "px";
}


// Новая звезда
function newTarget() {

  targetX =
    Math.floor(Math.random() * 10) * CELL_SIZE;

  targetY =
    Math.floor(Math.random() * 10) * CELL_SIZE;

  // Чтобы звезда не появилась прямо под игроком
  if (
    targetX === playerX &&
    targetY === playerY
  ) {
    newTarget();
    return;
  }

  target.classList.remove("collect");

  draw();
}


// ✨ Частицы
function createParticles() {

  for (let i = 0; i < 10; i++) {

    const particle = document.createElement("div");

    particle.className = "particle";

    particle.style.left =
      targetX + 13 + "px";

    particle.style.top =
      targetY + 13 + "px";

    const x =
      Math.random() * 70 - 35 + "px";

    const y =
      Math.random() * 70 - 35 + "px";

    particle.style.setProperty("--x", x);
    particle.style.setProperty("--y", y);

    game.appendChild(particle);

    setTimeout(function() {
      particle.remove();
    }, 500);
  }
}


// 🟢 Лёгкий
document.getElementById("easy").onclick = function() {

  level = "easy";
  gameTime = 45;

  levelName.textContent =
    "🟢 Лёгкий уровень";

  levelDisplay.textContent =
    "🟢 Лёгкий";

  updateBest();
};


// 🟡 Средний
document.getElementById("medium").onclick = function() {

  level = "medium";
  gameTime = 30;

  levelName.textContent =
    "🟡 Средний уровень";

  levelDisplay.textContent =
    "🟡 Средний";

  updateBest();
};


// 🔴 Сложный
document.getElementById("hard").onclick = function() {

  level = "hard";
  gameTime = 20;

  levelName.textContent =
    "🔴 Сложный уровень";

  levelDisplay.textContent =
    "🔴 Сложный";

  updateBest();
};


// Начать игру
function startGame() {

  clearInterval(timer);

  menu.style.display = "none";

  gameScreen.style.display = "block";

  gameOver.style.display = "none";

  playing = true;

  score = 0;

  time = gameTime;

  playerX = 0;
  playerY = 0;

  scoreText.textContent = "0";

  timeText.textContent = time;

  updateBest();

  newTarget();


  timer = setInterval(function() {

    time--;

    timeText.textContent = time;

    if (time <= 0) {
      finishGame();
    }

  }, 1000);
}


startButton.onclick = startGame;


// Конец игры
function finishGame() {

  clearInterval(timer);

  playing = false;


  if (score > records[level]) {

    records[level] = score;

    localStorage.setItem(
      "neonBlocksRecords",
      JSON.stringify(records)
    );

    finalBest.textContent =
      "🏆 Новый рекорд: " + score;

    resultMessage.textContent =
      "🔥 Ты побила свой рекорд!";

  } else {

    finalBest.textContent =
      "🏆 Рекорд: " + records[level];

    resultMessage.textContent =
      "💪 Попробуй побить рекорд!";
  }


  finalScore.textContent =
    "⭐ Очки: " + score;

  gameOver.style.display = "flex";
}


// Движение
function movePlayer(dx, dy) {

  if (!playing) return;


  const newX = playerX + dx;
  const newY = playerY + dy;


  if (
    newX >= 0 &&
    newX <= MAX_POSITION
  ) {
    playerX = newX;
  }


  if (
    newY >= 0 &&
    newY <= MAX_POSITION
  ) {
    playerY = newY;
  }


  // ⭐ Собрали звезду
  if (
    playerX === targetX &&
    playerY === targetY
  ) {

    createParticles();

    target.classList.add("collect");

    score++;

    scoreText.textContent = score;

    playSound();


    setTimeout(function() {

      if (playing) {
        newTarget();
      }

    }, 350);
  }


  draw();
}


// Стрелки
document.getElementById("up").onclick = function() {
  movePlayer(0, -CELL_SIZE);
};

document.getElementById("down").onclick = function() {
  movePlayer(0, CELL_SIZE);
};

document.getElementById("left").onclick = function() {
  movePlayer(-CELL_SIZE, 0);
};

document.getElementById("right").onclick = function() {
  movePlayer(CELL_SIZE, 0);
};


// 🔊 Звук
function playSound() {

  const audio = new AudioContext();

  const oscillator =
    audio.createOscillator();

  const gain =
    audio.createGain();

  oscillator.frequency.value = 700;

  oscillator.type = "sine";

  gain.gain.value = 0.15;

  oscillator.connect(gain);

  gain.connect(audio.destination);

  oscillator.start();

  oscillator.stop(
    audio.currentTime + 0.12
  );
}


// Играть снова
restartButton.onclick = function() {

  gameOver.style.display = "none";

  startGame();
};


updateBest();

draw();
