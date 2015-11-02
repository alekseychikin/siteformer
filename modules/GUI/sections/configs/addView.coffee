$ = require "../../libs/jquery-plugins.coffee"
View = require "../../libs/sf-fe-module/view.coffee"
Render = require "../../libs/sf-fe-module/render.coffee"
AddModel = require "./addModel.coffee"
module.exports = View
  debug: true
  contain: $ "@module-fields"
  model: AddModel
  events:
    "click: @btn-remove-field": "clickBtnRemoveField"
    "click: @btn-add-field": "clickBtnAddField"
    "change: @field-title": "changeFieldTitle"
    "change: @field-alias": "changeFieldAlias"
    "change: @field-type": "changeFieldType"

  initial: ->
    @tbodyContain = Render ($ "@tbody-module-fields"), "sections_configs_table-module-fields"

  renderFields: (state) ->
    @tbodyContain.render state

  clickBtnRemoveField: (e) -> AddModel.removeField @getRowIndex e

  clickBtnAddField: (e) -> AddModel.addEmptyField()

  getRowIndex: (e) ->
    $parent = ($ e.target).closest "[data-key]"
    return $parent.data "key"

  changeFieldTitle: (e) -> AddModel.updateTitle (@getRowIndex e), e.target.value

  changeFieldAlias: (e) -> AddModel.updateAlias (@getRowIndex e), e.target.value

  changeFieldType: (e) -> AddModel.updateType (@getRowIndex e), e.target.value
