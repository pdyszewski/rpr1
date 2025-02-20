
let my = {}

function init() {
  this.version = '0.633'



  my.wd = 700
  my.ht = 720

  // board geometry nie ruszać
  my.boxW = 30
  my.boxH = 30

  // start
  my.userBoardSize = 6

  my.multiClrQ = true

  //my.borderL = 20;
  my.borderT = 0

  // FF = false

  my.leftProb = 0.5

  my.toggles = { multiClr: false }

  let s = ''
  s += '<div id="main" style="position:relative; width:' + my.wd + 'px;  ">'

  s += '<div style="position:relative;">'
  s += '<canvas id="can1""></canvas>'
  s += '</div>'

  s += '<div id="cans" style="display: inline-block; float:left; margin: 0;">'
  s += '</div>'


  s += '<div id="settings" style="z-index:2; margin: 2px 0 2px 0;  ">'


     s += '<div id="play" ">'
  s += '<id="count" value=""/>'
  s += '</div>'



  docInsert(s)

  el = document.getElementById('can1')
  ratio = 3

  el.width = my.wd * ratio
  el.height = my.ht * ratio
  el.style.width = my.wd + 'px'
  el.style.height = my.ht + 'px'
  //el.style.border = "1px solid black";
  //el.style.backgroundColor = "hsl(240,100%,92%)";


  g = el.getContext('2d')
  g.setTransform(ratio, 0, 0, ratio, 0, 0)

  my.clrs = [
    ['Med Purple', '#aa00aa'],
    ['Green', '#00cc00'],
    ['Red', '#FF0000'],
    ['Orange', '#FFA500'],
    ['Slate Blue', '#6A5ACD'],
    ['Lime', '#00FF00'],
    ['Black', '#000000'],
    ['Blue', '#0000FF'],
    ['Teal', '#008080'],
    ['Gold', '#ffd700'],

    ['Navy', '#000080'],
    ['Purple', '#800080'],
    ['Dark SeaGreen', '#8FBC8F'],
  ] //["Dark SeaGreen", '#8FBC8F'],["White", '#ffffff'], ["Antique White", '#FAEBD7'], ['Light Blue', '#ADD8E6'],    ['Spring Green', '#00FF7F'],

  my.clrNo = 0

  //console.log("typ", typ);

  my.frameN = 200

  //count = 0;
  //sum = 0;

  tiles = []

onSizeChg(1, 10);  // Ustaw rozmiar na 14
onSpeedChg(1, 0.5); // Ustaw szybkość na 50
onProbChg(1, 0.5); // Ustaw prawdopodobieństwo na 50/50

  restart()
  //animate();
}

function restart() {
  g.clearRect(0, 0, el.width, el.height)
  my.frameNo = 0
  for (let i = 0; i < tiles.length; i++) {
    let t = tiles[i]
    t.stop()
  }
  tiles = []
  let div = document.getElementById('cans')
  while (div.hasChildNodes()) {
    div.removeChild(div.lastChild)
  }
  div.innerHTML = ''

  my.datas = []

  my.boardSize = my.userBoardSize
  my.boardHalf = my.boardSize / 2
  my.maxCount = 10

  drawBoard()
  drawGraph()
  reset()

  if (!my.playQ) togglePlay()
}

function reset() {
  my.count = 0
  for (let i = 0; i < my.tots.length; i++) {
    let t = my.tots[i]
    t.count = 0
  }
  //let div = document.getElementById('count')
  //div.value = 17
}

function onSpeedChg(n, v) {
  //console.log("onSpeedChg=" + n, v);

  // my.frameN from 1000 to 10 (works)
  //	v = 1 - v;
  //	v = Number(v) * 2 + 1;
  //	v = Number(Math.pow(10, v).toPrecision(2));

  v = Number(v) * 1.3 + 1
  v = Number(Math.pow(10, v).toPrecision(2))
  //v *= 1.3;

  my.frameN = parseInt(3000 / v)

  v = parseInt(v)
  //document.getElementById('speed').innerHTML = v // + "," + my.frameN

  //massNum = v;
}

function onSizeChg(n, v) {
  //console.log("onSizeChg=" + n, v);
  v = Number(v)
  my.userBoardSize = v

  //document.getElementById('size').innerHTML = v
}

