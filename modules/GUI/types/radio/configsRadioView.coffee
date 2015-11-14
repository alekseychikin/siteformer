View = require "view.coffee"
Render = require "render.coffee"
configsRadioModel = require "radio/configsRadioModel.coffee"

module.exports = View "TypeRadioView",
  model: configsRadioModel

  initial: ->
    @optionsContain = Render ($ "@configs-radio-options-contain"), "types_radio_options"
    @configsRadioNumOptions = @contain.find "@configs-radio-num-options"

  events:
    "submit: @configs-form": "submitConfigsForm"
    "popup-close: contain": (e) -> @unbind()
    "change: @configs-radio-num-options": (e) -> configsRadioModel.updateNumOptions e.target.value
    "change: @configs-radio-option": (e) -> configsRadioModel.updateDefaultValue e.target.value
    "change: @configs-radio-option-label": (e) -> configsRadioModel.updateDefaultDataOption (@getIndexByEvent e), e.target.value

  getIndexByEvent: (e) ->
    $item = $ e.target
    $item.data "index"

  initialRender: (state) ->
    @configsRadioNumOptions.val state.numOptions
    @renderDefaultValue state
    @renderDefaultData state

  renderDefaultData: (state) -> @optionsContain.render options: state.defaultData, currentValue: state.defaultValue

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", configsRadioModel.getState()
    @unbind()
    return false

  renderDefaultValue: (state) ->
    @contain.find "@configs-radio-option"
    .filter "[value=#{state.defaultValue}]"
    .prop "checked", true
