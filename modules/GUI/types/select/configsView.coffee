View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/select/modal"

module.exports = class SelectConfigsView extends View
  constructor: (target, model) ->
    super target, model

    @optionsContain = Render modalWindowTemplate, @contain[0]
    @render @model.state

  events:
    "submit: [data-role='configs-form']": "submitConfigsForm"
    "change: [data-role='configs-select-num-options']": (e) -> @model.updateNumOptions parseInt(e.target.value, 10)
    "blur: [data-role='configs-select-num-options']": (e) -> @model.updateNumOptions parseInt(e.target.value, 10)
    "keydown: [data-role='configs-select-num-options']": (e) ->
      if e.keyCode == 13
        @model.updateNumOptions parseInt(e.target.value, 10)
        e.preventDefault()

    "change: [data-role='configs-select-option']": (e) -> @model.updateDefaultValue parseInt(e.target.value, 10)
    "input keypress change: [data-role='configs-select-option-label']": (e) ->
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
