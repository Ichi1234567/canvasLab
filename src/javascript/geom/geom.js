(function() {

  define([], function() {
    var GEOM;
    GEOM = {
      lookAt: function(at, params) {
        var center, ctx, display, h, w;
        display = params.display;
        w = display.w;
        h = display.h;
        ctx = display.ctx;
        if (at && at.length === 2) {
          center = [w / 2, h / 2];
          ctx[0].setTransform(1, 0, 0, 1, center[0] - at[0], center[1] - at[1]);
          ctx[1].setTransform(1, 0, 0, 1, center[0] - at[0], center[1] - at[1]);
          return display["at"] = at.map(function(val) {
            return val;
          });
        }
      },
      scale: function(scale, params) {
        var center, ctx, display, dx, dy;
        display = params.display;
        ctx = display.ctx;
        center = params.center;
        if (scale && scale.length === 2) {
          dx = center[0] - center[0] * scale[0];
          dy = center[1] - center[1] * scale[1];
          ctx[0].transform(scale[0], 0, 0, scale[1], dx, dy);
          return ctx[1].transform(scale[0], 0, 0, scale[1], dx, dy);
        }
      },
      move: function(vec, params) {
        var center, ctx, display;
        display = params.display;
        ctx = display.ctx;
        center = params.center;
        if (vec && vec.length === 2) {
          ctx[0].transform(1, 0, 0, 1, vec[0], vec[1]);
          return ctx[1].transform(1, 0, 0, 1, vec[0], vec[1]);
        }
      },
      transform: function(tfMtx, params) {
        var center, ctx, display, dx, dy;
        display = params.display;
        ctx = display.ctx;
        center = params.center;
        if (tfMtx && tfMtx.length === 6) {
          dx = center[0] - center[0] * tfMtx[0];
          dy = center[1] - center[1] * tfMtx[3];
          ctx[0].transform(tfMtx[0], tfMtx[1], tfMtx[2], tfMtx[3], dx + tfMtx[4], dy + tfMtx[5]);
          return ctx[1].transform(tfMtx[0], tfMtx[1], tfMtx[2], tfMtx[3], dx + tfMtx[4], dy + tfMtx[5]);
        }
      },
      rotate: function(angle, params) {
        var center, center_new, ctx, display, vec;
        display = params.display;
        ctx = display.ctx;
        center = params.center;
        if (typeof angle === "number") {
          center_new = [center[0] * Math.cos(angle) + center[1] * Math.sin(angle), -center[0] * Math.sin(angle) + center[1] * Math.cos(angle)];
          vec = [center_new[0] - center[0], center_new[1] - center[1]];
          ctx[0].rotate(angle);
          ctx[1].rotate(angle);
          return GEOM.move(vec, params);
        }
      },
      unwrapMtx: function(mtxInfos, params) {
        return mtxInfos.forEach(function(val) {
          var argi, i, key, mtx, mtxArgs;
          key = val[0];
          mtx = val[1];
          mtxArgs = val[2];
          if (mtxArgs) {
            for (argi in mtxArgs) {
              i = mtxArgs[argi];
              params[i] = argi;
            }
          }
          return typeof GEOM[key] === "function" && GEOM[key](mtx, params);
        });
      }
    };
    return GEOM;
  });

}).call(this);
