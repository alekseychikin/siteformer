$ = require "jquery-plugins.coffee"

$selects = $ "select"
$selects.each ->
  $select = $ this
  $label = $select.parent()

  $select.on "focus", ->
    $label.addClass "focus"

  $select.on "blur", ->
    $label.removeClass "focus"
