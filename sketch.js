let I = 1;
let O = 2;
let T = 3;
let L = 4;
let J = 5;
let Z = 6;
let S = 7;

let LEFT = 0;
let DOWN = 1;
let RIGHT = 2;

let LEFT_SWIPE = 2;
let RIGHT_SWIPE = 4;
let UP_SWIPE = 8;
let DOWN_SWIPE = 16;

let WELCOME = 0;
let RUNNING = 1;
let GAME_OVER = 2;
let PAUSE = 3;

let NWIDTH = 10;
let NHEIGHT = 20;

let blockSize;

let xOffCanvas;
let yOffCanvas;

let matrix = [];
let matrixBackground = [];

let type;
let typeNext;

let count;
let countOld;

let lineCount;
let timeDelayInSeconds;

let gameState;
let gameOrientation;
let gamePoints;

let allowScreenRotation;

function setup() {

  frameRate(10);

  createCanvas(windowWidth, windowHeight);
  computeCanvas();
  
  setupGestures();
  
  startGame();

}
function windowResized() {

  resizeCanvas(windowWidth, windowHeight);
  computeCanvas()

}

function computeCanvas() {

  blockSize =  min(width, height) / max(NWIDTH, NHEIGHT)

  xOffCanvas = - NWIDTH * blockSize / 2;
  yOffCanvas = - NHEIGHT * blockSize / 2;

}

function displayMessage(message) {
  fill(0, 150);
  stroke(0, 150);
  strokeWeight(4);
  rect(-width / 2, -height / 2, width, height);

  noStroke();
  fill('white');
  textAlign(CENTER);

  textSize(60);
  text(message,0, map(0.45, 0, 1, -height / 2, height / 2));

  textSize(30);
  text(gamePoints + " points", 0, map(0.55, 0, 1, -height / 2, height / 2));

  textSize(20);
  text('<p> to continue\n<r> to stop screen rotation', 0, map(0.85, 0, 1, -height / 2, height / 2));

}

function drawGame() {

  // start screen rotation
  push();
  rotate(HALF_PI * gameOrientation * allowScreenRotation);

  // background blocks
  stroke(50);
  strokeWeight(4);
  for (let x = 0; x < NWIDTH; x++) {
    for (let y = 0; y < NHEIGHT; y++) {
      fill(matrixBackground[x][y]);
      rect(xOffCanvas + x * blockSize, yOffCanvas + y * blockSize, blockSize, blockSize);
    }
  }

  // background border
  noFill();
  stroke(200);
  strokeWeight(4);
  rect(xOffCanvas, yOffCanvas, blockSize * NWIDTH, blockSize * NHEIGHT);

  // draw shadow
  for (let x = 0; x < NWIDTH; x++) {
    for (let y = 0; y < NHEIGHT; y++) {
      if (matrix[x][y] == (type + 10)) {
        let z = y + 1;
        while (z < NHEIGHT && matrix[x][z] == 0) {
          z++;
        }
        noStroke();
        fill(255, map(y, 0, NHEIGHT, 150, 70));
        rect(xOffCanvas + x * blockSize, yOffCanvas + y * blockSize, blockSize, blockSize * (z - y));
      }
    }
  }

  // draw matrix blocks
  for (let x = 0; x < NWIDTH; x++) {
    for (let y = 0; y < NHEIGHT; y++) {
      let blockType = matrix[x][y];
      if (blockType == (type + 10)) { blockType = type; }

      if (blockType >= I && blockType <= S) {
        fill(getColor(blockType));
        strokeWeight(4);
        stroke(200);
        rect(xOffCanvas + x * blockSize, yOffCanvas + y * blockSize, blockSize, blockSize);
      }

    }
  }

  // draw next block
  let xNext = getBlockX(typeNext);
  let yNext = getBlockY(typeNext);
  fill(getColor(typeNext));
  for (let i = 0; i < 4; i ++) {
    strokeWeight(4);
    stroke(200);
    rect(xOffCanvas + (NWIDTH + 1 + xNext[i]) * blockSize, yOffCanvas + (yNext[i]) * blockSize, blockSize, blockSize);
    //rect(xNext[i] * blockSize - width / 2, yNext[i] * blockSize - height / 2, blockSize, blockSize);
  }

  pop();
  // finish screen rotation
 
}

