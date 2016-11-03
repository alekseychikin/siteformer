$ = require "jquery-plugins.coffee"
httpGet = (require "ajax.coffee").httpGet
Promise = require "promise"

AddModel = require "./addModel.coffee"

AddView = require "./addView.coffee"

models =
  checkbox: require "checkbox/addModel.coffee"
  image: require "image/addModel.coffee"
  password: require "password/addModel.coffee"
  radio: require "radio/addModel.coffee"
  select: require "select/addModel.coffee"
  table: require "table/addModel.coffee"
  text: require "text/addModel.coffee"

views =
  checkbox: require "checkbox/addView.coffee"
  image: require "image/addView.coffee"
  password: require "password/addView.coffee"
  radio: require "radio/addView.coffee"
  select: require "select/addView.coffee"
  table: require "table/addView.coffee"
  text: require "text/addView.coffee"

httpGet window.location.href
.then (response) ->
  addModel = AddModel
    section: response.section
    fields: []
  addView = AddView ($ "@item-add-form"), addModel
  $rows = $ "@input-contain"
  index = 0
  for field in response.fields
    if models[field.type]?
      model = models[field.type] {field}
      model.setSettings? field.settings
      addModel.add field.alias, model
    if !field.settings.hide? || (field.settings.hide? && !field.settings.hide)
      views[field.type] $rows.eq(index), model
      index++
