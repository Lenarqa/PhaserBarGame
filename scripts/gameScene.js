class gameScene extends Phaser.Scene {
    constructor(){
        super("gameScene");
    }

    preload(){
        this.load.image('player', 'assets/img/worker.png');
        this.load.image('table',  'assets/img/table.png');
        this.load.image('beer', 'assets/img/beer.png');
    }

    create(){
        //extra money
        this.extraMoney = 10; //чаевые
        //Price
        this.buyPrice = {
            beer: 100,
            tekila: 200,
        }

        //texts
        this.noMoneyText = this.add.text(config.width * 0.3, config.height * 0.5, `У вас не хватает денег!`);
        this.noMoneyText.setVisible(false);

        // Score 
        this.score = 1000;
        this.scoreText = this.add.text(config.width * 0.02, config.height * 0.05, `Score = ${this.score}`);
        // cursorKey
        this.cursorKey = this.input.keyboard.createCursorKeys();

        // change bg color
        this.cameras.main.setBackgroundColor(0xbababa);

        // player
        this.player = this.physics.add.sprite(config.width * 0.5, config.height * 0.1, 'player');
        this.player.setCollideWorldBounds();
        this.player.setScale(1.3);
        this.player.speed = 100;

        // table
        this.table = this.physics.add.sprite(config.width * 0.5, config.height * 0.9, 'table');
        // this.table.setDepth(0.3);

        // beer
        this.beer = this.physics.add.sprite(config.width * 0.1, config.height * 0.3, 'beer');
        this.beer.setScale(1.3);

        // overlaps
        this.physics.add.overlap(this.player, this.beer, function(){
            this.getBeer(this.player, this.beer, this.buyPrice);
        }, null, this);

        this.physics.add.overlap(this.player, this.table, function(){
            this.costBeer(this.player, this.table);
        }, null, this)

    }

    update(){
        this.movePlayerManager();
        this.scoreText.setText(`Score = ${this.score}`);
    }


    costBeer(player, table){
        if(!table.hasOverlapped && !player.hasOverlapped){
            table.hasOverlapped = true;
            if(this.beer.setVisible(false)){
                this.score += this.buyPrice['beer'] + Math.floor(Math.random() * this.extraMoney);
                this.beer.setVisible(true);
                this.beer.setActive(true);
                this.beer.hasOverlapped = false;
                table.hasOverlapped = true;
                console.log('Вы продали пиво!');
                setTimeout(()=>{
                    table.hasOverlapped = false;
                }, 1000);
            }else{
                console.log("Возьми пиво");
            }
        }
    }

    getBeer(player, beer){
        if(this.score > this.buyPrice['beer']){
            if(!beer.hasOverlapped && !player.hasOverlapped){
                this.score -= this.buyPrice['beer'];
                beer.hasOverlapped = true;
                beer.setActive(false);
                beer.setVisible(false);
                console.log("Вы взяли пиво");
            }
        }else{
            this.noMoneyText.setVisible(true);
            setTimeout(()=>{
                this.noMoneyText.setVisible(false);
            }, 1400);
        }
       
    }

    movePlayerManager(){
        if(this.cursorKey.left.isDown){
            this.player.setVelocityX(-this.player.speed);
        }else if(this.cursorKey.right.isDown){
            this.player.setVelocityX(this.player.speed);
        }else{
            this.player.setVelocityX(0);
        }

        if(this.cursorKey.up.isDown){
            this.player.setVelocityY(-this.player.speed);
        }else if(this.cursorKey.down.isDown){
            this.player.setVelocityY(this.player.speed);
        }else{
            this.player.setVelocityY(0);
        }
    }
}