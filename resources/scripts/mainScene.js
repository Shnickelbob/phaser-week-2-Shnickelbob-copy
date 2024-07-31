class mainScene extends Phaser.Scene {
    constructor() {
        super({key:'mainScene'});
        this.paddle1;
        this.paddle2;
        this.ball;
        this.score1;
        this.score2;
        
        this.ball_launched;
        this.ball_velocity;
  
    }
    

    
     preload(){
        this.load.image('paddle','assets/images/paddle.png');
        this.load.image('ball','assets/images/ball.png');
        this.load.bitmapFont('font', 'assets/font/font.png','assets/font/font.xml');
        this.load.audio('hit1', ['assets/audio/hit1.ogg','assets/audio/hit1.wav']);
        this.load.audio('hit2', ['assets/audio/hit2.ogg','assets/audio/hit2.wav']);
    }

     create(){
        this.ball_launched = false;
        this.ball_velocity = 400;  
        this.score1 = 0;
        this.score2 = 0;

        this.paddle1 = this.create_paddle(0,game.config.height/2);
        this.paddle2 = this.create_paddle(game.config.width - 16,game.config.height/2);  
        this.ball = this.create_ball(game.config.width/2,game.config.height/2);

        this.input.on('pointerdown',this.launch_ball, this);

    /*
    score1_text = game.add.text(128,128,'0',{
        font: "64px Gabriella",
        fill: "#ffffff",
        align: "center"
    });
    score2_text = game.add.text(this.camera.main.width - 128,128,'0',{
        font: "64px Gabriella",
        fill: "#ffffff",
        align: "center"
    });
    */
    this.score1_text = this.add.bitmapText(128,128,'font','0',64);
    this.score2_text = this.add.bitmapText(game.config.width - 128,128,'font','0',64);
    }

     update(){
        this.score1_text.text = this.score1;
        this.score2_text.text = this.score2;
        this.control_paddle(this.paddle1, this.input.y);
        this.physics.world.collide(this.paddle1, this.ball, function(){
            game.sound.play('hit1');
        });
        this.physics.world.collide(this.paddle2, this.ball, function(){
            game.sound.play('hit2');
        });
        if(this.ball.body.blocked.left && this.ball.x - this.ball.width/2 <= 0){
            this.resetBall();
            this.score2+=1;
        } else if(this.ball.body.blocked.right && this.ball.x >= game.config.width - this.ball.width/2){
            this.resetBall();
            this.score1+=1;
        }

        this.paddle2.body.setVelocityY(this.ball.body.velocity.y);
        this.paddle2.body.setVelocityX = 0;
        this.paddle2.body.maxVelocity.y = 250;
        }
    

     create_paddle(x,y){
        var paddle = this.add.sprite(x,y,'paddle');
        paddle.setOrigin(0.5,0.5);
        this.physics.world.enable(paddle);
        paddle.body.collideWorldBounds = true;
        paddle.body.immovable = true;
        paddle.setScale(0.5,0.5);

        return paddle;
    }

     control_paddle(paddle,y){
        paddle.y = y;
        
        if(paddle.y < paddle.height / 2){
            paddle.y = paddle.height / 2;
        } else if (paddle.y > game.config.height - paddle.height / 2){
            paddle.y = game.config.height - paddle.height / 2;
        }
    }
     create_ball(x,y){
        var ball = this.add.sprite(x,y,'ball');
        ball.setOrigin(0.5,0.5);
        this.physics.world.enable(ball);
        ball.body.collideWorldBounds = true;
        ball.body.setBounce(1,1);

        return ball;
    }
     launch_ball(){
        if(this.ball_launched){
            this.ball.body.setVelocity(0,0);
            this.ball.x = game.config.width/2;
            this.ball.y = game.config.height/2;
            this.ball_launched = false;
        }else {
            this.ball.body.setVelocityX(-this.ball_velocity);
            this.ball.body.setVelocityY(this.ball_velocity);
            this.ball_launched = true;
        }
        
    }
    resetBall(){
        this.ball.body.setVelocity(0,0);
        this.ball.x = game.config.width/2;
        this.ball.y = game.config.height/2;

    }
}