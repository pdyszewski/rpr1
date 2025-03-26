new p5(function (p) {
  let lambdaSlider;
  let container;

  p.setup = function () {
    container = document.getElementById('exp-container');
    let cWidth = container.offsetWidth || 600;
    let cHeight = container.offsetHeight || 300;

    let canvas = p.createCanvas(cWidth, cHeight);
    canvas.parent('exp-container');

    lambdaSlider = p.createSlider(0.1, 5, 1, 0.1);
    lambdaSlider.parent('slider-container-exp');
    lambdaSlider.style('width', '200px');
    lambdaSlider.style('background', '#eee8d5');
  };

  p.draw = function () {
    p.background('#002b36');
    let lambda = lambdaSlider.value();
    drawDensity(lambda);
  };

  function drawDensity(lambda) {
    let margin = 40;
    let maxX = 20; // <-- tutaj zwiększony zakres
    let maxF = lambda; // najwyższa wartość f(x) dla x=0

    // Osie
    p.stroke('#eee8d5');
    p.fill('#eee8d5');
    p.textSize(14);
    p.textAlign(p.CENTER, p.BOTTOM);

    p.line(margin, p.height - margin, p.width - margin, p.height - margin); // oś X
    p.line(margin, p.height - margin, margin, margin); // oś Y

    // Skala X: od 0 do 20
    for (let x = 0; x <= maxX; x++) {
      let px = p.map(x, 0, maxX, margin, p.width - margin);
      p.line(px, p.height - margin - 5, px, p.height - margin + 5);
      if (x % 1 === 0) {
        p.text(x, px, p.height - 5);
      }
    }

    // Krzywa gęstości
    p.noFill();
    p.stroke('#eee8d5');
    p.beginShape();
    for (let x = 0; x <= maxX; x += 0.1) {
      let yVal = lambda * Math.exp(-lambda * x);
      let px = p.map(x, 0, maxX, margin, p.width - margin);
      let py = p.map(yVal, 0, maxF, p.height - margin, margin);
      p.vertex(px, py);
    }
    p.endShape();

    // Opis
    p.textAlign(p.CENTER, p.TOP);
    p.noStroke();
    p.text(`Rozkład wykładniczy f(x) = λ e^(−λx), λ = ${lambda.toFixed(2)}`, p.width / 2, 10);
  }

  p.windowResized = function () {
    if (container) {
      let newWidth = container.offsetWidth || 600;
      let newHeight = container.offsetHeight || 300;
      p.resizeCanvas(newWidth, newHeight);
    }
  };
});

