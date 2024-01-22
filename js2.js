const board = document.getElementById("board");
const rocket = document.getElementById("rocket");
const scoreElement = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");
const lifeElement = document.getElementById("life");
const moveLeftBtn = document.getElementById("moveLeftBtn");
const moveRightBtn = document.getElementById("moveRightBtn");
const shootBtn = document.getElementById("shootBtn");

let life = 3;
let rocksKilled = 0;
let lastShotTime = 0;
let speed = 700;

let moveInterval;
let generateRocksInterval1;
let moveRocksInterval;

function resetGame() {
  life = 3;
  rocksKilled = 0;
  speed = 700;

  restartBtn.style.display="none";

  removeAll=setInterval(()=>{
    const rocks = document.getElementsByClassName("rocks");
    for (const rock of rocks) {
      rock.parentElement.removeChild(rock);
    }
    setTimeout(() => {
      clearInterval(removeAll);
      restartBtn.style.display="block";
    }, 1000);
    
  });

  scoreElement.innerHTML = '0';
  lifeElement.innerHTML = 'life : ' + life;

  clearInterval(generateRocksInterval1);
  clearInterval(moveRocksInterval);

  startGame();
}


function startGame() {

  generateRocksInterval1 = setInterval(() => {
    const rock1 = document.createElement("div");
    rock1.classList.add("rocks", "rocksP");
    rock1.style.left = Math.floor(Math.random() * 250) + 10 + "px";
    board.appendChild(rock1);

    setTimeout(() => {
      const rock2 = document.createElement("div");
      rock2.classList.add("rocks", "rocksN");
      rock2.style.left = Math.floor(Math.random() * 250) + 10 + "px";
      board.appendChild(rock2);
    }, 1500);
  }, 3500);
//----------------------------------------------------------------------------------------
  moveRocksInterval = setInterval(() => {
    const rocks = document.getElementsByClassName("rocks");

    for (const rock of rocks) {
      const rockTop = parseInt(window.getComputedStyle(rock).getPropertyValue("top"));
      rock.style.top = rockTop + 25 + "px";
    }

    const moveBullet = setInterval(() => {
      const rocks = document.getElementsByClassName("rocks");

      for (const rock of rocks) {
        const rockBound = rock.getBoundingClientRect();
        const rocketBound = rocket.getBoundingClientRect();

        if (
          rocketBound.top <= rockBound.top &&
          rocketBound.bottom <= rockBound.bottom &&
          rock.classList.contains("rocksP")       ) {
            rock.parentElement.removeChild(rock);
            life--;
            lifeElement.innerHTML = 'life : ' + life;
        } else if (
          rocketBound.top <= rockBound.top &&
          rocketBound.bottom <= rockBound.bottom &&
          rock.classList.contains("rocksN")     ) {
            rock.parentElement.removeChild(rock);
        }
      }
    });

    if (life === 0) {
      alert("Game Over");
      clearInterval(moveRocksInterval);
      window.location.reload();
    }

    if (rocksKilled === 90) {
      speed = 500;
    }
    if (rocksKilled === 60) {
      speed = 600;
    }

    if (rocksKilled === 30) {
      speed = 650;
    }
  }, speed);
}

//events-------------------------------------------------------------------------------
moveLeftBtn.addEventListener("click", () => {
  const left = parseInt(window.getComputedStyle(rocket).getPropertyValue("left"));
  if (left > 20) {
    rocket.style.left = left - 10 + "px";
  }
});

moveRightBtn.addEventListener("click", () => {
  const left = parseInt(window.getComputedStyle(rocket).getPropertyValue("left"));
  if (left <= 276) {
    rocket.style.left = left + 10 + "px";
  }
});

moveLeftBtn.addEventListener("touchstart", () => {
  moveInterval = setInterval(() => {
    const left = parseInt(window.getComputedStyle(rocket).getPropertyValue("left"));
    if (left > 25) {
      rocket.style.left = left - 10 + "px";
    }
  }, 50);
});

moveRightBtn.addEventListener("touchstart", () => {
  moveInterval = setInterval(() => {
    const left = parseInt(window.getComputedStyle(rocket).getPropertyValue("left"));
    if (left <= 270) {
      rocket.style.left = left + 10 + "px";
    }
  }, 50);
});

moveLeftBtn.addEventListener("touchend", () => {
  clearInterval(moveInterval);
});

moveRightBtn.addEventListener("touchend", () => {
  clearInterval(moveInterval);
});

shootBtn.addEventListener("click", () => {
  const left = parseInt(window.getComputedStyle(rocket).getPropertyValue("left"));
  const currentTime = new Date().getTime();
  const timeSinceLastShot = currentTime - lastShotTime;

  if (timeSinceLastShot >= 400) {
    const bullet = document.createElement("div"); 
    bullet.classList.add("bullets");
    board.appendChild(bullet);

    lastShotTime = currentTime;

    const moveBullet = setInterval(() => {
      const rocks = document.getElementsByClassName("rocks");

      for (const rock of rocks) {
        const rockBound = rock.getBoundingClientRect();
        const bulletBound = bullet.getBoundingClientRect();

        if (
          bulletBound.left >= rockBound.left &&
          bulletBound.right <= rockBound.right &&
          bulletBound.top <= rockBound.top &&
          bulletBound.bottom <= rockBound.bottom
        ) {
          rock.parentElement.removeChild(rock);
          bullet.parentElement.removeChild(bullet);

          if (rock.classList.contains("rocksP")) {
            scoreElement.innerHTML = parseInt(scoreElement.innerHTML) + 1;
          } 
          else if (rock.classList.contains("rocksN")) {
            scoreElement.innerHTML = parseInt(scoreElement.innerHTML) - 1;
          }
          rocksKilled++;
        }
      }

      const bulletBottom = parseInt(window.getComputedStyle(bullet).getPropertyValue("bottom"));
      if (bulletBottom >= 475) {
        clearInterval(moveBullet);
        bullet.parentElement.removeChild(bullet);
      }

      bullet.style.left = left + 6 + "px";
      bullet.style.bottom = bulletBottom + 4 + "px";
    });
  }
});

restartBtn.addEventListener("click", resetGame);

// Start the initial game
startGame();
