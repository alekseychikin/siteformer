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
  Popup.open("@configs-popup");
  views[field.type].bind($("@configs-popup"));
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
    return this.set({
      title: value
    });
  },
  updateAlias: function(value) {
    return this.set({
      alias: value
    });
  },
  updateModule: function(value) {
    return this.set({
      module: value
    });
  },
  updateFieldTitle: function(index, value) {
    var fields;
    fields = this.state.fields.slice();
    fields[index].title = value;
    return this.set({
      fields: fields
    });
  },
  updateFieldAlias: function(index, value) {
    var fields;
    fields = this.state.fields.slice();
    fields[index].alias = value;
    return this.set({
      fields: fields
    });
  },
  updateFieldType: function(index, value) {
    var fields;
    fields = this.state.fields.slice();
    fields[index].type = value;
    this.resetSettings(index);
    return this.set({
      fields: fields
    });
  },
  resetSettings: function(index) {
    var fields, i, len, ref, type, typeItem;
    fields = this.state.fields.slice();
    type = fields[index].type;
    ref = this.state.types;
    for (i = 0, len = ref.length; i < len; i++) {
      typeItem = ref[i];
      if (typeItem.alias === type) {
        fields[index].settings = this.clone(typeItem.defaultSettings);
      }
    }
    return this.set({
      fields: fields
    });
  },
  removeField: function(index) {
    var fields;
    fields = this.state.fields.slice();
    fields.splice(index, 1);
    return this.set({
      fields: fields
    });
  },
  getFieldByIndex: function(index) {
    return this.clone(this.state.fields[index]);
  },
  saveFieldConfigs: function(form) {
    var fields, index;
    index = form.index;
    delete form.index;
    fields = this.state.fields.slice();
    fields[index].settings = form;
    return this.set({
      fields: fields
    });
  },
  save: function() {
    console.log(this.state);
    return httpPost("/cms/configs/save/__json/", this.state).then((function(_this) {
      return function(response) {
        if (_this.state.id != null) {
          _this.set({
            fields: response.section.fields
          });
          return _this.set({
            id: response.section.id
          });
        }
      };
    })(this))["catch"](function(response) {
      return console.error(response.error);
    });
  }
});


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee","q":"q"}],3:[function(require,module,exports){
var $, AddModel, Popup, Render, View, tableModuleFields;

$ = require("jquery-plugins.coffee");

View = require("view.coffee");

Render = require("render");

Popup = require("popup");

AddModel = require("./addModel.coffee");

