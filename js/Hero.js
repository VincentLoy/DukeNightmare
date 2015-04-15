(function (window) {
	'use strict';

	function Hero(imgHero) { this.initialize(imgHero); }

	var spriteSheet,
		heroWidth = 59,
		heroHeight = 80,
		heroRegX = heroWidth / 2,
		heroRegY = heroHeight;

	Hero.prototype = new createjs.Sprite();
// constructors:
	Hero.prototype.Sprite_initialize = Hero.prototype.initialize;	//unique to avoid overiding base class
// public methods:
	Hero.prototype.initialize = function(imgHero) {
		spriteSheet  = new createjs.SpriteSheet({
			images: [imgHero],
			frames: {width: heroWidth, height: heroHeight, regX: heroRegX, regY: heroRegY},
			animations: {
				walk: [2, 15, "walk"],
				idle: [0, 0, "idle"],
				looking: [1, 1, "looking"],
				jump: [19, 19,"jump"]
			}
		});
		this.constructor(spriteSheet);

		this.gotoAndStop("idle");
	};

	window.Hero=Hero;

}(window));
