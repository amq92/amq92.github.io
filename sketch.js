let shapePoints = [];
let ringSliders = [];
let raySliders = [];
let rayColors = ['red', 'green', 'blue'];
let ringRadius = 200;
let focalLength = 50;
let ringWidth = 8;
let dotSize = 18;
let lineWidth = 6;

function setup() {

    createCanvas(windowWidth, windowHeight);
    textSize(28);

    for (let i = 0; i < 3; i++) {
        slider = createSlider(-180, 180, random(-180, 180));
        slider.position(30 + 160 * i, 60);
        slider.style('width', '120px');
        ringSliders.push(slider);
    }

    for (let i = 0; i < 3; i++) {
        let ringRaySliders = [];
        for (let j = 0; j < 3; j++) {
            slider = createSlider(-45, 45, random(-15, 15));
            slider.position(30 + 160 * i, 80 + 20 * (j + 1));
            slider.style('width', '120px');
            slider.addClass('ray-slider slider-' + rayColors[j]);
            ringRaySliders.push(slider);
        }
        raySliders.push(ringRaySliders);
    }

    shapePoints.push(createVector(40, 20));
    shapePoints.push(createVector(-15, -50));
    shapePoints.push(createVector(-30, 60));

}


function draw() {
    background('white');

    for (let i = 0; i < 3; i++) {
        fill('orange');
        stroke('black');
        strokeWeight(2);
        text('Ring ' + str(i + 1), 30 + 160 * i, 50);
    }

    translate(width / 2, height / 2);

    fill(200);
    stroke(0);
    strokeWeight(lineWidth / 2);
    beginShape();
    for (let i = 0; i < 3; i++) {
        let corner = shapePoints[i];
        vertex(corner.x, corner.y);
    }
    endShape(CLOSE);

    for (let i = 0; i < 3; i++) {
        let corner = shapePoints[i];
        fill(rayColors[i]);
        ellipse(corner.x, corner.y, dotSize, dotSize);
    }

    noFill();
    stroke('orange');
    strokeWeight(ringWidth);
    circle(0, 0, ringRadius * 2);

    for (let i = 0; i < 3; i++) {
        let ringRaySliders = raySliders[i];
        let ringAngle = deg2rad(ringSliders[i].value());
        rotate(ringAngle);
        for (let j = 0; j < 3; j++) {
            drawRay(ringRaySliders[j].value(), rayColors[j]);
        }
        rotate(-ringAngle);
    }

}

function deg2rad(angle) {
    return angle / 180 * PI;
}


function drawRay(angle, color) {

    let p1 = createVector(- ringRadius - focalLength, 0);
    let p2 = createVector(cos(deg2rad(angle)), sin(deg2rad(angle))).mult(ringRadius);
    let p3 = p5.Vector.add(p1, p2);
    let ip = intersectLineCircle(p1, p3, createVector(0, 0), ringRadius);

    stroke('black');
    strokeWeight(lineWidth);
    line(ip[0].x, ip[0].y, ip[1].x, ip[1].y);
    line(p1.x, p1.y, p3.x, p3.y);

    stroke(color);
    strokeWeight(lineWidth - 3);
    line(ip[0].x, ip[0].y, ip[1].x, ip[1].y);
    line(p1.x, p1.y, p3.x, p3.y);

    ellipseMode(CENTER);
    stroke('black');
    strokeWeight(1.5);
    fill(color);

    ellipse(ip[0].x, ip[0].y, dotSize, dotSize);
    ellipse(ip[1].x, ip[1].y, dotSize, dotSize);
    fill('yellow');
    ellipse(p1.x, p1.y, dotSize, dotSize);

}

intersectLineCircle = function (p1, p2, cpt, r) {

    let sign = function (x) { return x < 0.0 ? -1 : 1; };

    let x1 = p1.copy().sub(cpt);
    let x2 = p2.copy().sub(cpt);

    let dv = x2.copy().sub(x1)
    let dr = dv.mag();
    let D = x1.x * x2.y - x2.x * x1.y;

    // evaluate if there is an intersection
    let di = r * r * dr * dr - D * D;
    if (di < 0.0)
        return [];

    let t = sqrt(di);

    ip = [];
    ip.push(new createVector(D * dv.y + sign(dv.y) * dv.x * t, -D * dv.x + abs(dv.y) * t).div(dr * dr).add(cpt));
    if (di > 0.0) {
        ip.push(new createVector(D * dv.y - sign(dv.y) * dv.x * t, -D * dv.x - abs(dv.y) * t).div(dr * dr).add(cpt));
    }
    return ip;
}
