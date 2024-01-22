const rocket = document.getElementById("rocket");
const board = document.getElementById("board");
const scoreElement = document.getElementById("score");

let rocksKilled = 0;
let lastShotTime = 0; // Variable to track the time of the last shot

document.addEventListener("keydown", (e) => {
  const currentTime = new Date().getTime();
  const timeSinceLastShot = currentTime - lastShotTime;

  //movement
  const left = parseInt(window.getComputedStyle(rocket).getPropertyValue("left"));

  if (e.key === "ArrowLeft" && left > 0) {
    rocket.style.left = left - 10 + "px";
  } else if (e.key === "ArrowRight" && left <= 460) {
    rocket.style.left = left + 10 + "px";
  }

  //bullet creation
  if ((e.key === "ArrowUp" || e.keyCode === 32) && e.repeat === false && timeSinceLastShot >= 400) {
    const bullet = document.createElement("div");
    bullet.classList.add("bullets");
    board.appendChild(bullet);

    lastShotTime = currentTime; // Update the last shot time

    //contact rock  bullet
    const moveBullet = setInterval(() => {
      const rocks = document.getElementsByClassName("rocks");

      for (const rock of rocks) {
        const rockBound = rock.getBoundingClientRect();
        const bulletBound = bullet.getBoundingClientRect();

        if (
          bulletBound.left >= rockBound.left && bulletBound.right <= rockBound.right &&
          bulletBound.top <= rockBound.top && bulletBound.bottom <= rockBound.bottom
        ) {
          rock.parentElement.removeChild(rock);
          bullet.parentElement.removeChild(bullet);

          scoreElement.innerHTML = parseInt(scoreElement.innerHTML) + 1;
          rocksKilled++;

          // Check for winning condition
          if (rocksKilled === 100) {
            alert("You Win!");
            clearInterval(moveRocksInterval);
            window.location.reload();
          }
        }
      }

      const bulletBottom = parseInt(window.getComputedStyle(bullet).getPropertyValue("bottom"));

      if (bulletBottom >= 500) {
        clearInterval(moveBullet);
        bullet.parentElement.removeChild(bullet);
      }

      //bullet shoot placement
      bullet.style.left = left + "px";
      bullet.style.bottom = bulletBottom + 3 + "px";
    });
  }
});

//rocks creation , position
let number_rocks1 = 750;
const generateRocksInterval1 = setInterval(() => {
  const rock1 = document.createElement("div");
  rock1.classList.add("rocks +");
  rock1.style.left = Math.floor(Math.random() * 450) + "px";
  board.appendChild(rock1);
  if (rocksKilled === 50) {
    speed = 1200;
  }
}, number_rocks1);

let number_rocks2 = 750;
const generateRocksInterval = setInterval(() => {
  const rock2 = document.createElement("div");
  rock2.classList.add("rocks -");
  rock2.style.left = Math.floor(Math.random() * 450) + "px";
  board.appendChild(rock2);
  if (rocksKilled === 50) {
    speed = 1200;
  }
}, number_rocks2);


//rock movement , control
let speed = 500;
const moveRocksInterval = setInterval(() => {
  const rocks = document.getElementsByClassName("rocks");

  for (const rock of rocks) {
    const rockTop = parseInt(window.getComputedStyle(rock).getPropertyValue("top"));

    if (rockTop >= 475) {
      alert("Game Over");
      clearInterval(moveRocksInterval);
      window.location.reload();
    }

    rock.style.top = rockTop + 25 + "px";
    if (rocksKilled === 80) {
      speed = 1500;
    }
  }
}, speed);
