let deck = [];
let steps = 0;
let maxSteps = 1000;
let cardWidth = 50;
let cardHeight = 12;
let resetButton;
let trackedCard = 52;
let totalCards = 52;
let stepCounterElement;

function setup() {
  let canvas = createCanvas(160, totalCards * (cardHeight + 1) + 40);
  canvas.parent('top2random-container');

  resetDeck();

  resetButton = createButton("Resetuj");
  resetButton.parent('top2rand-button-container');
  resetButton.mousePressed(() => {
    resetDeck();
    loop();
  });

  stepCounterElement = select('#step-counter');
  updateStepCounter();

  frameRate(15);
}

function draw() {
  background('#002b36');

  for (let i = 0; i < deck.length; i++) {
    let y = i * (cardHeight + 1) + 20;

    if (deck[i] === trackedCard) {
      fill('#b58900');
      stroke('#fdf6e3');
      strokeWeight(1);
    } else {
      fill('#2aa198');
      noStroke();
    }

    rect(width / 2 - cardWidth / 2, y, cardWidth, cardHeight, 3);

    fill('#fdf6e3');
    noStroke();
    textSize(10);
    textAlign(CENTER, CENTER);
    text(deck[i], width / 2, y + cardHeight / 2);
  }

  if (deck[0] === trackedCard) {
    noLoop();
    console.log(`Zatrzymano po ${steps} krokach – karta ${trackedCard} na szczycie!`);
    return;
  }

  if (steps < maxSteps) {
    topToRandom();
    steps++;
    updateStepCounter();
  } else {
    noLoop();
  }
}

function topToRandom() {
  if (deck.length < 2) return;
  let topCard = deck.shift();
  let randIndex = floor(random(deck.length + 1));
  deck.splice(randIndex, 0, topCard);
}

function resetDeck() {
  deck = [];
  for (let i = 1; i <= totalCards; i++) {
    deck.push(i);
  }
  steps = 0;
  updateStepCounter();
}

function updateStepCounter() {
  if (stepCounterElement) {
    stepCounterElement.html(`Kroki: ${steps}`);
  }
}