function onProbChg(n, v) {
  //console.log("onProbChg=" + n, v);
  v = Number(1 - v).toFixed(2)
  my.leftProb = v

  let pct = parseInt(v * 100)
  let s = pct + '%' + ' / ' + (100 - pct) + '%'

  //document.getElementById('prob').innerHTML = s
}

function nextDrop() {
  my.frameNo = 2
  animate()
}

function animate() {
  //console.log("animate",this.frame);

  //doFrame();
  // let clrs = ['blue', 'darkblue', 'green']
  // this.clr = clrs[Math.floor(Math.random() * clrs.length)]

  if (my.playQ) {
    if (my.frameNo == 2) {
      let clr = "#002b36"
      if (my.toggles.multiClr) {
        // if (my.multiClrQ) {
        if (false) {
          clr = my.clrs[Math.floor(Math.random() * my.clrs.length)][1]
        } else {
          my.clrNo++
          my.clrNo = my.clrNo % my.clrs.length
          clr = my.clrs[my.clrNo][1]
        }
      }
      //console.log("drop clr", clr);

      my.count++
      //let div = document.getElementById('count')
      //div.value = my.count

//      addTile(0, 0, clr)

        let randomCol = Math.floor((Math.random()-1/2) *2* my.boardSize); // Losowa kolumna
        addTile(-1, randomCol, clr); // **Tutaj ustawiamy losową szerokość**


    }

    my.frameNo = ++my.frameNo % my.frameN
    //console.log("animate", my.frameNo);

    requestAnimationFrame(animate)
  }
}

function drawBoard() {
  my.boardHalf = Math.floor(my.boardSize / 2)

  //BorderL = 32 + (19 - my.boardSize) * my.boxW / 2;

  // board
  let bd = {
    x: 0, //boxLeft(0, my.boardSize + 1),
    y: 0, //my.borderT,
    wd: 0,// my.boxW * (my.boardSize + 2),
    ht: 0,//my.boxH * my.boardSize + 126,
  }
  let grd = g.createLinearGradient(bd.x, bd.y, bd.x + bd.wd, bd.y)
  grd.addColorStop(0, '#cdf')
  grd.addColorStop(0.1, '#def')
  grd.addColorStop(1, '#cdf')

  g.strokeStyle = '#888'
  //g.fillStyle = '#cdf';
  g.fillStyle = '#696969'
  g.beginPath()
  g.rect(bd.x, bd.y, bd.wd, bd.ht)
  g.fill()
  g.stroke()

  // pegs
  //my.tiles = [];
  for (let row = -1; row < my.boardSize; row++) {
    //my.tiles[row] = [];
    for (let col = -40; col < row + 20	; col++) {
      //if ((col >= my.boardHalf - ((row + 1) / 2) && col <= my.boardHalf + (row / 2))) {

      let posx = boxLeft(col, row)
      let posy = boxTop(row)

      // shadow
      for (let i = 0; i < 8; i++) {
        g.beginPath()
        g.fillStyle = 'rgba(0, 0, 0, 0.03)'
        g.arc(posx + 45 / 2, posy + 30 + 1.5, 2 + i / 2, 0, 2 * Math.PI)
        g.fill()
      }

      g.beginPath()
      g.fillStyle = '#000000'
      g.strokeStyle = '#000'
      g.arc(posx + 45 / 2 - 1.5, posy + 30, 3, 0, 2 * Math.PI)
      g.stroke()
      g.fill()
    }
  }

 // let div = document.getElementById('play')
 // div.style.left = parseInt(boxLeft(0, 0) - 15) + 'px'
 // div.style.top = parseInt(boxTop(0) - 38) + 'px'
}

function drawGraph() {
  my.tots = []
  for (let col = 0; col <= my.boardSize; col++) {
    //posx = boxLeft(col, my.boardSize) + 6
    //posy = boxTop(my.boardSize)

    //		g.beginPath();
    //		g.arc(posx, posy, 1, 0, 2 * Math.PI);
    //		g.fill();

    //let tot = new Tot(my.boxW, my.boxH, col)
    //tot.setxy(posx, posy + 6)
    my.tots.push()
  }

  //	console.log("my.tots", my.tots);
}

