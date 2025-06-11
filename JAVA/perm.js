let n = 40;
let nodes = [];
let perm;
let assigned;
let usedIndices;
let step;
let i;

let currentCycleEdges = [];
let allCycleEdges = [];

let canvas;
let canvasSize;

let bg_color = "#002b36";
let fg_color = "#eee8d5";
let primary_color = "#2aa198";
let ref_line_color = "#586e75";

let resetButton;

function setup() {
  canvasSize = getCanvasSize();
  canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent("canvas_perm");

  pixelDensity(1);
  angleMode(DEGREES);
  textFont('monospace');
  frameRate(1);

  resetButton = createButton("Resetuj");
  resetButton.parent("canvas_perm_button");
  resetButton.mousePressed(resetSketch);

  initializePermutation();
}

function windowResized() {
  canvasSize = getCanvasSize();
  resizeCanvas(canvasSize, canvasSize);
  createNodes();
}

function getCanvasSize() {
  const container = document.getElementById("canvas_perm");
  return container ? container.offsetWidth : windowWidth * 0.8;
}

function resetSketch() {
  initializePermutation();
  loop();
}

function initializePermutation() {
  perm = new Array(n).fill(null);
  assigned = new Set();
  usedIndices = new Set();
  step = 0;
  i = 0;
  currentCycleEdges = [];
  allCycleEdges = [];
  createNodes();
}

function createNodes() {
  nodes = [];
  let radius = canvasSize * 0.4;
  for (let k = 0; k < n; k++) {
    let angle = map(k, 0, n, 0, 360);
    let x = canvasSize / 2 + radius * cos(angle);
    let y = canvasSize / 2 + radius * sin(angle);
    nodes.push({ x, y, label: k + 1 });
  }
}

function draw() {
  background(bg_color);
  drawNodes();
  drawEdges();

  if (step < n) {
    let available = [];
    for (let j = 1; j <= n; j++) {
      if (!assigned.has(j)) available.push(j);
    }

    if (available.length > 0) {
      let j_index = floor(random(available.length));
      let j = available[j_index];

      perm[i] = j;
      assigned.add(j);
      currentCycleEdges.push([i, j - 1]);
      usedIndices.add(i);

      if (j === i + 1 || usedIndices.has(j - 1)) {
        allCycleEdges.push(currentCycleEdges.slice());
        currentCycleEdges = [];

        let remaining = [];
        for (let k = 0; k < n; k++) {
          if (!usedIndices.has(k)) remaining.push(k);
        }
        if (remaining.length > 0) {
          i = min(remaining);
        }
      } else {
        i = j - 1;
      }

      step++;
    }
  } else {
    noLoop();
  }
}

function drawNodes() {
  textAlign(CENTER, CENTER);
  textSize(canvasSize * 0.035);
  let nodeSize = canvasSize * 0.05;

  fill(bg_color);
  stroke(fg_color);
  for (let node of nodes) {
    fill(bg_color);
    stroke(fg_color);
    ellipse(node.x, node.y, nodeSize);
  }

  fill(fg_color);
  noStroke();
  for (let i = 0; i < nodes.length; i++) {
    text(nodes[i].label, nodes[i].x, nodes[i].y);
  }
}

function drawEdges() {
  strokeWeight(2);
  let arrowSize = canvasSize * 0.01;

  stroke(ref_line_color);
  for (let cycle of allCycleEdges) {
    for (let [from, to] of cycle) {
      if (nodes[from] && nodes[to]) {
        drawArrow(nodes[from], nodes[to], arrowSize);
      }
    }
  }

  stroke(primary_color);
  for (let [from, to] of currentCycleEdges) {
    if (nodes[from] && nodes[to]) {
      drawArrow(nodes[from], nodes[to], arrowSize);
    }
  }
}

function drawArrow(from, to, arrowSize) {
  const base = createVector(from.x, from.y);
  const vec = createVector(to.x, to.y);
  const angle = atan2(vec.y - base.y, vec.x - base.x);
  line(base.x, base.y, vec.x, vec.y);
  push();
  translate(vec.x, vec.y);
  rotate(angle);
  fill(primary_color);
  triangle(0, 0, -arrowSize, arrowSize / 2, -arrowSize, -arrowSize / 2);
  pop();
}

