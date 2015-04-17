(function (window) {
    'use strict';
    function Coin(imgCoin) { this.initialize(imgCoin); }

    var spriteSheet,
        coinWidth = 32,
        coinHeight = 32,
        coinRegX = coinWidth / 2,
        coinRegY = coinHeight;

    Coin.prototype = new createjs.Sprite();
    // constructors:
    Coin.prototype.Sprite_initialize = Coin.prototype.initialize;
    // public methods:
    Coin.prototype.initialize = function (imgCoin) {
        spriteSheet  = new createjs.SpriteSheet({
            images: [imgCoin],
            frames: {width: coinWidth, height: coinHeight, regX: coinRegX, regY: coinRegY},
            animations: {
                fadeout: [0, 7, "rotate"],
            }
        });
        this.constructor(spriteSheet);

        this.gotoAndStop("fadeout");
    };

    window.Coin = Coin;

}(window));
