AddModal = require "./addModel.coffee"
AddView = require "./addView.coffee"
$ = require "jquery-plugins.coffee"

models =
  image: require "image/ConfigsImageModel.coffee"

views =
  image: require "image/ConfigsImageView.coffee"

Popup = require "popup"

AddView.on "open-configs-modal", (index, field) ->
  Popup.open "@configs-#{field.type}"
  views[field.type].bind ($ "@configs-#{field.type}")

  field.settings.index = index
  models[field.type].bind field.settings

for type, view of views
  do (type, view) ->
    view.on "save-configs-modal", (form) ->
      AddModal.saveFieldConfigs form
      Popup.close()
