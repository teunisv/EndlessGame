const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const blockSize = 20;
const blockSpeed = 2;

const gridWidth = canvas.width / blockSize;
const gridHeight = canvas.height / blockSize;

const grid = Array(gridHeight).fill().map(() => Array(gridWidth).fill(0));

const purpleBlock = {
  position: { x: canvas.width - blockSize, y: canvas.height / 2 },
  size: { width: blockSize, height: blockSize },
  color: 'purple',
  velocity: { x: Math.random() * 2 - 0.9, y: Math.random() * 2 - 0.9 },
};

const yellowBlock = {
  position: { x: 0, y: canvas.height / 2 },
  size: { width: blockSize, height: blockSize },
  color: 'yellow',  
  velocity: { x: Math.random() * 2 - 0.9, y: Math.random() * 2 - 0.9 },
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
  ctx.fillRect(block.position.x, block.position.y, block.size.width, block.size.height);
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
  const { x, y } = block.position;
  const { width, height } = block.size;
  const { x: vx, y: vy } = block.velocity;

  const newX = x + vx + (vx > 0 ? width : 0);
  const newY = y + vy + (vy > 0 ? height : 0);

  const gridX = Math.floor(newX / blockSize);
  const gridY = Math.floor(newY / blockSize);

  if (checkCollision(gridX, gridY, block.color)) {
	grid[gridY][gridX] = block.color === 'purple' ? 'yellow' : 'purple';
    block.velocity.x *= -1;
    block.velocity.y *= -1;
  } else {
    block.position.x += block.velocity.x;
    block.position.y += block.velocity.y;
  }

  if (newX < 0) {
    block.position.x = 0;
    block.velocity.x = -block.velocity.x;
  }
  if (newX + width > canvas.width) {
    block.position.x = canvas.width - width;
    block.velocity.x = -block.velocity.x;
  }
  if (newY < 0) {
    block.position.y = 0;
    block.velocity.y = -block.velocity.y;
  }
  if (newY + height > canvas.height) {
    block.position.y = canvas.height - height;
    block.velocity.y = -block.velocity.y;
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

function generateVector(block) {
  const vectorLength = Math.sqrt(Math.pow(blockSpeed, 2) * 2);
  const angle = Math.random() * Math.PI * 2;
  block.velocity.x = vectorLength * Math.cos(angle);
  block.velocity.y = vectorLength * Math.sin(angle);
}

for (let y = 0; y < gridHeight; y++) {
  for (let x = 0; x < gridWidth; x++) {
      grid[y][x] = (x >= (gridWidth / 2)) ? 'yellow' : 'purple';
  }
}
generateVector(purpleBlock)
generateVector(yellowBlock)

update();