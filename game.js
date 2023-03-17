const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scale = 20;

// Game variables
let gameLoop;
let board = [];
let currentPiece;
let position = { x: 0, y: 0 };

const colors = [
  "#FFA600", // Orange
  "#FF4C29", // Red
  "#FFD300", // Yellow
  "#00A4CC", // Blue
  "#5FBFF9", // Light Blue
  "#F564E3", // Pink
  "#8AC926", // Green
  "#FFCA1E", // Gold
];

const pieces = [
  {
    shape: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ], color: colors[0]
  },
  {
    shape: [
      [1, 1],
      [1, 1],
      [1, 1],
    ], color: colors[1]
  },
  {
    shape: [
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 1],
    ], color: colors[2]
  },
  {
    shape: [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, 0],
    ], color: colors[3]
  },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ], color: colors[4]
  },
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ], color: colors[5]
  },
  {
    shape: [
      [1, 1, 1, 1, 1],
    ], color: colors[6]
  },
  {
    shape: [
      [0, 1],
      [1, 1],
      [1, 0],
    ], color: colors[7]
  },
  {
    shape: [
      [1, 0],
      [1, 1],
      [1, 0],
      [1, 0],
    ], color: colors[8]
  },
  {
    shape: [
      [1, 1, 1, 1],
      [0, 1, 0, 0],
    ], color: colors[9]
  },
  {
    shape: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ], color: colors[10]
  },
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0],
    ], color: colors[11]
  },
  {
    shape: [
      [1, 1, 0, 1],
      [0, 0, 1, 1],
    ], color: colors[12]
  },
  {
    shape: [
      [1, 1, 1],
      [1, 0, 1],
    ], color: colors[13]
  },
  {
    shape: [
      [0, 1],
      [1, 1],
      [0, 1],
      [1, 0],
    ], color: colors[14]
  },
  {
    shape: [
      [1, 1],
      [1, 0],
      [1, 1],
    ], color: colors[0]
  },
];



function createBoard() {
  for (let y = 0; y < canvas.height / scale; y++) {
    board[y] = [];
    for (let x = 0; x < canvas.width / scale; x++) {
      board[y][x] = 0;
    }
  }
}

function newPiece() {
  const randomIndex = Math.floor(Math.random() * pieces.length);
  currentPiece = pieces[randomIndex];
  position = { x: Math.floor(board[0].length / 2) - 1, y: 0 };
}

function startGame() {
  createBoard();
  newPiece();
  gameLoop = setInterval(update, 1000 / 2);
}

function update() {
  position.y++;

  if (collision()) {
    position.y--;
    merge();
    newPiece();
    if (collision()) {
      // Game over
      clearInterval(gameLoop);
    }
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the board
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x]) {
        ctx.fillStyle = colors[board[y][x] - 1];
        ctx.fillRect(x * scale, y * scale, scale, scale);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(x * scale, y * scale, scale, scale);
      }
    }
  }

  // Draw the current piece
  ctx.fillStyle = currentPiece.color;
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        ctx.fillRect((position.x + x) * scale, (position.y + y) * scale, scale, scale);
        ctx.strokeStyle = 'white';
        ctx.strokeRect((position.x + x) * scale, (position.y + y) * scale, scale, scale);
      }
    }
  }
}

function collision() {
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x] &&
        (board[position.y + y] === undefined || board[position.y + y][position.x + x] === undefined ||
          board[position.y + y][position.x + x])) {
        return true;
      }
    }
  }
  return false;
}

function merge() {
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        board[position.y + y][position.x + x] = 1;
      }
    }
  }
}

function move(dir) {
  position.x += dir;
  if (collision()) {
    position.x -= dir;
  }
}

function rotate() {
  const prevPiece = currentPiece;
  currentPiece = {
    ...currentPiece,
    shape: currentPiece.shape[0].map((_, i) => currentPiece.shape.map(row => row[i])).reverse()
  };
  if (collision()) {
    currentPiece = prevPiece;
  }
}

// Event listeners for user input
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    rotate();
  } else if (event.key === 'ArrowDown') {
    position.y++;
    if (collision()) {
      position.y--;
    }
  } else if (event.key === 'ArrowLeft') {
    move(-1);
  } else if (event.key === 'ArrowRight') {
    move(1);
  }
});

startGame();