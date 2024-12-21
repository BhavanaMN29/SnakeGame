// Game Constants
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const boxSize = 20;
const rows = canvas.height / boxSize;
const cols = canvas.width / boxSize;

let snake = [{ x: 5 * boxSize, y: 5 * boxSize }];
let direction = "RIGHT";
let food = {};
let powerUp = {};
let score = 0;
let level = 1;
let speed = 150;
let gameInterval;

// Sounds
const foodSound = document.getElementById("foodSound");
const gameOverSound = document.getElementById("gameOverSound");

// Utility Functions
const getRandomGridPosition = () => ({
  x: Math.floor(Math.random() * cols) * boxSize,
  y: Math.floor(Math.random() * rows) * boxSize,
});

const drawRect = (x, y, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, boxSize, boxSize);
  ctx.strokeStyle = "#34495e";
  ctx.strokeRect(x, y, boxSize, boxSize);
};

// Game Initialization
const initGame = () => {
  score = 0;
  level = 1;
  speed = 150;
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("level").textContent = `Level: ${level}`;
  snake = [{ x: 5 * boxSize, y: 5 * boxSize }];
  direction = "RIGHT";
  food = getRandomGridPosition();
  powerUp = getRandomGridPosition();
  clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, speed);
};

// Game Update Logic
const updateGame = () => {
  const head = { ...snake[0] };
  if (direction === "LEFT") head.x -= boxSize;
  if (direction === "UP") head.y -= boxSize;
  if (direction === "RIGHT") head.x += boxSize;
  if (direction === "DOWN") head.y += boxSize;

  // Collision Check
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameInterval);
    gameOverSound.play();
    alert("Game Over! Press Start Game to play again.");
    return;
  }

  // Check if Snake Eats Food
  if (head.x === food.x && head.y === food.y) {
    score += 1;
    foodSound.play();
    food = getRandomGridPosition();

    // Level Up Logic
    if (score % 5 === 0) {
      level += 1;
      speed -= 10;
      document.getElementById("level").textContent = `Level: ${level}`;
      clearInterval(gameInterval);
      gameInterval = setInterval(updateGame, speed);
    }
  } else if (head.x === powerUp.x && head.y === powerUp.y) {
    score += 2; // Double points
    powerUp = getRandomGridPosition();
  } else {
    snake.pop();
  }

  // Add New Head to Snake
  snake.unshift(head);

  // Update Score
  document.getElementById("score").textContent = `Score: ${score}`;

  // Redraw Game
  drawGame();
};

// Draw the Game
const drawGame = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Snake
  snake.forEach((segment, index) =>
    drawRect(segment.x, segment.y, index === 0 ? "#27ae60" : "#2ecc71")
  );

  // Draw Food
  drawRect(food.x, food.y, "#e74c3c");

  // Draw Power-Up
  drawRect(powerUp.x, powerUp.y, "#f1c40f");
};

// Direction Control
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Start Button
document.getElementById("startBtn").addEventListener("click", initGame);
