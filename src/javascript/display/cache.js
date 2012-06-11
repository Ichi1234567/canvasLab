(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["display/canvas", "../geom/mtx"], function(CANVAS, MTX) {
    var CACHE;
    console.log("---cache---");
    CACHE = (function(_super) {

      __extends(CACHE, _super);

      function CACHE() {
        CACHE.__super__.constructor.apply(this, arguments);
      }

      CACHE.prototype["initialize"] = function(params) {
        var canvas, ctx;
        this.x = params.x;
        this.y = params.y;
        this.w = params.w;
        this.h = params.h;
        this.mtx = params.mtx;
        this.canvas = [$("<canvas></canvas>")];
        canvas = this.canvas[0].get(0);
        canvas.width = this.w;
        canvas.height = this.h;
        this.ctx = [canvas.getContext("2d")];
        ctx = this.ctx[0];
        ctx.setTransform(1, 0, 0, 1, -this.x, -this.y);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        this.lookat = [this.x + this.w / 2, this.y + this.h / 2];
        $("#cache").append(canvas);
        return this;
      };

      CACHE.prototype["clear"] = function(params) {
        var ctx;
        params = params ? params : {};
        params.ctx = this.ctx[0];
        ctx = params.ctx;
        params.x = params.x ? params.x : 0.;
        params.y = params.y ? params.y : 0.;
        params.w = params.w ? params.w : this.w;
        params.h = params.h ? params.h : this.h;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        CACHE.__super__["clear"].call(this, params);
        return this;
      };

      CACHE.prototype["setStyle"] = function(params) {
        params = params ? params : {};
        params.ctx = this.ctx[0];
        CACHE.__super__["setStyle"].call(this, params);
        return this;
      };

      CACHE.prototype["reset"] = function(params) {
        CACHE.__super__["reset"].call(this, params);
        return this;
      };

      CACHE.prototype["updateCanvas"] = function(params) {
        var canvas, ctx, size;
        size = params.size;
        canvas = this.canvas[0];
        $(canvas).attr("width", size[0]).attr("height", size[1]);
        ctx = this.ctx[0];
        ctx.putImageData(params.data, 0, 0);
        this.new_min = params.min;
        this.new_max = params.max;
        return this;
      };

      return CACHE;

    })(CANVAS);
    return CACHE;
  });

}).call(this);
