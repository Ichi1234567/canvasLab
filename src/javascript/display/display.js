(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["display/canvas"], function(CANVAS) {
    var DISPLAY;
    console.log("---display---");
    DISPLAY = (function(_super) {

      __extends(DISPLAY, _super);

      function DISPLAY() {
        DISPLAY.__super__.constructor.apply(this, arguments);
      }

      DISPLAY.prototype["initialize"] = function(params) {
        console.log("init - display");
        this.objs = [];
        this.current = 0;
        this.w = params.width;
        this.h = params.height;
        this.canvas = [
          $("<canvas></canvas>").css({
            "display": "block",
            "border": "1px solid black"
          }), $("<canvas></canvas>").css({
            "display": "none",
            "border": "1px solid black"
          })
        ];
        this.canvas[0].get(0).width = this.w;
        this.canvas[0].get(0).height = this.h;
        this.canvas[1].get(0).width = this.w;
        this.canvas[1].get(0).height = this.h;
        this.ctx = [this.canvas[0].get(0).getContext("2d"), this.canvas[1].get(0).getContext("2d")];
        this.ctx[0].lineCap = "round";
        this.ctx[1].lineCap = "round";
        this.ctx[0].lineJoin = "round";
        this.ctx[1].lineJoin = "round";
        params.display.append(this.canvas[0]).append(this.canvas[1]);
        this.lookat = [this.w / 2, this.h / 2];
        this.enableEvts();
        return this;
      };

      DISPLAY.prototype["switchCanvas"] = function(params) {
        var current, displayVal, prev;
        params = params ? params : {};
        prev = params.prev;
        current = params.current;
        displayVal = ["block", "none"];
        this.clear();
        this.canvas[current].css("display", displayVal[0]);
        this.canvas[prev].css("display", displayVal[1]);
        this.current = current;
        return this;
      };

      DISPLAY.prototype["clear"] = function(params) {
        params = params ? params : {};
        params.ctx = this.ctx[this.current];
        params.x = params.x ? params.x : 0.;
        params.y = params.y ? params.y : 0.;
        params.w = params.w ? params.w : this.w;
        params.h = params.h ? params.h : this.h;
        DISPLAY.__super__["clear"].call(this, params);
        return this;
      };

      DISPLAY.prototype["setStyle"] = function(params) {
        params = params ? params : {};
        params.ctx = this.ctx[this.current];
        DISPLAY.__super__["setStyle"].call(this, params);
        return this;
      };

      DISPLAY.prototype["reset"] = function(params) {
        DISPLAY.__super__["reset"].call(this, params);
        return this;
      };

      DISPLAY.prototype["pushObj"] = function(params) {
        var isclear, len, rmNo;
        params = params ? params : {};
        isclear = params.clear ? true : false;
        len = this.objs.length;
        rmNo = isclear ? len : 0.;
        params.obj && this.objs.splice(len, rmNo, params.obj);
        return this;
      };

      DISPLAY.prototype["updateCanvas"] = function(params) {
        var at, canvas, ctx, current, mode, otherCtx, prev;
        prev = this.current;
        current = (this.current + 1) % 2;
        this.switchCanvas({
          prev: prev,
          current: current
        });
        canvas = this.canvas[current];
        ctx = this.ctx[current];
        otherCtx = this.ctx[prev];
        params.objs = this.objs;
        params.canvas = canvas;
        params.ctx = ctx;
        at = this.lookat;
        this.lookAt(at);
        ctx.save();
        otherCtx.save();
        mode = DISPLAY.__super__["updateCanvas"].call(this, params);
        ctx.restore();
        otherCtx.restore();
        this.mode = mode;
        return this;
      };

      DISPLAY.prototype["enableEvts"] = function() {
        var canvas, display;
        display = this;
        canvas = this.canvas;
        canvas.map(function($canvas_i) {
          return $canvas_i.bind({
            "mousedown": function(e) {
              var pt;
              console.log("down");
              pt = [e.offsetX, e.offsetY];
              return display._handleEvts({
                pt: pt,
                e: e
              });
            },
            "mouseup": function(e) {
              return console.log("up");
            },
            "mouseover": function(e) {
              return console.log("over");
            },
            "mouseout": function(e) {
              return console.log("out");
            },
            "click": function(e) {
              return console.log("click");
            },
            "dblclick": function(e) {
              return console.log("dblclick");
            }
          });
        });
        return this;
      };

      DISPLAY.prototype["disableEvts"] = function() {
        return this;
      };

      DISPLAY.prototype["_handleEvts"] = function(params) {
        var color, ctx, h, pt, w;
        pt = params.pt;
        ctx = this.ctx[this.current];
        h = this.h;
        w = this.w;
        color = ctx.getImageData(pt[0], pt[1], 1, 1).data;
        if (color[3]) this.getObjectsUnderPoint(params);
        return this;
      };

      DISPLAY.prototype["getObjectsUnderPoint"] = function(params) {
        var result;
        result = null;
        return result;
      };

      return DISPLAY;

    })(CANVAS);
    return DISPLAY;
  });

}).call(this);
