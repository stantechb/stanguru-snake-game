// ==========================
// STANGURU SNAKE GAME
// Created by Stantech Guru
// ==========================


// ==========================
// CANVAS
// ==========================

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var CELL = 20;


// ==========================
// GAME VARIABLES
// ==========================

var snake = [];

var food = null;
var coin = null;
var specialFood = null;

var obstacles = [];

var direction = "right";
var nextDirection = "right";

var score = 0;
var coins = 0;
var level = 1;

var highScore =
    Number(localStorage.getItem("stanguruHighScore")) || 0;

var missionProgress = 0;
var missionTarget = 10;

var gameOver = false;
var paused = false;
var countingDown = false;

var achievedNewHighScore = false;


// ==========================
// TIMERS
// ==========================

var gameTimer = null;
var countdownTimer = null;

var specialFoodSpawnTimer = null;
var specialFoodLifeTimer = null;


// ==========================
// SOUND
// ==========================

var soundOn = true;

var letsGoSound =
    new Audio("stanguru sound/letsgo.mp3");

var yummySound =
    new Audio("stanguru sound/yummy.mp3");

var newHighScoreSound =
    new Audio("stanguru sound/newhighscore.mp3");

var gameOverSound =
    new Audio("stanguru sound/gameover.mp3");


// Preload sounds
letsGoSound.preload = "auto";
yummySound.preload = "auto";
newHighScoreSound.preload = "auto";
gameOverSound.preload = "auto";


// ==========================
// HTML ELEMENTS
// ==========================

var startScreen =
    document.getElementById("startScreen");

var gameScreen =
    document.getElementById("gameScreen");

var gameOverMenu =
    document.getElementById("gameOverMenu");

var scoreText =
    document.getElementById("score");

var highScoreText =
    document.getElementById("highScore");

var coinsText =
    document.getElementById("coins");

var levelText =
    document.getElementById("level");

var missionText =
    document.getElementById("missionText");

var missionProgressText =
    document.getElementById("missionProgress");

var achievementList =
    document.getElementById("achievementList");

var finalScore =
    document.getElementById("finalScore");

var finalHighScore =
    document.getElementById("finalHighScore");

var highScoreMessage =
    document.getElementById("highScoreMessage");


// ==========================
// SOUND FUNCTION
// ==========================

function playSound(sound) {

    if (!soundOn) {
        return;
    }

    try {

        sound.pause();

        sound.currentTime = 0;

        var result = sound.play();

        if (result !== undefined) {

            result.catch(function(error) {

                console.log(
                    "Audio playback error:",
                    error
                );

            });

        }

    } catch (error) {

        console.log(
            "Sound error:",
            error
        );

    }

}


// ==========================
// STOP ALL SOUNDS
// ==========================

function stopAllSounds() {

    var sounds = [
        letsGoSound,
        yummySound,
        newHighScoreSound,
        gameOverSound
    ];


    for (
        var i = 0;
        i < sounds.length;
        i++
    ) {

        try {

            sounds[i].pause();

            sounds[i].currentTime = 0;

        } catch (error) {

            console.log(error);

        }

    }

}


// ==========================
// CREATE SNAKE
// ==========================

function createSnake() {

    snake = [

        {
            x: 5,
            y: 5
        },

        {
            x: 4,
            y: 5
        },

        {
            x: 3,
            y: 5
        }

    ];

}


// ==========================
// CHECK OCCUPIED POSITION
// ==========================

function occupiedBySnakeOrObstacle(x, y) {

    for (
        var i = 0;
        i < snake.length;
        i++
    ) {

        if (
            snake[i].x === x &&
            snake[i].y === y
        ) {

            return true;

        }

    }


    for (
        var j = 0;
        j < obstacles.length;
        j++
    ) {

        if (
            obstacles[j].x === x &&
            obstacles[j].y === y
        ) {

            return true;

        }

    }


    return false;

}


// ==========================
// CREATE FOOD
// ==========================

