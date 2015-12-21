AddModel = require "./addModel.coffee"
AddView = require "./addView.coffee"
$ = require "jquery-plugins.coffee"

models =
  image: require "image/ConfigsImageModel.coffee"
  table: require "table/ConfigsTableModel.coffee"
  file: require "file/ConfigsFileModel.coffee"
  radio: require "radio/ConfigsRadioModel.coffee"
  checkbox: require "checkbox/ConfigsCheckboxModel.coffee"
  gallery: require "gallery/ConfigsGalleryModel.coffee"

views =
  image: require "image/ConfigsImageView.coffee"
  table: require "table/ConfigsTableView.coffee"
  file: require "file/ConfigsFileView.coffee"
  radio: require "radio/ConfigsRadioView.coffee"
  checkbox: require "checkbox/ConfigsCheckboxView.coffee"
  gallery: require "gallery/ConfigsGalleryView.coffee"

Popup = require "popup"

AddView.on "open-configs-modal", (index, field, fields) ->
  Popup.open "@configs-popup"
  views[field.type].bind ($ "@configs-popup")

  field.settings.index = index
  models[field.type].bind field.settings
  models[field.type].setFields fields if models[field.type].setFields?

for type, view of views
  do (type, view) ->
    view.on "save-configs-modal", (form) ->
      AddModel.saveFieldConfigs form
      Popup.close()

AddModel.on "onSavedSection", (alias) ->
  window.location.href = "/cms/configs/#{alias}/"

# setTimeout =>
#   ($ "@field-type")
#   .eq(1)
#   .val "table"
#   .trigger "change"
#   setTimeout =>
#     ($ "@btn-config-field").trigger "click"
#     # setTimeout =>
#     #   ($ "@configs-image-storage").eq(1).trigger "click"
#     # , 40
#   , 40
# , 500
