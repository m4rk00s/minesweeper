const difficulty = 'easy'

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

/* atur lebar tinggi canvas */
canvas.height = 500;
canvas.width = 500;

var sisiKotak = 50;

var gameOver = false;

for (let i = 0; i < 10; i++) {
  ctx.translate(0, i * sisiKotak);

  for (let j = 0; j < 10; j++) {
    ctx.strokeRect(0, 0, sisiKotak, sisiKotak);
    ctx.translate(sisiKotak, 0);
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// initialize the board
var board = [];
var flagCellTable = [];
for (let i = 0; i < 10; i++) {
  board[i] = [];
  flagCellTable[i] = [];
  for (let j = 0; j < 10; j++) {
    board[i][j] = 0;
    flagCellTable[i][j] = false;
  }
}

for (let i = 0; i < 10; i++) {
  let x = Math.floor(Math.random() * 10);
  let y = Math.floor(Math.random() * 10);

  board[x][y] = Infinity;

  for (let ix = x - 1; ix <= x + 1; ix++) {
    if (ix < 0 || ix > 9) {
      continue;
    }

    for (let iy = y - 1; iy <= y + 1; iy++) {
      if (iy < 0 || iy > 9) {
        continue;
      }

      if (ix === x && iy === y) {
        continue;
      }

      board[ix][iy]++;
    }
  }
  // break;
}

console.log(board);

function drawCell(i, j) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(i * sisiKotak + (sisiKotak/2), j * sisiKotak + (sisiKotak/2));

  if (board[i][j] === Infinity) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, 2 * Math.PI);
    ctx.fill();
  } else {
    ctx.fillStyle = 'black';
    ctx.font = '25px Fira Code';
    ctx.fillText(board[i][j], -7, 7);
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function revealAll() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      drawCell(i, j);
    }
  }

  gameOver = true;
}

function revealCell(posX, posY) {

  // if (flagCellTable[posX][posY]) {
  //   return;
  // }

  if (board[posX][posY] === Infinity) {
    revealAll();
  } else {
    drawCell(posX, posY);
  }
}

function flagCell(posX, posY) {
  // let posX = Math.floor(e.offsetX / sisiKotak);
  // let posY = Math.floor(e.offsetY / sisiKotak);

  if (flagCellTable[posX][posY]) {
    flagCellTable[posX][posY] = false;
    ctx.fillStyle = 'white';
  } else {
    flagCellTable[posX][posY] = true;
    ctx.fillStyle = '#f4f4f4';
  }

  ctx.translate(posX * sisiKotak, posY * sisiKotak);
  ctx.fillRect(0, 0, sisiKotak, sisiKotak);
  ctx.strokeRect(0, 0, sisiKotak, sisiKotak);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// canvas.addEventListener('click', revealCell);
// canvas.addEventListener('dblclick', flagCell);
var clickCount = 0;

canvas.addEventListener('click', (e) => {
  if (gameOver) { return; }

  let posX = Math.floor(e.offsetX / sisiKotak);
  let posY = Math.floor(e.offsetY / sisiKotak);
  clickCount++;
  if (clickCount === 1) {
    singleClickTimer = setTimeout(() => {
      clickCount = 0;
      revealCell(posX, posY);
    }, 200);
  }
  
  if (clickCount === 2) {
    clearTimeout(singleClickTimer);
    clickCount = 0;
    flagCell(posX, posY);
  }
}, false);