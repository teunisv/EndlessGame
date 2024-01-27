const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const blockSize = 20;
const blockSpeed = 2;

const gridWidth = canvas.width / blockSize;
const gridHeight = canvas.height / blockSize;

const grid = Array(gridHeight).fill().map(() => Array(gridWidth).fill(0));

const purpleBlock = {
  x: canvas.width - blockSize,
  y: canvas.height / 2,
  color: 'purple',
  dx: blockSpeed,
  dy: 1.5,
  width: blockSize,
  height: blockSize
};

const yellowBlock = {
  x: 0,
  y: canvas.height / 2,
  color: 'yellow',
  dx: -blockSpeed,
  dy: -1.5,
  width: blockSize,
  height: blockSize
};

function drawGrid() {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      ctx.fillStyle = grid[y][x];
      ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }
  }
}

function drawBlock(block) {
  ctx.fillStyle = block.color;
  ctx.fillRect(block.x, block.y, block.width, block.height);
}

function checkCollision(x, y, color) {
  if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) {
    return false;
  }
  const cellColor = grid[y][x];
  if (cellColor === color) {
    return true;
  }
  return false;
}

function updateBlock(block) {
  const x = block.dx > 0 ? Math.ceil(block.x / blockSize) : Math.floor(block.x / blockSize);
  const y = Math.floor(block.y / blockSize);
  const dx = block.dx / blockSize;
  const dy = block.dy / blockSize;
  const newX = Math.round(x + dx);
  const newY = Math.round(y + dy);
  if (checkCollision(newX, newY, block.color)) {
//    block.color = block.color === 'purple' ? 'yellow' : 'purple';
	grid[newY][newX] = block.color === 'purple' ? 'yellow' : 'purple';
	block.dx *= -1;
	block.dy *= -1;
  } else {
    block.x += block.dx;
    block.y += block.dy;
  }
  if (block.x < 0) {
    block.x = 0;
    block.dx = -block.dx;
  }
  if (block.x + block.width > canvas.width) {
    block.x = canvas.width - block.width;
    block.dx = -block.dx;
  }
  if (block.y < 0) {
    block.y = 0;
    block.dy = -block.dy;
  }
  if (block.y + block.height > canvas.height) {
    block.y = canvas.height - block.height;
    block.dy = -block.dy;
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
	
  updateBlock(purpleBlock);
  updateBlock(yellowBlock);
  
  drawGrid();
  drawBlock(purpleBlock);
  drawBlock(yellowBlock);

  requestAnimationFrame(update);
}

for (let y = 0; y < gridHeight; y++) {
  for (let x = 0; x < gridWidth; x++) {
      grid[y][x] = (x >= (gridWidth / 2)) ? 'yellow' : 'purple';
  }
}
  
update();