View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/radio/modal.tmpl.js"

module.exports = View
  initial: ->
    @optionsContain = Render modalWindowTemplate, @contain[0]

  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-radio-num-options": (e) -> @model.updateNumOptions e.target.value
    "change: @configs-radio-option": (e) -> @model.updateDefaultValue e.target.value
    "change: @configs-radio-option-label": (e) -> @model.updateDefaultDataOption (@getIndexByEvent e), e.target.value
    "popup-close: contain": (e) -> @destroy()

  getIndexByEvent: (e) ->
    $item = $ e.target
    $item.data "index"

  render: (state) ->
    @optionsContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    return false
