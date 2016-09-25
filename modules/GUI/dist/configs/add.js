(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define([], factory());
  }
})(function () {
  var MKARR_OPEN = 2 << 1;
  var MKARR_CLOSE = 1 << 1;
  function mkArr(start, end, flag) {
    var arr = [], i;
    if (flag & MKARR_OPEN) {
      if (start <= end) {
        for (i = start; i < end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i > end; i--) {
          arr.push(i);
        }
      }
    } else if (flag & MKARR_CLOSE) {
      if (start <= end) {
        for (i = start; i <= end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i >= end; i--) {
          arr.push(i);
        }
      }
    }
    return arr;
  }
  function str(str, len, sprtr) {
    if (!len) len = 0;
    if (typeof str.toString === 'function') str = str.toString();
    if (!sprtr) sprtr = '.';
    if (~str.indexOf('.')) {
      if (len > 0) {
        str = str.substr(0, str.indexOf('.') + len + 1);
      } else {
        str = str.substr(0, str.indexOf('.') + len);
      }
    } else {
      str = str_pad(str + '.', str.length + 1 + len, '0');
    }
    return str.replace('.', sprtr);
  }
  function str_replace(str, src, rep) {
    while (~str.indexOf(src)) {
      str = str.replace(src, rep);
    }
    return str;
  }
  var STRPADRIGHT = 1 << 1;
  var STRPADLEFT = 2 << 1;
  var STRPADBOTH = 4 << 1;
  function __str_pad_repeater(str, len) {
    var collect = '', i;
    while(collect.length < len) collect += str;
    collect = collect.substr(0, len);
    return collect;
  }
  function str_pad(str, len, sub, type) {
    if (typeof type === 'undefined') type = STRPADRIGHT;
    var half = '', pad_to_go;
    if ((pad_to_go = len - str.length) > 0) {
      if (type & STRPADLEFT) { str = __str_pad_repeater(sub, pad_to_go) + str; }
      else if (type & STRPADRIGHT) {str = str + __str_pad_repeater(sub, pad_to_go); }
      else if (type & STRPADBOTH) {
        half = __str_pad_repeater(sub, Math.ceil(pad_to_go/2));
        str = half + str + half;
        str = str.substr(0, len);
      }
    }
    return str;
  }
  function str_htmlescape(html) {
    return html.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  }
  function str_upfirst(str) {
    return str.split(/[\s\n\t]+/).map(function (item) {
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join(' ');
  }
  function str_camel(str) {
    return str.split(/[\s\n\t]+/).map(function (item, index) {
      if (!index) return item;
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join('');
  }
  function str_kebab(str) {
    return str.split(/[\s\n\t]+/).join('-');
  }
  function arr_values(obj) {
    var values = [], i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) values.push(obj[i]);
    return values;
  }
  function arr_contain(obj, value) {
    if(typeof obj.indexOf === 'function') return obj.indexOf(value) !== -1;
    var i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) if (obj[i] === value) return true;
    return false;
  }
  function arr_len(obj) {
    if(typeof obj.length !== 'undefined') return obj.length;
    var i, length = 0;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) length++;
    return length;
  }
  function arr_push(arr, value) {
    arr.push(value);
    return '';
  }
  function arr_unshift(arr, value) {
    arr.unshift(value);
    return '';
  }
  function arr_rand(arr, value) {
    var keys = Object.keys(arr);
    return arr[keys[parseInt(Math.random() * arr_len(arr) - 1)]];
  }
  function arr_splice(arr, st, en, els) {
    var prms = [st];
    if (typeof en !== 'undefined') prms.push(en);
    return Array.prototype.splice.apply(arr, prms.concat(els));
  }
  function arr_pad(src, len, el) {
    var i, arr = src.slice(0);
    if(len > 0) for(i = arr_len(arr);i < len;i++) arr.push(el);
    if(len < 0) for(i = arr_len(arr);i < -len;i++) arr.unshift(el);
    return arr;
  }
  function arr_reverse(src) {
    var arr = src.slice(0);
    arr.reverse();
    return arr;
  }
  function arr_sort(src) {
    var arr = src.slice(0);
    arr.sort();
    return arr;
  }
  function arr_sort_reverse(src) {
    var arr = src.slice(0);
    arr.sort();
    arr.reverse();
    return arr;
  }
  function arr_unique(src) {
    var i, arr = [];
    for(i in src) if (Object.prototype.hasOwnProperty.call(src, i)) if (!~arr.indexOf(src[i])) arr.push(src[i]);
    return arr;
  }
  function arr_key(arr, value) {
    var i;
    for(i in arr) if (Object.prototype.hasOwnProperty.call(arr, i)) if (value == arr[i]) return i;
    return -1;
  }
  function create(name, attrs, cb) {
    if (typeof name === 'object') return name;
    var childs = [];
    if (typeof cb === 'function') cb(childs);
    if (attrs) {
      return {
        type: 'node',
        name: name,
        attrs: attrs,
        childs: childs.filter(function (_child) { return _child !== null; })
      };
    }
    if (typeof name.toString === 'function') name = name.toString();
    return {
      type: 'text',
      text: name
    };
  }
  return function (data, childs) {
    var _childs = [];
var index, type;
var _arr0 = data['fields'];
for (data['index'] in _arr0) {
data['field'] = _arr0[data['index']];
_childs.push(create('\n'));
var _params1 = {};
(function () {
  var _attrValue2 = '';
_attrValue2 += 'form-table__row';
_params1['class'] = _attrValue2;
_attrValue2 = '';
})();
(function () {
  var _attrValue3 = '';
_attrValue3 += 'row-module-fields';
_params1['role'] = _attrValue3;
_attrValue3 = '';
})();
(function () {
  var _attrValue4 = '';
_attrValue4 += data['index'];
_params1['data-key'] = _attrValue4;
_attrValue4 = '';
})();
_childs.push(create('tr', _params1, function (_childs) {
_childs.push(create('\n  '));
var _params5 = {};
(function () {
  var _attrValue6 = '';
_attrValue6 += 'form-table__cell';
_params5['class'] = _attrValue6;
_attrValue6 = '';
})();
_childs.push(create('td', _params5, function (_childs) {
var _params7 = {};
(function () {
  var _attrValue8 = '';
_attrValue8 += 'text';
_params7['type'] = _attrValue8;
_attrValue8 = '';
})();
(function () {
  var _attrValue9 = '';
_attrValue9 += 'form__inp';
_params7['class'] = _attrValue9;
_attrValue9 = '';
})();
(function () {
  var _attrValue10 = '';
_attrValue10 += data['field']["title"];
_params7['value'] = _attrValue10;
_attrValue10 = '';
})();
(function () {
  var _attrValue11 = '';
_attrValue11 += 'field-title';
_params7['role'] = _attrValue11;
_attrValue11 = '';
})();
_childs.push(create('input', _params7));
}));
_childs.push(create('\n  '));
var _params12 = {};
(function () {
  var _attrValue13 = '';
_attrValue13 += 'form-table__cell';
_params12['class'] = _attrValue13;
_attrValue13 = '';
})();
_childs.push(create('td', _params12, function (_childs) {
var _params14 = {};
(function () {
  var _attrValue15 = '';
_attrValue15 += 'text';
_params14['type'] = _attrValue15;
_attrValue15 = '';
})();
(function () {
  var _attrValue16 = '';
_attrValue16 += 'form__inp';
_params14['class'] = _attrValue16;
_attrValue16 = '';
})();
(function () {
  var _attrValue17 = '';
_attrValue17 += data['field']["alias"];
_params14['value'] = _attrValue17;
_attrValue17 = '';
})();
(function () {
  var _attrValue18 = '';
_attrValue18 += 'field-alias';
_params14['role'] = _attrValue18;
_attrValue18 = '';
})();
_childs.push(create('input', _params14));
}));
_childs.push(create('\n  '));
var _params19 = {};
(function () {
  var _attrValue20 = '';
_attrValue20 += 'form-table__cell';
_params19['class'] = _attrValue20;
_attrValue20 = '';
})();
_childs.push(create('td', _params19, function (_childs) {
_childs.push(create('\n    '));
var _params21 = {};
(function () {
  var _attrValue22 = '';
_attrValue22 += 'form__select';
_params21['class'] = _attrValue22;
_attrValue22 = '';
})();
_childs.push(create('label', _params21, function (_childs) {
_childs.push(create('\n      '));
var _params23 = {};
(function () {
  var _attrValue24 = '';
_attrValue24 += 'form__select';
_params23['class'] = _attrValue24;
_attrValue24 = '';
})();
(function () {
  var _attrValue25 = '';
_attrValue25 += 'field-type';
_params23['role'] = _attrValue25;
_attrValue25 = '';
})();
_childs.push(create('select', _params23, function (_childs) {
_childs.push(create('\n    '));
data['hasSettings'] = false;
_childs.push(create('\n    '));
var _arr26 = data['types'];
for (data['type'] in _arr26) {
data['type'] = _arr26[data['type']];
_childs.push(create('\n        '));
var _params27 = {};
(function () {
  var _attrValue28 = '';
_attrValue28 += data['type']["type"];
_params27['value'] = _attrValue28;
_attrValue28 = '';
})();
(function () {
  var _attrValue29 = '';
if (data['field']["type"] == data['type']["type"]) {
_params27['selected'] = _attrValue29;
_attrValue29 = '';
}
})();
_childs.push(create('option', _params27, function (_childs) {
_childs.push(create(data['type']["name"]));
}));
_childs.push(create('\n      '));
if (data['field']["type"] == data['type']["type"]) {
_childs.push(create('\n        '));
if (data['type']["hasSettings"]) {
_childs.push(create('\n          '));
data['hasSettings'] = true;
_childs.push(create('\n        '));
}
_childs.push(create('\n      '));
}
_childs.push(create('\n    '));
}
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params30 = {};
(function () {
  var _attrValue31 = '';
_attrValue31 += 'form-table__cell';
_params30['class'] = _attrValue31;
_attrValue31 = '';
})();
_childs.push(create('td', _params30, function (_childs) {
_childs.push(create('\n    '));
if (data['hasSettings']) {
_childs.push(create('\n    '));
var _params32 = {};
(function () {
  var _attrValue33 = '';
_attrValue33 += 'form__btn';
_params32['class'] = _attrValue33;
_attrValue33 = '';
})();
(function () {
  var _attrValue34 = '';
_attrValue34 += 'button';
_params32['type'] = _attrValue34;
_attrValue34 = '';
})();
(function () {
  var _attrValue35 = '';
_attrValue35 += 'btn-config-field';
_params32['role'] = _attrValue35;
_attrValue35 = '';
})();
_childs.push(create('button', _params32, function (_childs) {
_childs.push(create('Н'));
}));
_childs.push(create('\n    '));
}
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params36 = {};
(function () {
  var _attrValue37 = '';
_attrValue37 += 'form-table__cell';
_params36['class'] = _attrValue37;
_attrValue37 = '';
})();
_childs.push(create('td', _params36, function (_childs) {
_childs.push(create('\n    '));
if (arr_len(data['fields']) > 1) {
_childs.push(create('\n    '));
var _params38 = {};
(function () {
  var _attrValue39 = '';
_attrValue39 += 'form__btn';
_params38['class'] = _attrValue39;
_attrValue39 = '';
})();
(function () {
  var _attrValue40 = '';
_attrValue40 += 'button';
_params38['type'] = _attrValue40;
_attrValue40 = '';
})();
(function () {
  var _attrValue41 = '';
_attrValue41 += 'btn-remove-field';
_params38['role'] = _attrValue41;
_attrValue41 = '';
})();
_childs.push(create('button', _params38, function (_childs) {
_childs.push(create('X'));
}));
_childs.push(create('\n    '));
}
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params42 = {};
(function () {
  var _attrValue43 = '';
_attrValue43 += 'form-table__cell';
_params42['class'] = _attrValue43;
_attrValue43 = '';
})();
_childs.push(create('td', _params42, function (_childs) {
_childs.push(create('\n    '));
var _params44 = {};
(function () {
  var _attrValue45 = '';
_attrValue45 += 'form-table__move';
_params44['class'] = _attrValue45;
_attrValue45 = '';
})();
(function () {
  var _attrValue46 = '';
_attrValue46 += 'btn-move-row';
_params44['role'] = _attrValue46;
_attrValue46 = '';
})();
_childs.push(create('span', _params44, function (_childs) {
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n'));
}));
_childs.push(create('\n'));
}    return _childs;
  };
});
},{}],2:[function(require,module,exports){
(function (factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define([], factory());
  }
})(function () {
  var MKARR_OPEN = 2 << 1;
  var MKARR_CLOSE = 1 << 1;
  function mkArr(start, end, flag) {
    var arr = [], i;
    if (flag & MKARR_OPEN) {
      if (start <= end) {
        for (i = start; i < end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i > end; i--) {
          arr.push(i);
        }
      }
    } else if (flag & MKARR_CLOSE) {
      if (start <= end) {
        for (i = start; i <= end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i >= end; i--) {
          arr.push(i);
        }
      }
    }
    return arr;
  }
  function str(str, len, sprtr) {
    if (!len) len = 0;
    if (typeof str.toString === 'function') str = str.toString();
    if (!sprtr) sprtr = '.';
    if (~str.indexOf('.')) {
      if (len > 0) {
        str = str.substr(0, str.indexOf('.') + len + 1);
      } else {
        str = str.substr(0, str.indexOf('.') + len);
      }
    } else {
      str = str_pad(str + '.', str.length + 1 + len, '0');
    }
    return str.replace('.', sprtr);
  }
  function str_replace(str, src, rep) {
    while (~str.indexOf(src)) {
      str = str.replace(src, rep);
    }
    return str;
  }
  var STRPADRIGHT = 1 << 1;
  var STRPADLEFT = 2 << 1;
  var STRPADBOTH = 4 << 1;
  function __str_pad_repeater(str, len) {
    var collect = '', i;
    while(collect.length < len) collect += str;
    collect = collect.substr(0, len);
    return collect;
  }
  function str_pad(str, len, sub, type) {
    if (typeof type === 'undefined') type = STRPADRIGHT;
    var half = '', pad_to_go;
    if ((pad_to_go = len - str.length) > 0) {
      if (type & STRPADLEFT) { str = __str_pad_repeater(sub, pad_to_go) + str; }
      else if (type & STRPADRIGHT) {str = str + __str_pad_repeater(sub, pad_to_go); }
      else if (type & STRPADBOTH) {
        half = __str_pad_repeater(sub, Math.ceil(pad_to_go/2));
        str = half + str + half;
        str = str.substr(0, len);
      }
    }
    return str;
  }
  function str_htmlescape(html) {
    return html.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  }
  function str_upfirst(str) {
    return str.split(/[\s\n\t]+/).map(function (item) {
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join(' ');
  }
  function str_camel(str) {
    return str.split(/[\s\n\t]+/).map(function (item, index) {
      if (!index) return item;
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join('');
  }
  function str_kebab(str) {
    return str.split(/[\s\n\t]+/).join('-');
  }
  function arr_values(obj) {
    var values = [], i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) values.push(obj[i]);
    return values;
  }
  function arr_contain(obj, value) {
    if(typeof obj.indexOf === 'function') return obj.indexOf(value) !== -1;
    var i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) if (obj[i] === value) return true;
    return false;
  }
  function arr_len(obj) {
    if(typeof obj.length !== 'undefined') return obj.length;
    var i, length = 0;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) length++;
    return length;
  }
  function arr_push(arr, value) {
    arr.push(value);
    return '';
  }
  function arr_unshift(arr, value) {
    arr.unshift(value);
    return '';
  }
  function arr_rand(arr, value) {
    var keys = Object.keys(arr);
    return arr[keys[parseInt(Math.random() * arr_len(arr) - 1)]];
  }
  function arr_splice(arr, st, en, els) {
    var prms = [st];
    if (typeof en !== 'undefined') prms.push(en);
    return Array.prototype.splice.apply(arr, prms.concat(els));
  }
  function arr_pad(src, len, el) {
    var i, arr = src.slice(0);
    if(len > 0) for(i = arr_len(arr);i < len;i++) arr.push(el);
    if(len < 0) for(i = arr_len(arr);i < -len;i++) arr.unshift(el);
    return arr;
  }
  function arr_reverse(src) {
    var arr = src.slice(0);
    arr.reverse();
    return arr;
  }
  function arr_sort(src) {
    var arr = src.slice(0);
    arr.sort();
    return arr;
  }
  function arr_sort_reverse(src) {
    var arr = src.slice(0);
    arr.sort();
    arr.reverse();
    return arr;
  }
  function arr_unique(src) {
    var i, arr = [];
    for(i in src) if (Object.prototype.hasOwnProperty.call(src, i)) if (!~arr.indexOf(src[i])) arr.push(src[i]);
    return arr;
  }
  function arr_key(arr, value) {
    var i;
    for(i in arr) if (Object.prototype.hasOwnProperty.call(arr, i)) if (value == arr[i]) return i;
    return -1;
  }
  function create(name, attrs, cb) {
    if (typeof name === 'object') return name;
    var childs = [];
    if (typeof cb === 'function') cb(childs);
    if (attrs) {
      return {
        type: 'node',
        name: name,
        attrs: attrs,
        childs: childs.filter(function (_child) { return _child !== null; })
      };
    }
    if (typeof name.toString === 'function') name = name.toString();
    return {
      type: 'text',
      text: name
    };
  }
  return function (data, childs) {
    var _childs = [];
var i;
var _params0 = {};
(function () {
  var _attrValue1 = '';
_attrValue1 += 'popup__head';
_params0['class'] = _attrValue1;
_attrValue1 = '';
})();
_childs.push(create('div', _params0, function (_childs) {
_childs.push(create('Настройки флажков'));
}));
_childs.push(create('\n'));
var _params2 = {};
(function () {
  var _attrValue3 = '';
_params2['action'] = _attrValue3;
_attrValue3 = '';
})();
(function () {
  var _attrValue4 = '';
_attrValue4 += 'form';
_params2['class'] = _attrValue4;
_attrValue4 = '';
})();
(function () {
  var _attrValue5 = '';
_attrValue5 += 'configs-form';
_params2['role'] = _attrValue5;
_attrValue5 = '';
})();
_childs.push(create('form', _params2, function (_childs) {
_childs.push(create('\n  '));
var _params6 = {};
(function () {
  var _attrValue7 = '';
_attrValue7 += 'form__item';
_params6['class'] = _attrValue7;
_attrValue7 = '';
})();
_childs.push(create('div', _params6, function (_childs) {
_childs.push(create('\n    '));
var _params8 = {};
(function () {
  var _attrValue9 = '';
_attrValue9 += 'configs-checkbox-num-options';
_params8['for'] = _attrValue9;
_attrValue9 = '';
})();
(function () {
  var _attrValue10 = '';
_attrValue10 += 'form__label';
_params8['class'] = _attrValue10;
_attrValue10 = '';
})();
_childs.push(create('label', _params8, function (_childs) {
_childs.push(create('Количество вариантов ответа'));
}));
_childs.push(create('\n    '));
var _params11 = {};
(function () {
  var _attrValue12 = '';
_attrValue12 += 'form__inp-contain';
_params11['class'] = _attrValue12;
_attrValue12 = '';
})();
_childs.push(create('div', _params11, function (_childs) {
_childs.push(create('\n      '));
var _params13 = {};
(function () {
  var _attrValue14 = '';
_attrValue14 += 'text';
_params13['type'] = _attrValue14;
_attrValue14 = '';
})();
(function () {
  var _attrValue15 = '';
_attrValue15 += 'form__inp form__inp--very-short';
_params13['class'] = _attrValue15;
_attrValue15 = '';
})();
(function () {
  var _attrValue16 = '';
_attrValue16 += data['numOptions'];
_params13['value'] = _attrValue16;
_attrValue16 = '';
})();
(function () {
  var _attrValue17 = '';
_attrValue17 += 'configs-checkbox-num-options';
_params13['role'] = _attrValue17;
_attrValue17 = '';
})();
(function () {
  var _attrValue18 = '';
_attrValue18 += 'configs-checkbox-num-options';
_params13['id'] = _attrValue18;
_attrValue18 = '';
})();
_childs.push(create('input', _params13));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params19 = {};
(function () {
  var _attrValue20 = '';
_attrValue20 += 'form__item';
_params19['class'] = _attrValue20;
_attrValue20 = '';
})();
_childs.push(create('div', _params19, function (_childs) {
_childs.push(create('\n    '));
var _params21 = {};
(function () {
  var _attrValue22 = '';
_attrValue22 += 'form__label';
_params21['class'] = _attrValue22;
_attrValue22 = '';
})();
_childs.push(create('label', _params21, function (_childs) {
_childs.push(create('Варианты ответов:'));
}));
_childs.push(create('\n    '));
var _params23 = {};
(function () {
  var _attrValue24 = '';
_attrValue24 += 'form__inp-contain form__inp-contain--full-width';
_params23['class'] = _attrValue24;
_attrValue24 = '';
})();
_childs.push(create('div', _params23, function (_childs) {
_childs.push(create('\n      '));
var _params25 = {};
(function () {
  var _attrValue26 = '';
_attrValue26 += 'configs-checkbox-options-contain';
_params25['role'] = _attrValue26;
_attrValue26 = '';
})();
_childs.push(create('div', _params25, function (_childs) {
_childs.push(create('\n        '));
var _arr27 = data['defaultData'];
for (data['i'] in _arr27) {
data['option'] = _arr27[data['i']];
_childs.push(create('\n        '));
var _params28 = {};
(function () {
  var _attrValue29 = '';
_attrValue29 += 'form__row-option';
_params28['class'] = _attrValue29;
_attrValue29 = '';
})();
_childs.push(create('div', _params28, function (_childs) {
_childs.push(create('\n          '));
var _params30 = {};
(function () {
  var _attrValue31 = '';
_attrValue31 += 'checkbox';
_params30['type'] = _attrValue31;
_attrValue31 = '';
})();
(function () {
  var _attrValue32 = '';
_attrValue32 += 'form__checkbox';
_params30['class'] = _attrValue32;
_attrValue32 = '';
})();
(function () {
  var _attrValue33 = '';
_attrValue33 += 'configs-checkbox-option';
_params30['role'] = _attrValue33;
_attrValue33 = '';
})();
(function () {
  var _attrValue34 = '';
_attrValue34 += data['i'];
_params30['value'] = _attrValue34;
_attrValue34 = '';
})();
(function () {
  var _attrValue35 = '';
_attrValue35 += data['i'];
_params30['data-index'] = _attrValue35;
_attrValue35 = '';
})();
(function () {
  var _attrValue36 = '';
_attrValue36 += 'configs-checkbox-option-';
_attrValue36 += data['i'];
_params30['id'] = _attrValue36;
_attrValue36 = '';
})();
(function () {
  var _attrValue37 = '';
_attrValue37 += 'configs-checkbox-option';
_params30['name'] = _attrValue37;
_attrValue37 = '';
})();
(function () {
  var _attrValue38 = '';
if (data['option']["checked"] == true || data['option']["checked"] == "true") {
_params30['checked'] = _attrValue38;
_attrValue38 = '';
}
})();
_childs.push(create('input', _params30));
_childs.push(create('\n          '));
var _params39 = {};
(function () {
  var _attrValue40 = '';
_attrValue40 += 'configs-checkbox-option-';
_attrValue40 += data['i'];
_params39['for'] = _attrValue40;
_attrValue40 = '';
})();
(function () {
  var _attrValue41 = '';
_attrValue41 += 'form__checkbox-label';
_params39['class'] = _attrValue41;
_attrValue41 = '';
})();
_childs.push(create('label', _params39, function (_childs) {
}));
_childs.push(create('\n          '));
var _params42 = {};
_childs.push(create('label', _params42, function (_childs) {
var _params43 = {};
(function () {
  var _attrValue44 = '';
_attrValue44 += 'text';
_params43['type'] = _attrValue44;
_attrValue44 = '';
})();
(function () {
  var _attrValue45 = '';
_attrValue45 += 'form__inp form__inp--half-width';
_params43['class'] = _attrValue45;
_attrValue45 = '';
})();
(function () {
  var _attrValue46 = '';
_attrValue46 += data['option']["label"];
_params43['value'] = _attrValue46;
_attrValue46 = '';
})();
(function () {
  var _attrValue47 = '';
_attrValue47 += 'configs-checkbox-option-label';
_params43['role'] = _attrValue47;
_attrValue47 = '';
})();
(function () {
  var _attrValue48 = '';
_attrValue48 += data['i'];
_params43['data-index'] = _attrValue48;
_attrValue48 = '';
})();
_childs.push(create('input', _params43));
}));
_childs.push(create('\n        '));
}));
_childs.push(create('\n        '));
}
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params49 = {};
(function () {
  var _attrValue50 = '';
_attrValue50 += 'form__submit';
_params49['class'] = _attrValue50;
_attrValue50 = '';
})();
_childs.push(create('div', _params49, function (_childs) {
_childs.push(create('\n    '));
var _params51 = {};
(function () {
  var _attrValue52 = '';
_attrValue52 += 'form__btn form__btn--submit';
_params51['class'] = _attrValue52;
_attrValue52 = '';
})();
_childs.push(create('button', _params51, function (_childs) {
_childs.push(create('Сохранить'));
}));
_childs.push(create('\n    '));
var _params53 = {};
(function () {
  var _attrValue54 = '';
_attrValue54 += 'button';
_params53['type'] = _attrValue54;
_attrValue54 = '';
})();
(function () {
  var _attrValue55 = '';
_attrValue55 += 'form__btn popup__cancel';
_params53['class'] = _attrValue55;
_attrValue55 = '';
})();
_childs.push(create('button', _params53, function (_childs) {
_childs.push(create('Отменить'));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n'));
}));
_childs.push(create('\n'));    return _childs;
  };
});
},{}],3:[function(require,module,exports){
(function (factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define([], factory());
  }
})(function () {
  var MKARR_OPEN = 2 << 1;
  var MKARR_CLOSE = 1 << 1;
  function mkArr(start, end, flag) {
    var arr = [], i;
    if (flag & MKARR_OPEN) {
      if (start <= end) {
        for (i = start; i < end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i > end; i--) {
          arr.push(i);
        }
      }
    } else if (flag & MKARR_CLOSE) {
      if (start <= end) {
        for (i = start; i <= end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i >= end; i--) {
          arr.push(i);
        }
      }
    }
    return arr;
  }
  function str(str, len, sprtr) {
    if (!len) len = 0;
    if (typeof str.toString === 'function') str = str.toString();
    if (!sprtr) sprtr = '.';
    if (~str.indexOf('.')) {
      if (len > 0) {
        str = str.substr(0, str.indexOf('.') + len + 1);
      } else {
        str = str.substr(0, str.indexOf('.') + len);
      }
    } else {
      str = str_pad(str + '.', str.length + 1 + len, '0');
    }
    return str.replace('.', sprtr);
  }
  function str_replace(str, src, rep) {
    while (~str.indexOf(src)) {
      str = str.replace(src, rep);
    }
    return str;
  }
  var STRPADRIGHT = 1 << 1;
  var STRPADLEFT = 2 << 1;
  var STRPADBOTH = 4 << 1;
  function __str_pad_repeater(str, len) {
    var collect = '', i;
    while(collect.length < len) collect += str;
    collect = collect.substr(0, len);
    return collect;
  }
  function str_pad(str, len, sub, type) {
    if (typeof type === 'undefined') type = STRPADRIGHT;
    var half = '', pad_to_go;
    if ((pad_to_go = len - str.length) > 0) {
      if (type & STRPADLEFT) { str = __str_pad_repeater(sub, pad_to_go) + str; }
      else if (type & STRPADRIGHT) {str = str + __str_pad_repeater(sub, pad_to_go); }
      else if (type & STRPADBOTH) {
        half = __str_pad_repeater(sub, Math.ceil(pad_to_go/2));
        str = half + str + half;
        str = str.substr(0, len);
      }
    }
    return str;
  }
  function str_htmlescape(html) {
    return html.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  }
  function str_upfirst(str) {
    return str.split(/[\s\n\t]+/).map(function (item) {
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join(' ');
  }
  function str_camel(str) {
    return str.split(/[\s\n\t]+/).map(function (item, index) {
      if (!index) return item;
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join('');
  }
  function str_kebab(str) {
    return str.split(/[\s\n\t]+/).join('-');
  }
  function arr_values(obj) {
    var values = [], i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) values.push(obj[i]);
    return values;
  }
  function arr_contain(obj, value) {
    if(typeof obj.indexOf === 'function') return obj.indexOf(value) !== -1;
    var i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) if (obj[i] === value) return true;
    return false;
  }
  function arr_len(obj) {
    if(typeof obj.length !== 'undefined') return obj.length;
    var i, length = 0;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) length++;
    return length;
  }
  function arr_push(arr, value) {
    arr.push(value);
    return '';
  }
  function arr_unshift(arr, value) {
    arr.unshift(value);
    return '';
  }
  function arr_rand(arr, value) {
    var keys = Object.keys(arr);
    return arr[keys[parseInt(Math.random() * arr_len(arr) - 1)]];
  }
  function arr_splice(arr, st, en, els) {
    var prms = [st];
    if (typeof en !== 'undefined') prms.push(en);
    return Array.prototype.splice.apply(arr, prms.concat(els));
  }
  function arr_pad(src, len, el) {
    var i, arr = src.slice(0);
    if(len > 0) for(i = arr_len(arr);i < len;i++) arr.push(el);
    if(len < 0) for(i = arr_len(arr);i < -len;i++) arr.unshift(el);
    return arr;
  }
  function arr_reverse(src) {
    var arr = src.slice(0);
    arr.reverse();
    return arr;
  }
  function arr_sort(src) {
    var arr = src.slice(0);
    arr.sort();
    return arr;
  }
  function arr_sort_reverse(src) {
    var arr = src.slice(0);
    arr.sort();
    arr.reverse();
    return arr;
  }
  function arr_unique(src) {
    var i, arr = [];
    for(i in src) if (Object.prototype.hasOwnProperty.call(src, i)) if (!~arr.indexOf(src[i])) arr.push(src[i]);
    return arr;
  }
  function arr_key(arr, value) {
    var i;
    for(i in arr) if (Object.prototype.hasOwnProperty.call(arr, i)) if (value == arr[i]) return i;
    return -1;
  }
  function create(name, attrs, cb) {
    if (typeof name === 'object') return name;
    var childs = [];
    if (typeof cb === 'function') cb(childs);
    if (attrs) {
      return {
        type: 'node',
        name: name,
        attrs: attrs,
        childs: childs.filter(function (_child) { return _child !== null; })
      };
    }
    if (typeof name.toString === 'function') name = name.toString();
    return {
      type: 'text',
      text: name
    };
  }
  return function (data, childs) {
    var _childs = [];
var bucket;
var _params0 = {};
(function () {
  var _attrValue1 = '';
_attrValue1 += 'popup__head';
_params0['class'] = _attrValue1;
_attrValue1 = '';
})();
_childs.push(create('div', _params0, function (_childs) {
_childs.push(create('Настройки файла'));
}));
_childs.push(create('\n'));
data['isEmpty'] = !data['s3AccessKey'].length || !data['s3SecretKey'].length;
_childs.push(create('\n'));
data['isS3auth'] = (typeof data['s3auth'] !== 'undefined' ? data['s3auth'] : '') && (data['s3auth'] == true || data['s3auth'] == "true");
_childs.push(create('\n'));
data['isS3Checking'] = (typeof data['s3checking'] !== 'undefined' ? data['s3checking'] : '') && (data['s3checking'] == true || data['s3checking'] == "true");
_childs.push(create('\n'));
var _params2 = {};
(function () {
  var _attrValue3 = '';
_params2['action'] = _attrValue3;
_attrValue3 = '';
})();
(function () {
  var _attrValue4 = '';
_attrValue4 += 'form';
_params2['class'] = _attrValue4;
_attrValue4 = '';
})();
(function () {
  var _attrValue5 = '';
_attrValue5 += 'configs-form';
_params2['role'] = _attrValue5;
_attrValue5 = '';
})();
_childs.push(create('form', _params2, function (_childs) {
_childs.push(create('\n  '));
var _params6 = {};
(function () {
  var _attrValue7 = '';
_attrValue7 += 'form__item';
_params6['class'] = _attrValue7;
_attrValue7 = '';
})();
_childs.push(create('div', _params6, function (_childs) {
_childs.push(create('\n    '));
var _params8 = {};
(function () {
  var _attrValue9 = '';
_attrValue9 += 'form__label';
_params8['class'] = _attrValue9;
_attrValue9 = '';
})();
_childs.push(create('label', _params8, function (_childs) {
_childs.push(create('Хранилище'));
}));
_childs.push(create('\n    '));
var _params10 = {};
(function () {
  var _attrValue11 = '';
_attrValue11 += 'form__inp-contain';
_params10['class'] = _attrValue11;
_attrValue11 = '';
})();
_childs.push(create('div', _params10, function (_childs) {
_childs.push(create('\n      '));
var _params12 = {};
(function () {
  var _attrValue13 = '';
_attrValue13 += 'tabs';
_params12['class'] = _attrValue13;
_attrValue13 = '';
})();
_childs.push(create('div', _params12, function (_childs) {
_childs.push(create('\n        '));
var _params14 = {};
(function () {
  var _attrValue15 = '';
_attrValue15 += 'button';
_params14['type'] = _attrValue15;
_attrValue15 = '';
})();
(function () {
  var _attrValue16 = '';
_attrValue16 += 'tabs__item';
if (data['storage'] == "local") {
_attrValue16 += ' tabs__item--active';
}
_params14['class'] = _attrValue16;
_attrValue16 = '';
})();
(function () {
  var _attrValue17 = '';
_attrValue17 += 'configs-file-storage';
_params14['role'] = _attrValue17;
_attrValue17 = '';
})();
(function () {
  var _attrValue18 = '';
_attrValue18 += 'local';
_params14['data-value'] = _attrValue18;
_attrValue18 = '';
})();
_childs.push(create('button', _params14, function (_childs) {
_childs.push(create('Локальное'));
}));
_childs.push(create('\n        '));
var _params19 = {};
(function () {
  var _attrValue20 = '';
_attrValue20 += 'button';
_params19['type'] = _attrValue20;
_attrValue20 = '';
})();
(function () {
  var _attrValue21 = '';
_attrValue21 += 'tabs__item';
if (data['storage'] == "s3") {
_attrValue21 += ' tabs__item--active';
}
_params19['class'] = _attrValue21;
_attrValue21 = '';
})();
(function () {
  var _attrValue22 = '';
_attrValue22 += 'configs-file-storage';
_params19['role'] = _attrValue22;
_attrValue22 = '';
})();
(function () {
  var _attrValue23 = '';
_attrValue23 += 's3';
_params19['data-value'] = _attrValue23;
_attrValue23 = '';
})();
_childs.push(create('button', _params19, function (_childs) {
_childs.push(create('S3'));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params24 = {};
(function () {
  var _attrValue25 = '';
_attrValue25 += 'configs-file-modal-storage-local configs-file-modal-storage-frame';
_params24['role'] = _attrValue25;
_attrValue25 = '';
})();
(function () {
  var _attrValue26 = '';
if (data['storage'] != "local") {
_attrValue26 += 'display: none';
_params24['style'] = _attrValue26;
_attrValue26 = '';
}
})();
_childs.push(create('div', _params24, function (_childs) {
_childs.push(create('\n    '));
var _params27 = {};
(function () {
  var _attrValue28 = '';
_attrValue28 += 'form__item';
_params27['class'] = _attrValue28;
_attrValue28 = '';
})();
_childs.push(create('div', _params27, function (_childs) {
_childs.push(create('\n      '));
var _params29 = {};
(function () {
  var _attrValue30 = '';
_attrValue30 += 'configs-file-path';
_params29['for'] = _attrValue30;
_attrValue30 = '';
})();
(function () {
  var _attrValue31 = '';
_attrValue31 += 'form__label';
_params29['class'] = _attrValue31;
_attrValue31 = '';
})();
_childs.push(create('label', _params29, function (_childs) {
_childs.push(create('Путь'));
}));
_childs.push(create('\n      '));
var _params32 = {};
(function () {
  var _attrValue33 = '';
_attrValue33 += 'form__inp-contain';
_params32['class'] = _attrValue33;
_attrValue33 = '';
})();
_childs.push(create('div', _params32, function (_childs) {
_childs.push(create('\n        '));
var _params34 = {};
(function () {
  var _attrValue35 = '';
_attrValue35 += 'text';
_params34['type'] = _attrValue35;
_attrValue35 = '';
})();
(function () {
  var _attrValue36 = '';
_attrValue36 += 'form__inp';
_params34['class'] = _attrValue36;
_attrValue36 = '';
})();
(function () {
  var _attrValue37 = '';
_attrValue37 += data['path'];
_params34['value'] = _attrValue37;
_attrValue37 = '';
})();
(function () {
  var _attrValue38 = '';
_attrValue38 += 'configs-file-path';
_params34['role'] = _attrValue38;
_attrValue38 = '';
})();
(function () {
  var _attrValue39 = '';
_attrValue39 += 'configs-file-path';
_params34['id'] = _attrValue39;
_attrValue39 = '';
})();
_childs.push(create('input', _params34));
_childs.push(create('\n        '));
if ((typeof data['pathError'] !== 'undefined' ? data['pathError'] : '') && (data['pathError'])) {
_childs.push(create('\n        '));
var _params40 = {};
(function () {
  var _attrValue41 = '';
_attrValue41 += 'form__error';
_params40['class'] = _attrValue41;
_attrValue41 = '';
})();
_childs.push(create('span', _params40, function (_childs) {
_childs.push(create(data['pathError']));
}));
_childs.push(create('\n        '));
}
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params42 = {};
(function () {
  var _attrValue43 = '';
_attrValue43 += 'configs-file-modal-storage-s3 configs-file-modal-storage-frame';
_params42['role'] = _attrValue43;
_attrValue43 = '';
})();
(function () {
  var _attrValue44 = '';
if (data['storage'] != "s3") {
_attrValue44 += 'display: none';
_params42['style'] = _attrValue44;
_attrValue44 = '';
}
})();
_childs.push(create('div', _params42, function (_childs) {
_childs.push(create('\n    '));
var _params45 = {};
(function () {
  var _attrValue46 = '';
_attrValue46 += 'form__item';
_params45['class'] = _attrValue46;
_attrValue46 = '';
})();
_childs.push(create('div', _params45, function (_childs) {
_childs.push(create('\n      '));
var _params47 = {};
(function () {
  var _attrValue48 = '';
_attrValue48 += 'configs-file-s3-access-key';
_params47['for'] = _attrValue48;
_attrValue48 = '';
})();
(function () {
  var _attrValue49 = '';
_attrValue49 += 'form__label';
_params47['class'] = _attrValue49;
_attrValue49 = '';
})();
_childs.push(create('label', _params47, function (_childs) {
_childs.push(create('Access key'));
}));
_childs.push(create('\n      '));
var _params50 = {};
(function () {
  var _attrValue51 = '';
_attrValue51 += 'form__inp-contain';
_params50['class'] = _attrValue51;
_attrValue51 = '';
})();
_childs.push(create('div', _params50, function (_childs) {
_childs.push(create('\n        '));
var _params52 = {};
(function () {
  var _attrValue53 = '';
_attrValue53 += 'text';
_params52['type'] = _attrValue53;
_attrValue53 = '';
})();
(function () {
  var _attrValue54 = '';
_attrValue54 += 'form__inp';
_params52['class'] = _attrValue54;
_attrValue54 = '';
})();
(function () {
  var _attrValue55 = '';
_attrValue55 += data['s3AccessKey'];
_params52['value'] = _attrValue55;
_attrValue55 = '';
})();
(function () {
  var _attrValue56 = '';
_attrValue56 += 'configs-file-s3-access-key';
_params52['role'] = _attrValue56;
_attrValue56 = '';
})();
(function () {
  var _attrValue57 = '';
_attrValue57 += 'configs-file-s3-access-key';
_params52['id'] = _attrValue57;
_attrValue57 = '';
})();
_childs.push(create('input', _params52));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n    '));
var _params58 = {};
(function () {
  var _attrValue59 = '';
_attrValue59 += 'form__item';
_params58['class'] = _attrValue59;
_attrValue59 = '';
})();
_childs.push(create('div', _params58, function (_childs) {
_childs.push(create('\n      '));
var _params60 = {};
(function () {
  var _attrValue61 = '';
_attrValue61 += 'configs-file-s3-secret-key';
_params60['for'] = _attrValue61;
_attrValue61 = '';
})();
(function () {
  var _attrValue62 = '';
_attrValue62 += 'form__label';
_params60['class'] = _attrValue62;
_attrValue62 = '';
})();
_childs.push(create('label', _params60, function (_childs) {
_childs.push(create('Secret key'));
}));
_childs.push(create('\n      '));
var _params63 = {};
(function () {
  var _attrValue64 = '';
_attrValue64 += 'form__inp-contain';
_params63['class'] = _attrValue64;
_attrValue64 = '';
})();
_childs.push(create('div', _params63, function (_childs) {
_childs.push(create('\n        '));
var _params65 = {};
(function () {
  var _attrValue66 = '';
_attrValue66 += 'password';
_params65['type'] = _attrValue66;
_attrValue66 = '';
})();
(function () {
  var _attrValue67 = '';
_attrValue67 += 'form__inp';
_params65['class'] = _attrValue67;
_attrValue67 = '';
})();
(function () {
  var _attrValue68 = '';
_params65['value'] = _attrValue68;
_attrValue68 = '';
})();
(function () {
  var _attrValue69 = '';
_attrValue69 += 'configs-file-s3-secret-key';
_params65['role'] = _attrValue69;
_attrValue69 = '';
})();
(function () {
  var _attrValue70 = '';
_attrValue70 += 'configs-file-s3-secret-key';
_params65['id'] = _attrValue70;
_attrValue70 = '';
})();
_childs.push(create('input', _params65));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n    '));
var _params71 = {};
(function () {
  var _attrValue72 = '';
_attrValue72 += 'form__item';
_params71['class'] = _attrValue72;
_attrValue72 = '';
})();
_childs.push(create('div', _params71, function (_childs) {
_childs.push(create('\n      '));
var _params73 = {};
(function () {
  var _attrValue74 = '';
_attrValue74 += 'form__inp-contain';
_params73['class'] = _attrValue74;
_attrValue74 = '';
})();
_childs.push(create('div', _params73, function (_childs) {
_childs.push(create('\n        '));
var _params75 = {};
(function () {
  var _attrValue76 = '';
_attrValue76 += 'button';
_params75['type'] = _attrValue76;
_attrValue76 = '';
})();
(function () {
  var _attrValue77 = '';
_attrValue77 += 'form__btn';
_params75['class'] = _attrValue77;
_attrValue77 = '';
})();
(function () {
  var _attrValue78 = '';
_attrValue78 += 'test-connection-s3';
_params75['role'] = _attrValue78;
_attrValue78 = '';
})();
(function () {
  var _attrValue79 = '';
if (data['isEmpty'] || data['isS3auth'] || data['isS3checking']) {
_params75['disabled'] = _attrValue79;
_attrValue79 = '';
}
})();
_childs.push(create('button', _params75, function (_childs) {
_childs.push(create('\n          '));
if (data['isS3checking']) {
_childs.push(create('\n          Соединение...\n          '));
} else if (data['isS3auth']) {
_childs.push(create('\n          Готово\n          '));
} else {
_childs.push(create('\n          Подключиться\n          '));
}
_childs.push(create('\n        '));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n    '));
if (data['isS3auth'] == "true" || data['isS3auth'] == true) {
_childs.push(create('\n      '));
var _params80 = {};
(function () {
  var _attrValue81 = '';
_attrValue81 += 'form__item';
_params80['class'] = _attrValue81;
_attrValue81 = '';
})();
_childs.push(create('div', _params80, function (_childs) {
_childs.push(create('\n        '));
var _params82 = {};
(function () {
  var _attrValue83 = '';
_attrValue83 += 'configs-file-s3-bucket';
_params82['for'] = _attrValue83;
_attrValue83 = '';
})();
(function () {
  var _attrValue84 = '';
_attrValue84 += 'form__label';
_params82['class'] = _attrValue84;
_attrValue84 = '';
})();
_childs.push(create('label', _params82, function (_childs) {
_childs.push(create('Bucket'));
}));
_childs.push(create('\n        '));
var _params85 = {};
(function () {
  var _attrValue86 = '';
_attrValue86 += 'form__inp-contain';
_params85['class'] = _attrValue86;
_attrValue86 = '';
})();
_childs.push(create('div', _params85, function (_childs) {
_childs.push(create('\n        '));
if ((typeof data['buckets'] !== 'undefined' ? data['buckets'] : '') && count(data['buckets'])) {
_childs.push(create('\n          '));
var _params87 = {};
(function () {
  var _attrValue88 = '';
_attrValue88 += 'form__select';
_params87['class'] = _attrValue88;
_attrValue88 = '';
})();
_childs.push(create('label', _params87, function (_childs) {
_childs.push(create('\n            '));
var _params89 = {};
(function () {
  var _attrValue90 = '';
_attrValue90 += 'configs-file-s3-bucket';
_params89['role'] = _attrValue90;
_attrValue90 = '';
})();
(function () {
  var _attrValue91 = '';
_attrValue91 += 'configs-file-s3-bucket';
_params89['id'] = _attrValue91;
_attrValue91 = '';
})();
_childs.push(create('select', _params89, function (_childs) {
_childs.push(create('\n              '));
var _arr92 = data['buckets'];
for (data['bucket'] in _arr92) {
data['bucket'] = _arr92[data['bucket']];
_childs.push(create('\n              '));
var _params93 = {};
(function () {
  var _attrValue94 = '';
_attrValue94 += data['bucket'];
_params93['value'] = _attrValue94;
_attrValue94 = '';
})();
(function () {
  var _attrValue95 = '';
if (!!(typeof data['s3Bucket'] !== 'undefined' ? data['s3Bucket'] : '') && (data['s3Bucket'] == data['bucket'])) {
_params93['selected'] = _attrValue95;
_attrValue95 = '';
}
})();
_childs.push(create('option', _params93, function (_childs) {
_childs.push(create(data['bucket']));
}));
_childs.push(create('\n              '));
}
_childs.push(create('\n            '));
}));
_childs.push(create('\n          '));
}));
_childs.push(create('\n        '));
} else {
_childs.push(create('\n          '));
var _params96 = {};
(function () {
  var _attrValue97 = '';
_attrValue97 += 'text';
_params96['type'] = _attrValue97;
_attrValue97 = '';
})();
(function () {
  var _attrValue98 = '';
_attrValue98 += 'form__inp';
_params96['class'] = _attrValue98;
_attrValue98 = '';
})();
(function () {
  var _attrValue99 = '';
_attrValue99 += (typeof data['s3Bucket'] !== 'undefined' ? data['s3Bucket'] : '');
_params96['value'] = _attrValue99;
_attrValue99 = '';
})();
(function () {
  var _attrValue100 = '';
_attrValue100 += 'configs-file-s3-bucket';
_params96['role'] = _attrValue100;
_attrValue100 = '';
})();
(function () {
  var _attrValue101 = '';
_attrValue101 += 'configs-file-s3-bucket';
_params96['id'] = _attrValue101;
_attrValue101 = '';
})();
_childs.push(create('input', _params96));
_childs.push(create('\n        '));
}
_childs.push(create('\n        '));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n      '));
var _params102 = {};
(function () {
  var _attrValue103 = '';
_attrValue103 += 'form__item';
_params102['class'] = _attrValue103;
_attrValue103 = '';
})();
_childs.push(create('div', _params102, function (_childs) {
_childs.push(create('\n        '));
var _params104 = {};
(function () {
  var _attrValue105 = '';
_attrValue105 += 'configs-file-s3-path';
_params104['for'] = _attrValue105;
_attrValue105 = '';
})();
(function () {
  var _attrValue106 = '';
_attrValue106 += 'form__label';
_params104['class'] = _attrValue106;
_attrValue106 = '';
})();
_childs.push(create('label', _params104, function (_childs) {
_childs.push(create('Путь'));
}));
_childs.push(create('\n        '));
var _params107 = {};
(function () {
  var _attrValue108 = '';
_attrValue108 += 'form__inp-contain';
_params107['class'] = _attrValue108;
_attrValue108 = '';
})();
_childs.push(create('div', _params107, function (_childs) {
_childs.push(create('\n          '));
var _params109 = {};
(function () {
  var _attrValue110 = '';
_attrValue110 += 'text';
_params109['type'] = _attrValue110;
_attrValue110 = '';
})();
(function () {
  var _attrValue111 = '';
_attrValue111 += 'form__inp';
_params109['class'] = _attrValue111;
_attrValue111 = '';
})();
(function () {
  var _attrValue112 = '';
_attrValue112 += data['s3Path'];
_params109['value'] = _attrValue112;
_attrValue112 = '';
})();
(function () {
  var _attrValue113 = '';
_attrValue113 += 'configs-file-s3-path';
_params109['role'] = _attrValue113;
_attrValue113 = '';
})();
(function () {
  var _attrValue114 = '';
_attrValue114 += 'configs-file-s3-path';
_params109['id'] = _attrValue114;
_attrValue114 = '';
})();
_childs.push(create('input', _params109));
_childs.push(create('\n          '));
if ((typeof data['s3PathError'] !== 'undefined' ? data['s3PathError'] : '') && (data['s3PathError'])) {
_childs.push(create('\n            '));
var _params115 = {};
(function () {
  var _attrValue116 = '';
_attrValue116 += 'form__error';
_params115['class'] = _attrValue116;
_attrValue116 = '';
})();
_childs.push(create('span', _params115, function (_childs) {
_childs.push(create(data['s3PathError']));
}));
_childs.push(create('\n          '));
}
_childs.push(create('\n        '));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params117 = {};
(function () {
  var _attrValue118 = '';
_attrValue118 += 'form__submit';
_params117['class'] = _attrValue118;
_attrValue118 = '';
})();
_childs.push(create('div', _params117, function (_childs) {
_childs.push(create('\n    '));
var _params119 = {};
(function () {
  var _attrValue120 = '';
_attrValue120 += 'form__btn form__btn--submit';
_params119['class'] = _attrValue120;
_attrValue120 = '';
})();
(function () {
  var _attrValue121 = '';
if ((data['storage'] == "local" && ((typeof data['pathError'] !== 'undefined' ? data['pathError'] : '') && data['pathError'])) || (data['storage'] == "s3" && (!data['isS3auth'] || data['s3PathError']))) {
_params119['disabled'] = _attrValue121;
_attrValue121 = '';
}
})();
_childs.push(create('button', _params119, function (_childs) {
_childs.push(create('Сохранить'));
}));
_childs.push(create('\n    '));
var _params122 = {};
(function () {
  var _attrValue123 = '';
_attrValue123 += 'button';
_params122['type'] = _attrValue123;
_attrValue123 = '';
})();
(function () {
  var _attrValue124 = '';
_attrValue124 += 'form__btn popup__cancel';
_params122['class'] = _attrValue124;
_attrValue124 = '';
})();
_childs.push(create('button', _params122, function (_childs) {
_childs.push(create('Отменить'));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n'));
}));
_childs.push(create('\n'));    return _childs;
  };
});
},{}],4:[function(require,module,exports){
(function (factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define([], factory());
  }
})(function () {
  var MKARR_OPEN = 2 << 1;
  var MKARR_CLOSE = 1 << 1;
  function mkArr(start, end, flag) {
    var arr = [], i;
    if (flag & MKARR_OPEN) {
      if (start <= end) {
        for (i = start; i < end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i > end; i--) {
          arr.push(i);
        }
      }
    } else if (flag & MKARR_CLOSE) {
      if (start <= end) {
        for (i = start; i <= end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i >= end; i--) {
          arr.push(i);
        }
      }
    }
    return arr;
  }
  function str(str, len, sprtr) {
    if (!len) len = 0;
    if (typeof str.toString === 'function') str = str.toString();
    if (!sprtr) sprtr = '.';
    if (~str.indexOf('.')) {
      if (len > 0) {
        str = str.substr(0, str.indexOf('.') + len + 1);
      } else {
        str = str.substr(0, str.indexOf('.') + len);
      }
    } else {
      str = str_pad(str + '.', str.length + 1 + len, '0');
    }
    return str.replace('.', sprtr);
  }
  function str_replace(str, src, rep) {
    while (~str.indexOf(src)) {
      str = str.replace(src, rep);
    }
    return str;
  }
  var STRPADRIGHT = 1 << 1;
  var STRPADLEFT = 2 << 1;
  var STRPADBOTH = 4 << 1;
  function __str_pad_repeater(str, len) {
    var collect = '', i;
    while(collect.length < len) collect += str;
    collect = collect.substr(0, len);
    return collect;
  }
  function str_pad(str, len, sub, type) {
    if (typeof type === 'undefined') type = STRPADRIGHT;
    var half = '', pad_to_go;
    if ((pad_to_go = len - str.length) > 0) {
      if (type & STRPADLEFT) { str = __str_pad_repeater(sub, pad_to_go) + str; }
      else if (type & STRPADRIGHT) {str = str + __str_pad_repeater(sub, pad_to_go); }
      else if (type & STRPADBOTH) {
        half = __str_pad_repeater(sub, Math.ceil(pad_to_go/2));
        str = half + str + half;
        str = str.substr(0, len);
      }
    }
    return str;
  }
  function str_htmlescape(html) {
    return html.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  }
  function str_upfirst(str) {
    return str.split(/[\s\n\t]+/).map(function (item) {
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join(' ');
  }
  function str_camel(str) {
    return str.split(/[\s\n\t]+/).map(function (item, index) {
      if (!index) return item;
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join('');
  }
  function str_kebab(str) {
    return str.split(/[\s\n\t]+/).join('-');
  }
  function arr_values(obj) {
    var values = [], i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) values.push(obj[i]);
    return values;
  }
  function arr_contain(obj, value) {
    if(typeof obj.indexOf === 'function') return obj.indexOf(value) !== -1;
    var i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) if (obj[i] === value) return true;
    return false;
  }
  function arr_len(obj) {
    if(typeof obj.length !== 'undefined') return obj.length;
    var i, length = 0;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) length++;
    return length;
  }
  function arr_push(arr, value) {
    arr.push(value);
    return '';
  }
  function arr_unshift(arr, value) {
    arr.unshift(value);
    return '';
  }
  function arr_rand(arr, value) {
    var keys = Object.keys(arr);
    return arr[keys[parseInt(Math.random() * arr_len(arr) - 1)]];
  }
  function arr_splice(arr, st, en, els) {
    var prms = [st];
    if (typeof en !== 'undefined') prms.push(en);
    return Array.prototype.splice.apply(arr, prms.concat(els));
  }
  function arr_pad(src, len, el) {
    var i, arr = src.slice(0);
    if(len > 0) for(i = arr_len(arr);i < len;i++) arr.push(el);
    if(len < 0) for(i = arr_len(arr);i < -len;i++) arr.unshift(el);
    return arr;
  }
  function arr_reverse(src) {
    var arr = src.slice(0);
    arr.reverse();
    return arr;
  }
  function arr_sort(src) {
    var arr = src.slice(0);
    arr.sort();
    return arr;
  }
  function arr_sort_reverse(src) {
    var arr = src.slice(0);
    arr.sort();
    arr.reverse();
    return arr;
  }
  function arr_unique(src) {
    var i, arr = [];
    for(i in src) if (Object.prototype.hasOwnProperty.call(src, i)) if (!~arr.indexOf(src[i])) arr.push(src[i]);
    return arr;
  }
  function arr_key(arr, value) {
    var i;
    for(i in arr) if (Object.prototype.hasOwnProperty.call(arr, i)) if (value == arr[i]) return i;
    return -1;
  }
  function create(name, attrs, cb) {
    if (typeof name === 'object') return name;
    var childs = [];
    if (typeof cb === 'function') cb(childs);
    if (attrs) {
      return {
        type: 'node',
        name: name,
        attrs: attrs,
        childs: childs.filter(function (_child) { return _child !== null; })
      };
    }
    if (typeof name.toString === 'function') name = name.toString();
    return {
      type: 'text',
      text: name
    };
  }
  return function (data, childs) {
    var _childs = [];
var bucket;
var _params0 = {};
(function () {
  var _attrValue1 = '';
_attrValue1 += 'popup__head';
_params0['class'] = _attrValue1;
_attrValue1 = '';
})();
_childs.push(create('div', _params0, function (_childs) {
_childs.push(create('Настройки изображения'));
}));
_childs.push(create('\n'));
data['isEmpty'] = !data['s3AccessKey'].length || !data['s3SecretKey'].length;
_childs.push(create('\n'));
var _params2 = {};
(function () {
  var _attrValue3 = '';
_params2['action'] = _attrValue3;
_attrValue3 = '';
})();
(function () {
  var _attrValue4 = '';
_attrValue4 += 'form';
_params2['class'] = _attrValue4;
_attrValue4 = '';
})();
(function () {
  var _attrValue5 = '';
_attrValue5 += 'configs-form';
_params2['role'] = _attrValue5;
_attrValue5 = '';
})();
_childs.push(create('form', _params2, function (_childs) {
_childs.push(create('\n  '));
var _params6 = {};
(function () {
  var _attrValue7 = '';
_attrValue7 += 'form__item';
_params6['class'] = _attrValue7;
_attrValue7 = '';
})();
_childs.push(create('div', _params6, function (_childs) {
_childs.push(create('\n    '));
var _params8 = {};
(function () {
  var _attrValue9 = '';
_attrValue9 += 'form__label';
_params8['class'] = _attrValue9;
_attrValue9 = '';
})();
_childs.push(create('label', _params8, function (_childs) {
_childs.push(create('Хранилище'));
}));
_childs.push(create('\n    '));
var _params10 = {};
(function () {
  var _attrValue11 = '';
_attrValue11 += 'form__inp-contain';
_params10['class'] = _attrValue11;
_attrValue11 = '';
})();
_childs.push(create('div', _params10, function (_childs) {
_childs.push(create('\n      '));
var _params12 = {};
(function () {
  var _attrValue13 = '';
_attrValue13 += 'tabs';
_params12['class'] = _attrValue13;
_attrValue13 = '';
})();
_childs.push(create('div', _params12, function (_childs) {
_childs.push(create('\n        '));
var _params14 = {};
(function () {
  var _attrValue15 = '';
_attrValue15 += 'button';
_params14['type'] = _attrValue15;
_attrValue15 = '';
})();
(function () {
  var _attrValue16 = '';
_attrValue16 += 'tabs__item';
if (data['storage'] == "local") {
_attrValue16 += ' tabs__item--active';
}
_params14['class'] = _attrValue16;
_attrValue16 = '';
})();
(function () {
  var _attrValue17 = '';
_attrValue17 += 'configs-gallery-storage';
_params14['role'] = _attrValue17;
_attrValue17 = '';
})();
(function () {
  var _attrValue18 = '';
_attrValue18 += 'local';
_params14['data-value'] = _attrValue18;
_attrValue18 = '';
})();
_childs.push(create('button', _params14, function (_childs) {
_childs.push(create('Локальное'));
}));
_childs.push(create('\n        '));
var _params19 = {};
(function () {
  var _attrValue20 = '';
_attrValue20 += 'button';
_params19['type'] = _attrValue20;
_attrValue20 = '';
})();
(function () {
  var _attrValue21 = '';
_attrValue21 += 'tabs__item';
if (data['storage'] == "s3") {
_attrValue21 += ' tabs__item--active';
}
_params19['class'] = _attrValue21;
_attrValue21 = '';
})();
(function () {
  var _attrValue22 = '';
_attrValue22 += 'configs-gallery-storage';
_params19['role'] = _attrValue22;
_attrValue22 = '';
})();
(function () {
  var _attrValue23 = '';
_attrValue23 += 's3';
_params19['data-value'] = _attrValue23;
_attrValue23 = '';
})();
_childs.push(create('button', _params19, function (_childs) {
_childs.push(create('S3'));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params24 = {};
(function () {
  var _attrValue25 = '';
_attrValue25 += 'configs-gallery-modal-storage-local configs-gallery-modal-storage-frame';
_params24['role'] = _attrValue25;
_attrValue25 = '';
})();
(function () {
  var _attrValue26 = '';
if (data['storage'] != "local") {
_attrValue26 += 'display: none';
_params24['style'] = _attrValue26;
_attrValue26 = '';
}
})();
_childs.push(create('div', _params24, function (_childs) {
_childs.push(create('\n    '));
var _params27 = {};
(function () {
  var _attrValue28 = '';
_attrValue28 += 'form__item';
_params27['class'] = _attrValue28;
_attrValue28 = '';
})();
_childs.push(create('div', _params27, function (_childs) {
_childs.push(create('\n      '));
var _params29 = {};
(function () {
  var _attrValue30 = '';
_attrValue30 += 'configs-gallery-path';
_params29['for'] = _attrValue30;
_attrValue30 = '';
})();
(function () {
  var _attrValue31 = '';
_attrValue31 += 'form__label';
_params29['class'] = _attrValue31;
_attrValue31 = '';
})();
_childs.push(create('label', _params29, function (_childs) {
_childs.push(create('Путь'));
}));
_childs.push(create('\n      '));
var _params32 = {};
(function () {
  var _attrValue33 = '';
_attrValue33 += 'form__inp-contain';
_params32['class'] = _attrValue33;
_attrValue33 = '';
})();
_childs.push(create('div', _params32, function (_childs) {
_childs.push(create('\n        '));
var _params34 = {};
(function () {
  var _attrValue35 = '';
_attrValue35 += 'text';
_params34['type'] = _attrValue35;
_attrValue35 = '';
})();
(function () {
  var _attrValue36 = '';
_attrValue36 += 'form__inp';
_params34['class'] = _attrValue36;
_attrValue36 = '';
})();
(function () {
  var _attrValue37 = '';
_attrValue37 += data['path'];
_params34['value'] = _attrValue37;
_attrValue37 = '';
})();
(function () {
  var _attrValue38 = '';
_attrValue38 += 'configs-gallery-path';
_params34['role'] = _attrValue38;
_attrValue38 = '';
})();
(function () {
  var _attrValue39 = '';
_attrValue39 += 'configs-gallery-path';
_params34['id'] = _attrValue39;
_attrValue39 = '';
})();
_childs.push(create('input', _params34));
_childs.push(create('\n        '));
if (data['pathError']) {
_childs.push(create('\n        '));
var _params40 = {};
(function () {
  var _attrValue41 = '';
_attrValue41 += 'form__error';
_params40['class'] = _attrValue41;
_attrValue41 = '';
})();
_childs.push(create('span', _params40, function (_childs) {
_childs.push(create(data['pathError']));
}));
_childs.push(create('\n        '));
}
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params42 = {};
(function () {
  var _attrValue43 = '';
_attrValue43 += 'configs-gallery-modal-storage-s3 configs-gallery-modal-storage-frame';
_params42['role'] = _attrValue43;
_attrValue43 = '';
})();
(function () {
  var _attrValue44 = '';
if (data['storage'] != "s3") {
_attrValue44 += 'display: none';
_params42['style'] = _attrValue44;
_attrValue44 = '';
}
})();
_childs.push(create('div', _params42, function (_childs) {
_childs.push(create('\n    '));
var _params45 = {};
(function () {
  var _attrValue46 = '';
_attrValue46 += 'form__item';
_params45['class'] = _attrValue46;
_attrValue46 = '';
})();
_childs.push(create('div', _params45, function (_childs) {
_childs.push(create('\n      '));
var _params47 = {};
(function () {
  var _attrValue48 = '';
_attrValue48 += 'configs-gallery-s3-access-key';
_params47['for'] = _attrValue48;
_attrValue48 = '';
})();
(function () {
  var _attrValue49 = '';
_attrValue49 += 'form__label';
_params47['class'] = _attrValue49;
_attrValue49 = '';
})();
_childs.push(create('label', _params47, function (_childs) {
_childs.push(create('Access key'));
}));
_childs.push(create('\n      '));
var _params50 = {};
(function () {
  var _attrValue51 = '';
_attrValue51 += 'form__inp-contain';
_params50['class'] = _attrValue51;
_attrValue51 = '';
})();
_childs.push(create('div', _params50, function (_childs) {
_childs.push(create('\n        '));
var _params52 = {};
(function () {
  var _attrValue53 = '';
_attrValue53 += 'text';
_params52['type'] = _attrValue53;
_attrValue53 = '';
})();
(function () {
  var _attrValue54 = '';
_attrValue54 += 'form__inp';
_params52['class'] = _attrValue54;
_attrValue54 = '';
})();
(function () {
  var _attrValue55 = '';
_attrValue55 += data['s3AccessKey'];
_params52['value'] = _attrValue55;
_attrValue55 = '';
})();
(function () {
  var _attrValue56 = '';
_attrValue56 += 'configs-gallery-s3-access-key';
_params52['role'] = _attrValue56;
_attrValue56 = '';
})();
(function () {
  var _attrValue57 = '';
_attrValue57 += 'configs-gallery-s3-access-key';
_params52['id'] = _attrValue57;
_attrValue57 = '';
})();
_childs.push(create('input', _params52));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n    '));
var _params58 = {};
(function () {
  var _attrValue59 = '';
_attrValue59 += 'form__item';
_params58['class'] = _attrValue59;
_attrValue59 = '';
})();
_childs.push(create('div', _params58, function (_childs) {
_childs.push(create('\n      '));
var _params60 = {};
(function () {
  var _attrValue61 = '';
_attrValue61 += 'configs-gallery-s3-secret-key';
_params60['for'] = _attrValue61;
_attrValue61 = '';
})();
(function () {
  var _attrValue62 = '';
_attrValue62 += 'form__label';
_params60['class'] = _attrValue62;
_attrValue62 = '';
})();
_childs.push(create('label', _params60, function (_childs) {
_childs.push(create('Secret key'));
}));
_childs.push(create('\n      '));
var _params63 = {};
(function () {
  var _attrValue64 = '';
_attrValue64 += 'form__inp-contain';
_params63['class'] = _attrValue64;
_attrValue64 = '';
})();
_childs.push(create('div', _params63, function (_childs) {
_childs.push(create('\n        '));
var _params65 = {};
(function () {
  var _attrValue66 = '';
_attrValue66 += 'password';
_params65['type'] = _attrValue66;
_attrValue66 = '';
})();
(function () {
  var _attrValue67 = '';
_attrValue67 += 'form__inp';
_params65['class'] = _attrValue67;
_attrValue67 = '';
})();
(function () {
  var _attrValue68 = '';
_params65['value'] = _attrValue68;
_attrValue68 = '';
})();
(function () {
  var _attrValue69 = '';
_attrValue69 += 'configs-gallery-s3-secret-key';
_params65['role'] = _attrValue69;
_attrValue69 = '';
})();
(function () {
  var _attrValue70 = '';
_attrValue70 += 'configs-gallery-s3-secret-key';
_params65['id'] = _attrValue70;
_attrValue70 = '';
})();
_childs.push(create('input', _params65));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n    '));
var _params71 = {};
(function () {
  var _attrValue72 = '';
_attrValue72 += 'form__item';
_params71['class'] = _attrValue72;
_attrValue72 = '';
})();
_childs.push(create('div', _params71, function (_childs) {
_childs.push(create('\n      '));
var _params73 = {};
(function () {
  var _attrValue74 = '';
_attrValue74 += 'form__inp-contain';
_params73['class'] = _attrValue74;
_attrValue74 = '';
})();
_childs.push(create('div', _params73, function (_childs) {
_childs.push(create('\n        '));
var _params75 = {};
(function () {
  var _attrValue76 = '';
_attrValue76 += 'button';
_params75['type'] = _attrValue76;
_attrValue76 = '';
})();
(function () {
  var _attrValue77 = '';
_attrValue77 += 'form__btn';
_params75['class'] = _attrValue77;
_attrValue77 = '';
})();
(function () {
  var _attrValue78 = '';
_attrValue78 += 'test-connection-s3';
_params75['role'] = _attrValue78;
_attrValue78 = '';
})();
(function () {
  var _attrValue79 = '';
if (data['isEmpty'] || data['s3auth'] || data['isisS3Checking']) {
_params75['disabled'] = _attrValue79;
_attrValue79 = '';
}
})();
_childs.push(create('button', _params75, function (_childs) {
_childs.push(create('\n          '));
if (data['isisS3Checking']) {
_childs.push(create('\n          Соединение...\n          '));
} else if (data['s3auth']) {
_childs.push(create('\n          Готово\n          '));
} else {
_childs.push(create('\n          Подключиться\n          '));
}
_childs.push(create('\n        '));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n    '));
if (data['s3auth']) {
_childs.push(create('\n      '));
var _params80 = {};
(function () {
  var _attrValue81 = '';
_attrValue81 += 'form__item';
_params80['class'] = _attrValue81;
_attrValue81 = '';
})();
_childs.push(create('div', _params80, function (_childs) {
_childs.push(create('\n        '));
var _params82 = {};
(function () {
  var _attrValue83 = '';
_attrValue83 += 'configs-gallery-s3-bucket';
_params82['for'] = _attrValue83;
_attrValue83 = '';
})();
(function () {
  var _attrValue84 = '';
_attrValue84 += 'form__label';
_params82['class'] = _attrValue84;
_attrValue84 = '';
})();
_childs.push(create('label', _params82, function (_childs) {
_childs.push(create('Bucket'));
}));
_childs.push(create('\n        '));
var _params85 = {};
(function () {
  var _attrValue86 = '';
_attrValue86 += 'form__inp-contain';
_params85['class'] = _attrValue86;
_attrValue86 = '';
})();
_childs.push(create('div', _params85, function (_childs) {
_childs.push(create('\n        '));
if (arr_len(data['buckets'])) {
_childs.push(create('\n          '));
var _params87 = {};
(function () {
  var _attrValue88 = '';
_attrValue88 += 'form__select';
_params87['class'] = _attrValue88;
_attrValue88 = '';
})();
_childs.push(create('label', _params87, function (_childs) {
_childs.push(create('\n            '));
var _params89 = {};
(function () {
  var _attrValue90 = '';
_attrValue90 += 'configs-gallery-s3-bucket';
_params89['role'] = _attrValue90;
_attrValue90 = '';
})();
(function () {
  var _attrValue91 = '';
_attrValue91 += 'configs-gallery-s3-bucket';
_params89['id'] = _attrValue91;
_attrValue91 = '';
})();
_childs.push(create('select', _params89, function (_childs) {
_childs.push(create('\n              '));
var _arr92 = data['buckets'];
for (data['bucket'] in _arr92) {
data['bucket'] = _arr92[data['bucket']];
_childs.push(create('\n              '));
var _params93 = {};
(function () {
  var _attrValue94 = '';
_attrValue94 += data['bucket'];
_params93['value'] = _attrValue94;
_attrValue94 = '';
})();
(function () {
  var _attrValue95 = '';
if (data['s3Bucket'] == data['bucket']) {
_params93['selected'] = _attrValue95;
_attrValue95 = '';
}
})();
_childs.push(create('option', _params93, function (_childs) {
_childs.push(create(data['bucket']));
}));
_childs.push(create('\n              '));
}
_childs.push(create('\n            '));
}));
_childs.push(create('\n          '));
}));
_childs.push(create('\n        '));
} else {
_childs.push(create('\n          '));
var _params96 = {};
(function () {
  var _attrValue97 = '';
_attrValue97 += 'text';
_params96['type'] = _attrValue97;
_attrValue97 = '';
})();
(function () {
  var _attrValue98 = '';
_attrValue98 += 'form__inp';
_params96['class'] = _attrValue98;
_attrValue98 = '';
})();
(function () {
  var _attrValue99 = '';
_attrValue99 += data['s3Bucket'];
_params96['value'] = _attrValue99;
_attrValue99 = '';
})();
(function () {
  var _attrValue100 = '';
_attrValue100 += 'configs-gallery-s3-bucket';
_params96['role'] = _attrValue100;
_attrValue100 = '';
})();
(function () {
  var _attrValue101 = '';
_attrValue101 += 'configs-gallery-s3-bucket';
_params96['id'] = _attrValue101;
_attrValue101 = '';
})();
_childs.push(create('input', _params96));
_childs.push(create('\n        '));
}
_childs.push(create('\n        '));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n      '));
var _params102 = {};
(function () {
  var _attrValue103 = '';
_attrValue103 += 'form__item';
_params102['class'] = _attrValue103;
_attrValue103 = '';
})();
_childs.push(create('div', _params102, function (_childs) {
_childs.push(create('\n        '));
var _params104 = {};
(function () {
  var _attrValue105 = '';
_attrValue105 += 'configs-gallery-s3-path';
_params104['for'] = _attrValue105;
_attrValue105 = '';
})();
(function () {
  var _attrValue106 = '';
_attrValue106 += 'form__label';
_params104['class'] = _attrValue106;
_attrValue106 = '';
})();
_childs.push(create('label', _params104, function (_childs) {
_childs.push(create('Путь'));
}));
_childs.push(create('\n        '));
var _params107 = {};
(function () {
  var _attrValue108 = '';
_attrValue108 += 'form__inp-contain';
_params107['class'] = _attrValue108;
_attrValue108 = '';
})();
_childs.push(create('div', _params107, function (_childs) {
_childs.push(create('\n          '));
var _params109 = {};
(function () {
  var _attrValue110 = '';
_attrValue110 += 'text';
_params109['type'] = _attrValue110;
_attrValue110 = '';
})();
(function () {
  var _attrValue111 = '';
_attrValue111 += 'form__inp';
_params109['class'] = _attrValue111;
_attrValue111 = '';
})();
(function () {
  var _attrValue112 = '';
_attrValue112 += data['s3Path'];
_params109['value'] = _attrValue112;
_attrValue112 = '';
})();
(function () {
  var _attrValue113 = '';
_attrValue113 += 'configs-gallery-s3-path';
_params109['role'] = _attrValue113;
_attrValue113 = '';
})();
(function () {
  var _attrValue114 = '';
_attrValue114 += 'configs-gallery-s3-path';
_params109['id'] = _attrValue114;
_attrValue114 = '';
})();
_childs.push(create('input', _params109));
_childs.push(create('\n        '));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params115 = {};
(function () {
  var _attrValue116 = '';
_attrValue116 += 'form__item';
_params115['class'] = _attrValue116;
_attrValue116 = '';
})();
_childs.push(create('div', _params115, function (_childs) {
_childs.push(create('\n    '));
var _params117 = {};
(function () {
  var _attrValue118 = '';
_attrValue118 += 'configs-gallery-width';
_params117['for'] = _attrValue118;
_attrValue118 = '';
})();
(function () {
  var _attrValue119 = '';
_attrValue119 += 'form__label';
_params117['class'] = _attrValue119;
_attrValue119 = '';
})();
_childs.push(create('label', _params117, function (_childs) {
_childs.push(create('Уменьшить до заданных размеров (с сохранением пропорций)'));
}));
_childs.push(create('\n    '));
var _params120 = {};
(function () {
  var _attrValue121 = '';
_attrValue121 += 'form__inp-contain form__inp-contain--full-width';
_params120['class'] = _attrValue121;
_attrValue121 = '';
})();
_childs.push(create('div', _params120, function (_childs) {
_childs.push(create('\n      '));
var _params122 = {};
(function () {
  var _attrValue123 = '';
_attrValue123 += 'text';
_params122['type'] = _attrValue123;
_attrValue123 = '';
})();
(function () {
  var _attrValue124 = '';
_attrValue124 += 'form__inp form__inp--very-short';
_params122['class'] = _attrValue124;
_attrValue124 = '';
})();
(function () {
  var _attrValue125 = '';
_attrValue125 += data['width'];
_params122['value'] = _attrValue125;
_attrValue125 = '';
})();
(function () {
  var _attrValue126 = '';
_attrValue126 += 'configs-gallery-width';
_params122['role'] = _attrValue126;
_attrValue126 = '';
})();
(function () {
  var _attrValue127 = '';
_attrValue127 += 'configs-gallery-width';
_params122['id'] = _attrValue127;
_attrValue127 = '';
})();
_childs.push(create('input', _params122));
_childs.push(create('\n      '));
var _params128 = {};
(function () {
  var _attrValue129 = '';
_attrValue129 += 'form__between-inp';
_params128['class'] = _attrValue129;
_attrValue129 = '';
})();
_childs.push(create('span', _params128, function (_childs) {
_childs.push(create('×'));
}));
_childs.push(create('\n      '));
var _params130 = {};
(function () {
  var _attrValue131 = '';
_attrValue131 += 'text';
_params130['type'] = _attrValue131;
_attrValue131 = '';
})();
(function () {
  var _attrValue132 = '';
_attrValue132 += 'form__inp form__inp--very-short';
_params130['class'] = _attrValue132;
_attrValue132 = '';
})();
(function () {
  var _attrValue133 = '';
_attrValue133 += data['height'];
_params130['value'] = _attrValue133;
_attrValue133 = '';
})();
(function () {
  var _attrValue134 = '';
_attrValue134 += 'configs-gallery-height';
_params130['role'] = _attrValue134;
_attrValue134 = '';
})();
_childs.push(create('input', _params130));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params135 = {};
(function () {
  var _attrValue136 = '';
_attrValue136 += 'form__item';
_params135['class'] = _attrValue136;
_attrValue136 = '';
})();
_childs.push(create('div', _params135, function (_childs) {
_childs.push(create('\n    '));
var _params137 = {};
(function () {
  var _attrValue138 = '';
_attrValue138 += 'configs-gallery-width';
_params137['for'] = _attrValue138;
_attrValue138 = '';
})();
(function () {
  var _attrValue139 = '';
_attrValue139 += 'form__label';
_params137['class'] = _attrValue139;
_attrValue139 = '';
})();
_childs.push(create('label', _params137, function (_childs) {
_childs.push(create('Уменьшить превью до заданных размеров (с сохранением пропорций)'));
}));
_childs.push(create('\n    '));
var _params140 = {};
(function () {
  var _attrValue141 = '';
_attrValue141 += 'form__inp-contain form__inp-contain--full-width';
_params140['class'] = _attrValue141;
_attrValue141 = '';
})();
_childs.push(create('div', _params140, function (_childs) {
_childs.push(create('\n      '));
var _params142 = {};
(function () {
  var _attrValue143 = '';
_attrValue143 += 'text';
_params142['type'] = _attrValue143;
_attrValue143 = '';
})();
(function () {
  var _attrValue144 = '';
_attrValue144 += 'form__inp form__inp--very-short';
_params142['class'] = _attrValue144;
_attrValue144 = '';
})();
(function () {
  var _attrValue145 = '';
_attrValue145 += data['previewWidth'];
_params142['value'] = _attrValue145;
_attrValue145 = '';
})();
(function () {
  var _attrValue146 = '';
_attrValue146 += 'configs-gallery-preview-width';
_params142['role'] = _attrValue146;
_attrValue146 = '';
})();
(function () {
  var _attrValue147 = '';
_attrValue147 += 'configs-gallery-preview-width';
_params142['id'] = _attrValue147;
_attrValue147 = '';
})();
_childs.push(create('input', _params142));
_childs.push(create('\n      '));
var _params148 = {};
(function () {
  var _attrValue149 = '';
_attrValue149 += 'form__between-inp';
_params148['class'] = _attrValue149;
_attrValue149 = '';
})();
_childs.push(create('span', _params148, function (_childs) {
_childs.push(create('×'));
}));
_childs.push(create('\n      '));
var _params150 = {};
(function () {
  var _attrValue151 = '';
_attrValue151 += 'text';
_params150['type'] = _attrValue151;
_attrValue151 = '';
})();
(function () {
  var _attrValue152 = '';
_attrValue152 += 'form__inp form__inp--very-short';
_params150['class'] = _attrValue152;
_attrValue152 = '';
})();
(function () {
  var _attrValue153 = '';
_attrValue153 += data['previewHeight'];
_params150['value'] = _attrValue153;
_attrValue153 = '';
})();
(function () {
  var _attrValue154 = '';
_attrValue154 += 'configs-gallery-preview-height';
_params150['role'] = _attrValue154;
_attrValue154 = '';
})();
_childs.push(create('input', _params150));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params155 = {};
(function () {
  var _attrValue156 = '';
_attrValue156 += 'form__submit';
_params155['class'] = _attrValue156;
_attrValue156 = '';
})();
_childs.push(create('div', _params155, function (_childs) {
_childs.push(create('\n    '));
var _params157 = {};
(function () {
  var _attrValue158 = '';
_attrValue158 += 'form__btn form__btn--submit';
_params157['class'] = _attrValue158;
_attrValue158 = '';
})();
(function () {
  var _attrValue159 = '';
if ((data['storage'] == "local" && data['pathError']) || (data['storage'] == "s3" && (!data['s3auth']))) {
_params157['disabled'] = _attrValue159;
_attrValue159 = '';
}
})();
_childs.push(create('button', _params157, function (_childs) {
_childs.push(create('Сохранить'));
}));
_childs.push(create('\n    '));
var _params160 = {};
(function () {
  var _attrValue161 = '';
_attrValue161 += 'button';
_params160['type'] = _attrValue161;
_attrValue161 = '';
})();
(function () {
  var _attrValue162 = '';
_attrValue162 += 'form__btn popup__cancel';
_params160['class'] = _attrValue162;
_attrValue162 = '';
})();
_childs.push(create('button', _params160, function (_childs) {
_childs.push(create('Отменить'));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n'));
}));
_childs.push(create('\n'));    return _childs;
  };
});
},{}],5:[function(require,module,exports){
(function (factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define([], factory());
  }
})(function () {
  var MKARR_OPEN = 2 << 1;
  var MKARR_CLOSE = 1 << 1;
  function mkArr(start, end, flag) {
    var arr = [], i;
    if (flag & MKARR_OPEN) {
      if (start <= end) {
        for (i = start; i < end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i > end; i--) {
          arr.push(i);
        }
      }
    } else if (flag & MKARR_CLOSE) {
      if (start <= end) {
        for (i = start; i <= end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i >= end; i--) {
          arr.push(i);
        }
      }
    }
    return arr;
  }
  function str(str, len, sprtr) {
    if (!len) len = 0;
    if (typeof str.toString === 'function') str = str.toString();
    if (!sprtr) sprtr = '.';
    if (~str.indexOf('.')) {
      if (len > 0) {
        str = str.substr(0, str.indexOf('.') + len + 1);
      } else {
        str = str.substr(0, str.indexOf('.') + len);
      }
    } else {
      str = str_pad(str + '.', str.length + 1 + len, '0');
    }
    return str.replace('.', sprtr);
  }
  function str_replace(str, src, rep) {
    while (~str.indexOf(src)) {
      str = str.replace(src, rep);
    }
    return str;
  }
  var STRPADRIGHT = 1 << 1;
  var STRPADLEFT = 2 << 1;
  var STRPADBOTH = 4 << 1;
  function __str_pad_repeater(str, len) {
    var collect = '', i;
    while(collect.length < len) collect += str;
    collect = collect.substr(0, len);
    return collect;
  }
  function str_pad(str, len, sub, type) {
    if (typeof type === 'undefined') type = STRPADRIGHT;
    var half = '', pad_to_go;
    if ((pad_to_go = len - str.length) > 0) {
      if (type & STRPADLEFT) { str = __str_pad_repeater(sub, pad_to_go) + str; }
      else if (type & STRPADRIGHT) {str = str + __str_pad_repeater(sub, pad_to_go); }
      else if (type & STRPADBOTH) {
        half = __str_pad_repeater(sub, Math.ceil(pad_to_go/2));
        str = half + str + half;
        str = str.substr(0, len);
      }
    }
    return str;
  }
  function str_htmlescape(html) {
    return html.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  }
  function str_upfirst(str) {
    return str.split(/[\s\n\t]+/).map(function (item) {
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join(' ');
  }
  function str_camel(str) {
    return str.split(/[\s\n\t]+/).map(function (item, index) {
      if (!index) return item;
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join('');
  }
  function str_kebab(str) {
    return str.split(/[\s\n\t]+/).join('-');
  }
  function arr_values(obj) {
    var values = [], i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) values.push(obj[i]);
    return values;
  }
  function arr_contain(obj, value) {
    if(typeof obj.indexOf === 'function') return obj.indexOf(value) !== -1;
    var i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) if (obj[i] === value) return true;
    return false;
  }
  function arr_len(obj) {
    if(typeof obj.length !== 'undefined') return obj.length;
    var i, length = 0;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) length++;
    return length;
  }
  function arr_push(arr, value) {
    arr.push(value);
    return '';
  }
  function arr_unshift(arr, value) {
    arr.unshift(value);
    return '';
  }
  function arr_rand(arr, value) {
    var keys = Object.keys(arr);
    return arr[keys[parseInt(Math.random() * arr_len(arr) - 1)]];
  }
  function arr_splice(arr, st, en, els) {
    var prms = [st];
    if (typeof en !== 'undefined') prms.push(en);
    return Array.prototype.splice.apply(arr, prms.concat(els));
  }
  function arr_pad(src, len, el) {
    var i, arr = src.slice(0);
    if(len > 0) for(i = arr_len(arr);i < len;i++) arr.push(el);
    if(len < 0) for(i = arr_len(arr);i < -len;i++) arr.unshift(el);
    return arr;
  }
  function arr_reverse(src) {
    var arr = src.slice(0);
    arr.reverse();
    return arr;
  }
  function arr_sort(src) {
    var arr = src.slice(0);
    arr.sort();
    return arr;
  }
  function arr_sort_reverse(src) {
    var arr = src.slice(0);
    arr.sort();
    arr.reverse();
    return arr;
  }
  function arr_unique(src) {
    var i, arr = [];
    for(i in src) if (Object.prototype.hasOwnProperty.call(src, i)) if (!~arr.indexOf(src[i])) arr.push(src[i]);
    return arr;
  }
  function arr_key(arr, value) {
    var i;
    for(i in arr) if (Object.prototype.hasOwnProperty.call(arr, i)) if (value == arr[i]) return i;
    return -1;
  }
  function create(name, attrs, cb) {
    if (typeof name === 'object') return name;
    var childs = [];
    if (typeof cb === 'function') cb(childs);
    if (attrs) {
      return {
        type: 'node',
        name: name,
        attrs: attrs,
        childs: childs.filter(function (_child) { return _child !== null; })
      };
    }
    if (typeof name.toString === 'function') name = name.toString();
    return {
      type: 'text',
      text: name
    };
  }
  return function (data, childs) {
    var _childs = [];
var bucket, sourceItem;
var _params0 = {};
(function () {
  var _attrValue1 = '';
_attrValue1 += 'popup__head';
_params0['class'] = _attrValue1;
_attrValue1 = '';
})();
_childs.push(create('div', _params0, function (_childs) {
_childs.push(create('Настройки изображения'));
}));
_childs.push(create('\n'));
data['isEmpty'] = !data['s3AccessKey'].length || !data['s3SecretKey'].length;
_childs.push(create('\n'));
var _params2 = {};
(function () {
  var _attrValue3 = '';
_params2['action'] = _attrValue3;
_attrValue3 = '';
})();
(function () {
  var _attrValue4 = '';
_attrValue4 += 'form';
_params2['class'] = _attrValue4;
_attrValue4 = '';
})();
(function () {
  var _attrValue5 = '';
_attrValue5 += 'configs-form';
_params2['role'] = _attrValue5;
_attrValue5 = '';
})();
_childs.push(create('form', _params2, function (_childs) {
_childs.push(create('\n  '));
var _params6 = {};
(function () {
  var _attrValue7 = '';
_attrValue7 += 'form__item';
_params6['class'] = _attrValue7;
_attrValue7 = '';
})();
_childs.push(create('div', _params6, function (_childs) {
_childs.push(create('\n    '));
var _params8 = {};
(function () {
  var _attrValue9 = '';
_attrValue9 += 'form__label';
_params8['class'] = _attrValue9;
_attrValue9 = '';
})();
_childs.push(create('label', _params8, function (_childs) {
_childs.push(create('Хранилище'));
}));
_childs.push(create('\n    '));
var _params10 = {};
(function () {
  var _attrValue11 = '';
_attrValue11 += 'form__inp-contain';
_params10['class'] = _attrValue11;
_attrValue11 = '';
})();
_childs.push(create('div', _params10, function (_childs) {
_childs.push(create('\n      '));
var _params12 = {};
(function () {
  var _attrValue13 = '';
_attrValue13 += 'tabs';
_params12['class'] = _attrValue13;
_attrValue13 = '';
})();
_childs.push(create('div', _params12, function (_childs) {
_childs.push(create('\n        '));
var _params14 = {};
(function () {
  var _attrValue15 = '';
_attrValue15 += 'button';
_params14['type'] = _attrValue15;
_attrValue15 = '';
})();
(function () {
  var _attrValue16 = '';
_attrValue16 += 'tabs__item';
if (data['storage'] == "local") {
_attrValue16 += ' tabs__item--active';
}
_params14['class'] = _attrValue16;
_attrValue16 = '';
})();
(function () {
  var _attrValue17 = '';
_attrValue17 += 'configs-image-storage';
_params14['role'] = _attrValue17;
_attrValue17 = '';
})();
(function () {
  var _attrValue18 = '';
_attrValue18 += 'local';
_params14['data-value'] = _attrValue18;
_attrValue18 = '';
})();
_childs.push(create('button', _params14, function (_childs) {
_childs.push(create('Локальное'));
}));
_childs.push(create('\n        '));
var _params19 = {};
(function () {
  var _attrValue20 = '';
_attrValue20 += 'button';
_params19['type'] = _attrValue20;
_attrValue20 = '';
})();
(function () {
  var _attrValue21 = '';
_attrValue21 += 'tabs__item';
if (data['storage'] == "s3") {
_attrValue21 += ' tabs__item--active';
}
_params19['class'] = _attrValue21;
_attrValue21 = '';
})();
(function () {
  var _attrValue22 = '';
_attrValue22 += 'configs-image-storage';
_params19['role'] = _attrValue22;
_attrValue22 = '';
})();
(function () {
  var _attrValue23 = '';
_attrValue23 += 's3';
_params19['data-value'] = _attrValue23;
_attrValue23 = '';
})();
_childs.push(create('button', _params19, function (_childs) {
_childs.push(create('S3'));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params24 = {};
(function () {
  var _attrValue25 = '';
_attrValue25 += 'configs-image-modal-storage-local configs-image-modal-storage-frame';
_params24['role'] = _attrValue25;
_attrValue25 = '';
})();
(function () {
  var _attrValue26 = '';
if (data['storage'] != "local") {
_attrValue26 += 'display: none';
_params24['style'] = _attrValue26;
_attrValue26 = '';
}
})();
_childs.push(create('div', _params24, function (_childs) {
_childs.push(create('\n    '));
var _params27 = {};
(function () {
  var _attrValue28 = '';
_attrValue28 += 'form__item';
_params27['class'] = _attrValue28;
_attrValue28 = '';
})();
_childs.push(create('div', _params27, function (_childs) {
_childs.push(create('\n      '));
var _params29 = {};
(function () {
  var _attrValue30 = '';
_attrValue30 += 'configs-image-path';
_params29['for'] = _attrValue30;
_attrValue30 = '';
})();
(function () {
  var _attrValue31 = '';
_attrValue31 += 'form__label';
_params29['class'] = _attrValue31;
_attrValue31 = '';
})();
_childs.push(create('label', _params29, function (_childs) {
_childs.push(create('Путь'));
}));
_childs.push(create('\n      '));
var _params32 = {};
(function () {
  var _attrValue33 = '';
_attrValue33 += 'form__inp-contain';
_params32['class'] = _attrValue33;
_attrValue33 = '';
})();
_childs.push(create('div', _params32, function (_childs) {
_childs.push(create('\n        '));
var _params34 = {};
(function () {
  var _attrValue35 = '';
_attrValue35 += 'text';
_params34['type'] = _attrValue35;
_attrValue35 = '';
})();
(function () {
  var _attrValue36 = '';
_attrValue36 += 'form__inp';
_params34['class'] = _attrValue36;
_attrValue36 = '';
})();
(function () {
  var _attrValue37 = '';
_attrValue37 += data['path'];
_params34['value'] = _attrValue37;
_attrValue37 = '';
})();
(function () {
  var _attrValue38 = '';
_attrValue38 += 'configs-image-path';
_params34['role'] = _attrValue38;
_attrValue38 = '';
})();
(function () {
  var _attrValue39 = '';
_attrValue39 += 'configs-image-path';
_params34['id'] = _attrValue39;
_attrValue39 = '';
})();
_childs.push(create('input', _params34));
_childs.push(create('\n        '));
if (data['pathError']) {
_childs.push(create('\n          '));
var _params40 = {};
(function () {
  var _attrValue41 = '';
_attrValue41 += 'form__error';
_params40['class'] = _attrValue41;
_attrValue41 = '';
})();
_childs.push(create('span', _params40, function (_childs) {
_childs.push(create(data['pathError']));
}));
_childs.push(create('\n        '));
}
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params42 = {};
(function () {
  var _attrValue43 = '';
_attrValue43 += 'configs-image-modal-storage-s3 configs-image-modal-storage-frame';
_params42['role'] = _attrValue43;
_attrValue43 = '';
})();
(function () {
  var _attrValue44 = '';
if (data['storage'] != "s3") {
_attrValue44 += 'display: none';
_params42['style'] = _attrValue44;
_attrValue44 = '';
}
})();
_childs.push(create('div', _params42, function (_childs) {
_childs.push(create('\n    '));
var _params45 = {};
(function () {
  var _attrValue46 = '';
_attrValue46 += 'form__item';
_params45['class'] = _attrValue46;
_attrValue46 = '';
})();
_childs.push(create('div', _params45, function (_childs) {
_childs.push(create('\n      '));
var _params47 = {};
(function () {
  var _attrValue48 = '';
_attrValue48 += 'configs-image-s3-access-key';
_params47['for'] = _attrValue48;
_attrValue48 = '';
})();
(function () {
  var _attrValue49 = '';
_attrValue49 += 'form__label';
_params47['class'] = _attrValue49;
_attrValue49 = '';
})();
_childs.push(create('label', _params47, function (_childs) {
_childs.push(create('Access key'));
}));
_childs.push(create('\n      '));
var _params50 = {};
(function () {
  var _attrValue51 = '';
_attrValue51 += 'form__inp-contain';
_params50['class'] = _attrValue51;
_attrValue51 = '';
})();
_childs.push(create('div', _params50, function (_childs) {
_childs.push(create('\n        '));
var _params52 = {};
(function () {
  var _attrValue53 = '';
_attrValue53 += 'text';
_params52['type'] = _attrValue53;
_attrValue53 = '';
})();
(function () {
  var _attrValue54 = '';
_attrValue54 += 'form__inp';
_params52['class'] = _attrValue54;
_attrValue54 = '';
})();
(function () {
  var _attrValue55 = '';
_attrValue55 += data['s3AccessKey'];
_params52['value'] = _attrValue55;
_attrValue55 = '';
})();
(function () {
  var _attrValue56 = '';
_attrValue56 += 'configs-image-s3-access-key';
_params52['role'] = _attrValue56;
_attrValue56 = '';
})();
(function () {
  var _attrValue57 = '';
_attrValue57 += 'configs-image-s3-access-key';
_params52['id'] = _attrValue57;
_attrValue57 = '';
})();
_childs.push(create('input', _params52));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n    '));
var _params58 = {};
(function () {
  var _attrValue59 = '';
_attrValue59 += 'form__item';
_params58['class'] = _attrValue59;
_attrValue59 = '';
})();
_childs.push(create('div', _params58, function (_childs) {
_childs.push(create('\n      '));
var _params60 = {};
(function () {
  var _attrValue61 = '';
_attrValue61 += 'configs-image-s3-secret-key';
_params60['for'] = _attrValue61;
_attrValue61 = '';
})();
(function () {
  var _attrValue62 = '';
_attrValue62 += 'form__label';
_params60['class'] = _attrValue62;
_attrValue62 = '';
})();
_childs.push(create('label', _params60, function (_childs) {
_childs.push(create('Secret key'));
}));
_childs.push(create('\n      '));
var _params63 = {};
(function () {
  var _attrValue64 = '';
_attrValue64 += 'form__inp-contain';
_params63['class'] = _attrValue64;
_attrValue64 = '';
})();
_childs.push(create('div', _params63, function (_childs) {
_childs.push(create('\n        '));
var _params65 = {};
(function () {
  var _attrValue66 = '';
_attrValue66 += 'password';
_params65['type'] = _attrValue66;
_attrValue66 = '';
})();
(function () {
  var _attrValue67 = '';
_attrValue67 += 'form__inp';
_params65['class'] = _attrValue67;
_attrValue67 = '';
})();
(function () {
  var _attrValue68 = '';
_params65['value'] = _attrValue68;
_attrValue68 = '';
})();
(function () {
  var _attrValue69 = '';
_attrValue69 += 'configs-image-s3-secret-key';
_params65['role'] = _attrValue69;
_attrValue69 = '';
})();
(function () {
  var _attrValue70 = '';
_attrValue70 += 'configs-image-s3-secret-key';
_params65['id'] = _attrValue70;
_attrValue70 = '';
})();
_childs.push(create('input', _params65));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n    '));
var _params71 = {};
(function () {
  var _attrValue72 = '';
_attrValue72 += 'form__item';
_params71['class'] = _attrValue72;
_attrValue72 = '';
})();
_childs.push(create('div', _params71, function (_childs) {
_childs.push(create('\n      '));
var _params73 = {};
(function () {
  var _attrValue74 = '';
_attrValue74 += 'form__inp-contain';
_params73['class'] = _attrValue74;
_attrValue74 = '';
})();
_childs.push(create('div', _params73, function (_childs) {
_childs.push(create('\n        '));
var _params75 = {};
(function () {
  var _attrValue76 = '';
_attrValue76 += 'button';
_params75['type'] = _attrValue76;
_attrValue76 = '';
})();
(function () {
  var _attrValue77 = '';
_attrValue77 += 'form__btn';
_params75['class'] = _attrValue77;
_attrValue77 = '';
})();
(function () {
  var _attrValue78 = '';
_attrValue78 += 'test-connection-s3';
_params75['role'] = _attrValue78;
_attrValue78 = '';
})();
(function () {
  var _attrValue79 = '';
if (data['isEmpty'] || data['s3auth'] || data['s3checking']) {
_params75['disabled'] = _attrValue79;
_attrValue79 = '';
}
})();
_childs.push(create('button', _params75, function (_childs) {
_childs.push(create('\n          '));
if (data['s3checking']) {
_childs.push(create('\n            Соединение...\n          '));
} else if (data['s3auth']) {
_childs.push(create('\n            Готово\n          '));
} else {
_childs.push(create('\n            Подключиться\n          '));
}
_childs.push(create('\n        '));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n    '));
if (data['s3auth']) {
_childs.push(create('\n      '));
var _params80 = {};
(function () {
  var _attrValue81 = '';
_attrValue81 += 'form__item';
_params80['class'] = _attrValue81;
_attrValue81 = '';
})();
_childs.push(create('div', _params80, function (_childs) {
_childs.push(create('\n        '));
var _params82 = {};
(function () {
  var _attrValue83 = '';
_attrValue83 += 'configs-image-s3-bucket';
_params82['for'] = _attrValue83;
_attrValue83 = '';
})();
(function () {
  var _attrValue84 = '';
_attrValue84 += 'form__label';
_params82['class'] = _attrValue84;
_attrValue84 = '';
})();
_childs.push(create('label', _params82, function (_childs) {
_childs.push(create('Bucket'));
}));
_childs.push(create('\n        '));
var _params85 = {};
(function () {
  var _attrValue86 = '';
_attrValue86 += 'form__inp-contain';
_params85['class'] = _attrValue86;
_attrValue86 = '';
})();
_childs.push(create('div', _params85, function (_childs) {
_childs.push(create('\n        '));
if (arr_len(data['buckets'])) {
_childs.push(create('\n          '));
var _params87 = {};
(function () {
  var _attrValue88 = '';
_attrValue88 += 'form__select';
_params87['class'] = _attrValue88;
_attrValue88 = '';
})();
_childs.push(create('label', _params87, function (_childs) {
_childs.push(create('\n            '));
var _params89 = {};
(function () {
  var _attrValue90 = '';
_attrValue90 += 'configs-image-s3-bucket';
_params89['role'] = _attrValue90;
_attrValue90 = '';
})();
(function () {
  var _attrValue91 = '';
_attrValue91 += 'configs-image-s3-bucket';
_params89['id'] = _attrValue91;
_attrValue91 = '';
})();
_childs.push(create('select', _params89, function (_childs) {
_childs.push(create('\n              '));
var _arr92 = data['buckets'];
for (data['bucket'] in _arr92) {
data['bucket'] = _arr92[data['bucket']];
_childs.push(create('\n                '));
var _params93 = {};
(function () {
  var _attrValue94 = '';
_attrValue94 += data['bucket'];
_params93['value'] = _attrValue94;
_attrValue94 = '';
})();
(function () {
  var _attrValue95 = '';
if (data['s3Bucket'] == data['bucket']) {
_params93['selected'] = _attrValue95;
_attrValue95 = '';
}
})();
_childs.push(create('option', _params93, function (_childs) {
_childs.push(create(data['bucket']));
}));
_childs.push(create('\n              '));
}
_childs.push(create('\n            '));
}));
_childs.push(create('\n          '));
}));
_childs.push(create('\n        '));
} else {
_childs.push(create('\n          '));
var _params96 = {};
(function () {
  var _attrValue97 = '';
_attrValue97 += 'text';
_params96['type'] = _attrValue97;
_attrValue97 = '';
})();
(function () {
  var _attrValue98 = '';
_attrValue98 += 'form__inp';
_params96['class'] = _attrValue98;
_attrValue98 = '';
})();
(function () {
  var _attrValue99 = '';
_attrValue99 += data['s3Bucket'];
_params96['value'] = _attrValue99;
_attrValue99 = '';
})();
(function () {
  var _attrValue100 = '';
_attrValue100 += 'configs-image-s3-bucket';
_params96['role'] = _attrValue100;
_attrValue100 = '';
})();
(function () {
  var _attrValue101 = '';
_attrValue101 += 'configs-image-s3-bucket';
_params96['id'] = _attrValue101;
_attrValue101 = '';
})();
_childs.push(create('input', _params96));
_childs.push(create('\n        '));
}
_childs.push(create('\n        '));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n      '));
var _params102 = {};
(function () {
  var _attrValue103 = '';
_attrValue103 += 'form__item';
_params102['class'] = _attrValue103;
_attrValue103 = '';
})();
_childs.push(create('div', _params102, function (_childs) {
_childs.push(create('\n        '));
var _params104 = {};
(function () {
  var _attrValue105 = '';
_attrValue105 += 'configs-image-s3-path';
_params104['for'] = _attrValue105;
_attrValue105 = '';
})();
(function () {
  var _attrValue106 = '';
_attrValue106 += 'form__label';
_params104['class'] = _attrValue106;
_attrValue106 = '';
})();
_childs.push(create('label', _params104, function (_childs) {
_childs.push(create('Путь'));
}));
_childs.push(create('\n        '));
var _params107 = {};
(function () {
  var _attrValue108 = '';
_attrValue108 += 'form__inp-contain';
_params107['class'] = _attrValue108;
_attrValue108 = '';
})();
_childs.push(create('div', _params107, function (_childs) {
_childs.push(create('\n          '));
var _params109 = {};
(function () {
  var _attrValue110 = '';
_attrValue110 += 'text';
_params109['type'] = _attrValue110;
_attrValue110 = '';
})();
(function () {
  var _attrValue111 = '';
_attrValue111 += 'form__inp';
_params109['class'] = _attrValue111;
_attrValue111 = '';
})();
(function () {
  var _attrValue112 = '';
_attrValue112 += data['s3Path'];
_params109['value'] = _attrValue112;
_attrValue112 = '';
})();
(function () {
  var _attrValue113 = '';
_attrValue113 += 'configs-image-s3-path';
_params109['role'] = _attrValue113;
_attrValue113 = '';
})();
(function () {
  var _attrValue114 = '';
_attrValue114 += 'configs-image-s3-path';
_params109['id'] = _attrValue114;
_attrValue114 = '';
})();
_childs.push(create('input', _params109));
_childs.push(create('\n        '));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params115 = {};
(function () {
  var _attrValue116 = '';
_attrValue116 += 'form__item';
_params115['class'] = _attrValue116;
_attrValue116 = '';
})();
_childs.push(create('div', _params115, function (_childs) {
_childs.push(create('\n    '));
var _params117 = {};
(function () {
  var _attrValue118 = '';
_attrValue118 += 'configs-image-width';
_params117['for'] = _attrValue118;
_attrValue118 = '';
})();
(function () {
  var _attrValue119 = '';
_attrValue119 += 'form__label';
_params117['class'] = _attrValue119;
_attrValue119 = '';
})();
_childs.push(create('label', _params117, function (_childs) {
_childs.push(create('Уменьшить до заданных размеров'));
}));
_childs.push(create('\n    '));
var _params120 = {};
(function () {
  var _attrValue121 = '';
_attrValue121 += 'form__inp-contain form__inp-contain--full-width';
_params120['class'] = _attrValue121;
_attrValue121 = '';
})();
_childs.push(create('div', _params120, function (_childs) {
_childs.push(create('\n      '));
var _params122 = {};
(function () {
  var _attrValue123 = '';
_attrValue123 += 'text';
_params122['type'] = _attrValue123;
_attrValue123 = '';
})();
(function () {
  var _attrValue124 = '';
_attrValue124 += 'form__inp form__inp--very-short';
_params122['class'] = _attrValue124;
_attrValue124 = '';
})();
(function () {
  var _attrValue125 = '';
_attrValue125 += data['width'];
_params122['value'] = _attrValue125;
_attrValue125 = '';
})();
(function () {
  var _attrValue126 = '';
_attrValue126 += 'configs-image-width';
_params122['role'] = _attrValue126;
_attrValue126 = '';
})();
(function () {
  var _attrValue127 = '';
_attrValue127 += 'configs-image-width';
_params122['id'] = _attrValue127;
_attrValue127 = '';
})();
_childs.push(create('input', _params122));
_childs.push(create('\n\n      '));
var _params128 = {};
(function () {
  var _attrValue129 = '';
_attrValue129 += 'form__between-inp';
_params128['class'] = _attrValue129;
_attrValue129 = '';
})();
_childs.push(create('span', _params128, function (_childs) {
_childs.push(create('×'));
}));
_childs.push(create('\n\n      '));
var _params130 = {};
(function () {
  var _attrValue131 = '';
_attrValue131 += 'text';
_params130['type'] = _attrValue131;
_attrValue131 = '';
})();
(function () {
  var _attrValue132 = '';
_attrValue132 += 'form__inp form__inp--very-short';
_params130['class'] = _attrValue132;
_attrValue132 = '';
})();
(function () {
  var _attrValue133 = '';
_attrValue133 += data['height'];
_params130['value'] = _attrValue133;
_attrValue133 = '';
})();
(function () {
  var _attrValue134 = '';
_attrValue134 += 'configs-image-height';
_params130['role'] = _attrValue134;
_attrValue134 = '';
})();
_childs.push(create('input', _params130));
_childs.push(create('\n\n      '));
var _params135 = {};
(function () {
  var _attrValue136 = '';
_attrValue136 += 'form__hint';
_params135['class'] = _attrValue136;
_attrValue136 = '';
})();
(function () {
  var _attrValue137 = '';
_attrValue137 += data['saveRatio'];
_params135['data-checked'] = _attrValue137;
_attrValue137 = '';
})();
_childs.push(create('div', _params135, function (_childs) {
_childs.push(create('\n        '));
var _params138 = {};
(function () {
  var _attrValue139 = '';
_attrValue139 += 'form__checkbox';
_params138['class'] = _attrValue139;
_attrValue139 = '';
})();
(function () {
  var _attrValue140 = '';
_attrValue140 += 'checkbox';
_params138['type'] = _attrValue140;
_attrValue140 = '';
})();
(function () {
  var _attrValue141 = '';
_attrValue141 += 'configs-image-save-ratio';
_params138['role'] = _attrValue141;
_attrValue141 = '';
})();
(function () {
  var _attrValue142 = '';
_attrValue142 += 'configs-image-save-ratio';
_params138['id'] = _attrValue142;
_attrValue142 = '';
})();
(function () {
  var _attrValue143 = '';
if (data['saveRatio']) {
_params138['checked'] = _attrValue143;
_attrValue143 = '';
}
})();
_childs.push(create('input', _params138));
_childs.push(create('\n\n        '));
var _params144 = {};
(function () {
  var _attrValue145 = '';
_attrValue145 += 'form__checkbox-label';
_params144['class'] = _attrValue145;
_attrValue145 = '';
})();
(function () {
  var _attrValue146 = '';
_attrValue146 += 'configs-image-save-ratio';
_params144['for'] = _attrValue146;
_attrValue146 = '';
})();
_childs.push(create('label', _params144, function (_childs) {
}));
_childs.push(create('\n\n        '));
var _params147 = {};
(function () {
  var _attrValue148 = '';
_attrValue148 += 'form__label-text';
_params147['class'] = _attrValue148;
_attrValue148 = '';
})();
(function () {
  var _attrValue149 = '';
_attrValue149 += 'configs-image-save-ratio';
_params147['for'] = _attrValue149;
_attrValue149 = '';
})();
_childs.push(create('label', _params147, function (_childs) {
_childs.push(create('Сохранить пропорции'));
var _params150 = {};
_childs.push(create('br', _params150));
_childs.push(create('при уменьшении'));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params151 = {};
(function () {
  var _attrValue152 = '';
_attrValue152 += 'form__item';
_params151['class'] = _attrValue152;
_attrValue152 = '';
})();
_childs.push(create('div', _params151, function (_childs) {
_childs.push(create('\n    '));
var _params153 = {};
(function () {
  var _attrValue154 = '';
_attrValue154 += 'form__inp-contain form__inp-contain--full-width';
_params153['class'] = _attrValue154;
_attrValue154 = '';
})();
_childs.push(create('div', _params153, function (_childs) {
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params155 = {};
(function () {
  var _attrValue156 = '';
_attrValue156 += 'form__item';
_params155['class'] = _attrValue156;
_attrValue156 = '';
})();
(function () {
  var _attrValue157 = '';
if (!arr_len(data['sources'])) {
_attrValue157 += 'display: none';
_params155['style'] = _attrValue157;
_attrValue157 = '';
}
})();
_childs.push(create('div', _params155, function (_childs) {
_childs.push(create('\n    '));
var _params158 = {};
(function () {
  var _attrValue159 = '';
_attrValue159 += 'configs-image-source';
_params158['for'] = _attrValue159;
_attrValue159 = '';
})();
(function () {
  var _attrValue160 = '';
_attrValue160 += 'form__label';
_params158['class'] = _attrValue160;
_attrValue160 = '';
})();
_childs.push(create('label', _params158, function (_childs) {
_childs.push(create('Источник'));
}));
_childs.push(create('\n    '));
var _params161 = {};
(function () {
  var _attrValue162 = '';
_attrValue162 += 'form__inp-contain';
_params161['class'] = _attrValue162;
_attrValue162 = '';
})();
_childs.push(create('div', _params161, function (_childs) {
_childs.push(create('\n      '));
var _params163 = {};
(function () {
  var _attrValue164 = '';
_attrValue164 += 'form__select';
_params163['class'] = _attrValue164;
_attrValue164 = '';
})();
_childs.push(create('label', _params163, function (_childs) {
_childs.push(create('\n        '));
var _params165 = {};
(function () {
  var _attrValue166 = '';
_attrValue166 += 'configs-image-source';
_params165['role'] = _attrValue166;
_attrValue166 = '';
})();
(function () {
  var _attrValue167 = '';
_attrValue167 += 'configs-image-source';
_params165['id'] = _attrValue167;
_attrValue167 = '';
})();
_childs.push(create('select', _params165, function (_childs) {
_childs.push(create('\n          '));
var _params168 = {};
(function () {
  var _attrValue169 = '';
_attrValue169 += 'upload';
_params168['value'] = _attrValue169;
_attrValue169 = '';
})();
(function () {
  var _attrValue170 = '';
if (data['source'] == "upload") {
_params168['selected'] = _attrValue170;
_attrValue170 = '';
}
})();
_childs.push(create('option', _params168, function (_childs) {
_childs.push(create('Загрузить изображение'));
}));
_childs.push(create('\n          '));
if (arr_len(data['sources'])) {
_childs.push(create('\n            '));
var _arr171 = data['sources'];
for (data['sourceItem'] in _arr171) {
data['sourceItem'] = _arr171[data['sourceItem']];
_childs.push(create('\n              '));
var _params172 = {};
(function () {
  var _attrValue173 = '';
_attrValue173 += data['sourceItem']["alias"];
_params172['value'] = _attrValue173;
_attrValue173 = '';
})();
(function () {
  var _attrValue174 = '';
if (data['source'] == data['sourceItem']["alias"]) {
_params172['selected'] = _attrValue174;
_attrValue174 = '';
}
})();
_childs.push(create('option', _params172, function (_childs) {
_childs.push(create(data['sourceItem']["label"]));
}));
_childs.push(create('\n            '));
}
_childs.push(create('\n          '));
}
_childs.push(create('\n        '));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params175 = {};
(function () {
  var _attrValue176 = '';
_attrValue176 += 'form__submit';
_params175['class'] = _attrValue176;
_attrValue176 = '';
})();
_childs.push(create('div', _params175, function (_childs) {
_childs.push(create('\n    '));
var _params177 = {};
(function () {
  var _attrValue178 = '';
_attrValue178 += 'form__btn form__btn--submit';
_params177['class'] = _attrValue178;
_attrValue178 = '';
})();
(function () {
  var _attrValue179 = '';
if ((data['storage'] == "local" && data['pathError']) || (data['storage'] == "s3" && (!data['s3auth']))) {
_params177['disabled'] = _attrValue179;
_attrValue179 = '';
}
})();
_childs.push(create('button', _params177, function (_childs) {
_childs.push(create('Сохранить'));
}));
_childs.push(create('\n    '));
var _params180 = {};
(function () {
  var _attrValue181 = '';
_attrValue181 += 'button';
_params180['type'] = _attrValue181;
_attrValue181 = '';
})();
(function () {
  var _attrValue182 = '';
_attrValue182 += 'form__btn popup__cancel';
_params180['class'] = _attrValue182;
_attrValue182 = '';
})();
_childs.push(create('button', _params180, function (_childs) {
_childs.push(create('Отменить'));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n'));
}));
_childs.push(create('\n'));    return _childs;
  };
});
},{}],6:[function(require,module,exports){
(function (factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define([], factory());
  }
})(function () {
  var MKARR_OPEN = 2 << 1;
  var MKARR_CLOSE = 1 << 1;
  function mkArr(start, end, flag) {
    var arr = [], i;
    if (flag & MKARR_OPEN) {
      if (start <= end) {
        for (i = start; i < end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i > end; i--) {
          arr.push(i);
        }
      }
    } else if (flag & MKARR_CLOSE) {
      if (start <= end) {
        for (i = start; i <= end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i >= end; i--) {
          arr.push(i);
        }
      }
    }
    return arr;
  }
  function str(str, len, sprtr) {
    if (!len) len = 0;
    if (typeof str.toString === 'function') str = str.toString();
    if (!sprtr) sprtr = '.';
    if (~str.indexOf('.')) {
      if (len > 0) {
        str = str.substr(0, str.indexOf('.') + len + 1);
      } else {
        str = str.substr(0, str.indexOf('.') + len);
      }
    } else {
      str = str_pad(str + '.', str.length + 1 + len, '0');
    }
    return str.replace('.', sprtr);
  }
  function str_replace(str, src, rep) {
    while (~str.indexOf(src)) {
      str = str.replace(src, rep);
    }
    return str;
  }
  var STRPADRIGHT = 1 << 1;
  var STRPADLEFT = 2 << 1;
  var STRPADBOTH = 4 << 1;
  function __str_pad_repeater(str, len) {
    var collect = '', i;
    while(collect.length < len) collect += str;
    collect = collect.substr(0, len);
    return collect;
  }
  function str_pad(str, len, sub, type) {
    if (typeof type === 'undefined') type = STRPADRIGHT;
    var half = '', pad_to_go;
    if ((pad_to_go = len - str.length) > 0) {
      if (type & STRPADLEFT) { str = __str_pad_repeater(sub, pad_to_go) + str; }
      else if (type & STRPADRIGHT) {str = str + __str_pad_repeater(sub, pad_to_go); }
      else if (type & STRPADBOTH) {
        half = __str_pad_repeater(sub, Math.ceil(pad_to_go/2));
        str = half + str + half;
        str = str.substr(0, len);
      }
    }
    return str;
  }
  function str_htmlescape(html) {
    return html.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  }
  function str_upfirst(str) {
    return str.split(/[\s\n\t]+/).map(function (item) {
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join(' ');
  }
  function str_camel(str) {
    return str.split(/[\s\n\t]+/).map(function (item, index) {
      if (!index) return item;
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join('');
  }
  function str_kebab(str) {
    return str.split(/[\s\n\t]+/).join('-');
  }
  function arr_values(obj) {
    var values = [], i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) values.push(obj[i]);
    return values;
  }
  function arr_contain(obj, value) {
    if(typeof obj.indexOf === 'function') return obj.indexOf(value) !== -1;
    var i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) if (obj[i] === value) return true;
    return false;
  }
  function arr_len(obj) {
    if(typeof obj.length !== 'undefined') return obj.length;
    var i, length = 0;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) length++;
    return length;
  }
  function arr_push(arr, value) {
    arr.push(value);
    return '';
  }
  function arr_unshift(arr, value) {
    arr.unshift(value);
    return '';
  }
  function arr_rand(arr, value) {
    var keys = Object.keys(arr);
    return arr[keys[parseInt(Math.random() * arr_len(arr) - 1)]];
  }
  function arr_splice(arr, st, en, els) {
    var prms = [st];
    if (typeof en !== 'undefined') prms.push(en);
    return Array.prototype.splice.apply(arr, prms.concat(els));
  }
  function arr_pad(src, len, el) {
    var i, arr = src.slice(0);
    if(len > 0) for(i = arr_len(arr);i < len;i++) arr.push(el);
    if(len < 0) for(i = arr_len(arr);i < -len;i++) arr.unshift(el);
    return arr;
  }
  function arr_reverse(src) {
    var arr = src.slice(0);
    arr.reverse();
    return arr;
  }
  function arr_sort(src) {
    var arr = src.slice(0);
    arr.sort();
    return arr;
  }
  function arr_sort_reverse(src) {
    var arr = src.slice(0);
    arr.sort();
    arr.reverse();
    return arr;
  }
  function arr_unique(src) {
    var i, arr = [];
    for(i in src) if (Object.prototype.hasOwnProperty.call(src, i)) if (!~arr.indexOf(src[i])) arr.push(src[i]);
    return arr;
  }
  function arr_key(arr, value) {
    var i;
    for(i in arr) if (Object.prototype.hasOwnProperty.call(arr, i)) if (value == arr[i]) return i;
    return -1;
  }
  function create(name, attrs, cb) {
    if (typeof name === 'object') return name;
    var childs = [];
    if (typeof cb === 'function') cb(childs);
    if (attrs) {
      return {
        type: 'node',
        name: name,
        attrs: attrs,
        childs: childs.filter(function (_child) { return _child !== null; })
      };
    }
    if (typeof name.toString === 'function') name = name.toString();
    return {
      type: 'text',
      text: name
    };
  }
  return function (data, childs) {
    var _childs = [];
var i;
var _params0 = {};
(function () {
  var _attrValue1 = '';
_attrValue1 += 'popup__head';
_params0['class'] = _attrValue1;
_attrValue1 = '';
})();
_childs.push(create('div', _params0, function (_childs) {
_childs.push(create('Настройки переключателей'));
}));
_childs.push(create('\n'));
var _params2 = {};
(function () {
  var _attrValue3 = '';
_params2['action'] = _attrValue3;
_attrValue3 = '';
})();
(function () {
  var _attrValue4 = '';
_attrValue4 += 'form';
_params2['class'] = _attrValue4;
_attrValue4 = '';
})();
(function () {
  var _attrValue5 = '';
_attrValue5 += 'configs-form';
_params2['role'] = _attrValue5;
_attrValue5 = '';
})();
_childs.push(create('form', _params2, function (_childs) {
_childs.push(create('\n  '));
var _params6 = {};
(function () {
  var _attrValue7 = '';
_attrValue7 += 'form__item';
_params6['class'] = _attrValue7;
_attrValue7 = '';
})();
_childs.push(create('div', _params6, function (_childs) {
_childs.push(create('\n    '));
var _params8 = {};
(function () {
  var _attrValue9 = '';
_attrValue9 += 'configs-radio-num-options';
_params8['for'] = _attrValue9;
_attrValue9 = '';
})();
(function () {
  var _attrValue10 = '';
_attrValue10 += 'form__label';
_params8['class'] = _attrValue10;
_attrValue10 = '';
})();
_childs.push(create('label', _params8, function (_childs) {
_childs.push(create('Количество вариантов ответа'));
}));
_childs.push(create('\n    '));
var _params11 = {};
(function () {
  var _attrValue12 = '';
_attrValue12 += 'form__inp-contain';
_params11['class'] = _attrValue12;
_attrValue12 = '';
})();
_childs.push(create('div', _params11, function (_childs) {
_childs.push(create('\n      '));
var _params13 = {};
(function () {
  var _attrValue14 = '';
_attrValue14 += 'text';
_params13['type'] = _attrValue14;
_attrValue14 = '';
})();
(function () {
  var _attrValue15 = '';
_attrValue15 += 'form__inp form__inp--very-short';
_params13['class'] = _attrValue15;
_attrValue15 = '';
})();
(function () {
  var _attrValue16 = '';
_attrValue16 += data['numOptions'];
_params13['value'] = _attrValue16;
_attrValue16 = '';
})();
(function () {
  var _attrValue17 = '';
_attrValue17 += 'configs-radio-num-options';
_params13['role'] = _attrValue17;
_attrValue17 = '';
})();
(function () {
  var _attrValue18 = '';
_attrValue18 += 'configs-radio-num-options';
_params13['id'] = _attrValue18;
_attrValue18 = '';
})();
_childs.push(create('input', _params13));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params19 = {};
(function () {
  var _attrValue20 = '';
_attrValue20 += 'form__item';
_params19['class'] = _attrValue20;
_attrValue20 = '';
})();
_childs.push(create('div', _params19, function (_childs) {
_childs.push(create('\n    '));
var _params21 = {};
(function () {
  var _attrValue22 = '';
_attrValue22 += 'form__label';
_params21['class'] = _attrValue22;
_attrValue22 = '';
})();
_childs.push(create('label', _params21, function (_childs) {
_childs.push(create('Варианты ответов:'));
}));
_childs.push(create('\n    '));
var _params23 = {};
(function () {
  var _attrValue24 = '';
_attrValue24 += 'form__inp-contain form__inp-contain--full-width';
_params23['class'] = _attrValue24;
_attrValue24 = '';
})();
_childs.push(create('div', _params23, function (_childs) {
_childs.push(create('\n      '));
var _params25 = {};
(function () {
  var _attrValue26 = '';
_attrValue26 += 'form__row-option';
_params25['class'] = _attrValue26;
_attrValue26 = '';
})();
_childs.push(create('div', _params25, function (_childs) {
_childs.push(create('\n        '));
var _params27 = {};
(function () {
  var _attrValue28 = '';
_attrValue28 += 'radio';
_params27['type'] = _attrValue28;
_attrValue28 = '';
})();
(function () {
  var _attrValue29 = '';
_attrValue29 += 'form__radio';
_params27['class'] = _attrValue29;
_attrValue29 = '';
})();
(function () {
  var _attrValue30 = '';
_attrValue30 += 'configs-radio-option';
_params27['role'] = _attrValue30;
_attrValue30 = '';
})();
(function () {
  var _attrValue31 = '';
_attrValue31 += '-1';
_params27['value'] = _attrValue31;
_attrValue31 = '';
})();
(function () {
  var _attrValue32 = '';
_attrValue32 += 'configs-radio-option--1';
_params27['id'] = _attrValue32;
_attrValue32 = '';
})();
(function () {
  var _attrValue33 = '';
_attrValue33 += 'configs-radio-option';
_params27['name'] = _attrValue33;
_attrValue33 = '';
})();
(function () {
  var _attrValue34 = '';
if (data['defaultValue'] == "-1") {
_params27['checked'] = _attrValue34;
_attrValue34 = '';
}
})();
_childs.push(create('input', _params27));
_childs.push(create('\n        '));
var _params35 = {};
(function () {
  var _attrValue36 = '';
_attrValue36 += 'form__radio-label';
_params35['class'] = _attrValue36;
_attrValue36 = '';
})();
(function () {
  var _attrValue37 = '';
_attrValue37 += 'configs-radio-option--1';
_params35['for'] = _attrValue37;
_attrValue37 = '';
})();
_childs.push(create('label', _params35, function (_childs) {
}));
_childs.push(create('\n        '));
var _params38 = {};
(function () {
  var _attrValue39 = '';
_attrValue39 += 'configs-radio-option--1';
_params38['for'] = _attrValue39;
_attrValue39 = '';
})();
_childs.push(create('label', _params38, function (_childs) {
var _params40 = {};
_childs.push(create('i', _params40, function (_childs) {
_childs.push(create('Ничего не выбрано по умолчанию'));
}));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n      '));
var _params41 = {};
(function () {
  var _attrValue42 = '';
_attrValue42 += 'configs-radio-options-contain';
_params41['role'] = _attrValue42;
_attrValue42 = '';
})();
_childs.push(create('div', _params41, function (_childs) {
_childs.push(create('\n        '));
var _arr43 = data['defaultData'];
for (data['i'] in _arr43) {
data['option'] = _arr43[data['i']];
_childs.push(create('\n        '));
var _params44 = {};
(function () {
  var _attrValue45 = '';
_attrValue45 += 'form__row-option';
_params44['class'] = _attrValue45;
_attrValue45 = '';
})();
_childs.push(create('div', _params44, function (_childs) {
_childs.push(create('\n          '));
var _params46 = {};
(function () {
  var _attrValue47 = '';
_attrValue47 += 'radio';
_params46['type'] = _attrValue47;
_attrValue47 = '';
})();
(function () {
  var _attrValue48 = '';
_attrValue48 += 'form__radio';
_params46['class'] = _attrValue48;
_attrValue48 = '';
})();
(function () {
  var _attrValue49 = '';
_attrValue49 += 'configs-radio-option';
_params46['role'] = _attrValue49;
_attrValue49 = '';
})();
(function () {
  var _attrValue50 = '';
_attrValue50 += data['i'];
_params46['value'] = _attrValue50;
_attrValue50 = '';
})();
(function () {
  var _attrValue51 = '';
_attrValue51 += 'configs-radio-option-';
_attrValue51 += data['i'];
_params46['id'] = _attrValue51;
_attrValue51 = '';
})();
(function () {
  var _attrValue52 = '';
_attrValue52 += 'configs-radio-option';
_params46['name'] = _attrValue52;
_attrValue52 = '';
})();
(function () {
  var _attrValue53 = '';
if (data['defaultValue'] == data['i']) {
_params46['checked'] = _attrValue53;
_attrValue53 = '';
}
})();
_childs.push(create('input', _params46));
_childs.push(create('\n          '));
var _params54 = {};
(function () {
  var _attrValue55 = '';
_attrValue55 += 'form__radio-label';
_params54['class'] = _attrValue55;
_attrValue55 = '';
})();
(function () {
  var _attrValue56 = '';
_attrValue56 += 'configs-radio-option-';
_attrValue56 += data['i'];
_params54['for'] = _attrValue56;
_attrValue56 = '';
})();
_childs.push(create('label', _params54, function (_childs) {
}));
_childs.push(create('\n          '));
var _params57 = {};
_childs.push(create('label', _params57, function (_childs) {
var _params58 = {};
(function () {
  var _attrValue59 = '';
_attrValue59 += 'text';
_params58['type'] = _attrValue59;
_attrValue59 = '';
})();
(function () {
  var _attrValue60 = '';
_attrValue60 += 'form__inp form__inp--half-width';
_params58['class'] = _attrValue60;
_attrValue60 = '';
})();
(function () {
  var _attrValue61 = '';
_attrValue61 += data['option'];
_params58['value'] = _attrValue61;
_attrValue61 = '';
})();
(function () {
  var _attrValue62 = '';
_attrValue62 += 'configs-radio-option-label';
_params58['role'] = _attrValue62;
_attrValue62 = '';
})();
(function () {
  var _attrValue63 = '';
_attrValue63 += data['i'];
_params58['data-index'] = _attrValue63;
_attrValue63 = '';
})();
_childs.push(create('input', _params58));
}));
_childs.push(create('\n        '));
}));
_childs.push(create('\n        '));
}
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params64 = {};
(function () {
  var _attrValue65 = '';
_attrValue65 += 'form__submit';
_params64['class'] = _attrValue65;
_attrValue65 = '';
})();
_childs.push(create('div', _params64, function (_childs) {
_childs.push(create('\n    '));
var _params66 = {};
(function () {
  var _attrValue67 = '';
_attrValue67 += 'form__btn form__btn--submit';
_params66['class'] = _attrValue67;
_attrValue67 = '';
})();
_childs.push(create('button', _params66, function (_childs) {
_childs.push(create('Сохранить'));
}));
_childs.push(create('\n    '));
var _params68 = {};
(function () {
  var _attrValue69 = '';
_attrValue69 += 'button';
_params68['type'] = _attrValue69;
_attrValue69 = '';
})();
(function () {
  var _attrValue70 = '';
_attrValue70 += 'form__btn popup__cancel';
_params68['class'] = _attrValue70;
_attrValue70 = '';
})();
_childs.push(create('button', _params68, function (_childs) {
_childs.push(create('Отменить'));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n'));
}));
_childs.push(create('\n'));    return _childs;
  };
});
},{}],7:[function(require,module,exports){
(function (factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define([], factory());
  }
})(function () {
  var MKARR_OPEN = 2 << 1;
  var MKARR_CLOSE = 1 << 1;
  function mkArr(start, end, flag) {
    var arr = [], i;
    if (flag & MKARR_OPEN) {
      if (start <= end) {
        for (i = start; i < end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i > end; i--) {
          arr.push(i);
        }
      }
    } else if (flag & MKARR_CLOSE) {
      if (start <= end) {
        for (i = start; i <= end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i >= end; i--) {
          arr.push(i);
        }
      }
    }
    return arr;
  }
  function str(str, len, sprtr) {
    if (!len) len = 0;
    if (typeof str.toString === 'function') str = str.toString();
    if (!sprtr) sprtr = '.';
    if (~str.indexOf('.')) {
      if (len > 0) {
        str = str.substr(0, str.indexOf('.') + len + 1);
      } else {
        str = str.substr(0, str.indexOf('.') + len);
      }
    } else {
      str = str_pad(str + '.', str.length + 1 + len, '0');
    }
    return str.replace('.', sprtr);
  }
  function str_replace(str, src, rep) {
    while (~str.indexOf(src)) {
      str = str.replace(src, rep);
    }
    return str;
  }
  var STRPADRIGHT = 1 << 1;
  var STRPADLEFT = 2 << 1;
  var STRPADBOTH = 4 << 1;
  function __str_pad_repeater(str, len) {
    var collect = '', i;
    while(collect.length < len) collect += str;
    collect = collect.substr(0, len);
    return collect;
  }
  function str_pad(str, len, sub, type) {
    if (typeof type === 'undefined') type = STRPADRIGHT;
    var half = '', pad_to_go;
    if ((pad_to_go = len - str.length) > 0) {
      if (type & STRPADLEFT) { str = __str_pad_repeater(sub, pad_to_go) + str; }
      else if (type & STRPADRIGHT) {str = str + __str_pad_repeater(sub, pad_to_go); }
      else if (type & STRPADBOTH) {
        half = __str_pad_repeater(sub, Math.ceil(pad_to_go/2));
        str = half + str + half;
        str = str.substr(0, len);
      }
    }
    return str;
  }
  function str_htmlescape(html) {
    return html.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  }
  function str_upfirst(str) {
    return str.split(/[\s\n\t]+/).map(function (item) {
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join(' ');
  }
  function str_camel(str) {
    return str.split(/[\s\n\t]+/).map(function (item, index) {
      if (!index) return item;
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join('');
  }
  function str_kebab(str) {
    return str.split(/[\s\n\t]+/).join('-');
  }
  function arr_values(obj) {
    var values = [], i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) values.push(obj[i]);
    return values;
  }
  function arr_contain(obj, value) {
    if(typeof obj.indexOf === 'function') return obj.indexOf(value) !== -1;
    var i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) if (obj[i] === value) return true;
    return false;
  }
  function arr_len(obj) {
    if(typeof obj.length !== 'undefined') return obj.length;
    var i, length = 0;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) length++;
    return length;
  }
  function arr_push(arr, value) {
    arr.push(value);
    return '';
  }
  function arr_unshift(arr, value) {
    arr.unshift(value);
    return '';
  }
  function arr_rand(arr, value) {
    var keys = Object.keys(arr);
    return arr[keys[parseInt(Math.random() * arr_len(arr) - 1)]];
  }
  function arr_splice(arr, st, en, els) {
    var prms = [st];
    if (typeof en !== 'undefined') prms.push(en);
    return Array.prototype.splice.apply(arr, prms.concat(els));
  }
  function arr_pad(src, len, el) {
    var i, arr = src.slice(0);
    if(len > 0) for(i = arr_len(arr);i < len;i++) arr.push(el);
    if(len < 0) for(i = arr_len(arr);i < -len;i++) arr.unshift(el);
    return arr;
  }
  function arr_reverse(src) {
    var arr = src.slice(0);
    arr.reverse();
    return arr;
  }
  function arr_sort(src) {
    var arr = src.slice(0);
    arr.sort();
    return arr;
  }
  function arr_sort_reverse(src) {
    var arr = src.slice(0);
    arr.sort();
    arr.reverse();
    return arr;
  }
  function arr_unique(src) {
    var i, arr = [];
    for(i in src) if (Object.prototype.hasOwnProperty.call(src, i)) if (!~arr.indexOf(src[i])) arr.push(src[i]);
    return arr;
  }
  function arr_key(arr, value) {
    var i;
    for(i in arr) if (Object.prototype.hasOwnProperty.call(arr, i)) if (value == arr[i]) return i;
    return -1;
  }
  function create(name, attrs, cb) {
    if (typeof name === 'object') return name;
    var childs = [];
    if (typeof cb === 'function') cb(childs);
    if (attrs) {
      return {
        type: 'node',
        name: name,
        attrs: attrs,
        childs: childs.filter(function (_child) { return _child !== null; })
      };
    }
    if (typeof name.toString === 'function') name = name.toString();
    return {
      type: 'text',
      text: name
    };
  }
  return function (data, childs) {
    var _childs = [];
var i;
var _params0 = {};
(function () {
  var _attrValue1 = '';
_attrValue1 += 'popup__head';
_params0['class'] = _attrValue1;
_attrValue1 = '';
})();
_childs.push(create('div', _params0, function (_childs) {
_childs.push(create('Настройки выпадайки'));
}));
_childs.push(create('\n'));
var _params2 = {};
(function () {
  var _attrValue3 = '';
_params2['action'] = _attrValue3;
_attrValue3 = '';
})();
(function () {
  var _attrValue4 = '';
_attrValue4 += 'form';
_params2['class'] = _attrValue4;
_attrValue4 = '';
})();
(function () {
  var _attrValue5 = '';
_attrValue5 += 'configs-form';
_params2['role'] = _attrValue5;
_attrValue5 = '';
})();
_childs.push(create('form', _params2, function (_childs) {
_childs.push(create('\n  '));
var _params6 = {};
(function () {
  var _attrValue7 = '';
_attrValue7 += 'form__item';
_params6['class'] = _attrValue7;
_attrValue7 = '';
})();
_childs.push(create('div', _params6, function (_childs) {
_childs.push(create('\n    '));
var _params8 = {};
(function () {
  var _attrValue9 = '';
_attrValue9 += 'configs-select-num-options';
_params8['for'] = _attrValue9;
_attrValue9 = '';
})();
(function () {
  var _attrValue10 = '';
_attrValue10 += 'form__label';
_params8['class'] = _attrValue10;
_attrValue10 = '';
})();
_childs.push(create('label', _params8, function (_childs) {
_childs.push(create('Количество вариантов ответа'));
}));
_childs.push(create('\n    '));
var _params11 = {};
(function () {
  var _attrValue12 = '';
_attrValue12 += 'form__inp-contain';
_params11['class'] = _attrValue12;
_attrValue12 = '';
})();
_childs.push(create('div', _params11, function (_childs) {
_childs.push(create('\n      '));
var _params13 = {};
(function () {
  var _attrValue14 = '';
_attrValue14 += 'text';
_params13['type'] = _attrValue14;
_attrValue14 = '';
})();
(function () {
  var _attrValue15 = '';
_attrValue15 += 'form__inp form__inp--very-short';
_params13['class'] = _attrValue15;
_attrValue15 = '';
})();
(function () {
  var _attrValue16 = '';
_attrValue16 += data['numOptions'];
_params13['value'] = _attrValue16;
_attrValue16 = '';
})();
(function () {
  var _attrValue17 = '';
_attrValue17 += 'configs-select-num-options';
_params13['role'] = _attrValue17;
_attrValue17 = '';
})();
(function () {
  var _attrValue18 = '';
_attrValue18 += 'configs-select-num-options';
_params13['id'] = _attrValue18;
_attrValue18 = '';
})();
_childs.push(create('input', _params13));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params19 = {};
(function () {
  var _attrValue20 = '';
_attrValue20 += 'form__item';
_params19['class'] = _attrValue20;
_attrValue20 = '';
})();
_childs.push(create('div', _params19, function (_childs) {
_childs.push(create('\n    '));
var _params21 = {};
(function () {
  var _attrValue22 = '';
_attrValue22 += 'form__label';
_params21['class'] = _attrValue22;
_attrValue22 = '';
})();
_childs.push(create('label', _params21, function (_childs) {
_childs.push(create('Варианты ответов:'));
}));
_childs.push(create('\n    '));
var _params23 = {};
(function () {
  var _attrValue24 = '';
_attrValue24 += 'form__inp-contain form__inp-contain--full-width';
_params23['class'] = _attrValue24;
_attrValue24 = '';
})();
_childs.push(create('div', _params23, function (_childs) {
_childs.push(create('\n      '));
var _params25 = {};
(function () {
  var _attrValue26 = '';
_attrValue26 += 'form__row-option';
_params25['class'] = _attrValue26;
_attrValue26 = '';
})();
_childs.push(create('div', _params25, function (_childs) {
_childs.push(create('\n        '));
var _params27 = {};
(function () {
  var _attrValue28 = '';
_attrValue28 += 'radio';
_params27['type'] = _attrValue28;
_attrValue28 = '';
})();
(function () {
  var _attrValue29 = '';
_attrValue29 += 'form__radio';
_params27['class'] = _attrValue29;
_attrValue29 = '';
})();
(function () {
  var _attrValue30 = '';
_attrValue30 += 'configs-select-option';
_params27['role'] = _attrValue30;
_attrValue30 = '';
})();
(function () {
  var _attrValue31 = '';
_attrValue31 += '-1';
_params27['value'] = _attrValue31;
_attrValue31 = '';
})();
(function () {
  var _attrValue32 = '';
_attrValue32 += 'configs-select-option--1';
_params27['id'] = _attrValue32;
_attrValue32 = '';
})();
(function () {
  var _attrValue33 = '';
_attrValue33 += 'configs-select-option';
_params27['name'] = _attrValue33;
_attrValue33 = '';
})();
(function () {
  var _attrValue34 = '';
if (data['defaultValue'] == -1 || data['defaultValue'] == "-1") {
_params27['checked'] = _attrValue34;
_attrValue34 = '';
}
})();
_childs.push(create('input', _params27));
_childs.push(create('\n        '));
var _params35 = {};
(function () {
  var _attrValue36 = '';
_attrValue36 += 'form__radio-label';
_params35['class'] = _attrValue36;
_attrValue36 = '';
})();
(function () {
  var _attrValue37 = '';
_attrValue37 += 'configs-select-option--1';
_params35['for'] = _attrValue37;
_attrValue37 = '';
})();
_childs.push(create('label', _params35, function (_childs) {
}));
_childs.push(create('\n        '));
var _params38 = {};
(function () {
  var _attrValue39 = '';
_attrValue39 += 'configs-select-option--1';
_params38['for'] = _attrValue39;
_attrValue39 = '';
})();
_childs.push(create('label', _params38, function (_childs) {
var _params40 = {};
_childs.push(create('i', _params40, function (_childs) {
_childs.push(create('Ничего не выбрано по умолчанию'));
}));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n      '));
var _params41 = {};
(function () {
  var _attrValue42 = '';
_attrValue42 += 'configs-select-options-contain';
_params41['role'] = _attrValue42;
_attrValue42 = '';
})();
_childs.push(create('div', _params41, function (_childs) {
_childs.push(create('\n        '));
var _arr43 = data['defaultData'];
for (data['i'] in _arr43) {
data['option'] = _arr43[data['i']];
_childs.push(create('\n        '));
var _params44 = {};
(function () {
  var _attrValue45 = '';
_attrValue45 += 'form__row-option';
_params44['class'] = _attrValue45;
_attrValue45 = '';
})();
_childs.push(create('div', _params44, function (_childs) {
_childs.push(create('\n          '));
var _params46 = {};
(function () {
  var _attrValue47 = '';
_attrValue47 += 'radio';
_params46['type'] = _attrValue47;
_attrValue47 = '';
})();
(function () {
  var _attrValue48 = '';
_attrValue48 += 'form__radio';
_params46['class'] = _attrValue48;
_attrValue48 = '';
})();
(function () {
  var _attrValue49 = '';
_attrValue49 += 'configs-select-option';
_params46['role'] = _attrValue49;
_attrValue49 = '';
})();
(function () {
  var _attrValue50 = '';
_attrValue50 += data['i'];
_params46['value'] = _attrValue50;
_attrValue50 = '';
})();
(function () {
  var _attrValue51 = '';
_attrValue51 += 'configs-select-option-';
_attrValue51 += data['i'];
_params46['id'] = _attrValue51;
_attrValue51 = '';
})();
(function () {
  var _attrValue52 = '';
_attrValue52 += 'configs-select-option';
_params46['name'] = _attrValue52;
_attrValue52 = '';
})();
(function () {
  var _attrValue53 = '';
if (data['defaultValue'] == data['i']) {
_params46['checked'] = _attrValue53;
_attrValue53 = '';
}
})();
_childs.push(create('input', _params46));
_childs.push(create('\n          '));
var _params54 = {};
(function () {
  var _attrValue55 = '';
_attrValue55 += 'form__radio-label';
_params54['class'] = _attrValue55;
_attrValue55 = '';
})();
(function () {
  var _attrValue56 = '';
_attrValue56 += 'configs-select-option-';
_attrValue56 += data['i'];
_params54['for'] = _attrValue56;
_attrValue56 = '';
})();
_childs.push(create('label', _params54, function (_childs) {
}));
_childs.push(create('\n          '));
var _params57 = {};
_childs.push(create('label', _params57, function (_childs) {
var _params58 = {};
(function () {
  var _attrValue59 = '';
_attrValue59 += 'text';
_params58['type'] = _attrValue59;
_attrValue59 = '';
})();
(function () {
  var _attrValue60 = '';
_attrValue60 += 'form__inp form__inp--half-width';
_params58['class'] = _attrValue60;
_attrValue60 = '';
})();
(function () {
  var _attrValue61 = '';
_attrValue61 += data['option'];
_params58['value'] = _attrValue61;
_attrValue61 = '';
})();
(function () {
  var _attrValue62 = '';
_attrValue62 += 'configs-select-option-label';
_params58['role'] = _attrValue62;
_attrValue62 = '';
})();
(function () {
  var _attrValue63 = '';
_attrValue63 += data['i'];
_params58['data-index'] = _attrValue63;
_attrValue63 = '';
})();
_childs.push(create('input', _params58));
}));
_childs.push(create('\n        '));
}));
_childs.push(create('\n        '));
}
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params64 = {};
(function () {
  var _attrValue65 = '';
_attrValue65 += 'form__submit';
_params64['class'] = _attrValue65;
_attrValue65 = '';
})();
_childs.push(create('div', _params64, function (_childs) {
_childs.push(create('\n    '));
var _params66 = {};
(function () {
  var _attrValue67 = '';
_attrValue67 += 'form__btn form__btn--submit';
_params66['class'] = _attrValue67;
_attrValue67 = '';
})();
_childs.push(create('button', _params66, function (_childs) {
_childs.push(create('Сохранить'));
}));
_childs.push(create('\n    '));
var _params68 = {};
(function () {
  var _attrValue69 = '';
_attrValue69 += 'button';
_params68['type'] = _attrValue69;
_attrValue69 = '';
})();
(function () {
  var _attrValue70 = '';
_attrValue70 += 'form__btn popup__cancel';
_params68['class'] = _attrValue70;
_attrValue70 = '';
})();
_childs.push(create('button', _params68, function (_childs) {
_childs.push(create('Отменить'));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n'));
}));
_childs.push(create('\n'));    return _childs;
  };
});
},{}],8:[function(require,module,exports){
(function (factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define([], factory());
  }
})(function () {
  var MKARR_OPEN = 2 << 1;
  var MKARR_CLOSE = 1 << 1;
  function mkArr(start, end, flag) {
    var arr = [], i;
    if (flag & MKARR_OPEN) {
      if (start <= end) {
        for (i = start; i < end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i > end; i--) {
          arr.push(i);
        }
      }
    } else if (flag & MKARR_CLOSE) {
      if (start <= end) {
        for (i = start; i <= end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i >= end; i--) {
          arr.push(i);
        }
      }
    }
    return arr;
  }
  function str(str, len, sprtr) {
    if (!len) len = 0;
    if (typeof str.toString === 'function') str = str.toString();
    if (!sprtr) sprtr = '.';
    if (~str.indexOf('.')) {
      if (len > 0) {
        str = str.substr(0, str.indexOf('.') + len + 1);
      } else {
        str = str.substr(0, str.indexOf('.') + len);
      }
    } else {
      str = str_pad(str + '.', str.length + 1 + len, '0');
    }
    return str.replace('.', sprtr);
  }
  function str_replace(str, src, rep) {
    while (~str.indexOf(src)) {
      str = str.replace(src, rep);
    }
    return str;
  }
  var STRPADRIGHT = 1 << 1;
  var STRPADLEFT = 2 << 1;
  var STRPADBOTH = 4 << 1;
  function __str_pad_repeater(str, len) {
    var collect = '', i;
    while(collect.length < len) collect += str;
    collect = collect.substr(0, len);
    return collect;
  }
  function str_pad(str, len, sub, type) {
    if (typeof type === 'undefined') type = STRPADRIGHT;
    var half = '', pad_to_go;
    if ((pad_to_go = len - str.length) > 0) {
      if (type & STRPADLEFT) { str = __str_pad_repeater(sub, pad_to_go) + str; }
      else if (type & STRPADRIGHT) {str = str + __str_pad_repeater(sub, pad_to_go); }
      else if (type & STRPADBOTH) {
        half = __str_pad_repeater(sub, Math.ceil(pad_to_go/2));
        str = half + str + half;
        str = str.substr(0, len);
      }
    }
    return str;
  }
  function str_htmlescape(html) {
    return html.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  }
  function str_upfirst(str) {
    return str.split(/[\s\n\t]+/).map(function (item) {
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join(' ');
  }
  function str_camel(str) {
    return str.split(/[\s\n\t]+/).map(function (item, index) {
      if (!index) return item;
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join('');
  }
  function str_kebab(str) {
    return str.split(/[\s\n\t]+/).join('-');
  }
  function arr_values(obj) {
    var values = [], i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) values.push(obj[i]);
    return values;
  }
  function arr_contain(obj, value) {
    if(typeof obj.indexOf === 'function') return obj.indexOf(value) !== -1;
    var i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) if (obj[i] === value) return true;
    return false;
  }
  function arr_len(obj) {
    if(typeof obj.length !== 'undefined') return obj.length;
    var i, length = 0;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) length++;
    return length;
  }
  function arr_push(arr, value) {
    arr.push(value);
    return '';
  }
  function arr_unshift(arr, value) {
    arr.unshift(value);
    return '';
  }
  function arr_rand(arr, value) {
    var keys = Object.keys(arr);
    return arr[keys[parseInt(Math.random() * arr_len(arr) - 1)]];
  }
  function arr_splice(arr, st, en, els) {
    var prms = [st];
    if (typeof en !== 'undefined') prms.push(en);
    return Array.prototype.splice.apply(arr, prms.concat(els));
  }
  function arr_pad(src, len, el) {
    var i, arr = src.slice(0);
    if(len > 0) for(i = arr_len(arr);i < len;i++) arr.push(el);
    if(len < 0) for(i = arr_len(arr);i < -len;i++) arr.unshift(el);
    return arr;
  }
  function arr_reverse(src) {
    var arr = src.slice(0);
    arr.reverse();
    return arr;
  }
  function arr_sort(src) {
    var arr = src.slice(0);
    arr.sort();
    return arr;
  }
  function arr_sort_reverse(src) {
    var arr = src.slice(0);
    arr.sort();
    arr.reverse();
    return arr;
  }
  function arr_unique(src) {
    var i, arr = [];
    for(i in src) if (Object.prototype.hasOwnProperty.call(src, i)) if (!~arr.indexOf(src[i])) arr.push(src[i]);
    return arr;
  }
  function arr_key(arr, value) {
    var i;
    for(i in arr) if (Object.prototype.hasOwnProperty.call(arr, i)) if (value == arr[i]) return i;
    return -1;
  }
  function create(name, attrs, cb) {
    if (typeof name === 'object') return name;
    var childs = [];
    if (typeof cb === 'function') cb(childs);
    if (attrs) {
      return {
        type: 'node',
        name: name,
        attrs: attrs,
        childs: childs.filter(function (_child) { return _child !== null; })
      };
    }
    if (typeof name.toString === 'function') name = name.toString();
    return {
      type: 'text',
      text: name
    };
  }
  return function (data, childs) {
    var _childs = [];
var rowIndex, columnIndex;
var _params0 = {};
(function () {
  var _attrValue1 = '';
_attrValue1 += 'popup__head';
_params0['class'] = _attrValue1;
_attrValue1 = '';
})();
_childs.push(create('div', _params0, function (_childs) {
_childs.push(create('Настройки таблицы'));
}));
_childs.push(create('\n'));
var _params2 = {};
(function () {
  var _attrValue3 = '';
_params2['action'] = _attrValue3;
_attrValue3 = '';
})();
(function () {
  var _attrValue4 = '';
_attrValue4 += 'form';
_params2['class'] = _attrValue4;
_attrValue4 = '';
})();
(function () {
  var _attrValue5 = '';
_attrValue5 += 'configs-form';
_params2['role'] = _attrValue5;
_attrValue5 = '';
})();
_childs.push(create('form', _params2, function (_childs) {
_childs.push(create('\n  '));
var _params6 = {};
(function () {
  var _attrValue7 = '';
_attrValue7 += 'form__item';
_params6['class'] = _attrValue7;
_attrValue7 = '';
})();
_childs.push(create('div', _params6, function (_childs) {
_childs.push(create('\n    '));
var _params8 = {};
(function () {
  var _attrValue9 = '';
_attrValue9 += 'configs-table-columns';
_params8['for'] = _attrValue9;
_attrValue9 = '';
})();
(function () {
  var _attrValue10 = '';
_attrValue10 += 'form__label';
_params8['class'] = _attrValue10;
_attrValue10 = '';
})();
_childs.push(create('label', _params8, function (_childs) {
_childs.push(create('Колонок по умолчанию'));
}));
_childs.push(create('\n    '));
var _params11 = {};
(function () {
  var _attrValue12 = '';
_attrValue12 += 'form__inp-contain';
_params11['class'] = _attrValue12;
_attrValue12 = '';
})();
_childs.push(create('div', _params11, function (_childs) {
_childs.push(create('\n      '));
var _params13 = {};
(function () {
  var _attrValue14 = '';
_attrValue14 += 'text';
_params13['type'] = _attrValue14;
_attrValue14 = '';
})();
(function () {
  var _attrValue15 = '';
_attrValue15 += 'form__inp form__inp--very-short';
_params13['class'] = _attrValue15;
_attrValue15 = '';
})();
(function () {
  var _attrValue16 = '';
_attrValue16 += data['columns'];
_params13['value'] = _attrValue16;
_attrValue16 = '';
})();
(function () {
  var _attrValue17 = '';
_attrValue17 += 'configs-table-columns';
_params13['role'] = _attrValue17;
_attrValue17 = '';
})();
(function () {
  var _attrValue18 = '';
_attrValue18 += 'configs-table-columns';
_params13['id'] = _attrValue18;
_attrValue18 = '';
})();
_childs.push(create('input', _params13));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params19 = {};
(function () {
  var _attrValue20 = '';
_attrValue20 += 'form__item';
_params19['class'] = _attrValue20;
_attrValue20 = '';
})();
_childs.push(create('div', _params19, function (_childs) {
_childs.push(create('\n    '));
var _params21 = {};
(function () {
  var _attrValue22 = '';
_attrValue22 += 'configs-table-rows';
_params21['for'] = _attrValue22;
_attrValue22 = '';
})();
(function () {
  var _attrValue23 = '';
_attrValue23 += 'form__label';
_params21['class'] = _attrValue23;
_attrValue23 = '';
})();
_childs.push(create('label', _params21, function (_childs) {
_childs.push(create('Строк по умолчанию'));
}));
_childs.push(create('\n    '));
var _params24 = {};
(function () {
  var _attrValue25 = '';
_attrValue25 += 'form__inp-contain';
_params24['class'] = _attrValue25;
_attrValue25 = '';
})();
_childs.push(create('div', _params24, function (_childs) {
_childs.push(create('\n      '));
var _params26 = {};
(function () {
  var _attrValue27 = '';
_attrValue27 += 'text';
_params26['type'] = _attrValue27;
_attrValue27 = '';
})();
(function () {
  var _attrValue28 = '';
_attrValue28 += 'form__inp form__inp--very-short';
_params26['class'] = _attrValue28;
_attrValue28 = '';
})();
(function () {
  var _attrValue29 = '';
_attrValue29 += data['rows'];
_params26['value'] = _attrValue29;
_attrValue29 = '';
})();
(function () {
  var _attrValue30 = '';
_attrValue30 += 'configs-table-rows';
_params26['role'] = _attrValue30;
_attrValue30 = '';
})();
(function () {
  var _attrValue31 = '';
_attrValue31 += 'configs-table-rows';
_params26['id'] = _attrValue31;
_attrValue31 = '';
})();
_childs.push(create('input', _params26));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params32 = {};
(function () {
  var _attrValue33 = '';
_attrValue33 += 'form__item';
_params32['class'] = _attrValue33;
_attrValue33 = '';
})();
_childs.push(create('div', _params32, function (_childs) {
_childs.push(create('\n    '));
var _params34 = {};
(function () {
  var _attrValue35 = '';
_attrValue35 += 'configs-table-rows';
_params34['for'] = _attrValue35;
_attrValue35 = '';
})();
(function () {
  var _attrValue36 = '';
_attrValue36 += 'form__label';
_params34['class'] = _attrValue36;
_attrValue36 = '';
})();
_childs.push(create('label', _params34, function (_childs) {
_childs.push(create('Шаблон по умолчанию'));
}));
_childs.push(create('\n    '));
var _params37 = {};
(function () {
  var _attrValue38 = '';
_attrValue38 += 'form__inp-contain form__inp-contain--full-width form__inp-contain--scroll-wrap';
_params37['class'] = _attrValue38;
_attrValue38 = '';
})();
_childs.push(create('div', _params37, function (_childs) {
_childs.push(create('\n      '));
var _params39 = {};
(function () {
  var _attrValue40 = '';
_attrValue40 += 'table table--straight-sides table--responsive';
_params39['class'] = _attrValue40;
_attrValue40 = '';
})();
_childs.push(create('table', _params39, function (_childs) {
_childs.push(create('\n        '));
var _params41 = {};
(function () {
  var _attrValue42 = '';
_attrValue42 += 'configs-table-tbody';
_params41['role'] = _attrValue42;
_attrValue42 = '';
})();
_childs.push(create('tbody', _params41, function (_childs) {
_childs.push(create('\n          '));
var _arr43 = data['defaultData'];
for (data['rowIndex'] in _arr43) {
data['row'] = _arr43[data['rowIndex']];
_childs.push(create('\n          '));
var _params44 = {};
_childs.push(create('tr', _params44, function (_childs) {
_childs.push(create('\n            '));
var _arr45 = data['row'];
for (data['columnIndex'] in _arr45) {
data['column'] = _arr45[data['columnIndex']];
_childs.push(create('\n            '));
var _params46 = {};
_childs.push(create('td', _params46, function (_childs) {
_childs.push(create('\n              '));
var _params47 = {};
(function () {
  var _attrValue48 = '';
_attrValue48 += 'text';
_params47['type'] = _attrValue48;
_attrValue48 = '';
})();
(function () {
  var _attrValue49 = '';
_attrValue49 += 'form__inp form__inp--very-short';
_params47['class'] = _attrValue49;
_attrValue49 = '';
})();
(function () {
  var _attrValue50 = '';
_attrValue50 += data['column'];
_params47['value'] = _attrValue50;
_attrValue50 = '';
})();
(function () {
  var _attrValue51 = '';
_attrValue51 += 'configs-table-cell';
_params47['role'] = _attrValue51;
_attrValue51 = '';
})();
(function () {
  var _attrValue52 = '';
_attrValue52 += data['rowIndex'];
_params47['data-row'] = _attrValue52;
_attrValue52 = '';
})();
(function () {
  var _attrValue53 = '';
_attrValue53 += data['columnIndex'];
_params47['data-column'] = _attrValue53;
_attrValue53 = '';
})();
_childs.push(create('input', _params47));
_childs.push(create('\n            '));
}));
_childs.push(create('\n            '));
}
_childs.push(create('\n          '));
}));
_childs.push(create('\n          '));
}
_childs.push(create('\n        '));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n  '));
var _params54 = {};
(function () {
  var _attrValue55 = '';
_attrValue55 += 'form__submit';
_params54['class'] = _attrValue55;
_attrValue55 = '';
})();
_childs.push(create('div', _params54, function (_childs) {
_childs.push(create('\n    '));
var _params56 = {};
(function () {
  var _attrValue57 = '';
_attrValue57 += 'form__btn form__btn--submit';
_params56['class'] = _attrValue57;
_attrValue57 = '';
})();
_childs.push(create('button', _params56, function (_childs) {
_childs.push(create('Сохранить'));
}));
_childs.push(create('\n    '));
var _params58 = {};
(function () {
  var _attrValue59 = '';
_attrValue59 += 'button';
_params58['type'] = _attrValue59;
_attrValue59 = '';
})();
(function () {
  var _attrValue60 = '';
_attrValue60 += 'form__btn popup__cancel';
_params58['class'] = _attrValue60;
_attrValue60 = '';
})();
_childs.push(create('button', _params58, function (_childs) {
_childs.push(create('Отменить'));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n'));
}));
_childs.push(create('\n'));    return _childs;
  };
});
},{}],9:[function(require,module,exports){
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
  gallery: require("gallery/ConfigsGalleryModel.coffee"),
  select: require("select/ConfigsSelectModel.coffee")
};

views = {
  image: require("image/ConfigsImageView.coffee"),
  table: require("table/ConfigsTableView.coffee"),
  file: require("file/ConfigsFileView.coffee"),
  radio: require("radio/ConfigsRadioView.coffee"),
  checkbox: require("checkbox/ConfigsCheckboxView.coffee"),
  gallery: require("gallery/ConfigsGalleryView.coffee"),
  select: require("select/ConfigsSelectView.coffee")
};

Popup = require("popup");

addView.on("open-configs-modal", function(index, field, fields) {
  var model, view;
  if (fields == null) {
    fields = [];
  }
  Popup.open("@configs-popup");
  field.settings.index = index;
  model = models[field.type](field.settings);
  if (model.setFields != null) {
    model.setFields(fields);
  }
  ($("@configs-popup")).html("");
  view = views[field.type]($("@configs-popup"), model);
  return view.on("save-configs-modal", function(form) {
    console.log(form);
    addModel.saveFieldConfigs(form);
    Popup.close();
    return view.destroy();
  });
});

addModel.on("onSavedSection", function(alias) {
  return window.location.href = "/cms/configs/" + alias + "/";
});


},{"./addModel.coffee":10,"./addView.coffee":11,"checkbox/ConfigsCheckboxModel.coffee":12,"checkbox/ConfigsCheckboxView.coffee":13,"file/ConfigsFileModel.coffee":14,"file/ConfigsFileView.coffee":15,"gallery/ConfigsGalleryModel.coffee":16,"gallery/ConfigsGalleryView.coffee":17,"image/ConfigsImageModel.coffee":18,"image/ConfigsImageView.coffee":19,"jquery-plugins.coffee":"jquery-plugins.coffee","popup":"popup","radio/ConfigsRadioModel.coffee":20,"radio/ConfigsRadioView.coffee":21,"select/ConfigsSelectModel.coffee":22,"select/ConfigsSelectView.coffee":23,"table/ConfigsTableModel.coffee":24,"table/ConfigsTableView.coffee":25}],10:[function(require,module,exports){
var Model, httpGet, httpPost;

Model = require("model.coffee");

httpGet = (require("ajax.coffee")).httpGet;

httpPost = (require("ajax.coffee")).httpPost;

module.exports = Model({
  initialState: function() {
    return httpGet(window.location.pathname).then(function(response) {
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
          type: "string",
          position: this.state.fields.length
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
  updatePosition: function(rowIndex, position) {
    var different, fields;
    fields = this.getFields();
    different = rowIndex - position;
    if (different) {
      fields.forEach(function(field, index) {
        if (index >= position) {
          return field.position += different;
        }
      });
      fields[rowIndex].position = position;
      fields.sort(function(a, b) {
        return a.position - b.position;
      });
      fields.forEach(function(field, index) {
        return field.position = index;
      });
      return this.set({
        fields: fields
      });
    }
  },
  save: function() {
    var data;
    data = {
      alias: this.state.alias,
      title: this.state.title,
      module: this.state.module,
      fields: this.state.fields
    };
    if (this.state.id != null) {
      data.id = this.state.id;
    }
    return httpPost("/cms/configs/action_save/", data).then((function(_this) {
      return function(response) {
        if (response.content != null) {
          console.log(response.content);
        }
        if (_this.state.id != null) {
          return _this.set({
            id: response.section.id
          });
        } else {
          return _this.trigger("onSavedSection", _this.state.alias);
        }
      };
    })(this))["catch"](function(response) {
      if (response.content != null) {
        console.log(response.content);
      }
      if (response.error != null) {
        return console.error(response.error);
      }
    });
  }
});


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee"}],11:[function(require,module,exports){
var $, $body, Popup, Render, View, createDuplicateRow, createLine, tableModuleFields;

$ = require("jquery-plugins.coffee");

View = require("view.coffee");

Render = require("render");

Popup = require("popup");

tableModuleFields = require("sections/configs/table-module-fields");

$body = $(document.body);

createDuplicateRow = function($rowRaw) {
  var $fakeRow, $tdsRaw;
  $fakeRow = $("<div class='form-table__row-fake'></div>");
  this.position = $rowRaw.offset();
  this.fakeRowHeight = $rowRaw.height();
  $tdsRaw = $rowRaw.find(".form-table__cell");
  $tdsRaw.each(function() {
    var $fakeCell, $tdChildsRaw, $tdRaw;
    $tdRaw = $(this);
    $tdChildsRaw = $(this.childNodes);
    $fakeCell = $("<div class='form-table__cell-fake'></div>");
    $fakeCell.css({
      width: ($tdRaw.width()) + "px",
      height: ($tdRaw.height()) + "px"
    });
    $tdChildsRaw.each(function() {
      var $clone;
      $clone = $(this.cloneNode(true));
      return $fakeCell.append($clone);
    });
    return $fakeRow.append($fakeCell);
  });
  $fakeRow.css({
    left: this.position.left + "px",
    top: this.position.top + "px"
  });
  $body.append($fakeRow);
  return this.fakeRow = $fakeRow;
};

createLine = function() {
  this.line = $("<div class='form-table__line'></div>");
  return $body.append(this.line);
};

module.exports = View({
  initial: function() {
    this.dragging = false;
    this.fakeRow = null;
    this.fakeRowHeight = null;
    this.coords = null;
    this.line = null;
    this.position = null;
    return this.rowOffsets = [];
  },
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
    "submit: @configs-add-form": "submitConfigsAddForm",
    "mousedown: @btn-move-row": "mousedownBtnMoveRow",
    "mousemove: document.body": "mousemoveDocumentBody",
    "mouseup: document.body": "mouseupDocumentBody"
  },
  mousedownBtnMoveRow: function(e) {
    var $btn, $rows, lastIndex;
    $btn = $(e.target);
    this.$row = $btn.closest("@row-module-fields");
    this.currentRowIndex = parseInt(this.$row.data("key"), 10);
    createDuplicateRow.call(this, this.$row);
    this.dragging = true;
    this.rowOffsets = [];
    $rows = this.contain.find("@row-module-fields");
    $rows.each((function(_this) {
      return function(index, element) {
        var $rowItem;
        $rowItem = $(element);
        return _this.rowOffsets.push($rowItem.offset().top);
      };
    })(this));
    this.$row.css({
      display: 'none'
    });
    lastIndex = this.rowOffsets.length - 1;
    this.coords = {
      left: e.pageX,
      top: e.pageY
    };
    createLine.call(this, this.$row);
    return this.drawLineByIndex(this.currentRowIndex);
  },
  getIndexByCoords: function(e) {
    var diff, i, index, len, offset, ref;
    ref = this.rowOffsets;
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      offset = ref[index];
      diff = Math.abs(this.position.top + (e.pageY - this.coords.top) - offset);
      if (diff <= this.fakeRowHeight / 2) {
        return index;
      }
    }
    if (this.position.top + (e.pageY - this.coords.top) - this.fakeRowHeight / 2 > offset) {
      return Infinity;
    } else {
      return 0;
    }
  },
  drawLineByIndex: function(index) {
    var top;
    top = 0;
    if (index !== Infinity) {
      top = this.rowOffsets[index];
    }
    return this.line.css({
      top: top + "px"
    });
  },
  mousemoveDocumentBody: function(e) {
    var index;
    if (this.dragging) {
      index = this.getIndexByCoords(e);
      if (index === Infinity) {
        index = this.rowOffsets.length;
      }
      this.drawLineByIndex(index);
      return this.fakeRow.css({
        left: (this.position.left + (e.pageX - this.coords.left)) + "px",
        top: (this.position.top + (e.pageY - this.coords.top)) + "px"
      });
    }
  },
  mouseupDocumentBody: function(e) {
    var index;
    if (this.dragging) {
      index = this.getIndexByCoords(e);
      if (index === Infinity) {
        index = this.rowOffsets.length;
      }
      this.$row.css({
        display: ''
      });
      this.fakeRow.remove();
      this.line.remove();
      this.model.updatePosition(this.currentRowIndex, index);
      this.currentRowIndex = null;
      this.dragging = false;
      this.fakeRow = null;
      this.coords = null;
      this.line = null;
      this.position = null;
      this.fakeRowHeight = null;
      return this.rowOffsets.splice(0);
    }
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


},{"jquery-plugins.coffee":"jquery-plugins.coffee","popup":"popup","render":"render","sections/configs/table-module-fields":1,"view.coffee":"view.coffee"}],12:[function(require,module,exports){
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
    if (!isNaN(value)) {
      if (value > numOpts) {
        for (i = j = ref = numOpts + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
          defaultData.push({
            label: "",
            checked: false
          });
        }
      } else if (value < numOpts) {
        for (i = k = ref2 = value + 1, ref3 = numOpts; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
          defaultData.pop();
        }
      }
      return this.set({
        numOptions: value,
        defaultData: defaultData
      });
    }
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


},{"model.coffee":"model.coffee"}],13:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/checkbox/modal");

module.exports = View({
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-checkbox-num-options": function(e) {
      return this.model.updateNumOptions(e.target.value);
    },
    "blur: @configs-checkbox-num-options": function(e) {
      return this.model.updateNumOptions(e.target.value);
    },
    "keydown: @configs-checkbox-num-options": function(e) {
      if (e.keyCode === 13) {
        this.model.updateNumOptions(e.target.value);
        return e.preventDefault();
      }
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


},{"render":"render","types/checkbox/modal":2,"view.coffee":"view.coffee"}],14:[function(require,module,exports){
var Model, httpGet, httpPost,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Model = require("model.coffee");

httpGet = (require("ajax.coffee")).httpGet;

httpPost = (require("ajax.coffee")).httpPost;

module.exports = Model({
  initial: function() {
    this.set({
      s3auth: false,
      isS3checking: false,
      buckets: []
    });
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
    return httpGet("/cms/types/file/checkpath/", {
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
  testConnectionS3: function() {
    if (this.state.storage === "s3" && this.state.s3AccessKey && this.state.s3SecretKey && !this.state.s3auth) {
      this.set({
        isS3checking: true
      });
      return httpGet("/cms/types/file/check-s3-connection/", {
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
            isS3checking: false
          });
        };
      })(this))["catch"](function(error) {
        this.set({
          isS3checking: false
        });
        return console.error(error);
      });
    }
  },
  updateS3AccessKey: function(value) {
    if (this.state.s3AccessKey !== value) {
      return this.set({
        s3auth: false,
        buckets: [],
        s3AccessKey: value
      });
    }
  },
  updateS3SecretKey: function(value) {
    if (this.state.s3SecretKey !== value) {
      return this.set({
        s3auth: false,
        buckets: [],
        s3SecretKey: value
      });
    }
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


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee"}],15:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/file/modal");

module.exports = View({
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "click: @configs-file-storage": function(e) {
      return this.model.updateStorage(($(e.target)).data("value"));
    },
    "keydown: @configs-file-path": function(e) {
      return this.model.resetPath();
    },
    "keyup input: @configs-file-path": function(e) {
      return this.frequency(500, (function(_this) {
        return function() {
          return _this.model.updatePath(e.target.value);
        };
      })(this));
    },
    "change: @configs-file-path": function(e) {
      return this.model.updatePath(e.target.value);
    },
    "change keyup input blur: @configs-file-s3-access-key": function(e) {
      return this.frequency(500, (function(_this) {
        return function() {
          return _this.model.updateS3AccessKey(e.target.value);
        };
      })(this));
    },
    "change keyup input blur: @configs-file-s3-secret-key": function(e) {
      return this.frequency(500, (function(_this) {
        return function() {
          return _this.model.updateS3SecretKey(e.target.value);
        };
      })(this));
    },
    "change: @configs-file-s3-bucket": function(e) {
      return this.model.updateS3Bucket(e.target.value);
    },
    "change keyup input: @configs-file-s3-path": function(e) {
      return this.frequency(500, (function(_this) {
        return function() {
          return _this.model.updateS3Path(e.target.value);
        };
      })(this));
    },
    "click: @test-connection-s3": function(e) {
      return this.model.testConnectionS3();
    },
    "popup-close: contain": function(e) {
      return this.destroy();
    }
  },
  render: function(state) {
    return this.modalContain(state);
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", this.model.getState());
    return false;
  }
});


},{"render":"render","types/file/modal":3,"view.coffee":"view.coffee"}],16:[function(require,module,exports){
var Model, httpGet, httpPost,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Model = require("model.coffee");

httpGet = (require("ajax.coffee")).httpGet;

httpPost = (require("ajax.coffee")).httpPost;

module.exports = Model({
  initial: function() {
    this.testConnectionS3();
    return this.checkPath();
  },
  defaultState: function() {
    return {
      storage: "local",
      s3auth: false,
      isS3checking: false,
      buckets: [],
      path: "/",
      width: "",
      height: "",
      previewWidth: "",
      previewHeight: "",
      pathError: false,
      s3AccessKey: "",
      s3SecretKey: "",
      s3auth: false,
      s3Bucket: ""
    };
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
    return httpGet("/cms/types/gallery/checkpath/", {
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
    if (this.state.storage === "s3" && this.state.s3AccessKey && this.state.s3SecretKey && !this.state.s3auth) {
      this.set({
        isS3checking: true
      });
      return httpGet("/cms/types/gallery/check-s3-connection/", {
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
            isS3checking: false
          });
        };
      })(this))["catch"](function(error) {
        this.set({
          isS3checking: false
        });
        return console.error(error);
      });
    }
  },
  updateS3AccessKey: function(value) {
    if (this.state.s3AccessKey !== value) {
      this.set({
        s3auth: false,
        buckets: []
      });
    }
    return this.set({
      s3AccessKey: value
    });
  },
  updateS3SecretKey: function(value) {
    if (value && this.state.s3SecretKey !== value) {
      return this.set({
        s3auth: false,
        buckets: false,
        s3SecretKey: value
      });
    }
  },
  updateS3Bucket: function(value) {
    return this.set({
      s3Bucket: value
    });
  },
  updateS3Path: function(value) {
    if (this.state.s3Path !== value) {
      this.s3ResetPath();
      return this.set({
        s3Path: value
      });
    }
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
  updateMaxSize: function(value) {
    return this.set({
      maxsize: value
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


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee"}],17:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/gallery/modal");

module.exports = View({
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "click: @configs-gallery-storage": function(e) {
      return this.model.updateStorage(($(e.target)).data("value"));
    },
    "keydown: @configs-gallery-path": function(e) {
      return this.model.resetPath();
    },
    "keyup input: @configs-gallery-path": function(e) {
      return this.frequency(500, (function(_this) {
        return function() {
          return _this.model.updatePath(e.target.value);
        };
      })(this));
    },
    "change: @configs-gallery-path": function(e) {
      return this.model.updatePath(e.target.value);
    },
    "change keyup input blur: @configs-gallery-s3-access-key": function(e) {
      return this.frequency(500, (function(_this) {
        return function() {
          return _this.model.updateS3AccessKey(e.target.value);
        };
      })(this));
    },
    "change keyup input blur: @configs-gallery-s3-secret-key": function(e) {
      return this.frequency(500, (function(_this) {
        return function() {
          return _this.model.updateS3SecretKey(e.target.value);
        };
      })(this));
    },
    "change: @configs-gallery-s3-bucket": function(e) {
      return this.model.updateS3Bucket(e.target.value);
    },
    "change keyup input: @configs-gallery-s3-path": function(e) {
      return this.frequency(500, (function(_this) {
        return function() {
          return _this.model.updateS3Path(e.target.value);
        };
      })(this));
    },
    "change: @configs-gallery-width": function(e) {
      return this.model.updateWidth(e.target.value);
    },
    "change: @configs-gallery-height": function(e) {
      return this.model.updateHeight(e.target.value);
    },
    "change: @configs-gallery-maxsize": function(e) {
      return this.model.updateMaxSize(e.target.value);
    },
    "change: @configs-gallery-source": function(e) {
      return this.model.updateSource(e.target.value);
    },
    "click: @test-connection-s3": function(e) {
      return this.model.testConnectionS3();
    },
    "popup-close: contain": function(e) {
      return this.destroy();
    }
  },
  render: function(state) {
    return this.modalContain(state);
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", this.model.getState());
    return false;
  }
});


},{"render":"render","types/gallery/modal":4,"view.coffee":"view.coffee"}],18:[function(require,module,exports){
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
      if (field.type === "image" && index !== this.state.index && field.alias) {
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
  defaultState: function() {
    return {
      storage: "local",
      s3auth: false,
      isS3checking: false,
      buckets: [],
      sources: [],
      path: "/",
      width: "0",
      height: "0",
      saveRatio: false,
      pathError: false,
      s3AccessKey: "",
      s3SecretKey: "",
      s3auth: false,
      s3Bucket: ""
    };
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
    return httpGet("/cms/types/image/checkpath/", {
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
    if (this.state.storage === "s3" && this.state.s3AccessKey && this.state.s3SecretKey && !this.state.s3auth) {
      this.set({
        isS3checking: true
      });
      return httpGet("/cms/types/image/check-s3-connection/", {
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
            isS3checking: false
          });
        };
      })(this))["catch"](function(error) {
        this.set({
          isS3checking: false
        });
        return console.error(error);
      });
    }
  },
  updateS3AccessKey: function(value) {
    if (this.state.s3AccessKey !== value) {
      this.set({
        s3auth: false,
        buckets: []
      });
    }
    return this.set({
      s3AccessKey: value
    });
  },
  updateS3SecretKey: function(value) {
    if (value && this.state.s3SecretKey !== value) {
      return this.set({
        s3auth: false,
        buckets: false,
        s3SecretKey: value
      });
    }
  },
  updateS3Bucket: function(value) {
    return this.set({
      s3Bucket: value
    });
  },
  updateS3Path: function(value) {
    if (this.state.s3Path !== value) {
      this.s3ResetPath();
      return this.set({
        s3Path: value
      });
    }
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
  updateSaveRatio: function(value) {
    return this.set({
      saveRatio: value
    });
  },
  updateSource: function(value) {
    return this.set({
      source: value
    });
  },
  getState: function() {
    var key, state;
    state = {};
    for (key in this.state) {
      if (key !== "fields") {
        state[key] = this.state[key];
      }
    }
    return state;
  }
});


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee"}],19:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/image/modal");

module.exports = View({
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "click: @configs-image-storage": function(e) {
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
    "change keyup input blur: @configs-image-s3-access-key": function(e) {
      return this.frequency(500, (function(_this) {
        return function() {
          return _this.model.updateS3AccessKey(e.target.value);
        };
      })(this));
    },
    "change keyup input blur: @configs-image-s3-secret-key": function(e) {
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
    "change: @configs-image-save-ratio": function(e) {
      return this.model.updateSaveRatio(e.target.checked);
    },
    "change: @configs-image-source": function(e) {
      return this.model.updateSource(e.target.value);
    },
    "click: @test-connection-s3": function(e) {
      return this.model.testConnectionS3();
    },
    "popup-close: contain": function(e) {
      return this.destroy();
    }
  },
  render: function(state) {
    return this.modalContain(state);
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", this.model.getState());
    return false;
  }
});


},{"render":"render","types/image/modal":5,"view.coffee":"view.coffee"}],20:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  initial: function() {
    var defaultData;
    if (+this.state.defaultValue === -1) {
      defaultData = this.state.defaultData.slice(0);
      defaultData.shift();
      return this.set({
        defaultData: defaultData
      });
    }
  },
  getState: function() {
    return this.state;
  },
  updateNumOptions: function(value) {
    var defaultData, defaultValue, i, j, k, numOpts, ref, ref1, ref2, ref3;
    value = parseInt(value, 10);
    numOpts = parseInt(this.state.numOptions, 10);
    defaultValue = parseInt(this.state.defaultValue, 10);
    defaultData = this.state.defaultData.slice();
    if (!isNaN(value)) {
      if (value > numOpts) {
        for (i = j = ref = numOpts + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
          defaultData.push("");
        }
      } else if (value < numOpts) {
        for (i = k = ref2 = value + 1, ref3 = numOpts; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
          defaultData.pop();
        }
        if (defaultValue >= value) {
          this.set({
            defaultValue: defaultValue
          });
        }
      }
      if (defaultValue + 1 >= value) {
        defaultValue = -1;
      }
      return this.set({
        numOptions: value,
        defaultData: defaultData,
        defaultValue: defaultValue
      });
    }
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


},{"model.coffee":"model.coffee"}],21:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/radio/modal");

module.exports = View({
  initial: function() {
    return this.optionsContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-radio-num-options": function(e) {
      return this.model.updateNumOptions(e.target.value);
    },
    "blur: @configs-radio-num-options": function(e) {
      return this.model.updateNumOptions(e.target.value);
    },
    "keydown: @configs-radio-num-options": function(e) {
      if (e.keyCode === 13) {
        this.model.updateNumOptions(e.target.value);
        return e.preventDefault();
      }
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


},{"render":"render","types/radio/modal":6,"view.coffee":"view.coffee"}],22:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  initial: function() {
    var defaultData;
    if (+this.state.defaultValue === -1) {
      defaultData = this.state.defaultData.slice(0);
      defaultData.shift();
      return this.set({
        defaultData: defaultData
      });
    }
  },
  getState: function() {
    return this.state;
  },
  updateNumOptions: function(value) {
    var defaultData, defaultValue, i, j, k, numOpts, ref, ref1, ref2, ref3;
    value = parseInt(value, 10);
    numOpts = parseInt(this.state.numOptions, 10);
    defaultValue = parseInt(this.state.defaultValue, 10);
    defaultData = this.state.defaultData.slice();
    if (!isNaN(value)) {
      if (value > numOpts) {
        for (i = j = ref = numOpts + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
          defaultData.push("");
        }
      } else if (value < numOpts) {
        for (i = k = ref2 = value + 1, ref3 = numOpts; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
          defaultData.pop();
        }
        if (defaultValue >= value) {
          this.set({
            defaultValue: defaultValue
          });
        }
      }
      if (defaultValue + 1 >= value) {
        defaultValue = -1;
      }
      return this.set({
        numOptions: value,
        defaultData: defaultData,
        defaultValue: defaultValue
      });
    }
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


},{"model.coffee":"model.coffee"}],23:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/select/modal");

module.exports = View({
  initial: function() {
    return this.optionsContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-select-num-options": function(e) {
      return this.model.updateNumOptions(e.target.value);
    },
    "blur: @configs-select-num-options": function(e) {
      return this.model.updateNumOptions(e.target.value);
    },
    "keydown: @configs-select-num-options": function(e) {
      if (e.keyCode === 13) {
        this.model.updateNumOptions(e.target.value);
        return e.preventDefault();
      }
    },
    "change: @configs-select-option": function(e) {
      return this.model.updateDefaultValue(e.target.value);
    },
    "change: @configs-select-option-label": function(e) {
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


},{"render":"render","types/select/modal":7,"view.coffee":"view.coffee"}],24:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  getState: function() {
    return this.state;
  },
  updateColumns: function(value) {
    var i, j, k, l, len, len1, m, ref, ref1, ref2, ref3, ref4, ref5, row;
    value = parseInt(value, 10);
    if (!isNaN(value)) {
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
    }
  },
  updateRows: function(value) {
    var i, j, k, l, ref, ref1, ref2, ref3, ref4, row;
    value = parseInt(value, 10);
    if (!isNaN(value)) {
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
    }
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


},{"model.coffee":"model.coffee"}],25:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/table/modal");

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


},{"render":"render","types/table/modal":8,"view.coffee":"view.coffee"}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL0dVSS9kaXN0L3NlY3Rpb25zL2NvbmZpZ3MvdGFibGUtbW9kdWxlLWZpZWxkcy5qcyIsIm1vZHVsZXMvR1VJL2Rpc3QvdHlwZXMvY2hlY2tib3gvbW9kYWwuanMiLCJtb2R1bGVzL0dVSS9kaXN0L3R5cGVzL2ZpbGUvbW9kYWwuanMiLCJtb2R1bGVzL0dVSS9kaXN0L3R5cGVzL2dhbGxlcnkvbW9kYWwuanMiLCJtb2R1bGVzL0dVSS9kaXN0L3R5cGVzL2ltYWdlL21vZGFsLmpzIiwibW9kdWxlcy9HVUkvZGlzdC90eXBlcy9yYWRpby9tb2RhbC5qcyIsIm1vZHVsZXMvR1VJL2Rpc3QvdHlwZXMvc2VsZWN0L21vZGFsLmpzIiwibW9kdWxlcy9HVUkvZGlzdC90eXBlcy90YWJsZS9tb2RhbC5qcyIsIm1vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkTW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvc2VjdGlvbnMvY29uZmlncy9hZGRWaWV3LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL2NoZWNrYm94L0NvbmZpZ3NDaGVja2JveE1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL2NoZWNrYm94L0NvbmZpZ3NDaGVja2JveFZpZXcuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvZmlsZS9Db25maWdzRmlsZU1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL2ZpbGUvQ29uZmlnc0ZpbGVWaWV3LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL2dhbGxlcnkvQ29uZmlnc0dhbGxlcnlNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9nYWxsZXJ5L0NvbmZpZ3NHYWxsZXJ5Vmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9pbWFnZS9Db25maWdzSW1hZ2VNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9pbWFnZS9Db25maWdzSW1hZ2VWaWV3LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3JhZGlvL0NvbmZpZ3NSYWRpb01vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3JhZGlvL0NvbmZpZ3NSYWRpb1ZpZXcuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvc2VsZWN0L0NvbmZpZ3NTZWxlY3RNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9zZWxlY3QvQ29uZmlnc1NlbGVjdFZpZXcuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvdGFibGUvQ29uZmlnc1RhYmxlTW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvdGFibGUvQ29uZmlnc1RhYmxlVmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaGRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoNkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDem1DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2p1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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LFFBQVAsQ0FBQSxDQUEvQjtBQUNBLFdBQU87RUFGVSxDQTdCbkI7Q0FEZSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkoKSk7XG4gIH1cbn0pKGZ1bmN0aW9uICgpIHtcbiAgdmFyIE1LQVJSX09QRU4gPSAyIDw8IDE7XG4gIHZhciBNS0FSUl9DTE9TRSA9IDEgPDwgMTtcbiAgZnVuY3Rpb24gbWtBcnIoc3RhcnQsIGVuZCwgZmxhZykge1xuICAgIHZhciBhcnIgPSBbXSwgaTtcbiAgICBpZiAoZmxhZyAmIE1LQVJSX09QRU4pIHtcbiAgICAgIGlmIChzdGFydCA8PSBlbmQpIHtcbiAgICAgICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA+IGVuZDsgaS0tKSB7XG4gICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZsYWcgJiBNS0FSUl9DTE9TRSkge1xuICAgICAgaWYgKHN0YXJ0IDw9IGVuZCkge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA+PSBlbmQ7IGktLSkge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gc3RyKHN0ciwgbGVuLCBzcHJ0cikge1xuICAgIGlmICghbGVuKSBsZW4gPSAwO1xuICAgIGlmICh0eXBlb2Ygc3RyLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSBzdHIgPSBzdHIudG9TdHJpbmcoKTtcbiAgICBpZiAoIXNwcnRyKSBzcHJ0ciA9ICcuJztcbiAgICBpZiAofnN0ci5pbmRleE9mKCcuJykpIHtcbiAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgc3RyLmluZGV4T2YoJy4nKSArIGxlbiArIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCBzdHIuaW5kZXhPZignLicpICsgbGVuKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gc3RyX3BhZChzdHIgKyAnLicsIHN0ci5sZW5ndGggKyAxICsgbGVuLCAnMCcpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoJy4nLCBzcHJ0cik7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX3JlcGxhY2Uoc3RyLCBzcmMsIHJlcCkge1xuICAgIHdoaWxlICh+c3RyLmluZGV4T2Yoc3JjKSkge1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2Uoc3JjLCByZXApO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG4gIHZhciBTVFJQQURSSUdIVCA9IDEgPDwgMTtcbiAgdmFyIFNUUlBBRExFRlQgPSAyIDw8IDE7XG4gIHZhciBTVFJQQURCT1RIID0gNCA8PCAxO1xuICBmdW5jdGlvbiBfX3N0cl9wYWRfcmVwZWF0ZXIoc3RyLCBsZW4pIHtcbiAgICB2YXIgY29sbGVjdCA9ICcnLCBpO1xuICAgIHdoaWxlKGNvbGxlY3QubGVuZ3RoIDwgbGVuKSBjb2xsZWN0ICs9IHN0cjtcbiAgICBjb2xsZWN0ID0gY29sbGVjdC5zdWJzdHIoMCwgbGVuKTtcbiAgICByZXR1cm4gY29sbGVjdDtcbiAgfVxuICBmdW5jdGlvbiBzdHJfcGFkKHN0ciwgbGVuLCBzdWIsIHR5cGUpIHtcbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICd1bmRlZmluZWQnKSB0eXBlID0gU1RSUEFEUklHSFQ7XG4gICAgdmFyIGhhbGYgPSAnJywgcGFkX3RvX2dvO1xuICAgIGlmICgocGFkX3RvX2dvID0gbGVuIC0gc3RyLmxlbmd0aCkgPiAwKSB7XG4gICAgICBpZiAodHlwZSAmIFNUUlBBRExFRlQpIHsgc3RyID0gX19zdHJfcGFkX3JlcGVhdGVyKHN1YiwgcGFkX3RvX2dvKSArIHN0cjsgfVxuICAgICAgZWxzZSBpZiAodHlwZSAmIFNUUlBBRFJJR0hUKSB7c3RyID0gc3RyICsgX19zdHJfcGFkX3JlcGVhdGVyKHN1YiwgcGFkX3RvX2dvKTsgfVxuICAgICAgZWxzZSBpZiAodHlwZSAmIFNUUlBBREJPVEgpIHtcbiAgICAgICAgaGFsZiA9IF9fc3RyX3BhZF9yZXBlYXRlcihzdWIsIE1hdGguY2VpbChwYWRfdG9fZ28vMikpO1xuICAgICAgICBzdHIgPSBoYWxmICsgc3RyICsgaGFsZjtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCBsZW4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9odG1sZXNjYXBlKGh0bWwpIHtcbiAgICByZXR1cm4gaHRtbC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcbiAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcbiAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcbiAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIik7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX3VwZmlyc3Qoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgvW1xcc1xcblxcdF0rLykubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5zdWJzdHIoMCwgMSkudG9VcHBlckNhc2UoKSArIGl0ZW0uc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgfSkuam9pbignICcpO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9jYW1lbChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnNwbGl0KC9bXFxzXFxuXFx0XSsvKS5tYXAoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICBpZiAoIWluZGV4KSByZXR1cm4gaXRlbTtcbiAgICAgIHJldHVybiBpdGVtLnN1YnN0cigwLCAxKS50b1VwcGVyQ2FzZSgpICsgaXRlbS5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9KS5qb2luKCcnKTtcbiAgfVxuICBmdW5jdGlvbiBzdHJfa2ViYWIoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgvW1xcc1xcblxcdF0rLykuam9pbignLScpO1xuICB9XG4gIGZ1bmN0aW9uIGFycl92YWx1ZXMob2JqKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdLCBpO1xuICAgIGZvcihpIGluIG9iaikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSB2YWx1ZXMucHVzaChvYmpbaV0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2NvbnRhaW4ob2JqLCB2YWx1ZSkge1xuICAgIGlmKHR5cGVvZiBvYmouaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIG9iai5pbmRleE9mKHZhbHVlKSAhPT0gLTE7XG4gICAgdmFyIGk7XG4gICAgZm9yKGkgaW4gb2JqKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGlmIChvYmpbaV0gPT09IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2xlbihvYmopIHtcbiAgICBpZih0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ3VuZGVmaW5lZCcpIHJldHVybiBvYmoubGVuZ3RoO1xuICAgIHZhciBpLCBsZW5ndGggPSAwO1xuICAgIGZvcihpIGluIG9iaikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBsZW5ndGgrKztcbiAgICByZXR1cm4gbGVuZ3RoO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9wdXNoKGFyciwgdmFsdWUpIHtcbiAgICBhcnIucHVzaCh2YWx1ZSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGZ1bmN0aW9uIGFycl91bnNoaWZ0KGFyciwgdmFsdWUpIHtcbiAgICBhcnIudW5zaGlmdCh2YWx1ZSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9yYW5kKGFyciwgdmFsdWUpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFycik7XG4gICAgcmV0dXJuIGFycltrZXlzW3BhcnNlSW50KE1hdGgucmFuZG9tKCkgKiBhcnJfbGVuKGFycikgLSAxKV1dO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9zcGxpY2UoYXJyLCBzdCwgZW4sIGVscykge1xuICAgIHZhciBwcm1zID0gW3N0XTtcbiAgICBpZiAodHlwZW9mIGVuICE9PSAndW5kZWZpbmVkJykgcHJtcy5wdXNoKGVuKTtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShhcnIsIHBybXMuY29uY2F0KGVscykpO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9wYWQoc3JjLCBsZW4sIGVsKSB7XG4gICAgdmFyIGksIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBpZihsZW4gPiAwKSBmb3IoaSA9IGFycl9sZW4oYXJyKTtpIDwgbGVuO2krKykgYXJyLnB1c2goZWwpO1xuICAgIGlmKGxlbiA8IDApIGZvcihpID0gYXJyX2xlbihhcnIpO2kgPCAtbGVuO2krKykgYXJyLnVuc2hpZnQoZWwpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3JldmVyc2Uoc3JjKSB7XG4gICAgdmFyIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBhcnIucmV2ZXJzZSgpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3NvcnQoc3JjKSB7XG4gICAgdmFyIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBhcnIuc29ydCgpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3NvcnRfcmV2ZXJzZShzcmMpIHtcbiAgICB2YXIgYXJyID0gc3JjLnNsaWNlKDApO1xuICAgIGFyci5zb3J0KCk7XG4gICAgYXJyLnJldmVyc2UoKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG4gIGZ1bmN0aW9uIGFycl91bmlxdWUoc3JjKSB7XG4gICAgdmFyIGksIGFyciA9IFtdO1xuICAgIGZvcihpIGluIHNyYykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzcmMsIGkpKSBpZiAoIX5hcnIuaW5kZXhPZihzcmNbaV0pKSBhcnIucHVzaChzcmNbaV0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2tleShhcnIsIHZhbHVlKSB7XG4gICAgdmFyIGk7XG4gICAgZm9yKGkgaW4gYXJyKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFyciwgaSkpIGlmICh2YWx1ZSA9PSBhcnJbaV0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGUobmFtZSwgYXR0cnMsIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0JykgcmV0dXJuIG5hbWU7XG4gICAgdmFyIGNoaWxkcyA9IFtdO1xuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIGNiKGNoaWxkcyk7XG4gICAgaWYgKGF0dHJzKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnbm9kZScsXG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIGF0dHJzOiBhdHRycyxcbiAgICAgICAgY2hpbGRzOiBjaGlsZHMuZmlsdGVyKGZ1bmN0aW9uIChfY2hpbGQpIHsgcmV0dXJuIF9jaGlsZCAhPT0gbnVsbDsgfSlcbiAgICAgIH07XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbmFtZS50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykgbmFtZSA9IG5hbWUudG9TdHJpbmcoKTtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgdGV4dDogbmFtZVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhLCBjaGlsZHMpIHtcbiAgICB2YXIgX2NoaWxkcyA9IFtdO1xudmFyIGluZGV4LCB0eXBlO1xudmFyIF9hcnIwID0gZGF0YVsnZmllbGRzJ107XG5mb3IgKGRhdGFbJ2luZGV4J10gaW4gX2FycjApIHtcbmRhdGFbJ2ZpZWxkJ10gPSBfYXJyMFtkYXRhWydpbmRleCddXTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTtcbnZhciBfcGFyYW1zMSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyID0gJyc7XG5fYXR0clZhbHVlMiArPSAnZm9ybS10YWJsZV9fcm93Jztcbl9wYXJhbXMxWydjbGFzcyddID0gX2F0dHJWYWx1ZTI7XG5fYXR0clZhbHVlMiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMyA9ICcnO1xuX2F0dHJWYWx1ZTMgKz0gJ3Jvdy1tb2R1bGUtZmllbGRzJztcbl9wYXJhbXMxWydyb2xlJ10gPSBfYXR0clZhbHVlMztcbl9hdHRyVmFsdWUzID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0ID0gJyc7XG5fYXR0clZhbHVlNCArPSBkYXRhWydpbmRleCddO1xuX3BhcmFtczFbJ2RhdGEta2V5J10gPSBfYXR0clZhbHVlNDtcbl9hdHRyVmFsdWU0ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgndHInLCBfcGFyYW1zMSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xudmFyIF9wYXJhbXM1ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTYgPSAnJztcbl9hdHRyVmFsdWU2ICs9ICdmb3JtLXRhYmxlX19jZWxsJztcbl9wYXJhbXM1WydjbGFzcyddID0gX2F0dHJWYWx1ZTY7XG5fYXR0clZhbHVlNiA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgX3BhcmFtczUsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG52YXIgX3BhcmFtczcgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlOCA9ICcnO1xuX2F0dHJWYWx1ZTggKz0gJ3RleHQnO1xuX3BhcmFtczdbJ3R5cGUnXSA9IF9hdHRyVmFsdWU4O1xuX2F0dHJWYWx1ZTggPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTkgPSAnJztcbl9hdHRyVmFsdWU5ICs9ICdmb3JtX19pbnAnO1xuX3BhcmFtczdbJ2NsYXNzJ10gPSBfYXR0clZhbHVlOTtcbl9hdHRyVmFsdWU5ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMCA9ICcnO1xuX2F0dHJWYWx1ZTEwICs9IGRhdGFbJ2ZpZWxkJ11bXCJ0aXRsZVwiXTtcbl9wYXJhbXM3Wyd2YWx1ZSddID0gX2F0dHJWYWx1ZTEwO1xuX2F0dHJWYWx1ZTEwID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMSA9ICcnO1xuX2F0dHJWYWx1ZTExICs9ICdmaWVsZC10aXRsZSc7XG5fcGFyYW1zN1sncm9sZSddID0gX2F0dHJWYWx1ZTExO1xuX2F0dHJWYWx1ZTExID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBfcGFyYW1zNykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG52YXIgX3BhcmFtczEyID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEzID0gJyc7XG5fYXR0clZhbHVlMTMgKz0gJ2Zvcm0tdGFibGVfX2NlbGwnO1xuX3BhcmFtczEyWydjbGFzcyddID0gX2F0dHJWYWx1ZTEzO1xuX2F0dHJWYWx1ZTEzID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBfcGFyYW1zMTIsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG52YXIgX3BhcmFtczE0ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE1ID0gJyc7XG5fYXR0clZhbHVlMTUgKz0gJ3RleHQnO1xuX3BhcmFtczE0Wyd0eXBlJ10gPSBfYXR0clZhbHVlMTU7XG5fYXR0clZhbHVlMTUgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE2ID0gJyc7XG5fYXR0clZhbHVlMTYgKz0gJ2Zvcm1fX2lucCc7XG5fcGFyYW1zMTRbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTY7XG5fYXR0clZhbHVlMTYgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE3ID0gJyc7XG5fYXR0clZhbHVlMTcgKz0gZGF0YVsnZmllbGQnXVtcImFsaWFzXCJdO1xuX3BhcmFtczE0Wyd2YWx1ZSddID0gX2F0dHJWYWx1ZTE3O1xuX2F0dHJWYWx1ZTE3ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxOCA9ICcnO1xuX2F0dHJWYWx1ZTE4ICs9ICdmaWVsZC1hbGlhcyc7XG5fcGFyYW1zMTRbJ3JvbGUnXSA9IF9hdHRyVmFsdWUxODtcbl9hdHRyVmFsdWUxOCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgX3BhcmFtczE0KSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zMTkgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjAgPSAnJztcbl9hdHRyVmFsdWUyMCArPSAnZm9ybS10YWJsZV9fY2VsbCc7XG5fcGFyYW1zMTlbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMjA7XG5fYXR0clZhbHVlMjAgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIF9wYXJhbXMxOSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczIxID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTIyID0gJyc7XG5fYXR0clZhbHVlMjIgKz0gJ2Zvcm1fX3NlbGVjdCc7XG5fcGFyYW1zMjFbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMjI7XG5fYXR0clZhbHVlMjIgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXMyMSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbnZhciBfcGFyYW1zMjMgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjQgPSAnJztcbl9hdHRyVmFsdWUyNCArPSAnZm9ybV9fc2VsZWN0Jztcbl9wYXJhbXMyM1snY2xhc3MnXSA9IF9hdHRyVmFsdWUyNDtcbl9hdHRyVmFsdWUyNCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjUgPSAnJztcbl9hdHRyVmFsdWUyNSArPSAnZmllbGQtdHlwZSc7XG5fcGFyYW1zMjNbJ3JvbGUnXSA9IF9hdHRyVmFsdWUyNTtcbl9hdHRyVmFsdWUyNSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ3NlbGVjdCcsIF9wYXJhbXMyMywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG5kYXRhWydoYXNTZXR0aW5ncyddID0gZmFsc2U7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9hcnIyNiA9IGRhdGFbJ3R5cGVzJ107XG5mb3IgKGRhdGFbJ3R5cGUnXSBpbiBfYXJyMjYpIHtcbmRhdGFbJ3R5cGUnXSA9IF9hcnIyNltkYXRhWyd0eXBlJ11dO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczI3ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTI4ID0gJyc7XG5fYXR0clZhbHVlMjggKz0gZGF0YVsndHlwZSddW1widHlwZVwiXTtcbl9wYXJhbXMyN1sndmFsdWUnXSA9IF9hdHRyVmFsdWUyODtcbl9hdHRyVmFsdWUyOCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjkgPSAnJztcbmlmIChkYXRhWydmaWVsZCddW1widHlwZVwiXSA9PSBkYXRhWyd0eXBlJ11bXCJ0eXBlXCJdKSB7XG5fcGFyYW1zMjdbJ3NlbGVjdGVkJ10gPSBfYXR0clZhbHVlMjk7XG5fYXR0clZhbHVlMjkgPSAnJztcbn1cbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdvcHRpb24nLCBfcGFyYW1zMjcsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKGRhdGFbJ3R5cGUnXVtcIm5hbWVcIl0pKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbmlmIChkYXRhWydmaWVsZCddW1widHlwZVwiXSA9PSBkYXRhWyd0eXBlJ11bXCJ0eXBlXCJdKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbmlmIChkYXRhWyd0eXBlJ11bXCJoYXNTZXR0aW5nc1wiXSkge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICcpKTtcbmRhdGFbJ2hhc1NldHRpbmdzJ10gPSB0cnVlO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufVxuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG52YXIgX3BhcmFtczMwID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTMxID0gJyc7XG5fYXR0clZhbHVlMzEgKz0gJ2Zvcm0tdGFibGVfX2NlbGwnO1xuX3BhcmFtczMwWydjbGFzcyddID0gX2F0dHJWYWx1ZTMxO1xuX2F0dHJWYWx1ZTMxID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBfcGFyYW1zMzAsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xuaWYgKGRhdGFbJ2hhc1NldHRpbmdzJ10pIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczMyID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTMzID0gJyc7XG5fYXR0clZhbHVlMzMgKz0gJ2Zvcm1fX2J0bic7XG5fcGFyYW1zMzJbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMzM7XG5fYXR0clZhbHVlMzMgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTM0ID0gJyc7XG5fYXR0clZhbHVlMzQgKz0gJ2J1dHRvbic7XG5fcGFyYW1zMzJbJ3R5cGUnXSA9IF9hdHRyVmFsdWUzNDtcbl9hdHRyVmFsdWUzNCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzUgPSAnJztcbl9hdHRyVmFsdWUzNSArPSAnYnRuLWNvbmZpZy1maWVsZCc7XG5fcGFyYW1zMzJbJ3JvbGUnXSA9IF9hdHRyVmFsdWUzNTtcbl9hdHRyVmFsdWUzNSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIF9wYXJhbXMzMiwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9CdJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbn1cbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG52YXIgX3BhcmFtczM2ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTM3ID0gJyc7XG5fYXR0clZhbHVlMzcgKz0gJ2Zvcm0tdGFibGVfX2NlbGwnO1xuX3BhcmFtczM2WydjbGFzcyddID0gX2F0dHJWYWx1ZTM3O1xuX2F0dHJWYWx1ZTM3ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBfcGFyYW1zMzYsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xuaWYgKGFycl9sZW4oZGF0YVsnZmllbGRzJ10pID4gMSkge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zMzggPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzkgPSAnJztcbl9hdHRyVmFsdWUzOSArPSAnZm9ybV9fYnRuJztcbl9wYXJhbXMzOFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUzOTtcbl9hdHRyVmFsdWUzOSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDAgPSAnJztcbl9hdHRyVmFsdWU0MCArPSAnYnV0dG9uJztcbl9wYXJhbXMzOFsndHlwZSddID0gX2F0dHJWYWx1ZTQwO1xuX2F0dHJWYWx1ZTQwID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0MSA9ICcnO1xuX2F0dHJWYWx1ZTQxICs9ICdidG4tcmVtb3ZlLWZpZWxkJztcbl9wYXJhbXMzOFsncm9sZSddID0gX2F0dHJWYWx1ZTQxO1xuX2F0dHJWYWx1ZTQxID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgX3BhcmFtczM4LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnWCcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xudmFyIF9wYXJhbXM0MiA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0MyA9ICcnO1xuX2F0dHJWYWx1ZTQzICs9ICdmb3JtLXRhYmxlX19jZWxsJztcbl9wYXJhbXM0MlsnY2xhc3MnXSA9IF9hdHRyVmFsdWU0Mztcbl9hdHRyVmFsdWU0MyA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgX3BhcmFtczQyLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zNDQgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDUgPSAnJztcbl9hdHRyVmFsdWU0NSArPSAnZm9ybS10YWJsZV9fbW92ZSc7XG5fcGFyYW1zNDRbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNDU7XG5fYXR0clZhbHVlNDUgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ2ID0gJyc7XG5fYXR0clZhbHVlNDYgKz0gJ2J0bi1tb3ZlLXJvdyc7XG5fcGFyYW1zNDRbJ3JvbGUnXSA9IF9hdHRyVmFsdWU0Njtcbl9hdHRyVmFsdWU0NiA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ3NwYW4nLCBfcGFyYW1zNDQsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTtcbn0gICAgcmV0dXJuIF9jaGlsZHM7XG4gIH07XG59KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkoKSk7XG4gIH1cbn0pKGZ1bmN0aW9uICgpIHtcbiAgdmFyIE1LQVJSX09QRU4gPSAyIDw8IDE7XG4gIHZhciBNS0FSUl9DTE9TRSA9IDEgPDwgMTtcbiAgZnVuY3Rpb24gbWtBcnIoc3RhcnQsIGVuZCwgZmxhZykge1xuICAgIHZhciBhcnIgPSBbXSwgaTtcbiAgICBpZiAoZmxhZyAmIE1LQVJSX09QRU4pIHtcbiAgICAgIGlmIChzdGFydCA8PSBlbmQpIHtcbiAgICAgICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA+IGVuZDsgaS0tKSB7XG4gICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZsYWcgJiBNS0FSUl9DTE9TRSkge1xuICAgICAgaWYgKHN0YXJ0IDw9IGVuZCkge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA+PSBlbmQ7IGktLSkge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gc3RyKHN0ciwgbGVuLCBzcHJ0cikge1xuICAgIGlmICghbGVuKSBsZW4gPSAwO1xuICAgIGlmICh0eXBlb2Ygc3RyLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSBzdHIgPSBzdHIudG9TdHJpbmcoKTtcbiAgICBpZiAoIXNwcnRyKSBzcHJ0ciA9ICcuJztcbiAgICBpZiAofnN0ci5pbmRleE9mKCcuJykpIHtcbiAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgc3RyLmluZGV4T2YoJy4nKSArIGxlbiArIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCBzdHIuaW5kZXhPZignLicpICsgbGVuKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gc3RyX3BhZChzdHIgKyAnLicsIHN0ci5sZW5ndGggKyAxICsgbGVuLCAnMCcpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoJy4nLCBzcHJ0cik7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX3JlcGxhY2Uoc3RyLCBzcmMsIHJlcCkge1xuICAgIHdoaWxlICh+c3RyLmluZGV4T2Yoc3JjKSkge1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2Uoc3JjLCByZXApO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG4gIHZhciBTVFJQQURSSUdIVCA9IDEgPDwgMTtcbiAgdmFyIFNUUlBBRExFRlQgPSAyIDw8IDE7XG4gIHZhciBTVFJQQURCT1RIID0gNCA8PCAxO1xuICBmdW5jdGlvbiBfX3N0cl9wYWRfcmVwZWF0ZXIoc3RyLCBsZW4pIHtcbiAgICB2YXIgY29sbGVjdCA9ICcnLCBpO1xuICAgIHdoaWxlKGNvbGxlY3QubGVuZ3RoIDwgbGVuKSBjb2xsZWN0ICs9IHN0cjtcbiAgICBjb2xsZWN0ID0gY29sbGVjdC5zdWJzdHIoMCwgbGVuKTtcbiAgICByZXR1cm4gY29sbGVjdDtcbiAgfVxuICBmdW5jdGlvbiBzdHJfcGFkKHN0ciwgbGVuLCBzdWIsIHR5cGUpIHtcbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICd1bmRlZmluZWQnKSB0eXBlID0gU1RSUEFEUklHSFQ7XG4gICAgdmFyIGhhbGYgPSAnJywgcGFkX3RvX2dvO1xuICAgIGlmICgocGFkX3RvX2dvID0gbGVuIC0gc3RyLmxlbmd0aCkgPiAwKSB7XG4gICAgICBpZiAodHlwZSAmIFNUUlBBRExFRlQpIHsgc3RyID0gX19zdHJfcGFkX3JlcGVhdGVyKHN1YiwgcGFkX3RvX2dvKSArIHN0cjsgfVxuICAgICAgZWxzZSBpZiAodHlwZSAmIFNUUlBBRFJJR0hUKSB7c3RyID0gc3RyICsgX19zdHJfcGFkX3JlcGVhdGVyKHN1YiwgcGFkX3RvX2dvKTsgfVxuICAgICAgZWxzZSBpZiAodHlwZSAmIFNUUlBBREJPVEgpIHtcbiAgICAgICAgaGFsZiA9IF9fc3RyX3BhZF9yZXBlYXRlcihzdWIsIE1hdGguY2VpbChwYWRfdG9fZ28vMikpO1xuICAgICAgICBzdHIgPSBoYWxmICsgc3RyICsgaGFsZjtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCBsZW4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9odG1sZXNjYXBlKGh0bWwpIHtcbiAgICByZXR1cm4gaHRtbC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcbiAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcbiAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcbiAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIik7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX3VwZmlyc3Qoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgvW1xcc1xcblxcdF0rLykubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5zdWJzdHIoMCwgMSkudG9VcHBlckNhc2UoKSArIGl0ZW0uc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgfSkuam9pbignICcpO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9jYW1lbChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnNwbGl0KC9bXFxzXFxuXFx0XSsvKS5tYXAoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICBpZiAoIWluZGV4KSByZXR1cm4gaXRlbTtcbiAgICAgIHJldHVybiBpdGVtLnN1YnN0cigwLCAxKS50b1VwcGVyQ2FzZSgpICsgaXRlbS5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9KS5qb2luKCcnKTtcbiAgfVxuICBmdW5jdGlvbiBzdHJfa2ViYWIoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgvW1xcc1xcblxcdF0rLykuam9pbignLScpO1xuICB9XG4gIGZ1bmN0aW9uIGFycl92YWx1ZXMob2JqKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdLCBpO1xuICAgIGZvcihpIGluIG9iaikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSB2YWx1ZXMucHVzaChvYmpbaV0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2NvbnRhaW4ob2JqLCB2YWx1ZSkge1xuICAgIGlmKHR5cGVvZiBvYmouaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIG9iai5pbmRleE9mKHZhbHVlKSAhPT0gLTE7XG4gICAgdmFyIGk7XG4gICAgZm9yKGkgaW4gb2JqKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGlmIChvYmpbaV0gPT09IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2xlbihvYmopIHtcbiAgICBpZih0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ3VuZGVmaW5lZCcpIHJldHVybiBvYmoubGVuZ3RoO1xuICAgIHZhciBpLCBsZW5ndGggPSAwO1xuICAgIGZvcihpIGluIG9iaikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBsZW5ndGgrKztcbiAgICByZXR1cm4gbGVuZ3RoO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9wdXNoKGFyciwgdmFsdWUpIHtcbiAgICBhcnIucHVzaCh2YWx1ZSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGZ1bmN0aW9uIGFycl91bnNoaWZ0KGFyciwgdmFsdWUpIHtcbiAgICBhcnIudW5zaGlmdCh2YWx1ZSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9yYW5kKGFyciwgdmFsdWUpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFycik7XG4gICAgcmV0dXJuIGFycltrZXlzW3BhcnNlSW50KE1hdGgucmFuZG9tKCkgKiBhcnJfbGVuKGFycikgLSAxKV1dO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9zcGxpY2UoYXJyLCBzdCwgZW4sIGVscykge1xuICAgIHZhciBwcm1zID0gW3N0XTtcbiAgICBpZiAodHlwZW9mIGVuICE9PSAndW5kZWZpbmVkJykgcHJtcy5wdXNoKGVuKTtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShhcnIsIHBybXMuY29uY2F0KGVscykpO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9wYWQoc3JjLCBsZW4sIGVsKSB7XG4gICAgdmFyIGksIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBpZihsZW4gPiAwKSBmb3IoaSA9IGFycl9sZW4oYXJyKTtpIDwgbGVuO2krKykgYXJyLnB1c2goZWwpO1xuICAgIGlmKGxlbiA8IDApIGZvcihpID0gYXJyX2xlbihhcnIpO2kgPCAtbGVuO2krKykgYXJyLnVuc2hpZnQoZWwpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3JldmVyc2Uoc3JjKSB7XG4gICAgdmFyIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBhcnIucmV2ZXJzZSgpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3NvcnQoc3JjKSB7XG4gICAgdmFyIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBhcnIuc29ydCgpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3NvcnRfcmV2ZXJzZShzcmMpIHtcbiAgICB2YXIgYXJyID0gc3JjLnNsaWNlKDApO1xuICAgIGFyci5zb3J0KCk7XG4gICAgYXJyLnJldmVyc2UoKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG4gIGZ1bmN0aW9uIGFycl91bmlxdWUoc3JjKSB7XG4gICAgdmFyIGksIGFyciA9IFtdO1xuICAgIGZvcihpIGluIHNyYykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzcmMsIGkpKSBpZiAoIX5hcnIuaW5kZXhPZihzcmNbaV0pKSBhcnIucHVzaChzcmNbaV0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2tleShhcnIsIHZhbHVlKSB7XG4gICAgdmFyIGk7XG4gICAgZm9yKGkgaW4gYXJyKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFyciwgaSkpIGlmICh2YWx1ZSA9PSBhcnJbaV0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGUobmFtZSwgYXR0cnMsIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0JykgcmV0dXJuIG5hbWU7XG4gICAgdmFyIGNoaWxkcyA9IFtdO1xuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIGNiKGNoaWxkcyk7XG4gICAgaWYgKGF0dHJzKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnbm9kZScsXG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIGF0dHJzOiBhdHRycyxcbiAgICAgICAgY2hpbGRzOiBjaGlsZHMuZmlsdGVyKGZ1bmN0aW9uIChfY2hpbGQpIHsgcmV0dXJuIF9jaGlsZCAhPT0gbnVsbDsgfSlcbiAgICAgIH07XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbmFtZS50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykgbmFtZSA9IG5hbWUudG9TdHJpbmcoKTtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgdGV4dDogbmFtZVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhLCBjaGlsZHMpIHtcbiAgICB2YXIgX2NoaWxkcyA9IFtdO1xudmFyIGk7XG52YXIgX3BhcmFtczAgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMSA9ICcnO1xuX2F0dHJWYWx1ZTEgKz0gJ3BvcHVwX19oZWFkJztcbl9wYXJhbXMwWydjbGFzcyddID0gX2F0dHJWYWx1ZTE7XG5fYXR0clZhbHVlMSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMwLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0J3QsNGB0YLRgNC+0LnQutC4INGE0LvQsNC20LrQvtCyJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuJykpO1xudmFyIF9wYXJhbXMyID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTMgPSAnJztcbl9wYXJhbXMyWydhY3Rpb24nXSA9IF9hdHRyVmFsdWUzO1xuX2F0dHJWYWx1ZTMgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQgPSAnJztcbl9hdHRyVmFsdWU0ICs9ICdmb3JtJztcbl9wYXJhbXMyWydjbGFzcyddID0gX2F0dHJWYWx1ZTQ7XG5fYXR0clZhbHVlNCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNSA9ICcnO1xuX2F0dHJWYWx1ZTUgKz0gJ2NvbmZpZ3MtZm9ybSc7XG5fcGFyYW1zMlsncm9sZSddID0gX2F0dHJWYWx1ZTU7XG5fYXR0clZhbHVlNSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2Zvcm0nLCBfcGFyYW1zMiwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xudmFyIF9wYXJhbXM2ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTcgPSAnJztcbl9hdHRyVmFsdWU3ICs9ICdmb3JtX19pdGVtJztcbl9wYXJhbXM2WydjbGFzcyddID0gX2F0dHJWYWx1ZTc7XG5fYXR0clZhbHVlNyA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM2LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zOCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU5ID0gJyc7XG5fYXR0clZhbHVlOSArPSAnY29uZmlncy1jaGVja2JveC1udW0tb3B0aW9ucyc7XG5fcGFyYW1zOFsnZm9yJ10gPSBfYXR0clZhbHVlOTtcbl9hdHRyVmFsdWU5ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMCA9ICcnO1xuX2F0dHJWYWx1ZTEwICs9ICdmb3JtX19sYWJlbCc7XG5fcGFyYW1zOFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxMDtcbl9hdHRyVmFsdWUxMCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgX3BhcmFtczgsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQmtC+0LvQuNGH0LXRgdGC0LLQviDQstCw0YDQuNCw0L3RgtC+0LIg0L7RgtCy0LXRgtCwJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zMTEgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTIgPSAnJztcbl9hdHRyVmFsdWUxMiArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuX3BhcmFtczExWydjbGFzcyddID0gX2F0dHJWYWx1ZTEyO1xuX2F0dHJWYWx1ZTEyID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczExLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXMxMyA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNCA9ICcnO1xuX2F0dHJWYWx1ZTE0ICs9ICd0ZXh0Jztcbl9wYXJhbXMxM1sndHlwZSddID0gX2F0dHJWYWx1ZTE0O1xuX2F0dHJWYWx1ZTE0ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNSA9ICcnO1xuX2F0dHJWYWx1ZTE1ICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS12ZXJ5LXNob3J0Jztcbl9wYXJhbXMxM1snY2xhc3MnXSA9IF9hdHRyVmFsdWUxNTtcbl9hdHRyVmFsdWUxNSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTYgPSAnJztcbl9hdHRyVmFsdWUxNiArPSBkYXRhWydudW1PcHRpb25zJ107XG5fcGFyYW1zMTNbJ3ZhbHVlJ10gPSBfYXR0clZhbHVlMTY7XG5fYXR0clZhbHVlMTYgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE3ID0gJyc7XG5fYXR0clZhbHVlMTcgKz0gJ2NvbmZpZ3MtY2hlY2tib3gtbnVtLW9wdGlvbnMnO1xuX3BhcmFtczEzWydyb2xlJ10gPSBfYXR0clZhbHVlMTc7XG5fYXR0clZhbHVlMTcgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE4ID0gJyc7XG5fYXR0clZhbHVlMTggKz0gJ2NvbmZpZ3MtY2hlY2tib3gtbnVtLW9wdGlvbnMnO1xuX3BhcmFtczEzWydpZCddID0gX2F0dHJWYWx1ZTE4O1xuX2F0dHJWYWx1ZTE4ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBfcGFyYW1zMTMpKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xudmFyIF9wYXJhbXMxOSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyMCA9ICcnO1xuX2F0dHJWYWx1ZTIwICs9ICdmb3JtX19pdGVtJztcbl9wYXJhbXMxOVsnY2xhc3MnXSA9IF9hdHRyVmFsdWUyMDtcbl9hdHRyVmFsdWUyMCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMxOSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczIxID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTIyID0gJyc7XG5fYXR0clZhbHVlMjIgKz0gJ2Zvcm1fX2xhYmVsJztcbl9wYXJhbXMyMVsnY2xhc3MnXSA9IF9hdHRyVmFsdWUyMjtcbl9hdHRyVmFsdWUyMiA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgX3BhcmFtczIxLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0JLQsNGA0LjQsNC90YLRiyDQvtGC0LLQtdGC0L7QsjonKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXMyMyA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyNCA9ICcnO1xuX2F0dHJWYWx1ZTI0ICs9ICdmb3JtX19pbnAtY29udGFpbiBmb3JtX19pbnAtY29udGFpbi0tZnVsbC13aWR0aCc7XG5fcGFyYW1zMjNbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMjQ7XG5fYXR0clZhbHVlMjQgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMjMsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczI1ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTI2ID0gJyc7XG5fYXR0clZhbHVlMjYgKz0gJ2NvbmZpZ3MtY2hlY2tib3gtb3B0aW9ucy1jb250YWluJztcbl9wYXJhbXMyNVsncm9sZSddID0gX2F0dHJWYWx1ZTI2O1xuX2F0dHJWYWx1ZTI2ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczI1LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX2FycjI3ID0gZGF0YVsnZGVmYXVsdERhdGEnXTtcbmZvciAoZGF0YVsnaSddIGluIF9hcnIyNykge1xuZGF0YVsnb3B0aW9uJ10gPSBfYXJyMjdbZGF0YVsnaSddXTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXMyOCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyOSA9ICcnO1xuX2F0dHJWYWx1ZTI5ICs9ICdmb3JtX19yb3ctb3B0aW9uJztcbl9wYXJhbXMyOFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUyOTtcbl9hdHRyVmFsdWUyOSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMyOCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG52YXIgX3BhcmFtczMwID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTMxID0gJyc7XG5fYXR0clZhbHVlMzEgKz0gJ2NoZWNrYm94Jztcbl9wYXJhbXMzMFsndHlwZSddID0gX2F0dHJWYWx1ZTMxO1xuX2F0dHJWYWx1ZTMxID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzMiA9ICcnO1xuX2F0dHJWYWx1ZTMyICs9ICdmb3JtX19jaGVja2JveCc7XG5fcGFyYW1zMzBbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMzI7XG5fYXR0clZhbHVlMzIgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTMzID0gJyc7XG5fYXR0clZhbHVlMzMgKz0gJ2NvbmZpZ3MtY2hlY2tib3gtb3B0aW9uJztcbl9wYXJhbXMzMFsncm9sZSddID0gX2F0dHJWYWx1ZTMzO1xuX2F0dHJWYWx1ZTMzID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzNCA9ICcnO1xuX2F0dHJWYWx1ZTM0ICs9IGRhdGFbJ2knXTtcbl9wYXJhbXMzMFsndmFsdWUnXSA9IF9hdHRyVmFsdWUzNDtcbl9hdHRyVmFsdWUzNCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzUgPSAnJztcbl9hdHRyVmFsdWUzNSArPSBkYXRhWydpJ107XG5fcGFyYW1zMzBbJ2RhdGEtaW5kZXgnXSA9IF9hdHRyVmFsdWUzNTtcbl9hdHRyVmFsdWUzNSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzYgPSAnJztcbl9hdHRyVmFsdWUzNiArPSAnY29uZmlncy1jaGVja2JveC1vcHRpb24tJztcbl9hdHRyVmFsdWUzNiArPSBkYXRhWydpJ107XG5fcGFyYW1zMzBbJ2lkJ10gPSBfYXR0clZhbHVlMzY7XG5fYXR0clZhbHVlMzYgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTM3ID0gJyc7XG5fYXR0clZhbHVlMzcgKz0gJ2NvbmZpZ3MtY2hlY2tib3gtb3B0aW9uJztcbl9wYXJhbXMzMFsnbmFtZSddID0gX2F0dHJWYWx1ZTM3O1xuX2F0dHJWYWx1ZTM3ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzOCA9ICcnO1xuaWYgKGRhdGFbJ29wdGlvbiddW1wiY2hlY2tlZFwiXSA9PSB0cnVlIHx8IGRhdGFbJ29wdGlvbiddW1wiY2hlY2tlZFwiXSA9PSBcInRydWVcIikge1xuX3BhcmFtczMwWydjaGVja2VkJ10gPSBfYXR0clZhbHVlMzg7XG5fYXR0clZhbHVlMzggPSAnJztcbn1cbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIF9wYXJhbXMzMCkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICcpKTtcbnZhciBfcGFyYW1zMzkgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDAgPSAnJztcbl9hdHRyVmFsdWU0MCArPSAnY29uZmlncy1jaGVja2JveC1vcHRpb24tJztcbl9hdHRyVmFsdWU0MCArPSBkYXRhWydpJ107XG5fcGFyYW1zMzlbJ2ZvciddID0gX2F0dHJWYWx1ZTQwO1xuX2F0dHJWYWx1ZTQwID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0MSA9ICcnO1xuX2F0dHJWYWx1ZTQxICs9ICdmb3JtX19jaGVja2JveC1sYWJlbCc7XG5fcGFyYW1zMzlbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNDE7XG5fYXR0clZhbHVlNDEgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXMzOSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG52YXIgX3BhcmFtczQyID0ge307XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXM0MiwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbnZhciBfcGFyYW1zNDMgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDQgPSAnJztcbl9hdHRyVmFsdWU0NCArPSAndGV4dCc7XG5fcGFyYW1zNDNbJ3R5cGUnXSA9IF9hdHRyVmFsdWU0NDtcbl9hdHRyVmFsdWU0NCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDUgPSAnJztcbl9hdHRyVmFsdWU0NSArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0taGFsZi13aWR0aCc7XG5fcGFyYW1zNDNbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNDU7XG5fYXR0clZhbHVlNDUgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ2ID0gJyc7XG5fYXR0clZhbHVlNDYgKz0gZGF0YVsnb3B0aW9uJ11bXCJsYWJlbFwiXTtcbl9wYXJhbXM0M1sndmFsdWUnXSA9IF9hdHRyVmFsdWU0Njtcbl9hdHRyVmFsdWU0NiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDcgPSAnJztcbl9hdHRyVmFsdWU0NyArPSAnY29uZmlncy1jaGVja2JveC1vcHRpb24tbGFiZWwnO1xuX3BhcmFtczQzWydyb2xlJ10gPSBfYXR0clZhbHVlNDc7XG5fYXR0clZhbHVlNDcgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ4ID0gJyc7XG5fYXR0clZhbHVlNDggKz0gZGF0YVsnaSddO1xuX3BhcmFtczQzWydkYXRhLWluZGV4J10gPSBfYXR0clZhbHVlNDg7XG5fYXR0clZhbHVlNDggPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIF9wYXJhbXM0MykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbn1cbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xudmFyIF9wYXJhbXM0OSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1MCA9ICcnO1xuX2F0dHJWYWx1ZTUwICs9ICdmb3JtX19zdWJtaXQnO1xuX3BhcmFtczQ5WydjbGFzcyddID0gX2F0dHJWYWx1ZTUwO1xuX2F0dHJWYWx1ZTUwID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczQ5LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zNTEgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNTIgPSAnJztcbl9hdHRyVmFsdWU1MiArPSAnZm9ybV9fYnRuIGZvcm1fX2J0bi0tc3VibWl0Jztcbl9wYXJhbXM1MVsnY2xhc3MnXSA9IF9hdHRyVmFsdWU1Mjtcbl9hdHRyVmFsdWU1MiA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIF9wYXJhbXM1MSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Ch0L7RhdGA0LDQvdC40YLRjCcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczUzID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTU0ID0gJyc7XG5fYXR0clZhbHVlNTQgKz0gJ2J1dHRvbic7XG5fcGFyYW1zNTNbJ3R5cGUnXSA9IF9hdHRyVmFsdWU1NDtcbl9hdHRyVmFsdWU1NCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNTUgPSAnJztcbl9hdHRyVmFsdWU1NSArPSAnZm9ybV9fYnRuIHBvcHVwX19jYW5jZWwnO1xuX3BhcmFtczUzWydjbGFzcyddID0gX2F0dHJWYWx1ZTU1O1xuX2F0dHJWYWx1ZTU1ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgX3BhcmFtczUzLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0J7RgtC80LXQvdC40YLRjCcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuJykpOyAgICByZXR1cm4gX2NoaWxkcztcbiAgfTtcbn0pOyIsIihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuICAgIGRlZmluZShbXSwgZmFjdG9yeSgpKTtcbiAgfVxufSkoZnVuY3Rpb24gKCkge1xuICB2YXIgTUtBUlJfT1BFTiA9IDIgPDwgMTtcbiAgdmFyIE1LQVJSX0NMT1NFID0gMSA8PCAxO1xuICBmdW5jdGlvbiBta0FycihzdGFydCwgZW5kLCBmbGFnKSB7XG4gICAgdmFyIGFyciA9IFtdLCBpO1xuICAgIGlmIChmbGFnICYgTUtBUlJfT1BFTikge1xuICAgICAgaWYgKHN0YXJ0IDw9IGVuZCkge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpID4gZW5kOyBpLS0pIHtcbiAgICAgICAgICBhcnIucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmxhZyAmIE1LQVJSX0NMT1NFKSB7XG4gICAgICBpZiAoc3RhcnQgPD0gZW5kKSB7XG4gICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpID49IGVuZDsgaS0tKSB7XG4gICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBzdHIoc3RyLCBsZW4sIHNwcnRyKSB7XG4gICAgaWYgKCFsZW4pIGxlbiA9IDA7XG4gICAgaWYgKHR5cGVvZiBzdHIudG9TdHJpbmcgPT09ICdmdW5jdGlvbicpIHN0ciA9IHN0ci50b1N0cmluZygpO1xuICAgIGlmICghc3BydHIpIHNwcnRyID0gJy4nO1xuICAgIGlmICh+c3RyLmluZGV4T2YoJy4nKSkge1xuICAgICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCBzdHIuaW5kZXhPZignLicpICsgbGVuICsgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsIHN0ci5pbmRleE9mKCcuJykgKyBsZW4pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBzdHJfcGFkKHN0ciArICcuJywgc3RyLmxlbmd0aCArIDEgKyBsZW4sICcwJyk7XG4gICAgfVxuICAgIHJldHVybiBzdHIucmVwbGFjZSgnLicsIHNwcnRyKTtcbiAgfVxuICBmdW5jdGlvbiBzdHJfcmVwbGFjZShzdHIsIHNyYywgcmVwKSB7XG4gICAgd2hpbGUgKH5zdHIuaW5kZXhPZihzcmMpKSB7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZShzcmMsIHJlcCk7XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG4gIH1cbiAgdmFyIFNUUlBBRFJJR0hUID0gMSA8PCAxO1xuICB2YXIgU1RSUEFETEVGVCA9IDIgPDwgMTtcbiAgdmFyIFNUUlBBREJPVEggPSA0IDw8IDE7XG4gIGZ1bmN0aW9uIF9fc3RyX3BhZF9yZXBlYXRlcihzdHIsIGxlbikge1xuICAgIHZhciBjb2xsZWN0ID0gJycsIGk7XG4gICAgd2hpbGUoY29sbGVjdC5sZW5ndGggPCBsZW4pIGNvbGxlY3QgKz0gc3RyO1xuICAgIGNvbGxlY3QgPSBjb2xsZWN0LnN1YnN0cigwLCBsZW4pO1xuICAgIHJldHVybiBjb2xsZWN0O1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9wYWQoc3RyLCBsZW4sIHN1YiwgdHlwZSkge1xuICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHR5cGUgPSBTVFJQQURSSUdIVDtcbiAgICB2YXIgaGFsZiA9ICcnLCBwYWRfdG9fZ287XG4gICAgaWYgKChwYWRfdG9fZ28gPSBsZW4gLSBzdHIubGVuZ3RoKSA+IDApIHtcbiAgICAgIGlmICh0eXBlICYgU1RSUEFETEVGVCkgeyBzdHIgPSBfX3N0cl9wYWRfcmVwZWF0ZXIoc3ViLCBwYWRfdG9fZ28pICsgc3RyOyB9XG4gICAgICBlbHNlIGlmICh0eXBlICYgU1RSUEFEUklHSFQpIHtzdHIgPSBzdHIgKyBfX3N0cl9wYWRfcmVwZWF0ZXIoc3ViLCBwYWRfdG9fZ28pOyB9XG4gICAgICBlbHNlIGlmICh0eXBlICYgU1RSUEFEQk9USCkge1xuICAgICAgICBoYWxmID0gX19zdHJfcGFkX3JlcGVhdGVyKHN1YiwgTWF0aC5jZWlsKHBhZF90b19nby8yKSk7XG4gICAgICAgIHN0ciA9IGhhbGYgKyBzdHIgKyBoYWxmO1xuICAgICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsIGxlbik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX2h0bWxlc2NhcGUoaHRtbCkge1xuICAgIHJldHVybiBodG1sLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxuICAgIC5yZXBsYWNlKC88L2csIFwiJmx0O1wiKVxuICAgIC5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKVxuICAgIC5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKTtcbiAgfVxuICBmdW5jdGlvbiBzdHJfdXBmaXJzdChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnNwbGl0KC9bXFxzXFxuXFx0XSsvKS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLnN1YnN0cigwLCAxKS50b1VwcGVyQ2FzZSgpICsgaXRlbS5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9KS5qb2luKCcgJyk7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX2NhbWVsKHN0cikge1xuICAgIHJldHVybiBzdHIuc3BsaXQoL1tcXHNcXG5cXHRdKy8pLm1hcChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICAgIGlmICghaW5kZXgpIHJldHVybiBpdGVtO1xuICAgICAgcmV0dXJuIGl0ZW0uc3Vic3RyKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBpdGVtLnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICAgIH0pLmpvaW4oJycpO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9rZWJhYihzdHIpIHtcbiAgICByZXR1cm4gc3RyLnNwbGl0KC9bXFxzXFxuXFx0XSsvKS5qb2luKCctJyk7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3ZhbHVlcyhvYmopIHtcbiAgICB2YXIgdmFsdWVzID0gW10sIGk7XG4gICAgZm9yKGkgaW4gb2JqKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIHZhbHVlcy5wdXNoKG9ialtpXSk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuICBmdW5jdGlvbiBhcnJfY29udGFpbihvYmosIHZhbHVlKSB7XG4gICAgaWYodHlwZW9mIG9iai5pbmRleE9mID09PSAnZnVuY3Rpb24nKSByZXR1cm4gb2JqLmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgICB2YXIgaTtcbiAgICBmb3IoaSBpbiBvYmopIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgaWYgKG9ialtpXSA9PT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiBhcnJfbGVuKG9iaikge1xuICAgIGlmKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAndW5kZWZpbmVkJykgcmV0dXJuIG9iai5sZW5ndGg7XG4gICAgdmFyIGksIGxlbmd0aCA9IDA7XG4gICAgZm9yKGkgaW4gb2JqKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGxlbmd0aCsrO1xuICAgIHJldHVybiBsZW5ndGg7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3B1c2goYXJyLCB2YWx1ZSkge1xuICAgIGFyci5wdXNoKHZhbHVlKTtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3Vuc2hpZnQoYXJyLCB2YWx1ZSkge1xuICAgIGFyci51bnNoaWZ0KHZhbHVlKTtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3JhbmQoYXJyLCB2YWx1ZSkge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYXJyKTtcbiAgICByZXR1cm4gYXJyW2tleXNbcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIGFycl9sZW4oYXJyKSAtIDEpXV07XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3NwbGljZShhcnIsIHN0LCBlbiwgZWxzKSB7XG4gICAgdmFyIHBybXMgPSBbc3RdO1xuICAgIGlmICh0eXBlb2YgZW4gIT09ICd1bmRlZmluZWQnKSBwcm1zLnB1c2goZW4pO1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KGFyciwgcHJtcy5jb25jYXQoZWxzKSk7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3BhZChzcmMsIGxlbiwgZWwpIHtcbiAgICB2YXIgaSwgYXJyID0gc3JjLnNsaWNlKDApO1xuICAgIGlmKGxlbiA+IDApIGZvcihpID0gYXJyX2xlbihhcnIpO2kgPCBsZW47aSsrKSBhcnIucHVzaChlbCk7XG4gICAgaWYobGVuIDwgMCkgZm9yKGkgPSBhcnJfbGVuKGFycik7aSA8IC1sZW47aSsrKSBhcnIudW5zaGlmdChlbCk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBhcnJfcmV2ZXJzZShzcmMpIHtcbiAgICB2YXIgYXJyID0gc3JjLnNsaWNlKDApO1xuICAgIGFyci5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBhcnJfc29ydChzcmMpIHtcbiAgICB2YXIgYXJyID0gc3JjLnNsaWNlKDApO1xuICAgIGFyci5zb3J0KCk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBhcnJfc29ydF9yZXZlcnNlKHNyYykge1xuICAgIHZhciBhcnIgPSBzcmMuc2xpY2UoMCk7XG4gICAgYXJyLnNvcnQoKTtcbiAgICBhcnIucmV2ZXJzZSgpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3VuaXF1ZShzcmMpIHtcbiAgICB2YXIgaSwgYXJyID0gW107XG4gICAgZm9yKGkgaW4gc3JjKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNyYywgaSkpIGlmICghfmFyci5pbmRleE9mKHNyY1tpXSkpIGFyci5wdXNoKHNyY1tpXSk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBhcnJfa2V5KGFyciwgdmFsdWUpIHtcbiAgICB2YXIgaTtcbiAgICBmb3IoaSBpbiBhcnIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXJyLCBpKSkgaWYgKHZhbHVlID09IGFycltpXSkgcmV0dXJuIGk7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZShuYW1lLCBhdHRycywgY2IpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSByZXR1cm4gbmFtZTtcbiAgICB2YXIgY2hpbGRzID0gW107XG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykgY2IoY2hpbGRzKTtcbiAgICBpZiAoYXR0cnMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdub2RlJyxcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgYXR0cnM6IGF0dHJzLFxuICAgICAgICBjaGlsZHM6IGNoaWxkcy5maWx0ZXIoZnVuY3Rpb24gKF9jaGlsZCkgeyByZXR1cm4gX2NoaWxkICE9PSBudWxsOyB9KVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBuYW1lLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSBuYW1lID0gbmFtZS50b1N0cmluZygpO1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICB0ZXh0OiBuYW1lXG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKGRhdGEsIGNoaWxkcykge1xuICAgIHZhciBfY2hpbGRzID0gW107XG52YXIgYnVja2V0O1xudmFyIF9wYXJhbXMwID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEgPSAnJztcbl9hdHRyVmFsdWUxICs9ICdwb3B1cF9faGVhZCc7XG5fcGFyYW1zMFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxO1xuX2F0dHJWYWx1ZTEgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Cd0LDRgdGC0YDQvtC50LrQuCDRhNCw0LnQu9CwJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuJykpO1xuZGF0YVsnaXNFbXB0eSddID0gIWRhdGFbJ3MzQWNjZXNzS2V5J10ubGVuZ3RoIHx8ICFkYXRhWydzM1NlY3JldEtleSddLmxlbmd0aDtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTtcbmRhdGFbJ2lzUzNhdXRoJ10gPSAodHlwZW9mIGRhdGFbJ3MzYXV0aCddICE9PSAndW5kZWZpbmVkJyA/IGRhdGFbJ3MzYXV0aCddIDogJycpICYmIChkYXRhWydzM2F1dGgnXSA9PSB0cnVlIHx8IGRhdGFbJ3MzYXV0aCddID09IFwidHJ1ZVwiKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTtcbmRhdGFbJ2lzUzNDaGVja2luZyddID0gKHR5cGVvZiBkYXRhWydzM2NoZWNraW5nJ10gIT09ICd1bmRlZmluZWQnID8gZGF0YVsnczNjaGVja2luZyddIDogJycpICYmIChkYXRhWydzM2NoZWNraW5nJ10gPT0gdHJ1ZSB8fCBkYXRhWydzM2NoZWNraW5nJ10gPT0gXCJ0cnVlXCIpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuJykpO1xudmFyIF9wYXJhbXMyID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTMgPSAnJztcbl9wYXJhbXMyWydhY3Rpb24nXSA9IF9hdHRyVmFsdWUzO1xuX2F0dHJWYWx1ZTMgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQgPSAnJztcbl9hdHRyVmFsdWU0ICs9ICdmb3JtJztcbl9wYXJhbXMyWydjbGFzcyddID0gX2F0dHJWYWx1ZTQ7XG5fYXR0clZhbHVlNCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNSA9ICcnO1xuX2F0dHJWYWx1ZTUgKz0gJ2NvbmZpZ3MtZm9ybSc7XG5fcGFyYW1zMlsncm9sZSddID0gX2F0dHJWYWx1ZTU7XG5fYXR0clZhbHVlNSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2Zvcm0nLCBfcGFyYW1zMiwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xudmFyIF9wYXJhbXM2ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTcgPSAnJztcbl9hdHRyVmFsdWU3ICs9ICdmb3JtX19pdGVtJztcbl9wYXJhbXM2WydjbGFzcyddID0gX2F0dHJWYWx1ZTc7XG5fYXR0clZhbHVlNyA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM2LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zOCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU5ID0gJyc7XG5fYXR0clZhbHVlOSArPSAnZm9ybV9fbGFiZWwnO1xuX3BhcmFtczhbJ2NsYXNzJ10gPSBfYXR0clZhbHVlOTtcbl9hdHRyVmFsdWU5ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBfcGFyYW1zOCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Cl0YDQsNC90LjQu9C40YnQtScpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczEwID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTExID0gJyc7XG5fYXR0clZhbHVlMTEgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbl9wYXJhbXMxMFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxMTtcbl9hdHRyVmFsdWUxMSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMxMCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbnZhciBfcGFyYW1zMTIgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTMgPSAnJztcbl9hdHRyVmFsdWUxMyArPSAndGFicyc7XG5fcGFyYW1zMTJbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTM7XG5fYXR0clZhbHVlMTMgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMTIsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbnZhciBfcGFyYW1zMTQgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTUgPSAnJztcbl9hdHRyVmFsdWUxNSArPSAnYnV0dG9uJztcbl9wYXJhbXMxNFsndHlwZSddID0gX2F0dHJWYWx1ZTE1O1xuX2F0dHJWYWx1ZTE1ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNiA9ICcnO1xuX2F0dHJWYWx1ZTE2ICs9ICd0YWJzX19pdGVtJztcbmlmIChkYXRhWydzdG9yYWdlJ10gPT0gXCJsb2NhbFwiKSB7XG5fYXR0clZhbHVlMTYgKz0gJyB0YWJzX19pdGVtLS1hY3RpdmUnO1xufVxuX3BhcmFtczE0WydjbGFzcyddID0gX2F0dHJWYWx1ZTE2O1xuX2F0dHJWYWx1ZTE2ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNyA9ICcnO1xuX2F0dHJWYWx1ZTE3ICs9ICdjb25maWdzLWZpbGUtc3RvcmFnZSc7XG5fcGFyYW1zMTRbJ3JvbGUnXSA9IF9hdHRyVmFsdWUxNztcbl9hdHRyVmFsdWUxNyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTggPSAnJztcbl9hdHRyVmFsdWUxOCArPSAnbG9jYWwnO1xuX3BhcmFtczE0WydkYXRhLXZhbHVlJ10gPSBfYXR0clZhbHVlMTg7XG5fYXR0clZhbHVlMTggPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBfcGFyYW1zMTQsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQm9C+0LrQsNC70YzQvdC+0LUnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbnZhciBfcGFyYW1zMTkgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjAgPSAnJztcbl9hdHRyVmFsdWUyMCArPSAnYnV0dG9uJztcbl9wYXJhbXMxOVsndHlwZSddID0gX2F0dHJWYWx1ZTIwO1xuX2F0dHJWYWx1ZTIwID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyMSA9ICcnO1xuX2F0dHJWYWx1ZTIxICs9ICd0YWJzX19pdGVtJztcbmlmIChkYXRhWydzdG9yYWdlJ10gPT0gXCJzM1wiKSB7XG5fYXR0clZhbHVlMjEgKz0gJyB0YWJzX19pdGVtLS1hY3RpdmUnO1xufVxuX3BhcmFtczE5WydjbGFzcyddID0gX2F0dHJWYWx1ZTIxO1xuX2F0dHJWYWx1ZTIxID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyMiA9ICcnO1xuX2F0dHJWYWx1ZTIyICs9ICdjb25maWdzLWZpbGUtc3RvcmFnZSc7XG5fcGFyYW1zMTlbJ3JvbGUnXSA9IF9hdHRyVmFsdWUyMjtcbl9hdHRyVmFsdWUyMiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjMgPSAnJztcbl9hdHRyVmFsdWUyMyArPSAnczMnO1xuX3BhcmFtczE5WydkYXRhLXZhbHVlJ10gPSBfYXR0clZhbHVlMjM7XG5fYXR0clZhbHVlMjMgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBfcGFyYW1zMTksIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdTMycpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xudmFyIF9wYXJhbXMyNCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyNSA9ICcnO1xuX2F0dHJWYWx1ZTI1ICs9ICdjb25maWdzLWZpbGUtbW9kYWwtc3RvcmFnZS1sb2NhbCBjb25maWdzLWZpbGUtbW9kYWwtc3RvcmFnZS1mcmFtZSc7XG5fcGFyYW1zMjRbJ3JvbGUnXSA9IF9hdHRyVmFsdWUyNTtcbl9hdHRyVmFsdWUyNSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjYgPSAnJztcbmlmIChkYXRhWydzdG9yYWdlJ10gIT0gXCJsb2NhbFwiKSB7XG5fYXR0clZhbHVlMjYgKz0gJ2Rpc3BsYXk6IG5vbmUnO1xuX3BhcmFtczI0WydzdHlsZSddID0gX2F0dHJWYWx1ZTI2O1xuX2F0dHJWYWx1ZTI2ID0gJyc7XG59XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczI0LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zMjcgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjggPSAnJztcbl9hdHRyVmFsdWUyOCArPSAnZm9ybV9faXRlbSc7XG5fcGFyYW1zMjdbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMjg7XG5fYXR0clZhbHVlMjggPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMjcsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczI5ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTMwID0gJyc7XG5fYXR0clZhbHVlMzAgKz0gJ2NvbmZpZ3MtZmlsZS1wYXRoJztcbl9wYXJhbXMyOVsnZm9yJ10gPSBfYXR0clZhbHVlMzA7XG5fYXR0clZhbHVlMzAgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTMxID0gJyc7XG5fYXR0clZhbHVlMzEgKz0gJ2Zvcm1fX2xhYmVsJztcbl9wYXJhbXMyOVsnY2xhc3MnXSA9IF9hdHRyVmFsdWUzMTtcbl9hdHRyVmFsdWUzMSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgX3BhcmFtczI5LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0J/Rg9GC0YwnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczMyID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTMzID0gJyc7XG5fYXR0clZhbHVlMzMgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbl9wYXJhbXMzMlsnY2xhc3MnXSA9IF9hdHRyVmFsdWUzMztcbl9hdHRyVmFsdWUzMyA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMzMiwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXMzNCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzNSA9ICcnO1xuX2F0dHJWYWx1ZTM1ICs9ICd0ZXh0Jztcbl9wYXJhbXMzNFsndHlwZSddID0gX2F0dHJWYWx1ZTM1O1xuX2F0dHJWYWx1ZTM1ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzNiA9ICcnO1xuX2F0dHJWYWx1ZTM2ICs9ICdmb3JtX19pbnAnO1xuX3BhcmFtczM0WydjbGFzcyddID0gX2F0dHJWYWx1ZTM2O1xuX2F0dHJWYWx1ZTM2ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzNyA9ICcnO1xuX2F0dHJWYWx1ZTM3ICs9IGRhdGFbJ3BhdGgnXTtcbl9wYXJhbXMzNFsndmFsdWUnXSA9IF9hdHRyVmFsdWUzNztcbl9hdHRyVmFsdWUzNyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzggPSAnJztcbl9hdHRyVmFsdWUzOCArPSAnY29uZmlncy1maWxlLXBhdGgnO1xuX3BhcmFtczM0Wydyb2xlJ10gPSBfYXR0clZhbHVlMzg7XG5fYXR0clZhbHVlMzggPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTM5ID0gJyc7XG5fYXR0clZhbHVlMzkgKz0gJ2NvbmZpZ3MtZmlsZS1wYXRoJztcbl9wYXJhbXMzNFsnaWQnXSA9IF9hdHRyVmFsdWUzOTtcbl9hdHRyVmFsdWUzOSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgX3BhcmFtczM0KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbmlmICgodHlwZW9mIGRhdGFbJ3BhdGhFcnJvciddICE9PSAndW5kZWZpbmVkJyA/IGRhdGFbJ3BhdGhFcnJvciddIDogJycpICYmIChkYXRhWydwYXRoRXJyb3InXSkpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXM0MCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0MSA9ICcnO1xuX2F0dHJWYWx1ZTQxICs9ICdmb3JtX19lcnJvcic7XG5fcGFyYW1zNDBbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNDE7XG5fYXR0clZhbHVlNDEgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdzcGFuJywgX3BhcmFtczQwLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZShkYXRhWydwYXRoRXJyb3InXSkpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zNDIgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDMgPSAnJztcbl9hdHRyVmFsdWU0MyArPSAnY29uZmlncy1maWxlLW1vZGFsLXN0b3JhZ2UtczMgY29uZmlncy1maWxlLW1vZGFsLXN0b3JhZ2UtZnJhbWUnO1xuX3BhcmFtczQyWydyb2xlJ10gPSBfYXR0clZhbHVlNDM7XG5fYXR0clZhbHVlNDMgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ0ID0gJyc7XG5pZiAoZGF0YVsnc3RvcmFnZSddICE9IFwiczNcIikge1xuX2F0dHJWYWx1ZTQ0ICs9ICdkaXNwbGF5OiBub25lJztcbl9wYXJhbXM0Mlsnc3R5bGUnXSA9IF9hdHRyVmFsdWU0NDtcbl9hdHRyVmFsdWU0NCA9ICcnO1xufVxufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM0MiwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczQ1ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ2ID0gJyc7XG5fYXR0clZhbHVlNDYgKz0gJ2Zvcm1fX2l0ZW0nO1xuX3BhcmFtczQ1WydjbGFzcyddID0gX2F0dHJWYWx1ZTQ2O1xuX2F0dHJWYWx1ZTQ2ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczQ1LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXM0NyA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0OCA9ICcnO1xuX2F0dHJWYWx1ZTQ4ICs9ICdjb25maWdzLWZpbGUtczMtYWNjZXNzLWtleSc7XG5fcGFyYW1zNDdbJ2ZvciddID0gX2F0dHJWYWx1ZTQ4O1xuX2F0dHJWYWx1ZTQ4ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0OSA9ICcnO1xuX2F0dHJWYWx1ZTQ5ICs9ICdmb3JtX19sYWJlbCc7XG5fcGFyYW1zNDdbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNDk7XG5fYXR0clZhbHVlNDkgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXM0NywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ0FjY2VzcyBrZXknKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczUwID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTUxID0gJyc7XG5fYXR0clZhbHVlNTEgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbl9wYXJhbXM1MFsnY2xhc3MnXSA9IF9hdHRyVmFsdWU1MTtcbl9hdHRyVmFsdWU1MSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM1MCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXM1MiA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1MyA9ICcnO1xuX2F0dHJWYWx1ZTUzICs9ICd0ZXh0Jztcbl9wYXJhbXM1MlsndHlwZSddID0gX2F0dHJWYWx1ZTUzO1xuX2F0dHJWYWx1ZTUzID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1NCA9ICcnO1xuX2F0dHJWYWx1ZTU0ICs9ICdmb3JtX19pbnAnO1xuX3BhcmFtczUyWydjbGFzcyddID0gX2F0dHJWYWx1ZTU0O1xuX2F0dHJWYWx1ZTU0ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1NSA9ICcnO1xuX2F0dHJWYWx1ZTU1ICs9IGRhdGFbJ3MzQWNjZXNzS2V5J107XG5fcGFyYW1zNTJbJ3ZhbHVlJ10gPSBfYXR0clZhbHVlNTU7XG5fYXR0clZhbHVlNTUgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTU2ID0gJyc7XG5fYXR0clZhbHVlNTYgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1hY2Nlc3Mta2V5Jztcbl9wYXJhbXM1Mlsncm9sZSddID0gX2F0dHJWYWx1ZTU2O1xuX2F0dHJWYWx1ZTU2ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1NyA9ICcnO1xuX2F0dHJWYWx1ZTU3ICs9ICdjb25maWdzLWZpbGUtczMtYWNjZXNzLWtleSc7XG5fcGFyYW1zNTJbJ2lkJ10gPSBfYXR0clZhbHVlNTc7XG5fYXR0clZhbHVlNTcgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIF9wYXJhbXM1MikpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczU4ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTU5ID0gJyc7XG5fYXR0clZhbHVlNTkgKz0gJ2Zvcm1fX2l0ZW0nO1xuX3BhcmFtczU4WydjbGFzcyddID0gX2F0dHJWYWx1ZTU5O1xuX2F0dHJWYWx1ZTU5ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczU4LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXM2MCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU2MSA9ICcnO1xuX2F0dHJWYWx1ZTYxICs9ICdjb25maWdzLWZpbGUtczMtc2VjcmV0LWtleSc7XG5fcGFyYW1zNjBbJ2ZvciddID0gX2F0dHJWYWx1ZTYxO1xuX2F0dHJWYWx1ZTYxID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU2MiA9ICcnO1xuX2F0dHJWYWx1ZTYyICs9ICdmb3JtX19sYWJlbCc7XG5fcGFyYW1zNjBbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNjI7XG5fYXR0clZhbHVlNjIgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXM2MCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1NlY3JldCBrZXknKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczYzID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTY0ID0gJyc7XG5fYXR0clZhbHVlNjQgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbl9wYXJhbXM2M1snY2xhc3MnXSA9IF9hdHRyVmFsdWU2NDtcbl9hdHRyVmFsdWU2NCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM2MywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXM2NSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU2NiA9ICcnO1xuX2F0dHJWYWx1ZTY2ICs9ICdwYXNzd29yZCc7XG5fcGFyYW1zNjVbJ3R5cGUnXSA9IF9hdHRyVmFsdWU2Njtcbl9hdHRyVmFsdWU2NiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNjcgPSAnJztcbl9hdHRyVmFsdWU2NyArPSAnZm9ybV9faW5wJztcbl9wYXJhbXM2NVsnY2xhc3MnXSA9IF9hdHRyVmFsdWU2Nztcbl9hdHRyVmFsdWU2NyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNjggPSAnJztcbl9wYXJhbXM2NVsndmFsdWUnXSA9IF9hdHRyVmFsdWU2ODtcbl9hdHRyVmFsdWU2OCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNjkgPSAnJztcbl9hdHRyVmFsdWU2OSArPSAnY29uZmlncy1maWxlLXMzLXNlY3JldC1rZXknO1xuX3BhcmFtczY1Wydyb2xlJ10gPSBfYXR0clZhbHVlNjk7XG5fYXR0clZhbHVlNjkgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTcwID0gJyc7XG5fYXR0clZhbHVlNzAgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1zZWNyZXQta2V5Jztcbl9wYXJhbXM2NVsnaWQnXSA9IF9hdHRyVmFsdWU3MDtcbl9hdHRyVmFsdWU3MCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgX3BhcmFtczY1KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zNzEgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNzIgPSAnJztcbl9hdHRyVmFsdWU3MiArPSAnZm9ybV9faXRlbSc7XG5fcGFyYW1zNzFbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNzI7XG5fYXR0clZhbHVlNzIgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zNzEsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczczID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTc0ID0gJyc7XG5fYXR0clZhbHVlNzQgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbl9wYXJhbXM3M1snY2xhc3MnXSA9IF9hdHRyVmFsdWU3NDtcbl9hdHRyVmFsdWU3NCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM3MywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXM3NSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU3NiA9ICcnO1xuX2F0dHJWYWx1ZTc2ICs9ICdidXR0b24nO1xuX3BhcmFtczc1Wyd0eXBlJ10gPSBfYXR0clZhbHVlNzY7XG5fYXR0clZhbHVlNzYgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTc3ID0gJyc7XG5fYXR0clZhbHVlNzcgKz0gJ2Zvcm1fX2J0bic7XG5fcGFyYW1zNzVbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNzc7XG5fYXR0clZhbHVlNzcgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTc4ID0gJyc7XG5fYXR0clZhbHVlNzggKz0gJ3Rlc3QtY29ubmVjdGlvbi1zMyc7XG5fcGFyYW1zNzVbJ3JvbGUnXSA9IF9hdHRyVmFsdWU3ODtcbl9hdHRyVmFsdWU3OCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNzkgPSAnJztcbmlmIChkYXRhWydpc0VtcHR5J10gfHwgZGF0YVsnaXNTM2F1dGgnXSB8fCBkYXRhWydpc1MzY2hlY2tpbmcnXSkge1xuX3BhcmFtczc1WydkaXNhYmxlZCddID0gX2F0dHJWYWx1ZTc5O1xuX2F0dHJWYWx1ZTc5ID0gJyc7XG59XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgX3BhcmFtczc1LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICcpKTtcbmlmIChkYXRhWydpc1MzY2hlY2tpbmcnXSkge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgINCh0L7QtdC00LjQvdC10L3QuNC1Li4uXFxuICAgICAgICAgICcpKTtcbn0gZWxzZSBpZiAoZGF0YVsnaXNTM2F1dGgnXSkge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgINCT0L7RgtC+0LLQvlxcbiAgICAgICAgICAnKSk7XG59IGVsc2Uge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgINCf0L7QtNC60LvRjtGH0LjRgtGM0YHRj1xcbiAgICAgICAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xuaWYgKGRhdGFbJ2lzUzNhdXRoJ10gPT0gXCJ0cnVlXCIgfHwgZGF0YVsnaXNTM2F1dGgnXSA9PSB0cnVlKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczgwID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTgxID0gJyc7XG5fYXR0clZhbHVlODEgKz0gJ2Zvcm1fX2l0ZW0nO1xuX3BhcmFtczgwWydjbGFzcyddID0gX2F0dHJWYWx1ZTgxO1xuX2F0dHJWYWx1ZTgxID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczgwLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczgyID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTgzID0gJyc7XG5fYXR0clZhbHVlODMgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1idWNrZXQnO1xuX3BhcmFtczgyWydmb3InXSA9IF9hdHRyVmFsdWU4Mztcbl9hdHRyVmFsdWU4MyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlODQgPSAnJztcbl9hdHRyVmFsdWU4NCArPSAnZm9ybV9fbGFiZWwnO1xuX3BhcmFtczgyWydjbGFzcyddID0gX2F0dHJWYWx1ZTg0O1xuX2F0dHJWYWx1ZTg0ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBfcGFyYW1zODIsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdCdWNrZXQnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbnZhciBfcGFyYW1zODUgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlODYgPSAnJztcbl9hdHRyVmFsdWU4NiArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuX3BhcmFtczg1WydjbGFzcyddID0gX2F0dHJWYWx1ZTg2O1xuX2F0dHJWYWx1ZTg2ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczg1LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG5pZiAoKHR5cGVvZiBkYXRhWydidWNrZXRzJ10gIT09ICd1bmRlZmluZWQnID8gZGF0YVsnYnVja2V0cyddIDogJycpICYmIGNvdW50KGRhdGFbJ2J1Y2tldHMnXSkpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG52YXIgX3BhcmFtczg3ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTg4ID0gJyc7XG5fYXR0clZhbHVlODggKz0gJ2Zvcm1fX3NlbGVjdCc7XG5fcGFyYW1zODdbJ2NsYXNzJ10gPSBfYXR0clZhbHVlODg7XG5fYXR0clZhbHVlODggPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXM4NywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAgICcpKTtcbnZhciBfcGFyYW1zODkgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlOTAgPSAnJztcbl9hdHRyVmFsdWU5MCArPSAnY29uZmlncy1maWxlLXMzLWJ1Y2tldCc7XG5fcGFyYW1zODlbJ3JvbGUnXSA9IF9hdHRyVmFsdWU5MDtcbl9hdHRyVmFsdWU5MCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlOTEgPSAnJztcbl9hdHRyVmFsdWU5MSArPSAnY29uZmlncy1maWxlLXMzLWJ1Y2tldCc7XG5fcGFyYW1zODlbJ2lkJ10gPSBfYXR0clZhbHVlOTE7XG5fYXR0clZhbHVlOTEgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdzZWxlY3QnLCBfcGFyYW1zODksIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICAgICAgICcpKTtcbnZhciBfYXJyOTIgPSBkYXRhWydidWNrZXRzJ107XG5mb3IgKGRhdGFbJ2J1Y2tldCddIGluIF9hcnI5Mikge1xuZGF0YVsnYnVja2V0J10gPSBfYXJyOTJbZGF0YVsnYnVja2V0J11dO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICAgICAnKSk7XG52YXIgX3BhcmFtczkzID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTk0ID0gJyc7XG5fYXR0clZhbHVlOTQgKz0gZGF0YVsnYnVja2V0J107XG5fcGFyYW1zOTNbJ3ZhbHVlJ10gPSBfYXR0clZhbHVlOTQ7XG5fYXR0clZhbHVlOTQgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTk1ID0gJyc7XG5pZiAoISEodHlwZW9mIGRhdGFbJ3MzQnVja2V0J10gIT09ICd1bmRlZmluZWQnID8gZGF0YVsnczNCdWNrZXQnXSA6ICcnKSAmJiAoZGF0YVsnczNCdWNrZXQnXSA9PSBkYXRhWydidWNrZXQnXSkpIHtcbl9wYXJhbXM5M1snc2VsZWN0ZWQnXSA9IF9hdHRyVmFsdWU5NTtcbl9hdHRyVmFsdWU5NSA9ICcnO1xufVxufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ29wdGlvbicsIF9wYXJhbXM5MywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoZGF0YVsnYnVja2V0J10pKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAgICAgJykpO1xufVxuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xufSBlbHNlIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG52YXIgX3BhcmFtczk2ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTk3ID0gJyc7XG5fYXR0clZhbHVlOTcgKz0gJ3RleHQnO1xuX3BhcmFtczk2Wyd0eXBlJ10gPSBfYXR0clZhbHVlOTc7XG5fYXR0clZhbHVlOTcgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTk4ID0gJyc7XG5fYXR0clZhbHVlOTggKz0gJ2Zvcm1fX2lucCc7XG5fcGFyYW1zOTZbJ2NsYXNzJ10gPSBfYXR0clZhbHVlOTg7XG5fYXR0clZhbHVlOTggPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTk5ID0gJyc7XG5fYXR0clZhbHVlOTkgKz0gKHR5cGVvZiBkYXRhWydzM0J1Y2tldCddICE9PSAndW5kZWZpbmVkJyA/IGRhdGFbJ3MzQnVja2V0J10gOiAnJyk7XG5fcGFyYW1zOTZbJ3ZhbHVlJ10gPSBfYXR0clZhbHVlOTk7XG5fYXR0clZhbHVlOTkgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEwMCA9ICcnO1xuX2F0dHJWYWx1ZTEwMCArPSAnY29uZmlncy1maWxlLXMzLWJ1Y2tldCc7XG5fcGFyYW1zOTZbJ3JvbGUnXSA9IF9hdHRyVmFsdWUxMDA7XG5fYXR0clZhbHVlMTAwID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMDEgPSAnJztcbl9hdHRyVmFsdWUxMDEgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1idWNrZXQnO1xuX3BhcmFtczk2WydpZCddID0gX2F0dHJWYWx1ZTEwMTtcbl9hdHRyVmFsdWUxMDEgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIF9wYXJhbXM5NikpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbnZhciBfcGFyYW1zMTAyID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEwMyA9ICcnO1xuX2F0dHJWYWx1ZTEwMyArPSAnZm9ybV9faXRlbSc7XG5fcGFyYW1zMTAyWydjbGFzcyddID0gX2F0dHJWYWx1ZTEwMztcbl9hdHRyVmFsdWUxMDMgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMTAyLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczEwNCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMDUgPSAnJztcbl9hdHRyVmFsdWUxMDUgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1wYXRoJztcbl9wYXJhbXMxMDRbJ2ZvciddID0gX2F0dHJWYWx1ZTEwNTtcbl9hdHRyVmFsdWUxMDUgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEwNiA9ICcnO1xuX2F0dHJWYWx1ZTEwNiArPSAnZm9ybV9fbGFiZWwnO1xuX3BhcmFtczEwNFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxMDY7XG5fYXR0clZhbHVlMTA2ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBfcGFyYW1zMTA0LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0J/Rg9GC0YwnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbnZhciBfcGFyYW1zMTA3ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEwOCA9ICcnO1xuX2F0dHJWYWx1ZTEwOCArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuX3BhcmFtczEwN1snY2xhc3MnXSA9IF9hdHRyVmFsdWUxMDg7XG5fYXR0clZhbHVlMTA4ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczEwNywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG52YXIgX3BhcmFtczEwOSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMTAgPSAnJztcbl9hdHRyVmFsdWUxMTAgKz0gJ3RleHQnO1xuX3BhcmFtczEwOVsndHlwZSddID0gX2F0dHJWYWx1ZTExMDtcbl9hdHRyVmFsdWUxMTAgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTExMSA9ICcnO1xuX2F0dHJWYWx1ZTExMSArPSAnZm9ybV9faW5wJztcbl9wYXJhbXMxMDlbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTExO1xuX2F0dHJWYWx1ZTExMSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTEyID0gJyc7XG5fYXR0clZhbHVlMTEyICs9IGRhdGFbJ3MzUGF0aCddO1xuX3BhcmFtczEwOVsndmFsdWUnXSA9IF9hdHRyVmFsdWUxMTI7XG5fYXR0clZhbHVlMTEyID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMTMgPSAnJztcbl9hdHRyVmFsdWUxMTMgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1wYXRoJztcbl9wYXJhbXMxMDlbJ3JvbGUnXSA9IF9hdHRyVmFsdWUxMTM7XG5fYXR0clZhbHVlMTEzID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMTQgPSAnJztcbl9hdHRyVmFsdWUxMTQgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1wYXRoJztcbl9wYXJhbXMxMDlbJ2lkJ10gPSBfYXR0clZhbHVlMTE0O1xuX2F0dHJWYWx1ZTExNCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgX3BhcmFtczEwOSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICcpKTtcbmlmICgodHlwZW9mIGRhdGFbJ3MzUGF0aEVycm9yJ10gIT09ICd1bmRlZmluZWQnID8gZGF0YVsnczNQYXRoRXJyb3InXSA6ICcnKSAmJiAoZGF0YVsnczNQYXRoRXJyb3InXSkpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAgICcpKTtcbnZhciBfcGFyYW1zMTE1ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTExNiA9ICcnO1xuX2F0dHJWYWx1ZTExNiArPSAnZm9ybV9fZXJyb3InO1xuX3BhcmFtczExNVsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxMTY7XG5fYXR0clZhbHVlMTE2ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnc3BhbicsIF9wYXJhbXMxMTUsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKGRhdGFbJ3MzUGF0aEVycm9yJ10pKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xudmFyIF9wYXJhbXMxMTcgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTE4ID0gJyc7XG5fYXR0clZhbHVlMTE4ICs9ICdmb3JtX19zdWJtaXQnO1xuX3BhcmFtczExN1snY2xhc3MnXSA9IF9hdHRyVmFsdWUxMTg7XG5fYXR0clZhbHVlMTE4ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczExNywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczExOSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMjAgPSAnJztcbl9hdHRyVmFsdWUxMjAgKz0gJ2Zvcm1fX2J0biBmb3JtX19idG4tLXN1Ym1pdCc7XG5fcGFyYW1zMTE5WydjbGFzcyddID0gX2F0dHJWYWx1ZTEyMDtcbl9hdHRyVmFsdWUxMjAgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEyMSA9ICcnO1xuaWYgKChkYXRhWydzdG9yYWdlJ10gPT0gXCJsb2NhbFwiICYmICgodHlwZW9mIGRhdGFbJ3BhdGhFcnJvciddICE9PSAndW5kZWZpbmVkJyA/IGRhdGFbJ3BhdGhFcnJvciddIDogJycpICYmIGRhdGFbJ3BhdGhFcnJvciddKSkgfHwgKGRhdGFbJ3N0b3JhZ2UnXSA9PSBcInMzXCIgJiYgKCFkYXRhWydpc1MzYXV0aCddIHx8IGRhdGFbJ3MzUGF0aEVycm9yJ10pKSkge1xuX3BhcmFtczExOVsnZGlzYWJsZWQnXSA9IF9hdHRyVmFsdWUxMjE7XG5fYXR0clZhbHVlMTIxID0gJyc7XG59XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgX3BhcmFtczExOSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Ch0L7RhdGA0LDQvdC40YLRjCcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczEyMiA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMjMgPSAnJztcbl9hdHRyVmFsdWUxMjMgKz0gJ2J1dHRvbic7XG5fcGFyYW1zMTIyWyd0eXBlJ10gPSBfYXR0clZhbHVlMTIzO1xuX2F0dHJWYWx1ZTEyMyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTI0ID0gJyc7XG5fYXR0clZhbHVlMTI0ICs9ICdmb3JtX19idG4gcG9wdXBfX2NhbmNlbCc7XG5fcGFyYW1zMTIyWydjbGFzcyddID0gX2F0dHJWYWx1ZTEyNDtcbl9hdHRyVmFsdWUxMjQgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBfcGFyYW1zMTIyLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0J7RgtC80LXQvdC40YLRjCcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuJykpOyAgICByZXR1cm4gX2NoaWxkcztcbiAgfTtcbn0pOyIsIihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuICAgIGRlZmluZShbXSwgZmFjdG9yeSgpKTtcbiAgfVxufSkoZnVuY3Rpb24gKCkge1xuICB2YXIgTUtBUlJfT1BFTiA9IDIgPDwgMTtcbiAgdmFyIE1LQVJSX0NMT1NFID0gMSA8PCAxO1xuICBmdW5jdGlvbiBta0FycihzdGFydCwgZW5kLCBmbGFnKSB7XG4gICAgdmFyIGFyciA9IFtdLCBpO1xuICAgIGlmIChmbGFnICYgTUtBUlJfT1BFTikge1xuICAgICAgaWYgKHN0YXJ0IDw9IGVuZCkge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpID4gZW5kOyBpLS0pIHtcbiAgICAgICAgICBhcnIucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmxhZyAmIE1LQVJSX0NMT1NFKSB7XG4gICAgICBpZiAoc3RhcnQgPD0gZW5kKSB7XG4gICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpID49IGVuZDsgaS0tKSB7XG4gICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBzdHIoc3RyLCBsZW4sIHNwcnRyKSB7XG4gICAgaWYgKCFsZW4pIGxlbiA9IDA7XG4gICAgaWYgKHR5cGVvZiBzdHIudG9TdHJpbmcgPT09ICdmdW5jdGlvbicpIHN0ciA9IHN0ci50b1N0cmluZygpO1xuICAgIGlmICghc3BydHIpIHNwcnRyID0gJy4nO1xuICAgIGlmICh+c3RyLmluZGV4T2YoJy4nKSkge1xuICAgICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCBzdHIuaW5kZXhPZignLicpICsgbGVuICsgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsIHN0ci5pbmRleE9mKCcuJykgKyBsZW4pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBzdHJfcGFkKHN0ciArICcuJywgc3RyLmxlbmd0aCArIDEgKyBsZW4sICcwJyk7XG4gICAgfVxuICAgIHJldHVybiBzdHIucmVwbGFjZSgnLicsIHNwcnRyKTtcbiAgfVxuICBmdW5jdGlvbiBzdHJfcmVwbGFjZShzdHIsIHNyYywgcmVwKSB7XG4gICAgd2hpbGUgKH5zdHIuaW5kZXhPZihzcmMpKSB7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZShzcmMsIHJlcCk7XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG4gIH1cbiAgdmFyIFNUUlBBRFJJR0hUID0gMSA8PCAxO1xuICB2YXIgU1RSUEFETEVGVCA9IDIgPDwgMTtcbiAgdmFyIFNUUlBBREJPVEggPSA0IDw8IDE7XG4gIGZ1bmN0aW9uIF9fc3RyX3BhZF9yZXBlYXRlcihzdHIsIGxlbikge1xuICAgIHZhciBjb2xsZWN0ID0gJycsIGk7XG4gICAgd2hpbGUoY29sbGVjdC5sZW5ndGggPCBsZW4pIGNvbGxlY3QgKz0gc3RyO1xuICAgIGNvbGxlY3QgPSBjb2xsZWN0LnN1YnN0cigwLCBsZW4pO1xuICAgIHJldHVybiBjb2xsZWN0O1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9wYWQoc3RyLCBsZW4sIHN1YiwgdHlwZSkge1xuICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHR5cGUgPSBTVFJQQURSSUdIVDtcbiAgICB2YXIgaGFsZiA9ICcnLCBwYWRfdG9fZ287XG4gICAgaWYgKChwYWRfdG9fZ28gPSBsZW4gLSBzdHIubGVuZ3RoKSA+IDApIHtcbiAgICAgIGlmICh0eXBlICYgU1RSUEFETEVGVCkgeyBzdHIgPSBfX3N0cl9wYWRfcmVwZWF0ZXIoc3ViLCBwYWRfdG9fZ28pICsgc3RyOyB9XG4gICAgICBlbHNlIGlmICh0eXBlICYgU1RSUEFEUklHSFQpIHtzdHIgPSBzdHIgKyBfX3N0cl9wYWRfcmVwZWF0ZXIoc3ViLCBwYWRfdG9fZ28pOyB9XG4gICAgICBlbHNlIGlmICh0eXBlICYgU1RSUEFEQk9USCkge1xuICAgICAgICBoYWxmID0gX19zdHJfcGFkX3JlcGVhdGVyKHN1YiwgTWF0aC5jZWlsKHBhZF90b19nby8yKSk7XG4gICAgICAgIHN0ciA9IGhhbGYgKyBzdHIgKyBoYWxmO1xuICAgICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsIGxlbik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX2h0bWxlc2NhcGUoaHRtbCkge1xuICAgIHJldHVybiBodG1sLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxuICAgIC5yZXBsYWNlKC88L2csIFwiJmx0O1wiKVxuICAgIC5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKVxuICAgIC5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKTtcbiAgfVxuICBmdW5jdGlvbiBzdHJfdXBmaXJzdChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnNwbGl0KC9bXFxzXFxuXFx0XSsvKS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLnN1YnN0cigwLCAxKS50b1VwcGVyQ2FzZSgpICsgaXRlbS5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9KS5qb2luKCcgJyk7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX2NhbWVsKHN0cikge1xuICAgIHJldHVybiBzdHIuc3BsaXQoL1tcXHNcXG5cXHRdKy8pLm1hcChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICAgIGlmICghaW5kZXgpIHJldHVybiBpdGVtO1xuICAgICAgcmV0dXJuIGl0ZW0uc3Vic3RyKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBpdGVtLnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICAgIH0pLmpvaW4oJycpO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9rZWJhYihzdHIpIHtcbiAgICByZXR1cm4gc3RyLnNwbGl0KC9bXFxzXFxuXFx0XSsvKS5qb2luKCctJyk7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3ZhbHVlcyhvYmopIHtcbiAgICB2YXIgdmFsdWVzID0gW10sIGk7XG4gICAgZm9yKGkgaW4gb2JqKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIHZhbHVlcy5wdXNoKG9ialtpXSk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuICBmdW5jdGlvbiBhcnJfY29udGFpbihvYmosIHZhbHVlKSB7XG4gICAgaWYodHlwZW9mIG9iai5pbmRleE9mID09PSAnZnVuY3Rpb24nKSByZXR1cm4gb2JqLmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgICB2YXIgaTtcbiAgICBmb3IoaSBpbiBvYmopIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgaWYgKG9ialtpXSA9PT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiBhcnJfbGVuKG9iaikge1xuICAgIGlmKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAndW5kZWZpbmVkJykgcmV0dXJuIG9iai5sZW5ndGg7XG4gICAgdmFyIGksIGxlbmd0aCA9IDA7XG4gICAgZm9yKGkgaW4gb2JqKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGxlbmd0aCsrO1xuICAgIHJldHVybiBsZW5ndGg7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3B1c2goYXJyLCB2YWx1ZSkge1xuICAgIGFyci5wdXNoKHZhbHVlKTtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3Vuc2hpZnQoYXJyLCB2YWx1ZSkge1xuICAgIGFyci51bnNoaWZ0KHZhbHVlKTtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3JhbmQoYXJyLCB2YWx1ZSkge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYXJyKTtcbiAgICByZXR1cm4gYXJyW2tleXNbcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIGFycl9sZW4oYXJyKSAtIDEpXV07XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3NwbGljZShhcnIsIHN0LCBlbiwgZWxzKSB7XG4gICAgdmFyIHBybXMgPSBbc3RdO1xuICAgIGlmICh0eXBlb2YgZW4gIT09ICd1bmRlZmluZWQnKSBwcm1zLnB1c2goZW4pO1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KGFyciwgcHJtcy5jb25jYXQoZWxzKSk7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3BhZChzcmMsIGxlbiwgZWwpIHtcbiAgICB2YXIgaSwgYXJyID0gc3JjLnNsaWNlKDApO1xuICAgIGlmKGxlbiA+IDApIGZvcihpID0gYXJyX2xlbihhcnIpO2kgPCBsZW47aSsrKSBhcnIucHVzaChlbCk7XG4gICAgaWYobGVuIDwgMCkgZm9yKGkgPSBhcnJfbGVuKGFycik7aSA8IC1sZW47aSsrKSBhcnIudW5zaGlmdChlbCk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBhcnJfcmV2ZXJzZShzcmMpIHtcbiAgICB2YXIgYXJyID0gc3JjLnNsaWNlKDApO1xuICAgIGFyci5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBhcnJfc29ydChzcmMpIHtcbiAgICB2YXIgYXJyID0gc3JjLnNsaWNlKDApO1xuICAgIGFyci5zb3J0KCk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBhcnJfc29ydF9yZXZlcnNlKHNyYykge1xuICAgIHZhciBhcnIgPSBzcmMuc2xpY2UoMCk7XG4gICAgYXJyLnNvcnQoKTtcbiAgICBhcnIucmV2ZXJzZSgpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3VuaXF1ZShzcmMpIHtcbiAgICB2YXIgaSwgYXJyID0gW107XG4gICAgZm9yKGkgaW4gc3JjKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNyYywgaSkpIGlmICghfmFyci5pbmRleE9mKHNyY1tpXSkpIGFyci5wdXNoKHNyY1tpXSk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBhcnJfa2V5KGFyciwgdmFsdWUpIHtcbiAgICB2YXIgaTtcbiAgICBmb3IoaSBpbiBhcnIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXJyLCBpKSkgaWYgKHZhbHVlID09IGFycltpXSkgcmV0dXJuIGk7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZShuYW1lLCBhdHRycywgY2IpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSByZXR1cm4gbmFtZTtcbiAgICB2YXIgY2hpbGRzID0gW107XG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykgY2IoY2hpbGRzKTtcbiAgICBpZiAoYXR0cnMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdub2RlJyxcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgYXR0cnM6IGF0dHJzLFxuICAgICAgICBjaGlsZHM6IGNoaWxkcy5maWx0ZXIoZnVuY3Rpb24gKF9jaGlsZCkgeyByZXR1cm4gX2NoaWxkICE9PSBudWxsOyB9KVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBuYW1lLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSBuYW1lID0gbmFtZS50b1N0cmluZygpO1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICB0ZXh0OiBuYW1lXG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKGRhdGEsIGNoaWxkcykge1xuICAgIHZhciBfY2hpbGRzID0gW107XG52YXIgYnVja2V0O1xudmFyIF9wYXJhbXMwID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEgPSAnJztcbl9hdHRyVmFsdWUxICs9ICdwb3B1cF9faGVhZCc7XG5fcGFyYW1zMFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxO1xuX2F0dHJWYWx1ZTEgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Cd0LDRgdGC0YDQvtC50LrQuCDQuNC30L7QsdGA0LDQttC10L3QuNGPJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuJykpO1xuZGF0YVsnaXNFbXB0eSddID0gIWRhdGFbJ3MzQWNjZXNzS2V5J10ubGVuZ3RoIHx8ICFkYXRhWydzM1NlY3JldEtleSddLmxlbmd0aDtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTtcbnZhciBfcGFyYW1zMiA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzID0gJyc7XG5fcGFyYW1zMlsnYWN0aW9uJ10gPSBfYXR0clZhbHVlMztcbl9hdHRyVmFsdWUzID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0ID0gJyc7XG5fYXR0clZhbHVlNCArPSAnZm9ybSc7XG5fcGFyYW1zMlsnY2xhc3MnXSA9IF9hdHRyVmFsdWU0O1xuX2F0dHJWYWx1ZTQgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTUgPSAnJztcbl9hdHRyVmFsdWU1ICs9ICdjb25maWdzLWZvcm0nO1xuX3BhcmFtczJbJ3JvbGUnXSA9IF9hdHRyVmFsdWU1O1xuX2F0dHJWYWx1ZTUgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdmb3JtJywgX3BhcmFtczIsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zNiA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU3ID0gJyc7XG5fYXR0clZhbHVlNyArPSAnZm9ybV9faXRlbSc7XG5fcGFyYW1zNlsnY2xhc3MnXSA9IF9hdHRyVmFsdWU3O1xuX2F0dHJWYWx1ZTcgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zNiwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczggPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlOSA9ICcnO1xuX2F0dHJWYWx1ZTkgKz0gJ2Zvcm1fX2xhYmVsJztcbl9wYXJhbXM4WydjbGFzcyddID0gX2F0dHJWYWx1ZTk7XG5fYXR0clZhbHVlOSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgX3BhcmFtczgsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQpdGA0LDQvdC40LvQuNGJ0LUnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXMxMCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMSA9ICcnO1xuX2F0dHJWYWx1ZTExICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5fcGFyYW1zMTBbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTE7XG5fYXR0clZhbHVlMTEgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMTAsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczEyID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEzID0gJyc7XG5fYXR0clZhbHVlMTMgKz0gJ3RhYnMnO1xuX3BhcmFtczEyWydjbGFzcyddID0gX2F0dHJWYWx1ZTEzO1xuX2F0dHJWYWx1ZTEzID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczEyLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczE0ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE1ID0gJyc7XG5fYXR0clZhbHVlMTUgKz0gJ2J1dHRvbic7XG5fcGFyYW1zMTRbJ3R5cGUnXSA9IF9hdHRyVmFsdWUxNTtcbl9hdHRyVmFsdWUxNSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTYgPSAnJztcbl9hdHRyVmFsdWUxNiArPSAndGFic19faXRlbSc7XG5pZiAoZGF0YVsnc3RvcmFnZSddID09IFwibG9jYWxcIikge1xuX2F0dHJWYWx1ZTE2ICs9ICcgdGFic19faXRlbS0tYWN0aXZlJztcbn1cbl9wYXJhbXMxNFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxNjtcbl9hdHRyVmFsdWUxNiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTcgPSAnJztcbl9hdHRyVmFsdWUxNyArPSAnY29uZmlncy1nYWxsZXJ5LXN0b3JhZ2UnO1xuX3BhcmFtczE0Wydyb2xlJ10gPSBfYXR0clZhbHVlMTc7XG5fYXR0clZhbHVlMTcgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE4ID0gJyc7XG5fYXR0clZhbHVlMTggKz0gJ2xvY2FsJztcbl9wYXJhbXMxNFsnZGF0YS12YWx1ZSddID0gX2F0dHJWYWx1ZTE4O1xuX2F0dHJWYWx1ZTE4ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgX3BhcmFtczE0LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0JvQvtC60LDQu9GM0L3QvtC1JykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczE5ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTIwID0gJyc7XG5fYXR0clZhbHVlMjAgKz0gJ2J1dHRvbic7XG5fcGFyYW1zMTlbJ3R5cGUnXSA9IF9hdHRyVmFsdWUyMDtcbl9hdHRyVmFsdWUyMCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjEgPSAnJztcbl9hdHRyVmFsdWUyMSArPSAndGFic19faXRlbSc7XG5pZiAoZGF0YVsnc3RvcmFnZSddID09IFwiczNcIikge1xuX2F0dHJWYWx1ZTIxICs9ICcgdGFic19faXRlbS0tYWN0aXZlJztcbn1cbl9wYXJhbXMxOVsnY2xhc3MnXSA9IF9hdHRyVmFsdWUyMTtcbl9hdHRyVmFsdWUyMSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjIgPSAnJztcbl9hdHRyVmFsdWUyMiArPSAnY29uZmlncy1nYWxsZXJ5LXN0b3JhZ2UnO1xuX3BhcmFtczE5Wydyb2xlJ10gPSBfYXR0clZhbHVlMjI7XG5fYXR0clZhbHVlMjIgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTIzID0gJyc7XG5fYXR0clZhbHVlMjMgKz0gJ3MzJztcbl9wYXJhbXMxOVsnZGF0YS12YWx1ZSddID0gX2F0dHJWYWx1ZTIzO1xuX2F0dHJWYWx1ZTIzID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgX3BhcmFtczE5LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnUzMnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zMjQgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjUgPSAnJztcbl9hdHRyVmFsdWUyNSArPSAnY29uZmlncy1nYWxsZXJ5LW1vZGFsLXN0b3JhZ2UtbG9jYWwgY29uZmlncy1nYWxsZXJ5LW1vZGFsLXN0b3JhZ2UtZnJhbWUnO1xuX3BhcmFtczI0Wydyb2xlJ10gPSBfYXR0clZhbHVlMjU7XG5fYXR0clZhbHVlMjUgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTI2ID0gJyc7XG5pZiAoZGF0YVsnc3RvcmFnZSddICE9IFwibG9jYWxcIikge1xuX2F0dHJWYWx1ZTI2ICs9ICdkaXNwbGF5OiBub25lJztcbl9wYXJhbXMyNFsnc3R5bGUnXSA9IF9hdHRyVmFsdWUyNjtcbl9hdHRyVmFsdWUyNiA9ICcnO1xufVxufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMyNCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczI3ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTI4ID0gJyc7XG5fYXR0clZhbHVlMjggKz0gJ2Zvcm1fX2l0ZW0nO1xuX3BhcmFtczI3WydjbGFzcyddID0gX2F0dHJWYWx1ZTI4O1xuX2F0dHJWYWx1ZTI4ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczI3LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXMyOSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzMCA9ICcnO1xuX2F0dHJWYWx1ZTMwICs9ICdjb25maWdzLWdhbGxlcnktcGF0aCc7XG5fcGFyYW1zMjlbJ2ZvciddID0gX2F0dHJWYWx1ZTMwO1xuX2F0dHJWYWx1ZTMwID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzMSA9ICcnO1xuX2F0dHJWYWx1ZTMxICs9ICdmb3JtX19sYWJlbCc7XG5fcGFyYW1zMjlbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMzE7XG5fYXR0clZhbHVlMzEgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXMyOSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Cf0YPRgtGMJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXMzMiA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzMyA9ICcnO1xuX2F0dHJWYWx1ZTMzICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5fcGFyYW1zMzJbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMzM7XG5fYXR0clZhbHVlMzMgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMzIsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbnZhciBfcGFyYW1zMzQgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzUgPSAnJztcbl9hdHRyVmFsdWUzNSArPSAndGV4dCc7XG5fcGFyYW1zMzRbJ3R5cGUnXSA9IF9hdHRyVmFsdWUzNTtcbl9hdHRyVmFsdWUzNSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzYgPSAnJztcbl9hdHRyVmFsdWUzNiArPSAnZm9ybV9faW5wJztcbl9wYXJhbXMzNFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUzNjtcbl9hdHRyVmFsdWUzNiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzcgPSAnJztcbl9hdHRyVmFsdWUzNyArPSBkYXRhWydwYXRoJ107XG5fcGFyYW1zMzRbJ3ZhbHVlJ10gPSBfYXR0clZhbHVlMzc7XG5fYXR0clZhbHVlMzcgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTM4ID0gJyc7XG5fYXR0clZhbHVlMzggKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1wYXRoJztcbl9wYXJhbXMzNFsncm9sZSddID0gX2F0dHJWYWx1ZTM4O1xuX2F0dHJWYWx1ZTM4ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzOSA9ICcnO1xuX2F0dHJWYWx1ZTM5ICs9ICdjb25maWdzLWdhbGxlcnktcGF0aCc7XG5fcGFyYW1zMzRbJ2lkJ10gPSBfYXR0clZhbHVlMzk7XG5fYXR0clZhbHVlMzkgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIF9wYXJhbXMzNCkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG5pZiAoZGF0YVsncGF0aEVycm9yJ10pIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXM0MCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0MSA9ICcnO1xuX2F0dHJWYWx1ZTQxICs9ICdmb3JtX19lcnJvcic7XG5fcGFyYW1zNDBbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNDE7XG5fYXR0clZhbHVlNDEgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdzcGFuJywgX3BhcmFtczQwLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZShkYXRhWydwYXRoRXJyb3InXSkpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zNDIgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDMgPSAnJztcbl9hdHRyVmFsdWU0MyArPSAnY29uZmlncy1nYWxsZXJ5LW1vZGFsLXN0b3JhZ2UtczMgY29uZmlncy1nYWxsZXJ5LW1vZGFsLXN0b3JhZ2UtZnJhbWUnO1xuX3BhcmFtczQyWydyb2xlJ10gPSBfYXR0clZhbHVlNDM7XG5fYXR0clZhbHVlNDMgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ0ID0gJyc7XG5pZiAoZGF0YVsnc3RvcmFnZSddICE9IFwiczNcIikge1xuX2F0dHJWYWx1ZTQ0ICs9ICdkaXNwbGF5OiBub25lJztcbl9wYXJhbXM0Mlsnc3R5bGUnXSA9IF9hdHRyVmFsdWU0NDtcbl9hdHRyVmFsdWU0NCA9ICcnO1xufVxufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM0MiwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczQ1ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ2ID0gJyc7XG5fYXR0clZhbHVlNDYgKz0gJ2Zvcm1fX2l0ZW0nO1xuX3BhcmFtczQ1WydjbGFzcyddID0gX2F0dHJWYWx1ZTQ2O1xuX2F0dHJWYWx1ZTQ2ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczQ1LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXM0NyA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0OCA9ICcnO1xuX2F0dHJWYWx1ZTQ4ICs9ICdjb25maWdzLWdhbGxlcnktczMtYWNjZXNzLWtleSc7XG5fcGFyYW1zNDdbJ2ZvciddID0gX2F0dHJWYWx1ZTQ4O1xuX2F0dHJWYWx1ZTQ4ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0OSA9ICcnO1xuX2F0dHJWYWx1ZTQ5ICs9ICdmb3JtX19sYWJlbCc7XG5fcGFyYW1zNDdbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNDk7XG5fYXR0clZhbHVlNDkgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXM0NywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ0FjY2VzcyBrZXknKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczUwID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTUxID0gJyc7XG5fYXR0clZhbHVlNTEgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbl9wYXJhbXM1MFsnY2xhc3MnXSA9IF9hdHRyVmFsdWU1MTtcbl9hdHRyVmFsdWU1MSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM1MCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXM1MiA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1MyA9ICcnO1xuX2F0dHJWYWx1ZTUzICs9ICd0ZXh0Jztcbl9wYXJhbXM1MlsndHlwZSddID0gX2F0dHJWYWx1ZTUzO1xuX2F0dHJWYWx1ZTUzID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1NCA9ICcnO1xuX2F0dHJWYWx1ZTU0ICs9ICdmb3JtX19pbnAnO1xuX3BhcmFtczUyWydjbGFzcyddID0gX2F0dHJWYWx1ZTU0O1xuX2F0dHJWYWx1ZTU0ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1NSA9ICcnO1xuX2F0dHJWYWx1ZTU1ICs9IGRhdGFbJ3MzQWNjZXNzS2V5J107XG5fcGFyYW1zNTJbJ3ZhbHVlJ10gPSBfYXR0clZhbHVlNTU7XG5fYXR0clZhbHVlNTUgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTU2ID0gJyc7XG5fYXR0clZhbHVlNTYgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1hY2Nlc3Mta2V5Jztcbl9wYXJhbXM1Mlsncm9sZSddID0gX2F0dHJWYWx1ZTU2O1xuX2F0dHJWYWx1ZTU2ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1NyA9ICcnO1xuX2F0dHJWYWx1ZTU3ICs9ICdjb25maWdzLWdhbGxlcnktczMtYWNjZXNzLWtleSc7XG5fcGFyYW1zNTJbJ2lkJ10gPSBfYXR0clZhbHVlNTc7XG5fYXR0clZhbHVlNTcgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIF9wYXJhbXM1MikpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczU4ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTU5ID0gJyc7XG5fYXR0clZhbHVlNTkgKz0gJ2Zvcm1fX2l0ZW0nO1xuX3BhcmFtczU4WydjbGFzcyddID0gX2F0dHJWYWx1ZTU5O1xuX2F0dHJWYWx1ZTU5ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczU4LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXM2MCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU2MSA9ICcnO1xuX2F0dHJWYWx1ZTYxICs9ICdjb25maWdzLWdhbGxlcnktczMtc2VjcmV0LWtleSc7XG5fcGFyYW1zNjBbJ2ZvciddID0gX2F0dHJWYWx1ZTYxO1xuX2F0dHJWYWx1ZTYxID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU2MiA9ICcnO1xuX2F0dHJWYWx1ZTYyICs9ICdmb3JtX19sYWJlbCc7XG5fcGFyYW1zNjBbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNjI7XG5fYXR0clZhbHVlNjIgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXM2MCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1NlY3JldCBrZXknKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczYzID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTY0ID0gJyc7XG5fYXR0clZhbHVlNjQgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbl9wYXJhbXM2M1snY2xhc3MnXSA9IF9hdHRyVmFsdWU2NDtcbl9hdHRyVmFsdWU2NCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM2MywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXM2NSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU2NiA9ICcnO1xuX2F0dHJWYWx1ZTY2ICs9ICdwYXNzd29yZCc7XG5fcGFyYW1zNjVbJ3R5cGUnXSA9IF9hdHRyVmFsdWU2Njtcbl9hdHRyVmFsdWU2NiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNjcgPSAnJztcbl9hdHRyVmFsdWU2NyArPSAnZm9ybV9faW5wJztcbl9wYXJhbXM2NVsnY2xhc3MnXSA9IF9hdHRyVmFsdWU2Nztcbl9hdHRyVmFsdWU2NyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNjggPSAnJztcbl9wYXJhbXM2NVsndmFsdWUnXSA9IF9hdHRyVmFsdWU2ODtcbl9hdHRyVmFsdWU2OCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNjkgPSAnJztcbl9hdHRyVmFsdWU2OSArPSAnY29uZmlncy1nYWxsZXJ5LXMzLXNlY3JldC1rZXknO1xuX3BhcmFtczY1Wydyb2xlJ10gPSBfYXR0clZhbHVlNjk7XG5fYXR0clZhbHVlNjkgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTcwID0gJyc7XG5fYXR0clZhbHVlNzAgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1zZWNyZXQta2V5Jztcbl9wYXJhbXM2NVsnaWQnXSA9IF9hdHRyVmFsdWU3MDtcbl9hdHRyVmFsdWU3MCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgX3BhcmFtczY1KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zNzEgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNzIgPSAnJztcbl9hdHRyVmFsdWU3MiArPSAnZm9ybV9faXRlbSc7XG5fcGFyYW1zNzFbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNzI7XG5fYXR0clZhbHVlNzIgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zNzEsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczczID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTc0ID0gJyc7XG5fYXR0clZhbHVlNzQgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbl9wYXJhbXM3M1snY2xhc3MnXSA9IF9hdHRyVmFsdWU3NDtcbl9hdHRyVmFsdWU3NCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM3MywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXM3NSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU3NiA9ICcnO1xuX2F0dHJWYWx1ZTc2ICs9ICdidXR0b24nO1xuX3BhcmFtczc1Wyd0eXBlJ10gPSBfYXR0clZhbHVlNzY7XG5fYXR0clZhbHVlNzYgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTc3ID0gJyc7XG5fYXR0clZhbHVlNzcgKz0gJ2Zvcm1fX2J0bic7XG5fcGFyYW1zNzVbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNzc7XG5fYXR0clZhbHVlNzcgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTc4ID0gJyc7XG5fYXR0clZhbHVlNzggKz0gJ3Rlc3QtY29ubmVjdGlvbi1zMyc7XG5fcGFyYW1zNzVbJ3JvbGUnXSA9IF9hdHRyVmFsdWU3ODtcbl9hdHRyVmFsdWU3OCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNzkgPSAnJztcbmlmIChkYXRhWydpc0VtcHR5J10gfHwgZGF0YVsnczNhdXRoJ10gfHwgZGF0YVsnaXNpc1MzQ2hlY2tpbmcnXSkge1xuX3BhcmFtczc1WydkaXNhYmxlZCddID0gX2F0dHJWYWx1ZTc5O1xuX2F0dHJWYWx1ZTc5ID0gJyc7XG59XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgX3BhcmFtczc1LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICcpKTtcbmlmIChkYXRhWydpc2lzUzNDaGVja2luZyddKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICAg0KHQvtC10LTQuNC90LXQvdC40LUuLi5cXG4gICAgICAgICAgJykpO1xufSBlbHNlIGlmIChkYXRhWydzM2F1dGgnXSkge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgINCT0L7RgtC+0LLQvlxcbiAgICAgICAgICAnKSk7XG59IGVsc2Uge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgINCf0L7QtNC60LvRjtGH0LjRgtGM0YHRj1xcbiAgICAgICAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xuaWYgKGRhdGFbJ3MzYXV0aCddKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczgwID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTgxID0gJyc7XG5fYXR0clZhbHVlODEgKz0gJ2Zvcm1fX2l0ZW0nO1xuX3BhcmFtczgwWydjbGFzcyddID0gX2F0dHJWYWx1ZTgxO1xuX2F0dHJWYWx1ZTgxID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczgwLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczgyID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTgzID0gJyc7XG5fYXR0clZhbHVlODMgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1idWNrZXQnO1xuX3BhcmFtczgyWydmb3InXSA9IF9hdHRyVmFsdWU4Mztcbl9hdHRyVmFsdWU4MyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlODQgPSAnJztcbl9hdHRyVmFsdWU4NCArPSAnZm9ybV9fbGFiZWwnO1xuX3BhcmFtczgyWydjbGFzcyddID0gX2F0dHJWYWx1ZTg0O1xuX2F0dHJWYWx1ZTg0ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBfcGFyYW1zODIsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdCdWNrZXQnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbnZhciBfcGFyYW1zODUgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlODYgPSAnJztcbl9hdHRyVmFsdWU4NiArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuX3BhcmFtczg1WydjbGFzcyddID0gX2F0dHJWYWx1ZTg2O1xuX2F0dHJWYWx1ZTg2ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczg1LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG5pZiAoYXJyX2xlbihkYXRhWydidWNrZXRzJ10pKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICAgJykpO1xudmFyIF9wYXJhbXM4NyA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU4OCA9ICcnO1xuX2F0dHJWYWx1ZTg4ICs9ICdmb3JtX19zZWxlY3QnO1xuX3BhcmFtczg3WydjbGFzcyddID0gX2F0dHJWYWx1ZTg4O1xuX2F0dHJWYWx1ZTg4ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBfcGFyYW1zODcsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICAgICAnKSk7XG52YXIgX3BhcmFtczg5ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTkwID0gJyc7XG5fYXR0clZhbHVlOTAgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1idWNrZXQnO1xuX3BhcmFtczg5Wydyb2xlJ10gPSBfYXR0clZhbHVlOTA7XG5fYXR0clZhbHVlOTAgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTkxID0gJyc7XG5fYXR0clZhbHVlOTEgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1idWNrZXQnO1xuX3BhcmFtczg5WydpZCddID0gX2F0dHJWYWx1ZTkxO1xuX2F0dHJWYWx1ZTkxID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnc2VsZWN0JywgX3BhcmFtczg5LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICAgICAnKSk7XG52YXIgX2FycjkyID0gZGF0YVsnYnVja2V0cyddO1xuZm9yIChkYXRhWydidWNrZXQnXSBpbiBfYXJyOTIpIHtcbmRhdGFbJ2J1Y2tldCddID0gX2FycjkyW2RhdGFbJ2J1Y2tldCddXTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAgICAgJykpO1xudmFyIF9wYXJhbXM5MyA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU5NCA9ICcnO1xuX2F0dHJWYWx1ZTk0ICs9IGRhdGFbJ2J1Y2tldCddO1xuX3BhcmFtczkzWyd2YWx1ZSddID0gX2F0dHJWYWx1ZTk0O1xuX2F0dHJWYWx1ZTk0ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU5NSA9ICcnO1xuaWYgKGRhdGFbJ3MzQnVja2V0J10gPT0gZGF0YVsnYnVja2V0J10pIHtcbl9wYXJhbXM5M1snc2VsZWN0ZWQnXSA9IF9hdHRyVmFsdWU5NTtcbl9hdHRyVmFsdWU5NSA9ICcnO1xufVxufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ29wdGlvbicsIF9wYXJhbXM5MywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoZGF0YVsnYnVja2V0J10pKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAgICAgJykpO1xufVxuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xufSBlbHNlIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG52YXIgX3BhcmFtczk2ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTk3ID0gJyc7XG5fYXR0clZhbHVlOTcgKz0gJ3RleHQnO1xuX3BhcmFtczk2Wyd0eXBlJ10gPSBfYXR0clZhbHVlOTc7XG5fYXR0clZhbHVlOTcgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTk4ID0gJyc7XG5fYXR0clZhbHVlOTggKz0gJ2Zvcm1fX2lucCc7XG5fcGFyYW1zOTZbJ2NsYXNzJ10gPSBfYXR0clZhbHVlOTg7XG5fYXR0clZhbHVlOTggPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTk5ID0gJyc7XG5fYXR0clZhbHVlOTkgKz0gZGF0YVsnczNCdWNrZXQnXTtcbl9wYXJhbXM5NlsndmFsdWUnXSA9IF9hdHRyVmFsdWU5OTtcbl9hdHRyVmFsdWU5OSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTAwID0gJyc7XG5fYXR0clZhbHVlMTAwICs9ICdjb25maWdzLWdhbGxlcnktczMtYnVja2V0Jztcbl9wYXJhbXM5Nlsncm9sZSddID0gX2F0dHJWYWx1ZTEwMDtcbl9hdHRyVmFsdWUxMDAgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEwMSA9ICcnO1xuX2F0dHJWYWx1ZTEwMSArPSAnY29uZmlncy1nYWxsZXJ5LXMzLWJ1Y2tldCc7XG5fcGFyYW1zOTZbJ2lkJ10gPSBfYXR0clZhbHVlMTAxO1xuX2F0dHJWYWx1ZTEwMSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgX3BhcmFtczk2KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbn1cbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXMxMDIgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTAzID0gJyc7XG5fYXR0clZhbHVlMTAzICs9ICdmb3JtX19pdGVtJztcbl9wYXJhbXMxMDJbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTAzO1xuX2F0dHJWYWx1ZTEwMyA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMxMDIsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbnZhciBfcGFyYW1zMTA0ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEwNSA9ICcnO1xuX2F0dHJWYWx1ZTEwNSArPSAnY29uZmlncy1nYWxsZXJ5LXMzLXBhdGgnO1xuX3BhcmFtczEwNFsnZm9yJ10gPSBfYXR0clZhbHVlMTA1O1xuX2F0dHJWYWx1ZTEwNSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTA2ID0gJyc7XG5fYXR0clZhbHVlMTA2ICs9ICdmb3JtX19sYWJlbCc7XG5fcGFyYW1zMTA0WydjbGFzcyddID0gX2F0dHJWYWx1ZTEwNjtcbl9hdHRyVmFsdWUxMDYgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXMxMDQsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQn9GD0YLRjCcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXMxMDcgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTA4ID0gJyc7XG5fYXR0clZhbHVlMTA4ICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5fcGFyYW1zMTA3WydjbGFzcyddID0gX2F0dHJWYWx1ZTEwODtcbl9hdHRyVmFsdWUxMDggPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMTA3LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICcpKTtcbnZhciBfcGFyYW1zMTA5ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTExMCA9ICcnO1xuX2F0dHJWYWx1ZTExMCArPSAndGV4dCc7XG5fcGFyYW1zMTA5Wyd0eXBlJ10gPSBfYXR0clZhbHVlMTEwO1xuX2F0dHJWYWx1ZTExMCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTExID0gJyc7XG5fYXR0clZhbHVlMTExICs9ICdmb3JtX19pbnAnO1xuX3BhcmFtczEwOVsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxMTE7XG5fYXR0clZhbHVlMTExID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMTIgPSAnJztcbl9hdHRyVmFsdWUxMTIgKz0gZGF0YVsnczNQYXRoJ107XG5fcGFyYW1zMTA5Wyd2YWx1ZSddID0gX2F0dHJWYWx1ZTExMjtcbl9hdHRyVmFsdWUxMTIgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTExMyA9ICcnO1xuX2F0dHJWYWx1ZTExMyArPSAnY29uZmlncy1nYWxsZXJ5LXMzLXBhdGgnO1xuX3BhcmFtczEwOVsncm9sZSddID0gX2F0dHJWYWx1ZTExMztcbl9hdHRyVmFsdWUxMTMgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTExNCA9ICcnO1xuX2F0dHJWYWx1ZTExNCArPSAnY29uZmlncy1nYWxsZXJ5LXMzLXBhdGgnO1xuX3BhcmFtczEwOVsnaWQnXSA9IF9hdHRyVmFsdWUxMTQ7XG5fYXR0clZhbHVlMTE0ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBfcGFyYW1zMTA5KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xudmFyIF9wYXJhbXMxMTUgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTE2ID0gJyc7XG5fYXR0clZhbHVlMTE2ICs9ICdmb3JtX19pdGVtJztcbl9wYXJhbXMxMTVbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTE2O1xuX2F0dHJWYWx1ZTExNiA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMxMTUsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXMxMTcgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTE4ID0gJyc7XG5fYXR0clZhbHVlMTE4ICs9ICdjb25maWdzLWdhbGxlcnktd2lkdGgnO1xuX3BhcmFtczExN1snZm9yJ10gPSBfYXR0clZhbHVlMTE4O1xuX2F0dHJWYWx1ZTExOCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTE5ID0gJyc7XG5fYXR0clZhbHVlMTE5ICs9ICdmb3JtX19sYWJlbCc7XG5fcGFyYW1zMTE3WydjbGFzcyddID0gX2F0dHJWYWx1ZTExOTtcbl9hdHRyVmFsdWUxMTkgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXMxMTcsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQo9C80LXQvdGM0YjQuNGC0Ywg0LTQviDQt9Cw0LTQsNC90L3Ri9GFINGA0LDQt9C80LXRgNC+0LIgKNGBINGB0L7RhdGA0LDQvdC10L3QuNC10Lwg0L/RgNC+0L/QvtGA0YbQuNC5KScpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczEyMCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMjEgPSAnJztcbl9hdHRyVmFsdWUxMjEgKz0gJ2Zvcm1fX2lucC1jb250YWluIGZvcm1fX2lucC1jb250YWluLS1mdWxsLXdpZHRoJztcbl9wYXJhbXMxMjBbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTIxO1xuX2F0dHJWYWx1ZTEyMSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMxMjAsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczEyMiA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMjMgPSAnJztcbl9hdHRyVmFsdWUxMjMgKz0gJ3RleHQnO1xuX3BhcmFtczEyMlsndHlwZSddID0gX2F0dHJWYWx1ZTEyMztcbl9hdHRyVmFsdWUxMjMgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEyNCA9ICcnO1xuX2F0dHJWYWx1ZTEyNCArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG5fcGFyYW1zMTIyWydjbGFzcyddID0gX2F0dHJWYWx1ZTEyNDtcbl9hdHRyVmFsdWUxMjQgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEyNSA9ICcnO1xuX2F0dHJWYWx1ZTEyNSArPSBkYXRhWyd3aWR0aCddO1xuX3BhcmFtczEyMlsndmFsdWUnXSA9IF9hdHRyVmFsdWUxMjU7XG5fYXR0clZhbHVlMTI1ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMjYgPSAnJztcbl9hdHRyVmFsdWUxMjYgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS13aWR0aCc7XG5fcGFyYW1zMTIyWydyb2xlJ10gPSBfYXR0clZhbHVlMTI2O1xuX2F0dHJWYWx1ZTEyNiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTI3ID0gJyc7XG5fYXR0clZhbHVlMTI3ICs9ICdjb25maWdzLWdhbGxlcnktd2lkdGgnO1xuX3BhcmFtczEyMlsnaWQnXSA9IF9hdHRyVmFsdWUxMjc7XG5fYXR0clZhbHVlMTI3ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBfcGFyYW1zMTIyKSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczEyOCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMjkgPSAnJztcbl9hdHRyVmFsdWUxMjkgKz0gJ2Zvcm1fX2JldHdlZW4taW5wJztcbl9wYXJhbXMxMjhbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTI5O1xuX2F0dHJWYWx1ZTEyOSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ3NwYW4nLCBfcGFyYW1zMTI4LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnw5cnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczEzMCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMzEgPSAnJztcbl9hdHRyVmFsdWUxMzEgKz0gJ3RleHQnO1xuX3BhcmFtczEzMFsndHlwZSddID0gX2F0dHJWYWx1ZTEzMTtcbl9hdHRyVmFsdWUxMzEgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEzMiA9ICcnO1xuX2F0dHJWYWx1ZTEzMiArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG5fcGFyYW1zMTMwWydjbGFzcyddID0gX2F0dHJWYWx1ZTEzMjtcbl9hdHRyVmFsdWUxMzIgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEzMyA9ICcnO1xuX2F0dHJWYWx1ZTEzMyArPSBkYXRhWydoZWlnaHQnXTtcbl9wYXJhbXMxMzBbJ3ZhbHVlJ10gPSBfYXR0clZhbHVlMTMzO1xuX2F0dHJWYWx1ZTEzMyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTM0ID0gJyc7XG5fYXR0clZhbHVlMTM0ICs9ICdjb25maWdzLWdhbGxlcnktaGVpZ2h0Jztcbl9wYXJhbXMxMzBbJ3JvbGUnXSA9IF9hdHRyVmFsdWUxMzQ7XG5fYXR0clZhbHVlMTM0ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBfcGFyYW1zMTMwKSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zMTM1ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEzNiA9ICcnO1xuX2F0dHJWYWx1ZTEzNiArPSAnZm9ybV9faXRlbSc7XG5fcGFyYW1zMTM1WydjbGFzcyddID0gX2F0dHJWYWx1ZTEzNjtcbl9hdHRyVmFsdWUxMzYgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMTM1LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zMTM3ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEzOCA9ICcnO1xuX2F0dHJWYWx1ZTEzOCArPSAnY29uZmlncy1nYWxsZXJ5LXdpZHRoJztcbl9wYXJhbXMxMzdbJ2ZvciddID0gX2F0dHJWYWx1ZTEzODtcbl9hdHRyVmFsdWUxMzggPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEzOSA9ICcnO1xuX2F0dHJWYWx1ZTEzOSArPSAnZm9ybV9fbGFiZWwnO1xuX3BhcmFtczEzN1snY2xhc3MnXSA9IF9hdHRyVmFsdWUxMzk7XG5fYXR0clZhbHVlMTM5ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBfcGFyYW1zMTM3LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0KPQvNC10L3RjNGI0LjRgtGMINC/0YDQtdCy0YzRjiDQtNC+INC30LDQtNCw0L3QvdGL0YUg0YDQsNC30LzQtdGA0L7QsiAo0YEg0YHQvtGF0YDQsNC90LXQvdC40LXQvCDQv9GA0L7Qv9C+0YDRhtC40LkpJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zMTQwID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE0MSA9ICcnO1xuX2F0dHJWYWx1ZTE0MSArPSAnZm9ybV9faW5wLWNvbnRhaW4gZm9ybV9faW5wLWNvbnRhaW4tLWZ1bGwtd2lkdGgnO1xuX3BhcmFtczE0MFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxNDE7XG5fYXR0clZhbHVlMTQxID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczE0MCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbnZhciBfcGFyYW1zMTQyID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE0MyA9ICcnO1xuX2F0dHJWYWx1ZTE0MyArPSAndGV4dCc7XG5fcGFyYW1zMTQyWyd0eXBlJ10gPSBfYXR0clZhbHVlMTQzO1xuX2F0dHJWYWx1ZTE0MyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTQ0ID0gJyc7XG5fYXR0clZhbHVlMTQ0ICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS12ZXJ5LXNob3J0Jztcbl9wYXJhbXMxNDJbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTQ0O1xuX2F0dHJWYWx1ZTE0NCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTQ1ID0gJyc7XG5fYXR0clZhbHVlMTQ1ICs9IGRhdGFbJ3ByZXZpZXdXaWR0aCddO1xuX3BhcmFtczE0MlsndmFsdWUnXSA9IF9hdHRyVmFsdWUxNDU7XG5fYXR0clZhbHVlMTQ1ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNDYgPSAnJztcbl9hdHRyVmFsdWUxNDYgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1wcmV2aWV3LXdpZHRoJztcbl9wYXJhbXMxNDJbJ3JvbGUnXSA9IF9hdHRyVmFsdWUxNDY7XG5fYXR0clZhbHVlMTQ2ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNDcgPSAnJztcbl9hdHRyVmFsdWUxNDcgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1wcmV2aWV3LXdpZHRoJztcbl9wYXJhbXMxNDJbJ2lkJ10gPSBfYXR0clZhbHVlMTQ3O1xuX2F0dHJWYWx1ZTE0NyA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgX3BhcmFtczE0MikpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXMxNDggPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTQ5ID0gJyc7XG5fYXR0clZhbHVlMTQ5ICs9ICdmb3JtX19iZXR3ZWVuLWlucCc7XG5fcGFyYW1zMTQ4WydjbGFzcyddID0gX2F0dHJWYWx1ZTE0OTtcbl9hdHRyVmFsdWUxNDkgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdzcGFuJywgX3BhcmFtczE0OCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ8OXJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXMxNTAgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTUxID0gJyc7XG5fYXR0clZhbHVlMTUxICs9ICd0ZXh0Jztcbl9wYXJhbXMxNTBbJ3R5cGUnXSA9IF9hdHRyVmFsdWUxNTE7XG5fYXR0clZhbHVlMTUxID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNTIgPSAnJztcbl9hdHRyVmFsdWUxNTIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuX3BhcmFtczE1MFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxNTI7XG5fYXR0clZhbHVlMTUyID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNTMgPSAnJztcbl9hdHRyVmFsdWUxNTMgKz0gZGF0YVsncHJldmlld0hlaWdodCddO1xuX3BhcmFtczE1MFsndmFsdWUnXSA9IF9hdHRyVmFsdWUxNTM7XG5fYXR0clZhbHVlMTUzID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNTQgPSAnJztcbl9hdHRyVmFsdWUxNTQgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1wcmV2aWV3LWhlaWdodCc7XG5fcGFyYW1zMTUwWydyb2xlJ10gPSBfYXR0clZhbHVlMTU0O1xuX2F0dHJWYWx1ZTE1NCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgX3BhcmFtczE1MCkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG52YXIgX3BhcmFtczE1NSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNTYgPSAnJztcbl9hdHRyVmFsdWUxNTYgKz0gJ2Zvcm1fX3N1Ym1pdCc7XG5fcGFyYW1zMTU1WydjbGFzcyddID0gX2F0dHJWYWx1ZTE1Njtcbl9hdHRyVmFsdWUxNTYgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMTU1LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zMTU3ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE1OCA9ICcnO1xuX2F0dHJWYWx1ZTE1OCArPSAnZm9ybV9fYnRuIGZvcm1fX2J0bi0tc3VibWl0Jztcbl9wYXJhbXMxNTdbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTU4O1xuX2F0dHJWYWx1ZTE1OCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTU5ID0gJyc7XG5pZiAoKGRhdGFbJ3N0b3JhZ2UnXSA9PSBcImxvY2FsXCIgJiYgZGF0YVsncGF0aEVycm9yJ10pIHx8IChkYXRhWydzdG9yYWdlJ10gPT0gXCJzM1wiICYmICghZGF0YVsnczNhdXRoJ10pKSkge1xuX3BhcmFtczE1N1snZGlzYWJsZWQnXSA9IF9hdHRyVmFsdWUxNTk7XG5fYXR0clZhbHVlMTU5ID0gJyc7XG59XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgX3BhcmFtczE1NywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Ch0L7RhdGA0LDQvdC40YLRjCcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczE2MCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNjEgPSAnJztcbl9hdHRyVmFsdWUxNjEgKz0gJ2J1dHRvbic7XG5fcGFyYW1zMTYwWyd0eXBlJ10gPSBfYXR0clZhbHVlMTYxO1xuX2F0dHJWYWx1ZTE2MSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTYyID0gJyc7XG5fYXR0clZhbHVlMTYyICs9ICdmb3JtX19idG4gcG9wdXBfX2NhbmNlbCc7XG5fcGFyYW1zMTYwWydjbGFzcyddID0gX2F0dHJWYWx1ZTE2Mjtcbl9hdHRyVmFsdWUxNjIgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBfcGFyYW1zMTYwLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0J7RgtC80LXQvdC40YLRjCcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuJykpOyAgICByZXR1cm4gX2NoaWxkcztcbiAgfTtcbn0pOyIsIihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuICAgIGRlZmluZShbXSwgZmFjdG9yeSgpKTtcbiAgfVxufSkoZnVuY3Rpb24gKCkge1xuICB2YXIgTUtBUlJfT1BFTiA9IDIgPDwgMTtcbiAgdmFyIE1LQVJSX0NMT1NFID0gMSA8PCAxO1xuICBmdW5jdGlvbiBta0FycihzdGFydCwgZW5kLCBmbGFnKSB7XG4gICAgdmFyIGFyciA9IFtdLCBpO1xuICAgIGlmIChmbGFnICYgTUtBUlJfT1BFTikge1xuICAgICAgaWYgKHN0YXJ0IDw9IGVuZCkge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpID4gZW5kOyBpLS0pIHtcbiAgICAgICAgICBhcnIucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZmxhZyAmIE1LQVJSX0NMT1NFKSB7XG4gICAgICBpZiAoc3RhcnQgPD0gZW5kKSB7XG4gICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpID49IGVuZDsgaS0tKSB7XG4gICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBzdHIoc3RyLCBsZW4sIHNwcnRyKSB7XG4gICAgaWYgKCFsZW4pIGxlbiA9IDA7XG4gICAgaWYgKHR5cGVvZiBzdHIudG9TdHJpbmcgPT09ICdmdW5jdGlvbicpIHN0ciA9IHN0ci50b1N0cmluZygpO1xuICAgIGlmICghc3BydHIpIHNwcnRyID0gJy4nO1xuICAgIGlmICh+c3RyLmluZGV4T2YoJy4nKSkge1xuICAgICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCBzdHIuaW5kZXhPZignLicpICsgbGVuICsgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsIHN0ci5pbmRleE9mKCcuJykgKyBsZW4pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBzdHJfcGFkKHN0ciArICcuJywgc3RyLmxlbmd0aCArIDEgKyBsZW4sICcwJyk7XG4gICAgfVxuICAgIHJldHVybiBzdHIucmVwbGFjZSgnLicsIHNwcnRyKTtcbiAgfVxuICBmdW5jdGlvbiBzdHJfcmVwbGFjZShzdHIsIHNyYywgcmVwKSB7XG4gICAgd2hpbGUgKH5zdHIuaW5kZXhPZihzcmMpKSB7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZShzcmMsIHJlcCk7XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG4gIH1cbiAgdmFyIFNUUlBBRFJJR0hUID0gMSA8PCAxO1xuICB2YXIgU1RSUEFETEVGVCA9IDIgPDwgMTtcbiAgdmFyIFNUUlBBREJPVEggPSA0IDw8IDE7XG4gIGZ1bmN0aW9uIF9fc3RyX3BhZF9yZXBlYXRlcihzdHIsIGxlbikge1xuICAgIHZhciBjb2xsZWN0ID0gJycsIGk7XG4gICAgd2hpbGUoY29sbGVjdC5sZW5ndGggPCBsZW4pIGNvbGxlY3QgKz0gc3RyO1xuICAgIGNvbGxlY3QgPSBjb2xsZWN0LnN1YnN0cigwLCBsZW4pO1xuICAgIHJldHVybiBjb2xsZWN0O1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9wYWQoc3RyLCBsZW4sIHN1YiwgdHlwZSkge1xuICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHR5cGUgPSBTVFJQQURSSUdIVDtcbiAgICB2YXIgaGFsZiA9ICcnLCBwYWRfdG9fZ287XG4gICAgaWYgKChwYWRfdG9fZ28gPSBsZW4gLSBzdHIubGVuZ3RoKSA+IDApIHtcbiAgICAgIGlmICh0eXBlICYgU1RSUEFETEVGVCkgeyBzdHIgPSBfX3N0cl9wYWRfcmVwZWF0ZXIoc3ViLCBwYWRfdG9fZ28pICsgc3RyOyB9XG4gICAgICBlbHNlIGlmICh0eXBlICYgU1RSUEFEUklHSFQpIHtzdHIgPSBzdHIgKyBfX3N0cl9wYWRfcmVwZWF0ZXIoc3ViLCBwYWRfdG9fZ28pOyB9XG4gICAgICBlbHNlIGlmICh0eXBlICYgU1RSUEFEQk9USCkge1xuICAgICAgICBoYWxmID0gX19zdHJfcGFkX3JlcGVhdGVyKHN1YiwgTWF0aC5jZWlsKHBhZF90b19nby8yKSk7XG4gICAgICAgIHN0ciA9IGhhbGYgKyBzdHIgKyBoYWxmO1xuICAgICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsIGxlbik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX2h0bWxlc2NhcGUoaHRtbCkge1xuICAgIHJldHVybiBodG1sLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxuICAgIC5yZXBsYWNlKC88L2csIFwiJmx0O1wiKVxuICAgIC5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKVxuICAgIC5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKTtcbiAgfVxuICBmdW5jdGlvbiBzdHJfdXBmaXJzdChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnNwbGl0KC9bXFxzXFxuXFx0XSsvKS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLnN1YnN0cigwLCAxKS50b1VwcGVyQ2FzZSgpICsgaXRlbS5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9KS5qb2luKCcgJyk7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX2NhbWVsKHN0cikge1xuICAgIHJldHVybiBzdHIuc3BsaXQoL1tcXHNcXG5cXHRdKy8pLm1hcChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICAgIGlmICghaW5kZXgpIHJldHVybiBpdGVtO1xuICAgICAgcmV0dXJuIGl0ZW0uc3Vic3RyKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBpdGVtLnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICAgIH0pLmpvaW4oJycpO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9rZWJhYihzdHIpIHtcbiAgICByZXR1cm4gc3RyLnNwbGl0KC9bXFxzXFxuXFx0XSsvKS5qb2luKCctJyk7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3ZhbHVlcyhvYmopIHtcbiAgICB2YXIgdmFsdWVzID0gW10sIGk7XG4gICAgZm9yKGkgaW4gb2JqKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIHZhbHVlcy5wdXNoKG9ialtpXSk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuICBmdW5jdGlvbiBhcnJfY29udGFpbihvYmosIHZhbHVlKSB7XG4gICAgaWYodHlwZW9mIG9iai5pbmRleE9mID09PSAnZnVuY3Rpb24nKSByZXR1cm4gb2JqLmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgICB2YXIgaTtcbiAgICBmb3IoaSBpbiBvYmopIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgaWYgKG9ialtpXSA9PT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiBhcnJfbGVuKG9iaikge1xuICAgIGlmKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAndW5kZWZpbmVkJykgcmV0dXJuIG9iai5sZW5ndGg7XG4gICAgdmFyIGksIGxlbmd0aCA9IDA7XG4gICAgZm9yKGkgaW4gb2JqKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGxlbmd0aCsrO1xuICAgIHJldHVybiBsZW5ndGg7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3B1c2goYXJyLCB2YWx1ZSkge1xuICAgIGFyci5wdXNoKHZhbHVlKTtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3Vuc2hpZnQoYXJyLCB2YWx1ZSkge1xuICAgIGFyci51bnNoaWZ0KHZhbHVlKTtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3JhbmQoYXJyLCB2YWx1ZSkge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYXJyKTtcbiAgICByZXR1cm4gYXJyW2tleXNbcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIGFycl9sZW4oYXJyKSAtIDEpXV07XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3NwbGljZShhcnIsIHN0LCBlbiwgZWxzKSB7XG4gICAgdmFyIHBybXMgPSBbc3RdO1xuICAgIGlmICh0eXBlb2YgZW4gIT09ICd1bmRlZmluZWQnKSBwcm1zLnB1c2goZW4pO1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KGFyciwgcHJtcy5jb25jYXQoZWxzKSk7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3BhZChzcmMsIGxlbiwgZWwpIHtcbiAgICB2YXIgaSwgYXJyID0gc3JjLnNsaWNlKDApO1xuICAgIGlmKGxlbiA+IDApIGZvcihpID0gYXJyX2xlbihhcnIpO2kgPCBsZW47aSsrKSBhcnIucHVzaChlbCk7XG4gICAgaWYobGVuIDwgMCkgZm9yKGkgPSBhcnJfbGVuKGFycik7aSA8IC1sZW47aSsrKSBhcnIudW5zaGlmdChlbCk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBhcnJfcmV2ZXJzZShzcmMpIHtcbiAgICB2YXIgYXJyID0gc3JjLnNsaWNlKDApO1xuICAgIGFyci5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBhcnJfc29ydChzcmMpIHtcbiAgICB2YXIgYXJyID0gc3JjLnNsaWNlKDApO1xuICAgIGFyci5zb3J0KCk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBhcnJfc29ydF9yZXZlcnNlKHNyYykge1xuICAgIHZhciBhcnIgPSBzcmMuc2xpY2UoMCk7XG4gICAgYXJyLnNvcnQoKTtcbiAgICBhcnIucmV2ZXJzZSgpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3VuaXF1ZShzcmMpIHtcbiAgICB2YXIgaSwgYXJyID0gW107XG4gICAgZm9yKGkgaW4gc3JjKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNyYywgaSkpIGlmICghfmFyci5pbmRleE9mKHNyY1tpXSkpIGFyci5wdXNoKHNyY1tpXSk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBhcnJfa2V5KGFyciwgdmFsdWUpIHtcbiAgICB2YXIgaTtcbiAgICBmb3IoaSBpbiBhcnIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXJyLCBpKSkgaWYgKHZhbHVlID09IGFycltpXSkgcmV0dXJuIGk7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZShuYW1lLCBhdHRycywgY2IpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSByZXR1cm4gbmFtZTtcbiAgICB2YXIgY2hpbGRzID0gW107XG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykgY2IoY2hpbGRzKTtcbiAgICBpZiAoYXR0cnMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdub2RlJyxcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgYXR0cnM6IGF0dHJzLFxuICAgICAgICBjaGlsZHM6IGNoaWxkcy5maWx0ZXIoZnVuY3Rpb24gKF9jaGlsZCkgeyByZXR1cm4gX2NoaWxkICE9PSBudWxsOyB9KVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBuYW1lLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSBuYW1lID0gbmFtZS50b1N0cmluZygpO1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICB0ZXh0OiBuYW1lXG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKGRhdGEsIGNoaWxkcykge1xuICAgIHZhciBfY2hpbGRzID0gW107XG52YXIgYnVja2V0LCBzb3VyY2VJdGVtO1xudmFyIF9wYXJhbXMwID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEgPSAnJztcbl9hdHRyVmFsdWUxICs9ICdwb3B1cF9faGVhZCc7XG5fcGFyYW1zMFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxO1xuX2F0dHJWYWx1ZTEgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Cd0LDRgdGC0YDQvtC50LrQuCDQuNC30L7QsdGA0LDQttC10L3QuNGPJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuJykpO1xuZGF0YVsnaXNFbXB0eSddID0gIWRhdGFbJ3MzQWNjZXNzS2V5J10ubGVuZ3RoIHx8ICFkYXRhWydzM1NlY3JldEtleSddLmxlbmd0aDtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTtcbnZhciBfcGFyYW1zMiA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzID0gJyc7XG5fcGFyYW1zMlsnYWN0aW9uJ10gPSBfYXR0clZhbHVlMztcbl9hdHRyVmFsdWUzID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0ID0gJyc7XG5fYXR0clZhbHVlNCArPSAnZm9ybSc7XG5fcGFyYW1zMlsnY2xhc3MnXSA9IF9hdHRyVmFsdWU0O1xuX2F0dHJWYWx1ZTQgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTUgPSAnJztcbl9hdHRyVmFsdWU1ICs9ICdjb25maWdzLWZvcm0nO1xuX3BhcmFtczJbJ3JvbGUnXSA9IF9hdHRyVmFsdWU1O1xuX2F0dHJWYWx1ZTUgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdmb3JtJywgX3BhcmFtczIsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zNiA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU3ID0gJyc7XG5fYXR0clZhbHVlNyArPSAnZm9ybV9faXRlbSc7XG5fcGFyYW1zNlsnY2xhc3MnXSA9IF9hdHRyVmFsdWU3O1xuX2F0dHJWYWx1ZTcgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zNiwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczggPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlOSA9ICcnO1xuX2F0dHJWYWx1ZTkgKz0gJ2Zvcm1fX2xhYmVsJztcbl9wYXJhbXM4WydjbGFzcyddID0gX2F0dHJWYWx1ZTk7XG5fYXR0clZhbHVlOSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgX3BhcmFtczgsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQpdGA0LDQvdC40LvQuNGJ0LUnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXMxMCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMSA9ICcnO1xuX2F0dHJWYWx1ZTExICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5fcGFyYW1zMTBbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTE7XG5fYXR0clZhbHVlMTEgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMTAsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczEyID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEzID0gJyc7XG5fYXR0clZhbHVlMTMgKz0gJ3RhYnMnO1xuX3BhcmFtczEyWydjbGFzcyddID0gX2F0dHJWYWx1ZTEzO1xuX2F0dHJWYWx1ZTEzID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczEyLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczE0ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE1ID0gJyc7XG5fYXR0clZhbHVlMTUgKz0gJ2J1dHRvbic7XG5fcGFyYW1zMTRbJ3R5cGUnXSA9IF9hdHRyVmFsdWUxNTtcbl9hdHRyVmFsdWUxNSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTYgPSAnJztcbl9hdHRyVmFsdWUxNiArPSAndGFic19faXRlbSc7XG5pZiAoZGF0YVsnc3RvcmFnZSddID09IFwibG9jYWxcIikge1xuX2F0dHJWYWx1ZTE2ICs9ICcgdGFic19faXRlbS0tYWN0aXZlJztcbn1cbl9wYXJhbXMxNFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxNjtcbl9hdHRyVmFsdWUxNiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTcgPSAnJztcbl9hdHRyVmFsdWUxNyArPSAnY29uZmlncy1pbWFnZS1zdG9yYWdlJztcbl9wYXJhbXMxNFsncm9sZSddID0gX2F0dHJWYWx1ZTE3O1xuX2F0dHJWYWx1ZTE3ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxOCA9ICcnO1xuX2F0dHJWYWx1ZTE4ICs9ICdsb2NhbCc7XG5fcGFyYW1zMTRbJ2RhdGEtdmFsdWUnXSA9IF9hdHRyVmFsdWUxODtcbl9hdHRyVmFsdWUxOCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIF9wYXJhbXMxNCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Cb0L7QutCw0LvRjNC90L7QtScpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXMxOSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyMCA9ICcnO1xuX2F0dHJWYWx1ZTIwICs9ICdidXR0b24nO1xuX3BhcmFtczE5Wyd0eXBlJ10gPSBfYXR0clZhbHVlMjA7XG5fYXR0clZhbHVlMjAgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTIxID0gJyc7XG5fYXR0clZhbHVlMjEgKz0gJ3RhYnNfX2l0ZW0nO1xuaWYgKGRhdGFbJ3N0b3JhZ2UnXSA9PSBcInMzXCIpIHtcbl9hdHRyVmFsdWUyMSArPSAnIHRhYnNfX2l0ZW0tLWFjdGl2ZSc7XG59XG5fcGFyYW1zMTlbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMjE7XG5fYXR0clZhbHVlMjEgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTIyID0gJyc7XG5fYXR0clZhbHVlMjIgKz0gJ2NvbmZpZ3MtaW1hZ2Utc3RvcmFnZSc7XG5fcGFyYW1zMTlbJ3JvbGUnXSA9IF9hdHRyVmFsdWUyMjtcbl9hdHRyVmFsdWUyMiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjMgPSAnJztcbl9hdHRyVmFsdWUyMyArPSAnczMnO1xuX3BhcmFtczE5WydkYXRhLXZhbHVlJ10gPSBfYXR0clZhbHVlMjM7XG5fYXR0clZhbHVlMjMgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBfcGFyYW1zMTksIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdTMycpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xudmFyIF9wYXJhbXMyNCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyNSA9ICcnO1xuX2F0dHJWYWx1ZTI1ICs9ICdjb25maWdzLWltYWdlLW1vZGFsLXN0b3JhZ2UtbG9jYWwgY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLWZyYW1lJztcbl9wYXJhbXMyNFsncm9sZSddID0gX2F0dHJWYWx1ZTI1O1xuX2F0dHJWYWx1ZTI1ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyNiA9ICcnO1xuaWYgKGRhdGFbJ3N0b3JhZ2UnXSAhPSBcImxvY2FsXCIpIHtcbl9hdHRyVmFsdWUyNiArPSAnZGlzcGxheTogbm9uZSc7XG5fcGFyYW1zMjRbJ3N0eWxlJ10gPSBfYXR0clZhbHVlMjY7XG5fYXR0clZhbHVlMjYgPSAnJztcbn1cbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMjQsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXMyNyA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyOCA9ICcnO1xuX2F0dHJWYWx1ZTI4ICs9ICdmb3JtX19pdGVtJztcbl9wYXJhbXMyN1snY2xhc3MnXSA9IF9hdHRyVmFsdWUyODtcbl9hdHRyVmFsdWUyOCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMyNywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbnZhciBfcGFyYW1zMjkgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzAgPSAnJztcbl9hdHRyVmFsdWUzMCArPSAnY29uZmlncy1pbWFnZS1wYXRoJztcbl9wYXJhbXMyOVsnZm9yJ10gPSBfYXR0clZhbHVlMzA7XG5fYXR0clZhbHVlMzAgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTMxID0gJyc7XG5fYXR0clZhbHVlMzEgKz0gJ2Zvcm1fX2xhYmVsJztcbl9wYXJhbXMyOVsnY2xhc3MnXSA9IF9hdHRyVmFsdWUzMTtcbl9hdHRyVmFsdWUzMSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgX3BhcmFtczI5LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0J/Rg9GC0YwnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczMyID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTMzID0gJyc7XG5fYXR0clZhbHVlMzMgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbl9wYXJhbXMzMlsnY2xhc3MnXSA9IF9hdHRyVmFsdWUzMztcbl9hdHRyVmFsdWUzMyA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMzMiwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXMzNCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzNSA9ICcnO1xuX2F0dHJWYWx1ZTM1ICs9ICd0ZXh0Jztcbl9wYXJhbXMzNFsndHlwZSddID0gX2F0dHJWYWx1ZTM1O1xuX2F0dHJWYWx1ZTM1ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzNiA9ICcnO1xuX2F0dHJWYWx1ZTM2ICs9ICdmb3JtX19pbnAnO1xuX3BhcmFtczM0WydjbGFzcyddID0gX2F0dHJWYWx1ZTM2O1xuX2F0dHJWYWx1ZTM2ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzNyA9ICcnO1xuX2F0dHJWYWx1ZTM3ICs9IGRhdGFbJ3BhdGgnXTtcbl9wYXJhbXMzNFsndmFsdWUnXSA9IF9hdHRyVmFsdWUzNztcbl9hdHRyVmFsdWUzNyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzggPSAnJztcbl9hdHRyVmFsdWUzOCArPSAnY29uZmlncy1pbWFnZS1wYXRoJztcbl9wYXJhbXMzNFsncm9sZSddID0gX2F0dHJWYWx1ZTM4O1xuX2F0dHJWYWx1ZTM4ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzOSA9ICcnO1xuX2F0dHJWYWx1ZTM5ICs9ICdjb25maWdzLWltYWdlLXBhdGgnO1xuX3BhcmFtczM0WydpZCddID0gX2F0dHJWYWx1ZTM5O1xuX2F0dHJWYWx1ZTM5ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBfcGFyYW1zMzQpKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xuaWYgKGRhdGFbJ3BhdGhFcnJvciddKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICAgJykpO1xudmFyIF9wYXJhbXM0MCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0MSA9ICcnO1xuX2F0dHJWYWx1ZTQxICs9ICdmb3JtX19lcnJvcic7XG5fcGFyYW1zNDBbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNDE7XG5fYXR0clZhbHVlNDEgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdzcGFuJywgX3BhcmFtczQwLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZShkYXRhWydwYXRoRXJyb3InXSkpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zNDIgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDMgPSAnJztcbl9hdHRyVmFsdWU0MyArPSAnY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLXMzIGNvbmZpZ3MtaW1hZ2UtbW9kYWwtc3RvcmFnZS1mcmFtZSc7XG5fcGFyYW1zNDJbJ3JvbGUnXSA9IF9hdHRyVmFsdWU0Mztcbl9hdHRyVmFsdWU0MyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDQgPSAnJztcbmlmIChkYXRhWydzdG9yYWdlJ10gIT0gXCJzM1wiKSB7XG5fYXR0clZhbHVlNDQgKz0gJ2Rpc3BsYXk6IG5vbmUnO1xuX3BhcmFtczQyWydzdHlsZSddID0gX2F0dHJWYWx1ZTQ0O1xuX2F0dHJWYWx1ZTQ0ID0gJyc7XG59XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczQyLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zNDUgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDYgPSAnJztcbl9hdHRyVmFsdWU0NiArPSAnZm9ybV9faXRlbSc7XG5fcGFyYW1zNDVbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNDY7XG5fYXR0clZhbHVlNDYgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zNDUsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczQ3ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ4ID0gJyc7XG5fYXR0clZhbHVlNDggKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYWNjZXNzLWtleSc7XG5fcGFyYW1zNDdbJ2ZvciddID0gX2F0dHJWYWx1ZTQ4O1xuX2F0dHJWYWx1ZTQ4ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0OSA9ICcnO1xuX2F0dHJWYWx1ZTQ5ICs9ICdmb3JtX19sYWJlbCc7XG5fcGFyYW1zNDdbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNDk7XG5fYXR0clZhbHVlNDkgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXM0NywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ0FjY2VzcyBrZXknKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczUwID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTUxID0gJyc7XG5fYXR0clZhbHVlNTEgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbl9wYXJhbXM1MFsnY2xhc3MnXSA9IF9hdHRyVmFsdWU1MTtcbl9hdHRyVmFsdWU1MSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM1MCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXM1MiA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1MyA9ICcnO1xuX2F0dHJWYWx1ZTUzICs9ICd0ZXh0Jztcbl9wYXJhbXM1MlsndHlwZSddID0gX2F0dHJWYWx1ZTUzO1xuX2F0dHJWYWx1ZTUzID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1NCA9ICcnO1xuX2F0dHJWYWx1ZTU0ICs9ICdmb3JtX19pbnAnO1xuX3BhcmFtczUyWydjbGFzcyddID0gX2F0dHJWYWx1ZTU0O1xuX2F0dHJWYWx1ZTU0ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1NSA9ICcnO1xuX2F0dHJWYWx1ZTU1ICs9IGRhdGFbJ3MzQWNjZXNzS2V5J107XG5fcGFyYW1zNTJbJ3ZhbHVlJ10gPSBfYXR0clZhbHVlNTU7XG5fYXR0clZhbHVlNTUgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTU2ID0gJyc7XG5fYXR0clZhbHVlNTYgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYWNjZXNzLWtleSc7XG5fcGFyYW1zNTJbJ3JvbGUnXSA9IF9hdHRyVmFsdWU1Njtcbl9hdHRyVmFsdWU1NiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNTcgPSAnJztcbl9hdHRyVmFsdWU1NyArPSAnY29uZmlncy1pbWFnZS1zMy1hY2Nlc3Mta2V5Jztcbl9wYXJhbXM1MlsnaWQnXSA9IF9hdHRyVmFsdWU1Nztcbl9hdHRyVmFsdWU1NyA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgX3BhcmFtczUyKSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zNTggPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNTkgPSAnJztcbl9hdHRyVmFsdWU1OSArPSAnZm9ybV9faXRlbSc7XG5fcGFyYW1zNThbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNTk7XG5fYXR0clZhbHVlNTkgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zNTgsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczYwID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTYxID0gJyc7XG5fYXR0clZhbHVlNjEgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtc2VjcmV0LWtleSc7XG5fcGFyYW1zNjBbJ2ZvciddID0gX2F0dHJWYWx1ZTYxO1xuX2F0dHJWYWx1ZTYxID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU2MiA9ICcnO1xuX2F0dHJWYWx1ZTYyICs9ICdmb3JtX19sYWJlbCc7XG5fcGFyYW1zNjBbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNjI7XG5fYXR0clZhbHVlNjIgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXM2MCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1NlY3JldCBrZXknKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczYzID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTY0ID0gJyc7XG5fYXR0clZhbHVlNjQgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbl9wYXJhbXM2M1snY2xhc3MnXSA9IF9hdHRyVmFsdWU2NDtcbl9hdHRyVmFsdWU2NCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM2MywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXM2NSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU2NiA9ICcnO1xuX2F0dHJWYWx1ZTY2ICs9ICdwYXNzd29yZCc7XG5fcGFyYW1zNjVbJ3R5cGUnXSA9IF9hdHRyVmFsdWU2Njtcbl9hdHRyVmFsdWU2NiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNjcgPSAnJztcbl9hdHRyVmFsdWU2NyArPSAnZm9ybV9faW5wJztcbl9wYXJhbXM2NVsnY2xhc3MnXSA9IF9hdHRyVmFsdWU2Nztcbl9hdHRyVmFsdWU2NyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNjggPSAnJztcbl9wYXJhbXM2NVsndmFsdWUnXSA9IF9hdHRyVmFsdWU2ODtcbl9hdHRyVmFsdWU2OCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNjkgPSAnJztcbl9hdHRyVmFsdWU2OSArPSAnY29uZmlncy1pbWFnZS1zMy1zZWNyZXQta2V5Jztcbl9wYXJhbXM2NVsncm9sZSddID0gX2F0dHJWYWx1ZTY5O1xuX2F0dHJWYWx1ZTY5ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU3MCA9ICcnO1xuX2F0dHJWYWx1ZTcwICs9ICdjb25maWdzLWltYWdlLXMzLXNlY3JldC1rZXknO1xuX3BhcmFtczY1WydpZCddID0gX2F0dHJWYWx1ZTcwO1xuX2F0dHJWYWx1ZTcwID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBfcGFyYW1zNjUpKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXM3MSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU3MiA9ICcnO1xuX2F0dHJWYWx1ZTcyICs9ICdmb3JtX19pdGVtJztcbl9wYXJhbXM3MVsnY2xhc3MnXSA9IF9hdHRyVmFsdWU3Mjtcbl9hdHRyVmFsdWU3MiA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM3MSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbnZhciBfcGFyYW1zNzMgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNzQgPSAnJztcbl9hdHRyVmFsdWU3NCArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuX3BhcmFtczczWydjbGFzcyddID0gX2F0dHJWYWx1ZTc0O1xuX2F0dHJWYWx1ZTc0ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczczLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczc1ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTc2ID0gJyc7XG5fYXR0clZhbHVlNzYgKz0gJ2J1dHRvbic7XG5fcGFyYW1zNzVbJ3R5cGUnXSA9IF9hdHRyVmFsdWU3Njtcbl9hdHRyVmFsdWU3NiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNzcgPSAnJztcbl9hdHRyVmFsdWU3NyArPSAnZm9ybV9fYnRuJztcbl9wYXJhbXM3NVsnY2xhc3MnXSA9IF9hdHRyVmFsdWU3Nztcbl9hdHRyVmFsdWU3NyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNzggPSAnJztcbl9hdHRyVmFsdWU3OCArPSAndGVzdC1jb25uZWN0aW9uLXMzJztcbl9wYXJhbXM3NVsncm9sZSddID0gX2F0dHJWYWx1ZTc4O1xuX2F0dHJWYWx1ZTc4ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU3OSA9ICcnO1xuaWYgKGRhdGFbJ2lzRW1wdHknXSB8fCBkYXRhWydzM2F1dGgnXSB8fCBkYXRhWydzM2NoZWNraW5nJ10pIHtcbl9wYXJhbXM3NVsnZGlzYWJsZWQnXSA9IF9hdHRyVmFsdWU3OTtcbl9hdHRyVmFsdWU3OSA9ICcnO1xufVxufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIF9wYXJhbXM3NSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG5pZiAoZGF0YVsnczNjaGVja2luZyddKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICAgICDQodC+0LXQtNC40L3QtdC90LjQtS4uLlxcbiAgICAgICAgICAnKSk7XG59IGVsc2UgaWYgKGRhdGFbJ3MzYXV0aCddKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICAgICDQk9C+0YLQvtCy0L5cXG4gICAgICAgICAgJykpO1xufSBlbHNlIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAgINCf0L7QtNC60LvRjtGH0LjRgtGM0YHRj1xcbiAgICAgICAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xuaWYgKGRhdGFbJ3MzYXV0aCddKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczgwID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTgxID0gJyc7XG5fYXR0clZhbHVlODEgKz0gJ2Zvcm1fX2l0ZW0nO1xuX3BhcmFtczgwWydjbGFzcyddID0gX2F0dHJWYWx1ZTgxO1xuX2F0dHJWYWx1ZTgxID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczgwLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczgyID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTgzID0gJyc7XG5fYXR0clZhbHVlODMgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYnVja2V0Jztcbl9wYXJhbXM4MlsnZm9yJ10gPSBfYXR0clZhbHVlODM7XG5fYXR0clZhbHVlODMgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTg0ID0gJyc7XG5fYXR0clZhbHVlODQgKz0gJ2Zvcm1fX2xhYmVsJztcbl9wYXJhbXM4MlsnY2xhc3MnXSA9IF9hdHRyVmFsdWU4NDtcbl9hdHRyVmFsdWU4NCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgX3BhcmFtczgyLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnQnVja2V0JykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczg1ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTg2ID0gJyc7XG5fYXR0clZhbHVlODYgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbl9wYXJhbXM4NVsnY2xhc3MnXSA9IF9hdHRyVmFsdWU4Njtcbl9hdHRyVmFsdWU4NiA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM4NSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xuaWYgKGFycl9sZW4oZGF0YVsnYnVja2V0cyddKSkge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICcpKTtcbnZhciBfcGFyYW1zODcgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlODggPSAnJztcbl9hdHRyVmFsdWU4OCArPSAnZm9ybV9fc2VsZWN0Jztcbl9wYXJhbXM4N1snY2xhc3MnXSA9IF9hdHRyVmFsdWU4ODtcbl9hdHRyVmFsdWU4OCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgX3BhcmFtczg3LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICAgJykpO1xudmFyIF9wYXJhbXM4OSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU5MCA9ICcnO1xuX2F0dHJWYWx1ZTkwICs9ICdjb25maWdzLWltYWdlLXMzLWJ1Y2tldCc7XG5fcGFyYW1zODlbJ3JvbGUnXSA9IF9hdHRyVmFsdWU5MDtcbl9hdHRyVmFsdWU5MCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlOTEgPSAnJztcbl9hdHRyVmFsdWU5MSArPSAnY29uZmlncy1pbWFnZS1zMy1idWNrZXQnO1xuX3BhcmFtczg5WydpZCddID0gX2F0dHJWYWx1ZTkxO1xuX2F0dHJWYWx1ZTkxID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnc2VsZWN0JywgX3BhcmFtczg5LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICAgICAnKSk7XG52YXIgX2FycjkyID0gZGF0YVsnYnVja2V0cyddO1xuZm9yIChkYXRhWydidWNrZXQnXSBpbiBfYXJyOTIpIHtcbmRhdGFbJ2J1Y2tldCddID0gX2FycjkyW2RhdGFbJ2J1Y2tldCddXTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAgICAgICAnKSk7XG52YXIgX3BhcmFtczkzID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTk0ID0gJyc7XG5fYXR0clZhbHVlOTQgKz0gZGF0YVsnYnVja2V0J107XG5fcGFyYW1zOTNbJ3ZhbHVlJ10gPSBfYXR0clZhbHVlOTQ7XG5fYXR0clZhbHVlOTQgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTk1ID0gJyc7XG5pZiAoZGF0YVsnczNCdWNrZXQnXSA9PSBkYXRhWydidWNrZXQnXSkge1xuX3BhcmFtczkzWydzZWxlY3RlZCddID0gX2F0dHJWYWx1ZTk1O1xuX2F0dHJWYWx1ZTk1ID0gJyc7XG59XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnb3B0aW9uJywgX3BhcmFtczkzLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZShkYXRhWydidWNrZXQnXSkpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG59IGVsc2Uge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICcpKTtcbnZhciBfcGFyYW1zOTYgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlOTcgPSAnJztcbl9hdHRyVmFsdWU5NyArPSAndGV4dCc7XG5fcGFyYW1zOTZbJ3R5cGUnXSA9IF9hdHRyVmFsdWU5Nztcbl9hdHRyVmFsdWU5NyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlOTggPSAnJztcbl9hdHRyVmFsdWU5OCArPSAnZm9ybV9faW5wJztcbl9wYXJhbXM5NlsnY2xhc3MnXSA9IF9hdHRyVmFsdWU5ODtcbl9hdHRyVmFsdWU5OCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlOTkgPSAnJztcbl9hdHRyVmFsdWU5OSArPSBkYXRhWydzM0J1Y2tldCddO1xuX3BhcmFtczk2Wyd2YWx1ZSddID0gX2F0dHJWYWx1ZTk5O1xuX2F0dHJWYWx1ZTk5ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMDAgPSAnJztcbl9hdHRyVmFsdWUxMDAgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYnVja2V0Jztcbl9wYXJhbXM5Nlsncm9sZSddID0gX2F0dHJWYWx1ZTEwMDtcbl9hdHRyVmFsdWUxMDAgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEwMSA9ICcnO1xuX2F0dHJWYWx1ZTEwMSArPSAnY29uZmlncy1pbWFnZS1zMy1idWNrZXQnO1xuX3BhcmFtczk2WydpZCddID0gX2F0dHJWYWx1ZTEwMTtcbl9hdHRyVmFsdWUxMDEgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIF9wYXJhbXM5NikpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbnZhciBfcGFyYW1zMTAyID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEwMyA9ICcnO1xuX2F0dHJWYWx1ZTEwMyArPSAnZm9ybV9faXRlbSc7XG5fcGFyYW1zMTAyWydjbGFzcyddID0gX2F0dHJWYWx1ZTEwMztcbl9hdHRyVmFsdWUxMDMgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMTAyLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczEwNCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMDUgPSAnJztcbl9hdHRyVmFsdWUxMDUgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtcGF0aCc7XG5fcGFyYW1zMTA0Wydmb3InXSA9IF9hdHRyVmFsdWUxMDU7XG5fYXR0clZhbHVlMTA1ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMDYgPSAnJztcbl9hdHRyVmFsdWUxMDYgKz0gJ2Zvcm1fX2xhYmVsJztcbl9wYXJhbXMxMDRbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTA2O1xuX2F0dHJWYWx1ZTEwNiA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgX3BhcmFtczEwNCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Cf0YPRgtGMJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczEwNyA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMDggPSAnJztcbl9hdHRyVmFsdWUxMDggKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbl9wYXJhbXMxMDdbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTA4O1xuX2F0dHJWYWx1ZTEwOCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMxMDcsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICAgJykpO1xudmFyIF9wYXJhbXMxMDkgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTEwID0gJyc7XG5fYXR0clZhbHVlMTEwICs9ICd0ZXh0Jztcbl9wYXJhbXMxMDlbJ3R5cGUnXSA9IF9hdHRyVmFsdWUxMTA7XG5fYXR0clZhbHVlMTEwID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMTEgPSAnJztcbl9hdHRyVmFsdWUxMTEgKz0gJ2Zvcm1fX2lucCc7XG5fcGFyYW1zMTA5WydjbGFzcyddID0gX2F0dHJWYWx1ZTExMTtcbl9hdHRyVmFsdWUxMTEgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTExMiA9ICcnO1xuX2F0dHJWYWx1ZTExMiArPSBkYXRhWydzM1BhdGgnXTtcbl9wYXJhbXMxMDlbJ3ZhbHVlJ10gPSBfYXR0clZhbHVlMTEyO1xuX2F0dHJWYWx1ZTExMiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTEzID0gJyc7XG5fYXR0clZhbHVlMTEzICs9ICdjb25maWdzLWltYWdlLXMzLXBhdGgnO1xuX3BhcmFtczEwOVsncm9sZSddID0gX2F0dHJWYWx1ZTExMztcbl9hdHRyVmFsdWUxMTMgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTExNCA9ICcnO1xuX2F0dHJWYWx1ZTExNCArPSAnY29uZmlncy1pbWFnZS1zMy1wYXRoJztcbl9wYXJhbXMxMDlbJ2lkJ10gPSBfYXR0clZhbHVlMTE0O1xuX2F0dHJWYWx1ZTExNCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgX3BhcmFtczEwOSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufVxuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zMTE1ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTExNiA9ICcnO1xuX2F0dHJWYWx1ZTExNiArPSAnZm9ybV9faXRlbSc7XG5fcGFyYW1zMTE1WydjbGFzcyddID0gX2F0dHJWYWx1ZTExNjtcbl9hdHRyVmFsdWUxMTYgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMTE1LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zMTE3ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTExOCA9ICcnO1xuX2F0dHJWYWx1ZTExOCArPSAnY29uZmlncy1pbWFnZS13aWR0aCc7XG5fcGFyYW1zMTE3Wydmb3InXSA9IF9hdHRyVmFsdWUxMTg7XG5fYXR0clZhbHVlMTE4ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMTkgPSAnJztcbl9hdHRyVmFsdWUxMTkgKz0gJ2Zvcm1fX2xhYmVsJztcbl9wYXJhbXMxMTdbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTE5O1xuX2F0dHJWYWx1ZTExOSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgX3BhcmFtczExNywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Cj0LzQtdC90YzRiNC40YLRjCDQtNC+INC30LDQtNCw0L3QvdGL0YUg0YDQsNC30LzQtdGA0L7QsicpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczEyMCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMjEgPSAnJztcbl9hdHRyVmFsdWUxMjEgKz0gJ2Zvcm1fX2lucC1jb250YWluIGZvcm1fX2lucC1jb250YWluLS1mdWxsLXdpZHRoJztcbl9wYXJhbXMxMjBbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTIxO1xuX2F0dHJWYWx1ZTEyMSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMxMjAsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczEyMiA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMjMgPSAnJztcbl9hdHRyVmFsdWUxMjMgKz0gJ3RleHQnO1xuX3BhcmFtczEyMlsndHlwZSddID0gX2F0dHJWYWx1ZTEyMztcbl9hdHRyVmFsdWUxMjMgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEyNCA9ICcnO1xuX2F0dHJWYWx1ZTEyNCArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG5fcGFyYW1zMTIyWydjbGFzcyddID0gX2F0dHJWYWx1ZTEyNDtcbl9hdHRyVmFsdWUxMjQgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEyNSA9ICcnO1xuX2F0dHJWYWx1ZTEyNSArPSBkYXRhWyd3aWR0aCddO1xuX3BhcmFtczEyMlsndmFsdWUnXSA9IF9hdHRyVmFsdWUxMjU7XG5fYXR0clZhbHVlMTI1ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMjYgPSAnJztcbl9hdHRyVmFsdWUxMjYgKz0gJ2NvbmZpZ3MtaW1hZ2Utd2lkdGgnO1xuX3BhcmFtczEyMlsncm9sZSddID0gX2F0dHJWYWx1ZTEyNjtcbl9hdHRyVmFsdWUxMjYgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEyNyA9ICcnO1xuX2F0dHJWYWx1ZTEyNyArPSAnY29uZmlncy1pbWFnZS13aWR0aCc7XG5fcGFyYW1zMTIyWydpZCddID0gX2F0dHJWYWx1ZTEyNztcbl9hdHRyVmFsdWUxMjcgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIF9wYXJhbXMxMjIpKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcblxcbiAgICAgICcpKTtcbnZhciBfcGFyYW1zMTI4ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEyOSA9ICcnO1xuX2F0dHJWYWx1ZTEyOSArPSAnZm9ybV9fYmV0d2Vlbi1pbnAnO1xuX3BhcmFtczEyOFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxMjk7XG5fYXR0clZhbHVlMTI5ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnc3BhbicsIF9wYXJhbXMxMjgsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfDlycpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcblxcbiAgICAgICcpKTtcbnZhciBfcGFyYW1zMTMwID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEzMSA9ICcnO1xuX2F0dHJWYWx1ZTEzMSArPSAndGV4dCc7XG5fcGFyYW1zMTMwWyd0eXBlJ10gPSBfYXR0clZhbHVlMTMxO1xuX2F0dHJWYWx1ZTEzMSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTMyID0gJyc7XG5fYXR0clZhbHVlMTMyICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS12ZXJ5LXNob3J0Jztcbl9wYXJhbXMxMzBbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTMyO1xuX2F0dHJWYWx1ZTEzMiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTMzID0gJyc7XG5fYXR0clZhbHVlMTMzICs9IGRhdGFbJ2hlaWdodCddO1xuX3BhcmFtczEzMFsndmFsdWUnXSA9IF9hdHRyVmFsdWUxMzM7XG5fYXR0clZhbHVlMTMzID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMzQgPSAnJztcbl9hdHRyVmFsdWUxMzQgKz0gJ2NvbmZpZ3MtaW1hZ2UtaGVpZ2h0Jztcbl9wYXJhbXMxMzBbJ3JvbGUnXSA9IF9hdHRyVmFsdWUxMzQ7XG5fYXR0clZhbHVlMTM0ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBfcGFyYW1zMTMwKSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG5cXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczEzNSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMzYgPSAnJztcbl9hdHRyVmFsdWUxMzYgKz0gJ2Zvcm1fX2hpbnQnO1xuX3BhcmFtczEzNVsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxMzY7XG5fYXR0clZhbHVlMTM2ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMzcgPSAnJztcbl9hdHRyVmFsdWUxMzcgKz0gZGF0YVsnc2F2ZVJhdGlvJ107XG5fcGFyYW1zMTM1WydkYXRhLWNoZWNrZWQnXSA9IF9hdHRyVmFsdWUxMzc7XG5fYXR0clZhbHVlMTM3ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczEzNSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXMxMzggPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTM5ID0gJyc7XG5fYXR0clZhbHVlMTM5ICs9ICdmb3JtX19jaGVja2JveCc7XG5fcGFyYW1zMTM4WydjbGFzcyddID0gX2F0dHJWYWx1ZTEzOTtcbl9hdHRyVmFsdWUxMzkgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE0MCA9ICcnO1xuX2F0dHJWYWx1ZTE0MCArPSAnY2hlY2tib3gnO1xuX3BhcmFtczEzOFsndHlwZSddID0gX2F0dHJWYWx1ZTE0MDtcbl9hdHRyVmFsdWUxNDAgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE0MSA9ICcnO1xuX2F0dHJWYWx1ZTE0MSArPSAnY29uZmlncy1pbWFnZS1zYXZlLXJhdGlvJztcbl9wYXJhbXMxMzhbJ3JvbGUnXSA9IF9hdHRyVmFsdWUxNDE7XG5fYXR0clZhbHVlMTQxID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNDIgPSAnJztcbl9hdHRyVmFsdWUxNDIgKz0gJ2NvbmZpZ3MtaW1hZ2Utc2F2ZS1yYXRpbyc7XG5fcGFyYW1zMTM4WydpZCddID0gX2F0dHJWYWx1ZTE0Mjtcbl9hdHRyVmFsdWUxNDIgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE0MyA9ICcnO1xuaWYgKGRhdGFbJ3NhdmVSYXRpbyddKSB7XG5fcGFyYW1zMTM4WydjaGVja2VkJ10gPSBfYXR0clZhbHVlMTQzO1xuX2F0dHJWYWx1ZTE0MyA9ICcnO1xufVxufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgX3BhcmFtczEzOCkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczE0NCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNDUgPSAnJztcbl9hdHRyVmFsdWUxNDUgKz0gJ2Zvcm1fX2NoZWNrYm94LWxhYmVsJztcbl9wYXJhbXMxNDRbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTQ1O1xuX2F0dHJWYWx1ZTE0NSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTQ2ID0gJyc7XG5fYXR0clZhbHVlMTQ2ICs9ICdjb25maWdzLWltYWdlLXNhdmUtcmF0aW8nO1xuX3BhcmFtczE0NFsnZm9yJ10gPSBfYXR0clZhbHVlMTQ2O1xuX2F0dHJWYWx1ZTE0NiA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgX3BhcmFtczE0NCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcblxcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXMxNDcgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTQ4ID0gJyc7XG5fYXR0clZhbHVlMTQ4ICs9ICdmb3JtX19sYWJlbC10ZXh0Jztcbl9wYXJhbXMxNDdbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTQ4O1xuX2F0dHJWYWx1ZTE0OCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTQ5ID0gJyc7XG5fYXR0clZhbHVlMTQ5ICs9ICdjb25maWdzLWltYWdlLXNhdmUtcmF0aW8nO1xuX3BhcmFtczE0N1snZm9yJ10gPSBfYXR0clZhbHVlMTQ5O1xuX2F0dHJWYWx1ZTE0OSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgX3BhcmFtczE0NywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Ch0L7RhdGA0LDQvdC40YLRjCDQv9GA0L7Qv9C+0YDRhtC40LgnKSk7XG52YXIgX3BhcmFtczE1MCA9IHt9O1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnYnInLCBfcGFyYW1zMTUwKSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQv9GA0LjCoNGD0LzQtdC90YzRiNC10L3QuNC4JykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG52YXIgX3BhcmFtczE1MSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNTIgPSAnJztcbl9hdHRyVmFsdWUxNTIgKz0gJ2Zvcm1fX2l0ZW0nO1xuX3BhcmFtczE1MVsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxNTI7XG5fYXR0clZhbHVlMTUyID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczE1MSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczE1MyA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNTQgPSAnJztcbl9hdHRyVmFsdWUxNTQgKz0gJ2Zvcm1fX2lucC1jb250YWluIGZvcm1fX2lucC1jb250YWluLS1mdWxsLXdpZHRoJztcbl9wYXJhbXMxNTNbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTU0O1xuX2F0dHJWYWx1ZTE1NCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMxNTMsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zMTU1ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE1NiA9ICcnO1xuX2F0dHJWYWx1ZTE1NiArPSAnZm9ybV9faXRlbSc7XG5fcGFyYW1zMTU1WydjbGFzcyddID0gX2F0dHJWYWx1ZTE1Njtcbl9hdHRyVmFsdWUxNTYgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE1NyA9ICcnO1xuaWYgKCFhcnJfbGVuKGRhdGFbJ3NvdXJjZXMnXSkpIHtcbl9hdHRyVmFsdWUxNTcgKz0gJ2Rpc3BsYXk6IG5vbmUnO1xuX3BhcmFtczE1NVsnc3R5bGUnXSA9IF9hdHRyVmFsdWUxNTc7XG5fYXR0clZhbHVlMTU3ID0gJyc7XG59XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczE1NSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczE1OCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNTkgPSAnJztcbl9hdHRyVmFsdWUxNTkgKz0gJ2NvbmZpZ3MtaW1hZ2Utc291cmNlJztcbl9wYXJhbXMxNThbJ2ZvciddID0gX2F0dHJWYWx1ZTE1OTtcbl9hdHRyVmFsdWUxNTkgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE2MCA9ICcnO1xuX2F0dHJWYWx1ZTE2MCArPSAnZm9ybV9fbGFiZWwnO1xuX3BhcmFtczE1OFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxNjA7XG5fYXR0clZhbHVlMTYwID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBfcGFyYW1zMTU4LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0JjRgdGC0L7Rh9C90LjQuicpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczE2MSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNjIgPSAnJztcbl9hdHRyVmFsdWUxNjIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbl9wYXJhbXMxNjFbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTYyO1xuX2F0dHJWYWx1ZTE2MiA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMxNjEsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczE2MyA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNjQgPSAnJztcbl9hdHRyVmFsdWUxNjQgKz0gJ2Zvcm1fX3NlbGVjdCc7XG5fcGFyYW1zMTYzWydjbGFzcyddID0gX2F0dHJWYWx1ZTE2NDtcbl9hdHRyVmFsdWUxNjQgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXMxNjMsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbnZhciBfcGFyYW1zMTY1ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE2NiA9ICcnO1xuX2F0dHJWYWx1ZTE2NiArPSAnY29uZmlncy1pbWFnZS1zb3VyY2UnO1xuX3BhcmFtczE2NVsncm9sZSddID0gX2F0dHJWYWx1ZTE2Njtcbl9hdHRyVmFsdWUxNjYgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE2NyA9ICcnO1xuX2F0dHJWYWx1ZTE2NyArPSAnY29uZmlncy1pbWFnZS1zb3VyY2UnO1xuX3BhcmFtczE2NVsnaWQnXSA9IF9hdHRyVmFsdWUxNjc7XG5fYXR0clZhbHVlMTY3ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnc2VsZWN0JywgX3BhcmFtczE2NSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG52YXIgX3BhcmFtczE2OCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNjkgPSAnJztcbl9hdHRyVmFsdWUxNjkgKz0gJ3VwbG9hZCc7XG5fcGFyYW1zMTY4Wyd2YWx1ZSddID0gX2F0dHJWYWx1ZTE2OTtcbl9hdHRyVmFsdWUxNjkgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE3MCA9ICcnO1xuaWYgKGRhdGFbJ3NvdXJjZSddID09IFwidXBsb2FkXCIpIHtcbl9wYXJhbXMxNjhbJ3NlbGVjdGVkJ10gPSBfYXR0clZhbHVlMTcwO1xuX2F0dHJWYWx1ZTE3MCA9ICcnO1xufVxufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ29wdGlvbicsIF9wYXJhbXMxNjgsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQl9Cw0LPRgNGD0LfQuNGC0Ywg0LjQt9C+0LHRgNCw0LbQtdC90LjQtScpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG5pZiAoYXJyX2xlbihkYXRhWydzb3VyY2VzJ10pKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICAgICAnKSk7XG52YXIgX2FycjE3MSA9IGRhdGFbJ3NvdXJjZXMnXTtcbmZvciAoZGF0YVsnc291cmNlSXRlbSddIGluIF9hcnIxNzEpIHtcbmRhdGFbJ3NvdXJjZUl0ZW0nXSA9IF9hcnIxNzFbZGF0YVsnc291cmNlSXRlbSddXTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAgICAgJykpO1xudmFyIF9wYXJhbXMxNzIgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTczID0gJyc7XG5fYXR0clZhbHVlMTczICs9IGRhdGFbJ3NvdXJjZUl0ZW0nXVtcImFsaWFzXCJdO1xuX3BhcmFtczE3MlsndmFsdWUnXSA9IF9hdHRyVmFsdWUxNzM7XG5fYXR0clZhbHVlMTczID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNzQgPSAnJztcbmlmIChkYXRhWydzb3VyY2UnXSA9PSBkYXRhWydzb3VyY2VJdGVtJ11bXCJhbGlhc1wiXSkge1xuX3BhcmFtczE3Mlsnc2VsZWN0ZWQnXSA9IF9hdHRyVmFsdWUxNzQ7XG5fYXR0clZhbHVlMTc0ID0gJyc7XG59XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnb3B0aW9uJywgX3BhcmFtczE3MiwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoZGF0YVsnc291cmNlSXRlbSddW1wibGFiZWxcIl0pKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAgICcpKTtcbn1cbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xudmFyIF9wYXJhbXMxNzUgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTc2ID0gJyc7XG5fYXR0clZhbHVlMTc2ICs9ICdmb3JtX19zdWJtaXQnO1xuX3BhcmFtczE3NVsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxNzY7XG5fYXR0clZhbHVlMTc2ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczE3NSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczE3NyA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNzggPSAnJztcbl9hdHRyVmFsdWUxNzggKz0gJ2Zvcm1fX2J0biBmb3JtX19idG4tLXN1Ym1pdCc7XG5fcGFyYW1zMTc3WydjbGFzcyddID0gX2F0dHJWYWx1ZTE3ODtcbl9hdHRyVmFsdWUxNzggPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE3OSA9ICcnO1xuaWYgKChkYXRhWydzdG9yYWdlJ10gPT0gXCJsb2NhbFwiICYmIGRhdGFbJ3BhdGhFcnJvciddKSB8fCAoZGF0YVsnc3RvcmFnZSddID09IFwiczNcIiAmJiAoIWRhdGFbJ3MzYXV0aCddKSkpIHtcbl9wYXJhbXMxNzdbJ2Rpc2FibGVkJ10gPSBfYXR0clZhbHVlMTc5O1xuX2F0dHJWYWx1ZTE3OSA9ICcnO1xufVxufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIF9wYXJhbXMxNzcsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQodC+0YXRgNCw0L3QuNGC0YwnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXMxODAgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTgxID0gJyc7XG5fYXR0clZhbHVlMTgxICs9ICdidXR0b24nO1xuX3BhcmFtczE4MFsndHlwZSddID0gX2F0dHJWYWx1ZTE4MTtcbl9hdHRyVmFsdWUxODEgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE4MiA9ICcnO1xuX2F0dHJWYWx1ZTE4MiArPSAnZm9ybV9fYnRuIHBvcHVwX19jYW5jZWwnO1xuX3BhcmFtczE4MFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxODI7XG5fYXR0clZhbHVlMTgyID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgX3BhcmFtczE4MCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Ce0YLQvNC10L3QuNGC0YwnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTsgICAgcmV0dXJuIF9jaGlsZHM7XG4gIH07XG59KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkoKSk7XG4gIH1cbn0pKGZ1bmN0aW9uICgpIHtcbiAgdmFyIE1LQVJSX09QRU4gPSAyIDw8IDE7XG4gIHZhciBNS0FSUl9DTE9TRSA9IDEgPDwgMTtcbiAgZnVuY3Rpb24gbWtBcnIoc3RhcnQsIGVuZCwgZmxhZykge1xuICAgIHZhciBhcnIgPSBbXSwgaTtcbiAgICBpZiAoZmxhZyAmIE1LQVJSX09QRU4pIHtcbiAgICAgIGlmIChzdGFydCA8PSBlbmQpIHtcbiAgICAgICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA+IGVuZDsgaS0tKSB7XG4gICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZsYWcgJiBNS0FSUl9DTE9TRSkge1xuICAgICAgaWYgKHN0YXJ0IDw9IGVuZCkge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA+PSBlbmQ7IGktLSkge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gc3RyKHN0ciwgbGVuLCBzcHJ0cikge1xuICAgIGlmICghbGVuKSBsZW4gPSAwO1xuICAgIGlmICh0eXBlb2Ygc3RyLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSBzdHIgPSBzdHIudG9TdHJpbmcoKTtcbiAgICBpZiAoIXNwcnRyKSBzcHJ0ciA9ICcuJztcbiAgICBpZiAofnN0ci5pbmRleE9mKCcuJykpIHtcbiAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgc3RyLmluZGV4T2YoJy4nKSArIGxlbiArIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCBzdHIuaW5kZXhPZignLicpICsgbGVuKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gc3RyX3BhZChzdHIgKyAnLicsIHN0ci5sZW5ndGggKyAxICsgbGVuLCAnMCcpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoJy4nLCBzcHJ0cik7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX3JlcGxhY2Uoc3RyLCBzcmMsIHJlcCkge1xuICAgIHdoaWxlICh+c3RyLmluZGV4T2Yoc3JjKSkge1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2Uoc3JjLCByZXApO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG4gIHZhciBTVFJQQURSSUdIVCA9IDEgPDwgMTtcbiAgdmFyIFNUUlBBRExFRlQgPSAyIDw8IDE7XG4gIHZhciBTVFJQQURCT1RIID0gNCA8PCAxO1xuICBmdW5jdGlvbiBfX3N0cl9wYWRfcmVwZWF0ZXIoc3RyLCBsZW4pIHtcbiAgICB2YXIgY29sbGVjdCA9ICcnLCBpO1xuICAgIHdoaWxlKGNvbGxlY3QubGVuZ3RoIDwgbGVuKSBjb2xsZWN0ICs9IHN0cjtcbiAgICBjb2xsZWN0ID0gY29sbGVjdC5zdWJzdHIoMCwgbGVuKTtcbiAgICByZXR1cm4gY29sbGVjdDtcbiAgfVxuICBmdW5jdGlvbiBzdHJfcGFkKHN0ciwgbGVuLCBzdWIsIHR5cGUpIHtcbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICd1bmRlZmluZWQnKSB0eXBlID0gU1RSUEFEUklHSFQ7XG4gICAgdmFyIGhhbGYgPSAnJywgcGFkX3RvX2dvO1xuICAgIGlmICgocGFkX3RvX2dvID0gbGVuIC0gc3RyLmxlbmd0aCkgPiAwKSB7XG4gICAgICBpZiAodHlwZSAmIFNUUlBBRExFRlQpIHsgc3RyID0gX19zdHJfcGFkX3JlcGVhdGVyKHN1YiwgcGFkX3RvX2dvKSArIHN0cjsgfVxuICAgICAgZWxzZSBpZiAodHlwZSAmIFNUUlBBRFJJR0hUKSB7c3RyID0gc3RyICsgX19zdHJfcGFkX3JlcGVhdGVyKHN1YiwgcGFkX3RvX2dvKTsgfVxuICAgICAgZWxzZSBpZiAodHlwZSAmIFNUUlBBREJPVEgpIHtcbiAgICAgICAgaGFsZiA9IF9fc3RyX3BhZF9yZXBlYXRlcihzdWIsIE1hdGguY2VpbChwYWRfdG9fZ28vMikpO1xuICAgICAgICBzdHIgPSBoYWxmICsgc3RyICsgaGFsZjtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCBsZW4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9odG1sZXNjYXBlKGh0bWwpIHtcbiAgICByZXR1cm4gaHRtbC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcbiAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcbiAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcbiAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIik7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX3VwZmlyc3Qoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgvW1xcc1xcblxcdF0rLykubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5zdWJzdHIoMCwgMSkudG9VcHBlckNhc2UoKSArIGl0ZW0uc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgfSkuam9pbignICcpO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9jYW1lbChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnNwbGl0KC9bXFxzXFxuXFx0XSsvKS5tYXAoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICBpZiAoIWluZGV4KSByZXR1cm4gaXRlbTtcbiAgICAgIHJldHVybiBpdGVtLnN1YnN0cigwLCAxKS50b1VwcGVyQ2FzZSgpICsgaXRlbS5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9KS5qb2luKCcnKTtcbiAgfVxuICBmdW5jdGlvbiBzdHJfa2ViYWIoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgvW1xcc1xcblxcdF0rLykuam9pbignLScpO1xuICB9XG4gIGZ1bmN0aW9uIGFycl92YWx1ZXMob2JqKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdLCBpO1xuICAgIGZvcihpIGluIG9iaikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSB2YWx1ZXMucHVzaChvYmpbaV0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2NvbnRhaW4ob2JqLCB2YWx1ZSkge1xuICAgIGlmKHR5cGVvZiBvYmouaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIG9iai5pbmRleE9mKHZhbHVlKSAhPT0gLTE7XG4gICAgdmFyIGk7XG4gICAgZm9yKGkgaW4gb2JqKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGlmIChvYmpbaV0gPT09IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2xlbihvYmopIHtcbiAgICBpZih0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ3VuZGVmaW5lZCcpIHJldHVybiBvYmoubGVuZ3RoO1xuICAgIHZhciBpLCBsZW5ndGggPSAwO1xuICAgIGZvcihpIGluIG9iaikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBsZW5ndGgrKztcbiAgICByZXR1cm4gbGVuZ3RoO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9wdXNoKGFyciwgdmFsdWUpIHtcbiAgICBhcnIucHVzaCh2YWx1ZSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGZ1bmN0aW9uIGFycl91bnNoaWZ0KGFyciwgdmFsdWUpIHtcbiAgICBhcnIudW5zaGlmdCh2YWx1ZSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9yYW5kKGFyciwgdmFsdWUpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFycik7XG4gICAgcmV0dXJuIGFycltrZXlzW3BhcnNlSW50KE1hdGgucmFuZG9tKCkgKiBhcnJfbGVuKGFycikgLSAxKV1dO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9zcGxpY2UoYXJyLCBzdCwgZW4sIGVscykge1xuICAgIHZhciBwcm1zID0gW3N0XTtcbiAgICBpZiAodHlwZW9mIGVuICE9PSAndW5kZWZpbmVkJykgcHJtcy5wdXNoKGVuKTtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShhcnIsIHBybXMuY29uY2F0KGVscykpO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9wYWQoc3JjLCBsZW4sIGVsKSB7XG4gICAgdmFyIGksIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBpZihsZW4gPiAwKSBmb3IoaSA9IGFycl9sZW4oYXJyKTtpIDwgbGVuO2krKykgYXJyLnB1c2goZWwpO1xuICAgIGlmKGxlbiA8IDApIGZvcihpID0gYXJyX2xlbihhcnIpO2kgPCAtbGVuO2krKykgYXJyLnVuc2hpZnQoZWwpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3JldmVyc2Uoc3JjKSB7XG4gICAgdmFyIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBhcnIucmV2ZXJzZSgpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3NvcnQoc3JjKSB7XG4gICAgdmFyIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBhcnIuc29ydCgpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3NvcnRfcmV2ZXJzZShzcmMpIHtcbiAgICB2YXIgYXJyID0gc3JjLnNsaWNlKDApO1xuICAgIGFyci5zb3J0KCk7XG4gICAgYXJyLnJldmVyc2UoKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG4gIGZ1bmN0aW9uIGFycl91bmlxdWUoc3JjKSB7XG4gICAgdmFyIGksIGFyciA9IFtdO1xuICAgIGZvcihpIGluIHNyYykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzcmMsIGkpKSBpZiAoIX5hcnIuaW5kZXhPZihzcmNbaV0pKSBhcnIucHVzaChzcmNbaV0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2tleShhcnIsIHZhbHVlKSB7XG4gICAgdmFyIGk7XG4gICAgZm9yKGkgaW4gYXJyKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFyciwgaSkpIGlmICh2YWx1ZSA9PSBhcnJbaV0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGUobmFtZSwgYXR0cnMsIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0JykgcmV0dXJuIG5hbWU7XG4gICAgdmFyIGNoaWxkcyA9IFtdO1xuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIGNiKGNoaWxkcyk7XG4gICAgaWYgKGF0dHJzKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnbm9kZScsXG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIGF0dHJzOiBhdHRycyxcbiAgICAgICAgY2hpbGRzOiBjaGlsZHMuZmlsdGVyKGZ1bmN0aW9uIChfY2hpbGQpIHsgcmV0dXJuIF9jaGlsZCAhPT0gbnVsbDsgfSlcbiAgICAgIH07XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbmFtZS50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykgbmFtZSA9IG5hbWUudG9TdHJpbmcoKTtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgdGV4dDogbmFtZVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhLCBjaGlsZHMpIHtcbiAgICB2YXIgX2NoaWxkcyA9IFtdO1xudmFyIGk7XG52YXIgX3BhcmFtczAgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMSA9ICcnO1xuX2F0dHJWYWx1ZTEgKz0gJ3BvcHVwX19oZWFkJztcbl9wYXJhbXMwWydjbGFzcyddID0gX2F0dHJWYWx1ZTE7XG5fYXR0clZhbHVlMSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMwLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0J3QsNGB0YLRgNC+0LnQutC4INC/0LXRgNC10LrQu9GO0YfQsNGC0LXQu9C10LknKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4nKSk7XG52YXIgX3BhcmFtczIgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMyA9ICcnO1xuX3BhcmFtczJbJ2FjdGlvbiddID0gX2F0dHJWYWx1ZTM7XG5fYXR0clZhbHVlMyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNCA9ICcnO1xuX2F0dHJWYWx1ZTQgKz0gJ2Zvcm0nO1xuX3BhcmFtczJbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNDtcbl9hdHRyVmFsdWU0ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1ID0gJyc7XG5fYXR0clZhbHVlNSArPSAnY29uZmlncy1mb3JtJztcbl9wYXJhbXMyWydyb2xlJ10gPSBfYXR0clZhbHVlNTtcbl9hdHRyVmFsdWU1ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZm9ybScsIF9wYXJhbXMyLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG52YXIgX3BhcmFtczYgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNyA9ICcnO1xuX2F0dHJWYWx1ZTcgKz0gJ2Zvcm1fX2l0ZW0nO1xuX3BhcmFtczZbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNztcbl9hdHRyVmFsdWU3ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczYsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXM4ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTkgPSAnJztcbl9hdHRyVmFsdWU5ICs9ICdjb25maWdzLXJhZGlvLW51bS1vcHRpb25zJztcbl9wYXJhbXM4Wydmb3InXSA9IF9hdHRyVmFsdWU5O1xuX2F0dHJWYWx1ZTkgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEwID0gJyc7XG5fYXR0clZhbHVlMTAgKz0gJ2Zvcm1fX2xhYmVsJztcbl9wYXJhbXM4WydjbGFzcyddID0gX2F0dHJWYWx1ZTEwO1xuX2F0dHJWYWx1ZTEwID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBfcGFyYW1zOCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Ca0L7Qu9C40YfQtdGB0YLQstC+INCy0LDRgNC40LDQvdGC0L7QsiDQvtGC0LLQtdGC0LAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXMxMSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMiA9ICcnO1xuX2F0dHJWYWx1ZTEyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5fcGFyYW1zMTFbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTI7XG5fYXR0clZhbHVlMTIgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMTEsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczEzID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE0ID0gJyc7XG5fYXR0clZhbHVlMTQgKz0gJ3RleHQnO1xuX3BhcmFtczEzWyd0eXBlJ10gPSBfYXR0clZhbHVlMTQ7XG5fYXR0clZhbHVlMTQgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE1ID0gJyc7XG5fYXR0clZhbHVlMTUgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuX3BhcmFtczEzWydjbGFzcyddID0gX2F0dHJWYWx1ZTE1O1xuX2F0dHJWYWx1ZTE1ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNiA9ICcnO1xuX2F0dHJWYWx1ZTE2ICs9IGRhdGFbJ251bU9wdGlvbnMnXTtcbl9wYXJhbXMxM1sndmFsdWUnXSA9IF9hdHRyVmFsdWUxNjtcbl9hdHRyVmFsdWUxNiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTcgPSAnJztcbl9hdHRyVmFsdWUxNyArPSAnY29uZmlncy1yYWRpby1udW0tb3B0aW9ucyc7XG5fcGFyYW1zMTNbJ3JvbGUnXSA9IF9hdHRyVmFsdWUxNztcbl9hdHRyVmFsdWUxNyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTggPSAnJztcbl9hdHRyVmFsdWUxOCArPSAnY29uZmlncy1yYWRpby1udW0tb3B0aW9ucyc7XG5fcGFyYW1zMTNbJ2lkJ10gPSBfYXR0clZhbHVlMTg7XG5fYXR0clZhbHVlMTggPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIF9wYXJhbXMxMykpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG52YXIgX3BhcmFtczE5ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTIwID0gJyc7XG5fYXR0clZhbHVlMjAgKz0gJ2Zvcm1fX2l0ZW0nO1xuX3BhcmFtczE5WydjbGFzcyddID0gX2F0dHJWYWx1ZTIwO1xuX2F0dHJWYWx1ZTIwID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczE5LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zMjEgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjIgPSAnJztcbl9hdHRyVmFsdWUyMiArPSAnZm9ybV9fbGFiZWwnO1xuX3BhcmFtczIxWydjbGFzcyddID0gX2F0dHJWYWx1ZTIyO1xuX2F0dHJWYWx1ZTIyID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBfcGFyYW1zMjEsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQktCw0YDQuNCw0L3RgtGLINC+0YLQstC10YLQvtCyOicpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczIzID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTI0ID0gJyc7XG5fYXR0clZhbHVlMjQgKz0gJ2Zvcm1fX2lucC1jb250YWluIGZvcm1fX2lucC1jb250YWluLS1mdWxsLXdpZHRoJztcbl9wYXJhbXMyM1snY2xhc3MnXSA9IF9hdHRyVmFsdWUyNDtcbl9hdHRyVmFsdWUyNCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMyMywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbnZhciBfcGFyYW1zMjUgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjYgPSAnJztcbl9hdHRyVmFsdWUyNiArPSAnZm9ybV9fcm93LW9wdGlvbic7XG5fcGFyYW1zMjVbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMjY7XG5fYXR0clZhbHVlMjYgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMjUsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbnZhciBfcGFyYW1zMjcgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjggPSAnJztcbl9hdHRyVmFsdWUyOCArPSAncmFkaW8nO1xuX3BhcmFtczI3Wyd0eXBlJ10gPSBfYXR0clZhbHVlMjg7XG5fYXR0clZhbHVlMjggPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTI5ID0gJyc7XG5fYXR0clZhbHVlMjkgKz0gJ2Zvcm1fX3JhZGlvJztcbl9wYXJhbXMyN1snY2xhc3MnXSA9IF9hdHRyVmFsdWUyOTtcbl9hdHRyVmFsdWUyOSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzAgPSAnJztcbl9hdHRyVmFsdWUzMCArPSAnY29uZmlncy1yYWRpby1vcHRpb24nO1xuX3BhcmFtczI3Wydyb2xlJ10gPSBfYXR0clZhbHVlMzA7XG5fYXR0clZhbHVlMzAgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTMxID0gJyc7XG5fYXR0clZhbHVlMzEgKz0gJy0xJztcbl9wYXJhbXMyN1sndmFsdWUnXSA9IF9hdHRyVmFsdWUzMTtcbl9hdHRyVmFsdWUzMSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzIgPSAnJztcbl9hdHRyVmFsdWUzMiArPSAnY29uZmlncy1yYWRpby1vcHRpb24tLTEnO1xuX3BhcmFtczI3WydpZCddID0gX2F0dHJWYWx1ZTMyO1xuX2F0dHJWYWx1ZTMyID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzMyA9ICcnO1xuX2F0dHJWYWx1ZTMzICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbic7XG5fcGFyYW1zMjdbJ25hbWUnXSA9IF9hdHRyVmFsdWUzMztcbl9hdHRyVmFsdWUzMyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzQgPSAnJztcbmlmIChkYXRhWydkZWZhdWx0VmFsdWUnXSA9PSBcIi0xXCIpIHtcbl9wYXJhbXMyN1snY2hlY2tlZCddID0gX2F0dHJWYWx1ZTM0O1xuX2F0dHJWYWx1ZTM0ID0gJyc7XG59XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBfcGFyYW1zMjcpKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXMzNSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzNiA9ICcnO1xuX2F0dHJWYWx1ZTM2ICs9ICdmb3JtX19yYWRpby1sYWJlbCc7XG5fcGFyYW1zMzVbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMzY7XG5fYXR0clZhbHVlMzYgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTM3ID0gJyc7XG5fYXR0clZhbHVlMzcgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uLS0xJztcbl9wYXJhbXMzNVsnZm9yJ10gPSBfYXR0clZhbHVlMzc7XG5fYXR0clZhbHVlMzcgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXMzNSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXMzOCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzOSA9ICcnO1xuX2F0dHJWYWx1ZTM5ICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbi0tMSc7XG5fcGFyYW1zMzhbJ2ZvciddID0gX2F0dHJWYWx1ZTM5O1xuX2F0dHJWYWx1ZTM5ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBfcGFyYW1zMzgsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG52YXIgX3BhcmFtczQwID0ge307XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdpJywgX3BhcmFtczQwLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0J3QuNGH0LXQs9C+INC90LUg0LLRi9Cx0YDQsNC90L4g0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4nKSk7XG59KSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczQxID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQyID0gJyc7XG5fYXR0clZhbHVlNDIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9ucy1jb250YWluJztcbl9wYXJhbXM0MVsncm9sZSddID0gX2F0dHJWYWx1ZTQyO1xuX2F0dHJWYWx1ZTQyID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczQxLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX2FycjQzID0gZGF0YVsnZGVmYXVsdERhdGEnXTtcbmZvciAoZGF0YVsnaSddIGluIF9hcnI0Mykge1xuZGF0YVsnb3B0aW9uJ10gPSBfYXJyNDNbZGF0YVsnaSddXTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXM0NCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0NSA9ICcnO1xuX2F0dHJWYWx1ZTQ1ICs9ICdmb3JtX19yb3ctb3B0aW9uJztcbl9wYXJhbXM0NFsnY2xhc3MnXSA9IF9hdHRyVmFsdWU0NTtcbl9hdHRyVmFsdWU0NSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM0NCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG52YXIgX3BhcmFtczQ2ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ3ID0gJyc7XG5fYXR0clZhbHVlNDcgKz0gJ3JhZGlvJztcbl9wYXJhbXM0NlsndHlwZSddID0gX2F0dHJWYWx1ZTQ3O1xuX2F0dHJWYWx1ZTQ3ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0OCA9ICcnO1xuX2F0dHJWYWx1ZTQ4ICs9ICdmb3JtX19yYWRpbyc7XG5fcGFyYW1zNDZbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNDg7XG5fYXR0clZhbHVlNDggPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ5ID0gJyc7XG5fYXR0clZhbHVlNDkgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uJztcbl9wYXJhbXM0Nlsncm9sZSddID0gX2F0dHJWYWx1ZTQ5O1xuX2F0dHJWYWx1ZTQ5ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1MCA9ICcnO1xuX2F0dHJWYWx1ZTUwICs9IGRhdGFbJ2knXTtcbl9wYXJhbXM0NlsndmFsdWUnXSA9IF9hdHRyVmFsdWU1MDtcbl9hdHRyVmFsdWU1MCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNTEgPSAnJztcbl9hdHRyVmFsdWU1MSArPSAnY29uZmlncy1yYWRpby1vcHRpb24tJztcbl9hdHRyVmFsdWU1MSArPSBkYXRhWydpJ107XG5fcGFyYW1zNDZbJ2lkJ10gPSBfYXR0clZhbHVlNTE7XG5fYXR0clZhbHVlNTEgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTUyID0gJyc7XG5fYXR0clZhbHVlNTIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uJztcbl9wYXJhbXM0NlsnbmFtZSddID0gX2F0dHJWYWx1ZTUyO1xuX2F0dHJWYWx1ZTUyID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1MyA9ICcnO1xuaWYgKGRhdGFbJ2RlZmF1bHRWYWx1ZSddID09IGRhdGFbJ2knXSkge1xuX3BhcmFtczQ2WydjaGVja2VkJ10gPSBfYXR0clZhbHVlNTM7XG5fYXR0clZhbHVlNTMgPSAnJztcbn1cbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIF9wYXJhbXM0NikpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICcpKTtcbnZhciBfcGFyYW1zNTQgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNTUgPSAnJztcbl9hdHRyVmFsdWU1NSArPSAnZm9ybV9fcmFkaW8tbGFiZWwnO1xuX3BhcmFtczU0WydjbGFzcyddID0gX2F0dHJWYWx1ZTU1O1xuX2F0dHJWYWx1ZTU1ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1NiA9ICcnO1xuX2F0dHJWYWx1ZTU2ICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbi0nO1xuX2F0dHJWYWx1ZTU2ICs9IGRhdGFbJ2knXTtcbl9wYXJhbXM1NFsnZm9yJ10gPSBfYXR0clZhbHVlNTY7XG5fYXR0clZhbHVlNTYgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXM1NCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG52YXIgX3BhcmFtczU3ID0ge307XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXM1NywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbnZhciBfcGFyYW1zNTggPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNTkgPSAnJztcbl9hdHRyVmFsdWU1OSArPSAndGV4dCc7XG5fcGFyYW1zNThbJ3R5cGUnXSA9IF9hdHRyVmFsdWU1OTtcbl9hdHRyVmFsdWU1OSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNjAgPSAnJztcbl9hdHRyVmFsdWU2MCArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0taGFsZi13aWR0aCc7XG5fcGFyYW1zNThbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNjA7XG5fYXR0clZhbHVlNjAgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTYxID0gJyc7XG5fYXR0clZhbHVlNjEgKz0gZGF0YVsnb3B0aW9uJ107XG5fcGFyYW1zNThbJ3ZhbHVlJ10gPSBfYXR0clZhbHVlNjE7XG5fYXR0clZhbHVlNjEgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTYyID0gJyc7XG5fYXR0clZhbHVlNjIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uLWxhYmVsJztcbl9wYXJhbXM1OFsncm9sZSddID0gX2F0dHJWYWx1ZTYyO1xuX2F0dHJWYWx1ZTYyID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU2MyA9ICcnO1xuX2F0dHJWYWx1ZTYzICs9IGRhdGFbJ2knXTtcbl9wYXJhbXM1OFsnZGF0YS1pbmRleCddID0gX2F0dHJWYWx1ZTYzO1xuX2F0dHJWYWx1ZTYzID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBfcGFyYW1zNTgpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zNjQgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNjUgPSAnJztcbl9hdHRyVmFsdWU2NSArPSAnZm9ybV9fc3VibWl0Jztcbl9wYXJhbXM2NFsnY2xhc3MnXSA9IF9hdHRyVmFsdWU2NTtcbl9hdHRyVmFsdWU2NSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM2NCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczY2ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTY3ID0gJyc7XG5fYXR0clZhbHVlNjcgKz0gJ2Zvcm1fX2J0biBmb3JtX19idG4tLXN1Ym1pdCc7XG5fcGFyYW1zNjZbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNjc7XG5fYXR0clZhbHVlNjcgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBfcGFyYW1zNjYsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQodC+0YXRgNCw0L3QuNGC0YwnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXM2OCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU2OSA9ICcnO1xuX2F0dHJWYWx1ZTY5ICs9ICdidXR0b24nO1xuX3BhcmFtczY4Wyd0eXBlJ10gPSBfYXR0clZhbHVlNjk7XG5fYXR0clZhbHVlNjkgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTcwID0gJyc7XG5fYXR0clZhbHVlNzAgKz0gJ2Zvcm1fX2J0biBwb3B1cF9fY2FuY2VsJztcbl9wYXJhbXM2OFsnY2xhc3MnXSA9IF9hdHRyVmFsdWU3MDtcbl9hdHRyVmFsdWU3MCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIF9wYXJhbXM2OCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Ce0YLQvNC10L3QuNGC0YwnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTsgICAgcmV0dXJuIF9jaGlsZHM7XG4gIH07XG59KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkoKSk7XG4gIH1cbn0pKGZ1bmN0aW9uICgpIHtcbiAgdmFyIE1LQVJSX09QRU4gPSAyIDw8IDE7XG4gIHZhciBNS0FSUl9DTE9TRSA9IDEgPDwgMTtcbiAgZnVuY3Rpb24gbWtBcnIoc3RhcnQsIGVuZCwgZmxhZykge1xuICAgIHZhciBhcnIgPSBbXSwgaTtcbiAgICBpZiAoZmxhZyAmIE1LQVJSX09QRU4pIHtcbiAgICAgIGlmIChzdGFydCA8PSBlbmQpIHtcbiAgICAgICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA+IGVuZDsgaS0tKSB7XG4gICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZsYWcgJiBNS0FSUl9DTE9TRSkge1xuICAgICAgaWYgKHN0YXJ0IDw9IGVuZCkge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA+PSBlbmQ7IGktLSkge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gc3RyKHN0ciwgbGVuLCBzcHJ0cikge1xuICAgIGlmICghbGVuKSBsZW4gPSAwO1xuICAgIGlmICh0eXBlb2Ygc3RyLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSBzdHIgPSBzdHIudG9TdHJpbmcoKTtcbiAgICBpZiAoIXNwcnRyKSBzcHJ0ciA9ICcuJztcbiAgICBpZiAofnN0ci5pbmRleE9mKCcuJykpIHtcbiAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgc3RyLmluZGV4T2YoJy4nKSArIGxlbiArIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCBzdHIuaW5kZXhPZignLicpICsgbGVuKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gc3RyX3BhZChzdHIgKyAnLicsIHN0ci5sZW5ndGggKyAxICsgbGVuLCAnMCcpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoJy4nLCBzcHJ0cik7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX3JlcGxhY2Uoc3RyLCBzcmMsIHJlcCkge1xuICAgIHdoaWxlICh+c3RyLmluZGV4T2Yoc3JjKSkge1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2Uoc3JjLCByZXApO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG4gIHZhciBTVFJQQURSSUdIVCA9IDEgPDwgMTtcbiAgdmFyIFNUUlBBRExFRlQgPSAyIDw8IDE7XG4gIHZhciBTVFJQQURCT1RIID0gNCA8PCAxO1xuICBmdW5jdGlvbiBfX3N0cl9wYWRfcmVwZWF0ZXIoc3RyLCBsZW4pIHtcbiAgICB2YXIgY29sbGVjdCA9ICcnLCBpO1xuICAgIHdoaWxlKGNvbGxlY3QubGVuZ3RoIDwgbGVuKSBjb2xsZWN0ICs9IHN0cjtcbiAgICBjb2xsZWN0ID0gY29sbGVjdC5zdWJzdHIoMCwgbGVuKTtcbiAgICByZXR1cm4gY29sbGVjdDtcbiAgfVxuICBmdW5jdGlvbiBzdHJfcGFkKHN0ciwgbGVuLCBzdWIsIHR5cGUpIHtcbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICd1bmRlZmluZWQnKSB0eXBlID0gU1RSUEFEUklHSFQ7XG4gICAgdmFyIGhhbGYgPSAnJywgcGFkX3RvX2dvO1xuICAgIGlmICgocGFkX3RvX2dvID0gbGVuIC0gc3RyLmxlbmd0aCkgPiAwKSB7XG4gICAgICBpZiAodHlwZSAmIFNUUlBBRExFRlQpIHsgc3RyID0gX19zdHJfcGFkX3JlcGVhdGVyKHN1YiwgcGFkX3RvX2dvKSArIHN0cjsgfVxuICAgICAgZWxzZSBpZiAodHlwZSAmIFNUUlBBRFJJR0hUKSB7c3RyID0gc3RyICsgX19zdHJfcGFkX3JlcGVhdGVyKHN1YiwgcGFkX3RvX2dvKTsgfVxuICAgICAgZWxzZSBpZiAodHlwZSAmIFNUUlBBREJPVEgpIHtcbiAgICAgICAgaGFsZiA9IF9fc3RyX3BhZF9yZXBlYXRlcihzdWIsIE1hdGguY2VpbChwYWRfdG9fZ28vMikpO1xuICAgICAgICBzdHIgPSBoYWxmICsgc3RyICsgaGFsZjtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCBsZW4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9odG1sZXNjYXBlKGh0bWwpIHtcbiAgICByZXR1cm4gaHRtbC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcbiAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcbiAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcbiAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIik7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX3VwZmlyc3Qoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgvW1xcc1xcblxcdF0rLykubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5zdWJzdHIoMCwgMSkudG9VcHBlckNhc2UoKSArIGl0ZW0uc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgfSkuam9pbignICcpO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9jYW1lbChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnNwbGl0KC9bXFxzXFxuXFx0XSsvKS5tYXAoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICBpZiAoIWluZGV4KSByZXR1cm4gaXRlbTtcbiAgICAgIHJldHVybiBpdGVtLnN1YnN0cigwLCAxKS50b1VwcGVyQ2FzZSgpICsgaXRlbS5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9KS5qb2luKCcnKTtcbiAgfVxuICBmdW5jdGlvbiBzdHJfa2ViYWIoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgvW1xcc1xcblxcdF0rLykuam9pbignLScpO1xuICB9XG4gIGZ1bmN0aW9uIGFycl92YWx1ZXMob2JqKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdLCBpO1xuICAgIGZvcihpIGluIG9iaikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSB2YWx1ZXMucHVzaChvYmpbaV0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2NvbnRhaW4ob2JqLCB2YWx1ZSkge1xuICAgIGlmKHR5cGVvZiBvYmouaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIG9iai5pbmRleE9mKHZhbHVlKSAhPT0gLTE7XG4gICAgdmFyIGk7XG4gICAgZm9yKGkgaW4gb2JqKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGlmIChvYmpbaV0gPT09IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2xlbihvYmopIHtcbiAgICBpZih0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ3VuZGVmaW5lZCcpIHJldHVybiBvYmoubGVuZ3RoO1xuICAgIHZhciBpLCBsZW5ndGggPSAwO1xuICAgIGZvcihpIGluIG9iaikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBsZW5ndGgrKztcbiAgICByZXR1cm4gbGVuZ3RoO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9wdXNoKGFyciwgdmFsdWUpIHtcbiAgICBhcnIucHVzaCh2YWx1ZSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGZ1bmN0aW9uIGFycl91bnNoaWZ0KGFyciwgdmFsdWUpIHtcbiAgICBhcnIudW5zaGlmdCh2YWx1ZSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9yYW5kKGFyciwgdmFsdWUpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFycik7XG4gICAgcmV0dXJuIGFycltrZXlzW3BhcnNlSW50KE1hdGgucmFuZG9tKCkgKiBhcnJfbGVuKGFycikgLSAxKV1dO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9zcGxpY2UoYXJyLCBzdCwgZW4sIGVscykge1xuICAgIHZhciBwcm1zID0gW3N0XTtcbiAgICBpZiAodHlwZW9mIGVuICE9PSAndW5kZWZpbmVkJykgcHJtcy5wdXNoKGVuKTtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShhcnIsIHBybXMuY29uY2F0KGVscykpO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9wYWQoc3JjLCBsZW4sIGVsKSB7XG4gICAgdmFyIGksIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBpZihsZW4gPiAwKSBmb3IoaSA9IGFycl9sZW4oYXJyKTtpIDwgbGVuO2krKykgYXJyLnB1c2goZWwpO1xuICAgIGlmKGxlbiA8IDApIGZvcihpID0gYXJyX2xlbihhcnIpO2kgPCAtbGVuO2krKykgYXJyLnVuc2hpZnQoZWwpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3JldmVyc2Uoc3JjKSB7XG4gICAgdmFyIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBhcnIucmV2ZXJzZSgpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3NvcnQoc3JjKSB7XG4gICAgdmFyIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBhcnIuc29ydCgpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3NvcnRfcmV2ZXJzZShzcmMpIHtcbiAgICB2YXIgYXJyID0gc3JjLnNsaWNlKDApO1xuICAgIGFyci5zb3J0KCk7XG4gICAgYXJyLnJldmVyc2UoKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG4gIGZ1bmN0aW9uIGFycl91bmlxdWUoc3JjKSB7XG4gICAgdmFyIGksIGFyciA9IFtdO1xuICAgIGZvcihpIGluIHNyYykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzcmMsIGkpKSBpZiAoIX5hcnIuaW5kZXhPZihzcmNbaV0pKSBhcnIucHVzaChzcmNbaV0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2tleShhcnIsIHZhbHVlKSB7XG4gICAgdmFyIGk7XG4gICAgZm9yKGkgaW4gYXJyKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFyciwgaSkpIGlmICh2YWx1ZSA9PSBhcnJbaV0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGUobmFtZSwgYXR0cnMsIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0JykgcmV0dXJuIG5hbWU7XG4gICAgdmFyIGNoaWxkcyA9IFtdO1xuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIGNiKGNoaWxkcyk7XG4gICAgaWYgKGF0dHJzKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnbm9kZScsXG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIGF0dHJzOiBhdHRycyxcbiAgICAgICAgY2hpbGRzOiBjaGlsZHMuZmlsdGVyKGZ1bmN0aW9uIChfY2hpbGQpIHsgcmV0dXJuIF9jaGlsZCAhPT0gbnVsbDsgfSlcbiAgICAgIH07XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbmFtZS50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykgbmFtZSA9IG5hbWUudG9TdHJpbmcoKTtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgdGV4dDogbmFtZVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhLCBjaGlsZHMpIHtcbiAgICB2YXIgX2NoaWxkcyA9IFtdO1xudmFyIGk7XG52YXIgX3BhcmFtczAgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMSA9ICcnO1xuX2F0dHJWYWx1ZTEgKz0gJ3BvcHVwX19oZWFkJztcbl9wYXJhbXMwWydjbGFzcyddID0gX2F0dHJWYWx1ZTE7XG5fYXR0clZhbHVlMSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMwLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0J3QsNGB0YLRgNC+0LnQutC4INCy0YvQv9Cw0LTQsNC50LrQuCcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTtcbnZhciBfcGFyYW1zMiA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzID0gJyc7XG5fcGFyYW1zMlsnYWN0aW9uJ10gPSBfYXR0clZhbHVlMztcbl9hdHRyVmFsdWUzID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0ID0gJyc7XG5fYXR0clZhbHVlNCArPSAnZm9ybSc7XG5fcGFyYW1zMlsnY2xhc3MnXSA9IF9hdHRyVmFsdWU0O1xuX2F0dHJWYWx1ZTQgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTUgPSAnJztcbl9hdHRyVmFsdWU1ICs9ICdjb25maWdzLWZvcm0nO1xuX3BhcmFtczJbJ3JvbGUnXSA9IF9hdHRyVmFsdWU1O1xuX2F0dHJWYWx1ZTUgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdmb3JtJywgX3BhcmFtczIsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zNiA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU3ID0gJyc7XG5fYXR0clZhbHVlNyArPSAnZm9ybV9faXRlbSc7XG5fcGFyYW1zNlsnY2xhc3MnXSA9IF9hdHRyVmFsdWU3O1xuX2F0dHJWYWx1ZTcgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zNiwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczggPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlOSA9ICcnO1xuX2F0dHJWYWx1ZTkgKz0gJ2NvbmZpZ3Mtc2VsZWN0LW51bS1vcHRpb25zJztcbl9wYXJhbXM4Wydmb3InXSA9IF9hdHRyVmFsdWU5O1xuX2F0dHJWYWx1ZTkgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEwID0gJyc7XG5fYXR0clZhbHVlMTAgKz0gJ2Zvcm1fX2xhYmVsJztcbl9wYXJhbXM4WydjbGFzcyddID0gX2F0dHJWYWx1ZTEwO1xuX2F0dHJWYWx1ZTEwID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBfcGFyYW1zOCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Ca0L7Qu9C40YfQtdGB0YLQstC+INCy0LDRgNC40LDQvdGC0L7QsiDQvtGC0LLQtdGC0LAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXMxMSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxMiA9ICcnO1xuX2F0dHJWYWx1ZTEyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5fcGFyYW1zMTFbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMTI7XG5fYXR0clZhbHVlMTIgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMTEsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczEzID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE0ID0gJyc7XG5fYXR0clZhbHVlMTQgKz0gJ3RleHQnO1xuX3BhcmFtczEzWyd0eXBlJ10gPSBfYXR0clZhbHVlMTQ7XG5fYXR0clZhbHVlMTQgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE1ID0gJyc7XG5fYXR0clZhbHVlMTUgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuX3BhcmFtczEzWydjbGFzcyddID0gX2F0dHJWYWx1ZTE1O1xuX2F0dHJWYWx1ZTE1ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNiA9ICcnO1xuX2F0dHJWYWx1ZTE2ICs9IGRhdGFbJ251bU9wdGlvbnMnXTtcbl9wYXJhbXMxM1sndmFsdWUnXSA9IF9hdHRyVmFsdWUxNjtcbl9hdHRyVmFsdWUxNiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTcgPSAnJztcbl9hdHRyVmFsdWUxNyArPSAnY29uZmlncy1zZWxlY3QtbnVtLW9wdGlvbnMnO1xuX3BhcmFtczEzWydyb2xlJ10gPSBfYXR0clZhbHVlMTc7XG5fYXR0clZhbHVlMTcgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE4ID0gJyc7XG5fYXR0clZhbHVlMTggKz0gJ2NvbmZpZ3Mtc2VsZWN0LW51bS1vcHRpb25zJztcbl9wYXJhbXMxM1snaWQnXSA9IF9hdHRyVmFsdWUxODtcbl9hdHRyVmFsdWUxOCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgX3BhcmFtczEzKSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zMTkgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjAgPSAnJztcbl9hdHRyVmFsdWUyMCArPSAnZm9ybV9faXRlbSc7XG5fcGFyYW1zMTlbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMjA7XG5fYXR0clZhbHVlMjAgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMTksIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXMyMSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyMiA9ICcnO1xuX2F0dHJWYWx1ZTIyICs9ICdmb3JtX19sYWJlbCc7XG5fcGFyYW1zMjFbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMjI7XG5fYXR0clZhbHVlMjIgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXMyMSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9CS0LDRgNC40LDQvdGC0Ysg0L7RgtCy0LXRgtC+0LI6JykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zMjMgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjQgPSAnJztcbl9hdHRyVmFsdWUyNCArPSAnZm9ybV9faW5wLWNvbnRhaW4gZm9ybV9faW5wLWNvbnRhaW4tLWZ1bGwtd2lkdGgnO1xuX3BhcmFtczIzWydjbGFzcyddID0gX2F0dHJWYWx1ZTI0O1xuX2F0dHJWYWx1ZTI0ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczIzLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXMyNSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyNiA9ICcnO1xuX2F0dHJWYWx1ZTI2ICs9ICdmb3JtX19yb3ctb3B0aW9uJztcbl9wYXJhbXMyNVsnY2xhc3MnXSA9IF9hdHRyVmFsdWUyNjtcbl9hdHRyVmFsdWUyNiA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMyNSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXMyNyA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyOCA9ICcnO1xuX2F0dHJWYWx1ZTI4ICs9ICdyYWRpbyc7XG5fcGFyYW1zMjdbJ3R5cGUnXSA9IF9hdHRyVmFsdWUyODtcbl9hdHRyVmFsdWUyOCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjkgPSAnJztcbl9hdHRyVmFsdWUyOSArPSAnZm9ybV9fcmFkaW8nO1xuX3BhcmFtczI3WydjbGFzcyddID0gX2F0dHJWYWx1ZTI5O1xuX2F0dHJWYWx1ZTI5ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzMCA9ICcnO1xuX2F0dHJWYWx1ZTMwICs9ICdjb25maWdzLXNlbGVjdC1vcHRpb24nO1xuX3BhcmFtczI3Wydyb2xlJ10gPSBfYXR0clZhbHVlMzA7XG5fYXR0clZhbHVlMzAgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTMxID0gJyc7XG5fYXR0clZhbHVlMzEgKz0gJy0xJztcbl9wYXJhbXMyN1sndmFsdWUnXSA9IF9hdHRyVmFsdWUzMTtcbl9hdHRyVmFsdWUzMSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzIgPSAnJztcbl9hdHRyVmFsdWUzMiArPSAnY29uZmlncy1zZWxlY3Qtb3B0aW9uLS0xJztcbl9wYXJhbXMyN1snaWQnXSA9IF9hdHRyVmFsdWUzMjtcbl9hdHRyVmFsdWUzMiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzMgPSAnJztcbl9hdHRyVmFsdWUzMyArPSAnY29uZmlncy1zZWxlY3Qtb3B0aW9uJztcbl9wYXJhbXMyN1snbmFtZSddID0gX2F0dHJWYWx1ZTMzO1xuX2F0dHJWYWx1ZTMzID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzNCA9ICcnO1xuaWYgKGRhdGFbJ2RlZmF1bHRWYWx1ZSddID09IC0xIHx8IGRhdGFbJ2RlZmF1bHRWYWx1ZSddID09IFwiLTFcIikge1xuX3BhcmFtczI3WydjaGVja2VkJ10gPSBfYXR0clZhbHVlMzQ7XG5fYXR0clZhbHVlMzQgPSAnJztcbn1cbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIF9wYXJhbXMyNykpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczM1ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTM2ID0gJyc7XG5fYXR0clZhbHVlMzYgKz0gJ2Zvcm1fX3JhZGlvLWxhYmVsJztcbl9wYXJhbXMzNVsnY2xhc3MnXSA9IF9hdHRyVmFsdWUzNjtcbl9hdHRyVmFsdWUzNiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzcgPSAnJztcbl9hdHRyVmFsdWUzNyArPSAnY29uZmlncy1zZWxlY3Qtb3B0aW9uLS0xJztcbl9wYXJhbXMzNVsnZm9yJ10gPSBfYXR0clZhbHVlMzc7XG5fYXR0clZhbHVlMzcgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXMzNSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXMzOCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzOSA9ICcnO1xuX2F0dHJWYWx1ZTM5ICs9ICdjb25maWdzLXNlbGVjdC1vcHRpb24tLTEnO1xuX3BhcmFtczM4Wydmb3InXSA9IF9hdHRyVmFsdWUzOTtcbl9hdHRyVmFsdWUzOSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgX3BhcmFtczM4LCBmdW5jdGlvbiAoX2NoaWxkcykge1xudmFyIF9wYXJhbXM0MCA9IHt9O1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnaScsIF9wYXJhbXM0MCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Cd0LjRh9C10LPQviDQvdC1INCy0YvQsdGA0LDQvdC+INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOJykpO1xufSkpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXM0MSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0MiA9ICcnO1xuX2F0dHJWYWx1ZTQyICs9ICdjb25maWdzLXNlbGVjdC1vcHRpb25zLWNvbnRhaW4nO1xuX3BhcmFtczQxWydyb2xlJ10gPSBfYXR0clZhbHVlNDI7XG5fYXR0clZhbHVlNDIgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zNDEsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbnZhciBfYXJyNDMgPSBkYXRhWydkZWZhdWx0RGF0YSddO1xuZm9yIChkYXRhWydpJ10gaW4gX2FycjQzKSB7XG5kYXRhWydvcHRpb24nXSA9IF9hcnI0M1tkYXRhWydpJ11dO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczQ0ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ1ID0gJyc7XG5fYXR0clZhbHVlNDUgKz0gJ2Zvcm1fX3Jvdy1vcHRpb24nO1xuX3BhcmFtczQ0WydjbGFzcyddID0gX2F0dHJWYWx1ZTQ1O1xuX2F0dHJWYWx1ZTQ1ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczQ0LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICcpKTtcbnZhciBfcGFyYW1zNDYgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDcgPSAnJztcbl9hdHRyVmFsdWU0NyArPSAncmFkaW8nO1xuX3BhcmFtczQ2Wyd0eXBlJ10gPSBfYXR0clZhbHVlNDc7XG5fYXR0clZhbHVlNDcgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ4ID0gJyc7XG5fYXR0clZhbHVlNDggKz0gJ2Zvcm1fX3JhZGlvJztcbl9wYXJhbXM0NlsnY2xhc3MnXSA9IF9hdHRyVmFsdWU0ODtcbl9hdHRyVmFsdWU0OCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDkgPSAnJztcbl9hdHRyVmFsdWU0OSArPSAnY29uZmlncy1zZWxlY3Qtb3B0aW9uJztcbl9wYXJhbXM0Nlsncm9sZSddID0gX2F0dHJWYWx1ZTQ5O1xuX2F0dHJWYWx1ZTQ5ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1MCA9ICcnO1xuX2F0dHJWYWx1ZTUwICs9IGRhdGFbJ2knXTtcbl9wYXJhbXM0NlsndmFsdWUnXSA9IF9hdHRyVmFsdWU1MDtcbl9hdHRyVmFsdWU1MCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNTEgPSAnJztcbl9hdHRyVmFsdWU1MSArPSAnY29uZmlncy1zZWxlY3Qtb3B0aW9uLSc7XG5fYXR0clZhbHVlNTEgKz0gZGF0YVsnaSddO1xuX3BhcmFtczQ2WydpZCddID0gX2F0dHJWYWx1ZTUxO1xuX2F0dHJWYWx1ZTUxID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1MiA9ICcnO1xuX2F0dHJWYWx1ZTUyICs9ICdjb25maWdzLXNlbGVjdC1vcHRpb24nO1xuX3BhcmFtczQ2WyduYW1lJ10gPSBfYXR0clZhbHVlNTI7XG5fYXR0clZhbHVlNTIgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTUzID0gJyc7XG5pZiAoZGF0YVsnZGVmYXVsdFZhbHVlJ10gPT0gZGF0YVsnaSddKSB7XG5fcGFyYW1zNDZbJ2NoZWNrZWQnXSA9IF9hdHRyVmFsdWU1Mztcbl9hdHRyVmFsdWU1MyA9ICcnO1xufVxufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgX3BhcmFtczQ2KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICAgJykpO1xudmFyIF9wYXJhbXM1NCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1NSA9ICcnO1xuX2F0dHJWYWx1ZTU1ICs9ICdmb3JtX19yYWRpby1sYWJlbCc7XG5fcGFyYW1zNTRbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNTU7XG5fYXR0clZhbHVlNTUgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTU2ID0gJyc7XG5fYXR0clZhbHVlNTYgKz0gJ2NvbmZpZ3Mtc2VsZWN0LW9wdGlvbi0nO1xuX2F0dHJWYWx1ZTU2ICs9IGRhdGFbJ2knXTtcbl9wYXJhbXM1NFsnZm9yJ10gPSBfYXR0clZhbHVlNTY7XG5fYXR0clZhbHVlNTYgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXM1NCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG52YXIgX3BhcmFtczU3ID0ge307XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIF9wYXJhbXM1NywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbnZhciBfcGFyYW1zNTggPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNTkgPSAnJztcbl9hdHRyVmFsdWU1OSArPSAndGV4dCc7XG5fcGFyYW1zNThbJ3R5cGUnXSA9IF9hdHRyVmFsdWU1OTtcbl9hdHRyVmFsdWU1OSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNjAgPSAnJztcbl9hdHRyVmFsdWU2MCArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0taGFsZi13aWR0aCc7XG5fcGFyYW1zNThbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNjA7XG5fYXR0clZhbHVlNjAgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTYxID0gJyc7XG5fYXR0clZhbHVlNjEgKz0gZGF0YVsnb3B0aW9uJ107XG5fcGFyYW1zNThbJ3ZhbHVlJ10gPSBfYXR0clZhbHVlNjE7XG5fYXR0clZhbHVlNjEgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTYyID0gJyc7XG5fYXR0clZhbHVlNjIgKz0gJ2NvbmZpZ3Mtc2VsZWN0LW9wdGlvbi1sYWJlbCc7XG5fcGFyYW1zNThbJ3JvbGUnXSA9IF9hdHRyVmFsdWU2Mjtcbl9hdHRyVmFsdWU2MiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNjMgPSAnJztcbl9hdHRyVmFsdWU2MyArPSBkYXRhWydpJ107XG5fcGFyYW1zNThbJ2RhdGEtaW5kZXgnXSA9IF9hdHRyVmFsdWU2Mztcbl9hdHRyVmFsdWU2MyA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgX3BhcmFtczU4KSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xufVxuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG52YXIgX3BhcmFtczY0ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTY1ID0gJyc7XG5fYXR0clZhbHVlNjUgKz0gJ2Zvcm1fX3N1Ym1pdCc7XG5fcGFyYW1zNjRbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNjU7XG5fYXR0clZhbHVlNjUgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zNjQsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXM2NiA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU2NyA9ICcnO1xuX2F0dHJWYWx1ZTY3ICs9ICdmb3JtX19idG4gZm9ybV9fYnRuLS1zdWJtaXQnO1xuX3BhcmFtczY2WydjbGFzcyddID0gX2F0dHJWYWx1ZTY3O1xuX2F0dHJWYWx1ZTY3ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgX3BhcmFtczY2LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0KHQvtGF0YDQsNC90LjRgtGMJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zNjggPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNjkgPSAnJztcbl9hdHRyVmFsdWU2OSArPSAnYnV0dG9uJztcbl9wYXJhbXM2OFsndHlwZSddID0gX2F0dHJWYWx1ZTY5O1xuX2F0dHJWYWx1ZTY5ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU3MCA9ICcnO1xuX2F0dHJWYWx1ZTcwICs9ICdmb3JtX19idG4gcG9wdXBfX2NhbmNlbCc7XG5fcGFyYW1zNjhbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNzA7XG5fYXR0clZhbHVlNzAgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBfcGFyYW1zNjgsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQntGC0LzQtdC90LjRgtGMJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4nKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4nKSk7ICAgIHJldHVybiBfY2hpbGRzO1xuICB9O1xufSk7IiwiKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KCkpO1xuICB9XG59KShmdW5jdGlvbiAoKSB7XG4gIHZhciBNS0FSUl9PUEVOID0gMiA8PCAxO1xuICB2YXIgTUtBUlJfQ0xPU0UgPSAxIDw8IDE7XG4gIGZ1bmN0aW9uIG1rQXJyKHN0YXJ0LCBlbmQsIGZsYWcpIHtcbiAgICB2YXIgYXJyID0gW10sIGk7XG4gICAgaWYgKGZsYWcgJiBNS0FSUl9PUEVOKSB7XG4gICAgICBpZiAoc3RhcnQgPD0gZW5kKSB7XG4gICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgICAgICBhcnIucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gc3RhcnQ7IGkgPiBlbmQ7IGktLSkge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmbGFnICYgTUtBUlJfQ0xPU0UpIHtcbiAgICAgIGlmIChzdGFydCA8PSBlbmQpIHtcbiAgICAgICAgZm9yIChpID0gc3RhcnQ7IGkgPD0gZW5kOyBpKyspIHtcbiAgICAgICAgICBhcnIucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gc3RhcnQ7IGkgPj0gZW5kOyBpLS0pIHtcbiAgICAgICAgICBhcnIucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9XG4gIGZ1bmN0aW9uIHN0cihzdHIsIGxlbiwgc3BydHIpIHtcbiAgICBpZiAoIWxlbikgbGVuID0gMDtcbiAgICBpZiAodHlwZW9mIHN0ci50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykgc3RyID0gc3RyLnRvU3RyaW5nKCk7XG4gICAgaWYgKCFzcHJ0cikgc3BydHIgPSAnLic7XG4gICAgaWYgKH5zdHIuaW5kZXhPZignLicpKSB7XG4gICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsIHN0ci5pbmRleE9mKCcuJykgKyBsZW4gKyAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgc3RyLmluZGV4T2YoJy4nKSArIGxlbik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IHN0cl9wYWQoc3RyICsgJy4nLCBzdHIubGVuZ3RoICsgMSArIGxlbiwgJzAnKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKCcuJywgc3BydHIpO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9yZXBsYWNlKHN0ciwgc3JjLCByZXApIHtcbiAgICB3aGlsZSAofnN0ci5pbmRleE9mKHNyYykpIHtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHNyYywgcmVwKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuICB2YXIgU1RSUEFEUklHSFQgPSAxIDw8IDE7XG4gIHZhciBTVFJQQURMRUZUID0gMiA8PCAxO1xuICB2YXIgU1RSUEFEQk9USCA9IDQgPDwgMTtcbiAgZnVuY3Rpb24gX19zdHJfcGFkX3JlcGVhdGVyKHN0ciwgbGVuKSB7XG4gICAgdmFyIGNvbGxlY3QgPSAnJywgaTtcbiAgICB3aGlsZShjb2xsZWN0Lmxlbmd0aCA8IGxlbikgY29sbGVjdCArPSBzdHI7XG4gICAgY29sbGVjdCA9IGNvbGxlY3Quc3Vic3RyKDAsIGxlbik7XG4gICAgcmV0dXJuIGNvbGxlY3Q7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX3BhZChzdHIsIGxlbiwgc3ViLCB0eXBlKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSAndW5kZWZpbmVkJykgdHlwZSA9IFNUUlBBRFJJR0hUO1xuICAgIHZhciBoYWxmID0gJycsIHBhZF90b19nbztcbiAgICBpZiAoKHBhZF90b19nbyA9IGxlbiAtIHN0ci5sZW5ndGgpID4gMCkge1xuICAgICAgaWYgKHR5cGUgJiBTVFJQQURMRUZUKSB7IHN0ciA9IF9fc3RyX3BhZF9yZXBlYXRlcihzdWIsIHBhZF90b19nbykgKyBzdHI7IH1cbiAgICAgIGVsc2UgaWYgKHR5cGUgJiBTVFJQQURSSUdIVCkge3N0ciA9IHN0ciArIF9fc3RyX3BhZF9yZXBlYXRlcihzdWIsIHBhZF90b19nbyk7IH1cbiAgICAgIGVsc2UgaWYgKHR5cGUgJiBTVFJQQURCT1RIKSB7XG4gICAgICAgIGhhbGYgPSBfX3N0cl9wYWRfcmVwZWF0ZXIoc3ViLCBNYXRoLmNlaWwocGFkX3RvX2dvLzIpKTtcbiAgICAgICAgc3RyID0gaGFsZiArIHN0ciArIGhhbGY7XG4gICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgbGVuKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuICBmdW5jdGlvbiBzdHJfaHRtbGVzY2FwZShodG1sKSB7XG4gICAgcmV0dXJuIGh0bWwucmVwbGFjZSgvJi9nLCBcIiZhbXA7XCIpXG4gICAgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXG4gICAgLnJlcGxhY2UoLz4vZywgXCImZ3Q7XCIpXG4gICAgLnJlcGxhY2UoL1wiL2csIFwiJnF1b3Q7XCIpO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl91cGZpcnN0KHN0cikge1xuICAgIHJldHVybiBzdHIuc3BsaXQoL1tcXHNcXG5cXHRdKy8pLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW0uc3Vic3RyKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBpdGVtLnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICAgIH0pLmpvaW4oJyAnKTtcbiAgfVxuICBmdW5jdGlvbiBzdHJfY2FtZWwoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgvW1xcc1xcblxcdF0rLykubWFwKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgaWYgKCFpbmRleCkgcmV0dXJuIGl0ZW07XG4gICAgICByZXR1cm4gaXRlbS5zdWJzdHIoMCwgMSkudG9VcHBlckNhc2UoKSArIGl0ZW0uc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgfSkuam9pbignJyk7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX2tlYmFiKHN0cikge1xuICAgIHJldHVybiBzdHIuc3BsaXQoL1tcXHNcXG5cXHRdKy8pLmpvaW4oJy0nKTtcbiAgfVxuICBmdW5jdGlvbiBhcnJfdmFsdWVzKG9iaikge1xuICAgIHZhciB2YWx1ZXMgPSBbXSwgaTtcbiAgICBmb3IoaSBpbiBvYmopIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgdmFsdWVzLnB1c2gob2JqW2ldKTtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9jb250YWluKG9iaiwgdmFsdWUpIHtcbiAgICBpZih0eXBlb2Ygb2JqLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHJldHVybiBvYmouaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xuICAgIHZhciBpO1xuICAgIGZvcihpIGluIG9iaikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBpZiAob2JqW2ldID09PSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9sZW4ob2JqKSB7XG4gICAgaWYodHlwZW9mIG9iai5sZW5ndGggIT09ICd1bmRlZmluZWQnKSByZXR1cm4gb2JqLmxlbmd0aDtcbiAgICB2YXIgaSwgbGVuZ3RoID0gMDtcbiAgICBmb3IoaSBpbiBvYmopIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgbGVuZ3RoKys7XG4gICAgcmV0dXJuIGxlbmd0aDtcbiAgfVxuICBmdW5jdGlvbiBhcnJfcHVzaChhcnIsIHZhbHVlKSB7XG4gICAgYXJyLnB1c2godmFsdWUpO1xuICAgIHJldHVybiAnJztcbiAgfVxuICBmdW5jdGlvbiBhcnJfdW5zaGlmdChhcnIsIHZhbHVlKSB7XG4gICAgYXJyLnVuc2hpZnQodmFsdWUpO1xuICAgIHJldHVybiAnJztcbiAgfVxuICBmdW5jdGlvbiBhcnJfcmFuZChhcnIsIHZhbHVlKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhcnIpO1xuICAgIHJldHVybiBhcnJba2V5c1twYXJzZUludChNYXRoLnJhbmRvbSgpICogYXJyX2xlbihhcnIpIC0gMSldXTtcbiAgfVxuICBmdW5jdGlvbiBhcnJfc3BsaWNlKGFyciwgc3QsIGVuLCBlbHMpIHtcbiAgICB2YXIgcHJtcyA9IFtzdF07XG4gICAgaWYgKHR5cGVvZiBlbiAhPT0gJ3VuZGVmaW5lZCcpIHBybXMucHVzaChlbik7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkoYXJyLCBwcm1zLmNvbmNhdChlbHMpKTtcbiAgfVxuICBmdW5jdGlvbiBhcnJfcGFkKHNyYywgbGVuLCBlbCkge1xuICAgIHZhciBpLCBhcnIgPSBzcmMuc2xpY2UoMCk7XG4gICAgaWYobGVuID4gMCkgZm9yKGkgPSBhcnJfbGVuKGFycik7aSA8IGxlbjtpKyspIGFyci5wdXNoKGVsKTtcbiAgICBpZihsZW4gPCAwKSBmb3IoaSA9IGFycl9sZW4oYXJyKTtpIDwgLWxlbjtpKyspIGFyci51bnNoaWZ0KGVsKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9yZXZlcnNlKHNyYykge1xuICAgIHZhciBhcnIgPSBzcmMuc2xpY2UoMCk7XG4gICAgYXJyLnJldmVyc2UoKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9zb3J0KHNyYykge1xuICAgIHZhciBhcnIgPSBzcmMuc2xpY2UoMCk7XG4gICAgYXJyLnNvcnQoKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9zb3J0X3JldmVyc2Uoc3JjKSB7XG4gICAgdmFyIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBhcnIuc29ydCgpO1xuICAgIGFyci5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmdW5jdGlvbiBhcnJfdW5pcXVlKHNyYykge1xuICAgIHZhciBpLCBhcnIgPSBbXTtcbiAgICBmb3IoaSBpbiBzcmMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc3JjLCBpKSkgaWYgKCF+YXJyLmluZGV4T2Yoc3JjW2ldKSkgYXJyLnB1c2goc3JjW2ldKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9rZXkoYXJyLCB2YWx1ZSkge1xuICAgIHZhciBpO1xuICAgIGZvcihpIGluIGFycikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcnIsIGkpKSBpZiAodmFsdWUgPT0gYXJyW2ldKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlKG5hbWUsIGF0dHJzLCBjYikge1xuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ29iamVjdCcpIHJldHVybiBuYW1lO1xuICAgIHZhciBjaGlsZHMgPSBbXTtcbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSBjYihjaGlsZHMpO1xuICAgIGlmIChhdHRycykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ25vZGUnLFxuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBhdHRyczogYXR0cnMsXG4gICAgICAgIGNoaWxkczogY2hpbGRzLmZpbHRlcihmdW5jdGlvbiAoX2NoaWxkKSB7IHJldHVybiBfY2hpbGQgIT09IG51bGw7IH0pXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG5hbWUudG9TdHJpbmcgPT09ICdmdW5jdGlvbicpIG5hbWUgPSBuYW1lLnRvU3RyaW5nKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIHRleHQ6IG5hbWVcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoZGF0YSwgY2hpbGRzKSB7XG4gICAgdmFyIF9jaGlsZHMgPSBbXTtcbnZhciByb3dJbmRleCwgY29sdW1uSW5kZXg7XG52YXIgX3BhcmFtczAgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMSA9ICcnO1xuX2F0dHJWYWx1ZTEgKz0gJ3BvcHVwX19oZWFkJztcbl9wYXJhbXMwWydjbGFzcyddID0gX2F0dHJWYWx1ZTE7XG5fYXR0clZhbHVlMSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXMwLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0J3QsNGB0YLRgNC+0LnQutC4INGC0LDQsdC70LjRhtGLJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuJykpO1xudmFyIF9wYXJhbXMyID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTMgPSAnJztcbl9wYXJhbXMyWydhY3Rpb24nXSA9IF9hdHRyVmFsdWUzO1xuX2F0dHJWYWx1ZTMgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQgPSAnJztcbl9hdHRyVmFsdWU0ICs9ICdmb3JtJztcbl9wYXJhbXMyWydjbGFzcyddID0gX2F0dHJWYWx1ZTQ7XG5fYXR0clZhbHVlNCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNSA9ICcnO1xuX2F0dHJWYWx1ZTUgKz0gJ2NvbmZpZ3MtZm9ybSc7XG5fcGFyYW1zMlsncm9sZSddID0gX2F0dHJWYWx1ZTU7XG5fYXR0clZhbHVlNSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2Zvcm0nLCBfcGFyYW1zMiwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xudmFyIF9wYXJhbXM2ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTcgPSAnJztcbl9hdHRyVmFsdWU3ICs9ICdmb3JtX19pdGVtJztcbl9wYXJhbXM2WydjbGFzcyddID0gX2F0dHJWYWx1ZTc7XG5fYXR0clZhbHVlNyA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM2LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zOCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU5ID0gJyc7XG5fYXR0clZhbHVlOSArPSAnY29uZmlncy10YWJsZS1jb2x1bW5zJztcbl9wYXJhbXM4Wydmb3InXSA9IF9hdHRyVmFsdWU5O1xuX2F0dHJWYWx1ZTkgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTEwID0gJyc7XG5fYXR0clZhbHVlMTAgKz0gJ2Zvcm1fX2xhYmVsJztcbl9wYXJhbXM4WydjbGFzcyddID0gX2F0dHJWYWx1ZTEwO1xuX2F0dHJWYWx1ZTEwID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBfcGFyYW1zOCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Ca0L7Qu9C+0L3QvtC6INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zMTEgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTIgPSAnJztcbl9hdHRyVmFsdWUxMiArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuX3BhcmFtczExWydjbGFzcyddID0gX2F0dHJWYWx1ZTEyO1xuX2F0dHJWYWx1ZTEyID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczExLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXMxMyA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNCA9ICcnO1xuX2F0dHJWYWx1ZTE0ICs9ICd0ZXh0Jztcbl9wYXJhbXMxM1sndHlwZSddID0gX2F0dHJWYWx1ZTE0O1xuX2F0dHJWYWx1ZTE0ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUxNSA9ICcnO1xuX2F0dHJWYWx1ZTE1ICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS12ZXJ5LXNob3J0Jztcbl9wYXJhbXMxM1snY2xhc3MnXSA9IF9hdHRyVmFsdWUxNTtcbl9hdHRyVmFsdWUxNSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTYgPSAnJztcbl9hdHRyVmFsdWUxNiArPSBkYXRhWydjb2x1bW5zJ107XG5fcGFyYW1zMTNbJ3ZhbHVlJ10gPSBfYXR0clZhbHVlMTY7XG5fYXR0clZhbHVlMTYgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE3ID0gJyc7XG5fYXR0clZhbHVlMTcgKz0gJ2NvbmZpZ3MtdGFibGUtY29sdW1ucyc7XG5fcGFyYW1zMTNbJ3JvbGUnXSA9IF9hdHRyVmFsdWUxNztcbl9hdHRyVmFsdWUxNyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTggPSAnJztcbl9hdHRyVmFsdWUxOCArPSAnY29uZmlncy10YWJsZS1jb2x1bW5zJztcbl9wYXJhbXMxM1snaWQnXSA9IF9hdHRyVmFsdWUxODtcbl9hdHRyVmFsdWUxOCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgX3BhcmFtczEzKSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zMTkgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjAgPSAnJztcbl9hdHRyVmFsdWUyMCArPSAnZm9ybV9faXRlbSc7XG5fcGFyYW1zMTlbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMjA7XG5fYXR0clZhbHVlMjAgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMTksIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXMyMSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyMiA9ICcnO1xuX2F0dHJWYWx1ZTIyICs9ICdjb25maWdzLXRhYmxlLXJvd3MnO1xuX3BhcmFtczIxWydmb3InXSA9IF9hdHRyVmFsdWUyMjtcbl9hdHRyVmFsdWUyMiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjMgPSAnJztcbl9hdHRyVmFsdWUyMyArPSAnZm9ybV9fbGFiZWwnO1xuX3BhcmFtczIxWydjbGFzcyddID0gX2F0dHJWYWx1ZTIzO1xuX2F0dHJWYWx1ZTIzID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBfcGFyYW1zMjEsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQodGC0YDQvtC6INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zMjQgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjUgPSAnJztcbl9hdHRyVmFsdWUyNSArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuX3BhcmFtczI0WydjbGFzcyddID0gX2F0dHJWYWx1ZTI1O1xuX2F0dHJWYWx1ZTI1ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczI0LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXMyNiA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyNyA9ICcnO1xuX2F0dHJWYWx1ZTI3ICs9ICd0ZXh0Jztcbl9wYXJhbXMyNlsndHlwZSddID0gX2F0dHJWYWx1ZTI3O1xuX2F0dHJWYWx1ZTI3ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyOCA9ICcnO1xuX2F0dHJWYWx1ZTI4ICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS12ZXJ5LXNob3J0Jztcbl9wYXJhbXMyNlsnY2xhc3MnXSA9IF9hdHRyVmFsdWUyODtcbl9hdHRyVmFsdWUyOCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjkgPSAnJztcbl9hdHRyVmFsdWUyOSArPSBkYXRhWydyb3dzJ107XG5fcGFyYW1zMjZbJ3ZhbHVlJ10gPSBfYXR0clZhbHVlMjk7XG5fYXR0clZhbHVlMjkgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTMwID0gJyc7XG5fYXR0clZhbHVlMzAgKz0gJ2NvbmZpZ3MtdGFibGUtcm93cyc7XG5fcGFyYW1zMjZbJ3JvbGUnXSA9IF9hdHRyVmFsdWUzMDtcbl9hdHRyVmFsdWUzMCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzEgPSAnJztcbl9hdHRyVmFsdWUzMSArPSAnY29uZmlncy10YWJsZS1yb3dzJztcbl9wYXJhbXMyNlsnaWQnXSA9IF9hdHRyVmFsdWUzMTtcbl9hdHRyVmFsdWUzMSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgX3BhcmFtczI2KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zMzIgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzMgPSAnJztcbl9hdHRyVmFsdWUzMyArPSAnZm9ybV9faXRlbSc7XG5fcGFyYW1zMzJbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMzM7XG5fYXR0clZhbHVlMzMgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMzIsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXMzNCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzNSA9ICcnO1xuX2F0dHJWYWx1ZTM1ICs9ICdjb25maWdzLXRhYmxlLXJvd3MnO1xuX3BhcmFtczM0Wydmb3InXSA9IF9hdHRyVmFsdWUzNTtcbl9hdHRyVmFsdWUzNSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMzYgPSAnJztcbl9hdHRyVmFsdWUzNiArPSAnZm9ybV9fbGFiZWwnO1xuX3BhcmFtczM0WydjbGFzcyddID0gX2F0dHJWYWx1ZTM2O1xuX2F0dHJWYWx1ZTM2ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBfcGFyYW1zMzQsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQqNCw0LHQu9C+0L0g0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4nKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXMzNyA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzOCA9ICcnO1xuX2F0dHJWYWx1ZTM4ICs9ICdmb3JtX19pbnAtY29udGFpbiBmb3JtX19pbnAtY29udGFpbi0tZnVsbC13aWR0aCBmb3JtX19pbnAtY29udGFpbi0tc2Nyb2xsLXdyYXAnO1xuX3BhcmFtczM3WydjbGFzcyddID0gX2F0dHJWYWx1ZTM4O1xuX2F0dHJWYWx1ZTM4ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgX3BhcmFtczM3LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXMzOSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0MCA9ICcnO1xuX2F0dHJWYWx1ZTQwICs9ICd0YWJsZSB0YWJsZS0tc3RyYWlnaHQtc2lkZXMgdGFibGUtLXJlc3BvbnNpdmUnO1xuX3BhcmFtczM5WydjbGFzcyddID0gX2F0dHJWYWx1ZTQwO1xuX2F0dHJWYWx1ZTQwID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgndGFibGUnLCBfcGFyYW1zMzksIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbnZhciBfcGFyYW1zNDEgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDIgPSAnJztcbl9hdHRyVmFsdWU0MiArPSAnY29uZmlncy10YWJsZS10Ym9keSc7XG5fcGFyYW1zNDFbJ3JvbGUnXSA9IF9hdHRyVmFsdWU0Mjtcbl9hdHRyVmFsdWU0MiA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ3Rib2R5JywgX3BhcmFtczQxLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICcpKTtcbnZhciBfYXJyNDMgPSBkYXRhWydkZWZhdWx0RGF0YSddO1xuZm9yIChkYXRhWydyb3dJbmRleCddIGluIF9hcnI0Mykge1xuZGF0YVsncm93J10gPSBfYXJyNDNbZGF0YVsncm93SW5kZXgnXV07XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICAgJykpO1xudmFyIF9wYXJhbXM0NCA9IHt9O1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgndHInLCBfcGFyYW1zNDQsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICAgICAnKSk7XG52YXIgX2FycjQ1ID0gZGF0YVsncm93J107XG5mb3IgKGRhdGFbJ2NvbHVtbkluZGV4J10gaW4gX2FycjQ1KSB7XG5kYXRhWydjb2x1bW4nXSA9IF9hcnI0NVtkYXRhWydjb2x1bW5JbmRleCddXTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAgICcpKTtcbnZhciBfcGFyYW1zNDYgPSB7fTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgX3BhcmFtczQ2LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICAgICAnKSk7XG52YXIgX3BhcmFtczQ3ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ4ID0gJyc7XG5fYXR0clZhbHVlNDggKz0gJ3RleHQnO1xuX3BhcmFtczQ3Wyd0eXBlJ10gPSBfYXR0clZhbHVlNDg7XG5fYXR0clZhbHVlNDggPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ5ID0gJyc7XG5fYXR0clZhbHVlNDkgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuX3BhcmFtczQ3WydjbGFzcyddID0gX2F0dHJWYWx1ZTQ5O1xuX2F0dHJWYWx1ZTQ5ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1MCA9ICcnO1xuX2F0dHJWYWx1ZTUwICs9IGRhdGFbJ2NvbHVtbiddO1xuX3BhcmFtczQ3Wyd2YWx1ZSddID0gX2F0dHJWYWx1ZTUwO1xuX2F0dHJWYWx1ZTUwID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1MSA9ICcnO1xuX2F0dHJWYWx1ZTUxICs9ICdjb25maWdzLXRhYmxlLWNlbGwnO1xuX3BhcmFtczQ3Wydyb2xlJ10gPSBfYXR0clZhbHVlNTE7XG5fYXR0clZhbHVlNTEgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTUyID0gJyc7XG5fYXR0clZhbHVlNTIgKz0gZGF0YVsncm93SW5kZXgnXTtcbl9wYXJhbXM0N1snZGF0YS1yb3cnXSA9IF9hdHRyVmFsdWU1Mjtcbl9hdHRyVmFsdWU1MiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNTMgPSAnJztcbl9hdHRyVmFsdWU1MyArPSBkYXRhWydjb2x1bW5JbmRleCddO1xuX3BhcmFtczQ3WydkYXRhLWNvbHVtbiddID0gX2F0dHJWYWx1ZTUzO1xuX2F0dHJWYWx1ZTUzID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBfcGFyYW1zNDcpKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAgICcpKTtcbn1cbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICAgJykpO1xufVxuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zNTQgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNTUgPSAnJztcbl9hdHRyVmFsdWU1NSArPSAnZm9ybV9fc3VibWl0Jztcbl9wYXJhbXM1NFsnY2xhc3MnXSA9IF9hdHRyVmFsdWU1NTtcbl9hdHRyVmFsdWU1NSA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM1NCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczU2ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTU3ID0gJyc7XG5fYXR0clZhbHVlNTcgKz0gJ2Zvcm1fX2J0biBmb3JtX19idG4tLXN1Ym1pdCc7XG5fcGFyYW1zNTZbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNTc7XG5fYXR0clZhbHVlNTcgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBfcGFyYW1zNTYsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQodC+0YXRgNCw0L3QuNGC0YwnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xudmFyIF9wYXJhbXM1OCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1OSA9ICcnO1xuX2F0dHJWYWx1ZTU5ICs9ICdidXR0b24nO1xuX3BhcmFtczU4Wyd0eXBlJ10gPSBfYXR0clZhbHVlNTk7XG5fYXR0clZhbHVlNTkgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTYwID0gJyc7XG5fYXR0clZhbHVlNjAgKz0gJ2Zvcm1fX2J0biBwb3B1cF9fY2FuY2VsJztcbl9wYXJhbXM1OFsnY2xhc3MnXSA9IF9hdHRyVmFsdWU2MDtcbl9hdHRyVmFsdWU2MCA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIF9wYXJhbXM1OCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9Ce0YLQvNC10L3QuNGC0YwnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTsgICAgcmV0dXJuIF9jaGlsZHM7XG4gIH07XG59KTsiLCJBZGRNb2RlbCA9IHJlcXVpcmUgXCIuL2FkZE1vZGVsLmNvZmZlZVwiXG5BZGRWaWV3ID0gcmVxdWlyZSBcIi4vYWRkVmlldy5jb2ZmZWVcIlxuJCA9IHJlcXVpcmUgXCJqcXVlcnktcGx1Z2lucy5jb2ZmZWVcIlxuXG5hZGRNb2RlbCA9IEFkZE1vZGVsKClcbmFkZFZpZXcgPSBBZGRWaWV3ICgkIFwiQGNvbmZpZ3MtYWRkXCIpLCBhZGRNb2RlbFxuXG5tb2RlbHMgPVxuICBpbWFnZTogcmVxdWlyZSBcImltYWdlL0NvbmZpZ3NJbWFnZU1vZGVsLmNvZmZlZVwiXG4gIHRhYmxlOiByZXF1aXJlIFwidGFibGUvQ29uZmlnc1RhYmxlTW9kZWwuY29mZmVlXCJcbiAgZmlsZTogcmVxdWlyZSBcImZpbGUvQ29uZmlnc0ZpbGVNb2RlbC5jb2ZmZWVcIlxuICByYWRpbzogcmVxdWlyZSBcInJhZGlvL0NvbmZpZ3NSYWRpb01vZGVsLmNvZmZlZVwiXG4gIGNoZWNrYm94OiByZXF1aXJlIFwiY2hlY2tib3gvQ29uZmlnc0NoZWNrYm94TW9kZWwuY29mZmVlXCJcbiAgZ2FsbGVyeTogcmVxdWlyZSBcImdhbGxlcnkvQ29uZmlnc0dhbGxlcnlNb2RlbC5jb2ZmZWVcIlxuICBzZWxlY3Q6IHJlcXVpcmUgXCJzZWxlY3QvQ29uZmlnc1NlbGVjdE1vZGVsLmNvZmZlZVwiXG5cbnZpZXdzID1cbiAgaW1hZ2U6IHJlcXVpcmUgXCJpbWFnZS9Db25maWdzSW1hZ2VWaWV3LmNvZmZlZVwiXG4gIHRhYmxlOiByZXF1aXJlIFwidGFibGUvQ29uZmlnc1RhYmxlVmlldy5jb2ZmZWVcIlxuICBmaWxlOiByZXF1aXJlIFwiZmlsZS9Db25maWdzRmlsZVZpZXcuY29mZmVlXCJcbiAgcmFkaW86IHJlcXVpcmUgXCJyYWRpby9Db25maWdzUmFkaW9WaWV3LmNvZmZlZVwiXG4gIGNoZWNrYm94OiByZXF1aXJlIFwiY2hlY2tib3gvQ29uZmlnc0NoZWNrYm94Vmlldy5jb2ZmZWVcIlxuICBnYWxsZXJ5OiByZXF1aXJlIFwiZ2FsbGVyeS9Db25maWdzR2FsbGVyeVZpZXcuY29mZmVlXCJcbiAgc2VsZWN0OiByZXF1aXJlIFwic2VsZWN0L0NvbmZpZ3NTZWxlY3RWaWV3LmNvZmZlZVwiXG5cblBvcHVwID0gcmVxdWlyZSBcInBvcHVwXCJcblxuYWRkVmlldy5vbiBcIm9wZW4tY29uZmlncy1tb2RhbFwiLCAoaW5kZXgsIGZpZWxkLCBmaWVsZHMgPSBbXSkgLT5cbiAgUG9wdXAub3BlbiBcIkBjb25maWdzLXBvcHVwXCJcbiAgZmllbGQuc2V0dGluZ3MuaW5kZXggPSBpbmRleFxuXG4gIG1vZGVsID0gbW9kZWxzW2ZpZWxkLnR5cGVdIGZpZWxkLnNldHRpbmdzXG4gIG1vZGVsLnNldEZpZWxkcyBmaWVsZHMgaWYgbW9kZWwuc2V0RmllbGRzP1xuXG4gICgkIFwiQGNvbmZpZ3MtcG9wdXBcIikuaHRtbCBcIlwiXG4gIHZpZXcgPSB2aWV3c1tmaWVsZC50eXBlXSAoJCBcIkBjb25maWdzLXBvcHVwXCIpLCBtb2RlbFxuXG4gIHZpZXcub24gXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgKGZvcm0pIC0+XG4gICAgY29uc29sZS5sb2cgZm9ybVxuICAgIGFkZE1vZGVsLnNhdmVGaWVsZENvbmZpZ3MgZm9ybVxuICAgIFBvcHVwLmNsb3NlKClcbiAgICB2aWV3LmRlc3Ryb3koKVxuXG5hZGRNb2RlbC5vbiBcIm9uU2F2ZWRTZWN0aW9uXCIsIChhbGlhcykgLT5cbiAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9jbXMvY29uZmlncy8je2FsaWFzfS9cIlxuXG4jIHNldFRpbWVvdXQgPT5cbiMgICAoJCBcIkBidG4tYWRkLWZpZWxkXCIpLnRyaWdnZXIgXCJjbGlja1wiXG4jICAgKCQgXCJAY29uZmlncy1hZGQtdGl0bGVcIilcbiMgICAgIC52YWwgXCLQl9Cw0LzQtdGC0LrQuFwiXG4jICAgICAudHJpZ2dlciBcImNoYW5nZVwiXG4jXG4jICAgKCQgXCJAY29uZmlncy1hZGQtYWxpYXNcIilcbiMgICAgIC52YWwgXCJub3Rlc1wiXG4jICAgICAudHJpZ2dlciBcImNoYW5nZVwiXG4jXG4jICAgc2V0VGltZW91dCA9PlxuIyAgICAgKCQgXCJAcm93LW1vZHVsZS1maWVsZHM6bnRoLWNoaWxkKDEyKSBAZmllbGQtdGl0bGVcIilcbiMgICAgICAgLnZhbCBcItCT0LDQu9C10YDQtdGPXCJcbiMgICAgICAgLnRyaWdnZXIgXCJjaGFuZ2VcIlxuI1xuIyAgICAgKCQgXCJAcm93LW1vZHVsZS1maWVsZHM6bnRoLWNoaWxkKDEyKSBAZmllbGQtYWxpYXNcIilcbiMgICAgICAgLnZhbCBcImdhbGxlcnlcIlxuIyAgICAgICAudHJpZ2dlciBcImNoYW5nZVwiXG4jXG4jICAgICAoJCBcIkByb3ctbW9kdWxlLWZpZWxkczpudGgtY2hpbGQoMTIpIEBmaWVsZC10eXBlXCIpXG4jICAgICAgIC52YWwgXCJnYWxsZXJ5XCJcbiMgICAgICAgLnRyaWdnZXIgXCJjaGFuZ2VcIlxuI1xuIyAgICAgc2V0VGltZW91dCA9PlxuIyAgICAgICAoJCBcIkByb3ctbW9kdWxlLWZpZWxkczpudGgtY2hpbGQoMTIpIEBidG4tY29uZmlnLWZpZWxkXCIpLnRyaWdnZXIgXCJjbGlja1wiXG4jICAgICAsIDIwMFxuI1xuIyAgICwgMjAwXG4jICwgNTAwXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuaHR0cEdldCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cEdldFxuaHR0cFBvc3QgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBQb3N0XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgaW5pdGlhbFN0YXRlOiAtPlxuICAgIGh0dHBHZXQgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgIHN0YXRlID1cbiAgICAgICAgICB0aXRsZTogcmVzcG9uc2UudGl0bGVcbiAgICAgICAgICBhbGlhczogcmVzcG9uc2UuYWxpYXNcbiAgICAgICAgICBtb2R1bGU6IHJlc3BvbnNlLm1vZHVsZVxuICAgICAgICAgIGZpZWxkczogcmVzcG9uc2UuZmllbGRzXG4gICAgICAgICAgdHlwZXM6IHJlc3BvbnNlLnR5cGVzXG4gICAgICAgIGlmIHJlc3BvbnNlLmlkXG4gICAgICAgICAgc3RhdGUuaWQgPSByZXNwb25zZS5pZFxuICAgICAgICBjb25zb2xlLmxvZyBzdGF0ZVxuICAgICAgICBzdGF0ZVxuXG4gIGFkZEZpZWxkOiAoZmllbGQpIC0+XG4gICAgQHNldCBmaWVsZHM6IEBzdGF0ZS5maWVsZHMuY29uY2F0IFtmaWVsZF1cblxuICBhZGRFbXB0eUZpZWxkOiAtPlxuICAgIEBzZXQgZmllbGRzOiBAc3RhdGUuZmllbGRzLmNvbmNhdCBbXG4gICAgICB0aXRsZTogXCJcIlxuICAgICAgYWxpYXM6IFwiXCJcbiAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgIHBvc2l0aW9uOiBAc3RhdGUuZmllbGRzLmxlbmd0aFxuICAgIF1cblxuICB1cGRhdGVUaXRsZTogKHZhbHVlKSAtPiBAc2V0IHRpdGxlOiB2YWx1ZVxuICB1cGRhdGVBbGlhczogKHZhbHVlKSAtPiBAc2V0IGFsaWFzOiB2YWx1ZVxuICB1cGRhdGVNb2R1bGU6ICh2YWx1ZSkgLT4gQHNldCBtb2R1bGU6IHZhbHVlXG5cbiAgdXBkYXRlRmllbGRUaXRsZTogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBmaWVsZHMgPSBAc3RhdGUuZmllbGRzLnNsaWNlKClcbiAgICBmaWVsZHNbaW5kZXhdLnRpdGxlID0gdmFsdWVcbiAgICBAc2V0IHtmaWVsZHN9XG5cbiAgdXBkYXRlRmllbGRBbGlhczogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBmaWVsZHMgPSBAc3RhdGUuZmllbGRzLnNsaWNlKClcbiAgICBmaWVsZHNbaW5kZXhdLmFsaWFzID0gdmFsdWVcbiAgICBAc2V0IHtmaWVsZHN9XG5cbiAgdXBkYXRlRmllbGRUeXBlOiAoaW5kZXgsIHZhbHVlKSAtPlxuICAgIGZpZWxkcyA9IEBzdGF0ZS5maWVsZHMuc2xpY2UoKVxuICAgIGZpZWxkc1tpbmRleF0udHlwZSA9IHZhbHVlXG4gICAgQHJlc2V0U2V0dGluZ3MgaW5kZXhcbiAgICBAc2V0IHtmaWVsZHN9XG5cbiAgcmVzZXRTZXR0aW5nczogKGluZGV4KSAtPlxuICAgIGZpZWxkcyA9IEBzdGF0ZS5maWVsZHMuc2xpY2UoKVxuICAgIHR5cGUgPSBmaWVsZHNbaW5kZXhdLnR5cGVcbiAgICBmb3IgdHlwZUl0ZW0gaW4gQHN0YXRlLnR5cGVzXG4gICAgICBpZiB0eXBlSXRlbS50eXBlID09IHR5cGVcbiAgICAgICAgZmllbGRzW2luZGV4XS5zZXR0aW5ncyA9IEBjbG9uZSB0eXBlSXRlbS5kZWZhdWx0U2V0dGluZ3NcbiAgICBAc2V0IHtmaWVsZHN9XG5cbiAgcmVtb3ZlRmllbGQ6IChpbmRleCkgLT5cbiAgICBmaWVsZHMgPSBAc3RhdGUuZmllbGRzLnNsaWNlKClcbiAgICBmaWVsZHMuc3BsaWNlIGluZGV4LCAxXG4gICAgQHNldCB7ZmllbGRzfVxuXG4gIGdldEZpZWxkQnlJbmRleDogKGluZGV4KSAtPiBAY2xvbmUgQHN0YXRlLmZpZWxkc1sraW5kZXhdXG5cbiAgZ2V0RmllbGRzOiAtPiBAc3RhdGUuZmllbGRzLnNsaWNlKClcblxuICBzYXZlRmllbGRDb25maWdzOiAoZm9ybSkgLT5cbiAgICBpbmRleCA9IGZvcm0uaW5kZXhcbiAgICBkZWxldGUgZm9ybS5pbmRleFxuICAgIGZpZWxkcyA9IEBzdGF0ZS5maWVsZHMuc2xpY2UoKVxuICAgIGZpZWxkc1tpbmRleF0uc2V0dGluZ3MgPSBmb3JtXG4gICAgQHNldCB7ZmllbGRzfVxuXG4gIHVwZGF0ZVBvc2l0aW9uOiAocm93SW5kZXgsIHBvc2l0aW9uKSAtPlxuICAgIGZpZWxkcyA9IEBnZXRGaWVsZHMoKVxuXG4gICAgZGlmZmVyZW50ID0gcm93SW5kZXggLSBwb3NpdGlvblxuXG4gICAgaWYgZGlmZmVyZW50XG4gICAgICBmaWVsZHMuZm9yRWFjaCAoZmllbGQsIGluZGV4KSAtPiBmaWVsZC5wb3NpdGlvbiArPSBkaWZmZXJlbnQgaWYgaW5kZXggPj0gcG9zaXRpb25cbiAgICAgIGZpZWxkc1tyb3dJbmRleF0ucG9zaXRpb24gPSBwb3NpdGlvblxuICAgICAgZmllbGRzLnNvcnQgKGEsIGIpIC0+IGEucG9zaXRpb24gLSBiLnBvc2l0aW9uXG4gICAgICBmaWVsZHMuZm9yRWFjaCAoZmllbGQsIGluZGV4KSAtPiBmaWVsZC5wb3NpdGlvbiA9IGluZGV4XG5cbiAgICAgIEBzZXQge2ZpZWxkc31cblxuICBzYXZlOiAtPlxuICAgIGRhdGEgPVxuICAgICAgYWxpYXM6IEBzdGF0ZS5hbGlhc1xuICAgICAgdGl0bGU6IEBzdGF0ZS50aXRsZVxuICAgICAgbW9kdWxlOiBAc3RhdGUubW9kdWxlXG4gICAgICBmaWVsZHM6IEBzdGF0ZS5maWVsZHNcblxuICAgIGRhdGEuaWQgPSBAc3RhdGUuaWQgaWYgQHN0YXRlLmlkP1xuXG4gICAgaHR0cFBvc3QgXCIvY21zL2NvbmZpZ3MvYWN0aW9uX3NhdmUvXCIsIGRhdGFcbiAgICAgIC50aGVuIChyZXNwb25zZSkgPT5cbiAgICAgICAgY29uc29sZS5sb2cgcmVzcG9uc2UuY29udGVudCBpZiByZXNwb25zZS5jb250ZW50P1xuICAgICAgICBpZiBAc3RhdGUuaWQ/XG4gICAgICAgICAgIyBAc2V0IGZpZWxkczogcmVzcG9uc2Uuc2VjdGlvbi5maWVsZHNcbiAgICAgICAgICBAc2V0IGlkOiByZXNwb25zZS5zZWN0aW9uLmlkXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAdHJpZ2dlciBcIm9uU2F2ZWRTZWN0aW9uXCIsIEBzdGF0ZS5hbGlhc1xuICAgICAgLmNhdGNoIChyZXNwb25zZSkgLT5cbiAgICAgICAgY29uc29sZS5sb2cgcmVzcG9uc2UuY29udGVudCBpZiByZXNwb25zZS5jb250ZW50P1xuICAgICAgICBjb25zb2xlLmVycm9yIHJlc3BvbnNlLmVycm9yIGlmIHJlc3BvbnNlLmVycm9yP1xuIiwiJCA9IHJlcXVpcmUgXCJqcXVlcnktcGx1Z2lucy5jb2ZmZWVcIlxuVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcblBvcHVwID0gcmVxdWlyZSBcInBvcHVwXCJcbnRhYmxlTW9kdWxlRmllbGRzID0gcmVxdWlyZSBcInNlY3Rpb25zL2NvbmZpZ3MvdGFibGUtbW9kdWxlLWZpZWxkc1wiXG4kYm9keSA9ICQgZG9jdW1lbnQuYm9keVxuXG5jcmVhdGVEdXBsaWNhdGVSb3cgPSAoJHJvd1JhdykgLT5cbiAgJGZha2VSb3cgPSAkIFwiPGRpdiBjbGFzcz0nZm9ybS10YWJsZV9fcm93LWZha2UnPjwvZGl2PlwiXG4gIEBwb3NpdGlvbiA9ICRyb3dSYXcub2Zmc2V0KClcbiAgQGZha2VSb3dIZWlnaHQgPSAkcm93UmF3LmhlaWdodCgpXG4gICR0ZHNSYXcgPSAkcm93UmF3LmZpbmQgXCIuZm9ybS10YWJsZV9fY2VsbFwiXG5cbiAgJHRkc1Jhdy5lYWNoIC0+XG4gICAgJHRkUmF3ID0gJCB0aGlzXG4gICAgJHRkQ2hpbGRzUmF3ID0gJCB0aGlzLmNoaWxkTm9kZXNcbiAgICAkZmFrZUNlbGwgPSAkIFwiPGRpdiBjbGFzcz0nZm9ybS10YWJsZV9fY2VsbC1mYWtlJz48L2Rpdj5cIlxuICAgICRmYWtlQ2VsbC5jc3NcbiAgICAgIHdpZHRoOiBcIiN7JHRkUmF3LndpZHRoKCl9cHhcIlxuICAgICAgaGVpZ2h0OiBcIiN7JHRkUmF3LmhlaWdodCgpfXB4XCJcblxuICAgICR0ZENoaWxkc1Jhdy5lYWNoIC0+XG4gICAgICAkY2xvbmUgPSAkIHRoaXMuY2xvbmVOb2RlIHRydWVcbiAgICAgICRmYWtlQ2VsbC5hcHBlbmQgJGNsb25lXG5cbiAgICAkZmFrZVJvdy5hcHBlbmQgJGZha2VDZWxsXG5cbiAgJGZha2VSb3cuY3NzXG4gICAgbGVmdDogXCIje0Bwb3NpdGlvbi5sZWZ0fXB4XCJcbiAgICB0b3A6IFwiI3tAcG9zaXRpb24udG9wfXB4XCJcbiAgJGJvZHkuYXBwZW5kICRmYWtlUm93XG4gIEBmYWtlUm93ID0gJGZha2VSb3dcblxuY3JlYXRlTGluZSA9IC0+XG4gIEBsaW5lID0gJCBcIjxkaXYgY2xhc3M9J2Zvcm0tdGFibGVfX2xpbmUnPjwvZGl2PlwiXG4gICRib2R5LmFwcGVuZCBAbGluZVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgaW5pdGlhbDogLT5cbiAgICBAZHJhZ2dpbmcgPSBmYWxzZVxuICAgIEBmYWtlUm93ID0gbnVsbFxuICAgIEBmYWtlUm93SGVpZ2h0ID0gbnVsbFxuICAgIEBjb29yZHMgPSBudWxsXG4gICAgQGxpbmUgPSBudWxsXG4gICAgQHBvc2l0aW9uID0gbnVsbFxuICAgIEByb3dPZmZzZXRzID0gW11cblxuICBldmVudHM6XG4gICAgXCJjbGljazogQGJ0bi1yZW1vdmUtZmllbGRcIjogKGUpIC0+IEBtb2RlbC5yZW1vdmVGaWVsZCBAZ2V0Um93SW5kZXggZVxuICAgIFwiY2xpY2s6IEBidG4tYWRkLWZpZWxkXCI6IChlKSAtPiBAbW9kZWwuYWRkRW1wdHlGaWVsZCgpXG4gICAgXCJjaGFuZ2U6IEBmaWVsZC10aXRsZVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZUZpZWxkVGl0bGUgKEBnZXRSb3dJbmRleCBlKSwgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGZpZWxkLWFsaWFzXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlRmllbGRBbGlhcyAoQGdldFJvd0luZGV4IGUpLCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAZmllbGQtdHlwZVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZUZpZWxkVHlwZSAoQGdldFJvd0luZGV4IGUpLCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1hZGQtdGl0bGVcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVUaXRsZSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1hZGQtYWxpYXNcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVBbGlhcyBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1hZGQtbW9kdWxlXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlTW9kdWxlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjbGljazogQGJ0bi1jb25maWctZmllbGRcIjogXCJjbGlja0J0bkNvbmZpZ0ZpZWxkXCJcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtYWRkLWZvcm1cIjogXCJzdWJtaXRDb25maWdzQWRkRm9ybVwiXG4gICAgXCJtb3VzZWRvd246IEBidG4tbW92ZS1yb3dcIjogXCJtb3VzZWRvd25CdG5Nb3ZlUm93XCJcbiAgICBcIm1vdXNlbW92ZTogZG9jdW1lbnQuYm9keVwiOiBcIm1vdXNlbW92ZURvY3VtZW50Qm9keVwiXG4gICAgXCJtb3VzZXVwOiBkb2N1bWVudC5ib2R5XCI6IFwibW91c2V1cERvY3VtZW50Qm9keVwiXG5cbiAgbW91c2Vkb3duQnRuTW92ZVJvdzogKGUpIC0+XG4gICAgJGJ0biA9ICQgZS50YXJnZXRcbiAgICBAJHJvdyA9ICRidG4uY2xvc2VzdCBcIkByb3ctbW9kdWxlLWZpZWxkc1wiXG5cbiAgICBAY3VycmVudFJvd0luZGV4ID0gcGFyc2VJbnQgQCRyb3cuZGF0YShcImtleVwiKSwgMTBcblxuICAgIGNyZWF0ZUR1cGxpY2F0ZVJvdy5jYWxsIEAsIEAkcm93XG5cbiAgICBAZHJhZ2dpbmcgPSB0cnVlXG4gICAgQHJvd09mZnNldHMgPSBbXVxuICAgICRyb3dzID0gQGNvbnRhaW4uZmluZCBcIkByb3ctbW9kdWxlLWZpZWxkc1wiXG5cbiAgICAkcm93cy5lYWNoIChpbmRleCwgZWxlbWVudCkgPT5cbiAgICAgICRyb3dJdGVtID0gJCBlbGVtZW50XG4gICAgICBAcm93T2Zmc2V0cy5wdXNoICRyb3dJdGVtLm9mZnNldCgpLnRvcFxuXG4gICAgQCRyb3cuY3NzIGRpc3BsYXk6ICdub25lJ1xuXG4gICAgbGFzdEluZGV4ID0gQHJvd09mZnNldHMubGVuZ3RoIC0gMVxuXG4gICAgQGNvb3JkcyA9XG4gICAgICBsZWZ0OiBlLnBhZ2VYXG4gICAgICB0b3A6IGUucGFnZVlcblxuICAgIGNyZWF0ZUxpbmUuY2FsbCBALCBAJHJvd1xuICAgIEBkcmF3TGluZUJ5SW5kZXggQGN1cnJlbnRSb3dJbmRleFxuXG4gIGdldEluZGV4QnlDb29yZHM6IChlKSAtPlxuICAgIGZvciBvZmZzZXQsIGluZGV4IGluIEByb3dPZmZzZXRzXG4gICAgICBkaWZmID0gTWF0aC5hYnMgQHBvc2l0aW9uLnRvcCArIChlLnBhZ2VZIC0gQGNvb3Jkcy50b3ApIC0gb2Zmc2V0XG5cbiAgICAgIGlmIGRpZmYgPD0gQGZha2VSb3dIZWlnaHQgLyAyXG4gICAgICAgIHJldHVybiBpbmRleFxuXG4gICAgaWYgQHBvc2l0aW9uLnRvcCArIChlLnBhZ2VZIC0gQGNvb3Jkcy50b3ApIC0gQGZha2VSb3dIZWlnaHQgLyAyID4gb2Zmc2V0XG4gICAgICByZXR1cm4gSW5maW5pdHlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gMFxuXG4gIGRyYXdMaW5lQnlJbmRleDogKGluZGV4KSAtPlxuICAgIHRvcCA9IDBcblxuICAgIHRvcCA9IEByb3dPZmZzZXRzW2luZGV4XSBpZiBpbmRleCAhPSBJbmZpbml0eVxuXG4gICAgQGxpbmUuY3NzXG4gICAgICB0b3A6IFwiI3t0b3B9cHhcIlxuXG4gIG1vdXNlbW92ZURvY3VtZW50Qm9keTogKGUpIC0+XG4gICAgaWYgQGRyYWdnaW5nXG4gICAgICBpbmRleCA9IEBnZXRJbmRleEJ5Q29vcmRzIGVcbiAgICAgIGluZGV4ID0gQHJvd09mZnNldHMubGVuZ3RoIGlmIGluZGV4ID09IEluZmluaXR5XG5cbiAgICAgIEBkcmF3TGluZUJ5SW5kZXggaW5kZXhcblxuICAgICAgQGZha2VSb3cuY3NzXG4gICAgICAgIGxlZnQ6IFwiI3tAcG9zaXRpb24ubGVmdCArIChlLnBhZ2VYIC0gQGNvb3Jkcy5sZWZ0KX1weFwiXG4gICAgICAgIHRvcDogXCIje0Bwb3NpdGlvbi50b3AgKyAoZS5wYWdlWSAtIEBjb29yZHMudG9wKX1weFwiXG5cbiAgbW91c2V1cERvY3VtZW50Qm9keTogKGUpIC0+XG4gICAgaWYgQGRyYWdnaW5nXG4gICAgICBpbmRleCA9IEBnZXRJbmRleEJ5Q29vcmRzIGVcbiAgICAgIGluZGV4ID0gQHJvd09mZnNldHMubGVuZ3RoIGlmIGluZGV4ID09IEluZmluaXR5XG5cbiAgICAgIEAkcm93LmNzcyBkaXNwbGF5OiAnJ1xuICAgICAgQGZha2VSb3cucmVtb3ZlKClcbiAgICAgIEBsaW5lLnJlbW92ZSgpXG5cbiAgICAgIEBtb2RlbC51cGRhdGVQb3NpdGlvbiBAY3VycmVudFJvd0luZGV4LCBpbmRleFxuXG4gICAgICBAY3VycmVudFJvd0luZGV4ID0gbnVsbFxuICAgICAgQGRyYWdnaW5nID0gZmFsc2VcbiAgICAgIEBmYWtlUm93ID0gbnVsbFxuICAgICAgQGNvb3JkcyA9IG51bGxcbiAgICAgIEBsaW5lID0gbnVsbFxuICAgICAgQHBvc2l0aW9uID0gbnVsbFxuICAgICAgQGZha2VSb3dIZWlnaHQgPSBudWxsXG4gICAgICBAcm93T2Zmc2V0cy5zcGxpY2UoMClcblxuICBpbml0aWFsOiAtPiBAdGJvZHlDb250YWluID0gUmVuZGVyIHRhYmxlTW9kdWxlRmllbGRzLCAoJCBcIkB0Ym9keS1tb2R1bGUtZmllbGRzXCIpWzBdXG5cbiAgcmVuZGVyOiAoc3RhdGUpIC0+IEB0Ym9keUNvbnRhaW4gc3RhdGVcblxuICBnZXRSb3dJbmRleDogKGUpIC0+XG4gICAgJHBhcmVudCA9ICgkIGUudGFyZ2V0KS5jbG9zZXN0IFwiW2RhdGEta2V5XVwiXG5cbiAgICAkcGFyZW50LmRhdGEgXCJrZXlcIlxuXG4gIGNsaWNrQnRuQ29uZmlnRmllbGQ6IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwib3Blbi1jb25maWdzLW1vZGFsXCIsXG4gICAgICBAZ2V0Um93SW5kZXggZVxuICAgICAgQG1vZGVsLmdldEZpZWxkQnlJbmRleCBAZ2V0Um93SW5kZXggZVxuICAgICAgQG1vZGVsLmdldEZpZWxkcygpXG5cbiAgc3VibWl0Q29uZmlnc0FkZEZvcm06IChlKSAtPlxuICAgIEBtb2RlbC5zYXZlKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuXG4gIHVwZGF0ZU51bU9wdGlvbnM6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSA9IHBhcnNlSW50IHZhbHVlLCAxMFxuICAgIG51bU9wdHMgPSBwYXJzZUludCBAc3RhdGUubnVtT3B0aW9ucywgMTBcbiAgICBkZWZhdWx0RGF0YSA9IEBzdGF0ZS5kZWZhdWx0RGF0YS5zbGljZSgpXG5cbiAgICBpZiAhaXNOYU4gdmFsdWVcbiAgICAgIGlmIHZhbHVlID4gbnVtT3B0c1xuICAgICAgICBmb3IgaSBpbiBbbnVtT3B0cyArIDEuLnZhbHVlXVxuICAgICAgICAgIGRlZmF1bHREYXRhLnB1c2hcbiAgICAgICAgICAgIGxhYmVsOiBcIlwiXG4gICAgICAgICAgICBjaGVja2VkOiBmYWxzZVxuICAgICAgZWxzZSBpZiB2YWx1ZSA8IG51bU9wdHNcbiAgICAgICAgZm9yIGkgaW4gW3ZhbHVlICsgMS4ubnVtT3B0c11cbiAgICAgICAgICBkZWZhdWx0RGF0YS5wb3AoKVxuXG4gICAgICBAc2V0XG4gICAgICAgIG51bU9wdGlvbnM6IHZhbHVlXG4gICAgICAgIGRlZmF1bHREYXRhOiBkZWZhdWx0RGF0YVxuXG4gIHVwZGF0ZURlZmF1bHREYXRhT3B0aW9uQ2hlY2tlZDogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBkYXRhID0gQHN0YXRlLmRlZmF1bHREYXRhLnNsaWNlKClcbiAgICBkYXRhW2luZGV4XS5jaGVja2VkID0gdmFsdWVcbiAgICBAc2V0IGRlZmF1bHREYXRhOiBkYXRhXG5cbiAgdXBkYXRlRGVmYXVsdERhdGFPcHRpb246IChpbmRleCwgdmFsdWUpIC0+XG4gICAgZGF0YSA9IEBzdGF0ZS5kZWZhdWx0RGF0YS5zbGljZSgpXG4gICAgZGF0YVtpbmRleF0ubGFiZWwgPSB2YWx1ZVxuICAgIEBzZXQgZGVmYXVsdERhdGE6IGRhdGFcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlclwiXG5tb2RhbFdpbmRvd1RlbXBsYXRlID0gcmVxdWlyZSBcInR5cGVzL2NoZWNrYm94L21vZGFsXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGluaXRpYWw6IC0+XG4gICAgQG1vZGFsQ29udGFpbiA9IFJlbmRlciBtb2RhbFdpbmRvd1RlbXBsYXRlLCBAY29udGFpblswXVxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtY2hlY2tib3gtbnVtLW9wdGlvbnNcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVOdW1PcHRpb25zIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJibHVyOiBAY29uZmlncy1jaGVja2JveC1udW0tb3B0aW9uc1wiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZU51bU9wdGlvbnMgZS50YXJnZXQudmFsdWVcbiAgICBcImtleWRvd246IEBjb25maWdzLWNoZWNrYm94LW51bS1vcHRpb25zXCI6IChlKSAtPlxuICAgICAgaWYgZS5rZXlDb2RlID09IDEzXG4gICAgICAgIEBtb2RlbC51cGRhdGVOdW1PcHRpb25zIGUudGFyZ2V0LnZhbHVlXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWNoZWNrYm94LW9wdGlvblwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZURlZmF1bHREYXRhT3B0aW9uQ2hlY2tlZCAoQGdldEluZGV4QnlFdmVudCBlKSwgZS50YXJnZXQuY2hlY2tlZFxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1jaGVja2JveC1vcHRpb24tbGFiZWxcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVEZWZhdWx0RGF0YU9wdGlvbiAoQGdldEluZGV4QnlFdmVudCBlKSwgZS50YXJnZXQudmFsdWVcbiAgICBcInBvcHVwLWNsb3NlOiBjb250YWluXCI6IChlKSAtPiBAZGVzdHJveSgpXG5cbiAgZ2V0SW5kZXhCeUV2ZW50OiAoZSkgLT5cbiAgICAkaXRlbSA9ICQgZS50YXJnZXRcbiAgICAkaXRlbS5kYXRhIFwiaW5kZXhcIlxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPlxuICAgIEBtb2RhbENvbnRhaW4gc3RhdGVcblxuICBzdWJtaXRDb25maWdzRm9ybTogKGUpIC0+XG4gICAgQHRyaWdnZXIgXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgQG1vZGVsLmdldFN0YXRlKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5odHRwR2V0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwR2V0XG5odHRwUG9zdCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cFBvc3RcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBpbml0aWFsOiAtPlxuICAgIEBzZXRcbiAgICAgIHMzYXV0aDogZmFsc2VcbiAgICAgIGlzUzNjaGVja2luZzogZmFsc2VcbiAgICAgIGJ1Y2tldHM6IFtdXG4gICAgQHRlc3RDb25uZWN0aW9uUzMoKVxuICAgIEBjaGVja1BhdGgoKVxuXG4gIHVwZGF0ZVN0b3JhZ2U6ICh2YWx1ZSkgLT5cbiAgICBAc2V0IHN0b3JhZ2U6IHZhbHVlXG5cbiAgICBAdGVzdENvbm5lY3Rpb25TMygpIHVubGVzcyBAc3RhdGUuczNhdXRoXG5cbiAgdXBkYXRlUGF0aDogKHZhbHVlKSAtPlxuICAgIEBzZXQgcGF0aDogdmFsdWVcbiAgICBAY2hlY2tQYXRoKClcblxuICBjaGVja1BhdGg6ICgpIC0+XG4gICAgaHR0cEdldCBcIi9jbXMvdHlwZXMvZmlsZS9jaGVja3BhdGgvXCIsXG4gICAgICBwYXRoOiBAc3RhdGUucGF0aFxuICAgIC50aGVuIChyZXNwb25zZSkgPT5cbiAgICAgIEBzZXQgcGF0aEVycm9yOiBmYWxzZVxuICAgICAgQHNldCBwYXRoRXJyb3I6IFwi0J/Rg9GC0Ywg0L3QtSDQvdCw0LnQtNC10L1cIiB1bmxlc3MgcmVzcG9uc2UuZXhpc3RzXG4gICAgICBAc2V0IHBhdGhFcnJvcjogXCLQn9Cw0L/QutCwINC30LDQutGA0YvRgtCwINC90LAg0LfQsNC/0LjRgdGMXCIgdW5sZXNzIHJlc3BvbnNlLndyaXRlUGVybWlzc2lvblxuICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICBjb25zb2xlLmVycm9yIGVycm9yXG5cbiAgdGVzdENvbm5lY3Rpb25TMzogLT5cbiAgICBpZiBAc3RhdGUuc3RvcmFnZSA9PSBcInMzXCIgJiYgQHN0YXRlLnMzQWNjZXNzS2V5ICYmIEBzdGF0ZS5zM1NlY3JldEtleSAmJiAhQHN0YXRlLnMzYXV0aFxuICAgICAgQHNldCBpc1MzY2hlY2tpbmc6IHRydWVcblxuICAgICAgaHR0cEdldCBcIi9jbXMvdHlwZXMvZmlsZS9jaGVjay1zMy1jb25uZWN0aW9uL1wiLFxuICAgICAgICBhY2Nlc3NLZXk6IEBzdGF0ZS5zM0FjY2Vzc0tleVxuICAgICAgICBzZWNyZXRLZXk6IEBzdGF0ZS5zM1NlY3JldEtleVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSA9PlxuICAgICAgICBAc2V0IHMzYXV0aDogcmVzcG9uc2UuYXV0aFxuXG4gICAgICAgIGlmIHJlc3BvbnNlLmF1dGhcbiAgICAgICAgICBpZiBAc3RhdGUuczNCdWNrZXQgbm90IGluIHJlc3BvbnNlLmJ1Y2tldHNcbiAgICAgICAgICAgIEBzZXQgczNCdWNrZXQ6IHJlc3BvbnNlLmJ1Y2tldHNbMF1cblxuICAgICAgICAgIEBzZXQgYnVja2V0czogcmVzcG9uc2UuYnVja2V0c1xuXG4gICAgICAgIEBzZXQgaXNTM2NoZWNraW5nOiBmYWxzZVxuICAgICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgICAgQHNldCBpc1MzY2hlY2tpbmc6IGZhbHNlXG5cbiAgICAgICAgY29uc29sZS5lcnJvciBlcnJvclxuXG4gIHVwZGF0ZVMzQWNjZXNzS2V5OiAodmFsdWUpIC0+XG4gICAgaWYgQHN0YXRlLnMzQWNjZXNzS2V5ICE9IHZhbHVlXG4gICAgICBAc2V0XG4gICAgICAgIHMzYXV0aDogZmFsc2VcbiAgICAgICAgYnVja2V0czogW11cbiAgICAgICAgczNBY2Nlc3NLZXk6IHZhbHVlXG5cbiAgdXBkYXRlUzNTZWNyZXRLZXk6ICh2YWx1ZSkgLT5cbiAgICBpZiBAc3RhdGUuczNTZWNyZXRLZXkgIT0gdmFsdWVcbiAgICAgIEBzZXRcbiAgICAgICAgczNhdXRoOiBmYWxzZVxuICAgICAgICBidWNrZXRzOiBbXVxuICAgICAgICBzM1NlY3JldEtleTogdmFsdWVcblxuICB1cGRhdGVTM0J1Y2tldDogKHZhbHVlKSAtPiBAc2V0IHMzQnVja2V0OiB2YWx1ZVxuXG4gIHVwZGF0ZVMzUGF0aDogKHZhbHVlKSAtPiBAc2V0IHMzUGF0aDogdmFsdWVcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxubW9kYWxXaW5kb3dUZW1wbGF0ZSA9IHJlcXVpcmUgXCJ0eXBlcy9maWxlL21vZGFsXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGluaXRpYWw6IC0+XG4gICAgQG1vZGFsQ29udGFpbiA9IFJlbmRlciBtb2RhbFdpbmRvd1RlbXBsYXRlLCBAY29udGFpblswXVxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNsaWNrOiBAY29uZmlncy1maWxlLXN0b3JhZ2VcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVTdG9yYWdlICgkIGUudGFyZ2V0KS5kYXRhIFwidmFsdWVcIlxuICAgIFwia2V5ZG93bjogQGNvbmZpZ3MtZmlsZS1wYXRoXCI6IChlKSAtPiBAbW9kZWwucmVzZXRQYXRoKClcbiAgICBcImtleXVwIGlucHV0OiBAY29uZmlncy1maWxlLXBhdGhcIjogKGUpIC0+ICBAZnJlcXVlbmN5IDUwMCwgPT4gQG1vZGVsLnVwZGF0ZVBhdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS1wYXRoXCI6IChlKSAtPiAgQG1vZGVsLnVwZGF0ZVBhdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZSBrZXl1cCBpbnB1dCBibHVyOiBAY29uZmlncy1maWxlLXMzLWFjY2Vzcy1rZXlcIjogKGUpIC0+IEBmcmVxdWVuY3kgNTAwLCA9PiBAbW9kZWwudXBkYXRlUzNBY2Nlc3NLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZSBrZXl1cCBpbnB1dCBibHVyOiBAY29uZmlncy1maWxlLXMzLXNlY3JldC1rZXlcIjogKGUpIC0+IEBmcmVxdWVuY3kgNTAwLCA9PiBAbW9kZWwudXBkYXRlUzNTZWNyZXRLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS1zMy1idWNrZXRcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVTM0J1Y2tldCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlIGtleXVwIGlucHV0OiBAY29uZmlncy1maWxlLXMzLXBhdGhcIjogKGUpIC0+IEBmcmVxdWVuY3kgNTAwLCA9PiBAbW9kZWwudXBkYXRlUzNQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjbGljazogQHRlc3QtY29ubmVjdGlvbi1zM1wiOiAoZSkgLT4gQG1vZGVsLnRlc3RDb25uZWN0aW9uUzMoKVxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEBkZXN0cm95KClcblxuICByZW5kZXI6IChzdGF0ZSkgLT4gQG1vZGFsQ29udGFpbiBzdGF0ZVxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBAbW9kZWwuZ2V0U3RhdGUoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcbmh0dHBHZXQgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBHZXRcbmh0dHBQb3N0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwUG9zdFxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIGluaXRpYWw6IC0+XG4gICAgQHRlc3RDb25uZWN0aW9uUzMoKVxuICAgIEBjaGVja1BhdGgoKVxuXG4gIGRlZmF1bHRTdGF0ZTogKCkgLT5cbiAgICBzdG9yYWdlOiBcImxvY2FsXCJcbiAgICBzM2F1dGg6IGZhbHNlXG4gICAgaXNTM2NoZWNraW5nOiBmYWxzZVxuICAgIGJ1Y2tldHM6IFtdXG4gICAgcGF0aDogXCIvXCJcbiAgICB3aWR0aDogXCJcIlxuICAgIGhlaWdodDogXCJcIlxuICAgIHByZXZpZXdXaWR0aDogXCJcIlxuICAgIHByZXZpZXdIZWlnaHQ6IFwiXCJcbiAgICBwYXRoRXJyb3I6IGZhbHNlXG4gICAgczNBY2Nlc3NLZXk6IFwiXCJcbiAgICBzM1NlY3JldEtleTogXCJcIlxuICAgIHMzYXV0aDogZmFsc2VcbiAgICBzM0J1Y2tldDogXCJcIlxuXG4gIHVwZGF0ZVN0b3JhZ2U6ICh2YWx1ZSkgLT5cbiAgICBAc2V0IHN0b3JhZ2U6IHZhbHVlXG5cbiAgICBAdGVzdENvbm5lY3Rpb25TMygpIHVubGVzcyBAc3RhdGUuczNhdXRoXG5cbiAgdXBkYXRlUGF0aDogKHZhbHVlKSAtPlxuICAgIEBzZXQgcGF0aDogdmFsdWVcbiAgICBAY2hlY2tQYXRoKClcblxuICBjaGVja1BhdGg6ICgpIC0+XG4gICAgaHR0cEdldCBcIi9jbXMvdHlwZXMvZ2FsbGVyeS9jaGVja3BhdGgvXCIsXG4gICAgICBwYXRoOiBAc3RhdGUucGF0aFxuICAgIC50aGVuIChyZXNwb25zZSkgPT5cbiAgICAgIEBzZXQgcGF0aEVycm9yOiBmYWxzZVxuICAgICAgQHNldCBwYXRoRXJyb3I6IFwi0J/Rg9GC0Ywg0L3QtSDQvdCw0LnQtNC10L1cIiB1bmxlc3MgcmVzcG9uc2UuZXhpc3RzXG4gICAgICBAc2V0IHBhdGhFcnJvcjogXCLQn9Cw0L/QutCwINC30LDQutGA0YvRgtCwINC90LAg0LfQsNC/0LjRgdGMXCIgdW5sZXNzIHJlc3BvbnNlLndyaXRlUGVybWlzc2lvblxuICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICBjb25zb2xlLmVycm9yIGVycm9yXG5cbiAgcmVzZXRQYXRoOiAtPiBAc2V0IHBhdGhFcnJvcjogZmFsc2VcblxuICB0ZXN0Q29ubmVjdGlvblMzOiAtPlxuICAgIGlmIEBzdGF0ZS5zdG9yYWdlID09IFwiczNcIiAmJiBAc3RhdGUuczNBY2Nlc3NLZXkgJiYgQHN0YXRlLnMzU2VjcmV0S2V5ICYmICFAc3RhdGUuczNhdXRoXG4gICAgICBAc2V0IGlzUzNjaGVja2luZzogdHJ1ZVxuXG4gICAgICBodHRwR2V0IFwiL2Ntcy90eXBlcy9nYWxsZXJ5L2NoZWNrLXMzLWNvbm5lY3Rpb24vXCIsXG4gICAgICAgIGFjY2Vzc0tleTogQHN0YXRlLnMzQWNjZXNzS2V5XG4gICAgICAgIHNlY3JldEtleTogQHN0YXRlLnMzU2VjcmV0S2V5XG4gICAgICAudGhlbiAocmVzcG9uc2UpID0+XG4gICAgICAgIEBzZXQgczNhdXRoOiByZXNwb25zZS5hdXRoXG5cbiAgICAgICAgaWYgcmVzcG9uc2UuYXV0aFxuICAgICAgICAgIGlmIEBzdGF0ZS5zM0J1Y2tldCBub3QgaW4gcmVzcG9uc2UuYnVja2V0c1xuICAgICAgICAgICAgQHNldCBzM0J1Y2tldDogcmVzcG9uc2UuYnVja2V0c1swXVxuXG4gICAgICAgICAgQHNldCBidWNrZXRzOiByZXNwb25zZS5idWNrZXRzXG5cbiAgICAgICAgQHNldCBpc1MzY2hlY2tpbmc6IGZhbHNlXG4gICAgICAuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgICBAc2V0IGlzUzNjaGVja2luZzogZmFsc2VcblxuICAgICAgICBjb25zb2xlLmVycm9yIGVycm9yXG5cbiAgdXBkYXRlUzNBY2Nlc3NLZXk6ICh2YWx1ZSkgLT5cbiAgICBpZiBAc3RhdGUuczNBY2Nlc3NLZXkgIT0gdmFsdWVcbiAgICAgIEBzZXRcbiAgICAgICAgczNhdXRoOiBmYWxzZVxuICAgICAgICBidWNrZXRzOiBbXVxuXG4gICAgQHNldCBzM0FjY2Vzc0tleTogdmFsdWVcblxuICB1cGRhdGVTM1NlY3JldEtleTogKHZhbHVlKSAtPlxuICAgIGlmIHZhbHVlICYmIEBzdGF0ZS5zM1NlY3JldEtleSAhPSB2YWx1ZVxuICAgICAgQHNldFxuICAgICAgICBzM2F1dGg6IGZhbHNlXG4gICAgICAgIGJ1Y2tldHM6IGZhbHNlXG4gICAgICAgIHMzU2VjcmV0S2V5OiB2YWx1ZVxuXG4gIHVwZGF0ZVMzQnVja2V0OiAodmFsdWUpIC0+IEBzZXQgczNCdWNrZXQ6IHZhbHVlXG5cbiAgdXBkYXRlUzNQYXRoOiAodmFsdWUpIC0+XG4gICAgaWYgQHN0YXRlLnMzUGF0aCAhPSB2YWx1ZVxuICAgICAgQHMzUmVzZXRQYXRoKClcbiAgICAgIEBzZXQgczNQYXRoOiB2YWx1ZVxuXG4gIHVwZGF0ZVdpZHRoOiAodmFsdWUpIC0+IEBzZXQgd2lkdGg6IHZhbHVlXG4gIHVwZGF0ZUhlaWdodDogKHZhbHVlKSAtPiBAc2V0IGhlaWdodDogdmFsdWVcbiAgdXBkYXRlTWF4U2l6ZTogKHZhbHVlKSAtPiBAc2V0IG1heHNpemU6IHZhbHVlXG4gIHVwZGF0ZVNvdXJjZTogKHZhbHVlKSAtPiBAc2V0IHNvdXJjZTogdmFsdWVcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxubW9kYWxXaW5kb3dUZW1wbGF0ZSA9IHJlcXVpcmUgXCJ0eXBlcy9nYWxsZXJ5L21vZGFsXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGluaXRpYWw6IC0+XG4gICAgQG1vZGFsQ29udGFpbiA9IFJlbmRlciBtb2RhbFdpbmRvd1RlbXBsYXRlLCBAY29udGFpblswXVxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNsaWNrOiBAY29uZmlncy1nYWxsZXJ5LXN0b3JhZ2VcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVTdG9yYWdlICgkIGUudGFyZ2V0KS5kYXRhIFwidmFsdWVcIlxuICAgIFwia2V5ZG93bjogQGNvbmZpZ3MtZ2FsbGVyeS1wYXRoXCI6IChlKSAtPiBAbW9kZWwucmVzZXRQYXRoKClcbiAgICBcImtleXVwIGlucHV0OiBAY29uZmlncy1nYWxsZXJ5LXBhdGhcIjogKGUpIC0+ICBAZnJlcXVlbmN5IDUwMCwgPT4gQG1vZGVsLnVwZGF0ZVBhdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1wYXRoXCI6IChlKSAtPiAgQG1vZGVsLnVwZGF0ZVBhdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZSBrZXl1cCBpbnB1dCBibHVyOiBAY29uZmlncy1nYWxsZXJ5LXMzLWFjY2Vzcy1rZXlcIjogKGUpIC0+IEBmcmVxdWVuY3kgNTAwLCA9PiBAbW9kZWwudXBkYXRlUzNBY2Nlc3NLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZSBrZXl1cCBpbnB1dCBibHVyOiBAY29uZmlncy1nYWxsZXJ5LXMzLXNlY3JldC1rZXlcIjogKGUpIC0+IEBmcmVxdWVuY3kgNTAwLCA9PiBAbW9kZWwudXBkYXRlUzNTZWNyZXRLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1zMy1idWNrZXRcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVTM0J1Y2tldCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlIGtleXVwIGlucHV0OiBAY29uZmlncy1nYWxsZXJ5LXMzLXBhdGhcIjogKGUpIC0+IEBmcmVxdWVuY3kgNTAwLCA9PiBAbW9kZWwudXBkYXRlUzNQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWdhbGxlcnktd2lkdGhcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVXaWR0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1nYWxsZXJ5LWhlaWdodFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZUhlaWdodCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1nYWxsZXJ5LW1heHNpemVcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVNYXhTaXplIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWdhbGxlcnktc291cmNlXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlU291cmNlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjbGljazogQHRlc3QtY29ubmVjdGlvbi1zM1wiOiAoZSkgLT4gQG1vZGVsLnRlc3RDb25uZWN0aW9uUzMoKVxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEBkZXN0cm95KClcblxuICByZW5kZXI6IChzdGF0ZSkgLT4gQG1vZGFsQ29udGFpbiBzdGF0ZVxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBAbW9kZWwuZ2V0U3RhdGUoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcbmh0dHBHZXQgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBHZXRcbmh0dHBQb3N0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwUG9zdFxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIHNldEZpZWxkczogKGZpZWxkcykgLT5cbiAgICBzb3VyY2VzID0gW11cblxuICAgIGZvciBmaWVsZCwgaW5kZXggaW4gZmllbGRzXG4gICAgICBpZiBmaWVsZC50eXBlID09IFwiaW1hZ2VcIiAmJiBpbmRleCAhPSBAc3RhdGUuaW5kZXggJiYgZmllbGQuYWxpYXNcbiAgICAgICAgc291cmNlcy5wdXNoIGFsaWFzOiBmaWVsZC5hbGlhcywgbGFiZWw6IGZpZWxkLnRpdGxlXG5cbiAgICBAc2V0IHtzb3VyY2VzfVxuXG4gIGluaXRpYWw6IC0+XG4gICAgQHRlc3RDb25uZWN0aW9uUzMoKVxuICAgIEBjaGVja1BhdGgoKVxuXG4gIGRlZmF1bHRTdGF0ZTogKCkgLT5cbiAgICBzdG9yYWdlOiBcImxvY2FsXCJcbiAgICBzM2F1dGg6IGZhbHNlXG4gICAgaXNTM2NoZWNraW5nOiBmYWxzZVxuICAgIGJ1Y2tldHM6IFtdXG4gICAgc291cmNlczogW11cbiAgICBwYXRoOiBcIi9cIlxuICAgIHdpZHRoOiBcIjBcIlxuICAgIGhlaWdodDogXCIwXCJcbiAgICBzYXZlUmF0aW86IGZhbHNlXG4gICAgcGF0aEVycm9yOiBmYWxzZVxuICAgIHMzQWNjZXNzS2V5OiBcIlwiXG4gICAgczNTZWNyZXRLZXk6IFwiXCJcbiAgICBzM2F1dGg6IGZhbHNlXG4gICAgczNCdWNrZXQ6IFwiXCJcblxuICB1cGRhdGVTdG9yYWdlOiAodmFsdWUpIC0+XG4gICAgQHNldCBzdG9yYWdlOiB2YWx1ZVxuXG4gICAgQHRlc3RDb25uZWN0aW9uUzMoKSB1bmxlc3MgQHN0YXRlLnMzYXV0aFxuXG4gIHVwZGF0ZVBhdGg6ICh2YWx1ZSkgLT5cbiAgICBAc2V0IHBhdGg6IHZhbHVlXG4gICAgQGNoZWNrUGF0aCgpXG5cbiAgY2hlY2tQYXRoOiAoKSAtPlxuICAgIGh0dHBHZXQgXCIvY21zL3R5cGVzL2ltYWdlL2NoZWNrcGF0aC9cIixcbiAgICAgIHBhdGg6IEBzdGF0ZS5wYXRoXG4gICAgLnRoZW4gKHJlc3BvbnNlKSA9PlxuICAgICAgQHNldCBwYXRoRXJyb3I6IGZhbHNlXG4gICAgICBAc2V0IHBhdGhFcnJvcjogXCLQn9GD0YLRjCDQvdC1INC90LDQudC00LXQvVwiIHVubGVzcyByZXNwb25zZS5leGlzdHNcbiAgICAgIEBzZXQgcGF0aEVycm9yOiBcItCf0LDQv9C60LAg0LfQsNC60YDRi9GC0LAg0L3QsCDQt9Cw0L/QuNGB0YxcIiB1bmxlc3MgcmVzcG9uc2Uud3JpdGVQZXJtaXNzaW9uXG4gICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIGNvbnNvbGUuZXJyb3IgZXJyb3JcblxuICByZXNldFBhdGg6IC0+IEBzZXQgcGF0aEVycm9yOiBmYWxzZVxuXG4gIHRlc3RDb25uZWN0aW9uUzM6IC0+XG4gICAgaWYgQHN0YXRlLnN0b3JhZ2UgPT0gXCJzM1wiICYmIEBzdGF0ZS5zM0FjY2Vzc0tleSAmJiBAc3RhdGUuczNTZWNyZXRLZXkgJiYgIUBzdGF0ZS5zM2F1dGhcbiAgICAgIEBzZXQgaXNTM2NoZWNraW5nOiB0cnVlXG5cbiAgICAgIGh0dHBHZXQgXCIvY21zL3R5cGVzL2ltYWdlL2NoZWNrLXMzLWNvbm5lY3Rpb24vXCIsXG4gICAgICAgIGFjY2Vzc0tleTogQHN0YXRlLnMzQWNjZXNzS2V5XG4gICAgICAgIHNlY3JldEtleTogQHN0YXRlLnMzU2VjcmV0S2V5XG4gICAgICAudGhlbiAocmVzcG9uc2UpID0+XG4gICAgICAgIEBzZXQgczNhdXRoOiByZXNwb25zZS5hdXRoXG5cbiAgICAgICAgaWYgcmVzcG9uc2UuYXV0aFxuICAgICAgICAgIGlmIEBzdGF0ZS5zM0J1Y2tldCBub3QgaW4gcmVzcG9uc2UuYnVja2V0c1xuICAgICAgICAgICAgQHNldCBzM0J1Y2tldDogcmVzcG9uc2UuYnVja2V0c1swXVxuXG4gICAgICAgICAgQHNldCBidWNrZXRzOiByZXNwb25zZS5idWNrZXRzXG5cbiAgICAgICAgQHNldCBpc1MzY2hlY2tpbmc6IGZhbHNlXG4gICAgICAuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgICBAc2V0IGlzUzNjaGVja2luZzogZmFsc2VcblxuICAgICAgICBjb25zb2xlLmVycm9yIGVycm9yXG5cbiAgdXBkYXRlUzNBY2Nlc3NLZXk6ICh2YWx1ZSkgLT5cbiAgICBpZiBAc3RhdGUuczNBY2Nlc3NLZXkgIT0gdmFsdWVcbiAgICAgIEBzZXRcbiAgICAgICAgczNhdXRoOiBmYWxzZVxuICAgICAgICBidWNrZXRzOiBbXVxuXG4gICAgQHNldCBzM0FjY2Vzc0tleTogdmFsdWVcblxuICB1cGRhdGVTM1NlY3JldEtleTogKHZhbHVlKSAtPlxuICAgIGlmIHZhbHVlICYmIEBzdGF0ZS5zM1NlY3JldEtleSAhPSB2YWx1ZVxuICAgICAgQHNldFxuICAgICAgICBzM2F1dGg6IGZhbHNlXG4gICAgICAgIGJ1Y2tldHM6IGZhbHNlXG4gICAgICAgIHMzU2VjcmV0S2V5OiB2YWx1ZVxuXG4gIHVwZGF0ZVMzQnVja2V0OiAodmFsdWUpIC0+IEBzZXQgczNCdWNrZXQ6IHZhbHVlXG5cbiAgdXBkYXRlUzNQYXRoOiAodmFsdWUpIC0+XG4gICAgaWYgQHN0YXRlLnMzUGF0aCAhPSB2YWx1ZVxuICAgICAgQHMzUmVzZXRQYXRoKClcbiAgICAgIEBzZXQgczNQYXRoOiB2YWx1ZVxuXG4gIHVwZGF0ZVdpZHRoOiAodmFsdWUpIC0+IEBzZXQgd2lkdGg6IHZhbHVlXG4gIHVwZGF0ZUhlaWdodDogKHZhbHVlKSAtPiBAc2V0IGhlaWdodDogdmFsdWVcbiAgdXBkYXRlU2F2ZVJhdGlvOiAodmFsdWUpIC0+IEBzZXQgc2F2ZVJhdGlvOiB2YWx1ZVxuICB1cGRhdGVTb3VyY2U6ICh2YWx1ZSkgLT4gQHNldCBzb3VyY2U6IHZhbHVlXG5cbiAgZ2V0U3RhdGU6IC0+XG4gICAgc3RhdGUgPSB7fVxuICAgIGZvciBrZXkgb2YgQHN0YXRlXG4gICAgICBzdGF0ZVtrZXldID0gQHN0YXRlW2tleV0gdW5sZXNzIGtleSA9PSBcImZpZWxkc1wiXG4gICAgc3RhdGVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlclwiXG5tb2RhbFdpbmRvd1RlbXBsYXRlID0gcmVxdWlyZSBcInR5cGVzL2ltYWdlL21vZGFsXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGluaXRpYWw6IC0+XG4gICAgQG1vZGFsQ29udGFpbiA9IFJlbmRlciBtb2RhbFdpbmRvd1RlbXBsYXRlLCBAY29udGFpblswXVxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNsaWNrOiBAY29uZmlncy1pbWFnZS1zdG9yYWdlXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlU3RvcmFnZSAoJCBlLnRhcmdldCkuZGF0YSBcInZhbHVlXCJcbiAgICBcImtleWRvd246IEBjb25maWdzLWltYWdlLXBhdGhcIjogKGUpIC0+IEBtb2RlbC5yZXNldFBhdGgoKVxuICAgIFwia2V5dXAgaW5wdXQ6IEBjb25maWdzLWltYWdlLXBhdGhcIjogKGUpIC0+ICBAZnJlcXVlbmN5IDUwMCwgPT4gQG1vZGVsLnVwZGF0ZVBhdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2UtcGF0aFwiOiAoZSkgLT4gIEBtb2RlbC51cGRhdGVQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2Uga2V5dXAgaW5wdXQgYmx1cjogQGNvbmZpZ3MtaW1hZ2UtczMtYWNjZXNzLWtleVwiOiAoZSkgLT4gQGZyZXF1ZW5jeSA1MDAsID0+IEBtb2RlbC51cGRhdGVTM0FjY2Vzc0tleSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlIGtleXVwIGlucHV0IGJsdXI6IEBjb25maWdzLWltYWdlLXMzLXNlY3JldC1rZXlcIjogKGUpIC0+IEBmcmVxdWVuY3kgNTAwLCA9PiBAbW9kZWwudXBkYXRlUzNTZWNyZXRLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2UtczMtYnVja2V0XCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUzNCdWNrZXQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZSBrZXl1cCBpbnB1dDogQGNvbmZpZ3MtaW1hZ2UtczMtcGF0aFwiOiAoZSkgLT4gQGZyZXF1ZW5jeSA1MDAsID0+IEBtb2RlbC51cGRhdGVTM1BhdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2Utd2lkdGhcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVXaWR0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1oZWlnaHRcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVIZWlnaHQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2Utc2F2ZS1yYXRpb1wiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVNhdmVSYXRpbyBlLnRhcmdldC5jaGVja2VkXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXNvdXJjZVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVNvdXJjZSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2xpY2s6IEB0ZXN0LWNvbm5lY3Rpb24tczNcIjogKGUpIC0+IEBtb2RlbC50ZXN0Q29ubmVjdGlvblMzKClcbiAgICBcInBvcHVwLWNsb3NlOiBjb250YWluXCI6IChlKSAtPiBAZGVzdHJveSgpXG5cbiAgcmVuZGVyOiAoc3RhdGUpIC0+IEBtb2RhbENvbnRhaW4gc3RhdGVcblxuICBzdWJtaXRDb25maWdzRm9ybTogKGUpIC0+XG4gICAgQHRyaWdnZXIgXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgQG1vZGVsLmdldFN0YXRlKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgaW5pdGlhbDogLT5cbiAgICBpZiArIEBzdGF0ZS5kZWZhdWx0VmFsdWUgPT0gLTFcbiAgICAgIGRlZmF1bHREYXRhID0gQHN0YXRlLmRlZmF1bHREYXRhLnNsaWNlKDApXG4gICAgICBkZWZhdWx0RGF0YS5zaGlmdCgpXG4gICAgICBAc2V0IHtkZWZhdWx0RGF0YX1cblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG5cbiAgdXBkYXRlTnVtT3B0aW9uczogKHZhbHVlKSAtPlxuICAgIHZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG4gICAgbnVtT3B0cyA9IHBhcnNlSW50IEBzdGF0ZS5udW1PcHRpb25zLCAxMFxuICAgIGRlZmF1bHRWYWx1ZSA9IHBhcnNlSW50IEBzdGF0ZS5kZWZhdWx0VmFsdWUsIDEwXG4gICAgZGVmYXVsdERhdGEgPSBAc3RhdGUuZGVmYXVsdERhdGEuc2xpY2UoKVxuXG4gICAgaWYgIWlzTmFOIHZhbHVlXG4gICAgICBpZiB2YWx1ZSA+IG51bU9wdHNcbiAgICAgICAgZm9yIGkgaW4gW251bU9wdHMgKyAxLi52YWx1ZV1cbiAgICAgICAgICBkZWZhdWx0RGF0YS5wdXNoIFwiXCJcbiAgICAgIGVsc2UgaWYgdmFsdWUgPCBudW1PcHRzXG4gICAgICAgIGZvciBpIGluIFt2YWx1ZSArIDEuLm51bU9wdHNdXG4gICAgICAgICAgZGVmYXVsdERhdGEucG9wKClcbiAgICAgICAgaWYgZGVmYXVsdFZhbHVlID49IHZhbHVlXG4gICAgICAgICAgQHNldCB7ZGVmYXVsdFZhbHVlfVxuXG4gICAgICBkZWZhdWx0VmFsdWUgPSAtMSBpZiBkZWZhdWx0VmFsdWUgKyAxID49IHZhbHVlXG5cbiAgICAgIEBzZXRcbiAgICAgICAgbnVtT3B0aW9uczogdmFsdWVcbiAgICAgICAgZGVmYXVsdERhdGE6IGRlZmF1bHREYXRhXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogZGVmYXVsdFZhbHVlXG5cbiAgdXBkYXRlRGVmYXVsdFZhbHVlOiAodmFsdWUpIC0+IEBzZXQgZGVmYXVsdFZhbHVlOiBwYXJzZUludCB2YWx1ZSwgMTBcblxuICB1cGRhdGVEZWZhdWx0RGF0YU9wdGlvbjogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBkYXRhID0gQHN0YXRlLmRlZmF1bHREYXRhLnNsaWNlKClcbiAgICBkYXRhW2luZGV4XSA9IHZhbHVlXG4gICAgQHNldCBkZWZhdWx0RGF0YTogZGF0YVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcbm1vZGFsV2luZG93VGVtcGxhdGUgPSByZXF1aXJlIFwidHlwZXMvcmFkaW8vbW9kYWxcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgaW5pdGlhbDogLT5cbiAgICBAb3B0aW9uc0NvbnRhaW4gPSBSZW5kZXIgbW9kYWxXaW5kb3dUZW1wbGF0ZSwgQGNvbnRhaW5bMF1cblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG5cbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtcmFkaW8tbnVtLW9wdGlvbnNcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVOdW1PcHRpb25zIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJibHVyOiBAY29uZmlncy1yYWRpby1udW0tb3B0aW9uc1wiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZU51bU9wdGlvbnMgZS50YXJnZXQudmFsdWVcbiAgICBcImtleWRvd246IEBjb25maWdzLXJhZGlvLW51bS1vcHRpb25zXCI6IChlKSAtPlxuICAgICAgaWYgZS5rZXlDb2RlID09IDEzXG4gICAgICAgIEBtb2RlbC51cGRhdGVOdW1PcHRpb25zIGUudGFyZ2V0LnZhbHVlXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLXJhZGlvLW9wdGlvblwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZURlZmF1bHRWYWx1ZSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1yYWRpby1vcHRpb24tbGFiZWxcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVEZWZhdWx0RGF0YU9wdGlvbiAoQGdldEluZGV4QnlFdmVudCBlKSwgZS50YXJnZXQudmFsdWVcbiAgICBcInBvcHVwLWNsb3NlOiBjb250YWluXCI6IChlKSAtPiBAZGVzdHJveSgpXG5cbiAgZ2V0SW5kZXhCeUV2ZW50OiAoZSkgLT5cbiAgICAkaXRlbSA9ICQgZS50YXJnZXRcbiAgICAkaXRlbS5kYXRhIFwiaW5kZXhcIlxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPlxuICAgIEBvcHRpb25zQ29udGFpbiBzdGF0ZVxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBAbW9kZWwuZ2V0U3RhdGUoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBpbml0aWFsOiAtPlxuICAgIGlmICsgQHN0YXRlLmRlZmF1bHRWYWx1ZSA9PSAtMVxuICAgICAgZGVmYXVsdERhdGEgPSBAc3RhdGUuZGVmYXVsdERhdGEuc2xpY2UoMClcbiAgICAgIGRlZmF1bHREYXRhLnNoaWZ0KClcbiAgICAgIEBzZXQge2RlZmF1bHREYXRhfVxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcblxuICB1cGRhdGVOdW1PcHRpb25zOiAodmFsdWUpIC0+XG4gICAgdmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcbiAgICBudW1PcHRzID0gcGFyc2VJbnQgQHN0YXRlLm51bU9wdGlvbnMsIDEwXG4gICAgZGVmYXVsdFZhbHVlID0gcGFyc2VJbnQgQHN0YXRlLmRlZmF1bHRWYWx1ZSwgMTBcbiAgICBkZWZhdWx0RGF0YSA9IEBzdGF0ZS5kZWZhdWx0RGF0YS5zbGljZSgpXG5cbiAgICBpZiAhaXNOYU4gdmFsdWVcbiAgICAgIGlmIHZhbHVlID4gbnVtT3B0c1xuICAgICAgICBmb3IgaSBpbiBbbnVtT3B0cyArIDEuLnZhbHVlXVxuICAgICAgICAgIGRlZmF1bHREYXRhLnB1c2ggXCJcIlxuICAgICAgZWxzZSBpZiB2YWx1ZSA8IG51bU9wdHNcbiAgICAgICAgZm9yIGkgaW4gW3ZhbHVlICsgMS4ubnVtT3B0c11cbiAgICAgICAgICBkZWZhdWx0RGF0YS5wb3AoKVxuICAgICAgICBpZiBkZWZhdWx0VmFsdWUgPj0gdmFsdWVcbiAgICAgICAgICBAc2V0IHtkZWZhdWx0VmFsdWV9XG5cbiAgICAgIGRlZmF1bHRWYWx1ZSA9IC0xIGlmIGRlZmF1bHRWYWx1ZSArIDEgPj0gdmFsdWVcblxuICAgICAgQHNldFxuICAgICAgICBudW1PcHRpb25zOiB2YWx1ZVxuICAgICAgICBkZWZhdWx0RGF0YTogZGVmYXVsdERhdGFcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBkZWZhdWx0VmFsdWVcblxuICB1cGRhdGVEZWZhdWx0VmFsdWU6ICh2YWx1ZSkgLT4gQHNldCBkZWZhdWx0VmFsdWU6IHBhcnNlSW50IHZhbHVlLCAxMFxuXG4gIHVwZGF0ZURlZmF1bHREYXRhT3B0aW9uOiAoaW5kZXgsIHZhbHVlKSAtPlxuICAgIGRhdGEgPSBAc3RhdGUuZGVmYXVsdERhdGEuc2xpY2UoKVxuICAgIGRhdGFbaW5kZXhdID0gdmFsdWVcbiAgICBAc2V0IGRlZmF1bHREYXRhOiBkYXRhXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxubW9kYWxXaW5kb3dUZW1wbGF0ZSA9IHJlcXVpcmUgXCJ0eXBlcy9zZWxlY3QvbW9kYWxcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgaW5pdGlhbDogLT5cbiAgICBAb3B0aW9uc0NvbnRhaW4gPSBSZW5kZXIgbW9kYWxXaW5kb3dUZW1wbGF0ZSwgQGNvbnRhaW5bMF1cblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLXNlbGVjdC1udW0tb3B0aW9uc1wiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZU51bU9wdGlvbnMgZS50YXJnZXQudmFsdWVcbiAgICBcImJsdXI6IEBjb25maWdzLXNlbGVjdC1udW0tb3B0aW9uc1wiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZU51bU9wdGlvbnMgZS50YXJnZXQudmFsdWVcbiAgICBcImtleWRvd246IEBjb25maWdzLXNlbGVjdC1udW0tb3B0aW9uc1wiOiAoZSkgLT5cbiAgICAgIGlmIGUua2V5Q29kZSA9PSAxM1xuICAgICAgICBAbW9kZWwudXBkYXRlTnVtT3B0aW9ucyBlLnRhcmdldC52YWx1ZVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1zZWxlY3Qtb3B0aW9uXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlRGVmYXVsdFZhbHVlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLXNlbGVjdC1vcHRpb24tbGFiZWxcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVEZWZhdWx0RGF0YU9wdGlvbiAoQGdldEluZGV4QnlFdmVudCBlKSwgZS50YXJnZXQudmFsdWVcbiAgICBcInBvcHVwLWNsb3NlOiBjb250YWluXCI6IChlKSAtPiBAZGVzdHJveSgpXG5cbiAgZ2V0SW5kZXhCeUV2ZW50OiAoZSkgLT5cbiAgICAkaXRlbSA9ICQgZS50YXJnZXRcbiAgICAkaXRlbS5kYXRhIFwiaW5kZXhcIlxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPlxuICAgIEBvcHRpb25zQ29udGFpbiBzdGF0ZVxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBAbW9kZWwuZ2V0U3RhdGUoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG5cbiAgdXBkYXRlQ29sdW1uczogKHZhbHVlKSAtPlxuICAgIHZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG4gICAgaWYgIWlzTmFOIHZhbHVlXG4gICAgICBpZiB2YWx1ZSA+IEBzdGF0ZS5jb2x1bW5zXG4gICAgICAgIGZvciByb3cgaW4gQHN0YXRlLmRlZmF1bHREYXRhXG4gICAgICAgICAgZm9yIGkgaW4gW0BzdGF0ZS5jb2x1bW5zICsgMS4udmFsdWVdXG4gICAgICAgICAgICByb3cucHVzaCBcIlwiXG4gICAgICBlbHNlIGlmIHZhbHVlIDwgQHN0YXRlLmNvbHVtbnNcbiAgICAgICAgZm9yIHJvdyBpbiBAc3RhdGUuZGVmYXVsdERhdGFcbiAgICAgICAgICBmb3IgaSBpbiBbdmFsdWUgKyAxLi5Ac3RhdGUuY29sdW1uc11cbiAgICAgICAgICAgIHJvdy5wb3AoKVxuICAgICAgQHNldCBjb2x1bW5zOiB2YWx1ZVxuXG4gIHVwZGF0ZVJvd3M6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSA9IHBhcnNlSW50IHZhbHVlLCAxMFxuICAgIGlmICFpc05hTiB2YWx1ZVxuICAgICAgaWYgdmFsdWUgPiBAc3RhdGUucm93c1xuICAgICAgICBmb3Igcm93IGluIFtAc3RhdGUucm93cyArIDEuLnZhbHVlXVxuICAgICAgICAgIHJvdyA9IFtdXG4gICAgICAgICAgZm9yIGkgaW4gWzEuLkBzdGF0ZS5jb2x1bW5zXVxuICAgICAgICAgICAgcm93LnB1c2ggXCJcIlxuICAgICAgICAgIEBzdGF0ZS5kZWZhdWx0RGF0YS5wdXNoIHJvd1xuICAgICAgZWxzZSBpZiB2YWx1ZSA8IEBzdGF0ZS5yb3dzXG4gICAgICAgIGZvciByb3cgaW4gW3ZhbHVlICsgMS4uQHN0YXRlLnJvd3NdXG4gICAgICAgICAgQHN0YXRlLmRlZmF1bHREYXRhLnBvcCgpXG4gICAgICBAc2V0IHJvd3M6IHZhbHVlXG5cbiAgdXBkYXRlQ2VsbERhdGE6IChyb3csIGNvbHVtbiwgdmFsdWUpIC0+XG4gICAgZGF0YSA9IEBzdGF0ZS5kZWZhdWx0RGF0YS5zbGljZSgpXG4gICAgZGF0YVtyb3ddW2NvbHVtbl0gPSB2YWx1ZVxuICAgIEBzZXQgZGVmYXVsdERhdGE6IGRhdGFcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlclwiXG5tb2RhbFdpbmRvd1RlbXBsYXRlID0gcmVxdWlyZSBcInR5cGVzL3RhYmxlL21vZGFsXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGluaXRpYWw6IC0+XG4gICAgQG1vZGFsQ29udGFpbiA9IFJlbmRlciBtb2RhbFdpbmRvd1RlbXBsYXRlLCBAY29udGFpblswXVxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtdGFibGUtcm93c1wiOiBcImNoYW5nZUNvbmZpZ3NUYWJsZVJvd3NcIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy10YWJsZS1jb2x1bW5zXCI6IFwiY2hhbmdlQ29uZmlnc1RhYmxlQ29sdW1uc1wiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLXRhYmxlLWNlbGxcIjogKGUpIC0+XG4gICAgICAkY2VsbCA9ICQgZS50YXJnZXRcbiAgICAgIEBtb2RlbC51cGRhdGVDZWxsRGF0YSAoJGNlbGwuZGF0YSBcInJvd1wiKSwgKCRjZWxsLmRhdGEgXCJjb2x1bW5cIiksICgkY2VsbC52YWwoKSlcblxuICAgIFwia2V5ZG93bjogQGNvbmZpZ3MtdGFibGUtcm93c1wiOiAoZSkgLT5cbiAgICAgIEBjaGFuZ2VDb25maWdzVGFibGVSb3dzIGVcblxuICAgICAgaWYgZS5rZXlDb2RlID09IDEzIHRoZW4gZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBcImtleWRvd246IEBjb25maWdzLXRhYmxlLWNvbHVtbnNcIjogKGUpIC0+XG4gICAgICBAY2hhbmdlQ29uZmlnc1RhYmxlQ29sdW1ucyBlXG5cbiAgICAgIGlmIGUua2V5Q29kZSA9PSAxMyB0aGVuIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQGRlc3Ryb3koKVxuXG4gIGNoYW5nZUNvbmZpZ3NUYWJsZVJvd3M6IChlKSAtPiBAbW9kZWwudXBkYXRlUm93cyBlLnRhcmdldC52YWx1ZVxuICBjaGFuZ2VDb25maWdzVGFibGVDb2x1bW5zOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZUNvbHVtbnMgZS50YXJnZXQudmFsdWVcblxuICByZW5kZXI6IChzdGF0ZSkgLT5cbiAgICBAbW9kYWxDb250YWluIHN0YXRlXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIEBtb2RlbC5nZXRTdGF0ZSgpXG4gICAgcmV0dXJuIGZhbHNlXG4iXX0=
