(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require("components/form/form__date.coffee");


},{"components/form/form__date.coffee":2}],2:[function(require,module,exports){
var $, isTouchDevice,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

$ = require("jquery-plugins.coffee");

isTouchDevice = (function(_this) {
  return function() {
    return (indexOf.call(window, 'ontouchstart') >= 0) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
  };
})(this);

if (!isTouchDevice()) {
  $("[type=date]").each(function() {
    var $input;
    $input = $(this);
    return $input.attr("type", "text");
  });
}


},{"jquery-plugins.coffee":"jquery-plugins.coffee"}]},{},[1]);
