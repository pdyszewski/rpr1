new p5(function (p) {
  let aSlider, bSlider;
  let container;

  p.setup = function () {
    container = document.getElementById('uniform-container');
    let cWidth = container.offsetWidth || 600;
    let cHeight = container.offsetHeight || 300;

    let canvas = p.createCanvas(cWidth, cHeight);
    canvas.parent('uniform-container');

    aSlider = p.createSlider(0, 10, 2, 0.1);
    aSlider.parent('slider-container-uniform-a');
    aSlider.style('width', '200px');
    aSlider.style('background', '#eee8d5');

    bSlider = p.createSlider(1, 20, 8, 0.1);
    bSlider.parent('slider-container-uniform-b');
    bSlider.style('width', '200px');
    bSlider.style('background', '#eee8d5');
  };

  p.draw = function () {
    p.background('#002b36');

    let a = aSlider.value();
    let b = bSlider.value();

    if (b <= a) {
      b = a + 0.1; // zabezpieczenie przed dzieleniem przez 0
    }

    drawDensity(a, b);
  };

  function drawDensity(a, b) {
    let f = 1 / (b - a); // gęstość
    let margin = 40;
    let minX = 0;
    let maxX = 21;
    let maxF = 1 / 0.1; // maksymalna możliwa gęstość (dla b-a=0.1)

    // Osie
    p.stroke('#eee8d5');
    p.fill('#eee8d5');
    p.textSize(14);
    p.textAlign(p.CENTER, p.BOTTOM);

    // Oś X
    p.line(margin, p.height - margin, p.width - margin, p.height - margin);

    // Oś Y
    p.line(margin, p.height - margin, margin, margin);

    // Skala X: od 0 do 21 niezależnie od a i b
    for (let x = minX; x <= maxX; x++) {
      let px = p.map(x, minX, maxX, margin, p.width - margin);
      p.line(px, p.height - margin - 5, px, p.height - margin + 5);
      if (x % 1 === 0) {
        p.text(x, px, p.height - 5);
      }
    }

    // Rysowanie prostokąta gęstości
    let startX = p.map(a, minX, maxX, margin, p.width - margin);
    let endX = p.map(b, minX, maxX, margin, p.width - margin);
    let y = p.map(f, 0, maxF, p.height - margin, margin); // im większa gęstość, tym wyższy prostokąt

    p.noStroke();
    p.fill('#eee8d5');
    p.rect(startX, y, endX - startX, p.height - margin - y);

    // Etykieta
    p.textAlign(p.CENTER, p.TOP);
    p.text(`gęstość f(x) = ${f.toFixed(2)} dla x ∈ [${a.toFixed(1)}, ${b.toFixed(1)}]`, p.width / 2, 10);
  }

  p.windowResized = function () {
    if (container) {
      let newWidth = container.offsetWidth || 600;
      let newHeight = container.offsetHeight || 300;
      p.resizeCanvas(newWidth, newHeight);
    }
  };
});

