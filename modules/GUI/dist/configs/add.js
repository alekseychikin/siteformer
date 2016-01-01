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
    return this.clone(this.state.fields[+index]);
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
var Model, httpGet, httpPost,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Model = require("model.coffee");

httpGet = (require("ajax.coffee")).httpGet;

httpPost = (require("ajax.coffee")).httpPost;

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
  initial: function() {
    this.testConnectionS3();
    return this.checkPath();
  },
  updateStorage: function(value) {
    this.set({
      storage: value
    });
    if (!this.state.s3auth) {
      return this.testConnectionS3();
    }
  },
  updatePath: function(value) {
    this.set({
      path: value
    });
    return this.checkPath();
  },
  checkPath: function() {
    return httpPost("/cms/types/image/checkpath/__json/", {
      path: this.state.path
    }).then((function(_this) {
      return function(response) {
        _this.set({
          pathError: false
        });
        if (!response.exists) {
          _this.set({
            pathError: "Путь не найден"
          });
        }
        if (!response.writePermission) {
          return _this.set({
            pathError: "Папка закрыта на запись"
          });
        }
      };
    })(this))["catch"](function(error) {
      return console.error(error);
    });
  },
  resetPath: function() {
    return this.set({
      pathError: false
    });
  },
  testConnectionS3: function() {
    if (this.state.storage === "s3" && this.state.s3AccessKey.length && this.state.s3SecretKey.length && !this.state.s3auth) {
      this.set({
        s3checking: true
      });
      return httpGet("/cms/types/image/check-s3-connection/__json/", {
        accessKey: this.state.s3AccessKey,
        secretKey: this.state.s3SecretKey
      }).then((function(_this) {
        return function(response) {
          var ref;
          _this.set({
            s3auth: response.auth
          });
          if (response.auth) {
            if (ref = _this.state.s3Bucket, indexOf.call(response.buckets, ref) < 0) {
              _this.set({
                s3Bucket: response.buckets[0]
              });
            }
            _this.set({
              buckets: response.buckets
            });
          }
          return _this.set({
            s3checking: false
          });
        };
      })(this))["catch"](function(error) {
        this.set({
          s3checking: false
        });
        return console.error(error);
      });
    }
  },
  updateS3AccessKey: function(value) {
    if (this.state.s3AccessKey !== value) {
      this.set({
        s3auth: false
      });
      this.set({
        buckets: false
      });
    }
    return this.set({
      s3AccessKey: value
    });
  },
  updateS3SecretKey: function(value) {
    if (this.state.s3SecretKey !== value) {
      this.set({
        s3auth: false
      });
      this.set({
        buckets: false
      });
    }
    return this.set({
      s3SecretKey: value
    });
  },
  updateS3Bucket: function(value) {
    this.set({
      s3Bucket: value
    });
    return this.checkS3Path();
  },
  updateS3Path: function(value) {
    if (this.state.s3Path !== value) {
      this.s3ResetPath();
      this.set({
        s3Path: value
      });
      return this.checkS3Path();
    }
  },
  checkS3Path: function() {
    if (this.state.s3auth) {
      return httpGet("/cms/types/image/check-s3-path/__json/", {
        path: this.state.s3Path,
        accessKey: this.state.s3AccessKey,
        secretKey: this.state.s3SecretKey,
        bucket: this.state.s3Bucket
      }).then((function(_this) {
        return function(response) {
          _this.set({
            s3PathError: false
          });
          if (!response.exists) {
            return _this.set({
              s3PathError: "Путь не найден"
            });
          }
        };
      })(this));
    }
  },
  s3ResetPath: function() {
    return this.set({
      s3PathError: false
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


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee"}],11:[function(require,module,exports){
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
    "keydown: @configs-image-path": function(e) {
      return this.model.resetPath();
    },
    "keyup input: @configs-image-path": function(e) {
      return this.frequency(500, (function(_this) {
        return function() {
          return _this.model.updatePath(e.target.value);
        };
      })(this));
    },
    "change: @configs-image-path": function(e) {
      return this.model.updatePath(e.target.value);
    },
    "change keyup input: @configs-image-s3-access-key": function(e) {
      return this.frequency(500, (function(_this) {
        return function() {
          return _this.model.updateS3AccessKey(e.target.value);
        };
      })(this));
    },
    "change keyup input: @configs-image-s3-secret-key": function(e) {
      return this.frequency(500, (function(_this) {
        return function() {
          return _this.model.updateS3SecretKey(e.target.value);
        };
      })(this));
    },
    "change: @configs-image-s3-bucket": function(e) {
      return this.model.updateS3Bucket(e.target.value);
    },
    "change keyup input: @configs-image-s3-path": function(e) {
      return this.frequency(500, (function(_this) {
        return function() {
          return _this.model.updateS3Path(e.target.value);
        };
      })(this));
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
    "click: @test-connection-s3": function(e) {
      return this.model.testConnectionS3();
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
            attr += 'popup__head';
            attrs.push(['class', attr]);
          })();
          childs.push(create('div', attrs, function (childs) {
            childs.push('Настройки изображения');
          }));
        })();
        var isEmpty = !(length(s3AccessKey)) || !(length(s3SecretKey));
        var isS3Auth =  typeof s3auth !== 'undefined' ? s3auth : ''  && (s3auth == true || s3auth == "true");
        var isS3Checking =  typeof s3checking !== 'undefined' ? s3checking : ''  && (s3checking == true || s3checking == "true");
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
                        if (  typeof pathError !== 'undefined' ? pathError : ''  && (pathError)) {
                          (function () {
                            var attrs = [];
                            (function () {
                              var attr = '';
                              attr += 'form__error';
                              attrs.push(['class', attr]);
                            })();
                            childs.push(create('span', attrs, function (childs) {
                              childs.push(pathError);
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
                        attr += 'form__inp-contain';
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
                            attr += 'form__btn';
                            attrs.push(['class', attr]);
                          })();
                          (function () {
                            var attr = '';
                            attr += 'test-connection-s3';
                            attrs.push(['role', attr]);
                          })();
                          if ( isEmpty || isS3Auth || isS3Checking) {
                            (function () {
                              var attr = '';
                              attrs.push(['disabled', attr]);
                            })();
                          }
                          childs.push(create('button', attrs, function (childs) {
                            if ( isS3Checking) {
                              childs.push('\n          Соединение...\n          ');
                            } else {
                              if ( isS3Auth) {
                                childs.push('\n          Готово\n            ');
                              } else {
                                childs.push('\n          Подключиться\n            ');
                              }
                            }
                          }));
                        })();
                      }));
                    })();
                  }));
                })();
                if ( isS3Auth == "true" || isS3Auth == true) {
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
                          if (  typeof buckets !== 'undefined' ? buckets : ''  && count(buckets)) {
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
                                    attr += 'configs-image-s3-bucket';
                                    attrs.push(['role', attr]);
                                  })();
                                  (function () {
                                    var attr = '';
                                    attr += 'configs-image-s3-bucket';
                                    attrs.push(['id', attr]);
                                  })();
                                  childs.push(create('select', attrs, function (childs) {
                                    var arr0 = buckets;
                                    for (var bucket in arr0) if (_hasProp.call(arr0, bucket)) {
                                      bucket = arr0[bucket];
                                      (function () {
                                        var attrs = [];
                                        (function () {
                                          var attr = '';
                                          attr += bucket;
                                          attrs.push(['value', attr]);
                                        })();
                                        if ( !(!( typeof s3Bucket !== 'undefined' ? s3Bucket : '' )) && (s3Bucket == bucket)) {
                                          (function () {
                                            var attr = '';
                                            attrs.push(['selected', attr]);
                                          })();
                                        }
                                        childs.push(create('option', attrs, function (childs) {
                                          childs.push(bucket);
                                        }));
                                      })();
                                    }
                                  }));
                                })();
                              }));
                            })();
                          } else {
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
                          }
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
                          if (  typeof s3PathError !== 'undefined' ? s3PathError : ''  && (s3PathError)) {
                            (function () {
                              var attrs = [];
                              (function () {
                                var attr = '';
                                attr += 'form__error';
                                attrs.push(['class', attr]);
                              })();
                              childs.push(create('span', attrs, function (childs) {
                                childs.push(s3PathError);
                              }));
                            })();
                          }
                        }));
                      })();
                    }));
                  })();
                }
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
                              var arr1 = sources;
                              for (var sourceItem in arr1) if (_hasProp.call(arr1, sourceItem)) {
                                sourceItem = arr1[sourceItem];
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
                                    childs.push(sourceItem['label']);
                                  }));
                                })();
                              }
                            }
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
                  if ( (storage == "local" && ( typeof pathError !== 'undefined' ? pathError : ''  && pathError)) || (storage == "s3" && (!(isS3Auth)))) {
                    (function () {
                      var attr = '';
                      attrs.push(['disabled', attr]);
                    })();
                  }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2FkZC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2FkZE1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9jaGVja2JveC9Db25maWdzQ2hlY2tib3hNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9jaGVja2JveC9Db25maWdzQ2hlY2tib3hWaWV3LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL2ZpbGUvQ29uZmlnc0ZpbGVNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9maWxlL0NvbmZpZ3NGaWxlVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9nYWxsZXJ5L0NvbmZpZ3NHYWxsZXJ5TW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvZ2FsbGVyeS9Db25maWdzR2FsbGVyeVZpZXcuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvaW1hZ2UvQ29uZmlnc0ltYWdlTW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvaW1hZ2UvQ29uZmlnc0ltYWdlVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9yYWRpby9Db25maWdzUmFkaW9Nb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9yYWRpby9Db25maWdzUmFkaW9WaWV3LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3RhYmxlL0NvbmZpZ3NUYWJsZU1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3RhYmxlL0NvbmZpZ3NUYWJsZVZpZXcuY29mZmVlIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvc2VjdGlvbnMvY29uZmlncy90YWJsZS1tb2R1bGUtZmllbGRzLnRtcGwuanMiLCJ0ZW1wL21vZHVsZXMvR1VJLy5jb21waWxlX3RlbXBsYXRlcy90eXBlcy9jaGVja2JveC9tb2RhbC50bXBsLmpzIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvdHlwZXMvZmlsZS9tb2RhbC50bXBsLmpzIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvdHlwZXMvZ2FsbGVyeS9tb2RhbC50bXBsLmpzIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvdHlwZXMvaW1hZ2UvbW9kYWwudG1wbC5qcyIsInRlbXAvbW9kdWxlcy9HVUkvLmNvbXBpbGVfdGVtcGxhdGVzL3R5cGVzL3JhZGlvL21vZGFsLnRtcGwuanMiLCJ0ZW1wL21vZHVsZXMvR1VJLy5jb21waWxlX3RlbXBsYXRlcy90eXBlcy90YWJsZS9tb2RhbC50bXBsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLG1CQUFSOztBQUNYLE9BQUEsR0FBVSxPQUFBLENBQVEsa0JBQVI7O0FBQ1YsQ0FBQSxHQUFJLE9BQUEsQ0FBUSx1QkFBUjs7QUFFSixRQUFBLEdBQVcsUUFBQSxDQUFBOztBQUNYLE9BQUEsR0FBVSxPQUFBLENBQVMsQ0FBQSxDQUFFLGNBQUYsQ0FBVCxFQUE0QixRQUE1Qjs7QUFHVixNQUFBLEdBQ0U7RUFBQSxLQUFBLEVBQU8sT0FBQSxDQUFRLGdDQUFSLENBQVA7RUFDQSxLQUFBLEVBQU8sT0FBQSxDQUFRLGdDQUFSLENBRFA7RUFFQSxJQUFBLEVBQU0sT0FBQSxDQUFRLDhCQUFSLENBRk47RUFHQSxLQUFBLEVBQU8sT0FBQSxDQUFRLGdDQUFSLENBSFA7RUFJQSxRQUFBLEVBQVUsT0FBQSxDQUFRLHNDQUFSLENBSlY7RUFLQSxPQUFBLEVBQVMsT0FBQSxDQUFRLG9DQUFSLENBTFQ7OztBQU9GLEtBQUEsR0FDRTtFQUFBLEtBQUEsRUFBTyxP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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcDFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxK0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJBZGRNb2RlbCA9IHJlcXVpcmUgXCIuL2FkZE1vZGVsLmNvZmZlZVwiXG5BZGRWaWV3ID0gcmVxdWlyZSBcIi4vYWRkVmlldy5jb2ZmZWVcIlxuJCA9IHJlcXVpcmUgXCJqcXVlcnktcGx1Z2lucy5jb2ZmZWVcIlxuXG5hZGRNb2RlbCA9IEFkZE1vZGVsKClcbmFkZFZpZXcgPSBBZGRWaWV3ICgkIFwiQGNvbmZpZ3MtYWRkXCIpLCBhZGRNb2RlbFxuXG5cbm1vZGVscyA9XG4gIGltYWdlOiByZXF1aXJlIFwiaW1hZ2UvQ29uZmlnc0ltYWdlTW9kZWwuY29mZmVlXCJcbiAgdGFibGU6IHJlcXVpcmUgXCJ0YWJsZS9Db25maWdzVGFibGVNb2RlbC5jb2ZmZWVcIlxuICBmaWxlOiByZXF1aXJlIFwiZmlsZS9Db25maWdzRmlsZU1vZGVsLmNvZmZlZVwiXG4gIHJhZGlvOiByZXF1aXJlIFwicmFkaW8vQ29uZmlnc1JhZGlvTW9kZWwuY29mZmVlXCJcbiAgY2hlY2tib3g6IHJlcXVpcmUgXCJjaGVja2JveC9Db25maWdzQ2hlY2tib3hNb2RlbC5jb2ZmZWVcIlxuICBnYWxsZXJ5OiByZXF1aXJlIFwiZ2FsbGVyeS9Db25maWdzR2FsbGVyeU1vZGVsLmNvZmZlZVwiXG5cbnZpZXdzID1cbiAgaW1hZ2U6IHJlcXVpcmUgXCJpbWFnZS9Db25maWdzSW1hZ2VWaWV3LmNvZmZlZVwiXG4gIHRhYmxlOiByZXF1aXJlIFwidGFibGUvQ29uZmlnc1RhYmxlVmlldy5jb2ZmZWVcIlxuICBmaWxlOiByZXF1aXJlIFwiZmlsZS9Db25maWdzRmlsZVZpZXcuY29mZmVlXCJcbiAgcmFkaW86IHJlcXVpcmUgXCJyYWRpby9Db25maWdzUmFkaW9WaWV3LmNvZmZlZVwiXG4gIGNoZWNrYm94OiByZXF1aXJlIFwiY2hlY2tib3gvQ29uZmlnc0NoZWNrYm94Vmlldy5jb2ZmZWVcIlxuICBnYWxsZXJ5OiByZXF1aXJlIFwiZ2FsbGVyeS9Db25maWdzR2FsbGVyeVZpZXcuY29mZmVlXCJcblxuUG9wdXAgPSByZXF1aXJlIFwicG9wdXBcIlxuXG5hZGRWaWV3Lm9uIFwib3Blbi1jb25maWdzLW1vZGFsXCIsIChpbmRleCwgZmllbGQsIGZpZWxkcykgLT5cbiAgUG9wdXAub3BlbiBcIkBjb25maWdzLXBvcHVwXCJcbiAgZmllbGQuc2V0dGluZ3MuaW5kZXggPSBpbmRleFxuXG4gIG1vZGVsID0gbW9kZWxzW2ZpZWxkLnR5cGVdIGZpZWxkLnNldHRpbmdzXG4gIG1vZGVsLnNldEZpZWxkcyBmaWVsZHMgaWYgbW9kZWwuc2V0RmllbGRzP1xuXG4gIHZpZXcgPSB2aWV3c1tmaWVsZC50eXBlXSAoJCBcIkBjb25maWdzLXBvcHVwXCIpLCBtb2RlbFxuICB2aWV3Lm9uIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIChmb3JtKSAtPlxuICAgIGFkZE1vZGVsLnNhdmVGaWVsZENvbmZpZ3MgZm9ybVxuICAgIFBvcHVwLmNsb3NlKClcbiAgICB2aWV3LmRlc3Ryb3koKVxuXG5hZGRNb2RlbC5vbiBcIm9uU2F2ZWRTZWN0aW9uXCIsIChhbGlhcykgLT5cbiAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9jbXMvY29uZmlncy8je2FsaWFzfS9cIlxuXG4jIHNldFRpbWVvdXQgPT5cbiMgICAoJCBcIkBmaWVsZC10eXBlXCIpXG4jICAgLmVxKDEpXG4jICAgLnZhbCBcInRhYmxlXCJcbiMgICAudHJpZ2dlciBcImNoYW5nZVwiXG4jICAgc2V0VGltZW91dCA9PlxuIyAgICAgKCQgXCJAYnRuLWNvbmZpZy1maWVsZFwiKS50cmlnZ2VyIFwiY2xpY2tcIlxuIyAgICAgIyBzZXRUaW1lb3V0ID0+XG4jICAgICAjICAgKCQgXCJAY29uZmlncy1pbWFnZS1zdG9yYWdlXCIpLmVxKDEpLnRyaWdnZXIgXCJjbGlja1wiXG4jICAgICAjICwgNDBcbiMgICAsIDQwXG4jICwgNTAwXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuUHJvbWlzZSA9IHJlcXVpcmUgXCJxXCJcbmh0dHBHZXQgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBHZXRcbmh0dHBQb3N0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwUG9zdFxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIGluaXRpYWxTdGF0ZTogLT5cbiAgICBodHRwR2V0IFwiI3t3aW5kb3cubG9jYXRpb24ucGF0aG5hbWV9X19qc29uL1wiXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgIHN0YXRlID1cbiAgICAgICAgICB0aXRsZTogcmVzcG9uc2UudGl0bGVcbiAgICAgICAgICBhbGlhczogcmVzcG9uc2UuYWxpYXNcbiAgICAgICAgICBtb2R1bGU6IHJlc3BvbnNlLm1vZHVsZVxuICAgICAgICAgIGZpZWxkczogcmVzcG9uc2UuZmllbGRzXG4gICAgICAgICAgdHlwZXM6IHJlc3BvbnNlLnR5cGVzXG4gICAgICAgIGlmIHJlc3BvbnNlLmlkXG4gICAgICAgICAgc3RhdGUuaWQgPSByZXNwb25zZS5pZFxuICAgICAgICBjb25zb2xlLmxvZyBzdGF0ZVxuICAgICAgICBzdGF0ZVxuXG4gIGFkZEZpZWxkOiAoZmllbGQpIC0+XG4gICAgQHNldCBmaWVsZHM6IEBzdGF0ZS5maWVsZHMuY29uY2F0IFtmaWVsZF1cblxuICBhZGRFbXB0eUZpZWxkOiAtPlxuICAgIEBzZXQgZmllbGRzOiBAc3RhdGUuZmllbGRzLmNvbmNhdCBbXG4gICAgICB0aXRsZTogXCJcIlxuICAgICAgYWxpYXM6IFwiXCJcbiAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICBdXG5cbiAgdXBkYXRlVGl0bGU6ICh2YWx1ZSkgLT4gQHNldCB0aXRsZTogdmFsdWVcbiAgdXBkYXRlQWxpYXM6ICh2YWx1ZSkgLT4gQHNldCBhbGlhczogdmFsdWVcbiAgdXBkYXRlTW9kdWxlOiAodmFsdWUpIC0+IEBzZXQgbW9kdWxlOiB2YWx1ZVxuXG4gIHVwZGF0ZUZpZWxkVGl0bGU6IChpbmRleCwgdmFsdWUpIC0+XG4gICAgZmllbGRzID0gQHN0YXRlLmZpZWxkcy5zbGljZSgpXG4gICAgZmllbGRzW2luZGV4XS50aXRsZSA9IHZhbHVlXG4gICAgQHNldCB7ZmllbGRzfVxuXG4gIHVwZGF0ZUZpZWxkQWxpYXM6IChpbmRleCwgdmFsdWUpIC0+XG4gICAgZmllbGRzID0gQHN0YXRlLmZpZWxkcy5zbGljZSgpXG4gICAgZmllbGRzW2luZGV4XS5hbGlhcyA9IHZhbHVlXG4gICAgQHNldCB7ZmllbGRzfVxuXG4gIHVwZGF0ZUZpZWxkVHlwZTogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBmaWVsZHMgPSBAc3RhdGUuZmllbGRzLnNsaWNlKClcbiAgICBmaWVsZHNbaW5kZXhdLnR5cGUgPSB2YWx1ZVxuICAgIEByZXNldFNldHRpbmdzIGluZGV4XG4gICAgQHNldCB7ZmllbGRzfVxuXG4gIHJlc2V0U2V0dGluZ3M6IChpbmRleCkgLT5cbiAgICBmaWVsZHMgPSBAc3RhdGUuZmllbGRzLnNsaWNlKClcbiAgICB0eXBlID0gZmllbGRzW2luZGV4XS50eXBlXG4gICAgZm9yIHR5cGVJdGVtIGluIEBzdGF0ZS50eXBlc1xuICAgICAgaWYgdHlwZUl0ZW0udHlwZSA9PSB0eXBlXG4gICAgICAgIGZpZWxkc1tpbmRleF0uc2V0dGluZ3MgPSBAY2xvbmUgdHlwZUl0ZW0uZGVmYXVsdFNldHRpbmdzXG4gICAgQHNldCB7ZmllbGRzfVxuXG4gIHJlbW92ZUZpZWxkOiAoaW5kZXgpIC0+XG4gICAgZmllbGRzID0gQHN0YXRlLmZpZWxkcy5zbGljZSgpXG4gICAgZmllbGRzLnNwbGljZSBpbmRleCwgMVxuICAgIEBzZXQge2ZpZWxkc31cblxuICBnZXRGaWVsZEJ5SW5kZXg6IChpbmRleCkgLT4gQGNsb25lIEBzdGF0ZS5maWVsZHNbK2luZGV4XVxuXG4gIGdldEZpZWxkczogLT4gQHN0YXRlLmZpZWxkcy5zbGljZSgpXG5cbiAgc2F2ZUZpZWxkQ29uZmlnczogKGZvcm0pIC0+XG4gICAgaW5kZXggPSBmb3JtLmluZGV4XG4gICAgZGVsZXRlIGZvcm0uaW5kZXhcbiAgICBmaWVsZHMgPSBAc3RhdGUuZmllbGRzLnNsaWNlKClcbiAgICBmaWVsZHNbaW5kZXhdLnNldHRpbmdzID0gZm9ybVxuICAgIEBzZXQge2ZpZWxkc31cblxuICBzYXZlOiAtPlxuICAgIGNvbnNvbGUubG9nIEBzdGF0ZVxuICAgIGh0dHBQb3N0IFwiL2Ntcy9jb25maWdzL2FjdGlvbl9zYXZlL19fanNvbi9cIiwgQHN0YXRlXG4gICAgICAudGhlbiAocmVzcG9uc2UpID0+XG4gICAgICAgIGlmIEBzdGF0ZS5pZD9cbiAgICAgICAgICBAc2V0IGZpZWxkczogcmVzcG9uc2Uuc2VjdGlvbi5maWVsZHNcbiAgICAgICAgICBAc2V0IGlkOiByZXNwb25zZS5zZWN0aW9uLmlkXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAdHJpZ2dlciBcIm9uU2F2ZWRTZWN0aW9uXCIsIEBzdGF0ZS5hbGlhc1xuICAgICAgLmNhdGNoIChyZXNwb25zZSkgLT5cbiAgICAgICAgY29uc29sZS5lcnJvciByZXNwb25zZS5lcnJvclxuIiwiJCA9IHJlcXVpcmUgXCJqcXVlcnktcGx1Z2lucy5jb2ZmZWVcIlxuVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcblBvcHVwID0gcmVxdWlyZSBcInBvcHVwXCJcbnRhYmxlTW9kdWxlRmllbGRzID0gcmVxdWlyZSBcInNlY3Rpb25zL2NvbmZpZ3MvdGFibGUtbW9kdWxlLWZpZWxkcy50bXBsLmpzXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGV2ZW50czpcbiAgICBcImNsaWNrOiBAYnRuLXJlbW92ZS1maWVsZFwiOiAoZSkgLT4gQG1vZGVsLnJlbW92ZUZpZWxkIEBnZXRSb3dJbmRleCBlXG4gICAgXCJjbGljazogQGJ0bi1hZGQtZmllbGRcIjogKGUpIC0+IEBtb2RlbC5hZGRFbXB0eUZpZWxkKClcbiAgICBcImNoYW5nZTogQGZpZWxkLXRpdGxlXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlRmllbGRUaXRsZSAoQGdldFJvd0luZGV4IGUpLCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAZmllbGQtYWxpYXNcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVGaWVsZEFsaWFzIChAZ2V0Um93SW5kZXggZSksIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBmaWVsZC10eXBlXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlRmllbGRUeXBlIChAZ2V0Um93SW5kZXggZSksIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWFkZC10aXRsZVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVRpdGxlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWFkZC1hbGlhc1wiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZUFsaWFzIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWFkZC1tb2R1bGVcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVNb2R1bGUgZS50YXJnZXQudmFsdWVcbiAgICBcImNsaWNrOiBAYnRuLWNvbmZpZy1maWVsZFwiOiBcImNsaWNrQnRuQ29uZmlnRmllbGRcIlxuICAgIFwic3VibWl0OiBAY29uZmlncy1hZGQtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NBZGRGb3JtXCJcblxuICBpbml0aWFsOiAtPlxuICAgIEB0Ym9keUNvbnRhaW4gPSBSZW5kZXIgdGFibGVNb2R1bGVGaWVsZHMsICgkIFwiQHRib2R5LW1vZHVsZS1maWVsZHNcIilbMF1cblxuICByZW5kZXI6IChzdGF0ZSkgLT5cbiAgICBAdGJvZHlDb250YWluIHN0YXRlXG5cbiAgZ2V0Um93SW5kZXg6IChlKSAtPlxuICAgICRwYXJlbnQgPSAoJCBlLnRhcmdldCkuY2xvc2VzdCBcIltkYXRhLWtleV1cIlxuICAgIHJldHVybiAkcGFyZW50LmRhdGEgXCJrZXlcIlxuXG4gIGNsaWNrQnRuQ29uZmlnRmllbGQ6IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwib3Blbi1jb25maWdzLW1vZGFsXCIsXG4gICAgICBAZ2V0Um93SW5kZXggZVxuICAgICAgQG1vZGVsLmdldEZpZWxkQnlJbmRleCBAZ2V0Um93SW5kZXggZVxuICAgICAgQG1vZGVsLmdldEZpZWxkcygpXG5cbiAgc3VibWl0Q29uZmlnc0FkZEZvcm06IChlKSAtPlxuICAgIEBtb2RlbC5zYXZlKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuXG4gIHVwZGF0ZU51bU9wdGlvbnM6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSA9IHBhcnNlSW50IHZhbHVlLCAxMFxuICAgIG51bU9wdHMgPSBwYXJzZUludCBAc3RhdGUubnVtT3B0aW9ucywgMTBcbiAgICBkZWZhdWx0RGF0YSA9IEBzdGF0ZS5kZWZhdWx0RGF0YS5zbGljZSgpXG4gICAgaWYgdmFsdWUgPiBudW1PcHRzXG4gICAgICBmb3IgaSBpbiBbbnVtT3B0cyArIDEuLnZhbHVlXVxuICAgICAgICBkZWZhdWx0RGF0YS5wdXNoXG4gICAgICAgICAgbGFiZWw6IFwiXCJcbiAgICAgICAgICBjaGVja2VkOiBmYWxzZVxuICAgIGVsc2VcbiAgICAgIGZvciBpIGluIFt2YWx1ZSArIDEuLm51bU9wdHNdXG4gICAgICAgIGRlZmF1bHREYXRhLnBvcCgpXG4gICAgQHNldCBudW1PcHRpb25zOiB2YWx1ZVxuICAgIEBzZXQgZGVmYXVsdERhdGE6IGRlZmF1bHREYXRhXG5cbiAgdXBkYXRlRGVmYXVsdERhdGFPcHRpb25DaGVja2VkOiAoaW5kZXgsIHZhbHVlKSAtPlxuICAgIGRhdGEgPSBAc3RhdGUuZGVmYXVsdERhdGEuc2xpY2UoKVxuICAgIGRhdGFbaW5kZXhdLmNoZWNrZWQgPSB2YWx1ZVxuICAgIEBzZXQgZGVmYXVsdERhdGE6IGRhdGFcblxuICB1cGRhdGVEZWZhdWx0RGF0YU9wdGlvbjogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBkYXRhID0gQHN0YXRlLmRlZmF1bHREYXRhLnNsaWNlKClcbiAgICBkYXRhW2luZGV4XS5sYWJlbCA9IHZhbHVlXG4gICAgQHNldCBkZWZhdWx0RGF0YTogZGF0YVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcbm1vZGFsV2luZG93VGVtcGxhdGUgPSByZXF1aXJlIFwidHlwZXMvY2hlY2tib3gvbW9kYWwudG1wbC5qc1wiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBpbml0aWFsOiAtPlxuICAgIEBtb2RhbENvbnRhaW4gPSBSZW5kZXIgbW9kYWxXaW5kb3dUZW1wbGF0ZSwgQGNvbnRhaW5bMF1cblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWNoZWNrYm94LW51bS1vcHRpb25zXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlTnVtT3B0aW9ucyBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1jaGVja2JveC1vcHRpb25cIjogKGUpIC0+IEBtb2RlbC51cGRhdGVEZWZhdWx0RGF0YU9wdGlvbkNoZWNrZWQgKEBnZXRJbmRleEJ5RXZlbnQgZSksIGUudGFyZ2V0LmNoZWNrZWRcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtY2hlY2tib3gtb3B0aW9uLWxhYmVsXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlRGVmYXVsdERhdGFPcHRpb24gKEBnZXRJbmRleEJ5RXZlbnQgZSksIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQGRlc3Ryb3koKVxuXG4gIGdldEluZGV4QnlFdmVudDogKGUpIC0+XG4gICAgJGl0ZW0gPSAkIGUudGFyZ2V0XG4gICAgJGl0ZW0uZGF0YSBcImluZGV4XCJcblxuICByZW5kZXI6IChzdGF0ZSkgLT5cbiAgICBAbW9kYWxDb250YWluIHN0YXRlXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIEBtb2RlbC5nZXRTdGF0ZSgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIHVwZGF0ZVN0b3JhZ2U6ICh2YWx1ZSkgLT4gQHNldCBzdG9yYWdlOiB2YWx1ZVxuICB1cGRhdGVQYXRoOiAodmFsdWUpIC0+IEBzZXQgcGF0aDogdmFsdWVcbiAgdXBkYXRlUzNBY2Nlc3NLZXk6ICh2YWx1ZSkgLT4gQHNldCBzM0FjY2Vzc0tleTogdmFsdWVcbiAgdXBkYXRlUzNTZWNyZXRLZXk6ICh2YWx1ZSkgLT4gQHNldCBzM1NlY3JldEtleTogdmFsdWVcbiAgdXBkYXRlUzNCdWNrZXQ6ICh2YWx1ZSkgLT4gQHNldCBzM0J1Y2tldDogdmFsdWVcbiAgdXBkYXRlUzNQYXRoOiAodmFsdWUpIC0+IEBzZXQgczNQYXRoOiB2YWx1ZVxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlclwiXG5tb2RhbFdpbmRvd1RlbXBsYXRlID0gcmVxdWlyZSBcInR5cGVzL2ZpbGUvbW9kYWwudG1wbC5qc1wiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBpbml0aWFsOiAtPlxuICAgIEBtb2RhbENvbnRhaW4gPSBSZW5kZXIgbW9kYWxXaW5kb3dUZW1wbGF0ZSwgQGNvbnRhaW5bMF1cblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtc3RvcmFnZVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVN0b3JhZ2UgKCQgZS50YXJnZXQpLmRhdGEgXCJ2YWx1ZVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtcGF0aFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVBhdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS13aWR0aFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVdpZHRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtaGVpZ2h0XCI6IChlKSAtPiBAbW9kZWwudXBkYXRlSGVpZ2h0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtc291cmNlXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlU291cmNlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtczMtYWNjZXNzLWtleVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVMzQWNjZXNzS2V5IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtczMtc2VjcmV0LWtleVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVMzU2VjcmV0S2V5IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtczMtYnVja2V0XCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUzNCdWNrZXQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS1zMy1wYXRoXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUzNQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQGRlc3Ryb3koKVxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPlxuICAgIEBtb2RhbENvbnRhaW4gc3RhdGVcbiAgICAoJCBcIkB0YWJzXCIpLnRhYnMoKVxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBAbW9kZWwuZ2V0U3RhdGUoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICB1cGRhdGVTdG9yYWdlOiAodmFsdWUpIC0+IEBzZXQgc3RvcmFnZTogdmFsdWVcblxuICB1cGRhdGVQYXRoOiAodmFsdWUpIC0+IEBzZXQgcGF0aDogdmFsdWVcbiAgdXBkYXRlV2lkdGg6ICh2YWx1ZSkgLT4gQHNldCB3aWR0aDogdmFsdWVcbiAgdXBkYXRlSGVpZ2h0OiAodmFsdWUpIC0+IEBzZXQgaGVpZ2h0OiB2YWx1ZVxuICB1cGRhdGVQcmV2aWV3V2lkdGg6ICh2YWx1ZSkgLT4gQHNldCBwcmV2aWV3V2lkdGg6IHZhbHVlXG4gIHVwZGF0ZVByZXZpZXdIZWlnaHQ6ICh2YWx1ZSkgLT4gQHNldCBwcmV2aWV3SGVpZ2h0OiB2YWx1ZVxuXG4gIHVwZGF0ZVMzQWNjZXNzS2V5OiAodmFsdWUpIC0+IEBzZXQgczNBY2Nlc3NLZXk6IHZhbHVlXG4gIHVwZGF0ZVMzU2VjcmV0S2V5OiAodmFsdWUpIC0+IEBzZXQgczNTZWNyZXRLZXk6IHZhbHVlXG4gIHVwZGF0ZVMzQnVja2V0OiAodmFsdWUpIC0+IEBzZXQgczNCdWNrZXQ6IHZhbHVlXG4gIHVwZGF0ZVMzUGF0aDogKHZhbHVlKSAtPiBAc2V0IHMzUGF0aDogdmFsdWVcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxubW9kYWxXaW5kb3dUZW1wbGF0ZSA9IHJlcXVpcmUgXCJ0eXBlcy9nYWxsZXJ5L21vZGFsLnRtcGwuanNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgaW5pdGlhbDogLT5cbiAgICBAbW9kYWxDb250YWluID0gUmVuZGVyIG1vZGFsV2luZG93VGVtcGxhdGUsIEBjb250YWluWzBdXG5cbiAgZXZlbnRzOlxuICAgIFwic3VibWl0OiBAY29uZmlncy1mb3JtXCI6IFwic3VibWl0Q29uZmlnc0Zvcm1cIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1nYWxsZXJ5LXBhdGhcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWdhbGxlcnktd2lkdGhcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVXaWR0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1nYWxsZXJ5LWhlaWdodFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZUhlaWdodCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1nYWxsZXJ5LXByZXZpZXctd2lkdGhcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVQcmV2aWV3V2lkdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1wcmV2aWV3LWhlaWdodFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVByZXZpZXdIZWlnaHQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1zdG9yYWdlXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlU3RvcmFnZSAoJCBlLnRhcmdldCkuZGF0YSBcInZhbHVlXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1zMy1hY2Nlc3Mta2V5XCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUzNBY2Nlc3NLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1zMy1zZWNyZXQta2V5XCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUzNTZWNyZXRLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1zMy1idWNrZXRcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVTM0J1Y2tldCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1nYWxsZXJ5LXMzLXBhdGhcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVTM1BhdGggZS50YXJnZXQudmFsdWVcbiAgICBcInBvcHVwLWNsb3NlOiBjb250YWluXCI6IChlKSAtPiBAZGVzdHJveSgpXG5cbiAgcmVuZGVyOiAoc3RhdGUpIC0+XG4gICAgQG1vZGFsQ29udGFpbiBzdGF0ZVxuICAgICgkIFwiQHRhYnNcIikudGFicygpXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIEBtb2RlbC5nZXRTdGF0ZSgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuaHR0cEdldCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cEdldFxuaHR0cFBvc3QgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBQb3N0XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgc2V0RmllbGRzOiAoZmllbGRzKSAtPlxuICAgIHNvdXJjZXMgPSBbXVxuICAgIGZvciBmaWVsZCwgaW5kZXggaW4gIGZpZWxkc1xuICAgICAgaWYgZmllbGQudHlwZSA9PSBcImltYWdlXCIgJiYgaW5kZXggIT0gQHN0YXRlLmluZGV4ICYmIGZpZWxkLmFsaWFzLmxlbmd0aFxuICAgICAgICBzb3VyY2VzLnB1c2ggYWxpYXM6IGZpZWxkLmFsaWFzLCBsYWJlbDogZmllbGQudGl0bGVcbiAgICBAc2V0IHtzb3VyY2VzfVxuXG4gIGluaXRpYWw6IC0+XG4gICAgQHRlc3RDb25uZWN0aW9uUzMoKVxuICAgIEBjaGVja1BhdGgoKVxuXG4gIHVwZGF0ZVN0b3JhZ2U6ICh2YWx1ZSkgLT5cbiAgICBAc2V0IHN0b3JhZ2U6IHZhbHVlXG4gICAgaWYgIUBzdGF0ZS5zM2F1dGhcbiAgICAgIEB0ZXN0Q29ubmVjdGlvblMzKClcblxuICB1cGRhdGVQYXRoOiAodmFsdWUpIC0+XG4gICAgQHNldCBwYXRoOiB2YWx1ZVxuICAgIEBjaGVja1BhdGgoKVxuXG4gIGNoZWNrUGF0aDogKCkgLT5cbiAgICBodHRwUG9zdCBcIi9jbXMvdHlwZXMvaW1hZ2UvY2hlY2twYXRoL19fanNvbi9cIixcbiAgICAgIHBhdGg6IEBzdGF0ZS5wYXRoXG4gICAgLnRoZW4gKHJlc3BvbnNlKSA9PlxuICAgICAgQHNldCBwYXRoRXJyb3I6IGZhbHNlXG4gICAgICBAc2V0IHBhdGhFcnJvcjogXCLQn9GD0YLRjCDQvdC1INC90LDQudC00LXQvVwiIGlmICFyZXNwb25zZS5leGlzdHNcbiAgICAgIEBzZXQgcGF0aEVycm9yOiBcItCf0LDQv9C60LAg0LfQsNC60YDRi9GC0LAg0L3QsCDQt9Cw0L/QuNGB0YxcIiBpZiAhcmVzcG9uc2Uud3JpdGVQZXJtaXNzaW9uXG4gICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIGNvbnNvbGUuZXJyb3IgZXJyb3JcblxuICByZXNldFBhdGg6IC0+IEBzZXQgcGF0aEVycm9yOiBmYWxzZVxuXG4gIHRlc3RDb25uZWN0aW9uUzM6IC0+XG4gICAgaWYgQHN0YXRlLnN0b3JhZ2UgPT0gXCJzM1wiICYmIEBzdGF0ZS5zM0FjY2Vzc0tleS5sZW5ndGggJiYgQHN0YXRlLnMzU2VjcmV0S2V5Lmxlbmd0aCAmJiAhQHN0YXRlLnMzYXV0aFxuICAgICAgQHNldCBzM2NoZWNraW5nOiB0cnVlXG4gICAgICBodHRwR2V0IFwiL2Ntcy90eXBlcy9pbWFnZS9jaGVjay1zMy1jb25uZWN0aW9uL19fanNvbi9cIixcbiAgICAgICAgYWNjZXNzS2V5OiBAc3RhdGUuczNBY2Nlc3NLZXlcbiAgICAgICAgc2VjcmV0S2V5OiBAc3RhdGUuczNTZWNyZXRLZXlcbiAgICAgIC50aGVuIChyZXNwb25zZSkgPT5cbiAgICAgICAgQHNldCBzM2F1dGg6IHJlc3BvbnNlLmF1dGhcbiAgICAgICAgaWYgcmVzcG9uc2UuYXV0aFxuICAgICAgICAgIGlmIEBzdGF0ZS5zM0J1Y2tldCBub3QgaW4gcmVzcG9uc2UuYnVja2V0c1xuICAgICAgICAgICAgQHNldCBzM0J1Y2tldDogcmVzcG9uc2UuYnVja2V0c1swXVxuICAgICAgICAgIEBzZXQgYnVja2V0czogcmVzcG9uc2UuYnVja2V0c1xuICAgICAgICBAc2V0IHMzY2hlY2tpbmc6IGZhbHNlXG4gICAgICAuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgICBAc2V0IHMzY2hlY2tpbmc6IGZhbHNlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgZXJyb3JcblxuICB1cGRhdGVTM0FjY2Vzc0tleTogKHZhbHVlKSAtPlxuICAgIGlmIEBzdGF0ZS5zM0FjY2Vzc0tleSAhPSB2YWx1ZVxuICAgICAgQHNldCBzM2F1dGg6IGZhbHNlXG4gICAgICBAc2V0IGJ1Y2tldHM6IGZhbHNlXG4gICAgQHNldCBzM0FjY2Vzc0tleTogdmFsdWVcblxuICB1cGRhdGVTM1NlY3JldEtleTogKHZhbHVlKSAtPlxuICAgIGlmIEBzdGF0ZS5zM1NlY3JldEtleSAhPSB2YWx1ZVxuICAgICAgQHNldCBzM2F1dGg6IGZhbHNlXG4gICAgICBAc2V0IGJ1Y2tldHM6IGZhbHNlXG4gICAgQHNldCBzM1NlY3JldEtleTogdmFsdWVcblxuICB1cGRhdGVTM0J1Y2tldDogKHZhbHVlKSAtPlxuICAgIEBzZXQgczNCdWNrZXQ6IHZhbHVlXG4gICAgQGNoZWNrUzNQYXRoKClcblxuICB1cGRhdGVTM1BhdGg6ICh2YWx1ZSkgLT5cbiAgICBpZiBAc3RhdGUuczNQYXRoICE9IHZhbHVlXG4gICAgICBAczNSZXNldFBhdGgoKVxuICAgICAgQHNldCBzM1BhdGg6IHZhbHVlXG4gICAgICBAY2hlY2tTM1BhdGgoKVxuXG4gIGNoZWNrUzNQYXRoOiAtPlxuICAgIGlmIEBzdGF0ZS5zM2F1dGhcbiAgICAgIGh0dHBHZXQgXCIvY21zL3R5cGVzL2ltYWdlL2NoZWNrLXMzLXBhdGgvX19qc29uL1wiLFxuICAgICAgICBwYXRoOiBAc3RhdGUuczNQYXRoXG4gICAgICAgIGFjY2Vzc0tleTogQHN0YXRlLnMzQWNjZXNzS2V5XG4gICAgICAgIHNlY3JldEtleTogQHN0YXRlLnMzU2VjcmV0S2V5XG4gICAgICAgIGJ1Y2tldDogQHN0YXRlLnMzQnVja2V0XG4gICAgICAudGhlbiAocmVzcG9uc2UpID0+XG4gICAgICAgIEBzZXQgczNQYXRoRXJyb3I6IGZhbHNlXG4gICAgICAgIEBzZXQgczNQYXRoRXJyb3I6IFwi0J/Rg9GC0Ywg0L3QtSDQvdCw0LnQtNC10L1cIiBpZiAhcmVzcG9uc2UuZXhpc3RzXG5cbiAgczNSZXNldFBhdGg6IC0+IEBzZXQgczNQYXRoRXJyb3I6IGZhbHNlXG5cbiAgdXBkYXRlV2lkdGg6ICh2YWx1ZSkgLT4gQHNldCB3aWR0aDogdmFsdWVcbiAgdXBkYXRlSGVpZ2h0OiAodmFsdWUpIC0+IEBzZXQgaGVpZ2h0OiB2YWx1ZVxuICB1cGRhdGVTb3VyY2U6ICh2YWx1ZSkgLT4gQHNldCBzb3VyY2U6IHZhbHVlXG5cbiAgZ2V0U3RhdGU6IC0+XG4gICAgQHN0YXRlXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxubW9kYWxXaW5kb3dUZW1wbGF0ZSA9IHJlcXVpcmUgXCJ0eXBlcy9pbWFnZS9tb2RhbC50bXBsLmpzXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGluaXRpYWw6IC0+XG4gICAgQG1vZGFsQ29udGFpbiA9IFJlbmRlciBtb2RhbFdpbmRvd1RlbXBsYXRlLCBAY29udGFpblswXVxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2Utc3RvcmFnZVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVN0b3JhZ2UgKCQgZS50YXJnZXQpLmRhdGEgXCJ2YWx1ZVwiXG4gICAgXCJrZXlkb3duOiBAY29uZmlncy1pbWFnZS1wYXRoXCI6IChlKSAtPiBAbW9kZWwucmVzZXRQYXRoKClcbiAgICBcImtleXVwIGlucHV0OiBAY29uZmlncy1pbWFnZS1wYXRoXCI6IChlKSAtPiAgQGZyZXF1ZW5jeSA1MDAsID0+IEBtb2RlbC51cGRhdGVQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXBhdGhcIjogKGUpIC0+ICBAbW9kZWwudXBkYXRlUGF0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlIGtleXVwIGlucHV0OiBAY29uZmlncy1pbWFnZS1zMy1hY2Nlc3Mta2V5XCI6IChlKSAtPiBAZnJlcXVlbmN5IDUwMCwgPT4gQG1vZGVsLnVwZGF0ZVMzQWNjZXNzS2V5IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2Uga2V5dXAgaW5wdXQ6IEBjb25maWdzLWltYWdlLXMzLXNlY3JldC1rZXlcIjogKGUpIC0+IEBmcmVxdWVuY3kgNTAwLCA9PiBAbW9kZWwudXBkYXRlUzNTZWNyZXRLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2UtczMtYnVja2V0XCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUzNCdWNrZXQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZSBrZXl1cCBpbnB1dDogQGNvbmZpZ3MtaW1hZ2UtczMtcGF0aFwiOiAoZSkgLT4gQGZyZXF1ZW5jeSA1MDAsID0+IEBtb2RlbC51cGRhdGVTM1BhdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2Utd2lkdGhcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVXaWR0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1oZWlnaHRcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVIZWlnaHQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2Utc291cmNlXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlU291cmNlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjbGljazogQHRlc3QtY29ubmVjdGlvbi1zM1wiOiAoZSkgLT4gQG1vZGVsLnRlc3RDb25uZWN0aW9uUzMoKVxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEBkZXN0cm95KClcbiAgICBcInBvcHVwLWNsb3NlOiBjb250YWluXCI6IChlKSAtPiBAZGVzdHJveSgpXG5cbiAgcmVuZGVyOiAoc3RhdGUpIC0+XG4gICAgQG1vZGFsQ29udGFpbiBzdGF0ZVxuICAgICgkIFwiQHRhYnNcIikudGFicygpXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIEBtb2RlbC5nZXRTdGF0ZSgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuXG4gIHVwZGF0ZU51bU9wdGlvbnM6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSA9IHBhcnNlSW50IHZhbHVlLCAxMFxuICAgIG51bU9wdHMgPSBwYXJzZUludCBAc3RhdGUubnVtT3B0aW9ucywgMTBcbiAgICBkZWZhdWx0VmFsdWUgPSBwYXJzZUludCBAc3RhdGUuZGVmYXVsdFZhbHVlLCAxMFxuICAgIGRlZmF1bHREYXRhID0gQHN0YXRlLmRlZmF1bHREYXRhLnNsaWNlKClcbiAgICBpZiB2YWx1ZSA+IG51bU9wdHNcbiAgICAgIGZvciBpIGluIFtudW1PcHRzICsgMS4udmFsdWVdXG4gICAgICAgIGRlZmF1bHREYXRhLnB1c2ggXCJcIlxuICAgIGVsc2VcbiAgICAgIGZvciBpIGluIFt2YWx1ZSArIDEuLm51bU9wdHNdXG4gICAgICAgIGRlZmF1bHREYXRhLnBvcCgpXG4gICAgICBpZiBkZWZhdWx0VmFsdWUgPj0gdmFsdWVcbiAgICAgICAgQHNldCB7ZGVmYXVsdFZhbHVlfVxuICAgIEBzZXQgbnVtT3B0aW9uczogdmFsdWVcbiAgICBAc2V0IHtkZWZhdWx0RGF0YX1cblxuICB1cGRhdGVEZWZhdWx0VmFsdWU6ICh2YWx1ZSkgLT4gQHNldCBkZWZhdWx0VmFsdWU6IHBhcnNlSW50IHZhbHVlLCAxMFxuXG4gIHVwZGF0ZURlZmF1bHREYXRhT3B0aW9uOiAoaW5kZXgsIHZhbHVlKSAtPlxuICAgIGRhdGEgPSBAc3RhdGUuZGVmYXVsdERhdGEuc2xpY2UoKVxuICAgIGRhdGFbaW5kZXhdID0gdmFsdWVcbiAgICBAc2V0IGRlZmF1bHREYXRhOiBkYXRhXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxubW9kYWxXaW5kb3dUZW1wbGF0ZSA9IHJlcXVpcmUgXCJ0eXBlcy9yYWRpby9tb2RhbC50bXBsLmpzXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGluaXRpYWw6IC0+XG4gICAgQG9wdGlvbnNDb250YWluID0gUmVuZGVyIG1vZGFsV2luZG93VGVtcGxhdGUsIEBjb250YWluWzBdXG5cbiAgZXZlbnRzOlxuICAgIFwic3VibWl0OiBAY29uZmlncy1mb3JtXCI6IFwic3VibWl0Q29uZmlnc0Zvcm1cIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1yYWRpby1udW0tb3B0aW9uc1wiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZU51bU9wdGlvbnMgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtcmFkaW8tb3B0aW9uXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlRGVmYXVsdFZhbHVlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLXJhZGlvLW9wdGlvbi1sYWJlbFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZURlZmF1bHREYXRhT3B0aW9uIChAZ2V0SW5kZXhCeUV2ZW50IGUpLCBlLnRhcmdldC52YWx1ZVxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEBkZXN0cm95KClcblxuICBnZXRJbmRleEJ5RXZlbnQ6IChlKSAtPlxuICAgICRpdGVtID0gJCBlLnRhcmdldFxuICAgICRpdGVtLmRhdGEgXCJpbmRleFwiXG5cbiAgcmVuZGVyOiAoc3RhdGUpIC0+XG4gICAgQG9wdGlvbnNDb250YWluIHN0YXRlXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIEBtb2RlbC5nZXRTdGF0ZSgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcblxuICB1cGRhdGVDb2x1bW5zOiAodmFsdWUpIC0+XG4gICAgdmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcbiAgICBpZiB2YWx1ZSA+IEBzdGF0ZS5jb2x1bW5zXG4gICAgICBmb3Igcm93IGluIEBzdGF0ZS5kZWZhdWx0RGF0YVxuICAgICAgICBmb3IgaSBpbiBbQHN0YXRlLmNvbHVtbnMgKyAxLi52YWx1ZV1cbiAgICAgICAgICByb3cucHVzaCBcIlwiXG4gICAgZWxzZSBpZiB2YWx1ZSA8IEBzdGF0ZS5jb2x1bW5zXG4gICAgICBmb3Igcm93IGluIEBzdGF0ZS5kZWZhdWx0RGF0YVxuICAgICAgICBmb3IgaSBpbiBbdmFsdWUgKyAxLi5Ac3RhdGUuY29sdW1uc11cbiAgICAgICAgICByb3cucG9wKClcbiAgICBAc2V0IGNvbHVtbnM6IHZhbHVlXG5cbiAgdXBkYXRlUm93czogKHZhbHVlKSAtPlxuICAgIHZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG4gICAgaWYgdmFsdWUgPiBAc3RhdGUucm93c1xuICAgICAgZm9yIHJvdyBpbiBbQHN0YXRlLnJvd3MgKyAxLi52YWx1ZV1cbiAgICAgICAgcm93ID0gW11cbiAgICAgICAgZm9yIGkgaW4gWzEuLkBzdGF0ZS5jb2x1bW5zXVxuICAgICAgICAgIHJvdy5wdXNoIFwiXCJcbiAgICAgICAgQHN0YXRlLmRlZmF1bHREYXRhLnB1c2ggcm93XG4gICAgZWxzZSBpZiB2YWx1ZSA8IEBzdGF0ZS5yb3dzXG4gICAgICBmb3Igcm93IGluIFt2YWx1ZSArIDEuLkBzdGF0ZS5yb3dzXVxuICAgICAgICBAc3RhdGUuZGVmYXVsdERhdGEucG9wKClcbiAgICBAc2V0IHJvd3M6IHZhbHVlXG5cbiAgdXBkYXRlQ2VsbERhdGE6IChyb3csIGNvbHVtbiwgdmFsdWUpIC0+XG4gICAgZGF0YSA9IEBzdGF0ZS5kZWZhdWx0RGF0YS5zbGljZSgpXG4gICAgZGF0YVtyb3ddW2NvbHVtbl0gPSB2YWx1ZVxuICAgIEBzZXQgZGVmYXVsdERhdGE6IGRhdGFcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlclwiXG5tb2RhbFdpbmRvd1RlbXBsYXRlID0gcmVxdWlyZSBcInR5cGVzL3RhYmxlL21vZGFsLnRtcGwuanNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgaW5pdGlhbDogLT5cbiAgICBAbW9kYWxDb250YWluID0gUmVuZGVyIG1vZGFsV2luZG93VGVtcGxhdGUsIEBjb250YWluWzBdXG5cbiAgZXZlbnRzOlxuICAgIFwic3VibWl0OiBAY29uZmlncy1mb3JtXCI6IFwic3VibWl0Q29uZmlnc0Zvcm1cIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy10YWJsZS1yb3dzXCI6IFwiY2hhbmdlQ29uZmlnc1RhYmxlUm93c1wiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLXRhYmxlLWNvbHVtbnNcIjogXCJjaGFuZ2VDb25maWdzVGFibGVDb2x1bW5zXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtdGFibGUtY2VsbFwiOiAoZSkgLT5cbiAgICAgICRjZWxsID0gJCBlLnRhcmdldFxuICAgICAgQG1vZGVsLnVwZGF0ZUNlbGxEYXRhICgkY2VsbC5kYXRhIFwicm93XCIpLCAoJGNlbGwuZGF0YSBcImNvbHVtblwiKSwgKCRjZWxsLnZhbCgpKVxuXG4gICAgXCJrZXlkb3duOiBAY29uZmlncy10YWJsZS1yb3dzXCI6IChlKSAtPlxuICAgICAgQGNoYW5nZUNvbmZpZ3NUYWJsZVJvd3MgZVxuICAgICAgaWYgZS5rZXlDb2RlID09IDEzIHRoZW4gZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBcImtleWRvd246IEBjb25maWdzLXRhYmxlLWNvbHVtbnNcIjogKGUpIC0+XG4gICAgICBAY2hhbmdlQ29uZmlnc1RhYmxlQ29sdW1ucyBlXG4gICAgICBpZiBlLmtleUNvZGUgPT0gMTMgdGhlbiBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEBkZXN0cm95KClcblxuICBjaGFuZ2VDb25maWdzVGFibGVSb3dzOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVJvd3MgZS50YXJnZXQudmFsdWVcbiAgY2hhbmdlQ29uZmlnc1RhYmxlQ29sdW1uczogKGUpIC0+IEBtb2RlbC51cGRhdGVDb2x1bW5zIGUudGFyZ2V0LnZhbHVlXG5cbiAgcmVuZGVyOiAoc3RhdGUpIC0+XG4gICAgQG1vZGFsQ29udGFpbiBzdGF0ZVxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBAbW9kZWwuZ2V0U3RhdGUoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiKGZ1bmN0aW9uIChmYWN0b3J5KVxue1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuICAgIGRlZmluZSgnZmlyc3QtdHJ5JywgW10sIGZhY3RvcnkoKSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgd2luZG93LnRhYmxlTW9kdWxlRmllbGRzID0gZmFjdG9yeSgpO1xuICB9XG59KShmdW5jdGlvbiAoKVxue1xuICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgX2NyRWwgPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICB9O1xuICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ3RleHQnLCB0ZXh0OiBub2RlfTtcbiAgfTtcbiAgZnVuY3Rpb24gY3JlYXRlKClcbiAge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgcm9vdE5vZGVzID0gW107XG4gICAgICBhcmd1bWVudHNbMF0ocm9vdE5vZGVzKTtcbiAgICAgIGlmIChyb290Tm9kZXMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoaW5kZXhBdHRyIGluIHJvb3ROb2Rlcykge1xuICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKHJvb3ROb2RlcywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICByb290Tm9kZXNbaW5kZXhBdHRyXSA9IF9jclROKHJvb3ROb2Rlc1tpbmRleEF0dHJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByb290Tm9kZXM7XG4gICAgfVxuICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgdmFyIHBhcmVudE5vZGU7XG4gICAgICB2YXIgaW5kZXhOb2RlO1xuICAgICAgdmFyIG5vZGU7XG4gICAgICB2YXIgaW5kZXhBdHRyO1xuICAgICAgdmFyIGF0dHI7XG4gICAgICB2YXIgYXR0cnMgPSBhcmd1bWVudHNbMV07XG4gICAgICBhcmd1bWVudHNbMl0obm9kZXMpO1xuICAgICAgcGFyZW50Tm9kZSA9IF9jckVsKGFyZ3VtZW50c1swXSk7XG4gICAgICBpZiAoYXR0cnMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoaW5kZXhBdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwoYXR0cnMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgIGF0dHIgPSBhdHRyc1tpbmRleEF0dHJdO1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5hdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgbmFtZTogYXR0clswXSxcbiAgICAgICAgICAgICAgdmFsdWU6IGF0dHJbMV1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChpbmRleE5vZGUgaW4gbm9kZXMpIHtcbiAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwobm9kZXMsIGluZGV4Tm9kZSkpIHtcbiAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhOb2RlXTtcbiAgICAgICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBub2RlID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIG5vZGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKF9jclROKG5vZGUpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgfVxuICB9XG4gIHZhciBjYWNoZWRUZW1wbGF0ZXMgPSB7fTtcbiAgZnVuY3Rpb24gY2FjaGVSZXF1aXJlVGVtcGxhdGUocGF0aCwgcmVxdWlyZWQpXG4gIHtcbiAgICBjYWNoZWRUZW1wbGF0ZXNbcGF0aF0gPSByZXF1aXJlZDtcbiAgfVxuICBmdW5jdGlvbiByZXF1aXJlVGVtcGxhdGUocGF0aCwgb2JqKVxuICB7XG4gICAgcmV0dXJuIGNhY2hlZFRlbXBsYXRlc1twYXRoXShvYmopO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAob2JqKVxuICB7XG4gICAgcmV0dXJuIGNyZWF0ZShmdW5jdGlvbiAoY2hpbGRzKVxuICAgIHtcbiAgICAgIHdpdGggKG9iaikge1xuICAgICAgICB2YXIgYXJyMSA9IGZpZWxkcztcbiAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gYXJyMSkgaWYgKF9oYXNQcm9wLmNhbGwoYXJyMSwgaW5kZXgpKSB7XG4gICAgICAgICAgZmllbGQgPSBhcnIxW2luZGV4XTtcbiAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtLXRhYmxlX19yb3cnO1xuICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgYXR0ciArPSBpbmRleDtcbiAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2RhdGEta2V5JywgYXR0cl0pO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndHInLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybS10YWJsZV9fY2VsbCc7XG4gICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19pbnAnO1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gZmllbGRbJ3RpdGxlJ107XG4gICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZmllbGQtdGl0bGUnO1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtLXRhYmxlX19jZWxsJztcbiAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2lucCc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBmaWVsZFsnYWxpYXMnXTtcbiAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmaWVsZC1hbGlhcyc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm0tdGFibGVfX2NlbGwnO1xuICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ3NlbGVjdCc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19zZWxlY3QnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZmllbGQtdHlwZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnc2VsZWN0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmhhc1NldHRpbmdzID0gZmFsc2U7ICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJyMiA9IHR5cGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB0eXBlIGluIGFycjIpIGlmIChfaGFzUHJvcC5jYWxsKGFycjIsIHR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA9IGFycjJbdHlwZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSB0eXBlWyd0eXBlJ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGZpZWxkWyd0eXBlJ10gPT0gdHlwZVsndHlwZSddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnc2VsZWN0ZWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ29wdGlvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKHR5cGVbJ25hbWUnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGZpZWxkWyd0eXBlJ10gPT0gdHlwZVsndHlwZSddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHR5cGVbJ2hhc1NldHRpbmdzJ10pIHtcbmhhc1NldHRpbmdzID0gdHJ1ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtLXRhYmxlX19jZWxsJztcbiAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgaWYgKCBoYXNTZXR0aW5ncykge1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fYnRuJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnYnV0dG9uJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdidG4tY29uZmlnLWZpZWxkJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goJ9CdJyk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm0tdGFibGVfX2NlbGwnO1xuICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoIGNvdW50KGZpZWxkcykgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19idG4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdidXR0b24nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2J0bi1yZW1vdmUtZmllbGQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgnWCcpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSk7IiwiKGZ1bmN0aW9uIChmYWN0b3J5KVxue1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuICAgIGRlZmluZSgnZmlyc3QtdHJ5JywgW10sIGZhY3RvcnkoKSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgd2luZG93Lm1vZGFsID0gZmFjdG9yeSgpO1xuICB9XG59KShmdW5jdGlvbiAoKVxue1xuICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgX2NyRWwgPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICB9O1xuICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ3RleHQnLCB0ZXh0OiBub2RlfTtcbiAgfTtcbiAgZnVuY3Rpb24gY3JlYXRlKClcbiAge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgcm9vdE5vZGVzID0gW107XG4gICAgICBhcmd1bWVudHNbMF0ocm9vdE5vZGVzKTtcbiAgICAgIGlmIChyb290Tm9kZXMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoaW5kZXhBdHRyIGluIHJvb3ROb2Rlcykge1xuICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKHJvb3ROb2RlcywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICByb290Tm9kZXNbaW5kZXhBdHRyXSA9IF9jclROKHJvb3ROb2Rlc1tpbmRleEF0dHJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByb290Tm9kZXM7XG4gICAgfVxuICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgdmFyIHBhcmVudE5vZGU7XG4gICAgICB2YXIgaW5kZXhOb2RlO1xuICAgICAgdmFyIG5vZGU7XG4gICAgICB2YXIgaW5kZXhBdHRyO1xuICAgICAgdmFyIGF0dHI7XG4gICAgICB2YXIgYXR0cnMgPSBhcmd1bWVudHNbMV07XG4gICAgICBhcmd1bWVudHNbMl0obm9kZXMpO1xuICAgICAgcGFyZW50Tm9kZSA9IF9jckVsKGFyZ3VtZW50c1swXSk7XG4gICAgICBpZiAoYXR0cnMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoaW5kZXhBdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwoYXR0cnMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgIGF0dHIgPSBhdHRyc1tpbmRleEF0dHJdO1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5hdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgbmFtZTogYXR0clswXSxcbiAgICAgICAgICAgICAgdmFsdWU6IGF0dHJbMV1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChpbmRleE5vZGUgaW4gbm9kZXMpIHtcbiAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwobm9kZXMsIGluZGV4Tm9kZSkpIHtcbiAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhOb2RlXTtcbiAgICAgICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBub2RlID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIG5vZGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKF9jclROKG5vZGUpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgfVxuICB9XG4gIHZhciBjYWNoZWRUZW1wbGF0ZXMgPSB7fTtcbiAgZnVuY3Rpb24gY2FjaGVSZXF1aXJlVGVtcGxhdGUocGF0aCwgcmVxdWlyZWQpXG4gIHtcbiAgICBjYWNoZWRUZW1wbGF0ZXNbcGF0aF0gPSByZXF1aXJlZDtcbiAgfVxuICBmdW5jdGlvbiByZXF1aXJlVGVtcGxhdGUocGF0aCwgb2JqKVxuICB7XG4gICAgcmV0dXJuIGNhY2hlZFRlbXBsYXRlc1twYXRoXShvYmopO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAob2JqKVxuICB7XG4gICAgcmV0dXJuIGNyZWF0ZShmdW5jdGlvbiAoY2hpbGRzKVxuICAgIHtcbiAgICAgIHdpdGggKG9iaikge1xuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgYXR0ciArPSAncG9wdXBfX2hlYWQnO1xuICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgY2hpbGRzLnB1c2goJ9Cd0LDRgdGC0YDQvtC50LrQuCDRhNC70LDQttC60L7QsicpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgIGF0dHJzLnB1c2goWydhY3Rpb24nLCBhdHRyXSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm0nO1xuICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWZvcm0nO1xuICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2Zvcm0nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19pdGVtJztcbiAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWNoZWNrYm94LW51bS1vcHRpb25zJztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19sYWJlbCc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goJ9Ca0L7Qu9C40YfQtdGB0YLQstC+INCy0LDRgNC40LDQvdGC0L7QsiDQvtGC0LLQtdGC0LAnKTtcbiAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IG51bU9wdGlvbnM7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtY2hlY2tib3gtbnVtLW9wdGlvbnMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtY2hlY2tib3gtbnVtLW9wdGlvbnMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0JLQsNGA0LjQsNC90YLRiyDQvtGC0LLQtdGC0L7QsjonKTtcbiAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluIGZvcm1fX2lucC1jb250YWluLS1mdWxsLXdpZHRoJztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtY2hlY2tib3gtb3B0aW9ucy1jb250YWluJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFycjAgPSBkZWZhdWx0RGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyMCkgaWYgKF9oYXNQcm9wLmNhbGwoYXJyMCwgaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uID0gYXJyMFtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX3Jvdy1vcHRpb24nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjaGVja2JveCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19jaGVja2JveCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1jaGVja2JveC1vcHRpb24nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnZGF0YS1pbmRleCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtY2hlY2tib3gtb3B0aW9uLSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtY2hlY2tib3gtb3B0aW9uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnbmFtZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBvcHRpb25bJ2NoZWNrZWQnXSA9PSB0cnVlIHx8IG9wdGlvblsnY2hlY2tlZCddID09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2hlY2tlZCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWNoZWNrYm94LW9wdGlvbi0nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fY2hlY2tib3gtbGFiZWwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLWhhbGYtd2lkdGgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBvcHRpb25bJ2xhYmVsJ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWNoZWNrYm94LW9wdGlvbi1sYWJlbCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2RhdGEtaW5kZXgnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX3N1Ym1pdCc7XG4gICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fYnRuIGZvcm1fX2J0bi0tc3VibWl0JztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goJ9Ch0L7RhdGA0LDQvdC40YLRjCcpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnYnV0dG9uJztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fYnRuIHBvcHVwX19jYW5jZWwnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0J7RgtC80LXQvdC40YLRjCcpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSk7IiwiKGZ1bmN0aW9uIChmYWN0b3J5KVxuICAgIHtcbiAgICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGRlZmluZSgnZmlyc3QtdHJ5JywgW10sIGZhY3RvcnkoKSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgd2luZG93Lm1vZGFsID0gZmFjdG9yeSgpO1xuICAgICAgfVxuICAgIH0pKGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgdmFyIF9oYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgICAgIHZhciBfY3JFbCA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICdub2RlJywgbmFtZTogbm9kZSwgYXR0cnM6IFtdLCBjaGlsZHM6IFtdfTtcbiAgICAgIH07XG4gICAgICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHt0eXBlOiAndGV4dCcsIHRleHQ6IG5vZGV9O1xuICAgICAgfTtcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZSgpXG4gICAgICB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgdmFyIHJvb3ROb2RlcyA9IFtdO1xuICAgICAgICAgIGFyZ3VtZW50c1swXShyb290Tm9kZXMpO1xuICAgICAgICAgIGlmIChyb290Tm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiByb290Tm9kZXMpIHtcbiAgICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwocm9vdE5vZGVzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgcm9vdE5vZGVzW2luZGV4QXR0cl0gPSBfY3JUTihyb290Tm9kZXNbaW5kZXhBdHRyXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByb290Tm9kZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICAgIHZhciBwYXJlbnROb2RlO1xuICAgICAgICAgIHZhciBpbmRleE5vZGU7XG4gICAgICAgICAgdmFyIG5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4QXR0cjtcbiAgICAgICAgICB2YXIgYXR0cjtcbiAgICAgICAgICB2YXIgYXR0cnMgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgYXJndW1lbnRzWzJdKG5vZGVzKTtcbiAgICAgICAgICBwYXJlbnROb2RlID0gX2NyRWwoYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICBpZiAoYXR0cnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiBhdHRycykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChhdHRycywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgICAgIGF0dHIgPSBhdHRyc1tpbmRleEF0dHJdO1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBhdHRyWzBdLFxuICAgICAgICAgICAgICAgICAgdmFsdWU6IGF0dHJbMV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGluZGV4Tm9kZSBpbiBub2Rlcykge1xuICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwobm9kZXMsIGluZGV4Tm9kZSkpIHtcbiAgICAgICAgICAgICAgbm9kZSA9IG5vZGVzW2luZGV4Tm9kZV07XG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIG5vZGUgPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKF9jclROKG5vZGUpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBwYXJlbnROb2RlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKG9iailcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZShmdW5jdGlvbiAoY2hpbGRzKVxuICAgICAgICB7d2l0aCAob2JqKSB7KGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdwb3B1cF9faGVhZCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cd0LDRgdGC0YDQvtC50LrQuCDRhNCw0LnQu9CwJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRycy5wdXNoKFsnYWN0aW9uJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZvcm0nO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdmb3JtJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0KXRgNCw0L3QuNC70LjRidC1Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnNfX2l0ZW0nO1xuaWYgKCBzdG9yYWdlID09IFwibG9jYWxcIikge1xuYXR0ciArPSAnIHRhYnNfX2l0ZW0tLWFjdGl2ZSc7XG59XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzIGNvbmZpZ3MtZmlsZS1zdG9yYWdlJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLW1vZGFsLXN0b3JhZ2UnO1xuYXR0cnMucHVzaChbJ2RhdGEtZ3JvdXAnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdsb2NhbCc7XG5hdHRycy5wdXNoKFsnZGF0YS12YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1tb2RhbC1zdG9yYWdlLWxvY2FsJztcbmF0dHJzLnB1c2goWydkYXRhLWZyYW1lJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQm9C+0LrQsNC70YzQvdC+0LUnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnNfX2l0ZW0nO1xuaWYgKCBzdG9yYWdlID09IFwiczNcIikge1xuYXR0ciArPSAnIHRhYnNfX2l0ZW0tLWFjdGl2ZSc7XG59XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzIGNvbmZpZ3MtZmlsZS1zdG9yYWdlJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLW1vZGFsLXN0b3JhZ2UnO1xuYXR0cnMucHVzaChbJ2RhdGEtZ3JvdXAnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdzMyc7XG5hdHRycy5wdXNoKFsnZGF0YS12YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1tb2RhbC1zdG9yYWdlLXMzJztcbmF0dHJzLnB1c2goWydkYXRhLWZyYW1lJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCdTMycpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLW1vZGFsLXN0b3JhZ2UtbG9jYWwgY29uZmlncy1maWxlLW1vZGFsLXN0b3JhZ2UtZnJhbWUnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuaWYgKCBzdG9yYWdlICE9IFwibG9jYWxcIikge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdkaXNwbGF5OiBub25lJztcbmF0dHJzLnB1c2goWydzdHlsZScsIGF0dHJdKTtcbn0pKCk7XG59XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXBhdGgnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQn9GD0YLRjCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHBhdGg7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtcGF0aCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1wYXRoJztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1tb2RhbC1zdG9yYWdlLXMzIGNvbmZpZ3MtZmlsZS1tb2RhbC1zdG9yYWdlLWZyYW1lJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmlmICggc3RvcmFnZSAhPSBcInMzXCIpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZGlzcGxheTogbm9uZSc7XG5hdHRycy5wdXNoKFsnc3R5bGUnLCBhdHRyXSk7XG59KSgpO1xufVxuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1hY2Nlc3Mta2V5JztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnQWNjZXNzIGtleScpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHMzQWNjZXNzS2V5O1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXMzLWFjY2Vzcy1rZXknO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtYWNjZXNzLWtleSc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXMzLXNlY3JldC1rZXknO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCdTZWNyZXQga2V5Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdwYXNzd29yZCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtc2VjcmV0LWtleSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1zZWNyZXQta2V5JztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtYnVja2V0JztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnQnVja2V0Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gczNCdWNrZXQ7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtYnVja2V0JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXMzLWJ1Y2tldCc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXMzLXBhdGgnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQn9GD0YLRjCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHMzUGF0aDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1wYXRoJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXMzLXBhdGgnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fc3VibWl0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2J0biBmb3JtX19idG4tLXN1Ym1pdCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Ch0L7RhdGA0LDQvdC40YLRjCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYnV0dG9uJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYnRuIHBvcHVwX19jYW5jZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQntGC0LzQtdC90LjRgtGMJyk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59fSl9O1xuICAgIH0pOyIsIihmdW5jdGlvbiAoZmFjdG9yeSlcbiAgICB7XG4gICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBkZWZpbmUoJ2ZpcnN0LXRyeScsIFtdLCBmYWN0b3J5KCkpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy5tb2RhbCA9IGZhY3RvcnkoKTtcbiAgICAgIH1cbiAgICB9KShmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgIHZhciBfaGFzUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gICAgICB2YXIgX2NyRWwgPSBmdW5jdGlvbiAobm9kZSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHt0eXBlOiAnbm9kZScsIG5hbWU6IG5vZGUsIGF0dHJzOiBbXSwgY2hpbGRzOiBbXX07XG4gICAgICB9O1xuICAgICAgdmFyIF9jclROID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ3RleHQnLCB0ZXh0OiBub2RlfTtcbiAgICAgIH07XG4gICAgICBmdW5jdGlvbiBjcmVhdGUoKVxuICAgICAge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHZhciByb290Tm9kZXMgPSBbXTtcbiAgICAgICAgICBhcmd1bWVudHNbMF0ocm9vdE5vZGVzKTtcbiAgICAgICAgICBpZiAocm9vdE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gcm9vdE5vZGVzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKHJvb3ROb2RlcywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdzdHJpbmcnIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgIHJvb3ROb2Rlc1tpbmRleEF0dHJdID0gX2NyVE4ocm9vdE5vZGVzW2luZGV4QXR0cl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcm9vdE5vZGVzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgICAgICB2YXIgcGFyZW50Tm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhOb2RlO1xuICAgICAgICAgIHZhciBub2RlO1xuICAgICAgICAgIHZhciBpbmRleEF0dHI7XG4gICAgICAgICAgdmFyIGF0dHI7XG4gICAgICAgICAgdmFyIGF0dHJzID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgIGFyZ3VtZW50c1syXShub2Rlcyk7XG4gICAgICAgICAgcGFyZW50Tm9kZSA9IF9jckVsKGFyZ3VtZW50c1swXSk7XG4gICAgICAgICAgaWYgKGF0dHJzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gYXR0cnMpIHtcbiAgICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwoYXR0cnMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBhdHRyID0gYXR0cnNbaW5kZXhBdHRyXTtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmF0dHJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgbmFtZTogYXR0clswXSxcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiBhdHRyWzFdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChpbmRleE5vZGUgaW4gbm9kZXMpIHtcbiAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKG5vZGVzLCBpbmRleE5vZGUpKSB7XG4gICAgICAgICAgICAgIG5vZGUgPSBub2Rlc1tpbmRleE5vZGVdO1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBub2RlID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIG5vZGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChfY3JUTihub2RlKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvYmopXG4gICAgICB7XG4gICAgICAgIHJldHVybiBjcmVhdGUoZnVuY3Rpb24gKGNoaWxkcylcbiAgICAgICAge3dpdGggKG9iaikgeyhmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAncG9wdXBfX2hlYWQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQndCw0YHRgtGA0L7QudC60Lgg0LPQsNC70LXRgNC10LgnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHJzLnB1c2goWydhY3Rpb24nLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZm9ybSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2Zvcm0nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQpdGA0LDQvdC40LvQuNGJ0LUnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnMnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYnV0dG9uJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFic19faXRlbSc7XG5pZiAoIHN0b3JhZ2UgPT0gXCJsb2NhbFwiKSB7XG5hdHRyICs9ICcgdGFic19faXRlbS0tYWN0aXZlJztcbn1cbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnMgY29uZmlncy1nYWxsZXJ5LXN0b3JhZ2UnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktbW9kYWwtc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsnZGF0YS1ncm91cCcsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2xvY2FsJztcbmF0dHJzLnB1c2goWydkYXRhLXZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LW1vZGFsLXN0b3JhZ2UtbG9jYWwnO1xuYXR0cnMucHVzaChbJ2RhdGEtZnJhbWUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cb0L7QutCw0LvRjNC90L7QtScpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYnV0dG9uJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFic19faXRlbSc7XG5pZiAoIHN0b3JhZ2UgPT0gXCJzM1wiKSB7XG5hdHRyICs9ICcgdGFic19faXRlbS0tYWN0aXZlJztcbn1cbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnMgY29uZmlncy1nYWxsZXJ5LXN0b3JhZ2UnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktbW9kYWwtc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsnZGF0YS1ncm91cCcsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3MzJztcbmF0dHJzLnB1c2goWydkYXRhLXZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LW1vZGFsLXN0b3JhZ2UtczMnO1xuYXR0cnMucHVzaChbJ2RhdGEtZnJhbWUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ1MzJyk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktbW9kYWwtc3RvcmFnZS1sb2NhbCBjb25maWdzLWdhbGxlcnktbW9kYWwtc3RvcmFnZS1mcmFtZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5pZiAoIHN0b3JhZ2UgIT0gXCJsb2NhbFwiKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Rpc3BsYXk6IG5vbmUnO1xuYXR0cnMucHVzaChbJ3N0eWxlJywgYXR0cl0pO1xufSkoKTtcbn1cbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktcGF0aCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cf0YPRgtGMJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gcGF0aDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1wYXRoJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXBhdGgnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LW1vZGFsLXN0b3JhZ2UtczMgY29uZmlncy1nYWxsZXJ5LW1vZGFsLXN0b3JhZ2UtZnJhbWUnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuaWYgKCBzdG9yYWdlICE9IFwiczNcIikge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdkaXNwbGF5OiBub25lJztcbmF0dHJzLnB1c2goWydzdHlsZScsIGF0dHJdKTtcbn0pKCk7XG59XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXMzLWFjY2Vzcy1rZXknO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCdBY2Nlc3Mga2V5Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gczNBY2Nlc3NLZXk7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktczMtYWNjZXNzLWtleSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1hY2Nlc3Mta2V5JztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktczMtc2VjcmV0LWtleSc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ1NlY3JldCBrZXknKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3Bhc3N3b3JkJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1zZWNyZXQta2V5JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXMzLXNlY3JldC1rZXknO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1idWNrZXQnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCdCdWNrZXQnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBzM0J1Y2tldDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1idWNrZXQnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktczMtYnVja2V0JztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktczMtcGF0aCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cf0YPRgtGMJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gczNQYXRoO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXMzLXBhdGgnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktczMtcGF0aCc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS13aWR0aCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cj0LzQtdC90YzRiNC40YLRjCDQvtGA0LjQs9C40L3QsNC7INC00L4g0YDQsNC30LzQtdGA0LAnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluIGZvcm1fX2lucC1jb250YWluLS1mdWxsLXdpZHRoJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS12ZXJ5LXNob3J0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gd2lkdGg7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktd2lkdGgnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktd2lkdGgnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYmV0d2Vlbi1pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnc3BhbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnw5cnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS12ZXJ5LXNob3J0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gaGVpZ2h0O1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LWhlaWdodCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2hpbnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQldGB0LvQuCDQvdC1INC30LDQtNCw0YLRjCDQt9C90LDRh9C10L3QuNC1LCDQvtC90L4g0LHRg9C00LXRgiDQstGL0YfQuNGB0LvQtdC90L4g0L/RgNC+0L/QvtGA0YbQuNC+0L3QsNC70YzQvdC+Jyk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXdpZHRoJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0KDQsNC30LzQtdGAINC/0YDQtdCy0YzRjicpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4gZm9ybV9faW5wLWNvbnRhaW4tLWZ1bGwtd2lkdGgnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBwcmV2aWV3V2lkdGg7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktcHJldmlldy13aWR0aCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS13aWR0aCc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19iZXR3ZWVuLWlucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdzcGFuJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfDlycpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBwcmV2aWV3SGVpZ2h0O1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXByZXZpZXctaGVpZ2h0JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faGludCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9CV0YHQu9C4INC90LUg0LfQsNC00LDRgtGMINC30L3QsNGH0LXQvdC40LUsINC+0L3QviDQsdGD0LTQtdGCINCy0YvRh9C40YHQu9C10L3QviDQv9GA0L7Qv9C+0YDRhtC40L7QvdCw0LvRjNC90L4nKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fc3VibWl0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2J0biBmb3JtX19idG4tLXN1Ym1pdCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Ch0L7RhdGA0LDQvdC40YLRjCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYnV0dG9uJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYnRuIHBvcHVwX19jYW5jZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQntGC0LzQtdC90LjRgtGMJyk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59fSl9O1xuICAgIH0pOyIsIihmdW5jdGlvbiAoZmFjdG9yeSlcbntcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkZWZpbmUoJ2ZpcnN0LXRyeScsIFtdLCBmYWN0b3J5KCkpO1xuICB9XG4gIGVsc2Uge1xuICAgIHdpbmRvdy5tb2RhbCA9IGZhY3RvcnkoKTtcbiAgfVxufSkoZnVuY3Rpb24gKClcbntcbiAgdmFyIF9oYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIF9jckVsID0gZnVuY3Rpb24gKG5vZGUpXG4gIHtcbiAgICByZXR1cm4ge3R5cGU6ICdub2RlJywgbmFtZTogbm9kZSwgYXR0cnM6IFtdLCBjaGlsZHM6IFtdfTtcbiAgfTtcbiAgdmFyIF9jclROID0gZnVuY3Rpb24gKG5vZGUpXG4gIHtcbiAgICByZXR1cm4ge3R5cGU6ICd0ZXh0JywgdGV4dDogbm9kZX07XG4gIH07XG4gIGZ1bmN0aW9uIGNvdW50KGFycilcbiAge1xuICAgIHJldHVybiBhcnIubGVuZ3RoO1xuICB9XG4gIGZ1bmN0aW9uIGxlbmd0aChzdHIpXG4gIHtcbiAgICByZXR1cm4gc3RyLmxlbmd0aDtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGUoKVxuICB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciByb290Tm9kZXMgPSBbXTtcbiAgICAgIGFyZ3VtZW50c1swXShyb290Tm9kZXMpO1xuICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gcm9vdE5vZGVzKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwocm9vdE5vZGVzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgIHJvb3ROb2Rlc1tpbmRleEF0dHJdID0gX2NyVE4ocm9vdE5vZGVzW2luZGV4QXR0cl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICB9XG4gICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICB2YXIgcGFyZW50Tm9kZTtcbiAgICAgIHZhciBpbmRleE5vZGU7XG4gICAgICB2YXIgbm9kZTtcbiAgICAgIHZhciBpbmRleEF0dHI7XG4gICAgICB2YXIgYXR0cjtcbiAgICAgIHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGFyZ3VtZW50c1syXShub2Rlcyk7XG4gICAgICBwYXJlbnROb2RlID0gX2NyRWwoYXJndW1lbnRzWzBdKTtcbiAgICAgIGlmIChhdHRycy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gYXR0cnMpIHtcbiAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChhdHRycywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2luZGV4QXR0cl07XG4gICAgICAgICAgICBwYXJlbnROb2RlLmF0dHJzLnB1c2goe1xuICAgICAgICAgICAgICBuYW1lOiBhdHRyWzBdLFxuICAgICAgICAgICAgICB2YWx1ZTogYXR0clsxXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGluZGV4Tm9kZSBpbiBub2Rlcykge1xuICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChub2RlcywgaW5kZXhOb2RlKSkge1xuICAgICAgICAgIG5vZGUgPSBub2Rlc1tpbmRleE5vZGVdO1xuICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIG5vZGUgPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2goX2NyVE4obm9kZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2gobm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyZW50Tm9kZTtcbiAgICB9XG4gIH1cbiAgdmFyIGNhY2hlZFRlbXBsYXRlcyA9IHt9O1xuICBmdW5jdGlvbiBjYWNoZVJlcXVpcmVUZW1wbGF0ZShwYXRoLCByZXF1aXJlZClcbiAge1xuICAgIGNhY2hlZFRlbXBsYXRlc1twYXRoXSA9IHJlcXVpcmVkO1xuICB9XG4gIGZ1bmN0aW9uIHJlcXVpcmVUZW1wbGF0ZShwYXRoLCBvYmopXG4gIHtcbiAgICByZXR1cm4gY2FjaGVkVGVtcGxhdGVzW3BhdGhdKG9iaik7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChvYmopXG4gIHtcbiAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAge1xuICAgICAgd2l0aCAob2JqKSB7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICBhdHRyICs9ICdwb3B1cF9faGVhZCc7XG4gICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICBjaGlsZHMucHVzaCgn0J3QsNGB0YLRgNC+0LnQutC4INC40LfQvtCx0YDQsNC20LXQvdC40Y8nKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHZhciBpc0VtcHR5ID0gIShsZW5ndGgoczNBY2Nlc3NLZXkpKSB8fCAhKGxlbmd0aChzM1NlY3JldEtleSkpO1xuICAgICAgICB2YXIgaXNTM0F1dGggPSAgdHlwZW9mIHMzYXV0aCAhPT0gJ3VuZGVmaW5lZCcgPyBzM2F1dGggOiAnJyAgJiYgKHMzYXV0aCA9PSB0cnVlIHx8IHMzYXV0aCA9PSBcInRydWVcIik7XG4gICAgICAgIHZhciBpc1MzQ2hlY2tpbmcgPSAgdHlwZW9mIHMzY2hlY2tpbmcgIT09ICd1bmRlZmluZWQnID8gczNjaGVja2luZyA6ICcnICAmJiAoczNjaGVja2luZyA9PSB0cnVlIHx8IHMzY2hlY2tpbmcgPT0gXCJ0cnVlXCIpO1xuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgYXR0cnMucHVzaChbJ2FjdGlvbicsIGF0dHJdKTtcbiAgICAgICAgICB9KSgpO1xuICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgYXR0ciArPSAnZm9ybSc7XG4gICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtZm9ybSc7XG4gICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICB9KSgpO1xuICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZm9ybScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0KXRgNCw0L3QuNC70LjRidC1Jyk7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICd0YWJzJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnYnV0dG9uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ3RhYnNfX2l0ZW0nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggc3RvcmFnZSA9PSBcImxvY2FsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJyB0YWJzX19pdGVtLS1hY3RpdmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICd0YWJzIGNvbmZpZ3MtaW1hZ2Utc3RvcmFnZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWltYWdlLW1vZGFsLXN0b3JhZ2UnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydkYXRhLWdyb3VwJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnbG9jYWwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydkYXRhLXZhbHVlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLWxvY2FsJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnZGF0YS1mcmFtZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCfQm9C+0LrQsNC70YzQvdC+0LUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnYnV0dG9uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ3RhYnNfX2l0ZW0nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggc3RvcmFnZSA9PSBcInMzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJyB0YWJzX19pdGVtLS1hY3RpdmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICd0YWJzIGNvbmZpZ3MtaW1hZ2Utc3RvcmFnZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWltYWdlLW1vZGFsLXN0b3JhZ2UnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydkYXRhLWdyb3VwJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnczMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydkYXRhLXZhbHVlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLXMzJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnZGF0YS1mcmFtZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCdTMycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWltYWdlLW1vZGFsLXN0b3JhZ2UtbG9jYWwgY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLWZyYW1lJztcbiAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgaWYgKCBzdG9yYWdlICE9IFwibG9jYWxcIikge1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZGlzcGxheTogbm9uZSc7XG4gICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnc3R5bGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faXRlbSc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWltYWdlLXBhdGgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0J/Rg9GC0YwnKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IHBhdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1pbWFnZS1wYXRoJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtcGF0aCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIHR5cGVvZiBwYXRoRXJyb3IgIT09ICd1bmRlZmluZWQnID8gcGF0aEVycm9yIDogJycgICYmIChwYXRoRXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19lcnJvcic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ3NwYW4nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2gocGF0aEVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtbW9kYWwtc3RvcmFnZS1zMyBjb25maWdzLWltYWdlLW1vZGFsLXN0b3JhZ2UtZnJhbWUnO1xuICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICBpZiAoIHN0b3JhZ2UgIT0gXCJzM1wiKSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICBhdHRyICs9ICdkaXNwbGF5OiBub25lJztcbiAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydzdHlsZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19pdGVtJztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYWNjZXNzLWtleSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19sYWJlbCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCdBY2Nlc3Mga2V5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2lucCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAgdHlwZW9mIHMzQWNjZXNzS2V5ICE9PSAndW5kZWZpbmVkJyA/IHMzQWNjZXNzS2V5IDogJycgO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYWNjZXNzLWtleSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWltYWdlLXMzLWFjY2Vzcy1rZXknO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faXRlbSc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWltYWdlLXMzLXNlY3JldC1rZXknO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgnU2VjcmV0IGtleScpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAncGFzc3dvcmQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWltYWdlLXMzLXNlY3JldC1rZXknO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1pbWFnZS1zMy1zZWNyZXQta2V5JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdidXR0b24nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fYnRuJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICd0ZXN0LWNvbm5lY3Rpb24tczMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGlzRW1wdHkgfHwgaXNTM0F1dGggfHwgaXNTM0NoZWNraW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnZGlzYWJsZWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBpc1MzQ2hlY2tpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCdcXG4gICAgICAgICAg0KHQvtC10LTQuNC90LXQvdC40LUuLi5cXG4gICAgICAgICAgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggaXNTM0F1dGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goJ1xcbiAgICAgICAgICDQk9C+0YLQvtCy0L5cXG4gICAgICAgICAgICAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCdcXG4gICAgICAgICAg0J/QvtC00LrQu9GO0YfQuNGC0YzRgdGPXFxuICAgICAgICAgICAgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIGlmICggaXNTM0F1dGggPT0gXCJ0cnVlXCIgfHwgaXNTM0F1dGggPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19pdGVtJztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWltYWdlLXMzLWJ1Y2tldCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCdCdWNrZXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAgdHlwZW9mIGJ1Y2tldHMgIT09ICd1bmRlZmluZWQnID8gYnVja2V0cyA6ICcnICAmJiBjb3VudChidWNrZXRzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ3NlbGVjdCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYnVja2V0JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWltYWdlLXMzLWJ1Y2tldCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ3NlbGVjdCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJyMCA9IGJ1Y2tldHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBidWNrZXQgaW4gYXJyMCkgaWYgKF9oYXNQcm9wLmNhbGwoYXJyMCwgYnVja2V0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWNrZXQgPSBhcnIwW2J1Y2tldF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IGJ1Y2tldDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggISghKCB0eXBlb2YgczNCdWNrZXQgIT09ICd1bmRlZmluZWQnID8gczNCdWNrZXQgOiAnJyApKSAmJiAoczNCdWNrZXQgPT0gYnVja2V0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3NlbGVjdGVkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdvcHRpb24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goYnVja2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2lucCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICB0eXBlb2YgczNCdWNrZXQgIT09ICd1bmRlZmluZWQnID8gczNCdWNrZXQgOiAnJyA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWltYWdlLXMzLWJ1Y2tldCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYnVja2V0JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19pdGVtJztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWltYWdlLXMzLXBhdGgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0J/Rg9GC0YwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ3RleHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2lucCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gIHR5cGVvZiBzM1BhdGggIT09ICd1bmRlZmluZWQnID8gczNQYXRoIDogJycgO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWltYWdlLXMzLXBhdGgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtcGF0aCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIHR5cGVvZiBzM1BhdGhFcnJvciAhPT0gJ3VuZGVmaW5lZCcgPyBzM1BhdGhFcnJvciA6ICcnICAmJiAoczNQYXRoRXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fZXJyb3InO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdzcGFuJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goczNQYXRoRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faXRlbSc7XG4gICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1pbWFnZS13aWR0aCc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCfQo9C80LXQvdGM0YjQuNGC0Ywg0LTQviDRgNCw0LfQvNC10YDQsCcpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4gZm9ybV9faW5wLWNvbnRhaW4tLWZ1bGwtd2lkdGgnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gIHR5cGVvZiB3aWR0aCAhPT0gJ3VuZGVmaW5lZCcgPyB3aWR0aCA6ICcnIDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1pbWFnZS13aWR0aCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1pbWFnZS13aWR0aCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19iZXR3ZWVuLWlucCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ3NwYW4nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goJ8OXJyk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gIHR5cGVvZiBoZWlnaHQgIT09ICd1bmRlZmluZWQnID8gaGVpZ2h0IDogJycgO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWltYWdlLWhlaWdodCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2hpbnQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goJ9CV0YHQu9C4INC90LUg0LfQsNC00LDRgtGMINC30L3QsNGH0LXQvdC40LUsINC+0L3QviDQsdGD0LTQtdGCINCy0YvRh9C40YHQu9C10L3QviDQv9GA0L7Qv9C+0YDRhtC40L7QvdCw0LvRjNC90L4nKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faXRlbSc7XG4gICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1pbWFnZS1zb3VyY2UnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0JjRgdGC0L7Rh9C90LjQuicpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnc2VsZWN0JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWltYWdlLXNvdXJjZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLWltYWdlLXNvdXJjZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ3NlbGVjdCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAndXBsb2FkJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggc291cmNlID09IFwidXBsb2FkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydzZWxlY3RlZCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnb3B0aW9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goJ9CX0LDQs9GA0YPQt9C40YLRjCDQuNC30L7QsdGA0LDQttC10L3QuNC1Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoICB0eXBlb2Ygc291cmNlcyAhPT0gJ3VuZGVmaW5lZCcgPyBzb3VyY2VzIDogJycgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJyMSA9IHNvdXJjZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBzb3VyY2VJdGVtIGluIGFycjEpIGlmIChfaGFzUHJvcC5jYWxsKGFycjEsIHNvdXJjZUl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUl0ZW0gPSBhcnIxW3NvdXJjZUl0ZW1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBzb3VyY2VJdGVtWydhbGlhcyddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBzb3VyY2UgPT0gc291cmNlSXRlbVsnYWxpYXMnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3NlbGVjdGVkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdvcHRpb24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goc291cmNlSXRlbVsnbGFiZWwnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fc3VibWl0JztcbiAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19idG4gZm9ybV9fYnRuLS1zdWJtaXQnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgaWYgKCAoc3RvcmFnZSA9PSBcImxvY2FsXCIgJiYgKCB0eXBlb2YgcGF0aEVycm9yICE9PSAndW5kZWZpbmVkJyA/IHBhdGhFcnJvciA6ICcnICAmJiBwYXRoRXJyb3IpKSB8fCAoc3RvcmFnZSA9PSBcInMzXCIgJiYgKCEoaXNTM0F1dGgpKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydkaXNhYmxlZCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goJ9Ch0L7RhdGA0LDQvdC40YLRjCcpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnYnV0dG9uJztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fYnRuIHBvcHVwX19jYW5jZWwnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0J7RgtC80LXQvdC40YLRjCcpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSk7IiwiKGZ1bmN0aW9uIChmYWN0b3J5KVxue1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuICAgIGRlZmluZSgnZmlyc3QtdHJ5JywgW10sIGZhY3RvcnkoKSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgd2luZG93Lm1vZGFsID0gZmFjdG9yeSgpO1xuICB9XG59KShmdW5jdGlvbiAoKVxue1xuICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgX2NyRWwgPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICB9O1xuICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ3RleHQnLCB0ZXh0OiBub2RlfTtcbiAgfTtcbiAgZnVuY3Rpb24gY3JlYXRlKClcbiAge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgcm9vdE5vZGVzID0gW107XG4gICAgICBhcmd1bWVudHNbMF0ocm9vdE5vZGVzKTtcbiAgICAgIGlmIChyb290Tm9kZXMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoaW5kZXhBdHRyIGluIHJvb3ROb2Rlcykge1xuICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKHJvb3ROb2RlcywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICByb290Tm9kZXNbaW5kZXhBdHRyXSA9IF9jclROKHJvb3ROb2Rlc1tpbmRleEF0dHJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByb290Tm9kZXM7XG4gICAgfVxuICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgdmFyIHBhcmVudE5vZGU7XG4gICAgICB2YXIgaW5kZXhOb2RlO1xuICAgICAgdmFyIG5vZGU7XG4gICAgICB2YXIgaW5kZXhBdHRyO1xuICAgICAgdmFyIGF0dHI7XG4gICAgICB2YXIgYXR0cnMgPSBhcmd1bWVudHNbMV07XG4gICAgICBhcmd1bWVudHNbMl0obm9kZXMpO1xuICAgICAgcGFyZW50Tm9kZSA9IF9jckVsKGFyZ3VtZW50c1swXSk7XG4gICAgICBpZiAoYXR0cnMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoaW5kZXhBdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwoYXR0cnMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgIGF0dHIgPSBhdHRyc1tpbmRleEF0dHJdO1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5hdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgbmFtZTogYXR0clswXSxcbiAgICAgICAgICAgICAgdmFsdWU6IGF0dHJbMV1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChpbmRleE5vZGUgaW4gbm9kZXMpIHtcbiAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwobm9kZXMsIGluZGV4Tm9kZSkpIHtcbiAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhOb2RlXTtcbiAgICAgICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBub2RlID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIG5vZGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKF9jclROKG5vZGUpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgfVxuICB9XG4gIHZhciBjYWNoZWRUZW1wbGF0ZXMgPSB7fTtcbiAgZnVuY3Rpb24gY2FjaGVSZXF1aXJlVGVtcGxhdGUocGF0aCwgcmVxdWlyZWQpXG4gIHtcbiAgICBjYWNoZWRUZW1wbGF0ZXNbcGF0aF0gPSByZXF1aXJlZDtcbiAgfVxuICBmdW5jdGlvbiByZXF1aXJlVGVtcGxhdGUocGF0aCwgb2JqKVxuICB7XG4gICAgcmV0dXJuIGNhY2hlZFRlbXBsYXRlc1twYXRoXShvYmopO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAob2JqKVxuICB7XG4gICAgcmV0dXJuIGNyZWF0ZShmdW5jdGlvbiAoY2hpbGRzKVxuICAgIHtcbiAgICAgIHdpdGggKG9iaikge1xuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgYXR0ciArPSAncG9wdXBfX2hlYWQnO1xuICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgY2hpbGRzLnB1c2goJ9Cd0LDRgdGC0YDQvtC50LrQuCDQv9C10YDQtdC60LvRjtGH0LDRgtC10LvQtdC5Jyk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KSgpO1xuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgYXR0cnMucHVzaChbJ2FjdGlvbicsIGF0dHJdKTtcbiAgICAgICAgICB9KSgpO1xuICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgYXR0ciArPSAnZm9ybSc7XG4gICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtZm9ybSc7XG4gICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICB9KSgpO1xuICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZm9ybScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tbnVtLW9wdGlvbnMnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0JrQvtC70LjRh9C10YHRgtCy0L4g0LLQsNGA0LjQsNC90YLQvtCyINC+0YLQstC10YLQsCcpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gbnVtT3B0aW9ucztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1yYWRpby1udW0tb3B0aW9ucyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1yYWRpby1udW0tb3B0aW9ucyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faXRlbSc7XG4gICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCfQktCw0YDQuNCw0L3RgtGLINC+0YLQstC10YLQvtCyOicpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4gZm9ybV9faW5wLWNvbnRhaW4tLWZ1bGwtd2lkdGgnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fcm93LW9wdGlvbic7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ3JhZGlvJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX3JhZGlvJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICctMSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1yYWRpby1vcHRpb24tLTEnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnbmFtZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBkZWZhdWx0VmFsdWUgPT0gLTEgfHwgZGVmYXVsdFZhbHVlID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2hlY2tlZCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19yYWRpby1sYWJlbCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY29uZmlncy1yYWRpby1vcHRpb24tLTEnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbi0tMSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdpJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goJ9Cd0LjRh9C10LPQviDQvdC1INCy0YvQsdGA0LDQvdC+INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbnMtY29udGFpbic7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcnIxID0gZGVmYXVsdERhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGFycjEpIGlmIChfaGFzUHJvcC5jYWxsKGFycjEsIGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbiA9IGFycjFbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19yb3ctb3B0aW9uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAncmFkaW8nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fcmFkaW8nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbi0nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ25hbWUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggZGVmYXVsdFZhbHVlID09IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjaGVja2VkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX3JhZGlvLWxhYmVsJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbi0nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICd0ZXh0JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0taGFsZi13aWR0aCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IG9wdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uLWxhYmVsJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnZGF0YS1pbmRleCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fc3VibWl0JztcbiAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19idG4gZm9ybV9fYnRuLS1zdWJtaXQnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0KHQvtGF0YDQsNC90LjRgtGMJyk7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdidXR0b24nO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19idG4gcG9wdXBfX2NhbmNlbCc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCfQntGC0LzQtdC90LjRgtGMJyk7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG4gICAge1xuICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cubW9kYWwgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgfSkoZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICAgICAgdmFyIF9jckVsID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICAgICAgfTtcbiAgICAgIHZhciBfY3JUTiA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICd0ZXh0JywgdGV4dDogbm9kZX07XG4gICAgICB9O1xuICAgICAgZnVuY3Rpb24gY3JlYXRlKClcbiAgICAgIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICB2YXIgcm9vdE5vZGVzID0gW107XG4gICAgICAgICAgYXJndW1lbnRzWzBdKHJvb3ROb2Rlcyk7XG4gICAgICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIHJvb3ROb2Rlcykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChyb290Tm9kZXMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICByb290Tm9kZXNbaW5kZXhBdHRyXSA9IF9jclROKHJvb3ROb2Rlc1tpbmRleEF0dHJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgICAgdmFyIHBhcmVudE5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4Tm9kZTtcbiAgICAgICAgICB2YXIgbm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhBdHRyO1xuICAgICAgICAgIHZhciBhdHRyO1xuICAgICAgICAgIHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICBhcmd1bWVudHNbMl0obm9kZXMpO1xuICAgICAgICAgIHBhcmVudE5vZGUgPSBfY3JFbChhcmd1bWVudHNbMF0pO1xuICAgICAgICAgIGlmIChhdHRycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKGF0dHJzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2luZGV4QXR0cl07XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5hdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IGF0dHJbMF0sXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogYXR0clsxXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAoaW5kZXhOb2RlIGluIG5vZGVzKSB7XG4gICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChub2RlcywgaW5kZXhOb2RlKSkge1xuICAgICAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhOb2RlXTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2goX2NyVE4obm9kZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqKVxuICAgICAge1xuICAgICAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAgICAgIHt3aXRoIChvYmopIHsoZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3BvcHVwX19oZWFkJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J3QsNGB0YLRgNC+0LnQutC4INGC0LDQsdC70LjRhtGLJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRycy5wdXNoKFsnYWN0aW9uJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZvcm0nO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdmb3JtJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXRhYmxlLWNvbHVtbnMnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQmtC+0LvQvtC90L7QuiDQv9C+INGD0LzQvtC70YfQsNC90LjRjicpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBjb2x1bW5zO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy10YWJsZS1jb2x1bW5zJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy10YWJsZS1jb2x1bW5zJztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXRhYmxlLXJvd3MnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQodGC0YDQvtC6INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHJvd3M7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXRhYmxlLXJvd3MnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXRhYmxlLXJvd3MnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtdGFibGUtcm93cyc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Co0LDQsdC70L7QvSDQv9C+INGD0LzQvtC70YfQsNC90LjRjicpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4gZm9ybV9faW5wLWNvbnRhaW4tLWZ1bGwtd2lkdGggZm9ybV9faW5wLWNvbnRhaW4tLXNjcm9sbC13cmFwJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYmxlIHRhYmxlLS1zdHJhaWdodC1zaWRlcyB0YWJsZS0tcmVzcG9uc2l2ZSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0YWJsZScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtdGFibGUtdGJvZHknO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0Ym9keScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG52YXIgYXJyOCA9IGRlZmF1bHREYXRhOyBmb3IgKHJvd0luZGV4IGluIGFycjgpIGlmIChfaGFzUHJvcC5jYWxsKGFycjgsIHJvd0luZGV4KSkge1xucm93ID0gYXJyOFtyb3dJbmRleF07XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG5jaGlsZHMucHVzaChjcmVhdGUoJ3RyJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbnZhciBhcnI5ID0gcm93OyBmb3IgKGNvbHVtbkluZGV4IGluIGFycjkpIGlmIChfaGFzUHJvcC5jYWxsKGFycjksIGNvbHVtbkluZGV4KSkge1xuY29sdW1uID0gYXJyOVtjb2x1bW5JbmRleF07XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG5jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBjb2x1bW47XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXRhYmxlLWNlbGwnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHJvd0luZGV4O1xuYXR0cnMucHVzaChbJ2RhdGEtcm93JywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBjb2x1bW5JbmRleDtcbmF0dHJzLnB1c2goWydkYXRhLWNvbHVtbicsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufX0pKTtcbn0pKCk7XG59fSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fc3VibWl0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2J0biBmb3JtX19idG4tLXN1Ym1pdCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Ch0L7RhdGA0LDQvdC40YLRjCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYnV0dG9uJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYnRuIHBvcHVwX19jYW5jZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQntGC0LzQtdC90LjRgtGMJyk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59fSl9O1xuICAgIH0pOyJdfQ==
