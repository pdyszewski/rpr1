new p5(function (p) {
  let maxK = 15;
  let pSlider;
  let probabilities = [];
  let container;

  p.setup = function () {
    container = document.getElementById('geo-container');
    let cWidth = container.offsetWidth;
    let cHeight = container.offsetHeight;

    let canvas = p.createCanvas(cWidth, cHeight);
    canvas.parent('geo-container');

    pSlider = p.createSlider(0.01, 1, 0.3, 0.01);
    pSlider.parent('slider-container-geo');
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
    for (let k = 1; k <= maxK; k++) {
      probabilities.push(Math.pow(1 - pVal, k - 1) * pVal);
    }
  }

  function drawHistogram(prob) {
    let barWidth = p.width / (maxK + 2);
    let maxProb = 1;//Math.max(...probabilities);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textSize(12);
    p.fill('#eee8d5');

    for (let k = 1; k <= maxK; k++) {
      let probVal = probabilities[k - 1];
      let barHeight = p.map(probVal, 0, maxProb, 0, p.height * 0.8);
      let w = barWidth * 0.3;
      let x = k * barWidth + (barWidth - w) / 2;

      p.fill('#eee8d5');
      p.rect(x, p.height - barHeight - 30, w, barHeight);

      p.text(k, x + w / 2, p.height - 5);
      p.text(probVal.toFixed(2), x + w / 2, p.height - barHeight - 35);
    }

    p.textSize(16);
    p.text(`Rozkład Geometryczny G(p=${prob.toFixed(2)})`, p.width / 2, 25);
  }

  p.windowResized = function () {
    if (container) {
      let newWidth = container.offsetWidth;
      let newHeight = container.offsetHeight;
      p.resizeCanvas(newWidth, newHeight);
    }
  };
});

