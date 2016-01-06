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
        var arr0 = sections;
        for (var sectionsItem in arr0) if (_hasProp.call(arr0, sectionsItem)) {
          sectionsItem = arr0[sectionsItem];
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
            var checkedItems = 0;
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
                    var arr4 = sections;
                    for (var i in arr4) if (_hasProp.call(arr4, i)) {
                      sectionsItem = arr4[i];
                      if ( ( typeof sectionsItem['checked'] != 'undefined' ? sectionsItem['checked'] : '') && (sectionsItem['checked'] == "true" || sectionsItem['checked'] == true)) {
                        var checkedItems = checkedItems + 1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2luZGV4LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvaW5kZXhNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2luZGV4Vmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL3NlY3Rpb25zTWVudVZpZXcuY29mZmVlIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvY29tcG9uZW50cy9tZW51L21lbnUtaXRlbXMudG1wbC5qcyIsInRlbXAvbW9kdWxlcy9HVUkvLmNvbXBpbGVfdGVtcGxhdGVzL3NlY3Rpb25zL2NvbmZpZ3MvdGFibGUtc2VjdGlvbnMtbGlzdC50bXBsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLHFCQUFSOztBQUNiLFVBQUEsR0FBYSxVQUFBLENBQUE7O0FBQ2IsU0FBQSxHQUFZLE9BQUEsQ0FBUSxvQkFBUjs7QUFDWixnQkFBQSxHQUFtQixPQUFBLENBQVEsMkJBQVI7O0FBRW5CLFNBQUEsQ0FBVyxDQUFBLENBQUUsV0FBRixDQUFYLEVBQTJCLFVBQTNCOztBQUNBLGdCQUFBLENBQWtCLENBQUEsQ0FBRSxnQkFBRixDQUFsQixFQUF1QyxVQUF2Qzs7OztBQ05BLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSOztBQUNSLE9BQUEsR0FBVSxDQUFDLE9BQUEsQ0FBUSxhQUFSLENBQUQsQ0FBdUIsQ0FBQzs7QUFDbEMsUUFBQSxHQUFXLENBQUMsT0FBQSxDQUFRLGFBQVIsQ0FBRCxDQUF1QixDQUFDOztBQUVuQyxNQUFNLENBQUMsT0FBUCxHQUFpQixLQUFBLENBQ2Y7RUFBQSxZQUFB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiSW5kZXhNb2RlbCA9IHJlcXVpcmUgXCIuL2luZGV4TW9kZWwuY29mZmVlXCJcbmluZGV4TW9kZWwgPSBJbmRleE1vZGVsKClcbkluZGV4VmlldyA9IHJlcXVpcmUgXCIuL2luZGV4Vmlldy5jb2ZmZWVcIlxuU2VjdGlvbnNNZW51VmlldyA9IHJlcXVpcmUgXCIuL3NlY3Rpb25zTWVudVZpZXcuY29mZmVlXCJcblxuSW5kZXhWaWV3ICgkIFwiQHNlY3Rpb25zXCIpLCBpbmRleE1vZGVsXG5TZWN0aW9uc01lbnVWaWV3ICgkIFwiQHNlY3Rpb25zLW1lbnVcIiksIGluZGV4TW9kZWxcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5odHRwR2V0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwR2V0XG5odHRwUG9zdCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cFBvc3RcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBpbml0aWFsU3RhdGU6IC0+XG4gICAgaHR0cEdldCBcIiN7d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lfV9fanNvbi9cIlxuXG4gIHNldENoZWNrOiAoaW5kZXgsIGNoZWNrZWQpIC0+XG4gICAgaW5kZXggPSBwYXJzZUludCBpbmRleCwgMTBcbiAgICBzZWN0aW9ucyA9IEBzdGF0ZS5zZWN0aW9ucy5zbGljZSgpXG4gICAgc2VjdGlvbnNbaW5kZXhdLmNoZWNrZWQgPSBjaGVja2VkXG4gICAgQHNldCBzZWN0aW9uczogc2VjdGlvbnNcblxuICBjaGVja0FsbDogKGNoZWNrZWQpIC0+XG4gICAgc2VjdGlvbnMgPSBAc3RhdGUuc2VjdGlvbnMuc2xpY2UoKVxuICAgIGZvciBzZWN0aW9uIGluIHNlY3Rpb25zXG4gICAgICBzZWN0aW9uLmNoZWNrZWQgPSBjaGVja2VkXG4gICAgQHNldCBzZWN0aW9uczogc2VjdGlvbnNcblxuICByZW1vdmVTdWJtaXQ6IC0+XG4gICAgc291cmNlU2VjdGlvbnMgPSBAc3RhdGUuc2VjdGlvbnMuc2xpY2UoKVxuICAgIHNlY3Rpb25zID0gW11cbiAgICBkZWxldGVTZWN0aW9ucyA9IFtdXG4gICAgZm9yIHNlY3Rpb24gaW4gc291cmNlU2VjdGlvbnNcbiAgICAgIGlmICFzZWN0aW9uLmNoZWNrZWQ/IHx8ICFzZWN0aW9uLmNoZWNrZWRcbiAgICAgICAgc2VjdGlvbnMucHVzaCBzZWN0aW9uXG4gICAgICBlbHNlXG4gICAgICAgIGRlbGV0ZVNlY3Rpb25zLnB1c2ggc2VjdGlvbi5pZFxuICAgIGh0dHBQb3N0IFwiI3t3aW5kb3cubG9jYXRpb24ucGF0aG5hbWV9YWN0aW9uX2RlbGV0ZS9fX2pzb24vXCIsIHtkZWxldGVTZWN0aW9uc31cbiAgICAuY2F0Y2ggKHJlc3BvbnNlKSA9PlxuICAgICAgY29uc29sZS5lcnJvciByZXNwb25zZS5lcnJvclxuICAgICAgQHNldCBzZWN0aW9uczogc291cmNlU2VjdGlvbnNcbiAgICBAc2V0IHNlY3Rpb25zOiBzZWN0aW9uc1xuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5zZWN0aW9uc1RlbXBsYXRlID0gcmVxdWlyZSBcInNlY3Rpb25zL2NvbmZpZ3MvdGFibGUtc2VjdGlvbnMtbGlzdC50bXBsLmpzXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgaW5pdGlhbDogLT5cbiAgICBAdGVtcGxhdGVMaXN0ID0gUmVuZGVyIHNlY3Rpb25zVGVtcGxhdGUsIEBjb250YWluWzBdXG5cbiAgZXZlbnRzOlxuICAgIFwiY2hhbmdlOiBAY2hlY2staXRlbVwiOiAoZSkgLT5cbiAgICAgIEBtb2RlbC5zZXRDaGVjayAoJCBlLnRhcmdldCkuY2xvc2VzdChcIkBzZWN0aW9uLXJvd1wiKS5hdHRyKFwiZGF0YS1pZFwiKSwgZS50YXJnZXQuY2hlY2tlZFxuICAgIFwiY2hhbmdlOiBAY2JlY2stYWxsXCI6IChlKSAtPlxuICAgICAgQG1vZGVsLmNoZWNrQWxsIGUudGFyZ2V0LmNoZWNrZWRcbiAgICBcInN1Ym1pdDogQGJvdHRvbS1mb3JtXCI6IChlKSAtPlxuICAgICAgQG1vZGVsLnJlbW92ZVN1Ym1pdCgpXG4gICAgICBmYWxzZVxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPiBAdGVtcGxhdGVMaXN0IHN0YXRlXG4iLCJSZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcblZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxubWVudVRlbXBsYXRlID0gcmVxdWlyZSBcImNvbXBvbmVudHMvbWVudS9tZW51LWl0ZW1zLnRtcGwuanNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgaW5pdGlhbDogLT4gQG1lbnVUZW1wbGF0ZSA9IFJlbmRlciBtZW51VGVtcGxhdGUsIEBjb250YWluWzBdXG4gIHJlbmRlcjogKHN0YXRlKSAtPiBAbWVudVRlbXBsYXRlIHN0YXRlXG4iLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG57XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgfVxuICBlbHNlIHtcbiAgICB3aW5kb3cubWVudUl0ZW1zID0gZmFjdG9yeSgpO1xuICB9XG59KShmdW5jdGlvbiAoKVxue1xuICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgX2NyRWwgPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICB9O1xuICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ3RleHQnLCB0ZXh0OiBub2RlfTtcbiAgfTtcbiAgZnVuY3Rpb24gY291bnQoYXJyKVxuICB7XG4gICAgcmV0dXJuIGFyci5sZW5ndGg7XG4gIH1cbiAgZnVuY3Rpb24gbGVuZ3RoKHN0cilcbiAge1xuICAgIHJldHVybiBzdHIubGVuZ3RoO1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZSgpXG4gIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIHJvb3ROb2RlcyA9IFtdO1xuICAgICAgYXJndW1lbnRzWzBdKHJvb3ROb2Rlcyk7XG4gICAgICBpZiAocm9vdE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiByb290Tm9kZXMpIHtcbiAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChyb290Tm9kZXMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdzdHJpbmcnIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgcm9vdE5vZGVzW2luZGV4QXR0cl0gPSBfY3JUTihyb290Tm9kZXNbaW5kZXhBdHRyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcm9vdE5vZGVzO1xuICAgIH1cbiAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgIHZhciBwYXJlbnROb2RlO1xuICAgICAgdmFyIGluZGV4Tm9kZTtcbiAgICAgIHZhciBub2RlO1xuICAgICAgdmFyIGluZGV4QXR0cjtcbiAgICAgIHZhciBhdHRyO1xuICAgICAgdmFyIGF0dHJzID0gYXJndW1lbnRzWzFdO1xuICAgICAgYXJndW1lbnRzWzJdKG5vZGVzKTtcbiAgICAgIHBhcmVudE5vZGUgPSBfY3JFbChhcmd1bWVudHNbMF0pO1xuICAgICAgaWYgKGF0dHJzLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiBhdHRycykge1xuICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKGF0dHJzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICBhdHRyID0gYXR0cnNbaW5kZXhBdHRyXTtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgIG5hbWU6IGF0dHJbMF0sXG4gICAgICAgICAgICAgIHZhbHVlOiBhdHRyWzFdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoaW5kZXhOb2RlIGluIG5vZGVzKSB7XG4gICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKG5vZGVzLCBpbmRleE5vZGUpKSB7XG4gICAgICAgICAgbm9kZSA9IG5vZGVzW2luZGV4Tm9kZV07XG4gICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChfY3JUTihub2RlKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChub2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJlbnROb2RlO1xuICAgIH1cbiAgfVxuICB2YXIgY2FjaGVkVGVtcGxhdGVzID0ge307XG4gIGZ1bmN0aW9uIGNhY2hlUmVxdWlyZVRlbXBsYXRlKHBhdGgsIHJlcXVpcmVkKVxuICB7XG4gICAgY2FjaGVkVGVtcGxhdGVzW3BhdGhdID0gcmVxdWlyZWQ7XG4gIH1cbiAgZnVuY3Rpb24gcmVxdWlyZVRlbXBsYXRlKHBhdGgsIG9iailcbiAge1xuICAgIHJldHVybiBjYWNoZWRUZW1wbGF0ZXNbcGF0aF0ob2JqKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKG9iailcbiAge1xuICAgIHJldHVybiBjcmVhdGUoZnVuY3Rpb24gKGNoaWxkcylcbiAgICB7XG4gICAgICB3aXRoIChvYmopIHtcbiAgICAgICAgdmFyIGFycjAgPSBzZWN0aW9ucztcbiAgICAgICAgZm9yICh2YXIgc2VjdGlvbnNJdGVtIGluIGFycjApIGlmIChfaGFzUHJvcC5jYWxsKGFycjAsIHNlY3Rpb25zSXRlbSkpIHtcbiAgICAgICAgICBzZWN0aW9uc0l0ZW0gPSBhcnIwW3NlY3Rpb25zSXRlbV07XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgYXR0ciArPSAnbWVudV9faXRlbSc7XG4gICAgICAgICAgICAgIGlmICggc2VjdGlvbiA9PSBzZWN0aW9uc0l0ZW1bJ2FsaWFzJ10pIHtcbiAgICAgICAgICAgICAgICBhdHRyICs9ICcgbWVudV9faXRlbS0tYWN0aXZlJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsaScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICBhdHRyICs9ICcvY21zLyc7XG4gICAgICAgICAgICAgICAgICBhdHRyICs9IHNlY3Rpb25zSXRlbVsnYWxpYXMnXTtcbiAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJy8nO1xuICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2hyZWYnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ21lbnVfX2xpbmsnO1xuICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdhJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKHNlY3Rpb25zSXRlbVsndGl0bGUnXSk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0pOyIsIihmdW5jdGlvbiAoZmFjdG9yeSlcbntcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkZWZpbmUoJ2ZpcnN0LXRyeScsIFtdLCBmYWN0b3J5KCkpO1xuICB9XG4gIGVsc2Uge1xuICAgIHdpbmRvdy50YWJsZVNlY3Rpb25zTGlzdCA9IGZhY3RvcnkoKTtcbiAgfVxufSkoZnVuY3Rpb24gKClcbntcbiAgdmFyIF9oYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIF9jckVsID0gZnVuY3Rpb24gKG5vZGUpXG4gIHtcbiAgICByZXR1cm4ge3R5cGU6ICdub2RlJywgbmFtZTogbm9kZSwgYXR0cnM6IFtdLCBjaGlsZHM6IFtdfTtcbiAgfTtcbiAgdmFyIF9jclROID0gZnVuY3Rpb24gKG5vZGUpXG4gIHtcbiAgICByZXR1cm4ge3R5cGU6ICd0ZXh0JywgdGV4dDogbm9kZX07XG4gIH07XG4gIGZ1bmN0aW9uIGNvdW50KGFycilcbiAge1xuICAgIHJldHVybiBhcnIubGVuZ3RoO1xuICB9XG4gIGZ1bmN0aW9uIGxlbmd0aChzdHIpXG4gIHtcbiAgICByZXR1cm4gc3RyLmxlbmd0aDtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGUoKVxuICB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciByb290Tm9kZXMgPSBbXTtcbiAgICAgIGFyZ3VtZW50c1swXShyb290Tm9kZXMpO1xuICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gcm9vdE5vZGVzKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwocm9vdE5vZGVzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgIHJvb3ROb2Rlc1tpbmRleEF0dHJdID0gX2NyVE4ocm9vdE5vZGVzW2luZGV4QXR0cl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICB9XG4gICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICB2YXIgcGFyZW50Tm9kZTtcbiAgICAgIHZhciBpbmRleE5vZGU7XG4gICAgICB2YXIgbm9kZTtcbiAgICAgIHZhciBpbmRleEF0dHI7XG4gICAgICB2YXIgYXR0cjtcbiAgICAgIHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGFyZ3VtZW50c1syXShub2Rlcyk7XG4gICAgICBwYXJlbnROb2RlID0gX2NyRWwoYXJndW1lbnRzWzBdKTtcbiAgICAgIGlmIChhdHRycy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gYXR0cnMpIHtcbiAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChhdHRycywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2luZGV4QXR0cl07XG4gICAgICAgICAgICBwYXJlbnROb2RlLmF0dHJzLnB1c2goe1xuICAgICAgICAgICAgICBuYW1lOiBhdHRyWzBdLFxuICAgICAgICAgICAgICB2YWx1ZTogYXR0clsxXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGluZGV4Tm9kZSBpbiBub2Rlcykge1xuICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChub2RlcywgaW5kZXhOb2RlKSkge1xuICAgICAgICAgIG5vZGUgPSBub2Rlc1tpbmRleE5vZGVdO1xuICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIG5vZGUgPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2goX2NyVE4obm9kZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2gobm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyZW50Tm9kZTtcbiAgICB9XG4gIH1cbiAgdmFyIGNhY2hlZFRlbXBsYXRlcyA9IHt9O1xuICBmdW5jdGlvbiBjYWNoZVJlcXVpcmVUZW1wbGF0ZShwYXRoLCByZXF1aXJlZClcbiAge1xuICAgIGNhY2hlZFRlbXBsYXRlc1twYXRoXSA9IHJlcXVpcmVkO1xuICB9XG4gIGZ1bmN0aW9uIHJlcXVpcmVUZW1wbGF0ZShwYXRoLCBvYmopXG4gIHtcbiAgICByZXR1cm4gY2FjaGVkVGVtcGxhdGVzW3BhdGhdKG9iaik7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChvYmopXG4gIHtcbiAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAge1xuICAgICAgd2l0aCAob2JqKSB7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICBhdHRyICs9ICdzZWN0aW9uX19yb3cnO1xuICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICBhdHRyICs9ICcvY21zL2NvbmZpZ3MvYWRkLyc7XG4gICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2hyZWYnLCBhdHRyXSk7XG4gICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19idG4nO1xuICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdhJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0JTQvtCx0LDQstC40YLRjCDRgNCw0LfQtNC10LsnKTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICBhdHRyICs9ICdzZWN0aW9uX19yb3cnO1xuICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICBhdHRyICs9ICdzZWN0aW9uLWxpc3QnO1xuICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICB2YXIgY2hlY2tlZEl0ZW1zID0gMDtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgYXR0ciArPSAndGFibGUnO1xuICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0YWJsZScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdjb2xncm91cCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICcyMCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnd2lkdGgnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2NvbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnKic7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnd2lkdGgnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2NvbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnKic7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnd2lkdGgnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2NvbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnKic7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnd2lkdGgnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2NvbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0aGVhZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0cicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fY2hlY2tib3gnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY2hlY2tib3gnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjaGVja2FsbCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjYmVjay1hbGwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2NoZWNrYm94LWxhYmVsJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NoZWNrYWxsJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCfQndCw0LfQstCw0L3QuNC1Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goJ9CS0LXQsS3QuNC80Y8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0JzQvtC00YPQu9GMJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0Ym9keScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnI0ID0gc2VjdGlvbnM7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYXJyNCkgaWYgKF9oYXNQcm9wLmNhbGwoYXJyNCwgaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICBzZWN0aW9uc0l0ZW0gPSBhcnI0W2ldO1xuICAgICAgICAgICAgICAgICAgICAgIGlmICggKCB0eXBlb2Ygc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gIT0gJ3VuZGVmaW5lZCcgPyBzZWN0aW9uc0l0ZW1bJ2NoZWNrZWQnXSA6ICcnKSAmJiAoc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gPT0gXCJ0cnVlXCIgfHwgc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gPT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGVja2VkSXRlbXMgPSBjaGVja2VkSXRlbXMgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICd0YWJsZV9fbGluayc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdzZWN0aW9uLXJvdyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2RhdGEtaWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0cicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2NoZWNrYm94JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjaGVja2JveCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjaGVjayc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBzZWN0aW9uc0l0ZW1bJ2lkJ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY2hlY2staXRlbSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggKCB0eXBlb2Ygc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gIT0gJ3VuZGVmaW5lZCcgPyBzZWN0aW9uc0l0ZW1bJ2NoZWNrZWQnXSA6ICcnKSAmJiAoc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gPT0gXCJ0cnVlXCIgfHwgc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gPT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjaGVja2VkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2NoZWNrYm94LWxhYmVsJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjaGVjayc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBzZWN0aW9uc0l0ZW1bJ2lkJ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICcvY21zL2NvbmZpZ3MvJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IHNlY3Rpb25zSXRlbVsnYWxpYXMnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICcvJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnaHJlZicsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdhJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChzZWN0aW9uc0l0ZW1bJ3RpdGxlJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnL2Ntcy9jb25maWdzLyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBzZWN0aW9uc0l0ZW1bJ2FsaWFzJ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnLyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2hyZWYnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnYScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goc2VjdGlvbnNJdGVtWydhbGlhcyddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJy9jbXMvY29uZmlncy8nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gc2VjdGlvbnNJdGVtWydhbGlhcyddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJy8nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydocmVmJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2EnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKHNlY3Rpb25zSXRlbVsnbW9kdWxlJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICBhdHRyICs9ICdzZWN0aW9uX19yb3cnO1xuICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnYWN0aW9uJywgYXR0cl0pO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgYXR0ciArPSAnYm90dG9tLWZvcm0nO1xuICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2Zvcm0nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2J0bic7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdzdWJtaXQnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICBpZiAoIGNoZWNrZWRJdGVtcyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnZGlzYWJsZWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCfQo9C00LDQu9C40YLRjCcpO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSk7Il19
