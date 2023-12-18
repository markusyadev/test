function setup() {
    createCanvas(400, 400);
}

function draw() {
    background('skyblue');

    Game.checkPowerUps()

    for (let balloon of Game.balloons) {
        balloon.draw();
        balloon.move(Game.score);


        if (balloon.y <= balloon.size / 2 && balloon.color != 'black' && balloon.color != 'gold') {
            noLoop();
            Game.balloons.length = 0;
            let finalScore = Game.score;
            Game.score = '';
            background(136, 220, 166);
            textSize(64);
            fill('white');
            textAlign(CENTER, CENTER);
            text('FINISH', 200, 200);
            textSize(34);
            text('Score: ' + finalScore, 200, 300);


        }
    }

    textSize(32);
    fill('black');
    text(Game.score, 20, 40);

    if (frameCount % 50 == 0) {
        Game.addCommonBalloon();
    }
    if (frameCount % 70 == 0) {
        Game.addUniqeBalloon();
    }
    if (frameCount % 90 == 0) {
        Game.addAngryBalloon();
    }
    if (frameCount % 500 == 0) {
        Game.addPowerUpBalloon();
    }

}

class Game {
    static balloons = [];
    static score = 0;
    static scoreMultiplier = 1;
    static countOfGreen = 0;
    static countOfBlue = 0;
    static countOfBlack = 0;
    static countOfGold = 0;
    static countMousePressed = 0;


    static addCommonBalloon() {
        let balloon = new CommonBalloon(50, 'blue');
        this.balloons.push(balloon);
    }

    static addUniqeBalloon() {
        let balloon = new UniqeBalloon(30, 'green');
        this.balloons.push(balloon);
    }

    static addAngryBalloon() {
        let balloon = new AngryBalloon(50, 'black');
        this.balloons.push(balloon);
    }

    static addPowerUpBalloon() {
        let balloon = new PowerUpBalloon(50, 'gold');
        this.balloons.push(balloon);
    }

    
    static checkPowerUps() { // New method in Game class
        if (this.powerUpActive && frameCount - this.powerUpTime > 600) { // 600 frames = 10 seconds at 60fps
            this.powerUpActive = false;
            this.scoreMultiplier = 1; // Reset the score multiplier after 10 seconds
        }
    }



    static checkIfBalloonBurst() {
        Game.balloons.forEach((balloon, index) => {
            let distance = dist(balloon.x, balloon.y, mouseX, mouseY);
            if (distance <= balloon.size / 2) {
                balloon.burst(index);
            }
        });
    }
    static addScore(points) {
        this.score += points * this.scoreMultiplier
    }

    static sendStats(){
        let obj = {
            countOfBlue:this.countOfBlue,
            countMousepressed:this.countMousePressed,
            countOfGold:this.countOfGold,
            countOfGreen:this.countOfGreen,
            countOfBlack:this.countOfBlack,
        }

        fetch('/stats'),
        {
            method: "POST",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(obj)

        }
    }

}

function mousePressed() {
   if (isLooping() == false){
    Game.score = 0;
    Game.scoreMultiplier = 1;
    loop()
   }
    Game.checkIfBalloonBurst();
    Game.countMousePressed +=1

}

let interval = setInterval(() => {
    Game.sendStats()
    
}, 5000);

class CommonBalloon {
    constructor(size, color) {
        this.x = random(width);
        this.y = random(height + 5, height - 5);
        this.size = size;
        this.color = color;
        this.wiggleSpeed = 0.02;
        this.wiggleOffset = random(TWO_PI)
        this.xDirection = 1;
    }

    draw() {
        fill(this.color);
        ellipse(this.x, this.y, this.size);
        line(this.x, this.y + this.size / 2, this.x, this.y + this.size * 2);
    }

    move() {
        this.y -= 1;
        const wiggleAmplitude = 1; 
        const wiggleX = wiggleAmplitude * sin(this.wiggleOffset);

        this.x += this.xDirection * wiggleX;

        
        this.wiggleOffset += this.wiggleSpeed;

        // Reverse
        if (this.x <= 0 || this.x >= width) {
            this.xDirection *= -1;
        }

    }

    burst(index) {
        Game.balloons.splice(index, 1);
        Game.addScore(1);
        Game.countOfBlue +=1
    }
}

class UniqeBalloon extends CommonBalloon {
    constructor(size, color) {
        super(size, color);
    }

    burst(index) {
        Game.balloons.splice(index, 1);
        Game.addScore(10);
        Game.countOfGreen +=1
    }
}

class AngryBalloon extends CommonBalloon {
    constructor(size, color) {
        super(size, color);
    }

    burst(index) {
        Game.balloons.splice(index, 1);
        Game.score -= 10;
        Game.countOfBlack +=1;
    }
}

class PowerUpBalloon extends CommonBalloon {
    constructor(size, color) {
        super(size, color);
        this.powerUpActive = false;
        this.powerUpTime = 0;
    }

    burst(index) {
        Game.balloons.splice(index, 1);
        Game.powerUpActive = true;
        Game.powerUpTime = frameCount;
        Game.scoreMultiplier = 2;
        Game.countOfGold +=1;
    }



    draw() {
        fill(this.color);
        ellipse(this.x, this.y, this.size);
        line(this.x, this.y + this.size / 2, this.x, this.y + this.size * 2);

        
        fill('white');
        textSize(this.size / 2);
        textAlign(CENTER, CENTER);
        text('2x', this.x, this.y);
    }
}