function createFood() {

    var position;

    do {

        position = {

            x:
                Math.floor(
                    Math.random() * 18
                ) + 1,

            y:
                Math.floor(
                    Math.random() * 18
                ) + 1

        };

    } while (

        occupiedBySnakeOrObstacle(
            position.x,
            position.y
        )

        ||

        (
            coin &&
            position.x === coin.x &&
            position.y === coin.y
        )

        ||

        (
            specialFood &&
            position.x === specialFood.x &&
            position.y === specialFood.y
        )

    );


    food = position;

}


// ==========================
// CREATE COIN
// ==========================

function createCoin() {

    var position;

    do {

        position = {

            x:
                Math.floor(
                    Math.random() * 18
                ) + 1,

            y:
                Math.floor(
                    Math.random() * 18
                ) + 1

        };

    } while (

        occupiedBySnakeOrObstacle(
            position.x,
            position.y
        )

        ||

        (
            food &&
            position.x === food.x &&
            position.y === food.y
        )

        ||

        (
            specialFood &&
            position.x === specialFood.x &&
            position.y === specialFood.y
        )

    );


    coin = position;

}


// ==========================
// CREATE SPECIAL FOOD
// ==========================

function createSpecialFood() {

    var position;

    do {

        position = {

            x:
                Math.floor(
                    Math.random() * 18
                ) + 1,

            y:
                Math.floor(
                    Math.random() * 18
                ) + 1

        };

    } while (

        occupiedBySnakeOrObstacle(
            position.x,
            position.y
        )

        ||

        (
            food &&
            position.x === food.x &&
            position.y === food.y
        )

        ||

        (
            coin &&
            position.x === coin.x &&
            position.y === coin.y
        )

    );


    specialFood = position;


    clearTimeout(
        specialFoodLifeTimer
    );


    specialFoodLifeTimer =
        setTimeout(
            function() {

                specialFood = null;

                draw();

                startSpecialFoodTimer();

            },
            5000
        );


    draw();

}


// ==========================
// SPECIAL FOOD TIMER
// ==========================

function startSpecialFoodTimer() {

    clearTimeout(
        specialFoodSpawnTimer
    );


    specialFoodSpawnTimer =
        setTimeout(
            function() {

                if (
                    !gameOver &&
                    !paused &&
                    !countingDown
                ) {

                    createSpecialFood();

                } else {

                    startSpecialFoodTimer();

                }

            },
            5000
        );

}


// ==========================
// STOP SPECIAL FOOD TIMER
// ==========================

function stopSpecialFoodTimer() {

    clearTimeout(
        specialFoodSpawnTimer
    );

    clearTimeout(
        specialFoodLifeTimer
    );


    specialFoodSpawnTimer = null;
    specialFoodLifeTimer = null;

    specialFood = null;

}


// ==========================
// CREATE OBSTACLES
// ==========================

function createObstacles() {

    obstacles = [];


    var amount =
        Math.min(
            level - 1,
            8
        );


    for (
        var i = 0;
        i < amount;
        i++
    ) {

        var position;

        var attempts = 0;


        do {

            position = {

                x:
                    Math.floor(
                        Math.random() * 18
                    ) + 1,

                y:
                    Math.floor(
                        Math.random() * 18
                    ) + 1

            };


            attempts++;

        } while (

            occupiedBySnakeOrObstacle(
                position.x,
                position.y
            )

            ||

            (
                food &&
                position.x === food.x &&
                position.y === food.y
            )

            ||

            (
                coin &&
                position.x === coin.x &&
                position.y === coin.y
            )

            ||

            (
                specialFood &&
                position.x === specialFood.x &&
                position.y === specialFood.y
            )

        );


        if (attempts < 100) {

            obstacles.push(position);

        }

    }

}