function draw() {
  background('black');

  translate(width / 2, height / 2);
  scale(0.9);

  drawGame();

  if (gameState == WELCOME) {

  } else if (gameState == RUNNING) {
    updateGame();
  }
  else if (gameState == PAUSE) {
    displayMessage('PAUSED');
  } else if (gameState == GAME_OVER) {
    displayMessage('GAME\nOVER');
  }

}

function getColor(blockType) {
  if      (blockType == I) { return 'cyan';   }
  else if (blockType == O) { return 'yellow'; }
  else if (blockType == T) { return 'purple'; }
  else if (blockType == L) { return 'orange'; }
  else if (blockType == J) { return 'blue';   }
  else if (blockType == Z) { return 'red';    }
  else if (blockType == S) { return 'green';  }
  else { return false; }
}

function startGame() {

  gameState = RUNNING;
  gameOrientation = 0;
  gamePoints = 0;

  allowScreenRotation = true;

  lineCount = 0;
  timeDelayInSeconds = 1.0;

  typeNext = ceil(random(I - 1, S));

  for (let x = 0; x < NWIDTH; x++) {
    matrixBackground[x] = [];
    for (let y = 0; y < NHEIGHT; y++) {
      matrixBackground[x][y] = round(random(0, map(y, 0, NHEIGHT, 0, 100)));
    }
  }

  for (let x = 0; x < NWIDTH; x++) {
    matrix[x] = [];
    for (let y = 0; y < NHEIGHT; y++) {
      matrix[x][y] = 0;
    }
  }
  createBlock();

}

function getBlockX(blockType) {

  let x = [];
  if (blockType == I) { x = [0, 1, 2, 3]; }
  if (blockType == O) { x = [0, 1, 0, 1]; }
  if (blockType == T) { x = [0, 1, 2, 1]; }
  if (blockType == L) { x = [0, 1, 2, 0]; }
  if (blockType == J) { x = [0, 1, 2, 2]; }
  if (blockType == Z) { x = [0, 1, 1, 2]; }
  if (blockType == S) { x = [1, 2, 0, 1]; }

  return x;
}

function getBlockY(blockType) {

  let y = [];
  if (blockType == I) { y = [0, 0, 0, 0]; }
  if (blockType == O) { y = [0, 0, 1, 1]; }
  if (blockType == T) { y = [0, 0, 0, 1]; }
  if (blockType == L) { y = [0, 0, 0, 1]; }
  if (blockType == J) { y = [0, 0, 0, 1]; }
  if (blockType == Z) { y = [0, 0, 1, 1]; }
  if (blockType == S) { y = [0, 0, 1, 1]; }

  return y;
}

function createBlock() {

  // assimilate previous active blocks
  for (let x = 0; x < NWIDTH; x++) {
    for (let y = 0; y < NHEIGHT; y++) {
      if (matrix[x][y] == (type + 10)) {
        matrix[x][y] = type;
      }
    }
  }

  type = typeNext;
  typeNext = ceil(random(I - 1, S));

  let x = getBlockX(type);
  let y = getBlockY(type);

  let xOff = 3;
  if (type == I) { xOff = 4; }
  if (type == O) { xOff = 2; }
  /*if (type == T || type == L || type == J || type == Z || type == S) {
    xOff = 3;
  }*/

  xOff = round((NWIDTH - xOff) / 2);

  count = 0;
  for (let i = 0; i < 4; i++) {
    if (matrix[x[i] + xOff][y[i]] == 0) {
      count++;
    }
  }

  if (count == 4) {
    for (let i = 0; i < 4; i++) {
      matrix[x[i] + xOff][y[i]] = type + 10;
    }
  }

}

