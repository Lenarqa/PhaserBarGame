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
            this.getBeer(this.player, this.beer);
        }, null, this);

        this.physics.add.overlap(this.player, this.table, function(){
            this.costBeer(this.player, this.table);
        }, null, this)

    }

    update(){
        this.movePlayerManager();
    }


    costBeer(player, table){

        if(!table.hasOverlapped && !player.hasOverlapped){
            table.hasOverlapped = true;
            if(this.beer.setVisible(false)){
                this.beer.setVisible(true);
                this.beer.setActive(true);
                this.beer.hasOverlapped = false;
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
        if(!beer.hasOverlapped && !player.hasOverlapped){
            beer.hasOverlapped = true;
            beer.setActive(false);
            beer.setVisible(false);
            console.log("Вы взяли пиво");
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