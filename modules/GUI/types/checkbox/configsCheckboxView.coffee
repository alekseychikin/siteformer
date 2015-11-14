View = require "view.coffee"
Render = require "render.coffee"
configsCheckboxModel = require "checkbox/configsCheckboxModel.coffee"

module.exports = View "TypeCheckboxView",
  model: configsCheckboxModel

  initial: ->
    @optionsContain = Render ($ "@configs-checkbox-options-contain"), "types_checkbox_options"

  events:
    "submit: @configs-form": "submitConfigsForm"
    "popup-close: contain": (e) -> @unbind()
    "change: @configs-checkbox-num-options": (e) -> configsCheckboxModel.updateNumOptions e.target.value
    "change: @configs-checkbox-option": (e) -> configsCheckboxModel.updateDefaultDataOptionChecked (@getIndexByEvent e), e.target.checked
    "change: @configs-checkbox-option-label": (e) -> configsCheckboxModel.updateDefaultDataOption (@getIndexByEvent e), e.target.value

  getIndexByEvent: (e) ->
    $item = $ e.target
    $item.data "index"

  initialRender: (state) ->
    @configsCheckboxNumOptions = @contain.find "@configs-checkbox-num-options"
    @configsCheckboxNumOptions.val state.numOptions
    @renderDefaultData state

  renderDefaultData: (state) -> @optionsContain.render options: state.defaultData, currentValue: state.defaultValue

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", configsCheckboxModel.getState()
    @unbind()
    return false