function boxTop(rowNo) {
  return my.borderT + Number(my.boxH * rowNo)
}

function boxLeft(colNo, rowNo) {
  //	return (my.borderL + Number(my.boxW * (my.boardHalf - rowNo / 2 + colNo)));
  return my.wd / 2 + Number(my.boxW * (-0.5 - rowNo / 2 + colNo))
}

function getPlayHTML(w) {
  let s = ''

  s += '<style type="text/css">'

  s += '.playbtn {display: inline-block; position: relative; width:' + w + 'px; height:' + w + 'px; margin-right:' + w * 0.2 + 'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }'
  s += '.playbtn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }'
  s += '.playbtn:before, button:after {content: " "; position: absolute; }'
  s += '.playbtn:active {top:' + w * 0.05 + 'px; box-shadow: 0 ' + w * 0.02 + 'px ' + w * 0.03 + 'px rgba(0,0,0,.4); }'

  s += '.play:before {  left: ' + w * 0.36 + 'px; top: ' + w * 0.22 + 'px; width: 0; height: 0; border: ' + w * 0.3 + 'px solid transparent; border-left-width: ' + w * 0.4 + 'px; border-left-color: blue;  }'
  s += '.play:hover:before {border-left-color: yellow; }'

  s += '.pause:before, .pause:after {display: block; left: ' + w * 0.29 + 'px; top: ' + w * 0.28 + 'px; width: ' + w * 0.19 + 'px; height: ' + w * 0.47 + 'px; background-color: blue; }'
  s += '.pause:after {left: ' + w * 0.54 + 'px; }'
  s += '.pause:hover:before, .pause:hover:after {background-color: yellow; }'

  s += '</style>'

  s += '<button id="playBtn" class="playbtn play" onclick="togglePlay()" ></button>'

  return s
}

function optPopHTML() {
  let s = ''
  s += '<div id="optpop" style="position:absolute; left:-500px; top:0px; width:360px; padding: 5px; border-radius: 9px; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">'

  s += '<div id="optInside" style="margin: 5px auto 5px auto;">'

  s += 'List:</br>'
  s += '<textarea id="optList" style="width:90%; height:200px"></textarea>'
  s += '<br>Summary:</br>'
  s += '<textarea id="optSums" style="width:90%; height:50px"></textarea>'

  s += '</div>'

  s += '<div style="float:right; margin: 0 0 5px 10px;">'
  s += '<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2718;</button>'
  s += '</div>'
  s += '</div>'
  return s
}
function optPop() {
  //	console.log("optpop");
  let pop = document.getElementById('optpop')
  pop.style.transitionDuration = '0.3s'
  pop.style.opacity = 1
  pop.style.zIndex = 12
  pop.style.left = (my.wd - 400) / 2 + 'px'

  let div = document.getElementById('optList')
  div.value = my.datas.join(',')

  let sums = []
  for (let i = 0; i < my.tots.length; i++) {
    let t = my.tots[i]
    sums.push(t.count)
  }

  div = document.getElementById('optSums')
  let s = 'Size: ' + my.boardSize + ', Left Probability: ' + my.leftProb
  s += '\n'
  s += 'Totals: ' + sums.join(',')
  div.value = s
}

function optYes() {
  let pop = document.getElementById('optpop')
  pop.style.opacity = 0
  pop.style.zIndex = 1
  pop.style.left = '-999px'

  newGame()
}

function optNo() {
  let pop = document.getElementById('optpop')
  pop.style.opacity = 0
  pop.style.zIndex = 1
  pop.style.left = '-999px'
}

function togglePlay() {
  //console.log("togglePlay", my.colNo, my.resetQ);

  if (my.resetQ) {
    reset()
    my.resetQ = false
  }

  if (this.frame >= this.frameMax) {
    this.frame = 0
  }

  let btn = 'playBtn'

  if (my.playQ) {
    my.playQ = false
    document.getElementById(btn).classList.add('play')
    document.getElementById(btn).classList.remove('pause')
    //document.getElementById("playBtn").innerHTML = "&nbsp;&#9654;";
  } else {
    my.playQ = true
    nextDrop()
    //document.getElementById("playBtn").innerHTML = "&#10074;&#10074;";
    document.getElementById(btn).classList.add('pause')
    document.getElementById(btn).classList.remove('play')
  }

  //console.log("togglePlay", my.colNo, my.resetQ);
  if (my.colNo < my.colMax) my.cols[my.colNo].anim()
}

