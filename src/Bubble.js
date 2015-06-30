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
    if (props) {
        if (props.image) {
            this.image = props.image;
        }
        if (props.background) {
            this.background = props.background;
        }
    }

    this.z = 20;
    this._el = new DOMElement(this)
        .setProperty('background', 'url(' + this.image + ')')
        .setProperty('background-size', 'cover')
        .setProperty('-webkit-background-size', 'cover')
        .setProperty('-moz-background-size', 'cover')
        .setProperty('-o-background-size', 'cover')
        //.setProperty('border-radius', '50%')
        .setProperty('cursor', 'pointer');


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
        console.log('Z is ' + this.position.getZ());
        console.log('mouse entered in ' + this.z);
        if (this.maximized) {
            return;
        }
        this.scale.halt();

        this.scale.set(1.3, 1.3, 1, { duration: 600, curve: 'outBounce'});

        this.position.setZ(this.z + 50);
    } else if (type === 'mouseleave') {
        if (this.maximized) {
            return;
        }
        this.scale.halt();
        this.position.setZ(this.z);
        this.scale.set(1, 1, 1, { duration: 250, curve: 'easeOut' }, function() {

        }.bind(this));
    } else if (type === 'mousedown') {
        if (! this.maximized) {
            this.maximized = true;
            this.getParent().emit('maximizedNode', { source: this });
            this.align.halt();
            this.size.halt();
            this.scale.set(1, 1, 1);
            this.position.setZ(2000);
            this.align.set(0.5, 0.5, 1, {duration: 200});
            this._el
                .setProperty('background', this.background)
                .setProperty('border-radius', '50%');


            this.size.setProportional(1, 1,.1, {duration: 450, curve: 'easeOut'}, function(){

                this.youtubeActive = true;
                    this.youtube = this.addChild()
                        .setOrigin(0.5, 0.5)
                        .setAlign(0.5, 0.5, 0.95)
                        .setSizeMode('absolute', 'absolute', 'absolute')
                        .setMountPoint(0.5, 0.5)
                        .setAbsoluteSize(460, 215, 1);
                this.youtubeEl = new DOMElement(this.youtube);
                this.youtubeEl
                    .setContent('<iframe width="460" height="215" src="https://www.youtube.com/embed/No0MCjT4ElQ?rel=0&autoplay=1&amp;controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>');
                this.position.setZ(this.z + 2000);

            }.bind(this));


        } else {
            this.maximized = false;

            this.size.halt();
            this.align.halt();
            if (this.youtubeActive) {
                this.youtubeEl.setContent('');
                this.removeChild(this.youtube);
            }
            this.align.set(this.x, this.y, 1, { duration: 200 });


            this.size.setProportional(this.propSize,this.propSize,.1, { duration: 400, curve: 'easeOut'}, function() {
                this.position.setZ(this.z);
                this._el
                    .setProperty('background', 'url(' + this.image + ')')
                    .setProperty('border-radius', '0');
                this.getParent().emit('minimizedNode', { source: this });
            }.bind(this));

        }

    }

};




module.exports = Bubble;
