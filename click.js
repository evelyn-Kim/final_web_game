var gameContainer = document.getElementById('game-container');
var clicks = [];
var score = 0;
var missedClick = 0; // 놓친 횟수 변수 추가
var isGameStarted = false;
var clickSpeed = 1000;
var originalClickSpeed = clickSpeed; // 원래 속도 저장

var startButton = document.getElementById('start-button');
var restartButton = document.getElementById('re-button');
var scoreElement = document.getElementById('score1');

var clickInterval;

function createClick() {
  var mole = document.createElement('div');
  mole.classList.add('hole');
  mole.addEventListener('click', function() {
    clickhole(mole);
  });
  return mole;
}

function renderGame() {
  gameContainer.innerHTML = '';
  clicks.forEach(function(row) {
    var rowElement = document.createElement('div');
    rowElement.classList.add('row');
    row.forEach(function(mole) {
      rowElement.appendChild(mole);
    });
    gameContainer.appendChild(rowElement);
  });
}

function generateRandomClick() {
  var randomRowIndex = Math.floor(Math.random() * clicks.length);
  var randomClickIndex = Math.floor(Math.random() * clicks[randomRowIndex].length);
  var mole = clicks[randomRowIndex][randomClickIndex];
  mole.classList.add('active');
  setTimeout(function() {
    mole.classList.remove('active');
    // 놓친 횟수 증가
    missedClick++;
  }, clickSpeed);

  // 점수에 따라 속도 증가
  if (score >= 10) {
    increaseClickSpeed();
  }
  
  // 게임 오버 확인
  if (Math.abs(score - missedClick) >= 5) {
    gameOver();
  }
}

function startGame() {
  if (!isGameStarted) {
    isGameStarted = true;
    startButton.disabled = true;
    score = 0;
    missedClick = 0; // 놓친 횟수 초기화
    scoreElement.textContent = 'Score: ' + score;
    clickInterval = setInterval(generateRandomClick, clickSpeed);
  }
}

function gameOver() {
  isGameStarted = false;
  clearInterval(clickInterval);
  restartButton.style.display = 'block';
  clickSpeed = originalClickSpeed; // 게임 오버 후 속도 복구
}

function restartGame() {
  restartButton.style.display = 'none';
  startButton.disabled = false;
  score = 0;
  missedClick = 0; // 놓친 횟수 초기화
  scoreElement.textContent = 'Score: ' + score;
  isGameStarted = false;
  clickSpeed = originalClickSpeed; // 속도 복구
  renderGame();
}

function clickhole(click) {
  if (click.classList.contains('active')) {
    click.classList.remove('active');
    score++;
    scoreElement.textContent = 'Score: ' + score;
  }
}

function increaseClickSpeed() {
  clickSpeed -= 100; // 속도를 증가시킴
  if (clickSpeed < 100) {
    clickSpeed = 100; // 속도가 최소값을 넘지 않도록 제한
  }
}

function init() {
  for (var i = 0; i < 3; i++) {
    var row = [];
    for (var j = 0; j < 3; j++) {
      var click = createClick();
      row.push(click);
    }
    clicks.push(row);
  }
  renderGame();
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

init();