const TOTAL_BLOCKS = 24;
const BLOCK_SIZE = 24;
const NUM_OBSTACLES = 5;

const LEFT = 37;
const RIGHT = 39;
const SECOND = 1000;

const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");

let dx = 1;
let dy = 0;
let airplane;
let obstacles;
let interval; 
let score = 0;
let timer = 0;

function startGame() {
    document.addEventListener("keydown", keyPressed);
    airplaneImage = new Image();
    airplaneImage.src = 'airplane.jpg'; 
    airplaneImage.onload = function() {
        printAirplane();
    };

    airplane = { x: 10 , y: 22 };
    obstacles = [];
    for (let i = 0; i < NUM_OBSTACLES; ++i) {
        obstacles.push({
            x: Math.floor(Math.random() * TOTAL_BLOCKS), 
            y: Math.floor(Math.random() * 10), 
            speed: 0.1 + Math.random() * 0.5
        });
    }
    interval = setInterval(frameUpdate, 50);
}

startGame();

function keyPressed(e) {
    if (e.keyCode == LEFT) { 
        --airplane.x; 
    } else if (e.keyCode == RIGHT) {
        ++airplane.x;
    } 
}

function frameUpdate() {
    printGameBoard();
    printAirplane();
    printObstacles();
    printScore();
    updateObstacles();
    checkCollision();
}

function updateObstacles() {
    for (let i = 0; i < obstacles.length; ++i) {
        let obstacle = obstacles[i];
        obstacle.y += obstacle.speed;
        if (obstacle.y * BLOCK_SIZE > gameBoard.height) {
            ++score;
            obstacle.y = 0;
            obstacle.x = Math.floor(Math.random() * TOTAL_BLOCKS); 
            obstacle.speed = 0.1 + Math.random() * 0.3; 
        }
    }
}

function isColliding(obj1, obj2) {
    return (
        obj1.x < obj2.x + 1 &&
        obj1.x + 2 > obj2.x &&
        obj1.y < obj2.y + 1 &&
        obj1.y + 2 > obj2.y
    );
}
function checkCollision() {
    for (let i = 0; i < obstacles.length; ++i) {
        let obstacle = obstacles[i];
        if (isColliding(airplane, obstacle)) {
            clearInterval(interval);
            gameOverScreen();
        }
    }
}

function printGameBoard() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, TOTAL_BLOCKS * BLOCK_SIZE, TOTAL_BLOCKS * BLOCK_SIZE);
}

function printObstacles() {
    ctx.fillStyle = "pink";
    for (let i = 0; i < obstacles.length; ++i) {
        let obstacle = obstacles[i];
        ctx.fillRect(obstacle.x * BLOCK_SIZE, 
            obstacle.y * BLOCK_SIZE, 
            BLOCK_SIZE, BLOCK_SIZE);
    }
}

function printScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

function printAirplane() {
    ctx.drawImage(airplaneImage, airplane.x * BLOCK_SIZE , 
        airplane.y * BLOCK_SIZE, BLOCK_SIZE * 2, BLOCK_SIZE * 2);
}

function gameOverScreen() {
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.fillText("Your score: " + score,
        gameBoard.width / 2 - 150, gameBoard.height / 2);
}