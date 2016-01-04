(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, AddModel, AddView, Promise, addModel, addView, httpGet, models, views;

$ = require("jquery-plugins.coffee");

httpGet = (require("ajax.coffee")).httpGet;

Promise = require("promise");

AddModel = require("./addModel.coffee");

addModel = AddModel();

AddView = require("./addView.coffee");

addView = AddView($("@item-add-form"), addModel);

addView.on("save", function(fields) {
  var field, fn, promises, result, value;
  result = {};
  promises = [];
  fn = function(field, value) {
    promises.push(value);
    if (value instanceof Promise) {
      return value.then(function(value) {
        return result[field] = value;
      })["catch"](function(error) {
        return console.error(error);
      });
    } else {
      return result[field] = value;
    }
  };
  for (field in fields) {
    value = fields[field];
    fn(field, value);
  }
  return Promise.all(promises).then(function() {
    console.log("may save");
    return console.log(result);
  });
});

models = {
  string: require("string/addStringModel.coffee"),
  table: require("table/addTableModel.coffee"),
  checkbox: require("checkbox/addCheckboxModel.coffee"),
  radio: require("radio/addRadioModel.coffee"),
  image: require("image/addImageModel.coffee")
};

views = {
  string: require("string/addStringView.coffee"),
  table: require("table/addTableView.coffee"),
  checkbox: require("checkbox/addCheckboxView.coffee"),
  radio: require("radio/addRadioView.coffee"),
  image: require("image/addImageView.coffee")
};

httpGet(window.location.href + "__json/").then(function(response) {
  var $rows, field, i, index, len, model, ref, results;
  $rows = $("@input-contain");
  index = 0;
  ref = response.fields;
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    field = ref[i];
    if (models[field.type] != null) {
      model = models[field.type]({
        field: field
      });
      if (typeof model.setSettings === "function") {
        model.setSettings(field.settings);
      }
      views[field.type]($rows.eq(index), model);
      addModel.add(field.alias, model);
    }
    if ((field.settings.hide == null) || ((field.settings.hide != null) && !field.settings.hide)) {
      results.push(index++);
    } else {
      results.push(void 0);
    }
  }
  return results;
});


},{"./addModel.coffee":2,"./addView.coffee":3,"ajax.coffee":"ajax.coffee","checkbox/addCheckboxModel.coffee":4,"checkbox/addCheckboxView.coffee":5,"image/addImageModel.coffee":6,"image/addImageView.coffee":7,"jquery-plugins.coffee":"jquery-plugins.coffee","promise":"promise","radio/addRadioModel.coffee":8,"radio/addRadioView.coffee":9,"string/addStringModel.coffee":10,"string/addStringView.coffee":11,"table/addTableModel.coffee":12,"table/addTableView.coffee":13}],2:[function(require,module,exports){
var Model, httpGet;

Model = require("model.coffee");

httpGet = (require("ajax.coffee")).httpGet;

module.exports = Model({
  initialState: function() {
    return {
      fields: []
    };
  },
  add: function(name, model) {
    var fields;
    fields = this.state.fields.slice();
    fields.push({
      model: model,
      name: name
    });
    return this.set({
      fields: fields
    });
  },
  getFields: function() {
    var result;
    result = {};
    this.state.fields.map(function(item) {
      var e, error;
      try {
        if (typeof item.model.get !== "function") {
          throw item.name + " has no `get` method";
        }
        return result[item.name] = item.model.get();
      } catch (error) {
        e = error;
        return console.error(e);
      }
    });
    return result;
  }
});


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee"}],3:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "submit: contain": function(e) {
      this.trigger("save", this.model.getFields());
      return false;
    }
  }
});


},{"view.coffee":"view.coffee"}],4:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  setSettings: function(settings) {
    var data;
    data = [];
    data = settings.defaultData.slice();
    settings.defaultData.slice().map(function(item, index) {
      if ((typeof item.checked) === "string") {
        return data[index] = item.checked === "true";
      } else {
        return data[index] = item.checked;
      }
    });
    return this.set({
      data: data
    });
  },
  update: function(index, checked) {
    var data;
    data = this.state.data.slice();
    data[index] = checked;
    return this.set({
      data: data
    });
  },
  get: function() {
    return this.state.data;
  }
});


},{"model.coffee":"model.coffee"}],5:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "change: @checkbox": function(e) {
      var $input, index;
      $input = $(e.target);
      index = $input.data("index");
      return this.model.update(index, e.target.checked);
    }
  }
});


},{"view.coffee":"view.coffee"}],6:[function(require,module,exports){
var Model, Promise, httpFile;

Model = require("model.coffee");

Promise = require("promise");

httpFile = (require("ajax.coffee")).httpFile;

module.exports = Model({
  setPreview: function(input) {
    var filename;
    this.set({
      readyToSave: false
    });
    this.input = input;
    if (input.files != null) {
      return this.set({
        filename: input.files[0].name
      });
    } else {
      filename = input.value.split(/[\/\\]/);
      return this.set({
        filename: filename.pop()
      });
    }
  },
  setInput: function(input) {
    return this.input = input;
  },
  removePreview: function() {
    this.set({
      filename: false
    });
    return this.set({
      readyToSave: false
    });
  },
  get: function() {
    if (this.state.readyToSave) {
      return this.state.uploadedPath;
    } else {
      if (this.input && this.state.filename) {
        return httpFile("/cms/types/image/uploadimage/__json/", {
          image: this.input
        }).then((function(_this) {
          return function(response) {
            _this.set({
              readyToSave: true
            });
            _this.set({
              uploadedPath: response.filename
            });
            return response.filename;
          };
        })(this));
      } else {
        return false;
      }
    }
  }
});


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee","promise":"promise"}],7:[function(require,module,exports){
var Render, View, template;

View = require("view.coffee");

template = require("types/image/item.tmpl.js");

Render = require("render");

module.exports = View({
  debug: true,
  initial: function() {
    this.template = Render(template, this.contain[0]);
    return this.model.setInput(this.contain.find("@image")[0]);
  },
  render: function(state) {
    if (!state.field.settings.hide) {
      return this.template(state);
    }
  },
  events: {
    "change: @image": function(e) {
      return this.model.setPreview(e.target);
    },
    "click: @remove": function(e) {
      return this.model.removePreview();
    }
  }
});


},{"render":"render","types/image/item.tmpl.js":14,"view.coffee":"view.coffee"}],8:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  setSettings: function(settings) {
    return this.set({
      value: +settings.defaultValue
    });
  },
  update: function(value) {
    return this.set({
      value: +value
    });
  },
  get: function() {
    return this.state.value;
  }
});


},{"model.coffee":"model.coffee"}],9:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "change: @radio": function(e) {
      var $input;
      $input = $(e.target);
      return this.model.update($input.data("index"));
    }
  }
});


},{"view.coffee":"view.coffee"}],10:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  setSettings: function(settings) {
    return this.set({
      value: settings.defaultValue
    });
  },
  update: function(value) {
    return this.set({
      value: value
    });
  },
  get: function() {
    return this.state.value;
  }
});


},{"model.coffee":"model.coffee"}],11:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "change: @string": function(e) {
      return this.model.update(e.target.value);
    }
  }
});


},{"view.coffee":"view.coffee"}],12:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  setSettings: function(settings) {
    return this.set({
      data: settings.defaultData.slice()
    });
  },
  update: function(rowIndex, columnIndex, value) {
    var data;
    data = this.state.data.slice();
    data[rowIndex][columnIndex] = value;
    return this.set({
      data: data
    });
  },
  get: function() {
    return this.state.data;
  }
});


},{"model.coffee":"model.coffee"}],13:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "change: @cell": function(e) {
      var $input, columnIndex, rowIndex;
      $input = $(e.target);
      rowIndex = +$input.data("row");
      columnIndex = +$input.data("column");
      return this.model.update(rowIndex, columnIndex, e.target.value);
    }
  }
});


},{"view.coffee":"view.coffee"}],14:[function(require,module,exports){
(function (factory)
{
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  }
  else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define('first-try', [], factory());
  }
  else {
    window.item = factory();
  }
})(function ()
{
  var _hasProp = Object.prototype.hasOwnProperty;
  var _crEl = function (node)
  {
    return {type: 'node', name: node, attrs: [], childs: []};
  };
  var _crTN = function (node)
  {
    return {type: 'text', text: node};
  };
  function count(arr)
  {
    return arr.length;
  }
  function length(str)
  {
    return str.length;
  }
  function create()
  {
    if (arguments.length === 1) {
      var rootNodes = [];
      arguments[0](rootNodes);
      if (rootNodes.length) {
        for (indexAttr in rootNodes) {
          if (_hasProp.call(rootNodes, indexAttr)) {
            if (typeof rootNodes[indexAttr] === 'string' || typeof rootNodes[indexAttr] === 'boolean' || typeof rootNodes[indexAttr] === 'number') {
              rootNodes[indexAttr] = _crTN(rootNodes[indexAttr]);
            }
          }
        }
      }
      return rootNodes;
    }
    else if (arguments.length === 3) {
      var nodes = [];
      var parentNode;
      var indexNode;
      var node;
      var indexAttr;
      var attr;
      var attrs = arguments[1];
      arguments[2](nodes);
      parentNode = _crEl(arguments[0]);
      if (attrs.length) {
        for (indexAttr in attrs) {
          if (_hasProp.call(attrs, indexAttr)) {
            attr = attrs[indexAttr];
            parentNode.attrs.push({
              name: attr[0],
              value: attr[1]
            });
          }
        }
      }
      for (indexNode in nodes) {
        if (_hasProp.call(nodes, indexNode)) {
          node = nodes[indexNode];
          if (typeof node === 'string' || typeof node === 'boolean' || typeof node === 'number') {
            parentNode.childs.push(_crTN(node));
          }
          else {
            parentNode.childs.push(node);
          }
        }
      }
      return parentNode;
    }
  }
  var cachedTemplates = {};
  function cacheRequireTemplate(path, required)
  {
    cachedTemplates[path] = required;
  }
  function requireTemplate(path, obj)
  {
    return cachedTemplates[path](obj);
  }
  return function (obj)
  {
    return create(function (childs)
    {
      with (obj) {
        (function () {
          var attrs = [];
          (function () {
            var attr = '';
            attr += 'form__file-wrap';
            attrs.push(['class', attr]);
          })();
          childs.push(create('div', attrs, function (childs) {
            if ( !(!( typeof filename !== 'undefined' ? filename : '' ))) {
              (function () {
                var attrs = [];
                (function () {
                  var attr = '';
                  attr += 'form__file-close';
                  attrs.push(['class', attr]);
                })();
                (function () {
                  var attr = '';
                  attr += 'remove';
                  attrs.push(['role', attr]);
                })();
                childs.push(create('span', attrs, function (childs) {
                }));
              })();
            }
            (function () {
              var attrs = [];
              (function () {
                var attr = '';
                attr += 'form__file';
                if ( !(!( typeof filename !== 'undefined' ? filename : '' ))) {
                  attr += ' form__file--choosen';
                }
                attrs.push(['class', attr]);
              })();
              childs.push(create('label', attrs, function (childs) {
                if ( !(!( typeof filename !== 'undefined' ? filename : '' ))) {
                  (function () {
                    var attrs = [];
                    (function () {
                      var attr = '';
                      attr += 'form__file-filename';
                      attrs.push(['class', attr]);
                    })();
                    childs.push(create('span', attrs, function (childs) {
                      childs.push(filename);
                    }));
                  })();
                }
                (function () {
                  var attrs = [];
                  (function () {
                    var attr = '';
                    attr += 'file';
                    attrs.push(['type', attr]);
                  })();
                  (function () {
                    var attr = '';
                    attr += field['alias'];
                    attrs.push(['name', attr]);
                  })();
                  (function () {
                    var attr = '';
                    attr += field['alias'];
                    attrs.push(['id', attr]);
                  })();
                  (function () {
                    var attr = '';
                    attrs.push(['value', attr]);
                  })();
                  (function () {
                    var attr = '';
                    attr += 'image';
                    attrs.push(['role', attr]);
                  })();
                  childs.push(create('input', attrs, function (childs) {
                  }));
                })();
              }));
            })();
          }));
        })();
      }
    });
  };
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9pdGVtL2FkZC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9pdGVtL2FkZE1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3NlY3Rpb25zL2l0ZW0vYWRkVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9jaGVja2JveC9hZGRDaGVja2JveE1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL2NoZWNrYm94L2FkZENoZWNrYm94Vmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9pbWFnZS9hZGRJbWFnZU1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL2ltYWdlL2FkZEltYWdlVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9yYWRpby9hZGRSYWRpb01vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3JhZGlvL2FkZFJhZGlvVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9zdHJpbmcvYWRkU3RyaW5nTW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvc3RyaW5nL2FkZFN0cmluZ1ZpZXcuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvdGFibGUvYWRkVGFibGVNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy90YWJsZS9hZGRUYWJsZVZpZXcuY29mZmVlIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvdHlwZXMvaW1hZ2UvaXRlbS50bXBsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLHVCQUFSOztBQUNKLE9BQUEsR0FBVSxDQUFDLE9BQUEsQ0FBUSxhQUFSLENBQUQsQ0FBdUIsQ0FBQzs7QUFDbEMsT0FBQSxHQUFVLE9B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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIkID0gcmVxdWlyZSBcImpxdWVyeS1wbHVnaW5zLmNvZmZlZVwiXG5odHRwR2V0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwR2V0XG5Qcm9taXNlID0gcmVxdWlyZSBcInByb21pc2VcIlxuXG5BZGRNb2RlbCA9IHJlcXVpcmUgXCIuL2FkZE1vZGVsLmNvZmZlZVwiXG5hZGRNb2RlbCA9IEFkZE1vZGVsKClcblxuQWRkVmlldyA9IHJlcXVpcmUgXCIuL2FkZFZpZXcuY29mZmVlXCJcblxuYWRkVmlldyA9IEFkZFZpZXcgKCQgXCJAaXRlbS1hZGQtZm9ybVwiKSwgYWRkTW9kZWxcblxuYWRkVmlldy5vbiBcInNhdmVcIiwgKGZpZWxkcykgLT5cbiAgcmVzdWx0ID0ge31cbiAgcHJvbWlzZXMgPSBbXVxuICBmb3IgZmllbGQsIHZhbHVlIG9mIGZpZWxkc1xuICAgIGRvIChmaWVsZCwgdmFsdWUpIC0+XG4gICAgICBwcm9taXNlcy5wdXNoIHZhbHVlXG4gICAgICBpZiB2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2VcbiAgICAgICAgdmFsdWVcbiAgICAgICAgLnRoZW4gKHZhbHVlKSAtPlxuICAgICAgICAgIHJlc3VsdFtmaWVsZF0gPSB2YWx1ZVxuICAgICAgICAuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZXJyb3JcbiAgICAgIGVsc2VcbiAgICAgICAgcmVzdWx0W2ZpZWxkXSA9IHZhbHVlXG5cbiAgUHJvbWlzZS5hbGwgcHJvbWlzZXNcbiAgLnRoZW4gLT5cbiAgICBjb25zb2xlLmxvZyBcIm1heSBzYXZlXCJcbiAgICBjb25zb2xlLmxvZyByZXN1bHRcblxubW9kZWxzID1cbiAgc3RyaW5nOiByZXF1aXJlIFwic3RyaW5nL2FkZFN0cmluZ01vZGVsLmNvZmZlZVwiXG4gIHRhYmxlOiByZXF1aXJlIFwidGFibGUvYWRkVGFibGVNb2RlbC5jb2ZmZWVcIlxuICBjaGVja2JveDogcmVxdWlyZSBcImNoZWNrYm94L2FkZENoZWNrYm94TW9kZWwuY29mZmVlXCJcbiAgcmFkaW86IHJlcXVpcmUgXCJyYWRpby9hZGRSYWRpb01vZGVsLmNvZmZlZVwiXG4gIGltYWdlOiByZXF1aXJlIFwiaW1hZ2UvYWRkSW1hZ2VNb2RlbC5jb2ZmZWVcIlxuXG52aWV3cyA9XG4gIHN0cmluZzogcmVxdWlyZSBcInN0cmluZy9hZGRTdHJpbmdWaWV3LmNvZmZlZVwiXG4gIHRhYmxlOiByZXF1aXJlIFwidGFibGUvYWRkVGFibGVWaWV3LmNvZmZlZVwiXG4gIGNoZWNrYm94OiByZXF1aXJlIFwiY2hlY2tib3gvYWRkQ2hlY2tib3hWaWV3LmNvZmZlZVwiXG4gIHJhZGlvOiByZXF1aXJlIFwicmFkaW8vYWRkUmFkaW9WaWV3LmNvZmZlZVwiXG4gIGltYWdlOiByZXF1aXJlIFwiaW1hZ2UvYWRkSW1hZ2VWaWV3LmNvZmZlZVwiXG5cbmh0dHBHZXQgXCIje3dpbmRvdy5sb2NhdGlvbi5ocmVmfV9fanNvbi9cIlxuLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAkcm93cyA9ICQgXCJAaW5wdXQtY29udGFpblwiXG4gIGluZGV4ID0gMFxuICBmb3IgZmllbGQgaW4gcmVzcG9uc2UuZmllbGRzXG4gICAgaWYgbW9kZWxzW2ZpZWxkLnR5cGVdP1xuICAgICAgbW9kZWwgPSBtb2RlbHNbZmllbGQudHlwZV0ge2ZpZWxkfVxuICAgICAgbW9kZWwuc2V0U2V0dGluZ3M/IGZpZWxkLnNldHRpbmdzXG4gICAgICB2aWV3c1tmaWVsZC50eXBlXSAkcm93cy5lcShpbmRleCksIG1vZGVsXG4gICAgICBhZGRNb2RlbC5hZGQgZmllbGQuYWxpYXMsIG1vZGVsXG4gICAgaWYgIWZpZWxkLnNldHRpbmdzLmhpZGU/IHx8IChmaWVsZC5zZXR0aW5ncy5oaWRlPyAmJiAhZmllbGQuc2V0dGluZ3MuaGlkZSlcbiAgICAgIGluZGV4KytcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5odHRwR2V0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwR2V0XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgaW5pdGlhbFN0YXRlOiAtPlxuICAgIGZpZWxkczogW11cblxuICBhZGQ6IChuYW1lLCBtb2RlbCkgLT5cbiAgICBmaWVsZHMgPSBAc3RhdGUuZmllbGRzLnNsaWNlKClcbiAgICBmaWVsZHMucHVzaFxuICAgICAgbW9kZWw6IG1vZGVsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgQHNldCB7ZmllbGRzfVxuXG4gIGdldEZpZWxkczogLT5cbiAgICByZXN1bHQgPSB7fVxuICAgIEBzdGF0ZS5maWVsZHMubWFwIChpdGVtKSAtPlxuICAgICAgdHJ5XG4gICAgICAgIGlmIHR5cGVvZiBpdGVtLm1vZGVsLmdldCAhPSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICB0aHJvdyBcIiN7aXRlbS5uYW1lfSBoYXMgbm8gYGdldGAgbWV0aG9kXCJcbiAgICAgICAgcmVzdWx0W2l0ZW0ubmFtZV0gPSBpdGVtLm1vZGVsLmdldCgpXG4gICAgICBjYXRjaCBlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuICAgIHJlc3VsdFxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IGNvbnRhaW5cIjogKGUpIC0+XG4gICAgICBAdHJpZ2dlciBcInNhdmVcIiwgQG1vZGVsLmdldEZpZWxkcygpXG4gICAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgc2V0U2V0dGluZ3M6IChzZXR0aW5ncykgLT5cbiAgICBkYXRhID0gW11cbiAgICBkYXRhID0gc2V0dGluZ3MuZGVmYXVsdERhdGEuc2xpY2UoKVxuICAgIHNldHRpbmdzLmRlZmF1bHREYXRhLnNsaWNlKCkubWFwIChpdGVtLCBpbmRleCkgLT4gaWYgKHR5cGVvZiBpdGVtLmNoZWNrZWQpID09IFwic3RyaW5nXCIgdGhlbiBkYXRhW2luZGV4XSA9IGl0ZW0uY2hlY2tlZCA9PSBcInRydWVcIiBlbHNlIGRhdGFbaW5kZXhdID0gaXRlbS5jaGVja2VkXG4gICAgQHNldCB7ZGF0YX1cblxuICB1cGRhdGU6IChpbmRleCwgY2hlY2tlZCkgLT5cbiAgICBkYXRhID0gQHN0YXRlLmRhdGEuc2xpY2UoKVxuICAgIGRhdGFbaW5kZXhdID0gY2hlY2tlZFxuICAgIEBzZXQge2RhdGF9XG5cbiAgZ2V0OiAtPiBAc3RhdGUuZGF0YVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBldmVudHM6XG4gICAgXCJjaGFuZ2U6IEBjaGVja2JveFwiOiAoZSkgLT5cbiAgICAgICRpbnB1dCA9ICQgZS50YXJnZXRcbiAgICAgIGluZGV4ID0gJGlucHV0LmRhdGEgXCJpbmRleFwiXG4gICAgICBAbW9kZWwudXBkYXRlIGluZGV4LCBlLnRhcmdldC5jaGVja2VkXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuUHJvbWlzZSA9IHJlcXVpcmUgXCJwcm9taXNlXCJcbmh0dHBGaWxlID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwRmlsZVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIHNldFByZXZpZXc6IChpbnB1dCkgLT5cbiAgICBAc2V0IHJlYWR5VG9TYXZlOiBmYWxzZVxuICAgIEBpbnB1dCA9IGlucHV0XG4gICAgaWYgaW5wdXQuZmlsZXM/XG4gICAgICBAc2V0IGZpbGVuYW1lOiBpbnB1dC5maWxlc1swXS5uYW1lXG4gICAgZWxzZVxuICAgICAgZmlsZW5hbWUgPSBpbnB1dC52YWx1ZS5zcGxpdCAvW1xcL1xcXFxdL1xuICAgICAgQHNldCBmaWxlbmFtZTogZmlsZW5hbWUucG9wKClcblxuICBzZXRJbnB1dDogKGlucHV0KSAtPlxuICAgIEBpbnB1dCA9IGlucHV0XG5cbiAgcmVtb3ZlUHJldmlldzogLT5cbiAgICBAc2V0IGZpbGVuYW1lOiBmYWxzZVxuICAgIEBzZXQgcmVhZHlUb1NhdmU6IGZhbHNlXG5cbiAgZ2V0OiAtPlxuICAgIGlmIEBzdGF0ZS5yZWFkeVRvU2F2ZVxuICAgICAgQHN0YXRlLnVwbG9hZGVkUGF0aFxuICAgIGVsc2VcbiAgICAgIGlmIEBpbnB1dCAmJiBAc3RhdGUuZmlsZW5hbWVcbiAgICAgICAgaHR0cEZpbGUgXCIvY21zL3R5cGVzL2ltYWdlL3VwbG9hZGltYWdlL19fanNvbi9cIixcbiAgICAgICAgICBpbWFnZTogQGlucHV0XG4gICAgICAgIC50aGVuIChyZXNwb25zZSkgPT5cbiAgICAgICAgICBAc2V0IHJlYWR5VG9TYXZlOiB0cnVlXG4gICAgICAgICAgQHNldCB1cGxvYWRlZFBhdGg6IHJlc3BvbnNlLmZpbGVuYW1lXG4gICAgICAgICAgcmVzcG9uc2UuZmlsZW5hbWVcbiAgICAgIGVsc2VcbiAgICAgICAgZmFsc2VcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxudGVtcGxhdGUgPSByZXF1aXJlIFwidHlwZXMvaW1hZ2UvaXRlbS50bXBsLmpzXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgZGVidWc6IHRydWVcblxuICBpbml0aWFsOiAtPlxuICAgIEB0ZW1wbGF0ZSA9IFJlbmRlciB0ZW1wbGF0ZSwgQGNvbnRhaW5bMF1cbiAgICBAbW9kZWwuc2V0SW5wdXQgQGNvbnRhaW4uZmluZChcIkBpbWFnZVwiKVswXVxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPlxuICAgIGlmICFzdGF0ZS5maWVsZC5zZXR0aW5ncy5oaWRlXG4gICAgICBAdGVtcGxhdGUgc3RhdGVcblxuICBldmVudHM6XG4gICAgXCJjaGFuZ2U6IEBpbWFnZVwiOiAoZSkgLT4gQG1vZGVsLnNldFByZXZpZXcgZS50YXJnZXRcbiAgICBcImNsaWNrOiBAcmVtb3ZlXCI6IChlKSAtPiBAbW9kZWwucmVtb3ZlUHJldmlldygpXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIHNldFNldHRpbmdzOiAoc2V0dGluZ3MpIC0+XG4gICAgQHNldCB2YWx1ZTogKyBzZXR0aW5ncy5kZWZhdWx0VmFsdWVcblxuICB1cGRhdGU6ICh2YWx1ZSkgLT5cbiAgICBAc2V0IHZhbHVlOiArIHZhbHVlXG5cbiAgZ2V0OiAtPiBAc3RhdGUudmFsdWVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgZXZlbnRzOlxuICAgIFwiY2hhbmdlOiBAcmFkaW9cIjogKGUpIC0+XG4gICAgICAkaW5wdXQgPSAkIGUudGFyZ2V0XG4gICAgICBAbW9kZWwudXBkYXRlICRpbnB1dC5kYXRhIFwiaW5kZXhcIlxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBzZXRTZXR0aW5nczogKHNldHRpbmdzKSAtPlxuICAgIEBzZXQgdmFsdWU6IHNldHRpbmdzLmRlZmF1bHRWYWx1ZVxuXG4gIHVwZGF0ZTogKHZhbHVlKSAtPlxuICAgIEBzZXQge3ZhbHVlfVxuXG4gIGdldDogLT4gQHN0YXRlLnZhbHVlXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGV2ZW50czpcbiAgICBcImNoYW5nZTogQHN0cmluZ1wiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZSBlLnRhcmdldC52YWx1ZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBzZXRTZXR0aW5nczogKHNldHRpbmdzKSAtPlxuICAgIEBzZXQgZGF0YTogc2V0dGluZ3MuZGVmYXVsdERhdGEuc2xpY2UoKVxuXG4gIHVwZGF0ZTogKHJvd0luZGV4LCBjb2x1bW5JbmRleCwgdmFsdWUpIC0+XG4gICAgZGF0YSA9IEBzdGF0ZS5kYXRhLnNsaWNlKClcbiAgICBkYXRhW3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSB2YWx1ZVxuICAgIEBzZXQge2RhdGF9XG5cbiAgZ2V0OiAtPiBAc3RhdGUuZGF0YVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBldmVudHM6XG4gICAgXCJjaGFuZ2U6IEBjZWxsXCI6IChlKSAtPlxuICAgICAgJGlucHV0ID0gJCBlLnRhcmdldFxuICAgICAgcm93SW5kZXggPSArICRpbnB1dC5kYXRhIFwicm93XCJcbiAgICAgIGNvbHVtbkluZGV4ID0gKyAkaW5wdXQuZGF0YSBcImNvbHVtblwiXG4gICAgICBAbW9kZWwudXBkYXRlIHJvd0luZGV4LCBjb2x1bW5JbmRleCwgZS50YXJnZXQudmFsdWVcbiIsIihmdW5jdGlvbiAoZmFjdG9yeSlcbntcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkZWZpbmUoJ2ZpcnN0LXRyeScsIFtdLCBmYWN0b3J5KCkpO1xuICB9XG4gIGVsc2Uge1xuICAgIHdpbmRvdy5pdGVtID0gZmFjdG9yeSgpO1xuICB9XG59KShmdW5jdGlvbiAoKVxue1xuICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgX2NyRWwgPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICB9O1xuICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ3RleHQnLCB0ZXh0OiBub2RlfTtcbiAgfTtcbiAgZnVuY3Rpb24gY291bnQoYXJyKVxuICB7XG4gICAgcmV0dXJuIGFyci5sZW5ndGg7XG4gIH1cbiAgZnVuY3Rpb24gbGVuZ3RoKHN0cilcbiAge1xuICAgIHJldHVybiBzdHIubGVuZ3RoO1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZSgpXG4gIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIHJvb3ROb2RlcyA9IFtdO1xuICAgICAgYXJndW1lbnRzWzBdKHJvb3ROb2Rlcyk7XG4gICAgICBpZiAocm9vdE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiByb290Tm9kZXMpIHtcbiAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChyb290Tm9kZXMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdzdHJpbmcnIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgcm9vdE5vZGVzW2luZGV4QXR0cl0gPSBfY3JUTihyb290Tm9kZXNbaW5kZXhBdHRyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcm9vdE5vZGVzO1xuICAgIH1cbiAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgIHZhciBwYXJlbnROb2RlO1xuICAgICAgdmFyIGluZGV4Tm9kZTtcbiAgICAgIHZhciBub2RlO1xuICAgICAgdmFyIGluZGV4QXR0cjtcbiAgICAgIHZhciBhdHRyO1xuICAgICAgdmFyIGF0dHJzID0gYXJndW1lbnRzWzFdO1xuICAgICAgYXJndW1lbnRzWzJdKG5vZGVzKTtcbiAgICAgIHBhcmVudE5vZGUgPSBfY3JFbChhcmd1bWVudHNbMF0pO1xuICAgICAgaWYgKGF0dHJzLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiBhdHRycykge1xuICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKGF0dHJzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICBhdHRyID0gYXR0cnNbaW5kZXhBdHRyXTtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgIG5hbWU6IGF0dHJbMF0sXG4gICAgICAgICAgICAgIHZhbHVlOiBhdHRyWzFdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoaW5kZXhOb2RlIGluIG5vZGVzKSB7XG4gICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKG5vZGVzLCBpbmRleE5vZGUpKSB7XG4gICAgICAgICAgbm9kZSA9IG5vZGVzW2luZGV4Tm9kZV07XG4gICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChfY3JUTihub2RlKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChub2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJlbnROb2RlO1xuICAgIH1cbiAgfVxuICB2YXIgY2FjaGVkVGVtcGxhdGVzID0ge307XG4gIGZ1bmN0aW9uIGNhY2hlUmVxdWlyZVRlbXBsYXRlKHBhdGgsIHJlcXVpcmVkKVxuICB7XG4gICAgY2FjaGVkVGVtcGxhdGVzW3BhdGhdID0gcmVxdWlyZWQ7XG4gIH1cbiAgZnVuY3Rpb24gcmVxdWlyZVRlbXBsYXRlKHBhdGgsIG9iailcbiAge1xuICAgIHJldHVybiBjYWNoZWRUZW1wbGF0ZXNbcGF0aF0ob2JqKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKG9iailcbiAge1xuICAgIHJldHVybiBjcmVhdGUoZnVuY3Rpb24gKGNoaWxkcylcbiAgICB7XG4gICAgICB3aXRoIChvYmopIHtcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2ZpbGUtd3JhcCc7XG4gICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICBpZiAoICEoISggdHlwZW9mIGZpbGVuYW1lICE9PSAndW5kZWZpbmVkJyA/IGZpbGVuYW1lIDogJycgKSkpIHtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2ZpbGUtY2xvc2UnO1xuICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICBhdHRyICs9ICdyZW1vdmUnO1xuICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ3NwYW4nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fZmlsZSc7XG4gICAgICAgICAgICAgICAgaWYgKCAhKCEoIHR5cGVvZiBmaWxlbmFtZSAhPT0gJ3VuZGVmaW5lZCcgPyBmaWxlbmFtZSA6ICcnICkpKSB7XG4gICAgICAgICAgICAgICAgICBhdHRyICs9ICcgZm9ybV9fZmlsZS0tY2hvb3Nlbic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCAhKCEoIHR5cGVvZiBmaWxlbmFtZSAhPT0gJ3VuZGVmaW5lZCcgPyBmaWxlbmFtZSA6ICcnICkpKSB7XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2ZpbGUtZmlsZW5hbWUnO1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdzcGFuJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2ZpbGUnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9IGZpZWxkWydhbGlhcyddO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnbmFtZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9IGZpZWxkWydhbGlhcyddO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2ltYWdlJztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59KTsiXX0=
