View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/string/modal"

module.exports = View
  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-string-copy-value-of": (e) ->
      @model.updateCopyValueOf e.target.checked
      @model.updateCopyValueOfValue @contain.find("@configs-string-copy-value-of-select").val()

    "change: @configs-string-copy-value-of-select": (e) -> @model.updateCopyValueOfValue e.target.value
    "change: @configs-string-remove-punctuation": (e) -> @model.updateRemovePunctuation e.target.checked
    "change: @configs-string-translit": (e) -> @model.updateTranslit e.target.checked
    "popup-close: contain": (e) -> @destroy()

  initial: -> @modalContain = Render modalWindowTemplate, @contain[0]

  render: (state) -> @modalContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    return false
