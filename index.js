const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const color = "#bb5300"
const unitSize = 25;
let running = false;
let press = false;
let listeningForKeyPress = true;
const directionQueue = [];
let gameOverHack = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
window.addEventListener("keydown", startOnKeyPress);
window.addEventListener("keydown", reset);
window.addEventListener("keydown", toggleGameOverHack)

drawSnake();

function startOnKeyPress(event) {
    if (listeningForKeyPress && !running && event.keyCode) {
        gameStart();
    }
}

function gameStart(){
    if(!running) {
    running= true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick()
    }
};
function nextTick(){
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake()
            drawSnake();
            checkGameOver()
            if (directionQueue.length > 0) {
                const nextDirection = directionQueue.shift();
                xVelocity = nextDirection.x;
                yVelocity = nextDirection.y;
            }
            nextTick();
        }, 90);
    }
    else{
        displayGameOver();
    }
};
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};  
function createFood(){
    let validPosition = false;
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum ;
    }
    while (!validPosition) {
        randX = randomFood(0, gameWidth - unitSize);
        randY = randomFood(0, gameWidth - unitSize);
    let overlap = false;
    for (const snakePart of snake) {
        if (snakePart.x === randX && snakePart.y === randY) {
            overlap = true;
            break;
        }
    }
    if(!overlap) {
        foodX = randX
        foodY = randY
        validPosition = true
    }
    }
};
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};
function drawSnake(){
    snake.forEach((snakePart, index) => {
        ctx.fillStyle = index === 0 ? color : snakeColor
        ctx.strokeStyle = snakeBorder;
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};
function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};
    
    snake.unshift(head);
    //if food is eaten
    if(snake[0].x == foodX && snake[0].y == foodY){
        score+=1;
        scoreText.textContent = score;
        createFood();
        
    }
    else{
        snake.pop();
    }     
};
function changeDirection(event){
    
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true){
        case (keyPressed === LEFT || keyPressed === 65) && !goingRight:
            enqueueDirection(-unitSize, 0);
            break;
        case (keyPressed === UP || keyPressed === 87) && !goingDown:
            enqueueDirection(0, -unitSize);
            break;
        case (keyPressed === RIGHT || keyPressed === 68) && !goingLeft:
            enqueueDirection(unitSize, 0);
            break;
        case (keyPressed === DOWN || keyPressed === 83) && !goingUp:
            enqueueDirection(0, unitSize);
            break;
    }

    function enqueueDirection(newXVelocity, newYVelocity) {
        if(running) {
            directionQueue.push({ x: newXVelocity, y: newYVelocity });
        }
    }
};
function checkGameOver(){
    if(!gameOverHack) {
    switch(true){
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
                running = false;
                break;
    }
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }
    }
};
function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
    listeningForKeyPress = false
};
function resetGame(){
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];
    gameStart();
    listeningForKeyPress = true
};
function reset(event) {
    let keyP = event.keyCode
    if (keyP == 32) {
        resetGame()
    }
}
function toggleGameOverHack(event) {
    if (event.keyCode === 72) {
        gameOverHack = !gameOverHack; 
    }
}