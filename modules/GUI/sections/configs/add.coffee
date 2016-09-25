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

addView.on "open-configs-modal", (index, field, fields = []) ->
  Popup.open "@configs-popup"
  field.settings.index = index

  model = models[field.type] field.settings
  model.setFields fields if model.setFields?

  ($ "@configs-popup").html ""
  view = views[field.type] ($ "@configs-popup"), model

  view.on "save-configs-modal", (form) ->
    console.log form
    addModel.saveFieldConfigs form
    Popup.close()
    view.destroy()

addModel.on "onSavedSection", (alias) ->
  window.location.href = "/cms/configs/#{alias}/"

# setTimeout =>
#   ($ "@btn-add-field").trigger "click"
#   ($ "@configs-add-title")
#     .val "Заметки"
#     .trigger "change"
#
#   ($ "@configs-add-alias")
#     .val "notes"
#     .trigger "change"
#
#   setTimeout =>
#     ($ "@row-module-fields:nth-child(12) @field-title")
#       .val "Галерея"
#       .trigger "change"
#
#     ($ "@row-module-fields:nth-child(12) @field-alias")
#       .val "gallery"
#       .trigger "change"
#
#     ($ "@row-module-fields:nth-child(12) @field-type")
#       .val "gallery"
#       .trigger "change"
#
#     setTimeout =>
#       ($ "@row-module-fields:nth-child(12) @btn-config-field").trigger "click"
#     , 200
#
#   , 200
# , 500
