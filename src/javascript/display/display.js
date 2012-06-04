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
        this.status = "";
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
        len = isclear ? 0. : this.objs.length;
        rmNo = isclear ? this.objs.length : 0.;
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
              pt = [e.offsetX, e.offsetY];
              return display._handleEvts({
                pt: pt,
                e: e
              });
            },
            "mouseup": function(e) {
              var pt;
              pt = [e.offsetX, e.offsetY];
              return display._handleEvts({
                pt: pt,
                e: e
              });
            },
            "click": function(e) {
              var pt;
              pt = [e.offsetX, e.offsetY];
              return display._handleEvts({
                pt: pt,
                e: e
              });
            },
            "dblclick": function(e) {
              var pt;
              pt = [e.offsetX, e.offsetY];
              return display._handleEvts({
                pt: pt,
                e: e
              });
            }
          });
        });
        return this;
      };

      DISPLAY.prototype["disableEvts"] = function() {
        return this;
      };

      DISPLAY.prototype["_handleEvts"] = function(params) {
        var color, ctx, fna_i, h, i, lookat, newpt, pt, result, w, _len, _ref;
        pt = params.pt;
        ctx = this.ctx[this.current];
        h = this.h;
        w = this.w;
        color = ctx.getImageData(pt[0], pt[1], 1, 1).data;
        if (color[3]) {
          lookat = this.lookat;
          newpt = [pt[0] - (w / 2) + lookat[0], pt[1] - (h / 2) + lookat[1]];
          params.pt = newpt;
          result = this.getObjectsUnderPoint(params);
          if (result.inside) {
            if (!!result.fna && result.fna.length) {
              _ref = result.fna;
              for (i = 0, _len = _ref.length; i < _len; i++) {
                fna_i = _ref[i];
                fna_i(params.e, result.target);
              }
            }
          }
        } else {
          this.getObjectsUnderPoint(params);
        }
        return this;
      };

      DISPLAY.prototype["getObjectsUnderPoint"] = function(params) {
        var children, children_i, i, result, _len;
        result = null;
        children = this.objs;
        for (i = 0, _len = children.length; i < _len; i++) {
          children_i = children[i];
          result = children_i.isIn(params);
          result && (result.target = children_i, i = children.length);
        }
        return result;
      };

      DISPLAY.prototype["getPtFromObject"] = function(params) {
        var obj, result, tmpPt;
        result = null;
        params = params ? params : {};
        obj = params.obj ? params.obj : null;
        tmpPt = params.pt ? params.pt : null;
        return result;
      };

      return DISPLAY;

    })(CANVAS);
    return DISPLAY;
  });

}).call(this);
