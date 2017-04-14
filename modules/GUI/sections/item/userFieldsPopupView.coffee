View = require "view.coffee"
popupTemplate = require "sections/item/user-fields-popup-template.tmplt"
Render = require "render"

module.exports = class UserFieldsView extends View
  constructor: (target, model) ->
    super target, model

    @renderPopup = Render popupTemplate, @contain
    @render @model.state

  render: (state) -> @renderPopup state

  events:
    "submit: [data-role='fields-config']": (e) ->
      @trigger "save-user-fields", @model.getUserFields()

      false

    "change: [data-role='configs-checkbox-option']": (e) ->
      if e.target.checked then @model.addField e.target.value else @model.removeField e.target.value
