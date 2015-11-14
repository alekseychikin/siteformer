(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, AddModel, AddView, Popup, fn, models, type, view, views;

AddModel = require("./addModel.coffee");

AddView = require("./addView.coffee");

$ = require("jquery-plugins.coffee");

models = {
  image: require("image/ConfigsImageModel.coffee"),
  table: require("table/ConfigsTableModel.coffee"),
  file: require("file/ConfigsFileModel.coffee"),
  radio: require("radio/ConfigsRadioModel.coffee"),
  checkbox: require("checkbox/ConfigsCheckboxModel.coffee"),
  gallery: require("gallery/ConfigsGalleryModel.coffee")
};

views = {
  image: require("image/ConfigsImageView.coffee"),
  table: require("table/ConfigsTableView.coffee"),
  file: require("file/ConfigsFileView.coffee"),
  radio: require("radio/ConfigsRadioView.coffee"),
  checkbox: require("checkbox/ConfigsCheckboxView.coffee"),
  gallery: require("gallery/ConfigsGalleryView.coffee")
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
  return window.location.href = "/cms/configs/" + alias + "/";
});


},{"./addModel.coffee":2,"./addView.coffee":3,"checkbox/ConfigsCheckboxModel.coffee":4,"checkbox/ConfigsCheckboxView.coffee":5,"file/ConfigsFileModel.coffee":7,"file/ConfigsFileView.coffee":8,"gallery/ConfigsGalleryModel.coffee":10,"gallery/ConfigsGalleryView.coffee":11,"image/ConfigsImageModel.coffee":13,"image/ConfigsImageView.coffee":14,"jquery-plugins.coffee":"jquery-plugins.coffee","popup":"popup","radio/ConfigsRadioModel.coffee":16,"radio/ConfigsRadioView.coffee":17,"table/ConfigsTableModel.coffee":19,"table/ConfigsTableView.coffee":20}],2:[function(require,module,exports){
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

module.exports = Model("TypeCheckboxModel", {
  getState: function() {
    return this.state;
  },
  updateNumOptions: function(value) {
    var defaultData, i, j, k, ref, ref1, ref2, ref3;
    value = parseInt(value, 10);
    defaultData = this.state.defaultData;
    if (value > this.state.numOptions) {
      for (i = j = ref = this.state.numOptions + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
        defaultData.push({
          label: "",
          checked: false
        });
      }
    } else {
      for (i = k = ref2 = value + 1, ref3 = this.state.numOptions; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
        defaultData.pop();
      }
    }
    this.state.numOptions = value;
    return this.set({
      defaultData: defaultData
    });
  },
  updateDefaultDataOptionChecked: function(index, value) {
    return this.state.defaultData[index].checked = value;
  },
  updateDefaultDataOption: function(index, value) {
    return this.state.defaultData[index].label = value;
  }
});


},{"model.coffee":"model.coffee"}],5:[function(require,module,exports){
var Render, View, configsCheckboxModel;

View = require("view.coffee");

Render = require("render.coffee");

configsCheckboxModel = require("checkbox/configsCheckboxModel.coffee");

module.exports = View("TypeCheckboxView", {
  model: configsCheckboxModel,
  initial: function() {
    return this.optionsContain = Render($("@configs-checkbox-options-contain"), "types_checkbox_options");
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "popup-close: contain": function(e) {
      return this.unbind();
    },
    "change: @configs-checkbox-num-options": function(e) {
      return configsCheckboxModel.updateNumOptions(e.target.value);
    },
    "change: @configs-checkbox-option": function(e) {
      return configsCheckboxModel.updateDefaultDataOptionChecked(this.getIndexByEvent(e), e.target.checked);
    },
    "change: @configs-checkbox-option-label": function(e) {
      return configsCheckboxModel.updateDefaultDataOption(this.getIndexByEvent(e), e.target.value);
    }
  },
  getIndexByEvent: function(e) {
    var $item;
    $item = $(e.target);
    return $item.data("index");
  },
  initialRender: function(state) {
    this.configsCheckboxNumOptions = this.contain.find("@configs-checkbox-num-options");
    this.configsCheckboxNumOptions.val(state.numOptions);
    return this.renderDefaultData(state);
  },
  renderDefaultData: function(state) {
    return this.optionsContain.render({
      options: state.defaultData,
      currentValue: state.defaultValue
    });
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", configsCheckboxModel.getState());
    this.unbind();
    return false;
  }
});


},{"checkbox/configsCheckboxModel.coffee":6,"render.coffee":"render.coffee","view.coffee":"view.coffee"}],6:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeCheckboxModel", {
  getState: function() {
    return this.state;
  },
  updateNumOptions: function(value) {
    var defaultData, i, j, k, ref, ref1, ref2, ref3;
    value = parseInt(value, 10);
    defaultData = this.state.defaultData;
    if (value > this.state.numOptions) {
      for (i = j = ref = this.state.numOptions + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
        defaultData.push({
          label: "",
          checked: false
        });
      }
    } else {
      for (i = k = ref2 = value + 1, ref3 = this.state.numOptions; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
        defaultData.pop();
      }
    }
    this.state.numOptions = value;
    return this.set({
      defaultData: defaultData
    });
  },
  updateDefaultDataOptionChecked: function(index, value) {
    return this.state.defaultData[index].checked = value;
  },
  updateDefaultDataOption: function(index, value) {
    return this.state.defaultData[index].label = value;
  }
});


},{"model.coffee":"model.coffee"}],7:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeFileModel", {
  updateStorage: function(value) {
    return this.state.storage = value;
  },
  updatePath: function(value) {
    return this.state.path = value;
  },
  updateS3AccessKey: function(value) {
    return this.state.s3AccessKey = value;
  },
  updateS3SecretKey: function(value) {
    return this.state.s3SecretKey = value;
  },
  updateS3Bucket: function(value) {
    return this.state.s3Bucket = value;
  },
  updateS3Path: function(value) {
    return this.state.s3Path = value;
  },
  getState: function() {
    return this.state;
  }
});


},{"model.coffee":"model.coffee"}],8:[function(require,module,exports){
var Render, View, configsFileModel;

View = require("view.coffee");

Render = require("render.coffee");

configsFileModel = require("file/configsFileModel.coffee");

module.exports = View("TypeFileView", {
  model: configsFileModel,
  initial: function() {
    this.configsFilePath = this.contain.find("@configs-file-path");
    this.configsFileSource = this.contain.find("@configs-file-source");
    this.configsFileWidth = this.contain.find("@configs-file-width");
    this.configsFileHeight = this.contain.find("@configs-file-height");
    this.configsFileIndex = this.contain.find("@configs-file-index");
    this.configsFileStorage = this.contain.find("@configs-file-storage");
    this.configsFileS3AccessKey = this.contain.find("@configs-file-s3-access-key");
    this.configsFileS3SecretKey = this.contain.find("@configs-file-s3-secret-key");
    this.configsFileS3Bucket = this.contain.find("@configs-file-s3-bucket");
    return this.configsFileS3Path = this.contain.find("@configs-file-s3-path");
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-file-storage": function(e) {
      return configsFileModel.updateStorage(($(e.target)).data("value"));
    },
    "change: @configs-file-path": function(e) {
      return configsFileModel.updatePath(e.target.value);
    },
    "change: @configs-file-width": function(e) {
      return configsFileModel.updateWidth(e.target.value);
    },
    "change: @configs-file-height": function(e) {
      return configsFileModel.updateHeight(e.target.value);
    },
    "change: @configs-file-source": function(e) {
      return configsFileModel.updateSource(e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.unbind();
    },
    "change: @configs-file-s3-access-key": function(e) {
      return configsFileModel.updateS3AccessKey(e.target.value);
    },
    "change: @configs-file-s3-secret-key": function(e) {
      return configsFileModel.updateS3SecretKey(e.target.value);
    },
    "change: @configs-file-s3-bucket": function(e) {
      return configsFileModel.updateS3Bucket(e.target.value);
    },
    "change: @configs-file-s3-path": function(e) {
      return configsFileModel.updateS3Path(e.target.value);
    }
  },
  initialRender: function(state) {
    (this.configsFileStorage.filter("[data-value='" + state.storage + "']")).trigger("click");
    (this.contain.find("@configs-file-modal-storage-frame")).hide();
    (this.contain.find("@configs-file-modal-storage-" + state.storage)).show();
    this.configsFilePath.val(state.path);
    this.configsFileWidth.val(state.width);
    this.configsFileHeight.val(state.height);
    this.configsFileSource.val(state.source);
    this.configsFileS3AccessKey.val(state.s3AccessKey);
    this.configsFileS3SecretKey.val("");
    this.configsFileS3Bucket.val(state.s3Bucket);
    return this.configsFileS3Path.val(state.s3Path);
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", configsFileModel.getState());
    this.unbind();
    return false;
  }
});


},{"file/configsFileModel.coffee":9,"render.coffee":"render.coffee","view.coffee":"view.coffee"}],9:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeFileModel", {
  updateStorage: function(value) {
    return this.state.storage = value;
  },
  updatePath: function(value) {
    return this.state.path = value;
  },
  updateS3AccessKey: function(value) {
    return this.state.s3AccessKey = value;
  },
  updateS3SecretKey: function(value) {
    return this.state.s3SecretKey = value;
  },
  updateS3Bucket: function(value) {
    return this.state.s3Bucket = value;
  },
  updateS3Path: function(value) {
    return this.state.s3Path = value;
  },
  getState: function() {
    return this.state;
  }
});


},{"model.coffee":"model.coffee"}],10:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeGalleryModel", {
  updateStorage: function(value) {
    return this.state.storage = value;
  },
  updatePath: function(path) {
    return this.state.path = path;
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
  updatePreviewWidth: function(value) {
    return this.state.previewWidth = value;
  },
  updatePreviewHeight: function(value) {
    return this.state.previewHeight = value;
  },
  updateS3AccessKey: function(value) {
    return this.state.s3AccessKey = value;
  },
  updateS3SecretKey: function(value) {
    return this.state.s3SecretKey = value;
  },
  updateS3Bucket: function(value) {
    return this.state.s3Bucket = value;
  },
  updateS3Path: function(value) {
    return this.state.s3Path = value;
  },
  getState: function() {
    return this.state;
  }
});


},{"model.coffee":"model.coffee"}],11:[function(require,module,exports){
var View, configsGalleryModel;

View = require("view.coffee");

configsGalleryModel = require("gallery/configsGalleryModel.coffee");

module.exports = View("TypeGalleryView", {
  model: configsGalleryModel,
  initial: function() {
    this.configsGalleryPath = this.contain.find("@configs-gallery-path");
    this.configsGalleryWidth = this.contain.find("@configs-gallery-width");
    this.configsGalleryHeight = this.contain.find("@configs-gallery-height");
    this.configsGalleryPreviewWidth = this.contain.find("@configs-gallery-preview-width");
    this.configsGalleryPreviewHeight = this.contain.find("@configs-gallery-preview-height");
    this.configsGalleryIndex = this.contain.find("@configs-gallery-index");
    this.configsGalleryStorage = this.contain.find("@configs-gallery-storage");
    this.configsGalleryS3AccessKey = this.contain.find("@configs-gallery-s3-access-key");
    this.configsGalleryS3SecretKey = this.contain.find("@configs-gallery-s3-secret-key");
    this.configsGalleryS3Bucket = this.contain.find("@configs-gallery-s3-bucket");
    return this.configsGalleryS3Path = this.contain.find("@configs-gallery-s3-path");
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-gallery-path": function(e) {
      return configsGalleryModel.updatePath(e.target.value);
    },
    "change: @configs-gallery-width": function(e) {
      return configsGalleryModel.updateWidth(e.target.value);
    },
    "change: @configs-gallery-height": function(e) {
      return configsGalleryModel.updateHeight(e.target.value);
    },
    "change: @configs-gallery-preview-width": function(e) {
      return configsGalleryModel.updatePreviewWidth(e.target.value);
    },
    "change: @configs-gallery-preview-height": function(e) {
      return configsGalleryModel.updatePreviewHeight(e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.unbind();
    },
    "change: @configs-gallery-storage": function(e) {
      return configsGalleryModel.updateStorage(($(e.target)).data("value"));
    },
    "change: @configs-gallery-s3-access-key": function(e) {
      return configsGalleryModel.updateS3AccessKey(e.target.value);
    },
    "change: @configs-gallery-s3-secret-key": function(e) {
      return configsGalleryModel.updateS3SecretKey(e.target.value);
    },
    "change: @configs-gallery-s3-bucket": function(e) {
      return configsGalleryModel.updateS3Bucket(e.target.value);
    },
    "change: @configs-gallery-s3-path": function(e) {
      return configsGalleryModel.updateS3Path(e.target.value);
    }
  },
  initialRender: function(state) {
    (this.configsGalleryStorage.filter("[data-value='" + state.storage + "']")).trigger("click");
    (this.contain.find("@configs-gallery-modal-storage-frame")).hide();
    (this.contain.find("@configs-gallery-modal-storage-" + state.storage)).show();
    this.configsGalleryPath.val(state.path);
    this.configsGalleryWidth.val(state.width);
    this.configsGalleryHeight.val(state.height);
    this.configsGalleryPreviewWidth.val(state.previewWidth);
    this.configsGalleryPreviewHeight.val(state.previewHeight);
    this.configsGalleryS3AccessKey.val(state.s3AccessKey);
    this.configsGalleryS3SecretKey.val("");
    this.configsGalleryS3Bucket.val(state.s3Bucket);
    return this.configsGalleryS3Path.val(state.s3Path);
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", configsGalleryModel.getState());
    this.unbind();
    return false;
  }
});


},{"gallery/configsGalleryModel.coffee":12,"view.coffee":"view.coffee"}],12:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeGalleryModel", {
  updateStorage: function(value) {
    return this.state.storage = value;
  },
  updatePath: function(path) {
    return this.state.path = path;
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
  updatePreviewWidth: function(value) {
    return this.state.previewWidth = value;
  },
  updatePreviewHeight: function(value) {
    return this.state.previewHeight = value;
  },
  updateS3AccessKey: function(value) {
    return this.state.s3AccessKey = value;
  },
  updateS3SecretKey: function(value) {
    return this.state.s3SecretKey = value;
  },
  updateS3Bucket: function(value) {
    return this.state.s3Bucket = value;
  },
  updateS3Path: function(value) {
    return this.state.s3Path = value;
  },
  getState: function() {
    return this.state;
  }
});


},{"model.coffee":"model.coffee"}],13:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeImageModel", {
  updateStorage: function(value) {
    return this.state.storage = value;
  },
  updatePath: function(path) {
    return this.state.path = path;
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
  updateS3AccessKey: function(value) {
    return this.state.s3AccessKey = value;
  },
  updateS3SecretKey: function(value) {
    return this.state.s3SecretKey = value;
  },
  updateS3Bucket: function(value) {
    return this.state.s3Bucket = value;
  },
  updateS3Path: function(value) {
    return this.state.s3Path = value;
  },
  getState: function() {
    return this.state;
  }
});


},{"model.coffee":"model.coffee"}],14:[function(require,module,exports){
var View, configsImageModel;

View = require("view.coffee");

configsImageModel = require("image/configsImageModel.coffee");

module.exports = View("TypeImageView", {
  model: configsImageModel,
  initial: function() {
    this.configsImagePath = this.contain.find("@configs-image-path");
    this.configsImageSource = this.contain.find("@configs-image-source");
    this.configsImageWidth = this.contain.find("@configs-image-width");
    this.configsImageHeight = this.contain.find("@configs-image-height");
    this.configsImageIndex = this.contain.find("@configs-image-index");
    this.configsImageStorage = this.contain.find("@configs-image-storage");
    this.configsImageS3AccessKey = this.contain.find("@configs-image-s3-access-key");
    this.configsImageS3SecretKey = this.contain.find("@configs-image-s3-secret-key");
    this.configsImageS3Bucket = this.contain.find("@configs-image-s3-bucket");
    return this.configsImageS3Path = this.contain.find("@configs-image-s3-path");
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
    },
    "change: @configs-image-storage": function(e) {
      return configsImageModel.updateStorage(($(e.target)).data("value"));
    },
    "change: @configs-image-s3-access-key": function(e) {
      return configsImageModel.updateS3AccessKey(e.target.value);
    },
    "change: @configs-image-s3-secret-key": function(e) {
      return configsImageModel.updateS3SecretKey(e.target.value);
    },
    "change: @configs-image-s3-bucket": function(e) {
      return configsImageModel.updateS3Bucket(e.target.value);
    },
    "change: @configs-image-s3-path": function(e) {
      return configsImageModel.updateS3Path(e.target.value);
    }
  },
  initialRender: function(state) {
    (this.configsImageStorage.filter("[data-value='" + state.storage + "']")).trigger("click");
    (this.contain.find("@configs-image-modal-storage-frame")).hide();
    (this.contain.find("@configs-image-modal-storage-" + state.storage)).show();
    this.configsImagePath.val(state.path);
    this.configsImageWidth.val(state.width);
    this.configsImageHeight.val(state.height);
    this.configsImageSource.val(state.source);
    this.configsImageS3AccessKey.val(state.s3AccessKey);
    this.configsImageS3SecretKey.val("");
    this.configsImageS3Bucket.val(state.s3Bucket);
    return this.configsImageS3Path.val(state.s3Path);
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", configsImageModel.getState());
    this.unbind();
    return false;
  }
});


},{"image/configsImageModel.coffee":15,"view.coffee":"view.coffee"}],15:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeImageModel", {
  updateStorage: function(value) {
    return this.state.storage = value;
  },
  updatePath: function(path) {
    return this.state.path = path;
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
  updateS3AccessKey: function(value) {
    return this.state.s3AccessKey = value;
  },
  updateS3SecretKey: function(value) {
    return this.state.s3SecretKey = value;
  },
  updateS3Bucket: function(value) {
    return this.state.s3Bucket = value;
  },
  updateS3Path: function(value) {
    return this.state.s3Path = value;
  },
  getState: function() {
    return this.state;
  }
});


},{"model.coffee":"model.coffee"}],16:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeRadioModel", {
  getState: function() {
    return this.state;
  },
  updateNumOptions: function(value) {
    var defaultData, i, j, k, ref, ref1, ref2, ref3;
    value = parseInt(value, 10);
    defaultData = this.state.defaultData;
    if (value > this.state.numOptions) {
      for (i = j = ref = this.state.numOptions + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
        defaultData.push("");
      }
    } else {
      for (i = k = ref2 = value + 1, ref3 = this.state.numOptions; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
        defaultData.pop();
      }
      if (this.state.defaultValue >= value) {
        this.set({
          defaultValue: -1
        });
      }
    }
    this.state.numOptions = value;
    return this.set({
      defaultData: defaultData
    });
  },
  updateDefaultValue: function(value) {
    return this.state.defaultValue = parseInt(value, 10);
  },
  updateDefaultDataOption: function(index, value) {
    return this.state.defaultData[index] = value;
  }
});


},{"model.coffee":"model.coffee"}],17:[function(require,module,exports){
var Render, View, configsRadioModel;

View = require("view.coffee");

Render = require("render.coffee");

configsRadioModel = require("radio/configsRadioModel.coffee");

module.exports = View("TypeRadioView", {
  model: configsRadioModel,
  initial: function() {
    this.optionsContain = Render($("@configs-radio-options-contain"), "types_radio_options");
    return this.configsRadioNumOptions = this.contain.find("@configs-radio-num-options");
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "popup-close: contain": function(e) {
      return this.unbind();
    },
    "change: @configs-radio-num-options": function(e) {
      return configsRadioModel.updateNumOptions(e.target.value);
    },
    "change: @configs-radio-option": function(e) {
      return configsRadioModel.updateDefaultValue(e.target.value);
    },
    "change: @configs-radio-option-label": function(e) {
      return configsRadioModel.updateDefaultDataOption(this.getIndexByEvent(e), e.target.value);
    }
  },
  getIndexByEvent: function(e) {
    var $item;
    $item = $(e.target);
    return $item.data("index");
  },
  initialRender: function(state) {
    this.configsRadioNumOptions.val(state.numOptions);
    this.renderDefaultValue(state);
    return this.renderDefaultData(state);
  },
  renderDefaultData: function(state) {
    return this.optionsContain.render({
      options: state.defaultData,
      currentValue: state.defaultValue
    });
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", configsRadioModel.getState());
    this.unbind();
    return false;
  },
  renderDefaultValue: function(state) {
    return this.contain.find("@configs-radio-option").filter("[value=" + state.defaultValue + "]").prop("checked", true);
  }
});


},{"radio/configsRadioModel.coffee":18,"render.coffee":"render.coffee","view.coffee":"view.coffee"}],18:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeRadioModel", {
  getState: function() {
    return this.state;
  },
  updateNumOptions: function(value) {
    var defaultData, i, j, k, ref, ref1, ref2, ref3;
    value = parseInt(value, 10);
    defaultData = this.state.defaultData;
    if (value > this.state.numOptions) {
      for (i = j = ref = this.state.numOptions + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
        defaultData.push("");
      }
    } else {
      for (i = k = ref2 = value + 1, ref3 = this.state.numOptions; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
        defaultData.pop();
      }
      if (this.state.defaultValue >= value) {
        this.set({
          defaultValue: -1
        });
      }
    }
    this.state.numOptions = value;
    return this.set({
      defaultData: defaultData
    });
  },
  updateDefaultValue: function(value) {
    return this.state.defaultValue = parseInt(value, 10);
  },
  updateDefaultDataOption: function(index, value) {
    return this.state.defaultData[index] = value;
  }
});


},{"model.coffee":"model.coffee"}],19:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeTableModel", {
  getState: function() {
    return this.state;
  },
  updateColumns: function(value) {
    var i, j, k, l, len, len1, m, ref, ref1, ref2, ref3, ref4, ref5, row;
    value = parseInt(value, 10);
    if (value > this.state.columns) {
      ref = this.state.defaultData;
      for (j = 0, len = ref.length; j < len; j++) {
        row = ref[j];
        for (i = k = ref1 = this.state.columns + 1, ref2 = value; ref1 <= ref2 ? k <= ref2 : k >= ref2; i = ref1 <= ref2 ? ++k : --k) {
          row.push("");
        }
      }
    } else if (value < this.state.columns) {
      ref3 = this.state.defaultData;
      for (l = 0, len1 = ref3.length; l < len1; l++) {
        row = ref3[l];
        for (i = m = ref4 = value + 1, ref5 = this.state.columns; ref4 <= ref5 ? m <= ref5 : m >= ref5; i = ref4 <= ref5 ? ++m : --m) {
          row.pop();
        }
      }
    }
    return this.set({
      columns: value
    });
  },
  updateRows: function(value) {
    var i, j, k, l, ref, ref1, ref2, ref3, ref4, row;
    value = parseInt(value, 10);
    if (value > this.state.rows) {
      for (row = j = ref = this.state.rows + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; row = ref <= ref1 ? ++j : --j) {
        row = [];
        for (i = k = 1, ref2 = this.state.columns; 1 <= ref2 ? k <= ref2 : k >= ref2; i = 1 <= ref2 ? ++k : --k) {
          row.push("");
        }
        this.state.defaultData.push(row);
      }
    } else if (value < this.state.rows) {
      for (row = l = ref3 = value + 1, ref4 = this.state.rows; ref3 <= ref4 ? l <= ref4 : l >= ref4; row = ref3 <= ref4 ? ++l : --l) {
        this.state.defaultData.pop();
      }
    }
    return this.set({
      rows: value
    });
  },
  updateCellData: function(row, column, value) {
    return this.state.defaultData[row][column] = value;
  }
});


},{"model.coffee":"model.coffee"}],20:[function(require,module,exports){
var Render, View, configsTableModel;

View = require("view.coffee");

Render = require("render.coffee");

configsTableModel = require("table/configsTableModel.coffee");

module.exports = View("TypeTableView", {
  model: configsTableModel,
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-table-rows": "changeConfigsTableRows",
    "change: @configs-table-columns": "changeConfigsTableColumns",
    "change: @configs-table-cell": function(e) {
      var $cell;
      $cell = $(e.target);
      return configsTableModel.updateCellData($cell.data("row"), $cell.data("column"), $cell.val());
    },
    "keydown: @configs-table-rows": function(e) {
      this.changeConfigsTableRows(e);
      if (e.keyCode === 13) {
        return e.preventDefault();
      }
    },
    "keydown: @configs-table-columns": function(e) {
      this.changeConfigsTableColumns(e);
      if (e.keyCode === 13) {
        return e.preventDefault();
      }
    },
    "popup-close: contain": function(e) {
      return this.unbind();
    }
  },
  changeConfigsTableRows: function(e) {
    return configsTableModel.updateRows(e.target.value);
  },
  changeConfigsTableColumns: function(e) {
    return configsTableModel.updateColumns(e.target.value);
  },
  initial: function() {
    return this.tbodyContain = Render($("@configs-table-tbody"), "types_table_tbody");
  },
  initialRender: function(state) {
    (this.contain.find("@configs-table-columns")).val(state.columns);
    (this.contain.find("@configs-table-rows")).val(state.rows);
    return this.renderTable(state);
  },
  renderColumns: "renderTable",
  renderRows: "renderTable",
  renderTable: function(state) {
    return this.tbodyContain.render({
      data: state.defaultData
    });
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", configsTableModel.getState());
    this.unbind();
    return false;
  }
});


},{"render.coffee":"render.coffee","table/configsTableModel.coffee":21,"view.coffee":"view.coffee"}],21:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeTableModel", {
  getState: function() {
    return this.state;
  },
  updateColumns: function(value) {
    var i, j, k, l, len, len1, m, ref, ref1, ref2, ref3, ref4, ref5, row;
    value = parseInt(value, 10);
    if (value > this.state.columns) {
      ref = this.state.defaultData;
      for (j = 0, len = ref.length; j < len; j++) {
        row = ref[j];
        for (i = k = ref1 = this.state.columns + 1, ref2 = value; ref1 <= ref2 ? k <= ref2 : k >= ref2; i = ref1 <= ref2 ? ++k : --k) {
          row.push("");
        }
      }
    } else if (value < this.state.columns) {
      ref3 = this.state.defaultData;
      for (l = 0, len1 = ref3.length; l < len1; l++) {
        row = ref3[l];
        for (i = m = ref4 = value + 1, ref5 = this.state.columns; ref4 <= ref5 ? m <= ref5 : m >= ref5; i = ref4 <= ref5 ? ++m : --m) {
          row.pop();
        }
      }
    }
    return this.set({
      columns: value
    });
  },
  updateRows: function(value) {
    var i, j, k, l, ref, ref1, ref2, ref3, ref4, row;
    value = parseInt(value, 10);
    if (value > this.state.rows) {
      for (row = j = ref = this.state.rows + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; row = ref <= ref1 ? ++j : --j) {
        row = [];
        for (i = k = 1, ref2 = this.state.columns; 1 <= ref2 ? k <= ref2 : k >= ref2; i = 1 <= ref2 ? ++k : --k) {
          row.push("");
        }
        this.state.defaultData.push(row);
      }
    } else if (value < this.state.rows) {
      for (row = l = ref3 = value + 1, ref4 = this.state.rows; ref3 <= ref4 ? l <= ref4 : l >= ref4; row = ref3 <= ref4 ? ++l : --l) {
        this.state.defaultData.pop();
      }
    }
    return this.set({
      rows: value
    });
  },
  updateCellData: function(row, column, value) {
    return this.state.defaultData[row][column] = value;
  }
});


},{"model.coffee":"model.coffee"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvc2VjdGlvbnMvY29uZmlncy9hZGRNb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkVmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2NoZWNrYm94L0NvbmZpZ3NDaGVja2JveE1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvY2hlY2tib3gvQ29uZmlnc0NoZWNrYm94Vmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2NoZWNrYm94L2NvbmZpZ3NDaGVja2JveE1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvZmlsZS9Db25maWdzRmlsZU1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvZmlsZS9Db25maWdzRmlsZVZpZXcuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy9maWxlL2NvbmZpZ3NGaWxlTW9kZWwuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy9nYWxsZXJ5L0NvbmZpZ3NHYWxsZXJ5TW9kZWwuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy9nYWxsZXJ5L0NvbmZpZ3NHYWxsZXJ5Vmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2dhbGxlcnkvY29uZmlnc0dhbGxlcnlNb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2ltYWdlL0NvbmZpZ3NJbWFnZU1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvaW1hZ2UvQ29uZmlnc0ltYWdlVmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2ltYWdlL2NvbmZpZ3NJbWFnZU1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvcmFkaW8vQ29uZmlnc1JhZGlvTW9kZWwuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy9yYWRpby9Db25maWdzUmFkaW9WaWV3LmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvcmFkaW8vY29uZmlnc1JhZGlvTW9kZWwuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy90YWJsZS9Db25maWdzVGFibGVNb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL3RhYmxlL0NvbmZpZ3NUYWJsZVZpZXcuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy90YWJsZS9jb25maWdzVGFibGVNb2RlbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsbUJBQVI7O0FBQ1gsT0FBQSxHQUFVLE9BQUEsQ0FBUSxrQkFBUjs7QUFDVixDQUFBLEdBQUksT0FBQSxDQUFRLHVCQUFSOztBQUVKLE1BQUEsR0FDRTtFQUFBLEtBQUEsRUFBTyxPQUFBLENBQVEsZ0NBQVIsQ0FBUDtFQUNBLEtBQUEsRUFBTyxPQUFBLENBQVEsZ0NBQVIsQ0FEUDtFQUVBLElBQUEsRUFBTSxPQUFBLENBQVEsOEJBQVIsQ0FGTjtFQUdBLEtBQUEsRUFBTyxPQUFBLENBQVEsZ0NBQVIsQ0FIUDtFQUlBLFFBQUEsRUFBVSxPQUFBLENBQVEsc0NBQVIsQ0FKVjtFQUtBLE9BQUEsRUFBUyxPQUFBLENBQVEsb0NBQVIsQ0FMVDs7O0FBT0YsS0FBQSxHQUNFO0VBQUEsS0FBQSxFQUFPLE9BQUEsQ0FBUSwrQkFBUixDQUFQO0VBQ0EsS0FB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QUEsTUFJSyxJQUFHLEtBQUEsR0FBUSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQWxCO0FBQ0g7QUFBQSxXQUFBLHdDQUFBOztBQUNFLGFBQVMsdUhBQVQ7VUFDRSxHQUFHLENBQUMsR0FBSixDQUFBO0FBREY7QUFERixPQURHOztXQUlMLElBQUMsQ0FBQSxHQUFELENBQUs7TUFBQSxPQUFBLEVBQVMsS0FBVDtLQUFMO0VBVmEsQ0FGZjtFQWNBLFVBQUEsRUFBWSxTQUFDLEtBQUQ7QUFDVixRQUFBO0lBQUEsS0FBQSxHQUFRLFFBQUEsQ0FBUyxLQUFULEVBQWdCLEVBQWhCO0lBQ1IsSUFBRyxLQUFBLEdBQVEsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFsQjtBQUNFLFdBQVcscUhBQVg7UUFDRSxHQUFBLEdBQU07QUFDTixhQUFTLGtHQUFUO1VBQ0UsR0FBRyxDQUFDLElBQUosQ0FBUyxFQUFUO0FBREY7UUFFQSxJQUFDLENBQUEsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFuQixDQUF3QixHQUF4QjtBQUpGLE9BREY7S0FBQSxNQU1LLElBQUcsS0FBQSxHQUFRLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBbEI7QUFDSCxXQUFXLHdIQUFYO1FBQ0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBbkIsQ0FBQTtBQURGLE9BREc7O1dBR0wsSUFBQyxDQUFBLEdBQUQsQ0FBSztNQUFBLElBQUEsRUFBTSxLQUFOO0tBQUw7RUFYVSxDQWRaO0VBMkJBLGNBQUEsRUFBZ0IsU0FBQyxHQUFELEVBQU0sTUFBTixFQUFjLEtBQWQ7V0FBd0IsSUFBQyxDQUFBLEtBQUssQ0FBQyxXQUFZLENBQUEsR0FBQSxDQUFLLENBQUEsTUFBQSxDQUF4QixHQUFrQztFQUExRCxDQTNCaEI7Q0FGZSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJBZGRNb2RlbCA9IHJlcXVpcmUgXCIuL2FkZE1vZGVsLmNvZmZlZVwiXG5BZGRWaWV3ID0gcmVxdWlyZSBcIi4vYWRkVmlldy5jb2ZmZWVcIlxuJCA9IHJlcXVpcmUgXCJqcXVlcnktcGx1Z2lucy5jb2ZmZWVcIlxuXG5tb2RlbHMgPVxuICBpbWFnZTogcmVxdWlyZSBcImltYWdlL0NvbmZpZ3NJbWFnZU1vZGVsLmNvZmZlZVwiXG4gIHRhYmxlOiByZXF1aXJlIFwidGFibGUvQ29uZmlnc1RhYmxlTW9kZWwuY29mZmVlXCJcbiAgZmlsZTogcmVxdWlyZSBcImZpbGUvQ29uZmlnc0ZpbGVNb2RlbC5jb2ZmZWVcIlxuICByYWRpbzogcmVxdWlyZSBcInJhZGlvL0NvbmZpZ3NSYWRpb01vZGVsLmNvZmZlZVwiXG4gIGNoZWNrYm94OiByZXF1aXJlIFwiY2hlY2tib3gvQ29uZmlnc0NoZWNrYm94TW9kZWwuY29mZmVlXCJcbiAgZ2FsbGVyeTogcmVxdWlyZSBcImdhbGxlcnkvQ29uZmlnc0dhbGxlcnlNb2RlbC5jb2ZmZWVcIlxuXG52aWV3cyA9XG4gIGltYWdlOiByZXF1aXJlIFwiaW1hZ2UvQ29uZmlnc0ltYWdlVmlldy5jb2ZmZWVcIlxuICB0YWJsZTogcmVxdWlyZSBcInRhYmxlL0NvbmZpZ3NUYWJsZVZpZXcuY29mZmVlXCJcbiAgZmlsZTogcmVxdWlyZSBcImZpbGUvQ29uZmlnc0ZpbGVWaWV3LmNvZmZlZVwiXG4gIHJhZGlvOiByZXF1aXJlIFwicmFkaW8vQ29uZmlnc1JhZGlvVmlldy5jb2ZmZWVcIlxuICBjaGVja2JveDogcmVxdWlyZSBcImNoZWNrYm94L0NvbmZpZ3NDaGVja2JveFZpZXcuY29mZmVlXCJcbiAgZ2FsbGVyeTogcmVxdWlyZSBcImdhbGxlcnkvQ29uZmlnc0dhbGxlcnlWaWV3LmNvZmZlZVwiXG5cblBvcHVwID0gcmVxdWlyZSBcInBvcHVwXCJcblxuQWRkVmlldy5vbiBcIm9wZW4tY29uZmlncy1tb2RhbFwiLCAoaW5kZXgsIGZpZWxkKSAtPlxuICBQb3B1cC5vcGVuIFwiQGNvbmZpZ3MtI3tmaWVsZC50eXBlfVwiXG4gIHZpZXdzW2ZpZWxkLnR5cGVdLmJpbmQgKCQgXCJAY29uZmlncy0je2ZpZWxkLnR5cGV9XCIpXG5cbiAgZmllbGQuc2V0dGluZ3MuaW5kZXggPSBpbmRleFxuICBtb2RlbHNbZmllbGQudHlwZV0uYmluZCBmaWVsZC5zZXR0aW5nc1xuXG5mb3IgdHlwZSwgdmlldyBvZiB2aWV3c1xuICBkbyAodHlwZSwgdmlldykgLT5cbiAgICB2aWV3Lm9uIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIChmb3JtKSAtPlxuICAgICAgQWRkTW9kZWwuc2F2ZUZpZWxkQ29uZmlncyBmb3JtXG4gICAgICBQb3B1cC5jbG9zZSgpXG5cbkFkZE1vZGVsLm9uIFwib25TYXZlZFNlY3Rpb25cIiwgKGFsaWFzKSAtPlxuICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL2Ntcy9jb25maWdzLyN7YWxpYXN9L1wiXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuUHJvbWlzZSA9IHJlcXVpcmUgXCJxXCJcbmh0dHBHZXQgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBHZXRcbmh0dHBQb3N0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwUG9zdFxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsIFwiQ29uZmlnc0FkZE1vZGVsXCIsXG4gIGluaXRpYWxTdGF0ZTogLT5cbiAgICBodHRwR2V0IFwiI3t3aW5kb3cubG9jYXRpb24ucGF0aG5hbWV9X19qc29uL1wiXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgIHN0YXRlID1cbiAgICAgICAgICB0aXRsZTogcmVzcG9uc2UudGl0bGVcbiAgICAgICAgICBhbGlhczogcmVzcG9uc2UuYWxpYXNcbiAgICAgICAgICBtb2R1bGU6IHJlc3BvbnNlLm1vZHVsZVxuICAgICAgICAgIGZpZWxkczogcmVzcG9uc2UuZmllbGRzXG4gICAgICAgICAgdHlwZXM6IHJlc3BvbnNlLnR5cGVzXG4gICAgICAgIGlmIHJlc3BvbnNlLmlkXG4gICAgICAgICAgc3RhdGUuaWQgPSByZXNwb25zZS5pZFxuICAgICAgICBjb25zb2xlLmxvZyBzdGF0ZVxuICAgICAgICBzdGF0ZVxuXG4gIGFkZEZpZWxkOiAoZmllbGQpIC0+XG4gICAgQHNldCBmaWVsZHM6IEBzdGF0ZS5maWVsZHMuY29uY2F0IFtmaWVsZF1cblxuICBhZGRFbXB0eUZpZWxkOiAtPlxuICAgIEBzZXQgZmllbGRzOiBAc3RhdGUuZmllbGRzLmNvbmNhdCBbXG4gICAgICB0aXRsZTogXCJcIlxuICAgICAgYWxpYXM6IFwiXCJcbiAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICBdXG5cbiAgdXBkYXRlVGl0bGU6ICh2YWx1ZSkgLT4gQHN0YXRlLnRpdGxlID0gdmFsdWVcbiAgdXBkYXRlQWxpYXM6ICh2YWx1ZSkgLT4gQHN0YXRlLmFsaWFzID0gdmFsdWVcbiAgdXBkYXRlTW9kdWxlOiAodmFsdWUpIC0+IEBzdGF0ZS5tb2R1bGUgPSB2YWx1ZVxuXG4gIHVwZGF0ZUZpZWxkVGl0bGU6IChpbmRleCwgdmFsdWUpIC0+IEBzdGF0ZS5maWVsZHNbaW5kZXhdLnRpdGxlID0gdmFsdWVcbiAgdXBkYXRlRmllbGRBbGlhczogKGluZGV4LCB2YWx1ZSkgLT4gQHN0YXRlLmZpZWxkc1tpbmRleF0uYWxpYXMgPSB2YWx1ZVxuICB1cGRhdGVGaWVsZFR5cGU6IChpbmRleCwgdmFsdWUpIC0+XG4gICAgQHN0YXRlLmZpZWxkc1tpbmRleF0udHlwZSA9IHZhbHVlXG4gICAgQHJlc2V0U2V0dGluZ3MgaW5kZXhcbiAgICBAc2V0IGZpZWxkczogQHN0YXRlLmZpZWxkc1xuXG4gIHJlc2V0U2V0dGluZ3M6IChpbmRleCkgLT5cbiAgICB0eXBlID0gQHN0YXRlLmZpZWxkc1tpbmRleF0udHlwZVxuICAgIGZvciB0eXBlSXRlbSBpbiBAc3RhdGUudHlwZXNcbiAgICAgIGlmIHR5cGVJdGVtLmFsaWFzID09IHR5cGVcbiAgICAgICAgQHN0YXRlLmZpZWxkc1tpbmRleF0uc2V0dGluZ3MgPSBAY2xvbmUgdHlwZUl0ZW0uZGVmYXVsdFNldHRpbmdzXG5cbiAgcmVtb3ZlRmllbGQ6IChpbmRleCkgLT5cbiAgICBAc3RhdGUuZmllbGRzLnNwbGljZSBpbmRleCwgMVxuICAgIEBzZXQgZmllbGRzOiBAc3RhdGUuZmllbGRzXG5cbiAgZ2V0RmllbGRCeUluZGV4OiAoaW5kZXgpIC0+IEBjbG9uZSBAc3RhdGUuZmllbGRzW2luZGV4XVxuXG4gIHNhdmVGaWVsZENvbmZpZ3M6IChmb3JtKSAtPlxuICAgIGluZGV4ID0gZm9ybS5pbmRleFxuICAgIGRlbGV0ZSBmb3JtLmluZGV4XG4gICAgQHN0YXRlLmZpZWxkc1tpbmRleF0uc2V0dGluZ3MgPSBmb3JtXG5cbiAgc2F2ZTogLT5cbiAgICBodHRwUG9zdCBcIi9jbXMvY29uZmlncy9zYXZlL19fanNvbi9cIiwgQHN0YXRlXG4gICAgICAudGhlbiAocmVzcG9uc2UpID0+XG4gICAgICAgIGlmIEBzdGF0ZS5pZD9cbiAgICAgICAgICBAc2V0IGZpZWxkczogcmVzcG9uc2Uuc2VjdGlvbi5maWVsZHNcbiAgICAgICAgICBAc2V0IGlkOiByZXNwb25zZS5zZWN0aW9uLmlkXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAdHJpZ2dlciBcIm9uU2F2ZWRTZWN0aW9uXCIsIEBzdGF0ZS5hbGlhc1xuICAgICAgLmNhdGNoIChyZXNwb25zZSkgLT5cbiAgICAgICAgY29uc29sZS5lcnJvciByZXNwb25zZS5lcnJvclxuIiwiJCA9IHJlcXVpcmUgXCJqcXVlcnktcGx1Z2lucy5jb2ZmZWVcIlxuVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyLmNvZmZlZVwiXG5Qb3B1cCA9IHJlcXVpcmUgXCJwb3B1cFwiXG5BZGRNb2RlbCA9IHJlcXVpcmUgXCIuL2FkZE1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlldyBcIkNvbmZpZ3NBZGRWaWV3XCIsXG4gIGRlYnVnOiBmYWxzZVxuICBjb250YWluOiAkIFwiQGNvbmZpZ3MtYWRkXCJcbiAgbW9kZWw6IEFkZE1vZGVsXG4gIGV2ZW50czpcbiAgICBcImNsaWNrOiBAYnRuLXJlbW92ZS1maWVsZFwiOiAoZSkgLT4gQWRkTW9kZWwucmVtb3ZlRmllbGQgQGdldFJvd0luZGV4IGVcbiAgICBcImNsaWNrOiBAYnRuLWFkZC1maWVsZFwiOiAoZSkgLT4gQWRkTW9kZWwuYWRkRW1wdHlGaWVsZCgpXG4gICAgXCJjaGFuZ2U6IEBmaWVsZC10aXRsZVwiOiAoZSkgLT4gQWRkTW9kZWwudXBkYXRlRmllbGRUaXRsZSAoQGdldFJvd0luZGV4IGUpLCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAZmllbGQtYWxpYXNcIjogKGUpIC0+IEFkZE1vZGVsLnVwZGF0ZUZpZWxkQWxpYXMgKEBnZXRSb3dJbmRleCBlKSwgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGZpZWxkLXR5cGVcIjogKGUpIC0+IEFkZE1vZGVsLnVwZGF0ZUZpZWxkVHlwZSAoQGdldFJvd0luZGV4IGUpLCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1hZGQtdGl0bGVcIjogKGUpIC0+IEFkZE1vZGVsLnVwZGF0ZVRpdGxlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWFkZC1hbGlhc1wiOiAoZSkgLT4gQWRkTW9kZWwudXBkYXRlQWxpYXMgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtYWRkLW1vZHVsZVwiOiAoZSkgLT4gQWRkTW9kZWwudXBkYXRlTW9kdWxlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjbGljazogQGJ0bi1jb25maWctZmllbGRcIjogXCJjbGlja0J0bkNvbmZpZ0ZpZWxkXCJcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtYWRkLWZvcm1cIjogXCJzdWJtaXRDb25maWdzQWRkRm9ybVwiXG5cbiAgaW5pdGlhbDogLT5cbiAgICBAdGJvZHlDb250YWluID0gUmVuZGVyICgkIFwiQHRib2R5LW1vZHVsZS1maWVsZHNcIiksIFwic2VjdGlvbnNfY29uZmlnc190YWJsZS1tb2R1bGUtZmllbGRzXCJcblxuICByZW5kZXJGaWVsZHM6IChzdGF0ZSkgLT5cbiAgICBAdGJvZHlDb250YWluLnJlbmRlciBzdGF0ZVxuICAgICQoJ3NlbGVjdCcpLnNlbGVjdGVyKClcblxuICBnZXRSb3dJbmRleDogKGUpIC0+XG4gICAgJHBhcmVudCA9ICgkIGUudGFyZ2V0KS5jbG9zZXN0IFwiW2RhdGEta2V5XVwiXG4gICAgcmV0dXJuICRwYXJlbnQuZGF0YSBcImtleVwiXG5cbiAgY2xpY2tCdG5Db25maWdGaWVsZDogKGUpIC0+XG4gICAgQHRyaWdnZXIgXCJvcGVuLWNvbmZpZ3MtbW9kYWxcIixcbiAgICAgIEBnZXRSb3dJbmRleCBlXG4gICAgICBBZGRNb2RlbC5nZXRGaWVsZEJ5SW5kZXggQGdldFJvd0luZGV4IGVcblxuICBzdWJtaXRDb25maWdzQWRkRm9ybTogKGUpIC0+XG4gICAgQWRkTW9kZWwuc2F2ZSgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsIFwiVHlwZUNoZWNrYm94TW9kZWxcIixcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG5cbiAgdXBkYXRlTnVtT3B0aW9uczogKHZhbHVlKSAtPlxuICAgIHZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG4gICAgZGVmYXVsdERhdGEgPSBAc3RhdGUuZGVmYXVsdERhdGFcbiAgICBpZiB2YWx1ZSA+IEBzdGF0ZS5udW1PcHRpb25zXG4gICAgICBmb3IgaSBpbiBbQHN0YXRlLm51bU9wdGlvbnMgKyAxLi52YWx1ZV1cbiAgICAgICAgZGVmYXVsdERhdGEucHVzaFxuICAgICAgICAgIGxhYmVsOiBcIlwiXG4gICAgICAgICAgY2hlY2tlZDogZmFsc2VcbiAgICBlbHNlXG4gICAgICBmb3IgaSBpbiBbdmFsdWUgKyAxLi5Ac3RhdGUubnVtT3B0aW9uc11cbiAgICAgICAgZGVmYXVsdERhdGEucG9wKClcbiAgICBAc3RhdGUubnVtT3B0aW9ucyA9IHZhbHVlXG4gICAgQHNldCBkZWZhdWx0RGF0YTogZGVmYXVsdERhdGFcblxuICB1cGRhdGVEZWZhdWx0RGF0YU9wdGlvbkNoZWNrZWQ6IChpbmRleCwgdmFsdWUpIC0+IEBzdGF0ZS5kZWZhdWx0RGF0YVtpbmRleF0uY2hlY2tlZCA9IHZhbHVlXG4gIHVwZGF0ZURlZmF1bHREYXRhT3B0aW9uOiAoaW5kZXgsIHZhbHVlKSAtPiBAc3RhdGUuZGVmYXVsdERhdGFbaW5kZXhdLmxhYmVsID0gdmFsdWVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlci5jb2ZmZWVcIlxuY29uZmlnc0NoZWNrYm94TW9kZWwgPSByZXF1aXJlIFwiY2hlY2tib3gvY29uZmlnc0NoZWNrYm94TW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3IFwiVHlwZUNoZWNrYm94Vmlld1wiLFxuICBtb2RlbDogY29uZmlnc0NoZWNrYm94TW9kZWxcblxuICBpbml0aWFsOiAtPlxuICAgIEBvcHRpb25zQ29udGFpbiA9IFJlbmRlciAoJCBcIkBjb25maWdzLWNoZWNrYm94LW9wdGlvbnMtY29udGFpblwiKSwgXCJ0eXBlc19jaGVja2JveF9vcHRpb25zXCJcblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQHVuYmluZCgpXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWNoZWNrYm94LW51bS1vcHRpb25zXCI6IChlKSAtPiBjb25maWdzQ2hlY2tib3hNb2RlbC51cGRhdGVOdW1PcHRpb25zIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWNoZWNrYm94LW9wdGlvblwiOiAoZSkgLT4gY29uZmlnc0NoZWNrYm94TW9kZWwudXBkYXRlRGVmYXVsdERhdGFPcHRpb25DaGVja2VkIChAZ2V0SW5kZXhCeUV2ZW50IGUpLCBlLnRhcmdldC5jaGVja2VkXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWNoZWNrYm94LW9wdGlvbi1sYWJlbFwiOiAoZSkgLT4gY29uZmlnc0NoZWNrYm94TW9kZWwudXBkYXRlRGVmYXVsdERhdGFPcHRpb24gKEBnZXRJbmRleEJ5RXZlbnQgZSksIGUudGFyZ2V0LnZhbHVlXG5cbiAgZ2V0SW5kZXhCeUV2ZW50OiAoZSkgLT5cbiAgICAkaXRlbSA9ICQgZS50YXJnZXRcbiAgICAkaXRlbS5kYXRhIFwiaW5kZXhcIlxuXG4gIGluaXRpYWxSZW5kZXI6IChzdGF0ZSkgLT5cbiAgICBAY29uZmlnc0NoZWNrYm94TnVtT3B0aW9ucyA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1jaGVja2JveC1udW0tb3B0aW9uc1wiXG4gICAgQGNvbmZpZ3NDaGVja2JveE51bU9wdGlvbnMudmFsIHN0YXRlLm51bU9wdGlvbnNcbiAgICBAcmVuZGVyRGVmYXVsdERhdGEgc3RhdGVcblxuICByZW5kZXJEZWZhdWx0RGF0YTogKHN0YXRlKSAtPiBAb3B0aW9uc0NvbnRhaW4ucmVuZGVyIG9wdGlvbnM6IHN0YXRlLmRlZmF1bHREYXRhLCBjdXJyZW50VmFsdWU6IHN0YXRlLmRlZmF1bHRWYWx1ZVxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBjb25maWdzQ2hlY2tib3hNb2RlbC5nZXRTdGF0ZSgpXG4gICAgQHVuYmluZCgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsIFwiVHlwZUNoZWNrYm94TW9kZWxcIixcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG5cbiAgdXBkYXRlTnVtT3B0aW9uczogKHZhbHVlKSAtPlxuICAgIHZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG4gICAgZGVmYXVsdERhdGEgPSBAc3RhdGUuZGVmYXVsdERhdGFcbiAgICBpZiB2YWx1ZSA+IEBzdGF0ZS5udW1PcHRpb25zXG4gICAgICBmb3IgaSBpbiBbQHN0YXRlLm51bU9wdGlvbnMgKyAxLi52YWx1ZV1cbiAgICAgICAgZGVmYXVsdERhdGEucHVzaFxuICAgICAgICAgIGxhYmVsOiBcIlwiXG4gICAgICAgICAgY2hlY2tlZDogZmFsc2VcbiAgICBlbHNlXG4gICAgICBmb3IgaSBpbiBbdmFsdWUgKyAxLi5Ac3RhdGUubnVtT3B0aW9uc11cbiAgICAgICAgZGVmYXVsdERhdGEucG9wKClcbiAgICBAc3RhdGUubnVtT3B0aW9ucyA9IHZhbHVlXG4gICAgQHNldCBkZWZhdWx0RGF0YTogZGVmYXVsdERhdGFcblxuICB1cGRhdGVEZWZhdWx0RGF0YU9wdGlvbkNoZWNrZWQ6IChpbmRleCwgdmFsdWUpIC0+IEBzdGF0ZS5kZWZhdWx0RGF0YVtpbmRleF0uY2hlY2tlZCA9IHZhbHVlXG4gIHVwZGF0ZURlZmF1bHREYXRhT3B0aW9uOiAoaW5kZXgsIHZhbHVlKSAtPiBAc3RhdGUuZGVmYXVsdERhdGFbaW5kZXhdLmxhYmVsID0gdmFsdWVcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlRmlsZU1vZGVsXCIsXG4gIHVwZGF0ZVN0b3JhZ2U6ICh2YWx1ZSkgLT4gQHN0YXRlLnN0b3JhZ2UgPSB2YWx1ZVxuICB1cGRhdGVQYXRoOiAodmFsdWUpIC0+IEBzdGF0ZS5wYXRoID0gdmFsdWVcbiAgdXBkYXRlUzNBY2Nlc3NLZXk6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzQWNjZXNzS2V5ID0gdmFsdWVcbiAgdXBkYXRlUzNTZWNyZXRLZXk6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzU2VjcmV0S2V5ID0gdmFsdWVcbiAgdXBkYXRlUzNCdWNrZXQ6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzQnVja2V0ID0gdmFsdWVcbiAgdXBkYXRlUzNQYXRoOiAodmFsdWUpIC0+IEBzdGF0ZS5zM1BhdGggPSB2YWx1ZVxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlci5jb2ZmZWVcIlxuY29uZmlnc0ZpbGVNb2RlbCA9IHJlcXVpcmUgXCJmaWxlL2NvbmZpZ3NGaWxlTW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3IFwiVHlwZUZpbGVWaWV3XCIsXG4gIG1vZGVsOiBjb25maWdzRmlsZU1vZGVsXG5cbiAgaW5pdGlhbDogLT5cbiAgICBAY29uZmlnc0ZpbGVQYXRoID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWZpbGUtcGF0aFwiXG4gICAgQGNvbmZpZ3NGaWxlU291cmNlID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWZpbGUtc291cmNlXCJcbiAgICBAY29uZmlnc0ZpbGVXaWR0aCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1maWxlLXdpZHRoXCJcbiAgICBAY29uZmlnc0ZpbGVIZWlnaHQgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZmlsZS1oZWlnaHRcIlxuICAgIEBjb25maWdzRmlsZUluZGV4ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWZpbGUtaW5kZXhcIlxuICAgIEBjb25maWdzRmlsZVN0b3JhZ2UgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZmlsZS1zdG9yYWdlXCJcbiAgICBAY29uZmlnc0ZpbGVTM0FjY2Vzc0tleSA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1maWxlLXMzLWFjY2Vzcy1rZXlcIlxuICAgIEBjb25maWdzRmlsZVMzU2VjcmV0S2V5ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWZpbGUtczMtc2VjcmV0LWtleVwiXG4gICAgQGNvbmZpZ3NGaWxlUzNCdWNrZXQgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZmlsZS1zMy1idWNrZXRcIlxuICAgIEBjb25maWdzRmlsZVMzUGF0aCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1maWxlLXMzLXBhdGhcIlxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS1zdG9yYWdlXCI6IChlKSAtPiBjb25maWdzRmlsZU1vZGVsLnVwZGF0ZVN0b3JhZ2UgKCQgZS50YXJnZXQpLmRhdGEgXCJ2YWx1ZVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtcGF0aFwiOiAoZSkgLT4gY29uZmlnc0ZpbGVNb2RlbC51cGRhdGVQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtd2lkdGhcIjogKGUpIC0+IGNvbmZpZ3NGaWxlTW9kZWwudXBkYXRlV2lkdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS1oZWlnaHRcIjogKGUpIC0+IGNvbmZpZ3NGaWxlTW9kZWwudXBkYXRlSGVpZ2h0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtc291cmNlXCI6IChlKSAtPiBjb25maWdzRmlsZU1vZGVsLnVwZGF0ZVNvdXJjZSBlLnRhcmdldC52YWx1ZVxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEB1bmJpbmQoKVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLXMzLWFjY2Vzcy1rZXlcIjogKGUpIC0+IGNvbmZpZ3NGaWxlTW9kZWwudXBkYXRlUzNBY2Nlc3NLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS1zMy1zZWNyZXQta2V5XCI6IChlKSAtPiBjb25maWdzRmlsZU1vZGVsLnVwZGF0ZVMzU2VjcmV0S2V5IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtczMtYnVja2V0XCI6IChlKSAtPiBjb25maWdzRmlsZU1vZGVsLnVwZGF0ZVMzQnVja2V0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtczMtcGF0aFwiOiAoZSkgLT4gY29uZmlnc0ZpbGVNb2RlbC51cGRhdGVTM1BhdGggZS50YXJnZXQudmFsdWVcblxuICBpbml0aWFsUmVuZGVyOiAoc3RhdGUpIC0+XG4gICAgKEBjb25maWdzRmlsZVN0b3JhZ2UuZmlsdGVyIFwiW2RhdGEtdmFsdWU9JyN7c3RhdGUuc3RvcmFnZX0nXVwiKS50cmlnZ2VyIFwiY2xpY2tcIlxuICAgIChAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZmlsZS1tb2RhbC1zdG9yYWdlLWZyYW1lXCIpLmhpZGUoKVxuICAgIChAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZmlsZS1tb2RhbC1zdG9yYWdlLSN7c3RhdGUuc3RvcmFnZX1cIikuc2hvdygpXG4gICAgQGNvbmZpZ3NGaWxlUGF0aC52YWwgc3RhdGUucGF0aFxuICAgIEBjb25maWdzRmlsZVdpZHRoLnZhbCBzdGF0ZS53aWR0aFxuICAgIEBjb25maWdzRmlsZUhlaWdodC52YWwgc3RhdGUuaGVpZ2h0XG4gICAgQGNvbmZpZ3NGaWxlU291cmNlLnZhbCBzdGF0ZS5zb3VyY2VcbiAgICBAY29uZmlnc0ZpbGVTM0FjY2Vzc0tleS52YWwgc3RhdGUuczNBY2Nlc3NLZXlcbiAgICBAY29uZmlnc0ZpbGVTM1NlY3JldEtleS52YWwgXCJcIlxuICAgIEBjb25maWdzRmlsZVMzQnVja2V0LnZhbCBzdGF0ZS5zM0J1Y2tldFxuICAgIEBjb25maWdzRmlsZVMzUGF0aC52YWwgc3RhdGUuczNQYXRoXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIGNvbmZpZ3NGaWxlTW9kZWwuZ2V0U3RhdGUoKVxuICAgIEB1bmJpbmQoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIlR5cGVGaWxlTW9kZWxcIixcbiAgdXBkYXRlU3RvcmFnZTogKHZhbHVlKSAtPiBAc3RhdGUuc3RvcmFnZSA9IHZhbHVlXG4gIHVwZGF0ZVBhdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLnBhdGggPSB2YWx1ZVxuICB1cGRhdGVTM0FjY2Vzc0tleTogKHZhbHVlKSAtPiBAc3RhdGUuczNBY2Nlc3NLZXkgPSB2YWx1ZVxuICB1cGRhdGVTM1NlY3JldEtleTogKHZhbHVlKSAtPiBAc3RhdGUuczNTZWNyZXRLZXkgPSB2YWx1ZVxuICB1cGRhdGVTM0J1Y2tldDogKHZhbHVlKSAtPiBAc3RhdGUuczNCdWNrZXQgPSB2YWx1ZVxuICB1cGRhdGVTM1BhdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzUGF0aCA9IHZhbHVlXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIlR5cGVHYWxsZXJ5TW9kZWxcIixcbiAgdXBkYXRlU3RvcmFnZTogKHZhbHVlKSAtPiBAc3RhdGUuc3RvcmFnZSA9IHZhbHVlXG5cbiAgdXBkYXRlUGF0aDogKHBhdGgpIC0+IEBzdGF0ZS5wYXRoID0gcGF0aFxuICB1cGRhdGVQYXRoOiAodmFsdWUpIC0+IEBzdGF0ZS5wYXRoID0gdmFsdWVcbiAgdXBkYXRlV2lkdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLndpZHRoID0gdmFsdWVcbiAgdXBkYXRlSGVpZ2h0OiAodmFsdWUpIC0+IEBzdGF0ZS5oZWlnaHQgPSB2YWx1ZVxuICB1cGRhdGVQcmV2aWV3V2lkdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLnByZXZpZXdXaWR0aCA9IHZhbHVlXG4gIHVwZGF0ZVByZXZpZXdIZWlnaHQ6ICh2YWx1ZSkgLT4gQHN0YXRlLnByZXZpZXdIZWlnaHQgPSB2YWx1ZVxuXG4gIHVwZGF0ZVMzQWNjZXNzS2V5OiAodmFsdWUpIC0+IEBzdGF0ZS5zM0FjY2Vzc0tleSA9IHZhbHVlXG4gIHVwZGF0ZVMzU2VjcmV0S2V5OiAodmFsdWUpIC0+IEBzdGF0ZS5zM1NlY3JldEtleSA9IHZhbHVlXG4gIHVwZGF0ZVMzQnVja2V0OiAodmFsdWUpIC0+IEBzdGF0ZS5zM0J1Y2tldCA9IHZhbHVlXG4gIHVwZGF0ZVMzUGF0aDogKHZhbHVlKSAtPiBAc3RhdGUuczNQYXRoID0gdmFsdWVcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcbmNvbmZpZ3NHYWxsZXJ5TW9kZWwgPSByZXF1aXJlIFwiZ2FsbGVyeS9jb25maWdzR2FsbGVyeU1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlldyBcIlR5cGVHYWxsZXJ5Vmlld1wiLFxuICBtb2RlbDogY29uZmlnc0dhbGxlcnlNb2RlbFxuXG4gIGluaXRpYWw6IC0+XG4gICAgQGNvbmZpZ3NHYWxsZXJ5UGF0aCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1nYWxsZXJ5LXBhdGhcIlxuICAgIEBjb25maWdzR2FsbGVyeVdpZHRoID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWdhbGxlcnktd2lkdGhcIlxuICAgIEBjb25maWdzR2FsbGVyeUhlaWdodCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1nYWxsZXJ5LWhlaWdodFwiXG4gICAgQGNvbmZpZ3NHYWxsZXJ5UHJldmlld1dpZHRoID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWdhbGxlcnktcHJldmlldy13aWR0aFwiXG4gICAgQGNvbmZpZ3NHYWxsZXJ5UHJldmlld0hlaWdodCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1nYWxsZXJ5LXByZXZpZXctaGVpZ2h0XCJcbiAgICBAY29uZmlnc0dhbGxlcnlJbmRleCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1nYWxsZXJ5LWluZGV4XCJcbiAgICBAY29uZmlnc0dhbGxlcnlTdG9yYWdlID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWdhbGxlcnktc3RvcmFnZVwiXG4gICAgQGNvbmZpZ3NHYWxsZXJ5UzNBY2Nlc3NLZXkgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZ2FsbGVyeS1zMy1hY2Nlc3Mta2V5XCJcbiAgICBAY29uZmlnc0dhbGxlcnlTM1NlY3JldEtleSA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1nYWxsZXJ5LXMzLXNlY3JldC1rZXlcIlxuICAgIEBjb25maWdzR2FsbGVyeVMzQnVja2V0ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWdhbGxlcnktczMtYnVja2V0XCJcbiAgICBAY29uZmlnc0dhbGxlcnlTM1BhdGggPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZ2FsbGVyeS1zMy1wYXRoXCJcblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWdhbGxlcnktcGF0aFwiOiAoZSkgLT4gY29uZmlnc0dhbGxlcnlNb2RlbC51cGRhdGVQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWdhbGxlcnktd2lkdGhcIjogKGUpIC0+IGNvbmZpZ3NHYWxsZXJ5TW9kZWwudXBkYXRlV2lkdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1oZWlnaHRcIjogKGUpIC0+IGNvbmZpZ3NHYWxsZXJ5TW9kZWwudXBkYXRlSGVpZ2h0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWdhbGxlcnktcHJldmlldy13aWR0aFwiOiAoZSkgLT4gY29uZmlnc0dhbGxlcnlNb2RlbC51cGRhdGVQcmV2aWV3V2lkdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1wcmV2aWV3LWhlaWdodFwiOiAoZSkgLT4gY29uZmlnc0dhbGxlcnlNb2RlbC51cGRhdGVQcmV2aWV3SGVpZ2h0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQHVuYmluZCgpXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWdhbGxlcnktc3RvcmFnZVwiOiAoZSkgLT4gY29uZmlnc0dhbGxlcnlNb2RlbC51cGRhdGVTdG9yYWdlICgkIGUudGFyZ2V0KS5kYXRhIFwidmFsdWVcIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1nYWxsZXJ5LXMzLWFjY2Vzcy1rZXlcIjogKGUpIC0+IGNvbmZpZ3NHYWxsZXJ5TW9kZWwudXBkYXRlUzNBY2Nlc3NLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1zMy1zZWNyZXQta2V5XCI6IChlKSAtPiBjb25maWdzR2FsbGVyeU1vZGVsLnVwZGF0ZVMzU2VjcmV0S2V5IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWdhbGxlcnktczMtYnVja2V0XCI6IChlKSAtPiBjb25maWdzR2FsbGVyeU1vZGVsLnVwZGF0ZVMzQnVja2V0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWdhbGxlcnktczMtcGF0aFwiOiAoZSkgLT4gY29uZmlnc0dhbGxlcnlNb2RlbC51cGRhdGVTM1BhdGggZS50YXJnZXQudmFsdWVcblxuICBpbml0aWFsUmVuZGVyOiAoc3RhdGUpIC0+XG4gICAgKEBjb25maWdzR2FsbGVyeVN0b3JhZ2UuZmlsdGVyIFwiW2RhdGEtdmFsdWU9JyN7c3RhdGUuc3RvcmFnZX0nXVwiKS50cmlnZ2VyIFwiY2xpY2tcIlxuICAgIChAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZ2FsbGVyeS1tb2RhbC1zdG9yYWdlLWZyYW1lXCIpLmhpZGUoKVxuICAgIChAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZ2FsbGVyeS1tb2RhbC1zdG9yYWdlLSN7c3RhdGUuc3RvcmFnZX1cIikuc2hvdygpXG4gICAgQGNvbmZpZ3NHYWxsZXJ5UGF0aC52YWwgc3RhdGUucGF0aFxuICAgIEBjb25maWdzR2FsbGVyeVdpZHRoLnZhbCBzdGF0ZS53aWR0aFxuICAgIEBjb25maWdzR2FsbGVyeUhlaWdodC52YWwgc3RhdGUuaGVpZ2h0XG4gICAgQGNvbmZpZ3NHYWxsZXJ5UHJldmlld1dpZHRoLnZhbCBzdGF0ZS5wcmV2aWV3V2lkdGhcbiAgICBAY29uZmlnc0dhbGxlcnlQcmV2aWV3SGVpZ2h0LnZhbCBzdGF0ZS5wcmV2aWV3SGVpZ2h0XG4gICAgQGNvbmZpZ3NHYWxsZXJ5UzNBY2Nlc3NLZXkudmFsIHN0YXRlLnMzQWNjZXNzS2V5XG4gICAgQGNvbmZpZ3NHYWxsZXJ5UzNTZWNyZXRLZXkudmFsIFwiXCJcbiAgICBAY29uZmlnc0dhbGxlcnlTM0J1Y2tldC52YWwgc3RhdGUuczNCdWNrZXRcbiAgICBAY29uZmlnc0dhbGxlcnlTM1BhdGgudmFsIHN0YXRlLnMzUGF0aFxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBjb25maWdzR2FsbGVyeU1vZGVsLmdldFN0YXRlKClcbiAgICBAdW5iaW5kKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlR2FsbGVyeU1vZGVsXCIsXG4gIHVwZGF0ZVN0b3JhZ2U6ICh2YWx1ZSkgLT4gQHN0YXRlLnN0b3JhZ2UgPSB2YWx1ZVxuXG4gIHVwZGF0ZVBhdGg6IChwYXRoKSAtPiBAc3RhdGUucGF0aCA9IHBhdGhcbiAgdXBkYXRlUGF0aDogKHZhbHVlKSAtPiBAc3RhdGUucGF0aCA9IHZhbHVlXG4gIHVwZGF0ZVdpZHRoOiAodmFsdWUpIC0+IEBzdGF0ZS53aWR0aCA9IHZhbHVlXG4gIHVwZGF0ZUhlaWdodDogKHZhbHVlKSAtPiBAc3RhdGUuaGVpZ2h0ID0gdmFsdWVcbiAgdXBkYXRlUHJldmlld1dpZHRoOiAodmFsdWUpIC0+IEBzdGF0ZS5wcmV2aWV3V2lkdGggPSB2YWx1ZVxuICB1cGRhdGVQcmV2aWV3SGVpZ2h0OiAodmFsdWUpIC0+IEBzdGF0ZS5wcmV2aWV3SGVpZ2h0ID0gdmFsdWVcblxuICB1cGRhdGVTM0FjY2Vzc0tleTogKHZhbHVlKSAtPiBAc3RhdGUuczNBY2Nlc3NLZXkgPSB2YWx1ZVxuICB1cGRhdGVTM1NlY3JldEtleTogKHZhbHVlKSAtPiBAc3RhdGUuczNTZWNyZXRLZXkgPSB2YWx1ZVxuICB1cGRhdGVTM0J1Y2tldDogKHZhbHVlKSAtPiBAc3RhdGUuczNCdWNrZXQgPSB2YWx1ZVxuICB1cGRhdGVTM1BhdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzUGF0aCA9IHZhbHVlXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIlR5cGVJbWFnZU1vZGVsXCIsXG4gIHVwZGF0ZVN0b3JhZ2U6ICh2YWx1ZSkgLT4gQHN0YXRlLnN0b3JhZ2UgPSB2YWx1ZVxuXG4gIHVwZGF0ZVBhdGg6IChwYXRoKSAtPiBAc3RhdGUucGF0aCA9IHBhdGhcbiAgdXBkYXRlUGF0aDogKHZhbHVlKSAtPiBAc3RhdGUucGF0aCA9IHZhbHVlXG4gIHVwZGF0ZVdpZHRoOiAodmFsdWUpIC0+IEBzdGF0ZS53aWR0aCA9IHZhbHVlXG4gIHVwZGF0ZUhlaWdodDogKHZhbHVlKSAtPiBAc3RhdGUuaGVpZ2h0ID0gdmFsdWVcbiAgdXBkYXRlU291cmNlOiAodmFsdWUpIC0+IEBzdGF0ZS5zb3VyY2UgPSB2YWx1ZVxuXG4gIHVwZGF0ZVMzQWNjZXNzS2V5OiAodmFsdWUpIC0+IEBzdGF0ZS5zM0FjY2Vzc0tleSA9IHZhbHVlXG4gIHVwZGF0ZVMzU2VjcmV0S2V5OiAodmFsdWUpIC0+IEBzdGF0ZS5zM1NlY3JldEtleSA9IHZhbHVlXG4gIHVwZGF0ZVMzQnVja2V0OiAodmFsdWUpIC0+IEBzdGF0ZS5zM0J1Y2tldCA9IHZhbHVlXG4gIHVwZGF0ZVMzUGF0aDogKHZhbHVlKSAtPiBAc3RhdGUuczNQYXRoID0gdmFsdWVcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcbmNvbmZpZ3NJbWFnZU1vZGVsID0gcmVxdWlyZSBcImltYWdlL2NvbmZpZ3NJbWFnZU1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlldyBcIlR5cGVJbWFnZVZpZXdcIixcbiAgbW9kZWw6IGNvbmZpZ3NJbWFnZU1vZGVsXG5cbiAgaW5pdGlhbDogLT5cbiAgICBAY29uZmlnc0ltYWdlUGF0aCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1pbWFnZS1wYXRoXCJcbiAgICBAY29uZmlnc0ltYWdlU291cmNlID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLXNvdXJjZVwiXG4gICAgQGNvbmZpZ3NJbWFnZVdpZHRoID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLXdpZHRoXCJcbiAgICBAY29uZmlnc0ltYWdlSGVpZ2h0ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLWhlaWdodFwiXG4gICAgQGNvbmZpZ3NJbWFnZUluZGV4ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLWluZGV4XCJcbiAgICBAY29uZmlnc0ltYWdlU3RvcmFnZSA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1pbWFnZS1zdG9yYWdlXCJcbiAgICBAY29uZmlnc0ltYWdlUzNBY2Nlc3NLZXkgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2UtczMtYWNjZXNzLWtleVwiXG4gICAgQGNvbmZpZ3NJbWFnZVMzU2VjcmV0S2V5ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLXMzLXNlY3JldC1rZXlcIlxuICAgIEBjb25maWdzSW1hZ2VTM0J1Y2tldCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1pbWFnZS1zMy1idWNrZXRcIlxuICAgIEBjb25maWdzSW1hZ2VTM1BhdGggPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2UtczMtcGF0aFwiXG5cbiAgZXZlbnRzOlxuICAgIFwic3VibWl0OiBAY29uZmlncy1mb3JtXCI6IFwic3VibWl0Q29uZmlnc0Zvcm1cIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1wYXRoXCI6IChlKSAtPiBjb25maWdzSW1hZ2VNb2RlbC51cGRhdGVQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXdpZHRoXCI6IChlKSAtPiBjb25maWdzSW1hZ2VNb2RlbC51cGRhdGVXaWR0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1oZWlnaHRcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZUhlaWdodCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1zb3VyY2VcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVNvdXJjZSBlLnRhcmdldC52YWx1ZVxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEB1bmJpbmQoKVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1zdG9yYWdlXCI6IChlKSAtPiBjb25maWdzSW1hZ2VNb2RlbC51cGRhdGVTdG9yYWdlICgkIGUudGFyZ2V0KS5kYXRhIFwidmFsdWVcIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1zMy1hY2Nlc3Mta2V5XCI6IChlKSAtPiBjb25maWdzSW1hZ2VNb2RlbC51cGRhdGVTM0FjY2Vzc0tleSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1zMy1zZWNyZXQta2V5XCI6IChlKSAtPiBjb25maWdzSW1hZ2VNb2RlbC51cGRhdGVTM1NlY3JldEtleSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1zMy1idWNrZXRcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVMzQnVja2V0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXMzLXBhdGhcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVMzUGF0aCBlLnRhcmdldC52YWx1ZVxuXG4gIGluaXRpYWxSZW5kZXI6IChzdGF0ZSkgLT5cbiAgICAoQGNvbmZpZ3NJbWFnZVN0b3JhZ2UuZmlsdGVyIFwiW2RhdGEtdmFsdWU9JyN7c3RhdGUuc3RvcmFnZX0nXVwiKS50cmlnZ2VyIFwiY2xpY2tcIlxuICAgIChAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2UtbW9kYWwtc3RvcmFnZS1mcmFtZVwiKS5oaWRlKClcbiAgICAoQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLW1vZGFsLXN0b3JhZ2UtI3tzdGF0ZS5zdG9yYWdlfVwiKS5zaG93KClcbiAgICBAY29uZmlnc0ltYWdlUGF0aC52YWwgc3RhdGUucGF0aFxuICAgIEBjb25maWdzSW1hZ2VXaWR0aC52YWwgc3RhdGUud2lkdGhcbiAgICBAY29uZmlnc0ltYWdlSGVpZ2h0LnZhbCBzdGF0ZS5oZWlnaHRcbiAgICBAY29uZmlnc0ltYWdlU291cmNlLnZhbCBzdGF0ZS5zb3VyY2VcbiAgICBAY29uZmlnc0ltYWdlUzNBY2Nlc3NLZXkudmFsIHN0YXRlLnMzQWNjZXNzS2V5XG4gICAgQGNvbmZpZ3NJbWFnZVMzU2VjcmV0S2V5LnZhbCBcIlwiXG4gICAgQGNvbmZpZ3NJbWFnZVMzQnVja2V0LnZhbCBzdGF0ZS5zM0J1Y2tldFxuICAgIEBjb25maWdzSW1hZ2VTM1BhdGgudmFsIHN0YXRlLnMzUGF0aFxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBjb25maWdzSW1hZ2VNb2RlbC5nZXRTdGF0ZSgpXG4gICAgQHVuYmluZCgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsIFwiVHlwZUltYWdlTW9kZWxcIixcbiAgdXBkYXRlU3RvcmFnZTogKHZhbHVlKSAtPiBAc3RhdGUuc3RvcmFnZSA9IHZhbHVlXG5cbiAgdXBkYXRlUGF0aDogKHBhdGgpIC0+IEBzdGF0ZS5wYXRoID0gcGF0aFxuICB1cGRhdGVQYXRoOiAodmFsdWUpIC0+IEBzdGF0ZS5wYXRoID0gdmFsdWVcbiAgdXBkYXRlV2lkdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLndpZHRoID0gdmFsdWVcbiAgdXBkYXRlSGVpZ2h0OiAodmFsdWUpIC0+IEBzdGF0ZS5oZWlnaHQgPSB2YWx1ZVxuICB1cGRhdGVTb3VyY2U6ICh2YWx1ZSkgLT4gQHN0YXRlLnNvdXJjZSA9IHZhbHVlXG5cbiAgdXBkYXRlUzNBY2Nlc3NLZXk6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzQWNjZXNzS2V5ID0gdmFsdWVcbiAgdXBkYXRlUzNTZWNyZXRLZXk6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzU2VjcmV0S2V5ID0gdmFsdWVcbiAgdXBkYXRlUzNCdWNrZXQ6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzQnVja2V0ID0gdmFsdWVcbiAgdXBkYXRlUzNQYXRoOiAodmFsdWUpIC0+IEBzdGF0ZS5zM1BhdGggPSB2YWx1ZVxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlUmFkaW9Nb2RlbFwiLFxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcblxuICB1cGRhdGVOdW1PcHRpb25zOiAodmFsdWUpIC0+XG4gICAgdmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcbiAgICBkZWZhdWx0RGF0YSA9IEBzdGF0ZS5kZWZhdWx0RGF0YVxuICAgIGlmIHZhbHVlID4gQHN0YXRlLm51bU9wdGlvbnNcbiAgICAgIGZvciBpIGluIFtAc3RhdGUubnVtT3B0aW9ucyArIDEuLnZhbHVlXVxuICAgICAgICBkZWZhdWx0RGF0YS5wdXNoIFwiXCJcbiAgICBlbHNlXG4gICAgICBmb3IgaSBpbiBbdmFsdWUgKyAxLi5Ac3RhdGUubnVtT3B0aW9uc11cbiAgICAgICAgZGVmYXVsdERhdGEucG9wKClcbiAgICAgIGlmIEBzdGF0ZS5kZWZhdWx0VmFsdWUgPj0gdmFsdWVcbiAgICAgICAgQHNldCBkZWZhdWx0VmFsdWU6IC0xXG4gICAgQHN0YXRlLm51bU9wdGlvbnMgPSB2YWx1ZVxuICAgIEBzZXQgZGVmYXVsdERhdGE6IGRlZmF1bHREYXRhXG5cbiAgdXBkYXRlRGVmYXVsdFZhbHVlOiAodmFsdWUpIC0+IEBzdGF0ZS5kZWZhdWx0VmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcblxuICB1cGRhdGVEZWZhdWx0RGF0YU9wdGlvbjogKGluZGV4LCB2YWx1ZSkgLT4gQHN0YXRlLmRlZmF1bHREYXRhW2luZGV4XSA9IHZhbHVlXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXIuY29mZmVlXCJcbmNvbmZpZ3NSYWRpb01vZGVsID0gcmVxdWlyZSBcInJhZGlvL2NvbmZpZ3NSYWRpb01vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlldyBcIlR5cGVSYWRpb1ZpZXdcIixcbiAgbW9kZWw6IGNvbmZpZ3NSYWRpb01vZGVsXG5cbiAgaW5pdGlhbDogLT5cbiAgICBAb3B0aW9uc0NvbnRhaW4gPSBSZW5kZXIgKCQgXCJAY29uZmlncy1yYWRpby1vcHRpb25zLWNvbnRhaW5cIiksIFwidHlwZXNfcmFkaW9fb3B0aW9uc1wiXG4gICAgQGNvbmZpZ3NSYWRpb051bU9wdGlvbnMgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtcmFkaW8tbnVtLW9wdGlvbnNcIlxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcInBvcHVwLWNsb3NlOiBjb250YWluXCI6IChlKSAtPiBAdW5iaW5kKClcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtcmFkaW8tbnVtLW9wdGlvbnNcIjogKGUpIC0+IGNvbmZpZ3NSYWRpb01vZGVsLnVwZGF0ZU51bU9wdGlvbnMgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtcmFkaW8tb3B0aW9uXCI6IChlKSAtPiBjb25maWdzUmFkaW9Nb2RlbC51cGRhdGVEZWZhdWx0VmFsdWUgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtcmFkaW8tb3B0aW9uLWxhYmVsXCI6IChlKSAtPiBjb25maWdzUmFkaW9Nb2RlbC51cGRhdGVEZWZhdWx0RGF0YU9wdGlvbiAoQGdldEluZGV4QnlFdmVudCBlKSwgZS50YXJnZXQudmFsdWVcblxuICBnZXRJbmRleEJ5RXZlbnQ6IChlKSAtPlxuICAgICRpdGVtID0gJCBlLnRhcmdldFxuICAgICRpdGVtLmRhdGEgXCJpbmRleFwiXG5cbiAgaW5pdGlhbFJlbmRlcjogKHN0YXRlKSAtPlxuICAgIEBjb25maWdzUmFkaW9OdW1PcHRpb25zLnZhbCBzdGF0ZS5udW1PcHRpb25zXG4gICAgQHJlbmRlckRlZmF1bHRWYWx1ZSBzdGF0ZVxuICAgIEByZW5kZXJEZWZhdWx0RGF0YSBzdGF0ZVxuXG4gIHJlbmRlckRlZmF1bHREYXRhOiAoc3RhdGUpIC0+IEBvcHRpb25zQ29udGFpbi5yZW5kZXIgb3B0aW9uczogc3RhdGUuZGVmYXVsdERhdGEsIGN1cnJlbnRWYWx1ZTogc3RhdGUuZGVmYXVsdFZhbHVlXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIGNvbmZpZ3NSYWRpb01vZGVsLmdldFN0YXRlKClcbiAgICBAdW5iaW5kKClcbiAgICByZXR1cm4gZmFsc2VcblxuICByZW5kZXJEZWZhdWx0VmFsdWU6IChzdGF0ZSkgLT5cbiAgICBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtcmFkaW8tb3B0aW9uXCJcbiAgICAuZmlsdGVyIFwiW3ZhbHVlPSN7c3RhdGUuZGVmYXVsdFZhbHVlfV1cIlxuICAgIC5wcm9wIFwiY2hlY2tlZFwiLCB0cnVlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsIFwiVHlwZVJhZGlvTW9kZWxcIixcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG5cbiAgdXBkYXRlTnVtT3B0aW9uczogKHZhbHVlKSAtPlxuICAgIHZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG4gICAgZGVmYXVsdERhdGEgPSBAc3RhdGUuZGVmYXVsdERhdGFcbiAgICBpZiB2YWx1ZSA+IEBzdGF0ZS5udW1PcHRpb25zXG4gICAgICBmb3IgaSBpbiBbQHN0YXRlLm51bU9wdGlvbnMgKyAxLi52YWx1ZV1cbiAgICAgICAgZGVmYXVsdERhdGEucHVzaCBcIlwiXG4gICAgZWxzZVxuICAgICAgZm9yIGkgaW4gW3ZhbHVlICsgMS4uQHN0YXRlLm51bU9wdGlvbnNdXG4gICAgICAgIGRlZmF1bHREYXRhLnBvcCgpXG4gICAgICBpZiBAc3RhdGUuZGVmYXVsdFZhbHVlID49IHZhbHVlXG4gICAgICAgIEBzZXQgZGVmYXVsdFZhbHVlOiAtMVxuICAgIEBzdGF0ZS5udW1PcHRpb25zID0gdmFsdWVcbiAgICBAc2V0IGRlZmF1bHREYXRhOiBkZWZhdWx0RGF0YVxuXG4gIHVwZGF0ZURlZmF1bHRWYWx1ZTogKHZhbHVlKSAtPiBAc3RhdGUuZGVmYXVsdFZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG5cbiAgdXBkYXRlRGVmYXVsdERhdGFPcHRpb246IChpbmRleCwgdmFsdWUpIC0+IEBzdGF0ZS5kZWZhdWx0RGF0YVtpbmRleF0gPSB2YWx1ZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIlR5cGVUYWJsZU1vZGVsXCIsXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuXG4gIHVwZGF0ZUNvbHVtbnM6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSA9IHBhcnNlSW50IHZhbHVlLCAxMFxuICAgIGlmIHZhbHVlID4gQHN0YXRlLmNvbHVtbnNcbiAgICAgIGZvciByb3cgaW4gQHN0YXRlLmRlZmF1bHREYXRhXG4gICAgICAgIGZvciBpIGluIFtAc3RhdGUuY29sdW1ucyArIDEuLnZhbHVlXVxuICAgICAgICAgIHJvdy5wdXNoIFwiXCJcbiAgICBlbHNlIGlmIHZhbHVlIDwgQHN0YXRlLmNvbHVtbnNcbiAgICAgIGZvciByb3cgaW4gQHN0YXRlLmRlZmF1bHREYXRhXG4gICAgICAgIGZvciBpIGluIFt2YWx1ZSArIDEuLkBzdGF0ZS5jb2x1bW5zXVxuICAgICAgICAgIHJvdy5wb3AoKVxuICAgIEBzZXQgY29sdW1uczogdmFsdWVcblxuICB1cGRhdGVSb3dzOiAodmFsdWUpIC0+XG4gICAgdmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcbiAgICBpZiB2YWx1ZSA+IEBzdGF0ZS5yb3dzXG4gICAgICBmb3Igcm93IGluIFtAc3RhdGUucm93cyArIDEuLnZhbHVlXVxuICAgICAgICByb3cgPSBbXVxuICAgICAgICBmb3IgaSBpbiBbMS4uQHN0YXRlLmNvbHVtbnNdXG4gICAgICAgICAgcm93LnB1c2ggXCJcIlxuICAgICAgICBAc3RhdGUuZGVmYXVsdERhdGEucHVzaCByb3dcbiAgICBlbHNlIGlmIHZhbHVlIDwgQHN0YXRlLnJvd3NcbiAgICAgIGZvciByb3cgaW4gW3ZhbHVlICsgMS4uQHN0YXRlLnJvd3NdXG4gICAgICAgIEBzdGF0ZS5kZWZhdWx0RGF0YS5wb3AoKVxuICAgIEBzZXQgcm93czogdmFsdWVcblxuICB1cGRhdGVDZWxsRGF0YTogKHJvdywgY29sdW1uLCB2YWx1ZSkgLT4gQHN0YXRlLmRlZmF1bHREYXRhW3Jvd11bY29sdW1uXSA9IHZhbHVlXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXIuY29mZmVlXCJcbmNvbmZpZ3NUYWJsZU1vZGVsID0gcmVxdWlyZSBcInRhYmxlL2NvbmZpZ3NUYWJsZU1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlldyBcIlR5cGVUYWJsZVZpZXdcIixcbiAgbW9kZWw6IGNvbmZpZ3NUYWJsZU1vZGVsXG5cbiAgZXZlbnRzOlxuICAgIFwic3VibWl0OiBAY29uZmlncy1mb3JtXCI6IFwic3VibWl0Q29uZmlnc0Zvcm1cIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy10YWJsZS1yb3dzXCI6IFwiY2hhbmdlQ29uZmlnc1RhYmxlUm93c1wiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLXRhYmxlLWNvbHVtbnNcIjogXCJjaGFuZ2VDb25maWdzVGFibGVDb2x1bW5zXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtdGFibGUtY2VsbFwiOiAoZSkgLT5cbiAgICAgICRjZWxsID0gJCBlLnRhcmdldFxuICAgICAgY29uZmlnc1RhYmxlTW9kZWwudXBkYXRlQ2VsbERhdGEgKCRjZWxsLmRhdGEgXCJyb3dcIiksICgkY2VsbC5kYXRhIFwiY29sdW1uXCIpLCAoJGNlbGwudmFsKCkpXG5cbiAgICBcImtleWRvd246IEBjb25maWdzLXRhYmxlLXJvd3NcIjogKGUpIC0+XG4gICAgICBAY2hhbmdlQ29uZmlnc1RhYmxlUm93cyBlXG4gICAgICBpZiBlLmtleUNvZGUgPT0gMTMgdGhlbiBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIFwia2V5ZG93bjogQGNvbmZpZ3MtdGFibGUtY29sdW1uc1wiOiAoZSkgLT5cbiAgICAgIEBjaGFuZ2VDb25maWdzVGFibGVDb2x1bW5zIGVcbiAgICAgIGlmIGUua2V5Q29kZSA9PSAxMyB0aGVuIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQHVuYmluZCgpXG5cbiAgY2hhbmdlQ29uZmlnc1RhYmxlUm93czogKGUpIC0+IGNvbmZpZ3NUYWJsZU1vZGVsLnVwZGF0ZVJvd3MgZS50YXJnZXQudmFsdWVcbiAgY2hhbmdlQ29uZmlnc1RhYmxlQ29sdW1uczogKGUpIC0+IGNvbmZpZ3NUYWJsZU1vZGVsLnVwZGF0ZUNvbHVtbnMgZS50YXJnZXQudmFsdWVcblxuICBpbml0aWFsOiAtPlxuICAgIEB0Ym9keUNvbnRhaW4gPSBSZW5kZXIgKCQgXCJAY29uZmlncy10YWJsZS10Ym9keVwiKSwgXCJ0eXBlc190YWJsZV90Ym9keVwiXG5cbiAgaW5pdGlhbFJlbmRlcjogKHN0YXRlKSAtPlxuICAgIChAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtdGFibGUtY29sdW1uc1wiKS52YWwgc3RhdGUuY29sdW1uc1xuICAgIChAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtdGFibGUtcm93c1wiKS52YWwgc3RhdGUucm93c1xuICAgIEByZW5kZXJUYWJsZSBzdGF0ZVxuXG4gIHJlbmRlckNvbHVtbnM6IFwicmVuZGVyVGFibGVcIlxuICByZW5kZXJSb3dzOiBcInJlbmRlclRhYmxlXCJcblxuICByZW5kZXJUYWJsZTogKHN0YXRlKSAtPiBAdGJvZHlDb250YWluLnJlbmRlciBkYXRhOiBzdGF0ZS5kZWZhdWx0RGF0YVxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBjb25maWdzVGFibGVNb2RlbC5nZXRTdGF0ZSgpXG4gICAgQHVuYmluZCgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsIFwiVHlwZVRhYmxlTW9kZWxcIixcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG5cbiAgdXBkYXRlQ29sdW1uczogKHZhbHVlKSAtPlxuICAgIHZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG4gICAgaWYgdmFsdWUgPiBAc3RhdGUuY29sdW1uc1xuICAgICAgZm9yIHJvdyBpbiBAc3RhdGUuZGVmYXVsdERhdGFcbiAgICAgICAgZm9yIGkgaW4gW0BzdGF0ZS5jb2x1bW5zICsgMS4udmFsdWVdXG4gICAgICAgICAgcm93LnB1c2ggXCJcIlxuICAgIGVsc2UgaWYgdmFsdWUgPCBAc3RhdGUuY29sdW1uc1xuICAgICAgZm9yIHJvdyBpbiBAc3RhdGUuZGVmYXVsdERhdGFcbiAgICAgICAgZm9yIGkgaW4gW3ZhbHVlICsgMS4uQHN0YXRlLmNvbHVtbnNdXG4gICAgICAgICAgcm93LnBvcCgpXG4gICAgQHNldCBjb2x1bW5zOiB2YWx1ZVxuXG4gIHVwZGF0ZVJvd3M6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSA9IHBhcnNlSW50IHZhbHVlLCAxMFxuICAgIGlmIHZhbHVlID4gQHN0YXRlLnJvd3NcbiAgICAgIGZvciByb3cgaW4gW0BzdGF0ZS5yb3dzICsgMS4udmFsdWVdXG4gICAgICAgIHJvdyA9IFtdXG4gICAgICAgIGZvciBpIGluIFsxLi5Ac3RhdGUuY29sdW1uc11cbiAgICAgICAgICByb3cucHVzaCBcIlwiXG4gICAgICAgIEBzdGF0ZS5kZWZhdWx0RGF0YS5wdXNoIHJvd1xuICAgIGVsc2UgaWYgdmFsdWUgPCBAc3RhdGUucm93c1xuICAgICAgZm9yIHJvdyBpbiBbdmFsdWUgKyAxLi5Ac3RhdGUucm93c11cbiAgICAgICAgQHN0YXRlLmRlZmF1bHREYXRhLnBvcCgpXG4gICAgQHNldCByb3dzOiB2YWx1ZVxuXG4gIHVwZGF0ZUNlbGxEYXRhOiAocm93LCBjb2x1bW4sIHZhbHVlKSAtPiBAc3RhdGUuZGVmYXVsdERhdGFbcm93XVtjb2x1bW5dID0gdmFsdWVcbiJdfQ==
