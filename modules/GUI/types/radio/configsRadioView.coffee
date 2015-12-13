View = require "view.coffee"
configsRadioModel = require "radio/configsRadioModel.coffee"
Render = require "render"
modalWindowTemplate = require "types/radio/modal.tmpl.js"

module.exports = View "TypeRadioView",
  model: configsRadioModel

  initial: ->
    @optionsContain = Render modalWindowTemplate, @contain[0]

  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-radio-num-options": (e) -> configsRadioModel.updateNumOptions e.target.value
    "change: @configs-radio-option": (e) -> configsRadioModel.updateDefaultValue e.target.value
    "change: @configs-radio-option-label": (e) -> configsRadioModel.updateDefaultDataOption (@getIndexByEvent e), e.target.value
    "popup-close: contain": (e) -> @unbind()

  getIndexByEvent: (e) ->
    $item = $ e.target
    $item.data "index"

  render: (state) ->
    @optionsContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", configsRadioModel.getState()
    @unbind()
    return false
