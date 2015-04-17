(function (window) {
    'use strict';
    function Coin(imgCoin) { this.initialize(imgCoin); this.width = 32;
        this.height = 32; }

    var spriteSheet,
        coinWidth = 32,
        coinHeight = 32;

    Coin.prototype = new createjs.Sprite();
    // constructors:
    Coin.prototype.Sprite_initialize = Coin.prototype.initialize;
    // public methods:
    Coin.prototype.initialize = function (imgCoin) {
        spriteSheet  = new createjs.SpriteSheet({
            images: [imgCoin],
            frames: {width: coinWidth, height: coinHeight},
            animations: {
                fadeout: [0, 7, "rotate"],
            }
        });
        this.constructor(spriteSheet);

        this.gotoAndStop("fadeout");
    };

    window.Coin = Coin;

}(window));
