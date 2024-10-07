const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreBoard = document.getElementById('scoreBoard');
const scoreList = document.getElementById('scoreList');
const clearHighScoresButton = document.getElementById('clearHighScoresButton');
const difficultySelect = document.getElementById('difficulty');
const pauseButton = document.getElementById('pauseButton');
const categorySelect = document.getElementById('category');

const nameModal = document.getElementById('nameModal');
const playerNameInput = document.getElementById('playerName');
const submitNameButton = document.getElementById('submitName');

const optionsButton = document.getElementById('optionsButton');
const optionsModal = document.getElementById('optionsModal');
const godModeCheckbox = document.getElementById('godMode');

const foodCountInput = document.getElementById('foodCount');
const updateFoodCountButton = document.getElementById('updateFoodCountButton');

const snakeColorInput = document.getElementById('snakeColor');
const toggleGridCheckbox = document.getElementById('toggleGrid');
const closeOptionsButton = document.getElementById('closeOptions');

const wallWrappingCheckbox = document.getElementById('wallWrapping');

const backgroundThemeSelect = document.getElementById('backgroundTheme');

const gridSize = 20; 
const tileCountX = canvas.width / gridSize;
const tileCountY = canvas.height / gridSize;

// Game State Variables
let snake = [{ x: 10, y: 10 }];
let velocity = { x: 1, y: 0 };
let foods = [];
let score = 0;
let gameInterval;
let gameSpeed = 100;

let isPaused = false;
let isGameOver = false;
let godMode = false;
let wallWrapping = true;

let gameStarted = false;

let backgroundTheme = 'default';

// Function to Start the Game Loop
function gameLoop() {
    if (isGameOver || isPaused || !gameStarted) return;
    update();
    draw();
}

// Food Items
function initializeFood() {
    const foodCount = parseInt(foodCountInput.value) || 1;
    foods = [];
    for (let i = 0; i < foodCount; i++) {
        placeFood();
    }
}

// Update Game State
function update() {
    // Update snake position
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

    if (wallWrapping) {
        // Wrap
        if (head.x < 0) head.x = tileCountX - 1;
        if (head.x >= tileCountX) head.x = 0;
        if (head.y < 0) head.y = tileCountY - 1;
        if (head.y >= tileCountY) head.y = 0;
    } else {
        // Check collision with walls
        if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
            if (!godMode) {
                saveScore();
                return;
            } else {
                head.x = Math.max(0, Math.min(head.x, tileCountX - 1));
                head.y = Math.max(0, Math.min(head.y, tileCountY - 1));
            }
        }
    }

    // Check for collision with self (ignore head)
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            if (!godMode) {
                saveScore();
                return;
            }
        }
    }

    snake.unshift(head);

    // Check if any food is eaten
    for (let i = 0; i < foods.length; i++) {
        if (head.x === foods[i].x && head.y === foods[i].y) {
            score++;
            updateScore();
            foods.splice(i, 1); 
            placeFood();
            break;
        }
    }

    if (snake.length > score + 1) { 
        snake.pop();
    }
}

// Draw Game State
function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // bagrunds farve 
    switch (backgroundTheme) {
        case 'default':
            ctx.fillStyle = '#1e1e1e';
            break;
        case 'night':
            ctx.fillStyle = '#000000';
            break;
        case 'desert':
            ctx.fillStyle = '#EDC9AF';
            break;
        case 'space':
            const bgImage = new Image();
            bgImage.src = 'space-background.jpg'; 
            ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
            break;
        default:
            ctx.fillStyle = '#1e1e1e';
    }

    if (backgroundTheme !== 'space') {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw grid if enabled
    if (showGrid) {
        ctx.strokeStyle = '#333';
        for (let x = 0; x <= canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    // Apples farve
    ctx.fillStyle = '#ff0000';
    foods.forEach(food => {
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    });

    // Draw snake body parts 
    for (let i = 1; i < snake.length; i++) {
        const part = snake[i];
        ctx.fillStyle = snakeColorInput.value;
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    }

    const head = snake[0];
    ctx.fillStyle = snakeColorInput.value;
    ctx.fillRect(head.x * gridSize, head.y * gridSize, gridSize, gridSize);

    // øjne til snake
    ctx.fillStyle = '#000';
    const eyeSize = gridSize / 5;
    ctx.fillRect(
        head.x * gridSize + eyeSize,
        head.y * gridSize + eyeSize,
        eyeSize,
        eyeSize
    );
    ctx.fillRect(
        head.x * gridSize + gridSize - 2 * eyeSize,
        head.y * gridSize + eyeSize,
        eyeSize,
        eyeSize
    );
}

// Spawn random
function placeFood() {
    let newFood = {
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY)
    };

    const isOnSnake = snake.some(part => part.x === newFood.x && part.y === newFood.y);
    const isOnFood = foods.some(food => food.x === newFood.x && food.y === newFood.y);

    if (isOnSnake || isOnFood) {
        placeFood();
    } else {
        foods.push(newFood);
    }
}

// Reset game
function resetGame() {
    clearInterval(gameInterval);
    snake = [{ x: 10, y: 10 }];
    velocity = { x: 1, y: 0 };
    score = 0;
    gameSpeed = getGameSpeed();
    updateScore();
    initializeFood(); 
    isGameOver = false;
    isPaused = false;
    gameStarted = false;
    pauseButton.textContent = 'Pause';
    drawStartMessage();
}

// spil hastighed udfra difficulty
function getGameSpeed() {
    const difficulty = difficultySelect.value;
    switch (difficulty) {
        case 'easy':
            return 150;
        case 'medium':
            return 100;
        case 'hard':
            return 70;
        default:
            return 100;
    }
}

// Update Score Display
function updateScore() {
    scoreBoard.textContent = 'Score: ' + score;
}

// Save Score og Player Name
function saveScore() {

    isGameOver = true; 

    nameModal.style.display = 'flex'; 
}

// Player Name
submitNameButton.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim() || 'Anonymous';
    const now = new Date();
    const scoreEntry = {
        name: playerName,
        score: score,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString()
    };

    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push(scoreEntry);

    // soter og viser kun de 10 bedste score
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 10);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores();

    nameModal.style.display = 'none'; 
    playerNameInput.value = '';
    resetGame();
});

