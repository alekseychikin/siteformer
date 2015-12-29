(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, AddModel, AddView, Popup, addModel, addView, models, views;

AddModel = require("./addModel.coffee");

AddView = require("./addView.coffee");

$ = require("jquery-plugins.coffee");

addModel = AddModel();

addView = AddView($("@configs-add"), addModel);

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

addView.on("open-configs-modal", function(index, field, fields) {
  var model, view;
  Popup.open("@configs-popup");
  field.settings.index = index;
  model = models[field.type](field.settings);
  if (model.setFields != null) {
    model.setFields(fields);
  }
  view = views[field.type]($("@configs-popup"), model);
  return view.on("save-configs-modal", function(form) {
    addModel.saveFieldConfigs(form);
    Popup.close();
    return view.destroy();
  });
});

addModel.on("onSavedSection", function(alias) {
  return window.location.href = "/cms/configs/" + alias + "/";
});


},{"./addModel.coffee":2,"./addView.coffee":3,"checkbox/ConfigsCheckboxModel.coffee":4,"checkbox/ConfigsCheckboxView.coffee":5,"file/ConfigsFileModel.coffee":6,"file/ConfigsFileView.coffee":7,"gallery/ConfigsGalleryModel.coffee":8,"gallery/ConfigsGalleryView.coffee":9,"image/ConfigsImageModel.coffee":10,"image/ConfigsImageView.coffee":11,"jquery-plugins.coffee":"jquery-plugins.coffee","popup":"popup","radio/ConfigsRadioModel.coffee":12,"radio/ConfigsRadioView.coffee":13,"table/ConfigsTableModel.coffee":14,"table/ConfigsTableView.coffee":15}],2:[function(require,module,exports){
var Model, Promise, httpGet, httpPost;

Model = require("model.coffee");

Promise = require("q");

httpGet = (require("ajax.coffee")).httpGet;

httpPost = (require("ajax.coffee")).httpPost;

module.exports = Model({
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
      if (typeItem.type === type) {
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
  getFields: function() {
    return this.state.fields.slice();
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
    return httpPost("/cms/configs/action_save/__json/", this.state).then((function(_this) {
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
var $, Popup, Render, View, tableModuleFields;

$ = require("jquery-plugins.coffee");

View = require("view.coffee");

Render = require("render");

Popup = require("popup");

tableModuleFields = require("sections/configs/table-module-fields.tmpl.js");

module.exports = View({
  events: {
    "click: @btn-remove-field": function(e) {
      return this.model.removeField(this.getRowIndex(e));
    },
    "click: @btn-add-field": function(e) {
      return this.model.addEmptyField();
    },
    "change: @field-title": function(e) {
      return this.model.updateFieldTitle(this.getRowIndex(e), e.target.value);
    },
    "change: @field-alias": function(e) {
      return this.model.updateFieldAlias(this.getRowIndex(e), e.target.value);
    },
    "change: @field-type": function(e) {
      return this.model.updateFieldType(this.getRowIndex(e), e.target.value);
    },
    "change: @configs-add-title": function(e) {
      return this.model.updateTitle(e.target.value);
    },
    "change: @configs-add-alias": function(e) {
      return this.model.updateAlias(e.target.value);
    },
    "change: @configs-add-module": function(e) {
      return this.model.updateModule(e.target.value);
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
    return this.trigger("open-configs-modal", this.getRowIndex(e), this.model.getFieldByIndex(this.getRowIndex(e)), this.model.getFields());
  },
  submitConfigsAddForm: function(e) {
    this.model.save();
    return false;
  }
});


},{"jquery-plugins.coffee":"jquery-plugins.coffee","popup":"popup","render":"render","sections/configs/table-module-fields.tmpl.js":16,"view.coffee":"view.coffee"}],4:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
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
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/checkbox/modal.tmpl.js");

module.exports = View({
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-checkbox-num-options": function(e) {
      return this.model.updateNumOptions(e.target.value);
    },
    "change: @configs-checkbox-option": function(e) {
      return this.model.updateDefaultDataOptionChecked(this.getIndexByEvent(e), e.target.checked);
    },
    "change: @configs-checkbox-option-label": function(e) {
      return this.model.updateDefaultDataOption(this.getIndexByEvent(e), e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.destroy();
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
    this.trigger("save-configs-modal", this.model.getState());
    return false;
  }
});


},{"render":"render","types/checkbox/modal.tmpl.js":17,"view.coffee":"view.coffee"}],6:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
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


},{"model.coffee":"model.coffee"}],7:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/file/modal.tmpl.js");

module.exports = View({
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-file-storage": function(e) {
      return this.model.updateStorage(($(e.target)).data("value"));
    },
    "change: @configs-file-path": function(e) {
      return this.model.updatePath(e.target.value);
    },
    "change: @configs-file-width": function(e) {
      return this.model.updateWidth(e.target.value);
    },
    "change: @configs-file-height": function(e) {
      return this.model.updateHeight(e.target.value);
    },
    "change: @configs-file-source": function(e) {
      return this.model.updateSource(e.target.value);
    },
    "change: @configs-file-s3-access-key": function(e) {
      return this.model.updateS3AccessKey(e.target.value);
    },
    "change: @configs-file-s3-secret-key": function(e) {
      return this.model.updateS3SecretKey(e.target.value);
    },
    "change: @configs-file-s3-bucket": function(e) {
      return this.model.updateS3Bucket(e.target.value);
    },
    "change: @configs-file-s3-path": function(e) {
      return this.model.updateS3Path(e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.destroy();
    }
  },
  render: function(state) {
    this.modalContain(state);
    return ($("@tabs")).tabs();
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", this.model.getState());
    return false;
  }
});


},{"render":"render","types/file/modal.tmpl.js":18,"view.coffee":"view.coffee"}],8:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
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


},{"model.coffee":"model.coffee"}],9:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/gallery/modal.tmpl.js");

module.exports = View({
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-gallery-path": function(e) {
      return this.model.updatePath(e.target.value);
    },
    "change: @configs-gallery-width": function(e) {
      return this.model.updateWidth(e.target.value);
    },
    "change: @configs-gallery-height": function(e) {
      return this.model.updateHeight(e.target.value);
    },
    "change: @configs-gallery-preview-width": function(e) {
      return this.model.updatePreviewWidth(e.target.value);
    },
    "change: @configs-gallery-preview-height": function(e) {
      return this.model.updatePreviewHeight(e.target.value);
    },
    "change: @configs-gallery-storage": function(e) {
      return this.model.updateStorage(($(e.target)).data("value"));
    },
    "change: @configs-gallery-s3-access-key": function(e) {
      return this.model.updateS3AccessKey(e.target.value);
    },
    "change: @configs-gallery-s3-secret-key": function(e) {
      return this.model.updateS3SecretKey(e.target.value);
    },
    "change: @configs-gallery-s3-bucket": function(e) {
      return this.model.updateS3Bucket(e.target.value);
    },
    "change: @configs-gallery-s3-path": function(e) {
      return this.model.updateS3Path(e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.destroy();
    }
  },
  render: function(state) {
    this.modalContain(state);
    return ($("@tabs")).tabs();
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", this.model.getState());
    return false;
  }
});


},{"render":"render","types/gallery/modal.tmpl.js":19,"view.coffee":"view.coffee"}],10:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  setFields: function(fields) {
    var field, i, index, len, sources;
    sources = [];
    for (index = i = 0, len = fields.length; i < len; index = ++i) {
      field = fields[index];
      if (field.type === "image" && index !== this.state.index && field.alias.length) {
        sources.push({
          alias: field.alias,
          label: field.title
        });
      }
    }
    return this.set({
      sources: sources
    });
  },
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


},{"model.coffee":"model.coffee"}],11:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/image/modal.tmpl.js");

module.exports = View({
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-image-storage": function(e) {
      return this.model.updateStorage(($(e.target)).data("value"));
    },
    "change: @configs-image-path": function(e) {
      return this.model.updatePath(e.target.value);
    },
    "change: @configs-image-s3-access-key": function(e) {
      return this.model.updateS3AccessKey(e.target.value);
    },
    "change: @configs-image-s3-secret-key": function(e) {
      return this.model.updateS3SecretKey(e.target.value);
    },
    "change: @configs-image-s3-bucket": function(e) {
      return this.model.updateS3Bucket(e.target.value);
    },
    "change: @configs-image-s3-path": function(e) {
      return this.model.updateS3Path(e.target.value);
    },
    "change: @configs-image-width": function(e) {
      return this.model.updateWidth(e.target.value);
    },
    "change: @configs-image-height": function(e) {
      return this.model.updateHeight(e.target.value);
    },
    "change: @configs-image-source": function(e) {
      return this.model.updateSource(e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.destroy();
    },
    "popup-close: contain": function(e) {
      return this.destroy();
    }
  },
  render: function(state) {
    this.modalContain(state);
    return ($("@tabs")).tabs();
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", this.model.getState());
    return false;
  }
});


},{"render":"render","types/image/modal.tmpl.js":20,"view.coffee":"view.coffee"}],12:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
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


},{"model.coffee":"model.coffee"}],13:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/radio/modal.tmpl.js");

module.exports = View({
  initial: function() {
    return this.optionsContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-radio-num-options": function(e) {
      return this.model.updateNumOptions(e.target.value);
    },
    "change: @configs-radio-option": function(e) {
      return this.model.updateDefaultValue(e.target.value);
    },
    "change: @configs-radio-option-label": function(e) {
      return this.model.updateDefaultDataOption(this.getIndexByEvent(e), e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.destroy();
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
    this.trigger("save-configs-modal", this.model.getState());
    return false;
  }
});


},{"render":"render","types/radio/modal.tmpl.js":21,"view.coffee":"view.coffee"}],14:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
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


},{"model.coffee":"model.coffee"}],15:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/table/modal.tmpl.js");

