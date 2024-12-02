const TOTAL_BLOCKS = 25;
const BLOCK_SIZE = 25;
const NUM_OBSTACLES = 10;
const AIRPLANE_START_X = 10;
const AIRPLANE_START_Y = 22;
const MAX_OBSTACLE_START_Y = 10;
const MIN_OBSTACLE_SPEED = 0.1;
const MAX_OBSTACLE_SPEED = 0.5;
const OBSTACLE_SPEED_RESET = 0.3;
const PROJECTILE_X = 0.7;
const PROJECTILE_Y = 0.5;
const PROJECTILE_SPEED = 2;
const COLLISION_MARGIN_X = 1;
const COLLISION_MARGIN_Y = 1;
const COLLISION_WIDTH = 2;
const COLLISION_HEIGHT = 2;
const INTERVAL = 50;
const SCORE_X = 10;
const SCORE_Y = 30;
const GAME_OVER_TEXT = 150;

const LEFT = 37;
const RIGHT = 39;
const SPACE = 32;
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
let projectiles = [];

function startGame() {
    document.addEventListener("keydown", keyPressed);
    airplaneImage = new Image();
    airplaneImage.src = 'images/airplane.jpg'; 
    airplaneImage.onload = function() {
        printAirplane();
    };
    eggImage = new Image();
    eggImage.src = 'images/egg.jpg';
    eggImage.onload = function() {
        printObstacles();
    };
    projectileImage = new Image();
    projectileImage.src = 'images/projectile.jpg';
    projectileImage.onload = function() {
        printProjectiles();
    }

    airplane = { x: AIRPLANE_START_X , y: AIRPLANE_START_Y };
    obstacles = [];
    for (let i = 0; i < NUM_OBSTACLES; ++i) {
        obstacles.push({
            x: Math.floor(Math.random() * TOTAL_BLOCKS), 
            y: Math.floor(Math.random() * MAX_OBSTACLE_START_Y), 
            speed: MIN_OBSTACLE_SPEED + Math.random() * MAX_OBSTACLE_SPEED
        });
    }
    interval = setInterval(frameUpdate, INTERVAL);
}

startGame();

function keyPressed(e) {
    if (e.keyCode == LEFT) { 
        --airplane.x; 
    } else if (e.keyCode == RIGHT) {
        ++airplane.x;
    } else if (e.keyCode == SPACE) {
        shootProjectile();
    }
}

function frameUpdate() {
    printGameBoard();
    printAirplane();
    printObstacles();
    printScore();
    updateProjectiles();
    checkCollision();
    updateObstacles();
    printProjectiles();
    destroyObstacle();
}

function updateObjects(objects, updateFn) {
    for (let i = 0; i < objects.length; ++i) {
        updateFn(objects[i], i, objects);
    }
}

 function updateObstacles() { 
    updateObjects(obstacles, function (obstacle) {
        obstacle.y += obstacle.speed;
        if (obstacle.y * BLOCK_SIZE > gameBoard.height) {
            obstacle.y = 0;
            obstacle.x = Math.floor(Math.random() * TOTAL_BLOCKS);
            obstacle.speed = MIN_OBSTACLE_SPEED + Math.random() * OBSTACLE_SPEED_RESET;
        }
    });
}

function updateProjectiles() {
    updateObjects(projectiles, function (projectile, index, array) {
        projectile.y -= projectile.speed;
        
    });
}

function shootProjectile() {
    projectiles.push({
        x: airplane.x + PROJECTILE_X,
        y: airplane.y - PROJECTILE_Y,
        speed: PROJECTILE_SPEED
    });
}

function isColliding(obj1, obj2) {
    return (
        obj1.x < obj2.x + COLLISION_MARGIN_X &&
        obj1.x + COLLISION_WIDTH > obj2.x &&
        obj1.y < obj2.y + COLLISION_MARGIN_Y &&
        obj1.y + COLLISION_HEIGHT > obj2.y
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

function destroyObstacle() {
    for (let i = 0; i < obstacles.length; ++i) {
        let obstacle = obstacles[i];
        for (let j = 0; j < projectiles.length; ++j) {
            let projectile = projectiles[j];
            if (isColliding(projectile, obstacle)) {
                obstacle.y = 0;
                obstacle.x = Math.floor(Math.random() * TOTAL_BLOCKS); 
                obstacle.speed = MIN_OBSTACLE_SPEED + Math.random() * OBSTACLE_SPEED_RESET; 
                projectiles.splice(j, 1);
                ++score;
                break;
            }
        }
    }
}

function print(object, image, scale = 1) {
    ctx.drawImage(
        image,
         object.x * BLOCK_SIZE, 
        object.y * BLOCK_SIZE, 
        BLOCK_SIZE * scale, BLOCK_SIZE * scale
    );
}

function printAirplane() {
    print(airplane, airplaneImage, 2);
}

function printObstacles() {
    for (let i = 0; i < obstacles.length; ++i) {
        let obstacle = obstacles[i];
        print(obstacle, eggImage);
    }
}

function printProjectiles() {
    for (let i = 0; i < projectiles.length; ++i) {
        let projectile = projectiles[i]; 
        print(projectile, projectileImage);
    }
}

function printGameBoard() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, TOTAL_BLOCKS * BLOCK_SIZE, TOTAL_BLOCKS * BLOCK_SIZE);
}

function printScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Monospace";
    ctx.fillText("Score: " + score, SCORE_X, SCORE_Y);
}

function gameOverScreen() {
    ctx.fillStyle = "red";
    ctx.font = "50px Monospaced";
    ctx.fillText("Your score: " + score,
        gameBoard.width / 2 - GAME_OVER_TEXT, gameBoard.height / 2);
}
