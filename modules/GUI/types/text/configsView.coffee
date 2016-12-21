View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/text/modal"

module.exports = View
  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-text-default-text": (e) -> @model.updateDefaultText e.target.value
    "popup-close: contain": -> @destroy()

  initial: -> @modalContain = Render modalWindowTemplate, @contain[0]

  render: (state) -> @modalContain state

  submitConfigsForm: ->
    @trigger "save-configs-modal", @model.getState()
    return false
