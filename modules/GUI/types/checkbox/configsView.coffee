View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/checkbox/modal"

module.exports = View
  initial: ->
    @modalContain = Render modalWindowTemplate, @contain[0]

  events:
    "submit: [data-role='configs-form']": "submitConfigsForm"
    "change: [data-role='configs-checkbox-num-options']": (e) -> @model.updateNumOptions e.target.value
    "blur: [data-role='configs-checkbox-num-options']": (e) -> @model.updateNumOptions e.target.value
    "keydown: [data-role='configs-checkbox-num-options']": (e) ->
      if e.keyCode == 13
        @model.updateNumOptions e.target.value
        e.preventDefault()

    "change: [data-role='configs-checkbox-option']": (e) ->
      @model.updateDefaultDataOptionChecked (@getIndexByEvent e), e.target.checked

    "input keypress change: [data-role='configs-checkbox-option-label']": (e) ->
      @model.updateDefaultDataOption (@getIndexByEvent e), e.target.value

    "popup-close: contain": (e) -> @destroy()

  getIndexByEvent: (e) ->
    $item = $ e.target
    $item.data "index"

  render: (state) ->
    @modalContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    return false
