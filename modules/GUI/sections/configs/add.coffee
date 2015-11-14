AddModel = require "./addModel.coffee"
AddView = require "./addView.coffee"
$ = require "jquery-plugins.coffee"

models =
  image: require "image/ConfigsImageModel.coffee"
  table: require "table/ConfigsTableModel.coffee"
  file: require "file/ConfigsFileModel.coffee"
  radio: require "radio/ConfigsRadioModel.coffee"

views =
  image: require "image/ConfigsImageView.coffee"
  table: require "table/ConfigsTableView.coffee"
  file: require "file/ConfigsFileView.coffee"
  radio: require "radio/ConfigsRadioView.coffee"

Popup = require "popup"

AddView.on "open-configs-modal", (index, field) ->
  Popup.open "@configs-#{field.type}"
  views[field.type].bind ($ "@configs-#{field.type}")

  field.settings.index = index
  models[field.type].bind field.settings

for type, view of views
  do (type, view) ->
    view.on "save-configs-modal", (form) ->
      AddModel.saveFieldConfigs form
      Popup.close()

AddModel.on "onSavedSection", (alias) ->
  window.location.href = "/cms/configs/#{alias}/"
