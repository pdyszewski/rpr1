let walker;
let time = 0;
let positions = [];
let aInput, bInput;
let a = 0.5, b = 1.0;
let isRunning = false;
let resetButton, toggleButton;

function setup() {
  let container = select('.rw-container');
  let canvas = createCanvas(container.width, 300);
  canvas.parent(container);

  walker = new Walker();
  positions.push({ t: time, x: walker.x });
  background('#002b36');

  let controls = createDiv('').parent(container);

  // Proste pole do wpisania 'a'
  createSpan('a: ').parent(controls);
  aInput = createInput(a.toString()).parent(controls).size(50);
  aInput.input(() => {
    a = float(aInput.value());
  });

  // Proste pole do wpisania 'b'
  createSpan(' b: ').parent(controls);
  bInput = createInput(b.toString()).parent(controls).size(50);
  bInput.input(() => {
    b = float(bInput.value());
  });

  // Przyciski
  resetButton = createButton('Reset').parent(controls).mousePressed(resetSimulation);
  toggleButton = createButton('Start').parent(controls).mousePressed(toggleSimulation);
}

function toggleSimulation() {
  isRunning = !isRunning;
  toggleButton.html(isRunning ? 'Stop' : 'Start');
}

function windowResized() {
  let container = select('.rw-container');
  resizeCanvas(container.width, 300);
  background('#002b36');
}

function resetSimulation() {
  time = 0;
  positions = [];
  walker = new Walker();
  positions.push({ t: time, x: walker.x });
}

function draw() {
  if (isRunning) {
    walker.step();
    time++;
    positions.push({ t: time, x: walker.x });
  }

  background('#002b36');
  drawGraph();
}

class Walker {
  constructor() {
    this.x = 0;
  }

  step() {
    let n = time + 1;
    let mean = pow(n, -a);
    let stddev = sqrt(pow(n, -b));
    this.x += randomGaussian(mean, stddev);
  }
}

function drawGraph() {
  let graphX = 50;
  let graphY = height - 50;
  let graphWidth = width - 100;
  let graphHeight = 200;

  let minY = min(positions.map(p => p.x));
  let maxY = max(positions.map(p => p.x));

  stroke('#eee8d5');
  line(graphX, graphY, graphX + graphWidth, graphY);
  line(graphX, graphY, graphX, graphY - graphHeight);

  let zeroY = map(0, minY, maxY, graphY, graphY - graphHeight);
  stroke('#2aa198');
  line(graphX, zeroY, graphX + graphWidth, zeroY);

  noFill();
  stroke('#eee8d5');
  beginShape();
  for (let i = 0; i < positions.length; i++) {
    let x = map(positions[i].t, 0, time, graphX, graphX + graphWidth);
    let y = map(positions[i].x, minY, maxY, graphY, graphY - graphHeight);
    vertex(x, y);
  }
  endShape();
}

