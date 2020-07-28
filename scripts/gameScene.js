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
        // stats
        this.maxPlayerBagLength = 3;
        //extra money
        this.extraMoney = 10; //чаевые
        //Price
        this.buyPrice = {
            beer: 100,
            tekila: 200,
        }

        //costGroup
        // this.costGroup = [
        //     {
        //         name: 'beer',
        //         priceCost: 100, 
        //         img: this.add.image()
        //     }
        // ]

        //texts
        this.noMoneyText = this.add.text(config.width * 0.3, config.height * 0.5, `У вас не хватает денег!`);
        this.noMoneyText.setVisible(false);

        this.noLengthInBagText = this.add.text(config.width * 0.3, config.height * 0.5, `У вас нет места в сумке`); 
        this.noLengthInBagText.setVisible(false);

        this.noBeerInYourBag = this.add.text(config.width * 0.3, config.height * 0.5, `У вас нет пива в сумке`);
        this.noBeerInYourBag.setVisible(false);


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
        this.player.bag = [];

        // table
        this.table = this.physics.add.sprite(config.width * 0.5, config.height * 0.9, 'table');
        this.table.setVisible(false);
        this.table.setInteractive(false);
        // this.table.setDepth(0.3);

        // beer
        this.beer = this.physics.add.sprite(config.width * 0.3, config.height * 0.3, 'beer');
        this.beer.setScale(1.3);

        // cost beer
        this.costBeer = this.physics.add.sprite(config.width * 0.8, config.height * 0.3, 'beer');
        this.costBeer.setTintFill(0xfff234);
        this.costBeer.setScale(1.3);
        
        // overlaps
        this.physics.add.overlap(this.player, this.beer, function(){
            this.getBeer(this.player, this.beer, this.buyPrice);
        }, null, this);

        this.physics.add.overlap(this.player, this.costBeer, function(){
            this.costBeerFun();
        }, null, this);

        // this.physics.add.overlap(this.player, this.table, function(){
        //     this.costBeer(this.player, this.table);
        // }, null, this);

    }

    update(){
        this.movePlayerManager();
        this.scoreText.setText(`Score = ${this.score}`);
    }

    costBeerFun(){
        if(this.player.bag.includes('beer')){
            console.log("Cool beer");
            this.score += this.buyPrice['beer'] + Math.floor(Math.random() * this.extraMoney);
            this.player.bag.pop("beer");
            this.beer.setActive(true);
            this.beer.setVisible(true);
            this.beer.hasOverlapped = false;
            this.costBeer.destroy();
        }
        else{
            this.noBeerInYourBag.setVisible(true);
            setTimeout(()=>{
                this.noBeerInYourBag.setVisible(false);
            }, 1400);
            return;
        }

    }

    // costBeer(player, table){
    //     if(!table.hasOverlapped && !player.hasOverlapped){
    //         table.hasOverlapped = true;
    //         if(this.beer.setVisible(false)){
    //             this.score += this.buyPrice['beer'] + Math.floor(Math.random() * this.extraMoney);
    //             this.beer.setVisible(true);
    //             this.beer.setActive(true);
    //             this.beer.hasOverlapped = false;
    //             // table.hasOverlapped = true;
    //             console.log('Вы продали пиво!');
    //             setTimeout(()=>{
    //                 table.hasOverlapped = false;
    //             }, 1000);
    //         }else{
    //             console.log("Возьми пиво");
    //         }
    //     }
    // }

    getBeer(){
        if(this.score > this.buyPrice['beer']){
            if(!this.beer.hasOverlapped && !this.player.hasOverlapped && this.player.bag.length < this.maxPlayerBagLength){
                this.player.bag.push('beer');
                this.score -= this.buyPrice['beer'];
                console.log( this.player.bag);
                this.beer.hasOverlapped = true;
                this.beer.setActive(false);
                this.beer.setVisible(false);
                console.log("Вы взяли пиво");
            }
        }else{
            if(this.player.bag.length < this.maxPlayerBagLength){
                this.noLengthInBagText.setVisible(true);
                setTimeout(()=>{
                    this.noLengthInBagText.setVisible(false);
                }, 1400);
            }else{
                this.noMoneyText.setVisible(true);
                setTimeout(()=>{
                    this.noMoneyText.setVisible(false);
                }, 1400);
            }
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