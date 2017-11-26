View = require "libs/view.coffee"
Render = require "libs/render"
modalWindowTemplate = require "dist/types/select/modal.gutt"

module.exports = class SelectConfigsView extends View
  constructor: (target, model) ->
    super target, model

    @optionsContain = Render modalWindowTemplate, @contain
    @render @model.state

  events:
    "submit: [data-role='configs-form']": "submitConfigsForm"
    "change: [data-role='configs-select-num-options']": (e) -> @model.updateNumOptions Number e.target.value
    "blur: [data-role='configs-select-num-options']": (e) -> @model.updateNumOptions Number e.target.value
    "keydown: [data-role='configs-select-num-options']": (e) ->
      if e.keyCode == 13
        @model.updateNumOptions Number e.target.value
        e.preventDefault()

    "change: [data-role='configs-select-option']": (e) -> @model.updateDefaultValue Number e.target.value
    "input keypress change: [data-role='configs-select-option-label']": (e) ->
      @model.updateDefaultDataOption (@getIndexByEvent e), e.target.value
    "popup-close: contain": (e) -> @destroy()

  getIndexByEvent: (e) -> Number e.target.getAttribute "data-index"

  render: (state) -> @optionsContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    e.preventDefault()
