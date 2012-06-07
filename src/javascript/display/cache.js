(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["display/canvas", "../geom/mtx"], function(CANVAS, MTX) {
    var CACHE, ROUTINES;
    console.log("---cache---");
    ROUTINES = {
      mtxarr2mtx: function(mtxarr) {
        var mtx;
        mtx = MTX.loadIdentity();
        mtx[0][0] = mtxarr[0];
        mtx[1][0] = mtxarr[1];
        mtx[0][1] = mtxarr[2];
        mtx[1][1] = mtxarr[3];
        mtx[0][2] = mtxarr[4];
        mtx[1][2] = mtxarr[5];
        return mtx;
      },
      mtx2mtxarr: function(mtx) {
        var mtxarr;
        mtxarr = [mtx[0][0], mtx[1][0], mtx[0][1], mtx[1][1], mtx[0][2], mtx[1][2]];
        return mtxarr;
      },
      assignPt2mtx: function(pt) {
        var ptmtx;
        ptmtx = MTX.loadZero({
          r: 3,
          c: 1
        });
        ptmtx[0][0] = pt[0];
        ptmtx[1][0] = pt[1];
        ptmtx[2][0] = 1;
        return ptmtx;
      },
      assignmtx2Pt: function(mtx) {
        var pt;
        pt = [mtx[0][0], mtx[1][0]];
        return pt;
      }
    };
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

      CACHE.prototype["getBBbyLimit"] = function(min, max) {
        var bb;
        bb = [min, [max[0], min[1]], max, [min[0], max[1]]];
        return bb;
      };

      CACHE.prototype["getBB"] = function() {
        var bb, x, y;
        x = this.x;
        y = this.y;
        bb = [[x, y], [x + this.w, y], [x + this.w, y + this.h], [x, y + this.h]];
        return bb;
      };

      CACHE.prototype["getSize"] = function(bb) {
        var size;
        size = [Math.abs(bb[0][0] - bb[1][0]), Math.abs(bb[0][1] - bb[3][1])];
        return size;
      };

      CACHE.prototype["updateCanvas"] = function(params) {
        var at, bb, canvas, ctx, max, min, mode, mtx, size, tmpbb;
        this.clear();
        params = params ? params : {};
        this.mtx = params.mtx ? params.mtx : this.mtx;
        canvas = this.canvas[0];
        ctx = this.ctx[0];
        params.canvas = canvas;
        params.ctx = ctx;
        params.cache = true;
        mtx = ROUTINES.mtxarr2mtx(this.mtx[0][1]);
        tmpbb = this.getBB();
        bb = tmpbb.map(function(val) {
          var tmp, valmtx;
          valmtx = ROUTINES.assignPt2mtx(val);
          tmp = MTX.multiMtx(mtx, valmtx);
          val = ROUTINES.assignmtx2Pt(tmp);
          return val;
        });
        min = $.extend([], bb[0]);
        max = $.extend([], bb[0]);
        bb.map(function(val) {
          min[0] = Math.min(min[0], val[0]);
          min[1] = Math.min(min[1], val[1]);
          max[0] = Math.max(max[0], val[0]);
          return max[1] = Math.max(max[1], val[1]);
        });
        this.new_min = min;
        this.new_max = max;
        bb = this.getBBbyLimit(min, max);
        size = [Math.abs(min[0] - max[0]), Math.abs(min[1] - max[1])];
        $(canvas).attr("width", size[0]).attr("height", size[1]);
        ctx.setTransform(1, 0, 0, 1, -min[0], -min[1]);
        at = this.lookat;
        ctx.save();
        mode = CACHE.__super__["updateCanvas"].call(this, params);
        ctx.restore();
        this.mode = mode;
        return this;
      };

      return CACHE;

    })(CANVAS);
    return CACHE;
  });

}).call(this);
