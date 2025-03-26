new p5(function (p) {
  let maxK = 20;
  let lambdaSlider;
  let probabilities = [];
  let container;

  p.setup = function () {
    container = document.getElementById('poisson-container');
    let cWidth = container.offsetWidth || 600;
    let cHeight = container.offsetHeight || 300;

    let canvas = p.createCanvas(cWidth, cHeight);
    canvas.parent('poisson-container');

    lambdaSlider = p.createSlider(0.1, 10, 3, 0.1);
    lambdaSlider.parent('slider-container-poisson');
    lambdaSlider.style('width', '200px');
    lambdaSlider.style('background', '#eee8d5');
    lambdaSlider.style('accent-color', '#eee8d5');
  };

  p.draw = function () {
    p.background('#002b36');
    let lambda = lambdaSlider.value();
    calculate(lambda);
    drawHistogram(lambda);
  };

  function calculate(lambda) {
    probabilities = [];
    for (let k = 0; k <= maxK; k++) {
      probabilities.push(poissonPMF(k, lambda));
    }
  }

  function poissonPMF(k, lambda) {
    return Math.pow(lambda, k) * Math.exp(-lambda) / factorial(k);
  }

  function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  function drawHistogram(lambda) {
    let barWidth = p.width / (maxK + 2);
    let maxProb =1;// Math.max(...probabilities);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textSize(12);
    p.fill('#eee8d5');

    for (let k = 0; k <= maxK; k++) {
      let probVal = probabilities[k];
      let barHeight = p.map(probVal, 0, maxProb, 0, p.height * 0.8);
      let w = barWidth * 0.3;
      let x = (k + 1) * barWidth + (barWidth - w) / 2;

      p.fill('#eee8d5');
      p.rect(x, p.height - barHeight - 30, w, barHeight);

      p.text(k, x + w / 2, p.height - 5);
      p.text(probVal.toFixed(2), x + w / 2, p.height - barHeight - 35);
    }

    p.textSize(16);
    p.text(`Rozkład Poissona λ=${lambda}`, p.width / 2, 25);
  }

  p.windowResized = function () {
    if (container) {
      let newWidth = container.offsetWidth || 600;
      let newHeight = container.offsetHeight || 300;
      p.resizeCanvas(newWidth, newHeight);
    }
  };
});

