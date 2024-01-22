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
let speed = 750;

let moveInterval;
let moveRocksInterval;
let bullet; // Declare bullet outside of the function

function resetGame() {
  life = 3;
  rocksKilled = 0;
  speed = 750;

  restartBtn.style.display = "none";

  removeAll = setInterval(() => {
    const rocksToRemove = document.getElementsByClassName("rocks");
    for (const rock of rocksToRemove) {
      rock.parentElement.removeChild(rock);
    }
    setTimeout(() => {
      clearInterval(removeAll);
      restartBtn.style.display = "block";
    }, 1000);
  });

  scoreElement.innerHTML = '0';
  lifeElement.innerHTML = 'life : ' + life;

  clearInterval(moveRocksInterval);

  startGame();
}

function startGame() {
  moveRocksInterval = setInterval(() => {
    const existingRocks = document.getElementsByClassName("rocks");
    const left = parseInt(window.getComputedStyle(rocket).getPropertyValue("left"));

    for (const rock of existingRocks) {
      const rockBound = rock.getBoundingClientRect();
      const rocketBound = rocket.getBoundingClientRect();

      // Rock and Border Collision
      if (
        rocketBound.top <= rockBound.top &&
        rocketBound.bottom <= rockBound.bottom &&
        rock.classList.contains("rocksP")
      ) {
        rock.parentElement.removeChild(rock);
        life--;
        lifeElement.innerHTML = 'life : ' + life;
      } else if (
        rocketBound.top <= rockBound.top &&
        rocketBound.bottom <= rockBound.bottom &&
        rock.classList.contains("rocksN")
      ) {
        rock.parentElement.removeChild(rock);
      }

      // Bullet and Rock Collision
      if (bullet) {
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
          } else if (rock.classList.contains("rocksN")) {
            scoreElement.innerHTML = parseInt(scoreElement.innerHTML) - 1;
          }
          rocksKilled++;
        }

        // Bullet Out of Board
        const bulletBottom = parseInt(window.getComputedStyle(bullet).getPropertyValue("bottom"));
        if (bulletBottom >= 450) {
          bullet.parentElement.removeChild(bullet);
        }

        bullet.style.left = left + 6 + "px";
        bullet.style.bottom = bulletBottom + 3 + "px";
      }
    }

    // Rock Generation
    setTimeout(() => {
      const newRock1 = document.createElement("div");
      newRock1.classList.add("rocks", "rocksP");
      newRock1.style.left = Math.floor(Math.random() * 250) + 10 + "px";
      board.appendChild(newRock1);
    }, 3500);
    
    setTimeout(() => {
        const newRock2 = document.createElement("div");
        newRock2.classList.add("rocks", "rocksN");
        newRock2.style.left = Math.floor(Math.random() * 250) + 10 + "px";
        board.appendChild(newRock2);
    }, 4000);

    // Rock Movement
    setTimeout(() => {
      const allRocks = document.getElementsByClassName("rocks");
      for (const rock of allRocks) {
        const rockTop = parseInt(window.getComputedStyle(rock).getPropertyValue("top"));
        rock.style.top = rockTop + 25 + "px";
      }

      // Adjust Speed based on Rocks Killed
      if (rocksKilled === 90) {
        speed = 500;
      }
      if (rocksKilled === 60) {
        speed = 600;
      }
      if (rocksKilled === 30) {
        speed = 700;
      }

      // Game Over
      if (life === 0) {
        alert("Game Over");
        clearInterval(moveRocksInterval);
        window.location.reload();
      }
    }, speed);
  });
}

// Event Listeners
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

shootBtn.addEventListener("click", () => {
  const currentTime = new Date().getTime();
  const timeSinceLastShot = currentTime - lastShotTime;

  if (timeSinceLastShot >= 400) {
    bullet = document.createElement("div");
    bullet.classList.add("bullets");
    board.appendChild(bullet);

    lastShotTime = currentTime;
  }
});

restartBtn.addEventListener("click", resetGame);

// Start the initial game
startGame();