function move(direction) {

  let xOff = 0;
  let yOff = 0;

  if (direction == LEFT)  { xOff = -1; }
  if (direction == RIGHT) { xOff =  1; }
  if (direction == DOWN)  { yOff =  1; }

  moveWithOffset(xOff, yOff, false);

}

function moveWithOffset(xOff, yOff, rotationMode) {

  let xOld = [0, 0, 0, 0];
  let yOld = [0, 0, 0, 0];

  let xNew = [0, 0, 0, 0];
  let yNew = [0, 0, 0, 0];

  countOld = count;
  count = 0;

  for (let x = 0; x < NWIDTH; x++) {
    for (let y = 0; y < NHEIGHT; y++) {
      if (matrix[x][y] == (type + 10)) {
        xOld[count] = x;
        yOld[count] = y;
        if (!rotationMode) {
          xNew[count] = xOff + x;
          yNew[count] = yOff + y;
        } else {
          xNew[count] = xOff - y;
          yNew[count] = yOff + x;
        }
        if (xNew[count] >= 0 && xNew[count] < NWIDTH && yNew[count] >= 0 && yNew[count] < NHEIGHT) {
          let v = matrix[xNew[count]][yNew[count]];
          if (v == 0 || v == (type + 10)) {
            count++;
          }
        }
      }
    }
  }

  if (count == 4) {
    for (let i = 0; i < 4; i++) {
      matrix[xOld[i]][yOld[i]] = 0;
    }

    for (let i = 0; i < 4; i++) {
      matrix[xNew[i]][yNew[i]] = (type + 10);
    }

    if (rotationMode && allowScreenRotation) {
      gameOrientation = (gameOrientation + 1) % 4;
    }

  }

}


function turn() {

  let xmin = NWIDTH;
  let ymin = NHEIGHT;
  let xmax = 0;
  let ymax = 0;

  for (let x = 0; x < NWIDTH; x++) {
    for (let y = 0; y < NHEIGHT; y++) {
      if (matrix[x][y] == (type + 10)) {
        if (x < xmin) { xmin = x; }
        if (x > xmax) { xmax = x; }
        if (y < ymin) { ymin = y; }
        if (y > ymax) { ymax = y; }
      }
    }
  }

  let xOff = xmin + ymax;
  let yOff = ymin - xmin;

  moveWithOffset(xOff, yOff, true);

}

function updateGame() {

  if (frameCount % round(getFrameRate() * timeDelayInSeconds * 2) == 0) {
    for (let x = 0; x < NWIDTH; x++) {
      matrixBackground[x] = [];
      for (let y = 0; y < NHEIGHT; y++) {
        matrixBackground[x][y] = round(random(0, map(y, 0, NHEIGHT, 0, 100)));
      }
    }

  }


  for (let y = NHEIGHT - 1; y >= 0; y--) {
    let ycount = 0;
    for (let x = 0; x < NWIDTH; x++) {
      if (matrix[x][y] >= I && matrix[x][y] <= S) {
        ycount++;
      }
    }

    if (ycount == NWIDTH) {

      lineCount++;
      gamePoints = round(gamePoints * 1.10);

      for (let x = 0; x < NWIDTH; x++) {
        if (matrix[x][y] >= I && matrix[x][y] <= S) {
          matrix[x][y] = 0;
        }
      }
      for (let z = y - 1; z >= 0; z--) {
        for (let x = 0; x < NWIDTH; x++) {
          if (matrix[x][z] >= I && matrix[x][z] <= S) {
              matrix[x][z + 1] = matrix[x][z];
              matrix[x][z] = 0;
          }
        }
      }

      y++;

    }

  }

  // every 5 lines or every 5 seconds
  if (lineCount >= 5 || frameCount % round(getFrameRate() * 5) == 0) {
    lineCount = 0;
    timeDelayInSeconds = timeDelayInSeconds * 0.95;
  }


  if (frameCount % round(getFrameRate() * timeDelayInSeconds) == 0) {

    gamePoints++;

    move(DOWN);
    if (countOld < 4 && count < 4) {
      createBlock();
      if (count < 4) {
          gameState = GAME_OVER;
      }
    }

  }


  if (keyIsDown(LEFT_ARROW)) {
    if ( gameOrientation == 0 ) { move(LEFT);  }
    if ( gameOrientation == 1 ) { move(DOWN);  }
    if ( gameOrientation == 2 ) { move(RIGHT); }
    if ( gameOrientation == 3 ) {              }
  }
  if (keyIsDown(RIGHT_ARROW)) {
    if ( gameOrientation == 2 ) { move(LEFT);  }
    if ( gameOrientation == 3 ) { move(DOWN);  }
    if ( gameOrientation == 0 ) { move(RIGHT); }
    if ( gameOrientation == 1 ) {              }
  }
  if (keyIsDown(UP_ARROW)) {
    if ( gameOrientation == 1 ) { move(LEFT);  }
    if ( gameOrientation == 2 ) { move(DOWN);  }
    if ( gameOrientation == 3 ) { move(RIGHT); }
    if ( gameOrientation == 0 ) {              }
  }
  if (keyIsDown(DOWN_ARROW)) {
    if ( gameOrientation == 3 ) { move(LEFT);  }
    if ( gameOrientation == 0 ) { move(DOWN);  }
    if ( gameOrientation == 1 ) { move(RIGHT); }
    if ( gameOrientation == 2 ) {              }
  }

}

