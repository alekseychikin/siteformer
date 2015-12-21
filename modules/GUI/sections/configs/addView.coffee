$ = require "jquery-plugins.coffee"
View = require "view.coffee"
Render = require "render"
Popup = require "popup"
AddModel = require "./addModel.coffee"
tableModuleFields = require "sections/configs/table-module-fields.tmpl.js"

module.exports = View "ConfigsAddView",
  debug: false
  contain: $ "@configs-add"
  model: AddModel
  events:
    "click: @btn-remove-field": (e) -> AddModel.removeField @getRowIndex e
    "click: @btn-add-field": (e) -> AddModel.addEmptyField()
    "change: @field-title": (e) -> AddModel.updateFieldTitle (@getRowIndex e), e.target.value
    "change: @field-alias": (e) -> AddModel.updateFieldAlias (@getRowIndex e), e.target.value
    "change: @field-type": (e) -> AddModel.updateFieldType (@getRowIndex e), e.target.value
    "change: @configs-add-title": (e) -> AddModel.updateTitle e.target.value
    "change: @configs-add-alias": (e) -> AddModel.updateAlias e.target.value
    "change: @configs-add-module": (e) -> AddModel.updateModule e.target.value
    "click: @btn-config-field": "clickBtnConfigField"
    "submit: @configs-add-form": "submitConfigsAddForm"

  initial: ->
    @tbodyContain = Render tableModuleFields, ($ "@tbody-module-fields")[0]

  render: (state) ->
    @tbodyContain state

  getRowIndex: (e) ->
    $parent = ($ e.target).closest "[data-key]"
    return $parent.data "key"

  clickBtnConfigField: (e) ->
    @trigger "open-configs-modal",
      @getRowIndex e
      AddModel.getFieldByIndex @getRowIndex e
      AddModel.getFields()

  submitConfigsAddForm: (e) ->
    AddModel.save()
    return false
