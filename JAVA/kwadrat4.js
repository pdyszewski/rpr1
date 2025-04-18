let sliderA, sliderB, sliderC, sliderD;
let labelA, labelB, labelC, labelD;
let canvas;
let canvasSize;

function setup() {
  canvasSize = getCanvasSize();
  canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent("kwadrat4-container");

  pixelDensity(1);
  noStroke();
  textFont('monospace');
  textSize(14);

  // Suwaki a, b
  labelA = createP("a:");
  labelA.parent("kwadrat4a-container");
  labelA.style('color', '#93a1a1');
  labelA.style('margin', '0 5px 0 0');
  labelA.style('display', 'inline');

  sliderA = createSlider(0, 0.71, 0.1, 0.01);
  sliderA.parent("kwadrat4a-container");

  labelB = createP("b:");
  labelB.parent("kwadrat4b-container");
  labelB.style('color', '#93a1a1');
  labelB.style('margin', '0 5px 0 0');
  labelB.style('display', 'inline');

  sliderB = createSlider(0, 0.71, 0.2, 0.01);
  sliderB.parent("kwadrat4b-container");

  // Suwaki c, d
  labelC = createP("c:");
  labelC.parent("kwadrat4c-container");
  labelC.style('color', '#93a1a1');
  labelC.style('margin', '0 5px 0 0');
  labelC.style('display', 'inline');

  sliderC = createSlider(0, 0.71, 0.1, 0.01);
  sliderC.parent("kwadrat4c-container");

  labelD = createP("d:");
  labelD.parent("kwadrat4d-container");
  labelD.style('color', '#93a1a1');
  labelD.style('margin', '0 5px 0 0');
  labelD.style('display', 'inline');

  sliderD = createSlider(0, 0.71, 0.2, 0.01);
  sliderD.parent("kwadrat4d-container");
}

function draw() {
  let a = sliderA.value();
  let b = sliderB.value();
  let c = sliderC.value();
  let d = sliderD.value();

  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let nx = x / width;
      let ny = y / height;

      let dist1 = abs(nx - ny) / Math.sqrt(2);             // odległość od x = y
      let dist2 = abs(nx - 1 + ny) / Math.sqrt(2);         // odległość od x + y = 1

      let inAB = dist1 >= a && dist1 <= b;
      let inCD = dist2 >= c && dist2 <= d;

      let index = (x + y * width) * 4;

      if (inAB && inCD) {
        // kolor mieszany jeśli należy do obu
        pixels[index] = 220;
        pixels[index + 1] = 150;
        pixels[index + 2] = 100;
        pixels[index + 3] = 255;
      } else if (inAB) {
        // obszar 1 – x = y (kolor morski)
        pixels[index] = 42;
        pixels[index + 1] = 161;
        pixels[index + 2] = 152;
        pixels[index + 3] = 255;
      } else if (inCD) {
        // obszar 2 – x + y = 1 (kolor #eee8d5)
        pixels[index] = 238;
        pixels[index + 1] = 232;
        pixels[index + 2] = 213;
        pixels[index + 3] = 255;
      } else {
        // tło – kolor bazowy
        pixels[index] = 0;
        pixels[index + 1] = 43;
        pixels[index + 2] = 54;
        pixels[index + 3] = 255;
      }
    }
  }
  updatePixels();

  // Ramka wokół kwadratu
  noFill();
  stroke('#93a1a1');
  strokeWeight(1.5);
  rect(0, 0, width, height);
}

function windowResized() {
  canvasSize = getCanvasSize();
  resizeCanvas(canvasSize, canvasSize);
}

function getCanvasSize() {
  const container = document.getElementById("kwadrat4-container");
  const maxW = container ? container.offsetWidth : windowWidth;
  const maxH = windowHeight * 0.8;
  return Math.floor(Math.min(maxW, maxH));
}

