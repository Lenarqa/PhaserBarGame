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
        this.newBeer = [];

        //orders
        this.orders = 0;
        // stats
        this.maxPlayerBagLength = 3;
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

         // beer
         this.beer = this.physics.add.sprite(config.width * 0.3, config.height * 0.3, 'beer');
         this.beer.setScale(1.3);

        // overlaps
        this.physics.add.overlap(this.player, this.beer, function(){
            this.getBeer(this.player, this.beer, this.buyPrice);
        }, null, this);

        this.physics.add.overlap(this.player, this.newBeer, function(){
            this.costBeerFun();
        }, null, this);
    }

    update(){
        this.movePlayerManager();
        this.scoreText.setText(`Score = ${this.score}`);

        if(this.orders == 0){
            this.createOrder();
        }
    }

    createOrder(){
        // let colOrder = Math.floor(Math.random() * 4);
        let colOrder = 2;
        console.log('colOrder = ' +  colOrder);
        switch(colOrder){
            case 1: 
                this.orders = 1;
                this.newBeer.push(this.createBeer(0.8, 0.3));
                break;
            case 2: 
                this.orders = 2;
                this.newBeer.push(this.createBeer(0.8, 0.3));
                this.newBeer.push(this.createBeer(0.8, 0.6));
                break;
            case 3: 
                this.orders = 3;
                this.createBeer(0.8, 0.3);
                this.createBeer(0.8, 0.6);
                this.createBeer(0.8, 0.9);
                break;
        }
    }

    createBeer(x, y){
        this.costBeer = this.physics.add.sprite(config.width * x, config.height * y, 'beer');
        this.costBeer.setTintFill(0xfff234);
        this.costBeer.setScale(1.3);
        return this.costBeer;
    }

    costBeerFun(){
        if(this.player.bag.includes('beer')){
            console.log("Cool beer");
            this.score += this.buyPrice['beer'] + Math.floor(Math.random() * this.extraMoney);
            this.player.bag.pop("beer");
            this.beer.setActive(true);
            this.beer.setVisible(true);
            this.beer.hasOverlapped = false;
            this.newBeer.pop();
            this.orders -= 1;
            console.log(this.newBeer.length + " newBeer")
        }
        else{
            this.noBeerInYourBag.setVisible(true);
            setTimeout(()=>{
                this.noBeerInYourBag.setVisible(false);
            }, 1400);
            return;
        }

    }

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