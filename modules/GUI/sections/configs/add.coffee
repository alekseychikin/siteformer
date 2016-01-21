AddModel = require "./addModel.coffee"
AddView = require "./addView.coffee"
$ = require "jquery-plugins.coffee"

addModel = AddModel()
addView = AddView ($ "@configs-add"), addModel


models =
  image: require "image/ConfigsImageModel.coffee"
  table: require "table/ConfigsTableModel.coffee"
  file: require "file/ConfigsFileModel.coffee"
  radio: require "radio/ConfigsRadioModel.coffee"
  checkbox: require "checkbox/ConfigsCheckboxModel.coffee"
  gallery: require "gallery/ConfigsGalleryModel.coffee"
  select: require "select/ConfigsSelectModel.coffee"

views =
  image: require "image/ConfigsImageView.coffee"
  table: require "table/ConfigsTableView.coffee"
  file: require "file/ConfigsFileView.coffee"
  radio: require "radio/ConfigsRadioView.coffee"
  checkbox: require "checkbox/ConfigsCheckboxView.coffee"
  gallery: require "gallery/ConfigsGalleryView.coffee"
  select: require "select/ConfigsSelectView.coffee"

Popup = require "popup"

addView.on "open-configs-modal", (index, field, fields) ->
  Popup.open "@configs-popup"
  field.settings.index = index

  model = models[field.type] field.settings
  model.setFields fields if model.setFields?

  view = views[field.type] ($ "@configs-popup"), model
  view.on "save-configs-modal", (form) ->
    addModel.saveFieldConfigs form
    Popup.close()
    view.destroy()

addModel.on "onSavedSection", (alias) ->
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
