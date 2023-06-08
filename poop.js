var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = 853;
canvas.height = 576;

var img1 = new Image();
img1.onload = function() {
  init();
};
img1.src = 'img/mike.png';

var img2 = new Image();
img2.onload = function() {
  init();
};
img2.src = 'img/poop.png';

var mike = {
  x: canvas.width / 2,
  y: canvas.height - 80,
  width: 50,
  height: 50,
  draw() {
    ctx.drawImage(img1, this.x, this.y);
  }
};

var poopList = [];
var poopSpeed = 3;
var score = 0;
var scoreElement = document.getElementById('score');
var restartButton = document.getElementById('restart-button');
var poopInterval;

function poop() {
  var poop = {
    x: Math.random() * (canvas.width - 20),
    y: 0,
    width: 20,
    height: 20,
    draw() {
      ctx.drawImage(img2, this.x, this.y);
    },
    update() {
      this.y += poopSpeed;
      this.draw();
    }
  };
  poopList.push(poop);
}

function drawScore() {
  scoreElement.textContent = 'Score: ' + score;
}

function detectCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  mike.draw();
  drawScore();

  for (var i = 0; i < poopList.length; i++) {
    var poop = poopList[i];
    poop.update();

    if (detectCollision(mike, poop)) {
      gameOver();
      return;
    }

    if (poop.y > canvas.height) {
      poopList.splice(i, 1);
      score++;
      i--;
    }
  }

  requestAnimationFrame(gameLoop);
}

function startGame() {
  score = 0;
  poopList = [];
  gameLoop();
  poopInterval = setInterval(poop, 1000);
}

function gameOver() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '48px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
  drawRestartButton();
}

function resetGame() {
    score = 0;
    poopList = [];
    mike.x = canvas.width / 2;
    poopSpeed = 3;
    restartButton.style.display = 'none';
    clearInterval(poopInterval);
    gameLoop();
    poopInterval = setInterval(poop, 1000);
  }
  
  function drawRestartButton() {
    restartButton.style.display = 'block';
    restartButton.addEventListener('click', function() {
      resetGame();
    });
  }

document.addEventListener('keydown', function(event) {
  if (event.code === 'ArrowLeft') {
    if (mike.x > 0) { // 좌측 벽 체크
        mike.x -= 20;
    }
}
    else if (event.code === 'ArrowRight') {
        if (mike.x + mike.width < canvas.width) { // 우측 벽 체크
            mike.x += 20;
        }
    }
});

startGame();
