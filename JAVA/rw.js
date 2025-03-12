let walker;
let time = 0;
let positions = [];
let probabilityInput;
let probability = 0.5; // Domyślne prawdopodobieństwo kroku +1
let resetButton;
let toggleButton;
let isRunning = false; // Domyślnie symulacja jest zatrzymana

function setup() {
  let container = select('.rw-container');
  let canvas = createCanvas(container.width, 300);
  canvas.parent(container);
  
  walker = new Walker();
  background('#002b36');
  positions.push({ t: time, x: walker.x }); // Ustawienie początkowego punktu na wykresie
  
  // Tworzenie diva dla pola wejściowego
  let inputContainer = createDiv('');
  inputContainer.class('input-container');
  inputContainer.parent(container);
  
  // Tworzenie pola do wpisania prawdopodobieństwa
  probabilityInput = createInput(probability.toString());
  probabilityInput.parent(inputContainer);
  probabilityInput.size(70);
  probabilityInput.class('probability-input');
  probabilityInput.input(updateProbability);
  
  // Tworzenie przycisku resetu
  resetButton = createButton('Reset');
  resetButton.parent(inputContainer);
  resetButton.mousePressed(resetSimulation);
  
  // Tworzenie przycisku start/stop
  toggleButton = createButton('Start');
  toggleButton.parent(inputContainer);
  toggleButton.mousePressed(toggleSimulation);
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

function updateProbability() {
  let value = float(probabilityInput.value());
  if (value >= 0 && value <= 1) {
    probability = value;
  }
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
    this.x = int(width / 2);
  }

  step() {
    if (random() < probability) {
      this.x += 1;
    } else {
      this.x -= 1;
    }
    //this.x = constrain(this.x, 0, width - 1);
    this.x = int(this.x); // Upewnienie się, że wartość jest całkowita
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
  line(graphX, graphY, graphX + graphWidth, graphY); // Oś X
  line(graphX, graphY, graphX, graphY - graphHeight); // Oś Y
  
  // Rysowanie prostej y = 0
  let zeroY = map(width / 2, minY, maxY, graphY, graphY - graphHeight);
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