function keyTyped() {
  let ROTATE_KEY = ' ';
  let PAUSE_KEY = 'p';
  let ROTATION_KEY = 'r';

  if (key === ROTATE_KEY) {
    turn();
  }
  else if (key === PAUSE_KEY) {
    changeGameState();
  }
  else if (key === ROTATION_KEY) {
    toggleScreenRotation();
  }
  return false;

}

function toggleScreenRotation() {

  allowScreenRotation = !allowScreenRotation;
  if (!allowScreenRotation) {
    gameOrientation = 0;
  }

}

function changeGameState() {

  if (gameState == PAUSE) {
    gameState = RUNNING;
  
  } else if (gameState == GAME_OVER) {
    startGame();
  
  } else if (gameState == RUNNING) {
    gameState = PAUSE;
  
  }

}

function setupGestures() {
  // set options to prevent default behaviors for swipe, pinch, etc
  let options = { preventDefault: true };

  // document.body registers gestures anywhere on the page
  let hammer = new Hammer(document.body, options);

  hammer.on('swipe tap press', onGesture);
  hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
  hammer.get('tap').set({ taps: 2 });

}

function onGesture(event) {

  if (event.type === "swipe" && gameState == RUNNING) {
    if (event.direction ==  LEFT_SWIPE ) {
      if ( gameOrientation == 0 ) { move(LEFT);  }
      if ( gameOrientation == 1 ) { move(DOWN);  }
      if ( gameOrientation == 2 ) { move(RIGHT); }
      if ( gameOrientation == 3 ) {              }
    }
    if (event.direction ==  RIGHT_SWIPE ) {
      if ( gameOrientation == 2 ) { move(LEFT);  }
      if ( gameOrientation == 3 ) { move(DOWN);  }
      if ( gameOrientation == 0 ) { move(RIGHT); }
      if ( gameOrientation == 1 ) {              }
    }
    if (event.direction ==  UP_SWIPE ) {
      if ( gameOrientation == 1 ) { move(LEFT);  }
      if ( gameOrientation == 2 ) { move(DOWN);  }
      if ( gameOrientation == 3 ) { move(RIGHT); }
      if ( gameOrientation == 0 ) {              }
    }
    if (event.direction ==  DOWN_SWIPE ) {
      if ( gameOrientation == 3 ) { move(LEFT);  }
      if ( gameOrientation == 0 ) { move(DOWN);  }
      if ( gameOrientation == 1 ) { move(RIGHT); }
      if ( gameOrientation == 2 ) {              }
    }

  } else if (event.type === "tap") {
    turn();

  } else if (event.type === "press") {
    changeGameState();

  }
}