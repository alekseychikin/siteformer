$ = require "jquery-plugins.coffee"
httpGet = (require "ajax.coffee").httpGet
Promise = require "promise"

AddModel = require "./addModel.coffee"
addModel = AddModel()

AddView = require "./addView.coffee"

addView = AddView ($ "@item-add-form"), addModel

addView.on "save", (fields) ->
  result = {}
  promises = []
  for field, value of fields
    do (field, value) ->
      promises.push value
      if value instanceof Promise
        value
        .then (value) ->
          result[field] = value
        .catch (error) ->
          console.error error
      else
        result[field] = value

  Promise.all promises
  .then ->
    console.log "may save"
    console.log result

models =
  string: require "string/addStringModel.coffee"
  table: require "table/addTableModel.coffee"
  checkbox: require "checkbox/addCheckboxModel.coffee"
  radio: require "radio/addRadioModel.coffee"
  image: require "image/addImageModel.coffee"

views =
  string: require "string/addStringView.coffee"
  table: require "table/addTableView.coffee"
  checkbox: require "checkbox/addCheckboxView.coffee"
  radio: require "radio/addRadioView.coffee"
  image: require "image/addImageView.coffee"

httpGet "#{window.location.href}__json/"
.then (response) ->
  $rows = $ "@input-contain"
  index = 0
  for field in response.fields
    if models[field.type]?
      model = models[field.type] {field}
      model.setSettings? field.settings
      views[field.type] $rows.eq(index), model
      addModel.add field.alias, model
    if !field.settings.hide? || (field.settings.hide? && !field.settings.hide)
      index++
