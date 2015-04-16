(function(window) {
	function SoundTrigger(h, sound) {
		this.width = 50;
		this.height = h;
		this.sound = sound;
		this.disabled = false;
  		this.initialize();
	}
	SoundTrigger.prototype = new createjs.Container();
	SoundTrigger.prototype.platformBody = null;
	// constructor:
	SoundTrigger.prototype.Container_initialize = SoundTrigger.prototype.initialize;	//unique to avoid overiding base class

	SoundTrigger.prototype.initialize = function() {
		this.Container_initialize();
		this.platformBody = new createjs.Shape();
		this.addChild(this.platformBody);
		this.makeShape();	
	};
	// public methods:
	SoundTrigger.prototype.makeShape = function() {
		//draw body
		var g = this.platformBody.graphics;
		var debug = false;
		if (debug) {
			g.setStrokeStyle(1);
			g.beginStroke("#d35400");
		}
		g.drawRect(0,0,this.width,this.height);
	};
	window.SoundTrigger = SoundTrigger;
}(window));