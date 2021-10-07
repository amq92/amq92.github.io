let shapePoints = [];
let ringSliders = [];
let raySliders = [];
let rayColors = ['red', 'green', 'blue'];
let ringRadius = 0;
let focalLength = 50;
let ringWidth = 8;
let dotSize = 18;
let lineWidth = 6;
let nbRings = 4;
let nbRays = rayColors.length;
let solveButton;
let resetButton;

function setup() {

    createCanvas(windowWidth, windowHeight);
    textSize(28);

    ringRadius = 0.7 * min(windowWidth, windowHeight) / 2;

    for (let i = 0; i < nbRings; i++) {
        slider = createSlider(-180, 180, random(-180, 180));
        slider.position(30 + 160 * i, 100);
        slider.style('width', '120px');
        ringSliders.push(slider);
    }

    resetButton = createButton('Random Configuration');
    resetButton.position(30, 20);
    resetButton.mousePressed(resetRings);

    solveButton = createButton('Find intersections');
    solveButton.position(200, 20);
    solveButton.mousePressed(solveRings);

    for (let i = 0; i < nbRings; i++) {
        let ringRaySliders = [];
        for (let j = 0; j < nbRays; j++) {
            slider = createSlider(-45, 45, random(-15, 15));
            slider.position(30 + 160 * i, 120 + 20 * (j + 1));
            slider.style('width', '120px');
            slider.addClass('ray-slider slider-' + rayColors[j]);
            ringRaySliders.push(slider);
        }
        raySliders.push(ringRaySliders);
    }

    shapePoints.push(createVector(40, 20));
    shapePoints.push(createVector(-15, -50));
    shapePoints.push(createVector(-30, 60));
    shapePoints.push(createVector(-40, 90));
    shapePoints.push(createVector(30, 60));

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background('white');

    for (let i = 0; i < nbRings; i++) {
        fill('orange');
        stroke('black');
        strokeWeight(2);
        text('Ring ' + str(i + 1), 30 + 160 * i, 90);
    }

    translate(width / 2, height / 2);

    fill(200);
    stroke(0);
    strokeWeight(lineWidth / 2);
    beginShape();
    for (let i = 0; i < nbRays; i++) {
        let corner = shapePoints[i];
        vertex(corner.x, corner.y);
    }
    endShape(CLOSE);

    for (let i = 0; i < nbRays; i++) {
        let corner = shapePoints[i];
        fill(rayColors[i]);
        ellipse(corner.x, corner.y, dotSize, dotSize);
    }

    noFill();
    stroke('orange');
    strokeWeight(ringWidth);
    circle(0, 0, ringRadius * 2);

    for (let i = 0; i < nbRings; i++) {
        let ringRaySliders = raySliders[i];
        let ringAngle = deg2rad(ringSliders[i].value());
        for (let j = 0; j < nbRays; j++) {
            let positions = getRayPosition(ringAngle, deg2rad(ringRaySliders[j].value()));
            drawRay(positions, rayColors[j]);
        }
    }

}

function solveRings() {
    for (let i = 0; i < nbRings; i++) {
        let ringRaySliders = raySliders[i];
        let ringAngle = deg2rad(ringSliders[i].value());
        for (let j = 0; j < nbRays; j++) {
            let a = rad2deg(solveRingPosition(ringAngle, shapePoints[j]));
            ringRaySliders[j].value(a);
        }
    }
}

function resetRings() {
    for (let i = 0; i < nbRings; i++) {
        ringSliders[i].value(random(-180, 180));
    }
}

function deg2rad(angle) {
    return angle / 180 * PI;
}

function rad2deg(angle) {
    return angle / PI * 180;
}
function rotateCoordinates(pos, angle) {
    r = sqrt(pos.x ** 2 + pos.y ** 2)
    theta = atan2(pos.y, pos.x) + angle;
    x = cos(theta) * r;
    y = sin(theta) * r;

    return createVector(x, y);
}

function solveRingPosition(ringAngle, targetPoint) {

    let focalPoint = createVector(- ringRadius - focalLength, 0);
    focalPoint = rotateCoordinates(focalPoint, ringAngle);

    let toTargetPoint = p5.Vector.sub(targetPoint, focalPoint);

    return atan2(toTargetPoint.y, toTargetPoint.x) - ringAngle;
}

function getRayPosition(ringAngle, rayAngle) {

    let focalPoint = createVector(- ringRadius - focalLength, 0);
    focalPoint = rotateCoordinates(focalPoint, ringAngle);

    let wrt_focalPoint = createVector(cos(rayAngle), sin(rayAngle)).mult(ringRadius);
    wrt_focalPoint = rotateCoordinates(wrt_focalPoint, ringAngle);

    let wrt_ringCenter = p5.Vector.add(focalPoint, wrt_focalPoint);

    let intersectionPoints = intersectLineCircle(focalPoint, wrt_ringCenter, createVector(0, 0), ringRadius);

    return [focalPoint, intersectionPoints[0], intersectionPoints[1]];

}

function drawRay(positions, color) {

    let focalPoint = positions[0];
    let intersectionPoint1 = positions[1];
    let intersectionPoint2 = positions[2];

    stroke(color);
    strokeWeight(lineWidth - 3);
    line(focalPoint.x, focalPoint.y, intersectionPoint2.x, intersectionPoint2.y);

    ellipseMode(CENTER);
    stroke('black');
    strokeWeight(1.5);
    fill(color);
    ellipse(intersectionPoint1.x, intersectionPoint1.y, dotSize * 0.5, dotSize * 0.5);
    ellipse(intersectionPoint2.x, intersectionPoint2.y, dotSize, dotSize);
    fill('yellow');
    ellipse(focalPoint.x, focalPoint.y, dotSize, dotSize);
}

function euclideanDistance(x1, x2) {
    return dist(x1.x, x1.y, x2.x, x2.y);
}

function intersectLineCircle(p1, p2, cpt, r) {

    // https://stackoverflow.com/questions/57891494/how-to-calculate-intersection-point-of-a-line-on-a-circle-using-p5-js

    let sign = function (x) { return x < 0.0 ? -1 : 1; };

    let x1 = p5.Vector.sub(p1, cpt);
    let x2 = p5.Vector.sub(p2, cpt);

    let dv = p5.Vector.sub(x2, x1)
    let dr = dv.mag();
    let D = x1.x * x2.y - x2.x * x1.y;

    let di = r * r * dr * dr - D * D;
    let t = sqrt(di);

    let ip1 = createVector(D * dv.y + sign(dv.y) * dv.x * t, -D * dv.x + abs(dv.y) * t).div(dr * dr).add(cpt);
    let ip2 = createVector(D * dv.y - sign(dv.y) * dv.x * t, -D * dv.x - abs(dv.y) * t).div(dr * dr).add(cpt);

    d1 = euclideanDistance(p1, ip1);
    d2 = euclideanDistance(p1, ip2);

    if (d1 < d2)
        return [ip1, ip2];
    else
        return [ip2, ip1];
}
