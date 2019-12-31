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
let UP = 3;

let RUNNING = 0;
let GAME_OVER = 1;
let PAUSE = 2;

let bwidth = 40;
let bheight = 40;

let nwidth = 13;
let nheight = 19;

let xOffCanvas;
let yOffCanvas;

let matrix = [];
let background_matrix = [];

let type;
let typeNext;

let count;
let countOld;

let lineCount;
let timeDelayInSeconds;

let gameState;
let gameOrientation;
let gamePoints;

let rotateScreen;

function setup() {

  frameRate(10);

  createCanvas(windowWidth, windowHeight);
  xOffCanvas = (width - nwidth * bwidth) / 2;
  yOffCanvas = (height - nheight * bheight) / 2;

  start_game();

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  xOffCanvas = (width - nwidth * bwidth) / 2;
  yOffCanvas = (height - nheight * bheight) / 2;
}

function draw() {

  background("black");

  if (rotateScreen) {
    for (let i = 0; i < gameOrientation == 1; i++) {

      rotate(-PI / 2);
      translate(-(height + width) / 2, height / 2);
    }
  }

  if (gameState == PAUSE) {
  }

  if (gameState == PAUSE) {

    push();

    noStroke();
    fill(0, 0, 0, 15);
    rect(xOffCanvas, yOffCanvas, nwidth * bwidth, nheight * bheight);

    fill("white");
    textAlign(CENTER);

    textSize(60);
    text('PAUSED', width / 2, height / 2);

    textSize(20);
    text('Type <p> to continue', width / 2, height  * 0.8);

    pop();

  } else if (gameState == GAME_OVER) {
    push();

    noStroke();
    fill(0, 0, 0, 15);
    rect(xOffCanvas, yOffCanvas, nwidth * bwidth, nheight * bheight);

    fill("white");
    textAlign(CENTER);

    textSize(60);
    text('GAME OVER', width / 2, height / 2);

    textSize(20);
    text('Type <p> to continue', width / 2, height  * 0.8);

    pop();

  } else if (gameState == RUNNING) {


    if (frameCount % round(getFrameRate() * timeDelayInSeconds) == 0) {

        for (let x = 0; x < nwidth; x++) {
          background_matrix[x] = [];
        for (let y = 0; y < nheight; y++) {
          background_matrix[x][y] = round(random(0, 20));
        }
      }

    }

    // clear screen
    push();
    noStroke();
    for (let x = 0; x < nwidth; x++) {
      for (let y = 0; y < nheight; y++) {
        fill(background_matrix[x][y]);
        rect(xOffCanvas + x * bwidth, yOffCanvas + y * bheight, bwidth, bheight);
      }
    }
    stroke(200);
    noFill();
    rect(xOffCanvas, yOffCanvas, bwidth * nwidth, bheight * nheight);
    pop();

    // draw shadow
    push();
    for (let x = 0; x < nwidth; x++) {
      for (let y = 0; y < nheight; y++) {
        if (matrix[x][y] == (type + 10)) {
          noStroke();
          fill(255, 25);
          rect(xOffCanvas + x * bwidth, yOffCanvas + y * bheight, bwidth, bheight * (nheight - y));
          break;
        }
      }
    }
    pop();


    // draw matrix
    push();
    for (let x = 0; x < nwidth; x++) {
      for (let y = 0; y < nheight; y++) {
        let block_type = matrix[x][y];
        if (block_type == (type + 10)) { block_type = type; }

        if (block_type == I) { fill("cyan");   }
        if (block_type == O) { fill("yellow"); }
        if (block_type == T) { fill("purple"); }
        if (block_type == L) { fill("orange"); }
        if (block_type == J) { fill("blue");   }
        if (block_type == Z) { fill("red");    }
        if (block_type == S) { fill("green");  }

        if (block_type >= I && block_type <= S) {
          strokeWeight(4);
          stroke(200);
          rect(xOffCanvas + x * bwidth, yOffCanvas + y * bheight, bwidth, bheight);
        }

      }
    }
    pop();

    push();
    let xNext = get_block_x(typeNext);
    let yNext = get_block_y(typeNext);
    if (typeNext == I) { fill("cyan");   }
    if (typeNext == O) { fill("yellow"); }
    if (typeNext == T) { fill("purple"); }
    if (typeNext == L) { fill("orange"); }
    if (typeNext == J) { fill("blue");   }
    if (typeNext == Z) { fill("red");    }
    if (typeNext == S) { fill("green");  }
    for (let i = 0; i < 4; i ++) {
      strokeWeight(4);
      stroke(200);
      rect(xOffCanvas + (nwidth + 1 + xNext[i]) * bwidth, yOffCanvas + (2 + yNext[i]) * bheight, bwidth, bheight);
    }

    noStroke();
    fill("white");
    textAlign(LEFT);
    textSize(25);
    text(gamePoints, xOffCanvas + (nwidth + 1) * bwidth, yOffCanvas +  bheight);

    pop();



    update();

    if (frameCount % round(getFrameRate() * timeDelayInSeconds) == 0) {

      gamePoints++;

      move(DOWN);
      if (countOld < 4 && count < 4) {
        create_block();
        if (count < 4) {
            gameState = GAME_OVER;
        }
      }

    }

  }

}

