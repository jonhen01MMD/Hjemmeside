// app.js

import { initNavBar } from './navbar.js';
import { initContactForm } from './contactForm.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavBar();
  initContactForm();

  // kode til "scroll-down" i hero
  const scrollDownLink = document.querySelector('.scroll-down a');
  scrollDownLink.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('#om').scrollIntoView({ behavior: 'smooth' });
  });
});


// Select the toggle button and theme icon
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Burger valgt theme eller gå efter "system preference"
function setTheme(theme) {
  document.body.classList.remove('light-theme', 'dark-theme');
  document.body.classList.add(theme);
  updateIcon(theme);
  localStorage.setItem('theme', theme);
}

// Function til at updater Dark and light icon
function updateIcon(theme) {
  if (theme === 'light-theme') {
    themeIcon.src = 'assets/moon.png';
  } else {
    themeIcon.src = 'assets/sun.png';
  }
}

// se hvis theme er gemt i localStorage, eller sæt default theme til sort
const savedTheme = localStorage.getItem('theme') || 'dark-theme';
setTheme(savedTheme);

// hvis der klikkes på knappen skift theme
themeToggleBtn.addEventListener('click', () => {
  const newTheme = document.body.classList.contains('light-theme') ? 'dark-theme' : 'light-theme';
  setTheme(newTheme);
});


// Spil liste 
class Game {
  constructor(name, platform, releaseDate, madeWith, imageUrl, link) {
    this.name = name;
    this.platform = platform;
    this.releaseDate = releaseDate;
    this.madeWith = madeWith;
    this.imageUrl = imageUrl;
    this.link = link;
  }

  createGameElement() {
    // Opret et anker-element (link)
    const gameLink = document.createElement('a');
    gameLink.href = this.link;
    gameLink.classList.add('game-link');

    // Opret et div element for spillet
    const gameDiv = document.createElement('div');
    gameDiv.classList.add('spil-item');

    // Indsæt spilbilledet
    const gameImage = document.createElement('img');
    gameImage.src = this.imageUrl;
    gameImage.alt = `Billede af ${this.name}`;
    gameImage.classList.add('spil-billede');
    gameDiv.appendChild(gameImage);

    // Opret en container til spilinfo
    const gameInfoDiv = document.createElement('div');
    gameInfoDiv.classList.add('spil-info');

    // Tilføj spillets navn
    const gameTitle = document.createElement('h3');
    gameTitle.textContent = this.name;
    gameInfoDiv.appendChild(gameTitle);

    // Tilføj platform
    const platformInfo = document.createElement('p');
    platformInfo.innerHTML = `Platform: <span class="platform">${this.platform}</span>`;
    gameInfoDiv.appendChild(platformInfo);

    // Tilføj udgivelsesdato
    const releaseDateInfo = document.createElement('p');
    releaseDateInfo.innerHTML = `Udgivet: <span class="udgivelse">${this.releaseDate}</span>`;
    gameInfoDiv.appendChild(releaseDateInfo);

    // Tilføj hvilke værktøjer spillet er lavet med
    const madeWithInfo = document.createElement('p');
    madeWithInfo.innerHTML = `Made with: <span class="madewith">${this.madeWith}</span>`;
    gameInfoDiv.appendChild(madeWithInfo);

    // Tilføj spilinfo-div til hoved-spil-div
    gameDiv.appendChild(gameInfoDiv);

    // går hele gamediv til et link
    gameLink.appendChild(gameDiv);

    return gameLink;
  }
}

    //liste over spil
    const games = [
      new Game('Tavern - Ikke Tilgængelig', 'PC/Mac', 'Igang værende projekt', 'Godot', 'assets/game/tavern/Screenshot1.png', 'spil_info_tavern.html'),
      new Game('Snake', 'WEB', '2024', 'HTML, CSS, JavaScript', 'assets/game/snake/Screenshot1.png', 'spil_info_snake.html'),
      new Game('Fest Spillet', 'PC, WEB for Mobil', '21.sep 2023', 'GameMaker 2023', 'assets/game/festspillet/Screenshot1.png', 'spil_info_festspil.html'),
      new Game('Horror Labyrint - Ikke Tilgængelig', 'PC', '2021', 'Unity', 'assets/spil-billede1.jpg', 'spil_liste.html'),
      new Game('Game of Bold 2018 Remake - Link på vej', 'PC', '2018', 'GameMaker', 'assets/game/gameofboldremake/Screenshot1.png', 'spil_liste.html'),
      new Game('Game of Bold - Link på vej', 'PC', '2010', 'GameMaker 8', 'assets/spil-billede1.jpg', 'spil_info_gameofbold.html')
    ];
    
    function displayGames() {
      const gameList = document.querySelector('.spil-liste');
      
      games.forEach(game => {
        const gameElement = game.createGameElement();
        gameList.appendChild(gameElement);
      });
    }
    
    document.addEventListener('DOMContentLoaded', displayGames);
    


