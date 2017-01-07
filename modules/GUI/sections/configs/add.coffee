AddModel = require "./addModel.coffee"
AddView = require "./addView.coffee"
$ = require "jquery-plugins.coffee"

addModel = AddModel()
addView = AddView ($ "[data-role='configs-add']"), addModel

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
  text: require "text/configsModel.coffee"
  url: require "url/configsModel.coffee"

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
  text: require "text/configsView.coffee"
  url: require "url/configsView.coffee"

Popup = require "popup"

addView.on "open-configs-modal", (index, field, fields = []) ->
  Popup.open "[data-role='configs-popup']"

  sections = addModel.getSections().filter (section) -> section.id != field.section

  model = models[field.type]
    index: index
    field: field
    settings: field.settings
    fields: fields
    sections: sections

  ($ "[data-role='configs-popup']").html ""
  view = views[field.type] ($ "[data-role='configs-popup']"), model

  view.on "save-configs-modal", (state) ->
    console.log state
    addModel.saveFieldSettings state
    Popup.close()
    view.destroy()

addModel.on "save-section", (alias) ->
  window.location.href = "/cms/configs/#{alias}/"

addModel.on "delete-section", ->
  window.location.href = "/cms/configs/"

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
