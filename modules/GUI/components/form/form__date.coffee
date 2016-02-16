$ = require "jquery-plugins.coffee"

isTouchDevice = =>
  ('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)

if !isTouchDevice()
  $ "[type=date]"
  .each ->
    $input = $ this
    $input.attr "type", "text"
