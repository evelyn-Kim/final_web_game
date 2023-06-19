var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = 763;
canvas.height = 356;

var img1 = new Image();
img1.onload = function() {
  init();
};
img1.src = 'img/dino.png';

var img2 = new Image();
img2.onload = function() {
  init();
};
img2.src = 'img/cacti.png';

var img3 = new Image();
img3.onload = function() {
  init();
};
img3.src = 'img/ground.png';

var dino = {
  x: 20,
  y: 200,
  width: 50,
  height: 70,
  draw() {
    ctx.drawImage(img1, this.x, this.y);
    // ctx.fillStyle = 'green';
    // ctx.fillRect(this.x, this.y, this.width,this.height);
  },
};

class Cactus {
  constructor() {
    this.x = 800;
    this.y = 200;
    this.width = 50;
    this.height = 50;
  }
  draw() {
    ctx.drawImage(img2, this.x, this.y);
  }
}

class Ground {
  draw() {
    ctx.drawImage(img3, 0, 280);
  }
}

var timer = 0;
var cactus_list = [];
var jumping_timer = 0;
var animation;
var randomInterval;
var isGameOver = false;
var ground;

function init() {
  if (!img1.complete || !img2.complete || !img3.complete) {
    return;
  }

  ground = new Ground();
  generateRandomInterval();
  animation = requestAnimationFrame(ani);
}

function generateRandomInterval() {
  randomInterval = Math.floor(Math.random() * 5 + 200);
}

function ani() {
  animation = requestAnimationFrame(ani);
  timer++;
  var cactusSpeed = 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (timer % randomInterval === 0) {
    var cactus = new Cactus();
    cactus_list.push(cactus);
    generateRandomInterval();
  }

  cactus_list.forEach((a, i, o) => {
    if (a.x < 0) {
      o.splice(i, 1);
      increaseScore();
    }
    a.x -= cactusSpeed;

    col(dino, a);
    a.draw();
  });

  var dinoSpeed = 1;

  //점프 기능
  if (jumping == true) {
    if (dino.y > 0) {
      dino.y -= dinoSpeed;
    }
    jumping_timer++;
  }
  if (jumping == false) {
    if (dino.y < 200) {
      dino.y += dinoSpeed;
    }
  }
  if (jumping_timer > 100) {
    jumping = false;
    jumping_timer = 0;
  }

  dino.draw();
  ground.draw();

  if (isGameOver) {
    drawReplayButton();
  }
}

var scoreElement = document.getElementById('score');
var score = 0;

function increaseScore() {
  score++;
  scoreElement.textContent = 'Score: ' + score;
}

//충돌확인
function col(dino, cactus) {
  var x_dif = cactus.x - (dino.x + dino.width);
  var y_dif = cactus.y - (dino.y + dino.height);
  if (x_dif < 0 && y_dif < 0) {
    isGameOver = true;
    cancelAnimationFrame(animation);
  }
  if (dino.x > cactus.x + cactus.width && !cactus.scored) {
    increaseScore();
    cactus.scored = true;
  }
}

var jumping = false;

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space') {
    jumping = true;
  }
});

function gameOver() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  isGameOver = true;
  cancelAnimationFrame(animation);
}

var replayButton = document.getElementById('replay-button');
var gameoverButton = document.getElementById('game-over');

function drawReplayButton() {
  replayButton.style.display = 'block';
  gameoverButton.style.display = 'block';

  replayButton.addEventListener('click', function () {
    resetGame();
  });
}

function resetGame() {
  replayButton.style.display = 'none';
  gameoverButton.style.display = 'none';
  cactus_list = [];
  timer = 0;
  jumping_timer = 0;
  isGameOver = false;
  score = 0;
  scoreElement.textContent = 'Score: ' + score;

  cancelAnimationFrame(animation);
  animation = requestAnimationFrame(ani);
}