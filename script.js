const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const blockSize = 20;
const blockSpeed = 2;

const gridWidth = canvas.width / blockSize;
const gridHeight = canvas.height / blockSize;

const grid = Array(gridHeight).fill().map(() => Array(gridWidth).fill(0));

const cellGrid = Array(gridHeight).fill().map(() => Array(gridWidth).fill(0));

class cell {
	constructor(x, y, width, height, isPurple) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = isPurple ? "purple" : "yellow";
	}
	
	Draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

class movingCell extends cell {
	constructor(x, y, width, height, isPurple) {
		super(x, y, width, height, isPurple);
		const vectorLength = Math.sqrt(Math.pow(blockSpeed, 2) * 2);
		const angle = Math.random() * Math.PI * 2;
		this.vx = vectorLength * Math.cos(angle);
		this.vy = vectorLength * Math.sin(angle);
	}
}

const purpleBlock = new movingCell(canvas.width - blockSize,canvas.height / 2- blockSize/2,blockSize,blockSize, true); 

const yellowBlock = new movingCell(0,canvas.height / 2 - blockSize/2,blockSize,blockSize, false); 

function drawGrid() {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
		cellGrid[y][x].Draw(ctx);
    }
  }
}

function checkCollision(x, y, color) {
	/*
  if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) {
    return false;
  }
  const cellColor = grid[y][x];
  if (cellColor === color) {
    return true;
  }
  return false;
  */
}

function updateBlock(block) {
	const gX = (block.x + block.vx) / block.width;
	const gY = (block.y + block.vy) / block.height;
//	console.log($'X:{gX}; Y:{gY}');
	/*
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
  }*/
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
	
  updateBlock(purpleBlock);
  updateBlock(yellowBlock);
  
  drawGrid();
  purpleBlock.Draw(ctx);
  yellowBlock.Draw(ctx);

  requestAnimationFrame(update);
}

function generateVector(block) {
	/*
  const vectorLength = Math.sqrt(Math.pow(blockSpeed, 2) * 2);
  const angle = Math.random() * Math.PI * 2;
  block.velocity.x = vectorLength * Math.cos(angle);
  block.velocity.y = vectorLength * Math.sin(angle);
  */
}

for (let y = 0; y < gridHeight; y++) {
  for (let x = 0; x < gridWidth; x++) {
	  cellGrid[y][x] = new cell(x * blockSize, y * blockSize, blockSize, blockSize, (x < (gridWidth / 2)))
  }
}
generateVector(purpleBlock)
generateVector(yellowBlock)

update();