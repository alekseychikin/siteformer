View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/radio/modal"

module.exports = View
  initial: ->
    @optionsContain = Render modalWindowTemplate, @contain[0]

  events:
    "submit: [data-role='configs-form']": "submitConfigsForm"
    "change: [data-role='configs-radio-num-options']": (e) -> @model.updateNumOptions Number(e.target.value)
    "blur: [data-role='configs-radio-num-options']": (e) -> @model.updateNumOptions Number(e.target.value)
    "keydown: [data-role='configs-radio-num-options']": (e) ->
      if e.keyCode == 13
        @model.updateNumOptions e.target.value
        e.preventDefault()

    "change: [data-role='configs-radio-option']": (e) -> @model.updateDefaultValue Number(e.target.value)
    "input keypress change: [data-role='configs-radio-option-label']": (e) ->
      @model.updateDefaultDataOption (@getIndexByEvent e), e.target.value
    "popup-close: contain": (e) -> @destroy()

  getIndexByEvent: (e) ->
    $item = $ e.target
    $item.data "index"

  render: (state) ->
    @optionsContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    return false
