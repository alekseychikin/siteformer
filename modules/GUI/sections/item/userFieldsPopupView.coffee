View = require "view.coffee"
popupTemplate = require "sections/item/user-fields-popup-template"
Render = require "render"

module.exports = View
  initial: -> @renderPopup = Render popupTemplate, @contain[0]
  render: (state) -> @renderPopup state

  events:
    "submit: @fields-config": (e) ->
      @trigger "save-user-fields", @model.getUserFields()

      false

    "change: [data-role='configs-checkbox-option']": (e) ->
      if e.target.checked then @model.addField e.target.value else @model.removeField e.target.value
