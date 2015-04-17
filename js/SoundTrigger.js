(function (window) {
    'use strict';

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
    SoundTrigger.prototype.Container_initialize = SoundTrigger.prototype.initialize;

    SoundTrigger.prototype.initialize = function () {
        this.Container_initialize();
        this.platformBody = new createjs.Shape();
        this.addChild(this.platformBody);
        this.makeShape();
    };
    // public methods:
    SoundTrigger.prototype.makeShape = function () {
        //draw body
        var g = this.platformBody.graphics;
        var debug = true;
        if (debug) {
            g.setStrokeStyle(1);
            g.beginStroke("#d35400");
        }
        g.drawRect(0, 0, this.width, this.height);
    };
    window.SoundTrigger = SoundTrigger;
}(window));