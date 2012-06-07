(function() {

  define([], function() {
    var MTX;
    MTX = {
      "loadIdentity": function(params) {
        var c, i, j, r, result, rs, val;
        params = params ? params : {};
        r = params.r ? params.r : 3.;
        c = params.c ? params.c : 3.;
        result = [];
        for (i = 0; 0 <= r ? i < r : i > r; 0 <= r ? i++ : i--) {
          rs = [];
          for (j = 0; 0 <= c ? j < c : j > c; 0 <= c ? j++ : j--) {
            val = i === j ? 1. : 0.;
            rs.push(val);
          }
          result.push(rs);
        }
        return result;
      },
      "loadZero": function(params) {
        var c, i, j, r, result, rs;
        params = params ? params : {};
        r = params.r ? params.r : 3.;
        c = params.c ? params.c : 3.;
        result = [];
        for (i = 0; 0 <= r ? i < r : i > r; 0 <= r ? i++ : i--) {
          rs = [];
          for (j = 0; 0 <= c ? j < c : j > c; 0 <= c ? j++ : j--) {
            rs.push(0);
          }
          result.push(rs);
        }
        return result;
      },
      "mesureDim": function(mtx) {
        return {
          "r": mtx.length,
          "c": mtx[0].length
        };
      },
      "cloneMtx": function(mtx) {
        var dim, result;
        dim = MTX.mesureDim(mtx);
        result = MTX.loadZero(dim);
        result = MTX.add(result, mtx);
        return result;
      },
      "add": function(mtx1, mtx2) {
        var result;
        result = mtx1.map(function(row, rowIdx) {
          return row.map(function(val, colIdx) {
            return val + mtx2[rowIdx][colIdx];
          });
        });
        return result;
      },
      "sub": function(mtx1, mtx2) {
        var result;
        result = mtx1.map(function(row, rowIdx) {
          return row.map(function(val, colIdx) {
            return val - mtx2[rowIdx][colIdx];
          });
        });
        return result;
      },
      "multiMtx": function(mtx1, mtx2) {
        var cols, dim, dim1, dim2, i, j, k, phi, result, rows, _ref, _ref2, _ref3;
        phi = 100000;
        dim1 = MTX.mesureDim(mtx1);
        dim2 = MTX.mesureDim(mtx2);
        dim = {
          r: dim1.r,
          c: dim2.c
        };
        result = MTX.loadZero(dim);
        rows = mtx1.length;
        cols = mtx2[0].length;
        for (i = 0, _ref = dim1.r; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          for (j = 0, _ref2 = dim1.c; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
            for (k = 0, _ref3 = dim2.c; 0 <= _ref3 ? k < _ref3 : k > _ref3; 0 <= _ref3 ? k++ : k--) {
              result[i][k] += mtx1[i][j] * mtx2[j][k];
            }
          }
          result[i][k - 1] = Math.floor(result[i][k - 1] * phi) / phi;
        }
        return result;
      },
      "multiNum": function(mtx1, num) {
        var phi, result;
        phi = 100000;
        result = mtx1.map(function(row) {
          return row.map(function(val) {
            return Math.floor(num * val * phi) / phi;
          });
        });
        return result;
      },
      "transpose": function(mtx) {
        var dim, result;
        dim = MTX.mesureDim(mtx);
        result = MTX.loadZero(dim);
        mtx.map(function(row, rowIdx) {
          return row.map(function(val, colIdx) {
            return result[colIdx][rowIdx] = val;
          });
        });
        return result;
      },
      "reductMtx": function(mtx, ridx, cidx, dim, opts) {
        var coef, result, sgn;
        opts = opts ? opts : {};
        coef = opts.nocoef ? false : true;
        result = MTX.loadZero(dim);
        sgn = Math.pow(-1., ridx + cidx);
        mtx.map(function(row, rowIdx) {
          var new_r, one_row;
          if (rowIdx !== ridx) {
            new_r = rowIdx < ridx ? rowIdx : rowIdx - 1;
            return one_row = row.map(function(val, colIdx) {
              var new_c;
              if (colIdx !== cidx) {
                new_c = colIdx < cidx ? colIdx : colIdx - 1;
                result[new_r][new_c] = val;
                return result.coef = mtx.coef * mtx[ridx][cidx] * sgn;
              }
            });
          }
        });
        return result;
      },
      "det": function(mtx) {
        var count, det, detResult, dim, half, newc, newdim, newr;
        dim = MTX.mesureDim(mtx);
        mtx.coef = 1;
        det = [mtx];
        count = 0;
        if (dim.r === dim.c) {
          while (det[0].length !== 1) {
            count++;
            if (count === 10) {
              console.log("error");
              return;
            }
            newdim = {
              r: dim.r - 1,
              c: dim.c - 1
            };
            newr = dim.r - 1;
            newc = dim.c - 1;
            half = [];
            det.map(function(mtx) {
              return mtx.map(function(mtx_i, ridx) {
                var result;
                result = MTX.reductMtx(mtx, ridx, 0, newdim);
                return half.push(result);
              });
            });
            det = half;
            dim = newdim;
          }
          if (det.length > 1) {
            detResult = MTX.loadZero(newdim);
            det.map(function(mtx) {
              var tmp;
              tmp = mtx;
              if (typeof mtx.coef === "number") tmp = MTX.multiNum(mtx, mtx.coef);
              return detResult = MTX.add(detResult, tmp);
            });
          } else {
            detResult = mtx;
          }
        }
        return detResult[0];
      },
      "adjustMtx": function(mtx) {
        var adjustMtx, dim, subdim, tmtx;
        dim = MTX.mesureDim(mtx);
        subdim = {
          r: dim.r - 1,
          c: dim.c - 1
        };
        tmtx = MTX.loadZero(dim);
        mtx.map(function(row, ridx) {
          return row.map(function(val, cidx) {
            var subdet, submtx;
            submtx = MTX.reductMtx(mtx, ridx, cidx, subdim, {
              nocoef: true
            });
            subdet = MTX.det(submtx);
            return tmtx[ridx][cidx] = Math.pow(-1, ridx + cidx) * subdet;
          });
        });
        adjustMtx = MTX.transpose(tmtx);
        return adjustMtx;
      },
      "invert": function(mtx) {
        var adjustMtx, det, dim, result;
        dim = MTX.mesureDim(mtx);
        result = false;
        det = MTX.det(mtx);
        if (det) {
          adjustMtx = MTX.adjustMtx(mtx);
          result = MTX.multiNum(adjustMtx, 1 / det);
        }
        return result;
      }
    };
    return MTX;
  });

}).call(this);
