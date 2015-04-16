(function (window) {
    'use strict';
    function Princess(imgPrincess) { this.initialize(imgPrincess); }

    var spriteSheet,
        princessWidth = 59,
        princessHeight = 80,
        princessRegX = princessWidth / 2,
        princessRegY = princessHeight;

    Princess.prototype = new createjs.Sprite();
    // constructors:
    Princess.prototype.Sprite_initialize = Princess.prototype.initialize;
    // public methods:
    Princess.prototype.initialize = function (imgPrincess) {
        spriteSheet  = new createjs.SpriteSheet({
            images: [imgPrincess],
            frames: {width: princessWidth, height: princessHeight, regX: princessRegX, regY: princessRegY},
            animations: {
                fadeout: [1, 10, "fadeout"],
                idle: [0, 0, "idle"]
            }
        });
        this.constructor(spriteSheet);

        this.gotoAndStop("fadeout");
    };

    window.Princess = Princess;

}(window));
