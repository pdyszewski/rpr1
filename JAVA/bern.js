new p5(function (p) {
  let n = 10;
  let pSlider;
  let probabilities = [];
  let container;

  p.setup = function () {
    container = document.getElementById('bern-container');
    let cWidth = container.offsetWidth || 600;
    let cHeight = container.offsetHeight || 300;

    let canvas = p.createCanvas(cWidth, cHeight);
    canvas.parent('bern-container');

    pSlider = p.createSlider(0, 1, 0.5, 0.01);
    pSlider.parent('slider-container');
    pSlider.style('width', '200px');
    pSlider.style('background', '#eee8d5');
    pSlider.style('accent-color', '#eee8d5');
  };

  p.draw = function () {
    p.background('#002b36');
    let prob = pSlider.value();
    calculate(prob);
    drawHistogram(prob);
  };

  function calculate(pVal) {
    probabilities = [];
    for (let k = 0; k <= n; k++) {
      probabilities.push(binomialPMF(n, k, pVal));
    }
  }

  function binomialPMF(n, k, pVal) {
    return binomialCoeff(n, k) * Math.pow(pVal, k) * Math.pow(1 - pVal, n - k);
  }

  function binomialCoeff(n, k) {
    return factorial(n) / (factorial(k) * factorial(n - k));
  }

  function factorial(x) {
    if (x === 0 || x === 1) return 1;
    let result = 1;
    for (let i = 2; i <= x; i++) result *= i;
    return result;
  }

  function drawHistogram(prob) {
    let barWidth = p.width / (n + 2);
    let maxProb = 1;//Math.max(...probabilities);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textSize(12);
    p.fill('#eee8d5');

    for (let k = 0; k <= n; k++) {
      let barHeight = p.map(probabilities[k], 0, maxProb, 0, p.height * 0.8);
      let w = barWidth * 0.3;
      let x = (k + 1) * barWidth + (barWidth - w) / 2;

      p.fill('#eee8d5');
      p.rect(x, p.height - barHeight - 30, w, barHeight);

      p.text(k, x + w / 2, p.height - 5);
      p.text(probabilities[k].toFixed(2), x + w / 2, p.height - barHeight - 35);
    }

    p.textSize(16);
    p.text(`Rozkład B(n=10, p=${prob.toFixed(2)})`, p.width / 2, 25);
  }

  p.windowResized = function () {
    if (container) {
      let newWidth = container.offsetWidth || 600;
      let newHeight = container.offsetHeight || 300;
      p.resizeCanvas(newWidth, newHeight);
    }
  };
});

