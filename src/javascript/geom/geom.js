(function() {

  define([], function() {
    var GEOM;
    GEOM = {
      lookAt: function(at, params) {
        var cb, center, ctx, dx, dy, h, mtx_val, w;
        cb = params.cb ? params.cb : (function() {});
        w = params.w;
        h = params.h;
        ctx = params.ctx;
        if (at && at.length === 2) {
          center = [w / 2, h / 2];
          dx = center[0] - at[0];
          dy = center[1] - at[1];
          ctx.map(function(ctx_i) {
            return ctx_i.setTransform(1, 0, 0, 1, dx, dy);
          });
          mtx_val = [1, 0, 0, 1, dx, dy];
          return cb(mtx_val);
        }
      },
      scale: function(scale, params) {
        var cb, center, ctx, display, dx, dy, mtx_val;
        cb = params.cb ? params.cb : (function() {});
        display = params.display;
        ctx = display.ctx;
        center = params.center;
        if (scale && scale.length === 2) {
          dx = center[0] - center[0] * scale[0];
          dy = center[1] - center[1] * scale[1];
          ctx.map(function(ctx_i) {
            return ctx_i.transform(scale[0], 0, 0, scale[1], dx, dy);
          });
          mtx_val = [scale[0], 0, 0, scale[1], dx, dy];
          return cb(mtx_val);
        }
      },
      move: function(vec, params) {
        var cb, center, ctx, display, mtx_val;
        cb = params.cb ? params.cb : (function() {});
        display = params.display;
        ctx = display.ctx;
        center = params.center;
        if (vec && vec.length === 2) {
          ctx.map(function(ctx_i) {
            return ctx_i.transform(1, 0, 0, 1, vec[0], vec[1]);
          });
          mtx_val = [1, 0, 0, 1, vec[0], vec[1]];
          return cb(mtx_val);
        }
      },
      transform: function(tfMtx, params) {
        var cb, center, ctx, display, mtx_val;
        cb = params.cb ? params.cb : (function() {});
        display = params.display;
        ctx = display.ctx;
        center = params.center;
        if (tfMtx && tfMtx.length === 6) {
          ctx.map(function(ctx_i) {
            return ctx_i.transform(tfMtx[0], tfMtx[1], tfMtx[2], tfMtx[3], tfMtx[4], tfMtx[5]);
          });
          mtx_val = [tfMtx[0], tfMtx[1], tfMtx[2], tfMtx[3], tfMtx[4], tfMtx[5]];
          return cb(mtx_val);
        }
      },
      rotate: function(angle, params) {
        var cb, center, center_new, ctx, display, mtx_val, vec;
        cb = params.cb ? params.cb : (function() {});
        display = params.display;
        ctx = display.ctx;
        center = params.center;
        if (typeof angle === "number") {
          center_new = [center[0] * Math.cos(angle) + center[1] * Math.sin(angle), -center[0] * Math.sin(angle) + center[1] * Math.cos(angle)];
          vec = [center[0] - center_new[0], center[1] - center_new[1]];
          ctx.map(function(ctx_i) {
            return ctx_i.transform(Math.cos(angle), -Math.sin(angle), Math.sin(angle), Math.cos(angle), vec[0], vec[1]);
          });
          mtx_val = [Math.cos(angle), -Math.sin(angle), Math.sin(angle), Math.cos(angle), vec[0], vec[1]];
          return cb(mtx_val);
        }
      },
      unwrapMtx: function(mtxInfos, params) {
        var mixMtx;
        mixMtx = [1, 0, 0, 1, 0, 0];
        mtxInfos.forEach(function(val) {
          var argi, cb, i, key, mtx, mtxArgs, newMtx;
          key = val[0];
          mtx = val[1];
          mtxArgs = val[2];
          if (mtxArgs) {
            for (argi in mtxArgs) {
              i = mtxArgs[argi];
              params[i] = argi;
            }
          }
          if (typeof GEOM[key] === "function") {
            newMtx = [];
            cb = function(mtx_val) {
              newMtx[0] = mtx_val[0] * mixMtx[0] + mtx_val[2] * mixMtx[1];
              newMtx[1] = mtx_val[1] * mixMtx[0] + mtx_val[3] * mixMtx[1];
              newMtx[2] = mtx_val[0] * mixMtx[2] + mtx_val[2] * mixMtx[3];
              newMtx[3] = mtx_val[1] * mixMtx[2] + mtx_val[3] * mixMtx[3];
              newMtx[4] = mtx_val[0] * mixMtx[4] + mtx_val[2] * mixMtx[5] + mtx_val[4];
              newMtx[5] = mtx_val[1] * mixMtx[4] + mtx_val[3] * mixMtx[5] + mtx_val[5];
              return mixMtx = newMtx;
            };
            params.cb = cb;
            return GEOM[key](mtx, params);
          }
        });
        return ["transform", mixMtx];
      }
    };
    return GEOM;
  });

}).call(this);
