new p5(function (p) {
  let muSlider, sigmaSlider;
  let container;

  p.setup = function () {
    container = document.getElementById('normal-container');
    let cWidth = container.offsetWidth || 600;
    let cHeight = container.offsetHeight || 300;

    let canvas = p.createCanvas(cWidth, cHeight);
    canvas.parent('normal-container');

    muSlider = p.createSlider(-10, 10, 0, 0.1);
    muSlider.parent('slider-container-normal-mu');
    muSlider.style('width', '200px');
    muSlider.style('background', '#eee8d5');

    sigmaSlider = p.createSlider(0.1, 10, 2, 0.1);
    sigmaSlider.parent('slider-container-normal-sigma');
    sigmaSlider.style('width', '200px');
    sigmaSlider.style('background', '#eee8d5');
  };

  p.draw = function () {
    p.background('#002b36');
    let mu = muSlider.value();
    let sigma = sigmaSlider.value();
    drawDensity(mu, sigma);
  };

  function drawDensity(mu, sigma) {
    let margin = 40;
    let minX = -20;
    let maxX = 20;

    // Maksymalna gęstość normalna występuje w x = mu
    let maxF = 1 / (sigma * Math.sqrt(2 * Math.PI));

    // Osie
    p.stroke('#eee8d5');
    p.fill('#eee8d5');
    p.textSize(14);
    p.textAlign(p.CENTER, p.BOTTOM);

    // Oś X
    p.line(margin, p.height - margin, p.width - margin, p.height - margin);
    for (let x = minX; x <= maxX; x++) {
      let px = p.map(x, minX, maxX, margin, p.width - margin);
      p.line(px, p.height - margin - 5, px, p.height - margin + 5);
      if (x % 5 === 0) p.text(x, px, p.height - 5);
    }

    // Oś Y
    p.line(margin, p.height - margin, margin, margin);

    // Krzywa gęstości
    p.noFill();
    p.stroke('#eee8d5');
    p.beginShape();
    for (let x = minX; x <= maxX; x += 0.1) {
      let yVal = (1 / (sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-Math.pow(x - mu, 2) / (2 * sigma * sigma));
      let px = p.map(x, minX, maxX, margin, p.width - margin);
      let py = p.map(yVal, 0, maxF, p.height - margin, margin);
      p.vertex(px, py);
    }
    p.endShape();

    // Etykieta
    p.textAlign(p.CENTER, p.TOP);
    p.noStroke();
    p.text(`Rozkład normalny f(x; μ, σ), μ=${mu.toFixed(2)}, σ=${sigma.toFixed(2)}`, p.width / 2, 10);
  }

  p.windowResized = function () {
    if (container) {
      let newWidth = container.offsetWidth || 600;
      let newHeight = container.offsetHeight || 300;
      p.resizeCanvas(newWidth, newHeight);
    }
  };
});

