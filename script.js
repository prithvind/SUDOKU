/* ================= BASE SUDOKU PATTERN ================= */
const basePuzzle = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9]
];

let puzzle = [];
let timerInterval;
let seconds = 0;

/* ================= SHUFFLE LOGIC ================= */
function shufflePuzzle() {
  const numbers = [1,2,3,4,5,6,7,8,9];

  // Shuffle numbers randomly
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  // Map shuffled numbers to base puzzle
  puzzle = basePuzzle.map(row =>
    row.map(cell => cell === 0 ? 0 : numbers[cell - 1])
  );
}

/* ================= GRID CREATION ================= */
function createGrid() {
  const grid = document.getElementById("sudoku-grid");
  grid.innerHTML = "";

  puzzle.forEach((row, r) => {
    row.forEach((value, c) => {
      const input = document.createElement("input");
      input.type = "number";
      input.min = 1;
      input.max = 9;

      if (value !== 0) {
        input.value = value;
        input.disabled = true;
        input.classList.add("prefilled");
      }

      input.addEventListener("input", () => validateCell(r, c, input));
      grid.appendChild(input);
    });
  });
}

/* ================= VALIDATION ================= */
function validateCell(row, col, cell) {
  cell.classList.remove("error");
  const value = cell.value;
  if (!value) return;

  const inputs = document.querySelectorAll("#sudoku-grid input");

  inputs.forEach((input, index) => {
    const r = Math.floor(index / 9);
    const c = index % 9;

    if (input !== cell && input.value === value) {
      if (
        r === row ||
        c === col ||
        (Math.floor(r / 3) === Math.floor(row / 3) &&
         Math.floor(c / 3) === Math.floor(col / 3))
      ) {
        cell.classList.add("error");
      }
    }
  });
}

/* ================= CHECK SOLUTION ================= */
function checkSolution() {
  const inputs = document.querySelectorAll("#sudoku-grid input");

  for (let input of inputs) {
    if (!input.value || input.classList.contains("error")) {
      document.getElementById("message").innerText =
        "❌ Incorrect or incomplete solution.";
      return;
    }
  }

  clearInterval(timerInterval);
  document.getElementById("winSound").play();
  document.getElementById("message").innerText =
    "🕵️ Case Solved. Elementary deduction.";
}

/* ================= TIMER ================= */
function startTimer() {
  clearInterval(timerInterval);
  seconds = 0;

  timerInterval = setInterval(() => {
    seconds++;
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    document.getElementById("timer").innerText = `Time: ${min}:${sec}`;
  }, 1000);
}

/* ================= NEW GAME ================= */
function newGame() {
  document.getElementById("message").innerText = "";
  shufflePuzzle();
  createGrid();
  startTimer();
}

/* ================= INITIAL LOAD ================= */
shufflePuzzle();
createGrid();
startTimer();
