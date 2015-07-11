var Node = require('famous/core/Node');
var Bubble = require('./Bubble');
var DOMElement = require('famous/dom-renderables/DOMElement');
var Position = require('famous/components/Position');
var Opacity = require('famous/components/Opacity');
var data = require('./data.json');

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

    this._el = new DOMElement(back)
        .setProperty('background', 'url(images/bg.png)')
        .setProperty('background-size', 'cover')
        .setProperty('-webkit-background-size', 'cover')
        .setProperty('-moz-background-size', 'cover')
        .setProperty('-o-background-size', 'cover');

    var size = Math.min(window.innerHeight, window.innerWidth);

    this._veil = new Node();
    this._vailEl = new DOMElement(this._veil).setProperty('background', 'black');
    this._veilOpacity = new Opacity(this._veil).set(0);
    new Position(this._veil).setZ(0);
    this.addChild(this._veil);


    this._container = this.addChild()
        .setSizeMode('absolute', 'absolute', 'absolute')
        .setAbsoluteSize(size, size)
        .setOrigin(0,0)
        .setMountPoint(0,.0)
        .setAlign(0.1, 0);

    new DOMElement(this._container)
        .setProperty('background', 'url(images/40.png)')
        .setProperty('background-size', 'cover')
        .setProperty('-webkit-background-size', 'cover')
        .setProperty('-moz-background-size', 'cover')
        .setProperty('-o-background-size', 'cover');


    for (var i in data.bubbles) {
        var bubble = data.bubbles[i];
        console.log('handling bubble ' + JSON.stringify(bubble));
        this._container.addChild(new Bubble('Name', bubble.x, bubble.y, bubble.size, {
            background: bubble.background,
            image: bubble.image,
            video: bubble.video
        }));
    }

}

Main.prototype = Object.create(Node.prototype);

Main.prototype.nodeMaximized = function nodeMaximized(node) {
    this._veilOpacity.set(.4, { duration: 500 });
    this._veil.show();
    this._container.emit('maximizedNode', { source: node });
};

Main.prototype.nodeMinimized = function nodeMinimized(node) {
    this._veilOpacity.set(0, { duration: 500 }, function() {
        this._veil.hide();
    }.bind(this));

    this._container.emit('minimizedNode', { source: node });
};


Main.prototype.onSizeChange = function onSizeChange(width, height) {
    console.log('sizeChange ' + width + ', ' + height);
    var size = Math.min(height, width);
    this._container.setAbsoluteSize(size, size).requestUpdateOnNextTick();
};

Main.prototype.onReceive = function onReceive(type, ev) {

};

module.exports = Main;