// Display High Scores Based on Selected Category
function displayHighScores() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const category = categorySelect.value;
    let filteredScores = highScores;

    const now = new Date();

    if (category === 'today') {
        filteredScores = highScores.filter(entry => {
            const entryDate = new Date(entry.date + ' ' + entry.time);
            return entryDate.toDateString() === now.toDateString();
        });
    } else if (category === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        filteredScores = highScores.filter(entry => {
            const entryDate = new Date(entry.date + ' ' + entry.time);
            return entryDate >= oneWeekAgo;
        });
    }

    scoreList.innerHTML = '';

    filteredScores.forEach((entry) => {
        const li = document.createElement('li');
        li.textContent = `${entry.name}: ${entry.score} - ${entry.date}`;
        scoreList.appendChild(li);
    });

    // Show or hide the "Clear High Scores"
    if (filteredScores.length > 0) {
        clearHighScoresButton.classList.add('show');
    } else {
        clearHighScoresButton.classList.remove('show');
    }
}

// Handle Key Presses to Control the Snake
function keyDown(e) {
    if (!gameStarted) {
        gameStarted = true;
        gameInterval = setInterval(gameLoop, gameSpeed);

        draw();
    }

    switch (e.keyCode) {
        case 37: // Left key
        case 65: // 'A' key
            if (velocity.x === 1) break;
            velocity = { x: -1, y: 0 };
            break;
        case 38: // Up key
        case 87: // 'W' key
            if (velocity.y === 1) break;
            velocity = { x: 0, y: -1 };
            break;
        case 39: // Right key
        case 68: // 'D' key
            if (velocity.x === -1) break;
            velocity = { x: 1, y: 0 };
            break;
        case 40: // Down key
        case 83: // 'S' key
            if (velocity.y === -1) break;
            velocity = { x: 0, y: 1 };
            break;
    }
}

// Attach Keydown Event Listener
document.addEventListener('keydown', keyDown);

// Clearing High Scores
clearHighScoresButton.addEventListener('click', () => {
    localStorage.removeItem('highScores');
    displayHighScores();
});

// Difficulty Selection
difficultySelect.addEventListener('change', () => {
    gameSpeed = getGameSpeed();
    if (gameStarted && !isPaused) {
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
});

// Leaderboard Category Selection
categorySelect.addEventListener('change', displayHighScores);

// Pause/Resume Button
pauseButton.addEventListener('click', () => {
    if (!gameStarted) return; 
    if (isPaused) {
        isPaused = false;
        gameInterval = setInterval(gameLoop, gameSpeed);
        pauseButton.textContent = 'Pause';
    } else {
        isPaused = true;
        clearInterval(gameInterval);
        pauseButton.textContent = 'Resume';
    }
});

// Updating Food
updateFoodCountButton.addEventListener('click', () => {
    const newFoodCount = parseInt(foodCountInput.value);
    if (isNaN(newFoodCount) || newFoodCount < 1 || newFoodCount > 100) {
        alert('Please enter a valid number between 1 and 100.');
        foodCountInput.value = foods.length; 
        return;
    }
    initializeFood();
});

// Opening Options Modal
optionsButton.addEventListener('click', () => {
    optionsModal.style.display = 'flex';
});

// God Mode Toggle
godModeCheckbox.addEventListener('change', () => {
    godMode = godModeCheckbox.checked;
});

// Wall Wrapping Toggle
wallWrappingCheckbox.addEventListener('change', () => {
    wallWrapping = wallWrappingCheckbox.checked;
});

// Background Theme Change
backgroundThemeSelect.addEventListener('change', () => {
    backgroundTheme = backgroundThemeSelect.value;
    document.body.className = `${backgroundTheme}-theme`;
});

// Close Button
closeOptionsButton.addEventListener('click', () => {
    optionsModal.style.display = 'none';
});

// snake farve hvis man skifter farve
snakeColorInput.addEventListener('input', () => {

});

// Grid Visibility Toggle
let showGrid = true;

toggleGridCheckbox.addEventListener('change', () => {
    showGrid = toggleGridCheckbox.checked;
});

// viser start besked til brugeren 
function drawStartMessage() {
    draw(); 
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press any key to begin', canvas.width / 2, canvas.height / 2);
}

// 
window.onload = function() {
    gameSpeed = getGameSpeed();
    displayHighScores();
    updateScore();
    initializeFood(); 

    drawStartMessage();

    document.body.className = `${backgroundTheme}-theme`;
};
