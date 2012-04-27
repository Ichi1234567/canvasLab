(function() {

  define([], function() {
    var POLYDRAW;
    POLYDRAW = {
      "noFace": function(params) {
        var ctx, data, i, v, v_i, vnum, _results;
        data = params.data;
        ctx = params.ctx;
        vnum = data.vnum;
        v = data.v;
        ctx.beginPath();
        ctx.moveTo(v[0][0], v[0][1]);
        _results = [];
        for (i = 1; 1 <= vnum ? i <= vnum : i >= vnum; 1 <= vnum ? i++ : i--) {
          v_i = v[i];
          _results.push(ctx.lineTo(v_i[0], v_i[1]));
        }
        return _results;
      },
      "hasFace": function(params) {
        var b_mv, ctx, data, f, f0, f_i, f_ij, f_ij_full, fnum, i, idx, j, v, _len, _len2, _results;
        data = params.data;
        ctx = params.ctx;
        fnum = data.fnum;
        f = data.f;
        v = data.v;
        _results = [];
        for (i = 0, _len = f.length; i < _len; i++) {
          f_i = f[i];
          ctx.beginPath();
          b_mv = true;
          for (j = 0, _len2 = f_i.length; j < _len2; j++) {
            f_ij = f_i[j];
            f_ij_full = f_ij.split("/");
            idx = parseInt(f_ij_full[0]);
            if (b_mv) {
              ctx.moveTo(v[idx][0], v[idx][1]);
            } else {
              ctx.lineTo(v[idx][0], v[idx][1]);
            }
            b_mv = f_ij_full.length > 1 ? !parseInt(f_ij_full[1]) : false;
          }
          f0 = f_i[0].split("/");
          idx = parseInt(f0[0]);
          if (b_mv) {
            _results.push(ctx.moveTo(v[idx][0], v[idx][1]));
          } else {
            _results.push(ctx.lineTo(v[idx][0], v[idx][1]));
          }
        }
        return _results;
      }
    };
    return POLYDRAW;
  });

}).call(this);
