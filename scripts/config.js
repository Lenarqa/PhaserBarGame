var config = {
    width: 500,
    height: 300,
    scene: [gameScene],
    parent: 'gameScene',
    physics: {
        default: "arcade",
    },
    audio: {
        disableWebAudio: true
    }
}
window.onload = function(){
    var game = new Phaser.Game(config);
}