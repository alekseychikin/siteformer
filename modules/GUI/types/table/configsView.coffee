View = require "view.coffee"
Render = require "render"
modalWindowTemplate = require "types/table/modal"

module.exports = class TableConfigsView extends View
  constructor: (target, model) ->
    super target, model

    @modalContain = Render modalWindowTemplate, @contain[0]
    @render @model.state

  events:
    "submit: [data-role='configs-form']": "submitConfigsForm"
    "change: [data-role='configs-table-rows']": "changeConfigsTableRows"
    "change: [data-role='configs-table-columns']": "changeConfigsTableColumns"
    "change: [data-role='configs-table-cell']": (e) ->
      $cell = $ e.target
      @model.updateCellData ($cell.data "row"), ($cell.data "column"), ($cell.val())

    "keydown: [data-role='configs-table-rows']": (e) ->
      @changeConfigsTableRows e

      if e.keyCode == 13 then e.preventDefault()

    "keydown: [data-role='configs-table-columns']": (e) ->
      @changeConfigsTableColumns e

      if e.keyCode == 13 then e.preventDefault()

    "popup-close: contain": (e) -> @destroy()

  changeConfigsTableRows: (e) -> @model.updateRows e.target.value
  changeConfigsTableColumns: (e) -> @model.updateColumns e.target.value

  render: (state) -> @modalContain state

  submitConfigsForm: (e) ->
    @trigger "save-configs-modal", @model.getState()
    return false