function addTile(row, col, clr) {
  let tile = new Tile(row, col)
  tiles.push(tile)

  let posx = boxLeft(col, row)
  let posy = boxTop(row)

  tile.setxy(posx, posy)
  tile.anim(clr)
}

function delTile(tile) {
  tile.stop()
  document.getElementById('cans').removeChild(tile.canvas)
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === tile) {
      tiles.splice(i, 1)
    }
  }
  //console.log("delTile", tiles);
}

function Tile(row, col) {
  this.row = row
  this.col = col

  this.ball = {
    size: 8,
    clr: 'white',
    lightClr: 'yellow',
    darkClr: "#002b36",
  }

  //	let wd = 45;
  //	let ht = 58;
  this.wd = 45
  this.ht = 58

  this.midX = this.wd / 2
  this.midY = 20

  this.canvas = document.createElement('canvas')
  this.canvas.style.position = 'absolute'
  //this.canvas.style.border = "1px solid black";
  document.getElementById('cans').appendChild(this.canvas)

  //el.style.border = "1px solid black";
  this.ratio = 2
  this.canvas.width = this.wd * this.ratio
  this.canvas.height = this.ht * this.ratio
  this.canvas.style.width = this.wd + 'px'
  this.canvas.style.height = this.ht + 'px'
  this.g = this.canvas.getContext('2d')
  this.g.setTransform(this.ratio, 0, 0, this.ratio, 0, 0)

  this.frame = 0
  this.frameN = my.frameN * 0.9

  this.playQ = true

  this.redraw()
}
Tile.prototype.stop = function () {
  //console.log("Tile stop");
  this.playQ = false
}
Tile.prototype.setxy = function (lt, tp) {
  this.canvas.style.left = lt + 'px'
  this.canvas.style.top = tp + 'px'
}

Tile.prototype.redraw = function () {
  this.g.clearRect(0, 0, this.wd, this.ht)

  //	this.g.fillStyle = 'green';
  //	this.g.beginPath();
  //	this.g.arc(this.midX, this.midY, 2, 0, 2 * Math.PI);
  //	this.g.fill();
  if (this.frame > 0 && this.frame <= this.frameN) {
    //this.ball.position.x = this.midX + this.x;
    //this.ball.position.y = this.midY + this.y + 2;
    this.g.ball(this.ball, this.midX + this.x, this.midY + this.y + 2)

    //		this.g.strokeStyle = 'black';
    //		this.g.fillStyle = 'black';
    //		this.g.beginPath();
    //		this.g.font = '14px Arial'
    //		this.g.fillText('(' + this.row + ',' + this.col + ')', 5, 15);
    //		this.g.fill();
  }
}

Tile.prototype.anim = function (clr) {
  this.clr = clr
  this.ball.darkClr = clr // for multi colored balls

  this.frame = 0
  this.hasBall = true

  this.frameN = parseInt(my.frameN * 0.99)
  //this.frameN = parseInt(my.frameN * 0.75);

  //	if (this.frameN != parseInt(my.frameN * 0.9)) {
  //		this.frameN = parseInt(my.frameN * 0.9); // NB: need to integrate with current state
  //	}

  this.x = 0
  this.y = 0
  if (Math.random() < my.leftProb) {
    this.dir = -1
  } else {
    this.dir = 1
  }
  this.vx = (this.dir * my.boxW) / this.frameN / 2
  this.vy = -60 / this.frameN
  this.dvy = (-3 * this.vy) / this.frameN

  this.doFrame()
}

Tile.prototype.doFrame = function () {
  this.redraw()

  this.frame++

  this.x += this.vx
  this.vy += this.dvy
  this.y += this.vy

  if (this.frame == this.frameN - 1) {
    this.bouncenow() // bounce one frame before end for smooth transition
  }
  if (this.frame <= this.frameN) {
    if (this.playQ) requestAnimationFrame(this.doFrame.bind(this))
  } else {
    delTile(this)
    //document.getElementById('cans').removeChild(this.canvas);
    //this = undefined;
    //console.log("childNodes", document.getElementById('cans').childNodes);
  }
}