// ==========================
// DRAW
// ==========================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Background

    ctx.fillStyle = "#f5f5f5";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ==========================
    // FOOD
    // ==========================

    if (food) {

        ctx.fillStyle = "red";

        ctx.beginPath();

        ctx.arc(
            food.x * CELL + CELL / 2,
            food.y * CELL + CELL / 2,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // ==========================
    // COIN
    // ==========================

    if (coin) {

        ctx.fillStyle = "gold";

        ctx.beginPath();

        ctx.arc(
            coin.x * CELL + CELL / 2,
            coin.y * CELL + CELL / 2,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle = "orange";

        ctx.lineWidth = 2;

        ctx.stroke();

    }


    // ==========================
    // SPECIAL FOOD
    // ==========================

    if (specialFood) {

        var diamondX =
            specialFood.x * CELL + CELL / 2;

        var diamondY =
            specialFood.y * CELL + CELL / 2;


        ctx.fillStyle = "purple";

        ctx.beginPath();

        ctx.moveTo(
            diamondX,
            diamondY - 8
        );

        ctx.lineTo(
            diamondX + 8,
            diamondY
        );

        ctx.lineTo(
            diamondX,
            diamondY + 8
        );

        ctx.lineTo(
            diamondX - 8,
            diamondY
        );

        ctx.closePath();

        ctx.fill();


        ctx.strokeStyle = "violet";

        ctx.lineWidth = 2;

        ctx.stroke();

    }


    // ==========================
    // OBSTACLES
    // ==========================

    for (
        var i = 0;
        i < obstacles.length;
        i++
    ) {

        ctx.fillStyle = "black";

        ctx.fillRect(
            obstacles[i].x * CELL,
            obstacles[i].y * CELL,
            CELL,
            CELL
        );

    }


    // ==========================
    // SNAKE
    // ==========================

    for (
        var s = 0;
        s < snake.length;
        s++
    ) {

        var part = snake[s];


        if (s === 0) {

            ctx.fillStyle = "green";

        } else {

            ctx.fillStyle = "limegreen";

        }


        ctx.fillRect(
            part.x * CELL,
            part.y * CELL,
            CELL,
            CELL
        );


        ctx.strokeStyle = "darkgreen";

        ctx.lineWidth = 1;

        ctx.strokeRect(
            part.x * CELL,
            part.y * CELL,
            CELL,
            CELL
        );


        // ==========================
        // SNAKE EYES
        // ==========================

        if (s === 0) {

            ctx.fillStyle = "white";


            if (direction === "right") {

                ctx.fillRect(
                    part.x * CELL + 13,
                    part.y * CELL + 4,
                    4,
                    4
                );

                ctx.fillRect(
                    part.x * CELL + 13,
                    part.y * CELL + 12,
                    4,
                    4
                );

            }


            else if (direction === "left") {

                ctx.fillRect(
                    part.x * CELL + 3,
                    part.y * CELL + 4,
                    4,
                    4
                );

                ctx.fillRect(
                    part.x * CELL + 3,
                    part.y * CELL + 12,
                    4,
                    4
                );

            }


            else if (direction === "up") {

                ctx.fillRect(
                    part.x * CELL + 4,
                    part.y * CELL + 3,
                    4,
                    4
                );

                ctx.fillRect(
                    part.x * CELL + 12,
                    part.y * CELL + 3,
                    4,
                    4
                );

            }


            else {

                ctx.fillRect(
                    part.x * CELL + 4,
                    part.y * CELL + 13,
                    4,
                    4
                );

                ctx.fillRect(
                    part.x * CELL + 12,
                    part.y * CELL + 13,
                    4,
                    4
                );

            }

        }

    }

}


// ==========================
// MOVE SNAKE
// ==========================

function moveSnake() {

    if (
        gameOver ||
        paused ||
        countingDown
    ) {

        return;

    }


    direction = nextDirection;


    var head = {

        x: snake[0].x,
        y: snake[0].y

    };


    // ==========================
    // MOVE
    // ==========================

    if (direction === "right") {
        head.x++;
    }

    else if (direction === "left") {
        head.x--;
    }

    else if (direction === "up") {
        head.y--;
    }

    else if (direction === "down") {
        head.y++;
    }


    // ==========================
    // WALL WRAP
    // ==========================

    if (head.x > 18) {
        head.x = 1;
    }

    if (head.x < 1) {
        head.x = 18;
    }

    if (head.y > 18) {
        head.y = 1;
    }

    if (head.y < 1) {
        head.y = 18;
    }


    // ==========================
    // SELF COLLISION
    // ==========================

    for (
        var i = 0;
        i < snake.length;
        i++
    ) {

        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {

            endGame();

            return;

        }

    }


    // ==========================
    // OBSTACLE COLLISION
    // ==========================

    for (
        var o = 0;
        o < obstacles.length;
        o++
    ) {

        if (
            head.x === obstacles[o].x &&
            head.y === obstacles[o].y
        ) {

            endGame();

            return;

        }

    }


    // ==========================
    // ADD HEAD
    // ==========================

    snake.unshift(head);


    var ateSomething = false;


    // ==========================
    // NORMAL FOOD
    // ==========================

    if (
        food &&
        head.x === food.x &&
        head.y === food.y
    ) {

        score++;

        missionProgress++;

        ateSomething = true;


        playSound(yummySound);


        createFood();


        if (
            missionProgress >= missionTarget
        ) {

            missionProgress = 0;

            missionTarget += 10;

        }

    }


    // ==========================
    // COIN
    // ==========================

    if (
        coin &&
        head.x === coin.x &&
        head.y === coin.y
    ) {

        coins += 5;

        playSound(yummySound);

        createCoin();

    }


    // ==========================
    // SPECIAL FOOD
    // ==========================

    if (
        specialFood &&
        head.x === specialFood.x &&
        head.y === specialFood.y
    ) {

        score += 10;

        ateSomething = true;


        playSound(yummySound);


        clearTimeout(
            specialFoodLifeTimer
        );


        specialFood = null;


        startSpecialFoodTimer();

    }


    // ==========================
    // REMOVE TAIL
    // ==========================

    if (!ateSomething) {

        snake.pop();

    }


    // ==========================
    // LEVEL
    // ==========================

    var newLevel =
        Math.floor(score / 10) + 1;


    if (newLevel !== level) {

        level = newLevel;

        createObstacles();

    }


    // ==========================
    // HIGH SCORE
    // ==========================

    if (score > highScore) {

        highScore = score;


        localStorage.setItem(
            "stanguruHighScore",
            highScore
        );


        if (!achievedNewHighScore) {

            achievedNewHighScore = true;

            playSound(
                newHighScoreSound
            );

        }

    }


    updateDisplay();

    draw();

}


// ==========================
// GAME TIMER
// ==========================

function restartTimer() {

    clearInterval(gameTimer);


    var speed =
        Math.max(
            80,
            200 - ((level - 1) * 15)
        );


    gameTimer =
        setInterval(
            moveSnake,
            speed
        );

}


// ==========================
// COUNTDOWN
// ==========================

function startCountdown() {

    clearInterval(gameTimer);

    clearInterval(countdownTimer);


    countingDown = true;


    var count = 3;


    function showCountdown() {

        draw();


        ctx.fillStyle =
            "rgba(0,0,0,0.45)";


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle = "white";

        ctx.font =
            "bold 70px Arial";

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";


        if (count > 0) {

            ctx.fillText(
                count,
                canvas.width / 2,
                canvas.height / 2
            );


            count--;

        }

        else {

            ctx.fillText(
                "GO!",
                canvas.width / 2,
                canvas.height / 2
            );


            playSound(letsGoSound);


            countingDown = false;


            clearInterval(
                countdownTimer
            );


            countdownTimer = null;


            restartTimer();

            startSpecialFoodTimer();

        }

    }


    showCountdown();


    countdownTimer =
        setInterval(
            showCountdown,
            1000
        );

}


// ==========================
// UPDATE DISPLAY
// ==========================

function updateDisplay() {

    scoreText.textContent =
        score;


    highScoreText.textContent =
        highScore;


    coinsText.textContent =
        coins;


    levelText.textContent =
        level;


    missionText.textContent =
        "Eat " +
        missionTarget +
        " foods";


    missionProgressText.textContent =
        missionProgress +
        " / " +
        missionTarget;


    updateAchievements();

}


// ==========================
// ACHIEVEMENTS
// ==========================

function updateAchievements() {

    achievementList.innerHTML = "";


    var achievements = [];


    if (score >= 10) {

        achievements.push(
            "🍎 First 10 Points"
        );

    }


    if (coins >= 10) {

        achievements.push(
            "🪙 Coin Collector"
        );

    }


    if (level >= 5) {

        achievements.push(
            "🚀 Level 5"
        );

    }


    if (score >= 50) {

        achievements.push(
            "🏆 50 Points"
        );

    }


    for (
        var i = 0;
        i < achievements.length;
        i++
    ) {

        var li =
            document.createElement("li");


        li.textContent =
            achievements[i];


        achievementList.appendChild(li);

    }

}


// ==========================
// START GAME
// ==========================

function startGame() {

    clearInterval(gameTimer);

    clearInterval(countdownTimer);

    stopSpecialFoodTimer();

    stopAllSounds();


    score = 0;

    coins = 0;

    level = 1;

    missionProgress = 0;

    missionTarget = 10;


    direction = "right";

    nextDirection = "right";


    gameOver = false;

    paused = false;

    countingDown = false;


    achievedNewHighScore = false;


    createSnake();

    createFood();

    createCoin();

    createObstacles();


    startScreen.style.display =
        "none";


    gameScreen.style.display =
        "block";


    gameOverMenu.style.display =
        "none";


    updateDisplay();

    draw();

}


// ==========================
// RESTART GAME
// ==========================

function restartGame() {

    clearInterval(gameTimer);

    clearInterval(countdownTimer);

    stopSpecialFoodTimer();

    stopAllSounds();


    score = 0;

    coins = 0;

    level = 1;

    missionProgress = 0;

    missionTarget = 10;


    direction = "right";

    nextDirection = "right";


    gameOver = false;

    paused = false;

    countingDown = false;


    achievedNewHighScore = false;


    createSnake();

    createFood();

    createCoin();

    createObstacles();


    gameOverMenu.style.display =
        "none";


    gameScreen.style.display =
        "block";


    updateDisplay();

    draw();


    startCountdown();

}


// ==========================
// GAME OVER
// ==========================

function endGame() {

    if (gameOver) {

        return;

    }


    // ==========================
    // STOP GAME
    // ==========================

    gameOver = true;

    paused = false;

    countingDown = false;


    clearInterval(gameTimer);

    clearInterval(countdownTimer);


    gameTimer = null;

    countdownTimer = null;


    stopSpecialFoodTimer();


    // ==========================
    // STOP OTHER SOUNDS
    // ==========================

    try {

        letsGoSound.pause();
        letsGoSound.currentTime = 0;

        yummySound.pause();
        yummySound.currentTime = 0;

        newHighScoreSound.pause();
        newHighScoreSound.currentTime = 0;

    } catch (error) {

        console.log(error);

    }


    // ==========================
    // PLAY GAME OVER SOUND
    // ==========================

    if (soundOn) {

        try {

            gameOverSound.pause();

            gameOverSound.currentTime = 0;

            gameOverSound.play()
                .then(function() {

                    console.log(
                        "Game Over sound played"
                    );

                })
                .catch(function(error) {

                    console.log(
                        "Game Over sound blocked:",
                        error
                    );

                });

        } catch (error) {

            console.log(
                "Game Over sound error:",
                error
            );

        }

    }


    // ==========================
    // FINAL SCORE
    // ==========================

    finalScore.textContent =
        score;


    finalHighScore.textContent =
        highScore;


    // ==========================
    // HIGH SCORE MESSAGE
    // ==========================

    if (achievedNewHighScore) {

        highScoreMessage.textContent =
            "🏆 NEW HIGH SCORE! 🏆";

        highScoreMessage.style.display =
            "block";

    }

    else {

        highScoreMessage.textContent =
            "";

        highScoreMessage.style.display =
            "none";

    }


    // ==========================
    // HIDE GAME SCREEN
    // ==========================

    gameScreen.style.display =
        "none";


    // ==========================
    // SHOW GAME OVER SCREEN
    // ==========================

    gameOverMenu.style.display =
        "block";

}


// ==========================
// PLAY GAME BUTTON
// ==========================

document
    .getElementById("playGame")
    .addEventListener(
        "click",
        function() {

            startGame();

            startCountdown();

        }
    );


// ==========================
// START BUTTON
// ==========================

document
    .getElementById("start")
    .addEventListener(
        "click",
        function() {

            if (
                !gameOver &&
                !countingDown
            ) {

                startCountdown();

            }

        }
    );


// ==========================
// PAUSE BUTTON
// ==========================

document
    .getElementById("pause")
    .addEventListener(
        "click",
        function() {

            if (
                gameOver ||
                countingDown
            ) {

                return;

            }


            paused = !paused;


            if (paused) {

                clearInterval(
                    gameTimer
                );

            }

            else {

                restartTimer();

            }

        }
    );


// ==========================
// RESTART BUTTON
// ==========================

document
    .getElementById("restart")
    .addEventListener(
        "click",
        function() {

            restartGame();

        }
    );


// ==========================
// SOUND BUTTON
// ==========================

document
    .getElementById("sound")
    .addEventListener(
        "click",
        function() {

            soundOn = !soundOn;


            this.textContent =
                soundOn
                    ? "🔊 Sound"
                    : "🔇 Sound";

        }
    );


// ==========================
// CLEAR HIGH SCORE
// ==========================

document
    .getElementById("clearHighScore")
    .addEventListener(
        "click",
        function() {

            var answer =
                confirm(
                    "Clear high score?"
                );


            if (answer) {

                highScore = 0;


                localStorage.removeItem(
                    "stanguruHighScore"
                );


                updateDisplay();


                alert(
                    "High score cleared!"
                );

            }

        }
    );


// ==========================
// PLAY AGAIN
// ==========================

document
    .getElementById("playAgain")
    .addEventListener(
        "click",
        function() {

            restartGame();

        }
    );


// ==========================
// MAIN MENU
// ==========================

document
    .getElementById("mainMenu")
    .addEventListener(
        "click",
        function() {

            clearInterval(gameTimer);

            clearInterval(countdownTimer);

            stopSpecialFoodTimer();

            stopAllSounds();


            gameOver = false;


            gameOverMenu.style.display =
                "none";


            gameScreen.style.display =
                "none";


            startScreen.style.display =
                "block";

        }
    );


// ==========================
// KEYBOARD CONTROLS
// ==========================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowUp" &&
            direction !== "down"
        ) {

            nextDirection = "up";

        }

        else if (
            event.key === "ArrowDown" &&
            direction !== "up"
        ) {

            nextDirection = "down";

        }

        else if (
            event.key === "ArrowLeft" &&
            direction !== "right"
        ) {

            nextDirection = "left";

        }

        else if (
            event.key === "ArrowRight" &&
            direction !== "left"
        ) {

            nextDirection = "right";

        }

    }
);


