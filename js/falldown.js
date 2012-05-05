var context;
var dx = 15;
var dy = 5;
var lines;
var score = 0;
var paused = false;

var ball = {
  x: 250,
  y: 25,
  r: 15,
  collided: false,
  color: "black",

  reset: function () {
    this.x = 250;
    this.y = 25;
    this.r = 15;
    this.collided = false;
  },

  move_down: function () {
    this.collide();

    if (this.collided) {
      this.y -= 2;
    }
    else {
      if (!this.at_bottom()) {
        this.y += dy;
      }
    }
  },

  move: function (side) {
    var temp = side(this.x, dx);
    if (temp < 490 && temp > 10) {
      this.x = temp;
    }
    this.collide();
  },

  is_dead: function () {
    if (this.y < 17) {
      return true;
    }
    else {
      return false;
    }
  },

  at_bottom: function () {
    if (this.y > 565) {
      return true;
    }
    else {
      return false;
    }
  },

  draw: function () {
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
    context.closePath();
    context.fillStyle = this.color;
    context.fill();
  },

  collide: function () {
    for (var i = 0; i < lines.length; i = i + 1) {
      var temp = this.y - lines[i].y;
      if (temp >= -15 && temp <= 15 /* && this.x <= lines[i].shole && this.x >= lines[i].ehole */)
      {
        if (this.x >= lines[i].shole && this.x <= lines[i].ehole) {
          this.collided = false;
        }
        else {
          this.collided = true;
        }
      }
    }
  }
};

function drawLine(x1, y1, x2, y2, color) {
  context.strokeStyle = color;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.closePath();
  context.stroke();
}

function lineMaker(height) {
  return {
    x: 0,
    y: height,
    color: "black",
    hole_width: 50,
    rand: Math.random(),
    at_top: false,

    init: function init() {
      this.shole = this.rand * (600 - this.hole_width);
      this.ehole = this.shole + this.hole_width;
    },

    move: function move() {
      this.y -= 2;
      if (this.y <= 0) {
        this.at_top = true;
      }
    },

    draw: function draw() {
      drawLine(this.x, this.y, this.shole, this.y, this.color);
      drawLine(this.ehole, this.y, 600, this.y, this.color);
    }
  };
}

function update() {
  if (!ball.is_dead() && !paused) {
    context.clearRect(0, 0, 600, 600);
    for (var i = 0; i < lines.length; i = i + 1) {
      lines[i].move();
      lines[i].draw();
      if (lines[i].at_top) {
        var temp = lines[i];
        lines[i] = lineMaker(600);
        lines[i].init();
      }
    }
    ball.move_down();
    ball.draw();
    context.save();
    score += 10;
    context.fillText("Score: " + score, 10, 20);

  }
}

function initLines() {
  lines = [];
  lines[lines.length] = lineMaker(750);
  lines[lines.length] = lineMaker(900);
  lines[lines.length] = lineMaker(1050);
  lines[lines.length] = lineMaker(1200);

  for (var i = 0; i < lines.length; i = i + 1) {
    lines[i].init();
  }
}

// catch key events
function onKeyDown(evt) {
  if (evt.keyCode === 39) {           // move right
    ball.move(function (x, y) {
      return x + y;
    });
  }
  else if (evt.keyCode === 37) {      // move left
    ball.move(function (x, y) {
      return x - y;
    });
  }
  else if (evt.keyCode === 32) {      // space for pausing game
    paused = !paused;
  }
  else if (evt.keyCode === 82) {      // restart game
    ball.reset();
    score = 0;
    initLines();
    paused = false;
  }
}

$(document).keydown(onKeyDown);

function init() {
  var canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  intervalId = setInterval(update, 0.0001);
  initLines();

  return intervalId;
}

// start game
(function() {
  init();
  update();
})();