Tile.prototype.bouncenow = function () {
  //this.waitingBounceQ = false;

  let nextRow = this.row + 1
  let nextCol = this.dir < 0 ? this.col : this.col + 1

  if (nextRow < my.boardSize) {
    //my.tiles[nextRow][nextCol].anim(this.clr);

    //console.log("a", nextRow, nextCol);
    addTile(nextRow, nextCol, this.clr)
    //
    //		let tile = new Tile(nextRow, nextCol);
    //
    //		let posx = boxLeft(nextCol, nextRow);
    //		let posy = boxTop(nextRow);
    //		tile.setxy(posx, posy);
    //		tile.anim(this.clr);
  } else {
    my.tots[nextCol].addOne()
    redrawTots()
    my.datas.push(nextCol)
  }
}

function redrawTots(dx, dy) {
  for (let i = 0; i < my.tots.length; i++) {
    let t = my.tots[i]
    t.redraw()
  }
}

function Tot(dx, dy, id) {
  this.id = id
  this.barHt = 100

  this.wd = my.boxW
  this.ht = this.barHt + 20

  let canvas = document.createElement('canvas')
  canvas.style.position = 'absolute'
  //canvas.style.border = "1px solid black";
  document.getElementById('cans').appendChild(canvas)

  //el.style.border = "1px solid black";
  let ratio = 2
  canvas.width = this.wd * ratio
  canvas.height = (this.ht + 30) * ratio
  canvas.style.width = this.wd + 'px'
  canvas.style.height = this.ht + 30 + 'px' // extra for labels on Totals
  let g = canvas.getContext('2d')
  g.setTransform(ratio, 0, 0, ratio, 0, 0)

  this.canvas = canvas
  this.g = g

  this.count = 0
}
Tot.prototype.stop = function () {
  console.log('Tot stop')
}
Tot.prototype.setxy = function (lt, tp) {
  this.canvas.style.left = lt + 'px'
  this.canvas.style.top = tp + 'px'
}
Tot.prototype.addOne = function () {
  //console.log("addOne", this.count);
  this.count++

  if (this.count > my.maxCount) my.maxCount = this.count
}
Tot.prototype.redraw = function () {
  this.g.clearRect(0, 0, this.wd, this.ht)

  let ht = this.barHt * (this.count / my.maxCount)

  this.g.strokeStyle = 'black'
  this.g.fillStyle = 'orange'
  this.g.beginPath()
  this.g.rect(0, this.ht - ht, this.wd, ht)
  this.g.fill()
  this.g.stroke()

  // count
  this.g.fillStyle = 'black'
  this.g.beginPath()
  this.g.textAlign = 'center'
  this.g.font = '15px Arial'
  this.g.fillText(this.count.toString(), this.wd / 2, this.ht - ht - 3)
  this.g.fill()

  // id (0 to n)
  this.g.fillStyle = 'grey'
  this.g.font = '13px Arial'
  this.g.textAlign = 'center'
  this.g.beginPath()
  this.g.fillText(this.id, this.wd / 2, this.ht + 14)
  this.g.fill()
}
CanvasRenderingContext2D.prototype.ball = function (ball, x, y) {
  //console.log("ball", x, y);

  // ball = {size: 10, clr: 'white', lightClr: 'yellow', darkClr: 'blue' }
  let size = ball.size

  //main circle
  this.beginPath()
  this.fillStyle = ball.clr
  this.arc(x, y, size, 0, Math.PI * 2, true)

  //bright spot
  let gradient = this.createRadialGradient(x - size / 2, y - size / 2, 0, x, y, size)
  gradient.addColorStop(0, ball.clr)
  gradient.addColorStop(1, ball.darkClr)

  this.fillStyle = gradient
  this.fill()
  this.closePath()

  this.beginPath()
  this.arc(x, y, size * 0.85, (Math.PI / 180) * 270, (Math.PI / 180) * 200, true)
  //context.lineTo(ball.x, ball.y);

  gradient = this.createRadialGradient(x - size * 0.5, y - size * 0.5, 0, x, y, size)
  gradient.addColorStop(0, ball.lightClr)
  gradient.addColorStop(0.5, 'transparent')

  this.fillStyle = gradient
  this.fill()
}

