(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require("components/form/form__date.coffee");

require("components/form/form__time.coffee");

require("components/form/form__select.coffee");


},{"components/form/form__date.coffee":2,"components/form/form__select.coffee":3,"components/form/form__time.coffee":4}],2:[function(require,module,exports){
var $, $body, $document, $lastFakeInp, DateControl, INPUT_HEIGHT, MONTHS, formateDate, isTouchDevice, makeFakeInput, skipGenerateTable, stayOpening, template,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

$ = require("jquery-plugins.coffee");

$lastFakeInp = null;

stayOpening = false;

skipGenerateTable = false;

$body = $(document.body);

template = "<div class='form__calendar'> <span class='form__calendar-arrow form__calendar-arrow--left'></span> <span class='form__calendar-arrow form__calendar-arrow--right'></span> <div class='form__calendar-month'></div> <div class='form__calendar-days'> </div> </div>";

$document = $(document);

INPUT_HEIGHT = 50;

MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

isTouchDevice = (function(_this) {
  return function() {
    return (indexOf.call(window, "ontouchstart") >= 0) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
  };
})(this);

makeFakeInput = function($src) {
  var $input;
  $input = $("<input class='form__date-fake' type='text' />");
  $body.append($input);
  return $input;
};

formateDate = function(date) {
  var value;
  value = date.match(/^(\d{1,2})[^\d]+(\d{1,2})[^\d]+(\d{4})$/);
  if (value) {
    value[1] = value[1].length === 1 ? "0" + value[1] : value[1];
    value[2] = value[2].length === 1 ? "0" + value[2] : value[2];
    return value[1] + "." + value[2] + "." + value[3];
  }
  return "";
};

DateControl = (function() {
  function DateControl(input) {
    var $formCalendarArrowLeft, $formCalendarArrowRight, $input, self;
    this.$fakeInp = makeFakeInput($input);
    this.$calendar = $(template);
    this.$calendarDays = this.$calendar.find(".form__calendar-days");
    this.$formCalendarMonth = this.$calendar.find(".form__calendar-month");
    $formCalendarArrowLeft = this.$calendar.find(".form__calendar-arrow--left");
    $formCalendarArrowRight = this.$calendar.find(".form__calendar-arrow--right");
    this.lastDate;
    $body.append(this.$calendar);
    this.$calendar.on("mousedown", ".form__calendar-cell", function(e) {
      return stayOpening = true;
    });
    self = this;
    this.$calendar.on("click", ".form__calendar-cell", function(e) {
      var $cell, date;
      $cell = $(this);
      date = $cell.attr('data-value');
      self.$fakeInp.val(date);
      return self.$fakeInp.trigger("change");
    });
    $formCalendarArrowLeft.on("mousedown", function() {
      stayOpening = true;
      return skipGenerateTable = true;
    });
    $formCalendarArrowLeft.on("click", (function(_this) {
      return function() {
        var date;
        date = new Date(_this.lastDate[1], _this.lastDate[2] - 1, _this.lastDate[3]);
        _this.generateTable((date.getFullYear()) + "-" + (date.getMonth() + 1) + "-" + (date.getDate()));
        return _this.$fakeInp.focus();
      };
    })(this));
    $formCalendarArrowRight.on("mousedown", function() {
      stayOpening = true;
      return skipGenerateTable = true;
    });
    $formCalendarArrowRight.on("click", (function(_this) {
      return function() {
        var date;
        date = new Date(_this.lastDate[1], _this.lastDate[2] + 1, _this.lastDate[3]);
        _this.generateTable((date.getFullYear()) + "-" + (date.getMonth() + 1) + "-" + (date.getDate()));
        return _this.$fakeInp.focus();
      };
    })(this));
    $input = $(input);
    this.updateFakeInputValue($input);
    $input.on("change", (function(_this) {
      return function() {
        return _this.updateFakeInputValue($input);
      };
    })(this));
    $input.siblings(".form__inp-empty").on("click", (function(_this) {
      return function() {
        return _this.$fakeInp.val("").trigger("change");
      };
    })(this));
    $input.on("focus", (function(_this) {
      return function() {
        return _this.$fakeInp.focus();
      };
    })(this));
    this.$fakeInp.on("focus", (function(_this) {
      return function() {
        var height, offset, value;
        $input.addClass("focus");
        value = $input.val().match(/^(\d{4})[^\d]+(\d{1,2})[^\d]+(\d{1,2})$/);
        offset = _this.$fakeInp.offset();
        if (!value) {
          value = new Date();
          value = [value.getFullYear(), value.getMonth(), value.getDate()];
        }
        if (skipGenerateTable) {
          skipGenerateTable = false;
        } else {
          _this.generateTable(value[1] + "-" + value[2] + "-" + value[3]);
        }
        height = _this.$calendar.outerHeight();
        if (offset.top + height + INPUT_HEIGHT > $document.outerHeight()) {
          return _this.$calendar.addClass("form__calendar--top").css({
            top: (offset.top - height - 15) + "px",
            left: offset.left + "px"
          }).addClass("form__calendar--show");
        } else {
          return _this.$calendar.removeClass("form__calendar--top").css({
            top: (offset.top + INPUT_HEIGHT) + "px",
            left: offset.left + "px"
          });
        }
      };
    })(this));
    this.$fakeInp.on("change", (function(_this) {
      return function() {
        var value;
        value = _this.$fakeInp.val();
        _this.$fakeInp.val(formateDate(value));
        value = value.match(/^(\d{1,2})[^\d]+(\d{1,2})[^\d]+(\d{4})$/);
        if (value) {
          value[1] = value[1].length === 1 ? "0" + value[1] : value[1];
          value[2] = value[2].length === 1 ? "0" + value[2] : value[2];
          $input.val(value[3] + "-" + value[2] + "-" + value[1]);
        } else {
          $input.val("");
        }
        $input.trigger("change");
        return _this.$fakeInp.trigger("blur");
      };
    })(this));
    this.$fakeInp.on("blur", (function(_this) {
      return function() {
        return setTimeout(function() {
          if (!stayOpening) {
            _this.$calendar.removeClass("form__calendar--show").css({
              left: ""
            });
            $input.removeClass("focus");
          }
          return stayOpening = false;
        }, 10);
      };
    })(this));
    this.$fakeInp.on("keydown", function(e) {
      var $inputs, nextInput, prevInput;
      if (e.keyCode === 9) {
        $inputs = $body.find("input, select, button");
        prevInput = $inputs[$inputs.length - 1];
        nextInput = false;
        if (e.shiftKey) {
          $inputs.each(function() {
            if (this === $input[0]) {
              $(prevInput).focus();
              return false;
            }
            return prevInput = this;
          });
        } else {
          $inputs.each(function() {
            if (nextInput) {
              $(this).focus();
              return false;
            }
            if (this === $input[0]) {
              return nextInput = this;
            }
          });
          if (!nextInput) {
            $inputs.first().focus();
          }
        }
        return e.preventDefault();
      }
    });
  }

  DateControl.prototype.generateTable = function(date) {
    var className, currentDate, d, day, dayOfWeek, daysInMonth, firstDayOfMonth, firstDayOfWeek, i, j, k, l, month, monthCalendar, ref, ref1, ref2, today;
    today = new Date();
    date = date.match(/(\d{4})\-(\d{1,2})\-(\d{1,2})/);
    if (!date) {
      date = ["", today.getFullYear(), today.getMonth() + 1, today.getDate()];
    }
    this.lastDate = date;
    date[2] = parseInt(date[2], 10) - 1;
    currentDate = new Date(date[1], date[2], date[3]);
    firstDayOfMonth = new Date(date[1], date[2], 1);
    d = new Date(date[1], date[2] + 1, 0);
    daysInMonth = d.getDate();
    dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
    firstDayOfWeek = firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
    monthCalendar = "<table class='form__calendar-table'> <tr> <th>Пн</th> <th>Вт</th> <th>Ср</th> <th>Чт</th> <th>Пт</th> <th>Сб</th> <th>Вс</th> </tr>";
    monthCalendar += "<tr>";
    for (i = k = 1, ref = firstDayOfWeek; 1 <= ref ? k < ref : k > ref; i = 1 <= ref ? ++k : --k) {
      monthCalendar += "<td></td>";
    }
    for (j = l = ref1 = i, ref2 = daysInMonth + i; ref1 <= ref2 ? l <= ref2 : l >= ref2; j = ref1 <= ref2 ? ++l : --l) {
      className = 'form__calendar-cell';
      day = j - i + 1;
      month = date[2] + 1;
      if (day === today.getDate() && date[2] === today.getMonth() && +date[1] === today.getFullYear()) {
        className += ' form__calendar-cell--today';
      }
      if ((j - 1) % 7 === 0) {
        monthCalendar += "<tr>";
      }
      monthCalendar += "<td> <span class='" + className + "' data-value='" + day + "-" + month + "-" + date[1] + "' >" + day + "</span> </td>";
      if (j % 7 === 0) {
        monthCalendar += "</tr>";
      }
    }
    monthCalendar += "</table>";
    this.$calendarDays.html(monthCalendar);
    return this.$formCalendarMonth.html(MONTHS[date[2]]);
  };

  DateControl.prototype.updateFakeInputValue = function($src) {
    var offset, value;
    offset = $src.offset();
    value = $src.val().match(/^(\d{4})[^\d]+(\d{1,2})[^\d]+(\d{1,2})$/);
    if (value) {
      this.$fakeInp.val(value[3] + "." + value[2] + "." + value[1]);
    }
    return this.$fakeInp.css({
      top: offset.top + "px",
      left: offset.left + "px"
    });
  };

  return DateControl;

})();

if (!isTouchDevice()) {
  ($("[type=date]")).each(function() {
    return new DateControl(this);
  });
}


},{"jquery-plugins.coffee":"jquery-plugins.coffee"}],3:[function(require,module,exports){
var $, $selects;

$ = require("jquery-plugins.coffee");

$selects = $("select");

$selects.each(function() {
  var $label, $select;
  $select = $(this);
  $label = $select.parent();
  $select.on("focus", function() {
    return $label.addClass("focus");
  });
  return $select.on("blur", function() {
    return $label.removeClass("focus");
  });
});


},{"jquery-plugins.coffee":"jquery-plugins.coffee"}],4:[function(require,module,exports){
var $, $body, TimeControl, formateDate, isTouchDevice, makeFakeInput,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

$ = require("jquery-plugins.coffee");

$body = $(document.body);

isTouchDevice = (function(_this) {
  return function() {
    return (indexOf.call(window, "ontouchstart") >= 0) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
  };
})(this);

makeFakeInput = function($src) {
  var $input;
  $input = $("<input class='form__time-fake' type='text' />");
  $body.append($input);
  return $input;
};

formateDate = function(date) {
  var value;
  value = date.match(/^(\d{1,2})[^\d]+(\d{1,2})$/);
  if (value) {
    value[1] = value[1].length === 1 ? "0" + value[1] : value[1];
    value[2] = value[2].length === 1 ? "0" + value[2] : value[2];
    return value[1] + ":" + value[2];
  }
  return "";
};

TimeControl = (function() {
  function TimeControl(input) {
    var $input;
    $input = $(input);
    this.$fakeInp = makeFakeInput($input);
    this.updateFakeInputValue($input);
    $input.on("change", (function(_this) {
      return function() {
        return _this.updateFakeInputValue($input);
      };
    })(this));
    $input.siblings(".form__inp-empty").on("click", (function(_this) {
      return function() {
        return _this.$fakeInp.val("").trigger("change");
      };
    })(this));
    $input.on("focus", (function(_this) {
      return function() {
        return _this.$fakeInp.focus();
      };
    })(this));
    this.$fakeInp.on("focus", (function(_this) {
      return function() {
        return _this.$fakeInp.addClass("focus");
      };
    })(this));
    this.$fakeInp.on("blur", (function(_this) {
      return function() {
        return _this.$fakeInp.removeClass("focus");
      };
    })(this));
    this.$fakeInp.on("change", (function(_this) {
      return function() {
        var value;
        value = _this.$fakeInp.val();
        _this.$fakeInp.val(formateDate(value));
        value = value.match(/^(\d{1,2})[^\d]+(\d{1,2})$/);
        if (value) {
          value[1] = value[1].length === 1 ? "0" + value[1] : value[1];
          value[2] = value[2].length === 1 ? "0" + value[2] : value[2];
          $input.val(value[1] + ":" + value[2]);
        } else {
          $input.val("");
        }
        $input.trigger("change");
        return _this.$fakeInp.trigger("blur");
      };
    })(this));
    this.$fakeInp.on("keydown", (function(_this) {
      return function(e) {
        var $inputs, nextInput, prevInput;
        if (e.keyCode === 9) {
          $inputs = $body.find("input, select, button");
          prevInput = $inputs[$inputs.length - 1];
          nextInput = false;
          if (e.shiftKey) {
            $inputs.each(function() {
              if (this === $input[0]) {
                $(prevInput).focus();
                return false;
              }
              return prevInput = this;
            });
          } else {
            $inputs.each(function() {
              if (nextInput) {
                $(this).focus();
                return false;
              }
              if (this === $input[0]) {
                return nextInput = this;
              }
            });
            if (!nextInput) {
              $inputs.first().focus();
            }
          }
          return e.preventDefault();
        }
      };
    })(this));
  }

  TimeControl.prototype.updateFakeInputValue = function($src) {
    var offset, value;
    offset = $src.offset();
    value = $src.val().match(/^(\d{1,2})[^\d]+(\d{1,2})$/);
    if (value) {
      this.$fakeInp.val(value[1] + ":" + value[2]);
    }
    return this.$fakeInp.css({
      top: offset.top + "px",
      left: offset.left + "px"
    });
  };

  return TimeControl;

})();

if (!isTouchDevice()) {
  ($("[type=time]")).each(function() {
    return new TimeControl(this);
  });
}


},{"jquery-plugins.coffee":"jquery-plugins.coffee"}]},{},[1]);
