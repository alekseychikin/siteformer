(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, AddModel, AddView, Popup, fn, models, type, view, views;

AddModel = require("./addModel.coffee");

AddView = require("./addView.coffee");

$ = require("jquery-plugins.coffee");

models = {
  image: require("image/ConfigsImageModel.coffee")
};

views = {
  image: require("image/ConfigsImageView.coffee")
};

Popup = require("popup");

AddView.on("open-configs-modal", function(index, field) {
  Popup.open("@configs-" + field.type);
  views[field.type].bind($("@configs-" + field.type));
  field.settings.index = index;
  return models[field.type].bind(field.settings);
});

fn = function(type, view) {
  return view.on("save-configs-modal", function(form) {
    AddModel.saveFieldConfigs(form);
    return Popup.close();
  });
};
for (type in views) {
  view = views[type];
  fn(type, view);
}

AddModel.on("onSavedSection", function(alias) {
  console.log("qwe");
  return window.location.href = "/cms/configs/" + alias + "/";
});


},{"./addModel.coffee":2,"./addView.coffee":3,"image/ConfigsImageModel.coffee":4,"image/ConfigsImageView.coffee":5,"jquery-plugins.coffee":"jquery-plugins.coffee","popup":"popup"}],2:[function(require,module,exports){
var Model, Promise, httpGet, httpPost;

Model = require("model.coffee");

Promise = require("q");

httpGet = (require("ajax.coffee")).httpGet;

httpPost = (require("ajax.coffee")).httpPost;

module.exports = Model("ConfigsAddModel", {
  initialState: function() {
    return httpGet(window.location.pathname + "__json/").then(function(response) {
      var state;
      state = {
        title: response.title,
        alias: response.alias,
        module: response.module,
        fields: response.fields,
        types: response.types
      };
      if (response.id) {
        state.id = response.id;
      }
      console.log(state);
      return state;
    });
  },
  addField: function(field) {
    return this.set({
      fields: this.state.fields.concat([field])
    });
  },
  addEmptyField: function() {
    return this.set({
      fields: this.state.fields.concat([
        {
          title: "",
          alias: "",
          type: "string"
        }
      ])
    });
  },
  updateTitle: function(value) {
    return this.state.title = value;
  },
  updateAlias: function(value) {
    return this.state.alias = value;
  },
  updateModule: function(value) {
    return this.state.module = value;
  },
  updateFieldTitle: function(index, value) {
    return this.state.fields[index].title = value;
  },
  updateFieldAlias: function(index, value) {
    return this.state.fields[index].alias = value;
  },
  updateFieldType: function(index, value) {
    this.state.fields[index].type = value;
    this.resetSettings(index);
    return this.set({
      fields: this.state.fields
    });
  },
  resetSettings: function(index) {
    var i, len, ref, results, type, typeItem;
    type = this.state.fields[index].type;
    ref = this.state.types;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      typeItem = ref[i];
      if (typeItem.alias === type) {
        results.push(this.state.fields[index].settings = this.clone(typeItem.defaultSettings));
      } else {
        results.push(void 0);
      }
    }
    return results;
  },
  removeField: function(index) {
    this.state.fields.splice(index, 1);
    return this.set({
      fields: this.state.fields
    });
  },
  getFieldByIndex: function(index) {
    return this.clone(this.state.fields[index]);
  },
  saveFieldConfigs: function(form) {
    var index;
    index = form.index;
    delete form.index;
    return this.state.fields[index].settings = form;
  },
  save: function() {
    return httpPost("/cms/configs/save/__json/", this.state).then((function(_this) {
      return function(response) {
        if (_this.state.id != null) {
          _this.set({
            fields: response.section.fields
          });
          return _this.set({
            id: response.section.id
          });
        } else {
          return _this.trigger("onSavedSection", _this.state.alias);
        }
      };
    })(this))["catch"](function(response) {
      return console.error(response.error);
    });
  }
});


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee","q":"q"}],3:[function(require,module,exports){
var $, AddModel, Popup, Render, View;

$ = require("jquery-plugins.coffee");

View = require("view.coffee");

Render = require("render.coffee");

Popup = require("popup");

AddModel = require("./addModel.coffee");

module.exports = View("ConfigsAddView", {
  debug: false,
  contain: $("@configs-add"),
  model: AddModel,
  events: {
    "click: @btn-remove-field": function(e) {
      return AddModel.removeField(this.getRowIndex(e));
    },
    "click: @btn-add-field": function(e) {
      return AddModel.addEmptyField();
    },
    "change: @field-title": function(e) {
      return AddModel.updateFieldTitle(this.getRowIndex(e), e.target.value);
    },
    "change: @field-alias": function(e) {
      return AddModel.updateFieldAlias(this.getRowIndex(e), e.target.value);
    },
    "change: @field-type": function(e) {
      return AddModel.updateFieldType(this.getRowIndex(e), e.target.value);
    },
    "change: @configs-add-title": function(e) {
      return AddModel.updateTitle(e.target.value);
    },
    "change: @configs-add-alias": function(e) {
      return AddModel.updateAlias(e.target.value);
    },
    "change: @configs-add-module": function(e) {
      return AddModel.updateModule(e.target.value);
    },
    "click: @btn-config-field": "clickBtnConfigField",
    "submit: @configs-add-form": "submitConfigsAddForm"
  },
  initial: function() {
    return this.tbodyContain = Render($("@tbody-module-fields"), "sections_configs_table-module-fields");
  },
  renderFields: function(state) {
    this.tbodyContain.render(state);
    return $('select').selecter();
  },
  getRowIndex: function(e) {
    var $parent;
    $parent = ($(e.target)).closest("[data-key]");
    return $parent.data("key");
  },
  clickBtnConfigField: function(e) {
    return this.trigger("open-configs-modal", this.getRowIndex(e), AddModel.getFieldByIndex(this.getRowIndex(e)));
  },
  submitConfigsAddForm: function(e) {
    AddModel.save();
    return false;
  }
});


},{"./addModel.coffee":2,"jquery-plugins.coffee":"jquery-plugins.coffee","popup":"popup","render.coffee":"render.coffee","view.coffee":"view.coffee"}],4:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeImageModel", {
  changePath: function(path) {
    return this.state.path = path;
  },
  changeSizeWidth: function(width) {
    return this.state.width = width;
  },
  changeSizeHeight: function(height) {
    return this.state.height = height;
  },
  changeSource: function(source) {
    return this.state.source = source;
  },
  updatePath: function(value) {
    return this.state.path = value;
  },
  updateWidth: function(value) {
    return this.state.width = value;
  },
  updateHeight: function(value) {
    return this.state.height = value;
  },
  updateSource: function(value) {
    return this.state.source = value;
  },
  getState: function() {
    return this.state;
  }
});


},{"model.coffee":"model.coffee"}],5:[function(require,module,exports){
var View, configsImageModel;

View = require("view.coffee");

configsImageModel = require("image/configsImageModel.coffee");

module.exports = View("TypeImageView", {
  model: configsImageModel,
  debug: false,
  initial: function() {
    this.configsImagePath = this.contain.find("@configs-image-path");
    this.configsImageSource = this.contain.find("@configs-image-source");
    this.configsImageWidth = this.contain.find("@configs-image-width");
    this.configsImageHeight = this.contain.find("@configs-image-height");
    return this.configsImageIndex = this.contain.find("@configs-image-index");
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-image-path": function(e) {
      return configsImageModel.updatePath(e.target.value);
    },
    "change: @configs-image-width": function(e) {
      return configsImageModel.updateWidth(e.target.value);
    },
    "change: @configs-image-height": function(e) {
      return configsImageModel.updateHeight(e.target.value);
    },
    "change: @configs-image-source": function(e) {
      return configsImageModel.updateSource(e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.unbind();
    }
  },
  initialRender: function(state) {
    this.configsImagePath.val(state.path);
    this.configsImageWidth.val(state.width);
    this.configsImageHeight.val(state.height);
    return this.configsImageSource.val(state.source);
  },
  submitConfigsForm: function(e) {
    console.log(configsImageModel.getState());
    this.trigger("save-configs-modal", configsImageModel.getState());
    this.unbind();
    return false;
  }
});


},{"image/configsImageModel.coffee":6,"view.coffee":"view.coffee"}],6:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeImageModel", {
  changePath: function(path) {
    return this.state.path = path;
  },
  changeSizeWidth: function(width) {
    return this.state.width = width;
  },
  changeSizeHeight: function(height) {
    return this.state.height = height;
  },
  changeSource: function(source) {
    return this.state.source = source;
  },
  updatePath: function(value) {
    return this.state.path = value;
  },
  updateWidth: function(value) {
    return this.state.width = value;
  },
  updateHeight: function(value) {
    return this.state.height = value;
  },
  updateSource: function(value) {
    return this.state.source = value;
  },
  getState: function() {
    return this.state;
  }
});


},{"model.coffee":"model.coffee"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvc2VjdGlvbnMvY29uZmlncy9hZGRNb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkVmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2ltYWdlL0NvbmZpZ3NJbWFnZU1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvaW1hZ2UvQ29uZmlnc0ltYWdlVmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2ltYWdlL2NvbmZpZ3NJbWFnZU1vZGVsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxtQkFBUjs7QUFDWCxPQUFBLEdBQVUsT0FBQSxDQUFRLGtCQUFSOztBQUNWLENBQUEsR0FBSSxPQUFBLENBQVEsdUJBQVI7O0FBRUosTUFBQSxHQUNFO0VBQUEsS0FBQSxFQUFPLE9BQUEsQ0FBUSxnQ0FBUixDQUFQOzs7QUFFRixLQUFBLEdBQ0U7RUFB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QyxLQUFEO1dBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLEdBQWdCO0VBQTNCLENBVmQ7RUFZQSxZQUFBLEVBQWMsU0FBQyxLQUFEO1dBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLEdBQWdCO0VBQTNCLENBWmQ7RUFjQSxRQUFBLEVBQVUsU0FBQTtXQUFHLElBQUMsQ0FBQTtFQUFKLENBZFY7Q0FEZSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJBZGRNb2RlbCA9IHJlcXVpcmUgXCIuL2FkZE1vZGVsLmNvZmZlZVwiXG5BZGRWaWV3ID0gcmVxdWlyZSBcIi4vYWRkVmlldy5jb2ZmZWVcIlxuJCA9IHJlcXVpcmUgXCJqcXVlcnktcGx1Z2lucy5jb2ZmZWVcIlxuXG5tb2RlbHMgPVxuICBpbWFnZTogcmVxdWlyZSBcImltYWdlL0NvbmZpZ3NJbWFnZU1vZGVsLmNvZmZlZVwiXG5cbnZpZXdzID1cbiAgaW1hZ2U6IHJlcXVpcmUgXCJpbWFnZS9Db25maWdzSW1hZ2VWaWV3LmNvZmZlZVwiXG5cblBvcHVwID0gcmVxdWlyZSBcInBvcHVwXCJcblxuQWRkVmlldy5vbiBcIm9wZW4tY29uZmlncy1tb2RhbFwiLCAoaW5kZXgsIGZpZWxkKSAtPlxuICBQb3B1cC5vcGVuIFwiQGNvbmZpZ3MtI3tmaWVsZC50eXBlfVwiXG4gIHZpZXdzW2ZpZWxkLnR5cGVdLmJpbmQgKCQgXCJAY29uZmlncy0je2ZpZWxkLnR5cGV9XCIpXG5cbiAgZmllbGQuc2V0dGluZ3MuaW5kZXggPSBpbmRleFxuICBtb2RlbHNbZmllbGQudHlwZV0uYmluZCBmaWVsZC5zZXR0aW5nc1xuXG5mb3IgdHlwZSwgdmlldyBvZiB2aWV3c1xuICBkbyAodHlwZSwgdmlldykgLT5cbiAgICB2aWV3Lm9uIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIChmb3JtKSAtPlxuICAgICAgQWRkTW9kZWwuc2F2ZUZpZWxkQ29uZmlncyBmb3JtXG4gICAgICBQb3B1cC5jbG9zZSgpXG5cbkFkZE1vZGVsLm9uIFwib25TYXZlZFNlY3Rpb25cIiwgKGFsaWFzKSAtPlxuICBjb25zb2xlLmxvZyBcInF3ZVwiXG4gIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvY21zL2NvbmZpZ3MvI3thbGlhc30vXCJcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5Qcm9taXNlID0gcmVxdWlyZSBcInFcIlxuaHR0cEdldCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cEdldFxuaHR0cFBvc3QgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBQb3N0XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJDb25maWdzQWRkTW9kZWxcIixcbiAgaW5pdGlhbFN0YXRlOiAtPlxuICAgIGh0dHBHZXQgXCIje3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZX1fX2pzb24vXCJcbiAgICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgICAgc3RhdGUgPVxuICAgICAgICAgIHRpdGxlOiByZXNwb25zZS50aXRsZVxuICAgICAgICAgIGFsaWFzOiByZXNwb25zZS5hbGlhc1xuICAgICAgICAgIG1vZHVsZTogcmVzcG9uc2UubW9kdWxlXG4gICAgICAgICAgZmllbGRzOiByZXNwb25zZS5maWVsZHNcbiAgICAgICAgICB0eXBlczogcmVzcG9uc2UudHlwZXNcbiAgICAgICAgaWYgcmVzcG9uc2UuaWRcbiAgICAgICAgICBzdGF0ZS5pZCA9IHJlc3BvbnNlLmlkXG4gICAgICAgIGNvbnNvbGUubG9nIHN0YXRlXG4gICAgICAgIHN0YXRlXG5cbiAgYWRkRmllbGQ6IChmaWVsZCkgLT5cbiAgICBAc2V0IGZpZWxkczogQHN0YXRlLmZpZWxkcy5jb25jYXQgW2ZpZWxkXVxuXG4gIGFkZEVtcHR5RmllbGQ6IC0+XG4gICAgQHNldCBmaWVsZHM6IEBzdGF0ZS5maWVsZHMuY29uY2F0IFtcbiAgICAgIHRpdGxlOiBcIlwiXG4gICAgICBhbGlhczogXCJcIlxuICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIF1cblxuICB1cGRhdGVUaXRsZTogKHZhbHVlKSAtPiBAc3RhdGUudGl0bGUgPSB2YWx1ZVxuICB1cGRhdGVBbGlhczogKHZhbHVlKSAtPiBAc3RhdGUuYWxpYXMgPSB2YWx1ZVxuICB1cGRhdGVNb2R1bGU6ICh2YWx1ZSkgLT4gQHN0YXRlLm1vZHVsZSA9IHZhbHVlXG5cbiAgdXBkYXRlRmllbGRUaXRsZTogKGluZGV4LCB2YWx1ZSkgLT4gQHN0YXRlLmZpZWxkc1tpbmRleF0udGl0bGUgPSB2YWx1ZVxuICB1cGRhdGVGaWVsZEFsaWFzOiAoaW5kZXgsIHZhbHVlKSAtPiBAc3RhdGUuZmllbGRzW2luZGV4XS5hbGlhcyA9IHZhbHVlXG4gIHVwZGF0ZUZpZWxkVHlwZTogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBAc3RhdGUuZmllbGRzW2luZGV4XS50eXBlID0gdmFsdWVcbiAgICBAcmVzZXRTZXR0aW5ncyBpbmRleFxuICAgIEBzZXQgZmllbGRzOiBAc3RhdGUuZmllbGRzXG5cbiAgcmVzZXRTZXR0aW5nczogKGluZGV4KSAtPlxuICAgIHR5cGUgPSBAc3RhdGUuZmllbGRzW2luZGV4XS50eXBlXG4gICAgZm9yIHR5cGVJdGVtIGluIEBzdGF0ZS50eXBlc1xuICAgICAgaWYgdHlwZUl0ZW0uYWxpYXMgPT0gdHlwZVxuICAgICAgICBAc3RhdGUuZmllbGRzW2luZGV4XS5zZXR0aW5ncyA9IEBjbG9uZSB0eXBlSXRlbS5kZWZhdWx0U2V0dGluZ3NcblxuICByZW1vdmVGaWVsZDogKGluZGV4KSAtPlxuICAgIEBzdGF0ZS5maWVsZHMuc3BsaWNlIGluZGV4LCAxXG4gICAgQHNldCBmaWVsZHM6IEBzdGF0ZS5maWVsZHNcblxuICBnZXRGaWVsZEJ5SW5kZXg6IChpbmRleCkgLT4gQGNsb25lIEBzdGF0ZS5maWVsZHNbaW5kZXhdXG5cbiAgc2F2ZUZpZWxkQ29uZmlnczogKGZvcm0pIC0+XG4gICAgaW5kZXggPSBmb3JtLmluZGV4XG4gICAgZGVsZXRlIGZvcm0uaW5kZXhcbiAgICBAc3RhdGUuZmllbGRzW2luZGV4XS5zZXR0aW5ncyA9IGZvcm1cblxuICBzYXZlOiAtPlxuICAgIGh0dHBQb3N0IFwiL2Ntcy9jb25maWdzL3NhdmUvX19qc29uL1wiLCBAc3RhdGVcbiAgICAgIC50aGVuIChyZXNwb25zZSkgPT5cbiAgICAgICAgaWYgQHN0YXRlLmlkP1xuICAgICAgICAgIEBzZXQgZmllbGRzOiByZXNwb25zZS5zZWN0aW9uLmZpZWxkc1xuICAgICAgICAgIEBzZXQgaWQ6IHJlc3BvbnNlLnNlY3Rpb24uaWRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEB0cmlnZ2VyIFwib25TYXZlZFNlY3Rpb25cIiwgQHN0YXRlLmFsaWFzXG4gICAgICAuY2F0Y2ggKHJlc3BvbnNlKSAtPlxuICAgICAgICBjb25zb2xlLmVycm9yIHJlc3BvbnNlLmVycm9yXG4iLCIkID0gcmVxdWlyZSBcImpxdWVyeS1wbHVnaW5zLmNvZmZlZVwiXG5WaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXIuY29mZmVlXCJcblBvcHVwID0gcmVxdWlyZSBcInBvcHVwXCJcbkFkZE1vZGVsID0gcmVxdWlyZSBcIi4vYWRkTW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3IFwiQ29uZmlnc0FkZFZpZXdcIixcbiAgZGVidWc6IGZhbHNlXG4gIGNvbnRhaW46ICQgXCJAY29uZmlncy1hZGRcIlxuICBtb2RlbDogQWRkTW9kZWxcbiAgZXZlbnRzOlxuICAgIFwiY2xpY2s6IEBidG4tcmVtb3ZlLWZpZWxkXCI6IChlKSAtPiBBZGRNb2RlbC5yZW1vdmVGaWVsZCBAZ2V0Um93SW5kZXggZVxuICAgIFwiY2xpY2s6IEBidG4tYWRkLWZpZWxkXCI6IChlKSAtPiBBZGRNb2RlbC5hZGRFbXB0eUZpZWxkKClcbiAgICBcImNoYW5nZTogQGZpZWxkLXRpdGxlXCI6IChlKSAtPiBBZGRNb2RlbC51cGRhdGVGaWVsZFRpdGxlIChAZ2V0Um93SW5kZXggZSksIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBmaWVsZC1hbGlhc1wiOiAoZSkgLT4gQWRkTW9kZWwudXBkYXRlRmllbGRBbGlhcyAoQGdldFJvd0luZGV4IGUpLCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAZmllbGQtdHlwZVwiOiAoZSkgLT4gQWRkTW9kZWwudXBkYXRlRmllbGRUeXBlIChAZ2V0Um93SW5kZXggZSksIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWFkZC10aXRsZVwiOiAoZSkgLT4gQWRkTW9kZWwudXBkYXRlVGl0bGUgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtYWRkLWFsaWFzXCI6IChlKSAtPiBBZGRNb2RlbC51cGRhdGVBbGlhcyBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1hZGQtbW9kdWxlXCI6IChlKSAtPiBBZGRNb2RlbC51cGRhdGVNb2R1bGUgZS50YXJnZXQudmFsdWVcbiAgICBcImNsaWNrOiBAYnRuLWNvbmZpZy1maWVsZFwiOiBcImNsaWNrQnRuQ29uZmlnRmllbGRcIlxuICAgIFwic3VibWl0OiBAY29uZmlncy1hZGQtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NBZGRGb3JtXCJcblxuICBpbml0aWFsOiAtPlxuICAgIEB0Ym9keUNvbnRhaW4gPSBSZW5kZXIgKCQgXCJAdGJvZHktbW9kdWxlLWZpZWxkc1wiKSwgXCJzZWN0aW9uc19jb25maWdzX3RhYmxlLW1vZHVsZS1maWVsZHNcIlxuXG4gIHJlbmRlckZpZWxkczogKHN0YXRlKSAtPlxuICAgIEB0Ym9keUNvbnRhaW4ucmVuZGVyIHN0YXRlXG4gICAgJCgnc2VsZWN0Jykuc2VsZWN0ZXIoKVxuXG4gIGdldFJvd0luZGV4OiAoZSkgLT5cbiAgICAkcGFyZW50ID0gKCQgZS50YXJnZXQpLmNsb3Nlc3QgXCJbZGF0YS1rZXldXCJcbiAgICByZXR1cm4gJHBhcmVudC5kYXRhIFwia2V5XCJcblxuICBjbGlja0J0bkNvbmZpZ0ZpZWxkOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcIm9wZW4tY29uZmlncy1tb2RhbFwiLFxuICAgICAgQGdldFJvd0luZGV4IGVcbiAgICAgIEFkZE1vZGVsLmdldEZpZWxkQnlJbmRleCBAZ2V0Um93SW5kZXggZVxuXG4gIHN1Ym1pdENvbmZpZ3NBZGRGb3JtOiAoZSkgLT5cbiAgICBBZGRNb2RlbC5zYXZlKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlSW1hZ2VNb2RlbFwiLFxuICBjaGFuZ2VQYXRoOiAocGF0aCkgLT4gQHN0YXRlLnBhdGggPSBwYXRoXG5cbiAgY2hhbmdlU2l6ZVdpZHRoOiAod2lkdGgpIC0+IEBzdGF0ZS53aWR0aCA9IHdpZHRoXG4gIGNoYW5nZVNpemVIZWlnaHQ6IChoZWlnaHQpIC0+IEBzdGF0ZS5oZWlnaHQgPSBoZWlnaHRcblxuICBjaGFuZ2VTb3VyY2U6IChzb3VyY2UpIC0+IEBzdGF0ZS5zb3VyY2UgPSBzb3VyY2VcblxuICB1cGRhdGVQYXRoOiAodmFsdWUpIC0+IEBzdGF0ZS5wYXRoID0gdmFsdWVcblxuICB1cGRhdGVXaWR0aDogKHZhbHVlKSAtPiBAc3RhdGUud2lkdGggPSB2YWx1ZVxuICB1cGRhdGVIZWlnaHQ6ICh2YWx1ZSkgLT4gQHN0YXRlLmhlaWdodCA9IHZhbHVlXG5cbiAgdXBkYXRlU291cmNlOiAodmFsdWUpIC0+IEBzdGF0ZS5zb3VyY2UgPSB2YWx1ZVxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuY29uZmlnc0ltYWdlTW9kZWwgPSByZXF1aXJlIFwiaW1hZ2UvY29uZmlnc0ltYWdlTW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3IFwiVHlwZUltYWdlVmlld1wiLFxuICBtb2RlbDogY29uZmlnc0ltYWdlTW9kZWxcbiAgZGVidWc6IGZhbHNlXG5cbiAgaW5pdGlhbDogLT5cbiAgICBAY29uZmlnc0ltYWdlUGF0aCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1pbWFnZS1wYXRoXCJcbiAgICBAY29uZmlnc0ltYWdlU291cmNlID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLXNvdXJjZVwiXG4gICAgQGNvbmZpZ3NJbWFnZVdpZHRoID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLXdpZHRoXCJcbiAgICBAY29uZmlnc0ltYWdlSGVpZ2h0ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLWhlaWdodFwiXG4gICAgQGNvbmZpZ3NJbWFnZUluZGV4ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLWluZGV4XCJcblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXBhdGhcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVBhdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2Utd2lkdGhcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVdpZHRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLWhlaWdodFwiOiAoZSkgLT4gY29uZmlnc0ltYWdlTW9kZWwudXBkYXRlSGVpZ2h0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXNvdXJjZVwiOiAoZSkgLT4gY29uZmlnc0ltYWdlTW9kZWwudXBkYXRlU291cmNlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQHVuYmluZCgpXG5cbiAgaW5pdGlhbFJlbmRlcjogKHN0YXRlKSAtPlxuICAgIEBjb25maWdzSW1hZ2VQYXRoLnZhbCBzdGF0ZS5wYXRoXG4gICAgQGNvbmZpZ3NJbWFnZVdpZHRoLnZhbCBzdGF0ZS53aWR0aFxuICAgIEBjb25maWdzSW1hZ2VIZWlnaHQudmFsIHN0YXRlLmhlaWdodFxuICAgIEBjb25maWdzSW1hZ2VTb3VyY2UudmFsIHN0YXRlLnNvdXJjZVxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBjb25zb2xlLmxvZyBjb25maWdzSW1hZ2VNb2RlbC5nZXRTdGF0ZSgpXG4gICAgQHRyaWdnZXIgXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgY29uZmlnc0ltYWdlTW9kZWwuZ2V0U3RhdGUoKVxuICAgIEB1bmJpbmQoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIlR5cGVJbWFnZU1vZGVsXCIsXG4gIGNoYW5nZVBhdGg6IChwYXRoKSAtPiBAc3RhdGUucGF0aCA9IHBhdGhcblxuICBjaGFuZ2VTaXplV2lkdGg6ICh3aWR0aCkgLT4gQHN0YXRlLndpZHRoID0gd2lkdGhcbiAgY2hhbmdlU2l6ZUhlaWdodDogKGhlaWdodCkgLT4gQHN0YXRlLmhlaWdodCA9IGhlaWdodFxuXG4gIGNoYW5nZVNvdXJjZTogKHNvdXJjZSkgLT4gQHN0YXRlLnNvdXJjZSA9IHNvdXJjZVxuXG4gIHVwZGF0ZVBhdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLnBhdGggPSB2YWx1ZVxuXG4gIHVwZGF0ZVdpZHRoOiAodmFsdWUpIC0+IEBzdGF0ZS53aWR0aCA9IHZhbHVlXG4gIHVwZGF0ZUhlaWdodDogKHZhbHVlKSAtPiBAc3RhdGUuaGVpZ2h0ID0gdmFsdWVcblxuICB1cGRhdGVTb3VyY2U6ICh2YWx1ZSkgLT4gQHN0YXRlLnNvdXJjZSA9IHZhbHVlXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuIl19