function toggle(name, offStr = '', onStr = '') {
  my.toggles[name] = !my.toggles[name]
  console.log('toggle', my.toggles)
  let div = document.getElementById(name + 'Btn')
  if (my.toggles[name]) {
    div.classList.add('hi')
    div.classList.remove('lo')
    if (onStr.length > 0) div.innerHTML = onStr
  } else {
    div.classList.add('lo')
    div.classList.remove('hi')
    if (offStr.length > 0) div.innerHTML = offStr
  }
}

function docInsert(s) {
    let container = document.getElementById('galton-container');
    if (container) {
        container.innerHTML = s;
    } else {
        console.error("Nie znaleziono kontenera #galton-container");
    }
}


function wrap({ id = '', cls = '', pos = 'rel', style = '', txt = '', tag = 'div', lbl = '', fn = '', opts = [] }, ...mores) {
  let s = ''
  s += '\n'

  txt += mores.join('')

  let noProp = 'event.stopPropagation(); '

  // prettier-ignore
  let tags = {
    btn:  {stt: '<button ' + (fn.length > 0 ? ' onclick="' + noProp + fn + '" ' : ''), cls:'btn', fin:'>' + txt + '</button>'},
    can:  {stt: '<canvas ', cls:'', fin:'></canvas>'},
    div:  {stt: '<div ' + (fn.length > 0 ? ' onclick="' + fn + '" ' : ''), cls:'', fin:' >' + txt + '</div>'},
    edit: {stt: '<textarea onkeyup="' + fn + '" onchange="' + fn + '"', cls:'', fin:' >' + txt + '</textarea>'},
    inp:  {stt: '<input value="' + txt + '"' + (fn.length > 0 ? '  oninput="' + fn + '" onchange="' + fn + '"' : ''), cls:'input', fin:'>' + (lbl.length > 0 ? '</label>' : '')},
    out:  {stt: '<span ', cls:'output', fin:' >' + txt + '</span>' + (lbl.length > 0 ? '</label>' : '')},
    radio:{stt:'<div ', cls:'radio', fin:'>\n'},
    sel:  {stt: '<select ' + (fn.length > 0 ? ' onchange="' + fn + '"' : ''), cls:'select', fin:'>\n'},
    sld:  {stt:'<input type="range" ' + txt + ' oninput="' + noProp + fn + '" onchange="'  + noProp + fn + '"', cls:'select', fin: '>' + (lbl.length > 0 ? '</label>' : '')},
  }

  let type = tags[tag]

  if (lbl.length > 0) s += '<label class="label">' + lbl + ' '

  s += type.stt
  if (cls.length == 0) cls = type.cls
  if (tag == 'div') style += fn.length > 0 ? ' cursor:pointer;' : ''

  if (id.length > 0) s += ' id="' + id + '"'
  if (cls.length > 0) s += ' class="' + cls + '"'
  if (pos == 'dib') s += ' style="position:relative; display:inline-block;' + style + '"'
  if (pos == 'rel') s += ' style="position:relative; ' + style + '"'
  if (pos == 'abs') s += ' style="position:absolute; ' + style + '"'

  // if (tag == 'sld') s += '>'
  s += type.fin

  if (tag == 'radio') {
    for (let i = 0; i < opts.length; i++) {
      let chk = ''
      if (i == 0) chk = 'checked'
      let idi = id + i
      let lbl = opts[i]
      s += '<input id="' + idi + '" type="radio" name="' + id + '" value="' + lbl.name + '" onclick="' + fn + '(' + i + ');" ' + chk + ' >'
      s += '<label for="' + idi + '">' + lbl.name + ' </label>'
    }
    s += '</div>'
  }
  if (tag == 'sel') {
    for (let i = 0; i < opts.length; i++) {
      let opt = opts[i]
      let idStr = id + i
      let chkStr = opt.name == txt ? ' selected ' : ''
      s += '<option id="' + idStr + '" value="' + opt.name + '"' + chkStr + '>' + opt.descr + '</option>\n'
    }
    s += '</select>'
    if (lbl.length > 0) s += '</label>'
  }

  s += '\n'
  //console.log('wrap', tag + '\n', s + '\n')

  return s.trim()
}

init()

