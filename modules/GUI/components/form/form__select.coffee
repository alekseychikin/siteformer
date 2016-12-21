$ = require "jquery-plugins.coffee"

$selects = $ "select"
$selects.each ->
  $select = $ @
  $label = $select.parent()

  $select.on "focus", ->
    $label.addClass "focus"

  $select.on "blur", ->
    $label.removeClass "focus"
