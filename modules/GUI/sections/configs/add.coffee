AddModel = require "./addModel.coffee"
AddView = require "./addView.coffee"
$ = require "jquery-plugins.coffee"

addModel = AddModel()
addView = AddView ($ "@configs-add"), addModel

models =
  checkbox: require "checkbox/configsModel.coffee"
  date: require "date/configsModel.coffee"
  file: require "file/configsModel.coffee"
  gallery: require "gallery/configsModel.coffee"
  image: require "image/configsModel.coffee"
  radio: require "radio/configsModel.coffee"
  table: require "table/configsModel.coffee"
  section: require "section/configsModel.coffee"
  select: require "select/configsModel.coffee"

views =
  checkbox: require "checkbox/configsView.coffee"
  date: require "date/configsView.coffee"
  file: require "file/configsView.coffee"
  gallery: require "gallery/configsView.coffee"
  image: require "image/configsView.coffee"
  radio: require "radio/configsView.coffee"
  table: require "table/configsView.coffee"
  section: require "section/configsView.coffee"
  select: require "select/configsView.coffee"

Popup = require "popup"

addView.on "open-configs-modal", (index, field, fields = []) ->
  Popup.open "@configs-popup"
  field.settings.index = index

  model = models[field.type] field.settings
  model.setFields fields if model.setFields?
  sections = addModel.getSections().filter (section) -> section.id != field.section
  model.setSections sections if model.setSections?

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
