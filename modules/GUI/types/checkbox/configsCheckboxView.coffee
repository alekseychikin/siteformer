View = require "view.coffee"
configsCheckboxModel = require "checkbox/configsCheckboxModel.coffee"
Render = require "render"
modalWindowTemplate = require "types/checkbox/modal.tmpl.js"

module.exports = View "TypeCheckboxView",
  model: configsCheckboxModel

  initial: ->
    @modalContain = Render modalWindowTemplate, @contain[0]

  events:
    "submit: @configs-form": "submitConfigsForm"
    "change: @configs-checkbox-num-options": (e) -> configsCheckboxModel.updateNumOptions e.target.value
    "change: @configs-checkbox-option": (e) -> configsCheckboxModel.updateDefaultDataOptionChecked (@getIndexByEvent e), e.target.checked
    "change: @configs-checkbox-option-label": (e) -> configsCheckboxModel.updateDefaultDataOption (@getIndexByEvent e), e.target.value
    "popup-close: contain": (e) -> @unbind()

  getIndexByEvent: (e) ->
    $item = $ e.target
    $item.data "index"

  render: (state) ->
    @modalContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", configsCheckboxModel.getState()
    @unbind()
    return false
