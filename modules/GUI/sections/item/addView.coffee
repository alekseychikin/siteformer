View = require "libs/view.coffee"

module.exports = class AddItemView extends View
  constructor: (target, model) ->
    super target, model

  events:
    "submit: contain": ->
      @model.savePublic()
      return false

    "click: [data-role='save-public']": (e) ->
      @model.savePublic()
      e.preventDefault()

    "click: [data-role='save-draft']": -> @model.saveDraft()

    "click: [data-role='delete']": -> @model.delete()
