var Node = require('famous/core/Node');
var DOMElement = require('famous/dom-renderables/DOMElement');
var Position = require('famous/components/Position');
var Scale = require('famous/components/Scale');
var Transform = require("famous/core/Transform");
var Align = require('famous/components/Align');
var Size = require('famous/components/Size');
var Opacity = require('famous/components/Opacity');

function Bubble(text, x, y, propSize, props) {
    Node.call(this);
    x += .05;
    y += .05;
    this.x = x;
    this.y = y;

    this.propSize = propSize;
    this.background = 'orange';

    this.image = 'images/gorilla-animated.gif';
    this.video = '';
    if (props) {
        if (props.image) {
            this.image = props.image;
        }
        if (props.background) {
            this.background = props.background;
        }
        if (props.video) {
            this.video = props.video;
        }
    }

    this.z = 20;
    this._el = new DOMElement(this)
        .setProperty('background', 'url(images/bubble.png)')
        .setProperty('background-size', 'cover')
        .setProperty('-webkit-background-size', 'cover')
        .setProperty('-moz-background-size', 'cover')
        .setProperty('-o-background-size', 'cover')
        //.setProperty('border-radius', '50%')
        .setProperty('cursor', 'pointer');

    this._icon = this.addChild()
        .setOrigin(.5,.5)
        .setMountPoint(.5,.5)
        .setAlign(.5,.5)
        .setProportionalSize(.95,.95);

    this._iconEl = new DOMElement(this._icon)
        .setProperty('background', 'url(' + this.image + ')')
        .setProperty('background-size', 'cover')
        .setProperty('-webkit-background-size', 'cover')
        .setProperty('-moz-background-size', 'cover')
        .setProperty('-o-background-size', 'cover')
        .setProperty('border-radius', '50%')
        .setProperty('cursor', 'pointer');


    new Position(this._icon).setZ(this.z + 1);

    //if (props) {
    //    this.titleEl.setProperty('background', props.background);
    //}
    this
        .setSizeMode('default', 'default', 'absolute')
        .setProportionalSize(this.propSize,this.propSize,.1)
        .setOrigin(.5, .5)
        .setMountPoint(.5,.5)
        .setAlign(x, y)
        .setOpacity(0);

    this.iconOpacity = new Opacity(this._icon);
    this.iconOpacity.set(1);

    this.scale = new Scale(this);
    this.align = new Align(this);
    this.opacity = new Opacity(this);
    this.opacity.set(0);
    this.scale.set(.5,.5);
    setTimeout(function() {
        this.scale.set(1, 1, 1, {duration: 250});
        this.opacity.set(1, { duration: 250 });
    }.bind(this), Math.random() * 800);


    this.setDifferentialSize(-5, -5);
    this.position = new Position(this);
    this.position.setZ(this.z);
    this.size = new Size(this);

    this.addUIEvent('mouseenter');
    this.addUIEvent('mouseleave');
    this.addUIEvent('mousedown');

}

Bubble.prototype = Object.create(Node.prototype);

/**
 * Called when the mouse enters a bubble. increases the size of the bubble.
 */
Bubble.prototype.mouseEnter = function mouseEnter() {
    if (this.maximized) {
        return;
    }
    this.scale.halt();
    this.scale.set(1.5, 1.5, 1, { duration: 1000, curve: 'outBounce'});
    this.position.setZ(this.z + 50);
};

Bubble.prototype.mouseLeave = function mouseLeave() {
    if (this.maximized) {
        return;
    }
    this.scale.halt();
    this.position.setZ(this.z);
    this.scale.set(1, 1, 1, { duration: 1000, curve: 'easeOut' }, function() {
    }.bind(this));
};

Bubble.prototype.maximize = function maximize() {
    var squareSize = Math.min(window.innerWidth, window.innerHeight);
    var videoWidth = squareSize / 1.35;
    var videoHeight = videoWidth * 9 / 16;
    this.maximized = true;
    this.getParent().getParent().nodeMaximized(this);
    this.align.halt();
    this.size.halt();
    this.scale.set(1, 1, 1);
    this.position.setZ(2000);
    var width = window.innerWidth;
    var height = window.innerWidth;

    this.align.set(0.5, 0.5, 1, {duration: 200});
    this.iconOpacity.set(0, { duration: 250 });
    this.size.setProportional(1, 1,.1, {duration: 350, curve: 'easeOut'}, function(){
        this.youtube = this.addChild()
            .setOrigin(0.5, 0.5)
            .setAlign(0.5, 0.5, 0.95)
            .setSizeMode('absolute', 'absolute', 'absolute')
            .setOpacity(0)
            .setMountPoint(0.5, 0.5)
            .setAbsoluteSize(videoWidth, videoHeight, 1);
        this.youtubeEl = new DOMElement(this.youtube)
            .setProperty('background-size', 'cover')
            .setProperty('-webkit-background-size', 'cover')
            .setProperty('-moz-background-size', 'cover')
            .setProperty('-o-background-size', 'cover');
        var youtubeOpacity = new Opacity(this.youtube);
        var youtubeAlign = new Align(this.youtube);
        youtubeOpacity.set(0);

        this.movie = this.youtube.addChild()
            .setOrigin(0.5, 0.5)
            .setAlign(0.5, 0.5, 0.95)
            .setSizeMode('absolute', 'absolute', 'absolute')
            .setOpacity(0)
            .setMountPoint(0.5, 0.5)
            .setAbsoluteSize(videoWidth, videoHeight, 1);
        var movieOpacity = new Opacity(this.movie);
        movieOpacity.set(0);
        this.movieEl = new DOMElement(this.movie);
        this.movieEl
            .setContent('<iframe width="' + videoWidth  + '" height="' + videoHeight  + '" src="https://www.youtube.com/embed/' + this.video + '?rel=0&autoplay=1&amp;controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>');
        new Position(this.movie).setZ(300);
        this.position.setZ(this.z + 2000);

        youtubeOpacity.set(1, { duration: 150 }, function() {
            setTimeout(function() {
                movieOpacity.set(1, { duration: 300 });
            }.bind(this), 500);
        }.bind(this));
    }.bind(this));
};

Bubble.prototype.minimize = function minimize() {
    this.maximized = false;

    this.size.halt();
    this.align.halt();
    if (this.youtube) {
        this.movieEl.setContent('');
        this.removeChild(this.youtube);
        this.youtube = null;
    }
    this.align.set(this.x, this.y, 1, { duration: 200 });

    this.size.setProportional(this.propSize,this.propSize,.1, { duration: 400, curve: 'easeOut'}, function() {
        this.position.setZ(this.z);
        this.iconOpacity.set(1, { duration: 200 });
        this.getParent().getParent().nodeMinimized(this);
    }.bind(this));
};

Bubble.prototype.onReceive = function onReceive (type, ev) {
    if (type === 'maximizedNode') {
        if (ev.source !== this) {
            this.scale.set(0.5, 0.5, 0, { duration: 250 });
            this.opacity.set(0, { duration: 350 });
        }
    } else if (type == 'minimizedNode') {
        if (ev.source !== this) {
            this.scale.set(1, 1, 1, { duration: 150 });
            this.opacity.set(1, { duration: 350 });
        }
    } else if (type === 'mouseenter') {
        this.mouseEnter();
    } else if (type === 'mouseleave') {
        this.mouseLeave();
    } else if (type === 'mousedown') {
        if (! this.maximized) {
            this.maximize();
        } else {
            this.minimize();
        }
    }
};




module.exports = Bubble;