// ==========================
// SWIPE CONTROLS
// ==========================

var touchStartX = 0;
var touchStartY = 0;


canvas.addEventListener(
    "touchstart",
    function(event) {

        var touch =
            event.touches[0];


        touchStartX =
            touch.clientX;


        touchStartY =
            touch.clientY;

    }
);


canvas.addEventListener(
    "touchend",
    function(event) {

        var touch =
            event.changedTouches[0];


        var dx =
            touch.clientX -
            touchStartX;


        var dy =
            touch.clientY -
            touchStartY;


        if (
            Math.abs(dx) >
            Math.abs(dy)
        ) {

            if (
                dx > 0 &&
                direction !== "left"
            ) {

                nextDirection =
                    "right";

            }

            else if (
                dx < 0 &&
                direction !== "right"
            ) {

                nextDirection =
                    "left";

            }

        }

        else {

            if (
                dy > 0 &&
                direction !== "up"
            ) {

                nextDirection =
                    "down";

            }

            else if (
                dy < 0 &&
                direction !== "down"
            ) {

                nextDirection =
                    "up";

            }

        }

    }
);


// ==========================
// INITIAL STATE
// ==========================

highScoreText.textContent =
    highScore;


gameScreen.style.display =
    "none";


gameOverMenu.style.display =
    "none";