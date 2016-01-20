$ = require "jquery-plugins.coffee"
httpGet = (require "ajax.coffee").httpGet
Promise = require "promise"

AddModel = require "./addModel.coffee"

AddView = require "./addView.coffee"

models =
  string: require "string/addStringModel.coffee"
  table: require "table/addTableModel.coffee"
  checkbox: require "checkbox/addCheckboxModel.coffee"
  radio: require "radio/addRadioModel.coffee"
  image: require "image/addImageModel.coffee"
  text: require "text/addTextModel.coffee"

views =
  string: require "string/addStringView.coffee"
  table: require "table/addTableView.coffee"
  checkbox: require "checkbox/addCheckboxView.coffee"
  radio: require "radio/addRadioView.coffee"
  image: require "image/addImageView.coffee"
  text: require "text/addTextView.coffee"

httpGet "#{window.location.href}__json/"
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