module.exports = View({
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
      return this.model.updateCellData($cell.data("row"), $cell.data("column"), $cell.val());
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
      return this.destroy();
    }
  },
  changeConfigsTableRows: function(e) {
    return this.model.updateRows(e.target.value);
  },
  changeConfigsTableColumns: function(e) {
    return this.model.updateColumns(e.target.value);
  },
  render: function(state) {
    return this.modalContain(state);
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", this.model.getState());
    return false;
  }
});


},{"render":"render","types/table/modal.tmpl.js":22,"view.coffee":"view.coffee"}],16:[function(require,module,exports){
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
        var arr1 = fields;
        for (var index in arr1) if (_hasProp.call(arr1, index)) {
          field = arr1[index];
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
hasSettings = false;                          var arr2 = types;
                          for (var type in arr2) if (_hasProp.call(arr2, type)) {
                            type = arr2[type];
                            (function () {
                              var attrs = [];
                              (function () {
                                var attr = '';
                                attr += type['type'];
                                attrs.push(['value', attr]);
                              })();
                              if ( field['type'] == type['type']) {
                                (function () {
                                  var attr = '';
                                  attrs.push(['selected', attr]);
                                })();
                              }
                              childs.push(create('option', attrs, function (childs) {
                                childs.push(type['name']);
                              }));
                            })();
                            if ( field['type'] == type['type']) {
                              if ( type['hasSettings']) {
hasSettings = true;                              }
                            }
                          }
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
        }
      }
    });
  };
});
},{}],17:[function(require,module,exports){
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
                        var arr0 = defaultData;
                        for (var i in arr0) if (_hasProp.call(arr0, i)) {
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
                                (function () {
                                  var attr = '';
                                  attr += 'configs-checkbox-option-';
                                  attr += i;
                                  attrs.push(['for', attr]);
                                })();
                                (function () {
                                  var attr = '';
                                  attr += 'form__checkbox-label';
                                  attrs.push(['class', attr]);
                                })();
                                childs.push(create('label', attrs, function (childs) {
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
                        }
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
      }
    });
  };
});
},{}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
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
if (  typeof sources !== 'undefined' ? sources : '' ) {
var arr0 = sources; for (sourceItem in arr0) if (_hasProp.call(arr0, sourceItem)) {
sourceItem = arr0[sourceItem];
(function () {
var attrs = [];
(function () {
var attr = '';
attr += sourceItem['alias'];
attrs.push(['value', attr]);
})();
if ( source == sourceItem['alias']) {
(function () {
var attr = '';
attrs.push(['selected', attr]);
})();
}
childs.push(create('option', attrs, function (childs) {
childs.push(sourceItem['label'])
}));
})();
}}
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
},{}],21:[function(require,module,exports){
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
                            attr += 'form__radio';
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
                            attr += 'form__radio-label';
                            attrs.push(['class', attr]);
                          })();
                          (function () {
                            var attr = '';
                            attr += 'configs-radio-option--1';
                            attrs.push(['for', attr]);
                          })();
                          childs.push(create('label', attrs, function (childs) {
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
                        var arr1 = defaultData;
                        for (var i in arr1) if (_hasProp.call(arr1, i)) {
                          option = arr1[i];
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
                                  attr += 'form__radio';
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
                                (function () {
                                  var attr = '';
                                  attr += 'form__radio-label';
                                  attrs.push(['class', attr]);
                                })();
                                (function () {
                                  var attr = '';
                                  attr += 'configs-radio-option-';
                                  attr += i;
                                  attrs.push(['for', attr]);
                                })();
                                childs.push(create('label', attrs, function (childs) {
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
                        }
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
      }
    });
  };
});
},{}],22:[function(require,module,exports){
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
var arr8 = defaultData; for (rowIndex in arr8) if (_hasProp.call(arr8, rowIndex)) {
row = arr8[rowIndex];
(function () {
var attrs = [];
childs.push(create('tr', attrs, function (childs) {
var arr9 = row; for (columnIndex in arr9) if (_hasProp.call(arr9, columnIndex)) {
column = arr9[columnIndex];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2FkZC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2FkZE1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9jaGVja2JveC9Db25maWdzQ2hlY2tib3hNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9jaGVja2JveC9Db25maWdzQ2hlY2tib3hWaWV3LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL2ZpbGUvQ29uZmlnc0ZpbGVNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9maWxlL0NvbmZpZ3NGaWxlVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9nYWxsZXJ5L0NvbmZpZ3NHYWxsZXJ5TW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvZ2FsbGVyeS9Db25maWdzR2FsbGVyeVZpZXcuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvaW1hZ2UvQ29uZmlnc0ltYWdlTW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvaW1hZ2UvQ29uZmlnc0ltYWdlVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9yYWRpby9Db25maWdzUmFkaW9Nb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9yYWRpby9Db25maWdzUmFkaW9WaWV3LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3RhYmxlL0NvbmZpZ3NUYWJsZU1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3RhYmxlL0NvbmZpZ3NUYWJsZVZpZXcuY29mZmVlIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvc2VjdGlvbnMvY29uZmlncy90YWJsZS1tb2R1bGUtZmllbGRzLnRtcGwuanMiLCJ0ZW1wL21vZHVsZXMvR1VJLy5jb21waWxlX3RlbXBsYXRlcy90eXBlcy9jaGVja2JveC9tb2RhbC50bXBsLmpzIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvdHlwZXMvZmlsZS9tb2RhbC50bXBsLmpzIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvdHlwZXMvZ2FsbGVyeS9tb2RhbC50bXBsLmpzIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvdHlwZXMvaW1hZ2UvbW9kYWwudG1wbC5qcyIsInRlbXAvbW9kdWxlcy9HVUkvLmNvbXBpbGVfdGVtcGxhdGVzL3R5cGVzL3JhZGlvL21vZGFsLnRtcGwuanMiLCJ0ZW1wL21vZHVsZXMvR1VJLy5jb21waWxlX3RlbXBsYXRlcy90eXBlcy90YWJsZS9tb2RhbC50bXBsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLG1CQUFSOztBQUNYLE9BQUEsR0FBVSxPQUFBLENBQVEsa0JBQVI7O0FBQ1YsQ0FBQSxHQUFJLE9BQUEsQ0FBUSx1QkFBUjs7QUFFSixRQUFBLEdBQVcsUUFBQSxDQUFBOztBQUNYLE9BQUEsR0FBVSxPQUFBLENBQVMsQ0FBQSxDQUFFLGNBQUYsQ0FBVCxFQUE0QixRQUE1Qjs7QUFHVixNQUFBLEdBQ0U7RUFBQSxLQUFBLEVBQU8sT0FBQSxDQUFRLGdDQUFSLENBQVA7RUFDQSxLQUFBLEVBQU8sT0FBQSxDQUFRLGdDQUFSLENBRFA7RUFFQSxJQUFBLEVBQU0sT0FBQSxDQUFRLDhCQUFSLENBRk47RUFHQSxLQUFBLEVBQU8sT0FBQSxDQUFRLGdDQUFSLENBSFA7RUFJQSxRQUFBLEVBQVUsT0FBQSxDQUFRLHNDQUFSLENBSlY7RUFLQSxPQUFBLEVBQVMsT0FBQSxDQUFRLG9DQUFSLENBTFQ7OztBQU9GLEtBQUEsR0FDRTtFQUFBLEtBQUEsRUFBTyxP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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcDFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3QwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcmNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIkFkZE1vZGVsID0gcmVxdWlyZSBcIi4vYWRkTW9kZWwuY29mZmVlXCJcbkFkZFZpZXcgPSByZXF1aXJlIFwiLi9hZGRWaWV3LmNvZmZlZVwiXG4kID0gcmVxdWlyZSBcImpxdWVyeS1wbHVnaW5zLmNvZmZlZVwiXG5cbmFkZE1vZGVsID0gQWRkTW9kZWwoKVxuYWRkVmlldyA9IEFkZFZpZXcgKCQgXCJAY29uZmlncy1hZGRcIiksIGFkZE1vZGVsXG5cblxubW9kZWxzID1cbiAgaW1hZ2U6IHJlcXVpcmUgXCJpbWFnZS9Db25maWdzSW1hZ2VNb2RlbC5jb2ZmZWVcIlxuICB0YWJsZTogcmVxdWlyZSBcInRhYmxlL0NvbmZpZ3NUYWJsZU1vZGVsLmNvZmZlZVwiXG4gIGZpbGU6IHJlcXVpcmUgXCJmaWxlL0NvbmZpZ3NGaWxlTW9kZWwuY29mZmVlXCJcbiAgcmFkaW86IHJlcXVpcmUgXCJyYWRpby9Db25maWdzUmFkaW9Nb2RlbC5jb2ZmZWVcIlxuICBjaGVja2JveDogcmVxdWlyZSBcImNoZWNrYm94L0NvbmZpZ3NDaGVja2JveE1vZGVsLmNvZmZlZVwiXG4gIGdhbGxlcnk6IHJlcXVpcmUgXCJnYWxsZXJ5L0NvbmZpZ3NHYWxsZXJ5TW9kZWwuY29mZmVlXCJcblxudmlld3MgPVxuICBpbWFnZTogcmVxdWlyZSBcImltYWdlL0NvbmZpZ3NJbWFnZVZpZXcuY29mZmVlXCJcbiAgdGFibGU6IHJlcXVpcmUgXCJ0YWJsZS9Db25maWdzVGFibGVWaWV3LmNvZmZlZVwiXG4gIGZpbGU6IHJlcXVpcmUgXCJmaWxlL0NvbmZpZ3NGaWxlVmlldy5jb2ZmZWVcIlxuICByYWRpbzogcmVxdWlyZSBcInJhZGlvL0NvbmZpZ3NSYWRpb1ZpZXcuY29mZmVlXCJcbiAgY2hlY2tib3g6IHJlcXVpcmUgXCJjaGVja2JveC9Db25maWdzQ2hlY2tib3hWaWV3LmNvZmZlZVwiXG4gIGdhbGxlcnk6IHJlcXVpcmUgXCJnYWxsZXJ5L0NvbmZpZ3NHYWxsZXJ5Vmlldy5jb2ZmZWVcIlxuXG5Qb3B1cCA9IHJlcXVpcmUgXCJwb3B1cFwiXG5cbmFkZFZpZXcub24gXCJvcGVuLWNvbmZpZ3MtbW9kYWxcIiwgKGluZGV4LCBmaWVsZCwgZmllbGRzKSAtPlxuICBQb3B1cC5vcGVuIFwiQGNvbmZpZ3MtcG9wdXBcIlxuICBmaWVsZC5zZXR0aW5ncy5pbmRleCA9IGluZGV4XG5cbiAgbW9kZWwgPSBtb2RlbHNbZmllbGQudHlwZV0gZmllbGQuc2V0dGluZ3NcbiAgbW9kZWwuc2V0RmllbGRzIGZpZWxkcyBpZiBtb2RlbC5zZXRGaWVsZHM/XG5cbiAgdmlldyA9IHZpZXdzW2ZpZWxkLnR5cGVdICgkIFwiQGNvbmZpZ3MtcG9wdXBcIiksIG1vZGVsXG4gIHZpZXcub24gXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgKGZvcm0pIC0+XG4gICAgYWRkTW9kZWwuc2F2ZUZpZWxkQ29uZmlncyBmb3JtXG4gICAgUG9wdXAuY2xvc2UoKVxuICAgIHZpZXcuZGVzdHJveSgpXG5cbmFkZE1vZGVsLm9uIFwib25TYXZlZFNlY3Rpb25cIiwgKGFsaWFzKSAtPlxuICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL2Ntcy9jb25maWdzLyN7YWxpYXN9L1wiXG5cbiMgc2V0VGltZW91dCA9PlxuIyAgICgkIFwiQGZpZWxkLXR5cGVcIilcbiMgICAuZXEoMSlcbiMgICAudmFsIFwidGFibGVcIlxuIyAgIC50cmlnZ2VyIFwiY2hhbmdlXCJcbiMgICBzZXRUaW1lb3V0ID0+XG4jICAgICAoJCBcIkBidG4tY29uZmlnLWZpZWxkXCIpLnRyaWdnZXIgXCJjbGlja1wiXG4jICAgICAjIHNldFRpbWVvdXQgPT5cbiMgICAgICMgICAoJCBcIkBjb25maWdzLWltYWdlLXN0b3JhZ2VcIikuZXEoMSkudHJpZ2dlciBcImNsaWNrXCJcbiMgICAgICMgLCA0MFxuIyAgICwgNDBcbiMgLCA1MDBcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5Qcm9taXNlID0gcmVxdWlyZSBcInFcIlxuaHR0cEdldCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cEdldFxuaHR0cFBvc3QgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBQb3N0XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgaW5pdGlhbFN0YXRlOiAtPlxuICAgIGh0dHBHZXQgXCIje3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZX1fX2pzb24vXCJcbiAgICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgICAgc3RhdGUgPVxuICAgICAgICAgIHRpdGxlOiByZXNwb25zZS50aXRsZVxuICAgICAgICAgIGFsaWFzOiByZXNwb25zZS5hbGlhc1xuICAgICAgICAgIG1vZHVsZTogcmVzcG9uc2UubW9kdWxlXG4gICAgICAgICAgZmllbGRzOiByZXNwb25zZS5maWVsZHNcbiAgICAgICAgICB0eXBlczogcmVzcG9uc2UudHlwZXNcbiAgICAgICAgaWYgcmVzcG9uc2UuaWRcbiAgICAgICAgICBzdGF0ZS5pZCA9IHJlc3BvbnNlLmlkXG4gICAgICAgIGNvbnNvbGUubG9nIHN0YXRlXG4gICAgICAgIHN0YXRlXG5cbiAgYWRkRmllbGQ6IChmaWVsZCkgLT5cbiAgICBAc2V0IGZpZWxkczogQHN0YXRlLmZpZWxkcy5jb25jYXQgW2ZpZWxkXVxuXG4gIGFkZEVtcHR5RmllbGQ6IC0+XG4gICAgQHNldCBmaWVsZHM6IEBzdGF0ZS5maWVsZHMuY29uY2F0IFtcbiAgICAgIHRpdGxlOiBcIlwiXG4gICAgICBhbGlhczogXCJcIlxuICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIF1cblxuICB1cGRhdGVUaXRsZTogKHZhbHVlKSAtPiBAc2V0IHRpdGxlOiB2YWx1ZVxuICB1cGRhdGVBbGlhczogKHZhbHVlKSAtPiBAc2V0IGFsaWFzOiB2YWx1ZVxuICB1cGRhdGVNb2R1bGU6ICh2YWx1ZSkgLT4gQHNldCBtb2R1bGU6IHZhbHVlXG5cbiAgdXBkYXRlRmllbGRUaXRsZTogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBmaWVsZHMgPSBAc3RhdGUuZmllbGRzLnNsaWNlKClcbiAgICBmaWVsZHNbaW5kZXhdLnRpdGxlID0gdmFsdWVcbiAgICBAc2V0IHtmaWVsZHN9XG5cbiAgdXBkYXRlRmllbGRBbGlhczogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBmaWVsZHMgPSBAc3RhdGUuZmllbGRzLnNsaWNlKClcbiAgICBmaWVsZHNbaW5kZXhdLmFsaWFzID0gdmFsdWVcbiAgICBAc2V0IHtmaWVsZHN9XG5cbiAgdXBkYXRlRmllbGRUeXBlOiAoaW5kZXgsIHZhbHVlKSAtPlxuICAgIGZpZWxkcyA9IEBzdGF0ZS5maWVsZHMuc2xpY2UoKVxuICAgIGZpZWxkc1tpbmRleF0udHlwZSA9IHZhbHVlXG4gICAgQHJlc2V0U2V0dGluZ3MgaW5kZXhcbiAgICBAc2V0IHtmaWVsZHN9XG5cbiAgcmVzZXRTZXR0aW5nczogKGluZGV4KSAtPlxuICAgIGZpZWxkcyA9IEBzdGF0ZS5maWVsZHMuc2xpY2UoKVxuICAgIHR5cGUgPSBmaWVsZHNbaW5kZXhdLnR5cGVcbiAgICBmb3IgdHlwZUl0ZW0gaW4gQHN0YXRlLnR5cGVzXG4gICAgICBpZiB0eXBlSXRlbS50eXBlID09IHR5cGVcbiAgICAgICAgZmllbGRzW2luZGV4XS5zZXR0aW5ncyA9IEBjbG9uZSB0eXBlSXRlbS5kZWZhdWx0U2V0dGluZ3NcbiAgICBAc2V0IHtmaWVsZHN9XG5cbiAgcmVtb3ZlRmllbGQ6IChpbmRleCkgLT5cbiAgICBmaWVsZHMgPSBAc3RhdGUuZmllbGRzLnNsaWNlKClcbiAgICBmaWVsZHMuc3BsaWNlIGluZGV4LCAxXG4gICAgQHNldCB7ZmllbGRzfVxuXG4gIGdldEZpZWxkQnlJbmRleDogKGluZGV4KSAtPiBAY2xvbmUgQHN0YXRlLmZpZWxkc1tpbmRleF1cblxuICBnZXRGaWVsZHM6IC0+IEBzdGF0ZS5maWVsZHMuc2xpY2UoKVxuXG4gIHNhdmVGaWVsZENvbmZpZ3M6IChmb3JtKSAtPlxuICAgIGluZGV4ID0gZm9ybS5pbmRleFxuICAgIGRlbGV0ZSBmb3JtLmluZGV4XG4gICAgZmllbGRzID0gQHN0YXRlLmZpZWxkcy5zbGljZSgpXG4gICAgZmllbGRzW2luZGV4XS5zZXR0aW5ncyA9IGZvcm1cbiAgICBAc2V0IHtmaWVsZHN9XG5cbiAgc2F2ZTogLT5cbiAgICBjb25zb2xlLmxvZyBAc3RhdGVcbiAgICBodHRwUG9zdCBcIi9jbXMvY29uZmlncy9hY3Rpb25fc2F2ZS9fX2pzb24vXCIsIEBzdGF0ZVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSA9PlxuICAgICAgICBpZiBAc3RhdGUuaWQ/XG4gICAgICAgICAgQHNldCBmaWVsZHM6IHJlc3BvbnNlLnNlY3Rpb24uZmllbGRzXG4gICAgICAgICAgQHNldCBpZDogcmVzcG9uc2Uuc2VjdGlvbi5pZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgQHRyaWdnZXIgXCJvblNhdmVkU2VjdGlvblwiLCBAc3RhdGUuYWxpYXNcbiAgICAgIC5jYXRjaCAocmVzcG9uc2UpIC0+XG4gICAgICAgIGNvbnNvbGUuZXJyb3IgcmVzcG9uc2UuZXJyb3JcbiIsIiQgPSByZXF1aXJlIFwianF1ZXJ5LXBsdWdpbnMuY29mZmVlXCJcblZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlclwiXG5Qb3B1cCA9IHJlcXVpcmUgXCJwb3B1cFwiXG50YWJsZU1vZHVsZUZpZWxkcyA9IHJlcXVpcmUgXCJzZWN0aW9ucy9jb25maWdzL3RhYmxlLW1vZHVsZS1maWVsZHMudG1wbC5qc1wiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBldmVudHM6XG4gICAgXCJjbGljazogQGJ0bi1yZW1vdmUtZmllbGRcIjogKGUpIC0+IEBtb2RlbC5yZW1vdmVGaWVsZCBAZ2V0Um93SW5kZXggZVxuICAgIFwiY2xpY2s6IEBidG4tYWRkLWZpZWxkXCI6IChlKSAtPiBAbW9kZWwuYWRkRW1wdHlGaWVsZCgpXG4gICAgXCJjaGFuZ2U6IEBmaWVsZC10aXRsZVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZUZpZWxkVGl0bGUgKEBnZXRSb3dJbmRleCBlKSwgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGZpZWxkLWFsaWFzXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlRmllbGRBbGlhcyAoQGdldFJvd0luZGV4IGUpLCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAZmllbGQtdHlwZVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZUZpZWxkVHlwZSAoQGdldFJvd0luZGV4IGUpLCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1hZGQtdGl0bGVcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVUaXRsZSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1hZGQtYWxpYXNcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVBbGlhcyBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1hZGQtbW9kdWxlXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlTW9kdWxlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjbGljazogQGJ0bi1jb25maWctZmllbGRcIjogXCJjbGlja0J0bkNvbmZpZ0ZpZWxkXCJcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtYWRkLWZvcm1cIjogXCJzdWJtaXRDb25maWdzQWRkRm9ybVwiXG5cbiAgaW5pdGlhbDogLT5cbiAgICBAdGJvZHlDb250YWluID0gUmVuZGVyIHRhYmxlTW9kdWxlRmllbGRzLCAoJCBcIkB0Ym9keS1tb2R1bGUtZmllbGRzXCIpWzBdXG5cbiAgcmVuZGVyOiAoc3RhdGUpIC0+XG4gICAgQHRib2R5Q29udGFpbiBzdGF0ZVxuXG4gIGdldFJvd0luZGV4OiAoZSkgLT5cbiAgICAkcGFyZW50ID0gKCQgZS50YXJnZXQpLmNsb3Nlc3QgXCJbZGF0YS1rZXldXCJcbiAgICByZXR1cm4gJHBhcmVudC5kYXRhIFwia2V5XCJcblxuICBjbGlja0J0bkNvbmZpZ0ZpZWxkOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcIm9wZW4tY29uZmlncy1tb2RhbFwiLFxuICAgICAgQGdldFJvd0luZGV4IGVcbiAgICAgIEBtb2RlbC5nZXRGaWVsZEJ5SW5kZXggQGdldFJvd0luZGV4IGVcbiAgICAgIEBtb2RlbC5nZXRGaWVsZHMoKVxuXG4gIHN1Ym1pdENvbmZpZ3NBZGRGb3JtOiAoZSkgLT5cbiAgICBAbW9kZWwuc2F2ZSgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcblxuICB1cGRhdGVOdW1PcHRpb25zOiAodmFsdWUpIC0+XG4gICAgdmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcbiAgICBudW1PcHRzID0gcGFyc2VJbnQgQHN0YXRlLm51bU9wdGlvbnMsIDEwXG4gICAgZGVmYXVsdERhdGEgPSBAc3RhdGUuZGVmYXVsdERhdGEuc2xpY2UoKVxuICAgIGlmIHZhbHVlID4gbnVtT3B0c1xuICAgICAgZm9yIGkgaW4gW251bU9wdHMgKyAxLi52YWx1ZV1cbiAgICAgICAgZGVmYXVsdERhdGEucHVzaFxuICAgICAgICAgIGxhYmVsOiBcIlwiXG4gICAgICAgICAgY2hlY2tlZDogZmFsc2VcbiAgICBlbHNlXG4gICAgICBmb3IgaSBpbiBbdmFsdWUgKyAxLi5udW1PcHRzXVxuICAgICAgICBkZWZhdWx0RGF0YS5wb3AoKVxuICAgIEBzZXQgbnVtT3B0aW9uczogdmFsdWVcbiAgICBAc2V0IGRlZmF1bHREYXRhOiBkZWZhdWx0RGF0YVxuXG4gIHVwZGF0ZURlZmF1bHREYXRhT3B0aW9uQ2hlY2tlZDogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBkYXRhID0gQHN0YXRlLmRlZmF1bHREYXRhLnNsaWNlKClcbiAgICBkYXRhW2luZGV4XS5jaGVja2VkID0gdmFsdWVcbiAgICBAc2V0IGRlZmF1bHREYXRhOiBkYXRhXG5cbiAgdXBkYXRlRGVmYXVsdERhdGFPcHRpb246IChpbmRleCwgdmFsdWUpIC0+XG4gICAgZGF0YSA9IEBzdGF0ZS5kZWZhdWx0RGF0YS5zbGljZSgpXG4gICAgZGF0YVtpbmRleF0ubGFiZWwgPSB2YWx1ZVxuICAgIEBzZXQgZGVmYXVsdERhdGE6IGRhdGFcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlclwiXG5tb2RhbFdpbmRvd1RlbXBsYXRlID0gcmVxdWlyZSBcInR5cGVzL2NoZWNrYm94L21vZGFsLnRtcGwuanNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgaW5pdGlhbDogLT5cbiAgICBAbW9kYWxDb250YWluID0gUmVuZGVyIG1vZGFsV2luZG93VGVtcGxhdGUsIEBjb250YWluWzBdXG5cbiAgZXZlbnRzOlxuICAgIFwic3VibWl0OiBAY29uZmlncy1mb3JtXCI6IFwic3VibWl0Q29uZmlnc0Zvcm1cIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1jaGVja2JveC1udW0tb3B0aW9uc1wiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZU51bU9wdGlvbnMgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtY2hlY2tib3gtb3B0aW9uXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlRGVmYXVsdERhdGFPcHRpb25DaGVja2VkIChAZ2V0SW5kZXhCeUV2ZW50IGUpLCBlLnRhcmdldC5jaGVja2VkXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWNoZWNrYm94LW9wdGlvbi1sYWJlbFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZURlZmF1bHREYXRhT3B0aW9uIChAZ2V0SW5kZXhCeUV2ZW50IGUpLCBlLnRhcmdldC52YWx1ZVxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEBkZXN0cm95KClcblxuICBnZXRJbmRleEJ5RXZlbnQ6IChlKSAtPlxuICAgICRpdGVtID0gJCBlLnRhcmdldFxuICAgICRpdGVtLmRhdGEgXCJpbmRleFwiXG5cbiAgcmVuZGVyOiAoc3RhdGUpIC0+XG4gICAgQG1vZGFsQ29udGFpbiBzdGF0ZVxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBAbW9kZWwuZ2V0U3RhdGUoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICB1cGRhdGVTdG9yYWdlOiAodmFsdWUpIC0+IEBzZXQgc3RvcmFnZTogdmFsdWVcbiAgdXBkYXRlUGF0aDogKHZhbHVlKSAtPiBAc2V0IHBhdGg6IHZhbHVlXG4gIHVwZGF0ZVMzQWNjZXNzS2V5OiAodmFsdWUpIC0+IEBzZXQgczNBY2Nlc3NLZXk6IHZhbHVlXG4gIHVwZGF0ZVMzU2VjcmV0S2V5OiAodmFsdWUpIC0+IEBzZXQgczNTZWNyZXRLZXk6IHZhbHVlXG4gIHVwZGF0ZVMzQnVja2V0OiAodmFsdWUpIC0+IEBzZXQgczNCdWNrZXQ6IHZhbHVlXG4gIHVwZGF0ZVMzUGF0aDogKHZhbHVlKSAtPiBAc2V0IHMzUGF0aDogdmFsdWVcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxubW9kYWxXaW5kb3dUZW1wbGF0ZSA9IHJlcXVpcmUgXCJ0eXBlcy9maWxlL21vZGFsLnRtcGwuanNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgaW5pdGlhbDogLT5cbiAgICBAbW9kYWxDb250YWluID0gUmVuZGVyIG1vZGFsV2luZG93VGVtcGxhdGUsIEBjb250YWluWzBdXG5cbiAgZXZlbnRzOlxuICAgIFwic3VibWl0OiBAY29uZmlncy1mb3JtXCI6IFwic3VibWl0Q29uZmlnc0Zvcm1cIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLXN0b3JhZ2VcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVTdG9yYWdlICgkIGUudGFyZ2V0KS5kYXRhIFwidmFsdWVcIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLXBhdGhcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtd2lkdGhcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVXaWR0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLWhlaWdodFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZUhlaWdodCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLXNvdXJjZVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVNvdXJjZSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLXMzLWFjY2Vzcy1rZXlcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVTM0FjY2Vzc0tleSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLXMzLXNlY3JldC1rZXlcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVTM1NlY3JldEtleSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLXMzLWJ1Y2tldFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVMzQnVja2V0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtczMtcGF0aFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVMzUGF0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEBkZXN0cm95KClcblxuICByZW5kZXI6IChzdGF0ZSkgLT5cbiAgICBAbW9kYWxDb250YWluIHN0YXRlXG4gICAgKCQgXCJAdGFic1wiKS50YWJzKClcblxuICBzdWJtaXRDb25maWdzRm9ybTogKGUpIC0+XG4gICAgQHRyaWdnZXIgXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgQG1vZGVsLmdldFN0YXRlKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgdXBkYXRlU3RvcmFnZTogKHZhbHVlKSAtPiBAc2V0IHN0b3JhZ2U6IHZhbHVlXG5cbiAgdXBkYXRlUGF0aDogKHZhbHVlKSAtPiBAc2V0IHBhdGg6IHZhbHVlXG4gIHVwZGF0ZVdpZHRoOiAodmFsdWUpIC0+IEBzZXQgd2lkdGg6IHZhbHVlXG4gIHVwZGF0ZUhlaWdodDogKHZhbHVlKSAtPiBAc2V0IGhlaWdodDogdmFsdWVcbiAgdXBkYXRlUHJldmlld1dpZHRoOiAodmFsdWUpIC0+IEBzZXQgcHJldmlld1dpZHRoOiB2YWx1ZVxuICB1cGRhdGVQcmV2aWV3SGVpZ2h0OiAodmFsdWUpIC0+IEBzZXQgcHJldmlld0hlaWdodDogdmFsdWVcblxuICB1cGRhdGVTM0FjY2Vzc0tleTogKHZhbHVlKSAtPiBAc2V0IHMzQWNjZXNzS2V5OiB2YWx1ZVxuICB1cGRhdGVTM1NlY3JldEtleTogKHZhbHVlKSAtPiBAc2V0IHMzU2VjcmV0S2V5OiB2YWx1ZVxuICB1cGRhdGVTM0J1Y2tldDogKHZhbHVlKSAtPiBAc2V0IHMzQnVja2V0OiB2YWx1ZVxuICB1cGRhdGVTM1BhdGg6ICh2YWx1ZSkgLT4gQHNldCBzM1BhdGg6IHZhbHVlXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcbm1vZGFsV2luZG93VGVtcGxhdGUgPSByZXF1aXJlIFwidHlwZXMvZ2FsbGVyeS9tb2RhbC50bXBsLmpzXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGluaXRpYWw6IC0+XG4gICAgQG1vZGFsQ29udGFpbiA9IFJlbmRlciBtb2RhbFdpbmRvd1RlbXBsYXRlLCBAY29udGFpblswXVxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1wYXRoXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUGF0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1nYWxsZXJ5LXdpZHRoXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlV2lkdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1oZWlnaHRcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVIZWlnaHQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1wcmV2aWV3LXdpZHRoXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUHJldmlld1dpZHRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWdhbGxlcnktcHJldmlldy1oZWlnaHRcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVQcmV2aWV3SGVpZ2h0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWdhbGxlcnktc3RvcmFnZVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVN0b3JhZ2UgKCQgZS50YXJnZXQpLmRhdGEgXCJ2YWx1ZVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWdhbGxlcnktczMtYWNjZXNzLWtleVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVMzQWNjZXNzS2V5IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWdhbGxlcnktczMtc2VjcmV0LWtleVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVMzU2VjcmV0S2V5IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWdhbGxlcnktczMtYnVja2V0XCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUzNCdWNrZXQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1zMy1wYXRoXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUzNQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQGRlc3Ryb3koKVxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPlxuICAgIEBtb2RhbENvbnRhaW4gc3RhdGVcbiAgICAoJCBcIkB0YWJzXCIpLnRhYnMoKVxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBAbW9kZWwuZ2V0U3RhdGUoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBzZXRGaWVsZHM6IChmaWVsZHMpIC0+XG4gICAgc291cmNlcyA9IFtdXG4gICAgZm9yIGZpZWxkLCBpbmRleCBpbiAgZmllbGRzXG4gICAgICBpZiBmaWVsZC50eXBlID09IFwiaW1hZ2VcIiAmJiBpbmRleCAhPSBAc3RhdGUuaW5kZXggJiYgZmllbGQuYWxpYXMubGVuZ3RoXG4gICAgICAgIHNvdXJjZXMucHVzaCBhbGlhczogZmllbGQuYWxpYXMsIGxhYmVsOiBmaWVsZC50aXRsZVxuICAgIEBzZXQge3NvdXJjZXN9XG5cbiAgdXBkYXRlU3RvcmFnZTogKHZhbHVlKSAtPiBAc2V0IHN0b3JhZ2U6IHZhbHVlXG5cbiAgdXBkYXRlUGF0aDogKHZhbHVlKSAtPiBAc2V0IHBhdGg6IHZhbHVlXG5cbiAgdXBkYXRlUzNBY2Nlc3NLZXk6ICh2YWx1ZSkgLT4gQHNldCBzM0FjY2Vzc0tleTogdmFsdWVcbiAgdXBkYXRlUzNTZWNyZXRLZXk6ICh2YWx1ZSkgLT4gQHNldCBzM1NlY3JldEtleTogdmFsdWVcbiAgdXBkYXRlUzNCdWNrZXQ6ICh2YWx1ZSkgLT4gQHNldCBzM0J1Y2tldDogdmFsdWVcbiAgdXBkYXRlUzNQYXRoOiAodmFsdWUpIC0+IEBzZXQgczNQYXRoOiB2YWx1ZVxuXG4gIHVwZGF0ZVdpZHRoOiAodmFsdWUpIC0+IEBzZXQgd2lkdGg6IHZhbHVlXG4gIHVwZGF0ZUhlaWdodDogKHZhbHVlKSAtPiBAc2V0IGhlaWdodDogdmFsdWVcbiAgdXBkYXRlU291cmNlOiAodmFsdWUpIC0+IEBzZXQgc291cmNlOiB2YWx1ZVxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlclwiXG5tb2RhbFdpbmRvd1RlbXBsYXRlID0gcmVxdWlyZSBcInR5cGVzL2ltYWdlL21vZGFsLnRtcGwuanNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcblxuICBpbml0aWFsOiAtPlxuICAgIEBtb2RhbENvbnRhaW4gPSBSZW5kZXIgbW9kYWxXaW5kb3dUZW1wbGF0ZSwgQGNvbnRhaW5bMF1cblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXN0b3JhZ2VcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVTdG9yYWdlICgkIGUudGFyZ2V0KS5kYXRhIFwidmFsdWVcIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1wYXRoXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUGF0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1zMy1hY2Nlc3Mta2V5XCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUzNBY2Nlc3NLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2UtczMtc2VjcmV0LWtleVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVMzU2VjcmV0S2V5IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXMzLWJ1Y2tldFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVMzQnVja2V0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXMzLXBhdGhcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVTM1BhdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2Utd2lkdGhcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVXaWR0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1oZWlnaHRcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVIZWlnaHQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2Utc291cmNlXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlU291cmNlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQGRlc3Ryb3koKVxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEBkZXN0cm95KClcblxuICByZW5kZXI6IChzdGF0ZSkgLT5cbiAgICBAbW9kYWxDb250YWluIHN0YXRlXG4gICAgKCQgXCJAdGFic1wiKS50YWJzKClcblxuICBzdWJtaXRDb25maWdzRm9ybTogKGUpIC0+XG4gICAgQHRyaWdnZXIgXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgQG1vZGVsLmdldFN0YXRlKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG5cbiAgdXBkYXRlTnVtT3B0aW9uczogKHZhbHVlKSAtPlxuICAgIHZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG4gICAgbnVtT3B0cyA9IHBhcnNlSW50IEBzdGF0ZS5udW1PcHRpb25zLCAxMFxuICAgIGRlZmF1bHRWYWx1ZSA9IHBhcnNlSW50IEBzdGF0ZS5kZWZhdWx0VmFsdWUsIDEwXG4gICAgZGVmYXVsdERhdGEgPSBAc3RhdGUuZGVmYXVsdERhdGEuc2xpY2UoKVxuICAgIGlmIHZhbHVlID4gbnVtT3B0c1xuICAgICAgZm9yIGkgaW4gW251bU9wdHMgKyAxLi52YWx1ZV1cbiAgICAgICAgZGVmYXVsdERhdGEucHVzaCBcIlwiXG4gICAgZWxzZVxuICAgICAgZm9yIGkgaW4gW3ZhbHVlICsgMS4ubnVtT3B0c11cbiAgICAgICAgZGVmYXVsdERhdGEucG9wKClcbiAgICAgIGlmIGRlZmF1bHRWYWx1ZSA+PSB2YWx1ZVxuICAgICAgICBAc2V0IHtkZWZhdWx0VmFsdWV9XG4gICAgQHNldCBudW1PcHRpb25zOiB2YWx1ZVxuICAgIEBzZXQge2RlZmF1bHREYXRhfVxuXG4gIHVwZGF0ZURlZmF1bHRWYWx1ZTogKHZhbHVlKSAtPiBAc2V0IGRlZmF1bHRWYWx1ZTogcGFyc2VJbnQgdmFsdWUsIDEwXG5cbiAgdXBkYXRlRGVmYXVsdERhdGFPcHRpb246IChpbmRleCwgdmFsdWUpIC0+XG4gICAgZGF0YSA9IEBzdGF0ZS5kZWZhdWx0RGF0YS5zbGljZSgpXG4gICAgZGF0YVtpbmRleF0gPSB2YWx1ZVxuICAgIEBzZXQgZGVmYXVsdERhdGE6IGRhdGFcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlclwiXG5tb2RhbFdpbmRvd1RlbXBsYXRlID0gcmVxdWlyZSBcInR5cGVzL3JhZGlvL21vZGFsLnRtcGwuanNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgaW5pdGlhbDogLT5cbiAgICBAb3B0aW9uc0NvbnRhaW4gPSBSZW5kZXIgbW9kYWxXaW5kb3dUZW1wbGF0ZSwgQGNvbnRhaW5bMF1cblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLXJhZGlvLW51bS1vcHRpb25zXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlTnVtT3B0aW9ucyBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1yYWRpby1vcHRpb25cIjogKGUpIC0+IEBtb2RlbC51cGRhdGVEZWZhdWx0VmFsdWUgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtcmFkaW8tb3B0aW9uLWxhYmVsXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlRGVmYXVsdERhdGFPcHRpb24gKEBnZXRJbmRleEJ5RXZlbnQgZSksIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQGRlc3Ryb3koKVxuXG4gIGdldEluZGV4QnlFdmVudDogKGUpIC0+XG4gICAgJGl0ZW0gPSAkIGUudGFyZ2V0XG4gICAgJGl0ZW0uZGF0YSBcImluZGV4XCJcblxuICByZW5kZXI6IChzdGF0ZSkgLT5cbiAgICBAb3B0aW9uc0NvbnRhaW4gc3RhdGVcblxuICBzdWJtaXRDb25maWdzRm9ybTogKGUpIC0+XG4gICAgQHRyaWdnZXIgXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgQG1vZGVsLmdldFN0YXRlKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuXG4gIHVwZGF0ZUNvbHVtbnM6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSA9IHBhcnNlSW50IHZhbHVlLCAxMFxuICAgIGlmIHZhbHVlID4gQHN0YXRlLmNvbHVtbnNcbiAgICAgIGZvciByb3cgaW4gQHN0YXRlLmRlZmF1bHREYXRhXG4gICAgICAgIGZvciBpIGluIFtAc3RhdGUuY29sdW1ucyArIDEuLnZhbHVlXVxuICAgICAgICAgIHJvdy5wdXNoIFwiXCJcbiAgICBlbHNlIGlmIHZhbHVlIDwgQHN0YXRlLmNvbHVtbnNcbiAgICAgIGZvciByb3cgaW4gQHN0YXRlLmRlZmF1bHREYXRhXG4gICAgICAgIGZvciBpIGluIFt2YWx1ZSArIDEuLkBzdGF0ZS5jb2x1bW5zXVxuICAgICAgICAgIHJvdy5wb3AoKVxuICAgIEBzZXQgY29sdW1uczogdmFsdWVcblxuICB1cGRhdGVSb3dzOiAodmFsdWUpIC0+XG4gICAgdmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcbiAgICBpZiB2YWx1ZSA+IEBzdGF0ZS5yb3dzXG4gICAgICBmb3Igcm93IGluIFtAc3RhdGUucm93cyArIDEuLnZhbHVlXVxuICAgICAgICByb3cgPSBbXVxuICAgICAgICBmb3IgaSBpbiBbMS4uQHN0YXRlLmNvbHVtbnNdXG4gICAgICAgICAgcm93LnB1c2ggXCJcIlxuICAgICAgICBAc3RhdGUuZGVmYXVsdERhdGEucHVzaCByb3dcbiAgICBlbHNlIGlmIHZhbHVlIDwgQHN0YXRlLnJvd3NcbiAgICAgIGZvciByb3cgaW4gW3ZhbHVlICsgMS4uQHN0YXRlLnJvd3NdXG4gICAgICAgIEBzdGF0ZS5kZWZhdWx0RGF0YS5wb3AoKVxuICAgIEBzZXQgcm93czogdmFsdWVcblxuICB1cGRhdGVDZWxsRGF0YTogKHJvdywgY29sdW1uLCB2YWx1ZSkgLT5cbiAgICBkYXRhID0gQHN0YXRlLmRlZmF1bHREYXRhLnNsaWNlKClcbiAgICBkYXRhW3Jvd11bY29sdW1uXSA9IHZhbHVlXG4gICAgQHNldCBkZWZhdWx0RGF0YTogZGF0YVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcbm1vZGFsV2luZG93VGVtcGxhdGUgPSByZXF1aXJlIFwidHlwZXMvdGFibGUvbW9kYWwudG1wbC5qc1wiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBpbml0aWFsOiAtPlxuICAgIEBtb2RhbENvbnRhaW4gPSBSZW5kZXIgbW9kYWxXaW5kb3dUZW1wbGF0ZSwgQGNvbnRhaW5bMF1cblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLXRhYmxlLXJvd3NcIjogXCJjaGFuZ2VDb25maWdzVGFibGVSb3dzXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtdGFibGUtY29sdW1uc1wiOiBcImNoYW5nZUNvbmZpZ3NUYWJsZUNvbHVtbnNcIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy10YWJsZS1jZWxsXCI6IChlKSAtPlxuICAgICAgJGNlbGwgPSAkIGUudGFyZ2V0XG4gICAgICBAbW9kZWwudXBkYXRlQ2VsbERhdGEgKCRjZWxsLmRhdGEgXCJyb3dcIiksICgkY2VsbC5kYXRhIFwiY29sdW1uXCIpLCAoJGNlbGwudmFsKCkpXG5cbiAgICBcImtleWRvd246IEBjb25maWdzLXRhYmxlLXJvd3NcIjogKGUpIC0+XG4gICAgICBAY2hhbmdlQ29uZmlnc1RhYmxlUm93cyBlXG4gICAgICBpZiBlLmtleUNvZGUgPT0gMTMgdGhlbiBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIFwia2V5ZG93bjogQGNvbmZpZ3MtdGFibGUtY29sdW1uc1wiOiAoZSkgLT5cbiAgICAgIEBjaGFuZ2VDb25maWdzVGFibGVDb2x1bW5zIGVcbiAgICAgIGlmIGUua2V5Q29kZSA9PSAxMyB0aGVuIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQGRlc3Ryb3koKVxuXG4gIGNoYW5nZUNvbmZpZ3NUYWJsZVJvd3M6IChlKSAtPiBAbW9kZWwudXBkYXRlUm93cyBlLnRhcmdldC52YWx1ZVxuICBjaGFuZ2VDb25maWdzVGFibGVDb2x1bW5zOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZUNvbHVtbnMgZS50YXJnZXQudmFsdWVcblxuICByZW5kZXI6IChzdGF0ZSkgLT5cbiAgICBAbW9kYWxDb250YWluIHN0YXRlXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIEBtb2RlbC5nZXRTdGF0ZSgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG57XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgfVxuICBlbHNlIHtcbiAgICB3aW5kb3cudGFibGVNb2R1bGVGaWVsZHMgPSBmYWN0b3J5KCk7XG4gIH1cbn0pKGZ1bmN0aW9uICgpXG57XG4gIHZhciBfaGFzUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciBfY3JFbCA9IGZ1bmN0aW9uIChub2RlKVxuICB7XG4gICAgcmV0dXJuIHt0eXBlOiAnbm9kZScsIG5hbWU6IG5vZGUsIGF0dHJzOiBbXSwgY2hpbGRzOiBbXX07XG4gIH07XG4gIHZhciBfY3JUTiA9IGZ1bmN0aW9uIChub2RlKVxuICB7XG4gICAgcmV0dXJuIHt0eXBlOiAndGV4dCcsIHRleHQ6IG5vZGV9O1xuICB9O1xuICBmdW5jdGlvbiBjcmVhdGUoKVxuICB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciByb290Tm9kZXMgPSBbXTtcbiAgICAgIGFyZ3VtZW50c1swXShyb290Tm9kZXMpO1xuICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gcm9vdE5vZGVzKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwocm9vdE5vZGVzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgIHJvb3ROb2Rlc1tpbmRleEF0dHJdID0gX2NyVE4ocm9vdE5vZGVzW2luZGV4QXR0cl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICB9XG4gICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICB2YXIgcGFyZW50Tm9kZTtcbiAgICAgIHZhciBpbmRleE5vZGU7XG4gICAgICB2YXIgbm9kZTtcbiAgICAgIHZhciBpbmRleEF0dHI7XG4gICAgICB2YXIgYXR0cjtcbiAgICAgIHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGFyZ3VtZW50c1syXShub2Rlcyk7XG4gICAgICBwYXJlbnROb2RlID0gX2NyRWwoYXJndW1lbnRzWzBdKTtcbiAgICAgIGlmIChhdHRycy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gYXR0cnMpIHtcbiAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChhdHRycywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2luZGV4QXR0cl07XG4gICAgICAgICAgICBwYXJlbnROb2RlLmF0dHJzLnB1c2goe1xuICAgICAgICAgICAgICBuYW1lOiBhdHRyWzBdLFxuICAgICAgICAgICAgICB2YWx1ZTogYXR0clsxXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGluZGV4Tm9kZSBpbiBub2Rlcykge1xuICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChub2RlcywgaW5kZXhOb2RlKSkge1xuICAgICAgICAgIG5vZGUgPSBub2Rlc1tpbmRleE5vZGVdO1xuICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIG5vZGUgPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2goX2NyVE4obm9kZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2gobm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyZW50Tm9kZTtcbiAgICB9XG4gIH1cbiAgdmFyIGNhY2hlZFRlbXBsYXRlcyA9IHt9O1xuICBmdW5jdGlvbiBjYWNoZVJlcXVpcmVUZW1wbGF0ZShwYXRoLCByZXF1aXJlZClcbiAge1xuICAgIGNhY2hlZFRlbXBsYXRlc1twYXRoXSA9IHJlcXVpcmVkO1xuICB9XG4gIGZ1bmN0aW9uIHJlcXVpcmVUZW1wbGF0ZShwYXRoLCBvYmopXG4gIHtcbiAgICByZXR1cm4gY2FjaGVkVGVtcGxhdGVzW3BhdGhdKG9iaik7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChvYmopXG4gIHtcbiAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAge1xuICAgICAgd2l0aCAob2JqKSB7XG4gICAgICAgIHZhciBhcnIxID0gZmllbGRzO1xuICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhcnIxKSBpZiAoX2hhc1Byb3AuY2FsbChhcnIxLCBpbmRleCkpIHtcbiAgICAgICAgICBmaWVsZCA9IGFycjFbaW5kZXhdO1xuICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm0tdGFibGVfX3Jvdyc7XG4gICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICBhdHRyICs9IGluZGV4O1xuICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnZGF0YS1rZXknLCBhdHRyXSk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0cicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtLXRhYmxlX19jZWxsJztcbiAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2lucCc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBmaWVsZFsndGl0bGUnXTtcbiAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmaWVsZC10aXRsZSc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm0tdGFibGVfX2NlbGwnO1xuICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wJztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IGZpZWxkWydhbGlhcyddO1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2ZpZWxkLWFsaWFzJztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybS10YWJsZV9fY2VsbCc7XG4gICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnc2VsZWN0JztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX3NlbGVjdCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmaWVsZC10eXBlJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdzZWxlY3QnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuaGFzU2V0dGluZ3MgPSBmYWxzZTsgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcnIyID0gdHlwZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHR5cGUgaW4gYXJyMikgaWYgKF9oYXNQcm9wLmNhbGwoYXJyMiwgdHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gYXJyMlt0eXBlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IHR5cGVbJ3R5cGUnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggZmllbGRbJ3R5cGUnXSA9PSB0eXBlWyd0eXBlJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydzZWxlY3RlZCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnb3B0aW9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2godHlwZVsnbmFtZSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggZmllbGRbJ3R5cGUnXSA9PSB0eXBlWyd0eXBlJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdHlwZVsnaGFzU2V0dGluZ3MnXSkge1xuaGFzU2V0dGluZ3MgPSB0cnVlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm0tdGFibGVfX2NlbGwnO1xuICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoIGhhc1NldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19idG4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdidXR0b24nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2J0bi1jb25maWctZmllbGQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0J0nKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybS10YWJsZV9fY2VsbCc7XG4gICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgIGlmICggY291bnQoZmllbGRzKSA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2J0bic7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2J1dHRvbic7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnYnRuLXJlbW92ZS1maWVsZCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCdYJyk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9KSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG57XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgfVxuICBlbHNlIHtcbiAgICB3aW5kb3cubW9kYWwgPSBmYWN0b3J5KCk7XG4gIH1cbn0pKGZ1bmN0aW9uICgpXG57XG4gIHZhciBfaGFzUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciBfY3JFbCA9IGZ1bmN0aW9uIChub2RlKVxuICB7XG4gICAgcmV0dXJuIHt0eXBlOiAnbm9kZScsIG5hbWU6IG5vZGUsIGF0dHJzOiBbXSwgY2hpbGRzOiBbXX07XG4gIH07XG4gIHZhciBfY3JUTiA9IGZ1bmN0aW9uIChub2RlKVxuICB7XG4gICAgcmV0dXJuIHt0eXBlOiAndGV4dCcsIHRleHQ6IG5vZGV9O1xuICB9O1xuICBmdW5jdGlvbiBjcmVhdGUoKVxuICB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciByb290Tm9kZXMgPSBbXTtcbiAgICAgIGFyZ3VtZW50c1swXShyb290Tm9kZXMpO1xuICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gcm9vdE5vZGVzKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwocm9vdE5vZGVzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgIHJvb3ROb2Rlc1tpbmRleEF0dHJdID0gX2NyVE4ocm9vdE5vZGVzW2luZGV4QXR0cl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICB9XG4gICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICB2YXIgcGFyZW50Tm9kZTtcbiAgICAgIHZhciBpbmRleE5vZGU7XG4gICAgICB2YXIgbm9kZTtcbiAgICAgIHZhciBpbmRleEF0dHI7XG4gICAgICB2YXIgYXR0cjtcbiAgICAgIHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGFyZ3VtZW50c1syXShub2Rlcyk7XG4gICAgICBwYXJlbnROb2RlID0gX2NyRWwoYXJndW1lbnRzWzBdKTtcbiAgICAgIGlmIChhdHRycy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gYXR0cnMpIHtcbiAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChhdHRycywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2luZGV4QXR0cl07XG4gICAgICAgICAgICBwYXJlbnROb2RlLmF0dHJzLnB1c2goe1xuICAgICAgICAgICAgICBuYW1lOiBhdHRyWzBdLFxuICAgICAgICAgICAgICB2YWx1ZTogYXR0clsxXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGluZGV4Tm9kZSBpbiBub2Rlcykge1xuICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChub2RlcywgaW5kZXhOb2RlKSkge1xuICAgICAgICAgIG5vZGUgPSBub2Rlc1tpbmRleE5vZGVdO1xuICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIG5vZGUgPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2goX2NyVE4obm9kZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2gobm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyZW50Tm9kZTtcbiAgICB9XG4gIH1cbiAgdmFyIGNhY2hlZFRlbXBsYXRlcyA9IHt9O1xuICBmdW5jdGlvbiBjYWNoZVJlcXVpcmVUZW1wbGF0ZShwYXRoLCByZXF1aXJlZClcbiAge1xuICAgIGNhY2hlZFRlbXBsYXRlc1twYXRoXSA9IHJlcXVpcmVkO1xuICB9XG4gIGZ1bmN0aW9uIHJlcXVpcmVUZW1wbGF0ZShwYXRoLCBvYmopXG4gIHtcbiAgICByZXR1cm4gY2FjaGVkVGVtcGxhdGVzW3BhdGhdKG9iaik7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChvYmopXG4gIHtcbiAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAge1xuICAgICAgd2l0aCAob2JqKSB7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICBhdHRyICs9ICdwb3B1cF9faGVhZCc7XG4gICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICBjaGlsZHMucHVzaCgn0J3QsNGB0YLRgNC+0LnQutC4INGE0LvQsNC20LrQvtCyJyk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KSgpO1xuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgYXR0cnMucHVzaChbJ2FjdGlvbicsIGF0dHJdKTtcbiAgICAgICAgICB9KSgpO1xuICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgYXR0ciArPSAnZm9ybSc7XG4gICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtZm9ybSc7XG4gICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICB9KSgpO1xuICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZm9ybScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtY2hlY2tib3gtbnVtLW9wdGlvbnMnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0JrQvtC70LjRh9C10YHRgtCy0L4g0LLQsNGA0LjQsNC90YLQvtCyINC+0YLQstC10YLQsCcpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gbnVtT3B0aW9ucztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1jaGVja2JveC1udW0tb3B0aW9ucyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1jaGVja2JveC1udW0tb3B0aW9ucyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faXRlbSc7XG4gICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCfQktCw0YDQuNCw0L3RgtGLINC+0YLQstC10YLQvtCyOicpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4gZm9ybV9faW5wLWNvbnRhaW4tLWZ1bGwtd2lkdGgnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1jaGVja2JveC1vcHRpb25zLWNvbnRhaW4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJyMCA9IGRlZmF1bHREYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnIwKSBpZiAoX2hhc1Byb3AuY2FsbChhcnIwLCBpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb24gPSBhcnIwW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fcm93LW9wdGlvbic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NoZWNrYm94JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2NoZWNrYm94JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWNoZWNrYm94LW9wdGlvbic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydkYXRhLWluZGV4JywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1jaGVja2JveC1vcHRpb24tJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1jaGVja2JveC1vcHRpb24nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyduYW1lJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIG9wdGlvblsnY2hlY2tlZCddID09IHRydWUgfHwgb3B0aW9uWydjaGVja2VkJ10gPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjaGVja2VkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtY2hlY2tib3gtb3B0aW9uLSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19jaGVja2JveC1sYWJlbCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0taGFsZi13aWR0aCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IG9wdGlvblsnbGFiZWwnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtY2hlY2tib3gtb3B0aW9uLWxhYmVsJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnZGF0YS1pbmRleCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fc3VibWl0JztcbiAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19idG4gZm9ybV9fYnRuLS1zdWJtaXQnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0KHQvtGF0YDQsNC90LjRgtGMJyk7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdidXR0b24nO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19idG4gcG9wdXBfX2NhbmNlbCc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCfQntGC0LzQtdC90LjRgtGMJyk7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG4gICAge1xuICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cubW9kYWwgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgfSkoZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICAgICAgdmFyIF9jckVsID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICAgICAgfTtcbiAgICAgIHZhciBfY3JUTiA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICd0ZXh0JywgdGV4dDogbm9kZX07XG4gICAgICB9O1xuICAgICAgZnVuY3Rpb24gY3JlYXRlKClcbiAgICAgIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICB2YXIgcm9vdE5vZGVzID0gW107XG4gICAgICAgICAgYXJndW1lbnRzWzBdKHJvb3ROb2Rlcyk7XG4gICAgICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIHJvb3ROb2Rlcykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChyb290Tm9kZXMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICByb290Tm9kZXNbaW5kZXhBdHRyXSA9IF9jclROKHJvb3ROb2Rlc1tpbmRleEF0dHJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgICAgdmFyIHBhcmVudE5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4Tm9kZTtcbiAgICAgICAgICB2YXIgbm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhBdHRyO1xuICAgICAgICAgIHZhciBhdHRyO1xuICAgICAgICAgIHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICBhcmd1bWVudHNbMl0obm9kZXMpO1xuICAgICAgICAgIHBhcmVudE5vZGUgPSBfY3JFbChhcmd1bWVudHNbMF0pO1xuICAgICAgICAgIGlmIChhdHRycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKGF0dHJzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2luZGV4QXR0cl07XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5hdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IGF0dHJbMF0sXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogYXR0clsxXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAoaW5kZXhOb2RlIGluIG5vZGVzKSB7XG4gICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChub2RlcywgaW5kZXhOb2RlKSkge1xuICAgICAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhOb2RlXTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2goX2NyVE4obm9kZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqKVxuICAgICAge1xuICAgICAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAgICAgIHt3aXRoIChvYmopIHsoZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3BvcHVwX19oZWFkJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J3QsNGB0YLRgNC+0LnQutC4INGE0LDQudC70LAnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHJzLnB1c2goWydhY3Rpb24nLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZm9ybSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2Zvcm0nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQpdGA0LDQvdC40LvQuNGJ0LUnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnMnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYnV0dG9uJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFic19faXRlbSc7XG5pZiAoIHN0b3JhZ2UgPT0gXCJsb2NhbFwiKSB7XG5hdHRyICs9ICcgdGFic19faXRlbS0tYWN0aXZlJztcbn1cbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnMgY29uZmlncy1maWxlLXN0b3JhZ2UnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtbW9kYWwtc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsnZGF0YS1ncm91cCcsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2xvY2FsJztcbmF0dHJzLnB1c2goWydkYXRhLXZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLW1vZGFsLXN0b3JhZ2UtbG9jYWwnO1xuYXR0cnMucHVzaChbJ2RhdGEtZnJhbWUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cb0L7QutCw0LvRjNC90L7QtScpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYnV0dG9uJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFic19faXRlbSc7XG5pZiAoIHN0b3JhZ2UgPT0gXCJzM1wiKSB7XG5hdHRyICs9ICcgdGFic19faXRlbS0tYWN0aXZlJztcbn1cbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnMgY29uZmlncy1maWxlLXN0b3JhZ2UnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtbW9kYWwtc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsnZGF0YS1ncm91cCcsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3MzJztcbmF0dHJzLnB1c2goWydkYXRhLXZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLW1vZGFsLXN0b3JhZ2UtczMnO1xuYXR0cnMucHVzaChbJ2RhdGEtZnJhbWUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ1MzJyk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtbW9kYWwtc3RvcmFnZS1sb2NhbCBjb25maWdzLWZpbGUtbW9kYWwtc3RvcmFnZS1mcmFtZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5pZiAoIHN0b3JhZ2UgIT0gXCJsb2NhbFwiKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Rpc3BsYXk6IG5vbmUnO1xuYXR0cnMucHVzaChbJ3N0eWxlJywgYXR0cl0pO1xufSkoKTtcbn1cbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtcGF0aCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cf0YPRgtGMJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gcGF0aDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1wYXRoJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXBhdGgnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLW1vZGFsLXN0b3JhZ2UtczMgY29uZmlncy1maWxlLW1vZGFsLXN0b3JhZ2UtZnJhbWUnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuaWYgKCBzdG9yYWdlICE9IFwiczNcIikge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdkaXNwbGF5OiBub25lJztcbmF0dHJzLnB1c2goWydzdHlsZScsIGF0dHJdKTtcbn0pKCk7XG59XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXMzLWFjY2Vzcy1rZXknO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCdBY2Nlc3Mga2V5Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gczNBY2Nlc3NLZXk7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtYWNjZXNzLWtleSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1hY2Nlc3Mta2V5JztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtc2VjcmV0LWtleSc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ1NlY3JldCBrZXknKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3Bhc3N3b3JkJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1zZWNyZXQta2V5JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXMzLXNlY3JldC1rZXknO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1idWNrZXQnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCdCdWNrZXQnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBzM0J1Y2tldDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1idWNrZXQnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtYnVja2V0JztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtcGF0aCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cf0YPRgtGMJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gczNQYXRoO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXMzLXBhdGgnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtcGF0aCc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19zdWJtaXQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYnRuIGZvcm1fX2J0bi0tc3VibWl0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0KHQvtGF0YDQsNC90LjRgtGMJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdidXR0b24nO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19idG4gcG9wdXBfX2NhbmNlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Ce0YLQvNC10L3QuNGC0YwnKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn19KX07XG4gICAgfSk7IiwiKGZ1bmN0aW9uIChmYWN0b3J5KVxuICAgIHtcbiAgICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGRlZmluZSgnZmlyc3QtdHJ5JywgW10sIGZhY3RvcnkoKSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgd2luZG93Lm1vZGFsID0gZmFjdG9yeSgpO1xuICAgICAgfVxuICAgIH0pKGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgdmFyIF9oYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgICAgIHZhciBfY3JFbCA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICdub2RlJywgbmFtZTogbm9kZSwgYXR0cnM6IFtdLCBjaGlsZHM6IFtdfTtcbiAgICAgIH07XG4gICAgICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHt0eXBlOiAndGV4dCcsIHRleHQ6IG5vZGV9O1xuICAgICAgfTtcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZSgpXG4gICAgICB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgdmFyIHJvb3ROb2RlcyA9IFtdO1xuICAgICAgICAgIGFyZ3VtZW50c1swXShyb290Tm9kZXMpO1xuICAgICAgICAgIGlmIChyb290Tm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiByb290Tm9kZXMpIHtcbiAgICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwocm9vdE5vZGVzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgcm9vdE5vZGVzW2luZGV4QXR0cl0gPSBfY3JUTihyb290Tm9kZXNbaW5kZXhBdHRyXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByb290Tm9kZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICAgIHZhciBwYXJlbnROb2RlO1xuICAgICAgICAgIHZhciBpbmRleE5vZGU7XG4gICAgICAgICAgdmFyIG5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4QXR0cjtcbiAgICAgICAgICB2YXIgYXR0cjtcbiAgICAgICAgICB2YXIgYXR0cnMgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgYXJndW1lbnRzWzJdKG5vZGVzKTtcbiAgICAgICAgICBwYXJlbnROb2RlID0gX2NyRWwoYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICBpZiAoYXR0cnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiBhdHRycykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChhdHRycywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgICAgIGF0dHIgPSBhdHRyc1tpbmRleEF0dHJdO1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBhdHRyWzBdLFxuICAgICAgICAgICAgICAgICAgdmFsdWU6IGF0dHJbMV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGluZGV4Tm9kZSBpbiBub2Rlcykge1xuICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwobm9kZXMsIGluZGV4Tm9kZSkpIHtcbiAgICAgICAgICAgICAgbm9kZSA9IG5vZGVzW2luZGV4Tm9kZV07XG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIG5vZGUgPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKF9jclROKG5vZGUpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBwYXJlbnROb2RlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKG9iailcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZShmdW5jdGlvbiAoY2hpbGRzKVxuICAgICAgICB7d2l0aCAob2JqKSB7KGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdwb3B1cF9faGVhZCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cd0LDRgdGC0YDQvtC50LrQuCDQs9Cw0LvQtdGA0LXQuCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ2FjdGlvbicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1mb3JtJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZm9ybScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cl0YDQsNC90LjQu9C40YnQtScpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFicyc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdidXR0b24nO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzX19pdGVtJztcbmlmICggc3RvcmFnZSA9PSBcImxvY2FsXCIpIHtcbmF0dHIgKz0gJyB0YWJzX19pdGVtLS1hY3RpdmUnO1xufVxuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFicyBjb25maWdzLWdhbGxlcnktc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1tb2RhbC1zdG9yYWdlJztcbmF0dHJzLnB1c2goWydkYXRhLWdyb3VwJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnbG9jYWwnO1xuYXR0cnMucHVzaChbJ2RhdGEtdmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktbW9kYWwtc3RvcmFnZS1sb2NhbCc7XG5hdHRycy5wdXNoKFsnZGF0YS1mcmFtZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0JvQvtC60LDQu9GM0L3QvtC1Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdidXR0b24nO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzX19pdGVtJztcbmlmICggc3RvcmFnZSA9PSBcInMzXCIpIHtcbmF0dHIgKz0gJyB0YWJzX19pdGVtLS1hY3RpdmUnO1xufVxuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFicyBjb25maWdzLWdhbGxlcnktc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1tb2RhbC1zdG9yYWdlJztcbmF0dHJzLnB1c2goWydkYXRhLWdyb3VwJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnczMnO1xuYXR0cnMucHVzaChbJ2RhdGEtdmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktbW9kYWwtc3RvcmFnZS1zMyc7XG5hdHRycy5wdXNoKFsnZGF0YS1mcmFtZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnUzMnKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1tb2RhbC1zdG9yYWdlLWxvY2FsIGNvbmZpZ3MtZ2FsbGVyeS1tb2RhbC1zdG9yYWdlLWZyYW1lJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmlmICggc3RvcmFnZSAhPSBcImxvY2FsXCIpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZGlzcGxheTogbm9uZSc7XG5hdHRycy5wdXNoKFsnc3R5bGUnLCBhdHRyXSk7XG59KSgpO1xufVxuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1wYXRoJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J/Rg9GC0YwnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBwYXRoO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXBhdGgnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktcGF0aCc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktbW9kYWwtc3RvcmFnZS1zMyBjb25maWdzLWdhbGxlcnktbW9kYWwtc3RvcmFnZS1mcmFtZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5pZiAoIHN0b3JhZ2UgIT0gXCJzM1wiKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Rpc3BsYXk6IG5vbmUnO1xuYXR0cnMucHVzaChbJ3N0eWxlJywgYXR0cl0pO1xufSkoKTtcbn1cbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktczMtYWNjZXNzLWtleSc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ0FjY2VzcyBrZXknKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBzM0FjY2Vzc0tleTtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1hY2Nlc3Mta2V5JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXMzLWFjY2Vzcy1rZXknO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1zZWNyZXQta2V5JztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnU2VjcmV0IGtleScpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAncGFzc3dvcmQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXMzLXNlY3JldC1rZXknO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktczMtc2VjcmV0LWtleSc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXMzLWJ1Y2tldCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ0J1Y2tldCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHMzQnVja2V0O1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXMzLWJ1Y2tldCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1idWNrZXQnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1wYXRoJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J/Rg9GC0YwnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBzM1BhdGg7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktczMtcGF0aCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1wYXRoJztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXdpZHRoJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0KPQvNC10L3RjNGI0LjRgtGMINC+0YDQuNCz0LjQvdCw0Lsg0LTQviDRgNCw0LfQvNC10YDQsCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4gZm9ybV9faW5wLWNvbnRhaW4tLWZ1bGwtd2lkdGgnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSB3aWR0aDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS13aWR0aCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS13aWR0aCc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19iZXR3ZWVuLWlucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdzcGFuJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfDlycpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBoZWlnaHQ7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktaGVpZ2h0JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faGludCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9CV0YHQu9C4INC90LUg0LfQsNC00LDRgtGMINC30L3QsNGH0LXQvdC40LUsINC+0L3QviDQsdGD0LTQtdGCINCy0YvRh9C40YHQu9C10L3QviDQv9GA0L7Qv9C+0YDRhtC40L7QvdCw0LvRjNC90L4nKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktd2lkdGgnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQoNCw0LfQvNC10YAg0L/RgNC10LLRjNGOJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbiBmb3JtX19pbnAtY29udGFpbi0tZnVsbC13aWR0aCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHByZXZpZXdXaWR0aDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1wcmV2aWV3LXdpZHRoJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXdpZHRoJztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2JldHdlZW4taW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ3NwYW4nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ8OXJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHByZXZpZXdIZWlnaHQ7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktcHJldmlldy1oZWlnaHQnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19oaW50JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0JXRgdC70Lgg0L3QtSDQt9Cw0LTQsNGC0Ywg0LfQvdCw0YfQtdC90LjQtSwg0L7QvdC+INCx0YPQtNC10YIg0LLRi9GH0LjRgdC70LXQvdC+INC/0YDQvtC/0L7RgNGG0LjQvtC90LDQu9GM0L3QvicpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19zdWJtaXQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYnRuIGZvcm1fX2J0bi0tc3VibWl0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0KHQvtGF0YDQsNC90LjRgtGMJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdidXR0b24nO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19idG4gcG9wdXBfX2NhbmNlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Ce0YLQvNC10L3QuNGC0YwnKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn19KX07XG4gICAgfSk7IiwiKGZ1bmN0aW9uIChmYWN0b3J5KVxuICAgIHtcbiAgICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGRlZmluZSgnZmlyc3QtdHJ5JywgW10sIGZhY3RvcnkoKSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgd2luZG93Lm1vZGFsID0gZmFjdG9yeSgpO1xuICAgICAgfVxuICAgIH0pKGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgdmFyIF9oYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgICAgIHZhciBfY3JFbCA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICdub2RlJywgbmFtZTogbm9kZSwgYXR0cnM6IFtdLCBjaGlsZHM6IFtdfTtcbiAgICAgIH07XG4gICAgICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHt0eXBlOiAndGV4dCcsIHRleHQ6IG5vZGV9O1xuICAgICAgfTtcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZSgpXG4gICAgICB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgdmFyIHJvb3ROb2RlcyA9IFtdO1xuICAgICAgICAgIGFyZ3VtZW50c1swXShyb290Tm9kZXMpO1xuICAgICAgICAgIGlmIChyb290Tm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiByb290Tm9kZXMpIHtcbiAgICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwocm9vdE5vZGVzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgcm9vdE5vZGVzW2luZGV4QXR0cl0gPSBfY3JUTihyb290Tm9kZXNbaW5kZXhBdHRyXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByb290Tm9kZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICAgIHZhciBwYXJlbnROb2RlO1xuICAgICAgICAgIHZhciBpbmRleE5vZGU7XG4gICAgICAgICAgdmFyIG5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4QXR0cjtcbiAgICAgICAgICB2YXIgYXR0cjtcbiAgICAgICAgICB2YXIgYXR0cnMgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgYXJndW1lbnRzWzJdKG5vZGVzKTtcbiAgICAgICAgICBwYXJlbnROb2RlID0gX2NyRWwoYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICBpZiAoYXR0cnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiBhdHRycykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChhdHRycywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgICAgIGF0dHIgPSBhdHRyc1tpbmRleEF0dHJdO1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBhdHRyWzBdLFxuICAgICAgICAgICAgICAgICAgdmFsdWU6IGF0dHJbMV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGluZGV4Tm9kZSBpbiBub2Rlcykge1xuICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwobm9kZXMsIGluZGV4Tm9kZSkpIHtcbiAgICAgICAgICAgICAgbm9kZSA9IG5vZGVzW2luZGV4Tm9kZV07XG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIG5vZGUgPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKF9jclROKG5vZGUpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBwYXJlbnROb2RlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKG9iailcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZShmdW5jdGlvbiAoY2hpbGRzKVxuICAgICAgICB7d2l0aCAob2JqKSB7KGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdwb3B1cF9faGVhZCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cd0LDRgdGC0YDQvtC50LrQuCDQuNC30L7QsdGA0LDQttC10L3QuNGPJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRycy5wdXNoKFsnYWN0aW9uJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZvcm0nO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdmb3JtJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0KXRgNCw0L3QuNC70LjRidC1Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnNfX2l0ZW0nO1xuaWYgKCBzdG9yYWdlID09IFwibG9jYWxcIikge1xuYXR0ciArPSAnIHRhYnNfX2l0ZW0tLWFjdGl2ZSc7XG59XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzIGNvbmZpZ3MtaW1hZ2Utc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtbW9kYWwtc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsnZGF0YS1ncm91cCcsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2xvY2FsJztcbmF0dHJzLnB1c2goWydkYXRhLXZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLWxvY2FsJztcbmF0dHJzLnB1c2goWydkYXRhLWZyYW1lJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQm9C+0LrQsNC70YzQvdC+0LUnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnNfX2l0ZW0nO1xuaWYgKCBzdG9yYWdlID09IFwiczNcIikge1xuYXR0ciArPSAnIHRhYnNfX2l0ZW0tLWFjdGl2ZSc7XG59XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzIGNvbmZpZ3MtaW1hZ2Utc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtbW9kYWwtc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsnZGF0YS1ncm91cCcsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3MzJztcbmF0dHJzLnB1c2goWydkYXRhLXZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLXMzJztcbmF0dHJzLnB1c2goWydkYXRhLWZyYW1lJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCdTMycpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLWxvY2FsIGNvbmZpZ3MtaW1hZ2UtbW9kYWwtc3RvcmFnZS1mcmFtZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5pZiAoIHN0b3JhZ2UgIT0gXCJsb2NhbFwiKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Rpc3BsYXk6IG5vbmUnO1xuYXR0cnMucHVzaChbJ3N0eWxlJywgYXR0cl0pO1xufSkoKTtcbn1cbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXBhdGgnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQn9GD0YLRjCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHBhdGg7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXBhdGgnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXBhdGgnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLXMzIGNvbmZpZ3MtaW1hZ2UtbW9kYWwtc3RvcmFnZS1mcmFtZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5pZiAoIHN0b3JhZ2UgIT0gXCJzM1wiKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Rpc3BsYXk6IG5vbmUnO1xuYXR0cnMucHVzaChbJ3N0eWxlJywgYXR0cl0pO1xufSkoKTtcbn1cbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXMzLWFjY2Vzcy1rZXknO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCdBY2Nlc3Mga2V5Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gIHR5cGVvZiBzM0FjY2Vzc0tleSAhPT0gJ3VuZGVmaW5lZCcgPyBzM0FjY2Vzc0tleSA6ICcnIDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYWNjZXNzLWtleSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYWNjZXNzLWtleSc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1zMy1zZWNyZXQta2V5JztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnU2VjcmV0IGtleScpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAncGFzc3dvcmQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1zMy1zZWNyZXQta2V5JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1zMy1zZWNyZXQta2V5JztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXMzLWJ1Y2tldCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ0J1Y2tldCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICB0eXBlb2YgczNCdWNrZXQgIT09ICd1bmRlZmluZWQnID8gczNCdWNrZXQgOiAnJyA7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXMzLWJ1Y2tldCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYnVja2V0JztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXMzLXBhdGgnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQn9GD0YLRjCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICB0eXBlb2YgczNQYXRoICE9PSAndW5kZWZpbmVkJyA/IHMzUGF0aCA6ICcnIDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtcGF0aCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtcGF0aCc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2Utd2lkdGgnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQo9C80LXQvdGM0YjQuNGC0Ywg0LTQviDRgNCw0LfQvNC10YDQsCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4gZm9ybV9faW5wLWNvbnRhaW4tLWZ1bGwtd2lkdGgnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAgdHlwZW9mIHdpZHRoICE9PSAndW5kZWZpbmVkJyA/IHdpZHRoIDogJycgO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS13aWR0aCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2Utd2lkdGgnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYmV0d2Vlbi1pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnc3BhbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnw5cnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS12ZXJ5LXNob3J0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gIHR5cGVvZiBoZWlnaHQgIT09ICd1bmRlZmluZWQnID8gaGVpZ2h0IDogJycgO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1oZWlnaHQnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19oaW50JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0JXRgdC70Lgg0L3QtSDQt9Cw0LTQsNGC0Ywg0LfQvdCw0YfQtdC90LjQtSwg0L7QvdC+INCx0YPQtNC10YIg0LLRi9GH0LjRgdC70LXQvdC+INC/0YDQvtC/0L7RgNGG0LjQvtC90LDQu9GM0L3QvicpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2Utc291cmNlJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0JjRgdGC0L7Rh9C90LjQuicpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnc2VsZWN0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1zb3VyY2UnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXNvdXJjZSc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdzZWxlY3QnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd1cGxvYWQnO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbmlmICggc291cmNlID09IFwidXBsb2FkXCIpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ3NlbGVjdGVkJywgYXR0cl0pO1xufSkoKTtcbn1cbmNoaWxkcy5wdXNoKGNyZWF0ZSgnb3B0aW9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQl9Cw0LPRgNGD0LfQuNGC0Ywg0LjQt9C+0LHRgNCw0LbQtdC90LjQtScpO1xufSkpO1xufSkoKTtcbmlmICggIHR5cGVvZiBzb3VyY2VzICE9PSAndW5kZWZpbmVkJyA/IHNvdXJjZXMgOiAnJyApIHtcbnZhciBhcnIwID0gc291cmNlczsgZm9yIChzb3VyY2VJdGVtIGluIGFycjApIGlmIChfaGFzUHJvcC5jYWxsKGFycjAsIHNvdXJjZUl0ZW0pKSB7XG5zb3VyY2VJdGVtID0gYXJyMFtzb3VyY2VJdGVtXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBzb3VyY2VJdGVtWydhbGlhcyddO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbmlmICggc291cmNlID09IHNvdXJjZUl0ZW1bJ2FsaWFzJ10pIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ3NlbGVjdGVkJywgYXR0cl0pO1xufSkoKTtcbn1cbmNoaWxkcy5wdXNoKGNyZWF0ZSgnb3B0aW9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKHNvdXJjZUl0ZW1bJ2xhYmVsJ10pXG59KSk7XG59KSgpO1xufX1cbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX3N1Ym1pdCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19idG4gZm9ybV9fYnRuLS1zdWJtaXQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQodC+0YXRgNCw0L3QuNGC0YwnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2J0biBwb3B1cF9fY2FuY2VsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J7RgtC80LXQvdC40YLRjCcpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufX0pfTtcbiAgICB9KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG57XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgfVxuICBlbHNlIHtcbiAgICB3aW5kb3cubW9kYWwgPSBmYWN0b3J5KCk7XG4gIH1cbn0pKGZ1bmN0aW9uICgpXG57XG4gIHZhciBfaGFzUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciBfY3JFbCA9IGZ1bmN0aW9uIChub2RlKVxuICB7XG4gICAgcmV0dXJuIHt0eXBlOiAnbm9kZScsIG5hbWU6IG5vZGUsIGF0dHJzOiBbXSwgY2hpbGRzOiBbXX07XG4gIH07XG4gIHZhciBfY3JUTiA9IGZ1bmN0aW9uIChub2RlKVxuICB7XG4gICAgcmV0dXJuIHt0eXBlOiAndGV4dCcsIHRleHQ6IG5vZGV9O1xuICB9O1xuICBmdW5jdGlvbiBjcmVhdGUoKVxuICB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciByb290Tm9kZXMgPSBbXTtcbiAgICAgIGFyZ3VtZW50c1swXShyb290Tm9kZXMpO1xuICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gcm9vdE5vZGVzKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwocm9vdE5vZGVzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgIHJvb3ROb2Rlc1tpbmRleEF0dHJdID0gX2NyVE4ocm9vdE5vZGVzW2luZGV4QXR0cl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICB9XG4gICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICB2YXIgcGFyZW50Tm9kZTtcbiAgICAgIHZhciBpbmRleE5vZGU7XG4gICAgICB2YXIgbm9kZTtcbiAgICAgIHZhciBpbmRleEF0dHI7XG4gICAgICB2YXIgYXR0cjtcbiAgICAgIHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGFyZ3VtZW50c1syXShub2Rlcyk7XG4gICAgICBwYXJlbnROb2RlID0gX2NyRWwoYXJndW1lbnRzWzBdKTtcbiAgICAgIGlmIChhdHRycy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gYXR0cnMpIHtcbiAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChhdHRycywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2luZGV4QXR0cl07XG4gICAgICAgICAgICBwYXJlbnROb2RlLmF0dHJzLnB1c2goe1xuICAgICAgICAgICAgICBuYW1lOiBhdHRyWzBdLFxuICAgICAgICAgICAgICB2YWx1ZTogYXR0clsxXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGluZGV4Tm9kZSBpbiBub2Rlcykge1xuICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChub2RlcywgaW5kZXhOb2RlKSkge1xuICAgICAgICAgIG5vZGUgPSBub2Rlc1tpbmRleE5vZGVdO1xuICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIG5vZGUgPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2goX2NyVE4obm9kZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2gobm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyZW50Tm9kZTtcbiAgICB9XG4gIH1cbiAgdmFyIGNhY2hlZFRlbXBsYXRlcyA9IHt9O1xuICBmdW5jdGlvbiBjYWNoZVJlcXVpcmVUZW1wbGF0ZShwYXRoLCByZXF1aXJlZClcbiAge1xuICAgIGNhY2hlZFRlbXBsYXRlc1twYXRoXSA9IHJlcXVpcmVkO1xuICB9XG4gIGZ1bmN0aW9uIHJlcXVpcmVUZW1wbGF0ZShwYXRoLCBvYmopXG4gIHtcbiAgICByZXR1cm4gY2FjaGVkVGVtcGxhdGVzW3BhdGhdKG9iaik7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChvYmopXG4gIHtcbiAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAge1xuICAgICAgd2l0aCAob2JqKSB7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICBhdHRyICs9ICdwb3B1cF9faGVhZCc7XG4gICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICBjaGlsZHMucHVzaCgn0J3QsNGB0YLRgNC+0LnQutC4INC/0LXRgNC10LrQu9GO0YfQsNGC0LXQu9C10LknKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICBhdHRycy5wdXNoKFsnYWN0aW9uJywgYXR0cl0pO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICBhdHRyICs9ICdmb3JtJztcbiAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICB9KSgpO1xuICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1mb3JtJztcbiAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdmb3JtJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faXRlbSc7XG4gICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1yYWRpby1udW0tb3B0aW9ucyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCfQmtC+0LvQuNGH0LXRgdGC0LLQviDQstCw0YDQuNCw0L3RgtC+0LIg0L7RgtCy0LXRgtCwJyk7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS12ZXJ5LXNob3J0JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBudW1PcHRpb25zO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLXJhZGlvLW51bS1vcHRpb25zJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLXJhZGlvLW51bS1vcHRpb25zJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19pdGVtJztcbiAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19sYWJlbCc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goJ9CS0LDRgNC40LDQvdGC0Ysg0L7RgtCy0LXRgtC+0LI6Jyk7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19pbnAtY29udGFpbiBmb3JtX19pbnAtY29udGFpbi0tZnVsbC13aWR0aCc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19yb3ctb3B0aW9uJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAncmFkaW8nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fcmFkaW8nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJy0xJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbi0tMSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1yYWRpby1vcHRpb24nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyduYW1lJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGRlZmF1bHRWYWx1ZSA9PSAtMSB8fCBkZWZhdWx0VmFsdWUgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjaGVja2VkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX3JhZGlvLWxhYmVsJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbi0tMSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uLS0xJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2knLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0J3QuNGH0LXQs9C+INC90LUg0LLRi9Cx0YDQsNC90L4g0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9ucy1jb250YWluJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFycjEgPSBkZWZhdWx0RGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyMSkgaWYgKF9oYXNQcm9wLmNhbGwoYXJyMSwgaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uID0gYXJyMVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX3Jvdy1vcHRpb24nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdyYWRpbyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19yYWRpbyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1yYWRpby1vcHRpb24nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uLSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnbmFtZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBkZWZhdWx0VmFsdWUgPT0gaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NoZWNrZWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fcmFkaW8tbGFiZWwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uLSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS1oYWxmLXdpZHRoJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gb3B0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1yYWRpby1vcHRpb24tbGFiZWwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydkYXRhLWluZGV4JywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19zdWJtaXQnO1xuICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2J0biBmb3JtX19idG4tLXN1Ym1pdCc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCfQodC+0YXRgNCw0L3QuNGC0YwnKTtcbiAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2J1dHRvbic7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2J0biBwb3B1cF9fY2FuY2VsJztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goJ9Ce0YLQvNC10L3QuNGC0YwnKTtcbiAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0pOyIsIihmdW5jdGlvbiAoZmFjdG9yeSlcbiAgICB7XG4gICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBkZWZpbmUoJ2ZpcnN0LXRyeScsIFtdLCBmYWN0b3J5KCkpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy5tb2RhbCA9IGZhY3RvcnkoKTtcbiAgICAgIH1cbiAgICB9KShmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgIHZhciBfaGFzUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gICAgICB2YXIgX2NyRWwgPSBmdW5jdGlvbiAobm9kZSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHt0eXBlOiAnbm9kZScsIG5hbWU6IG5vZGUsIGF0dHJzOiBbXSwgY2hpbGRzOiBbXX07XG4gICAgICB9O1xuICAgICAgdmFyIF9jclROID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ3RleHQnLCB0ZXh0OiBub2RlfTtcbiAgICAgIH07XG4gICAgICBmdW5jdGlvbiBjcmVhdGUoKVxuICAgICAge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHZhciByb290Tm9kZXMgPSBbXTtcbiAgICAgICAgICBhcmd1bWVudHNbMF0ocm9vdE5vZGVzKTtcbiAgICAgICAgICBpZiAocm9vdE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gcm9vdE5vZGVzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKHJvb3ROb2RlcywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdzdHJpbmcnIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgIHJvb3ROb2Rlc1tpbmRleEF0dHJdID0gX2NyVE4ocm9vdE5vZGVzW2luZGV4QXR0cl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcm9vdE5vZGVzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgICAgICB2YXIgcGFyZW50Tm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhOb2RlO1xuICAgICAgICAgIHZhciBub2RlO1xuICAgICAgICAgIHZhciBpbmRleEF0dHI7XG4gICAgICAgICAgdmFyIGF0dHI7XG4gICAgICAgICAgdmFyIGF0dHJzID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgIGFyZ3VtZW50c1syXShub2Rlcyk7XG4gICAgICAgICAgcGFyZW50Tm9kZSA9IF9jckVsKGFyZ3VtZW50c1swXSk7XG4gICAgICAgICAgaWYgKGF0dHJzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gYXR0cnMpIHtcbiAgICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwoYXR0cnMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBhdHRyID0gYXR0cnNbaW5kZXhBdHRyXTtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmF0dHJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgbmFtZTogYXR0clswXSxcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiBhdHRyWzFdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChpbmRleE5vZGUgaW4gbm9kZXMpIHtcbiAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKG5vZGVzLCBpbmRleE5vZGUpKSB7XG4gICAgICAgICAgICAgIG5vZGUgPSBub2Rlc1tpbmRleE5vZGVdO1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBub2RlID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIG5vZGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChfY3JUTihub2RlKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvYmopXG4gICAgICB7XG4gICAgICAgIHJldHVybiBjcmVhdGUoZnVuY3Rpb24gKGNoaWxkcylcbiAgICAgICAge3dpdGggKG9iaikgeyhmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAncG9wdXBfX2hlYWQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQndCw0YHRgtGA0L7QudC60Lgg0YLQsNCx0LvQuNGG0YsnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHJzLnB1c2goWydhY3Rpb24nLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZm9ybSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2Zvcm0nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtdGFibGUtY29sdW1ucyc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Ca0L7Qu9C+0L3QvtC6INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IGNvbHVtbnM7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXRhYmxlLWNvbHVtbnMnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXRhYmxlLWNvbHVtbnMnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtdGFibGUtcm93cyc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Ch0YLRgNC+0Log0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4nKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS12ZXJ5LXNob3J0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gcm93cztcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtdGFibGUtcm93cyc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtdGFibGUtcm93cyc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy10YWJsZS1yb3dzJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0KjQsNCx0LvQvtC9INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbiBmb3JtX19pbnAtY29udGFpbi0tZnVsbC13aWR0aCBmb3JtX19pbnAtY29udGFpbi0tc2Nyb2xsLXdyYXAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFibGUgdGFibGUtLXN0cmFpZ2h0LXNpZGVzIHRhYmxlLS1yZXNwb25zaXZlJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ3RhYmxlJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy10YWJsZS10Ym9keSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ3Rib2R5JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbnZhciBhcnI4ID0gZGVmYXVsdERhdGE7IGZvciAocm93SW5kZXggaW4gYXJyOCkgaWYgKF9oYXNQcm9wLmNhbGwoYXJyOCwgcm93SW5kZXgpKSB7XG5yb3cgPSBhcnI4W3Jvd0luZGV4XTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndHInLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xudmFyIGFycjkgPSByb3c7IGZvciAoY29sdW1uSW5kZXggaW4gYXJyOSkgaWYgKF9oYXNQcm9wLmNhbGwoYXJyOSwgY29sdW1uSW5kZXgpKSB7XG5jb2x1bW4gPSBhcnI5W2NvbHVtbkluZGV4XTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IGNvbHVtbjtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtdGFibGUtY2VsbCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gcm93SW5kZXg7XG5hdHRycy5wdXNoKFsnZGF0YS1yb3cnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IGNvbHVtbkluZGV4O1xuYXR0cnMucHVzaChbJ2RhdGEtY29sdW1uJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59fSkpO1xufSkoKTtcbn19KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19zdWJtaXQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYnRuIGZvcm1fX2J0bi0tc3VibWl0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0KHQvtGF0YDQsNC90LjRgtGMJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdidXR0b24nO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19idG4gcG9wdXBfX2NhbmNlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Ce0YLQvNC10L3QuNGC0YwnKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn19KX07XG4gICAgfSk7Il19
