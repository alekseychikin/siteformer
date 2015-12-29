$ = require "jquery-plugins.coffee"
View = require "view.coffee"
Render = require "render"
Popup = require "popup"
tableModuleFields = require "sections/configs/table-module-fields.tmpl.js"

module.exports = View
  events:
    "click: @btn-remove-field": (e) -> @model.removeField @getRowIndex e
    "click: @btn-add-field": (e) -> @model.addEmptyField()
    "change: @field-title": (e) -> @model.updateFieldTitle (@getRowIndex e), e.target.value
    "change: @field-alias": (e) -> @model.updateFieldAlias (@getRowIndex e), e.target.value
    "change: @field-type": (e) -> @model.updateFieldType (@getRowIndex e), e.target.value
    "change: @configs-add-title": (e) -> @model.updateTitle e.target.value
    "change: @configs-add-alias": (e) -> @model.updateAlias e.target.value
    "change: @configs-add-module": (e) -> @model.updateModule e.target.value
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
      @model.getFieldByIndex @getRowIndex e
      @model.getFields()

  submitConfigsAddForm: (e) ->
    @model.save()
    return false
