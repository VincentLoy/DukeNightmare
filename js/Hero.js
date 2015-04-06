(function (window) {
	'use strict';

	function Hero(imgHero) { this.initialize(imgHero); }

	var spriteSheet,
		heroWidth = 65,
		heroHeight = 75,
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
				walk: [0, 26, "walk"],
				idle: [21, 21, "idle"],
				looking: [1, 1, "looking"],
				jump: [26, 26,"jump"]
			}
		});
		this.constructor(spriteSheet);

		this.gotoAndStop("idle");
	};

	window.Hero=Hero;

}(window));
