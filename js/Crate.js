(function(window) {
	function Crate() {
  		this.initialize();
	}
	Crate.prototype = new createjs.Container();
	
	Crate.prototype.img = new Image();
	// constructor:
	Crate.prototype.Container_initialize = Crate.prototype.initialize;	//unique to avoid overiding base class
	
	Crate.prototype.initialize = function() {
		this.Container_initialize();
		var bmp = new createjs.Bitmap("img/crate.jpg");
		this.addChild(bmp);
	}
	window.Crate = Crate;
}(window));