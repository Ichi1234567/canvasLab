(function() {

  define(["objData/objData"], function(OBJDATA) {
    console.log("---reader---");
    return jQuery.fn.readObjEvt = function(params) {
      var $elm, doneFn;
      params = typeof params === "object" ? params : {};
      doneFn = typeof params.done === "function" ? params.done : (function() {});
      $elm = this;
      return $elm.bind("change", function(e) {
        var $file, fileUrl, objFile, reader, type;
        type = $elm.attr("type");
        switch (type) {
          case "radio":
            $file = $elm.filter(":checked");
            fileUrl = $file.attr("val");
            return $.ajax({
              type: "GET",
              url: fileUrl,
              contentType: "application/x-www-form-urlencoded;charset=utf-8"
            }).done(function() {
              var data;
              data = new OBJDATA(arguments);
              return doneFn(data);
            }).fail(function() {
              return alert("The file cant be found.");
            });
          case "file":
            objFile = $elm.get(0).files[0];
            if (!objFile.name.match(/\.obj$/)) {
              alert("Please select a .obj file.");
              return;
            }
            reader = new FileReader();
            reader.onload = function(e) {
              var data, desc;
              desc = e.target.result.length ? "success" : "fail";
              data = new OBJDATA([e.target.result, desc, e]);
              return doneFn(data);
            };
            return reader.readAsText(objFile);
        }
      });
    };
  });

}).call(this);
