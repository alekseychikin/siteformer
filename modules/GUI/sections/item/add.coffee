$ = require "jquery-plugins.coffee"
httpGet = (require "ajax.coffee").httpGet

AddModel = require "./addModel.coffee"
addModel = AddModel()

AddView = require "./addView.coffee"

addView = AddView ($ "@item-add-form"), addModel

addView.on "save", (fields) ->
  console.log fields

models =
  string: require "string/addStringModel.coffee"
  table: require "table/addTableModel.coffee"
  checkbox: require "checkbox/addCheckboxModel.coffee"
  radio: require "radio/addRadioModel.coffee"

views =
  string: require "string/addStringView.coffee"
  table: require "table/addTableView.coffee"
  checkbox: require "checkbox/addCheckboxView.coffee"
  radio: require "radio/addRadioView.coffee"

httpGet "#{window.location.href}__json/"
.then (response) ->
  $rows = $ "@input-contain"
  index = 0
  for field in response.fields
    if models[field.type]?
      model = models[field.type]()
      model.setSettings? field.settings
      views[field.type] $rows.eq(index), model
      addModel.add field.alias, model
    if !field.settings.hide? || (field.settings.hide? && !field.settings.hide)
      index++
