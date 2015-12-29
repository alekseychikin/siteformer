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
checkedItems = 0;            (function () {
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
                    var arr0 = sections;
                    for (var i in arr0) if (_hasProp.call(arr0, i)) {
                      sectionsItem = arr0[i];
                      if ( ( typeof sectionsItem['checked'] != 'undefined' ? sectionsItem['checked'] : '') && (sectionsItem['checked'] == "true" || sectionsItem['checked'] == true)) {
checkedItems = checkedItems + 1;                      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2luZGV4LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvaW5kZXhNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2luZGV4Vmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL3NlY3Rpb25zTWVudVZpZXcuY29mZmVlIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvY29tcG9uZW50cy9tZW51L21lbnUtaXRlbXMudG1wbC5qcyIsInRlbXAvbW9kdWxlcy9HVUkvLmNvbXBpbGVfdGVtcGxhdGVzL3NlY3Rpb25zL2NvbmZpZ3MvdGFibGUtc2VjdGlvbnMtbGlzdC50bXBsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLHFCQUFSOztBQUNiLFVBQUEsR0FBYSxVQUFBLENBQUE7O0FBQ2IsU0FBQSxHQUFZLE9BQUEsQ0FBUSxvQkFBUjs7QUFDWixnQkFBQSxHQUFtQixPQUFBLENBQVEsMkJBQVI7O0FBRW5CLFNBQUEsQ0FBVyxDQUFBLENBQUUsV0FBRixDQUFYLEVBQTJCLFVBQTNCOztBQUNBLGdCQUFBLENBQWtCLENBQUEsQ0FBRSxnQkFBRixDQUFsQixFQUF1QyxVQUF2Qzs7OztBQ05BLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSOztBQUNSLE9BQUEsR0FBVSxDQUFDLE9BQUEsQ0FBUSxhQUFSLENBQUQsQ0FBdUIsQ0FBQzs7QUFDbEMsUUFBQSxHQUFXLENBQUMsT0FBQSxDQUFRLGFBQVIsQ0FBRCxDQUF1QixDQUFDOztBQUVuQyxNQUFNLENBQUMsT0FBUCxHQUFpQixLQUFBLENBQ2Y7RUFBQSxZQUFB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiSW5kZXhNb2RlbCA9IHJlcXVpcmUgXCIuL2luZGV4TW9kZWwuY29mZmVlXCJcbmluZGV4TW9kZWwgPSBJbmRleE1vZGVsKClcbkluZGV4VmlldyA9IHJlcXVpcmUgXCIuL2luZGV4Vmlldy5jb2ZmZWVcIlxuU2VjdGlvbnNNZW51VmlldyA9IHJlcXVpcmUgXCIuL3NlY3Rpb25zTWVudVZpZXcuY29mZmVlXCJcblxuSW5kZXhWaWV3ICgkIFwiQHNlY3Rpb25zXCIpLCBpbmRleE1vZGVsXG5TZWN0aW9uc01lbnVWaWV3ICgkIFwiQHNlY3Rpb25zLW1lbnVcIiksIGluZGV4TW9kZWxcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5odHRwR2V0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwR2V0XG5odHRwUG9zdCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cFBvc3RcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBpbml0aWFsU3RhdGU6IC0+XG4gICAgaHR0cEdldCBcIiN7d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lfV9fanNvbi9cIlxuXG4gIHNldENoZWNrOiAoaW5kZXgsIGNoZWNrZWQpIC0+XG4gICAgaW5kZXggPSBwYXJzZUludCBpbmRleCwgMTBcbiAgICBzZWN0aW9ucyA9IEBzdGF0ZS5zZWN0aW9ucy5zbGljZSgpXG4gICAgc2VjdGlvbnNbaW5kZXhdLmNoZWNrZWQgPSBjaGVja2VkXG4gICAgQHNldCBzZWN0aW9uczogc2VjdGlvbnNcblxuICBjaGVja0FsbDogKGNoZWNrZWQpIC0+XG4gICAgc2VjdGlvbnMgPSBAc3RhdGUuc2VjdGlvbnMuc2xpY2UoKVxuICAgIGZvciBzZWN0aW9uIGluIHNlY3Rpb25zXG4gICAgICBzZWN0aW9uLmNoZWNrZWQgPSBjaGVja2VkXG4gICAgQHNldCBzZWN0aW9uczogc2VjdGlvbnNcblxuICByZW1vdmVTdWJtaXQ6IC0+XG4gICAgc291cmNlU2VjdGlvbnMgPSBAc3RhdGUuc2VjdGlvbnMuc2xpY2UoKVxuICAgIHNlY3Rpb25zID0gW11cbiAgICBkZWxldGVTZWN0aW9ucyA9IFtdXG4gICAgZm9yIHNlY3Rpb24gaW4gc291cmNlU2VjdGlvbnNcbiAgICAgIGlmICFzZWN0aW9uLmNoZWNrZWQ/IHx8ICFzZWN0aW9uLmNoZWNrZWRcbiAgICAgICAgc2VjdGlvbnMucHVzaCBzZWN0aW9uXG4gICAgICBlbHNlXG4gICAgICAgIGRlbGV0ZVNlY3Rpb25zLnB1c2ggc2VjdGlvbi5pZFxuICAgIGh0dHBQb3N0IFwiI3t3aW5kb3cubG9jYXRpb24ucGF0aG5hbWV9YWN0aW9uX2RlbGV0ZS9fX2pzb24vXCIsIHtkZWxldGVTZWN0aW9uc31cbiAgICAuY2F0Y2ggKHJlc3BvbnNlKSA9PlxuICAgICAgY29uc29sZS5lcnJvciByZXNwb25zZS5lcnJvclxuICAgICAgQHNldCBzZWN0aW9uczogc291cmNlU2VjdGlvbnNcbiAgICBAc2V0IHNlY3Rpb25zOiBzZWN0aW9uc1xuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5zZWN0aW9uc1RlbXBsYXRlID0gcmVxdWlyZSBcInNlY3Rpb25zL2NvbmZpZ3MvdGFibGUtc2VjdGlvbnMtbGlzdC50bXBsLmpzXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgaW5pdGlhbDogLT5cbiAgICBAdGVtcGxhdGVMaXN0ID0gUmVuZGVyIHNlY3Rpb25zVGVtcGxhdGUsIEBjb250YWluWzBdXG5cbiAgZXZlbnRzOlxuICAgIFwiY2hhbmdlOiBAY2hlY2staXRlbVwiOiAoZSkgLT5cbiAgICAgIEBtb2RlbC5zZXRDaGVjayAoJCBlLnRhcmdldCkuY2xvc2VzdChcIkBzZWN0aW9uLXJvd1wiKS5hdHRyKFwiZGF0YS1pZFwiKSwgZS50YXJnZXQuY2hlY2tlZFxuICAgIFwiY2hhbmdlOiBAY2JlY2stYWxsXCI6IChlKSAtPlxuICAgICAgQG1vZGVsLmNoZWNrQWxsIGUudGFyZ2V0LmNoZWNrZWRcbiAgICBcInN1Ym1pdDogQGJvdHRvbS1mb3JtXCI6IChlKSAtPlxuICAgICAgQG1vZGVsLnJlbW92ZVN1Ym1pdCgpXG4gICAgICBmYWxzZVxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPiBAdGVtcGxhdGVMaXN0IHN0YXRlXG4iLCJSZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcblZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxubWVudVRlbXBsYXRlID0gcmVxdWlyZSBcImNvbXBvbmVudHMvbWVudS9tZW51LWl0ZW1zLnRtcGwuanNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgaW5pdGlhbDogLT4gQG1lbnVUZW1wbGF0ZSA9IFJlbmRlciBtZW51VGVtcGxhdGUsIEBjb250YWluWzBdXG4gIHJlbmRlcjogKHN0YXRlKSAtPiBAbWVudVRlbXBsYXRlIHN0YXRlXG4iLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG57XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgfVxuICBlbHNlIHtcbiAgICB3aW5kb3cubWVudUl0ZW1zID0gZmFjdG9yeSgpO1xuICB9XG59KShmdW5jdGlvbiAoKVxue1xuICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgX2NyRWwgPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICB9O1xuICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ3RleHQnLCB0ZXh0OiBub2RlfTtcbiAgfTtcbiAgZnVuY3Rpb24gY3JlYXRlKClcbiAge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgcm9vdE5vZGVzID0gW107XG4gICAgICBhcmd1bWVudHNbMF0ocm9vdE5vZGVzKTtcbiAgICAgIGlmIChyb290Tm9kZXMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoaW5kZXhBdHRyIGluIHJvb3ROb2Rlcykge1xuICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKHJvb3ROb2RlcywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICByb290Tm9kZXNbaW5kZXhBdHRyXSA9IF9jclROKHJvb3ROb2Rlc1tpbmRleEF0dHJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByb290Tm9kZXM7XG4gICAgfVxuICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgdmFyIHBhcmVudE5vZGU7XG4gICAgICB2YXIgaW5kZXhOb2RlO1xuICAgICAgdmFyIG5vZGU7XG4gICAgICB2YXIgaW5kZXhBdHRyO1xuICAgICAgdmFyIGF0dHI7XG4gICAgICB2YXIgYXR0cnMgPSBhcmd1bWVudHNbMV07XG4gICAgICBhcmd1bWVudHNbMl0obm9kZXMpO1xuICAgICAgcGFyZW50Tm9kZSA9IF9jckVsKGFyZ3VtZW50c1swXSk7XG4gICAgICBpZiAoYXR0cnMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoaW5kZXhBdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwoYXR0cnMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgIGF0dHIgPSBhdHRyc1tpbmRleEF0dHJdO1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5hdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgbmFtZTogYXR0clswXSxcbiAgICAgICAgICAgICAgdmFsdWU6IGF0dHJbMV1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChpbmRleE5vZGUgaW4gbm9kZXMpIHtcbiAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwobm9kZXMsIGluZGV4Tm9kZSkpIHtcbiAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhOb2RlXTtcbiAgICAgICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBub2RlID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIG5vZGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKF9jclROKG5vZGUpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgfVxuICB9XG4gIHZhciBjYWNoZWRUZW1wbGF0ZXMgPSB7fTtcbiAgZnVuY3Rpb24gY2FjaGVSZXF1aXJlVGVtcGxhdGUocGF0aCwgcmVxdWlyZWQpXG4gIHtcbiAgICBjYWNoZWRUZW1wbGF0ZXNbcGF0aF0gPSByZXF1aXJlZDtcbiAgfVxuICBmdW5jdGlvbiByZXF1aXJlVGVtcGxhdGUocGF0aCwgb2JqKVxuICB7XG4gICAgcmV0dXJuIGNhY2hlZFRlbXBsYXRlc1twYXRoXShvYmopO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAob2JqKVxuICB7XG4gICAgcmV0dXJuIGNyZWF0ZShmdW5jdGlvbiAoY2hpbGRzKVxuICAgIHtcbiAgICAgIHdpdGggKG9iaikge1xuICAgICAgICB2YXIgYXJyMCA9IHNlY3Rpb25zO1xuICAgICAgICBmb3IgKHZhciBzZWN0aW9uc0l0ZW0gaW4gYXJyMCkgaWYgKF9oYXNQcm9wLmNhbGwoYXJyMCwgc2VjdGlvbnNJdGVtKSkge1xuICAgICAgICAgIHNlY3Rpb25zSXRlbSA9IGFycjBbc2VjdGlvbnNJdGVtXTtcbiAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICBhdHRyICs9ICdtZW51X19pdGVtJztcbiAgICAgICAgICAgICAgaWYgKCBzZWN0aW9uID09IHNlY3Rpb25zSXRlbVsnYWxpYXMnXSkge1xuICAgICAgICAgICAgICAgIGF0dHIgKz0gJyBtZW51X19pdGVtLS1hY3RpdmUnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2xpJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJy9jbXMvJztcbiAgICAgICAgICAgICAgICAgIGF0dHIgKz0gc2VjdGlvbnNJdGVtWydhbGlhcyddO1xuICAgICAgICAgICAgICAgICAgYXR0ciArPSAnLyc7XG4gICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnaHJlZicsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgYXR0ciArPSAnbWVudV9fbGluayc7XG4gICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2EnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goc2VjdGlvbnNJdGVtWyd0aXRsZSddKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSk7IiwiKGZ1bmN0aW9uIChmYWN0b3J5KVxue1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuICAgIGRlZmluZSgnZmlyc3QtdHJ5JywgW10sIGZhY3RvcnkoKSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgd2luZG93LnRhYmxlU2VjdGlvbnNMaXN0ID0gZmFjdG9yeSgpO1xuICB9XG59KShmdW5jdGlvbiAoKVxue1xuICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgX2NyRWwgPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICB9O1xuICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ3RleHQnLCB0ZXh0OiBub2RlfTtcbiAgfTtcbiAgZnVuY3Rpb24gY3JlYXRlKClcbiAge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgcm9vdE5vZGVzID0gW107XG4gICAgICBhcmd1bWVudHNbMF0ocm9vdE5vZGVzKTtcbiAgICAgIGlmIChyb290Tm9kZXMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoaW5kZXhBdHRyIGluIHJvb3ROb2Rlcykge1xuICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKHJvb3ROb2RlcywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICByb290Tm9kZXNbaW5kZXhBdHRyXSA9IF9jclROKHJvb3ROb2Rlc1tpbmRleEF0dHJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByb290Tm9kZXM7XG4gICAgfVxuICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgdmFyIHBhcmVudE5vZGU7XG4gICAgICB2YXIgaW5kZXhOb2RlO1xuICAgICAgdmFyIG5vZGU7XG4gICAgICB2YXIgaW5kZXhBdHRyO1xuICAgICAgdmFyIGF0dHI7XG4gICAgICB2YXIgYXR0cnMgPSBhcmd1bWVudHNbMV07XG4gICAgICBhcmd1bWVudHNbMl0obm9kZXMpO1xuICAgICAgcGFyZW50Tm9kZSA9IF9jckVsKGFyZ3VtZW50c1swXSk7XG4gICAgICBpZiAoYXR0cnMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoaW5kZXhBdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwoYXR0cnMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgIGF0dHIgPSBhdHRyc1tpbmRleEF0dHJdO1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5hdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgbmFtZTogYXR0clswXSxcbiAgICAgICAgICAgICAgdmFsdWU6IGF0dHJbMV1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChpbmRleE5vZGUgaW4gbm9kZXMpIHtcbiAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwobm9kZXMsIGluZGV4Tm9kZSkpIHtcbiAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhOb2RlXTtcbiAgICAgICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBub2RlID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIG5vZGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKF9jclROKG5vZGUpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgfVxuICB9XG4gIHZhciBjYWNoZWRUZW1wbGF0ZXMgPSB7fTtcbiAgZnVuY3Rpb24gY2FjaGVSZXF1aXJlVGVtcGxhdGUocGF0aCwgcmVxdWlyZWQpXG4gIHtcbiAgICBjYWNoZWRUZW1wbGF0ZXNbcGF0aF0gPSByZXF1aXJlZDtcbiAgfVxuICBmdW5jdGlvbiByZXF1aXJlVGVtcGxhdGUocGF0aCwgb2JqKVxuICB7XG4gICAgcmV0dXJuIGNhY2hlZFRlbXBsYXRlc1twYXRoXShvYmopO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAob2JqKVxuICB7XG4gICAgcmV0dXJuIGNyZWF0ZShmdW5jdGlvbiAoY2hpbGRzKVxuICAgIHtcbiAgICAgIHdpdGggKG9iaikge1xuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgYXR0ciArPSAnc2VjdGlvbl9fcm93JztcbiAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICB9KSgpO1xuICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgYXR0ciArPSAnL2Ntcy9jb25maWdzL2FkZC8nO1xuICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydocmVmJywgYXR0cl0pO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fYnRuJztcbiAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnYScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goJ9CU0L7QsdCw0LLQuNGC0Ywg0YDQsNC30LTQtdC7Jyk7XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KSgpO1xuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgYXR0ciArPSAnc2VjdGlvbl9fcm93JztcbiAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICB9KSgpO1xuICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgYXR0ciArPSAnc2VjdGlvbi1saXN0JztcbiAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hlY2tlZEl0ZW1zID0gMDsgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgIGF0dHIgKz0gJ3RhYmxlJztcbiAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndGFibGUnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnY29sZ3JvdXAnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnMjAnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3dpZHRoJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdjb2wnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJyonO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3dpZHRoJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdjb2wnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJyonO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3dpZHRoJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdjb2wnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJyonO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3dpZHRoJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdjb2wnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndGhlYWQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndHInLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2NoZWNrYm94JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NoZWNrYm94JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY2hlY2thbGwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY2JlY2stYWxsJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19jaGVja2JveC1sYWJlbCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdjaGVja2FsbCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0J3QsNC30LLQsNC90LjQtScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKCfQktC10LEt0LjQvNGPJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goJ9Cc0L7QtNGD0LvRjCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndGJvZHknLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJyMCA9IHNlY3Rpb25zO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGFycjApIGlmIChfaGFzUHJvcC5jYWxsKGFycjAsIGkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgc2VjdGlvbnNJdGVtID0gYXJyMFtpXTtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoICggdHlwZW9mIHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddICE9ICd1bmRlZmluZWQnID8gc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gOiAnJykgJiYgKHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddID09IFwidHJ1ZVwiIHx8IHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddID09IHRydWUpKSB7XG5jaGVja2VkSXRlbXMgPSBjaGVja2VkSXRlbXMgKyAxOyAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAndGFibGVfX2xpbmsnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnc2VjdGlvbi1yb3cnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydkYXRhLWlkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndHInLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19jaGVja2JveCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY2hlY2tib3gnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY2hlY2snO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gc2VjdGlvbnNJdGVtWydpZCddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2NoZWNrLWl0ZW0nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoICggdHlwZW9mIHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddICE9ICd1bmRlZmluZWQnID8gc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gOiAnJykgJiYgKHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddID09IFwidHJ1ZVwiIHx8IHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddID09IHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2hlY2tlZCcsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19jaGVja2JveC1sYWJlbCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnY2hlY2snO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gc2VjdGlvbnNJdGVtWydpZCddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnL2Ntcy9jb25maWdzLyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSBzZWN0aW9uc0l0ZW1bJ2FsaWFzJ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnLyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2hyZWYnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnYScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goc2VjdGlvbnNJdGVtWyd0aXRsZSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJy9jbXMvY29uZmlncy8nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gc2VjdGlvbnNJdGVtWydhbGlhcyddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJy8nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydocmVmJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2EnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKHNlY3Rpb25zSXRlbVsnYWxpYXMnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICcvY21zL2NvbmZpZ3MvJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IHNlY3Rpb25zSXRlbVsnYWxpYXMnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICcvJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnaHJlZicsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdhJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChzZWN0aW9uc0l0ZW1bJ21vZHVsZSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KSgpO1xuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgYXR0ciArPSAnc2VjdGlvbl9fcm93JztcbiAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICB9KSgpO1xuICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2FjdGlvbicsIGF0dHJdKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2JvdHRvbS1mb3JtJztcbiAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdmb3JtJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19idG4nO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnc3VibWl0JztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgaWYgKCBjaGVja2VkSXRlbXMgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2Rpc2FibGVkJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaCgn0KPQtNCw0LvQuNGC0YwnKTtcbiAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0pOyJdfQ==
