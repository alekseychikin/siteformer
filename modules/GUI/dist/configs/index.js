(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var IndexModel, IndexView, SectionsMenuView, indexModel;

IndexModel = require("./indexModel.coffee");

indexModel = IndexModel();

IndexView = require("./indexView.coffee");

SectionsMenuView = require("./sectionsMenuView.coffee");

IndexView($("@sections"), indexModel);

SectionsMenuView($("@sections-menu"), indexModel);


},{"./indexModel.coffee":2,"./indexView.coffee":3,"./sectionsMenuView.coffee":4}],2:[function(require,module,exports){
var Model, httpGet, httpPost;

Model = require("model.coffee");

httpGet = (require("ajax.coffee")).httpGet;

httpPost = (require("ajax.coffee")).httpPost;

module.exports = Model({
  initialState: function() {
    return httpGet(window.location.pathname + "__json/");
  },
  setCheck: function(index, checked) {
    var sections;
    index = parseInt(index, 10);
    sections = this.state.sections.slice();
    sections[index].checked = checked;
    return this.set({
      sections: sections
    });
  },
  checkAll: function(checked) {
    var i, len, section, sections;
    sections = this.state.sections.slice();
    for (i = 0, len = sections.length; i < len; i++) {
      section = sections[i];
      section.checked = checked;
    }
    return this.set({
      sections: sections
    });
  },
  removeSubmit: function() {
    var deleteSections, i, len, section, sections, sourceSections;
    sourceSections = this.state.sections.slice();
    sections = [];
    deleteSections = [];
    for (i = 0, len = sourceSections.length; i < len; i++) {
      section = sourceSections[i];
      if ((section.checked == null) || !section.checked) {
        sections.push(section);
      } else {
        deleteSections.push(section.id);
      }
    }
    httpPost(window.location.pathname + "action_delete/__json/", {
      deleteSections: deleteSections
    })["catch"]((function(_this) {
      return function(response) {
        console.error(response.error);
        return _this.set({
          sections: sourceSections
        });
      };
    })(this));
    return this.set({
      sections: sections
    });
  }
});


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee"}],3:[function(require,module,exports){
var Render, View, sectionsTemplate;

View = require("view.coffee");

sectionsTemplate = require("sections/configs/table-sections-list.tmpl.js");

Render = require("render");

module.exports = View({
  initial: function() {
    return this.templateList = Render(sectionsTemplate, this.contain[0]);
  },
  events: {
    "change: @check-item": function(e) {
      return this.model.setCheck(($(e.target)).closest("@section-row").attr("data-id"), e.target.checked);
    },
    "change: @cbeck-all": function(e) {
      return this.model.checkAll(e.target.checked);
    },
    "submit: @bottom-form": function(e) {
      this.model.removeSubmit();
      return false;
    }
  },
  render: function(state) {
    return this.templateList(state);
  }
});


},{"render":"render","sections/configs/table-sections-list.tmpl.js":6,"view.coffee":"view.coffee"}],4:[function(require,module,exports){
var Render, View, menuTemplate;

Render = require("render");

View = require("view.coffee");

menuTemplate = require("components/menu/menu-items.tmpl.js");

module.exports = View({
  initial: function() {
    return this.menuTemplate = Render(menuTemplate, this.contain[0]);
  },
  render: function(state) {
    return this.menuTemplate(state);
  }
});


},{"components/menu/menu-items.tmpl.js":5,"render":"render","view.coffee":"view.coffee"}],5:[function(require,module,exports){
(function (factory)
{
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  }
  else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define('first-try', [], factory());
  }
  else {
    window.menuItems = factory();
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
  var cloneElements = [];
  function clone(obj)
  {
    cloneElements = [];
    var copy = null;
    var elem;
    var attr;
    var i;

    if (null == obj || "object" != typeof obj) {
      return obj;
    }

    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    if (cloneElements.indexOf(obj) == -1) {
      cloneElements.push(obj);
      if (obj instanceof Array) {
        copy = [];
        for (i in obj) {
          if (_hasProp.call(obj, i)) {
            elem = obj[i];
            copy[i] = clone(elem);
          }
        }
        return copy;
      }
      if (obj instanceof Object) {
        copy = {};
        for (i in obj) {
          if (_hasProp.call(obj, i)) {
            attr = obj[i];
            copy[i] = clone(attr);
          }
        }
        return copy;
      }
    }
  }
  function create()
  {
    var indexAttr;

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
  if (typeof window.__cachedTemplates === 'undefined') {
    window.__cachedTemplates = {};
  }
  function cacheRequireTemplate(path, required)
  {
    window.__cachedTemplates[path] = required;
  }
  function requireTemplate(path, obj)
  {
    return window.__cachedTemplates[path](obj);
  }
  return function (obj)
  {
    return create(function (childs)
    {
      with (obj) {
                    var arr9 = sections;
                    for (var sectionsItem in arr9) if (_hasProp.call(arr9, sectionsItem)) {
                      sectionsItem = arr9[sectionsItem];
                      (function () {
                        var attrs = [];
                        (function () {
                          var attr = '';
                          attr += 'menu__item';
                          if ( section == sectionsItem['alias']) {
                            attr += ' menu__item--active';
                          }
                          attrs.push(['class', attr]);
                        })();
                        childs.push(create('li', attrs, function (childs) {
                          (function () {
                            var attrs = [];
                            (function () {
                              var attr = '';
                              attr += '/cms/';
                              attr += sectionsItem['alias'];
                              attr += '/';
                              attrs.push(['href', attr]);
                            })();
                            (function () {
                              var attr = '';
                              attr += 'menu__link';
                              attrs.push(['class', attr]);
                            })();
                            childs.push(create('a', attrs, function (childs) {
                              childs.push(sectionsItem['title']);
                            }));
                          })();
                        }));
                      })();
                    }
      }
    });
  };
});
},{}],6:[function(require,module,exports){
(function (factory)
{
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  }
  else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define('first-try', [], factory());
  }
  else {
    window.tableSectionsList = factory();
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
  var cloneElements = [];
  function clone(obj)
  {
    cloneElements = [];
    var copy = null;
    var elem;
    var attr;
    var i;

    if (null == obj || "object" != typeof obj) {
      return obj;
    }

    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    if (cloneElements.indexOf(obj) == -1) {
      cloneElements.push(obj);
      if (obj instanceof Array) {
        copy = [];
        for (i in obj) {
          if (_hasProp.call(obj, i)) {
            elem = obj[i];
            copy[i] = clone(elem);
          }
        }
        return copy;
      }
      if (obj instanceof Object) {
        copy = {};
        for (i in obj) {
          if (_hasProp.call(obj, i)) {
            attr = obj[i];
            copy[i] = clone(attr);
          }
        }
        return copy;
      }
    }
  }
  function create()
  {
    var indexAttr;

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
  if (typeof window.__cachedTemplates === 'undefined') {
    window.__cachedTemplates = {};
  }
  function cacheRequireTemplate(path, required)
  {
    window.__cachedTemplates[path] = required;
  }
  function requireTemplate(path, obj)
  {
    return window.__cachedTemplates[path](obj);
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
                        attr += 'section__row';
                        attrs.push(['class', attr]);
                      })();
                      childs.push(create('div', attrs, function (childs) {
                        (function () {
                          var attrs = [];
                          (function () {
                            var attr = '';
                            attr += '/cms/configs/add/';
                            attrs.push(['href', attr]);
                          })();
                          (function () {
                            var attr = '';
                            attr += 'form__btn';
                            attrs.push(['class', attr]);
                          })();
                          childs.push(create('a', attrs, function (childs) {
                            childs.push('Добавить раздел');
                          }));
                        })();
                      }));
                    })();
                    (function () {
                      var attrs = [];
                      (function () {
                        var attr = '';
                        attr += 'section__row';
                        attrs.push(['class', attr]);
                      })();
                      (function () {
                        var attr = '';
                        attr += 'section-list';
                        attrs.push(['role', attr]);
                      })();
                      childs.push(create('div', attrs, function (childs) {
                        obj.checkedItems = 0;
                        (function () {
                          var attrs = [];
                          (function () {
                            var attr = '';
                            attr += 'table';
                            attrs.push(['class', attr]);
                          })();
                          childs.push(create('table', attrs, function (childs) {
                            (function () {
                              var attrs = [];
                              childs.push(create('colgroup', attrs, function (childs) {
                                (function () {
                                  var attrs = [];
                                  (function () {
                                    var attr = '';
                                    attr += '20';
                                    attrs.push(['width', attr]);
                                  })();
                                  childs.push(create('col', attrs, function (childs) {
                                  }));
                                })();
                                (function () {
                                  var attrs = [];
                                  (function () {
                                    var attr = '';
                                    attr += '*';
                                    attrs.push(['width', attr]);
                                  })();
                                  childs.push(create('col', attrs, function (childs) {
                                  }));
                                })();
                                (function () {
                                  var attrs = [];
                                  (function () {
                                    var attr = '';
                                    attr += '*';
                                    attrs.push(['width', attr]);
                                  })();
                                  childs.push(create('col', attrs, function (childs) {
                                  }));
                                })();
                                (function () {
                                  var attrs = [];
                                  (function () {
                                    var attr = '';
                                    attr += '*';
                                    attrs.push(['width', attr]);
                                  })();
                                  childs.push(create('col', attrs, function (childs) {
                                  }));
                                })();
                              }));
                            })();
                            (function () {
                              var attrs = [];
                              childs.push(create('thead', attrs, function (childs) {
                                (function () {
                                  var attrs = [];
                                  childs.push(create('tr', attrs, function (childs) {
                                    (function () {
                                      var attrs = [];
                                      childs.push(create('td', attrs, function (childs) {
                                        (function () {
                                          var attrs = [];
                                          (function () {
                                            var attr = '';
                                            attr += 'form__checkbox';
                                            attrs.push(['class', attr]);
                                          })();
                                          (function () {
                                            var attr = '';
                                            attr += 'checkbox';
                                            attrs.push(['type', attr]);
                                          })();
                                          (function () {
                                            var attr = '';
                                            attr += 'checkall';
                                            attrs.push(['id', attr]);
                                          })();
                                          (function () {
                                            var attr = '';
                                            attr += 'cbeck-all';
                                            attrs.push(['role', attr]);
                                          })();
                                          childs.push(create('input', attrs, function (childs) {
                                          }));
                                        })();
                                        (function () {
                                          var attrs = [];
                                          (function () {
                                            var attr = '';
                                            attr += 'form__checkbox-label';
                                            attrs.push(['class', attr]);
                                          })();
                                          (function () {
                                            var attr = '';
                                            attr += 'checkall';
                                            attrs.push(['for', attr]);
                                          })();
                                          childs.push(create('label', attrs, function (childs) {
                                          }));
                                        })();
                                      }));
                                    })();
                                    (function () {
                                      var attrs = [];
                                      childs.push(create('td', attrs, function (childs) {
                                        childs.push('Название');
                                      }));
                                    })();
                                    (function () {
                                      var attrs = [];
                                      childs.push(create('td', attrs, function (childs) {
                                        childs.push('Веб-имя');
                                      }));
                                    })();
                                    (function () {
                                      var attrs = [];
                                      childs.push(create('td', attrs, function (childs) {
                                        childs.push('Модуль');
                                      }));
                                    })();
                                  }));
                                })();
                              }));
                            })();
                            (function () {
                              var attrs = [];
                              childs.push(create('tbody', attrs, function (childs) {
                                var arr13 = sections;
                                for (var i in arr13) if (_hasProp.call(arr13, i)) {
                                  sectionsItem = arr13[i];
                                  if ( ( typeof sectionsItem['checked'] != 'undefined' ? sectionsItem['checked'] : '') && (sectionsItem['checked'] == "true" || sectionsItem['checked'] == true)) {
                                    obj.checkedItems = checkedItems + 1;
                                  }
                                  (function () {
                                    var attrs = [];
                                    (function () {
                                      var attr = '';
                                      attr += 'table__link';
                                      attrs.push(['class', attr]);
                                    })();
                                    (function () {
                                      var attr = '';
                                      attr += 'section-row';
                                      attrs.push(['role', attr]);
                                    })();
                                    (function () {
                                      var attr = '';
                                      attr += i;
                                      attrs.push(['data-id', attr]);
                                    })();
                                    childs.push(create('tr', attrs, function (childs) {
                                      (function () {
                                        var attrs = [];
                                        childs.push(create('td', attrs, function (childs) {
                                          (function () {
                                            var attrs = [];
                                            (function () {
                                              var attr = '';
                                              attr += 'form__checkbox';
                                              attrs.push(['class', attr]);
                                            })();
                                            (function () {
                                              var attr = '';
                                              attr += 'checkbox';
                                              attrs.push(['type', attr]);
                                            })();
                                            (function () {
                                              var attr = '';
                                              attr += 'check';
                                              attr += sectionsItem['id'];
                                              attrs.push(['id', attr]);
                                            })();
                                            (function () {
                                              var attr = '';
                                              attr += 'check-item';
                                              attrs.push(['role', attr]);
                                            })();
                                            if ( ( typeof sectionsItem['checked'] != 'undefined' ? sectionsItem['checked'] : '') && (sectionsItem['checked'] == "true" || sectionsItem['checked'] == true)) {
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
                                              attr += 'form__checkbox-label';
                                              attrs.push(['class', attr]);
                                            })();
                                            (function () {
                                              var attr = '';
                                              attr += 'check';
                                              attr += sectionsItem['id'];
                                              attrs.push(['for', attr]);
                                            })();
                                            childs.push(create('label', attrs, function (childs) {
                                            }));
                                          })();
                                        }));
                                      })();
                                      (function () {
                                        var attrs = [];
                                        childs.push(create('td', attrs, function (childs) {
                                          (function () {
                                            var attrs = [];
                                            (function () {
                                              var attr = '';
                                              attr += '/cms/configs/';
                                              attr += sectionsItem['alias'];
                                              attr += '/';
                                              attrs.push(['href', attr]);
                                            })();
                                            childs.push(create('a', attrs, function (childs) {
                                              childs.push(sectionsItem['title']);
                                            }));
                                          })();
                                        }));
                                      })();
                                      (function () {
                                        var attrs = [];
                                        childs.push(create('td', attrs, function (childs) {
                                          (function () {
                                            var attrs = [];
                                            (function () {
                                              var attr = '';
                                              attr += '/cms/configs/';
                                              attr += sectionsItem['alias'];
                                              attr += '/';
                                              attrs.push(['href', attr]);
                                            })();
                                            childs.push(create('a', attrs, function (childs) {
                                              childs.push(sectionsItem['alias']);
                                            }));
                                          })();
                                        }));
                                      })();
                                      (function () {
                                        var attrs = [];
                                        childs.push(create('td', attrs, function (childs) {
                                          (function () {
                                            var attrs = [];
                                            (function () {
                                              var attr = '';
                                              attr += '/cms/configs/';
                                              attr += sectionsItem['alias'];
                                              attr += '/';
                                              attrs.push(['href', attr]);
                                            })();
                                            childs.push(create('a', attrs, function (childs) {
                                              childs.push(sectionsItem['module']);
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
                        attr += 'section__row';
                        attrs.push(['class', attr]);
                      })();
                      childs.push(create('div', attrs, function (childs) {
                        (function () {
                          var attrs = [];
                          (function () {
                            var attr = '';
                            attrs.push(['action', attr]);
                          })();
                          (function () {
                            var attr = '';
                            attr += 'bottom-form';
                            attrs.push(['role', attr]);
                          })();
                          childs.push(create('form', attrs, function (childs) {
                            (function () {
                              var attrs = [];
                              (function () {
                                var attr = '';
                                attr += 'form__btn';
                                attrs.push(['class', attr]);
                              })();
                              (function () {
                                var attr = '';
                                attr += 'submit';
                                attrs.push(['type', attr]);
                              })();
                              if ( checkedItems == 0) {
                                (function () {
                                  var attr = '';
                                  attrs.push(['disabled', attr]);
                                })();
                              }
                              childs.push(create('button', attrs, function (childs) {
                                childs.push('Удалить');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2luZGV4LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvaW5kZXhNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2luZGV4Vmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL3NlY3Rpb25zTWVudVZpZXcuY29mZmVlIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvY29tcG9uZW50cy9tZW51L21lbnUtaXRlbXMudG1wbC5qcyIsInRlbXAvbW9kdWxlcy9HVUkvLmNvbXBpbGVfdGVtcGxhdGVzL3NlY3Rpb25zL2NvbmZpZ3MvdGFibGUtc2VjdGlvbnMtbGlzdC50bXBsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLHFCQUFSOztBQUNiLFVBQUEsR0FBYSxVQUFBLENBQUE7O0FBQ2IsU0FBQSxHQUFZLE9BQUEsQ0FBUSxvQkFBUjs7QUFDWixnQkFBQSxHQUFtQixPQUFBLENBQVEsMkJBQVI7O0FBRW5CLFNBQUEsQ0FBVyxDQUFBLENBQUUsV0FBRixDQUFYLEVBQTJCLFVBQTNCOztBQUNBLGdCQUFBLENBQWtCLENBQUEsQ0FBRSxnQkFBRixDQUFsQixFQUF1QyxVQUF2Qzs7OztBQ05BLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSOztBQUNSLE9BQUEsR0FBVSxDQUFDLE9BQUEsQ0FBUSxhQUFSLENBQUQsQ0FBdUIsQ0FBQzs7QUFDbEMsUUFBQSxHQUFXLENBQUMsT0FBQSxDQUFRLGFBQVIsQ0FBRCxDQUF1QixDQUFDOztBQUVuQyxNQUFNLENBQUMsT0FBUCxHQUFpQixLQUFBLENBQ2Y7RUFBQSxZQUFB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiSW5kZXhNb2RlbCA9IHJlcXVpcmUgXCIuL2luZGV4TW9kZWwuY29mZmVlXCJcbmluZGV4TW9kZWwgPSBJbmRleE1vZGVsKClcbkluZGV4VmlldyA9IHJlcXVpcmUgXCIuL2luZGV4Vmlldy5jb2ZmZWVcIlxuU2VjdGlvbnNNZW51VmlldyA9IHJlcXVpcmUgXCIuL3NlY3Rpb25zTWVudVZpZXcuY29mZmVlXCJcblxuSW5kZXhWaWV3ICgkIFwiQHNlY3Rpb25zXCIpLCBpbmRleE1vZGVsXG5TZWN0aW9uc01lbnVWaWV3ICgkIFwiQHNlY3Rpb25zLW1lbnVcIiksIGluZGV4TW9kZWxcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5odHRwR2V0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwR2V0XG5odHRwUG9zdCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cFBvc3RcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBpbml0aWFsU3RhdGU6IC0+XG4gICAgaHR0cEdldCBcIiN7d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lfV9fanNvbi9cIlxuXG4gIHNldENoZWNrOiAoaW5kZXgsIGNoZWNrZWQpIC0+XG4gICAgaW5kZXggPSBwYXJzZUludCBpbmRleCwgMTBcbiAgICBzZWN0aW9ucyA9IEBzdGF0ZS5zZWN0aW9ucy5zbGljZSgpXG4gICAgc2VjdGlvbnNbaW5kZXhdLmNoZWNrZWQgPSBjaGVja2VkXG4gICAgQHNldCBzZWN0aW9uczogc2VjdGlvbnNcblxuICBjaGVja0FsbDogKGNoZWNrZWQpIC0+XG4gICAgc2VjdGlvbnMgPSBAc3RhdGUuc2VjdGlvbnMuc2xpY2UoKVxuICAgIGZvciBzZWN0aW9uIGluIHNlY3Rpb25zXG4gICAgICBzZWN0aW9uLmNoZWNrZWQgPSBjaGVja2VkXG4gICAgQHNldCBzZWN0aW9uczogc2VjdGlvbnNcblxuICByZW1vdmVTdWJtaXQ6IC0+XG4gICAgc291cmNlU2VjdGlvbnMgPSBAc3RhdGUuc2VjdGlvbnMuc2xpY2UoKVxuICAgIHNlY3Rpb25zID0gW11cbiAgICBkZWxldGVTZWN0aW9ucyA9IFtdXG4gICAgZm9yIHNlY3Rpb24gaW4gc291cmNlU2VjdGlvbnNcbiAgICAgIGlmICFzZWN0aW9uLmNoZWNrZWQ/IHx8ICFzZWN0aW9uLmNoZWNrZWRcbiAgICAgICAgc2VjdGlvbnMucHVzaCBzZWN0aW9uXG4gICAgICBlbHNlXG4gICAgICAgIGRlbGV0ZVNlY3Rpb25zLnB1c2ggc2VjdGlvbi5pZFxuICAgIGh0dHBQb3N0IFwiI3t3aW5kb3cubG9jYXRpb24ucGF0aG5hbWV9YWN0aW9uX2RlbGV0ZS9fX2pzb24vXCIsIHtkZWxldGVTZWN0aW9uc31cbiAgICAuY2F0Y2ggKHJlc3BvbnNlKSA9PlxuICAgICAgY29uc29sZS5lcnJvciByZXNwb25zZS5lcnJvclxuICAgICAgQHNldCBzZWN0aW9uczogc291cmNlU2VjdGlvbnNcbiAgICBAc2V0IHNlY3Rpb25zOiBzZWN0aW9uc1xuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5zZWN0aW9uc1RlbXBsYXRlID0gcmVxdWlyZSBcInNlY3Rpb25zL2NvbmZpZ3MvdGFibGUtc2VjdGlvbnMtbGlzdC50bXBsLmpzXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgaW5pdGlhbDogLT5cbiAgICBAdGVtcGxhdGVMaXN0ID0gUmVuZGVyIHNlY3Rpb25zVGVtcGxhdGUsIEBjb250YWluWzBdXG5cbiAgZXZlbnRzOlxuICAgIFwiY2hhbmdlOiBAY2hlY2staXRlbVwiOiAoZSkgLT5cbiAgICAgIEBtb2RlbC5zZXRDaGVjayAoJCBlLnRhcmdldCkuY2xvc2VzdChcIkBzZWN0aW9uLXJvd1wiKS5hdHRyKFwiZGF0YS1pZFwiKSwgZS50YXJnZXQuY2hlY2tlZFxuICAgIFwiY2hhbmdlOiBAY2JlY2stYWxsXCI6IChlKSAtPlxuICAgICAgQG1vZGVsLmNoZWNrQWxsIGUudGFyZ2V0LmNoZWNrZWRcbiAgICBcInN1Ym1pdDogQGJvdHRvbS1mb3JtXCI6IChlKSAtPlxuICAgICAgQG1vZGVsLnJlbW92ZVN1Ym1pdCgpXG4gICAgICBmYWxzZVxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPiBAdGVtcGxhdGVMaXN0IHN0YXRlXG4iLCJSZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcblZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxubWVudVRlbXBsYXRlID0gcmVxdWlyZSBcImNvbXBvbmVudHMvbWVudS9tZW51LWl0ZW1zLnRtcGwuanNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgaW5pdGlhbDogLT4gQG1lbnVUZW1wbGF0ZSA9IFJlbmRlciBtZW51VGVtcGxhdGUsIEBjb250YWluWzBdXG4gIHJlbmRlcjogKHN0YXRlKSAtPiBAbWVudVRlbXBsYXRlIHN0YXRlXG4iLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG57XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgfVxuICBlbHNlIHtcbiAgICB3aW5kb3cubWVudUl0ZW1zID0gZmFjdG9yeSgpO1xuICB9XG59KShmdW5jdGlvbiAoKVxue1xuICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgX2NyRWwgPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICB9O1xuICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ3RleHQnLCB0ZXh0OiBub2RlfTtcbiAgfTtcbiAgZnVuY3Rpb24gY291bnQoYXJyKVxuICB7XG4gICAgcmV0dXJuIGFyci5sZW5ndGg7XG4gIH1cbiAgZnVuY3Rpb24gbGVuZ3RoKHN0cilcbiAge1xuICAgIHJldHVybiBzdHIubGVuZ3RoO1xuICB9XG4gIHZhciBjbG9uZUVsZW1lbnRzID0gW107XG4gIGZ1bmN0aW9uIGNsb25lKG9iailcbiAge1xuICAgIGNsb25lRWxlbWVudHMgPSBbXTtcbiAgICB2YXIgY29weSA9IG51bGw7XG4gICAgdmFyIGVsZW07XG4gICAgdmFyIGF0dHI7XG4gICAgdmFyIGk7XG5cbiAgICBpZiAobnVsbCA9PSBvYmogfHwgXCJvYmplY3RcIiAhPSB0eXBlb2Ygb2JqKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIGlmIChvYmogaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICBjb3B5ID0gbmV3IERhdGUoKTtcbiAgICAgIGNvcHkuc2V0VGltZShvYmouZ2V0VGltZSgpKTtcbiAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cbiAgICBpZiAoY2xvbmVFbGVtZW50cy5pbmRleE9mKG9iaikgPT0gLTEpIHtcbiAgICAgIGNsb25lRWxlbWVudHMucHVzaChvYmopO1xuICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIGNvcHkgPSBbXTtcbiAgICAgICAgZm9yIChpIGluIG9iaikge1xuICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKG9iaiwgaSkpIHtcbiAgICAgICAgICAgIGVsZW0gPSBvYmpbaV07XG4gICAgICAgICAgICBjb3B5W2ldID0gY2xvbmUoZWxlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgICAgfVxuICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICBjb3B5ID0ge307XG4gICAgICAgIGZvciAoaSBpbiBvYmopIHtcbiAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChvYmosIGkpKSB7XG4gICAgICAgICAgICBhdHRyID0gb2JqW2ldO1xuICAgICAgICAgICAgY29weVtpXSA9IGNsb25lKGF0dHIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlKClcbiAge1xuICAgIHZhciBpbmRleEF0dHI7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIHJvb3ROb2RlcyA9IFtdO1xuICAgICAgYXJndW1lbnRzWzBdKHJvb3ROb2Rlcyk7XG4gICAgICBpZiAocm9vdE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiByb290Tm9kZXMpIHtcbiAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChyb290Tm9kZXMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdzdHJpbmcnIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgcm9vdE5vZGVzW2luZGV4QXR0cl0gPSBfY3JUTihyb290Tm9kZXNbaW5kZXhBdHRyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcm9vdE5vZGVzO1xuICAgIH1cbiAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgIHZhciBwYXJlbnROb2RlO1xuICAgICAgdmFyIGluZGV4Tm9kZTtcbiAgICAgIHZhciBub2RlO1xuICAgICAgdmFyIGF0dHI7XG4gICAgICB2YXIgYXR0cnMgPSBhcmd1bWVudHNbMV07XG4gICAgICBhcmd1bWVudHNbMl0obm9kZXMpO1xuICAgICAgcGFyZW50Tm9kZSA9IF9jckVsKGFyZ3VtZW50c1swXSk7XG4gICAgICBpZiAoYXR0cnMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoaW5kZXhBdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwoYXR0cnMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgIGF0dHIgPSBhdHRyc1tpbmRleEF0dHJdO1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5hdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgbmFtZTogYXR0clswXSxcbiAgICAgICAgICAgICAgdmFsdWU6IGF0dHJbMV1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChpbmRleE5vZGUgaW4gbm9kZXMpIHtcbiAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwobm9kZXMsIGluZGV4Tm9kZSkpIHtcbiAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhOb2RlXTtcbiAgICAgICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBub2RlID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIG5vZGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKF9jclROKG5vZGUpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2Ygd2luZG93Ll9fY2FjaGVkVGVtcGxhdGVzID09PSAndW5kZWZpbmVkJykge1xuICAgIHdpbmRvdy5fX2NhY2hlZFRlbXBsYXRlcyA9IHt9O1xuICB9XG4gIGZ1bmN0aW9uIGNhY2hlUmVxdWlyZVRlbXBsYXRlKHBhdGgsIHJlcXVpcmVkKVxuICB7XG4gICAgd2luZG93Ll9fY2FjaGVkVGVtcGxhdGVzW3BhdGhdID0gcmVxdWlyZWQ7XG4gIH1cbiAgZnVuY3Rpb24gcmVxdWlyZVRlbXBsYXRlKHBhdGgsIG9iailcbiAge1xuICAgIHJldHVybiB3aW5kb3cuX19jYWNoZWRUZW1wbGF0ZXNbcGF0aF0ob2JqKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKG9iailcbiAge1xuICAgIHJldHVybiBjcmVhdGUoZnVuY3Rpb24gKGNoaWxkcylcbiAgICB7XG4gICAgICB3aXRoIChvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFycjkgPSBzZWN0aW9ucztcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgc2VjdGlvbnNJdGVtIGluIGFycjkpIGlmIChfaGFzUHJvcC5jYWxsKGFycjksIHNlY3Rpb25zSXRlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICBzZWN0aW9uc0l0ZW0gPSBhcnI5W3NlY3Rpb25zSXRlbV07XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnbWVudV9faXRlbSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggc2VjdGlvbiA9PSBzZWN0aW9uc0l0ZW1bJ2FsaWFzJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICcgbWVudV9faXRlbS0tYWN0aXZlJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsaScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICcvY21zLyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IHNlY3Rpb25zSXRlbVsnYWxpYXMnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJy8nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2hyZWYnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ21lbnVfX2xpbmsnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdhJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKHNlY3Rpb25zSXRlbVsndGl0bGUnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0pOyIsIihmdW5jdGlvbiAoZmFjdG9yeSlcbntcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkZWZpbmUoJ2ZpcnN0LXRyeScsIFtdLCBmYWN0b3J5KCkpO1xuICB9XG4gIGVsc2Uge1xuICAgIHdpbmRvdy50YWJsZVNlY3Rpb25zTGlzdCA9IGZhY3RvcnkoKTtcbiAgfVxufSkoZnVuY3Rpb24gKClcbntcbiAgdmFyIF9oYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIF9jckVsID0gZnVuY3Rpb24gKG5vZGUpXG4gIHtcbiAgICByZXR1cm4ge3R5cGU6ICdub2RlJywgbmFtZTogbm9kZSwgYXR0cnM6IFtdLCBjaGlsZHM6IFtdfTtcbiAgfTtcbiAgdmFyIF9jclROID0gZnVuY3Rpb24gKG5vZGUpXG4gIHtcbiAgICByZXR1cm4ge3R5cGU6ICd0ZXh0JywgdGV4dDogbm9kZX07XG4gIH07XG4gIGZ1bmN0aW9uIGNvdW50KGFycilcbiAge1xuICAgIHJldHVybiBhcnIubGVuZ3RoO1xuICB9XG4gIGZ1bmN0aW9uIGxlbmd0aChzdHIpXG4gIHtcbiAgICByZXR1cm4gc3RyLmxlbmd0aDtcbiAgfVxuICB2YXIgY2xvbmVFbGVtZW50cyA9IFtdO1xuICBmdW5jdGlvbiBjbG9uZShvYmopXG4gIHtcbiAgICBjbG9uZUVsZW1lbnRzID0gW107XG4gICAgdmFyIGNvcHkgPSBudWxsO1xuICAgIHZhciBlbGVtO1xuICAgIHZhciBhdHRyO1xuICAgIHZhciBpO1xuXG4gICAgaWYgKG51bGwgPT0gb2JqIHx8IFwib2JqZWN0XCIgIT0gdHlwZW9mIG9iaikge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBpZiAob2JqIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgY29weSA9IG5ldyBEYXRlKCk7XG4gICAgICBjb3B5LnNldFRpbWUob2JqLmdldFRpbWUoKSk7XG4gICAgICByZXR1cm4gY29weTtcbiAgICB9XG4gICAgaWYgKGNsb25lRWxlbWVudHMuaW5kZXhPZihvYmopID09IC0xKSB7XG4gICAgICBjbG9uZUVsZW1lbnRzLnB1c2gob2JqKTtcbiAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBjb3B5ID0gW107XG4gICAgICAgIGZvciAoaSBpbiBvYmopIHtcbiAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChvYmosIGkpKSB7XG4gICAgICAgICAgICBlbGVtID0gb2JqW2ldO1xuICAgICAgICAgICAgY29weVtpXSA9IGNsb25lKGVsZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICAgIH1cbiAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgY29weSA9IHt9O1xuICAgICAgICBmb3IgKGkgaW4gb2JqKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwob2JqLCBpKSkge1xuICAgICAgICAgICAgYXR0ciA9IG9ialtpXTtcbiAgICAgICAgICAgIGNvcHlbaV0gPSBjbG9uZShhdHRyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZSgpXG4gIHtcbiAgICB2YXIgaW5kZXhBdHRyO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciByb290Tm9kZXMgPSBbXTtcbiAgICAgIGFyZ3VtZW50c1swXShyb290Tm9kZXMpO1xuICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gcm9vdE5vZGVzKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwocm9vdE5vZGVzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgIHJvb3ROb2Rlc1tpbmRleEF0dHJdID0gX2NyVE4ocm9vdE5vZGVzW2luZGV4QXR0cl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICB9XG4gICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICB2YXIgcGFyZW50Tm9kZTtcbiAgICAgIHZhciBpbmRleE5vZGU7XG4gICAgICB2YXIgbm9kZTtcbiAgICAgIHZhciBhdHRyO1xuICAgICAgdmFyIGF0dHJzID0gYXJndW1lbnRzWzFdO1xuICAgICAgYXJndW1lbnRzWzJdKG5vZGVzKTtcbiAgICAgIHBhcmVudE5vZGUgPSBfY3JFbChhcmd1bWVudHNbMF0pO1xuICAgICAgaWYgKGF0dHJzLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiBhdHRycykge1xuICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKGF0dHJzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICBhdHRyID0gYXR0cnNbaW5kZXhBdHRyXTtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgIG5hbWU6IGF0dHJbMF0sXG4gICAgICAgICAgICAgIHZhbHVlOiBhdHRyWzFdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoaW5kZXhOb2RlIGluIG5vZGVzKSB7XG4gICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKG5vZGVzLCBpbmRleE5vZGUpKSB7XG4gICAgICAgICAgbm9kZSA9IG5vZGVzW2luZGV4Tm9kZV07XG4gICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChfY3JUTihub2RlKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChub2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJlbnROb2RlO1xuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIHdpbmRvdy5fX2NhY2hlZFRlbXBsYXRlcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB3aW5kb3cuX19jYWNoZWRUZW1wbGF0ZXMgPSB7fTtcbiAgfVxuICBmdW5jdGlvbiBjYWNoZVJlcXVpcmVUZW1wbGF0ZShwYXRoLCByZXF1aXJlZClcbiAge1xuICAgIHdpbmRvdy5fX2NhY2hlZFRlbXBsYXRlc1twYXRoXSA9IHJlcXVpcmVkO1xuICB9XG4gIGZ1bmN0aW9uIHJlcXVpcmVUZW1wbGF0ZShwYXRoLCBvYmopXG4gIHtcbiAgICByZXR1cm4gd2luZG93Ll9fY2FjaGVkVGVtcGxhdGVzW3BhdGhdKG9iaik7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChvYmopXG4gIHtcbiAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAge1xuICAgICAgd2l0aCAob2JqKSB7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdzZWN0aW9uX19yb3cnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICcvY21zL2NvbmZpZ3MvYWRkLyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2hyZWYnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19idG4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdhJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0JTQvtCx0LDQstC40YLRjCDRgNCw0LfQtNC10LsnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdzZWN0aW9uX19yb3cnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdzZWN0aW9uLWxpc3QnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmouY2hlY2tlZEl0ZW1zID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAndGFibGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0YWJsZScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdjb2xncm91cCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICcyMCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnd2lkdGgnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2NvbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnKic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnd2lkdGgnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2NvbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnKic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnd2lkdGgnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2NvbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnKic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnd2lkdGgnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2NvbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0aGVhZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0cicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fY2hlY2tib3gnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY2hlY2tib3gnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjaGVja2FsbCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjYmVjay1hbGwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2NoZWNrYm94LWxhYmVsJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NoZWNrYWxsJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCfQndCw0LfQstCw0L3QuNC1Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goJ9CS0LXQsS3QuNC80Y8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0JzQvtC00YPQu9GMJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0Ym9keScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcnIxMyA9IHNlY3Rpb25zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGFycjEzKSBpZiAoX2hhc1Byb3AuY2FsbChhcnIxMywgaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWN0aW9uc0l0ZW0gPSBhcnIxM1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoICggdHlwZW9mIHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddICE9ICd1bmRlZmluZWQnID8gc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gOiAnJykgJiYgKHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddID09IFwidHJ1ZVwiIHx8IHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddID09IHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY2hlY2tlZEl0ZW1zID0gY2hlY2tlZEl0ZW1zICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAndGFibGVfX2xpbmsnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnc2VjdGlvbi1yb3cnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydkYXRhLWlkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndHInLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19jaGVja2JveCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY2hlY2tib3gnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY2hlY2snO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gc2VjdGlvbnNJdGVtWydpZCddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NoZWNrLWl0ZW0nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoICggdHlwZW9mIHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddICE9ICd1bmRlZmluZWQnID8gc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gOiAnJykgJiYgKHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddID09IFwidHJ1ZVwiIHx8IHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddID09IHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2hlY2tlZCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19jaGVja2JveC1sYWJlbCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY2hlY2snO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gc2VjdGlvbnNJdGVtWydpZCddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnL2Ntcy9jb25maWdzLyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBzZWN0aW9uc0l0ZW1bJ2FsaWFzJ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnLyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2hyZWYnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnYScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goc2VjdGlvbnNJdGVtWyd0aXRsZSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJy9jbXMvY29uZmlncy8nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gc2VjdGlvbnNJdGVtWydhbGlhcyddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJy8nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydocmVmJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2EnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKHNlY3Rpb25zSXRlbVsnYWxpYXMnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICcvY21zL2NvbmZpZ3MvJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IHNlY3Rpb25zSXRlbVsnYWxpYXMnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICcvJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnaHJlZicsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdhJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChzZWN0aW9uc0l0ZW1bJ21vZHVsZSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnc2VjdGlvbl9fcm93JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2FjdGlvbicsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2JvdHRvbS1mb3JtJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdmb3JtJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19idG4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnc3VibWl0JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBjaGVja2VkSXRlbXMgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2Rpc2FibGVkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0KPQtNCw0LvQuNGC0YwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0pOyJdfQ==