function start_game() {

  gameState = RUNNING;
  gameOrientation = 0;
  gamePoints = 0;

  rotateScreen = true;

  lineCount = 0;
  timeDelayInSeconds = 1.5;

  typeNext = ceil(random(I - 1, S));

  for (let x = 0; x < nwidth; x++) {
    background_matrix[x] = [];
    for (let y = 0; y < nheight; y++) {
      background_matrix[x][y] = round(random(0, 20));
    }
  }

  for (let x = 0; x < nwidth; x++) {
    matrix[x] = [];
    for (let y = 0; y < nheight; y++) {
      matrix[x][y] = 0;
    }
  }
  create_block();

}

function get_block_x(block_type) {

  let x = [];
  if (block_type == I) { x = [0, 1, 2, 3]; }
  if (block_type == O) { x = [0, 1, 0, 1]; }
  if (block_type == T) { x = [0, 1, 2, 1]; }
  if (block_type == L) { x = [0, 1, 2, 0]; }
  if (block_type == J) { x = [0, 1, 2, 2]; }
  if (block_type == Z) { x = [0, 1, 1, 2]; }
  if (block_type == S) { x = [1, 2, 0, 1]; }

  return x;
}

function get_block_y(block_type) {

  let y = [];
  if (block_type == I) { y = [0, 0, 0, 0]; }
  if (block_type == O) { y = [0, 0, 1, 1]; }
  if (block_type == T) { y = [0, 0, 0, 1]; }
  if (block_type == L) { y = [0, 0, 0, 1]; }
  if (block_type == J) { y = [0, 0, 0, 1]; }
  if (block_type == Z) { y = [0, 0, 1, 1]; }
  if (block_type == S) { y = [0, 0, 1, 1]; }

  return y;
}