tableModuleFields = require("sections/configs/table-module-fields.tmpl.js");

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
    return this.tbodyContain = Render(tableModuleFields, ($("@tbody-module-fields"))[0]);
  },
  render: function(state) {
    return this.tbodyContain(state);
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


},{"./addModel.coffee":2,"jquery-plugins.coffee":"jquery-plugins.coffee","popup":"popup","render":"render","sections/configs/table-module-fields.tmpl.js":22,"view.coffee":"view.coffee"}],4:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeCheckboxModel", {
  getState: function() {
    return this.state;
  },
  updateNumOptions: function(value) {
    var defaultData, i, j, k, numOpts, ref, ref1, ref2, ref3;
    value = parseInt(value, 10);
    numOpts = parseInt(this.state.numOptions, 10);
    defaultData = this.state.defaultData.slice();
    if (value > numOpts) {
      for (i = j = ref = numOpts + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
        defaultData.push({
          label: "",
          checked: false
        });
      }
    } else {
      for (i = k = ref2 = value + 1, ref3 = numOpts; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
        defaultData.pop();
      }
    }
    this.set({
      numOptions: value
    });
    return this.set({
      defaultData: defaultData
    });
  },
  updateDefaultDataOptionChecked: function(index, value) {
    var data;
    data = this.state.defaultData.slice();
    data[index].checked = value;
    return this.set({
      defaultData: data
    });
  },
  updateDefaultDataOption: function(index, value) {
    var data;
    data = this.state.defaultData.slice();
    data[index].label = value;
    return this.set({
      defaultData: data
    });
  }
});


},{"model.coffee":"model.coffee"}],5:[function(require,module,exports){
var Render, View, configsCheckboxModel, modalWindowTemplate;

View = require("view.coffee");

configsCheckboxModel = require("checkbox/configsCheckboxModel.coffee");

Render = require("render");

modalWindowTemplate = require("types/checkbox/modal.tmpl.js");

module.exports = View("TypeCheckboxView", {
  model: configsCheckboxModel,
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-checkbox-num-options": function(e) {
      return configsCheckboxModel.updateNumOptions(e.target.value);
    },
    "change: @configs-checkbox-option": function(e) {
      return configsCheckboxModel.updateDefaultDataOptionChecked(this.getIndexByEvent(e), e.target.checked);
    },
    "change: @configs-checkbox-option-label": function(e) {
      return configsCheckboxModel.updateDefaultDataOption(this.getIndexByEvent(e), e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.unbind();
    }
  },
  getIndexByEvent: function(e) {
    var $item;
    $item = $(e.target);
    return $item.data("index");
  },
  render: function(state) {
    return this.modalContain(state);
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", configsCheckboxModel.getState());
    this.unbind();
    return false;
  }
});


},{"checkbox/configsCheckboxModel.coffee":6,"render":"render","types/checkbox/modal.tmpl.js":23,"view.coffee":"view.coffee"}],6:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeCheckboxModel", {
  getState: function() {
    return this.state;
  },
  updateNumOptions: function(value) {
    var defaultData, i, j, k, numOpts, ref, ref1, ref2, ref3;
    value = parseInt(value, 10);
    numOpts = parseInt(this.state.numOptions, 10);
    defaultData = this.state.defaultData.slice();
    if (value > numOpts) {
      for (i = j = ref = numOpts + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
        defaultData.push({
          label: "",
          checked: false
        });
      }
    } else {
      for (i = k = ref2 = value + 1, ref3 = numOpts; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
        defaultData.pop();
      }
    }
    this.set({
      numOptions: value
    });
    return this.set({
      defaultData: defaultData
    });
  },
  updateDefaultDataOptionChecked: function(index, value) {
    var data;
    data = this.state.defaultData.slice();
    data[index].checked = value;
    return this.set({
      defaultData: data
    });
  },
  updateDefaultDataOption: function(index, value) {
    var data;
    data = this.state.defaultData.slice();
    data[index].label = value;
    return this.set({
      defaultData: data
    });
  }
});


},{"model.coffee":"model.coffee"}],7:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeFileModel", {
  updateStorage: function(value) {
    return this.set({
      storage: value
    });
  },
  updatePath: function(value) {
    return this.set({
      path: value
    });
  },
  updateS3AccessKey: function(value) {
    return this.set({
      s3AccessKey: value
    });
  },
  updateS3SecretKey: function(value) {
    return this.set({
      s3SecretKey: value
    });
  },
  updateS3Bucket: function(value) {
    return this.set({
      s3Bucket: value
    });
  },
  updateS3Path: function(value) {
    return this.set({
      s3Path: value
    });
  },
  getState: function() {
    return this.state;
  }
});


},{"model.coffee":"model.coffee"}],8:[function(require,module,exports){
var Render, View, configsFileModel, modalWindowTemplate;

View = require("view.coffee");

configsFileModel = require("file/configsFileModel.coffee");

Render = require("render");

modalWindowTemplate = require("types/file/modal.tmpl.js");

module.exports = View("TypeFileView", {
  model: configsFileModel,
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
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
    },
    "popup-close: contain": function(e) {
      return this.unbind();
    }
  },
  render: function(state) {
    this.modalContain(state);
    return ($("@tabs")).tabs();
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", configsFileModel.getState());
    this.unbind();
    return false;
  }
});


},{"file/configsFileModel.coffee":9,"render":"render","types/file/modal.tmpl.js":24,"view.coffee":"view.coffee"}],9:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeFileModel", {
  updateStorage: function(value) {
    return this.set({
      storage: value
    });
  },
  updatePath: function(value) {
    return this.set({
      path: value
    });
  },
  updateS3AccessKey: function(value) {
    return this.set({
      s3AccessKey: value
    });
  },
  updateS3SecretKey: function(value) {
    return this.set({
      s3SecretKey: value
    });
  },
  updateS3Bucket: function(value) {
    return this.set({
      s3Bucket: value
    });
  },
  updateS3Path: function(value) {
    return this.set({
      s3Path: value
    });
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
    return this.set({
      storage: value
    });
  },
  updatePath: function(value) {
    return this.set({
      path: value
    });
  },
  updateWidth: function(value) {
    return this.set({
      width: value
    });
  },
  updateHeight: function(value) {
    return this.set({
      height: value
    });
  },
  updatePreviewWidth: function(value) {
    return this.set({
      previewWidth: value
    });
  },
  updatePreviewHeight: function(value) {
    return this.set({
      previewHeight: value
    });
  },
  updateS3AccessKey: function(value) {
    return this.set({
      s3AccessKey: value
    });
  },
  updateS3SecretKey: function(value) {
    return this.set({
      s3SecretKey: value
    });
  },
  updateS3Bucket: function(value) {
    return this.set({
      s3Bucket: value
    });
  },
  updateS3Path: function(value) {
    return this.set({
      s3Path: value
    });
  },
  getState: function() {
    return this.state;
  }
});


},{"model.coffee":"model.coffee"}],11:[function(require,module,exports){
var Render, View, configsGalleryModel, modalWindowTemplate;

View = require("view.coffee");

configsGalleryModel = require("gallery/configsGalleryModel.coffee");

Render = require("render");

modalWindowTemplate = require("types/gallery/modal.tmpl.js");

module.exports = View("TypeGalleryView", {
  model: configsGalleryModel,
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
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
    },
    "popup-close: contain": function(e) {
      return this.unbind();
    }
  },
  render: function(state) {
    this.modalContain(state);
    return ($("@tabs")).tabs();
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", configsGalleryModel.getState());
    this.unbind();
    return false;
  }
});


},{"gallery/configsGalleryModel.coffee":12,"render":"render","types/gallery/modal.tmpl.js":25,"view.coffee":"view.coffee"}],12:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeGalleryModel", {
  updateStorage: function(value) {
    return this.set({
      storage: value
    });
  },
  updatePath: function(value) {
    return this.set({
      path: value
    });
  },
  updateWidth: function(value) {
    return this.set({
      width: value
    });
  },
  updateHeight: function(value) {
    return this.set({
      height: value
    });
  },
  updatePreviewWidth: function(value) {
    return this.set({
      previewWidth: value
    });
  },
  updatePreviewHeight: function(value) {
    return this.set({
      previewHeight: value
    });
  },
  updateS3AccessKey: function(value) {
    return this.set({
      s3AccessKey: value
    });
  },
  updateS3SecretKey: function(value) {
    return this.set({
      s3SecretKey: value
    });
  },
  updateS3Bucket: function(value) {
    return this.set({
      s3Bucket: value
    });
  },
  updateS3Path: function(value) {
    return this.set({
      s3Path: value
    });
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
    return this.set({
      storage: value
    });
  },
  updatePath: function(value) {
    return this.set({
      path: value
    });
  },
  updateS3AccessKey: function(value) {
    return this.set({
      s3AccessKey: value
    });
  },
  updateS3SecretKey: function(value) {
    return this.set({
      s3SecretKey: value
    });
  },
  updateS3Bucket: function(value) {
    return this.set({
      s3Bucket: value
    });
  },
  updateS3Path: function(value) {
    return this.set({
      s3Path: value
    });
  },
  updateWidth: function(value) {
    return this.set({
      width: value
    });
  },
  updateHeight: function(value) {
    return this.set({
      height: value
    });
  },
  updateSource: function(value) {
    return this.set({
      source: value
    });
  },
  getState: function() {
    return this.state;
  }
});


},{"model.coffee":"model.coffee"}],14:[function(require,module,exports){
var Render, View, configsImageModel, modalWindowTemplate;

View = require("view.coffee");

configsImageModel = require("image/configsImageModel.coffee");

Render = require("render");

modalWindowTemplate = require("types/image/modal.tmpl.js");

module.exports = View("TypeImageView", {
  model: configsImageModel,
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-image-storage": function(e) {
      return configsImageModel.updateStorage(($(e.target)).data("value"));
    },
    "change: @configs-image-path": function(e) {
      return configsImageModel.updatePath(e.target.value);
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
  render: function(state) {
    this.modalContain(state);
    return ($("@tabs")).tabs();
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", configsImageModel.getState());
    this.unbind();
    return false;
  }
});


},{"image/configsImageModel.coffee":15,"render":"render","types/image/modal.tmpl.js":26,"view.coffee":"view.coffee"}],15:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeImageModel", {
  updateStorage: function(value) {
    return this.set({
      storage: value
    });
  },
  updatePath: function(value) {
    return this.set({
      path: value
    });
  },
  updateS3AccessKey: function(value) {
    return this.set({
      s3AccessKey: value
    });
  },
  updateS3SecretKey: function(value) {
    return this.set({
      s3SecretKey: value
    });
  },
  updateS3Bucket: function(value) {
    return this.set({
      s3Bucket: value
    });
  },
  updateS3Path: function(value) {
    return this.set({
      s3Path: value
    });
  },
  updateWidth: function(value) {
    return this.set({
      width: value
    });
  },
  updateHeight: function(value) {
    return this.set({
      height: value
    });
  },
  updateSource: function(value) {
    return this.set({
      source: value
    });
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
    var defaultData, defaultValue, i, j, k, numOpts, ref, ref1, ref2, ref3;
    value = parseInt(value, 10);
    numOpts = parseInt(this.state.numOptions, 10);
    defaultValue = parseInt(this.state.defaultValue, 10);
    defaultData = this.state.defaultData.slice();
    if (value > numOpts) {
      for (i = j = ref = numOpts + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
        defaultData.push("");
      }
    } else {
      for (i = k = ref2 = value + 1, ref3 = numOpts; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
        defaultData.pop();
      }
      if (defaultValue >= value) {
        this.set({
          defaultValue: defaultValue
        });
      }
    }
    this.set({
      numOptions: value
    });
    return this.set({
      defaultData: defaultData
    });
  },
  updateDefaultValue: function(value) {
    return this.set({
      defaultValue: parseInt(value, 10)
    });
  },
  updateDefaultDataOption: function(index, value) {
    var data;
    data = this.state.defaultData.slice();
    data[index] = value;
    return this.set({
      defaultData: data
    });
  }
});


},{"model.coffee":"model.coffee"}],17:[function(require,module,exports){
var Render, View, configsRadioModel, modalWindowTemplate;

View = require("view.coffee");

configsRadioModel = require("radio/configsRadioModel.coffee");

Render = require("render");

modalWindowTemplate = require("types/radio/modal.tmpl.js");

module.exports = View("TypeRadioView", {
  model: configsRadioModel,
  initial: function() {
    return this.optionsContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-radio-num-options": function(e) {
      return configsRadioModel.updateNumOptions(e.target.value);
    },
    "change: @configs-radio-option": function(e) {
      return configsRadioModel.updateDefaultValue(e.target.value);
    },
    "change: @configs-radio-option-label": function(e) {
      return configsRadioModel.updateDefaultDataOption(this.getIndexByEvent(e), e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.unbind();
    }
  },
  getIndexByEvent: function(e) {
    var $item;
    $item = $(e.target);
    return $item.data("index");
  },
  render: function(state) {
    return this.optionsContain(state);
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", configsRadioModel.getState());
    this.unbind();
    return false;
  }
});


},{"radio/configsRadioModel.coffee":18,"render":"render","types/radio/modal.tmpl.js":27,"view.coffee":"view.coffee"}],18:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeRadioModel", {
  getState: function() {
    return this.state;
  },
  updateNumOptions: function(value) {
    var defaultData, defaultValue, i, j, k, numOpts, ref, ref1, ref2, ref3;
    value = parseInt(value, 10);
    numOpts = parseInt(this.state.numOptions, 10);
    defaultValue = parseInt(this.state.defaultValue, 10);
    defaultData = this.state.defaultData.slice();
    if (value > numOpts) {
      for (i = j = ref = numOpts + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
        defaultData.push("");
      }
    } else {
      for (i = k = ref2 = value + 1, ref3 = numOpts; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
        defaultData.pop();
      }
      if (defaultValue >= value) {
        this.set({
          defaultValue: defaultValue
        });
      }
    }
    this.set({
      numOptions: value
    });
    return this.set({
      defaultData: defaultData
    });
  },
  updateDefaultValue: function(value) {
    return this.set({
      defaultValue: parseInt(value, 10)
    });
  },
  updateDefaultDataOption: function(index, value) {
    var data;
    data = this.state.defaultData.slice();
    data[index] = value;
    return this.set({
      defaultData: data
    });
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
    var data;
    data = this.state.defaultData.slice();
    data[row][column] = value;
    return this.set({
      defaultData: data
    });
  }
});


},{"model.coffee":"model.coffee"}],20:[function(require,module,exports){
var Render, View, configsTableModel, modalWindowTemplate;

View = require("view.coffee");

configsTableModel = require("table/configsTableModel.coffee");

Render = require("render");

modalWindowTemplate = require("types/table/modal.tmpl.js");

module.exports = View("TypeTableView", {
  model: configsTableModel,
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
  },
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
  render: function(state) {
    return this.modalContain(state);
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", configsTableModel.getState());
    this.unbind();
    return false;
  }
});


},{"render":"render","table/configsTableModel.coffee":21,"types/table/modal.tmpl.js":28,"view.coffee":"view.coffee"}],21:[function(require,module,exports){
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
    var data;
    data = this.state.defaultData.slice();
    data[row][column] = value;
    return this.set({
      defaultData: data
    });
  }
});


},{"model.coffee":"model.coffee"}],22:[function(require,module,exports){
(function (factory)
    {
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
      }
      else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        define('first-try', [], factory());
      }
      else {
        window.tableModuleFields = factory();
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
      return function (obj)
      {
        return create(function (childs)
        {with (obj) {var arr0 = fields; for (index in arr0) if (_hasProp.call(arr0, index)) {
field = arr0[index];
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form-table__row';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += index;
attrs.push(['data-key', attr]);
})();
childs.push(create('tr', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form-table__cell';
attrs.push(['class', attr]);
})();
childs.push(create('td', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += field['title'];
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'field-title';
attrs.push(['role', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form-table__cell';
attrs.push(['class', attr]);
})();
childs.push(create('td', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += field['alias'];
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'field-alias';
attrs.push(['role', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form-table__cell';
attrs.push(['class', attr]);
})();
childs.push(create('td', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'select';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__select';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'field-type';
attrs.push(['role', attr]);
})();
childs.push(create('select', attrs, function (childs) {
hasSettings = false;var arr1 = types; for (type in arr1) if (_hasProp.call(arr1, type)) {
type = arr1[type];
(function () {
var attrs = [];
(function () {
var attr = '';
attr += type['alias'];
attrs.push(['value', attr]);
})();
if ( field['type'] == type['alias']) {
(function () {
var attr = '';
attrs.push(['selected', attr]);
})();
}
childs.push(create('option', attrs, function (childs) {
childs.push(type['name'])
}));
})();
if ( field['type'] == type['alias']) {
if ( type['hasSettings']) {
hasSettings = true;}
}
}}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form-table__cell';
attrs.push(['class', attr]);
})();
childs.push(create('td', attrs, function (childs) {
if ( hasSettings) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'btn-config-field';
attrs.push(['role', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Н');
}));
})();
}
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form-table__cell';
attrs.push(['class', attr]);
})();
childs.push(create('td', attrs, function (childs) {
if ( count(fields) > 1) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'btn-remove-field';
attrs.push(['role', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('X');
}));
})();
}
}));
})();
}));
})();
}}})};
    });
},{}],23:[function(require,module,exports){
(function (factory)
    {
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
      }
      else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        define('first-try', [], factory());
      }
      else {
        window.modal = factory();
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
      return function (obj)
      {
        return create(function (childs)
        {with (obj) {(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'popup__head';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Настройки флажков');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attrs.push(['action', attr]);
})();
(function () {
var attr = '';
attr += 'form';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-form';
attrs.push(['role', attr]);
})();
childs.push(create('form', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-checkbox-num-options';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Количество вариантов ответа');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += numOptions;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-checkbox-num-options';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-checkbox-num-options';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Варианты ответов:');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain form__inp-contain--full-width';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-checkbox-options-contain';
attrs.push(['role', attr]);
})();
childs.push(create('div', attrs, function (childs) {
var arr0 = defaultData; for (i in arr0) if (_hasProp.call(arr0, i)) {
option = arr0[i];
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__row-option';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'checkbox';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__checkbox';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-checkbox-option';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += i;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += i;
attrs.push(['data-index', attr]);
})();
(function () {
var attr = '';
attr += 'configs-checkbox-option-';
attr += i;
attrs.push(['id', attr]);
})();
(function () {
var attr = '';
attr += 'configs-checkbox-option';
attrs.push(['name', attr]);
})();
if ( option['checked'] == true || option['checked'] == "true") {
(function () {
var attr = '';
attrs.push(['checked', attr]);
})();
}
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
childs.push(create('label', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--half-width';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += option['label'];
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-checkbox-option-label';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += i;
attrs.push(['data-index', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
}}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__submit';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn form__btn--submit';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Сохранить');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__btn popup__cancel';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Отменить');
}));
})();
}));
})();
}));
})();
}})};
    });
},{}],24:[function(require,module,exports){
(function (factory)
    {
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
      }
      else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        define('first-try', [], factory());
      }
      else {
        window.modal = factory();
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
      return function (obj)
      {
        return create(function (childs)
        {with (obj) {(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'popup__head';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Настройки файла');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attrs.push(['action', attr]);
})();
(function () {
var attr = '';
attr += 'form';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-form';
attrs.push(['role', attr]);
})();
childs.push(create('form', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Хранилище');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'tabs';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'tabs__item';
if ( storage == "local") {
attr += ' tabs__item--active';
}
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'tabs configs-file-storage';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-modal-storage';
attrs.push(['data-group', attr]);
})();
(function () {
var attr = '';
attr += 'local';
attrs.push(['data-value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-modal-storage-local';
attrs.push(['data-frame', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Локальное');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'tabs__item';
if ( storage == "s3") {
attr += ' tabs__item--active';
}
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'tabs configs-file-storage';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-modal-storage';
attrs.push(['data-group', attr]);
})();
(function () {
var attr = '';
attr += 's3';
attrs.push(['data-value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-modal-storage-s3';
attrs.push(['data-frame', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('S3');
}));
})();
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-file-modal-storage-local configs-file-modal-storage-frame';
attrs.push(['role', attr]);
})();
if ( storage != "local") {
(function () {
var attr = '';
attr += 'display: none';
attrs.push(['style', attr]);
})();
}
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-file-path';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Путь');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += path;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-path';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-path';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-file-modal-storage-s3 configs-file-modal-storage-frame';
attrs.push(['role', attr]);
})();
if ( storage != "s3") {
(function () {
var attr = '';
attr += 'display: none';
attrs.push(['style', attr]);
})();
}
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-file-s3-access-key';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Access key');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += s3AccessKey;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-s3-access-key';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-s3-access-key';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-file-s3-secret-key';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Secret key');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'password';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-s3-secret-key';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-s3-secret-key';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-file-s3-bucket';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Bucket');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += s3Bucket;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-s3-bucket';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-s3-bucket';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-file-s3-path';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Путь');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += s3Path;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-s3-path';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-s3-path';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__submit';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn form__btn--submit';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Сохранить');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__btn popup__cancel';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Отменить');
}));
})();
}));
})();
}));
})();
}})};
    });
},{}],25:[function(require,module,exports){
(function (factory)
    {
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
      }
      else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        define('first-try', [], factory());
      }
      else {
        window.modal = factory();
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
      return function (obj)
      {
        return create(function (childs)
        {with (obj) {(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'popup__head';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Настройки галереи');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attrs.push(['action', attr]);
})();
(function () {
var attr = '';
attr += 'form';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-form';
attrs.push(['role', attr]);
})();
childs.push(create('form', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Хранилище');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'tabs';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'tabs__item';
if ( storage == "local") {
attr += ' tabs__item--active';
}
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'tabs configs-gallery-storage';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-modal-storage';
attrs.push(['data-group', attr]);
})();
(function () {
var attr = '';
attr += 'local';
attrs.push(['data-value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-modal-storage-local';
attrs.push(['data-frame', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Локальное');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'tabs__item';
if ( storage == "s3") {
attr += ' tabs__item--active';
}
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'tabs configs-gallery-storage';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-modal-storage';
attrs.push(['data-group', attr]);
})();
(function () {
var attr = '';
attr += 's3';
attrs.push(['data-value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-modal-storage-s3';
attrs.push(['data-frame', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('S3');
}));
})();
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-modal-storage-local configs-gallery-modal-storage-frame';
attrs.push(['role', attr]);
})();
if ( storage != "local") {
(function () {
var attr = '';
attr += 'display: none';
attrs.push(['style', attr]);
})();
}
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-path';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Путь');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += path;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-path';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-path';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-modal-storage-s3 configs-gallery-modal-storage-frame';
attrs.push(['role', attr]);
})();
if ( storage != "s3") {
(function () {
var attr = '';
attr += 'display: none';
attrs.push(['style', attr]);
})();
}
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-s3-access-key';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Access key');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += s3AccessKey;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-s3-access-key';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-s3-access-key';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-s3-secret-key';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Secret key');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'password';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-s3-secret-key';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-s3-secret-key';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-s3-bucket';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Bucket');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += s3Bucket;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-s3-bucket';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-s3-bucket';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-s3-path';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Путь');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += s3Path;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-s3-path';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-s3-path';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-width';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Уменьшить оригинал до размера');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain form__inp-contain--full-width';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += width;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-width';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-width';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__between-inp';
attrs.push(['class', attr]);
})();
childs.push(create('span', attrs, function (childs) {
childs.push('×');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += height;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-height';
attrs.push(['role', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__hint';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Если не задать значение, оно будет вычислено пропорционально');
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-width';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Размер превью');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain form__inp-contain--full-width';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += previewWidth;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-preview-width';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-width';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__between-inp';
attrs.push(['class', attr]);
})();
childs.push(create('span', attrs, function (childs) {
childs.push('×');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += previewHeight;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-preview-height';
attrs.push(['role', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__hint';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Если не задать значение, оно будет вычислено пропорционально');
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__submit';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn form__btn--submit';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Сохранить');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__btn popup__cancel';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Отменить');
}));
})();
}));
})();
}));
})();
}})};
    });
},{}],26:[function(require,module,exports){
(function (factory)
    {
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
      }
      else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        define('first-try', [], factory());
      }
      else {
        window.modal = factory();
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
      return function (obj)
      {
        return create(function (childs)
        {with (obj) {(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'popup__head';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Настройки изображения');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attrs.push(['action', attr]);
})();
(function () {
var attr = '';
attr += 'form';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-form';
attrs.push(['role', attr]);
})();
childs.push(create('form', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Хранилище');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'tabs';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'tabs__item';
if ( storage == "local") {
attr += ' tabs__item--active';
}
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'tabs configs-image-storage';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-modal-storage';
attrs.push(['data-group', attr]);
})();
(function () {
var attr = '';
attr += 'local';
attrs.push(['data-value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-modal-storage-local';
attrs.push(['data-frame', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Локальное');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'tabs__item';
if ( storage == "s3") {
attr += ' tabs__item--active';
}
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'tabs configs-image-storage';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-modal-storage';
attrs.push(['data-group', attr]);
})();
(function () {
var attr = '';
attr += 's3';
attrs.push(['data-value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-modal-storage-s3';
attrs.push(['data-frame', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('S3');
}));
})();
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-modal-storage-local configs-image-modal-storage-frame';
attrs.push(['role', attr]);
})();
if ( storage != "local") {
(function () {
var attr = '';
attr += 'display: none';
attrs.push(['style', attr]);
})();
}
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-path';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Путь');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += path;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-path';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-path';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-modal-storage-s3 configs-image-modal-storage-frame';
attrs.push(['role', attr]);
})();
if ( storage != "s3") {
(function () {
var attr = '';
attr += 'display: none';
attrs.push(['style', attr]);
})();
}
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-s3-access-key';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Access key');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr +=  typeof s3AccessKey !== 'undefined' ? s3AccessKey : '' ;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-s3-access-key';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-s3-access-key';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-s3-secret-key';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Secret key');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'password';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-s3-secret-key';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-s3-secret-key';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-s3-bucket';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Bucket');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr +=  typeof s3Bucket !== 'undefined' ? s3Bucket : '' ;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-s3-bucket';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-s3-bucket';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-s3-path';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Путь');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr +=  typeof s3Path !== 'undefined' ? s3Path : '' ;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-s3-path';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-s3-path';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-width';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Уменьшить до размера');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain form__inp-contain--full-width';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr +=  typeof width !== 'undefined' ? width : '' ;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-width';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-width';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__between-inp';
attrs.push(['class', attr]);
})();
childs.push(create('span', attrs, function (childs) {
childs.push('×');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr +=  typeof height !== 'undefined' ? height : '' ;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-height';
attrs.push(['role', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__hint';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Если не задать значение, оно будет вычислено пропорционально');
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-source';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Источник');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'select';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-source';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-source';
attrs.push(['id', attr]);
})();
childs.push(create('select', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'upload';
attrs.push(['value', attr]);
})();
if ( source == "upload") {
(function () {
var attr = '';
attrs.push(['selected', attr]);
})();
}
childs.push(create('option', attrs, function (childs) {
childs.push('Загрузить изображение');
}));
})();
}));
})();
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__submit';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn form__btn--submit';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Сохранить');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__btn popup__cancel';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Отменить');
}));
})();
}));
})();
}));
})();
}})};
    });
},{}],27:[function(require,module,exports){
(function (factory)
    {
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
      }
      else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        define('first-try', [], factory());
      }
      else {
        window.modal = factory();
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
      return function (obj)
      {
        return create(function (childs)
        {with (obj) {(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'popup__head';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Настройки переключателей');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attrs.push(['action', attr]);
})();
(function () {
var attr = '';
attr += 'form';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-form';
attrs.push(['role', attr]);
})();
childs.push(create('form', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-radio-num-options';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Количество вариантов ответа');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += numOptions;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-num-options';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-num-options';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Варианты ответов:');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain form__inp-contain--full-width';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__row-option';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'radio';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__checkbox';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-option';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += '-1';
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-option--1';
attrs.push(['id', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-option';
attrs.push(['name', attr]);
})();
if ( defaultValue == -1 || defaultValue == -1) {
(function () {
var attr = '';
attrs.push(['checked', attr]);
})();
}
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-radio-option--1';
attrs.push(['for', attr]);
})();
childs.push(create('label', attrs, function (childs) {
(function () {
var attrs = [];
childs.push(create('i', attrs, function (childs) {
childs.push('Ничего не выбрано по умолчанию');
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-radio-options-contain';
attrs.push(['role', attr]);
})();
childs.push(create('div', attrs, function (childs) {
var arr0 = defaultData; for (i in arr0) if (_hasProp.call(arr0, i)) {
option = arr0[i];
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__row-option';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'radio';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__checkbox';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-option';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += i;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-option-';
attr += i;
attrs.push(['id', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-option';
attrs.push(['name', attr]);
})();
if ( defaultValue == i) {
(function () {
var attr = '';
attrs.push(['checked', attr]);
})();
}
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
childs.push(create('label', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--half-width';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += option;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-option-label';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += i;
attrs.push(['data-index', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
}}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__submit';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn form__btn--submit';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Сохранить');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__btn popup__cancel';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Отменить');
}));
})();
}));
})();
}));
})();
}})};
    });
},{}],28:[function(require,module,exports){
(function (factory)
    {
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
      }
      else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        define('first-try', [], factory());
      }
      else {
        window.modal = factory();
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
      return function (obj)
      {
        return create(function (childs)
        {with (obj) {(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'popup__head';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Настройки таблицы');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attrs.push(['action', attr]);
})();
(function () {
var attr = '';
attr += 'form';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-form';
attrs.push(['role', attr]);
})();
childs.push(create('form', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-table-columns';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Колонок по умолчанию');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += columns;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-table-columns';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-table-columns';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-table-rows';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Строк по умолчанию');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += rows;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-table-rows';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-table-rows';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-table-rows';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Шаблон по умолчанию');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain form__inp-contain--full-width form__inp-contain--scroll-wrap';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'table table--straight-sides table--responsive';
attrs.push(['class', attr]);
})();
childs.push(create('table', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-table-tbody';
attrs.push(['role', attr]);
})();
childs.push(create('tbody', attrs, function (childs) {
var arr0 = defaultData; for (rowIndex in arr0) if (_hasProp.call(arr0, rowIndex)) {
row = arr0[rowIndex];
(function () {
var attrs = [];
childs.push(create('tr', attrs, function (childs) {
var arr1 = row; for (columnIndex in arr1) if (_hasProp.call(arr1, columnIndex)) {
column = arr1[columnIndex];
(function () {
var attrs = [];
childs.push(create('td', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += column;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-table-cell';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += rowIndex;
attrs.push(['data-row', attr]);
})();
(function () {
var attr = '';
attr += columnIndex;
attrs.push(['data-column', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}}));
})();
}}));
})();
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__submit';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn form__btn--submit';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Сохранить');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__btn popup__cancel';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Отменить');
}));
})();
}));
})();
}));
})();
}})};
    });
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvc2VjdGlvbnMvY29uZmlncy9hZGRNb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkVmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2NoZWNrYm94L0NvbmZpZ3NDaGVja2JveE1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvY2hlY2tib3gvQ29uZmlnc0NoZWNrYm94Vmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2NoZWNrYm94L2NvbmZpZ3NDaGVja2JveE1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvZmlsZS9Db25maWdzRmlsZU1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvZmlsZS9Db25maWdzRmlsZVZpZXcuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy9maWxlL2NvbmZpZ3NGaWxlTW9kZWwuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy9nYWxsZXJ5L0NvbmZpZ3NHYWxsZXJ5TW9kZWwuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy9nYWxsZXJ5L0NvbmZpZ3NHYWxsZXJ5Vmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2dhbGxlcnkvY29uZmlnc0dhbGxlcnlNb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2ltYWdlL0NvbmZpZ3NJbWFnZU1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvaW1hZ2UvQ29uZmlnc0ltYWdlVmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2ltYWdlL2NvbmZpZ3NJbWFnZU1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvcmFkaW8vQ29uZmlnc1JhZGlvTW9kZWwuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy9yYWRpby9Db25maWdzUmFkaW9WaWV3LmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvcmFkaW8vY29uZmlnc1JhZGlvTW9kZWwuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy90YWJsZS9Db25maWdzVGFibGVNb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL3RhYmxlL0NvbmZpZ3NUYWJsZVZpZXcuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy90YWJsZS9jb25maWdzVGFibGVNb2RlbC5jb2ZmZWUiLCJ0ZW1wL21vZHVsZXMvR1VJLy5jb21waWxlX3RlbXBsYXRlcy9zZWN0aW9ucy9jb25maWdzL3RhYmxlLW1vZHVsZS1maWVsZHMudG1wbC5qcyIsInRlbXAvbW9kdWxlcy9HVUkvLmNvbXBpbGVfdGVtcGxhdGVzL3R5cGVzL2NoZWNrYm94L21vZGFsLnRtcGwuanMiLCJ0ZW1wL21vZHVsZXMvR1VJLy5jb21waWxlX3RlbXBsYXRlcy90eXBlcy9maWxlL21vZGFsLnRtcGwuanMiLCJ0ZW1wL21vZHVsZXMvR1VJLy5jb21waWxlX3RlbXBsYXRlcy90eXBlcy9nYWxsZXJ5L21vZGFsLnRtcGwuanMiLCJ0ZW1wL21vZHVsZXMvR1VJLy5jb21waWxlX3RlbXBsYXRlcy90eXBlcy9pbWFnZS9tb2RhbC50bXBsLmpzIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvdHlwZXMvcmFkaW8vbW9kYWwudG1wbC5qcyIsInRlbXAvbW9kdWxlcy9HVUkvLmNv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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcDFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2p6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJBZGRNb2RlbCA9IHJlcXVpcmUgXCIuL2FkZE1vZGVsLmNvZmZlZVwiXG5BZGRWaWV3ID0gcmVxdWlyZSBcIi4vYWRkVmlldy5jb2ZmZWVcIlxuJCA9IHJlcXVpcmUgXCJqcXVlcnktcGx1Z2lucy5jb2ZmZWVcIlxuXG5tb2RlbHMgPVxuICBpbWFnZTogcmVxdWlyZSBcImltYWdlL0NvbmZpZ3NJbWFnZU1vZGVsLmNvZmZlZVwiXG4gIHRhYmxlOiByZXF1aXJlIFwidGFibGUvQ29uZmlnc1RhYmxlTW9kZWwuY29mZmVlXCJcbiAgZmlsZTogcmVxdWlyZSBcImZpbGUvQ29uZmlnc0ZpbGVNb2RlbC5jb2ZmZWVcIlxuICByYWRpbzogcmVxdWlyZSBcInJhZGlvL0NvbmZpZ3NSYWRpb01vZGVsLmNvZmZlZVwiXG4gIGNoZWNrYm94OiByZXF1aXJlIFwiY2hlY2tib3gvQ29uZmlnc0NoZWNrYm94TW9kZWwuY29mZmVlXCJcbiAgZ2FsbGVyeTogcmVxdWlyZSBcImdhbGxlcnkvQ29uZmlnc0dhbGxlcnlNb2RlbC5jb2ZmZWVcIlxuXG52aWV3cyA9XG4gIGltYWdlOiByZXF1aXJlIFwiaW1hZ2UvQ29uZmlnc0ltYWdlVmlldy5jb2ZmZWVcIlxuICB0YWJsZTogcmVxdWlyZSBcInRhYmxlL0NvbmZpZ3NUYWJsZVZpZXcuY29mZmVlXCJcbiAgZmlsZTogcmVxdWlyZSBcImZpbGUvQ29uZmlnc0ZpbGVWaWV3LmNvZmZlZVwiXG4gIHJhZGlvOiByZXF1aXJlIFwicmFkaW8vQ29uZmlnc1JhZGlvVmlldy5jb2ZmZWVcIlxuICBjaGVja2JveDogcmVxdWlyZSBcImNoZWNrYm94L0NvbmZpZ3NDaGVja2JveFZpZXcuY29mZmVlXCJcbiAgZ2FsbGVyeTogcmVxdWlyZSBcImdhbGxlcnkvQ29uZmlnc0dhbGxlcnlWaWV3LmNvZmZlZVwiXG5cblBvcHVwID0gcmVxdWlyZSBcInBvcHVwXCJcblxuQWRkVmlldy5vbiBcIm9wZW4tY29uZmlncy1tb2RhbFwiLCAoaW5kZXgsIGZpZWxkKSAtPlxuICBQb3B1cC5vcGVuIFwiQGNvbmZpZ3MtcG9wdXBcIlxuICB2aWV3c1tmaWVsZC50eXBlXS5iaW5kICgkIFwiQGNvbmZpZ3MtcG9wdXBcIilcblxuICBmaWVsZC5zZXR0aW5ncy5pbmRleCA9IGluZGV4XG4gIG1vZGVsc1tmaWVsZC50eXBlXS5iaW5kIGZpZWxkLnNldHRpbmdzXG5cbmZvciB0eXBlLCB2aWV3IG9mIHZpZXdzXG4gIGRvICh0eXBlLCB2aWV3KSAtPlxuICAgIHZpZXcub24gXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgKGZvcm0pIC0+XG4gICAgICBBZGRNb2RlbC5zYXZlRmllbGRDb25maWdzIGZvcm1cbiAgICAgIFBvcHVwLmNsb3NlKClcblxuQWRkTW9kZWwub24gXCJvblNhdmVkU2VjdGlvblwiLCAoYWxpYXMpIC0+XG4gIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvY21zL2NvbmZpZ3MvI3thbGlhc30vXCJcblxuIyBzZXRUaW1lb3V0ID0+XG4jICAgKCQgXCJAZmllbGQtdHlwZVwiKVxuIyAgIC5lcSgxKVxuIyAgIC52YWwgXCJ0YWJsZVwiXG4jICAgLnRyaWdnZXIgXCJjaGFuZ2VcIlxuIyAgIHNldFRpbWVvdXQgPT5cbiMgICAgICgkIFwiQGJ0bi1jb25maWctZmllbGRcIikudHJpZ2dlciBcImNsaWNrXCJcbiMgICAgICMgc2V0VGltZW91dCA9PlxuIyAgICAgIyAgICgkIFwiQGNvbmZpZ3MtaW1hZ2Utc3RvcmFnZVwiKS5lcSgxKS50cmlnZ2VyIFwiY2xpY2tcIlxuIyAgICAgIyAsIDQwXG4jICAgLCA0MFxuIyAsIDUwMFxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblByb21pc2UgPSByZXF1aXJlIFwicVwiXG5odHRwR2V0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwR2V0XG5odHRwUG9zdCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cFBvc3RcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIkNvbmZpZ3NBZGRNb2RlbFwiLFxuICBpbml0aWFsU3RhdGU6IC0+XG4gICAgaHR0cEdldCBcIiN7d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lfV9fanNvbi9cIlxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICBzdGF0ZSA9XG4gICAgICAgICAgdGl0bGU6IHJlc3BvbnNlLnRpdGxlXG4gICAgICAgICAgYWxpYXM6IHJlc3BvbnNlLmFsaWFzXG4gICAgICAgICAgbW9kdWxlOiByZXNwb25zZS5tb2R1bGVcbiAgICAgICAgICBmaWVsZHM6IHJlc3BvbnNlLmZpZWxkc1xuICAgICAgICAgIHR5cGVzOiByZXNwb25zZS50eXBlc1xuICAgICAgICBpZiByZXNwb25zZS5pZFxuICAgICAgICAgIHN0YXRlLmlkID0gcmVzcG9uc2UuaWRcbiAgICAgICAgY29uc29sZS5sb2cgc3RhdGVcbiAgICAgICAgc3RhdGVcblxuICBhZGRGaWVsZDogKGZpZWxkKSAtPlxuICAgIEBzZXQgZmllbGRzOiBAc3RhdGUuZmllbGRzLmNvbmNhdCBbZmllbGRdXG5cbiAgYWRkRW1wdHlGaWVsZDogLT5cbiAgICBAc2V0IGZpZWxkczogQHN0YXRlLmZpZWxkcy5jb25jYXQgW1xuICAgICAgdGl0bGU6IFwiXCJcbiAgICAgIGFsaWFzOiBcIlwiXG4gICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgXVxuXG4gIHVwZGF0ZVRpdGxlOiAodmFsdWUpIC0+IEBzZXQgdGl0bGU6IHZhbHVlXG4gIHVwZGF0ZUFsaWFzOiAodmFsdWUpIC0+IEBzZXQgYWxpYXM6IHZhbHVlXG4gIHVwZGF0ZU1vZHVsZTogKHZhbHVlKSAtPiBAc2V0IG1vZHVsZTogdmFsdWVcblxuICB1cGRhdGVGaWVsZFRpdGxlOiAoaW5kZXgsIHZhbHVlKSAtPlxuICAgIGZpZWxkcyA9IEBzdGF0ZS5maWVsZHMuc2xpY2UoKVxuICAgIGZpZWxkc1tpbmRleF0udGl0bGUgPSB2YWx1ZVxuICAgIEBzZXQge2ZpZWxkc31cblxuICB1cGRhdGVGaWVsZEFsaWFzOiAoaW5kZXgsIHZhbHVlKSAtPlxuICAgIGZpZWxkcyA9IEBzdGF0ZS5maWVsZHMuc2xpY2UoKVxuICAgIGZpZWxkc1tpbmRleF0uYWxpYXMgPSB2YWx1ZVxuICAgIEBzZXQge2ZpZWxkc31cblxuICB1cGRhdGVGaWVsZFR5cGU6IChpbmRleCwgdmFsdWUpIC0+XG4gICAgZmllbGRzID0gQHN0YXRlLmZpZWxkcy5zbGljZSgpXG4gICAgZmllbGRzW2luZGV4XS50eXBlID0gdmFsdWVcbiAgICBAcmVzZXRTZXR0aW5ncyBpbmRleFxuICAgIEBzZXQge2ZpZWxkc31cblxuICByZXNldFNldHRpbmdzOiAoaW5kZXgpIC0+XG4gICAgZmllbGRzID0gQHN0YXRlLmZpZWxkcy5zbGljZSgpXG4gICAgdHlwZSA9IGZpZWxkc1tpbmRleF0udHlwZVxuICAgIGZvciB0eXBlSXRlbSBpbiBAc3RhdGUudHlwZXNcbiAgICAgIGlmIHR5cGVJdGVtLmFsaWFzID09IHR5cGVcbiAgICAgICAgZmllbGRzW2luZGV4XS5zZXR0aW5ncyA9IEBjbG9uZSB0eXBlSXRlbS5kZWZhdWx0U2V0dGluZ3NcbiAgICBAc2V0IHtmaWVsZHN9XG5cbiAgcmVtb3ZlRmllbGQ6IChpbmRleCkgLT5cbiAgICBmaWVsZHMgPSBAc3RhdGUuZmllbGRzLnNsaWNlKClcbiAgICBmaWVsZHMuc3BsaWNlIGluZGV4LCAxXG4gICAgQHNldCB7ZmllbGRzfVxuXG4gIGdldEZpZWxkQnlJbmRleDogKGluZGV4KSAtPiBAY2xvbmUgQHN0YXRlLmZpZWxkc1tpbmRleF1cblxuICBzYXZlRmllbGRDb25maWdzOiAoZm9ybSkgLT5cbiAgICBpbmRleCA9IGZvcm0uaW5kZXhcbiAgICBkZWxldGUgZm9ybS5pbmRleFxuICAgIGZpZWxkcyA9IEBzdGF0ZS5maWVsZHMuc2xpY2UoKVxuICAgIGZpZWxkc1tpbmRleF0uc2V0dGluZ3MgPSBmb3JtXG4gICAgQHNldCB7ZmllbGRzfVxuXG4gIHNhdmU6IC0+XG4gICAgY29uc29sZS5sb2cgQHN0YXRlXG4gICAgaHR0cFBvc3QgXCIvY21zL2NvbmZpZ3Mvc2F2ZS9fX2pzb24vXCIsIEBzdGF0ZVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSA9PlxuICAgICAgICBpZiBAc3RhdGUuaWQ/XG4gICAgICAgICAgQHNldCBmaWVsZHM6IHJlc3BvbnNlLnNlY3Rpb24uZmllbGRzXG4gICAgICAgICAgQHNldCBpZDogcmVzcG9uc2Uuc2VjdGlvbi5pZFxuICAgICAgICAjIGVsc2VcbiAgICAgICAgICAjIEB0cmlnZ2VyIFwib25TYXZlZFNlY3Rpb25cIiwgQHN0YXRlLmFsaWFzXG4gICAgICAuY2F0Y2ggKHJlc3BvbnNlKSAtPlxuICAgICAgICBjb25zb2xlLmVycm9yIHJlc3BvbnNlLmVycm9yXG4iLCIkID0gcmVxdWlyZSBcImpxdWVyeS1wbHVnaW5zLmNvZmZlZVwiXG5WaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxuUG9wdXAgPSByZXF1aXJlIFwicG9wdXBcIlxuQWRkTW9kZWwgPSByZXF1aXJlIFwiLi9hZGRNb2RlbC5jb2ZmZWVcIlxudGFibGVNb2R1bGVGaWVsZHMgPSByZXF1aXJlIFwic2VjdGlvbnMvY29uZmlncy90YWJsZS1tb2R1bGUtZmllbGRzLnRtcGwuanNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcgXCJDb25maWdzQWRkVmlld1wiLFxuICBkZWJ1ZzogZmFsc2VcbiAgY29udGFpbjogJCBcIkBjb25maWdzLWFkZFwiXG4gIG1vZGVsOiBBZGRNb2RlbFxuICBldmVudHM6XG4gICAgXCJjbGljazogQGJ0bi1yZW1vdmUtZmllbGRcIjogKGUpIC0+IEFkZE1vZGVsLnJlbW92ZUZpZWxkIEBnZXRSb3dJbmRleCBlXG4gICAgXCJjbGljazogQGJ0bi1hZGQtZmllbGRcIjogKGUpIC0+IEFkZE1vZGVsLmFkZEVtcHR5RmllbGQoKVxuICAgIFwiY2hhbmdlOiBAZmllbGQtdGl0bGVcIjogKGUpIC0+IEFkZE1vZGVsLnVwZGF0ZUZpZWxkVGl0bGUgKEBnZXRSb3dJbmRleCBlKSwgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGZpZWxkLWFsaWFzXCI6IChlKSAtPiBBZGRNb2RlbC51cGRhdGVGaWVsZEFsaWFzIChAZ2V0Um93SW5kZXggZSksIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBmaWVsZC10eXBlXCI6IChlKSAtPiBBZGRNb2RlbC51cGRhdGVGaWVsZFR5cGUgKEBnZXRSb3dJbmRleCBlKSwgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtYWRkLXRpdGxlXCI6IChlKSAtPiBBZGRNb2RlbC51cGRhdGVUaXRsZSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1hZGQtYWxpYXNcIjogKGUpIC0+IEFkZE1vZGVsLnVwZGF0ZUFsaWFzIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWFkZC1tb2R1bGVcIjogKGUpIC0+IEFkZE1vZGVsLnVwZGF0ZU1vZHVsZSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2xpY2s6IEBidG4tY29uZmlnLWZpZWxkXCI6IFwiY2xpY2tCdG5Db25maWdGaWVsZFwiXG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWFkZC1mb3JtXCI6IFwic3VibWl0Q29uZmlnc0FkZEZvcm1cIlxuXG4gIGluaXRpYWw6IC0+XG4gICAgQHRib2R5Q29udGFpbiA9IFJlbmRlciB0YWJsZU1vZHVsZUZpZWxkcywgKCQgXCJAdGJvZHktbW9kdWxlLWZpZWxkc1wiKVswXVxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPlxuICAgIEB0Ym9keUNvbnRhaW4gc3RhdGVcblxuICBnZXRSb3dJbmRleDogKGUpIC0+XG4gICAgJHBhcmVudCA9ICgkIGUudGFyZ2V0KS5jbG9zZXN0IFwiW2RhdGEta2V5XVwiXG4gICAgcmV0dXJuICRwYXJlbnQuZGF0YSBcImtleVwiXG5cbiAgY2xpY2tCdG5Db25maWdGaWVsZDogKGUpIC0+XG4gICAgQHRyaWdnZXIgXCJvcGVuLWNvbmZpZ3MtbW9kYWxcIixcbiAgICAgIEBnZXRSb3dJbmRleCBlXG4gICAgICBBZGRNb2RlbC5nZXRGaWVsZEJ5SW5kZXggQGdldFJvd0luZGV4IGVcblxuICBzdWJtaXRDb25maWdzQWRkRm9ybTogKGUpIC0+XG4gICAgQWRkTW9kZWwuc2F2ZSgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsIFwiVHlwZUNoZWNrYm94TW9kZWxcIixcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG5cbiAgdXBkYXRlTnVtT3B0aW9uczogKHZhbHVlKSAtPlxuICAgIHZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG4gICAgbnVtT3B0cyA9IHBhcnNlSW50IEBzdGF0ZS5udW1PcHRpb25zLCAxMFxuICAgIGRlZmF1bHREYXRhID0gQHN0YXRlLmRlZmF1bHREYXRhLnNsaWNlKClcbiAgICBpZiB2YWx1ZSA+IG51bU9wdHNcbiAgICAgIGZvciBpIGluIFtudW1PcHRzICsgMS4udmFsdWVdXG4gICAgICAgIGRlZmF1bHREYXRhLnB1c2hcbiAgICAgICAgICBsYWJlbDogXCJcIlxuICAgICAgICAgIGNoZWNrZWQ6IGZhbHNlXG4gICAgZWxzZVxuICAgICAgZm9yIGkgaW4gW3ZhbHVlICsgMS4ubnVtT3B0c11cbiAgICAgICAgZGVmYXVsdERhdGEucG9wKClcbiAgICBAc2V0IG51bU9wdGlvbnM6IHZhbHVlXG4gICAgQHNldCBkZWZhdWx0RGF0YTogZGVmYXVsdERhdGFcblxuICB1cGRhdGVEZWZhdWx0RGF0YU9wdGlvbkNoZWNrZWQ6IChpbmRleCwgdmFsdWUpIC0+XG4gICAgZGF0YSA9IEBzdGF0ZS5kZWZhdWx0RGF0YS5zbGljZSgpXG4gICAgZGF0YVtpbmRleF0uY2hlY2tlZCA9IHZhbHVlXG4gICAgQHNldCBkZWZhdWx0RGF0YTogZGF0YVxuXG4gIHVwZGF0ZURlZmF1bHREYXRhT3B0aW9uOiAoaW5kZXgsIHZhbHVlKSAtPlxuICAgIGRhdGEgPSBAc3RhdGUuZGVmYXVsdERhdGEuc2xpY2UoKVxuICAgIGRhdGFbaW5kZXhdLmxhYmVsID0gdmFsdWVcbiAgICBAc2V0IGRlZmF1bHREYXRhOiBkYXRhXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcbmNvbmZpZ3NDaGVja2JveE1vZGVsID0gcmVxdWlyZSBcImNoZWNrYm94L2NvbmZpZ3NDaGVja2JveE1vZGVsLmNvZmZlZVwiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcbm1vZGFsV2luZG93VGVtcGxhdGUgPSByZXF1aXJlIFwidHlwZXMvY2hlY2tib3gvbW9kYWwudG1wbC5qc1wiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlldyBcIlR5cGVDaGVja2JveFZpZXdcIixcbiAgbW9kZWw6IGNvbmZpZ3NDaGVja2JveE1vZGVsXG5cbiAgaW5pdGlhbDogLT5cbiAgICBAbW9kYWxDb250YWluID0gUmVuZGVyIG1vZGFsV2luZG93VGVtcGxhdGUsIEBjb250YWluWzBdXG5cbiAgZXZlbnRzOlxuICAgIFwic3VibWl0OiBAY29uZmlncy1mb3JtXCI6IFwic3VibWl0Q29uZmlnc0Zvcm1cIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1jaGVja2JveC1udW0tb3B0aW9uc1wiOiAoZSkgLT4gY29uZmlnc0NoZWNrYm94TW9kZWwudXBkYXRlTnVtT3B0aW9ucyBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1jaGVja2JveC1vcHRpb25cIjogKGUpIC0+IGNvbmZpZ3NDaGVja2JveE1vZGVsLnVwZGF0ZURlZmF1bHREYXRhT3B0aW9uQ2hlY2tlZCAoQGdldEluZGV4QnlFdmVudCBlKSwgZS50YXJnZXQuY2hlY2tlZFxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1jaGVja2JveC1vcHRpb24tbGFiZWxcIjogKGUpIC0+IGNvbmZpZ3NDaGVja2JveE1vZGVsLnVwZGF0ZURlZmF1bHREYXRhT3B0aW9uIChAZ2V0SW5kZXhCeUV2ZW50IGUpLCBlLnRhcmdldC52YWx1ZVxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEB1bmJpbmQoKVxuXG4gIGdldEluZGV4QnlFdmVudDogKGUpIC0+XG4gICAgJGl0ZW0gPSAkIGUudGFyZ2V0XG4gICAgJGl0ZW0uZGF0YSBcImluZGV4XCJcblxuICByZW5kZXI6IChzdGF0ZSkgLT5cbiAgICBAbW9kYWxDb250YWluIHN0YXRlXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIGNvbmZpZ3NDaGVja2JveE1vZGVsLmdldFN0YXRlKClcbiAgICBAdW5iaW5kKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlQ2hlY2tib3hNb2RlbFwiLFxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcblxuICB1cGRhdGVOdW1PcHRpb25zOiAodmFsdWUpIC0+XG4gICAgdmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcbiAgICBudW1PcHRzID0gcGFyc2VJbnQgQHN0YXRlLm51bU9wdGlvbnMsIDEwXG4gICAgZGVmYXVsdERhdGEgPSBAc3RhdGUuZGVmYXVsdERhdGEuc2xpY2UoKVxuICAgIGlmIHZhbHVlID4gbnVtT3B0c1xuICAgICAgZm9yIGkgaW4gW251bU9wdHMgKyAxLi52YWx1ZV1cbiAgICAgICAgZGVmYXVsdERhdGEucHVzaFxuICAgICAgICAgIGxhYmVsOiBcIlwiXG4gICAgICAgICAgY2hlY2tlZDogZmFsc2VcbiAgICBlbHNlXG4gICAgICBmb3IgaSBpbiBbdmFsdWUgKyAxLi5udW1PcHRzXVxuICAgICAgICBkZWZhdWx0RGF0YS5wb3AoKVxuICAgIEBzZXQgbnVtT3B0aW9uczogdmFsdWVcbiAgICBAc2V0IGRlZmF1bHREYXRhOiBkZWZhdWx0RGF0YVxuXG4gIHVwZGF0ZURlZmF1bHREYXRhT3B0aW9uQ2hlY2tlZDogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBkYXRhID0gQHN0YXRlLmRlZmF1bHREYXRhLnNsaWNlKClcbiAgICBkYXRhW2luZGV4XS5jaGVja2VkID0gdmFsdWVcbiAgICBAc2V0IGRlZmF1bHREYXRhOiBkYXRhXG5cbiAgdXBkYXRlRGVmYXVsdERhdGFPcHRpb246IChpbmRleCwgdmFsdWUpIC0+XG4gICAgZGF0YSA9IEBzdGF0ZS5kZWZhdWx0RGF0YS5zbGljZSgpXG4gICAgZGF0YVtpbmRleF0ubGFiZWwgPSB2YWx1ZVxuICAgIEBzZXQgZGVmYXVsdERhdGE6IGRhdGFcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlRmlsZU1vZGVsXCIsXG4gIHVwZGF0ZVN0b3JhZ2U6ICh2YWx1ZSkgLT4gQHNldCBzdG9yYWdlOiB2YWx1ZVxuICB1cGRhdGVQYXRoOiAodmFsdWUpIC0+IEBzZXQgcGF0aDogdmFsdWVcbiAgdXBkYXRlUzNBY2Nlc3NLZXk6ICh2YWx1ZSkgLT4gQHNldCBzM0FjY2Vzc0tleTogdmFsdWVcbiAgdXBkYXRlUzNTZWNyZXRLZXk6ICh2YWx1ZSkgLT4gQHNldCBzM1NlY3JldEtleTogdmFsdWVcbiAgdXBkYXRlUzNCdWNrZXQ6ICh2YWx1ZSkgLT4gQHNldCBzM0J1Y2tldDogdmFsdWVcbiAgdXBkYXRlUzNQYXRoOiAodmFsdWUpIC0+IEBzZXQgczNQYXRoOiB2YWx1ZVxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuY29uZmlnc0ZpbGVNb2RlbCA9IHJlcXVpcmUgXCJmaWxlL2NvbmZpZ3NGaWxlTW9kZWwuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxubW9kYWxXaW5kb3dUZW1wbGF0ZSA9IHJlcXVpcmUgXCJ0eXBlcy9maWxlL21vZGFsLnRtcGwuanNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcgXCJUeXBlRmlsZVZpZXdcIixcbiAgbW9kZWw6IGNvbmZpZ3NGaWxlTW9kZWxcblxuICBpbml0aWFsOiAtPlxuICAgIEBtb2RhbENvbnRhaW4gPSBSZW5kZXIgbW9kYWxXaW5kb3dUZW1wbGF0ZSwgQGNvbnRhaW5bMF1cblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtc3RvcmFnZVwiOiAoZSkgLT4gY29uZmlnc0ZpbGVNb2RlbC51cGRhdGVTdG9yYWdlICgkIGUudGFyZ2V0KS5kYXRhIFwidmFsdWVcIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLXBhdGhcIjogKGUpIC0+IGNvbmZpZ3NGaWxlTW9kZWwudXBkYXRlUGF0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLXdpZHRoXCI6IChlKSAtPiBjb25maWdzRmlsZU1vZGVsLnVwZGF0ZVdpZHRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtaGVpZ2h0XCI6IChlKSAtPiBjb25maWdzRmlsZU1vZGVsLnVwZGF0ZUhlaWdodCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLXNvdXJjZVwiOiAoZSkgLT4gY29uZmlnc0ZpbGVNb2RlbC51cGRhdGVTb3VyY2UgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS1zMy1hY2Nlc3Mta2V5XCI6IChlKSAtPiBjb25maWdzRmlsZU1vZGVsLnVwZGF0ZVMzQWNjZXNzS2V5IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtczMtc2VjcmV0LWtleVwiOiAoZSkgLT4gY29uZmlnc0ZpbGVNb2RlbC51cGRhdGVTM1NlY3JldEtleSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLXMzLWJ1Y2tldFwiOiAoZSkgLT4gY29uZmlnc0ZpbGVNb2RlbC51cGRhdGVTM0J1Y2tldCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLXMzLXBhdGhcIjogKGUpIC0+IGNvbmZpZ3NGaWxlTW9kZWwudXBkYXRlUzNQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQHVuYmluZCgpXG5cbiAgcmVuZGVyOiAoc3RhdGUpIC0+XG4gICAgQG1vZGFsQ29udGFpbiBzdGF0ZVxuICAgICgkIFwiQHRhYnNcIikudGFicygpXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIGNvbmZpZ3NGaWxlTW9kZWwuZ2V0U3RhdGUoKVxuICAgIEB1bmJpbmQoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIlR5cGVGaWxlTW9kZWxcIixcbiAgdXBkYXRlU3RvcmFnZTogKHZhbHVlKSAtPiBAc2V0IHN0b3JhZ2U6IHZhbHVlXG4gIHVwZGF0ZVBhdGg6ICh2YWx1ZSkgLT4gQHNldCBwYXRoOiB2YWx1ZVxuICB1cGRhdGVTM0FjY2Vzc0tleTogKHZhbHVlKSAtPiBAc2V0IHMzQWNjZXNzS2V5OiB2YWx1ZVxuICB1cGRhdGVTM1NlY3JldEtleTogKHZhbHVlKSAtPiBAc2V0IHMzU2VjcmV0S2V5OiB2YWx1ZVxuICB1cGRhdGVTM0J1Y2tldDogKHZhbHVlKSAtPiBAc2V0IHMzQnVja2V0OiB2YWx1ZVxuICB1cGRhdGVTM1BhdGg6ICh2YWx1ZSkgLT4gQHNldCBzM1BhdGg6IHZhbHVlXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIlR5cGVHYWxsZXJ5TW9kZWxcIixcbiAgdXBkYXRlU3RvcmFnZTogKHZhbHVlKSAtPiBAc2V0IHN0b3JhZ2U6IHZhbHVlXG5cbiAgdXBkYXRlUGF0aDogKHZhbHVlKSAtPiBAc2V0IHBhdGg6IHZhbHVlXG4gIHVwZGF0ZVdpZHRoOiAodmFsdWUpIC0+IEBzZXQgd2lkdGg6IHZhbHVlXG4gIHVwZGF0ZUhlaWdodDogKHZhbHVlKSAtPiBAc2V0IGhlaWdodDogdmFsdWVcbiAgdXBkYXRlUHJldmlld1dpZHRoOiAodmFsdWUpIC0+IEBzZXQgcHJldmlld1dpZHRoOiB2YWx1ZVxuICB1cGRhdGVQcmV2aWV3SGVpZ2h0OiAodmFsdWUpIC0+IEBzZXQgcHJldmlld0hlaWdodDogdmFsdWVcblxuICB1cGRhdGVTM0FjY2Vzc0tleTogKHZhbHVlKSAtPiBAc2V0IHMzQWNjZXNzS2V5OiB2YWx1ZVxuICB1cGRhdGVTM1NlY3JldEtleTogKHZhbHVlKSAtPiBAc2V0IHMzU2VjcmV0S2V5OiB2YWx1ZVxuICB1cGRhdGVTM0J1Y2tldDogKHZhbHVlKSAtPiBAc2V0IHMzQnVja2V0OiB2YWx1ZVxuICB1cGRhdGVTM1BhdGg6ICh2YWx1ZSkgLT4gQHNldCBzM1BhdGg6IHZhbHVlXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5jb25maWdzR2FsbGVyeU1vZGVsID0gcmVxdWlyZSBcImdhbGxlcnkvY29uZmlnc0dhbGxlcnlNb2RlbC5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlclwiXG5tb2RhbFdpbmRvd1RlbXBsYXRlID0gcmVxdWlyZSBcInR5cGVzL2dhbGxlcnkvbW9kYWwudG1wbC5qc1wiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlldyBcIlR5cGVHYWxsZXJ5Vmlld1wiLFxuICBtb2RlbDogY29uZmlnc0dhbGxlcnlNb2RlbFxuXG4gIGluaXRpYWw6IC0+XG4gICAgQG1vZGFsQ29udGFpbiA9IFJlbmRlciBtb2RhbFdpbmRvd1RlbXBsYXRlLCBAY29udGFpblswXVxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1wYXRoXCI6IChlKSAtPiBjb25maWdzR2FsbGVyeU1vZGVsLnVwZGF0ZVBhdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS13aWR0aFwiOiAoZSkgLT4gY29uZmlnc0dhbGxlcnlNb2RlbC51cGRhdGVXaWR0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1nYWxsZXJ5LWhlaWdodFwiOiAoZSkgLT4gY29uZmlnc0dhbGxlcnlNb2RlbC51cGRhdGVIZWlnaHQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1wcmV2aWV3LXdpZHRoXCI6IChlKSAtPiBjb25maWdzR2FsbGVyeU1vZGVsLnVwZGF0ZVByZXZpZXdXaWR0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1nYWxsZXJ5LXByZXZpZXctaGVpZ2h0XCI6IChlKSAtPiBjb25maWdzR2FsbGVyeU1vZGVsLnVwZGF0ZVByZXZpZXdIZWlnaHQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1zdG9yYWdlXCI6IChlKSAtPiBjb25maWdzR2FsbGVyeU1vZGVsLnVwZGF0ZVN0b3JhZ2UgKCQgZS50YXJnZXQpLmRhdGEgXCJ2YWx1ZVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWdhbGxlcnktczMtYWNjZXNzLWtleVwiOiAoZSkgLT4gY29uZmlnc0dhbGxlcnlNb2RlbC51cGRhdGVTM0FjY2Vzc0tleSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1nYWxsZXJ5LXMzLXNlY3JldC1rZXlcIjogKGUpIC0+IGNvbmZpZ3NHYWxsZXJ5TW9kZWwudXBkYXRlUzNTZWNyZXRLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1zMy1idWNrZXRcIjogKGUpIC0+IGNvbmZpZ3NHYWxsZXJ5TW9kZWwudXBkYXRlUzNCdWNrZXQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1zMy1wYXRoXCI6IChlKSAtPiBjb25maWdzR2FsbGVyeU1vZGVsLnVwZGF0ZVMzUGF0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEB1bmJpbmQoKVxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPlxuICAgIEBtb2RhbENvbnRhaW4gc3RhdGVcbiAgICAoJCBcIkB0YWJzXCIpLnRhYnMoKVxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBjb25maWdzR2FsbGVyeU1vZGVsLmdldFN0YXRlKClcbiAgICBAdW5iaW5kKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlR2FsbGVyeU1vZGVsXCIsXG4gIHVwZGF0ZVN0b3JhZ2U6ICh2YWx1ZSkgLT4gQHNldCBzdG9yYWdlOiB2YWx1ZVxuXG4gIHVwZGF0ZVBhdGg6ICh2YWx1ZSkgLT4gQHNldCBwYXRoOiB2YWx1ZVxuICB1cGRhdGVXaWR0aDogKHZhbHVlKSAtPiBAc2V0IHdpZHRoOiB2YWx1ZVxuICB1cGRhdGVIZWlnaHQ6ICh2YWx1ZSkgLT4gQHNldCBoZWlnaHQ6IHZhbHVlXG4gIHVwZGF0ZVByZXZpZXdXaWR0aDogKHZhbHVlKSAtPiBAc2V0IHByZXZpZXdXaWR0aDogdmFsdWVcbiAgdXBkYXRlUHJldmlld0hlaWdodDogKHZhbHVlKSAtPiBAc2V0IHByZXZpZXdIZWlnaHQ6IHZhbHVlXG5cbiAgdXBkYXRlUzNBY2Nlc3NLZXk6ICh2YWx1ZSkgLT4gQHNldCBzM0FjY2Vzc0tleTogdmFsdWVcbiAgdXBkYXRlUzNTZWNyZXRLZXk6ICh2YWx1ZSkgLT4gQHNldCBzM1NlY3JldEtleTogdmFsdWVcbiAgdXBkYXRlUzNCdWNrZXQ6ICh2YWx1ZSkgLT4gQHNldCBzM0J1Y2tldDogdmFsdWVcbiAgdXBkYXRlUzNQYXRoOiAodmFsdWUpIC0+IEBzZXQgczNQYXRoOiB2YWx1ZVxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlSW1hZ2VNb2RlbFwiLFxuICB1cGRhdGVTdG9yYWdlOiAodmFsdWUpIC0+IEBzZXQgc3RvcmFnZTogdmFsdWVcblxuICB1cGRhdGVQYXRoOiAodmFsdWUpIC0+IEBzZXQgcGF0aDogdmFsdWVcblxuICB1cGRhdGVTM0FjY2Vzc0tleTogKHZhbHVlKSAtPiBAc2V0IHMzQWNjZXNzS2V5OiB2YWx1ZVxuICB1cGRhdGVTM1NlY3JldEtleTogKHZhbHVlKSAtPiBAc2V0IHMzU2VjcmV0S2V5OiB2YWx1ZVxuICB1cGRhdGVTM0J1Y2tldDogKHZhbHVlKSAtPiBAc2V0IHMzQnVja2V0OiB2YWx1ZVxuICB1cGRhdGVTM1BhdGg6ICh2YWx1ZSkgLT4gQHNldCBzM1BhdGg6IHZhbHVlXG5cbiAgdXBkYXRlV2lkdGg6ICh2YWx1ZSkgLT4gQHNldCB3aWR0aDogdmFsdWVcbiAgdXBkYXRlSGVpZ2h0OiAodmFsdWUpIC0+IEBzZXQgaGVpZ2h0OiB2YWx1ZVxuICB1cGRhdGVTb3VyY2U6ICh2YWx1ZSkgLT4gQHNldCBzb3VyY2U6IHZhbHVlXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5jb25maWdzSW1hZ2VNb2RlbCA9IHJlcXVpcmUgXCJpbWFnZS9jb25maWdzSW1hZ2VNb2RlbC5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlclwiXG5tb2RhbFdpbmRvd1RlbXBsYXRlID0gcmVxdWlyZSBcInR5cGVzL2ltYWdlL21vZGFsLnRtcGwuanNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcgXCJUeXBlSW1hZ2VWaWV3XCIsXG4gIG1vZGVsOiBjb25maWdzSW1hZ2VNb2RlbFxuXG4gIGluaXRpYWw6IC0+XG4gICAgQG1vZGFsQ29udGFpbiA9IFJlbmRlciBtb2RhbFdpbmRvd1RlbXBsYXRlLCBAY29udGFpblswXVxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2Utc3RvcmFnZVwiOiAoZSkgLT4gY29uZmlnc0ltYWdlTW9kZWwudXBkYXRlU3RvcmFnZSAoJCBlLnRhcmdldCkuZGF0YSBcInZhbHVlXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2UtcGF0aFwiOiAoZSkgLT4gY29uZmlnc0ltYWdlTW9kZWwudXBkYXRlUGF0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1zMy1hY2Nlc3Mta2V5XCI6IChlKSAtPiBjb25maWdzSW1hZ2VNb2RlbC51cGRhdGVTM0FjY2Vzc0tleSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1zMy1zZWNyZXQta2V5XCI6IChlKSAtPiBjb25maWdzSW1hZ2VNb2RlbC51cGRhdGVTM1NlY3JldEtleSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1zMy1idWNrZXRcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVMzQnVja2V0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXMzLXBhdGhcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVMzUGF0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS13aWR0aFwiOiAoZSkgLT4gY29uZmlnc0ltYWdlTW9kZWwudXBkYXRlV2lkdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2UtaGVpZ2h0XCI6IChlKSAtPiBjb25maWdzSW1hZ2VNb2RlbC51cGRhdGVIZWlnaHQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2Utc291cmNlXCI6IChlKSAtPiBjb25maWdzSW1hZ2VNb2RlbC51cGRhdGVTb3VyY2UgZS50YXJnZXQudmFsdWVcbiAgICBcInBvcHVwLWNsb3NlOiBjb250YWluXCI6IChlKSAtPiBAdW5iaW5kKClcblxuICByZW5kZXI6IChzdGF0ZSkgLT5cbiAgICBAbW9kYWxDb250YWluIHN0YXRlXG4gICAgKCQgXCJAdGFic1wiKS50YWJzKClcblxuICBzdWJtaXRDb25maWdzRm9ybTogKGUpIC0+XG4gICAgQHRyaWdnZXIgXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgY29uZmlnc0ltYWdlTW9kZWwuZ2V0U3RhdGUoKVxuICAgIEB1bmJpbmQoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIlR5cGVJbWFnZU1vZGVsXCIsXG4gIHVwZGF0ZVN0b3JhZ2U6ICh2YWx1ZSkgLT4gQHNldCBzdG9yYWdlOiB2YWx1ZVxuXG4gIHVwZGF0ZVBhdGg6ICh2YWx1ZSkgLT4gQHNldCBwYXRoOiB2YWx1ZVxuXG4gIHVwZGF0ZVMzQWNjZXNzS2V5OiAodmFsdWUpIC0+IEBzZXQgczNBY2Nlc3NLZXk6IHZhbHVlXG4gIHVwZGF0ZVMzU2VjcmV0S2V5OiAodmFsdWUpIC0+IEBzZXQgczNTZWNyZXRLZXk6IHZhbHVlXG4gIHVwZGF0ZVMzQnVja2V0OiAodmFsdWUpIC0+IEBzZXQgczNCdWNrZXQ6IHZhbHVlXG4gIHVwZGF0ZVMzUGF0aDogKHZhbHVlKSAtPiBAc2V0IHMzUGF0aDogdmFsdWVcblxuICB1cGRhdGVXaWR0aDogKHZhbHVlKSAtPiBAc2V0IHdpZHRoOiB2YWx1ZVxuICB1cGRhdGVIZWlnaHQ6ICh2YWx1ZSkgLT4gQHNldCBoZWlnaHQ6IHZhbHVlXG4gIHVwZGF0ZVNvdXJjZTogKHZhbHVlKSAtPiBAc2V0IHNvdXJjZTogdmFsdWVcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsIFwiVHlwZVJhZGlvTW9kZWxcIixcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG5cbiAgdXBkYXRlTnVtT3B0aW9uczogKHZhbHVlKSAtPlxuICAgIHZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG4gICAgbnVtT3B0cyA9IHBhcnNlSW50IEBzdGF0ZS5udW1PcHRpb25zLCAxMFxuICAgIGRlZmF1bHRWYWx1ZSA9IHBhcnNlSW50IEBzdGF0ZS5kZWZhdWx0VmFsdWUsIDEwXG4gICAgZGVmYXVsdERhdGEgPSBAc3RhdGUuZGVmYXVsdERhdGEuc2xpY2UoKVxuICAgIGlmIHZhbHVlID4gbnVtT3B0c1xuICAgICAgZm9yIGkgaW4gW251bU9wdHMgKyAxLi52YWx1ZV1cbiAgICAgICAgZGVmYXVsdERhdGEucHVzaCBcIlwiXG4gICAgZWxzZVxuICAgICAgZm9yIGkgaW4gW3ZhbHVlICsgMS4ubnVtT3B0c11cbiAgICAgICAgZGVmYXVsdERhdGEucG9wKClcbiAgICAgIGlmIGRlZmF1bHRWYWx1ZSA+PSB2YWx1ZVxuICAgICAgICBAc2V0IHtkZWZhdWx0VmFsdWV9XG4gICAgQHNldCBudW1PcHRpb25zOiB2YWx1ZVxuICAgIEBzZXQge2RlZmF1bHREYXRhfVxuXG4gIHVwZGF0ZURlZmF1bHRWYWx1ZTogKHZhbHVlKSAtPiBAc2V0IGRlZmF1bHRWYWx1ZTogcGFyc2VJbnQgdmFsdWUsIDEwXG5cbiAgdXBkYXRlRGVmYXVsdERhdGFPcHRpb246IChpbmRleCwgdmFsdWUpIC0+XG4gICAgZGF0YSA9IEBzdGF0ZS5kZWZhdWx0RGF0YS5zbGljZSgpXG4gICAgZGF0YVtpbmRleF0gPSB2YWx1ZVxuICAgIEBzZXQgZGVmYXVsdERhdGE6IGRhdGFcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuY29uZmlnc1JhZGlvTW9kZWwgPSByZXF1aXJlIFwicmFkaW8vY29uZmlnc1JhZGlvTW9kZWwuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxubW9kYWxXaW5kb3dUZW1wbGF0ZSA9IHJlcXVpcmUgXCJ0eXBlcy9yYWRpby9tb2RhbC50bXBsLmpzXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3IFwiVHlwZVJhZGlvVmlld1wiLFxuICBtb2RlbDogY29uZmlnc1JhZGlvTW9kZWxcblxuICBpbml0aWFsOiAtPlxuICAgIEBvcHRpb25zQ29udGFpbiA9IFJlbmRlciBtb2RhbFdpbmRvd1RlbXBsYXRlLCBAY29udGFpblswXVxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtcmFkaW8tbnVtLW9wdGlvbnNcIjogKGUpIC0+IGNvbmZpZ3NSYWRpb01vZGVsLnVwZGF0ZU51bU9wdGlvbnMgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtcmFkaW8tb3B0aW9uXCI6IChlKSAtPiBjb25maWdzUmFkaW9Nb2RlbC51cGRhdGVEZWZhdWx0VmFsdWUgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtcmFkaW8tb3B0aW9uLWxhYmVsXCI6IChlKSAtPiBjb25maWdzUmFkaW9Nb2RlbC51cGRhdGVEZWZhdWx0RGF0YU9wdGlvbiAoQGdldEluZGV4QnlFdmVudCBlKSwgZS50YXJnZXQudmFsdWVcbiAgICBcInBvcHVwLWNsb3NlOiBjb250YWluXCI6IChlKSAtPiBAdW5iaW5kKClcblxuICBnZXRJbmRleEJ5RXZlbnQ6IChlKSAtPlxuICAgICRpdGVtID0gJCBlLnRhcmdldFxuICAgICRpdGVtLmRhdGEgXCJpbmRleFwiXG5cbiAgcmVuZGVyOiAoc3RhdGUpIC0+XG4gICAgQG9wdGlvbnNDb250YWluIHN0YXRlXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIGNvbmZpZ3NSYWRpb01vZGVsLmdldFN0YXRlKClcbiAgICBAdW5iaW5kKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlUmFkaW9Nb2RlbFwiLFxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcblxuICB1cGRhdGVOdW1PcHRpb25zOiAodmFsdWUpIC0+XG4gICAgdmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcbiAgICBudW1PcHRzID0gcGFyc2VJbnQgQHN0YXRlLm51bU9wdGlvbnMsIDEwXG4gICAgZGVmYXVsdFZhbHVlID0gcGFyc2VJbnQgQHN0YXRlLmRlZmF1bHRWYWx1ZSwgMTBcbiAgICBkZWZhdWx0RGF0YSA9IEBzdGF0ZS5kZWZhdWx0RGF0YS5zbGljZSgpXG4gICAgaWYgdmFsdWUgPiBudW1PcHRzXG4gICAgICBmb3IgaSBpbiBbbnVtT3B0cyArIDEuLnZhbHVlXVxuICAgICAgICBkZWZhdWx0RGF0YS5wdXNoIFwiXCJcbiAgICBlbHNlXG4gICAgICBmb3IgaSBpbiBbdmFsdWUgKyAxLi5udW1PcHRzXVxuICAgICAgICBkZWZhdWx0RGF0YS5wb3AoKVxuICAgICAgaWYgZGVmYXVsdFZhbHVlID49IHZhbHVlXG4gICAgICAgIEBzZXQge2RlZmF1bHRWYWx1ZX1cbiAgICBAc2V0IG51bU9wdGlvbnM6IHZhbHVlXG4gICAgQHNldCB7ZGVmYXVsdERhdGF9XG5cbiAgdXBkYXRlRGVmYXVsdFZhbHVlOiAodmFsdWUpIC0+IEBzZXQgZGVmYXVsdFZhbHVlOiBwYXJzZUludCB2YWx1ZSwgMTBcblxuICB1cGRhdGVEZWZhdWx0RGF0YU9wdGlvbjogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBkYXRhID0gQHN0YXRlLmRlZmF1bHREYXRhLnNsaWNlKClcbiAgICBkYXRhW2luZGV4XSA9IHZhbHVlXG4gICAgQHNldCBkZWZhdWx0RGF0YTogZGF0YVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIlR5cGVUYWJsZU1vZGVsXCIsXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuXG4gIHVwZGF0ZUNvbHVtbnM6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSA9IHBhcnNlSW50IHZhbHVlLCAxMFxuICAgIGlmIHZhbHVlID4gQHN0YXRlLmNvbHVtbnNcbiAgICAgIGZvciByb3cgaW4gQHN0YXRlLmRlZmF1bHREYXRhXG4gICAgICAgIGZvciBpIGluIFtAc3RhdGUuY29sdW1ucyArIDEuLnZhbHVlXVxuICAgICAgICAgIHJvdy5wdXNoIFwiXCJcbiAgICBlbHNlIGlmIHZhbHVlIDwgQHN0YXRlLmNvbHVtbnNcbiAgICAgIGZvciByb3cgaW4gQHN0YXRlLmRlZmF1bHREYXRhXG4gICAgICAgIGZvciBpIGluIFt2YWx1ZSArIDEuLkBzdGF0ZS5jb2x1bW5zXVxuICAgICAgICAgIHJvdy5wb3AoKVxuICAgIEBzZXQgY29sdW1uczogdmFsdWVcblxuICB1cGRhdGVSb3dzOiAodmFsdWUpIC0+XG4gICAgdmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcbiAgICBpZiB2YWx1ZSA+IEBzdGF0ZS5yb3dzXG4gICAgICBmb3Igcm93IGluIFtAc3RhdGUucm93cyArIDEuLnZhbHVlXVxuICAgICAgICByb3cgPSBbXVxuICAgICAgICBmb3IgaSBpbiBbMS4uQHN0YXRlLmNvbHVtbnNdXG4gICAgICAgICAgcm93LnB1c2ggXCJcIlxuICAgICAgICBAc3RhdGUuZGVmYXVsdERhdGEucHVzaCByb3dcbiAgICBlbHNlIGlmIHZhbHVlIDwgQHN0YXRlLnJvd3NcbiAgICAgIGZvciByb3cgaW4gW3ZhbHVlICsgMS4uQHN0YXRlLnJvd3NdXG4gICAgICAgIEBzdGF0ZS5kZWZhdWx0RGF0YS5wb3AoKVxuICAgIEBzZXQgcm93czogdmFsdWVcblxuICB1cGRhdGVDZWxsRGF0YTogKHJvdywgY29sdW1uLCB2YWx1ZSkgLT5cbiAgICBkYXRhID0gQHN0YXRlLmRlZmF1bHREYXRhLnNsaWNlKClcbiAgICBkYXRhW3Jvd11bY29sdW1uXSA9IHZhbHVlXG4gICAgQHNldCBkZWZhdWx0RGF0YTogZGF0YVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5jb25maWdzVGFibGVNb2RlbCA9IHJlcXVpcmUgXCJ0YWJsZS9jb25maWdzVGFibGVNb2RlbC5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlclwiXG5tb2RhbFdpbmRvd1RlbXBsYXRlID0gcmVxdWlyZSBcInR5cGVzL3RhYmxlL21vZGFsLnRtcGwuanNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcgXCJUeXBlVGFibGVWaWV3XCIsXG4gIG1vZGVsOiBjb25maWdzVGFibGVNb2RlbFxuXG4gIGluaXRpYWw6IC0+XG4gICAgQG1vZGFsQ29udGFpbiA9IFJlbmRlciBtb2RhbFdpbmRvd1RlbXBsYXRlLCBAY29udGFpblswXVxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtdGFibGUtcm93c1wiOiBcImNoYW5nZUNvbmZpZ3NUYWJsZVJvd3NcIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy10YWJsZS1jb2x1bW5zXCI6IFwiY2hhbmdlQ29uZmlnc1RhYmxlQ29sdW1uc1wiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLXRhYmxlLWNlbGxcIjogKGUpIC0+XG4gICAgICAkY2VsbCA9ICQgZS50YXJnZXRcbiAgICAgIGNvbmZpZ3NUYWJsZU1vZGVsLnVwZGF0ZUNlbGxEYXRhICgkY2VsbC5kYXRhIFwicm93XCIpLCAoJGNlbGwuZGF0YSBcImNvbHVtblwiKSwgKCRjZWxsLnZhbCgpKVxuXG4gICAgXCJrZXlkb3duOiBAY29uZmlncy10YWJsZS1yb3dzXCI6IChlKSAtPlxuICAgICAgQGNoYW5nZUNvbmZpZ3NUYWJsZVJvd3MgZVxuICAgICAgaWYgZS5rZXlDb2RlID09IDEzIHRoZW4gZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBcImtleWRvd246IEBjb25maWdzLXRhYmxlLWNvbHVtbnNcIjogKGUpIC0+XG4gICAgICBAY2hhbmdlQ29uZmlnc1RhYmxlQ29sdW1ucyBlXG4gICAgICBpZiBlLmtleUNvZGUgPT0gMTMgdGhlbiBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEB1bmJpbmQoKVxuXG4gIGNoYW5nZUNvbmZpZ3NUYWJsZVJvd3M6IChlKSAtPiBjb25maWdzVGFibGVNb2RlbC51cGRhdGVSb3dzIGUudGFyZ2V0LnZhbHVlXG4gIGNoYW5nZUNvbmZpZ3NUYWJsZUNvbHVtbnM6IChlKSAtPiBjb25maWdzVGFibGVNb2RlbC51cGRhdGVDb2x1bW5zIGUudGFyZ2V0LnZhbHVlXG5cbiAgcmVuZGVyOiAoc3RhdGUpIC0+XG4gICAgQG1vZGFsQ29udGFpbiBzdGF0ZVxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBjb25maWdzVGFibGVNb2RlbC5nZXRTdGF0ZSgpXG4gICAgQHVuYmluZCgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsIFwiVHlwZVRhYmxlTW9kZWxcIixcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG5cbiAgdXBkYXRlQ29sdW1uczogKHZhbHVlKSAtPlxuICAgIHZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG4gICAgaWYgdmFsdWUgPiBAc3RhdGUuY29sdW1uc1xuICAgICAgZm9yIHJvdyBpbiBAc3RhdGUuZGVmYXVsdERhdGFcbiAgICAgICAgZm9yIGkgaW4gW0BzdGF0ZS5jb2x1bW5zICsgMS4udmFsdWVdXG4gICAgICAgICAgcm93LnB1c2ggXCJcIlxuICAgIGVsc2UgaWYgdmFsdWUgPCBAc3RhdGUuY29sdW1uc1xuICAgICAgZm9yIHJvdyBpbiBAc3RhdGUuZGVmYXVsdERhdGFcbiAgICAgICAgZm9yIGkgaW4gW3ZhbHVlICsgMS4uQHN0YXRlLmNvbHVtbnNdXG4gICAgICAgICAgcm93LnBvcCgpXG4gICAgQHNldCBjb2x1bW5zOiB2YWx1ZVxuXG4gIHVwZGF0ZVJvd3M6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSA9IHBhcnNlSW50IHZhbHVlLCAxMFxuICAgIGlmIHZhbHVlID4gQHN0YXRlLnJvd3NcbiAgICAgIGZvciByb3cgaW4gW0BzdGF0ZS5yb3dzICsgMS4udmFsdWVdXG4gICAgICAgIHJvdyA9IFtdXG4gICAgICAgIGZvciBpIGluIFsxLi5Ac3RhdGUuY29sdW1uc11cbiAgICAgICAgICByb3cucHVzaCBcIlwiXG4gICAgICAgIEBzdGF0ZS5kZWZhdWx0RGF0YS5wdXNoIHJvd1xuICAgIGVsc2UgaWYgdmFsdWUgPCBAc3RhdGUucm93c1xuICAgICAgZm9yIHJvdyBpbiBbdmFsdWUgKyAxLi5Ac3RhdGUucm93c11cbiAgICAgICAgQHN0YXRlLmRlZmF1bHREYXRhLnBvcCgpXG4gICAgQHNldCByb3dzOiB2YWx1ZVxuXG4gIHVwZGF0ZUNlbGxEYXRhOiAocm93LCBjb2x1bW4sIHZhbHVlKSAtPlxuICAgIGRhdGEgPSBAc3RhdGUuZGVmYXVsdERhdGEuc2xpY2UoKVxuICAgIGRhdGFbcm93XVtjb2x1bW5dID0gdmFsdWVcbiAgICBAc2V0IGRlZmF1bHREYXRhOiBkYXRhXG4iLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG4gICAge1xuICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cudGFibGVNb2R1bGVGaWVsZHMgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgfSkoZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICAgICAgdmFyIF9jckVsID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICAgICAgfTtcbiAgICAgIHZhciBfY3JUTiA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICd0ZXh0JywgdGV4dDogbm9kZX07XG4gICAgICB9O1xuICAgICAgZnVuY3Rpb24gY3JlYXRlKClcbiAgICAgIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICB2YXIgcm9vdE5vZGVzID0gW107XG4gICAgICAgICAgYXJndW1lbnRzWzBdKHJvb3ROb2Rlcyk7XG4gICAgICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIHJvb3ROb2Rlcykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChyb290Tm9kZXMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICByb290Tm9kZXNbaW5kZXhBdHRyXSA9IF9jclROKHJvb3ROb2Rlc1tpbmRleEF0dHJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgICAgdmFyIHBhcmVudE5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4Tm9kZTtcbiAgICAgICAgICB2YXIgbm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhBdHRyO1xuICAgICAgICAgIHZhciBhdHRyO1xuICAgICAgICAgIHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICBhcmd1bWVudHNbMl0obm9kZXMpO1xuICAgICAgICAgIHBhcmVudE5vZGUgPSBfY3JFbChhcmd1bWVudHNbMF0pO1xuICAgICAgICAgIGlmIChhdHRycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKGF0dHJzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2luZGV4QXR0cl07XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5hdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IGF0dHJbMF0sXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogYXR0clsxXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAoaW5kZXhOb2RlIGluIG5vZGVzKSB7XG4gICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChub2RlcywgaW5kZXhOb2RlKSkge1xuICAgICAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhOb2RlXTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2goX2NyVE4obm9kZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqKVxuICAgICAge1xuICAgICAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAgICAgIHt3aXRoIChvYmopIHt2YXIgYXJyMCA9IGZpZWxkczsgZm9yIChpbmRleCBpbiBhcnIwKSBpZiAoX2hhc1Byb3AuY2FsbChhcnIwLCBpbmRleCkpIHtcbmZpZWxkID0gYXJyMFtpbmRleF07XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm0tdGFibGVfX3Jvdyc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IGluZGV4O1xuYXR0cnMucHVzaChbJ2RhdGEta2V5JywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndHInLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtLXRhYmxlX19jZWxsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IGZpZWxkWyd0aXRsZSddO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZmllbGQtdGl0bGUnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybS10YWJsZV9fY2VsbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBmaWVsZFsnYWxpYXMnXTtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2ZpZWxkLWFsaWFzJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm0tdGFibGVfX2NlbGwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdzZWxlY3QnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19zZWxlY3QnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZmllbGQtdHlwZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ3NlbGVjdCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5oYXNTZXR0aW5ncyA9IGZhbHNlO3ZhciBhcnIxID0gdHlwZXM7IGZvciAodHlwZSBpbiBhcnIxKSBpZiAoX2hhc1Byb3AuY2FsbChhcnIxLCB0eXBlKSkge1xudHlwZSA9IGFycjFbdHlwZV07XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gdHlwZVsnYWxpYXMnXTtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG5pZiAoIGZpZWxkWyd0eXBlJ10gPT0gdHlwZVsnYWxpYXMnXSkge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRycy5wdXNoKFsnc2VsZWN0ZWQnLCBhdHRyXSk7XG59KSgpO1xufVxuY2hpbGRzLnB1c2goY3JlYXRlKCdvcHRpb24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2godHlwZVsnbmFtZSddKVxufSkpO1xufSkoKTtcbmlmICggZmllbGRbJ3R5cGUnXSA9PSB0eXBlWydhbGlhcyddKSB7XG5pZiAoIHR5cGVbJ2hhc1NldHRpbmdzJ10pIHtcbmhhc1NldHRpbmdzID0gdHJ1ZTt9XG59XG59fSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtLXRhYmxlX19jZWxsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmlmICggaGFzU2V0dGluZ3MpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYnRuJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J0bi1jb25maWctZmllbGQnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9CdJyk7XG59KSk7XG59KSgpO1xufVxufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybS10YWJsZV9fY2VsbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5pZiAoIGNvdW50KGZpZWxkcykgPiAxKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2J0bic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdidXR0b24nO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdidG4tcmVtb3ZlLWZpZWxkJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCdYJyk7XG59KSk7XG59KSgpO1xufVxufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59fX0pfTtcbiAgICB9KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG4gICAge1xuICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cubW9kYWwgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgfSkoZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICAgICAgdmFyIF9jckVsID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICAgICAgfTtcbiAgICAgIHZhciBfY3JUTiA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICd0ZXh0JywgdGV4dDogbm9kZX07XG4gICAgICB9O1xuICAgICAgZnVuY3Rpb24gY3JlYXRlKClcbiAgICAgIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICB2YXIgcm9vdE5vZGVzID0gW107XG4gICAgICAgICAgYXJndW1lbnRzWzBdKHJvb3ROb2Rlcyk7XG4gICAgICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIHJvb3ROb2Rlcykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChyb290Tm9kZXMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICByb290Tm9kZXNbaW5kZXhBdHRyXSA9IF9jclROKHJvb3ROb2Rlc1tpbmRleEF0dHJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgICAgdmFyIHBhcmVudE5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4Tm9kZTtcbiAgICAgICAgICB2YXIgbm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhBdHRyO1xuICAgICAgICAgIHZhciBhdHRyO1xuICAgICAgICAgIHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICBhcmd1bWVudHNbMl0obm9kZXMpO1xuICAgICAgICAgIHBhcmVudE5vZGUgPSBfY3JFbChhcmd1bWVudHNbMF0pO1xuICAgICAgICAgIGlmIChhdHRycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKGF0dHJzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2luZGV4QXR0cl07XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5hdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IGF0dHJbMF0sXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogYXR0clsxXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAoaW5kZXhOb2RlIGluIG5vZGVzKSB7XG4gICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChub2RlcywgaW5kZXhOb2RlKSkge1xuICAgICAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhOb2RlXTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2goX2NyVE4obm9kZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqKVxuICAgICAge1xuICAgICAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAgICAgIHt3aXRoIChvYmopIHsoZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3BvcHVwX19oZWFkJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J3QsNGB0YLRgNC+0LnQutC4INGE0LvQsNC20LrQvtCyJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRycy5wdXNoKFsnYWN0aW9uJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZvcm0nO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdmb3JtJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWNoZWNrYm94LW51bS1vcHRpb25zJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0JrQvtC70LjRh9C10YHRgtCy0L4g0LLQsNGA0LjQsNC90YLQvtCyINC+0YLQstC10YLQsCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBudW1PcHRpb25zO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1jaGVja2JveC1udW0tb3B0aW9ucyc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtY2hlY2tib3gtbnVtLW9wdGlvbnMnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQktCw0YDQuNCw0L3RgtGLINC+0YLQstC10YLQvtCyOicpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4gZm9ybV9faW5wLWNvbnRhaW4tLWZ1bGwtd2lkdGgnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1jaGVja2JveC1vcHRpb25zLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xudmFyIGFycjAgPSBkZWZhdWx0RGF0YTsgZm9yIChpIGluIGFycjApIGlmIChfaGFzUHJvcC5jYWxsKGFycjAsIGkpKSB7XG5vcHRpb24gPSBhcnIwW2ldO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19yb3ctb3B0aW9uJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NoZWNrYm94JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fY2hlY2tib3gnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1jaGVja2JveC1vcHRpb24nO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IGk7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IGk7XG5hdHRycy5wdXNoKFsnZGF0YS1pbmRleCcsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtY2hlY2tib3gtb3B0aW9uLSc7XG5hdHRyICs9IGk7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWNoZWNrYm94LW9wdGlvbic7XG5hdHRycy5wdXNoKFsnbmFtZScsIGF0dHJdKTtcbn0pKCk7XG5pZiAoIG9wdGlvblsnY2hlY2tlZCddID09IHRydWUgfHwgb3B0aW9uWydjaGVja2VkJ10gPT0gXCJ0cnVlXCIpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ2NoZWNrZWQnLCBhdHRyXSk7XG59KSgpO1xufVxuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS1oYWxmLXdpZHRoJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gb3B0aW9uWydsYWJlbCddO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1jaGVja2JveC1vcHRpb24tbGFiZWwnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IGk7XG5hdHRycy5wdXNoKFsnZGF0YS1pbmRleCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn19KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX3N1Ym1pdCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19idG4gZm9ybV9fYnRuLS1zdWJtaXQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQodC+0YXRgNCw0L3QuNGC0YwnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2J0biBwb3B1cF9fY2FuY2VsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J7RgtC80LXQvdC40YLRjCcpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufX0pfTtcbiAgICB9KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG4gICAge1xuICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cubW9kYWwgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgfSkoZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICAgICAgdmFyIF9jckVsID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICAgICAgfTtcbiAgICAgIHZhciBfY3JUTiA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICd0ZXh0JywgdGV4dDogbm9kZX07XG4gICAgICB9O1xuICAgICAgZnVuY3Rpb24gY3JlYXRlKClcbiAgICAgIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICB2YXIgcm9vdE5vZGVzID0gW107XG4gICAgICAgICAgYXJndW1lbnRzWzBdKHJvb3ROb2Rlcyk7XG4gICAgICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIHJvb3ROb2Rlcykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChyb290Tm9kZXMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICByb290Tm9kZXNbaW5kZXhBdHRyXSA9IF9jclROKHJvb3ROb2Rlc1tpbmRleEF0dHJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgICAgdmFyIHBhcmVudE5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4Tm9kZTtcbiAgICAgICAgICB2YXIgbm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhBdHRyO1xuICAgICAgICAgIHZhciBhdHRyO1xuICAgICAgICAgIHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICBhcmd1bWVudHNbMl0obm9kZXMpO1xuICAgICAgICAgIHBhcmVudE5vZGUgPSBfY3JFbChhcmd1bWVudHNbMF0pO1xuICAgICAgICAgIGlmIChhdHRycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKGF0dHJzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2luZGV4QXR0cl07XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5hdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IGF0dHJbMF0sXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogYXR0clsxXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAoaW5kZXhOb2RlIGluIG5vZGVzKSB7XG4gICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChub2RlcywgaW5kZXhOb2RlKSkge1xuICAgICAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhOb2RlXTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2goX2NyVE4obm9kZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqKVxuICAgICAge1xuICAgICAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAgICAgIHt3aXRoIChvYmopIHsoZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3BvcHVwX19oZWFkJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J3QsNGB0YLRgNC+0LnQutC4INGE0LDQudC70LAnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHJzLnB1c2goWydhY3Rpb24nLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZm9ybSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2Zvcm0nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQpdGA0LDQvdC40LvQuNGJ0LUnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnMnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYnV0dG9uJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFic19faXRlbSc7XG5pZiAoIHN0b3JhZ2UgPT0gXCJsb2NhbFwiKSB7XG5hdHRyICs9ICcgdGFic19faXRlbS0tYWN0aXZlJztcbn1cbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnMgY29uZmlncy1maWxlLXN0b3JhZ2UnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtbW9kYWwtc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsnZGF0YS1ncm91cCcsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2xvY2FsJztcbmF0dHJzLnB1c2goWydkYXRhLXZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLW1vZGFsLXN0b3JhZ2UtbG9jYWwnO1xuYXR0cnMucHVzaChbJ2RhdGEtZnJhbWUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cb0L7QutCw0LvRjNC90L7QtScpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYnV0dG9uJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFic19faXRlbSc7XG5pZiAoIHN0b3JhZ2UgPT0gXCJzM1wiKSB7XG5hdHRyICs9ICcgdGFic19faXRlbS0tYWN0aXZlJztcbn1cbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnMgY29uZmlncy1maWxlLXN0b3JhZ2UnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtbW9kYWwtc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsnZGF0YS1ncm91cCcsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3MzJztcbmF0dHJzLnB1c2goWydkYXRhLXZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLW1vZGFsLXN0b3JhZ2UtczMnO1xuYXR0cnMucHVzaChbJ2RhdGEtZnJhbWUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ1MzJyk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtbW9kYWwtc3RvcmFnZS1sb2NhbCBjb25maWdzLWZpbGUtbW9kYWwtc3RvcmFnZS1mcmFtZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5pZiAoIHN0b3JhZ2UgIT0gXCJsb2NhbFwiKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Rpc3BsYXk6IG5vbmUnO1xuYXR0cnMucHVzaChbJ3N0eWxlJywgYXR0cl0pO1xufSkoKTtcbn1cbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtcGF0aCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cf0YPRgtGMJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gcGF0aDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1wYXRoJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXBhdGgnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLW1vZGFsLXN0b3JhZ2UtczMgY29uZmlncy1maWxlLW1vZGFsLXN0b3JhZ2UtZnJhbWUnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuaWYgKCBzdG9yYWdlICE9IFwiczNcIikge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdkaXNwbGF5OiBub25lJztcbmF0dHJzLnB1c2goWydzdHlsZScsIGF0dHJdKTtcbn0pKCk7XG59XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXMzLWFjY2Vzcy1rZXknO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCdBY2Nlc3Mga2V5Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gczNBY2Nlc3NLZXk7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtYWNjZXNzLWtleSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1hY2Nlc3Mta2V5JztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtc2VjcmV0LWtleSc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ1NlY3JldCBrZXknKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3Bhc3N3b3JkJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1zZWNyZXQta2V5JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXMzLXNlY3JldC1rZXknO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1idWNrZXQnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCdCdWNrZXQnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBzM0J1Y2tldDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1idWNrZXQnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtYnVja2V0JztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtcGF0aCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cf0YPRgtGMJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gczNQYXRoO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXMzLXBhdGgnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtcGF0aCc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19zdWJtaXQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYnRuIGZvcm1fX2J0bi0tc3VibWl0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0KHQvtGF0YDQsNC90LjRgtGMJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdidXR0b24nO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19idG4gcG9wdXBfX2NhbmNlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Ce0YLQvNC10L3QuNGC0YwnKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn19KX07XG4gICAgfSk7IiwiKGZ1bmN0aW9uIChmYWN0b3J5KVxuICAgIHtcbiAgICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGRlZmluZSgnZmlyc3QtdHJ5JywgW10sIGZhY3RvcnkoKSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgd2luZG93Lm1vZGFsID0gZmFjdG9yeSgpO1xuICAgICAgfVxuICAgIH0pKGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgdmFyIF9oYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgICAgIHZhciBfY3JFbCA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICdub2RlJywgbmFtZTogbm9kZSwgYXR0cnM6IFtdLCBjaGlsZHM6IFtdfTtcbiAgICAgIH07XG4gICAgICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHt0eXBlOiAndGV4dCcsIHRleHQ6IG5vZGV9O1xuICAgICAgfTtcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZSgpXG4gICAgICB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgdmFyIHJvb3ROb2RlcyA9IFtdO1xuICAgICAgICAgIGFyZ3VtZW50c1swXShyb290Tm9kZXMpO1xuICAgICAgICAgIGlmIChyb290Tm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiByb290Tm9kZXMpIHtcbiAgICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwocm9vdE5vZGVzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgcm9vdE5vZGVzW2luZGV4QXR0cl0gPSBfY3JUTihyb290Tm9kZXNbaW5kZXhBdHRyXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByb290Tm9kZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICAgIHZhciBwYXJlbnROb2RlO1xuICAgICAgICAgIHZhciBpbmRleE5vZGU7XG4gICAgICAgICAgdmFyIG5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4QXR0cjtcbiAgICAgICAgICB2YXIgYXR0cjtcbiAgICAgICAgICB2YXIgYXR0cnMgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgYXJndW1lbnRzWzJdKG5vZGVzKTtcbiAgICAgICAgICBwYXJlbnROb2RlID0gX2NyRWwoYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICBpZiAoYXR0cnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiBhdHRycykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChhdHRycywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgICAgIGF0dHIgPSBhdHRyc1tpbmRleEF0dHJdO1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBhdHRyWzBdLFxuICAgICAgICAgICAgICAgICAgdmFsdWU6IGF0dHJbMV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGluZGV4Tm9kZSBpbiBub2Rlcykge1xuICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwobm9kZXMsIGluZGV4Tm9kZSkpIHtcbiAgICAgICAgICAgICAgbm9kZSA9IG5vZGVzW2luZGV4Tm9kZV07XG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIG5vZGUgPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKF9jclROKG5vZGUpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBwYXJlbnROb2RlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKG9iailcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZShmdW5jdGlvbiAoY2hpbGRzKVxuICAgICAgICB7d2l0aCAob2JqKSB7KGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdwb3B1cF9faGVhZCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cd0LDRgdGC0YDQvtC50LrQuCDQs9Cw0LvQtdGA0LXQuCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ2FjdGlvbicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1mb3JtJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZm9ybScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cl0YDQsNC90LjQu9C40YnQtScpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFicyc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdidXR0b24nO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzX19pdGVtJztcbmlmICggc3RvcmFnZSA9PSBcImxvY2FsXCIpIHtcbmF0dHIgKz0gJyB0YWJzX19pdGVtLS1hY3RpdmUnO1xufVxuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFicyBjb25maWdzLWdhbGxlcnktc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1tb2RhbC1zdG9yYWdlJztcbmF0dHJzLnB1c2goWydkYXRhLWdyb3VwJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnbG9jYWwnO1xuYXR0cnMucHVzaChbJ2RhdGEtdmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktbW9kYWwtc3RvcmFnZS1sb2NhbCc7XG5hdHRycy5wdXNoKFsnZGF0YS1mcmFtZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0JvQvtC60LDQu9GM0L3QvtC1Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdidXR0b24nO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzX19pdGVtJztcbmlmICggc3RvcmFnZSA9PSBcInMzXCIpIHtcbmF0dHIgKz0gJyB0YWJzX19pdGVtLS1hY3RpdmUnO1xufVxuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFicyBjb25maWdzLWdhbGxlcnktc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1tb2RhbC1zdG9yYWdlJztcbmF0dHJzLnB1c2goWydkYXRhLWdyb3VwJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnczMnO1xuYXR0cnMucHVzaChbJ2RhdGEtdmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktbW9kYWwtc3RvcmFnZS1zMyc7XG5hdHRycy5wdXNoKFsnZGF0YS1mcmFtZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnUzMnKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1tb2RhbC1zdG9yYWdlLWxvY2FsIGNvbmZpZ3MtZ2FsbGVyeS1tb2RhbC1zdG9yYWdlLWZyYW1lJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmlmICggc3RvcmFnZSAhPSBcImxvY2FsXCIpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZGlzcGxheTogbm9uZSc7XG5hdHRycy5wdXNoKFsnc3R5bGUnLCBhdHRyXSk7XG59KSgpO1xufVxuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1wYXRoJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J/Rg9GC0YwnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBwYXRoO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXBhdGgnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktcGF0aCc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktbW9kYWwtc3RvcmFnZS1zMyBjb25maWdzLWdhbGxlcnktbW9kYWwtc3RvcmFnZS1mcmFtZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5pZiAoIHN0b3JhZ2UgIT0gXCJzM1wiKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Rpc3BsYXk6IG5vbmUnO1xuYXR0cnMucHVzaChbJ3N0eWxlJywgYXR0cl0pO1xufSkoKTtcbn1cbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktczMtYWNjZXNzLWtleSc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ0FjY2VzcyBrZXknKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBzM0FjY2Vzc0tleTtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1hY2Nlc3Mta2V5JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXMzLWFjY2Vzcy1rZXknO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1zZWNyZXQta2V5JztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnU2VjcmV0IGtleScpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAncGFzc3dvcmQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXMzLXNlY3JldC1rZXknO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktczMtc2VjcmV0LWtleSc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXMzLWJ1Y2tldCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ0J1Y2tldCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHMzQnVja2V0O1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXMzLWJ1Y2tldCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1idWNrZXQnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1wYXRoJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J/Rg9GC0YwnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBzM1BhdGg7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktczMtcGF0aCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1wYXRoJztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXdpZHRoJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0KPQvNC10L3RjNGI0LjRgtGMINC+0YDQuNCz0LjQvdCw0Lsg0LTQviDRgNCw0LfQvNC10YDQsCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4gZm9ybV9faW5wLWNvbnRhaW4tLWZ1bGwtd2lkdGgnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSB3aWR0aDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS13aWR0aCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS13aWR0aCc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19iZXR3ZWVuLWlucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdzcGFuJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfDlycpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBoZWlnaHQ7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktaGVpZ2h0JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faGludCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9CV0YHQu9C4INC90LUg0LfQsNC00LDRgtGMINC30L3QsNGH0LXQvdC40LUsINC+0L3QviDQsdGD0LTQtdGCINCy0YvRh9C40YHQu9C10L3QviDQv9GA0L7Qv9C+0YDRhtC40L7QvdCw0LvRjNC90L4nKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktd2lkdGgnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQoNCw0LfQvNC10YAg0L/RgNC10LLRjNGOJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbiBmb3JtX19pbnAtY29udGFpbi0tZnVsbC13aWR0aCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHByZXZpZXdXaWR0aDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1wcmV2aWV3LXdpZHRoJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXdpZHRoJztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2JldHdlZW4taW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ3NwYW4nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ8OXJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHByZXZpZXdIZWlnaHQ7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktcHJldmlldy1oZWlnaHQnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19oaW50JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0JXRgdC70Lgg0L3QtSDQt9Cw0LTQsNGC0Ywg0LfQvdCw0YfQtdC90LjQtSwg0L7QvdC+INCx0YPQtNC10YIg0LLRi9GH0LjRgdC70LXQvdC+INC/0YDQvtC/0L7RgNGG0LjQvtC90LDQu9GM0L3QvicpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19zdWJtaXQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYnRuIGZvcm1fX2J0bi0tc3VibWl0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0KHQvtGF0YDQsNC90LjRgtGMJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdidXR0b24nO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19idG4gcG9wdXBfX2NhbmNlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Ce0YLQvNC10L3QuNGC0YwnKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn19KX07XG4gICAgfSk7IiwiKGZ1bmN0aW9uIChmYWN0b3J5KVxuICAgIHtcbiAgICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGRlZmluZSgnZmlyc3QtdHJ5JywgW10sIGZhY3RvcnkoKSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgd2luZG93Lm1vZGFsID0gZmFjdG9yeSgpO1xuICAgICAgfVxuICAgIH0pKGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgdmFyIF9oYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgICAgIHZhciBfY3JFbCA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICdub2RlJywgbmFtZTogbm9kZSwgYXR0cnM6IFtdLCBjaGlsZHM6IFtdfTtcbiAgICAgIH07XG4gICAgICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHt0eXBlOiAndGV4dCcsIHRleHQ6IG5vZGV9O1xuICAgICAgfTtcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZSgpXG4gICAgICB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgdmFyIHJvb3ROb2RlcyA9IFtdO1xuICAgICAgICAgIGFyZ3VtZW50c1swXShyb290Tm9kZXMpO1xuICAgICAgICAgIGlmIChyb290Tm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiByb290Tm9kZXMpIHtcbiAgICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwocm9vdE5vZGVzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgcm9vdE5vZGVzW2luZGV4QXR0cl0gPSBfY3JUTihyb290Tm9kZXNbaW5kZXhBdHRyXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByb290Tm9kZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICAgIHZhciBwYXJlbnROb2RlO1xuICAgICAgICAgIHZhciBpbmRleE5vZGU7XG4gICAgICAgICAgdmFyIG5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4QXR0cjtcbiAgICAgICAgICB2YXIgYXR0cjtcbiAgICAgICAgICB2YXIgYXR0cnMgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgYXJndW1lbnRzWzJdKG5vZGVzKTtcbiAgICAgICAgICBwYXJlbnROb2RlID0gX2NyRWwoYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICBpZiAoYXR0cnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiBhdHRycykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChhdHRycywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgICAgIGF0dHIgPSBhdHRyc1tpbmRleEF0dHJdO1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBhdHRyWzBdLFxuICAgICAgICAgICAgICAgICAgdmFsdWU6IGF0dHJbMV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGluZGV4Tm9kZSBpbiBub2Rlcykge1xuICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwobm9kZXMsIGluZGV4Tm9kZSkpIHtcbiAgICAgICAgICAgICAgbm9kZSA9IG5vZGVzW2luZGV4Tm9kZV07XG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIG5vZGUgPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKF9jclROKG5vZGUpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBwYXJlbnROb2RlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKG9iailcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZShmdW5jdGlvbiAoY2hpbGRzKVxuICAgICAgICB7d2l0aCAob2JqKSB7KGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdwb3B1cF9faGVhZCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cd0LDRgdGC0YDQvtC50LrQuCDQuNC30L7QsdGA0LDQttC10L3QuNGPJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRycy5wdXNoKFsnYWN0aW9uJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZvcm0nO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdmb3JtJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0KXRgNCw0L3QuNC70LjRidC1Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnNfX2l0ZW0nO1xuaWYgKCBzdG9yYWdlID09IFwibG9jYWxcIikge1xuYXR0ciArPSAnIHRhYnNfX2l0ZW0tLWFjdGl2ZSc7XG59XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzIGNvbmZpZ3MtaW1hZ2Utc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtbW9kYWwtc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsnZGF0YS1ncm91cCcsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2xvY2FsJztcbmF0dHJzLnB1c2goWydkYXRhLXZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLWxvY2FsJztcbmF0dHJzLnB1c2goWydkYXRhLWZyYW1lJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQm9C+0LrQsNC70YzQvdC+0LUnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnNfX2l0ZW0nO1xuaWYgKCBzdG9yYWdlID09IFwiczNcIikge1xuYXR0ciArPSAnIHRhYnNfX2l0ZW0tLWFjdGl2ZSc7XG59XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzIGNvbmZpZ3MtaW1hZ2Utc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtbW9kYWwtc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsnZGF0YS1ncm91cCcsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3MzJztcbmF0dHJzLnB1c2goWydkYXRhLXZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLXMzJztcbmF0dHJzLnB1c2goWydkYXRhLWZyYW1lJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCdTMycpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLWxvY2FsIGNvbmZpZ3MtaW1hZ2UtbW9kYWwtc3RvcmFnZS1mcmFtZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5pZiAoIHN0b3JhZ2UgIT0gXCJsb2NhbFwiKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Rpc3BsYXk6IG5vbmUnO1xuYXR0cnMucHVzaChbJ3N0eWxlJywgYXR0cl0pO1xufSkoKTtcbn1cbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXBhdGgnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQn9GD0YLRjCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHBhdGg7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXBhdGgnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXBhdGgnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLXMzIGNvbmZpZ3MtaW1hZ2UtbW9kYWwtc3RvcmFnZS1mcmFtZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5pZiAoIHN0b3JhZ2UgIT0gXCJzM1wiKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Rpc3BsYXk6IG5vbmUnO1xuYXR0cnMucHVzaChbJ3N0eWxlJywgYXR0cl0pO1xufSkoKTtcbn1cbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXMzLWFjY2Vzcy1rZXknO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCdBY2Nlc3Mga2V5Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gIHR5cGVvZiBzM0FjY2Vzc0tleSAhPT0gJ3VuZGVmaW5lZCcgPyBzM0FjY2Vzc0tleSA6ICcnIDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYWNjZXNzLWtleSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYWNjZXNzLWtleSc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1zMy1zZWNyZXQta2V5JztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnU2VjcmV0IGtleScpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAncGFzc3dvcmQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1zMy1zZWNyZXQta2V5JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1zMy1zZWNyZXQta2V5JztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXMzLWJ1Y2tldCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ0J1Y2tldCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICB0eXBlb2YgczNCdWNrZXQgIT09ICd1bmRlZmluZWQnID8gczNCdWNrZXQgOiAnJyA7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXMzLWJ1Y2tldCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYnVja2V0JztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXMzLXBhdGgnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQn9GD0YLRjCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICB0eXBlb2YgczNQYXRoICE9PSAndW5kZWZpbmVkJyA/IHMzUGF0aCA6ICcnIDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtcGF0aCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtcGF0aCc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2Utd2lkdGgnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQo9C80LXQvdGM0YjQuNGC0Ywg0LTQviDRgNCw0LfQvNC10YDQsCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4gZm9ybV9faW5wLWNvbnRhaW4tLWZ1bGwtd2lkdGgnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAgdHlwZW9mIHdpZHRoICE9PSAndW5kZWZpbmVkJyA/IHdpZHRoIDogJycgO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS13aWR0aCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2Utd2lkdGgnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYmV0d2Vlbi1pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnc3BhbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnw5cnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS12ZXJ5LXNob3J0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gIHR5cGVvZiBoZWlnaHQgIT09ICd1bmRlZmluZWQnID8gaGVpZ2h0IDogJycgO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1oZWlnaHQnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19oaW50JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0JXRgdC70Lgg0L3QtSDQt9Cw0LTQsNGC0Ywg0LfQvdCw0YfQtdC90LjQtSwg0L7QvdC+INCx0YPQtNC10YIg0LLRi9GH0LjRgdC70LXQvdC+INC/0YDQvtC/0L7RgNGG0LjQvtC90LDQu9GM0L3QvicpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2Utc291cmNlJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0JjRgdGC0L7Rh9C90LjQuicpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnc2VsZWN0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1zb3VyY2UnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXNvdXJjZSc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdzZWxlY3QnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd1cGxvYWQnO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbmlmICggc291cmNlID09IFwidXBsb2FkXCIpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ3NlbGVjdGVkJywgYXR0cl0pO1xufSkoKTtcbn1cbmNoaWxkcy5wdXNoKGNyZWF0ZSgnb3B0aW9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQl9Cw0LPRgNGD0LfQuNGC0Ywg0LjQt9C+0LHRgNCw0LbQtdC90LjQtScpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX3N1Ym1pdCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19idG4gZm9ybV9fYnRuLS1zdWJtaXQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQodC+0YXRgNCw0L3QuNGC0YwnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2J0biBwb3B1cF9fY2FuY2VsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J7RgtC80LXQvdC40YLRjCcpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufX0pfTtcbiAgICB9KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG4gICAge1xuICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cubW9kYWwgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgfSkoZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICAgICAgdmFyIF9jckVsID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICAgICAgfTtcbiAgICAgIHZhciBfY3JUTiA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICd0ZXh0JywgdGV4dDogbm9kZX07XG4gICAgICB9O1xuICAgICAgZnVuY3Rpb24gY3JlYXRlKClcbiAgICAgIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICB2YXIgcm9vdE5vZGVzID0gW107XG4gICAgICAgICAgYXJndW1lbnRzWzBdKHJvb3ROb2Rlcyk7XG4gICAgICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIHJvb3ROb2Rlcykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChyb290Tm9kZXMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICByb290Tm9kZXNbaW5kZXhBdHRyXSA9IF9jclROKHJvb3ROb2Rlc1tpbmRleEF0dHJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgICAgdmFyIHBhcmVudE5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4Tm9kZTtcbiAgICAgICAgICB2YXIgbm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhBdHRyO1xuICAgICAgICAgIHZhciBhdHRyO1xuICAgICAgICAgIHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICBhcmd1bWVudHNbMl0obm9kZXMpO1xuICAgICAgICAgIHBhcmVudE5vZGUgPSBfY3JFbChhcmd1bWVudHNbMF0pO1xuICAgICAgICAgIGlmIChhdHRycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKGF0dHJzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2luZGV4QXR0cl07XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5hdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IGF0dHJbMF0sXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogYXR0clsxXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAoaW5kZXhOb2RlIGluIG5vZGVzKSB7XG4gICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChub2RlcywgaW5kZXhOb2RlKSkge1xuICAgICAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhOb2RlXTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2goX2NyVE4obm9kZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqKVxuICAgICAge1xuICAgICAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAgICAgIHt3aXRoIChvYmopIHsoZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3BvcHVwX19oZWFkJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J3QsNGB0YLRgNC+0LnQutC4INC/0LXRgNC10LrQu9GO0YfQsNGC0LXQu9C10LknKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHJzLnB1c2goWydhY3Rpb24nLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZm9ybSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2Zvcm0nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tbnVtLW9wdGlvbnMnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQmtC+0LvQuNGH0LXRgdGC0LLQviDQstCw0YDQuNCw0L3RgtC+0LIg0L7RgtCy0LXRgtCwJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IG51bU9wdGlvbnM7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXJhZGlvLW51bS1vcHRpb25zJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1yYWRpby1udW0tb3B0aW9ucyc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9CS0LDRgNC40LDQvdGC0Ysg0L7RgtCy0LXRgtC+0LI6Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbiBmb3JtX19pbnAtY29udGFpbi0tZnVsbC13aWR0aCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19yb3ctb3B0aW9uJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3JhZGlvJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fY2hlY2tib3gnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1yYWRpby1vcHRpb24nO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICctMSc7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbi0tMSc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbic7XG5hdHRycy5wdXNoKFsnbmFtZScsIGF0dHJdKTtcbn0pKCk7XG5pZiAoIGRlZmF1bHRWYWx1ZSA9PSAtMSB8fCBkZWZhdWx0VmFsdWUgPT0gLTEpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ2NoZWNrZWQnLCBhdHRyXSk7XG59KSgpO1xufVxuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbi0tMSc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQndC40YfQtdCz0L4g0L3QtSDQstGL0LHRgNCw0L3QviDQv9C+INGD0LzQvtC70YfQsNC90LjRjicpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbnMtY29udGFpbic7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG52YXIgYXJyMCA9IGRlZmF1bHREYXRhOyBmb3IgKGkgaW4gYXJyMCkgaWYgKF9oYXNQcm9wLmNhbGwoYXJyMCwgaSkpIHtcbm9wdGlvbiA9IGFycjBbaV07XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX3Jvdy1vcHRpb24nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAncmFkaW8nO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19jaGVja2JveCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbic7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gaTtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uLSc7XG5hdHRyICs9IGk7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbic7XG5hdHRycy5wdXNoKFsnbmFtZScsIGF0dHJdKTtcbn0pKCk7XG5pZiAoIGRlZmF1bHRWYWx1ZSA9PSBpKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHJzLnB1c2goWydjaGVja2VkJywgYXR0cl0pO1xufSkoKTtcbn1cbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0taGFsZi13aWR0aCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IG9wdGlvbjtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uLWxhYmVsJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBpO1xuYXR0cnMucHVzaChbJ2RhdGEtaW5kZXgnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59fSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19zdWJtaXQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYnRuIGZvcm1fX2J0bi0tc3VibWl0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0KHQvtGF0YDQsNC90LjRgtGMJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdidXR0b24nO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19idG4gcG9wdXBfX2NhbmNlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Ce0YLQvNC10L3QuNGC0YwnKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn19KX07XG4gICAgfSk7IiwiKGZ1bmN0aW9uIChmYWN0b3J5KVxuICAgIHtcbiAgICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGRlZmluZSgnZmlyc3QtdHJ5JywgW10sIGZhY3RvcnkoKSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgd2luZG93Lm1vZGFsID0gZmFjdG9yeSgpO1xuICAgICAgfVxuICAgIH0pKGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgdmFyIF9oYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgICAgIHZhciBfY3JFbCA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICdub2RlJywgbmFtZTogbm9kZSwgYXR0cnM6IFtdLCBjaGlsZHM6IFtdfTtcbiAgICAgIH07XG4gICAgICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHt0eXBlOiAndGV4dCcsIHRleHQ6IG5vZGV9O1xuICAgICAgfTtcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZSgpXG4gICAgICB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgdmFyIHJvb3ROb2RlcyA9IFtdO1xuICAgICAgICAgIGFyZ3VtZW50c1swXShyb290Tm9kZXMpO1xuICAgICAgICAgIGlmIChyb290Tm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiByb290Tm9kZXMpIHtcbiAgICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwocm9vdE5vZGVzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgcm9vdE5vZGVzW2luZGV4QXR0cl0gPSBfY3JUTihyb290Tm9kZXNbaW5kZXhBdHRyXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByb290Tm9kZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICAgIHZhciBwYXJlbnROb2RlO1xuICAgICAgICAgIHZhciBpbmRleE5vZGU7XG4gICAgICAgICAgdmFyIG5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4QXR0cjtcbiAgICAgICAgICB2YXIgYXR0cjtcbiAgICAgICAgICB2YXIgYXR0cnMgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgYXJndW1lbnRzWzJdKG5vZGVzKTtcbiAgICAgICAgICBwYXJlbnROb2RlID0gX2NyRWwoYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICBpZiAoYXR0cnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiBhdHRycykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChhdHRycywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgICAgIGF0dHIgPSBhdHRyc1tpbmRleEF0dHJdO1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBhdHRyWzBdLFxuICAgICAgICAgICAgICAgICAgdmFsdWU6IGF0dHJbMV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGluZGV4Tm9kZSBpbiBub2Rlcykge1xuICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwobm9kZXMsIGluZGV4Tm9kZSkpIHtcbiAgICAgICAgICAgICAgbm9kZSA9IG5vZGVzW2luZGV4Tm9kZV07XG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIG5vZGUgPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKF9jclROKG5vZGUpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBwYXJlbnROb2RlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKG9iailcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZShmdW5jdGlvbiAoY2hpbGRzKVxuICAgICAgICB7d2l0aCAob2JqKSB7KGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdwb3B1cF9faGVhZCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cd0LDRgdGC0YDQvtC50LrQuCDRgtCw0LHQu9C40YbRiycpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ2FjdGlvbicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1mb3JtJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZm9ybScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy10YWJsZS1jb2x1bW5zJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0JrQvtC70L7QvdC+0Log0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4nKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS12ZXJ5LXNob3J0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gY29sdW1ucztcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtdGFibGUtY29sdW1ucyc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtdGFibGUtY29sdW1ucyc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy10YWJsZS1yb3dzJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0KHRgtGA0L7QuiDQv9C+INGD0LzQvtC70YfQsNC90LjRjicpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSByb3dzO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy10YWJsZS1yb3dzJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy10YWJsZS1yb3dzJztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXRhYmxlLXJvd3MnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQqNCw0LHQu9C+0L0g0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4nKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluIGZvcm1fX2lucC1jb250YWluLS1mdWxsLXdpZHRoIGZvcm1fX2lucC1jb250YWluLS1zY3JvbGwtd3JhcCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJsZSB0YWJsZS0tc3RyYWlnaHQtc2lkZXMgdGFibGUtLXJlc3BvbnNpdmUnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndGFibGUnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXRhYmxlLXRib2R5JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndGJvZHknLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xudmFyIGFycjAgPSBkZWZhdWx0RGF0YTsgZm9yIChyb3dJbmRleCBpbiBhcnIwKSBpZiAoX2hhc1Byb3AuY2FsbChhcnIwLCByb3dJbmRleCkpIHtcbnJvdyA9IGFycjBbcm93SW5kZXhdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0cicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG52YXIgYXJyMSA9IHJvdzsgZm9yIChjb2x1bW5JbmRleCBpbiBhcnIxKSBpZiAoX2hhc1Byb3AuY2FsbChhcnIxLCBjb2x1bW5JbmRleCkpIHtcbmNvbHVtbiA9IGFycjFbY29sdW1uSW5kZXhdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS12ZXJ5LXNob3J0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gY29sdW1uO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy10YWJsZS1jZWxsJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSByb3dJbmRleDtcbmF0dHJzLnB1c2goWydkYXRhLXJvdycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gY29sdW1uSW5kZXg7XG5hdHRycy5wdXNoKFsnZGF0YS1jb2x1bW4nLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn19KSk7XG59KSgpO1xufX0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX3N1Ym1pdCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19idG4gZm9ybV9fYnRuLS1zdWJtaXQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQodC+0YXRgNCw0L3QuNGC0YwnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2J0biBwb3B1cF9fY2FuY2VsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J7RgtC80LXQvdC40YLRjCcpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufX0pfTtcbiAgICB9KTsiXX0=
