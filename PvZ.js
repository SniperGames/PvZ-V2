document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const sunCounter = document.getElementById('sun-counter');
    const gameBoard = document.querySelector('.game-board');
    const status = document.getElementById('status');
    let sunPoints = 50;
    let gameStarted = false;
    let killedZombies = 0;
  
    startButton.addEventListener('click', startGame);
  
    function startGame() {
      if (!gameStarted) {
        gameStarted = true;
        startButton.style.display = 'none';
        status.innerText = '';
        addPlantButtons();
        setInterval(spawnZombie, 10000);
        playBackgroundMusic();
      }
    }
  
    function addPlantButtons() {
      const plants = ['peashooter', 'sunflower', 'wallnut', 'potato-mine'];
      plants.forEach(plant => {
        const button = document.createElement('button');
        button.innerText = plant.replace('-', ' ');
        button.classList.add('plant-button');
        button.addEventListener('click', () => {
          if (sunPoints >= getPlantCost(plant)) {
            sunPoints -= getPlantCost(plant);
            sunCounter.innerText = `Słońce: ${sunPoints}`;
            addPlant(plant);
          } else {
            alert('Nie masz wystarczająco dużo słońca!');
          }
        });
        gamePanel.appendChild(button);
      });
    }
  
    function getPlantCost(plant) {
      switch (plant) {
        case 'peashooter':
          return 100;
        case 'sunflower':
          return 50;
        case 'wallnut':
          return 50;
        case 'potato-mine':
          return 25;
        default:
          return 0;
      }
    }
  
    function addPlant(plant) {
      const plantElement = document.createElement('div');
      plantElement.classList.add('plant', plant);
      gameBoard.appendChild(plantElement);
      plantElement.addEventListener('click', () => {
        handlePlantInteraction(plant, plantElement);
      });
    }
  
    function handlePlantInteraction(plant, plantElement) {
      switch (plant) {
        case 'peashooter':
          handlePeashooterShooting(plant);
          break;
        case 'sunflower':
          handleSunflowerInteraction();
          break;
        case 'wallnut':
          handleWallnutInteraction();
          break;
        case 'potato-mine':
          handlePotatoMineInteraction();
          break;
      }
    }
  
    function handlePeashooterShooting(peashooter) {
      playPeashooterSound();
      animatePeashooterShot(peashooter);
      const zombies = document.querySelectorAll('.zombie');
      zombies.forEach(zombie => {
        const zombiePosition = zombie.getBoundingClientRect();
        const peashooterPosition = document.querySelector(`.${peashooter}`).getBoundingClientRect();
        if (
          peashooterPosition.top <= zombiePosition.bottom &&
          peashooterPosition.bottom >= zombiePosition.top &&
          peashooterPosition.right >= zombiePosition.left
        ) {
          const zombieType = zombie.classList[1];
          switch (zombieType) {
            case 'normal':
              zombie.remove();
              killedZombies++;
              break;
            case 'flag':
              zombie.remove();
              killedZombies++;
              break;
            case 'bucket':
              zombie.remove();
              killedZombies++;
              break;
          }
          if (killedZombies === 100) {
            endGame(true);
          }
        }
      });
    }
  
    function handleSunflowerInteraction() {
      setInterval(collectSun, 10000);
    }
  
    function collectSun() {
      sunPoints += 50;
      sunCounter.innerText = `Słońce: ${sunPoints}`;
    }
  
    function handleWallnutInteraction() {
      const zombies = document.querySelectorAll('.zombie');
      zombies.forEach(zombie => {
        setTimeout(() => {
          const wallnutPosition = document.querySelector('.wallnut').getBoundingClientRect();
          const zombiePosition = zombie.getBoundingClientRect();
          if (
            wallnutPosition.top <= zombiePosition.bottom &&
            wallnutPosition.bottom >= zombiePosition.top &&
            wallnutPosition.right >= zombiePosition.left
          ) {
            zombie.remove();
            killedZombies++;
          }
        }, 20000);
      });
    }
  
    function handlePotatoMineInteraction() {
      const zombies = document.querySelectorAll('.zombie');
      zombies.forEach(zombie => {
        const potatoMinePosition = document.querySelector('.potato-mine').getBoundingClientRect();
        const zombiePosition = zombie.getBoundingClientRect();
        if (
          potatoMinePosition.top <= zombiePosition.bottom &&
          potatoMinePosition.bottom >= zombiePosition.top &&
          potatoMinePosition.right >= zombiePosition.left
        ) {
          zombie.remove();
          document.querySelector('.potato-mine').remove();
          playPotatoMineExplosionSound();
          killedZombies++;
          if (killedZombies === 100) {
            endGame(true);
          }
        }
      });
    }
  
    function spawnZombie() {
      const zombieTypes = ['normal', 'flag', 'bucket'];
      const randomType = zombieTypes[Math.floor(Math.random() * zombieTypes.length)];
      const zombie = document.createElement('div');
      zombie.classList.add('zombie', randomType);
      gameBoard.appendChild(zombie);
      const moveInterval = setInterval(() => {
        const zombiePosition = zombie.getBoundingClientRect();
        if (zombiePosition.left <= 0) {
          clearInterval(moveInterval);
          endGame(false);
        } else {
          zombie.style.left = `${zombiePosition.left - 10}px`;
        }
      }, 1000);
    }
  
    function playBackgroundMusic() {
      // Implementacja odtwarzania muzyki
    }
  
    function playPeashooterSound() {
      // Implementacja odtwarzania dźwięku strzału przez peashooter
    }
  
    function playPotatoMineExplosionSound() {
      // Implementacja odtwarzania dźwięku eksplozji potato mine
    }
  
    function animatePeashooterShot(peashooter) {
      const peashooterElement = document.querySelector(`.${peashooter}`);
      peashooterElement.classList.add('shoot-animation');
      setTimeout(() => {
        peashooterElement.classList.remove('shoot-animation');
      }, 500);
    }
  
    function endGame(win) {
      if (win) {
        status.innerText = 'Wygrałeś!';
      } else {
        status.innerText = 'Przegrałeś!';
      }
      startButton.innerText = 'Rozpocznij grę ponownie';
      startButton.style.display = 'block';
      gameStarted = false;
      gameBoard.innerHTML = '';
    }
  });
  