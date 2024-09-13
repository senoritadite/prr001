let board;
let boardWidth = 1000; 
let boardHeight = 300;
let context;
let playerWidth = 85;
let playerHeight = 85;
let playerX = 50;
let playerY = 215;
let playerImg;
let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
};
let gameOver = false;
let score = 0;
let time = 0;
let life = 3;

let boxImg;
let boxWidth = 40;
let boxHeight = 80;
let boxX = 1000;
let boxY = 215;

let box1Img = new Image();

let box2Img = new Image();

let box3Img = new Image()
box1Img.src = "box1_image.png";
box2Img.src = "box2_image.png";
box3Img.src = "box3_image.png";

let boxesArray = [];
let boxSpeed = -8; 

let VelocityY = 0;
let Gravity = 0.25;

let Retry = document.getElementById("RetryMessage");
let RetryDelay = false

let lifeIMG = new Image();
lifeIMG.src = "life.png";
let lifeWidth = 40;
let lifeHeight = 40;

console.log(player);
window.onload = function () {
    
    board = document.getElementById("Board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    
    playerImg = new Image();
    playerImg.src = "player_image.png"; 
    playerImg.onload = function () {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    };

    
    requestAnimationFrame(update);

    document.addEventListener("keydown", movePlayer);

    boxImg = new Image();
    boxImg.src = "box3_image.png";
    
    createBoxWithRandomInterval();
};


function createBoxWithRandomInterval() {
    setTimeout("", 2);
    if (gameOver) {
        return;
    }

    createBox(); 

    
    let randomTime = rnd(1000, 2500); 

    setTimeout(createBoxWithRandomInterval, randomTime);
}

function rnd(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);
    VelocityY += Gravity;

    player.y = Math.min(player.y + VelocityY, playerY);
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    for (let index = 0; index < boxesArray.length; index++) {
        let box = boxesArray[index];
        box.x += boxSpeed;
        context.drawImage(box.img, box.x, box.y, box.width, box.height);

        if (onCollision(player, box)) {
            gameOver = true;
            life -= 1;

            context.font = "normal bold 40px Arial"; 
            context.textAlign = "center";
            context.fillText("GameOver!", boardWidth / 2, boardHeight / 2);
            context.fillText("Your Score : "+score,boardWidth/2 ,(boardHeight/2)+50);


            setTimeout(() => {
                Retry.style.display = "block";
            }, 500);
        }
    }
    for (let i = 0; i < life; i++) {
        
        context.drawImage(lifeIMG, 20 + (lifeWidth + 10) * i, 50, lifeWidth, lifeHeight);
    }

    score++;
    time += 0.01;
    context.font = "normal bold 40px Arial";
    context.textAlign = "left";
    context.fillText("Score : " + score, 700, 30);
    context.fillText("Time : " + time.toFixed(0), 20, 40);
    if (time == 60) {
        gameOver = true;
        context.font = "normal bold 40px Arial";
        context.textAlign = "center";
        context.fillText("You Won! With Score :" + score, boardWidth / 2, boardHeight / 2);
        
    }
    
}

function movePlayer(e) {

    if (e.code == "Space" && gameOver &&life > 0) {
        Retry.innerHTML = "Wait..."
        setTimeout(() => {
            gameReset()
            Retry.innerHTML = "Press Space To Try Again"
        }, 1000);
    }

    if (gameOver) {
        return;
    }

    if (e.code === "Space" && player.y === playerY) {
        VelocityY = -10;
    }

}

function createBox(e) {
    if (gameOver) {
        return;
    }
    let randomType = rnd(1, 3); 
    let boxImg,boxWidth, boxHeight, boxSpeed , boxY ,boxX = 1300;

    if (randomType === 1) {
        boxImg = box1Img;
        boxWidth = 80;
        boxHeight = 80;
        boxSpeed = -5; 
        boxY = 215;
    } else if (randomType === 2) {
        boxImg = box2Img;
        boxWidth = 80; 
        boxHeight = 80;
        boxSpeed = -5; 
        boxY = 215;
    } else {
        boxImg = box3Img;
        boxWidth = 80; 
        boxHeight = 150;
        boxSpeed = -5; 
        boxY = 175;
    }


    let box = {
        img: boxImg,
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight,
        Speed: boxSpeed
    };

    boxesArray.push(box);

    if (boxesArray.length > 5) {
        boxesArray.shift();
    }
}
function onCollision(obj1, obj2) {
    return obj1.x < (obj2.x + obj2.width) && (obj1.x + obj1.width) > obj2.x 
        && obj1.y < (obj2.y + obj2.height) && (obj1.y + obj1.height) > obj2.y; 
}

function gameReset() {
    if (gameOver) {
        return;
    }

    
    if (life > 0) {
        setTimeout(() => {
            gameOver = false;
            Retry.style.display = "block"; 
            score = 0;
            time = 0;
            boxesArray = [];
            VelocityY = 0; 
            player.y = playerY; 

            createBoxWithRandomInterval(); 
        }, 500);
        
    }
}
