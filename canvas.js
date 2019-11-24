/**
 * Bikin Minesweeper
 * 2nd Version
 */

const totalMines = 10;
const sisiKotak = 50;
const sizeGrid = 10;
const board = new Array(totalMines);
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let gameOver = false;

// inisialisasi board
for (let i = 0; i < totalMines; i++) {
  board[i] = new Array(totalMines);
  
  for (let j = 0; j < totalMines; j++) {
    board[i][j] = {
      value: 0,
      flag: false,
      revealed: false
    };
  }
}

// bikin mines
for (let i = 0; i < totalMines; i++) {
  let x = 0;
  let y = 0;

  do {
    x = Math.floor(Math.random() * totalMines);
    y = Math.floor(Math.random() * totalMines);
  } while (board[x][y].value === null);

  board[x][y].value = null;

  for (let ix = x-1; ix <= x+1; ix++) {
    for (let iy = y-1; iy <= y+1; iy++) {
      if (ix < 0 || ix >= sizeGrid ||
          iy < 0 || iy >= sizeGrid ||
          board[ix][iy].value === null) {
        continue;
      }

      board[ix][iy].value++;
    }
  }
}

// paint a cell
function paintCell(i, j, color) {
  ctx.translate(i*sisiKotak, j*sisiKotak);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, sisiKotak, sisiKotak);
  ctx.strokeRect(0, 0, sisiKotak, sisiKotak);
  ctx.fillStyle = 'black';
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// draw an empty board
for (let i = 0; i < sizeGrid; i++) {
  for (let j = 0; j < sizeGrid; j++) {
    paintCell(i, j, 'white');
  }
}

// reveal a single cell
function revealCell(i, j) {
  ctx.translate(i*sisiKotak + (sisiKotak/2), 
      j*sisiKotak + (sisiKotak/2));

  if (board[i][j].value === null) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'black';
  } else {
    ctx.font = '25px Fira Code';
    ctx.fillText(board[i][j].value, -7, 7);
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// reveal all cells
function revealAll() {
  for (let i = 0; i < totalMines; i++) {
    for (let j = 0; j < totalMines; j++) {
      if (!board[i][j].revealed) {
        revealCell(i, j);
      }
    }
  }
}

function floodFill(i, j) {
  const posMove = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [-1, -1]
  ];

  board[i][j].revealed = true;
  paintCell(i, j, 'grey');
  revealCell(i, j);

  for (let move of posMove) {
    if (i+move[0] >= 0 && i+move[0] < sizeGrid &&
        j+move[1] >= 0 && j+move[1] < sizeGrid &&
        !board[i+move[0]][j+move[1]].revealed &&
        !board[i+move[0]][j+move[1]].flag) { 
      if (board[i+move[0]][j+move[1]].value === 0) {
        floodFill(i+move[0], j+move[1]);
      } else {
        board[i+move[0]][j+move[1]].revealed = true;
        paintCell(i+move[0], j+move[1], 'grey');
        revealCell(i+move[0], j+move[1]);
      }
    }
  }
}

// peek a cell whenever users click a particular cell
function peekCell(i, j) {
  if (board[i][j].revealed || board[i][j].flag) {
    return;
  }

  if (board[i][j].value === null) {
    revealAll();
    gameOver = true;
    alert('YOU LOSE');
  } else  if (board[i][j].value === 0) {
    floodFill(i, j);
  } else {
    board[i][j].revealed = true;
    paintCell(i, j, 'grey');
    revealCell(i, j);
  }
}

// check if the winning condition is true
function isWinner() {
  let total = {safeCells: 0, flaggedMines: 0}
  for (let i = 0; i < totalMines; i++) {
    for (let j = 0; j < totalMines; j++) {
      total.safeCells += board[i][j].revealed;
      total.flaggedMines += board[i][j].flag &&
          board[i][j].value === null;
    } 
  }

  console.log(total);
  return (total.safeCells === sizeGrid*10 - totalMines) ||
      (total.flaggedMines === totalMines);
}

function flagCell(i, j) {
  if (board[i][j].revealed) {
    return;
  }

  if (board[i][j].flag) {
    paintCell(i, j, 'white');
    board[i][j].flag = false;
  } else {
    paintCell(i, j, 'orange');
    board[i][j].flag = true;
  }
}

// add even listener to the canvas
let clickCount = 0;
let singleClickTimer = undefined;
canvas.addEventListener('click', (e) => {
  let posX = Math.floor(e.offsetX / sisiKotak);
  let posY = Math.floor(e.offsetY / sisiKotak);

  if (gameOver) { return; }
  
  clickCount++;

  if (clickCount === 1) {
    singleClickTimer = setTimeout(() => {
      clickCount = 0;
      peekCell(posX, posY);
      if (isWinner()) {
        revealAll();
        alert('YOU WIN!');
      }
    }, 200);
  }

  if (clickCount === 2) {
    clearTimeout(singleClickTimer);
    clickCount = 0;
    flagCell(posX, posY);
    if (isWinner()) {
      revealAll();
      alert('YOU WIN!');
    }
  }
});