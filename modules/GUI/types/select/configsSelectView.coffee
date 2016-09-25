View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/select/modal"

module.exports = View
  initial: ->
    @optionsContain = Render modalWindowTemplate, @contain[0]

  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-select-num-options": (e) -> @model.updateNumOptions e.target.value
    "blur: @configs-select-num-options": (e) -> @model.updateNumOptions e.target.value
    "keydown: @configs-select-num-options": (e) ->
      if e.keyCode == 13
        @model.updateNumOptions e.target.value
        e.preventDefault()

    "change: @configs-select-option": (e) -> @model.updateDefaultValue e.target.value
    "change: @configs-select-option-label": (e) -> @model.updateDefaultDataOption (@getIndexByEvent e), e.target.value
    "popup-close: contain": (e) -> @destroy()

  getIndexByEvent: (e) ->
    $item = $ e.target
    $item.data "index"

  render: (state) ->
    @optionsContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    return false
