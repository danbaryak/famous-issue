var Node = require('famous/core/Node');
var Bubble = require('./Bubble');
var DOMElement = require('famous/dom-renderables/DOMElement');
var Position = require('famous/components/Position');

function Main() {
    Node.call(this);
    //this.setSizeMode('default', 'default');
    //this.setAbsoluteSize(null, null);
    //this.setSizeMode('default', 'default', 'default')
    //    .setAbsoluteSize(250, 250)
    //    // Center the 'node' to the parent (the screen, in this instance)
    //    .setAlign(0.5, 0.5)
    //    // Set the translational origin to the center of the 'node'
    //    .setMountPoint(0.5, 0.5)
    //    // Set the rotational origin to the center of the 'node'
    //    .setOrigin(0.5, 0.5);
    //
    //this.setAlign(0.5, 0.5, 0)
    //    .setMountPoint(0.5, 0.5, 0);



    var comp = this.addChild();


    var back = this.addChild();
    back.setSizeMode('default', 'default', 'absolute');
    new Position(back).setZ(0);
    back.setAbsoluteSize(null, null, 1);
    this._el = new DOMElement(back)
        .setProperty('background', 'url(images/back.jpg)')
        .setProperty('background-size', 'cover')
        .setProperty('-webkit-background-size', 'cover')
        .setProperty('-moz-background-size', 'cover')
        .setProperty('-o-background-size', 'cover');

    var size = Math.min(window.innerHeight, window.innerWidth);

    this._container = this.addChild()
        .setSizeMode('absolute', 'absolute', 'absolute')
        .setAbsoluteSize(size, size)
        .setOrigin(.5,.5)
        .setMountPoint(.5,.5)
        .setAlign(.5,.5);

    new DOMElement(this._container)
        .setProperty('background', 'url(images/40.png)')
        .setProperty('background-size', 'cover')
        .setProperty('-webkit-background-size', 'cover')
        .setProperty('-moz-background-size', 'cover')
        .setProperty('-o-background-size', 'cover');

    this._container.addChild(new Bubble('First',0, 0, 0.08,{ background: 'lightgreen' , image: 'images/duck.gif'}));
    this._container.addChild(new Bubble('First',0, 0.1, 0.08, { background: 'red' }));
    this._container.addChild(new Bubble('First',0, 0.2, 0.07, { background: 'orange', image: 'images/doggy.gif'}));
    this._container.addChild(new Bubble('First',0, 0.3, 0.05, { background: 'yellow' }));
    this._container.addChild(new Bubble('First',0.38, 0.40, 0.1, { background: 'purple' }));
    this._container.addChild(new Bubble('First',.1, .1, 0.1, { background: 'yellow' }));
    this._container.addChild(new Bubble('Second',.2, .1, 0.1, { background: 'green' }));
    this._container.addChild(new Bubble('Second',.2, .2, 0.1, { background: 'violet' }));
    this._container.addChild(new Bubble('Second',.1, .2, 0.025, { background: 'cyan' }));


}

Main.prototype = Object.create(Node.prototype);

Main.prototype.onSizeChange = function onSizeChange(width, height) {
    console.log('sizeChange ' + width + ', ' + height);
    var size = Math.min(height, width);
    this._container.setAbsoluteSize(size, size).requestUpdateOnNextTick();
};

Main.prototype.onReceive = function onReceive(type, ev) {

};

module.exports = Main;