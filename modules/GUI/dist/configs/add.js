(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, AddModal, AddView, Popup, fn, models, type, view, views;

AddModal = require("./addModel.coffee");

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
    AddModal.saveFieldConfigs(form);
    return Popup.close();
  });
};
for (type in views) {
  view = views[type];
  fn(type, view);
}


},{"./addModel.coffee":2,"./addView.coffee":3,"image/ConfigsImageModel.coffee":4,"image/ConfigsImageView.coffee":5,"jquery-plugins.coffee":"jquery-plugins.coffee","popup":"popup"}],2:[function(require,module,exports){
var Model, Promise, httpGet, httpPost;

Model = require("model.coffee");

Promise = require("q");

httpGet = (require("ajax.coffee")).httpGet;

httpPost = (require("ajax.coffee")).httpPost;

module.exports = Model("ConfigsAddModel", {
  initialState: function() {
    return httpGet("/cms/configs/add/__json/").then(function(response) {
      return {
        title: response.title,
        alias: response.alias,
        module: response.module,
        fields: response.fields,
        types: response.types
      };
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
    return httpPost("/cms/configs/save/", this.state).then(function(response) {
      return console.log(response);
    })["catch"](function(response) {
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
    this.configsImageIndex.val(state.index);
    this.configsImagePath.val(state.path);
    this.configsImageWidth.val(state.width);
    this.configsImageHeight.val(state.height);
    return this.configsImageSource.val(state.source);
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", $(e.target).serializeObject());
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
  }
});


},{"model.coffee":"model.coffee"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvc2VjdGlvbnMvY29uZmlncy9hZGRNb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkVmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2ltYWdlL0NvbmZpZ3NJbWFnZU1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvaW1hZ2UvQ29uZmlnc0ltYWdlVmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2ltYWdlL2NvbmZpZ3NJbWFnZU1vZGVsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxtQkFBUjs7QUFDWCxPQUFBLEdBQVUsT0FBQSxDQUFRLGtCQUFSOztBQUNWLENBQUEsR0FBSSxPQUFBLENBQVEsdUJBQVI7O0FBRUosTUFBQSxHQUNFO0VBQUEsS0FBQSxFQUFPLE9BQUEsQ0FBUSxnQ0FBUixDQUFQOzs7QUFFRixLQUFBLEdBQ0U7RUFB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Q0FGakI7RUFHQSxnQkFBQSxFQUFrQixTQUFDLE1BQUQ7V0FBWSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsR0FBZ0I7RUFBNUIsQ0FIbEI7RUFLQSxZQUFBLEVBQWMsU0FBQyxNQUFEO1dBQVksSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLEdBQWdCO0VBQTVCLENBTGQ7RUFPQSxVQUFBLEVBQVksU0FBQyxLQUFEO1dBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLEdBQWM7RUFBekIsQ0FQWjtFQVNBLFdBQUEsRUFBYSxTQUFDLEtBQUQ7V0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsR0FBZTtFQUExQixDQVRiO0VBVUEsWUFBQSxFQUFjLFNBQUMsS0FBRDtXQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxHQUFnQjtFQUEzQixDQVZkO0VBWUEsWUFBQSxFQUFjLFNBQUMsS0FBRDtXQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxHQUFnQjtFQUEzQixDQVpkO0NBRGUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiQWRkTW9kYWwgPSByZXF1aXJlIFwiLi9hZGRNb2RlbC5jb2ZmZWVcIlxuQWRkVmlldyA9IHJlcXVpcmUgXCIuL2FkZFZpZXcuY29mZmVlXCJcbiQgPSByZXF1aXJlIFwianF1ZXJ5LXBsdWdpbnMuY29mZmVlXCJcblxubW9kZWxzID1cbiAgaW1hZ2U6IHJlcXVpcmUgXCJpbWFnZS9Db25maWdzSW1hZ2VNb2RlbC5jb2ZmZWVcIlxuXG52aWV3cyA9XG4gIGltYWdlOiByZXF1aXJlIFwiaW1hZ2UvQ29uZmlnc0ltYWdlVmlldy5jb2ZmZWVcIlxuXG5Qb3B1cCA9IHJlcXVpcmUgXCJwb3B1cFwiXG5cbkFkZFZpZXcub24gXCJvcGVuLWNvbmZpZ3MtbW9kYWxcIiwgKGluZGV4LCBmaWVsZCkgLT5cbiAgUG9wdXAub3BlbiBcIkBjb25maWdzLSN7ZmllbGQudHlwZX1cIlxuICB2aWV3c1tmaWVsZC50eXBlXS5iaW5kICgkIFwiQGNvbmZpZ3MtI3tmaWVsZC50eXBlfVwiKVxuXG4gIGZpZWxkLnNldHRpbmdzLmluZGV4ID0gaW5kZXhcbiAgbW9kZWxzW2ZpZWxkLnR5cGVdLmJpbmQgZmllbGQuc2V0dGluZ3NcblxuZm9yIHR5cGUsIHZpZXcgb2Ygdmlld3NcbiAgZG8gKHR5cGUsIHZpZXcpIC0+XG4gICAgdmlldy5vbiBcInNhdmUtY29uZmlncy1tb2RhbFwiLCAoZm9ybSkgLT5cbiAgICAgIEFkZE1vZGFsLnNhdmVGaWVsZENvbmZpZ3MgZm9ybVxuICAgICAgUG9wdXAuY2xvc2UoKVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblByb21pc2UgPSByZXF1aXJlIFwicVwiXG5odHRwR2V0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwR2V0XG5odHRwUG9zdCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cFBvc3RcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIkNvbmZpZ3NBZGRNb2RlbFwiLFxuICBpbml0aWFsU3RhdGU6IC0+XG4gICAgaHR0cEdldCBcIi9jbXMvY29uZmlncy9hZGQvX19qc29uL1wiXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgIHRpdGxlOiByZXNwb25zZS50aXRsZVxuICAgICAgICBhbGlhczogcmVzcG9uc2UuYWxpYXNcbiAgICAgICAgbW9kdWxlOiByZXNwb25zZS5tb2R1bGVcbiAgICAgICAgZmllbGRzOiByZXNwb25zZS5maWVsZHNcbiAgICAgICAgdHlwZXM6IHJlc3BvbnNlLnR5cGVzXG5cbiAgYWRkRmllbGQ6IChmaWVsZCkgLT5cbiAgICBAc2V0IGZpZWxkczogQHN0YXRlLmZpZWxkcy5jb25jYXQgW2ZpZWxkXVxuXG4gIGFkZEVtcHR5RmllbGQ6IC0+XG4gICAgQHNldCBmaWVsZHM6IEBzdGF0ZS5maWVsZHMuY29uY2F0IFtcbiAgICAgIHRpdGxlOiBcIlwiXG4gICAgICBhbGlhczogXCJcIlxuICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIF1cblxuICB1cGRhdGVUaXRsZTogKHZhbHVlKSAtPiBAc3RhdGUudGl0bGUgPSB2YWx1ZVxuICB1cGRhdGVBbGlhczogKHZhbHVlKSAtPiBAc3RhdGUuYWxpYXMgPSB2YWx1ZVxuICB1cGRhdGVNb2R1bGU6ICh2YWx1ZSkgLT4gQHN0YXRlLm1vZHVsZSA9IHZhbHVlXG5cbiAgdXBkYXRlRmllbGRUaXRsZTogKGluZGV4LCB2YWx1ZSkgLT4gQHN0YXRlLmZpZWxkc1tpbmRleF0udGl0bGUgPSB2YWx1ZVxuICB1cGRhdGVGaWVsZEFsaWFzOiAoaW5kZXgsIHZhbHVlKSAtPiBAc3RhdGUuZmllbGRzW2luZGV4XS5hbGlhcyA9IHZhbHVlXG4gIHVwZGF0ZUZpZWxkVHlwZTogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBAc3RhdGUuZmllbGRzW2luZGV4XS50eXBlID0gdmFsdWVcbiAgICBAcmVzZXRTZXR0aW5ncyBpbmRleFxuICAgIEBzZXQgZmllbGRzOiBAc3RhdGUuZmllbGRzXG5cbiAgcmVzZXRTZXR0aW5nczogKGluZGV4KSAtPlxuICAgIHR5cGUgPSBAc3RhdGUuZmllbGRzW2luZGV4XS50eXBlXG4gICAgZm9yIHR5cGVJdGVtIGluIEBzdGF0ZS50eXBlc1xuICAgICAgaWYgdHlwZUl0ZW0uYWxpYXMgPT0gdHlwZVxuICAgICAgICBAc3RhdGUuZmllbGRzW2luZGV4XS5zZXR0aW5ncyA9IEBjbG9uZSB0eXBlSXRlbS5kZWZhdWx0U2V0dGluZ3NcblxuICByZW1vdmVGaWVsZDogKGluZGV4KSAtPlxuICAgIEBzdGF0ZS5maWVsZHMuc3BsaWNlIGluZGV4LCAxXG4gICAgQHNldCBmaWVsZHM6IEBzdGF0ZS5maWVsZHNcblxuICBnZXRGaWVsZEJ5SW5kZXg6IChpbmRleCkgLT4gQGNsb25lIEBzdGF0ZS5maWVsZHNbaW5kZXhdXG5cbiAgc2F2ZUZpZWxkQ29uZmlnczogKGZvcm0pIC0+XG4gICAgaW5kZXggPSBmb3JtLmluZGV4XG4gICAgZGVsZXRlIGZvcm0uaW5kZXhcbiAgICBAc3RhdGUuZmllbGRzW2luZGV4XS5zZXR0aW5ncyA9IGZvcm1cblxuICBzYXZlOiAtPlxuICAgIGh0dHBQb3N0IFwiL2Ntcy9jb25maWdzL3NhdmUvXCIsIEBzdGF0ZVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICBjb25zb2xlLmxvZyByZXNwb25zZVxuICAgICAgLmNhdGNoIChyZXNwb25zZSkgLT5cbiAgICAgICAgY29uc29sZS5lcnJvciByZXNwb25zZS5lcnJvclxuIiwiJCA9IHJlcXVpcmUgXCJqcXVlcnktcGx1Z2lucy5jb2ZmZWVcIlxuVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyLmNvZmZlZVwiXG5Qb3B1cCA9IHJlcXVpcmUgXCJwb3B1cFwiXG5BZGRNb2RlbCA9IHJlcXVpcmUgXCIuL2FkZE1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlldyBcIkNvbmZpZ3NBZGRWaWV3XCIsXG4gIGRlYnVnOiBmYWxzZVxuICBjb250YWluOiAkIFwiQGNvbmZpZ3MtYWRkXCJcbiAgbW9kZWw6IEFkZE1vZGVsXG4gIGV2ZW50czpcbiAgICBcImNsaWNrOiBAYnRuLXJlbW92ZS1maWVsZFwiOiAoZSkgLT4gQWRkTW9kZWwucmVtb3ZlRmllbGQgQGdldFJvd0luZGV4IGVcbiAgICBcImNsaWNrOiBAYnRuLWFkZC1maWVsZFwiOiAoZSkgLT4gQWRkTW9kZWwuYWRkRW1wdHlGaWVsZCgpXG4gICAgXCJjaGFuZ2U6IEBmaWVsZC10aXRsZVwiOiAoZSkgLT4gQWRkTW9kZWwudXBkYXRlRmllbGRUaXRsZSAoQGdldFJvd0luZGV4IGUpLCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAZmllbGQtYWxpYXNcIjogKGUpIC0+IEFkZE1vZGVsLnVwZGF0ZUZpZWxkQWxpYXMgKEBnZXRSb3dJbmRleCBlKSwgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGZpZWxkLXR5cGVcIjogKGUpIC0+IEFkZE1vZGVsLnVwZGF0ZUZpZWxkVHlwZSAoQGdldFJvd0luZGV4IGUpLCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1hZGQtdGl0bGVcIjogKGUpIC0+IEFkZE1vZGVsLnVwZGF0ZVRpdGxlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWFkZC1hbGlhc1wiOiAoZSkgLT4gQWRkTW9kZWwudXBkYXRlQWxpYXMgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtYWRkLW1vZHVsZVwiOiAoZSkgLT4gQWRkTW9kZWwudXBkYXRlTW9kdWxlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjbGljazogQGJ0bi1jb25maWctZmllbGRcIjogXCJjbGlja0J0bkNvbmZpZ0ZpZWxkXCJcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtYWRkLWZvcm1cIjogXCJzdWJtaXRDb25maWdzQWRkRm9ybVwiXG5cbiAgaW5pdGlhbDogLT5cbiAgICBAdGJvZHlDb250YWluID0gUmVuZGVyICgkIFwiQHRib2R5LW1vZHVsZS1maWVsZHNcIiksIFwic2VjdGlvbnNfY29uZmlnc190YWJsZS1tb2R1bGUtZmllbGRzXCJcblxuICByZW5kZXJGaWVsZHM6IChzdGF0ZSkgLT5cbiAgICBAdGJvZHlDb250YWluLnJlbmRlciBzdGF0ZVxuICAgICQoJ3NlbGVjdCcpLnNlbGVjdGVyKClcblxuICBnZXRSb3dJbmRleDogKGUpIC0+XG4gICAgJHBhcmVudCA9ICgkIGUudGFyZ2V0KS5jbG9zZXN0IFwiW2RhdGEta2V5XVwiXG4gICAgcmV0dXJuICRwYXJlbnQuZGF0YSBcImtleVwiXG5cbiAgY2xpY2tCdG5Db25maWdGaWVsZDogKGUpIC0+XG4gICAgQHRyaWdnZXIgXCJvcGVuLWNvbmZpZ3MtbW9kYWxcIixcbiAgICAgIEBnZXRSb3dJbmRleCBlXG4gICAgICBBZGRNb2RlbC5nZXRGaWVsZEJ5SW5kZXggQGdldFJvd0luZGV4IGVcblxuICBzdWJtaXRDb25maWdzQWRkRm9ybTogKGUpIC0+XG4gICAgQWRkTW9kZWwuc2F2ZSgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsIFwiVHlwZUltYWdlTW9kZWxcIixcbiAgY2hhbmdlUGF0aDogKHBhdGgpIC0+IEBzdGF0ZS5wYXRoID0gcGF0aFxuXG4gIGNoYW5nZVNpemVXaWR0aDogKHdpZHRoKSAtPiBAc3RhdGUud2lkdGggPSB3aWR0aFxuICBjaGFuZ2VTaXplSGVpZ2h0OiAoaGVpZ2h0KSAtPiBAc3RhdGUuaGVpZ2h0ID0gaGVpZ2h0XG5cbiAgY2hhbmdlU291cmNlOiAoc291cmNlKSAtPiBAc3RhdGUuc291cmNlID0gc291cmNlXG5cbiAgdXBkYXRlUGF0aDogKHZhbHVlKSAtPiBAc3RhdGUucGF0aCA9IHZhbHVlXG5cbiAgdXBkYXRlV2lkdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLndpZHRoID0gdmFsdWVcbiAgdXBkYXRlSGVpZ2h0OiAodmFsdWUpIC0+IEBzdGF0ZS5oZWlnaHQgPSB2YWx1ZVxuXG4gIHVwZGF0ZVNvdXJjZTogKHZhbHVlKSAtPiBAc3RhdGUuc291cmNlID0gdmFsdWVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuY29uZmlnc0ltYWdlTW9kZWwgPSByZXF1aXJlIFwiaW1hZ2UvY29uZmlnc0ltYWdlTW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3IFwiVHlwZUltYWdlVmlld1wiLFxuICBtb2RlbDogY29uZmlnc0ltYWdlTW9kZWxcbiAgZGVidWc6IGZhbHNlXG5cbiAgaW5pdGlhbDogLT5cbiAgICBAY29uZmlnc0ltYWdlUGF0aCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1pbWFnZS1wYXRoXCJcbiAgICBAY29uZmlnc0ltYWdlU291cmNlID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLXNvdXJjZVwiXG4gICAgQGNvbmZpZ3NJbWFnZVdpZHRoID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLXdpZHRoXCJcbiAgICBAY29uZmlnc0ltYWdlSGVpZ2h0ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLWhlaWdodFwiXG4gICAgQGNvbmZpZ3NJbWFnZUluZGV4ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLWluZGV4XCJcblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXBhdGhcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVBhdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2Utd2lkdGhcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVdpZHRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLWhlaWdodFwiOiAoZSkgLT4gY29uZmlnc0ltYWdlTW9kZWwudXBkYXRlSGVpZ2h0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXNvdXJjZVwiOiAoZSkgLT4gY29uZmlnc0ltYWdlTW9kZWwudXBkYXRlU291cmNlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQHVuYmluZCgpXG5cbiAgaW5pdGlhbFJlbmRlcjogKHN0YXRlKSAtPlxuICAgIEBjb25maWdzSW1hZ2VJbmRleC52YWwgc3RhdGUuaW5kZXhcbiAgICBAY29uZmlnc0ltYWdlUGF0aC52YWwgc3RhdGUucGF0aFxuICAgIEBjb25maWdzSW1hZ2VXaWR0aC52YWwgc3RhdGUud2lkdGhcbiAgICBAY29uZmlnc0ltYWdlSGVpZ2h0LnZhbCBzdGF0ZS5oZWlnaHRcbiAgICBAY29uZmlnc0ltYWdlU291cmNlLnZhbCBzdGF0ZS5zb3VyY2VcblxuICBzdWJtaXRDb25maWdzRm9ybTogKGUpIC0+XG4gICAgQHRyaWdnZXIgXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgJChlLnRhcmdldCkuc2VyaWFsaXplT2JqZWN0KClcbiAgICBAdW5iaW5kKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlSW1hZ2VNb2RlbFwiLFxuICBjaGFuZ2VQYXRoOiAocGF0aCkgLT4gQHN0YXRlLnBhdGggPSBwYXRoXG5cbiAgY2hhbmdlU2l6ZVdpZHRoOiAod2lkdGgpIC0+IEBzdGF0ZS53aWR0aCA9IHdpZHRoXG4gIGNoYW5nZVNpemVIZWlnaHQ6IChoZWlnaHQpIC0+IEBzdGF0ZS5oZWlnaHQgPSBoZWlnaHRcblxuICBjaGFuZ2VTb3VyY2U6IChzb3VyY2UpIC0+IEBzdGF0ZS5zb3VyY2UgPSBzb3VyY2VcblxuICB1cGRhdGVQYXRoOiAodmFsdWUpIC0+IEBzdGF0ZS5wYXRoID0gdmFsdWVcblxuICB1cGRhdGVXaWR0aDogKHZhbHVlKSAtPiBAc3RhdGUud2lkdGggPSB2YWx1ZVxuICB1cGRhdGVIZWlnaHQ6ICh2YWx1ZSkgLT4gQHN0YXRlLmhlaWdodCA9IHZhbHVlXG5cbiAgdXBkYXRlU291cmNlOiAodmFsdWUpIC0+IEBzdGF0ZS5zb3VyY2UgPSB2YWx1ZVxuIl19
