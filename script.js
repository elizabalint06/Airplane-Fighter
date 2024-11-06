const TOTAL_BLOCKS = 25;
const BLOCK_SIZE = 25;
const NUM_OBSTACLES = 10;

let gameBoard, dx, dy, ctx, airplane, obstacles, interval, gameOver, score, timer;

startGame();
function moveGame() {
    printGameBoard();
    printAirplane();
    printObstacles();
    printScore();
    for (let i = 0; i < obstacles.length; ++i) {
        let obstacle = obstacles[i];
        console.log("Verific coliziunea...");
        if (checkCollision(airplane, obstacle)) {
            console.log("Collision detected. Game Over!");
            clearInterval(interval);  
            gameOverScreen();
            return;
        }
        obstacle.y += obstacle.speed;
        if (obstacle.y * BLOCK_SIZE > gameBoard.height) {
            obstacle.y = 0;
            obstacle.x = Math.floor(Math.random() * TOTAL_BLOCKS); 
            obstacle.speed = 0.1 + Math.random() * 0.3; 
        }
    }
}

function startGame() {
    document.addEventListener("keydown", keyPressed);
    document.body.innerHTML = "<canvas id='gameBoard' width='625' height='625'></canvas>";
    gameBoard = document.getElementById("gameBoard");
   
    ctx = gameBoard.getContext("2d");
    dx = 1;
    dy = 0;
    gameOver = false;
    airplaneImage = new Image();
    airplaneImage.src = 'airplane.jpg'; 
    airplaneImage.onload = function() {
        printAirplane();
    };

    airplane = {x : 10 , y : 20 };
    obstacles = [];
    score = 0;
    timer = 0;
    for (let i = 0; i < NUM_OBSTACLES; ++i) {
        obstacles.push({
            x: Math.floor(Math.random() * TOTAL_BLOCKS), 
            y: Math.floor(Math.random() * 10), 
            speed: 0.1 + Math.random() * 0.5
        });
    }
    interval = setInterval(moveGame, 50);
    setInterval(function() {
        ++score; 
    }, 1000);
}

function printGameBoard() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, TOTAL_BLOCKS * BLOCK_SIZE, TOTAL_BLOCKS * BLOCK_SIZE);
}

function printObstacles() {
    ctx.fillStyle = "pink";
    for (let i = 0; i < obstacles.length; ++i) {
        let obstacle = obstacles[i];
        ctx.fillRect(obstacle.x * BLOCK_SIZE, obstacle.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
}

function printScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
    

}
function printAirplane() {
    ctx.drawImage(airplaneImage, airplane.x * BLOCK_SIZE , airplane.y * BLOCK_SIZE, BLOCK_SIZE * 2, BLOCK_SIZE * 2);
}

function checkCollision() {
    for (let i = 0; i < obstacles.length; ++i) {
        let obstacle = obstacles[i];
        if (airplane.x < obstacle.x + 1 && airplane.x + 2 > obstacle.x && airplane.y < obstacle.y + 1 && airplane.y + 2 > obstacle.y) {
            gameOver = true;
            clearInterval(interval);
            gameOverScreen();
            
        }
    }
}

function gameOverScreen() {
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.fillText("Your score: " + score, gameBoard.width / 2 - 150, gameBoard.height / 2 );
    
}
function keyPressed(e) {
    if (e.keyCode == 37) { airplane.x--; } 
    else if (e.keyCode == 39) { airplane.x++; } 
}
