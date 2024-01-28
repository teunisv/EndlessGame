const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const blockSize = 20;
const blockSpeed = 2;

const PURPLE = "#4d3c88";
const YELLOW = "#f0ac31";

const gridWidth = canvas.width / blockSize;
const gridHeight = canvas.height / blockSize;

const cellGrid = Array(gridHeight).fill().map(() => Array(gridWidth).fill(0));

class cell {
	constructor(x, y, width, height, isPurple) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = isPurple ? PURPLE : YELLOW;
	}
	
	Draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
	
	checkCollision(block) {
		//Diffrent colors do not collied
		if(this.color != block.color) return {L: 0, T: 0, B: 0, R: 0, U: 0};
		const fblock = block.getFutureSelf();
		
		const left = Math.max(this.x, fblock.x);
		const right = Math.min(this.x + this.width, fblock.x + fblock.width);
		const top = Math.max(this.y, fblock.y);
		const bottom = Math.min(this.y + this.height, fblock.y + fblock.height);
		
		const xOverlap = Math.max(0, right - left);
		const yOverlap = Math.max(0, bottom - top);

		const B = left > this.x ? 0 : xOverlap / this.width;
		const R = top > this.y ? 0 : yOverlap / this.height;
		const T = right < (this.x + this.width) ? 0 : xOverlap / fblock.width;
		const L = bottom < (this.y + this.height) ? 0 : yOverlap / fblock.height;
		const U = Math.max(L, T, R, B)
	
		return { L, T, R, B, U };

	}
	
	flipColor() {
		this.color = this.color === PURPLE ? YELLOW : PURPLE;
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
		return { x: this.x + this.vx, y: this.y + this.vy, width: this.width, height: this.height };
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
		return;
	}
	const cell = cellGrid[y][x];
	const cc = cell.checkCollision(block);
	return {cell, cc };
}

function flipGrid(x,y, ltrbu, block) {
	cellGrid[y][x].flipColor();
		
	if(ltrbu.L === ltrbu.U || ltrbu.R === ltrbu.U) { block.vx *= -1;} 
	else { block.vy *= -1; }
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
	const overlaps = [
		checkCollision(Math.floor(gX), Math.floor(gY), block),
		checkCollision(Math.floor(gX), Math.ceil(gY), block),
		checkCollision(Math.ceil(gX), Math.floor(gY), block),
		checkCollision(Math.ceil(gX), Math.ceil(gY), block)];
	const U = Math.max(...overlaps.map(o => o.cc.U));
	if(U > 0)
	{		
		const collision = overlaps.find(o => o.cc.U === U);
		collision.cell.flipColor();
		if(collision.cc.L === collision.cc.U || collision.cc.R === collision.cc.U) { block.vx *= -1;} 
		else { block.vy *= -1; }
		return;
	}
	
	block.x += block.vx;
	block.y += block.vy;
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

for (let y = 0; y < gridHeight; y++) {
  for (let x = 0; x < gridWidth; x++) {
	  cellGrid[y][x] = new cell(x * blockSize, y * blockSize, blockSize, blockSize, (x < (gridWidth / 2)))
  }
}

update();