function create_block() {

  // assimilate previous active blocks
  for (let x = 0; x < nwidth; x++) {
    for (let y = 0; y < nheight; y++) {
      if (matrix[x][y] == (type + 10)) {
        matrix[x][y] = type;
      }
    }
  }

  type = typeNext;
  typeNext = ceil(random(I - 1, S));

  let x = get_block_x(type);
  let y = get_block_y(type);

  let xOff = 3;
  if (type == I) { xOff = 4; }
  if (type == O) { xOff = 2; }
  /*if (type == T || type == L || type == J || type == Z || type == S) {
    xOff = 3;
  }*/

  xOff = round((nwidth - xOff) / 2);

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

  for (let x = 0; x < nwidth; x++) {
    for (let y = 0; y < nheight; y++) {
      if (matrix[x][y] == (type + 10)) {
        xOld[count] = x;
        yOld[count] = y;
        if (!rotationMode) {
          xNew[count] = xOff + x;
          yNew[count] = yOff + y;
        } else {
          xNew[count] = xOff + y;
          yNew[count] = yOff - x;
        }
        if (xNew[count] >= 0 && xNew[count] < nwidth && yNew[count] >= 0 && yNew[count] < nheight) {
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

    if (rotationMode) {
      gameOrientation = (gameOrientation + 1) % 4;
    }

  }

}


function update() {

  for (let y = nheight - 1; y >= 0; y--) {
    let ycount = 0;
    for (let x = 0; x < nwidth; x++) {
      if (matrix[x][y] >= I && matrix[x][y] <= S) {
        ycount++;
      }
    }

    if (ycount == nwidth) {

      lineCount++;
      gamePoints = round(gamePoints * 1.10);

      for (let x = 0; x < nwidth; x++) {
        if (matrix[x][y] >= I && matrix[x][y] <= S) {
          matrix[x][y] = 0;
        }
      }
      for (let z = y - 1; z >= 0; z--) {
        for (let x = 0; x < nwidth; x++) {
          if (matrix[x][z] >= I && matrix[x][z] <= S) {
              matrix[x][z + 1] = matrix[x][z];
              matrix[x][z] = 0;
          }
        }
      }

      y++;

    }

  }

  if (gameOrientation == 0) {
    if (keyIsDown(LEFT_ARROW))  { move(LEFT);  }
    if (keyIsDown(DOWN_ARROW))  { move(DOWN);  }
    if (keyIsDown(RIGHT_ARROW)) { move(RIGHT); }
    if (keyIsDown(UP_ARROW))    {              }
  } else if (gameOrientation == 1) {
    if (keyIsDown(DOWN_ARROW))  { move(LEFT);  }
    if (keyIsDown(RIGHT_ARROW)) { move(DOWN);  }
    if (keyIsDown(UP_ARROW))    { move(RIGHT); }
    if (keyIsDown(LEFT_ARROW))  {              }

  } else if (gameOrientation == 2) {
    if (keyIsDown(RIGHT_ARROW)) { move(LEFT);  }
    if (keyIsDown(UP_ARROW))    { move(DOWN);  }
    if (keyIsDown(LEFT_ARROW))  { move(RIGHT); }
    if (keyIsDown(DOWN_ARROW))  {              }

  } else if (gameOrientation == 3) {
    if (keyIsDown(UP_ARROW))    { move(LEFT);  }
    if (keyIsDown(LEFT_ARROW))  { move(DOWN);  }
    if (keyIsDown(DOWN_ARROW))  { move(RIGHT); }
    if (keyIsDown(RIGHT_ARROW)) {              }

  }



  // every 5 lines or every 5 seconds
  if (lineCount >= 5 || frameCount % round(getFrameRate() * 5) == 0) {
    lineCount = 0;
    timeDelayInSeconds = timeDelayInSeconds * 0.95;
  }

}

function keyTyped() {
  if (key === 'p') {
    if (gameState == PAUSE) {
      gameState = RUNNING;
    } else if (gameState == GAME_OVER) {
      start_game();
    } else if (gameState == RUNNING) {
      gameState = PAUSE;
    }
  }
  if (key === ' ') {
    turn();
  }
  if (key === 'r') {
    rotateScreen = !rotateScreen;
    if (!rotateScreen) {
      gameOrientation = 0;
    }
  }
  return false;

}

function keyPressed() {

}

function turn() {

  let xmin = nwidth;
  let ymin = nheight;
  let xmax = 0;

  for (let x = 0; x < nwidth; x++) {
    for (let y = 0; y < nheight; y++) {
      if (matrix[x][y] == (type + 10)) {
        if (x < xmin) {
          xmin = x;
        }
        if (x > xmax) {
          xmax = x;
        }
        if (y < ymin) {
          ymin = y;
        }
      }
    }
  }

  let xOff = xmin - ymin;
  let yOff = ymin + xmax;

  moveWithOffset(xOff, yOff, true);

}
