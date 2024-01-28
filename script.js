const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const blockSize = 20;
const blockSpeed = 2;

const gridWidth = canvas.width / blockSize;
const gridHeight = canvas.height / blockSize;

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
	
	checkCollision(block) {
		//Diffrent colors do not collied
		if(this.color != block.color) return {L: 0, T: 0, B: 0, R: 0};
		const { fx1, fy1, fx2, fy2} = block.getFutureSelf();
		
		const xOverlap = Math.max(0, Math.min(this.x + this.width, fx2) - Math.max(this.x, fx1));
		const yOverlap = Math.max(0, Math.min(this.y + this.height, fy2) - Math.max(this.y, fy1));

		const L = xOverlap / this.width;
		const T = yOverlap / this.height;
		const R = xOverlap / block.width;
		const B = yOverlap / block.height;

		return { L, T, R, B };
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
	
	getFutureSelf() {
		return { fx1: this.x + this.vx, fy1: this.y + this.vy, fx2: this.x + this.vx + this.width, fy2: this.y + this.vy + this.height };
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

function checkCollision(x, y, block) {
	//Is it outside the grid ?
	if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) {
		return {L: 0, T: 0, B: 0, R: 0};
	}
	return cellGrid[y][x].checkCollision(block);
}

function updateBlock(block) {
	const nX = (block.x + block.vx);
	const nY = (block.y + block.vy);
	const gX = nX / block.width;
	const gY = nY / block.height;
	
	// If nX or nY is outside canvas bounch it; no need for any other checks
	if(
		(nX < 0) || 
		(nX + block.width > canvas.width)
	) { block.vx *= -1; return; }
	if(
		(nY < 0) ||
		(nY + block.height > canvas.height)
	) { block.vy *= -1; return; }
	//Since where still here check if collision with the grid
	checkCollision(Math.floor(gX), Math.floor(gY), block);
	checkCollision(Math.floor(gX), Math.ceil(gY), block);
	checkCollision(Math.ceil(gX), Math.floor(gY), block);
	checkCollision(Math.ceil(gX), Math.ceil(gY), block);
	
	block.x += block.vx;
	block.y += block.vy;
	
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
  //purpleBlock.Draw(ctx);
  yellowBlock.Draw(ctx);

  requestAnimationFrame(update);
}

for (let y = 0; y < gridHeight; y++) {
  for (let x = 0; x < gridWidth; x++) {
	  cellGrid[y][x] = new cell(x * blockSize, y * blockSize, blockSize, blockSize, (x < (gridWidth / 2)))
  }
}

update();